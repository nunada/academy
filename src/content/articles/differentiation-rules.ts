import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './differentiation-rules.meta'

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
    T`**The differentiation rules let you find derivatives without taking a limit each time: a constant has derivative $0$, $\frac{d}{dx}x^n=nx^{n-1}$, constants pull out and sums split, $\frac{d}{dx}e^x=e^x$, and for products and quotients $(uv)'=u'v+uv'$ and $\left(\frac uv\right)'=\frac{u'v-uv'}{v^2}$.** Together they differentiate every polynomial and every rational function, and applying them twice or more gives second and higher-order derivatives.`,
    T`**Aturan turunan memungkinkan kamu mencari turunan tanpa mengambil limit setiap kali: konstanta bernilai turunan $0$, $\frac{d}{dx}x^n=nx^{n-1}$, konstanta dapat dikeluarkan dan jumlah dapat dipisah, $\frac{d}{dx}e^x=e^x$, dan untuk hasil kali dan hasil bagi $(uv)'=u'v+uv'$ serta $\left(\frac uv\right)'=\frac{u'v-uv'}{v^2}$.** Bersama-sama aturan itu menurunkan setiap polinomial dan setiap fungsi rasional, dan memakainya dua kali atau lebih menghasilkan turunan kedua dan turunan tingkat tinggi.`,
  ),

  keyPoints: [
    L(
      T`Constant rule: $\frac{d}{dx}c=0$. Power rule: $\frac{d}{dx}x^n=nx^{n-1}$ for every real $n$ (where the powers are defined): bring the exponent down and subtract $1$ from it.`,
      T`Aturan konstanta: $\frac{d}{dx}c=0$. Aturan pangkat: $\frac{d}{dx}x^n=nx^{n-1}$ untuk setiap bilangan real $n$ (di tempat pangkat itu terdefinisi): turunkan pangkatnya ke depan dan kurangi pangkatnya dengan $1$.`,
    ),
    L(
      T`Constant multiples and sums behave simply: $(cu)'=cu'$ and $(u\pm v)'=u'\pm v'$, so a polynomial is differentiated term by term.`,
      T`Kelipatan konstanta dan jumlah berperilaku sederhana: $(cu)'=cu'$ dan $(u\pm v)'=u'\pm v'$, sehingga polinomial diturunkan suku demi suku.`,
    ),
    L(
      T`The exponential function with base $e\approx2.718$ is its own derivative, $\frac{d}{dx}e^x=e^x$, because $e$ is the base for which the graph crosses the $y$-axis with slope $1$.`,
      T`Fungsi eksponensial berbasis $e\approx2{,}718$ adalah turunannya sendiri, $\frac{d}{dx}e^x=e^x$, karena $e$ adalah basis yang grafiknya memotong sumbu $y$ dengan gradien $1$.`,
    ),
    L(
      T`The derivative of a product is not the product of the derivatives: $(uv)'=u'v+uv'$. The derivative of a quotient is $\left(\frac uv\right)'=\frac{u'v-uv'}{v^2}$.`,
      T`Turunan hasil kali bukan hasil kali turunan: $(uv)'=u'v+uv'$. Turunan hasil bagi adalah $\left(\frac uv\right)'=\frac{u'v-uv'}{v^2}$.`,
    ),
    L(
      T`Simplify with algebra before you differentiate: expanding a product or cutting a quotient into powers often replaces a long quotient rule by a short power rule.`,
      T`Sederhanakan dengan aljabar sebelum menurunkan: menjabarkan hasil kali atau memotong hasil bagi menjadi pangkat sering menggantikan aturan hasil bagi yang panjang dengan aturan pangkat yang singkat.`,
    ),
    L(
      T`The second derivative $f''$ is the derivative of $f'$, the rate of change of the slope; a polynomial of degree $n$ has derivatives of every order, and the $n$-th one is the constant $n!$ times its leading coefficient.`,
      T`Turunan kedua $f''$ adalah turunan dari $f'$, laju perubahan gradien; polinomial berderajat $n$ memiliki turunan di setiap tingkat, dan yang ke-$n$ adalah konstanta $n!$ kali koefisien utamanya.`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------ constants and powers */
    {
      id: 'constants-and-powers',
      heading: L('How do you differentiate constants and powers of x?', 'Bagaimana menurunkan konstanta dan pangkat dari x?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The derivative of a constant is $0$, and the derivative of a power of $x$ is found by bringing the exponent down and lowering it by one: $\frac{d}{dx}x^n=nx^{n-1}$.** The [derivative functions](article:the-derivative-as-a-function#from-the-definition) found from the definition showed the pattern, $x^2\to2x$ and $x^3\to3x^2$; this section proves it.

**The constant rule.** If $f(x)=c$ then every difference quotient is $\frac{c-c}{h}=0$, so $\frac{d}{dx}c=0$. A horizontal line has slope $0$ everywhere.

**The power rule for positive whole numbers.** The identity
$$z^n-x^n=(z-x)\,S,$$
where
$$S=z^{n-1}+z^{n-2}x+\cdots+zx^{n-2}+x^{n-1}$$
has $n$ terms, can be checked by multiplying out the right side: everything cancels except $z^n-x^n$. By the second form of the definition, dividing by $z-x$ leaves $S$, and as $z\to x$ each of its $n$ terms tends to $x^{n-1}$:
$$\frac{d}{dx}x^n=\lim_{z\to x}S=nx^{n-1}.$$

**The same rule for every real exponent.** The formula is valid for all real $n$, not just positive whole numbers, wherever $x^n$ and $x^{n-1}$ are defined; the proof for the other kinds of exponent comes with the derivative of the logarithm, and here it is used as a tool. Subtract $1$ from the exponent and multiply by the old exponent:

- $\frac{d}{dx}x^3=3x^2$.
- $\frac{d}{dx}x^{2/3}=\frac23x^{-1/3}$, defined for $x\ne0$. At $0$ the function $x^{2/3}$ has a [cusp](article:tangent-lines-and-derivative-at-a-point#no-derivative), and the formula blows up there as it should.
- $\frac{d}{dx}x^{\sqrt2}=\sqrt2\,x^{\sqrt2-1}$.
- $\frac{d}{dx}\frac{1}{x^4}=\frac{d}{dx}x^{-4}=-4x^{-5}=-\frac{4}{x^5}$.
- $\frac{d}{dx}x^{-4/3}=-\frac43x^{-7/3}$.
- $\frac{d}{dx}x^{\pi+1}=(\pi+1)x^{\pi}$.

The [laws of exponents](article:exponents-and-radicals#zero-negative-fractional) are what let you write roots and reciprocals as powers: $\sqrt x=x^{1/2}$ and $\frac1{x^4}=x^{-4}$. That is the first move in most problems, and it turns $\sqrt x$ into $\frac12x^{-1/2}=\frac{1}{2\sqrt x}$, the formula that took a conjugate to get from the definition.

Try the tool below on any of these. It applies the rules one at a time, names each one, and checks the answer against a difference quotient.`,
            T`**Turunan konstanta adalah $0$, dan turunan pangkat dari $x$ diperoleh dengan menurunkan pangkatnya ke depan dan mengurangi pangkatnya satu: $\frac{d}{dx}x^n=nx^{n-1}$.** [Fungsi turunan](article:the-derivative-as-a-function#from-the-definition) yang dicari dari definisi memperlihatkan polanya, $x^2\to2x$ dan $x^3\to3x^2$; bagian ini membuktikannya.

**Aturan konstanta.** Jika $f(x)=c$ maka setiap hasil bagi selisih adalah $\frac{c-c}{h}=0$, sehingga $\frac{d}{dx}c=0$. Garis mendatar bergradien $0$ di mana-mana.

**Aturan pangkat untuk bilangan bulat positif.** Kesamaan
$$z^n-x^n=(z-x)\,S,$$
dengan
$$S=z^{n-1}+z^{n-2}x+\cdots+zx^{n-2}+x^{n-1}$$
yang memuat $n$ suku, dapat diperiksa dengan menjabarkan ruas kanan: semuanya habis kecuali $z^n-x^n$. Dengan bentuk kedua definisi, membagi dengan $z-x$ menyisakan $S$, dan saat $z\to x$ masing-masing dari $n$ sukunya menuju $x^{n-1}$:
$$\frac{d}{dx}x^n=\lim_{z\to x}S=nx^{n-1}.$$

**Aturan yang sama untuk setiap pangkat real.** Rumusnya berlaku untuk semua $n$ real, bukan hanya bilangan bulat positif, di tempat $x^n$ dan $x^{n-1}$ terdefinisi; pembuktian untuk jenis pangkat lainnya datang bersama turunan logaritma, dan di sini rumusnya dipakai sebagai alat. Kurangi pangkat dengan $1$ dan kalikan dengan pangkat lama:

- $\frac{d}{dx}x^3=3x^2$.
- $\frac{d}{dx}x^{2/3}=\frac23x^{-1/3}$, terdefinisi untuk $x\ne0$. Di $0$ fungsi $x^{2/3}$ memiliki [cusp](article:tangent-lines-and-derivative-at-a-point#no-derivative), dan rumusnya membesar di sana sebagaimana mestinya.
- $\frac{d}{dx}x^{\sqrt2}=\sqrt2\,x^{\sqrt2-1}$.
- $\frac{d}{dx}\frac{1}{x^4}=\frac{d}{dx}x^{-4}=-4x^{-5}=-\frac{4}{x^5}$.
- $\frac{d}{dx}x^{-4/3}=-\frac43x^{-7/3}$.
- $\frac{d}{dx}x^{\pi+1}=(\pi+1)x^{\pi}$.

[Hukum eksponen](article:exponents-and-radicals#zero-negative-fractional) memungkinkan kamu menulis akar dan kebalikan sebagai pangkat: $\sqrt x=x^{1/2}$ dan $\frac1{x^4}=x^{-4}$. Itu langkah pertama pada kebanyakan soal, dan ia mengubah $\sqrt x$ menjadi $\frac12x^{-1/2}=\frac{1}{2\sqrt x}$, rumus yang memerlukan sekawan untuk diperoleh dari definisi.

Coba alat di bawah pada salah satunya. Ia memakai aturan satu per satu, menyebut tiap aturan, dan mencocokkan jawabannya dengan hasil bagi selisih.`,
          ),
        },
        { kind: 'widget', name: 'diffsteps' },
      ],
    },

    /* ----------------------------------------------------------- multiples and sums */
    {
      id: 'multiples-and-sums',
      heading: L('How do the constant multiple, sum and difference rules work?', 'Bagaimana aturan kelipatan konstanta, jumlah, dan selisih bekerja?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A constant factor comes out of a derivative, and the derivative of a sum or difference is the sum or difference of the derivatives: $(cu)'=cu'$ and $(u\pm v)'=u'\pm v'$.** The proofs are one line each, because limits of constant multiples and sums behave the same way.

**Constant multiple.**
$$(cu)'=\lim_{h\to0}\frac{cu(x+h)-cu(x)}{h}$$
$$(cu)'=c\lim_{h\to0}\frac{u(x+h)-u(x)}{h},$$
which is $c\,u'$.
In pictures: multiplying every height of a graph by $3$ multiplies every slope by $3$, so $\frac{d}{dx}(3x^2)=3\cdot2x=6x$. With $c=-1$ the rule says that the derivative of $-u$ is $-u'$.

**Sum.**
The difference quotient of $u+v$ is the sum of the difference quotients of $u$ and of $v$, and the limit of a sum is the sum of the limits, so
$$(u+v)'=u'+v'.$$
Writing $u-v$ as $u+(-1)v$ gives the difference rule, and the sum rule extends to any finite number of terms.

**Polynomials.** Together with the power rule they differentiate any polynomial term by term. For $y=x^3+\frac43x^2-5x+1$,
$$y'=3x^2+\frac43\cdot2x-5\cdot1+0,$$
$$y'=3x^2+\frac83x-5.$$
Every polynomial is differentiable at every $x$.

**Where is the tangent horizontal?** A horizontal tangent has slope $0$, so solve $y'=0$. For $y=x^4-2x^2+2$ the derivative is $y'=4x^3-4x=4x(x-1)(x+1)$, which is zero at $x=0$, $1$ and $-1$. The horizontal tangents touch the curve at $(0,2)$, $(1,1)$ and $(-1,1)$: the [factoring](article:algebraic-expressions#factor) of the derivative does the work.

**The tangent line that results.** With a derivative formula the [tangent line](article:tangent-lines-and-derivative-at-a-point#tangent-line-equation) at any point is two substitutions away: for $y=x^3+\frac43x^2-5x+1$ at $x=1$ the point is $\left(1,-\frac53\right)$ and the slope is $3+\frac83-5=\frac23$.`,
            T`**Faktor konstanta keluar dari turunan, dan turunan jumlah atau selisih adalah jumlah atau selisih turunannya: $(cu)'=cu'$ dan $(u\pm v)'=u'\pm v'$.** Pembuktiannya satu baris masing-masing, karena limit kelipatan konstanta dan jumlah berperilaku sama.

**Kelipatan konstanta.**
$$(cu)'=\lim_{h\to0}\frac{cu(x+h)-cu(x)}{h}$$
$$(cu)'=c\lim_{h\to0}\frac{u(x+h)-u(x)}{h},$$
yaitu $c\,u'$.
Dalam gambar: mengalikan setiap tinggi grafik dengan $3$ mengalikan setiap gradien dengan $3$, sehingga $\frac{d}{dx}(3x^2)=3\cdot2x=6x$. Dengan $c=-1$ aturan ini menyatakan bahwa turunan $-u$ adalah $-u'$.

**Jumlah.**
Hasil bagi selisih $u+v$ adalah jumlah hasil bagi selisih $u$ dan $v$, dan limit suatu jumlah adalah jumlah limitnya, sehingga
$$(u+v)'=u'+v'.$$
Menulis $u-v$ sebagai $u+(-1)v$ memberi aturan selisih, dan aturan jumlah meluas ke sebanyak apa pun suku yang hingga.

**Polinomial.** Bersama aturan pangkat, aturan-aturan itu menurunkan polinomial mana pun suku demi suku. Untuk $y=x^3+\frac43x^2-5x+1$,
$$y'=3x^2+\frac43\cdot2x-5\cdot1+0,$$
$$y'=3x^2+\frac83x-5.$$
Setiap polinomial terdiferensialkan di setiap $x$.

**Di mana garis singgungnya mendatar?** Garis singgung mendatar bergradien $0$, jadi selesaikan $y'=0$. Untuk $y=x^4-2x^2+2$ turunannya $y'=4x^3-4x=4x(x-1)(x+1)$, yang bernilai nol di $x=0$, $1$, dan $-1$. Garis singgung mendatar menyentuh kurva di $(0,2)$, $(1,1)$, dan $(-1,1)$: [pemfaktoran](article:algebraic-expressions#factor) turunannya yang mengerjakan.

**Garis singgung yang dihasilkan.** Dengan rumus turunan, [garis singgung](article:tangent-lines-and-derivative-at-a-point#tangent-line-equation) di titik mana pun hanya dua substitusi jauhnya: untuk $y=x^3+\frac43x^2-5x+1$ di $x=1$ titiknya $\left(1,-\frac53\right)$ dan gradiennya $3+\frac83-5=\frac23$.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------- exponential */
    {
      id: 'exponential',
      heading: L('What is the derivative of e to the x?', 'Berapa turunan e pangkat x?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The derivative of $e^x$ is $e^x$: the natural exponential function is its own derivative, and $e\approx2.71828$ is the one base for which that is true.** Here is why. Apply the definition to $f(x)=a^x$ with $a>0$:
$$\frac{a^{x+h}-a^x}{h}=a^x\cdot\frac{a^h-1}{h}.$$
Letting $h\to0$ gives
$$\frac{d}{dx}a^x=a^x\cdot L,$$
where
$$L=\lim_{h\to0}\frac{a^h-1}{h},$$
and $a^x$ was taken out because it does not depend on $h$. So the derivative of $a^x$ is a constant multiple $L$ of $a^x$ itself, and $L$ is a number that depends only on $a$. Putting $x=0$ shows what it is: $L=f'(0)$, the slope of the graph of $a^x$ where it crosses the $y$-axis.

That slope can be estimated from the difference quotient. With $h=0.0001$, $L\approx0.69$ for $a=2$, about $0.92$ for $a=2.5$ and about $1.10$ for $a=3$. It grows with the base, so for some base between $2.5$ and $3$ it equals exactly $1$. That base is $e$, the [number e](article:irrational-numbers#pi-e-transcendental), and with it $L=1$ and
$$\frac{d}{dx}e^x=e^x\cdot1=e^x.$$
(For a general base the value turns out to be $L=\ln a$; that is shown in the study of logarithms, and it is not needed here.) By the constant multiple rule, $\frac{d}{dx}\big(c\,e^x\big)=c\,e^x$, and the only functions equal to their own derivatives are these constant multiples.

Move the base in the tool below and watch $L$ pass through $1$.

**A tangent through the origin.** Which line through $(0,0)$ is tangent to $y=e^x$? A line $y=mx$ touching the graph at $(a,e^a)$ has slope $m=\frac{e^a-0}{a-0}$, and the slope of the curve there is $e^a$, so $e^a=\frac{e^a}{a}$, which gives $a=1$ and $m=e$. The line is $y=ex$, touching the curve at $(1,e)$.`,
            T`**Turunan $e^x$ adalah $e^x$: fungsi eksponensial natural adalah turunannya sendiri, dan $e\approx2{,}71828$ adalah satu-satunya basis yang memenuhi hal itu.** Inilah alasannya. Terapkan definisi pada $f(x)=a^x$ dengan $a>0$:
$$\frac{a^{x+h}-a^x}{h}=a^x\cdot\frac{a^h-1}{h}.$$
Membiarkan $h\to0$ memberi
$$\frac{d}{dx}a^x=a^x\cdot L,$$
dengan
$$L=\lim_{h\to0}\frac{a^h-1}{h},$$
dan $a^x$ dikeluarkan karena tidak bergantung pada $h$. Jadi turunan $a^x$ adalah kelipatan konstan $L$ dari $a^x$ sendiri, dan $L$ adalah bilangan yang hanya bergantung pada $a$. Memasukkan $x=0$ memperlihatkan apa itu: $L=f'(0)$, gradien grafik $a^x$ di tempat ia memotong sumbu $y$.

Gradien itu dapat ditaksir dari hasil bagi selisih. Dengan $h=0{,}0001$, $L\approx0{,}69$ untuk $a=2$, sekitar $0{,}92$ untuk $a=2{,}5$, dan sekitar $1{,}10$ untuk $a=3$. Ia membesar bersama basisnya, sehingga untuk suatu basis di antara $2{,}5$ dan $3$ nilainya tepat $1$. Basis itu adalah $e$, [bilangan e](article:irrational-numbers#pi-e-transcendental), dan dengannya $L=1$ dan
$$\frac{d}{dx}e^x=e^x\cdot1=e^x.$$
(Untuk basis umum nilainya ternyata $L=\ln a$; itu ditunjukkan dalam pembahasan logaritma, dan tidak diperlukan di sini.) Menurut aturan kelipatan konstanta, $\frac{d}{dx}\big(c\,e^x\big)=c\,e^x$, dan satu-satunya fungsi yang sama dengan turunannya sendiri adalah kelipatan konstan ini.

Geser basis pada alat di bawah dan perhatikan $L$ melewati $1$.

**Garis singgung melalui titik asal.** Garis mana yang melalui $(0,0)$ dan menyinggung $y=e^x$? Garis $y=mx$ yang menyentuh grafik di $(a,e^a)$ bergradien $m=\frac{e^a-0}{a-0}$, dan gradien kurva di sana adalah $e^a$, sehingga $e^a=\frac{e^a}{a}$, yang memberi $a=1$ dan $m=e$. Garisnya $y=ex$, menyentuh kurva di $(1,e)$.`,
          ),
        },
        { kind: 'widget', name: 'expbase' },
        {
          kind: 'figure',
          figure: {
            dim: 2,
            ticks: true,
            xSpan: [-1.5, 3.5],
            ySpan: [-1, 8],
            aspect: 0.6,
            items: [
              { t: 'curve', f: 'exp(x)', color: 'a' },
              { t: 'curve', f: 'e*x', color: 'result' },
              { t: 'point', at: [1, 2.718281828], label: '(1, e)', color: 'result' },
            ],
            caption: L(
              'The line y = ex through the origin is tangent to y = eˣ at the point (1, e): the slope of eˣ at x = 1 is e.',
              'Garis y = ex melalui titik asal menyinggung y = eˣ di titik (1, e): gradien eˣ di x = 1 adalah e.',
            ),
          },
        },
      ],
    },

    /* ----------------------------------------------------------------- product rule */
    {
      id: 'product-rule',
      heading: L('How does the product rule work?', 'Bagaimana aturan hasil kali bekerja?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The derivative of a product is the first function times the derivative of the second, plus the derivative of the first times the second: $(uv)'=u\,v'+u'\,v$.** It is *not* the product of the derivatives. A quick test: with $u=v=x$ the product is $x^2$ with derivative $2x$, while $u'v'=1\cdot1=1$. The rule gives $x\cdot1+1\cdot x=2x$, as it should.

**Why it is true.** Let $\Delta u$, $\Delta v$ and $\Delta(uv)$ be the changes in $u$, $v$ and $uv$ when $x$ grows by $h$. Adding and subtracting $u(x+h)v(x)$ in the numerator of the difference quotient shows that $\Delta(uv)=u(x+h)\,\Delta v+v(x)\,\Delta u$, so
$$\frac{\Delta(uv)}{h}=u(x+h)\,\frac{\Delta v}{h}+v(x)\,\frac{\Delta u}{h}.$$
As $h\to0$ the two fractions tend to $v'(x)$ and $u'(x)$, and $u(x+h)\to u(x)$ because a differentiable function is [continuous](article:tangent-lines-and-derivative-at-a-point#no-derivative). So the limit is $u(x)v'(x)+v(x)u'(x)$.

**A picture.** Let $u$ and $v$ be the sides of a rectangle of area $uv$. When $x$ grows by $h$ the sides grow by $\Delta u$ and $\Delta v$, and the new area exceeds the old by two strips and a small corner:
$$\Delta(uv)=v\,\Delta u+u\,\Delta v+\Delta u\,\Delta v.$$
Divide by $h$: the strips give $v\frac{\Delta u}{h}$ and $u\frac{\Delta v}{h}$, which tend to $vu'$ and $uv'$, and the corner gives $\frac{\Delta u\,\Delta v}{h}=\Delta u\cdot\frac{\Delta v}{h}\to0\cdot v'=0$, because the corner is a product of two small quantities. That is the product rule, and the tool below lets you shrink the step and watch the corner become negligible.

**Examples.**

- For $y=(x^2+1)(x^3-3x)$, with $u=x^2+1$ and $v=x^3-3x$: $y'=2x(x^3-3x)+(x^2+1)(3x^2-3)=5x^4-6x^2-3$. As a check, [expanding the brackets](article:algebraic-expressions#expand) first gives $y=x^5-2x^3-3x$ and the power rule gives the same $y'=5x^4-6x^2-3$.
- For $y=x^2e^x$: $y'=2x\,e^x+x^2e^x=(x^2+2x)e^x$.

When one factor is a constant the product rule reduces to the constant multiple rule, since the constant has derivative $0$. For three factors, differentiate one at a time and add: $(uvw)'=u'vw+uv'w+uvw'$.`,
            T`**Turunan hasil kali adalah fungsi pertama kali turunan fungsi kedua, ditambah turunan fungsi pertama kali fungsi kedua: $(uv)'=u\,v'+u'\,v$.** Ia *bukan* hasil kali turunan. Uji cepat: dengan $u=v=x$ hasil kalinya $x^2$ dengan turunan $2x$, sedangkan $u'v'=1\cdot1=1$. Aturannya memberi $x\cdot1+1\cdot x=2x$, sebagaimana mestinya.

**Mengapa benar.** Misalkan $\Delta u$, $\Delta v$, dan $\Delta(uv)$ adalah perubahan $u$, $v$, dan $uv$ saat $x$ bertambah $h$. Menambah dan mengurangi $u(x+h)v(x)$ pada pembilang hasil bagi selisih memperlihatkan bahwa $\Delta(uv)=u(x+h)\,\Delta v+v(x)\,\Delta u$, sehingga
$$\frac{\Delta(uv)}{h}=u(x+h)\,\frac{\Delta v}{h}+v(x)\,\frac{\Delta u}{h}.$$
Saat $h\to0$ kedua pecahan menuju $v'(x)$ dan $u'(x)$, dan $u(x+h)\to u(x)$ karena fungsi yang terdiferensialkan [kontinu](article:tangent-lines-and-derivative-at-a-point#no-derivative). Jadi limitnya $u(x)v'(x)+v(x)u'(x)$.

**Gambar.** Misalkan $u$ dan $v$ adalah sisi-sisi persegi panjang berluas $uv$. Saat $x$ bertambah $h$ sisi-sisinya bertambah $\Delta u$ dan $\Delta v$, dan luas baru melebihi yang lama oleh dua pita dan satu pojok kecil:
$$\Delta(uv)=v\,\Delta u+u\,\Delta v+\Delta u\,\Delta v.$$
Bagi dengan $h$: pita-pita itu memberi $v\frac{\Delta u}{h}$ dan $u\frac{\Delta v}{h}$, yang menuju $vu'$ dan $uv'$, dan pojoknya memberi $\frac{\Delta u\,\Delta v}{h}=\Delta u\cdot\frac{\Delta v}{h}\to0\cdot v'=0$, karena pojok adalah hasil kali dua besaran kecil. Itulah aturan hasil kali, dan alat di bawah memungkinkan kamu mengecilkan langkah dan melihat pojok menjadi dapat diabaikan.

**Contoh.**

- Untuk $y=(x^2+1)(x^3-3x)$, dengan $u=x^2+1$ dan $v=x^3-3x$: $y'=2x(x^3-3x)+(x^2+1)(3x^2-3)=5x^4-6x^2-3$. Sebagai pemeriksaan, [menjabarkan kurung](article:algebraic-expressions#expand) lebih dulu memberi $y=x^5-2x^3-3x$ dan aturan pangkat memberi $y'=5x^4-6x^2-3$ yang sama.
- Untuk $y=x^2e^x$: $y'=2x\,e^x+x^2e^x=(x^2+2x)e^x$.

Bila satu faktor adalah konstanta, aturan hasil kali menjadi aturan kelipatan konstanta, karena konstanta bernilai turunan $0$. Untuk tiga faktor, turunkan satu per satu dan jumlahkan: $(uvw)'=u'vw+uv'w+uvw'$.`,
          ),
        },
        { kind: 'widget', name: 'prodbox' },
      ],
    },

    /* --------------------------------------------------------------- quotient rule */
    {
      id: 'quotient-rule',
      heading: L('How does the quotient rule work?', 'Bagaimana aturan hasil bagi bekerja?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The derivative of a quotient is the bottom times the derivative of the top, minus the top times the derivative of the bottom, all over the bottom squared: $\left(\frac uv\right)'=\frac{u'v-uv'}{v^2}$, wherever $v\ne0$.** The order of the two terms in the numerator matters, because it is a difference. A way to remember it: "low d-high minus high d-low, over low-low".

**Why it is true.** Put $\frac{u(x+h)}{v(x+h)}-\frac{u(x)}{v(x)}$ over a common denominator and subtract and add $u(x)v(x)$ in the numerator. With $\Delta u$ and $\Delta v$ as before and $\Delta(u/v)$ the change in the quotient, dividing by $h$ gives
$$\frac{\Delta(u/v)}{h}=\frac{v(x)\frac{\Delta u}{h}-u(x)\frac{\Delta v}{h}}{v(x)\,v(x+h)}.$$
Letting $h\to0$ turns the two fractions into $u'$ and $v'$ and $v(x+h)$ into $v(x)$, which is the rule.

**Examples.**

- For $y=\frac{t^2-1}{t^3+1}$: $y'=\frac{2t(t^3+1)-(t^2-1)(3t^2)}{(t^3+1)^2}=\frac{-t^4+3t^2+2t}{(t^3+1)^2}$.
- For $y=e^{-x}=\frac{1}{e^x}$: $y'=\frac{0\cdot e^x-1\cdot e^x}{(e^x)^2}=-\frac{1}{e^x}=-e^{-x}$.

**The reciprocal rule and negative powers.** With $u=1$ the rule gives $\left(\frac1v\right)'=-\frac{v'}{v^2}$. Applied to $v=x^m$ it recovers the power rule for negative exponents: $\frac{d}{dx}x^{-m}=-\frac{mx^{m-1}}{x^{2m}}=-m\,x^{-m-1}$.

**Simplify first when you can.** The quotient rule is the heaviest tool, and algebra is often lighter. For $y=\frac{(x-1)(x^2-2x)}{x^4}$ a quotient rule would give a long expression with many terms. Instead expand the numerator and divide by $x^4$:
$$y=\frac{x^3-3x^2+2x}{x^4}=x^{-1}-3x^{-2}+2x^{-3},$$
and then the power, multiple and sum rules give
$$y'=-x^{-2}+6x^{-3}-6x^{-4}.$$
In the same way $\frac{x^3+2x}{x}=x^2+2$ has derivative $2x$ with no quotient rule at all.

The tool above accepts quotients, so you can compare what it does with your own steps. It refuses things that need the chain rule, such as $(x^2+1)^3$, which come later.`,
            T`**Turunan hasil bagi adalah penyebut kali turunan pembilang, dikurangi pembilang kali turunan penyebut, seluruhnya dibagi kuadrat penyebut: $\left(\frac uv\right)'=\frac{u'v-uv'}{v^2}$, di mana pun $v\ne0$.** Urutan kedua suku di pembilang penting, karena ia selisih. Cara mengingatnya: "bawah d-atas dikurang atas d-bawah, dibagi bawah-bawah".

**Mengapa benar.** Samakan penyebut $\frac{u(x+h)}{v(x+h)}-\frac{u(x)}{v(x)}$, lalu kurangkan dan tambahkan $u(x)v(x)$ pada pembilang. Dengan $\Delta u$ dan $\Delta v$ seperti tadi dan $\Delta(u/v)$ perubahan hasil bagi, membagi dengan $h$ memberi
$$\frac{\Delta(u/v)}{h}=\frac{v(x)\frac{\Delta u}{h}-u(x)\frac{\Delta v}{h}}{v(x)\,v(x+h)}.$$
Membiarkan $h\to0$ mengubah kedua pecahan menjadi $u'$ dan $v'$ dan $v(x+h)$ menjadi $v(x)$, yaitu aturannya.

**Contoh.**

- Untuk $y=\frac{t^2-1}{t^3+1}$: $y'=\frac{2t(t^3+1)-(t^2-1)(3t^2)}{(t^3+1)^2}=\frac{-t^4+3t^2+2t}{(t^3+1)^2}$.
- Untuk $y=e^{-x}=\frac{1}{e^x}$: $y'=\frac{0\cdot e^x-1\cdot e^x}{(e^x)^2}=-\frac{1}{e^x}=-e^{-x}$.

**Aturan kebalikan dan pangkat negatif.** Dengan $u=1$ aturan ini memberi $\left(\frac1v\right)'=-\frac{v'}{v^2}$. Dikenakan pada $v=x^m$ ia memulihkan aturan pangkat untuk pangkat negatif: $\frac{d}{dx}x^{-m}=-\frac{mx^{m-1}}{x^{2m}}=-m\,x^{-m-1}$.

**Sederhanakan dulu bila bisa.** Aturan hasil bagi adalah alat yang paling berat, dan aljabar sering lebih ringan. Untuk $y=\frac{(x-1)(x^2-2x)}{x^4}$ aturan hasil bagi akan memberi ekspresi panjang dengan banyak suku. Sebagai gantinya jabarkan pembilang dan bagi dengan $x^4$:
$$y=\frac{x^3-3x^2+2x}{x^4}=x^{-1}-3x^{-2}+2x^{-3},$$
lalu aturan pangkat, kelipatan, dan jumlah memberi
$$y'=-x^{-2}+6x^{-3}-6x^{-4}.$$
Dengan cara yang sama $\frac{x^3+2x}{x}=x^2+2$ memiliki turunan $2x$ tanpa aturan hasil bagi sama sekali.

Alat di atas menerima hasil bagi, sehingga kamu dapat membandingkan apa yang dikerjakannya dengan langkahmu sendiri. Ia menolak hal yang memerlukan aturan rantai, seperti $(x^2+1)^3$, yang dibahas kemudian.`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------- higher order */
    {
      id: 'higher-order',
      heading: L('What are second and higher-order derivatives?', 'Apa itu turunan kedua dan turunan tingkat tinggi?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The second derivative of $f$ is the derivative of its derivative, $f''=(f')'$, and the process can be repeated to give the third, fourth and every higher-order derivative.** If $f'$ is a function it can be differentiated again, so with a function like $y=x^6$:
$$y'=6x^5,\qquad y''=30x^4,\qquad y'''=120x^3.$$

**Notation.** For $y=f(x)$ the second derivative is written $f''(x)$, $y''$, $\frac{d^2y}{dx^2}$ or $D^2f(x)$. Read $\frac{d^2y}{dx^2}$ as "$d$ squared $y$ by $dx$ squared", and $y'''$ as "$y$ triple prime". The $n$-th derivative is $y^{(n)}=\frac{d^ny}{dx^n}=D^ny$ for any positive whole number $n$: the symbol $D^2$ means differentiating twice.

**What it means.** The first derivative is the slope of the graph, so the second derivative is the rate of change of the slope: where $f''>0$ the slope is increasing and the graph bends upward, and where $f''<0$ it bends downward. (The [graph of the derivative](article:the-derivative-as-a-function#graphing-the-derivative) already showed this.)

**Polynomials.** Each derivative lowers the degree by one, so the derivatives of $y=x^3-3x^2+2$ are
$$y'=3x^2-6x,\quad y''=6x-6,$$
$$y'''=6,\quad y^{(4)}=0,$$
and every later one is $0$. A polynomial has derivatives of all orders. For a polynomial of degree $n$ with leading coefficient $a_n$ the $n$-th derivative is the constant $n!\,a_n$ (for $x^n$ it is $n!=n(n-1)\cdots2\cdot1$) and the next one is $0$.

The tool above shows derivatives up to the fourth for any function it accepts. Try $x^5$ and watch the powers fall to a constant.`,
            T`**Turunan kedua $f$ adalah turunan dari turunannya, $f''=(f')'$, dan prosesnya dapat diulang untuk memberi turunan ketiga, keempat, dan setiap turunan tingkat tinggi.** Jika $f'$ adalah fungsi, ia dapat diturunkan lagi, sehingga dengan fungsi seperti $y=x^6$:
$$y'=6x^5,\qquad y''=30x^4,\qquad y'''=120x^3.$$

**Notasi.** Untuk $y=f(x)$ turunan kedua ditulis $f''(x)$, $y''$, $\frac{d^2y}{dx^2}$, atau $D^2f(x)$. Bacalah $\frac{d^2y}{dx^2}$ sebagai "$d$ kuadrat $y$ per $dx$ kuadrat", dan $y'''$ sebagai "$y$ aksen tiga". Turunan ke-$n$ adalah $y^{(n)}=\frac{d^ny}{dx^n}=D^ny$ untuk bilangan bulat positif $n$ mana pun: lambang $D^2$ berarti menurunkan dua kali.

**Artinya.** Turunan pertama adalah gradien grafik, sehingga turunan kedua adalah laju perubahan gradien: di tempat $f''>0$ gradiennya bertambah dan grafik melengkung ke atas, dan di tempat $f''<0$ ia melengkung ke bawah. ([Grafik turunan](article:the-derivative-as-a-function#graphing-the-derivative) sudah memperlihatkannya.)

**Polinomial.** Setiap turunan menurunkan derajat satu, sehingga turunan-turunan $y=x^3-3x^2+2$ adalah
$$y'=3x^2-6x,\quad y''=6x-6,$$
$$y'''=6,\quad y^{(4)}=0,$$
dan setiap turunan sesudahnya $0$. Polinomial memiliki turunan di semua tingkat. Untuk polinomial berderajat $n$ dengan koefisien utama $a_n$ turunan ke-$n$ adalah konstanta $n!\,a_n$ (untuk $x^n$ ia $n!=n(n-1)\cdots2\cdot1$) dan turunan berikutnya $0$.

Alat di atas memperlihatkan turunan sampai yang keempat untuk fungsi apa pun yang diterimanya. Coba $x^5$ dan perhatikan pangkat-pangkat turun sampai sebuah konstanta.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------- in code */
    {
      id: 'rules-in-code',
      heading: L('How do you apply the differentiation rules in code?', 'Bagaimana menerapkan aturan turunan dalam kode?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A computer algebra system knows the rules: give SymPy a formula and ´diff´ applies the power, product and quotient rules for you, higher orders included.** Ask it about two undefined functions $u$ and $v$ and it returns the rules themselves, which is a good way to see that the product and quotient rules are formulas, not tricks. It leaves the answer in the shape the rules produce, so ´expand´, ´factor´ or ´simplify´ puts it in the form you would write: for $(x^2+1)(x^3-3x)$ the rule gives $2x(x^3-3x)+(x^2+1)(3x^2-3)$, and ´expand´ turns that into $5x^4-6x^2-3$, the answer found above.`,
            T`**Sistem aljabar komputer mengenal aturan-aturannya: berikan rumus kepada SymPy dan ´diff´ memakai aturan pangkat, hasil kali, dan hasil bagi untukmu, termasuk tingkat yang lebih tinggi.** Tanyakan dua fungsi tak terdefinisi $u$ dan $v$ dan ia mengembalikan aturan-aturan itu sendiri, cara yang baik untuk melihat bahwa aturan hasil kali dan hasil bagi adalah rumus, bukan akal-akalan. Ia membiarkan jawabannya dalam bentuk yang dihasilkan aturan, sehingga ´expand´, ´factor´, atau ´simplify´ mengubahnya menjadi bentuk yang kamu tulis: untuk $(x^2+1)(x^3-3x)$ aturannya memberi $2x(x^3-3x)+(x^2+1)(3x^2-3)$, dan ´expand´ mengubahnya menjadi $5x^4-6x^2-3$, jawaban yang ditemukan di atas.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: the rules in SymPy', 'Python: aturan-aturan dalam SymPy'),
          code: `import sympy as sp

x = sp.symbols('x')
u, v = sp.Function('u'), sp.Function('v')
print(sp.diff(u(x) * v(x), x))   # u(x)*Derivative(v(x), x) + v(x)*Derivative(u(x), x)
print(sp.diff(u(x) / v(x), x))   # -u(x)*Derivative(v(x), x)/v(x)**2 + Derivative(u(x), x)/v(x)

f = (x**2 + 1) * (x**3 - 3*x)
print(sp.diff(f, x))             # 2*x*(x**3 - 3*x) + (x**2 + 1)*(3*x**2 - 3)
print(sp.expand(sp.diff(f, x)))  # 5*x**4 - 6*x**2 - 3

print(sp.factor(sp.diff(x**2 * sp.exp(x), x)))               # x*(x + 2)*exp(x)
print(sp.simplify(sp.diff((x**2 - 1) / (x**3 + 1), x)))      # x*(2*x**3 - 3*x*(x**2 - 1) + 2)/(x**3 + 1)**2
print(sp.diff(x**sp.pi, x))                                  # pi*x**pi/x
print(sp.diff(x**3 - 3*x**2 + 2, x, 3), sp.diff(x**3 - 3*x**2 + 2, x, 4))   # 6 0`,
        },
        {
          kind: 'text',
          text: L(
            T`**A rule is only as good as its use, so check an answer numerically.** Compare the formula you found with a difference quotient at a point: if $f'(x)$ is right, the central difference $\frac{f(x+h)-f(x-h)}{2h}$ with $h$ near $10^{-5}$ agrees with it to many digits, as in the [numerical derivative](article:the-derivative-as-a-function#derivative-functions-in-code) of the previous article. The tool above does exactly that check for you.`,
            T`**Aturan hanya sebaik pemakaiannya, jadi periksa jawaban secara numerik.** Bandingkan rumus yang kamu temukan dengan hasil bagi selisih di suatu titik: jika $f'(x)$ benar, selisih terpusat $\frac{f(x+h)-f(x-h)}{2h}$ dengan $h$ dekat $10^{-5}$ cocok dengannya sampai banyak angka, seperti pada [turunan numerik](article:the-derivative-as-a-function#derivative-functions-in-code) di artikel sebelumnya. Alat di atas melakukan pemeriksaan itu untukmu.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where do the differentiation rules come from?', 'Dari mana asal aturan turunan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The rules were found in the seventeenth century by the people who invented calculus, and the number $e$ came from a question about money.**

- **Newton.** In his work on fluxions of the 1660s and 1670s, Isaac Newton gave rules for the rate of change of sums, products, quotients and powers, including fractional powers through his binomial series.
- **Leibniz.** Gottfried Leibniz worked out $d(xy)=x\,dy+y\,dx$ in manuscripts of 1675 (he first guessed that the product of differentials was the differential of the product, and then corrected himself) and stated the rules for sums, products, quotients and powers in his 1684 paper that introduced the differential calculus. His notation $d^2y$ gave the second derivative its name.
- **The number $e$.** Jacob Bernoulli met it in 1683 while studying compound interest, as the limit of $\left(1+\frac1n\right)^n$. Leonhard Euler began to write it as $e$ around 1727 and, in his *Introductio in analysin infinitorum* (1748), made $e^x$ the central exponential function; the fact that it equals its own derivative is why it is called *natural*.
- **Notation.** Lagrange wrote $f'$, $f''$ and $f'''$ for successive derivatives, and Louis Arbogast introduced the operator $D$ and its powers $D^n$ in 1800.`,
            T`**Aturan-aturan itu ditemukan pada abad ketujuh belas oleh orang-orang yang menemukan kalkulus, dan bilangan $e$ berasal dari pertanyaan tentang uang.**

- **Newton.** Dalam karyanya tentang fluksi pada 1660-an dan 1670-an, Isaac Newton memberi aturan untuk laju perubahan jumlah, hasil kali, hasil bagi, dan pangkat, termasuk pangkat pecahan melalui deret binomialnya.
- **Leibniz.** Gottfried Leibniz menurunkan $d(xy)=x\,dy+y\,dx$ dalam naskah tahun 1675 (ia mula-mula menduga bahwa hasil kali diferensial adalah diferensial hasil kali, lalu mengoreksi dirinya) dan menyatakan aturan jumlah, hasil kali, hasil bagi, dan pangkat dalam makalahnya tahun 1684 yang memperkenalkan kalkulus diferensial. Notasinya $d^2y$ memberi turunan kedua namanya.
- **Bilangan $e$.** Jacob Bernoulli menjumpainya pada 1683 saat mempelajari bunga majemuk, sebagai limit $\left(1+\frac1n\right)^n$. Leonhard Euler mulai menuliskannya sebagai $e$ sekitar 1727 dan, dalam *Introductio in analysin infinitorum* (1748), menjadikan $e^x$ fungsi eksponensial utama; fakta bahwa ia sama dengan turunannya sendiri adalah alasan ia disebut *natural*.
- **Notasi.** Lagrange menulis $f'$, $f''$, dan $f'''$ untuk turunan berurutan, dan Louis Arbogast memperkenalkan operator $D$ dan pangkatnya $D^n$ pada 1800.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What mistakes do people make with the differentiation rules?', 'Kesalahan apa yang sering terjadi pada aturan turunan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with the differentiation rules are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ $(uv)'=u'v'$ | $(uv)'=u'v+uv'$. Test with $u=v=x$: the product $x^2$ has derivative $2x$, not $1$. |
| ❌ $\left(\frac uv\right)'=\frac{u'}{v'}$ | $\left(\frac uv\right)'=\frac{u'v-uv'}{v^2}$, with the numerator in that order and the square below. |
| ❌ $\frac{d}{dx}x^n=nx^n$ | The exponent drops by one: $\frac{d}{dx}x^n=nx^{n-1}$. So $\frac{d}{dx}x^5=5x^4$. |
| ❌ $\frac{d}{dx}x^{-2}=-2x^{-1}$ | Subtract $1$ from $-2$ to get $-3$: $\frac{d}{dx}x^{-2}=-2x^{-3}$. |
| ❌ $\frac{d}{dx}e^x=x\,e^{x-1}$ | That is the power rule applied to the wrong thing. $e^x$ has a constant base and a variable exponent, and $\frac{d}{dx}e^x=e^x$. |
| ❌ $\frac{d}{dx}\pi^2=2\pi$ | $\pi^2$ is a constant, so its derivative is $0$; the power rule is for powers of the variable. |
| ❌ $\frac{d}{dx}\left(3x^2+5\right)=6x+5$ | The constant $5$ has derivative $0$, so $\frac{d}{dx}\left(3x^2+5\right)=6x$. |
| ❌ For $y=x^2$, the third derivative is $2$ | $y'=2x$, $y''=2$, $y'''=0$: the derivative of a constant is $0$. |
| ❌ $y''$ means $(y')^2$ | $y''$ is the derivative of $y'$, not its square. For $y=x^3$, $y''=6x$ but $(y')^2=9x^4$. |`,
            T`**Kesalahan paling umum pada aturan turunan adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ $(uv)'=u'v'$ | $(uv)'=u'v+uv'$. Uji dengan $u=v=x$: hasil kali $x^2$ memiliki turunan $2x$, bukan $1$. |
| ❌ $\left(\frac uv\right)'=\frac{u'}{v'}$ | $\left(\frac uv\right)'=\frac{u'v-uv'}{v^2}$, dengan pembilang dalam urutan itu dan kuadrat di bawah. |
| ❌ $\frac{d}{dx}x^n=nx^n$ | Pangkatnya turun satu: $\frac{d}{dx}x^n=nx^{n-1}$. Jadi $\frac{d}{dx}x^5=5x^4$. |
| ❌ $\frac{d}{dx}x^{-2}=-2x^{-1}$ | Kurangkan $1$ dari $-2$ menjadi $-3$: $\frac{d}{dx}x^{-2}=-2x^{-3}$. |
| ❌ $\frac{d}{dx}e^x=x\,e^{x-1}$ | Itu aturan pangkat yang dikenakan pada hal yang salah. $e^x$ memiliki basis konstan dan pangkat peubah, dan $\frac{d}{dx}e^x=e^x$. |
| ❌ $\frac{d}{dx}\pi^2=2\pi$ | $\pi^2$ adalah konstanta, sehingga turunannya $0$; aturan pangkat untuk pangkat dari peubah. |
| ❌ $\frac{d}{dx}\left(3x^2+5\right)=6x+5$ | Konstanta $5$ bernilai turunan $0$, sehingga $\frac{d}{dx}\left(3x^2+5\right)=6x$. |
| ❌ Untuk $y=x^2$, turunan ketiganya $2$ | $y'=2x$, $y''=2$, $y'''=0$: turunan konstanta adalah $0$. |
| ❌ $y''$ berarti $(y')^2$ | $y''$ adalah turunan $y'$, bukan kuadratnya. Untuk $y=x^3$, $y''=6x$ tetapi $(y')^2=9x^4$. |`,
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
              L('The derivative of a constant function is $0$.', 'Turunan fungsi konstan adalah $0$.'),
              L('$\\frac{d}{dx}x^n=nx^{n-1}$ for every real $n$, wherever the powers are defined.', '$\\frac{d}{dx}x^n=nx^{n-1}$ untuk setiap $n$ real, di tempat pangkatnya terdefinisi.'),
              L('The derivative of a product is the product of the derivatives.', 'Turunan hasil kali adalah hasil kali turunan.'),
              L('$\\frac{d}{dx}\\big(c\\,u\\big)=c\\,\\frac{du}{dx}$ for a constant $c$.', '$\\frac{d}{dx}\\big(c\\,u\\big)=c\\,\\frac{du}{dx}$ untuk konstanta $c$.'),
              L('$\\frac{d}{dx}e^x=e^x$.', '$\\frac{d}{dx}e^x=e^x$.'),
              L('The derivative of $\\frac uv$ is $\\frac{u\'}{v\'}$.', 'Turunan $\\frac uv$ adalah $\\frac{u\'}{v\'}$.'),
            ],
            answer: [true, true, false, true, true, false],
            explain: L(
              'The constant, power, multiple and $e^x$ rules are true as stated. Products and quotients need their own rules: $(uv)\'=u\'v+uv\'$ and $\\left(\\frac uv\\right)\'=\\frac{u\'v-uv\'}{v^2}$.',
              'Aturan konstanta, pangkat, kelipatan, dan $e^x$ benar seperti yang dinyatakan. Hasil kali dan hasil bagi memerlukan aturan sendiri: $(uv)\'=u\'v+uv\'$ dan $\\left(\\frac uv\\right)\'=\\frac{u\'v-uv\'}{v^2}$.',
            ),
            hint: L('Test the product claim with $u=v=x$.', 'Uji pernyataan hasil kali dengan $u=v=x$.'),
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
              L('$\\frac{d}{dx}x^5=5x^4$', '$\\frac{d}{dx}x^5=5x^4$'),
              L('$\\frac{d}{dx}x^{-2}=-2x^{-3}$', '$\\frac{d}{dx}x^{-2}=-2x^{-3}$'),
              L('$\\frac{d}{dx}\\sqrt x=\\frac{1}{2\\sqrt x}$', '$\\frac{d}{dx}\\sqrt x=\\frac{1}{2\\sqrt x}$'),
              L('$\\frac{d}{dx}e^x=x\\,e^{x-1}$', '$\\frac{d}{dx}e^x=x\\,e^{x-1}$'),
              L('$\\frac{d}{dx}7=7$', '$\\frac{d}{dx}7=7$'),
            ],
            answer: [0, 1, 2],
            explain: L(
              'The first three follow the power rule. $e^x$ is its own derivative, not $xe^{x-1}$, and the derivative of a constant is $0$, not the constant.',
              'Tiga yang pertama mengikuti aturan pangkat. $e^x$ adalah turunannya sendiri, bukan $xe^{x-1}$, dan turunan konstanta adalah $0$, bukan konstanta itu.',
            ),
            hint: L('Bring the exponent down and subtract one; $\\sqrt x=x^{1/2}$.', 'Turunkan pangkat ke depan dan kurangi satu; $\\sqrt x=x^{1/2}$.'),
          },
        },
        {
          kind: 'activity',
          title: L('A polynomial', 'Sebuah polinomial'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L('Differentiate term by term: $6x^2-10x+4$.', 'Turunkan suku demi suku: $6x^2-10x+4$.'), L('At $x=2$: $24-20+4$.', 'Di $x=2$: $24-20+4$.')],
            explain: L('$y\'=6x^2-10x+4$, so $y\'(2)=24-20+4=8$.', '$y\'=6x^2-10x+4$, sehingga $y\'(2)=24-20+4=8$.'),
            prompt: L('Find the slope of $y=2x^3-5x^2+4x-7$ at $x=2$.', 'Tentukan gradien $y=2x^3-5x^2+4x-7$ di $x=2$.'),
            given: String.raw`y'(2)=v`,
            blanks: [{ label: "y'(2) =", answer: 8 }],
          },
        },
        {
          kind: 'activity',
          title: L('Another polynomial', 'Polinomial lainnya'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L('$y\'=4x^3-4x$.', '$y\'=4x^3-4x$.'), L('At $x=2$: $32-8$.', 'Di $x=2$: $32-8$.')],
            explain: L('$y\'=4x^3-4x$, so $y\'(2)=32-8=24$.', '$y\'=4x^3-4x$, sehingga $y\'(2)=32-8=24$.'),
            prompt: L('Find the slope of $y=x^4-2x^2+2$ at $x=2$.', 'Tentukan gradien $y=x^4-2x^2+2$ di $x=2$.'),
            given: String.raw`y'(2)=v`,
            blanks: [{ label: "y'(2) =", answer: 24 }],
          },
        },
        {
          kind: 'activity',
          title: L('The product rule', 'Aturan hasil kali'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [L('$y\'=2x(x^3-3x)+(x^2+1)(3x^2-3)$.', '$y\'=2x(x^3-3x)+(x^2+1)(3x^2-3)$.'), L('At $x=2$: $4\\cdot2+5\\cdot9$.', 'Di $x=2$: $4\\cdot2+5\\cdot9$.')],
            explain: L('At $x=2$: $2x(x^3-3x)=4\\cdot2=8$ and $(x^2+1)(3x^2-3)=5\\cdot9=45$, so $y\'(2)=53$, which is $5x^4-6x^2-3$ at $2$.', 'Di $x=2$: $2x(x^3-3x)=4\\cdot2=8$ dan $(x^2+1)(3x^2-3)=5\\cdot9=45$, sehingga $y\'(2)=53$, yaitu $5x^4-6x^2-3$ di $2$.'),
            prompt: L('Use the product rule for $y=(x^2+1)(x^3-3x)$ and find $y\'(2)$.', 'Pakai aturan hasil kali untuk $y=(x^2+1)(x^3-3x)$ dan tentukan $y\'(2)$.'),
            given: String.raw`y'(2)=v`,
            blanks: [{ label: "y'(2) =", answer: 53 }],
          },
        },
        {
          kind: 'activity',
          title: L('The quotient rule', 'Aturan hasil bagi'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L('$y\'=\\frac{1\\cdot(x^2+1)-x\\cdot2x}{(x^2+1)^2}=\\frac{1-x^2}{(x^2+1)^2}$.', '$y\'=\\frac{1\\cdot(x^2+1)-x\\cdot2x}{(x^2+1)^2}=\\frac{1-x^2}{(x^2+1)^2}$.'), L('At $x=2$: $\\frac{1-4}{25}$.', 'Di $x=2$: $\\frac{1-4}{25}$.')],
            explain: L('$y\'(2)=\\frac{1-4}{25}=-\\frac{3}{25}=-0.12$.', '$y\'(2)=\\frac{1-4}{25}=-\\frac{3}{25}=-0{,}12$.'),
            prompt: L('Find $y\'(2)$ for $y=\\frac{x}{x^2+1}$ (a fraction or a decimal).', 'Tentukan $y\'(2)$ untuk $y=\\frac{x}{x^2+1}$ (pecahan atau desimal).'),
            given: String.raw`y'(2)=v`,
            blanks: [{ label: "y'(2) =", answer: -0.12 }],
          },
        },
        {
          kind: 'activity',
          title: L('x times e to the x', 'x kali e pangkat x'),
          step: {
            kind: 'quiz',
            id: 'p7',
            prompt: L('What is the derivative of $y=x\\,e^x$?', 'Berapa turunan $y=x\\,e^x$?'),
            options: [L('$(x+1)\\,e^x$', '$(x+1)\\,e^x$'), L('$x\\,e^x$', '$x\\,e^x$'), L('$e^x$', '$e^x$'), L('$x\\,e^{x-1}$', '$x\\,e^{x-1}$')],
            answer: 0,
            explain: L('By the product rule, $y\'=1\\cdot e^x+x\\cdot e^x=(x+1)e^x$.', 'Dengan aturan hasil kali, $y\'=1\\cdot e^x+x\\cdot e^x=(x+1)e^x$.'),
            hint: L('Product rule with $u=x$ and $v=e^x$.', 'Aturan hasil kali dengan $u=x$ dan $v=e^x$.'),
          },
        },
        {
          kind: 'activity',
          title: L('A tangent through the origin', 'Garis singgung melalui titik asal'),
          step: {
            kind: 'quiz',
            id: 'p8',
            prompt: L('A line $y=mx$ through the origin is tangent to $y=e^x$. What is $m$?', 'Garis $y=mx$ melalui titik asal menyinggung $y=e^x$. Berapa $m$?'),
            options: [L('$1$', '$1$'), L('$e$', '$e$'), L('$\\frac1e$', '$\\frac1e$'), L('$2$', '$2$')],
            answer: 1,
            explain: L('Touching at $(a,e^a)$ needs $e^a=\\frac{e^a}{a}$, so $a=1$ and the slope is $e^1=e$: the line is $y=ex$.', 'Menyentuh di $(a,e^a)$ memerlukan $e^a=\\frac{e^a}{a}$, sehingga $a=1$ dan gradiennya $e^1=e$: garisnya $y=ex$.'),
            hint: L('The slope of the curve at $x=a$ is $e^a$, and the line through the origin has slope $\\frac{e^a}{a}$.', 'Gradien kurva di $x=a$ adalah $e^a$, dan garis melalui titik asal bergradien $\\frac{e^a}{a}$.'),
          },
        },
        {
          kind: 'activity',
          title: L('A second derivative', 'Turunan kedua'),
          step: {
            kind: 'math',
            id: 'p9',
            hints: [L('$y\'=4x^3-6x$.', '$y\'=4x^3-6x$.'), L('$y\'\'=12x^2-6$.', '$y\'\'=12x^2-6$.')],
            explain: L('$y\'=4x^3-6x$, $y\'\'=12x^2-6$, so $y\'\'(1)=6$.', '$y\'=4x^3-6x$, $y\'\'=12x^2-6$, sehingga $y\'\'(1)=6$.'),
            prompt: L('Find $y\'\'(1)$ for $y=x^4-3x^2$.', 'Tentukan $y\'\'(1)$ untuk $y=x^4-3x^2$.'),
            given: String.raw`y''(1)=v`,
            blanks: [{ label: "y''(1) =", answer: 6 }],
          },
        },
        {
          kind: 'activity',
          title: L('When it becomes zero', 'Kapan menjadi nol'),
          step: {
            kind: 'quiz',
            id: 'p10',
            prompt: L('For $y=x^5$, which is the first derivative that is the constant $0$?', 'Untuk $y=x^5$, turunan ke berapa yang pertama kali bernilai konstanta $0$?'),
            options: [L('the 5th', 'ke-5'), L('the 6th', 'ke-6'), L('the 7th', 'ke-7'), L('none of them', 'tidak ada')],
            answer: 1,
            explain: L('The 5th derivative is the constant $5!=120$, and the derivative of a constant is $0$, so the 6th derivative is $0$.', 'Turunan ke-5 adalah konstanta $5!=120$, dan turunan konstanta adalah $0$, sehingga turunan ke-6 adalah $0$.'),
            hint: L('Each derivative lowers the power by one.', 'Setiap turunan menurunkan pangkat satu.'),
          },
        },
        {
          kind: 'activity',
          title: L('Spot the error', 'Temukan kesalahannya'),
          step: {
            kind: 'quiz',
            id: 'p11',
            prompt: L('A student writes $\\frac{d}{dx}\\big(x^2e^x\\big)=2x\\,e^x$. What is missing?', 'Seorang siswa menulis $\\frac{d}{dx}\\big(x^2e^x\\big)=2x\\,e^x$. Apa yang kurang?'),
            options: [L('the term $x^2e^x$ (the derivative of $e^x$ times $x^2$)', 'suku $x^2e^x$ (turunan $e^x$ kali $x^2$)'), L('a minus sign', 'tanda minus'), L('nothing: it is right', 'tidak ada: ia benar'), L('the term $2x$', 'suku $2x$')],
            answer: 0,
            explain: L('The product rule has two terms: $2x\\,e^x$ from differentiating $x^2$, and $x^2e^x$ from differentiating $e^x$. The student kept only the first.', 'Aturan hasil kali memiliki dua suku: $2x\\,e^x$ dari menurunkan $x^2$, dan $x^2e^x$ dari menurunkan $e^x$. Siswa itu hanya memakai yang pertama.'),
            hint: L('Count the terms in the product rule.', 'Hitung suku pada aturan hasil kali.'),
          },
        },
        {
          kind: 'activity',
          title: L('Choose the easiest route', 'Pilih jalan yang paling mudah'),
          step: {
            kind: 'quiz',
            id: 'p12',
            prompt: L('To differentiate $y=\\frac{x^3+2x}{x}$, what is the best first move?', 'Untuk menurunkan $y=\\frac{x^3+2x}{x}$, apa langkah pertama terbaik?'),
            options: [L('the quotient rule at once', 'langsung aturan hasil bagi'), L('divide to get $x^2+2$, then the power rule', 'bagi untuk mendapat $x^2+2$, lalu aturan pangkat'), L('the product rule', 'aturan hasil kali'), L('differentiate top and bottom separately', 'turunkan pembilang dan penyebut secara terpisah')],
            answer: 1,
            explain: L('$\\frac{x^3+2x}{x}=x^2+2$ for $x\\ne0$, whose derivative is $2x$: no quotient rule needed. Differentiating top and bottom separately is the mistake $\\frac{u\'}{v\'}$.', '$\\frac{x^3+2x}{x}=x^2+2$ untuk $x\\ne0$, yang turunannya $2x$: tidak perlu aturan hasil bagi. Menurunkan pembilang dan penyebut terpisah adalah kesalahan $\\frac{u\'}{v\'}$.'),
            hint: L('Can the fraction be simplified first?', 'Dapatkah pecahan itu disederhanakan dulu?'),
          },
        },
      ],
    },

    /* ----------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: the differentiation rules at a glance', 'Ringkasan: aturan turunan sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Constant:** $\frac{d}{dx}c=0$. **Power:** $\frac{d}{dx}x^n=nx^{n-1}$ for every real $n$ where defined; write roots and reciprocals as powers first.
- **Multiple, sum, difference:** $(cu)'=cu'$, $(u\pm v)'=u'\pm v'$; a polynomial is differentiated term by term; horizontal tangents are where $y'=0$.
- **Exponential:** $\frac{d}{dx}a^x=a^x\cdot L$ with $L=f'(0)$; for the base $e$, $L=1$ and $\frac{d}{dx}e^x=e^x$.
- **Product:** $(uv)'=u'v+uv'$, not $u'v'$. **Quotient:** $\left(\frac uv\right)'=\frac{u'v-uv'}{v^2}$; reciprocal $\left(\frac1v\right)'=-\frac{v'}{v^2}$.
- **Strategy:** simplify with algebra first (expand, divide); use the product or quotient rule only when needed.
- **Higher order:** $f''=(f')'$, $y^{(n)}=\frac{d^ny}{dx^n}$; $f''$ is the rate of change of the slope; the $n$-th derivative of $x^n$ is $n!$.
- **Code:** SymPy ´diff´ applies the rules (´diff(f, x, 3)´ for the third derivative); check with a central difference.`,
            T`- **Konstanta:** $\frac{d}{dx}c=0$. **Pangkat:** $\frac{d}{dx}x^n=nx^{n-1}$ untuk setiap $n$ real di tempat terdefinisi; tulis akar dan kebalikan sebagai pangkat dahulu.
- **Kelipatan, jumlah, selisih:** $(cu)'=cu'$, $(u\pm v)'=u'\pm v'$; polinomial diturunkan suku demi suku; garis singgung mendatar ada di tempat $y'=0$.
- **Eksponensial:** $\frac{d}{dx}a^x=a^x\cdot L$ dengan $L=f'(0)$; untuk basis $e$, $L=1$ dan $\frac{d}{dx}e^x=e^x$.
- **Hasil kali:** $(uv)'=u'v+uv'$, bukan $u'v'$. **Hasil bagi:** $\left(\frac uv\right)'=\frac{u'v-uv'}{v^2}$; kebalikan $\left(\frac1v\right)'=-\frac{v'}{v^2}$.
- **Strategi:** sederhanakan dengan aljabar dahulu (jabarkan, bagi); pakai aturan hasil kali atau hasil bagi hanya bila perlu.
- **Tingkat tinggi:** $f''=(f')'$, $y^{(n)}=\frac{d^ny}{dx^n}$; $f''$ adalah laju perubahan gradien; turunan ke-$n$ dari $x^n$ adalah $n!$.
- **Kode:** ´diff´ SymPy menerapkan aturan (´diff(f, x, 3)´ untuk turunan ketiga); periksa dengan selisih terpusat.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Power rule', 'Aturan pangkat'), definition: L('The rule that the derivative of x to the power n is n times x to the power n minus 1, valid for every real n where the powers are defined.', 'Aturan bahwa turunan x pangkat n adalah n kali x pangkat n dikurangi 1, berlaku untuk setiap n real di tempat pangkatnya terdefinisi.') },
    { term: L('Constant multiple rule', 'Aturan kelipatan konstanta'), definition: L('The rule that the derivative of a constant times a function is the constant times the derivative of the function.', 'Aturan bahwa turunan konstanta kali sebuah fungsi adalah konstanta itu kali turunan fungsinya.') },
    { term: L('Sum rule', 'Aturan jumlah'), definition: L('The rule that the derivative of a sum of differentiable functions is the sum of their derivatives; the difference rule is the same for subtraction.', 'Aturan bahwa turunan jumlah fungsi-fungsi terdiferensialkan adalah jumlah turunannya; aturan selisih sama untuk pengurangan.') },
    { term: L('Product rule', 'Aturan hasil kali'), definition: L('The rule that the derivative of a product uv is u times the derivative of v plus the derivative of u times v.', 'Aturan bahwa turunan hasil kali uv adalah u kali turunan v ditambah turunan u kali v.') },
    { term: L('Quotient rule', 'Aturan hasil bagi'), definition: L('The rule that the derivative of u over v is the bottom times the derivative of the top minus the top times the derivative of the bottom, all over the bottom squared.', 'Aturan bahwa turunan u per v adalah penyebut kali turunan pembilang dikurangi pembilang kali turunan penyebut, seluruhnya dibagi kuadrat penyebut.') },
    { term: L('Natural exponential function', 'Fungsi eksponensial natural'), definition: L('The function e to the power x, whose base e is about 2.71828 and whose graph crosses the y-axis with slope 1, so that it equals its own derivative.', 'Fungsi e pangkat x, yang basisnya e sekitar 2,71828 dan grafiknya memotong sumbu y dengan gradien 1, sehingga ia sama dengan turunannya sendiri.') },
    { term: L('Higher-order derivative', 'Turunan tingkat tinggi'), definition: L('A derivative of a derivative, found by differentiating repeatedly: the second derivative is the derivative of the first, the third of the second, and so on.', 'Turunan dari turunan, diperoleh dengan menurunkan berulang: turunan kedua adalah turunan dari yang pertama, ketiga dari yang kedua, dan seterusnya.') },
    { term: L('Reciprocal rule', 'Aturan kebalikan'), definition: L('The special case of the quotient rule for one over v, which says the derivative is minus the derivative of v over v squared.', 'Kasus khusus aturan hasil bagi untuk satu per v, yang menyatakan turunannya adalah min turunan v per v kuadrat.') },
  ],

  howTo: [
    {
      name: L('How to differentiate a polynomial term by term', 'Cara menurunkan polinomial suku demi suku'),
      description: L('Apply the power rule to each term, keep the coefficients, and drop the constant.', 'Terapkan aturan pangkat pada tiap suku, pertahankan koefisiennya, dan buang konstantanya.'),
      steps: [
        { name: L('Split into terms', 'Pisahkan menjadi suku'), text: L('Write the polynomial as a sum of terms, each a number times a power of x, such as 2x cubed minus 5x squared plus 4x minus 7.', 'Tulis polinomial sebagai jumlah suku, masing-masing bilangan kali pangkat x, seperti 2x pangkat tiga dikurangi 5x kuadrat ditambah 4x dikurangi 7.') },
        { name: L('Apply the power rule', 'Terapkan aturan pangkat'), text: L('For each term bring the exponent in front, multiply it by the coefficient, and lower the exponent by one.', 'Untuk tiap suku, bawa pangkat ke depan, kalikan dengan koefisien, dan kurangi pangkat satu.') },
        { name: L('Drop the constant', 'Buang konstantanya'), text: L('The derivative of a constant term is zero, and the derivative of a term in x is just its coefficient.', 'Turunan suku konstanta adalah nol, dan turunan suku dalam x hanyalah koefisiennya.') },
        { name: L('Add the results', 'Jumlahkan hasilnya'), text: L('Add the derivatives of the terms: the example gives 6x squared minus 10x plus 4.', 'Jumlahkan turunan suku-sukunya: contoh itu memberi 6x kuadrat dikurangi 10x ditambah 4.') },
      ],
    },
    {
      name: L('How to choose the right differentiation rule', 'Cara memilih aturan turunan yang tepat'),
      description: L('Look at the outermost operation of the expression and use the rule for it, after simplifying with algebra.', 'Lihat operasi terluar ekspresi dan pakai aturannya, setelah menyederhanakan dengan aljabar.'),
      steps: [
        { name: L('Simplify first', 'Sederhanakan dulu'), text: L('Expand products, divide by common factors and write roots and reciprocals as powers of x; often only the power rule is left.', 'Jabarkan hasil kali, bagi faktor persekutuan, dan tulis akar dan kebalikan sebagai pangkat x; sering hanya aturan pangkat yang tersisa.') },
        { name: L('Find the outermost operation', 'Cari operasi terluar'), text: L('Decide whether the expression is a sum, a constant multiple, a product or a quotient at the top level.', 'Tentukan apakah ekspresinya jumlah, kelipatan konstanta, hasil kali, atau hasil bagi pada tingkat teratas.') },
        { name: L('Apply that rule', 'Terapkan aturan itu'), text: L('Use the sum rule for sums, the multiple rule for a constant factor, the product rule for a product and the quotient rule for a quotient.', 'Pakai aturan jumlah untuk jumlah, aturan kelipatan untuk faktor konstan, aturan hasil kali untuk hasil kali, dan aturan hasil bagi untuk hasil bagi.') },
        { name: L('Repeat on the pieces and check', 'Ulangi pada bagian-bagiannya dan periksa'), text: L('Differentiate each piece the same way, then check the answer with a difference quotient at one point.', 'Turunkan tiap bagian dengan cara yang sama, lalu periksa jawabannya dengan hasil bagi selisih di satu titik.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What are the basic differentiation rules?', 'Apa saja aturan turunan dasar?'),
      a: L(
        'The constant rule gives zero, the power rule gives n times x to the power n minus 1, constants come out in front, and sums and differences are differentiated term by term. For products use u prime v plus u v prime, and for quotients u prime v minus u v prime over v squared.',
        'Aturan konstanta memberi nol, aturan pangkat memberi n kali x pangkat n dikurangi 1, konstanta keluar ke depan, dan jumlah serta selisih diturunkan suku demi suku. Untuk hasil kali pakai u aksen v ditambah u v aksen, dan untuk hasil bagi u aksen v dikurangi u v aksen per v kuadrat.',
      ),
    },
    {
      q: L('What is the power rule for derivatives?', 'Apa aturan pangkat untuk turunan?'),
      a: L(
        'The derivative of x to the power n is n times x to the power n minus 1. Bring the exponent in front and lower it by one. It holds for every real exponent, so the derivative of x cubed is 3x squared and the derivative of 1 over x is minus 1 over x squared.',
        'Turunan x pangkat n adalah n kali x pangkat n dikurangi 1. Bawa pangkat ke depan dan kurangi satu. Ia berlaku untuk setiap pangkat real, sehingga turunan x pangkat tiga adalah 3x kuadrat dan turunan 1 per x adalah min 1 per x kuadrat.',
      ),
    },
    {
      q: L('What is the product rule?', 'Apa aturan hasil kali?'),
      a: L(
        'The derivative of a product u times v is u prime times v plus u times v prime. It is not the product of the two derivatives. For x times x the rule gives 1 times x plus x times 1, which is 2x, the derivative of x squared.',
        'Turunan hasil kali u kali v adalah u aksen kali v ditambah u kali v aksen. Ia bukan hasil kali kedua turunan. Untuk x kali x aturan itu memberi 1 kali x ditambah x kali 1, yaitu 2x, turunan x kuadrat.',
      ),
    },
    {
      q: L('What is the quotient rule?', 'Apa aturan hasil bagi?'),
      a: L(
        'The derivative of u over v is u prime times v minus u times v prime, all divided by v squared, wherever v is not zero. The order in the numerator matters. If it helps, remember it as low d high minus high d low, over low low.',
        'Turunan u per v adalah u aksen kali v dikurangi u kali v aksen, seluruhnya dibagi v kuadrat, di mana pun v bukan nol. Urutan di pembilang penting. Jika membantu, ingatlah sebagai bawah d atas dikurang atas d bawah, per bawah bawah.',
      ),
    },
    {
      q: L('What is the derivative of e to the x?', 'Berapa turunan e pangkat x?'),
      a: L(
        'The derivative of e to the x is e to the x. The natural exponential function is its own derivative, because e is the base for which the graph of the exponential crosses the y-axis with slope 1. Any constant multiple of e to the x has the same property.',
        'Turunan e pangkat x adalah e pangkat x. Fungsi eksponensial natural adalah turunannya sendiri, karena e adalah basis yang grafik eksponensialnya memotong sumbu y dengan gradien 1. Kelipatan konstan mana pun dari e pangkat x memiliki sifat yang sama.',
      ),
    },
    {
      q: L('Is the derivative of a product the product of the derivatives?', 'Apakah turunan hasil kali sama dengan hasil kali turunan?'),
      a: L(
        'No. For a product of two functions the derivative has two terms, u prime v and u v prime. A quick test is x times x: the product is x squared with derivative 2x, but multiplying the two derivatives 1 and 1 gives only 1.',
        'Tidak. Untuk hasil kali dua fungsi turunannya memiliki dua suku, u aksen v dan u v aksen. Uji cepatnya x kali x: hasil kalinya x kuadrat dengan turunan 2x, tetapi mengalikan kedua turunan 1 dan 1 hanya memberi 1.',
      ),
    },
    {
      q: L('How do you differentiate a polynomial?', 'Bagaimana menurunkan polinomial?'),
      a: L(
        'Differentiate term by term with the power rule. Each term a x to the n becomes n a x to the n minus 1, and a constant term disappears. For 2x cubed minus 5x squared plus 4x minus 7 the derivative is 6x squared minus 10x plus 4.',
        'Turunkan suku demi suku dengan aturan pangkat. Tiap suku a x pangkat n menjadi n a x pangkat n dikurangi 1, dan suku konstanta hilang. Untuk 2x pangkat tiga dikurangi 5x kuadrat ditambah 4x dikurangi 7 turunannya 6x kuadrat dikurangi 10x ditambah 4.',
      ),
    },
    {
      q: L('What is the derivative of a constant?', 'Berapa turunan konstanta?'),
      a: L(
        'The derivative of a constant is zero. A constant function has the same value everywhere, so every difference quotient is zero and its graph is a horizontal line with slope zero. This holds for numbers such as pi squared too.',
        'Turunan konstanta adalah nol. Fungsi konstan bernilai sama di mana-mana, sehingga setiap hasil bagi selisih nol dan grafiknya garis mendatar bergradien nol. Ini berlaku juga untuk bilangan seperti pi kuadrat.',
      ),
    },
    {
      q: L('What is the second derivative?', 'Apa itu turunan kedua?'),
      a: L(
        'The second derivative is the derivative of the derivative, written f double prime or d squared y over dx squared. It is the rate of change of the slope: where it is positive the graph bends upward, and where it is negative the graph bends downward.',
        'Turunan kedua adalah turunan dari turunan, ditulis f aksen ganda atau d kuadrat y per dx kuadrat. Ia adalah laju perubahan gradien: di tempat ia positif grafik melengkung ke atas, dan di tempat ia negatif grafik melengkung ke bawah.',
      ),
    },
  ],

  references: [
    { title: "Thomas' Calculus: Early Transcendentals in SI Units (15th ed.), Section 3.3: Differentiation Rules", author: 'Joel Hass, Christopher Heil, Maurice D. Weir et al.', year: 2023, source: 'Pearson' },
    { title: 'Calculus (8th ed.), sections 3.1 Derivatives of Polynomials and Exponential Functions, 3.2 The Product and Quotient Rules', author: 'James Stewart', year: 2015, source: 'Cengage Learning' },
    { title: 'The History of the Calculus and Its Conceptual Development', author: 'Carl B. Boyer', year: 1949, source: 'Hafner (Dover reprint, 1959)' },
    { title: 'e: The Story of a Number', author: 'Eli Maor', year: 1994, source: 'Princeton University Press' },
    { title: 'SymPy tutorial: Calculus (diff)', author: 'SymPy Development Team', source: 'docs.sympy.org', url: 'https://docs.sympy.org/latest/tutorials/intro-tutorial/calculus.html' },
  ],

  related: ['the-derivative-as-a-function', 'derivatives-of-trigonometric-functions', 'algebraic-expressions', 'exponents-and-radicals'],
}
