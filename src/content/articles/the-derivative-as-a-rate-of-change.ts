import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './the-derivative-as-a-rate-of-change.meta'

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
    T`**A derivative is a rate of change: it says how fast one quantity changes per unit of another, in the units of the first divided by the units of the second.** For a body moving along a line with position $s(t)$, velocity is $\frac{ds}{dt}$, speed is its absolute value, acceleration is $\frac{d^2s}{dt^2}$ and jerk is $\frac{d^3s}{dt^3}$. In economics the derivative of cost is the marginal cost, close to the price of one more unit.`,
    T`**Turunan adalah laju perubahan: ia menyatakan seberapa cepat satu besaran berubah per satuan besaran lain, dalam satuan yang pertama dibagi satuan yang kedua.** Untuk benda yang bergerak sepanjang garis lurus dengan posisi $s(t)$, kecepatan adalah $\frac{ds}{dt}$, laju adalah nilai mutlaknya, percepatan adalah $\frac{d^2s}{dt^2}$, dan sentakan adalah $\frac{d^3s}{dt^3}$. Dalam ekonomi turunan biaya adalah biaya marjinal, yang dekat dengan harga satu satuan lagi.`,
  ),

  keyPoints: [
    L(
      T`The derivative $\frac{dy}{dx}$ is the instantaneous rate of change of $y$ with respect to $x$; its units are units of $y$ per unit of $x$, and it changes if you change the variable (area against radius or against diameter).`,
      T`Turunan $\frac{dy}{dx}$ adalah laju perubahan sesaat $y$ terhadap $x$; satuannya adalah satuan $y$ per satuan $x$, dan ia berubah bila peubahnya diganti (luas terhadap jari-jari atau terhadap diameter).`,
    ),
    L(
      T`Velocity is $v=\frac{ds}{dt}$ and its sign is the direction; speed is $|v|$; acceleration is $a=\frac{dv}{dt}=\frac{d^2s}{dt^2}$; jerk is $\frac{da}{dt}$. A body speeds up when $v$ and $a$ have the same sign and slows down when they differ.`,
      T`Kecepatan adalah $v=\frac{ds}{dt}$ dan tandanya adalah arah; laju adalah $|v|$; percepatan adalah $a=\frac{dv}{dt}=\frac{d^2s}{dt^2}$; sentakan adalah $\frac{da}{dt}$. Benda makin cepat bila $v$ dan $a$ bertanda sama dan makin lambat bila berbeda.`,
    ),
    L(
      T`In free fall $s=4.9t^2$ metres gives $v=9.8t$ and the constant acceleration $9.8\ \text{m/s}^2$; a rock thrown up at $49$ m/s peaks after $5$ s at $122.5$ m and lands after $10$ s.`,
      T`Pada jatuh bebas $s=4{,}9t^2$ meter memberi $v=9{,}8t$ dan percepatan tetap $9{,}8\ \text{m/s}^2$; batu yang dilempar ke atas dengan $49$ m/s mencapai puncak setelah $5$ detik pada $122{,}5$ m dan mendarat setelah $10$ detik.`,
    ),
    L(
      T`Marginal cost $c'(x)$ approximates the cost of one more unit, and marginal revenue $r'(x)$ the extra revenue; their difference estimates the extra profit. The approximation is good when the slope changes slowly.`,
      T`Biaya marjinal $c'(x)$ menghampiri biaya satu satuan lagi, dan pendapatan marjinal $r'(x)$ pendapatan tambahannya; selisihnya menaksir laba tambahan. Hampiran itu baik bila gradiennya berubah pelan.`,
    ),
    L(
      T`A large $|f'|$ means that $f$ is sensitive to its input: a small change in $x$ makes a large change in $f(x)$.`,
      T`$|f'|$ yang besar berarti $f$ peka terhadap masukannya: perubahan kecil pada $x$ membuat perubahan besar pada $f(x)$.`,
    ),
    L(
      T`From data, a derivative is a difference quotient, and every differentiation amplifies measurement noise: position noise of $0.01$ m becomes a velocity error of $0.7$ m/s and an acceleration error of about $60$ m/s².`,
      T`Dari data, turunan adalah hasil bagi selisih, dan setiap penurunan memperbesar derau pengukuran: derau posisi $0{,}01$ m menjadi galat kecepatan $0{,}7$ m/s dan galat percepatan sekitar $60$ m/s².`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------------- rates and units */
    {
      id: 'rates-and-units',
      heading: L('How do you measure how fast one quantity changes with another?', 'Bagaimana mengukur seberapa cepat satu besaran berubah terhadap besaran lain?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**You take the derivative of the first quantity with respect to the second, and read it in units of the first per unit of the second.** If $y$ depends on $x$, the difference quotient $\frac{\Delta y}{\Delta x}$ is the *average* rate of change over a step, and its limit $\frac{dy}{dx}$ is the *instantaneous* rate of change. The word "instantaneous" is used even when $x$ is not time, and it is often dropped: "the rate of change" means the instantaneous one. This is the same limit as the [derivative at a point](article:tangent-lines-and-derivative-at-a-point#rates-of-change), now read as a rate.

The units come out of the quotient. If the area $A$ of a circle is measured in square meters and its diameter $D$ in meters, then $\frac{dA}{dD}$ is in square meters per meter. For $A=\frac{\pi D^2}{4}$,
$$\frac{dA}{dD}=\frac{\pi D}{2},$$
so when $D=10$ m the area is growing at $5\pi\approx15.71$ square meters for every extra meter of diameter.

**The rate depends on the variable you choose.** The same circle measured by its radius has $A=\pi r^2$ and $\frac{dA}{dr}=2\pi r$. At $D=2r$ that is twice as large as $\frac{dA}{dD}$, because the diameter grows twice as fast as the radius. Like kilometers per hour against meters per second, a rate always belongs to a pair of units.

**The rates that turn out to be geometry.** For a circle, $\frac{dA}{dr}=2\pi r$ is its *circumference*; for a sphere, $\frac{dV}{dr}=4\pi r^2$ is its *surface area*; for a cube, $\frac{dV}{da}=3a^2$ is the area of three faces. The reason is the same in each: a slightly larger shape is the old one plus a thin layer, and the layer's volume is its area times its thickness.

**Estimating a change.** Since $\Delta y\approx\frac{dy}{dx}\,\Delta x$ for a small step, the rate gives a quick estimate. A sphere's radius grows from $2$ m to $2.2$ m: the volume rate at $r=2$ is $4\pi\cdot4\approx50.27$ cubic meters per meter, so $\Delta V\approx50.27\cdot0.2\approx10.05$ cubic meters. The exact change is $\frac43\pi\left(2.2^3-2^3\right)\approx11.09$, about $10\%$ more: the estimate uses the slope at the start of the step, and the surface grows as the sphere does. A smaller step shrinks the error.

Pick a shape below and compare the exact increase with the rate.`,
            T`**Kamu menurunkan besaran pertama terhadap besaran kedua, dan membacanya dalam satuan yang pertama per satuan yang kedua.** Jika $y$ bergantung pada $x$, hasil bagi selisih $\frac{\Delta y}{\Delta x}$ adalah laju perubahan *rata-rata* pada suatu langkah, dan limitnya $\frac{dy}{dx}$ adalah laju perubahan *sesaat*. Kata "sesaat" dipakai juga bila $x$ bukan waktu, dan sering dihilangkan: "laju perubahan" berarti yang sesaat. Ini limit yang sama dengan [turunan di suatu titik](article:tangent-lines-and-derivative-at-a-point#rates-of-change), kini dibaca sebagai laju.

Satuannya muncul dari hasil bagi. Jika luas $A$ lingkaran diukur dalam meter persegi dan diameternya $D$ dalam meter, maka $\frac{dA}{dD}$ dalam meter persegi per meter. Untuk $A=\frac{\pi D^2}{4}$,
$$\frac{dA}{dD}=\frac{\pi D}{2},$$
sehingga saat $D=10$ m luasnya bertambah $5\pi\approx15{,}71$ meter persegi untuk setiap tambahan satu meter diameter.

**Laju bergantung pada peubah yang kamu pilih.** Lingkaran yang sama diukur dengan jari-jarinya memiliki $A=\pi r^2$ dan $\frac{dA}{dr}=2\pi r$. Pada $D=2r$ itu dua kali lebih besar daripada $\frac{dA}{dD}$, karena diameter bertambah dua kali lebih cepat daripada jari-jari. Seperti kilometer per jam terhadap meter per detik, laju selalu milik sepasang satuan.

**Laju yang ternyata geometri.** Untuk lingkaran, $\frac{dA}{dr}=2\pi r$ adalah *kelilingnya*; untuk bola, $\frac{dV}{dr}=4\pi r^2$ adalah *luas permukaannya*; untuk kubus, $\frac{dV}{da}=3a^2$ adalah luas tiga sisinya. Alasannya sama pada tiap kasus: bangun yang sedikit lebih besar adalah bangun lama ditambah selapis tipis, dan volume lapisan itu adalah luasnya kali tebalnya.

**Menaksir perubahan.** Karena $\Delta y\approx\frac{dy}{dx}\,\Delta x$ untuk langkah kecil, laju memberi taksiran cepat. Jari-jari bola bertambah dari $2$ m ke $2{,}2$ m: laju volume di $r=2$ adalah $4\pi\cdot4\approx50{,}27$ meter kubik per meter, sehingga $\Delta V\approx50{,}27\cdot0{,}2\approx10{,}05$ meter kubik. Perubahan eksaknya $\frac43\pi\left(2{,}2^3-2^3\right)\approx11{,}09$, sekitar $10\%$ lebih besar: taksiran memakai gradien di awal langkah, dan permukaannya membesar bersama bola. Langkah yang lebih kecil memperkecil galatnya.

Pilih sebuah bangun di bawah dan bandingkan pertambahan eksak dengan lajunya.`,
          ),
        },
        { kind: 'widget', name: 'georates' },
      ],
    },

    /* --------------------------------------------------------- motion along a line */
    {
      id: 'motion-along-a-line',
      heading: L('How do velocity, speed and acceleration come from derivatives?', 'Bagaimana kecepatan, laju, dan percepatan berasal dari turunan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**For a body moving along a line with position $s(t)$, velocity is the derivative of position, acceleration is the derivative of velocity, and jerk is the derivative of acceleration: $v=\frac{ds}{dt}$, $a=\frac{dv}{dt}=\frac{d^2s}{dt^2}$ and $j=\frac{da}{dt}=\frac{d^3s}{dt^3}$.** The line is usually horizontal or vertical, and $s$ is the coordinate on it.

- **Displacement and average velocity.** From $t$ to $t+\Delta t$ the displacement is $\Delta s=s(t+\Delta t)-s(t)$ and the average velocity is $\frac{\Delta s}{\Delta t}$.
- **Velocity** is the limit of the average velocity as $\Delta t\to0$. Its *sign* is the direction: positive when $s$ is increasing (forward, or upward on a vertical line), negative when $s$ is decreasing.
- **Speed** is the absolute value $|v|$, the rate of progress with no direction. A car driven to a friend's house and back at 50 km/h has a speedometer that shows 50 both ways, though its velocity is $+50$ then $-50$.
- **Acceleration** says how fast the velocity changes: it is the second derivative of position. It is measured in units of velocity per unit of time, such as $\text{m/s}^2$.
- **Jerk** is the rate of change of acceleration. A ride feels jerky when the acceleration changes abruptly, not necessarily when it is large.

A graph of $s$ against $t$ is *not* the path of the body: the path lies on the line, and the graph shows where the body is *when*. Its slope is the velocity.

**Speeding up or slowing down.** A body speeds up when velocity and acceleration have the same sign (it picks up speed in the direction it is going) and slows down when they have opposite signs. Acceleration alone does not tell you: $a<0$ with $v<0$ is a body moving backward and speeding up.

**An example.** Take $s=t^3-6t^2+9t$ meters for $0\le t\le4$ seconds. Then $v=3t^2-12t+9=3(t-1)(t-3)$ and $a=6t-12$. The velocity is zero at $t=1$ and $t=3$, where the body turns round: $s(1)=4$ and $s(3)=0$. The table of the motion is

- $0<t<1$: $v>0$, $a<0$, forward and slowing down;
- $1<t<2$: $v<0$, $a<0$, backward and speeding up;
- $2<t<3$: $v<0$, $a>0$, backward and slowing down;
- $3<t<4$: $v>0$, $a>0$, forward and speeding up.

The displacement over $[0,4]$ is $s(4)-s(0)=4$ m and the average velocity is $1$ m/s, but the body actually travels $4+4+4=12$ m, because the distance is added up piece by piece between the turns. At $t=2$, where $a=0$, the speed is $|v(2)|=3$ m/s.

Type your own position function below: it finds the turns exactly (even when they are not fractions), classifies every interval, and adds up the distance.`,
            T`**Untuk benda yang bergerak sepanjang garis lurus dengan posisi $s(t)$, kecepatan adalah turunan posisi, percepatan adalah turunan kecepatan, dan sentakan adalah turunan percepatan: $v=\frac{ds}{dt}$, $a=\frac{dv}{dt}=\frac{d^2s}{dt^2}$, dan $j=\frac{da}{dt}=\frac{d^3s}{dt^3}$.** Garisnya biasanya mendatar atau tegak, dan $s$ adalah koordinat pada garis itu.

- **Perpindahan dan kecepatan rata-rata.** Dari $t$ sampai $t+\Delta t$ perpindahannya $\Delta s=s(t+\Delta t)-s(t)$ dan kecepatan rata-ratanya $\frac{\Delta s}{\Delta t}$.
- **Kecepatan** adalah limit kecepatan rata-rata saat $\Delta t\to0$. *Tanda*nya adalah arah: positif bila $s$ bertambah (maju, atau naik pada garis tegak), negatif bila $s$ berkurang.
- **Laju** adalah nilai mutlak $|v|$, kemajuan tanpa arah. Mobil yang dikendarai ke rumah teman dan kembali dengan 50 km/jam memiliki spidometer yang menunjukkan 50 pada kedua arah, padahal kecepatannya $+50$ lalu $-50$.
- **Percepatan** menyatakan seberapa cepat kecepatan berubah: ia turunan kedua posisi. Satuannya satuan kecepatan per satuan waktu, seperti $\text{m/s}^2$.
- **Sentakan** adalah laju perubahan percepatan. Perjalanan terasa tersentak-sentak bila percepatan berubah mendadak, belum tentu bila ia besar.

Grafik $s$ terhadap $t$ *bukan* lintasan benda: lintasannya terletak pada garis, dan grafik memperlihatkan di mana benda itu *kapan*. Gradiennya adalah kecepatan.

**Makin cepat atau makin lambat.** Benda makin cepat bila kecepatan dan percepatan bertanda sama (ia menambah laju searah geraknya) dan makin lambat bila bertanda berlawanan. Percepatan saja belum menentukan: $a<0$ dengan $v<0$ adalah benda yang bergerak mundur dan makin cepat.

**Contoh.** Ambil $s=t^3-6t^2+9t$ meter untuk $0\le t\le4$ detik. Maka $v=3t^2-12t+9=3(t-1)(t-3)$ dan $a=6t-12$. Kecepatan nol di $t=1$ dan $t=3$, tempat benda berbalik arah: $s(1)=4$ dan $s(3)=0$. Tabel geraknya:

- $0<t<1$: $v>0$, $a<0$, maju dan makin lambat;
- $1<t<2$: $v<0$, $a<0$, mundur dan makin cepat;
- $2<t<3$: $v<0$, $a>0$, mundur dan makin lambat;
- $3<t<4$: $v>0$, $a>0$, maju dan makin cepat.

Perpindahan pada $[0,4]$ adalah $s(4)-s(0)=4$ m dan kecepatan rata-ratanya $1$ m/s, tetapi benda sebenarnya menempuh $4+4+4=12$ m, karena jarak dijumlahkan bagian demi bagian di antara putaran balik. Di $t=2$, tempat $a=0$, lajunya $|v(2)|=3$ m/s.

Ketik fungsi posisimu sendiri di bawah: alat itu menemukan putaran balik secara eksak (bahkan bila bukan pecahan), mengklasifikasi setiap selang, dan menjumlahkan jaraknya.`,
          ),
        },
        { kind: 'widget', name: 'motionline' },
      ],
    },

    /* ------------------------------------------------------------ free fall and throws */
    {
      id: 'free-fall-and-throws',
      heading: L('How do you analyze free fall and a thrown object?', 'Bagaimana menganalisis jatuh bebas dan benda yang dilempar?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Near the surface of the Earth every falling body has the same constant acceleration $g\approx9.8\ \text{m/s}^2$, so its distance fallen from rest is $s=\frac12gt^2=4.9t^2$ meters, its velocity is $v=9.8t$ and its acceleration is the constant $9.8$.** The formula comes from Galileo's experiments and holds in a vacuum; it models a dense, heavy object well for the first few seconds, before air resistance matters.

**A dropped ball bearing.** In the first $3$ s it falls $s(3)=4.9\cdot9=44.1$ m. Its velocity at that time is $v(3)=9.8\cdot3=29.4$ m/s downward, its speed is $29.4$ m/s and its acceleration is $9.8\ \text{m/s}^2$. Because the acceleration is constant, its jerk is $\frac{d}{dt}(9.8)=0$: nothing about free fall is jerky.

**A rock thrown straight up.** A blast sends a rock up with launch speed $49$ m/s, so its height is $s=49t-4.9t^2$ meters, measured upward, and $v=49-9.8t$.

- *How high does it go?* At the top the velocity is $0$: $49-9.8t=0$ gives $t=5$ s and $s(5)=245-122.5=122.5$ m.
- *Its speed at $78.4$ m, going up and coming down.* Solving $49t-4.9t^2=78.4$ gives $4.9(t^2-10t+16)=0$, which [factors](article:algebraic-expressions#factor) as $(t-2)(t-8)=0$: the rock is at $78.4$ m after $2$ s going up and after $8$ s coming down. The velocities are $v(2)=29.4$ and $v(8)=-29.4$ m/s: the *same speed*, in opposite directions.
- *Its acceleration.* $a=\frac{d}{dt}(49-9.8t)=-9.8\ \text{m/s}^2$ the whole time, up and down: gravity pulls downward, so the rock slows on the way up and speeds up on the way down. At the very top the velocity is zero and the acceleration is still $-9.8$.
- *When does it land?* $s=49t-4.9t^2=4.9\,t\,(10-t)=0$ gives $t=0$ (the blast) and $t=10$ s. Its velocity on landing is $v(10)=-49$ m/s: it comes back at the speed it left with.

**The same story with any launch speed $v_0$.** From $s=v_0t-\frac12gt^2$ the top is at $t=\frac{v_0}{g}$, its height is $\frac{v_0^2}{2g}$, the landing is at $t=\frac{2v_0}{g}$ (twice as long as the way up) and the landing velocity is $-v_0$. With $v_0=49$ and $g=9.8$ those are $5$ s, $\frac{2401}{19.6}=122.5$ m and $10$ s.

The graph of $s$ against $t$ is a parabola, but the rock moves along a vertical line: the parabola shows height against time, and its slope at each instant is the velocity. The tool of the previous section handles these: try the preset ´49t - 4.9t^2´ on $0\le t\le10$.`,
            T`**Di dekat permukaan Bumi setiap benda jatuh memiliki percepatan tetap yang sama $g\approx9{,}8\ \text{m/s}^2$, sehingga jarak jatuhnya dari keadaan diam adalah $s=\frac12gt^2=4{,}9t^2$ meter, kecepatannya $v=9{,}8t$, dan percepatannya tetap $9{,}8$.** Rumus ini berasal dari percobaan Galileo dan berlaku dalam ruang hampa; ia memodelkan benda padat dan berat dengan baik selama beberapa detik pertama, sebelum hambatan udara berarti.

**Bola baja yang dijatuhkan.** Dalam $3$ detik pertama ia jatuh $s(3)=4{,}9\cdot9=44{,}1$ m. Kecepatannya saat itu $v(3)=9{,}8\cdot3=29{,}4$ m/s ke bawah, lajunya $29{,}4$ m/s, dan percepatannya $9{,}8\ \text{m/s}^2$. Karena percepatannya tetap, sentakannya $\frac{d}{dt}(9{,}8)=0$: tidak ada yang tersentak-sentak pada jatuh bebas.

**Batu yang dilempar lurus ke atas.** Sebuah ledakan melontarkan batu ke atas dengan laju awal $49$ m/s, sehingga tingginya $s=49t-4{,}9t^2$ meter, diukur ke atas, dan $v=49-9{,}8t$.

- *Seberapa tinggi ia naik?* Di puncak kecepatannya $0$: $49-9{,}8t=0$ memberi $t=5$ detik dan $s(5)=245-122{,}5=122{,}5$ m.
- *Lajunya di $78{,}4$ m, saat naik dan saat turun.* Menyelesaikan $49t-4{,}9t^2=78{,}4$ memberi $4{,}9(t^2-10t+16)=0$, yang [difaktorkan](article:algebraic-expressions#factor) menjadi $(t-2)(t-8)=0$: batu berada di $78{,}4$ m setelah $2$ detik saat naik dan setelah $8$ detik saat turun. Kecepatannya $v(2)=29{,}4$ dan $v(8)=-29{,}4$ m/s: *laju yang sama*, dengan arah berlawanan.
- *Percepatannya.* $a=\frac{d}{dt}(49-9{,}8t)=-9{,}8\ \text{m/s}^2$ sepanjang waktu, naik dan turun: gravitasi menarik ke bawah, sehingga batu melambat saat naik dan makin cepat saat turun. Di puncak kecepatannya nol dan percepatannya tetap $-9{,}8$.
- *Kapan ia mendarat?* $s=49t-4{,}9t^2=4{,}9\,t\,(10-t)=0$ memberi $t=0$ (ledakan) dan $t=10$ detik. Kecepatannya saat mendarat $v(10)=-49$ m/s: ia kembali dengan laju yang sama dengan saat berangkat.

**Cerita yang sama untuk laju awal $v_0$ mana pun.** Dari $s=v_0t-\frac12gt^2$ puncaknya di $t=\frac{v_0}{g}$, tingginya $\frac{v_0^2}{2g}$, pendaratannya di $t=\frac{2v_0}{g}$ (dua kali lebih lama daripada naiknya) dan kecepatan mendaratnya $-v_0$. Dengan $v_0=49$ dan $g=9{,}8$ nilainya $5$ detik, $\frac{2401}{19{,}6}=122{,}5$ m, dan $10$ detik.

Grafik $s$ terhadap $t$ adalah parabola, tetapi batu bergerak sepanjang garis tegak: parabola itu menunjukkan tinggi terhadap waktu, dan gradiennya di tiap saat adalah kecepatan. Alat pada bagian sebelumnya menangani semua ini: coba prasetel ´49t - 4.9t^2´ pada $0\le t\le10$.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------- marginal analysis */
    {
      id: 'marginal-analysis',
      heading: L('What are marginal cost, marginal revenue and marginal profit?', 'Apa itu biaya, pendapatan, dan laba marjinal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**In economics a *marginal* quantity is a derivative: the marginal cost is the rate of change of the cost $c(x)$ with respect to the number of units $x$, $\frac{dc}{dx}$, and it estimates what one more unit costs.** The average cost of the next $h$ units is $\frac{c(x+h)-c(x)}{h}$; its limit as $h\to0$ is the marginal cost. Loosely, the marginal cost is defined as the extra cost of one more unit, $c(x+1)-c(x)$, which is approximated by $c'(x)$ when the slope of $c$ does not change quickly near $x$. The approximation often works well for large $x$.

**Cost, fixed and variable.** A total cost function is often a cubic polynomial $c(x)=\alpha x^3+\beta x^2+\gamma x+\delta$. The constant $\delta$ is the *fixed cost* (rent, equipment, management) that does not depend on $x$; the other terms are *variable costs* (materials, labor). A cubic is usually enough to capture how cost behaves over a realistic range.

**An example.** Let the cost of making $x$ radiators a day be $c(x)=x^3-6x^2+15x$ dollars, and the revenue from selling them $r(x)=x^3-3x^2+12x$ dollars. The shop makes $10$ a day. What does an eleventh cost, and what does it bring?

- Marginal cost: $c'(x)=3x^2-12x+15$, so $c'(10)=300-120+15=195$ dollars.
- Marginal revenue: $r'(x)=3x^2-6x+12$, so $r'(10)=300-60+12=252$ dollars.
- Estimated profit from the extra radiator: $252-195=57$ dollars.

The exact figures are $c(11)-c(10)=770-550=220$ dollars and $r(11)-r(10)=1100-820=280$ dollars, a profit of $60$. The estimates $195$, $252$ and $57$ are close but not equal, because the cost and revenue slopes rise as the output grows: the derivative is the rate *at* $x=10$, and one whole unit is a big step. A smaller step would agree better.

**Marginal profit.** Profit is revenue minus cost, $p=r-c$, so marginal profit is $r'-c'$. It is zero where marginal revenue equals marginal cost, a place where producing a little more or a little less changes the profit by about nothing. Finding the *best* production level among such places is a question about optimization, taken up later.

**Marginal tax rate.** Marginal rates appear in taxes too. If your marginal income tax rate is $28\%$ and your income rises by $1000$ dollars, you pay about $280$ dollars more in tax. That does *not* mean you pay $28\%$ of your whole income: it means $\frac{dT}{dI}=0.28$, the tax on each extra dollar. As income rises you may enter a higher bracket, and the marginal rate rises.

Type any cost and revenue below and compare each marginal value with the exact one-unit change.`,
            T`**Dalam ekonomi besaran *marjinal* adalah turunan: biaya marjinal adalah laju perubahan biaya $c(x)$ terhadap banyak satuan $x$, $\frac{dc}{dx}$, dan ia menaksir berapa biaya satu satuan lagi.** Biaya rata-rata $h$ satuan berikutnya adalah $\frac{c(x+h)-c(x)}{h}$; limitnya saat $h\to0$ adalah biaya marjinal. Secara longgar, biaya marjinal didefinisikan sebagai tambahan biaya satu satuan lagi, $c(x+1)-c(x)$, yang dihampiri oleh $c'(x)$ bila gradien $c$ tidak berubah cepat di dekat $x$. Hampiran itu sering bekerja baik untuk $x$ besar.

**Biaya tetap dan biaya variabel.** Fungsi biaya total sering berupa polinomial kubik $c(x)=\alpha x^3+\beta x^2+\gamma x+\delta$. Konstanta $\delta$ adalah *biaya tetap* (sewa, peralatan, manajemen) yang tidak bergantung pada $x$; suku lainnya adalah *biaya variabel* (bahan, tenaga kerja). Kubik biasanya cukup untuk menangkap perilaku biaya pada rentang yang realistis.

**Contoh.** Misalkan biaya membuat $x$ radiator sehari adalah $c(x)=x^3-6x^2+15x$ ribu rupiah, dan pendapatan dari menjualnya $r(x)=x^3-3x^2+12x$ ribu rupiah. Toko membuat $10$ sehari. Berapa biaya radiator kesebelas, dan berapa yang dihasilkannya?

- Biaya marjinal: $c'(x)=3x^2-12x+15$, sehingga $c'(10)=300-120+15=195$ ribu rupiah.
- Pendapatan marjinal: $r'(x)=3x^2-6x+12$, sehingga $r'(10)=300-60+12=252$ ribu rupiah.
- Taksiran laba dari radiator tambahan itu: $252-195=57$ ribu rupiah.

Angka eksaknya $c(11)-c(10)=770-550=220$ ribu rupiah dan $r(11)-r(10)=1100-820=280$ ribu rupiah, laba $60$. Taksiran $195$, $252$, dan $57$ dekat tetapi tidak sama, karena gradien biaya dan pendapatan naik seiring produksi: turunan adalah laju *di* $x=10$, dan satu satuan penuh adalah langkah yang besar. Langkah yang lebih kecil akan lebih cocok.

**Laba marjinal.** Laba adalah pendapatan dikurangi biaya, $p=r-c$, sehingga laba marjinal adalah $r'-c'$. Ia nol di tempat pendapatan marjinal sama dengan biaya marjinal, tempat memproduksi sedikit lebih banyak atau lebih sedikit mengubah laba hampir tidak sama sekali. Mencari tingkat produksi *terbaik* di antara tempat-tempat seperti itu adalah soal optimasi, yang dibahas kemudian.

**Tarif pajak marjinal.** Laju marjinal muncul juga pada pajak. Jika tarif pajak penghasilan marjinalmu $28\%$ dan penghasilanmu naik Rp1.000.000, kamu membayar sekitar Rp280.000 lebih banyak. Itu *tidak* berarti kamu membayar $28\%$ dari seluruh penghasilan: artinya $\frac{dT}{dI}=0{,}28$, pajak atas setiap rupiah tambahan. Saat penghasilan naik kamu mungkin masuk lapisan yang lebih tinggi, dan tarif marjinalnya naik.

Ketik biaya dan pendapatan apa pun di bawah dan bandingkan setiap nilai marjinal dengan perubahan eksak satu satuan.`,
          ),
        },
        { kind: 'widget', name: 'marginals' },
      ],
    },

    /* --------------------------------------------------------------------- sensitivity */
    {
      id: 'sensitivity',
      heading: L('How does the derivative measure sensitivity to change?', 'Bagaimana turunan mengukur kepekaan terhadap perubahan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A function is sensitive to its input where a small change in $x$ produces a large change in $f(x)$, and the derivative $f'(x)$ measures exactly that: the larger $|f'(x)|$, the more sensitive $f$ is at $x$.** On a graph that is the steepness of the tangent line.

**Peas and genes.** Gregor Mendel found that if $p$ (between $0$ and $1$) is the frequency of the gene for smooth skin in peas and $1-p$ that of wrinkled skin, then the proportion of smooth peas in the next generation is
$$y=2p(1-p)+p^2=2p-p^2.$$
The derivative is $\frac{dy}{dp}=2-2p$, close to $2$ for $p$ near $0$ and close to $0$ for $p$ near $1$. So the result is much more sensitive to $p$ when $p$ is small: adding a few smooth-skin genes to a population that is mostly wrinkled has a much bigger effect on later generations than adding the same number to a population that is already mostly smooth.

**Braking distance.** A model of the total stopping distance of a car at speed $V$ km/h is $s=0.21V+0.0063V^2$ meters: the linear part is the distance covered while the driver reacts, the quadratic part the braking distance. The derivative is $\frac{ds}{dV}=0.21+0.0126V$, which is $0.84$ meters per km/h at $50$ km/h and $1.47$ meters per km/h at $100$ km/h. The stopping distance is much more sensitive to speed when you are already going fast: from $50$ to $100$ km/h the speed doubles but the stopping distance goes from $26.25$ m to $84$ m, more than three times as far.

**How to read a sensitivity.** The derivative is an absolute rate (units of $f$ per unit of $x$), so it is the right measure when the units mean something to you: meters of distance for each km/h. A graph of $f'$ next to the graph of $f$, as in [graphing the derivative](article:the-derivative-as-a-function#graphing-the-derivative), shows at a glance where $f$ is most and least sensitive.`,
            T`**Fungsi peka terhadap masukannya di tempat perubahan kecil pada $x$ menghasilkan perubahan besar pada $f(x)$, dan turunan $f'(x)$ mengukur tepat itu: makin besar $|f'(x)|$, makin peka $f$ di $x$.** Pada grafik itu adalah kecuraman garis singgung.

**Kacang polong dan gen.** Gregor Mendel menemukan bahwa jika $p$ (di antara $0$ dan $1$) adalah frekuensi gen kulit halus pada kacang polong dan $1-p$ frekuensi gen kulit keriput, maka proporsi kacang halus pada generasi berikutnya adalah
$$y=2p(1-p)+p^2=2p-p^2.$$
Turunannya $\frac{dy}{dp}=2-2p$, dekat $2$ untuk $p$ dekat $0$ dan dekat $0$ untuk $p$ dekat $1$. Jadi hasilnya jauh lebih peka terhadap $p$ ketika $p$ kecil: menambahkan beberapa gen kulit halus ke populasi yang kebanyakan keriput berpengaruh jauh lebih besar pada generasi berikutnya daripada menambahkan jumlah yang sama ke populasi yang sudah kebanyakan halus.

**Jarak pengereman.** Sebuah model jarak henti total mobil pada kecepatan $V$ km/jam adalah $s=0{,}21V+0{,}0063V^2$ meter: bagian linear adalah jarak yang ditempuh selagi pengemudi bereaksi, bagian kuadrat adalah jarak pengereman. Turunannya $\frac{ds}{dV}=0{,}21+0{,}0126V$, yaitu $0{,}84$ meter per km/jam pada $50$ km/jam dan $1{,}47$ meter per km/jam pada $100$ km/jam. Jarak henti jauh lebih peka terhadap kecepatan ketika kamu sudah melaju cepat: dari $50$ ke $100$ km/jam kecepatan menjadi dua kali, tetapi jarak henti naik dari $26{,}25$ m menjadi $84$ m, lebih dari tiga kali.

**Cara membaca kepekaan.** Turunan adalah laju mutlak (satuan $f$ per satuan $x$), sehingga ia ukuran yang tepat bila satuannya bermakna bagimu: meter jarak untuk setiap km/jam. Grafik $f'$ di samping grafik $f$, seperti pada [menggambar grafik turunan](article:the-derivative-as-a-function#graphing-the-derivative), memperlihatkan sekilas di mana $f$ paling dan paling kurang peka.`,
          ),
        },
        {
          kind: 'figure',
          figure: {
            dim: 2,
            ticks: true,
            xSpan: [-0.2, 1.2],
            ySpan: [-0.3, 2.3],
            aspect: 0.55,
            items: [
              { t: 'curve', f: 'x*(2-x)', color: 'a', from: 0, to: 1 },
              { t: 'curve', f: '2-2*x', color: 'b', from: 0, to: 1 },
            ],
            caption: L(
              'Mendel\'s y = 2p − p² (green) and its derivative 2 − 2p (orange): the derivative is near 2 where p is small, so y is sensitive to p there, and near 0 where p is near 1.',
              'y = 2p − p² dari Mendel (hijau) dan turunannya 2 − 2p (jingga): turunan dekat 2 di tempat p kecil, sehingga y peka terhadap p di sana, dan dekat 0 di tempat p dekat 1.',
            ),
          },
        },
      ],
    },

    /* ------------------------------------------------------------------- in code */
    {
      id: 'rates-in-code',
      heading: L('How do you find rates of change from data in code?', 'Bagaimana mencari laju perubahan dari data dalam kode?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**When you have measurements instead of a formula, a derivative is a difference quotient of the data: use ´numpy.gradient´ on the positions to get velocities, and again on the velocities to get accelerations.** The function uses central differences inside the data and one-sided differences at the two ends. For a quadratic like free fall the central difference is exact, so the interior velocities are exactly $9.8t$ and the interior accelerations $9.8$, while the two end values are off, because a one-sided difference is only first-order accurate.`,
            T`**Bila yang kamu miliki pengukuran dan bukan rumus, turunan adalah hasil bagi selisih dari data: pakai ´numpy.gradient´ pada posisi untuk mendapat kecepatan, dan sekali lagi pada kecepatan untuk mendapat percepatan.** Fungsi itu memakai selisih terpusat di bagian dalam data dan selisih sepihak di kedua ujung. Untuk kuadrat seperti jatuh bebas selisih terpusat eksak, sehingga kecepatan di bagian dalam tepat $9{,}8t$ dan percepatannya $9{,}8$, sedangkan kedua nilai ujung meleset, karena selisih sepihak hanya akurat orde pertama.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: velocity and acceleration from positions', 'Python: kecepatan dan percepatan dari posisi'),
          code: `import numpy as np

t = np.linspace(0, 3, 7)               # a reading every half second
s = 4.9 * t**2                         # distance fallen, in meters
v = np.gradient(s, t)                  # velocity
a = np.gradient(v, t)                  # acceleration
print(np.round(v, 2))                  # [ 2.45  4.9   9.8  14.7  19.6  24.5  26.95]
print(np.round(9.8 * t, 2))            # [ 0.    4.9   9.8  14.7  19.6  24.5  29.4 ]   (the exact velocities)
print(np.round(a, 2))                  # [4.9  7.35 9.8  9.8  9.8  7.35 4.9 ]            (the exact value is 9.8)

c = lambda x: x**3 - 6*x**2 + 15*x     # the radiators' cost
print(c(11) - c(10), 3*10**2 - 12*10 + 15)   # 220 195: the next unit against the marginal cost`,
        },
        {
          kind: 'text',
          text: L(
            T`**Differentiating data makes noise louder.** Real measurements have errors, and a derivative divides a *difference* of two nearby readings by a small time step, so a tiny position error becomes a larger velocity error, and differentiating again makes it far larger. The run below adds random noise of about $0.01$ m (a centimeter) to $301$ position readings of the same fall, $0.01$ s apart. The velocity from them is off by about $0.7$ m/s, and the acceleration by about $60$ m/s², which is six times the true value. To get usable rates from noisy data, smooth the data first, fit a model such as $s=\frac12gt^2$ to it, or use readings farther apart.`,
            T`**Menurunkan data membuat derau makin keras.** Pengukuran nyata memiliki galat, dan turunan membagi *selisih* dua bacaan berdekatan dengan langkah waktu yang kecil, sehingga galat posisi yang kecil menjadi galat kecepatan yang lebih besar, dan menurunkan lagi membuatnya jauh lebih besar. Percobaan di bawah menambahkan derau acak sekitar $0{,}01$ m (satu sentimeter) pada $301$ bacaan posisi jatuh yang sama, berjarak $0{,}01$ detik. Kecepatan dari bacaan itu meleset sekitar $0{,}7$ m/s, dan percepatannya sekitar $60$ m/s², yaitu enam kali nilai sebenarnya. Untuk mendapat laju yang berguna dari data berderau, haluskan datanya lebih dulu, cocokkan model seperti $s=\frac12gt^2$ padanya, atau pakai bacaan yang berjarak lebih jauh.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: noise grows with every derivative', 'Python: derau membesar pada setiap turunan'),
          code: `rng = np.random.default_rng(0)
t = np.linspace(0, 3, 301)                           # a reading every 0.01 s
s = 4.9 * t**2 + rng.normal(0, 0.01, t.size)         # the same fall, with 1 cm of noise
v = np.gradient(s, t)
a = np.gradient(v, t)
print(round(float(np.std(s - 4.9*t**2)), 4))              # 0.0102   position error, in m
print(round(float(np.std(v[2:-2] - 9.8*t[2:-2])), 3))     # 0.716    velocity error, in m/s
print(round(float(np.std(a[4:-4] - 9.8)), 1))             # 62.7     acceleration error, in m/s^2`,
        },
      ],
    },

    /* ----------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Who first measured instantaneous speed and marginal change?', 'Siapa yang pertama mengukur laju sesaat dan perubahan marjinal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Speed at an instant was a puzzle for two thousand years before calculus gave it a definition, and the economists' "margin" arrived two centuries after that.**

- **Galileo.** In his *Discourses on Two New Sciences* (1638) Galileo showed that a body falling from rest covers distances in proportion to the square of the time, $s\propto t^2$, which is the law $s=\frac12gt^2$ used here. He found it by rolling balls down inclined planks, which slows the motion enough to time it.
- **The Oxford Calculators.** Scholars at Merton College, Oxford, in the 1330s distinguished uniform from non-uniform motion and defined "instantaneous velocity" in words; their mean speed theorem was drawn as a graph of speed against time by Nicole Oresme around 1350, centuries before the derivative.
- **Newton.** In the 1660s Isaac Newton treated velocity as the *fluxion* of position, the rate at which a flowing quantity changes, and acceleration as the fluxion of velocity: the derivative was invented, in part, to talk about motion.
- **Marginal economics.** Augustin Cournot used the derivative in his 1838 book on the mathematical theory of wealth to find the output that maximizes a firm's profit. The word "marginal" in economics comes from Friedrich von Wieser (1884), and the "marginal revolution" of the 1870s made it central.`,
            T`**Laju pada satu saat adalah teka-teki selama dua ribu tahun sebelum kalkulus memberinya definisi, dan "margin" para ekonom tiba dua abad sesudahnya.**

- **Galileo.** Dalam *Discourses on Two New Sciences* (1638) Galileo menunjukkan bahwa benda yang jatuh dari keadaan diam menempuh jarak sebanding dengan kuadrat waktu, $s\propto t^2$, yaitu hukum $s=\frac12gt^2$ yang dipakai di sini. Ia menemukannya dengan menggelindingkan bola pada papan miring, yang memperlambat geraknya cukup untuk diukur waktunya.
- **Para Kalkulator Oxford.** Para sarjana di Merton College, Oxford, pada 1330-an membedakan gerak beraturan dari gerak tak beraturan dan mendefinisikan "kecepatan sesaat" dengan kata-kata; teorema kecepatan rata-rata mereka digambarkan sebagai grafik laju terhadap waktu oleh Nicole Oresme sekitar 1350, berabad-abad sebelum turunan.
- **Newton.** Pada 1660-an Isaac Newton memperlakukan kecepatan sebagai *fluksi* posisi, laju perubahan besaran yang mengalir, dan percepatan sebagai fluksi kecepatan: turunan ditemukan, sebagian, untuk membicarakan gerak.
- **Ekonomi marjinal.** Augustin Cournot memakai turunan dalam bukunya tahun 1838 tentang teori matematika kekayaan untuk mencari keluaran yang memaksimalkan laba perusahaan. Kata "marjinal" dalam ekonomi berasal dari Friedrich von Wieser (1884), dan "revolusi marjinal" pada 1870-an menjadikannya pusat.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What mistakes do people make with rates of change?', 'Kesalahan apa yang sering terjadi pada laju perubahan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with rates of change are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ Speed can be negative | Speed is the absolute value of velocity and is never negative; velocity is the one with a sign. |
| ❌ A negative acceleration means the body is slowing down | Only when the velocity is positive. A body with $v<0$ and $a<0$ moves backward and speeds up. |
| ❌ When the velocity is zero the acceleration is zero | A rock at the top of its flight has $v=0$ but still $a=-9.8\ \text{m/s}^2$. |
| ❌ The graph of $s$ against $t$ is the path of the body | The path is the line the body moves on; the graph shows position against time, and its slope is the velocity. |
| ❌ Total distance equals displacement | Displacement is $s(t_1)-s(t_0)$; distance adds up the sizes of the changes of $s$ between the turns, so it can be larger (12 m against 4 m in the example). |
| ❌ The average velocity is always $\frac{v_0+v_1}{2}$ | That holds only when the acceleration is constant. The average velocity is displacement over time. |
| ❌ Marginal cost is the total cost divided by the number of units | That is the *average* cost. Marginal cost is the derivative $c'(x)$, the cost of one more unit. |
| ❌ With a 28% marginal tax rate you pay 28% of your whole income in tax | You pay 28% of each *extra* unit of income; the marginal rate is $\frac{dT}{dI}$. |
| ❌ The rate $\frac{dA}{dr}$ and the rate $\frac{dA}{dD}$ of a circle are the same | They differ because the variables differ: $\frac{dA}{dr}=2\pi r$ but $\frac{dA}{dD}=\frac{\pi D}{2}=\pi r$, half as large. |`,
            T`**Kesalahan paling umum pada laju perubahan adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ Laju dapat bernilai negatif | Laju adalah nilai mutlak kecepatan dan tidak pernah negatif; kecepatanlah yang memiliki tanda. |
| ❌ Percepatan negatif berarti benda melambat | Hanya bila kecepatannya positif. Benda dengan $v<0$ dan $a<0$ bergerak mundur dan makin cepat. |
| ❌ Saat kecepatan nol, percepatan juga nol | Batu di puncak lintasannya memiliki $v=0$ tetapi tetap $a=-9{,}8\ \text{m/s}^2$. |
| ❌ Grafik $s$ terhadap $t$ adalah lintasan benda | Lintasannya adalah garis tempat benda bergerak; grafik memperlihatkan posisi terhadap waktu, dan gradiennya adalah kecepatan. |
| ❌ Jarak total sama dengan perpindahan | Perpindahan adalah $s(t_1)-s(t_0)$; jarak menjumlahkan besar perubahan $s$ di antara putaran balik, sehingga dapat lebih besar (12 m terhadap 4 m pada contoh). |
| ❌ Kecepatan rata-rata selalu $\frac{v_0+v_1}{2}$ | Itu hanya berlaku bila percepatannya tetap. Kecepatan rata-rata adalah perpindahan per waktu. |
| ❌ Biaya marjinal adalah biaya total dibagi banyak satuan | Itu biaya *rata-rata*. Biaya marjinal adalah turunan $c'(x)$, biaya satu satuan lagi. |
| ❌ Dengan tarif pajak marjinal 28% kamu membayar 28% dari seluruh penghasilan | Kamu membayar 28% dari setiap satuan penghasilan *tambahan*; tarif marjinal adalah $\frac{dT}{dI}$. |
| ❌ Laju $\frac{dA}{dr}$ dan laju $\frac{dA}{dD}$ pada lingkaran sama | Keduanya berbeda karena peubahnya berbeda: $\frac{dA}{dr}=2\pi r$ tetapi $\frac{dA}{dD}=\frac{\pi D}{2}=\pi r$, separuhnya. |`,
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
              L('Velocity can be negative.', 'Kecepatan dapat bernilai negatif.'),
              L('Speed can be negative.', 'Laju dapat bernilai negatif.'),
              L('Acceleration is the derivative of velocity.', 'Percepatan adalah turunan kecepatan.'),
              L('If the velocity is zero at an instant, the acceleration is zero too.', 'Jika kecepatan nol pada suatu saat, percepatannya juga nol.'),
              L('The marginal cost at $x$ is the derivative $c\'(x)$.', 'Biaya marjinal di $x$ adalah turunan $c\'(x)$.'),
              L('The average velocity over any interval is $\\frac{v_0+v_1}{2}$.', 'Kecepatan rata-rata pada selang mana pun adalah $\\frac{v_0+v_1}{2}$.'),
            ],
            answer: [true, false, true, false, true, false],
            explain: L(
              'Velocity has a sign and speed does not. At the top of a throw $v=0$ but $a=-9.8$. The average velocity is displacement over time, which equals $\\frac{v_0+v_1}{2}$ only for constant acceleration.',
              'Kecepatan memiliki tanda dan laju tidak. Di puncak lemparan $v=0$ tetapi $a=-9{,}8$. Kecepatan rata-rata adalah perpindahan per waktu, yang sama dengan $\\frac{v_0+v_1}{2}$ hanya untuk percepatan tetap.',
            ),
            hint: L('Think of a ball thrown straight up.', 'Bayangkan bola yang dilempar lurus ke atas.'),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L('Choose **all** the correct statements about motion along a line.', 'Pilih **semua** pernyataan yang benar tentang gerak sepanjang garis lurus.'),
            options: [
              L('$v=\\frac{ds}{dt}$', '$v=\\frac{ds}{dt}$'),
              L('$a=\\frac{d^2s}{dt^2}$', '$a=\\frac{d^2s}{dt^2}$'),
              L('speed $=|v|$', 'laju $=|v|$'),
              L('jerk $=\\frac{da}{dt}$', 'sentakan $=\\frac{da}{dt}$'),
              L('$a=\\frac{ds}{dt}$', '$a=\\frac{ds}{dt}$'),
            ],
            answer: [0, 1, 2, 3],
            explain: L('Velocity is the derivative of position, acceleration of velocity, jerk of acceleration, and speed is the size of velocity. $\\frac{ds}{dt}$ is velocity, not acceleration.', 'Kecepatan adalah turunan posisi, percepatan turunan kecepatan, sentakan turunan percepatan, dan laju adalah besar kecepatan. $\\frac{ds}{dt}$ adalah kecepatan, bukan percepatan.'),
            hint: L('Each step up the list is one more derivative.', 'Tiap langkah ke atas adalah satu turunan lagi.'),
          },
        },
        {
          kind: 'activity',
          title: L('A velocity', 'Sebuah kecepatan'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L('$v=s\'=2t-3$.', '$v=s\'=2t-3$.'), L('At $t=2$: $4-3$.', 'Di $t=2$: $4-3$.')],
            explain: L('$v=2t-3$, so $v(2)=1$ m/s.', '$v=2t-3$, sehingga $v(2)=1$ m/s.'),
            prompt: L('A body has position $s=t^2-3t+2$ meters. Find its velocity at $t=2$ s, in m/s.', 'Sebuah benda berposisi $s=t^2-3t+2$ meter. Tentukan kecepatannya di $t=2$ detik, dalam m/s.'),
            given: String.raw`v(2)=v`,
            blanks: [{ label: 'v(2) =', answer: 1 }],
          },
        },
        {
          kind: 'activity',
          title: L('Free fall', 'Jatuh bebas'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L('$v=s\'=9.8t$.', '$v=s\'=9{,}8t$.'), L('$9.8\\cdot3$.', '$9{,}8\\cdot3$.')],
            explain: L('$v=9.8t$, so $v(3)=29.4$ m/s.', '$v=9{,}8t$, sehingga $v(3)=29{,}4$ m/s.'),
            prompt: L('A ball falls $s=4.9t^2$ meters in $t$ seconds. What is its speed at $t=3$, in m/s?', 'Sebuah bola jatuh $s=4{,}9t^2$ meter dalam $t$ detik. Berapa lajunya di $t=3$, dalam m/s?'),
            given: String.raw`|v(3)|=v`,
            blanks: [{ label: 'speed =', answer: 29.4 }],
          },
        },
        {
          kind: 'activity',
          title: L('The top of a throw', 'Puncak lemparan'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [L('The velocity $49-9.8t$ is zero at $t=5$.', 'Kecepatan $49-9{,}8t$ nol di $t=5$.'), L('$s(5)=245-122.5$.', '$s(5)=245-122{,}5$.')],
            explain: L('At $t=5$: $s=49\\cdot5-4.9\\cdot25=245-122.5=122.5$ m.', 'Di $t=5$: $s=49\\cdot5-4{,}9\\cdot25=245-122{,}5=122{,}5$ m.'),
            prompt: L('A rock has height $s=49t-4.9t^2$ meters. How high does it go (in m)?', 'Sebuah batu memiliki tinggi $s=49t-4{,}9t^2$ meter. Seberapa tinggi ia naik (dalam m)?'),
            given: String.raw`s_{\max}=v`,
            blanks: [{ label: 's =', answer: 122.5 }],
          },
        },
        {
          kind: 'activity',
          title: L('Speeding up or slowing down?', 'Makin cepat atau makin lambat?'),
          step: {
            kind: 'quiz',
            id: 'p6',
            prompt: L('At some instant a body has $v=-3$ m/s and $a=-2\\ \\text{m/s}^2$. What is happening?', 'Pada suatu saat benda memiliki $v=-3$ m/s dan $a=-2\\ \\text{m/s}^2$. Apa yang terjadi?'),
            options: [L('moving backward and speeding up', 'bergerak mundur dan makin cepat'), L('moving backward and slowing down', 'bergerak mundur dan makin lambat'), L('moving forward and speeding up', 'bergerak maju dan makin cepat'), L('moving forward and slowing down', 'bergerak maju dan makin lambat')],
            answer: 0,
            explain: L('The negative velocity means backward. Velocity and acceleration have the same sign, so the speed is growing.', 'Kecepatan negatif berarti mundur. Kecepatan dan percepatan bertanda sama, sehingga lajunya bertambah.'),
            hint: L('Compare the signs of $v$ and $a$.', 'Bandingkan tanda $v$ dan $a$.'),
          },
        },
        {
          kind: 'activity',
          title: L('Total distance', 'Jarak total'),
          step: {
            kind: 'math',
            id: 'p7',
            hints: [L('The body turns at $t=1$ and $t=3$, where $v=0$.', 'Benda berbalik di $t=1$ dan $t=3$, tempat $v=0$.'), L('$s(0)=0$, $s(1)=4$, $s(3)=0$, $s(4)=4$.', '$s(0)=0$, $s(1)=4$, $s(3)=0$, $s(4)=4$.')],
            explain: L('Distance $=|4-0|+|0-4|+|4-0|=12$ m, while the displacement is only $4$ m.', 'Jarak $=|4-0|+|0-4|+|4-0|=12$ m, sedangkan perpindahannya hanya $4$ m.'),
            prompt: L('A body has $s=t^3-6t^2+9t$ meters. What total distance does it travel from $t=0$ to $t=4$, in m?', 'Sebuah benda berposisi $s=t^3-6t^2+9t$ meter. Berapa jarak total yang ditempuhnya dari $t=0$ sampai $t=4$, dalam m?'),
            given: String.raw`\text{distance}=v`,
            blanks: [{ label: 'd =', answer: 12 }],
          },
        },
        {
          kind: 'activity',
          title: L('A marginal cost', 'Biaya marjinal'),
          step: {
            kind: 'math',
            id: 'p8',
            hints: [L('$c\'(x)=3x^2-12x+15$.', '$c\'(x)=3x^2-12x+15$.'), L('$300-120+15$.', '$300-120+15$.')],
            explain: L('$c\'(10)=300-120+15=195$.', '$c\'(10)=300-120+15=195$.'),
            prompt: L('The cost of $x$ radiators is $c(x)=x^3-6x^2+15x$. Find the marginal cost at $x=10$.', 'Biaya $x$ radiator adalah $c(x)=x^3-6x^2+15x$. Tentukan biaya marjinal di $x=10$.'),
            given: String.raw`c'(10)=v`,
            blanks: [{ label: "c'(10) =", answer: 195 }],
          },
        },
        {
          kind: 'activity',
          title: L('Why the estimate is off', 'Mengapa taksirannya meleset'),
          step: {
            kind: 'quiz',
            id: 'p9',
            prompt: L('For the radiators, $c\'(10)=195$ but the 11th radiator really costs $c(11)-c(10)=220$. Why the gap?', 'Untuk radiator itu, $c\'(10)=195$ tetapi radiator ke-11 sebenarnya berbiaya $c(11)-c(10)=220$. Mengapa selisihnya?'),
            options: [L('the slope of $c$ is rising, so one whole unit costs more than the slope at $x=10$ suggests', 'gradien $c$ sedang naik, sehingga satu satuan penuh berbiaya lebih daripada yang ditunjukkan gradien di $x=10$'), L('the derivative was computed wrongly', 'turunannya salah dihitung'), L('marginal cost is always smaller than the true cost', 'biaya marjinal selalu lebih kecil daripada biaya sebenarnya'), L('the cost function is not a polynomial', 'fungsi biayanya bukan polinomial')],
            answer: 0,
            explain: L('$c\'$ is the rate *at* $x=10$, and $c\'(x)=3x^2-12x+15$ increases with $x$, so the average rate over the next whole unit is higher. A smaller step would agree better.', '$c\'$ adalah laju *di* $x=10$, dan $c\'(x)=3x^2-12x+15$ naik terhadap $x$, sehingga laju rata-rata pada satu satuan penuh berikutnya lebih tinggi. Langkah yang lebih kecil akan lebih cocok.'),
            hint: L('Does $c\'$ stay constant between $10$ and $11$?', 'Apakah $c\'$ tetap konstan antara $10$ dan $11$?'),
          },
        },
        {
          kind: 'activity',
          title: L('A cube', 'Sebuah kubus'),
          step: {
            kind: 'math',
            id: 'p10',
            hints: [L('$\\frac{dV}{da}=3a^2$.', '$\\frac{dV}{da}=3a^2$.'), L('$3\\cdot16$.', '$3\\cdot16$.')],
            explain: L('$\\frac{dV}{da}=3a^2=48$ cubic units per unit of side at $a=4$, the area of three faces.', '$\\frac{dV}{da}=3a^2=48$ satuan kubik per satuan rusuk di $a=4$, luas tiga sisinya.'),
            prompt: L('A cube of side $a$ has volume $V=a^3$. Find $\\frac{dV}{da}$ at $a=4$.', 'Kubus bersisi $a$ memiliki volume $V=a^3$. Tentukan $\\frac{dV}{da}$ di $a=4$.'),
            given: String.raw`\frac{dV}{da}\Big|_{a=4}=v`,
            blanks: [{ label: 'dV/da =', answer: 48 }],
          },
        },
        {
          kind: 'activity',
          title: L('Sensitivity to speed', 'Kepekaan terhadap kecepatan'),
          step: {
            kind: 'math',
            id: 'p11',
            hints: [L('$\\frac{ds}{dV}=0.21+0.0126V$.', '$\\frac{ds}{dV}=0{,}21+0{,}0126V$.'), L('$0.21+1.26$.', '$0{,}21+1{,}26$.')],
            explain: L('$\\frac{ds}{dV}(100)=0.21+0.0126\\cdot100=1.47$ meters per km/h.', '$\\frac{ds}{dV}(100)=0{,}21+0{,}0126\\cdot100=1{,}47$ meter per km/jam.'),
            prompt: L('The stopping distance is $s=0.21V+0.0063V^2$ meters at $V$ km/h. Find $\\frac{ds}{dV}$ at $V=100$ (meters per km/h).', 'Jarak henti adalah $s=0{,}21V+0{,}0063V^2$ meter pada $V$ km/jam. Tentukan $\\frac{ds}{dV}$ di $V=100$ (meter per km/jam).'),
            given: String.raw`\frac{ds}{dV}\Big|_{V=100}=v`,
            blanks: [{ label: 'ds/dV =', answer: 1.47 }],
          },
        },
        {
          kind: 'activity',
          title: L('A marginal tax rate', 'Tarif pajak marjinal'),
          step: {
            kind: 'quiz',
            id: 'p12',
            prompt: L('Your marginal income tax rate is 28% and your income rises by 1000 dollars. About how much more tax do you pay?', 'Tarif pajak penghasilan marjinalmu 28% dan penghasilanmu naik Rp1.000.000. Kira-kira berapa tambahan pajak yang kamu bayar?'),
            options: [L('280 dollars', 'Rp280.000'), L('28 dollars', 'Rp28.000'), L('28% of your whole income', '28% dari seluruh penghasilanmu'), L('2800 dollars', 'Rp2.800.000')],
            answer: 0,
            explain: L('The marginal rate $\\frac{dT}{dI}=0.28$ is the tax on each extra dollar: $0.28\\cdot1000=280$ dollars.', 'Tarif marjinal $\\frac{dT}{dI}=0{,}28$ adalah pajak atas setiap rupiah tambahan: $0{,}28\\cdot1.000.000=$ Rp280.000.'),
            hint: L('The marginal rate applies to the extra income only.', 'Tarif marjinal hanya berlaku untuk penghasilan tambahan.'),
          },
        },
      ],
    },

    /* ----------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: the derivative as a rate of change at a glance', 'Ringkasan: turunan sebagai laju perubahan sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Rate of change:** $\frac{dy}{dx}=\lim\frac{\Delta y}{\Delta x}$ in units of $y$ per unit of $x$; it depends on the variable chosen; $\Delta y\approx\frac{dy}{dx}\Delta x$ for small steps.
- **Motion:** $v=\frac{ds}{dt}$ (sign = direction), speed $=|v|$, $a=\frac{d^2s}{dt^2}$, $j=\frac{da}{dt}$; speeding up when $v$ and $a$ have the same sign; distance adds $|\Delta s|$ between the turns, displacement is $s(t_1)-s(t_0)$.
- **Free fall:** $s=4.9t^2$, $v=9.8t$, $a=9.8$, $j=0$; thrown up at $v_0$: top at $\frac{v_0}{g}$, height $\frac{v_0^2}{2g}$, landing at $\frac{2v_0}{g}$ with velocity $-v_0$.
- **Marginals:** marginal cost $c'(x)\approx c(x+1)-c(x)$, marginal revenue $r'$, marginal profit $r'-c'$; marginal tax rate is the tax on the next unit of income.
- **Sensitivity:** a large $|f'|$ means a small change in $x$ makes a large change in $f$ (Mendel's peas, braking distance).
- **Data and code:** ´numpy.gradient´ for velocity and acceleration from readings; each derivative amplifies noise.`,
            T`- **Laju perubahan:** $\frac{dy}{dx}=\lim\frac{\Delta y}{\Delta x}$ dalam satuan $y$ per satuan $x$; ia bergantung pada peubah yang dipilih; $\Delta y\approx\frac{dy}{dx}\Delta x$ untuk langkah kecil.
- **Gerak:** $v=\frac{ds}{dt}$ (tanda = arah), laju $=|v|$, $a=\frac{d^2s}{dt^2}$, $j=\frac{da}{dt}$; makin cepat bila $v$ dan $a$ bertanda sama; jarak menjumlahkan $|\Delta s|$ di antara putaran balik, perpindahan adalah $s(t_1)-s(t_0)$.
- **Jatuh bebas:** $s=4{,}9t^2$, $v=9{,}8t$, $a=9{,}8$, $j=0$; dilempar ke atas dengan $v_0$: puncak di $\frac{v_0}{g}$, tinggi $\frac{v_0^2}{2g}$, mendarat di $\frac{2v_0}{g}$ dengan kecepatan $-v_0$.
- **Marjinal:** biaya marjinal $c'(x)\approx c(x+1)-c(x)$, pendapatan marjinal $r'$, laba marjinal $r'-c'$; tarif pajak marjinal adalah pajak atas satuan penghasilan berikutnya.
- **Kepekaan:** $|f'|$ yang besar berarti perubahan kecil pada $x$ membuat perubahan besar pada $f$ (kacang polong Mendel, jarak pengereman).
- **Data dan kode:** ´numpy.gradient´ untuk kecepatan dan percepatan dari bacaan; setiap turunan memperbesar derau.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Velocity', 'Kecepatan'), definition: L('The derivative of position with respect to time; its size is the speed and its sign is the direction of motion along a line.', 'Turunan posisi terhadap waktu; besarnya adalah laju dan tandanya adalah arah gerak sepanjang garis.') },
    { term: L('Speed', 'Laju'), definition: L('The absolute value of velocity, the rate of progress regardless of direction, which is never negative.', 'Nilai mutlak kecepatan, kemajuan tanpa memandang arah, yang tidak pernah negatif.') },
    { term: L('Acceleration', 'Percepatan'), definition: L('The derivative of velocity with respect to time, which is also the second derivative of position; it measures how fast a body gains or loses velocity.', 'Turunan kecepatan terhadap waktu, yang juga turunan kedua posisi; ia mengukur seberapa cepat benda menambah atau kehilangan kecepatan.') },
    { term: L('Jerk', 'Sentakan'), definition: L('The derivative of acceleration with respect to time, which is the third derivative of position; a ride is jerky when the acceleration changes abruptly.', 'Turunan percepatan terhadap waktu, yaitu turunan ketiga posisi; perjalanan tersentak-sentak bila percepatan berubah mendadak.') },
    { term: L('Displacement', 'Perpindahan'), definition: L('The change in position from the start to the end of a time interval, found by subtracting the starting position from the final one; it can be smaller than the distance travelled.', 'Perubahan posisi dari awal sampai akhir selang waktu, diperoleh dengan mengurangkan posisi awal dari posisi akhir; ia dapat lebih kecil daripada jarak yang ditempuh.') },
    { term: L('Marginal cost', 'Biaya marjinal'), definition: L('The derivative of the cost of production with respect to the number of units produced, which approximates the cost of making one more unit.', 'Turunan biaya produksi terhadap banyak satuan yang diproduksi, yang menghampiri biaya membuat satu satuan lagi.') },
    { term: L('Marginal revenue', 'Pendapatan marjinal'), definition: L('The derivative of revenue with respect to the number of units sold, which approximates the extra revenue from selling one more unit.', 'Turunan pendapatan terhadap banyak satuan yang terjual, yang menghampiri pendapatan tambahan dari menjual satu satuan lagi.') },
    { term: L('Sensitivity to change', 'Kepekaan terhadap perubahan'), definition: L('How strongly a function responds to a small change in its input, measured by the size of its derivative: the steeper the graph, the more sensitive the function.', 'Seberapa kuat suatu fungsi menanggapi perubahan kecil pada masukannya, diukur dengan besar turunannya: makin curam grafik, makin peka fungsi itu.') },
  ],

  howTo: [
    {
      name: L('How to analyze motion from a position function', 'Cara menganalisis gerak dari fungsi posisi'),
      description: L('Differentiate the position twice, find where the velocity is zero, and compare signs.', 'Turunkan posisi dua kali, cari tempat kecepatan nol, dan bandingkan tanda.'),
      steps: [
        { name: L('Find velocity and acceleration', 'Cari kecepatan dan percepatan'), text: L('Differentiate s of t once to get the velocity and again to get the acceleration.', 'Turunkan s dari t sekali untuk kecepatan dan sekali lagi untuk percepatan.') },
        { name: L('Find the turns', 'Cari putaran balik'), text: L('Solve velocity equals zero; the body turns round where the velocity changes sign, so check the sign on each side.', 'Selesaikan kecepatan sama dengan nol; benda berbalik arah di tempat kecepatan berganti tanda, jadi periksa tanda di kedua sisi.') },
        { name: L('Compare the signs of v and a', 'Bandingkan tanda v dan a'), text: L('On each interval, the body moves forward when the velocity is positive and backward when it is negative, and it speeds up when the velocity and acceleration have the same sign.', 'Pada tiap selang, benda maju bila kecepatan positif dan mundur bila negatif, dan makin cepat bila kecepatan dan percepatan bertanda sama.') },
        { name: L('Add up the distance', 'Jumlahkan jaraknya'), text: L('For the total distance add the sizes of the changes in position between the start, each turn and the end; the displacement is just the final position minus the starting one.', 'Untuk jarak total jumlahkan besar perubahan posisi antara awal, tiap putaran balik, dan akhir; perpindahan hanyalah posisi akhir dikurangi posisi awal.') },
      ],
    },
    {
      name: L('How to estimate the cost of one more unit with marginal cost', 'Cara menaksir biaya satu satuan lagi dengan biaya marjinal'),
      description: L('Differentiate the cost function and evaluate the derivative at the current level of production.', 'Turunkan fungsi biaya dan hitung turunannya pada tingkat produksi saat ini.'),
      steps: [
        { name: L('Write the cost function', 'Tulis fungsi biayanya'), text: L('Write the total cost c of x as a polynomial in the number of units x, fixed costs included.', 'Tulis biaya total c dari x sebagai polinomial dalam banyak satuan x, termasuk biaya tetap.') },
        { name: L('Differentiate', 'Turunkan'), text: L('Differentiate term by term to get the marginal cost c prime of x; the fixed cost disappears.', 'Turunkan suku demi suku untuk mendapat biaya marjinal c aksen dari x; biaya tetap hilang.') },
        { name: L('Evaluate at the current output', 'Hitung pada produksi saat ini'), text: L('Put the current number of units into the marginal cost; for x cubed minus 6x squared plus 15x at x equal to 10 it is 195.', 'Masukkan banyak satuan saat ini ke biaya marjinal; untuk x pangkat tiga dikurangi 6x kuadrat ditambah 15x di x sama dengan 10 hasilnya 195.') },
        { name: L('Compare with the exact step', 'Bandingkan dengan langkah eksak'), text: L('If you want to check, compute c of x plus 1 minus c of x, which is 220 here; the estimate is good when the slope of the cost changes slowly.', 'Jika ingin memeriksa, hitung c dari x ditambah 1 dikurangi c dari x, yaitu 220 di sini; taksirannya baik bila gradien biaya berubah pelan.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is the derivative of position?', 'Apa turunan posisi?'),
      a: L(
        'The derivative of position with respect to time is velocity. Differentiate velocity and you get acceleration, which is the second derivative of position. The sign of the velocity tells the direction of motion along the line, and its size is the speed.',
        'Turunan posisi terhadap waktu adalah kecepatan. Turunkan kecepatan dan kamu mendapat percepatan, yaitu turunan kedua posisi. Tanda kecepatan menyatakan arah gerak sepanjang garis, dan besarnya adalah laju.',
      ),
    },
    {
      q: L('What is the difference between velocity and speed?', 'Apa beda kecepatan dan laju?'),
      a: L(
        'Velocity is the derivative of position and has a sign that gives the direction, so it can be negative. Speed is the absolute value of velocity and is never negative. A car driven out and back at 50 kilometers per hour has speed 50 both ways but velocity 50 and then minus 50.',
        'Kecepatan adalah turunan posisi dan memiliki tanda yang memberi arah, sehingga dapat negatif. Laju adalah nilai mutlak kecepatan dan tidak pernah negatif. Mobil yang dikendarai pergi dan pulang dengan 50 kilometer per jam memiliki laju 50 di kedua arah tetapi kecepatan 50 lalu min 50.',
      ),
    },
    {
      q: L('What is acceleration in calculus?', 'Apa itu percepatan dalam kalkulus?'),
      a: L(
        'Acceleration is the derivative of velocity with respect to time, which is the second derivative of position. It is measured in units of velocity per unit of time, such as meters per second squared. In free fall near the Earth it is the constant 9.8.',
        'Percepatan adalah turunan kecepatan terhadap waktu, yaitu turunan kedua posisi. Satuannya satuan kecepatan per satuan waktu, seperti meter per detik kuadrat. Pada jatuh bebas di dekat Bumi ia tetap 9,8.',
      ),
    },
    {
      q: L('What is jerk?', 'Apa itu sentakan?'),
      a: L(
        'Jerk is the derivative of acceleration with respect to time, the third derivative of position. A ride feels jerky when the acceleration changes abruptly, not necessarily when it is large. In free fall the acceleration is constant, so the jerk is zero.',
        'Sentakan adalah turunan percepatan terhadap waktu, turunan ketiga posisi. Perjalanan terasa tersentak-sentak bila percepatan berubah mendadak, belum tentu bila ia besar. Pada jatuh bebas percepatannya tetap, sehingga sentakannya nol.',
      ),
    },
    {
      q: L('How do you tell whether an object is speeding up or slowing down?', 'Bagaimana mengetahui apakah benda makin cepat atau makin lambat?'),
      a: L(
        'Compare the signs of velocity and acceleration. If they are the same the object speeds up, and if they are opposite it slows down. A negative acceleration with a negative velocity means moving backward and speeding up, so acceleration alone is not enough.',
        'Bandingkan tanda kecepatan dan percepatan. Jika sama benda makin cepat, dan jika berlawanan ia makin lambat. Percepatan negatif dengan kecepatan negatif berarti bergerak mundur dan makin cepat, jadi percepatan saja tidak cukup.',
      ),
    },
    {
      q: L('What is marginal cost?', 'Apa itu biaya marjinal?'),
      a: L(
        'Marginal cost is the derivative of the cost of production with respect to the number of units made. It approximates the extra cost of making one more unit, and the approximation is good when the slope of the cost curve changes slowly near the current output.',
        'Biaya marjinal adalah turunan biaya produksi terhadap banyak satuan yang dibuat. Ia menghampiri tambahan biaya membuat satu satuan lagi, dan hampiran itu baik bila gradien kurva biaya berubah pelan di dekat produksi saat ini.',
      ),
    },
    {
      q: L('What is the difference between marginal cost and average cost?', 'Apa beda biaya marjinal dan biaya rata-rata?'),
      a: L(
        'Average cost is the total cost divided by the number of units, so it spreads the whole cost over all units. Marginal cost is the derivative of the total cost, the cost of the next unit. They are equal only at special production levels.',
        'Biaya rata-rata adalah biaya total dibagi banyak satuan, sehingga ia membagi seluruh biaya ke semua satuan. Biaya marjinal adalah turunan biaya total, biaya satuan berikutnya. Keduanya sama hanya pada tingkat produksi tertentu.',
      ),
    },
    {
      q: L('How far does an object fall in free fall?', 'Seberapa jauh benda jatuh pada jatuh bebas?'),
      a: L(
        'Starting from rest near the surface of the Earth and ignoring air resistance, an object falls 4.9 times the square of the time in meters. After 3 seconds that is 44.1 meters, and its velocity is then 9.8 times the time, which is 29.4 meters per second.',
        'Mulai dari keadaan diam di dekat permukaan Bumi dan mengabaikan hambatan udara, benda jatuh 4,9 kali kuadrat waktu dalam meter. Setelah 3 detik itu 44,1 meter, dan kecepatannya saat itu 9,8 kali waktu, yaitu 29,4 meter per detik.',
      ),
    },
    {
      q: L('What are the units of a derivative?', 'Apa satuan sebuah turunan?'),
      a: L(
        'The units of the quantity being differentiated divided by the units of the variable. Position in meters against time in seconds gives meters per second, and cost in dollars against units made gives dollars per unit. Changing the variable, such as radius to diameter, changes the number.',
        'Satuan besaran yang diturunkan dibagi satuan peubahnya. Posisi dalam meter terhadap waktu dalam detik memberi meter per detik, dan biaya dalam rupiah terhadap satuan yang dibuat memberi rupiah per satuan. Mengganti peubah, seperti jari-jari menjadi diameter, mengubah angkanya.',
      ),
    },
  ],

  references: [
    { title: "Thomas' Calculus: Early Transcendentals in SI Units (15th ed.), Section 3.4: The Derivative as a Rate of Change", author: 'Joel Hass, Christopher Heil, Maurice D. Weir et al.', year: 2023, source: 'Pearson' },
    { title: 'Calculus (8th ed.), section 3.7: Rates of Change in the Natural and Social Sciences', author: 'James Stewart', year: 2015, source: 'Cengage Learning' },
    { title: 'Discorsi e dimostrazioni matematiche intorno a due nuove scienze (Discourses on Two New Sciences)', author: 'Galileo Galilei', year: 1638, source: 'Elsevier, Leiden' },
    { title: 'Recherches sur les principes mathématiques de la théorie des richesses', author: 'Augustin Cournot', year: 1838, source: 'Hachette, Paris' },
    { title: 'NumPy reference: numpy.gradient', author: 'NumPy Developers', source: 'numpy.org', url: 'https://numpy.org/doc/stable/reference/generated/numpy.gradient.html' },
  ],

  related: ['derivatives-of-trigonometric-functions', 'differentiation-rules', 'linearization-and-differentials', 'related-rates'],
}
