import type { Figure } from '../../lib/figure'
import type { Loc } from '../types'
import type { ArticleBlock, ArticleBody } from './types'
import { meta } from './cube.meta'

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

/** A square of a net on the grid: its corners, with rows going down the page. */
const sq = (r: number, c: number): [number, number][] => [[c, -r], [c + 1, -r], [c + 1, -r - 1], [c, -r - 1]]

/* ------------------------------------------------------------------------------- the figures */

/** The cross net, with the squares numbered as a die: opposite faces add up to 7. */
const FIG_NET: ArticleBlock = fig({
  range: 1,
  xSpan: [-0.2, 4.2],
  ySpan: [-3.2, 0.2],
  items: [
    ...([[0, 1, '6'], [1, 0, '4'], [1, 1, '5'], [1, 2, '3'], [1, 3, '2'], [2, 1, '1']] as [number, number, string][]).flatMap(([r, c, n]) => [
      { t: 'poly' as const, pts: sq(r, c), color: 'a' as const, look: 'solid' as const },
      { t: 'text' as const, at: [c + 0.5, -r - 0.62], text: n, size: 'lg' as const, color: 'result' as const },
    ]),
  ],
  caption: L(
    T`The cross is one of the 11 nets. Numbered as on a die, the squares that end up opposite are $6$ and $1$ (the top and bottom of the cross), $4$ and $3$, and $5$ and $2$: in a row, the squares with exactly one between them are opposite, and each pair adds up to $7$.`,
    T`Salib adalah satu dari 11 jaring-jaring. Dinomori seperti dadu, persegi yang berhadapan setelah dilipat adalah $6$ dan $1$ (atas dan bawah salib), $4$ dan $3$, serta $5$ dan $2$: dalam satu baris, persegi yang di antaranya tepat satu persegi saling berhadapan, dan tiap pasangan berjumlah $7$.`,
  ),
})

/** A row of six: squares 1 and 5, and 2 and 6, land on the same faces. */
const FIG_ROW: ArticleBlock = fig({
  range: 1,
  xSpan: [-0.2, 6.2],
  ySpan: [-1.6, 0.6],
  items: [
    ...([1, 2, 3, 4, 5, 6] as number[]).flatMap((n) => [
      { t: 'poly' as const, pts: sq(0, n - 1), color: n === 1 || n === 5 ? ('c' as const) : n === 2 || n === 6 ? ('b' as const) : ('a' as const), look: 'solid' as const },
      { t: 'text' as const, at: [n - 0.5, -0.62], text: String(n), size: 'lg' as const, color: 'result' as const },
    ]),
  ],
  caption: L(
    T`A row of six is not a net. Folding the row round the cube, square $5$ comes back to the face that square $1$ started on, and square $6$ to the face of square $2$: two faces covered twice and two not at all. In a straight row, squares four apart always land on the same face.`,
    T`Satu baris enam bukan jaring-jaring. Bila baris itu dilipat mengelilingi kubus, persegi $5$ kembali ke sisi tempat persegi $1$ mulai, dan persegi $6$ ke sisi persegi $2$: dua sisi tertutup dua kali dan dua sisi tak tertutup. Dalam baris lurus, persegi yang berjarak empat selalu mendarat di sisi yang sama.`,
  ),
})

/** The cube with a face diagonal and a space diagonal, for turning. */
const FIG_DIAG: ArticleBlock = {
  kind: 'figure',
  figure: {
    dim: 3,
    range: 3.2,
    interactive: true,
    view: [34, 22],
    items: [
      { t: 'box', a: [2, 0, 0], b: [0, 2, 0], c: [0, 0, 2] },
      { t: 'seg', from: [0, 0, 0], to: [2, 2, 0], color: 'b', width: 3, label: 'f' },
      { t: 'seg', from: [2, 2, 0], to: [2, 2, 2], color: 'muted', dashed: true },
      { t: 'seg', from: [0, 0, 0], to: [2, 2, 2], color: 'result', width: 3, label: 'd' },
      { t: 'point', at: [0, 0, 0], color: 'muted', label: 'A' },
      { t: 'point', at: [2, 2, 0], color: 'muted', label: 'C' },
      { t: 'point', at: [2, 2, 2], color: 'muted', label: 'G' },
    ],
    caption: L(
      T`Turn the cube. The diagonal of a face, $f=AC$, is the hypotenuse of a right triangle with both legs $a$, so $f=a\sqrt2$. The diagonal of the cube, $d=AG$, is the hypotenuse of a right triangle with legs $f$ and $a$, so $d^2=2a^2+a^2=3a^2$ and $d=a\sqrt3$.`,
      T`Putar kubusnya. Diagonal sebuah sisi, $f=AC$, adalah sisi miring segitiga siku-siku dengan kedua sisi tegak $a$, sehingga $f=a\sqrt2$. Diagonal ruang, $d=AG$, adalah sisi miring segitiga siku-siku dengan sisi tegak $f$ dan $a$, sehingga $d^2=2a^2+a^2=3a^2$ dan $d=a\sqrt3$.`,
    ),
  },
}

/** The regular hexagon cut by the plane x + y + z = 3 through the midpoints of six edges. */
const FIG_HEX: ArticleBlock = {
  kind: 'figure',
  figure: {
    dim: 3,
    range: 3.2,
    interactive: true,
    view: [34, 22],
    items: [
      { t: 'box', a: [2, 0, 0], b: [0, 2, 0], c: [0, 0, 2] },
      { t: 'poly', pts: [[2, 1, 0], [2, 0, 1], [1, 0, 2], [0, 1, 2], [0, 2, 1], [1, 2, 0]], color: 'result' },
      { t: 'point', at: [2, 1, 0], color: 'muted' },
      { t: 'point', at: [2, 0, 1], color: 'muted' },
      { t: 'point', at: [1, 0, 2], color: 'muted' },
      { t: 'point', at: [0, 1, 2], color: 'muted' },
      { t: 'point', at: [0, 2, 1], color: 'muted' },
      { t: 'point', at: [1, 2, 0], color: 'muted' },
    ],
    caption: L(
      T`The plane $x+y+z=3$ through the centre of a cube of edge $2$, perpendicular to a space diagonal, cuts the six edges at their midpoints. The cut is a regular hexagon of side $\sqrt2$, and its area is $\frac{3\sqrt3}{4}a^2\approx1.299a^2$ for edge $a$.`,
      T`Bidang $x+y+z=3$ melalui pusat kubus berusuk $2$, tegak lurus pada sebuah diagonal ruang, memotong keenam rusuk di titik tengahnya. Irisannya adalah segienam beraturan bersisi $\sqrt2$, dan luasnya $\frac{3\sqrt3}{4}a^2\approx1{,}299a^2$ untuk rusuk $a$.`,
    ),
  },
}

export const body: ArticleBody = {
  answer: L(
    T`**A cube is a solid with six identical square faces, twelve equal edges and eight corners; with edge $a$ its surface area is $6a^2$, its volume is $a^3$, and its space diagonal is $a\sqrt3$.** Six squares fold into a cube in exactly 11 ways (its nets). A plane can cut it in a triangle, a square, a pentagon or a regular hexagon, and doubling its volume needs an edge $\sqrt[3]{2}$ times longer, which a compass and straightedge cannot construct.`,
    T`**Kubus adalah bangun ruang dengan enam sisi persegi yang kongruen, dua belas rusuk sama panjang, dan delapan titik sudut; dengan rusuk $a$ luas permukaannya $6a^2$, volumenya $a^3$, dan diagonal ruangnya $a\sqrt3$.** Enam persegi yang bersambung sisi ke sisi terlipat menjadi kubus dengan tepat 11 cara berbeda (jaring-jaringnya). Sebuah bidang dapat mengiris kubus menjadi segitiga, persegi, segilima, atau segienam beraturan, dan menggandakan volume kubus memerlukan rusuk $\sqrt[3]{2}$ kali lebih panjang, panjang yang tak dapat dikonstruksi dengan jangka dan penggaris.`,
  ),

  keyPoints: [
    L(
      T`A cube has $6$ faces, $12$ edges and $8$ corners, three squares meeting at every corner, and $8-12+6=2$, Euler’s number for every solid without holes. Its eight corners are the eight triples of $0$s and $1$s, and an edge joins two corners that differ in one coordinate.`,
      T`Kubus memiliki $6$ sisi, $12$ rusuk, dan $8$ titik sudut, tiga persegi bertemu di setiap titik sudut, dan $8-12+6=2$, bilangan Euler untuk setiap bangun ruang tanpa lubang. Kedelapan titik sudutnya adalah delapan tripel $0$ dan $1$, dan sebuah rusuk menghubungkan dua titik sudut yang berbeda dalam satu koordinat.`,
    ),
    L(
      T`Surface area $6a^2$ and volume $a^3$. Multiply every edge by $k$ and the area is multiplied by $k^2$ and the volume by $k^3$: doubling the edge makes the surface $4$ times and the volume $8$ times as large.`,
      T`Luas permukaan $6a^2$ dan volume $a^3$. Kalikan setiap rusuk dengan $k$ dan luasnya dikalikan $k^2$ serta volumenya $k^3$: menggandakan rusuk membuat luas permukaan $4$ kali dan volume $8$ kali lipat.`,
    ),
    L(
      T`Pythagoras twice: a face has diagonal $a\sqrt2$, the cube has space diagonal $a\sqrt3$. Two space diagonals meet at an angle of about $70.53^\circ$, and a space diagonal makes about $35.26^\circ$ with a face.`,
      T`Pythagoras dua kali: sebuah sisi memiliki diagonal $a\sqrt2$, kubus memiliki diagonal ruang $a\sqrt3$. Dua diagonal ruang bertemu dengan sudut sekitar $70{,}53^\circ$, dan sebuah diagonal ruang membentuk sekitar $35{,}26^\circ$ dengan sebuah sisi.`,
    ),
    L(
      T`Of the $35$ ways to join six squares edge to edge, exactly $11$ fold into a cube. A net must have no $2\times2$ block, no row of five, and no two squares landing on the same face; rolling a cube over the squares checks all of it.`,
      T`Dari $35$ cara menyambung enam persegi sisi ke sisi, tepat $11$ yang terlipat menjadi kubus. Jaring-jaring tak boleh memuat blok $2\times2$, baris berisi lima, atau dua persegi yang mendarat di sisi yang sama; menggelindingkan kubus di atas persegi-persegi itu memeriksa semuanya.`,
    ),
    L(
      T`A plane cuts a cube in a triangle, a quadrilateral, a pentagon or a hexagon: never more than six sides, since it meets at most six faces. Through the centre, perpendicular to a space diagonal, the cut is a regular hexagon of area $\frac{3\sqrt3}{4}a^2$.`,
      T`Sebuah bidang mengiris kubus menjadi segitiga, segiempat, segilima, atau segienam: tak pernah lebih dari enam sisi, karena ia memotong paling banyak enam sisi kubus. Melalui pusat, tegak lurus pada diagonal ruang, irisannya segienam beraturan dengan luas $\frac{3\sqrt3}{4}a^2$.`,
    ),
    L(
      T`To double the volume you need the edge multiplied by $\sqrt[3]{2}\approx1.2599$. A compass and straightedge cannot draw that length (Wantzel, 1837), but Newton’s method finds it to any number of digits in a few steps.`,
      T`Untuk menggandakan volume kamu memerlukan rusuk yang dikalikan $\sqrt[3]{2}\approx1{,}2599$. Jangka dan penggaris tak dapat menggambar panjang itu (Wantzel, 1837), tetapi metode Newton menemukannya sampai berapa pun digit dalam beberapa langkah.`,
    ),
  ],

  sections: [
    /* ---------------------------------------------------------------------------------- what */
    {
      id: 'what-is-a-cube',
      heading: L('What is a cube, and how many faces, edges and corners does it have?', 'Apa itu kubus, dan berapa banyak sisi, rusuk, dan titik sudutnya?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A cube is a solid bounded by six identical squares, with $12$ edges all of the same length $a$ and $8$ corners, and three squares meeting at each corner.** It is the regular hexahedron, and one of the five Platonic solids: the only one whose faces are squares. A cube is the special case of a [cuboid](article:cuboid#what-is-a-cuboid), the box whose three edges may all differ. Opposite faces are parallel, every angle between two edges that meet is a right angle, and the length of the edge fixes everything else.

| Part | English | Indonesian | How many |
|---|---|---|---|
| a square of the surface | face | sisi | $6$ |
| where two faces meet | edge | rusuk | $12$ |
| where three edges meet | vertex (corner) | titik sudut | $8$ |

The counts obey Euler’s formula: $V-E+F=8-12+6=2$, the same for every solid without holes, whether a cube, a pyramid or a soccer ball. Put the cube in coordinates with one corner at the origin and the opposite corner at $(1,1,1)$, and the eight corners are exactly the eight triples of $0$s and $1$s. An edge joins two corners that differ in *one* coordinate, so each corner has $3$ edges, and $\frac{8\cdot3}{2}=12$. That small fact, that a cube is the three-bit binary numbers drawn in space, is used again in the code below ([binary numbers](article:binary-numbers#what-is-binary) explains bits).`,
            T`**Kubus adalah bangun ruang yang dibatasi enam persegi yang kongruen, dengan $12$ rusuk yang semuanya sama panjang $a$ dan $8$ titik sudut, dan tiga persegi bertemu di setiap titik sudut.** Ia adalah heksahedron beraturan, dan satu dari lima bangun ruang Platonik: satu-satunya yang sisinya persegi. Kubus adalah kasus khusus [balok](article:cuboid#what-is-a-cuboid), kotak yang ketiga rusuknya boleh berbeda semua. Sisi yang berhadapan sejajar, setiap sudut antara dua rusuk yang bertemu adalah sudut siku-siku, dan panjang rusuk menentukan segala hal lainnya.

| Bagian | Bahasa Inggris | Bahasa Indonesia | Banyaknya |
|---|---|---|---|
| sebuah persegi pada permukaan | face | sisi | $6$ |
| tempat dua sisi bertemu | edge | rusuk | $12$ |
| tempat tiga rusuk bertemu | vertex (corner) | titik sudut | $8$ |

Banyaknya itu memenuhi rumus Euler: $V-E+F=8-12+6=2$, sama untuk setiap bangun ruang tanpa lubang, baik kubus, limas, maupun bola sepak. Letakkan kubus dalam koordinat dengan satu titik sudut di titik asal dan titik sudut yang berhadapan di $(1,1,1)$, dan kedelapan titik sudutnya tepat delapan tripel $0$ dan $1$. Sebuah rusuk menghubungkan dua titik sudut yang berbeda dalam *satu* koordinat, sehingga tiap titik sudut memiliki $3$ rusuk, dan $\frac{8\cdot3}{2}=12$. Fakta kecil itu, bahwa kubus adalah bilangan biner tiga bit yang digambar dalam ruang, dipakai lagi pada kode di bawah ([bilangan biner](article:binary-numbers#what-is-binary) menjelaskan bit).`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------------------------ nets */
    {
      id: 'nets',
      heading: L('How many nets does a cube have, and which arrangements of squares fold into a cube?', 'Ada berapa jaring-jaring kubus, dan susunan persegi mana yang terlipat menjadi kubus?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A net of the cube is an arrangement of six squares joined edge to edge that folds into a cube with every face covered once; there are exactly 11 different nets.** Turned and flipped copies count as the same net. Shapes made of six squares are called hexominoes, and there are $35$ of them; only $11$ are nets. They come in four families, named by the number of squares in each row: $1\text{-}4\text{-}1$ (a row of four with one square above and one below, in $6$ ways), $2\text{-}3\text{-}1$ ($3$ ways), $2\text{-}2\text{-}2$ (a staircase, $1$ way) and $3\text{-}3$ ($1$ way).

Why are the other $24$ not nets? $12$ are ruled out at once: $8$ contain a $2\times2$ block, which cannot lie flat on a cube (going once round a corner brings you back on a *different* face), and $4$ have a row of five or six. The remaining $12$ fail by overlap: two squares would land on the same face, leaving one face bare. A straight row shows how: folded round the cube, the squares four apart land on the same face.

A way to test any arrangement is to *roll a cube over it*: put the cube on the first square, roll it from square to square, and note which face touches each one; it is a net exactly when the six squares meet six different faces. On a net, squares with exactly one square between them in a row are opposite faces. So if you number the squares like a die, opposite faces adding to $7$, the pairs fall in place. Build your own below, or load the 11 nets and the three common wrong answers.`,
            T`**Jaring-jaring kubus adalah susunan enam persegi yang bersambung sisi ke sisi dan terlipat menjadi kubus dengan setiap sisi tertutup sekali; ada tepat 11 jaring-jaring yang berbeda.** Salinan yang diputar dan dibalik dihitung sebagai jaring-jaring yang sama. Bentuk yang terbuat dari enam persegi disebut heksomino, dan ada $35$ di antaranya; hanya $11$ yang menjadi jaring-jaring. Mereka terbagi dalam empat keluarga, dinamai menurut banyak persegi pada tiap baris: $1\text{-}4\text{-}1$ (satu baris empat dengan satu persegi di atas dan satu di bawah, dengan $6$ cara), $2\text{-}3\text{-}1$ ($3$ cara), $2\text{-}2\text{-}2$ (tangga, $1$ cara), dan $3\text{-}3$ ($1$ cara).

Mengapa $24$ yang lain bukan jaring-jaring? $12$ langsung tersingkir: $8$ memuat blok $2\times2$, yang tak dapat terletak datar pada kubus (sekali mengelilingi sebuah sudut membawamu kembali ke sisi yang *berbeda*), dan $4$ memiliki baris berisi lima atau enam. Dua belas sisanya gagal karena bertumpuk: dua persegi akan mendarat di sisi yang sama, menyisakan satu sisi kosong. Satu baris lurus memperlihatkan caranya: bila dilipat mengelilingi kubus, persegi yang berjarak empat mendarat di sisi yang sama.

Cara menguji susunan mana pun adalah *menggelindingkan kubus di atasnya*: letakkan kubus di persegi pertama, gelindingkan dari persegi ke persegi, dan catat sisi mana yang menyentuh masing-masing; susunan itu jaring-jaring tepat bila keenam persegi menyentuh enam sisi yang berbeda. Pada jaring-jaring, persegi yang di antaranya tepat satu persegi dalam satu baris adalah sisi yang berhadapan. Jadi bila kamu menomori persegi seperti dadu, sisi berhadapan berjumlah $7$, pasangannya jatuh pada tempatnya. Susun sendiri di bawah, atau muat ke-11 jaring-jaring dan tiga jawaban salah yang umum.`,
          ),
        },
        { kind: 'widget', name: 'cbnet' },
        FIG_NET,
        FIG_ROW,
      ],
    },

    /* ---------------------------------------------------------------------- area and volume */
    {
      id: 'surface-area-and-volume',
      heading: L('How do you find the surface area and the volume of a cube?', 'Bagaimana mencari luas permukaan dan volume kubus?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The surface area of a cube with edge $a$ is $6a^2$, six squares of area $a^2$, and its volume is $a^3$, the number of unit cubes in a stack $a$ long, $a$ wide and $a$ high.** For $a=3$ cm: one face is $9$ cm², the surface is $6\cdot9=54$ cm², and the volume is $3^3=27$ cm³, since $3$ layers of $3\times3$ unit cubes make $27$. A cube is also a box with all three sides equal, so $V=a\cdot a\cdot a$ is length times width times height.

*Scaling.* If every edge is multiplied by $k$, a length is multiplied by $k$, an area by $k^2$ and a volume by $k^3$. Doubling the edge ($k=2$) multiplies the surface by $4$ and the volume by $8$; tripling it ($k=3$) gives $9$ and $27$. A cube of edge $2$ has volume $8$ and surface $24$, while the unit cube has $1$ and $6$. This is why a large animal needs thick legs: its weight grows with the cube of its size and the strength of a leg with only the square.

*Units.* Volume uses cubic units, and one cubic decimetre is exactly one litre, so a cube-shaped water tank with an edge of $40$ cm $=4$ dm holds $4^3=64$ litres. A cube of edge $1$ m is $1000$ dm³: $1000$ litres.

*Going backwards.* Given the volume, take the cube root: a cube of volume $216$ cm³ has edge $\sqrt[3]{216}=6$ cm. Slide the edge below and read every measure, including what doubling does.`,
            T`**Luas permukaan kubus dengan rusuk $a$ adalah $6a^2$, enam persegi dengan luas $a^2$, dan volumenya $a^3$, banyaknya kubus satuan dalam tumpukan sepanjang $a$, selebar $a$, dan setinggi $a$.** Untuk $a=3$ cm: satu sisi $9$ cm², permukaannya $6\cdot9=54$ cm², dan volumenya $3^3=27$ cm³, karena $3$ lapis kubus satuan $3\times3$ membentuk $27$. Kubus juga adalah balok dengan ketiga sisinya sama, jadi $V=a\cdot a\cdot a$ adalah panjang kali lebar kali tinggi.

*Perubahan skala.* Bila setiap rusuk dikalikan $k$, panjang dikalikan $k$, luas dikalikan $k^2$, dan volume dikalikan $k^3$. Menggandakan rusuk ($k=2$) mengalikan luas permukaan dengan $4$ dan volume dengan $8$; melipattigakannya ($k=3$) memberi $9$ dan $27$. Kubus berusuk $2$ memiliki volume $8$ dan luas permukaan $24$, sedangkan kubus satuan memiliki $1$ dan $6$. Inilah sebabnya hewan besar memerlukan kaki yang tebal: beratnya tumbuh menurut pangkat tiga ukurannya dan kekuatan sebuah kaki hanya menurut kuadratnya.

*Satuan.* Volume memakai satuan kubik, dan satu desimeter kubik tepat satu liter, jadi bak air berbentuk kubus dengan rusuk $40$ cm $=4$ dm memuat $4^3=64$ liter. Kubus berusuk $1$ m adalah $1000$ dm³: $1000$ liter.

*Mundur.* Bila volume diketahui, ambil akar pangkat tiga: kubus bervolume $216$ cm³ memiliki rusuk $\sqrt[3]{216}=6$ cm. Geser rusuk di bawah dan baca setiap ukuran, termasuk apa yang dilakukan penggandaan.`,
          ),
        },
        { kind: 'widget', name: 'cbmeasure' },
      ],
    },

    /* ----------------------------------------------------------------------------- diagonals */
    {
      id: 'diagonals',
      heading: L('How do you find the space diagonal of a cube, and what angles do the diagonals make?', 'Bagaimana mencari diagonal ruang kubus, dan sudut apa yang dibentuk diagonal-diagonalnya?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The diagonal of a face of a cube with edge $a$ is $a\sqrt2$ and the space diagonal, joining opposite corners through the inside, is $a\sqrt3$: the [Pythagorean theorem](article:pythagorean-theorem#distance-and-diagonals) used twice.** A face is a square, so its diagonal is the hypotenuse of a right triangle with both legs $a$: $f^2=a^2+a^2=2a^2$. The space diagonal $d$ is the hypotenuse of a second right triangle whose legs are that face diagonal $f$ and the edge $a$ standing up from its end: $d^2=f^2+a^2=3a^2$. So $d=a\sqrt3\approx1.732a$; for $a=5$ it is $5\sqrt3\approx8.66$. The longest straight rod that fits inside a cube-shaped room of edge $4$ m is $4\sqrt3\approx6.93$ m, along the space diagonal.

A cube has $4$ space diagonals, all of the same length, and they all pass through the centre, where each is cut in half. Take the corners of the unit cube: the diagonals have directions $(1,1,1)$, $(-1,1,1)$, $(1,-1,1)$ and $(1,1,-1)$. Two of them meet at an angle with $\cos\theta=\frac{|(1,1,1)\cdot(-1,1,1)|}{3}=\frac13$, so $\theta=\arccos\frac13\approx70.53^\circ$. A space diagonal and the face it starts from make the angle $\arctan\frac{1}{\sqrt2}\approx35.26^\circ$, since the diagonal rises $a$ over a horizontal run $a\sqrt2$. From any corner, the other seven corners are at three distances: $3$ at $a$ (along the edges), $3$ at $a\sqrt2$ (across the faces), and $1$ at $a\sqrt3$ (the opposite corner). Those counts $3,3,1$ are the coefficients of $(1+x)^3$.`,
            T`**Diagonal sisi kubus berusuk $a$ adalah $a\sqrt2$ dan diagonal ruang, yang menghubungkan titik sudut berhadapan melalui bagian dalam, adalah $a\sqrt3$: [teorema Pythagoras](article:pythagorean-theorem#distance-and-diagonals) yang dipakai dua kali.** Sebuah sisi adalah persegi, sehingga diagonalnya sisi miring segitiga siku-siku dengan kedua sisi tegak $a$: $f^2=a^2+a^2=2a^2$. Diagonal ruang $d$ adalah sisi miring segitiga siku-siku kedua yang sisi tegaknya diagonal sisi $f$ itu dan rusuk $a$ yang berdiri dari ujungnya: $d^2=f^2+a^2=3a^2$. Jadi $d=a\sqrt3\approx1{,}732a$; untuk $a=5$ ia $5\sqrt3\approx8{,}66$. Batang lurus terpanjang yang muat dalam ruangan berbentuk kubus berusuk $4$ m adalah $4\sqrt3\approx6{,}93$ m, menurut diagonal ruang.

Kubus memiliki $4$ diagonal ruang, semuanya sama panjang, dan semuanya melalui pusat, tempat masing-masing terbagi dua. Ambil titik sudut kubus satuan: arah diagonalnya $(1,1,1)$, $(-1,1,1)$, $(1,-1,1)$, dan $(1,1,-1)$. Dua di antaranya bertemu dengan sudut yang $\cos\theta=\frac{|(1,1,1)\cdot(-1,1,1)|}{3}=\frac13$, sehingga $\theta=\arccos\frac13\approx70{,}53^\circ$. Sebuah diagonal ruang dan sisi tempat ia mulai membentuk sudut $\arctan\frac{1}{\sqrt2}\approx35{,}26^\circ$, karena diagonal naik $a$ pada jarak mendatar $a\sqrt2$. Dari titik sudut mana pun, tujuh titik sudut lainnya berada pada tiga jarak: $3$ pada $a$ (menurut rusuk), $3$ pada $a\sqrt2$ (melintasi sisi), dan $1$ pada $a\sqrt3$ (titik sudut yang berhadapan). Banyak $3,3,1$ itu adalah koefisien $(1+x)^3$.`,
          ),
        },
        FIG_DIAG,
      ],
    },

    /* -------------------------------------------------------------------------------- slicing */
    {
      id: 'cross-sections',
      heading: L('What shapes do you get when a plane cuts a cube?', 'Bentuk apa yang diperoleh ketika sebuah bidang mengiris kubus?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A plane cuts a cube in a triangle, a quadrilateral, a pentagon or a hexagon, never in a polygon with more than six sides, because each side of the cut lies in one face and a cube has only six.** The cut can also be a square, a rectangle, a rhombus, a trapezoid or a parallelogram, and the special positions give the nicest shapes:

- a plane parallel to a face cuts a **square** of area $a^2$;
- a plane parallel to an edge, such as $x+y=t$, cuts a **rectangle** that is $a$ high and $t\sqrt2$ wide (a square when $t=\frac{a}{\sqrt2}$), and through two opposite edges ($x+y=a$) it is the rectangle $a\times a\sqrt2$ of area $a^2\sqrt2$;
- a plane that cuts off a corner, such as $x+y+z=t$ for $t\le a$, cuts an **equilateral triangle**, and the corner it removes is a small pyramid of volume $\frac{t^3}{6}$ (for $t=a$ a sixth of the cube, with the triangle of side $a\sqrt2$ and area $\frac{\sqrt3}{2}a^2$);
- the same plane moved to the middle, $x+y+z=\frac{3a}{2}$, perpendicular to a space diagonal and through the centre, cuts a **regular hexagon**. Its corners are the midpoints of six edges, its side is $\frac{a\sqrt2}{2}$, and its area is $6\cdot\frac{\sqrt3}{4}\cdot\left(\frac{a\sqrt2}{2}\right)^2=\frac{3\sqrt3}{4}a^2\approx1.299a^2$.

A plane such as $x+2y+3z=t$ shows the whole sequence as it moves: a triangle, then a four-sided cut, then a pentagon, then (through the centre) a parallelogram, and back down the other way. Move the plane in the widget: the shape on the right is the cut laid flat, with its true side lengths. Not every polygon appears: no seven-sided cut exists, and a regular hexagon appears only when the plane passes through the centre perpendicular to a space diagonal.`,
            T`**Sebuah bidang mengiris kubus menjadi segitiga, segiempat, segilima, atau segienam, tak pernah menjadi segi banyak dengan lebih dari enam sisi, karena tiap sisi irisan terletak pada satu sisi kubus dan kubus hanya punya enam.** Irisan juga dapat berupa persegi, persegi panjang, belah ketupat, trapesium, atau jajar genjang, dan posisi khusus memberi bentuk yang paling indah:

- bidang yang sejajar sebuah sisi mengiris **persegi** dengan luas $a^2$;
- bidang yang sejajar sebuah rusuk, seperti $x+y=t$, mengiris **persegi panjang** yang tingginya $a$ dan lebarnya $t\sqrt2$ (persegi bila $t=\frac{a}{\sqrt2}$), dan melalui dua rusuk yang berhadapan ($x+y=a$) ia persegi panjang $a\times a\sqrt2$ dengan luas $a^2\sqrt2$;
- bidang yang memotong sebuah sudut, seperti $x+y+z=t$ untuk $t\le a$, mengiris **segitiga sama sisi**, dan sudut yang dipotongnya adalah limas kecil dengan volume $\frac{t^3}{6}$ (untuk $t=a$ seperenam kubus, dengan segitiga bersisi $a\sqrt2$ dan luas $\frac{\sqrt3}{2}a^2$);
- bidang yang sama yang digeser ke tengah, $x+y+z=\frac{3a}{2}$, tegak lurus pada diagonal ruang dan melalui pusat, mengiris **segienam beraturan**. Titik sudutnya adalah titik tengah enam rusuk, sisinya $\frac{a\sqrt2}{2}$, dan luasnya $6\cdot\frac{\sqrt3}{4}\cdot\left(\frac{a\sqrt2}{2}\right)^2=\frac{3\sqrt3}{4}a^2\approx1{,}299a^2$.

Bidang seperti $x+2y+3z=t$ memperlihatkan seluruh urutan saat ia bergerak: segitiga, lalu irisan bersisi empat, lalu segilima, lalu (melalui pusat) jajar genjang, dan turun kembali ke arah sebaliknya. Gerakkan bidang pada widget: bentuk di kanan adalah irisan yang dibentangkan, dengan panjang sisi sebenarnya. Tidak setiap segi banyak muncul: tak ada irisan bersisi tujuh, dan segienam beraturan hanya muncul bila bidang melalui pusat tegak lurus pada diagonal ruang.`,
          ),
        },
        { kind: 'widget', name: 'cbcut' },
        FIG_HEX,
      ],
    },

    /* ------------------------------------------------------------------------------ spheres */
    {
      id: 'spheres-and-cubes',
      heading: L('How large is the sphere inside a cube, and the sphere around it?', 'Seberapa besar bola di dalam kubus, dan bola yang mengelilinginya?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The largest sphere inside a cube touches the six faces, has radius $\frac a2$, and fills $\frac\pi6\approx52.4\%$ of the cube; the sphere through all eight corners has radius $\frac{a\sqrt3}{2}$ and a volume of $\frac{\pi\sqrt3}{2}a^3\approx2.72a^3$.** The inner sphere has diameter $a$, the edge, so its volume is $\frac43\pi\left(\frac a2\right)^3=\frac\pi6a^3$ against the cube’s $a^3$. The outer sphere has the space diagonal $a\sqrt3$ for a diameter, so its radius is $\frac{a\sqrt3}{2}$ and its volume is $\frac43\pi\left(\frac{a\sqrt3}{2}\right)^3=\frac{\pi\sqrt3}{2}a^3$, a little over $2.7$ cubes. A third sphere, with radius $\frac{a}{\sqrt2}$, just touches the twelve edges, between the two. So the three radii are in the ratio $\frac12:\frac{1}{\sqrt2}:\frac{\sqrt3}{2}$, about $0.5:0.707:0.866$ times the edge.`,
            T`**Bola terbesar di dalam kubus menyentuh keenam sisi, berjari-jari $\frac a2$, dan mengisi $\frac\pi6\approx52{,}4\%$ kubus; bola yang melalui kedelapan titik sudut berjari-jari $\frac{a\sqrt3}{2}$ dan bervolume $\frac{\pi\sqrt3}{2}a^3\approx2{,}72a^3$.** Bola dalam berdiameter $a$, sama dengan rusuk, sehingga volumenya $\frac43\pi\left(\frac a2\right)^3=\frac\pi6a^3$ terhadap $a^3$ milik kubus. Bola luar berdiameter diagonal ruang $a\sqrt3$, sehingga jari-jarinya $\frac{a\sqrt3}{2}$ dan volumenya $\frac43\pi\left(\frac{a\sqrt3}{2}\right)^3=\frac{\pi\sqrt3}{2}a^3$, sedikit lebih dari $2{,}7$ kubus. Bola ketiga, berjari-jari $\frac{a}{\sqrt2}$, tepat menyentuh kedua belas rusuk, di antara keduanya. Jadi ketiga jari-jari berbanding $\frac12:\frac{1}{\sqrt2}:\frac{\sqrt3}{2}$, sekitar $0{,}5:0{,}707:0{,}866$ kali rusuk.`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------- cube numbers */
    {
      id: 'cube-numbers',
      heading: L('What are cube numbers, and what is the cube of a sum?', 'Apa itu bilangan kubik, dan apa pangkat tiga suatu jumlah?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A cube number is $n^3$, the volume of a cube with whole-number edge $n$: $1,8,27,64,125,\ldots$, and the cube of a sum $(a+b)^3$ breaks a cube of edge $a+b$ into eight pieces.** Cut such a cube by planes at distance $a$ from the corners: the pieces are one cube $a^3$, three slabs $a^2b$, three rods $ab^2$ and one small cube $b^3$, so
$$(a+b)^3=a^3+3a^2b+3ab^2+b^3.$$
For $a=2$ and $b=1$: $27=8+12+6+1$. The coefficients $1,3,3,1$ count the pieces, and they come back as the row of Pascal’s triangle (see [expanding brackets](article:algebraic-expressions#expand)).

Two more facts about cube numbers. The sum of the first $n$ cubes is a perfect square, the square of the sum of the first $n$ numbers (Nicomachus’s theorem): $1^3+2^3+\cdots+n^3=\left(\frac{n(n+1)}{2}\right)^2$, so for $n=10$ it is $55^2=3025$. And to find a cube root that is not a whole number, such as the edge of a cube of volume $30$, use Newton’s iteration $x_{k+1}=\frac{2x_k+v/x_k^2}{3}$ (see [Newton’s method](article:newtons-method#idea)): for $\sqrt[3]{30}$ start at $3$ and it settles at $3.1072$ within a few steps.`,
            T`**Bilangan kubik adalah $n^3$, volume kubus dengan rusuk bilangan bulat $n$: $1,8,27,64,125,\ldots$, dan pangkat tiga suatu jumlah $(a+b)^3$ memecah kubus berusuk $a+b$ menjadi delapan bagian.** Potong kubus seperti itu dengan bidang pada jarak $a$ dari sudut-sudutnya: bagiannya satu kubus $a^3$, tiga lempeng $a^2b$, tiga batang $ab^2$, dan satu kubus kecil $b^3$, sehingga
$$(a+b)^3=a^3+3a^2b+3ab^2+b^3.$$
Untuk $a=2$ dan $b=1$: $27=8+12+6+1$. Koefisien $1,3,3,1$ menghitung bagian-bagiannya, dan kembali sebagai baris segitiga Pascal (lihat [menjabarkan kurung](article:algebraic-expressions#expand)).

Dua fakta lagi tentang bilangan kubik. Jumlah $n$ kubik pertama adalah kuadrat sempurna, kuadrat jumlah $n$ bilangan pertama (teorema Nicomachus): $1^3+2^3+\cdots+n^3=\left(\frac{n(n+1)}{2}\right)^2$, sehingga untuk $n=10$ ia $55^2=3025$. Dan untuk mencari akar pangkat tiga yang bukan bilangan bulat, seperti rusuk kubus bervolume $30$, pakai iterasi Newton $x_{k+1}=\frac{2x_k+v/x_k^2}{3}$ (lihat [metode Newton](article:newtons-method#idea)): untuk $\sqrt[3]{30}$ mulai dari $3$ dan ia menetap di $3{,}1072$ dalam beberapa langkah.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------- doubling */
    {
      id: 'doubling-the-cube',
      heading: L('Why can you not double the cube with a compass and a ruler?', 'Mengapa kubus tak dapat digandakan dengan jangka dan penggaris?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To double the volume of a cube you must multiply its edge by $\sqrt[3]{2}\approx1.259921$, and a compass and straightedge cannot construct that length from a unit length; this was proved by Pierre Wantzel in 1837.** The volume doubles when $k^3=2$, so $k=\sqrt[3]{2}$. A compass and straightedge can only produce lengths that come from whole numbers by adding, subtracting, multiplying, dividing and taking *square* roots, and each such step at most doubles the degree of the equation the number satisfies, so the degree is always a power of $2$. But $\sqrt[3]{2}$ is a root of $x^3-2=0$, an equation of degree $3$ that cannot be broken into smaller ones, and $3$ is not a power of $2$. So the length cannot be constructed, however clever the drawing.

The legend says the people of Delos were told by an oracle to double the altar of Apollo, a cube, to stop a plague; the problem is called the Delian problem. Greek geometers solved it with other tools (curves, a marked ruler), and a number can be found as accurately as you wish by arithmetic: Newton’s iteration from $1$ gives $1$, $\frac43=1.3333$, $\frac{91}{72}=1.2639$, $1.259933$, $1.2599210500$: after four steps the cube of the answer is $2$ to nine digits.`,
            T`**Untuk menggandakan volume kubus kamu harus mengalikan rusuknya dengan $\sqrt[3]{2}\approx1{,}259921$, dan jangka serta penggaris tak dapat mengonstruksi panjang itu dari panjang satuan; ini dibuktikan oleh Pierre Wantzel pada 1837.** Volume menjadi dua kali ketika $k^3=2$, jadi $k=\sqrt[3]{2}$. Jangka dan penggaris hanya dapat menghasilkan panjang yang berasal dari bilangan bulat dengan menjumlah, mengurang, mengali, membagi, dan menarik akar *kuadrat*, dan tiap langkah demikian paling banyak menggandakan derajat persamaan yang dipenuhi bilangan itu, sehingga derajatnya selalu pangkat dari $2$. Tetapi $\sqrt[3]{2}$ adalah akar $x^3-2=0$, persamaan berderajat $3$ yang tak dapat dipecah menjadi yang lebih kecil, dan $3$ bukan pangkat dari $2$. Jadi panjang itu tak dapat dikonstruksi, sepandai apa pun gambarnya.

Legenda mengatakan penduduk Delos diberi tahu oleh ramalan untuk menggandakan altar Apollo, sebuah kubus, agar wabah berhenti; masalahnya disebut masalah Delos. Ahli geometri Yunani menyelesaikannya dengan alat lain (kurva, penggaris bertanda), dan bilangannya dapat ditemukan seteliti yang kamu mau dengan aritmetika: iterasi Newton dari $1$ memberi $1$, $\frac43=1{,}3333$, $\frac{91}{72}=1{,}2639$, $1{,}259933$, $1{,}2599210500$: setelah empat langkah pangkat tiga jawabannya $2$ sampai sembilan digit.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------------------- code */
    {
      id: 'cube-in-code',
      heading: L('How do you work with a cube in a program?', 'Bagaimana bekerja dengan kubus dalam program?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A program treats a cube as the numbers $0$ to $7$ read as three bits: the bits are the coordinates of a corner, an edge joins two numbers that differ in one bit, and the distances between corners are counted by the bits that differ.** For $0/1$ coordinates the number of differing bits is exactly the squared distance, so from a corner there are $3$ corners at squared distance $1$, $3$ at $2$ and $1$ at $3$. Walking along edges through all eight corners is the Gray code $i\oplus(i\gg1)$, where consecutive numbers differ in one bit: $0,1,3,2,6,7,5,4$. The programs below print, for a cube of edge $3$, the surface area and volume and the two diagonals, then the counts $8$ corners, $12$ edges and $V-E+F=2$, the distance counts, and the walk.`,
            T`**Program memperlakukan kubus sebagai bilangan $0$ sampai $7$ yang dibaca sebagai tiga bit: bit-bit itu adalah koordinat sebuah titik sudut, sebuah rusuk menghubungkan dua bilangan yang berbeda satu bit, dan jarak antar titik sudut dihitung dari bit yang berbeda.** Untuk koordinat $0/1$ banyaknya bit yang berbeda tepat sama dengan jarak kuadrat, sehingga dari satu titik sudut ada $3$ titik sudut pada jarak kuadrat $1$, $3$ pada $2$, dan $1$ pada $3$. Berjalan menyusuri rusuk melalui kedelapan titik sudut adalah kode Gray $i\oplus(i\gg1)$, tempat bilangan berurutan berbeda satu bit: $0,1,3,2,6,7,5,4$. Program di bawah mencetak, untuk kubus berusuk $3$, luas permukaan, volume, dan kedua diagonal, lalu banyak $8$ titik sudut, $12$ rusuk, dan $V-E+F=2$, banyak jarak, dan jalannya.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: a cube from three bits', 'Python: kubus dari tiga bit'),
          code: `from collections import Counter
from itertools import product
from math import sqrt


def measures(a):
    return {
        'surface': 6 * a * a,
        'volume': a ** 3,
        'face diagonal': round(a * sqrt(2), 3),
        'space diagonal': round(a * sqrt(3), 3),
    }


corners = list(product((0, 1), repeat=3))                 # the eight corners: every triple of 0s and 1s
differ = lambda p, q: sum(x != y for x, y in zip(p, q))   # for 0/1 coordinates this is also the squared distance
edges = [(p, q) for i, p in enumerate(corners) for q in corners[i + 1:] if differ(p, q) == 1]

print(measures(3))                      # {'surface': 54, 'volume': 27, 'face diagonal': 4.243, 'space diagonal': 5.196}
print(len(corners), len(edges), len(corners) - len(edges) + 6)    # 8 12 2
print(sorted(Counter(differ(corners[0], q) for q in corners[1:]).items()))   # [(1, 3), (2, 3), (3, 1)]
print([i ^ (i >> 1) for i in range(8)])  # [0, 1, 3, 2, 6, 7, 5, 4]: a walk along edges through all corners`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: the same', 'JavaScript: yang sama'),
          code: `const measures = (a) => ({ surface: 6 * a * a, volume: a ** 3, faceDiagonal: +(a * Math.sqrt(2)).toFixed(3), spaceDiagonal: +(a * Math.sqrt(3)).toFixed(3) })

const corners = Array.from({ length: 8 }, (_, i) => i)   // the bits of i are x, y and z
const differ = (p, q) => [0, 1, 2].filter((b) => ((p >> b) & 1) !== ((q >> b) & 1)).length
const edges = corners.flatMap((p) => corners.filter((q) => q > p && differ(p, q) === 1).map((q) => [p, q]))

measures(3)                                               // { surface: 54, volume: 27, faceDiagonal: 4.243, spaceDiagonal: 5.196 }
;[corners.length, edges.length, corners.length - edges.length + 6]   // [8, 12, 2]
const at = {}
for (const q of corners.slice(1)) at[differ(0, q)] = (at[differ(0, q)] ?? 0) + 1
at                                                        // { '1': 3, '2': 3, '3': 1 }
corners.map((i) => i ^ (i >> 1))                          // [0, 1, 3, 2, 6, 7, 5, 4]`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++: the same with bits', 'C++: yang sama dengan bit'),
          code: `#include <iostream>
#include <cstdio>
#include <cmath>
using namespace std;

// how many bits differ: for corners numbered 0 to 7 this is the squared distance
int differ(int p, int q) {
  int d = 0;
  for (int bit = 0; bit < 3; bit++) {
    if (((p >> bit) & 1) != ((q >> bit) & 1)) d++;
  }
  return d;
}

int main() {
  double a = 3;
  printf("surface %.0f; volume %.0f\\n", 6 * a * a, a * a * a);
  printf("face diagonal %.3f; space diagonal %.3f\\n", a * sqrt(2.0), a * sqrt(3.0));

  int edges = 0;
  for (int p = 0; p < 8; p++) {
    for (int q = p + 1; q < 8; q++) {
      if (differ(p, q) == 1) edges++;
    }
  }
  printf("%d %d %d\\n", 8, edges, 8 - edges + 6);

  int at1 = 0;
  int at2 = 0;
  int at3 = 0;
  for (int q = 1; q < 8; q++) {
    int d = differ(0, q);
    if (d == 1) at1++;
    if (d == 2) at2++;
    if (d == 3) at3++;
  }
  printf("%d %d %d\\n", at1, at2, at3);

  for (int i = 0; i < 8; i++) printf("%d ", i ^ (i >> 1));
  printf("\\n");
  return 0;
}

/* output:
surface 54; volume 27
face diagonal 4.243; space diagonal 5.196
8 12 2
3 3 1
0 1 3 2 6 7 5 4
*/`,
        },
      ],
    },

    /* ------------------------------------------------------------------------------- world */
    {
      id: 'cubes-in-the-world',
      heading: L('How many different dice are there, and how many positions has a Rubik’s cube?', 'Ada berapa dadu yang berbeda, dan berapa banyak posisi kubus Rubik?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**There are $30$ different dice if the faces carry $1$ to $6$ once each and turning a die does not make a new one, and only $2$ of them have opposite faces adding to $7$, which are mirror images of each other.** Without turning there are $6!=720$ ways to write the numbers on six faces, and a cube can be turned in $24$ ways (the $6$ faces that can lie on the table times $4$ quarter turns), so $\frac{720}{24}=30$. Fix the pairs of opposite faces as $(1,6)$, $(2,5)$, $(3,4)$ and only the left or right handed arrangement remains: place $1$ on top and $2$ in front, and $3$ goes either on the right or on the left. Dice for games use one of the two, the other being their reflection. Dice are very old: cubes marked this way are about $5000$ years old.

A $3\times3\times3$ puzzle cube has $8$ corner pieces, $12$ edge pieces and $6$ centres. The corners can be arranged in $8!$ ways and each can be twisted in $3$ ways (the last twist is forced), the edges in $12!$ ways and each flipped in $2$ ways (the last flip is forced), and half of these combinations cannot be reached by turning the faces, giving
$$\frac{8!\cdot3^7\cdot12!\cdot2^{11}}{2}=43\,252\,003\,274\,489\,856\,000\approx4.3\times10^{19}$$
positions. Of the $27$ little cubes of a $3\times3\times3$ block, $26$ show a face and the middle one is hidden, which is also $3^3-1^3$.`,
            T`**Ada $30$ dadu yang berbeda bila sisinya memuat $1$ sampai $6$ masing-masing sekali dan memutar dadu tak membuat dadu baru, dan hanya $2$ di antaranya yang sisi berhadapannya berjumlah $7$, yang saling merupakan bayangan cermin.** Tanpa memutar ada $6!=720$ cara menuliskan bilangan pada enam sisi, dan kubus dapat diputar dalam $24$ cara ($6$ sisi yang dapat berada di meja kali $4$ putaran seperempat), jadi $\frac{720}{24}=30$. Tetapkan pasangan sisi berhadapan sebagai $(1,6)$, $(2,5)$, $(3,4)$ dan hanya tersisa susunan kidal atau kanan: letakkan $1$ di atas dan $2$ di depan, dan $3$ berada di kanan atau di kiri. Dadu untuk permainan memakai salah satu dari keduanya, yang lain adalah bayangannya. Dadu sangat tua: kubus yang ditandai seperti ini berumur sekitar $5000$ tahun.

Kubus teka-teki $3\times3\times3$ memiliki $8$ keping sudut, $12$ keping rusuk, dan $6$ pusat. Sudutnya dapat disusun dalam $8!$ cara dan masing-masing dapat diputar dalam $3$ cara (putaran terakhir ditentukan), rusuknya dalam $12!$ cara dan masing-masing dibalik dalam $2$ cara (pembalikan terakhir ditentukan), dan separuh kombinasi itu tak dapat dicapai dengan memutar sisi-sisinya, sehingga diperoleh
$$\frac{8!\cdot3^7\cdot12!\cdot2^{11}}{2}=43.252.003.274.489.856.000\approx4{,}3\times10^{19}$$
posisi. Dari $27$ kubus kecil pada balok $3\times3\times3$, $26$ memperlihatkan sebuah sisi dan yang di tengah tersembunyi, yang juga $3^3-1^3$.`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where does the cube come from in mathematics?', 'Dari mana asal kubus dalam matematika?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The cube is among the oldest shapes in mathematics: it is one of the five regular solids the Greeks described, and a problem about it stood open for more than two thousand years.**

- **About 3000 BCE.** Dice shaped like cubes, with the faces marked by dots, are found in the ancient Near East; the oldest known are about $5000$ years old.
- **About 360 BCE.** Plato’s *Timaeus* associates the five regular solids with the elements, and gives the cube to earth, the most stable.
- **About 300 BCE.** Euclid’s *Elements* ends with Book XIII, which constructs the five regular solids; Proposition 15 constructs the cube and encloses it in a sphere.
- **About 430 BCE onward.** The Delian problem, doubling a cube, is posed. Hippocrates of Chios reduces it to finding two mean proportionals, and Archytas finds a construction in three dimensions.
- **1750.** Euler states the formula $V-E+F=2$ for solids such as the cube, in a letter to Goldbach.
- **1837.** Pierre Wantzel proves that doubling the cube, and trisecting an angle, cannot be done with a compass and straightedge.
- **1974.** Ernő Rubik, a Hungarian architect, invents the puzzle cube; it is sold around the world from 1980.`,
            T`**Kubus termasuk bentuk tertua dalam matematika: ia satu dari lima bangun beraturan yang diuraikan orang Yunani, dan sebuah masalah tentangnya terbuka lebih dari dua ribu tahun.**

- **Sekitar 3000 SM.** Dadu berbentuk kubus, dengan sisi bertanda titik, ditemukan di Timur Dekat kuno; yang tertua dikenal berumur sekitar $5000$ tahun.
- **Sekitar 360 SM.** *Timaeus* karya Plato mengaitkan lima bangun beraturan dengan unsur, dan memberikan kubus kepada tanah, yang paling mantap.
- **Sekitar 300 SM.** *Elements* Euclid berakhir dengan Buku XIII, yang mengonstruksi lima bangun beraturan; Proposisi 15 mengonstruksi kubus dan melingkupinya dalam bola.
- **Sekitar 430 SM dan sesudahnya.** Masalah Delos, menggandakan kubus, diajukan. Hippocrates dari Chios menyederhanakannya menjadi mencari dua rata-rata geometrik, dan Archytas menemukan konstruksi dalam tiga dimensi.
- **1750.** Euler menyatakan rumus $V-E+F=2$ untuk bangun seperti kubus, dalam surat kepada Goldbach.
- **1837.** Pierre Wantzel membuktikan bahwa menggandakan kubus, dan membagi tiga sebuah sudut, tak dapat dilakukan dengan jangka dan penggaris.
- **1974.** Ernő Rubik, seorang arsitek Hungaria, menciptakan kubus teka-teki; ia dijual ke seluruh dunia sejak 1980.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What are the common mistakes with the cube?', 'Apa kesalahan umum pada kubus?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with the cube are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ Surface area $=a^3$, or volume $=6a^2$ | Area is $6a^2$ (square units), volume is $a^3$ (cubic units). |
| ❌ Surface area $=a^2$ | That is one face: the surface is six faces, $6a^2$. |
| ❌ Doubling the edge doubles the volume | The volume becomes $2^3=8$ times as large, the surface $2^2=4$ times. |
| ❌ The space diagonal is $a\sqrt2$ | $a\sqrt2$ is a *face* diagonal; the space diagonal is $a\sqrt3$. |
| ❌ A cube has $8$ edges and $12$ corners | $12$ edges and $8$ corners, and $6$ faces: $8-12+6=2$. |
| ❌ Any six squares joined together make a net | Only $11$ of the $35$ do: no $2\times2$ block, no row of five, no overlap. |
| ❌ The cut of a cube is always a square | It can be a triangle, a rectangle, a pentagon or a hexagon too. |
| ❌ The inscribed sphere has radius $a$ | Its diameter is $a$, so its radius is $\frac a2$. |
| ❌ Mixing units: edge in cm, volume in litres | $1$ dm³ $=1$ litre, $1000$ cm³ $=1$ litre: convert the edge first. |`,
            T`**Kesalahan paling umum pada kubus adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ Luas permukaan $=a^3$, atau volume $=6a^2$ | Luasnya $6a^2$ (satuan persegi), volumenya $a^3$ (satuan kubik). |
| ❌ Luas permukaan $=a^2$ | Itu satu sisi: permukaannya enam sisi, $6a^2$. |
| ❌ Menggandakan rusuk menggandakan volume | Volumenya menjadi $2^3=8$ kali lipat, luas permukaannya $2^2=4$ kali. |
| ❌ Diagonal ruang adalah $a\sqrt2$ | $a\sqrt2$ adalah diagonal *sisi*; diagonal ruang adalah $a\sqrt3$. |
| ❌ Kubus memiliki $8$ rusuk dan $12$ titik sudut | $12$ rusuk dan $8$ titik sudut, dan $6$ sisi: $8-12+6=2$. |
| ❌ Enam persegi yang disambung mana pun membentuk jaring-jaring | Hanya $11$ dari $35$: tanpa blok $2\times2$, tanpa baris lima, tanpa tumpang tindih. |
| ❌ Irisan kubus selalu persegi | Ia bisa juga segitiga, persegi panjang, segilima, atau segienam. |
| ❌ Bola dalam berjari-jari $a$ | Diameternya $a$, sehingga jari-jarinya $\frac a2$. |
| ❌ Mencampur satuan: rusuk dalam cm, volume dalam liter | $1$ dm³ $=1$ liter, $1000$ cm³ $=1$ liter: ubah rusuknya dulu. |`,
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
              L(T`A cube has $12$ edges and $8$ corners.`, T`Kubus memiliki $12$ rusuk dan $8$ titik sudut.`),
              L(T`The surface area of a cube with edge $a$ is $a^3$.`, T`Luas permukaan kubus dengan rusuk $a$ adalah $a^3$.`),
              L(T`The space diagonal of a cube is longer than the diagonal of a face.`, T`Diagonal ruang kubus lebih panjang daripada diagonal sebuah sisi.`),
              L(T`Doubling the edge of a cube doubles its volume.`, T`Menggandakan rusuk kubus menggandakan volumenya.`),
              L(T`A cube has exactly $11$ different nets.`, T`Kubus memiliki tepat $11$ jaring-jaring yang berbeda.`),
              L(T`A plane can cut a cube in a regular hexagon.`, T`Sebuah bidang dapat mengiris kubus menjadi segienam beraturan.`),
            ],
            answer: [true, false, true, false, true, true],
            explain: L(
              T`The surface is $6a^2$; $a^3$ is the volume. $a\sqrt3>a\sqrt2$. Doubling the edge multiplies the volume by $8$. There are $11$ nets. The plane through the centre perpendicular to a space diagonal cuts a regular hexagon.`,
              T`Luas permukaannya $6a^2$; $a^3$ adalah volume. $a\sqrt3>a\sqrt2$. Menggandakan rusuk mengalikan volume dengan $8$. Ada $11$ jaring-jaring. Bidang melalui pusat tegak lurus pada diagonal ruang mengiris segienam beraturan.`,
            ),
            hint: L(T`Check each formula against its units: area in square units, volume in cubic units, and think about what multiplying every edge by $2$ does.`, T`Periksa tiap rumus terhadap satuannya: luas dalam satuan persegi, volume dalam satuan kubik, dan pikirkan apa yang dilakukan pengalian setiap rusuk dengan $2$.`),
          },
        },
        {
          kind: 'activity',
          title: L('Surface area', 'Luas permukaan'),
          step: {
            kind: 'math',
            id: 'p2',
            hints: [L(T`Six faces, each $a^2$.`, T`Enam sisi, masing-masing $a^2$.`), L(T`$6\cdot5^2$.`, T`$6\cdot5^2$.`)],
            explain: L(T`$6a^2=6\cdot25=150$.`, T`$6a^2=6\cdot25=150$.`),
            prompt: L(T`What is the surface area of a cube with edge $5$ cm, in cm²?`, T`Berapa luas permukaan kubus berusuk $5$ cm, dalam cm²?`),
            given: String.raw`S=v`,
            blanks: [{ label: 'S =', answer: 150 }],
          },
        },
        {
          kind: 'activity',
          title: L('Volume', 'Volume'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L(T`$V=a^3$.`, T`$V=a^3$.`), L(T`$7\cdot7\cdot7$.`, T`$7\cdot7\cdot7$.`)],
            explain: L(T`$7^3=343$.`, T`$7^3=343$.`),
            prompt: L(T`What is the volume of a cube with edge $7$ cm, in cm³?`, T`Berapa volume kubus berusuk $7$ cm, dalam cm³?`),
            given: String.raw`V=v`,
            blanks: [{ label: 'V =', answer: 343 }],
          },
        },
        {
          kind: 'activity',
          title: L('The edge from the volume', 'Rusuk dari volume'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L(T`Which number multiplied by itself three times gives $216$?`, T`Bilangan mana yang dikalikan dengan dirinya tiga kali memberi $216$?`), L(T`$6\cdot6=36$ and $36\cdot6=216$.`, T`$6\cdot6=36$ dan $36\cdot6=216$.`)],
            explain: L(T`$\sqrt[3]{216}=6$, since $6^3=216$.`, T`$\sqrt[3]{216}=6$, karena $6^3=216$.`),
            prompt: L(T`A cube has volume $216$ cm³. How long is its edge, in cm?`, T`Sebuah kubus bervolume $216$ cm³. Berapa panjang rusuknya, dalam cm?`),
            given: String.raw`a=v`,
            blanks: [{ label: 'a =', answer: 6 }],
          },
        },
        {
          kind: 'activity',
          title: L('A water tank', 'Sebuah bak air'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [L(T`Change $40$ cm to decimetres first: $4$ dm.`, T`Ubah $40$ cm menjadi desimeter lebih dulu: $4$ dm.`), L(T`$1$ dm³ is $1$ litre.`, T`$1$ dm³ adalah $1$ liter.`)],
            explain: L(T`$40$ cm $=4$ dm, so the volume is $4^3=64$ dm³ $=64$ litres.`, T`$40$ cm $=4$ dm, sehingga volumenya $4^3=64$ dm³ $=64$ liter.`),
            prompt: L(T`A cube-shaped tank has an edge of $40$ cm. How many litres does it hold?`, T`Sebuah bak berbentuk kubus berusuk $40$ cm. Berapa liter yang dimuatnya?`),
            given: String.raw`L=v`,
            blanks: [{ label: 'L =', answer: 64 }],
          },
        },
        {
          kind: 'activity',
          title: L('The space diagonal squared', 'Diagonal ruang kuadrat'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L(T`$d^2=3a^2$.`, T`$d^2=3a^2$.`), L(T`$3\cdot5^2$.`, T`$3\cdot5^2$.`)],
            explain: L(T`$d^2=3\cdot25=75$, so $d=5\sqrt3\approx8.66$.`, T`$d^2=3\cdot25=75$, sehingga $d=5\sqrt3\approx8{,}66$.`),
            prompt: L(T`The edge of a cube is $5$. What is the square of its space diagonal, $d^2$?`, T`Rusuk sebuah kubus adalah $5$. Berapa kuadrat diagonal ruangnya, $d^2$?`),
            given: String.raw`d^2=v`,
            blanks: [{ label: 'd² =', answer: 75 }],
          },
        },
        {
          kind: 'activity',
          title: L('Scaling', 'Perubahan skala'),
          step: {
            kind: 'quiz',
            id: 'p7',
            prompt: L('Every edge of a cube is tripled. By what factor does the volume grow?', 'Setiap rusuk kubus dilipattigakan. Berapa kali volumenya bertambah?'),
            options: [L('3', '3'), L('9', '9'), L('27', '27'), L('81', '81')],
            answer: 2,
            explain: L('Volume grows with the cube of the edge: $3^3=27$. The surface grows $3^2=9$ times.', 'Volume bertambah menurut pangkat tiga rusuk: $3^3=27$. Luas permukaan bertambah $3^2=9$ kali.'),
            hint: L('Volume is $a^3$: what happens to $(3a)^3$?', 'Volume adalah $a^3$: apa yang terjadi pada $(3a)^3$?'),
          },
        },
        {
          kind: 'activity',
          title: L('How many nets?', 'Ada berapa jaring-jaring?'),
          step: {
            kind: 'quiz',
            id: 'p8',
            prompt: L('How many different nets does a cube have?', 'Ada berapa jaring-jaring berbeda pada kubus?'),
            options: [L('6', '6'), L('11', '11'), L('12', '12'), L('35', '35')],
            answer: 1,
            explain: L('There are $35$ ways to join six squares and exactly $11$ of them fold into a cube; $35$ is the number of arrangements, not nets.', 'Ada $35$ cara menyambung enam persegi dan tepat $11$ di antaranya terlipat menjadi kubus; $35$ adalah banyak susunan, bukan jaring-jaring.'),
            hint: L('Not every arrangement of six squares folds: try the widget.', 'Tak setiap susunan enam persegi terlipat: coba widgetnya.'),
          },
        },
        {
          kind: 'activity',
          title: L('Which cuts are possible?', 'Irisan mana yang mungkin?'),
          step: {
            kind: 'multi',
            id: 'p9',
            prompt: L('Which of these can be the cut of a plane through a cube? Choose **all** that apply.', 'Mana dari berikut yang dapat menjadi irisan sebuah bidang melalui kubus? Pilih **semua** yang benar.'),
            options: [L('an equilateral triangle', 'segitiga sama sisi'), L('a square', 'persegi'), L('a regular hexagon', 'segienam beraturan'), L('a heptagon (seven sides)', 'segi tujuh'), L('a circle', 'lingkaran')],
            answer: [0, 1, 2],
            explain: L('Each side of the cut lies in a face, and a cube has six, so there cannot be seven sides; a cut has straight sides, so never a circle. The triangle (a corner), the square (parallel to a face) and the regular hexagon (through the centre) all occur.', 'Tiap sisi irisan terletak pada sebuah sisi kubus, dan kubus punya enam, sehingga tak mungkin ada tujuh sisi; irisan bersisi lurus, jadi tak pernah lingkaran. Segitiga (sebuah sudut), persegi (sejajar sebuah sisi), dan segienam beraturan (melalui pusat) semuanya terjadi.'),
            hint: L('How many faces does a plane meet at most?', 'Paling banyak berapa sisi yang dipotong sebuah bidang?'),
          },
        },
        {
          kind: 'activity',
          title: L('Order the diagonal', 'Urutkan diagonalnya'),
          step: {
            kind: 'order',
            id: 'p10',
            prompt: L('Put the steps of finding the space diagonal of a cube in order.', 'Urutkan langkah mencari diagonal ruang kubus.'),
            lines: {
              en: ['Draw the diagonal of a face and call it f', 'Use Pythagoras in the face: f² = a² + a² = 2a²', 'Draw the space diagonal: the hypotenuse over f and the edge a', 'Use Pythagoras again: d² = f² + a² = 3a²', 'Take the square root: d = a√3'],
              id: ['Gambar diagonal sebuah sisi dan sebut f', 'Pakai Pythagoras pada sisi: f² = a² + a² = 2a²', 'Gambar diagonal ruang: sisi miring di atas f dan rusuk a', 'Pakai Pythagoras lagi: d² = f² + a² = 3a²', 'Tarik akar kuadrat: d = a√3'],
            },
            explain: L(T`The face diagonal comes first because the space diagonal is built on it.`, T`Diagonal sisi datang pertama karena diagonal ruang dibangun di atasnya.`),
            hint: L(T`The second right triangle needs the first diagonal as one of its legs.`, T`Segitiga siku-siku kedua memerlukan diagonal pertama sebagai salah satu sisi tegaknya.`),
          },
        },
        {
          kind: 'activity',
          title: L('Fill in the working', 'Isi pengerjaannya'),
          step: {
            kind: 'fill',
            id: 'p11',
            prompt: L('Complete the working for the space diagonal of a cube with edge a.', 'Lengkapi pengerjaan diagonal ruang kubus dengan rusuk a.'),
            template: {
              en: 'f² = a² + a² = ___a² and d² = f² + a² = ___a² + a² = ___a²',
              id: 'f² = a² + a² = ___a² dan d² = f² + a² = ___a² + a² = ___a²',
            },
            blanks: { en: ['2', '2', '3'], id: ['2', '2', '3'] },
            explain: L(T`$f^2=2a^2$, then $d^2=2a^2+a^2=3a^2$, so $d=a\sqrt3$.`, T`$f^2=2a^2$, lalu $d^2=2a^2+a^2=3a^2$, sehingga $d=a\sqrt3$.`),
            hint: L(T`The second blank repeats the first one: it is $f^2$.`, T`Isian kedua mengulang yang pertama: ia $f^2$.`),
          },
        },
        {
          kind: 'activity',
          title: L('Euler’s formula', 'Rumus Euler'),
          step: {
            kind: 'math',
            id: 'p12',
            hints: [L(T`$V-E+F=2$ with $V=8$ and $E=12$.`, T`$V-E+F=2$ dengan $V=8$ dan $E=12$.`), L(T`$F=2-8+12$.`, T`$F=2-8+12$.`)],
            explain: L(T`$8-12+F=2$, so $F=6$: the six faces of the cube.`, T`$8-12+F=2$, sehingga $F=6$: keenam sisi kubus.`),
            prompt: L(T`A cube has $8$ vertices and $12$ edges. Use $V-E+F=2$ to find the number of faces $F$.`, T`Kubus memiliki $8$ titik sudut dan $12$ rusuk. Pakai $V-E+F=2$ untuk mencari banyak sisi $F$.`),
            given: String.raw`F=v`,
            blanks: [{ label: 'F =', answer: 6 }],
          },
        },
      ],
    },

    /* --------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: the cube at a glance', 'Ringkasan: kubus sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Parts:** $6$ faces, $12$ edges, $8$ corners; $8-12+6=2$. The corners are the triples of $0$s and $1$s.
- **Area and volume:** surface $6a^2$, volume $a^3$; scaling by $k$ gives $k^2$ and $k^3$; $1$ dm³ is $1$ litre.
- **Diagonals:** face $a\sqrt2$, space $a\sqrt3$; two space diagonals meet at $\arccos\frac13\approx70.53^\circ$.
- **Nets:** $11$ of the $35$ hexominoes fold; check by rolling a cube; opposite faces are one square apart in a row.
- **Cuts:** triangle, quadrilateral, pentagon, hexagon, never more than six sides; the central cut perpendicular to a space diagonal is a regular hexagon of area $\frac{3\sqrt3}{4}a^2$.
- **Spheres:** inside, radius $\frac a2$, fills $\frac\pi6$ of the cube; around, radius $\frac{a\sqrt3}{2}$.
- **Cube numbers:** $(a+b)^3=a^3+3a^2b+3ab^2+b^3$; $1^3+\cdots+n^3=\left(\frac{n(n+1)}{2}\right)^2$; doubling needs $\sqrt[3]{2}$, not constructible.`,
            T`- **Bagian:** $6$ sisi, $12$ rusuk, $8$ titik sudut; $8-12+6=2$. Titik sudutnya adalah tripel $0$ dan $1$.
- **Luas dan volume:** permukaan $6a^2$, volume $a^3$; perubahan skala $k$ memberi $k^2$ dan $k^3$; $1$ dm³ adalah $1$ liter.
- **Diagonal:** sisi $a\sqrt2$, ruang $a\sqrt3$; dua diagonal ruang bertemu pada $\arccos\frac13\approx70{,}53^\circ$.
- **Jaring-jaring:** $11$ dari $35$ heksomino terlipat; periksa dengan menggelindingkan kubus; sisi berhadapan berjarak satu persegi dalam satu baris.
- **Irisan:** segitiga, segiempat, segilima, segienam, tak pernah lebih dari enam sisi; irisan tengah yang tegak lurus pada diagonal ruang adalah segienam beraturan dengan luas $\frac{3\sqrt3}{4}a^2$.
- **Bola:** di dalam, berjari-jari $\frac a2$, mengisi $\frac\pi6$ kubus; di sekeliling, berjari-jari $\frac{a\sqrt3}{2}$.
- **Bilangan kubik:** $(a+b)^3=a^3+3a^2b+3ab^2+b^3$; $1^3+\cdots+n^3=\left(\frac{n(n+1)}{2}\right)^2$; penggandaan memerlukan $\sqrt[3]{2}$, tak dapat dikonstruksi.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Cube', 'Kubus'), definition: L('A solid with six identical square faces, twelve equal edges and eight corners, three faces meeting at each corner.', 'Bangun ruang dengan enam sisi persegi yang kongruen, dua belas rusuk sama panjang, dan delapan titik sudut, tiga sisi bertemu di setiap titik sudut.') },
    { term: L('Face, edge, vertex', 'Sisi, rusuk, titik sudut'), definition: L('A flat square of the surface, where two faces meet, and where three edges meet.', 'Persegi datar pada permukaan, tempat dua sisi bertemu, dan tempat tiga rusuk bertemu.') },
    { term: L('Net', 'Jaring-jaring'), definition: L('A flat arrangement of squares joined edge to edge that folds into the cube with no overlap; the cube has 11.', 'Susunan datar persegi yang bersambung sisi ke sisi dan terlipat menjadi kubus tanpa tumpang tindih; kubus memiliki 11.') },
    { term: L('Surface area', 'Luas permukaan'), definition: L('The total area of the faces; for a cube with edge a it is 6 a squared.', 'Jumlah luas semua sisi; untuk kubus dengan rusuk a ia 6 a kuadrat.') },
    { term: L('Volume', 'Volume'), definition: L('The space inside a solid, measured in cubic units; for a cube with edge a it is a cubed.', 'Ruang di dalam bangun ruang, diukur dalam satuan kubik; untuk kubus dengan rusuk a ia a pangkat tiga.') },
    { term: L('Space diagonal', 'Diagonal ruang'), definition: L('The segment joining two opposite corners through the inside of the cube; its length is a times the square root of 3.', 'Ruas yang menghubungkan dua titik sudut berhadapan melalui bagian dalam kubus; panjangnya a kali akar 3.') },
    { term: L('Face diagonal', 'Diagonal sisi'), definition: L('The diagonal of one square face; its length is a times the square root of 2.', 'Diagonal sebuah sisi persegi; panjangnya a kali akar 2.') },
    { term: L('Cross-section', 'Irisan'), definition: L('The shape in which a plane cuts a solid; for a cube it has between three and six sides.', 'Bentuk tempat sebuah bidang mengiris bangun ruang; untuk kubus ia memiliki tiga sampai enam sisi.') },
    { term: L('Cube root', 'Akar pangkat tiga'), definition: L('The number whose cube is a given number; the edge of a cube whose volume is given.', 'Bilangan yang pangkat tiganya adalah bilangan yang diberikan; rusuk kubus yang volumenya diberikan.') },
    { term: L('Euler’s formula', 'Rumus Euler'), definition: L('V minus E plus F equals 2 for a solid without holes, with V vertices, E edges and F faces.', 'V dikurangi E ditambah F sama dengan 2 untuk bangun ruang tanpa lubang, dengan V titik sudut, E rusuk, dan F sisi.') },
  ],

  howTo: [
    {
      name: L('How to find the surface area and the volume of a cube', 'Cara mencari luas permukaan dan volume kubus'),
      description: L('Measure the edge, square it for a face, multiply by six for the surface, and cube it for the volume.', 'Ukur rusuknya, kuadratkan untuk satu sisi, kalikan enam untuk permukaan, dan pangkatkan tiga untuk volume.'),
      steps: [
        { name: L('Measure the edge', 'Ukur rusuknya'), text: L('Write the edge a with its unit, and check that all lengths use the same unit.', 'Tulis rusuk a beserta satuannya, dan pastikan semua panjang memakai satuan yang sama.') },
        { name: L('Find the area of one face', 'Cari luas satu sisi'), text: L('A face is a square, so its area is a times a, a squared.', 'Sebuah sisi adalah persegi, jadi luasnya a kali a, a kuadrat.') },
        { name: L('Multiply by six', 'Kalikan enam'), text: L('The surface area is the six faces together: 6 times a squared, in square units.', 'Luas permukaan adalah keenam sisi bersama: 6 kali a kuadrat, dalam satuan persegi.') },
        { name: L('Cube the edge for the volume', 'Pangkatkan tiga rusuk untuk volume'), text: L('The volume is a times a times a, a cubed, in cubic units; one cubic decimetre is one litre.', 'Volumenya a kali a kali a, a pangkat tiga, dalam satuan kubik; satu desimeter kubik adalah satu liter.') },
      ],
    },
    {
      name: L('How to find the space diagonal of a cube', 'Cara mencari diagonal ruang kubus'),
      description: L('Use the Pythagorean theorem on a face, then again with the edge, or just multiply the edge by the square root of 3.', 'Pakai teorema Pythagoras pada sebuah sisi, lalu lagi dengan rusuknya, atau cukup kalikan rusuk dengan akar 3.'),
      steps: [
        { name: L('Find the diagonal of a face', 'Cari diagonal sebuah sisi'), text: L('The face diagonal f satisfies f squared equals a squared plus a squared, so f is a times the square root of 2.', 'Diagonal sisi f memenuhi f kuadrat sama dengan a kuadrat ditambah a kuadrat, sehingga f adalah a kali akar 2.') },
        { name: L('Build the second right triangle', 'Susun segitiga siku-siku kedua'), text: L('Its legs are the face diagonal f and the edge a that stands up from its end; the space diagonal d is the hypotenuse.', 'Sisi tegaknya adalah diagonal sisi f dan rusuk a yang berdiri dari ujungnya; diagonal ruang d adalah sisi miringnya.') },
        { name: L('Apply Pythagoras again', 'Terapkan Pythagoras lagi'), text: L('d squared equals f squared plus a squared, which is 3 times a squared.', 'd kuadrat sama dengan f kuadrat ditambah a kuadrat, yaitu 3 kali a kuadrat.') },
        { name: L('Take the square root', 'Tarik akar kuadratnya'), text: L('d equals a times the square root of 3, about 1.732 times the edge.', 'd sama dengan a kali akar 3, sekitar 1,732 kali rusuk.') },
      ],
    },
    {
      name: L('How to check whether six squares are a net of a cube', 'Cara memeriksa apakah enam persegi adalah jaring-jaring kubus'),
      description: L('Count the squares, look for blocks and long rows, then roll a cube over them and check that no face is covered twice.', 'Hitung persegi, cari blok dan baris panjang, lalu gelindingkan kubus di atasnya dan periksa bahwa tak ada sisi yang tertutup dua kali.'),
      steps: [
        { name: L('Count and join', 'Hitung dan sambung'), text: L('There must be exactly six squares, each joined to another along a whole edge.', 'Harus ada tepat enam persegi, masing-masing bersambung dengan yang lain sepanjang satu sisi penuh.') },
        { name: L('Look for obvious failures', 'Cari kegagalan yang jelas'), text: L('A 2 by 2 block, or a row of five or more squares, can never fold into a cube.', 'Blok 2 kali 2, atau baris lima persegi atau lebih, tak pernah terlipat menjadi kubus.') },
        { name: L('Roll a cube over the squares', 'Gelindingkan kubus di atas persegi'), text: L('Put a cube on one square and roll it from square to square, noting which face lands on each.', 'Letakkan kubus di satu persegi dan gelindingkan dari persegi ke persegi, mencatat sisi mana yang mendarat di masing-masing.') },
        { name: L('Check the faces', 'Periksa sisinya'), text: L('If the six squares meet six different faces it is a net; if two meet the same face, it is not.', 'Bila keenam persegi menyentuh enam sisi berbeda, itu jaring-jaring; bila dua menyentuh sisi yang sama, bukan.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is a cube in geometry?', 'Apa itu kubus dalam geometri?'),
      a: L(
        'A cube is a solid with six identical square faces, twelve edges of equal length and eight corners, where three faces meet at each corner. It is also called a regular hexahedron and is one of the five Platonic solids.',
        'Kubus adalah bangun ruang dengan enam sisi persegi yang kongruen, dua belas rusuk sama panjang, dan delapan titik sudut, tempat tiga sisi bertemu di setiap titik sudut. Ia juga disebut heksahedron beraturan dan satu dari lima bangun ruang Platonik.',
      ),
    },
    {
      q: L('How do you find the volume of a cube?', 'Bagaimana mencari volume kubus?'),
      a: L(
        'Cube the edge: the volume is a times a times a, a cubed, in cubic units. A cube with edge 3 cm has volume 27 cm³. To find the edge from the volume, take the cube root.',
        'Pangkatkan tiga rusuknya: volumenya a kali a kali a, a pangkat tiga, dalam satuan kubik. Kubus dengan rusuk 3 cm memiliki volume 27 cm³. Untuk mencari rusuk dari volume, ambil akar pangkat tiga.',
      ),
    },
    {
      q: L('What is the formula for the surface area of a cube?', 'Apa rumus luas permukaan kubus?'),
      a: L(
        'The surface area is 6 times a squared, where a is the edge. A cube has six faces and each is a square of area a squared. For an edge of 5 the surface area is 150.',
        'Luas permukaan adalah 6 kali a kuadrat, dengan a rusuknya. Kubus memiliki enam sisi dan masing-masing adalah persegi dengan luas a kuadrat. Untuk rusuk 5 luas permukaannya 150.',
      ),
    },
    {
      q: L('How do you find the space diagonal of a cube?', 'Bagaimana mencari diagonal ruang kubus?'),
      a: L(
        'Multiply the edge by the square root of 3. Pythagoras on a face gives the face diagonal a times root 2, and Pythagoras again with the edge gives d squared equal to 3 a squared. For an edge of 5 the diagonal is about 8.66.',
        'Kalikan rusuk dengan akar 3. Pythagoras pada sebuah sisi memberi diagonal sisi a kali akar 2, dan Pythagoras lagi dengan rusuk memberi d kuadrat sama dengan 3 a kuadrat. Untuk rusuk 5 diagonalnya sekitar 8,66.',
      ),
    },
    {
      q: L('How many nets does a cube have?', 'Ada berapa jaring-jaring kubus?'),
      a: L(
        'A cube has exactly 11 different nets. Of the 35 ways to join six squares edge to edge, 24 fail because of a 2 by 2 block, a row of five, or two squares landing on the same face.',
        'Kubus memiliki tepat 11 jaring-jaring yang berbeda. Dari 35 cara menyambung enam persegi sisi ke sisi, 24 gagal karena blok 2 kali 2, baris lima, atau dua persegi yang mendarat di sisi yang sama.',
      ),
    },
    {
      q: L('What happens to the volume of a cube when the edge doubles?', 'Apa yang terjadi pada volume kubus bila rusuk digandakan?'),
      a: L(
        'The volume becomes eight times as large, since 2 cubed is 8, while the surface area becomes four times as large, since 2 squared is 4. In general, scaling the edge by k scales the volume by k cubed.',
        'Volume menjadi delapan kali lipat, karena 2 pangkat tiga adalah 8, sedangkan luas permukaan menjadi empat kali lipat, karena 2 kuadrat adalah 4. Secara umum, mengubah skala rusuk dengan k mengubah skala volume dengan k pangkat tiga.',
      ),
    },
    {
      q: L('What shapes can you get by slicing a cube?', 'Bentuk apa yang bisa diperoleh dengan mengiris kubus?'),
      a: L(
        'A plane can cut a cube in a triangle, a quadrilateral such as a square or rectangle, a pentagon or a hexagon, never more than six sides. A plane through the centre, perpendicular to a space diagonal, gives a regular hexagon.',
        'Sebuah bidang dapat mengiris kubus menjadi segitiga, segiempat seperti persegi atau persegi panjang, segilima, atau segienam, tak pernah lebih dari enam sisi. Bidang melalui pusat, tegak lurus pada diagonal ruang, memberi segienam beraturan.',
      ),
    },
    {
      q: L('Can you double a cube with a compass and straightedge?', 'Bisakah kubus digandakan dengan jangka dan penggaris?'),
      a: L(
        'No. Doubling the volume needs the edge multiplied by the cube root of 2, and Pierre Wantzel proved in 1837 that this length cannot be constructed with a compass and straightedge, since it is a root of an irreducible cubic.',
        'Tidak. Menggandakan volume memerlukan rusuk dikalikan akar pangkat tiga dari 2, dan Pierre Wantzel membuktikan pada 1837 bahwa panjang itu tak dapat dikonstruksi dengan jangka dan penggaris, karena ia akar suatu persamaan kubik yang tak dapat difaktorkan.',
      ),
    },
  ],

  references: [
    { title: 'Polyhedra', author: 'Peter R. Cromwell', year: 1997, source: 'Cambridge University Press' },
    { title: 'Regular Polytopes (3rd ed.)', author: 'H. S. M. Coxeter', year: 1973, source: 'Dover' },
    { title: 'The Thirteen Books of Euclid’s Elements (Book XIII)', author: 'Thomas L. Heath (translator)', year: 1956, source: 'Dover' },
    { title: 'Recherches sur les moyens de reconnaître si un problème de Géométrie peut se résoudre avec la règle et le compas', author: 'Pierre Laurent Wantzel', year: 1837, source: 'Journal de Mathématiques Pures et Appliquées' },
    { title: 'Adventures in Group Theory: Rubik’s Cube, Merlin’s Machine, and Other Mathematical Toys (2nd ed.)', author: 'David Joyner', year: 2008, source: 'Johns Hopkins University Press' },
    { title: 'A History of Mathematics (3rd ed.)', author: 'Carl B. Boyer, Uta C. Merzbach', year: 2011, source: 'Wiley' },
    { title: 'Proofs from THE BOOK (6th ed.)', author: 'Martin Aigner, Günter M. Ziegler', year: 2018, source: 'Springer' },
  ],

  related: ['pythagorean-theorem', 'quadrilaterals', 'binary-numbers', 'algebraic-expressions'],
}
