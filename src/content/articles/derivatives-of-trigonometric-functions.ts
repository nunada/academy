import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './derivatives-of-trigonometric-functions.meta'

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
    T`**The derivative of sine is cosine and the derivative of cosine is minus sine, for angles in radians: $\frac{d}{dx}\sin x=\cos x$ and $\frac{d}{dx}\cos x=-\sin x$.** The other four follow from the quotient rule: $\tan'x=\sec^2x$, $\cot'x=-\csc^2x$, $\sec'x=\sec x\tan x$ and $\csc'x=-\csc x\cot x$. Everything rests on two limits, $\frac{\sin h}{h}\to1$ and $\frac{\cos h-1}{h}\to0$, which are true only when $h$ is measured in radians.`,
    T`**Turunan sinus adalah kosinus dan turunan kosinus adalah minus sinus, untuk sudut dalam radian: $\frac{d}{dx}\sin x=\cos x$ dan $\frac{d}{dx}\cos x=-\sin x$.** Keempat fungsi lainnya mengikuti dari aturan hasil bagi: $\tan'x=\sec^2x$, $\cot'x=-\csc^2x$, $\sec'x=\sec x\tan x$, dan $\csc'x=-\csc x\cot x$. Semuanya bertumpu pada dua limit, $\frac{\sin h}{h}\to1$ dan $\frac{\cos h-1}{h}\to0$, yang hanya benar bila $h$ diukur dalam radian.`,
  ),

  keyPoints: [
    L(
      T`The two limits $\lim_{h\to0}\frac{\sin h}{h}=1$ and $\lim_{h\to0}\frac{\cos h-1}{h}=0$ follow from the squeeze $\sin h<h<\tan h$; with $h$ in degrees the first becomes $\frac{\pi}{180}\approx0.01745$.`,
      T`Dua limit $\lim_{h\to0}\frac{\sin h}{h}=1$ dan $\lim_{h\to0}\frac{\cos h-1}{h}=0$ mengikuti dari apitan $\sin h<h<\tan h$; dengan $h$ dalam derajat limit pertama menjadi $\frac{\pi}{180}\approx0{,}01745$.`,
    ),
    L(
      T`With the angle-sum formulas the difference quotient of sine splits into $\sin x\cdot\frac{\cos h-1}{h}+\cos x\cdot\frac{\sin h}{h}$, which tends to $\cos x$; cosine gives $-\sin x$ in the same way.`,
      T`Dengan rumus jumlah sudut, hasil bagi selisih sinus terpecah menjadi $\sin x\cdot\frac{\cos h-1}{h}+\cos x\cdot\frac{\sin h}{h}$, yang menuju $\cos x$; kosinus memberi $-\sin x$ dengan cara yang sama.`,
    ),
    L(
      T`The quotient rule gives $\tan'x=\sec^2x$, $\cot'x=-\csc^2x$, $\sec'x=\sec x\tan x$ and $\csc'x=-\csc x\cot x$: the three "co" functions get a minus sign.`,
      T`Aturan hasil bagi memberi $\tan'x=\sec^2x$, $\cot'x=-\csc^2x$, $\sec'x=\sec x\tan x$, dan $\csc'x=-\csc x\cot x$: ketiga fungsi "ko" mendapat tanda minus.`,
    ),
    L(
      T`A weight on a spring pulled down $5$ units has position $s=5\cos t$, velocity $-5\sin t$ and acceleration $-5\cos t=-s$: simple harmonic motion, with the greatest speed at the rest position.`,
      T`Beban pada pegas yang ditarik ke bawah $5$ satuan berposisi $s=5\cos t$, berkecepatan $-5\sin t$, dan berpercepatan $-5\cos t=-s$: gerak harmonik sederhana, dengan laju terbesar di posisi diam.`,
    ),
    L(
      T`The derivatives of sine and cosine repeat every four steps, so $\frac{d^{999}}{dx^{999}}\cos x=\sin x$: only the remainder of $n$ divided by $4$ matters.`,
      T`Turunan sinus dan kosinus berulang setiap empat langkah, sehingga $\frac{d^{999}}{dx^{999}}\cos x=\sin x$: hanya sisa $n$ dibagi $4$ yang berarti.`,
    ),
    L(
      T`These formulas are for $\sin x$ and the others with plain $x$ inside; a function such as $\sin 2x$ or $\sin^2x$ needs the chain rule.`,
      T`Rumus-rumus ini untuk $\sin x$ dan lainnya dengan $x$ polos di dalamnya; fungsi seperti $\sin 2x$ atau $\sin^2x$ memerlukan aturan rantai.`,
    ),
  ],

  sections: [
    /* --------------------------------------------------------------- the two limits */
    {
      id: 'sine-limits',
      heading: L('Why does the derivative of sine depend on the limit of sin h over h?', 'Mengapa turunan sinus bergantung pada limit sin h per h?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Because the difference quotient of $\sin x$, once the angle-sum formula is used, splits into two pieces, one multiplied by $\frac{\cos h-1}{h}$ and the other by $\frac{\sin h}{h}$, so the derivative is known as soon as those two limits are.** Both are limits of the form $\frac00$: the numerator and the denominator tend to zero together, and the answer depends on how fast each does it. The two facts are
$$\lim_{h\to0}\frac{\sin h}{h}=1$$
$$\lim_{h\to0}\frac{\cos h-1}{h}=0,$$
with $h$ measured in **radians**.

**The squeeze for $\frac{\sin h}{h}$.** Draw a circle of radius $1$ and an angle $h$ with $0<h<\frac{\pi}{2}$. It cuts a sector out of the circle, and three areas can be compared, all inside each other:

- the thin triangle with a vertical side of height $\sin h$ has area $\frac12\sin h$;
- the sector has area $\frac12h$, because a sector of angle $h$ radians is the fraction $\frac{h}{2\pi}$ of the circle's area $\pi$;
- the larger triangle that touches the circle at the end of the arc has height $\tan h$ and area $\frac12\tan h$.

The first lies inside the second, which lies inside the third, so
$$\sin h<h<\tan h.$$
Dividing by $\sin h$, which is positive, gives $1<\frac{h}{\sin h}<\frac{1}{\cos h}$, and taking reciprocals reverses the inequalities:
$$\cos h<\frac{\sin h}{h}<1.$$
As $h\to0^+$ the cosine tends to $1$, so the squeeze theorem forces $\frac{\sin h}{h}\to1$. The quotient does not change when $h$ becomes $-h$, because both $\sin h$ and $h$ change sign, so the limit from the left is the same, and the two-sided limit is $1$.

**Why $\cos h\to1$.** From the double-angle formula, $1-\cos h=2\sin^2\frac h2$, and $\sin\frac h2<\frac h2$ from the inequality above, so $0\le1-\cos h<\frac{h^2}{2}$, which tends to $0$.

**The second limit.** Multiply the top and the bottom by $1+\cos h$:
$$\frac{\cos h-1}{h}=-\frac{(1-\cos h)(1+\cos h)}{h\,(1+\cos h)}$$
$$=-\frac{\sin^2h}{h\,(1+\cos h)}$$
$$=-\frac{\sin h}{h}\cdot\frac{\sin h}{1+\cos h}.$$
The first factor tends to $1$ and the second to $\frac{0}{2}=0$, so the product tends to $0$. The same bound shows it quickly: $0\le\frac{1-\cos h}{h}<\frac h2$.

**Three limits that follow.**

- $\lim_{x\to0}\frac{\sin 3x}{x}=3\lim_{x\to0}\frac{\sin3x}{3x}=3\cdot1=3$, because $3x\to0$ when $x\to0$.
- $\lim_{x\to0}\frac{\tan x}{x}=\lim_{x\to0}\frac{\sin x}{x}\cdot\frac{1}{\cos x}=1\cdot1=1$.
- $\lim_{x\to0}\frac{1-\cos x}{x^2}=\lim_{x\to0}\frac{\sin^2x}{x^2(1+\cos x)}=1\cdot\frac12=\frac12$.

**Why radians.** The area of the [sector](article:circles#arcs-and-sectors), $\frac12h$, is true only for radian measure. If $h$ is in degrees, the angle in radians is $\frac{\pi h}{180}$, and the first limit becomes $\frac{\pi}{180}\approx0.01745$, not $1$. The derivative of sine would then carry that awkward factor every time. Calculus measures angles in radians so that the factor is $1$.

Move $h$ toward zero below, in radians and then in degrees, and watch the two quotients.`,
            T`**Karena hasil bagi selisih $\sin x$, setelah rumus jumlah sudut dipakai, terpecah menjadi dua bagian, yang satu dikalikan $\frac{\cos h-1}{h}$ dan yang lain dikalikan $\frac{\sin h}{h}$, sehingga turunannya diketahui begitu kedua limit itu diketahui.** Keduanya limit berbentuk $\frac00$: pembilang dan penyebut menuju nol bersama-sama, dan jawabannya bergantung pada seberapa cepat masing-masing menuju nol. Kedua faktanya adalah
$$\lim_{h\to0}\frac{\sin h}{h}=1$$
$$\lim_{h\to0}\frac{\cos h-1}{h}=0,$$
dengan $h$ diukur dalam **radian**.

**Apitan untuk $\frac{\sin h}{h}$.** Gambar lingkaran berjari-jari $1$ dan sudut $h$ dengan $0<h<\frac{\pi}{2}$. Sudut itu memotong sebuah juring dari lingkaran, dan tiga luas dapat dibandingkan, semuanya saling berada di dalam:

- segitiga tipis dengan sisi tegak setinggi $\sin h$ berluas $\frac12\sin h$;
- juring berluas $\frac12h$, karena juring bersudut $h$ radian adalah bagian $\frac{h}{2\pi}$ dari luas lingkaran $\pi$;
- segitiga yang lebih besar, yang menyentuh lingkaran di ujung busur, setinggi $\tan h$ dan berluas $\frac12\tan h$.

Yang pertama berada di dalam yang kedua, yang berada di dalam yang ketiga, sehingga
$$\sin h<h<\tan h.$$
Membagi dengan $\sin h$, yang positif, memberi $1<\frac{h}{\sin h}<\frac{1}{\cos h}$, dan mengambil kebalikan membalik pertidaksamaannya:
$$\cos h<\frac{\sin h}{h}<1.$$
Saat $h\to0^+$ kosinus menuju $1$, sehingga teorema apit memaksa $\frac{\sin h}{h}\to1$. Hasil bagi itu tidak berubah ketika $h$ menjadi $-h$, karena $\sin h$ dan $h$ sama-sama berganti tanda, sehingga limit dari kiri sama, dan limit dua sisinya adalah $1$.

**Mengapa $\cos h\to1$.** Dari rumus sudut ganda, $1-\cos h=2\sin^2\frac h2$, dan $\sin\frac h2<\frac h2$ dari pertidaksamaan di atas, sehingga $0\le1-\cos h<\frac{h^2}{2}$, yang menuju $0$.

**Limit kedua.** Kalikan pembilang dan penyebut dengan $1+\cos h$:
$$\frac{\cos h-1}{h}=-\frac{(1-\cos h)(1+\cos h)}{h\,(1+\cos h)}$$
$$=-\frac{\sin^2h}{h\,(1+\cos h)}$$
$$=-\frac{\sin h}{h}\cdot\frac{\sin h}{1+\cos h}.$$
Faktor pertama menuju $1$ dan faktor kedua menuju $\frac{0}{2}=0$, sehingga hasil kalinya menuju $0$. Batas yang sama menunjukkannya dengan cepat: $0\le\frac{1-\cos h}{h}<\frac h2$.

**Tiga limit yang mengikuti.**

- $\lim_{x\to0}\frac{\sin 3x}{x}=3\lim_{x\to0}\frac{\sin3x}{3x}=3\cdot1=3$, karena $3x\to0$ bila $x\to0$.
- $\lim_{x\to0}\frac{\tan x}{x}=\lim_{x\to0}\frac{\sin x}{x}\cdot\frac{1}{\cos x}=1\cdot1=1$.
- $\lim_{x\to0}\frac{1-\cos x}{x^2}=\lim_{x\to0}\frac{\sin^2x}{x^2(1+\cos x)}=1\cdot\frac12=\frac12$.

**Mengapa radian.** Luas [juring](article:circles#arcs-and-sectors), $\frac12h$, benar hanya untuk ukuran radian. Jika $h$ dalam derajat, sudut dalam radian adalah $\frac{\pi h}{180}$, dan limit pertama menjadi $\frac{\pi}{180}\approx0{,}01745$, bukan $1$. Turunan sinus lalu akan membawa faktor yang canggung itu setiap kali. Kalkulus mengukur sudut dalam radian agar faktornya $1$.

Gerakkan $h$ mendekati nol di bawah, dalam radian lalu dalam derajat, dan perhatikan kedua hasil baginya.`,
          ),
        },
        { kind: 'widget', name: 'limitsin' },
      ],
    },

    /* ----------------------------------------------------------- sine and cosine */
    {
      id: 'sine-and-cosine',
      heading: L('What are the derivatives of sin x and cos x?', 'Apa turunan sin x dan cos x?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The derivative of $\sin x$ is $\cos x$ and the derivative of $\cos x$ is $-\sin x$, for every real $x$ measured in radians.**
$$\frac{d}{dx}\sin x=\cos x\qquad\frac{d}{dx}\cos x=-\sin x.$$

**Proof for sine.** Use the angle-sum formula $\sin(x+h)=\sin x\cos h+\cos x\sin h$ in the [difference quotient](article:tangent-lines-and-derivative-at-a-point#derivative-at-a-point):
$$\frac{\sin(x+h)-\sin x}{h}$$
$$=\frac{\sin x\cos h+\cos x\sin h-\sin x}{h}$$
$$=\sin x\cdot\frac{\cos h-1}{h}+\cos x\cdot\frac{\sin h}{h}.$$
Here $x$ is fixed and $h$ is the one that changes, so $\sin x$ and $\cos x$ are constants as $h\to0$. By the two limits of the previous section the quotient tends to $\sin x\cdot0+\cos x\cdot1=\cos x$.

**Proof for cosine.** Use $\cos(x+h)=\cos x\cos h-\sin x\sin h$:
$$\frac{\cos(x+h)-\cos x}{h}$$
$$=\frac{\cos x\cos h-\sin x\sin h-\cos x}{h}$$
$$=\cos x\cdot\frac{\cos h-1}{h}-\sin x\cdot\frac{\sin h}{h}$$
$$\to\cos x\cdot0-\sin x\cdot1=-\sin x.$$

**What it looks like.** The slope of the sine wave is $1$ where it crosses the axis going up, $0$ at the peaks and valleys and $-1$ where it crosses going down, so the graph of the slopes is the cosine wave. The cosine starts at its peak with slope $0$ and then falls, so its slope is negative just after: minus the sine wave. Differentiating twice flips the sign: $\frac{d^2}{dx^2}\sin x=-\sin x$.

**Examples.** All of these use the [rules of differentiation](article:differentiation-rules#product-rule) together with the two new formulas.

- $y=x^2-\sin x$ gives $y'=2x-\cos x$.
- $y=e^x\sin x$ gives, by the product rule, $y'=e^x\sin x+e^x\cos x=e^x(\sin x+\cos x)$.
- $y=\frac{\sin x}{x}$ gives, by the quotient rule, $y'=\frac{x\cos x-\sin x}{x^2}$.
- $y=5e^x+\cos x$ gives $y'=5e^x-\sin x$.
- $y=\sin x\cos x$ gives $y'=\cos x\cdot\cos x+\sin x\cdot(-\sin x)=\cos^2x-\sin^2x$, which is $\cos 2x$.
- $y=\frac{\cos x}{1-\sin x}$ gives $y'=\frac{(-\sin x)(1-\sin x)-\cos x\,(-\cos x)}{(1-\sin x)^2}=\frac{1-\sin x}{(1-\sin x)^2}=\frac{1}{1-\sin x}$, because $\sin^2x+\cos^2x=1$.

Both functions are differentiable everywhere, so both are continuous everywhere, and the graph of the derivative of a wave is another wave, as in [graphing the derivative](article:the-derivative-as-a-function#graphing-the-derivative).`,
            T`**Turunan $\sin x$ adalah $\cos x$ dan turunan $\cos x$ adalah $-\sin x$, untuk setiap $x$ real yang diukur dalam radian.**
$$\frac{d}{dx}\sin x=\cos x\qquad\frac{d}{dx}\cos x=-\sin x.$$

**Bukti untuk sinus.** Pakai rumus jumlah sudut $\sin(x+h)=\sin x\cos h+\cos x\sin h$ pada [hasil bagi selisih](article:tangent-lines-and-derivative-at-a-point#derivative-at-a-point):
$$\frac{\sin(x+h)-\sin x}{h}$$
$$=\frac{\sin x\cos h+\cos x\sin h-\sin x}{h}$$
$$=\sin x\cdot\frac{\cos h-1}{h}+\cos x\cdot\frac{\sin h}{h}.$$
Di sini $x$ tetap dan $h$-lah yang berubah, sehingga $\sin x$ dan $\cos x$ adalah konstanta saat $h\to0$. Dengan dua limit pada bagian sebelumnya, hasil bagi itu menuju $\sin x\cdot0+\cos x\cdot1=\cos x$.

**Bukti untuk kosinus.** Pakai $\cos(x+h)=\cos x\cos h-\sin x\sin h$:
$$\frac{\cos(x+h)-\cos x}{h}$$
$$=\frac{\cos x\cos h-\sin x\sin h-\cos x}{h}$$
$$=\cos x\cdot\frac{\cos h-1}{h}-\sin x\cdot\frac{\sin h}{h}$$
$$\to\cos x\cdot0-\sin x\cdot1=-\sin x.$$

**Seperti apa tampaknya.** Gradien gelombang sinus adalah $1$ di tempat ia memotong sumbu sambil naik, $0$ di puncak dan lembah, dan $-1$ di tempat ia memotong sambil turun, sehingga grafik gradiennya adalah gelombang kosinus. Kosinus mulai dari puncaknya dengan gradien $0$ lalu turun, sehingga gradiennya negatif sesudahnya: minus gelombang sinus. Menurunkan dua kali membalik tanda: $\frac{d^2}{dx^2}\sin x=-\sin x$.

**Contoh.** Semuanya memakai [aturan penurunan](article:differentiation-rules#product-rule) bersama dua rumus baru.

- $y=x^2-\sin x$ memberi $y'=2x-\cos x$.
- $y=e^x\sin x$ memberi, dengan aturan hasil kali, $y'=e^x\sin x+e^x\cos x=e^x(\sin x+\cos x)$.
- $y=\frac{\sin x}{x}$ memberi, dengan aturan hasil bagi, $y'=\frac{x\cos x-\sin x}{x^2}$.
- $y=5e^x+\cos x$ memberi $y'=5e^x-\sin x$.
- $y=\sin x\cos x$ memberi $y'=\cos x\cdot\cos x+\sin x\cdot(-\sin x)=\cos^2x-\sin^2x$, yaitu $\cos 2x$.
- $y=\frac{\cos x}{1-\sin x}$ memberi $y'=\frac{(-\sin x)(1-\sin x)-\cos x\,(-\cos x)}{(1-\sin x)^2}=\frac{1-\sin x}{(1-\sin x)^2}=\frac{1}{1-\sin x}$, karena $\sin^2x+\cos^2x=1$.

Kedua fungsi terdiferensialkan di mana-mana, sehingga keduanya kontinu di mana-mana, dan grafik turunan sebuah gelombang adalah gelombang lain, seperti pada [menggambar grafik turunan](article:the-derivative-as-a-function#graphing-the-derivative).`,
          ),
        },
        {
          kind: 'figure',
          figure: {
            dim: 2,
            ticks: true,
            xSpan: [-0.6, 6.9],
            ySpan: [-1.5, 1.5],
            aspect: 0.5,
            items: [
              { t: 'curve', f: 'sin(x)', color: 'a', from: 0, to: 6.4 },
              { t: 'curve', f: 'cos(x)', color: 'b', from: 0, to: 6.4 },
            ],
            caption: L(
              'sin x (green) and its derivative cos x (orange), in radians: where the green wave peaks its slope is 0, so the orange wave crosses the axis there.',
              'sin x (hijau) dan turunannya cos x (jingga), dalam radian: di tempat gelombang hijau mencapai puncak gradiennya 0, sehingga gelombang jingga memotong sumbu di sana.',
            ),
          },
        },
        {
          kind: 'text',
          text: L(
            'Slide the point along any of the six graphs below: the tangent line is drawn, and a second graph shows the slope it has there.',
            'Geser titik sepanjang salah satu dari enam grafik di bawah: garis singgungnya digambar, dan grafik kedua menunjukkan gradiennya di sana.',
          ),
        },
        { kind: 'widget', name: 'trigslope' },
      ],
    },

    /* --------------------------------------------------------- the other four */
    {
      id: 'other-four',
      heading: L('What are the derivatives of tan, cot, sec and csc?', 'Apa turunan tan, cot, sec, dan csc?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The derivatives of the other four are $\tan'x=\sec^2x$, $\cot'x=-\csc^2x$, $\sec'x=\sec x\tan x$ and $\csc'x=-\csc x\cot x$, and each comes from the [quotient rule](article:differentiation-rules#quotient-rule) applied to sine and cosine.** They hold at every $x$ where the function is defined: for $\tan$ and $\sec$ that excludes the odd multiples of $\frac{\pi}{2}$, and for $\cot$ and $\csc$ the multiples of $\pi$.

- **Tangent.** $\tan x=\frac{\sin x}{\cos x}$, so $\tan'x=\frac{\cos x\cdot\cos x-\sin x\cdot(-\sin x)}{\cos^2x}=\frac{\cos^2x+\sin^2x}{\cos^2x}=\frac{1}{\cos^2x}=\sec^2x$.
- **Cotangent.** $\cot x=\frac{\cos x}{\sin x}$, so $\cot'x=\frac{-\sin x\cdot\sin x-\cos x\cdot\cos x}{\sin^2x}=\frac{-1}{\sin^2x}=-\csc^2x$.
- **Secant.** $\sec x=\frac{1}{\cos x}$, so $\sec'x=\frac{0\cdot\cos x-1\cdot(-\sin x)}{\cos^2x}=\frac{\sin x}{\cos^2x}=\frac{1}{\cos x}\cdot\frac{\sin x}{\cos x}=\sec x\tan x$.
- **Cosecant.** $\csc x=\frac{1}{\sin x}$, so $\csc'x=\frac{0\cdot\sin x-1\cdot\cos x}{\sin^2x}=\frac{-\cos x}{\sin^2x}=-\csc x\cot x$.

**One table for all six.** The three functions that begin with "co" have a minus sign, as cosine does.

| Function | Derivative |
|---|---|
| $\sin x$ | $\cos x$ |
| $\cos x$ | $-\sin x$ |
| $\tan x$ | $\sec^2x$ |
| $\cot x$ | $-\csc^2x$ |
| $\sec x$ | $\sec x\tan x$ |
| $\csc x$ | $-\csc x\cot x$ |

**What the slopes say.** Since $\cos^2x\le1$, the slope $\sec^2x$ of the tangent is never below $1$: the tangent function always rises, is flattest at the origin, where $\sec^2 0=1$, and gets steeper without bound near each vertical asymptote. At $x=\frac{\pi}{4}$ it is $\sec^2\frac{\pi}{4}=2$, so the tangent line of $y=\tan x$ there passes through $\left(\frac{\pi}{4},1\right)$ with slope $2$. The cotangent is its mirror image, always falling, with slope at most $-1$. The slope $\sec x\tan x$ of the secant is $0$ at the multiples of $\pi$, where the secant is $\pm1$.

**Horizontal tangents.** Where does $y=x+2\sin x$ have a horizontal tangent on $0\le x\le2\pi$? Set $y'=1+2\cos x=0$, so $\cos x=-\frac12$, which gives $x=\frac{2\pi}{3}$ and $x=\frac{4\pi}{3}$. The points are $\left(\frac{2\pi}{3},\frac{2\pi}{3}+\sqrt3\right)$ and $\left(\frac{4\pi}{3},\frac{4\pi}{3}-\sqrt3\right)$, about $(2.09,\,3.83)$ and $(4.19,\,2.46)$.

**A second derivative.** For $y=\sec x$, $y'=\sec x\tan x$ and the [product rule](article:differentiation-rules#product-rule) gives
$$y''=\sec x\tan x\cdot\tan x+\sec x\cdot\sec^2x$$
$$=\sec^3x+\sec x\tan^2x.$$
Because $\tan^2x=\sec^2x-1$ this is also $2\sec^3x-\sec x$.

Type any expression below, with sums, products and quotients of the six functions, powers of $x$ and $e^x$, and the steps are shown rule by rule, up to the fourth derivative.`,
            T`**Turunan keempat fungsi lainnya adalah $\tan'x=\sec^2x$, $\cot'x=-\csc^2x$, $\sec'x=\sec x\tan x$, dan $\csc'x=-\csc x\cot x$, dan masing-masing berasal dari [aturan hasil bagi](article:differentiation-rules#quotient-rule) yang diterapkan pada sinus dan kosinus.** Rumus itu berlaku di setiap $x$ tempat fungsinya terdefinisi: untuk $\tan$ dan $\sec$ itu mengecualikan kelipatan ganjil $\frac{\pi}{2}$, dan untuk $\cot$ dan $\csc$ kelipatan $\pi$.

- **Tangen.** $\tan x=\frac{\sin x}{\cos x}$, sehingga $\tan'x=\frac{\cos x\cdot\cos x-\sin x\cdot(-\sin x)}{\cos^2x}=\frac{\cos^2x+\sin^2x}{\cos^2x}=\frac{1}{\cos^2x}=\sec^2x$.
- **Kotangen.** $\cot x=\frac{\cos x}{\sin x}$, sehingga $\cot'x=\frac{-\sin x\cdot\sin x-\cos x\cdot\cos x}{\sin^2x}=\frac{-1}{\sin^2x}=-\csc^2x$.
- **Sekan.** $\sec x=\frac{1}{\cos x}$, sehingga $\sec'x=\frac{0\cdot\cos x-1\cdot(-\sin x)}{\cos^2x}=\frac{\sin x}{\cos^2x}=\frac{1}{\cos x}\cdot\frac{\sin x}{\cos x}=\sec x\tan x$.
- **Kosekan.** $\csc x=\frac{1}{\sin x}$, sehingga $\csc'x=\frac{0\cdot\sin x-1\cdot\cos x}{\sin^2x}=\frac{-\cos x}{\sin^2x}=-\csc x\cot x$.

**Satu tabel untuk keenamnya.** Ketiga fungsi yang berawalan "ko" memiliki tanda minus, seperti kosinus.

| Fungsi | Turunan |
|---|---|
| $\sin x$ | $\cos x$ |
| $\cos x$ | $-\sin x$ |
| $\tan x$ | $\sec^2x$ |
| $\cot x$ | $-\csc^2x$ |
| $\sec x$ | $\sec x\tan x$ |
| $\csc x$ | $-\csc x\cot x$ |

**Apa kata gradiennya.** Karena $\cos^2x\le1$, gradien $\sec^2x$ dari tangen tidak pernah di bawah $1$: fungsi tangen selalu naik, paling landai di titik asal, tempat $\sec^2 0=1$, dan makin curam tanpa batas di dekat tiap asimtot tegak. Di $x=\frac{\pi}{4}$ nilainya $\sec^2\frac{\pi}{4}=2$, sehingga garis singgung $y=\tan x$ di sana melalui $\left(\frac{\pi}{4},1\right)$ dengan gradien $2$. Kotangen adalah bayangan cerminnya, selalu turun, dengan gradien paling besar $-1$. Gradien $\sec x\tan x$ dari sekan bernilai $0$ di kelipatan $\pi$, tempat sekan bernilai $\pm1$.

**Garis singgung mendatar.** Di mana $y=x+2\sin x$ memiliki garis singgung mendatar pada $0\le x\le2\pi$? Setel $y'=1+2\cos x=0$, sehingga $\cos x=-\frac12$, yang memberi $x=\frac{2\pi}{3}$ dan $x=\frac{4\pi}{3}$. Titiknya $\left(\frac{2\pi}{3},\frac{2\pi}{3}+\sqrt3\right)$ dan $\left(\frac{4\pi}{3},\frac{4\pi}{3}-\sqrt3\right)$, sekitar $(2{,}09;\,3{,}83)$ dan $(4{,}19;\,2{,}46)$.

**Turunan kedua.** Untuk $y=\sec x$, $y'=\sec x\tan x$ dan [aturan hasil kali](article:differentiation-rules#product-rule) memberi
$$y''=\sec x\tan x\cdot\tan x+\sec x\cdot\sec^2x$$
$$=\sec^3x+\sec x\tan^2x.$$
Karena $\tan^2x=\sec^2x-1$, ini juga $2\sec^3x-\sec x$.

Ketik ekspresi apa saja di bawah, dengan jumlah, hasil kali, dan hasil bagi dari keenam fungsi itu, pangkat $x$, dan $e^x$, dan langkahnya ditampilkan aturan demi aturan, sampai turunan keempat.`,
          ),
        },
        { kind: 'widget', name: 'trigsteps' },
      ],
    },

    /* ------------------------------------------------------- simple harmonic motion */
    {
      id: 'simple-harmonic-motion',
      heading: L('How do sine and cosine describe a weight on a spring?', 'Bagaimana sinus dan kosinus menggambarkan beban pada pegas?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A weight hanging from a spring, pulled down $5$ units and let go at time $t=0$, moves as $s=5\cos t$; differentiating gives its velocity $v=-5\sin t$, its acceleration $a=-5\cos t$ and its jerk $j=5\sin t$, so the acceleration is always the negative of the position: $a=-s$.** This is *simple harmonic motion*. Measure $s$ downward from the rest position, in centimeters, and $t$ in seconds. The derivatives are those of [motion along a line](article:the-derivative-as-a-rate-of-change#motion-along-a-line), with the two new formulas supplying each one.

- **Position.** $s=5\cos t$ moves between $-5$ and $5$. The distance $5$ from the rest position is the *amplitude*. The motion repeats after $2\pi$ seconds, the *period*, because cosine does.
- **Velocity.** $v=\frac{ds}{dt}=-5\sin t$. It is negative just after $t=0$, so the weight moves upward, and it is $0$ at $t=0$ because the weight is let go from rest.
- **Acceleration.** $a=\frac{dv}{dt}=-5\cos t=-s$. When the weight is below the rest position ($s>0$) the acceleration points upward, and when it is above ($s<0$) it points downward: it always points back to the rest position. A spring pulling with a force proportional to the stretch, $F=-ks$, gives exactly this, and that is Hooke's law.
- **Jerk.** $j=\frac{da}{dt}=5\sin t$.

**Where is the speed greatest?** The speed is $|v|=5|\sin t|$. It is greatest, $5$ cm/s, when $\sin t=\pm1$, that is, when $\cos t=0$, which is when the weight passes the **rest position** $s=0$. It is $0$ at the ends of the swing, $s=\pm5$, where the weight turns around. The acceleration is the opposite way round: it is greatest, in size, at the ends, and $0$ at the rest position. The jerk is greatest at the rest position, where the acceleration changes sign fastest.

**Energy check.** From $s=5\cos t$ and $v=-5\sin t$,
$$s^2+v^2=25\cos^2t+25\sin^2t$$
$$=25=A^2,$$
so a point with coordinates $(s,v)$ goes around a circle of radius $5$: when the position is large the velocity is small, and the other way round.

**Other periods.** A stiffer spring or a lighter weight swings faster, with $s=A\cos(\omega t)$ for a constant $\omega$, and then each derivative picks up a factor $\omega$. That is the chain rule at work, which this article does not need yet: here $\omega=1$.

Change the amplitude and the time below and watch the weight, the two graphs and the numbers.`,
            T`**Beban yang tergantung pada pegas, ditarik ke bawah $5$ satuan dan dilepas pada waktu $t=0$, bergerak sebagai $s=5\cos t$; menurunkannya memberi kecepatan $v=-5\sin t$, percepatan $a=-5\cos t$, dan sentakan $j=5\sin t$, sehingga percepatan selalu negatif dari posisi: $a=-s$.** Inilah *gerak harmonik sederhana*. Ukur $s$ ke bawah dari posisi diam, dalam sentimeter, dan $t$ dalam detik. Turunan-turunannya adalah turunan pada [gerak sepanjang garis lurus](article:the-derivative-as-a-rate-of-change#motion-along-a-line), dengan dua rumus baru memberi tiap-tiapnya.

- **Posisi.** $s=5\cos t$ bergerak di antara $-5$ dan $5$. Jarak $5$ dari posisi diam adalah *amplitudo*. Geraknya berulang setelah $2\pi$ detik, yaitu *periode*, karena kosinus berulang demikian.
- **Kecepatan.** $v=\frac{ds}{dt}=-5\sin t$. Ia negatif sesaat setelah $t=0$, sehingga beban bergerak ke atas, dan ia $0$ di $t=0$ karena beban dilepas dari keadaan diam.
- **Percepatan.** $a=\frac{dv}{dt}=-5\cos t=-s$. Saat beban di bawah posisi diam ($s>0$) percepatannya mengarah ke atas, dan saat di atasnya ($s<0$) mengarah ke bawah: ia selalu mengarah kembali ke posisi diam. Pegas yang menarik dengan gaya sebanding dengan regangan, $F=-ks$, memberi tepat ini, dan itulah hukum Hooke.
- **Sentakan.** $j=\frac{da}{dt}=5\sin t$.

**Di mana laju terbesar?** Lajunya $|v|=5|\sin t|$. Ia terbesar, $5$ cm/s, bila $\sin t=\pm1$, yaitu bila $\cos t=0$, saat beban melewati **posisi diam** $s=0$. Ia $0$ di ujung ayunan, $s=\pm5$, tempat beban berbalik arah. Percepatan sebaliknya: besarnya terbesar di ujung, dan $0$ di posisi diam. Sentakan terbesar di posisi diam, tempat percepatan berganti tanda paling cepat.

**Pemeriksaan energi.** Dari $s=5\cos t$ dan $v=-5\sin t$,
$$s^2+v^2=25\cos^2t+25\sin^2t$$
$$=25=A^2,$$
sehingga titik berkoordinat $(s,v)$ mengelilingi lingkaran berjari-jari $5$: saat posisi besar kecepatan kecil, dan sebaliknya.

**Periode lain.** Pegas yang lebih kaku atau beban yang lebih ringan berayun lebih cepat, dengan $s=A\cos(\omega t)$ untuk konstanta $\omega$, dan tiap turunan lalu mendapat faktor $\omega$. Itulah aturan rantai yang bekerja, yang belum diperlukan artikel ini: di sini $\omega=1$.

Ubah amplitudo dan waktu di bawah dan perhatikan beban, kedua grafik, dan angkanya.`,
          ),
        },
        { kind: 'widget', name: 'springmotion' },
      ],
    },

    /* ---------------------------------------------------- higher trig derivatives */
    {
      id: 'higher-trig-derivatives',
      heading: L('What is the nth derivative of sin x or cos x?', 'Berapa turunan ke-n dari sin x atau cos x?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The derivatives of sine and cosine repeat every four steps, so the $n$th derivative depends only on the remainder of $n$ divided by $4$.** Starting from sine the derivatives go $\sin x$, $\cos x$, $-\sin x$, $-\cos x$ and then $\sin x$ again; starting from cosine they go $\cos x$, $-\sin x$, $-\cos x$, $\sin x$ and then $\cos x$ again.

| $n$ divided by $4$ leaves | $\frac{d^n}{dx^n}\sin x$ | $\frac{d^n}{dx^n}\cos x$ |
|---|---|---|
| $0$ | $\sin x$ | $\cos x$ |
| $1$ | $\cos x$ | $-\sin x$ |
| $2$ | $-\sin x$ | $-\cos x$ |
| $3$ | $-\cos x$ | $\sin x$ |

The reason is that the derivative of sine is a quarter of a turn ahead of it: four such steps bring the wave back to where it started. Both functions satisfy $y''=-y$, which is the equation of the spring in the previous section.

**Three examples.** The ordinary [higher-order derivative](article:differentiation-rules#higher-order) is $n$ steps of differentiation, so reduce $n$ first.

- $\frac{d^{999}}{dx^{999}}\cos x$: $999=4\cdot249+3$, remainder $3$, so the answer is $\sin x$.
- $\frac{d^{110}}{dx^{110}}\left(\sin x-3\cos x\right)$: $110=4\cdot27+2$, remainder $2$, so each function is replaced by its own negative and the answer is $-\sin x+3\cos x$.
- $\frac{d^{73}}{dx^{73}}\sin x$: $73=4\cdot18+1$, remainder $1$, so the answer is $\cos x$.

**The other four do not repeat.** The derivatives of tangent grow instead: $\tan'x=\sec^2x$, $\tan''x=2\sec^2x\tan x$ by the product rule, and each next one is longer, since $\sec$ and $\tan$ keep multiplying by one another. Only sine and cosine, being waves that sit in a circle, cycle.`,
            T`**Turunan sinus dan kosinus berulang setiap empat langkah, sehingga turunan ke-$n$ hanya bergantung pada sisa $n$ dibagi $4$.** Mulai dari sinus turunannya berjalan $\sin x$, $\cos x$, $-\sin x$, $-\cos x$ lalu $\sin x$ lagi; mulai dari kosinus berjalan $\cos x$, $-\sin x$, $-\cos x$, $\sin x$ lalu $\cos x$ lagi.

| $n$ dibagi $4$ bersisa | $\frac{d^n}{dx^n}\sin x$ | $\frac{d^n}{dx^n}\cos x$ |
|---|---|---|
| $0$ | $\sin x$ | $\cos x$ |
| $1$ | $\cos x$ | $-\sin x$ |
| $2$ | $-\sin x$ | $-\cos x$ |
| $3$ | $-\cos x$ | $\sin x$ |

Alasannya, turunan sinus mendahuluinya seperempat putaran: empat langkah seperti itu mengembalikan gelombang ke tempat ia mulai. Kedua fungsi memenuhi $y''=-y$, yaitu persamaan pegas pada bagian sebelumnya.

**Tiga contoh.** [Turunan tingkat tinggi](article:differentiation-rules#higher-order) biasa adalah $n$ langkah penurunan, jadi sederhanakan $n$ lebih dulu.

- $\frac{d^{999}}{dx^{999}}\cos x$: $999=4\cdot249+3$, bersisa $3$, sehingga jawabannya $\sin x$.
- $\frac{d^{110}}{dx^{110}}\left(\sin x-3\cos x\right)$: $110=4\cdot27+2$, bersisa $2$, sehingga tiap fungsi diganti negatifnya sendiri dan jawabannya $-\sin x+3\cos x$.
- $\frac{d^{73}}{dx^{73}}\sin x$: $73=4\cdot18+1$, bersisa $1$, sehingga jawabannya $\cos x$.

**Keempat fungsi lain tidak berulang.** Turunan tangen justru bertambah panjang: $\tan'x=\sec^2x$, $\tan''x=2\sec^2x\tan x$ dengan aturan hasil kali, dan tiap turunan berikutnya lebih panjang, karena $\sec$ dan $\tan$ terus saling mengalikan. Hanya sinus dan kosinus, gelombang yang berputar dalam lingkaran, yang berulang.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------- in code */
    {
      id: 'trig-in-code',
      heading: L('How do you differentiate trigonometric functions in code?', 'Bagaimana menurunkan fungsi trigonometri dalam kode?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**SymPy knows the whole table: ´sp.diff(sp.sin(x), x)´ gives ´cos(x)´, and ´sp.diff(f, x, n)´ takes the $n$th derivative, even for $n=999$.** SymPy writes $\sec^2x$ as ´tan(x)**2 + 1´, which is the same function by $\sec^2x=1+\tan^2x$. The second program checks the limits numerically. In radians, ´sin(h)/h´ climbs to $1$ and ´(cos(h) - 1)/h´ shrinks like $-\frac h2$; in degrees, after converting with ´h * pi/180´, the first quotient settles at $\frac{\pi}{180}=0.0174533$.`,
            T`**SymPy mengenal seluruh tabel: ´sp.diff(sp.sin(x), x)´ memberi ´cos(x)´, dan ´sp.diff(f, x, n)´ mengambil turunan ke-$n$, bahkan untuk $n=999$.** SymPy menulis $\sec^2x$ sebagai ´tan(x)**2 + 1´, yang fungsi yang sama menurut $\sec^2x=1+\tan^2x$. Program kedua memeriksa limit secara numerik. Dalam radian, ´sin(h)/h´ naik menuju $1$ dan ´(cos(h) - 1)/h´ mengecil seperti $-\frac h2$; dalam derajat, setelah diubah dengan ´h * pi/180´, hasil bagi pertama menetap di $\frac{\pi}{180}=0{,}0174533$.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python and SymPy: the whole table, and a high derivative', 'Python dan SymPy: seluruh tabel, dan turunan tingkat tinggi'),
          code: `import sympy as sp

x = sp.symbols('x')
for f in (sp.sin(x), sp.cos(x), sp.tan(x), sp.cot(x), sp.sec(x), sp.csc(x)):
    print(f, '->', sp.diff(f, x))
# sin(x) -> cos(x)
# cos(x) -> -sin(x)
# tan(x) -> tan(x)**2 + 1            (that is sec(x)**2)
# cot(x) -> -cot(x)**2 - 1           (that is -csc(x)**2)
# sec(x) -> tan(x)*sec(x)
# csc(x) -> -cot(x)*csc(x)

print(sp.diff(sp.exp(x) * sp.sin(x), x))              # exp(x)*sin(x) + exp(x)*cos(x)
print(sp.simplify(sp.diff(sp.cos(x) / (1 - sp.sin(x)), x)))   # -1/(sin(x) - 1), which is 1/(1 - sin(x))
print(sp.diff(sp.cos(x), x, 999))                     # sin(x)
print(sp.diff(sp.sin(x) - 3 * sp.cos(x), x, 110))     # -sin(x) + 3*cos(x)`,
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: the two limits, and the degrees trap', 'Python: dua limit, dan jebakan derajat'),
          code: `import math

for h in (0.1, 0.01, 0.001, 0.0001):
    print(h, round(math.sin(h) / h, 8), round((math.cos(h) - 1) / h, 8))
# 0.1    0.99833417 -0.04995835
# 0.01   0.99998333 -0.00499996
# 0.001  0.99999983 -0.0005
# 0.0001 1.0        -5e-05

d = math.pi / 180                                    # one degree, in radians
for h in (1, 0.1, 0.01):
    print(h, round(math.sin(h * d) / h, 8))          # 0.01745241, 0.01745328, 0.01745329
print(round(d, 8))                                   # 0.01745329: the limit is pi/180, not 1

print(math.sin(30), math.sin(math.radians(30)))      # -0.988... and 0.5: sin(30) treats 30 as radians

for h in (0.1, 0.01, 0.001):
    print(h, (math.sin(1 + h) - math.sin(1 - h)) / (2 * h))   # 0.5394, 0.54029, 0.5403022
print(math.cos(1))                                   # 0.5403023: the central difference reaches cos(1)`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++', 'C++'),
          code: `#include <iostream>
#include <cstdio>
#include <cmath>
using namespace std;

const double PI = acos(-1.0);

int main() {
  double hs[4] = {0.1, 0.01, 0.001, 0.0001};
  for (int i = 0; i < 4; i++) {
    double h = hs[i];
    printf("%.4f  %.8f  %.8f\\n", h, sin(h) / h, (cos(h) - 1) / h);    // the two limits: 1 and 0
  }
  double d = PI / 180;                                  // one degree, in radians
  double ds[3] = {1, 0.1, 0.01};
  for (int i = 0; i < 3; i++) printf("%.2f  %.8f\\n", ds[i], sin(ds[i] * d) / ds[i]);
  printf("%.8f\\n", d);                                  // the limit in degrees is pi/180, not 1

  printf("%.6f %.6f\\n", sin(30.0), sin(30 * d));        // sin(30) treats 30 as radians
  for (int i = 0; i < 3; i++) {
    double h = hs[i];
    printf("%.4f  %.7f\\n", h, (sin(1 + h) - sin(1 - h)) / (2 * h));  // the central difference of sin at 1
  }
  printf("%.7f\\n", cos(1.0));                           // ... reaches cos(1)
  return 0;
}

/* output:
0.1000  0.99833417  -0.04995835
0.0100  0.99998333  -0.00499996
0.0010  0.99999983  -0.00050000
0.0001  1.00000000  -0.00005000
1.00  0.01745241
0.10  0.01745328
0.01  0.01745329
0.01745329
-0.988032 0.500000
0.1000  0.5394023
0.0100  0.5402933
0.0010  0.5403022
0.5403023
*/`,
        },
        {
          kind: 'text',
          text: L(
            T`**The trap in any language is the unit.** ´math.sin´, ´Math.sin´ and NumPy's ´np.sin´ all expect radians, so ´math.sin(30)´ is the sine of $30$ radians, $-0.988$, and not $0.5$. Convert with ´math.radians´ first. The same unit is behind the derivative formulas: the numbers ´cos(1)´ and the central difference above agree only because $x=1$ is a radian measure.`,
            T`**Jebakan di bahasa apa pun adalah satuannya.** ´math.sin´, ´Math.sin´, dan ´np.sin´ dari NumPy semuanya mengharapkan radian, sehingga ´math.sin(30)´ adalah sinus $30$ radian, $-0{,}988$, bukan $0{,}5$. Ubah dengan ´math.radians´ lebih dulu. Satuan yang sama berada di balik rumus-rumus turunan: bilangan ´cos(1)´ dan selisih terpusat di atas hanya cocok karena $x=1$ adalah ukuran radian.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Who first studied sine, and when did it become a function of calculus?', 'Siapa yang pertama mempelajari sinus, dan kapan ia menjadi fungsi kalkulus?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The sine began as a table of lengths in astronomy, and it became a function with a derivative only when radians and infinite series arrived.**

- **Chords and the first sine.** Greek astronomers such as Hipparchus and, around 150, Ptolemy tabulated the lengths of chords of a circle. Indian astronomers, in the fifth century and after, replaced the chord by half the chord, the *jya*, which is the sine. The word "sine" comes from it by way of Arabic, translated into the Latin *sinus*.
- **Series.** In the Kerala school in India, Madhava of Sangamagrama and his successors, around the 14th century, found infinite series for sine and cosine, about two centuries before they were found again in Europe. Isaac Newton had them in the 1660s and used them in calculus.
- **Radians.** Roger Cotes in 1714 saw that the natural measure of an angle is the length of its arc on a circle of radius $1$. The word "radian" itself first appeared in print in 1873.
- **The modern functions.** Leonhard Euler, in his *Introductio in analysin infinitorum* (1748), treated sine and cosine as functions of a number, in radians, with the notation we use today.
- **Hooke's law.** Robert Hooke published "as the extension, so the force" in 1678, the spring law behind simple harmonic motion.`,
            T`**Sinus bermula sebagai tabel panjang dalam astronomi, dan ia menjadi fungsi yang memiliki turunan hanya ketika radian dan deret tak hingga tiba.**

- **Tali busur dan sinus pertama.** Astronom Yunani seperti Hipparchus dan, sekitar tahun 150, Ptolemeus menyusun tabel panjang tali busur lingkaran. Astronom India, pada abad kelima dan sesudahnya, mengganti tali busur dengan setengah tali busur, yaitu *jya*, yang adalah sinus. Kata "sinus" berasal darinya lewat bahasa Arab, yang diterjemahkan menjadi *sinus* dalam bahasa Latin.
- **Deret.** Di mazhab Kerala di India, Madhava dari Sangamagrama dan penerusnya, sekitar abad ke-14, menemukan deret tak hingga untuk sinus dan kosinus, sekitar dua abad sebelum ditemukan kembali di Eropa. Isaac Newton memilikinya pada 1660-an dan memakainya dalam kalkulus.
- **Radian.** Roger Cotes pada 1714 melihat bahwa ukuran alami sebuah sudut adalah panjang busurnya pada lingkaran berjari-jari $1$. Kata "radian" sendiri pertama kali muncul dalam cetakan pada 1873.
- **Fungsi modern.** Leonhard Euler, dalam *Introductio in analysin infinitorum* (1748), memperlakukan sinus dan kosinus sebagai fungsi dari sebuah bilangan, dalam radian, dengan lambang yang kita pakai sekarang.
- **Hukum Hooke.** Robert Hooke menerbitkan "seperti regangannya, begitu gayanya" pada 1678, hukum pegas di balik gerak harmonik sederhana.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What mistakes do people make with trigonometric derivatives?', 'Kesalahan apa yang sering terjadi pada turunan trigonometri?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with trigonometric derivatives are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ $\frac{d}{dx}\cos x=\sin x$ | The derivative of cosine has a minus sign: $-\sin x$. The cosine starts at its peak and falls, so its slope is negative. |
| ❌ $\frac{d}{dx}\sin 2x=\cos 2x$ | The table is for $\sin x$ with a plain $x$ inside. With $2x$ inside the wave is twice as steep: the derivative is $2\cos 2x$, from the [chain rule](article:the-chain-rule#chain-rule). |
| ❌ $\frac{d}{dx}\tan x=\sec x$ | The derivative of tangent is $\sec^2x$. The expression $\sec x\tan x$ is the derivative of $\sec x$. |
| ❌ $\frac{d}{dx}\sec x=\sec^2x$ | $\sec^2x$ is the derivative of $\tan x$. For secant, $\sec'x=\sec x\tan x$. |
| ❌ $\frac{d}{dx}\sin^2x=\cos^2x$ | $\sin^2x=\sin x\cdot\sin x$, and the product rule gives $\cos x\sin x+\sin x\cos x=2\sin x\cos x$. |
| ❌ $\frac{d}{dx}(\sin x\cos x)=\cos x\cdot(-\sin x)$ | The product rule has two terms: $\cos x\cdot\cos x+\sin x\cdot(-\sin x)=\cos^2x-\sin^2x$. |
| ❌ $\frac{d}{dx}\sec x=\frac{1}{-\sin x}$ | The derivative of a reciprocal is $-\frac{f'}{f^2}$, not one over the derivative: $\left(\frac{1}{\cos x}\right)'=\frac{\sin x}{\cos^2x}=\sec x\tan x$. |
| ❌ $\lim_{h\to0}\frac{\sin h}{h}=0$ because $\sin 0=0$ | It is a $\frac00$ form: top and bottom both go to $0$, and the squeeze $\cos h<\frac{\sin h}{h}<1$ shows the limit is $1$. |
| ❌ $\frac{d}{dx}\sin x=\cos x$ also holds when $x$ is in degrees | Only in radians. In degrees $\frac{d}{dx}\sin x^\circ=\frac{\pi}{180}\cos x^\circ$. |`,
            T`**Kesalahan paling umum pada turunan trigonometri adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ $\frac{d}{dx}\cos x=\sin x$ | Turunan kosinus bertanda minus: $-\sin x$. Kosinus mulai dari puncaknya lalu turun, sehingga gradiennya negatif. |
| ❌ $\frac{d}{dx}\sin 2x=\cos 2x$ | Tabel itu untuk $\sin x$ dengan $x$ polos di dalamnya. Dengan $2x$ di dalam, gelombangnya dua kali lebih curam: turunannya $2\cos 2x$, dari [aturan rantai](article:the-chain-rule#chain-rule). |
| ❌ $\frac{d}{dx}\tan x=\sec x$ | Turunan tangen adalah $\sec^2x$. Ekspresi $\sec x\tan x$ adalah turunan $\sec x$. |
| ❌ $\frac{d}{dx}\sec x=\sec^2x$ | $\sec^2x$ adalah turunan $\tan x$. Untuk sekan, $\sec'x=\sec x\tan x$. |
| ❌ $\frac{d}{dx}\sin^2x=\cos^2x$ | $\sin^2x=\sin x\cdot\sin x$, dan aturan hasil kali memberi $\cos x\sin x+\sin x\cos x=2\sin x\cos x$. |
| ❌ $\frac{d}{dx}(\sin x\cos x)=\cos x\cdot(-\sin x)$ | Aturan hasil kali memiliki dua suku: $\cos x\cdot\cos x+\sin x\cdot(-\sin x)=\cos^2x-\sin^2x$. |
| ❌ $\frac{d}{dx}\sec x=\frac{1}{-\sin x}$ | Turunan sebuah kebalikan adalah $-\frac{f'}{f^2}$, bukan satu per turunannya: $\left(\frac{1}{\cos x}\right)'=\frac{\sin x}{\cos^2x}=\sec x\tan x$. |
| ❌ $\lim_{h\to0}\frac{\sin h}{h}=0$ karena $\sin 0=0$ | Itu bentuk $\frac00$: pembilang dan penyebut sama-sama menuju $0$, dan apitan $\cos h<\frac{\sin h}{h}<1$ menunjukkan limitnya $1$. |
| ❌ $\frac{d}{dx}\sin x=\cos x$ juga berlaku bila $x$ dalam derajat | Hanya dalam radian. Dalam derajat $\frac{d}{dx}\sin x^\circ=\frac{\pi}{180}\cos x^\circ$. |`,
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
              L('$\\frac{d}{dx}\\sin x=\\cos x$ when $x$ is in radians.', '$\\frac{d}{dx}\\sin x=\\cos x$ bila $x$ dalam radian.'),
              L('$\\frac{d}{dx}\\cos x=\\sin x$.', '$\\frac{d}{dx}\\cos x=\\sin x$.'),
              L('$\\frac{d}{dx}\\tan x=\\sec^2x$.', '$\\frac{d}{dx}\\tan x=\\sec^2x$.'),
              L('$\\frac{d}{dx}\\csc x=\\csc x\\cot x$.', '$\\frac{d}{dx}\\csc x=\\csc x\\cot x$.'),
              L('In degrees, $\\frac{\\sin h}{h}$ tends to $1$ as $h\\to0$.', 'Dalam derajat, $\\frac{\\sin h}{h}$ menuju $1$ saat $h\\to0$.'),
              L('The slope of $\\tan x$ is never below $1$.', 'Gradien $\\tan x$ tidak pernah di bawah $1$.'),
            ],
            answer: [true, false, true, false, false, true],
            explain: L(
              'The derivative of cosine is $-\\sin x$ and that of cosecant is $-\\csc x\\cot x$: the "co" functions get a minus sign. In degrees the limit is $\\frac{\\pi}{180}$. And $\\sec^2x\\ge1$.',
              'Turunan kosinus adalah $-\\sin x$ dan turunan kosekan $-\\csc x\\cot x$: fungsi "ko" mendapat tanda minus. Dalam derajat limitnya $\\frac{\\pi}{180}$. Dan $\\sec^2x\\ge1$.',
            ),
            hint: L('Which of the six derivatives have a minus sign?', 'Turunan mana dari keenamnya yang bertanda minus?'),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L('Choose **all** the correct derivative formulas.', 'Pilih **semua** rumus turunan yang benar.'),
            options: [
              L('$(\\sin x)\'=\\cos x$', '$(\\sin x)\'=\\cos x$'),
              L('$(\\cos x)\'=-\\sin x$', '$(\\cos x)\'=-\\sin x$'),
              L('$(\\cot x)\'=-\\csc^2x$', '$(\\cot x)\'=-\\csc^2x$'),
              L('$(\\sec x)\'=\\sec x\\tan x$', '$(\\sec x)\'=\\sec x\\tan x$'),
              L('$(\\tan x)\'=-\\sec^2x$', '$(\\tan x)\'=-\\sec^2x$'),
            ],
            answer: [0, 1, 2, 3],
            explain: L('The derivative of tangent is $\\sec^2x$ with a plus sign, not minus; the minus sign belongs to cotangent.', 'Turunan tangen adalah $\\sec^2x$ dengan tanda plus, bukan minus; tanda minus milik kotangen.'),
            hint: L('Of tangent and cotangent, which one is negative?', 'Dari tangen dan kotangen, mana yang negatif?'),
          },
        },
        {
          kind: 'activity',
          title: L('A product', 'Sebuah hasil kali'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L('The product rule: $y\'=\\sin x+x\\cos x$.', 'Aturan hasil kali: $y\'=\\sin x+x\\cos x$.'), L('At $x=\\frac{\\pi}{2}$: $\\sin=1$ and $\\cos=0$.', 'Di $x=\\frac{\\pi}{2}$: $\\sin=1$ dan $\\cos=0$.')],
            explain: L('$y\'=\\sin x+x\\cos x$, so $y\'\\left(\\frac{\\pi}{2}\\right)=1+\\frac{\\pi}{2}\\cdot0=1$.', '$y\'=\\sin x+x\\cos x$, sehingga $y\'\\left(\\frac{\\pi}{2}\\right)=1+\\frac{\\pi}{2}\\cdot0=1$.'),
            prompt: L('For $y=x\\sin x$ find $y\'\\left(\\frac{\\pi}{2}\\right)$.', 'Untuk $y=x\\sin x$ tentukan $y\'\\left(\\frac{\\pi}{2}\\right)$.'),
            given: String.raw`y'\left(\tfrac{\pi}{2}\right)=v`,
            blanks: [{ label: "y' =", answer: 1 }],
          },
        },
        {
          kind: 'activity',
          title: L('The slope of the tangent', 'Gradien tangen'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L('$(\\tan x)\'=\\sec^2x=\\frac{1}{\\cos^2x}$.', '$(\\tan x)\'=\\sec^2x=\\frac{1}{\\cos^2x}$.'), L('$\\cos\\frac{\\pi}{4}=\\frac{\\sqrt2}{2}$, so $\\cos^2=\\frac12$.', '$\\cos\\frac{\\pi}{4}=\\frac{\\sqrt2}{2}$, sehingga $\\cos^2=\\frac12$.')],
            explain: L('$\\sec^2\\frac{\\pi}{4}=\\frac{1}{1/2}=2$.', '$\\sec^2\\frac{\\pi}{4}=\\frac{1}{1/2}=2$.'),
            prompt: L('Find the slope of $y=\\tan x$ at $x=\\frac{\\pi}{4}$.', 'Tentukan gradien $y=\\tan x$ di $x=\\frac{\\pi}{4}$.'),
            given: String.raw`\left.\frac{d}{dx}\tan x\right|_{\pi/4}=v`,
            blanks: [{ label: 'slope =', answer: 2 }],
          },
        },
        {
          kind: 'activity',
          title: L('The slope of the cotangent', 'Gradien kotangen'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [L('$(\\cot x)\'=-\\csc^2x=-\\frac{1}{\\sin^2x}$.', '$(\\cot x)\'=-\\csc^2x=-\\frac{1}{\\sin^2x}$.'), L('$\\sin^2\\frac{\\pi}{4}=\\frac12$.', '$\\sin^2\\frac{\\pi}{4}=\\frac12$.')],
            explain: L('$-\\csc^2\\frac{\\pi}{4}=-\\frac{1}{1/2}=-2$.', '$-\\csc^2\\frac{\\pi}{4}=-\\frac{1}{1/2}=-2$.'),
            prompt: L('Find the slope of $y=\\cot x$ at $x=\\frac{\\pi}{4}$.', 'Tentukan gradien $y=\\cot x$ di $x=\\frac{\\pi}{4}$.'),
            given: String.raw`\left.\frac{d}{dx}\cot x\right|_{\pi/4}=v`,
            blanks: [{ label: 'slope =', answer: -2 }],
          },
        },
        {
          kind: 'activity',
          title: L('A quotient', 'Sebuah hasil bagi'),
          step: {
            kind: 'quiz',
            id: 'p6',
            prompt: L('What is the derivative of $\\frac{\\cos x}{1-\\sin x}$?', 'Berapa turunan $\\frac{\\cos x}{1-\\sin x}$?'),
            options: [L('$\\frac{1}{1-\\sin x}$', '$\\frac{1}{1-\\sin x}$'), L('$-\\frac{1}{1-\\sin x}$', '$-\\frac{1}{1-\\sin x}$'), L('$\\frac{1}{1+\\sin x}$', '$\\frac{1}{1+\\sin x}$'), L('$\\frac{-\\sin x}{-\\cos x}$', '$\\frac{-\\sin x}{-\\cos x}$')],
            answer: 0,
            explain: L('The numerator is $-\\sin x(1-\\sin x)+\\cos^2x=1-\\sin x$, which cancels one factor of the square in the denominator.', 'Pembilangnya $-\\sin x(1-\\sin x)+\\cos^2x=1-\\sin x$, yang menghapus satu faktor dari kuadrat di penyebut.'),
            hint: L('Use the quotient rule and $\\sin^2x+\\cos^2x=1$.', 'Pakai aturan hasil bagi dan $\\sin^2x+\\cos^2x=1$.'),
          },
        },
        {
          kind: 'activity',
          title: L('A high derivative', 'Turunan tingkat tinggi'),
          step: {
            kind: 'math',
            id: 'p7',
            hints: [L('$101=4\\cdot25+1$: remainder $1$.', '$101=4\\cdot25+1$: bersisa $1$.'), L('Remainder $1$ turns $\\sin x$ into $\\cos x$.', 'Sisa $1$ mengubah $\\sin x$ menjadi $\\cos x$.')],
            explain: L('The $101$st derivative of $\\sin x$ is $\\cos x$, and $\\cos0=1$.', 'Turunan ke-$101$ dari $\\sin x$ adalah $\\cos x$, dan $\\cos0=1$.'),
            prompt: L('Find the value at $x=0$ of the $101$st derivative of $\\sin x$.', 'Tentukan nilai di $x=0$ dari turunan ke-$101$ dari $\\sin x$.'),
            given: String.raw`\left.\frac{d^{101}}{dx^{101}}\sin x\right|_{x=0}=v`,
            blanks: [{ label: 'value =', answer: 1 }],
          },
        },
        {
          kind: 'activity',
          title: L('The 110th derivative', 'Turunan ke-110'),
          step: {
            kind: 'quiz',
            id: 'p8',
            prompt: L('What is $\\frac{d^{110}}{dx^{110}}\\cos x$?', 'Berapa $\\frac{d^{110}}{dx^{110}}\\cos x$?'),
            options: [L('$\\cos x$', '$\\cos x$'), L('$-\\cos x$', '$-\\cos x$'), L('$\\sin x$', '$\\sin x$'), L('$-\\sin x$', '$-\\sin x$')],
            answer: 1,
            explain: L('$110=4\\cdot27+2$, remainder $2$, and two derivatives turn $\\cos x$ into $-\\cos x$.', '$110=4\\cdot27+2$, bersisa $2$, dan dua turunan mengubah $\\cos x$ menjadi $-\\cos x$.'),
            hint: L('Reduce $110$ modulo $4$.', 'Sederhanakan $110$ modulo $4$.'),
          },
        },
        {
          kind: 'activity',
          title: L('The fastest point of the spring', 'Titik tercepat pegas'),
          step: {
            kind: 'quiz',
            id: 'p9',
            prompt: L('A weight moves as $s=5\\cos t$. Where is its speed the greatest?', 'Sebuah beban bergerak sebagai $s=5\\cos t$. Di mana lajunya terbesar?'),
            options: [L('at the rest position, $s=0$', 'di posisi diam, $s=0$'), L('at the top of the swing, $s=-5$', 'di puncak ayunan, $s=-5$'), L('at the bottom of the swing, $s=5$', 'di dasar ayunan, $s=5$'), L('the speed is constant', 'lajunya tetap')],
            answer: 0,
            explain: L('The speed is $|v|=5|\\sin t|$, greatest when $\\cos t=0$, which is when $s=0$. At the ends the weight turns round and $v=0$.', 'Lajunya $|v|=5|\\sin t|$, terbesar bila $\\cos t=0$, yaitu saat $s=0$. Di ujung beban berbalik arah dan $v=0$.'),
            hint: L('Where is the velocity zero?', 'Di mana kecepatannya nol?'),
          },
        },
        {
          kind: 'activity',
          title: L('A velocity', 'Sebuah kecepatan'),
          step: {
            kind: 'math',
            id: 'p10',
            hints: [L('$v=\\frac{ds}{dt}=-5\\sin t$.', '$v=\\frac{ds}{dt}=-5\\sin t$.'), L('$\\sin\\frac{\\pi}{2}=1$.', '$\\sin\\frac{\\pi}{2}=1$.')],
            explain: L('$v\\left(\\frac{\\pi}{2}\\right)=-5\\sin\\frac{\\pi}{2}=-5$ cm/s: moving upward through the rest position at the greatest speed.', '$v\\left(\\frac{\\pi}{2}\\right)=-5\\sin\\frac{\\pi}{2}=-5$ cm/s: bergerak ke atas melewati posisi diam dengan laju terbesar.'),
            prompt: L('A weight has position $s=5\\cos t$ cm. Find its velocity at $t=\\frac{\\pi}{2}$, in cm/s.', 'Sebuah beban berposisi $s=5\\cos t$ cm. Tentukan kecepatannya di $t=\\frac{\\pi}{2}$, dalam cm/s.'),
            given: String.raw`v\left(\tfrac{\pi}{2}\right)=v`,
            blanks: [{ label: 'v =', answer: -5 }],
          },
        },
        {
          kind: 'activity',
          title: L('A limit', 'Sebuah limit'),
          step: {
            kind: 'math',
            id: 'p11',
            hints: [L('Write $\\frac{\\sin3x}{x}=3\\cdot\\frac{\\sin3x}{3x}$.', 'Tulis $\\frac{\\sin3x}{x}=3\\cdot\\frac{\\sin3x}{3x}$.'), L('$\\frac{\\sin u}{u}\\to1$ as $u\\to0$.', '$\\frac{\\sin u}{u}\\to1$ saat $u\\to0$.')],
            explain: L('$\\lim_{x\\to0}\\frac{\\sin3x}{x}=3\\cdot1=3$.', '$\\lim_{x\\to0}\\frac{\\sin3x}{x}=3\\cdot1=3$.'),
            prompt: L('Find $\\lim_{x\\to0}\\frac{\\sin3x}{x}$.', 'Tentukan $\\lim_{x\\to0}\\frac{\\sin3x}{x}$.'),
            given: String.raw`\lim_{x\to0}\frac{\sin3x}{x}=v`,
            blanks: [{ label: 'limit =', answer: 3 }],
          },
        },
        {
          kind: 'activity',
          title: L('Degrees', 'Derajat'),
          step: {
            kind: 'quiz',
            id: 'p12',
            prompt: L('What is $\\frac{d}{dx}\\sin x^\\circ$, where $x$ is measured in degrees?', 'Berapa $\\frac{d}{dx}\\sin x^\\circ$, dengan $x$ diukur dalam derajat?'),
            options: [L('$\\cos x^\\circ$', '$\\cos x^\\circ$'), L('$\\frac{\\pi}{180}\\cos x^\\circ$', '$\\frac{\\pi}{180}\\cos x^\\circ$'), L('$\\frac{180}{\\pi}\\cos x^\\circ$', '$\\frac{180}{\\pi}\\cos x^\\circ$'), L('$-\\frac{\\pi}{180}\\cos x^\\circ$', '$-\\frac{\\pi}{180}\\cos x^\\circ$')],
            answer: 1,
            explain: L('One degree is $\\frac{\\pi}{180}$ radians, so the limit $\\frac{\\sin h^\\circ}{h}\\to\\frac{\\pi}{180}$ leaves a factor $\\frac{\\pi}{180}$ in front of $\\cos x^\\circ$.', 'Satu derajat adalah $\\frac{\\pi}{180}$ radian, sehingga limit $\\frac{\\sin h^\\circ}{h}\\to\\frac{\\pi}{180}$ menyisakan faktor $\\frac{\\pi}{180}$ di depan $\\cos x^\\circ$.'),
            hint: L('What does $\\frac{\\sin h}{h}$ tend to in degrees?', 'Menuju berapa $\\frac{\\sin h}{h}$ dalam derajat?'),
          },
        },
      ],
    },

    /* ----------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: derivatives of trigonometric functions at a glance', 'Ringkasan: turunan fungsi trigonometri sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Two limits:** $\frac{\sin h}{h}\to1$ and $\frac{\cos h-1}{h}\to0$, from the squeeze $\cos h<\frac{\sin h}{h}<1$; in radians only (in degrees the first is $\frac{\pi}{180}$).
- **Sine and cosine:** $(\sin x)'=\cos x$ and $(\cos x)'=-\sin x$, by the angle-sum formulas.
- **The other four:** $(\tan x)'=\sec^2x$, $(\cot x)'=-\csc^2x$, $(\sec x)'=\sec x\tan x$, $(\csc x)'=-\csc x\cot x$, by the quotient rule; the "co" functions are negative.
- **Slopes:** the slope of $\tan x$ is at least $1$; $y=x+2\sin x$ has horizontal tangents at $\frac{2\pi}{3}$ and $\frac{4\pi}{3}$ on $[0,2\pi]$.
- **Spring:** $s=5\cos t$, $v=-5\sin t$, $a=-s$; the speed is greatest at the rest position and zero at the ends.
- **Higher derivatives:** sine and cosine repeat every four steps; reduce $n$ modulo $4$.
- **Not yet:** $\sin 2x$ and $\sin^2x$ need the chain rule.
- **Code:** ´sp.diff(f, x, n)´; angles in ´math.sin´ are in radians.`,
            T`- **Dua limit:** $\frac{\sin h}{h}\to1$ dan $\frac{\cos h-1}{h}\to0$, dari apitan $\cos h<\frac{\sin h}{h}<1$; hanya dalam radian (dalam derajat yang pertama adalah $\frac{\pi}{180}$).
- **Sinus dan kosinus:** $(\sin x)'=\cos x$ dan $(\cos x)'=-\sin x$, dengan rumus jumlah sudut.
- **Empat lainnya:** $(\tan x)'=\sec^2x$, $(\cot x)'=-\csc^2x$, $(\sec x)'=\sec x\tan x$, $(\csc x)'=-\csc x\cot x$, dengan aturan hasil bagi; fungsi "ko" negatif.
- **Gradien:** gradien $\tan x$ paling sedikit $1$; $y=x+2\sin x$ memiliki garis singgung mendatar di $\frac{2\pi}{3}$ dan $\frac{4\pi}{3}$ pada $[0,2\pi]$.
- **Pegas:** $s=5\cos t$, $v=-5\sin t$, $a=-s$; laju terbesar di posisi diam dan nol di ujung.
- **Turunan tingkat tinggi:** sinus dan kosinus berulang setiap empat langkah; sederhanakan $n$ modulo $4$.
- **Belum:** $\sin 2x$ dan $\sin^2x$ memerlukan aturan rantai.
- **Kode:** ´sp.diff(f, x, n)´; sudut pada ´math.sin´ dalam radian.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Radian', 'Radian'), definition: L('The angle at the center of a circle that cuts off an arc as long as the radius; the unit in which the derivatives of sine and cosine take their simple form.', 'Sudut di pusat lingkaran yang memotong busur sepanjang jari-jarinya; satuan tempat turunan sinus dan kosinus berbentuk sederhana.') },
    { term: L('Squeeze theorem', 'Teorema apit'), definition: L('If a quantity lies between two others that tend to the same limit, it tends to that limit too; it gives the limit of sin h over h as 1.', 'Jika suatu besaran terletak di antara dua besaran lain yang menuju limit yang sama, ia menuju limit itu juga; teorema ini memberi limit sin h per h sebesar 1.') },
    { term: L('Cofunction', 'Kofungsi'), definition: L('One of the functions cosine, cotangent and cosecant, whose derivative carries a minus sign, as in the derivative of cosine being minus sine.', 'Salah satu dari fungsi kosinus, kotangen, dan kosekan, yang turunannya bertanda minus, seperti turunan kosinus yang adalah minus sinus.') },
    { term: L('Secant function', 'Fungsi sekan'), definition: L('The reciprocal of the cosine, one over cos x; its derivative is sec x times tan x.', 'Kebalikan kosinus, satu per cos x; turunannya adalah sec x kali tan x.') },
    { term: L('Simple harmonic motion', 'Gerak harmonik sederhana'), definition: L('Motion in which the acceleration is always proportional to the displacement and points back to the rest position, so the position is a sine or cosine of time.', 'Gerak yang percepatannya selalu sebanding dengan simpangan dan mengarah kembali ke posisi diam, sehingga posisinya adalah sinus atau kosinus dari waktu.') },
    { term: L('Amplitude', 'Amplitudo'), definition: L('The greatest distance of an oscillating quantity from its rest position, such as the 5 in the motion s equals 5 cos t.', 'Jarak terbesar besaran yang berosilasi dari posisi diamnya, seperti 5 pada gerak s sama dengan 5 cos t.') },
    { term: L('Period', 'Periode'), definition: L('The time after which an oscillation repeats itself; for sine and cosine of t it is 2π.', 'Waktu setelah mana suatu osilasi mengulang dirinya; untuk sinus dan kosinus dari t nilainya 2π.') },
    { term: L("Hooke's law", 'Hukum Hooke'), definition: L('The law that the force of a spring is proportional to its stretch and points back toward the rest position, which leads to simple harmonic motion.', 'Hukum bahwa gaya pegas sebanding dengan regangannya dan mengarah kembali ke posisi diam, yang menghasilkan gerak harmonik sederhana.') },
  ],

  howTo: [
    {
      name: L('How to differentiate an expression with trigonometric functions', 'Cara menurunkan ekspresi dengan fungsi trigonometri'),
      description: L('Split the expression with the sum, product and quotient rules, then use the table of six derivatives.', 'Pecah ekspresinya dengan aturan jumlah, hasil kali, dan hasil bagi, lalu pakai tabel enam turunan.'),
      steps: [
        { name: L('Find the outermost operation', 'Cari operasi terluar'), text: L('Decide whether the expression is a sum, a product, a quotient or a single function, and make sure every trigonometric function has a plain x inside.', 'Tentukan apakah ekspresinya jumlah, hasil kali, hasil bagi, atau satu fungsi, dan pastikan setiap fungsi trigonometri berisi x polos.') },
        { name: L('Apply the matching rule', 'Terapkan aturan yang sesuai'), text: L('Use the sum rule term by term, the product rule f prime g plus f g prime, or the quotient rule with the square of the denominator.', 'Pakai aturan jumlah suku demi suku, aturan hasil kali f aksen g ditambah f g aksen, atau aturan hasil bagi dengan kuadrat penyebut.') },
        { name: L('Use the table for each piece', 'Pakai tabel untuk tiap bagian'), text: L('Replace sin x by cos x, cos x by minus sin x, tan x by sec squared x, cot x by minus csc squared x, sec x by sec x tan x, and csc x by minus csc x cot x.', 'Ganti sin x dengan cos x, cos x dengan minus sin x, tan x dengan sec kuadrat x, cot x dengan minus csc kuadrat x, sec x dengan sec x tan x, dan csc x dengan minus csc x cot x.') },
        { name: L('Simplify', 'Sederhanakan'), text: L('Use sin squared plus cos squared equals one, and the identities for sec and tan, to shorten the answer.', 'Pakai sin kuadrat ditambah cos kuadrat sama dengan satu, dan kesamaan untuk sec dan tan, untuk memperpendek jawabannya.') },
      ],
    },
    {
      name: L('How to find the nth derivative of sine or cosine', 'Cara mencari turunan ke-n dari sinus atau kosinus'),
      description: L('Reduce n modulo 4 and read the answer from the cycle of four.', 'Sederhanakan n modulo 4 dan baca jawabannya dari siklus empat.'),
      steps: [
        { name: L('Divide n by 4', 'Bagi n dengan 4'), text: L('Find the remainder of n divided by 4; for 999 it is 3.', 'Cari sisa n dibagi 4; untuk 999 sisanya 3.') },
        { name: L('Read the cycle', 'Baca siklusnya'), text: L('Remainder 0 leaves the function alone; remainder 1 gives cos for sin and minus sin for cos; remainder 2 gives the negative; remainder 3 gives minus cos for sin and sin for cos.', 'Sisa 0 membiarkan fungsinya; sisa 1 memberi cos untuk sin dan minus sin untuk cos; sisa 2 memberi negatifnya; sisa 3 memberi minus cos untuk sin dan sin untuk cos.') },
        { name: L('Combine the terms', 'Gabungkan sukunya'), text: L('For a combination such as sin x minus 3 cos x, apply the same step to each term; with remainder 2 both signs flip.', 'Untuk kombinasi seperti sin x dikurangi 3 cos x, terapkan langkah yang sama pada tiap suku; dengan sisa 2 kedua tandanya berbalik.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is the derivative of sin x?', 'Apa turunan sin x?'),
      a: L(
        'The derivative of sine of x is cosine of x, when x is measured in radians. It follows from the angle-sum formula and the limits of sine h over h, which is 1, and cosine h minus 1 over h, which is 0, as h tends to zero.',
        'Turunan sinus dari x adalah kosinus dari x, bila x diukur dalam radian. Ini mengikuti dari rumus jumlah sudut dan limit sin h per h, yaitu 1, dan cos h dikurangi 1 per h, yaitu 0, saat h menuju nol.',
      ),
    },
    {
      q: L('What is the derivative of cos x?', 'Apa turunan cos x?'),
      a: L(
        'The derivative of cosine of x is minus sine of x. The minus sign is there because the cosine starts at its peak and falls, so just after zero its slope is negative, and the slope curve is the sine curve turned upside down.',
        'Turunan kosinus dari x adalah minus sinus dari x. Tanda minusnya ada karena kosinus mulai dari puncaknya lalu turun, sehingga sesaat setelah nol gradiennya negatif, dan kurva gradiennya adalah kurva sinus yang dibalik.',
      ),
    },
    {
      q: L('What are the derivatives of tan, cot, sec and csc?', 'Apa turunan tan, cot, sec, dan csc?'),
      a: L(
        'Tangent has derivative secant squared, cotangent has minus cosecant squared, secant has secant times tangent, and cosecant has minus cosecant times cotangent. All four come from the quotient rule applied to sine and cosine.',
        'Tangen memiliki turunan sekan kuadrat, kotangen minus kosekan kuadrat, sekan sekan kali tangen, dan kosekan minus kosekan kali kotangen. Keempatnya berasal dari aturan hasil bagi yang diterapkan pada sinus dan kosinus.',
      ),
    },
    {
      q: L('Why does calculus use radians for trigonometric derivatives?', 'Mengapa kalkulus memakai radian untuk turunan trigonometri?'),
      a: L(
        'Only in radians does sine h over h tend to 1. In degrees the limit is pi over 180, about 0.01745, and every derivative of sine and cosine would carry that factor. Radians remove it, so the derivative of sine is exactly cosine.',
        'Hanya dalam radian sin h per h menuju 1. Dalam derajat limitnya pi per 180, sekitar 0,01745, dan setiap turunan sinus dan kosinus akan membawa faktor itu. Radian menghilangkannya, sehingga turunan sinus tepat kosinus.',
      ),
    },
    {
      q: L('What is the limit of sin x over x as x approaches zero?', 'Berapa limit sin x per x saat x mendekati nol?'),
      a: L(
        'It is 1, when x is in radians. The proof squeezes the quotient between cosine x and 1, using the areas of a triangle, a circular sector and a larger triangle, which give the inequality sine x is less than x, which is less than tangent x.',
        'Nilainya 1, bila x dalam radian. Buktinya mengapit hasil bagi itu di antara kosinus x dan 1, memakai luas segitiga, juring, dan segitiga yang lebih besar, yang memberi pertidaksamaan sinus x kurang dari x, yang kurang dari tangen x.',
      ),
    },
    {
      q: L('What is the nth derivative of sin x?', 'Berapa turunan ke-n dari sin x?'),
      a: L(
        'The derivatives of sine repeat every four steps: cosine, minus sine, minus cosine, then sine again. So divide n by 4 and look at the remainder: 1 gives cosine, 2 gives minus sine, 3 gives minus cosine, and 0 gives sine itself.',
        'Turunan sinus berulang setiap empat langkah: kosinus, minus sinus, minus kosinus, lalu sinus lagi. Jadi bagi n dengan 4 dan lihat sisanya: 1 memberi kosinus, 2 memberi minus sinus, 3 memberi minus kosinus, dan 0 memberi sinus sendiri.',
      ),
    },
    {
      q: L('What is simple harmonic motion?', 'Apa itu gerak harmonik sederhana?'),
      a: L(
        'It is motion in which the acceleration is proportional to the displacement and points back to the rest position, like a weight on a spring. Its position is a sine or cosine of time, and its speed is greatest as it passes the rest position.',
        'Itu gerak yang percepatannya sebanding dengan simpangan dan mengarah kembali ke posisi diam, seperti beban pada pegas. Posisinya adalah sinus atau kosinus dari waktu, dan lajunya terbesar saat melewati posisi diam.',
      ),
    },
    {
      q: L('How do you differentiate sin x times cos x?', 'Bagaimana menurunkan sin x kali cos x?'),
      a: L(
        'Use the product rule: the derivative of sine times cosine, plus sine times the derivative of cosine. That gives cosine squared minus sine squared, which is also the cosine of two x.',
        'Pakai aturan hasil kali: turunan sinus dikali kosinus, ditambah sinus dikali turunan kosinus. Hasilnya kosinus kuadrat dikurangi sinus kuadrat, yang juga adalah kosinus dua x.',
      ),
    },
  ],

  references: [
    { title: "Thomas' Calculus: Early Transcendentals in SI Units (15th ed.), Section 3.5: Derivatives of Trigonometric Functions", author: 'Joel Hass, Christopher Heil, Maurice D. Weir et al.', year: 2023, source: 'Pearson' },
    { title: 'Calculus (8th ed.), section 3.3: Derivatives of Trigonometric Functions', author: 'James Stewart', year: 2015, source: 'Cengage Learning' },
    { title: 'Introductio in analysin infinitorum', author: 'Leonhard Euler', year: 1748, source: 'Lausanne' },
    { title: 'De Potentia Restitutiva, or of Spring', author: 'Robert Hooke', year: 1678, source: 'John Martyn, London' },
    { title: 'SymPy tutorial: Calculus', author: 'SymPy Development Team', source: 'docs.sympy.org', url: 'https://docs.sympy.org/latest/tutorials/intro-tutorial/calculus.html' },
  ],

  related: ['the-derivative-as-a-rate-of-change', 'differentiation-rules', 'the-chain-rule', 'circles'],
}
