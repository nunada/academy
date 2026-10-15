import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './related-rates.meta'

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
    T`**A related rates problem asks how fast one quantity changes at one moment, given the rates of other quantities tied to it by an equation; you solve it by differentiating that equation with respect to time $t$ and then putting in the numbers of that moment.** For a sphere, $V=\frac43\pi r^3$ gives $\frac{dV}{dt}=4\pi r^2\frac{dr}{dt}$. The tool is the chain rule: every quantity is a function of $t$, so each variable brings a factor of its own rate.`,
    T`**Soal laju terkait menanyakan seberapa cepat suatu besaran berubah pada satu saat, ketika besaran lain yang terkait dengannya lewat suatu persamaan berubah dengan laju yang diketahui; soal ini diselesaikan dengan menurunkan persamaan itu terhadap waktu $t$ lalu memasukkan bilangan pada saat tersebut.** Untuk bola, $V=\frac43\pi r^3$ memberi $\frac{dV}{dt}=4\pi r^2\frac{dr}{dt}$, sehingga laju memompa udara yang diketahui menentukan seberapa cepat jari-jarinya bertambah. Alatnya adalah aturan rantai: setiap besaran adalah fungsi dari $t$, sehingga tiap peubah membawa faktor lajunya sendiri.`,
  ),

  keyPoints: [
    L(
      T`Treat every changing quantity as a function of time, write one equation between them, and differentiate both sides with respect to $t$; each variable $q$ contributes a factor $\frac{dq}{dt}$ by the chain rule.`,
      T`Perlakukan setiap besaran yang berubah sebagai fungsi waktu, tulis satu persamaan di antaranya, dan turunkan kedua ruas terhadap $t$; tiap peubah $q$ menyumbang faktor $\frac{dq}{dt}$ lewat aturan rantai.`,
    ),
    L(
      T`Put the numbers in after differentiating, never before: a quantity replaced by a number early becomes a constant whose rate is $0$.`,
      T`Masukkan bilangan setelah menurunkan, jangan sebelumnya: besaran yang diganti bilangan terlalu dini menjadi konstanta yang lajunya $0$.`,
    ),
    L(
      T`The strategy has four steps: name the variables and draw a picture, write an equation between them, differentiate in $t$, then substitute the values of the moment and solve for the unknown rate.`,
      T`Strateginya empat langkah: beri nama peubah dan gambar, tulis persamaan di antaranya, turunkan terhadap $t$, lalu substitusikan nilai pada saat itu dan selesaikan untuk laju yang dicari.`,
    ),
    L(
      T`A quantity that is decreasing has a negative rate, and angles must be in radians: $\frac13$ degree per second is $\frac{20\pi}{3}$ radians per hour.`,
      T`Besaran yang berkurang memiliki laju negatif, dan sudut harus dalam radian: $\frac13$ derajat per detik adalah $\frac{20\pi}{3}$ radian per jam.`,
    ),
    L(
      T`If a second variable has no given rate, remove it first with a relation that always holds, such as similar triangles ($x=\frac y2$ in the cone) or Pythagoras.`,
      T`Jika peubah kedua tidak punya laju yang diberikan, hilangkan lebih dulu dengan hubungan yang selalu berlaku, seperti segitiga sebangun ($x=\frac y2$ pada kerucut) atau Pythagoras.`,
    ),
    L(
      T`For a ladder with $x^2+y^2=L^2$, the top moves at $\frac{dy}{dt}=-\frac xy\frac{dx}{dt}$, faster than the foot once $x>y$, and without bound as the top nears the floor.`,
      T`Untuk tangga dengan $x^2+y^2=L^2$, ujung atas bergerak dengan $\frac{dy}{dt}=-\frac xy\frac{dx}{dt}$, lebih cepat daripada kaki begitu $x>y$, dan tanpa batas saat ujung atas mendekati lantai.`,
    ),
  ],

  sections: [
    /* ---------------------------------------------------------------------- what they are */
    {
      id: 'what-are-related-rates',
      heading: L('What are related rates?', 'Apa itu laju terkait?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Related rates are the rates of change, with respect to time, of several quantities that are tied together by an equation, so that knowing how fast some of them change tells you how fast another one does.** The process of finding one of them from the others is a *related rates problem*.

Suppose air is pumped into a spherical balloon. The volume $V$ and the radius $r$ both grow with time $t$, and always $V=\frac43\pi r^3$. Because $r$ is a function of $t$, the [chain rule](article:the-chain-rule#chain-rule) differentiates the equation:
$$\frac{dV}{dt}=\frac{dV}{dr}\cdot\frac{dr}{dt}=4\pi r^2\frac{dr}{dt}.$$
This is a *related rates equation*. It is useful because the rate of the volume is easy to measure, by metering the air, while the rate of the radius is not. If air goes in at $100\ \text{cm}^3/\text{s}$, then when $r=5$ cm
$$\frac{dr}{dt}=\frac{100}{4\pi\cdot5^2}=\frac1\pi\approx0.318\ \text{cm/s}.$$

**Why it is the chain rule.** A formula such as $A=\pi r^2$ is true at every moment, so it really says $A(t)=\pi\,r(t)^2$. The derivative of $r(t)^2$ is $2\,r(t)\,r'(t)$: an outside function, the square, and an inside function, $r(t)$. Every related rates equation is made this way. Differentiate each term of the equation, and each variable $q$ that depends on time brings the factor $\frac{dq}{dt}$, which is its [rate of change](article:the-derivative-as-a-rate-of-change#rates-and-units).

**The related rates equations of common formulas.**

| Formula | Related rates equation |
|---|---|
| Area of a circle, $A=\pi r^2$ | $\frac{dA}{dt}=2\pi r\frac{dr}{dt}$ |
| Volume of a sphere, $V=\frac43\pi r^3$ | $\frac{dV}{dt}=4\pi r^2\frac{dr}{dt}$ |
| Surface of a sphere, $S=4\pi r^2$ | $\frac{dS}{dt}=8\pi r\frac{dr}{dt}$ |
| Volume of a cube, $V=x^3$ | $\frac{dV}{dt}=3x^2\frac{dx}{dt}$ |
| Volume of a cylinder, $V=\pi r^2h$ | $\frac{dV}{dt}=2\pi rh\frac{dr}{dt}+\pi r^2\frac{dh}{dt}$ |
| Distance, $s^2=x^2+y^2$ | $s\frac{ds}{dt}=x\frac{dx}{dt}+y\frac{dy}{dt}$ |

The cylinder row uses the product rule, because $r$ and $h$ both change. The last row divides by $2$ after differentiating, and it is the equation of the cruiser in Example 3 below.`,
            T`**Laju terkait adalah laju perubahan, terhadap waktu, dari beberapa besaran yang diikat oleh suatu persamaan, sehingga mengetahui seberapa cepat sebagian di antaranya berubah memberi tahu seberapa cepat besaran lain berubah.** Proses mencari salah satunya dari yang lain disebut *soal laju terkait*.

Misalkan udara dipompa ke balon berbentuk bola. Volume $V$ dan jari-jari $r$ sama-sama bertambah terhadap waktu $t$, dan selalu berlaku $V=\frac43\pi r^3$. Karena $r$ adalah fungsi dari $t$, [aturan rantai](article:the-chain-rule#chain-rule) menurunkan persamaan itu:
$$\frac{dV}{dt}=\frac{dV}{dr}\cdot\frac{dr}{dt}=4\pi r^2\frac{dr}{dt}.$$
Ini adalah *persamaan laju terkait*. Persamaan ini berguna karena laju volume mudah diukur, dengan menakar udara yang masuk, sedangkan laju jari-jari tidak. Jika udara masuk $100\ \text{cm}^3/\text{detik}$, maka ketika $r=5$ cm
$$\frac{dr}{dt}=\frac{100}{4\pi\cdot5^2}=\frac1\pi\approx0{,}318\ \text{cm/detik}.$$

**Mengapa ini aturan rantai.** Rumus seperti $A=\pi r^2$ benar pada setiap saat, jadi sebenarnya ia berbunyi $A(t)=\pi\,r(t)^2$. Turunan $r(t)^2$ adalah $2\,r(t)\,r'(t)$: fungsi luar berupa kuadrat, dan fungsi dalam $r(t)$. Setiap persamaan laju terkait dibuat dengan cara ini. Turunkan tiap suku persamaan, dan tiap peubah $q$ yang bergantung pada waktu membawa faktor $\frac{dq}{dt}$, yaitu [laju perubahannya](article:the-derivative-as-a-rate-of-change#rates-and-units).

**Persamaan laju terkait dari rumus-rumus umum.**

| Rumus | Persamaan laju terkait |
|---|---|
| Luas lingkaran, $A=\pi r^2$ | $\frac{dA}{dt}=2\pi r\frac{dr}{dt}$ |
| Volume bola, $V=\frac43\pi r^3$ | $\frac{dV}{dt}=4\pi r^2\frac{dr}{dt}$ |
| Luas permukaan bola, $S=4\pi r^2$ | $\frac{dS}{dt}=8\pi r\frac{dr}{dt}$ |
| Volume kubus, $V=x^3$ | $\frac{dV}{dt}=3x^2\frac{dx}{dt}$ |
| Volume tabung, $V=\pi r^2h$ | $\frac{dV}{dt}=2\pi rh\frac{dr}{dt}+\pi r^2\frac{dh}{dt}$ |
| Jarak, $s^2=x^2+y^2$ | $s\frac{ds}{dt}=x\frac{dx}{dt}+y\frac{dy}{dt}$ |

Baris tabung memakai aturan hasil kali, karena $r$ dan $h$ sama-sama berubah. Baris terakhir dibagi $2$ setelah menurunkan, dan itulah persamaan mobil polisi pada Contoh 3 di bawah.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------------- strategy */
    {
      id: 'strategy',
      heading: L('How do you solve a related rates problem?', 'Bagaimana menyelesaikan soal laju terkait?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Solve a related rates problem in four steps: name the variables and draw a picture, write an equation that relates them, differentiate it with respect to $t$, and only then substitute the numbers of the moment and solve for the unknown rate.**

1. **Name and draw.** Let $t$ be time and give a letter to every quantity that changes with it, assuming each is a differentiable function of $t$. Quantities that stay fixed, such as a distance of $150$ m, need no name. A picture showing the geometry is usually the key.
2. **Relate.** Write an equation between the variables, using geometry (Pythagoras, similar triangles, trigonometry) or a formula for area or volume. Combine equations until only the variables you know something about, and the one you want, are left.
3. **Differentiate.** Differentiate both sides with respect to $t$, using the chain rule on every variable. This is the related rates equation.
4. **Substitute and solve.** Put in the values and rates of the moment. You may need the equation from step 2 to find a missing value. Then solve for the unknown rate, with its sign and its units.

**Example 1: water filling a cone.** Water runs into a conical tank at $0.25\ \text{m}^3/\text{min}$. The tank stands point down, is $3$ m high and has a base radius of $1.5$ m. How fast is the water level rising when the water is $1.8$ m deep?

Let $V$ be the volume of the water, $x$ the radius of its surface and $y$ its depth. The water is a cone, $V=\frac13\pi x^2y$, but nothing is known about $x$ or $\frac{dx}{dt}$, so eliminate $x$. Similar [triangles](article:triangles#congruence-similarity) give $\frac x y=\frac{1.5}{3}$, that is $x=\frac y2$, and so
$$V=\frac13\pi\left(\frac y2\right)^2y=\frac{\pi y^3}{12}.$$
Differentiate with respect to $t$:
$$\frac{dV}{dt}=\frac{\pi y^2}{4}\frac{dy}{dt}.$$
Now put in $y=1.8$ and $\frac{dV}{dt}=0.25$:
$$0.25=\frac{\pi(1.8)^2}{4}\frac{dy}{dt}$$
$$\frac{dy}{dt}=\frac{1}{3.24\pi}\approx0.098\ \text{m/min}.$$
The level is rising at about $0.098$ m per minute. Move the depth below: the same inflow raises the level more and more slowly, because the surface keeps widening.`,
            T`**Selesaikan soal laju terkait dalam empat langkah: beri nama peubah dan gambar, tulis persamaan yang menghubungkannya, turunkan terhadap $t$, dan baru kemudian substitusikan bilangan pada saat itu dan selesaikan untuk laju yang dicari.**

1. **Beri nama dan gambar.** Misalkan $t$ adalah waktu dan beri huruf pada setiap besaran yang berubah terhadapnya, dengan anggapan masing-masing fungsi terdiferensialkan dari $t$. Besaran yang tetap, seperti jarak $150$ m, tidak perlu diberi nama. Gambar yang menunjukkan geometrinya biasanya kuncinya.
2. **Hubungkan.** Tulis persamaan antarpeubah, memakai geometri (Pythagoras, segitiga sebangun, trigonometri) atau rumus luas atau volume. Gabungkan persamaan sampai hanya peubah yang diketahui dan yang dicari yang tersisa.
3. **Turunkan.** Turunkan kedua ruas terhadap $t$, dengan aturan rantai pada setiap peubah. Inilah persamaan laju terkait.
4. **Substitusi dan selesaikan.** Masukkan nilai dan laju pada saat itu. Kamu mungkin memerlukan persamaan dari langkah 2 untuk mencari nilai yang belum ada. Lalu selesaikan untuk laju yang dicari, lengkap dengan tanda dan satuannya.

**Contoh 1: air mengisi kerucut.** Air mengalir ke tangki berbentuk kerucut dengan laju $0{,}25\ \text{m}^3/\text{menit}$. Tangki berdiri dengan ujung di bawah, tingginya $3$ m dan jari-jari alasnya $1{,}5$ m. Seberapa cepat permukaan air naik ketika kedalaman air $1{,}8$ m?

Misalkan $V$ volume air, $x$ jari-jari permukaannya, dan $y$ kedalamannya. Air membentuk kerucut, $V=\frac13\pi x^2y$, tetapi tidak ada informasi tentang $x$ atau $\frac{dx}{dt}$, jadi hilangkan $x$. [Segitiga](article:triangles#congruence-similarity) sebangun memberi $\frac x y=\frac{1{,}5}{3}$, yaitu $x=\frac y2$, sehingga
$$V=\frac13\pi\left(\frac y2\right)^2y=\frac{\pi y^3}{12}.$$
Turunkan terhadap $t$:
$$\frac{dV}{dt}=\frac{\pi y^2}{4}\frac{dy}{dt}.$$
Sekarang masukkan $y=1{,}8$ dan $\frac{dV}{dt}=0{,}25$:
$$0{,}25=\frac{\pi(1{,}8)^2}{4}\frac{dy}{dt}$$
$$\frac{dy}{dt}=\frac{1}{3{,}24\pi}\approx0{,}098\ \text{m/menit}.$$
Permukaan air naik sekitar $0{,}098$ m per menit. Geser kedalaman di bawah: aliran yang sama menaikkan permukaan makin lambat, karena permukaannya terus melebar.`,
          ),
        },
        { kind: 'widget', name: 'conefill' },
      ],
    },

    /* ---------------------------------------------------------------------- examples */
    {
      id: 'examples',
      heading: L('What do worked related rates examples look like?', 'Seperti apa contoh soal laju terkait yang dikerjakan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Five more problems show the four steps with a tangent, a distance, a moving tangent line, a fast jet and a rope over a pulley, and each answer comes from differentiating one equation.**

**Example 2: a balloon and a range finder.** A balloon rises straight up from a level field and is tracked by a range finder $150$ m from the liftoff point. When the elevation angle is $\frac\pi4$, the angle is increasing at $0.14$ rad/min. How fast is the balloon rising? Let $\theta$ be the angle and $y$ the height. Then $y=150\tan\theta$, and with the [derivative of the tangent](article:derivatives-of-trigonometric-functions#other-four)
$$\frac{dy}{dt}=150\sec^2\theta\,\frac{d\theta}{dt}$$
$$\frac{dy}{dt}=150\cdot2\cdot0.14=42\ \text{m/min},$$
because $\sec^2\frac\pi4=2$.

**Example 3: a cruiser chasing a car.** A police cruiser approaches a right-angled intersection from the north, chasing a car that has turned the corner and is moving east. When the cruiser is $0.6$ km north of the intersection and the car is $0.8$ km east of it, the distance between them is increasing at $30$ km/h. The cruiser is moving at $100$ km/h. How fast is the car going? Let $x$ be the car's position, $y$ the cruiser's and $s$ the distance between them, so $s^2=x^2+y^2$ and, at that moment, $s=\sqrt{0.8^2+0.6^2}=1$ km. Differentiating,
$$s\frac{ds}{dt}=x\frac{dx}{dt}+y\frac{dy}{dt}$$
$$1\cdot30=0.8\frac{dx}{dt}+0.6\cdot(-100).$$
The cruiser is coming closer, so $\frac{dy}{dt}=-100$, and $\frac{dx}{dt}=\frac{30+60}{0.8}=112.5$ km/h.

**Example 4: a sliding tangent line.** A particle moves clockwise at a constant rate around a circle of radius $10$ m centered at the origin, from $(0,10)$ to $(10,0)$ in $30$ s. The tangent at the particle meets the $x$-axis at $Q$, a distance $x$ from the origin. How fast is $Q$ moving when $x=20$ m? Let $\theta$ be the angle from the $x$-axis to the radius through the particle. Then $x\cos\theta=10$, and a quarter turn in half a minute makes $\frac{d\theta}{dt}=-\pi$ rad/min, negative because $\theta$ is decreasing. The product rule gives
$$\frac{dx}{dt}\cos\theta-x\sin\theta\,\frac{d\theta}{dt}=0.$$
At $x=20$ we have $\cos\theta=\frac12$ and $\sin\theta=\frac{\sqrt3}{2}$, so $\frac12\frac{dx}{dt}=20\cdot\frac{\sqrt3}{2}\cdot(-\pi)$ and $\frac{dx}{dt}=-20\sqrt3\,\pi\approx-108.8$ m/min. The minus sign says that $Q$ moves toward the origin.

**Example 5: a jet and a radar station.** A jet flies at a constant altitude of $10$ km toward a radar station on an island. When first detected, the line of sight makes an angle of $30^\circ$ with sea level and is turning upward at $\frac13$ degree per second. How fast is the jet approaching? With $x$ in kilometers, $x=10\cot\theta$, so $\frac{dx}{dt}=-10\csc^2\theta\,\frac{d\theta}{dt}$. Here the units need care. Angles in derivatives are in radians, and the answer is wanted in km/h, so
$$\frac{d\theta}{dt}=\frac13\cdot\frac{\pi}{180}\cdot3600=\frac{20\pi}{3}\ \text{rad/h}.$$
With $\csc^2\frac\pi6=4$,
$$\frac{dx}{dt}=-10\cdot4\cdot\frac{20\pi}{3}$$
$$\frac{dx}{dt}=-\frac{800\pi}{3}\approx-837.8\ \text{km/h}.$$

**Example 6: a weight on a rope.** A rope runs over a pulley $P$ that is $6$ m above a point $O$ and lifts a weight $W$; the worker holds the other end at the height of $O$ and walks away from the line under the pulley at $1.2$ m/s. The rope is $13.5$ m long. How fast is the weight rising when the worker is $x=6.3$ m from the line? Let $h$ be the height of $W$ above $O$. The rope has $6-h$ m from $W$ to $P$ and $z$ m from $P$ to the hand, so $z=7.5+h$, and Pythagoras gives $z^2=6^2+x^2$:
$$x^2+36=(7.5+h)^2$$
$$2x\frac{dx}{dt}=2(7.5+h)\frac{dh}{dt}.$$
When $x=6.3$ the equation gives $(7.5+h)^2=36+39.69=75.69$, so $7.5+h=8.7$, and
$$\frac{dh}{dt}=\frac{x}{7.5+h}\frac{dx}{dt}$$
$$\frac{dh}{dt}=\frac{6.3}{8.7}\cdot1.2\approx0.869\ \text{m/s}.$$

The tool below does the same steps for these problems, or for an equation of your own. Leave one value empty and it is worked out from the equation, as the angle was in Example 4.`,
            T`**Lima soal lagi menunjukkan empat langkah itu dengan tangen, jarak, garis singgung yang bergerak, jet yang cepat, dan tali pada katrol, dan setiap jawaban berasal dari menurunkan satu persamaan.**

**Contoh 2: balon dan pengukur jarak.** Sebuah balon naik tegak lurus dari lapangan datar dan diamati oleh pengukur jarak yang berada $150$ m dari titik lepas landas. Ketika sudut elevasinya $\frac\pi4$, sudut itu bertambah dengan laju $0{,}14$ rad/menit. Seberapa cepat balon naik? Misalkan $\theta$ sudutnya dan $y$ tingginya. Maka $y=150\tan\theta$, dan dengan [turunan tangen](article:derivatives-of-trigonometric-functions#other-four)
$$\frac{dy}{dt}=150\sec^2\theta\,\frac{d\theta}{dt}$$
$$\frac{dy}{dt}=150\cdot2\cdot0{,}14=42\ \text{m/menit},$$
karena $\sec^2\frac\pi4=2$.

**Contoh 3: mobil polisi mengejar mobil.** Sebuah mobil polisi mendekati persimpangan siku-siku dari utara, mengejar mobil yang telah berbelok dan melaju ke timur. Ketika mobil polisi $0{,}6$ km di utara persimpangan dan mobil buruan $0{,}8$ km di timurnya, jarak keduanya bertambah $30$ km/jam. Mobil polisi melaju $100$ km/jam. Seberapa cepat mobil buruan itu melaju? Misalkan $x$ posisi mobil buruan, $y$ posisi mobil polisi, dan $s$ jarak keduanya, sehingga $s^2=x^2+y^2$ dan, pada saat itu, $s=\sqrt{0{,}8^2+0{,}6^2}=1$ km. Menurunkan,
$$s\frac{ds}{dt}=x\frac{dx}{dt}+y\frac{dy}{dt}$$
$$1\cdot30=0{,}8\frac{dx}{dt}+0{,}6\cdot(-100).$$
Mobil polisi makin dekat, jadi $\frac{dy}{dt}=-100$, dan $\frac{dx}{dt}=\frac{30+60}{0{,}8}=112{,}5$ km/jam.

**Contoh 4: garis singgung yang bergeser.** Sebuah partikel bergerak searah jarum jam dengan laju tetap mengelilingi lingkaran berjari-jari $10$ m berpusat di titik asal, dari $(0,10)$ ke $(10,0)$ dalam $30$ detik. Garis singgung di partikel memotong sumbu-$x$ di $Q$, berjarak $x$ dari titik asal. Seberapa cepat $Q$ bergerak ketika $x=20$ m? Misalkan $\theta$ sudut dari sumbu-$x$ ke jari-jari yang melalui partikel. Maka $x\cos\theta=10$, dan seperempat putaran dalam setengah menit membuat $\frac{d\theta}{dt}=-\pi$ rad/menit, negatif karena $\theta$ berkurang. Aturan hasil kali memberi
$$\frac{dx}{dt}\cos\theta-x\sin\theta\,\frac{d\theta}{dt}=0.$$
Pada $x=20$ berlaku $\cos\theta=\frac12$ dan $\sin\theta=\frac{\sqrt3}{2}$, sehingga $\frac12\frac{dx}{dt}=20\cdot\frac{\sqrt3}{2}\cdot(-\pi)$ dan $\frac{dx}{dt}=-20\sqrt3\,\pi\approx-108{,}8$ m/menit. Tanda minus berarti $Q$ bergerak menuju titik asal.

**Contoh 5: jet dan stasiun radar.** Sebuah jet terbang pada ketinggian tetap $10$ km menuju stasiun radar di sebuah pulau. Ketika pertama terdeteksi, garis pandang membentuk sudut $30^\circ$ dengan permukaan laut dan naik dengan laju $\frac13$ derajat per detik. Seberapa cepat jet itu mendekat? Dengan $x$ dalam kilometer, $x=10\cot\theta$, sehingga $\frac{dx}{dt}=-10\csc^2\theta\,\frac{d\theta}{dt}$. Di sini satuan perlu diperhatikan. Sudut dalam turunan dinyatakan dalam radian, dan jawaban diminta dalam km/jam, sehingga
$$\frac{d\theta}{dt}=\frac13\cdot\frac{\pi}{180}\cdot3600=\frac{20\pi}{3}\ \text{rad/jam}.$$
Dengan $\csc^2\frac\pi6=4$,
$$\frac{dx}{dt}=-10\cdot4\cdot\frac{20\pi}{3}$$
$$\frac{dx}{dt}=-\frac{800\pi}{3}\approx-837{,}8\ \text{km/jam}.$$

**Contoh 6: beban pada tali.** Sebuah tali melewati katrol $P$ yang berada $6$ m di atas titik $O$ dan mengangkat beban $W$; pekerja memegang ujung lainnya setinggi $O$ dan berjalan menjauhi garis di bawah katrol dengan kecepatan $1{,}2$ m/detik. Panjang tali $13{,}5$ m. Seberapa cepat beban naik ketika pekerja berjarak $x=6{,}3$ m dari garis itu? Misalkan $h$ tinggi $W$ di atas $O$. Tali memiliki panjang $6-h$ m dari $W$ ke $P$ dan $z$ m dari $P$ ke tangan, sehingga $z=7{,}5+h$, dan Pythagoras memberi $z^2=6^2+x^2$:
$$x^2+36=(7{,}5+h)^2$$
$$2x\frac{dx}{dt}=2(7{,}5+h)\frac{dh}{dt}.$$
Ketika $x=6{,}3$ persamaan itu memberi $(7{,}5+h)^2=36+39{,}69=75{,}69$, sehingga $7{,}5+h=8{,}7$, dan
$$\frac{dh}{dt}=\frac{x}{7{,}5+h}\frac{dx}{dt}$$
$$\frac{dh}{dt}=\frac{6{,}3}{8{,}7}\cdot1{,}2\approx0{,}869\ \text{m/detik}.$$

Alat di bawah melakukan langkah yang sama untuk soal-soal ini, atau untuk persamaan buatanmu sendiri. Kosongkan satu nilai dan ia dihitung dari persamaan, seperti sudut pada Contoh 4.`,
          ),
        },
        { kind: 'widget', name: 'ratestool' },
      ],
    },

    /* ------------------------------------------------------------------------- ladder */
    {
      id: 'ladder',
      heading: L('Why does a sliding ladder speed up as it falls?', 'Mengapa tangga yang meluncur makin cepat saat turun?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A ladder whose foot is pulled away from a wall at a steady speed has a top that falls at $\frac xy$ times the speed of the foot, a ratio that grows as the top comes down.** Let the ladder have the length $L$, its foot $x$ from the wall and its top $y$ above the floor. The ladder, the wall and the floor make a right triangle, so for all $t$
$$x^2+y^2=L^2,$$
and $L$ is constant. Differentiating with respect to $t$,
$$2x\frac{dx}{dt}+2y\frac{dy}{dt}=0\quad\Rightarrow\quad\frac{dy}{dt}=-\frac xy\,\frac{dx}{dt}.$$
For a $5$ m ladder with the foot $3$ m from the wall (so the top is $y=\sqrt{25-9}=4$ m high) pulled at $2$ m/s, the top falls at $\frac34\cdot2=1.5$ m/s.

Because $\frac xy$ is small near the wall and large near the floor, the top is slow at first and fast at the end. The two speeds are equal when $x=y$, that is at $x=\frac{L}{\sqrt2}$, where the ladder is at $45^\circ$. Beyond that the top moves faster than the foot, and as $y\to0$ the ratio $\frac xy$ grows without bound. A real ladder cannot do this: it leaves the wall before the top reaches the floor, and the equation describes only a ladder that stays in contact with it. Try the sliders below; the dashed line marks $x=\frac{L}{\sqrt2}$.`,
            T`**Tangga yang kakinya ditarik menjauhi dinding dengan kecepatan tetap memiliki ujung atas yang jatuh dengan kecepatan $\frac xy$ kali kecepatan kaki, rasio yang membesar saat ujung atas turun.** Misalkan panjang tangga $L$, kakinya berjarak $x$ dari dinding, dan ujung atasnya setinggi $y$ dari lantai. Tangga, dinding, dan lantai membentuk segitiga siku-siku, sehingga untuk semua $t$
$$x^2+y^2=L^2,$$
dan $L$ konstan. Menurunkan terhadap $t$,
$$2x\frac{dx}{dt}+2y\frac{dy}{dt}=0\quad\Rightarrow\quad\frac{dy}{dt}=-\frac xy\,\frac{dx}{dt}.$$
Untuk tangga $5$ m dengan kaki $3$ m dari dinding (sehingga ujung atas setinggi $y=\sqrt{25-9}=4$ m) yang ditarik $2$ m/detik, ujung atas jatuh dengan kecepatan $\frac34\cdot2=1{,}5$ m/detik.

Karena $\frac xy$ kecil di dekat dinding dan besar di dekat lantai, ujung atas lambat pada awalnya dan cepat pada akhirnya. Kedua kecepatan sama besar ketika $x=y$, yaitu di $x=\frac{L}{\sqrt2}$, tempat tangga membentuk sudut $45^\circ$. Setelah itu ujung atas bergerak lebih cepat daripada kaki, dan saat $y\to0$ rasio $\frac xy$ membesar tanpa batas. Tangga nyata tidak dapat melakukannya: ia terlepas dari dinding sebelum ujung atas mencapai lantai, dan persamaan itu hanya menggambarkan tangga yang tetap menempel pada dinding. Coba penggeser di bawah; garis putus-putus menandai $x=\frac{L}{\sqrt2}$.`,
          ),
        },
        { kind: 'widget', name: 'ladder' },
      ],
    },

    /* ---------------------------------------------------------------- substitute late */
    {
      id: 'substitute-late',
      heading: L('When do you put the numbers in?', 'Kapan bilangan dimasukkan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Differentiate first and substitute afterwards: until the very end every changing quantity is a function of time, and a number put in too early is a constant, whose rate of change is $0$.** Take the balloon again. If you set $r=5$ in $V=\frac43\pi r^3$ at the start, you get $V=\frac{500\pi}{3}$, a constant, and differentiating gives $\frac{dV}{dt}=0$, which says that the balloon does not grow. The numbers you are given belong to *one moment*, while the equation holds at *every* moment. Differentiate the equation that holds at every moment, then read it at the one moment you care about.

**What you may put in before differentiating** is only what never changes or always holds:
- the constants of the problem: the $150$ m to the range finder, the $10$ km altitude of the jet, the length of the ladder, the $6$ m height of the pulley;
- relations between the variables, which you use to remove a variable you have no information about, as the similar triangles removed $x$ in Example 1.

**Three checks on the answer.**
- *Sign.* A quantity that is decreasing has a negative rate. The cruiser's $y$ falls, so $\frac{dy}{dt}=-100$ and not $100$; a negative answer, like $-108.8$ m/min for $Q$, says that the quantity is decreasing, and its speed is the absolute value.
- *Units.* The unit of the answer is the unit of the quantity per unit of time: m/min, km/h, $\text{cm}^3/\text{s}$. If the data mix minutes with hours, or degrees with radians, convert first, as in Example 5.
- *Radians.* The derivative formulas for $\sin$, $\cos$, $\tan$ and the others hold only for angles in radians. A rate in degrees per second must be converted before it is used in $\sec^2\theta\,\frac{d\theta}{dt}$.`,
            T`**Turunkan dahulu dan substitusikan sesudahnya: sampai tahap akhir setiap besaran yang berubah adalah fungsi waktu, dan bilangan yang dimasukkan terlalu dini adalah konstanta, yang laju perubahannya $0$.** Ambil balon tadi. Jika kamu menetapkan $r=5$ dalam $V=\frac43\pi r^3$ di awal, kamu mendapat $V=\frac{500\pi}{3}$, sebuah konstanta, dan menurunkannya memberi $\frac{dV}{dt}=0$, yang berarti balon tidak membesar. Bilangan yang diberikan berlaku untuk *satu saat*, sedangkan persamaannya berlaku pada *setiap* saat. Turunkan persamaan yang berlaku pada setiap saat, lalu bacalah pada satu saat yang kamu minati.

**Yang boleh dimasukkan sebelum menurunkan** hanyalah yang tidak pernah berubah atau selalu berlaku:
- konstanta soal: $150$ m ke pengukur jarak, ketinggian jet $10$ km, panjang tangga, tinggi katrol $6$ m;
- hubungan antarpeubah, yang dipakai untuk menghilangkan peubah yang tidak ada informasinya, seperti segitiga sebangun menghilangkan $x$ pada Contoh 1.

**Tiga pemeriksaan jawaban.**
- *Tanda.* Besaran yang berkurang memiliki laju negatif. $y$ milik mobil polisi berkurang, jadi $\frac{dy}{dt}=-100$ dan bukan $100$; jawaban negatif, seperti $-108{,}8$ m/menit untuk $Q$, berarti besaran itu berkurang, dan kelajuannya adalah nilai mutlaknya.
- *Satuan.* Satuan jawaban adalah satuan besaran per satuan waktu: m/menit, km/jam, $\text{cm}^3/\text{detik}$. Jika data mencampur menit dengan jam, atau derajat dengan radian, ubah dahulu, seperti pada Contoh 5.
- *Radian.* Rumus turunan $\sin$, $\cos$, $\tan$, dan yang lain hanya berlaku untuk sudut dalam radian. Laju dalam derajat per detik harus diubah sebelum dipakai dalam $\sec^2\theta\,\frac{d\theta}{dt}$.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------------ in code */
    {
      id: 'related-rates-in-code',
      heading: L('How do you solve related rates problems in code?', 'Bagaimana menyelesaikan soal laju terkait dengan kode?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**With SymPy, declare each quantity as a function of ´t´, differentiate the equation with ´sp.diff´, put in the numbers of the moment and solve for the unknown rate.** The function below does the four steps of this article and reproduces Examples 1, 2, 3 and 5 with exact answers: $\frac{25}{81\pi}\approx0.0982$, $42$, $\frac{225}{2}$ and $-\frac{800\pi}{3}$. The last lines check the ladder without differentiating anything: they move the foot at $2$ m/s, time the top over a tiny step, and get the $-1.5$ m/s of the formula.`,
            T`**Dengan SymPy, deklarasikan tiap besaran sebagai fungsi dari ´t´, turunkan persamaan dengan ´sp.diff´, masukkan bilangan pada saat itu, dan selesaikan untuk laju yang dicari.** Fungsi di bawah melakukan empat langkah artikel ini dan mereproduksi Contoh 1, 2, 3, dan 5 dengan jawaban eksak: $\frac{25}{81\pi}\approx0{,}0982$, $42$, $\frac{225}{2}$, dan $-\frac{800\pi}{3}$. Baris terakhir memeriksa tangga tanpa menurunkan apa pun: kaki digeser $2$ m/detik, ujung atas diukur selama langkah waktu yang sangat kecil, dan hasilnya $-1{,}5$ m/detik seperti pada rumus.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python and SymPy: related rates by differentiating in time', 'Python dan SymPy: laju terkait dengan menurunkan terhadap waktu'),
          code: `import math
import sympy as sp

t = sp.symbols('t')


def solve_rate(relation, quantities, values, rates, unknown):
    """Differentiate relation (left - right = 0) in time, put in one moment's numbers, solve for d(unknown)/dt."""
    d = {q: sp.Symbol('d' + q.func.__name__) for q in quantities}
    dF = sp.diff(relation, t)                       # step 3: the related rates equation
    for q in quantities:
        dF = dF.subs(sp.Derivative(q, t), d[q])     # dq/dt becomes a plain symbol
    dF = dF.subs(values).subs({d[q]: r for q, r in rates.items()})   # step 4: put in the moment
    return sp.simplify(sp.solve(dF, d[unknown])[0])


y, V, theta, x, s = (sp.Function(n)(t) for n in ('y', 'V', 'theta', 'x', 's'))

# Example 1: V = pi y^3 / 12, dV/dt = 1/4, y = 9/5
print(solve_rate(V - sp.pi * y**3 / 12, [V, y], {y: sp.Rational(9, 5)}, {V: sp.Rational(1, 4)}, y))
# 25/(81*pi)   (0.0982)

# Example 2: y = 150 tan(theta), theta = pi/4, dtheta/dt = 0.14
print(solve_rate(y - 150 * sp.tan(theta), [y, theta], {theta: sp.pi / 4}, {theta: sp.Rational(14, 100)}, y))
# 42

# Example 3: s^2 = x^2 + y^2 with x = 0.8, y = 0.6, s = 1, dy/dt = -100, ds/dt = 30
print(solve_rate(s**2 - x**2 - y**2, [s, x, y], {s: 1, x: sp.Rational(4, 5), y: sp.Rational(3, 5)}, {y: -100, s: 30}, x))
# 225/2        (112.5)

# Example 5: x = 10 cot(theta), theta = pi/6, dtheta/dt = 20 pi / 3 rad per hour
print(solve_rate(x - 10 * sp.cot(theta), [x, theta], {theta: sp.pi / 6}, {theta: 20 * sp.pi / 3}, x))
# -800*pi/3    (-837.76)

# the ladder, timed without any derivative: L = 5, foot at 3 m moving at 2 m/s
L = 5.0
foot = lambda time: 3 + 2 * time
top = lambda time: math.sqrt(L**2 - foot(time) ** 2)
dt = 1e-6
print(round((top(dt) - top(0)) / dt, 4), -(3 / 4) * 2)       # -1.5 -1.5`,
        },
      ],
    },

    /* ----------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where do related rates come from?', 'Dari mana asal laju terkait?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Related rates are the original problem of Newton's calculus: given a relation between quantities that flow with time, find the relation between their rates of flow.**

- **Fluents and fluxions.** In his *Method of Fluxions*, written in 1671 and published in 1736, Isaac Newton called a quantity that changes with time a *fluent* and its rate of change a *fluxion*, written with a dot, $\dot x$. His first problem is the one of this article: the relation of the fluents to each other is given, and the relation of their fluxions is wanted.
- **Two notations.** Leibniz published his differential notation $\frac{dx}{dt}$ in 1684, and it prevailed in textbooks, because it shows which quantity is differentiated with respect to which and makes the chain rule look like a cancelation of fractions. Newton's dot survives in physics and engineering, where $\dot x$ is the derivative of a position with respect to time.
- **Time as the variable.** Newton thought of time as the quantity that flows evenly and of everything else as depending on it. This is the reason why in a related rates problem there is no $x$-axis with a function on it: all the quantities are functions of $t$, and the equation between them is a constraint that holds at every moment.`,
            T`**Laju terkait adalah masalah asli kalkulus Newton: diberikan hubungan antarbesaran yang mengalir terhadap waktu, carilah hubungan antara laju aliran mereka.**

- **Fluen dan fluksi.** Dalam *Method of Fluxions*, yang ditulis pada 1671 dan terbit pada 1736, Isaac Newton menyebut besaran yang berubah terhadap waktu *fluen* dan laju perubahannya *fluksi*, ditulis dengan titik, $\dot x$. Masalah pertamanya adalah masalah artikel ini: hubungan antarfluen diberikan, dan hubungan antarfluksinya dicari.
- **Dua notasi.** Leibniz menerbitkan notasi diferensialnya $\frac{dx}{dt}$ pada 1684, dan notasi itu unggul di buku teks, karena menunjukkan besaran mana yang diturunkan terhadap besaran mana dan membuat aturan rantai tampak seperti mencoret pecahan. Titik Newton bertahan dalam fisika dan teknik, tempat $\dot x$ adalah turunan posisi terhadap waktu.
- **Waktu sebagai peubah.** Newton memandang waktu sebagai besaran yang mengalir merata dan segala hal lain bergantung padanya. Inilah alasan mengapa dalam soal laju terkait tidak ada sumbu-$x$ dengan suatu fungsi di atasnya: semua besaran adalah fungsi dari $t$, dan persamaan di antaranya adalah kendala yang berlaku pada setiap saat.`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What mistakes do people make in related rates problems?', 'Kesalahan apa yang sering terjadi pada soal laju terkait?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes in related rates problems are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ Put $r=5$ into $V=\frac43\pi r^3$ and then differentiate, getting $\frac{dV}{dt}=0$ | Differentiate first, $\frac{dV}{dt}=4\pi r^2\frac{dr}{dt}$, and put $r=5$ afterwards. |
| ❌ $\frac{d}{dt}\left(r^2\right)=2r$ | $r$ depends on $t$, so the chain rule gives $2r\frac{dr}{dt}$. |
| ❌ $\frac{dA}{dt}=2\pi r$ for $A=\pi r^2$ | That is $\frac{dA}{dr}$. The rate in time is $2\pi r\frac{dr}{dt}$. |
| ❌ Write $\frac{dy}{dt}=100$ for a cruiser that is approaching the intersection at $100$ km/h | $y$ is decreasing, so $\frac{dy}{dt}=-100$. |
| ❌ Use $\frac13$ degree per second with an answer in km/h, unchanged | Convert to radians per hour first: $\frac{20\pi}{3}$ rad/h. |
| ❌ Take the distance between the car and the cruiser as $0.8+0.6=1.4$ | Pythagoras: $s=\sqrt{0.8^2+0.6^2}=1$ km. |
| ❌ Differentiate $V=\frac13\pi x^2y$ with $\frac{dx}{dt}$ unknown and leave it | Remove $x$ first with similar triangles, $x=\frac y2$, so $V=\frac{\pi y^3}{12}$. |
| ❌ Give a fixed length, such as the $150$ m to the range finder, a rate | A constant has $\frac{d}{dt}(150)=0$; it needs no name and does not appear. |
| ❌ Read $-108.8$ m/min as "$Q$ moves away at $108.8$" | The minus sign says that $x$ is decreasing: $Q$ moves toward the origin at $108.8$ m/min. |`,
            T`**Kesalahan paling umum pada soal laju terkait adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ Memasukkan $r=5$ ke $V=\frac43\pi r^3$ lalu menurunkan, sehingga mendapat $\frac{dV}{dt}=0$ | Turunkan dahulu, $\frac{dV}{dt}=4\pi r^2\frac{dr}{dt}$, dan masukkan $r=5$ sesudahnya. |
| ❌ $\frac{d}{dt}\left(r^2\right)=2r$ | $r$ bergantung pada $t$, sehingga aturan rantai memberi $2r\frac{dr}{dt}$. |
| ❌ $\frac{dA}{dt}=2\pi r$ untuk $A=\pi r^2$ | Itu $\frac{dA}{dr}$. Laju terhadap waktu adalah $2\pi r\frac{dr}{dt}$. |
| ❌ Menulis $\frac{dy}{dt}=100$ untuk mobil polisi yang mendekati persimpangan dengan $100$ km/jam | $y$ berkurang, sehingga $\frac{dy}{dt}=-100$. |
| ❌ Memakai $\frac13$ derajat per detik dengan jawaban dalam km/jam, tanpa diubah | Ubah dahulu ke radian per jam: $\frac{20\pi}{3}$ rad/jam. |
| ❌ Mengambil jarak mobil buruan dan mobil polisi sebagai $0{,}8+0{,}6=1{,}4$ | Pythagoras: $s=\sqrt{0{,}8^2+0{,}6^2}=1$ km. |
| ❌ Menurunkan $V=\frac13\pi x^2y$ dengan $\frac{dx}{dt}$ tidak diketahui dan membiarkannya | Hilangkan $x$ dahulu dengan segitiga sebangun, $x=\frac y2$, sehingga $V=\frac{\pi y^3}{12}$. |
| ❌ Memberi laju pada panjang tetap, seperti $150$ m ke pengukur jarak | Konstanta memiliki $\frac{d}{dt}(150)=0$; ia tidak perlu diberi nama dan tidak muncul. |
| ❌ Membaca $-108{,}8$ m/menit sebagai "$Q$ menjauh dengan $108{,}8$" | Tanda minus berarti $x$ berkurang: $Q$ bergerak menuju titik asal dengan $108{,}8$ m/menit. |`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------- practice */
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
              L('If $A=\\pi r^2$ and $r$ changes with time, then $\\frac{dA}{dt}=2\\pi r$.', 'Jika $A=\\pi r^2$ dan $r$ berubah terhadap waktu, maka $\\frac{dA}{dt}=2\\pi r$.'),
              L('$\\frac{d}{dt}\\left(r^3\\right)=3r^2\\frac{dr}{dt}$.', '$\\frac{d}{dt}\\left(r^3\\right)=3r^2\\frac{dr}{dt}$.'),
              L('A quantity that is decreasing has a negative rate of change.', 'Besaran yang berkurang memiliki laju perubahan negatif.'),
              L('The numbers of the moment should be put into the equation before differentiating.', 'Bilangan pada saat itu harus dimasukkan ke persamaan sebelum menurunkan.'),
              L('For a sliding ladder, $x\\frac{dx}{dt}+y\\frac{dy}{dt}=0$.', 'Untuk tangga yang meluncur, $x\\frac{dx}{dt}+y\\frac{dy}{dt}=0$.'),
              L('The derivative of $\\tan\\theta$ is $\\sec^2\\theta$ also when $\\theta$ is in degrees.', 'Turunan $\\tan\\theta$ adalah $\\sec^2\\theta$ juga ketika $\\theta$ dalam derajat.'),
            ],
            answer: [false, true, true, false, true, false],
            explain: L(
              'The first one is $\\frac{dA}{dr}$: the rate in time carries $\\frac{dr}{dt}$. Numbers go in after differentiating, and the derivative formulas of trigonometric functions need radians.',
              'Yang pertama adalah $\\frac{dA}{dr}$: laju terhadap waktu membawa $\\frac{dr}{dt}$. Bilangan dimasukkan setelah menurunkan, dan rumus turunan fungsi trigonometri memerlukan radian.',
            ),
            hint: L('Ask which variables depend on $t$, and when a number stops changing.', 'Tanyakan peubah mana yang bergantung pada $t$, dan kapan suatu bilangan berhenti berubah.'),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L('Choose **all** the correct related rates equations.', 'Pilih **semua** persamaan laju terkait yang benar.'),
            options: [
              L('$V=x^3$ gives $\\frac{dV}{dt}=3x^2\\frac{dx}{dt}$', '$V=x^3$ memberi $\\frac{dV}{dt}=3x^2\\frac{dx}{dt}$'),
              L('$A=\\pi r^2$ gives $\\frac{dA}{dt}=2\\pi r\\frac{dr}{dt}$', '$A=\\pi r^2$ memberi $\\frac{dA}{dt}=2\\pi r\\frac{dr}{dt}$'),
              L('$s^2=x^2+y^2$ gives $s\\frac{ds}{dt}=x\\frac{dx}{dt}+y\\frac{dy}{dt}$', '$s^2=x^2+y^2$ memberi $s\\frac{ds}{dt}=x\\frac{dx}{dt}+y\\frac{dy}{dt}$'),
              L('$V=\\pi r^2h$ gives $\\frac{dV}{dt}=2\\pi rh\\frac{dr}{dt}$', '$V=\\pi r^2h$ memberi $\\frac{dV}{dt}=2\\pi rh\\frac{dr}{dt}$'),
              L('$y=150\\tan\\theta$ gives $\\frac{dy}{dt}=150\\sec^2\\theta\\frac{d\\theta}{dt}$', '$y=150\\tan\\theta$ memberi $\\frac{dy}{dt}=150\\sec^2\\theta\\frac{d\\theta}{dt}$'),
            ],
            answer: [0, 1, 2, 4],
            explain: L('The cylinder has two changing quantities, so the product rule adds $\\pi r^2\\frac{dh}{dt}$.', 'Tabung memiliki dua besaran yang berubah, sehingga aturan hasil kali menambahkan $\\pi r^2\\frac{dh}{dt}$.'),
            hint: L('When two factors both change, differentiate each of them.', 'Ketika dua faktor sama-sama berubah, turunkan masing-masing.'),
          },
        },
        {
          kind: 'activity',
          title: L('A growing cube', 'Kubus yang membesar'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L('$V=x^3$, so $\\frac{dV}{dt}=3x^2\\frac{dx}{dt}$.', '$V=x^3$, sehingga $\\frac{dV}{dt}=3x^2\\frac{dx}{dt}$.'), L('$3\\cdot5^2\\cdot2$.', '$3\\cdot5^2\\cdot2$.')],
            explain: L('$\\frac{dV}{dt}=3\\cdot25\\cdot2=150\\ \\text{cm}^3/\\text{s}$.', '$\\frac{dV}{dt}=3\\cdot25\\cdot2=150\\ \\text{cm}^3/\\text{detik}$.'),
            prompt: L('The edge $x$ of a cube grows at $2$ cm/s. How fast is its volume growing, in $\\text{cm}^3/\\text{s}$, when $x=5$ cm?', 'Rusuk $x$ sebuah kubus bertambah $2$ cm/detik. Seberapa cepat volumenya bertambah, dalam $\\text{cm}^3/\\text{detik}$, ketika $x=5$ cm?'),
            given: String.raw`\frac{dV}{dt}=v`,
            blanks: [{ label: 'dV/dt =', answer: 150 }],
          },
        },
        {
          kind: 'activity',
          title: L('The ladder', 'Tangga'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L('$x^2+y^2=25$ gives $\\frac{dy}{dt}=-\\frac xy\\frac{dx}{dt}$.', '$x^2+y^2=25$ memberi $\\frac{dy}{dt}=-\\frac xy\\frac{dx}{dt}$.'), L('At $x=4$ the height is $y=3$.', 'Pada $x=4$ tingginya $y=3$.')],
            explain: L('$y=\\sqrt{25-16}=3$ and $\\frac{dy}{dt}=-\\frac43\\cdot3=-4$ m/s: the top falls at $4$ m/s.', '$y=\\sqrt{25-16}=3$ dan $\\frac{dy}{dt}=-\\frac43\\cdot3=-4$ m/detik: ujung atas jatuh $4$ m/detik.'),
            prompt: L('A $5$ m ladder leans on a wall and its foot is pulled away at $3$ m/s. Find $\\frac{dy}{dt}$ (in m/s) when the foot is $4$ m from the wall.', 'Tangga $5$ m bersandar pada dinding dan kakinya ditarik menjauh $3$ m/detik. Tentukan $\\frac{dy}{dt}$ (dalam m/detik) ketika kaki berjarak $4$ m dari dinding.'),
            given: String.raw`\frac{dy}{dt}=v`,
            blanks: [{ label: 'dy/dt =', answer: -4 }],
          },
        },
        {
          kind: 'activity',
          title: L('A rate of a sine', 'Laju sebuah sinus'),
          step: {
            kind: 'quiz',
            id: 'p5',
            prompt: L('If $\\theta$ depends on $t$, what is $\\frac{d}{dt}\\sin\\theta$?', 'Jika $\\theta$ bergantung pada $t$, berapa $\\frac{d}{dt}\\sin\\theta$?'),
            options: [L('$\\cos\\theta\\,\\frac{d\\theta}{dt}$', '$\\cos\\theta\\,\\frac{d\\theta}{dt}$'), L('$\\cos\\theta$', '$\\cos\\theta$'), L('$-\\cos\\theta\\,\\frac{d\\theta}{dt}$', '$-\\cos\\theta\\,\\frac{d\\theta}{dt}$'), L('$\\sin\\theta\\,\\frac{d\\theta}{dt}$', '$\\sin\\theta\\,\\frac{d\\theta}{dt}$')],
            answer: 0,
            explain: L('The chain rule: the derivative of the outside function, $\\cos\\theta$, times the rate of the inside, $\\frac{d\\theta}{dt}$.', 'Aturan rantai: turunan fungsi luar, $\\cos\\theta$, kali laju fungsi dalam, $\\frac{d\\theta}{dt}$.'),
            hint: L('Differentiate $\\sin$, then multiply by the rate of its argument.', 'Turunkan $\\sin$, lalu kalikan dengan laju argumennya.'),
          },
        },
        {
          kind: 'activity',
          title: L('A growing distance', 'Jarak yang bertambah'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L('$s\\frac{ds}{dt}=x\\frac{dx}{dt}+y\\frac{dy}{dt}$ and $s=5$.', '$s\\frac{ds}{dt}=x\\frac{dx}{dt}+y\\frac{dy}{dt}$ dan $s=5$.'), L('$3\\cdot1+4\\cdot2=11$.', '$3\\cdot1+4\\cdot2=11$.')],
            explain: L('$s=\\sqrt{9+16}=5$ and $5\\frac{ds}{dt}=3\\cdot1+4\\cdot2=11$, so $\\frac{ds}{dt}=2.2$.', '$s=\\sqrt{9+16}=5$ dan $5\\frac{ds}{dt}=3\\cdot1+4\\cdot2=11$, sehingga $\\frac{ds}{dt}=2{,}2$.'),
            prompt: L('Two points are at $(x,0)$ and $(0,y)$ with $s^2=x^2+y^2$. At the moment $x=3$, $y=4$, $\\frac{dx}{dt}=1$ and $\\frac{dy}{dt}=2$. Find $\\frac{ds}{dt}$.', 'Dua titik berada di $(x,0)$ dan $(0,y)$ dengan $s^2=x^2+y^2$. Pada saat $x=3$, $y=4$, $\\frac{dx}{dt}=1$, dan $\\frac{dy}{dt}=2$. Tentukan $\\frac{ds}{dt}$.'),
            given: String.raw`\frac{ds}{dt}=v`,
            blanks: [{ label: 'ds/dt =', answer: 2.2 }],
          },
        },
        {
          kind: 'activity',
          title: L('The sign of a rate', 'Tanda sebuah laju'),
          step: {
            kind: 'quiz',
            id: 'p7',
            prompt: L('A cruiser approaches an intersection along the $y$-axis at $100$ km/h. What is $\\frac{dy}{dt}$?', 'Sebuah mobil polisi mendekati persimpangan sepanjang sumbu-$y$ dengan $100$ km/jam. Berapa $\\frac{dy}{dt}$?'),
            options: [L('$-100$ km/h', '$-100$ km/jam'), L('$100$ km/h', '$100$ km/jam'), L('$0$', '$0$'), L('$\\frac{1}{100}$ km/h', '$\\frac{1}{100}$ km/jam')],
            answer: 0,
            explain: L('Approaching the intersection (the origin) makes $y$ decrease, so its rate is negative.', 'Mendekati persimpangan (titik asal) membuat $y$ berkurang, sehingga lajunya negatif.'),
            hint: L('Is $y$ growing or shrinking?', 'Apakah $y$ bertambah atau berkurang?'),
          },
        },
        {
          kind: 'activity',
          title: L('A spreading circle', 'Lingkaran yang meluas'),
          step: {
            kind: 'math',
            id: 'p8',
            hints: [L('$\\frac{dA}{dt}=2\\pi r\\frac{dr}{dt}$.', '$\\frac{dA}{dt}=2\\pi r\\frac{dr}{dt}$.'), L('$12\\pi=2\\pi\\cdot3\\cdot\\frac{dr}{dt}$.', '$12\\pi=2\\pi\\cdot3\\cdot\\frac{dr}{dt}$.')],
            explain: L('$12\\pi=6\\pi\\frac{dr}{dt}$, so $\\frac{dr}{dt}=2$ m/min.', '$12\\pi=6\\pi\\frac{dr}{dt}$, sehingga $\\frac{dr}{dt}=2$ m/menit.'),
            prompt: L('An oil slick is a circle whose area grows at $12\\pi\\ \\text{m}^2/\\text{min}$. How fast is the radius growing, in m/min, when $r=3$ m?', 'Bercak minyak berbentuk lingkaran yang luasnya bertambah $12\\pi\\ \\text{m}^2/\\text{menit}$. Seberapa cepat jari-jarinya bertambah, dalam m/menit, ketika $r=3$ m?'),
            given: String.raw`\frac{dr}{dt}=v`,
            blanks: [{ label: 'dr/dt =', answer: 2 }],
          },
        },
        {
          kind: 'activity',
          title: L('The cone again', 'Kerucut lagi'),
          step: {
            kind: 'math',
            id: 'p9',
            hints: [L('For the tank of Example 1, $\\frac{dV}{dt}=\\frac{\\pi y^2}{4}\\frac{dy}{dt}$.', 'Untuk tangki pada Contoh 1, $\\frac{dV}{dt}=\\frac{\\pi y^2}{4}\\frac{dy}{dt}$.'), L('$\\pi=\\frac{\\pi\\cdot4}{4}\\frac{dy}{dt}$.', '$\\pi=\\frac{\\pi\\cdot4}{4}\\frac{dy}{dt}$.')],
            explain: L('$\\pi=\\pi\\frac{dy}{dt}$, so $\\frac{dy}{dt}=1$ m/min.', '$\\pi=\\pi\\frac{dy}{dt}$, sehingga $\\frac{dy}{dt}=1$ m/menit.'),
            prompt: L('Water runs into the tank of Example 1 at $\\pi\\ \\text{m}^3/\\text{min}$. How fast is the level rising, in m/min, when the depth is $y=2$ m?', 'Air mengalir ke tangki pada Contoh 1 dengan laju $\\pi\\ \\text{m}^3/\\text{menit}$. Seberapa cepat permukaan naik, dalam m/menit, ketika kedalamannya $y=2$ m?'),
            given: String.raw`\frac{dy}{dt}=v`,
            blanks: [{ label: 'dy/dt =', answer: 1 }],
          },
        },
        {
          kind: 'activity',
          title: L('Which equation for the balloon?', 'Persamaan mana untuk balon?'),
          step: {
            kind: 'quiz',
            id: 'p10',
            prompt: L('For $y=150\\tan\\theta$, what is $\\frac{dy}{dt}$?', 'Untuk $y=150\\tan\\theta$, berapa $\\frac{dy}{dt}$?'),
            options: [L('$150\\sec^2\\theta\\,\\frac{d\\theta}{dt}$', '$150\\sec^2\\theta\\,\\frac{d\\theta}{dt}$'), L('$150\\sec^2\\theta$', '$150\\sec^2\\theta$'), L('$150\\tan\\theta\\,\\frac{d\\theta}{dt}$', '$150\\tan\\theta\\,\\frac{d\\theta}{dt}$'), L('$150\\cot\\theta\\,\\frac{d\\theta}{dt}$', '$150\\cot\\theta\\,\\frac{d\\theta}{dt}$')],
            answer: 0,
            explain: L('The derivative of $\\tan\\theta$ is $\\sec^2\\theta$, and the chain rule multiplies by $\\frac{d\\theta}{dt}$.', 'Turunan $\\tan\\theta$ adalah $\\sec^2\\theta$, dan aturan rantai mengalikannya dengan $\\frac{d\\theta}{dt}$.'),
            hint: L('Use the derivative of the tangent, then the factor of the chain rule.', 'Pakai turunan tangen, lalu faktor aturan rantai.'),
          },
        },
        {
          kind: 'activity',
          title: L('The balloon rising', 'Balon yang naik'),
          step: {
            kind: 'math',
            id: 'p11',
            hints: [L('$\\frac{dy}{dt}=150\\sec^2\\theta\\frac{d\\theta}{dt}$.', '$\\frac{dy}{dt}=150\\sec^2\\theta\\frac{d\\theta}{dt}$.'), L('$\\sec^2\\frac\\pi4=2$.', '$\\sec^2\\frac\\pi4=2$.')],
            explain: L('$150\\cdot2\\cdot0.2=60$ m/min.', '$150\\cdot2\\cdot0{,}2=60$ m/menit.'),
            prompt: L('In Example 2 the angle is increasing at $0.2$ rad/min (instead of $0.14$) when $\\theta=\\frac\\pi4$. How fast is the balloon rising, in m/min?', 'Pada Contoh 2 sudut bertambah $0{,}2$ rad/menit (bukan $0{,}14$) ketika $\\theta=\\frac\\pi4$. Seberapa cepat balon naik, dalam m/menit?'),
            given: String.raw`\frac{dy}{dt}=v`,
            blanks: [{ label: 'dy/dt =', answer: 60 }],
          },
        },
        {
          kind: 'activity',
          title: L('Why not substitute early?', 'Mengapa tidak substitusi lebih dulu?'),
          step: {
            kind: 'quiz',
            id: 'p12',
            prompt: L('Why must the numbers of the moment be put in only after differentiating?', 'Mengapa bilangan pada saat itu hanya boleh dimasukkan setelah menurunkan?'),
            options: [L('a quantity replaced by a number early is a constant, and its rate is $0$', 'besaran yang diganti bilangan terlalu dini adalah konstanta, dan lajunya $0$'), L('numbers cannot be differentiated', 'bilangan tidak dapat diturunkan'), L('it changes the units of the answer', 'ia mengubah satuan jawaban'), L('it changes the sign of every rate', 'ia mengubah tanda setiap laju')],
            answer: 0,
            explain: L('The equation holds at every moment, so it can be differentiated; a number holds at one moment only and has no rate.', 'Persamaan berlaku pada setiap saat, sehingga dapat diturunkan; bilangan berlaku hanya pada satu saat dan tidak memiliki laju.'),
            hint: L('What is the derivative of a constant?', 'Berapa turunan sebuah konstanta?'),
          },
        },
      ],
    },

    /* ----------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: related rates at a glance', 'Ringkasan: laju terkait sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Idea:** quantities tied by an equation have rates that are tied too; differentiate the equation with respect to $t$ and each variable $q$ brings $\frac{dq}{dt}$.
- **Strategy:** name the variables and draw, relate them by an equation, differentiate in $t$, then substitute the values of the moment and solve.
- **Order:** differentiate first, substitute second; only constants and relations that always hold may go in earlier.
- **Removing a variable:** use similar triangles, Pythagoras or trigonometry, as $x=\frac y2$ for the cone.
- **Sign, units, radians:** a decreasing quantity has a negative rate; convert units; angles in radians.
- **Ladder:** $x^2+y^2=L^2$ gives $\frac{dy}{dt}=-\frac xy\frac{dx}{dt}$, faster than the foot once $x>y$.
- **Code:** ´sp.diff(relation, t)´ and ´sp.solve´ for the unknown rate.`,
            T`- **Gagasan:** besaran yang diikat oleh persamaan memiliki laju yang juga terikat; turunkan persamaan terhadap $t$ dan tiap peubah $q$ membawa $\frac{dq}{dt}$.
- **Strategi:** beri nama peubah dan gambar, hubungkan dengan persamaan, turunkan terhadap $t$, lalu substitusikan nilai pada saat itu dan selesaikan.
- **Urutan:** turunkan dulu, substitusi kemudian; hanya konstanta dan hubungan yang selalu berlaku yang boleh dimasukkan lebih awal.
- **Menghilangkan peubah:** pakai segitiga sebangun, Pythagoras, atau trigonometri, seperti $x=\frac y2$ untuk kerucut.
- **Tanda, satuan, radian:** besaran yang berkurang memiliki laju negatif; ubah satuan; sudut dalam radian.
- **Tangga:** $x^2+y^2=L^2$ memberi $\frac{dy}{dt}=-\frac xy\frac{dx}{dt}$, lebih cepat daripada kaki begitu $x>y$.
- **Kode:** ´sp.diff(relation, t)´ dan ´sp.solve´ untuk laju yang dicari.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Related rates problem', 'Soal laju terkait'), definition: L('A problem in which several quantities change with time and are tied by an equation, and the rate of one of them is found from the rates of the others at a given moment.', 'Soal ketika beberapa besaran berubah terhadap waktu dan diikat oleh suatu persamaan, dan laju salah satunya dicari dari laju yang lain pada saat tertentu.') },
    { term: L('Related rates equation', 'Persamaan laju terkait'), definition: L('The equation obtained by differentiating an equation between changing quantities with respect to time, so that it contains their rates of change.', 'Persamaan yang diperoleh dengan menurunkan persamaan antarbesaran yang berubah terhadap waktu, sehingga memuat laju perubahan mereka.') },
    { term: L('Rate of change with respect to time', 'Laju perubahan terhadap waktu'), definition: L('The derivative of a quantity with respect to time t, written dq over dt, which says how fast the quantity changes at one moment.', 'Turunan suatu besaran terhadap waktu t, ditulis dq per dt, yang menyatakan seberapa cepat besaran itu berubah pada satu saat.') },
    { term: L('Similar triangles', 'Segitiga sebangun'), definition: L('Triangles with equal angles, whose sides are in the same ratio; used in related rates to remove a variable, as the radius of the water surface in a cone.', 'Segitiga dengan sudut-sudut sama, yang sisi-sisinya berbanding sama; dipakai dalam laju terkait untuk menghilangkan peubah, seperti jari-jari permukaan air dalam kerucut.') },
    { term: L('Fluent and fluxion', 'Fluen dan fluksi'), definition: L('Newton\'s names for a quantity that changes with time and for its rate of change; a fluxion is what we now call a time derivative and write with a dot.', 'Nama Newton untuk besaran yang berubah terhadap waktu dan untuk laju perubahannya; fluksi adalah yang sekarang kita sebut turunan waktu dan kita tulis dengan titik.') },
    { term: L('Constant of the problem', 'Konstanta soal'), definition: L('A quantity that does not change with time, such as the length of a ladder, whose rate is zero and which may be put into the equation before differentiating.', 'Besaran yang tidak berubah terhadap waktu, seperti panjang tangga, yang lajunya nol dan boleh dimasukkan ke persamaan sebelum menurunkan.') },
  ],

  howTo: [
    {
      name: L('How to solve a related rates problem', 'Cara menyelesaikan soal laju terkait'),
      description: L('Name the changing quantities, relate them by an equation, differentiate in time and put in the numbers of the moment.', 'Beri nama besaran yang berubah, hubungkan dengan persamaan, turunkan terhadap waktu, dan masukkan bilangan pada saat itu.'),
      steps: [
        { name: L('Name the quantities and draw', 'Beri nama besaran dan gambar'), text: L('Let t be time, give a letter to every quantity that changes with it, leave fixed lengths without a name, and draw a picture of the situation.', 'Misalkan t adalah waktu, beri huruf pada setiap besaran yang berubah terhadapnya, biarkan panjang tetap tanpa nama, dan gambar situasinya.') },
        { name: L('Write an equation that relates them', 'Tulis persamaan yang menghubungkan'), text: L('Use geometry or a formula, and use similar triangles or Pythagoras to remove any variable that has no given rate.', 'Pakai geometri atau rumus, dan pakai segitiga sebangun atau Pythagoras untuk menghilangkan peubah yang tidak punya laju.') },
        { name: L('Differentiate with respect to time', 'Turunkan terhadap waktu'), text: L('Differentiate both sides with respect to t, and let every variable q bring the factor dq over dt by the chain rule.', 'Turunkan kedua ruas terhadap t, dan biarkan setiap peubah q membawa faktor dq per dt lewat aturan rantai.') },
        { name: L('Substitute the values of the moment', 'Substitusikan nilai pada saat itu'), text: L('Only now put in the given values and rates, using the equation from step two to find a missing value, and convert the units and the angles to radians.', 'Baru sekarang masukkan nilai dan laju yang diketahui, memakai persamaan dari langkah kedua untuk mencari nilai yang belum ada, dan ubah satuan serta sudut ke radian.') },
        { name: L('Solve and read the answer', 'Selesaikan dan baca jawabannya'), text: L('Solve for the unknown rate and state its sign and units: a negative rate means that the quantity is decreasing.', 'Selesaikan untuk laju yang dicari dan sebutkan tanda serta satuannya: laju negatif berarti besaran itu berkurang.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is a related rates problem?', 'Apa itu soal laju terkait?'),
      a: L(
        'A related rates problem has several quantities that change with time and are tied together by an equation. Given the rates of some of them at one moment, you find the rate of another by differentiating the equation with respect to time.',
        'Soal laju terkait memiliki beberapa besaran yang berubah terhadap waktu dan diikat oleh suatu persamaan. Dengan laju sebagian di antaranya pada satu saat, kamu mencari laju yang lain dengan menurunkan persamaan itu terhadap waktu.',
      ),
    },
    {
      q: L('How do you solve a related rates problem step by step?', 'Bagaimana menyelesaikan soal laju terkait langkah demi langkah?'),
      a: L(
        'Name the changing quantities and draw a picture, write an equation relating them, differentiate both sides with respect to time using the chain rule, then substitute the numbers of the moment and solve for the unknown rate.',
        'Beri nama besaran yang berubah dan gambar, tulis persamaan yang menghubungkannya, turunkan kedua ruas terhadap waktu dengan aturan rantai, lalu substitusikan bilangan pada saat itu dan selesaikan untuk laju yang dicari.',
      ),
    },
    {
      q: L('Why do you differentiate with respect to time in related rates?', 'Mengapa menurunkan terhadap waktu pada laju terkait?'),
      a: L(
        'Because the question is about how fast quantities change as time passes. Each quantity is a function of time, so differentiating the equation between them with respect to time gives an equation between their rates of change.',
        'Karena pertanyaannya tentang seberapa cepat besaran berubah seiring waktu. Setiap besaran adalah fungsi waktu, sehingga menurunkan persamaan di antaranya terhadap waktu memberi persamaan antara laju perubahan mereka.',
      ),
    },
    {
      q: L('When do you substitute the numbers in a related rates problem?', 'Kapan bilangan disubstitusikan pada soal laju terkait?'),
      a: L(
        'After differentiating. A number put in earlier is a constant with rate zero, so it would hide the very rate you want. Only constants of the problem and relations that always hold may be used before differentiating.',
        'Setelah menurunkan. Bilangan yang dimasukkan lebih awal adalah konstanta dengan laju nol, sehingga menyembunyikan laju yang justru dicari. Hanya konstanta soal dan hubungan yang selalu berlaku yang boleh dipakai sebelum menurunkan.',
      ),
    },
    {
      q: L('Why is the rate negative in a related rates problem?', 'Mengapa lajunya negatif pada soal laju terkait?'),
      a: L(
        'A negative rate means that the quantity is decreasing at that moment. A cruiser approaching an intersection has a negative rate for its distance from it, and a negative answer means the quantity falls; its speed is the absolute value.',
        'Laju negatif berarti besaran itu berkurang pada saat tersebut. Mobil polisi yang mendekati persimpangan memiliki laju negatif untuk jaraknya, dan jawaban negatif berarti besaran itu turun; kelajuannya adalah nilai mutlaknya.',
      ),
    },
    {
      q: L('What is the related rates equation for the volume of a sphere?', 'Apa persamaan laju terkait untuk volume bola?'),
      a: L(
        'From the volume 4 over 3 pi r cubed you get the rate of the volume equal to 4 pi r squared times the rate of the radius. The factor 4 pi r squared is the surface area of the sphere.',
        'Dari volume 4 per 3 pi r pangkat tiga diperoleh laju volume sama dengan 4 pi r kuadrat kali laju jari-jari. Faktor 4 pi r kuadrat adalah luas permukaan bola.',
      ),
    },
    {
      q: L('How fast does a sliding ladder fall?', 'Seberapa cepat tangga yang meluncur jatuh?'),
      a: L(
        'The top falls at x over y times the speed of the foot, where x is the distance of the foot from the wall and y the height of the top. It is slow at first and grows without bound as the top nears the floor.',
        'Ujung atas jatuh dengan kecepatan x per y kali kecepatan kaki, dengan x jarak kaki dari dinding dan y tinggi ujung atas. Awalnya lambat dan membesar tanpa batas saat ujung atas mendekati lantai.',
      ),
    },
    {
      q: L('Do angles in related rates have to be in radians?', 'Apakah sudut pada laju terkait harus dalam radian?'),
      a: L(
        'Yes. The derivatives of sine, cosine and tangent are only valid for radians, so a rate given in degrees per second must be converted first. One third of a degree per second is 20 pi over 3 radians per hour.',
        'Ya. Turunan sinus, kosinus, dan tangen hanya berlaku untuk radian, sehingga laju dalam derajat per detik harus diubah lebih dulu. Sepertiga derajat per detik adalah 20 pi per 3 radian per jam.',
      ),
    },
  ],

  references: [
    { title: "Thomas' Calculus: Early Transcendentals in SI Units (15th ed.), Section 3.10: Related Rates", author: 'Joel Hass, Christopher Heil, Maurice D. Weir et al.', year: 2023, source: 'Pearson' },
    { title: 'Calculus (8th ed.), section 3.9: Related Rates', author: 'James Stewart', year: 2015, source: 'Cengage Learning' },
    { title: 'The Method of Fluxions and Infinite Series (translated by John Colson)', author: 'Isaac Newton', year: 1736, source: 'London' },
    { title: 'Nova methodus pro maximis et minimis, itemque tangentibus', author: 'Gottfried Wilhelm Leibniz', year: 1684, source: 'Acta Eruditorum' },
  ],

  related: ['the-chain-rule', 'implicit-differentiation', 'the-derivative-as-a-rate-of-change', 'triangles'],
}
