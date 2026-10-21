import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './linearization-and-differentials.meta'

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
    T`**The linearization of a differentiable function $f$ at $a$ is the tangent-line function $L(x)=f(a)+f'(a)(x-a)$, and $f(x)\approx L(x)$ for $x$ near $a$; the differential $dy=f'(x)\,dx$ is the amount that this line rises when $x$ changes by $dx$.** So $f(a+dx)\approx f(a)+dy$ estimates a value from a point where $f$ and $f'$ are easy, and the error is small even compared with $dx$.`,
    T`**Linearisasi fungsi terdiferensialkan $f$ di $a$ adalah fungsi garis singgung $L(x)=f(a)+f'(a)(x-a)$, dan $f(x)\approx L(x)$ untuk $x$ di dekat $a$; diferensial $dy=f'(x)\,dx$ adalah besar kenaikan garis itu ketika $x$ berubah sebesar $dx$.** Jadi $f(a+dx)\approx f(a)+dy$ memperkirakan sebuah nilai dari titik tempat $f$ dan $f'$ mudah dihitung, dan galatnya kecil bahkan dibandingkan dengan $dx$.`,
  ),

  keyPoints: [
    L(
      T`Near a point where $f$ is differentiable the graph looks like its tangent line, whose equation is the linearization $L(x)=f(a)+f'(a)(x-a)$; $a$ is the center of the approximation.`,
      T`Di dekat titik tempat $f$ terdiferensialkan, grafik tampak seperti garis singgungnya, yang persamaannya adalah linearisasi $L(x)=f(a)+f'(a)(x-a)$; $a$ adalah pusat hampiran.`,
    ),
    L(
      T`A linearization loses accuracy away from its center: $\sqrt{1+x}\approx1+\frac x2$ is good at $x=0.05$ but gives $2$ for $\sqrt3$, so choose a center near the place you need.`,
      T`Linearisasi kehilangan ketelitian jauh dari pusatnya: $\sqrt{1+x}\approx1+\frac x2$ baik di $x=0{,}05$ tetapi memberi $2$ untuk $\sqrt3$, jadi pilih pusat di dekat tempat yang diperlukan.`,
    ),
    L(
      T`Common linearizations at $0$: $\sin x\approx x$, $\cos x\approx1$, $\tan x\approx x$, $e^x\approx1+x$, $\ln(1+x)\approx x$ and $(1+x)^k\approx1+kx$.`,
      T`Linearisasi umum di $0$: $\sin x\approx x$, $\cos x\approx1$, $\tan x\approx x$, $e^x\approx1+x$, $\ln(1+x)\approx x$, dan $(1+x)^k\approx1+kx$.`,
    ),
    L(
      T`The differential $dx$ is an independent variable and $dy=f'(x)\,dx$ depends on $x$ and $dx$; $dy$ is the change in the linearization, while $\Delta y=f(a+dx)-f(a)$ is the true change.`,
      T`Diferensial $dx$ adalah peubah bebas dan $dy=f'(x)\,dx$ bergantung pada $x$ dan $dx$; $dy$ adalah perubahan pada linearisasi, sedangkan $\Delta y=f(a+dx)-f(a)$ adalah perubahan sebenarnya.`,
    ),
    L(
      T`The true change is $\Delta y=f'(a)\,dx+\varepsilon\,dx$ with $\varepsilon\to0$ as $dx\to0$, so the error $\varepsilon\,dx$ is a product of two small numbers; for smooth $f$ it is about $\frac12f''(a)\,dx^2$.`,
      T`Perubahan sebenarnya adalah $\Delta y=f'(a)\,dx+\varepsilon\,dx$ dengan $\varepsilon\to0$ saat $dx\to0$, sehingga galat $\varepsilon\,dx$ adalah hasil kali dua bilangan kecil; untuk $f$ mulus ia sekitar $\frac12f''(a)\,dx^2$.`,
    ),
    L(
      T`For $y=cx^n$ the relative error is $\frac{dy}{y}=n\,\frac{dx}{x}$: a $2\%$ error in a radius is a $2\%$ error in the circumference and about $4\%$ in the area.`,
      T`Untuk $y=cx^n$ galat relatifnya $\frac{dy}{y}=n\,\frac{dx}{x}$: galat $2\%$ pada jari-jari menjadi galat $2\%$ pada keliling dan sekitar $4\%$ pada luas.`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------------------- linearization */
    {
      id: 'linearization',
      heading: L('What is the linearization of a function?', 'Apa itu linearisasi suatu fungsi?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The linearization of $f$ at $a$ is the linear function $L(x)=f(a)+f'(a)(x-a)$, whose graph is the tangent line to $y=f(x)$ at $(a,f(a))$.** The reason it is useful is that a differentiable curve behaves locally like its tangent line: magnify the graph around the point and it flattens, until the curve and the line cannot be told apart. For $y=x^2$ at $(1,1)$ the tangent line is $y=2x-1$, and in a window about $0.006$ wide the two graphs look the same.

The tangent line at $x=a$ passes through $(a,f(a))$ with slope $f'(a)$, so its point-slope equation, from the [tangent line equation](article:tangent-lines-and-derivative-at-a-point#tangent-line-equation), is $y=f(a)+f'(a)(x-a)$. As long as that line stays close to the graph when we move off the point of tangency, $L(x)$ is a good approximation of $f(x)$.

**Definitions.** If $f$ is differentiable at $x=a$, then the approximating function
$$L(x)=f(a)+f'(a)(x-a)$$
is the *linearization* of $f$ at $a$. The approximation $f(x)\approx L(x)$ is the *standard linear approximation* of $f$ at $a$, and the point $x=a$ is the *center* of the approximation.

**Why it works.** The definition of the derivative says that the quotient $\frac{f(x)-f(a)}{x-a}$ is close to $f'(a)$ when $x$ is close to $a$, that is, $f(x)-f(a)\approx f'(a)(x-a)$. Both $f(x)-f(a)$ and $f'(a)(x-a)$ shrink to $0$ as $x\to a$, but the first agrees with the second to better than a multiple of $x-a$, and this is what "close" means here. A function with a corner or a vertical tangent at $a$ has no derivative there, so it has no linearization at $a$.

**What it is for.** Nobody would use a linearization to find one particular square root, because a calculator is better. Its use is to replace a complicated formula by a simple one over a whole interval of values, when the small error is tolerable, and to understand how an output reacts to a small change of the input. Zoom in below and read the table: each tenfold magnification makes the gap between the curve and the line about a hundred times smaller.`,
            T`**Linearisasi $f$ di $a$ adalah fungsi linear $L(x)=f(a)+f'(a)(x-a)$, yang grafiknya adalah garis singgung $y=f(x)$ di $(a,f(a))$.** Alasan ia berguna adalah bahwa kurva terdiferensialkan berperilaku secara lokal seperti garis singgungnya: perbesar grafik di sekitar titik itu dan ia mendatar, sampai kurva dan garis tidak dapat dibedakan. Untuk $y=x^2$ di $(1,1)$ garis singgungnya $y=2x-1$, dan pada jendela selebar sekitar $0{,}006$ kedua grafik tampak sama.

Garis singgung di $x=a$ melalui $(a,f(a))$ dengan gradien $f'(a)$, sehingga persamaan titik-gradiennya, dari [persamaan garis singgung](article:tangent-lines-and-derivative-at-a-point#tangent-line-equation), adalah $y=f(a)+f'(a)(x-a)$. Selama garis itu tetap dekat dengan grafik ketika kita menjauh dari titik singgung, $L(x)$ adalah hampiran yang baik untuk $f(x)$.

**Definisi.** Jika $f$ terdiferensialkan di $x=a$, maka fungsi hampiran
$$L(x)=f(a)+f'(a)(x-a)$$
adalah *linearisasi* $f$ di $a$. Hampiran $f(x)\approx L(x)$ adalah *hampiran linear baku* $f$ di $a$, dan titik $x=a$ adalah *pusat* hampiran.

**Mengapa berhasil.** Definisi turunan mengatakan bahwa hasil bagi $\frac{f(x)-f(a)}{x-a}$ dekat dengan $f'(a)$ ketika $x$ dekat dengan $a$, yaitu $f(x)-f(a)\approx f'(a)(x-a)$. Baik $f(x)-f(a)$ maupun $f'(a)(x-a)$ menyusut ke $0$ saat $x\to a$, tetapi yang pertama sesuai dengan yang kedua dengan ketelitian lebih baik daripada suatu kelipatan $x-a$, dan inilah arti "dekat" di sini. Fungsi dengan sudut atau garis singgung tegak di $a$ tidak memiliki turunan di sana, sehingga tidak memiliki linearisasi di $a$.

**Untuk apa.** Tidak ada yang memakai linearisasi untuk mencari satu akar kuadrat tertentu, karena kalkulator lebih baik. Gunanya adalah mengganti rumus rumit dengan yang sederhana pada seluruh selang nilai, ketika galat kecilnya dapat diterima, dan memahami bagaimana keluaran bereaksi terhadap perubahan kecil pada masukan. Perbesar di bawah dan baca tabelnya: setiap pembesaran sepuluh kali membuat selisih antara kurva dan garis sekitar seratus kali lebih kecil.`,
          ),
        },
        { kind: 'widget', name: 'zoomin' },
      ],
    },

    /* ------------------------------------------------------------------------ examples */
    {
      id: 'examples-of-linearization',
      heading: L('How do you find a linearization, and how accurate is it?', 'Bagaimana mencari linearisasi, dan seberapa teliti ia?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To find a linearization, compute $f(a)$ and $f'(a)$ at the center and put them into $L(x)=f(a)+f'(a)(x-a)$; it is accurate for $x$ near $a$ and less and less accurate as $x$ moves away.**

**Example 1.** Find the linearization of $f(x)=\sqrt{1+x}$ at $a=0$. Since $f'(x)=\frac{1}{2\sqrt{1+x}}$, we have $f(0)=1$ and $f'(0)=\frac12$, so
$$L(x)=1+\frac12(x-0)=1+\frac x2.$$
How good is $\sqrt{1+x}\approx1+\frac x2$? Near $0$ it is very good, and it worsens as $x$ moves away:

| $x$ | Approximation $1+\frac x2$ | True value | Error |
|---|---|---|---|
| $0.005$ | $1.0025$ | $1.002497$ | less than $10^{-5}$ |
| $0.05$ | $1.025$ | $1.024695$ | less than $10^{-3}$ |
| $0.2$ | $1.10$ | $1.095445$ | less than $10^{-2}$ |

For $x=2$ it gives $2$ as the approximation of $\sqrt3$, which is not even accurate to one decimal place.

**Example 2: choose a better center.** A linearization normally loses accuracy away from its center, so near $x=3$ we need the linearization at $a=3$. With $f(3)=2$ and $f'(3)=\frac{1}{2\sqrt{4}}=\frac14$,
$$L(x)=2+\frac14(x-3)=\frac54+\frac x4.$$
At $x=3.2$ this gives $\sqrt{4.2}\approx\frac54+\frac{3.2}{4}=2.050$, which differs from the true $2.04939$ by less than one thousandth. The linearization at $0$ gives $1+\frac{3.2}{2}=2.6$ there, off by more than $25\%$. So pick a center $a$ where $f(a)$ and $f'(a)$ are easy to find and which is close to the place you need.

**Example 3.** For $f(x)=\cos x$ at $a=\frac\pi2$ we have $f\left(\frac\pi2\right)=0$ and $f'\left(\frac\pi2\right)=-\sin\frac\pi2=-1$, so
$$L(x)=0-1\cdot\left(x-\frac\pi2\right)=-x+\frac\pi2.$$

**The common linearizations at $x=0$.** Working them out as in Example 1 gives:

| Function | Linearization at $0$ |
|---|---|
| $\sin x$ | $x$ |
| $\cos x$ | $1$ |
| $\tan x$ | $x$ |
| $e^x$ | $1+x$ |
| $\ln(1+x)$ | $x$ |
| $(1+x)^k$ | $1+kx$, for any number $k$ |

The last row is the most useful: it is the linearization of $f(x)=(1+x)^k$, where $f(0)=1$ and $f'(0)=k$. It is good for $x$ close to $0$ and gives, with $x$ replaced by something small,
$$\sqrt{1+x}\approx1+\frac x2$$
$$\frac{1}{1-x}\approx1+x$$
$$\frac{1}{\sqrt{1-x^2}}\approx1+\frac{x^2}{2}$$
and, with $k$ a power, $\sqrt[3]{1+5x^4}\approx1+\frac{5x^4}{3}$. It also estimates powers of numbers close to $1$: $1.0002^{50}\approx1+50\cdot0.0002=1.01$ (the true value is $1.010049$) and $\sqrt[3]{1.009}\approx1+\frac{0.009}{3}=1.003$. Try your own function, center and $x$ below.`,
            T`**Untuk mencari linearisasi, hitung $f(a)$ dan $f'(a)$ di pusat dan masukkan ke $L(x)=f(a)+f'(a)(x-a)$; ia teliti untuk $x$ dekat $a$ dan makin kurang teliti saat $x$ menjauh.**

**Contoh 1.** Tentukan linearisasi $f(x)=\sqrt{1+x}$ di $a=0$. Karena $f'(x)=\frac{1}{2\sqrt{1+x}}$, kita punya $f(0)=1$ dan $f'(0)=\frac12$, sehingga
$$L(x)=1+\frac12(x-0)=1+\frac x2.$$
Seberapa baik $\sqrt{1+x}\approx1+\frac x2$? Di dekat $0$ ia sangat baik, dan memburuk saat $x$ menjauh:

| $x$ | Hampiran $1+\frac x2$ | Nilai sebenarnya | Galat |
|---|---|---|---|
| $0{,}005$ | $1{,}0025$ | $1{,}002497$ | kurang dari $10^{-5}$ |
| $0{,}05$ | $1{,}025$ | $1{,}024695$ | kurang dari $10^{-3}$ |
| $0{,}2$ | $1{,}10$ | $1{,}095445$ | kurang dari $10^{-2}$ |

Untuk $x=2$ ia memberi $2$ sebagai hampiran $\sqrt3$, yang bahkan tidak teliti sampai satu angka di belakang koma.

**Contoh 2: pilih pusat yang lebih baik.** Linearisasi biasanya kehilangan ketelitian jauh dari pusatnya, jadi di dekat $x=3$ kita memerlukan linearisasi di $a=3$. Dengan $f(3)=2$ dan $f'(3)=\frac{1}{2\sqrt{4}}=\frac14$,
$$L(x)=2+\frac14(x-3)=\frac54+\frac x4.$$
Di $x=3{,}2$ ini memberi $\sqrt{4{,}2}\approx\frac54+\frac{3{,}2}{4}=2{,}050$, yang berbeda dari nilai sebenarnya $2{,}04939$ kurang dari satu per seribu. Linearisasi di $0$ memberi $1+\frac{3{,}2}{2}=2{,}6$ di sana, meleset lebih dari $25\%$. Jadi pilih pusat $a$ yang $f(a)$ dan $f'(a)$-nya mudah dicari dan dekat dengan tempat yang diperlukan.

**Contoh 3.** Untuk $f(x)=\cos x$ di $a=\frac\pi2$ kita punya $f\left(\frac\pi2\right)=0$ dan $f'\left(\frac\pi2\right)=-\sin\frac\pi2=-1$, sehingga
$$L(x)=0-1\cdot\left(x-\frac\pi2\right)=-x+\frac\pi2.$$

**Linearisasi umum di $x=0$.** Menghitungnya seperti pada Contoh 1 memberi:

| Fungsi | Linearisasi di $0$ |
|---|---|
| $\sin x$ | $x$ |
| $\cos x$ | $1$ |
| $\tan x$ | $x$ |
| $e^x$ | $1+x$ |
| $\ln(1+x)$ | $x$ |
| $(1+x)^k$ | $1+kx$, untuk sebarang bilangan $k$ |

Baris terakhir yang paling berguna: ia linearisasi $f(x)=(1+x)^k$, dengan $f(0)=1$ dan $f'(0)=k$. Ia baik untuk $x$ dekat $0$ dan memberi, dengan $x$ diganti sesuatu yang kecil,
$$\sqrt{1+x}\approx1+\frac x2$$
$$\frac{1}{1-x}\approx1+x$$
$$\frac{1}{\sqrt{1-x^2}}\approx1+\frac{x^2}{2}$$
dan, dengan $k$ sebuah pangkat, $\sqrt[3]{1+5x^4}\approx1+\frac{5x^4}{3}$. Ia juga memperkirakan pangkat bilangan yang dekat dengan $1$: $1{,}0002^{50}\approx1+50\cdot0{,}0002=1{,}01$ (nilai sebenarnya $1{,}010049$) dan $\sqrt[3]{1{,}009}\approx1+\frac{0{,}009}{3}=1{,}003$. Cobalah fungsi, pusat, dan $x$ buatanmu sendiri di bawah.`,
          ),
        },
        { kind: 'widget', name: 'linearize' },
      ],
    },

    /* ------------------------------------------------------------------- differentials */
    {
      id: 'differentials',
      heading: L('What are the differentials dx and dy?', 'Apa itu diferensial dx dan dy?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The differential $dx$ is an independent variable, a change of $x$ that you may choose, and the differential of $y=f(x)$ is $dy=f'(x)\,dx$, the amount that the tangent line rises or falls when $x$ changes by $dx$.** The notation $\frac{dy}{dx}$ for the derivative looks like a ratio but is not one by its definition; the differentials make it one, because when $dx\ne0$
$$\frac{dy}{dx}=\frac{f'(x)\,dx}{dx}=f'(x).$$
Unlike $dx$, the variable $dy$ is always dependent: it depends on both $x$ and $dx$. If $dx$ is given a value and $x$ is a number in the domain, these determine the number $dy$. Often $dx$ is chosen to be $\Delta x$, the change in $x$.

**Example 4.** (a) Find $dy$ if $y=x^5+37x$. (b) Find $dy$ when $x=1$ and $dx=0.2$. Here $dy=\left(5x^4+37\right)dx$, and with $x=1$ and $dx=0.2$ it is $(5+37)(0.2)=8.4$.

**The geometric meaning.** Set $x=a$ and $dx=\Delta x$. The true change of $y=f(x)$ is $\Delta y=f(a+dx)-f(a)$. The corresponding change of the tangent line $L$ is
$$\Delta L=L(a+dx)-L(a)=f'(a)\,dx=dy.$$
So $dy$ is the change of the *linearization*, the rise of the tangent line over the run $dx$, whereas $\Delta y$ is the rise of the *curve*. They are close when $dx$ is small, and the move of the slider below shows the difference.

**Differential forms.** We sometimes write $df=f'(x)\,dx$ and call $df$ the differential of $f$; for $f(x)=3x^2-6$ it is $df=d\left(3x^2-6\right)=6x\,dx$. Every differentiation rule has a differential form: $\frac{d(u+v)}{dx}=\frac{du}{dx}+\frac{dv}{dx}$ becomes $d(u+v)=du+dv$, and $d(\sin u)=\cos u\,du$.

**Example 5.** The chain rule and the other rules give differentials:
$$d(\tan2x)=\sec^2(2x)\,d(2x)$$
$$d(\tan2x)=2\sec^2(2x)\,dx$$
$$d\left(\frac{x}{x+1}\right)=\frac{(x+1)\,dx-x\,dx}{(x+1)^2}$$
$$d\left(\frac{x}{x+1}\right)=\frac{dx}{(x+1)^2}.$$
The first uses the [chain rule](article:the-chain-rule#chain-rule), with $u=2x$ inside the tangent.`,
            T`**Diferensial $dx$ adalah peubah bebas, perubahan $x$ yang boleh kamu pilih, dan diferensial $y=f(x)$ adalah $dy=f'(x)\,dx$, besar naik atau turunnya garis singgung ketika $x$ berubah sebesar $dx$.** Notasi $\frac{dy}{dx}$ untuk turunan tampak seperti rasio tetapi menurut definisinya bukan; diferensial membuatnya menjadi rasio, karena ketika $dx\ne0$
$$\frac{dy}{dx}=\frac{f'(x)\,dx}{dx}=f'(x).$$
Tidak seperti $dx$, peubah $dy$ selalu tak bebas: ia bergantung pada $x$ dan $dx$. Jika $dx$ diberi nilai dan $x$ adalah bilangan dalam domain, keduanya menentukan bilangan $dy$. Sering $dx$ dipilih sebagai $\Delta x$, perubahan $x$.

**Contoh 4.** (a) Tentukan $dy$ jika $y=x^5+37x$. (b) Tentukan $dy$ ketika $x=1$ dan $dx=0{,}2$. Di sini $dy=\left(5x^4+37\right)dx$, dan dengan $x=1$ serta $dx=0{,}2$ nilainya $(5+37)(0{,}2)=8{,}4$.

**Arti geometris.** Misalkan $x=a$ dan $dx=\Delta x$. Perubahan sebenarnya $y=f(x)$ adalah $\Delta y=f(a+dx)-f(a)$. Perubahan garis singgung $L$ yang bersesuaian adalah
$$\Delta L=L(a+dx)-L(a)=f'(a)\,dx=dy.$$
Jadi $dy$ adalah perubahan *linearisasi*, kenaikan garis singgung pada selang $dx$, sedangkan $\Delta y$ adalah kenaikan *kurva*. Keduanya dekat ketika $dx$ kecil, dan menggeser penggeser di bawah memperlihatkan selisihnya.

**Bentuk diferensial.** Kita kadang menulis $df=f'(x)\,dx$ dan menyebut $df$ diferensial $f$; untuk $f(x)=3x^2-6$ ia $df=d\left(3x^2-6\right)=6x\,dx$. Setiap aturan turunan memiliki bentuk diferensial: $\frac{d(u+v)}{dx}=\frac{du}{dx}+\frac{dv}{dx}$ menjadi $d(u+v)=du+dv$, dan $d(\sin u)=\cos u\,du$.

**Contoh 5.** Aturan rantai dan aturan lain memberi diferensial:
$$d(\tan2x)=\sec^2(2x)\,d(2x)$$
$$d(\tan2x)=2\sec^2(2x)\,dx$$
$$d\left(\frac{x}{x+1}\right)=\frac{(x+1)\,dx-x\,dx}{(x+1)^2}$$
$$d\left(\frac{x}{x+1}\right)=\frac{dx}{(x+1)^2}.$$
Yang pertama memakai [aturan rantai](article:the-chain-rule#chain-rule), dengan $u=2x$ di dalam tangen.`,
          ),
        },
        { kind: 'widget', name: 'diffgap' },
      ],
    },

    /* ------------------------------------------------------------------- estimating */
    {
      id: 'estimating',
      heading: L('How do you estimate values and changes with differentials?', 'Bagaimana memperkirakan nilai dan perubahan dengan diferensial?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To estimate $f(a+dx)$ when $f(a)$ is known and $dx$ is small, use $f(a+dx)\approx f(a)+dy$ with $dy=f'(a)\,dx$; equivalently the change $\Delta f$ is approximately the differential $df$.** The goal is to choose a nearby point $a$ where both $f(a)$ and $f'(a)$ are easy to evaluate.

**Example 6: the area of a circle.** The radius $r$ of a circle increases from $a=10$ m to $10.1$ m. Use $dA$ to estimate the increase in the area, and the area of the enlarged circle. Since $A=\pi r^2$, the estimated increase is
$$dA=A'(a)\,dr=2\pi a\,dr$$
$$dA=2\pi(10)(0.1)=2\pi\ \text{m}^2.$$
So
$$A(10.1)\approx A(10)+dA$$
$$A(10.1)\approx100\pi+2\pi=102\pi\ \text{m}^2.$$
Directly, $A(10.1)=\pi(10.1)^2=102.01\pi\ \text{m}^2$, so the error is $0.01\pi\ \text{m}^2$, the difference $\Delta A-dA$.

**Example 7a: a cube root.** To estimate $\sqrt[3]{7.97}$ take $f(x)=x^{1/3}$, where $dy=\frac{1}{3x^{2/3}}\,dx$. The closest number with an easy cube root is $a=8$, and to get $a+dx=7.97$ we choose $dx=-0.03$:
$$f(7.97)\approx f(8)+\frac{1}{3\cdot8^{2/3}}(-0.03)$$
$$f(7.97)\approx2+\frac{1}{12}(-0.03)=1.9975.$$
The true value is $1.997497$ to six places.

**Example 7b: a sine.** To estimate $\sin\left(\frac\pi6+0.01\right)$ take $a=\frac\pi6$, where $\sin\frac\pi6=\frac12$ and $\cos\frac\pi6=\frac{\sqrt3}{2}$, and $dx=0.01$:
$$\sin\left(\frac\pi6+0.01\right)\approx\frac12+\frac{\sqrt3}{2}(0.01)$$
$$\sin\left(\frac\pi6+0.01\right)\approx0.5087.$$
The true value is $0.508635$. Computers can use this method: an algorithm stores a table of sine and cosine values at a grid of angles and fills in the values between with a differential, like Example 7b.

**Absolute, relative and percentage change.** When we move from $a$ to $a+dx$, the change in $f$ can be described in three ways:

| | True | Estimated |
|---|---|---|
| Absolute change | $\Delta f=f(a+dx)-f(a)$ | $df=f'(a)\,dx$ |
| Relative change | $\frac{\Delta f}{f(a)}$ | $\frac{df}{f(a)}$ |
| Percentage change | $\frac{\Delta f}{f(a)}\times100$ | $\frac{df}{f(a)}\times100$ |

In Example 6 the area changes by $\frac{2\pi}{100\pi}=2\%$ (estimated) when the radius changes by $\frac{0.1}{10}=1\%$.`,
            T`**Untuk memperkirakan $f(a+dx)$ ketika $f(a)$ diketahui dan $dx$ kecil, pakai $f(a+dx)\approx f(a)+dy$ dengan $dy=f'(a)\,dx$; setara dengan itu, perubahan $\Delta f$ kira-kira sama dengan diferensial $df$.** Tujuannya adalah memilih titik terdekat $a$ yang $f(a)$ dan $f'(a)$-nya sama-sama mudah dihitung.

**Contoh 6: luas lingkaran.** Jari-jari $r$ sebuah lingkaran bertambah dari $a=10$ m menjadi $10{,}1$ m. Pakai $dA$ untuk memperkirakan pertambahan luas, dan luas lingkaran yang membesar itu. Karena $A=\pi r^2$, pertambahan yang diperkirakan adalah
$$dA=A'(a)\,dr=2\pi a\,dr$$
$$dA=2\pi(10)(0{,}1)=2\pi\ \text{m}^2.$$
Jadi
$$A(10{,}1)\approx A(10)+dA$$
$$A(10{,}1)\approx100\pi+2\pi=102\pi\ \text{m}^2.$$
Secara langsung, $A(10{,}1)=\pi(10{,}1)^2=102{,}01\pi\ \text{m}^2$, sehingga galatnya $0{,}01\pi\ \text{m}^2$, selisih $\Delta A-dA$.

**Contoh 7a: akar pangkat tiga.** Untuk memperkirakan $\sqrt[3]{7{,}97}$ ambil $f(x)=x^{1/3}$, dengan $dy=\frac{1}{3x^{2/3}}\,dx$. Bilangan terdekat yang akar pangkat tiganya mudah adalah $a=8$, dan agar $a+dx=7{,}97$ kita pilih $dx=-0{,}03$:
$$f(7{,}97)\approx f(8)+\frac{1}{3\cdot8^{2/3}}(-0{,}03)$$
$$f(7{,}97)\approx2+\frac{1}{12}(-0{,}03)=1{,}9975.$$
Nilai sebenarnya $1{,}997497$ sampai enam angka desimal.

**Contoh 7b: sebuah sinus.** Untuk memperkirakan $\sin\left(\frac\pi6+0{,}01\right)$ ambil $a=\frac\pi6$, dengan $\sin\frac\pi6=\frac12$ dan $\cos\frac\pi6=\frac{\sqrt3}{2}$, dan $dx=0{,}01$:
$$\sin\left(\frac\pi6+0{,}01\right)\approx\frac12+\frac{\sqrt3}{2}(0{,}01)$$
$$\sin\left(\frac\pi6+0{,}01\right)\approx0{,}5087.$$
Nilai sebenarnya $0{,}508635$. Komputer dapat memakai cara ini: algoritma menyimpan tabel nilai sinus dan kosinus pada kisi sudut dan mengisi nilai di antaranya dengan diferensial, seperti Contoh 7b.

**Perubahan mutlak, relatif, dan persen.** Ketika kita bergerak dari $a$ ke $a+dx$, perubahan $f$ dapat dinyatakan dengan tiga cara:

| | Sebenarnya | Perkiraan |
|---|---|---|
| Perubahan mutlak | $\Delta f=f(a+dx)-f(a)$ | $df=f'(a)\,dx$ |
| Perubahan relatif | $\frac{\Delta f}{f(a)}$ | $\frac{df}{f(a)}$ |
| Perubahan persen | $\frac{\Delta f}{f(a)}\times100$ | $\frac{df}{f(a)}\times100$ |

Pada Contoh 6 luas berubah $\frac{2\pi}{100\pi}=2\%$ (perkiraan) ketika jari-jari berubah $\frac{0{,}1}{10}=1\%$.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------ error and sensitivity */
    {
      id: 'error-and-sensitivity',
      heading: L('How large is the error, and how does a measuring error spread?', 'Seberapa besar galatnya, dan bagaimana galat pengukuran menyebar?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**If $f$ is differentiable at $a$ and $x$ changes from $a$ to $a+\Delta x$, the true change is $\Delta f=f'(a)\,\Delta x+\varepsilon\,\Delta x$, where $\varepsilon\to0$ as $\Delta x\to0$, so the error of the differential estimate is $\varepsilon\,\Delta x$, a product of two small quantities.** The reason is the definition of the derivative. The error is
$$\Delta f-df=\left(\frac{f(a+\Delta x)-f(a)}{\Delta x}-f'(a)\right)\Delta x$$
$$\Delta f-df=\varepsilon\,\Delta x,$$
and the quantity in parentheses is a difference quotient minus its limit, which tends to $0$. For the circle of Example 6, $\Delta A-dA=0.01\pi=\pi(\Delta r)^2$, so $\varepsilon=\pi\,\Delta r=0.1\pi$. For many common functions the error is much smaller than $\Delta x$: when $f$ has a second derivative it is about $\frac12f''(a)\,\Delta x^2$, a rule of thumb that is proved later with Taylor's theorem and that explains the widget above, where the error curve is flat at $a$ and grows like a parabola.

**The linearization is the best linear approximation.** Suppose another linear function $g(x)=m(x-a)+c$ is used to approximate $f$ with error $E(x)=f(x)-g(x)$, and we ask for two things: $E(a)=0$, and $\frac{E(x)}{x-a}\to0$ as $x\to a$ (the error is negligible next to $x-a$). The first gives $c=f(a)$. Then
$$\frac{E(x)}{x-a}=\frac{f(x)-f(a)}{x-a}-m\;\longrightarrow\;f'(a)-m,$$
which is $0$ only for $m=f'(a)$. So $L(x)=f(a)+f'(a)(x-a)$ is the only linear approximation whose error is zero at $a$ and negligible compared with $x-a$. Every other line through $(a,f(a))$ leaves an error of the order of $x-a$.

**Sensitivity to change.** The equation $df=f'(x)\,dx$ tells how sensitive the output of $f$ is to a change of the input at different values of $x$: the larger $|f'|$, the greater the effect of a given $dx$ (compare the [sensitivity of a function](article:the-derivative-as-a-rate-of-change#sensitivity)). **Example 8.** The depth of a well is $s=4.9t^2$ meters, found by timing a dropped stone. Then $ds=9.8t\,dt$. If the time is read with an error of $dt=0.1$ s, then at $t=2$ s the error is about $ds=(9.8)(2)(0.1)=1.96$ m, but at $t=5$ s it is $(9.8)(5)(0.1)=4.9$ m. For the same error in the time, the depth is more uncertain when the fall is longer.

**How a measuring error spreads.** For a quantity $y=cx^n$, such as the area $\pi r^2$ ($n=2$) or the volume $x^3$ of a cube ($n=3$), $dy=ncx^{n-1}dx$, and dividing by $y=cx^n$,
$$\frac{dy}{y}=n\,\frac{dx}{x}.$$
So a relative error in $x$ becomes $n$ times as large in $y$. A $2\%$ error in the radius of a circle gives about $2\%$ in the circumference ($n=1$) and $4\%$ in the area; a $0.5\%$ error in the edge of a cube gives $1\%$ in the surface area ($n=2$) and $1.5\%$ in the volume; a $1\%$ error in the diameter of a sphere gives $3\%$ in its volume. Read the other way, it gives a *tolerance*: to calculate the volume of a cylinder with height equal to radius, $V=\pi h^3$, to within $1\%$, the height must be measured to within about $\frac13\%$.

**The estimate is for small changes.** Blood flow through an artery is $V=kr^4$, so a $10\%$ increase of the radius is estimated to raise the flow by $4\cdot10=40\%$. The exact value is $1.1^4-1=46.4\%$. The estimate is first order, and the error grows like the square of the change, so the larger the change, the worse the percentage rule. Move the sliders below to see where the line and the exact curve part.`,
            T`**Jika $f$ terdiferensialkan di $a$ dan $x$ berubah dari $a$ ke $a+\Delta x$, perubahan sebenarnya adalah $\Delta f=f'(a)\,\Delta x+\varepsilon\,\Delta x$, dengan $\varepsilon\to0$ saat $\Delta x\to0$, sehingga galat perkiraan diferensial adalah $\varepsilon\,\Delta x$, hasil kali dua besaran kecil.** Alasannya adalah definisi turunan. Galatnya adalah
$$\Delta f-df=\left(\frac{f(a+\Delta x)-f(a)}{\Delta x}-f'(a)\right)\Delta x$$
$$\Delta f-df=\varepsilon\,\Delta x,$$
dan besaran dalam kurung adalah hasil bagi selisih dikurangi limitnya, yang menuju $0$. Untuk lingkaran pada Contoh 6, $\Delta A-dA=0{,}01\pi=\pi(\Delta r)^2$, sehingga $\varepsilon=\pi\,\Delta r=0{,}1\pi$. Untuk banyak fungsi umum galatnya jauh lebih kecil daripada $\Delta x$: ketika $f$ memiliki turunan kedua ia sekitar $\frac12f''(a)\,\Delta x^2$, aturan praktis yang dibuktikan nanti dengan teorema Taylor dan yang menjelaskan widget di atas, tempat kurva galat mendatar di $a$ dan tumbuh seperti parabola.

**Linearisasi adalah hampiran linear terbaik.** Misalkan fungsi linear lain $g(x)=m(x-a)+c$ dipakai untuk menghampiri $f$ dengan galat $E(x)=f(x)-g(x)$, dan kita meminta dua hal: $E(a)=0$, dan $\frac{E(x)}{x-a}\to0$ saat $x\to a$ (galat dapat diabaikan dibandingkan $x-a$). Yang pertama memberi $c=f(a)$. Maka
$$\frac{E(x)}{x-a}=\frac{f(x)-f(a)}{x-a}-m\;\longrightarrow\;f'(a)-m,$$
yang $0$ hanya untuk $m=f'(a)$. Jadi $L(x)=f(a)+f'(a)(x-a)$ adalah satu-satunya hampiran linear yang galatnya nol di $a$ dan dapat diabaikan dibandingkan $x-a$. Setiap garis lain yang melalui $(a,f(a))$ menyisakan galat sebesar orde $x-a$.

**Kepekaan terhadap perubahan.** Persamaan $df=f'(x)\,dx$ menyatakan seberapa peka keluaran $f$ terhadap perubahan masukan pada berbagai nilai $x$: makin besar $|f'|$, makin besar pengaruh $dx$ tertentu (bandingkan [kepekaan suatu fungsi](article:the-derivative-as-a-rate-of-change#sensitivity)). **Contoh 8.** Kedalaman sumur adalah $s=4{,}9t^2$ meter, yang dicari dengan mengukur waktu jatuh sebuah batu. Maka $ds=9{,}8t\,dt$. Jika waktu terbaca dengan galat $dt=0{,}1$ detik, maka pada $t=2$ detik galatnya sekitar $ds=(9{,}8)(2)(0{,}1)=1{,}96$ m, tetapi pada $t=5$ detik galatnya $(9{,}8)(5)(0{,}1)=4{,}9$ m. Untuk galat waktu yang sama, kedalaman lebih tidak pasti ketika jatuhnya lebih lama.

**Bagaimana galat pengukuran menyebar.** Untuk besaran $y=cx^n$, seperti luas $\pi r^2$ ($n=2$) atau volume $x^3$ kubus ($n=3$), $dy=ncx^{n-1}dx$, dan membaginya dengan $y=cx^n$,
$$\frac{dy}{y}=n\,\frac{dx}{x}.$$
Jadi galat relatif pada $x$ menjadi $n$ kali lebih besar pada $y$. Galat $2\%$ pada jari-jari lingkaran memberi sekitar $2\%$ pada keliling ($n=1$) dan $4\%$ pada luas; galat $0{,}5\%$ pada rusuk kubus memberi $1\%$ pada luas permukaan ($n=2$) dan $1{,}5\%$ pada volume; galat $1\%$ pada diameter bola memberi $3\%$ pada volumenya. Dibaca terbalik, ini memberi *toleransi*: agar volume tabung dengan tinggi sama dengan jari-jari, $V=\pi h^3$, terhitung dalam $1\%$, tinggi harus diukur dalam sekitar $\frac13\%$.

**Perkiraan ini untuk perubahan kecil.** Aliran darah melalui arteri adalah $V=kr^4$, sehingga kenaikan jari-jari $10\%$ diperkirakan menaikkan aliran $4\cdot10=40\%$. Nilai sebenarnya $1{,}1^4-1=46{,}4\%$. Perkiraannya orde pertama, dan galatnya tumbuh seperti kuadrat perubahan, sehingga makin besar perubahannya, makin buruk aturan persen itu. Geser penggeser di bawah untuk melihat di mana garis dan kurva eksak berpisah.`,
          ),
        },
        { kind: 'widget', name: 'errpercent' },
      ],
    },

    /* ----------------------------------------------------------------------------- uses */
    {
      id: 'uses',
      heading: L('What are linearizations used for in science?', 'Untuk apa linearisasi dipakai dalam sains?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Linearizations turn a hard function into a simple one for small changes, and three classic uses are the small-angle approximation, the energy of a moving mass and Newton's method.**

**Small angles.** The linearization of $\sin x$ at $0$ is $x$, so for a small angle in radians $\sin\theta\approx\theta$: $\sin0.1=0.0998$, close to $0.1$. The equation of a pendulum becomes linear with this replacement, which is why a pendulum of small swing keeps a steady period. The angle must be in radians; $\sin10^\circ\approx10$ is wrong, while $\sin10^\circ\approx0.1745$ is right.

**Mass and energy.** Newton's second law $F=\frac{d}{dt}(mv)=ma$ assumes that the mass is constant, but in Einstein's corrected formula the mass is $m=\frac{m_0}{\sqrt{1-v^2/c^2}}$, where $m_0$ is the rest mass and $c\approx300\,000$ km/s is the speed of light. For $v$ much smaller than $c$ the number $x=\frac{v^2}{c^2}$ is near $0$, and the linearization $(1-x)^{-1/2}\approx1+\frac x2$ gives
$$m\approx m_0\left(1+\frac{v^2}{2c^2}\right)$$
$$(m-m_0)c^2\approx\frac12m_0v^2.$$
The right-hand side is the kinetic energy of Newtonian physics. So the change in kinetic energy in going from rest to the speed $v$ is approximately the change in mass times $c^2$, $\Delta(m)c^2\approx\Delta(\text{KE})$, and since $c^2\approx9\times10^{16}\ \text{m}^2/\text{s}^2$, a small change in mass is a large change in energy. At $v=0.1c$ the exact factor is $1.005038$ and the approximation gives $1.005$.

**Newton's method.** The linearization of $f$ at $a$ is a line, and a line has an easy zero. Solving $L(x)=0$ gives $x=a-\frac{f(a)}{f'(a)}$, which is usually closer to a zero of $f$ than $a$ is. Repeating this is Newton's method. For $f(x)=x^2-2$ and the start $a=1.5$ the next values are $1.416667$, $1.414216$, $1.414214$: three steps for $\sqrt2$ to six places.`,
            T`**Linearisasi mengubah fungsi yang sulit menjadi sederhana untuk perubahan kecil, dan tiga pemakaian klasik adalah hampiran sudut kecil, energi massa yang bergerak, dan metode Newton.**

**Sudut kecil.** Linearisasi $\sin x$ di $0$ adalah $x$, sehingga untuk sudut kecil dalam radian $\sin\theta\approx\theta$: $\sin0{,}1=0{,}0998$, dekat dengan $0{,}1$. Persamaan bandul menjadi linear dengan penggantian ini, itulah sebabnya bandul dengan ayunan kecil memiliki periode yang tetap. Sudutnya harus dalam radian; $\sin10^\circ\approx10$ salah, sedangkan $\sin10^\circ\approx0{,}1745$ benar.

**Massa dan energi.** Hukum kedua Newton $F=\frac{d}{dt}(mv)=ma$ mengandaikan massa konstan, tetapi dalam rumus Einstein yang dikoreksi massanya $m=\frac{m_0}{\sqrt{1-v^2/c^2}}$, dengan $m_0$ massa diam dan $c\approx300\,000$ km/detik kecepatan cahaya. Untuk $v$ jauh lebih kecil daripada $c$ bilangan $x=\frac{v^2}{c^2}$ dekat $0$, dan linearisasi $(1-x)^{-1/2}\approx1+\frac x2$ memberi
$$m\approx m_0\left(1+\frac{v^2}{2c^2}\right)$$
$$(m-m_0)c^2\approx\frac12m_0v^2.$$
Ruas kanan adalah energi kinetik fisika Newton. Jadi perubahan energi kinetik dari diam sampai kecepatan $v$ kira-kira sama dengan perubahan massa kali $c^2$, $\Delta(m)c^2\approx\Delta(\text{EK})$, dan karena $c^2\approx9\times10^{16}\ \text{m}^2/\text{detik}^2$, perubahan massa yang kecil adalah perubahan energi yang besar. Pada $v=0{,}1c$ faktor eksaknya $1{,}005038$ dan hampirannya memberi $1{,}005$.

**Metode Newton.** Linearisasi $f$ di $a$ adalah sebuah garis, dan garis memiliki nol yang mudah. Menyelesaikan $L(x)=0$ memberi $x=a-\frac{f(a)}{f'(a)}$, yang biasanya lebih dekat ke nol $f$ daripada $a$. Mengulanginya adalah metode Newton. Untuk $f(x)=x^2-2$ dan awal $a=1{,}5$ nilai berikutnya adalah $1{,}416667$, $1{,}414216$, $1{,}414214$: tiga langkah untuk $\sqrt2$ sampai enam angka desimal.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------- in code */
    {
      id: 'linearization-in-code',
      heading: L('How do you compute linearizations and differentials in code?', 'Bagaimana menghitung linearisasi dan diferensial dengan kode?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**With SymPy a linearization is one line: differentiate, evaluate at the center and build $f(a)+f'(a)(x-a)$.** The function below reproduces the linearizations of this article exactly, and the lines after it check numbers with plain Python: the table of $\sqrt{1+x}\approx1+\frac x2$, the circle of Example 6, the two estimates of Example 7, the percentage rule for $y=x^n$ and the first steps of Newton's method.`,
            T`**Dengan SymPy linearisasi cukup satu baris: turunkan, hitung di pusat, dan bentuk $f(a)+f'(a)(x-a)$.** Fungsi di bawah mereproduksi linearisasi dalam artikel ini secara eksak, dan baris sesudahnya memeriksa bilangan dengan Python biasa: tabel $\sqrt{1+x}\approx1+\frac x2$, lingkaran pada Contoh 6, dua perkiraan pada Contoh 7, aturan persen untuk $y=x^n$, dan langkah pertama metode Newton.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python and SymPy: linearizations, differentials and the error of an estimate', 'Python dan SymPy: linearisasi, diferensial, dan galat sebuah perkiraan'),
          code: `import math
import sympy as sp

x = sp.symbols('x')


def linearize(f, a):
    """L(x) = f(a) + f'(a) (x - a)"""
    return sp.simplify(f.subs(x, a) + sp.diff(f, x).subs(x, a) * (x - a))


for f, a in ((sp.sqrt(1 + x), 0), (sp.sqrt(1 + x), 3), (sp.cos(x), sp.pi / 2), (sp.exp(x), 0), (sp.log(1 + x), 0), (sp.cbrt(x), 8)):
    print(f, 'at', a, '->', linearize(f, a))
# sqrt(x + 1) at 0 -> x/2 + 1
# sqrt(x + 1) at 3 -> x/4 + 5/4
# cos(x) at pi/2 -> -x + pi/2
# exp(x) at 0 -> x + 1
# log(x + 1) at 0 -> x
# x**(1/3) at 8 -> x/12 + 4/3

# how good is sqrt(1 + x) = 1 + x/2 ?   (x, approximation, true value, error)
for t in (0.005, 0.05, 0.2):
    print(t, 1 + t / 2, round(math.sqrt(1 + t), 6), f'{abs(1 + t / 2 - math.sqrt(1 + t)):.1e}')
# 0.005 1.0025 1.002497 3.1e-06
# 0.05 1.025 1.024695 3.0e-04
# 0.2 1.1 1.095445 4.6e-03

# differentials: the radius of a circle grows from 10 m to 10.1 m
dA = 2 * math.pi * 10 * 0.1
true = math.pi * 10.1**2 - math.pi * 10**2
print(round(dA, 4), round(true, 4), round(true - dA, 4), round(math.pi * 0.01, 4))      # 6.2832 6.3146 0.0314 0.0314

# estimates: the cube root of 7.97 and sin(pi/6 + 0.01)
print(round(2 + (-0.03) / 12, 4), round(7.97 ** (1 / 3), 6))                              # 1.9975 1.997497
print(round(0.5 + math.sqrt(3) / 2 * 0.01, 4), round(math.sin(math.pi / 6 + 0.01), 6))    # 0.5087 0.508635

# a measuring error spreads: y = x^n, p% in x gives about n p% in y   (n, p, estimate, exact)
for n, p in ((2, 2), (3, 0.5), (4, 10)):
    print(n, p, n * p, round(((1 + p / 100) ** n - 1) * 100, 4))
# 2 2 4 4.04
# 3 0.5 1.5 1.5075
# 4 10 40 46.41

# Newton's method is the zero of the linearization, again and again (f(x) = x^2 - 2)
a = 1.5
for step in range(4):
    a = a - (a * a - 2) / (2 * a)
    print(step + 1, a)
# 1 1.4166666666666667
# 2 1.4142156862745099
# 3 1.4142135623746899
# 4 1.4142135623730951`,
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
  // how good is sqrt(1 + x) = 1 + x/2 ?   (x, approximation, true value, error)
  double xs[3] = {0.005, 0.05, 0.2};
  for (int i = 0; i < 3; i++) {
    double x = xs[i], approx = 1 + x / 2, truth = sqrt(1 + x);
    printf("%.3f  %.4f  %.6f  %.1e\\n", x, approx, truth, fabs(approx - truth));
  }

  // differentials: the radius of a circle grows from 10 m to 10.1 m
  double dA = 2 * PI * 10 * 0.1;
  double trueChange = PI * 10.1 * 10.1 - PI * 10 * 10;
  printf("%.4f %.4f %.4f %.4f\\n", dA, trueChange, trueChange - dA, PI * 0.01);

  // estimates: the cube root of 7.97, and sin(pi/6 + 0.01)
  printf("%.4f %.6f\\n", 2 + (-0.03) / 12, pow(7.97, 1.0 / 3));
  printf("%.4f %.6f\\n", 0.5 + sqrt(3.0) / 2 * 0.01, sin(PI / 6 + 0.01));

  // a measuring error spreads: y = x^n, p% in x gives about n p% in y   (n, p, estimate, exact)
  int ns[3] = {2, 3, 4};
  double ps[3] = {2, 0.5, 10};
  for (int i = 0; i < 3; i++)
    printf("%d %.1f %.1f %.4f\\n", ns[i], ps[i], ns[i] * ps[i], (pow(1 + ps[i] / 100, ns[i]) - 1) * 100);

  // Newton's method is the zero of the linearization, again and again (f(x) = x^2 - 2)
  double a = 1.5;
  for (int step = 1; step <= 4; step++) {
    a = a - (a * a - 2) / (2 * a);
    printf("%d %.13f\\n", step, a);
  }
  return 0;
}

/* output:
0.005  1.0025  1.002497  3.1e-06
0.050  1.0250  1.024695  3.0e-04
0.200  1.1000  1.095445  4.6e-03
6.2832 6.3146 0.0314 0.0314
1.9975 1.997497
0.5087 0.508635
2 2.0 4.0 4.0400
3 0.5 1.5 1.5075
4 10.0 40.0 46.4100
1 1.4166666666667
2 1.4142156862745
3 1.4142135623747
4 1.4142135623731
*/`,
        },
      ],
    },

    /* --------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where do differentials and linear approximations come from?', 'Dari mana asal diferensial dan hampiran linear?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Differentials began as infinitely small quantities, and linearization was made precise when they were replaced by limits.**

- **Leibniz.** Gottfried Wilhelm Leibniz introduced the symbols $dx$ and $dy$ for infinitely small differences, and published his differential calculus in 1684. For him $\frac{dy}{dx}$ was a true quotient of two such quantities, and the tangent line was the line that the curve follows over an infinitely small step.
- **Newton and the first approximation.** Isaac Newton described in 1669 an iteration that improves an approximate root, in which each step solves the linearization of the equation; Joseph Raphson published a simpler form in 1690. Today it is called the Newton-Raphson method.
- **Taylor.** Brook Taylor, in 1715, gave the general rule that a function can be approximated near $a$ by a polynomial built from its derivatives. The linearization is the first-degree case, and the quadratic approximation, with $\frac12f''(a)(x-a)^2$ added, is the next.
- **Cauchy.** In the 1820s Augustin-Louis Cauchy removed the infinitely small. He defined $dx$ as an ordinary finite increment, an independent variable, and the differential as $dy=f'(x)\,dx$, which is the definition used here. This is why $dy$ is the change in the tangent line, not an infinitely small change in the curve.`,
            T`**Diferensial dimulai sebagai besaran yang sangat kecil tak terhingga, dan linearisasi dibuat tepat ketika besaran itu diganti dengan limit.**

- **Leibniz.** Gottfried Wilhelm Leibniz memperkenalkan lambang $dx$ dan $dy$ untuk selisih yang sangat kecil tak terhingga, dan menerbitkan kalkulus diferensialnya pada 1684. Baginya $\frac{dy}{dx}$ adalah hasil bagi sejati dua besaran seperti itu, dan garis singgung adalah garis yang diikuti kurva pada langkah yang sangat kecil tak terhingga.
- **Newton dan hampiran pertama.** Isaac Newton pada 1669 menjelaskan iterasi yang memperbaiki akar hampiran, yang tiap langkahnya menyelesaikan linearisasi persamaan; Joseph Raphson menerbitkan bentuk yang lebih sederhana pada 1690. Kini ia disebut metode Newton-Raphson.
- **Taylor.** Brook Taylor, pada 1715, memberi aturan umum bahwa fungsi dapat dihampiri di dekat $a$ oleh polinomial yang dibentuk dari turunannya. Linearisasi adalah kasus derajat pertama, dan hampiran kuadrat, dengan $\frac12f''(a)(x-a)^2$ ditambahkan, adalah berikutnya.
- **Cauchy.** Pada 1820-an Augustin-Louis Cauchy menyingkirkan yang sangat kecil tak terhingga. Ia mendefinisikan $dx$ sebagai pertambahan terhingga biasa, sebuah peubah bebas, dan diferensial sebagai $dy=f'(x)\,dx$, yaitu definisi yang dipakai di sini. Itulah sebabnya $dy$ adalah perubahan garis singgung, bukan perubahan sangat kecil tak terhingga pada kurva.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What mistakes do people make with linearization and differentials?', 'Kesalahan apa yang sering terjadi pada linearisasi dan diferensial?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with linearization and differentials are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ $L(x)=f'(a)(x-a)$, leaving out $f(a)$ | The line passes through $(a,f(a))$: $L(x)=f(a)+f'(a)(x-a)$. |
| ❌ $L(x)=f(a)+f'(x)(x-a)$ | The slope is the number $f'(a)$ at the center, not a function of $x$. |
| ❌ Use $\sqrt{1+x}\approx1+\frac x2$ at $x=3$ and get $2.5$ for $\sqrt4$ | The center is $0$ and $3$ is far from it: use the center $a=3$, $\frac54+\frac x4$. |
| ❌ $\sin10^\circ\approx10$ | The approximation $\sin x\approx x$ needs radians: $\sin10^\circ\approx0.1745$. |
| ❌ $dy$ is the same as $\Delta y$ | $\Delta y$ is the true change of the curve and $dy=f'(a)\,dx$ the change of the tangent line; they differ by $\varepsilon\,dx$. |
| ❌ $dx$ and $dy$ are both fixed small numbers | $dx$ is a variable you choose, and $dy=f'(x)\,dx$ is computed from it. |
| ❌ A $2\%$ error in the radius gives a $2\%$ error in the area | The area is $\pi r^2$, so $n=2$: about $4\%$. |
| ❌ A $10\%$ larger radius gives exactly $40\%$ more flow in $V=kr^4$ | $40\%$ is the estimate; the exact change is $1.1^4-1=46.4\%$. |
| ❌ Linearize $\sqrt[3]{x}$ or $|x|$ at $0$ | There is no derivative at $0$ (a vertical tangent, a corner), so there is no linearization. |`,
            T`**Kesalahan paling umum pada linearisasi dan diferensial adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ $L(x)=f'(a)(x-a)$, tanpa $f(a)$ | Garis melalui $(a,f(a))$: $L(x)=f(a)+f'(a)(x-a)$. |
| ❌ $L(x)=f(a)+f'(x)(x-a)$ | Gradiennya adalah bilangan $f'(a)$ di pusat, bukan fungsi $x$. |
| ❌ Memakai $\sqrt{1+x}\approx1+\frac x2$ di $x=3$ dan mendapat $2{,}5$ untuk $\sqrt4$ | Pusatnya $0$ dan $3$ jauh darinya: pakai pusat $a=3$, $\frac54+\frac x4$. |
| ❌ $\sin10^\circ\approx10$ | Hampiran $\sin x\approx x$ memerlukan radian: $\sin10^\circ\approx0{,}1745$. |
| ❌ $dy$ sama dengan $\Delta y$ | $\Delta y$ perubahan sebenarnya kurva dan $dy=f'(a)\,dx$ perubahan garis singgung; keduanya berbeda sebesar $\varepsilon\,dx$. |
| ❌ $dx$ dan $dy$ sama-sama bilangan kecil yang tetap | $dx$ adalah peubah yang kamu pilih, dan $dy=f'(x)\,dx$ dihitung darinya. |
| ❌ Galat $2\%$ pada jari-jari memberi galat $2\%$ pada luas | Luasnya $\pi r^2$, jadi $n=2$: sekitar $4\%$. |
| ❌ Jari-jari $10\%$ lebih besar memberi aliran tepat $40\%$ lebih banyak pada $V=kr^4$ | $40\%$ adalah perkiraan; perubahan eksaknya $1{,}1^4-1=46{,}4\%$. |
| ❌ Melinearisasi $\sqrt[3]{x}$ atau $|x|$ di $0$ | Tidak ada turunan di $0$ (garis singgung tegak, sudut), sehingga tidak ada linearisasi. |`,
          ),
        },
      ],
    },

    /* -------------------------------------------------------------------------- practice */
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
              L('The linearization of $f$ at $a$ is $L(x)=f(a)+f\'(a)(x-a)$.', 'Linearisasi $f$ di $a$ adalah $L(x)=f(a)+f\'(a)(x-a)$.'),
              L('The graph of $L$ is the tangent line to the graph of $f$ at $(a,f(a))$.', 'Grafik $L$ adalah garis singgung grafik $f$ di $(a,f(a))$.'),
              L('A linearization is equally accurate everywhere.', 'Linearisasi sama telitinya di mana-mana.'),
              L('The differential of $y=f(x)$ is $dy=f\'(x)\\,dx$.', 'Diferensial $y=f(x)$ adalah $dy=f\'(x)\\,dx$.'),
              L('$dy$ always equals the true change $\\Delta y$.', '$dy$ selalu sama dengan perubahan sebenarnya $\\Delta y$.'),
              L('A $2\\%$ error in measuring the radius of a circle causes about a $2\\%$ error in its area.', 'Galat $2\\%$ dalam mengukur jari-jari lingkaran menyebabkan galat sekitar $2\\%$ pada luasnya.'),
            ],
            answer: [true, true, false, true, false, false],
            explain: L(
              'A linearization is best near its center. $dy$ is the change of the tangent line, and $\\Delta y$ differs from it by $\\varepsilon\\,dx$. The area is $\\pi r^2$, so a $2\\%$ error in $r$ gives about $4\\%$.',
              'Linearisasi terbaik di dekat pusatnya. $dy$ adalah perubahan garis singgung, dan $\\Delta y$ berbeda darinya sebesar $\\varepsilon\\,dx$. Luasnya $\\pi r^2$, sehingga galat $2\\%$ pada $r$ memberi sekitar $4\\%$.',
            ),
            hint: L('Think about how far from the center you are, and about the power of $r$ in the area.', 'Pikirkan seberapa jauh dari pusat, dan tentang pangkat $r$ pada luas.'),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L('Choose **all** the correct linear approximations for $x$ near $0$.', 'Pilih **semua** hampiran linear yang benar untuk $x$ dekat $0$.'),
            options: [
              L('$\\sin x\\approx x$', '$\\sin x\\approx x$'),
              L('$\\cos x\\approx1$', '$\\cos x\\approx1$'),
              L('$e^x\\approx1+x$', '$e^x\\approx1+x$'),
              L('$\\ln(1+x)\\approx x$', '$\\ln(1+x)\\approx x$'),
              L('$\\tan x\\approx1$', '$\\tan x\\approx1$'),
            ],
            answer: [0, 1, 2, 3],
            explain: L('The linearization of $\\tan x$ at $0$ is $x$, since $\\tan0=0$ and the slope there is $\\sec^20=1$.', 'Linearisasi $\\tan x$ di $0$ adalah $x$, karena $\\tan0=0$ dan gradien di sana $\\sec^20=1$.'),
            hint: L('For each function compute $f(0)$ and $f\'(0)$.', 'Untuk tiap fungsi hitung $f(0)$ dan $f\'(0)$.'),
          },
        },
        {
          kind: 'activity',
          title: L('A linearization of a square', 'Linearisasi sebuah kuadrat'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L('$f(3)=9$ and $f\'(3)=6$, so $L(x)=9+6(x-3)$.', '$f(3)=9$ dan $f\'(3)=6$, sehingga $L(x)=9+6(x-3)$.'), L('$9+6(0.1)$.', '$9+6(0{,}1)$.')],
            explain: L('$L(3.1)=9+6(0.1)=9.6$; the true value $3.1^2=9.61$.', '$L(3{,}1)=9+6(0{,}1)=9{,}6$; nilai sebenarnya $3{,}1^2=9{,}61$.'),
            prompt: L('Find $L(3.1)$, where $L$ is the linearization of $f(x)=x^2$ at $a=3$.', 'Tentukan $L(3{,}1)$, dengan $L$ linearisasi $f(x)=x^2$ di $a=3$.'),
            given: String.raw`L(3.1)=v`,
            blanks: [{ label: 'L(3.1) =', answer: 9.6 }],
          },
        },
        {
          kind: 'activity',
          title: L('A square root', 'Sebuah akar kuadrat'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L('Use $\\sqrt{1+x}\\approx1+\\frac x2$ with $x=0.08$.', 'Pakai $\\sqrt{1+x}\\approx1+\\frac x2$ dengan $x=0{,}08$.'), L('$1+0.04$.', '$1+0{,}04$.')],
            explain: L('$\\sqrt{1.08}\\approx1+\\frac{0.08}{2}=1.04$ (the true value is $1.03923$).', '$\\sqrt{1{,}08}\\approx1+\\frac{0{,}08}{2}=1{,}04$ (nilai sebenarnya $1{,}03923$).'),
            prompt: L('Estimate $\\sqrt{1.08}$ with the linearization of $\\sqrt{1+x}$ at $0$.', 'Perkirakan $\\sqrt{1{,}08}$ dengan linearisasi $\\sqrt{1+x}$ di $0$.'),
            given: String.raw`\sqrt{1.08}\approx v`,
            blanks: [{ label: 'estimate =', answer: 1.04 }],
          },
        },
        {
          kind: 'activity',
          title: L('The linearization of the cosine', 'Linearisasi kosinus'),
          step: {
            kind: 'quiz',
            id: 'p5',
            prompt: L('What is the linearization of $\\cos x$ at $a=\\frac\\pi2$?', 'Berapa linearisasi $\\cos x$ di $a=\\frac\\pi2$?'),
            options: [L('$-x+\\frac\\pi2$', '$-x+\\frac\\pi2$'), L('$x-\\frac\\pi2$', '$x-\\frac\\pi2$'), L('$1-x$', '$1-x$'), L('$-x$', '$-x$')],
            answer: 0,
            explain: L('$f\\left(\\frac\\pi2\\right)=0$ and $f\'\\left(\\frac\\pi2\\right)=-1$, so $L(x)=-\\left(x-\\frac\\pi2\\right)$.', '$f\\left(\\frac\\pi2\\right)=0$ dan $f\'\\left(\\frac\\pi2\\right)=-1$, sehingga $L(x)=-\\left(x-\\frac\\pi2\\right)$.'),
            hint: L('Compute the value and the slope of the cosine at $\\frac\\pi2$.', 'Hitung nilai dan gradien kosinus di $\\frac\\pi2$.'),
          },
        },
        {
          kind: 'activity',
          title: L('A differential', 'Sebuah diferensial'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L('$dy=3x^2\\,dx$.', '$dy=3x^2\\,dx$.'), L('$3\\cdot4\\cdot0.1$.', '$3\\cdot4\\cdot0{,}1$.')],
            explain: L('$dy=3(2)^2(0.1)=1.2$, while the true change is $2.1^3-2^3=1.261$.', '$dy=3(2)^2(0{,}1)=1{,}2$, sedangkan perubahan sebenarnya $2{,}1^3-2^3=1{,}261$.'),
            prompt: L('Find $dy$ for $y=x^3$ when $x=2$ and $dx=0.1$.', 'Tentukan $dy$ untuk $y=x^3$ ketika $x=2$ dan $dx=0{,}1$.'),
            given: String.raw`dy=v`,
            blanks: [{ label: 'dy =', answer: 1.2 }],
          },
        },
        {
          kind: 'activity',
          title: L('The differential of a sine', 'Diferensial sebuah sinus'),
          step: {
            kind: 'quiz',
            id: 'p7',
            prompt: L('What is $d(\\sin3x)$?', 'Berapa $d(\\sin3x)$?'),
            options: [L('$3\\cos3x\\,dx$', '$3\\cos3x\\,dx$'), L('$\\cos3x\\,dx$', '$\\cos3x\\,dx$'), L('$3\\cos3x$', '$3\\cos3x$'), L('$-3\\cos3x\\,dx$', '$-3\\cos3x\\,dx$')],
            answer: 0,
            explain: L('$d(\\sin u)=\\cos u\\,du$ with $u=3x$ and $du=3\\,dx$.', '$d(\\sin u)=\\cos u\\,du$ dengan $u=3x$ dan $du=3\\,dx$.'),
            hint: L('A differential ends with $dx$, and the chain rule brings the factor $3$.', 'Diferensial berakhir dengan $dx$, dan aturan rantai membawa faktor $3$.'),
          },
        },
        {
          kind: 'activity',
          title: L('A cube root', 'Akar pangkat tiga'),
          step: {
            kind: 'math',
            id: 'p8',
            hints: [L('Take $a=27$: $f\'(x)=\\frac{1}{3x^{2/3}}$, so $f\'(27)=\\frac{1}{27}$.', 'Ambil $a=27$: $f\'(x)=\\frac{1}{3x^{2/3}}$, sehingga $f\'(27)=\\frac{1}{27}$.'), L('$3+\\frac{0.27}{27}$.', '$3+\\frac{0{,}27}{27}$.')],
            explain: L('$\\sqrt[3]{27.27}\\approx3+\\frac{1}{27}(0.27)=3.01$.', '$\\sqrt[3]{27{,}27}\\approx3+\\frac{1}{27}(0{,}27)=3{,}01$.'),
            prompt: L('Use the center $a=27$ to estimate $\\sqrt[3]{27.27}$.', 'Pakai pusat $a=27$ untuk memperkirakan $\\sqrt[3]{27{,}27}$.'),
            given: String.raw`\sqrt[3]{27.27}\approx v`,
            blanks: [{ label: 'estimate =', answer: 3.01 }],
          },
        },
        {
          kind: 'activity',
          title: L('The error in a volume', 'Galat pada sebuah volume'),
          step: {
            kind: 'math',
            id: 'p9',
            hints: [L('For $V=x^3$, $\\frac{dV}{V}=3\\,\\frac{dx}{x}$.', 'Untuk $V=x^3$, $\\frac{dV}{V}=3\\,\\frac{dx}{x}$.'), L('$3\\cdot0.5$.', '$3\\cdot0{,}5$.')],
            explain: L('The relative error is multiplied by $n=3$: $3\\cdot0.5\\%=1.5\\%$.', 'Galat relatif dikalikan $n=3$: $3\\cdot0{,}5\\%=1{,}5\\%$.'),
            prompt: L('The edge of a cube is measured with an error of at most $0.5\\%$. What is the maximum percentage error in the volume?', 'Rusuk sebuah kubus diukur dengan galat paling besar $0{,}5\\%$. Berapa galat persen terbesar pada volumenya?'),
            given: String.raw`\text{error}=v\%`,
            blanks: [{ label: 'error (%) =', answer: 1.5 }],
          },
        },
        {
          kind: 'activity',
          title: L('The diameter of a sphere', 'Diameter sebuah bola'),
          step: {
            kind: 'quiz',
            id: 'p10',
            prompt: L('The diameter of a sphere is measured as $100\\pm1$ cm and its volume is calculated. About what percentage error is that in the volume?', 'Diameter sebuah bola diukur sebagai $100\\pm1$ cm dan volumenya dihitung. Kira-kira berapa galat persen pada volume?'),
            options: [L('$1\\%$', '$1\\%$'), L('$3\\%$', '$3\\%$'), L('$2\\%$', '$2\\%$'), L('$9\\%$', '$9\\%$')],
            answer: 1,
            explain: L('The volume is a multiple of $D^3$, so the relative error is $3\\cdot\\frac{1}{100}=3\\%$.', 'Volume adalah kelipatan $D^3$, sehingga galat relatifnya $3\\cdot\\frac{1}{100}=3\\%$.'),
            hint: L('The volume of a sphere is proportional to the cube of the diameter: what is $n$?', 'Volume bola sebanding dengan pangkat tiga diameter: berapa $n$?'),
          },
        },
        {
          kind: 'activity',
          title: L('The depth of a well', 'Kedalaman sebuah sumur'),
          step: {
            kind: 'math',
            id: 'p11',
            hints: [L('$ds=9.8t\\,dt$.', '$ds=9{,}8t\\,dt$.'), L('$9.8\\cdot3\\cdot0.1$.', '$9{,}8\\cdot3\\cdot0{,}1$.')],
            explain: L('$ds=9.8(3)(0.1)=2.94$ m.', '$ds=9{,}8(3)(0{,}1)=2{,}94$ m.'),
            prompt: L('The depth of a well is $s=4.9t^2$ meters. By about how many meters does a timing error of $dt=0.1$ s change the answer when $t=3$ s?', 'Kedalaman sumur adalah $s=4{,}9t^2$ meter. Kira-kira berapa meter galat pengukuran waktu $dt=0{,}1$ detik mengubah jawaban ketika $t=3$ detik?'),
            given: String.raw`ds=v`,
            blanks: [{ label: 'ds =', answer: 2.94 }],
          },
        },
        {
          kind: 'activity',
          title: L('Why accuracy is lost', 'Mengapa ketelitian hilang'),
          step: {
            kind: 'quiz',
            id: 'p12',
            prompt: L('Why does a linearization lose accuracy away from its center?', 'Mengapa linearisasi kehilangan ketelitian jauh dari pusatnya?'),
            options: [L('the curve bends away from the tangent line, and the gap grows roughly like the square of the distance from $a$', 'kurva melengkung menjauhi garis singgung, dan selisihnya tumbuh kira-kira seperti kuadrat jarak dari $a$'), L('because the derivative changes sign', 'karena turunan berubah tanda'), L('because $f\'(a)$ stops existing', 'karena $f\'(a)$ berhenti ada'), L('because $L$ is not continuous', 'karena $L$ tidak kontinu')],
            answer: 0,
            explain: L('The error is about $\\frac12f\'\'(a)(x-a)^2$: zero at $a$, flat there, and growing as the square of the distance.', 'Galatnya sekitar $\\frac12f\'\'(a)(x-a)^2$: nol di $a$, mendatar di sana, dan tumbuh seperti kuadrat jarak.'),
            hint: L('Look at the error curve in the widget: it is flat at $a$ and bends upward.', 'Lihat kurva galat pada widget: ia mendatar di $a$ dan melengkung ke atas.'),
          },
        },
      ],
    },

    /* --------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: linearization and differentials at a glance', 'Ringkasan: linearisasi dan diferensial sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Linearization:** $L(x)=f(a)+f'(a)(x-a)$, the tangent line at the center $a$; $f(x)\approx L(x)$ near $a$.
- **Accuracy:** best near $a$ and worse away from it; the error is about $\frac12f''(a)(x-a)^2$; choose a center where $f(a)$ and $f'(a)$ are easy.
- **Common ones at $0$:** $\sin x\approx x$, $\cos x\approx1$, $e^x\approx1+x$, $\ln(1+x)\approx x$, $(1+x)^k\approx1+kx$.
- **Differential:** $dy=f'(x)\,dx$, the change of the tangent line; $\Delta y=dy+\varepsilon\,dx$ with $\varepsilon\to0$.
- **Estimating:** $f(a+dx)\approx f(a)+f'(a)\,dx$; relative change $\frac{df}{f}$, percentage change $\frac{df}{f}\times100$.
- **Measuring errors:** for $y=cx^n$, $\frac{dy}{y}=n\frac{dx}{x}$; the estimate is for small changes.
- **Best linear approximation:** the only line with zero error at $a$ and error negligible next to $x-a$.
- **Code:** ´sp.diff(f, x).subs(x, a)´ for the slope, and $x_{\text{new}}=a-\frac{f(a)}{f'(a)}$ for Newton's method.`,
            T`- **Linearisasi:** $L(x)=f(a)+f'(a)(x-a)$, garis singgung di pusat $a$; $f(x)\approx L(x)$ di dekat $a$.
- **Ketelitian:** terbaik di dekat $a$ dan lebih buruk menjauh; galatnya sekitar $\frac12f''(a)(x-a)^2$; pilih pusat yang $f(a)$ dan $f'(a)$-nya mudah.
- **Yang umum di $0$:** $\sin x\approx x$, $\cos x\approx1$, $e^x\approx1+x$, $\ln(1+x)\approx x$, $(1+x)^k\approx1+kx$.
- **Diferensial:** $dy=f'(x)\,dx$, perubahan garis singgung; $\Delta y=dy+\varepsilon\,dx$ dengan $\varepsilon\to0$.
- **Memperkirakan:** $f(a+dx)\approx f(a)+f'(a)\,dx$; perubahan relatif $\frac{df}{f}$, perubahan persen $\frac{df}{f}\times100$.
- **Galat pengukuran:** untuk $y=cx^n$, $\frac{dy}{y}=n\frac{dx}{x}$; perkiraan ini untuk perubahan kecil.
- **Hampiran linear terbaik:** satu-satunya garis dengan galat nol di $a$ dan galat dapat diabaikan dibandingkan $x-a$.
- **Kode:** ´sp.diff(f, x).subs(x, a)´ untuk gradien, dan $x_{\text{baru}}=a-\frac{f(a)}{f'(a)}$ untuk metode Newton.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Linearization', 'Linearisasi'), definition: L('The linear function f of a plus f prime of a times x minus a, whose graph is the tangent line to the graph of f at a; it approximates f for x near a.', 'Fungsi linear f dari a ditambah f aksen dari a kali x dikurangi a, yang grafiknya adalah garis singgung grafik f di a; ia menghampiri f untuk x dekat a.') },
    { term: L('Standard linear approximation', 'Hampiran linear baku'), definition: L('The approximation of f of x by its linearization L of x at a, valid when x is close to the center a.', 'Hampiran f dari x oleh linearisasinya L dari x di a, berlaku ketika x dekat dengan pusat a.') },
    { term: L('Center of the approximation', 'Pusat hampiran'), definition: L('The point a at which a linearization is built; the approximation is exact there and loses accuracy as x moves away.', 'Titik a tempat linearisasi dibuat; hampiran itu tepat di sana dan kehilangan ketelitian saat x menjauh.') },
    { term: L('Differential', 'Diferensial'), definition: L('For y equal to f of x, the differential dy is f prime of x times dx, where dx is an independent variable; it is the change in the tangent line when x changes by dx.', 'Untuk y sama dengan f dari x, diferensial dy adalah f aksen dari x kali dx, dengan dx peubah bebas; ia adalah perubahan garis singgung ketika x berubah sebesar dx.') },
    { term: L('Relative and percentage change', 'Perubahan relatif dan persen'), definition: L('The change in a quantity divided by its original value, and the same multiplied by one hundred; for a differential estimate it is df divided by f of a.', 'Perubahan suatu besaran dibagi nilai awalnya, dan hasil yang sama dikalikan seratus; untuk perkiraan diferensial ia adalah df dibagi f dari a.') },
    { term: L('Approximation error', 'Galat hampiran'), definition: L('The difference between the true change and the differential estimate, equal to epsilon times delta x with epsilon tending to zero, so it is small even compared with delta x.', 'Selisih antara perubahan sebenarnya dan perkiraan diferensial, sama dengan epsilon kali delta x dengan epsilon menuju nol, sehingga ia kecil bahkan dibandingkan delta x.') },
  ],

  howTo: [
    {
      name: L('How to estimate a number with a linearization', 'Cara memperkirakan sebuah bilangan dengan linearisasi'),
      description: L('Pick a nearby point where the function and its derivative are easy, build the tangent line and read it at the number you need.', 'Pilih titik terdekat yang fungsi dan turunannya mudah, bentuk garis singgung, dan baca pada bilangan yang diperlukan.'),
      steps: [
        { name: L('Choose the function and the center', 'Pilih fungsi dan pusatnya'), text: L('Write the number as f of x for a simple f, and choose a nearby a, such as 8 for the cube root of 7.97, where f of a and f prime of a are easy.', 'Tulis bilangan itu sebagai f dari x untuk f yang sederhana, dan pilih a terdekat, seperti 8 untuk akar pangkat tiga 7,97, yang f dari a dan f aksen dari a-nya mudah.') },
        { name: L('Find f(a) and f\'(a)', 'Cari f(a) dan f\'(a)'), text: L('Compute the value and the slope at the center; for the cube root at 8 they are 2 and 1 over 12.', 'Hitung nilai dan gradien di pusat; untuk akar pangkat tiga di 8 keduanya 2 dan 1 per 12.') },
        { name: L('Write the linearization', 'Tulis linearisasinya'), text: L('Form L of x as f of a plus f prime of a times x minus a, or use the differential dy equal to f prime of a times dx.', 'Bentuk L dari x sebagai f dari a ditambah f aksen dari a kali x dikurangi a, atau pakai diferensial dy sama dengan f aksen dari a kali dx.') },
        { name: L('Put in x and judge the error', 'Masukkan x dan nilai galatnya'), text: L('Evaluate at the number you need, which gives 1.9975 for the cube root of 7.97, and remember that the error is small only when x is close to a.', 'Hitung pada bilangan yang diperlukan, yang memberi 1,9975 untuk akar pangkat tiga 7,97, dan ingat bahwa galat kecil hanya ketika x dekat a.') },
      ],
    },
    {
      name: L('How to find the error in a result from a measuring error', 'Cara mencari galat suatu hasil dari galat pengukuran'),
      description: L('Differentiate the formula, divide by the result and multiply the relative error of the measurement.', 'Turunkan rumusnya, bagi dengan hasilnya, dan kalikan galat relatif pengukuran.'),
      steps: [
        { name: L('Write the formula', 'Tulis rumusnya'), text: L('Express the result as a function of the measured quantity, such as the area equal to pi times the radius squared.', 'Nyatakan hasil sebagai fungsi besaran yang diukur, seperti luas sama dengan pi kali jari-jari kuadrat.') },
        { name: L('Find the relative change', 'Cari perubahan relatif'), text: L('For a power y equal to c times x to the n, dy over y equals n times dx over x.', 'Untuk pangkat y sama dengan c kali x pangkat n, dy per y sama dengan n kali dx per x.') },
        { name: L('Multiply the percentage', 'Kalikan persennya'), text: L('Multiply the percentage error of the measurement by n; a 2 percent error in the radius is a 4 percent error in the area.', 'Kalikan galat persen pengukuran dengan n; galat 2 persen pada jari-jari adalah galat 4 persen pada luas.') },
        { name: L('Check that the change is small', 'Periksa bahwa perubahannya kecil'), text: L('The rule is a first-order estimate, so for a large error compute the exact change as well.', 'Aturan ini perkiraan orde pertama, jadi untuk galat besar hitung juga perubahan eksaknya.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is linearization in calculus?', 'Apa itu linearisasi dalam kalkulus?'),
      a: L(
        'Linearization replaces a differentiable function near a point by its tangent line. The line, f of a plus f prime of a times x minus a, takes nearly the same values as the function close to the point and is much simpler to work with.',
        'Linearisasi mengganti fungsi terdiferensialkan di dekat suatu titik dengan garis singgungnya. Garis itu, f dari a ditambah f aksen dari a kali x dikurangi a, bernilai hampir sama dengan fungsi di dekat titik itu dan jauh lebih sederhana dipakai.',
      ),
    },
    {
      q: L('What is the formula for a linear approximation?', 'Apa rumus hampiran linear?'),
      a: L(
        'The linear approximation of f at a is L of x equal to f of a plus f prime of a times x minus a. It is accurate for x close to the center a, and the error grows roughly like the square of the distance from a.',
        'Hampiran linear f di a adalah L dari x sama dengan f dari a ditambah f aksen dari a kali x dikurangi a. Ia teliti untuk x dekat dengan pusat a, dan galatnya tumbuh kira-kira seperti kuadrat jarak dari a.',
      ),
    },
    {
      q: L('What is the difference between dy and delta y?', 'Apa beda dy dan delta y?'),
      a: L(
        'Delta y is the true change of the function when x changes by dx, while dy is f prime of x times dx, the change of the tangent line. They are close for small dx, and their difference is small even compared with dx.',
        'Delta y adalah perubahan sebenarnya fungsi ketika x berubah sebesar dx, sedangkan dy adalah f aksen dari x kali dx, perubahan garis singgung. Keduanya dekat untuk dx kecil, dan selisihnya kecil bahkan dibandingkan dx.',
      ),
    },
    {
      q: L('How do you estimate a value with differentials?', 'Bagaimana memperkirakan nilai dengan diferensial?'),
      a: L(
        'Choose a nearby point a where f of a and f prime of a are easy, then use f of a plus dx is about f of a plus f prime of a times dx. For the cube root of 7.97, a is 8 and dx is minus 0.03, giving 1.9975.',
        'Pilih titik terdekat a yang f dari a dan f aksen dari a-nya mudah, lalu pakai f dari a ditambah dx kira-kira f dari a ditambah f aksen dari a kali dx. Untuk akar pangkat tiga 7,97, a adalah 8 dan dx minus 0,03, memberi 1,9975.',
      ),
    },
    {
      q: L('How accurate is a linear approximation?', 'Seberapa teliti hampiran linear?'),
      a: L(
        'It is accurate near the center and loses accuracy away from it. The error is about one half of the second derivative times the squared distance from the center, so it is tiny close by and can be large far away.',
        'Ia teliti di dekat pusat dan kehilangan ketelitian menjauhinya. Galatnya sekitar setengah turunan kedua kali kuadrat jarak dari pusat, sehingga sangat kecil di dekatnya dan dapat besar di tempat yang jauh.',
      ),
    },
    {
      q: L('How do you find the percentage error in a result?', 'Bagaimana mencari galat persen pada suatu hasil?'),
      a: L(
        'For a result y equal to a constant times x to the n, the relative error of y is n times the relative error of x. A 2 percent error in a radius is about a 4 percent error in the area, since n is 2.',
        'Untuk hasil y sama dengan konstanta kali x pangkat n, galat relatif y adalah n kali galat relatif x. Galat 2 persen pada jari-jari menjadi sekitar galat 4 persen pada luas, karena n adalah 2.',
      ),
    },
    {
      q: L('What is the linearization of sin x at 0?', 'Berapa linearisasi sin x di 0?'),
      a: L(
        'It is x itself, because sin 0 is 0 and the slope cos 0 is 1. So for a small angle in radians, sin x is about x. The angle must be in radians; for degrees convert first.',
        'Hasilnya x itu sendiri, karena sin 0 adalah 0 dan gradien cos 0 adalah 1. Jadi untuk sudut kecil dalam radian, sin x kira-kira x. Sudutnya harus dalam radian; untuk derajat ubah dahulu.',
      ),
    },
    {
      q: L('How is Newton\'s method related to linearization?', 'Apa hubungan metode Newton dengan linearisasi?'),
      a: L(
        'Each step of Newton\'s method replaces the function by its linearization at the current guess and takes the zero of that line as the next guess: a minus f of a over f prime of a. The process repeats until the guesses settle.',
        'Setiap langkah metode Newton mengganti fungsi dengan linearisasinya di tebakan saat ini dan mengambil nol garis itu sebagai tebakan berikutnya: a dikurangi f dari a per f aksen dari a. Prosesnya diulang sampai tebakannya menetap.',
      ),
    },
  ],

  references: [
    { title: "Thomas' Calculus: Early Transcendentals in SI Units (15th ed.), Section 3.11: Linearization and Differentials", author: 'Joel Hass, Christopher Heil, Maurice D. Weir et al.', year: 2023, source: 'Pearson' },
    { title: 'Calculus (8th ed.), section 3.10: Linear Approximations and Differentials', author: 'James Stewart', year: 2015, source: 'Cengage Learning' },
    { title: 'Methodus incrementorum directa et inversa', author: 'Brook Taylor', year: 1715, source: 'London' },
    { title: "Résumé des leçons données à l'École royale polytechnique sur le calcul infinitésimal", author: 'Augustin-Louis Cauchy', year: 1823, source: 'Paris' },
  ],

  related: ['the-derivative-as-a-rate-of-change', 'related-rates', 'tangent-lines-and-derivative-at-a-point', 'extreme-values-on-closed-intervals'],
}
