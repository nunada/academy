import type { FigItem } from '../../lib/figure'
import type { Loc } from '../types'
import type { ArticleBlock, ArticleBody } from './types'
import { meta } from './triangles.meta'

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

/** A triangle ABC drawn to scale on a plain canvas; `extra` adds construction lines and `also` widens the frame. */
const tri = (pts: [number, number][], caption: Loc, opts: { extra?: FigItem[]; also?: [number, number][] } = {}): ArticleBlock => {
  const all = [...pts, ...(opts.also ?? [])]
  const xs = all.map((p) => p[0])
  const ys = all.map((p) => p[1])
  const pad = 1.2
  const xSpan: [number, number] = [Math.min(...xs) - pad, Math.max(...xs) + pad]
  const ySpan: [number, number] = [Math.min(...ys) - pad, Math.max(...ys) + pad]
  const aspect = Math.min(3, Math.max(0.5, (xSpan[1] - xSpan[0]) / (ySpan[1] - ySpan[0])))
  const items: FigItem[] = [{ t: 'poly', pts, color: 'a' }, ...(opts.extra ?? [])]
  pts.forEach((p, i) => items.push({ t: 'point', at: p, label: 'ABC'[i], color: 'b' }))
  return { kind: 'figure', figure: { dim: 2, axes: false, xSpan, ySpan, aspect, items, caption } }
}

export const body: ArticleBody = {
  answer: L(
    T`**A triangle is a closed shape with three straight sides, three vertices and three interior angles that always add up to 180°.** Triangles are sorted by their sides (equilateral, isosceles, scalene) and by their angles (acute, right, obtuse). Three lengths form a triangle only if the longest is shorter than the other two together. The area is half the base times the height, and in a right triangle $a^2+b^2=c^2$.`,
    T`**Segitiga adalah bangun tertutup dengan tiga sisi lurus, tiga titik sudut, dan tiga sudut dalam yang selalu berjumlah 180°.** Segitiga digolongkan menurut sisinya (sama sisi, sama kaki, sembarang) dan menurut sudutnya (lancip, siku-siku, tumpul). Tiga panjang membentuk segitiga hanya bila yang terpanjang lebih pendek daripada jumlah dua lainnya. Luasnya setengah alas kali tinggi, dan pada segitiga siku-siku $a^2+b^2=c^2$.`,
  ),

  keyPoints: [
    L(
      T`The interior angles of every triangle add up to $180^\circ$, so a triangle has at most one right or obtuse angle, and an exterior angle equals the sum of the two interior angles not next to it.`,
      T`Sudut dalam setiap segitiga berjumlah $180^\circ$, sehingga segitiga paling banyak punya satu sudut siku-siku atau tumpul, dan sudut luar sama dengan jumlah dua sudut dalam yang tidak bersebelahan dengannya.`,
    ),
    L(
      T`Three lengths make a triangle only if each is shorter than the sum of the other two; the longest side then decides the type: $c^2<a^2+b^2$ acute, $=$ right, $>$ obtuse.`,
      T`Tiga panjang membentuk segitiga hanya bila masing-masing lebih pendek daripada jumlah dua lainnya; sisi terpanjang lalu menentukan jenisnya: $c^2<a^2+b^2$ lancip, $=$ siku-siku, $>$ tumpul.`,
    ),
    L(
      T`Pythagorean theorem: in a right triangle $a^2+b^2=c^2$, and the converse holds; Euclid's formula $(m^2-n^2,\;2mn,\;m^2+n^2)$ produces whole-number triples such as $3,4,5$.`,
      T`Teorema Pythagoras: pada segitiga siku-siku $a^2+b^2=c^2$, dan kebalikannya berlaku; rumus Euclid $(m^2-n^2,\;2mn,\;m^2+n^2)$ menghasilkan tripel bilangan bulat seperti $3,4,5$.`,
    ),
    L(
      T`Area is $\frac12bh$; with three sides use Heron's formula $\sqrt{s(s-a)(s-b)(s-c)}$, with two sides and the angle between them $\frac12ab\sin C$, and with coordinates the shoelace formula.`,
      T`Luas adalah $\frac12bh$; dengan tiga sisi pakai rumus Heron $\sqrt{s(s-a)(s-b)(s-c)}$, dengan dua sisi dan sudut apitnya $\frac12ab\sin C$, dan dengan koordinat rumus tali sepatu.`,
    ),
    L(
      T`The four centers are the centroid (medians, 2:1), circumcenter (perpendicular bisectors), orthocenter (altitudes) and incenter (angle bisectors); the first three lie on the Euler line.`,
      T`Empat titik pentingnya adalah titik berat (garis berat, 2:1), pusat lingkaran luar (sumbu sisi), titik tinggi (garis tinggi), dan pusat lingkaran dalam (garis bagi); tiga yang pertama terletak pada garis Euler.`,
    ),
    L(
      T`Triangles are congruent by SSS, SAS, ASA, AAS or RHS and similar by AA; to solve a triangle use the law of cosines and the law of sines, and beware the two-triangle SSA case.`,
      T`Segitiga kongruen menurut SSS, SAS, ASA, AAS, atau RHS dan sebangun menurut AA; untuk memecahkan segitiga pakai aturan kosinus dan aturan sinus, dan waspadai kasus SSA yang menghasilkan dua segitiga.`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------------ what is it */
    {
      id: 'what-is-a-triangle',
      heading: L('What is a triangle?', 'Apa itu segitiga?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A triangle is a polygon with exactly three sides, three vertices (corners) and three interior angles.** It is the simplest polygon, and every other polygon can be cut into triangles: a diagonal splits a [quadrilateral](article:quadrilaterals#what-is-a-quadrilateral) into two. The Indonesian word is *segitiga*, "three-corner".

We name a triangle by its vertices, $ABC$. The side opposite the vertex $A$ is written $a$ (it is $BC$), the side opposite $B$ is $b$ (it is $CA$) and the side opposite $C$ is $c$ (it is $AB$). The interior angles are $\angle A$, $\angle B$, $\angle C$.

Any side can serve as the **base**. The **height** (or *altitude*) belonging to that base is the perpendicular distance from the opposite vertex to the line that holds the base. In an obtuse triangle this height falls outside the triangle, on the extension of the base.

A triangle is rigid: its three side lengths fix its shape completely, so it cannot be pushed out of shape without breaking a side. A four-sided frame can lean into a parallelogram, a triangle cannot, which is why bridges, roof trusses, bicycle frames and camera tripods are built from triangles.`,
            T`**Segitiga adalah poligon dengan tepat tiga sisi, tiga titik sudut, dan tiga sudut dalam.** Ia poligon paling sederhana, dan setiap poligon lain dapat dipotong menjadi segitiga: satu diagonal membagi [segiempat](article:quadrilaterals#what-is-a-quadrilateral) menjadi dua.

Segitiga diberi nama dari titik sudutnya, $ABC$. Sisi di depan titik $A$ ditulis $a$ (yaitu $BC$), sisi di depan $B$ ditulis $b$ (yaitu $CA$), dan sisi di depan $C$ ditulis $c$ (yaitu $AB$). Sudut dalamnya $\angle A$, $\angle B$, $\angle C$.

Sisi mana pun dapat menjadi **alas**. **Tinggi** yang bersesuaian dengan alas itu adalah jarak tegak lurus dari titik sudut di depannya ke garis yang memuat alas. Pada segitiga tumpul tinggi ini jatuh di luar segitiga, pada perpanjangan alas.

Segitiga bersifat kaku: ketiga panjang sisinya menentukan bentuknya sepenuhnya, sehingga ia tidak dapat didorong berubah bentuk tanpa mematahkan sisinya. Rangka bersisi empat dapat miring menjadi jajargenjang, segitiga tidak, itulah sebabnya jembatan, rangka atap, rangka sepeda, dan tripod kamera dibangun dari segitiga.`,
          ),
        },
        tri(
          [[0, 0], [8, 0], [3, 5]],
          L(
            'A triangle ABC. The dashed line is the height from C to the base AB, perpendicular to it.',
            'Segitiga ABC. Garis putus-putus adalah tinggi dari C ke alas AB, tegak lurus terhadapnya.',
          ),
          { extra: [{ t: 'seg', from: [3, 5], to: [3, 0], color: 'c', dashed: true, label: 'h' }] },
        ),
      ],
    },

    /* ------------------------------------------------------------ angle sum */
    {
      id: 'angle-sum',
      heading: L('Why do the angles of a triangle add up to 180°?', 'Mengapa sudut-sudut segitiga berjumlah 180°?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The three interior angles of every triangle add up to $180^\circ$, because a line through one vertex parallel to the opposite side makes the three angles fit together along a straight line.**

Draw the line through $C$ parallel to $AB$. The two angles it makes with $CA$ and $CB$ are *alternate angles* with $\angle A$ and $\angle B$, so they are equal to them. Now $\angle A$, $\angle C$ and $\angle B$ sit side by side on the straight line through $C$, and a straight angle is $180^\circ$:

$$\angle A+\angle B+\angle C=180^\circ.$$

Three consequences follow at once:

- A triangle has at most one right angle or obtuse angle, since two of them would already use $180^\circ$ or more.
- Knowing two angles gives the third: $50^\circ$ and $60^\circ$ leave $70^\circ$.
- The **exterior angle** at $C$, formed by extending $AC$ past $C$ (or $BC$), equals $\angle A+\angle B$, the sum of the two interior angles not next to it, because both it and $\angle C$ are what is left of $180^\circ$. With $\angle A=50^\circ$ and $\angle B=60^\circ$ the exterior angle at $C$ is $110^\circ$.

This is also where the $360^\circ$ of a [quadrilateral](article:quadrilaterals#angle-sum) comes from: two triangles. If three angles are in the ratio $1:2:3$, call them $x,2x,3x$ as in [turning words into algebra](article:algebraic-expressions#words-to-algebra): $6x=180$, so $x=30^\circ$ and the angles are $30^\circ,60^\circ,90^\circ$, a right triangle.`,
            T`**Ketiga sudut dalam setiap segitiga berjumlah $180^\circ$, karena garis melalui satu titik sudut yang sejajar sisi di depannya membuat ketiga sudut itu tersusun sepanjang garis lurus.**

Gambar garis melalui $C$ yang sejajar $AB$. Kedua sudut yang dibentuknya dengan $CA$ dan $CB$ adalah *sudut dalam berseberangan* dengan $\angle A$ dan $\angle B$, sehingga sama besar dengan keduanya. Kini $\angle A$, $\angle C$, dan $\angle B$ berdampingan pada garis lurus melalui $C$, dan sudut lurus besarnya $180^\circ$:

$$\angle A+\angle B+\angle C=180^\circ.$$

Tiga akibat langsung mengikuti:

- Segitiga paling banyak memiliki satu sudut siku-siku atau tumpul, sebab dua sudut seperti itu sudah memakai $180^\circ$ atau lebih.
- Mengetahui dua sudut memberi sudut ketiga: $50^\circ$ dan $60^\circ$ menyisakan $70^\circ$.
- **Sudut luar** di $C$, yang dibentuk dengan memperpanjang $AC$ melewati $C$ (atau $BC$), sama dengan $\angle A+\angle B$, jumlah dua sudut dalam yang tidak bersebelahan dengannya, karena ia dan $\angle C$ sama-sama sisa dari $180^\circ$. Dengan $\angle A=50^\circ$ dan $\angle B=60^\circ$ sudut luar di $C$ adalah $110^\circ$.

Dari sinilah $360^\circ$ pada [segiempat](article:quadrilaterals#angle-sum) berasal: dua segitiga. Jika tiga sudut berperbandingan $1:2:3$, namai $x,2x,3x$ seperti pada [mengubah kata menjadi aljabar](article:algebraic-expressions#words-to-algebra): $6x=180$, sehingga $x=30^\circ$ dan sudutnya $30^\circ,60^\circ,90^\circ$, sebuah segitiga siku-siku.`,
          ),
        },
        tri(
          [[0, 0], [8, 0], [3, 5]],
          L(
            'The dashed line through C is parallel to AB. The angles it makes with CA and CB equal the angles at A and B, so the three angles at C add up to a straight angle.',
            'Garis putus-putus melalui C sejajar AB. Sudut yang dibentuknya dengan CA dan CB sama dengan sudut di A dan B, sehingga ketiga sudut di C berjumlah sudut lurus.',
          ),
          { extra: [{ t: 'seg', from: [-3, 5], to: [11, 5], color: 'c', dashed: true }], also: [[-3, 5], [11, 5]] },
        ),
        {
          kind: 'activity',
          title: L('Try it: the third angle', 'Coba: sudut ketiga'),
          step: {
            kind: 'math',
            id: 'a1',
            hints: [L('The three angles add up to $180^\\circ$.', 'Ketiga sudut berjumlah $180^\\circ$.'), L('$48+75=123$.', '$48+75=123$.')],
            explain: L('$180-123=57$.', '$180-123=57$.'),
            prompt: L('A triangle has angles $48^\\circ$ and $75^\\circ$. How many degrees is the third angle?', 'Sebuah segitiga memiliki sudut $48^\\circ$ dan $75^\\circ$. Berapa derajat sudut ketiganya?'),
            given: String.raw`180-(48+75)=v`,
            blanks: [{ label: 'v =', answer: 57 }],
          },
        },
      ],
    },

    /* ----------------------------------------------------------------- types */
    {
      id: 'types',
      heading: L('What are the types of triangles?', 'Apa saja jenis-jenis segitiga?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Triangles are sorted in two independent ways: by their sides (equilateral, isosceles, scalene) and by their largest angle (acute, right, obtuse), so every triangle has one name from each list.**

| By sides | Definition | Example sides |
|---|---|---|
| Equilateral | all three sides equal; then all angles are $60^\circ$ | $5,5,5$ |
| Isosceles | exactly two sides equal; the angles opposite them are equal | $5,5,6$ |
| Scalene | all three sides different | $4,5,6$ |

| By angles | Definition | Example sides |
|---|---|---|
| Acute | all three angles less than $90^\circ$ | $5,5,6$ |
| Right | one angle equal to $90^\circ$ | $3,4,5$ |
| Obtuse | one angle greater than $90^\circ$ | $2,3,4$ |

Two rules link sides and angles. **Equal sides lie opposite equal angles**, and a longer side lies opposite a larger angle. So the longest side of a triangle is opposite its largest angle, and in a right triangle that side, the **hypotenuse**, is opposite the right angle.

Not every pair of names can occur together. An equilateral triangle is always acute. An isosceles triangle can be acute ($5,5,6$), right ($1,1,\sqrt2$, the half of a square cut along its diagonal) or obtuse ($5,5,8$). A scalene triangle can be acute ($4,5,6$), right ($3,4,5$) or obtuse ($2,3,4$).

To find the angle type without any angle, look at the longest side $c$ and compare $c^2$ with $a^2+b^2$: if $c^2<a^2+b^2$ the triangle is acute, if $c^2=a^2+b^2$ it is right, and if $c^2>a^2+b^2$ it is obtuse. For $2,3,4$: $16>4+9=13$, so it is obtuse. This is the Pythagorean theorem and its two extensions, and the next sections use it.`,
            T`**Segitiga digolongkan dengan dua cara yang saling bebas: menurut sisinya (sama sisi, sama kaki, sembarang) dan menurut sudut terbesarnya (lancip, siku-siku, tumpul), sehingga setiap segitiga memiliki satu nama dari tiap daftar.**

| Menurut sisi | Definisi | Contoh sisi |
|---|---|---|
| Sama sisi | ketiga sisi sama panjang; maka semua sudutnya $60^\circ$ | $5,5,5$ |
| Sama kaki | tepat dua sisi sama panjang; sudut di depannya sama besar | $5,5,6$ |
| Sembarang | ketiga sisi berbeda | $4,5,6$ |

| Menurut sudut | Definisi | Contoh sisi |
|---|---|---|
| Lancip | ketiga sudut kurang dari $90^\circ$ | $5,5,6$ |
| Siku-siku | satu sudut sama dengan $90^\circ$ | $3,4,5$ |
| Tumpul | satu sudut lebih dari $90^\circ$ | $2,3,4$ |

Dua aturan menghubungkan sisi dan sudut. **Sisi yang sama panjang berada di depan sudut yang sama besar**, dan sisi yang lebih panjang berada di depan sudut yang lebih besar. Jadi sisi terpanjang segitiga berada di depan sudut terbesarnya, dan pada segitiga siku-siku sisi itu, yaitu **hipotenusa** (sisi miring), berada di depan sudut siku-siku.

Tidak setiap pasangan nama dapat muncul bersama. Segitiga sama sisi selalu lancip. Segitiga sama kaki dapat lancip ($5,5,6$), siku-siku ($1,1,\sqrt2$, separuh persegi yang dipotong sepanjang diagonalnya), atau tumpul ($5,5,8$). Segitiga sembarang dapat lancip ($4,5,6$), siku-siku ($3,4,5$), atau tumpul ($2,3,4$).

Untuk menentukan jenis sudut tanpa mengukur sudut, lihat sisi terpanjang $c$ dan bandingkan $c^2$ dengan $a^2+b^2$: jika $c^2<a^2+b^2$ segitiganya lancip, jika $c^2=a^2+b^2$ siku-siku, dan jika $c^2>a^2+b^2$ tumpul. Untuk $2,3,4$: $16>4+9=13$, sehingga tumpul. Inilah teorema Pythagoras dan dua perluasannya, dan bagian-bagian berikutnya memakainya.`,
          ),
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: L('"Isosceles" depends on the book', '"Sama kaki" bergantung pada bukunya'),
          text: L(
            T`**This article follows the school definition: an isosceles triangle has exactly two equal sides, so an equilateral triangle is not isosceles.** Many university texts say *at least* two equal sides, which makes every equilateral triangle isosceles as well. Both are consistent as long as you say which one you use.`,
            T`**Artikel ini mengikuti definisi sekolah: segitiga sama kaki memiliki tepat dua sisi sama panjang, sehingga segitiga sama sisi bukan sama kaki.** Banyak buku perguruan tinggi menulis *paling sedikit* dua sisi sama panjang, yang membuat setiap segitiga sama sisi juga sama kaki. Keduanya konsisten asalkan kamu menyebut yang kamu pakai.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------- triangle inequality */
    {
      id: 'triangle-inequality',
      heading: L('Can any three lengths form a triangle?', 'Dapatkah tiga panjang sembarang membentuk segitiga?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**No: three lengths form a triangle only if each is shorter than the sum of the other two, which is the same as saying that the longest is shorter than the other two together.** This is the *triangle inequality*, and it says that a straight path is shorter than a detour: going from $A$ to $B$ directly is shorter than going through $C$, so $c<a+b$.

Check $3,4,5$: $5<3+4$, so it is a triangle. Check $1,2,3$: $3=1+2$, so the short sides lie flat along the long one and the triangle is *degenerate*, a segment. Check $1,2,4$: $4>1+2$, the short sides cannot even reach each other.

The inequality also tells you how long the third side can be. If two sides are $a$ and $b$, the third side $c$ satisfies $|a-b|<c<a+b$. With sides $5$ and $8$ the third side lies strictly between $3$ and $13$, so a whole number can be $4,5,\ldots,12$, which is nine values.

Type three lengths below. The tool uses exact fractions: it tells you whether they form a triangle, whether it is acute, right or obtuse by comparing squares, and gives the area by Heron's formula (more on that soon), the radii of the two circles and the angles.`,
            T`**Tidak: tiga panjang membentuk segitiga hanya bila masing-masing lebih pendek daripada jumlah dua lainnya, yang sama artinya dengan sisi terpanjang lebih pendek daripada jumlah dua sisi lainnya.** Inilah *ketaksamaan segitiga*, dan ia mengatakan bahwa jalan lurus lebih pendek daripada jalan memutar: pergi dari $A$ ke $B$ langsung lebih pendek daripada lewat $C$, sehingga $c<a+b$.

Periksa $3,4,5$: $5<3+4$, jadi itu segitiga. Periksa $1,2,3$: $3=1+2$, sehingga kedua sisi pendek terbaring rata sepanjang sisi panjang dan segitiganya *merosot*, menjadi ruas garis. Periksa $1,2,4$: $4>1+2$, kedua sisi pendek bahkan tidak dapat saling bertemu.

Ketaksamaan itu juga memberi tahu seberapa panjang sisi ketiga. Jika dua sisi adalah $a$ dan $b$, sisi ketiga $c$ memenuhi $|a-b|<c<a+b$. Dengan sisi $5$ dan $8$ sisi ketiga berada tepat di antara $3$ dan $13$, sehingga bilangan bulatnya dapat $4,5,\ldots,12$, yaitu sembilan nilai.

Ketik tiga panjang di bawah. Alat ini memakai pecahan eksak: ia menunjukkan apakah ketiganya membentuk segitiga, apakah lancip, siku-siku, atau tumpul dengan membandingkan kuadrat, dan memberi luas dengan rumus Heron (dibahas sebentar lagi), jari-jari kedua lingkaran, dan sudut-sudutnya.`,
          ),
        },
        { kind: 'widget', name: 'tricheck' },
      ],
    },

    /* ------------------------------------------------------------- pythagoras */
    {
      id: 'pythagorean',
      heading: L('What is the Pythagorean theorem?', 'Apa itu teorema Pythagoras?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**In a right triangle with legs $a$ and $b$ and hypotenuse $c$, the squares satisfy $a^2+b^2=c^2$; the converse also holds, so a triangle is right-angled exactly when its sides satisfy this equation.** The legs are the two sides next to the right angle; the hypotenuse is the longest side, opposite it.

**A proof by rearranging.** Take four copies of the right triangle, each with area $\frac12ab$, and put them in the corners of a big square of side $a+b$. In the middle a tilted square of side $c$ is left. The big square has area $(a+b)^2=a^2+2ab+b^2$, and it is also the tilted square plus the four triangles, $c^2+4\cdot\frac12ab=c^2+2ab$. Take $2ab$ from both sides: $a^2+b^2=c^2$.

**Using it.** A ladder $2.5$ m long that stands $1.5$ m from a wall reaches $\sqrt{2.5^2-1.5^2}=\sqrt{4}=2$ m up the wall. The diagonal of a rectangle $6\times4$ is $\sqrt{52}=2\sqrt{13}$ after you [simplify the radical](article:exponents-and-radicals#simplify-radicals), and the diagonal of a unit square is $\sqrt2$, which is [irrational](article:irrational-numbers#why-sqrt2-is-irrational).

**Pythagorean triples.** Three whole numbers with $a^2+b^2=c^2$ are a *Pythagorean triple*. Euclid's formula produces them: for whole numbers $m>n>0$,
$$(a,b,c)=(m^2-n^2,\;2mn,\;m^2+n^2).$$
The triple is *primitive* (no common factor, see the [GCD](article:integers#gcd-lcm)) when $m,n$ are coprime and one of them is even. Every triple is a multiple of a primitive one, and every primitive one comes from this formula.

| $m$ | $n$ | Triple |
|---|---|---|
| $2$ | $1$ | $3,4,5$ |
| $3$ | $2$ | $5,12,13$ |
| $4$ | $1$ | $8,15,17$ |
| $4$ | $3$ | $7,24,25$ |
| $5$ | $2$ | $20,21,29$ |
| $5$ | $4$ | $9,40,41$ |

**Two special right triangles** are worth knowing by heart. The $45^\circ$–$45^\circ$–$90^\circ$ triangle (half a square) has sides in the ratio $1:1:\sqrt2$. The $30^\circ$–$60^\circ$–$90^\circ$ triangle (half an equilateral triangle) has sides in the ratio $1:\sqrt3:2$, the short leg being half the hypotenuse.`,
            T`**Pada segitiga siku-siku dengan sisi tegak $a$ dan $b$ dan hipotenusa $c$, kuadrat-kuadratnya memenuhi $a^2+b^2=c^2$; kebalikannya juga berlaku, sehingga segitiga siku-siku tepat bila sisi-sisinya memenuhi persamaan ini.** Sisi tegak adalah dua sisi di samping sudut siku-siku; hipotenusa adalah sisi terpanjang, di depannya.

**Bukti dengan menata ulang.** Ambil empat salinan segitiga siku-siku, masing-masing berluas $\frac12ab$, dan letakkan di sudut-sudut persegi besar bersisi $a+b$. Di tengah tersisa persegi miring bersisi $c$. Persegi besar berluas $(a+b)^2=a^2+2ab+b^2$, dan ia juga persegi miring ditambah keempat segitiga, $c^2+4\cdot\frac12ab=c^2+2ab$. Kurangkan $2ab$ dari kedua ruas: $a^2+b^2=c^2$.

**Memakainya.** Tangga sepanjang $2{,}5$ m yang berdiri $1{,}5$ m dari tembok mencapai ketinggian $\sqrt{2{,}5^2-1{,}5^2}=\sqrt{4}=2$ m pada tembok. Diagonal persegi panjang $6\times4$ adalah $\sqrt{52}=2\sqrt{13}$ setelah kamu [menyederhanakan bentuk akar](article:exponents-and-radicals#simplify-radicals), dan diagonal persegi satuan adalah $\sqrt2$, yang [irasional](article:irrational-numbers#why-sqrt2-is-irrational).

**Tripel Pythagoras.** Tiga bilangan bulat dengan $a^2+b^2=c^2$ disebut *tripel Pythagoras*. Rumus Euclid menghasilkannya: untuk bilangan bulat $m>n>0$,
$$(a,b,c)=(m^2-n^2,\;2mn,\;m^2+n^2).$$
Tripelnya *primitif* (tanpa faktor persekutuan, lihat [FPB](article:integers#gcd-lcm)) bila $m,n$ saling prima dan salah satunya genap. Setiap tripel adalah kelipatan tripel primitif, dan setiap tripel primitif berasal dari rumus ini.

| $m$ | $n$ | Tripel |
|---|---|---|
| $2$ | $1$ | $3,4,5$ |
| $3$ | $2$ | $5,12,13$ |
| $4$ | $1$ | $8,15,17$ |
| $4$ | $3$ | $7,24,25$ |
| $5$ | $2$ | $20,21,29$ |
| $5$ | $4$ | $9,40,41$ |

**Dua segitiga siku-siku istimewa** layak dihafal. Segitiga $45^\circ$–$45^\circ$–$90^\circ$ (setengah persegi) memiliki sisi berperbandingan $1:1:\sqrt2$. Segitiga $30^\circ$–$60^\circ$–$90^\circ$ (setengah segitiga sama sisi) memiliki sisi berperbandingan $1:\sqrt3:2$, dengan sisi tegak pendek setengah hipotenusa.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------ perimeter and area */
    {
      id: 'perimeter-and-area',
      heading: L('How do you find the perimeter and area of a triangle?', 'Bagaimana mencari keliling dan luas segitiga?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The perimeter is $a+b+c$, and the area is half the base times the height; when the height is not known, use Heron's formula for three sides, $\frac12ab\sin C$ for two sides and the angle between them, or the coordinate formula.**

| You know | Area |
|---|---|
| base $b$ and height $h$ | $\frac12bh$ |
| the legs $a,b$ of a right triangle | $\frac12ab$ |
| three sides $a,b,c$, with $s=\frac{a+b+c}{2}$ | $\sqrt{s(s-a)(s-b)(s-c)}$ (Heron) |
| two sides $a,b$ and the angle $C$ between them | $\frac12ab\sin C$ |
| the side $s$ of an equilateral triangle | $\frac{\sqrt3}{4}s^2$ |
| the vertices $(x_1,y_1),(x_2,y_2),(x_3,y_3)$ | half the absolute value of $x_1(y_2-y_3)+x_2(y_3-y_1)+x_3(y_1-y_2)$ |
| the inradius $r$ and semiperimeter $s$ | $rs$ |

**Why one half?** Two copies of a triangle, one turned around, fit together into a parallelogram with the same base and height, whose area is $bh$ as in the [area of a quadrilateral](article:quadrilaterals#perimeter-and-area). The triangle is half of it.

**A worked example.** The triangle with sides $13,14,15$ has $s=21$, so the area is $\sqrt{21\cdot8\cdot7\cdot6}=\sqrt{7056}=84$. Taking $14$ as the base, the height is $h=\frac{2\cdot84}{14}=12$. The inradius is $r=\frac{84}{21}=4$ and the circumradius is $R=\frac{abc}{4K}=\frac{13\cdot14\cdot15}{4\cdot84}=\frac{65}{8}$.

**The coordinate formula** for $A(0,0)$, $B(6,0)$, $C(0,8)$ gives $\frac12|0+6\cdot8+0|=24$, which is $\frac12\cdot6\cdot8$ for the right triangle. **The sine formula** for sides $7$ and $10$ with a $30^\circ$ angle between them gives $\frac12\cdot7\cdot10\cdot\sin30^\circ=17.5$. An equilateral triangle of side $6$ has area $\frac{\sqrt3}{4}\cdot36=9\sqrt3\approx15.59$.

A word problem: a plot of land is a triangle with a base of $24$ m and a height of $15$ m, and land costs 50 dollars per square meter. The area is $\frac12\cdot24\cdot15=180$ m², so the plot costs $180\cdot50=9000$ dollars.`,
            T`**Keliling adalah $a+b+c$, dan luas adalah setengah alas kali tinggi; bila tingginya tidak diketahui, pakai rumus Heron untuk tiga sisi, $\frac12ab\sin C$ untuk dua sisi dan sudut apitnya, atau rumus koordinat.**

| Yang diketahui | Luas |
|---|---|
| alas $b$ dan tinggi $h$ | $\frac12bh$ |
| sisi tegak $a,b$ pada segitiga siku-siku | $\frac12ab$ |
| tiga sisi $a,b,c$, dengan $s=\frac{a+b+c}{2}$ | $\sqrt{s(s-a)(s-b)(s-c)}$ (Heron) |
| dua sisi $a,b$ dan sudut apit $C$ | $\frac12ab\sin C$ |
| sisi $s$ segitiga sama sisi | $\frac{\sqrt3}{4}s^2$ |
| titik sudut $(x_1,y_1),(x_2,y_2),(x_3,y_3)$ | setengah nilai mutlak dari $x_1(y_2-y_3)+x_2(y_3-y_1)+x_3(y_1-y_2)$ |
| jari-jari lingkaran dalam $r$ dan setengah keliling $s$ | $rs$ |

**Mengapa setengah?** Dua salinan segitiga, satu diputar, bergabung menjadi jajargenjang dengan alas dan tinggi yang sama, yang luasnya $bh$ seperti pada [luas segiempat](article:quadrilaterals#perimeter-and-area). Segitiga adalah setengahnya.

**Contoh bertahap.** Segitiga dengan sisi $13,14,15$ memiliki $s=21$, sehingga luasnya $\sqrt{21\cdot8\cdot7\cdot6}=\sqrt{7056}=84$. Dengan $14$ sebagai alas, tingginya $h=\frac{2\cdot84}{14}=12$. Jari-jari lingkaran dalamnya $r=\frac{84}{21}=4$ dan jari-jari lingkaran luarnya $R=\frac{abc}{4K}=\frac{13\cdot14\cdot15}{4\cdot84}=\frac{65}{8}$.

**Rumus koordinat** untuk $A(0,0)$, $B(6,0)$, $C(0,8)$ memberi $\frac12|0+6\cdot8+0|=24$, yaitu $\frac12\cdot6\cdot8$ untuk segitiga siku-siku itu. **Rumus sinus** untuk sisi $7$ dan $10$ dengan sudut apit $30^\circ$ memberi $\frac12\cdot7\cdot10\cdot\sin30^\circ=17{,}5$. Segitiga sama sisi bersisi $6$ berluas $\frac{\sqrt3}{4}\cdot36=9\sqrt3\approx15{,}59$.

Soal cerita: sebidang tanah berbentuk segitiga dengan alas $24$ m dan tinggi $15$ m, dan harga tanah Rp300.000 per meter persegi. Luasnya $\frac12\cdot24\cdot15=180$ m², sehingga harga tanahnya 180 kali Rp300.000, yaitu Rp54.000.000.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------- special lines */
    {
      id: 'centers',
      heading: L('What are the medians, altitudes and centers of a triangle?', 'Apa itu garis berat, garis tinggi, dan titik-titik penting segitiga?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A triangle has four classic centers, and each is the point where three special lines meet: the centroid (medians), the circumcenter (perpendicular bisectors), the orthocenter (altitudes) and the incenter (angle bisectors).**

| Center | Where three of these lines meet | What it does |
|---|---|---|
| Centroid $G$ | the **medians**, from a vertex to the midpoint of the opposite side | the balance point; it cuts each median $2:1$; its coordinates are the mean of the vertices |
| Circumcenter $O$ | the **perpendicular bisectors** of the sides | the center of the [circle through all three vertices](article:circles#equation), radius $R$ |
| Orthocenter $H$ | the **altitudes**, from a vertex perpendicular to the opposite side | no simple meaning, but $H=A+B+C-2O$ |
| Incenter $I$ | the **angle bisectors** | the center of the circle that touches all three sides, radius $r=\frac Ks$ |

The centroid and the incenter are always inside the triangle. The circumcenter and orthocenter are inside an acute triangle, at the midpoint of the hypotenuse and at the right-angle vertex of a right triangle, and *outside* an obtuse one.

**The Euler line.** Euler showed in 1765 that $O$, $G$ and $H$ lie on one line, and that $G$ is one third of the way from $O$ to $H$: $OG:GH=1:2$. In an equilateral triangle all three coincide; the incenter lies on that line only for an isosceles triangle.

For the right triangle $A(0,0)$, $B(6,0)$, $C(0,8)$ the circumcenter is the midpoint of the hypotenuse, $O=(3,4)$, with $R=5$; the orthocenter is the right-angle vertex, $H=(0,0)$; and the centroid is the average of the vertices, $G=\left(2,\frac83\right)$. Check the line: $O+\frac13(H-O)=(3-1,\;4-\frac43)=\left(2,\frac83\right)=G$. The inradius is $r=\frac{6+8-10}{2}=2$.

Move the vertices below and watch the four centers, the two circles and the Euler line. The three exact centers are fractions, because the formulas use only addition, multiplication and division.`,
            T`**Segitiga memiliki empat titik penting klasik, dan masing-masing adalah titik tempat tiga garis istimewa bertemu: titik berat (garis berat), pusat lingkaran luar (sumbu sisi), titik tinggi (garis tinggi), dan pusat lingkaran dalam (garis bagi sudut).**

| Titik | Tempat tiga garis ini bertemu | Fungsinya |
|---|---|---|
| Titik berat $G$ | **garis berat**, dari titik sudut ke titik tengah sisi di depannya | titik keseimbangan; ia membagi tiap garis berat dengan perbandingan $2:1$; koordinatnya rata-rata titik sudut |
| Pusat lingkaran luar $O$ | **sumbu sisi** (garis bagi tegak lurus sisi) | pusat [lingkaran yang melalui ketiga titik sudut](article:circles#equation), berjari-jari $R$ |
| Titik tinggi $H$ | **garis tinggi**, dari titik sudut tegak lurus sisi di depannya | tidak punya arti sederhana, tetapi $H=A+B+C-2O$ |
| Pusat lingkaran dalam $I$ | **garis bagi sudut** | pusat lingkaran yang menyinggung ketiga sisi, berjari-jari $r=\frac Ks$ |

Titik berat dan pusat lingkaran dalam selalu berada di dalam segitiga. Pusat lingkaran luar dan titik tinggi berada di dalam segitiga lancip, di titik tengah hipotenusa dan di titik sudut siku-siku pada segitiga siku-siku, dan *di luar* segitiga tumpul.

**Garis Euler.** Euler menunjukkan pada 1765 bahwa $O$, $G$, dan $H$ terletak pada satu garis, dan $G$ berada sepertiga dari $O$ menuju $H$: $OG:GH=1:2$. Pada segitiga sama sisi ketiganya berimpit; pusat lingkaran dalam berada pada garis itu hanya untuk segitiga sama kaki.

Untuk segitiga siku-siku $A(0,0)$, $B(6,0)$, $C(0,8)$ pusat lingkaran luarnya titik tengah hipotenusa, $O=(3,4)$, dengan $R=5$; titik tingginya titik sudut siku-siku, $H=(0,0)$; dan titik beratnya rata-rata titik sudut, $G=\left(2,\frac83\right)$. Periksa garisnya: $O+\frac13(H-O)=(3-1,\;4-\frac43)=\left(2,\frac83\right)=G$. Jari-jari lingkaran dalamnya $r=\frac{6+8-10}{2}=2$.

Geser titik sudut di bawah dan amati keempat titik penting, kedua lingkaran, dan garis Euler. Ketiga titik eksak itu berupa pecahan, karena rumusnya hanya memakai penjumlahan, perkalian, dan pembagian.`,
          ),
        },
        { kind: 'widget', name: 'tripoints' },
      ],
    },

    /* ------------------------------------------------- congruence, similarity */
    {
      id: 'congruence-similarity',
      heading: L('How do you tell whether two triangles are congruent or similar?', 'Bagaimana mengetahui dua segitiga kongruen atau sebangun?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Two triangles are congruent (the same shape and size) if three well-chosen measurements agree, and similar (the same shape, possibly a different size) if their angles agree or their sides are proportional.**

| Congruence test | What must match |
|---|---|
| SSS | all three sides |
| SAS | two sides and the angle *between* them |
| ASA | two angles and the side between them |
| AAS | two angles and a side that is not between them |
| RHS (HL) | in right triangles, the hypotenuse and one leg |

*Side-side-angle* (SSA), where the angle is not between the sides, is **not** a test: the same $a$, $b$ and $A$ can make two different triangles, as the solver below shows. The only exception is the right-triangle case RHS. Angle-angle-angle (AAA) fixes the shape but not the size, so it only proves similarity.

| Similarity test | What must match |
|---|---|
| AA | two angles (the third then matches too) |
| SSS~ | all three side ratios $\frac{a}{a'}=\frac{b}{b'}=\frac{c}{c'}$ |
| SAS~ | one equal angle between two sides in the same ratio |

If two triangles are similar with scale factor $k$, every length is multiplied by $k$, every angle is unchanged, and **areas are multiplied by $k^2$**. This is the idea behind measuring a tall object by its shadow: a person $1.8$ m tall casts a shadow of $2.4$ m while a tree casts $12$ m at the same moment. The triangles are similar (the sun's angle is the same), so $\frac{h}{12}=\frac{1.8}{2.4}$ and the tree is $h=9$ m tall. Setting up such an equation is the [ratio and proportion](article:rational-numbers#ratios-proportion) idea.`,
            T`**Dua segitiga kongruen (bentuk dan ukuran sama) bila tiga ukuran yang dipilih dengan baik sama, dan sebangun (bentuk sama, ukuran boleh berbeda) bila sudut-sudutnya sama atau sisi-sisinya sebanding.**

| Syarat kongruen | Yang harus sama |
|---|---|
| SSS | ketiga sisi |
| SAS | dua sisi dan sudut *di antara* keduanya |
| ASA | dua sudut dan sisi di antara keduanya |
| AAS | dua sudut dan sisi yang tidak berada di antara keduanya |
| RHS (HL) | pada segitiga siku-siku, hipotenusa dan satu sisi tegak |

*Sisi-sisi-sudut* (SSA), dengan sudut tidak di antara kedua sisi, **bukan** syarat: $a$, $b$, dan $A$ yang sama dapat membentuk dua segitiga berbeda, seperti ditunjukkan pemecah segitiga di bawah. Satu-satunya pengecualian adalah kasus segitiga siku-siku RHS. Sudut-sudut-sudut (AAA) menentukan bentuk tetapi bukan ukuran, sehingga hanya membuktikan kesebangunan.

| Syarat sebangun | Yang harus sama |
|---|---|
| AA | dua sudut (sudut ketiga lalu otomatis sama) |
| SSS~ | ketiga perbandingan sisi $\frac{a}{a'}=\frac{b}{b'}=\frac{c}{c'}$ |
| SAS~ | satu sudut sama di antara dua sisi yang perbandingannya sama |

Jika dua segitiga sebangun dengan faktor skala $k$, setiap panjang dikalikan $k$, setiap sudut tidak berubah, dan **luas dikalikan $k^2$**. Inilah gagasan di balik mengukur benda tinggi lewat bayangannya: orang setinggi $1{,}8$ m berbayangan $2{,}4$ m sementara pohon berbayangan $12$ m pada saat yang sama. Kedua segitiganya sebangun (sudut matahari sama), sehingga $\frac{h}{12}=\frac{1{,}8}{2{,}4}$ dan tinggi pohon $h=9$ m. Menyusun persamaan seperti itu adalah gagasan [perbandingan dan proporsi](article:rational-numbers#ratios-proportion).`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------- solve a triangle */
    {
      id: 'solve-a-triangle',
      heading: L('How do you solve a triangle with the law of sines and cosines?', 'Bagaimana memecahkan segitiga dengan aturan sinus dan kosinus?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To solve a triangle means to find all three sides and all three angles from three measurements, using the law of cosines, $c^2=a^2+b^2-2ab\cos C$, and the law of sines, $\frac{a}{\sin A}=\frac{b}{\sin B}=\frac{c}{\sin C}$.**

The law of cosines is the Pythagorean theorem with a correction: at $C=90^\circ$ the cosine is $0$ and it becomes $c^2=a^2+b^2$. Its sign decides the type: $\cos C>0$ (acute), $=0$ (right) or $<0$ (obtuse), which is the test in the section on types. The law of sines says that each side is proportional to the sine of the opposite angle.

| Given | How to solve |
|---|---|
| SSS: three sides | law of cosines for two angles, then $C=180^\circ-A-B$ |
| SAS: two sides and the angle between | law of cosines for the third side, then SSS |
| ASA or AAS: two angles and a side | $C=180^\circ-A-B$, then the law of sines for the other sides |
| SSA: two sides and an angle opposite one of them | law of sines for the other angle: **0, 1 or 2 triangles** |

**Examples.** SSS with $7,8,9$: $\cos A=\frac{64+81-49}{2\cdot8\cdot9}=\frac23$, so $A\approx48.19^\circ$; likewise $B\approx58.41^\circ$ and $C=180-48.19-58.41\approx73.40^\circ$. SAS with $a=5$, $b=8$ and $C=60^\circ$: $c^2=25+64-2\cdot5\cdot8\cdot\frac12=49$, so $c=7$.

**The ambiguous case.** Take $a=3$, $b=5$ and $A=30^\circ$. The law of sines gives $\sin B=\frac{5\sin30^\circ}{3}=\frac56\approx0.8333$, and *two* angles have that sine, $B\approx56.44^\circ$ and $B\approx123.56^\circ$. Both leave a positive third angle ($93.56^\circ$ or $26.44^\circ$), so two triangles fit: with $c\approx5.99$ and with $c\approx2.67$. In general, with $A$ acute, side $a$ too short ($a<b\sin A$) gives no triangle, $a=b\sin A$ gives one right triangle, $b\sin A<a<b$ gives two, and $a\ge b$ gives one.

Try every case below. A calculator or a program must be in *degree* mode for these formulas, or the angles must be converted to radians.`,
            T`**Memecahkan segitiga berarti mencari ketiga sisi dan ketiga sudut dari tiga ukuran, dengan aturan kosinus, $c^2=a^2+b^2-2ab\cos C$, dan aturan sinus, $\frac{a}{\sin A}=\frac{b}{\sin B}=\frac{c}{\sin C}$.**

Aturan kosinus adalah teorema Pythagoras dengan koreksi: pada $C=90^\circ$ kosinusnya $0$ dan ia menjadi $c^2=a^2+b^2$. Tandanya menentukan jenis: $\cos C>0$ (lancip), $=0$ (siku-siku), atau $<0$ (tumpul), yaitu uji pada bagian jenis segitiga. Aturan sinus mengatakan bahwa tiap sisi sebanding dengan sinus sudut di depannya.

| Diketahui | Cara memecahkan |
|---|---|
| SSS: tiga sisi | aturan kosinus untuk dua sudut, lalu $C=180^\circ-A-B$ |
| SAS: dua sisi dan sudut apit | aturan kosinus untuk sisi ketiga, lalu SSS |
| ASA atau AAS: dua sudut dan satu sisi | $C=180^\circ-A-B$, lalu aturan sinus untuk sisi lainnya |
| SSA: dua sisi dan sudut di depan salah satunya | aturan sinus untuk sudut lainnya: **0, 1, atau 2 segitiga** |

**Contoh.** SSS dengan $7,8,9$: $\cos A=\frac{64+81-49}{2\cdot8\cdot9}=\frac23$, sehingga $A\approx48{,}19^\circ$; demikian pula $B\approx58{,}41^\circ$ dan $C=180-48{,}19-58{,}41\approx73{,}40^\circ$. SAS dengan $a=5$, $b=8$, dan $C=60^\circ$: $c^2=25+64-2\cdot5\cdot8\cdot\frac12=49$, sehingga $c=7$.

**Kasus ambigu.** Ambil $a=3$, $b=5$, dan $A=30^\circ$. Aturan sinus memberi $\sin B=\frac{5\sin30^\circ}{3}=\frac56\approx0{,}8333$, dan *dua* sudut memiliki sinus itu, $B\approx56{,}44^\circ$ dan $B\approx123{,}56^\circ$. Keduanya menyisakan sudut ketiga positif ($93{,}56^\circ$ atau $26{,}44^\circ$), sehingga dua segitiga cocok: dengan $c\approx5{,}99$ dan dengan $c\approx2{,}67$. Secara umum, dengan $A$ lancip, sisi $a$ terlalu pendek ($a<b\sin A$) tidak memberi segitiga, $a=b\sin A$ memberi satu segitiga siku-siku, $b\sin A<a<b$ memberi dua, dan $a\ge b$ memberi satu.

Coba setiap kasus di bawah. Kalkulator atau program harus berada pada mode *derajat* untuk rumus-rumus ini, atau sudutnya harus diubah ke radian.`,
          ),
        },
        { kind: 'widget', name: 'trisolve' },
      ],
    },

    /* --------------------------------------------------------------- in code */
    {
      id: 'triangles-in-code',
      heading: L('How do you work with triangles in code?', 'Bagaimana bekerja dengan segitiga dalam kode?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Classify a triangle with integer squares, not with angles: sort the sides, check $a+b>c$, and compare $c^2$ with $a^2+b^2$.** Keep Heron's formula exact by computing the square of the area with ´Fraction´, and use a root only at the very end.`,
            T`**Golongkan segitiga dengan kuadrat bilangan bulat, bukan dengan sudut: urutkan sisinya, periksa $a+b>c$, dan bandingkan $c^2$ dengan $a^2+b^2$.** Jaga rumus Heron tetap eksak dengan menghitung kuadrat luas memakai ´Fraction´, dan pakai akar hanya di akhir.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python', 'Python'),
          code: `from fractions import Fraction
from math import sqrt, acos, degrees

def kind(a, b, c):
    a, b, c = sorted((a, b, c))
    if a + b <= c: return "not a triangle"
    sides = {1: "equilateral", 2: "isosceles", 3: "scalene"}[len({a, b, c})]
    d = a * a + b * b - c * c          # the sign of the cosine of the largest angle
    return sides + (" right" if d == 0 else " acute" if d > 0 else " obtuse")

def area_sq(a, b, c):
    s = Fraction(a + b + c, 2)
    return s * (s - a) * (s - b) * (s - c)         # Heron without the root: exact

def area_xy(p, q, r):
    return abs(p[0] * (q[1] - r[1]) + q[0] * (r[1] - p[1]) + r[0] * (p[1] - q[1])) / 2

>>> kind(3, 4, 5)
'scalene right'
>>> kind(5, 5, 8)
'isosceles obtuse'
>>> kind(2, 3, 4)
'scalene obtuse'
>>> kind(1, 2, 3)
'not a triangle'
>>> area_sq(13, 14, 15)
Fraction(7056, 1)
>>> sqrt(area_sq(13, 14, 15))
84.0
>>> area_xy((0, 0), (6, 0), (0, 8))
24.0
>>> degrees(acos(Fraction(2, 3)))                  # angle A of the 7, 8, 9 triangle
48.18968510422141
>>> a, b, c = 1e8, 1e8 - 1e-6, 1e-6               # a needle-thin triangle
>>> s = (a + b + c) / 2
>>> sqrt(max(0, s * (s - a) * (s - b) * (s - c)))  # Heron with floats
0.0
>>> sqrt(area_sq(Fraction(a), Fraction(b), Fraction(c)))   # exact on the same numbers
2.846826518921699`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript', 'JavaScript'),
          code: `const [a, b, c] = [3, 4, 5]
Math.hypot(a, b)                                          // 5
Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180 / Math.PI   // angle A: 36.86989764584402
Math.sin(30 * Math.PI / 180)                              // 0.49999999999999994, not 0.5
a * a + b * b === c * c                                   // true: exact for integers, the right-angle test`,
        },
        {
          kind: 'text',
          text: L(
            T`The pitfalls, in order of how often they bite:

| Pitfall | What happens | What to do |
|---|---|---|
| Testing a right angle with floats | ´math.sqrt(a*a + b*b) == c´ can fail through rounding | compare the integers ´a*a + b*b == c*c´, or use ´math.isclose´; see [real numbers in code](article:real-numbers#real-numbers-in-code) |
| Heron's formula on a thin triangle | $s-a$ and $s-b$ lose their digits and the area becomes ´0.0´ | use ´Fraction´ as above, or sort the sides and use Kahan's stable form |
| Degrees against radians | ´math.sin(30)´ is not $0.5$ | use ´math.radians(30)´; ´math.degrees´ goes back |
| ´acos´ of a rounded cosine | a value like 1.0000000000000002 raises ´ValueError´ | clamp the argument to $[-1,1]$ |
| Not sorting the sides | the longest side is not tested | sort first, or take ´max´ |
| Degenerate input | $a+b=c$ is a flat triangle with area 0 | require ´a + b > c´ strictly |
| ´^´ for a square | it is XOR | use ´**´ or multiply: ´a * a´ |`,
            T`Jebakannya, berdasarkan seberapa sering terjadi:

| Jebakan | Yang terjadi | Yang sebaiknya dilakukan |
|---|---|---|
| Menguji sudut siku-siku dengan float | ´math.sqrt(a*a + b*b) == c´ dapat gagal karena pembulatan | bandingkan bilangan bulat ´a*a + b*b == c*c´, atau pakai ´math.isclose´; lihat [bilangan real dalam kode](article:real-numbers#real-numbers-in-code) |
| Rumus Heron pada segitiga tipis | $s-a$ dan $s-b$ kehilangan digitnya dan luasnya menjadi ´0.0´ | pakai ´Fraction´ seperti di atas, atau urutkan sisi dan pakai bentuk stabil Kahan |
| Derajat dan radian tertukar | ´math.sin(30)´ bukan $0{,}5$ | pakai ´math.radians(30)´; ´math.degrees´ untuk kembali |
| ´acos´ dari kosinus yang dibulatkan | nilai seperti ´1.0000000000000002´ memunculkan ´ValueError´ | batasi argumen pada $[-1,1]$ |
| Tidak mengurutkan sisi | sisi terpanjang tidak diuji | urutkan dulu, atau ambil ´max´ |
| Masukan merosot | $a+b=c$ adalah segitiga datar berluas 0 | wajibkan ´a + b > c´ secara ketat |
| ´^´ untuk kuadrat | itu XOR | pakai ´**´ atau kalikan: ´a * a´ |`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where does the study of triangles come from?', 'Dari mana asal ilmu tentang segitiga?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Triangles are the oldest tool of surveying and of proof, and the Pythagorean theorem was known in several civilizations long before Pythagoras.**

- **c. 1800 BCE.** The Babylonian clay tablet Plimpton 322 lists what appear to be Pythagorean triples, such as $(119,120,169)$, so the relation was in use a thousand years before Greek geometry.
- **c. 800–500 BCE.** The Indian *Sulba Sutras*, rules for building altars, state that the diagonal of a rectangle produces the area of the squares on both sides.
- **c. 600 BCE.** Tradition says that Thales of Miletus measured the height of a pyramid from the length of its shadow, an early use of similar triangles.
- **c. 300 BCE.** Euclid's *Elements*, Book I, proves that the angles of a triangle add up to two right angles (I.32), the triangle inequality (I.20), the Pythagorean theorem (I.47) and its converse (I.48); Book II gives the law of cosines in geometric form.
- **c. 60 CE.** Heron of Alexandria's *Metrica* proves the formula for the area from the three sides, which Arabic sources credit to Archimedes.
- **1765.** Leonhard Euler shows that the circumcenter, centroid and orthocenter of a triangle are collinear: the Euler line.
- **1822.** Karl Feuerbach describes the nine-point circle, which passes through the midpoints of the sides, the feet of the altitudes and the midpoints between the orthocenter and the vertices, and which touches the incircle.

The Pythagorean theorem has been proved in hundreds of ways: a collection published in 1927 lists more than 370.`,
            T`**Segitiga adalah alat tertua dalam pengukuran tanah dan pembuktian, dan teorema Pythagoras sudah dikenal di beberapa peradaban jauh sebelum Pythagoras.**

- **Sekitar 1800 SM.** Lempeng tanah liat Babilonia Plimpton 322 mendaftar apa yang tampaknya tripel Pythagoras, seperti $(119,120,169)$, sehingga hubungan itu sudah dipakai seribu tahun sebelum geometri Yunani.
- **Sekitar 800–500 SM.** *Sulba Sutra* India, aturan membangun altar, menyatakan bahwa diagonal persegi panjang menghasilkan luas persegi pada kedua sisinya.
- **Sekitar 600 SM.** Tradisi mengatakan bahwa Thales dari Miletos mengukur tinggi piramida dari panjang bayangannya, penggunaan awal segitiga sebangun.
- **Sekitar 300 SM.** *Elements* Euclid, Buku I, membuktikan bahwa sudut segitiga berjumlah dua sudut siku-siku (I.32), ketaksamaan segitiga (I.20), teorema Pythagoras (I.47), dan kebalikannya (I.48); Buku II memberi aturan kosinus dalam bentuk geometri.
- **Sekitar 60 M.** *Metrica* karya Heron dari Aleksandria membuktikan rumus luas dari ketiga sisi, yang menurut sumber Arab berasal dari Archimedes.
- **1765.** Leonhard Euler menunjukkan bahwa pusat lingkaran luar, titik berat, dan titik tinggi segitiga segaris: garis Euler.
- **1822.** Karl Feuerbach menguraikan lingkaran sembilan titik, yang melalui titik tengah sisi-sisi, kaki garis-garis tinggi, dan titik tengah antara titik tinggi dan titik-titik sudut, dan yang menyinggung lingkaran dalam.

Teorema Pythagoras telah dibuktikan dengan ratusan cara: kumpulan yang terbit pada 1927 mendaftar lebih dari 370.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What are the common mistakes with triangles?', 'Apa kesalahan umum pada segitiga?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with triangles are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| The angles of a triangle add up to $360^\circ$ | That is a quadrilateral. A triangle has $180^\circ$. |
| Any three lengths make a triangle | The longest must be shorter than the other two together: $1,2,3$ is flat. |
| The height is the slanted side | The height is the perpendicular distance; the slanted side is longer. |
| The area is base times height | It is half of that: $\frac12bh$. |
| $a^2+b^2=c^2$ holds in every triangle | Only in a right triangle; otherwise use the law of cosines. |
| Any side can be the hypotenuse | It is the longest side, opposite the right angle: $c^2=a^2+b^2$. |
| $4,5,6$ is a right triangle | $16+25=41\ne36$: it is acute. Check the squares. |
| In SSA there is always one triangle | There can be none, one or two; check the second angle $180^\circ-B$. |
| A calculator in radian mode gives $\sin30^\circ=0.5$ | It gives $-0.988$: use degree mode, or convert. |`,
            T`**Kesalahan paling umum pada segitiga adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| Sudut segitiga berjumlah $360^\circ$ | Itu segiempat. Segitiga berjumlah $180^\circ$. |
| Tiga panjang sembarang membentuk segitiga | Yang terpanjang harus lebih pendek daripada jumlah dua lainnya: $1,2,3$ datar. |
| Tinggi adalah sisi yang miring | Tinggi adalah jarak tegak lurus; sisi yang miring lebih panjang. |
| Luas adalah alas kali tinggi | Luasnya setengah dari itu: $\frac12bh$. |
| $a^2+b^2=c^2$ berlaku pada setiap segitiga | Hanya pada segitiga siku-siku; selain itu pakai aturan kosinus. |
| Sisi mana pun dapat menjadi hipotenusa | Hipotenusa adalah sisi terpanjang, di depan sudut siku-siku: $c^2=a^2+b^2$. |
| $4,5,6$ adalah segitiga siku-siku | $16+25=41\ne36$: ia lancip. Periksa kuadratnya. |
| Pada SSA selalu ada satu segitiga | Bisa tidak ada, satu, atau dua; periksa sudut kedua $180^\circ-B$. |
| Kalkulator mode radian memberi $\sin30^\circ=0{,}5$ | Ia memberi $-0{,}988$: pakai mode derajat, atau ubah satuannya. |`,
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
              L('The interior angles of every triangle add up to $180^\\circ$.', 'Sudut dalam setiap segitiga berjumlah $180^\\circ$.'),
              L('Any three positive lengths form a triangle.', 'Tiga panjang positif sembarang membentuk segitiga.'),
              L('A triangle can have two right angles.', 'Segitiga dapat memiliki dua sudut siku-siku.'),
              L('An equilateral triangle is always acute.', 'Segitiga sama sisi selalu lancip.'),
              L('In a right triangle the hypotenuse is the longest side.', 'Pada segitiga siku-siku hipotenusa adalah sisi terpanjang.'),
              L('The centroid cuts each median in the ratio $2:1$.', 'Titik berat membagi tiap garis berat dengan perbandingan $2:1$.'),
            ],
            answer: [true, false, false, true, true, true],
            explain: L(
              'The angle sum is $180^\\circ$, so two right angles would leave nothing for the third. $1,2,3$ shows that some lengths do not work. An equilateral triangle has three $60^\\circ$ angles. The hypotenuse faces the largest angle. The centroid is two thirds of the way along each median from the vertex.',
              'Jumlah sudut adalah $180^\\circ$, sehingga dua sudut siku-siku tidak menyisakan apa pun untuk sudut ketiga. $1,2,3$ menunjukkan bahwa sebagian panjang tidak berlaku. Segitiga sama sisi memiliki tiga sudut $60^\\circ$. Hipotenusa menghadap sudut terbesar. Titik berat berada dua pertiga sepanjang garis berat dari titik sudut.',
            ),
            hint: L('Use the angle sum and the triangle inequality.', 'Pakai jumlah sudut dan ketaksamaan segitiga.'),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L('Choose **all** the sets of lengths that form a triangle.', 'Pilih **semua** kumpulan panjang yang membentuk segitiga.'),
            options: [L('$3,4,5$', '$3,4,5$'), L('$1,2,3$', '$1,2,3$'), L('$5,5,9$', '$5,5,9$'), L('$2,2,5$', '$2,2,5$'), L('$6,7,12$', '$6,7,12$')],
            answer: [0, 2, 4],
            explain: L(
              '$5<3+4$, $9<5+5$ and $12<6+7$ all hold. $1,2,3$ is flat ($3=1+2$) and $2,2,5$ fails ($5>2+2$).',
              '$5<3+4$, $9<5+5$, dan $12<6+7$ semuanya berlaku. $1,2,3$ datar ($3=1+2$) dan $2,2,5$ gagal ($5>2+2$).',
            ),
            hint: L('Compare the longest length with the sum of the other two.', 'Bandingkan panjang terpanjang dengan jumlah dua lainnya.'),
          },
        },
        {
          kind: 'activity',
          title: L('Which type?', 'Jenis apa?'),
          step: {
            kind: 'quiz',
            id: 'p3',
            prompt: L('A triangle has sides $6$, $8$ and $10$. What kind of triangle is it?', 'Sebuah segitiga memiliki sisi $6$, $8$, dan $10$. Segitiga apakah itu?'),
            options: [L('acute', 'lancip'), L('right', 'siku-siku'), L('obtuse', 'tumpul'), L('not a triangle', 'bukan segitiga')],
            answer: 1,
            explain: L(
              '$6^2+8^2=36+64=100=10^2$, so the angle opposite the side $10$ is a right angle.',
              '$6^2+8^2=36+64=100=10^2$, sehingga sudut di depan sisi $10$ adalah sudut siku-siku.',
            ),
            hint: L('Compare the square of the longest side with the sum of the other two squares.', 'Bandingkan kuadrat sisi terpanjang dengan jumlah kuadrat dua sisi lainnya.'),
          },
        },
        {
          kind: 'activity',
          title: L('Angles in a ratio', 'Sudut berperbandingan'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L('Write the angles as $2x,3x,4x$.', 'Tulis sudut-sudutnya sebagai $2x,3x,4x$.'), L('$9x=180$, so $x=20$.', '$9x=180$, sehingga $x=20$.')],
            explain: L('$2x+3x+4x=9x=180$, so $x=20$ and the largest angle is $4x=80^\\circ$.', '$2x+3x+4x=9x=180$, sehingga $x=20$ dan sudut terbesar $4x=80^\\circ$.'),
            prompt: L('The angles of a triangle are in the ratio $2:3:4$. How many degrees is the largest?', 'Sudut-sudut suatu segitiga berperbandingan $2:3:4$. Berapa derajat yang terbesar?'),
            given: String.raw`2x+3x+4x=180:\quad 4x=v`,
            blanks: [{ label: 'v =', answer: 80 }],
          },
        },
        {
          kind: 'activity',
          title: L('A right triangle', 'Segitiga siku-siku'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [
              L('The hypotenuse is $\\sqrt{9^2+12^2}$.', 'Hipotenusanya $\\sqrt{9^2+12^2}$.'),
              L('$81+144=225$. The area is half the product of the legs.', '$81+144=225$. Luasnya setengah hasil kali sisi tegak.'),
            ],
            explain: L('$c=\\sqrt{81+144}=\\sqrt{225}=15$ and the area is $\\frac12\\cdot9\\cdot12=54$.', '$c=\\sqrt{81+144}=\\sqrt{225}=15$ dan luasnya $\\frac12\\cdot9\\cdot12=54$.'),
            prompt: L('A right triangle has legs $9$ and $12$. Find its hypotenuse and its area.', 'Sebuah segitiga siku-siku memiliki sisi tegak $9$ dan $12$. Tentukan hipotenusa dan luasnya.'),
            given: String.raw`a=9,\ b=12`,
            blanks: [
              { label: L('hypotenuse =', 'hipotenusa ='), answer: 15 },
              { label: L('area =', 'luas ='), answer: 54 },
            ],
          },
        },
        {
          kind: 'activity',
          title: L("Heron's formula", 'Rumus Heron'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L('The semiperimeter is $s=\\frac{5+5+6}{2}$.', 'Setengah kelilingnya $s=\\frac{5+5+6}{2}$.'), L('$s=8$, so $K=\\sqrt{8\\cdot3\\cdot3\\cdot2}$.', '$s=8$, sehingga $K=\\sqrt{8\\cdot3\\cdot3\\cdot2}$.')],
            explain: L('$K=\\sqrt{8\\cdot3\\cdot3\\cdot2}=\\sqrt{144}=12$.', '$K=\\sqrt{8\\cdot3\\cdot3\\cdot2}=\\sqrt{144}=12$.'),
            prompt: L('Use Heron\'s formula to find the area of the triangle with sides $5$, $5$ and $6$.', 'Pakai rumus Heron untuk mencari luas segitiga dengan sisi $5$, $5$, dan $6$.'),
            given: String.raw`s=\frac{5+5+6}{2}:\quad K=\sqrt{s(s-5)(s-5)(s-6)}=v`,
            blanks: [{ label: 'v =', answer: 12 }],
          },
        },
        {
          kind: 'activity',
          title: L('Area from coordinates', 'Luas dari koordinat'),
          step: {
            kind: 'math',
            id: 'p7',
            hints: [
              L('Use $\\frac12\\left|x_1(y_2-y_3)+x_2(y_3-y_1)+x_3(y_1-y_2)\\right|$.', 'Pakai $\\frac12\\left|x_1(y_2-y_3)+x_2(y_3-y_1)+x_3(y_1-y_2)\\right|$.'),
              L('The three terms are $-5$, $35$ and $0$.', 'Ketiga sukunya $-5$, $35$, dan $0$.'),
            ],
            explain: L('$\\frac12\\left|1(1-6)+7(6-1)+4(1-1)\\right|=\\frac12\\left|-5+35+0\\right|=15$. Check: base $6$, height $5$.', '$\\frac12\\left|1(1-6)+7(6-1)+4(1-1)\\right|=\\frac12\\left|-5+35+0\\right|=15$. Periksa: alas $6$, tinggi $5$.'),
            prompt: L('Find the area of the triangle with vertices $(1,1)$, $(7,1)$ and $(4,6)$.', 'Tentukan luas segitiga dengan titik sudut $(1,1)$, $(7,1)$, dan $(4,6)$.'),
            given: String.raw`\tfrac12\left|x_1(y_2-y_3)+x_2(y_3-y_1)+x_3(y_1-y_2)\right|=v`,
            blanks: [{ label: 'v =', answer: 15 }],
          },
        },
        {
          kind: 'activity',
          title: L('The law of cosines', 'Aturan kosinus'),
          step: {
            kind: 'math',
            id: 'p8',
            hints: [L('$c^2=a^2+b^2-2ab\\cos C$ with $\\cos60^\\circ=\\frac12$.', '$c^2=a^2+b^2-2ab\\cos C$ dengan $\\cos60^\\circ=\\frac12$.'), L('$25+64-40=49$.', '$25+64-40=49$.')],
            explain: L('$c^2=25+64-2\\cdot5\\cdot8\\cdot\\frac12=49$, so $c=7$.', '$c^2=25+64-2\\cdot5\\cdot8\\cdot\\frac12=49$, sehingga $c=7$.'),
            prompt: L('Two sides of a triangle are $5$ and $8$ with $60^\\circ$ between them. Find the third side.', 'Dua sisi suatu segitiga adalah $5$ dan $8$ dengan sudut apit $60^\\circ$. Tentukan sisi ketiga.'),
            given: String.raw`c^2=5^2+8^2-2\cdot5\cdot8\cdot\cos60^\circ:\quad c=v`,
            blanks: [{ label: 'c =', answer: 7 }],
          },
        },
        {
          kind: 'activity',
          title: L('The ambiguous case', 'Kasus ambigu'),
          step: {
            kind: 'quiz',
            id: 'p9',
            prompt: L('How many triangles have $a=3$, $b=5$ and $A=30^\\circ$?', 'Berapa segitiga yang memiliki $a=3$, $b=5$, dan $A=30^\\circ$?'),
            options: [L('none', 'tidak ada'), L('one', 'satu'), L('two', 'dua'), L('three', 'tiga')],
            answer: 2,
            explain: L(
              '$\\sin B=\\frac{5\\sin30^\\circ}{3}=\\frac56$, and both $B\\approx56.4^\\circ$ and $B\\approx123.6^\\circ$ leave a positive third angle, so two triangles fit.',
              '$\\sin B=\\frac{5\\sin30^\\circ}{3}=\\frac56$, dan baik $B\\approx56{,}4^\\circ$ maupun $B\\approx123{,}6^\\circ$ menyisakan sudut ketiga positif, sehingga dua segitiga cocok.',
            ),
            hint: L('Find $\\sin B$, then check both angles with that sine.', 'Cari $\\sin B$, lalu periksa kedua sudut dengan sinus itu.'),
          },
        },
        {
          kind: 'activity',
          title: L('A shadow', 'Sebuah bayangan'),
          step: {
            kind: 'quiz',
            id: 'p10',
            prompt: L(
              'A person 1.5 m tall casts a shadow of 2 m. At the same moment a tree casts a shadow of 16 m. How tall is the tree?',
              'Seseorang setinggi 1,5 m berbayangan 2 m. Pada saat yang sama sebatang pohon berbayangan 16 m. Berapa tinggi pohon itu?',
            ),
            options: [L('8 m', '8 m'), L('12 m', '12 m'), L('16 m', '16 m'), L('21.3 m', '21,3 m')],
            answer: 1,
            explain: L(
              'The triangles are similar, so $\\frac{h}{16}=\\frac{1.5}{2}$ and $h=12$ m.',
              'Kedua segitiga sebangun, sehingga $\\frac{h}{16}=\\frac{1{,}5}{2}$ dan $h=12$ m.',
            ),
            hint: L('Heights and shadows are in the same ratio.', 'Tinggi dan bayangan berada dalam perbandingan yang sama.'),
          },
        },
        {
          kind: 'activity',
          title: L('A plot of land', 'Sebidang tanah'),
          step: {
            kind: 'quiz',
            id: 'p11',
            prompt: L(
              'A plot is a triangle with a base of 20 m and a height of 12 m. Land costs 70 dollars per square meter. What does the plot cost?',
              'Sebidang tanah berbentuk segitiga dengan alas 20 m dan tinggi 12 m. Harga tanah Rp250.000 per meter persegi. Berapa harga tanah itu?',
            ),
            options: [L('8,400 dollars', 'Rp30.000.000'), L('16,800 dollars', 'Rp60.000.000'), L('4,200 dollars', 'Rp15.000.000'), L('2,400 dollars', 'Rp6.000.000')],
            answer: 0,
            explain: L(
              'The area is $\\frac12\\cdot20\\cdot12=120$ m², so the cost is $120\\cdot70=8400$ dollars.',
              'Luasnya $\\frac12\\cdot20\\cdot12=120$ m², sehingga harganya 120 kali Rp250.000, yaitu Rp30.000.000.',
            ),
            hint: L('Do not forget the one half in the area of a triangle.', 'Jangan lupa setengah pada luas segitiga.'),
          },
        },
      ],
    },

    /* ---------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: triangles at a glance', 'Ringkasan: segitiga sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Angles:** $\angle A+\angle B+\angle C=180^\circ$; an exterior angle is the sum of the two remote interior angles.
- **Existence:** each side is shorter than the sum of the other two; the third side is between $|a-b|$ and $a+b$.
- **Types:** equilateral, isosceles, scalene by sides; acute, right, obtuse by $c^2$ against $a^2+b^2$ for the longest side $c$.
- **Pythagoras:** right triangle $\Leftrightarrow a^2+b^2=c^2$; triples $(m^2-n^2,2mn,m^2+n^2)$; special $1:1:\sqrt2$ and $1:\sqrt3:2$.
- **Area:** $\frac12bh$, Heron $\sqrt{s(s-a)(s-b)(s-c)}$, $\frac12ab\sin C$, and the coordinate formula.
- **Centers:** centroid $G$ (medians, $2:1$), circumcenter $O$, orthocenter $H$ ($O,G,H$ on the Euler line), incenter $I$ ($r=\frac Ks$).
- **Congruent:** SSS, SAS, ASA, AAS, RHS; **similar:** AA, with areas in the ratio $k^2$.
- **Solve:** law of cosines $c^2=a^2+b^2-2ab\cos C$, law of sines; SSA can give 0, 1 or 2 triangles.
- **Code:** integer squares for the right-angle test, ´Fraction´ for exact Heron, radians for ´sin´ and ´cos´.`,
            T`- **Sudut:** $\angle A+\angle B+\angle C=180^\circ$; sudut luar adalah jumlah dua sudut dalam yang tidak bersebelahan.
- **Keberadaan:** tiap sisi lebih pendek daripada jumlah dua lainnya; sisi ketiga berada di antara $|a-b|$ dan $a+b$.
- **Jenis:** sama sisi, sama kaki, sembarang menurut sisi; lancip, siku-siku, tumpul menurut $c^2$ terhadap $a^2+b^2$ untuk sisi terpanjang $c$.
- **Pythagoras:** segitiga siku-siku $\Leftrightarrow a^2+b^2=c^2$; tripel $(m^2-n^2,2mn,m^2+n^2)$; istimewa $1:1:\sqrt2$ dan $1:\sqrt3:2$.
- **Luas:** $\frac12bh$, Heron $\sqrt{s(s-a)(s-b)(s-c)}$, $\frac12ab\sin C$, dan rumus koordinat.
- **Titik penting:** titik berat $G$ (garis berat, $2:1$), pusat lingkaran luar $O$, titik tinggi $H$ ($O,G,H$ pada garis Euler), pusat lingkaran dalam $I$ ($r=\frac Ks$).
- **Kongruen:** SSS, SAS, ASA, AAS, RHS; **sebangun:** AA, dengan luas berperbandingan $k^2$.
- **Memecahkan:** aturan kosinus $c^2=a^2+b^2-2ab\cos C$, aturan sinus; SSA dapat memberi 0, 1, atau 2 segitiga.
- **Kode:** kuadrat bilangan bulat untuk uji sudut siku-siku, ´Fraction´ untuk Heron eksak, radian untuk ´sin´ dan ´cos´.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Triangle', 'Segitiga'), definition: L('A polygon with three sides, three vertices and three interior angles that add up to 180 degrees.', 'Poligon dengan tiga sisi, tiga titik sudut, dan tiga sudut dalam yang berjumlah 180 derajat.') },
    { term: L('Hypotenuse', 'Hipotenusa'), definition: L('The longest side of a right triangle, opposite the right angle.', 'Sisi terpanjang segitiga siku-siku, di depan sudut siku-siku.') },
    { term: L('Altitude', 'Garis tinggi'), definition: L('The perpendicular segment from a vertex to the line holding the opposite side; its length is the height for that base.', 'Ruas garis tegak lurus dari titik sudut ke garis yang memuat sisi di depannya; panjangnya adalah tinggi untuk alas itu.') },
    { term: L('Median', 'Garis berat'), definition: L('The segment from a vertex to the midpoint of the opposite side.', 'Ruas garis dari titik sudut ke titik tengah sisi di depannya.') },
    { term: L('Centroid', 'Titik berat'), definition: L('The point where the three medians meet, the balance point of the triangle, two thirds of the way along each median from its vertex.', 'Titik tempat ketiga garis berat bertemu, titik keseimbangan segitiga, berada dua pertiga sepanjang tiap garis berat dari titik sudutnya.') },
    { term: L('Circumcenter', 'Pusat lingkaran luar'), definition: L('The point where the perpendicular bisectors of the sides meet, equally far from the three vertices.', 'Titik tempat sumbu-sumbu sisi bertemu, berjarak sama dari ketiga titik sudut.') },
    { term: L('Orthocenter', 'Titik tinggi'), definition: L('The point where the three altitudes of a triangle meet.', 'Titik tempat ketiga garis tinggi segitiga bertemu.') },
    { term: L('Incenter', 'Pusat lingkaran dalam'), definition: L('The point where the three angle bisectors meet, equally far from the three sides and the center of the inscribed circle.', 'Titik tempat ketiga garis bagi sudut bertemu, berjarak sama dari ketiga sisi dan pusat lingkaran dalam.') },
    { term: L('Triangle inequality', 'Ketaksamaan segitiga'), definition: L('The rule that each side of a triangle is shorter than the sum of the other two sides.', 'Aturan bahwa tiap sisi segitiga lebih pendek daripada jumlah dua sisi lainnya.') },
    { term: L('Pythagorean triple', 'Tripel Pythagoras'), definition: L('Three whole numbers a, b and c with a squared plus b squared equal to c squared, such as 3, 4 and 5.', 'Tiga bilangan bulat a, b, dan c dengan a kuadrat ditambah b kuadrat sama dengan c kuadrat, seperti 3, 4, dan 5.') },
    { term: L('Congruent triangles', 'Segitiga kongruen'), definition: L('Triangles with the same shape and size, so that all corresponding sides and angles are equal.', 'Segitiga dengan bentuk dan ukuran yang sama, sehingga semua sisi dan sudut yang bersesuaian sama.') },
    { term: L('Similar triangles', 'Segitiga sebangun'), definition: L('Triangles with equal angles and proportional sides, the same shape but possibly different sizes.', 'Segitiga dengan sudut sama dan sisi sebanding, bentuk sama tetapi ukuran mungkin berbeda.') },
    { term: L("Heron's formula", 'Rumus Heron'), definition: L('The formula that gives the area of a triangle from its three sides as the square root of s times s minus a times s minus b times s minus c.', 'Rumus yang memberi luas segitiga dari ketiga sisinya sebagai akar dari s kali s dikurang a kali s dikurang b kali s dikurang c.') },
    { term: L('Law of cosines', 'Aturan kosinus'), definition: L('The rule that c squared equals a squared plus b squared minus twice a times b times the cosine of the angle C between them.', 'Aturan bahwa c kuadrat sama dengan a kuadrat ditambah b kuadrat dikurangi dua kali a kali b kali kosinus sudut C di antara keduanya.') },
    { term: L('Law of sines', 'Aturan sinus'), definition: L('The rule that each side of a triangle divided by the sine of its opposite angle gives the same number.', 'Aturan bahwa tiap sisi segitiga dibagi sinus sudut di depannya memberi bilangan yang sama.') },
  ],

  howTo: [
    {
      name: L('How to tell what kind of triangle three lengths make', 'Cara menentukan jenis segitiga dari tiga panjang'),
      description: L('Check that the lengths form a triangle, then read off the type by sides and by angles from the squares.', 'Periksa bahwa panjangnya membentuk segitiga, lalu baca jenis menurut sisi dan sudut dari kuadratnya.'),
      steps: [
        { name: L('Sort the lengths', 'Urutkan panjangnya'), text: L('Put the lengths in order so that c is the largest, for example 4, 5 and 6.', 'Urutkan panjangnya sehingga c yang terbesar, misalnya 4, 5, dan 6.') },
        { name: L('Check the triangle inequality', 'Periksa ketaksamaan segitiga'), text: L('Check that a plus b is greater than c; if it is not, there is no triangle.', 'Periksa bahwa a ditambah b lebih besar daripada c; jika tidak, tidak ada segitiga.') },
        { name: L('Name it by its sides', 'Namai menurut sisinya'), text: L('Three equal lengths make an equilateral triangle, exactly two an isosceles one and none a scalene one.', 'Tiga panjang sama membuat segitiga sama sisi, tepat dua membuat sama kaki, dan tidak ada yang sama membuat segitiga sembarang.') },
        { name: L('Compare the squares', 'Bandingkan kuadratnya'), text: L('Compare c squared with a squared plus b squared: smaller means acute, equal means right and larger means obtuse.', 'Bandingkan c kuadrat dengan a kuadrat ditambah b kuadrat: lebih kecil berarti lancip, sama berarti siku-siku, dan lebih besar berarti tumpul.') },
      ],
    },
    {
      name: L('How to find the area of a triangle from its three sides', 'Cara mencari luas segitiga dari ketiga sisinya'),
      description: L("Use Heron's formula with the semiperimeter.", 'Pakai rumus Heron dengan setengah keliling.'),
      steps: [
        { name: L('Find the semiperimeter', 'Cari setengah keliling'), text: L('Add the three sides and halve the sum: for 13, 14 and 15 it is 21.', 'Jumlahkan ketiga sisi dan bagi dua: untuk 13, 14, dan 15 hasilnya 21.') },
        { name: L('Subtract each side', 'Kurangkan tiap sisi'), text: L('Subtract each side from the semiperimeter: 8, 7 and 6.', 'Kurangkan tiap sisi dari setengah keliling: 8, 7, dan 6.') },
        { name: L('Multiply the four numbers', 'Kalikan keempat bilangan'), text: L('Multiply the semiperimeter and the three differences: 21 times 8 times 7 times 6 is 7056.', 'Kalikan setengah keliling dan ketiga selisih: 21 kali 8 kali 7 kali 6 adalah 7056.') },
        { name: L('Take the square root', 'Tarik akar kuadrat'), text: L('The area is the square root of that product: the square root of 7056 is 84.', 'Luasnya adalah akar kuadrat hasil kali itu: akar kuadrat 7056 adalah 84.') },
      ],
    },
    {
      name: L('How to find the missing side of a right triangle', 'Cara mencari sisi yang hilang pada segitiga siku-siku'),
      description: L('Use the Pythagorean theorem, choosing the hypotenuse first.', 'Pakai teorema Pythagoras dengan menentukan hipotenusa lebih dulu.'),
      steps: [
        { name: L('Find the hypotenuse', 'Tentukan hipotenusa'), text: L('The hypotenuse is the side opposite the right angle and the longest side; call it c.', 'Hipotenusa adalah sisi di depan sudut siku-siku dan sisi terpanjang; namai c.') },
        { name: L('Write the equation', 'Tulis persamaannya'), text: L('Write a squared plus b squared equal to c squared with the known numbers.', 'Tulis a kuadrat ditambah b kuadrat sama dengan c kuadrat dengan bilangan yang diketahui.') },
        { name: L('Isolate the unknown square', 'Pisahkan kuadrat yang tidak diketahui'), text: L('Add or subtract to get the unknown square alone: for a leg, subtract the other leg squared from c squared.', 'Tambah atau kurangkan untuk mendapat kuadrat yang tidak diketahui sendirian: untuk sisi tegak, kurangkan kuadrat sisi tegak lainnya dari c kuadrat.') },
        { name: L('Take the square root', 'Tarik akar kuadrat'), text: L('Take the positive square root; for legs 9 and 12 the hypotenuse is the square root of 225, which is 15.', 'Tarik akar kuadrat positif; untuk sisi tegak 9 dan 12 hipotenusanya akar dari 225, yaitu 15.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is a triangle?', 'Apa itu segitiga?'),
      a: L(
        'A triangle is a polygon with three sides, three vertices and three interior angles. The angles always add up to 180 degrees. It is the simplest polygon, and any other polygon can be divided into triangles.',
        'Segitiga adalah poligon dengan tiga sisi, tiga titik sudut, dan tiga sudut dalam. Sudutnya selalu berjumlah 180 derajat. Ia poligon paling sederhana, dan poligon lain mana pun dapat dibagi menjadi segitiga.',
      ),
    },
    {
      q: L('What are the types of triangles?', 'Apa saja jenis-jenis segitiga?'),
      a: L(
        'By sides, a triangle is equilateral (three equal sides), isosceles (two equal sides) or scalene (no equal sides). By angles it is acute (all angles below 90 degrees), right (one angle of 90 degrees) or obtuse (one angle above 90 degrees).',
        'Menurut sisinya, segitiga adalah sama sisi (tiga sisi sama), sama kaki (dua sisi sama), atau sembarang (tidak ada sisi sama). Menurut sudutnya ia lancip (semua sudut di bawah 90 derajat), siku-siku (satu sudut 90 derajat), atau tumpul (satu sudut di atas 90 derajat).',
      ),
    },
    {
      q: L('Why do the angles of a triangle add up to 180 degrees?', 'Mengapa sudut segitiga berjumlah 180 derajat?'),
      a: L(
        'Draw a line through one vertex parallel to the opposite side. The alternate angles it makes equal the other two angles of the triangle, so all three angles sit together on a straight line, which measures 180 degrees.',
        'Gambar garis melalui satu titik sudut yang sejajar sisi di depannya. Sudut dalam berseberangan yang terbentuk sama dengan dua sudut lain segitiga, sehingga ketiga sudut berdampingan pada garis lurus, yang besarnya 180 derajat.',
      ),
    },
    {
      q: L('What is the Pythagorean theorem?', 'Apa itu teorema Pythagoras?'),
      a: L(
        'In a right triangle the square of the hypotenuse equals the sum of the squares of the two legs, a squared plus b squared equals c squared. For legs 3 and 4 the hypotenuse is 5. The converse is also true, so it can test for a right angle.',
        'Pada segitiga siku-siku kuadrat hipotenusa sama dengan jumlah kuadrat kedua sisi tegak, a kuadrat ditambah b kuadrat sama dengan c kuadrat. Untuk sisi tegak 3 dan 4 hipotenusanya 5. Kebalikannya juga benar, sehingga dapat dipakai menguji sudut siku-siku.',
      ),
    },
    {
      q: L('What is a Pythagorean triple?', 'Apa itu tripel Pythagoras?'),
      a: L(
        'It is a set of three whole numbers a, b and c with a squared plus b squared equal to c squared, such as 3, 4, 5 or 5, 12, 13. Euclid\'s formula m squared minus n squared, 2mn and m squared plus n squared produces them from two whole numbers m and n.',
        'Itu tiga bilangan bulat a, b, dan c dengan a kuadrat ditambah b kuadrat sama dengan c kuadrat, seperti 3, 4, 5 atau 5, 12, 13. Rumus Euclid m kuadrat dikurangi n kuadrat, 2mn, dan m kuadrat ditambah n kuadrat menghasilkannya dari dua bilangan bulat m dan n.',
      ),
    },
    {
      q: L('Can any three lengths form a triangle?', 'Dapatkah tiga panjang sembarang membentuk segitiga?'),
      a: L(
        'No. Each length must be shorter than the sum of the other two. The lengths 3, 4 and 5 work, but 1, 2 and 3 only make a flat line and 1, 2 and 4 cannot meet. This is the triangle inequality.',
        'Tidak. Setiap panjang harus lebih pendek daripada jumlah dua lainnya. Panjang 3, 4, dan 5 dapat, tetapi 1, 2, dan 3 hanya membentuk garis datar dan 1, 2, dan 4 tidak dapat bertemu. Inilah ketaksamaan segitiga.',
      ),
    },
    {
      q: L('How do you find the area of a triangle?', 'Bagaimana mencari luas segitiga?'),
      a: L(
        'Multiply the base by the height and divide by two. If you only know the three sides, use Heron\'s formula with the semiperimeter s, the square root of s times s minus a times s minus b times s minus c. For sides 13, 14 and 15 the area is 84.',
        'Kalikan alas dengan tinggi lalu bagi dua. Jika hanya tahu ketiga sisinya, pakai rumus Heron dengan setengah keliling s, akar dari s kali s dikurang a kali s dikurang b kali s dikurang c. Untuk sisi 13, 14, dan 15 luasnya 84.',
      ),
    },
    {
      q: L('How do you find the area of a triangle from coordinates?', 'Bagaimana mencari luas segitiga dari koordinat?'),
      a: L(
        'Take half the absolute value of x1 times y2 minus y3, plus x2 times y3 minus y1, plus x3 times y1 minus y2. For the vertices 0,0, 6,0 and 0,8 this gives half of 48, which is 24.',
        'Ambil setengah nilai mutlak dari x1 kali y2 dikurang y3, ditambah x2 kali y3 dikurang y1, ditambah x3 kali y1 dikurang y2. Untuk titik sudut 0,0, 6,0, dan 0,8 ini memberi setengah dari 48, yaitu 24.',
      ),
    },
    {
      q: L('What is the difference between a median and an altitude?', 'Apa beda garis berat dan garis tinggi?'),
      a: L(
        'A median goes from a vertex to the midpoint of the opposite side and splits that side in half. An altitude goes from a vertex perpendicular to the opposite side and measures the height. They are the same line only in an isosceles triangle, for the apex.',
        'Garis berat berjalan dari titik sudut ke titik tengah sisi di depannya dan membagi sisi itu menjadi dua. Garis tinggi berjalan dari titik sudut tegak lurus sisi di depannya dan mengukur tinggi. Keduanya garis yang sama hanya pada segitiga sama kaki, untuk puncaknya.',
      ),
    },
    {
      q: L('What are the centroid, circumcenter, orthocenter and incenter?', 'Apa itu titik berat, pusat lingkaran luar, titik tinggi, dan pusat lingkaran dalam?'),
      a: L(
        'They are the meeting points of the medians, the perpendicular bisectors, the altitudes and the angle bisectors. The first three lie on the Euler line, and the centroid is one third of the way from the circumcenter to the orthocenter. The incenter is the center of the inscribed circle.',
        'Itu titik temu garis berat, sumbu sisi, garis tinggi, dan garis bagi sudut. Tiga yang pertama terletak pada garis Euler, dan titik berat berada sepertiga dari pusat lingkaran luar menuju titik tinggi. Pusat lingkaran dalam adalah pusat lingkaran dalam segitiga.',
      ),
    },
    {
      q: L('How do you know if two triangles are congruent?', 'Bagaimana mengetahui dua segitiga kongruen?'),
      a: L(
        'Show that three suitable measurements match: all three sides (SSS), two sides and the angle between them (SAS), two angles and the side between them (ASA), two angles and another side (AAS), or the hypotenuse and a leg of right triangles (RHS). Side-side-angle is not enough.',
        'Tunjukkan bahwa tiga ukuran yang sesuai sama: ketiga sisi (SSS), dua sisi dan sudut di antaranya (SAS), dua sudut dan sisi di antaranya (ASA), dua sudut dan sisi lain (AAS), atau hipotenusa dan satu sisi tegak segitiga siku-siku (RHS). Sisi-sisi-sudut tidak cukup.',
      ),
    },
    {
      q: L('What is the law of cosines?', 'Apa itu aturan kosinus?'),
      a: L(
        'It says that c squared equals a squared plus b squared minus 2ab times the cosine of the angle C between sides a and b. It extends the Pythagorean theorem to every triangle, because for a right angle the cosine is zero.',
        'Aturan ini menyatakan bahwa c kuadrat sama dengan a kuadrat ditambah b kuadrat dikurangi 2ab kali kosinus sudut C di antara sisi a dan b. Ia memperluas teorema Pythagoras ke setiap segitiga, karena untuk sudut siku-siku kosinusnya nol.',
      ),
    },
    {
      q: L('Why can two sides and an angle make two triangles?', 'Mengapa dua sisi dan satu sudut dapat membentuk dua segitiga?'),
      a: L(
        'When the angle is opposite one of the two given sides, the law of sines gives a sine, and two different angles share it: an acute one and its supplement. If both leave a positive third angle, two triangles fit. This is the ambiguous SSA case.',
        'Bila sudutnya berada di depan salah satu dari dua sisi yang diketahui, aturan sinus memberi sebuah sinus, dan dua sudut berbeda memilikinya: satu lancip dan pelurusnya. Jika keduanya menyisakan sudut ketiga positif, dua segitiga cocok. Inilah kasus SSA yang ambigu.',
      ),
    },
    {
      q: L('How do you classify a triangle in Python?', 'Bagaimana mengklasifikasikan segitiga di Python?'),
      a: L(
        'Sort the three sides, check that the two shorter ones add up to more than the longest, then compare the square of the longest with the sum of the other two squares using integers. Avoid comparing square roots as floats, which can differ by rounding.',
        'Urutkan ketiga sisi, periksa bahwa dua sisi yang lebih pendek berjumlah lebih dari yang terpanjang, lalu bandingkan kuadrat yang terpanjang dengan jumlah dua kuadrat lainnya memakai bilangan bulat. Hindari membandingkan akar sebagai float, yang dapat berbeda karena pembulatan.',
      ),
    },
  ],

  references: [
    { title: 'The Thirteen Books of Euclid\'s Elements (2nd ed.), Book I, propositions 20, 32, 47 and 48, and Book II, propositions 12 and 13', author: 'Thomas L. Heath (translator)', year: 1908, source: 'Cambridge University Press' },
    { title: 'The Pythagorean Theorem: A 4,000-Year History', author: 'Eli Maor', year: 2007, source: 'Princeton University Press' },
    { title: 'Mathematical Cuneiform Texts (the tablet Plimpton 322)', author: 'Otto Neugebauer and Abraham Sachs', year: 1945, source: 'American Oriental Society' },
    { title: 'Geometry Revisited, chapters 1 and 5 (the Euler line and the nine-point circle)', author: 'H. S. M. Coxeter and Samuel L. Greitzer', year: 1967, source: 'Mathematical Association of America' },
    { title: 'Miscalculating Area and Angles of a Needle-like Triangle', author: 'William Kahan', year: 2014, source: 'University of California, Berkeley, lecture notes' },
    { title: 'The Python Standard Library: math, mathematical functions', author: 'Python Software Foundation', source: 'docs.python.org', url: 'https://docs.python.org/3/library/math.html' },
  ],

  related: ['quadrilaterals', 'circles', 'irrational-numbers', 'exponents-and-radicals'],
}
