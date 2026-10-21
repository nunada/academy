import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './monotonic-functions-and-the-first-derivative-test.meta'

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
    T`**If $f'>0$ on an interval, $f$ is increasing there, and if $f'<0$, $f$ is decreasing; so the critical points, where $f'$ is zero or does not exist, cut the domain into pieces on each of which $f$ rises or falls.** The First Derivative Test then reads the sign of $f'$ on both sides of a critical point: negative to positive is a local minimum, positive to negative a local maximum, and no change means no extreme value.`,
    T`**Jika $f'>0$ pada suatu selang, $f$ naik di sana, dan jika $f'<0$, $f$ turun; jadi titik kritis, tempat $f'$ nol atau tidak ada, memotong domain menjadi bagian-bagian yang pada masing-masingnya $f$ naik atau turun.** Uji Turunan Pertama kemudian membaca tanda $f'$ di kedua sisi titik kritis: negatif ke positif adalah minimum lokal, positif ke negatif adalah maksimum lokal, dan tidak berganti tanda berarti bukan nilai ekstrem.`,
  ),

  keyPoints: [
    L(
      T`A function is increasing on an interval if $f(x_1)<f(x_2)$ whenever $x_1<x_2$ there, and decreasing if $f(x_1)>f(x_2)$; a function that is one or the other is monotonic, and we speak of intervals, never of a single point.`,
      T`Fungsi naik pada suatu selang jika $f(x_1)<f(x_2)$ setiap kali $x_1<x_2$ di sana, dan turun jika $f(x_1)>f(x_2)$; fungsi yang salah satunya disebut monoton, dan kita berbicara tentang selang, bukan satu titik.`,
    ),
    L(
      T`Corollary 3 of the Mean Value Theorem: if $f$ is continuous on $[a,b]$ and $f'>0$ on $(a,b)$, then $f$ is increasing on $[a,b]$; if $f'<0$, it is decreasing. The derivative may fail to exist at the ends, or be zero at isolated points, as for $x^3$.`,
      T`Akibat 3 Teorema Nilai Rata-rata: jika $f$ kontinu pada $[a,b]$ dan $f'>0$ pada $(a,b)$, maka $f$ naik pada $[a,b]$; jika $f'<0$, ia turun. Turunan boleh tidak ada di ujung, atau nol di titik terpencil, seperti pada $x^3$.`,
    ),
    L(
      T`To find where $f$ rises and falls, find the critical points, take one test point in each open interval between them, and read the sign of $f'$ there; the sign is the same everywhere in the interval.`,
      T`Untuk mencari di mana $f$ naik dan turun, cari titik kritis, ambil satu titik uji di setiap selang terbuka di antaranya, dan baca tanda $f'$ di sana; tanda itu sama di seluruh selang.`,
    ),
    L(
      T`First Derivative Test: at a critical point $c$, if $f'$ changes from negative to positive $f$ has a local minimum, from positive to negative a local maximum, and if it keeps its sign there is no extreme value.`,
      T`Uji Turunan Pertama: di titik kritis $c$, jika $f'$ berubah dari negatif ke positif $f$ memiliki minimum lokal, dari positif ke negatif maksimum lokal, dan jika tandanya tetap tidak ada nilai ekstrem.`,
    ),
    L(
      T`The test needs the sign, not the size: $f'(x)=(x-1)^2(x+2)$ is zero at $1$ but positive on both sides, so $1$ is not an extreme value, while $-2$ is a local minimum.`,
      T`Uji ini memerlukan tanda, bukan besar: $f'(x)=(x-1)^2(x+2)$ nol di $1$ tetapi positif di kedua sisi, sehingga $1$ bukan nilai ekstrem, sedangkan $-2$ adalah minimum lokal.`,
    ),
    L(
      T`Monotonicity proves inequalities and gives inverses: $e^x\ge1+x$ follows from $e^x-1-x$ increasing from $0$, and a strictly monotonic function is one-to-one, so it has an inverse.`,
      T`Kemonotonan membuktikan pertidaksamaan dan memberi invers: $e^x\ge1+x$ mengikuti dari $e^x-1-x$ yang naik dari $0$, dan fungsi monoton tegas satu-satu, sehingga memiliki invers.`,
    ),
  ],

  sections: [
    /* ---------------------------------------------------------------------- definitions */
    {
      id: 'increasing-decreasing',
      heading: L('What are increasing and decreasing functions?', 'Apa itu fungsi naik dan fungsi turun?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A function $f$ is increasing on an interval $I$ if $f(x_1)<f(x_2)$ whenever $x_1<x_2$ are in $I$, and decreasing on $I$ if $f(x_1)>f(x_2)$ whenever $x_1<x_2$ are in $I$.** In words: the graph rises from left to right, or falls from left to right. A function that is increasing on an interval or decreasing on an interval is called *monotonic* there. When a book writes "increasing" it sometimes means the weaker $f(x_1)\le f(x_2)$, which allows flat stretches; this article uses the strict form, and says "constant" for a flat stretch.

The words belong to an *interval*. We do not say that a function is increasing or decreasing at a single point, because the definition compares two different points. $f(x)=x^2$ is decreasing on $(-\infty,0]$ and increasing on $[0,\infty)$, and it is not monotonic on the whole line. Whether the end points are included changes nothing for a continuous function: if it rises on $(0,1)$ it also rises on $[0,1]$.

A strictly monotonic function never takes the same value twice, because two different inputs are ordered and so are their outputs. That is the reason monotonic functions have inverses, which the last sections come back to. The practical question is how to find the intervals; testing the definition for every pair of points is impossible, and the derivative does it for us.`,
            T`**Fungsi $f$ naik pada selang $I$ jika $f(x_1)<f(x_2)$ setiap kali $x_1<x_2$ berada di $I$, dan turun pada $I$ jika $f(x_1)>f(x_2)$ setiap kali $x_1<x_2$ berada di $I$.** Dengan kata lain: grafik naik dari kiri ke kanan, atau turun dari kiri ke kanan. Fungsi yang naik pada suatu selang atau turun pada suatu selang disebut *monoton* di sana. Ketika sebuah buku menulis "naik" kadang artinya bentuk yang lebih lemah $f(x_1)\le f(x_2)$, yang membolehkan bagian datar; artikel ini memakai bentuk tegas, dan menyebut "konstan" untuk bagian datar.

Kata-kata itu milik suatu *selang*. Kita tidak mengatakan fungsi naik atau turun di satu titik, karena definisinya membandingkan dua titik yang berbeda. $f(x)=x^2$ turun pada $(-\infty,0]$ dan naik pada $[0,\infty)$, dan tidak monoton pada seluruh garis. Apakah ujung disertakan tidak mengubah apa-apa untuk fungsi kontinu: jika ia naik pada $(0,1)$ ia juga naik pada $[0,1]$.

Fungsi monoton tegas tidak pernah bernilai sama dua kali, karena dua masukan yang berbeda berurutan dan begitu pula keluarannya. Itulah alasan fungsi monoton memiliki invers, yang dibahas lagi di bagian akhir. Pertanyaan praktisnya adalah bagaimana mencari selangnya; menguji definisi untuk setiap pasangan titik tidak mungkin, dan turunan melakukannya untuk kita.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------- sign of the derivative */
    {
      id: 'derivative-sign',
      heading: L('How does the sign of the derivative show where a function rises and falls?', 'Bagaimana tanda turunan menunjukkan di mana fungsi naik dan turun?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Corollary 3 of the Mean Value Theorem: suppose $f$ is continuous on $[a,b]$ and differentiable on $(a,b)$. If $f'(x)>0$ at each point of $(a,b)$, then $f$ is increasing on $[a,b]$; if $f'(x)<0$ at each point, then $f$ is decreasing on $[a,b]$.**

*Proof.* Let $x_1<x_2$ be any two points of $[a,b]$. The [Mean Value Theorem](article:the-mean-value-theorem#mean-value-theorem) applied to $f$ on $[x_1,x_2]$ gives a point $c$ between them with
$$f(x_2)-f(x_1)=f'(c)\,(x_2-x_1).$$
The factor $x_2-x_1$ is positive, so the right side has the sign of $f'(c)$. If $f'$ is positive on $(a,b)$ then $f(x_2)>f(x_1)$, and if $f'$ is negative then $f(x_2)<f(x_1)$. ∎

The corollary also holds on open and infinite intervals, and the derivative need not exist at an end. $f(x)=\sqrt x$ has $f'(x)=\frac1{2\sqrt x}>0$ on $(0,b)$, so it is increasing on $[0,b]$ for every $b>0$ even though $f'(0)$ does not exist. Nor is a zero of $f'$ at a single point a problem: $x^3$ has $f'=3x^2=0$ at $0$ and is increasing on the whole line.

**The method.** To find the intervals where $f$ rises and falls:
1. find the critical points of $f$, the places where $f'$ is zero or does not exist;
2. these cut the domain into open intervals; on each one $f'$ is continuous and never zero, so by the Intermediate Value Theorem it has one sign throughout;
3. read that sign by evaluating $f'$ at *one convenient point* of each interval, and apply the corollary.

**Example 1.** Find the critical points of $f(x)=x^3-12x-5$ and the intervals where it rises and falls. The derivative is
$$f'(x)=3x^2-12=3(x+2)(x-2),$$
which is zero at $x=-2$ and $x=2$. The intervals $(-\infty,-2)$, $(-2,2)$ and $(2,\infty)$ are tested at $-3$, $0$ and $3$:

| Interval | $x<-2$ | $-2<x<2$ | $x>2$ |
|---|---|---|---|
| $f'$ at a test point | $f'(-3)=15$ | $f'(0)=-12$ | $f'(3)=15$ |
| Sign of $f'$ | $+$ | $-$ | $+$ |
| Behavior of $f$ | increasing | decreasing | increasing |

Since the corollary also allows $\le$, $f$ is increasing on $(-\infty,-2]$, decreasing on $[-2,2]$ and increasing on $[2,\infty)$. Type any function below, or choose an example: the graph is dark where it rises and orange where it falls, and the graph of $f'$ shows why, above the axis or below.`,
            T`**Akibat 3 Teorema Nilai Rata-rata: misalkan $f$ kontinu pada $[a,b]$ dan terdiferensialkan pada $(a,b)$. Jika $f'(x)>0$ di setiap titik $(a,b)$, maka $f$ naik pada $[a,b]$; jika $f'(x)<0$ di setiap titik, maka $f$ turun pada $[a,b]$.**

*Bukti.* Misalkan $x_1<x_2$ dua titik mana pun pada $[a,b]$. [Teorema Nilai Rata-rata](article:the-mean-value-theorem#mean-value-theorem) yang diterapkan pada $f$ di $[x_1,x_2]$ memberi titik $c$ di antaranya dengan
$$f(x_2)-f(x_1)=f'(c)\,(x_2-x_1).$$
Faktor $x_2-x_1$ positif, sehingga ruas kanan bertanda sama dengan $f'(c)$. Jika $f'$ positif pada $(a,b)$ maka $f(x_2)>f(x_1)$, dan jika $f'$ negatif maka $f(x_2)<f(x_1)$. ∎

Akibat ini juga berlaku pada selang terbuka dan tak hingga, dan turunan tidak harus ada di ujung. $f(x)=\sqrt x$ memiliki $f'(x)=\frac1{2\sqrt x}>0$ pada $(0,b)$, sehingga ia naik pada $[0,b]$ untuk setiap $b>0$ walaupun $f'(0)$ tidak ada. Nol $f'$ di satu titik juga bukan masalah: $x^3$ memiliki $f'=3x^2=0$ di $0$ dan naik pada seluruh garis.

**Metodenya.** Untuk mencari selang tempat $f$ naik dan turun:
1. cari titik kritis $f$, tempat $f'$ nol atau tidak ada;
2. titik-titik itu memotong domain menjadi selang terbuka; pada masing-masingnya $f'$ kontinu dan tidak pernah nol, sehingga menurut Teorema Nilai Antara ia bertanda sama di seluruhnya;
3. baca tanda itu dengan menghitung $f'$ di *satu titik yang mudah* pada setiap selang, lalu terapkan akibatnya.

**Contoh 1.** Tentukan titik kritis $f(x)=x^3-12x-5$ dan selang tempat ia naik dan turun. Turunannya
$$f'(x)=3x^2-12=3(x+2)(x-2),$$
yang nol di $x=-2$ dan $x=2$. Selang $(-\infty,-2)$, $(-2,2)$, dan $(2,\infty)$ diuji di $-3$, $0$, dan $3$:

| Selang | $x<-2$ | $-2<x<2$ | $x>2$ |
|---|---|---|---|
| $f'$ di titik uji | $f'(-3)=15$ | $f'(0)=-12$ | $f'(3)=15$ |
| Tanda $f'$ | $+$ | $-$ | $+$ |
| Perilaku $f$ | naik | turun | naik |

Karena akibatnya juga membolehkan $\le$, $f$ naik pada $(-\infty,-2]$, turun pada $[-2,2]$, dan naik pada $[2,\infty)$. Ketik fungsi apa pun di bawah, atau pilih contoh: grafiknya gelap saat naik dan oranye saat turun, dan grafik $f'$ menunjukkan sebabnya, di atas sumbu atau di bawahnya.`,
          ),
        },
        { kind: 'widget', name: 'monotool' },
      ],
    },

    /* ---------------------------------------------------------------------- first derivative test */
    {
      id: 'first-derivative-test',
      heading: L('What is the First Derivative Test for local extrema?', 'Apa itu Uji Turunan Pertama untuk ekstrem lokal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**At a point where $f$ has a local minimum, $f'<0$ immediately to the left and $f'>0$ immediately to the right, so $f$ falls and then rises; at a local maximum it is the other way round. At a local extreme point the sign of $f'$ changes.** Together with the [critical points](article:extreme-values-on-closed-intervals#critical-points) of the previous article, which say where an extreme value can be, this gives a test for what happens there.

**First Derivative Test for local extrema.** Suppose that $c$ is a critical point of a continuous function $f$, and that $f$ is differentiable at every point of some interval containing $c$ except possibly at $c$ itself. Moving across the interval from left to right:
1. if $f'$ changes from negative to positive at $c$, then $f$ has a local minimum at $c$;
2. if $f'$ changes from positive to negative at $c$, then $f$ has a local maximum at $c$;
3. if $f'$ does not change sign at $c$ ($f'$ is positive on both sides, or negative on both sides), then $f$ has no local extreme value at $c$.

*Proof of part 1.* The sign of $f'$ changes from negative to positive at $c$, so there are numbers $a<c<b$ with $f'<0$ on $(a,c)$ and $f'>0$ on $(c,b)$. If $x$ is in $(a,c)$, then $f(c)<f(x)$ because $f'<0$ makes $f$ decreasing on $[a,c]$. If $x$ is in $(c,b)$, then $f(c)<f(x)$ because $f'>0$ makes $f$ increasing on $[c,b]$. So $f(x)\ge f(c)$ for every $x$ in $(a,b)$, which is the definition of a local minimum at $c$. ∎ Parts 2 and 3 are proved in the same way.

**At an end of the domain** there is only one side. If $f$ rises from the left end $a$ (that is, $f'>0$ just to the right of $a$), then $f(a)$ is a local minimum; if it falls, a local maximum. At a right end, the reverse.

The test uses the *sign*, not the size: a critical point where $f'=0$ is not an extreme value if the sign stays the same, and a point where $f'$ does not exist can be one, as the corner of $|x|$ and the cusp of $x^{2/3}$ show. Choose each of the eight cases below and read the sign on the left and on the right.`,
            T`**Di titik tempat $f$ memiliki minimum lokal, $f'<0$ tepat di kiri dan $f'>0$ tepat di kanan, sehingga $f$ turun lalu naik; di maksimum lokal sebaliknya. Di titik ekstrem lokal tanda $f'$ berganti.** Bersama [titik kritis](article:extreme-values-on-closed-intervals#critical-points) dari artikel sebelumnya, yang menyatakan di mana nilai ekstrem dapat berada, ini memberi uji untuk apa yang terjadi di sana.

**Uji Turunan Pertama untuk ekstrem lokal.** Misalkan $c$ titik kritis fungsi kontinu $f$, dan $f$ terdiferensialkan di setiap titik pada suatu selang yang memuat $c$ kecuali mungkin di $c$ sendiri. Bergerak melintasi selang dari kiri ke kanan:
1. jika $f'$ berubah dari negatif ke positif di $c$, maka $f$ memiliki minimum lokal di $c$;
2. jika $f'$ berubah dari positif ke negatif di $c$, maka $f$ memiliki maksimum lokal di $c$;
3. jika $f'$ tidak berganti tanda di $c$ ($f'$ positif di kedua sisi, atau negatif di kedua sisi), maka $f$ tidak memiliki nilai ekstrem lokal di $c$.

*Bukti bagian 1.* Tanda $f'$ berubah dari negatif ke positif di $c$, sehingga ada bilangan $a<c<b$ dengan $f'<0$ pada $(a,c)$ dan $f'>0$ pada $(c,b)$. Jika $x$ di $(a,c)$, maka $f(c)<f(x)$ karena $f'<0$ membuat $f$ turun pada $[a,c]$. Jika $x$ di $(c,b)$, maka $f(c)<f(x)$ karena $f'>0$ membuat $f$ naik pada $[c,b]$. Jadi $f(x)\ge f(c)$ untuk setiap $x$ di $(a,b)$, yang adalah definisi minimum lokal di $c$. ∎ Bagian 2 dan 3 dibuktikan dengan cara yang sama.

**Di ujung domain** hanya ada satu sisi. Jika $f$ naik dari ujung kiri $a$ (yaitu $f'>0$ tepat di kanan $a$), maka $f(a)$ adalah minimum lokal; jika turun, maksimum lokal. Di ujung kanan, sebaliknya.

Uji ini memakai *tanda*, bukan besar: titik kritis tempat $f'=0$ bukan nilai ekstrem jika tandanya tetap, dan titik tempat $f'$ tidak ada bisa menjadi nilai ekstrem, seperti ditunjukkan sudut $|x|$ dan titik puncak $x^{2/3}$. Pilih masing-masing dari delapan kasus di bawah dan baca tanda di kiri dan di kanan.`,
          ),
        },
        { kind: 'widget', name: 'firsttest' },
      ],
    },

    /* ----------------------------------------------------------------------- worked examples */
    {
      id: 'worked-examples',
      heading: L('How do you work through a complete example?', 'Bagaimana mengerjakan satu contoh lengkap?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A complete analysis finds the critical points, the sign of $f'$ between them, the intervals of increase and decrease, the local extreme values and which of them are absolute.**

**Example 2.** $f(x)=x^{1/3}(x-4)=x^{4/3}-4x^{1/3}$. The function is continuous everywhere, and
$$f'(x)=\tfrac43x^{1/3}-\tfrac43x^{-2/3}=\frac{4(x-1)}{3x^{2/3}}$$
is zero at $x=1$ and undefined at $x=0$. Those are the only critical points.

| Interval | $x<0$ | $0<x<1$ | $x>1$ |
|---|---|---|---|
| Sign of $f'$ | $-$ | $-$ | $+$ |
| Behavior of $f$ | decreasing | decreasing | increasing |

The test says there is no extreme value at $0$ ($f'$ does not change sign: $f$ falls through the vertical tangent there, since $f'\to-\infty$) and a local minimum at $x=1$, with value $f(1)=-3$. Because $f$ decreases on $(-\infty,1)$ and increases on $(1,\infty)$, this is also the absolute minimum.

**Example 3.** $f(x)=(x^2-3)e^x$. It is differentiable everywhere, so the critical points are the zeros of
$$f'(x)=2xe^x+(x^2-3)e^x$$
$$f'(x)=(x^2+2x-3)e^x$$
$$f'(x)=(x+3)(x-1)e^x.$$
Since $e^x$ is never zero, they are $x=-3$ and $x=1$. The sign of $f'$ is $+$ for $x<-3$, $-$ for $-3<x<1$ and $+$ for $x>1$. So $f$ increases on $(-\infty,-3]$ and $[1,\infty)$, decreases on $[-3,1]$, has a local maximum $f(-3)=6e^{-3}\approx0.299$ and a local minimum $f(1)=-2e\approx-5.437$. The minimum is absolute, because $f(x)>0$ for $x>\sqrt3$ and $f(x)\to0$ as $x\to-\infty$; the maximum is not, because $f$ grows without bound. This is the situation the [closed interval method](article:extreme-values-on-closed-intervals#closed-interval-method) cannot handle alone: on a whole line the signs of $f'$ say which values are absolute.

**Example 4.** $f(x)=x^4-8x^2+16=(x^2-4)^2$. Here $f'(x)=4x^3-16x=4x(x-2)(x+2)$, zero at $-2$, $0$ and $2$, with signs $-,+,-,+$ in the four intervals. So $f$ has local minima $f(\pm2)=0$ and a local maximum $f(0)=16$.

**Example 5.** $f(x)=\sin x-\cos x$ on $[0,2\pi]$. Here $f'(x)=\cos x+\sin x$ is zero at $x=\frac{3\pi}{4}$ and $x=\frac{7\pi}{4}$, and $f'(0)=1>0$. So $f$ rises on $\left[0,\frac{3\pi}4\right]$, falls on $\left[\frac{3\pi}4,\frac{7\pi}4\right]$ and rises on $\left[\frac{7\pi}4,2\pi\right]$, with a local maximum $\sqrt2$ at $\frac{3\pi}{4}$ and a local minimum $-\sqrt2$ at $\frac{7\pi}{4}$. At the ends $f(0)=f(2\pi)=-1$, which are local extremes of the window: a local minimum at $0$ (it rises from there) and a local maximum at $2\pi$.`,
            T`**Analisis lengkap mencari titik kritis, tanda $f'$ di antaranya, selang naik dan turun, nilai ekstrem lokal, dan mana di antaranya yang mutlak.**

**Contoh 2.** $f(x)=x^{1/3}(x-4)=x^{4/3}-4x^{1/3}$. Fungsi ini kontinu di mana-mana, dan
$$f'(x)=\tfrac43x^{1/3}-\tfrac43x^{-2/3}=\frac{4(x-1)}{3x^{2/3}}$$
nol di $x=1$ dan tak terdefinisi di $x=0$. Itulah satu-satunya titik kritis.

| Selang | $x<0$ | $0<x<1$ | $x>1$ |
|---|---|---|---|
| Tanda $f'$ | $-$ | $-$ | $+$ |
| Perilaku $f$ | turun | turun | naik |

Ujinya menyatakan tidak ada nilai ekstrem di $0$ ($f'$ tidak berganti tanda: $f$ turun melalui garis singgung tegak di sana, karena $f'\to-\infty$) dan minimum lokal di $x=1$, bernilai $f(1)=-3$. Karena $f$ turun pada $(-\infty,1)$ dan naik pada $(1,\infty)$, ini juga minimum mutlak.

**Contoh 3.** $f(x)=(x^2-3)e^x$. Fungsi ini terdiferensialkan di mana-mana, sehingga titik kritisnya adalah nol dari
$$f'(x)=2xe^x+(x^2-3)e^x$$
$$f'(x)=(x^2+2x-3)e^x$$
$$f'(x)=(x+3)(x-1)e^x.$$
Karena $e^x$ tidak pernah nol, titiknya $x=-3$ dan $x=1$. Tanda $f'$ adalah $+$ untuk $x<-3$, $-$ untuk $-3<x<1$, dan $+$ untuk $x>1$. Jadi $f$ naik pada $(-\infty,-3]$ dan $[1,\infty)$, turun pada $[-3,1]$, memiliki maksimum lokal $f(-3)=6e^{-3}\approx0{,}299$ dan minimum lokal $f(1)=-2e\approx-5{,}437$. Minimumnya mutlak, karena $f(x)>0$ untuk $x>\sqrt3$ dan $f(x)\to0$ ketika $x\to-\infty$; maksimumnya bukan, karena $f$ membesar tanpa batas. Inilah keadaan yang tidak dapat ditangani [metode selang tertutup](article:extreme-values-on-closed-intervals#closed-interval-method) sendirian: pada seluruh garis tanda $f'$ menunjukkan nilai mana yang mutlak.

**Contoh 4.** $f(x)=x^4-8x^2+16=(x^2-4)^2$. Di sini $f'(x)=4x^3-16x=4x(x-2)(x+2)$, nol di $-2$, $0$, dan $2$, dengan tanda $-,+,-,+$ pada keempat selang. Jadi $f$ memiliki minimum lokal $f(\pm2)=0$ dan maksimum lokal $f(0)=16$.

**Contoh 5.** $f(x)=\sin x-\cos x$ pada $[0,2\pi]$. Di sini $f'(x)=\cos x+\sin x$ nol di $x=\frac{3\pi}{4}$ dan $x=\frac{7\pi}{4}$, dan $f'(0)=1>0$. Jadi $f$ naik pada $\left[0,\frac{3\pi}4\right]$, turun pada $\left[\frac{3\pi}4,\frac{7\pi}4\right]$, dan naik pada $\left[\frac{7\pi}4,2\pi\right]$, dengan maksimum lokal $\sqrt2$ di $\frac{3\pi}{4}$ dan minimum lokal $-\sqrt2$ di $\frac{7\pi}{4}$. Di ujung $f(0)=f(2\pi)=-1$, yang merupakan ekstrem lokal jendelanya: minimum lokal di $0$ (ia naik dari sana) dan maksimum lokal di $2\pi$.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------- reading f prime */
    {
      id: 'reading-f-prime',
      heading: L('How do you read a function from its derivative alone?', 'Bagaimana membaca fungsi dari turunannya saja?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**When only $f'$ is given, the sign chart of $f'$ is all that is needed: where $f'$ is above the axis $f$ rises, where it is below the axis $f$ falls, and the critical points where it crosses the axis are the local extremes.** The formula for $f$ does not matter, nor do the actual values of $f'$; only its signs do.

A factored derivative makes the chart easy. Each factor $(x-r)^m$ changes sign at $r$ when the exponent $m$ is odd, and keeps its sign when $m$ is even. For $f'(x)=(x-1)^2(x+2)$:
- at $x=-2$ the factor $x+2$ changes sign, and $(x-1)^2$ is positive: $f'$ goes from negative to positive, a local minimum;
- at $x=1$ the factor $(x-1)^2$ never changes sign: $f'$ stays positive, so $f$ keeps rising and there is no extreme value, although $f'(1)=0$.

For $f'(x)=(x-1)^2(x+2)^2$ the derivative is never negative, so $f$ rises on the whole line and has no extreme value at all, though it has two critical points. A point where $f'$ does not exist counts as critical only if $f$ is defined there; for $f'(x)=1-\frac{4}{x^2}$ the point $x=0$ is not in the domain of $f(x)=x+\frac4x$, so it is a break, not an extreme value, even though $f'$ has the same sign on both sides of it.

Try the derivatives of the textbook's exercises below and see which critical points are extremes. The graph of $f'$ is dark where $f'>0$ (so $f$ rises) and orange where $f'<0$.`,
            T`**Ketika hanya $f'$ yang diberikan, bagan tanda $f'$ adalah satu-satunya yang diperlukan: di mana $f'$ di atas sumbu $f$ naik, di mana di bawah sumbu $f$ turun, dan titik kritis tempat ia memotong sumbu adalah ekstrem lokal.** Rumus $f$ tidak penting, begitu pula nilai sebenarnya $f'$; hanya tandanya yang penting.

Turunan yang difaktorkan membuat bagannya mudah. Setiap faktor $(x-r)^m$ berganti tanda di $r$ ketika pangkat $m$ ganjil, dan mempertahankan tandanya ketika $m$ genap. Untuk $f'(x)=(x-1)^2(x+2)$:
- di $x=-2$ faktor $x+2$ berganti tanda, dan $(x-1)^2$ positif: $f'$ berubah dari negatif ke positif, minimum lokal;
- di $x=1$ faktor $(x-1)^2$ tidak pernah berganti tanda: $f'$ tetap positif, sehingga $f$ terus naik dan tidak ada nilai ekstrem, walaupun $f'(1)=0$.

Untuk $f'(x)=(x-1)^2(x+2)^2$ turunan tidak pernah negatif, sehingga $f$ naik pada seluruh garis dan sama sekali tidak memiliki nilai ekstrem, walaupun memiliki dua titik kritis. Titik tempat $f'$ tidak ada dihitung kritis hanya jika $f$ terdefinisi di sana; untuk $f'(x)=1-\frac{4}{x^2}$ titik $x=0$ tidak berada di domain $f(x)=x+\frac4x$, sehingga ia adalah putus, bukan nilai ekstrem, walaupun $f'$ bertanda sama di kedua sisinya.

Cobalah turunan dari latihan buku di bawah dan lihat titik kritis mana yang ekstrem. Grafik $f'$ gelap di tempat $f'>0$ (sehingga $f$ naik) dan oranye di tempat $f'<0$.`,
          ),
        },
        { kind: 'widget', name: 'signchart' },
      ],
    },

    /* ----------------------------------------------------------------------- inequalities */
    {
      id: 'inequalities',
      heading: L('How does monotonicity prove an inequality?', 'Bagaimana kemonotonan membuktikan pertidaksamaan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To prove $f(x)\ge g(x)$ for $x\ge a$, look at the difference $h=f-g$: if $h(a)\ge0$ and $h'\ge0$ for $x>a$, then $h$ never decreases from a value that is at least $0$, so $h\ge0$ and $f\ge g$.** The derivative turns a comparison of two functions into the sign of one derivative.

**Example 6.** Show that $\ln x<x$ for $x>1$. Let $h(x)=x-\ln x$. Then $h'(x)=1-\frac1x>0$ for $x>1$, so $h$ is increasing on $[1,\infty)$ and $h(x)>h(1)=1>0$. Hence $x>\ln x+1>\ln x$. In fact $h$ has its minimum $1$ at $x=1$, so $x>\ln x$ for every $x>0$.

**Example 7.** Show that $e^x\ge1+x$ for $x\ge0$. Let $h(x)=e^x-1-x$. Then $h(0)=0$ and $h'(x)=e^x-1\ge0$ for $x\ge0$, so $h$ is increasing from $0$ and $h\ge0$. Repeating the idea one step further: with $k(x)=e^x-1-x-\frac{x^2}{2}$ we have $k(0)=0$ and $k'(x)=e^x-1-x\ge0$ by what was just proved, so $e^x\ge1+x+\frac{x^2}{2}$ for $x\ge0$. Each inequality is the base for the next.

The proof needs the right starting point: $e^x\ge1+x$ also holds for negative $x$, but there $h$ is *decreasing* (it falls to $0$ at $x=0$), so the argument above does not show it; the minimum of $h$ at $0$ does. Pick a pair below; the second graph is the difference $h$, dark where it rises and orange where it falls. The last pair is false, and the widget finds where.`,
            T`**Untuk membuktikan $f(x)\ge g(x)$ untuk $x\ge a$, lihat selisih $h=f-g$: jika $h(a)\ge0$ dan $h'\ge0$ untuk $x>a$, maka $h$ tidak pernah turun dari nilai yang paling sedikit $0$, sehingga $h\ge0$ dan $f\ge g$.** Turunan mengubah perbandingan dua fungsi menjadi tanda satu turunan.

**Contoh 6.** Tunjukkan bahwa $\ln x<x$ untuk $x>1$. Misalkan $h(x)=x-\ln x$. Maka $h'(x)=1-\frac1x>0$ untuk $x>1$, sehingga $h$ naik pada $[1,\infty)$ dan $h(x)>h(1)=1>0$. Jadi $x>\ln x+1>\ln x$. Sebenarnya $h$ memiliki minimum $1$ di $x=1$, sehingga $x>\ln x$ untuk setiap $x>0$.

**Contoh 7.** Tunjukkan bahwa $e^x\ge1+x$ untuk $x\ge0$. Misalkan $h(x)=e^x-1-x$. Maka $h(0)=0$ dan $h'(x)=e^x-1\ge0$ untuk $x\ge0$, sehingga $h$ naik dari $0$ dan $h\ge0$. Mengulang gagasan itu satu langkah lagi: dengan $k(x)=e^x-1-x-\frac{x^2}{2}$ kita punya $k(0)=0$ dan $k'(x)=e^x-1-x\ge0$ menurut yang baru dibuktikan, sehingga $e^x\ge1+x+\frac{x^2}{2}$ untuk $x\ge0$. Setiap pertidaksamaan menjadi dasar bagi yang berikutnya.

Bukti ini memerlukan titik awal yang tepat: $e^x\ge1+x$ juga berlaku untuk $x$ negatif, tetapi di sana $h$ *turun* (ia turun ke $0$ di $x=0$), sehingga argumen di atas tidak menunjukkannya; minimum $h$ di $0$ yang menunjukkannya. Pilih satu pasangan di bawah; grafik kedua adalah selisih $h$, gelap saat naik dan oranye saat turun. Pasangan terakhir salah, dan widget menemukan di mana.`,
          ),
        },
        { kind: 'widget', name: 'inequality' },
      ],
    },

    /* ---------------------------------------------------------------------- applications */
    {
      id: 'applications',
      heading: L('Where else does monotonicity matter: motion, quadratics and inverses?', 'Di mana lagi kemonotonan penting: gerak, kuadrat, dan invers?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Wherever a quantity is a function of another, the sign of the derivative says which way it moves.**

**Motion along a line.** For a position $s(t)$ the velocity is $v=s'$: when $s$ is increasing the particle moves right, and when $s$ is decreasing it moves left, as in the [motion along a line](article:the-derivative-as-a-rate-of-change#motion-along-a-line) of the rates article. **Example 8.** A particle has $s(t)=2t^3-14t^2+22t-5$ for $t\ge0$. Then
$$v(t)=6t^2-28t+22=2(t-1)(3t-11),$$
which is zero at $t=1$ and $t=\frac{11}{3}$. The sign of $v$ is $+$ for $0\le t<1$, $-$ for $1<t<\frac{11}3$ and $+$ after: the particle moves right, then left, then right again, and it is momentarily at rest at $t=1$ (at $s=5$, a local maximum of the position) and at $t=\frac{11}{3}$ (at $s=-\frac{377}{27}\approx-13.96$, a local minimum). The acceleration $a=12t-28$ changes sign at $t=\frac73$, where the position changes its bending, a topic of the next article.

**Quadratics.** For $f(x)=ax^2+bx+c$ with $a\neq0$ we have $f'(x)=2ax+b$, with one zero at $x=-\frac b{2a}$. If $a>0$, $f$ decreases to the left of that point and increases to the right, so the vertex is a minimum; if $a<0$ it is the reverse. A single formula covers every parabola.

**Inverses.** A strictly monotonic function is one-to-one: $x_1\ne x_2$ forces $f(x_1)\ne f(x_2)$, because one of the two inputs is larger and the outputs are ordered the same way. So a function with $f'>0$ on an interval, or $f'<0$, has an inverse there. For $f(x)=x^3+x$ we have $f'(x)=3x^2+1>0$, so $f$ is increasing on the whole line and has an inverse, although no simple formula for it. Its derivative at the point $2$ is still available by the [rule for inverses](article:derivatives-of-inverse-functions-and-logarithms#inverse-rule): $f(1)=2$, so $\left(f^{-1}\right)'(2)=\frac1{f'(1)}=\frac14$.`,
            T`**Di mana pun satu besaran adalah fungsi dari besaran lain, tanda turunan menyatakan ke arah mana ia bergerak.**

**Gerak sepanjang garis.** Untuk posisi $s(t)$ kecepatannya $v=s'$: ketika $s$ naik partikel bergerak ke kanan, dan ketika $s$ turun ia bergerak ke kiri, seperti pada [gerak sepanjang garis](article:the-derivative-as-a-rate-of-change#motion-along-a-line) di artikel laju perubahan. **Contoh 8.** Sebuah partikel memiliki $s(t)=2t^3-14t^2+22t-5$ untuk $t\ge0$. Maka
$$v(t)=6t^2-28t+22=2(t-1)(3t-11),$$
yang nol di $t=1$ dan $t=\frac{11}{3}$. Tanda $v$ adalah $+$ untuk $0\le t<1$, $-$ untuk $1<t<\frac{11}3$, dan $+$ setelahnya: partikel bergerak ke kanan, lalu ke kiri, lalu ke kanan lagi, dan sesaat diam di $t=1$ (di $s=5$, maksimum lokal posisi) dan di $t=\frac{11}{3}$ (di $s=-\frac{377}{27}\approx-13{,}96$, minimum lokal). Percepatan $a=12t-28$ berganti tanda di $t=\frac73$, tempat posisi mengubah lengkungannya, topik artikel berikutnya.

**Kuadrat.** Untuk $f(x)=ax^2+bx+c$ dengan $a\neq0$ kita punya $f'(x)=2ax+b$, dengan satu nol di $x=-\frac b{2a}$. Jika $a>0$, $f$ turun di kiri titik itu dan naik di kanannya, sehingga puncaknya minimum; jika $a<0$ sebaliknya. Satu rumus mencakup setiap parabola.

**Invers.** Fungsi monoton tegas satu-satu: $x_1\ne x_2$ memaksa $f(x_1)\ne f(x_2)$, karena salah satu dari dua masukan lebih besar dan keluarannya berurutan sama. Jadi fungsi dengan $f'>0$ pada suatu selang, atau $f'<0$, memiliki invers di sana. Untuk $f(x)=x^3+x$ kita punya $f'(x)=3x^2+1>0$, sehingga $f$ naik pada seluruh garis dan memiliki invers, walaupun tanpa rumus sederhana untuknya. Turunannya di titik $2$ tetap tersedia lewat [aturan invers](article:derivatives-of-inverse-functions-and-logarithms#inverse-rule): $f(1)=2$, sehingga $\left(f^{-1}\right)'(2)=\frac1{f'(1)}=\frac14$.`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------------- in code */
    {
      id: 'monotone-in-code',
      heading: L('How do you find where a function rises and falls in code?', 'Bagaimana mencari di mana fungsi naik dan turun dalam kode?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**In code the method is the same three steps: find the critical points, read the sign of $f'$ at one point of each interval between them, and compare neighbouring signs.** SymPy gives the intervals exactly: ´sp.solve_univariate_inequality(df > 0, x, relational=False)´ returns the set where $f$ rises, and the same with ´< 0´ where it falls. Without a CAS, take the midpoint of each interval, which is what the JavaScript and C++ programs do; a sign read at one point is enough because $f'$ cannot change sign inside an interval that has no critical point.`,
            T`**Dalam kode metodenya tetap tiga langkah: cari titik kritis, baca tanda $f'$ di satu titik pada setiap selang di antaranya, dan bandingkan tanda yang bertetangga.** SymPy memberi selangnya secara eksak: ´sp.solve_univariate_inequality(df > 0, x, relational=False)´ mengembalikan himpunan tempat $f$ naik, dan yang sama dengan ´< 0´ tempat ia turun. Tanpa CAS, ambil titik tengah setiap selang, yang dilakukan program JavaScript dan C++; tanda yang dibaca di satu titik sudah cukup karena $f'$ tidak dapat berganti tanda di dalam selang yang tidak memiliki titik kritis.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python and SymPy: intervals and the First Derivative Test', 'Python dan SymPy: selang dan Uji Turunan Pertama'),
          code: `import sympy as sp

x = sp.symbols('x', real=True)


def first_derivative_test(f):
    """Where f rises and falls, and what the First Derivative Test says at each critical point."""
    df = sp.diff(f, x)
    rising = sp.solve_univariate_inequality(df > 0, x, relational=False)
    falling = sp.solve_univariate_inequality(df < 0, x, relational=False)
    eps = sp.Rational(1, 10**6)
    verdict = {}
    for c in sorted(sp.solveset(sp.Eq(df, 0), x, sp.S.Reals), key=float):
        left_down, right_up = falling.contains(c - eps), rising.contains(c + eps)
        left_up, right_down = rising.contains(c - eps), falling.contains(c + eps)
        verdict[c] = 'min' if left_down and right_up else 'max' if left_up and right_down else 'none'
    return rising, falling, verdict


for f in (x**3 - 12 * x - 5, (x**2 - 3) * sp.exp(x), x**4 - 8 * x**2 + 16, x**3, (x - 1)**2 * (x + 2)):
    print(f, '->', first_derivative_test(f))
# x**3 - 12*x - 5 -> (Union(Interval.open(-oo, -2), Interval.open(2, oo)), Interval.open(-2, 2), {-2: 'max', 2: 'min'})
# (x**2 - 3)*exp(x) -> (Union(Interval.open(-oo, -3), Interval.open(1, oo)), Interval.open(-3, 1), {-3: 'max', 1: 'min'})
# x**4 - 8*x**2 + 16 -> (Union(Interval.open(-2, 0), Interval.open(2, oo)), Union(Interval.open(-oo, -2), Interval.open(0, 2)), {-2: 'min', 0: 'max', 2: 'min'})
# x**3 -> (Union(Interval.open(-oo, 0), Interval.open(0, oo)), EmptySet, {0: 'none'})
# (x - 1)**2*(x + 2) -> (Union(Interval.open(-oo, -1), Interval.open(1, oo)), Interval.open(-1, 1), {-1: 'max', 1: 'min'})`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: a sign chart from the critical points', 'JavaScript: bagan tanda dari titik kritis'),
          code: `// the pieces between the critical points, the sign of f' at the middle of each, and the verdict at every critical point
const signChart = (df, critical, lo, hi) => {
  const edges = [lo, ...critical, hi]
  const pieces = edges.slice(1).map((to, i) => {
    const mid = (edges[i] + to) / 2
    return { from: edges[i], to, slope: df(mid), trend: df(mid) > 0 ? 'rising' : 'falling' }
  })
  const verdicts = critical.map((c, i) => {
    const [l, r] = [pieces[i].trend, pieces[i + 1].trend]
    return [c, l === 'falling' && r === 'rising' ? 'min' : l === 'rising' && r === 'falling' ? 'max' : 'none']
  })
  return { pieces: pieces.map((p) => [p.from, p.to, p.trend]), verdicts }
}
signChart((x) => 3 * x * x - 12, [-2, 2], -5, 5)
// pieces [[-5,-2,'rising'], [-2,2,'falling'], [2,5,'rising']]   verdicts [[-2,'max'], [2,'min']]
signChart((x) => 3 * x * x, [0], -2, 2)
// pieces [[-2,0,'rising'], [0,2,'rising']]   verdicts [[0,'none']]: f' = 0 at 0, but the sign does not change
signChart((x) => 4 * x * (x - 2) * (x + 2), [-2, 0, 2], -3, 3)
// pieces [[-3,-2,'falling'], [-2,0,'rising'], [0,2,'falling'], [2,3,'rising']]   verdicts [[-2,'min'], [0,'max'], [2,'min']]`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++', 'C++'),
          code: `#include <iostream>
#include <cstdio>
#include <cmath>
using namespace std;

double df(double x) { return 3 * x * x - 12; }       // f(x) = x^3 - 12x - 5, Example 1

int main() {
  double edge[4];
  edge[0] = -5; edge[1] = -2; edge[2] = 2; edge[3] = 5;    // the ends and the critical points
  int sign[3];
  for (int i = 0; i < 3; i++) {
    double mid = (edge[i] + edge[i + 1]) / 2;               // one test point in each interval
    sign[i] = df(mid) > 0 ? 1 : -1;
    if (sign[i] > 0) printf("from %.1f to %.1f; f' at %.2f is %.2f; rising\\n", edge[i], edge[i + 1], mid, df(mid));
    else printf("from %.1f to %.1f; f' at %.2f is %.2f; falling\\n", edge[i], edge[i + 1], mid, df(mid));
  }
  for (int i = 0; i < 2; i++) {                             // the First Derivative Test at each critical point
    double c = edge[i + 1];
    if (sign[i] < 0 && sign[i + 1] > 0) printf("x=%.1f local minimum\\n", c);
    else if (sign[i] > 0 && sign[i + 1] < 0) printf("x=%.1f local maximum\\n", c);
    else printf("x=%.1f no extreme value\\n", c);
  }
  printf("f(-2)=%.0f f(2)=%.0f\\n", pow(-2.0, 3) - 12 * (-2.0) - 5, pow(2.0, 3) - 12 * 2.0 - 5);
  return 0;
}

/* output:
from -5.0 to -2.0; f' at -3.50 is 24.75; rising
from -2.0 to 2.0; f' at 0.00 is -12.00; falling
from 2.0 to 5.0; f' at 3.50 is 24.75; rising
x=-2.0 local maximum
x=2.0 local minimum
f(-2)=11 f(2)=-21
*/`,
        },
      ],
    },

    /* ---------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where do the signs of the derivative come from?', 'Dari mana asal tanda turunan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Telling rising from falling by the sign of a rate is as old as the derivative, but proving that the sign does what it should took until the 19th century.**

- **Fermat, about 1629.** Pierre de Fermat located maxima and minima by comparing $f(x)$ with $f(x+e)$. What he found is the condition $f'=0$; telling a maximum from a minimum was done by looking at the values on both sides.
- **Leibniz, 1684.** Gottfried Wilhelm Leibniz published the first rules of the differential calculus in his *Nova methodus pro maximis et minimis*, in the title of which the search for maxima and minima comes first.
- **Cauchy, 1823.** Augustin-Louis Cauchy, with the derivative defined as a limit, showed through the mean value theorem that a positive derivative on an interval forces a function to increase. Before that, "the derivative is positive, so the function rises" was taken as obvious from the picture.
- **Today.** The sign chart is the first tool for graph sketching and optimisation, and a numerical method that stops when the slope changes sign is applying the same test.`,
            T`**Membedakan naik dari turun lewat tanda suatu laju sama tuanya dengan turunan, tetapi membuktikan bahwa tanda itu berlaku sebagaimana mestinya baru terjadi pada abad ke-19.**

- **Fermat, sekitar 1629.** Pierre de Fermat menentukan letak maksimum dan minimum dengan membandingkan $f(x)$ dengan $f(x+e)$. Yang ia temukan adalah syarat $f'=0$; membedakan maksimum dari minimum dilakukan dengan melihat nilai di kedua sisi.
- **Leibniz, 1684.** Gottfried Wilhelm Leibniz menerbitkan aturan pertama kalkulus diferensial dalam *Nova methodus pro maximis et minimis*, yang judulnya menempatkan pencarian maksimum dan minimum lebih dahulu.
- **Cauchy, 1823.** Augustin-Louis Cauchy, dengan turunan yang didefinisikan sebagai limit, menunjukkan lewat teorema nilai rata-rata bahwa turunan positif pada suatu selang memaksa fungsi naik. Sebelumnya, "turunannya positif, jadi fungsi naik" dianggap jelas dari gambar.
- **Sekarang.** Bagan tanda adalah alat pertama untuk menggambar grafik dan optimasi, dan metode numerik yang berhenti ketika gradien berganti tanda menerapkan uji yang sama.`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What mistakes do people make with the sign of the derivative?', 'Kesalahan apa yang sering terjadi pada tanda turunan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with monotonic functions and the First Derivative Test are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ If $f'(c)=0$, then $f$ has a maximum or a minimum at $c$ | $f(x)=x^3$ has $f'(0)=0$ and keeps rising: look at the sign on both sides. |
| ❌ $f'>0$ means $f>0$ | $f'>0$ says $f$ rises, not that it is positive: $f(x)=x-5$ has $f'=1$ and is negative for $x<5$. |
| ❌ Test the sign of $f'$ at the critical point | There $f'=0$ or does not exist; take one point in each open interval between critical points. |
| ❌ One test point for the whole line | One test point *per interval*: $x^3-12x-5$ has the signs $+,-,+$, and one point would see only one of them. |
| ❌ Skip the points where $f'$ does not exist | They are critical: $x^{2/3}$ has a minimum at $0$, and $\sqrt[3]{x}$ has none there. |
| ❌ $f'$ going from $+$ to $-$ gives a minimum | It gives a maximum: the function rises and then falls. |
| ❌ "$f$ is increasing at $x=2$" | Increasing is a property of an interval; at one point the definition compares nothing. |
| ❌ $f'>0$ on $(-\infty,0)$ and on $(0,\infty)$, so $f$ increases on the whole line | The set must be one interval: $f(x)=-\frac1x$ has $f'=\frac1{x^2}>0$, but $f(-1)=1>f(1)=-1$. |
| ❌ A local maximum is the largest value | $(x^2-3)e^x$ has the local maximum $0.299$ at $-3$ and then grows without bound. |`,
            T`**Kesalahan paling umum pada fungsi monoton dan Uji Turunan Pertama adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ Jika $f'(c)=0$, maka $f$ memiliki maksimum atau minimum di $c$ | $f(x)=x^3$ memiliki $f'(0)=0$ dan terus naik: lihat tanda di kedua sisi. |
| ❌ $f'>0$ berarti $f>0$ | $f'>0$ menyatakan $f$ naik, bukan bahwa ia positif: $f(x)=x-5$ memiliki $f'=1$ dan negatif untuk $x<5$. |
| ❌ Menguji tanda $f'$ di titik kritis | Di sana $f'=0$ atau tidak ada; ambil satu titik pada setiap selang terbuka di antara titik kritis. |
| ❌ Satu titik uji untuk seluruh garis | Satu titik uji *per selang*: $x^3-12x-5$ bertanda $+,-,+$, dan satu titik hanya melihat salah satunya. |
| ❌ Melewatkan titik tempat $f'$ tidak ada | Itu titik kritis: $x^{2/3}$ memiliki minimum di $0$, dan $\sqrt[3]{x}$ tidak memilikinya di sana. |
| ❌ $f'$ berubah dari $+$ ke $-$ memberi minimum | Itu memberi maksimum: fungsi naik lalu turun. |
| ❌ "$f$ naik di $x=2$" | Naik adalah sifat suatu selang; di satu titik definisinya tidak membandingkan apa pun. |
| ❌ $f'>0$ pada $(-\infty,0)$ dan pada $(0,\infty)$, jadi $f$ naik pada seluruh garis | Himpunannya harus satu selang: $f(x)=-\frac1x$ memiliki $f'=\frac1{x^2}>0$, tetapi $f(-1)=1>f(1)=-1$. |
| ❌ Maksimum lokal adalah nilai terbesar | $(x^2-3)e^x$ memiliki maksimum lokal $0{,}299$ di $-3$ lalu membesar tanpa batas. |`,
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
              L(T`If $f'>0$ on an interval, then $f$ is increasing on it.`, T`Jika $f'>0$ pada suatu selang, maka $f$ naik pada selang itu.`),
              L(T`If $f'(c)=0$, then $f$ has a local extreme value at $c$.`, T`Jika $f'(c)=0$, maka $f$ memiliki nilai ekstrem lokal di $c$.`),
              L(T`If $f'$ changes from negative to positive at $c$, then $f$ has a local minimum at $c$.`, T`Jika $f'$ berubah dari negatif ke positif di $c$, maka $f$ memiliki minimum lokal di $c$.`),
              L(T`$x^3$ is increasing on the whole line although $f'(0)=0$.`, T`$x^3$ naik pada seluruh garis walaupun $f'(0)=0$.`),
              L(T`A function can have a local minimum at a point where $f'$ does not exist.`, T`Fungsi dapat memiliki minimum lokal di titik tempat $f'$ tidak ada.`),
              L(T`It makes sense to say that a function is increasing at a single point.`, T`Masuk akal mengatakan bahwa fungsi naik di satu titik.`),
            ],
            answer: [true, false, true, true, true, false],
            explain: L(
              T`$x^3$ has $f'(0)=0$ and no extreme value, and $|x|$ has its minimum where there is no derivative. Increasing is defined by comparing two points of an interval.`,
              T`$x^3$ memiliki $f'(0)=0$ dan tidak ada nilai ekstrem, dan $|x|$ memiliki minimum di tempat yang tidak ada turunannya. Naik didefinisikan dengan membandingkan dua titik pada suatu selang.`,
            ),
            hint: L(T`Remember $x^3$, $|x|$ and the definition with two points.`, T`Ingat $x^3$, $|x|$, dan definisi dengan dua titik.`),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L(T`Choose **all** the functions that are monotonic on $[-1,1]$.`, T`Pilih **semua** fungsi yang monoton pada $[-1,1]$.`),
            options: [L(T`$x^3$`, T`$x^3$`), L(T`$x^2$`, T`$x^2$`), L(T`$|x|$`, T`$|x|$`), L(T`$e^x$`, T`$e^x$`), L(T`$\sin x$`, T`$\sin x$`), L(T`$x^3-x$`, T`$x^3-x$`)],
            answer: [0, 3, 4],
            explain: L(
              T`$x^3$, $e^x$ and $\sin x$ have a derivative of one sign on $(-1,1)$ ($\cos x>0$ there). $x^2$ and $|x|$ turn round at $0$, and $x^3-x$ has $f'=3x^2-1$, which changes sign at $\pm\frac1{\sqrt3}$.`,
              T`$x^3$, $e^x$, dan $\sin x$ memiliki turunan bertanda satu pada $(-1,1)$ ($\cos x>0$ di sana). $x^2$ dan $|x|$ berbalik di $0$, dan $x^3-x$ memiliki $f'=3x^2-1$, yang berganti tanda di $\pm\frac1{\sqrt3}$.`,
            ),
            hint: L(T`Does $f'$ keep one sign on the whole interval?`, T`Apakah $f'$ mempertahankan satu tanda pada seluruh selang?`),
          },
        },
        {
          kind: 'activity',
          title: L('A local minimum value', 'Nilai minimum lokal'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L(T`$f'(x)=3x^2-12=3(x+2)(x-2)$, with signs $+,-,+$.`, T`$f'(x)=3x^2-12=3(x+2)(x-2)$, dengan tanda $+,-,+$.`), L(T`The minimum is at $x=2$: $f(2)=8-24-5$.`, T`Minimumnya di $x=2$: $f(2)=8-24-5$.`)],
            explain: L(T`$f'$ goes from negative to positive at $2$, so $f(2)=8-24-5=-21$ is a local minimum.`, T`$f'$ berubah dari negatif ke positif di $2$, sehingga $f(2)=8-24-5=-21$ adalah minimum lokal.`),
            prompt: L(T`Find the local minimum value of $f(x)=x^3-12x-5$.`, T`Tentukan nilai minimum lokal $f(x)=x^3-12x-5$.`),
            given: String.raw`f_{\min}=v`,
            blanks: [{ label: 'f =', answer: -21 }],
          },
        },
        {
          kind: 'activity',
          title: L('A double factor', 'Faktor ganda'),
          step: {
            kind: 'quiz',
            id: 'p4',
            prompt: L(T`$f'(x)=(x-1)^2(x+2)$. At which critical point does $f$ have a local extreme value?`, T`$f'(x)=(x-1)^2(x+2)$. Di titik kritis mana $f$ memiliki nilai ekstrem lokal?`),
            options: [
              L(T`only at $x=-2$, a local minimum`, T`hanya di $x=-2$, minimum lokal`),
              L(T`only at $x=1$`, T`hanya di $x=1$`),
              L(T`at both $x=-2$ and $x=1$`, T`di $x=-2$ dan $x=1$`),
              L(T`at neither`, T`di keduanya tidak`),
            ],
            answer: 0,
            explain: L(T`$f'$ changes from negative to positive at $-2$. At $1$ the square keeps $f'$ positive on both sides, so $f$ keeps rising.`, T`$f'$ berubah dari negatif ke positif di $-2$. Di $1$ kuadrat menjaga $f'$ tetap positif di kedua sisi, sehingga $f$ terus naik.`),
            hint: L(T`An even power does not change sign.`, T`Pangkat genap tidak mengubah tanda.`),
          },
        },
        {
          kind: 'activity',
          title: L('A local maximum value', 'Nilai maksimum lokal'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [L(T`$f'(x)=4x^3-16x=4x(x-2)(x+2)$.`, T`$f'(x)=4x^3-16x=4x(x-2)(x+2)$.`), L(T`The signs are $-,+,-,+$, so the maximum is at $x=0$.`, T`Tandanya $-,+,-,+$, sehingga maksimum di $x=0$.`)],
            explain: L(T`$f'$ goes from positive to negative at $0$, so $f(0)=16$ is the local maximum.`, T`$f'$ berubah dari positif ke negatif di $0$, sehingga $f(0)=16$ adalah maksimum lokal.`),
            prompt: L(T`Find the local maximum value of $f(x)=x^4-8x^2+16$.`, T`Tentukan nilai maksimum lokal $f(x)=x^4-8x^2+16$.`),
            given: String.raw`f_{\max}=v`,
            blanks: [{ label: 'f =', answer: 16 }],
          },
        },
        {
          kind: 'activity',
          title: L('A cusp', 'Titik puncak'),
          step: {
            kind: 'quiz',
            id: 'p6',
            prompt: L(T`What does $f(x)=x^{2/3}$ have at $x=0$, where $f'$ does not exist?`, T`Apa yang dimiliki $f(x)=x^{2/3}$ di $x=0$, tempat $f'$ tidak ada?`),
            options: [
              L('a local minimum', 'minimum lokal'),
              L('a local maximum', 'maksimum lokal'),
              L('no extreme value', 'tidak ada nilai ekstrem'),
              L('nothing: it is not a critical point', 'tidak ada: itu bukan titik kritis'),
            ],
            answer: 0,
            explain: L(T`$f'(x)=\frac23x^{-1/3}$ is negative for $x<0$ and positive for $x>0$, so it changes from negative to positive: a local minimum at the cusp.`, T`$f'(x)=\frac23x^{-1/3}$ negatif untuk $x<0$ dan positif untuk $x>0$, sehingga berubah dari negatif ke positif: minimum lokal di titik puncak.`),
            hint: L(T`A point where $f'$ does not exist is critical; read the signs on both sides.`, T`Titik tempat $f'$ tidak ada adalah kritis; baca tanda di kedua sisi.`),
          },
        },
        {
          kind: 'activity',
          title: L('A cubic with given extremes', 'Kubik dengan ekstrem tertentu'),
          step: {
            kind: 'math',
            id: 'p7',
            hints: [L(T`$f'(x)=6x^2-6x=6x(x-1)$, with signs $+,-,+$.`, T`$f'(x)=6x^2-6x=6x(x-1)$, dengan tanda $+,-,+$.`), L(T`The local minimum is at $x=1$.`, T`Minimum lokalnya di $x=1$.`)],
            explain: L(T`$f(1)=2-3=-1$ is the local minimum, and $f(0)=0$ the local maximum.`, T`$f(1)=2-3=-1$ adalah minimum lokal, dan $f(0)=0$ maksimum lokal.`),
            prompt: L(T`Find the local minimum value of $f(x)=2x^3-3x^2$.`, T`Tentukan nilai minimum lokal $f(x)=2x^3-3x^2$.`),
            given: String.raw`f_{\min}=v`,
            blanks: [{ label: 'f =', answer: -1 }],
          },
        },
        {
          kind: 'activity',
          title: L('Where a parabola turns', 'Tempat parabola berbalik'),
          step: {
            kind: 'math',
            id: 'p8',
            hints: [L(T`$f'(x)=2x-6$.`, T`$f'(x)=2x-6$.`), L(T`$f'<0$ for $x<3$ and $f'>0$ for $x>3$.`, T`$f'<0$ untuk $x<3$ dan $f'>0$ untuk $x>3$.`)],
            explain: L(T`$f'(x)=2x-6$ is negative up to $x=3$, so $f$ is decreasing on $(-\infty,3]$.`, T`$f'(x)=2x-6$ negatif sampai $x=3$, sehingga $f$ turun pada $(-\infty,3]$.`),
            prompt: L(T`$f(x)=x^2-6x$ is decreasing on $(-\infty,c]$. Find the largest such $c$.`, T`$f(x)=x^2-6x$ turun pada $(-\infty,c]$. Tentukan $c$ terbesar yang mungkin.`),
            given: String.raw`c=v`,
            blanks: [{ label: 'c =', answer: 3 }],
          },
        },
        {
          kind: 'activity',
          title: L('A particle turns round', 'Partikel berbalik arah'),
          step: {
            kind: 'math',
            id: 'p9',
            hints: [L(T`$v=s'=3t^2-12t+9=3(t-1)(t-3)$.`, T`$v=s'=3t^2-12t+9=3(t-1)(t-3)$.`), L(T`$v$ is zero at $t=1$ and at a later time.`, T`$v$ nol di $t=1$ dan di waktu yang lebih lambat.`)],
            explain: L(T`$v=3(t-1)(t-3)$ is zero at $t=1$ and $t=3$: the particle moves right, then left between them, then right again.`, T`$v=3(t-1)(t-3)$ nol di $t=1$ dan $t=3$: partikel bergerak ke kanan, lalu ke kiri di antaranya, lalu ke kanan lagi.`),
            prompt: L(T`A particle has position $s(t)=t^3-6t^2+9t$ for $t\ge0$. It is momentarily at rest at $t=1$ and again at which later time $t$?`, T`Sebuah partikel memiliki posisi $s(t)=t^3-6t^2+9t$ untuk $t\ge0$. Ia sesaat diam di $t=1$ dan lagi pada waktu $t$ berapa yang lebih lambat?`),
            given: String.raw`t=v`,
            blanks: [{ label: 't =', answer: 3 }],
          },
        },
        {
          kind: 'activity',
          title: L('An inequality', 'Sebuah pertidaksamaan'),
          step: {
            kind: 'quiz',
            id: 'p10',
            prompt: L(T`Which argument shows that $\ln x<x$ for $x>1$?`, T`Argumen mana yang menunjukkan bahwa $\ln x<x$ untuk $x>1$?`),
            options: [
              L(T`$h(x)=x-\ln x$ has $h'(x)=1-\frac1x>0$ for $x>1$ and $h(1)=1>0$, so $h>0$`, T`$h(x)=x-\ln x$ memiliki $h'(x)=1-\frac1x>0$ untuk $x>1$ dan $h(1)=1>0$, sehingga $h>0$`),
              L(T`$\ln x$ is increasing, so it is smaller than $x$`, T`$\ln x$ naik, sehingga lebih kecil daripada $x$`),
              L(T`$h(x)=x-\ln x$ has $h'(1)=0$, so $h>0$`, T`$h(x)=x-\ln x$ memiliki $h'(1)=0$, sehingga $h>0$`),
              L(T`$x$ and $\ln x$ cross at $x=1$`, T`$x$ dan $\ln x$ berpotongan di $x=1$`),
            ],
            answer: 0,
            explain: L(T`The difference starts at $1$ and never decreases for $x>1$, so it stays positive. "Both increasing" says nothing about which is larger.`, T`Selisihnya mulai dari $1$ dan tidak pernah turun untuk $x>1$, sehingga tetap positif. "Keduanya naik" tidak menyatakan mana yang lebih besar.`),
            hint: L(T`Look at the difference and the sign of its derivative.`, T`Lihat selisihnya dan tanda turunannya.`),
          },
        },
        {
          kind: 'activity',
          title: L('Counting extremes', 'Menghitung ekstrem'),
          step: {
            kind: 'math',
            id: 'p11',
            hints: [L(T`The critical points are $0$, $1$ and $2$.`, T`Titik kritisnya $0$, $1$, dan $2$.`), L(T`The signs are $+,-,+,+$: the factor $(x-2)^2$ does not change sign.`, T`Tandanya $+,-,+,+$: faktor $(x-2)^2$ tidak mengubah tanda.`)],
            explain: L(T`$f'$ changes sign at $0$ (a maximum) and $1$ (a minimum) but not at $2$ because of the square: two local extremes.`, T`$f'$ berganti tanda di $0$ (maksimum) dan $1$ (minimum) tetapi tidak di $2$ karena kuadratnya: dua ekstrem lokal.`),
            prompt: L(T`$f'(x)=x(x-1)(x-2)^2$. How many local extreme values does $f$ have?`, T`$f'(x)=x(x-1)(x-2)^2$. Berapa banyak nilai ekstrem lokal yang dimiliki $f$?`),
            given: String.raw`n=v`,
            blanks: [{ label: 'n =', answer: 2 }],
          },
        },
        {
          kind: 'activity',
          title: L('An inverse', 'Sebuah invers'),
          step: {
            kind: 'quiz',
            id: 'p12',
            prompt: L(T`Why does $f(x)=x^3+x$ have an inverse?`, T`Mengapa $f(x)=x^3+x$ memiliki invers?`),
            options: [
              L(T`$f'(x)=3x^2+1>0$, so $f$ is strictly increasing and therefore one-to-one`, T`$f'(x)=3x^2+1>0$, sehingga $f$ naik tegas dan karenanya satu-satu`),
              L(T`because $f'(0)=0$`, T`karena $f'(0)=0$`),
              L(T`because we can solve $y=x^3+x$ for $x$ with a simple formula`, T`karena kita dapat menyelesaikan $y=x^3+x$ untuk $x$ dengan rumus sederhana`),
              L(T`because $f$ is even`, T`karena $f$ genap`),
            ],
            answer: 0,
            explain: L(T`A strictly monotonic function never repeats a value. The inverse exists even though there is no simple formula for it.`, T`Fungsi monoton tegas tidak pernah mengulang nilai. Inversnya ada walaupun tidak ada rumus sederhana untuknya.`),
            hint: L(T`What does the sign of $f'$ say about the graph?`, T`Apa yang dikatakan tanda $f'$ tentang grafik?`),
          },
        },
      ],
    },

    /* ---------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: monotonic functions and the test at a glance', 'Ringkasan: fungsi monoton dan ujinya sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Definitions:** increasing means $f(x_1)<f(x_2)$ for $x_1<x_2$ in an interval; monotonic means increasing or decreasing; never "at a point".
- **Corollary 3:** $f'>0$ on an interval gives increasing, $f'<0$ gives decreasing; ends and isolated zeros of $f'$ are allowed.
- **Method:** critical points, one test point in each open interval between them, the sign of $f'$ there.
- **First Derivative Test:** $-\to+$ is a local minimum, $+\to-$ a local maximum, no change means no extreme value; at an end only one side exists.
- **Signs, not sizes:** a double factor such as $(x-1)^2$ does not change the sign, and a point where $f'$ does not exist can still be an extreme value.
- **Inequalities:** $f\ge g$ from $h=f-g$ with $h(a)\ge0$ and $h'\ge0$.
- **Uses:** the direction of a particle, the vertex of a parabola, and inverses of strictly monotonic functions.
- **Next:** the second derivative says how the graph bends, the subject of the next article.
- **Code:** ´sp.solve_univariate_inequality(df > 0, x, relational=False)´, or the sign of ´df´ at the midpoint of each interval.`,
            T`- **Definisi:** naik berarti $f(x_1)<f(x_2)$ untuk $x_1<x_2$ dalam suatu selang; monoton berarti naik atau turun; tidak pernah "di satu titik".
- **Akibat 3:** $f'>0$ pada suatu selang memberi naik, $f'<0$ memberi turun; ujung dan nol terpencil $f'$ diperbolehkan.
- **Metode:** titik kritis, satu titik uji di setiap selang terbuka di antaranya, tanda $f'$ di sana.
- **Uji Turunan Pertama:** $-\to+$ minimum lokal, $+\to-$ maksimum lokal, tidak berganti berarti bukan nilai ekstrem; di ujung hanya ada satu sisi.
- **Tanda, bukan besar:** faktor ganda seperti $(x-1)^2$ tidak mengubah tanda, dan titik tempat $f'$ tidak ada tetap bisa menjadi nilai ekstrem.
- **Pertidaksamaan:** $f\ge g$ dari $h=f-g$ dengan $h(a)\ge0$ dan $h'\ge0$.
- **Kegunaan:** arah partikel, puncak parabola, dan invers fungsi monoton tegas.
- **Berikutnya:** turunan kedua menyatakan bagaimana grafik melengkung, topik artikel berikutnya.
- **Kode:** ´sp.solve_univariate_inequality(df > 0, x, relational=False)´, atau tanda ´df´ di titik tengah setiap selang.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Increasing function', 'Fungsi naik'), definition: L('A function whose value is larger at a larger input anywhere on an interval: f of x one is less than f of x two whenever x one is less than x two.', 'Fungsi yang nilainya lebih besar pada masukan yang lebih besar di mana pun pada suatu selang: f(x1) kurang dari f(x2) setiap kali x1 kurang dari x2.') },
    { term: L('Decreasing function', 'Fungsi turun'), definition: L('A function whose value is smaller at a larger input anywhere on an interval; its graph falls from left to right.', 'Fungsi yang nilainya lebih kecil pada masukan yang lebih besar di mana pun pada suatu selang; grafiknya turun dari kiri ke kanan.') },
    { term: L('Monotonic function', 'Fungsi monoton'), definition: L('A function that is either increasing on an interval or decreasing on it; a strictly monotonic function is one-to-one.', 'Fungsi yang naik pada suatu selang atau turun pada selang itu; fungsi monoton tegas bersifat satu-satu.') },
    { term: L('First Derivative Test', 'Uji Turunan Pertama'), definition: L('The test that finds local extremes from the sign of the derivative on both sides of a critical point: negative then positive is a minimum, positive then negative a maximum, no change means none.', 'Uji yang mencari ekstrem lokal dari tanda turunan di kedua sisi titik kritis: negatif lalu positif minimum, positif lalu negatif maksimum, tidak berubah berarti bukan ekstrem.') },
    { term: L('Sign chart', 'Bagan tanda'), definition: L('A table of the sign of the derivative on each interval between the critical points, with what the function does on each.', 'Tabel tanda turunan pada setiap selang di antara titik kritis, dengan apa yang dilakukan fungsi pada masing-masingnya.') },
    { term: L('One-to-one function', 'Fungsi satu-satu'), definition: L('A function that never takes the same value at two different inputs, so that it has an inverse.', 'Fungsi yang tidak pernah bernilai sama pada dua masukan berbeda, sehingga memiliki invers.') },
  ],

  howTo: [
    {
      name: L('How to find where a function is increasing and decreasing', 'Cara mencari di mana fungsi naik dan turun'),
      description: L('Find the critical points, test the sign of the derivative once in each interval between them, and read off the behavior.', 'Cari titik kritis, uji tanda turunan sekali di setiap selang di antaranya, dan baca perilakunya.'),
      steps: [
        { name: L('Differentiate', 'Turunkan'), text: L('Find f prime and note where it is zero or does not exist; these are the critical points.', 'Cari f aksen dan catat di mana ia nol atau tidak ada; itulah titik kritis.') },
        { name: L('Split the domain', 'Bagi domain'), text: L('Cut the domain at the critical points into open intervals, on each of which f prime has one sign.', 'Potong domain di titik kritis menjadi selang terbuka, yang pada masing-masingnya f aksen bertanda satu.') },
        { name: L('Test one point per interval', 'Uji satu titik per selang'), text: L('Evaluate f prime at one convenient point of each interval and record whether it is positive or negative.', 'Hitung f aksen di satu titik yang mudah pada setiap selang dan catat positif atau negatif.') },
        { name: L('Read the behavior', 'Baca perilakunya'), text: L('Positive means f is increasing on that interval and negative means decreasing; the end points may be included.', 'Positif berarti f naik pada selang itu dan negatif berarti turun; ujungnya boleh disertakan.') },
      ],
    },
    {
      name: L('How to classify a critical point with the First Derivative Test', 'Cara menggolongkan titik kritis dengan Uji Turunan Pertama'),
      description: L('Compare the sign of the derivative just left and just right of the critical point.', 'Bandingkan tanda turunan tepat di kiri dan tepat di kanan titik kritis.'),
      steps: [
        { name: L('Find the signs on both sides', 'Cari tanda di kedua sisi'), text: L('Take the intervals next to the critical point from the sign chart and note the sign of f prime on each.', 'Ambil selang di sebelah titik kritis dari bagan tanda dan catat tanda f aksen pada masing-masingnya.') },
        { name: L('Negative then positive', 'Negatif lalu positif'), text: L('The function falls and then rises, so there is a local minimum at the point.', 'Fungsi turun lalu naik, sehingga ada minimum lokal di titik itu.') },
        { name: L('Positive then negative', 'Positif lalu negatif'), text: L('The function rises and then falls, so there is a local maximum at the point.', 'Fungsi naik lalu turun, sehingga ada maksimum lokal di titik itu.') },
        { name: L('The same sign on both sides', 'Tanda sama di kedua sisi'), text: L('The function keeps rising or keeps falling, so the point is not an extreme value.', 'Fungsi terus naik atau terus turun, sehingga titik itu bukan nilai ekstrem.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is a monotonic function?', 'Apa itu fungsi monoton?'),
      a: L(
        'A monotonic function is one that is either increasing on an interval or decreasing on it, so its graph never turns round there. Strictly monotonic functions never take the same value twice, so they are one-to-one and have inverses.',
        'Fungsi monoton adalah fungsi yang naik pada suatu selang atau turun pada selang itu, sehingga grafiknya tidak pernah berbalik di sana. Fungsi monoton tegas tidak pernah bernilai sama dua kali, sehingga satu-satu dan memiliki invers.',
      ),
    },
    {
      q: L('How does the derivative tell where a function increases or decreases?', 'Bagaimana turunan menunjukkan di mana fungsi naik atau turun?'),
      a: L(
        'If the derivative is positive at every point of an interval, the function is increasing there, and if it is negative, decreasing. The proof applies the Mean Value Theorem to any two points of the interval, which links the change in the function to the sign of the derivative.',
        'Jika turunan positif di setiap titik pada suatu selang, fungsi naik di sana, dan jika negatif, turun. Buktinya menerapkan Teorema Nilai Rata-rata pada dua titik mana pun pada selang, yang menghubungkan perubahan fungsi dengan tanda turunan.',
      ),
    },
    {
      q: L('What is the First Derivative Test?', 'Apa itu Uji Turunan Pertama?'),
      a: L(
        'It decides whether a critical point is a local extreme value by the sign of the derivative on each side. A change from negative to positive is a local minimum, positive to negative is a local maximum, and no change means no extreme value.',
        'Uji ini menentukan apakah titik kritis adalah nilai ekstrem lokal berdasarkan tanda turunan di setiap sisi. Perubahan dari negatif ke positif adalah minimum lokal, positif ke negatif adalah maksimum lokal, dan tidak berubah berarti bukan nilai ekstrem.',
      ),
    },
    {
      q: L('How do you make a sign chart for the derivative?', 'Bagaimana membuat bagan tanda untuk turunan?'),
      a: L(
        'Find the critical points, where the derivative is zero or does not exist. They cut the domain into open intervals. Evaluate the derivative at one point in each interval and write its sign; the sign holds on the whole interval.',
        'Cari titik kritis, tempat turunan nol atau tidak ada. Titik itu memotong domain menjadi selang terbuka. Hitung turunan di satu titik pada setiap selang dan tulis tandanya; tanda itu berlaku di seluruh selang.',
      ),
    },
    {
      q: L('Why is a point with a zero derivative not always an extreme value?', 'Mengapa titik berturunan nol tidak selalu nilai ekstrem?'),
      a: L(
        'Because the derivative can touch zero without changing sign. The function x cubed has a zero derivative at 0 but is positive-sloped on both sides, so it keeps rising. An extreme value needs the sign to change.',
        'Karena turunan dapat menyentuh nol tanpa berganti tanda. Fungsi x pangkat tiga memiliki turunan nol di 0 tetapi bergradien positif di kedua sisi, sehingga terus naik. Nilai ekstrem memerlukan tanda yang berganti.',
      ),
    },
    {
      q: L('Can a function have a local minimum where it is not differentiable?', 'Dapatkah fungsi memiliki minimum lokal di tempat ia tidak terdiferensialkan?'),
      a: L(
        'Yes. The absolute value function has a corner at 0 and its slope goes from negative to positive there, so 0 is a local minimum. The point is critical because the derivative does not exist, and the test applies.',
        'Ya. Fungsi nilai mutlak memiliki sudut di 0 dan gradiennya berubah dari negatif ke positif di sana, sehingga 0 adalah minimum lokal. Titik itu kritis karena turunan tidak ada, dan ujinya berlaku.',
      ),
    },
    {
      q: L('How do you prove an inequality with derivatives?', 'Bagaimana membuktikan pertidaksamaan dengan turunan?'),
      a: L(
        'Subtract the two sides to get a difference function. If it is at least zero at the start and its derivative is never negative after that, the difference never goes below zero, which proves the inequality. For example e to the x is at least 1 plus x for x at least 0.',
        'Kurangkan kedua ruas untuk mendapat fungsi selisih. Jika ia paling sedikit nol di awal dan turunannya tidak pernah negatif setelah itu, selisihnya tidak pernah di bawah nol, yang membuktikan pertidaksamaan. Misalnya e pangkat x paling sedikit 1 tambah x untuk x paling sedikit 0.',
      ),
    },
    {
      q: L('Does a monotonic function always have an inverse?', 'Apakah fungsi monoton selalu memiliki invers?'),
      a: L(
        'A strictly monotonic function does, on its interval, because it is one-to-one. The inverse may have no simple formula: x cubed plus x is increasing everywhere, so it has an inverse, although solving for x is not easy.',
        'Fungsi monoton tegas memilikinya, pada selangnya, karena satu-satu. Inversnya mungkin tidak punya rumus sederhana: x pangkat tiga tambah x naik di mana-mana, sehingga memiliki invers, walaupun menyelesaikan untuk x tidak mudah.',
      ),
    },
  ],

  references: [
    { title: "Thomas' Calculus: Early Transcendentals in SI Units (15th ed.), Section 4.3: Monotonic Functions and the First Derivative Test", author: 'Joel Hass, Christopher Heil, Maurice D. Weir et al.', year: 2023, source: 'Pearson' },
    { title: 'Calculus (8th ed.), section 4.3: How Derivatives Affect the Shape of a Graph', author: 'James Stewart', year: 2015, source: 'Cengage Learning' },
    { title: 'Nova methodus pro maximis et minimis, itemque tangentibus', author: 'Gottfried Wilhelm Leibniz', year: 1684, source: 'Acta Eruditorum' },
    { title: "Résumé des leçons données à l'École royale polytechnique sur le calcul infinitésimal", author: 'Augustin-Louis Cauchy', year: 1823, source: 'Paris' },
  ],

  related: ['the-mean-value-theorem', 'extreme-values-on-closed-intervals', 'the-derivative-as-a-rate-of-change', 'derivatives-of-inverse-functions-and-logarithms'],
}
