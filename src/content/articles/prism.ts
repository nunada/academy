import type { Figure } from '../../lib/figure'
import type { Loc } from '../types'
import type { ArticleBlock, ArticleBody } from './types'
import { meta } from './prism.meta'

export { meta }

const L = (en: string, id: string): Loc => ({ en, id })

/** Prose is written between backticks with its TeX unescaped; the code marker
 *  inside it is ´ rather than a backtick, and `*word*` emphasis is dropped.
 *  `[words](article:id#section)` is a link to another article. Values may be
 *  put in with ${...}: they are taken as they are, so TeX in them is not escaped. */
const T = (s: TemplateStringsArray, ...v: string[]): string =>
  String.raw({ raw: s.raw }, ...v)
    .replace(/´([^´\n]+)´/g, '`$1`')
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '$1')
    .replace(/^\s+|\s+$/g, '')

/** A static drawing on a plain canvas: the figure items are the only things in it, with no sliders and nothing to drag. The labels inside a drawing are
 *  letters, numbers and symbols, which read the same in both languages; the words are in the caption. */
const fig = (f: Omit<Figure, 'dim' | 'axes'>): ArticleBlock => {
  const aspect = f.aspect ?? (f.xSpan && f.ySpan ? Math.min(3, Math.max(0.5, 460 / (52 + (460 - 52) * ((f.ySpan[1] - f.ySpan[0]) / (f.xSpan[1] - f.xSpan[0]))))) : 1)
  return { kind: 'figure', figure: { dim: 2, axes: false, ...f, aspect } }
}

/** A rectangle of the net, with its corners given as the lower left and the upper right. */
const rect = (x0: number, y0: number, x1: number, y1: number): [number, number][] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/* ------------------------------------------------------------------------------- the figures */

/** The net of the right prism on the 3-4-5 triangle with height 5: three rectangles in a row (15, 20, 25) and a triangle on each side of the middle one. */
const FIG_NET: ArticleBlock = fig({
  range: 1,
  xSpan: [-0.3, 12.3],
  ySpan: [-3.3, 8.3],
  items: [
    { t: 'poly', pts: rect(0, 0, 3, 5), color: 'a', look: 'solid' },
    { t: 'poly', pts: rect(3, 0, 7, 5), color: 'b', look: 'solid' },
    { t: 'poly', pts: rect(7, 0, 12, 5), color: 'c', look: 'solid' },
    { t: 'poly', pts: [[3, 5], [7, 5], [3, 8]], color: 'result', look: 'solid' },
    { t: 'poly', pts: [[3, 0], [7, 0], [3, -3]], color: 'result', look: 'solid' },
    { t: 'text', at: [1.5, 2.35], text: '15', size: 'lg', color: 'result' },
    { t: 'text', at: [5, 2.35], text: '20', size: 'lg', color: 'result' },
    { t: 'text', at: [9.5, 2.35], text: '25', size: 'lg', color: 'result' },
    { t: 'text', at: [4.3, 5.9], text: '6', size: 'lg', color: 'result' },
    { t: 'text', at: [4.3, -1.5], text: '6', size: 'lg', color: 'result' },
  ],
  caption: L(
    T`The net of the prism whose base is a $3$-$4$-$5$ right triangle and whose height is $5$: the three side faces are rectangles $3\times5$, $4\times5$ and $5\times5$, with areas $15$, $20$ and $25$, laid in a row; the two bases are triangles of area $6$. The row is $12$ long and $5$ high, so its area is $12\cdot5=60$, the perimeter of the base times the height. All together $60+6+6=72$.`,
    T`Jaring-jaring prisma yang alasnya segitiga siku-siku $3$-$4$-$5$ dan tingginya $5$: ketiga sisi tegak adalah persegi panjang $3\times5$, $4\times5$, dan $5\times5$ dengan luas $15$, $20$, dan $25$, yang dijajarkan dalam satu baris; kedua alas adalah segitiga seluas $6$. Barisnya sepanjang $12$ dan setinggi $5$, jadi luasnya $12\cdot5=60$, keliling alas kali tinggi. Seluruhnya $60+6+6=72$.`,
  ),
})

/** The right prism on the 3-4-5 triangle with height 5, for turning. */
const FIG_PRISM: ArticleBlock = {
  kind: 'figure',
  figure: {
    dim: 3,
    range: 5,
    interactive: true,
    view: [34, 22],
    items: [
      { t: 'poly', pts: [[0, 0, 0], [4, 0, 0], [0, 3, 0]], color: 'a', look: 'solid' },
      { t: 'poly', pts: [[0, 0, 5], [4, 0, 5], [0, 3, 5]], color: 'b', look: 'solid' },
      { t: 'seg', from: [0, 0, 0], to: [0, 0, 5], color: 'result', width: 3, label: 'h' },
      { t: 'seg', from: [4, 0, 0], to: [4, 0, 5], color: 'muted' },
      { t: 'seg', from: [0, 3, 0], to: [0, 3, 5], color: 'muted' },
    ],
    caption: L(
      T`Turn the prism on the $3$-$4$-$5$ triangle. Two identical triangles, the bases, lie in parallel planes; three rectangles join their sides; and the three edges between the bases are equal and parallel, each as long as the height $h=5$. It has $5$ faces, $9$ edges and $6$ corners.`,
      T`Putar prisma pada segitiga $3$-$4$-$5$. Dua segitiga yang sama, yaitu alas dan tutup, terletak pada bidang sejajar; tiga persegi panjang menghubungkan sisi-sisinya; dan ketiga rusuk di antara alas dan tutup sama dan sejajar, masing-masing sepanjang tinggi $h=5$. Prisma ini memiliki $5$ sisi, $9$ rusuk, dan $6$ titik sudut.`,
    ),
  },
}

/** An oblique prism: the 4 × 3 rectangle carried by (3, 0, 4), so the edge is 5 long and the height is 4. */
const OBLIQUE_BASE: [number, number, number][] = [[0, 0, 0], [4, 0, 0], [4, 3, 0], [0, 3, 0]]
const OBLIQUE_SHIFT: [number, number, number] = [3, 0, 4]
const FIG_OBLIQUE: ArticleBlock = {
  kind: 'figure',
  figure: {
    dim: 3,
    range: 5,
    interactive: true,
    view: [30, 20],
    items: [
      { t: 'poly', pts: OBLIQUE_BASE, color: 'a', look: 'solid' },
      { t: 'poly', pts: OBLIQUE_BASE.map(([x, y, z]): [number, number, number] => [x + OBLIQUE_SHIFT[0], y + OBLIQUE_SHIFT[1], z + OBLIQUE_SHIFT[2]]), color: 'b', look: 'solid' },
      ...OBLIQUE_BASE.map(([x, y, z], i) => ({
        t: 'seg' as const,
        from: [x, y, z] as [number, number, number],
        to: [x + OBLIQUE_SHIFT[0], y + OBLIQUE_SHIFT[1], z + OBLIQUE_SHIFT[2]] as [number, number, number],
        color: i === 0 ? ('result' as const) : ('muted' as const),
        width: i === 0 ? 3 : 2,
        label: i === 0 ? 'e' : undefined,
      })),
      { t: 'seg', from: [3, 0, 4], to: [3, 0, 0], color: 'b', dashed: true, width: 2, label: 'h' },
    ],
    caption: L(
      T`An oblique prism: the $4\times3$ rectangle carried $3$ to the side and $4$ up. The edge $e=\sqrt{3^2+4^2}=5$ is longer than the height $h=4$, which is measured straight up between the planes of the bases. The volume is $12\cdot4=48$, as for the upright prism; the lateral area is $62$, not $56$.`,
      T`Prisma miring: persegi panjang $4\times3$ digeser $3$ ke samping dan $4$ ke atas. Rusuk tegak $e=\sqrt{3^2+4^2}=5$ lebih panjang daripada tinggi $h=4$, yang diukur lurus ke atas di antara bidang alas dan tutup. Volumenya $12\cdot4=48$, sama dengan prisma tegak; luas selimutnya $62$, bukan $56$.`,
    ),
  },
}

/* ------------------------------------------------------------------------------------ the body */

export const body: ArticleBody = {
  answer: L(
    T`**A prism is a solid with two identical parallel polygons as bases, joined by parallelogram faces; its volume is the base area times the perpendicular height, $V=Bh$, and the surface of an upright one is $S=2B+Ph$.** A base with $n$ sides gives $n+2$ faces, $3n$ edges and $2n$ corners. A prism that leans keeps the volume of the upright prism, and a glass prism bends light towards its base.`,
    T`**Prisma adalah bangun ruang dengan dua poligon sejajar yang sama sebagai alas dan tutup, dihubungkan oleh sisi-sisi berbentuk jajar genjang; volumenya luas alas kali tinggi tegak lurus, $V=L_a\,t$, dan luas permukaan prisma tegak adalah $L_p=2L_a+Kt$.** Alas dengan $n$ sisi menghasilkan $n+2$ sisi, $3n$ rusuk, dan $2n$ titik sudut. Prisma yang miring tetap bervolume sama dengan prisma tegak, dan prisma kaca membelokkan cahaya ke arah alasnya.`,
  ),

  keyPoints: [
    L(
      T`A prism has two *bases*, identical polygons in parallel planes, and *lateral faces* that are parallelograms (rectangles when the prism is upright). It is named by its base: triangular, square, pentagonal, hexagonal prism. A *right* prism stands straight; an *oblique* prism leans.`,
      T`Prisma memiliki dua *alas*, poligon yang sama pada bidang sejajar, dan *sisi tegak* berbentuk jajar genjang (persegi panjang bila prisma tegak). Ia dinamai menurut alasnya: prisma segitiga, persegi, segilima, segienam. Prisma *tegak* berdiri lurus; prisma *miring* condong.`,
    ),
    L(
      T`Volume $V=Bh$, the area of the base times the height measured at right angles to the bases. This holds for every prism, upright or leaning, because of Cavalieri’s principle: every slice parallel to the base has the same area $B$.`,
      T`Volume $V=L_a\,t$, luas alas kali tinggi yang diukur tegak lurus pada alas. Ini berlaku untuk setiap prisma, tegak maupun miring, karena prinsip Cavalieri: setiap irisan yang sejajar dengan alas berluas $L_a$.`,
    ),
    L(
      T`Surface area $S=2B+\text{lateral area}$. For a right prism the lateral area is $Ph$, the perimeter of the base times the height, because the net of the side faces is one rectangle $P\times h$. For an oblique prism it is $P_s\,e$, the perimeter of the cross-section at right angles to the edges times the length $e$ of an edge.`,
      T`Luas permukaan $L_p=2L_a+\text{luas selimut}$. Untuk prisma tegak luas selimutnya $Kt$, keliling alas kali tinggi, karena jaring-jaring sisi tegaknya satu persegi panjang $K\times t$. Untuk prisma miring luas selimutnya $K_s\,e$, keliling irisan yang tegak lurus pada rusuk dikali panjang rusuk $e$.`,
    ),
    L(
      T`A prism on an $n$-gon has $2n$ vertices, $3n$ edges and $n+2$ faces, and $2n-3n+(n+2)=2$ for every $n$: Euler’s number of a solid without holes. A right prism on a regular $n$-gon has $n(n-3)$ space diagonals, none when $n=3$.`,
      T`Prisma pada segi-$n$ memiliki $2n$ titik sudut, $3n$ rusuk, dan $n+2$ sisi, dan $2n-3n+(n+2)=2$ untuk setiap $n$: bilangan Euler untuk bangun ruang tanpa lubang. Prisma tegak pada segi-$n$ beraturan memiliki $n(n-3)$ diagonal ruang, tidak ada bila $n=3$.`,
    ),
    L(
      T`Give the base more and more sides inside a fixed circle and the prism closes in on the cylinder: the base area is the fraction $\frac{n}{2\pi}\sin\frac{2\pi}{n}$ of the circle, which climbs to $1$.`,
      T`Beri alas makin banyak sisi di dalam lingkaran yang tetap, dan prisma mendekati tabung: luas alasnya adalah bagian $\frac{n}{2\pi}\sin\frac{2\pi}{n}$ dari lingkaran, yang naik menuju $1$.`,
    ),
    L(
      T`A glass prism of apex angle $A$ and refractive index $n$ turns a ray by $D=i+e-A$, at least $D_{\min}=2\arcsin\!\left(n\sin\frac A2\right)-A$. Violet light has a larger $n$ than red, so it is turned more, and white light spreads into a spectrum.`,
      T`Prisma kaca bersudut puncak $A$ dan indeks bias $n$ membelokkan sinar sebesar $D=i+e-A$, paling sedikit $D_{\min}=2\arcsin\!\left(n\sin\frac A2\right)-A$. Cahaya ungu memiliki $n$ lebih besar daripada merah, sehingga dibelokkan lebih banyak, dan cahaya putih tersebar menjadi spektrum.`,
    ),
  ],

  sections: [
    /* ---------------------------------------------------------------------------------- what */
    {
      id: 'what-is-a-prism',
      heading: L('What is a prism in geometry, and what are its parts and types?', 'Apa itu prisma dalam geometri, dan apa saja bagian serta jenisnya?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A prism is a polyhedron with two faces that are identical polygons lying in parallel planes, the *bases*, and all its other faces parallelograms, the *lateral faces*.** Slide a polygon along a straight line that is not in its plane, and the solid it sweeps out is a prism: this is what the “extrude” button of every drawing program does. The edges between the bases are the *lateral edges*; they are parallel and equal. The *height* $h$ is the distance between the planes of the two bases, measured at right angles to them.

A prism is named by its base. With a triangle as base it is a *triangular prism*, with a square a *square prism*, then the *pentagonal*, *hexagonal* and *octagonal* prisms, and so on. Two more words describe how it stands:

| Kind | What it looks like | Lateral faces |
|---|---|---|
| right prism (*prisma tegak*) | the lateral edges stand at right angles to the bases | rectangles |
| oblique prism (*prisma miring*) | the lateral edges lean | parallelograms |
| regular prism | a right prism whose base is a regular polygon | identical rectangles |

Two familiar solids are prisms. The [cuboid](article:cuboid#what-is-a-cuboid), or box, is a right prism whose base is a rectangle, and the [cube](article:cube#what-is-a-cube) is the one whose base is a square and whose height equals its side. A prism is not a pyramid, whose faces meet at one point, and not a cylinder, which has curved sides: it is a polyhedron, every face of which is flat.

*Prism or not?* Two checks decide it: the two bases must be identical and parallel, and every other face must be a parallelogram. A roof shaped like a tent with triangular ends passes both and is a triangular prism lying on its side; a pyramid fails the first, a cone and a cylinder the second.`,
            T`**Prisma adalah poliedron dengan dua sisi berupa poligon yang sama pada bidang sejajar, yaitu *alas* dan *tutup*, dan semua sisi lainnya berupa jajar genjang, yaitu *sisi tegak*.** Geser sebuah poligon sepanjang garis lurus yang tidak terletak pada bidangnya, dan bangun yang disapunya adalah prisma: inilah yang dilakukan tombol “extrude” pada setiap program gambar. Rusuk di antara alas dan tutup disebut *rusuk tegak*; rusuk-rusuk itu sejajar dan sama panjang. *Tinggi* $t$ adalah jarak antara bidang alas dan tutup, diukur tegak lurus pada keduanya.

Prisma dinamai menurut alasnya. Dengan segitiga sebagai alas ia *prisma segitiga*, dengan persegi *prisma persegi*, lalu prisma *segilima*, *segienam*, dan *segidelapan*, dan seterusnya. Dua kata lagi menjelaskan cara ia berdiri:

| Jenis | Bentuknya | Sisi tegak |
|---|---|---|
| prisma tegak (*right prism*) | rusuk tegak berdiri tegak lurus pada alas | persegi panjang |
| prisma miring (*oblique prism*) | rusuk tegak condong | jajar genjang |
| prisma beraturan | prisma tegak dengan alas segi banyak beraturan | persegi panjang yang kongruen |

Dua bangun yang kamu kenal adalah prisma. [Balok](article:cuboid#what-is-a-cuboid) adalah prisma tegak dengan alas persegi panjang, dan [kubus](article:cube#what-is-a-cube) adalah yang alasnya persegi dan tingginya sama dengan sisinya. Prisma bukan limas, yang sisinya bertemu di satu titik, dan bukan tabung, yang sisinya melengkung: ia adalah poliedron, setiap sisinya datar.

*Prisma atau bukan?* Dua pemeriksaan menentukannya: kedua alas harus sama dan sejajar, dan setiap sisi lainnya harus jajar genjang. Atap berbentuk tenda dengan ujung segitiga lolos keduanya dan merupakan prisma segitiga yang rebah; limas gagal pada yang pertama, kerucut dan tabung pada yang kedua.`,
          ),
        },
        FIG_PRISM,
      ],
    },

    /* ------------------------------------------------------------- volume and surface */
    {
      id: 'volume-and-surface',
      heading: L('How do you find the volume and the surface area of a prism?', 'Bagaimana mencari volume dan luas permukaan prisma?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The volume of a prism is the area of its base times its height, $V=Bh$, and the surface area of a right prism is $S=2B+Ph$, two bases plus the lateral area, where $P$ is the perimeter of the base.** The volume formula is the layer idea: cut the prism into thin slices parallel to the bases; every slice is a copy of the base, with area $B$, and there is a height $h$ of them. For the prism on the $3$-$4$-$5$ triangle with height $5$ the base has area $\frac12\cdot3\cdot4=6$, so $V=6\cdot5=30$.

The surface comes from the net. Unfold a right prism and the side faces make one long rectangle, as wide as the perimeter $P$ of the base and as high as $h$, so the lateral area is $Ph$. Add the two bases: $S=2B+Ph$. For the same prism $P=3+4+5=12$, so the lateral area is $12\cdot5=60$ and $S=2\cdot6+60=72$, which the net below shows face by face: $15+20+25+6+6$.

| Shape of the base | Base area $B$ | Perimeter $P$ |
|---|---|---|
| triangle, base $b$ and height $a$ | $\frac12ba$ | sum of the three sides |
| rectangle $l\times w$ | $lw$ | $2(l+w)$ |
| regular $n$-gon, side $s$ | $\dfrac{ns^2}{4\tan(\pi/n)}$ | $ns$ |
| regular hexagon, side $s$ | $\dfrac{3\sqrt3}{2}s^2$ | $6s$ |

*Everyday uses.* A water trough with a triangular cross-section $60$ cm wide and $40$ cm deep and $2$ m long is a prism lying on its side: the base has area $\frac12\cdot60\cdot40=1200$ cm², the height is $200$ cm, and it holds $240\,000$ cm³, which is $240$ litres. A hexagonal pencil of side $4$ mm and length $17$ cm has a base of area $\frac{3\sqrt3}{2}\cdot4^2\approx41.6$ mm².

The widget builds any of these prisms; the second one unfolds it into its net.`,
            T`**Volume prisma adalah luas alas kali tingginya, $V=L_a\,t$, dan luas permukaan prisma tegak adalah $L_p=2L_a+Kt$, dua alas ditambah luas selimut, dengan $K$ keliling alas.** Rumus volume berasal dari gagasan lapisan: potong prisma menjadi irisan tipis yang sejajar dengan alas; setiap irisan adalah salinan alas, berluas $L_a$, dan ada setinggi $t$ banyaknya. Untuk prisma pada segitiga $3$-$4$-$5$ dengan tinggi $5$, alasnya berluas $\frac12\cdot3\cdot4=6$, jadi $V=6\cdot5=30$.

Luas permukaan berasal dari jaring-jaring. Bentangkan prisma tegak dan sisi-sisi tegaknya membentuk satu persegi panjang yang panjang, selebar keliling alas $K$ dan setinggi $t$, jadi luas selimutnya $Kt$. Tambahkan kedua alas: $L_p=2L_a+Kt$. Untuk prisma yang sama $K=3+4+5=12$, jadi luas selimutnya $12\cdot5=60$ dan $L_p=2\cdot6+60=72$, yang ditunjukkan jaring-jaring di bawah muka demi muka: $15+20+25+6+6$.

| Bentuk alas | Luas alas $L_a$ | Keliling $K$ |
|---|---|---|
| segitiga, alas $b$ dan tinggi $a$ | $\frac12ba$ | jumlah ketiga sisi |
| persegi panjang $p\times l$ | $pl$ | $2(p+l)$ |
| segi-$n$ beraturan, sisi $s$ | $\dfrac{ns^2}{4\tan(\pi/n)}$ | $ns$ |
| segienam beraturan, sisi $s$ | $\dfrac{3\sqrt3}{2}s^2$ | $6s$ |

*Pemakaian sehari-hari.* Palung air dengan penampang segitiga selebar $60$ cm dan sedalam $40$ cm serta sepanjang $2$ m adalah prisma yang rebah: alasnya berluas $\frac12\cdot60\cdot40=1200$ cm², tingginya $200$ cm, dan ia memuat $240.000$ cm³, yaitu $240$ liter. Pensil segienam bersisi $4$ mm dan panjang $17$ cm beralas seluas $\frac{3\sqrt3}{2}\cdot4^2\approx41{,}6$ mm².

Widget membangun prisma apa pun di antaranya; yang kedua membukanya menjadi jaring-jaring.`,
          ),
        },
        { kind: 'widget', name: 'prbuild' },
        FIG_NET,
        { kind: 'widget', name: 'prnet' },
      ],
    },

    /* ------------------------------------------------------------ faces, edges, diagonals */
    {
      id: 'faces-edges-diagonals',
      heading: L('How many faces, edges and vertices does a prism have, and what are its diagonals?', 'Berapa sisi, rusuk, dan titik sudut prisma, dan apa saja diagonalnya?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A prism whose base has $n$ sides has $n+2$ faces, $3n$ edges and $2n$ vertices.** The faces are the two bases and $n$ lateral faces; the edges are the $n$ sides of each base, $2n$ in all, and the $n$ lateral edges; the vertices are the $n$ corners of each base. They satisfy Euler’s formula,
$$V-E+F=2n-3n+(n+2)=2,$$
whatever $n$ is, as for every solid without holes.

| Prism | Faces | Edges | Vertices |
|---|---|---|---|
| triangular ($n=3$) | $5$ | $9$ | $6$ |
| cuboid ($n=4$) | $6$ | $12$ | $8$ |
| pentagonal ($n=5$) | $7$ | $15$ | $10$ |
| hexagonal ($n=6$) | $8$ | $18$ | $12$ |
| octagonal ($n=8$) | $10$ | $24$ | $16$ |

*Diagonals of a right prism on a regular base with side $s$ and height $h$.* A side face is a rectangle $s\times h$ with diagonal $\sqrt{s^2+h^2}$. A *space diagonal* joins two corners that share no face: a corner of one base and a corner of the other that is not the one straight above it nor one of its two neighbours. From each corner there are $n-3$ of them, so $n(n-3)$ in all; a triangular prism has none, and a cuboid has $4$. If $R=\dfrac{s}{2\sin(\pi/n)}$ is the radius of the circle through the corners of the base, the space diagonal that skips $k$ places round has length
$$d_k=\sqrt{h^2+\left(2R\sin\frac{k\pi}{n}\right)^2},\qquad 2\le k\le\frac n2.$$

*Worked example.* The hexagonal prism with $s=2$ and $h=5$ has $R=2$, base area $6\sqrt3\approx10.392$, volume $30\sqrt3\approx51.962$, lateral area $12\cdot5=60$ and surface $12\sqrt3+60\approx80.785$. It has $6\cdot3=18$ space diagonals, in two lengths: $d_2=\sqrt{25+12}=\sqrt{37}\approx6.083$ (twelve of them) and $d_3=\sqrt{25+16}=\sqrt{41}\approx6.403$ (six, through the centre).`,
            T`**Prisma yang alasnya memiliki $n$ sisi memiliki $n+2$ sisi, $3n$ rusuk, dan $2n$ titik sudut.** Sisinya adalah alas dan tutup serta $n$ sisi tegak; rusuknya adalah $n$ sisi tiap alas, seluruhnya $2n$, dan $n$ rusuk tegak; titik sudutnya adalah $n$ sudut tiap alas. Banyaknya memenuhi rumus Euler,
$$V-E+F=2n-3n+(n+2)=2,$$
berapa pun $n$, seperti pada setiap bangun ruang tanpa lubang.

| Prisma | Sisi | Rusuk | Titik sudut |
|---|---|---|---|
| segitiga ($n=3$) | $5$ | $9$ | $6$ |
| balok ($n=4$) | $6$ | $12$ | $8$ |
| segilima ($n=5$) | $7$ | $15$ | $10$ |
| segienam ($n=6$) | $8$ | $18$ | $12$ |
| segidelapan ($n=8$) | $10$ | $24$ | $16$ |

*Diagonal prisma tegak pada alas beraturan dengan sisi $s$ dan tinggi $t$.* Sisi tegak adalah persegi panjang $s\times t$ dengan diagonal $\sqrt{s^2+t^2}$. *Diagonal ruang* menghubungkan dua titik sudut yang tidak berbagi sisi: sebuah sudut pada satu alas dan sebuah sudut pada alas lain yang bukan tepat di atasnya dan bukan salah satu dari dua tetangganya. Dari setiap titik sudut ada $n-3$ di antaranya, jadi seluruhnya $n(n-3)$; prisma segitiga tidak punya, dan balok punya $4$. Bila $R=\dfrac{s}{2\sin(\pi/n)}$ adalah jari-jari lingkaran yang melalui sudut-sudut alas, diagonal ruang yang melompati $k$ tempat memiliki panjang
$$d_k=\sqrt{t^2+\left(2R\sin\frac{k\pi}{n}\right)^2},\qquad 2\le k\le\frac n2.$$

*Contoh.* Prisma segienam dengan $s=2$ dan $t=5$ memiliki $R=2$, luas alas $6\sqrt3\approx10{,}392$, volume $30\sqrt3\approx51{,}962$, luas selimut $12\cdot5=60$, dan luas permukaan $12\sqrt3+60\approx80{,}785$. Ia memiliki $6\cdot3=18$ diagonal ruang, dalam dua panjang: $d_2=\sqrt{25+12}=\sqrt{37}\approx6{,}083$ (dua belas) dan $d_3=\sqrt{25+16}=\sqrt{41}\approx6{,}403$ (enam, melalui pusat).`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------------- oblique */
    {
      id: 'oblique-prism',
      heading: L('Why does a leaning prism have the same volume as an upright one?', 'Mengapa prisma miring bervolume sama dengan prisma tegak?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**An oblique prism has the volume $V=Bh$ with $h$ the perpendicular height, the same as an upright prism on the same base, because of Cavalieri’s principle: two solids of the same height whose slices at every level have equal areas have equal volumes.** Think of a deck of cards pushed sideways into a leaning stack: no card changes, the height does not change, and the volume does not either. Each slice of a prism parallel to its bases is a copy of the base, so $B$ at every level, whether the prism leans or not.

What does change is the lateral area, because the side faces are no longer rectangles. Each is a parallelogram with the lateral edge $e$ as one side, and its area is $e$ times the width of the face measured at right angles to $e$. Those widths are the sides of the *right section*, the cross-section cut at right angles to the lateral edges, so
$$\text{lateral area}=P_s\,e,$$
where $P_s$ is the perimeter of the right section. For an upright prism the right section is the base itself and $e=h$, which gives $Ph$ again.

*Worked example.* Carry the $4\times3$ rectangle $3$ to the side and $4$ up. The edge is $e=\sqrt{3^2+4^2}=5$ and the height is $4$, so $V=12\cdot4=48$, the same as the upright box. The four side faces are parallelograms of area $16$, $15$, $16$ and $15$, so the lateral area is $62$ and the surface is $24+62=86$; the upright box has $14\cdot4=56$ and $80$. The right section has perimeter $\frac{62}{5}=12.4$, which times $e=5$ gives $62$ again. In general a prism that leans has a larger lateral area than the upright one with the same base and height.`,
            T`**Prisma miring bervolume $V=L_a\,t$ dengan $t$ tinggi tegak lurus, sama dengan prisma tegak pada alas yang sama, karena prinsip Cavalieri: dua bangun yang sama tingginya, yang irisannya pada setiap tingkat berluas sama, bervolume sama.** Bayangkan setumpuk kartu yang didorong ke samping menjadi tumpukan yang miring: tak satu kartu pun berubah, tingginya tidak berubah, dan volumenya juga tidak. Setiap irisan prisma yang sejajar dengan alas adalah salinan alas, jadi $L_a$ pada setiap tingkat, miring atau tidak.

Yang berubah adalah luas selimut, karena sisi tegak tidak lagi persegi panjang. Tiap sisi adalah jajar genjang dengan rusuk tegak $e$ sebagai satu sisinya, dan luasnya $e$ kali lebar sisi itu yang diukur tegak lurus pada $e$. Lebar-lebar itu adalah sisi-sisi *irisan tegak lurus*, irisan yang dipotong tegak lurus pada rusuk tegak, sehingga
$$\text{luas selimut}=K_s\,e,$$
dengan $K_s$ keliling irisan tegak lurus itu. Untuk prisma tegak irisan tegak lurusnya adalah alas itu sendiri dan $e=t$, yang memberi $Kt$ lagi.

*Contoh.* Geser persegi panjang $4\times3$ sejauh $3$ ke samping dan $4$ ke atas. Rusuk tegaknya $e=\sqrt{3^2+4^2}=5$ dan tingginya $4$, jadi $V=12\cdot4=48$, sama dengan balok tegak. Keempat sisi tegaknya jajar genjang seluas $16$, $15$, $16$, dan $15$, jadi luas selimutnya $62$ dan luas permukaannya $24+62=86$; balok tegaknya $14\cdot4=56$ dan $80$. Irisan tegak lurus berkeliling $\frac{62}{5}=12{,}4$, yang dikali $e=5$ memberi $62$ lagi. Secara umum prisma yang miring memiliki luas selimut lebih besar daripada prisma tegak dengan alas dan tinggi yang sama.`,
          ),
        },
        FIG_OBLIQUE,
      ],
    },

    /* ---------------------------------------------------------------------------- cylinder */
    {
      id: 'towards-the-cylinder',
      heading: L('How does a prism turn into a cylinder when the base gets more and more sides?', 'Bagaimana prisma berubah menjadi tabung saat alasnya makin banyak sisi?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A prism on a regular $n$-gon inscribed in a circle of radius $r$ approaches the cylinder of radius $r$ and the same height as $n$ grows, because the polygon fills more and more of the circle.** The regular $n$-gon inscribed in the circle is made of $n$ triangles with two sides $r$ and the angle $\frac{2\pi}{n}$ between them, so its area is $\frac n2r^2\sin\frac{2\pi}{n}$ and its perimeter $2nr\sin\frac\pi n$. Against the circle, whose area is $\pi r^2$, the polygon has the fraction
$$\frac{n}{2\pi}\sin\frac{2\pi}{n}\;\longrightarrow\;1\quad(n\to\infty),$$
since $\frac{\sin x}{x}\to1$ as $x\to0$.

| $n$ | $3$ | $4$ | $6$ | $12$ | $100$ |
|---|---|---|---|---|---|
| area of the base as a share of the circle | $0.4135$ | $0.6366$ | $0.8270$ | $0.9549$ | $0.9993$ |

The volume $\frac n2r^2h\sin\frac{2\pi}n$ then climbs to $\pi r^2h$, and the lateral area $2nrh\sin\frac\pi n$ to $2\pi rh$. So the formula of the cylinder, base area times height, is the formula of the prism with the polygon replaced by its limit; this is how the area of a circle, the volume of a cylinder and the numbers $\pi r^2h$ and $2\pi rh$ are connected to the prism. The same idea is used the other way round: a rounded solid is drawn by a computer as a prism with many sides.`,
            T`**Prisma pada segi-$n$ beraturan yang terletak di dalam lingkaran berjari-jari $r$ mendekati tabung berjari-jari $r$ dengan tinggi yang sama saat $n$ bertambah, karena poligon itu memenuhi makin banyak bagian lingkaran.** Segi-$n$ beraturan di dalam lingkaran terdiri atas $n$ segitiga dengan dua sisi $r$ dan sudut $\frac{2\pi}{n}$ di antaranya, sehingga luasnya $\frac n2r^2\sin\frac{2\pi}{n}$ dan kelilingnya $2nr\sin\frac\pi n$. Dibandingkan dengan lingkaran, yang luasnya $\pi r^2$, poligon itu memiliki bagian
$$\frac{n}{2\pi}\sin\frac{2\pi}{n}\;\longrightarrow\;1\quad(n\to\infty),$$
karena $\frac{\sin x}{x}\to1$ saat $x\to0$.

| $n$ | $3$ | $4$ | $6$ | $12$ | $100$ |
|---|---|---|---|---|---|
| luas alas sebagai bagian lingkaran | $0{,}4135$ | $0{,}6366$ | $0{,}8270$ | $0{,}9549$ | $0{,}9993$ |

Volume $\frac n2r^2t\sin\frac{2\pi}n$ lalu naik menuju $\pi r^2t$, dan luas selimut $2nrt\sin\frac\pi n$ menuju $2\pi rt$. Jadi rumus tabung, luas alas kali tinggi, adalah rumus prisma dengan poligon diganti batasnya; beginilah luas lingkaran, volume tabung, dan bilangan $\pi r^2t$ serta $2\pi rt$ terhubung dengan prisma. Gagasan yang sama dipakai dengan arah sebaliknya: bangun yang membulat digambar komputer sebagai prisma dengan banyak sisi.`,
          ),
        },
        { kind: 'widget', name: 'prcyl' },
      ],
    },

    /* ------------------------------------------------------------------------------ optics */
    {
      id: 'light-and-the-glass-prism',
      heading: L('How does a glass prism bend and split light?', 'Bagaimana prisma kaca membelokkan dan menguraikan cahaya?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A glass prism bends a ray of light towards its base by the angle $D=i+e-A$, where $A$ is the apex angle between the two faces the light crosses, $i$ the angle at which it arrives and $e$ the angle at which it leaves.** At each face Snell’s law holds, $\sin i=n\sin r_1$ on the way in and $\sin e=n\sin r_2$ on the way out, with $n$ the refractive index of the glass; and the triangle formed by the ray inside and the two faces gives $r_1+r_2=A$. For $A=60^\circ$, $n=1.5$ and $i=50^\circ$: $r_1=30.71^\circ$, $r_2=29.29^\circ$, $e=47.21^\circ$ and $D=37.21^\circ$.

*The least turn.* The deviation is smallest when the ray crosses symmetrically, $i=e$ and $r_1=r_2=\frac A2$, and then
$$D_{\min}=2\arcsin\!\left(n\sin\frac A2\right)-A,\qquad n=\frac{\sin\frac{A+D_{\min}}{2}}{\sin\frac A2}.$$
For $A=60^\circ$ and $n=1.5$, $D_{\min}=37.18^\circ$. The second formula is how a laboratory measures the refractive index of glass: measure $A$ and $D_{\min}$, then compute $n$. If $n\sin\frac A2\ge1$ there is no symmetric ray at all.

*Total internal reflection.* Inside, the ray meets the second face at $r_2=A-r_1$. If $n\sin r_2>1$ it cannot leave: the face acts as a mirror. The critical angle of glass is $\arcsin\frac1n=41.8^\circ$, less than $45^\circ$, so a right-angled glass prism with faces at $45^\circ$ reflects light completely, with no silvering; binoculars and periscopes use such prisms.

*Colors.* The index $n$ is slightly larger for violet than for red light, about $1.53$ against $1.51$ in common glass, so violet is turned more: the minimum deviation is about $39.8^\circ$ against $38.1^\circ$ for $A=60^\circ$. White light entering one face leaves the other spread into a band of colors, the *spectrum*, which is what Newton saw in 1666. The widget traces a ray through a prism, and with “two colors” shows the two beams drawn apart.`,
            T`**Prisma kaca membelokkan sinar cahaya ke arah alasnya sebesar sudut $D=i+e-A$, dengan $A$ sudut puncak di antara kedua sisi yang dilalui cahaya, $i$ sudut datang, dan $e$ sudut keluar.** Pada tiap sisi berlaku hukum Snell, $\sin i=n\sin r_1$ saat masuk dan $\sin e=n\sin r_2$ saat keluar, dengan $n$ indeks bias kaca; dan segitiga yang dibentuk sinar di dalam dan kedua sisi memberi $r_1+r_2=A$. Untuk $A=60^\circ$, $n=1{,}5$, dan $i=50^\circ$: $r_1=30{,}71^\circ$, $r_2=29{,}29^\circ$, $e=47{,}21^\circ$, dan $D=37{,}21^\circ$.

*Belokan terkecil.* Deviasi terkecil terjadi saat sinar melintas secara simetris, $i=e$ dan $r_1=r_2=\frac A2$, dan saat itu
$$D_{\min}=2\arcsin\!\left(n\sin\frac A2\right)-A,\qquad n=\frac{\sin\frac{A+D_{\min}}{2}}{\sin\frac A2}.$$
Untuk $A=60^\circ$ dan $n=1{,}5$, $D_{\min}=37{,}18^\circ$. Rumus kedua adalah cara laboratorium mengukur indeks bias kaca: ukur $A$ dan $D_{\min}$, lalu hitung $n$. Bila $n\sin\frac A2\ge1$ tidak ada sinar simetris sama sekali.

*Pemantulan sempurna.* Di dalam, sinar mengenai sisi kedua pada $r_2=A-r_1$. Bila $n\sin r_2>1$ ia tak dapat keluar: sisi itu bekerja seperti cermin. Sudut kritis kaca adalah $\arcsin\frac1n=41{,}8^\circ$, kurang dari $45^\circ$, sehingga prisma kaca siku-siku dengan sisi-sisi $45^\circ$ memantulkan cahaya sepenuhnya, tanpa lapisan perak; teropong dan periskop memakai prisma seperti itu.

*Warna.* Indeks $n$ sedikit lebih besar untuk cahaya ungu daripada merah, sekitar $1{,}53$ berbanding $1{,}51$ pada kaca biasa, sehingga ungu dibelokkan lebih banyak: deviasi minimumnya sekitar $39{,}8^\circ$ berbanding $38{,}1^\circ$ untuk $A=60^\circ$. Cahaya putih yang masuk dari satu sisi keluar dari sisi lain tersebar menjadi pita warna, *spektrum*, yang dilihat Newton pada 1666. Widget menelusuri sinar melalui prisma, dan dengan “dua warna” menunjukkan kedua file yang terpisah.`,
          ),
        },
        { kind: 'widget', name: 'prlight' },
      ],
    },

    /* ------------------------------------------------------------------------------- code */
    {
      id: 'prism-in-code',
      heading: L('How do you work with a prism in a program?', 'Bagaimana bekerja dengan prisma dalam program?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A program computes a prism from the corners of its base: the shoelace formula gives the base area, the distances between neighbouring corners give the perimeter, and then $V=Bh$ and $S=2B+Ph$.** The shoelace formula adds $x_iy_{i+1}-x_{i+1}y_i$ round the polygon and halves the absolute value; it works for any simple polygon, not only for regular ones. The programs below print the volume, lateral area and surface of the $3$-$4$-$5$ prism, the measures of the hexagonal prism with $s=2$ and $h=5$, the counts of vertices, edges and faces with $V-E+F$, the share of the circle taken by the inscribed polygon for $n=6,12,100$, and the minimum deviation of a $60^\circ$ glass prism of index $1.5$.`,
            T`**Program menghitung prisma dari sudut-sudut alasnya: rumus tali sepatu memberi luas alas, jarak antar sudut yang bertetangga memberi keliling, lalu $V=L_a\,t$ dan $L_p=2L_a+Kt$.** Rumus tali sepatu menjumlahkan $x_iy_{i+1}-x_{i+1}y_i$ mengelilingi poligon dan membagi dua nilai mutlaknya; ia berlaku untuk poligon sederhana mana pun, tidak hanya yang beraturan. Program di bawah mencetak volume, luas selimut, dan luas permukaan prisma $3$-$4$-$5$, ukuran prisma segienam dengan $s=2$ dan $t=5$, banyak titik sudut, rusuk, dan sisi beserta $V-E+F$, bagian lingkaran yang diambil poligon di dalamnya untuk $n=6,12,100$, dan deviasi minimum prisma kaca $60^\circ$ berindeks $1{,}5$.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: a prism from the corners of its base', 'Python: prisma dari sudut-sudut alasnya'),
          code: `from math import tan, sin, asin, pi, radians, degrees


def shoelace(pts):
    """The area of a polygon from its corners in order."""
    total = 0
    for i in range(len(pts)):
        x1, y1 = pts[i]
        x2, y2 = pts[(i + 1) % len(pts)]
        total += x1 * y2 - x2 * y1
    return abs(total) / 2


def perimeter(pts):
    return sum(((pts[i][0] - pts[(i + 1) % len(pts)][0]) ** 2 + (pts[i][1] - pts[(i + 1) % len(pts)][1]) ** 2) ** 0.5 for i in range(len(pts)))


def right_prism(pts, h):
    base = shoelace(pts)
    p = perimeter(pts)
    return {'volume': round(base * h, 3), 'lateral': round(p * h, 3), 'surface': round(2 * base + p * h, 3)}


def regular_prism(n, s, h):
    base = n * s * s / (4 * tan(pi / n))
    return {'base': round(base, 3), 'volume': round(base * h, 3), 'surface': round(2 * base + n * s * h, 3)}


def counts(n):
    v, e, f = 2 * n, 3 * n, n + 2
    return v, e, f, v - e + f


def area_ratio(n):
    """The regular n-gon inscribed in a circle, as a share of the circle."""
    return n / (2 * pi) * sin(2 * pi / n)


def min_deviation(a, n):
    """The smallest turn of a ray through a prism of apex angle a (degrees) and index n."""
    return degrees(2 * asin(n * sin(radians(a) / 2))) - a


print(right_prism([(0, 0), (4, 0), (0, 3)], 5))           # {'volume': 30.0, 'lateral': 60.0, 'surface': 72.0}
print(regular_prism(6, 2, 5))                             # {'base': 10.392, 'volume': 51.962, 'surface': 80.785}
print(counts(3), counts(6))                               # (6, 9, 5, 2) (12, 18, 8, 2)
print([round(area_ratio(n), 4) for n in (6, 12, 100)])    # [0.827, 0.9549, 0.9993]
print(round(min_deviation(60, 1.5), 2))                   # 37.18`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: the same', 'JavaScript: yang sama'),
          code: `const shoelace = (pts) => Math.abs(pts.reduce((t, [x1, y1], i) => { const [x2, y2] = pts[(i + 1) % pts.length]; return t + x1 * y2 - x2 * y1 }, 0)) / 2
const perimeter = (pts) => pts.reduce((t, [x1, y1], i) => { const [x2, y2] = pts[(i + 1) % pts.length]; return t + Math.hypot(x2 - x1, y2 - y1) }, 0)
const round = (x, d = 3) => +x.toFixed(d)

function rightPrism(pts, h) {
  const base = shoelace(pts)
  const p = perimeter(pts)
  return { volume: round(base * h), lateral: round(p * h), surface: round(2 * base + p * h) }
}

function regularPrism(n, s, h) {
  const base = (n * s * s) / (4 * Math.tan(Math.PI / n))
  return { base: round(base), volume: round(base * h), surface: round(2 * base + n * s * h) }
}

const counts = (n) => [2 * n, 3 * n, n + 2, 2 * n - 3 * n + (n + 2)]
const areaRatio = (n) => (n / (2 * Math.PI)) * Math.sin((2 * Math.PI) / n)
const minDeviation = (a, n) => (2 * Math.asin(n * Math.sin((a * Math.PI) / 360)) * 180) / Math.PI - a

rightPrism([[0, 0], [4, 0], [0, 3]], 5)        // { volume: 30, lateral: 60, surface: 72 }
regularPrism(6, 2, 5)                          // { base: 10.392, volume: 51.962, surface: 80.785 }
;[counts(3), counts(6)]                        // [[6, 9, 5, 2], [12, 18, 8, 2]]
;[6, 12, 100].map((n) => round(areaRatio(n), 4))   // [0.827, 0.9549, 0.9993]
round(minDeviation(60, 1.5), 2)                // 37.18`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++: the same', 'C++: yang sama'),
          code: `#include <iostream>
#include <cstdio>
#include <cmath>
using namespace std;

const double PI = 3.14159265358979323846;

// the area of the regular n-gon with side s
double baseArea(int n, double s) {
  return n * s * s / (4 * tan(PI / n));
}

// the share of the circle taken by the regular n-gon inscribed in it
double areaRatio(int n) {
  return n / (2 * PI) * sin(2 * PI / n);
}

// the smallest turn of a ray through a prism of apex angle a (degrees) and index idx
double minDeviation(double a, double idx) {
  return 2 * asin(idx * sin(a * PI / 360)) * 180 / PI - a;
}

int main() {
  // the right prism on the 3-4-5 triangle, height 5
  double base = 6;
  double perimeter = 12;
  double h = 5;
  printf("volume %.1f; lateral %.1f; surface %.1f\\n", base * h, perimeter * h, 2 * base + perimeter * h);

  // the hexagonal prism, side 2, height 5
  double b6 = baseArea(6, 2);
  printf("base %.3f; volume %.3f; surface %.3f\\n", b6, b6 * 5, 2 * b6 + 6 * 2 * 5);

  // corners, edges, faces and V - E + F
  for (int n = 3; n <= 6; n += 3) {
    printf("%d %d %d %d\\n", 2 * n, 3 * n, n + 2, 2 * n - 3 * n + (n + 2));
  }

  printf("%.4f %.4f %.4f\\n", areaRatio(6), areaRatio(12), areaRatio(100));
  printf("%.2f\\n", minDeviation(60, 1.5));
  return 0;
}

/* output:
volume 30.0; lateral 60.0; surface 72.0
base 10.392; volume 51.962; surface 80.785
6 9 5 2
12 18 8 2
0.8270 0.9549 0.9993
37.18
*/`,
        },
      ],
    },

    /* ---------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where does the prism come from, in geometry and in optics?', 'Dari mana asal prisma, dalam geometri dan dalam optika?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The prism has been a named solid for more than two thousand years, and in the seventeenth century it became a tool for studying light.**

- **About 300 BCE.** Euclid’s *Elements*, Book XI, defines the prism as a solid contained by planes of which two opposite ones are equal, similar and parallel, and the rest parallelograms. In Book XII (XII.7) he shows that a triangular prism splits into three pyramids of equal volume, the origin of the factor $\frac13$ in the volume of a pyramid.
- **1621.** Willebrord Snell finds the law of refraction that bears his name; Descartes publishes it in 1637, and it is the law behind $\sin i=n\sin r$.
- **1635.** Bonaventura Cavalieri publishes his method of indivisibles, from which comes the principle that solids with equal slices have equal volumes: the reason a leaning prism keeps its volume.
- **1666.** Isaac Newton passes sunlight through a glass prism, shows that the spread of colors is in the light and not made by the glass, and publishes the experiments in *Opticks* in 1704.
- **1750.** Euler notices that vertices minus edges plus faces is $2$ for solids like the prism; the formula $V-E+F=2$ bears his name.
- **The 1850s.** Ignazio Porro designs the prism system that folds the light path of a telescope or binoculars, using total internal reflection in right-angled glass prisms.
- **Today.** The extrusion of a drawing into a solid, the voxel and the building block in a computer game, the storage tank and the beam in a building are prisms, and the formula $V=Bh$ runs in every one of those programs.`,
            T`**Prisma sudah menjadi bangun bernama selama lebih dari dua ribu tahun, dan pada abad ketujuh belas ia menjadi alat untuk mempelajari cahaya.**

- **Sekitar 300 SM.** *Elements* Euclid, Buku XI, mendefinisikan prisma sebagai bangun yang dibatasi bidang-bidang, dua yang berhadapan sama, sebangun, dan sejajar, sedangkan sisanya jajar genjang. Dalam Buku XII (XII.7) ia menunjukkan bahwa prisma segitiga terbagi menjadi tiga limas yang volumenya sama, asal faktor $\frac13$ pada volume limas.
- **1621.** Willebrord Snell menemukan hukum pembiasan yang memakai namanya; Descartes menerbitkannya pada 1637, dan itulah hukum di balik $\sin i=n\sin r$.
- **1635.** Bonaventura Cavalieri menerbitkan metode takterbagi, yang melahirkan prinsip bahwa bangun dengan irisan sama berluas sama bervolume sama: alasan prisma miring tetap bervolume sama.
- **1666.** Isaac Newton melewatkan sinar matahari melalui prisma kaca, menunjukkan bahwa sebaran warna ada dalam cahaya dan tidak dibuat oleh kaca, dan menerbitkan percobaan itu dalam *Opticks* pada 1704.
- **1750.** Euler memperhatikan bahwa titik sudut dikurangi rusuk ditambah sisi sama dengan $2$ untuk bangun seperti prisma; rumus $V-E+F=2$ memakai namanya.
- **Tahun 1850-an.** Ignazio Porro merancang sistem prisma yang melipat lintasan cahaya teleskop atau teropong, dengan pemantulan sempurna dalam prisma kaca siku-siku.
- **Sekarang.** Ekstrusi gambar menjadi bangun, voksel dan balok bangunan dalam permainan komputer, tangki penyimpanan dan balok dalam gedung adalah prisma, dan rumus $V=L_a\,t$ berjalan di setiap program itu.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What are the common mistakes with the prism?', 'Apa kesalahan umum pada prisma?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with the prism are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ The volume of a leaning prism is base area times the length of the edge | Use the perpendicular height, between the planes of the bases: $V=Bh$, and $h<e$ when it leans. |
| ❌ The lateral area is always $Ph$ | That is for a right prism. For an oblique prism it is $P_s\,e$, with the right section. |
| ❌ The surface area is the lateral area | Add the two bases: $S=2B+\text{lateral area}$. |
| ❌ A prism on an $n$-gon has $n$ faces | It has $n+2$: the $n$ lateral faces and the two bases. |
| ❌ Every side face of a prism is a rectangle | Only in a right prism; in an oblique prism they are parallelograms. |
| ❌ The base area of a regular hexagon is $6s^2$ | It is $\frac{3\sqrt3}{2}s^2$, six equilateral triangles of area $\frac{\sqrt3}{4}s^2$. |
| ❌ A prism and a pyramid hold the same | A pyramid on the same base and height holds only $\frac13$ as much. |
| ❌ A cylinder is a prism | A prism has flat faces and a polygon base; the cylinder is only the limit of prisms as $n$ grows. |
| ❌ Light is bent towards the apex of the prism | It is bent towards the base, the thick side of the glass. |`,
            T`**Kesalahan paling umum pada prisma adalah sembilan berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ Volume prisma miring adalah luas alas kali panjang rusuk tegak | Pakai tinggi tegak lurus, di antara bidang alas dan tutup: $V=L_a\,t$, dan $t<e$ bila miring. |
| ❌ Luas selimut selalu $Kt$ | Itu untuk prisma tegak. Untuk prisma miring luasnya $K_s\,e$, dengan irisan tegak lurus. |
| ❌ Luas permukaan adalah luas selimut | Tambahkan kedua alas: $L_p=2L_a+\text{luas selimut}$. |
| ❌ Prisma pada segi-$n$ memiliki $n$ sisi | Ia memiliki $n+2$: $n$ sisi tegak dan dua alas. |
| ❌ Setiap sisi tegak prisma adalah persegi panjang | Hanya pada prisma tegak; pada prisma miring berupa jajar genjang. |
| ❌ Luas alas segienam beraturan adalah $6s^2$ | Luasnya $\frac{3\sqrt3}{2}s^2$, enam segitiga sama sisi seluas $\frac{\sqrt3}{4}s^2$. |
| ❌ Prisma dan limas memuat sama banyak | Limas pada alas dan tinggi yang sama hanya memuat $\frac13$-nya. |
| ❌ Tabung adalah prisma | Prisma bersisi datar dengan alas poligon; tabung hanya batas prisma saat $n$ bertambah. |
| ❌ Cahaya dibelokkan ke arah puncak prisma | Ia dibelokkan ke arah alas, sisi kaca yang tebal. |`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------------- practice */
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
              L(T`A prism on a base with $n$ sides has $n+2$ faces.`, T`Prisma pada alas bersisi $n$ memiliki $n+2$ sisi.`),
              L(T`Every side face of every prism is a rectangle.`, T`Setiap sisi tegak dari setiap prisma adalah persegi panjang.`),
              L(T`The volume of any prism is the base area times the perpendicular height.`, T`Volume prisma mana pun adalah luas alas kali tinggi tegak lurus.`),
              L(T`A cylinder is a prism.`, T`Tabung adalah prisma.`),
              L(T`A ray of light going through a glass prism is bent towards the base.`, T`Sinar cahaya yang melalui prisma kaca dibelokkan ke arah alas.`),
              L(T`A triangular prism has no space diagonals.`, T`Prisma segitiga tidak memiliki diagonal ruang.`),
            ],
            answer: [true, false, true, false, true, true],
            explain: L(
              T`The faces are the $n$ lateral faces and the two bases. The side faces are rectangles only when the prism is right. Cavalieri’s principle gives $V=Bh$ for leaning prisms too. A cylinder has a curved side. A glass prism turns light towards its thick side, the base. In a triangular prism any two corners lie on a common face, so no segment joins two corners through the inside only.`,
              T`Sisinya adalah $n$ sisi tegak dan dua alas. Sisi tegak berupa persegi panjang hanya bila prisma itu tegak. Prinsip Cavalieri memberi $V=L_a\,t$ untuk prisma miring juga. Tabung bersisi lengkung. Prisma kaca membelokkan cahaya ke sisi tebalnya, alas. Pada prisma segitiga dua titik sudut mana pun terletak pada satu sisi yang sama, jadi tak ada ruas yang menghubungkan dua titik sudut hanya melalui bagian dalam.`,
            ),
            hint: L(T`Test each claim on a cuboid, a leaning stack of cards and a can.`, T`Uji tiap pernyataan pada balok, setumpuk kartu yang miring, dan kaleng.`),
          },
        },
        {
          kind: 'activity',
          title: L('Volume', 'Volume'),
          step: {
            kind: 'math',
            id: 'p2',
            hints: [L(T`$V=B\cdot h$.`, T`$V=L_a\cdot t$.`), L(T`$15\cdot8$.`, T`$15\cdot8$.`)],
            explain: L(T`$15\cdot8=120$.`, T`$15\cdot8=120$.`),
            prompt: L(T`A prism has a base of area $15$ cm² and a height of $8$ cm. What is its volume, in cm³?`, T`Sebuah prisma beralas seluas $15$ cm² dan tinggi $8$ cm. Berapa volumenya, dalam cm³?`),
            given: String.raw`V=v`,
            blanks: [{ label: 'V =', answer: 120 }],
          },
        },
        {
          kind: 'activity',
          title: L('Lateral area', 'Luas selimut'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L(T`The lateral area of a right prism is the perimeter times the height.`, T`Luas selimut prisma tegak adalah keliling kali tinggi.`), L(T`$(5+6+7)\cdot4$.`, T`$(5+6+7)\cdot4$.`)],
            explain: L(T`$P=5+6+7=18$ and $18\cdot4=72$.`, T`$K=5+6+7=18$ dan $18\cdot4=72$.`),
            prompt: L(T`A right prism has a triangular base with sides $5$, $6$ and $7$, and height $4$. What is its lateral area?`, T`Sebuah prisma tegak beralas segitiga bersisi $5$, $6$, dan $7$ dengan tinggi $4$. Berapa luas selimutnya?`),
            given: String.raw`A=v`,
            blanks: [{ label: 'A =', answer: 72 }],
          },
        },
        {
          kind: 'activity',
          title: L('Surface area', 'Luas permukaan'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L(T`$S=2B+Ph$.`, T`$L_p=2L_a+Kt$.`), L(T`$2\cdot24+22\cdot10$.`, T`$2\cdot24+22\cdot10$.`)],
            explain: L(T`$2\cdot24+22\cdot10=48+220=268$.`, T`$2\cdot24+22\cdot10=48+220=268$.`),
            prompt: L(T`A right prism has a base of area $24$ and perimeter $22$, and height $10$. What is its surface area?`, T`Sebuah prisma tegak beralas seluas $24$ dan berkeliling $22$, dengan tinggi $10$. Berapa luas permukaannya?`),
            given: String.raw`S=v`,
            blanks: [{ label: 'S =', answer: 268 }],
          },
        },
        {
          kind: 'activity',
          title: L('The missing height', 'Tinggi yang hilang'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [L(T`$h=\dfrac VB$.`, T`$t=\dfrac V{L_a}$.`), L(T`$210\div35$.`, T`$210\div35$.`)],
            explain: L(T`$h=\frac{210}{35}=6$.`, T`$t=\frac{210}{35}=6$.`),
            prompt: L(T`A prism has volume $210$ and a base of area $35$. How high is it?`, T`Sebuah prisma bervolume $210$ dan beralas seluas $35$. Berapa tingginya?`),
            given: String.raw`h=v`,
            blanks: [{ label: 'h =', answer: 6 }],
          },
        },
        {
          kind: 'activity',
          title: L('Counting edges', 'Menghitung rusuk'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L(T`A prism on an $n$-gon has $3n$ edges.`, T`Prisma pada segi-$n$ memiliki $3n$ rusuk.`), L(T`A decagon has $10$ sides.`, T`Segi sepuluh memiliki $10$ sisi.`)],
            explain: L(T`$3\cdot10=30$: ten sides on each base and ten lateral edges. Faces $12$, vertices $20$, and $20-30+12=2$.`, T`$3\cdot10=30$: sepuluh sisi pada tiap alas dan sepuluh rusuk tegak. Sisi $12$, titik sudut $20$, dan $20-30+12=2$.`),
            prompt: L(T`How many edges does a prism with a decagon (ten-sided) base have?`, T`Berapa rusuk yang dimiliki prisma beralas segi sepuluh?`),
            given: String.raw`E=v`,
            blanks: [{ label: 'E =', answer: 30 }],
          },
        },
        {
          kind: 'activity',
          title: L('A leaning prism', 'Prisma miring'),
          step: {
            kind: 'quiz',
            id: 'p7',
            prompt: L('An oblique prism has a base of area 20 cm², lateral edges 13 cm long, and a perpendicular height of 12 cm. What is its volume?', 'Prisma miring memiliki alas seluas 20 cm², rusuk tegak sepanjang 13 cm, dan tinggi tegak lurus 12 cm. Berapa volumenya?'),
            options: [L('240 cm³', '240 cm³'), L('260 cm³', '260 cm³'), L('156 cm³', '156 cm³'), L('32 cm³', '32 cm³')],
            answer: 0,
            explain: L(T`The volume uses the perpendicular height: $20\cdot12=240$. The edge $13$ is longer than the height, and $20\cdot13=260$ is the mistake.`, T`Volume memakai tinggi tegak lurus: $20\cdot12=240$. Rusuk $13$ lebih panjang daripada tingginya, dan $20\cdot13=260$ adalah kesalahannya.`),
            hint: L('Cavalieri: only the base area and the perpendicular height matter.', 'Cavalieri: hanya luas alas dan tinggi tegak lurus yang berperan.'),
          },
        },
        {
          kind: 'activity',
          title: L('Which are prisms?', 'Mana yang prisma?'),
          step: {
            kind: 'multi',
            id: 'p8',
            prompt: L('Which of these solids are prisms? Choose **all** that apply.', 'Bangun mana yang merupakan prisma? Pilih **semua** yang benar.'),
            options: [L('A cube', 'Kubus'), L('A square pyramid', 'Limas persegi'), L('A cylinder', 'Tabung'), L('A tent with two triangular ends and rectangular slopes', 'Tenda dengan dua ujung segitiga dan lereng persegi panjang'), L('A brick', 'Batu bata')],
            answer: [0, 3, 4],
            explain: L(T`A cube and a brick are prisms on a square and on a rectangle, and the tent is a triangular prism on its side. A pyramid has faces meeting at a point, and a cylinder has a curved side.`, T`Kubus dan batu bata adalah prisma pada persegi dan persegi panjang, dan tenda adalah prisma segitiga yang rebah. Limas memiliki sisi yang bertemu di satu titik, dan tabung bersisi lengkung.`),
            hint: L('Two identical parallel bases, and all other faces flat parallelograms.', 'Dua alas yang sama dan sejajar, dan semua sisi lain berupa jajar genjang yang datar.'),
          },
        },
        {
          kind: 'activity',
          title: L('Scaling', 'Perubahan skala'),
          step: {
            kind: 'quiz',
            id: 'p9',
            prompt: L('Every length of a prism is doubled, the base sides and the height. By what factor does the volume grow?', 'Setiap panjang prisma digandakan, sisi alas dan tingginya. Berapa kali volumenya bertambah?'),
            options: [L('2', '2'), L('4', '4'), L('6', '6'), L('8', '8')],
            answer: 3,
            explain: L('The base area grows $4$ times and the height $2$ times, so the volume grows $8$ times and the surface $4$ times.', 'Luas alas bertambah $4$ kali dan tinggi $2$ kali, jadi volume bertambah $8$ kali dan luas permukaan $4$ kali.'),
            hint: L('Volume is the base area, a product of two lengths, times a third length.', 'Volume adalah luas alas, hasil kali dua panjang, kali panjang ketiga.'),
          },
        },
        {
          kind: 'activity',
          title: L('Light through glass', 'Cahaya melalui kaca'),
          step: {
            kind: 'math',
            id: 'p10',
            hints: [L(T`$D_{\min}=2\arcsin\!\left(n\sin\frac A2\right)-A$.`, T`$D_{\min}=2\arcsin\!\left(n\sin\frac A2\right)-A$.`), L(T`$n\sin30^\circ=\frac{\sqrt3}{2}$, and $\arcsin\frac{\sqrt3}{2}=60^\circ$.`, T`$n\sin30^\circ=\frac{\sqrt3}{2}$, dan $\arcsin\frac{\sqrt3}{2}=60^\circ$.`)],
            explain: L(T`$D_{\min}=2\cdot60^\circ-60^\circ=60^\circ$.`, T`$D_{\min}=2\cdot60^\circ-60^\circ=60^\circ$.`),
            prompt: L(T`A prism has apex angle $60^\circ$ and refractive index $\sqrt3$. What is its minimum deviation, in degrees?`, T`Sebuah prisma bersudut puncak $60^\circ$ dan berindeks bias $\sqrt3$. Berapa deviasi minimumnya, dalam derajat?`),
            given: String.raw`D=v`,
            blanks: [{ label: 'D =', answer: 60 }],
          },
        },
        {
          kind: 'activity',
          title: L('Order the working', 'Urutkan pengerjaannya'),
          step: {
            kind: 'order',
            id: 'p11',
            prompt: L('Put the steps of finding the surface area of a right prism in order.', 'Urutkan langkah mencari luas permukaan prisma tegak.'),
            lines: {
              en: ['Find the area B of the base', 'Find the perimeter P of the base', 'Multiply the perimeter by the height: the lateral area Ph', 'Add twice the base area: S = 2B + Ph'],
              id: ['Cari luas alas L', 'Cari keliling alas K', 'Kalikan keliling dengan tinggi: luas selimut Kt', 'Tambahkan dua kali luas alas: L = 2L + Kt'],
            },
            explain: L(T`The lateral area needs the perimeter and the height, and the bases are added once it is known.`, T`Luas selimut memerlukan keliling dan tinggi, dan alas ditambahkan setelah luas selimut diketahui.`),
            hint: L(T`The sum comes last.`, T`Penjumlahan paling akhir.`),
          },
        },
        {
          kind: 'activity',
          title: L('Fill in the working', 'Isi pengerjaannya'),
          step: {
            kind: 'fill',
            id: 'p12',
            prompt: L('Complete the working for the surface area of the prism on the 3-4-5 triangle with height 5.', 'Lengkapi pengerjaan luas permukaan prisma pada segitiga 3-4-5 dengan tinggi 5.'),
            template: {
              en: 'S = 2 · ___ + ___ · 5 = ___ + ___ = ___',
              id: 'L = 2 · ___ + ___ · 5 = ___ + ___ = ___',
            },
            blanks: { en: ['6', '12', '12', '60', '72'], id: ['6', '12', '12', '60', '72'] },
            explain: L(T`The base has area $\frac12\cdot3\cdot4=6$ and perimeter $12$: $12+60=72$, matching the net $15+20+25+6+6$.`, T`Alas berluas $\frac12\cdot3\cdot4=6$ dan berkeliling $12$: $12+60=72$, sesuai jaring-jaring $15+20+25+6+6$.`),
            hint: L(T`Area of the right triangle first, then its perimeter.`, T`Luas segitiga siku-siku dulu, lalu kelilingnya.`),
          },
        },
      ],
    },

    /* --------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: the prism at a glance', 'Ringkasan: prisma sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Parts:** two identical parallel bases and parallelogram side faces; right if the edges stand at right angles to the bases, oblique if they lean; named by the base.
- **Counts:** $n+2$ faces, $3n$ edges, $2n$ vertices, $V-E+F=2$; $n(n-3)$ space diagonals.
- **Volume:** $V=Bh$ with $h$ the perpendicular height, for right and oblique prisms alike (Cavalieri).
- **Surface:** $S=2B+\text{lateral area}$; lateral area $Ph$ for a right prism and $P_s\,e$ for an oblique one; the net of a right prism is a rectangle $P\times h$ and two bases.
- **Regular base:** $B=\dfrac{ns^2}{4\tan(\pi/n)}$, $P=ns$; space diagonals $\sqrt{h^2+(2R\sin\frac{k\pi}{n})^2}$.
- **Cylinder:** the base takes the fraction $\frac{n}{2\pi}\sin\frac{2\pi}{n}\to1$ of its circle, so the prism tends to the cylinder.
- **Light:** $D=i+e-A$, $D_{\min}=2\arcsin(n\sin\frac A2)-A$, $n=\dfrac{\sin\frac{A+D_{\min}}{2}}{\sin\frac A2}$; violet is bent more than red; right-angled glass prisms reflect totally.`,
            T`- **Bagian:** dua alas yang sama dan sejajar serta sisi tegak berbentuk jajar genjang; tegak bila rusuknya tegak lurus pada alas, miring bila condong; dinamai menurut alasnya.
- **Banyaknya:** $n+2$ sisi, $3n$ rusuk, $2n$ titik sudut, $V-E+F=2$; $n(n-3)$ diagonal ruang.
- **Volume:** $V=L_a\,t$ dengan $t$ tinggi tegak lurus, untuk prisma tegak dan miring sama saja (Cavalieri).
- **Luas permukaan:** $L_p=2L_a+\text{luas selimut}$; luas selimut $Kt$ untuk prisma tegak dan $K_s\,e$ untuk yang miring; jaring-jaring prisma tegak adalah persegi panjang $K\times t$ dan dua alas.
- **Alas beraturan:** $L_a=\dfrac{ns^2}{4\tan(\pi/n)}$, $K=ns$; diagonal ruang $\sqrt{t^2+(2R\sin\frac{k\pi}{n})^2}$.
- **Tabung:** alas mengambil bagian $\frac{n}{2\pi}\sin\frac{2\pi}{n}\to1$ dari lingkarannya, sehingga prisma menuju tabung.
- **Cahaya:** $D=i+e-A$, $D_{\min}=2\arcsin(n\sin\frac A2)-A$, $n=\dfrac{\sin\frac{A+D_{\min}}{2}}{\sin\frac A2}$; ungu dibelokkan lebih banyak daripada merah; prisma kaca siku-siku memantulkan sempurna.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Prism', 'Prisma'), definition: L('A solid with two identical parallel polygons as bases and parallelograms as the other faces.', 'Bangun ruang dengan dua poligon sejajar yang sama sebagai alas dan jajar genjang sebagai sisi lainnya.') },
    { term: L('Base', 'Alas'), definition: L('One of the two identical parallel polygons of a prism; it names the prism.', 'Salah satu dari dua poligon sejajar yang sama pada prisma; ia memberi nama prisma.') },
    { term: L('Lateral face', 'Sisi tegak'), definition: L('A face of a prism that is not a base: a parallelogram, a rectangle in a right prism.', 'Sisi prisma yang bukan alas: jajar genjang, persegi panjang pada prisma tegak.') },
    { term: L('Lateral edge', 'Rusuk tegak'), definition: L('An edge between the two bases; the lateral edges are parallel and equal.', 'Rusuk di antara kedua alas; rusuk tegak sejajar dan sama panjang.') },
    { term: L('Height', 'Tinggi'), definition: L('The distance between the planes of the bases, measured at right angles to them; in an oblique prism it is less than the edge.', 'Jarak antara bidang kedua alas, diukur tegak lurus pada keduanya; pada prisma miring ia kurang dari rusuk tegak.') },
    { term: L('Right prism', 'Prisma tegak'), definition: L('A prism whose lateral edges are at right angles to the bases, so its side faces are rectangles.', 'Prisma yang rusuk tegaknya tegak lurus pada alas, sehingga sisi tegaknya persegi panjang.') },
    { term: L('Oblique prism', 'Prisma miring'), definition: L('A prism whose lateral edges lean, so its side faces are parallelograms.', 'Prisma yang rusuk tegaknya condong, sehingga sisi tegaknya jajar genjang.') },
    { term: L('Right section', 'Irisan tegak lurus'), definition: L('The cross-section of a prism made by a plane at right angles to its lateral edges.', 'Irisan prisma oleh bidang yang tegak lurus pada rusuk tegaknya.') },
    { term: L('Cavalieri’s principle', 'Prinsip Cavalieri'), definition: L('Two solids of the same height whose slices at every level have equal areas have equal volumes.', 'Dua bangun yang sama tingginya, yang irisannya pada setiap tingkat berluas sama, bervolume sama.') },
    { term: L('Apex angle', 'Sudut puncak'), definition: L('The angle between the two faces of an optical prism that the light crosses.', 'Sudut di antara dua sisi prisma optik yang dilalui cahaya.') },
    { term: L('Minimum deviation', 'Deviasi minimum'), definition: L('The smallest angle by which a prism turns a ray, reached when the ray crosses symmetrically.', 'Sudut terkecil yang dibelokkan sebuah prisma pada sinar, tercapai saat sinar melintas secara simetris.') },
  ],

  howTo: [
    {
      name: L('How to find the volume and the surface area of a right prism', 'Cara mencari volume dan luas permukaan prisma tegak'),
      description: L('Find the area and the perimeter of the base, then multiply by the height and add the bases.', 'Cari luas dan keliling alas, lalu kalikan dengan tinggi dan tambahkan alasnya.'),
      steps: [
        { name: L('Find the area of the base', 'Cari luas alas'), text: L('Use the formula of the polygon, or the shoelace formula when you know its corners.', 'Pakai rumus poligonnya, atau rumus tali sepatu bila kamu tahu sudut-sudutnya.') },
        { name: L('Multiply by the height for the volume', 'Kalikan dengan tinggi untuk volume'), text: L('The volume is the base area times the height, in cubic units.', 'Volume adalah luas alas kali tinggi, dalam satuan kubik.') },
        { name: L('Find the perimeter of the base', 'Cari keliling alas'), text: L('Add the lengths of all the sides of the base.', 'Jumlahkan panjang semua sisi alas.') },
        { name: L('Find the lateral area', 'Cari luas selimut'), text: L('Multiply the perimeter of the base by the height; this is the area of the side faces.', 'Kalikan keliling alas dengan tinggi; ini luas sisi tegak.') },
        { name: L('Add the two bases', 'Tambahkan kedua alas'), text: L('The surface area is the lateral area plus twice the base area.', 'Luas permukaan adalah luas selimut ditambah dua kali luas alas.') },
      ],
    },
    {
      name: L('How to count the faces, edges and vertices of a prism', 'Cara menghitung sisi, rusuk, dan titik sudut prisma'),
      description: L('Count the sides of the base and use n plus 2, 3n and 2n, then check with Euler’s formula.', 'Hitung sisi alas dan pakai n tambah 2, 3n, dan 2n, lalu periksa dengan rumus Euler.'),
      steps: [
        { name: L('Count the sides of the base', 'Hitung sisi alas'), text: L('Call the number of sides n; a triangle has 3, a hexagon 6.', 'Sebut banyak sisi n; segitiga 3, segienam 6.') },
        { name: L('Count the faces', 'Hitung sisi'), text: L('There are n side faces and two bases: n plus 2 faces.', 'Ada n sisi tegak dan dua alas: n tambah 2 sisi.') },
        { name: L('Count the edges', 'Hitung rusuk'), text: L('Each base has n edges and n lateral edges join them: 3n edges.', 'Tiap alas memiliki n rusuk dan n rusuk tegak menghubungkannya: 3n rusuk.') },
        { name: L('Count the vertices', 'Hitung titik sudut'), text: L('Each base has n corners: 2n vertices.', 'Tiap alas memiliki n sudut: 2n titik sudut.') },
        { name: L('Check with Euler’s formula', 'Periksa dengan rumus Euler'), text: L('Vertices minus edges plus faces must come to 2.', 'Titik sudut dikurangi rusuk ditambah sisi harus sama dengan 2.') },
      ],
    },
    {
      name: L('How to find the refractive index of glass with a prism', 'Cara mencari indeks bias kaca dengan prisma'),
      description: L('Measure the apex angle and the minimum deviation of a glass prism, then use the sine formula.', 'Ukur sudut puncak dan deviasi minimum prisma kaca, lalu pakai rumus sinus.'),
      steps: [
        { name: L('Measure the apex angle', 'Ukur sudut puncak'), text: L('Measure the angle A between the two faces the light will cross.', 'Ukur sudut A di antara kedua sisi yang akan dilalui cahaya.') },
        { name: L('Find the minimum deviation', 'Cari deviasi minimum'), text: L('Turn the prism until the bent ray stops moving in one direction and turns back; the smallest angle D is the minimum deviation.', 'Putar prisma sampai sinar yang dibelokkan berhenti bergerak ke satu arah dan berbalik; sudut terkecil D adalah deviasi minimum.') },
        { name: L('Apply the formula', 'Terapkan rumus'), text: L('The refractive index is the sine of half the sum of A and D divided by the sine of half of A.', 'Indeks bias adalah sinus setengah jumlah A dan D dibagi sinus setengah A.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is a prism in geometry?', 'Apa itu prisma dalam geometri?'),
      a: L(
        'A prism is a solid with two identical polygons in parallel planes as its bases, joined by parallelogram faces. It is named by its base, as a triangular or hexagonal prism, and it is right when the side faces are rectangles and oblique when it leans.',
        'Prisma adalah bangun ruang dengan dua poligon yang sama pada bidang sejajar sebagai alasnya, dihubungkan oleh sisi berbentuk jajar genjang. Ia dinamai menurut alasnya, seperti prisma segitiga atau segienam, dan disebut tegak bila sisi tegaknya persegi panjang dan miring bila condong.',
      ),
    },
    {
      q: L('How do you find the volume of a prism?', 'Bagaimana mencari volume prisma?'),
      a: L(
        'Multiply the area of the base by the height measured at right angles to the bases: V equals B times h. It holds for leaning prisms as well. A prism with a base of area 6 and height 5 has volume 30.',
        'Kalikan luas alas dengan tinggi yang diukur tegak lurus pada alas: V sama dengan luas alas kali tinggi. Ini berlaku untuk prisma miring juga. Prisma beralas seluas 6 dan tinggi 5 bervolume 30.',
      ),
    },
    {
      q: L('What is the formula for the surface area of a prism?', 'Apa rumus luas permukaan prisma?'),
      a: L(
        'For a right prism the surface area is twice the base area plus the perimeter of the base times the height: S equals 2B plus Ph. For the prism on the 3, 4, 5 triangle with height 5 it is 12 plus 60, which is 72.',
        'Untuk prisma tegak luas permukaan adalah dua kali luas alas ditambah keliling alas kali tinggi. Untuk prisma pada segitiga 3, 4, 5 dengan tinggi 5 luasnya 12 ditambah 60, yaitu 72.',
      ),
    },
    {
      q: L('How do you find the lateral surface area of a prism?', 'Bagaimana mencari luas selimut prisma?'),
      a: L(
        'For a right prism, multiply the perimeter of the base by the height, since the side faces unfold into one rectangle. For an oblique prism, multiply the perimeter of the right section by the length of a lateral edge.',
        'Untuk prisma tegak, kalikan keliling alas dengan tinggi, karena sisi tegaknya terbentang menjadi satu persegi panjang. Untuk prisma miring, kalikan keliling irisan tegak lurus dengan panjang rusuk tegak.',
      ),
    },
    {
      q: L('How many faces, edges and vertices does a prism have?', 'Berapa sisi, rusuk, dan titik sudut yang dimiliki prisma?'),
      a: L(
        'A prism on a base with n sides has n plus 2 faces, 3n edges and 2n vertices. A triangular prism has 5 faces, 9 edges and 6 vertices, and 6 minus 9 plus 5 equals 2, as Euler’s formula says.',
        'Prisma pada alas bersisi n memiliki n tambah 2 sisi, 3n rusuk, dan 2n titik sudut. Prisma segitiga memiliki 5 sisi, 9 rusuk, dan 6 titik sudut, dan 6 dikurangi 9 ditambah 5 sama dengan 2, seperti kata rumus Euler.',
      ),
    },
    {
      q: L('What is the difference between a prism and a pyramid?', 'Apa beda prisma dan limas?'),
      a: L(
        'A prism has two parallel bases and parallelogram sides; a pyramid has one base and triangular sides that meet at a point. On the same base and height a pyramid holds one third of the volume of the prism.',
        'Prisma memiliki dua alas sejajar dan sisi berbentuk jajar genjang; limas memiliki satu alas dan sisi segitiga yang bertemu di satu titik. Pada alas dan tinggi yang sama limas memuat sepertiga volume prisma.',
      ),
    },
    {
      q: L('Does a leaning prism have the same volume as an upright prism?', 'Apakah prisma miring bervolume sama dengan prisma tegak?'),
      a: L(
        'Yes, if the base and the perpendicular height are the same. Every slice parallel to the base has the same area, so by Cavalieri’s principle the volumes are equal. The lateral area, though, is larger for the leaning prism.',
        'Ya, bila alas dan tinggi tegak lurusnya sama. Setiap irisan yang sejajar dengan alas berluas sama, sehingga menurut prinsip Cavalieri volumenya sama. Namun luas selimut prisma yang miring lebih besar.',
      ),
    },
    {
      q: L('Why does a glass prism split white light into colors?', 'Mengapa prisma kaca menguraikan cahaya putih menjadi warna?'),
      a: L(
        'Glass has a slightly larger refractive index for violet than for red light, so the two are bent by different angles at each face. White light that enters one face leaves the other spread into a spectrum, with violet turned most.',
        'Kaca memiliki indeks bias yang sedikit lebih besar untuk cahaya ungu daripada merah, sehingga keduanya dibelokkan dengan sudut berbeda pada tiap sisi. Cahaya putih yang masuk dari satu sisi keluar dari sisi lain tersebar menjadi spektrum, dengan ungu paling banyak dibelokkan.',
      ),
    },
  ],

  references: [
    { title: 'The Thirteen Books of Euclid’s Elements (Books XI and XII)', author: 'Thomas L. Heath (translator)', year: 1956, source: 'Dover' },
    { title: 'Polyhedra', author: 'Peter R. Cromwell', year: 1997, source: 'Cambridge University Press' },
    { title: 'Geometria indivisibilibus continuorum nova quadam ratione promota', author: 'Bonaventura Cavalieri', year: 1635, source: 'Bologna' },
    { title: 'Opticks', author: 'Isaac Newton', year: 1704, source: 'Royal Society, London' },
    { title: 'Optics (5th ed.)', author: 'Eugene Hecht', year: 2017, source: 'Pearson' },
    { title: 'Proofs and Refutations: The Logic of Mathematical Discovery', author: 'Imre Lakatos', year: 1976, source: 'Cambridge University Press' },
    { title: 'Geometry: Seeing, Doing, Understanding (3rd ed.)', author: 'Harold R. Jacobs', year: 2003, source: 'W. H. Freeman' },
    { title: 'Precalculus: Mathematics for Calculus (chapter on geometry formulas)', author: 'James Stewart, Lothar Redlin, Saleem Watson', year: 2016, source: 'Cengage Learning' },
  ],

  related: ['cuboid', 'cube', 'circles', 'triangles'],
}
