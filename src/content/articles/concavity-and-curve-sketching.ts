import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './concavity-and-curve-sketching.meta'

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
    T`**The graph of $f$ is concave up where $f'$ is increasing, which is where $f''>0$, and concave down where $f'$ is decreasing, where $f''<0$; a point where the concavity changes and the graph has a tangent line is a point of inflection.** The Second Derivative Test uses the same sign at a critical point, $f'=0$: $f''>0$ is a local minimum and $f''<0$ a local maximum. Together with $f'$ and the asymptotes, $f''$ gives the shape of a graph.`,
    T`**Grafik $f$ cekung ke atas di tempat $f'$ naik, yaitu tempat $f''>0$, dan cekung ke bawah di tempat $f'$ turun, tempat $f''<0$; titik tempat kecekungan berubah dan grafik memiliki garis singgung adalah titik belok.** Uji Turunan Kedua memakai tanda yang sama di titik kritis, $f'=0$: $f''>0$ adalah minimum lokal dan $f''<0$ maksimum lokal. Bersama $f'$ dan asimtot, $f''$ memberi bentuk grafik.`,
  ),

  keyPoints: [
    L(
      T`The graph of a differentiable $f$ is concave up on an open interval if $f'$ is increasing there and concave down if $f'$ is decreasing; if $f''>0$ throughout the graph is concave up, and if $f''<0$ concave down.`,
      T`Grafik $f$ yang terdiferensialkan cekung ke atas pada selang terbuka jika $f'$ naik di sana dan cekung ke bawah jika $f'$ turun; jika $f''>0$ di seluruh selang grafik cekung ke atas, dan jika $f''<0$ cekung ke bawah.`,
    ),
    L(
      T`A point of inflection is a point of the graph with a tangent line where the concavity changes; there $f''=0$ or $f''$ does not exist, but the converse is false: $f''(0)=0$ for $x^4$ and there is no inflection.`,
      T`Titik belok adalah titik pada grafik yang memiliki garis singgung dan tempat kecekungan berubah; di sana $f''=0$ atau $f''$ tidak ada, tetapi kebalikannya salah: $f''(0)=0$ untuk $x^4$ dan tidak ada titik belok.`,
    ),
    L(
      T`Inflection points can sit where $f''$ does not exist: $x^{5/3}$ at a horizontal tangent and $\sqrt[3]{x}$ at a vertical tangent, while $x^{2/3}$ has a cusp, no tangent line and no inflection.`,
      T`Titik belok dapat berada di tempat $f''$ tidak ada: $x^{5/3}$ pada garis singgung mendatar dan $\sqrt[3]{x}$ pada garis singgung tegak, sedangkan $x^{2/3}$ memiliki titik puncak, tanpa garis singgung dan tanpa titik belok.`,
    ),
    L(
      T`Second Derivative Test: if $f'(c)=0$ and $f''(c)<0$ there is a local maximum, if $f''(c)>0$ a local minimum, and if $f''(c)=0$ the test fails, as $x^4$, $-x^4$ and $x^3$ show.`,
      T`Uji Turunan Kedua: jika $f'(c)=0$ dan $f''(c)<0$ ada maksimum lokal, jika $f''(c)>0$ minimum lokal, dan jika $f''(c)=0$ ujinya gagal, seperti ditunjukkan $x^4$, $-x^4$, dan $x^3$.`,
    ),
    L(
      T`For a particle $a=s''$: speeding up when velocity and acceleration have the same sign and slowing down when they differ; the inflection points of the position are where the acceleration changes sign.`,
      T`Untuk partikel $a=s''$: bertambah cepat ketika kecepatan dan percepatan bertanda sama dan melambat ketika berbeda; titik belok posisi adalah tempat percepatan berganti tanda.`,
    ),
    L(
      T`Curve sketching follows seven steps: domain and symmetry, $f'$ and $f''$, critical points, rising and falling, inflection and concavity, asymptotes, key points.`,
      T`Penggambaran kurva mengikuti tujuh langkah: domain dan simetri, $f'$ dan $f''$, titik kritis, naik dan turun, titik belok dan kecekungan, asimtot, titik penting.`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------------------------ concavity */
    {
      id: 'concavity',
      heading: L('What is concavity?', 'Apa itu kecekungan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The graph of a differentiable function $y=f(x)$ is concave up on an open interval $I$ if $f'$ is increasing on $I$, and concave down on $I$ if $f'$ is decreasing on $I$.** A function whose graph is concave up is also often called *convex*. The picture is of how the curve turns. Along $y=x^3$ coming into the origin from the left, the curve bends to the right and falls below its tangent lines, and the slopes of those tangent lines decrease: concave down. Leaving the origin to the right, the curve bends to the left and rises above its tangent lines, and the slopes increase: concave up.

Since $f'$ is a function in its own right, the [monotonic functions](article:monotonic-functions-and-the-first-derivative-test#derivative-sign) of the previous article apply to it: $f'$ increases where its own derivative $f''$ is positive, and decreases where $f''$ is negative.

**Second Derivative Test for concavity.** Let $y=f(x)$ be twice-differentiable on an interval $I$.
1. If $f''>0$ on $I$, the graph of $f$ over $I$ is concave up.
2. If $f''<0$ on $I$, the graph of $f$ over $I$ is concave down.

We write $f''$ or $y''$ for the second derivative. Concavity is not rising or falling: a concave-up graph can rise, fall or do both, as $x^2$ does, while what it cannot do is wave.

**Example 1.** (a) The curve $y=x^3$ has $y''=6x$, negative for $x<0$ and positive for $x>0$, so it is concave down on $(-\infty,0)$ and concave up on $(0,\infty)$. (b) The curve $y=x^2$ has $y''=2>0$ everywhere, so it is concave up on the whole line.

**Example 2.** Determine the concavity of $y=3+\sin x$ on $0\le x\le2\pi$. Here $y'=\cos x$ and $y''=-\sin x$, which is negative on $(0,\pi)$ and positive on $(\pi,2\pi)$. The graph is concave down on $(0,\pi)$ and concave up on $(\pi,2\pi)$.

Type a function and a window below, or choose an example. The graph is dark where it is concave up and orange where it is concave down, and the graph of $f''$ shows why.`,
            T`**Grafik fungsi terdiferensialkan $y=f(x)$ cekung ke atas pada selang terbuka $I$ jika $f'$ naik pada $I$, dan cekung ke bawah pada $I$ jika $f'$ turun pada $I$.** Fungsi yang grafiknya cekung ke atas juga sering disebut *konveks*. Gambarannya adalah bagaimana kurva berbelok. Sepanjang $y=x^3$ yang mendekati titik asal dari kiri, kurva berbelok ke kanan dan jatuh di bawah garis singgungnya, dan gradien garis singgung itu mengecil: cekung ke bawah. Menjauhi titik asal ke kanan, kurva berbelok ke kiri dan naik di atas garis singgungnya, dan gradiennya membesar: cekung ke atas.

Karena $f'$ adalah fungsi tersendiri, [fungsi monoton](article:monotonic-functions-and-the-first-derivative-test#derivative-sign) dari artikel sebelumnya berlaku padanya: $f'$ naik di tempat turunannya sendiri $f''$ positif, dan turun di tempat $f''$ negatif.

**Uji Turunan Kedua untuk kecekungan.** Misalkan $y=f(x)$ terdiferensialkan dua kali pada selang $I$.
1. Jika $f''>0$ pada $I$, grafik $f$ pada $I$ cekung ke atas.
2. Jika $f''<0$ pada $I$, grafik $f$ pada $I$ cekung ke bawah.

Kita menulis $f''$ atau $y''$ untuk turunan kedua. Kecekungan bukan naik atau turun: grafik cekung ke atas dapat naik, turun, atau keduanya, seperti $x^2$, sedangkan yang tidak dapat dilakukannya adalah bergelombang.

**Contoh 1.** (a) Kurva $y=x^3$ memiliki $y''=6x$, negatif untuk $x<0$ dan positif untuk $x>0$, sehingga cekung ke bawah pada $(-\infty,0)$ dan cekung ke atas pada $(0,\infty)$. (b) Kurva $y=x^2$ memiliki $y''=2>0$ di mana-mana, sehingga cekung ke atas pada seluruh garis.

**Contoh 2.** Tentukan kecekungan $y=3+\sin x$ pada $0\le x\le2\pi$. Di sini $y'=\cos x$ dan $y''=-\sin x$, yang negatif pada $(0,\pi)$ dan positif pada $(\pi,2\pi)$. Grafiknya cekung ke bawah pada $(0,\pi)$ dan cekung ke atas pada $(\pi,2\pi)$.

Ketik fungsi dan jendela di bawah, atau pilih contoh. Grafiknya gelap saat cekung ke atas dan oranye saat cekung ke bawah, dan grafik $f''$ menunjukkan sebabnya.`,
          ),
        },
        { kind: 'widget', name: 'concavitytool' },
      ],
    },

    /* ------------------------------------------------------------------ inflection points */
    {
      id: 'inflection-points',
      heading: L('What is a point of inflection?', 'Apa itu titik belok?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A point $(c,f(c))$ where the graph of a function has a tangent line and where the concavity changes is a point of inflection.** At such a point the graph crosses its own tangent line. In Example 2 the curve $y=3+\sin x$ changes concavity at $(\pi,3)$, where the tangent has slope $y'(\pi)=\cos\pi=-1$.

Since the tangent line exists, either $f'(c)$ exists (is finite), or the graph has a vertical tangent there. At a vertical tangent neither $f'$ nor $f''$ exists. So at a point of inflection one of two things happens: **$f''(c)=0$ or $f''(c)$ fails to exist.** When $f''$ is continuous the first follows from the Intermediate Value Theorem, because $f''$ changes sign. The condition is necessary and not sufficient: $f''=0$ or not existing only marks a candidate, and the sign has to change.

**Example 3.** Find the concavity and inflection points of $f(x)=x^3-3x^2+2$. Here $f'(x)=3x^2-6x$ and $f''(x)=6x-6$, which is negative for $x<1$, zero at $x=1$ and positive for $x>1$. The graph is concave down on $(-\infty,1)$, concave up on $(1,\infty)$ and has the inflection point $(1,0)$.

**Example 4: $f''$ does not exist.** The graph of $f(x)=x^{5/3}$ has a horizontal tangent at the origin, since $f'(x)=\frac53x^{2/3}=0$ at $x=0$. The second derivative $f''(x)=\frac{10}9x^{-1/3}$ does not exist at $0$, but it is negative for $x<0$ and positive for $x>0$, so it changes sign: an inflection point at the origin.

**Example 5: $f''=0$ and no inflection.** The curve $y=x^4$ has $y''=12x^2$, which is $0$ at $x=0$ but does not change sign: the curve is concave up everywhere.

**Example 6: a vertical tangent.** The graph of $y=x^{1/3}$ has an inflection point at the origin because $y''=-\frac29x^{-5/3}$ is positive for $x<0$ and negative for $x>0$. But $y'=\frac13x^{-2/3}$ and $y''$ both fail to exist at $0$, and there is a vertical tangent.

**A caution.** When the second derivative does not exist at $c$, an inflection point may or may not occur. $x^{2/3}$ has no second derivative at $0$ and no inflection: its second derivative $-\frac29x^{-4/3}$ is negative on both sides, and the graph has a cusp, with no tangent line at all. Another case: $f(x)=x|x|$ has $f'(x)=2|x|$, which exists at $0$, although $f''=2\,\text{sign}\,x$ does not, and it is an inflection point. At such places the graph can have vertical tangents, corners, cusps or breaks, so read the sign of $f''$ on both sides and ask whether there is a tangent line. Choose each case below to see the signs, the tangent and the verdict.`,
            T`**Titik $(c,f(c))$ tempat grafik fungsi memiliki garis singgung dan tempat kecekungan berubah adalah titik belok.** Di titik seperti itu grafik memotong garis singgungnya sendiri. Pada Contoh 2 kurva $y=3+\sin x$ mengubah kecekungan di $(\pi,3)$, tempat garis singgung bergradien $y'(\pi)=\cos\pi=-1$.

Karena garis singgung ada, maka $f'(c)$ ada (terhingga), atau grafik memiliki garis singgung tegak di sana. Pada garis singgung tegak $f'$ maupun $f''$ tidak ada. Jadi di titik belok salah satu dari dua hal terjadi: **$f''(c)=0$ atau $f''(c)$ tidak ada.** Ketika $f''$ kontinu, yang pertama mengikuti dari Teorema Nilai Antara, karena $f''$ berganti tanda. Syarat ini perlu dan tidak cukup: $f''=0$ atau tidak ada hanya menandai kandidat, dan tandanya harus berganti.

**Contoh 3.** Tentukan kecekungan dan titik belok $f(x)=x^3-3x^2+2$. Di sini $f'(x)=3x^2-6x$ dan $f''(x)=6x-6$, yang negatif untuk $x<1$, nol di $x=1$, dan positif untuk $x>1$. Grafiknya cekung ke bawah pada $(-\infty,1)$, cekung ke atas pada $(1,\infty)$, dan memiliki titik belok $(1,0)$.

**Contoh 4: $f''$ tidak ada.** Grafik $f(x)=x^{5/3}$ memiliki garis singgung mendatar di titik asal, karena $f'(x)=\frac53x^{2/3}=0$ di $x=0$. Turunan kedua $f''(x)=\frac{10}9x^{-1/3}$ tidak ada di $0$, tetapi negatif untuk $x<0$ dan positif untuk $x>0$, sehingga berganti tanda: titik belok di titik asal.

**Contoh 5: $f''=0$ dan bukan titik belok.** Kurva $y=x^4$ memiliki $y''=12x^2$, yang $0$ di $x=0$ tetapi tidak berganti tanda: kurva cekung ke atas di mana-mana.

**Contoh 6: garis singgung tegak.** Grafik $y=x^{1/3}$ memiliki titik belok di titik asal karena $y''=-\frac29x^{-5/3}$ positif untuk $x<0$ dan negatif untuk $x>0$. Tetapi $y'=\frac13x^{-2/3}$ dan $y''$ keduanya tidak ada di $0$, dan ada garis singgung tegak.

**Peringatan.** Ketika turunan kedua tidak ada di $c$, titik belok mungkin ada dan mungkin tidak. $x^{2/3}$ tidak memiliki turunan kedua di $0$ dan bukan titik belok: turunan keduanya $-\frac29x^{-4/3}$ negatif di kedua sisi, dan grafiknya memiliki titik puncak, tanpa garis singgung sama sekali. Kasus lain: $f(x)=x|x|$ memiliki $f'(x)=2|x|$, yang ada di $0$, walaupun $f''=2\,\text{sign}\,x$ tidak, dan itu titik belok. Di tempat seperti itu grafik dapat memiliki garis singgung tegak, sudut, titik puncak, atau putus, jadi baca tanda $f''$ di kedua sisi dan tanyakan apakah ada garis singgung. Pilih masing-masing kasus di bawah untuk melihat tanda, garis singgung, dan putusannya.`,
          ),
        },
        { kind: 'widget', name: 'inflectioncases' },
      ],
    },

    /* ------------------------------------------------------------------------ acceleration */
    {
      id: 'acceleration',
      heading: L('What does the second derivative say about motion?', 'Apa kata turunan kedua tentang gerak?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**For a particle with position $s(t)$ the acceleration is $a=s''$, and the inflection points of the position graph are where the acceleration changes sign.** Together with the [motion along a line](article:the-derivative-as-a-rate-of-change#motion-along-a-line) of the rates article, the velocity $v=s'$ says which way the particle moves, and the sign of $a$ against the sign of $v$ says whether it speeds up or slows down: it speeds up when $v$ and $a$ have the same sign, and slows down when they have opposite signs.

**Example 7.** A particle moves along a horizontal coordinate line (positive to the right) with position $s(t)=2t^3-14t^2+22t-5$ for $t\ge0$. The velocity is
$$v(t)=s'(t)=6t^2-28t+22$$
$$v(t)=2(t-1)(3t-11)$$
and the acceleration is
$$a(t)=s''(t)=12t-28=4(3t-7).$$
The velocity is zero at $t=1$ and $t=\frac{11}3$, and the acceleration at $t=\frac73$. Putting the signs together:

| Time | $v$ | $a$ | Motion |
|---|---|---|---|
| $0\le t<1$ | $+$ | $-$ | right, slowing down |
| $1<t<\frac73$ | $-$ | $-$ | left, speeding up |
| $\frac73<t<\frac{11}3$ | $-$ | $+$ | left, slowing down |
| $t>\frac{11}3$ | $+$ | $+$ | right, speeding up |

The particle starts moving right while the leftward acceleration slows it, turns round at $t=1$ and speeds up to the left. At $t=\frac73$ the acceleration changes direction, which is the inflection point of the position graph, but the particle keeps moving left, now slowing down. At $t=\frac{11}3$ it turns round again and, moving the same way as the acceleration, speeds up to the right.`,
            T`**Untuk partikel dengan posisi $s(t)$ percepatannya $a=s''$, dan titik belok grafik posisi adalah tempat percepatan berganti tanda.** Bersama [gerak sepanjang garis](article:the-derivative-as-a-rate-of-change#motion-along-a-line) di artikel laju perubahan, kecepatan $v=s'$ menyatakan ke arah mana partikel bergerak, dan tanda $a$ terhadap tanda $v$ menyatakan apakah ia bertambah cepat atau melambat: bertambah cepat ketika $v$ dan $a$ bertanda sama, dan melambat ketika bertanda berlawanan.

**Contoh 7.** Sebuah partikel bergerak sepanjang garis koordinat mendatar (positif ke kanan) dengan posisi $s(t)=2t^3-14t^2+22t-5$ untuk $t\ge0$. Kecepatannya
$$v(t)=s'(t)=6t^2-28t+22$$
$$v(t)=2(t-1)(3t-11)$$
dan percepatannya
$$a(t)=s''(t)=12t-28=4(3t-7).$$
Kecepatan nol di $t=1$ dan $t=\frac{11}3$, dan percepatan di $t=\frac73$. Menggabungkan tanda-tandanya:

| Waktu | $v$ | $a$ | Gerak |
|---|---|---|---|
| $0\le t<1$ | $+$ | $-$ | ke kanan, melambat |
| $1<t<\frac73$ | $-$ | $-$ | ke kiri, bertambah cepat |
| $\frac73<t<\frac{11}3$ | $-$ | $+$ | ke kiri, melambat |
| $t>\frac{11}3$ | $+$ | $+$ | ke kanan, bertambah cepat |

Partikel mulai bergerak ke kanan sementara percepatan ke kiri memperlambatnya, berbalik di $t=1$ dan bertambah cepat ke kiri. Di $t=\frac73$ percepatan berubah arah, yaitu titik belok grafik posisi, tetapi partikel tetap bergerak ke kiri, kini melambat. Di $t=\frac{11}3$ ia berbalik lagi dan, bergerak searah percepatan, bertambah cepat ke kanan.`,
          ),
        },
      ],
    },

    /* -------------------------------------------------------------- second derivative test */
    {
      id: 'second-derivative-test',
      heading: L('What is the Second Derivative Test for local extrema?', 'Apa itu Uji Turunan Kedua untuk ekstrem lokal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Instead of looking for a sign change of $f'$ at a critical point, we can sometimes read the concavity there: a graph that is concave down at a point where the tangent is horizontal is at the top of a hill, and one that is concave up is at the bottom of a valley.**

**Second Derivative Test for local extrema.** Suppose $f''$ is continuous on an open interval that contains $x=c$.
1. If $f'(c)=0$ and $f''(c)<0$, then $f$ has a local maximum at $x=c$.
2. If $f'(c)=0$ and $f''(c)>0$, then $f$ has a local minimum at $x=c$.
3. If $f'(c)=0$ and $f''(c)=0$, then the test fails: $f$ may have a local maximum, a local minimum, or neither.

*Proof of part 1.* If $f''(c)<0$ then $f''<0$ on some open interval $I$ around $c$, because $f''$ is continuous. So $f'$ is decreasing on $I$. Since $f'(c)=0$, the sign of $f'$ changes from positive to negative at $c$, and $f$ has a local maximum at $c$ by the [First Derivative Test](article:monotonic-functions-and-the-first-derivative-test#first-derivative-test). Part 2 is similar. ∎

*Part 3.* Take $y=x^4$, $y=-x^4$ and $y=x^3$. For each of them the first and second derivatives are zero at $x=0$. Yet $x^4$ has a local minimum there, $-x^4$ has a local maximum, and $x^3$ is increasing on every open interval around $0$ and has neither. The test cannot tell them apart.

The test needs $f''$ only at $c$ itself, which makes it easy to apply: one number answers the question. The price is that it is inconclusive when $f''(c)=0$ or when $f''$ does not exist at $c$ (as for $x^{2/3}$ at its cusp); then the First Derivative Test is used. Choose a case below and read the two tests side by side.`,
            T`**Alih-alih mencari pergantian tanda $f'$ di titik kritis, kadang kita dapat membaca kecekungan di sana: grafik yang cekung ke bawah di titik tempat garis singgung mendatar berada di puncak bukit, dan yang cekung ke atas berada di dasar lembah.**

**Uji Turunan Kedua untuk ekstrem lokal.** Misalkan $f''$ kontinu pada selang terbuka yang memuat $x=c$.
1. Jika $f'(c)=0$ dan $f''(c)<0$, maka $f$ memiliki maksimum lokal di $x=c$.
2. Jika $f'(c)=0$ dan $f''(c)>0$, maka $f$ memiliki minimum lokal di $x=c$.
3. Jika $f'(c)=0$ dan $f''(c)=0$, maka ujinya gagal: $f$ mungkin memiliki maksimum lokal, minimum lokal, atau tidak keduanya.

*Bukti bagian 1.* Jika $f''(c)<0$ maka $f''<0$ pada suatu selang terbuka $I$ di sekitar $c$, karena $f''$ kontinu. Jadi $f'$ turun pada $I$. Karena $f'(c)=0$, tanda $f'$ berubah dari positif ke negatif di $c$, dan $f$ memiliki maksimum lokal di $c$ menurut [Uji Turunan Pertama](article:monotonic-functions-and-the-first-derivative-test#first-derivative-test). Bagian 2 serupa. ∎

*Bagian 3.* Ambil $y=x^4$, $y=-x^4$, dan $y=x^3$. Pada masing-masingnya turunan pertama dan kedua nol di $x=0$. Namun $x^4$ memiliki minimum lokal di sana, $-x^4$ memiliki maksimum lokal, dan $x^3$ naik pada setiap selang terbuka di sekitar $0$ dan tidak memiliki keduanya. Uji ini tidak dapat membedakannya.

Uji ini memerlukan $f''$ hanya di $c$ sendiri, yang membuatnya mudah diterapkan: satu bilangan menjawab pertanyaan. Harganya adalah ujinya tidak meyakinkan ketika $f''(c)=0$ atau ketika $f''$ tidak ada di $c$ (seperti $x^{2/3}$ di titik puncaknya); maka dipakai Uji Turunan Pertama. Pilih satu kasus di bawah dan baca kedua uji berdampingan.`,
          ),
        },
        { kind: 'widget', name: 'secondtest' },
      ],
    },

    /* ----------------------------------------------------------------------- sketching */
    {
      id: 'curve-sketching',
      heading: L('How do you sketch the graph of a function?', 'Bagaimana menggambar grafik suatu fungsi?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To sketch $y=f(x)$, collect what $f$, $f'$ and $f''$ say and combine it: where the graph rises and falls, how it bends, where it turns, and what it approaches.**

**Procedure for graphing $y=f(x)$.**
1. Identify the domain of $f$ and any symmetries the curve may have.
2. Find the derivatives $y'$ and $y''$.
3. Find the critical points of $f$, if any, and identify the behavior of $f$ at each one.
4. Find where the curve is increasing and where it is decreasing.
5. Find the points of inflection, if any, and determine the concavity of the curve.
6. Identify any asymptotes that may exist.
7. Plot key points, such as the intercepts and the points found in steps 3 to 5, and sketch the curve together with any asymptotes.

**Asymptotes.** The line $x=a$ is a *vertical asymptote* if $f(x)\to\pm\infty$ as $x\to a$ from one side or both, which for a rational function happens where the denominator is zero and the numerator is not. The line $y=L$ is a *horizontal asymptote* if $f(x)\to L$ as $x\to\infty$ or $x\to-\infty$. An *oblique asymptote* $y=mx+b$ appears when $f(x)-(mx+b)\to0$; for a rational function it is what long division leaves when the numerator is one degree higher than the denominator. A graph may cross a horizontal or oblique asymptote at finite values of $x$; what it does is approach it at the ends.

**Example 8.** Sketch $f(x)=x^4-4x^3+10$. It is continuous with domain the whole line. The derivative $f'(x)=4x^3-12x^2=4x^2(x-3)$ is zero at $x=0$ and $x=3$, with signs $-,-,+$: so $f$ decreases on $(-\infty,3]$ and increases on $[3,\infty)$, there is no extreme value at $0$ and a local minimum $f(3)=-17$ at $3$. The second derivative $f''(x)=12x^2-24x=12x(x-2)$ is zero at $0$ and $2$, with signs $+,-,+$: the graph is concave up on $(-\infty,0)$, concave down on $(0,2)$ and concave up on $(2,\infty)$, with inflection points $(0,10)$ and $(2,-6)$. The curve cuts the $y$-axis at $10$. Notice that $x=0$ is a critical point *and* an inflection point, where the curve flattens out while still falling.

Now try the procedure on any function below, or on the textbook's five graphed examples. The tool follows the seven steps and draws the result: dark where $f$ rises, orange where it falls, orange dots at local extremes, black dots at inflection points and dashed lines for asymptotes.`,
            T`**Untuk menggambar $y=f(x)$, kumpulkan apa yang dikatakan $f$, $f'$, dan $f''$ dan gabungkan: di mana grafik naik dan turun, bagaimana ia melengkung, di mana ia berbalik, dan apa yang didekatinya.**

**Prosedur menggambar $y=f(x)$.**
1. Tentukan domain $f$ dan simetri yang mungkin dimiliki kurva.
2. Cari turunan $y'$ dan $y''$.
3. Cari titik kritis $f$, jika ada, dan tentukan perilaku $f$ di masing-masingnya.
4. Cari di mana kurva naik dan di mana turun.
5. Cari titik belok, jika ada, dan tentukan kecekungan kurva.
6. Tentukan asimtot yang mungkin ada.
7. Gambar titik penting, seperti perpotongan dan titik-titik dari langkah 3 sampai 5, dan sketsakan kurva bersama asimtotnya.

**Asimtot.** Garis $x=a$ adalah *asimtot tegak* jika $f(x)\to\pm\infty$ ketika $x\to a$ dari satu sisi atau kedua sisi, yang untuk fungsi rasional terjadi di tempat penyebut nol dan pembilang tidak. Garis $y=L$ adalah *asimtot mendatar* jika $f(x)\to L$ ketika $x\to\infty$ atau $x\to-\infty$. *Asimtot miring* $y=mx+b$ muncul ketika $f(x)-(mx+b)\to0$; untuk fungsi rasional itu adalah sisa pembagian panjang ketika pembilang berderajat satu lebih tinggi daripada penyebut. Grafik boleh memotong asimtot mendatar atau miring di nilai $x$ terhingga; yang dilakukannya adalah mendekatinya di ujung.

**Contoh 8.** Gambarlah $f(x)=x^4-4x^3+10$. Fungsi ini kontinu dengan domain seluruh garis. Turunan $f'(x)=4x^3-12x^2=4x^2(x-3)$ nol di $x=0$ dan $x=3$, dengan tanda $-,-,+$: jadi $f$ turun pada $(-\infty,3]$ dan naik pada $[3,\infty)$, tidak ada nilai ekstrem di $0$ dan ada minimum lokal $f(3)=-17$ di $3$. Turunan kedua $f''(x)=12x^2-24x=12x(x-2)$ nol di $0$ dan $2$, dengan tanda $+,-,+$: grafik cekung ke atas pada $(-\infty,0)$, cekung ke bawah pada $(0,2)$, dan cekung ke atas pada $(2,\infty)$, dengan titik belok $(0,10)$ dan $(2,-6)$. Kurva memotong sumbu $y$ di $10$. Perhatikan bahwa $x=0$ adalah titik kritis *dan* titik belok, tempat kurva mendatar sambil tetap turun.

Sekarang coba prosedur ini pada fungsi apa pun di bawah, atau pada lima contoh grafik di buku. Alatnya mengikuti tujuh langkah dan menggambar hasilnya: gelap saat $f$ naik, oranye saat turun, titik oranye di ekstrem lokal, titik hitam di titik belok, dan garis putus-putus untuk asimtot.`,
          ),
        },
        { kind: 'widget', name: 'sketchtool' },
      ],
    },

    /* -------------------------------------------------------------------- sketch examples */
    {
      id: 'sketch-examples',
      heading: L('What do the sketches of rational, exponential and trigonometric functions look like?', 'Seperti apa sketsa fungsi rasional, eksponensial, dan trigonometri?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Four more graphs show the steps with asymptotes, a break, symmetry and a trigonometric term.**

**Example 9: $f(x)=\frac{(x+1)^2}{1+x^2}$.** The domain is the whole line, with no symmetry. Since $f(x)=1+\frac{2x}{1+x^2}$,
$$f'(x)=\frac{2(1-x^2)}{(1+x^2)^2}\qquad f''(x)=\frac{4x(x^2-3)}{(1+x^2)^3}.$$
The critical points are $x=\pm1$. Since $f''(-1)=1>0$ there is a local minimum $f(-1)=0$, and since $f''(1)=-1<0$ a local maximum $f(1)=2$. The sign of $f'$ is $-,+,-$, so $f$ decreases, increases, then decreases again. The denominator of $f''$ is always positive, and the numerator is zero at $-\sqrt3$, $0$ and $\sqrt3$ with signs $-,+,-,+$: each is an inflection point, $\left(-\sqrt3,1-\frac{\sqrt3}2\right)$, $(0,1)$ and $\left(\sqrt3,1+\frac{\sqrt3}2\right)$, with the graph concave down, up, down, up. Dividing by $x^2$ shows $f(x)\to1$ as $x\to\pm\infty$: the line $y=1$ is a horizontal asymptote, and there is no vertical one. The graph meets its asymptote at $x=0$ and approaches it from below on the left, concave down, and from above on the right, concave up.

**Example 10: $f(x)=\frac{x^2+4}{2x}=\frac x2+\frac2x$.** The domain is $x\neq0$, there are no intercepts, and $f(-x)=-f(x)$: an odd function, symmetric about the origin. The derivatives are
$$f'(x)=\frac12-\frac2{x^2}=\frac{x^2-4}{2x^2}\qquad f''(x)=\frac4{x^3}.$$
The critical points $x=\pm2$ give a local maximum $f(-2)=-2$ and a local minimum $f(2)=2$, from the sign of $f''$. The function increases on $(-\infty,-2)$, decreases on $(-2,0)$ and $(0,2)$, and increases on $(2,\infty)$. The second derivative is negative for $x<0$ and positive for $x>0$ and never zero, so there is no inflection point. Because $\frac2x\to\pm\infty$ as $x\to0^\pm$, the $y$-axis is a vertical asymptote, and because $f(x)-\frac x2=\frac2x\to0$ at both ends, $y=\frac x2$ is an oblique asymptote.

**Example 11: $f(x)=e^{2/x}$.** The domain is $x\neq0$ and there is no symmetry. The derivatives are
$$f'(x)=-\frac{2e^{2/x}}{x^2}\qquad f''(x)=\frac{4(x+1)e^{2/x}}{x^4}.$$
Since $f'<0$ everywhere on its domain, the graph decreases on $(-\infty,0)$ and on $(0,\infty)$. The second derivative has the sign of $x+1$, so it changes sign at $x=-1$: the point $\left(-1,e^{-2}\right)$ is an inflection point, with concave down to the left of it and concave up after. As $x\to0^+$, $\frac2x\to\infty$ and $f\to\infty$: the $y$-axis is a vertical asymptote. From the left $f\to0$. As $x\to\pm\infty$, $\frac2x\to0$ and $f\to1$, so $y=1$ is a horizontal asymptote. $f$ is never $0$, and it has no absolute extremes.

**Example 12: $f(x)=\cos x-\frac{\sqrt2}2x$ on $0\le x\le2\pi$.** Here $f'(x)=-\sin x-\frac{\sqrt2}2$ is zero where $\sin x=-\frac{\sqrt2}2$, at $x=\frac{5\pi}4$ and $x=\frac{7\pi}4$. Since $f''(x)=-\cos x$, $f''\left(\frac{5\pi}4\right)=\frac{\sqrt2}2>0$ gives a local minimum $f\left(\frac{5\pi}4\right)\approx-3.48$, and $f''\left(\frac{7\pi}4\right)=-\frac{\sqrt2}2<0$ a local maximum $f\left(\frac{7\pi}4\right)\approx-3.18$. The second derivative is zero at $\frac\pi2$ and $\frac{3\pi}2$ and changes sign there: inflection points $\left(\frac\pi2,-1.11\right)$ and $\left(\frac{3\pi}2,-3.33\right)$. At the ends $f(0)=1$ and $f(2\pi)\approx-3.44$, so on this closed interval the absolute maximum is $f(0)=1$ and the absolute minimum is $f\left(\frac{5\pi}4\right)\approx-3.48$.`,
            T`**Empat grafik lagi menunjukkan langkah-langkahnya dengan asimtot, putus, simetri, dan suku trigonometri.**

**Contoh 9: $f(x)=\frac{(x+1)^2}{1+x^2}$.** Domainnya seluruh garis, tanpa simetri. Karena $f(x)=1+\frac{2x}{1+x^2}$,
$$f'(x)=\frac{2(1-x^2)}{(1+x^2)^2}\qquad f''(x)=\frac{4x(x^2-3)}{(1+x^2)^3}.$$
Titik kritisnya $x=\pm1$. Karena $f''(-1)=1>0$ ada minimum lokal $f(-1)=0$, dan karena $f''(1)=-1<0$ ada maksimum lokal $f(1)=2$. Tanda $f'$ adalah $-,+,-$, sehingga $f$ turun, naik, lalu turun lagi. Penyebut $f''$ selalu positif, dan pembilangnya nol di $-\sqrt3$, $0$, dan $\sqrt3$ dengan tanda $-,+,-,+$: masing-masing titik belok, $\left(-\sqrt3,1-\frac{\sqrt3}2\right)$, $(0,1)$, dan $\left(\sqrt3,1+\frac{\sqrt3}2\right)$, dengan grafik cekung ke bawah, atas, bawah, atas. Membagi dengan $x^2$ menunjukkan $f(x)\to1$ ketika $x\to\pm\infty$: garis $y=1$ adalah asimtot mendatar, dan tidak ada asimtot tegak. Grafik menemui asimtotnya di $x=0$ dan mendekatinya dari bawah di kiri, cekung ke bawah, dan dari atas di kanan, cekung ke atas.

**Contoh 10: $f(x)=\frac{x^2+4}{2x}=\frac x2+\frac2x$.** Domainnya $x\neq0$, tidak ada perpotongan, dan $f(-x)=-f(x)$: fungsi ganjil, simetris terhadap titik asal. Turunannya
$$f'(x)=\frac12-\frac2{x^2}=\frac{x^2-4}{2x^2}\qquad f''(x)=\frac4{x^3}.$$
Titik kritis $x=\pm2$ memberi maksimum lokal $f(-2)=-2$ dan minimum lokal $f(2)=2$, dari tanda $f''$. Fungsi naik pada $(-\infty,-2)$, turun pada $(-2,0)$ dan $(0,2)$, dan naik pada $(2,\infty)$. Turunan kedua negatif untuk $x<0$ dan positif untuk $x>0$ dan tidak pernah nol, sehingga tidak ada titik belok. Karena $\frac2x\to\pm\infty$ ketika $x\to0^\pm$, sumbu $y$ adalah asimtot tegak, dan karena $f(x)-\frac x2=\frac2x\to0$ di kedua ujung, $y=\frac x2$ adalah asimtot miring.

**Contoh 11: $f(x)=e^{2/x}$.** Domainnya $x\neq0$ dan tidak ada simetri. Turunannya
$$f'(x)=-\frac{2e^{2/x}}{x^2}\qquad f''(x)=\frac{4(x+1)e^{2/x}}{x^4}.$$
Karena $f'<0$ di seluruh domain, grafik turun pada $(-\infty,0)$ dan pada $(0,\infty)$. Turunan kedua bertanda sama dengan $x+1$, sehingga berganti tanda di $x=-1$: titik $\left(-1,e^{-2}\right)$ adalah titik belok, cekung ke bawah di kirinya dan cekung ke atas setelahnya. Ketika $x\to0^+$, $\frac2x\to\infty$ dan $f\to\infty$: sumbu $y$ adalah asimtot tegak. Dari kiri $f\to0$. Ketika $x\to\pm\infty$, $\frac2x\to0$ dan $f\to1$, sehingga $y=1$ adalah asimtot mendatar. $f$ tidak pernah $0$, dan tidak memiliki ekstrem mutlak.

**Contoh 12: $f(x)=\cos x-\frac{\sqrt2}2x$ pada $0\le x\le2\pi$.** Di sini $f'(x)=-\sin x-\frac{\sqrt2}2$ nol di tempat $\sin x=-\frac{\sqrt2}2$, yaitu $x=\frac{5\pi}4$ dan $x=\frac{7\pi}4$. Karena $f''(x)=-\cos x$, $f''\left(\frac{5\pi}4\right)=\frac{\sqrt2}2>0$ memberi minimum lokal $f\left(\frac{5\pi}4\right)\approx-3{,}48$, dan $f''\left(\frac{7\pi}4\right)=-\frac{\sqrt2}2<0$ maksimum lokal $f\left(\frac{7\pi}4\right)\approx-3{,}18$. Turunan kedua nol di $\frac\pi2$ dan $\frac{3\pi}2$ dan berganti tanda di sana: titik belok $\left(\frac\pi2,-1{,}11\right)$ dan $\left(\frac{3\pi}2,-3{,}33\right)$. Di ujung $f(0)=1$ dan $f(2\pi)\approx-3{,}44$, sehingga pada selang tertutup ini maksimum mutlaknya $f(0)=1$ dan minimum mutlaknya $f\left(\frac{5\pi}4\right)\approx-3{,}48$.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------------ reading graphs */
    {
      id: 'reading-graphs',
      heading: L('How do f, f′ and f″ fit together, and what can they decide?', 'Bagaimana f, f′, dan f″ saling melengkapi, dan apa yang dapat diputuskannya?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The first derivative says where the graph rises and falls and where it turns; the second says how it bends; and together with the asymptotes and a few points they fix the picture.** The signs combine like this:

| What is known | What the graph does |
|---|---|
| $f'>0$ | rises from left to right |
| $f'<0$ | falls from left to right |
| $f''>0$ | concave up throughout, no waves |
| $f''<0$ | concave down throughout, no waves |
| $f''$ changes sign at a point with a tangent | point of inflection |
| $f'$ changes sign | local maximum or local minimum |
| $f'=0$ and $f''<0$ | local maximum |
| $f'=0$ and $f''>0$ | local minimum |

The same facts answer questions about the constants in a formula.

**Quadratics and cubics.** For a parabola $y=ax^2+bx+c$ with $a\neq0$, $y'=2ax+b$ is zero at $x=-\frac b{2a}$, the vertex, and $y''=2a$ never changes sign: concave up if $a>0$, down if $a<0$, and a quadratic curve never has an inflection point. For a cubic $y=ax^3+bx^2+cx+d$, $y''=6ax+2b$ is zero at exactly one point, $x=-\frac b{3a}$, and changes sign there: *every cubic has exactly one inflection point*. If it has to be at $x=1$ for $y=x^3+bx^2+cx+d$, then $6+2b=0$ and $b=-3$.

**Finding constants.** For which $a$, $b$, $c$ does $y=ax^3+bx^2+cx$ have a local maximum at $x=3$, a local minimum at $x=-1$ and an inflection point at $(1,11)$? The inflection at $x=1$ needs $y''(1)=6a+2b=0$, so $b=-3a$. Then $y'=3ax^2+2bx+c$ with $y'(3)=27a+6b+c=0$ gives $c=-9a$, and $y'(-1)=3a-2b+c=0$ holds automatically. The point $(1,11)$ needs $a+b+c=-11a=11$, so $a=-1$, $b=3$, $c=9$, and $y=-x^3+3x^2+9x$. Check: $y''=-6x+6$ is $-12<0$ at $3$ (a maximum $y(3)=27$) and $12>0$ at $-1$ (a minimum $y(-1)=-5$).

**Given only $f''$.** If $y''=(x+1)(x-2)$, the sign of $y''$ is $+,-,+$ with changes at $x=-1$ and $x=2$: those are the inflection points, with no need to know $f$.`,
            T`**Turunan pertama menyatakan di mana grafik naik dan turun dan di mana ia berbalik; turunan kedua menyatakan bagaimana ia melengkung; dan bersama asimtot dan beberapa titik keduanya menetapkan gambarnya.** Tandanya bergabung seperti ini:

| Yang diketahui | Yang dilakukan grafik |
|---|---|
| $f'>0$ | naik dari kiri ke kanan |
| $f'<0$ | turun dari kiri ke kanan |
| $f''>0$ | cekung ke atas di seluruhnya, tanpa gelombang |
| $f''<0$ | cekung ke bawah di seluruhnya, tanpa gelombang |
| $f''$ berganti tanda di titik yang memiliki garis singgung | titik belok |
| $f'$ berganti tanda | maksimum lokal atau minimum lokal |
| $f'=0$ dan $f''<0$ | maksimum lokal |
| $f'=0$ dan $f''>0$ | minimum lokal |

Fakta yang sama menjawab pertanyaan tentang konstanta dalam rumus.

**Kuadrat dan kubik.** Untuk parabola $y=ax^2+bx+c$ dengan $a\neq0$, $y'=2ax+b$ nol di $x=-\frac b{2a}$, puncaknya, dan $y''=2a$ tidak pernah berganti tanda: cekung ke atas jika $a>0$, ke bawah jika $a<0$, dan kurva kuadrat tidak pernah memiliki titik belok. Untuk kubik $y=ax^3+bx^2+cx+d$, $y''=6ax+2b$ nol di tepat satu titik, $x=-\frac b{3a}$, dan berganti tanda di sana: *setiap kubik memiliki tepat satu titik belok*. Jika titik itu harus di $x=1$ untuk $y=x^3+bx^2+cx+d$, maka $6+2b=0$ dan $b=-3$.

**Mencari konstanta.** Untuk $a$, $b$, $c$ berapa $y=ax^3+bx^2+cx$ memiliki maksimum lokal di $x=3$, minimum lokal di $x=-1$, dan titik belok di $(1,11)$? Titik belok di $x=1$ memerlukan $y''(1)=6a+2b=0$, sehingga $b=-3a$. Maka $y'=3ax^2+2bx+c$ dengan $y'(3)=27a+6b+c=0$ memberi $c=-9a$, dan $y'(-1)=3a-2b+c=0$ berlaku dengan sendirinya. Titik $(1,11)$ memerlukan $a+b+c=-11a=11$, sehingga $a=-1$, $b=3$, $c=9$, dan $y=-x^3+3x^2+9x$. Periksa: $y''=-6x+6$ adalah $-12<0$ di $3$ (maksimum $y(3)=27$) dan $12>0$ di $-1$ (minimum $y(-1)=-5$).

**Hanya diberi $f''$.** Jika $y''=(x+1)(x-2)$, tanda $y''$ adalah $+,-,+$ dengan perubahan di $x=-1$ dan $x=2$: itulah titik belok, tanpa perlu mengetahui $f$.`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------------- in code */
    {
      id: 'concavity-in-code',
      heading: L('How do you find concavity and inflection points in code?', 'Bagaimana mencari kecekungan dan titik belok dalam kode?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**In code, concavity is the same sign test as before, one derivative higher: find the points where $f''$ is zero or does not exist, read the sign of $f''$ at one point between each pair, and call a candidate an inflection point when the sign changes.** SymPy does it exactly with ´sp.solve_univariate_inequality(d2f > 0, x, relational=False)´ and the same with ´< 0´; the Second Derivative Test is one substitution, ´d2f.subs(x, c)´. Without a CAS, take midpoints, which is what the JavaScript and C++ programs do. For a numerical $f$ the second derivative is itself approximated by $\frac{f(c+h)-2f(c)+f(c-h)}{h^2}$, which needs a moderate $h$ because the numerator is a difference of nearly equal numbers.`,
            T`**Dalam kode, kecekungan adalah uji tanda yang sama seperti sebelumnya, satu turunan lebih tinggi: cari titik tempat $f''$ nol atau tidak ada, baca tanda $f''$ di satu titik di antara tiap pasangan, dan sebut kandidat titik belok ketika tandanya berganti.** SymPy melakukannya secara eksak dengan ´sp.solve_univariate_inequality(d2f > 0, x, relational=False)´ dan yang sama dengan ´< 0´; Uji Turunan Kedua adalah satu substitusi, ´d2f.subs(x, c)´. Tanpa CAS, ambil titik tengah, yang dilakukan program JavaScript dan C++. Untuk $f$ numerik turunan kedua sendiri didekati oleh $\frac{f(c+h)-2f(c)+f(c-h)}{h^2}$, yang memerlukan $h$ sedang karena pembilangnya selisih bilangan yang hampir sama.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python and SymPy: concavity, inflection points and the Second Derivative Test', 'Python dan SymPy: kecekungan, titik belok, dan Uji Turunan Kedua'),
          code: `import sympy as sp

x = sp.symbols('x', real=True)


def concavity_report(f):
    """Where the graph of f is concave up and down, its inflection points, and the Second Derivative Test."""
    df, d2f = sp.diff(f, x), sp.diff(f, x, 2)
    up = sp.solve_univariate_inequality(d2f > 0, x, relational=False)
    down = sp.solve_univariate_inequality(d2f < 0, x, relational=False)
    eps = sp.Rational(1, 10**6)
    inflections = [(c, f.subs(x, c)) for c in sorted(sp.solveset(sp.Eq(d2f, 0), x, sp.S.Reals), key=float)
                   if (up.contains(c - eps) and down.contains(c + eps)) or (down.contains(c - eps) and up.contains(c + eps))]
    second = {}
    for c in sorted(sp.solveset(sp.Eq(df, 0), x, sp.S.Reals), key=float):
        k = d2f.subs(x, c)
        second[c] = 'min' if k > 0 else 'max' if k < 0 else 'fails'
    return up, down, inflections, second


for f in (x**4 - 4 * x**3 + 10, (x + 1)**2 / (1 + x**2), x**3):
    print(f, '->', concavity_report(f))
# x**4 - 4*x**3 + 10 -> (Union(Interval.open(-oo, 0), Interval.open(2, oo)), Interval.open(0, 2), [(0, 10), (2, -6)], {0: 'fails', 3: 'min'})
# (x + 1)**2/(x**2 + 1) -> (Union(Interval.open(-sqrt(3), 0), Interval.open(sqrt(3), oo)), Union(Interval.open(-oo, -sqrt(3)), Interval.open(0, sqrt(3))), [(-sqrt(3), (1 - sqrt(3))**2/4), (0, 1), (sqrt(3), (1 + sqrt(3))**2/4)], {-1: 'min', 1: 'max'})
# x**3 -> (Interval.open(0, oo), Interval.open(-oo, 0), [(0, 0)], {0: 'fails'})`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: the signs of f″ and the two tests', 'JavaScript: tanda f″ dan kedua uji'),
          code: `// concavity between the candidates, and the verdict at each candidate: an inflection point when the bending changes
const bendChart = (d2, candidates, lo, hi) => {
  const edges = [lo, ...candidates, hi]
  const pieces = edges.slice(1).map((to, i) => [edges[i], to, d2((edges[i] + to) / 2) > 0 ? 'up' : 'down'])
  const inflections = candidates.filter((c, i) => pieces[i][2] !== pieces[i + 1][2])
  return { pieces, inflections }
}
// the Second Derivative Test at c, given f' and f'' as functions
const secondTest = (df, d2, c) => {
  if (Math.abs(df(c)) > 1e-9) return 'not critical'
  const k = d2(c)
  return Math.abs(k) < 1e-9 ? 'fails' : k > 0 ? 'min' : 'max'
}
const d2 = (x) => 12 * x * x - 24 * x                        // f(x) = x^4 - 4x^3 + 10
bendChart(d2, [0, 2], -2, 5)
// pieces [[-2,0,'up'], [0,2,'down'], [2,5,'up']]   inflections [0, 2]
const df = (x) => 4 * x ** 3 - 12 * x ** 2
secondTest(df, d2, 0)                                        // 'fails': f'(0) = f''(0) = 0 (the First Derivative Test: no extreme value)
secondTest(df, d2, 3)                                        // 'min': f''(3) = 36 > 0
bendChart((x) => 12 * x * x, [0], -2, 2)                     // x^4: pieces [[-2,0,'up'], [0,2,'up']]   inflections []: f'' = 0 at 0 but no inflection`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++', 'C++'),
          code: `#include <iostream>
#include <cstdio>
#include <cmath>
using namespace std;

double d2(double x) { return 12 * x * x - 24 * x; }       // f(x) = x^4 - 4x^3 + 10, f'' = 12x(x - 2)
double d1(double x) { return 4 * x * x * x - 12 * x * x; }

int main() {
  double edge[4];
  edge[0] = -2; edge[1] = 0; edge[2] = 2; edge[3] = 5;       // the ends and the places where f'' is zero
  int sign[3];
  for (int i = 0; i < 3; i++) {
    double mid = (edge[i] + edge[i + 1]) / 2;                // one test point in each interval
    sign[i] = d2(mid) > 0 ? 1 : -1;
    if (sign[i] > 0) printf("from %.1f to %.1f; f'' at %.2f is %.2f; concave up\\n", edge[i], edge[i + 1], mid, d2(mid));
    else printf("from %.1f to %.1f; f'' at %.2f is %.2f; concave down\\n", edge[i], edge[i + 1], mid, d2(mid));
  }
  for (int i = 0; i < 2; i++)                                // an inflection point where the bending changes
    if (sign[i] != sign[i + 1]) printf("x=%.1f inflection point\\n", edge[i + 1]);
    else printf("x=%.1f no inflection point\\n", edge[i + 1]);
  double crit[2];
  crit[0] = 0; crit[1] = 3;                                  // the zeros of f'
  for (int i = 0; i < 2; i++) {                              // the Second Derivative Test
    double k = d2(crit[i]);
    if (fabs(k) < 1e-9) printf("x=%.1f; f''=%.2f; the test fails\\n", crit[i], k);
    else if (k > 0) printf("x=%.1f; f''=%.2f; local minimum\\n", crit[i], k);
    else printf("x=%.1f; f''=%.2f; local maximum\\n", crit[i], k);
  }
  return 0;
}

/* output:
from -2.0 to 0.0; f'' at -1.00 is 36.00; concave up
from 0.0 to 2.0; f'' at 1.00 is -12.00; concave down
from 2.0 to 5.0; f'' at 3.50 is 63.00; concave up
x=0.0 inflection point
x=2.0 inflection point
x=0.0; f''=0.00; the test fails
x=3.0; f''=36.00; local minimum
*/`,
        },
      ],
    },

    /* ---------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where do inflection points and curve sketching come from?', 'Dari mana asal titik belok dan penggambaran kurva?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Studying the shape of a curve with derivatives began with the first rules of calculus and became a routine procedure by the 18th century.**

- **Leibniz, 1684.** In his first paper on the differential calculus, Gottfried Wilhelm Leibniz used the second differential to tell a maximum from a minimum, and noted that the second differential vanishes at an inflection point.
- **l'Hôpital, 1696.** Guillaume de l'Hôpital's textbook *Analyse des infiniment petits*, the first on the differential calculus, applies the method to find points of inflection and cusps of curves given by equations.
- **Maclaurin, 1742.** Colin Maclaurin's *Treatise of Fluxions* organised the tests for maxima, minima and inflection from the signs of the first and second fluxions, in the form still taught.
- **Euler, 1748.** Leonhard Euler's *Introductio in analysin infinitorum* studies curves by their asymptotes and branches, the part of the procedure that comes from algebra rather than from derivatives.
- **Today.** Graphing software draws the curve point by point; the sketching steps are still how one checks that a plot shows every extreme, every inflection and every asymptote.`,
            T`**Mempelajari bentuk kurva dengan turunan dimulai bersama aturan pertama kalkulus dan menjadi prosedur rutin pada abad ke-18.**

- **Leibniz, 1684.** Dalam makalah pertamanya tentang kalkulus diferensial, Gottfried Wilhelm Leibniz memakai diferensial kedua untuk membedakan maksimum dari minimum, dan mencatat bahwa diferensial kedua lenyap di titik belok.
- **l'Hôpital, 1696.** Buku teks Guillaume de l'Hôpital *Analyse des infiniment petits*, yang pertama tentang kalkulus diferensial, menerapkan metode itu untuk mencari titik belok dan titik puncak kurva yang diberikan oleh persamaan.
- **Maclaurin, 1742.** *Treatise of Fluxions* karya Colin Maclaurin menata uji maksimum, minimum, dan titik belok dari tanda fluksi pertama dan kedua, dalam bentuk yang masih diajarkan.
- **Euler, 1748.** *Introductio in analysin infinitorum* karya Leonhard Euler mempelajari kurva lewat asimtot dan cabangnya, bagian prosedur yang berasal dari aljabar dan bukan dari turunan.
- **Sekarang.** Perangkat lunak grafik menggambar kurva titik demi titik; langkah-langkah sketsa masih menjadi cara memeriksa bahwa suatu plot menunjukkan setiap ekstrem, setiap titik belok, dan setiap asimtot.`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What mistakes do people make with concavity?', 'Kesalahan apa yang sering terjadi pada kecekungan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with concavity and curve sketching are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ If $f''(c)=0$, there is an inflection point | $y=x^4$ has $y''(0)=0$ and is concave up on both sides: the sign must change. |
| ❌ At an inflection point $f''=0$ | $f''$ may not exist: $x^{5/3}$ and $\sqrt[3]{x}$ have inflection points at $0$ where $f''$ is undefined. |
| ❌ Concave up means increasing | $x^2$ is concave up and decreasing for $x<0$: concavity is about $f'$ rising, not about $f$. |
| ❌ $f''>0$ means $f>0$ | $f(x)=x^2-4$ has $f''=2>0$ and $f(0)=-4$. |
| ❌ If $f''(c)=0$ the Second Derivative Test says no extreme value | It says nothing: $x^4$ has a minimum, $-x^4$ a maximum and $x^3$ neither, all with $f''(0)=0$. |
| ❌ The test works where $f''$ does not exist | $x^{2/3}$ has a minimum at its cusp, but the test cannot be applied: use the First Derivative Test. |
| ❌ $\frac1x$ changes concavity at $0$, so $(0,0)$ is an inflection point | $0$ is not in the domain: there is no point of the graph there. |
| ❌ Find inflection points from $f'=0$ | $f'=0$ gives the critical points; inflection points come from $f''$. |
| ❌ A graph can never cross its asymptote | $f(x)=\frac{(x+1)^2}{1+x^2}$ meets its asymptote $y=1$ at $x=0$ and still approaches it at both ends. |`,
            T`**Kesalahan paling umum pada kecekungan dan penggambaran kurva adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ Jika $f''(c)=0$, ada titik belok | $y=x^4$ memiliki $y''(0)=0$ dan cekung ke atas di kedua sisi: tandanya harus berganti. |
| ❌ Di titik belok $f''=0$ | $f''$ mungkin tidak ada: $x^{5/3}$ dan $\sqrt[3]{x}$ memiliki titik belok di $0$ tempat $f''$ tak terdefinisi. |
| ❌ Cekung ke atas berarti naik | $x^2$ cekung ke atas dan turun untuk $x<0$: kecekungan menyangkut $f'$ yang naik, bukan $f$. |
| ❌ $f''>0$ berarti $f>0$ | $f(x)=x^2-4$ memiliki $f''=2>0$ dan $f(0)=-4$. |
| ❌ Jika $f''(c)=0$ Uji Turunan Kedua menyatakan tidak ada nilai ekstrem | Ia tidak menyatakan apa pun: $x^4$ memiliki minimum, $-x^4$ maksimum, dan $x^3$ tidak keduanya, semuanya dengan $f''(0)=0$. |
| ❌ Uji ini bekerja di tempat $f''$ tidak ada | $x^{2/3}$ memiliki minimum di titik puncaknya, tetapi uji tidak dapat diterapkan: pakai Uji Turunan Pertama. |
| ❌ $\frac1x$ mengubah kecekungan di $0$, jadi $(0,0)$ titik belok | $0$ tidak berada di domain: tidak ada titik grafik di sana. |
| ❌ Mencari titik belok dari $f'=0$ | $f'=0$ memberi titik kritis; titik belok berasal dari $f''$. |
| ❌ Grafik tidak pernah memotong asimtotnya | $f(x)=\frac{(x+1)^2}{1+x^2}$ menemui asimtotnya $y=1$ di $x=0$ dan tetap mendekatinya di kedua ujung. |`,
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
              L(T`If $f''>0$ on an interval, the graph of $f$ is concave up there.`, T`Jika $f''>0$ pada suatu selang, grafik $f$ cekung ke atas di sana.`),
              L(T`If $f''(c)=0$, the graph has an inflection point at $c$.`, T`Jika $f''(c)=0$, grafik memiliki titik belok di $c$.`),
              L(T`An inflection point can occur where $f''$ does not exist.`, T`Titik belok dapat terjadi di tempat $f''$ tidak ada.`),
              L(T`A graph can be concave up and decreasing at the same time.`, T`Grafik dapat cekung ke atas dan turun sekaligus.`),
              L(T`The Second Derivative Test settles every critical point where $f''$ exists.`, T`Uji Turunan Kedua menyelesaikan setiap titik kritis tempat $f''$ ada.`),
              L(T`Every cubic polynomial has exactly one inflection point.`, T`Setiap polinom kubik memiliki tepat satu titik belok.`),
            ],
            answer: [true, false, true, true, false, true],
            explain: L(
              T`$x^4$ has $f''(0)=0$ and no inflection. $x^{5/3}$ has one where $f''$ is undefined. $x^2$ is concave up and decreasing for $x<0$. The test fails when $f''(c)=0$. A cubic has $y''=6ax+2b$, with one sign change.`,
              T`$x^4$ memiliki $f''(0)=0$ dan bukan titik belok. $x^{5/3}$ memilikinya di tempat $f''$ tak terdefinisi. $x^2$ cekung ke atas dan turun untuk $x<0$. Uji gagal ketika $f''(c)=0$. Kubik memiliki $y''=6ax+2b$, dengan satu pergantian tanda.`,
            ),
            hint: L(T`Remember $x^4$, $x^{5/3}$ and $x^2$ on the left of $0$.`, T`Ingat $x^4$, $x^{5/3}$, dan $x^2$ di kiri $0$.`),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L(T`Choose **all** the points of inflection (at the given point).`, T`Pilih **semua** titik belok (di titik yang diberikan).`),
            options: [
              L(T`$x^3$ at $0$`, T`$x^3$ di $0$`),
              L(T`$x^4$ at $0$`, T`$x^4$ di $0$`),
              L(T`$\sqrt[3]{x}$ at $0$`, T`$\sqrt[3]{x}$ di $0$`),
              L(T`$x^{2/3}$ at $0$`, T`$x^{2/3}$ di $0$`),
              L(T`$3+\sin x$ at $\pi$`, T`$3+\sin x$ di $\pi$`),
              L(T`$x^2$ at $0$`, T`$x^2$ di $0$`),
            ],
            answer: [0, 2, 4],
            explain: L(
              T`$x^3$, $\sqrt[3]{x}$ (a vertical tangent) and $3+\sin x$ at $\pi$ change concavity at a tangent line. $x^4$ and $x^2$ stay concave up, and $x^{2/3}$ stays concave down and has a cusp.`,
              T`$x^3$, $\sqrt[3]{x}$ (garis singgung tegak), dan $3+\sin x$ di $\pi$ mengubah kecekungan pada garis singgung. $x^4$ dan $x^2$ tetap cekung ke atas, dan $x^{2/3}$ tetap cekung ke bawah dan memiliki titik puncak.`,
            ),
            hint: L(T`Does the sign of $f''$ change, and is there a tangent line?`, T`Apakah tanda $f''$ berganti, dan adakah garis singgung?`),
          },
        },
        {
          kind: 'activity',
          title: L('An inflection point', 'Sebuah titik belok'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L(T`$f'(x)=3x^2-6x$ and $f''(x)=6x-6$.`, T`$f'(x)=3x^2-6x$ dan $f''(x)=6x-6$.`), L(T`Solve $6x-6=0$.`, T`Selesaikan $6x-6=0$.`)],
            explain: L(T`$f''(x)=6x-6$ changes sign at $x=1$, so $(1,0)$ is the inflection point.`, T`$f''(x)=6x-6$ berganti tanda di $x=1$, sehingga $(1,0)$ adalah titik belok.`),
            prompt: L(T`Find the $x$-coordinate of the inflection point of $f(x)=x^3-3x^2+2$.`, T`Tentukan absis titik belok $f(x)=x^3-3x^2+2$.`),
            given: String.raw`x=v`,
            blanks: [{ label: 'x =', answer: 1 }],
          },
        },
        {
          kind: 'activity',
          title: L('A local minimum by the second derivative', 'Minimum lokal dengan turunan kedua'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L(T`$f'(x)=4x^3-12x^2=4x^2(x-3)$, zero at $0$ and $3$.`, T`$f'(x)=4x^3-12x^2=4x^2(x-3)$, nol di $0$ dan $3$.`), L(T`$f''(3)=12\cdot3\cdot1=36>0$, so the minimum is at $3$: $f(3)=81-108+10$.`, T`$f''(3)=12\cdot3\cdot1=36>0$, sehingga minimum di $3$: $f(3)=81-108+10$.`)],
            explain: L(T`$f''(3)=36>0$ gives a local minimum, $f(3)=-17$. At $0$, $f''(0)=0$ and the test fails.`, T`$f''(3)=36>0$ memberi minimum lokal, $f(3)=-17$. Di $0$, $f''(0)=0$ dan uji gagal.`),
            prompt: L(T`Find the local minimum value of $f(x)=x^4-4x^3+10$.`, T`Tentukan nilai minimum lokal $f(x)=x^4-4x^3+10$.`),
            given: String.raw`f_{\min}=v`,
            blanks: [{ label: 'f =', answer: -17 }],
          },
        },
        {
          kind: 'activity',
          title: L('When the test fails', 'Ketika uji gagal'),
          step: {
            kind: 'quiz',
            id: 'p5',
            prompt: L(T`$f(x)=x^4$ has $f'(0)=0$ and $f''(0)=0$. What does the Second Derivative Test say?`, T`$f(x)=x^4$ memiliki $f'(0)=0$ dan $f''(0)=0$. Apa yang dinyatakan Uji Turunan Kedua?`),
            options: [
              L('nothing: the test fails, and the First Derivative Test is needed', 'tidak ada: ujinya gagal, dan Uji Turunan Pertama diperlukan'),
              L('a local minimum', 'minimum lokal'),
              L('no extreme value', 'tidak ada nilai ekstrem'),
              L('an inflection point', 'sebuah titik belok'),
            ],
            answer: 0,
            explain: L(T`$f''(0)=0$ makes the test inconclusive. The First Derivative Test then finds a local minimum, since $f'=4x^3$ goes from negative to positive.`, T`$f''(0)=0$ membuat uji tidak meyakinkan. Uji Turunan Pertama kemudian menemukan minimum lokal, karena $f'=4x^3$ berubah dari negatif ke positif.`),
            hint: L(T`What does the theorem say in part 3?`, T`Apa yang dinyatakan teorema pada bagian 3?`),
          },
        },
        {
          kind: 'activity',
          title: L('A cubic with an inflection at 1', 'Kubik dengan titik belok di 1'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L(T`$y''=6x+2b$.`, T`$y''=6x+2b$.`), L(T`$y''(1)=6+2b=0$.`, T`$y''(1)=6+2b=0$.`)],
            explain: L(T`$6+2b=0$ gives $b=-3$.`, T`$6+2b=0$ memberi $b=-3$.`),
            prompt: L(T`For which $b$ does $y=x^3+bx^2+cx+d$ have a point of inflection at $x=1$?`, T`Untuk $b$ berapa $y=x^3+bx^2+cx+d$ memiliki titik belok di $x=1$?`),
            given: String.raw`b=v`,
            blanks: [{ label: 'b =', answer: -3 }],
          },
        },
        {
          kind: 'activity',
          title: L('Speeding up or slowing down', 'Bertambah cepat atau melambat'),
          step: {
            kind: 'quiz',
            id: 'p7',
            prompt: L(T`A particle has $v>0$ and $a<0$. What is it doing?`, T`Sebuah partikel memiliki $v>0$ dan $a<0$. Apa yang dilakukannya?`),
            options: [
              L('moving right and slowing down', 'bergerak ke kanan dan melambat'),
              L('moving right and speeding up', 'bergerak ke kanan dan bertambah cepat'),
              L('moving left and slowing down', 'bergerak ke kiri dan melambat'),
              L('moving left and speeding up', 'bergerak ke kiri dan bertambah cepat'),
            ],
            answer: 0,
            explain: L(T`$v>0$ means to the right, and the acceleration points the other way, so the speed falls.`, T`$v>0$ berarti ke kanan, dan percepatan menuju arah lain, sehingga lajunya berkurang.`),
            hint: L(T`Compare the signs of $v$ and $a$.`, T`Bandingkan tanda $v$ dan $a$.`),
          },
        },
        {
          kind: 'activity',
          title: L('When the acceleration is zero', 'Ketika percepatan nol'),
          step: {
            kind: 'math',
            id: 'p8',
            hints: [L(T`$v=s'=3t^2-12t+9$.`, T`$v=s'=3t^2-12t+9$.`), L(T`$a=s''=6t-12=0$.`, T`$a=s''=6t-12=0$.`)],
            explain: L(T`$a(t)=6t-12$ is zero at $t=2$, where the position graph has its inflection point.`, T`$a(t)=6t-12$ nol di $t=2$, tempat grafik posisi memiliki titik beloknya.`),
            prompt: L(T`A particle has position $s(t)=t^3-6t^2+9t$. At which time $t>0$ is its acceleration zero?`, T`Sebuah partikel memiliki posisi $s(t)=t^3-6t^2+9t$. Pada waktu $t>0$ berapa percepatannya nol?`),
            given: String.raw`t=v`,
            blanks: [{ label: 't =', answer: 2 }],
          },
        },
        {
          kind: 'activity',
          title: L('Asymptotes', 'Asimtot'),
          step: {
            kind: 'quiz',
            id: 'p9',
            prompt: L(T`What are the asymptotes of $f(x)=\frac{x^2+4}{2x}$?`, T`Apa asimtot $f(x)=\frac{x^2+4}{2x}$?`),
            options: [
              L(T`$x=0$ (vertical) and $y=\frac x2$ (oblique)`, T`$x=0$ (tegak) dan $y=\frac x2$ (miring)`),
              L(T`$x=0$ only`, T`hanya $x=0$`),
              L(T`$y=\frac12$ (horizontal)`, T`$y=\frac12$ (mendatar)`),
              L('none', 'tidak ada'),
            ],
            answer: 0,
            explain: L(T`$f(x)=\frac x2+\frac2x$: the term $\frac2x$ blows up at $0$ and vanishes at the ends, leaving the line $y=\frac x2$.`, T`$f(x)=\frac x2+\frac2x$: suku $\frac2x$ membesar tanpa batas di $0$ dan lenyap di ujung, menyisakan garis $y=\frac x2$.`),
            hint: L(T`Split the fraction into $\frac x2+\frac2x$.`, T`Pisahkan pecahan menjadi $\frac x2+\frac2x$.`),
          },
        },
        {
          kind: 'activity',
          title: L('A horizontal asymptote', 'Asimtot mendatar'),
          step: {
            kind: 'math',
            id: 'p10',
            hints: [L(T`Divide numerator and denominator by $x^2$.`, T`Bagi pembilang dan penyebut dengan $x^2$.`), L(T`$\frac{(1+\frac1x)^2}{\frac1{x^2}+1}\to\frac{1}{1}$.`, T`$\frac{(1+\frac1x)^2}{\frac1{x^2}+1}\to\frac{1}{1}$.`)],
            explain: L(T`$f(x)=\frac{(1+1/x)^2}{1/x^2+1}\to1$ as $x\to\pm\infty$: the line $y=1$.`, T`$f(x)=\frac{(1+1/x)^2}{1/x^2+1}\to1$ ketika $x\to\pm\infty$: garis $y=1$.`),
            prompt: L(T`Find $L$ so that $y=L$ is the horizontal asymptote of $f(x)=\frac{(x+1)^2}{1+x^2}$.`, T`Tentukan $L$ sehingga $y=L$ adalah asimtot mendatar $f(x)=\frac{(x+1)^2}{1+x^2}$.`),
            given: String.raw`L=v`,
            blanks: [{ label: 'L =', answer: 1 }],
          },
        },
        {
          kind: 'activity',
          title: L('An inflection point of an exponential', 'Titik belok sebuah eksponensial'),
          step: {
            kind: 'math',
            id: 'p11',
            hints: [L(T`$f'(x)=-\frac{2e^{2/x}}{x^2}$ and $f''(x)=\frac{4(x+1)e^{2/x}}{x^4}$.`, T`$f'(x)=-\frac{2e^{2/x}}{x^2}$ dan $f''(x)=\frac{4(x+1)e^{2/x}}{x^4}$.`), L(T`The factor $x+1$ changes sign.`, T`Faktor $x+1$ berganti tanda.`)],
            explain: L(T`$f''$ has the sign of $x+1$, so it changes sign at $x=-1$: the inflection point $\left(-1,e^{-2}\right)$.`, T`$f''$ bertanda sama dengan $x+1$, sehingga berganti tanda di $x=-1$: titik belok $\left(-1,e^{-2}\right)$.`),
            prompt: L(T`Find the $x$-coordinate of the inflection point of $f(x)=e^{2/x}$.`, T`Tentukan absis titik belok $f(x)=e^{2/x}$.`),
            given: String.raw`x=v`,
            blanks: [{ label: 'x =', answer: -1 }],
          },
        },
        {
          kind: 'activity',
          title: L('Finding a constant', 'Mencari sebuah konstanta'),
          step: {
            kind: 'math',
            id: 'p12',
            hints: [L(T`$y''=6ax+2b$, zero at $x=1$: $b=-3a$.`, T`$y''=6ax+2b$, nol di $x=1$: $b=-3a$.`), L(T`$y'(3)=0$ gives $c=-9a$, then $a+b+c=-11a=11$.`, T`$y'(3)=0$ memberi $c=-9a$, lalu $a+b+c=-11a=11$.`)],
            explain: L(T`$a=-1$, $b=3$, $c=9$: $y=-x^3+3x^2+9x$, with a maximum $27$ at $3$, a minimum $-5$ at $-1$ and the inflection point $(1,11)$.`, T`$a=-1$, $b=3$, $c=9$: $y=-x^3+3x^2+9x$, dengan maksimum $27$ di $3$, minimum $-5$ di $-1$, dan titik belok $(1,11)$.`),
            prompt: L(T`$y=ax^3+bx^2+cx$ has a local maximum at $x=3$, a local minimum at $x=-1$ and an inflection point at $(1,11)$. Find $a$.`, T`$y=ax^3+bx^2+cx$ memiliki maksimum lokal di $x=3$, minimum lokal di $x=-1$, dan titik belok di $(1,11)$. Tentukan $a$.`),
            given: String.raw`a=v`,
            blanks: [{ label: 'a =', answer: -1 }],
          },
        },
      ],
    },

    /* ---------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: concavity and curve sketching at a glance', 'Ringkasan: kecekungan dan penggambaran kurva sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Concavity:** concave up where $f'$ increases ($f''>0$), concave down where $f'$ decreases ($f''<0$).
- **Point of inflection:** a point with a tangent line where the concavity changes; $f''=0$ or does not exist there, but a zero of $f''$ alone is not enough.
- **Cases:** $x^3$ yes, $x^4$ no, $x^{5/3}$ and $\sqrt[3]{x}$ yes (with $f''$ undefined), $x^{2/3}$ no (a cusp).
- **Motion:** $a=s''$; speeding up when $v$ and $a$ agree in sign, slowing down when they differ.
- **Second Derivative Test:** $f'(c)=0$ and $f''(c)<0$ is a maximum, $f''(c)>0$ a minimum, $f''(c)=0$ fails; then use the First Derivative Test.
- **Curve sketching:** domain and symmetry, $f'$ and $f''$, critical points, rising and falling, inflection and concavity, asymptotes, key points.
- **Asymptotes:** vertical where $f\to\pm\infty$, horizontal and oblique from the ends; a graph can cross one.
- **Cubics:** exactly one inflection point, at $x=-\frac b{3a}$; parabolas have none.
- **Code:** ´sp.solve_univariate_inequality(d2f > 0, x, relational=False)´ and ´d2f.subs(x, c)´.`,
            T`- **Kecekungan:** cekung ke atas di tempat $f'$ naik ($f''>0$), cekung ke bawah di tempat $f'$ turun ($f''<0$).
- **Titik belok:** titik yang memiliki garis singgung dan tempat kecekungan berubah; $f''=0$ atau tidak ada di sana, tetapi nol $f''$ saja belum cukup.
- **Kasus:** $x^3$ ya, $x^4$ tidak, $x^{5/3}$ dan $\sqrt[3]{x}$ ya (dengan $f''$ tak terdefinisi), $x^{2/3}$ tidak (titik puncak).
- **Gerak:** $a=s''$; bertambah cepat ketika $v$ dan $a$ bertanda sama, melambat ketika berbeda.
- **Uji Turunan Kedua:** $f'(c)=0$ dan $f''(c)<0$ maksimum, $f''(c)>0$ minimum, $f''(c)=0$ gagal; lalu pakai Uji Turunan Pertama.
- **Penggambaran kurva:** domain dan simetri, $f'$ dan $f''$, titik kritis, naik dan turun, titik belok dan kecekungan, asimtot, titik penting.
- **Asimtot:** tegak di tempat $f\to\pm\infty$, mendatar dan miring dari ujung; grafik dapat memotong salah satunya.
- **Kubik:** tepat satu titik belok, di $x=-\frac b{3a}$; parabola tidak punya.
- **Kode:** ´sp.solve_univariate_inequality(d2f > 0, x, relational=False)´ dan ´d2f.subs(x, c)´.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Concave up', 'Cekung ke atas'), definition: L('A graph is concave up on an interval where its slope is increasing, which is where the second derivative is positive; it bends like a cup and lies above its tangent lines.', 'Grafik cekung ke atas pada selang tempat gradiennya naik, yaitu tempat turunan kedua positif; ia melengkung seperti cangkir dan berada di atas garis singgungnya.') },
    { term: L('Concave down', 'Cekung ke bawah'), definition: L('A graph is concave down on an interval where its slope is decreasing, which is where the second derivative is negative; it bends like a cap and lies below its tangent lines.', 'Grafik cekung ke bawah pada selang tempat gradiennya turun, yaitu tempat turunan kedua negatif; ia melengkung seperti topi dan berada di bawah garis singgungnya.') },
    { term: L('Point of inflection', 'Titik belok'), definition: L('A point of a graph that has a tangent line and where the concavity changes from up to down or from down to up.', 'Titik pada grafik yang memiliki garis singgung dan tempat kecekungan berubah dari atas ke bawah atau dari bawah ke atas.') },
    { term: L('Second Derivative Test', 'Uji Turunan Kedua'), definition: L('The test that classifies a critical point by the sign of the second derivative there: negative is a local maximum, positive a local minimum, zero is inconclusive.', 'Uji yang menggolongkan titik kritis menurut tanda turunan kedua di sana: negatif maksimum lokal, positif minimum lokal, nol tidak meyakinkan.') },
    { term: L('Asymptote', 'Asimtot'), definition: L('A line that the graph of a function approaches without bound: vertical where the function blows up, horizontal or oblique at the ends of the x-axis.', 'Garis yang didekati grafik fungsi tanpa batas: tegak di tempat fungsi membesar tanpa batas, mendatar atau miring di ujung sumbu x.') },
    { term: L('Curve sketching', 'Penggambaran kurva'), definition: L('Drawing the graph of a function from its domain, symmetry, first and second derivatives, critical points, inflection points, asymptotes and a few key points.', 'Menggambar grafik fungsi dari domain, simetri, turunan pertama dan kedua, titik kritis, titik belok, asimtot, dan beberapa titik penting.') },
  ],

  howTo: [
    {
      name: L('How to sketch the graph of a function', 'Cara menggambar grafik suatu fungsi'),
      description: L('Follow seven steps: domain and symmetry, derivatives, critical points, rising and falling, inflection and concavity, asymptotes, key points.', 'Ikuti tujuh langkah: domain dan simetri, turunan, titik kritis, naik dan turun, titik belok dan kecekungan, asimtot, titik penting.'),
      steps: [
        { name: L('Domain and symmetry', 'Domain dan simetri'), text: L('Find where the function is defined and whether it is even or odd.', 'Cari di mana fungsi terdefinisi dan apakah ia genap atau ganjil.') },
        { name: L('Derivatives and critical points', 'Turunan dan titik kritis'), text: L('Compute f prime and f double prime, find the critical points and classify them with a sign chart or the second derivative.', 'Hitung f aksen dan f aksen dua, cari titik kritis dan golongkan dengan bagan tanda atau turunan kedua.') },
        { name: L('Rising, falling and bending', 'Naik, turun, dan melengkung'), text: L('Read the sign of f prime for the intervals of increase and decrease and the sign of f double prime for the concavity and the inflection points.', 'Baca tanda f aksen untuk selang naik dan turun dan tanda f aksen dua untuk kecekungan dan titik belok.') },
        { name: L('Asymptotes and key points', 'Asimtot dan titik penting'), text: L('Find the vertical, horizontal and oblique asymptotes, plot the intercepts and the special points, and draw the curve through them.', 'Cari asimtot tegak, mendatar, dan miring, gambar perpotongan dan titik khusus, dan gambar kurva melaluinya.') },
      ],
    },
    {
      name: L('How to find the points of inflection of a function', 'Cara mencari titik belok suatu fungsi'),
      description: L('Find where the second derivative is zero or does not exist, then check that the concavity changes and that the graph has a tangent line.', 'Cari di mana turunan kedua nol atau tidak ada, lalu periksa bahwa kecekungan berubah dan grafik memiliki garis singgung.'),
      steps: [
        { name: L('Find the candidates', 'Cari kandidat'), text: L('Compute f double prime and list the points where it is zero or does not exist.', 'Hitung f aksen dua dan daftar titik tempat ia nol atau tidak ada.') },
        { name: L('Read the sign on both sides', 'Baca tanda di kedua sisi'), text: L('Evaluate f double prime at a point on each side of each candidate; a change of sign is needed.', 'Hitung f aksen dua di satu titik pada setiap sisi tiap kandidat; pergantian tanda diperlukan.') },
        { name: L('Check for a tangent line', 'Periksa garis singgung'), text: L('The graph must have a tangent line at the point, possibly vertical; a corner or a cusp is not a point of inflection.', 'Grafik harus memiliki garis singgung di titik itu, mungkin tegak; sudut atau titik puncak bukan titik belok.') },
        { name: L('Report the point', 'Laporkan titiknya'), text: L('Give both coordinates, computing the value of the function at the candidate.', 'Beri kedua koordinatnya, dengan menghitung nilai fungsi di kandidat itu.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What does concave up mean?', 'Apa arti cekung ke atas?'),
      a: L(
        'A graph is concave up on an interval when its slope is increasing there, so it bends like a cup and lies above its tangent lines. For a twice-differentiable function this is the same as the second derivative being positive on the interval.',
        'Grafik cekung ke atas pada suatu selang ketika gradiennya naik di sana, sehingga ia melengkung seperti cangkir dan berada di atas garis singgungnya. Untuk fungsi yang terdiferensialkan dua kali ini sama dengan turunan kedua positif pada selang itu.',
      ),
    },
    {
      q: L('What is a point of inflection?', 'Apa itu titik belok?'),
      a: L(
        'It is a point of a graph that has a tangent line and where the concavity changes, so the graph crosses its own tangent. There the second derivative is zero or does not exist, but those two facts alone do not guarantee it.',
        'Itu adalah titik pada grafik yang memiliki garis singgung dan tempat kecekungan berubah, sehingga grafik memotong garis singgungnya sendiri. Di sana turunan kedua nol atau tidak ada, tetapi kedua fakta itu saja tidak menjaminnya.',
      ),
    },
    {
      q: L('Does a zero second derivative always mean an inflection point?', 'Apakah turunan kedua nol selalu berarti titik belok?'),
      a: L(
        'No. The second derivative must also change sign. The function x to the fourth has a second derivative equal to 0 at x equal to 0, but it is concave up on both sides, so there is no inflection point there.',
        'Tidak. Turunan kedua juga harus berganti tanda. Fungsi x pangkat empat memiliki turunan kedua sama dengan 0 di x sama dengan 0, tetapi ia cekung ke atas di kedua sisi, sehingga tidak ada titik belok di sana.',
      ),
    },
    {
      q: L('Can an inflection point occur where the second derivative does not exist?', 'Dapatkah titik belok terjadi di tempat turunan kedua tidak ada?'),
      a: L(
        'Yes, if the graph has a tangent line there and the concavity changes. The functions x to the five thirds and the cube root of x have inflection points at 0 even though the second derivative is undefined there; a cusp has none.',
        'Ya, jika grafik memiliki garis singgung di sana dan kecekungan berubah. Fungsi x pangkat lima per tiga dan akar pangkat tiga x memiliki titik belok di 0 walaupun turunan kedua tak terdefinisi di sana; titik puncak tidak memilikinya.',
      ),
    },
    {
      q: L('What is the Second Derivative Test?', 'Apa itu Uji Turunan Kedua?'),
      a: L(
        'If the first derivative is zero at a point, the sign of the second derivative there classifies it: negative is a local maximum and positive is a local minimum. If the second derivative is zero, the test says nothing and the First Derivative Test is used.',
        'Jika turunan pertama nol di suatu titik, tanda turunan kedua di sana menggolongkannya: negatif maksimum lokal dan positif minimum lokal. Jika turunan kedua nol, uji tidak menyatakan apa pun dan Uji Turunan Pertama dipakai.',
      ),
    },
    {
      q: L('What are the steps to sketch a curve?', 'Apa langkah-langkah menggambar kurva?'),
      a: L(
        'Find the domain and symmetry, the first and second derivatives, the critical points and their type, where the function rises and falls, the inflection points and concavity, and the asymptotes. Then plot the intercepts and special points and draw the curve.',
        'Cari domain dan simetri, turunan pertama dan kedua, titik kritis dan jenisnya, di mana fungsi naik dan turun, titik belok dan kecekungan, serta asimtot. Lalu gambar perpotongan dan titik khusus dan gambar kurvanya.',
      ),
    },
    {
      q: L('How does the second derivative describe motion?', 'Bagaimana turunan kedua menggambarkan gerak?'),
      a: L(
        'The second derivative of position is acceleration. A particle speeds up when its velocity and acceleration have the same sign and slows down when they have opposite signs. Inflection points of the position graph mark where the acceleration changes sign.',
        'Turunan kedua posisi adalah percepatan. Partikel bertambah cepat ketika kecepatan dan percepatannya bertanda sama dan melambat ketika bertanda berlawanan. Titik belok grafik posisi menandai tempat percepatan berganti tanda.',
      ),
    },
    {
      q: L('Can a graph cross its asymptote?', 'Dapatkah grafik memotong asimtotnya?'),
      a: L(
        'A horizontal or oblique asymptote describes what the graph does at the far ends, so it can cross the line at finite values of x. The function with numerator x plus 1 squared over 1 plus x squared meets its asymptote y equals 1 at x equals 0.',
        'Asimtot mendatar atau miring menggambarkan apa yang dilakukan grafik di ujung yang jauh, sehingga ia dapat memotong garis itu di nilai x terhingga. Fungsi dengan pembilang x tambah 1 kuadrat per 1 tambah x kuadrat menemui asimtotnya y sama dengan 1 di x sama dengan 0.',
      ),
    },
  ],

  references: [
    { title: "Thomas' Calculus: Early Transcendentals in SI Units (15th ed.), Section 4.4: Concavity and Curve Sketching", author: 'Joel Hass, Christopher Heil, Maurice D. Weir et al.', year: 2023, source: 'Pearson' },
    { title: 'Calculus (8th ed.), section 4.3 and 4.5: How Derivatives Affect the Shape of a Graph; Summary of Curve Sketching', author: 'James Stewart', year: 2015, source: 'Cengage Learning' },
    { title: "Analyse des infiniment petits pour l'intelligence des lignes courbes", author: "Guillaume de l'Hôpital", year: 1696, source: 'Paris' },
    { title: 'A Treatise of Fluxions', author: 'Colin Maclaurin', year: 1742, source: 'Edinburgh' },
    { title: 'Introductio in analysin infinitorum', author: 'Leonhard Euler', year: 1748, source: 'Lausanne' },
  ],

  related: ['monotonic-functions-and-the-first-derivative-test', 'the-mean-value-theorem', 'extreme-values-on-closed-intervals', 'the-derivative-as-a-function'],
}
