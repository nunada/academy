import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './inverse-trigonometric-functions.meta'

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
    T`**The inverse trigonometric functions give the angle that has a given trigonometric value, and their derivatives are algebraic: $\frac{d}{dx}\arcsin x=\frac{1}{\sqrt{1-x^2}}$, $\frac{d}{dx}\arctan x=\frac{1}{1+x^2}$ and $\frac{d}{dx}\arcsec x=\frac{1}{|x|\sqrt{x^2-1}}$.** Each comes from the rule for the derivative of an inverse, read off a reference triangle. The three "co" functions have the negatives of these derivatives, because $\arccos x=\frac\pi2-\arcsin x$ and likewise for the others.`,
    T`**Fungsi trigonometri invers memberi sudut yang memiliki nilai trigonometri tertentu, dan turunannya aljabar: $\frac{d}{dx}\arcsin x=\frac{1}{\sqrt{1-x^2}}$, $\frac{d}{dx}\arctan x=\frac{1}{1+x^2}$, dan $\frac{d}{dx}\arcsec x=\frac{1}{|x|\sqrt{x^2-1}}$.** Masing-masing berasal dari aturan turunan invers, dibaca dari segitiga acuan. Ketiga fungsi "ko" memiliki turunan yang negatif dari ini, karena $\arccos x=\frac\pi2-\arcsin x$ dan begitu pula yang lain.`,
  ),

  keyPoints: [
    L(
      T`Each trigonometric function is made one-to-one on an interval, and its inverse is the angle on that interval with the given value: $\arcsin$ and $\arctan$ give angles in $\left(-\frac\pi2,\frac\pi2\right)$, $\arccos$ and $\arccot$ in $(0,\pi)$.`,
      T`Setiap fungsi trigonometri dibuat satu-satu pada suatu selang, dan inversnya adalah sudut pada selang itu dengan nilai yang diberikan: $\arcsin$ dan $\arctan$ memberi sudut di $\left(-\frac\pi2,\frac\pi2\right)$, $\arccos$ dan $\arccot$ di $(0,\pi)$.`,
    ),
    L(
      T`$\sin(\arcsin x)=x$ for $-1\le x\le1$, but $\arcsin(\sin y)=y$ only for $-\frac\pi2\le y\le\frac\pi2$; for example $\arcsin(\sin\pi)=0$.`,
      T`$\sin(\arcsin x)=x$ untuk $-1\le x\le1$, tetapi $\arcsin(\sin y)=y$ hanya untuk $-\frac\pi2\le y\le\frac\pi2$; misalnya $\arcsin(\sin\pi)=0$.`,
    ),
    L(
      T`A right triangle with the angle $\theta=\arcsin x$ has sides $x$, $\sqrt{1-x^2}$ and $1$, which gives $\cos(\arcsin x)=\sqrt{1-x^2}$ and the derivative $\frac{1}{\cos\theta}=\frac{1}{\sqrt{1-x^2}}$.`,
      T`Segitiga siku-siku dengan sudut $\theta=\arcsin x$ memiliki sisi $x$, $\sqrt{1-x^2}$, dan $1$, yang memberi $\cos(\arcsin x)=\sqrt{1-x^2}$ dan turunan $\frac{1}{\cos\theta}=\frac{1}{\sqrt{1-x^2}}$.`,
    ),
    L(
      T`$\arcsin$ has vertical tangents at $x=\pm1$; $\arctan$ is differentiable everywhere, with a slope at most $1$ that tends to $0$; $\arcsec$ has a positive slope on both pieces, so its formula needs $|x|$.`,
      T`$\arcsin$ memiliki garis singgung tegak di $x=\pm1$; $\arctan$ terdiferensialkan di mana-mana, dengan gradien paling besar $1$ yang menuju $0$; $\arcsec$ memiliki gradien positif pada kedua bagian, sehingga rumusnya memerlukan $|x|$.`,
    ),
    L(
      T`With the chain rule, $\frac{d}{dx}\arctan u=\frac{u'}{1+u^2}$ and $\frac{d}{dx}\arcsin u=\frac{u'}{\sqrt{1-u^2}}$; for instance $\frac{d}{dx}\arcsin\left(x^2\right)=\frac{2x}{\sqrt{1-x^4}}$.`,
      T`Dengan aturan rantai, $\frac{d}{dx}\arctan u=\frac{u'}{1+u^2}$ dan $\frac{d}{dx}\arcsin u=\frac{u'}{\sqrt{1-u^2}}$; misalnya $\frac{d}{dx}\arcsin\left(x^2\right)=\frac{2x}{\sqrt{1-x^4}}$.`,
    ),
    L(
      T`A picture hanging $p$ to $q$ above your eye is seen at the angle $\arctan\frac qx-\arctan\frac px$, which is largest at the distance $x=\sqrt{pq}$, where its derivative is $0$.`,
      T`Lukisan yang tergantung $p$ sampai $q$ di atas matamu terlihat pada sudut $\arctan\frac qx-\arctan\frac px$, yang terbesar pada jarak $x=\sqrt{pq}$, tempat turunannya $0$.`,
    ),
  ],

  sections: [
    /* ---------------------------------------------------------------------- definitions */
    {
      id: 'definitions',
      heading: L('What are the inverse trigonometric functions?', 'Apa itu fungsi trigonometri invers?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**An inverse trigonometric function gives the angle, in radians, whose sine, cosine, tangent, cotangent, secant or cosecant is a given number, chosen from one fixed interval so that it is a function.** Each trigonometric function repeats, so it is not one-to-one and has no inverse; restricting it to an interval where it is one-to-one fixes that, and reflecting the restricted graph in the line $y=x$ draws the inverse.

| Function | Domain | Range |
|---|---|---|
| $y=\arcsin x$ | $-1\le x\le1$ | $-\frac\pi2\le y\le\frac\pi2$ |
| $y=\arccos x$ | $-1\le x\le1$ | $0\le y\le\pi$ |
| $y=\arctan x$ | all real $x$ | $-\frac\pi2<y<\frac\pi2$ |
| $y=\arccot x$ | all real $x$ | $0<y<\pi$ |
| $y=\arcsec x$ | $x\le-1$ or $x\ge1$ | $0\le y\le\pi$, $y\ne\frac\pi2$ |
| $y=\arccsc x$ | $x\le-1$ or $x\ge1$ | $-\frac\pi2\le y\le\frac\pi2$, $y\ne0$ |

So $\arctan x$ is *the angle between $-\frac\pi2$ and $\frac\pi2$ whose tangent is $x$*. The open intervals avoid the values where the tangent, cotangent, secant or cosecant is not defined.

**Notation.** The inverse sine is also written $\sin^{-1}x$, and likewise for the others. The exponent $-1$ here means *inverse function*, and not reciprocal: $\sin^{-1}x=\arcsin x$ is not $\frac{1}{\sin x}$, which is $\csc x$.

**Symmetry and asymptotes.** The graph of $y=\arctan x$ is symmetric about the origin, so $\arctan(-x)=-\arctan x$: the arctangent is an odd function. It has two horizontal asymptotes, $y=\frac\pi2$ and $y=-\frac\pi2$, because $\arctan x\to\frac\pi2$ as $x\to\infty$ and $\to-\frac\pi2$ as $x\to-\infty$.

**The branch of the arcsecant.** There is no general agreement about $\arcsec x$ for negative $x$. Here it is taken in the second quadrant, between $\frac\pi2$ and $\pi$. This choice makes $\arcsec x=\arccos\frac1x$, the identity that calculators use, and it makes $\arcsec$ increasing on each piece. Some texts choose the third quadrant instead, which simplifies the derivative but breaks the identity.

**The cofunction identities.** The three "co" functions are the other three reflected and shifted:
$$\arccos x=\frac\pi2-\arcsin x$$
$$\arccot x=\frac\pi2-\arctan x$$
$$\arccsc x=\frac\pi2-\arcsec x$$
and $\arcsec x=\arccos\frac1x$, $\arccsc x=\arcsin\frac1x$.

**Example 1.** The values of $\arctan$ come from the first and fourth quadrants. $\arctan1=\frac\pi4$, because $\tan\frac\pi4=1$. $\arctan\left(-\sqrt3\right)=-\frac\pi3$, because $\tan\left(-\frac\pi3\right)=-\sqrt3$ and $-\frac\pi3$ lies in $\left(-\frac\pi2,\frac\pi2\right)$. Others: $\arcsin\frac12=\frac\pi6$, $\arccos\left(-\frac12\right)=\frac{2\pi}{3}$ (in $[0,\pi]$, not $-\frac\pi3$), $\arccot(-1)=\frac{3\pi}{4}$.

Choose a function below and slide $x$: its graph, the tangent line there and the graph of the slope are drawn.`,
            T`**Fungsi trigonometri invers memberi sudut, dalam radian, yang sinus, kosinus, tangen, kotangen, sekan, atau kosekannya adalah bilangan tertentu, dipilih dari satu selang tetap sehingga ia menjadi fungsi.** Setiap fungsi trigonometri berulang, sehingga ia tidak satu-satu dan tidak memiliki invers; membatasinya pada selang tempat ia satu-satu memperbaikinya, dan mencerminkan grafik terbatas itu dalam garis $y=x$ menggambar inversnya.

| Fungsi | Domain | Jangkauan |
|---|---|---|
| $y=\arcsin x$ | $-1\le x\le1$ | $-\frac\pi2\le y\le\frac\pi2$ |
| $y=\arccos x$ | $-1\le x\le1$ | $0\le y\le\pi$ |
| $y=\arctan x$ | semua $x$ real | $-\frac\pi2<y<\frac\pi2$ |
| $y=\arccot x$ | semua $x$ real | $0<y<\pi$ |
| $y=\arcsec x$ | $x\le-1$ atau $x\ge1$ | $0\le y\le\pi$, $y\ne\frac\pi2$ |
| $y=\arccsc x$ | $x\le-1$ atau $x\ge1$ | $-\frac\pi2\le y\le\frac\pi2$, $y\ne0$ |

Jadi $\arctan x$ adalah *sudut antara $-\frac\pi2$ dan $\frac\pi2$ yang tangennya $x$*. Selang terbuka menghindari nilai tempat tangen, kotangen, sekan, atau kosekan tidak terdefinisi.

**Notasi.** Invers sinus juga ditulis $\sin^{-1}x$, dan begitu pula yang lain. Pangkat $-1$ di sini berarti *fungsi invers*, dan bukan kebalikan: $\sin^{-1}x=\arcsin x$ bukan $\frac{1}{\sin x}$, yaitu $\csc x$.

**Simetri dan asimtot.** Grafik $y=\arctan x$ simetris terhadap titik asal, sehingga $\arctan(-x)=-\arctan x$: arkus tangen adalah fungsi ganjil. Ia memiliki dua asimtot mendatar, $y=\frac\pi2$ dan $y=-\frac\pi2$, karena $\arctan x\to\frac\pi2$ saat $x\to\infty$ dan $\to-\frac\pi2$ saat $x\to-\infty$.

**Cabang arkus sekan.** Tidak ada kesepakatan umum tentang $\arcsec x$ untuk $x$ negatif. Di sini ia diambil di kuadran kedua, antara $\frac\pi2$ dan $\pi$. Pilihan ini membuat $\arcsec x=\arccos\frac1x$, identitas yang dipakai kalkulator, dan membuat $\arcsec$ naik pada tiap bagian. Sebagian buku memilih kuadran ketiga, yang menyederhanakan turunan tetapi merusak identitas itu.

**Identitas kofungsi.** Ketiga fungsi "ko" adalah ketiga yang lain yang dicerminkan dan digeser:
$$\arccos x=\frac\pi2-\arcsin x$$
$$\arccot x=\frac\pi2-\arctan x$$
$$\arccsc x=\frac\pi2-\arcsec x$$
dan $\arcsec x=\arccos\frac1x$, $\arccsc x=\arcsin\frac1x$.

**Contoh 1.** Nilai $\arctan$ berasal dari kuadran pertama dan keempat. $\arctan1=\frac\pi4$, karena $\tan\frac\pi4=1$. $\arctan\left(-\sqrt3\right)=-\frac\pi3$, karena $\tan\left(-\frac\pi3\right)=-\sqrt3$ dan $-\frac\pi3$ terletak di $\left(-\frac\pi2,\frac\pi2\right)$. Lainnya: $\arcsin\frac12=\frac\pi6$, $\arccos\left(-\frac12\right)=\frac{2\pi}{3}$ (di $[0,\pi]$, bukan $-\frac\pi3$), $\arccot(-1)=\frac{3\pi}{4}$.

Pilih fungsi di bawah dan geser $x$: grafiknya, garis singgung di sana, dan grafik gradiennya digambar.`,
          ),
        },
        { kind: 'widget', name: 'invtrigslope' },
      ],
    },

    /* -------------------------------------------------------------------- compositions */
    {
      id: 'compositions',
      heading: L('What are sin(arcsin x), arcsin(sin y) and cos(arcsin x)?', 'Berapa sin(arcsin x), arcsin(sin y), dan cos(arcsin x)?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A trigonometric function undoes its inverse everywhere on the domain of the inverse, $\sin(\arcsin x)=x$ for $-1\le x\le1$, but the inverse undoes the trigonometric function only on the restricted interval: $\arcsin(\sin y)=y$ only when $-\frac\pi2\le y\le\frac\pi2$.** The sine repeats, so many angles share a sine, and the arcsine returns the one in its range. For example
$$\arcsin(\sin\pi)=\arcsin0=0$$
$$\arcsin(\sin2)=\pi-2\approx1.14,$$
because $\sin2=\sin(\pi-2)$ and $\pi-2$ lies in $\left[-\frac\pi2,\frac\pi2\right]$. Likewise $\arccos(\cos(-1))=1$.

**A trigonometric function of an inverse is algebraic.** Draw the *reference triangle*: if $\theta=\arcsin x$ with $0<x<1$, then $\sin\theta=x$, so a right triangle with the opposite side $x$ and the hypotenuse $1$ has the angle $\theta$. By Pythagoras the adjacent side is $\sqrt{1-x^2}$. Reading the triangle,
$$\cos(\arcsin x)=\sqrt{1-x^2}$$
$$\tan(\arcsin x)=\frac{x}{\sqrt{1-x^2}}.$$
For $\theta=\arctan x$ with $x>0$ take the opposite side $x$ and the adjacent side $1$, so the hypotenuse is $\sqrt{1+x^2}$ and $\sec(\arctan x)=\sqrt{1+x^2}$, $\sin(\arctan x)=\frac{x}{\sqrt{1+x^2}}$. For $\theta=\arcsec x$ with $x>1$ take the hypotenuse $x$ and the adjacent side $1$, so the opposite side is $\sqrt{x^2-1}$ and $\tan(\arcsec x)=\sqrt{x^2-1}$.

For example $\cos\left(\arcsin\frac35\right)=\sqrt{1-\frac{9}{25}}=\frac45$ and $\tan\left(\arcsin\frac35\right)=\frac34$.

These are the very expressions that appear in the derivatives, which is no accident: the derivative of an inverse is the reciprocal of the derivative of the trigonometric function, written in terms of the triangle.

Move $x$ below and watch the triangle change: its third side comes from Pythagoras, and the derivative is read straight from it.`,
            T`**Fungsi trigonometri membatalkan inversnya di mana-mana pada domain invers itu, $\sin(\arcsin x)=x$ untuk $-1\le x\le1$, tetapi invers hanya membatalkan fungsi trigonometri pada selang terbatasnya: $\arcsin(\sin y)=y$ hanya bila $-\frac\pi2\le y\le\frac\pi2$.** Sinus berulang, sehingga banyak sudut memiliki sinus yang sama, dan arkus sinus mengembalikan yang ada di jangkauannya. Misalnya
$$\arcsin(\sin\pi)=\arcsin0=0$$
$$\arcsin(\sin2)=\pi-2\approx1{,}14,$$
karena $\sin2=\sin(\pi-2)$ dan $\pi-2$ terletak di $\left[-\frac\pi2,\frac\pi2\right]$. Begitu pula $\arccos(\cos(-1))=1$.

**Fungsi trigonometri dari suatu invers bersifat aljabar.** Gambar *segitiga acuan*: jika $\theta=\arcsin x$ dengan $0<x<1$, maka $\sin\theta=x$, sehingga segitiga siku-siku dengan sisi depan $x$ dan sisi miring $1$ memiliki sudut $\theta$. Dengan Pythagoras sisi sampingnya $\sqrt{1-x^2}$. Membaca segitiga itu,
$$\cos(\arcsin x)=\sqrt{1-x^2}$$
$$\tan(\arcsin x)=\frac{x}{\sqrt{1-x^2}}.$$
Untuk $\theta=\arctan x$ dengan $x>0$ ambil sisi depan $x$ dan sisi samping $1$, sehingga sisi miringnya $\sqrt{1+x^2}$ dan $\sec(\arctan x)=\sqrt{1+x^2}$, $\sin(\arctan x)=\frac{x}{\sqrt{1+x^2}}$. Untuk $\theta=\arcsec x$ dengan $x>1$ ambil sisi miring $x$ dan sisi samping $1$, sehingga sisi depannya $\sqrt{x^2-1}$ dan $\tan(\arcsec x)=\sqrt{x^2-1}$.

Misalnya $\cos\left(\arcsin\frac35\right)=\sqrt{1-\frac{9}{25}}=\frac45$ dan $\tan\left(\arcsin\frac35\right)=\frac34$.

Inilah ekspresi yang muncul dalam turunannya, yang bukan kebetulan: turunan suatu invers adalah kebalikan turunan fungsi trigonometri, ditulis dengan segitiga.

Geser $x$ di bawah dan lihat segitiga berubah: sisi ketiganya dari Pythagoras, dan turunannya dibaca langsung darinya.`,
          ),
        },
        { kind: 'widget', name: 'reftriangle' },
      ],
    },

    /* ------------------------------------------------------------- arcsine and arctangent */
    {
      id: 'arcsin-arctan',
      heading: L('What are the derivatives of arcsin and arctan?', 'Berapa turunan arcsin dan arctan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**$\frac{d}{dx}\arcsin x=\frac{1}{\sqrt{1-x^2}}$ for $-1<x<1$ and $\frac{d}{dx}\arctan x=\frac{1}{1+x^2}$ for every real $x$.** Both come from the [derivative rule for inverses](article:derivatives-of-inverse-functions-and-logarithms#inverse-rule): $\left(f^{-1}\right)'(x)=\frac{1}{f'\left(f^{-1}(x)\right)}$.

**Arcsine.** The sine is differentiable with derivative $\cos y>0$ on $-\frac\pi2<y<\frac\pi2$, so the arcsine is differentiable on $-1<x<1$. With $f=\sin$:
$$\left(\arcsin\right)'(x)=\frac{1}{\cos(\arcsin x)}$$
$$=\frac{1}{\sqrt{1-\sin^2(\arcsin x)}}$$
$$=\frac{1}{\sqrt{1-x^2}}.$$
We cannot expect a derivative at $x=\pm1$: the graph has vertical tangent lines there, and the slope $\frac{1}{\sqrt{1-x^2}}$ grows without bound as $x\to\pm1$. In between the slope is at least $1$.

**Arctangent.** The tangent has derivative $\sec^2y>0$ on $-\frac\pi2<y<\frac\pi2$:
$$\left(\arctan\right)'(x)=\frac{1}{\sec^2(\arctan x)}$$
$$=\frac{1}{1+\tan^2(\arctan x)}$$
$$=\frac{1}{1+x^2}.$$
This is defined for all real $x$, is largest, $1$, at $x=0$, and tends to $0$ as $x\to\pm\infty$: the graph flattens towards its horizontal asymptotes.

**With the chain rule.** If $u$ is a differentiable function of $x$,
$$\frac{d}{dx}\arcsin u=\frac{1}{\sqrt{1-u^2}}\cdot\frac{du}{dx}\quad(|u|<1)$$
$$\frac{d}{dx}\arctan u=\frac{1}{1+u^2}\cdot\frac{du}{dx}.$$

**Example 2.** $\frac{d}{dx}\arcsin\left(x^2\right)=\frac{1}{\sqrt{1-\left(x^2\right)^2}}\cdot2x=\frac{2x}{\sqrt{1-x^4}}$ for $|x|<1$.

**Example 3.** $\frac{d}{dx}\frac{1}{\arctan x}=-\frac{1}{\arctan^2x}\cdot\frac{1}{1+x^2}=-\frac{1}{\left(1+x^2\right)\arctan^2x}$ for $x\ne0$. This is the derivative of the *reciprocal* of the arctangent, which is not its inverse: the [chain rule](article:the-chain-rule#power-chain-rule) with the power $-1$.

**A surprising simplification.** $\frac{d}{dx}\arctan\frac1x=\frac{1}{1+\frac{1}{x^2}}\cdot\left(-\frac{1}{x^2}\right)=-\frac{1}{x^2+1}$, the derivative of $-\arctan x$. Indeed $\arctan\frac1x=\frac\pi2-\arctan x$ for $x>0$.

**An antiderivative in disguise.** The two formulas say that $\arcsin x$ and $\arctan x$ are functions whose slopes are the algebraic expressions $\frac{1}{\sqrt{1-x^2}}$ and $\frac{1}{1+x^2}$. Reading them backwards is what a later chapter of integration does.`,
            T`**$\frac{d}{dx}\arcsin x=\frac{1}{\sqrt{1-x^2}}$ untuk $-1<x<1$ dan $\frac{d}{dx}\arctan x=\frac{1}{1+x^2}$ untuk setiap $x$ real.** Keduanya berasal dari [aturan turunan untuk invers](article:derivatives-of-inverse-functions-and-logarithms#inverse-rule): $\left(f^{-1}\right)'(x)=\frac{1}{f'\left(f^{-1}(x)\right)}$.

**Arkus sinus.** Sinus terdiferensialkan dengan turunan $\cos y>0$ pada $-\frac\pi2<y<\frac\pi2$, sehingga arkus sinus terdiferensialkan pada $-1<x<1$. Dengan $f=\sin$:
$$\left(\arcsin\right)'(x)=\frac{1}{\cos(\arcsin x)}$$
$$=\frac{1}{\sqrt{1-\sin^2(\arcsin x)}}$$
$$=\frac{1}{\sqrt{1-x^2}}.$$
Kita tidak dapat mengharapkan turunan di $x=\pm1$: grafik memiliki garis singgung tegak di sana, dan gradien $\frac{1}{\sqrt{1-x^2}}$ membesar tanpa batas saat $x\to\pm1$. Di antaranya gradiennya paling sedikit $1$.

**Arkus tangen.** Tangen memiliki turunan $\sec^2y>0$ pada $-\frac\pi2<y<\frac\pi2$:
$$\left(\arctan\right)'(x)=\frac{1}{\sec^2(\arctan x)}$$
$$=\frac{1}{1+\tan^2(\arctan x)}$$
$$=\frac{1}{1+x^2}.$$
Ini terdefinisi untuk semua $x$ real, terbesar, $1$, di $x=0$, dan menuju $0$ saat $x\to\pm\infty$: grafik melandai menuju asimtot mendatarnya.

**Dengan aturan rantai.** Jika $u$ adalah fungsi $x$ yang terdiferensialkan,
$$\frac{d}{dx}\arcsin u=\frac{1}{\sqrt{1-u^2}}\cdot\frac{du}{dx}\quad(|u|<1)$$
$$\frac{d}{dx}\arctan u=\frac{1}{1+u^2}\cdot\frac{du}{dx}.$$

**Contoh 2.** $\frac{d}{dx}\arcsin\left(x^2\right)=\frac{1}{\sqrt{1-\left(x^2\right)^2}}\cdot2x=\frac{2x}{\sqrt{1-x^4}}$ untuk $|x|<1$.

**Contoh 3.** $\frac{d}{dx}\frac{1}{\arctan x}=-\frac{1}{\arctan^2x}\cdot\frac{1}{1+x^2}=-\frac{1}{\left(1+x^2\right)\arctan^2x}$ untuk $x\ne0$. Ini turunan *kebalikan* arkus tangen, yang bukan inversnya: [aturan rantai](article:the-chain-rule#power-chain-rule) dengan pangkat $-1$.

**Penyederhanaan yang mengejutkan.** $\frac{d}{dx}\arctan\frac1x=\frac{1}{1+\frac{1}{x^2}}\cdot\left(-\frac{1}{x^2}\right)=-\frac{1}{x^2+1}$, turunan $-\arctan x$. Memang $\arctan\frac1x=\frac\pi2-\arctan x$ untuk $x>0$.

**Antiturunan yang menyamar.** Kedua rumus itu menyatakan bahwa $\arcsin x$ dan $\arctan x$ adalah fungsi yang gradiennya ekspresi aljabar $\frac{1}{\sqrt{1-x^2}}$ dan $\frac{1}{1+x^2}$. Membacanya mundur adalah yang dilakukan bab integrasi kemudian.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------ arcsecant and the co-functions */
    {
      id: 'arcsec-and-cofunctions',
      heading: L('What are the derivatives of arcsec, arccos, arccot and arccsc?', 'Berapa turunan arcsec, arccos, arccot, dan arccsc?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**$\frac{d}{dx}\arcsec x=\frac{1}{|x|\sqrt{x^2-1}}$ for $|x|>1$, and the derivatives of $\arccos$, $\arccot$ and $\arccsc$ are the negatives of those of $\arcsin$, $\arctan$ and $\arcsec$.**

**Arcsecant, by implicit differentiation.** The rule for inverses does not apply to $\sec$ directly, because its domain is not connected, but it applies on each piece. Let $y=\arcsec x$, so $\sec y=x$. Differentiate both sides with respect to $x$, using the [chain rule](article:the-chain-rule#chain-rule):
$$\sec y\tan y\cdot\frac{dy}{dx}=1,\qquad\frac{dy}{dx}=\frac{1}{\sec y\tan y}.$$
For $|x|>1$ the angle $y$ lies in $\left(0,\frac\pi2\right)\cup\left(\frac\pi2,\pi\right)$, where $\sec y\tan y>0$. Since $\sec y=x$ and $\tan y=\pm\sqrt{\sec^2y-1}=\pm\sqrt{x^2-1}$, we get $\frac{dy}{dx}=\frac{1}{\pm x\sqrt{x^2-1}}$. The slope of the graph is positive everywhere, so the sign is the one that makes the denominator positive: $x\sqrt{x^2-1}$ for $x>1$ and $-x\sqrt{x^2-1}$ for $x<-1$. One expression covers both:
$$\frac{d}{dx}\arcsec x=\frac{1}{|x|\sqrt{x^2-1}}.$$

**The co-functions.** Because $\arccos x=\frac\pi2-\arcsin x$, differentiating gives
$$\frac{d}{dx}\arccos x=-\frac{d}{dx}\arcsin x$$
$$=-\frac{1}{\sqrt{1-x^2}}.$$
The same works for the others: $\arccot x=\frac\pi2-\arctan x$ and $\arccsc x=\frac\pi2-\arcsec x$.

| Function | Derivative |
|---|---|
| $\arcsin x$ | $\frac{1}{\sqrt{1-x^2}}$ |
| $\arccos x$ | $-\frac{1}{\sqrt{1-x^2}}$ |
| $\arctan x$ | $\frac{1}{1+x^2}$ |
| $\arccot x$ | $-\frac{1}{1+x^2}$ |
| $\arcsec x$ | $\frac{1}{\left|x\right|\sqrt{x^2-1}}$ |
| $\arccsc x$ | $-\frac{1}{\left|x\right|\sqrt{x^2-1}}$ |

With a function $u(x)$ inside, each formula gets the factor $\frac{du}{dx}$, and the one for arcsec needs $|u|>1$: $\frac{d}{dx}\arcsec u=\frac{1}{|u|\sqrt{u^2-1}}\cdot\frac{du}{dx}$.

**Example 4.** $\frac{d}{dx}\arcsec\left(5x^4\right)=\frac{1}{5x^4\sqrt{25x^8-1}}\cdot20x^3=\frac{4}{x\sqrt{25x^8-1}}$ for $5x^4>1$. The absolute value $\left|5x^4\right|=5x^4$ is just $5x^4$ because it is never negative, and the $x$ left in the denominator keeps its sign.

Type any function below, built from these and the earlier functions, and see each rule applied.`,
            T`**$\frac{d}{dx}\arcsec x=\frac{1}{|x|\sqrt{x^2-1}}$ untuk $|x|>1$, dan turunan $\arccos$, $\arccot$, dan $\arccsc$ adalah negatif dari turunan $\arcsin$, $\arctan$, dan $\arcsec$.**

**Arkus sekan, dengan diferensiasi implisit.** Aturan untuk invers tidak berlaku langsung pada $\sec$, karena domainnya tidak terhubung, tetapi ia berlaku pada tiap bagian. Misalkan $y=\arcsec x$, sehingga $\sec y=x$. Turunkan kedua ruas terhadap $x$, dengan [aturan rantai](article:the-chain-rule#chain-rule):
$$\sec y\tan y\cdot\frac{dy}{dx}=1,\qquad\frac{dy}{dx}=\frac{1}{\sec y\tan y}.$$
Untuk $|x|>1$ sudut $y$ terletak di $\left(0,\frac\pi2\right)\cup\left(\frac\pi2,\pi\right)$, tempat $\sec y\tan y>0$. Karena $\sec y=x$ dan $\tan y=\pm\sqrt{\sec^2y-1}=\pm\sqrt{x^2-1}$, kita dapatkan $\frac{dy}{dx}=\frac{1}{\pm x\sqrt{x^2-1}}$. Gradien grafik positif di mana-mana, sehingga tandanya adalah yang membuat penyebut positif: $x\sqrt{x^2-1}$ untuk $x>1$ dan $-x\sqrt{x^2-1}$ untuk $x<-1$. Satu ekspresi mencakup keduanya:
$$\frac{d}{dx}\arcsec x=\frac{1}{|x|\sqrt{x^2-1}}.$$

**Fungsi-fungsi ko.** Karena $\arccos x=\frac\pi2-\arcsin x$, menurunkannya memberi
$$\frac{d}{dx}\arccos x=-\frac{d}{dx}\arcsin x$$
$$=-\frac{1}{\sqrt{1-x^2}}.$$
Hal yang sama berlaku untuk yang lain: $\arccot x=\frac\pi2-\arctan x$ dan $\arccsc x=\frac\pi2-\arcsec x$.

| Fungsi | Turunan |
|---|---|
| $\arcsin x$ | $\frac{1}{\sqrt{1-x^2}}$ |
| $\arccos x$ | $-\frac{1}{\sqrt{1-x^2}}$ |
| $\arctan x$ | $\frac{1}{1+x^2}$ |
| $\arccot x$ | $-\frac{1}{1+x^2}$ |
| $\arcsec x$ | $\frac{1}{\left|x\right|\sqrt{x^2-1}}$ |
| $\arccsc x$ | $-\frac{1}{\left|x\right|\sqrt{x^2-1}}$ |

Dengan fungsi $u(x)$ di dalam, tiap rumus mendapat faktor $\frac{du}{dx}$, dan yang untuk arcsec memerlukan $|u|>1$: $\frac{d}{dx}\arcsec u=\frac{1}{|u|\sqrt{u^2-1}}\cdot\frac{du}{dx}$.

**Contoh 4.** $\frac{d}{dx}\arcsec\left(5x^4\right)=\frac{1}{5x^4\sqrt{25x^8-1}}\cdot20x^3=\frac{4}{x\sqrt{25x^8-1}}$ untuk $5x^4>1$. Nilai mutlak $\left|5x^4\right|=5x^4$ hanyalah $5x^4$ karena ia tidak pernah negatif, dan $x$ yang tersisa di penyebut mempertahankan tandanya.

Ketik fungsi apa saja di bawah, yang dibangun dari ini dan fungsi-fungsi terdahulu, dan lihat tiap aturan yang dipakai.`,
          ),
        },
        { kind: 'widget', name: 'invsteps' },
      ],
    },

    /* --------------------------------------------------------------------- viewing angle */
    {
      id: 'viewing-angle',
      heading: L('Where should you stand to see a picture best?', 'Di mana sebaiknya berdiri agar melihat lukisan dengan paling baik?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A picture whose lower edge hangs $p$ and whose upper edge hangs $q$ above your eye is seen at the angle $\theta(x)=\arctan\frac qx-\arctan\frac px$ when you stand $x$ away from the wall, and the angle is largest at $x=\sqrt{pq}$, the geometric mean of the two heights.** The angle between the line of sight to the top and the line of sight to the bottom is the difference of two angles of elevation, each the arctangent of a height over a distance.

**The derivative.** By the chain rule, $\frac{d}{dx}\arctan\frac qx=\frac{1}{1+\frac{q^2}{x^2}}\cdot\left(-\frac{q}{x^2}\right)=-\frac{q}{x^2+q^2}$, and the same with $p$, so
$$\theta'(x)=-\frac{q}{x^2+q^2}+\frac{p}{x^2+p^2}.$$
This is zero when $q\left(x^2+p^2\right)=p\left(x^2+q^2\right)$, that is $(q-p)x^2=pq(q-p)$, so $x^2=pq$ and $x=\sqrt{pq}$. For $x$ a little smaller $\theta'>0$ and for $x$ a little larger $\theta'<0$: the angle grows as you step back from very close, and shrinks as you move far away, so $x=\sqrt{pq}$ is the top of the curve.

**Example.** A picture hangs from $1$ m to $3$ m above your eye. The best distance is $x=\sqrt{1\cdot3}=\sqrt3\approx1.73$ m, and the angle there is
$$\theta=\arctan\frac{3}{\sqrt3}-\arctan\frac{1}{\sqrt3}$$
$$=\arctan\sqrt3-\arctan\frac{1}{\sqrt3}$$
$$=\frac\pi3-\frac\pi6=\frac\pi6,$$
which is $30^\circ$. In general the largest angle is $\arctan\frac{q-p}{2\sqrt{pq}}$. Standing very close, the picture is above you and squeezed into a narrow angle; far away it is small. The best view is in between.

Choose the two heights and walk back and forth below.`,
            T`**Lukisan yang tepi bawahnya tergantung $p$ dan tepi atasnya $q$ di atas matamu terlihat pada sudut $\theta(x)=\arctan\frac qx-\arctan\frac px$ ketika kamu berdiri $x$ dari dinding, dan sudut itu terbesar di $x=\sqrt{pq}$, rata-rata geometri kedua tinggi.** Sudut antara garis pandang ke atas dan garis pandang ke bawah adalah selisih dua sudut elevasi, masing-masing arkus tangen dari tinggi per jarak.

**Turunannya.** Dengan aturan rantai, $\frac{d}{dx}\arctan\frac qx=\frac{1}{1+\frac{q^2}{x^2}}\cdot\left(-\frac{q}{x^2}\right)=-\frac{q}{x^2+q^2}$, dan sama dengan $p$, sehingga
$$\theta'(x)=-\frac{q}{x^2+q^2}+\frac{p}{x^2+p^2}.$$
Ini nol bila $q\left(x^2+p^2\right)=p\left(x^2+q^2\right)$, yaitu $(q-p)x^2=pq(q-p)$, sehingga $x^2=pq$ dan $x=\sqrt{pq}$. Untuk $x$ sedikit lebih kecil $\theta'>0$ dan untuk $x$ sedikit lebih besar $\theta'<0$: sudut membesar saat kamu mundur dari sangat dekat, dan mengecil saat kamu menjauh, sehingga $x=\sqrt{pq}$ adalah puncak kurva.

**Contoh.** Sebuah lukisan tergantung dari $1$ m sampai $3$ m di atas matamu. Jarak terbaiknya $x=\sqrt{1\cdot3}=\sqrt3\approx1{,}73$ m, dan sudut di sana
$$\theta=\arctan\frac{3}{\sqrt3}-\arctan\frac{1}{\sqrt3}$$
$$=\arctan\sqrt3-\arctan\frac{1}{\sqrt3}$$
$$=\frac\pi3-\frac\pi6=\frac\pi6,$$
yaitu $30^\circ$. Secara umum sudut terbesar adalah $\arctan\frac{q-p}{2\sqrt{pq}}$. Berdiri sangat dekat, lukisan berada di atasmu dan terjepit pada sudut sempit; di kejauhan ia kecil. Pandangan terbaik ada di antaranya.

Pilih kedua tinggi dan berjalanlah maju mundur di bawah.`,
          ),
        },
        { kind: 'widget', name: 'viewangle' },
      ],
    },

    /* ------------------------------------------------------------------- in code */
    {
      id: 'inverse-trig-in-code',
      heading: L('How do you compute inverse trigonometric functions and their derivatives in code?', 'Bagaimana menghitung fungsi trigonometri invers dan turunannya dalam kode?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Programming languages name them ´asin´, ´acos´, ´atan´ and ´atan2´: ´math.asin(x)´ returns an angle in radians in $\left[-\frac\pi2,\frac\pi2\right]$, and SymPy's ´sp.asin´, ´sp.atan´ and ´sp.asec´ differentiate to the formulas of this article.** There is no ´asec´ in Python's ´math´; use ´math.acos(1/x)´, which is the branch chosen here. Remember that ´math.asin(math.sin(x))´ is ´x´ only for $x$ in $\left[-\frac\pi2,\frac\pi2\right]$. The last lines scan the viewing angle of the picture from $1$ m to $3$ m and find the best distance and the largest angle without using the derivative: $\sqrt3\approx1.732$ and $30^\circ$.`,
            T`**Bahasa pemrograman menamainya ´asin´, ´acos´, ´atan´, dan ´atan2´: ´math.asin(x)´ mengembalikan sudut dalam radian di $\left[-\frac\pi2,\frac\pi2\right]$, dan ´sp.asin´, ´sp.atan´, serta ´sp.asec´ milik SymPy menurunkan ke rumus-rumus artikel ini.** Tidak ada ´asec´ di ´math´ Python; pakai ´math.acos(1/x)´, yaitu cabang yang dipilih di sini. Ingat bahwa ´math.asin(math.sin(x))´ adalah ´x´ hanya untuk $x$ di $\left[-\frac\pi2,\frac\pi2\right]$. Baris terakhir memindai sudut pandang lukisan dari $1$ m sampai $3$ m dan mencari jarak terbaik dan sudut terbesar tanpa memakai turunan: $\sqrt3\approx1{,}732$ dan $30^\circ$.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python and SymPy: inverse trigonometric derivatives, compositions and the viewing angle', 'Python dan SymPy: turunan trigonometri invers, komposisi, dan sudut pandang'),
          code: `import math
import sympy as sp

x = sp.symbols('x', positive=True)
for f in (sp.asin(x), sp.acos(x), sp.atan(x), sp.acot(x), sp.asec(x), sp.acsc(x), sp.asin(x**2), sp.atan(1 / x), sp.asec(5 * x**4)):
    print(f, '->', sp.simplify(sp.diff(f, x)))
# asin(x) -> 1/sqrt(1 - x**2)
# acos(x) -> -1/sqrt(1 - x**2)
# atan(x) -> 1/(x**2 + 1)
# acot(x) -> -1/(x**2 + 1)
# asec(x) -> 1/(x*sqrt(x**2 - 1))
# acsc(x) -> -1/(x*sqrt(x**2 - 1))
# asin(x**2) -> 2*x/sqrt(1 - x**4)
# atan(1/x) -> -1/(x**2 + 1)
# asec(5*x**4) -> 4/(x*sqrt(25*x**8 - 1))

print(round(math.asin(math.sin(math.pi)), 6), round(math.asin(math.sin(2)), 6), round(math.pi - 2, 6))   # 0.0 1.141593 1.141593
print(round(math.cos(math.asin(0.6)), 6), round(math.tan(math.asin(0.6)), 6))                             # 0.8 0.75
print(round(math.degrees(math.atan(1)), 6), round(math.degrees(math.acos(-0.5)), 6))                     # 45.0 120.0

angle = lambda t, p=1, q=3: math.atan(q / t) - math.atan(p / t)      # the viewing angle
best = max((k / 1000 for k in range(1, 20001)), key=angle)           # a scan, no derivative
print(best, round(math.degrees(angle(best)), 4))                     # 1.732 30.0
print(round(math.sqrt(1 * 3), 4), round(math.degrees(math.atan((3 - 1) / (2 * math.sqrt(1 * 3)))), 4))   # 1.7321 30.0`,
        },
      ],
    },

    /* ----------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Who named the inverse trigonometric functions, and who found their series?', 'Siapa yang menamai fungsi trigonometri invers, dan siapa yang menemukan derenya?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The arctangent had its series long before it had its derivative, and its notation settled only in the 19th century.**

- **Series.** The series $\arctan x=x-\frac{x^3}{3}+\frac{x^5}{5}-\cdots$ was found by Madhava of Sangamagrama in India around the 14th century, and again by James Gregory in 1671, and by Leibniz soon after. Putting $x=1$ gives $\frac\pi4=1-\frac13+\frac15-\cdots$, the Leibniz series for $\pi$.
- **Derivative.** With the calculus of Newton and Leibniz, the slope $\frac{1}{1+x^2}$ of the arctangent explains that series: the series of $\frac{1}{1+x^2}$ is a geometric series, and integrating it term by term gives the series of $\arctan x$.
- **Names.** The prefix *arc* for the inverse trigonometric functions, because the angle measures an arc of the unit circle, is credited to Karl Scherffer in the 18th century. The exponent notation $\sin^{-1}x$ was introduced by John Herschel in 1813, which is why $\sin^{-1}$ and $\frac{1}{\sin}$ are so often confused.
- **Euler.** Leonhard Euler treated the inverse trigonometric functions together with the exponential and the logarithm, and found their remarkable connection through complex numbers, $\arctan x=\frac{1}{2i}\ln\frac{1+ix}{1-ix}$.`,
            T`**Arkus tangen memiliki deretnya jauh sebelum memiliki turunannya, dan notasinya baru mapan pada abad ke-19.**

- **Deret.** Deret $\arctan x=x-\frac{x^3}{3}+\frac{x^5}{5}-\cdots$ ditemukan oleh Madhava dari Sangamagrama di India sekitar abad ke-14, dan lagi oleh James Gregory pada 1671, dan oleh Leibniz tak lama kemudian. Memasukkan $x=1$ memberi $\frac\pi4=1-\frac13+\frac15-\cdots$, deret Leibniz untuk $\pi$.
- **Turunan.** Dengan kalkulus Newton dan Leibniz, gradien $\frac{1}{1+x^2}$ dari arkus tangen menjelaskan deret itu: deret $\frac{1}{1+x^2}$ adalah deret geometri, dan mengintegralkannya suku demi suku memberi deret $\arctan x$.
- **Nama.** Awalan *arc* untuk fungsi trigonometri invers, karena sudut mengukur busur lingkaran satuan, dikreditkan kepada Karl Scherffer pada abad ke-18. Notasi pangkat $\sin^{-1}x$ diperkenalkan oleh John Herschel pada 1813, itulah sebabnya $\sin^{-1}$ dan $\frac{1}{\sin}$ begitu sering tertukar.
- **Euler.** Leonhard Euler memperlakukan fungsi trigonometri invers bersama eksponensial dan logaritma, dan menemukan hubungan menakjubkan mereka lewat bilangan kompleks, $\arctan x=\frac{1}{2i}\ln\frac{1+ix}{1-ix}$.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What mistakes do people make with inverse trigonometric functions?', 'Kesalahan apa yang sering terjadi pada fungsi trigonometri invers?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with inverse trigonometric functions are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ $\sin^{-1}x=\frac{1}{\sin x}$ | The $-1$ means the inverse function, $\arcsin x$; the reciprocal $\frac{1}{\sin x}$ is $\csc x$. |
| ❌ $\arcsin(\sin y)=y$ for every $y$ | Only for $-\frac\pi2\le y\le\frac\pi2$: $\arcsin(\sin\pi)=0$. |
| ❌ $\arccos\left(-\frac12\right)=-\frac\pi3$ | The range of $\arccos$ is $[0,\pi]$, so the answer is $\frac{2\pi}{3}$. |
| ❌ $\frac{d}{dx}\arcsin x=\frac{1}{1+x^2}$ | That is the arctangent. The arcsine has $\frac{1}{\sqrt{1-x^2}}$. |
| ❌ $\frac{d}{dx}\arctan x=\frac{1}{1-x^2}$ | The sign is plus: $\frac{1}{1+x^2}$, defined for every $x$. |
| ❌ $\frac{d}{dx}\arccos x=\frac{1}{\sqrt{1-x^2}}$ | The arccosine falls: $-\frac{1}{\sqrt{1-x^2}}$. |
| ❌ $\frac{d}{dx}\arcsin(2x)=\frac{2}{\sqrt{1-x^2}}$ | The inside is $2x$, so $\frac{2}{\sqrt{1-4x^2}}$ by the chain rule. |
| ❌ $\frac{d}{dx}\arcsec x=\frac{1}{x\sqrt{x^2-1}}$ for all $x$ | The slope is positive on both pieces: use $|x|$, as $\frac{1}{|x|\sqrt{x^2-1}}$. |
| ❌ $\frac{d}{dx}\frac{1}{\arctan x}=\frac{1}{1+x^2}$ | The reciprocal is a power $-1$: $-\frac{1}{\left(1+x^2\right)\arctan^2x}$. |`,
            T`**Kesalahan paling umum pada fungsi trigonometri invers adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ $\sin^{-1}x=\frac{1}{\sin x}$ | $-1$ berarti fungsi invers, $\arcsin x$; kebalikan $\frac{1}{\sin x}$ adalah $\csc x$. |
| ❌ $\arcsin(\sin y)=y$ untuk setiap $y$ | Hanya untuk $-\frac\pi2\le y\le\frac\pi2$: $\arcsin(\sin\pi)=0$. |
| ❌ $\arccos\left(-\frac12\right)=-\frac\pi3$ | Jangkauan $\arccos$ adalah $[0,\pi]$, sehingga jawabannya $\frac{2\pi}{3}$. |
| ❌ $\frac{d}{dx}\arcsin x=\frac{1}{1+x^2}$ | Itu arkus tangen. Arkus sinus memiliki $\frac{1}{\sqrt{1-x^2}}$. |
| ❌ $\frac{d}{dx}\arctan x=\frac{1}{1-x^2}$ | Tandanya plus: $\frac{1}{1+x^2}$, terdefinisi untuk setiap $x$. |
| ❌ $\frac{d}{dx}\arccos x=\frac{1}{\sqrt{1-x^2}}$ | Arkus kosinus turun: $-\frac{1}{\sqrt{1-x^2}}$. |
| ❌ $\frac{d}{dx}\arcsin(2x)=\frac{2}{\sqrt{1-x^2}}$ | Fungsi dalamnya $2x$, sehingga $\frac{2}{\sqrt{1-4x^2}}$ dengan aturan rantai. |
| ❌ $\frac{d}{dx}\arcsec x=\frac{1}{x\sqrt{x^2-1}}$ untuk semua $x$ | Gradien positif pada kedua bagian: pakai $|x|$, sebagai $\frac{1}{|x|\sqrt{x^2-1}}$. |
| ❌ $\frac{d}{dx}\frac{1}{\arctan x}=\frac{1}{1+x^2}$ | Kebalikan adalah pangkat $-1$: $-\frac{1}{\left(1+x^2\right)\arctan^2x}$. |`,
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
              L('$\\frac{d}{dx}\\arctan x=\\frac{1}{1+x^2}$ for every real $x$.', '$\\frac{d}{dx}\\arctan x=\\frac{1}{1+x^2}$ untuk setiap $x$ real.'),
              L('$\\frac{d}{dx}\\arccos x=\\frac{1}{\\sqrt{1-x^2}}$.', '$\\frac{d}{dx}\\arccos x=\\frac{1}{\\sqrt{1-x^2}}$.'),
              L('$\\sin^{-1}x$ means $\\frac{1}{\\sin x}$.', '$\\sin^{-1}x$ berarti $\\frac{1}{\\sin x}$.'),
              L('$\\arcsin(\\sin\\pi)=\\pi$.', '$\\arcsin(\\sin\\pi)=\\pi$.'),
              L('The slope of $\\arcsec$ is positive on both pieces of its graph.', 'Gradien $\\arcsec$ positif pada kedua bagian grafiknya.'),
              L('$\\arcsin x$ has vertical tangent lines at $x=\\pm1$.', '$\\arcsin x$ memiliki garis singgung tegak di $x=\\pm1$.'),
            ],
            answer: [true, false, false, false, true, true],
            explain: L(
              'The arccosine falls, with the negative slope. $\\sin^{-1}$ is the inverse function and $\\arcsin(\\sin\\pi)=0$, because the arcsine returns an angle in $\\left[-\\frac\\pi2,\\frac\\pi2\\right]$.',
              'Arkus kosinus turun, dengan gradien negatif. $\\sin^{-1}$ adalah fungsi invers dan $\\arcsin(\\sin\\pi)=0$, karena arkus sinus mengembalikan sudut di $\\left[-\\frac\\pi2,\\frac\\pi2\\right]$.',
            ),
            hint: L('Think of the graphs: which falls, which has steep ends?', 'Bayangkan grafiknya: mana yang turun, mana yang ujungnya curam?'),
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
              L('$\\frac{d}{dx}\\arcsin\\left(x^2\\right)=\\frac{2x}{\\sqrt{1-x^4}}$', '$\\frac{d}{dx}\\arcsin\\left(x^2\\right)=\\frac{2x}{\\sqrt{1-x^4}}$'),
              L('$\\frac{d}{dx}\\arctan(2x)=\\frac{2}{1+4x^2}$', '$\\frac{d}{dx}\\arctan(2x)=\\frac{2}{1+4x^2}$'),
              L('$\\frac{d}{dx}\\arccot x=-\\frac{1}{1+x^2}$', '$\\frac{d}{dx}\\arccot x=-\\frac{1}{1+x^2}$'),
              L('$\\frac{d}{dx}\\arctan\\frac1x=-\\frac{1}{1+x^2}$', '$\\frac{d}{dx}\\arctan\\frac1x=-\\frac{1}{1+x^2}$'),
              L('$\\frac{d}{dx}\\arcsin(2x)=\\frac{2}{\\sqrt{1-x^2}}$', '$\\frac{d}{dx}\\arcsin(2x)=\\frac{2}{\\sqrt{1-x^2}}$'),
            ],
            answer: [0, 1, 2, 3],
            explain: L('The last one forgot to put $2x$ into the square root: $\\frac{2}{\\sqrt{1-4x^2}}$.', 'Yang terakhir lupa memasukkan $2x$ ke dalam akar: $\\frac{2}{\\sqrt{1-4x^2}}$.'),
            hint: L('In every formula, put the whole inside function in place of $x$.', 'Pada setiap rumus, ganti $x$ dengan seluruh fungsi dalamnya.'),
          },
        },
        {
          kind: 'activity',
          title: L('The slope of the arctangent', 'Gradien arkus tangen'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L('$\\frac{d}{dx}\\arctan x=\\frac{1}{1+x^2}$.', '$\\frac{d}{dx}\\arctan x=\\frac{1}{1+x^2}$.'), L('At $x=1$: $\\frac12$.', 'Di $x=1$: $\\frac12$.')],
            explain: L('$\\frac{1}{1+1^2}=\\frac12=0.5$.', '$\\frac{1}{1+1^2}=\\frac12=0{,}5$.'),
            prompt: L('Find the slope of $y=\\arctan x$ at $x=1$ (as a decimal).', 'Tentukan gradien $y=\\arctan x$ di $x=1$ (sebagai desimal).'),
            given: String.raw`y'(1)=v`,
            blanks: [{ label: "y' =", answer: 0.5 }],
          },
        },
        {
          kind: 'activity',
          title: L('The slope of the arcsine', 'Gradien arkus sinus'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L('$\\frac{d}{dx}\\arcsin x=\\frac{1}{\\sqrt{1-x^2}}$.', '$\\frac{d}{dx}\\arcsin x=\\frac{1}{\\sqrt{1-x^2}}$.'), L('$1-0.36=0.64$ and $\\sqrt{0.64}=0.8$.', '$1-0{,}36=0{,}64$ dan $\\sqrt{0{,}64}=0{,}8$.')],
            explain: L('$\\frac{1}{\\sqrt{1-0.36}}=\\frac{1}{0.8}=1.25$.', '$\\frac{1}{\\sqrt{1-0{,}36}}=\\frac{1}{0{,}8}=1{,}25$.'),
            prompt: L('Find the slope of $y=\\arcsin x$ at $x=0.6$.', 'Tentukan gradien $y=\\arcsin x$ di $x=0{,}6$.'),
            given: String.raw`y'(0.6)=v`,
            blanks: [{ label: "y' =", answer: 1.25 }],
          },
        },
        {
          kind: 'activity',
          title: L('An angle in the second quadrant', 'Sudut di kuadran kedua'),
          step: {
            kind: 'quiz',
            id: 'p5',
            prompt: L('What is $\\arccos\\left(-\\frac12\\right)$?', 'Berapa $\\arccos\\left(-\\frac12\\right)$?'),
            options: [L('$\\frac{2\\pi}{3}$', '$\\frac{2\\pi}{3}$'), L('$-\\frac\\pi3$', '$-\\frac\\pi3$'), L('$\\frac\\pi3$', '$\\frac\\pi3$'), L('$\\frac{4\\pi}{3}$', '$\\frac{4\\pi}{3}$')],
            answer: 0,
            explain: L('The arccosine takes values in $[0,\\pi]$, and $\\cos\\frac{2\\pi}{3}=-\\frac12$.', 'Arkus kosinus bernilai di $[0,\\pi]$, dan $\\cos\\frac{2\\pi}{3}=-\\frac12$.'),
            hint: L('The answer must lie between $0$ and $\\pi$.', 'Jawabannya harus berada di antara $0$ dan $\\pi$.'),
          },
        },
        {
          kind: 'activity',
          title: L('The arcsine of a sine', 'Arkus sinus dari suatu sinus'),
          step: {
            kind: 'quiz',
            id: 'p6',
            prompt: L('What is $\\arcsin(\\sin\\pi)$?', 'Berapa $\\arcsin(\\sin\\pi)$?'),
            options: [L('$0$', '$0$'), L('$\\pi$', '$\\pi$'), L('$-\\pi$', '$-\\pi$'), L('$\\frac\\pi2$', '$\\frac\\pi2$')],
            answer: 0,
            explain: L('$\\sin\\pi=0$ and $\\arcsin0=0$: the arcsine returns the angle in $\\left[-\\frac\\pi2,\\frac\\pi2\\right]$ with that sine.', '$\\sin\\pi=0$ dan $\\arcsin0=0$: arkus sinus mengembalikan sudut di $\\left[-\\frac\\pi2,\\frac\\pi2\\right]$ dengan sinus itu.'),
            hint: L('First find $\\sin\\pi$.', 'Cari dulu $\\sin\\pi$.'),
          },
        },
        {
          kind: 'activity',
          title: L('A chain rule at the origin', 'Aturan rantai di titik asal'),
          step: {
            kind: 'math',
            id: 'p7',
            hints: [L('$\\frac{d}{dx}\\arcsin(2x)=\\frac{2}{\\sqrt{1-4x^2}}$.', '$\\frac{d}{dx}\\arcsin(2x)=\\frac{2}{\\sqrt{1-4x^2}}$.'), L('At $x=0$: $\\frac{2}{\\sqrt1}$.', 'Di $x=0$: $\\frac{2}{\\sqrt1}$.')],
            explain: L('$\\frac{2}{\\sqrt{1-0}}=2$.', '$\\frac{2}{\\sqrt{1-0}}=2$.'),
            prompt: L('Find the slope of $y=\\arcsin(2x)$ at $x=0$.', 'Tentukan gradien $y=\\arcsin(2x)$ di $x=0$.'),
            given: String.raw`y'(0)=v`,
            blanks: [{ label: "y' =", answer: 2 }],
          },
        },
        {
          kind: 'activity',
          title: L('The slope of the arcsecant', 'Gradien arkus sekan'),
          step: {
            kind: 'math',
            id: 'p8',
            hints: [L('$\\frac{d}{dx}\\arcsec x=\\frac{1}{|x|\\sqrt{x^2-1}}$.', '$\\frac{d}{dx}\\arcsec x=\\frac{1}{|x|\\sqrt{x^2-1}}$.'), L('$x^2-1=\\frac{25}{9}-1=\\frac{16}{9}$, so the root is $\\frac43$.', '$x^2-1=\\frac{25}{9}-1=\\frac{16}{9}$, sehingga akarnya $\\frac43$.')],
            explain: L('$\\frac{1}{\\frac53\\cdot\\frac43}=\\frac{9}{20}=0.45$.', '$\\frac{1}{\\frac53\\cdot\\frac43}=\\frac{9}{20}=0{,}45$.'),
            prompt: L('Find the slope of $y=\\arcsec x$ at $x=\\frac53$ (as a decimal).', 'Tentukan gradien $y=\\arcsec x$ di $x=\\frac53$ (sebagai desimal).'),
            given: String.raw`y'\left(\tfrac53\right)=v`,
            blanks: [{ label: "y' =", answer: 0.45 }],
          },
        },
        {
          kind: 'activity',
          title: L('A cosine of an arcsine', 'Kosinus dari arkus sinus'),
          step: {
            kind: 'math',
            id: 'p9',
            hints: [L('Draw a right triangle with opposite side $3$ and hypotenuse $5$.', 'Gambar segitiga siku-siku dengan sisi depan $3$ dan sisi miring $5$.'), L('The adjacent side is $4$.', 'Sisi sampingnya $4$.')],
            explain: L('With $\\sin\\theta=\\frac35$ the adjacent side is $4$, so $\\cos\\theta=\\frac45=0.8$.', 'Dengan $\\sin\\theta=\\frac35$ sisi sampingnya $4$, sehingga $\\cos\\theta=\\frac45=0{,}8$.'),
            prompt: L('Find $\\cos\\left(\\arcsin\\frac35\\right)$ (as a decimal).', 'Tentukan $\\cos\\left(\\arcsin\\frac35\\right)$ (sebagai desimal).'),
            given: String.raw`\cos\left(\arcsin\tfrac35\right)=v`,
            blanks: [{ label: 'value =', answer: 0.8 }],
          },
        },
        {
          kind: 'activity',
          title: L('The arctangent of a reciprocal', 'Arkus tangen suatu kebalikan'),
          step: {
            kind: 'quiz',
            id: 'p10',
            prompt: L('What is $\\frac{d}{dx}\\arctan\\frac1x$ for $x\\ne0$?', 'Berapa $\\frac{d}{dx}\\arctan\\frac1x$ untuk $x\\ne0$?'),
            options: [L('$-\\frac{1}{1+x^2}$', '$-\\frac{1}{1+x^2}$'), L('$\\frac{1}{1+x^2}$', '$\\frac{1}{1+x^2}$'), L('$-\\frac{1}{x^2\\left(1+x^2\\right)}$', '$-\\frac{1}{x^2\\left(1+x^2\\right)}$'), L('$\\frac{1}{x^2}$', '$\\frac{1}{x^2}$')],
            answer: 0,
            explain: L('The chain rule gives $\\frac{1}{1+1/x^2}\\cdot\\left(-\\frac{1}{x^2}\\right)=-\\frac{1}{x^2+1}$.', 'Aturan rantai memberi $\\frac{1}{1+1/x^2}\\cdot\\left(-\\frac{1}{x^2}\\right)=-\\frac{1}{x^2+1}$.'),
            hint: L('Multiply $\\frac{1}{1+u^2}$ by the derivative of $u=\\frac1x$.', 'Kalikan $\\frac{1}{1+u^2}$ dengan turunan $u=\\frac1x$.'),
          },
        },
        {
          kind: 'activity',
          title: L('The best place to stand', 'Tempat terbaik untuk berdiri'),
          step: {
            kind: 'math',
            id: 'p11',
            hints: [L('The best distance is $\\sqrt{pq}$.', 'Jarak terbaik adalah $\\sqrt{pq}$.'), L('$\\sqrt{1\\cdot4}$.', '$\\sqrt{1\\cdot4}$.')],
            explain: L('$\\theta\'(x)=0$ at $x=\\sqrt{pq}=\\sqrt{1\\cdot4}=2$ m.', '$\\theta\'(x)=0$ di $x=\\sqrt{pq}=\\sqrt{1\\cdot4}=2$ m.'),
            prompt: L('A picture hangs from $1$ m to $4$ m above your eye. At what distance from the wall (in m) is the viewing angle largest?', 'Sebuah lukisan tergantung dari $1$ m sampai $4$ m di atas matamu. Pada jarak berapa dari dinding (dalam m) sudut pandangnya terbesar?'),
            given: String.raw`x=v`,
            blanks: [{ label: 'x =', answer: 2 }],
          },
        },
        {
          kind: 'activity',
          title: L('Why the absolute value', 'Mengapa nilai mutlak'),
          step: {
            kind: 'quiz',
            id: 'p12',
            prompt: L('Why does the derivative of $\\arcsec x$ have $|x|$ in it?', 'Mengapa turunan $\\arcsec x$ memuat $|x|$?'),
            options: [L('its slope is positive on both pieces of the graph, also for $x<-1$', 'gradiennya positif pada kedua bagian grafik, juga untuk $x<-1$'), L('because $x$ can be zero', 'karena $x$ dapat bernilai nol'), L('to make the square root defined', 'agar akarnya terdefinisi'), L('because the function is odd', 'karena fungsinya ganjil')],
            answer: 0,
            explain: L('Without it the formula would be negative for $x<-1$, but the arcsecant is increasing there too.', 'Tanpa itu rumusnya negatif untuk $x<-1$, padahal arkus sekan juga naik di sana.'),
            hint: L('Look at the sign of the slope on the left piece of the graph.', 'Lihat tanda gradien pada bagian kiri grafik.'),
          },
        },
      ],
    },

    /* ----------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: inverse trigonometric functions at a glance', 'Ringkasan: fungsi trigonometri invers sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Definition:** the angle with a given trigonometric value, in one fixed range: $\arcsin$ and $\arctan$ in $\left(-\frac\pi2,\frac\pi2\right)$ (closed for arcsin), $\arccos$ in $[0,\pi]$, $\arccot$ in $(0,\pi)$.
- **Compositions:** $\sin(\arcsin x)=x$ but $\arcsin(\sin y)=y$ only on $\left[-\frac\pi2,\frac\pi2\right]$; $\cos(\arcsin x)=\sqrt{1-x^2}$ from the reference triangle.
- **Derivatives:** $\frac{1}{\sqrt{1-x^2}}$ for arcsin, $\frac{1}{1+x^2}$ for arctan, $\frac{1}{|x|\sqrt{x^2-1}}$ for arcsec; the co-functions have the negatives.
- **Chain rule:** put $u$ for $x$ and multiply by $u'$; $\frac{d}{dx}\arcsin\left(x^2\right)=\frac{2x}{\sqrt{1-x^4}}$.
- **Identities:** $\arccos x=\frac\pi2-\arcsin x$, $\arcsec x=\arccos\frac1x$; the arctangent is odd with asymptotes $\pm\frac\pi2$.
- **Viewing angle:** $\arctan\frac qx-\arctan\frac px$ is largest at $x=\sqrt{pq}$.
- **Code:** ´math.asin´, ´math.acos(1/x)´ for arcsec, ´sp.diff(sp.asin(x), x)´.`,
            T`- **Definisi:** sudut dengan nilai trigonometri tertentu, dalam satu jangkauan tetap: $\arcsin$ dan $\arctan$ di $\left(-\frac\pi2,\frac\pi2\right)$ (tertutup untuk arcsin), $\arccos$ di $[0,\pi]$, $\arccot$ di $(0,\pi)$.
- **Komposisi:** $\sin(\arcsin x)=x$ tetapi $\arcsin(\sin y)=y$ hanya pada $\left[-\frac\pi2,\frac\pi2\right]$; $\cos(\arcsin x)=\sqrt{1-x^2}$ dari segitiga acuan.
- **Turunan:** $\frac{1}{\sqrt{1-x^2}}$ untuk arcsin, $\frac{1}{1+x^2}$ untuk arctan, $\frac{1}{|x|\sqrt{x^2-1}}$ untuk arcsec; fungsi ko memiliki negatifnya.
- **Aturan rantai:** ganti $x$ dengan $u$ dan kalikan dengan $u'$; $\frac{d}{dx}\arcsin\left(x^2\right)=\frac{2x}{\sqrt{1-x^4}}$.
- **Identitas:** $\arccos x=\frac\pi2-\arcsin x$, $\arcsec x=\arccos\frac1x$; arkus tangen ganjil dengan asimtot $\pm\frac\pi2$.
- **Sudut pandang:** $\arctan\frac qx-\arctan\frac px$ terbesar di $x=\sqrt{pq}$.
- **Kode:** ´math.asin´, ´math.acos(1/x)´ untuk arcsec, ´sp.diff(sp.asin(x), x)´.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Inverse trigonometric function', 'Fungsi trigonometri invers'), definition: L('A function that gives the angle with a given sine, cosine, tangent, cotangent, secant or cosecant, chosen from one fixed interval so that it is single-valued.', 'Fungsi yang memberi sudut dengan sinus, kosinus, tangen, kotangen, sekan, atau kosekan tertentu, dipilih dari satu selang tetap sehingga bernilai tunggal.') },
    { term: L('Arcsine', 'Arkus sinus'), definition: L('The angle in the interval from minus pi over 2 to pi over 2 whose sine is x, defined for x from minus 1 to 1; it is written arcsin x or sin to the minus 1 of x.', 'Sudut pada selang dari minus pi per 2 sampai pi per 2 yang sinusnya x, terdefinisi untuk x dari minus 1 sampai 1; ditulis arcsin x atau sin pangkat minus 1 dari x.') },
    { term: L('Arctangent', 'Arkus tangen'), definition: L('The angle strictly between minus pi over 2 and pi over 2 whose tangent is x, defined for every real x, with horizontal asymptotes at plus and minus pi over 2.', 'Sudut yang tepat di antara minus pi per 2 dan pi per 2 yang tangennya x, terdefinisi untuk setiap x real, dengan asimtot mendatar di plus dan minus pi per 2.') },
    { term: L('Reference triangle', 'Segitiga acuan'), definition: L('The right triangle drawn for an angle such as arcsin x, with sides chosen so that the right ratio equals x, used to read off the other trigonometric values.', 'Segitiga siku-siku yang digambar untuk suatu sudut seperti arcsin x, dengan sisi dipilih sehingga rasio yang tepat sama dengan x, dipakai untuk membaca nilai trigonometri lainnya.') },
    { term: L('Cofunction identity', 'Identitas kofungsi'), definition: L('The relation that an inverse cofunction is pi over 2 minus the inverse function, such as arccos x equals pi over 2 minus arcsin x, so their derivatives are negatives of each other.', 'Hubungan bahwa kofungsi invers adalah pi per 2 dikurangi fungsi invers, seperti arccos x sama dengan pi per 2 dikurangi arcsin x, sehingga turunannya saling negatif.') },
    { term: L('Angle of elevation', 'Sudut elevasi'), definition: L('The angle between the horizontal and the line of sight to a point above it; for a height h at distance x it is arctan of h over x.', 'Sudut antara garis mendatar dan garis pandang ke suatu titik di atasnya; untuk tinggi h pada jarak x nilainya arctan dari h per x.') },
  ],

  howTo: [
    {
      name: L('How to differentiate an inverse trigonometric function', 'Cara menurunkan fungsi trigonometri invers'),
      description: L('Use the formula for the function and multiply by the derivative of what is inside.', 'Pakai rumus fungsinya dan kalikan dengan turunan apa yang ada di dalamnya.'),
      steps: [
        { name: L('Write the formula', 'Tulis rumusnya'), text: L('Arcsin of u has derivative 1 over the square root of 1 minus u squared, arctan of u has 1 over 1 plus u squared, and arcsec of u has 1 over absolute u times the square root of u squared minus 1.', 'Arcsin dari u berturunan 1 per akar 1 dikurangi u kuadrat, arctan dari u berturunan 1 per 1 ditambah u kuadrat, dan arcsec dari u berturunan 1 per nilai mutlak u kali akar u kuadrat dikurangi 1.') },
        { name: L('Multiply by the derivative of the inside', 'Kalikan dengan turunan fungsi dalam'), text: L('Differentiate u and multiply; for the co-functions put a minus sign in front.', 'Turunkan u dan kalikan; untuk fungsi ko beri tanda minus di depan.') },
        { name: L('Check the domain', 'Periksa domainnya'), text: L('Arcsin needs the absolute value of u below 1 and arcsec needs it above 1; the formula does not apply outside.', 'Arcsin memerlukan nilai mutlak u di bawah 1 dan arcsec memerlukannya di atas 1; rumus tidak berlaku di luar itu.') },
      ],
    },
    {
      name: L('How to evaluate a trigonometric function of an inverse with a reference triangle', 'Cara menghitung fungsi trigonometri dari suatu invers dengan segitiga acuan'),
      description: L('Draw the right triangle, find the third side, and read the ratio.', 'Gambar segitiga siku-siku, cari sisi ketiga, dan baca rasionya.'),
      steps: [
        { name: L('Draw the triangle', 'Gambar segitiganya'), text: L('For the angle arcsin of 3 over 5, give the opposite side 3 and the hypotenuse 5, so that its sine is 3 over 5.', 'Untuk sudut arcsin dari 3 per 5, beri sisi depan 3 dan sisi miring 5, sehingga sinusnya 3 per 5.') },
        { name: L('Find the third side', 'Cari sisi ketiga'), text: L('Use Pythagoras: the adjacent side is the square root of 25 minus 9, which is 4.', 'Pakai Pythagoras: sisi sampingnya akar dari 25 dikurangi 9, yaitu 4.') },
        { name: L('Read the ratio', 'Baca rasionya'), text: L('The cosine is adjacent over hypotenuse, 4 over 5, and the tangent is 3 over 4.', 'Kosinusnya samping per miring, 4 per 5, dan tangennya 3 per 4.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is the derivative of arcsin x?', 'Berapa turunan arcsin x?'),
      a: L(
        'The derivative of arcsin x is 1 over the square root of 1 minus x squared, for x between minus 1 and 1. The slope is at least 1 and grows without bound near plus and minus 1, where the graph has vertical tangent lines.',
        'Turunan arcsin x adalah 1 per akar 1 dikurangi x kuadrat, untuk x di antara minus 1 dan 1. Gradiennya paling sedikit 1 dan membesar tanpa batas di dekat plus dan minus 1, tempat grafik memiliki garis singgung tegak.',
      ),
    },
    {
      q: L('What is the derivative of arctan x?', 'Berapa turunan arctan x?'),
      a: L(
        'The derivative of arctan x is 1 over 1 plus x squared, for every real x. It is largest, equal to 1, at the origin and tends to zero for large x, which is why the graph flattens towards its asymptotes at plus and minus pi over 2.',
        'Turunan arctan x adalah 1 per 1 ditambah x kuadrat, untuk setiap x real. Ia terbesar, sama dengan 1, di titik asal dan menuju nol untuk x besar, itulah sebabnya grafik melandai menuju asimtotnya di plus dan minus pi per 2.',
      ),
    },
    {
      q: L('What is the derivative of arcsec x?', 'Berapa turunan arcsec x?'),
      a: L(
        'It is 1 over the absolute value of x times the square root of x squared minus 1, for absolute x greater than 1. The absolute value is there because the arcsecant is increasing on both pieces of its graph, so its slope is positive also for x below minus 1.',
        'Turunannya adalah 1 per nilai mutlak x kali akar x kuadrat dikurangi 1, untuk nilai mutlak x lebih besar dari 1. Nilai mutlak ada karena arkus sekan naik pada kedua bagian grafiknya, sehingga gradiennya positif juga untuk x di bawah minus 1.',
      ),
    },
    {
      q: L('What is the derivative of arccos x?', 'Berapa turunan arccos x?'),
      a: L(
        'It is minus 1 over the square root of 1 minus x squared, the negative of the derivative of arcsin x. This follows from arccos x equal to pi over 2 minus arcsin x. The same pattern gives the derivatives of arccot and arccsc.',
        'Turunannya adalah minus 1 per akar 1 dikurangi x kuadrat, negatif dari turunan arcsin x. Ini mengikuti dari arccos x sama dengan pi per 2 dikurangi arcsin x. Pola yang sama memberi turunan arccot dan arccsc.',
      ),
    },
    {
      q: L('What is the difference between sin inverse x and 1 over sin x?', 'Apa beda sin invers x dan 1 per sin x?'),
      a: L(
        'The exponent minus 1 in sin inverse x means the inverse function, written arcsin x, which gives an angle. The reciprocal 1 over sin x is the cosecant of x, which is a number computed from an angle. They are unrelated functions.',
        'Pangkat minus 1 pada sin invers x berarti fungsi invers, ditulis arcsin x, yang memberi sudut. Kebalikan 1 per sin x adalah kosekan x, yaitu bilangan yang dihitung dari sudut. Keduanya fungsi yang tidak berkaitan.',
      ),
    },
    {
      q: L('Why is arcsin of sin x not always x?', 'Mengapa arcsin dari sin x tidak selalu x?'),
      a: L(
        'Because the sine repeats, many angles share the same sine, and the arcsine returns only the one between minus pi over 2 and pi over 2. So arcsin of sin x equals x only on that interval; for x equal to pi it gives 0.',
        'Karena sinus berulang, banyak sudut memiliki sinus yang sama, dan arkus sinus hanya mengembalikan yang di antara minus pi per 2 dan pi per 2. Jadi arcsin dari sin x sama dengan x hanya pada selang itu; untuk x sama dengan pi hasilnya 0.',
      ),
    },
    {
      q: L('What is cos of arcsin x?', 'Berapa cos dari arcsin x?'),
      a: L(
        'It is the square root of 1 minus x squared. Draw a right triangle with the opposite side x and the hypotenuse 1; the adjacent side is the square root of 1 minus x squared, and the cosine is adjacent over hypotenuse.',
        'Hasilnya akar 1 dikurangi x kuadrat. Gambar segitiga siku-siku dengan sisi depan x dan sisi miring 1; sisi sampingnya akar 1 dikurangi x kuadrat, dan kosinus adalah samping per miring.',
      ),
    },
    {
      q: L('How do you differentiate arctan of a function?', 'Bagaimana menurunkan arctan dari suatu fungsi?'),
      a: L(
        'Use the chain rule: the derivative of arctan u is the derivative of u divided by 1 plus u squared. For arctan of 2x that is 2 over 1 plus 4x squared. The same pattern works for arcsin, with the square root of 1 minus u squared.',
        'Pakai aturan rantai: turunan arctan u adalah turunan u dibagi 1 ditambah u kuadrat. Untuk arctan dari 2x itu 2 per 1 ditambah 4x kuadrat. Pola yang sama berlaku untuk arcsin, dengan akar 1 dikurangi u kuadrat.',
      ),
    },
    {
      q: L('What are the limits of arctan x at infinity?', 'Berapa limit arctan x di tak hingga?'),
      a: L(
        'As x tends to plus infinity, arctan x tends to pi over 2, and as x tends to minus infinity it tends to minus pi over 2. The graph therefore has the two horizontal asymptotes y equal to plus and minus pi over 2.',
        'Saat x menuju plus tak hingga, arctan x menuju pi per 2, dan saat x menuju minus tak hingga ia menuju minus pi per 2. Karena itu grafik memiliki dua asimtot mendatar y sama dengan plus dan minus pi per 2.',
      ),
    },
  ],

  references: [
    { title: "Thomas' Calculus: Early Transcendentals in SI Units (15th ed.), Section 3.9: Inverse Trigonometric Functions", author: 'Joel Hass, Christopher Heil, Maurice D. Weir et al.', year: 2023, source: 'Pearson' },
    { title: 'Calculus (8th ed.), section 3.5: Inverse Trigonometric Functions (in the 8th ed. section 3.5)', author: 'James Stewart', year: 2015, source: 'Cengage Learning' },
    { title: 'Introductio in analysin infinitorum', author: 'Leonhard Euler', year: 1748, source: 'Lausanne' },
    { title: 'Vera circuli et hyperbolae quadratura', author: 'James Gregory', year: 1667, source: 'Padua' },
  ],

  related: ['derivatives-of-inverse-functions-and-logarithms', 'derivatives-of-trigonometric-functions', 'the-chain-rule', 'triangles'],
}
