import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './extreme-values-on-closed-intervals.meta'

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
    T`**A continuous function on a closed, bounded interval $[a,b]$ always has an absolute maximum and an absolute minimum (the Extreme Value Theorem), and they can occur only at the endpoints or at critical points, where $f'=0$ or $f'$ does not exist.** So to find them, list the critical points inside $(a,b)$, evaluate $f$ at those points and at $a$ and $b$, and take the largest and the smallest value.`,
    T`**Fungsi kontinu pada selang tertutup dan terbatas $[a,b]$ selalu memiliki maksimum mutlak dan minimum mutlak (Teorema Nilai Ekstrem), dan keduanya hanya dapat terjadi di ujung selang atau di titik kritis, tempat $f'=0$ atau $f'$ tidak ada.** Jadi untuk mencarinya, daftar titik kritis di dalam $(a,b)$, hitung $f$ di titik-titik itu dan di $a$ serta $b$, lalu ambil nilai terbesar dan terkecil.`,
  ),

  keyPoints: [
    L(
      T`An absolute maximum $f(c)$ satisfies $f(x)\le f(c)$ for every $x$ in the domain, and an absolute minimum satisfies $f(x)\ge f(c)$; they depend on the domain, not only on the formula.`,
      T`Maksimum mutlak $f(c)$ memenuhi $f(x)\le f(c)$ untuk setiap $x$ di domain, dan minimum mutlak memenuhi $f(x)\ge f(c)$; keduanya bergantung pada domain, bukan hanya pada rumus.`,
    ),
    L(
      T`Extreme Value Theorem: if $f$ is continuous on a closed interval $[a,b]$, it attains both an absolute maximum $M$ and an absolute minimum $m$ there; closed, bounded and continuous are all needed.`,
      T`Teorema Nilai Ekstrem: jika $f$ kontinu pada selang tertutup $[a,b]$, ia mencapai maksimum mutlak $M$ dan minimum mutlak $m$ di sana; tertutup, terbatas, dan kontinu semuanya diperlukan.`,
    ),
    L(
      T`First Derivative Theorem: if $f$ has a local maximum or minimum at an interior point $c$ where $f'$ exists, then $f'(c)=0$.`,
      T`Teorema Turunan Pertama: jika $f$ memiliki maksimum atau minimum lokal di titik dalam $c$ tempat $f'$ ada, maka $f'(c)=0$.`,
    ),
    L(
      T`A critical point is an interior point where $f'$ is $0$ or does not exist; it is only a candidate, as $x^3$ and $\sqrt[3]{x}$ show at $0$.`,
      T`Titik kritis adalah titik dalam tempat $f'$ bernilai $0$ atau tidak ada; ia hanya kandidat, seperti ditunjukkan $x^3$ dan $\sqrt[3]{x}$ di $0$.`,
    ),
    L(
      T`Closed interval method: find the critical points in the interval, evaluate $f$ at them and at the endpoints, and compare; the largest value is the maximum and the smallest the minimum.`,
      T`Metode selang tertutup: cari titik kritis di dalam selang, hitung $f$ di titik-titik itu dan di ujung selang, lalu bandingkan; nilai terbesar adalah maksimum dan nilai terkecil adalah minimum.`,
    ),
    L(
      T`Every endpoint is a candidate, a corner or a cusp can hold an extreme ($|x|$ at $0$, $x^{2/3}$ at $0$), and a critical point outside the interval does not count.`,
      T`Setiap ujung selang adalah kandidat, sudut atau titik puncak dapat memuat ekstrem ($|x|$ di $0$, $x^{2/3}$ di $0$), dan titik kritis di luar selang tidak dihitung.`,
    ),
  ],

  sections: [
    /* ---------------------------------------------------------------- absolute extrema */
    {
      id: 'absolute-extrema',
      heading: L('What are the absolute maximum and minimum of a function?', 'Apa itu maksimum dan minimum mutlak suatu fungsi?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A function $f$ with domain $D$ has an absolute maximum value at $c$ if $f(x)\le f(c)$ for all $x$ in $D$, and an absolute minimum value at $c$ if $f(x)\ge f(c)$ for all $x$ in $D$.** Maximum and minimum values are called *extreme values* (or *extrema*) of the function, and absolute maxima and minima are also called *global* maxima and minima. The value is a number, $f(c)$, and the place where it is taken is a point, $c$: the maximum of $y=x^2$ on $[0,2]$ is $4$, taken at $x=2$.

The extremes depend on the domain and not only on the formula. On the closed interval $\left[-\frac\pi2,\frac\pi2\right]$ the function $\cos x$ takes the absolute maximum $1$ (once, at $0$) and the absolute minimum $0$ (twice, at both ends), while $\sin x$ takes the maximum $1$ and the minimum $-1$. A value can be taken at more than one place.

**Example 1.** All four functions below have the same rule $y=x^2$, but the domains differ.

| Domain $D$ | Absolute extrema of $y=x^2$ on $D$ |
|---|---|
| $(-\infty,\infty)$ | no absolute maximum; absolute minimum $0$ at $x=0$ |
| $[0,2]$ | absolute maximum $4$ at $x=2$; absolute minimum $0$ at $x=0$ |
| $(0,2]$ | absolute maximum $4$ at $x=2$; no absolute minimum |
| $(0,2)$ | no absolute maximum and no absolute minimum |

So a function might have no maximum or minimum if the domain is not bounded or does not contain an endpoint. On $(0,2]$ the values $0.01$, $0.0001$, $0.000001$, … keep getting smaller, and there is no smallest one: $0$ would be the smallest, but $0$ is not in the domain. The next section says exactly when this cannot happen.`,
            T`**Fungsi $f$ dengan domain $D$ memiliki nilai maksimum mutlak di $c$ jika $f(x)\le f(c)$ untuk semua $x$ di $D$, dan nilai minimum mutlak di $c$ jika $f(x)\ge f(c)$ untuk semua $x$ di $D$.** Nilai maksimum dan minimum disebut *nilai ekstrem* (atau *ekstrem*) fungsi, dan maksimum serta minimum mutlak juga disebut maksimum dan minimum *global*. Nilainya adalah bilangan, $f(c)$, dan tempat nilai itu dicapai adalah titik, $c$: maksimum $y=x^2$ pada $[0,2]$ adalah $4$, dicapai di $x=2$.

Ekstrem bergantung pada domain dan bukan hanya pada rumus. Pada selang tertutup $\left[-\frac\pi2,\frac\pi2\right]$ fungsi $\cos x$ mencapai maksimum mutlak $1$ (sekali, di $0$) dan minimum mutlak $0$ (dua kali, di kedua ujung), sedangkan $\sin x$ mencapai maksimum $1$ dan minimum $-1$. Suatu nilai dapat dicapai di lebih dari satu tempat.

**Contoh 1.** Keempat fungsi di bawah memiliki aturan yang sama $y=x^2$, tetapi domainnya berbeda.

| Domain $D$ | Ekstrem mutlak $y=x^2$ pada $D$ |
|---|---|
| $(-\infty,\infty)$ | tidak ada maksimum mutlak; minimum mutlak $0$ di $x=0$ |
| $[0,2]$ | maksimum mutlak $4$ di $x=2$; minimum mutlak $0$ di $x=0$ |
| $(0,2]$ | maksimum mutlak $4$ di $x=2$; tidak ada minimum mutlak |
| $(0,2)$ | tidak ada maksimum mutlak dan tidak ada minimum mutlak |

Jadi suatu fungsi mungkin tidak memiliki maksimum atau minimum jika domainnya tidak terbatas atau tidak memuat ujungnya. Pada $(0,2]$ nilai $0{,}01$; $0{,}0001$; $0{,}000001$; … terus mengecil, dan tidak ada yang terkecil: $0$ akan menjadi yang terkecil, tetapi $0$ tidak ada di domain. Bagian berikut menyatakan tepatnya kapan hal ini tidak dapat terjadi.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------ extreme value theorem */
    {
      id: 'extreme-value-theorem',
      heading: L('When is a maximum or a minimum guaranteed?', 'Kapan maksimum atau minimum dijamin ada?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The Extreme Value Theorem says that if $f$ is continuous on a closed interval $[a,b]$, then $f$ attains both an absolute maximum value $M$ and an absolute minimum value $m$ in $[a,b]$.** That is, there are numbers $x_1$ and $x_2$ in $[a,b]$ with $f(x_1)=m$, $f(x_2)=M$, and $m\le f(x)\le M$ for all $x$ in $[a,b]$. The proof needs a careful knowledge of the real numbers (their completeness) and is not given here. It also does not say where the extremes are: they may be at interior points, at the endpoints, or one of each.

The three requirements, *closed*, *bounded* and *continuous*, are all essential. Without one of them the conclusion can fail:
- *not closed*: $y=x^2$ on $(0,2]$ has no minimum, and on $(0,2)$ neither;
- *not bounded*: $y=x^2$ on $(-\infty,\infty)$ has no maximum, and $y=e^x$ on $(-\infty,\infty)$ has neither;
- *not continuous*: the function $y=x$ for $0\le x<1$ and $y=0$ at $x=1$ is continuous at every point of $[0,1]$ except $x=1$, yet it has no highest point: the values come as near to $1$ as we like and never reach it.

The theorem gives a guarantee and not an equivalence. A function that fails a hypothesis may still have extremes (the function above has the minimum $0$), but only when the three hold are we *sure*. Look at the six cases below, and at which condition each one breaks.`,
            T`**Teorema Nilai Ekstrem menyatakan bahwa jika $f$ kontinu pada selang tertutup $[a,b]$, maka $f$ mencapai nilai maksimum mutlak $M$ dan nilai minimum mutlak $m$ di $[a,b]$.** Artinya, ada bilangan $x_1$ dan $x_2$ di $[a,b]$ dengan $f(x_1)=m$, $f(x_2)=M$, dan $m\le f(x)\le M$ untuk semua $x$ di $[a,b]$. Buktinya memerlukan pemahaman cermat tentang bilangan real (kelengkapannya) dan tidak diberikan di sini. Teorema ini juga tidak menyatakan di mana ekstremnya: bisa di titik dalam, di ujung, atau satu di masing-masing.

Tiga syaratnya, *tertutup*, *terbatas*, dan *kontinu*, semuanya penting. Tanpa salah satunya kesimpulan dapat gagal:
- *tidak tertutup*: $y=x^2$ pada $(0,2]$ tidak punya minimum, dan pada $(0,2)$ tidak punya keduanya;
- *tidak terbatas*: $y=x^2$ pada $(-\infty,\infty)$ tidak punya maksimum, dan $y=e^x$ pada $(-\infty,\infty)$ tidak punya keduanya;
- *tidak kontinu*: fungsi $y=x$ untuk $0\le x<1$ dan $y=0$ di $x=1$ kontinu di setiap titik $[0,1]$ kecuali $x=1$, namun tidak punya titik tertinggi: nilainya mendekati $1$ sedekat yang kita mau dan tidak pernah mencapainya.

Teorema ini memberi jaminan dan bukan kesetaraan. Fungsi yang melanggar suatu syarat mungkin tetap punya ekstrem (fungsi di atas memiliki minimum $0$), tetapi hanya ketika ketiganya terpenuhi kita *yakin*. Perhatikan enam kasus di bawah, dan syarat mana yang dilanggar masing-masing.`,
          ),
        },
        { kind: 'widget', name: 'evtcases' },
      ],
    },

    /* ----------------------------------------------------------------- local extrema */
    {
      id: 'local-extrema',
      heading: L('What are local extreme values?', 'Apa itu nilai ekstrem lokal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A function $f$ has a local maximum at $c$ if $f(x)\le f(c)$ for all $x$ of the domain in some open interval around $c$, and a local minimum if $f(x)\ge f(c)$ there; local extrema are also called relative extrema.** The word *local* means that only the neighbours of $c$ are compared, and not the whole domain. At an endpoint $x=a$ of $[a,b]$ the neighbours are the $x$ in a half-open interval $[a,a+\delta)$, and at $x=b$ those in $(b-\delta,b]$.

An absolute maximum is also a local maximum, because it is the largest value overall and so also the largest in its neighbourhood; the list of local maxima therefore includes the absolute maximum if there is one, and the same holds for minima. The converse is false. For $f(x)=x^3-3x$ on $[-2,3]$ the local maximum $f(-1)=2$ is far below the absolute maximum $f(3)=18$, and the local minimum $f(1)=-2$ equals the endpoint value $f(-2)=-2$, so the absolute minimum is taken twice.

A function can have many local extrema, even on a finite interval: $f(x)=\sin\frac1x$ on $(0,1]$ has infinitely many.`,
            T`**Fungsi $f$ memiliki maksimum lokal di $c$ jika $f(x)\le f(c)$ untuk semua $x$ di domain pada suatu selang terbuka di sekitar $c$, dan minimum lokal jika $f(x)\ge f(c)$ di sana; ekstrem lokal juga disebut ekstrem relatif.** Kata *lokal* berarti hanya tetangga $c$ yang dibandingkan, dan bukan seluruh domain. Di ujung $x=a$ pada $[a,b]$ tetangganya adalah $x$ pada selang setengah terbuka $[a,a+\delta)$, dan di $x=b$ adalah yang pada $(b-\delta,b]$.

Maksimum mutlak juga maksimum lokal, karena ia nilai terbesar secara keseluruhan sehingga juga terbesar di lingkungannya; daftar maksimum lokal karenanya memuat maksimum mutlak jika ada, dan hal yang sama berlaku untuk minimum. Kebalikannya salah. Untuk $f(x)=x^3-3x$ pada $[-2,3]$ maksimum lokal $f(-1)=2$ jauh di bawah maksimum mutlak $f(3)=18$, dan minimum lokal $f(1)=-2$ sama dengan minimum mutlak $f(-2)=-2$, sehingga minimum itu dicapai dua kali.

Suatu fungsi dapat memiliki banyak ekstrem lokal, bahkan pada selang terhingga: $f(x)=\sin\frac1x$ pada $(0,1]$ memiliki tak terhingga banyaknya.`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------- critical points */
    {
      id: 'critical-points',
      heading: L('What is a critical point, and why do extremes sit on them?', 'Apa itu titik kritis, dan mengapa ekstrem berada di sana?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**First Derivative Theorem for local extreme values: if $f$ has a local maximum or minimum at an interior point $c$ of its domain, and $f'$ is defined at $c$, then $f'(c)=0$.** The tangent line there has to be horizontal, because a slope that is not zero would let $f$ climb on one side of $c$.

*Proof.* Suppose $f$ has a local maximum at $c$, so $f(x)-f(c)\le0$ for $x$ near $c$. Because $c$ is an interior point, $f'(c)=\lim_{x\to c}\frac{f(x)-f(c)}{x-c}$ is a two-sided limit: the right-hand and left-hand limits both exist and equal $f'(c)$. From the right, $x-c>0$ and $f(x)-f(c)\le0$, so the quotient is $\le0$:
$$f'(c)=\lim_{x\to c^+}\frac{f(x)-f(c)}{x-c}\le0.$$
From the left, $x-c<0$ and $f(x)-f(c)\le0$, so the quotient is $\ge0$:
$$f'(c)=\lim_{x\to c^-}\frac{f(x)-f(c)}{x-c}\ge0.$$
Together $f'(c)=0$. For a local minimum reverse the inequalities. ∎

**Where extremes can be.** Since all the domains here are intervals, a function can have an extreme value (local or absolute) only at
1. interior points where $f'=0$,
2. interior points where $f'$ does not exist,
3. endpoints of the interval.

**Definition.** An interior point of the domain of $f$ where $f'$ is zero or does not exist is a *critical point* of $f$. So the only places where a continuous function on a closed, bounded interval can take an extreme value are its critical points and its endpoints. The second kind of critical point is a real possibility: the [derivative does not exist](article:tangent-lines-and-derivative-at-a-point#no-derivative) at a corner, a cusp or a vertical tangent line, and the [derivative function](article:the-derivative-as-a-function#where-defined) may be undefined elsewhere too.

**A critical point is only a candidate.** $y=x^3$ has $y'=3x^2=0$ at $x=0$, and $y=x^{1/3}$ has $y'=\frac13x^{-2/3}$ undefined at $x=0$, yet neither has a local extreme value at $0$: each is increasing through the origin, and each has a point of inflection there. Conversely, an extreme value can sit where there is no derivative at all: $f(x)=|x|$ has an absolute minimum at $x=0$ although it is not differentiable there, which is consistent with the theorem, because the theorem only speaks about points where $f'$ is defined.`,
            T`**Teorema Turunan Pertama untuk nilai ekstrem lokal: jika $f$ memiliki maksimum atau minimum lokal di titik dalam $c$ pada domainnya, dan $f'$ terdefinisi di $c$, maka $f'(c)=0$.** Garis singgung di sana harus mendatar, karena gradien yang tidak nol akan membuat $f$ naik di salah satu sisi $c$.

*Bukti.* Misalkan $f$ memiliki maksimum lokal di $c$, sehingga $f(x)-f(c)\le0$ untuk $x$ di dekat $c$. Karena $c$ titik dalam, $f'(c)=\lim_{x\to c}\frac{f(x)-f(c)}{x-c}$ adalah limit dua sisi: limit kanan dan limit kiri keduanya ada dan sama dengan $f'(c)$. Dari kanan, $x-c>0$ dan $f(x)-f(c)\le0$, sehingga hasil baginya $\le0$:
$$f'(c)=\lim_{x\to c^+}\frac{f(x)-f(c)}{x-c}\le0.$$
Dari kiri, $x-c<0$ dan $f(x)-f(c)\le0$, sehingga hasil baginya $\ge0$:
$$f'(c)=\lim_{x\to c^-}\frac{f(x)-f(c)}{x-c}\ge0.$$
Bersama-sama $f'(c)=0$. Untuk minimum lokal balikkan pertidaksamaannya. ∎

**Di mana ekstrem dapat berada.** Karena semua domain di sini adalah selang, suatu fungsi dapat memiliki nilai ekstrem (lokal atau mutlak) hanya di
1. titik dalam tempat $f'=0$,
2. titik dalam tempat $f'$ tidak ada,
3. ujung selang.

**Definisi.** Titik dalam domain $f$ tempat $f'$ nol atau tidak ada disebut *titik kritis* $f$. Jadi satu-satunya tempat fungsi kontinu pada selang tertutup dan terbatas dapat mencapai nilai ekstrem adalah titik kritis dan ujung selangnya. Jenis titik kritis yang kedua adalah kemungkinan nyata: [turunan tidak ada](article:tangent-lines-and-derivative-at-a-point#no-derivative) pada sudut, titik puncak, atau garis singgung tegak, dan [fungsi turunan](article:the-derivative-as-a-function#where-defined) dapat tak terdefinisi di tempat lain juga.

**Titik kritis hanyalah kandidat.** $y=x^3$ memiliki $y'=3x^2=0$ di $x=0$, dan $y=x^{1/3}$ memiliki $y'=\frac13x^{-2/3}$ yang tak terdefinisi di $x=0$, namun keduanya tidak memiliki nilai ekstrem lokal di $0$: masing-masing naik melalui titik asal, dan masing-masing memiliki titik belok di sana. Sebaliknya, nilai ekstrem dapat berada di tempat yang sama sekali tidak ada turunannya: $f(x)=|x|$ memiliki minimum mutlak di $x=0$ walaupun tidak terdiferensialkan di sana, yang konsisten dengan teorema, karena teorema hanya berbicara tentang titik tempat $f'$ terdefinisi.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------- closed interval method */
    {
      id: 'closed-interval-method',
      heading: L('How do you find the absolute extrema on a closed interval?', 'Bagaimana mencari ekstrem mutlak pada selang tertutup?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To find the absolute extrema of a continuous function $f$ on a finite closed interval, find all the critical points of $f$ in the interval, evaluate $f$ at all critical points and at the endpoints, and take the largest and the smallest of these values.** The Extreme Value Theorem makes sure that the extremes exist, and the First Derivative Theorem makes sure that no other place has to be examined.

**Example 2.** Find the absolute maximum and minimum of $f(x)=x^2$ on $[-2,1]$. The function is differentiable everywhere, so the only critical point is where $f'(x)=2x=0$, namely $x=0$. The values are
$$f(0)=0\qquad f(-2)=4\qquad f(1)=1,$$
so the absolute maximum is $4$ at $x=-2$ and the absolute minimum is $0$ at $x=0$.

**Example 3.** Find the absolute maximum and minimum of $f(x)=10x(2-\ln x)$ on $\left[1,e^2\right]$. The derivative is
$$f'(x)=10(2-\ln x)+10x\left(-\frac1x\right)$$
$$f'(x)=10(1-\ln x),$$
which is $0$ only where $\ln x=1$, at $x=e$, inside the interval. The values are
$$f(e)=10e\qquad f(1)=20$$
$$f\left(e^2\right)=10e^2(2-2)=0.$$
Since $10e\approx27.2$, the absolute maximum is $10e$ at the critical point $x=e$, and the absolute minimum is $0$ at the right endpoint $x=e^2$.

**Example 4.** Find the absolute maximum and minimum of $f(x)=x^{2/3}$ on $[-2,3]$. The derivative $f'(x)=\frac23x^{-1/3}$ has no zero, but it is undefined at the interior point $x=0$, which is therefore the only critical point. The values are
$$f(0)=0\qquad f(-2)=\sqrt[3]{4}\approx1.59$$
$$f(3)=\sqrt[3]{9}\approx2.08.$$
The absolute maximum is $\sqrt[3]{9}\approx2.08$ at the right endpoint $x=3$ and the absolute minimum is $0$ at $x=0$, where the graph has a cusp.

Try the method yourself below: type a function and a closed interval, or choose one of the examples, and read the table of candidates.`,
            T`**Untuk mencari ekstrem mutlak fungsi kontinu $f$ pada selang tertutup terhingga, cari semua titik kritis $f$ di dalam selang, hitung $f$ di semua titik kritis dan di ujung selang, lalu ambil nilai terbesar dan terkecil dari nilai-nilai itu.** Teorema Nilai Ekstrem memastikan bahwa ekstremnya ada, dan Teorema Turunan Pertama memastikan bahwa tidak ada tempat lain yang perlu diperiksa.

**Contoh 2.** Tentukan maksimum dan minimum mutlak $f(x)=x^2$ pada $[-2,1]$. Fungsi terdiferensialkan di mana-mana, sehingga satu-satunya titik kritis adalah tempat $f'(x)=2x=0$, yaitu $x=0$. Nilainya adalah
$$f(0)=0\qquad f(-2)=4\qquad f(1)=1,$$
sehingga maksimum mutlaknya $4$ di $x=-2$ dan minimum mutlaknya $0$ di $x=0$.

**Contoh 3.** Tentukan maksimum dan minimum mutlak $f(x)=10x(2-\ln x)$ pada $\left[1,e^2\right]$. Turunannya
$$f'(x)=10(2-\ln x)+10x\left(-\frac1x\right)$$
$$f'(x)=10(1-\ln x),$$
yang bernilai $0$ hanya ketika $\ln x=1$, di $x=e$, di dalam selang. Nilainya adalah
$$f(e)=10e\qquad f(1)=20$$
$$f\left(e^2\right)=10e^2(2-2)=0.$$
Karena $10e\approx27{,}2$, maksimum mutlaknya $10e$ di titik kritis $x=e$, dan minimum mutlaknya $0$ di ujung kanan $x=e^2$.

**Contoh 4.** Tentukan maksimum dan minimum mutlak $f(x)=x^{2/3}$ pada $[-2,3]$. Turunan $f'(x)=\frac23x^{-1/3}$ tidak memiliki nol, tetapi tak terdefinisi di titik dalam $x=0$, yang karenanya satu-satunya titik kritis. Nilainya adalah
$$f(0)=0\qquad f(-2)=\sqrt[3]{4}\approx1{,}59$$
$$f(3)=\sqrt[3]{9}\approx2{,}08.$$
Maksimum mutlaknya $\sqrt[3]{9}\approx2{,}08$ di ujung kanan $x=3$ dan minimum mutlaknya $0$ di $x=0$, tempat grafik memiliki titik puncak.

Cobalah metodenya sendiri di bawah: ketik fungsi dan selang tertutup, atau pilih salah satu contoh, dan baca tabel kandidatnya.`,
          ),
        },
        { kind: 'widget', name: 'extremetool' },
      ],
    },

    /* ----------------------------------------------------------------------- applications */
    {
      id: 'applications',
      heading: L('What is the biggest box, the peak current and the highest point?', 'Apa kotak terbesar, arus puncak, dan titik tertinggi?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The closed interval method answers questions that ask for the best value of something: cut squares of side $x$ from the corners of a $10$ by $16$ sheet and fold up the sides, and the volume is $V(x)=x(10-2x)(16-2x)$ for $0\le x\le5$, whose largest value is $144$ at $x=2$.** The derivative is
$$V'(x)=12x^2-104x+160$$
$$V'(x)=4(3x-20)(x-2),$$
so the critical points are $x=2$ and $x=\frac{20}{3}$; the second is outside $[0,5]$ and does not count. The values at the candidates are $V(0)=0$, $V(2)=144$ and $V(5)=0$. The absolute maximum is $144$ cubic units, from squares of side $2$ and a box $6$ by $12$ by $2$, and the extreme values at the endpoints are the smallest: no box at all. Change the sheet below; for a sheet $w$ by $l$ the critical point inside is $x=\frac{(w+l)-\sqrt{w^2-wl+l^2}}{6}$.

**The peak of an alternating current.** If $i=2\cos t+2\sin t$ amperes at time $t$ seconds, then $i'=-2\sin t+2\cos t=0$ when $\tan t=1$, that is $t=\frac\pi4$ and $t=\frac{5\pi}{4}$ in $[0,2\pi]$. The values are $i\left(\frac\pi4\right)=2\sqrt2$, $i\left(\frac{5\pi}{4}\right)=-2\sqrt2$ and $i(0)=i(2\pi)=2$, so the peak current, the largest magnitude, is $2\sqrt2\approx2.83$ A.

**The highest point of a body.** A body moving vertically has the height $s=-\frac12gt^2+v_0t+s_0$, with $s$ in meters and $t$ in seconds. Then $s'=-gt+v_0=0$ at $t=\frac{v_0}{g}$, the moment the velocity is zero, and the maximum height is $s_0+\frac{v_0^2}{2g}$. With $v_0=20$ m/s, $s_0=5$ m and $g=9.8$ m/s², that is $5+\frac{400}{19.6}\approx25.4$ m, reached after about $2.04$ s.

**Beyond closed intervals.** If the interval is not closed or not bounded, an extreme value may not exist at all, as the four domains of $y=x^2$ show. Such problems need more than the three steps above: the sign of $f'$ on both sides of each critical point, or the limits at the open ends.`,
            T`**Metode selang tertutup menjawab pertanyaan yang meminta nilai terbaik dari sesuatu: potong persegi bersisi $x$ dari sudut karton $10$ kali $16$ dan lipat sisinya, dan volumenya adalah $V(x)=x(10-2x)(16-2x)$ untuk $0\le x\le5$, yang nilai terbesarnya $144$ di $x=2$.** Turunannya
$$V'(x)=12x^2-104x+160$$
$$V'(x)=4(3x-20)(x-2),$$
sehingga titik kritisnya $x=2$ dan $x=\frac{20}{3}$; yang kedua di luar $[0,5]$ dan tidak dihitung. Nilai di kandidatnya adalah $V(0)=0$, $V(2)=144$, dan $V(5)=0$. Maksimum mutlaknya $144$ satuan kubik, dari persegi bersisi $2$ dan kotak $6$ kali $12$ kali $2$, dan nilai ekstrem di ujung selang adalah yang terkecil: tidak ada kotak sama sekali. Ubah karton di bawah; untuk karton $w$ kali $l$ titik kritis di dalamnya adalah $x=\frac{(w+l)-\sqrt{w^2-wl+l^2}}{6}$.

**Puncak arus bolak-balik.** Jika $i=2\cos t+2\sin t$ ampere pada waktu $t$ detik, maka $i'=-2\sin t+2\cos t=0$ ketika $\tan t=1$, yaitu $t=\frac\pi4$ dan $t=\frac{5\pi}{4}$ di $[0,2\pi]$. Nilainya $i\left(\frac\pi4\right)=2\sqrt2$, $i\left(\frac{5\pi}{4}\right)=-2\sqrt2$, dan $i(0)=i(2\pi)=2$, sehingga arus puncak, besar terbesar, adalah $2\sqrt2\approx2{,}83$ A.

**Titik tertinggi sebuah benda.** Benda yang bergerak vertikal memiliki tinggi $s=-\frac12gt^2+v_0t+s_0$, dengan $s$ dalam meter dan $t$ dalam detik. Maka $s'=-gt+v_0=0$ di $t=\frac{v_0}{g}$, saat kecepatannya nol, dan tinggi maksimumnya $s_0+\frac{v_0^2}{2g}$. Dengan $v_0=20$ m/detik, $s_0=5$ m, dan $g=9{,}8$ m/detik², itu $5+\frac{400}{19{,}6}\approx25{,}4$ m, dicapai setelah sekitar $2{,}04$ detik.

**Di luar selang tertutup.** Jika selang tidak tertutup atau tidak terbatas, nilai ekstrem mungkin tidak ada sama sekali, seperti ditunjukkan keempat domain $y=x^2$. Soal seperti itu memerlukan lebih dari tiga langkah di atas: tanda $f'$ di kedua sisi tiap titik kritis, atau limit di ujung yang terbuka.`,
          ),
        },
        { kind: 'widget', name: 'boxvolume' },
      ],
    },

    /* ---------------------------------------------------------------------------- in code */
    {
      id: 'extremes-in-code',
      heading: L('How do you find extreme values in code?', 'Bagaimana mencari nilai ekstrem dengan kode?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**In code the closed interval method is three loops: scan for the critical points, evaluate at every candidate, and keep the largest and the smallest.** SymPy does it exactly: ´sp.solveset(df, x, interval)´ returns every solution of $f'=0$ in the interval (the older ´sp.solve´ can return only one of the periodic solutions of $\cos x-\sin x=0$), ´sp.singularities(df, x)´ finds where $f'$ does not exist, and ´maximum´ and ´minimum´ from ´sympy.calculus.util´ give the answer directly. Without a CAS, scan for sign changes of $f'$ and refine them by bisection, which is what the C++ program at the end does.`,
            T`**Dalam kode metode selang tertutup adalah tiga perulangan: pindai titik kritis, hitung di setiap kandidat, dan simpan yang terbesar dan terkecil.** SymPy melakukannya secara eksak: ´sp.solveset(df, x, interval)´ mengembalikan setiap solusi $f'=0$ di dalam selang (´sp.solve´ yang lama dapat mengembalikan hanya satu dari solusi periodik $\cos x-\sin x=0$), ´sp.singularities(df, x)´ menemukan tempat $f'$ tidak ada, dan ´maximum´ serta ´minimum´ dari ´sympy.calculus.util´ memberi jawabannya langsung. Tanpa CAS, pindai perubahan tanda $f'$ dan haluskan dengan bisection, yang dilakukan program C++ di akhir.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python and SymPy: the closed interval method', 'Python dan SymPy: metode selang tertutup'),
          code: `import sympy as sp
from sympy.calculus.util import maximum, minimum

x = sp.symbols('x', real=True)


def closed_interval(f, a, b):
    """The closed interval method: the critical points inside (a, b), then compare the values."""
    df = sp.diff(f, x)
    crit = set(sp.solveset(df, x, sp.Interval.open(a, b)))              # f'(c) = 0, every solution in the interval
    crit |= {c for c in sp.singularities(df, x) if a < c < b}          # f' does not exist
    values = {p: sp.simplify(f.subs(x, p)) for p in sorted({a, b, *crit}, key=float)}
    return values, max(values.values(), key=float), min(values.values(), key=float)


examples = (
    (x**2, -2, 1),                                       # Example 2
    (10 * x * (2 - sp.log(x)), 1, sp.E**2),              # Example 3
    (x * (10 - 2 * x) * (16 - 2 * x), 0, 5),             # the box of Exercise 67
    (2 * sp.cos(x) + 2 * sp.sin(x), 0, 2 * sp.pi),       # Exercise 70, the peak current
    (x**3, -1, 1),                                       # a critical point that is not an extreme value
)
for f, a, b in examples:
    print(f, '->', closed_interval(f, a, b))
# x**2 -> ({-2: 4, 0: 0, 1: 1}, 4, 0)
# 10*x*(2 - log(x)) -> ({1: 20, E: 10*E, exp(2): 0}, 10*E, 0)
# x*(10 - 2*x)*(16 - 2*x) -> ({0: 0, 2: 144, 5: 0}, 144, 0)
# 2*sin(x) + 2*cos(x) -> ({0: 2, pi/4: 2*sqrt(2), 5*pi/4: -2*sqrt(2), 2*pi: 2}, 2*sqrt(2), -2*sqrt(2))
# x**3 -> ({-1: -1, 0: 0, 1: 1}, 1, -1)

print(maximum(x**2, x, sp.Interval(-2, 1)), minimum(x**2, x, sp.Interval(-2, 1)))      # 4 0   (SymPy's own answer)
print(sp.singularities(sp.diff(x ** sp.Rational(2, 3), x), x))                         # {0}   (Example 4: f' does not exist at 0)`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: compare the candidates', 'JavaScript: bandingkan kandidatnya'),
          code: `const best = (f, a, b, critical) => {
  const pts = [a, ...critical, b].map((x) => [x, f(x)])
  return [pts.reduce((m, p) => (p[1] > m[1] ? p : m)), pts.reduce((m, p) => (p[1] < m[1] ? p : m))]   // [max, min]
}
best((x) => x * x, -2, 1, [0])                                       // [[-2, 4], [0, 0]]
best((x) => 10 * x * (2 - Math.log(x)), 1, Math.E ** 2, [Math.E])    // [[2.718281828459045, 27.18281828459045], [7.3890560989306495, 0]]
best((x) => Math.cbrt(x) ** 2, -2, 3, [0])                           // [[3, 2.080083823051904], [0, 0]]: 0 is where f' does not exist
best((x) => x ** 3, -1, 1, [0])                                      // [[1, 1], [-1, -1]]: 0 is critical but not an extreme`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++', 'C++'),
          code: `#include <iostream>
#include <cstdio>
#include <cmath>
using namespace std;

double f(double x) { return 10 * x * (2 - log(x)); }     // Example 3, on [1, e^2]
double df(double x) { return 10 * (1 - log(x)); }

double clean(double v) { return fabs(v) < 1e-9 ? 0 : v; }  // round noise like 1e-15 to 0

double bisect(double lo, double hi) {                       // a zero of f' between lo and hi
  for (int i = 0; i < 100; i++) {
    double mid = (lo + hi) / 2;
    if (df(lo) * df(mid) <= 0) hi = mid; else lo = mid;
  }
  return (lo + hi) / 2;
}

int main() {
  double a = 1, b = exp(2.0), cand[12];
  int n = 0;
  cand[n++] = a;                                            // the endpoints are candidates
  double step = (b - a) / 1000;
  for (int i = 0; i < 1000; i++) {                          // step 1: the critical points, where f' changes sign
    double x0 = a + i * step, x1 = x0 + step;
    if (df(x0) * df(x1) < 0) cand[n++] = bisect(x0, x1);
  }
  cand[n++] = b;
  double hiX = cand[0], loX = cand[0];
  for (int i = 0; i < n; i++) {                             // steps 2 and 3: evaluate f and compare
    printf("x = %.4f   value %.4f\\n", cand[i], clean(f(cand[i])));
    if (f(cand[i]) > f(hiX)) hiX = cand[i];
    if (f(cand[i]) < f(loX)) loX = cand[i];
  }
  printf("maximum %.4f at x = %.4f; minimum %.4f at x = %.4f\\n", f(hiX), hiX, clean(f(loX)), loX);

  // Example 4: x^(2/3) on [-2, 3]; the only critical point is 0, where f' does not exist
  printf("%.4f %.4f %.4f\\n", pow(fabs(-2.0), 2.0 / 3), 0.0, pow(3.0, 2.0 / 3));
  // the box of Exercise 67: V(x) = x (10 - 2x)(16 - 2x) at 0, at the critical point 2 and at 5
  printf("%.0f %.0f %.0f\\n", 0.0, 2 * (10 - 4.0) * (16 - 4.0), 5 * (10 - 10.0) * (16 - 10.0));
  return 0;
}

/* output:
x = 1.0000   value 20.0000
x = 2.7183   value 27.1828
x = 7.3891   value 0.0000
maximum 27.1828 at x = 2.7183; minimum 0.0000 at x = 7.3891
1.5874 0.0000 2.0801
0 144 0
*/`,
        },
      ],
    },

    /* ---------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where do maxima and minima come from?', 'Dari mana asal maksimum dan minimum?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The search for the biggest and the smallest is older than the derivative, and the derivative began as a tool for it.**

- **Kepler, 1615.** Johannes Kepler, looking for the best shape of a wine barrel, noticed that near the largest volume the volume changes very little when the shape changes a little: the flat top of a curve, the horizontal tangent of the theorem above.
- **Fermat, about 1629.** Pierre de Fermat found maxima and minima by comparing $f(x)$ with $f(x+e)$, dividing the (nearly) zero difference by $e$ and then putting $e=0$. That is the condition $f'(x)=0$ before there was a derivative, and the First Derivative Theorem is still called Fermat's theorem on stationary points.
- **Newton and Leibniz.** With the derivative as a limit of difference quotients, the argument of the proof above became a few lines. The distinction between a critical point and an extreme, between $x^3$ and $x^2$, was made clear by the second-derivative and sign tests that followed.
- **Bolzano and Weierstrass.** The Extreme Value Theorem looks obvious from a graph but cannot be proved without the completeness of the real numbers. Bernard Bolzano gave the first arguments in manuscripts of the 1830s, and Karl Weierstrass proved it in his lectures in the 1860s; this is why the proof is not part of an introductory course.`,
            T`**Pencarian yang terbesar dan terkecil lebih tua daripada turunan, dan turunan dimulai sebagai alat untuk itu.**

- **Kepler, 1615.** Johannes Kepler, saat mencari bentuk terbaik tong anggur, memperhatikan bahwa di dekat volume terbesar volume berubah sangat sedikit ketika bentuk berubah sedikit: puncak mendatar suatu kurva, garis singgung mendatar pada teorema di atas.
- **Fermat, sekitar 1629.** Pierre de Fermat menemukan maksimum dan minimum dengan membandingkan $f(x)$ dengan $f(x+e)$, membagi selisih yang (hampir) nol itu dengan $e$ lalu mengambil $e=0$. Itu adalah syarat $f'(x)=0$ sebelum ada turunan, dan Teorema Turunan Pertama masih disebut teorema Fermat tentang titik stasioner.
- **Newton dan Leibniz.** Dengan turunan sebagai limit hasil bagi selisih, argumen pada bukti di atas menjadi beberapa baris. Perbedaan antara titik kritis dan ekstrem, antara $x^3$ dan $x^2$, dijelaskan oleh uji turunan kedua dan uji tanda yang menyusul.
- **Bolzano dan Weierstrass.** Teorema Nilai Ekstrem tampak jelas dari grafik tetapi tidak dapat dibuktikan tanpa kelengkapan bilangan real. Bernard Bolzano memberi argumen pertama dalam naskah tahun 1830-an, dan Karl Weierstrass membuktikannya dalam kuliahnya pada 1860-an; itulah sebabnya buktinya bukan bagian dari kursus pengantar.`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What mistakes do people make with extreme values?', 'Kesalahan apa yang sering terjadi pada nilai ekstrem?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with extreme values are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ Look only at the points where $f'=0$ | Evaluate at the endpoints too: for $x^2$ on $[-2,1]$ the maximum $4$ is at $x=-2$, where $f'=-4$. |
| ❌ If $f'(c)=0$, then $f$ has a maximum or a minimum at $c$ | $f'(0)=0$ for $y=x^3$, which has no extreme value at $0$: a critical point is only a candidate. |
| ❌ Ignore the points where $f'$ does not exist | They are critical points: $x^{2/3}$ has its minimum at $0$, and $|x|$ too. |
| ❌ Use the closed interval method on $(0,2)$ or on $[0,\infty)$ | The theorem needs a closed, bounded interval; $x^2$ on $(0,2)$ has no extreme value. |
| ❌ Use it on $\frac1x$ over $[-1,2]$ | $f$ is not continuous there (not even defined at $0$), so no extremes are guaranteed. |
| ❌ Give the place instead of the value, or the reverse | The maximum value is $4$ and it is taken at $x=2$: report both. |
| ❌ A function has only one place for its maximum | $\cos x$ on $\left[-\frac\pi2,\frac\pi2\right]$ takes its minimum $0$ at both ends. |
| ❌ Count a critical point that is outside the interval | $V'=0$ at $x=\frac{20}{3}$ for the box, but the interval is $[0,5]$: only $x=2$ counts. |
| ❌ A local maximum is the absolute maximum | For $x^3-3x$ on $[-2,3]$ the local maximum is $2$, the absolute maximum is $18$ at $x=3$. |`,
            T`**Kesalahan paling umum pada nilai ekstrem adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ Hanya melihat titik tempat $f'=0$ | Hitung juga di ujung selang: untuk $x^2$ pada $[-2,1]$ maksimum $4$ ada di $x=-2$, tempat $f'=-4$. |
| ❌ Jika $f'(c)=0$, maka $f$ memiliki maksimum atau minimum di $c$ | $f'(0)=0$ untuk $y=x^3$, yang tidak memiliki nilai ekstrem di $0$: titik kritis hanyalah kandidat. |
| ❌ Mengabaikan titik tempat $f'$ tidak ada | Itu titik kritis: $x^{2/3}$ memiliki minimum di $0$, begitu pula $|x|$. |
| ❌ Memakai metode selang tertutup pada $(0,2)$ atau $[0,\infty)$ | Teorema memerlukan selang tertutup dan terbatas; $x^2$ pada $(0,2)$ tidak memiliki nilai ekstrem. |
| ❌ Memakainya pada $\frac1x$ di $[-1,2]$ | $f$ tidak kontinu di sana (bahkan tak terdefinisi di $0$), sehingga ekstrem tidak dijamin. |
| ❌ Memberi tempatnya, bukan nilainya, atau sebaliknya | Nilai maksimumnya $4$ dan dicapai di $x=2$: laporkan keduanya. |
| ❌ Fungsi hanya punya satu tempat untuk maksimumnya | $\cos x$ pada $\left[-\frac\pi2,\frac\pi2\right]$ mencapai minimum $0$ di kedua ujung. |
| ❌ Menghitung titik kritis di luar selang | $V'=0$ di $x=\frac{20}{3}$ untuk kotak, tetapi selangnya $[0,5]$: hanya $x=2$ yang dihitung. |
| ❌ Maksimum lokal adalah maksimum mutlak | Untuk $x^3-3x$ pada $[-2,3]$ maksimum lokalnya $2$, maksimum mutlaknya $18$ di $x=3$. |`,
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
              L('A continuous function on a closed, bounded interval always has an absolute maximum and an absolute minimum.', 'Fungsi kontinu pada selang tertutup dan terbatas selalu memiliki maksimum mutlak dan minimum mutlak.'),
              L('$y=x^2$ has an absolute maximum on $(0,2)$.', '$y=x^2$ memiliki maksimum mutlak pada $(0,2)$.'),
              L('If $f\'(c)=0$, then $f$ has a local extreme value at $c$.', 'Jika $f\'(c)=0$, maka $f$ memiliki nilai ekstrem lokal di $c$.'),
              L('At an interior local extreme where $f\'$ exists, $f\'=0$.', 'Pada ekstrem lokal di titik dalam tempat $f\'$ ada, $f\'=0$.'),
              L('A function can have an absolute minimum at a point where it has no derivative.', 'Fungsi dapat memiliki minimum mutlak di titik yang tidak memiliki turunan.'),
              L('The extremes of a continuous function on $[a,b]$ can only be at critical points or at the endpoints.', 'Ekstrem fungsi kontinu pada $[a,b]$ hanya dapat berada di titik kritis atau di ujung selang.'),
            ],
            answer: [true, false, false, true, true, true],
            explain: L(
              'On $(0,2)$ the values come close to $4$ but never reach it. $y=x^3$ has $f\'(0)=0$ and no extreme value, and $|x|$ has its minimum where there is no derivative.',
              'Pada $(0,2)$ nilainya mendekati $4$ tetapi tidak pernah mencapainya. $y=x^3$ memiliki $f\'(0)=0$ dan tidak punya nilai ekstrem, dan $|x|$ memiliki minimum di tempat yang tidak ada turunannya.',
            ),
            hint: L('Check each hypothesis of the theorem, and remember $x^3$ and $|x|$.', 'Periksa tiap syarat teorema, dan ingat $x^3$ dan $|x|$.'),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L('Choose **all** the places where an absolute extreme of a continuous function on $[a,b]$ might occur.', 'Pilih **semua** tempat yang mungkin memuat ekstrem mutlak fungsi kontinu pada $[a,b]$.'),
            options: [
              L('the endpoints $a$ and $b$', 'ujung $a$ dan $b$'),
              L('interior points where $f\'=0$', 'titik dalam tempat $f\'=0$'),
              L('interior points where $f\'$ does not exist', 'titik dalam tempat $f\'$ tidak ada'),
              L('interior points where $f\'\'=0$', 'titik dalam tempat $f\'\'=0$'),
              L('every point where $f$ is increasing', 'setiap titik tempat $f$ naik'),
            ],
            answer: [0, 1, 2],
            explain: L('These are the endpoints and the critical points. $f\'\'=0$ and being increasing do not make a point a candidate.', 'Itu adalah ujung selang dan titik kritis. $f\'\'=0$ dan naik tidak membuat suatu titik menjadi kandidat.'),
            hint: L('List the three places of the theorem of this article.', 'Daftar tiga tempat pada teorema artikel ini.'),
          },
        },
        {
          kind: 'activity',
          title: L('The largest value', 'Nilai terbesar'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L('$f\'(x)=2x-4=0$ at $x=2$.', '$f\'(x)=2x-4=0$ di $x=2$.'), L('Compare $f(0)=1$, $f(2)=-3$ and $f(5)=6$.', 'Bandingkan $f(0)=1$, $f(2)=-3$, dan $f(5)=6$.')],
            explain: L('The candidates give $f(0)=1$, $f(2)=-3$, $f(5)=6$: the absolute maximum is $6$.', 'Kandidatnya memberi $f(0)=1$, $f(2)=-3$, $f(5)=6$: maksimum mutlaknya $6$.'),
            prompt: L('Find the absolute maximum value of $f(x)=x^2-4x+1$ on $[0,5]$.', 'Tentukan nilai maksimum mutlak $f(x)=x^2-4x+1$ pada $[0,5]$.'),
            given: String.raw`M=v`,
            blanks: [{ label: 'M =', answer: 6 }],
          },
        },
        {
          kind: 'activity',
          title: L('The smallest value', 'Nilai terkecil'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L('The same function and interval: the critical point is $x=2$.', 'Fungsi dan selang yang sama: titik kritisnya $x=2$.'), L('$f(2)=4-8+1$.', '$f(2)=4-8+1$.')],
            explain: L('$f(2)=-3$ is smaller than $f(0)=1$ and $f(5)=6$.', '$f(2)=-3$ lebih kecil daripada $f(0)=1$ dan $f(5)=6$.'),
            prompt: L('Find the absolute minimum value of $f(x)=x^2-4x+1$ on $[0,5]$.', 'Tentukan nilai minimum mutlak $f(x)=x^2-4x+1$ pada $[0,5]$.'),
            given: String.raw`m=v`,
            blanks: [{ label: 'm =', answer: -3 }],
          },
        },
        {
          kind: 'activity',
          title: L('A critical point without an extreme', 'Titik kritis tanpa ekstrem'),
          step: {
            kind: 'quiz',
            id: 'p5',
            prompt: L('What is true of $f(x)=x^3$ at $x=0$?', 'Apa yang benar tentang $f(x)=x^3$ di $x=0$?'),
            options: [L('it is a critical point but not a local extreme', 'itu titik kritis tetapi bukan ekstrem lokal'), L('it is a local maximum', 'itu maksimum lokal'), L('it is a local minimum', 'itu minimum lokal'), L('it is not a critical point', 'itu bukan titik kritis')],
            answer: 0,
            explain: L('$f\'(0)=0$ makes it a critical point, but $x^3$ is increasing through $0$.', '$f\'(0)=0$ menjadikannya titik kritis, tetapi $x^3$ naik melalui $0$.'),
            hint: L('Is the function larger on one side of $0$ and smaller on the other?', 'Apakah fungsi lebih besar di satu sisi $0$ dan lebih kecil di sisi lain?'),
          },
        },
        {
          kind: 'activity',
          title: L('A cusp', 'Titik puncak'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L('The critical point is $x=0$, where $f\'$ does not exist; $f(0)=0$.', 'Titik kritisnya $x=0$, tempat $f\'$ tidak ada; $f(0)=0$.'), L('$f(\\pm8)=8^{2/3}=4$.', '$f(\\pm8)=8^{2/3}=4$.')],
            explain: L('$f(-8)=f(8)=\\sqrt[3]{64}=4$ and $f(0)=0$: the absolute maximum is $4$, taken at both ends.', '$f(-8)=f(8)=\\sqrt[3]{64}=4$ dan $f(0)=0$: maksimum mutlaknya $4$, dicapai di kedua ujung.'),
            prompt: L('Find the absolute maximum value of $f(x)=x^{2/3}$ on $[-8,8]$.', 'Tentukan nilai maksimum mutlak $f(x)=x^{2/3}$ pada $[-8,8]$.'),
            given: String.raw`M=v`,
            blanks: [{ label: 'M =', answer: 4 }],
          },
        },
        {
          kind: 'activity',
          title: L('A box from a square sheet', 'Kotak dari karton persegi'),
          step: {
            kind: 'math',
            id: 'p7',
            hints: [L('$V(x)=x(12-2x)^2$ and $V\'(x)=(12-2x)(12-6x)$.', '$V(x)=x(12-2x)^2$ dan $V\'(x)=(12-2x)(12-6x)$.'), L('The critical point inside $[0,6]$ is $x=2$.', 'Titik kritis di dalam $[0,6]$ adalah $x=2$.')],
            explain: L('$V(2)=2\\cdot8^2=128$, while $V(0)=V(6)=0$.', '$V(2)=2\\cdot8^2=128$, sedangkan $V(0)=V(6)=0$.'),
            prompt: L('Squares of side $x$ are cut from the corners of a $12$ by $12$ sheet and the sides are folded up. Find the largest volume of the box.', 'Persegi bersisi $x$ dipotong dari sudut karton $12$ kali $12$ dan sisinya dilipat. Tentukan volume terbesar kotak itu.'),
            given: String.raw`V_{\max}=v`,
            blanks: [{ label: 'V =', answer: 128 }],
          },
        },
        {
          kind: 'activity',
          title: L('Which condition fails?', 'Syarat mana yang gagal?'),
          step: {
            kind: 'quiz',
            id: 'p8',
            prompt: L('Why does the Extreme Value Theorem not apply to $f(x)=\\frac1x$ on $[-1,1]$?', 'Mengapa Teorema Nilai Ekstrem tidak berlaku untuk $f(x)=\\frac1x$ pada $[-1,1]$?'),
            options: [L('$f$ is not continuous on the interval (not even defined at $0$)', '$f$ tidak kontinu pada selang itu (bahkan tak terdefinisi di $0$)'), L('the interval is not closed', 'selangnya tidak tertutup'), L('the interval is not bounded', 'selangnya tidak terbatas'), L('$f\'$ is never zero', '$f\'$ tidak pernah nol')],
            answer: 0,
            explain: L('The interval $[-1,1]$ is closed and bounded, but $\\frac1x$ has a pole at $0$.', 'Selang $[-1,1]$ tertutup dan terbatas, tetapi $\\frac1x$ memiliki kutub di $0$.'),
            hint: L('Check the three conditions one by one.', 'Periksa ketiga syarat satu per satu.'),
          },
        },
        {
          kind: 'activity',
          title: L('The peak current', 'Arus puncak'),
          step: {
            kind: 'math',
            id: 'p9',
            hints: [L('$i\'=-3\\sin t+4\\cos t=0$ at $\\tan t=\\frac43$.', '$i\'=-3\\sin t+4\\cos t=0$ di $\\tan t=\\frac43$.'), L('There $\\cos t=\\frac35$ and $\\sin t=\\frac45$, so $i=\\frac95+\\frac{16}{5}$.', 'Di sana $\\cos t=\\frac35$ dan $\\sin t=\\frac45$, sehingga $i=\\frac95+\\frac{16}{5}$.')],
            explain: L('$i=3\\cdot\\frac35+4\\cdot\\frac45=5$ at the maximum, and $-5$ at the minimum: the peak current is $5$ A.', '$i=3\\cdot\\frac35+4\\cdot\\frac45=5$ di maksimum, dan $-5$ di minimum: arus puncaknya $5$ A.'),
            prompt: L('The current is $i=3\\cos t+4\\sin t$ amperes. Find its largest value over one period $[0,2\\pi]$.', 'Arus adalah $i=3\\cos t+4\\sin t$ ampere. Tentukan nilai terbesarnya selama satu periode $[0,2\\pi]$.'),
            given: String.raw`i_{\max}=v`,
            blanks: [{ label: 'i =', answer: 5 }],
          },
        },
        {
          kind: 'activity',
          title: L('Where is the minimum?', 'Di mana minimumnya?'),
          step: {
            kind: 'quiz',
            id: 'p10',
            prompt: L('Where is the absolute minimum of $f(x)=x^{2/3}$ on $[-2,3]$?', 'Di mana minimum mutlak $f(x)=x^{2/3}$ pada $[-2,3]$?'),
            options: [L('at $x=0$, where $f\'$ does not exist', 'di $x=0$, tempat $f\'$ tidak ada'), L('at $x=-2$', 'di $x=-2$'), L('at $x=3$', 'di $x=3$'), L('nowhere: $f\'$ is never $0$', 'tidak di mana pun: $f\'$ tidak pernah $0$')],
            answer: 0,
            explain: L('$f(0)=0$ is smaller than $f(-2)\\approx1.59$ and $f(3)\\approx2.08$, and $0$ is a critical point because $f\'$ does not exist there.', '$f(0)=0$ lebih kecil daripada $f(-2)\\approx1{,}59$ dan $f(3)\\approx2{,}08$, dan $0$ adalah titik kritis karena $f\'$ tidak ada di sana.'),
            hint: L('Do not forget the critical points where the derivative is undefined.', 'Jangan lupa titik kritis tempat turunan tak terdefinisi.'),
          },
        },
        {
          kind: 'activity',
          title: L('The highest point of a thrown ball', 'Titik tertinggi bola yang dilempar'),
          step: {
            kind: 'math',
            id: 'p11',
            hints: [L('$s\'=-9.8t+14.7=0$ at $t=1.5$.', '$s\'=-9.8t+14.7=0$ di $t=1{,}5$.'), L('$s(1.5)=-4.9\\cdot2.25+14.7\\cdot1.5+2$.', '$s(1{,}5)=-4{,}9\\cdot2{,}25+14{,}7\\cdot1{,}5+2$.')],
            explain: L('$s(1.5)=-11.025+22.05+2=13.025$ m.', '$s(1{,}5)=-11{,}025+22{,}05+2=13{,}025$ m.'),
            prompt: L('The height of a ball is $s=-4.9t^2+14.7t+2$ meters, $0\\le t\\le3$. Find its maximum height in meters.', 'Tinggi sebuah bola adalah $s=-4{,}9t^2+14{,}7t+2$ meter, $0\\le t\\le3$. Tentukan tinggi maksimumnya dalam meter.'),
            given: String.raw`s_{\max}=v`,
            blanks: [{ label: 's =', answer: 13.025 }],
          },
        },
        {
          kind: 'activity',
          title: L('Absolute and local', 'Mutlak dan lokal'),
          step: {
            kind: 'quiz',
            id: 'p12',
            prompt: L('Which statement is true?', 'Pernyataan mana yang benar?'),
            options: [L('an absolute maximum is also a local maximum', 'maksimum mutlak juga maksimum lokal'), L('a local maximum is always the absolute maximum', 'maksimum lokal selalu merupakan maksimum mutlak'), L('a function has at most one local maximum', 'fungsi memiliki paling banyak satu maksimum lokal'), L('a local maximum cannot be at an endpoint', 'maksimum lokal tidak dapat berada di ujung selang')],
            answer: 0,
            explain: L('The largest value overall is also the largest in its own neighbourhood. The converse is false, and a function can have many local maxima, some at endpoints.', 'Nilai terbesar secara keseluruhan juga terbesar di lingkungannya sendiri. Kebalikannya salah, dan suatu fungsi dapat memiliki banyak maksimum lokal, sebagian di ujung selang.'),
            hint: L('Think of the definition: compare with the neighbours only.', 'Pikirkan definisinya: bandingkan hanya dengan tetangga.'),
          },
        },
      ],
    },

    /* ---------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: extreme values at a glance', 'Ringkasan: nilai ekstrem sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Absolute extremes:** $f(c)\ge f(x)$ (maximum) or $\le$ (minimum) for all $x$ in the domain; they depend on the domain.
- **Extreme Value Theorem:** $f$ continuous on a closed, bounded $[a,b]$ has both an absolute maximum and an absolute minimum there.
- **First Derivative Theorem:** at an interior local extreme where $f'$ exists, $f'=0$.
- **Critical point:** an interior point where $f'=0$ or $f'$ does not exist; a candidate only ($x^3$ at $0$).
- **Closed interval method:** critical points in $(a,b)$, values at them and at $a$ and $b$, then the largest and the smallest.
- **Watch for:** endpoints, corners and cusps ($|x|$, $x^{2/3}$), critical points outside the interval, breaks inside it.
- **Code:** ´sp.solveset(df, x, interval)´, ´sp.singularities(df, x)´, or a scan for sign changes of $f'$ with bisection.`,
            T`- **Ekstrem mutlak:** $f(c)\ge f(x)$ (maksimum) atau $\le$ (minimum) untuk semua $x$ di domain; keduanya bergantung pada domain.
- **Teorema Nilai Ekstrem:** $f$ kontinu pada $[a,b]$ yang tertutup dan terbatas memiliki maksimum mutlak dan minimum mutlak di sana.
- **Teorema Turunan Pertama:** pada ekstrem lokal di titik dalam tempat $f'$ ada, $f'=0$.
- **Titik kritis:** titik dalam tempat $f'=0$ atau $f'$ tidak ada; hanya kandidat ($x^3$ di $0$).
- **Metode selang tertutup:** titik kritis di $(a,b)$, nilai di titik itu dan di $a$ serta $b$, lalu yang terbesar dan terkecil.
- **Waspadai:** ujung selang, sudut dan titik puncak ($|x|$, $x^{2/3}$), titik kritis di luar selang, putus di dalamnya.
- **Kode:** ´sp.solveset(df, x, interval)´, ´sp.singularities(df, x)´, atau pemindaian perubahan tanda $f'$ dengan bisection.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Absolute maximum and minimum', 'Maksimum dan minimum mutlak'), definition: L('The largest and the smallest value that a function takes on its whole domain; they are also called global extremes and depend on the domain.', 'Nilai terbesar dan terkecil yang dicapai fungsi pada seluruh domainnya; keduanya juga disebut ekstrem global dan bergantung pada domain.') },
    { term: L('Extreme Value Theorem', 'Teorema Nilai Ekstrem'), definition: L('The theorem that a function continuous on a closed, bounded interval attains both an absolute maximum and an absolute minimum there.', 'Teorema bahwa fungsi kontinu pada selang tertutup dan terbatas mencapai maksimum mutlak dan minimum mutlak di sana.') },
    { term: L('Local extreme value', 'Nilai ekstrem lokal'), definition: L('A value that is the largest or the smallest only among the values at points near it; also called a relative extreme.', 'Nilai yang terbesar atau terkecil hanya di antara nilai pada titik-titik di dekatnya; juga disebut ekstrem relatif.') },
    { term: L('Critical point', 'Titik kritis'), definition: L('An interior point of the domain of a function where the derivative is zero or does not exist; the only places, besides the endpoints, where an extreme value can occur.', 'Titik dalam domain fungsi tempat turunannya nol atau tidak ada; satu-satunya tempat, selain ujung selang, tempat nilai ekstrem dapat terjadi.') },
    { term: L('Closed interval method', 'Metode selang tertutup'), definition: L('The procedure that finds the critical points of a continuous function in a closed interval, evaluates it there and at the endpoints, and takes the largest and the smallest value.', 'Prosedur yang mencari titik kritis fungsi kontinu dalam selang tertutup, menghitungnya di sana dan di ujung selang, lalu mengambil nilai terbesar dan terkecil.') },
    { term: L('Cusp', 'Titik puncak'), definition: L('A point of a graph where the curve has a vertical tangent and the two branches meet at a point, such as x to the two thirds at zero; the derivative does not exist there.', 'Titik pada grafik tempat kurva memiliki garis singgung tegak dan kedua cabangnya bertemu di satu titik, seperti x pangkat dua per tiga di nol; turunan tidak ada di sana.') },
  ],

  howTo: [
    {
      name: L('How to find the absolute extrema of a continuous function on a closed interval', 'Cara mencari ekstrem mutlak fungsi kontinu pada selang tertutup'),
      description: L('Find the critical points inside the interval, evaluate the function at them and at the endpoints, and compare the values.', 'Cari titik kritis di dalam selang, hitung fungsi di titik-titik itu dan di ujung selang, lalu bandingkan nilainya.'),
      steps: [
        { name: L('Check the hypotheses', 'Periksa syaratnya'), text: L('Make sure that the interval is closed and bounded and that the function is continuous on it, so that the extremes are guaranteed to exist.', 'Pastikan selangnya tertutup dan terbatas dan fungsinya kontinu di sana, sehingga ekstremnya dijamin ada.') },
        { name: L('Find the critical points', 'Cari titik kritis'), text: L('Differentiate, solve the derivative equal to zero, and find where the derivative does not exist; keep only the points inside the interval.', 'Turunkan, selesaikan turunan sama dengan nol, dan cari tempat turunan tidak ada; simpan hanya titik yang berada di dalam selang.') },
        { name: L('Evaluate at every candidate', 'Hitung di setiap kandidat'), text: L('Compute the value of the function at each critical point and at both endpoints.', 'Hitung nilai fungsi di setiap titik kritis dan di kedua ujung selang.') },
        { name: L('Compare the values', 'Bandingkan nilainya'), text: L('The largest value is the absolute maximum and the smallest is the absolute minimum; report the value and the place where it is taken.', 'Nilai terbesar adalah maksimum mutlak dan terkecil adalah minimum mutlak; laporkan nilai dan tempat nilai itu dicapai.') },
      ],
    },
    {
      name: L('How to decide whether a maximum or a minimum is guaranteed', 'Cara memutuskan apakah maksimum atau minimum dijamin'),
      description: L('Test the three conditions of the Extreme Value Theorem one by one.', 'Uji tiga syarat Teorema Nilai Ekstrem satu per satu.'),
      steps: [
        { name: L('Is the interval closed?', 'Apakah selangnya tertutup?'), text: L('Both endpoints must belong to the domain; a missing endpoint can remove the extreme.', 'Kedua ujung harus termasuk domain; ujung yang hilang dapat menghilangkan ekstremnya.') },
        { name: L('Is it bounded?', 'Apakah terbatas?'), text: L('Both ends must be numbers, not infinity; on an unbounded interval the values may grow without bound.', 'Kedua ujung harus berupa bilangan, bukan tak hingga; pada selang tak terbatas nilainya dapat membesar tanpa batas.') },
        { name: L('Is the function continuous on it?', 'Apakah fungsinya kontinu di sana?'), text: L('Look for a pole, a hole or a jump inside the interval; even one break can remove the extreme.', 'Cari kutub, lubang, atau lompatan di dalam selang; satu putus saja dapat menghilangkan ekstremnya.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is the Extreme Value Theorem?', 'Apa itu Teorema Nilai Ekstrem?'),
      a: L(
        'It says that a function that is continuous on a closed, bounded interval has an absolute maximum and an absolute minimum on that interval. The function takes its largest and its smallest value at least once, at an endpoint or inside.',
        'Teorema ini menyatakan bahwa fungsi yang kontinu pada selang tertutup dan terbatas memiliki maksimum mutlak dan minimum mutlak pada selang itu. Fungsi mencapai nilai terbesar dan terkecilnya setidaknya sekali, di ujung selang atau di dalamnya.',
      ),
    },
    {
      q: L('How do you find the absolute maximum and minimum on a closed interval?', 'Bagaimana mencari maksimum dan minimum mutlak pada selang tertutup?'),
      a: L(
        'Find the critical points of the function inside the interval, evaluate the function at those points and at both endpoints, and compare. The largest of these values is the absolute maximum and the smallest is the absolute minimum.',
        'Cari titik kritis fungsi di dalam selang, hitung fungsi di titik-titik itu dan di kedua ujung selang, lalu bandingkan. Nilai terbesar adalah maksimum mutlak dan nilai terkecil adalah minimum mutlak.',
      ),
    },
    {
      q: L('What is a critical point?', 'Apa itu titik kritis?'),
      a: L(
        'A critical point is an interior point of the domain of a function where the derivative is zero or does not exist. Together with the endpoints, these are the only places where an extreme value can occur.',
        'Titik kritis adalah titik dalam domain fungsi tempat turunannya nol atau tidak ada. Bersama dengan ujung selang, itulah satu-satunya tempat nilai ekstrem dapat terjadi.',
      ),
    },
    {
      q: L('Is every critical point a maximum or a minimum?', 'Apakah setiap titik kritis adalah maksimum atau minimum?'),
      a: L(
        'No. A critical point is only a candidate. The function x cubed has a zero derivative at 0, and the cube root has no derivative at 0, but neither has a maximum or a minimum there, since both keep increasing.',
        'Tidak. Titik kritis hanyalah kandidat. Fungsi x pangkat tiga memiliki turunan nol di 0, dan akar pangkat tiga tidak memiliki turunan di 0, tetapi keduanya tidak memiliki maksimum atau minimum di sana, karena keduanya terus naik.',
      ),
    },
    {
      q: L('Can a function have an extreme value where it is not differentiable?', 'Dapatkah fungsi memiliki nilai ekstrem di tempat ia tidak terdiferensialkan?'),
      a: L(
        'Yes. The absolute value function has its minimum at 0, where it has a corner and no derivative, and x to the two thirds has its minimum at 0, a cusp. These are critical points of the second kind.',
        'Ya. Fungsi nilai mutlak memiliki minimum di 0, tempat ia memiliki sudut dan tidak punya turunan, dan x pangkat dua per tiga memiliki minimum di 0, titik puncak. Itu adalah titik kritis jenis kedua.',
      ),
    },
    {
      q: L('What is the difference between absolute and local extrema?', 'Apa beda ekstrem mutlak dan lokal?'),
      a: L(
        'An absolute extreme is the largest or smallest value on the whole domain, and a local extreme is the largest or smallest only among nearby points. An absolute maximum is also a local one, but a local maximum need not be absolute.',
        'Ekstrem mutlak adalah nilai terbesar atau terkecil pada seluruh domain, dan ekstrem lokal adalah yang terbesar atau terkecil hanya di antara titik-titik di dekatnya. Maksimum mutlak juga lokal, tetapi maksimum lokal belum tentu mutlak.',
      ),
    },
    {
      q: L('Why must the interval be closed for the Extreme Value Theorem?', 'Mengapa selang harus tertutup pada Teorema Nilai Ekstrem?'),
      a: L(
        'Because an endpoint that is left out can be where the extreme would be. On the interval from 0 to 2 without 0, the function x squared has values as small as we like but no smallest value, since 0 is not allowed.',
        'Karena ujung yang tidak disertakan bisa menjadi tempat ekstrem itu berada. Pada selang dari 0 sampai 2 tanpa 0, fungsi x kuadrat bernilai sekecil yang kita mau tetapi tidak punya nilai terkecil, karena 0 tidak diizinkan.',
      ),
    },
    {
      q: L('Do endpoints count as critical points?', 'Apakah ujung selang dihitung sebagai titik kritis?'),
      a: L(
        'By the definition, no: a critical point is an interior point. But the endpoints are always candidates for the absolute extremes, so in the closed interval method you evaluate the function at them too.',
        'Menurut definisi, tidak: titik kritis adalah titik dalam. Tetapi ujung selang selalu kandidat ekstrem mutlak, jadi dalam metode selang tertutup kamu menghitung fungsi di sana juga.',
      ),
    },
  ],

  references: [
    { title: "Thomas' Calculus: Early Transcendentals in SI Units (15th ed.), Section 4.1: Extreme Values of Functions on Closed Intervals", author: 'Joel Hass, Christopher Heil, Maurice D. Weir et al.', year: 2023, source: 'Pearson' },
    { title: 'Calculus (8th ed.), section 4.1: Maximum and Minimum Values', author: 'James Stewart', year: 2015, source: 'Cengage Learning' },
    { title: 'Methodus ad disquirendam maximam et minimam', author: 'Pierre de Fermat', year: 1679, source: 'Toulouse (written about 1629)' },
    { title: 'Nova stereometria doliorum vinariorum', author: 'Johannes Kepler', year: 1615, source: 'Linz' },
  ],

  related: ['linearization-and-differentials', 'tangent-lines-and-derivative-at-a-point', 'the-derivative-as-a-function', 'related-rates'],
}
