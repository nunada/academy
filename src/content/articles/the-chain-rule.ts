import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './the-chain-rule.meta'

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
    T`**The chain rule says that the derivative of a composite function is the derivative of the outside function, evaluated at the inside function, times the derivative of the inside function: $(f\circ g)'(x)=f'(g(x))\cdot g'(x)$.** In Leibniz's notation, with $y=f(u)$ and $u=g(x)$, it reads $\frac{dy}{dx}=\frac{dy}{du}\cdot\frac{du}{dx}$: rates of change multiply. It is the reason that $\frac{d}{dx}\sin 2x=2\cos 2x$ and $\frac{d}{dx}e^{x^2}=2x\,e^{x^2}$.`,
    T`**Aturan rantai menyatakan bahwa turunan suatu fungsi komposit adalah turunan fungsi luar, dihitung pada fungsi dalam, dikali turunan fungsi dalam: $(f\circ g)'(x)=f'(g(x))\cdot g'(x)$.** Dalam notasi Leibniz, dengan $y=f(u)$ dan $u=g(x)$, ia berbunyi $\frac{dy}{dx}=\frac{dy}{du}\cdot\frac{du}{dx}$: laju perubahan saling dikalikan. Itulah sebabnya $\frac{d}{dx}\sin 2x=2\cos 2x$ dan $\frac{d}{dx}e^{x^2}=2x\,e^{x^2}$.`,
  ),

  keyPoints: [
    L(
      T`A composite function $f(g(x))$ puts the inside function $g$ into the outside function $f$; the outside is the last thing done to $x$, and finding the two layers is the first step of every chain rule problem.`,
      T`Fungsi komposit $f(g(x))$ memasukkan fungsi dalam $g$ ke fungsi luar $f$; fungsi luar adalah hal terakhir yang dilakukan pada $x$, dan menemukan kedua lapisan itu adalah langkah pertama setiap soal aturan rantai.`,
    ),
    L(
      T`$\frac{dy}{dx}=\frac{dy}{du}\cdot\frac{du}{dx}$: if $y$ changes half as fast as $u$ and $u$ changes three times as fast as $x$, then $y$ changes $\frac32$ times as fast as $x$, like a train of gears.`,
      T`$\frac{dy}{dx}=\frac{dy}{du}\cdot\frac{du}{dx}$: jika $y$ berubah separuh secepat $u$ dan $u$ berubah tiga kali secepat $x$, maka $y$ berubah $\frac32$ kali secepat $x$, seperti rangkaian roda gigi.`,
    ),
    L(
      T`Outside-inside rule: differentiate the outside function and leave the inside alone, then multiply by the derivative of the inside; for example $\frac{d}{dx}e^u=e^u\frac{du}{dx}$ and $\frac{d}{dx}\sin u=\cos u\,\frac{du}{dx}$.`,
      T`Aturan luar-dalam: turunkan fungsi luar dan biarkan fungsi dalam apa adanya, lalu kalikan dengan turunan fungsi dalam; misalnya $\frac{d}{dx}e^u=e^u\frac{du}{dx}$ dan $\frac{d}{dx}\sin u=\cos u\,\frac{du}{dx}$.`,
    ),
    L(
      T`The power chain rule $\frac{d}{dx}u^n=n\,u^{n-1}\frac{du}{dx}$ handles $\left(5x^3-x^4\right)^7$, $\frac{1}{3x-2}$, $\sin^5x$ and $\sqrt{3x+1}$, and gives $\frac{d}{dx}|x|=\frac{x}{|x|}$ for $x\ne0$.`,
      T`Aturan rantai pangkat $\frac{d}{dx}u^n=n\,u^{n-1}\frac{du}{dx}$ menangani $\left(5x^3-x^4\right)^7$, $\frac{1}{3x-2}$, $\sin^5x$, dan $\sqrt{3x+1}$, dan memberi $\frac{d}{dx}|x|=\frac{x}{|x|}$ untuk $x\ne0$.`,
    ),
    L(
      T`A constant $k$ inside a sine brings out a factor $k$: doubling the frequency of a piston doubles its velocity, quadruples its acceleration and multiplies its jerk by $8$; in degrees the factor is $\frac{\pi}{180}$.`,
      T`Konstanta $k$ di dalam sinus memunculkan faktor $k$: menggandakan frekuensi piston menggandakan kecepatannya, melipatempatkan percepatannya, dan mengalikan sentakannya dengan $8$; dalam derajat faktornya $\frac{\pi}{180}$.`,
    ),
    L(
      T`The second derivative of a composite is $f''(g)\,(g')^2+f'(g)\,g''$, not $f''(g)\,g''$; and the rule needs both functions to be differentiable where they are used.`,
      T`Turunan kedua fungsi komposit adalah $f''(g)\,(g')^2+f'(g)\,g''$, bukan $f''(g)\,g''$; dan aturan ini memerlukan kedua fungsi terdiferensialkan di tempat ia dipakai.`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------- composite functions */
    {
      id: 'composite-functions',
      heading: L('What is a composite function, and how do you find its inside and outside?', 'Apa itu fungsi komposit, dan bagaimana menemukan fungsi dalam dan luarnya?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A composite function applies one function to the result of another: $(f\circ g)(x)=f(g(x))$, where $g$ is the *inside* function, applied first, and $f$ is the *outside* function, applied last.** The function $F(x)=\sin\left(x^2-4\right)$ is of this kind. It cannot be differentiated by the [rules so far](article:differentiation-rules#product-rule), but it is built from two functions that can: the outside $f(u)=\sin u$ and the inside $u=g(x)=x^2-4$.

To find the layers, ask *what is the last thing done to $x$?* That is the outside function. What it is done to is the inside.

| Function | Outside $f(u)$ | Inside $u=g(x)$ |
|---|---|---|
| $\left(3x^2+1\right)^2$ | $u^2$ | $3x^2+1$ |
| $\sin\left(x^2-4\right)$ | $\sin u$ | $x^2-4$ |
| $e^{\cos x}$ | $e^u$ | $\cos x$ |
| $\sqrt{3x+1}$ | $\sqrt u$ | $3x+1$ |
| $\frac{1}{3x-2}$ | $u^{-1}$ | $3x-2$ |
| $\sin^5x$ | $u^5$ | $\sin x$ |

**The order matters.** $f(g(x))$ is not $g(f(x))$: $\sin\left(x^2\right)$ puts the square inside the sine, while $\sin^2x=(\sin x)^2$ puts the sine inside the square. At $x=2$ they are $\sin4\approx-0.757$ and $\sin^22\approx0.827$.

**More than two layers.** The function $\tan\left(5-\sin2x\right)$ is a tangent of $5-\sin2x$, which is $5$ minus a sine of $2x$, which is twice $x$. Peeling it like an onion gives four layers: tangent, "$5$ minus", sine, and "twice". Each layer will cost one factor in the derivative.

**Not every combination is a composition.** $x^2\sin x$ is a *product* of two functions of $x$, and $x^2+\sin x$ is a *sum*: neither puts one function inside the other, so the [product rule](article:differentiation-rules#product-rule) and the sum rule are the ones to use. A function can need both, as $x\sin2x$ does.`,
            T`**Fungsi komposit menerapkan satu fungsi pada hasil fungsi lain: $(f\circ g)(x)=f(g(x))$, dengan $g$ adalah fungsi *dalam*, diterapkan lebih dulu, dan $f$ adalah fungsi *luar*, diterapkan terakhir.** Fungsi $F(x)=\sin\left(x^2-4\right)$ adalah jenis ini. Ia tidak dapat diturunkan dengan [aturan-aturan sejauh ini](article:differentiation-rules#product-rule), tetapi ia dibangun dari dua fungsi yang dapat: fungsi luar $f(u)=\sin u$ dan fungsi dalam $u=g(x)=x^2-4$.

Untuk menemukan lapisannya, tanyakan *apa hal terakhir yang dilakukan pada $x$?* Itulah fungsi luar. Apa yang dikenainya adalah fungsi dalam.

| Fungsi | Luar $f(u)$ | Dalam $u=g(x)$ |
|---|---|---|
| $\left(3x^2+1\right)^2$ | $u^2$ | $3x^2+1$ |
| $\sin\left(x^2-4\right)$ | $\sin u$ | $x^2-4$ |
| $e^{\cos x}$ | $e^u$ | $\cos x$ |
| $\sqrt{3x+1}$ | $\sqrt u$ | $3x+1$ |
| $\frac{1}{3x-2}$ | $u^{-1}$ | $3x-2$ |
| $\sin^5x$ | $u^5$ | $\sin x$ |

**Urutannya penting.** $f(g(x))$ bukan $g(f(x))$: $\sin\left(x^2\right)$ menaruh kuadrat di dalam sinus, sedangkan $\sin^2x=(\sin x)^2$ menaruh sinus di dalam kuadrat. Di $x=2$ keduanya $\sin4\approx-0{,}757$ dan $\sin^22\approx0{,}827$.

**Lebih dari dua lapisan.** Fungsi $\tan\left(5-\sin2x\right)$ adalah tangen dari $5-\sin2x$, yaitu $5$ dikurangi sinus dari $2x$, yaitu dua kali $x$. Mengupasnya seperti bawang memberi empat lapisan: tangen, "$5$ dikurangi", sinus, dan "dua kali". Tiap lapisan akan menambah satu faktor pada turunannya.

**Tidak setiap kombinasi adalah komposisi.** $x^2\sin x$ adalah *hasil kali* dua fungsi dari $x$, dan $x^2+\sin x$ adalah *jumlah*: keduanya tidak menaruh satu fungsi di dalam fungsi lain, sehingga [aturan hasil kali](article:differentiation-rules#product-rule) dan aturan jumlahlah yang dipakai. Satu fungsi dapat memerlukan keduanya, seperti $x\sin2x$.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------- the chain rule */
    {
      id: 'chain-rule',
      heading: L('What is the chain rule?', 'Apa itu aturan rantai?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The chain rule says that if $g$ is differentiable at $x$ and $f$ is differentiable at $g(x)$, then $f\circ g$ is differentiable at $x$ and $(f\circ g)'(x)=f'(g(x))\cdot g'(x)$.** In Leibniz's notation, with $y=f(u)$ and $u=g(x)$,
$$\frac{dy}{dx}=\frac{dy}{du}\cdot\frac{du}{dx},$$
where $\frac{dy}{du}$ is evaluated at $u=g(x)$.

**Why rates multiply.** Three gears are meshed in a line. When gear A turns $x$ times, gear B turns $u=3x$ times, because B turns three times for each turn of A, and gear C turns $y=\frac{u}{2}$ times, because C turns half a turn for each turn of B. So $y=\frac{3x}{2}$ and
$$\frac{dy}{dx}=\frac32=\frac12\cdot3=\frac{dy}{du}\cdot\frac{du}{dx}.$$
If $y$ changes half as fast as $u$ and $u$ changes three times as fast as $x$, then $y$ changes $\frac32$ times as fast as $x$. For curves the same is true instant by instant: the slope of the composite at $x$ is the rate of the outside *at the point $g(x)$ that the inside has reached* times the rate of the inside at $x$.

**The outside-inside rule.** In words: differentiate the outside function and evaluate it at the inside function left alone, then multiply by the derivative of the inside function. The Leibniz form hides where each derivative is evaluated; the functional form $f'(g(x))\cdot g'(x)$ shows it: $f'$ at $g(x)$, not at $x$.

**Example 1.** Find the derivative of $y=\left(3x^2+1\right)^2$. The outside is $y=u^2$ and the inside is $u=3x^2+1$, so $\frac{dy}{du}=2u=2\left(3x^2+1\right)$ and $\frac{du}{dx}=6x$:
$$\frac{dy}{dx}=2\left(3x^2+1\right)\cdot6x=36x^3+12x.$$
Expanding first gives $y=9x^4+6x^2+1$ and the same $36x^3+12x$. The chain rule is not needed for this one, but it is for $\left(3x^2+1\right)^{50}$.

**Example 2.** A body moves along a line with position $x(t)=\cos\left(t^2+1\right)$ at time $t\ge0$. The outside is $\cos u$, with derivative $-\sin u$, and the inside is $u=t^2+1$, with derivative $2t$. The velocity is
$$v=-\sin\left(t^2+1\right)\cdot2t$$
$$=-2t\sin\left(t^2+1\right).$$

**A proof of one case, and its gap.** Let $\Delta u=g(x+\Delta x)-g(x)$ and $\Delta y=f(u+\Delta u)-f(u)$. If $\Delta u\ne0$ we can write
$$\frac{\Delta y}{\Delta x}=\frac{\Delta y}{\Delta u}\cdot\frac{\Delta u}{\Delta x}.$$
As $\Delta x\to0$ we also have $\Delta u\to0$, because $g$ is continuous, so the right side tends to $f'(u)\cdot g'(x)$. The gap is that if $g$ oscillates rapidly near $x$, $\Delta u$ can be $0$ even when $\Delta x\ne0$, and then the cancellation is not allowed. A complete proof avoids dividing by $\Delta u$: it writes $\Delta y=\left(f'(u)+\varepsilon\right)\Delta u$, where $\varepsilon\to0$ as $\Delta u\to0$ and $\varepsilon=0$ when $\Delta u=0$. That form is true in every case.

Pick an outside function and an inside function below, slide $x$, and compare the product of the two rates with the slope of the graph of the composite.`,
            T`**Aturan rantai menyatakan bahwa jika $g$ terdiferensialkan di $x$ dan $f$ terdiferensialkan di $g(x)$, maka $f\circ g$ terdiferensialkan di $x$ dan $(f\circ g)'(x)=f'(g(x))\cdot g'(x)$.** Dalam notasi Leibniz, dengan $y=f(u)$ dan $u=g(x)$,
$$\frac{dy}{dx}=\frac{dy}{du}\cdot\frac{du}{dx},$$
dengan $\frac{dy}{du}$ dihitung pada $u=g(x)$.

**Mengapa laju saling dikalikan.** Tiga roda gigi dipasang berderet. Saat roda A berputar $x$ kali, roda B berputar $u=3x$ kali, karena B berputar tiga kali untuk tiap putaran A, dan roda C berputar $y=\frac{u}{2}$ kali, karena C berputar setengah putaran untuk tiap putaran B. Jadi $y=\frac{3x}{2}$ dan
$$\frac{dy}{dx}=\frac32=\frac12\cdot3=\frac{dy}{du}\cdot\frac{du}{dx}.$$
Jika $y$ berubah separuh secepat $u$ dan $u$ berubah tiga kali secepat $x$, maka $y$ berubah $\frac32$ kali secepat $x$. Untuk kurva hal yang sama berlaku saat demi saat: gradien komposit di $x$ adalah laju fungsi luar *di titik $g(x)$ yang telah dicapai fungsi dalam* dikali laju fungsi dalam di $x$.

**Aturan luar-dalam.** Dengan kata-kata: turunkan fungsi luar dan hitung pada fungsi dalam yang dibiarkan apa adanya, lalu kalikan dengan turunan fungsi dalam. Bentuk Leibniz menyembunyikan di mana tiap turunan dihitung; bentuk fungsional $f'(g(x))\cdot g'(x)$ menunjukkannya: $f'$ di $g(x)$, bukan di $x$.

**Contoh 1.** Tentukan turunan $y=\left(3x^2+1\right)^2$. Fungsi luarnya $y=u^2$ dan fungsi dalamnya $u=3x^2+1$, sehingga $\frac{dy}{du}=2u=2\left(3x^2+1\right)$ dan $\frac{du}{dx}=6x$:
$$\frac{dy}{dx}=2\left(3x^2+1\right)\cdot6x=36x^3+12x.$$
Menjabarkan lebih dulu memberi $y=9x^4+6x^2+1$ dan $36x^3+12x$ yang sama. Aturan rantai tidak diperlukan untuk yang satu ini, tetapi diperlukan untuk $\left(3x^2+1\right)^{50}$.

**Contoh 2.** Sebuah benda bergerak sepanjang garis lurus dengan posisi $x(t)=\cos\left(t^2+1\right)$ pada waktu $t\ge0$. Fungsi luarnya $\cos u$, berturunan $-\sin u$, dan fungsi dalamnya $u=t^2+1$, berturunan $2t$. Kecepatannya
$$v=-\sin\left(t^2+1\right)\cdot2t$$
$$=-2t\sin\left(t^2+1\right).$$

**Bukti satu kasus, dan celahnya.** Misalkan $\Delta u=g(x+\Delta x)-g(x)$ dan $\Delta y=f(u+\Delta u)-f(u)$. Jika $\Delta u\ne0$ kita dapat menulis
$$\frac{\Delta y}{\Delta x}=\frac{\Delta y}{\Delta u}\cdot\frac{\Delta u}{\Delta x}.$$
Saat $\Delta x\to0$ kita juga punya $\Delta u\to0$, karena $g$ kontinu, sehingga ruas kanan menuju $f'(u)\cdot g'(x)$. Celahnya adalah bahwa jika $g$ berosilasi cepat di dekat $x$, $\Delta u$ dapat bernilai $0$ walaupun $\Delta x\ne0$, dan pencoretan itu tidak diperbolehkan. Bukti lengkap menghindari pembagian dengan $\Delta u$: ia menulis $\Delta y=\left(f'(u)+\varepsilon\right)\Delta u$, dengan $\varepsilon\to0$ saat $\Delta u\to0$ dan $\varepsilon=0$ saat $\Delta u=0$. Bentuk itu benar dalam setiap kasus.

Pilih fungsi luar dan fungsi dalam di bawah, geser $x$, dan bandingkan hasil kali kedua laju dengan gradien grafik komposit.`,
          ),
        },
        { kind: 'widget', name: 'chainrates' },
      ],
    },

    /* ------------------------------------------------------------ outside-inside */
    {
      id: 'outside-inside',
      heading: L('How do you differentiate sin u, e^u and other functions of a function?', 'Bagaimana menurunkan sin u, e^u, dan fungsi lain dari suatu fungsi?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**For any differentiable function $u(x)$, each formula for $x$ gets one extra factor $\frac{du}{dx}$: $\frac{d}{dx}\sin u=\cos u\cdot\frac{du}{dx}$, $\frac{d}{dx}\cos u=-\sin u\cdot\frac{du}{dx}$, $\frac{d}{dx}e^u=e^u\cdot\frac{du}{dx}$, and so on.** The chain rule turns the table of [the derivatives of trigonometric functions](article:derivatives-of-trigonometric-functions#other-four) into one for any inside function:

- $\frac{d}{dx}\sin u=\cos u\cdot u'$ and $\frac{d}{dx}\cos u=-\sin u\cdot u'$;
- $\frac{d}{dx}\tan u=\sec^2u\cdot u'$ and $\frac{d}{dx}\cot u=-\csc^2u\cdot u'$;
- $\frac{d}{dx}\sec u=\sec u\tan u\cdot u'$ and $\frac{d}{dx}\csc u=-\csc u\cot u\cdot u'$;
- $\frac{d}{dx}e^u=e^u\cdot u'$.

**Example 3.** Differentiate $\sin\left(x^2+e^x\right)$. The outside is the sine, the inside is $x^2+e^x$, and the inside has derivative $2x+e^x$:
$$\frac{d}{dx}\sin\left(x^2+e^x\right)$$
$$=\cos\left(x^2+e^x\right)\cdot\left(2x+e^x\right).$$

**Example 4.** Differentiate $y=e^{\cos x}$. The outside is the exponential, and its derivative at the inside $\cos x$ is $e^{\cos x}$ again. The inside has derivative $-\sin x$:
$$\frac{dy}{dx}=e^{\cos x}\cdot(-\sin x)=-\sin x\,e^{\cos x}.$$

**A constant inside.** For a constant $k$ the inside $kx$ has derivative $k$, so
$$\frac{d}{dx}e^{kx}=k\,e^{kx}$$
$$\frac{d}{dx}\sin(kx)=k\cos(kx)$$
$$\frac{d}{dx}\tan(4x)=4\sec^2(4x).$$
Also $\frac{d}{dx}e^{x^2}=e^{x^2}\cdot2x$ and $\frac{d}{dx}\sec\left(x^2\right)=2x\sec\left(x^2\right)\tan\left(x^2\right)$. The chain rule works together with the other rules: for $x\sin2x$ the product rule gives $\sin2x+x\cdot\frac{d}{dx}\sin2x=\sin2x+2x\cos2x$.

Type any function below built from these pieces, and read off each rule it uses, with its outside and inside function.`,
            T`**Untuk setiap fungsi $u(x)$ yang terdiferensialkan, tiap rumus untuk $x$ mendapat satu faktor tambahan $\frac{du}{dx}$: $\frac{d}{dx}\sin u=\cos u\cdot\frac{du}{dx}$, $\frac{d}{dx}\cos u=-\sin u\cdot\frac{du}{dx}$, $\frac{d}{dx}e^u=e^u\cdot\frac{du}{dx}$, dan seterusnya.** Aturan rantai mengubah tabel [turunan fungsi trigonometri](article:derivatives-of-trigonometric-functions#other-four) menjadi tabel untuk fungsi dalam apa pun:

- $\frac{d}{dx}\sin u=\cos u\cdot u'$ dan $\frac{d}{dx}\cos u=-\sin u\cdot u'$;
- $\frac{d}{dx}\tan u=\sec^2u\cdot u'$ dan $\frac{d}{dx}\cot u=-\csc^2u\cdot u'$;
- $\frac{d}{dx}\sec u=\sec u\tan u\cdot u'$ dan $\frac{d}{dx}\csc u=-\csc u\cot u\cdot u'$;
- $\frac{d}{dx}e^u=e^u\cdot u'$.

**Contoh 3.** Turunkan $\sin\left(x^2+e^x\right)$. Fungsi luarnya sinus, fungsi dalamnya $x^2+e^x$, dan fungsi dalam itu berturunan $2x+e^x$:
$$\frac{d}{dx}\sin\left(x^2+e^x\right)$$
$$=\cos\left(x^2+e^x\right)\cdot\left(2x+e^x\right).$$

**Contoh 4.** Turunkan $y=e^{\cos x}$. Fungsi luarnya eksponensial, dan turunannya di fungsi dalam $\cos x$ adalah $e^{\cos x}$ lagi. Fungsi dalamnya berturunan $-\sin x$:
$$\frac{dy}{dx}=e^{\cos x}\cdot(-\sin x)=-\sin x\,e^{\cos x}.$$

**Konstanta di dalam.** Untuk konstanta $k$ fungsi dalam $kx$ berturunan $k$, sehingga
$$\frac{d}{dx}e^{kx}=k\,e^{kx}$$
$$\frac{d}{dx}\sin(kx)=k\cos(kx)$$
$$\frac{d}{dx}\tan(4x)=4\sec^2(4x).$$
Juga $\frac{d}{dx}e^{x^2}=e^{x^2}\cdot2x$ dan $\frac{d}{dx}\sec\left(x^2\right)=2x\sec\left(x^2\right)\tan\left(x^2\right)$. Aturan rantai bekerja bersama aturan lain: untuk $x\sin2x$ aturan hasil kali memberi $\sin2x+x\cdot\frac{d}{dx}\sin2x=\sin2x+2x\cos2x$.

Ketik fungsi apa saja di bawah yang dibangun dari bagian-bagian ini, dan baca tiap aturan yang dipakai, dengan fungsi luar dan fungsi dalamnya.`,
          ),
        },
        { kind: 'widget', name: 'chainsteps' },
      ],
    },

    /* ------------------------------------------------------------- repeated use */
    {
      id: 'repeated-chain',
      heading: L('What do you do when functions are nested three or more deep?', 'Apa yang dilakukan bila fungsi bersarang tiga lapis atau lebih?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Apply the chain rule once for each layer, from the outside in: differentiate the outermost function with everything inside left alone, multiply by the derivative of what was inside, and repeat on that until the inside is just $x$.** Write the layers down first, and the derivative is a product with one factor for each of them.

**Example 5.** Find the derivative of $g(t)=\tan\left(5-\sin2t\right)$. The tangent is a function of $5-\sin2t$; the sine is a function of $2t$, which is itself a function of $t$. Peel the layers:
$$g'(t)=\sec^2\left(5-\sin2t\right)$$
$$\cdot\frac{d}{dt}\left(5-\sin2t\right)$$
$$=\sec^2\left(5-\sin2t\right)\cdot\left(-\cos2t\cdot\frac{d}{dt}(2t)\right)$$
$$=-2\cos2t\,\sec^2\left(5-\sin2t\right).$$

**Example 6.** The function $\sin\left(\cos(\tan x)\right)$ has three layers, so three factors:
$$\frac{d}{dx}\sin\left(\cos(\tan x)\right)$$
$$=\cos\left(\cos(\tan x)\right)$$
$$\cdot\left(-\sin(\tan x)\right)\cdot\sec^2x.$$
Each factor is the derivative of one layer with the layers inside it left alone: the cosine of the cosine, the minus sine of the tangent, and the secant squared.

**Example 7.** For $y=\sqrt{1+\cos^2x}$ the layers are a square root, "$1$ plus", a square, and a cosine:
$$y'=\frac{1}{2\sqrt{1+\cos^2x}}\cdot2\cos x\cdot(-\sin x)$$
$$=-\frac{\sin x\cos x}{\sqrt{1+\cos^2x}}.$$

Try the function of Example 5, and any of your own, in the tool of the previous section: it lists one chain rule step for each layer.`,
            T`**Terapkan aturan rantai sekali untuk tiap lapisan, dari luar ke dalam: turunkan fungsi paling luar dengan semua yang ada di dalamnya dibiarkan, kalikan dengan turunan apa yang ada di dalamnya, dan ulangi pada itu sampai bagian dalamnya hanya $x$.** Tulis dulu lapisannya, dan turunannya adalah hasil kali dengan satu faktor untuk tiap lapisan.

**Contoh 5.** Tentukan turunan $g(t)=\tan\left(5-\sin2t\right)$. Tangen adalah fungsi dari $5-\sin2t$; sinus adalah fungsi dari $2t$, yang sendiri adalah fungsi dari $t$. Kupas lapisannya:
$$g'(t)=\sec^2\left(5-\sin2t\right)$$
$$\cdot\frac{d}{dt}\left(5-\sin2t\right)$$
$$=\sec^2\left(5-\sin2t\right)\cdot\left(-\cos2t\cdot\frac{d}{dt}(2t)\right)$$
$$=-2\cos2t\,\sec^2\left(5-\sin2t\right).$$

**Contoh 6.** Fungsi $\sin\left(\cos(\tan x)\right)$ memiliki tiga lapisan, sehingga tiga faktor:
$$\frac{d}{dx}\sin\left(\cos(\tan x)\right)$$
$$=\cos\left(\cos(\tan x)\right)$$
$$\cdot\left(-\sin(\tan x)\right)\cdot\sec^2x.$$
Tiap faktor adalah turunan satu lapisan dengan lapisan di dalamnya dibiarkan: kosinus dari kosinus, minus sinus dari tangen, dan sekan kuadrat.

**Contoh 7.** Untuk $y=\sqrt{1+\cos^2x}$ lapisannya adalah akar kuadrat, "$1$ ditambah", kuadrat, dan kosinus:
$$y'=\frac{1}{2\sqrt{1+\cos^2x}}\cdot2\cos x\cdot(-\sin x)$$
$$=-\frac{\sin x\cos x}{\sqrt{1+\cos^2x}}.$$

Coba fungsi pada Contoh 5, dan fungsi apa saja milikmu, pada alat di bagian sebelumnya: ia mendaftar satu langkah aturan rantai untuk tiap lapisan.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------ power chain rule */
    {
      id: 'power-chain-rule',
      heading: L('What is the power chain rule, and when does it replace the quotient rule?', 'Apa itu aturan rantai pangkat, dan kapan ia menggantikan aturan hasil bagi?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**If $u$ is a differentiable function of $x$ and $n$ is any real number, then $\frac{d}{dx}u^n=n\,u^{n-1}\,\frac{du}{dx}$.** This is the chain rule with the outside function $f(u)=u^n$, whose derivative is the [power rule](article:differentiation-rules#constants-and-powers) $nu^{n-1}$. The inside function $u$ may be any function: a sum, a sine, a quotient.

**Example 8.** Four derivatives with the power chain rule.

- $\frac{d}{dx}\left(5x^3-x^4\right)^7=7\left(5x^3-x^4\right)^6\cdot\left(15x^2-4x^3\right)$.
- $\frac{d}{dx}\frac{1}{3x-2}=\frac{d}{dx}(3x-2)^{-1}=-(3x-2)^{-2}\cdot3=-\frac{3}{(3x-2)^2}$. The [quotient rule](article:differentiation-rules#quotient-rule) gives the same answer, with more writing.
- $\frac{d}{dx}\sin^5x=5\sin^4x\cdot\cos x$, because $\sin^5x$ means $(\sin x)^5$.
- $\frac{d}{dx}e^{\sqrt{3x+1}}=e^{\sqrt{3x+1}}\cdot\frac{d}{dx}(3x+1)^{1/2}=e^{\sqrt{3x+1}}\cdot\frac{3}{2\sqrt{3x+1}}$. Two layers sit inside the exponential, so there are two chain steps.

**Example 9: the absolute value.** Since $|x|=\sqrt{x^2}$, the power chain rule with $u=x^2$ and $n=\frac12$ gives, for $x\ne0$,
$$\frac{d}{dx}|x|=\frac12\left(x^2\right)^{-1/2}\cdot2x$$
$$=\frac{x}{\sqrt{x^2}}=\frac{x}{|x|}.$$
That is $1$ for $x>0$ and $-1$ for $x<0$. At $x=0$ the formula is undefined, which agrees with the corner of the graph, a point [where there is no derivative](article:tangent-lines-and-derivative-at-a-point#no-derivative).

**Example 10: always uphill.** Show that every tangent line to $y=\frac{1}{(1-2x)^3}$ has a positive slope. Write $y=(1-2x)^{-3}$. Then
$$\frac{dy}{dx}=-3(1-2x)^{-4}\cdot(-2)=\frac{6}{(1-2x)^4}.$$
At any point of the curve $x\ne\frac12$, so the denominator is a fourth power and positive: the slope is a quotient of two positive numbers.

**Another useful one.** $\frac{d}{dx}\sqrt{x^2+1}=\frac{1}{2\sqrt{x^2+1}}\cdot2x=\frac{x}{\sqrt{x^2+1}}$, which is the slope of the curve whose points are $\sqrt{x^2+1}$ above the axis, a hyperbola.`,
            T`**Jika $u$ adalah fungsi $x$ yang terdiferensialkan dan $n$ bilangan real mana pun, maka $\frac{d}{dx}u^n=n\,u^{n-1}\,\frac{du}{dx}$.** Ini adalah aturan rantai dengan fungsi luar $f(u)=u^n$, yang turunannya adalah [aturan pangkat](article:differentiation-rules#constants-and-powers) $nu^{n-1}$. Fungsi dalam $u$ boleh fungsi apa pun: jumlah, sinus, hasil bagi.

**Contoh 8.** Empat turunan dengan aturan rantai pangkat.

- $\frac{d}{dx}\left(5x^3-x^4\right)^7=7\left(5x^3-x^4\right)^6\cdot\left(15x^2-4x^3\right)$.
- $\frac{d}{dx}\frac{1}{3x-2}=\frac{d}{dx}(3x-2)^{-1}=-(3x-2)^{-2}\cdot3=-\frac{3}{(3x-2)^2}$. [Aturan hasil bagi](article:differentiation-rules#quotient-rule) memberi jawaban yang sama, dengan lebih banyak tulisan.
- $\frac{d}{dx}\sin^5x=5\sin^4x\cdot\cos x$, karena $\sin^5x$ berarti $(\sin x)^5$.
- $\frac{d}{dx}e^{\sqrt{3x+1}}=e^{\sqrt{3x+1}}\cdot\frac{d}{dx}(3x+1)^{1/2}=e^{\sqrt{3x+1}}\cdot\frac{3}{2\sqrt{3x+1}}$. Dua lapisan berada di dalam eksponensial, sehingga ada dua langkah rantai.

**Contoh 9: nilai mutlak.** Karena $|x|=\sqrt{x^2}$, aturan rantai pangkat dengan $u=x^2$ dan $n=\frac12$ memberi, untuk $x\ne0$,
$$\frac{d}{dx}|x|=\frac12\left(x^2\right)^{-1/2}\cdot2x$$
$$=\frac{x}{\sqrt{x^2}}=\frac{x}{|x|}.$$
Itu $1$ untuk $x>0$ dan $-1$ untuk $x<0$. Di $x=0$ rumusnya tak terdefinisi, yang sesuai dengan sudut pada grafiknya, titik [tempat tidak ada turunan](article:tangent-lines-and-derivative-at-a-point#no-derivative).

**Contoh 10: selalu menanjak.** Tunjukkan bahwa setiap garis singgung pada $y=\frac{1}{(1-2x)^3}$ bergradien positif. Tulis $y=(1-2x)^{-3}$. Maka
$$\frac{dy}{dx}=-3(1-2x)^{-4}\cdot(-2)=\frac{6}{(1-2x)^4}.$$
Di setiap titik pada kurva $x\ne\frac12$, sehingga penyebutnya pangkat empat dan positif: gradiennya adalah hasil bagi dua bilangan positif.

**Satu lagi yang berguna.** $\frac{d}{dx}\sqrt{x^2+1}=\frac{1}{2\sqrt{x^2+1}}\cdot2x=\frac{x}{\sqrt{x^2+1}}$, yaitu gradien kurva yang titik-titiknya setinggi $\sqrt{x^2+1}$ di atas sumbu, sebuah hiperbola.`,
          ),
        },
      ],
    },

    /* -------------------------------------------------------- frequency and degrees */
    {
      id: 'frequency-and-degrees',
      heading: L('How does the chain rule explain frequency, amplitude and degrees?', 'Bagaimana aturan rantai menjelaskan frekuensi, amplitudo, dan derajat?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A constant $k$ inside a sine multiplies the derivative by $k$: $\frac{d}{dx}\sin(kx)=k\cos(kx)$, so a wave that oscillates $k$ times as fast is $k$ times as steep.** The inside function $kx$ has derivative $k$, and nothing else changes. The curves $y=\sin x$, $y=\sin2x$ and $y=\sin\frac{x}{2}$ cross the axis at the origin with slopes $1$, $2$ and $\frac12$.`,
            T`**Konstanta $k$ di dalam sinus mengalikan turunannya dengan $k$: $\frac{d}{dx}\sin(kx)=k\cos(kx)$, sehingga gelombang yang berosilasi $k$ kali secepat itu $k$ kali lebih curam.** Fungsi dalam $kx$ berturunan $k$, dan tidak ada lagi yang berubah. Kurva $y=\sin x$, $y=\sin2x$, dan $y=\sin\frac{x}{2}$ memotong sumbu di titik asal dengan gradien $1$, $2$, dan $\frac12$.`,
          ),
        },
        {
          kind: 'figure',
          figure: {
            dim: 2,
            ticks: true,
            xSpan: [-0.4, 6.9],
            ySpan: [-1.5, 1.5],
            aspect: 0.5,
            items: [
              { t: 'curve', f: 'sin(x)', color: 'a', from: 0, to: 6.4 },
              { t: 'curve', f: 'sin(2*x)', color: 'b', from: 0, to: 6.4 },
              { t: 'curve', f: 'sin(x/2)', color: 'c', from: 0, to: 6.4 },
            ],
            caption: L(
              'sin x (green), sin 2x (orange) and sin(x/2) (blue): at the origin the slopes are 1, 2 and 1/2, the constant inside.',
              'sin x (hijau), sin 2x (jingga), dan sin(x/2) (biru): di titik asal gradiennya 1, 2, dan 1/2, yaitu konstanta di dalamnya.',
            ),
          },
        },
        {
          kind: 'text',
          text: L(
            T`**Higher derivatives.** Each derivative of $\sin(kx)$ brings out one more factor $k$, so the derivatives follow the [cycle of four](article:derivatives-of-trigonometric-functions#higher-trig-derivatives) with $k^n$ in front: $k\cos(kx)$, then $-k^2\sin(kx)$, then $-k^3\cos(kx)$, then $k^4\sin(kx)$.

**A piston.** Let a piston's position be $s=A\cos(2\pi bt)$, with amplitude $A$ and frequency $b$ cycles per second. Put $w=2\pi b$. Then
$$v=-wA\sin(wt)$$
$$a=-w^2A\cos(wt)$$
$$j=w^3A\sin(wt),$$
so the greatest velocity, acceleration and jerk are $wA$, $w^2A$ and $w^3A$. **Doubling the frequency doubles the velocity, quadruples the acceleration and multiplies the jerk by $8$.** This is why machinery can break when it is run too fast: the forces, which follow the acceleration, grow with the square of the speed of the motion. The [motion along a line](article:the-derivative-as-a-rate-of-change#motion-along-a-line) of the spring is the case $b=\frac{1}{2\pi}$.

**Temperature in Fairbanks, Alaska.** The average temperature on day $x$ of the year, in degrees Celsius, is approximately
$$y=20\sin\left(\frac{2\pi}{365}(x-101)\right)-4.$$
By the chain rule its rate of change is
$$y'=\frac{40\pi}{365}\cos\left(\frac{2\pi}{365}(x-101)\right).$$
The temperature is rising fastest when the cosine equals $1$, at $x=101$, which is April 11, and then it rises $\frac{40\pi}{365}\approx0.34$ degrees per day. The factor $\frac{40\pi}{365}$ is the amplitude $20$ times the constant inside, $\frac{2\pi}{365}$.

**Degrees.** Since $x^\circ=\frac{\pi x}{180}$ radians, the inside function of $\sin\left(x^\circ\right)$ is $\frac{\pi x}{180}$, and
$$\frac{d}{dx}\sin\left(x^\circ\right)=\frac{\pi}{180}\cos\left(x^\circ\right).$$
The sine of $x$ degrees oscillates only $\frac{\pi}{180}\approx0.01745$ times as often as $\sin x$, and its greatest slope is $\frac{\pi}{180}$. The factor would appear again in every derivative, which is the advantage of radian measure that the [limit of sin h over h](article:derivatives-of-trigonometric-functions#sine-limits) already showed.

Change $k$, switch to degrees, or double the frequency of the piston below.`,
            T`**Turunan tingkat tinggi.** Setiap turunan $\sin(kx)$ memunculkan satu faktor $k$ lagi, sehingga turunannya mengikuti [siklus empat](article:derivatives-of-trigonometric-functions#higher-trig-derivatives) dengan $k^n$ di depannya: $k\cos(kx)$, lalu $-k^2\sin(kx)$, lalu $-k^3\cos(kx)$, lalu $k^4\sin(kx)$.

**Sebuah piston.** Misalkan posisi sebuah piston $s=A\cos(2\pi bt)$, dengan amplitudo $A$ dan frekuensi $b$ siklus per detik. Ambil $w=2\pi b$. Maka
$$v=-wA\sin(wt)$$
$$a=-w^2A\cos(wt)$$
$$j=w^3A\sin(wt),$$
sehingga kecepatan, percepatan, dan sentakan terbesarnya $wA$, $w^2A$, dan $w^3A$. **Menggandakan frekuensi menggandakan kecepatan, melipatempatkan percepatan, dan mengalikan sentakan dengan $8$.** Inilah sebabnya mesin dapat rusak bila dijalankan terlalu cepat: gaya, yang mengikuti percepatan, tumbuh sebesar kuadrat kecepatan geraknya. [Gerak sepanjang garis lurus](article:the-derivative-as-a-rate-of-change#motion-along-a-line) pada pegas adalah kasus $b=\frac{1}{2\pi}$.

**Suhu di Fairbanks, Alaska.** Suhu rata-rata pada hari ke-$x$ dalam setahun, dalam derajat Celsius, kira-kira
$$y=20\sin\left(\frac{2\pi}{365}(x-101)\right)-4.$$
Dengan aturan rantai laju perubahannya
$$y'=\frac{40\pi}{365}\cos\left(\frac{2\pi}{365}(x-101)\right).$$
Suhu naik paling cepat saat kosinus sama dengan $1$, di $x=101$, yaitu 11 April, dan saat itu ia naik $\frac{40\pi}{365}\approx0{,}34$ derajat per hari. Faktor $\frac{40\pi}{365}$ adalah amplitudo $20$ kali konstanta di dalam, $\frac{2\pi}{365}$.

**Derajat.** Karena $x^\circ=\frac{\pi x}{180}$ radian, fungsi dalam $\sin\left(x^\circ\right)$ adalah $\frac{\pi x}{180}$, dan
$$\frac{d}{dx}\sin\left(x^\circ\right)=\frac{\pi}{180}\cos\left(x^\circ\right).$$
Sinus $x$ derajat berosilasi hanya $\frac{\pi}{180}\approx0{,}01745$ kali sesering $\sin x$, dan gradien terbesarnya $\frac{\pi}{180}$. Faktor itu akan muncul lagi pada setiap turunan, yaitu keuntungan ukuran radian yang sudah ditunjukkan oleh [limit sin h per h](article:derivatives-of-trigonometric-functions#sine-limits).

Ubah $k$, ganti ke derajat, atau gandakan frekuensi piston di bawah.`,
          ),
        },
        { kind: 'widget', name: 'sinscale' },
      ],
    },

    /* ------------------------------------------------------------ second derivative */
    {
      id: 'second-derivative-chain',
      heading: L('How do you find the second derivative of a composite function?', 'Bagaimana mencari turunan kedua fungsi komposit?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Differentiate $f'(g(x))\cdot g'(x)$ with the product rule, and the chain rule on its first factor, and you get $(f\circ g)''=f''(g(x))\cdot\left(g'(x)\right)^2+f'(g(x))\cdot g''(x)$.** Here is the step. The first derivative is $y'=f'(g)\,g'$. The product rule gives
$$y''=\left(\frac{d}{dx}f'(g)\right)g'+f'(g)\,g''.$$
By the chain rule $\frac{d}{dx}f'(g)=f''(g)\,g'$, so the first term is $f''(g)\,g'\cdot g'=f''(g)\left(g'\right)^2$. There are two terms because the inside function enters twice: once through its rate $g'$ and once through its own rate of change $g''$.

**Example 11.** Find $y''$ for $y=\sin\left(x^2\right)$. With $f=\sin$ and $g=x^2$: $f'(g)=\cos\left(x^2\right)$, $g'=2x$, $f''(g)=-\sin\left(x^2\right)$, $g''=2$. So
$$y'=2x\cos\left(x^2\right),$$
$$y''=-\sin\left(x^2\right)\cdot4x^2+\cos\left(x^2\right)\cdot2$$
$$=2\cos\left(x^2\right)-4x^2\sin\left(x^2\right).$$

**Example 12.** For $y=\left(x^2+1\right)^3$ take $f=u^3$ and $g=x^2+1$: $f'=3u^2$, $f''=6u$, $g'=2x$, $g''=2$. Then
$$y''=6\left(x^2+1\right)\cdot4x^2$$
$$+3\left(x^2+1\right)^2\cdot2$$
$$=30x^4+36x^2+6.$$
Expanding first gives $y=x^6+3x^4+3x^2+1$ and $y''=30x^4+36x^2+6$, the same.

**The common slip** is to write $f''(g)\cdot g''$ for the second derivative. The term $f'(g)\,g''$ is lost, and the factor $\left(g'\right)^2$ too. If the inside is a straight line $g=ax+b$, then $g''=0$ and only $f''(g)\cdot a^2$ is left: that is why $\frac{d^2}{dx^2}\sin(kx)=-k^2\sin(kx)$.

The tool of the section on nested functions also shows second and third derivatives of what you type.`,
            T`**Turunkan $f'(g(x))\cdot g'(x)$ dengan aturan hasil kali, dan aturan rantai pada faktor pertamanya, dan kamu mendapat $(f\circ g)''=f''(g(x))\cdot\left(g'(x)\right)^2+f'(g(x))\cdot g''(x)$.** Inilah langkahnya. Turunan pertamanya $y'=f'(g)\,g'$. Aturan hasil kali memberi
$$y''=\left(\frac{d}{dx}f'(g)\right)g'+f'(g)\,g''.$$
Dengan aturan rantai $\frac{d}{dx}f'(g)=f''(g)\,g'$, sehingga suku pertamanya $f''(g)\,g'\cdot g'=f''(g)\left(g'\right)^2$. Ada dua suku karena fungsi dalam masuk dua kali: sekali lewat lajunya $g'$ dan sekali lewat laju perubahannya sendiri $g''$.

**Contoh 11.** Tentukan $y''$ untuk $y=\sin\left(x^2\right)$. Dengan $f=\sin$ dan $g=x^2$: $f'(g)=\cos\left(x^2\right)$, $g'=2x$, $f''(g)=-\sin\left(x^2\right)$, $g''=2$. Jadi
$$y'=2x\cos\left(x^2\right),$$
$$y''=-\sin\left(x^2\right)\cdot4x^2+\cos\left(x^2\right)\cdot2$$
$$=2\cos\left(x^2\right)-4x^2\sin\left(x^2\right).$$

**Contoh 12.** Untuk $y=\left(x^2+1\right)^3$ ambil $f=u^3$ dan $g=x^2+1$: $f'=3u^2$, $f''=6u$, $g'=2x$, $g''=2$. Maka
$$y''=6\left(x^2+1\right)\cdot4x^2$$
$$+3\left(x^2+1\right)^2\cdot2$$
$$=30x^4+36x^2+6.$$
Menjabarkan lebih dulu memberi $y=x^6+3x^4+3x^2+1$ dan $y''=30x^4+36x^2+6$, sama saja.

**Kekeliruan yang umum** adalah menulis $f''(g)\cdot g''$ untuk turunan kedua. Suku $f'(g)\,g''$ hilang, dan faktor $\left(g'\right)^2$ juga. Bila fungsi dalamnya garis lurus $g=ax+b$, maka $g''=0$ dan hanya $f''(g)\cdot a^2$ yang tersisa: itulah sebabnya $\frac{d^2}{dx^2}\sin(kx)=-k^2\sin(kx)$.

Alat pada bagian fungsi bersarang juga menampilkan turunan kedua dan ketiga dari apa yang kamu ketik.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------- when it applies */
    {
      id: 'when-it-applies',
      heading: L('When does the chain rule apply, and what happens when it does not?', 'Kapan aturan rantai berlaku, dan apa yang terjadi bila tidak?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The chain rule is an *if* statement: if the inside function is differentiable at $x$ and the outside function is differentiable at $g(x)$, then the composite is differentiable and the formula holds.** It does not say what happens when a hypothesis fails, and in that case the composite may or may not be differentiable.

**Example 13: the inside is not differentiable, the composite is.** Let $f(x)=x^2$ and $g(x)=|x|$. Both $f\circ g$ and $g\circ f$ equal $x^2$, because $|x|^2=x^2$ and $\left|x^2\right|=x^2$, and both are differentiable at $x=0$ although $g=|x|$ is not. This does not contradict the chain rule: the rule needs $g$ to be differentiable at $0$, it does not say the composite is *not* differentiable otherwise.

**A derivative that is not continuous.** Consider $f(x)=x^2\sin\frac1x$ for $x\ne0$, with $f(0)=0$. For $x\ne0$ the chain rule on $\sin\frac1x$ and the product rule give
$$f'(x)=2x\sin\frac1x-\cos\frac1x.$$
At $x=0$ the inside function $\frac1x$ does not exist, so the chain rule cannot be used; we go back to the definition. The quotient is $\frac{h^2\sin(1/h)}{h}=h\sin\frac1h$, and since $\left|h\sin\frac1h\right|\le|h|$ it tends to $0$: $f'(0)=0$. Yet $f'(x)$ has no limit as $x\to0$, because $\cos\frac1x$ oscillates between $-1$ and $1$. So $f$ is differentiable everywhere, and its derivative is not continuous at $0$.

**A function that is continuous but has no derivative.** For $x\sin\frac1x$ (and $0$ at $0$) the quotient at $0$ is $\sin\frac1h$, which oscillates and has no limit: the function is continuous at $0$ and not differentiable there. This is the kind of rapid oscillation that caused the gap in the proof of the chain rule.`,
            T`**Aturan rantai adalah pernyataan *jika*: jika fungsi dalam terdiferensialkan di $x$ dan fungsi luar terdiferensialkan di $g(x)$, maka komposit terdiferensialkan dan rumusnya berlaku.** Ia tidak menyatakan apa yang terjadi bila suatu syarat gagal, dan dalam hal itu komposit mungkin atau mungkin tidak terdiferensialkan.

**Contoh 13: fungsi dalam tidak terdiferensialkan, komposit terdiferensialkan.** Misalkan $f(x)=x^2$ dan $g(x)=|x|$. Baik $f\circ g$ maupun $g\circ f$ sama dengan $x^2$, karena $|x|^2=x^2$ dan $\left|x^2\right|=x^2$, dan keduanya terdiferensialkan di $x=0$ walaupun $g=|x|$ tidak. Ini tidak bertentangan dengan aturan rantai: aturan itu memerlukan $g$ terdiferensialkan di $0$, dan tidak menyatakan komposit *tidak* terdiferensialkan bila tidak demikian.

**Turunan yang tidak kontinu.** Tinjau $f(x)=x^2\sin\frac1x$ untuk $x\ne0$, dengan $f(0)=0$. Untuk $x\ne0$ aturan rantai pada $\sin\frac1x$ dan aturan hasil kali memberi
$$f'(x)=2x\sin\frac1x-\cos\frac1x.$$
Di $x=0$ fungsi dalam $\frac1x$ tidak ada, sehingga aturan rantai tidak dapat dipakai; kita kembali ke definisi. Hasil baginya $\frac{h^2\sin(1/h)}{h}=h\sin\frac1h$, dan karena $\left|h\sin\frac1h\right|\le|h|$ ia menuju $0$: $f'(0)=0$. Namun $f'(x)$ tidak memiliki limit saat $x\to0$, karena $\cos\frac1x$ berosilasi di antara $-1$ dan $1$. Jadi $f$ terdiferensialkan di mana-mana, dan turunannya tidak kontinu di $0$.

**Fungsi yang kontinu tetapi tidak memiliki turunan.** Untuk $x\sin\frac1x$ (dan $0$ di $0$) hasil bagi di $0$ adalah $\sin\frac1h$, yang berosilasi dan tidak memiliki limit: fungsi itu kontinu di $0$ dan tidak terdiferensialkan di sana. Inilah jenis osilasi cepat yang menyebabkan celah pada bukti aturan rantai.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------- in code */
    {
      id: 'chain-in-code',
      heading: L('How do you apply the chain rule in code?', 'Bagaimana menerapkan aturan rantai dalam kode?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**SymPy applies the chain rule to any composite function: ´sp.diff(sp.sin(2*x), x)´ gives ´2*cos(2*x)´, and ´sp.diff(f, x, 2)´ gives the second derivative.** It writes $\sec^2u$ as ´tan(u)**2 + 1´, the same function. The numbers of the examples above come out as they should: ´(3*x**2 + 1)**2´ has the derivative ´12*x*(3*x**2 + 1)´, and ´sp.simplify´ turns the derivative of ´(5*x**3 - x**4)**7´ into ´x**20*(105 - 28*x)*(x - 5)**6´, which is $7\left(5x^3-x^4\right)^6\left(15x^2-4x^3\right)$ with the common factors collected.`,
            T`**SymPy menerapkan aturan rantai pada fungsi komposit apa pun: ´sp.diff(sp.sin(2*x), x)´ memberi ´2*cos(2*x)´, dan ´sp.diff(f, x, 2)´ memberi turunan kedua.** Ia menulis $\sec^2u$ sebagai ´tan(u)**2 + 1´, fungsi yang sama. Angka-angka pada contoh di atas keluar sebagaimana mestinya: ´(3*x**2 + 1)**2´ berturunan ´12*x*(3*x**2 + 1)´, dan ´sp.simplify´ mengubah turunan ´(5*x**3 - x**4)**7´ menjadi ´x**20*(105 - 28*x)*(x - 5)**6´, yaitu $7\left(5x^3-x^4\right)^6\left(15x^2-4x^3\right)$ dengan faktor persekutuan dikumpulkan.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python and SymPy: the chain rule on composites', 'Python dan SymPy: aturan rantai pada fungsi komposit'),
          code: `import sympy as sp

x = sp.symbols('x')
for f in (sp.sin(2 * x), (3 * x**2 + 1) ** 2, sp.exp(sp.cos(x)),
          sp.sin(x**2 + sp.exp(x)), sp.sqrt(3 * x + 1), sp.tan(5 - sp.sin(2 * x))):
    print(f, '->', sp.diff(f, x))
# sin(2*x) -> 2*cos(2*x)
# (3*x**2 + 1)**2 -> 12*x*(3*x**2 + 1)
# exp(cos(x)) -> -exp(cos(x))*sin(x)
# sin(x**2 + exp(x)) -> (2*x + exp(x))*cos(x**2 + exp(x))
# sqrt(3*x + 1) -> 3/(2*sqrt(3*x + 1))
# -tan(sin(2*x) - 5) -> -2*(tan(sin(2*x) - 5)**2 + 1)*cos(2*x)

print(sp.diff(sp.sin(x**2), x, 2))                    # 2*(-2*x**2*sin(x**2) + cos(x**2))
print(sp.simplify(sp.diff((5 * x**3 - x**4) ** 7, x)))   # x**20*(105 - 28*x)*(x - 5)**6`,
        },
        {
          kind: 'text',
          text: L(
            T`**A program can apply the chain rule to *numbers* instead of formulas.** Carry with every value its derivative, a pair $(v,d)$, and give each operation its chain rule: for the sine, $(v,d)\mapsto\left(\sin v,\ \cos v\cdot d\right)$, which is $f'(u)\cdot u'$ again. Start with $x=(0.7,1)$, because $x$ has derivative $1$, and the program computes $\sin\left(x^2+e^x\right)$ and its derivative at the same time. This is *forward-mode automatic differentiation*. It gives $-2.742554$, the same as the formula $\cos\left(x^2+e^x\right)\left(2x+e^x\right)$ at $x=0.7$ and the same as a central difference.

Applying the rule from the outside in, to a program of millions of steps, is *reverse-mode* automatic differentiation, which is what *backpropagation* in a neural network does: one pass computes the output, and one pass back multiplies the rates of the layers.`,
            T`**Sebuah program dapat menerapkan aturan rantai pada *bilangan* dan bukan rumus.** Bawa bersama setiap nilai turunannya, sepasang $(v,d)$, dan beri tiap operasi aturan rantainya: untuk sinus, $(v,d)\mapsto\left(\sin v,\ \cos v\cdot d\right)$, yaitu $f'(u)\cdot u'$ lagi. Mulai dengan $x=(0{,}7;1)$, karena $x$ berturunan $1$, dan program menghitung $\sin\left(x^2+e^x\right)$ dan turunannya sekaligus. Inilah *diferensiasi otomatis mode maju*. Hasilnya $-2{,}742554$, sama dengan rumus $\cos\left(x^2+e^x\right)\left(2x+e^x\right)$ di $x=0{,}7$ dan sama dengan selisih terpusat.

Menerapkan aturan itu dari luar ke dalam, pada program dengan jutaan langkah, adalah diferensiasi otomatis *mode mundur*, yang dilakukan *propagasi balik* dalam jaringan saraf: satu lintasan menghitung keluaran, dan satu lintasan balik mengalikan laju tiap lapisan.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: forward-mode differentiation with a pair (value, derivative)', 'Python: penurunan mode maju dengan pasangan (nilai, turunan)'),
          code: `import math

f = lambda x: math.sin(x**2 + math.exp(x))
x0 = 0.7
chain = math.cos(x0**2 + math.exp(x0)) * (2 * x0 + math.exp(x0))     # the formula
central = (f(x0 + 1e-6) - f(x0 - 1e-6)) / 2e-6                       # a difference quotient
print(round(chain, 6), round(central, 6))                            # -2.742554 -2.742554


class Dual:
    """A number and its derivative, carried together."""
    def __init__(self, v, d=0.0):
        self.v, self.d = v, d
    def __add__(self, o):
        o = o if isinstance(o, Dual) else Dual(o)
        return Dual(self.v + o.v, self.d + o.d)
    __radd__ = __add__
    def __mul__(self, o):
        o = o if isinstance(o, Dual) else Dual(o)
        return Dual(self.v * o.v, self.d * o.v + self.v * o.d)     # the product rule
    __rmul__ = __mul__

def sin(u): return Dual(math.sin(u.v), math.cos(u.v) * u.d)        # the chain rule: f'(u) * u'
def exp(u): return Dual(math.exp(u.v), math.exp(u.v) * u.d)

x = Dual(0.7, 1.0)                                                  # x has derivative 1
y = sin(x * x + exp(x))
print(round(y.v, 6), round(y.d, 6))                                 # 0.595461 -2.742554`,
        },
      ],
    },

    /* ----------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Who discovered the chain rule, and how was it first proved?', 'Siapa yang menemukan aturan rantai, dan bagaimana ia pertama dibuktikan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The chain rule is as old as the calculus, but a proof that has no gap took about two centuries more.**

- **Leibniz.** The chain rule seems to have been used first by Gottfried Leibniz, in a manuscript of 1676, to differentiate the square root of $a+bz+cz^2$ as a square root of a quadratic. His notation $\frac{dy}{dx}=\frac{dy}{du}\cdot\frac{du}{dx}$ makes the rule look like fractions that cancel, which is why it is easy to remember, and why it is not a proof.
- **Bernoulli and l'Hôpital.** Johann Bernoulli taught the new calculus to the Marquis de l'Hôpital, whose 1696 textbook *Analyse des infiniment petits* spread it across Europe.
- **Lagrange.** The prime notation $f'(x)$, which writes the chain rule as $f'(g(x))\cdot g'(x)$ and shows where each derivative is taken, was introduced by Joseph-Louis Lagrange.
- **A proof without the gap.** In the 20th century Constantin Carathéodory's way of defining the derivative, $f(x)-f(a)=\varphi(x)(x-a)$ with $\varphi$ continuous at $a$, gave a short proof of the chain rule that never divides by $\Delta u$.
- **Backpropagation.** Applying the rule from the output back to the input of a computation, in reverse mode, was described by Seppo Linnainmaa in 1970, and David Rumelhart, Geoffrey Hinton and Ronald Williams made it the standard way of training neural networks in 1986.`,
            T`**Aturan rantai setua kalkulus, tetapi bukti tanpa celah memerlukan sekitar dua abad lagi.**

- **Leibniz.** Aturan rantai tampaknya pertama kali dipakai oleh Gottfried Leibniz, dalam naskah tahun 1676, untuk menurunkan akar kuadrat dari $a+bz+cz^2$ sebagai akar kuadrat dari kuadrat. Notasinya $\frac{dy}{dx}=\frac{dy}{du}\cdot\frac{du}{dx}$ membuat aturan itu tampak seperti pecahan yang saling mencoret, itulah sebabnya ia mudah diingat, dan itulah sebabnya ia bukan bukti.
- **Bernoulli dan l'Hôpital.** Johann Bernoulli mengajarkan kalkulus baru kepada Marquis de l'Hôpital, yang buku teksnya pada 1696, *Analyse des infiniment petits*, menyebarkannya ke seluruh Eropa.
- **Lagrange.** Notasi aksen $f'(x)$, yang menulis aturan rantai sebagai $f'(g(x))\cdot g'(x)$ dan menunjukkan di mana tiap turunan diambil, diperkenalkan oleh Joseph-Louis Lagrange.
- **Bukti tanpa celah.** Pada abad ke-20 cara Constantin Carathéodory mendefinisikan turunan, $f(x)-f(a)=\varphi(x)(x-a)$ dengan $\varphi$ kontinu di $a$, memberi bukti singkat aturan rantai yang tidak pernah membagi dengan $\Delta u$.
- **Propagasi balik.** Menerapkan aturan itu dari keluaran kembali ke masukan suatu perhitungan, dalam mode mundur, diuraikan oleh Seppo Linnainmaa pada 1970, dan David Rumelhart, Geoffrey Hinton, dan Ronald Williams menjadikannya cara baku melatih jaringan saraf pada 1986.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What mistakes do people make with the chain rule?', 'Kesalahan apa yang sering terjadi pada aturan rantai?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with the chain rule are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ $\frac{d}{dx}\sin2x=\cos2x$ | The derivative of the inside is a factor: $\frac{d}{dx}\sin2x=2\cos2x$. |
| ❌ $\frac{d}{dx}\left(x^2+1\right)^5=5\left(x^2+1\right)^4$ | The power rule gives only the outside: multiply by $2x$ to get $10x\left(x^2+1\right)^4$. |
| ❌ $\frac{d}{dx}e^{2x}=2x\,e^{2x-1}$ | The exponent contains $x$, so the power rule does not apply. The derivative of $e^u$ is $e^u\cdot u'$, which is $2e^{2x}$. |
| ❌ $\frac{d}{dx}\cos\left(x^2\right)=-\sin x\cdot2x$ | The outside derivative is evaluated at the inside, not at $x$: $-\sin\left(x^2\right)\cdot2x$. |
| ❌ $\frac{d}{dx}\sin^2x=2\sin x$ | There are two layers, a square and a sine: $2\sin x\cdot\cos x$. |
| ❌ The second derivative of $f(g(x))$ is $f''(g(x))\cdot g''(x)$ | It is $f''(g)\left(g'\right)^2+f'(g)\,g''$: the second term and the square were lost. |
| ❌ $(f\circ g)'=f'\circ g'$, the composition of the derivatives | It is a *product*: $f'(g(x))\cdot g'(x)$, with $f'$ taken at $g(x)$. |
| ❌ If $g$ is not differentiable at $a$, then $f(g(x))$ is not either | Not necessarily: with $g=|x|$ and $f=x^2$ the composite is $x^2$, differentiable at $0$. |
| ❌ $\frac{d}{dx}\sin\left(x^\circ\right)=\cos\left(x^\circ\right)$ | The inside $\frac{\pi x}{180}$ adds a factor: $\frac{\pi}{180}\cos\left(x^\circ\right)$. |`,
            T`**Kesalahan paling umum pada aturan rantai adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ $\frac{d}{dx}\sin2x=\cos2x$ | Turunan fungsi dalam adalah faktor: $\frac{d}{dx}\sin2x=2\cos2x$. |
| ❌ $\frac{d}{dx}\left(x^2+1\right)^5=5\left(x^2+1\right)^4$ | Aturan pangkat hanya memberi fungsi luar: kalikan dengan $2x$ untuk mendapat $10x\left(x^2+1\right)^4$. |
| ❌ $\frac{d}{dx}e^{2x}=2x\,e^{2x-1}$ | Pangkatnya memuat $x$, sehingga aturan pangkat tidak berlaku. Turunan $e^u$ adalah $e^u\cdot u'$, yaitu $2e^{2x}$. |
| ❌ $\frac{d}{dx}\cos\left(x^2\right)=-\sin x\cdot2x$ | Turunan fungsi luar dihitung pada fungsi dalam, bukan pada $x$: $-\sin\left(x^2\right)\cdot2x$. |
| ❌ $\frac{d}{dx}\sin^2x=2\sin x$ | Ada dua lapisan, kuadrat dan sinus: $2\sin x\cdot\cos x$. |
| ❌ Turunan kedua $f(g(x))$ adalah $f''(g(x))\cdot g''(x)$ | Yang benar $f''(g)\left(g'\right)^2+f'(g)\,g''$: suku kedua dan kuadratnya hilang. |
| ❌ $(f\circ g)'=f'\circ g'$, komposisi turunan-turunan | Ia *hasil kali*: $f'(g(x))\cdot g'(x)$, dengan $f'$ diambil di $g(x)$. |
| ❌ Jika $g$ tidak terdiferensialkan di $a$, maka $f(g(x))$ juga tidak | Belum tentu: dengan $g=|x|$ dan $f=x^2$ komposit itu $x^2$, terdiferensialkan di $0$. |
| ❌ $\frac{d}{dx}\sin\left(x^\circ\right)=\cos\left(x^\circ\right)$ | Fungsi dalam $\frac{\pi x}{180}$ menambah faktor: $\frac{\pi}{180}\cos\left(x^\circ\right)$. |`,
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
              L('$(f\\circ g)\'(x)=f\'(g(x))\\cdot g\'(x)$.', '$(f\\circ g)\'(x)=f\'(g(x))\\cdot g\'(x)$.'),
              L('$\\frac{d}{dx}\\sin3x=3\\cos3x$.', '$\\frac{d}{dx}\\sin3x=3\\cos3x$.'),
              L('$\\frac{d}{dx}e^{x^2}=e^{x^2}$.', '$\\frac{d}{dx}e^{x^2}=e^{x^2}$.'),
              L('$\\frac{d}{dx}\\left(x^2+1\\right)^5=5\\left(x^2+1\\right)^4$.', '$\\frac{d}{dx}\\left(x^2+1\\right)^5=5\\left(x^2+1\\right)^4$.'),
              L('If $g$ is not differentiable at $a$, then $f(g(x))$ cannot be differentiable at $a$.', 'Jika $g$ tidak terdiferensialkan di $a$, maka $f(g(x))$ tidak mungkin terdiferensialkan di $a$.'),
              L('$\\frac{d}{dx}\\sin^2x=2\\sin x\\cos x$.', '$\\frac{d}{dx}\\sin^2x=2\\sin x\\cos x$.'),
            ],
            answer: [true, true, false, false, false, true],
            explain: L(
              'The inside derivative is a factor each time: $e^{x^2}$ gives $2x\\,e^{x^2}$ and $\\left(x^2+1\\right)^5$ gives $10x\\left(x^2+1\\right)^4$. With $g=|x|$ and $f=x^2$ the composite is $x^2$, which is differentiable at $0$.',
              'Turunan fungsi dalam adalah faktor setiap kali: $e^{x^2}$ memberi $2x\\,e^{x^2}$ dan $\\left(x^2+1\\right)^5$ memberi $10x\\left(x^2+1\\right)^4$. Dengan $g=|x|$ dan $f=x^2$ komposit itu $x^2$, yang terdiferensialkan di $0$.',
            ),
            hint: L('Did each answer include the derivative of the inside function?', 'Apakah tiap jawaban memuat turunan fungsi dalamnya?'),
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
              L('$\\frac{d}{dx}\\cos5x=-5\\sin5x$', '$\\frac{d}{dx}\\cos5x=-5\\sin5x$'),
              L('$\\frac{d}{dx}e^{-x}=-e^{-x}$', '$\\frac{d}{dx}e^{-x}=-e^{-x}$'),
              L('$\\frac{d}{dx}\\sqrt{x^2+1}=\\frac{x}{\\sqrt{x^2+1}}$', '$\\frac{d}{dx}\\sqrt{x^2+1}=\\frac{x}{\\sqrt{x^2+1}}$'),
              L('$\\frac{d}{dx}\\tan\\left(x^2\\right)=2x\\sec^2\\left(x^2\\right)$', '$\\frac{d}{dx}\\tan\\left(x^2\\right)=2x\\sec^2\\left(x^2\\right)$'),
              L('$\\frac{d}{dx}\\sin\\left(x^2\\right)=\\cos\\left(x^2\\right)$', '$\\frac{d}{dx}\\sin\\left(x^2\\right)=\\cos\\left(x^2\\right)$'),
            ],
            answer: [0, 1, 2, 3],
            explain: L('Each correct one has the derivative of the inside as a factor: $-5$, $-1$, $2x$ (inside $x^2+1$) and $2x$ (inside $x^2$). The last one forgot the factor $2x$.', 'Tiap yang benar memuat turunan fungsi dalam sebagai faktor: $-5$, $-1$, $2x$ (dalam $x^2+1$), dan $2x$ (dalam $x^2$). Yang terakhir melupakan faktor $2x$.'),
            hint: L('Find the inside function and its derivative first.', 'Cari dulu fungsi dalam dan turunannya.'),
          },
        },
        {
          kind: 'activity',
          title: L('A power of a sum', 'Pangkat dari suatu jumlah'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L('$y\'=2\\left(3x^2+1\\right)\\cdot6x$.', '$y\'=2\\left(3x^2+1\\right)\\cdot6x$.'), L('At $x=1$: $2\\cdot4\\cdot6$.', 'Di $x=1$: $2\\cdot4\\cdot6$.')],
            explain: L('$y\'=2\\left(3x^2+1\\right)\\cdot6x=12x\\left(3x^2+1\\right)$, and at $x=1$ that is $12\\cdot4=48$.', '$y\'=2\\left(3x^2+1\\right)\\cdot6x=12x\\left(3x^2+1\\right)$, dan di $x=1$ itu $12\\cdot4=48$.'),
            prompt: L('For $y=\\left(3x^2+1\\right)^2$ find $y\'(1)$.', 'Untuk $y=\\left(3x^2+1\\right)^2$ tentukan $y\'(1)$.'),
            given: String.raw`y'(1)=v`,
            blanks: [{ label: "y'(1) =", answer: 48 }],
          },
        },
        {
          kind: 'activity',
          title: L('A constant inside a sine', 'Konstanta di dalam sinus'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L('$y\'=2\\cos2x$.', '$y\'=2\\cos2x$.'), L('$\\cos0=1$.', '$\\cos0=1$.')],
            explain: L('$y\'(0)=2\\cos0=2$: the curve $y=\\sin2x$ leaves the origin twice as steeply as $y=\\sin x$.', '$y\'(0)=2\\cos0=2$: kurva $y=\\sin2x$ meninggalkan titik asal dua kali lebih curam daripada $y=\\sin x$.'),
            prompt: L('Find the slope of $y=\\sin2x$ at $x=0$.', 'Tentukan gradien $y=\\sin2x$ di $x=0$.'),
            given: String.raw`y'(0)=v`,
            blanks: [{ label: "y'(0) =", answer: 2 }],
          },
        },
        {
          kind: 'activity',
          title: L('Always uphill', 'Selalu menanjak'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [L('Write $y=(1-2x)^{-3}$; $y\'=-3(1-2x)^{-4}\\cdot(-2)$.', 'Tulis $y=(1-2x)^{-3}$; $y\'=-3(1-2x)^{-4}\\cdot(-2)$.'), L('At $x=0$: $6\\cdot1^{-4}$.', 'Di $x=0$: $6\\cdot1^{-4}$.')],
            explain: L('$y\'=\\frac{6}{(1-2x)^4}$, which is $6$ at $x=0$.', '$y\'=\\frac{6}{(1-2x)^4}$, yaitu $6$ di $x=0$.'),
            prompt: L('Find the slope of $y=\\frac{1}{(1-2x)^3}$ at $x=0$.', 'Tentukan gradien $y=\\frac{1}{(1-2x)^3}$ di $x=0$.'),
            given: String.raw`y'(0)=v`,
            blanks: [{ label: "y'(0) =", answer: 6 }],
          },
        },
        {
          kind: 'activity',
          title: L('Outside at the inside', 'Luar pada dalam'),
          step: {
            kind: 'quiz',
            id: 'p6',
            prompt: L('What is $\\frac{d}{dx}\\cos\\left(x^2\\right)$?', 'Berapa $\\frac{d}{dx}\\cos\\left(x^2\\right)$?'),
            options: [L('$-2x\\sin\\left(x^2\\right)$', '$-2x\\sin\\left(x^2\\right)$'), L('$-\\sin\\left(x^2\\right)$', '$-\\sin\\left(x^2\\right)$'), L('$-2x\\sin x$', '$-2x\\sin x$'), L('$2x\\cos x$', '$2x\\cos x$')],
            answer: 0,
            explain: L('The outside, cosine, has derivative $-\\sin$ taken at the inside $x^2$, and the inside has derivative $2x$.', 'Fungsi luar, kosinus, berturunan $-\\sin$ yang diambil di fungsi dalam $x^2$, dan fungsi dalam berturunan $2x$.'),
            hint: L('Keep $x^2$ inside the sine, and multiply by $2x$.', 'Biarkan $x^2$ di dalam sinus, dan kalikan dengan $2x$.'),
          },
        },
        {
          kind: 'activity',
          title: L('A second derivative', 'Turunan kedua'),
          step: {
            kind: 'math',
            id: 'p7',
            hints: [L('$y\'=2x\\cos\\left(x^2\\right)$.', '$y\'=2x\\cos\\left(x^2\\right)$.'), L('$y\'\'=2\\cos\\left(x^2\\right)-4x^2\\sin\\left(x^2\\right)$.', '$y\'\'=2\\cos\\left(x^2\\right)-4x^2\\sin\\left(x^2\\right)$.')],
            explain: L('$y\'\'=2\\cos\\left(x^2\\right)-4x^2\\sin\\left(x^2\\right)$, so $y\'\'(0)=2\\cos0-0=2$.', '$y\'\'=2\\cos\\left(x^2\\right)-4x^2\\sin\\left(x^2\\right)$, sehingga $y\'\'(0)=2\\cos0-0=2$.'),
            prompt: L('For $y=\\sin\\left(x^2\\right)$ find $y\'\'(0)$.', 'Untuk $y=\\sin\\left(x^2\\right)$ tentukan $y\'\'(0)$.'),
            given: String.raw`y''(0)=v`,
            blanks: [{ label: "y'' =", answer: 2 }],
          },
        },
        {
          kind: 'activity',
          title: L('The second derivative formula', 'Rumus turunan kedua'),
          step: {
            kind: 'quiz',
            id: 'p8',
            prompt: L('What is $\\frac{d^2}{dx^2}f(g(x))$?', 'Berapa $\\frac{d^2}{dx^2}f(g(x))$?'),
            options: [L('$f\'\'(g)\\left(g\'\\right)^2+f\'(g)\\,g\'\'$', '$f\'\'(g)\\left(g\'\\right)^2+f\'(g)\\,g\'\'$'), L('$f\'\'(g)\\,g\'\'$', '$f\'\'(g)\\,g\'\'$'), L('$f\'\'(g)\\left(g\'\\right)^2$', '$f\'\'(g)\\left(g\'\\right)^2$'), L('$f\'(g)\\,g\'\'$', '$f\'(g)\\,g\'\'$')],
            answer: 0,
            explain: L('The product rule on $f\'(g)\\,g\'$ gives two terms, and the chain rule on $f\'(g)$ gives the factor $g\'$ in the first one.', 'Aturan hasil kali pada $f\'(g)\\,g\'$ memberi dua suku, dan aturan rantai pada $f\'(g)$ memberi faktor $g\'$ pada suku pertama.'),
            hint: L('Differentiate $f\'(g(x))\\cdot g\'(x)$ as a product.', 'Turunkan $f\'(g(x))\\cdot g\'(x)$ sebagai hasil kali.'),
          },
        },
        {
          kind: 'activity',
          title: L('A faster piston', 'Piston yang lebih cepat'),
          step: {
            kind: 'math',
            id: 'p9',
            hints: [L('The acceleration is $-(2\\pi b)^2A\\cos(2\\pi bt)$.', 'Percepatannya $-(2\\pi b)^2A\\cos(2\\pi bt)$.'), L('Replace $b$ by $2b$: $(2\\pi\\cdot2b)^2=4(2\\pi b)^2$.', 'Ganti $b$ dengan $2b$: $(2\\pi\\cdot2b)^2=4(2\\pi b)^2$.')],
            explain: L('The acceleration has the factor $(2\\pi b)^2$, so doubling $b$ multiplies it by $4$.', 'Percepatan memuat faktor $(2\\pi b)^2$, sehingga menggandakan $b$ mengalikannya dengan $4$.'),
            prompt: L('A piston moves as $s=A\\cos(2\\pi bt)$. By what factor does its greatest acceleration grow when the frequency $b$ is doubled?', 'Sebuah piston bergerak sebagai $s=A\\cos(2\\pi bt)$. Berapa kali lipat percepatan terbesarnya bertambah bila frekuensi $b$ digandakan?'),
            given: String.raw`\text{factor}=v`,
            blanks: [{ label: 'factor =', answer: 4 }],
          },
        },
        {
          kind: 'activity',
          title: L('The warmest rise', 'Kenaikan tercepat'),
          step: {
            kind: 'math',
            id: 'p10',
            hints: [L('$y\'=\\frac{40\\pi}{365}\\cos\\left(\\frac{2\\pi}{365}(x-101)\\right)$.', '$y\'=\\frac{40\\pi}{365}\\cos\\left(\\frac{2\\pi}{365}(x-101)\\right)$.'), L('The cosine is $1$ when its argument is $0$.', 'Kosinus bernilai $1$ bila argumennya $0$.')],
            explain: L('The cosine of the derivative is greatest, equal to $1$, when $x-101=0$.', 'Kosinus pada turunan terbesar, sama dengan $1$, bila $x-101=0$.'),
            prompt: L('The temperature is $y=20\\sin\\left(\\frac{2\\pi}{365}(x-101)\\right)-4$ on day $x$. On which day is it rising fastest?', 'Suhu adalah $y=20\\sin\\left(\\frac{2\\pi}{365}(x-101)\\right)-4$ pada hari ke-$x$. Pada hari ke berapa ia naik paling cepat?'),
            given: String.raw`x=v`,
            blanks: [{ label: 'day =', answer: 101 }],
          },
        },
        {
          kind: 'activity',
          title: L('Cosine in degrees', 'Kosinus dalam derajat'),
          step: {
            kind: 'quiz',
            id: 'p11',
            prompt: L('What is $\\frac{d}{dx}\\cos\\left(x^\\circ\\right)$?', 'Berapa $\\frac{d}{dx}\\cos\\left(x^\\circ\\right)$?'),
            options: [L('$-\\sin\\left(x^\\circ\\right)$', '$-\\sin\\left(x^\\circ\\right)$'), L('$-\\frac{\\pi}{180}\\sin\\left(x^\\circ\\right)$', '$-\\frac{\\pi}{180}\\sin\\left(x^\\circ\\right)$'), L('$\\frac{\\pi}{180}\\sin\\left(x^\\circ\\right)$', '$\\frac{\\pi}{180}\\sin\\left(x^\\circ\\right)$'), L('$-\\frac{180}{\\pi}\\sin\\left(x^\\circ\\right)$', '$-\\frac{180}{\\pi}\\sin\\left(x^\\circ\\right)$')],
            answer: 1,
            explain: L('The inside $\\frac{\\pi x}{180}$ has derivative $\\frac{\\pi}{180}$, and the cosine gives $-\\sin$.', 'Fungsi dalam $\\frac{\\pi x}{180}$ berturunan $\\frac{\\pi}{180}$, dan kosinus memberi $-\\sin$.'),
            hint: L('How many radians is $x^\\circ$?', 'Berapa radian $x^\\circ$?'),
          },
        },
        {
          kind: 'activity',
          title: L('A derivative at the origin', 'Turunan di titik asal'),
          step: {
            kind: 'quiz',
            id: 'p12',
            prompt: L('Let $f(x)=x^2\\sin\\frac1x$ for $x\\ne0$ and $f(0)=0$. What is $f\'(0)$?', 'Misalkan $f(x)=x^2\\sin\\frac1x$ untuk $x\\ne0$ dan $f(0)=0$. Berapa $f\'(0)$?'),
            options: [L('$0$', '$0$'), L('$1$', '$1$'), L('it does not exist', 'tidak ada'), L('$-1$', '$-1$')],
            answer: 0,
            explain: L('The quotient is $h\\sin\\frac1h$ with $\\left|h\\sin\\frac1h\\right|\\le|h|\\to0$, so $f\'(0)=0$, even though $f\'(x)$ has no limit at $0$.', 'Hasil baginya $h\\sin\\frac1h$ dengan $\\left|h\\sin\\frac1h\\right|\\le|h|\\to0$, sehingga $f\'(0)=0$, walaupun $f\'(x)$ tidak memiliki limit di $0$.'),
            hint: L('Use the definition: the chain rule cannot be used at $0$.', 'Pakai definisi: aturan rantai tidak dapat dipakai di $0$.'),
          },
        },
      ],
    },

    /* ----------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: the chain rule at a glance', 'Ringkasan: aturan rantai sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **The rule:** $(f\circ g)'(x)=f'(g(x))\cdot g'(x)$, or $\frac{dy}{dx}=\frac{dy}{du}\cdot\frac{du}{dx}$: differentiate the outside with the inside left alone, then multiply by the derivative of the inside.
- **Layers:** find the outside by asking what is done last to $x$; with three or more layers, one factor for each, from the outside in.
- **Formulas:** $(\sin u)'=\cos u\cdot u'$, $(e^u)'=e^u\cdot u'$, $\left(u^n\right)'=n\,u^{n-1}u'$, and likewise for the other functions.
- **Constants inside:** $\frac{d}{dx}\sin(kx)=k\cos(kx)$; doubling a piston's frequency multiplies velocity, acceleration and jerk by $2$, $4$, $8$; in degrees the factor is $\frac{\pi}{180}$.
- **Second derivative:** $f''(g)\left(g'\right)^2+f'(g)\,g''$.
- **Limits of the rule:** both functions must be differentiable where used; a composite can be differentiable when the inside is not, as $|x|^2$ is.
- **Code:** ´sp.diff´ for formulas; a pair $(v,d)$ with $f'(u)\cdot u'$ for numbers.`,
            T`- **Aturannya:** $(f\circ g)'(x)=f'(g(x))\cdot g'(x)$, atau $\frac{dy}{dx}=\frac{dy}{du}\cdot\frac{du}{dx}$: turunkan fungsi luar dengan fungsi dalam dibiarkan, lalu kalikan dengan turunan fungsi dalam.
- **Lapisan:** temukan fungsi luar dengan bertanya apa yang dilakukan terakhir pada $x$; dengan tiga lapisan atau lebih, satu faktor untuk tiap lapisan, dari luar ke dalam.
- **Rumus:** $(\sin u)'=\cos u\cdot u'$, $(e^u)'=e^u\cdot u'$, $\left(u^n\right)'=n\,u^{n-1}u'$, dan begitu pula untuk fungsi lainnya.
- **Konstanta di dalam:** $\frac{d}{dx}\sin(kx)=k\cos(kx)$; menggandakan frekuensi piston mengalikan kecepatan, percepatan, dan sentakan dengan $2$, $4$, $8$; dalam derajat faktornya $\frac{\pi}{180}$.
- **Turunan kedua:** $f''(g)\left(g'\right)^2+f'(g)\,g''$.
- **Batas aturan:** kedua fungsi harus terdiferensialkan di tempat ia dipakai; komposit dapat terdiferensialkan bila fungsi dalamnya tidak, seperti $|x|^2$.
- **Kode:** ´sp.diff´ untuk rumus; sepasang $(v,d)$ dengan $f'(u)\cdot u'$ untuk bilangan.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Composite function', 'Fungsi komposit'), definition: L('A function formed by applying one function to the output of another, written f of g of x, where the inside function g is applied first and the outside function f last.', 'Fungsi yang dibentuk dengan menerapkan satu fungsi pada keluaran fungsi lain, ditulis f dari g dari x, dengan fungsi dalam g diterapkan lebih dulu dan fungsi luar f terakhir.') },
    { term: L('Inside function', 'Fungsi dalam'), definition: L('The function in a composite that is applied first, so that its output is the input of the outside function; it is the u in y equals f of u.', 'Fungsi dalam suatu komposit yang diterapkan lebih dulu, sehingga keluarannya menjadi masukan fungsi luar; ia adalah u pada y sama dengan f dari u.') },
    { term: L('Outside function', 'Fungsi luar'), definition: L('The function in a composite that is applied last, to the result of the inside function; it is the f in y equals f of u.', 'Fungsi pada suatu komposit yang diterapkan terakhir, pada hasil fungsi dalam; ia adalah f pada y sama dengan f dari u.') },
    { term: L('Chain rule', 'Aturan rantai'), definition: L('The rule that the derivative of a composite function is the derivative of the outside function evaluated at the inside function, times the derivative of the inside function.', 'Aturan bahwa turunan suatu fungsi komposit adalah turunan fungsi luar yang dihitung pada fungsi dalam, dikali turunan fungsi dalam.') },
    { term: L('Power chain rule', 'Aturan rantai pangkat'), definition: L('The chain rule for a power of a function: the derivative of u to the n is n times u to the n minus 1 times the derivative of u.', 'Aturan rantai untuk pangkat dari suatu fungsi: turunan u pangkat n adalah n kali u pangkat n dikurangi 1 kali turunan u.') },
    { term: L('Frequency', 'Frekuensi'), definition: L('The number of complete cycles an oscillation makes per unit of time; in the sine of 2 pi b t it is b, and every derivative multiplies the motion by 2 pi b.', 'Banyak siklus lengkap yang dibuat suatu osilasi per satuan waktu; pada sinus dari 2 pi b t nilainya b, dan setiap turunan mengalikan gerak dengan 2 pi b.') },
    { term: L('Automatic differentiation', 'Diferensiasi otomatis'), definition: L('A way of computing exact derivatives of a program by carrying a derivative along with every value and applying the chain rule at every operation.', 'Cara menghitung turunan eksak suatu program dengan membawa turunan bersama setiap nilai dan menerapkan aturan rantai pada setiap operasi.') },
  ],

  howTo: [
    {
      name: L('How to differentiate a composite function with the chain rule', 'Cara menurunkan fungsi komposit dengan aturan rantai'),
      description: L('Find the layers, differentiate from the outside in, and multiply the factors.', 'Temukan lapisannya, turunkan dari luar ke dalam, dan kalikan faktor-faktornya.'),
      steps: [
        { name: L('Find the outside and the inside', 'Cari fungsi luar dan dalam'), text: L('Ask what is done last to x; that is the outside function, and what it is done to is the inside function.', 'Tanyakan apa yang dilakukan terakhir pada x; itulah fungsi luar, dan yang dikenainya adalah fungsi dalam.') },
        { name: L('Differentiate the outside, leaving the inside alone', 'Turunkan fungsi luar, biarkan fungsi dalam'), text: L('Take the derivative of the outside function and evaluate it at the inside function, which stays exactly as it was.', 'Ambil turunan fungsi luar dan hitung pada fungsi dalam, yang tetap persis seperti semula.') },
        { name: L('Multiply by the derivative of the inside', 'Kalikan dengan turunan fungsi dalam'), text: L('Differentiate the inside function and multiply; if it is itself a composite, repeat this step on it.', 'Turunkan fungsi dalam dan kalikan; jika ia sendiri komposit, ulangi langkah ini padanya.') },
        { name: L('Simplify and check', 'Sederhanakan dan periksa'), text: L('Collect the factors, and check at one value of x with a difference quotient.', 'Kumpulkan faktor-faktornya, dan periksa di satu nilai x dengan hasil bagi selisih.') },
      ],
    },
    {
      name: L('How to find the second derivative of a composite function', 'Cara mencari turunan kedua fungsi komposit'),
      description: L('Differentiate f prime of g times g prime with the product rule and the chain rule.', 'Turunkan f aksen dari g kali g aksen dengan aturan hasil kali dan aturan rantai.'),
      steps: [
        { name: L('Write the first derivative', 'Tulis turunan pertama'), text: L('Use the chain rule to write y prime as f prime of g times g prime.', 'Pakai aturan rantai untuk menulis y aksen sebagai f aksen dari g kali g aksen.') },
        { name: L('Apply the product rule', 'Terapkan aturan hasil kali'), text: L('Differentiate the product: the derivative of f prime of g times g prime, plus f prime of g times g double prime.', 'Turunkan hasil kali itu: turunan f aksen dari g kali g aksen, ditambah f aksen dari g kali g aksen ganda.') },
        { name: L('Use the chain rule on the first factor', 'Pakai aturan rantai pada faktor pertama'), text: L('The derivative of f prime of g is f double prime of g times g prime, which gives f double prime of g times g prime squared.', 'Turunan f aksen dari g adalah f aksen ganda dari g kali g aksen, yang memberi f aksen ganda dari g kali g aksen kuadrat.') },
        { name: L('Add the two terms', 'Jumlahkan kedua suku'), text: L('The second derivative is f double prime of g times g prime squared, plus f prime of g times g double prime.', 'Turunan keduanya adalah f aksen ganda dari g kali g aksen kuadrat, ditambah f aksen dari g kali g aksen ganda.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is the chain rule in calculus?', 'Apa itu aturan rantai dalam kalkulus?'),
      a: L(
        'The chain rule gives the derivative of a composite function. It says to differentiate the outside function at the inside function and multiply by the derivative of the inside function, so the derivative of f of g of x is f prime of g of x times g prime of x.',
        'Aturan rantai memberi turunan suatu fungsi komposit. Ia menyatakan untuk menurunkan fungsi luar pada fungsi dalam lalu mengalikannya dengan turunan fungsi dalam, sehingga turunan f dari g dari x adalah f aksen dari g dari x kali g aksen dari x.',
      ),
    },
    {
      q: L('How do you know when to use the chain rule?', 'Bagaimana mengetahui kapan memakai aturan rantai?'),
      a: L(
        'Use it when one function is put inside another, such as sine of two x, e to the x squared or a power of a sum. If the last operation done to x is a function applied to an expression, and not a sum or product of separate pieces, there is a chain.',
        'Pakai ia bila satu fungsi diletakkan di dalam fungsi lain, seperti sinus dari dua x, e pangkat x kuadrat, atau pangkat dari suatu jumlah. Jika operasi terakhir pada x adalah fungsi yang diterapkan pada suatu ekspresi, dan bukan jumlah atau hasil kali bagian-bagian terpisah, ada rantai.',
      ),
    },
    {
      q: L('What is the outside-inside rule?', 'Apa itu aturan luar-dalam?'),
      a: L(
        'It is the chain rule in words: differentiate the outside function and evaluate it at the inside function left alone, then multiply by the derivative of the inside function. It reminds you that the outside derivative is evaluated at the inside, not at x.',
        'Itu aturan rantai dengan kata-kata: turunkan fungsi luar dan hitung pada fungsi dalam yang dibiarkan, lalu kalikan dengan turunan fungsi dalam. Ia mengingatkan bahwa turunan fungsi luar dihitung pada fungsi dalam, bukan pada x.',
      ),
    },
    {
      q: L('What is the derivative of sin 2x?', 'Berapa turunan sin 2x?'),
      a: L(
        'It is two cosine of two x. The outside function is sine, whose derivative is cosine evaluated at two x, and the inside function two x has derivative 2, so the factor 2 comes out in front. Forgetting it is the most common mistake.',
        'Turunannya dua kosinus dari dua x. Fungsi luarnya sinus, yang turunannya kosinus dihitung pada dua x, dan fungsi dalam dua x berturunan 2, sehingga faktor 2 muncul di depan. Melupakannya adalah kesalahan yang paling umum.',
      ),
    },
    {
      q: L('What is the derivative of e to the x squared?', 'Berapa turunan e pangkat x kuadrat?'),
      a: L(
        'It is two x times e to the x squared. The derivative of e to the u is e to the u times the derivative of u, and here u is x squared with derivative two x. The power rule does not apply to an exponent that contains x.',
        'Turunannya dua x kali e pangkat x kuadrat. Turunan e pangkat u adalah e pangkat u kali turunan u, dan di sini u adalah x kuadrat dengan turunan dua x. Aturan pangkat tidak berlaku untuk pangkat yang memuat x.',
      ),
    },
    {
      q: L('How do you use the chain rule more than once?', 'Bagaimana memakai aturan rantai lebih dari sekali?'),
      a: L(
        'Work from the outside in, one layer at a time. Differentiate the outermost function with everything inside it left alone, multiply by the derivative of what was inside, and apply the rule again to that, until the inside is just x. Each layer gives one factor.',
        'Kerjakan dari luar ke dalam, satu lapisan dalam satu waktu. Turunkan fungsi paling luar dengan semua yang ada di dalamnya dibiarkan, kalikan dengan turunan apa yang ada di dalamnya, dan terapkan aturan lagi pada itu, sampai bagian dalamnya hanya x. Tiap lapisan memberi satu faktor.',
      ),
    },
    {
      q: L('What is the power chain rule?', 'Apa itu aturan rantai pangkat?'),
      a: L(
        'It is the chain rule for a power of a function: the derivative of u to the n is n times u to the n minus one times the derivative of u. It handles powers of sums, reciprocals and square roots of any expression.',
        'Itu aturan rantai untuk pangkat dari suatu fungsi: turunan u pangkat n adalah n kali u pangkat n dikurangi satu kali turunan u. Ia menangani pangkat dari jumlah, kebalikan, dan akar kuadrat dari ekspresi apa pun.',
      ),
    },
    {
      q: L('What is the second derivative of a composite function?', 'Berapa turunan kedua fungsi komposit?'),
      a: L(
        'It is f double prime of g times the square of g prime, plus f prime of g times g double prime. The product rule makes two terms, and the chain rule on f prime of g supplies the extra factor g prime in the first one.',
        'Turunan keduanya adalah f aksen ganda dari g kali kuadrat g aksen, ditambah f aksen dari g kali g aksen ganda. Aturan hasil kali membuat dua suku, dan aturan rantai pada f aksen dari g memberi faktor tambahan g aksen pada suku pertama.',
      ),
    },
    {
      q: L('Does the chain rule work if the inside function is not differentiable?', 'Apakah aturan rantai bekerja jika fungsi dalamnya tidak terdiferensialkan?'),
      a: L(
        'The rule itself needs the inside function to be differentiable where it is used. The composite may still be differentiable, though: the square of the absolute value of x is x squared, which has a derivative at zero even though the absolute value does not.',
        'Aturan itu sendiri memerlukan fungsi dalam terdiferensialkan di tempat ia dipakai. Komposit itu mungkin tetap terdiferensialkan: kuadrat nilai mutlak x adalah x kuadrat, yang memiliki turunan di nol walaupun nilai mutlak tidak.',
      ),
    },
  ],

  references: [
    { title: "Thomas' Calculus: Early Transcendentals in SI Units (15th ed.), Section 3.6: The Chain Rule", author: 'Joel Hass, Christopher Heil, Maurice D. Weir et al.', year: 2023, source: 'Pearson' },
    { title: 'Calculus (8th ed.), section 3.4: The Chain Rule', author: 'James Stewart', year: 2015, source: 'Cengage Learning' },
    { title: 'The derivative à la Carathéodory', author: 'Stephen Kuhn', year: 1991, source: 'The American Mathematical Monthly, 98(1), 40–44' },
    { title: 'Learning representations by back-propagating errors', author: 'David E. Rumelhart, Geoffrey E. Hinton, Ronald J. Williams', year: 1986, source: 'Nature, 323, 533–536' },
  ],

  related: ['derivatives-of-trigonometric-functions', 'differentiation-rules', 'the-derivative-as-a-rate-of-change', 'the-derivative-as-a-function'],
}
