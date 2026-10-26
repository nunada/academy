import type { Figure } from '../../lib/figure'
import type { Loc } from '../types'
import type { ArticleBlock, ArticleBody } from './types'
import { meta } from './cuboid.meta'

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

/** The net of the 4 × 3 × 2 box: six rectangles whose areas are 12, 12, 8, 8, 6, 6. */
const FIG_NET: ArticleBlock = fig({
  range: 1,
  xSpan: [-0.3, 8.3],
  ySpan: [-0.3, 10.3],
  items: ([
    [rect(2, 2, 6, 5), '12', 4, 3.5, 'a'],
    [rect(2, 0, 6, 2), '8', 4, 1, 'b'],
    [rect(2, 5, 6, 7), '8', 4, 6, 'b'],
    [rect(2, 7, 6, 10), '12', 4, 8.5, 'a'],
    [rect(0, 2, 2, 5), '6', 1, 3.5, 'c'],
    [rect(6, 2, 8, 5), '6', 7, 3.5, 'c'],
  ] as [[number, number][], string, number, number, 'a' | 'b' | 'c'][]).flatMap(([pts, label, x, y, color]) => [
    { t: 'poly' as const, pts, color, look: 'solid' as const },
    { t: 'text' as const, at: [x, y - 0.15], text: label, size: 'lg' as const, color: 'result' as const },
  ]),
  caption: L(
    T`The net of a box $4\times3\times2$ is six rectangles in three equal pairs: two of $4\times3$ (area $12$), two of $4\times2$ (area $8$) and two of $3\times2$ (area $6$). They add up to $2(12+8+6)=52$, which is $2(lw+lh+wh)$.`,
    T`Jaring-jaring balok $4\times3\times2$ adalah enam persegi panjang dalam tiga pasang yang sama: dua $4\times3$ (luas $12$), dua $4\times2$ (luas $8$), dan dua $3\times2$ (luas $6$). Jumlahnya $2(12+8+6)=52$, yaitu $2(lw+lh+wh)$.`,
  ),
})

/** A 6 × 3 × 2 box, whose space diagonal is exactly 7, with a face diagonal, for turning. */
const FIG_BOX: ArticleBlock = {
  kind: 'figure',
  figure: {
    dim: 3,
    range: 5,
    interactive: true,
    view: [34, 22],
    items: [
      { t: 'box', a: [6, 0, 0], b: [0, 3, 0], c: [0, 0, 2] },
      { t: 'seg', from: [0, 0, 0], to: [6, 3, 0], color: 'b', width: 3, label: 'f' },
      { t: 'seg', from: [6, 3, 0], to: [6, 3, 2], color: 'muted', dashed: true },
      { t: 'seg', from: [0, 0, 0], to: [6, 3, 2], color: 'result', width: 3, label: 'd' },
      { t: 'point', at: [0, 0, 0], color: 'muted', label: 'A' },
      { t: 'point', at: [6, 3, 0], color: 'muted', label: 'C' },
      { t: 'point', at: [6, 3, 2], color: 'muted', label: 'G' },
    ],
    caption: L(
      T`Turn the box $6\times3\times2$. The diagonal of the base is $f=\sqrt{6^2+3^2}=\sqrt{45}$, and the space diagonal is the hypotenuse over $f$ and the height: $d=\sqrt{45+4}=\sqrt{49}=7$. A rod of length $7$ just fits corner to corner.`,
      T`Putar balok $6\times3\times2$. Diagonal alasnya $f=\sqrt{6^2+3^2}=\sqrt{45}$, dan diagonal ruang adalah sisi miring di atas $f$ dan tingginya: $d=\sqrt{45+4}=\sqrt{49}=7$. Batang sepanjang $7$ tepat muat dari sudut ke sudut.`,
    ),
  },
}

export const body: ArticleBody = {
  answer: L(
    T`**A cuboid, or rectangular box, has six rectangular faces in three equal pairs, twelve edges in three groups of four, and eight corners; with length $l$, width $w$ and height $h$ its volume is $lwh$, its surface area is $2(lw+lh+wh)$ and its space diagonal is $\sqrt{l^2+w^2+h^2}$.** A cube is the special case with three equal edges, and it holds the most volume for a given surface area. A rod fits inside a box exactly when it is no longer than the space diagonal.`,
    T`**Balok memiliki enam sisi persegi panjang dalam tiga pasang yang sama, dua belas rusuk dalam tiga kelompok empat, dan delapan titik sudut; dengan panjang $p$, lebar $l$, dan tinggi $t$ volumenya $plt$, luas permukaannya $2(pl+pt+lt)$, dan diagonal ruangnya $\sqrt{p^2+l^2+t^2}$.** Kubus adalah kasus khusus dengan tiga rusuk sama, dan ia memuat volume terbanyak untuk luas permukaan tertentu. Sebuah batang muat di dalam balok tepat bila ia tidak lebih panjang daripada diagonal ruang.`,
  ),

  keyPoints: [
    L(
      T`A cuboid has $6$ faces, $12$ edges and $8$ corners, like the cube, but its edges come in three lengths: $4$ of length $l$, $4$ of width $w$ and $4$ of height $h$. Opposite faces are equal, and every cube is a cuboid but not the other way round.`,
      T`Balok memiliki $6$ sisi, $12$ rusuk, dan $8$ titik sudut, seperti kubus, tetapi rusuknya ada dalam tiga panjang: $4$ sepanjang $p$, $4$ selebar $l$, dan $4$ setinggi $t$. Sisi yang berhadapan sama, dan setiap kubus adalah balok tetapi tidak sebaliknya.`,
    ),
    L(
      T`Volume $V=lwh$, the base area times the height. Surface area $S=2(lw+lh+wh)$, three pairs of faces. Lateral area, the four walls without top and bottom, $2h(l+w)$.`,
      T`Volume $V=plt$, luas alas kali tinggi. Luas permukaan $L=2(pl+pt+lt)$, tiga pasang sisi. Luas selimut, keempat dinding tanpa atap dan lantai, $2t(p+l)$.`,
    ),
    L(
      T`The face diagonals are $\sqrt{l^2+w^2}$, $\sqrt{l^2+h^2}$ and $\sqrt{w^2+h^2}$, and the space diagonal is $d=\sqrt{l^2+w^2+h^2}$. It makes angles with the edges whose cosines are $\frac ld$, $\frac wd$, $\frac hd$, and the squares of those three cosines add up to $1$.`,
      T`Diagonal sisinya $\sqrt{p^2+l^2}$, $\sqrt{p^2+t^2}$, dan $\sqrt{l^2+t^2}$, dan diagonal ruangnya $d=\sqrt{p^2+l^2+t^2}$. Ia membentuk sudut dengan rusuk yang kosinusnya $\frac pd$, $\frac ld$, $\frac td$, dan kuadrat ketiga kosinus itu berjumlah $1$.`,
    ),
    L(
      T`For a given surface area the cube holds the most: $V\le\left(\frac S6\right)^{3/2}$, with equality only when $l=w=h$. For a given volume the cube has the least surface, $S\ge6V^{2/3}$. Both follow from the inequality of arithmetic and geometric means.`,
      T`Untuk luas permukaan tertentu kubus memuat paling banyak: $V\le\left(\frac S6\right)^{3/2}$, dengan kesamaan hanya bila $p=l=t$. Untuk volume tertentu kubus memiliki luas permukaan paling kecil, $L\ge6V^{2/3}$. Keduanya mengikuti ketaksamaan rata-rata aritmetika dan geometri.`,
    ),
    L(
      T`A straight rod fits inside a box exactly when its length is at most $d$. Small boxes laid all the same way fit $\left\lfloor\frac{L}{a}\right\rfloor\left\lfloor\frac{W}{b}\right\rfloor\left\lfloor\frac{H}{c}\right\rfloor$ times, and the best of the six ways to turn them is the count.`,
      T`Sebuah batang lurus muat di dalam balok tepat bila panjangnya paling besar $d$. Balok-balok kecil yang diletakkan semuanya dengan cara yang sama muat sebanyak $\left\lfloor\frac{P}{a}\right\rfloor\left\lfloor\frac{L}{b}\right\rfloor\left\lfloor\frac{T}{c}\right\rfloor$, dan yang terbaik dari enam cara memutarnya adalah banyaknya.`,
    ),
    L(
      T`Some boxes have a whole-number space diagonal, such as $2\times3\times6$ with $d=7$ (a Pythagorean quadruple). Some have all three face diagonals whole, the smallest being $44\times117\times240$ (an Euler brick). A box with all four whole, a perfect cuboid, is not known to exist.`,
      T`Beberapa balok memiliki diagonal ruang bilangan bulat, seperti $2\times3\times6$ dengan $d=7$ (kuadrupel Pythagoras). Beberapa memiliki ketiga diagonal sisi bulat, yang terkecil $44\times117\times240$ (bata Euler). Balok dengan keempatnya bulat, balok sempurna, belum diketahui ada.`,
    ),
  ],

  sections: [
    /* ---------------------------------------------------------------------------------- what */
    {
      id: 'what-is-a-cuboid',
      heading: L('What is a cuboid, and how is it different from a cube?', 'Apa itu balok, dan apa bedanya dengan kubus?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A cuboid, also called a rectangular box or a rectangular prism, is a solid bounded by six rectangles that meet at right angles; its opposite faces are equal and parallel.** Every corner is a right-angled corner, with three faces and three edges meeting there. The $12$ edges come in three groups of four equal parallel edges, called the *length* $l$, the *width* $w$ and the *height* $h$, and the whole solid is fixed by those three numbers.

| Part | How many | What they are |
|---|---|---|
| faces (*sisi*) | $6$ | three pairs of equal rectangles: $l\times w$, $l\times h$, $w\times h$ |
| edges (*rusuk*) | $12$ | $4$ of length $l$, $4$ of length $w$, $4$ of length $h$ |
| vertices (*titik sudut*) | $8$ | the corners, where three edges meet |

The count obeys Euler’s formula, $V-E+F=8-12+6=2$, exactly as for the cube. The difference between the two is only in the edges: **a cube is a cuboid whose three edges are equal**, so every cube is a cuboid, and a cuboid is a cube only when $l=w=h$. In Indonesian the box is *balok* and the cube *kubus*, and schools write its edges as *panjang* $p$, *lebar* $l$ and *tinggi* $t$. Place a corner at the origin and the opposite corner is $(l,w,h)$: the eight corners are all the points whose coordinates are $0$ or the full edge, which is why the [cube](article:cube#what-is-a-cube) and the box share their counts. A brick, a book, a shoe box, a room and a shipping container are all cuboids.`,
            T`**Balok, disebut juga prisma persegi panjang, adalah bangun ruang yang dibatasi enam persegi panjang yang bertemu pada sudut siku-siku; sisi-sisi yang berhadapan sama dan sejajar.** Setiap titik sudut adalah sudut siku-siku, dengan tiga sisi dan tiga rusuk bertemu di sana. Kedua belas rusuknya terbagi dalam tiga kelompok yang masing-masing empat rusuk sejajar sama panjang, disebut *panjang* $p$, *lebar* $l$, dan *tinggi* $t$, dan seluruh bangun itu ditentukan oleh tiga bilangan tersebut.

| Bagian | Banyaknya | Apa mereka |
|---|---|---|
| sisi (*face*) | $6$ | tiga pasang persegi panjang yang sama: $p\times l$, $p\times t$, $l\times t$ |
| rusuk (*edge*) | $12$ | $4$ sepanjang $p$, $4$ sepanjang $l$, $4$ sepanjang $t$ |
| titik sudut (*vertex*) | $8$ | sudut-sudutnya, tempat tiga rusuk bertemu |

Banyaknya itu memenuhi rumus Euler, $V-E+F=8-12+6=2$, tepat seperti pada kubus. Perbedaan keduanya hanya pada rusuknya: **kubus adalah balok yang ketiga rusuknya sama**, jadi setiap kubus adalah balok, dan balok adalah kubus hanya bila $p=l=t$. Letakkan satu titik sudut di titik asal dan titik sudut yang berhadapan adalah $(p,l,t)$: kedelapan titik sudutnya adalah semua titik yang koordinatnya $0$ atau rusuk penuh, itulah sebabnya [kubus](article:cube#what-is-a-cube) dan balok berbagi banyaknya. Batu bata, buku, kotak sepatu, ruangan, dan peti kemas semuanya balok.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------- volume and surface */
    {
      id: 'volume-and-surface',
      heading: L('How do you find the volume, the surface area and the lateral area of a cuboid?', 'Bagaimana mencari volume, luas permukaan, dan luas selimut balok?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The volume of a cuboid is $V=l\times w\times h$, the surface area is $S=2(lw+lh+wh)$, and the lateral area is $2h(l+w)$.** The volume counts unit cubes: a floor of $l\times w$ of them, piled $h$ layers high, so $V$ is the *base area times the height*. For a box $5\times3\times2$: $V=30$, and $S=2(15+10+6)=62$.

The surface formula comes from the net, the six rectangles laid flat. They come in three equal pairs, $lw$, $lh$ and $wh$, so the surface is twice their sum; for $4\times3\times2$ the pairs are $12$, $8$ and $6$, and $2(12+8+6)=52$. The *lateral area* leaves out the top and the bottom and keeps the four walls: they make one long rectangle as wide as the perimeter of the base, $2(l+w)$, and $h$ high, so the area is $2h(l+w)$. For a box $5\times3\times2$ that is $2\cdot2\cdot8=32$, and the surface is the walls plus top and bottom: $32+2\cdot15=62$.

*Everyday uses.* To paint the walls of a room $6$ m long, $4$ m wide and $3$ m high you need the lateral area $2\cdot3\cdot(6+4)=60$ m² (minus doors and windows); with the ceiling and the floor the whole surface is $108$ m². An aquarium $80$ cm by $35$ cm by $40$ cm holds $80\cdot35\cdot40=112\,000$ cm³ $=112$ litres, since $1000$ cm³ is one litre. *Scaling:* multiplying every edge by $k$ multiplies the surface by $k^2$ and the volume by $k^3$; multiplying only one edge by $k$ multiplies the volume by $k$. Slide the three edges below to see every measure at once.`,
            T`**Volume balok adalah $V=p\times l\times t$, luas permukaannya $L=2(pl+pt+lt)$, dan luas selimutnya $2t(p+l)$.** Volume menghitung kubus satuan: lantai $p\times l$ kubus, ditumpuk $t$ lapis, jadi $V$ adalah *luas alas kali tinggi*. Untuk balok $5\times3\times2$: $V=30$, dan $L=2(15+10+6)=62$.

Rumus luas permukaan berasal dari jaring-jaring, keenam persegi panjang yang dibentangkan. Mereka ada dalam tiga pasang yang sama, $pl$, $pt$, dan $lt$, jadi luas permukaannya dua kali jumlahnya; untuk $4\times3\times2$ pasangannya $12$, $8$, dan $6$, dan $2(12+8+6)=52$. *Luas selimut* meniadakan atas dan bawah dan menyisakan keempat dinding: mereka membentuk satu persegi panjang panjang selebar keliling alas, $2(p+l)$, dan setinggi $t$, sehingga luasnya $2t(p+l)$. Untuk balok $5\times3\times2$ itu $2\cdot2\cdot8=32$, dan luas permukaannya adalah dinding ditambah atas dan bawah: $32+2\cdot15=62$.

*Pemakaian sehari-hari.* Untuk mengecat dinding ruangan sepanjang $6$ m, selebar $4$ m, dan setinggi $3$ m kamu memerlukan luas selimut $2\cdot3\cdot(6+4)=60$ m² (dikurangi pintu dan jendela); dengan langit-langit dan lantai seluruh permukaannya $108$ m². Akuarium $80$ cm kali $35$ cm kali $40$ cm memuat $80\cdot35\cdot40=112.000$ cm³ $=112$ liter, karena $1000$ cm³ adalah satu liter. *Perubahan skala:* mengalikan setiap rusuk dengan $k$ mengalikan luas permukaan dengan $k^2$ dan volume dengan $k^3$; mengalikan hanya satu rusuk dengan $k$ mengalikan volume dengan $k$. Geser ketiga rusuk di bawah untuk melihat semua ukuran sekaligus.`,
          ),
        },
        { kind: 'widget', name: 'bxmeasure' },
        FIG_NET,
      ],
    },

    /* ----------------------------------------------------------------------------- diagonals */
    {
      id: 'diagonals-and-angles',
      heading: L('What are the diagonals of a cuboid, and what angles do they make?', 'Apa saja diagonal balok, dan sudut apa yang dibentuknya?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A cuboid has face diagonals of three lengths, $\sqrt{l^2+w^2}$, $\sqrt{l^2+h^2}$ and $\sqrt{w^2+h^2}$, and four space diagonals, all of the length $d=\sqrt{l^2+w^2+h^2}$.** The face diagonal is the hypotenuse in the face; the space diagonal is the hypotenuse of a second right triangle on a face diagonal and an edge, so $d^2=(l^2+w^2)+h^2$ (this is [the Pythagorean theorem in space](article:pythagorean-theorem#distance-and-diagonals)). For the box $6\times3\times2$ the three face diagonals are $\sqrt{45}\approx6.71$, $\sqrt{40}\approx6.32$ and $\sqrt{13}\approx3.61$, and the space diagonal is $\sqrt{36+9+4}=7$ exactly.

*The angles with the edges.* The diagonal runs from $(0,0,0)$ to $(l,w,h)$, so its projection on the edge along $l$ is $l$ and $\cos\alpha=\frac ld$; likewise $\cos\beta=\frac wd$ and $\cos\gamma=\frac hd$. For $6\times3\times2$ the cosines are $\frac67,\frac37,\frac27$ and the angles $31.0^\circ$, $64.6^\circ$ and $73.4^\circ$. Their squares add up to $\frac{36+9+4}{49}=1$ for every box: $\cos^2\alpha+\cos^2\beta+\cos^2\gamma=1$. In a cube all three angles are $\arccos\frac1{\sqrt3}\approx54.74^\circ$.

*Two space diagonals.* The diagonals $(l,w,h)$ and $(-l,w,h)$ have dot product $-l^2+w^2+h^2$, so they cross at the acute angle with cosine $\frac{|{-l^2}+w^2+h^2|}{d^2}$; the other two kinds of pair give $\frac{|l^2-w^2+h^2|}{d^2}$ and $\frac{|l^2+w^2-h^2|}{d^2}$. For $6\times3\times2$ these are $\frac{23}{49},\frac{31}{49},\frac{41}{49}$, that is $62.0^\circ$, $50.8^\circ$ and $33.2^\circ$. In a cube every pair gives $\frac13$, the $70.53^\circ$ of the [cube](article:cube#diagonals).`,
            T`**Balok memiliki diagonal sisi dalam tiga panjang, $\sqrt{p^2+l^2}$, $\sqrt{p^2+t^2}$, dan $\sqrt{l^2+t^2}$, dan empat diagonal ruang, semuanya sepanjang $d=\sqrt{p^2+l^2+t^2}$.** Diagonal sisi adalah sisi miring dalam sisi itu; diagonal ruang adalah sisi miring segitiga siku-siku kedua pada sebuah diagonal sisi dan sebuah rusuk, sehingga $d^2=(p^2+l^2)+t^2$ (ini [teorema Pythagoras dalam ruang](article:pythagorean-theorem#distance-and-diagonals)). Untuk balok $6\times3\times2$ ketiga diagonal sisinya $\sqrt{45}\approx6{,}71$, $\sqrt{40}\approx6{,}32$, dan $\sqrt{13}\approx3{,}61$, dan diagonal ruangnya $\sqrt{36+9+4}=7$ tepat.

*Sudut dengan rusuk.* Diagonal berjalan dari $(0,0,0)$ ke $(p,l,t)$, sehingga proyeksinya pada rusuk sepanjang $p$ adalah $p$ dan $\cos\alpha=\frac pd$; demikian pula $\cos\beta=\frac ld$ dan $\cos\gamma=\frac td$. Untuk $6\times3\times2$ kosinusnya $\frac67,\frac37,\frac27$ dan sudutnya $31{,}0^\circ$, $64{,}6^\circ$, dan $73{,}4^\circ$. Kuadratnya berjumlah $\frac{36+9+4}{49}=1$ untuk setiap balok: $\cos^2\alpha+\cos^2\beta+\cos^2\gamma=1$. Pada kubus ketiga sudutnya $\arccos\frac1{\sqrt3}\approx54{,}74^\circ$.

*Dua diagonal ruang.* Diagonal $(p,l,t)$ dan $(-p,l,t)$ memiliki hasil kali titik $-p^2+l^2+t^2$, sehingga keduanya berpotongan pada sudut lancip dengan kosinus $\frac{|{-p^2}+l^2+t^2|}{d^2}$; dua jenis pasangan lainnya memberi $\frac{|p^2-l^2+t^2|}{d^2}$ dan $\frac{|p^2+l^2-t^2|}{d^2}$. Untuk $6\times3\times2$ nilainya $\frac{23}{49},\frac{31}{49},\frac{41}{49}$, yaitu $62{,}0^\circ$, $50{,}8^\circ$, dan $33{,}2^\circ$. Pada kubus setiap pasangan memberi $\frac13$, yaitu $70{,}53^\circ$ pada [kubus](article:cube#diagonals).`,
          ),
        },
        FIG_BOX,
      ],
    },

    /* ----------------------------------------------------------------------- whole diagonals */
    {
      id: 'whole-number-diagonals',
      heading: L('Which boxes have whole-number diagonals: Pythagorean quadruples, Euler bricks and the perfect cuboid?', 'Balok mana yang diagonalnya bilangan bulat: kuadrupel Pythagoras, bata Euler, dan balok sempurna?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A box with whole-number edges has a whole-number space diagonal when $a^2+b^2+c^2=d^2$, a Pythagorean quadruple, such as $2\times3\times6$ with $d=7$ or $3\times4\times12$ with $d=13$.** Most boxes do not: the box $5\times3\times2$ has $d=\sqrt{38}$. The quadruples with $d\le15$ that cannot be shrunk to a smaller one are:

| $a$ | $b$ | $c$ | $d$ | Check |
|---|---|---|---|---|
| $1$ | $2$ | $2$ | $3$ | $1+4+4=9$ |
| $2$ | $3$ | $6$ | $7$ | $4+9+36=49$ |
| $1$ | $4$ | $8$ | $9$ | $1+16+64=81$ |
| $4$ | $4$ | $7$ | $9$ | $16+16+49=81$ |
| $2$ | $6$ | $9$ | $11$ | $4+36+81=121$ |
| $6$ | $6$ | $7$ | $11$ | $36+36+49=121$ |
| $3$ | $4$ | $12$ | $13$ | $9+16+144=169$ |
| $2$ | $5$ | $14$ | $15$ | $4+25+196=225$ |
| $2$ | $10$ | $11$ | $15$ | $4+100+121=225$ |

Multiplying a quadruple by a whole number gives another, such as $2\times4\times4$ with $d=6$. There is a formula that makes them from any four whole numbers $m,n,p,q$: take $a=m^2+n^2-p^2-q^2$, $b=2(mq+np)$, $c=2(nq-mp)$ and $d=m^2+n^2+p^2+q^2$, and $a^2+b^2+c^2=d^2$. With $(m,n,p,q)=(2,1,1,1)$ it gives $(3,6,-2)$ and $d=7$, the box $2\times3\times6$.

A harder wish is that the *three face diagonals* should be whole numbers. Such a box is an **Euler brick**, and the smallest is $44\times117\times240$, whose face diagonals are $\sqrt{44^2+117^2}=125$, $\sqrt{44^2+240^2}=244$ and $\sqrt{117^2+240^2}=267$. Its space diagonal, though, is $\sqrt{73\,225}\approx270.6$, not whole. A **perfect cuboid** would have all three face diagonals *and* the space diagonal whole. Nobody has found one, nobody has proved that none exists, and computer searches through very large boxes have found none: a search through all edges up to $1500$ finds eight Euler bricks and no perfect cuboid. Type edges in the widget to see which diagonals are whole.`,
            T`**Balok dengan rusuk bilangan bulat memiliki diagonal ruang bilangan bulat bila $a^2+b^2+c^2=d^2$, sebuah kuadrupel Pythagoras, seperti $2\times3\times6$ dengan $d=7$ atau $3\times4\times12$ dengan $d=13$.** Kebanyakan balok tidak: balok $5\times3\times2$ memiliki $d=\sqrt{38}$. Kuadrupel dengan $d\le15$ yang tak dapat diperkecil menjadi yang lebih kecil adalah:

| $a$ | $b$ | $c$ | $d$ | Pemeriksaan |
|---|---|---|---|---|
| $1$ | $2$ | $2$ | $3$ | $1+4+4=9$ |
| $2$ | $3$ | $6$ | $7$ | $4+9+36=49$ |
| $1$ | $4$ | $8$ | $9$ | $1+16+64=81$ |
| $4$ | $4$ | $7$ | $9$ | $16+16+49=81$ |
| $2$ | $6$ | $9$ | $11$ | $4+36+81=121$ |
| $6$ | $6$ | $7$ | $11$ | $36+36+49=121$ |
| $3$ | $4$ | $12$ | $13$ | $9+16+144=169$ |
| $2$ | $5$ | $14$ | $15$ | $4+25+196=225$ |
| $2$ | $10$ | $11$ | $15$ | $4+100+121=225$ |

Mengalikan sebuah kuadrupel dengan bilangan bulat memberi yang lain, seperti $2\times4\times4$ dengan $d=6$. Ada rumus yang membuatnya dari empat bilangan bulat mana pun $m,n,p,q$: ambil $a=m^2+n^2-p^2-q^2$, $b=2(mq+np)$, $c=2(nq-mp)$, dan $d=m^2+n^2+p^2+q^2$, maka $a^2+b^2+c^2=d^2$. Dengan $(m,n,p,q)=(2,1,1,1)$ ia memberi $(3,6,-2)$ dan $d=7$, balok $2\times3\times6$.

Keinginan yang lebih sulit adalah agar *ketiga diagonal sisi* bilangan bulat. Balok seperti itu adalah **bata Euler**, dan yang terkecil $44\times117\times240$, yang diagonal sisinya $\sqrt{44^2+117^2}=125$, $\sqrt{44^2+240^2}=244$, dan $\sqrt{117^2+240^2}=267$. Diagonal ruangnya, meski begitu, $\sqrt{73.225}\approx270{,}6$, tidak bulat. **Balok sempurna** akan memiliki ketiga diagonal sisi *dan* diagonal ruang bulat. Belum ada yang menemukannya, belum ada yang membuktikan bahwa ia tak ada, dan pencarian komputer pada balok yang sangat besar tidak menemukan satu pun: pencarian pada semua rusuk sampai $1500$ menemukan delapan bata Euler dan tak ada balok sempurna. Ketik rusuk di widget untuk melihat diagonal mana yang bulat.`,
          ),
        },
        { kind: 'widget', name: 'bxfit' },
      ],
    },

    /* ----------------------------------------------------------------------- same surface */
    {
      id: 'largest-volume-for-a-surface',
      heading: L('Which cuboid has the largest volume for a given surface area?', 'Balok mana yang volumenya terbesar untuk luas permukaan tertentu?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**For a given surface area $S$ the cube holds the most: every cuboid satisfies $V\le\left(\frac S6\right)^{3/2}$, with equality only when $l=w=h$.** The reason is the inequality of arithmetic and geometric means: for three positive numbers the geometric mean is at most the arithmetic mean. Apply it to the three face areas $lw$, $lh$ and $wh$. Their product is $(lw)(lh)(wh)=(lwh)^2=V^2$ and their sum is $\frac S2$, so
$$V^{2/3}=\sqrt[3]{(lw)(lh)(wh)}\le\frac{lw+lh+wh}{3}=\frac S6,$$
and $V\le\left(\frac S6\right)^{3/2}$, with equality only if $lw=lh=wh$, which means $l=w=h$. For $S=96$ the bound is $16^{3/2}=64$, reached by the cube of edge $4$. Other boxes with the same surface:

| Box | $S$ | $V$ |
|---|---|---|
| $4\times4\times4$ | $96$ | $64$ |
| $6\times4\times2.4$ | $96$ | $57.6$ |
| $10\times2\times2\frac13$ | $96$ | $46\frac23$ |
| $8\times4\times1\frac13$ | $96$ | $42\frac23$ |
| $12\times3\times0.8$ | $96$ | $28.8$ |

The same fact the other way round: for a given volume the cube has the *smallest* surface, $S\ge6V^{2/3}$. For $V=64$ that is $96$ for the cube, against $112$ for $8\times4\times2$, $136$ for $16\times2\times2$ and $160$ for $8\times8\times1$. And for a wire frame, where the twelve edges together are fixed, $4(l+w+h)=48$ gives $l+w+h=12$ and $V\le\left(\frac{12}{3}\right)^3=64$: again the cube. The same box problems with calculus, an open-top box cut from a sheet, are in [applied optimization](article:applied-optimization#geometry). Move the base of a box below and watch how far it falls short of the cube.`,
            T`**Untuk luas permukaan $L$ tertentu kubus memuat paling banyak: setiap balok memenuhi $V\le\left(\frac L6\right)^{3/2}$, dengan kesamaan hanya bila $p=l=t$.** Alasannya adalah ketaksamaan rata-rata aritmetika dan geometri: untuk tiga bilangan positif rata-rata geometri paling besar sama dengan rata-rata aritmetika. Terapkan pada ketiga luas sisi $pl$, $pt$, dan $lt$. Hasil kalinya $(pl)(pt)(lt)=(plt)^2=V^2$ dan jumlahnya $\frac L2$, sehingga
$$V^{2/3}=\sqrt[3]{(pl)(pt)(lt)}\le\frac{pl+pt+lt}{3}=\frac L6,$$
dan $V\le\left(\frac L6\right)^{3/2}$, dengan kesamaan hanya bila $pl=pt=lt$, yang berarti $p=l=t$. Untuk $L=96$ batasnya $16^{3/2}=64$, dicapai kubus berusuk $4$. Balok lain dengan luas permukaan yang sama:

| Balok | $L$ | $V$ |
|---|---|---|
| $4\times4\times4$ | $96$ | $64$ |
| $6\times4\times2{,}4$ | $96$ | $57{,}6$ |
| $10\times2\times2\frac13$ | $96$ | $46\frac23$ |
| $8\times4\times1\frac13$ | $96$ | $42\frac23$ |
| $12\times3\times0{,}8$ | $96$ | $28{,}8$ |

Fakta yang sama dari arah sebaliknya: untuk volume tertentu kubus memiliki luas permukaan *terkecil*, $L\ge6V^{2/3}$. Untuk $V=64$ itu $96$ untuk kubus, dibanding $112$ untuk $8\times4\times2$, $136$ untuk $16\times2\times2$, dan $160$ untuk $8\times8\times1$. Dan untuk kerangka kawat, tempat kedua belas rusuk bersama-sama tetap, $4(p+l+t)=48$ memberi $p+l+t=12$ dan $V\le\left(\frac{12}{3}\right)^3=64$: lagi-lagi kubus. Soal balok yang sama dengan kalkulus, kotak tanpa tutup dari selembar bahan, ada di [optimisasi terapan](article:applied-optimization#geometry). Geser alas sebuah balok di bawah dan lihat seberapa jauh ia kalah dari kubus.`,
          ),
        },
        { kind: 'widget', name: 'bxsame' },
      ],
    },

    /* --------------------------------------------------------------------------- fitting */
    {
      id: 'fitting-things-in',
      heading: L('How do you know whether a rod, a plank or a pile of smaller boxes fits inside a box?', 'Bagaimana mengetahui apakah batang, papan, atau tumpukan balok yang lebih kecil muat di dalam balok?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A thin straight rod fits inside a box exactly when its length is at most the space diagonal $d=\sqrt{l^2+w^2+h^2}$, the longest straight segment the box contains; it just fits, corner to corner, when it is equal to $d$.** A $1$ m pole against a box $60\times40\times40$ cm: $d=\sqrt{3600+1600+1600}=\sqrt{6800}\approx82.5$ cm, so it does not fit, however it is tilted. In a box $80\times50\times40$ cm, $d=\sqrt{10\,500}\approx102.5$ cm, so it does, leaning from a bottom corner towards the opposite top corner. A rod longer than every face diagonal must lie across the inside, never along a face.

*A flat sheet* is different: a rectangle fits in a box if it fits through some cross-section of it, and the largest is the diagonal rectangle through two opposite edges, $l\times\sqrt{w^2+h^2}$, of area $l\sqrt{w^2+h^2}$; for the box $6\times3\times2$ that is $6\times\sqrt{13}$.

*Smaller boxes.* To know how many boxes $a\times b\times c$ fit in a big box $L\times W\times H$ when they are all laid the same way, count how many fit along each side: $\left\lfloor\frac{L}{a}\right\rfloor\cdot\left\lfloor\frac{W}{b}\right\rfloor\cdot\left\lfloor\frac{H}{c}\right\rfloor$, and try the six ways to turn the small box, taking the best. Bricks $3\times2\times1$ in a box $10\times6\times4$ fit $5\cdot2\cdot4=40$ times, using each of the $240$ units of volume ($40\cdot6=240$); cartons $30\times20\times10$ cm fill a space $120\times80\times60$ cm with $4\cdot4\cdot6=96$ cartons. The volume bound is always an upper limit: $\frac{V_{\text{big}}}{V_{\text{small}}}$, and when the edges do not divide evenly, the leftover space is wasted. Turning some of the boxes the other way can sometimes fit more than any single arrangement, which is why packing is a hard problem.`,
            T`**Batang lurus yang tipis muat di dalam balok tepat bila panjangnya paling besar sama dengan diagonal ruang $d=\sqrt{p^2+l^2+t^2}$, ruas lurus terpanjang yang termuat dalam balok; ia tepat muat, dari sudut ke sudut, bila sama dengan $d$.** Tiang $1$ m pada kotak $60\times40\times40$ cm: $d=\sqrt{3600+1600+1600}=\sqrt{6800}\approx82{,}5$ cm, sehingga ia tidak muat, semiring apa pun. Pada kotak $80\times50\times40$ cm, $d=\sqrt{10.500}\approx102{,}5$ cm, sehingga ia muat, bersandar dari sudut bawah ke sudut atas yang berhadapan. Batang yang lebih panjang daripada setiap diagonal sisi harus terletak melintasi bagian dalam, tak pernah menurut sebuah sisi.

*Lembaran datar* berbeda: sebuah persegi panjang muat dalam balok bila muat melalui suatu irisannya, dan yang terbesar adalah persegi panjang diagonal melalui dua rusuk yang berhadapan, $p\times\sqrt{l^2+t^2}$, dengan luas $p\sqrt{l^2+t^2}$; untuk balok $6\times3\times2$ itu $6\times\sqrt{13}$.

*Balok yang lebih kecil.* Untuk mengetahui berapa balok $a\times b\times c$ yang muat dalam balok besar $P\times L\times T$ bila semuanya diletakkan dengan cara yang sama, hitung berapa yang muat sepanjang tiap sisi: $\left\lfloor\frac{P}{a}\right\rfloor\cdot\left\lfloor\frac{L}{b}\right\rfloor\cdot\left\lfloor\frac{T}{c}\right\rfloor$, dan coba keenam cara memutar balok kecil itu, ambil yang terbaik. Batu bata $3\times2\times1$ dalam kotak $10\times6\times4$ muat $5\cdot2\cdot4=40$, memakai setiap dari $240$ satuan volume ($40\cdot6=240$); karton $30\times20\times10$ cm memenuhi ruang $120\times80\times60$ cm dengan $4\cdot4\cdot6=96$ karton. Batas volume selalu batas atas: $\frac{V_{\text{besar}}}{V_{\text{kecil}}}$, dan bila rusuknya tak habis dibagi, ruang yang tersisa terbuang. Memutar sebagian balok ke arah lain terkadang dapat memuat lebih banyak daripada satu susunan tunggal mana pun, itulah sebabnya pengepakan adalah masalah yang sulit.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------------------- code */
    {
      id: 'cuboid-in-code',
      heading: L('How do you work with a cuboid in a program?', 'Bagaimana bekerja dengan balok dalam program?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A program computes the measures of a box from three numbers, and finds whole-number diagonals by searching: loop over $a\le b\le c$, take the integer square root of $a^2+b^2+c^2$, and keep the boxes for which squaring it gives the sum back.** Use whole numbers and an exact integer square root (´isqrt´ in Python), not a floating-point ´sqrt´ rounded and compared, because a rounded square root of a large integer can be off by one. The programs below print the measures of $5\times3\times2$, the quadruples with $d\le9$, whether $44\times117\times240$ and $2\times3\times6$ are Euler bricks, and whether the first has a whole space diagonal.`,
            T`**Program menghitung ukuran balok dari tiga bilangan, dan menemukan diagonal bilangan bulat dengan mencari: lakukan perulangan pada $a\le b\le c$, ambil akar kuadrat bilangan bulat dari $a^2+b^2+c^2$, dan simpan balok yang kuadratnya mengembalikan jumlahnya.** Pakai bilangan bulat dan akar kuadrat bilangan bulat yang eksak (´isqrt´ di Python), bukan ´sqrt´ floating-point yang dibulatkan dan dibandingkan, karena akar kuadrat yang dibulatkan dari bilangan bulat besar dapat meleset satu. Program di bawah mencetak ukuran $5\times3\times2$, kuadrupel dengan $d\le9$, apakah $44\times117\times240$ dan $2\times3\times6$ adalah bata Euler, dan apakah yang pertama memiliki diagonal ruang bulat.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: measures, quadruples and Euler bricks', 'Python: ukuran, kuadrupel, dan bata Euler'),
          code: `from math import isqrt, sqrt


def box(l, w, h):
    return {
        'volume': l * w * h,
        'surface': 2 * (l * w + l * h + w * h),
        'lateral': 2 * h * (l + w),
        'space diagonal': round(sqrt(l * l + w * w + h * h), 3),
    }


def is_square(n):
    return isqrt(n) ** 2 == n


def quadruples(max_d):
    """The boxes a <= b <= c whose space diagonal d <= max_d is a whole number: a² + b² + c² = d²."""
    found = []
    for a in range(1, max_d):
        for b in range(a, max_d):
            for c in range(b, max_d):
                s = a * a + b * b + c * c
                if s <= max_d ** 2 and is_square(s):
                    found.append((a, b, c, isqrt(s)))
    return sorted(found, key=lambda q: (q[3], q[:3]))


def euler_brick(a, b, c):
    """All three face diagonals are whole numbers."""
    return all(is_square(x * x + y * y) for x, y in ((a, b), (a, c), (b, c)))


print(box(5, 3, 2))                  # {'volume': 30, 'surface': 62, 'lateral': 32, 'space diagonal': 6.164}
print(quadruples(9))                 # [(1, 2, 2, 3), (2, 4, 4, 6), (2, 3, 6, 7), (1, 4, 8, 9), (3, 6, 6, 9), (4, 4, 7, 9)]
print(euler_brick(44, 117, 240), euler_brick(2, 3, 6))    # True False
print(is_square(44 ** 2 + 117 ** 2 + 240 ** 2))           # False: no perfect cuboid here`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: the same', 'JavaScript: yang sama'),
          code: `const box = (l, w, h) => ({ volume: l * w * h, surface: 2 * (l * w + l * h + w * h), lateral: 2 * h * (l + w), spaceDiagonal: +Math.sqrt(l * l + w * w + h * h).toFixed(3) })
const isSquare = (n) => Number.isInteger(Math.sqrt(n))

// the boxes a <= b <= c whose space diagonal d <= maxD is a whole number: a² + b² + c² = d²
function quadruples(maxD) {
  const found = []
  for (let a = 1; a < maxD; a++)
    for (let b = a; b < maxD; b++)
      for (let c = b; c < maxD; c++) {
        const s = a * a + b * b + c * c
        if (s <= maxD * maxD && isSquare(s)) found.push([a, b, c, Math.sqrt(s)])
      }
  return found.sort((p, q) => p[3] - q[3] || p[0] - q[0] || p[1] - q[1])
}

// all three face diagonals are whole numbers
const eulerBrick = (a, b, c) => [[a, b], [a, c], [b, c]].every(([x, y]) => isSquare(x * x + y * y))

box(5, 3, 2)                                   // { volume: 30, surface: 62, lateral: 32, spaceDiagonal: 6.164 }
quadruples(9)                                  // [[1,2,2,3], [2,4,4,6], [2,3,6,7], [1,4,8,9], [3,6,6,9], [4,4,7,9]]
;[eulerBrick(44, 117, 240), eulerBrick(2, 3, 6)]   // [true, false]
isSquare(44 ** 2 + 117 ** 2 + 240 ** 2)        // false`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++: the same with integers', 'C++: yang sama dengan bilangan bulat'),
          code: `#include <iostream>
#include <cstdio>
#include <cmath>
using namespace std;

// 1 when n is a perfect square
int isSquare(int n) {
  int r = (int)(sqrt((double)n) + 0.5);
  return r * r == n ? 1 : 0;
}

// 1 when all three face diagonals are whole numbers
int eulerBrick(int a, int b, int c) {
  return isSquare(a * a + b * b) && isSquare(a * a + c * c) && isSquare(b * b + c * c) ? 1 : 0;
}

int main() {
  int l = 5;
  int w = 3;
  int h = 2;
  printf("volume %d; surface %d; lateral %d\\n", l * w * h, 2 * (l * w + l * h + w * h), 2 * h * (l + w));
  printf("space diagonal %.3f\\n", sqrt((double)(l * l + w * w + h * h)));

  // a <= b <= c with a * a + b * b + c * c = d * d, d up to 9
  for (int d = 2; d <= 9; d++) {
    for (int a = 1; a < d; a++) {
      for (int b = a; b < d; b++) {
        for (int c = b; c < d; c++) {
          if (a * a + b * b + c * c == d * d) printf("%d %d %d %d\\n", a, b, c, d);
        }
      }
    }
  }
  printf("%d %d\\n", eulerBrick(44, 117, 240), eulerBrick(2, 3, 6));
  printf("%d\\n", isSquare(44 * 44 + 117 * 117 + 240 * 240));
  return 0;
}

/* output:
volume 30; surface 62; lateral 32
space diagonal 6.164
1 2 2 3
2 4 4 6
2 3 6 7
1 4 8 9
3 6 6 9
4 4 7 9
1 0
0
*/`,
        },
      ],
    },

    /* ---------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where does the study of boxes and their diagonals come from?', 'Dari mana asal kajian tentang balok dan diagonalnya?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**People have measured boxes for as long as there has been building, storing and trading, and the questions about their diagonals turned into number theory.**

- **About 300 BCE.** Euclid’s *Elements*, Book XI, studies solids bounded by parallelograms and proves that two such solids of the same height are in the ratio of their bases (XI.32): the root of *volume equals base times height*.
- **1719.** Paul Halcke finds the box $44\times117\times240$ whose three face diagonals are whole numbers, the smallest of the bricks that bear Euler’s name; Euler later studied them and found families of others.
- **The 18th and 19th centuries.** The Pythagorean quadruples, the boxes with a whole space diagonal, are described and their formulas found, including the one that makes them from four whole numbers.
- **The perfect cuboid.** Whether a box can have all three face diagonals and the space diagonal whole at once is still open: not one is known, and searches by computer through very large boxes have found none.
- **Today.** The same formulas run inside every shipping calculator, 3D engine and storage layout: the *bounding box* of a shape in a game is a cuboid, and its diagonal is the quickest measure of its size.`,
            T`**Orang mengukur balok selama ada bangunan, penyimpanan, dan perdagangan, dan pertanyaan tentang diagonalnya berubah menjadi teori bilangan.**

- **Sekitar 300 SM.** *Elements* Euclid, Buku XI, mempelajari bangun ruang yang dibatasi jajar genjang dan membuktikan bahwa dua bangun seperti itu yang sama tingginya berbanding seperti alasnya (XI.32): akar dari *volume sama dengan alas kali tinggi*.
- **1719.** Paul Halcke menemukan balok $44\times117\times240$ yang ketiga diagonal sisinya bilangan bulat, bata terkecil yang memakai nama Euler; Euler kemudian mempelajarinya dan menemukan keluarga yang lain.
- **Abad ke-18 dan ke-19.** Kuadrupel Pythagoras, balok dengan diagonal ruang bulat, diuraikan dan rumusnya ditemukan, termasuk yang membuatnya dari empat bilangan bulat.
- **Balok sempurna.** Apakah sebuah balok dapat memiliki ketiga diagonal sisi dan diagonal ruang yang bulat sekaligus masih terbuka: belum ada yang diketahui, dan pencarian komputer pada balok yang sangat besar tidak menemukan satu pun.
- **Sekarang.** Rumus yang sama berjalan di dalam setiap kalkulator pengiriman, mesin 3D, dan tata letak gudang: *kotak pembatas* sebuah bentuk dalam game adalah balok, dan diagonalnya ukuran tercepat untuk besarnya.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What are the common mistakes with the cuboid?', 'Apa kesalahan umum pada balok?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with the cuboid are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ Surface area $=lwh$ | That is the volume. The surface is $2(lw+lh+wh)$. |
| ❌ Surface area $=lw+lh+wh$ | Each kind of face appears twice: $2(lw+lh+wh)$. |
| ❌ Lateral area includes the top and the bottom | The lateral area is the four walls only: $2h(l+w)$. |
| ❌ The space diagonal is $\sqrt{l^2+w^2}$ or $l+w+h$ | $\sqrt{l^2+w^2}$ is a face diagonal; the space diagonal is $\sqrt{l^2+w^2+h^2}$. |
| ❌ Edges in cm, volume in litres, no conversion | $1000$ cm³ is one litre: convert units before multiplying. |
| ❌ Doubling every edge doubles the volume | The volume is $8$ times as large, the surface $4$ times. |
| ❌ A rod longer than every face diagonal cannot fit | It fits if it is at most the space diagonal, leaning across the box. |
| ❌ A cube and a box of the same volume have the same surface | The cube has the least: for $V=64$, $96$ against $112$ for $8\times4\times2$. |
| ❌ Whole-number edges give a whole-number diagonal | $5\times3\times2$ has $d=\sqrt{38}$; only quadruples like $(2,3,6,7)$ do. |`,
            T`**Kesalahan paling umum pada balok adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ Luas permukaan $=plt$ | Itu volume. Luas permukaannya $2(pl+pt+lt)$. |
| ❌ Luas permukaan $=pl+pt+lt$ | Tiap jenis sisi muncul dua kali: $2(pl+pt+lt)$. |
| ❌ Luas selimut memuat atas dan bawah | Luas selimut hanya keempat dinding: $2t(p+l)$. |
| ❌ Diagonal ruang adalah $\sqrt{p^2+l^2}$ atau $p+l+t$ | $\sqrt{p^2+l^2}$ adalah diagonal sisi; diagonal ruang adalah $\sqrt{p^2+l^2+t^2}$. |
| ❌ Rusuk dalam cm, volume dalam liter, tanpa konversi | $1000$ cm³ adalah satu liter: ubah satuan sebelum mengalikan. |
| ❌ Menggandakan setiap rusuk menggandakan volume | Volumenya $8$ kali lipat, luas permukaannya $4$ kali. |
| ❌ Batang yang lebih panjang daripada setiap diagonal sisi tak dapat muat | Ia muat bila paling besar sama dengan diagonal ruang, miring melintasi balok. |
| ❌ Kubus dan balok dengan volume sama memiliki luas permukaan sama | Kubus memiliki yang terkecil: untuk $V=64$, $96$ dibanding $112$ untuk $8\times4\times2$. |
| ❌ Rusuk bilangan bulat memberi diagonal bilangan bulat | $5\times3\times2$ memiliki $d=\sqrt{38}$; hanya kuadrupel seperti $(2,3,6,7)$ yang demikian. |`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------- practice */
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
              L(T`A cuboid has $12$ edges and $8$ corners.`, T`Balok memiliki $12$ rusuk dan $8$ titik sudut.`),
              L(T`The surface area of a cuboid is $lwh$.`, T`Luas permukaan balok adalah $plt$.`),
              L(T`Every cube is a cuboid.`, T`Setiap kubus adalah balok.`),
              L(T`Every cuboid is a cube.`, T`Setiap balok adalah kubus.`),
              L(T`The space diagonal of a cuboid is $\sqrt{l^2+w^2+h^2}$.`, T`Diagonal ruang balok adalah $\sqrt{p^2+l^2+t^2}$.`),
              L(T`A rod longer than the space diagonal can still fit if it is tilted.`, T`Batang yang lebih panjang daripada diagonal ruang masih dapat muat bila dimiringkan.`),
            ],
            answer: [true, false, true, false, true, false],
            explain: L(
              T`$lwh$ is the volume; the surface is $2(lw+lh+wh)$. A cube has three equal edges, so it is a cuboid, but a cuboid with unequal edges is not a cube. The space diagonal is the longest straight segment in the box, so nothing longer fits however it is tilted.`,
              T`$plt$ adalah volume; luas permukaannya $2(pl+pt+lt)$. Kubus memiliki tiga rusuk sama, jadi ia balok, tetapi balok dengan rusuk tak sama bukan kubus. Diagonal ruang adalah ruas lurus terpanjang dalam balok, jadi tak ada yang lebih panjang yang muat semiring apa pun.`,
            ),
            hint: L(T`Compare each formula with its units, and think of a box with edges $1$, $2$, $3$ as a test for “every”.`, T`Bandingkan tiap rumus dengan satuannya, dan pikirkan balok dengan rusuk $1$, $2$, $3$ sebagai uji untuk “setiap”.`),
          },
        },
        {
          kind: 'activity',
          title: L('Volume', 'Volume'),
          step: {
            kind: 'math',
            id: 'p2',
            hints: [L(T`$V=l\cdot w\cdot h$.`, T`$V=p\cdot l\cdot t$.`), L(T`$8\cdot5\cdot3$.`, T`$8\cdot5\cdot3$.`)],
            explain: L(T`$8\cdot5\cdot3=120$.`, T`$8\cdot5\cdot3=120$.`),
            prompt: L(T`What is the volume of a box $8$ cm by $5$ cm by $3$ cm, in cm³?`, T`Berapa volume balok $8$ cm kali $5$ cm kali $3$ cm, dalam cm³?`),
            given: String.raw`V=v`,
            blanks: [{ label: 'V =', answer: 120 }],
          },
        },
        {
          kind: 'activity',
          title: L('Surface area', 'Luas permukaan'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L(T`Three pairs of faces: $2(lw+lh+wh)$.`, T`Tiga pasang sisi: $2(pl+pt+lt)$.`), L(T`$2(40+24+15)$.`, T`$2(40+24+15)$.`)],
            explain: L(T`$2(8\cdot5+8\cdot3+5\cdot3)=2(40+24+15)=158$.`, T`$2(8\cdot5+8\cdot3+5\cdot3)=2(40+24+15)=158$.`),
            prompt: L(T`What is the surface area of the box $8\times5\times3$ cm, in cm²?`, T`Berapa luas permukaan balok $8\times5\times3$ cm, dalam cm²?`),
            given: String.raw`S=v`,
            blanks: [{ label: 'S =', answer: 158 }],
          },
        },
        {
          kind: 'activity',
          title: L('Painting the walls', 'Mengecat dinding'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L(T`The four walls: $2h(l+w)$.`, T`Keempat dinding: $2t(p+l)$.`), L(T`$2\cdot3\cdot(6+4)$.`, T`$2\cdot3\cdot(6+4)$.`)],
            explain: L(T`$2\cdot3\cdot10=60$ m²: two walls of $6\times3$ and two of $4\times3$.`, T`$2\cdot3\cdot10=60$ m²: dua dinding $6\times3$ dan dua $4\times3$.`),
            prompt: L(T`A room is $6$ m long, $4$ m wide and $3$ m high. What is the area of its four walls, in m²?`, T`Sebuah ruangan panjangnya $6$ m, lebarnya $4$ m, dan tingginya $3$ m. Berapa luas keempat dindingnya, dalam m²?`),
            given: String.raw`A=v`,
            blanks: [{ label: 'A =', answer: 60 }],
          },
        },
        {
          kind: 'activity',
          title: L('The missing edge', 'Rusuk yang hilang'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [L(T`$V=(\text{base area})\cdot h$, and the base area is $6\cdot5=30$.`, T`$V=(\text{luas alas})\cdot t$, dan luas alasnya $6\cdot5=30$.`), L(T`$150\div30$.`, T`$150\div30$.`)],
            explain: L(T`$h=\frac{V}{lw}=\frac{150}{30}=5$.`, T`$t=\frac{V}{pl}=\frac{150}{30}=5$.`),
            prompt: L(T`A box has a base $6$ by $5$ and a volume of $150$. How high is it?`, T`Sebuah balok beralas $6$ kali $5$ dan bervolume $150$. Berapa tingginya?`),
            given: String.raw`h=v`,
            blanks: [{ label: 'h =', answer: 5 }],
          },
        },
        {
          kind: 'activity',
          title: L('A whole diagonal', 'Diagonal bulat'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L(T`$d=\sqrt{l^2+w^2+h^2}$.`, T`$d=\sqrt{p^2+l^2+t^2}$.`), L(T`$4+9+36=49$.`, T`$4+9+36=49$.`)],
            explain: L(T`$d=\sqrt{4+9+36}=\sqrt{49}=7$: $(2,3,6,7)$ is a Pythagorean quadruple.`, T`$d=\sqrt{4+9+36}=\sqrt{49}=7$: $(2,3,6,7)$ adalah kuadrupel Pythagoras.`),
            prompt: L(T`What is the space diagonal of a box $2\times3\times6$?`, T`Berapa diagonal ruang balok $2\times3\times6$?`),
            given: String.raw`d=v`,
            blanks: [{ label: 'd =', answer: 7 }],
          },
        },
        {
          kind: 'activity',
          title: L('Does the rod fit?', 'Apakah batang muat?'),
          step: {
            kind: 'quiz',
            id: 'p7',
            prompt: L('Which of these boxes (in cm) can hold a straight rod 120 cm long?', 'Balok mana (dalam cm) yang dapat memuat batang lurus sepanjang 120 cm?'),
            options: [L('80 × 60 × 50', '80 × 60 × 50'), L('70 × 60 × 50', '70 × 60 × 50'), L('90 × 70 × 60', '90 × 70 × 60'), L('100 × 40 × 30', '100 × 40 × 30')],
            answer: 2,
            explain: L('The space diagonals are $\\sqrt{12\\,500}\\approx111.8$, $\\sqrt{10\\,700}\\approx103.4$, $\\sqrt{16\\,600}\\approx128.8$ and $\\sqrt{12\\,500}\\approx111.8$. Only $90\\times70\\times60$ has a diagonal of at least $120$.', 'Diagonal ruangnya $\\sqrt{12.500}\\approx111{,}8$, $\\sqrt{10.700}\\approx103{,}4$, $\\sqrt{16.600}\\approx128{,}8$, dan $\\sqrt{12.500}\\approx111{,}8$. Hanya $90\\times70\\times60$ yang diagonalnya sedikitnya $120$.'),
            hint: L('A rod fits when it is not longer than the space diagonal: compute l² + w² + h² and compare with 120² = 14 400.', 'Batang muat bila tidak lebih panjang daripada diagonal ruang: hitung p² + l² + t² dan bandingkan dengan 120² = 14.400.'),
          },
        },
        {
          kind: 'activity',
          title: L('Pythagorean quadruples', 'Kuadrupel Pythagoras'),
          step: {
            kind: 'multi',
            id: 'p8',
            prompt: L('Which of these are Pythagorean quadruples, with a² + b² + c² = d²? Choose **all** that apply.', 'Mana dari berikut yang merupakan kuadrupel Pythagoras, dengan a² + b² + c² = d²? Pilih **semua** yang benar.'),
            options: [L('(1, 2, 2, 3)', '(1, 2, 2, 3)'), L('(2, 3, 6, 7)', '(2, 3, 6, 7)'), L('(2, 3, 4, 5)', '(2, 3, 4, 5)'), L('(4, 4, 7, 9)', '(4, 4, 7, 9)'), L('(1, 1, 1, 2)', '(1, 1, 1, 2)')],
            answer: [0, 1, 3],
            explain: L(T`$1+4+4=9$, $4+9+36=49$ and $16+16+49=81$ work. $4+9+16=29$ is not a square, and $1+1+1=3$ is not $4$.`, T`$1+4+4=9$, $4+9+36=49$, dan $16+16+49=81$ berlaku. $4+9+16=29$ bukan kuadrat, dan $1+1+1=3$ bukan $4$.`),
            hint: L('Add the three squares and compare with d².', 'Jumlahkan ketiga kuadrat dan bandingkan dengan d².'),
          },
        },
        {
          kind: 'activity',
          title: L('Scaling', 'Perubahan skala'),
          step: {
            kind: 'quiz',
            id: 'p9',
            prompt: L('Every edge of a box is doubled. By what factor does the volume grow?', 'Setiap rusuk balok digandakan. Berapa kali volumenya bertambah?'),
            options: [L('2', '2'), L('4', '4'), L('6', '6'), L('8', '8')],
            answer: 3,
            explain: L('$(2l)(2w)(2h)=8lwh$: the volume grows $8$ times and the surface $4$ times.', '$(2p)(2l)(2t)=8plt$: volume bertambah $8$ kali dan luas permukaan $4$ kali.'),
            hint: L('Volume is the product of three lengths.', 'Volume adalah hasil kali tiga panjang.'),
          },
        },
        {
          kind: 'activity',
          title: L('The least surface', 'Luas permukaan terkecil'),
          step: {
            kind: 'math',
            id: 'p10',
            hints: [L(T`The cube holds the most for a surface, so for a volume it has the least surface: $S\ge6V^{2/3}$.`, T`Kubus memuat paling banyak untuk suatu luas permukaan, jadi untuk suatu volume ia memiliki luas permukaan terkecil: $L\ge6V^{2/3}$.`), L(T`A cube of volume $64$ has edge $4$.`, T`Kubus bervolume $64$ berusuk $4$.`)],
            explain: L(T`$6\cdot4^2=96$, the surface of the cube of edge $4$; any other box of volume $64$ has more, such as $112$ for $8\times4\times2$.`, T`$6\cdot4^2=96$, luas permukaan kubus berusuk $4$; balok lain bervolume $64$ memiliki lebih, seperti $112$ untuk $8\times4\times2$.`),
            prompt: L(T`What is the smallest surface area a box of volume $64$ can have?`, T`Berapa luas permukaan terkecil yang dapat dimiliki balok bervolume $64$?`),
            given: String.raw`S=v`,
            blanks: [{ label: 'S =', answer: 96 }],
          },
        },
        {
          kind: 'activity',
          title: L('Order the check', 'Urutkan pemeriksaannya'),
          step: {
            kind: 'order',
            id: 'p11',
            prompt: L('Put the steps of checking whether a rod fits in a box in order.', 'Urutkan langkah memeriksa apakah batang muat dalam balok.'),
            lines: {
              en: ['Measure the three edges of the box and the length of the rod, in the same unit', 'Add the squares of the three edges: l² + w² + h²', 'Take the square root: this is the space diagonal d', 'Compare the rod with d: it fits if it is not longer than d'],
              id: ['Ukur ketiga rusuk balok dan panjang batang, dalam satuan yang sama', 'Jumlahkan kuadrat ketiga rusuk: p² + l² + t²', 'Tarik akar kuadrat: ini diagonal ruang d', 'Bandingkan batang dengan d: ia muat bila tidak lebih panjang daripada d'],
            },
            explain: L(T`The diagonal has to be known before the comparison, and the units have to agree before anything is squared.`, T`Diagonalnya harus diketahui sebelum perbandingan, dan satuannya harus sama sebelum apa pun dikuadratkan.`),
            hint: L(T`Compare last.`, T`Bandingkan terakhir.`),
          },
        },
        {
          kind: 'activity',
          title: L('Fill in the working', 'Isi pengerjaannya'),
          step: {
            kind: 'fill',
            id: 'p12',
            prompt: L('Complete the working for the surface area of the box 4 × 3 × 2.', 'Lengkapi pengerjaan luas permukaan balok 4 × 3 × 2.'),
            template: {
              en: 'S = 2(4·3 + 4·2 + 3·2) = 2(___ + ___ + ___) = ___',
              id: 'L = 2(4·3 + 4·2 + 3·2) = 2(___ + ___ + ___) = ___',
            },
            blanks: { en: ['12', '8', '6', '52'], id: ['12', '8', '6', '52'] },
            explain: L(T`$12+8+6=26$ and $2\cdot26=52$: the six rectangles of the net are $12,12,8,8,6,6$.`, T`$12+8+6=26$ dan $2\cdot26=52$: keenam persegi panjang jaring-jaring adalah $12,12,8,8,6,6$.`),
            hint: L(T`Work out each product first, add them, then double.`, T`Hitung tiap hasil kali dulu, jumlahkan, lalu gandakan.`),
          },
        },
      ],
    },

    /* --------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: the cuboid at a glance', 'Ringkasan: balok sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Parts:** $6$ faces in three equal pairs, $12$ edges in three groups of four, $8$ corners; a cube is the cuboid with $l=w=h$.
- **Measures:** $V=lwh$, $S=2(lw+lh+wh)$, lateral area $2h(l+w)$, edges together $4(l+w+h)$; scaling by $k$ gives $k^2$ and $k^3$.
- **Diagonals:** faces $\sqrt{l^2+w^2}$, $\sqrt{l^2+h^2}$, $\sqrt{w^2+h^2}$; space $d=\sqrt{l^2+w^2+h^2}$; $\cos\alpha=\frac ld$ and the three squared cosines add to $1$.
- **Whole diagonals:** quadruples $a^2+b^2+c^2=d^2$ such as $(2,3,6,7)$; Euler bricks such as $44\times117\times240$; no perfect cuboid known.
- **Extremes:** for a given surface $V\le\left(\frac S6\right)^{3/2}$, for a given volume $S\ge6V^{2/3}$, equality only for the cube (AM–GM).
- **Fitting:** a rod fits if it is at most $d$; small boxes laid alike fit $\lfloor L/a\rfloor\lfloor W/b\rfloor\lfloor H/c\rfloor$, best of six turns.`,
            T`- **Bagian:** $6$ sisi dalam tiga pasang yang sama, $12$ rusuk dalam tiga kelompok empat, $8$ titik sudut; kubus adalah balok dengan $p=l=t$.
- **Ukuran:** $V=plt$, $L=2(pl+pt+lt)$, luas selimut $2t(p+l)$, semua rusuk $4(p+l+t)$; perubahan skala $k$ memberi $k^2$ dan $k^3$.
- **Diagonal:** sisi $\sqrt{p^2+l^2}$, $\sqrt{p^2+t^2}$, $\sqrt{l^2+t^2}$; ruang $d=\sqrt{p^2+l^2+t^2}$; $\cos\alpha=\frac pd$ dan ketiga kosinus kuadrat berjumlah $1$.
- **Diagonal bulat:** kuadrupel $a^2+b^2+c^2=d^2$ seperti $(2,3,6,7)$; bata Euler seperti $44\times117\times240$; belum ada balok sempurna.
- **Ekstrem:** untuk luas permukaan tertentu $V\le\left(\frac L6\right)^{3/2}$, untuk volume tertentu $L\ge6V^{2/3}$, kesamaan hanya untuk kubus (AM–GM).
- **Memuat:** batang muat bila paling besar $d$; balok kecil yang diletakkan sama muat $\lfloor P/a\rfloor\lfloor L/b\rfloor\lfloor T/c\rfloor$, terbaik dari enam putaran.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Cuboid', 'Balok'), definition: L('A solid with six rectangular faces meeting at right angles, in three pairs of equal faces; the box.', 'Bangun ruang dengan enam sisi persegi panjang yang bertemu pada sudut siku-siku, dalam tiga pasang sisi yang sama; kotak.') },
    { term: L('Length, width, height', 'Panjang, lebar, tinggi'), definition: L('The three edge lengths of a cuboid, written l, w and h, which fix the whole box.', 'Tiga panjang rusuk balok, ditulis p, l, dan t, yang menentukan seluruh balok.') },
    { term: L('Volume', 'Volume'), definition: L('The space inside the box: length times width times height, in cubic units.', 'Ruang di dalam balok: panjang kali lebar kali tinggi, dalam satuan kubik.') },
    { term: L('Surface area', 'Luas permukaan'), definition: L('The total area of the six faces: twice the sum of l w, l h and w h.', 'Jumlah luas keenam sisi: dua kali jumlah p l, p t, dan l t.') },
    { term: L('Lateral area', 'Luas selimut'), definition: L('The area of the four walls without the top and the bottom: 2 h times l plus w.', 'Luas keempat dinding tanpa atap dan lantai: 2 t kali p ditambah l.') },
    { term: L('Space diagonal', 'Diagonal ruang'), definition: L('The segment between opposite corners through the inside; its length is the square root of l squared plus w squared plus h squared.', 'Ruas di antara titik sudut berhadapan melalui bagian dalam; panjangnya akar dari p kuadrat ditambah l kuadrat ditambah t kuadrat.') },
    { term: L('Pythagorean quadruple', 'Kuadrupel Pythagoras'), definition: L('Four whole numbers a, b, c, d with a squared plus b squared plus c squared equal to d squared: a box with a whole space diagonal.', 'Empat bilangan bulat a, b, c, d dengan a kuadrat ditambah b kuadrat ditambah c kuadrat sama dengan d kuadrat: balok dengan diagonal ruang bulat.') },
    { term: L('Euler brick', 'Bata Euler'), definition: L('A box whose edges and three face diagonals are all whole numbers, such as 44 by 117 by 240.', 'Balok yang rusuk dan ketiga diagonal sisinya semuanya bilangan bulat, seperti 44 kali 117 kali 240.') },
    { term: L('Perfect cuboid', 'Balok sempurna'), definition: L('A box whose edges, face diagonals and space diagonal are all whole numbers; none is known.', 'Balok yang rusuk, diagonal sisi, dan diagonal ruangnya semuanya bilangan bulat; belum ada yang diketahui.') },
    { term: L('AM–GM inequality', 'Ketaksamaan AM–GM'), definition: L('The geometric mean of positive numbers is at most their arithmetic mean, with equality only when they are all equal.', 'Rata-rata geometri bilangan positif paling besar sama dengan rata-rata aritmetikanya, dengan kesamaan hanya bila semuanya sama.') },
  ],

  howTo: [
    {
      name: L('How to find the volume and the surface area of a cuboid', 'Cara mencari volume dan luas permukaan balok'),
      description: L('Multiply the three edges for the volume, and add the three face areas and double them for the surface.', 'Kalikan ketiga rusuk untuk volume, dan jumlahkan ketiga luas sisi lalu gandakan untuk luas permukaan.'),
      steps: [
        { name: L('Write the three edges', 'Tulis ketiga rusuk'), text: L('Name the length, width and height, all in the same unit.', 'Namai panjang, lebar, dan tinggi, semuanya dalam satuan yang sama.') },
        { name: L('Multiply for the volume', 'Kalikan untuk volume'), text: L('The volume is length times width times height, in cubic units.', 'Volume adalah panjang kali lebar kali tinggi, dalam satuan kubik.') },
        { name: L('Find the three face areas', 'Cari ketiga luas sisi'), text: L('Compute length times width, length times height, and width times height.', 'Hitung panjang kali lebar, panjang kali tinggi, dan lebar kali tinggi.') },
        { name: L('Add and double', 'Jumlahkan dan gandakan'), text: L('The surface area is twice the sum of the three face areas, since each kind of face appears twice.', 'Luas permukaan adalah dua kali jumlah ketiga luas sisi, karena tiap jenis sisi muncul dua kali.') },
      ],
    },
    {
      name: L('How to check whether a rod fits inside a box', 'Cara memeriksa apakah batang muat di dalam kotak'),
      description: L('Find the space diagonal of the box and compare the rod with it.', 'Cari diagonal ruang kotak dan bandingkan batang dengannya.'),
      steps: [
        { name: L('Measure in one unit', 'Ukur dalam satu satuan'), text: L('Write the three edges of the box and the length of the rod in the same unit.', 'Tulis ketiga rusuk kotak dan panjang batang dalam satuan yang sama.') },
        { name: L('Square and add the edges', 'Kuadratkan dan jumlahkan rusuk'), text: L('Compute length squared plus width squared plus height squared.', 'Hitung panjang kuadrat ditambah lebar kuadrat ditambah tinggi kuadrat.') },
        { name: L('Take the square root', 'Tarik akar kuadrat'), text: L('The result is the space diagonal, the longest straight segment inside the box.', 'Hasilnya diagonal ruang, ruas lurus terpanjang di dalam kotak.') },
        { name: L('Compare', 'Bandingkan'), text: L('The rod fits if its length is not more than the space diagonal; it fits exactly if they are equal.', 'Batang muat bila panjangnya tidak lebih dari diagonal ruang; ia muat tepat bila sama.') },
      ],
    },
    {
      name: L('How to find the box with the largest volume for a given surface area', 'Cara mencari balok dengan volume terbesar untuk luas permukaan tertentu'),
      description: L('Use the inequality of arithmetic and geometric means on the three face areas: the cube is the answer.', 'Pakai ketaksamaan rata-rata aritmetika dan geometri pada ketiga luas sisi: kubus adalah jawabannya.'),
      steps: [
        { name: L('Write the surface area', 'Tulis luas permukaan'), text: L('The surface area S equals 2 times the sum of lw, lh and wh, so the sum of the three face areas is S over 2.', 'Luas permukaan S sama dengan 2 kali jumlah pl, pt, dan lt, sehingga jumlah ketiga luas sisi adalah S per 2.') },
        { name: L('Apply AM–GM', 'Terapkan AM–GM'), text: L('The cube root of the product of the three face areas is at most their average, S over 6.', 'Akar pangkat tiga hasil kali ketiga luas sisi paling besar sama dengan rata-ratanya, S per 6.') },
        { name: L('Recognize the product', 'Kenali hasil kalinya'), text: L('The product of the face areas is the volume squared, so the volume is at most S over 6 to the power three halves.', 'Hasil kali luas sisi adalah volume kuadrat, sehingga volume paling besar S per 6 pangkat tiga perdua.') },
        { name: L('Find the equality case', 'Cari kasus kesamaan'), text: L('Equality needs the three face areas to be equal, which means all three edges are equal: the cube.', 'Kesamaan memerlukan ketiga luas sisi sama, yang berarti ketiga rusuk sama: kubus.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is a cuboid?', 'Apa itu balok?'),
      a: L(
        'A cuboid, or rectangular box, is a solid with six rectangular faces meeting at right angles, twelve edges and eight corners. Opposite faces are equal, and the three edge lengths, length, width and height, determine the whole box.',
        'Balok, atau kotak persegi panjang, adalah bangun ruang dengan enam sisi persegi panjang yang bertemu pada sudut siku-siku, dua belas rusuk, dan delapan titik sudut. Sisi yang berhadapan sama, dan ketiga panjang rusuk, panjang, lebar, dan tinggi, menentukan seluruh balok.',
      ),
    },
    {
      q: L('How do you find the volume of a cuboid?', 'Bagaimana mencari volume balok?'),
      a: L(
        'Multiply the length, the width and the height: V equals l times w times h, in cubic units. It is the base area times the height. A box 8 by 5 by 3 has volume 120.',
        'Kalikan panjang, lebar, dan tinggi: V sama dengan p kali l kali t, dalam satuan kubik. Itu adalah luas alas kali tinggi. Balok 8 kali 5 kali 3 memiliki volume 120.',
      ),
    },
    {
      q: L('What is the formula for the surface area of a cuboid?', 'Apa rumus luas permukaan balok?'),
      a: L(
        'The surface area is 2 times the sum of l w, l h and w h, since the six faces make three equal pairs. A box 4 by 3 by 2 has faces of 12, 8 and 6 in pairs, so its surface is 52.',
        'Luas permukaan adalah 2 kali jumlah p l, p t, dan l t, karena keenam sisi membentuk tiga pasang yang sama. Balok 4 kali 3 kali 2 memiliki sisi 12, 8, dan 6 berpasangan, jadi luas permukaannya 52.',
      ),
    },
    {
      q: L('How do you find the lateral surface area of a cuboid?', 'Bagaimana mencari luas selimut balok?'),
      a: L(
        'Add the four walls and leave out the top and bottom: 2 times h times l plus w. It is the perimeter of the base times the height. For a room 6 m by 4 m and 3 m high it is 60 square metres.',
        'Jumlahkan keempat dinding dan abaikan atas dan bawah: 2 kali t kali p ditambah l. Itu adalah keliling alas kali tinggi. Untuk ruangan 6 m kali 4 m dengan tinggi 3 m, luasnya 60 meter persegi.',
      ),
    },
    {
      q: L('What is the difference between a cube and a cuboid?', 'Apa beda kubus dan balok?'),
      a: L(
        'A cube has six identical square faces and three equal edges. A cuboid has rectangular faces and edges of up to three different lengths. Every cube is a cuboid, but a cuboid is a cube only when length, width and height are equal.',
        'Kubus memiliki enam sisi persegi yang kongruen dan tiga rusuk sama. Balok memiliki sisi persegi panjang dan rusuk dengan sampai tiga panjang berbeda. Setiap kubus adalah balok, tetapi balok adalah kubus hanya bila panjang, lebar, dan tinggi sama.',
      ),
    },
    {
      q: L('Which cuboid has the largest volume for a given surface area?', 'Balok mana yang volumenya terbesar untuk luas permukaan tertentu?'),
      a: L(
        'The cube. For surface area S every box has volume at most S over 6 to the power three halves, by the AM–GM inequality, with equality only when length, width and height are equal. For S equal to 96 the cube of edge 4 has volume 64.',
        'Kubus. Untuk luas permukaan S setiap balok bervolume paling besar S per 6 pangkat tiga perdua, menurut ketaksamaan AM–GM, dengan kesamaan hanya bila panjang, lebar, dan tinggi sama. Untuk S sama dengan 96 kubus berusuk 4 bervolume 64.',
      ),
    },
    {
      q: L('What is an Euler brick?', 'Apa itu bata Euler?'),
      a: L(
        'An Euler brick is a box whose three edges and three face diagonals are all whole numbers. The smallest is 44 by 117 by 240, with face diagonals 125, 244 and 267. Whether one also has a whole space diagonal, a perfect cuboid, is unknown.',
        'Bata Euler adalah balok yang ketiga rusuk dan ketiga diagonal sisinya semuanya bilangan bulat. Yang terkecil 44 kali 117 kali 240, dengan diagonal sisi 125, 244, dan 267. Apakah ada yang diagonal ruangnya juga bulat, balok sempurna, belum diketahui.',
      ),
    },
    {
      q: L('How do you know whether a rod fits inside a box?', 'Bagaimana mengetahui apakah batang muat di dalam kotak?'),
      a: L(
        'Compute the space diagonal, the square root of l squared plus w squared plus h squared, and compare. The rod fits if it is not longer than that, tilted from one corner towards the opposite one. A 1 m pole does not fit in a box 60 by 40 by 40 cm, whose diagonal is 82.5 cm.',
        'Hitung diagonal ruang, akar dari p kuadrat ditambah l kuadrat ditambah t kuadrat, dan bandingkan. Batang muat bila tidak lebih panjang daripada itu, dimiringkan dari satu sudut ke arah sudut yang berhadapan. Tiang 1 m tidak muat dalam kotak 60 kali 40 kali 40 cm, yang diagonalnya 82,5 cm.',
      ),
    },
  ],

  references: [
    { title: 'Polyhedra', author: 'Peter R. Cromwell', year: 1997, source: 'Cambridge University Press' },
    { title: 'The Thirteen Books of Euclid’s Elements (Book XI)', author: 'Thomas L. Heath (translator)', year: 1956, source: 'Dover' },
    { title: 'Unsolved Problems in Number Theory (3rd ed.), section on Euler bricks and the perfect cuboid', author: 'Richard K. Guy', year: 2004, source: 'Springer' },
    { title: 'The Cauchy–Schwarz Master Class', author: 'J. Michael Steele', year: 2004, source: 'Cambridge University Press' },
    { title: 'Precalculus: Mathematics for Calculus (chapter on geometry formulas)', author: 'James Stewart, Lothar Redlin, Saleem Watson', year: 2016, source: 'Cengage Learning' },
    { title: 'A History of Mathematics (3rd ed.)', author: 'Carl B. Boyer, Uta C. Merzbach', year: 2011, source: 'Wiley' },
    { title: 'Real-Time Collision Detection', author: 'Christer Ericson', year: 2005, source: 'Morgan Kaufmann' },
  ],

  related: ['cube', 'pythagorean-theorem', 'quadrilaterals', 'applied-optimization'],
}
