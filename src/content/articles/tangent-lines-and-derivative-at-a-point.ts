import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './tangent-lines-and-derivative-at-a-point.meta'

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
    T`**The tangent line to a graph at a point is the straight line that fits the graph there, and its slope is the derivative at that point: the limit of the slopes of secant lines as the second point slides toward the first, $f'(a)=\lim_{h\to0}\frac{f(a+h)-f(a)}{h}$.** The line is $y=f(a)+f'(a)(x-a)$. The derivative is the instantaneous rate of change, and it fails to exist at a corner, a cusp, a jump or a vertical tangent.`,
    T`**Garis singgung grafik di suatu titik adalah garis lurus yang paling cocok dengan grafik di titik itu, dan gradiennya adalah turunan di titik tersebut: limit gradien garis potong ketika titik kedua bergeser mendekati titik pertama, $f'(a)=\lim_{h\to0}\frac{f(a+h)-f(a)}{h}$.** Garisnya $y=f(a)+f'(a)(x-a)$. Turunan adalah laju perubahan sesaat, dan ia tidak ada pada sudut tajam, cusp, lompatan, atau garis singgung tegak.`,
  ),

  keyPoints: [
    L(
      T`A secant line joins two points of a graph; its slope is the difference quotient $\frac{f(a+h)-f(a)}{h}$, the average rate of change over a step of size $h$.`,
      T`Garis potong menghubungkan dua titik pada grafik; gradiennya adalah hasil bagi selisih $\frac{f(a+h)-f(a)}{h}$, laju perubahan rata-rata pada langkah sebesar $h$.`,
    ),
    L(
      T`The derivative $f'(a)$ is the limit of the difference quotient as $h\to0$; it is the slope of the tangent line and the instantaneous rate of change at $x=a$.`,
      T`Turunan $f'(a)$ adalah limit hasil bagi selisih saat $h\to0$; ia adalah gradien garis singgung dan laju perubahan sesaat di $x=a$.`,
    ),
    L(
      T`The tangent line at $x=a$ is $y=f(a)+f'(a)(x-a)$; the normal line is perpendicular to it, with slope $-1/f'(a)$.`,
      T`Garis singgung di $x=a$ adalah $y=f(a)+f'(a)(x-a)$; garis normal tegak lurus terhadapnya, dengan gradien $-1/f'(a)$.`,
    ),
    L(
      T`A tangent line does not just touch once: it can meet the curve again, and at an inflection point it crosses the curve. It is a local idea, about direction.`,
      T`Garis singgung tidak sekadar menyentuh sekali: ia dapat bertemu kurva lagi, dan di titik belok ia memotong kurva. Gagasannya lokal, tentang arah.`,
    ),
    L(
      T`Zooming in on a differentiable graph makes it look straight; at a corner, a cusp or a jump it never does, and there the derivative does not exist.`,
      T`Memperbesar grafik yang terdiferensialkan membuatnya tampak lurus; pada sudut tajam, cusp, atau lompatan ia tidak pernah lurus, dan di sana turunan tidak ada.`,
    ),
    L(
      T`Differentiable at a point implies continuous there, but not the other way around; in code a central difference with $h\approx10^{-5}$ is a good numerical derivative.`,
      T`Terdiferensialkan di suatu titik berarti kontinu di sana, tetapi tidak sebaliknya; dalam kode selisih terpusat dengan $h\approx10^{-5}$ adalah turunan numerik yang baik.`,
    ),
  ],

  sections: [
    /* ---------------------------------------------------------------- tangent */
    {
      id: 'what-is-a-tangent',
      heading: L('What is a tangent line to a curve?', 'Apa itu garis singgung pada sebuah kurva?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A tangent line to a curve at a point is the straight line that fits the curve best at that point: it passes through the point and points in the same direction as the curve there.** Close to the point the curve and its tangent line are almost the same thing, which is what the zoom tool below shows: the closer you look, the straighter the curve becomes, until you cannot tell it from its tangent.

The idea comes from circles, where a tangent touches the circle at one point and is perpendicular to the radius (see [chords and tangents](article:circles#chords-and-tangents)). For a general curve "touches at exactly one point" is not the right definition, for three reasons:

- **A tangent can meet the curve again.** The line $y=-2$ is the tangent to $y=x^3-3x$ at $x=1$, and it meets the curve a second time at $x=-2$.
- **A line that meets a curve once need not be a tangent.** The vertical line $x=1$ meets the parabola $y=x^2$ only once, yet the parabola at $(1,1)$ climbs with slope $2$; its tangent there is $y=2x-1$.
- **A tangent can cross the curve.** At the inflection point $x=0$ of $y=x^3-3x$ the tangent $y=-3x$ passes from one side of the curve to the other.

So the tangent is a *local* idea. It says which way the curve is heading at the point, not how the line meets the curve far away. To make it precise we need two steps: the slope of a *secant line*, which joins two points of the curve, and then what happens to that slope when the two points merge. That is the next section.

Try it: pick a function and a point, then zoom in.`,
            T`**Garis singgung pada sebuah kurva di suatu titik adalah garis lurus yang paling cocok dengan kurva di titik itu: ia melalui titik tersebut dan searah dengan kurva di sana.** Di dekat titik itu, kurva dan garis singgungnya hampir sama, yaitu yang diperlihatkan alat perbesaran di bawah: makin dekat kamu melihat, makin lurus kurva itu, sampai kamu tidak dapat membedakannya dari garis singgungnya.

Gagasannya berasal dari lingkaran, tempat garis singgung menyentuh lingkaran di satu titik dan tegak lurus terhadap jari-jari (lihat [tali busur dan garis singgung](article:circles#chords-and-tangents)). Untuk kurva umum "menyentuh di tepat satu titik" bukan definisi yang tepat, karena tiga hal:

- **Garis singgung dapat bertemu kurva lagi.** Garis $y=-2$ adalah garis singgung $y=x^3-3x$ di $x=1$, dan ia bertemu kurva untuk kedua kalinya di $x=-2$.
- **Garis yang bertemu kurva satu kali belum tentu garis singgung.** Garis tegak $x=1$ bertemu parabola $y=x^2$ hanya sekali, tetapi parabola di $(1,1)$ naik dengan gradien $2$; garis singgungnya di sana adalah $y=2x-1$.
- **Garis singgung dapat memotong kurva.** Di titik belok $x=0$ pada $y=x^3-3x$ garis singgung $y=-3x$ melintas dari satu sisi kurva ke sisi lainnya.

Jadi garis singgung adalah gagasan *lokal*. Ia menyatakan ke mana kurva menuju di titik itu, bukan bagaimana garis bertemu kurva di tempat yang jauh. Untuk membuatnya tepat kita memerlukan dua langkah: gradien *garis potong*, yang menghubungkan dua titik pada kurva, lalu apa yang terjadi pada gradien itu ketika kedua titik berimpit. Itulah bagian berikutnya.

Cobalah: pilih sebuah fungsi dan titik, lalu perbesar.`,
          ),
        },
        { kind: 'widget', name: 'tanzoom' },
      ],
    },

    /* ----------------------------------------------------- secants and limits */
    {
      id: 'secants-and-limits',
      heading: L('How do you find the slope of a tangent line?', 'Bagaimana mencari gradien garis singgung?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The slope of the tangent line at $x=a$ is the limit of the slopes of the secant lines through $(a,f(a))$ and a second point $(a+h,f(a+h))$, as $h$ shrinks toward $0$.** A *secant line* is a line through two points of a curve. Its slope is rise over run, the *difference quotient*:
$$\frac{f(a+h)-f(a)}{h}.$$
Take $f(x)=x^2$ at $a=1$. [Expanding the bracket](article:algebraic-expressions#expand) gives $f(1+h)-f(1)=(1+h)^2-1=2h+h^2$, and [taking out the common factor](article:algebraic-expressions#factor) $h$ gives
$$\frac{(1+h)^2-1}{h}=\frac{h(2+h)}{h}=2+h\qquad(h\ne0).$$
Now let the second point approach $(1,1)$:

- From the right: $h=1$ gives slope $3$, $h=0.1$ gives $2.1$, $h=0.01$ gives $2.01$, $h=0.001$ gives $2.001$.
- From the left: $h=-0.1$ gives $1.9$, $h=-0.01$ gives $1.99$, $h=-0.001$ gives $1.999$.

The slopes close in on $2$ from both sides, and we write $\lim_{h\to0}(2+h)=2$. That limit is the slope of the tangent line.

Why not simply put $h=0$ in the quotient? Because it gives $\frac00$, which has no value: the two points would be the same point and there is no line through "two" points. The limit does not ask for the value at $h=0$; it asks what the quotient *approaches* when $h$ is near $0$ but not $0$. After cancelling $h$ the answer is plain.

Two details matter. The limit has to exist from *both* sides, because the second point may lie to the left ($h<0$) or to the right ($h>0$). And when it exists it gives the definition:

**The tangent line to the graph of $f$ at $P=(a,f(a))$ is the line through $P$ with slope $m=\lim_{h\to0}\frac{f(a+h)-f(a)}{h}$, provided this limit exists.** If the quotient grows without bound the line is vertical, which is covered below.`,
            T`**Gradien garis singgung di $x=a$ adalah limit gradien garis potong melalui $(a,f(a))$ dan titik kedua $(a+h,f(a+h))$, saat $h$ mengecil menuju $0$.** *Garis potong* adalah garis yang melalui dua titik pada kurva. Gradiennya adalah kenaikan per jarak mendatar, yaitu *hasil bagi selisih*:
$$\frac{f(a+h)-f(a)}{h}.$$
Ambil $f(x)=x^2$ di $a=1$. [Menjabarkan kurung](article:algebraic-expressions#expand) memberi $f(1+h)-f(1)=(1+h)^2-1=2h+h^2$, dan [mengeluarkan faktor persekutuan](article:algebraic-expressions#factor) $h$ memberi
$$\frac{(1+h)^2-1}{h}=\frac{h(2+h)}{h}=2+h\qquad(h\ne0).$$
Sekarang biarkan titik kedua mendekati $(1,1)$:

- Dari kanan: $h=1$ memberi gradien $3$, $h=0{,}1$ memberi $2{,}1$, $h=0{,}01$ memberi $2{,}01$, $h=0{,}001$ memberi $2{,}001$.
- Dari kiri: $h=-0{,}1$ memberi $1{,}9$, $h=-0{,}01$ memberi $1{,}99$, $h=-0{,}001$ memberi $1{,}999$.

Gradien-gradien itu mendekati $2$ dari kedua sisi, dan kita tulis $\lim_{h\to0}(2+h)=2$. Limit itu adalah gradien garis singgung.

Mengapa tidak langsung memasukkan $h=0$ ke hasil bagi? Karena hasilnya $\frac00$, yang tidak bernilai: kedua titik menjadi titik yang sama dan tidak ada garis yang melalui "dua" titik. Limit tidak menanyakan nilai di $h=0$; ia menanyakan apa yang *didekati* hasil bagi ketika $h$ dekat $0$ tetapi bukan $0$. Setelah $h$ dicoret jawabannya jelas.

Dua hal penting. Limit itu harus ada dari *kedua* sisi, karena titik kedua dapat berada di kiri ($h<0$) atau di kanan ($h>0$). Dan bila ada, ia memberi definisinya:

**Garis singgung grafik $f$ di $P=(a,f(a))$ adalah garis melalui $P$ dengan gradien $m=\lim_{h\to0}\frac{f(a+h)-f(a)}{h}$, asalkan limit ini ada.** Bila hasil bagi membesar tanpa batas, garisnya tegak, yang dibahas di bawah.`,
          ),
        },
        {
          kind: 'figure',
          figure: {
            dim: 2,
            ticks: true,
            xSpan: [-0.5, 2.6],
            ySpan: [-0.8, 4.6],
            aspect: 0.6,
            items: [
              { t: 'curve', f: 'x^2', color: 'a' },
              { t: 'curve', f: '3*x-2', color: 'b', dashed: true },
              { t: 'curve', f: '2.5*x-1.5', color: 'b', dashed: true },
              { t: 'curve', f: '2*x-1', color: 'result' },
              { t: 'point', at: [1, 1], label: 'P', color: 'result' },
              { t: 'point', at: [2, 4], label: 'Q1', color: 'b' },
              { t: 'point', at: [1.5, 2.25], label: 'Q2', color: 'b' },
            ],
            caption: L(
              'On y = x², the secants through P = (1, 1) and Q1 = (2, 4) or Q2 = (1.5, 2.25) have slopes 3 and 2.5 (dashed); as the second point slides toward P the slope falls to 2, the slope of the tangent y = 2x − 1 (solid).',
              'Pada y = x², garis potong melalui P = (1, 1) dan Q1 = (2, 4) atau Q2 = (1,5; 2,25) bergradien 3 dan 2,5 (putus-putus); saat titik kedua bergeser ke P gradiennya turun menjadi 2, gradien garis singgung y = 2x − 1 (utuh).',
            ),
          },
        },
        { kind: 'widget', name: 'tansecant' },
      ],
    },

    /* ------------------------------------------------- derivative at a point */
    {
      id: 'derivative-at-a-point',
      heading: L('What is the derivative of a function at a point?', 'Apa itu turunan fungsi di suatu titik?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The derivative of $f$ at $a$, written $f'(a)$, is the limit of the difference quotient, $f'(a)=\lim_{h\to0}\frac{f(a+h)-f(a)}{h}$, when that limit exists; it is the slope of the tangent line at $x=a$ and the instantaneous rate of change of $f$ there.** Writing $x=a+h$ gives the same limit in a second form,
$$f'(a)=\lim_{x\to a}\frac{f(x)-f(a)}{x-a},$$
which is often handier when the function has a root in it. The derivative at a point is a *number*. Other notations for it are $\frac{df}{dx}\bigg|_{x=a}$ and $\frac{dy}{dx}\bigg|_{x=a}$ (Leibniz). A function is *differentiable at $a$* when the limit exists.

Three examples show the three usual algebra tricks.

**1. A polynomial: expand and cancel $h$.** For $f(x)=x^3-3x$ at $a=2$ we have $f(2)=2$, and $(2+h)^3=8+12h+6h^2+h^3$, so subtracting $f(2)$ leaves
$$\frac{f(2+h)-f(2)}{h}=\frac{9h+6h^2+h^3}{h}.$$
Cancelling $h$ gives $9+6h+h^2$, which tends to $9$ as $h\to0$. So $f'(2)=9$, and the tangent line there is steep.

**2. A fraction: combine over a common denominator.** For $f(x)=\frac1x$ at $a=2$, using [adding fractions](article:rational-numbers#add-subtract-fractions),
$$\frac{\frac1{2+h}-\frac12}{h}=\frac{2-(2+h)}{2(2+h)\,h}=\frac{-1}{2(2+h)}\to-\frac14.$$
The same steps at any $a\ne0$ give $f'(a)=-\frac{1}{a^2}$: the slope is negative everywhere, steep near $x=0$ and flattening out far away, and it is $-\frac14$ at both $a=2$ and $a=-2$, so there are two tangents of that slope.

**3. A root: multiply by the conjugate.** For $f(x)=\sqrt x$ at $a=4$, by [rationalizing](article:exponents-and-radicals#rationalise) the numerator: multiplying top and bottom by $\sqrt{4+h}+2$ turns the numerator into $(4+h)-4=h$, so
$$\frac{\sqrt{4+h}-2}{h}=\frac{h}{h\left(\sqrt{4+h}+2\right)}.$$
Cancelling $h$ leaves $\frac{1}{\sqrt{4+h}+2}$, which tends to $\frac14$ as $h\to0$.

The quotient can be handled from one side at a time. The *right-hand derivative* uses $h\to0^+$ and the *left-hand derivative* uses $h\to0^-$; $f$ is differentiable at $a$ exactly when both exist and are equal. Doing the same limit at every $a$ at once gives a new function, the derivative function $f'$, and its rules are shortcuts for this limit; the definition above is what they are shortcuts *for*.`,
            T`**Turunan $f$ di $a$, ditulis $f'(a)$, adalah limit hasil bagi selisih, $f'(a)=\lim_{h\to0}\frac{f(a+h)-f(a)}{h}$, bila limit itu ada; ia adalah gradien garis singgung di $x=a$ dan laju perubahan sesaat $f$ di sana.** Menulis $x=a+h$ memberi limit yang sama dalam bentuk kedua,
$$f'(a)=\lim_{x\to a}\frac{f(x)-f(a)}{x-a},$$
yang sering lebih praktis bila fungsinya memuat akar. Turunan di suatu titik adalah sebuah *bilangan*. Notasi lainnya adalah $\frac{df}{dx}\bigg|_{x=a}$ dan $\frac{dy}{dx}\bigg|_{x=a}$ (Leibniz). Fungsi *terdiferensialkan di $a$* bila limitnya ada.

Tiga contoh memperlihatkan tiga trik aljabar yang biasa dipakai.

**1. Polinomial: jabarkan dan coret $h$.** Untuk $f(x)=x^3-3x$ di $a=2$ kita punya $f(2)=2$, dan $(2+h)^3=8+12h+6h^2+h^3$, sehingga setelah dikurangi $f(2)$ tersisa
$$\frac{f(2+h)-f(2)}{h}=\frac{9h+6h^2+h^3}{h}.$$
Mencoret $h$ memberi $9+6h+h^2$, yang menuju $9$ saat $h\to0$. Jadi $f'(2)=9$, dan garis singgung di sana curam.

**2. Pecahan: samakan penyebut.** Untuk $f(x)=\frac1x$ di $a=2$, dengan [penjumlahan pecahan](article:rational-numbers#add-subtract-fractions),
$$\frac{\frac1{2+h}-\frac12}{h}=\frac{2-(2+h)}{2(2+h)\,h}=\frac{-1}{2(2+h)}\to-\frac14.$$
Langkah yang sama di sembarang $a\ne0$ memberi $f'(a)=-\frac{1}{a^2}$: gradiennya negatif di mana-mana, curam di dekat $x=0$ dan melandai di tempat yang jauh, dan bernilai $-\frac14$ di $a=2$ maupun $a=-2$, sehingga ada dua garis singgung dengan gradien itu.

**3. Akar: kalikan dengan sekawan.** Untuk $f(x)=\sqrt x$ di $a=4$, dengan [merasionalkan](article:exponents-and-radicals#rationalise) pembilang: mengalikan pembilang dan penyebut dengan $\sqrt{4+h}+2$ mengubah pembilang menjadi $(4+h)-4=h$, sehingga
$$\frac{\sqrt{4+h}-2}{h}=\frac{h}{h\left(\sqrt{4+h}+2\right)}.$$
Mencoret $h$ menyisakan $\frac{1}{\sqrt{4+h}+2}$, yang menuju $\frac14$ saat $h\to0$.

Hasil bagi dapat ditangani satu sisi demi satu sisi. *Turunan kanan* memakai $h\to0^+$ dan *turunan kiri* memakai $h\to0^-$; $f$ terdiferensialkan di $a$ tepat bila keduanya ada dan sama. Melakukan limit yang sama di setiap $a$ sekaligus menghasilkan fungsi baru, fungsi turunan $f'$, dan aturan-aturannya adalah jalan pintas untuk limit ini; definisi di atas adalah apa yang dipersingkat oleh aturan-aturan itu.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------- the tangent line itself */
    {
      id: 'tangent-line-equation',
      heading: L('How do you write the equation of a tangent line?', 'Bagaimana menulis persamaan garis singgung?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The tangent line to $y=f(x)$ at $x=a$ is $y=f(a)+f'(a)(x-a)$, the point-slope form of the line through $(a,f(a))$ with slope $f'(a)$.** Three steps: find the height $f(a)$, find the slope $f'(a)$ from the limit, and put both into the formula. Three examples:

- $f(x)=x^2$ at $a=1$: $f(1)=1$ and $f'(1)=2$, so $y=1+2(x-1)=2x-1$.
- $f(x)=\frac1x$ at $a=2$: $f(2)=\frac12$ and $f'(2)=-\frac14$, so $y=\frac12-\frac14(x-2)=-\frac x4+1$.
- $f(x)=x^3-3x$ at $a=1$: $f(1)=-2$ and $f'(1)=0$, so $y=-2$, a *horizontal* tangent (slope $0$).

The *normal line* at the point is the line through it at right angles to the tangent. Its slope is $-\frac{1}{f'(a)}$ when $f'(a)\ne0$, since the slopes of perpendicular lines multiply to $-1$; when the tangent is horizontal the normal is the vertical line $x=a$. For $y=x^2$ at $(1,1)$ the normal is $y=1-\frac12(x-1)=-\frac x2+\frac32$.

The tangent line also has an algebraic signature that does not mention limits. Subtract the tangent line from the function: the difference $f(x)-\big(f(a)+f'(a)(x-a)\big)$ is zero at $x=a$, and for a polynomial it has a *double* root there. For $x^3-3x$ at $a=1$ the difference is $x^3-3x+2=(x-1)^2(x+2)$: the double root at $1$ is the tangency, and the simple root at $x=-2$ is the second place where the tangent meets the curve. At the inflection point $a=0$ the difference is $x^3$, a triple root, which is why the tangent crosses the curve there.

The same idea finds tangents *through an outside point*. To draw tangents to $y=x^2$ from $(1,-3)$, ask for which $a$ the tangent at $a$ passes through that point: $a^2+2a(1-a)=-3$, which simplifies to $a^2-2a-3=0$, so $(a-3)(a+1)=0$. The tangent lines touch the parabola at $a=3$ and $a=-1$: $y=6x-9$ and $y=-2x-1$. (Both pass through $(1,-3)$: $6-9=-3$ and $-2-1=-3$.)

A tangent line is also an approximation. Near $a$, $f(x)\approx f(a)+f'(a)(x-a)$. With $f(x)=\sqrt x$, $a=4$ and slope $\frac14$, we get $\sqrt{4.1}\approx2+\frac14\cdot0.1=2.025$; the true value is $2.02485\ldots$, so the error is under $0.0002$. This is one of the ways of [approximating an irrational number](article:irrational-numbers#rational-approximations).

Try it: type a polynomial and a point, or a point outside the curve. Every number is an exact fraction.`,
            T`**Garis singgung $y=f(x)$ di $x=a$ adalah $y=f(a)+f'(a)(x-a)$, bentuk titik-gradien dari garis yang melalui $(a,f(a))$ dengan gradien $f'(a)$.** Tiga langkah: cari tinggi $f(a)$, cari gradien $f'(a)$ dari limit, lalu masukkan keduanya ke rumus. Tiga contoh:

- $f(x)=x^2$ di $a=1$: $f(1)=1$ dan $f'(1)=2$, sehingga $y=1+2(x-1)=2x-1$.
- $f(x)=\frac1x$ di $a=2$: $f(2)=\frac12$ dan $f'(2)=-\frac14$, sehingga $y=\frac12-\frac14(x-2)=-\frac x4+1$.
- $f(x)=x^3-3x$ di $a=1$: $f(1)=-2$ dan $f'(1)=0$, sehingga $y=-2$, garis singgung *mendatar* (gradien $0$).

*Garis normal* di titik itu adalah garis yang melaluinya dan tegak lurus terhadap garis singgung. Gradiennya $-\frac{1}{f'(a)}$ bila $f'(a)\ne0$, karena hasil kali gradien dua garis yang saling tegak lurus adalah $-1$; bila garis singgungnya mendatar, garis normalnya adalah garis tegak $x=a$. Untuk $y=x^2$ di $(1,1)$ garis normalnya $y=1-\frac12(x-1)=-\frac x2+\frac32$.

Garis singgung juga memiliki ciri aljabar yang tidak menyebut limit. Kurangkan garis singgung dari fungsinya: selisih $f(x)-\big(f(a)+f'(a)(x-a)\big)$ bernilai nol di $x=a$, dan untuk polinomial ia memiliki akar *ganda* di sana. Untuk $x^3-3x$ di $a=1$ selisihnya $x^3-3x+2=(x-1)^2(x+2)$: akar ganda di $1$ adalah titik singgungnya, dan akar tunggal di $x=-2$ adalah tempat kedua garis singgung bertemu kurva. Di titik belok $a=0$ selisihnya $x^3$, akar rangkap tiga, itulah sebabnya garis singgung memotong kurva di sana.

Gagasan yang sama mencari garis singgung *melalui titik di luar kurva*. Untuk menggambar garis singgung pada $y=x^2$ dari $(1,-3)$, tanyakan untuk $a$ berapa garis singgung di $a$ melalui titik itu: $a^2+2a(1-a)=-3$, yang menyederhana menjadi $a^2-2a-3=0$, jadi $(a-3)(a+1)=0$. Garis singgungnya menyentuh parabola di $a=3$ dan $a=-1$: $y=6x-9$ dan $y=-2x-1$. (Keduanya melalui $(1,-3)$: $6-9=-3$ dan $-2-1=-3$.)

Garis singgung juga berguna sebagai hampiran. Di dekat $a$, $f(x)\approx f(a)+f'(a)(x-a)$. Dengan $f(x)=\sqrt x$, $a=4$, dan gradien $\frac14$, kita peroleh $\sqrt{4{,}1}\approx2+\frac14\cdot0{,}1=2{,}025$; nilai sebenarnya $2{,}02485\ldots$, sehingga galatnya di bawah $0{,}0002$. Ini salah satu cara [menghampiri bilangan irasional](article:irrational-numbers#rational-approximations).

Cobalah: ketik sebuah polinomial dan titik, atau titik di luar kurva. Setiap bilangan adalah pecahan eksak.`,
          ),
        },
        {
          kind: 'figure',
          figure: {
            dim: 2,
            ticks: true,
            xSpan: [-3, 3],
            ySpan: [-4.5, 4.5],
            aspect: 0.67,
            items: [
              { t: 'curve', f: 'x^3-3*x', color: 'a' },
              { t: 'hline', y: -2, color: 'result' },
              { t: 'point', at: [1, -2], label: 'A', color: 'result' },
              { t: 'point', at: [-2, -2], label: 'B', color: 'b' },
            ],
            caption: L(
              'The horizontal line y = −2 is the tangent to y = x³ − 3x at A = (1, −2): a double root of the difference. It also meets the curve at the simple root B = (−2, −2).',
              'Garis mendatar y = −2 adalah garis singgung y = x³ − 3x di A = (1, −2): akar ganda dari selisih. Ia juga bertemu kurva di akar tunggal B = (−2, −2).',
            ),
          },
        },
        { kind: 'widget', name: 'tanline' },
      ],
    },

    /* ----------------------------------------------------------- rates of change */
    {
      id: 'rates-of-change',
      heading: L('What does the derivative at a point mean in real life?', 'Apa arti turunan di suatu titik dalam kehidupan nyata?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The derivative at a point is the instantaneous rate of change: how fast the output is changing per unit of input at that exact moment, in units of $y$ per unit of $x$.** The difference quotient is the *average* rate of change over a step of size $h$, and the derivative is what the average settles on as the step shrinks to nothing.

**Speed.** Let a ball dropped from a tower fall $s(t)=4.9t^2$ meters in $t$ seconds. Its average speed from $t=1$ to $t=1+h$ is
$$\frac{4.9(1+h)^2-4.9}{h}=9.8+4.9h.$$
Over a whole second ($h=1$) that is $14.7$ m/s, over half a second $12.25$ m/s, over $0.1$ s it is $10.29$ m/s, over $0.01$ s it is $9.849$ m/s, and as $h\to0$ it tends to $9.8$ m/s. That number, $s'(1)=9.8$ m/s, is the reading on the speedometer at $t=1$: an average needs a time interval, a speed at an instant needs the limit.

**Cost.** If making $q$ items costs $C(q)=2q^2+30q+400$ dollars, then $C(11)-C(10)=972-900=72$ dollars is the extra cost of the 11th item, which is a difference quotient with $h=1$. The derivative $C'(10)=4\cdot10+30=70$ is the *marginal cost* at $10$ items: $70$ dollars per additional item, close to the exact extra of $72$ dollars. Economists use the derivative as a quick estimate of the cost of one more.

**Reading the sign.** If $f'(a)>0$ the graph is rising at $a$, if $f'(a)<0$ it is falling, and if $f'(a)=0$ the tangent is horizontal. A horizontal tangent can be a top, a bottom, or neither: $y=x^3$ has $f'(0)=0$ but keeps rising through $0$.

**Constant rate.** For a straight line the rate is the same everywhere, and the tangent line is the line itself. The equal steps of an [arithmetic sequence](article:arithmetic-sequences-and-series#what-is-an-arithmetic-sequence) are the same thing in discrete form: a constant difference is a constant slope. A curve has a different slope at each point, and the derivative is what lets you ask for it one point at a time.

**Units.** The derivative has the units of $y$ divided by the units of $x$: meters per second for distance against time, dollars per item for cost against quantity. A road that climbs $8$ meters for each $100$ meters along the ground has slope $0.08$, an 8% grade.

Motion along a line (velocity, speed, acceleration, jerk, free fall) and marginal cost and revenue are worked out in full in [the derivative as a rate of change](article:the-derivative-as-a-rate-of-change#motion-along-a-line).`,
            T`**Turunan di suatu titik adalah laju perubahan sesaat: seberapa cepat keluaran berubah per satuan masukan pada saat yang tepat itu, dalam satuan $y$ per satuan $x$.** Hasil bagi selisih adalah laju perubahan *rata-rata* pada langkah sebesar $h$, dan turunan adalah nilai yang didekati rata-rata itu saat langkahnya mengecil menjadi nol.

**Kecepatan.** Misalkan bola yang dijatuhkan dari menara jatuh sejauh $s(t)=4{,}9t^2$ meter dalam $t$ detik. Kecepatan rata-ratanya dari $t=1$ sampai $t=1+h$ adalah
$$\frac{4{,}9(1+h)^2-4{,}9}{h}=9{,}8+4{,}9h.$$
Dalam satu detik penuh ($h=1$) itu $14{,}7$ m/s, dalam setengah detik $12{,}25$ m/s, dalam $0{,}1$ detik $10{,}29$ m/s, dalam $0{,}01$ detik $9{,}849$ m/s, dan saat $h\to0$ ia menuju $9{,}8$ m/s. Bilangan itu, $s'(1)=9{,}8$ m/s, adalah angka pada spidometer di $t=1$: rata-rata memerlukan selang waktu, kecepatan pada satu saat memerlukan limit.

**Biaya.** Jika membuat $q$ barang berbiaya $C(q)=2q^2+30q+400$ ribu rupiah, maka $C(11)-C(10)=972-900=72$ ribu rupiah, yaitu Rp72.000, adalah tambahan biaya barang ke-11, yang merupakan hasil bagi selisih dengan $h=1$. Turunan $C'(10)=4\cdot10+30=70$ adalah *biaya marjinal* pada $10$ barang: Rp70.000 per tambahan satu barang, dekat dengan tambahan eksak Rp72.000. Para ekonom memakai turunan sebagai perkiraan cepat biaya satu barang lagi.

**Membaca tandanya.** Jika $f'(a)>0$ grafik naik di $a$, jika $f'(a)<0$ grafik turun, dan jika $f'(a)=0$ garis singgungnya mendatar. Garis singgung mendatar dapat berupa puncak, dasar, atau bukan keduanya: $y=x^3$ memiliki $f'(0)=0$ tetapi tetap naik melewati $0$.

**Laju tetap.** Untuk garis lurus laju perubahannya sama di mana-mana, dan garis singgungnya adalah garis itu sendiri. Langkah-langkah sama pada [barisan aritmetika](article:arithmetic-sequences-and-series#what-is-an-arithmetic-sequence) adalah hal yang sama dalam bentuk diskret: beda tetap adalah gradien tetap. Kurva memiliki gradien yang berbeda di tiap titik, dan turunan memungkinkan kamu menanyakannya satu titik demi satu titik.

**Satuan.** Turunan bersatuan $y$ dibagi satuan $x$: meter per detik untuk jarak terhadap waktu, rupiah per barang untuk biaya terhadap jumlah. Jalan yang naik $8$ meter untuk setiap $100$ meter sepanjang tanah memiliki gradien $0{,}08$, tanjakan 8%.

Gerak sepanjang garis lurus (kecepatan, laju, percepatan, sentakan, jatuh bebas) serta biaya dan pendapatan marjinal diuraikan lengkap dalam [turunan sebagai laju perubahan](article:the-derivative-as-a-rate-of-change#motion-along-a-line).`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------- no derivative */
    {
      id: 'no-derivative',
      heading: L('When does a function have no derivative at a point?', 'Kapan sebuah fungsi tidak memiliki turunan di suatu titik?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A function has no derivative at a point when the limit of the difference quotient does not exist, which happens at a corner, a cusp, a jump, a vertical tangent, or where the graph wiggles without settling down.** The widget below shows each case at $x=0$ with the slopes of secants from the left and from the right. Here is what to look for:

- **A corner.** For $f(x)=|x|$ the secant slopes are $-1$ from the left and $+1$ from the right. They disagree, so there is no tangent line, and no amount of zoom straightens a corner.
- **A cusp.** For $f(x)=x^{2/3}$ the slopes from the right grow to $+\infty$ and from the left to $-\infty$: two vertical directions that point opposite ways.
- **A jump.** A function that jumps is not even continuous there, and the difference quotient blows up on at least one side.
- **A vertical tangent.** For $f(x)=x^{1/3}$ the slopes grow to $+\infty$ from both sides: the tangent line is the vertical line $x=0$. The graph has a tangent line, but its slope is not a number, so $f'(0)$ does not exist.
- **Endless wiggling.** For $f(x)=x\sin\frac1x$ the secant slope is $\sin\frac1h$, which keeps swinging between $-1$ and $1$ and never settles.

Not every graph that bends at a point has a corner, either. $f(x)=x|x|$ looks as if it might kink at $0$, but its slopes tend to $0$ from both sides, so $f'(0)=0$ and the tangent is horizontal.

**Differentiable implies continuous.** If $f'(a)$ exists then $f(a+h)-f(a)=\frac{f(a+h)-f(a)}{h}\cdot h$, which tends to $f'(a)\cdot0=0$, so $f(a+h)\to f(a)$. That rules out every jump. The converse is false: $|x|$ is continuous everywhere and not differentiable at $0$. So continuity is *necessary* for a derivative but not *sufficient*.

A practical test follows from the zoom: a graph that is differentiable at a point looks like a straight line when you zoom in on that point, and one that is not does not.`,
            T`**Sebuah fungsi tidak memiliki turunan di suatu titik bila limit hasil bagi selisih tidak ada, yang terjadi pada sudut tajam, cusp, lompatan, garis singgung tegak, atau tempat grafik berosilasi tanpa menetap.** Widget di bawah memperlihatkan tiap kasus di $x=0$ dengan gradien garis potong dari kiri dan dari kanan. Inilah yang perlu diperhatikan:

- **Sudut tajam.** Untuk $f(x)=|x|$ gradien garis potong adalah $-1$ dari kiri dan $+1$ dari kanan. Keduanya berbeda, sehingga tidak ada garis singgung, dan sebesar apa pun perbesaran tidak meluruskan sudut tajam.
- **Cusp.** Untuk $f(x)=x^{2/3}$ gradien dari kanan membesar ke $+\infty$ dan dari kiri ke $-\infty$: dua arah tegak yang berlawanan.
- **Lompatan.** Fungsi yang melompat bahkan tidak kontinu di sana, dan hasil bagi selisihnya membesar tanpa batas pada setidaknya satu sisi.
- **Garis singgung tegak.** Untuk $f(x)=x^{1/3}$ gradien membesar ke $+\infty$ dari kedua sisi: garis singgungnya adalah garis tegak $x=0$. Grafiknya memiliki garis singgung, tetapi gradiennya bukan bilangan, sehingga $f'(0)$ tidak ada.
- **Osilasi tanpa henti.** Untuk $f(x)=x\sin\frac1x$ gradien garis potong adalah $\sin\frac1h$, yang terus berayun di antara $-1$ dan $1$ dan tidak pernah menetap.

Tidak setiap grafik yang melengkung di suatu titik memiliki sudut tajam. $f(x)=x|x|$ tampak seperti bisa patah di $0$, tetapi gradiennya menuju $0$ dari kedua sisi, sehingga $f'(0)=0$ dan garis singgungnya mendatar.

**Terdiferensialkan berarti kontinu.** Jika $f'(a)$ ada maka $f(a+h)-f(a)=\frac{f(a+h)-f(a)}{h}\cdot h$, yang menuju $f'(a)\cdot0=0$, sehingga $f(a+h)\to f(a)$. Itu menyingkirkan setiap lompatan. Kebalikannya salah: $|x|$ kontinu di mana-mana dan tidak terdiferensialkan di $0$. Jadi kekontinuan itu *perlu* untuk adanya turunan tetapi tidak *cukup*.

Uji praktis mengikuti dari perbesaran: grafik yang terdiferensialkan di suatu titik tampak seperti garis lurus saat titik itu diperbesar, dan yang tidak, tidak demikian.`,
          ),
        },
        { kind: 'widget', name: 'tannodiff' },
      ],
    },

    /* ----------------------------------------------------------------- in code */
    {
      id: 'derivatives-in-code',
      heading: L('How do you compute a derivative at a point in code?', 'Bagaimana menghitung turunan di suatu titik dalam kode?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**In code, estimate the derivative with a difference quotient and a small step, preferably the central difference $\frac{f(a+h)-f(a-h)}{2h}$ with $h$ near $10^{-5}$; for a polynomial with exact fractions you can get the exact slope with no limit and no rounding.** The forward quotient $\frac{f(a+h)-f(a)}{h}$ has an error that shrinks in proportion to $h$; the central one has an error proportional to $h^2$, because the two first-order errors cancel.

Do not shrink $h$ as far as possible, though. A computer stores each value with a relative rounding error of about $10^{-16}$, and subtracting two nearly equal numbers keeps that absolute error while dividing by a tiny $h$ magnifies it. The run below estimates the derivative of $\sin$ at $1$, whose true value is $\cos 1=0.5403023058681398$: the error falls as $h$ falls, bottoms out (near $10^{-8}$ for the forward quotient and near $10^{-5}$ for the central one) and then climbs again. At $h=10^{-14}$ both are wrong in the third digit.`,
            T`**Dalam kode, taksir turunan dengan hasil bagi selisih dan langkah kecil, sebaiknya selisih terpusat $\frac{f(a+h)-f(a-h)}{2h}$ dengan $h$ sekitar $10^{-5}$; untuk polinomial dengan pecahan eksak kamu dapat memperoleh gradien eksak tanpa limit dan tanpa pembulatan.** Hasil bagi maju $\frac{f(a+h)-f(a)}{h}$ memiliki galat yang mengecil sebanding dengan $h$; yang terpusat memiliki galat sebanding dengan $h^2$, karena kedua galat orde pertama saling meniadakan.

Namun jangan mengecilkan $h$ sejauh mungkin. Komputer menyimpan tiap nilai dengan galat pembulatan relatif sekitar $10^{-16}$, dan mengurangkan dua bilangan yang hampir sama mempertahankan galat mutlak itu sementara pembagian dengan $h$ yang sangat kecil memperbesarnya. Percobaan di bawah menaksir turunan $\sin$ di $1$, yang nilai sebenarnya $\cos 1=0{,}5403023058681398$: galat turun saat $h$ turun, mencapai dasar (dekat $10^{-8}$ untuk hasil bagi maju dan dekat $10^{-5}$ untuk yang terpusat), lalu naik lagi. Pada $h=10^{-14}$ keduanya salah di angka ketiga.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: forward and central differences', 'Python: selisih maju dan selisih terpusat'),
          code: `import math

def forward(f, a, h):
    return (f(a + h) - f(a)) / h            # error shrinks like h

def central(f, a, h):
    return (f(a + h) - f(a - h)) / (2 * h)  # error shrinks like h squared

a, true = 1.0, math.cos(1.0)                # the derivative of sin at 1 is cos(1)
for k in (1, 3, 5, 8, 11, 14):
    h = 10.0 ** -k
    print(f"h=1e-{k:<2}  forward {abs(forward(math.sin, a, h) - true):.1e}   central {abs(central(math.sin, a, h) - true):.1e}")

# h=1e-1   forward 4.3e-02   central 9.0e-04
# h=1e-3   forward 4.2e-04   central 9.0e-08
# h=1e-5   forward 4.2e-06   central 1.1e-11
# h=1e-8   forward 3.0e-09   central 2.6e-09
# h=1e-11  forward 1.2e-06   central 1.2e-06
# h=1e-14  forward 3.7e-03   central 3.7e-03`,
        },
        {
          kind: 'text',
          text: L(
            T`**For a polynomial there is no need to estimate at all.** Writing $f(a+h)$ as a polynomial in $h$ (a *shift* of the variable, done by repeated synthetic division) gives $f(a)+f'(a)\,h+\cdots$, so the coefficient of $h$ is exactly the slope, as a fraction, with the limit already taken. The code below does that with ´Fraction´ and reproduces the hand computation of $f'(2)=9$ for $x^3-3x$; the list is the polynomial $f(2+h)=2+9h+6h^2+h^3$, so the difference quotient is $9+6h+h^2$, as before. The same idea is what a computer algebra system such as SymPy does when it differentiates symbolically.`,
            T`**Untuk polinomial tidak perlu menaksir sama sekali.** Menulis $f(a+h)$ sebagai polinomial dalam $h$ (sebuah *pergeseran* peubah, dikerjakan dengan pembagian sintetis berulang) memberi $f(a)+f'(a)\,h+\cdots$, sehingga koefisien $h$ tepat sama dengan gradien, sebagai pecahan, dengan limit yang sudah diambil. Kode di bawah melakukannya dengan ´Fraction´ dan mengulang hitungan tangan $f'(2)=9$ untuk $x^3-3x$; daftarnya adalah polinomial $f(2+h)=2+9h+6h^2+h^3$, sehingga hasil bagi selisihnya $9+6h+h^2$, seperti tadi. Gagasan yang sama dipakai sistem aljabar komputer seperti SymPy ketika menurunkan secara simbolik.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: the exact slope of a polynomial', 'Python: gradien eksak sebuah polinomial'),
          code: `from fractions import Fraction

def shift(coeffs, a):
    """Coefficients of f(a + h) for f = c0 + c1 x + c2 x^2 + ..., by repeated synthetic division."""
    out, cur = [], list(coeffs)
    while cur:
        carry, rest = Fraction(0), []
        for c in reversed(cur):
            carry = c + carry * a
            rest.append(carry)
        out.append(rest.pop())              # the remainder is the next coefficient
        cur = rest[::-1]
    return out

f = [0, -3, 0, 1]                           # x^3 - 3x
print(shift(f, Fraction(2)))                # [Fraction(2, 1), Fraction(9, 1), Fraction(6, 1), Fraction(1, 1)]
print(shift(f, Fraction(2))[1])             # 9, the slope at 2
print(shift([Fraction(4), 0, Fraction(1, 2)], Fraction(6))[1])   # 6, the slope of x^2/2 + 4 at 6`,
        },
      ],
    },

    /* ----------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Who invented tangents and derivatives?', 'Siapa yang menemukan garis singgung dan turunan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**No single person did: tangents are ancient, finding them with algebra began in the 1630s, Newton and Leibniz built a calculus on it in the 1660s to 1680s, and the limit definition used today dates from the 1820s.**

- **Antiquity.** Euclid (about 300 BCE) proved the properties of a tangent to a circle in Book III of the *Elements*, and Apollonius (about 200 BCE) and Archimedes found tangents to conics and to a spiral by special geometric arguments, one curve at a time.
- **The 1630s.** Pierre de Fermat (about 1636) had a method that compares $f(x+e)$ with $f(x)$, divides by $e$ and then sets $e$ to zero; it found tangents and maximums and is the first form of the difference quotient. René Descartes (*La Géométrie*, 1637) found the normal to a curve by asking when a circle centered on the axis meets it in a double point, the same double-root idea as in the tangent signature above.
- **1670s and 1680s.** Isaac Barrow drew a tiny "differential triangle" on the curve to find tangents. Isaac Newton (notes of 1665 to 1666) treated a changing quantity as a flowing one with a rate, the *fluxion*, and Gottfried Leibniz (published 1684) wrote the rate as the ratio $\frac{dy}{dx}$ of tiny differences, a notation still used. They disagreed bitterly about priority. Joseph-Louis Lagrange introduced the prime notation $f'(x)$ in 1797.
- **The 1820s.** Augustin-Louis Cauchy defined the derivative as the limit of the difference quotient in his lectures at the École Polytechnique (1823), turning a method into a definition. Even then it was believed that continuous functions must be differentiable almost everywhere, and André-Marie Ampère tried to prove it in 1806.
- **Counterexamples.** Bernard Bolzano (about 1830) and Karl Weierstrass (shown in 1872) built continuous functions that have no derivative at *any* point, and so no tangent line anywhere, showing how far continuity is from differentiability.`,
            T`**Tidak ada satu orang pun: garis singgung sudah kuno, mencarinya dengan aljabar dimulai pada 1630-an, Newton dan Leibniz membangun kalkulus di atasnya pada 1660-an sampai 1680-an, dan definisi limit yang dipakai sekarang berasal dari 1820-an.**

- **Zaman kuno.** Euclid (sekitar 300 SM) membuktikan sifat-sifat garis singgung lingkaran dalam Buku III *Elements*, dan Apollonius (sekitar 200 SM) serta Archimedes menemukan garis singgung kerucut dan spiral dengan argumen geometris khusus, satu kurva demi satu kurva.
- **1630-an.** Pierre de Fermat (sekitar 1636) memiliki metode yang membandingkan $f(x+e)$ dengan $f(x)$, membaginya dengan $e$, lalu menjadikan $e$ nol; metode itu menemukan garis singgung dan nilai maksimum dan merupakan bentuk pertama hasil bagi selisih. René Descartes (*La Géométrie*, 1637) menemukan garis normal pada kurva dengan menanyakan kapan lingkaran berpusat di sumbu memotong kurva di titik ganda, gagasan akar ganda yang sama dengan ciri garis singgung di atas.
- **1670-an dan 1680-an.** Isaac Barrow menggambar "segitiga diferensial" kecil pada kurva untuk mencari garis singgung. Isaac Newton (catatan 1665 sampai 1666) memandang besaran yang berubah sebagai besaran yang mengalir dengan laju, yaitu *fluksi*, dan Gottfried Leibniz (terbit 1684) menulis laju itu sebagai perbandingan $\frac{dy}{dx}$ dari selisih-selisih kecil, notasi yang masih dipakai. Keduanya berselisih sengit soal siapa yang lebih dulu. Joseph-Louis Lagrange memperkenalkan notasi aksen $f'(x)$ pada 1797.
- **1820-an.** Augustin-Louis Cauchy mendefinisikan turunan sebagai limit hasil bagi selisih dalam kuliahnya di École Polytechnique (1823), mengubah sebuah metode menjadi definisi. Saat itu pun orang masih percaya bahwa fungsi kontinu pasti terdiferensialkan hampir di mana-mana, dan André-Marie Ampère mencoba membuktikannya pada 1806.
- **Contoh tandingan.** Bernard Bolzano (sekitar 1830) dan Karl Weierstrass (diperlihatkan pada 1872) membuat fungsi kontinu yang tidak memiliki turunan di titik *mana pun*, sehingga tanpa garis singgung di mana pun, yang menunjukkan betapa jauhnya kekontinuan dari keterdiferensialan.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What mistakes do people make with tangent lines and derivatives?', 'Kesalahan apa yang sering terjadi pada garis singgung dan turunan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with tangents and the derivative at a point are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ A tangent line touches the curve at exactly one point | A tangent can meet the curve again ($y=-2$ meets $y=x^3-3x$ at $x=-2$) and can cross it at an inflection point. It describes the direction at the point. |
| ❌ A line that meets a curve once is a tangent | The vertical line $x=1$ meets $y=x^2$ once and is not a tangent; the tangent at $(1,1)$ is $y=2x-1$. |
| ❌ One secant with a small $h$, such as $h=0.1$, gives the slope | Each secant gives an average rate; the slope is the limit as $h\to0$. For $x^2$ at $1$ the secant with $h=0.1$ has slope $2.1$, not $2$. |
| ❌ Put $h=0$ in the quotient, get $\frac00$, so there is no derivative | $\frac00$ is undetermined, not a verdict. Simplify first, then let $h\to0$: $\frac{2h+h^2}{h}=2+h\to2$. |
| ❌ $f'(a)$ is the derivative of the number $f(a)$, so it is $0$ | $f'(a)$ means the derivative of the function $f$, evaluated at $a$. The limit is taken before the point is plugged in. |
| ❌ The tangent line is $y=f'(a)(x-a)$ | Add the height: $y=f(a)+f'(a)(x-a)$, so that the line passes through $(a,f(a))$. |
| ❌ The normal line has slope $-f'(a)$ | The slope is the negative reciprocal, $-\frac{1}{f'(a)}$: the slopes of perpendicular lines multiply to $-1$. |
| ❌ A graph with no gaps has a derivative everywhere | Continuous is not enough: the graph of $y$ equal to the absolute value of $x$ has no gap and no derivative at $0$. |
| ❌ $f'(a)=0$ means $a$ is a maximum or a minimum | It means only a horizontal tangent: $x^3$ has slope $0$ at $0$ and is rising there. |`,
            T`**Kesalahan paling umum pada garis singgung dan turunan di suatu titik adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ Garis singgung menyentuh kurva di tepat satu titik | Garis singgung dapat bertemu kurva lagi ($y=-2$ bertemu $y=x^3-3x$ di $x=-2$) dan dapat memotongnya di titik belok. Ia menyatakan arah di titik itu. |
| ❌ Garis yang bertemu kurva satu kali adalah garis singgung | Garis tegak $x=1$ bertemu $y=x^2$ sekali dan bukan garis singgung; garis singgung di $(1,1)$ adalah $y=2x-1$. |
| ❌ Satu garis potong dengan $h$ kecil, seperti $h=0{,}1$, memberi gradiennya | Setiap garis potong memberi laju rata-rata; gradien adalah limit saat $h\to0$. Untuk $x^2$ di $1$ garis potong dengan $h=0{,}1$ bergradien $2{,}1$, bukan $2$. |
| ❌ Masukkan $h=0$ ke hasil bagi, dapat $\frac00$, jadi tidak ada turunan | $\frac00$ tak tentu, bukan vonis. Sederhanakan dulu, baru biarkan $h\to0$: $\frac{2h+h^2}{h}=2+h\to2$. |
| ❌ $f'(a)$ adalah turunan bilangan $f(a)$, sehingga nilainya $0$ | $f'(a)$ berarti turunan fungsi $f$, dihitung di $a$. Limit diambil sebelum titiknya dimasukkan. |
| ❌ Garis singgungnya $y=f'(a)(x-a)$ | Tambahkan tingginya: $y=f(a)+f'(a)(x-a)$, supaya garisnya melalui $(a,f(a))$. |
| ❌ Garis normal bergradien $-f'(a)$ | Gradiennya kebalikan negatif, $-\frac{1}{f'(a)}$: hasil kali gradien dua garis yang saling tegak lurus adalah $-1$. |
| ❌ Grafik tanpa celah memiliki turunan di mana-mana | Kontinu belum cukup: grafik $y$ sama dengan nilai mutlak $x$ tidak punya celah dan tidak punya turunan di $0$. |
| ❌ $f'(a)=0$ berarti $a$ adalah maksimum atau minimum | Itu hanya berarti garis singgung mendatar: $x^3$ bergradien $0$ di $0$ dan sedang naik di sana. |`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------- practice */
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
              L('The slope of the tangent at $a$ is the limit of the secant slopes as the second point approaches $a$.', 'Gradien garis singgung di $a$ adalah limit gradien garis potong saat titik kedua mendekati $a$.'),
              L('A tangent line touches the curve at exactly one point and nowhere else.', 'Garis singgung menyentuh kurva di tepat satu titik dan tidak di tempat lain.'),
              L('The derivative $f\'(a)$ is a number.', 'Turunan $f\'(a)$ adalah sebuah bilangan.'),
              L('If $f$ is differentiable at $a$, then $f$ is continuous at $a$.', 'Jika $f$ terdiferensialkan di $a$, maka $f$ kontinu di $a$.'),
              L('If $f$ is continuous at $a$, then $f$ is differentiable at $a$.', 'Jika $f$ kontinu di $a$, maka $f$ terdiferensialkan di $a$.'),
              L('The function $f(x)=|x|$ has a derivative at $0$.', 'Fungsi $f(x)=|x|$ memiliki turunan di $0$.'),
            ],
            answer: [true, false, true, true, false, false],
            explain: L(
              'The first, third and fourth statements are the definition, the fact that $f\'(a)$ is a limit and so a number, and the theorem that differentiable implies continuous. A tangent can meet the curve again, continuity is not enough ($|x|$), and $|x|$ has a corner at $0$.',
              'Pernyataan pertama, ketiga, dan keempat adalah definisi, fakta bahwa $f\'(a)$ adalah limit sehingga sebuah bilangan, dan teorema bahwa terdiferensialkan berarti kontinu. Garis singgung dapat bertemu kurva lagi, kekontinuan belum cukup ($|x|$), dan $|x|$ memiliki sudut tajam di $0$.',
            ),
            hint: L('Think of the definition as a limit, and of $|x|$ as a V.', 'Ingat definisi sebagai limit, dan $|x|$ sebagai huruf V.'),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L('Choose **all** the things that equal $f\'(a)$ when it exists.', 'Pilih **semua** yang sama dengan $f\'(a)$ bila ia ada.'),
            options: [
              L('$\\lim_{h\\to0}\\frac{f(a+h)-f(a)}{h}$', '$\\lim_{h\\to0}\\frac{f(a+h)-f(a)}{h}$'),
              L('$\\lim_{x\\to a}\\frac{f(x)-f(a)}{x-a}$', '$\\lim_{x\\to a}\\frac{f(x)-f(a)}{x-a}$'),
              L('the slope of the tangent line at $(a,f(a))$', 'gradien garis singgung di $(a,f(a))$'),
              L('the secant slope $\\frac{f(a+0.001)-f(a)}{0.001}$', 'gradien garis potong $\\frac{f(a+0{,}001)-f(a)}{0{,}001}$'),
              L('$\\lim_{h\\to0}\\big(f(a+h)-f(a)\\big)$', '$\\lim_{h\\to0}\\big(f(a+h)-f(a)\\big)$'),
            ],
            answer: [0, 1, 2],
            explain: L(
              'The first two are the two forms of the definition and the third is its geometric meaning. A single secant with $h=0.001$ is only an approximation, and the last limit is $0$ for any continuous $f$: there is no division by $h$.',
              'Dua yang pertama adalah dua bentuk definisi dan yang ketiga adalah arti geometrisnya. Satu garis potong dengan $h=0{,}001$ hanyalah hampiran, dan limit terakhir bernilai $0$ untuk $f$ kontinu mana pun: tidak ada pembagian dengan $h$.',
            ),
            hint: L('A derivative needs a limit and a division by $h$.', 'Turunan memerlukan limit dan pembagian dengan $h$.'),
          },
        },
        {
          kind: 'activity',
          title: L('A slope from the definition', 'Gradien dari definisi'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L('Expand: $(3+h)^2=9+6h+h^2$.', 'Jabarkan: $(3+h)^2=9+6h+h^2$.'), L('Divide by $h$: $6+h$, and let $h\\to0$.', 'Bagi dengan $h$: $6+h$, lalu biarkan $h\\to0$.')],
            explain: L('$\\frac{(3+h)^2-9}{h}=\\frac{6h+h^2}{h}=6+h\\to6$, so $f\'(3)=6$.', '$\\frac{(3+h)^2-9}{h}=\\frac{6h+h^2}{h}=6+h\\to6$, sehingga $f\'(3)=6$.'),
            prompt: L('For $f(x)=x^2$, find $f\'(3)$ from the definition.', 'Untuk $f(x)=x^2$, tentukan $f\'(3)$ dari definisi.'),
            given: String.raw`\frac{(3+h)^2-9}{h}=6+h\ \to\ v`,
            blanks: [{ label: "f'(3) =", answer: 6 }],
          },
        },
        {
          kind: 'activity',
          title: L('The equation of a tangent', 'Persamaan garis singgung'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L('$f(3)=9$ and $f\'(3)=6$.', '$f(3)=9$ dan $f\'(3)=6$.'), L('$y=9+6(x-3)=6x-9$.', '$y=9+6(x-3)=6x-9$.')],
            explain: L('$y=f(3)+f\'(3)(x-3)=9+6x-18=6x-9$, so $b=-9$.', '$y=f(3)+f\'(3)(x-3)=9+6x-18=6x-9$, sehingga $b=-9$.'),
            prompt: L('The tangent line to $y=x^2$ at $x=3$ is $y=6x+b$. Find $b$.', 'Garis singgung $y=x^2$ di $x=3$ adalah $y=6x+b$. Tentukan $b$.'),
            given: String.raw`y=6x+b`,
            blanks: [{ label: 'b =', answer: -9 }],
          },
        },
        {
          kind: 'activity',
          title: L('The normal line', 'Garis normal'),
          step: {
            kind: 'quiz',
            id: 'p5',
            prompt: L('The tangent to a curve at a point has slope $4$. What is the slope of the normal line there?', 'Garis singgung kurva di suatu titik bergradien $4$. Berapa gradien garis normal di sana?'),
            options: [L('$-4$', '$-4$'), L('$-\\frac14$', '$-\\frac14$'), L('$\\frac14$', '$\\frac14$'), L('$4$', '$4$')],
            answer: 1,
            explain: L('Perpendicular slopes multiply to $-1$, so the normal slope is $-\\frac{1}{4}$.', 'Hasil kali gradien dua garis yang saling tegak lurus adalah $-1$, sehingga gradien garis normal $-\\frac{1}{4}$.'),
            hint: L('Take the negative reciprocal.', 'Ambil kebalikan negatifnya.'),
          },
        },
        {
          kind: 'activity',
          title: L('An average speed', 'Kecepatan rata-rata'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L('$s(3)=44.1$ and $s(2)=19.6$.', '$s(3)=44{,}1$ dan $s(2)=19{,}6$.'), L('Divide the change in distance by the change in time.', 'Bagi perubahan jarak dengan perubahan waktu.')],
            explain: L('$\\frac{s(3)-s(2)}{3-2}=\\frac{44.1-19.6}{1}=24.5$ m/s.', '$\\frac{s(3)-s(2)}{3-2}=\\frac{44{,}1-19{,}6}{1}=24{,}5$ m/s.'),
            prompt: L('A ball falls $s(t)=4.9t^2$ meters in $t$ seconds. Find its average speed between $t=2$ and $t=3$, in m/s.', 'Sebuah bola jatuh sejauh $s(t)=4{,}9t^2$ meter dalam $t$ detik. Tentukan kecepatan rata-ratanya antara $t=2$ dan $t=3$, dalam m/s.'),
            given: String.raw`\frac{s(3)-s(2)}{3-2}=\frac{44.1-19.6}{1}=v`,
            blanks: [{ label: 'v =', answer: 24.5 }],
          },
        },
        {
          kind: 'activity',
          title: L('A corner', 'Sudut tajam'),
          step: {
            kind: 'quiz',
            id: 'p7',
            prompt: L('Which function has no derivative at $x=0$?', 'Fungsi mana yang tidak memiliki turunan di $x=0$?'),
            options: [L('$x^2$', '$x^2$'), L('$|x|$', '$|x|$'), L('$x^3$', '$x^3$'), L('$\\sin x$', '$\\sin x$')],
            answer: 1,
            explain: L('The graph of $|x|$ is a V: the secant slopes are $-1$ from the left and $+1$ from the right. The other three are smooth at $0$, with slopes $0$, $0$ and $1$.', 'Grafik $|x|$ berbentuk V: gradien garis potong $-1$ dari kiri dan $+1$ dari kanan. Ketiga lainnya mulus di $0$, dengan gradien $0$, $0$, dan $1$.'),
            hint: L('Look for the graph with a sharp point.', 'Cari grafik yang memiliki ujung tajam.'),
          },
        },
        {
          kind: 'activity',
          title: L('Differentiable means', 'Terdiferensialkan berarti'),
          step: {
            kind: 'quiz',
            id: 'p8',
            prompt: L('The function $f$ is differentiable at $a$. Which of these must be true?', 'Fungsi $f$ terdiferensialkan di $a$. Mana yang pasti benar?'),
            options: [L('$f$ is continuous at $a$', '$f$ kontinu di $a$'), L('$f\'(a)=0$', '$f\'(a)=0$'), L('$f$ has a maximum at $a$', '$f$ memiliki maksimum di $a$'), L('$f$ is differentiable at every point', '$f$ terdiferensialkan di setiap titik')],
            answer: 0,
            explain: L('Differentiable implies continuous: $f(a+h)-f(a)\\to f\'(a)\\cdot0=0$. The slope can be anything, there need not be a maximum, and one point says nothing about the others.', 'Terdiferensialkan berarti kontinu: $f(a+h)-f(a)\\to f\'(a)\\cdot0=0$. Gradiennya bisa berapa saja, tidak perlu ada maksimum, dan satu titik tidak mengatakan apa pun tentang titik lain.'),
            hint: L('Recall the theorem about continuity.', 'Ingat teorema tentang kekontinuan.'),
          },
        },
        {
          kind: 'activity',
          title: L('A marginal cost', 'Biaya marjinal'),
          step: {
            kind: 'math',
            id: 'p9',
            hints: [L('$C(10)=900$.', '$C(10)=900$.'), L('$C(11)=2\\cdot121+330+400=972$.', '$C(11)=2\\cdot121+330+400=972$.')],
            explain: L('$C(11)-C(10)=972-900=72$ dollars; the derivative $C\'(10)=70$ is a close estimate.', '$C(11)-C(10)=972-900=72$ ribu rupiah, yaitu Rp72.000; turunan $C\'(10)=70$ adalah taksiran yang dekat.'),
            prompt: L('Making $q$ items costs $C(q)=2q^2+30q+400$ dollars. How many dollars does the 11th item add, $C(11)-C(10)$?', 'Membuat $q$ barang berbiaya $C(q)=2q^2+30q+400$ ribu rupiah. Berapa ribu rupiah tambahan biaya barang ke-11, $C(11)-C(10)$?'),
            given: String.raw`C(11)-C(10)=v`,
            blanks: [{ label: 'v =', answer: 72 }],
          },
        },
        {
          kind: 'activity',
          title: L('A tangent from outside', 'Garis singgung dari luar'),
          step: {
            kind: 'quiz',
            id: 'p10',
            prompt: L('Two tangents to $y=x^2$ pass through $(1,-3)$, touching the parabola at $x=-1$ and $x=3$. What is the tangent at $x=3$?', 'Dua garis singgung $y=x^2$ melalui $(1,-3)$, menyentuh parabola di $x=-1$ dan $x=3$. Apa garis singgung di $x=3$?'),
            options: [L('$y=6x-9$', '$y=6x-9$'), L('$y=6x+9$', '$y=6x+9$'), L('$y=-2x-1$', '$y=-2x-1$'), L('$y=3x-9$', '$y=3x-9$')],
            answer: 0,
            explain: L('At $x=3$ the height is $9$ and the slope is $6$, so $y=9+6(x-3)=6x-9$; it passes through $(1,-3)$ since $6-9=-3$. The line $y=-2x-1$ is the tangent at $x=-1$.', 'Di $x=3$ tingginya $9$ dan gradiennya $6$, sehingga $y=9+6(x-3)=6x-9$; garis itu melalui $(1,-3)$ karena $6-9=-3$. Garis $y=-2x-1$ adalah garis singgung di $x=-1$.'),
            hint: L('Use $y=f(a)+f\'(a)(x-a)$ with $a=3$.', 'Pakai $y=f(a)+f\'(a)(x-a)$ dengan $a=3$.'),
          },
        },
        {
          kind: 'activity',
          title: L('Different one-sided slopes', 'Gradien sepihak yang berbeda'),
          step: {
            kind: 'quiz',
            id: 'p11',
            prompt: L('The secant slopes of $f$ at $0$ tend to $2$ from the left and to $5$ from the right, and $f$ is continuous. What is true?', 'Gradien garis potong $f$ di $0$ menuju $2$ dari kiri dan $5$ dari kanan, dan $f$ kontinu. Apa yang benar?'),
            options: [L('$f\'(0)=2$', '$f\'(0)=2$'), L('$f\'(0)=5$', '$f\'(0)=5$'), L('$f\'(0)=3.5$', '$f\'(0)=3{,}5$'), L('$f\'(0)$ does not exist: the graph has a corner', '$f\'(0)$ tidak ada: grafiknya memiliki sudut tajam')],
            answer: 3,
            explain: L('A derivative needs the two one-sided limits to agree. They are $2$ and $5$, so the limit does not exist and the graph has a corner at $0$; the average $3.5$ means nothing.', 'Turunan memerlukan kedua limit sepihak sama. Keduanya $2$ dan $5$, sehingga limitnya tidak ada dan grafiknya memiliki sudut tajam di $0$; rata-rata $3{,}5$ tidak berarti apa-apa.'),
            hint: L('Do the left and the right slopes agree?', 'Apakah gradien kiri dan kanan sama?'),
          },
        },
        {
          kind: 'activity',
          title: L('Estimating with a tangent', 'Menaksir dengan garis singgung'),
          step: {
            kind: 'math',
            id: 'p12',
            hints: [L('The tangent of $\\sqrt x$ at $4$ is $y=2+\\frac14(x-4)$.', 'Garis singgung $\\sqrt x$ di $4$ adalah $y=2+\\frac14(x-4)$.'), L('Put $x=4.4$: $2+\\frac14\\cdot0.4$.', 'Masukkan $x=4{,}4$: $2+\\frac14\\cdot0{,}4$.')],
            explain: L('$\\sqrt{4.4}\\approx2+\\frac14(0.4)=2.1$; the true value is $2.0976\\ldots$.', '$\\sqrt{4{,}4}\\approx2+\\frac14(0{,}4)=2{,}1$; nilai sebenarnya $2{,}0976\\ldots$.'),
            prompt: L('Use the tangent line of $\\sqrt x$ at $x=4$ (slope $\\frac14$) to estimate $\\sqrt{4.4}$.', 'Pakai garis singgung $\\sqrt x$ di $x=4$ (gradien $\\frac14$) untuk menaksir $\\sqrt{4{,}4}$.'),
            given: String.raw`\sqrt{4.4}\approx 2+\tfrac14\cdot0.4=v`,
            blanks: [{ label: '≈', answer: 2.1 }],
          },
        },
      ],
    },

    /* ----------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: tangent lines and the derivative at a point at a glance', 'Ringkasan: garis singgung dan turunan di suatu titik sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Secant:** the line through $(a,f(a))$ and $(a+h,f(a+h))$; slope $\frac{f(a+h)-f(a)}{h}$, the average rate of change.
- **Derivative at a point:** $f'(a)=\lim_{h\to0}\frac{f(a+h)-f(a)}{h}=\lim_{x\to a}\frac{f(x)-f(a)}{x-a}$, a number: the slope of the tangent and the instantaneous rate.
- **Tangent line:** $y=f(a)+f'(a)(x-a)$; **normal line:** slope $-\frac{1}{f'(a)}$, or the vertical line $x=a$ when the tangent is horizontal.
- **Tangent facts:** it can meet the curve again and can cross it at an inflection point; for a polynomial, $f(x)$ minus the tangent has a double root at $a$.
- **Meaning:** units of $y$ per unit of $x$; $f'(a)>0$ rising, $<0$ falling, $=0$ horizontal.
- **No derivative:** a corner, a cusp, a jump, a vertical tangent, or endless wiggling; differentiable implies continuous, and not conversely.
- **Code:** central difference with $h\approx10^{-5}$; exact slope of a polynomial from the shift $f(a+h)$.`,
            T`- **Garis potong:** garis melalui $(a,f(a))$ dan $(a+h,f(a+h))$; gradien $\frac{f(a+h)-f(a)}{h}$, laju perubahan rata-rata.
- **Turunan di suatu titik:** $f'(a)=\lim_{h\to0}\frac{f(a+h)-f(a)}{h}=\lim_{x\to a}\frac{f(x)-f(a)}{x-a}$, sebuah bilangan: gradien garis singgung dan laju sesaat.
- **Garis singgung:** $y=f(a)+f'(a)(x-a)$; **garis normal:** gradien $-\frac{1}{f'(a)}$, atau garis tegak $x=a$ bila garis singgungnya mendatar.
- **Fakta garis singgung:** ia dapat bertemu kurva lagi dan dapat memotongnya di titik belok; untuk polinomial, $f(x)$ dikurangi garis singgung memiliki akar ganda di $a$.
- **Arti:** satuan $y$ per satuan $x$; $f'(a)>0$ naik, $<0$ turun, $=0$ mendatar.
- **Tanpa turunan:** sudut tajam, cusp, lompatan, garis singgung tegak, atau osilasi tanpa henti; terdiferensialkan berarti kontinu, dan tidak sebaliknya.
- **Kode:** selisih terpusat dengan $h\approx10^{-5}$; gradien eksak polinomial dari pergeseran $f(a+h)$.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Tangent line', 'Garis singgung'), definition: L('A straight line that passes through a point of a curve and has the same direction as the curve there; its slope is the derivative of the function at that point.', 'Garis lurus yang melalui suatu titik pada kurva dan searah dengan kurva di sana; gradiennya adalah turunan fungsi di titik itu.') },
    { term: L('Secant line', 'Garis potong'), definition: L('A straight line through two points of a curve; its slope is the average rate of change of the function between the two points.', 'Garis lurus yang melalui dua titik pada kurva; gradiennya adalah laju perubahan rata-rata fungsi di antara kedua titik itu.') },
    { term: L('Difference quotient', 'Hasil bagi selisih'), definition: L('The change in a function divided by the change in its input, f of a plus h minus f of a, all over h; it is the slope of a secant line.', 'Perubahan fungsi dibagi perubahan masukannya, f dari a ditambah h dikurangi f dari a, seluruhnya dibagi h; ia adalah gradien garis potong.') },
    { term: L('Derivative at a point', 'Turunan di suatu titik'), definition: L('The limit of the difference quotient as h approaches zero, when it exists; it is the slope of the tangent line and the instantaneous rate of change at that point.', 'Limit hasil bagi selisih saat h mendekati nol, bila ada; ia adalah gradien garis singgung dan laju perubahan sesaat di titik itu.') },
    { term: L('Instantaneous rate of change', 'Laju perubahan sesaat'), definition: L('How fast a quantity is changing at one exact moment, found as the limit of the average rates of change over shorter and shorter intervals.', 'Seberapa cepat suatu besaran berubah pada satu saat yang tepat, ditemukan sebagai limit laju perubahan rata-rata pada selang yang makin pendek.') },
    { term: L('Differentiable function', 'Fungsi terdiferensialkan'), definition: L('A function that has a derivative at a given point, or at every point of an interval; such a function is continuous there and looks like a straight line when you zoom in.', 'Fungsi yang memiliki turunan di titik tertentu, atau di setiap titik pada suatu selang; fungsi seperti itu kontinu di sana dan tampak seperti garis lurus saat diperbesar.') },
    { term: L('Normal line', 'Garis normal'), definition: L('The line through a point of a curve that is perpendicular to the tangent line there; its slope is the negative reciprocal of the derivative when the derivative is not zero.', 'Garis yang melalui suatu titik pada kurva dan tegak lurus terhadap garis singgung di sana; gradiennya kebalikan negatif dari turunan bila turunannya bukan nol.') },
    { term: L('One-sided derivative', 'Turunan sepihak'), definition: L('The limit of the difference quotient taken only from the right or only from the left; a function is differentiable at a point exactly when both exist and are equal.', 'Limit hasil bagi selisih yang diambil hanya dari kanan atau hanya dari kiri; fungsi terdiferensialkan di suatu titik tepat bila keduanya ada dan sama.') },
    { term: L('Corner', 'Sudut tajam'), definition: L('A point where a continuous graph changes direction abruptly, so the secant slopes from the left and from the right tend to different numbers and there is no tangent line.', 'Titik tempat grafik kontinu berubah arah secara tiba-tiba, sehingga gradien garis potong dari kiri dan dari kanan menuju bilangan yang berbeda dan tidak ada garis singgung.') },
    { term: L('Vertical tangent', 'Garis singgung tegak'), definition: L('A tangent line that is the vertical line through the point, which happens when the difference quotient grows without bound; the function has no derivative there, since a vertical line has no slope.', 'Garis singgung yang berupa garis tegak melalui titik itu, yang terjadi bila hasil bagi selisih membesar tanpa batas; fungsi tidak memiliki turunan di sana, karena garis tegak tidak punya gradien.') },
  ],

  howTo: [
    {
      name: L('How to find the equation of a tangent line', 'Cara mencari persamaan garis singgung'),
      description: L('Find the height and the slope at the point, then write the point-slope form.', 'Cari tinggi dan gradien di titik itu, lalu tulis bentuk titik-gradien.'),
      steps: [
        { name: L('Find the height', 'Cari tingginya'), text: L('Compute f of a, the y-coordinate of the point where the tangent touches the graph.', 'Hitung f dari a, koordinat y titik tempat garis singgung menyentuh grafik.') },
        { name: L('Find the slope', 'Cari gradiennya'), text: L('Simplify the difference quotient f of a plus h minus f of a, over h, and let h approach zero to get f prime of a.', 'Sederhanakan hasil bagi selisih f dari a ditambah h dikurangi f dari a, dibagi h, lalu biarkan h mendekati nol untuk mendapat f aksen dari a.') },
        { name: L('Write the point-slope form', 'Tulis bentuk titik-gradien'), text: L('Write y equals f of a plus f prime of a times x minus a.', 'Tulis y sama dengan f dari a ditambah f aksen dari a kali x dikurangi a.') },
        { name: L('Simplify and check', 'Sederhanakan dan periksa'), text: L('Expand to the form y equals mx plus b, and check that the line passes through the point: for y equal to x squared at x equal to 1 the line is y equals 2x minus 1.', 'Jabarkan ke bentuk y sama dengan mx ditambah b, dan periksa bahwa garis melalui titik itu: untuk y sama dengan x kuadrat di x sama dengan 1 garisnya y sama dengan 2x dikurangi 1.') },
      ],
    },
    {
      name: L('How to find a derivative at a point from the definition', 'Cara mencari turunan di suatu titik dari definisi'),
      description: L('Write the difference quotient, simplify until h cancels, then take the limit.', 'Tulis hasil bagi selisih, sederhanakan sampai h tercoret, lalu ambil limitnya.'),
      steps: [
        { name: L('Write the quotient', 'Tulis hasil baginya'), text: L('Write f of a plus h minus f of a, all over h, with the formula of f filled in.', 'Tulis f dari a ditambah h dikurangi f dari a, seluruhnya dibagi h, dengan rumus f dimasukkan.') },
        { name: L('Simplify the numerator', 'Sederhanakan pembilangnya'), text: L('Expand a polynomial, put fractions over a common denominator, or multiply a root by its conjugate, until every term of the numerator has a factor h.', 'Jabarkan polinomial, samakan penyebut pecahan, atau kalikan akar dengan sekawannya, sampai setiap suku pembilang memiliki faktor h.') },
        { name: L('Cancel h', 'Coret h'), text: L('Divide the numerator and denominator by h, which is allowed because h is not zero inside a limit.', 'Bagi pembilang dan penyebut dengan h, yang boleh karena h bukan nol di dalam limit.') },
        { name: L('Let h approach zero', 'Biarkan h mendekati nol'), text: L('Replace h by zero in what is left; for the square root of x at 4 the quotient simplifies to 1 over the root of 4 plus h plus 2, which tends to one quarter.', 'Ganti h dengan nol pada yang tersisa; untuk akar x di 4 hasil bagi menyederhana menjadi 1 per akar dari 4 ditambah h ditambah 2, yang menuju seperempat.') },
      ],
    },
    {
      name: L('How to check whether a function is differentiable at a point', 'Cara memeriksa apakah fungsi terdiferensialkan di suatu titik'),
      description: L('Check continuity, then compare the slopes of the secants from the left and from the right.', 'Periksa kekontinuan, lalu bandingkan gradien garis potong dari kiri dan dari kanan.'),
      steps: [
        { name: L('Check continuity', 'Periksa kekontinuan'), text: L('Make sure the left and right limits of f at the point equal f of the point; a jump rules out a derivative at once.', 'Pastikan limit kiri dan kanan f di titik itu sama dengan f di titik itu; lompatan langsung menyingkirkan adanya turunan.') },
        { name: L('Compute the right-hand slope', 'Hitung gradien kanan'), text: L('Find the limit of the difference quotient as h approaches zero from above.', 'Cari limit hasil bagi selisih saat h mendekati nol dari atas.') },
        { name: L('Compute the left-hand slope', 'Hitung gradien kiri'), text: L('Find the limit of the same quotient as h approaches zero from below.', 'Cari limit hasil bagi selisih yang sama saat h mendekati nol dari bawah.') },
        { name: L('Compare', 'Bandingkan'), text: L('If both limits are the same finite number the function is differentiable there; if they differ or are infinite it is not, as with the absolute value of x at 0.', 'Jika kedua limit adalah bilangan hingga yang sama fungsi terdiferensialkan di sana; jika berbeda atau tak hingga ia tidak, seperti nilai mutlak x di 0.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is a tangent line to a curve?', 'Apa itu garis singgung pada kurva?'),
      a: L(
        'A tangent line to a curve at a point is the straight line through the point that has the same direction as the curve there. Its slope is the limit of the slopes of secant lines through the point. It can meet the curve elsewhere, so touching once is not the definition.',
        'Garis singgung pada kurva di suatu titik adalah garis lurus melalui titik itu yang searah dengan kurva di sana. Gradiennya adalah limit gradien garis potong melalui titik tersebut. Ia dapat bertemu kurva di tempat lain, sehingga menyentuh sekali bukan definisinya.',
      ),
    },
    {
      q: L('What is the derivative at a point?', 'Apa itu turunan di suatu titik?'),
      a: L(
        'The derivative of f at a is the limit of f of a plus h minus f of a, divided by h, as h approaches zero, when that limit exists. It is the slope of the tangent line at a and the instantaneous rate of change of f there.',
        'Turunan f di a adalah limit f dari a ditambah h dikurangi f dari a, dibagi h, saat h mendekati nol, bila limit itu ada. Ia adalah gradien garis singgung di a dan laju perubahan sesaat f di sana.',
      ),
    },
    {
      q: L('What is the difference between a secant line and a tangent line?', 'Apa beda garis potong dan garis singgung?'),
      a: L(
        'A secant line passes through two points of a curve and has the slope of the average rate of change between them. A tangent line has the slope of the instantaneous rate of change at one point, and it is the limit of the secants as the second point approaches the first.',
        'Garis potong melalui dua titik pada kurva dan bergradien laju perubahan rata-rata di antara keduanya. Garis singgung bergradien laju perubahan sesaat di satu titik, dan ia adalah limit garis potong saat titik kedua mendekati titik pertama.',
      ),
    },
    {
      q: L('How do you find the equation of a tangent line?', 'Bagaimana mencari persamaan garis singgung?'),
      a: L(
        'Find the height f of a and the slope f prime of a from the limit definition, then write y equals f of a plus f prime of a times x minus a. For y equal to x squared at x equal to 1 the height is 1, the slope is 2 and the line is y equals 2x minus 1.',
        'Cari tinggi f dari a dan gradien f aksen dari a dari definisi limit, lalu tulis y sama dengan f dari a ditambah f aksen dari a kali x dikurangi a. Untuk y sama dengan x kuadrat di x sama dengan 1 tingginya 1, gradiennya 2, dan garisnya y sama dengan 2x dikurangi 1.',
      ),
    },
    {
      q: L('What does the derivative at a point mean?', 'Apa arti turunan di suatu titik?'),
      a: L(
        'It is the instantaneous rate of change of the function at that point, in units of the output per unit of the input. For distance against time it is the speed at that instant, and for cost against quantity it is the marginal cost. Geometrically it is the slope of the graph.',
        'Ia adalah laju perubahan sesaat fungsi di titik itu, dalam satuan keluaran per satuan masukan. Untuk jarak terhadap waktu ia adalah kecepatan pada saat itu, dan untuk biaya terhadap jumlah ia adalah biaya marjinal. Secara geometris ia adalah gradien grafik.',
      ),
    },
    {
      q: L('Can a tangent line cross the curve?', 'Dapatkah garis singgung memotong kurva?'),
      a: L(
        'Yes. A tangent describes only the direction of the curve at the point. At an inflection point such as x equal to 0 on y equals x cubed the tangent crosses the curve, and a tangent can also meet the curve again elsewhere, as y equals minus 2 does on x cubed minus 3x.',
        'Ya. Garis singgung hanya menyatakan arah kurva di titik itu. Di titik belok seperti x sama dengan 0 pada y sama dengan x pangkat tiga garis singgung memotong kurva, dan garis singgung juga dapat bertemu kurva lagi di tempat lain, seperti y sama dengan min 2 pada x pangkat tiga dikurangi 3x.',
      ),
    },
    {
      q: L('When is a function not differentiable at a point?', 'Kapan fungsi tidak terdiferensialkan di suatu titik?'),
      a: L(
        'A function is not differentiable where the limit of the difference quotient does not exist: at a corner such as the absolute value of x at 0, at a cusp, at a jump, at a vertical tangent, or where it oscillates without settling. It must also be continuous there.',
        'Fungsi tidak terdiferensialkan di tempat limit hasil bagi selisih tidak ada: pada sudut tajam seperti nilai mutlak x di 0, pada cusp, pada lompatan, pada garis singgung tegak, atau tempat ia berosilasi tanpa menetap. Ia juga harus kontinu di sana.',
      ),
    },
    {
      q: L('Is every continuous function differentiable?', 'Apakah setiap fungsi kontinu terdiferensialkan?'),
      a: L(
        'No. A differentiable function is always continuous, but a continuous function need not be differentiable. The absolute value of x is continuous everywhere and has a corner at 0, and Weierstrass constructed continuous functions that have no derivative at any point.',
        'Tidak. Fungsi yang terdiferensialkan selalu kontinu, tetapi fungsi kontinu belum tentu terdiferensialkan. Nilai mutlak x kontinu di mana-mana dan memiliki sudut tajam di 0, dan Weierstrass membuat fungsi kontinu yang tidak memiliki turunan di titik mana pun.',
      ),
    },
    {
      q: L('What is the normal line to a curve?', 'Apa itu garis normal pada kurva?'),
      a: L(
        'The normal line at a point of a curve is the line through that point perpendicular to the tangent line. When the tangent has a slope m other than zero the normal has slope minus 1 over m, and when the tangent is horizontal the normal is vertical.',
        'Garis normal di suatu titik pada kurva adalah garis melalui titik itu yang tegak lurus terhadap garis singgung. Bila garis singgung bergradien m yang bukan nol, garis normal bergradien min 1 per m, dan bila garis singgung mendatar, garis normal tegak.',
      ),
    },
  ],

  references: [
    { title: "Thomas' Calculus: Early Transcendentals in SI Units (15th ed.), Section 3.1: Tangent Lines and the Derivative at a Point", author: 'Joel Hass, Christopher Heil, Maurice D. Weir et al.', year: 2023, source: 'Pearson' },
    { title: 'Calculus (8th ed.), sections 2.1 The Tangent and Velocity Problems and 2.7 Derivatives and Rates of Change', author: 'James Stewart', year: 2015, source: 'Cengage Learning' },
    { title: 'The History of the Calculus and Its Conceptual Development', author: 'Carl B. Boyer', year: 1949, source: 'Hafner (Dover reprint, 1959)' },
    { title: "Résumé des leçons données à l'École royale polytechnique sur le calcul infinitésimal", author: 'Augustin-Louis Cauchy', year: 1823, source: 'Imprimerie royale' },
    { title: 'The Python Standard Library: fractions (rational numbers)', author: 'Python Software Foundation', source: 'docs.python.org', url: 'https://docs.python.org/3/library/fractions.html' },
  ],

  related: ['circles', 'linearization-and-differentials', 'arithmetic-sequences-and-series', 'irrational-numbers'],
}
