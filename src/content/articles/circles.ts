import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './circles.meta'

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
    T`**A circle is the set of all points in a plane that lie the same distance, the radius, from a fixed point, the center.** Its circumference is $C=2\pi r$ and the disk it encloses has area $A=\pi r^2$, where $\pi\approx3.14159$ is the ratio of circumference to diameter. An inscribed angle is half the central angle on the same arc, a tangent is perpendicular to the radius, and a circle with center $(h,k)$ has the equation $(x-h)^2+(y-k)^2=r^2$.`,
    T`**Lingkaran adalah himpunan semua titik pada bidang yang berjarak sama, yaitu jari-jari, dari sebuah titik tetap, yaitu pusat.** Kelilingnya $K=2\pi r$ dan cakram yang dibatasinya berluas $L=\pi r^2$, dengan $\pi\approx3{,}14159$ adalah perbandingan keliling terhadap diameter. Sudut keliling adalah setengah sudut pusat pada busur yang sama, garis singgung tegak lurus jari-jari, dan lingkaran berpusat $(h,k)$ memiliki persamaan $(x-h)^2+(y-k)^2=r^2$.`,
  ),

  keyPoints: [
    L(
      T`Every point of a circle is at distance $r$ from the center; the diameter $d=2r$ is the longest chord, and all circles are similar, which is why $\pi=\frac Cd$ is the same for every circle.`,
      T`Setiap titik pada lingkaran berjarak $r$ dari pusat; diameter $d=2r$ adalah tali busur terpanjang, dan semua lingkaran sebangun, itulah sebabnya $\pi=\frac Kd$ sama untuk setiap lingkaran.`,
    ),
    L(
      T`Circumference $C=2\pi r$ and area $A=\pi r^2$; $\pi$ is irrational and transcendental, so $3.14$, $\frac{22}{7}$ and $\frac{355}{113}$ are only approximations.`,
      T`Keliling $K=2\pi r$ dan luas $L=\pi r^2$; $\pi$ irasional dan transendental, sehingga $3{,}14$, $\frac{22}{7}$, dan $\frac{355}{113}$ hanyalah hampiran.`,
    ),
    L(
      T`A central angle of $\theta$ cuts off the fraction $\frac{\theta}{360}$ of the circle: arc $=\frac{\theta}{360}\cdot2\pi r=r\theta$ in radians, sector $=\frac12r^2\theta$, and $180^\circ=\pi$ radians.`,
      T`Sudut pusat $\theta$ memotong bagian $\frac{\theta}{360}$ dari lingkaran: busur $=\frac{\theta}{360}\cdot2\pi r=r\theta$ dalam radian, juring $=\frac12r^2\theta$, dan $180^\circ=\pi$ radian.`,
    ),
    L(
      T`An inscribed angle is half the central angle on the same arc; so an angle in a semicircle is $90^\circ$ (Thales) and opposite angles of a cyclic quadrilateral add up to $180^\circ$.`,
      T`Sudut keliling adalah setengah sudut pusat pada busur yang sama; sehingga sudut dalam setengah lingkaran adalah $90^\circ$ (Thales) dan sudut berhadapan segiempat tali busur berjumlah $180^\circ$.`,
    ),
    L(
      T`A tangent is perpendicular to the radius, the two tangents from an outside point are equal with length $\sqrt{OP^2-r^2}$, and for crossing chords $PA\cdot PB=PC\cdot PD$.`,
      T`Garis singgung tegak lurus jari-jari, kedua garis singgung dari titik di luar sama panjang dengan panjang $\sqrt{OP^2-r^2}$, dan untuk tali busur yang berpotongan $PA\cdot PB=PC\cdot PD$.`,
    ),
    L(
      T`The circle with center $(h,k)$ and radius $r$ is $(x-h)^2+(y-k)^2=r^2$; comparing a squared distance with $r^2$ decides whether a point is inside, on or outside, and a line or another circle can be tested the same way.`,
      T`Lingkaran berpusat $(h,k)$ dan berjari-jari $r$ adalah $(x-h)^2+(y-k)^2=r^2$; membandingkan kuadrat jarak dengan $r^2$ menentukan apakah titik berada di dalam, pada, atau di luar, dan garis atau lingkaran lain dapat diuji dengan cara yang sama.`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------------ what is it */
    {
      id: 'what-is-a-circle',
      heading: L('What is a circle?', 'Apa itu lingkaran?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A circle is the set of all points in a plane that are the same distance, called the radius, from one fixed point, called the center.** The circle is only the curve; the curve together with its inside is the *disk*, and in everyday language "the area of a circle" means the area of the disk.

| Part | Meaning |
|---|---|
| Center | the fixed point $O$ |
| Radius | a segment from the center to the circle; its length is $r$ |
| Diameter | a chord through the center; its length is $d=2r$, the longest possible chord |
| Chord | a segment joining two points of the circle |
| Arc | the piece of the circle between two points |
| Sector | the region between two radii and the arc between them, like a slice of pizza |
| Segment | the region between a chord and its arc |
| Secant | a line through two points of the circle |
| Tangent | a line that touches the circle at exactly one point |
| Circumference | the length of the circle itself |

A circle is perfectly symmetric: every line through the center is a line of symmetry, and turning the circle by any angle about the center leaves it unchanged. It is also *similar* to every other circle, since one is a scaled copy of the other (the same idea as [similar triangles](article:triangles#congruence-similarity)). That is the reason the ratio of circumference to diameter is one number for all circles.`,
            T`**Lingkaran adalah himpunan semua titik pada bidang yang berjarak sama, yang disebut jari-jari, dari satu titik tetap, yang disebut pusat.** Lingkaran hanyalah kurvanya; kurva beserta bagian dalamnya adalah *cakram*, dan dalam bahasa sehari-hari "luas lingkaran" berarti luas cakram.

| Unsur | Arti |
|---|---|
| Pusat | titik tetap $O$ |
| Jari-jari | ruas garis dari pusat ke lingkaran; panjangnya $r$ |
| Diameter | tali busur yang melalui pusat; panjangnya $d=2r$, tali busur terpanjang |
| Tali busur | ruas garis yang menghubungkan dua titik pada lingkaran |
| Busur | bagian lingkaran di antara dua titik |
| Juring | daerah di antara dua jari-jari dan busur di antaranya, seperti potongan pizza |
| Tembereng | daerah di antara tali busur dan busurnya |
| Garis potong | garis yang melalui dua titik pada lingkaran |
| Garis singgung | garis yang menyentuh lingkaran di tepat satu titik |
| Keliling | panjang lingkaran itu sendiri |

Lingkaran sangat simetris: setiap garis melalui pusat adalah sumbu simetri, dan memutar lingkaran dengan sudut berapa pun terhadap pusat tidak mengubahnya. Ia juga *sebangun* dengan setiap lingkaran lain, karena yang satu adalah salinan berskala dari yang lain (gagasan yang sama dengan [segitiga sebangun](article:triangles#congruence-similarity)). Itulah alasan perbandingan keliling terhadap diameter adalah satu bilangan untuk semua lingkaran.`,
          ),
        },
        {
          kind: 'figure',
          figure: {
            dim: 2,
            axes: false,
            xSpan: [-6.5, 6.5],
            ySpan: [-6.5, 6.5],
            aspect: 1,
            items: [
              { t: 'param', x: '5*cos(t)', y: '5*sin(t)', from: 0, to: 6.2832, color: 'a' },
              { t: 'seg', from: [-5, 0], to: [5, 0], color: 'b', dashed: true, label: 'd' },
              { t: 'seg', from: [0, 0], to: [3.83, 3.21], color: 'result', label: 'r' },
              { t: 'seg', from: [-3, 4], to: [4, 3], color: 'c', label: 'chord' },
              { t: 'seg', from: [-4, -5], to: [4, -5], color: 'muted', dashed: true, label: 'tangent' },
              { t: 'point', at: [0, 0], label: 'O', color: 'b' },
            ],
            caption: L(
              'A circle with its center O, a radius r, a diameter d (dashed), a chord, and a tangent that touches it at the bottom.',
              'Lingkaran dengan pusat O, jari-jari r, diameter d (putus-putus), tali busur, dan garis singgung yang menyentuhnya di bagian bawah.',
            ),
          },
        },
      ],
    },

    /* ------------------------------------------------------------------ π */
    {
      id: 'pi-circumference',
      heading: L('What is π, and how do you find the circumference and area of a circle?', 'Apa itu π, dan bagaimana mencari keliling dan luas lingkaran?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The number $\pi\approx3.14159$ is the ratio of the circumference of any circle to its diameter, so the circumference is $C=\pi d=2\pi r$, and the area of the disk is $A=\pi r^2$.**

| Known | Circumference | Area |
|---|---|---|
| radius $r$ | $2\pi r$ | $\pi r^2$ |
| diameter $d$ | $\pi d$ | $\frac{\pi d^2}{4}$ |
| circumference $C$ | $C$ | $\frac{C^2}{4\pi}$ |
| area $A$ | $2\sqrt{\pi A}$ | $A$ |

**Why $\pi r^2$?** Cut the disk into many thin sectors and lay them side by side, alternately pointing up and down. They form a shape that looks more and more like a rectangle as the slices get thinner. Its height is $r$ and its width is half the circumference, $\pi r$, so the area is $\pi r\cdot r=\pi r^2$.

For $r=7$ the circumference is $14\pi\approx43.98$ and the area is $49\pi\approx153.94$. Keep $\pi$ as a symbol as long as you can: the answer "$49\pi$" is exact, while $153.94$ is rounded. A ring (annulus) between radii $R$ and $r$ has area $\pi R^2-\pi r^2=\pi(R-r)(R+r)$; for $R=10$ and $r=6$ that is $64\pi\approx201.06$.

**What kind of number is $\pi$?** It is irrational, so no fraction equals it, and *transcendental*, so it is not the solution of any polynomial equation with whole-number coefficients, a fact that ends the old puzzle of squaring the circle; see [pi, e and transcendental numbers](article:irrational-numbers#pi-e-transcendental). Its first digits are $3.14159\,26535\,89793$. Useful fractions come from [rational approximations](article:irrational-numbers#rational-approximations): $3.14$ is off by $0.05\%$, $\frac{22}{7}\approx3.142857$ by $0.04\%$, and $\frac{355}{113}\approx3.1415929$ by less than $0.00001\%$.

A word problem: a round pond has a diameter of $14$ m and is to be fenced, with $\pi\approx\frac{22}{7}$. The fence is $C=\frac{22}{7}\cdot14=44$ m long, and at 12 dollars per meter it costs $44\cdot12=528$ dollars.

Archimedes found bounds for $\pi$ by squeezing the circle between two polygons. The tool below repeats his doubling, from the hexagon to a polygon with thousands of sides.`,
            T`**Bilangan $\pi\approx3{,}14159$ adalah perbandingan keliling lingkaran mana pun terhadap diameternya, sehingga keliling adalah $K=\pi d=2\pi r$, dan luas cakram adalah $L=\pi r^2$.**

| Diketahui | Keliling | Luas |
|---|---|---|
| jari-jari $r$ | $2\pi r$ | $\pi r^2$ |
| diameter $d$ | $\pi d$ | $\frac{\pi d^2}{4}$ |
| keliling $K$ | $K$ | $\frac{K^2}{4\pi}$ |
| luas $L$ | $2\sqrt{\pi L}$ | $L$ |

**Mengapa $\pi r^2$?** Potong cakram menjadi banyak juring tipis dan letakkan berdampingan, bergantian menghadap ke atas dan ke bawah. Bentuknya makin menyerupai persegi panjang ketika irisannya makin tipis. Tingginya $r$ dan lebarnya setengah keliling, $\pi r$, sehingga luasnya $\pi r\cdot r=\pi r^2$.

Untuk $r=7$ kelilingnya $14\pi\approx43{,}98$ dan luasnya $49\pi\approx153{,}94$. Biarkan $\pi$ sebagai simbol selama mungkin: jawaban "$49\pi$" eksak, sedangkan $153{,}94$ sudah dibulatkan. Cincin (anulus) di antara jari-jari $R$ dan $r$ berluas $\pi R^2-\pi r^2=\pi(R-r)(R+r)$; untuk $R=10$ dan $r=6$ itu $64\pi\approx201{,}06$.

**Bilangan jenis apa $\pi$?** Ia irasional, sehingga tidak ada pecahan yang sama dengannya, dan *transendental*, sehingga ia bukan penyelesaian persamaan polinom mana pun dengan koefisien bilangan bulat, fakta yang mengakhiri teka-teki lama tentang mengkuadratkan lingkaran; lihat [pi, e, dan bilangan transendental](article:irrational-numbers#pi-e-transcendental). Angka-angka pertamanya $3{,}14159\,26535\,89793$. Pecahan yang berguna berasal dari [hampiran rasional](article:irrational-numbers#rational-approximations): $3{,}14$ meleset $0{,}05\%$, $\frac{22}{7}\approx3{,}142857$ meleset $0{,}04\%$, dan $\frac{355}{113}\approx3{,}1415929$ meleset kurang dari $0{,}00001\%$.

Soal cerita: sebuah kolam bundar berdiameter $14$ m akan dipagari, dengan $\pi\approx\frac{22}{7}$. Panjang pagar $K=\frac{22}{7}\cdot14=44$ m, dan dengan harga Rp50.000 per meter biayanya 44 kali Rp50.000, yaitu Rp2.200.000.

Archimedes menemukan batas-batas $\pi$ dengan mengapit lingkaran di antara dua segibanyak. Alat di bawah mengulangi penggandaannya, dari segienam sampai segibanyak dengan ribuan sisi.`,
          ),
        },
        { kind: 'widget', name: 'pibound' },
      ],
    },

    /* ----------------------------------------------------- arcs and sectors */
    {
      id: 'arcs-and-sectors',
      heading: L('How do you find arc length, sector area and segment area?', 'Bagaimana mencari panjang busur, luas juring, dan luas tembereng?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A central angle of $\theta$ cuts off the fraction $\frac{\theta}{360}$ of the circle, so the arc is that fraction of the circumference and the sector is that fraction of the disk; the segment is the sector minus the triangle of the two radii and the chord.**

| Quantity | $\theta$ in degrees | $\theta$ in radians |
|---|---|---|
| Arc length | $\frac{\theta}{360}\cdot2\pi r$ | $r\theta$ |
| Sector area | $\frac{\theta}{360}\cdot\pi r^2$ | $\frac12r^2\theta$ |
| Chord length | $2r\sin\frac{\theta}{2}$ | $2r\sin\frac{\theta}{2}$ |
| Segment area | sector $-$ triangle | $\frac12r^2(\theta-\sin\theta)$ |

**Radians.** One *radian* is the central angle whose arc is exactly as long as the radius. A full turn has $\frac{2\pi r}{r}=2\pi$ radians, so $180^\circ=\pi$ rad and $1\text{ rad}\approx57.2958^\circ$. In radians the arc is simply $r\theta$, which is why mathematics prefers them.

| Degrees | $30^\circ$ | $45^\circ$ | $60^\circ$ | $90^\circ$ | $180^\circ$ | $360^\circ$ |
|---|---|---|---|---|---|---|
| Radians | $\frac{\pi}{6}$ | $\frac{\pi}{4}$ | $\frac{\pi}{3}$ | $\frac{\pi}{2}$ | $\pi$ | $2\pi$ |

**Examples.** For $r=6$ and $\theta=120^\circ$ the fraction is $\frac13$, so the arc is $\frac13\cdot12\pi=4\pi\approx12.57$ and the sector is $\frac13\cdot36\pi=12\pi\approx37.70$. This is the [multiplication of fractions](article:rational-numbers#multiply-divide-fractions) with $\pi$ carried along. For $r=10$ and $\theta=90^\circ$: arc $5\pi\approx15.71$, sector $25\pi\approx78.54$, chord $10\sqrt2\approx14.14$ and segment $25\pi-50\approx28.54$, since the triangle has area $\frac12\cdot10\cdot10=50$.

Choose a radius (or any of the other three quantities) and slide the angle below.`,
            T`**Sudut pusat $\theta$ memotong bagian $\frac{\theta}{360}$ dari lingkaran, sehingga busur adalah bagian itu dari keliling dan juring adalah bagian itu dari cakram; tembereng adalah juring dikurangi segitiga yang dibentuk kedua jari-jari dan tali busur.**

| Besaran | $\theta$ dalam derajat | $\theta$ dalam radian |
|---|---|---|
| Panjang busur | $\frac{\theta}{360}\cdot2\pi r$ | $r\theta$ |
| Luas juring | $\frac{\theta}{360}\cdot\pi r^2$ | $\frac12r^2\theta$ |
| Panjang tali busur | $2r\sin\frac{\theta}{2}$ | $2r\sin\frac{\theta}{2}$ |
| Luas tembereng | juring $-$ segitiga | $\frac12r^2(\theta-\sin\theta)$ |

**Radian.** Satu *radian* adalah sudut pusat yang busurnya tepat sepanjang jari-jari. Satu putaran penuh memiliki $\frac{2\pi r}{r}=2\pi$ radian, sehingga $180^\circ=\pi$ rad dan $1\text{ rad}\approx57{,}2958^\circ$. Dalam radian busur cukup $r\theta$, itulah sebabnya matematika lebih menyukainya.

| Derajat | $30^\circ$ | $45^\circ$ | $60^\circ$ | $90^\circ$ | $180^\circ$ | $360^\circ$ |
|---|---|---|---|---|---|---|
| Radian | $\frac{\pi}{6}$ | $\frac{\pi}{4}$ | $\frac{\pi}{3}$ | $\frac{\pi}{2}$ | $\pi$ | $2\pi$ |

**Contoh.** Untuk $r=6$ dan $\theta=120^\circ$ bagiannya $\frac13$, sehingga busurnya $\frac13\cdot12\pi=4\pi\approx12{,}57$ dan juringnya $\frac13\cdot36\pi=12\pi\approx37{,}70$. Ini adalah [perkalian pecahan](article:rational-numbers#multiply-divide-fractions) dengan $\pi$ yang ikut terbawa. Untuk $r=10$ dan $\theta=90^\circ$: busur $5\pi\approx15{,}71$, juring $25\pi\approx78{,}54$, tali busur $10\sqrt2\approx14{,}14$, dan tembereng $25\pi-50\approx28{,}54$, karena segitiganya berluas $\frac12\cdot10\cdot10=50$.

Pilih jari-jari (atau salah satu dari tiga besaran lain) dan geser sudutnya di bawah.`,
          ),
        },
        { kind: 'widget', name: 'circlecalc' },
      ],
    },

    /* --------------------------------------------------------------- angles */
    {
      id: 'angle-theorems',
      heading: L('What are the angle theorems of a circle?', 'Apa saja teorema sudut pada lingkaran?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**An inscribed angle (a vertex on the circle) is half the central angle on the same arc, and from this one theorem come the right angle in a semicircle, equal angles in the same segment and the $180^\circ$ of a cyclic quadrilateral.**

- **Central angle.** An angle at the center measures the same, in degrees, as the arc it cuts off.
- **Inscribed angle theorem.** An angle $\angle APB$ with $P$ on the circle is half the central angle $\angle AOB$ on the same arc: central $120^\circ$ gives inscribed $60^\circ$.
- **Same segment.** Inscribed angles on the same arc are equal, wherever $P$ moves on the other part of the circle.
- **Thales.** If $AB$ is a diameter, the arc is $180^\circ$, so every inscribed angle $\angle APB$ is $90^\circ$. The converse is the fact that the circumcenter of a right triangle is the midpoint of its hypotenuse, as in the [centers of a triangle](article:triangles#centers).
- **Cyclic quadrilateral.** If all four vertices lie on a circle, opposite angles add up to $180^\circ$, because they are half of two arcs that together make $360^\circ$. With $\angle A=75^\circ$ the opposite angle is $\angle C=105^\circ$. Ptolemy's theorem and Brahmagupta's area formula in the [history of quadrilaterals](article:quadrilaterals#history) are about these shapes.
- **Tangent and radius.** A tangent is perpendicular to the radius at the point where it touches.
- **Tangent and chord.** The angle between a tangent and a chord equals the inscribed angle on the other side of the chord (the alternate segment).

**Why one half?** Take the case where one side of the angle passes through the center. The triangle $OPA$ is isosceles ($OP=OA=r$), so its base angles are equal, and the central angle is an exterior angle of that triangle, equal to the sum of the two base angles, as in the [angle sum and exterior angle](article:triangles#angle-sum). So the central angle is twice the inscribed one. The general case adds or subtracts two such cases.

Slide the four points below: the inscribed angles on the same side of $AB$ stay equal, and on opposite sides they add up to $180^\circ$.`,
            T`**Sudut keliling (titik sudut berada pada lingkaran) adalah setengah sudut pusat pada busur yang sama, dan dari satu teorema ini lahir sudut siku-siku dalam setengah lingkaran, sudut sama besar pada busur yang sama, serta $180^\circ$ pada segiempat tali busur.**

- **Sudut pusat.** Sudut di pusat besarnya sama, dalam derajat, dengan busur yang dipotongnya.
- **Teorema sudut keliling.** Sudut $\angle APB$ dengan $P$ pada lingkaran adalah setengah sudut pusat $\angle AOB$ pada busur yang sama: sudut pusat $120^\circ$ memberi sudut keliling $60^\circ$.
- **Busur yang sama.** Sudut keliling pada busur yang sama sama besar, ke mana pun $P$ bergerak pada bagian lingkaran yang lain.
- **Thales.** Jika $AB$ diameter, busurnya $180^\circ$, sehingga setiap sudut keliling $\angle APB$ adalah $90^\circ$. Kebalikannya adalah fakta bahwa pusat lingkaran luar segitiga siku-siku adalah titik tengah hipotenusanya, seperti pada [titik-titik penting segitiga](article:triangles#centers).
- **Segiempat tali busur.** Jika keempat titik sudut terletak pada lingkaran, sudut berhadapan berjumlah $180^\circ$, karena keduanya setengah dari dua busur yang bersama-sama membentuk $360^\circ$. Dengan $\angle A=75^\circ$ sudut di hadapannya $\angle C=105^\circ$. Teorema Ptolemaios dan rumus luas Brahmagupta dalam [sejarah segiempat](article:quadrilaterals#history) berkaitan dengan bangun ini.
- **Garis singgung dan jari-jari.** Garis singgung tegak lurus jari-jari di titik sentuhnya.
- **Garis singgung dan tali busur.** Sudut antara garis singgung dan tali busur sama dengan sudut keliling di sisi lain tali busur (busur yang berseberangan).

**Mengapa setengah?** Ambil kasus ketika salah satu kaki sudut melalui pusat. Segitiga $OPA$ sama kaki ($OP=OA=r$), sehingga sudut alasnya sama besar, dan sudut pusat adalah sudut luar segitiga itu, sama dengan jumlah kedua sudut alas, seperti pada [jumlah sudut dan sudut luar](article:triangles#angle-sum). Jadi sudut pusat dua kali sudut keliling. Kasus umum menambah atau mengurangkan dua kasus seperti itu.

Geser keempat titik di bawah: sudut keliling pada sisi $AB$ yang sama tetap sama, dan pada sisi yang berlawanan berjumlah $180^\circ$.`,
          ),
        },
        { kind: 'widget', name: 'circangle' },
      ],
    },

    /* ------------------------------------------------------ chords, tangents */
    {
      id: 'chords-and-tangents',
      heading: L('What are the rules for chords, tangents and secants?', 'Apa saja aturan untuk tali busur, garis singgung, dan garis potong?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The perpendicular from the center to a chord cuts the chord in half, a tangent is perpendicular to the radius, and the products of the pieces of crossing chords or secants are equal; all three come from the right triangles that the radius makes.**

- **Chord and center.** If a chord is at distance $d$ from the center, its length is $2\sqrt{r^2-d^2}$. With $r=5$ and $d=3$ it is $2\sqrt{25-9}=8$, the $3$–$4$–$5$ triangle of the [Pythagorean theorem](article:pythagorean-theorem#what-is-the-theorem). Equal chords are equally far from the center, and the closer a chord is to the center the longer it is; the diameter ($d=0$) is the longest.
- **Two tangents.** From a point $P$ outside the circle there are two tangents, and the two tangent segments have equal length $\sqrt{OP^2-r^2}$. With $r=5$ and $OP=13$ the length is $\sqrt{169-25}=12$, the $5$–$12$–$13$ triangle.
- **Crossing chords.** If two chords $AB$ and $CD$ cross at $P$ inside the circle, then $PA\cdot PB=PC\cdot PD$. For $PA=3$, $PB=8$ and $PC=4$ we get $PD=6$, since $3\cdot8=4\cdot6=24$.
- **Secants and tangents.** From a point $P$ outside, two secants give $PA\cdot PB=PC\cdot PD$, and a tangent $PT$ and a secant give $PT^2=PA\cdot PB$. For the tangent $12$ above and the secant through the center, $PA=13-5=8$ and $PB=13+5=18$, and $8\cdot18=144=12^2$.

All of these say one thing: the number $|PO|^2-r^2$, the *power of the point* $P$, is negative inside the circle, zero on it and positive outside, and for every line through $P$ that meets the circle at $A$ and $B$ the product $PA\cdot PB$ equals its absolute value. Radicals like $2\sqrt{r^2-d^2}$ are often best left in [simplified form](article:exponents-and-radicals#simplify-radicals).`,
            T`**Garis tegak lurus dari pusat ke tali busur membagi tali busur itu menjadi dua sama panjang, garis singgung tegak lurus jari-jari, dan hasil kali potongan tali busur atau garis potong yang berpotongan sama; ketiganya berasal dari segitiga siku-siku yang dibentuk jari-jari.**

- **Tali busur dan pusat.** Jika tali busur berjarak $d$ dari pusat, panjangnya $2\sqrt{r^2-d^2}$. Dengan $r=5$ dan $d=3$ panjangnya $2\sqrt{25-9}=8$, segitiga $3$–$4$–$5$ dari [teorema Pythagoras](article:pythagorean-theorem#what-is-the-theorem). Tali busur yang sama panjang berjarak sama dari pusat, dan makin dekat tali busur ke pusat makin panjang ia; diameter ($d=0$) yang terpanjang.
- **Dua garis singgung.** Dari titik $P$ di luar lingkaran ada dua garis singgung, dan kedua ruas garis singgung sama panjang, $\sqrt{OP^2-r^2}$. Dengan $r=5$ dan $OP=13$ panjangnya $\sqrt{169-25}=12$, segitiga $5$–$12$–$13$.
- **Tali busur berpotongan.** Jika dua tali busur $AB$ dan $CD$ berpotongan di $P$ di dalam lingkaran, maka $PA\cdot PB=PC\cdot PD$. Untuk $PA=3$, $PB=8$, dan $PC=4$ diperoleh $PD=6$, karena $3\cdot8=4\cdot6=24$.
- **Garis potong dan garis singgung.** Dari titik $P$ di luar, dua garis potong memberi $PA\cdot PB=PC\cdot PD$, dan garis singgung $PT$ serta garis potong memberi $PT^2=PA\cdot PB$. Untuk garis singgung $12$ di atas dan garis potong melalui pusat, $PA=13-5=8$ dan $PB=13+5=18$, dan $8\cdot18=144=12^2$.

Semuanya menyatakan satu hal: bilangan $|PO|^2-r^2$, yaitu *kuasa titik* $P$, negatif di dalam lingkaran, nol pada lingkaran, dan positif di luar, dan untuk setiap garis melalui $P$ yang memotong lingkaran di $A$ dan $B$ hasil kali $PA\cdot PB$ sama dengan nilai mutlaknya. Bentuk akar seperti $2\sqrt{r^2-d^2}$ sering paling baik dibiarkan dalam [bentuk sederhana](article:exponents-and-radicals#simplify-radicals).`,
          ),
        },
      ],
    },

    /* -------------------------------------------------------------- equation */
    {
      id: 'equation',
      heading: L('What is the equation of a circle?', 'Apa persamaan lingkaran?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The circle with center $(h,k)$ and radius $r$ is the set of points $(x,y)$ with $(x-h)^2+(y-k)^2=r^2$, because that says the squared distance to the center is $r^2$.** For the center $(3,-2)$ and $r=5$ it is $(x-3)^2+(y+2)^2=25$.

Expanding (see [expanding brackets](article:algebraic-expressions#expand)) gives the *general form* $x^2+y^2+Dx+Ey+F=0$ with $D=-2h$, $E=-2k$ and $F=h^2+k^2-r^2$. Our circle is $x^2+y^2-6x+4y-12=0$. To go back, *complete the square* in $x$ and in $y$: $x^2-6x=(x-3)^2-9$ and $y^2+4y=(y+2)^2-4$, so $(x-3)^2+(y+2)^2=12+9+4=25$. The general form describes a real circle only when $r^2=\frac{D^2}{4}+\frac{E^2}{4}-F$ is positive.

**Where is a point?** Compare the squared distance $(x-h)^2+(y-k)^2$ with $r^2$: smaller means inside, equal means on the circle, larger means outside. For the circle above, $(0,0)$ gives $13<25$ (inside), $(8,-2)$ gives $25$ (on it) and $(9,5)$ gives $85>25$ (outside).

**Through three points.** Three points that are not on one line lie on exactly one circle, the circumcircle of the triangle they form. The circle through $(0,0)$, $(6,0)$ and $(0,8)$ has center $(3,4)$, the midpoint of the hypotenuse, and $r=5$: $(x-3)^2+(y-4)^2=25$.

**The unit circle.** For $r=1$ and the center at the origin, $x^2+y^2=1$, and the points are $(\cos t,\sin t)$. Rational points also exist: $(\frac35,\frac45)$ is on it because $3^2+4^2=5^2$, the same [Pythagorean triple](article:pythagorean-theorem#pythagorean-triples) in disguise.`,
            T`**Lingkaran berpusat $(h,k)$ dan berjari-jari $r$ adalah himpunan titik $(x,y)$ dengan $(x-h)^2+(y-k)^2=r^2$, karena itu menyatakan bahwa kuadrat jarak ke pusat adalah $r^2$.** Untuk pusat $(3,-2)$ dan $r=5$ persamaannya $(x-3)^2+(y+2)^2=25$.

Menjabarkannya (lihat [menjabarkan kurung](article:algebraic-expressions#expand)) memberi *bentuk umum* $x^2+y^2+Dx+Ey+F=0$ dengan $D=-2h$, $E=-2k$, dan $F=h^2+k^2-r^2$. Lingkaran kita adalah $x^2+y^2-6x+4y-12=0$. Untuk kembali, *lengkapkan kuadrat* pada $x$ dan $y$: $x^2-6x=(x-3)^2-9$ dan $y^2+4y=(y+2)^2-4$, sehingga $(x-3)^2+(y+2)^2=12+9+4=25$. Bentuk umum menggambarkan lingkaran nyata hanya bila $r^2=\frac{D^2}{4}+\frac{E^2}{4}-F$ positif.

**Di mana letak sebuah titik?** Bandingkan kuadrat jarak $(x-h)^2+(y-k)^2$ dengan $r^2$: lebih kecil berarti di dalam, sama berarti pada lingkaran, lebih besar berarti di luar. Untuk lingkaran di atas, $(0,0)$ memberi $13<25$ (di dalam), $(8,-2)$ memberi $25$ (pada lingkaran), dan $(9,5)$ memberi $85>25$ (di luar).

**Melalui tiga titik.** Tiga titik yang tidak segaris terletak pada tepat satu lingkaran, lingkaran luar segitiga yang dibentuknya. Lingkaran melalui $(0,0)$, $(6,0)$, dan $(0,8)$ berpusat di $(3,4)$, titik tengah hipotenusa, dan $r=5$: $(x-3)^2+(y-4)^2=25$.

**Lingkaran satuan.** Untuk $r=1$ dengan pusat di titik asal, $x^2+y^2=1$, dan titik-titiknya $(\cos t,\sin t)$. Ada juga titik rasional: $(\frac35,\frac45)$ terletak padanya karena $3^2+4^2=5^2$, [tripel Pythagoras](article:pythagorean-theorem#pythagorean-triples) yang sama dalam samaran.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------- relations */
    {
      id: 'lines-and-circles',
      heading: L('How can a line, a point or another circle meet a circle?', 'Bagaimana garis, titik, atau lingkaran lain dapat bertemu sebuah lingkaran?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Compare a distance with the radius: a line that is farther than $r$ from the center misses the circle, one at distance exactly $r$ is a tangent, and one closer than $r$ is a secant; two circles are decided the same way by the distance $d$ between their centers.**

**A line and a circle.** Let $d$ be the distance from the center to the line. If $d>r$ there is no common point, if $d=r$ there is exactly one (the line is a tangent, and the point of contact is where the perpendicular from the center lands), and if $d<r$ there are two. Algebraically, substituting the line into $(x-h)^2+(y-k)^2=r^2$ gives a quadratic equation, and these are its cases: no solution, one double solution, two solutions. For the circle $x^2+y^2=25$ the line $y=3$ is at distance $3$ and meets it at $(\pm4,3)$, the line $x=5$ at distance $5$ touches it at $(5,0)$, and the line $x=6$ misses it.

**Two circles** with radii $r_1,r_2$ and center distance $d$ lie in one of these ways, where $\delta=|r_1-r_2|$ is the difference of the radii:

| Distance between the centers | How the circles lie |
|---|---|
| $d>r_1+r_2$ | apart, outside each other |
| $d=r_1+r_2$ | touching from outside, one common point |
| $\delta<d<r_1+r_2$ | crossing in two points |
| $d=\delta$ | touching from inside, one common point |
| $d<\delta$ | one inside the other |

With radii $5$ and $3$ these are the distances $d=9$, $8$, $6$, $2$ and $1$. The tool uses exact fractions, so a tangent is recognized as exactly a tangent. It gives the intersection points in the exact form $a+b\sqrt m$, and the tangent points from an outside point.`,
            T`**Bandingkan sebuah jarak dengan jari-jari: garis yang berjarak lebih dari $r$ dari pusat tidak memotong lingkaran, garis yang berjarak tepat $r$ adalah garis singgung, dan garis yang berjarak kurang dari $r$ adalah garis potong; dua lingkaran ditentukan dengan cara yang sama oleh jarak $d$ antara pusatnya.**

**Garis dan lingkaran.** Misalkan $d$ jarak dari pusat ke garis. Jika $d>r$ tidak ada titik persekutuan, jika $d=r$ ada tepat satu (garis adalah garis singgung, dan titik sentuhnya adalah tempat jatuhnya garis tegak lurus dari pusat), dan jika $d<r$ ada dua. Secara aljabar, mensubstitusi garis ke $(x-h)^2+(y-k)^2=r^2$ memberi persamaan kuadrat, dan inilah kasus-kasusnya: tanpa penyelesaian, satu penyelesaian ganda, dua penyelesaian. Untuk lingkaran $x^2+y^2=25$ garis $y=3$ berjarak $3$ dan memotongnya di $(\pm4,3)$, garis $x=5$ berjarak $5$ menyentuhnya di $(5,0)$, dan garis $x=6$ tidak memotongnya.

**Dua lingkaran** dengan jari-jari $r_1,r_2$ dan jarak pusat $d$ berada dalam salah satu keadaan ini, dengan $\delta=|r_1-r_2|$ selisih jari-jari:

| Jarak antara kedua pusat | Kedudukan kedua lingkaran |
|---|---|
| $d>r_1+r_2$ | saling lepas, di luar satu sama lain |
| $d=r_1+r_2$ | bersinggungan di luar, satu titik persekutuan |
| $\delta<d<r_1+r_2$ | berpotongan di dua titik |
| $d=\delta$ | bersinggungan di dalam, satu titik persekutuan |
| $d<\delta$ | yang satu berada di dalam yang lain |

Dengan jari-jari $5$ dan $3$ itulah jarak $d=9$, $8$, $6$, $2$, dan $1$. Alat ini memakai pecahan eksak, sehingga garis singgung dikenali tepat sebagai garis singgung. Ia memberi titik potong dalam bentuk eksak $a+b\sqrt m$, dan titik singgung dari sebuah titik di luar.`,
          ),
        },
        { kind: 'widget', name: 'circlerel' },
      ],
    },

    /* --------------------------------------------------------------- in code */
    {
      id: 'circles-in-code',
      heading: L('How do you work with circles in code?', 'Bagaimana bekerja dengan lingkaran dalam kode?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Keep the squared radius, not the radius, and every question about a circle with whole-number or fraction data becomes an exact comparison of squared distances; use ´math.pi´ only for lengths and areas at the end.**`,
            T`**Simpan kuadrat jari-jari, bukan jari-jarinya, dan setiap pertanyaan tentang lingkaran dengan data bilangan bulat atau pecahan menjadi perbandingan eksak kuadrat jarak; pakai ´math.pi´ hanya untuk panjang dan luas di akhir.**`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python', 'Python'),
          code: `from fractions import Fraction as F
from math import pi, sin, cos, radians

def power(c, p):                     # |PC|² − r²: negative inside, 0 on the circle, positive outside
    (h, k, r2), (x, y) = c, p
    return (x - h) ** 2 + (y - k) ** 2 - r2

def meets(c, a, b, k):               # the line a·x + b·y = k against the circle: none / tangent / secant
    h, kk, r2 = c
    d2 = F(a * h + b * kk - k) ** 2 / (a * a + b * b)   # squared distance from the center to the line
    return "none" if d2 > r2 else "tangent" if d2 == r2 else "secant"

def sector(r, deg):                  # arc length, sector area, segment area
    t = radians(deg)
    return r * t, r * r * t / 2, r * r * (t - sin(t)) / 2

>>> c = (3, -2, 25)                  # center (3, -2) and the square of the radius, 25
>>> power(c, (0, 0)), power(c, (8, -2)), power(c, (9, 5))
(-12, 0, 60)
>>> meets((0, 0, 25), 0, 1, 3), meets((0, 0, 25), 1, 0, 5), meets((0, 0, 25), 1, 0, 6)
('secant', 'tangent', 'none')
>>> round(2 * pi * 7, 4), round(pi * 7 ** 2, 4)
(43.9823, 153.938)
>>> 22 / 7, 355 / 113, pi
(3.142857142857143, 3.1415929203539825, 3.141592653589793)
>>> sector(10, 90)
(15.707963267948966, 78.53981633974483, 28.539816339744828)
>>> sin(pi)                          # should be 0 ...
1.2246467991473532e-16
>>> cos(radians(3)) ** 2 + sin(radians(3)) ** 2 == 1   # ... and this should be exactly 1
False`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript', 'JavaScript'),
          code: `const r = 7
2 * Math.PI * r                          // 43.982297150257104
Math.PI * r ** 2                         // 153.93804002589985
Math.sin(Math.PI)                        // 1.2246467991473532e-16, not 0
const power = ([h, k, r2], [x, y]) => (x - h) ** 2 + (y - k) ** 2 - r2
power([3, -2, 25], [9, 5])               // 60: outside, exact for whole numbers`,
        },
        {
          kind: 'text',
          text: L(
            T`The pitfalls, in order of how often they bite:

| Pitfall | What happens | What to do |
|---|---|---|
| Testing ´x*x + y*y == r*r´ with floats | rounding makes a point that is on the circle look off it | use whole numbers or ´Fraction´, as in the article on [real numbers in code](article:real-numbers#real-numbers-in-code), or ´math.isclose´ |
| ´sin(pi)´ and ´cos(pi/2)´ | they are about 1e-16, not 0 | never compare with 0; round or use a tolerance |
| Degrees to ´sin´ and ´cos´ | ´sin(30)´ is not 0.5 | convert with ´radians(30)´ |
| Using 3.14 or 22/7 for π | the answer is only as good as the approximation | use ´math.pi´ and round only the final answer |
| Square root of a negative number | ´sqrt(d2 - r2)´ for a tangent length fails inside the circle | check that the power is positive first |
| ´acos´ or ´asin´ of a rounded value | 1.0000000000000002 raises ´ValueError´ | clamp the argument to $[-1,1]$ |
| Radius against diameter | the area uses ´pi * d * d / 4´, not ´pi * d ** 2´ | name the variable ´r´ or ´d´ and keep to it |`,
            T`Jebakannya, berdasarkan seberapa sering terjadi:

| Jebakan | Yang terjadi | Yang sebaiknya dilakukan |
|---|---|---|
| Menguji ´x*x + y*y == r*r´ dengan float | pembulatan membuat titik pada lingkaran tampak di luarnya | pakai bilangan bulat atau ´Fraction´, seperti pada artikel [bilangan real dalam kode](article:real-numbers#real-numbers-in-code), atau ´math.isclose´ |
| ´sin(pi)´ dan ´cos(pi/2)´ | hasilnya sekitar 1e-16, bukan 0 | jangan dibandingkan dengan 0; bulatkan atau pakai toleransi |
| Derajat ke ´sin´ dan ´cos´ | ´sin(30)´ bukan 0,5 | ubah dengan ´radians(30)´ |
| Memakai 3,14 atau 22/7 untuk π | jawabannya hanya sebaik hampirannya | pakai ´math.pi´ dan bulatkan hanya jawaban akhir |
| Akar bilangan negatif | ´sqrt(d2 - r2)´ untuk panjang garis singgung gagal di dalam lingkaran | periksa dulu bahwa kuasanya positif |
| ´acos´ atau ´asin´ dari nilai yang dibulatkan | ´1.0000000000000002´ memunculkan ´ValueError´ | batasi argumen pada $[-1,1]$ |
| Jari-jari dan diameter tertukar | luasnya ´pi * d * d / 4´, bukan ´pi * d ** 2´ | beri nama variabel ´r´ atau ´d´ dan konsisten |`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where does the study of circles come from?', 'Dari mana asal ilmu tentang lingkaran?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The circle is the oldest curve people studied, and the effort to find $\pi$ is among the longest in mathematics.**

- **c. 1800 BCE.** Babylonian texts take the circumference to be three times the diameter, and later $3\frac18$.
- **c. 1650 BCE.** Problem 50 of the Rhind Papyrus says that a round field of diameter 9 has the area of a square of side 8, which is $\pi\approx\left(\frac{16}{9}\right)^2\approx3.16$.
- **c. 300 BCE.** Euclid's *Elements*, Book III, is the theory of circles: chords, tangents, the inscribed angle (III.20), the right angle in a semicircle (III.31) and the crossing chords (III.35, III.36). Book XII shows that the areas of circles are in the ratio of the squares of their diameters.
- **c. 250 BCE.** Archimedes, in *Measurement of a Circle*, squeezes the circle between polygons with 96 sides and proves $3\frac{10}{71}<\pi<3\frac17$; he also shows that the area of a circle equals that of a right triangle with legs $r$ and $C$.
- **c. 480 CE.** Zu Chongzhi in China finds $\frac{355}{113}$, correct to six decimals, a record that lasted nearly a thousand years.
- **c. 1400.** Madhava of Sangamagrama finds an infinite series for $\pi$, the first of its kind.
- **1706.** William Jones uses the Greek letter $\pi$ for the ratio, and Euler makes the symbol standard in the 1730s.
- **1761 and 1882.** Lambert proves that $\pi$ is irrational and Lindemann that it is transcendental, so the circle cannot be squared with compass and straightedge.
- **1873.** James Thomson coins the word *radian* for an idea Roger Cotes had described in 1714.`,
            T`**Lingkaran adalah kurva tertua yang dipelajari manusia, dan upaya mencari $\pi$ termasuk yang terpanjang dalam matematika.**

- **Sekitar 1800 SM.** Teks Babilonia menganggap keliling sama dengan tiga kali diameter, dan kemudian $3\frac18$.
- **Sekitar 1650 SM.** Soal 50 Papirus Rhind mengatakan bahwa ladang bundar berdiameter 9 berluas sama dengan persegi bersisi 8, yaitu $\pi\approx\left(\frac{16}{9}\right)^2\approx3{,}16$.
- **Sekitar 300 SM.** *Elements* Euclid, Buku III, adalah teori lingkaran: tali busur, garis singgung, sudut keliling (III.20), sudut siku-siku dalam setengah lingkaran (III.31), dan tali busur yang berpotongan (III.35, III.36). Buku XII menunjukkan bahwa luas lingkaran berperbandingan seperti kuadrat diameternya.
- **Sekitar 250 SM.** Archimedes, dalam *Measurement of a Circle*, mengapit lingkaran di antara segibanyak bersisi 96 dan membuktikan $3\frac{10}{71}<\pi<3\frac17$; ia juga menunjukkan bahwa luas lingkaran sama dengan luas segitiga siku-siku dengan sisi tegak $r$ dan $K$.
- **Sekitar 480 M.** Zu Chongzhi di Tiongkok menemukan $\frac{355}{113}$, benar sampai enam desimal, rekor yang bertahan hampir seribu tahun.
- **Sekitar 1400.** Madhava dari Sangamagrama menemukan deret tak hingga untuk $\pi$, yang pertama dari jenisnya.
- **1706.** William Jones memakai huruf Yunani $\pi$ untuk perbandingan itu, dan Euler menjadikan simbol itu baku pada 1730-an.
- **1761 dan 1882.** Lambert membuktikan bahwa $\pi$ irasional dan Lindemann bahwa ia transendental, sehingga lingkaran tidak dapat dikuadratkan dengan jangka dan penggaris.
- **1873.** James Thomson menciptakan kata *radian* untuk gagasan yang telah dijelaskan Roger Cotes pada 1714.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What are the common mistakes with circles?', 'Apa kesalahan umum pada lingkaran?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with circles are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ The circumference is $\pi r^2$ | That is the area. The circumference is $2\pi r$. |
| ❌ Putting the diameter into $\pi r^2$ | Halve it first: $r=\frac d2$, or use $\frac{\pi d^2}{4}$. |
| ❌ $\pi$ equals $3.14$ or $\frac{22}{7}$ | Both are approximations; $\pi$ is irrational. |
| ❌ The area is in cm, not cm² | Length is in cm, area in cm², volume in cm³. |
| ❌ Arc length is $r\theta$ with $\theta$ in degrees | That needs radians; with degrees use $\frac{\theta}{360}\cdot2\pi r$. |
| ❌ An inscribed angle equals the central angle | It is half of it. |
| ❌ A tangent can cut the circle twice | A tangent has exactly one common point and is perpendicular to the radius. |
| ❌ Some chord is longer than the diameter | The diameter is the longest chord. |
| ❌ A calculator in the wrong mode | Radians against degrees: $\sin30$ is $0.5$ only in degree mode. |`,
            T`**Kesalahan paling umum pada lingkaran adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ Keliling adalah $\pi r^2$ | Itu luas. Keliling adalah $2\pi r$. |
| ❌ Memasukkan diameter ke $\pi r^2$ | Bagi dua dulu: $r=\frac d2$, atau pakai $\frac{\pi d^2}{4}$. |
| ❌ $\pi$ sama dengan $3{,}14$ atau $\frac{22}{7}$ | Keduanya hampiran; $\pi$ irasional. |
| ❌ Luas dalam cm, bukan cm² | Panjang dalam cm, luas dalam cm², volume dalam cm³. |
| ❌ Panjang busur $r\theta$ dengan $\theta$ dalam derajat | Itu membutuhkan radian; dengan derajat pakai $\frac{\theta}{360}\cdot2\pi r$. |
| ❌ Sudut keliling sama dengan sudut pusat | Ia setengahnya. |
| ❌ Garis singgung dapat memotong lingkaran dua kali | Garis singgung memiliki tepat satu titik persekutuan dan tegak lurus jari-jari. |
| ❌ Ada tali busur yang lebih panjang daripada diameter | Diameter adalah tali busur terpanjang. |
| ❌ Kalkulator pada mode yang salah | Radian atau derajat tertukar: $\sin30$ bernilai $0{,}5$ hanya pada mode derajat. |`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------- practice */
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
              L('The number $\\pi$ is exactly $\\frac{22}{7}$.', 'Bilangan $\\pi$ tepat sama dengan $\\frac{22}{7}$.'),
              L('The diameter is the longest chord of a circle.', 'Diameter adalah tali busur terpanjang pada lingkaran.'),
              L('A tangent is perpendicular to the radius at the point of contact.', 'Garis singgung tegak lurus jari-jari di titik sentuh.'),
              L('An inscribed angle is twice the central angle on the same arc.', 'Sudut keliling dua kali sudut pusat pada busur yang sama.'),
              L('An angle inscribed in a semicircle is a right angle.', 'Sudut keliling dalam setengah lingkaran adalah sudut siku-siku.'),
              L('Opposite angles of a cyclic quadrilateral add up to $180^\\circ$.', 'Sudut berhadapan segiempat tali busur berjumlah $180^\\circ$.'),
            ],
            answer: [false, true, true, false, true, true],
            explain: L(
              '$\\pi$ is irrational, so no fraction equals it. An inscribed angle is half the central angle, so a semicircle (central angle $180^\\circ$) gives $90^\\circ$. The opposite angles of a cyclic quadrilateral are halves of two arcs adding up to $360^\\circ$.',
              '$\\pi$ irasional, sehingga tidak ada pecahan yang sama dengannya. Sudut keliling adalah setengah sudut pusat, sehingga setengah lingkaran (sudut pusat $180^\\circ$) memberi $90^\\circ$. Sudut berhadapan segiempat tali busur adalah setengah dari dua busur yang berjumlah $360^\\circ$.',
            ),
            hint: L('Remember: inscribed angle = half the central angle.', 'Ingat: sudut keliling = setengah sudut pusat.'),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L('Choose **all** the points on the circle $x^2+y^2=25$.', 'Pilih **semua** titik yang terletak pada lingkaran $x^2+y^2=25$.'),
            options: [L('$(3,4)$', '$(3,4)$'), L('$(-5,0)$', '$(-5,0)$'), L('$(4,4)$', '$(4,4)$'), L('$(0,-5)$', '$(0,-5)$'), L('$(2,5)$', '$(2,5)$')],
            answer: [0, 1, 3],
            explain: L(
              '$3^2+4^2=25$, $(-5)^2+0=25$ and $0+(-5)^2=25$. But $4^2+4^2=32$ and $2^2+5^2=29$.',
              '$3^2+4^2=25$, $(-5)^2+0=25$, dan $0+(-5)^2=25$. Tetapi $4^2+4^2=32$ dan $2^2+5^2=29$.',
            ),
            hint: L('Square both coordinates and add: is the sum exactly 25?', 'Kuadratkan kedua koordinat dan jumlahkan: apakah hasilnya tepat 25?'),
          },
        },
        {
          kind: 'activity',
          title: L('A circumference', 'Sebuah keliling'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L('$C=2\\pi r$ with $\\pi\\approx\\frac{22}{7}$.', '$K=2\\pi r$ dengan $\\pi\\approx\\frac{22}{7}$.'), L('$2\\cdot\\frac{22}{7}\\cdot7=44$.', '$2\\cdot\\frac{22}{7}\\cdot7=44$.')],
            explain: L('$C=2\\cdot\\frac{22}{7}\\cdot7=44$.', '$K=2\\cdot\\frac{22}{7}\\cdot7=44$.'),
            prompt: L('Find the circumference of a circle of radius $7$, using $\\pi\\approx\\frac{22}{7}$.', 'Tentukan keliling lingkaran berjari-jari $7$, dengan $\\pi\\approx\\frac{22}{7}$.'),
            given: String.raw`C=2\cdot\frac{22}{7}\cdot7=v`,
            blanks: [{ label: 'v =', answer: 44 }],
          },
        },
        {
          kind: 'activity',
          title: L('An area in terms of π', 'Luas dalam π'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L('$A=\\pi r^2$.', '$L=\\pi r^2$.'), L('$r^2=100$.', '$r^2=100$.')],
            explain: L('$A=\\pi\\cdot10^2=100\\pi$.', '$L=\\pi\\cdot10^2=100\\pi$.'),
            prompt: L('A circle has diameter $20$. Write its area as a multiple of $\\pi$.', 'Sebuah lingkaran berdiameter $20$. Tuliskan luasnya sebagai kelipatan $\\pi$.'),
            given: String.raw`r=10:\quad A=\pi r^2=v\,\pi`,
            blanks: [{ label: 'v =', answer: 100 }],
          },
        },
        {
          kind: 'activity',
          title: L('An arc and a sector', 'Busur dan juring'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [L('The fraction of the circle is $\\frac{120}{360}=\\frac13$.', 'Bagian lingkarannya $\\frac{120}{360}=\\frac13$.'), L('Arc: $\\frac13\\cdot2\\pi\\cdot6$. Sector: $\\frac13\\cdot\\pi\\cdot36$.', 'Busur: $\\frac13\\cdot2\\pi\\cdot6$. Juring: $\\frac13\\cdot\\pi\\cdot36$.')],
            explain: L('Arc $=\\frac13\\cdot12\\pi=4\\pi$ and sector $=\\frac13\\cdot36\\pi=12\\pi$.', 'Busur $=\\frac13\\cdot12\\pi=4\\pi$ dan juring $=\\frac13\\cdot36\\pi=12\\pi$.'),
            prompt: L('A sector has radius $6$ and central angle $120^\\circ$. Write its arc length and its area as multiples of $\\pi$.', 'Sebuah juring berjari-jari $6$ dan sudut pusat $120^\\circ$. Tuliskan panjang busur dan luasnya sebagai kelipatan $\\pi$.'),
            given: String.raw`r=6,\ \theta=120^\circ`,
            blanks: [
              { label: L('arc (times π) =', 'busur (kali π) ='), answer: 4 },
              { label: L('sector (times π) =', 'juring (kali π) ='), answer: 12 },
            ],
          },
        },
        {
          kind: 'activity',
          title: L('The inscribed angle', 'Sudut keliling'),
          step: {
            kind: 'quiz',
            id: 'p6',
            prompt: L('The arc $AB$ has a central angle of $100^\\circ$. What is an inscribed angle $\\angle APB$ on that arc?', 'Busur $AB$ memiliki sudut pusat $100^\\circ$. Berapa sudut keliling $\\angle APB$ pada busur itu?'),
            options: [L('$25^\\circ$', '$25^\\circ$'), L('$50^\\circ$', '$50^\\circ$'), L('$100^\\circ$', '$100^\\circ$'), L('$200^\\circ$', '$200^\\circ$')],
            answer: 1,
            explain: L('An inscribed angle is half the central angle on the same arc: $\\frac{100^\\circ}{2}=50^\\circ$.', 'Sudut keliling adalah setengah sudut pusat pada busur yang sama: $\\frac{100^\\circ}{2}=50^\\circ$.'),
            hint: L('Take half of the central angle.', 'Ambil setengah dari sudut pusat.'),
          },
        },
        {
          kind: 'activity',
          title: L('A chord', 'Sebuah tali busur'),
          step: {
            kind: 'math',
            id: 'p7',
            hints: [L('Half the chord is $12$. The radius, half the chord and the distance form a right triangle.', 'Setengah tali busur adalah $12$. Jari-jari, setengah tali busur, dan jarak membentuk segitiga siku-siku.'), L('$d=\\sqrt{13^2-12^2}$.', '$d=\\sqrt{13^2-12^2}$.')],
            explain: L('$d=\\sqrt{169-144}=\\sqrt{25}=5$.', '$d=\\sqrt{169-144}=\\sqrt{25}=5$.'),
            prompt: L('A chord of length $24$ lies in a circle of radius $13$. How far is it from the center?', 'Tali busur sepanjang $24$ terletak pada lingkaran berjari-jari $13$. Berapa jaraknya dari pusat?'),
            given: String.raw`d=\sqrt{13^2-12^2}=v`,
            blanks: [{ label: 'd =', answer: 5 }],
          },
        },
        {
          kind: 'activity',
          title: L('A tangent', 'Garis singgung'),
          step: {
            kind: 'math',
            id: 'p8',
            hints: [L('The tangent length is $\\sqrt{OP^2-r^2}$.', 'Panjang garis singgung adalah $\\sqrt{OP^2-r^2}$.'), L('$100-36=64$.', '$100-36=64$.')],
            explain: L('$\\sqrt{10^2-6^2}=\\sqrt{64}=8$.', '$\\sqrt{10^2-6^2}=\\sqrt{64}=8$.'),
            prompt: L('A point is $10$ from the center of a circle of radius $6$. How long is the tangent segment from the point to the circle?', 'Sebuah titik berjarak $10$ dari pusat lingkaran berjari-jari $6$. Berapa panjang ruas garis singgung dari titik itu ke lingkaran?'),
            given: String.raw`\sqrt{10^2-6^2}=v`,
            blanks: [{ label: 'v =', answer: 8 }],
          },
        },
        {
          kind: 'activity',
          title: L('General form', 'Bentuk umum'),
          step: {
            kind: 'math',
            id: 'p9',
            hints: [L('Expand $(x-3)^2+(y+2)^2=25$.', 'Jabarkan $(x-3)^2+(y+2)^2=25$.'), L('The constant is $9+4-25$.', 'Konstantanya $9+4-25$.')],
            explain: L('$(x-3)^2+(y+2)^2-25=x^2-6x+9+y^2+4y+4-25=x^2+y^2-6x+4y-12$, so $F=-12$.', '$(x-3)^2+(y+2)^2-25=x^2-6x+9+y^2+4y+4-25=x^2+y^2-6x+4y-12$, sehingga $F=-12$.'),
            prompt: L('The circle with center $(3,-2)$ and radius $5$ is $x^2+y^2-6x+4y+F=0$. Find $F$.', 'Lingkaran berpusat $(3,-2)$ dan berjari-jari $5$ adalah $x^2+y^2-6x+4y+F=0$. Tentukan $F$.'),
            given: String.raw`F=h^2+k^2-r^2=v`,
            blanks: [{ label: 'F =', answer: -12 }],
          },
        },
        {
          kind: 'activity',
          title: L('Two circles', 'Dua lingkaran'),
          step: {
            kind: 'quiz',
            id: 'p10',
            prompt: L('Two circles have radii $4$ and $9$, and their centers are $5$ apart. How do they lie?', 'Dua lingkaran berjari-jari $4$ dan $9$, dan pusatnya berjarak $5$. Bagaimana kedudukannya?'),
            options: [L('apart', 'saling lepas'), L('touching from outside', 'bersinggungan di luar'), L('touching from inside', 'bersinggungan di dalam'), L('crossing in two points', 'berpotongan di dua titik')],
            answer: 2,
            explain: L('$d=5=9-4=|r_1-r_2|$, so the smaller circle touches the larger one from inside.', '$d=5=9-4=|r_1-r_2|$, sehingga lingkaran yang lebih kecil menyentuh yang lebih besar dari dalam.'),
            hint: L('Compare $d$ with $r_1+r_2$ and with $|r_1-r_2|$.', 'Bandingkan $d$ dengan $r_1+r_2$ dan dengan $|r_1-r_2|$.'),
          },
        },
        {
          kind: 'activity',
          title: L('A fence', 'Sebuah pagar'),
          step: {
            kind: 'quiz',
            id: 'p11',
            prompt: L(
              'A round garden has a diameter of 28 m and is fenced all round, at 15 dollars per meter. Use $\\pi\\approx\\frac{22}{7}$. What does the fence cost?',
              'Sebuah taman bundar berdiameter 28 m dipagari mengelilinginya, dengan harga Rp60.000 per meter. Pakai $\\pi\\approx\\frac{22}{7}$. Berapa biaya pagarnya?',
            ),
            options: [L('1,320 dollars', 'Rp5.280.000'), L('660 dollars', 'Rp2.640.000'), L('9,240 dollars', 'Rp36.960.000'), L('2,640 dollars', 'Rp10.560.000')],
            answer: 0,
            explain: L(
              'The circumference is $\\frac{22}{7}\\cdot28=88$ m, so the fence costs $88\\cdot15=1320$ dollars.',
              'Kelilingnya $\\frac{22}{7}\\cdot28=88$ m, sehingga biaya pagarnya 88 kali Rp60.000, yaitu Rp5.280.000.',
            ),
            hint: L('A fence goes round the edge: use the circumference, not the area.', 'Pagar mengelilingi tepi: pakai keliling, bukan luas.'),
          },
        },
      ],
    },

    /* ---------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: circles at a glance', 'Ringkasan: lingkaran sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Definition:** all points at distance $r$ from the center $O$; diameter $d=2r$ is the longest chord; all circles are similar.
- **Measures:** $C=2\pi r=\pi d$, $A=\pi r^2$; $\pi$ is irrational and transcendental.
- **Arcs and sectors:** arc $=\frac{\theta}{360}\cdot2\pi r=r\theta$, sector $=\frac12r^2\theta$, segment $=\frac12r^2(\theta-\sin\theta)$; $180^\circ=\pi$ rad.
- **Angles:** inscribed $=\frac12$ central; $90^\circ$ in a semicircle; opposite angles of a cyclic quadrilateral sum to $180^\circ$; a tangent is perpendicular to the radius.
- **Lengths:** chord $=2\sqrt{r^2-d^2}$; tangent length $=\sqrt{OP^2-r^2}$; crossing chords $PA\cdot PB=PC\cdot PD$; $PT^2=PA\cdot PB$.
- **Equation:** $(x-h)^2+(y-k)^2=r^2$, or $x^2+y^2+Dx+Ey+F=0$ with $r^2=\frac{D^2+E^2}{4}-F$.
- **Position:** compare a distance with $r$ (point, line) or with $r_1\pm r_2$ (two circles).
- **Code:** keep $r^2$ and compare squared distances exactly; ´math.pi´ and radians only at the end.`,
            T`- **Definisi:** semua titik berjarak $r$ dari pusat $O$; diameter $d=2r$ adalah tali busur terpanjang; semua lingkaran sebangun.
- **Ukuran:** $K=2\pi r=\pi d$, $L=\pi r^2$; $\pi$ irasional dan transendental.
- **Busur dan juring:** busur $=\frac{\theta}{360}\cdot2\pi r=r\theta$, juring $=\frac12r^2\theta$, tembereng $=\frac12r^2(\theta-\sin\theta)$; $180^\circ=\pi$ rad.
- **Sudut:** sudut keliling $=\frac12$ sudut pusat; $90^\circ$ dalam setengah lingkaran; sudut berhadapan segiempat tali busur berjumlah $180^\circ$; garis singgung tegak lurus jari-jari.
- **Panjang:** tali busur $=2\sqrt{r^2-d^2}$; panjang garis singgung $=\sqrt{OP^2-r^2}$; tali busur berpotongan $PA\cdot PB=PC\cdot PD$; $PT^2=PA\cdot PB$.
- **Persamaan:** $(x-h)^2+(y-k)^2=r^2$, atau $x^2+y^2+Dx+Ey+F=0$ dengan $r^2=\frac{D^2+E^2}{4}-F$.
- **Kedudukan:** bandingkan jarak dengan $r$ (titik, garis) atau dengan $r_1\pm r_2$ (dua lingkaran).
- **Kode:** simpan $r^2$ dan bandingkan kuadrat jarak secara eksak; ´math.pi´ dan radian hanya di akhir.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Circle', 'Lingkaran'), definition: L('The set of all points in a plane that are the same distance from a fixed point called the center.', 'Himpunan semua titik pada bidang yang berjarak sama dari sebuah titik tetap yang disebut pusat.') },
    { term: L('Radius', 'Jari-jari'), definition: L('A segment from the center to a point on the circle, or its length, the distance that defines the circle.', 'Ruas garis dari pusat ke sebuah titik pada lingkaran, atau panjangnya, jarak yang mendefinisikan lingkaran.') },
    { term: L('Diameter', 'Diameter'), definition: L('A chord that passes through the center, with length twice the radius, the longest chord of the circle.', 'Tali busur yang melalui pusat, dengan panjang dua kali jari-jari, tali busur terpanjang pada lingkaran.') },
    { term: L('Chord', 'Tali busur'), definition: L('A segment that joins two points on a circle.', 'Ruas garis yang menghubungkan dua titik pada lingkaran.') },
    { term: L('Arc', 'Busur'), definition: L('The part of a circle between two of its points.', 'Bagian lingkaran di antara dua titiknya.') },
    { term: L('Sector', 'Juring'), definition: L('The region of a disk between two radii and the arc between their endpoints.', 'Daerah cakram di antara dua jari-jari dan busur di antara ujung-ujungnya.') },
    { term: L('Segment', 'Tembereng'), definition: L('The region of a disk between a chord and the arc it cuts off.', 'Daerah cakram di antara tali busur dan busur yang dipotongnya.') },
    { term: L('Tangent', 'Garis singgung'), definition: L('A line that touches a circle at exactly one point and is perpendicular to the radius there.', 'Garis yang menyentuh lingkaran di tepat satu titik dan tegak lurus jari-jari di titik itu.') },
    { term: L('Secant', 'Garis potong'), definition: L('A line that meets a circle in two points.', 'Garis yang memotong lingkaran di dua titik.') },
    { term: L('Circumference', 'Keliling lingkaran'), definition: L('The length of the circle itself, equal to pi times the diameter.', 'Panjang lingkaran itu sendiri, sama dengan pi kali diameter.') },
    { term: L('Pi', 'Pi'), definition: L('The ratio of the circumference of any circle to its diameter, about 3.14159, an irrational and transcendental number.', 'Perbandingan keliling lingkaran mana pun terhadap diameternya, sekitar 3,14159, bilangan irasional dan transendental.') },
    { term: L('Central angle', 'Sudut pusat'), definition: L('An angle whose vertex is the center of the circle, equal in degrees to the arc it cuts off.', 'Sudut yang titik sudutnya adalah pusat lingkaran, besarnya dalam derajat sama dengan busur yang dipotongnya.') },
    { term: L('Inscribed angle', 'Sudut keliling'), definition: L('An angle whose vertex is on the circle and whose sides are chords, equal to half the central angle on the same arc.', 'Sudut yang titik sudutnya pada lingkaran dan sisinya tali busur, sama dengan setengah sudut pusat pada busur yang sama.') },
    { term: L('Radian', 'Radian'), definition: L('The central angle whose arc is as long as the radius, so that 180 degrees equals pi radians.', 'Sudut pusat yang busurnya sepanjang jari-jari, sehingga 180 derajat sama dengan pi radian.') },
    { term: L('Cyclic quadrilateral', 'Segiempat tali busur'), definition: L('A quadrilateral whose four vertices lie on one circle, so that opposite angles add up to 180 degrees.', 'Segiempat yang keempat titik sudutnya terletak pada satu lingkaran, sehingga sudut berhadapan berjumlah 180 derajat.') },
  ],

  howTo: [
    {
      name: L('How to find the circumference and area of a circle', 'Cara mencari keliling dan luas lingkaran'),
      description: L('Get the radius first, then use two formulas with pi.', 'Cari jari-jarinya lebih dulu, lalu pakai dua rumus dengan pi.'),
      steps: [
        { name: L('Find the radius', 'Cari jari-jarinya'), text: L('If you know the diameter, halve it: a diameter of 14 gives a radius of 7.', 'Jika diameter diketahui, bagi dua: diameter 14 memberi jari-jari 7.') },
        { name: L('Circumference', 'Keliling'), text: L('Multiply the radius by 2 and by pi: for radius 7 the circumference is 14 pi, about 43.98.', 'Kalikan jari-jari dengan 2 dan dengan pi: untuk jari-jari 7 kelilingnya 14 pi, sekitar 43,98.') },
        { name: L('Area', 'Luas'), text: L('Square the radius and multiply by pi: for radius 7 the area is 49 pi, about 153.94.', 'Kuadratkan jari-jari dan kalikan dengan pi: untuk jari-jari 7 luasnya 49 pi, sekitar 153,94.') },
        { name: L('Round last', 'Bulatkan terakhir'), text: L('Keep pi as a symbol or use the full value until the end, and round only the final answer.', 'Biarkan pi sebagai simbol atau pakai nilai penuhnya sampai akhir, dan bulatkan hanya jawaban akhir.') },
      ],
    },
    {
      name: L('How to find an arc length and a sector area', 'Cara mencari panjang busur dan luas juring'),
      description: L('Take the fraction of the circle that the central angle cuts off.', 'Ambil bagian lingkaran yang dipotong oleh sudut pusat.'),
      steps: [
        { name: L('Write the fraction', 'Tulis pecahannya'), text: L('Divide the central angle by 360: 120 degrees gives one third.', 'Bagi sudut pusat dengan 360: 120 derajat memberi sepertiga.') },
        { name: L('Take that part of the circumference', 'Ambil bagian itu dari keliling'), text: L('Multiply the fraction by 2 pi r: one third of 12 pi is the arc 4 pi for radius 6.', 'Kalikan pecahan itu dengan 2 pi r: sepertiga dari 12 pi adalah busur 4 pi untuk jari-jari 6.') },
        { name: L('Take that part of the area', 'Ambil bagian itu dari luas'), text: L('Multiply the fraction by pi r squared: one third of 36 pi is the sector 12 pi.', 'Kalikan pecahan itu dengan pi r kuadrat: sepertiga dari 36 pi adalah juring 12 pi.') },
      ],
    },
    {
      name: L('How to find the center and radius from the general form', 'Cara mencari pusat dan jari-jari dari bentuk umum'),
      description: L('Complete the square in x and in y.', 'Lengkapkan kuadrat pada x dan pada y.'),
      steps: [
        { name: L('Group the terms', 'Kelompokkan sukunya'), text: L('Write the x terms together, the y terms together and move the constant to the right.', 'Tulis suku x bersama, suku y bersama, dan pindahkan konstanta ke ruas kanan.') },
        { name: L('Complete both squares', 'Lengkapkan kedua kuadrat'), text: L('Add the square of half the coefficient to both sides for x and for y.', 'Tambahkan kuadrat setengah koefisien ke kedua ruas untuk x dan untuk y.') },
        { name: L('Read the center', 'Baca pusatnya'), text: L('In the form x minus h squared plus y minus k squared, the center is h, k.', 'Pada bentuk x dikurang h kuadrat ditambah y dikurang k kuadrat, pusatnya h, k.') },
        { name: L('Read the radius', 'Baca jari-jarinya'), text: L('The right side is the radius squared, so take its square root; it must be positive.', 'Ruas kanan adalah kuadrat jari-jari, jadi tarik akar kuadratnya; ia harus positif.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is a circle?', 'Apa itu lingkaran?'),
      a: L(
        'A circle is the set of all points in a plane that are the same distance, the radius, from a fixed point, the center. The curve together with its inside is called a disk, and its area is pi times the radius squared.',
        'Lingkaran adalah himpunan semua titik pada bidang yang berjarak sama, yaitu jari-jari, dari sebuah titik tetap, yaitu pusat. Kurva beserta bagian dalamnya disebut cakram, dan luasnya pi kali jari-jari kuadrat.',
      ),
    },
    {
      q: L('What is pi?', 'Apa itu pi?'),
      a: L(
        'Pi is the ratio of the circumference of any circle to its diameter, about 3.14159. It is the same for every circle because all circles are similar. It is irrational and transcendental, so it is not exactly 22 over 7 or 3.14.',
        'Pi adalah perbandingan keliling lingkaran mana pun terhadap diameternya, sekitar 3,14159. Nilainya sama untuk setiap lingkaran karena semua lingkaran sebangun. Ia irasional dan transendental, sehingga tidak tepat 22 per 7 atau 3,14.',
      ),
    },
    {
      q: L('What are the formulas for the circumference and area of a circle?', 'Apa rumus keliling dan luas lingkaran?'),
      a: L(
        'The circumference is 2 pi times the radius, which is pi times the diameter. The area is pi times the radius squared. For a radius of 7 the circumference is 14 pi, about 43.98, and the area is 49 pi, about 153.94.',
        'Keliling adalah 2 pi kali jari-jari, yaitu pi kali diameter. Luasnya pi kali jari-jari kuadrat. Untuk jari-jari 7 kelilingnya 14 pi, sekitar 43,98, dan luasnya 49 pi, sekitar 153,94.',
      ),
    },
    {
      q: L('How do you find the length of an arc?', 'Bagaimana mencari panjang busur?'),
      a: L(
        'Multiply the circumference by the fraction of the circle, the central angle in degrees divided by 360. In radians the arc is simply the radius times the angle. For radius 6 and 120 degrees the arc is one third of 12 pi, which is 4 pi.',
        'Kalikan keliling dengan bagian lingkaran, yaitu sudut pusat dalam derajat dibagi 360. Dalam radian busur cukup jari-jari kali sudut. Untuk jari-jari 6 dan 120 derajat busurnya sepertiga dari 12 pi, yaitu 4 pi.',
      ),
    },
    {
      q: L('How do you find the area of a sector and a segment?', 'Bagaimana mencari luas juring dan tembereng?'),
      a: L(
        'A sector is the same fraction of the disk as its angle is of 360 degrees, so its area is that fraction times pi r squared. A segment is the sector minus the triangle formed by the two radii and the chord.',
        'Juring adalah bagian cakram yang sama dengan besar sudutnya terhadap 360 derajat, sehingga luasnya bagian itu kali pi r kuadrat. Tembereng adalah juring dikurangi segitiga yang dibentuk kedua jari-jari dan tali busur.',
      ),
    },
    {
      q: L('What is a radian?', 'Apa itu radian?'),
      a: L(
        'A radian is the central angle whose arc is as long as the radius. A full turn is 2 pi radians, so 180 degrees equals pi radians and one radian is about 57.3 degrees. In radians the arc length is just radius times angle.',
        'Radian adalah sudut pusat yang busurnya sepanjang jari-jari. Satu putaran penuh adalah 2 pi radian, sehingga 180 derajat sama dengan pi radian dan satu radian sekitar 57,3 derajat. Dalam radian panjang busur cukup jari-jari kali sudut.',
      ),
    },
    {
      q: L('What is the inscribed angle theorem?', 'Apa itu teorema sudut keliling?'),
      a: L(
        'An inscribed angle, with its vertex on the circle, is half the central angle on the same arc. So all inscribed angles on one arc are equal, an angle in a semicircle is 90 degrees, and opposite angles of a cyclic quadrilateral add up to 180 degrees.',
        'Sudut keliling, dengan titik sudut pada lingkaran, adalah setengah sudut pusat pada busur yang sama. Jadi semua sudut keliling pada satu busur sama besar, sudut dalam setengah lingkaran adalah 90 derajat, dan sudut berhadapan segiempat tali busur berjumlah 180 derajat.',
      ),
    },
    {
      q: L('What is Thales\' theorem?', 'Apa itu teorema Thales?'),
      a: L(
        'If one side of a triangle is a diameter of its circumscribed circle, the angle opposite that side is a right angle. Equivalently, every angle inscribed in a semicircle is 90 degrees, and the circumcenter of a right triangle is the midpoint of its hypotenuse.',
        'Jika satu sisi segitiga adalah diameter lingkaran luarnya, sudut di depan sisi itu adalah sudut siku-siku. Dengan kata lain, setiap sudut keliling dalam setengah lingkaran adalah 90 derajat, dan pusat lingkaran luar segitiga siku-siku adalah titik tengah hipotenusanya.',
      ),
    },
    {
      q: L('What is a tangent to a circle?', 'Apa itu garis singgung lingkaran?'),
      a: L(
        'A tangent is a line that touches the circle at exactly one point and is perpendicular to the radius at that point. The two tangent segments from a point outside the circle have equal length, the square root of the squared distance to the center minus the squared radius.',
        'Garis singgung adalah garis yang menyentuh lingkaran di tepat satu titik dan tegak lurus jari-jari di titik itu. Kedua ruas garis singgung dari titik di luar lingkaran sama panjang, yaitu akar dari kuadrat jarak ke pusat dikurangi kuadrat jari-jari.',
      ),
    },
    {
      q: L('What is the equation of a circle?', 'Apa persamaan lingkaran?'),
      a: L(
        'A circle with center h, k and radius r has the equation x minus h squared plus y minus k squared equals r squared. Expanded it becomes x squared plus y squared plus Dx plus Ey plus F equals 0, and completing the square returns the center and radius.',
        'Lingkaran berpusat h, k dan berjari-jari r memiliki persamaan x dikurang h kuadrat ditambah y dikurang k kuadrat sama dengan r kuadrat. Dijabarkan, ia menjadi x kuadrat ditambah y kuadrat ditambah Dx ditambah Ey ditambah F sama dengan 0, dan melengkapkan kuadrat mengembalikan pusat dan jari-jari.',
      ),
    },
    {
      q: L('How do you find the circle through three points?', 'Bagaimana mencari lingkaran melalui tiga titik?'),
      a: L(
        'Three points that are not on one line lie on exactly one circle, the circumcircle of their triangle. Its center is where the perpendicular bisectors of the sides meet, and the radius is the distance from the center to any of the points.',
        'Tiga titik yang tidak segaris terletak pada tepat satu lingkaran, lingkaran luar segitiganya. Pusatnya adalah tempat sumbu-sumbu sisi bertemu, dan jari-jarinya adalah jarak dari pusat ke salah satu titik itu.',
      ),
    },
    {
      q: L('How do you tell whether a line is a tangent or a secant?', 'Bagaimana mengetahui garis singgung atau garis potong?'),
      a: L(
        'Find the distance from the center to the line and compare it with the radius. If the distance is larger the line misses the circle, if it is equal the line is a tangent, and if it is smaller the line is a secant that cuts the circle twice.',
        'Cari jarak dari pusat ke garis dan bandingkan dengan jari-jari. Jika jaraknya lebih besar garis tidak memotong lingkaran, jika sama garis adalah garis singgung, dan jika lebih kecil garis adalah garis potong yang memotong lingkaran dua kali.',
      ),
    },
    {
      q: L('How do you check whether a point is inside a circle in code?', 'Bagaimana memeriksa titik di dalam lingkaran dalam kode?'),
      a: L(
        'Compute the squared distance from the point to the center and compare it with the squared radius, with no square root. Smaller means inside, equal means on the circle and larger means outside. Use integers or fractions, because float equality is unreliable.',
        'Hitung kuadrat jarak dari titik ke pusat dan bandingkan dengan kuadrat jari-jari, tanpa akar. Lebih kecil berarti di dalam, sama berarti pada lingkaran, dan lebih besar berarti di luar. Pakai bilangan bulat atau pecahan, karena kesamaan float tidak dapat diandalkan.',
      ),
    },
  ],

  references: [
    { title: 'The Thirteen Books of Euclid\'s Elements (2nd ed.), Book III (circles) and Book XII, proposition 2', author: 'Thomas L. Heath (translator)', year: 1908, source: 'Cambridge University Press' },
    { title: 'The Works of Archimedes, Measurement of a Circle', author: 'Thomas L. Heath (translator)', year: 1897, source: 'Cambridge University Press' },
    { title: 'A History of Pi', author: 'Petr Beckmann', year: 1971, source: 'St. Martin\'s Press' },
    { title: 'Introduction to Geometry (2nd ed.), chapter 2 (circles and angles)', author: 'H. S. M. Coxeter', year: 1969, source: 'Wiley' },
    { title: 'Geometry Revisited, chapter 2 (the circle)', author: 'H. S. M. Coxeter and Samuel L. Greitzer', year: 1967, source: 'Mathematical Association of America' },
    { title: 'The Python Standard Library: math, mathematical functions', author: 'Python Software Foundation', source: 'docs.python.org', url: 'https://docs.python.org/3/library/math.html' },
  ],

  related: ['triangles', 'quadrilaterals', 'irrational-numbers', 'algebraic-expressions'],
}
