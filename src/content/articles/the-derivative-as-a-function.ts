import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './the-derivative-as-a-function.meta'

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
    T`**The derivative of a function $f$ is itself a function, $f'$, whose value at each $x$ is the slope of the graph of $f$ there: $f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}$, defined at every $x$ where the limit exists.** Finding it is called differentiation. It can be written $f'(x)$, $\frac{dy}{dx}$ or $Df(x)$, its graph is made by plotting the slopes of the graph of $f$, and its domain can be smaller than that of $f$, as for $\sqrt x$ at $0$ or $|x|$ at $0$.`,
    T`**Turunan fungsi $f$ adalah sebuah fungsi, $f'$, yang nilainya di setiap $x$ adalah gradien grafik $f$ di sana: $f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}$, terdefinisi di setiap $x$ yang limitnya ada.** Mencarinya disebut diferensiasi. Ia dapat ditulis $f'(x)$, $\frac{dy}{dx}$, atau $Df(x)$, grafiknya dibuat dengan memplot gradien grafik $f$, dan daerah asalnya dapat lebih kecil daripada daerah asal $f$, seperti pada $\sqrt x$ di $0$ atau $|x|$ di $0$.`,
  ),

  keyPoints: [
    L(
      T`The derivative function $f'$ takes each $x$ to the slope of the graph of $f$ at $x$; its domain is the set of points where $f$ is differentiable, which may be smaller than the domain of $f$.`,
      T`Fungsi turunan $f'$ memetakan setiap $x$ ke gradien grafik $f$ di $x$; daerah asalnya adalah himpunan titik tempat $f$ terdiferensialkan, yang mungkin lebih kecil daripada daerah asal $f$.`,
    ),
    L(
      T`To differentiate from the definition, write the difference quotient with $x$ left as a letter, simplify until $h$ cancels, and let $h\to0$: $x^2\to2x$, $x^3\to3x^2$, $\frac1x\to-\frac1{x^2}$, $\sqrt x\to\frac1{2\sqrt x}$.`,
      T`Untuk menurunkan dari definisi, tulis hasil bagi selisih dengan $x$ tetap sebagai huruf, sederhanakan sampai $h$ tercoret, lalu biarkan $h\to0$: $x^2\to2x$, $x^3\to3x^2$, $\frac1x\to-\frac1{x^2}$, $\sqrt x\to\frac1{2\sqrt x}$.`,
    ),
    L(
      T`The same derivative has many names: $f'(x)$, $y'$, $\frac{dy}{dx}$, $\frac{df}{dx}$, $\frac{d}{dx}f(x)$ and $Df(x)$; $\frac{dy}{dx}$ is one symbol, not a fraction to cancel.`,
      T`Turunan yang sama memiliki banyak nama: $f'(x)$, $y'$, $\frac{dy}{dx}$, $\frac{df}{dx}$, $\frac{d}{dx}f(x)$, dan $Df(x)$; $\frac{dy}{dx}$ adalah satu lambang, bukan pecahan yang dapat dicoret.`,
    ),
    L(
      T`You can draw the graph of $f'$ from the graph of $f$ by plotting slopes: $f'>0$ where $f$ rises, $f'<0$ where it falls and $f'=0$ at a horizontal tangent.`,
      T`Grafik $f'$ dapat digambar dari grafik $f$ dengan memplot gradien: $f'>0$ di tempat $f$ naik, $f'<0$ di tempat ia turun, dan $f'=0$ pada garis singgung mendatar.`,
    ),
    L(
      T`The derivative of a graph made of line segments is a step function with no value at a corner; at the ends of a closed interval only a one-sided derivative exists.`,
      T`Turunan grafik yang tersusun dari ruas garis adalah fungsi tangga tanpa nilai di sudut tajam; di ujung selang tertutup hanya ada turunan sepihak.`,
    ),
    L(
      T`A function can be differentiable everywhere while $f'$ is not continuous ($x^2\sin\frac1x$); in code, SymPy gives $f'$ exactly and a central difference on a grid gives it numerically.`,
      T`Fungsi dapat terdiferensialkan di mana-mana sementara $f'$ tidak kontinu ($x^2\sin\frac1x$); dalam kode, SymPy memberi $f'$ secara eksak dan selisih terpusat pada sebuah grid memberinya secara numerik.`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------ the derivative function */
    {
      id: 'derivative-function',
      heading: L('What does it mean for the derivative to be a function?', 'Apa artinya turunan sebagai sebuah fungsi?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The derivative of $f$ is the new function $f'$ that gives, for each $x$, the derivative of $f$ at that $x$: $f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}$, for every $x$ where the limit exists.** The [derivative at a point](article:tangent-lines-and-derivative-at-a-point#derivative-at-a-point) is one number at one place. Letting the point move gives a rule that hands out a slope for every input: feed it $x$ and out comes the slope of the graph of $f$ at $x$. The number $f'(a)$ is simply the value of this function at $a$.

Four consequences are worth stating at once.

- **The domain of $f'$ can be smaller than that of $f$.** It is the set of $x$ in the domain of $f$ at which the limit exists. $f(x)=\sqrt x$ is defined at $0$, but $f'$ is not (the graph has a vertical tangent there).
- **Differentiable has two meanings.** $f$ is *differentiable at $x$* when $f'(x)$ exists, and *differentiable* when $f'$ exists at every point of its domain.
- **There is a second form of the limit.** Writing $z=x+h$, so that $h=z-x$ and $h\to0$ exactly when $z\to x$, gives
$$f'(x)=\lim_{z\to x}\frac{f(z)-f(x)}{z-x},$$
which is often easier when $f$ has a root in it, as the examples below show.
- **Differentiation is an operation on functions.** Put a function $f$ in, get a function $f'$ out. That is why the next sections are about finding the *formula* for $f'$, not a single number.

The slope of the graph of $f$ at $x$ and the instantaneous rate of change of $f$ at $x$ are two readings of the same number $f'(x)$, as in the section on [rates of change](article:tangent-lines-and-derivative-at-a-point#rates-of-change).`,
            T`**Turunan $f$ adalah fungsi baru $f'$ yang memberikan, untuk setiap $x$, turunan $f$ di $x$ itu: $f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}$, untuk setiap $x$ yang limitnya ada.** [Turunan di suatu titik](article:tangent-lines-and-derivative-at-a-point#derivative-at-a-point) adalah satu bilangan di satu tempat. Membiarkan titiknya bergerak menghasilkan aturan yang memberikan gradien untuk setiap masukan: masukkan $x$ dan keluarlah gradien grafik $f$ di $x$. Bilangan $f'(a)$ tidak lain nilai fungsi ini di $a$.

Empat akibat perlu disebut sekaligus.

- **Daerah asal $f'$ dapat lebih kecil daripada daerah asal $f$.** Ia adalah himpunan $x$ dalam daerah asal $f$ tempat limitnya ada. $f(x)=\sqrt x$ terdefinisi di $0$, tetapi $f'$ tidak (grafiknya memiliki garis singgung tegak di sana).
- **Terdiferensialkan memiliki dua arti.** $f$ *terdiferensialkan di $x$* bila $f'(x)$ ada, dan *terdiferensialkan* bila $f'$ ada di setiap titik pada daerah asalnya.
- **Ada bentuk kedua dari limit itu.** Menulis $z=x+h$, sehingga $h=z-x$ dan $h\to0$ tepat bila $z\to x$, memberi
$$f'(x)=\lim_{z\to x}\frac{f(z)-f(x)}{z-x},$$
yang sering lebih mudah bila $f$ memuat akar, seperti pada contoh di bawah.
- **Diferensiasi adalah operasi pada fungsi.** Masukkan fungsi $f$, keluar fungsi $f'$. Itulah sebabnya bagian-bagian berikut membahas mencari *rumus* $f'$, bukan satu bilangan.

Gradien grafik $f$ di $x$ dan laju perubahan sesaat $f$ di $x$ adalah dua cara membaca bilangan $f'(x)$ yang sama, seperti pada bagian tentang [laju perubahan](article:tangent-lines-and-derivative-at-a-point#rates-of-change).`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------- from the definition */
    {
      id: 'from-the-definition',
      heading: L('How do you find a derivative function from the definition?', 'Bagaimana mencari fungsi turunan dari definisi?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To differentiate from the definition, write the difference quotient with $x$ left as a letter, simplify until $h$ cancels, and then let $h\to0$; what is left is a formula in $x$.** Here are five functions, each with its own trick.

**1. $f(x)=x^2$: expand and cancel.** After [expanding the bracket](article:algebraic-expressions#expand),
$$\frac{(x+h)^2-x^2}{h}=\frac{2xh+h^2}{h}=2x+h,$$
which tends to $2x$.

**2. $f(x)=x^3$.** Since $(x+h)^3=x^3+3x^2h+3xh^2+h^3$,
$$\frac{(x+h)^3-x^3}{h}=3x^2+3xh+h^2,$$
which tends to $3x^2$.

**3. $f(x)=\frac1x$: a common denominator.** For $x\ne0$, using [adding fractions](article:rational-numbers#add-subtract-fractions),
$$\frac{\frac1{x+h}-\frac1x}{h}=\frac{x-(x+h)}{x(x+h)\,h}=\frac{-1}{x(x+h)},$$
which tends to $-\frac1{x^2}$.

**4. $f(x)=\frac{x}{x-1}$.** Over a common denominator the numerator is $(x+h)(x-1)-x(x+h-1)=-h$, so the factor $h$ cancels:
$$\frac{f(x+h)-f(x)}{h}=\frac{-1}{(x+h-1)(x-1)},$$
which tends to $-\frac{1}{(x-1)^2}$ for $x\ne1$.

**5. $f(x)=\sqrt x$: the second form and a conjugate.** For $x>0$, write $z-x=(\sqrt z-\sqrt x)(\sqrt z+\sqrt x)$ and cancel:
$$\frac{\sqrt z-\sqrt x}{z-x}=\frac{1}{\sqrt z+\sqrt x},$$
which tends to $\frac{1}{2\sqrt x}$ as $z\to x$.
This is the same trick as [rationalizing](article:exponents-and-radicals#rationalise). The formula blows up at $0$: $\sqrt x$ is defined for $x\ge0$ and its derivative only for $x>0$.

Two more cases are worth keeping in mind. For a constant $f(x)=c$ every difference quotient is $0$, so $f'(x)=0$. For a line $f(x)=mx+b$ it is $\frac{m(x+h)+b-mx-b}{h}=m$, so $f'(x)=m$: the slope of a line is its derivative.

Compare $x^2\to2x$ with $x^3\to3x^2$. In both the exponent comes down in front and the power of $x$ goes down by one. That pattern is correct, and the [differentiation rules](article:differentiation-rules#constants-and-powers) prove it for every positive whole number; here it is only an observation from the examples.

To check any of these at a point, put a value of $x$ in: for $\frac{x}{x-1}$ at $x=3$ the formula gives $-\frac14$, and the secant slopes in the tool below close in on exactly that. Try your own function: it expands the difference quotient in powers of $h$, or reduces the derivative of a quotient, and shows both graphs.`,
            T`**Untuk menurunkan dari definisi, tulis hasil bagi selisih dengan $x$ tetap sebagai huruf, sederhanakan sampai $h$ tercoret, lalu biarkan $h\to0$; yang tersisa adalah rumus dalam $x$.** Berikut lima fungsi, masing-masing dengan triknya sendiri.

**1. $f(x)=x^2$: jabarkan dan coret.** Setelah [menjabarkan kurung](article:algebraic-expressions#expand),
$$\frac{(x+h)^2-x^2}{h}=\frac{2xh+h^2}{h}=2x+h,$$
yang menuju $2x$.

**2. $f(x)=x^3$.** Karena $(x+h)^3=x^3+3x^2h+3xh^2+h^3$,
$$\frac{(x+h)^3-x^3}{h}=3x^2+3xh+h^2,$$
yang menuju $3x^2$.

**3. $f(x)=\frac1x$: samakan penyebut.** Untuk $x\ne0$, dengan [penjumlahan pecahan](article:rational-numbers#add-subtract-fractions),
$$\frac{\frac1{x+h}-\frac1x}{h}=\frac{x-(x+h)}{x(x+h)\,h}=\frac{-1}{x(x+h)},$$
yang menuju $-\frac1{x^2}$.

**4. $f(x)=\frac{x}{x-1}$.** Dengan penyebut bersama, pembilangnya adalah $(x+h)(x-1)-x(x+h-1)=-h$, sehingga faktor $h$ tercoret:
$$\frac{f(x+h)-f(x)}{h}=\frac{-1}{(x+h-1)(x-1)},$$
yang menuju $-\frac{1}{(x-1)^2}$ untuk $x\ne1$.

**5. $f(x)=\sqrt x$: bentuk kedua dan sekawan.** Untuk $x>0$, tulis $z-x=(\sqrt z-\sqrt x)(\sqrt z+\sqrt x)$ dan coret:
$$\frac{\sqrt z-\sqrt x}{z-x}=\frac{1}{\sqrt z+\sqrt x},$$
yang menuju $\frac{1}{2\sqrt x}$ saat $z\to x$.
Ini trik yang sama dengan [merasionalkan](article:exponents-and-radicals#rationalise). Rumusnya membesar tanpa batas di $0$: $\sqrt x$ terdefinisi untuk $x\ge0$ dan turunannya hanya untuk $x>0$.

Dua kasus lagi perlu diingat. Untuk konstanta $f(x)=c$ setiap hasil bagi selisih adalah $0$, sehingga $f'(x)=0$. Untuk garis $f(x)=mx+b$ hasilnya $\frac{m(x+h)+b-mx-b}{h}=m$, sehingga $f'(x)=m$: gradien sebuah garis adalah turunannya.

Bandingkan $x^2\to2x$ dengan $x^3\to3x^2$. Pada keduanya pangkat turun ke depan dan pangkat $x$ berkurang satu. Pola itu benar, dan [aturan turunan](article:differentiation-rules#constants-and-powers) membuktikannya untuk setiap bilangan bulat positif; di sini ia hanya pengamatan dari contoh.

Untuk memeriksa salah satunya di suatu titik, masukkan nilai $x$: untuk $\frac{x}{x-1}$ di $x=3$ rumusnya memberi $-\frac14$, dan gradien garis potong pada alat di bawah mendekati tepat nilai itu. Coba fungsimu sendiri: alat itu menjabarkan hasil bagi selisih dalam pangkat $h$, atau menyederhanakan turunan sebuah hasil bagi, dan memperlihatkan kedua grafik.`,
          ),
        },
        { kind: 'widget', name: 'derivdef' },
      ],
    },

    /* ------------------------------------------------------------------ notation */
    {
      id: 'notation',
      heading: L('What are the different notations for the derivative?', 'Apa saja notasi untuk turunan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The derivative of $y=f(x)$ can be written $f'(x)$, $y'$, $\frac{dy}{dx}$, $\frac{df}{dx}$, $\frac{d}{dx}f(x)$ or $Df(x)$; they all name the same function and differ only in how they are written.** The prime notation $f'$ and $y'$ goes back to Lagrange and is short. The $\frac{d}{dx}$ notation is Leibniz's, and it has a use that the prime lacks: it names the variable. If $y$ depends on time $t$, $\frac{dy}{dt}$ says what is changing with respect to what, and it carries the units, $y$-units per $t$-unit. The letters $\frac{d}{dx}$ and $D$ stand for the *operation* of differentiating, which is applied to a function. Read $\frac{dy}{dx}$ as "the derivative of $y$ with respect to $x$".

At this stage $\frac{dy}{dx}$ is a single symbol for a derivative, not a fraction: you cannot cancel the $d$'s, and it is not "$dy$ divided by $dx$". (Later in calculus $dx$ and $dy$ do get meanings of their own, which is what makes the notation so convenient, but that is a separate idea.)

To give the value of a derivative at a particular number, name the point with a bar and a subscript:
$$f'(a)=\frac{dy}{dx}\bigg|_{x=a}=\frac{df}{dx}\bigg|_{x=a}.$$
For example, since $\frac{d}{dx}\sqrt x=\frac{1}{2\sqrt x}$, $\ \frac{d}{dx}\sqrt x\bigg|_{x=4}=\frac{1}{2\cdot2}=\frac14$, which is the slope of the tangent line at $(4,2)$.

Pick whichever form is clearest: $f'(x)$ when you have a named function, $\frac{dy}{dx}$ when the variables matter, $D$ when you are treating differentiation as an operator.`,
            T`**Turunan $y=f(x)$ dapat ditulis $f'(x)$, $y'$, $\frac{dy}{dx}$, $\frac{df}{dx}$, $\frac{d}{dx}f(x)$, atau $Df(x)$; semuanya menamai fungsi yang sama dan hanya berbeda cara penulisannya.** Notasi aksen $f'$ dan $y'$ berasal dari Lagrange dan singkat. Notasi $\frac{d}{dx}$ adalah milik Leibniz, dan ia punya kelebihan yang tidak dimiliki aksen: ia menyebut peubahnya. Jika $y$ bergantung pada waktu $t$, $\frac{dy}{dt}$ menyatakan apa yang berubah terhadap apa, dan ia membawa satuannya, satuan $y$ per satuan $t$. Huruf $\frac{d}{dx}$ dan $D$ melambangkan *operasi* menurunkan, yang dikenakan pada sebuah fungsi. Bacalah $\frac{dy}{dx}$ sebagai "turunan $y$ terhadap $x$".

Pada tahap ini $\frac{dy}{dx}$ adalah satu lambang untuk turunan, bukan pecahan: kamu tidak dapat mencoret $d$-nya, dan ia bukan "$dy$ dibagi $dx$". (Kemudian dalam kalkulus $dx$ dan $dy$ memang mendapat arti sendiri, yang membuat notasi ini begitu praktis, tetapi itu gagasan yang terpisah.)

Untuk menyatakan nilai turunan di bilangan tertentu, sebut titiknya dengan garis tegak dan subskrip:
$$f'(a)=\frac{dy}{dx}\bigg|_{x=a}=\frac{df}{dx}\bigg|_{x=a}.$$
Misalnya, karena $\frac{d}{dx}\sqrt x=\frac{1}{2\sqrt x}$, $\ \frac{d}{dx}\sqrt x\bigg|_{x=4}=\frac{1}{2\cdot2}=\frac14$, yaitu gradien garis singgung di $(4,2)$.

Pilih bentuk yang paling jelas: $f'(x)$ bila fungsinya bernama, $\frac{dy}{dx}$ bila peubahnya penting, $D$ bila kamu memperlakukan diferensiasi sebagai operator.`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------- graphing the derivative */
    {
      id: 'graphing-the-derivative',
      heading: L('How do you graph the derivative from the graph of a function?', 'Bagaimana menggambar grafik turunan dari grafik sebuah fungsi?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Read the slope of the graph of $f$ at many points and plot those slopes as heights: where $f$ rises the graph of $f'$ is above the axis, where $f$ falls it is below, and where $f$ has a horizontal tangent it touches the axis.** The method is to sketch tangent lines at frequent steps along the graph, estimate each slope, plot the pairs $(x,f'(x))$ and join them with a curve.

Reading the graph of $f'$ tells you three things at a glance:

1. **Where the rate of change is positive, negative or zero.** $f'>0$ means $f$ is rising, $f'<0$ means falling, $f'=0$ means a flat spot, which is often the top of a hill or the bottom of a valley.
2. **How big the rate is.** The farther $f'$ is from the axis, the steeper the graph of $f$.
3. **Where the rate itself is increasing or decreasing.** Where the graph of $f'$ climbs, the slope of $f$ is growing; the graph of $f$ bends upward. Where it falls, the graph of $f$ bends downward. The rate of change of $f'$ is the [second derivative](article:differentiation-rules#higher-order), written $f''$, which is just the derivative function applied twice.

Two examples to compare with the tool below. For $f(x)=x^2$ the slope is negative to the left of the vertex, zero at the vertex and positive to the right, growing steadily: $f'(x)=2x$, a straight line. For $f(x)=x^3-3x$ the graph rises to a peak at $x=-1$, falls through $x=0$ with slope $-3$ (its steepest fall) and rises again after a valley at $x=1$, so $f'(x)=3x^2-3$ is a parabola that crosses the axis at $-1$ and $1$ and has its lowest point at $x=0$.

The same slope-reading explains why the derivative of $\sin x$ is $\cos x$: the slope of the sine wave is zero at every peak and valley, largest where the wave crosses the axis going up, and the result is the same wave moved a quarter of a period to the left.

Slide the point below along nine graphs. The top graph shows $f$ and its tangent; the bottom one draws $f'$ up to the point, the height of the dot being the slope of the tangent above it.`,
            T`**Bacalah gradien grafik $f$ di banyak titik dan plot gradien itu sebagai tinggi: di tempat $f$ naik grafik $f'$ berada di atas sumbu, di tempat $f$ turun ia berada di bawah, dan di tempat $f$ memiliki garis singgung mendatar ia menyentuh sumbu.** Caranya adalah menggambar garis singgung pada langkah-langkah yang rapat sepanjang grafik, menaksir tiap gradien, memplot pasangan $(x,f'(x))$, dan menghubungkannya dengan kurva.

Membaca grafik $f'$ memberi tiga hal sekilas:

1. **Di mana laju perubahan positif, negatif, atau nol.** $f'>0$ berarti $f$ naik, $f'<0$ berarti turun, $f'=0$ berarti titik datar, yang sering berupa puncak bukit atau dasar lembah.
2. **Seberapa besar lajunya.** Makin jauh $f'$ dari sumbu, makin curam grafik $f$.
3. **Di mana laju itu sendiri bertambah atau berkurang.** Di tempat grafik $f'$ naik, gradien $f$ membesar; grafik $f$ melengkung ke atas. Di tempat ia turun, grafik $f$ melengkung ke bawah. Laju perubahan $f'$ adalah [turunan kedua](article:differentiation-rules#higher-order), ditulis $f''$, yaitu fungsi turunan yang dikenakan dua kali.

Dua contoh untuk dibandingkan dengan alat di bawah. Untuk $f(x)=x^2$ gradiennya negatif di kiri puncak, nol di puncak, dan positif di kanan, bertambah secara tetap: $f'(x)=2x$, sebuah garis lurus. Untuk $f(x)=x^3-3x$ grafiknya naik ke puncak di $x=-1$, turun melewati $x=0$ dengan gradien $-3$ (penurunan paling curam) dan naik lagi setelah lembah di $x=1$, sehingga $f'(x)=3x^2-3$ adalah parabola yang memotong sumbu di $-1$ dan $1$ dan memiliki titik terendah di $x=0$.

Pembacaan gradien yang sama menjelaskan mengapa turunan $\sin x$ adalah $\cos x$: gradien gelombang sinus nol di setiap puncak dan lembah, terbesar di tempat gelombang memotong sumbu sambil naik, dan hasilnya adalah gelombang yang sama yang digeser seperempat periode ke kiri.

Geser titik di bawah sepanjang sembilan grafik. Grafik atas memperlihatkan $f$ dan garis singgungnya; yang bawah menggambar $f'$ sampai titik itu, dengan tinggi titiknya adalah gradien garis singgung di atasnya.`,
          ),
        },
        {
          kind: 'figure',
          figure: {
            dim: 2,
            ticks: true,
            xSpan: [-3, 3],
            ySpan: [-4.5, 6],
            aspect: 0.6,
            items: [
              { t: 'curve', f: 'x^3-3*x', color: 'a' },
              { t: 'curve', f: '3*x^2-3', color: 'b' },
              { t: 'point', at: [-1, 2], label: 'A', color: 'a' },
              { t: 'point', at: [1, -2], label: 'B', color: 'a' },
              { t: 'point', at: [-1, 0], label: "A'", color: 'b' },
              { t: 'point', at: [1, 0], label: "B'", color: 'b' },
            ],
            caption: L(
              'The cubic f(x) = x³ − 3x (green) has a peak at A and a valley at B, where its tangent is horizontal; its derivative f′(x) = 3x² − 3 (orange) is zero exactly there, at A′ and B′, positive where f rises and negative between them.',
              'Fungsi kubik f(x) = x³ − 3x (hijau) memiliki puncak di A dan lembah di B, tempat garis singgungnya mendatar; turunannya f′(x) = 3x² − 3 (jingga) bernilai nol tepat di sana, di A′ dan B′, positif di tempat f naik dan negatif di antara keduanya.',
            ),
          },
        },
        { kind: 'widget', name: 'derivgraph' },
      ],
    },

    /* ------------------------------------------------------------------ segments */
    {
      id: 'segments',
      heading: L('What is the derivative of a graph made of line segments?', 'Apa turunan grafik yang tersusun dari ruas garis?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The derivative of a graph made of line segments is a step function: on each segment it equals the slope of that segment, and at a corner, where two segments with different slopes meet, it has no value.** Each segment is a piece of a line $y=mx+b$, whose derivative is the constant $m$.

Take the graph through $(0,0)$, $(2,4)$, $(5,4)$, $(7,0)$ and $(9,2)$. Its segments have slopes $\frac{4-0}{2-0}=2$, $0$, $\frac{0-4}{7-5}=-2$ and $\frac{2-0}{9-7}=1$, so $f'$ is $2$ on $(0,2)$, $0$ on $(2,5)$, $-2$ on $(5,7)$ and $1$ on $(7,9)$. At $x=2$, $5$ and $7$ the one-sided slopes differ (on the left and right of $x=2$ they are $2$ and $0$), so the right-hand and left-hand derivatives disagree and $f'$ does not exist: the graph of $f'$ has an open circle on each side of every corner. At the two ends of the graph only one side exists, a one-sided derivative.

A vertex is only a corner if the slopes really differ. If the pieces on either side lie on the same line, as in $(0,0)$, $(1,1)$, $(3,3)$, $(4,1)$ at $x=1$, the vertex is not a corner and $f'$ has the value $1$ there.

Going backwards works too, with one thing missing. Given the steps of $f'$ you can rebuild the graph by walking along: start at a point, follow slope $m_1$ to the first break, then $m_2$, and so on. Starting at $(0,0)$ with slope $3$ until $x=2$, then $0$ until $4$, then $-1$ until $6$, then $2$ until $8$ gives the vertices $(0,0)$, $(2,6)$, $(4,6)$, $(6,4)$ and $(8,8)$. The starting point has to be given: moving a graph up or down changes no slope, so a derivative alone determines the graph only up to a constant.

Try both directions below. Type the corners of a graph, or the steps of a derivative, and read off the other one.`,
            T`**Turunan grafik yang tersusun dari ruas garis adalah fungsi tangga: pada tiap ruas ia sama dengan gradien ruas itu, dan di sudut tajam, tempat dua ruas dengan gradien berbeda bertemu, ia tidak bernilai.** Setiap ruas adalah bagian dari garis $y=mx+b$, yang turunannya adalah konstanta $m$.

Ambil grafik yang melalui $(0,0)$, $(2,4)$, $(5,4)$, $(7,0)$, dan $(9,2)$. Gradien ruas-ruasnya adalah $\frac{4-0}{2-0}=2$, $0$, $\frac{0-4}{7-5}=-2$, dan $\frac{2-0}{9-7}=1$, sehingga $f'$ bernilai $2$ pada $(0,2)$, $0$ pada $(2,5)$, $-2$ pada $(5,7)$, dan $1$ pada $(7,9)$. Di $x=2$, $5$, dan $7$ gradien sepihaknya berbeda (di kiri dan kanan $x=2$ berturut-turut $2$ dan $0$), sehingga turunan kanan dan turunan kiri tidak sama dan $f'$ tidak ada: grafik $f'$ memiliki lingkaran terbuka di kedua sisi setiap sudut tajam. Di kedua ujung grafik hanya ada satu sisi, turunan sepihak.

Sebuah titik sudut hanya merupakan sudut tajam bila gradiennya benar-benar berbeda. Jika ruas di kedua sisinya terletak pada garis yang sama, seperti pada $(0,0)$, $(1,1)$, $(3,3)$, $(4,1)$ di $x=1$, titik itu bukan sudut tajam dan $f'$ bernilai $1$ di sana.

Arah sebaliknya juga bisa, dengan satu hal yang hilang. Dari anak tangga $f'$ kamu dapat membangun kembali grafiknya dengan berjalan: mulai dari sebuah titik, ikuti gradien $m_1$ sampai patahan pertama, lalu $m_2$, dan seterusnya. Mulai dari $(0,0)$ dengan gradien $3$ sampai $x=2$, lalu $0$ sampai $4$, lalu $-1$ sampai $6$, lalu $2$ sampai $8$, memberi titik sudut $(0,0)$, $(2,6)$, $(4,6)$, $(6,4)$, dan $(8,8)$. Titik awalnya harus diberikan: menggeser grafik ke atas atau ke bawah tidak mengubah gradien mana pun, sehingga turunan saja menentukan grafik hanya sampai sebuah konstanta.

Cobalah kedua arah di bawah. Ketik titik sudut sebuah grafik, atau anak tangga sebuah turunan, dan baca yang lainnya.`,
          ),
        },
        { kind: 'widget', name: 'derivsteps' },
      ],
    },

    /* ----------------------------------------------------------- where defined */
    {
      id: 'where-defined',
      heading: L('Where is a derivative function defined?', 'Di mana fungsi turunan terdefinisi?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A derivative function is defined at the points where the limit exists, which can be fewer than the points where $f$ is defined: it is missing at corners, cusps, vertical tangents and jumps, and at the end of a closed interval only a one-sided derivative can exist.** The five ways a derivative can fail are in the section on [functions with no derivative](article:tangent-lines-and-derivative-at-a-point#no-derivative); here the question is what that does to the *function* $f'$.

**Open and closed intervals.** $f$ is *differentiable on an open interval* (finite or infinite) if it has a derivative at every point of it. It is *differentiable on a closed interval* $[a,b]$ if it is differentiable on $(a,b)$ and the one-sided limits exist at the ends: the *right-hand derivative* at $a$ and the *left-hand derivative* at $b$,
$$\lim_{h\to0^+}\frac{f(a+h)-f(a)}{h},$$
$$\lim_{h\to0^-}\frac{f(b+h)-f(b)}{h}.$$ At an interior point the derivative exists exactly when the left-hand and right-hand derivatives both exist and are equal.

**The absolute value.** For $x>0$, $|x|=x$ has derivative $1$, and for $x<0$, $|x|=-x$ has derivative $-1$. At $0$ the right-hand derivative is $1$ and the left-hand one is $-1$, so there is none. The derivative function is $-1$ for $x<0$ and $1$ for $x>0$ (for $x\ne0$ it can be written $\frac{x}{|x|}$), with no value at $0$. So $f=|x|$ is differentiable on $(-\infty,0)$ and on $(0,\infty)$ but not at $0$, and the domain of $f'$ leaves out the corner.

**The square root.** At $0$ the secant slopes of $\sqrt x$ are $\frac{\sqrt h}{h}=\frac1{\sqrt h}$, which grows without bound, so there is no derivative at $0$ and the graph has a vertical tangent there. The domain of $f'$ is $(0,\infty)$, one point smaller than that of $f$.

**A derivative need not be continuous.** If $f$ is differentiable at a point it is [continuous there](article:tangent-lines-and-derivative-at-a-point#no-derivative), but the derivative function can still behave badly. Let $f(x)=x^2\sin\frac1x$ for $x\ne0$ and $f(0)=0$. At $0$ the difference quotient is $h\sin\frac1h$, which tends to $0$, so $f'(0)=0$. For $x\ne0$ the formulas give $f'(x)=2x\sin\frac1x-\cos\frac1x$, and as $x\to0$ the term $2x\sin\frac1x$ vanishes but $\cos\frac1x$ keeps swinging between $-1$ and $1$. So $f$ is differentiable everywhere and $f'$ is not continuous at $0$. The last graph in the tool above shows it.`,
            T`**Fungsi turunan terdefinisi di titik-titik tempat limitnya ada, yang dapat lebih sedikit daripada titik tempat $f$ terdefinisi: ia hilang pada sudut tajam, cusp, garis singgung tegak, dan lompatan, dan di ujung selang tertutup hanya turunan sepihak yang dapat ada.** Lima cara turunan dapat gagal ada pada bagian tentang [fungsi tanpa turunan](article:tangent-lines-and-derivative-at-a-point#no-derivative); di sini pertanyaannya adalah apa akibatnya bagi *fungsi* $f'$.

**Selang terbuka dan tertutup.** $f$ *terdiferensialkan pada selang terbuka* (hingga atau tak hingga) bila ia memiliki turunan di setiap titiknya. Ia *terdiferensialkan pada selang tertutup* $[a,b]$ bila ia terdiferensialkan pada $(a,b)$ dan limit-limit sepihak ada di ujung-ujungnya: *turunan kanan* di $a$ dan *turunan kiri* di $b$,
$$\lim_{h\to0^+}\frac{f(a+h)-f(a)}{h},$$
$$\lim_{h\to0^-}\frac{f(b+h)-f(b)}{h}.$$ Di titik dalam, turunan ada tepat bila turunan kiri dan turunan kanan keduanya ada dan sama.

**Nilai mutlak.** Untuk $x>0$, $|x|=x$ memiliki turunan $1$, dan untuk $x<0$, $|x|=-x$ memiliki turunan $-1$. Di $0$ turunan kanannya $1$ dan turunan kirinya $-1$, sehingga tidak ada turunan. Fungsi turunannya adalah $-1$ untuk $x<0$ dan $1$ untuk $x>0$ (untuk $x\ne0$ dapat ditulis $\frac{x}{|x|}$), tanpa nilai di $0$. Jadi $f=|x|$ terdiferensialkan pada $(-\infty,0)$ dan pada $(0,\infty)$ tetapi tidak di $0$, dan daerah asal $f'$ meninggalkan sudut tajamnya.

**Akar kuadrat.** Di $0$ gradien garis potong $\sqrt x$ adalah $\frac{\sqrt h}{h}=\frac1{\sqrt h}$, yang membesar tanpa batas, sehingga tidak ada turunan di $0$ dan grafiknya memiliki garis singgung tegak di sana. Daerah asal $f'$ adalah $(0,\infty)$, satu titik lebih kecil daripada daerah asal $f$.

**Turunan tidak harus kontinu.** Jika $f$ terdiferensialkan di suatu titik, ia [kontinu di sana](article:tangent-lines-and-derivative-at-a-point#no-derivative), tetapi fungsi turunannya masih dapat berperilaku buruk. Misalkan $f(x)=x^2\sin\frac1x$ untuk $x\ne0$ dan $f(0)=0$. Di $0$ hasil bagi selisihnya adalah $h\sin\frac1h$, yang menuju $0$, sehingga $f'(0)=0$. Untuk $x\ne0$ rumusnya memberi $f'(x)=2x\sin\frac1x-\cos\frac1x$, dan saat $x\to0$ suku $2x\sin\frac1x$ menghilang tetapi $\cos\frac1x$ terus berayun di antara $-1$ dan $1$. Jadi $f$ terdiferensialkan di mana-mana dan $f'$ tidak kontinu di $0$. Grafik terakhir pada alat di atas memperlihatkannya.`,
          ),
        },
        {
          kind: 'figure',
          figure: {
            dim: 2,
            ticks: true,
            xSpan: [-3, 3],
            ySpan: [-1.8, 3.2],
            aspect: 1.2,
            items: [
              { t: 'curve', f: 'abs(x)', color: 'a' },
              { t: 'seg', from: [-3, -1], to: [0, -1], color: 'b', width: 3 },
              { t: 'seg', from: [0, 1], to: [3, 1], color: 'b', width: 3 },
              { t: 'dot', x: 0, y: -1, open: true, color: 'b' },
              { t: 'dot', x: 0, y: 1, open: true, color: 'b' },
            ],
            caption: L(
              'The graph of |x| (green) and its derivative (orange): −1 to the left of 0, +1 to the right, and an open circle on each side at 0, where there is no value.',
              'Grafik |x| (hijau) dan turunannya (jingga): −1 di kiri 0, +1 di kanan, dan lingkaran terbuka di tiap sisi di 0, yang tidak bernilai.',
            ),
          },
        },
      ],
    },

    /* ----------------------------------------------------------------- in code */
    {
      id: 'derivative-functions-in-code',
      heading: L('How do you compute and plot a derivative function in code?', 'Bagaimana menghitung dan memplot fungsi turunan dalam kode?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Differentiate symbolically with SymPy to get an exact formula, or numerically with a central difference on a grid when all you have is numbers; either way the derivative is an object you can evaluate and plot.** SymPy works on the formula and returns the formula for $f'$, so ´diff´ is differentiation as an operation on a function. It may need ´simplify´ to put the answer in the form you would write by hand: for $\frac{x}{x-1}$ it first returns $-\frac{x}{(x-1)^2}+\frac{1}{x-1}$, which equals $-\frac{1}{(x-1)^2}$, the result of the definition above.`,
            T`**Dalam kode, turunkan secara simbolik dengan SymPy untuk memperoleh rumus eksak, atau secara numerik dengan selisih terpusat pada sebuah grid bila yang kamu miliki hanya bilangan; keduanya menghasilkan turunan yang dapat dievaluasi dan diplot.** SymPy bekerja pada rumus dan mengembalikan rumus $f'$, sehingga ´diff´ adalah diferensiasi sebagai operasi pada fungsi. Ia mungkin memerlukan ´simplify´ untuk menuliskan jawaban dalam bentuk yang kamu tulis dengan tangan: untuk $\frac{x}{x-1}$ ia lebih dulu mengembalikan $-\frac{x}{(x-1)^2}+\frac{1}{x-1}$, yang sama dengan $-\frac{1}{(x-1)^2}$, hasil dari definisi di atas.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: the derivative function exactly, with SymPy', 'Python: fungsi turunan secara eksak, dengan SymPy'),
          code: `import sympy as sp

x = sp.symbols('x')
f = x / (x - 1)
print(sp.diff(f, x))              # -x/(x - 1)**2 + 1/(x - 1)
print(sp.simplify(sp.diff(f, x))) # -1/(x - 1)**2
print(sp.diff(sp.sqrt(x), x))     # 1/(2*sqrt(x))
print(sp.diff(1 / x, x))          # -1/x**2`,
        },
        {
          kind: 'text',
          text: L(
            T`**With numbers only, a derivative function is a function that returns a difference quotient.** The first block below builds one from any function: ´derivative(f)´ returns a new function, so the derivative really is a function in the program too. The second block differentiates samples on a grid with NumPy. On a grid of spacing $0.5$ for $x^3-3x$ the interior values are off by exactly $h^2=0.25$ (the error of a central difference), but at the two ends NumPy can only use one side, a one-sided derivative, and it is off by $2.75$: the same endpoint story as on a closed interval.`,
            T`**Dengan bilangan saja, fungsi turunan adalah fungsi yang mengembalikan hasil bagi selisih.** Blok pertama di bawah membangunnya dari fungsi apa pun: ´derivative(f)´ mengembalikan fungsi baru, sehingga turunan benar-benar sebuah fungsi dalam program juga. Blok kedua menurunkan sampel pada sebuah grid dengan NumPy. Pada grid berjarak $0{,}5$ untuk $x^3-3x$ nilai-nilai di bagian dalam meleset tepat $h^2=0{,}25$ (galat selisih terpusat), tetapi di kedua ujung NumPy hanya dapat memakai satu sisi, turunan sepihak, dan melesetnya $2{,}75$: cerita ujung yang sama seperti pada selang tertutup.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: a derivative function, and one on a grid', 'Python: sebuah fungsi turunan, dan satu pada sebuah grid'),
          code: `import numpy as np

def derivative(f, h=1e-5):
    """The derivative of f, as a new function (central difference)."""
    return lambda x: (f(x + h) - f(x - h)) / (2 * h)

g = derivative(lambda t: t**3 - 3*t)
print([round(g(t), 6) for t in (-2, -1, 0, 1, 2)])   # [9.0, 0.0, -3.0, 0.0, 9.0]

xs = np.linspace(-2, 2, 9)                   # spacing 0.5
ys = xs**3 - 3*xs
dy = np.gradient(ys, xs)                     # central inside, one-sided at the ends
print(dy)                                    # [ 6.25  4.    0.25 -2.   -2.75 -2.    0.25  4.    6.25]
print(3*xs**2 - 3)                           # [ 9.    3.75  0.   -2.25 -3.   -2.25  0.    3.75  9.  ]
print(np.round(dy - (3*xs**2 - 3), 4))       # [-2.75  0.25  0.25  0.25  0.25  0.25  0.25  0.25 -2.75]`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++', 'C++'),
          code: `#include <iostream>
#include <cstdio>
using namespace std;

double f(double t) { return t * t * t - 3 * t; }
double derivative(double x, double h) { return (f(x + h) - f(x - h)) / (2 * h); }   // central difference

int main() {
  for (int t = -2; t <= 2; t++) printf("%.4f ", derivative(t, 1e-5));   // 9 0 -3 0 9
  cout << endl;

  double xs[9], ys[9], dy[9];                          // a grid with spacing 0.5
  for (int i = 0; i < 9; i++) { xs[i] = -2 + 0.5 * i; ys[i] = f(xs[i]); }
  dy[0] = (ys[1] - ys[0]) / 0.5;                       // one-sided at the ends
  dy[8] = (ys[8] - ys[7]) / 0.5;
  for (int i = 1; i < 8; i++) dy[i] = (ys[i + 1] - ys[i - 1]) / 1.0;   // central inside
  for (int i = 0; i < 9; i++) printf("%6.2f", dy[i]);
  cout << endl;
  for (int i = 0; i < 9; i++) printf("%6.2f", 3 * xs[i] * xs[i] - 3);   // the exact derivative
  cout << endl;
  for (int i = 0; i < 9; i++) printf("%6.2f", dy[i] - (3 * xs[i] * xs[i] - 3));   // the ends are worst
  cout << endl;
  return 0;
}

/* output:
9.0000 0.0000 -3.0000 0.0000 9.0000
  6.25  4.00  0.25 -2.00 -2.75 -2.00  0.25  4.00  6.25
  9.00  3.75  0.00 -2.25 -3.00 -2.25  0.00  3.75  9.00
 -2.75  0.25  0.25  0.25  0.25  0.25  0.25  0.25 -2.75
*/`,
        },
      ],
    },

    /* ----------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where do the names and symbols of the derivative come from?', 'Dari mana asal nama dan lambang turunan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The ideas are older than the symbols: the three notations in use today come from Leibniz, Newton and Lagrange, and the word "derivative" itself is French.**

- **Leibniz.** Gottfried Leibniz introduced $dx$ and $dy$, together with the integral sign, in manuscripts of 1675 and published his differential calculus in 1684. His $\frac{dy}{dx}$ was meant as a ratio of tiny differences, which is why it is still so convenient when changing variables, and it names the variable.
- **Newton.** Isaac Newton wrote the rate of change of a flowing quantity $y$ with a dot over the letter, ẏ, which he called its fluxion. The dot survives in physics for derivatives with respect to time.
- **Lagrange.** Joseph-Louis Lagrange wanted to base calculus on algebra and called the function obtained from $f$ its *fonction dérivée*, the derived function, in his *Théorie des fonctions analytiques* (1797). The words "derivative" and the prime $f'(x)$ come from there.
- **Arbogast.** Louis Arbogast introduced the operator letter $D$ for the operation of differentiating in 1800, which is the notation used for $Df(x)$ and $D^2f$.

The limit definition that this article starts from is later and is described in the history in the article on [tangent lines](article:tangent-lines-and-derivative-at-a-point#history).`,
            T`**Gagasannya lebih tua daripada lambangnya: tiga notasi yang dipakai sekarang berasal dari Leibniz, Newton, dan Lagrange, dan kata "turunan" sendiri berasal dari bahasa Prancis.**

- **Leibniz.** Gottfried Leibniz memperkenalkan $dx$ dan $dy$, bersama tanda integral, dalam naskah tahun 1675 dan menerbitkan kalkulus diferensialnya pada 1684. $\frac{dy}{dx}$-nya dimaksudkan sebagai perbandingan selisih-selisih kecil, itulah sebabnya ia tetap praktis saat mengganti peubah, dan ia menyebut peubahnya.
- **Newton.** Isaac Newton menulis laju perubahan besaran yang mengalir $y$ dengan sebuah titik di atas hurufnya, ẏ, yang ia sebut fluksinya. Titik itu bertahan dalam fisika untuk turunan terhadap waktu.
- **Lagrange.** Joseph-Louis Lagrange ingin mendasarkan kalkulus pada aljabar dan menyebut fungsi yang diperoleh dari $f$ sebagai *fonction dérivée*, fungsi turunan, dalam *Théorie des fonctions analytiques* (1797). Kata "turunan" dan aksen $f'(x)$ berasal dari sana.
- **Arbogast.** Louis Arbogast memperkenalkan huruf operator $D$ untuk operasi menurunkan pada 1800, yaitu notasi yang dipakai pada $Df(x)$ dan $D^2f$.

Definisi limit yang menjadi titik tolak artikel ini lebih kemudian dan diuraikan dalam sejarah pada artikel tentang [garis singgung](article:tangent-lines-and-derivative-at-a-point#history).`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What mistakes do people make with the derivative function?', 'Kesalahan apa yang sering terjadi pada fungsi turunan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with the derivative as a function are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ $f'(x)=f(x+h)-f(x)$, with the division forgotten | The slope needs the division by $h$: $f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}$. The top alone tends to $0$. |
| ❌ $f(x+h)=f(x)+h$ | Substitute $x+h$ for every $x$: $(x+h)^2=x^2+2xh+h^2$, not $x^2+h$. |
| ❌ The derivative of $\frac1x$ is $\frac1{x^2}$ | $\frac{d}{dx}\frac1x=-\frac{1}{x^2}$: the sign matters, and $\frac1x$ is falling, so its slope is negative. |
| ❌ $f'$ is defined wherever $f$ is | $\sqrt x$ is defined at $0$ but $\sqrt x$ has no derivative there; the domain of $f'$ can be smaller. |
| ❌ The derivative of the absolute value of $x$ is $1$ | It is $-1$ for $x<0$, $1$ for $x>0$ and does not exist at $0$. |
| ❌ $\frac{dy}{dx}$ is a fraction whose $d$'s you can cancel | It is one symbol for the derivative; $\frac{dy}{dx}$ is not "$d$ times $y$ over $d$ times $x$". |
| ❌ The graph of $f'$ is the graph of $f$ moved or stretched | Its height is the *slope* of $f$: at a peak of $f$ the graph of $f'$ crosses zero; it is not high there. |
| ❌ A corner of $f$ gives the value $0$ for $f'$ | At a corner $f'$ does not exist: the graph of $f'$ has a gap, with different one-sided values. |
| ❌ If $f$ is differentiable everywhere, $f'$ must be continuous | $x^2\sin\frac1x$ is differentiable everywhere, yet its derivative oscillates near $0$ and is not continuous. |`,
            T`**Kesalahan paling umum pada turunan sebagai fungsi adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ $f'(x)=f(x+h)-f(x)$, pembagiannya terlupa | Gradien memerlukan pembagian dengan $h$: $f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}$. Pembilang saja menuju $0$. |
| ❌ $f(x+h)=f(x)+h$ | Gantikan $x+h$ untuk setiap $x$: $(x+h)^2=x^2+2xh+h^2$, bukan $x^2+h$. |
| ❌ Turunan $\frac1x$ adalah $\frac1{x^2}$ | $\frac{d}{dx}\frac1x=-\frac{1}{x^2}$: tandanya penting, dan $\frac1x$ menurun, sehingga gradiennya negatif. |
| ❌ $f'$ terdefinisi di mana pun $f$ terdefinisi | $\sqrt x$ terdefinisi di $0$ tetapi tidak memiliki turunan di sana; daerah asal $f'$ dapat lebih kecil. |
| ❌ Turunan nilai mutlak $x$ adalah $1$ | Ia $-1$ untuk $x<0$, $1$ untuk $x>0$, dan tidak ada di $0$. |
| ❌ $\frac{dy}{dx}$ adalah pecahan yang $d$-nya dapat dicoret | Ia satu lambang untuk turunan; $\frac{dy}{dx}$ bukan "$d$ kali $y$ per $d$ kali $x$". |
| ❌ Grafik $f'$ adalah grafik $f$ yang digeser atau diregangkan | Tingginya adalah *gradien* $f$: di puncak $f$ grafik $f'$ memotong nol; ia tidak tinggi di sana. |
| ❌ Sudut tajam pada $f$ memberi nilai $0$ untuk $f'$ | Di sudut tajam $f'$ tidak ada: grafik $f'$ memiliki celah, dengan nilai sepihak yang berbeda. |
| ❌ Jika $f$ terdiferensialkan di mana-mana, $f'$ pasti kontinu | $x^2\sin\frac1x$ terdiferensialkan di mana-mana, tetapi turunannya berosilasi di dekat $0$ dan tidak kontinu. |`,
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
              L('The derivative $f\'$ of a function $f$ is itself a function of $x$.', 'Turunan $f\'$ dari fungsi $f$ sendiri adalah fungsi dari $x$.'),
              L('The domain of $f\'$ is always the same as the domain of $f$.', 'Daerah asal $f\'$ selalu sama dengan daerah asal $f$.'),
              L('The symbol $\\frac{dy}{dx}$ is a fraction in which the $d$\'s can be cancelled.', 'Lambang $\\frac{dy}{dx}$ adalah pecahan yang $d$-nya dapat dicoret.'),
              L('The derivative of $|x|$ does not exist at $0$.', 'Turunan $|x|$ tidak ada di $0$.'),
              L('The derivative of a constant function is $0$.', 'Turunan fungsi konstan adalah $0$.'),
              L('If $f$ is differentiable everywhere, then $f\'$ is continuous everywhere.', 'Jika $f$ terdiferensialkan di mana-mana, maka $f\'$ kontinu di mana-mana.'),
            ],
            answer: [true, false, false, true, true, false],
            explain: L(
              '$f\'$ takes each $x$ to a slope, so it is a function. $\\sqrt x$ shows that its domain can be smaller, $\\frac{dy}{dx}$ is one symbol, $|x|$ has a corner at $0$, a constant has slope $0$, and $x^2\\sin\\frac1x$ is differentiable everywhere with a derivative that is not continuous.',
              '$f\'$ memetakan setiap $x$ ke gradien, sehingga ia fungsi. $\\sqrt x$ menunjukkan daerah asalnya dapat lebih kecil, $\\frac{dy}{dx}$ adalah satu lambang, $|x|$ bersudut tajam di $0$, konstanta bergradien $0$, dan $x^2\\sin\\frac1x$ terdiferensialkan di mana-mana dengan turunan yang tidak kontinu.',
            ),
            hint: L('Think of a few examples: $\\sqrt x$, $|x|$, $x^2\\sin\\frac1x$.', 'Pikirkan beberapa contoh: $\\sqrt x$, $|x|$, $x^2\\sin\\frac1x$.'),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L('Choose **all** the notations for the derivative of $y=f(x)$.', 'Pilih **semua** notasi untuk turunan $y=f(x)$.'),
            options: [
              L('$f\'(x)$', '$f\'(x)$'),
              L('$\\frac{dy}{dx}$', '$\\frac{dy}{dx}$'),
              L('$Df(x)$', '$Df(x)$'),
              L('$\\frac{d}{dx}f(x)$', '$\\frac{d}{dx}f(x)$'),
              L('$\\frac{\\Delta y}{\\Delta x}$', '$\\frac{\\Delta y}{\\Delta x}$'),
            ],
            answer: [0, 1, 2, 3],
            explain: L(
              'The first four all name the derivative function. $\\frac{\\Delta y}{\\Delta x}$ is an average rate of change over a step, a difference quotient, not the limit.',
              'Empat yang pertama semuanya menamai fungsi turunan. $\\frac{\\Delta y}{\\Delta x}$ adalah laju perubahan rata-rata pada suatu langkah, hasil bagi selisih, bukan limitnya.',
            ),
            hint: L('A derivative is a limit; one of these is not.', 'Turunan adalah limit; salah satunya bukan.'),
          },
        },
        {
          kind: 'activity',
          title: L('A derivative from the definition', 'Turunan dari definisi'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L('Expand: $(x+h)^3=x^3+3x^2h+3xh^2+h^3$.', 'Jabarkan: $(x+h)^3=x^3+3x^2h+3xh^2+h^3$.'), L('Divide by $h$ and let $h\\to0$: $3x^2+3xh+h^2\\to3x^2$.', 'Bagi dengan $h$ dan biarkan $h\\to0$: $3x^2+3xh+h^2\\to3x^2$.')],
            explain: L('$f\'(x)=3x^2$, so $f\'(2)=3\\cdot4=12$.', '$f\'(x)=3x^2$, sehingga $f\'(2)=3\\cdot4=12$.'),
            prompt: L('For $f(x)=x^3$ the difference quotient simplifies to $3x^2+3xh+h^2$. Find $f\'(2)$.', 'Untuk $f(x)=x^3$ hasil bagi selisih menyederhana menjadi $3x^2+3xh+h^2$. Tentukan $f\'(2)$.'),
            given: String.raw`f'(x)=3x^2,\quad f'(2)=v`,
            blanks: [{ label: "f'(2) =", answer: 12 }],
          },
        },
        {
          kind: 'activity',
          title: L('The derivative of 1/x', 'Turunan 1/x'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L('$f\'(x)=-\\frac{1}{x^2}$.', '$f\'(x)=-\\frac{1}{x^2}$.'), L('At $x=-2$: $-\\frac{1}{(-2)^2}=-\\frac14$.', 'Di $x=-2$: $-\\frac{1}{(-2)^2}=-\\frac14$.')],
            explain: L('$f\'(-2)=-\\frac{1}{(-2)^2}=-\\frac14=-0.25$: the squared denominator is positive, so the slope stays negative.', '$f\'(-2)=-\\frac{1}{(-2)^2}=-\\frac14=-0{,}25$: penyebut yang dikuadratkan positif, sehingga gradiennya tetap negatif.'),
            prompt: L('Use $f\'(x)=-\\frac{1}{x^2}$ for $f(x)=\\frac1x$ to find the slope at $x=-2$ (a fraction or a decimal).', 'Pakai $f\'(x)=-\\frac{1}{x^2}$ untuk $f(x)=\\frac1x$ guna mencari gradien di $x=-2$ (pecahan atau desimal).'),
            given: String.raw`f'(-2)=-\frac{1}{(-2)^2}=v`,
            blanks: [{ label: "f'(-2) =", answer: -0.25 }],
          },
        },
        {
          kind: 'activity',
          title: L('A square root', 'Sebuah akar kuadrat'),
          step: {
            kind: 'quiz',
            id: 'p5',
            prompt: L('What is the derivative of $\\sqrt x$ for $x>0$?', 'Berapa turunan $\\sqrt x$ untuk $x>0$?'),
            options: [L('$\\frac{1}{2\\sqrt x}$', '$\\frac{1}{2\\sqrt x}$'), L('$\\frac{1}{\\sqrt x}$', '$\\frac{1}{\\sqrt x}$'), L('$2\\sqrt x$', '$2\\sqrt x$'), L('$\\frac{1}{2x}$', '$\\frac{1}{2x}$')],
            answer: 0,
            explain: L('$\\frac{\\sqrt z-\\sqrt x}{z-x}=\\frac{1}{\\sqrt z+\\sqrt x}\\to\\frac{1}{2\\sqrt x}$ as $z\\to x$.', '$\\frac{\\sqrt z-\\sqrt x}{z-x}=\\frac{1}{\\sqrt z+\\sqrt x}\\to\\frac{1}{2\\sqrt x}$ saat $z\\to x$.'),
            hint: L('Multiply top and bottom by $\\sqrt z+\\sqrt x$.', 'Kalikan pembilang dan penyebut dengan $\\sqrt z+\\sqrt x$.'),
          },
        },
        {
          kind: 'activity',
          title: L('A domain', 'Sebuah daerah asal'),
          step: {
            kind: 'quiz',
            id: 'p6',
            prompt: L('The domain of $f(x)=\\sqrt x$ is $[0,\\infty)$. What is the domain of $f\'$?', 'Daerah asal $f(x)=\\sqrt x$ adalah $[0,\\infty)$. Apa daerah asal $f\'$?'),
            options: [L('$[0,\\infty)$', '$[0,\\infty)$'), L('$(0,\\infty)$', '$(0,\\infty)$'), L('all real numbers', 'semua bilangan real'), L('$(-\\infty,0)$', '$(-\\infty,0)$')],
            answer: 1,
            explain: L('$f\'(x)=\\frac{1}{2\\sqrt x}$ blows up as $x\\to0^+$: the graph has a vertical tangent at $0$, so $f\'$ is defined only for $x>0$.', '$f\'(x)=\\frac{1}{2\\sqrt x}$ membesar saat $x\\to0^+$: grafiknya memiliki garis singgung tegak di $0$, sehingga $f\'$ hanya terdefinisi untuk $x>0$.'),
            hint: L('Is there a finite slope at $x=0$?', 'Adakah gradien hingga di $x=0$?'),
          },
        },
        {
          kind: 'activity',
          title: L('The absolute value', 'Nilai mutlak'),
          step: {
            kind: 'quiz',
            id: 'p7',
            prompt: L('For $x<0$, what is the derivative of $|x|$?', 'Untuk $x<0$, berapa turunan $|x|$?'),
            options: [L('$-1$', '$-1$'), L('$1$', '$1$'), L('$0$', '$0$'), L('$-x$', '$-x$')],
            answer: 0,
            explain: L('For $x<0$, $|x|=-x$, a line of slope $-1$.', 'Untuk $x<0$, $|x|=-x$, garis bergradien $-1$.'),
            hint: L('Write $|x|$ without the bars for negative $x$.', 'Tulis $|x|$ tanpa tanda mutlak untuk $x$ negatif.'),
          },
        },
        {
          kind: 'activity',
          title: L('Reading a graph', 'Membaca grafik'),
          step: {
            kind: 'quiz',
            id: 'p8',
            prompt: L('The graph of $f$ is an upward-opening parabola with its vertex at $x=3$. What does the graph of $f\'$ look like?', 'Grafik $f$ adalah parabola membuka ke atas dengan puncak di $x=3$. Seperti apa grafik $f\'$?'),
            options: [
              L('a rising straight line that crosses the axis at $x=3$', 'garis lurus naik yang memotong sumbu di $x=3$'),
              L('a parabola with its vertex at $x=3$', 'parabola dengan puncak di $x=3$'),
              L('a horizontal line', 'garis mendatar'),
              L('a falling straight line through $x=3$', 'garis lurus turun melalui $x=3$'),
            ],
            answer: 0,
            explain: L('The slope is negative left of the vertex, $0$ at the vertex and positive right of it, growing steadily: a rising line through $(3,0)$.', 'Gradiennya negatif di kiri puncak, $0$ di puncak, dan positif di kanannya, bertambah secara tetap: garis naik melalui $(3,0)$.'),
            hint: L('Ask what the slope does as you move from left to right.', 'Tanyakan apa yang terjadi pada gradien saat bergerak dari kiri ke kanan.'),
          },
        },
        {
          kind: 'activity',
          title: L('A slope from segments', 'Gradien dari ruas'),
          step: {
            kind: 'math',
            id: 'p9',
            hints: [L('Rise over run: $\\frac{11-2}{4-1}$.', 'Kenaikan per jarak mendatar: $\\frac{11-2}{4-1}$.'), L('$\\frac{9}{3}=3$.', '$\\frac{9}{3}=3$.')],
            explain: L('Between $(1,2)$ and $(4,11)$ the slope is $\\frac{11-2}{4-1}=3$, so $f\'=3$ on $(1,4)$.', 'Antara $(1,2)$ dan $(4,11)$ gradiennya $\\frac{11-2}{4-1}=3$, sehingga $f\'=3$ pada $(1,4)$.'),
            prompt: L('A graph runs along a straight segment from $(1,2)$ to $(4,11)$. What is $f\'$ between $x=1$ and $x=4$?', 'Sebuah grafik berjalan sepanjang ruas lurus dari $(1,2)$ ke $(4,11)$. Berapa $f\'$ antara $x=1$ dan $x=4$?'),
            given: String.raw`f'=\frac{11-2}{4-1}=v`,
            blanks: [{ label: "f' =", answer: 3 }],
          },
        },
        {
          kind: 'activity',
          title: L('A corner', 'Sebuah sudut tajam'),
          step: {
            kind: 'quiz',
            id: 'p10',
            prompt: L('A graph goes straight from $(0,0)$ up to $(2,2)$ and then straight down to $(4,0)$. What is $f\'(2)$?', 'Sebuah grafik naik lurus dari $(0,0)$ ke $(2,2)$ lalu turun lurus ke $(4,0)$. Berapa $f\'(2)$?'),
            options: [L('$1$', '$1$'), L('$-1$', '$-1$'), L('$0$', '$0$'), L('it does not exist', 'tidak ada')],
            answer: 3,
            explain: L('The slope is $1$ on the left and $-1$ on the right, so the one-sided derivatives differ: $f\'(2)$ does not exist. $0$ is the average, which means nothing here.', 'Gradiennya $1$ di kiri dan $-1$ di kanan, sehingga turunan sepihaknya berbeda: $f\'(2)$ tidak ada. $0$ adalah rata-rata, yang tidak berarti apa-apa di sini.'),
            hint: L('Compare the slopes on the two sides of $x=2$.', 'Bandingkan gradien di kedua sisi $x=2$.'),
          },
        },
        {
          kind: 'activity',
          title: L('A derivative that jumps around', 'Turunan yang melompat-lompat'),
          step: {
            kind: 'quiz',
            id: 'p11',
            prompt: L('Let $f(x)=x^2\\sin\\frac1x$ for $x\\ne0$ and $f(0)=0$. It is differentiable everywhere, with $f\'(0)=0$. Is $f\'$ continuous at $0$?', 'Misalkan $f(x)=x^2\\sin\\frac1x$ untuk $x\\ne0$ dan $f(0)=0$. Ia terdiferensialkan di mana-mana, dengan $f\'(0)=0$. Apakah $f\'$ kontinu di $0$?'),
            options: [L('yes, because $f$ is differentiable', 'ya, karena $f$ terdiferensialkan'), L('no: $f\'(x)=2x\\sin\\frac1x-\\cos\\frac1x$ keeps swinging near $0$', 'tidak: $f\'(x)=2x\\sin\\frac1x-\\cos\\frac1x$ terus berayun di dekat $0$'), L('yes, because $f\'(0)=0$ exists', 'ya, karena $f\'(0)=0$ ada'), L('no, because $f$ is not continuous', 'tidak, karena $f$ tidak kontinu')],
            answer: 1,
            explain: L('The term $2x\\sin\\frac1x$ tends to $0$ but $\\cos\\frac1x$ oscillates between $-1$ and $1$, so $f\'(x)$ has no limit at $0$ and does not equal $f\'(0)=0$.', 'Suku $2x\\sin\\frac1x$ menuju $0$ tetapi $\\cos\\frac1x$ berosilasi di antara $-1$ dan $1$, sehingga $f\'(x)$ tidak memiliki limit di $0$ dan tidak sama dengan $f\'(0)=0$.'),
            hint: L('What does $\\cos\\frac1x$ do as $x\\to0$?', 'Apa yang dilakukan $\\cos\\frac1x$ saat $x\\to0$?'),
          },
        },
        {
          kind: 'activity',
          title: L('A rational function', 'Fungsi rasional'),
          step: {
            kind: 'math',
            id: 'p12',
            hints: [L('Put $x=3$ in $-\\frac{1}{(x-1)^2}$.', 'Masukkan $x=3$ ke $-\\frac{1}{(x-1)^2}$.'), L('$(3-1)^2=4$.', '$(3-1)^2=4$.')],
            explain: L('$f\'(3)=-\\frac{1}{(3-1)^2}=-\\frac14$, and the secant slopes of $\\frac{x}{x-1}$ at $3$ do approach $-0.25$.', '$f\'(3)=-\\frac{1}{(3-1)^2}=-\\frac14$, dan gradien garis potong $\\frac{x}{x-1}$ di $3$ memang mendekati $-0{,}25$.'),
            prompt: L('For $f(x)=\\frac{x}{x-1}$ we found $f\'(x)=-\\frac{1}{(x-1)^2}$. What is $f\'(3)$ (a fraction or a decimal)?', 'Untuk $f(x)=\\frac{x}{x-1}$ kita peroleh $f\'(x)=-\\frac{1}{(x-1)^2}$. Berapa $f\'(3)$ (pecahan atau desimal)?'),
            given: String.raw`f'(3)=-\frac{1}{(3-1)^2}=v`,
            blanks: [{ label: "f'(3) =", answer: -0.25 }],
          },
        },
      ],
    },

    /* ----------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: the derivative as a function at a glance', 'Ringkasan: turunan sebagai fungsi sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Definition:** $f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}=\lim_{z\to x}\frac{f(z)-f(x)}{z-x}$, a function of $x$ whose domain is where the limit exists.
- **From the definition:** $x^2\to2x$, $x^3\to3x^2$, $\frac1x\to-\frac1{x^2}$, $\frac{x}{x-1}\to-\frac1{(x-1)^2}$, $\sqrt x\to\frac1{2\sqrt x}$; constants $\to0$, lines $mx+b\to m$.
- **Notation:** $f'(x)$, $y'$, $\frac{dy}{dx}$, $\frac{df}{dx}$, $\frac{d}{dx}f(x)$, $Df(x)$; $\frac{dy}{dx}\big|_{x=a}$ for a value; one symbol, not a fraction.
- **Graph of $f'$:** plot slopes; $f'>0$ rising, $f'<0$ falling, $f'=0$ flat; where $f'$ climbs, $f$ bends upward ($f''>0$).
- **Segments:** the derivative is a step function; a corner has no value; the derivative fixes a graph only up to a constant.
- **Domain:** open interval = every point; closed interval = also one-sided derivatives at the ends; missing at corners, cusps, vertical tangents, jumps.
- **Careful:** $f'$ need not be continuous ($x^2\sin\frac1x$); $f'(x)$ is not $f(x+h)-f(x)$ and not $\frac1{x^2}$ for $\frac1x$.
- **Code:** SymPy ´diff´ for the exact formula; a function that returns a central difference, or NumPy ´gradient´, for numbers.`,
            T`- **Definisi:** $f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}=\lim_{z\to x}\frac{f(z)-f(x)}{z-x}$, fungsi dari $x$ yang daerah asalnya adalah tempat limit ada.
- **Dari definisi:** $x^2\to2x$, $x^3\to3x^2$, $\frac1x\to-\frac1{x^2}$, $\frac{x}{x-1}\to-\frac1{(x-1)^2}$, $\sqrt x\to\frac1{2\sqrt x}$; konstanta $\to0$, garis $mx+b\to m$.
- **Notasi:** $f'(x)$, $y'$, $\frac{dy}{dx}$, $\frac{df}{dx}$, $\frac{d}{dx}f(x)$, $Df(x)$; $\frac{dy}{dx}\big|_{x=a}$ untuk sebuah nilai; satu lambang, bukan pecahan.
- **Grafik $f'$:** plot gradien; $f'>0$ naik, $f'<0$ turun, $f'=0$ datar; di tempat $f'$ naik, $f$ melengkung ke atas ($f''>0$).
- **Ruas garis:** turunannya fungsi tangga; sudut tajam tidak bernilai; turunan menentukan grafik hanya sampai sebuah konstanta.
- **Daerah asal:** selang terbuka = setiap titik; selang tertutup = juga turunan sepihak di ujung; hilang pada sudut tajam, cusp, garis singgung tegak, lompatan.
- **Hati-hati:** $f'$ tidak harus kontinu ($x^2\sin\frac1x$); $f'(x)$ bukan $f(x+h)-f(x)$ dan bukan $\frac1{x^2}$ untuk $\frac1x$.
- **Kode:** ´diff´ SymPy untuk rumus eksak; fungsi yang mengembalikan selisih terpusat, atau ´gradient´ NumPy, untuk bilangan.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Derivative function', 'Fungsi turunan'), definition: L('The function f prime whose value at each x is the derivative of f at that x, defined wherever the limit of the difference quotient exists.', 'Fungsi f aksen yang nilainya di setiap x adalah turunan f di x itu, terdefinisi di mana pun limit hasil bagi selisih ada.') },
    { term: L('Differentiation', 'Diferensiasi'), definition: L('The process of finding the derivative of a function; it is an operation that takes a function as input and returns another function.', 'Proses mencari turunan sebuah fungsi; ia adalah operasi yang menerima fungsi sebagai masukan dan mengembalikan fungsi lain.') },
    { term: L('Differentiable on an interval', 'Terdiferensialkan pada selang'), definition: L('Having a derivative at every point of an open interval, or, for a closed interval, on the inside plus one-sided derivatives at the two ends.', 'Memiliki turunan di setiap titik pada selang terbuka, atau, untuk selang tertutup, di bagian dalam ditambah turunan sepihak di kedua ujungnya.') },
    { term: L('Right-hand and left-hand derivatives', 'Turunan kanan dan turunan kiri'), definition: L('The limits of the difference quotient as h approaches zero from above and from below; a derivative exists at an inside point exactly when both exist and are equal.', 'Limit hasil bagi selisih saat h mendekati nol dari atas dan dari bawah; turunan ada di titik dalam tepat bila keduanya ada dan sama.') },
    { term: L('Prime notation', 'Notasi aksen'), definition: L('The way of writing a derivative with a prime, f prime of x or y prime, which goes back to Lagrange.', 'Cara menulis turunan dengan aksen, f aksen dari x atau y aksen, yang berasal dari Lagrange.') },
    { term: L("Leibniz notation", 'Notasi Leibniz'), definition: L('The way of writing a derivative as dy over dx, which names the variable and is read as the derivative of y with respect to x; it is one symbol, not a fraction to cancel.', 'Cara menulis turunan sebagai dy per dx, yang menyebut peubahnya dan dibaca turunan y terhadap x; ia satu lambang, bukan pecahan untuk dicoret.') },
    { term: L('Step function', 'Fungsi tangga'), definition: L('A function that is constant on each of several intervals, so its graph is a row of horizontal pieces; it is the derivative of a graph made of line segments.', 'Fungsi yang konstan pada tiap beberapa selang, sehingga grafiknya berupa deretan potongan mendatar; ia adalah turunan grafik yang tersusun dari ruas garis.') },
    { term: L('Second derivative', 'Turunan kedua'), definition: L('The derivative of the derivative, written f double prime; it is the rate of change of the slope and tells whether the graph bends upward or downward.', 'Turunan dari turunan, ditulis f aksen ganda; ia adalah laju perubahan gradien dan menyatakan apakah grafik melengkung ke atas atau ke bawah.') },
  ],

  howTo: [
    {
      name: L('How to find a derivative function from the definition', 'Cara mencari fungsi turunan dari definisi'),
      description: L('Write the difference quotient for a general x, simplify until h cancels, then let h approach zero.', 'Tulis hasil bagi selisih untuk x sembarang, sederhanakan sampai h tercoret, lalu biarkan h mendekati nol.'),
      steps: [
        { name: L('Write the quotient', 'Tulis hasil baginya'), text: L('Write f of x plus h minus f of x, all over h, with the formula for f put in and x left as a letter.', 'Tulis f dari x ditambah h dikurangi f dari x, seluruhnya dibagi h, dengan rumus f dimasukkan dan x dibiarkan sebagai huruf.') },
        { name: L('Simplify the top', 'Sederhanakan pembilangnya'), text: L('Expand a power, combine fractions over a common denominator, or multiply a root by its conjugate, until every term on top has a factor h.', 'Jabarkan pangkat, samakan penyebut pecahan, atau kalikan akar dengan sekawannya, sampai setiap suku di pembilang memiliki faktor h.') },
        { name: L('Cancel h', 'Coret h'), text: L('Divide top and bottom by h, which is allowed because h is not zero inside a limit.', 'Bagi pembilang dan penyebut dengan h, yang boleh karena h bukan nol di dalam limit.') },
        { name: L('Let h approach zero and state the domain', 'Biarkan h mendekati nol dan nyatakan daerah asalnya'), text: L('Replace h by zero in what is left, for example x squared gives 2x, and say for which x the answer holds, such as x not equal to 0 for 1 over x.', 'Ganti h dengan nol pada yang tersisa, misalnya x kuadrat memberi 2x, dan nyatakan untuk x mana jawabannya berlaku, seperti x tidak sama dengan 0 untuk 1 per x.') },
      ],
    },
    {
      name: L('How to sketch the graph of the derivative from the graph of a function', 'Cara membuat sketsa grafik turunan dari grafik sebuah fungsi'),
      description: L('Estimate the slope of the graph at frequent points and plot the slopes as heights.', 'Taksir gradien grafik di titik-titik yang rapat dan plot gradien itu sebagai tinggi.'),
      steps: [
        { name: L('Mark the flat spots', 'Tandai titik datar'), text: L('Find the peaks and valleys of the graph, where the tangent is horizontal; the derivative is zero there, so the new graph crosses the axis.', 'Cari puncak dan lembah grafik, tempat garis singgungnya mendatar; turunannya nol di sana, sehingga grafik baru memotong sumbu.') },
        { name: L('Read the sign between them', 'Baca tandanya di antaranya'), text: L('Where the graph rises the derivative is positive and its graph lies above the axis; where the graph falls it lies below.', 'Di tempat grafik naik turunannya positif dan grafiknya berada di atas sumbu; di tempat grafik turun ia berada di bawah.') },
        { name: L('Estimate the sizes', 'Taksir besarnya'), text: L('Sketch tangent lines at several points and estimate each slope; the steeper the graph, the farther the new graph is from the axis.', 'Gambar garis singgung di beberapa titik dan taksir tiap gradien; makin curam grafik, makin jauh grafik baru dari sumbu.') },
        { name: L('Plot and join', 'Plot dan hubungkan'), text: L('Plot the points x and slope, join them with a smooth curve, and leave a gap where the graph has a corner.', 'Plot titik-titik x dan gradien, hubungkan dengan kurva mulus, dan sisakan celah di tempat grafik memiliki sudut tajam.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is the derivative function?', 'Apa itu fungsi turunan?'),
      a: L(
        'The derivative function f prime is the function that gives, for every x, the slope of the graph of f at x. Its value at x is the limit of f of x plus h minus f of x, divided by h, as h approaches zero, wherever that limit exists.',
        'Fungsi turunan f aksen adalah fungsi yang memberikan, untuk setiap x, gradien grafik f di x. Nilainya di x adalah limit f dari x ditambah h dikurangi f dari x, dibagi h, saat h mendekati nol, di mana pun limit itu ada.',
      ),
    },
    {
      q: L('How do you find the derivative of a function from the definition?', 'Bagaimana mencari turunan sebuah fungsi dari definisi?'),
      a: L(
        'Write f of x plus h minus f of x, divided by h, simplify until h cancels, and let h approach zero. For x squared the quotient is 2x plus h, which tends to 2x. For 1 over x it is minus 1 over x times x plus h, which tends to minus 1 over x squared.',
        'Tulis f dari x ditambah h dikurangi f dari x, dibagi h, sederhanakan sampai h tercoret, lalu biarkan h mendekati nol. Untuk x kuadrat hasil baginya 2x ditambah h, yang menuju 2x. Untuk 1 per x hasilnya min 1 per x kali x ditambah h, yang menuju min 1 per x kuadrat.',
      ),
    },
    {
      q: L('What is the difference between f prime of x and f prime of a?', 'Apa beda f aksen dari x dan f aksen dari a?'),
      a: L(
        'F prime of x is the whole derivative function, a formula that works for any x. F prime of a is one number, the value of that function at the point a, which is the slope of the tangent line there. Find the function first and then put in the number.',
        'F aksen dari x adalah seluruh fungsi turunan, rumus yang berlaku untuk x mana pun. F aksen dari a adalah satu bilangan, nilai fungsi itu di titik a, yaitu gradien garis singgung di sana. Cari fungsinya lebih dulu lalu masukkan bilangannya.',
      ),
    },
    {
      q: L('What is the derivative of 1 over x?', 'Berapa turunan 1 per x?'),
      a: L(
        'The derivative of 1 over x is minus 1 over x squared, for x not equal to zero. It follows from the definition, because the difference quotient simplifies to minus 1 over x times x plus h. The slope is negative everywhere, since 1 over x falls on both of its branches.',
        'Turunan 1 per x adalah min 1 per x kuadrat, untuk x tidak sama dengan nol. Hasil ini mengikuti definisi, karena hasil bagi selisih menyederhana menjadi min 1 per x kali x ditambah h. Gradiennya negatif di mana-mana, sebab 1 per x menurun pada kedua cabangnya.',
      ),
    },
    {
      q: L('What is the derivative of the square root of x?', 'Berapa turunan akar x?'),
      a: L(
        'The derivative of the square root of x is 1 over 2 times the square root of x, for x greater than zero. The square root is defined at zero but its derivative is not, because the graph has a vertical tangent there.',
        'Turunan akar x adalah 1 per 2 kali akar x, untuk x lebih besar dari nol. Akar terdefinisi di nol tetapi turunannya tidak, karena grafiknya memiliki garis singgung tegak di sana.',
      ),
    },
    {
      q: L('What is the derivative of the absolute value of x?', 'Berapa turunan nilai mutlak x?'),
      a: L(
        'It is minus 1 for x less than zero and 1 for x greater than zero. At zero there is no derivative, because the graph has a corner and the right-hand and left-hand derivatives, 1 and minus 1, are different.',
        'Turunannya min 1 untuk x kurang dari nol dan 1 untuk x lebih besar dari nol. Di nol tidak ada turunan, karena grafiknya memiliki sudut tajam dan turunan kanan dan turunan kiri, 1 dan min 1, berbeda.',
      ),
    },
    {
      q: L('How do you graph the derivative of a function?', 'Bagaimana menggambar grafik turunan sebuah fungsi?'),
      a: L(
        'Estimate the slope of the graph at many points and plot the slopes as heights. The new graph is above the axis where the original rises, below where it falls, and touches the axis at peaks and valleys. Leave a gap at a corner.',
        'Taksir gradien grafik di banyak titik dan plot gradien itu sebagai tinggi. Grafik baru berada di atas sumbu di tempat grafik asal naik, di bawah di tempat ia turun, dan menyentuh sumbu di puncak dan lembah. Sisakan celah di sudut tajam.',
      ),
    },
    {
      q: L('Is dy over dx a fraction?', 'Apakah dy per dx sebuah pecahan?'),
      a: L(
        'Not at this stage. Dy over dx is a single symbol for the derivative of y with respect to x, so the d letters cannot be cancelled like numbers. Later in calculus dx and dy get meanings of their own, which makes the notation convenient, but that is a separate idea.',
        'Belum pada tahap ini. Dy per dx adalah satu lambang untuk turunan y terhadap x, sehingga huruf d tidak dapat dicoret seperti bilangan. Kemudian dalam kalkulus dx dan dy mendapat arti sendiri, yang membuat notasi ini praktis, tetapi itu gagasan yang terpisah.',
      ),
    },
    {
      q: L('What is the domain of the derivative of a function?', 'Apa daerah asal turunan sebuah fungsi?'),
      a: L(
        'It is the set of points in the domain of the function where the derivative exists. It can be smaller than the domain of the function: the square root of x is defined at zero but its derivative is not, and the absolute value of x has no derivative at its corner.',
        'Ia adalah himpunan titik pada daerah asal fungsi tempat turunan ada. Ia dapat lebih kecil daripada daerah asal fungsi: akar x terdefinisi di nol tetapi turunannya tidak, dan nilai mutlak x tidak memiliki turunan di sudut tajamnya.',
      ),
    },
  ],

  references: [
    { title: "Thomas' Calculus: Early Transcendentals in SI Units (15th ed.), Section 3.2: The Derivative as a Function", author: 'Joel Hass, Christopher Heil, Maurice D. Weir et al.', year: 2023, source: 'Pearson' },
    { title: 'Calculus (8th ed.), section 2.8: The Derivative as a Function', author: 'James Stewart', year: 2015, source: 'Cengage Learning' },
    { title: 'A History of Mathematical Notations, volume 2, on the notations of the calculus', author: 'Florian Cajori', year: 1929, source: 'Open Court Publishing' },
    { title: 'Théorie des fonctions analytiques', author: 'Joseph-Louis Lagrange', year: 1797, source: 'Imprimerie de la République' },
    { title: 'SymPy tutorial: Calculus (diff)', author: 'SymPy Development Team', source: 'docs.sympy.org', url: 'https://docs.sympy.org/latest/tutorials/intro-tutorial/calculus.html' },
    { title: 'NumPy reference: numpy.gradient', author: 'NumPy Developers', source: 'numpy.org', url: 'https://numpy.org/doc/stable/reference/generated/numpy.gradient.html' },
  ],

  related: ['tangent-lines-and-derivative-at-a-point', 'algebraic-expressions', 'exponents-and-radicals', 'rational-numbers'],
}
