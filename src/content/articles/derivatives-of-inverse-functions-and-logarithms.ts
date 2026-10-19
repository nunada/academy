import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './derivatives-of-inverse-functions-and-logarithms.meta'

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
    T`**The derivative of an inverse function at a point is the reciprocal of the derivative of the function at the corresponding point: $\left(f^{-1}\right)'(b)=\frac{1}{f'\left(f^{-1}(b)\right)}$, and this gives $\frac{d}{dx}\ln x=\frac1x$.** With the chain rule, $\frac{d}{dx}\ln u=\frac{u'}{u}$. Exponentials with other bases follow: $\frac{d}{dx}a^x=a^x\ln a$ and $\frac{d}{dx}\log_a x=\frac{1}{x\ln a}$. When a function is a product, a quotient or has a variable exponent, taking $\ln$ first, logarithmic differentiation, is the quick way.`,
    T`**Turunan fungsi invers di suatu titik adalah kebalikan turunan fungsi itu di titik yang bersesuaian: $\left(f^{-1}\right)'(b)=\frac{1}{f'\left(f^{-1}(b)\right)}$, dan ini memberi $\frac{d}{dx}\ln x=\frac1x$.** Dengan aturan rantai, $\frac{d}{dx}\ln u=\frac{u'}{u}$. Eksponensial dengan basis lain mengikuti: $\frac{d}{dx}a^x=a^x\ln a$ dan $\frac{d}{dx}\log_a x=\frac{1}{x\ln a}$. Bila suatu fungsi berupa hasil kali, hasil bagi, atau berpangkat peubah, mengambil $\ln$ lebih dulu, yaitu diferensiasi logaritmik, adalah cara cepatnya.`,
  ),

  keyPoints: [
    L(
      T`If $f$ is differentiable with $f'\ne0$ on an interval, then $f^{-1}$ is differentiable and $\left(f^{-1}\right)'(b)=\frac{1}{f'(a)}$ where $a=f^{-1}(b)$: the two slopes are reciprocals at corresponding points, like a line and its mirror image in $y=x$.`,
      T`Jika $f$ terdiferensialkan dengan $f'\ne0$ pada suatu selang, maka $f^{-1}$ terdiferensialkan dan $\left(f^{-1}\right)'(b)=\frac{1}{f'(a)}$ dengan $a=f^{-1}(b)$: kedua gradien saling berkebalikan di titik yang bersesuaian, seperti garis dan bayangan cerminnya dalam $y=x$.`,
    ),
    L(
      T`Applied to $e^x$ the rule gives $\frac{d}{dx}\ln x=\frac1x$ for $x>0$; with the chain rule $\frac{d}{dx}\ln u=\frac{u'}{u}$, and $\frac{d}{dx}\ln|x|=\frac1x$ for every $x\ne0$.`,
      T`Diterapkan pada $e^x$ aturan itu memberi $\frac{d}{dx}\ln x=\frac1x$ untuk $x>0$; dengan aturan rantai $\frac{d}{dx}\ln u=\frac{u'}{u}$, dan $\frac{d}{dx}\ln|x|=\frac1x$ untuk setiap $x\ne0$.`,
    ),
    L(
      T`$\frac{d}{dx}a^x=a^x\ln a$ and $\frac{d}{dx}\log_a x=\frac{1}{x\ln a}$; only for $a=e$ is $\ln a=1$, which is why $e$ is the base calculus prefers.`,
      T`$\frac{d}{dx}a^x=a^x\ln a$ dan $\frac{d}{dx}\log_a x=\frac{1}{x\ln a}$; hanya untuk $a=e$ nilai $\ln a=1$, itulah sebabnya $e$ adalah basis yang disukai kalkulus.`,
    ),
    L(
      T`The number $e$ is the limit of $(1+h)^{1/h}$ as $h\to0$, because the logarithm of that expression is the difference quotient $\frac{\ln(1+h)}{h}$ of $\ln$ at $1$, which tends to $\frac11=1$.`,
      T`Bilangan $e$ adalah limit $(1+h)^{1/h}$ saat $h\to0$, karena logaritma ekspresi itu adalah hasil bagi selisih $\frac{\ln(1+h)}{h}$ dari $\ln$ di $1$, yang menuju $\frac11=1$.`,
    ),
    L(
      T`Logarithmic differentiation: take $\ln$ of $y$, split with the laws of logarithms, differentiate, and multiply by $y$; for $y=x^x$ it gives $y'=x^x(\ln x+1)$.`,
      T`Diferensiasi logaritmik: ambil $\ln$ dari $y$, pecah dengan hukum logaritma, turunkan, dan kalikan dengan $y$; untuk $y=x^x$ ia memberi $y'=x^x(\ln x+1)$.`,
    ),
    L(
      T`With $x^n=e^{n\ln x}$ the power rule $\frac{d}{dx}x^n=nx^{n-1}$ holds for every real $n$, irrational ones included; $x^\pi$, $\pi^x$ and $x^x$ are three different cases.`,
      T`Dengan $x^n=e^{n\ln x}$ aturan pangkat $\frac{d}{dx}x^n=nx^{n-1}$ berlaku untuk setiap $n$ real, termasuk yang irasional; $x^\pi$, $\pi^x$, dan $x^x$ adalah tiga kasus yang berbeda.`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------------- the rule for inverses */
    {
      id: 'inverse-rule',
      heading: L('What is the derivative of an inverse function?', 'Berapa turunan suatu fungsi invers?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**If $f$ has an interval as domain and $f'$ exists and is never zero there, then $f^{-1}$ is differentiable at every point of its domain and $\left(f^{-1}\right)'(b)=\frac{1}{f'\left(f^{-1}(b)\right)}$.** In words: the slope of $f^{-1}$ at $x=b$ is the reciprocal of the slope of $f$ at $x=f^{-1}(b)$. The inverse of $f$ *undoes* it, so its graph is the mirror image of the graph of $f$ in the line $y=x$, and a mirror turns a slope $m$ into $\frac1m$.

**A line first.** The function $f(x)=\frac12x+1$ has inverse $f^{-1}(x)=2x-2$. Their derivatives are $\frac12$ and $2$, reciprocals of each other. Reflecting any line that is neither horizontal nor vertical in $y=x$ inverts its slope.

**Other functions: compare at corresponding points.** If the slope of $y=f(x)$ at the point $(a,b)$ is $f'(a)$, with $b=f(a)$, then the slope of $y=f^{-1}(x)$ at the *mirror point* $(b,a)$ is $\frac{1}{f'(a)}$. The derivative of $f$ is read at $a$ and the derivative of $f^{-1}$ at $b=f(a)$. If $f$ has a horizontal tangent at $(a,b)$, its inverse has a vertical tangent at $(b,a)$ and no derivative there, which is why $f'\ne0$ is part of the condition.

**Why the formula holds.** Start from $f\left(f^{-1}(x)\right)=x$ and differentiate both sides, using the [chain rule](article:the-chain-rule#chain-rule) on the left:
$$f'\left(f^{-1}(x)\right)\cdot\left(f^{-1}\right)'(x)=1.$$
Solve for $\left(f^{-1}\right)'(x)$ and the rule appears. The proof assumes that $f^{-1}$ is differentiable; that it is, when $f'\ne0$, is the first half of the theorem, which this article takes on trust.

**Example 1.** The function $f(x)=x^2$ for $x>0$ has the inverse $f^{-1}(x)=\sqrt x$. The rule says $\left(f^{-1}\right)'(x)=\frac{1}{f'\left(\sqrt x\right)}=\frac{1}{2\sqrt x}$, the known derivative of the square root. At $a=2$ and $b=f(2)=4$: $f'(2)=4$ and $\left(f^{-1}\right)'(4)=\frac14$.

**Example 2.** Let $f(x)=x^3-2$ for $x>0$. Find $\left(f^{-1}\right)'(6)$ *without* a formula for $f^{-1}$. First find $a$ with $f(a)=6$: $a^3-2=6$, so $a=2$. Then $f'(2)=3\cdot2^2=12$, and
$$\left(f^{-1}\right)'(6)=\frac{1}{f'(2)}=\frac{1}{12}.$$
Here it is the equation $f(a)=6$ that does the work of the missing formula.

Choose a function below and slide $a$: the mirror-image graph and the two tangent lines are drawn, and the slope of the inverse is checked against a numerical inverse.`,
            T`**Jika $f$ berdomain selang dan $f'$ ada dan tidak pernah nol di sana, maka $f^{-1}$ terdiferensialkan di setiap titik domainnya dan $\left(f^{-1}\right)'(b)=\frac{1}{f'\left(f^{-1}(b)\right)}$.** Dengan kata-kata: gradien $f^{-1}$ di $x=b$ adalah kebalikan gradien $f$ di $x=f^{-1}(b)$. Invers $f$ *membatalkannya*, sehingga grafiknya adalah bayangan cermin grafik $f$ dalam garis $y=x$, dan cermin mengubah gradien $m$ menjadi $\frac1m$.

**Garis lebih dulu.** Fungsi $f(x)=\frac12x+1$ memiliki invers $f^{-1}(x)=2x-2$. Turunannya $\frac12$ dan $2$, saling berkebalikan. Mencerminkan garis apa pun yang tidak mendatar dan tidak tegak dalam $y=x$ membalik gradiennya.

**Fungsi lain: bandingkan di titik yang bersesuaian.** Jika gradien $y=f(x)$ di titik $(a,b)$ adalah $f'(a)$, dengan $b=f(a)$, maka gradien $y=f^{-1}(x)$ di *titik cermin* $(b,a)$ adalah $\frac{1}{f'(a)}$. Turunan $f$ dibaca di $a$ dan turunan $f^{-1}$ di $b=f(a)$. Jika $f$ memiliki garis singgung mendatar di $(a,b)$, inversnya memiliki garis singgung tegak di $(b,a)$ dan tidak berturunan di sana, itulah sebabnya $f'\ne0$ adalah bagian dari syaratnya.

**Mengapa rumus itu berlaku.** Mulai dari $f\left(f^{-1}(x)\right)=x$ dan turunkan kedua ruas, dengan [aturan rantai](article:the-chain-rule#chain-rule) di ruas kiri:
$$f'\left(f^{-1}(x)\right)\cdot\left(f^{-1}\right)'(x)=1.$$
Selesaikan untuk $\left(f^{-1}\right)'(x)$ dan aturannya muncul. Buktinya mengasumsikan bahwa $f^{-1}$ terdiferensialkan; bahwa ia memang demikian, bila $f'\ne0$, adalah separuh pertama teorema, yang di artikel ini diterima begitu saja.

**Contoh 1.** Fungsi $f(x)=x^2$ untuk $x>0$ memiliki invers $f^{-1}(x)=\sqrt x$. Aturan itu menyatakan $\left(f^{-1}\right)'(x)=\frac{1}{f'\left(\sqrt x\right)}=\frac{1}{2\sqrt x}$, turunan akar kuadrat yang sudah dikenal. Di $a=2$ dan $b=f(2)=4$: $f'(2)=4$ dan $\left(f^{-1}\right)'(4)=\frac14$.

**Contoh 2.** Misalkan $f(x)=x^3-2$ untuk $x>0$. Tentukan $\left(f^{-1}\right)'(6)$ *tanpa* rumus untuk $f^{-1}$. Pertama cari $a$ dengan $f(a)=6$: $a^3-2=6$, sehingga $a=2$. Lalu $f'(2)=3\cdot2^2=12$, dan
$$\left(f^{-1}\right)'(6)=\frac{1}{f'(2)}=\frac{1}{12}.$$
Di sini persamaan $f(a)=6$ yang melakukan pekerjaan rumus yang tidak ada.

Pilih fungsi di bawah dan geser $a$: grafik bayangan cermin dan kedua garis singgungnya digambar, dan gradien invers diperiksa dengan invers numerik.`,
          ),
        },
        { kind: 'widget', name: 'inverseslope' },
      ],
    },

    /* ----------------------------------------------------------------- natural logarithm */
    {
      id: 'natural-logarithm',
      heading: L('What is the derivative of ln x?', 'Berapa turunan ln x?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The derivative of the natural logarithm is $\frac{d}{dx}\ln x=\frac1x$ for $x>0$, and with the [chain rule](article:the-chain-rule#outside-inside), $\frac{d}{dx}\ln u=\frac{1}{u}\cdot\frac{du}{dx}$ for a positive differentiable $u(x)$.** The function $\ln x$ is the inverse of $e^x$, whose derivative is $e^x$ itself. By the rule for inverses, with $f(x)=e^x$ and $f^{-1}(x)=\ln x$:
$$\left(f^{-1}\right)'(x)=\frac{1}{f'\left(\ln x\right)}=\frac{1}{e^{\ln x}}=\frac1x.$$

**A second derivation, by implicit differentiation.** Let $y=\ln x$, so that $e^y=x$. Differentiate both sides with respect to $x$, using the chain rule on $e^y$:
$$e^y\,\frac{dy}{dx}=1,\qquad\frac{dy}{dx}=\frac{1}{e^y}=\frac1x.$$
This is the [implicit differentiation](article:implicit-differentiation#method) of an equation that cannot be solved for $y$ without the very function being differentiated.

**Example 3.** Four derivatives with $\ln$.

- $\frac{d}{dx}\ln2x=\frac{1}{2x}\cdot2=\frac1x$. The constant disappears: $\ln2x=\ln2+\ln x$.
- $\frac{d}{dx}\ln\left(x^2+3\right)=\frac{1}{x^2+3}\cdot2x=\frac{2x}{x^2+3}$.
- $\frac{d}{dx}\ln^3x=3\ln^2x\cdot\frac1x=\frac{3\ln^2x}{x}$, since the outside is a cube and the inside is $\ln x$.
- $\frac{d}{dx}\ln|x|=\frac{1}{|x|}\cdot\frac{x}{|x|}=\frac1x$ for $x\ne0$, by $\frac{d}{dx}|x|=\frac{x}{|x|}$. So $\frac1x$ is the derivative of $\ln x$ on $x>0$ and of $\ln(-x)$ on $x<0$.

**Logarithms of products and powers first.** The laws of logarithms make many derivatives shorter. For instance $\ln\sqrt{x^2+1}=\frac12\ln\left(x^2+1\right)$ has the derivative $\frac12\cdot\frac{2x}{x^2+1}=\frac{x}{x^2+1}$, with no square-root derivative at all.

**Example 4.** A line of slope $m$ through the origin is tangent to the graph of $y=\ln x$. What is $m$? Let the point of tangency be $(a,\ln a)$. The slope there is $\frac1a$, and a line through the origin and $(a,\ln a)$ has slope $\frac{\ln a}{a}$. Setting them equal,
$$\frac1a=\frac{\ln a}{a},\qquad\ln a=1,\qquad a=e,\qquad m=\frac1e.$$
The tangent line is $y=\frac{x}{e}$, and it touches the graph at $(e,1)$.

The curve $\ln x$ climbs ever more slowly, and the slope $\frac1x$ falls from large values near $0$ to small ones.`,
            T`**Turunan logaritma natural adalah $\frac{d}{dx}\ln x=\frac1x$ untuk $x>0$, dan dengan [aturan rantai](article:the-chain-rule#outside-inside), $\frac{d}{dx}\ln u=\frac{1}{u}\cdot\frac{du}{dx}$ untuk $u(x)$ positif yang terdiferensialkan.** Fungsi $\ln x$ adalah invers $e^x$, yang turunannya $e^x$ sendiri. Dengan aturan untuk invers, dengan $f(x)=e^x$ dan $f^{-1}(x)=\ln x$:
$$\left(f^{-1}\right)'(x)=\frac{1}{f'\left(\ln x\right)}=\frac{1}{e^{\ln x}}=\frac1x.$$

**Penurunan kedua, dengan diferensiasi implisit.** Misalkan $y=\ln x$, sehingga $e^y=x$. Turunkan kedua ruas terhadap $x$, dengan aturan rantai pada $e^y$:
$$e^y\,\frac{dy}{dx}=1,\qquad\frac{dy}{dx}=\frac{1}{e^y}=\frac1x.$$
Ini adalah [diferensiasi implisit](article:implicit-differentiation#method) pada persamaan yang tidak dapat diselesaikan untuk $y$ tanpa fungsi yang sedang diturunkan itu sendiri.

**Contoh 3.** Empat turunan dengan $\ln$.

- $\frac{d}{dx}\ln2x=\frac{1}{2x}\cdot2=\frac1x$. Konstantanya hilang: $\ln2x=\ln2+\ln x$.
- $\frac{d}{dx}\ln\left(x^2+3\right)=\frac{1}{x^2+3}\cdot2x=\frac{2x}{x^2+3}$.
- $\frac{d}{dx}\ln^3x=3\ln^2x\cdot\frac1x=\frac{3\ln^2x}{x}$, karena fungsi luarnya pangkat tiga dan fungsi dalamnya $\ln x$.
- $\frac{d}{dx}\ln|x|=\frac{1}{|x|}\cdot\frac{x}{|x|}=\frac1x$ untuk $x\ne0$, dengan $\frac{d}{dx}|x|=\frac{x}{|x|}$. Jadi $\frac1x$ adalah turunan $\ln x$ pada $x>0$ dan $\ln(-x)$ pada $x<0$.

**Logaritma hasil kali dan pangkat lebih dulu.** Hukum logaritma membuat banyak turunan lebih pendek. Misalnya $\ln\sqrt{x^2+1}=\frac12\ln\left(x^2+1\right)$ berturunan $\frac12\cdot\frac{2x}{x^2+1}=\frac{x}{x^2+1}$, tanpa turunan akar kuadrat sama sekali.

**Contoh 4.** Garis bergradien $m$ yang melalui titik asal menyinggung grafik $y=\ln x$. Berapa $m$? Misalkan titik singgungnya $(a,\ln a)$. Gradien di sana $\frac1a$, dan garis yang melalui titik asal dan $(a,\ln a)$ bergradien $\frac{\ln a}{a}$. Menyamakannya,
$$\frac1a=\frac{\ln a}{a},\qquad\ln a=1,\qquad a=e,\qquad m=\frac1e.$$
Garis singgungnya $y=\frac{x}{e}$, dan ia menyentuh grafik di $(e,1)$.

Kurva $\ln x$ naik makin pelan, dan gradien $\frac1x$ turun dari nilai besar di dekat $0$ ke nilai kecil.`,
          ),
        },
        {
          kind: 'figure',
          figure: {
            dim: 2,
            ticks: true,
            xSpan: [-0.4, 6.4],
            ySpan: [-2.6, 3.0],
            aspect: 0.7,
            items: [
              { t: 'curve', f: 'ln(x)', color: 'a', from: 0.06, to: 6.2 },
              { t: 'curve', f: '1/x', color: 'b', from: 0.34, to: 6.2 },
              { t: 'curve', f: 'x/e', color: 'c', from: 0, to: 4.2 },
            ],
            caption: L(
              'y = ln x (green), its slope 1/x (orange) and the tangent line y = x/e through the origin (blue), which touches at (e, 1).',
              'y = ln x (hijau), gradiennya 1/x (jingga), dan garis singgung y = x/e melalui titik asal (biru), yang menyentuh di (e, 1).',
            ),
          },
        },
      ],
    },

    /* ------------------------------------------------------ general bases and the number e */
    {
      id: 'general-exponentials',
      heading: L('What are the derivatives of a^x and log base a, and where does e come from?', 'Berapa turunan a^x dan logaritma basis a, dan dari mana e berasal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**For $a>0$, $\frac{d}{dx}a^x=a^x\ln a$, and for $a>0$ with $a\ne1$, $\frac{d}{dx}\log_ax=\frac{1}{x\ln a}$.** Both follow from the natural logarithm. By definition $a^x=e^{x\ln a}$, so by the [chain rule](article:the-chain-rule#outside-inside) the derivative of the exponential $e^{u}$ with $u=x\ln a$ is $e^{x\ln a}\cdot\ln a=a^x\ln a$. With a function $u(x)$ in the exponent,
$$\frac{d}{dx}a^u=a^u\ln a\cdot\frac{du}{dx}.$$
For a logarithm, the change-of-base formula $\log_ax=\frac{\ln x}{\ln a}$ shows a constant $\frac{1}{\ln a}$ in front of $\ln x$, so
$$\frac{d}{dx}\log_au=\frac{1}{u\ln a}\cdot\frac{du}{dx}.$$

**Example 5.** Derivatives of general exponentials.

- $\frac{d}{dx}3^x=3^x\ln3$.
- $\frac{d}{dx}3^{-x}=3^{-x}\ln3\cdot(-1)=-3^{-x}\ln3$.
- $\frac{d}{dx}3^{\sin x}=3^{\sin x}\ln3\cdot\cos x$.
- $\frac{d}{dx}\sin\left(3^x\right)=\cos\left(3^x\right)\cdot3^x\ln3$, with two layers, the sine and the exponential.

**Example 6.** Derivatives of logarithms to other bases: $\frac{d}{dx}\log_{10}x=\frac{1}{x\ln10}$, and $\frac{d}{dx}\log_2\left(x^2+1\right)=\frac{2x}{\left(x^2+1\right)\ln2}$.

**Why $e$ is the preferred base.** If $a=e$ then $\ln a=1$ and the factor disappears: $\frac{d}{dx}e^x=e^x$, and $\frac{d}{dx}\log_ex=\frac1x$. For any other base a constant $\ln a$ follows every derivative. The slope of $a^x$ where its graph crosses the $y$-axis is $a^0\ln a=\ln a$, and by the definition of the derivative it is the limit
$$\lim_{h\to0}\frac{a^h-1}{h}=\ln a.$$
For $a=e$ that limit is $1$: $e$ is the base for which the curve $a^x$ leaves the $y$-axis with slope exactly $1$.

**The number $e$ as a limit.** The derivative of $\ln$ at $1$ is $\frac11=1$, and by the definition of the derivative it is $\lim_{h\to0}\frac{\ln(1+h)-\ln1}{h}=\lim_{h\to0}\frac{\ln(1+h)}{h}$. So $\frac{\ln(1+h)}{h}\to1$. Since $\frac{\ln(1+h)}{h}=\ln\left((1+h)^{1/h}\right)$ and $e^x$ is continuous,
$$\lim_{h\to0}(1+h)^{1/h}=e^1=e.$$
This is the limit behind compound interest. With $h=\frac1n$ it reads $\left(1+\frac1n\right)^n\to e$: money that earns interest $12$ times a year grows by a factor $\left(1+\frac{1}{12}\right)^{12}\approx2.613$ over a year at a nominal rate of $100\%$, $365$ times a year by $2.7146$, and continuously by $e\approx2.71828$.

**An honest remark.** The derivations above assume that the limits $\frac{a^h-1}{h}$ exist. They do, and a later chapter of the book defines $\ln$ and $e^x$ in a way that proves it; here they are taken as known.

Shrink $h$ below and watch the three limits settle.`,
            T`**Untuk $a>0$, $\frac{d}{dx}a^x=a^x\ln a$, dan untuk $a>0$ dengan $a\ne1$, $\frac{d}{dx}\log_ax=\frac{1}{x\ln a}$.** Keduanya mengikuti dari logaritma natural. Menurut definisi $a^x=e^{x\ln a}$, sehingga dengan [aturan rantai](article:the-chain-rule#outside-inside) turunan eksponensial $e^{u}$ dengan $u=x\ln a$ adalah $e^{x\ln a}\cdot\ln a=a^x\ln a$. Dengan fungsi $u(x)$ di pangkat,
$$\frac{d}{dx}a^u=a^u\ln a\cdot\frac{du}{dx}.$$
Untuk logaritma, rumus perubahan basis $\log_ax=\frac{\ln x}{\ln a}$ menunjukkan konstanta $\frac{1}{\ln a}$ di depan $\ln x$, sehingga
$$\frac{d}{dx}\log_au=\frac{1}{u\ln a}\cdot\frac{du}{dx}.$$

**Contoh 5.** Turunan eksponensial umum.

- $\frac{d}{dx}3^x=3^x\ln3$.
- $\frac{d}{dx}3^{-x}=3^{-x}\ln3\cdot(-1)=-3^{-x}\ln3$.
- $\frac{d}{dx}3^{\sin x}=3^{\sin x}\ln3\cdot\cos x$.
- $\frac{d}{dx}\sin\left(3^x\right)=\cos\left(3^x\right)\cdot3^x\ln3$, dengan dua lapisan, sinus dan eksponensial.

**Contoh 6.** Turunan logaritma berbasis lain: $\frac{d}{dx}\log_{10}x=\frac{1}{x\ln10}$, dan $\frac{d}{dx}\log_2\left(x^2+1\right)=\frac{2x}{\left(x^2+1\right)\ln2}$.

**Mengapa $e$ basis yang disukai.** Jika $a=e$ maka $\ln a=1$ dan faktornya hilang: $\frac{d}{dx}e^x=e^x$, dan $\frac{d}{dx}\log_ex=\frac1x$. Untuk basis lain, konstanta $\ln a$ mengikuti setiap turunan. Gradien $a^x$ di tempat grafiknya memotong sumbu-$y$ adalah $a^0\ln a=\ln a$, dan menurut definisi turunan ia adalah limit
$$\lim_{h\to0}\frac{a^h-1}{h}=\ln a.$$
Untuk $a=e$ limit itu $1$: $e$ adalah basis yang kurva $a^x$-nya meninggalkan sumbu-$y$ dengan gradien tepat $1$.

**Bilangan $e$ sebagai limit.** Turunan $\ln$ di $1$ adalah $\frac11=1$, dan menurut definisi turunan ia adalah $\lim_{h\to0}\frac{\ln(1+h)-\ln1}{h}=\lim_{h\to0}\frac{\ln(1+h)}{h}$. Jadi $\frac{\ln(1+h)}{h}\to1$. Karena $\frac{\ln(1+h)}{h}=\ln\left((1+h)^{1/h}\right)$ dan $e^x$ kontinu,
$$\lim_{h\to0}(1+h)^{1/h}=e^1=e.$$
Inilah limit di balik bunga majemuk. Dengan $h=\frac1n$ ia berbunyi $\left(1+\frac1n\right)^n\to e$: uang yang berbunga $12$ kali setahun tumbuh dengan faktor $\left(1+\frac{1}{12}\right)^{12}\approx2{,}613$ dalam setahun pada suku bunga nominal $100\%$, $365$ kali setahun dengan $2{,}7146$, dan terus-menerus dengan $e\approx2{,}71828$.

**Catatan yang jujur.** Penurunan di atas mengasumsikan bahwa limit $\frac{a^h-1}{h}$ ada. Memang ada, dan bab kemudian dalam buku mendefinisikan $\ln$ dan $e^x$ dengan cara yang membuktikannya; di sini ia diterima sebagai diketahui.

Kecilkan $h$ di bawah dan lihat ketiga limit itu menetap.`,
          ),
        },
        { kind: 'widget', name: 'loglimits' },
      ],
    },

    /* --------------------------------------------------------- logarithmic differentiation */
    {
      id: 'logarithmic-differentiation',
      heading: L('What is logarithmic differentiation, and when does it help?', 'Apa itu diferensiasi logaritmik, dan kapan ia membantu?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Logarithmic differentiation takes the natural logarithm of both sides of $y=f(x)$, simplifies with the laws of logarithms, differentiates implicitly, and multiplies by $y$.** It is quickest for products, quotients and powers of many factors, and it is the only method for a function with a variable exponent.

1. Take $\ln$ of both sides and simplify: $\ln(ab)=\ln a+\ln b$, $\ln\frac ab=\ln a-\ln b$, $\ln a^n=n\ln a$.
2. Differentiate both sides with respect to $x$, which gives $\frac{y'}{y}$ on the left (see [implicit differentiation](article:implicit-differentiation#method)).
3. Solve for $y'$, and substitute $y$.

**Example 7.** Find $y'$ for $y=\frac{x^2(x+1)^3}{x-2}$, with $x>2$. Take logarithms:
$$\ln y=2\ln x+3\ln(x+1)-\ln(x-2).$$
Differentiate both sides:
$$\frac{y'}{y}=\frac2x+\frac{3}{x+1}-\frac{1}{x-2}.$$
Multiply by $y$:
$$y'=\frac{x^2(x+1)^3}{x-2}\left(\frac2x+\frac{3}{x+1}-\frac{1}{x-2}\right).$$
At $x=3$: $y=\frac{9\cdot64}{1}=576$ and the bracket is $\frac23+\frac34-1=\frac{5}{12}$, so $y'(3)=576\cdot\frac{5}{12}=240$. The product and quotient rules would reach the same number, with a longer road.

**Example 8: a variable exponent.** For $y=x^x$ with $x>0$ neither the power rule (the exponent is not constant) nor the rule for $a^x$ (the base is not constant) applies. Take logarithms: $\ln y=x\ln x$. Differentiate with the product rule:
$$\frac{y'}{y}=\ln x+x\cdot\frac1x=\ln x+1$$
$$y'=x^x(\ln x+1).$$

**Example 9.** For $y=x^{\sin x}$: $\ln y=\sin x\ln x$ and $\frac{y'}{y}=\cos x\ln x+\frac{\sin x}{x}$, so
$$y'=x^{\sin x}\left(\cos x\ln x+\frac{\sin x}{x}\right).$$

**Negative values.** The logarithm needs positive numbers. If a factor of $y$ is negative, or $y$ itself is, write $\ln|y|$ instead: $\frac{d}{dx}\ln|y|=\frac{y'}{y}$ as well, so the same steps work.

Type a function below: the tool applies the rules, shows logarithmic differentiation for a product, a quotient or a power, and checks the result with a difference quotient.`,
            T`**Diferensiasi logaritmik mengambil logaritma natural kedua ruas $y=f(x)$, menyederhanakan dengan hukum logaritma, menurunkan secara implisit, dan mengalikan dengan $y$.** Ia paling cepat untuk hasil kali, hasil bagi, dan pangkat dari banyak faktor, dan ia satu-satunya cara untuk fungsi dengan pangkat peubah.

1. Ambil $\ln$ kedua ruas dan sederhanakan: $\ln(ab)=\ln a+\ln b$, $\ln\frac ab=\ln a-\ln b$, $\ln a^n=n\ln a$.
2. Turunkan kedua ruas terhadap $x$, yang memberi $\frac{y'}{y}$ di ruas kiri (lihat [diferensiasi implisit](article:implicit-differentiation#method)).
3. Selesaikan untuk $y'$, dan substitusikan $y$.

**Contoh 7.** Tentukan $y'$ untuk $y=\frac{x^2(x+1)^3}{x-2}$, dengan $x>2$. Ambil logaritma:
$$\ln y=2\ln x+3\ln(x+1)-\ln(x-2).$$
Turunkan kedua ruas:
$$\frac{y'}{y}=\frac2x+\frac{3}{x+1}-\frac{1}{x-2}.$$
Kalikan dengan $y$:
$$y'=\frac{x^2(x+1)^3}{x-2}\left(\frac2x+\frac{3}{x+1}-\frac{1}{x-2}\right).$$
Di $x=3$: $y=\frac{9\cdot64}{1}=576$ dan kurungnya $\frac23+\frac34-1=\frac{5}{12}$, sehingga $y'(3)=576\cdot\frac{5}{12}=240$. Aturan hasil kali dan hasil bagi akan mencapai bilangan yang sama, dengan jalan yang lebih panjang.

**Contoh 8: pangkat peubah.** Untuk $y=x^x$ dengan $x>0$ baik aturan pangkat (pangkatnya tidak konstan) maupun aturan untuk $a^x$ (basisnya tidak konstan) tidak berlaku. Ambil logaritma: $\ln y=x\ln x$. Turunkan dengan aturan hasil kali:
$$\frac{y'}{y}=\ln x+x\cdot\frac1x=\ln x+1$$
$$y'=x^x(\ln x+1).$$

**Contoh 9.** Untuk $y=x^{\sin x}$: $\ln y=\sin x\ln x$ dan $\frac{y'}{y}=\cos x\ln x+\frac{\sin x}{x}$, sehingga
$$y'=x^{\sin x}\left(\cos x\ln x+\frac{\sin x}{x}\right).$$

**Nilai negatif.** Logaritma memerlukan bilangan positif. Jika suatu faktor $y$ negatif, atau $y$ sendiri, tulis $\ln|y|$: $\frac{d}{dx}\ln|y|=\frac{y'}{y}$ juga, sehingga langkah yang sama berlaku.

Ketik fungsi di bawah: alat itu menerapkan aturan, menampilkan diferensiasi logaritmik untuk hasil kali, hasil bagi, atau pangkat, dan memeriksa hasilnya dengan hasil bagi selisih.`,
          ),
        },
        { kind: 'widget', name: 'logsteps' },
      ],
    },

    /* ------------------------------------------------------------- the general power rule */
    {
      id: 'general-power-rule',
      heading: L('Why does the power rule hold for irrational exponents?', 'Mengapa aturan pangkat berlaku untuk pangkat irasional?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**For $x>0$ and any real number $n$, $\frac{d}{dx}x^n=nx^{n-1}$, because $x^n$ is defined as $e^{n\ln x}$.** Until now powers were defined by repeated multiplication and roots, which cannot raise a number to the power $\pi$ or $\sqrt2$. The exponential and the logarithm can: for $x>0$ and every real $n$, $x^n=e^{n\ln x}$, so $\ln x^n=n\ln x$ for all real $n$, the law of logarithms that was only proved for rational exponents.

**Proof.** Differentiate $e^{n\ln x}$ with the chain rule: the outside is the exponential, which stays $e^{n\ln x}=x^n$, and the inside is $n\ln x$, with derivative $\frac nx$:
$$\frac{d}{dx}x^n=x^n\cdot\frac nx=nx^{n-1}.$$

**Examples.** $\frac{d}{dx}x^\pi=\pi x^{\pi-1}$ and $\frac{d}{dx}x^{\sqrt2}=\sqrt2\,x^{\sqrt2-1}$.

**Three different cases.** The look of an expression with an exponent tells which rule to reach for.

| Form | What is constant | Rule | Derivative |
|---|---|---|---|
| $x^\pi$ | the exponent | power rule | $\pi x^{\pi-1}$ |
| $\pi^x$ | the base | $a^x$ rule | $\pi^x\ln\pi$ |
| $x^x$ | nothing | logarithmic differentiation | $x^x(\ln x+1)$ |

The first two are single rules; the third is the case that needs the logarithm. A common error is to treat $x^x$ with the power rule, as $x\cdot x^{x-1}$, or with the exponential rule, as $x^x\ln x$: each gives only one of the two terms of $x^x\ln x+x^x$.`,
            T`**Untuk $x>0$ dan bilangan real $n$ mana pun, $\frac{d}{dx}x^n=nx^{n-1}$, karena $x^n$ didefinisikan sebagai $e^{n\ln x}$.** Sampai sekarang pangkat didefinisikan dengan perkalian berulang dan akar, yang tidak dapat memangkatkan bilangan ke $\pi$ atau $\sqrt2$. Eksponensial dan logaritma dapat: untuk $x>0$ dan setiap $n$ real, $x^n=e^{n\ln x}$, sehingga $\ln x^n=n\ln x$ untuk semua $n$ real, hukum logaritma yang tadinya hanya dibuktikan untuk pangkat rasional.

**Bukti.** Turunkan $e^{n\ln x}$ dengan aturan rantai: fungsi luarnya eksponensial, yang tetap $e^{n\ln x}=x^n$, dan fungsi dalamnya $n\ln x$, berturunan $\frac nx$:
$$\frac{d}{dx}x^n=x^n\cdot\frac nx=nx^{n-1}.$$

**Contoh.** $\frac{d}{dx}x^\pi=\pi x^{\pi-1}$ dan $\frac{d}{dx}x^{\sqrt2}=\sqrt2\,x^{\sqrt2-1}$.

**Tiga kasus yang berbeda.** Tampilan ekspresi berpangkat menunjukkan aturan mana yang dipakai.

| Bentuk | Yang konstan | Aturan | Turunan |
|---|---|---|---|
| $x^\pi$ | pangkatnya | aturan pangkat | $\pi x^{\pi-1}$ |
| $\pi^x$ | basisnya | aturan $a^x$ | $\pi^x\ln\pi$ |
| $x^x$ | tidak ada | diferensiasi logaritmik | $x^x(\ln x+1)$ |

Dua yang pertama adalah aturan tunggal; yang ketiga adalah kasus yang memerlukan logaritma. Kekeliruan yang umum adalah memperlakukan $x^x$ dengan aturan pangkat, sebagai $x\cdot x^{x-1}$, atau dengan aturan eksponensial, sebagai $x^x\ln x$: masing-masing hanya memberi satu dari dua suku $x^x\ln x+x^x$.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------- in code */
    {
      id: 'logs-in-code',
      heading: L('How do you differentiate logarithms and inverses in code?', 'Bagaimana menurunkan logaritma dan invers dalam kode?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**SymPy differentiates ´sp.log´ and general powers directly: ´sp.diff(sp.log(x), x)´ is ´1/x´ and ´sp.diff(x**x, x)´ is ´x**x*(log(x) + 1)´.** In SymPy ´log´ is the natural logarithm, and ´sp.log(x, 10)´ is the base-10 one, ´log(x)/log(10)´. Declaring ´x´ positive lets it simplify logarithms of powers. The second program checks the rule for inverses without a formula for $f^{-1}$: it finds $f^{-1}(6)$ for $f(x)=x^3-2$ by bisection, then compares $\frac{1}{f'(a)}$ with a difference quotient of the numerical inverse. Both give $\frac{1}{12}\approx0.083333$.`,
            T`**SymPy menurunkan ´sp.log´ dan pangkat umum secara langsung: ´sp.diff(sp.log(x), x)´ adalah ´1/x´ dan ´sp.diff(x**x, x)´ adalah ´x**x*(log(x) + 1)´.** Di SymPy ´log´ adalah logaritma natural, dan ´sp.log(x, 10)´ adalah yang berbasis 10, ´log(x)/log(10)´. Menyatakan ´x´ positif memungkinkannya menyederhanakan logaritma dari pangkat. Program kedua memeriksa aturan untuk invers tanpa rumus untuk $f^{-1}$: ia mencari $f^{-1}(6)$ untuk $f(x)=x^3-2$ dengan bagi dua, lalu membandingkan $\frac{1}{f'(a)}$ dengan hasil bagi selisih dari invers numerik. Keduanya memberi $\frac{1}{12}\approx0{,}083333$.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python and SymPy: logarithms, general powers and logarithmic differentiation', 'Python dan SymPy: logaritma, pangkat umum, dan diferensiasi logaritmik'),
          code: `import sympy as sp

x = sp.symbols('x', positive=True)
for f in (sp.log(x), sp.log(2 * x), sp.log(x**2 + 3), sp.log(x, 10), 3**x, 3 ** sp.sin(x), x**x, x ** sp.sin(x), x**sp.pi):
    print(f, '->', sp.simplify(sp.diff(f, x)))
# log(x) -> 1/x
# log(2*x) -> 1/x
# log(x**2 + 3) -> 2*x/(x**2 + 3)
# log(x)/log(10) -> 1/(x*log(10))
# 3**x -> 3**x*log(3)
# 3**sin(x) -> 3**sin(x)*log(3)*cos(x)
# x**x -> x**x*(log(x) + 1)
# x**sin(x) -> x**(sin(x) - 1)*(x*log(x)*cos(x) + sin(x))
# x**pi -> pi*x**(-1 + pi)

y = x**2 * (x + 1) ** 3 / (x - 2)                    # Example 7
print(sp.diff(y, x).subs(x, 3), y.subs(x, 3), sp.diff(sp.log(y), x).subs(x, 3))   # 240 576 5/12`,
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: the rule for inverses and the limits for e', 'Python: aturan untuk invers dan limit untuk e'),
          code: `import math


def inverse(f, b, lo, hi):
    """f is increasing on [lo, hi]: find f^-1(b) by bisection."""
    for _ in range(200):
        mid = (lo + hi) / 2
        if f(mid) < b:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


f = lambda t: t**3 - 2
df = lambda t: 3 * t**2
h = 1e-6
a = inverse(f, 6, 0, 3)
print(round(a, 6), round(1 / df(a), 6))                                          # 2.0 0.083333
print(round((inverse(f, 6 + h, 0, 3) - inverse(f, 6 - h, 0, 3)) / (2 * h), 6))   # 0.083333

for h in (0.1, 0.01, 0.001, 0.0001, 0.000001):
    print(h, round((1 + h) ** (1 / h), 6), round(math.log(1 + h) / h, 6), round((2**h - 1) / h, 6))
# 0.1      2.593742  0.953102  0.717735
# 0.01     2.704814  0.995033  0.695555
# 0.001    2.716924  0.9995    0.693387
# 0.0001   2.718146  0.99995   0.693171
# 1e-06    2.71828   0.999999  0.693147
print(round(math.e, 6), round(math.log(2), 6))                                   # 2.718282 0.693147`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++', 'C++'),
          code: `#include <iostream>
#include <cstdio>
#include <cmath>
using namespace std;

double f(double t) { return t * t * t - 2; }

// f is increasing on [lo, hi]: find f^-1(b) by bisection
double inverse(double b, double lo, double hi) {
  for (int i = 0; i < 200; i++) {
    double mid = (lo + hi) / 2;
    if (f(mid) < b) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

int main() {
  double h = 1e-6, a = inverse(6, 0, 3);
  printf("%.6f %.6f\\n", a, 1 / (3 * a * a));                      // f^-1(6) = 2 and 1 / f'(2)
  printf("%.6f\\n", (inverse(6 + h, 0, 3) - inverse(6 - h, 0, 3)) / (2 * h));   // the slope of the inverse

  double hs[5] = {0.1, 0.01, 0.001, 0.0001, 0.000001};
  for (int i = 0; i < 5; i++) {
    double x = hs[i];
    printf("%.6f  %.6f  %.6f  %.6f\\n", x, pow(1 + x, 1 / x), log(1 + x) / x, (pow(2, x) - 1) / x);
  }
  printf("%.6f %.6f\\n", exp(1.0), log(2.0));                      // e and ln 2
  return 0;
}

/* output:
2.000000 0.083333
0.083333
0.100000  2.593742  0.953102  0.717735
0.010000  2.704814  0.995033  0.695555
0.001000  2.716924  0.999500  0.693387
0.000100  2.718146  0.999950  0.693171
0.000001  2.718280  0.999999  0.693147
2.718282 0.693147
*/`,
        },
      ],
    },

    /* ----------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Who invented logarithms, and when did e and the derivative of ln appear?', 'Siapa yang menemukan logaritma, dan kapan e dan turunan ln muncul?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Logarithms came first as a way to multiply large numbers by adding, and the calculus of $\ln$ was found when the area under the hyperbola was recognized as a logarithm.**

- **Napier and Briggs.** The Scottish mathematician John Napier published his table of logarithms in 1614, to turn the long multiplications of astronomy into additions. Henry Briggs, working with Napier, made tables of base-$10$ logarithms, published from 1617.
- **The hyperbola.** In the 1640s Gregory of Saint-Vincent and his pupil de Sarasa showed that the area under $y=\frac1x$ grows by equal steps when $x$ grows by equal factors: the area is a logarithm. That is $\ln x=\int_1^x\frac{dt}{t}$, and it is why its derivative is $\frac1x$.
- **Mercator.** Nicolaus Mercator named the *natural* logarithm and published its series $\ln(1+x)=x-\frac{x^2}{2}+\frac{x^3}{3}-\cdots$ in 1668.
- **The number $e$.** In 1683 Jacob Bernoulli studied the limit of $\left(1+\frac1n\right)^n$ in a problem about compound interest. In the 1730s Leonhard Euler gave the number the letter $e$ and developed the exponential and the logarithm as inverses of each other.`,
            T`**Logaritma mula-mula adalah cara mengalikan bilangan besar dengan menjumlahkan, dan kalkulus $\ln$ ditemukan ketika luas di bawah hiperbola dikenali sebagai logaritma.**

- **Napier dan Briggs.** Matematikawan Skotlandia John Napier menerbitkan tabel logaritmanya pada 1614, untuk mengubah perkalian panjang dalam astronomi menjadi penjumlahan. Henry Briggs, yang bekerja dengan Napier, membuat tabel logaritma basis $10$, diterbitkan sejak 1617.
- **Hiperbola.** Pada 1640-an Gregory dari Saint-Vincent dan muridnya de Sarasa menunjukkan bahwa luas di bawah $y=\frac1x$ bertambah dengan langkah sama ketika $x$ bertambah dengan faktor sama: luas itu adalah logaritma. Itulah $\ln x=\int_1^x\frac{dt}{t}$, dan itulah sebabnya turunannya $\frac1x$.
- **Mercator.** Nicolaus Mercator menamai logaritma *natural* dan menerbitkan deretnya $\ln(1+x)=x-\frac{x^2}{2}+\frac{x^3}{3}-\cdots$ pada 1668.
- **Bilangan $e$.** Pada 1683 Jacob Bernoulli mempelajari limit $\left(1+\frac1n\right)^n$ dalam soal bunga majemuk. Pada 1730-an Leonhard Euler memberi bilangan itu huruf $e$ dan mengembangkan eksponensial dan logaritma sebagai invers satu sama lain.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What mistakes do people make with inverses and logarithms?', 'Kesalahan apa yang sering terjadi pada invers dan logaritma?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with derivatives of inverses and logarithms are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ $\frac{d}{dx}\ln2x=\frac{1}{2x}$ | The inside $2x$ has derivative $2$: $\frac{1}{2x}\cdot2=\frac1x$. |
| ❌ $\frac{d}{dx}\ln\left(x^2+3\right)=\frac{1}{x^2+3}$ | Multiply by the derivative of the inside: $\frac{2x}{x^2+3}$. |
| ❌ $\frac{d}{dx}\ln|x|=\frac{1}{|x|}$ | It is $\frac1x$ for every $x\ne0$, negative values included. |
| ❌ $\frac{d}{dx}3^x=x\cdot3^{x-1}$ | The exponent contains $x$, so the power rule does not apply: $3^x\ln3$. |
| ❌ $\frac{d}{dx}3^x=3^x$ | Only $e^x$ is its own derivative; $3^x$ has the factor $\ln3$. |
| ❌ $\frac{d}{dx}x^x=x\cdot x^{x-1}$ | Both base and exponent vary: logarithmic differentiation gives $x^x(\ln x+1)$. |
| ❌ $\frac{d}{dx}x^\pi=x^\pi\ln\pi$ | The exponent is constant, so the power rule applies: $\pi x^{\pi-1}$. |
| ❌ $\left(f^{-1}\right)'(b)=\frac{1}{f'(b)}$ | The derivative of $f$ is taken at $a=f^{-1}(b)$, not at $b$: $\frac{1}{f'\left(f^{-1}(b)\right)}$. |
| ❌ $f^{-1}(x)$ means $\frac{1}{f(x)}$, so its derivative is $-\frac{f'}{f^2}$ | $f^{-1}$ is the inverse function, which undoes $f$; it is not the reciprocal. |`,
            T`**Kesalahan paling umum pada turunan invers dan logaritma adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ $\frac{d}{dx}\ln2x=\frac{1}{2x}$ | Fungsi dalam $2x$ berturunan $2$: $\frac{1}{2x}\cdot2=\frac1x$. |
| ❌ $\frac{d}{dx}\ln\left(x^2+3\right)=\frac{1}{x^2+3}$ | Kalikan dengan turunan fungsi dalam: $\frac{2x}{x^2+3}$. |
| ❌ $\frac{d}{dx}\ln|x|=\frac{1}{|x|}$ | Ia $\frac1x$ untuk setiap $x\ne0$, termasuk nilai negatif. |
| ❌ $\frac{d}{dx}3^x=x\cdot3^{x-1}$ | Pangkatnya memuat $x$, sehingga aturan pangkat tidak berlaku: $3^x\ln3$. |
| ❌ $\frac{d}{dx}3^x=3^x$ | Hanya $e^x$ yang turunannya dirinya sendiri; $3^x$ memiliki faktor $\ln3$. |
| ❌ $\frac{d}{dx}x^x=x\cdot x^{x-1}$ | Basis dan pangkat sama-sama berubah: diferensiasi logaritmik memberi $x^x(\ln x+1)$. |
| ❌ $\frac{d}{dx}x^\pi=x^\pi\ln\pi$ | Pangkatnya konstan, sehingga aturan pangkat berlaku: $\pi x^{\pi-1}$. |
| ❌ $\left(f^{-1}\right)'(b)=\frac{1}{f'(b)}$ | Turunan $f$ diambil di $a=f^{-1}(b)$, bukan di $b$: $\frac{1}{f'\left(f^{-1}(b)\right)}$. |
| ❌ $f^{-1}(x)$ berarti $\frac{1}{f(x)}$, sehingga turunannya $-\frac{f'}{f^2}$ | $f^{-1}$ adalah fungsi invers, yang membatalkan $f$; ia bukan kebalikan. |`,
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
              L('$\\frac{d}{dx}\\ln x=\\frac1x$ for $x>0$.', '$\\frac{d}{dx}\\ln x=\\frac1x$ untuk $x>0$.'),
              L('$\\frac{d}{dx}\\ln2x=\\frac{1}{2x}$.', '$\\frac{d}{dx}\\ln2x=\\frac{1}{2x}$.'),
              L('$\\frac{d}{dx}3^x=3^x\\ln3$.', '$\\frac{d}{dx}3^x=3^x\\ln3$.'),
              L('$\\frac{d}{dx}\\ln|x|=\\frac1x$ for $x\\ne0$.', '$\\frac{d}{dx}\\ln|x|=\\frac1x$ untuk $x\\ne0$.'),
              L('$\\left(f^{-1}\\right)\'(b)=\\frac{1}{f\'(b)}$.', '$\\left(f^{-1}\\right)\'(b)=\\frac{1}{f\'(b)}$.'),
              L('$\\frac{d}{dx}x^x=x\\cdot x^{x-1}$.', '$\\frac{d}{dx}x^x=x\\cdot x^{x-1}$.'),
            ],
            answer: [true, false, true, true, false, false],
            explain: L(
              'The inside $2x$ adds a factor $2$, so $\\ln2x$ gives $\\frac1x$. The derivative of the inverse uses $f\'$ at $a=f^{-1}(b)$, and $x^x$ needs logarithmic differentiation: $x^x(\\ln x+1)$.',
              'Fungsi dalam $2x$ menambah faktor $2$, sehingga $\\ln2x$ memberi $\\frac1x$. Turunan invers memakai $f\'$ di $a=f^{-1}(b)$, dan $x^x$ memerlukan diferensiasi logaritmik: $x^x(\\ln x+1)$.',
            ),
            hint: L('For each, ask which rule applies, and what the inside function is.', 'Untuk tiap pernyataan, tanyakan aturan mana yang berlaku, dan apa fungsi dalamnya.'),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L('Choose **all** the correct derivatives.', 'Pilih **semua** turunan yang benar.'),
            options: [
              L('$\\frac{d}{dx}\\ln\\left(x^2+3\\right)=\\frac{2x}{x^2+3}$', '$\\frac{d}{dx}\\ln\\left(x^2+3\\right)=\\frac{2x}{x^2+3}$'),
              L('$\\frac{d}{dx}\\log_2x=\\frac{1}{x\\ln2}$', '$\\frac{d}{dx}\\log_2x=\\frac{1}{x\\ln2}$'),
              L('$\\frac{d}{dx}2^x=2^x\\ln2$', '$\\frac{d}{dx}2^x=2^x\\ln2$'),
              L('$\\frac{d}{dx}x^\\pi=\\pi x^{\\pi-1}$', '$\\frac{d}{dx}x^\\pi=\\pi x^{\\pi-1}$'),
              L('$\\frac{d}{dx}\\pi^x=x\\pi^{x-1}$', '$\\frac{d}{dx}\\pi^x=x\\pi^{x-1}$'),
            ],
            answer: [0, 1, 2, 3],
            explain: L('The last one used the power rule on a constant base: $\\frac{d}{dx}\\pi^x=\\pi^x\\ln\\pi$.', 'Yang terakhir memakai aturan pangkat pada basis konstan: $\\frac{d}{dx}\\pi^x=\\pi^x\\ln\\pi$.'),
            hint: L('Is the exponent constant, or the base?', 'Apakah pangkatnya yang konstan, atau basisnya?'),
          },
        },
        {
          kind: 'activity',
          title: L('An inverse at a point', 'Invers di suatu titik'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L('Find $a$ with $f(a)=2$: $a=1$.', 'Cari $a$ dengan $f(a)=2$: $a=1$.'), L('$f\'(1)=3+1=4$, and the answer is $\\frac{1}{f\'(1)}$.', '$f\'(1)=3+1=4$, dan jawabannya $\\frac{1}{f\'(1)}$.')],
            explain: L('$1^3+1=2$, so $a=1$; $f\'(x)=3x^2+1$ gives $f\'(1)=4$, and $\\left(f^{-1}\\right)\'(2)=\\frac14=0.25$.', '$1^3+1=2$, sehingga $a=1$; $f\'(x)=3x^2+1$ memberi $f\'(1)=4$, dan $\\left(f^{-1}\\right)\'(2)=\\frac14=0{,}25$.'),
            prompt: L('Let $f(x)=x^3+x$. Find $\\left(f^{-1}\\right)\'(2)$ (as a decimal).', 'Misalkan $f(x)=x^3+x$. Tentukan $\\left(f^{-1}\\right)\'(2)$ (sebagai desimal).'),
            given: String.raw`\left(f^{-1}\right)'(2)=v`,
            blanks: [{ label: "(f⁻¹)' =", answer: 0.25 }],
          },
        },
        {
          kind: 'activity',
          title: L('Another inverse', 'Invers lain'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L('$x^2+x=6$ with $x>0$ gives $a=2$.', '$x^2+x=6$ dengan $x>0$ memberi $a=2$.'), L('$f\'(2)=2\\cdot2+1=5$.', '$f\'(2)=2\\cdot2+1=5$.')],
            explain: L('$a=2$ because $4+2=6$; $f\'(x)=2x+1$ gives $f\'(2)=5$, so $\\left(f^{-1}\\right)\'(6)=\\frac15=0.2$.', '$a=2$ karena $4+2=6$; $f\'(x)=2x+1$ memberi $f\'(2)=5$, sehingga $\\left(f^{-1}\\right)\'(6)=\\frac15=0{,}2$.'),
            prompt: L('Let $f(x)=x^2+x$ for $x>0$. Find $\\left(f^{-1}\\right)\'(6)$ (as a decimal).', 'Misalkan $f(x)=x^2+x$ untuk $x>0$. Tentukan $\\left(f^{-1}\\right)\'(6)$ (sebagai desimal).'),
            given: String.raw`\left(f^{-1}\right)'(6)=v`,
            blanks: [{ label: "(f⁻¹)' =", answer: 0.2 }],
          },
        },
        {
          kind: 'activity',
          title: L('A logarithm of a sum', 'Logaritma suatu jumlah'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [L('$\\frac{d}{dx}\\ln\\left(x^2+3\\right)=\\frac{2x}{x^2+3}$.', '$\\frac{d}{dx}\\ln\\left(x^2+3\\right)=\\frac{2x}{x^2+3}$.'), L('At $x=1$: $\\frac24$.', 'Di $x=1$: $\\frac24$.')],
            explain: L('$\\frac{2x}{x^2+3}$ at $x=1$ is $\\frac24=0.5$.', '$\\frac{2x}{x^2+3}$ di $x=1$ adalah $\\frac24=0{,}5$.'),
            prompt: L('Find the slope of $y=\\ln\\left(x^2+3\\right)$ at $x=1$.', 'Tentukan gradien $y=\\ln\\left(x^2+3\\right)$ di $x=1$.'),
            given: String.raw`y'(1)=v`,
            blanks: [{ label: "y' =", answer: 0.5 }],
          },
        },
        {
          kind: 'activity',
          title: L('A logarithm of a sine', 'Logaritma suatu sinus'),
          step: {
            kind: 'quiz',
            id: 'p6',
            prompt: L('What is $\\frac{d}{dx}\\ln(\\sin x)$?', 'Berapa $\\frac{d}{dx}\\ln(\\sin x)$?'),
            options: [L('$\\cot x$', '$\\cot x$'), L('$\\frac{1}{\\sin x}$', '$\\frac{1}{\\sin x}$'), L('$\\cos x$', '$\\cos x$'), L('$\\tan x$', '$\\tan x$')],
            answer: 0,
            explain: L('$\\frac{1}{\\sin x}\\cdot\\cos x=\\cot x$: the derivative of the inside divided by the inside.', '$\\frac{1}{\\sin x}\\cdot\\cos x=\\cot x$: turunan fungsi dalam dibagi fungsi dalam.'),
            hint: L('Use $\\frac{d}{dx}\\ln u=\\frac{u\'}{u}$ with $u=\\sin x$.', 'Pakai $\\frac{d}{dx}\\ln u=\\frac{u\'}{u}$ dengan $u=\\sin x$.'),
          },
        },
        {
          kind: 'activity',
          title: L('An exponential with a constant inside', 'Eksponensial dengan konstanta di dalam'),
          step: {
            kind: 'quiz',
            id: 'p7',
            prompt: L('What is $\\frac{d}{dx}5^{2x}$?', 'Berapa $\\frac{d}{dx}5^{2x}$?'),
            options: [L('$2\\cdot5^{2x}\\ln5$', '$2\\cdot5^{2x}\\ln5$'), L('$5^{2x}\\ln5$', '$5^{2x}\\ln5$'), L('$2x\\cdot5^{2x-1}$', '$2x\\cdot5^{2x-1}$'), L('$2\\cdot5^{2x}$', '$2\\cdot5^{2x}$')],
            answer: 0,
            explain: L('$\\frac{d}{dx}a^u=a^u\\ln a\\cdot u\'$ with $u=2x$, so the factor $2$ comes from the inside.', '$\\frac{d}{dx}a^u=a^u\\ln a\\cdot u\'$ dengan $u=2x$, sehingga faktor $2$ berasal dari fungsi dalam.'),
            hint: L('Two factors come out: $\\ln5$ and the derivative of $2x$.', 'Dua faktor muncul: $\\ln5$ dan turunan $2x$.'),
          },
        },
        {
          kind: 'activity',
          title: L('A variable exponent', 'Pangkat peubah'),
          step: {
            kind: 'math',
            id: 'p8',
            hints: [L('$y\'=x^x(\\ln x+1)$.', '$y\'=x^x(\\ln x+1)$.'), L('At $x=1$: $1\\cdot(0+1)$.', 'Di $x=1$: $1\\cdot(0+1)$.')],
            explain: L('$y\'(1)=1^1\\cdot(\\ln1+1)=1$.', '$y\'(1)=1^1\\cdot(\\ln1+1)=1$.'),
            prompt: L('Find the slope of $y=x^x$ at $x=1$.', 'Tentukan gradien $y=x^x$ di $x=1$.'),
            given: String.raw`y'(1)=v`,
            blanks: [{ label: "y' =", answer: 1 }],
          },
        },
        {
          kind: 'activity',
          title: L('Logarithmic differentiation', 'Diferensiasi logaritmik'),
          step: {
            kind: 'math',
            id: 'p9',
            hints: [L('$\\frac{y\'}{y}=\\frac2x+\\frac{3}{x+1}-\\frac{1}{x-2}$.', '$\\frac{y\'}{y}=\\frac2x+\\frac{3}{x+1}-\\frac{1}{x-2}$.'), L('At $x=3$ the bracket is $\\frac{5}{12}$ and $y=576$.', 'Di $x=3$ kurungnya $\\frac{5}{12}$ dan $y=576$.')],
            explain: L('$y\'(3)=576\\cdot\\frac{5}{12}=240$.', '$y\'(3)=576\\cdot\\frac{5}{12}=240$.'),
            prompt: L('For $y=\\frac{x^2(x+1)^3}{x-2}$ use logarithmic differentiation to find $y\'(3)$.', 'Untuk $y=\\frac{x^2(x+1)^3}{x-2}$ pakai diferensiasi logaritmik untuk mencari $y\'(3)$.'),
            given: String.raw`y'(3)=v`,
            blanks: [{ label: "y'(3) =", answer: 240 }],
          },
        },
        {
          kind: 'activity',
          title: L('An irrational power', 'Pangkat irasional'),
          step: {
            kind: 'quiz',
            id: 'p10',
            prompt: L('What is $\\frac{d}{dx}x^{\\sqrt2}$?', 'Berapa $\\frac{d}{dx}x^{\\sqrt2}$?'),
            options: [L('$\\sqrt2\\,x^{\\sqrt2-1}$', '$\\sqrt2\\,x^{\\sqrt2-1}$'), L('$x^{\\sqrt2}\\ln\\sqrt2$', '$x^{\\sqrt2}\\ln\\sqrt2$'), L('$\\sqrt2\\,x^{\\sqrt2}$', '$\\sqrt2\\,x^{\\sqrt2}$'), L('$\\sqrt2\\,x^{\\sqrt2+1}$', '$\\sqrt2\\,x^{\\sqrt2+1}$')],
            answer: 0,
            explain: L('The exponent is a constant, so the power rule holds for it as for any real number: bring it down and subtract $1$.', 'Pangkatnya konstan, sehingga aturan pangkat berlaku untuknya seperti untuk bilangan real mana pun: turunkan pangkatnya dan kurangi $1$.'),
            hint: L('Which part is constant, the base or the exponent?', 'Bagian mana yang konstan, basis atau pangkat?'),
          },
        },
        {
          kind: 'activity',
          title: L('The tangent through the origin', 'Garis singgung melalui titik asal'),
          step: {
            kind: 'quiz',
            id: 'p11',
            prompt: L('A line through the origin is tangent to $y=\\ln x$. What is its slope?', 'Garis melalui titik asal menyinggung $y=\\ln x$. Berapa gradiennya?'),
            options: [L('$\\frac1e$', '$\\frac1e$'), L('$1$', '$1$'), L('$e$', '$e$'), L('$\\frac12$', '$\\frac12$')],
            answer: 0,
            explain: L('At the point of tangency $\\frac1a=\\frac{\\ln a}{a}$, so $\\ln a=1$, $a=e$ and the slope is $\\frac1e$.', 'Di titik singgung $\\frac1a=\\frac{\\ln a}{a}$, sehingga $\\ln a=1$, $a=e$ dan gradiennya $\\frac1e$.'),
            hint: L('Set the slope $\\frac1a$ equal to $\\frac{\\ln a}{a}$.', 'Samakan gradien $\\frac1a$ dengan $\\frac{\\ln a}{a}$.'),
          },
        },
        {
          kind: 'activity',
          title: L('The limit that defines e', 'Limit yang mendefinisikan e'),
          step: {
            kind: 'quiz',
            id: 'p12',
            prompt: L('What does $(1+h)^{1/h}$ tend to as $h\\to0$?', 'Menuju berapa $(1+h)^{1/h}$ saat $h\\to0$?'),
            options: [L('$e$', '$e$'), L('$1$', '$1$'), L('$\\infty$', '$\\infty$'), L('$0$', '$0$')],
            answer: 0,
            explain: L('Its logarithm $\\frac{\\ln(1+h)}{h}$ is the difference quotient of $\\ln$ at $1$, which tends to $\\frac11=1$; so the expression tends to $e^1=e$.', 'Logaritmanya $\\frac{\\ln(1+h)}{h}$ adalah hasil bagi selisih $\\ln$ di $1$, yang menuju $\\frac11=1$; sehingga ekspresinya menuju $e^1=e$.'),
            hint: L('Take the logarithm of the expression first.', 'Ambil dulu logaritma ekspresinya.'),
          },
        },
      ],
    },

    /* ----------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: inverses and logarithms at a glance', 'Ringkasan: invers dan logaritma sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Inverses:** $\left(f^{-1}\right)'(b)=\frac{1}{f'\left(f^{-1}(b)\right)}$ when $f'\ne0$; slopes at mirror points are reciprocals.
- **Natural logarithm:** $\frac{d}{dx}\ln x=\frac1x$, $\frac{d}{dx}\ln u=\frac{u'}{u}$, $\frac{d}{dx}\ln|x|=\frac1x$.
- **Other bases:** $\frac{d}{dx}a^u=a^u\ln a\cdot u'$ and $\frac{d}{dx}\log_au=\frac{u'}{u\ln a}$; $\ln e=1$ makes $e$ the natural base.
- **The number $e$:** $\lim(1+h)^{1/h}=e$ and $\lim\frac{a^h-1}{h}=\ln a$.
- **Logarithmic differentiation:** $\ln y$, split, differentiate, multiply by $y$; $\frac{d}{dx}x^x=x^x(\ln x+1)$.
- **Power rule:** $\frac{d}{dx}x^n=nx^{n-1}$ for every real $n$ because $x^n=e^{n\ln x}$; $x^\pi$, $\pi^x$ and $x^x$ are three cases.
- **Code:** ´sp.diff(sp.log(x), x)´; check an inverse with bisection and a difference quotient.`,
            T`- **Invers:** $\left(f^{-1}\right)'(b)=\frac{1}{f'\left(f^{-1}(b)\right)}$ bila $f'\ne0$; gradien di titik cermin saling berkebalikan.
- **Logaritma natural:** $\frac{d}{dx}\ln x=\frac1x$, $\frac{d}{dx}\ln u=\frac{u'}{u}$, $\frac{d}{dx}\ln|x|=\frac1x$.
- **Basis lain:** $\frac{d}{dx}a^u=a^u\ln a\cdot u'$ dan $\frac{d}{dx}\log_au=\frac{u'}{u\ln a}$; $\ln e=1$ menjadikan $e$ basis natural.
- **Bilangan $e$:** $\lim(1+h)^{1/h}=e$ dan $\lim\frac{a^h-1}{h}=\ln a$.
- **Diferensiasi logaritmik:** $\ln y$, pecah, turunkan, kalikan dengan $y$; $\frac{d}{dx}x^x=x^x(\ln x+1)$.
- **Aturan pangkat:** $\frac{d}{dx}x^n=nx^{n-1}$ untuk setiap $n$ real karena $x^n=e^{n\ln x}$; $x^\pi$, $\pi^x$, dan $x^x$ adalah tiga kasus.
- **Kode:** ´sp.diff(sp.log(x), x)´; periksa invers dengan bagi dua dan hasil bagi selisih.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Inverse function', 'Fungsi invers'), definition: L('A function that undoes another, so that applying one after the other returns the starting number; its graph is the mirror image of the first in the line y equals x.', 'Fungsi yang membatalkan fungsi lain, sehingga menerapkan satu setelah yang lain mengembalikan bilangan awal; grafiknya adalah bayangan cermin grafik pertama dalam garis y sama dengan x.') },
    { term: L('Natural logarithm', 'Logaritma natural'), definition: L('The logarithm to the base e, written ln x, the inverse of the exponential function e to the x, whose derivative is 1 over x.', 'Logaritma berbasis e, ditulis ln x, invers fungsi eksponensial e pangkat x, yang turunannya 1 per x.') },
    { term: L('Logarithmic differentiation', 'Diferensiasi logaritmik'), definition: L('Finding a derivative by taking the logarithm of both sides, simplifying with the laws of logarithms, differentiating implicitly, and multiplying by the original function.', 'Mencari turunan dengan mengambil logaritma kedua ruas, menyederhanakan dengan hukum logaritma, menurunkan secara implisit, dan mengalikan dengan fungsi semula.') },
    { term: L('Euler’s number e', 'Bilangan Euler e'), definition: L('The number about 2.71828 that is the limit of one plus h to the power one over h as h tends to zero, and the base for which the slope of the exponential at the y-axis is exactly 1.', 'Bilangan sekitar 2,71828 yang merupakan limit satu ditambah h pangkat satu per h saat h menuju nol, dan basis yang gradien eksponensialnya di sumbu-y tepat 1.') },
    { term: L('Change-of-base formula', 'Rumus perubahan basis'), definition: L('The identity that log base a of x equals ln x divided by ln a, which reduces every logarithm to the natural one.', 'Kesamaan bahwa logaritma basis a dari x sama dengan ln x dibagi ln a, yang mengubah setiap logaritma menjadi logaritma natural.') },
    { term: L('General power function', 'Fungsi pangkat umum'), definition: L('The function x to the power n for any real n, defined for positive x as e to the power n ln x, so that irrational exponents make sense.', 'Fungsi x pangkat n untuk n real mana pun, didefinisikan untuk x positif sebagai e pangkat n ln x, sehingga pangkat irasional bermakna.') },
  ],

  howTo: [
    {
      name: L('How to find the derivative of an inverse function at a point', 'Cara mencari turunan fungsi invers di suatu titik'),
      description: L('Find the matching point on f, differentiate f there, and take the reciprocal.', 'Cari titik yang bersesuaian pada f, turunkan f di sana, dan ambil kebalikannya.'),
      steps: [
        { name: L('Find a with f of a equal to b', 'Cari a dengan f dari a sama dengan b'), text: L('Solve f of a equals b for a; this is the value of the inverse at b, even when there is no formula for it.', 'Selesaikan f dari a sama dengan b untuk a; ini nilai invers di b, bahkan bila tidak ada rumus untuknya.') },
        { name: L('Differentiate f and evaluate at a', 'Turunkan f dan hitung di a'), text: L('Find f prime of x and put in x equal to a; it must not be zero.', 'Cari f aksen dari x dan masukkan x sama dengan a; nilainya tidak boleh nol.') },
        { name: L('Take the reciprocal', 'Ambil kebalikannya'), text: L('The derivative of the inverse at b is one divided by f prime of a.', 'Turunan invers di b adalah satu dibagi f aksen dari a.') },
      ],
    },
    {
      name: L('How to differentiate with logarithmic differentiation', 'Cara menurunkan dengan diferensiasi logaritmik'),
      description: L('Take the logarithm, differentiate, and multiply by y.', 'Ambil logaritmanya, turunkan, dan kalikan dengan y.'),
      steps: [
        { name: L('Take the logarithm of both sides', 'Ambil logaritma kedua ruas'), text: L('Write ln y and simplify it with the laws of logarithms: products become sums, quotients differences, powers multiples.', 'Tulis ln y dan sederhanakan dengan hukum logaritma: hasil kali menjadi jumlah, hasil bagi selisih, pangkat kelipatan.') },
        { name: L('Differentiate both sides', 'Turunkan kedua ruas'), text: L('The left side gives y prime over y, and the right side is differentiated term by term.', 'Ruas kiri memberi y aksen per y, dan ruas kanan diturunkan suku demi suku.') },
        { name: L('Solve for y prime', 'Selesaikan untuk y aksen'), text: L('Multiply by y and substitute the original formula for y.', 'Kalikan dengan y dan substitusikan rumus semula untuk y.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is the derivative of ln x?', 'Berapa turunan ln x?'),
      a: L(
        'The derivative of the natural logarithm of x is one over x, for x greater than zero. It follows from the rule for inverses applied to the exponential function. With a function u inside, the derivative of ln u is the derivative of u divided by u.',
        'Turunan logaritma natural dari x adalah satu per x, untuk x lebih besar dari nol. Ia mengikuti dari aturan untuk invers yang diterapkan pada fungsi eksponensial. Dengan fungsi u di dalam, turunan ln u adalah turunan u dibagi u.',
      ),
    },
    {
      q: L('What is the derivative of an inverse function?', 'Berapa turunan suatu fungsi invers?'),
      a: L(
        'The derivative of the inverse at b is one divided by the derivative of the original function at a, where a is the number that f sends to b. The slopes of a function and its inverse are reciprocals at points that mirror each other in the line y equals x.',
        'Turunan invers di b adalah satu dibagi turunan fungsi semula di a, dengan a adalah bilangan yang oleh f dikirim ke b. Gradien suatu fungsi dan inversnya saling berkebalikan di titik-titik yang saling mencerminkan dalam garis y sama dengan x.',
      ),
    },
    {
      q: L('What is the derivative of a to the x?', 'Berapa turunan a pangkat x?'),
      a: L(
        'It is a to the x times the natural logarithm of a, for a greater than zero. It comes from writing a to the x as e to the x ln a and using the chain rule. For a equal to e the factor ln a is one, so e to the x is its own derivative.',
        'Turunannya adalah a pangkat x kali logaritma natural a, untuk a lebih besar dari nol. Ia berasal dari menulis a pangkat x sebagai e pangkat x ln a dan memakai aturan rantai. Untuk a sama dengan e faktor ln a adalah satu, sehingga e pangkat x turunannya sendiri.',
      ),
    },
    {
      q: L('What is the derivative of log base a of x?', 'Berapa turunan logaritma basis a dari x?'),
      a: L(
        'It is one divided by x times ln a. Write the logarithm to base a as ln x divided by ln a, and the constant ln a stays in the denominator while ln x is differentiated. For base 10 the derivative is one over x times ln 10.',
        'Turunannya adalah satu dibagi x kali ln a. Tulis logaritma basis a sebagai ln x dibagi ln a, dan konstanta ln a tetap di penyebut sementara ln x diturunkan. Untuk basis 10 turunannya satu per x kali ln 10.',
      ),
    },
    {
      q: L('What is logarithmic differentiation?', 'Apa itu diferensiasi logaritmik?'),
      a: L(
        'It is a method that takes the natural logarithm of both sides of y equals f of x, simplifies with the laws of logarithms, differentiates implicitly, and multiplies by y. It is quickest for long products, quotients and powers, and needed for variable exponents.',
        'Ia adalah cara yang mengambil logaritma natural kedua ruas y sama dengan f dari x, menyederhanakan dengan hukum logaritma, menurunkan secara implisit, dan mengalikan dengan y. Ia paling cepat untuk hasil kali, hasil bagi, dan pangkat yang panjang, dan diperlukan untuk pangkat peubah.',
      ),
    },
    {
      q: L('What is the derivative of x to the x?', 'Berapa turunan x pangkat x?'),
      a: L(
        'It is x to the x times the quantity ln x plus 1. Take the logarithm to get ln y equal to x ln x, differentiate to get y prime over y equal to ln x plus 1, and multiply by y. The power rule alone or the exponential rule alone gives only half of it.',
        'Turunannya adalah x pangkat x kali bilangan ln x ditambah 1. Ambil logaritma untuk mendapat ln y sama dengan x ln x, turunkan untuk mendapat y aksen per y sama dengan ln x ditambah 1, dan kalikan dengan y. Aturan pangkat saja atau aturan eksponensial saja hanya memberi separuhnya.',
      ),
    },
    {
      q: L('What is the derivative of ln of the absolute value of x?', 'Berapa turunan ln nilai mutlak x?'),
      a: L(
        'It is one over x for every x not equal to zero, positive or negative. This is why one over x has an antiderivative on the whole line except zero: ln of the absolute value of x. The chain rule with the derivative of the absolute value gives it.',
        'Turunannya satu per x untuk setiap x tidak sama dengan nol, positif atau negatif. Itulah sebabnya satu per x memiliki antiturunan pada seluruh garis kecuali nol: ln nilai mutlak x. Aturan rantai dengan turunan nilai mutlak memberikannya.',
      ),
    },
    {
      q: L('Why is e the natural base for derivatives?', 'Mengapa e basis natural untuk turunan?'),
      a: L(
        'Because the derivative of a to the x carries the constant ln a, and only for a equal to e is that constant one. Then the exponential function equals its own derivative, and the logarithm to base e has the simplest derivative, one over x.',
        'Karena turunan a pangkat x membawa konstanta ln a, dan hanya untuk a sama dengan e konstanta itu satu. Lalu fungsi eksponensial sama dengan turunannya sendiri, dan logaritma basis e memiliki turunan paling sederhana, satu per x.',
      ),
    },
    {
      q: L('How is e defined as a limit?', 'Bagaimana e didefinisikan sebagai limit?'),
      a: L(
        'The number e is the limit of one plus h, all to the power one over h, as h tends to zero. Its logarithm is ln of one plus h over h, the difference quotient of the natural logarithm at one, which tends to the derivative one over one, which is one.',
        'Bilangan e adalah limit satu ditambah h, semuanya dipangkatkan satu per h, saat h menuju nol. Logaritmanya adalah ln satu ditambah h per h, hasil bagi selisih logaritma natural di satu, yang menuju turunan satu per satu, yaitu satu.',
      ),
    },
  ],

  references: [
    { title: "Thomas' Calculus: Early Transcendentals in SI Units (15th ed.), Section 3.8: Derivatives of Inverse Functions and Logarithms", author: 'Joel Hass, Christopher Heil, Maurice D. Weir et al.', year: 2023, source: 'Pearson' },
    { title: 'Calculus (8th ed.), section 3.6: Derivatives of Logarithmic Functions', author: 'James Stewart', year: 2015, source: 'Cengage Learning' },
    { title: 'Mirifici Logarithmorum Canonis Descriptio', author: 'John Napier', year: 1614, source: 'Andrew Hart, Edinburgh' },
    { title: 'Logarithmotechnia', author: 'Nicolaus Mercator', year: 1668, source: 'London' },
    { title: 'e: The Story of a Number', author: 'Eli Maor', year: 1994, source: 'Princeton University Press' },
  ],

  related: ['the-chain-rule', 'implicit-differentiation', 'inverse-trigonometric-functions', 'derivatives-of-trigonometric-functions'],
}
