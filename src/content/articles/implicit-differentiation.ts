import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './implicit-differentiation.meta'

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
    T`**Implicit differentiation finds $\frac{dy}{dx}$ from an equation in $x$ and $y$ without solving it for $y$: differentiate both sides with respect to $x$, treating $y$ as a differentiable function of $x$, then collect the terms with $\frac{dy}{dx}$ and solve for it.** Each $y$ brings a factor $\frac{dy}{dx}$ by the chain rule, so $\frac{d}{dx}y^2=2y\,\frac{dy}{dx}$. For the circle $x^2+y^2=25$ this gives $\frac{dy}{dx}=-\frac{x}{y}$, the slope at every point where $y\ne0$.`,
    T`**Diferensiasi implisit mencari $\frac{dy}{dx}$ dari persamaan dalam $x$ dan $y$ tanpa menyelesaikannya untuk $y$: turunkan kedua ruas terhadap $x$, dengan memperlakukan $y$ sebagai fungsi $x$ yang terdiferensialkan, lalu kumpulkan suku-suku dengan $\frac{dy}{dx}$ dan selesaikan untuknya.** Setiap $y$ membawa faktor $\frac{dy}{dx}$ lewat aturan rantai, sehingga $\frac{d}{dx}y^2=2y\,\frac{dy}{dx}$. Untuk lingkaran $x^2+y^2=25$ ini memberi $\frac{dy}{dx}=-\frac{x}{y}$, gradien di setiap titik tempat $y\ne0$.`,
  ),

  keyPoints: [
    L(
      T`An equation such as $x^3+y^3=9xy$ defines $y$ implicitly: near most of its points the curve is the graph of a differentiable function of $x$, even when no formula for it can be written.`,
      T`Persamaan seperti $x^3+y^3=9xy$ mendefinisikan $y$ secara implisit: di dekat sebagian besar titiknya kurva itu adalah grafik fungsi $x$ yang terdiferensialkan, walaupun tidak ada rumus untuknya yang dapat ditulis.`,
    ),
    L(
      T`Method: differentiate both sides with respect to $x$ (a factor $\frac{dy}{dx}$ for every $y$), collect the terms with $\frac{dy}{dx}$, solve; the answer usually contains both $x$ and $y$.`,
      T`Cara: turunkan kedua ruas terhadap $x$ (faktor $\frac{dy}{dx}$ untuk setiap $y$), kumpulkan suku-suku dengan $\frac{dy}{dx}$, selesaikan; jawabannya biasanya memuat $x$ dan $y$.`,
    ),
    L(
      T`At a point of the curve with slope $m$ the tangent line is $y-y_0=m(x-x_0)$ and the normal line has slope $-\frac1m$; the tangent is horizontal where the numerator of $\frac{dy}{dx}$ is $0$ and vertical where the denominator is $0$.`,
      T`Di titik kurva dengan gradien $m$ garis singgungnya $y-y_0=m(x-x_0)$ dan garis normalnya bergradien $-\frac1m$; garis singgung mendatar di tempat pembilang $\frac{dy}{dx}$ bernilai $0$ dan tegak di tempat penyebutnya $0$.`,
    ),
    L(
      T`For the second derivative differentiate $\frac{dy}{dx}$ again, put the formula for $\frac{dy}{dx}$ back in, and use the original equation to simplify: for $x^2+y^2=25$, $\frac{d^2y}{dx^2}=-\frac{25}{y^3}$.`,
      T`Untuk turunan kedua turunkan $\frac{dy}{dx}$ lagi, masukkan kembali rumus $\frac{dy}{dx}$, dan pakai persamaan semula untuk menyederhanakan: untuk $x^2+y^2=25$, $\frac{d^2y}{dx^2}=-\frac{25}{y^3}$.`,
    ),
    L(
      T`Implicit differentiation of $y^q=x^p$ proves the power rule $\frac{d}{dx}x^{p/q}=\frac pq\,x^{p/q-1}$ for every rational exponent.`,
      T`Diferensiasi implisit pada $y^q=x^p$ membuktikan aturan pangkat $\frac{d}{dx}x^{p/q}=\frac pq\,x^{p/q-1}$ untuk setiap pangkat rasional.`,
    ),
    L(
      T`Check that the point is on the curve, expect $\frac00$ at points where the curve crosses itself, and remember that the formula is only a formula: $x^2+y^2=-1$ has no points and still gives $-\frac xy$.`,
      T`Periksa bahwa titik itu berada pada kurva, harapkan $\frac00$ di titik tempat kurva memotong dirinya sendiri, dan ingat bahwa rumus itu hanyalah rumus: $x^2+y^2=-1$ tidak memiliki titik dan tetap memberi $-\frac xy$.`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------------ implicit relations */
    {
      id: 'implicit-relations',
      heading: L('What is an implicit function, and why can you not always solve for y?', 'Apa itu fungsi implisit, dan mengapa tidak selalu dapat menyelesaikan untuk y?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**An implicit function is a function that an equation in $x$ and $y$ defines without giving $y$ by a formula: $y$ is whatever number makes the equation true.** Most of the functions so far were *explicit*, $y=f(x)$, with $y$ alone on one side. Three equations are different:

- $y^2=x$ gives two values of $y$ for each $x>0$, namely $\sqrt x$ and $-\sqrt x$;
- $x^2+y^2=25$, the [circle](article:circles#equation) of radius $5$, gives $y=\sqrt{25-x^2}$ or $y=-\sqrt{25-x^2}$;
- $x^3+y^3=9xy$, the *folium of Descartes*, is a cubic in $y$ with no simple formula for its three solutions.

Each of these is a *relation*, not a function: a value of $x$ can have more than one $y$. But the curve can be cut into arcs, and each arc is the graph of a differentiable function of $x$, for example the lower half of the circle through $(3,-4)$.

**Why this matters.** The slope of such a curve is still the derivative of those arcs, and the [derivative rules](article:differentiation-rules#product-rule) will find it if we are able to differentiate *the equation itself* instead of a formula for $y$. That is implicit differentiation. It is the only way for the folium, and for the circle it is shorter than the explicit way.

**The assumption.** In every example the equation is assumed to determine $y$ as a differentiable function of $x$ near the point in question, so that $\frac{dy}{dx}$ exists. The section on what can go wrong says when that fails.`,
            T`**Fungsi implisit adalah fungsi yang didefinisikan oleh persamaan dalam $x$ dan $y$ tanpa memberi $y$ dengan rumus: $y$ adalah bilangan apa pun yang membuat persamaan itu benar.** Kebanyakan fungsi sejauh ini *eksplisit*, $y=f(x)$, dengan $y$ sendirian di satu ruas. Tiga persamaan berikut berbeda:

- $y^2=x$ memberi dua nilai $y$ untuk tiap $x>0$, yaitu $\sqrt x$ dan $-\sqrt x$;
- $x^2+y^2=25$, [lingkaran](article:circles#equation) berjari-jari $5$, memberi $y=\sqrt{25-x^2}$ atau $y=-\sqrt{25-x^2}$;
- $x^3+y^3=9xy$, *folium Descartes*, adalah kubik dalam $y$ yang tiga penyelesaiannya tidak punya rumus sederhana.

Masing-masing adalah *relasi*, bukan fungsi: satu nilai $x$ dapat memiliki lebih dari satu $y$. Tetapi kurvanya dapat dipotong menjadi busur-busur, dan tiap busur adalah grafik fungsi $x$ yang terdiferensialkan, misalnya setengah bawah lingkaran yang melalui $(3,-4)$.

**Mengapa ini penting.** Gradien kurva seperti itu tetap turunan busur-busur tersebut, dan [aturan turunan](article:differentiation-rules#product-rule) akan menemukannya bila kita dapat menurunkan *persamaannya sendiri* dan bukan rumus untuk $y$. Itulah diferensiasi implisit. Ia satu-satunya cara untuk folium, dan untuk lingkaran ia lebih singkat daripada cara eksplisit.

**Asumsinya.** Pada setiap contoh persamaan diasumsikan menentukan $y$ sebagai fungsi $x$ yang terdiferensialkan di dekat titik yang ditinjau, sehingga $\frac{dy}{dx}$ ada. Bagian tentang apa yang dapat salah menjelaskan kapan hal itu gagal.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------ the method */
    {
      id: 'method',
      heading: L('How does implicit differentiation work?', 'Bagaimana diferensiasi implisit bekerja?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To differentiate implicitly, differentiate both sides of the equation with respect to $x$, treating $y$ as a differentiable function of $x$, collect the terms with $\frac{dy}{dx}$ on one side, and solve for $\frac{dy}{dx}$.**

1. Differentiate both sides with respect to $x$, treating $y$ as a differentiable function of $x$.
2. Collect the terms with $\frac{dy}{dx}$ on one side and solve for $\frac{dy}{dx}$.

**Where the factor comes from.** The word *treating* is the [chain rule](article:the-chain-rule#chain-rule). With $y=f(x)$, $y^2$ is a composite function: the outside is a square and the inside is $y$, so $\frac{d}{dx}y^2=2y\cdot\frac{dy}{dx}$. In general every function of $y$ gets one extra factor $y'$:
$$\frac{d}{dx}f(y)=f'(y)\cdot\frac{dy}{dx},$$
and a product such as $xy$ needs the [product rule](article:differentiation-rules#product-rule): $\frac{d}{dx}(xy)=y+x\,\frac{dy}{dx}$. A function of $x$ alone gets no factor.

**Example 1.** Find $\frac{dy}{dx}$ if $y^2=x$. The equation defines two functions we can write, $y=\sqrt x$ and $y=-\sqrt x$ for $x>0$, with derivatives $\frac{1}{2\sqrt x}$ and $-\frac{1}{2\sqrt x}$. But without knowing them, differentiate both sides:
$$2y\,\frac{dy}{dx}=1,\qquad\frac{dy}{dx}=\frac{1}{2y}.$$
One formula gives both: $\frac{1}{2y}=\frac{1}{2\sqrt x}$ when $y=\sqrt x$ and $\frac{1}{2y}=-\frac{1}{2\sqrt x}$ when $y=-\sqrt x$.

**Example 2.** Find the slope of the circle $x^2+y^2=25$ at the point $(3,-4)$. Differentiate:
$$2x+2y\,\frac{dy}{dx}=0,\qquad\frac{dy}{dx}=-\frac{x}{y}.$$
At $(3,-4)$ the slope is $-\frac{3}{-4}=\frac34$. The explicit way agrees: the lower semicircle is $y=-\sqrt{25-x^2}$, whose derivative $\frac{x}{\sqrt{25-x^2}}$ is $\frac34$ at $x=3$. Notice that the explicit formula only works on that half of the circle, but $-\frac xy$ works everywhere on the circle except where $y=0$, and that it contains *both* variables.

**Example 3.** Find $\frac{dy}{dx}$ if $y^2=x^2+\sin(xy)$. Differentiate both sides, using the product rule inside the sine:
$$2y\,y'=2x+\cos(xy)\,(y+x\,y').$$
Collect the terms with $y'$ on the left:
$$2y\,y'-x\cos(xy)\,y'=2x+y\cos(xy).$$
Factor and solve:
$$y'=\frac{2x+y\cos(xy)}{2y-x\cos(xy)}.$$
The formula applies at every point of the curve where the denominator is not $0$.

Type any equation in $x$ and $y$ below, with a point to find the tangent and normal lines there. The curve is drawn, the steps are shown, and the slope is checked by solving the equation numerically on both sides of the point.`,
            T`**Untuk menurunkan secara implisit, turunkan kedua ruas persamaan terhadap $x$, dengan memperlakukan $y$ sebagai fungsi $x$ yang terdiferensialkan, kumpulkan suku-suku dengan $\frac{dy}{dx}$ di satu ruas, dan selesaikan untuk $\frac{dy}{dx}$.**

1. Turunkan kedua ruas terhadap $x$, dengan memperlakukan $y$ sebagai fungsi $x$ yang terdiferensialkan.
2. Kumpulkan suku-suku dengan $\frac{dy}{dx}$ di satu ruas dan selesaikan untuk $\frac{dy}{dx}$.

**Dari mana faktor itu berasal.** Kata *memperlakukan* adalah [aturan rantai](article:the-chain-rule#chain-rule). Dengan $y=f(x)$, $y^2$ adalah fungsi komposit: fungsi luarnya kuadrat dan fungsi dalamnya $y$, sehingga $\frac{d}{dx}y^2=2y\cdot\frac{dy}{dx}$. Secara umum setiap fungsi dari $y$ mendapat satu faktor tambahan $y'$:
$$\frac{d}{dx}f(y)=f'(y)\cdot\frac{dy}{dx},$$
dan hasil kali seperti $xy$ memerlukan [aturan hasil kali](article:differentiation-rules#product-rule): $\frac{d}{dx}(xy)=y+x\,\frac{dy}{dx}$. Fungsi dari $x$ saja tidak mendapat faktor.

**Contoh 1.** Tentukan $\frac{dy}{dx}$ jika $y^2=x$. Persamaan itu mendefinisikan dua fungsi yang dapat kita tulis, $y=\sqrt x$ dan $y=-\sqrt x$ untuk $x>0$, dengan turunan $\frac{1}{2\sqrt x}$ dan $-\frac{1}{2\sqrt x}$. Tetapi tanpa mengetahuinya, turunkan kedua ruas:
$$2y\,\frac{dy}{dx}=1,\qquad\frac{dy}{dx}=\frac{1}{2y}.$$
Satu rumus memberi keduanya: $\frac{1}{2y}=\frac{1}{2\sqrt x}$ bila $y=\sqrt x$ dan $\frac{1}{2y}=-\frac{1}{2\sqrt x}$ bila $y=-\sqrt x$.

**Contoh 2.** Tentukan gradien lingkaran $x^2+y^2=25$ di titik $(3,-4)$. Turunkan:
$$2x+2y\,\frac{dy}{dx}=0,\qquad\frac{dy}{dx}=-\frac{x}{y}.$$
Di $(3,-4)$ gradiennya $-\frac{3}{-4}=\frac34$. Cara eksplisit setuju: setengah lingkaran bawah adalah $y=-\sqrt{25-x^2}$, yang turunannya $\frac{x}{\sqrt{25-x^2}}$ bernilai $\frac34$ di $x=3$. Perhatikan bahwa rumus eksplisit hanya berlaku pada setengah lingkaran itu, tetapi $-\frac xy$ berlaku di mana-mana pada lingkaran kecuali di tempat $y=0$, dan bahwa ia memuat *kedua* peubah.

**Contoh 3.** Tentukan $\frac{dy}{dx}$ jika $y^2=x^2+\sin(xy)$. Turunkan kedua ruas, dengan aturan hasil kali di dalam sinus:
$$2y\,y'=2x+\cos(xy)\,(y+x\,y').$$
Kumpulkan suku-suku dengan $y'$ di ruas kiri:
$$2y\,y'-x\cos(xy)\,y'=2x+y\cos(xy).$$
Faktorkan dan selesaikan:
$$y'=\frac{2x+y\cos(xy)}{2y-x\cos(xy)}.$$
Rumus itu berlaku di setiap titik kurva tempat penyebutnya bukan $0$.

Ketik persamaan apa saja dalam $x$ dan $y$ di bawah, dengan satu titik untuk mencari garis singgung dan garis normal di sana. Kurvanya digambar, langkahnya ditampilkan, dan gradiennya diperiksa dengan menyelesaikan persamaan secara numerik di kedua sisi titik itu.`,
          ),
        },
        { kind: 'widget', name: 'implicitsteps' },
      ],
    },

    /* ----------------------------------------------------------- tangent and normal */
    {
      id: 'tangent-and-normal',
      heading: L('How do you find tangent and normal lines to an implicit curve?', 'Bagaimana mencari garis singgung dan garis normal pada kurva implisit?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**At a point $(x_0,y_0)$ of the curve where the slope is $m$, the tangent line is $y-y_0=m(x-x_0)$ and the normal line, perpendicular to it, has slope $-\frac1m$.** First check that the point is on the curve, then evaluate $\frac{dy}{dx}$ there with *both* coordinates. The two lines are the [tangent line equation](article:tangent-lines-and-derivative-at-a-point#tangent-line-equation) of the earlier article, with the slope found implicitly. The normal line matters in optics: the angles at which a ray of light enters a lens are measured from the normal line to the surface.

**Example 4.** Show that $(2,4)$ lies on the folium $x^3+y^3=9xy$, and find the tangent and normal lines there. The point is on the curve because $8+64=72=9\cdot2\cdot4$. Differentiate:
$$3x^2+3y^2y'=9y+9x\,y'.$$
Collect and solve, then divide the top and bottom by $3$:
$$y'=\frac{9y-3x^2}{3y^2-9x}=\frac{3y-x^2}{y^2-3x}.$$
At $(2,4)$ the slope is $\frac{12-4}{16-6}=\frac45$. The tangent line is $y-4=\frac45(x-2)$, that is $y=\frac45x+\frac{12}{5}$. The normal line has slope $-\frac54$: $y-4=-\frac54(x-2)$, that is $y=-\frac54x+\frac{13}{2}$.

**Example 5: parallel tangents.** The curve $x^2+xy+y^2=7$ meets the $x$-axis where $y=0$ and $x^2=7$, at $\left(\sqrt7,0\right)$ and $\left(-\sqrt7,0\right)$. Differentiating gives $2x+y+x\,y'+2y\,y'=0$, so
$$y'=-\frac{2x+y}{x+2y}.$$
At both points $y=0$ and the slope is $-\frac{2x}{x}=-2$: the tangent lines are parallel.

**Example 6: horizontal and vertical tangents of the folium.** A tangent is horizontal where the numerator of $y'=\frac{3y-x^2}{y^2-3x}$ is $0$, that is $y=\frac{x^2}{3}$, and vertical where the denominator is $0$, that is $y^2=3x$. Put $y=\frac{x^2}{3}$ in the equation of the curve:
$$x^3+\frac{x^6}{27}=3x^3,\qquad x^6=54\,x^3.$$
Apart from the origin, $x^3=54$, so $x=\sqrt[3]{54}=3\sqrt[3]{2}\approx3.78$ and $y=\frac{x^2}{3}=3\sqrt[3]{4}\approx4.76$. The equation does not change when $x$ and $y$ are swapped, so the vertical tangent is at the mirror point $\left(3\sqrt[3]{4},\,3\sqrt[3]{2}\right)\approx(4.76,\,3.78)$.

Move a point around a circle, an ellipse and a rounded square below, and watch the tangent and normal lines turn.`,
            T`**Di titik $(x_0,y_0)$ pada kurva tempat gradiennya $m$, garis singgungnya $y-y_0=m(x-x_0)$ dan garis normalnya, yang tegak lurus padanya, bergradien $-\frac1m$.** Periksa dulu bahwa titik itu berada pada kurva, lalu hitung $\frac{dy}{dx}$ di sana dengan *kedua* koordinat. Kedua garis itu adalah [persamaan garis singgung](article:tangent-lines-and-derivative-at-a-point#tangent-line-equation) pada artikel terdahulu, dengan gradien yang ditemukan secara implisit. Garis normal penting dalam optika: sudut tempat sinar cahaya memasuki lensa diukur dari garis normal pada permukaannya.

**Contoh 4.** Tunjukkan bahwa $(2,4)$ terletak pada folium $x^3+y^3=9xy$, dan tentukan garis singgung dan garis normal di sana. Titik itu berada pada kurva karena $8+64=72=9\cdot2\cdot4$. Turunkan:
$$3x^2+3y^2y'=9y+9x\,y'.$$
Kumpulkan dan selesaikan, lalu bagi pembilang dan penyebut dengan $3$:
$$y'=\frac{9y-3x^2}{3y^2-9x}=\frac{3y-x^2}{y^2-3x}.$$
Di $(2,4)$ gradiennya $\frac{12-4}{16-6}=\frac45$. Garis singgungnya $y-4=\frac45(x-2)$, yaitu $y=\frac45x+\frac{12}{5}$. Garis normalnya bergradien $-\frac54$: $y-4=-\frac54(x-2)$, yaitu $y=-\frac54x+\frac{13}{2}$.

**Contoh 5: garis singgung sejajar.** Kurva $x^2+xy+y^2=7$ memotong sumbu-$x$ di tempat $y=0$ dan $x^2=7$, di $\left(\sqrt7,0\right)$ dan $\left(-\sqrt7,0\right)$. Menurunkannya memberi $2x+y+x\,y'+2y\,y'=0$, sehingga
$$y'=-\frac{2x+y}{x+2y}.$$
Di kedua titik $y=0$ dan gradiennya $-\frac{2x}{x}=-2$: garis singgungnya sejajar.

**Contoh 6: garis singgung mendatar dan tegak pada folium.** Garis singgung mendatar di tempat pembilang $y'=\frac{3y-x^2}{y^2-3x}$ bernilai $0$, yaitu $y=\frac{x^2}{3}$, dan tegak di tempat penyebutnya $0$, yaitu $y^2=3x$. Masukkan $y=\frac{x^2}{3}$ ke persamaan kurva:
$$x^3+\frac{x^6}{27}=3x^3,\qquad x^6=54\,x^3.$$
Selain titik asal, $x^3=54$, sehingga $x=\sqrt[3]{54}=3\sqrt[3]{2}\approx3{,}78$ dan $y=\frac{x^2}{3}=3\sqrt[3]{4}\approx4{,}76$. Persamaan tidak berubah bila $x$ dan $y$ dipertukarkan, sehingga garis singgung tegaknya di titik cermin $\left(3\sqrt[3]{4},\,3\sqrt[3]{2}\right)\approx(4{,}76;\,3{,}78)$.

Gerakkan titik mengelilingi lingkaran, elips, dan persegi bulat di bawah, dan lihat garis singgung dan garis normalnya berputar.`,
          ),
        },
        { kind: 'widget', name: 'implicitslide' },
      ],
    },

    /* ------------------------------------------------------------- higher derivatives */
    {
      id: 'higher-order',
      heading: L('How do you find the second derivative of an implicit function?', 'Bagaimana mencari turunan kedua fungsi implisit?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To find $\frac{d^2y}{dx^2}$, differentiate the formula for $y'$ again, treating $y$ as a function of $x$, and then put the formula for $y'$ in place of every $y'$ that appears.** The result has only $x$ and $y$ in it, and the original equation can often shorten it.

**Example 7.** Find $y''$ if $2x^3-3y^2=8$. First, $6x^2-6y\,y'=0$, so
$$y'=\frac{x^2}{y}\qquad(y\ne0).$$
Differentiate with the [quotient rule](article:differentiation-rules#quotient-rule), remembering that $y$ is a function of $x$:
$$y''=\frac{2x\cdot y-x^2\cdot y'}{y^2}.$$
Now substitute $y'=\frac{x^2}{y}$:
$$y''=\frac{2xy-x^2\cdot\frac{x^2}{y}}{y^2}=\frac{2x}{y}-\frac{x^4}{y^3}.$$

**Example 8: the circle.** For $x^2+y^2=25$ we found $y'=-\frac{x}{y}$. Then
$$y''=-\frac{y-x\,y'}{y^2}=-\frac{y+\frac{x^2}{y}}{y^2}$$
$$=-\frac{x^2+y^2}{y^3}.$$
The original equation says $x^2+y^2=25$, so
$$\frac{d^2y}{dx^2}=-\frac{25}{y^3}.$$
At $(3,-4)$ that is $\frac{25}{64}>0$: the lower semicircle is bent upward there, like a bowl, as it should be. At $(0,5)$ it is $-\frac{25}{125}=-\frac15<0$: the top of the circle bends downward.

The same pattern works for third and higher derivatives: each step differentiates the previous formula and replaces $y'$ again. Tick *also the second derivative* in the tool above to see $y''$ for any equation; the formulas come out longer than by hand, because the tool does not use the original equation to shorten them.`,
            T`**Untuk mencari $\frac{d^2y}{dx^2}$, turunkan rumus $y'$ sekali lagi, dengan memperlakukan $y$ sebagai fungsi $x$, lalu masukkan rumus $y'$ sebagai pengganti setiap $y'$ yang muncul.** Hasilnya hanya memuat $x$ dan $y$, dan persamaan semula sering dapat memperpendeknya.

**Contoh 7.** Tentukan $y''$ jika $2x^3-3y^2=8$. Pertama, $6x^2-6y\,y'=0$, sehingga
$$y'=\frac{x^2}{y}\qquad(y\ne0).$$
Turunkan dengan [aturan hasil bagi](article:differentiation-rules#quotient-rule), dengan ingat bahwa $y$ adalah fungsi $x$:
$$y''=\frac{2x\cdot y-x^2\cdot y'}{y^2}.$$
Sekarang substitusikan $y'=\frac{x^2}{y}$:
$$y''=\frac{2xy-x^2\cdot\frac{x^2}{y}}{y^2}=\frac{2x}{y}-\frac{x^4}{y^3}.$$

**Contoh 8: lingkaran.** Untuk $x^2+y^2=25$ kita menemukan $y'=-\frac{x}{y}$. Maka
$$y''=-\frac{y-x\,y'}{y^2}=-\frac{y+\frac{x^2}{y}}{y^2}$$
$$=-\frac{x^2+y^2}{y^3}.$$
Persamaan semula menyatakan $x^2+y^2=25$, sehingga
$$\frac{d^2y}{dx^2}=-\frac{25}{y^3}.$$
Di $(3,-4)$ itu $\frac{25}{64}>0$: setengah lingkaran bawah melengkung ke atas di sana, seperti mangkuk, sebagaimana mestinya. Di $(0,5)$ itu $-\frac{25}{125}=-\frac15<0$: puncak lingkaran melengkung ke bawah.

Pola yang sama berlaku untuk turunan ketiga dan lebih tinggi: tiap langkah menurunkan rumus sebelumnya dan mengganti $y'$ lagi. Centang *juga turunan kedua* pada alat di atas untuk melihat $y''$ dari persamaan apa saja; rumusnya keluar lebih panjang daripada cara manual, karena alat itu tidak memakai persamaan semula untuk memperpendeknya.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------- rational powers */
    {
      id: 'rational-powers',
      heading: L('How does implicit differentiation prove the power rule for fractions?', 'Bagaimana diferensiasi implisit membuktikan aturan pangkat untuk pecahan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**If $p$ and $q$ are integers with $q>0$ and $y=x^{p/q}$, then $\frac{dy}{dx}=\frac pq\,x^{p/q-1}$: the [power rule](article:differentiation-rules#constants-and-powers) holds for every rational exponent.** The proof is implicit differentiation of an equation that has no fraction in it. Since $y=x^{p/q}$, we have $y^q=x^p$. Differentiate both sides with respect to $x$:
$$q\,y^{q-1}\,y'=p\,x^{p-1}.$$
Solve for $y'$, and replace $y^{q-1}$ by $x^{p(q-1)/q}$:
$$y'=\frac pq\cdot\frac{x^{p-1}}{y^{q-1}}$$
$$=\frac pq\cdot x^{p-1-\frac{p(q-1)}{q}}=\frac pq\cdot x^{\frac pq-1}.$$
The exponent works out because $p-1-p+\frac pq=\frac pq-1$. The result holds where $y\ne0$ and $y$ is differentiable.

**Examples.** For $y=\sqrt x$ take $y^2=x$: $2y\,y'=1$ and $y'=\frac{1}{2\sqrt x}$. For $y=x^{2/3}$ take $y^3=x^2$: $3y^2y'=2x$, so
$$y'=\frac{2x}{3y^2}=\frac{2x}{3x^{4/3}}=\frac23\,x^{-1/3}.$$
This is the derivative of $x^{2/3}$ met in the earlier articles, which is undefined at $x=0$, as the formula $x^{-1/3}$ predicts.

The [chain rule](article:the-chain-rule#power-chain-rule) then lets the exponent sit on any function: $\frac{d}{dx}u^{p/q}=\frac pq\,u^{p/q-1}\frac{du}{dx}$.`,
            T`**Jika $p$ dan $q$ bilangan bulat dengan $q>0$ dan $y=x^{p/q}$, maka $\frac{dy}{dx}=\frac pq\,x^{p/q-1}$: [aturan pangkat](article:differentiation-rules#constants-and-powers) berlaku untuk setiap pangkat rasional.** Buktinya adalah diferensiasi implisit pada persamaan yang tidak memuat pecahan. Karena $y=x^{p/q}$, kita punya $y^q=x^p$. Turunkan kedua ruas terhadap $x$:
$$q\,y^{q-1}\,y'=p\,x^{p-1}.$$
Selesaikan untuk $y'$, dan ganti $y^{q-1}$ dengan $x^{p(q-1)/q}$:
$$y'=\frac pq\cdot\frac{x^{p-1}}{y^{q-1}}$$
$$=\frac pq\cdot x^{p-1-\frac{p(q-1)}{q}}=\frac pq\cdot x^{\frac pq-1}.$$
Pangkatnya cocok karena $p-1-p+\frac pq=\frac pq-1$. Hasilnya berlaku di tempat $y\ne0$ dan $y$ terdiferensialkan.

**Contoh.** Untuk $y=\sqrt x$ ambil $y^2=x$: $2y\,y'=1$ dan $y'=\frac{1}{2\sqrt x}$. Untuk $y=x^{2/3}$ ambil $y^3=x^2$: $3y^2y'=2x$, sehingga
$$y'=\frac{2x}{3y^2}=\frac{2x}{3x^{4/3}}=\frac23\,x^{-1/3}.$$
Ini adalah turunan $x^{2/3}$ yang dijumpai pada artikel-artikel terdahulu, yang tak terdefinisi di $x=0$, seperti diramalkan rumus $x^{-1/3}$.

[Aturan rantai](article:the-chain-rule#power-chain-rule) lalu memungkinkan pangkat itu berada pada fungsi apa pun: $\frac{d}{dx}u^{p/q}=\frac pq\,u^{p/q-1}\frac{du}{dx}$.`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------- pitfalls */
    {
      id: 'pitfalls',
      heading: L('What can go wrong with implicit differentiation?', 'Apa yang dapat salah pada diferensiasi implisit?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The formula $y'=-\frac AB$ is only meaningful at points that are on the curve and where $B\ne0$; at other points it is wrong, undefined, or $\frac00$.**

- **The point must be on the curve.** The formula $-\frac xy$ gives a number at $(1,1)$, but $(1,1)$ is not on $x^2+y^2=25$, so that number is the slope of nothing. Always check that the coordinates satisfy the equation first, as in Example 4.
- **A zero denominator means a vertical tangent, not "no tangent".** Where $B=0$ and $A\ne0$ the quantity $\frac{dy}{dx}$ does not exist but the curve is smooth and its tangent line is vertical: on the circle at $(5,0)$ and $(-5,0)$, where $y=0$. In the folium, at $\left(3\sqrt[3]{4},3\sqrt[3]{2}\right)$.
- **$\frac00$ at a crossing.** At the origin the folium's formula $\frac{3y-x^2}{y^2-3x}$ is $\frac00$. That is not a slope of $0$. Near the origin the term $9xy$ dominates, so the curve looks like $xy=0$: two branches cross there, one along each axis, with tangents $y=0$ and $x=0$. A point where a curve crosses itself has two tangent lines and no single slope.
- **A formula is not a curve.** The equation $x^2+y^2=-1$ is satisfied by no real point, yet differentiating it produces $y'=-\frac xy$ just the same. The method assumes that $y$ exists as a differentiable function, and does not check it.
- **When does the assumption hold?** If the equation is $F(x,y)=0$ with smooth $F$ and $B\ne0$ at a point of the curve, the *implicit function theorem* says that near that point the curve really is the graph of a differentiable function $y(x)$. That is why a nonzero denominator is the condition to look at.`,
            T`**Rumus $y'=-\frac AB$ hanya bermakna di titik yang berada pada kurva dan tempat $B\ne0$; di titik lain ia salah, tak terdefinisi, atau $\frac00$.**

- **Titiknya harus berada pada kurva.** Rumus $-\frac xy$ memberi bilangan di $(1,1)$, tetapi $(1,1)$ tidak berada pada $x^2+y^2=25$, sehingga bilangan itu adalah gradien tak ada apa-apa. Selalu periksa lebih dulu bahwa koordinatnya memenuhi persamaan, seperti pada Contoh 4.
- **Penyebut nol berarti garis singgung tegak, bukan "tidak ada garis singgung".** Di tempat $B=0$ dan $A\ne0$ besaran $\frac{dy}{dx}$ tidak ada tetapi kurvanya mulus dan garis singgungnya tegak: pada lingkaran di $(5,0)$ dan $(-5,0)$, tempat $y=0$. Pada folium, di $\left(3\sqrt[3]{4},3\sqrt[3]{2}\right)$.
- **$\frac00$ pada persilangan.** Di titik asal rumus folium $\frac{3y-x^2}{y^2-3x}$ bernilai $\frac00$. Itu bukan gradien $0$. Di dekat titik asal suku $9xy$ mendominasi, sehingga kurvanya tampak seperti $xy=0$: dua cabang berpotongan di sana, satu sepanjang tiap sumbu, dengan garis singgung $y=0$ dan $x=0$. Titik tempat kurva memotong dirinya sendiri memiliki dua garis singgung dan tidak punya satu gradien.
- **Rumus bukan kurva.** Persamaan $x^2+y^2=-1$ tidak dipenuhi titik real mana pun, namun menurunkannya tetap menghasilkan $y'=-\frac xy$. Cara ini mengasumsikan bahwa $y$ ada sebagai fungsi yang terdiferensialkan, dan tidak memeriksanya.
- **Kapan asumsi itu berlaku?** Jika persamaannya $F(x,y)=0$ dengan $F$ mulus dan $B\ne0$ di suatu titik kurva, *teorema fungsi implisit* menyatakan bahwa di dekat titik itu kurva benar-benar grafik fungsi $y(x)$ yang terdiferensialkan. Itulah sebabnya penyebut tak nol adalah syarat yang perlu dilihat.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------- in code */
    {
      id: 'implicit-in-code',
      heading: L('How do you differentiate implicitly in code?', 'Bagaimana menurunkan secara implisit dalam kode?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**SymPy has the method built in: ´sp.idiff(F, y, x)´ differentiates the equation $F(x,y)=0$ implicitly and returns $\frac{dy}{dx}$, and a fourth argument asks for a higher derivative.** The equation is given as an expression equal to zero, so $x^3+y^3=9xy$ becomes ´x**3 + y**3 - 9*x*y´. SymPy writes the folium's slope as $\frac{x^2-3y}{3x-y^2}$, which is our $\frac{3y-x^2}{y^2-3x}$ with the top and bottom both multiplied by $-1$. For the circle it gives the second derivative $-\frac{1}{y}\left(\frac{x^2}{y^2}+1\right)$, which is $-\frac{x^2+y^2}{y^3}$.

**A check that needs no calculus.** Solve the equation numerically for $y$ at $x=2+h$ and at $x=2-h$ with Newton's method, and take the difference quotient: it is the slope, because it is the derivative of the function that the curve defines, with no formula for $y$ ever written.`,
            T`**SymPy memiliki metode ini bawaan: ´sp.idiff(F, y, x)´ menurunkan persamaan $F(x,y)=0$ secara implisit dan mengembalikan $\frac{dy}{dx}$, dan argumen keempat meminta turunan yang lebih tinggi.** Persamaan diberikan sebagai ekspresi yang sama dengan nol, sehingga $x^3+y^3=9xy$ menjadi ´x**3 + y**3 - 9*x*y´. SymPy menulis gradien folium sebagai $\frac{x^2-3y}{3x-y^2}$, yaitu $\frac{3y-x^2}{y^2-3x}$ kita dengan pembilang dan penyebut sama-sama dikalikan $-1$. Untuk lingkaran ia memberi turunan kedua $-\frac{1}{y}\left(\frac{x^2}{y^2}+1\right)$, yaitu $-\frac{x^2+y^2}{y^3}$.

**Pemeriksaan yang tidak memerlukan kalkulus.** Selesaikan persamaan secara numerik untuk $y$ di $x=2+h$ dan di $x=2-h$ dengan metode Newton, lalu ambil hasil bagi selisih: itulah gradiennya, karena ia turunan fungsi yang didefinisikan kurva itu, tanpa pernah menulis rumus untuk $y$.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python and SymPy: implicit derivatives, checked numerically', 'Python dan SymPy: turunan implisit, diperiksa secara numerik'),
          code: `import sympy as sp

x, y = sp.symbols('x y')
print(sp.idiff(x**3 + y**3 - 9 * x * y, y, x))          # (x**2 - 3*y)/(3*x - y**2)
print(sp.idiff(x**2 + y**2 - 25, y, x, 2))              # -(x**2/y**2 + 1)/y
print(sp.idiff(2 * x**3 - 3 * y**2 - 8, y, x, 2))       # x*(-x**3/y**2 + 2)/y
print(sp.simplify(sp.idiff(sp.sin(x * y) - x - y, y, x)))   # (-y*cos(x*y) + 1)/(x*cos(x*y) - 1)


def solve_y(x, y):
    """Newton's method on F(x, y) = 0, for y, starting from a guess."""
    for _ in range(50):
        f = x**3 + y**3 - 9 * x * y
        d = 3 * y**2 - 9 * x                              # the derivative of F with respect to y
        y -= f / d
    return y


h = 1e-6
print(round((solve_y(2 + h, 4) - solve_y(2 - h, 4)) / (2 * h), 6))   # 0.8  (a difference quotient of the solutions)
print(round(solve_y(2, 4), 6))                                        # 4.0  (the point (2, 4) is on the curve)
slope = lambda x, y: (3 * y - x**2) / (y**2 - 3 * x)
print(round(slope(2, 4), 6))                                          # 0.8  (the formula of Example 4)`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++', 'C++'),
          code: `#include <iostream>
#include <cstdio>
using namespace std;

// Newton's method on F(x, y) = x^3 + y^3 - 9xy = 0, for y, starting from a guess
double solveY(double x, double y) {
  for (int i = 0; i < 50; i++) {
    double f = x * x * x + y * y * y - 9 * x * y;
    double d = 3 * y * y - 9 * x;                      // the derivative of F with respect to y
    y -= f / d;
  }
  return y;
}

// the implicit derivative: dy/dx = (3y - x^2) / (y^2 - 3x)
double slope(double x, double y) { return (3 * y - x * x) / (y * y - 3 * x); }

int main() {
  double h = 1e-6;
  printf("%.6f\\n", (solveY(2 + h, 4) - solveY(2 - h, 4)) / (2 * h));   // a difference quotient of the solutions
  printf("%.6f\\n", solveY(2, 4));                                       // the point (2, 4) is on the curve
  printf("%.6f\\n", slope(2, 4));                                        // the formula of Example 4
  return 0;
}

/* output:
0.800000
4.000000
0.800000
*/`,
        },
      ],
    },

    /* ----------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Who first differentiated equations without solving them?', 'Siapa yang pertama menurunkan persamaan tanpa menyelesaikannya?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Curves given by equations were the first problems of the calculus, and the folium of Descartes was one of its first tests.**

- **Descartes and Fermat.** In 1638 René Descartes proposed the curve $x^3+y^3=3axy$, today called the folium of Descartes, as a challenge to Pierre de Fermat: find its tangent line at any point. Fermat solved it easily, which Descartes had been unable to do, and the episode is remembered as a test of the new methods of tangents.
- **Newton.** Isaac Newton's *Method of Fluxions*, written in 1671 and published in 1736, treats curves given by an equation between two flowing quantities $x$ and $y$ and finds the ratio of their rates of change directly from the equation, without solving it for $y$. That is implicit differentiation in the language of fluxions.
- **The theorem behind it.** Why $y$ exists as a differentiable function near a point where $B\ne0$ was settled much later. Augustin-Louis Cauchy is credited with the first rigorous implicit function theorem, and Ulisse Dini gave the general form for several variables in 1878.`,
            T`**Kurva yang diberikan oleh persamaan adalah soal-soal pertama kalkulus, dan folium Descartes adalah salah satu ujian pertamanya.**

- **Descartes dan Fermat.** Pada 1638 René Descartes mengajukan kurva $x^3+y^3=3axy$, kini disebut folium Descartes, sebagai tantangan bagi Pierre de Fermat: tentukan garis singgungnya di titik mana pun. Fermat menyelesaikannya dengan mudah, yang tidak dapat dilakukan Descartes, dan peristiwa itu dikenang sebagai ujian bagi cara-cara baru mencari garis singgung.
- **Newton.** *Method of Fluxions* karya Isaac Newton, ditulis pada 1671 dan diterbitkan pada 1736, memperlakukan kurva yang diberikan oleh persamaan antara dua besaran mengalir $x$ dan $y$ dan menemukan perbandingan laju perubahannya langsung dari persamaan itu, tanpa menyelesaikannya untuk $y$. Itu adalah diferensiasi implisit dalam bahasa fluksi.
- **Teorema di baliknya.** Mengapa $y$ ada sebagai fungsi yang terdiferensialkan di dekat titik tempat $B\ne0$ dituntaskan jauh kemudian. Augustin-Louis Cauchy dikreditkan dengan teorema fungsi implisit rigor yang pertama, dan Ulisse Dini memberi bentuk umumnya untuk beberapa peubah pada 1878.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What mistakes do people make with implicit differentiation?', 'Kesalahan apa yang sering terjadi pada diferensiasi implisit?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with implicit differentiation are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ $\frac{d}{dx}y^2=2y$ | $y$ depends on $x$, so the chain rule adds a factor: $2y\,\frac{dy}{dx}$. |
| ❌ $\frac{d}{dx}(xy)=y$ | It is a product of two functions of $x$: $y+x\,\frac{dy}{dx}$. |
| ❌ $\frac{d}{dx}\sin y=\cos y$ | Again a factor: $\cos y\cdot\frac{dy}{dx}$. |
| ❌ $\frac{dy}{dx}$ may contain only $x$ | It usually contains both $x$ and $y$, and is evaluated at a point with both coordinates. |
| ❌ Put any point into the slope formula | The point must satisfy the equation; otherwise the number is the slope of nothing. |
| ❌ For $y'=-\frac{x}{y}$, $y''=-\frac1y$ | $y$ is a function of $x$: $y''=-\frac{y-x\,y'}{y^2}$, which is $-\frac{25}{y^3}$ on $x^2+y^2=25$. |
| ❌ If the denominator of $y'$ is $0$, there is no tangent line | The tangent line is vertical there, as at $(5,0)$ on the circle $x^2+y^2=25$. |
| ❌ At the origin of the folium, $\frac00$ means the slope is $0$ | $\frac00$ is undetermined: two branches cross, with tangents $y=0$ and $x=0$. |
| ❌ Implicit differentiation works only when $y$ can be solved for | It is for exactly the opposite case, when $y$ cannot be isolated, as in $x^3+y^3=9xy$. |`,
            T`**Kesalahan paling umum pada diferensiasi implisit adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ $\frac{d}{dx}y^2=2y$ | $y$ bergantung pada $x$, sehingga aturan rantai menambah faktor: $2y\,\frac{dy}{dx}$. |
| ❌ $\frac{d}{dx}(xy)=y$ | Itu hasil kali dua fungsi $x$: $y+x\,\frac{dy}{dx}$. |
| ❌ $\frac{d}{dx}\sin y=\cos y$ | Lagi-lagi ada faktor: $\cos y\cdot\frac{dy}{dx}$. |
| ❌ $\frac{dy}{dx}$ boleh memuat $x$ saja | Ia biasanya memuat $x$ dan $y$, dan dihitung di titik dengan kedua koordinat. |
| ❌ Masukkan titik apa saja ke rumus gradien | Titik itu harus memenuhi persamaan; kalau tidak, bilangan itu adalah gradien tak ada apa-apa. |
| ❌ Untuk $y'=-\frac{x}{y}$, $y''=-\frac1y$ | $y$ adalah fungsi $x$: $y''=-\frac{y-x\,y'}{y^2}$, yaitu $-\frac{25}{y^3}$ pada $x^2+y^2=25$. |
| ❌ Jika penyebut $y'$ bernilai $0$, tidak ada garis singgung | Garis singgungnya tegak di sana, seperti di $(5,0)$ pada lingkaran $x^2+y^2=25$. |
| ❌ Di titik asal folium, $\frac00$ berarti gradiennya $0$ | $\frac00$ tidak tertentu: dua cabang berpotongan, dengan garis singgung $y=0$ dan $x=0$. |
| ❌ Diferensiasi implisit hanya bekerja bila $y$ dapat diselesaikan | Ia untuk kasus yang tepat berlawanan, bila $y$ tidak dapat diisolasi, seperti pada $x^3+y^3=9xy$. |`,
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
              L('$\\frac{d}{dx}y^2=2y\\,\\frac{dy}{dx}$.', '$\\frac{d}{dx}y^2=2y\\,\\frac{dy}{dx}$.'),
              L('$\\frac{d}{dx}(xy)=y+x\\,\\frac{dy}{dx}$.', '$\\frac{d}{dx}(xy)=y+x\\,\\frac{dy}{dx}$.'),
              L('$\\frac{d}{dx}\\sin y=\\cos y$.', '$\\frac{d}{dx}\\sin y=\\cos y$.'),
              L('The formula for $\\frac{dy}{dx}$ can contain $y$ as well as $x$.', 'Rumus $\\frac{dy}{dx}$ dapat memuat $y$ selain $x$.'),
              L('If the denominator of $\\frac{dy}{dx}$ is $0$ at a point of the curve, the curve has no tangent line there.', 'Jika penyebut $\\frac{dy}{dx}$ bernilai $0$ di suatu titik kurva, kurva itu tidak memiliki garis singgung di sana.'),
              L('Implicit differentiation needs $y$ to be solved for first.', 'Diferensiasi implisit memerlukan $y$ diselesaikan lebih dulu.'),
            ],
            answer: [true, true, false, true, false, false],
            explain: L(
              'Every function of $y$ gets a factor $\\frac{dy}{dx}$, so $\\sin y$ gives $\\cos y\\cdot\\frac{dy}{dx}$. A zero denominator usually means a vertical tangent, and the method is for equations that cannot be solved for $y$.',
              'Setiap fungsi dari $y$ mendapat faktor $\\frac{dy}{dx}$, sehingga $\\sin y$ memberi $\\cos y\\cdot\\frac{dy}{dx}$. Penyebut nol biasanya berarti garis singgung tegak, dan cara ini untuk persamaan yang tidak dapat diselesaikan untuk $y$.',
            ),
            hint: L('Think of $y$ as a function of $x$, like $y(x)$.', 'Bayangkan $y$ sebagai fungsi $x$, seperti $y(x)$.'),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L('Choose **all** the correct derivatives with respect to $x$ ($y$ is a function of $x$).', 'Pilih **semua** turunan terhadap $x$ yang benar ($y$ adalah fungsi $x$).'),
            options: [
              L('$\\frac{d}{dx}\\left(xy^2\\right)=y^2+2xy\\,y\'$', '$\\frac{d}{dx}\\left(xy^2\\right)=y^2+2xy\\,y\'$'),
              L('$\\frac{d}{dx}e^y=e^y\\,y\'$', '$\\frac{d}{dx}e^y=e^y\\,y\'$'),
              L('$\\frac{d}{dx}y^3=3y^2\\,y\'$', '$\\frac{d}{dx}y^3=3y^2\\,y\'$'),
              L('$\\frac{d}{dx}\\frac{y}{x}=\\frac{x\\,y\'-y}{x^2}$', '$\\frac{d}{dx}\\frac{y}{x}=\\frac{x\\,y\'-y}{x^2}$'),
              L('$\\frac{d}{dx}\\left(x^2y\\right)=2x\\,y\'$', '$\\frac{d}{dx}\\left(x^2y\\right)=2x\\,y\'$'),
            ],
            answer: [0, 1, 2, 3],
            explain: L('The last one forgot the product rule: $\\frac{d}{dx}\\left(x^2y\\right)=2xy+x^2y\'$.', 'Yang terakhir melupakan aturan hasil kali: $\\frac{d}{dx}\\left(x^2y\\right)=2xy+x^2y\'$.'),
            hint: L('A product of two functions of $x$ needs the product rule.', 'Hasil kali dua fungsi $x$ memerlukan aturan hasil kali.'),
          },
        },
        {
          kind: 'activity',
          title: L('A parabola', 'Sebuah parabola'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L('$2y\\,y\'=4$, so $y\'=\\frac2y$.', '$2y\\,y\'=4$, sehingga $y\'=\\frac2y$.'), L('At $y=2$: $\\frac22$.', 'Di $y=2$: $\\frac22$.')],
            explain: L('$y\'=\\frac2y$, which is $\\frac22=1$ at $(1,2)$.', '$y\'=\\frac2y$, yaitu $\\frac22=1$ di $(1,2)$.'),
            prompt: L('Find the slope of $y^2=4x$ at the point $(1,2)$.', 'Tentukan gradien $y^2=4x$ di titik $(1,2)$.'),
            given: String.raw`y'=v`,
            blanks: [{ label: "y' =", answer: 1 }],
          },
        },
        {
          kind: 'activity',
          title: L('The circle', 'Lingkaran'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L('$y\'=-\\frac xy$.', '$y\'=-\\frac xy$.'), L('$-\\frac{3}{-4}$.', '$-\\frac{3}{-4}$.')],
            explain: L('$y\'=-\\frac{3}{-4}=\\frac34$.', '$y\'=-\\frac{3}{-4}=\\frac34$.'),
            prompt: L('Find the slope of $x^2+y^2=25$ at $(3,-4)$ (as a decimal).', 'Tentukan gradien $x^2+y^2=25$ di $(3,-4)$ (sebagai desimal).'),
            given: String.raw`y'=v`,
            blanks: [{ label: "y' =", answer: 0.75 }],
          },
        },
        {
          kind: 'activity',
          title: L('A cubic curve', 'Kurva kubik'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [L('$3x^2+3y^2y\'=2y+2xy\'$.', '$3x^2+3y^2y\'=2y+2xy\'$.'), L('At $(1,1)$: $3+3y\'=2+2y\'$.', 'Di $(1,1)$: $3+3y\'=2+2y\'$.')],
            explain: L('At $(1,1)$ the equation $3+3y\'=2+2y\'$ gives $y\'=-1$.', 'Di $(1,1)$ persamaan $3+3y\'=2+2y\'$ memberi $y\'=-1$.'),
            prompt: L('Find the slope of $x^3+y^3=2xy$ at $(1,1)$.', 'Tentukan gradien $x^3+y^3=2xy$ di $(1,1)$.'),
            given: String.raw`y'=v`,
            blanks: [{ label: "y' =", answer: -1 }],
          },
        },
        {
          kind: 'activity',
          title: L('A sine in the equation', 'Sinus dalam persamaan'),
          step: {
            kind: 'quiz',
            id: 'p6',
            prompt: L('What is $\\frac{dy}{dx}$ for $\\sin(xy)=x+y$?', 'Berapa $\\frac{dy}{dx}$ untuk $\\sin(xy)=x+y$?'),
            options: [L('$\\frac{1-y\\cos(xy)}{x\\cos(xy)-1}$', '$\\frac{1-y\\cos(xy)}{x\\cos(xy)-1}$'), L('$\\frac{1-\\cos(xy)}{\\cos(xy)-1}$', '$\\frac{1-\\cos(xy)}{\\cos(xy)-1}$'), L('$1-\\cos(xy)$', '$1-\\cos(xy)$'), L('$\\frac{y\\cos(xy)}{x\\cos(xy)}$', '$\\frac{y\\cos(xy)}{x\\cos(xy)}$')],
            answer: 0,
            explain: L('Differentiating gives $\\cos(xy)\\,(y+x\\,y\')=1+y\'$. Collect the $y\'$ terms: $y\'\\left(x\\cos(xy)-1\\right)=1-y\\cos(xy)$.', 'Menurunkan memberi $\\cos(xy)\\,(y+x\\,y\')=1+y\'$. Kumpulkan suku $y\'$: $y\'\\left(x\\cos(xy)-1\\right)=1-y\\cos(xy)$.'),
            hint: L('Use the product rule inside the cosine: $\\frac{d}{dx}(xy)=y+x\\,y\'$.', 'Pakai aturan hasil kali di dalam kosinus: $\\frac{d}{dx}(xy)=y+x\\,y\'$.'),
          },
        },
        {
          kind: 'activity',
          title: L('A second derivative', 'Turunan kedua'),
          step: {
            kind: 'math',
            id: 'p7',
            hints: [L('$y\'\'=-\\frac{25}{y^3}$ on $x^2+y^2=25$.', '$y\'\'=-\\frac{25}{y^3}$ pada $x^2+y^2=25$.'), L('At $(0,5)$: $-\\frac{25}{125}$.', 'Di $(0,5)$: $-\\frac{25}{125}$.')],
            explain: L('$y\'\'=-\\frac{25}{125}=-0.2$ at $(0,5)$: the top of the circle bends downward.', '$y\'\'=-\\frac{25}{125}=-0{,}2$ di $(0,5)$: puncak lingkaran melengkung ke bawah.'),
            prompt: L('Find $y\'\'$ on the circle $x^2+y^2=25$ at $(0,5)$.', 'Tentukan $y\'\'$ pada lingkaran $x^2+y^2=25$ di $(0,5)$.'),
            given: String.raw`y''=v`,
            blanks: [{ label: "y'' =", answer: -0.2 }],
          },
        },
        {
          kind: 'activity',
          title: L('Where the tangent is vertical', 'Tempat garis singgung tegak'),
          step: {
            kind: 'quiz',
            id: 'p8',
            prompt: L('The slope of a curve is $\\frac{dy}{dx}=\\frac{A}{B}$ with $A\\ne0$. Where is its tangent line vertical?', 'Gradien suatu kurva adalah $\\frac{dy}{dx}=\\frac{A}{B}$ dengan $A\\ne0$. Di mana garis singgungnya tegak?'),
            options: [L('where $B=0$', 'di tempat $B=0$'), L('where $A=0$', 'di tempat $A=0$'), L('where $A=B$', 'di tempat $A=B$'), L('nowhere', 'tidak di mana pun')],
            answer: 0,
            explain: L('When $B\\to0$ with $A\\ne0$ the slope grows without bound, which is a vertical tangent line.', 'Saat $B\\to0$ dengan $A\\ne0$ gradien membesar tanpa batas, yaitu garis singgung tegak.'),
            hint: L('What happens to $\\frac AB$ as $B$ gets close to $0$?', 'Apa yang terjadi pada $\\frac AB$ saat $B$ mendekati $0$?'),
          },
        },
        {
          kind: 'activity',
          title: L('Parallel tangents', 'Garis singgung sejajar'),
          step: {
            kind: 'math',
            id: 'p9',
            hints: [L('$y\'=-\\frac{2x+y}{x+2y}$.', '$y\'=-\\frac{2x+y}{x+2y}$.'), L('At $y=0$ this is $-\\frac{2x}{x}$.', 'Di $y=0$ ini $-\\frac{2x}{x}$.')],
            explain: L('At $\\left(\\sqrt7,0\\right)$: $y\'=-\\frac{2\\sqrt7}{\\sqrt7}=-2$, and the same at $\\left(-\\sqrt7,0\\right)$.', 'Di $\\left(\\sqrt7,0\\right)$: $y\'=-\\frac{2\\sqrt7}{\\sqrt7}=-2$, dan sama di $\\left(-\\sqrt7,0\\right)$.'),
            prompt: L('The curve $x^2+xy+y^2=7$ crosses the $x$-axis at two points. What is the common slope of its tangent lines there?', 'Kurva $x^2+xy+y^2=7$ memotong sumbu-$x$ di dua titik. Berapa gradien bersama garis singgungnya di sana?'),
            given: String.raw`y'=v`,
            blanks: [{ label: "y' =", answer: -2 }],
          },
        },
        {
          kind: 'activity',
          title: L('A fractional power', 'Pangkat pecahan'),
          step: {
            kind: 'quiz',
            id: 'p10',
            prompt: L('Using $y^4=x^3$, what is $\\frac{d}{dx}x^{3/4}$?', 'Dengan $y^4=x^3$, berapa $\\frac{d}{dx}x^{3/4}$?'),
            options: [L('$\\frac34x^{-1/4}$', '$\\frac34x^{-1/4}$'), L('$\\frac43x^{1/4}$', '$\\frac43x^{1/4}$'), L('$\\frac34x^{3/4}$', '$\\frac34x^{3/4}$'), L('$3x^{-1/4}$', '$3x^{-1/4}$')],
            answer: 0,
            explain: L('$4y^3y\'=3x^2$ gives $y\'=\\frac{3x^2}{4y^3}=\\frac34x^{2-9/4}=\\frac34x^{-1/4}$.', '$4y^3y\'=3x^2$ memberi $y\'=\\frac{3x^2}{4y^3}=\\frac34x^{2-9/4}=\\frac34x^{-1/4}$.'),
            hint: L('The power rule $\\frac pq\\,x^{p/q-1}$ should come out.', 'Aturan pangkat $\\frac pq\\,x^{p/q-1}$ harus keluar.'),
          },
        },
        {
          kind: 'activity',
          title: L('A cusp', 'Sebuah lancip'),
          step: {
            kind: 'math',
            id: 'p11',
            hints: [L('$2y\\,y\'=3x^2$.', '$2y\\,y\'=3x^2$.'), L('At $(4,8)$: $\\frac{3\\cdot16}{2\\cdot8}$. First check that $(4,8)$ is on the curve: $64=64$.', 'Di $(4,8)$: $\\frac{3\\cdot16}{2\\cdot8}$. Periksa dulu bahwa $(4,8)$ berada pada kurva: $64=64$.')],
            explain: L('$y\'=\\frac{3x^2}{2y}=\\frac{48}{16}=3$.', '$y\'=\\frac{3x^2}{2y}=\\frac{48}{16}=3$.'),
            prompt: L('Find the slope of $y^2=x^3$ at $(4,8)$.', 'Tentukan gradien $y^2=x^3$ di $(4,8)$.'),
            given: String.raw`y'=v`,
            blanks: [{ label: "y' =", answer: 3 }],
          },
        },
        {
          kind: 'activity',
          title: L('The origin of the folium', 'Titik asal folium'),
          step: {
            kind: 'quiz',
            id: 'p12',
            prompt: L('At the origin of $x^3+y^3=9xy$ the slope formula $\\frac{3y-x^2}{y^2-3x}$ gives $\\frac00$. What does that mean?', 'Di titik asal $x^3+y^3=9xy$ rumus gradien $\\frac{3y-x^2}{y^2-3x}$ memberi $\\frac00$. Apa artinya?'),
            options: [L('two branches cross there, with tangent lines $y=0$ and $x=0$', 'dua cabang berpotongan di sana, dengan garis singgung $y=0$ dan $x=0$'), L('the slope is $0$', 'gradiennya $0$'), L('the slope is $1$', 'gradiennya $1$'), L('the origin is not on the curve', 'titik asal tidak berada pada kurva')],
            answer: 0,
            explain: L('$\\frac00$ is undetermined. Near the origin $9xy$ dominates, so the curve looks like $xy=0$, the two axes.', '$\\frac00$ tidak tertentu. Di dekat titik asal $9xy$ mendominasi, sehingga kurva tampak seperti $xy=0$, kedua sumbu.'),
            hint: L('The origin satisfies the equation: $0=0$.', 'Titik asal memenuhi persamaan: $0=0$.'),
          },
        },
      ],
    },

    /* ----------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: implicit differentiation at a glance', 'Ringkasan: diferensiasi implisit sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Method:** differentiate both sides with respect to $x$, treating $y$ as a function of $x$ ($\frac{d}{dx}f(y)=f'(y)\,\frac{dy}{dx}$, $\frac{d}{dx}(xy)=y+x\frac{dy}{dx}$), collect the $\frac{dy}{dx}$ terms, solve.
- **Circle:** $x^2+y^2=25$ gives $\frac{dy}{dx}=-\frac xy$, slope $\frac34$ at $(3,-4)$, and $\frac{d^2y}{dx^2}=-\frac{25}{y^3}$.
- **Lines:** tangent $y-y_0=m(x-x_0)$, normal slope $-\frac1m$; horizontal tangent where the numerator is $0$, vertical where the denominator is $0$.
- **Folium:** $\frac{dy}{dx}=\frac{3y-x^2}{y^2-3x}$, slope $\frac45$ at $(2,4)$, horizontal tangent at $x=\sqrt[3]{54}$.
- **Second derivative:** differentiate again and put $y'$ back in; simplify with the original equation.
- **Rational powers:** $y^q=x^p$ gives $\frac{d}{dx}x^{p/q}=\frac pq\,x^{p/q-1}$.
- **Care:** the point must be on the curve; $\frac00$ marks a crossing; a formula can exist where no curve does.
- **Code:** ´sp.idiff(F, y, x)´; check with Newton's method and a difference quotient.`,
            T`- **Cara:** turunkan kedua ruas terhadap $x$, dengan memperlakukan $y$ sebagai fungsi $x$ ($\frac{d}{dx}f(y)=f'(y)\,\frac{dy}{dx}$, $\frac{d}{dx}(xy)=y+x\frac{dy}{dx}$), kumpulkan suku $\frac{dy}{dx}$, selesaikan.
- **Lingkaran:** $x^2+y^2=25$ memberi $\frac{dy}{dx}=-\frac xy$, gradien $\frac34$ di $(3,-4)$, dan $\frac{d^2y}{dx^2}=-\frac{25}{y^3}$.
- **Garis:** singgung $y-y_0=m(x-x_0)$, gradien normal $-\frac1m$; singgung mendatar di tempat pembilang $0$, tegak di tempat penyebut $0$.
- **Folium:** $\frac{dy}{dx}=\frac{3y-x^2}{y^2-3x}$, gradien $\frac45$ di $(2,4)$, singgung mendatar di $x=\sqrt[3]{54}$.
- **Turunan kedua:** turunkan lagi dan masukkan $y'$ kembali; sederhanakan dengan persamaan semula.
- **Pangkat rasional:** $y^q=x^p$ memberi $\frac{d}{dx}x^{p/q}=\frac pq\,x^{p/q-1}$.
- **Hati-hati:** titik harus berada pada kurva; $\frac00$ menandai persilangan; rumus dapat ada di tempat kurva tidak ada.
- **Kode:** ´sp.idiff(F, y, x)´; periksa dengan metode Newton dan hasil bagi selisih.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Implicit function', 'Fungsi implisit'), definition: L('A function defined by an equation in x and y that is not solved for y, so that y is whatever value makes the equation true.', 'Fungsi yang didefinisikan oleh persamaan dalam x dan y yang tidak diselesaikan untuk y, sehingga y adalah nilai apa pun yang membuat persamaan itu benar.') },
    { term: L('Explicit function', 'Fungsi eksplisit'), definition: L('A function written with y alone on one side, y equals f of x, which gives y directly from x.', 'Fungsi yang ditulis dengan y sendirian di satu ruas, y sama dengan f dari x, yang memberi y langsung dari x.') },
    { term: L('Implicit differentiation', 'Diferensiasi implisit'), definition: L('Finding dy over dx by differentiating both sides of an equation with respect to x, treating y as a function of x, and then solving for dy over dx.', 'Mencari dy per dx dengan menurunkan kedua ruas persamaan terhadap x, memperlakukan y sebagai fungsi x, lalu menyelesaikan untuk dy per dx.') },
    { term: L('Normal line', 'Garis normal'), definition: L('The line through a point of a curve that is perpendicular to the tangent line there; its slope is minus the reciprocal of the tangent slope.', 'Garis melalui suatu titik kurva yang tegak lurus pada garis singgung di sana; gradiennya adalah minus kebalikan gradien garis singgung.') },
    { term: L('Folium of Descartes', 'Folium Descartes'), definition: L('The curve x cubed plus y cubed equals 9xy, a loop with two branches that cross at the origin, first proposed by Descartes in 1638.', 'Kurva x pangkat tiga ditambah y pangkat tiga sama dengan 9xy, sebuah simpul dengan dua cabang yang berpotongan di titik asal, pertama diajukan Descartes pada 1638.') },
    { term: L('Vertical tangent', 'Garis singgung tegak'), definition: L('A tangent line parallel to the y-axis, at a point where dy over dx grows without bound because its denominator is zero.', 'Garis singgung yang sejajar sumbu-y, di titik tempat dy per dx membesar tanpa batas karena penyebutnya nol.') },
  ],

  howTo: [
    {
      name: L('How to differentiate an equation implicitly', 'Cara menurunkan persamaan secara implisit'),
      description: L('Differentiate both sides, collect the terms with dy over dx, and solve.', 'Turunkan kedua ruas, kumpulkan suku dengan dy per dx, dan selesaikan.'),
      steps: [
        { name: L('Differentiate both sides with respect to x', 'Turunkan kedua ruas terhadap x'), text: L('Use the usual rules, and treat y as a function of x: every function of y gets a factor dy over dx, and xy needs the product rule.', 'Pakai aturan biasa, dan perlakukan y sebagai fungsi x: setiap fungsi dari y mendapat faktor dy per dx, dan xy memerlukan aturan hasil kali.') },
        { name: L('Collect the terms with dy over dx', 'Kumpulkan suku dengan dy per dx'), text: L('Move every term that has dy over dx to one side and every other term to the other side.', 'Pindahkan setiap suku yang memuat dy per dx ke satu ruas dan setiap suku lainnya ke ruas yang lain.') },
        { name: L('Factor and solve', 'Faktorkan dan selesaikan'), text: L('Factor out dy over dx and divide by what multiplies it; the answer usually contains both x and y.', 'Faktorkan dy per dx dan bagi dengan pengalinya; jawabannya biasanya memuat x dan y.') },
      ],
    },
    {
      name: L('How to find the tangent and normal lines at a point of an implicit curve', 'Cara mencari garis singgung dan normal di titik pada kurva implisit'),
      description: L('Check the point, find the slope with both coordinates, and write the two lines.', 'Periksa titiknya, cari gradien dengan kedua koordinat, dan tulis kedua garis.'),
      steps: [
        { name: L('Check that the point is on the curve', 'Periksa bahwa titik berada pada kurva'), text: L('Put the coordinates into the equation and confirm that both sides are equal.', 'Masukkan koordinat ke persamaan dan pastikan kedua ruas sama.') },
        { name: L('Find the slope m', 'Cari gradien m'), text: L('Use implicit differentiation for dy over dx and put in both coordinates of the point.', 'Pakai diferensiasi implisit untuk dy per dx dan masukkan kedua koordinat titik itu.') },
        { name: L('Write the tangent line', 'Tulis garis singgung'), text: L('The tangent line is y minus y0 equals m times x minus x0; if the denominator is zero it is the vertical line x equals x0.', 'Garis singgungnya y dikurangi y0 sama dengan m kali x dikurangi x0; jika penyebutnya nol, ia garis tegak x sama dengan x0.') },
        { name: L('Write the normal line', 'Tulis garis normal'), text: L('Use the slope minus one over m through the same point; it is horizontal if the tangent is vertical and vertical if the tangent is horizontal.', 'Pakai gradien minus satu per m melalui titik yang sama; ia mendatar jika garis singgung tegak dan tegak jika garis singgung mendatar.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is implicit differentiation?', 'Apa itu diferensiasi implisit?'),
      a: L(
        'Implicit differentiation is a way to find dy over dx from an equation in x and y without solving the equation for y. You differentiate both sides with respect to x, treating y as a function of x, then collect the terms with dy over dx and solve for it.',
        'Diferensiasi implisit adalah cara mencari dy per dx dari persamaan dalam x dan y tanpa menyelesaikan persamaan itu untuk y. Kamu menurunkan kedua ruas terhadap x, dengan memperlakukan y sebagai fungsi x, lalu mengumpulkan suku dengan dy per dx dan menyelesaikannya.',
      ),
    },
    {
      q: L('When do you use implicit differentiation?', 'Kapan memakai diferensiasi implisit?'),
      a: L(
        'Use it when an equation defines y in terms of x but y cannot be isolated, or when isolating it would give several branches and messy formulas, as for the folium of Descartes. It also gives a slope for the whole circle with one formula.',
        'Pakai ia bila persamaan mendefinisikan y dalam x tetapi y tidak dapat diisolasi, atau bila mengisolasinya memberi beberapa cabang dan rumus yang berantakan, seperti pada folium Descartes. Ia juga memberi gradien seluruh lingkaran dengan satu rumus.',
      ),
    },
    {
      q: L('Why does y squared differentiate to 2y times dy over dx?', 'Mengapa y kuadrat diturunkan menjadi 2y kali dy per dx?'),
      a: L(
        'Because y depends on x, so y squared is a composite function: a square outside and y inside. The chain rule gives the derivative of the outside, two y, times the derivative of the inside, which is dy over dx. A function of x alone gets no extra factor.',
        'Karena y bergantung pada x, sehingga y kuadrat adalah fungsi komposit: kuadrat di luar dan y di dalam. Aturan rantai memberi turunan fungsi luar, dua y, kali turunan fungsi dalam, yaitu dy per dx. Fungsi dari x saja tidak mendapat faktor tambahan.',
      ),
    },
    {
      q: L('What is the derivative of a circle?', 'Berapa turunan sebuah lingkaran?'),
      a: L(
        'For the circle x squared plus y squared equals r squared, implicit differentiation gives dy over dx equal to minus x over y, at every point where y is not zero. At the top and bottom points the slope is zero, and at the left and right points the tangent is vertical.',
        'Untuk lingkaran x kuadrat ditambah y kuadrat sama dengan r kuadrat, diferensiasi implisit memberi dy per dx sama dengan minus x per y, di setiap titik tempat y bukan nol. Di titik atas dan bawah gradiennya nol, dan di titik kiri dan kanan garis singgungnya tegak.',
      ),
    },
    {
      q: L('How do you find the tangent line to an implicit curve?', 'Bagaimana mencari garis singgung pada kurva implisit?'),
      a: L(
        'Check that the point is on the curve, find dy over dx by implicit differentiation, and put in both coordinates to get the slope m. The tangent line is y minus y0 equals m times x minus x0. The normal line uses the slope minus one over m.',
        'Periksa bahwa titik berada pada kurva, cari dy per dx dengan diferensiasi implisit, dan masukkan kedua koordinat untuk mendapat gradien m. Garis singgungnya y dikurangi y0 sama dengan m kali x dikurangi x0. Garis normal memakai gradien minus satu per m.',
      ),
    },
    {
      q: L('How do you find the second derivative implicitly?', 'Bagaimana mencari turunan kedua secara implisit?'),
      a: L(
        'Differentiate the formula for dy over dx again, treating y as a function of x, then replace every dy over dx by its formula. The result has only x and y, and the original equation often shortens it, as with minus 25 over y cubed for the circle.',
        'Turunkan rumus dy per dx sekali lagi, dengan memperlakukan y sebagai fungsi x, lalu ganti setiap dy per dx dengan rumusnya. Hasilnya hanya memuat x dan y, dan persamaan semula sering memperpendeknya, seperti minus 25 per y pangkat tiga untuk lingkaran.',
      ),
    },
    {
      q: L('What does it mean when the denominator of dy over dx is zero?', 'Apa artinya bila penyebut dy per dx bernilai nol?'),
      a: L(
        'Usually the tangent line is vertical there, since the slope grows without bound, as at the left and right points of a circle. If the numerator is zero too, you get zero over zero, which can mean that two branches of the curve cross at that point.',
        'Biasanya garis singgungnya tegak di sana, karena gradiennya membesar tanpa batas, seperti di titik kiri dan kanan lingkaran. Jika pembilangnya juga nol, kamu mendapat nol per nol, yang dapat berarti dua cabang kurva berpotongan di titik itu.',
      ),
    },
    {
      q: L('How does implicit differentiation prove the power rule for fractions?', 'Bagaimana diferensiasi implisit membuktikan aturan pangkat untuk pecahan?'),
      a: L(
        'Write y equals x to the p over q as y to the q equals x to the p, and differentiate both sides. That gives q times y to the q minus one times dy over dx equal to p times x to the p minus one, which solves to p over q times x to the p over q minus one.',
        'Tulis y sama dengan x pangkat p per q sebagai y pangkat q sama dengan x pangkat p, dan turunkan kedua ruas. Itu memberi q kali y pangkat q dikurangi satu kali dy per dx sama dengan p kali x pangkat p dikurangi satu, yang diselesaikan menjadi p per q kali x pangkat p per q dikurangi satu.',
      ),
    },
    {
      q: L('Is implicit differentiation valid for any equation?', 'Apakah diferensiasi implisit sah untuk persamaan apa saja?'),
      a: L(
        'No. It assumes that y is a differentiable function of x near the point, which holds where the denominator of dy over dx is not zero and the equation is smooth. It gives formulas even for equations with no points, such as x squared plus y squared equals minus one.',
        'Tidak. Ia mengasumsikan y adalah fungsi x yang terdiferensialkan di dekat titik itu, yang berlaku di tempat penyebut dy per dx bukan nol dan persamaannya mulus. Ia memberi rumus bahkan untuk persamaan tanpa titik, seperti x kuadrat ditambah y kuadrat sama dengan minus satu.',
      ),
    },
  ],

  references: [
    { title: "Thomas' Calculus: Early Transcendentals in SI Units (15th ed.), Section 3.7: Implicit Differentiation", author: 'Joel Hass, Christopher Heil, Maurice D. Weir et al.', year: 2023, source: 'Pearson' },
    { title: 'Calculus (8th ed.), section 3.5: Implicit Differentiation', author: 'James Stewart', year: 2015, source: 'Cengage Learning' },
    { title: 'The Implicit Function Theorem: History, Theory, and Applications', author: 'Steven G. Krantz, Harold R. Parks', year: 2002, source: 'Birkhäuser' },
    { title: 'The Method of Fluxions and Infinite Series (translated by John Colson)', author: 'Isaac Newton', year: 1736, source: 'Henry Woodfall, London' },
  ],

  related: ['the-chain-rule', 'differentiation-rules', 'derivatives-of-inverse-functions-and-logarithms', 'related-rates'],
}
