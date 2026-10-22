import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './newtons-method.meta'

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
    T`**Newton's method solves $f(x)=0$ by replacing the curve with its tangent line: from a guess $x_n$ it takes the point where the tangent crosses the $x$-axis, $x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}$, and repeats.** Near a simple root the number of correct digits roughly doubles at each step, but a bad start, a horizontal tangent or a multiple root can make it cycle, run away or crawl.`,
    T`**Metode Newton menyelesaikan $f(x)=0$ dengan mengganti kurva dengan garis singgungnya: dari tebakan $x_n$ ia mengambil titik tempat garis singgung memotong sumbu-$x$, $x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}$, lalu mengulang.** Di dekat akar sederhana banyaknya angka benar kira-kira berlipat dua di setiap langkah, tetapi awal yang buruk, garis singgung mendatar, atau akar ganda dapat membuatnya berputar, menjauh, atau merangkak.`,
  ),

  keyPoints: [
    L(
      T`A root of $f$ is a number $r$ with $f(r)=0$. Few equations have a formula for their roots, so we approximate: pick a first guess $x_0$ by graphing or by the Intermediate Value Theorem, then improve it step by step.`,
      T`Akar $f$ adalah bilangan $r$ dengan $f(r)=0$. Hanya sedikit persamaan yang rumus akarnya ada, sehingga kita menghampiri: pilih tebakan awal $x_0$ dengan grafik atau Teorema Nilai Antara, lalu perbaiki langkah demi langkah.`,
    ),
    L(
      T`The formula comes from the tangent line at $(x_n,f(x_n))$: setting $y=0$ in $y=f(x_n)+f'(x_n)(x-x_n)$ gives $x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}$, which needs $f'(x_n)\ne0$.`,
      T`Rumus ini berasal dari garis singgung di $(x_n,f(x_n))$: menyetel $y=0$ pada $y=f(x_n)+f'(x_n)(x-x_n)$ memberi $x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}$, yang memerlukan $f'(x_n)\ne0$.`,
    ),
    L(
      T`Convergence at a simple root is quadratic: $e_{n+1}=\frac{f''(\xi)}{2f'(x_n)}e_n^2$ for some $\xi$ between $x_n$ and the root, so the error is squared at every step. At a root of multiplicity $m$ it is only linear, with ratio $\frac{m-1}{m}$.`,
      T`Konvergensi di akar sederhana bersifat kuadrat: $e_{n+1}=\frac{f''(\xi)}{2f'(x_n)}e_n^2$ untuk suatu $\xi$ di antara $x_n$ dan akar, sehingga galatnya dikuadratkan di setiap langkah. Di akar berkelipatan $m$ ia hanya linear, dengan rasio $\frac{m-1}{m}$.`,
    ),
    L(
      T`The method is local: it can cycle ($x^3-2x+2$ from $0$), run off ($\sqrt[3]{x}$ gives $x_{n+1}=-2x_n$), stop at a horizontal tangent, or reach a root you did not want ($\sin x$ from $1.7$ reaches $3\pi$).`,
      T`Metode ini bersifat lokal: ia dapat berputar ($x^3-2x+2$ dari $0$), menjauh ($\sqrt[3]{x}$ memberi $x_{n+1}=-2x_n$), berhenti di garis singgung mendatar, atau mencapai akar yang tidak kamu inginkan ($\sin x$ dari $1,7$ mencapai $3\pi$).`,
    ),
    L(
      T`Applied to $x^n-a=0$ it needs no derivative, $x_{new}=\frac{(n-1)x+a/x^{n-1}}{n}$, the Babylonian rule for square roots; applied to $\frac1x-a=0$ it gives $x(2-ax)$, a way to divide without dividing.`,
      T`Diterapkan pada $x^n-a=0$ ia tidak memerlukan turunan, $x_{new}=\frac{(n-1)x+a/x^{n-1}}{n}$, aturan Babilonia untuk akar kuadrat; diterapkan pada $\frac1x-a=0$ ia memberi $x(2-ax)$, cara membagi tanpa membagi.`,
    ),
    L(
      T`Stop when the step is smaller than you need, check that $f(x)$ is small as well, and keep a safeguard such as a bracket from the Intermediate Value Theorem and a limit on the number of steps.`,
      T`Berhenti ketika langkahnya lebih kecil daripada yang kamu perlukan, periksa bahwa $f(x)$ juga kecil, dan simpan pengaman seperti selang dari Teorema Nilai Antara dan batas banyaknya langkah.`,
    ),
  ],

  sections: [
    /* ---------------------------------------------------------------------------------- the idea */
    {
      id: 'idea',
      heading: L('What is Newton’s method?', 'Apa itu metode Newton?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Newton's method, also called the Newton–Raphson method, is a way to approximate a solution of $f(x)=0$ using tangent lines.** A value of $x$ where $f$ is zero is a *root* of $f$ and a solution of the equation. For a linear equation $ax+b=0$ and a quadratic $ax^2+bx+c=0$ there are formulas, but for most equations, such as $x^3-x-1=0$ or $\cos x=x$, there is none, and numbers are the only answer. The method is both fast and simple, and it is used in calculators, in software, and in engineering wherever a hard equation has to be solved.

**The idea.** Suppose $x_0$ is a rough guess of a root. Near $x_0$ the curve $y=f(x)$ is almost its tangent line (this is the [linearization](article:linearization-and-differentials#linearization) of $f$), and a line is easy to solve. So take the point $x_1$ where the tangent at $\left(x_0,f(x_0)\right)$ crosses the $x$-axis: it is usually closer to the root than $x_0$. Then do the same at $x_1$ to get $x_2$, and continue until the numbers stop changing.

**The formula.** The tangent line at $\left(x_n,f(x_n)\right)$ is
$$y=f(x_n)+f'(x_n)\,(x-x_n).$$
It crosses the $x$-axis where $y=0$:
$$0=f(x_n)+f'(x_n)(x-x_n)\quad\Rightarrow\quad x=x_n-\frac{f(x_n)}{f'(x_n)}\qquad\text{if }f'(x_n)\ne0.$$
This value is the next approximation:
$$x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}$$
Each step goes up (or down) from $x_n$ to the curve and then follows the tangent line to the axis.

**The procedure.**
1. Guess a first approximation $x_0$, with the help of a graph, or of a sign change of $f$ on an interval (the Intermediate Value Theorem).
2. Use the formula to get $x_1$, $x_2$, and so on.
3. Stop when the steps are smaller than the accuracy you need, and check that $f(x_n)$ is close to zero.

An equation such as $f(x)=g(x)$ is solved by applying the method to $f(x)-g(x)$, and a question such as "where does the curve $y=x^3-x$ cross the line $y=1$?" is the same as finding the roots of $x^3-x-1$.`,
            T`**Metode Newton, disebut juga metode Newton–Raphson, adalah cara menghampiri solusi $f(x)=0$ dengan garis singgung.** Nilai $x$ tempat $f$ bernilai nol adalah *akar* $f$ dan solusi persamaan itu. Untuk persamaan linear $ax+b=0$ dan kuadrat $ax^2+bx+c=0$ ada rumusnya, tetapi untuk kebanyakan persamaan, seperti $x^3-x-1=0$ atau $\cos x=x$, tidak ada, dan bilangan adalah satu-satunya jawaban. Metode ini cepat dan sederhana, dan dipakai di kalkulator, di perangkat lunak, dan di bidang teknik di mana pun persamaan sulit harus diselesaikan.

**Gagasannya.** Misalkan $x_0$ tebakan kasar suatu akar. Di dekat $x_0$ kurva $y=f(x)$ hampir sama dengan garis singgungnya (ini adalah [linearisasi](article:linearization-and-differentials#linearization) $f$), dan garis mudah diselesaikan. Jadi ambil titik $x_1$ tempat garis singgung di $\left(x_0,f(x_0)\right)$ memotong sumbu-$x$: biasanya ia lebih dekat ke akar daripada $x_0$. Lalu lakukan hal yang sama di $x_1$ untuk mendapat $x_2$, dan lanjutkan sampai bilangannya berhenti berubah.

**Rumusnya.** Garis singgung di $\left(x_n,f(x_n)\right)$ adalah
$$y=f(x_n)+f'(x_n)\,(x-x_n).$$
Garis itu memotong sumbu-$x$ di tempat $y=0$:
$$0=f(x_n)+f'(x_n)(x-x_n)\quad\Rightarrow\quad x=x_n-\frac{f(x_n)}{f'(x_n)}\qquad\text{jika }f'(x_n)\ne0.$$
Nilai ini adalah hampiran berikutnya:
$$x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}$$
Setiap langkah naik (atau turun) dari $x_n$ ke kurva lalu menyusuri garis singgung ke sumbu.

**Prosedurnya.**
1. Tebak hampiran pertama $x_0$, dengan bantuan grafik, atau perubahan tanda $f$ pada suatu selang (Teorema Nilai Antara).
2. Pakai rumus untuk mendapat $x_1$, $x_2$, dan seterusnya.
3. Berhenti ketika langkahnya lebih kecil daripada ketelitian yang kamu perlukan, dan periksa bahwa $f(x_n)$ dekat dengan nol.

Persamaan seperti $f(x)=g(x)$ diselesaikan dengan menerapkan metode pada $f(x)-g(x)$, dan pertanyaan seperti "di mana kurva $y=x^3-x$ memotong garis $y=1$?" sama dengan mencari akar $x^3-x-1$.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------------------------- examples */
    {
      id: 'examples',
      heading: L('How does Newton’s method work on real equations?', 'Bagaimana metode Newton bekerja pada persamaan nyata?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Three examples show the method at work: a square root, a cubic with a single real root, and an equation from astronomy.**

**Example 1: the square root of 2.** Approximate the positive root of $f(x)=x^2-2$. With $f'(x)=2x$ the formula becomes
$$x_{n+1}=x_n-\frac{x_n^2-2}{2x_n}=\frac{x_n}{2}+\frac1{x_n}.$$
From $x_0=1$ we get $x_1=\frac32=1.5$, then $x_2=\frac{17}{12}\approx1.41667$ and $x_3=\frac{577}{408}\approx1.41422$. The true value is $\sqrt2=1.41421356\ldots$, so the errors are about $0.414$, $0.086$, $0.0025$ and $0.000002$, and the next step is correct to twelve decimals. Each step roughly doubles the number of correct digits.

**Example 2: a cubic.** Find the $x$-coordinate where the curve $y=x^3-x$ crosses the line $y=1$. That is a root of $f(x)=x^3-x-1$. Since $f(1)=-1$ and $f(2)=5$, the Intermediate Value Theorem gives a root in $(1,2)$. With $f'(x)=3x^2-1$,
$$x_{n+1}=x_n-\frac{x_n^3-x_n-1}{3x_n^2-1}.$$
Starting at $x_0=1$ gives $x_1=1.5$, $x_2=1.347826087$, $x_3=1.325200399$, $x_4=1.324718174$ and $x_5=1.324717957$, and $x_6$ agrees with it to nine decimals: $f(x_5)$ is zero up to the accuracy of the computation. The curve is [concave up](article:concavity-and-curve-sketching#concavity) for $x>0$, since $f''(x)=6x>0$, so once an approximation is to the right of the root the tangents lie below the curve and the approximations fall steadily toward it. Starting much farther away, at $x_0=3$, still works, in seven steps; in fact any start to the right of $\frac1{\sqrt3}$ leads to this root.

**Example 3: a planet.** To calculate where a planet is, astronomers solve equations such as $x=1+0.5\sin x$ (Kepler's equation, with $x$ in radians). The function $f(x)=x-1-0.5\sin x$ has $f'(x)=1-0.5\cos x$, and a graph suggests a root near $1.5$. One step from $x_0=1.5$ gives
$$x_1=1.5-\frac{1.5-1-0.5\sin1.5}{1-0.5\cos1.5}\approx1.49870,$$
which is already the root to five decimals.

Type a function and a starting value below, or choose one of the examples. The slider takes the steps one at a time, and the picture shows each tangent: up to the curve, then along the tangent to the axis.`,
            T`**Tiga contoh memperlihatkan metode ini bekerja: akar kuadrat, kubik dengan satu akar real, dan persamaan dari astronomi.**

**Contoh 1: akar kuadrat 2.** Hampiri akar positif $f(x)=x^2-2$. Dengan $f'(x)=2x$ rumusnya menjadi
$$x_{n+1}=x_n-\frac{x_n^2-2}{2x_n}=\frac{x_n}{2}+\frac1{x_n}.$$
Dari $x_0=1$ kita dapat $x_1=\frac32=1{,}5$, lalu $x_2=\frac{17}{12}\approx1{,}41667$ dan $x_3=\frac{577}{408}\approx1{,}41422$. Nilai sebenarnya $\sqrt2=1{,}41421356\ldots$, sehingga galatnya sekitar $0{,}414$, $0{,}086$, $0{,}0025$, dan $0{,}000002$, dan langkah berikutnya benar sampai dua belas desimal. Setiap langkah kira-kira melipatduakan banyaknya angka benar.

**Contoh 2: kubik.** Tentukan absis tempat kurva $y=x^3-x$ memotong garis $y=1$. Itu adalah akar $f(x)=x^3-x-1$. Karena $f(1)=-1$ dan $f(2)=5$, Teorema Nilai Antara memberi akar di $(1,2)$. Dengan $f'(x)=3x^2-1$,
$$x_{n+1}=x_n-\frac{x_n^3-x_n-1}{3x_n^2-1}.$$
Mulai dari $x_0=1$ memberi $x_1=1{,}5$, $x_2=1{,}347826087$, $x_3=1{,}325200399$, $x_4=1{,}324718174$, dan $x_5=1{,}324717957$, dan $x_6$ sama dengannya sampai sembilan desimal: $f(x_5)$ nol sejauh ketelitian hitung. Kurvanya [cekung ke atas](article:concavity-and-curve-sketching#concavity) untuk $x>0$, karena $f''(x)=6x>0$, sehingga begitu hampiran ada di kanan akar, garis singgungnya berada di bawah kurva dan hampiran turun tetap menuju akar. Mulai jauh lebih jauh, di $x_0=3$, tetap berhasil, dalam tujuh langkah; bahkan setiap awal di kanan $\frac1{\sqrt3}$ menuju akar ini.

**Contoh 3: sebuah planet.** Untuk menghitung posisi planet, astronom menyelesaikan persamaan seperti $x=1+0{,}5\sin x$ (persamaan Kepler, dengan $x$ dalam radian). Fungsi $f(x)=x-1-0{,}5\sin x$ memiliki $f'(x)=1-0{,}5\cos x$, dan grafik menunjukkan akar di dekat $1{,}5$. Satu langkah dari $x_0=1{,}5$ memberi
$$x_1=1{,}5-\frac{1{,}5-1-0{,}5\sin1{,}5}{1-0{,}5\cos1{,}5}\approx1{,}49870,$$
yang sudah merupakan akar sampai lima desimal.

Ketik sebuah fungsi dan nilai awal di bawah, atau pilih salah satu contoh. Penggeser mengambil langkah satu per satu, dan gambar menunjukkan tiap garis singgung: naik ke kurva, lalu menyusuri garis singgung ke sumbu.`,
          ),
        },
        { kind: 'widget', name: 'newtontool' },
      ],
    },

    /* ------------------------------------------------------------------------------ convergence */
    {
      id: 'convergence',
      heading: L('How fast does Newton’s method converge?', 'Seberapa cepat metode Newton konvergen?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Near a simple root Newton's method converges quadratically: the error is roughly squared at each step, so the number of correct digits roughly doubles.** Write $e_n=x_n-r$ for the error, where $r$ is the root. If $f$ has a continuous second derivative and $f'(r)\ne0$, then
$$e_{n+1}=\frac{f''(\xi)}{2f'(x_n)}\,e_n^2\qquad\text{for some }\xi\text{ between }x_n\text{ and }r.$$
*Proof.* Taylor's formula at $x_n$, evaluated at the root, gives $0=f(x_n)-f'(x_n)e_n+\frac12f''(\xi)e_n^2$, that is $f'(x_n)e_n-f(x_n)=\frac12f''(\xi)e_n^2$. Then
$$e_{n+1}=e_n-\frac{f(x_n)}{f'(x_n)}=\frac{f'(x_n)e_n-f(x_n)}{f'(x_n)}=\frac{f''(\xi)}{2f'(x_n)}\,e_n^2.$$ ∎
When $x_n\to r$ this says $\frac{e_{n+1}}{e_n^2}\to\frac{f''(r)}{2f'(r)}$. For $\sqrt2$ the constant is $\frac{2}{2\cdot2\sqrt2}\approx0.354$, and the table below shows the ratios close to it.

**Comparison with bisection.** The bisection method halves a bracket at each step, a gain of about $0.3$ digits per step, so ten digits take about thirty-three steps. Newton's method needs four or five, but it needs the derivative, a good start, and no safety net.

**It is a local result.** The formula $|e_{n+1}|\le M\,e_n^2$, with $M$ a bound for $\frac{|f''|}{2|f'|}$ near the root, gives $M|e_n|\le(M|e_0|)^{2^n}$. So if the first error satisfies $M|e_0|<1$ the method converges, and very fast; if the start is farther away, nothing is promised.

**Multiple roots.** If $f(x)=(x-r)^m g(x)$ with $m>1$ then $f'(r)=0$ and the argument above fails: the error shrinks only by the factor $\frac{m-1}{m}$ at each step. For $(x-1)^2$ the error is halved, as in bisection; for $(x-1)^6$ only a sixth of the error is removed at each step. For $f(x)=(x-1)^{40}$ and $x_0=2$ the factor is $\frac{39}{40}$, and after $100$ steps the approximation is still about $1.08$. Using $x_{n+1}=x_n-m\frac{f(x_n)}{f'(x_n)}$ restores quadratic convergence when $m$ is known.

**Stopping.** For a simple root a tiny step $|x_{n+1}-x_n|$ means the error is tinier still. Do not rely on $|f(x_n)|$ alone: a flat curve such as $(x-1)^{40}$ has $f(x)$ below $10^{-15}$ while $x$ is still $0.4$ away from the root.

Choose a case below: the table gives the error, the correct digits and both ratios, with bisection beside it for the simple roots.`,
            T`**Di dekat akar sederhana metode Newton konvergen secara kuadrat: galatnya kira-kira dikuadratkan di setiap langkah, sehingga banyaknya angka benar kira-kira berlipat dua.** Tulis $e_n=x_n-r$ untuk galat, dengan $r$ akarnya. Jika $f$ memiliki turunan kedua kontinu dan $f'(r)\ne0$, maka
$$e_{n+1}=\frac{f''(\xi)}{2f'(x_n)}\,e_n^2\qquad\text{untuk suatu }\xi\text{ di antara }x_n\text{ dan }r.$$
*Bukti.* Rumus Taylor di $x_n$, dihitung di akar, memberi $0=f(x_n)-f'(x_n)e_n+\frac12f''(\xi)e_n^2$, yaitu $f'(x_n)e_n-f(x_n)=\frac12f''(\xi)e_n^2$. Maka
$$e_{n+1}=e_n-\frac{f(x_n)}{f'(x_n)}=\frac{f'(x_n)e_n-f(x_n)}{f'(x_n)}=\frac{f''(\xi)}{2f'(x_n)}\,e_n^2.$$ ∎
Ketika $x_n\to r$ ini berarti $\frac{e_{n+1}}{e_n^2}\to\frac{f''(r)}{2f'(r)}$. Untuk $\sqrt2$ konstantanya $\frac{2}{2\cdot2\sqrt2}\approx0{,}354$, dan tabel di bawah menunjukkan rasionya dekat dengan itu.

**Perbandingan dengan bisection.** Metode bisection membagi dua selang di setiap langkah, kenaikan sekitar $0{,}3$ angka per langkah, sehingga sepuluh angka memerlukan sekitar tiga puluh tiga langkah. Metode Newton memerlukan empat atau lima, tetapi ia memerlukan turunan, awal yang baik, dan tanpa jaring pengaman.

**Ini hasil lokal.** Rumus $|e_{n+1}|\le M\,e_n^2$, dengan $M$ batas untuk $\frac{|f''|}{2|f'|}$ di dekat akar, memberi $M|e_n|\le(M|e_0|)^{2^n}$. Jadi jika galat pertama memenuhi $M|e_0|<1$ metodenya konvergen, dan sangat cepat; jika awalnya lebih jauh, tidak ada yang dijanjikan.

**Akar ganda.** Jika $f(x)=(x-r)^m g(x)$ dengan $m>1$ maka $f'(r)=0$ dan argumen di atas gagal: galat hanya mengecil dengan faktor $\frac{m-1}{m}$ di setiap langkah. Untuk $(x-1)^2$ galatnya dibagi dua, seperti pada bisection; untuk $(x-1)^6$ hanya seperenam galat yang hilang di setiap langkah. Untuk $f(x)=(x-1)^{40}$ dan $x_0=2$ faktornya $\frac{39}{40}$, dan setelah $100$ langkah hampirannya masih sekitar $1{,}08$. Memakai $x_{n+1}=x_n-m\frac{f(x_n)}{f'(x_n)}$ mengembalikan konvergensi kuadrat bila $m$ diketahui.

**Berhenti.** Untuk akar sederhana langkah $|x_{n+1}-x_n|$ yang kecil berarti galatnya lebih kecil lagi. Jangan hanya mengandalkan $|f(x_n)|$: kurva datar seperti $(x-1)^{40}$ memiliki $f(x)$ di bawah $10^{-15}$ padahal $x$ masih $0{,}4$ dari akarnya.

Pilih satu kasus di bawah: tabel memberi galat, angka benar, dan kedua rasio, dengan bisection di sebelahnya untuk akar sederhana.`,
          ),
        },
        { kind: 'widget', name: 'newtonspeed' },
      ],
    },

    /* ------------------------------------------------------------------------------- failures */
    {
      id: 'failures',
      heading: L('When does Newton’s method fail?', 'Kapan metode Newton gagal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Newton's method does not always converge, and when it does, it may converge to a root you did not have in mind.** If it converges, the limit is a root: when $x_n\to L$ and $f$ and $f'$ are continuous with $f'(L)\ne0$, letting $n\to\infty$ in the formula gives $\frac{f(L)}{f'(L)}=0$. The trouble is whether it converges at all. The usual failures are these.

1. **A horizontal tangent.** If $f'(x_n)=0$ the tangent never meets the axis and the formula divides by zero; if $f'(x_n)$ is merely tiny the next guess is thrown far away.
2. **A cycle.** For $f(x)=x^3-2x+2$ and $x_0=0$ the tangent at $0$ meets the axis at $1$, and the tangent at $1$ meets it at $0$: the approximations are $0,1,0,1,\ldots$ forever, while the real root is near $-1.77$. In the textbook the function $f(x)=\sqrt{x-r}$ for $x\ge r$ and $-\sqrt{r-x}$ for $x<r$ swings between $r-h$ and $r+h$ in the same way.
3. **Running off.** For $f(x)=\sqrt[3]{x}$ the root is $0$, but $x_{n+1}=x_n-3x_n=-2x_n$, so the approximations are $1,-2,4,-8,\ldots$ Another case is $\arctan x$: if $|x_0|$ is greater than about $1.3917$, where $2x=(1+x^2)\arctan x$, each step lands farther out than the last.
4. **The wrong root.** $\sin x$ has a root at every multiple of $\pi$, but from $x_0=1.7$ the tangent is nearly flat, the next guess is $9.40$, and the sequence settles on $3\pi$. If you start too far away, the method may miss the root you want.
5. **A flat root.** At a root of multiplicity $m>1$ the convergence is only linear, as above.

**Basins of attraction.** The set of starting values that lead to one root is its *basin*. The basins of different roots are usually separated by simple boundaries, but they can interleave in a fine pattern. For $f(x)=x^3-x$, with roots $-1$, $0$ and $1$, every start beyond $\frac1{\sqrt3}\approx0.577$ goes to $1$, every start between $-\frac1{\sqrt5}$ and $\frac1{\sqrt5}$ goes to $0$, and between $\frac1{\sqrt5}\approx0.447$ and $\frac1{\sqrt3}$ the roots reached change with every small move of the start. So a small change of $x_0$ can change the answer.

**Safeguards.** Graph the function first; start from a bracket $[a,b]$ with $f(a)f(b)<0$ and fall back to a bisection step whenever Newton's step leaves the bracket; limit the number of steps; stop on both $|x_{n+1}-x_n|$ and $|f(x_{n+1})|$.

The first widget shows each failure with its steps, and the second colours the starting values by the root they reach.`,
            T`**Metode Newton tidak selalu konvergen, dan ketika konvergen, ia dapat menuju akar yang tidak kamu maksud.** Jika ia konvergen, limitnya adalah akar: ketika $x_n\to L$ dan $f$ dan $f'$ kontinu dengan $f'(L)\ne0$, mengambil $n\to\infty$ pada rumus memberi $\frac{f(L)}{f'(L)}=0$. Masalahnya adalah apakah ia konvergen sama sekali. Kegagalan yang lazim adalah berikut.

1. **Garis singgung mendatar.** Jika $f'(x_n)=0$ garis singgung tidak pernah memotong sumbu dan rumusnya membagi dengan nol; jika $f'(x_n)$ hanya sangat kecil tebakan berikutnya terlempar jauh.
2. **Siklus.** Untuk $f(x)=x^3-2x+2$ dan $x_0=0$ garis singgung di $0$ memotong sumbu di $1$, dan garis singgung di $1$ memotongnya di $0$: hampirannya $0,1,0,1,\ldots$ selamanya, sedangkan akar nyatanya dekat $-1{,}77$. Dalam buku, fungsi $f(x)=\sqrt{x-r}$ untuk $x\ge r$ dan $-\sqrt{r-x}$ untuk $x<r$ berayun antara $r-h$ dan $r+h$ dengan cara yang sama.
3. **Menjauh.** Untuk $f(x)=\sqrt[3]{x}$ akarnya $0$, tetapi $x_{n+1}=x_n-3x_n=-2x_n$, sehingga hampirannya $1,-2,4,-8,\ldots$ Kasus lain adalah $\arctan x$: jika $|x_0|$ lebih besar dari sekitar $1{,}3917$, tempat $2x=(1+x^2)\arctan x$, setiap langkah mendarat lebih jauh daripada sebelumnya.
4. **Akar yang keliru.** $\sin x$ memiliki akar di setiap kelipatan $\pi$, tetapi dari $x_0=1{,}7$ garis singgungnya hampir mendatar, tebakan berikutnya $9{,}40$, dan barisan menetap di $3\pi$. Jika mulai terlalu jauh, metode dapat melewatkan akar yang kamu inginkan.
5. **Akar yang datar.** Di akar berkelipatan $m>1$ konvergensinya hanya linear, seperti di atas.

**Daerah tarikan.** Himpunan nilai awal yang menuju satu akar disebut *daerah tarikan*nya. Daerah tarikan akar yang berbeda biasanya dipisahkan oleh batas sederhana, tetapi dapat saling menyelip dalam pola halus. Untuk $f(x)=x^3-x$, dengan akar $-1$, $0$, dan $1$, setiap awal di atas $\frac1{\sqrt3}\approx0{,}577$ menuju $1$, setiap awal di antara $-\frac1{\sqrt5}$ dan $\frac1{\sqrt5}$ menuju $0$, dan di antara $\frac1{\sqrt5}\approx0{,}447$ dan $\frac1{\sqrt3}$ akar yang dicapai berubah dengan setiap pergeseran kecil awalnya. Jadi perubahan kecil pada $x_0$ dapat mengubah jawabannya.

**Pengaman.** Gambar fungsinya lebih dahulu; mulai dari selang $[a,b]$ dengan $f(a)f(b)<0$ dan kembali ke langkah bisection bila langkah Newton keluar dari selang; batasi banyaknya langkah; berhenti berdasarkan $|x_{n+1}-x_n|$ dan $|f(x_{n+1})|$ sekaligus.

Widget pertama menunjukkan tiap kegagalan dengan langkahnya, dan yang kedua mewarnai nilai awal menurut akar yang dicapainya.`,
          ),
        },
        { kind: 'widget', name: 'newtonfail' },
        { kind: 'widget', name: 'newtonbasin' },
      ],
    },

    /* --------------------------------------------------------------------------------- uses */
    {
      id: 'uses',
      heading: L('Where is Newton’s method used?', 'Di mana metode Newton dipakai?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Newton's method is behind the square root and the division of many calculators and programs, and behind any problem that comes down to solving one equation.**

**Square roots.** For $f(x)=x^2-a$ the formula is $x_{n+1}=\frac12\left(x_n+\frac a{x_n}\right)$: replace the guess by the average of $x_n$ and $\frac a{x_n}$, one of which is too small and one too large. For $x^n-a$ the derivative disappears into
$$x_{n+1}=\frac{(n-1)\,x_n+\dfrac{a}{x_n^{\,n-1}}}{n}.$$
**Division.** For $f(x)=\frac1x-a$ the root is $\frac1a$ and the formula simplifies to $x_{n+1}=x_n(2-a\,x_n)$, with no division at all: a computer can find a reciprocal with only multiplication and subtraction, as long as $0<x_0<\frac2a$.

**Optimization.** The extreme values of $g$ are at the roots of $g'$ (see [optimization problems](article:applied-optimization#open-domains)), so Newton's method applied to $f=g'$ gives $x_{n+1}=x_n-\frac{g'(x_n)}{g''(x_n)}$. In many variables the same idea, with the gradient and the second derivatives, is at the center of numerical optimization and of solving systems of equations.

**Other equations.** Where two curves intersect, where a planet is on its orbit, the closest approach of a submarine to a buoy, the equilibrium of a chemical mixture: each is an equation with no formula and a good first guess.

Try the two rules below. Change $a$, the root index and the start, and watch the correct digits.`,
            T`**Metode Newton ada di balik akar kuadrat dan pembagian banyak kalkulator dan program, dan di balik setiap masalah yang berujung pada penyelesaian satu persamaan.**

**Akar kuadrat.** Untuk $f(x)=x^2-a$ rumusnya $x_{n+1}=\frac12\left(x_n+\frac a{x_n}\right)$: ganti tebakan dengan rata-rata $x_n$ dan $\frac a{x_n}$, yang satu terlalu kecil dan yang lain terlalu besar. Untuk $x^n-a$ turunannya lenyap menjadi
$$x_{n+1}=\frac{(n-1)\,x_n+\dfrac{a}{x_n^{\,n-1}}}{n}.$$
**Pembagian.** Untuk $f(x)=\frac1x-a$ akarnya $\frac1a$ dan rumusnya menyederhana menjadi $x_{n+1}=x_n(2-a\,x_n)$, tanpa pembagian sama sekali: komputer dapat mencari kebalikan hanya dengan perkalian dan pengurangan, asalkan $0<x_0<\frac2a$.

**Optimisasi.** Nilai ekstrem $g$ ada di akar $g'$ (lihat [soal optimisasi](article:applied-optimization#open-domains)), sehingga metode Newton yang diterapkan pada $f=g'$ memberi $x_{n+1}=x_n-\frac{g'(x_n)}{g''(x_n)}$. Pada banyak peubah gagasan yang sama, dengan gradien dan turunan kedua, adalah inti optimisasi numerik dan penyelesaian sistem persamaan.

**Persamaan lain.** Tempat dua kurva berpotongan, posisi planet pada orbitnya, jarak terdekat kapal selam ke pelampung, keseimbangan campuran kimia: masing-masing adalah persamaan tanpa rumus dan dengan tebakan awal yang baik.

Cobalah kedua aturan di bawah. Ubah $a$, indeks akar, dan awalnya, dan perhatikan angka benarnya.`,
          ),
        },
        { kind: 'widget', name: 'newtonroots' },
      ],
    },

    /* ---------------------------------------------------------------------------------- in code */
    {
      id: 'newton-in-code',
      heading: L('How do you code Newton’s method?', 'Bagaimana menulis kode metode Newton?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**In code, Newton's method is a loop of three lines; the care goes into the stopping rule.** Stop when the step is small relative to $x$, give up after a fixed number of steps, and refuse to divide when the derivative is zero. SymPy can find $f'$ for you, and without it a central difference $\frac{f(x+h)-f(x-h)}{2h}$ is a good replacement. The same loop run on $x^3-2x+2$ from $0$ shows the cycle: the iterates are $0,1,0,1,\ldots$`,
            T`**Dalam kode, metode Newton adalah perulangan tiga baris; ketelitiannya ada pada aturan berhenti.** Berhenti ketika langkahnya kecil relatif terhadap $x$, menyerah setelah sejumlah langkah tetap, dan menolak membagi bila turunannya nol. SymPy dapat mencarikan $f'$, dan tanpanya selisih pusat $\frac{f(x+h)-f(x-h)}{2h}$ adalah pengganti yang baik. Perulangan yang sama pada $x^3-2x+2$ dari $0$ memperlihatkan siklusnya: iterasinya $0,1,0,1,\ldots$`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python and SymPy: the derivative by symbolic differentiation', 'Python dan SymPy: turunan dengan diferensiasi simbolik'),
          code: `import sympy as sp

x = sp.symbols('x')


def newton(f, x0, steps=6):
    """Newton's method for f(x) = 0, with f' found symbolically: the list of approximations."""
    g, dg = sp.lambdify(x, f), sp.lambdify(x, sp.diff(f, x))
    xs = [x0]
    for _ in range(steps):
        xs.append(xs[-1] - g(xs[-1]) / dg(xs[-1]))
    return xs


print([round(v, 10) for v in newton(x ** 2 - 2, 1.0)])
print([round(v, 10) for v in newton(x ** 3 - x - 1, 1.0)])
print([round(v, 10) for v in newton(x ** 3 - x - 1, 3.0, 8)])
print([round(v, 10) for v in newton(x ** 3 - 2 * x + 2, 0.0, 5)])
print(sp.nsolve(x ** 3 - x - 1, x, 1))
# [1.0, 1.5, 1.4166666667, 1.4142156863, 1.4142135624, 1.4142135624, 1.4142135624]
# [1.0, 1.5, 1.347826087, 1.325200399, 1.324718174, 1.3247179572, 1.3247179572]
# [3.0, 2.1153846154, 1.6042477584, 1.377421441, 1.3271331185, 1.3247233751, 1.3247179573, 1.3247179572, 1.3247179572]
# [0.0, 1.0, 0.0, 1.0, 0.0, 1.0]
# 1.32471795724475`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: a derivative by central difference, and the safeguards', 'JavaScript: turunan dengan selisih pusat, dan pengamannya'),
          code: `// Newton's method with a central-difference derivative, a step limit and a flat-tangent check
const newton = (f, x0, { tol = 1e-12, max = 50 } = {}) => {
  let x = x0
  for (let n = 0; n < max; n++) {
    const h = 1e-6 * (1 + Math.abs(x))
    const d = (f(x + h) - f(x - h)) / (2 * h)
    if (d === 0 || !Number.isFinite(d)) return { x, n, status: 'flat' }
    const next = x - f(x) / d
    if (Math.abs(next - x) < tol * (1 + Math.abs(x))) return { x: next, n: n + 1, status: 'converged' }
    x = next
  }
  return { x, n: max, status: 'unfinished' }
}
const r1 = newton((x) => x ** 3 - x - 1, 1)
;[+r1.x.toFixed(10), r1.n, r1.status]                      // [1.3247179572, 6, 'converged']
const r2 = newton((x) => Math.cos(x) - x, 1)
;[+r2.x.toFixed(10), r2.n, r2.status]                      // [0.7390851332, 5, 'converged']: cos x = x
const r3 = newton((x) => x * x - 1, 0)
;[r3.x, r3.n, r3.status]                                    // [0, 0, 'flat']: the tangent at 0 is horizontal
const r4 = newton(Math.sin, 1.7)
;[+r4.x.toFixed(10), r4.n, r4.status]                      // [9.4247779608, 4, 'converged']: not the root 0 but 3 pi
newton((x) => x ** 3 - 2 * x + 2, 0, { max: 8 }).status    // 'unfinished': the iterates go 0, 1, 0, 1, ...`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++: the square root of 2', 'C++: akar kuadrat 2'),
          code: `#include <iostream>
#include <cstdio>
#include <cmath>
using namespace std;

int main() {
  double a = 2;
  double x = 1;                                          // the first guess
  for (int n = 0; n <= 5; n++) {
    printf("%d %.12f %.12f\\n", n, x, fabs(x - sqrt(a)));
    x = (x + a / x) / 2;                                 // Newton's method for x*x - a = 0
  }
  return 0;
}

/* output:
0 1.000000000000 0.414213562373
1 1.500000000000 0.085786437627
2 1.416666666667 0.002453104294
3 1.414215686275 0.000002123901
4 1.414213562375 0.000000000002
5 1.414213562373 0.000000000000
*/`,
        },
      ],
    },

    /* ---------------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Who invented Newton’s method?', 'Siapa yang menemukan metode Newton?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The idea of improving a guess for a root is four thousand years old, and the method carries the names of Newton and Raphson because of how they wrote it, not because they were the first to improve guesses.**

- **Babylon, about 1800–1600 BC.** The clay tablet YBC 7289 gives $\sqrt2$ as $1;24,51,10$ in base $60$, which is $1.41421296\ldots$, correct to six decimals. Averaging a guess and the number divided by the guess, the rule of Example 1, is a likely way to get it.
- **Heron of Alexandria, first century.** Heron described the averaging rule for square roots, which is why the formula is also called Heron's method.
- **Isaac Newton, 1669.** In *De analysi*, written in 1669 and printed in 1711, Newton solved $y^3-2y-5=0$ by starting at $2$, writing $y=2+p$, dropping the powers of $p$ above the first, and repeating on the new polynomial. It was an algebraic process on the equation, not a formula for $x_{n+1}$.
- **Joseph Raphson, 1690.** Raphson published a way of repeating a single formula for polynomials, without rewriting the equation each time, which is the shape of the method we use.
- **Thomas Simpson, 1740.** Simpson described the method with derivatives, the form $x-\frac{f(x)}{f'(x)}$, for any equation and even for two equations at once.
- **Fourier and Cauchy, 1820s.** Joseph Fourier and Augustin-Louis Cauchy studied when the method converges.
- **Cayley, 1879.** Arthur Cayley asked which root Newton's method reaches from a start in the complex plane. For a quadratic the plane splits along a line; for a cubic the boundaries became the fractals later studied by Julia and Fatou.
- **Kantorovich, 1948.** Leonid Kantorovich proved a convergence theorem that needs conditions only at the starting point, and that works for systems of equations.`,
            T`**Gagasan memperbaiki tebakan akar berumur empat ribu tahun, dan metode ini memakai nama Newton dan Raphson karena cara mereka menuliskannya, bukan karena mereka yang pertama memperbaiki tebakan.**

- **Babilonia, sekitar 1800–1600 SM.** Lempeng tanah liat YBC 7289 memberi $\sqrt2$ sebagai $1;24,51,10$ dalam basis $60$, yaitu $1{,}41421296\ldots$, benar sampai enam desimal. Merata-ratakan tebakan dan bilangan dibagi tebakan, aturan pada Contoh 1, adalah cara yang mungkin untuk mendapatkannya.
- **Heron dari Aleksandria, abad pertama.** Heron menjelaskan aturan perata-rataan untuk akar kuadrat, itulah sebabnya rumus itu disebut juga metode Heron.
- **Isaac Newton, 1669.** Dalam *De analysi*, ditulis pada 1669 dan dicetak pada 1711, Newton menyelesaikan $y^3-2y-5=0$ dengan mulai dari $2$, menulis $y=2+p$, membuang pangkat $p$ di atas satu, dan mengulang pada polinom baru. Itu proses aljabar pada persamaannya, bukan rumus untuk $x_{n+1}$.
- **Joseph Raphson, 1690.** Raphson menerbitkan cara mengulang satu rumus untuk polinom, tanpa menulis ulang persamaan setiap kali, yang merupakan bentuk metode yang kita pakai.
- **Thomas Simpson, 1740.** Simpson menjelaskan metode itu dengan turunan, bentuk $x-\frac{f(x)}{f'(x)}$, untuk persamaan apa pun dan bahkan untuk dua persamaan sekaligus.
- **Fourier dan Cauchy, 1820-an.** Joseph Fourier dan Augustin-Louis Cauchy mempelajari kapan metode ini konvergen.
- **Cayley, 1879.** Arthur Cayley bertanya akar mana yang dicapai metode Newton dari awal di bidang kompleks. Untuk kuadrat bidang terbelah di sepanjang garis; untuk kubik batasnya menjadi fraktal yang kemudian dipelajari Julia dan Fatou.
- **Kantorovich, 1948.** Leonid Kantorovich membuktikan teorema konvergensi yang hanya memerlukan syarat di titik awal, dan yang berlaku untuk sistem persamaan.`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What mistakes do people make with Newton’s method?', 'Kesalahan apa yang sering terjadi pada metode Newton?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with Newton's method are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ Start anywhere | The start matters: graph $f$ or find a sign change first. From $x_0=1.7$, $\sin x$ goes to $3\pi$, not to $0$. |
| ❌ Apply the formula to an equation, not to a function | Write the equation as $f(x)=0$ first: $x=1+0.5\sin x$ becomes $f(x)=x-1-0.5\sin x$. |
| ❌ Divide when $f'(x_n)=0$ | A horizontal tangent never meets the axis: choose another start. |
| ❌ Assume it always converges | $\sqrt[3]{x}$ gives $x_{n+1}=-2x_n$, and $x^3-2x+2$ from $0$ cycles between $0$ and $1$. |
| ❌ Stop when $|f(x_n)|$ is small | A flat curve can be tiny far from its root; also check that the step is small. |
| ❌ Expect the digits to double at every root | At a root of multiplicity $m$ the error shrinks only by $\frac{m-1}{m}$ per step. |
| ❌ Round the approximations early | Keep all the digits while iterating and round only the final answer. |
| ❌ Use degrees in trigonometric functions | The derivatives of sine and cosine assume radians. |
| ❌ Assume it finds the root you want, or all roots | Each start goes to one root, which may be far away; look at the basins. |`,
            T`**Kesalahan paling umum pada metode Newton adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ Mulai dari mana saja | Awal itu penting: gambar $f$ atau cari perubahan tanda lebih dahulu. Dari $x_0=1{,}7$, $\sin x$ menuju $3\pi$, bukan $0$. |
| ❌ Menerapkan rumus pada persamaan, bukan fungsi | Tulis persamaan sebagai $f(x)=0$ lebih dahulu: $x=1+0{,}5\sin x$ menjadi $f(x)=x-1-0{,}5\sin x$. |
| ❌ Membagi ketika $f'(x_n)=0$ | Garis singgung mendatar tidak pernah memotong sumbu: pilih awal lain. |
| ❌ Mengira selalu konvergen | $\sqrt[3]{x}$ memberi $x_{n+1}=-2x_n$, dan $x^3-2x+2$ dari $0$ berputar antara $0$ dan $1$. |
| ❌ Berhenti ketika $|f(x_n)|$ kecil | Kurva datar dapat kecil jauh dari akarnya; periksa juga bahwa langkahnya kecil. |
| ❌ Mengharapkan angka berlipat dua di setiap akar | Pada akar berkelipatan $m$ galat hanya mengecil dengan $\frac{m-1}{m}$ per langkah. |
| ❌ Membulatkan hampiran terlalu dini | Simpan semua angka saat beriterasi dan bulatkan hanya jawaban akhir. |
| ❌ Memakai derajat pada fungsi trigonometri | Turunan sinus dan kosinus mengandaikan radian. |
| ❌ Mengira ia menemukan akar yang kamu mau, atau semua akar | Tiap awal menuju satu akar, yang mungkin jauh; lihat daerah tarikannya. |`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------------------- practice */
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
              L(T`Newton's method uses the tangent line at $\left(x_n,f(x_n)\right)$.`, T`Metode Newton memakai garis singgung di $\left(x_n,f(x_n)\right)$.`),
              L(T`The formula is $x_{n+1}=x_n-\frac{f'(x_n)}{f(x_n)}$.`, T`Rumusnya $x_{n+1}=x_n-\frac{f'(x_n)}{f(x_n)}$.`),
              L(T`Near a simple root the number of correct digits roughly doubles at each step.`, T`Di dekat akar sederhana banyaknya angka benar kira-kira berlipat dua di setiap langkah.`),
              L(T`The method converges from any starting value.`, T`Metode ini konvergen dari nilai awal mana pun.`),
              L(T`If it converges, it converges to a root of $f$.`, T`Jika ia konvergen, ia konvergen ke akar $f$.`),
              L(T`The root it reaches is always the one nearest to $x_0$.`, T`Akar yang dicapainya selalu yang terdekat dengan $x_0$.`),
            ],
            answer: [true, false, true, false, true, false],
            explain: L(
              T`The formula divides $f$ by $f'$. The method is local: it can cycle, run off or reach a far root ($\sin x$ from $1.7$ reaches $3\pi$). When it converges, the limit satisfies $f(L)=0$.`,
              T`Rumusnya membagi $f$ dengan $f'$. Metode ini bersifat lokal: ia dapat berputar, menjauh, atau mencapai akar yang jauh ($\sin x$ dari $1{,}7$ mencapai $3\pi$). Ketika konvergen, limitnya memenuhi $f(L)=0$.`,
            ),
            hint: L(T`Recall the derivation of the formula and the section on failures.`, T`Ingat penurunan rumus dan bagian tentang kegagalan.`),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L(T`Which of these can make Newton's method fail? Choose **all** that apply.`, T`Mana dari berikut yang dapat membuat metode Newton gagal? Pilih **semua** yang benar.`),
            options: [
              L(T`a start where $f'(x_0)=0$`, T`awal dengan $f'(x_0)=0$`),
              L(T`a cycle between two values, as for $x^3-2x+2$ from $0$`, T`siklus antara dua nilai, seperti $x^3-2x+2$ dari $0$`),
              L(T`a root that is a simple zero of $f$ and a start close to it`, T`akar yang merupakan nol sederhana $f$ dan awal yang dekat dengannya`),
              L(T`a function such as $\sqrt[3]{x}$ with a vertical tangent at the root`, T`fungsi seperti $\sqrt[3]{x}$ dengan garis singgung tegak di akarnya`),
              L(T`a start too far out for $\arctan x$`, T`awal yang terlalu jauh untuk $\arctan x$`),
            ],
            answer: [0, 1, 3, 4],
            explain: L(T`A simple zero with a close start is the good case: the convergence is quadratic. The others are a horizontal tangent, a cycle, a run-off and an escape.`, T`Nol sederhana dengan awal yang dekat adalah kasus baik: konvergensinya kuadrat. Yang lain adalah garis singgung mendatar, siklus, menjauh, dan lolos.`),
            hint: L(T`Which one is the situation the theorem on quadratic convergence assumes?`, T`Mana yang merupakan keadaan yang diandaikan teorema konvergensi kuadrat?`),
          },
        },
        {
          kind: 'activity',
          title: L('One step', 'Satu langkah'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L(T`$f(x)=x^2-9$, $f'(x)=2x$, $f(5)=16$ and $f'(5)=10$.`, T`$f(x)=x^2-9$, $f'(x)=2x$, $f(5)=16$ dan $f'(5)=10$.`), L(T`$x_1=5-\frac{16}{10}$.`, T`$x_1=5-\frac{16}{10}$.`)],
            explain: L(T`$x_1=5-1.6=3.4$, closer to the root $3$.`, T`$x_1=5-1{,}6=3{,}4$, lebih dekat ke akar $3$.`),
            prompt: L(T`Apply one step of Newton's method to $f(x)=x^2-9$ with $x_0=5$. What is $x_1$?`, T`Terapkan satu langkah metode Newton pada $f(x)=x^2-9$ dengan $x_0=5$. Berapa $x_1$?`),
            given: String.raw`x_1=v`,
            blanks: [{ label: 'x₁ =', answer: 3.4 }],
          },
        },
        {
          kind: 'activity',
          title: L('The Babylonian rule', 'Aturan Babilonia'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L(T`For $\sqrt a$ the rule is $x_1=\frac12\left(x_0+\frac a{x_0}\right)$.`, T`Untuk $\sqrt a$ aturannya $x_1=\frac12\left(x_0+\frac a{x_0}\right)$.`), L(T`$\frac12\left(10+\frac{25}{10}\right)$.`, T`$\frac12\left(10+\frac{25}{10}\right)$.`)],
            explain: L(T`$x_1=\frac12(10+2.5)=6.25$, on the way to $5$.`, T`$x_1=\frac12(10+2{,}5)=6{,}25$, menuju $5$.`),
            prompt: L(T`Estimating $\sqrt{25}$ from $x_0=10$ with $x_{n+1}=\frac12\left(x_n+\frac{25}{x_n}\right)$, what is $x_1$?`, T`Menghampiri $\sqrt{25}$ dari $x_0=10$ dengan $x_{n+1}=\frac12\left(x_n+\frac{25}{x_n}\right)$, berapa $x_1$?`),
            given: String.raw`x_1=v`,
            blanks: [{ label: 'x₁ =', answer: 6.25 }],
          },
        },
        {
          kind: 'activity',
          title: L('Why the tangent must not be flat', 'Mengapa garis singgung tidak boleh mendatar'),
          step: {
            kind: 'quiz',
            id: 'p5',
            prompt: L(T`What happens in Newton's method for $f(x)=x^2-1$ with $x_0=0$?`, T`Apa yang terjadi pada metode Newton untuk $f(x)=x^2-1$ dengan $x_0=0$?`),
            options: [
              L(T`$f'(0)=0$: the tangent is horizontal and the formula would divide by zero`, T`$f'(0)=0$: garis singgungnya mendatar dan rumusnya akan membagi dengan nol`),
              L(T`it goes to the root $1$ in one step`, T`ia menuju akar $1$ dalam satu langkah`),
              L(T`it goes to $-1$ in one step`, T`ia menuju $-1$ dalam satu langkah`),
              L(T`it cycles between $1$ and $-1$`, T`ia berputar antara $1$ dan $-1$`),
            ],
            answer: 0,
            explain: L(T`$f(0)=-1$ and $f'(0)=0$, so $x_1=0-\frac{-1}{0}$ is not defined. A tangent that never meets the axis cannot give a next approximation.`, T`$f(0)=-1$ dan $f'(0)=0$, sehingga $x_1=0-\frac{-1}{0}$ tidak terdefinisi. Garis singgung yang tidak pernah memotong sumbu tidak dapat memberi hampiran berikutnya.`),
            hint: L(T`Compute $f'(0)$.`, T`Hitung $f'(0)$.`),
          },
        },
        {
          kind: 'activity',
          title: L('Division without dividing', 'Membagi tanpa membagi'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L(T`For $\frac1a$ the rule is $x_{n+1}=x_n(2-ax_n)$.`, T`Untuk $\frac1a$ aturannya $x_{n+1}=x_n(2-ax_n)$.`), L(T`$a=4$ and $x_0=0.2$: $0.2\,(2-0.8)$.`, T`$a=4$ dan $x_0=0{,}2$: $0{,}2\,(2-0{,}8)$.`)],
            explain: L(T`$x_1=0.2\cdot1.2=0.24$, on the way to $\frac14=0.25$.`, T`$x_1=0{,}2\cdot1{,}2=0{,}24$, menuju $\frac14=0{,}25$.`),
            prompt: L(T`Estimating $\frac14$ with $x_{n+1}=x_n(2-4x_n)$ from $x_0=0.2$, what is $x_1$?`, T`Menghampiri $\frac14$ dengan $x_{n+1}=x_n(2-4x_n)$ dari $x_0=0{,}2$, berapa $x_1$?`),
            given: String.raw`x_1=v`,
            blanks: [{ label: 'x₁ =', answer: 0.24 }],
          },
        },
        {
          kind: 'activity',
          title: L('Doubling the digits', 'Melipatduakan angka'),
          step: {
            kind: 'quiz',
            id: 'p7',
            prompt: L(T`Near a simple root the error is $10^{-3}$. About how large is the error after the next step?`, T`Di dekat akar sederhana galatnya $10^{-3}$. Kira-kira berapa galat setelah langkah berikutnya?`),
            options: [
              L(T`about $10^{-6}$, since the error is squared up to a constant`, T`sekitar $10^{-6}$, karena galat dikuadratkan sampai suatu konstanta`),
              L(T`about $5\cdot10^{-4}$, half the error`, T`sekitar $5\cdot10^{-4}$, setengah galat`),
              L(T`about $10^{-4}$`, T`sekitar $10^{-4}$`),
              L(T`exactly $0$`, T`tepat $0$`),
            ],
            answer: 0,
            explain: L(T`$e_{n+1}\approx\frac{f''(r)}{2f'(r)}e_n^2$, and $\left(10^{-3}\right)^2=10^{-6}$. Halving would be the behavior of bisection, or of a double root.`, T`$e_{n+1}\approx\frac{f''(r)}{2f'(r)}e_n^2$, dan $\left(10^{-3}\right)^2=10^{-6}$. Dibagi dua adalah perilaku bisection, atau akar ganda.`),
            hint: L(T`Use $e_{n+1}\approx Ce_n^2$.`, T`Pakai $e_{n+1}\approx Ce_n^2$.`),
          },
        },
        {
          kind: 'activity',
          title: L('A cube root', 'Akar pangkat tiga'),
          step: {
            kind: 'math',
            id: 'p8',
            hints: [L(T`$f(x)=x^3-2$, $f'(x)=3x^2$.`, T`$f(x)=x^3-2$, $f'(x)=3x^2$.`), L(T`$x_1=2-\frac{6}{12}$.`, T`$x_1=2-\frac{6}{12}$.`)],
            explain: L(T`$x_1=2-0.5=1.5$, on the way to $\sqrt[3]{2}\approx1.26$.`, T`$x_1=2-0{,}5=1{,}5$, menuju $\sqrt[3]{2}\approx1{,}26$.`),
            prompt: L(T`Apply one step of Newton's method to $f(x)=x^3-2$ from $x_0=2$. What is $x_1$?`, T`Terapkan satu langkah metode Newton pada $f(x)=x^3-2$ dari $x_0=2$. Berapa $x_1$?`),
            given: String.raw`x_1=v`,
            blanks: [{ label: 'x₁ =', answer: 1.5 }],
          },
        },
        {
          kind: 'activity',
          title: L('Running off', 'Menjauh'),
          step: {
            kind: 'quiz',
            id: 'p9',
            prompt: L(T`For $f(x)=\sqrt[3]{x}$, with root $0$, Newton's method from $x_0=1$ gives which sequence?`, T`Untuk $f(x)=\sqrt[3]{x}$, dengan akar $0$, metode Newton dari $x_0=1$ memberi barisan apa?`),
            options: [
              L(T`$1,-2,4,-8,\ldots$: it runs off, because $x_{n+1}=-2x_n$`, T`$1,-2,4,-8,\ldots$: ia menjauh, karena $x_{n+1}=-2x_n$`),
              L(T`$1,\frac12,\frac14,\ldots$ toward $0$`, T`$1,\frac12,\frac14,\ldots$ menuju $0$`),
              L(T`$1,0,0,\ldots$`, T`$1,0,0,\ldots$`),
              L(T`$1,1,1,\ldots$`, T`$1,1,1,\ldots$`),
            ],
            answer: 0,
            explain: L(T`$\frac{f(x)}{f'(x)}=\frac{x^{1/3}}{\frac13x^{-2/3}}=3x$, so $x_{n+1}=x_n-3x_n=-2x_n$.`, T`$\frac{f(x)}{f'(x)}=\frac{x^{1/3}}{\frac13x^{-2/3}}=3x$, sehingga $x_{n+1}=x_n-3x_n=-2x_n$.`),
            hint: L(T`Compute $\frac{f(x)}{f'(x)}$.`, T`Hitung $\frac{f(x)}{f'(x)}$.`),
          },
        },
        {
          kind: 'activity',
          title: L('A double root', 'Akar ganda'),
          step: {
            kind: 'quiz',
            id: 'p10',
            prompt: L(T`For $f(x)=(x-1)^2$, how does the error of Newton's method change from one step to the next?`, T`Untuk $f(x)=(x-1)^2$, bagaimana galat metode Newton berubah dari satu langkah ke langkah berikutnya?`),
            options: [
              L(T`it is halved, like bisection: the convergence is only linear`, T`ia dibagi dua, seperti bisection: konvergensinya hanya linear`),
              L(T`it is squared`, T`ia dikuadratkan`),
              L(T`it stays the same`, T`ia tetap sama`),
              L(T`it doubles`, T`ia berlipat dua`),
            ],
            answer: 0,
            explain: L(T`$x_{n+1}=x_n-\frac{(x_n-1)^2}{2(x_n-1)}=x_n-\frac{x_n-1}{2}$, so $e_{n+1}=\frac{e_n}{2}$.`, T`$x_{n+1}=x_n-\frac{(x_n-1)^2}{2(x_n-1)}=x_n-\frac{x_n-1}{2}$, sehingga $e_{n+1}=\frac{e_n}{2}$.`),
            hint: L(T`Compute $x_{n+1}-1$ in terms of $x_n-1$.`, T`Hitung $x_{n+1}-1$ dalam $x_n-1$.`),
          },
        },
        {
          kind: 'activity',
          title: L('A root of multiplicity 4', 'Akar berkelipatan 4'),
          step: {
            kind: 'math',
            id: 'p11',
            hints: [L(T`For $f(x)=(x-r)^m$: $x_{n+1}-r=(x_n-r)-\frac{x_n-r}{m}$.`, T`Untuk $f(x)=(x-r)^m$: $x_{n+1}-r=(x_n-r)-\frac{x_n-r}{m}$.`), L(T`The ratio is $\frac{m-1}{m}$, with $m=4$.`, T`Rasionya $\frac{m-1}{m}$, dengan $m=4$.`)],
            explain: L(T`$\frac{e_{n+1}}{e_n}=\frac{m-1}{m}=\frac34=0.75$.`, T`$\frac{e_{n+1}}{e_n}=\frac{m-1}{m}=\frac34=0{,}75$.`),
            prompt: L(T`For a root of multiplicity $4$, what is the ratio $\frac{e_{n+1}}{e_n}$ of Newton's method?`, T`Untuk akar berkelipatan $4$, berapa rasio $\frac{e_{n+1}}{e_n}$ metode Newton?`),
            given: String.raw`\frac{e_{n+1}}{e_n}=v`,
            blanks: [{ label: 'rasio =', answer: 0.75 }],
          },
        },
        {
          kind: 'activity',
          title: L('How far out can you start?', 'Sejauh apa boleh mulai?'),
          step: {
            kind: 'quiz',
            id: 'p12',
            prompt: L(T`For $f(x)=\arctan x$, which of these starting values makes Newton's method converge to the root $0$?`, T`Untuk $f(x)=\arctan x$, nilai awal mana yang membuat metode Newton konvergen ke akar $0$?`),
            options: [
              L(T`$x_0=1.3$`, T`$x_0=1{,}3$`),
              L(T`$x_0=1.5$`, T`$x_0=1{,}5$`),
              L(T`$x_0=2$`, T`$x_0=2$`),
              L(T`$x_0=10$`, T`$x_0=10$`),
            ],
            answer: 0,
            explain: L(T`It converges when $|x_0|$ is below about $1.3917$. At $1.5$, $2$ or $10$ each step lands farther out than the last.`, T`Ia konvergen bila $|x_0|$ di bawah sekitar $1{,}3917$. Di $1{,}5$, $2$, atau $10$ setiap langkah mendarat lebih jauh daripada sebelumnya.`),
            hint: L(T`The limit of the good starts is where $2x=(1+x^2)\arctan x$.`, T`Batas awal yang baik ada di tempat $2x=(1+x^2)\arctan x$.`),
          },
        },
      ],
    },

    /* ---------------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: Newton’s method at a glance', 'Ringkasan: metode Newton sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **The formula:** $x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}$, the zero of the tangent line at $x_n$; it needs $f'(x_n)\ne0$.
- **How to use it:** write the equation as $f(x)=0$, choose $x_0$ from a graph or a sign change, iterate, and stop when the step and $f(x_n)$ are both small.
- **Speed:** quadratic at a simple root, $e_{n+1}=\frac{f''(\xi)}{2f'(x_n)}e_n^2$; linear, with ratio $\frac{m-1}{m}$, at a root of multiplicity $m$.
- **Failures:** a horizontal tangent, a cycle ($x^3-2x+2$ from $0$), running off ($\sqrt[3]{x}$, $\arctan x$ far out), the wrong root ($\sin x$ from $1.7$).
- **Basins:** the starts that reach each root; the boundaries between them can be fine.
- **By hand:** $\frac12\left(x+\frac ax\right)$ for $\sqrt a$ and $x(2-ax)$ for $\frac1a$.
- **Safeguards:** a bracket and bisection as a fallback, a step limit, and a check of both the step and $|f|$.
- **Next:** antiderivatives, the reverse of differentiation.
- **Code:** a loop with a stopping rule; SymPy ´lambdify´ and ´diff´, or a central difference.`,
            T`- **Rumusnya:** $x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}$, nol garis singgung di $x_n$; ia memerlukan $f'(x_n)\ne0$.
- **Cara memakainya:** tulis persamaan sebagai $f(x)=0$, pilih $x_0$ dari grafik atau perubahan tanda, beriterasi, dan berhenti ketika langkah dan $f(x_n)$ sama-sama kecil.
- **Kecepatan:** kuadrat di akar sederhana, $e_{n+1}=\frac{f''(\xi)}{2f'(x_n)}e_n^2$; linear, dengan rasio $\frac{m-1}{m}$, di akar berkelipatan $m$.
- **Kegagalan:** garis singgung mendatar, siklus ($x^3-2x+2$ dari $0$), menjauh ($\sqrt[3]{x}$, $\arctan x$ jauh di luar), akar yang keliru ($\sin x$ dari $1{,}7$).
- **Daerah tarikan:** awal yang mencapai tiap akar; batas di antaranya dapat sangat halus.
- **Dengan tangan:** $\frac12\left(x+\frac ax\right)$ untuk $\sqrt a$ dan $x(2-ax)$ untuk $\frac1a$.
- **Pengaman:** selang dan bisection sebagai cadangan, batas langkah, dan pemeriksaan langkah serta $|f|$.
- **Berikutnya:** antiturunan, kebalikan dari diferensiasi.
- **Kode:** perulangan dengan aturan berhenti; SymPy ´lambdify´ dan ´diff´, atau selisih pusat.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Root', 'Akar'), definition: L('A number r where a function is zero, f(r) = 0, and so a solution of the equation f(x) = 0.', 'Bilangan r tempat fungsi bernilai nol, f(r) = 0, sehingga merupakan solusi persamaan f(x) = 0.') },
    { term: L('Newton’s method', 'Metode Newton'), definition: L('An iteration that replaces each approximation of a root by the point where the tangent line of the function crosses the x-axis.', 'Iterasi yang mengganti setiap hampiran akar dengan titik tempat garis singgung fungsi memotong sumbu-x.') },
    { term: L('Iteration', 'Iterasi'), definition: L('Repeating the same formula, each time on the result of the last step, to produce a sequence of approximations.', 'Mengulang rumus yang sama, setiap kali pada hasil langkah terakhir, untuk menghasilkan barisan hampiran.') },
    { term: L('Quadratic convergence', 'Konvergensi kuadrat'), definition: L('A rate at which the error is roughly squared at each step, so the number of correct digits doubles.', 'Laju yang galatnya kira-kira dikuadratkan di setiap langkah, sehingga banyaknya angka benar berlipat dua.') },
    { term: L('Multiple root', 'Akar ganda'), definition: L('A root where the derivative is also zero, so that the function has a factor (x − r) raised to a power m greater than one.', 'Akar tempat turunannya juga nol, sehingga fungsi memiliki faktor (x − r) berpangkat m yang lebih besar dari satu.') },
    { term: L('Basin of attraction', 'Daerah tarikan'), definition: L('The set of starting values from which an iteration converges to a given root.', 'Himpunan nilai awal tempat suatu iterasi konvergen ke akar tertentu.') },
    { term: L('Bisection method', 'Metode bisection'), definition: L('A root-finding method that halves a bracket where the function changes sign; it is slower than Newton’s method but cannot fail inside the bracket.', 'Metode pencarian akar yang membagi dua selang tempat fungsi berubah tanda; ia lebih lambat daripada metode Newton tetapi tidak dapat gagal di dalam selang.') },
  ],

  howTo: [
    {
      name: L('How to find a root with Newton’s method', 'Cara mencari akar dengan metode Newton'),
      description: L('Write the equation as f(x) = 0, choose a start, and repeat the tangent-line formula until the steps are small.', 'Tulis persamaan sebagai f(x) = 0, pilih awal, dan ulangi rumus garis singgung sampai langkahnya kecil.'),
      steps: [
        { name: L('Write f of x equal to zero', 'Tulis f(x) sama dengan nol'), text: L('Move every term to one side so that the equation reads f of x equals zero, and find the derivative.', 'Pindahkan semua suku ke satu sisi sehingga persamaan berbunyi f(x) sama dengan nol, dan cari turunannya.') },
        { name: L('Choose a first guess', 'Pilih tebakan pertama'), text: L('Graph the function or find an interval where it changes sign, and pick a start near the root you want.', 'Gambar fungsinya atau cari selang tempat ia berubah tanda, dan pilih awal di dekat akar yang kamu inginkan.') },
        { name: L('Iterate', 'Beriterasi'), text: L('Compute x n plus one as x n minus f of x n divided by f prime of x n, keeping all the digits.', 'Hitung x n tambah satu sebagai x n dikurangi f dari x n dibagi f aksen dari x n, dengan menyimpan semua angka.') },
        { name: L('Stop and check', 'Berhenti dan periksa'), text: L('Stop when the step and f of x are both small, and check by substituting the answer into the original equation.', 'Berhenti ketika langkah dan f dari x sama-sama kecil, dan periksa dengan memasukkan jawaban ke persamaan semula.') },
      ],
    },
    {
      name: L('How to make Newton’s method safer', 'Cara membuat metode Newton lebih aman'),
      description: L('Combine it with a bracket, a step limit and two stopping conditions.', 'Gabungkan dengan selang, batas langkah, dan dua syarat berhenti.'),
      steps: [
        { name: L('Bracket the root', 'Apit akarnya'), text: L('Find a and b with f of a and f of b of opposite signs, so that the Intermediate Value Theorem guarantees a root between them.', 'Cari a dan b dengan f dari a dan f dari b berlawanan tanda, sehingga Teorema Nilai Antara menjamin akar di antaranya.') },
        { name: L('Take a Newton step', 'Ambil langkah Newton'), text: L('If the Newton step stays inside the bracket, use it; if not, use a bisection step instead.', 'Jika langkah Newton tetap di dalam selang, pakai; jika tidak, pakai langkah bisection.') },
        { name: L('Shrink the bracket', 'Perkecil selang'), text: L('Replace a or b by the new point so that the signs of f at the ends stay opposite.', 'Ganti a atau b dengan titik baru sehingga tanda f di ujung tetap berlawanan.') },
        { name: L('Limit and stop', 'Batasi dan berhenti'), text: L('Give up after a fixed number of steps, and stop only when both the step and the value of f are small.', 'Menyerah setelah sejumlah langkah tetap, dan berhenti hanya ketika langkah dan nilai f sama-sama kecil.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is Newton’s method?', 'Apa itu metode Newton?'),
      a: L(
        'It is a way to approximate a solution of f of x equal to zero. From a guess it takes the point where the tangent line of the function crosses the x-axis, and repeats. The formula is x minus f of x divided by f prime of x.',
        'Itu adalah cara menghampiri solusi f(x) sama dengan nol. Dari sebuah tebakan ia mengambil titik tempat garis singgung fungsi memotong sumbu-x, lalu mengulang. Rumusnya x dikurangi f(x) dibagi f aksen dari x.',
      ),
    },
    {
      q: L('How do you choose the starting value?', 'Bagaimana memilih nilai awal?'),
      a: L(
        'Graph the function, or find an interval where it changes sign, and pick a value near the root you want. A start close to a simple root converges very fast; a start far away may cycle, run off or reach another root.',
        'Gambar fungsinya, atau cari selang tempat ia berubah tanda, dan pilih nilai di dekat akar yang kamu inginkan. Awal yang dekat dengan akar sederhana konvergen sangat cepat; awal yang jauh dapat berputar, menjauh, atau mencapai akar lain.',
      ),
    },
    {
      q: L('How fast does Newton’s method converge?', 'Seberapa cepat metode Newton konvergen?'),
      a: L(
        'At a simple root it converges quadratically: the error is roughly squared at each step, so the number of correct digits doubles. At a multiple root it is only linear, and the error shrinks by the factor m minus one over m.',
        'Di akar sederhana ia konvergen secara kuadrat: galatnya kira-kira dikuadratkan di setiap langkah, sehingga banyaknya angka benar berlipat dua. Di akar ganda ia hanya linear, dan galat mengecil dengan faktor m dikurangi satu per m.',
      ),
    },
    {
      q: L('When does Newton’s method fail?', 'Kapan metode Newton gagal?'),
      a: L(
        'When the derivative is zero at an approximation, when the approximations cycle or run off to infinity, when the start is too far from the root, or when the root is multiple and the convergence is slow. It can also reach a root that is not the one you wanted.',
        'Ketika turunannya nol di suatu hampiran, ketika hampirannya berputar atau menjauh ke tak hingga, ketika awalnya terlalu jauh dari akar, atau ketika akarnya ganda dan konvergensinya lambat. Ia juga dapat mencapai akar yang bukan yang kamu inginkan.',
      ),
    },
    {
      q: L('When should you stop iterating?', 'Kapan berhenti beriterasi?'),
      a: L(
        'Stop when the change between two approximations is smaller than the accuracy you need, and also check that f of x is close to zero. A small value of f alone is not enough for a flat curve, and a limit on the number of steps protects against cycles.',
        'Berhentilah ketika perubahan antara dua hampiran lebih kecil daripada ketelitian yang kamu perlukan, dan periksa juga bahwa f(x) dekat dengan nol. Nilai f yang kecil saja tidak cukup untuk kurva datar, dan batas banyaknya langkah melindungi dari siklus.',
      ),
    },
    {
      q: L('How is Newton’s method used to compute square roots?', 'Bagaimana metode Newton dipakai untuk menghitung akar kuadrat?'),
      a: L(
        'Apply it to x squared minus a. The formula becomes the average of x and a divided by x, which is the Babylonian rule. Starting from 1, the square root of 2 is correct to twelve decimals after four steps.',
        'Terapkan pada x kuadrat dikurangi a. Rumusnya menjadi rata-rata x dan a dibagi x, yaitu aturan Babilonia. Dimulai dari 1, akar kuadrat 2 benar sampai dua belas desimal setelah empat langkah.',
      ),
    },
    {
      q: L('What is the difference between Newton’s method and bisection?', 'Apa beda metode Newton dan bisection?'),
      a: L(
        'Bisection halves a bracket where the function changes sign, so it always works there but gains only about a third of a digit per step. Newton’s method needs the derivative and a good start, and when it works it doubles the correct digits at each step.',
        'Bisection membagi dua selang tempat fungsi berubah tanda, sehingga selalu berhasil di sana tetapi hanya menambah sekitar sepertiga angka per langkah. Metode Newton memerlukan turunan dan awal yang baik, dan ketika berhasil ia melipatduakan angka benar di setiap langkah.',
      ),
    },
    {
      q: L('Who invented Newton’s method?', 'Siapa yang menemukan metode Newton?'),
      a: L(
        'Isaac Newton solved equations this way in 1669, and Joseph Raphson published a simpler repeating formula in 1690. Thomas Simpson gave the form with derivatives in 1740. The averaging rule for square roots is much older, from Babylon and Heron.',
        'Isaac Newton menyelesaikan persamaan dengan cara ini pada 1669, dan Joseph Raphson menerbitkan rumus berulang yang lebih sederhana pada 1690. Thomas Simpson memberi bentuk dengan turunan pada 1740. Aturan perata-rataan untuk akar kuadrat jauh lebih tua, dari Babilonia dan Heron.',
      ),
    },
  ],

  references: [
    { title: "Thomas' Calculus: Early Transcendentals in SI Units (15th ed.), Section 4.7: Newton's Method", author: 'Joel Hass, Christopher Heil, Maurice D. Weir et al.', year: 2023, source: 'Pearson' },
    { title: 'Calculus (8th ed.), section 4.8: Newton’s Method', author: 'James Stewart', year: 2015, source: 'Cengage Learning' },
    { title: 'Analysis aequationum universalis', author: 'Joseph Raphson', year: 1690, source: 'London' },
    { title: 'Essay on the Several Parts of the Doctrine of Fluxions, Section on the Resolution of Equations', author: 'Thomas Simpson', year: 1740, source: 'London' },
  ],

  related: ['linearization-and-differentials', 'applied-optimization', 'concavity-and-curve-sketching', 'the-mean-value-theorem'],
}
