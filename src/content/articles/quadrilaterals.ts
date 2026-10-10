import type { FigItem } from '../../lib/figure'
import type { Loc } from '../types'
import type { ArticleBlock, ArticleBody } from './types'
import { meta } from './quadrilaterals.meta'

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

/** A quadrilateral ABCD drawn to scale on a plain canvas, with its diagonals dashed on request. */
const quad = (pts: [number, number][], caption: Loc, opts: { diagonals?: boolean; extra?: FigItem[] } = {}): ArticleBlock => {
  const xs = pts.map((p) => p[0])
  const ys = pts.map((p) => p[1])
  const pad = 1.2
  const xSpan: [number, number] = [Math.min(...xs) - pad, Math.max(...xs) + pad]
  const ySpan: [number, number] = [Math.min(...ys) - pad, Math.max(...ys) + pad]
  const aspect = Math.min(3, Math.max(0.5, (xSpan[1] - xSpan[0]) / (ySpan[1] - ySpan[0])))
  const items: FigItem[] = [{ t: 'poly', pts, color: 'a' }]
  if (opts.diagonals) {
    items.push({ t: 'seg', from: pts[0], to: pts[2], color: 'b', dashed: true })
    items.push({ t: 'seg', from: pts[1], to: pts[3], color: 'b', dashed: true })
  }
  items.push(...(opts.extra ?? []))
  pts.forEach((p, i) => items.push({ t: 'point', at: p, label: 'ABCD'[i], color: 'b' }))
  return { kind: 'figure', figure: { dim: 2, axes: false, xSpan, ySpan, aspect, items, caption } }
}

export const body: ArticleBody = {
  answer: L(
    T`**A quadrilateral is a closed shape with four straight sides and four vertices, and its four interior angles always add up to 360°.** The named types are the parallelogram, rectangle, rhombus, square, kite and trapezoid, each defined by which sides are parallel or equal and which angles are right. Perimeter is the sum of the four sides; area comes from a formula for the type, or from the coordinates of the vertices with the shoelace formula.`,
    T`**Segiempat adalah bangun tertutup dengan empat sisi lurus dan empat titik sudut, dan keempat sudut dalamnya selalu berjumlah 360°.** Jenis-jenis yang bernama adalah jajargenjang, persegi panjang, belah ketupat, persegi, layang-layang, dan trapesium, masing-masing ditentukan oleh sisi yang sejajar atau sama panjang dan sudut yang siku-siku. Keliling adalah jumlah keempat sisi; luas diperoleh dari rumus menurut jenisnya, atau dari koordinat titik sudut dengan rumus tali sepatu.`,
  ),

  keyPoints: [
    L(
      T`A quadrilateral has four sides, four vertices and two diagonals, and the angles of any simple quadrilateral add up to $360^\circ$, because a diagonal cuts it into two triangles.`,
      T`Segiempat memiliki empat sisi, empat titik sudut, dan dua diagonal, dan sudut-sudut segiempat sederhana mana pun berjumlah $360^\circ$, karena satu diagonal memotongnya menjadi dua segitiga.`,
    ),
    L(
      T`The types form a family tree: a square is a rectangle and a rhombus; rectangles and rhombuses are parallelograms; a rhombus is also a kite; a trapezoid has exactly one pair of parallel sides.`,
      T`Jenis-jenisnya membentuk pohon keluarga: persegi adalah persegi panjang sekaligus belah ketupat; persegi panjang dan belah ketupat adalah jajargenjang; belah ketupat juga layang-layang; trapesium memiliki tepat satu pasang sisi sejajar.`,
    ),
    L(
      T`A parallelogram has equal and parallel opposite sides and diagonals that bisect each other; a rectangle adds equal diagonals and right angles; a rhombus adds equal sides and perpendicular diagonals.`,
      T`Jajargenjang memiliki sisi berhadapan yang sama dan sejajar serta diagonal yang saling membagi dua; persegi panjang menambahkan diagonal sama panjang dan sudut siku-siku; belah ketupat menambahkan sisi sama panjang dan diagonal tegak lurus.`,
    ),
    L(
      T`Area: rectangle $lw$, parallelogram $bh$, trapezoid $\frac{(a+b)h}{2}$, and $\frac{d_1d_2}{2}$ for a rhombus or kite; the perimeter is always the sum of the four sides.`,
      T`Luas: persegi panjang $lw$, jajargenjang $bh$, trapesium $\frac{(a+b)h}{2}$, dan $\frac{d_1d_2}{2}$ untuk belah ketupat atau layang-layang; keliling selalu jumlah keempat sisi.`,
    ),
    L(
      T`With coordinates, parallel means a zero cross product, perpendicular a zero dot product and equal length equal squared distance; the area is half the absolute shoelace sum.`,
      T`Dengan koordinat, sejajar berarti hasil kali silang nol, tegak lurus berarti hasil kali titik nol, dan sama panjang berarti kuadrat jarak sama; luasnya setengah nilai mutlak jumlah tali sepatu.`,
    ),
    L(
      T`Test shapes with exact integers or fractions, never with floats: $0.7\cdot0.3-0.1\cdot2.1$ is not $0$ in floating point, although it is $0$ in mathematics.`,
      T`Uji bangun dengan bilangan bulat atau pecahan eksak, jangan dengan float: $0{,}7\cdot0{,}3-0{,}1\cdot2{,}1$ bukan $0$ dalam titik mengambang, padahal dalam matematika hasilnya $0$.`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------------ what is it */
    {
      id: 'what-is-a-quadrilateral',
      heading: L('What is a quadrilateral?', 'Apa itu segiempat?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A quadrilateral is a polygon with exactly four sides, four vertices (corners) and four interior angles.** The word comes from the Latin *quattuor* (four) and *latus* (side); *quadrangle* and *tetragon* mean the same, and the Indonesian word is *segiempat*.

We name a quadrilateral by its vertices in order round the shape, such as $ABCD$. Its **sides** are $AB$, $BC$, $CD$ and $DA$. Two sides that share a vertex are **adjacent**; $AB$ and $CD$ are **opposite**, and so are $BC$ and $DA$. A **diagonal** joins two opposite vertices: $AC$ and $BD$.

Quadrilaterals come in three kinds of outline:

- **Convex.** Every interior angle is less than $180^\circ$ and both diagonals lie inside the shape.
- **Concave.** One interior angle is more than $180^\circ$ and one diagonal lies outside. The concave kite in the second picture is called a *dart* or *arrowhead*.
- **Crossed.** Two opposite sides cross each other, giving a bow-tie. A crossed quadrilateral is not a simple polygon, so it has no single inside, no area in the usual sense, and the rules in this article do not apply to it.

Unless it says otherwise, "quadrilateral" below means a simple one: its sides meet only at the vertices.`,
            T`**Segiempat adalah poligon dengan tepat empat sisi, empat titik sudut, dan empat sudut dalam.** Kata Inggrisnya berasal dari bahasa Latin *quattuor* (empat) dan *latus* (sisi); *quadrangle* dan *tetragon* artinya sama.

Segiempat diberi nama dari titik sudutnya secara berurutan mengelilingi bangun, misalnya $ABCD$. **Sisi**-nya adalah $AB$, $BC$, $CD$, dan $DA$. Dua sisi yang berbagi satu titik sudut **berdekatan**; $AB$ dan $CD$ **berhadapan**, begitu juga $BC$ dan $DA$. **Diagonal** menghubungkan dua titik sudut yang berhadapan: $AC$ dan $BD$.

Ada tiga macam bentuk segiempat:

- **Cembung.** Setiap sudut dalam kurang dari $180^\circ$ dan kedua diagonal berada di dalam bangun.
- **Cekung.** Satu sudut dalam lebih dari $180^\circ$ dan satu diagonal berada di luar. Layang-layang cekung pada gambar kedua disebut *dart* atau *kepala panah*.
- **Bersilang.** Dua sisi berhadapan saling memotong sehingga berbentuk pita. Segiempat bersilang bukan poligon sederhana, sehingga tidak punya satu bagian dalam, tidak punya luas dalam arti biasa, dan aturan dalam artikel ini tidak berlaku untuknya.

Kecuali disebutkan lain, "segiempat" di bawah berarti segiempat sederhana: sisi-sisinya hanya bertemu di titik sudut.`,
          ),
        },
        quad(
          [[0, 0], [6, 1], [5, 5], [1, 4]],
          L(
            'A convex quadrilateral ABCD. The dashed lines are its two diagonals, AC and BD; both lie inside.',
            'Segiempat cembung ABCD. Garis putus-putus adalah kedua diagonalnya, AC dan BD; keduanya berada di dalam.',
          ),
          { diagonals: true },
        ),
        quad(
          [[0, 0], [4, 2], [0, 4], [1, 2]],
          L(
            'A concave quadrilateral (a dart): the angle at D is more than 180°, and the diagonal AC lies outside the shape.',
            'Segiempat cekung (dart): sudut di D lebih dari 180°, dan diagonal AC berada di luar bangun.',
          ),
          { diagonals: true },
        ),
      ],
    },

    /* ------------------------------------------------------------ angle sum */
    {
      id: 'angle-sum',
      heading: L('Why do the angles of a quadrilateral add up to 360°?', 'Mengapa sudut-sudut segiempat berjumlah 360°?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The interior angles of every simple quadrilateral add up to $360^\circ$, because one diagonal that lies inside it splits it into two triangles and each triangle has angle sum $180^\circ$.**

Draw the diagonal $AC$ of a convex $ABCD$. The angle at $A$ is split between the triangles $ABC$ and $ACD$, and so is the angle at $C$, while $B$ belongs to the first triangle and $D$ to the second. The four angles of the quadrilateral are therefore exactly the six angles of the two triangles, regrouped:

$$\angle A+\angle B+\angle C+\angle D=180^\circ+180^\circ=360^\circ.$$

The same holds for a concave quadrilateral: use the diagonal that lies inside, and count the reflex angle (more than $180^\circ$) as it is. In the dart of the first section the angles are about $37^\circ$, $53^\circ$, $37^\circ$ and $233^\circ$, and $37+53+37+233=360$. A polygon with $n$ sides has angle sum $(n-2)\cdot180^\circ$: a pentagon has $540^\circ$.

This one fact solves many problems. If three angles are $70^\circ$, $95^\circ$ and $120^\circ$ the fourth is $360-285=75^\circ$. If the angles are in the ratio $1:2:3:4$, call them $x,2x,3x,4x$ as in [turning words into algebra](article:algebraic-expressions#words-to-algebra): then $10x=360$, so $x=36^\circ$ and the angles are $36^\circ,72^\circ,108^\circ,144^\circ$.`,
            T`**Sudut dalam setiap segiempat sederhana berjumlah $360^\circ$, karena satu diagonal yang berada di dalamnya membaginya menjadi dua segitiga dan tiap segitiga memiliki jumlah sudut $180^\circ$.**

Gambar diagonal $AC$ pada $ABCD$ yang cembung. Sudut di $A$ terbagi di antara segitiga $ABC$ dan $ACD$, begitu pula sudut di $C$, sedangkan $B$ milik segitiga pertama dan $D$ milik segitiga kedua. Keempat sudut segiempat itu dengan demikian tepat enam sudut dari kedua segitiga, yang dikelompokkan ulang:

$$\angle A+\angle B+\angle C+\angle D=180^\circ+180^\circ=360^\circ.$$

Hal yang sama berlaku untuk segiempat cekung: pakai diagonal yang berada di dalam, dan hitung sudut refleks (lebih dari $180^\circ$) apa adanya. Pada dart di bagian pertama sudut-sudutnya sekitar $37^\circ$, $53^\circ$, $37^\circ$, dan $233^\circ$, dan $37+53+37+233=360$. Poligon dengan $n$ sisi memiliki jumlah sudut $(n-2)\cdot180^\circ$: segilima memiliki $540^\circ$.

Satu fakta ini menyelesaikan banyak soal. Jika tiga sudut adalah $70^\circ$, $95^\circ$, dan $120^\circ$, sudut keempat adalah $360-285=75^\circ$. Jika sudut-sudutnya berperbandingan $1:2:3:4$, namai $x,2x,3x,4x$ seperti pada [mengubah kata menjadi aljabar](article:algebraic-expressions#words-to-algebra): maka $10x=360$, sehingga $x=36^\circ$ dan sudut-sudutnya $36^\circ,72^\circ,108^\circ,144^\circ$.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: the missing angle', 'Coba: sudut yang hilang'),
          step: {
            kind: 'math',
            id: 'a1',
            hints: [L('The four angles add up to $360^\\circ$.', 'Keempat sudut berjumlah $360^\\circ$.'), L('$70+95+120=285$.', '$70+95+120=285$.')],
            explain: L('$360-285=75$.', '$360-285=75$.'),
            prompt: L('A quadrilateral has angles $70^\\circ$, $95^\\circ$ and $120^\\circ$. How many degrees is the fourth angle?', 'Sebuah segiempat memiliki sudut $70^\\circ$, $95^\\circ$, dan $120^\\circ$. Berapa derajat sudut keempatnya?'),
            given: String.raw`360-(70+95+120)=v`,
            blanks: [{ label: 'v =', answer: 75 }],
          },
        },
      ],
    },

    /* ----------------------------------------------------------------- types */
    {
      id: 'types',
      heading: L('What are the types of quadrilaterals?', 'Apa saja jenis-jenis segiempat?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The named quadrilaterals are the parallelogram, rectangle, rhombus, square, kite and trapezoid, and they form a family tree in which every special type keeps all the properties of the more general ones.**

| Type | Defining property |
|---|---|
| Parallelogram | both pairs of opposite sides are parallel |
| Rectangle | four right angles |
| Rhombus | four equal sides |
| Square | four equal sides and four right angles |
| Kite | two pairs of equal adjacent sides |
| Trapezoid | exactly one pair of parallel sides |
| Isosceles trapezoid | a trapezoid whose two non-parallel sides (legs) are equal |

Read the table as a hierarchy, from the general to the special:

- A **square** is a rectangle (right angles), a rhombus (equal sides), a parallelogram and a kite, all at once.
- Every **rectangle** and every **rhombus** is a parallelogram, because their opposite sides are parallel.
- Every **rhombus** is a kite, since all four sides are equal and so the adjacent ones are equal in pairs.
- A **rectangle that is not a square**, a **parallelogram that is not a rectangle** and a **kite that is not a rhombus** are the genuinely different cases.
- A **trapezoid** is its own branch: with one pair of parallel sides it can never be a parallelogram.

So "is a square a rectangle?" has the answer *yes*: a rectangle is any quadrilateral with four right angles, and a square has them. The everyday habit of treating the names as separate boxes is exactly what the next section's table corrects.`,
            T`**Segiempat yang bernama adalah jajargenjang, persegi panjang, belah ketupat, persegi, layang-layang, dan trapesium, dan semuanya membentuk pohon keluarga di mana setiap jenis khusus mempertahankan semua sifat jenis yang lebih umum.**

| Jenis | Sifat penentu |
|---|---|
| Jajargenjang | kedua pasang sisi berhadapan sejajar |
| Persegi panjang | empat sudut siku-siku |
| Belah ketupat | empat sisi sama panjang |
| Persegi | empat sisi sama panjang dan empat sudut siku-siku |
| Layang-layang | dua pasang sisi berdekatan yang sama panjang |
| Trapesium | tepat satu pasang sisi sejajar |
| Trapesium sama kaki | trapesium yang kedua sisi tak sejajarnya (kaki) sama panjang |

Baca tabel itu sebagai hierarki, dari yang umum ke yang khusus:

- **Persegi** adalah persegi panjang (sudut siku-siku), belah ketupat (sisi sama panjang), jajargenjang, dan layang-layang, sekaligus.
- Setiap **persegi panjang** dan setiap **belah ketupat** adalah jajargenjang, karena sisi berhadapannya sejajar.
- Setiap **belah ketupat** adalah layang-layang, sebab keempat sisinya sama panjang sehingga sisi berdekatannya sama panjang berpasangan.
- **Persegi panjang yang bukan persegi**, **jajargenjang yang bukan persegi panjang**, dan **layang-layang yang bukan belah ketupat** adalah kasus yang benar-benar berbeda.
- **Trapesium** adalah cabang tersendiri: dengan satu pasang sisi sejajar, ia tidak pernah menjadi jajargenjang.

Jadi "apakah persegi itu persegi panjang?" dijawab *ya*: persegi panjang adalah segiempat mana pun dengan empat sudut siku-siku, dan persegi memilikinya. Kebiasaan menganggap nama-nama itu kotak yang terpisah inilah yang dikoreksi oleh tabel di bagian berikutnya.`,
          ),
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: L('Two names depend on the book', 'Dua nama bergantung pada bukunya'),
          text: L(
            T`**Trapezoid and kite are defined slightly differently in different books, and this article uses the exclusive school definition.** Here a trapezoid has *exactly* one pair of parallel sides, so a parallelogram is not a trapezoid; many university texts say *at least* one pair, which makes every parallelogram a trapezoid. Both are fine if you say which you use. The name also differs by country: what American English calls a trapezoid is a *trapezium* in British English and *trapesium* in Indonesian. Likewise a kite here may have two or four equal-side pairs, so a rhombus counts as a kite; some books require the two pairs to be different.`,
            T`**Trapesium dan layang-layang didefinisikan sedikit berbeda di buku yang berbeda, dan artikel ini memakai definisi eksklusif ala sekolah.** Di sini trapesium memiliki *tepat* satu pasang sisi sejajar, sehingga jajargenjang bukan trapesium; banyak buku perguruan tinggi menulis *paling sedikit* satu pasang, yang membuat setiap jajargenjang menjadi trapesium. Keduanya sah asalkan kamu menyebut yang kamu pakai. Namanya juga berbeda menurut negara: yang disebut *trapezoid* dalam bahasa Inggris Amerika adalah *trapezium* dalam bahasa Inggris Britania dan *trapesium* dalam bahasa Indonesia. Demikian pula layang-layang di sini boleh memiliki dua atau empat sisi berpasangan sama panjang, sehingga belah ketupat tergolong layang-layang; sebagian buku mengharuskan kedua pasangan itu berbeda.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------ properties */
    {
      id: 'properties',
      heading: L('What are the properties of each quadrilateral?', 'Apa saja sifat tiap segiempat?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Each type is told apart by its sides, its angles, its diagonals and its symmetry, and the table gives all of them for a typical example of each type.** A special case can have more: a particular parallelogram may happen to be a rectangle.

| Property | Parallelogram | Rectangle | Rhombus | Square | Kite | Isosceles trapezoid |
|---|---|---|---|---|---|---|
| Pairs of parallel sides | 2 | 2 | 2 | 2 | 0 | 1 |
| Opposite sides equal | yes | yes | yes | yes | no | no |
| All four sides equal | no | no | yes | yes | no | no |
| Right angles | 0 | 4 | 0 | 4 | 0 | 0 |
| Opposite angles equal | yes | yes | yes | yes | one pair | no |
| Diagonals equal | no | yes | no | yes | no | yes |
| Diagonals perpendicular | no | no | yes | yes | yes | no |
| Diagonals bisect each other | yes | yes | yes | yes | no | no |
| Lines of symmetry | 0 | 2 | 2 | 4 | 1 | 1 |
| Order of rotational symmetry | 2 | 2 | 2 | 4 | 1 | 1 |

Some of these have a neat reason. A diagonal of a parallelogram cuts it into two congruent triangles, which is why opposite sides are equal, opposite angles are equal and the diagonals bisect each other. The angles next to one side of a parallelogram add up to $180^\circ$, since they sit between parallel lines. In a kite the diagonal along the axis of symmetry cuts the other diagonal in half at a right angle, which is why the area is half the product of the diagonals. An isosceles trapezoid has equal base angles in each pair, so it has one line of symmetry, through the midpoints of its two bases. Try each type below and read its checklist.`,
            T`**Tiap jenis dibedakan oleh sisi, sudut, diagonal, dan simetrinya, dan tabel memuat semuanya untuk contoh khas tiap jenis.** Kasus khusus bisa memiliki lebih banyak: sebuah jajargenjang tertentu mungkin kebetulan persegi panjang.

| Sifat | Jajargenjang | Persegi panjang | Belah ketupat | Persegi | Layang-layang | Trapesium sama kaki |
|---|---|---|---|---|---|---|
| Pasang sisi sejajar | 2 | 2 | 2 | 2 | 0 | 1 |
| Sisi berhadapan sama panjang | ya | ya | ya | ya | tidak | tidak |
| Keempat sisi sama panjang | tidak | tidak | ya | ya | tidak | tidak |
| Sudut siku-siku | 0 | 4 | 0 | 4 | 0 | 0 |
| Sudut berhadapan sama besar | ya | ya | ya | ya | satu pasang | tidak |
| Diagonal sama panjang | tidak | ya | tidak | ya | tidak | ya |
| Diagonal tegak lurus | tidak | tidak | ya | ya | ya | tidak |
| Diagonal saling membagi dua | ya | ya | ya | ya | tidak | tidak |
| Sumbu simetri | 0 | 2 | 2 | 4 | 1 | 1 |
| Orde simetri putar | 2 | 2 | 2 | 4 | 1 | 1 |

Beberapa di antaranya punya alasan yang rapi. Satu diagonal jajargenjang memotongnya menjadi dua segitiga yang kongruen, itulah sebabnya sisi berhadapan sama panjang, sudut berhadapan sama besar, dan diagonal saling membagi dua. Sudut-sudut yang berdekatan pada satu sisi jajargenjang berjumlah $180^\circ$, karena berada di antara dua garis sejajar. Pada layang-layang diagonal sepanjang sumbu simetri membagi dua diagonal lainnya secara tegak lurus, itulah sebabnya luasnya setengah hasil kali diagonal. Trapesium sama kaki memiliki sudut alas yang sama pada tiap pasang, sehingga ia punya satu sumbu simetri, melalui titik tengah kedua alasnya. Coba tiap jenis di bawah dan baca daftar sifatnya.`,
          ),
        },
        { kind: 'widget', name: 'quadprops' },
        {
          kind: 'text',
          text: L(
            T`**The diagonals of a rectangle with sides $l$ and $w$ are equal and have length $\sqrt{l^2+w^2}$, by the Pythagorean theorem.** For a $6\times4$ rectangle that is $\sqrt{52}=2\sqrt{13}\approx7.21$, after you [simplify the radical](article:exponents-and-radicals#simplify-radicals). For a square with side $s$ the diagonal is $s\sqrt2$, and because $\sqrt2$ is [irrational](article:irrational-numbers#why-sqrt2-is-irrational), no square with whole-number sides has a whole-number diagonal.

For a rhombus the diagonals cross at right angles and halve each other, so each side is the hypotenuse of a right triangle whose legs are half of each diagonal. With diagonals $10$ and $24$ the legs are $5$ and $12$, the side is $\sqrt{25+144}=13$, and the perimeter is $4\cdot13=52$.`,
            T`**Diagonal persegi panjang dengan sisi $l$ dan $w$ sama panjang dan panjangnya $\sqrt{l^2+w^2}$, menurut teorema Pythagoras.** Untuk persegi panjang $6\times4$ itu $\sqrt{52}=2\sqrt{13}\approx7{,}21$, setelah kamu [menyederhanakan bentuk akar](article:exponents-and-radicals#simplify-radicals). Untuk persegi dengan sisi $s$ diagonalnya $s\sqrt2$, dan karena $\sqrt2$ [irasional](article:irrational-numbers#why-sqrt2-is-irrational), tidak ada persegi bersisi bilangan bulat yang diagonalnya bilangan bulat.

Pada belah ketupat kedua diagonal berpotongan tegak lurus dan saling membagi dua, sehingga tiap sisi adalah sisi miring segitiga siku-siku yang kakinya setengah dari tiap diagonal. Dengan diagonal $10$ dan $24$ kakinya $5$ dan $12$, sisinya $\sqrt{25+144}=13$, dan kelilingnya $4\cdot13=52$.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------ perimeter and area */
    {
      id: 'perimeter-and-area',
      heading: L('How do you find the perimeter and area of a quadrilateral?', 'Bagaimana mencari keliling dan luas segiempat?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The perimeter is the sum of the four sides, and the area comes from a formula for the type: base times height for a parallelogram, half the product of the diagonals for a rhombus or kite, and half the sum of the parallel sides times the height for a trapezoid.**

| Type | Perimeter | Area |
|---|---|---|
| Square (side $s$) | $4s$ | $s^2$ |
| Rectangle (length $l$, width $w$) | $2(l+w)$ | $lw$ |
| Parallelogram (sides $a,b$, base $b$, height $h$) | $2(a+b)$ | $bh$ |
| Rhombus (side $s$, diagonals $d_1,d_2$) | $4s$ | $\frac{d_1d_2}{2}$ |
| Kite (sides $a,b$, diagonals $d_1,d_2$) | $2(a+b)$ | $\frac{d_1d_2}{2}$ |
| Trapezoid (parallel sides $a,b$, legs $c,d$, height $h$) | $a+b+c+d$ | $\frac{(a+b)h}{2}$ |

The height is the perpendicular distance between the parallel sides, never the slanted side. Perimeter is a length, in meters; area is a count of unit squares, in square meters.

Each formula is the rectangle in disguise:

- **Parallelogram.** Cut a right triangle off one slanted end and slide it to the other end: you get a rectangle with the same base and height, so the area is $bh$.
- **Trapezoid.** Two copies, one turned upside down, fit together into a parallelogram with base $a+b$ and height $h$. The trapezoid is half of it, so its area is $\frac{(a+b)h}{2}$.
- **Rhombus and kite.** The diagonals are perpendicular, so the rectangle $d_1\times d_2$ drawn round the shape has exactly twice its area: the area is $\frac12d_1d_2$. The same holds for every convex quadrilateral whose diagonals are perpendicular.

For the trapezoid in the picture, $a=8$, $b=4$ and $h=4$ give $\frac{(8+4)\cdot4}{2}=24$. The $\frac12$ in these formulas is the usual [multiplication of fractions](article:rational-numbers#multiply-divide-fractions): half of $48$ is $24$.

A word problem: a plot of land is a trapezoid whose parallel sides are $30$ m and $20$ m, $12$ m apart, and land costs 80 dollars per square meter. The area is $\frac{(30+20)\cdot12}{2}=300$ m², so the plot costs $300\cdot80=24000$ dollars.`,
            T`**Keliling adalah jumlah keempat sisi, dan luas diperoleh dari rumus menurut jenisnya: alas kali tinggi untuk jajargenjang, setengah hasil kali diagonal untuk belah ketupat atau layang-layang, dan setengah jumlah sisi sejajar kali tinggi untuk trapesium.**

| Jenis | Keliling | Luas |
|---|---|---|
| Persegi (sisi $s$) | $4s$ | $s^2$ |
| Persegi panjang (panjang $l$, lebar $w$) | $2(l+w)$ | $lw$ |
| Jajargenjang (sisi $a,b$, alas $b$, tinggi $h$) | $2(a+b)$ | $bh$ |
| Belah ketupat (sisi $s$, diagonal $d_1,d_2$) | $4s$ | $\frac{d_1d_2}{2}$ |
| Layang-layang (sisi $a,b$, diagonal $d_1,d_2$) | $2(a+b)$ | $\frac{d_1d_2}{2}$ |
| Trapesium (sisi sejajar $a,b$, kaki $c,d$, tinggi $h$) | $a+b+c+d$ | $\frac{(a+b)h}{2}$ |

Tinggi adalah jarak tegak lurus antara sisi-sisi sejajar, bukan sisi yang miring. Keliling adalah panjang, dalam meter; luas adalah banyaknya persegi satuan, dalam meter persegi.

Setiap rumus adalah persegi panjang yang menyamar:

- **Jajargenjang.** Potong segitiga siku-siku dari satu ujung yang miring dan geser ke ujung lainnya: kamu mendapat persegi panjang dengan alas dan tinggi yang sama, sehingga luasnya $bh$.
- **Trapesium.** Dua salinan, satu dibalik, bergabung menjadi jajargenjang dengan alas $a+b$ dan tinggi $h$. Trapesium adalah setengahnya, sehingga luasnya $\frac{(a+b)h}{2}$.
- **Belah ketupat dan layang-layang.** Diagonalnya tegak lurus, sehingga persegi panjang $d_1\times d_2$ yang mengelilingi bangun itu luasnya tepat dua kali luas bangun: luasnya $\frac12d_1d_2$. Hal yang sama berlaku untuk setiap segiempat cembung yang diagonalnya tegak lurus.

Untuk trapesium pada gambar, $a=8$, $b=4$, dan $h=4$ memberi $\frac{(8+4)\cdot4}{2}=24$. Tanda $\frac12$ dalam rumus-rumus ini adalah [perkalian pecahan](article:rational-numbers#multiply-divide-fractions) biasa: setengah dari $48$ adalah $24$.

Soal cerita: sebidang tanah berbentuk trapesium dengan sisi sejajar $30$ m dan $20$ m, berjarak $12$ m, dan harga tanah Rp500.000 per meter persegi. Luasnya $\frac{(30+20)\cdot12}{2}=300$ m², sehingga harga tanahnya 300 kali Rp500.000, yaitu Rp150.000.000.`,
          ),
        },
        quad(
          [[0, 0], [8, 0], [6, 4], [2, 4]],
          L(
            'A trapezoid with parallel sides AB = 8 and CD = 4. The dashed line is the height h = 4, drawn perpendicular to both.',
            'Trapesium dengan sisi sejajar AB = 8 dan CD = 4. Garis putus-putus adalah tinggi h = 4, ditarik tegak lurus pada keduanya.',
          ),
          { extra: [{ t: 'seg', from: [2, 4], to: [2, 0], color: 'c', dashed: true, label: 'h' }] },
        ),
      ],
    },

    /* ------------------------------------------------------------ coordinates */
    {
      id: 'coordinates',
      heading: L('How do you classify a quadrilateral and find its area from coordinates?', 'Bagaimana menentukan jenis dan luas segiempat dari koordinat?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Place the vertices on a grid and use three exact tests: a zero cross product means parallel, a zero dot product means perpendicular, and equal squared distances mean equal lengths; the area is half the absolute shoelace sum.**

For the side from $P=(x_1,y_1)$ to $Q=(x_2,y_2)$ write the vector $\vec{PQ}=(u,v)=(x_2-x_1,\,y_2-y_1)$. For two vectors $(u_1,v_1)$ and $(u_2,v_2)$:

- they are **parallel** exactly when $u_1v_2-v_1u_2=0$ (the cross product);
- they are **perpendicular** exactly when $u_1u_2+v_1v_2=0$ (the dot product);
- a side has **length** $\sqrt{u^2+v^2}$, so two sides are equal exactly when $u^2+v^2$ agrees; no square root is needed.

These tests use only multiplication and addition, so on integer or fraction coordinates they are exact, and they cope with vertical sides, where a slope would divide by zero.

Take $A(0,0)$, $B(6,0)$, $C(8,4)$, $D(2,4)$. The sides are $\vec{AB}=(6,0)$, $\vec{BC}=(2,4)$, $\vec{CD}=(-6,0)$, $\vec{DA}=(-2,-4)$. The cross products $6\cdot0-0\cdot(-6)$ and $2\cdot(-4)-4\cdot(-2)$ are both $0$, so both pairs of opposite sides are parallel: a parallelogram. The squared sides are $36$ and $20$, so it is not a rhombus, and $\vec{AB}\cdot\vec{BC}=12\ne0$, so it is not a rectangle.

For the area use the **shoelace formula** (Gauss's area formula, also called the surveyor's formula). List the vertices in order and add $x_iy_{i+1}-x_{i+1}y_i$ over the four edges, going back to the first vertex at the end:

$$\text{area}=\tfrac12\left|\sum_{i}\bigl(x_iy_{i+1}-x_{i+1}y_i\bigr)\right|.$$

For the parallelogram above the four terms are $0,\,24,\,24,\,0$, the sum is $48$ and the area is $24=6\cdot4$, base times height, as it must be. For $A(0,0)$, $B(6,0)$, $C(6,4)$, $D(2,6)$ the terms are $0,24,28,0$, so the area is $26$; check by splitting into triangles $ABC$ ($12$) and $ACD$ ($14$).

The sign of the sum tells the direction: positive for counterclockwise vertices, negative for clockwise, which is why we take the absolute value. The order matters. A bow-tie such as $(0,0),(4,4),(4,0),(0,4)$ gives a sum of exactly $0$, because its two lobes cancel: the formula is only an area for a simple polygon.`,
            T`**Letakkan titik sudut pada kisi dan pakai tiga uji eksak: hasil kali silang nol berarti sejajar, hasil kali titik nol berarti tegak lurus, dan kuadrat jarak yang sama berarti panjang yang sama; luasnya setengah nilai mutlak jumlah tali sepatu.**

Untuk sisi dari $P=(x_1,y_1)$ ke $Q=(x_2,y_2)$ tulis vektor $\vec{PQ}=(u,v)=(x_2-x_1,\,y_2-y_1)$. Untuk dua vektor $(u_1,v_1)$ dan $(u_2,v_2)$:

- keduanya **sejajar** tepat bila $u_1v_2-v_1u_2=0$ (hasil kali silang);
- keduanya **tegak lurus** tepat bila $u_1u_2+v_1v_2=0$ (hasil kali titik);
- sebuah sisi memiliki **panjang** $\sqrt{u^2+v^2}$, sehingga dua sisi sama panjang tepat bila $u^2+v^2$ sama; tidak perlu akar.

Uji-uji ini hanya memakai perkalian dan penjumlahan, sehingga pada koordinat bilangan bulat atau pecahan hasilnya eksak, dan sisi tegak pun tertangani, padahal gradien akan membagi dengan nol.

Ambil $A(0,0)$, $B(6,0)$, $C(8,4)$, $D(2,4)$. Sisi-sisinya $\vec{AB}=(6,0)$, $\vec{BC}=(2,4)$, $\vec{CD}=(-6,0)$, $\vec{DA}=(-2,-4)$. Hasil kali silang $6\cdot0-0\cdot(-6)$ dan $2\cdot(-4)-4\cdot(-2)$ keduanya $0$, sehingga kedua pasang sisi berhadapan sejajar: jajargenjang. Kuadrat sisinya $36$ dan $20$, sehingga bukan belah ketupat, dan $\vec{AB}\cdot\vec{BC}=12\ne0$, sehingga bukan persegi panjang.

Untuk luas pakai **rumus tali sepatu** (rumus luas Gauss, disebut juga rumus juru ukur). Daftar titik sudut berurutan dan jumlahkan $x_iy_{i+1}-x_{i+1}y_i$ pada keempat sisi, dengan kembali ke titik pertama di akhir:

$$\text{luas}=\tfrac12\left|\sum_{i}\bigl(x_iy_{i+1}-x_{i+1}y_i\bigr)\right|.$$

Untuk jajargenjang di atas keempat sukunya $0,\,24,\,24,\,0$, jumlahnya $48$, dan luasnya $24=6\cdot4$, alas kali tinggi, sebagaimana mestinya. Untuk $A(0,0)$, $B(6,0)$, $C(6,4)$, $D(2,6)$ sukunya $0,24,28,0$, sehingga luasnya $26$; periksa dengan membagi menjadi segitiga $ABC$ ($12$) dan $ACD$ ($14$).

Tanda jumlahnya menunjukkan arah: positif untuk titik sudut berlawanan arah jarum jam, negatif untuk searah jarum jam, itulah sebabnya kita ambil nilai mutlak. Urutannya penting. Pita seperti $(0,0),(4,4),(4,0),(0,4)$ memberi jumlah tepat $0$, karena kedua kelopaknya saling meniadakan: rumus ini hanya merupakan luas untuk poligon sederhana.`,
          ),
        },
        { kind: 'widget', name: 'quadclassify' },
        { kind: 'widget', name: 'quadarea' },
      ],
    },

    /* --------------------------------------------------------------- in code */
    {
      id: 'quadrilaterals-in-code',
      heading: L('How do you classify a quadrilateral in code?', 'Bagaimana mengklasifikasikan segiempat dalam kode?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Write the three tests as small functions on integer or ´Fraction´ coordinates, and the classifier is a few comparisons.** The code assumes ´a, b, c, d´ are the vertices in order round a simple convex quadrilateral.`,
            T`**Tulis ketiga uji itu sebagai fungsi kecil pada koordinat bilangan bulat atau ´Fraction´, dan pengklasifikasinya hanya beberapa perbandingan.** Kode ini mengandaikan ´a, b, c, d´ adalah titik sudut berurutan pada segiempat cembung sederhana.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python', 'Python'),
          code: `from fractions import Fraction as F

def sub(p, q): return (p[0] - q[0], p[1] - q[1])
def cross(u, v): return u[0] * v[1] - u[1] * v[0]
def dot(u, v): return u[0] * v[0] + u[1] * v[1]
def d2(p, q): return dot(sub(p, q), sub(p, q))     # squared length

def kind(a, b, c, d):
    ab, bc, cd, da = sub(b, a), sub(c, b), sub(d, c), sub(a, d)
    p1, p2 = cross(ab, cd) == 0, cross(bc, da) == 0   # AB || CD, BC || DA
    s = [d2(a, b), d2(b, c), d2(c, d), d2(d, a)]
    if p1 and p2:
        rhombus, right = len(set(s)) == 1, dot(ab, bc) == 0
        if rhombus and right: return "square"
        if right: return "rectangle"
        return "rhombus" if rhombus else "parallelogram"
    if p1 or p2: return "trapezoid"
    if (s[0] == s[1] and s[2] == s[3]) or (s[0] == s[3] and s[1] == s[2]): return "kite"
    return "none of these"

def area(*pts):
    s = sum(p[0] * q[1] - q[0] * p[1] for p, q in zip(pts, pts[1:] + pts[:1]))
    return F(abs(s), 2)

>>> kind((0, 0), (6, 0), (8, 4), (2, 4))
'parallelogram'
>>> kind((4, 0), (8, 3), (4, 6), (0, 3))
'rhombus'
>>> kind((0, 0), (3, 2), (0, 6), (-3, 2))
'kite'
>>> area((0, 0), (6, 0), (6, 4), (2, 6))
Fraction(26, 1)
>>> area((F(1, 2), 0), (4, 0), (4, F(7, 3)), (0, 2))     # fractions stay exact
Fraction(49, 6)
>>> 0.7 * 0.3 - 0.1 * 2.1                                 # should be 0 ...
-2.7755575615628914e-17
>>> F(7, 10) * F(3, 10) - F(1, 10) * F(21, 10)            # ... and with fractions it is
Fraction(0, 1)`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript', 'JavaScript'),
          code: `const cross = (u, v) => u[0] * v[1] - u[1] * v[0]
cross([6, 0], [-6, 0])                    // 0: parallel (exact for small integers)
cross([0.7, 0.1], [2.1, 0.3])             // -2.7755575615628914e-17, not 0
Math.abs(cross([0.7, 0.1], [2.1, 0.3])) < 1e-9   // true: with floats, compare with a tolerance

const shoelace = (pts) =>
  Math.abs(pts.reduce((s, [x, y], i) => { const [u, v] = pts[(i + 1) % pts.length]; return s + x * v - u * y }, 0)) / 2
shoelace([[0, 0], [6, 0], [6, 4], [2, 6]])   // 26`,
        },
        {
          kind: 'text',
          text: L(
            T`The pitfalls, in order of how often they bite:

| Pitfall | What happens | What to do |
|---|---|---|
| Testing parallel with floats | ´0.7 * 0.3 - 0.1 * 2.1 == 0´ is false | use integers or ´Fraction´, as in the article on [fractions in code](article:rational-numbers#fractions-in-code); or compare with a tolerance |
| Using a slope | a vertical side divides by 0 | use the cross product |
| Vertices out of order | ´a, c, b, d´ describes a bow-tie, and the area comes out wrong | order the vertices round the shape first |
| Forgetting ´abs´ in the shoelace sum | a clockwise polygon has negative area | take the absolute value |
| Comparing sides with ´sqrt´ | rounding makes equal sides unequal | compare the squared lengths |
| Degenerate input | three collinear points make a triangle, not a quadrilateral | check that no three consecutive cross products are 0 |
| A concave shape | the classifier above would call a dart a kite | check that all four turns point the same way first |`,
            T`Jebakannya, berdasarkan seberapa sering terjadi:

| Jebakan | Yang terjadi | Yang sebaiknya dilakukan |
|---|---|---|
| Menguji sejajar dengan float | ´0.7 * 0.3 - 0.1 * 2.1 == 0´ bernilai salah | pakai bilangan bulat atau ´Fraction´, seperti pada artikel [pecahan dalam kode](article:rational-numbers#fractions-in-code); atau bandingkan dengan toleransi |
| Memakai gradien | sisi tegak membagi dengan 0 | pakai hasil kali silang |
| Titik sudut tidak berurutan | ´a, c, b, d´ menggambarkan pita, dan luasnya salah | urutkan titik sudut mengelilingi bangun lebih dulu |
| Lupa ´abs´ pada jumlah tali sepatu | poligon searah jarum jam berluas negatif | ambil nilai mutlak |
| Membandingkan sisi dengan ´sqrt´ | pembulatan membuat sisi yang sama jadi tak sama | bandingkan kuadrat panjangnya |
| Masukan yang runtuh | tiga titik segaris membentuk segitiga, bukan segiempat | periksa bahwa tidak ada tiga hasil kali silang berurutan yang 0 |
| Bangun cekung | pengklasifikasi di atas menyebut dart sebagai layang-layang | periksa dulu bahwa keempat belokan searah |`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where do the quadrilaterals come from?', 'Dari mana asal segiempat?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Quadrilaterals are among the oldest shapes in mathematics, because fields, walls and tiles are four-sided, and the names we use come mostly from Greek.**

- **c. 1550 BCE.** The Rhind Papyrus, problem 52, finds the area of a trapezoid, which the Egyptian scribe describes as a triangle with its tip cut off.
- **c. 300 BCE.** Euclid's *Elements*, Book I, definition 22, names the square, the oblong (our rectangle), the rhombus and the rhomboid (our parallelogram), and calls every other quadrilateral a *trapezium*. Proposition I.34 proves that the opposite sides and angles of a parallelogram are equal and that a diagonal bisects it. Later Greek writers narrowed *trapezium* to a quadrilateral with a pair of parallel sides.
- **c. 150 CE.** Ptolemy's theorem: in a quadrilateral whose vertices lie on a circle, the product of the diagonals equals the sum of the products of the opposite sides.
- **628 CE.** Brahmagupta gives the area of a quadrilateral inscribed in a circle, $\sqrt{(s-a)(s-b)(s-c)(s-d)}$, where $s$ is half the perimeter. It generalizes Heron's formula for a triangle.
- **1769.** Albrecht Meister describes the shoelace formula for the area of a polygon from its coordinates; it is now also known by Gauss's name, and as the surveyor's formula.

The names themselves drifted. Over time British English kept *trapezium* for a quadrilateral with one pair of parallel sides, while American English moved to *trapezoid*, which is why one shape has two names today.`,
            T`**Segiempat termasuk bangun tertua dalam matematika, karena ladang, dinding, dan ubin berbentuk bersisi empat, dan nama-nama yang kita pakai sebagian besar berasal dari bahasa Yunani.**

- **Sekitar 1550 SM.** Papirus Rhind, soal 52, mencari luas trapesium, yang digambarkan juru tulis Mesir sebagai segitiga yang ujungnya dipotong.
- **Sekitar 300 SM.** *Elements* Euclid, Buku I, definisi 22, menamai persegi, *oblong* (persegi panjang kita), belah ketupat, dan *rhomboid* (jajargenjang kita), dan menyebut segiempat lainnya *trapezium*. Proposisi I.34 membuktikan bahwa sisi dan sudut berhadapan jajargenjang sama dan bahwa diagonal membaginya menjadi dua bagian sama. Penulis Yunani kemudian mempersempit *trapezium* menjadi segiempat dengan sepasang sisi sejajar.
- **Sekitar 150 M.** Teorema Ptolemaios: pada segiempat yang titik sudutnya terletak pada sebuah lingkaran, hasil kali diagonal sama dengan jumlah hasil kali sisi-sisi berhadapan.
- **628 M.** Brahmagupta memberikan luas segiempat yang terletak dalam lingkaran, $\sqrt{(s-a)(s-b)(s-c)(s-d)}$, dengan $s$ setengah keliling. Rumus ini menggeneralisasi rumus Heron untuk segitiga.
- **1769.** Albrecht Meister menguraikan rumus tali sepatu untuk luas poligon dari koordinatnya; kini rumus ini juga dikenal dengan nama Gauss, dan sebagai rumus juru ukur.

Namanya sendiri bergeser. Seiring waktu bahasa Inggris Britania mempertahankan *trapezium* untuk segiempat dengan sepasang sisi sejajar, sedangkan bahasa Inggris Amerika beralih ke *trapezoid*, sehingga satu bangun kini punya dua nama.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What are the common mistakes with quadrilaterals?', 'Apa kesalahan umum pada segiempat?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with quadrilaterals are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| A square is not a rectangle | It is: it has four right angles. Every square is a rectangle and a rhombus. |
| The diagonals of a rectangle are perpendicular | They are equal and bisect each other; they are perpendicular only in a square. |
| The diagonals of a parallelogram are equal | Only for a rectangle; in general they are different, but always bisect each other. |
| The area of a parallelogram is the product of two neighboring sides | It is base times height; the slanted side is longer than the height. |
| The area of a rhombus is $s^2$ | That is a square. A rhombus has $\frac{d_1d_2}{2}$, or base times height. |
| The area of a trapezoid is $abh$ | It is $\frac{(a+b)h}{2}$: the average of the parallel sides times the height. |
| The angles of a quadrilateral add up to $180^\circ$ | That is a triangle. A quadrilateral has $360^\circ$. |
| The diagonals of a kite bisect each other | Only the axis diagonal bisects the other one; they are perpendicular. |
| Naming the vertices in any order | $ABCD$ must go round the shape; $ACBD$ can describe a bow-tie. |`,
            T`**Kesalahan paling umum pada segiempat adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| Persegi bukan persegi panjang | Persegi adalah persegi panjang: ia memiliki empat sudut siku-siku. Setiap persegi adalah persegi panjang sekaligus belah ketupat. |
| Diagonal persegi panjang tegak lurus | Diagonalnya sama panjang dan saling membagi dua; tegak lurus hanya pada persegi. |
| Diagonal jajargenjang sama panjang | Hanya untuk persegi panjang; secara umum berbeda, tetapi selalu saling membagi dua. |
| Luas jajargenjang adalah hasil kali dua sisi bertetangga | Luasnya alas kali tinggi; sisi yang miring lebih panjang daripada tinggi. |
| Luas belah ketupat adalah $s^2$ | Itu persegi. Belah ketupat memiliki $\frac{d_1d_2}{2}$, atau alas kali tinggi. |
| Luas trapesium adalah $abh$ | Luasnya $\frac{(a+b)h}{2}$: rata-rata sisi sejajar kali tinggi. |
| Sudut segiempat berjumlah $180^\circ$ | Itu segitiga. Segiempat berjumlah $360^\circ$. |
| Diagonal layang-layang saling membagi dua | Hanya diagonal sumbu yang membagi dua diagonal lainnya; keduanya tegak lurus. |
| Menamai titik sudut dalam urutan sembarang | $ABCD$ harus mengelilingi bangun; $ACBD$ dapat menggambarkan pita. |`,
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
              L('Every square is a rectangle.', 'Setiap persegi adalah persegi panjang.'),
              L('Every rectangle is a square.', 'Setiap persegi panjang adalah persegi.'),
              L('The diagonals of a parallelogram bisect each other.', 'Diagonal jajargenjang saling membagi dua.'),
              L('The diagonals of a rectangle are always perpendicular.', 'Diagonal persegi panjang selalu tegak lurus.'),
              L('The interior angles of any simple quadrilateral add up to $360^\\circ$.', 'Sudut dalam segiempat sederhana mana pun berjumlah $360^\\circ$.'),
              L('A rhombus with one right angle is a square.', 'Belah ketupat dengan satu sudut siku-siku adalah persegi.'),
            ],
            answer: [true, false, true, false, true, true],
            explain: L(
              'A square has four right angles, so it is a rectangle, but a rectangle need not have equal sides. A parallelogram has bisecting diagonals. The diagonals of a rectangle are equal, and perpendicular only for a square. Any quadrilateral has angle sum $360^\\circ$. A rhombus has equal sides, and one right angle makes all four right.',
              'Persegi memiliki empat sudut siku-siku sehingga ia persegi panjang, tetapi persegi panjang belum tentu bersisi sama. Jajargenjang memiliki diagonal yang saling membagi dua. Diagonal persegi panjang sama panjang, dan tegak lurus hanya untuk persegi. Segiempat mana pun berjumlah sudut $360^\\circ$. Belah ketupat bersisi sama, dan satu sudut siku-siku membuat keempatnya siku-siku.',
            ),
            hint: L('Ask whether a special case of the first shape always has the properties of the second.', 'Tanyakan apakah kasus khusus bangun pertama selalu memiliki sifat bangun kedua.'),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L('Choose **all** the quadrilaterals whose diagonals are always perpendicular.', 'Pilih **semua** segiempat yang diagonalnya selalu tegak lurus.'),
            options: [L('rhombus', 'belah ketupat'), L('rectangle', 'persegi panjang'), L('kite', 'layang-layang'), L('parallelogram', 'jajargenjang'), L('square', 'persegi')],
            answer: [0, 2, 4],
            explain: L(
              'The diagonals of a rhombus, a kite and a square are perpendicular. A rectangle that is not a square and a general parallelogram have diagonals that meet at other angles.',
              'Diagonal belah ketupat, layang-layang, dan persegi tegak lurus. Persegi panjang yang bukan persegi dan jajargenjang umum memiliki diagonal yang berpotongan pada sudut lain.',
            ),
            hint: L('Think of the shapes whose area is half the product of the diagonals.', 'Pikirkan bangun yang luasnya setengah hasil kali diagonal.'),
          },
        },
        {
          kind: 'activity',
          title: L('Which quadrilateral?', 'Segiempat yang mana?'),
          step: {
            kind: 'quiz',
            id: 'p3',
            prompt: L('The diagonals of a quadrilateral are equal and bisect each other. What must it be?', 'Diagonal suatu segiempat sama panjang dan saling membagi dua. Segiempat apakah itu pasti?'),
            options: [L('a rhombus', 'belah ketupat'), L('a rectangle', 'persegi panjang'), L('a kite', 'layang-layang'), L('an isosceles trapezoid', 'trapesium sama kaki')],
            answer: 1,
            explain: L(
              'Diagonals that bisect each other make a parallelogram, and equal diagonals make it a rectangle. (A square qualifies too, but it is a rectangle.) An isosceles trapezoid has equal diagonals that do not bisect each other.',
              'Diagonal yang saling membagi dua menghasilkan jajargenjang, dan diagonal sama panjang menjadikannya persegi panjang. (Persegi juga memenuhi, tetapi ia persegi panjang.) Trapesium sama kaki memiliki diagonal sama panjang yang tidak saling membagi dua.',
            ),
            hint: L('Bisecting diagonals give a parallelogram; which parallelogram has equal diagonals?', 'Diagonal yang saling membagi dua memberi jajargenjang; jajargenjang mana yang diagonalnya sama panjang?'),
          },
        },
        {
          kind: 'activity',
          title: L('Symmetry', 'Simetri'),
          step: {
            kind: 'quiz',
            id: 'p4',
            prompt: L('Which quadrilateral has exactly two lines of symmetry and, in general, no right angles?', 'Segiempat manakah yang memiliki tepat dua sumbu simetri dan, secara umum, tanpa sudut siku-siku?'),
            options: [L('rhombus', 'belah ketupat'), L('rectangle', 'persegi panjang'), L('kite', 'layang-layang'), L('parallelogram', 'jajargenjang')],
            answer: 0,
            explain: L(
              'A rhombus has two lines of symmetry, along its diagonals. A rectangle also has two, but has right angles. A kite has one, and a general parallelogram has none.',
              'Belah ketupat memiliki dua sumbu simetri, sepanjang diagonalnya. Persegi panjang juga memiliki dua, tetapi bersudut siku-siku. Layang-layang memiliki satu, dan jajargenjang umum tidak punya.',
            ),
            hint: L('A rectangle has right angles, a kite has one line and a parallelogram has none.', 'Persegi panjang bersudut siku-siku, layang-layang punya satu sumbu, dan jajargenjang tidak punya.'),
          },
        },
        {
          kind: 'activity',
          title: L('Angles in a ratio', 'Sudut berperbandingan'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [L('Write the angles as $x,2x,3x,4x$.', 'Tulis sudut-sudutnya sebagai $x,2x,3x,4x$.'), L('$10x=360$, so $x=36$.', '$10x=360$, sehingga $x=36$.')],
            explain: L('$x+2x+3x+4x=10x=360$, so $x=36$ and the largest angle is $4x=144^\\circ$.', '$x+2x+3x+4x=10x=360$, sehingga $x=36$ dan sudut terbesar $4x=144^\\circ$.'),
            prompt: L('The angles of a quadrilateral are in the ratio $1:2:3:4$. How many degrees is the largest?', 'Sudut-sudut suatu segiempat berperbandingan $1:2:3:4$. Berapa derajat yang terbesar?'),
            given: String.raw`x+2x+3x+4x=360:\quad 4x=v`,
            blanks: [{ label: 'v =', answer: 144 }],
          },
        },
        {
          kind: 'activity',
          title: L('Area of a trapezoid', 'Luas trapesium'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L('Use $\\frac{(a+b)h}{2}$.', 'Pakai $\\frac{(a+b)h}{2}$.'), L('$(12+8)\\cdot5=100$.', '$(12+8)\\cdot5=100$.')],
            explain: L('$\\frac{(12+8)\\cdot5}{2}=\\frac{100}{2}=50$.', '$\\frac{(12+8)\\cdot5}{2}=\\frac{100}{2}=50$.'),
            prompt: L('A trapezoid has parallel sides $12$ and $8$ and height $5$. Find its area.', 'Sebuah trapesium memiliki sisi sejajar $12$ dan $8$ dan tinggi $5$. Tentukan luasnya.'),
            given: String.raw`\frac{(12+8)\cdot5}{2}=v`,
            blanks: [{ label: 'v =', answer: 50 }],
          },
        },
        {
          kind: 'activity',
          title: L('A rhombus', 'Belah ketupat'),
          step: {
            kind: 'math',
            id: 'p7',
            hints: [
              L('The area is $\\frac{d_1d_2}{2}$. For the side, use half of each diagonal as the legs of a right triangle.', 'Luasnya $\\frac{d_1d_2}{2}$. Untuk sisinya, pakai setengah tiap diagonal sebagai kaki segitiga siku-siku.'),
              L('The legs are $5$ and $12$, so the side is $\\sqrt{25+144}=13$.', 'Kakinya $5$ dan $12$, sehingga sisinya $\\sqrt{25+144}=13$.'),
            ],
            explain: L('Area: $\\frac{10\\cdot24}{2}=120$. Side: $\\sqrt{5^2+12^2}=13$, so the perimeter is $4\\cdot13=52$.', 'Luas: $\\frac{10\\cdot24}{2}=120$. Sisi: $\\sqrt{5^2+12^2}=13$, sehingga kelilingnya $4\\cdot13=52$.'),
            prompt: L('A rhombus has diagonals $10$ and $24$. Find its area and its perimeter.', 'Sebuah belah ketupat memiliki diagonal $10$ dan $24$. Tentukan luas dan kelilingnya.'),
            given: String.raw`d_1=10,\ d_2=24`,
            blanks: [
              { label: L('area =', 'luas ='), answer: 120 },
              { label: L('perimeter =', 'keliling ='), answer: 52 },
            ],
          },
        },
        {
          kind: 'activity',
          title: L('Area from coordinates', 'Luas dari koordinat'),
          step: {
            kind: 'math',
            id: 'p8',
            hints: [
              L('Add $x_iy_{i+1}-x_{i+1}y_i$ round the four edges, then halve the absolute value.', 'Jumlahkan $x_iy_{i+1}-x_{i+1}y_i$ pada keempat sisi, lalu setengahkan nilai mutlaknya.'),
              L('The terms are $0,\\ 20,\\ 24,\\ 0$.', 'Suku-sukunya $0,\\ 20,\\ 24,\\ 0$.'),
            ],
            explain: L('The terms are $0\\cdot0-5\\cdot0=0$, $5\\cdot4-7\\cdot0=20$, $7\\cdot4-1\\cdot4=24$, $1\\cdot0-0\\cdot4=0$. The sum is $44$, so the area is $22$.', 'Sukunya $0\\cdot0-5\\cdot0=0$, $5\\cdot4-7\\cdot0=20$, $7\\cdot4-1\\cdot4=24$, $1\\cdot0-0\\cdot4=0$. Jumlahnya $44$, sehingga luasnya $22$.'),
            prompt: L('Find the area of the quadrilateral with vertices $A(0,0)$, $B(5,0)$, $C(7,4)$, $D(1,4)$.', 'Tentukan luas segiempat dengan titik sudut $A(0,0)$, $B(5,0)$, $C(7,4)$, $D(1,4)$.'),
            given: String.raw`\tfrac12\left|\sum(x_iy_{i+1}-x_{i+1}y_i)\right|=v`,
            blanks: [{ label: 'v =', answer: 22 }],
          },
        },
        {
          kind: 'activity',
          title: L('A plot of land', 'Sebidang tanah'),
          step: {
            kind: 'quiz',
            id: 'p9',
            prompt: L(
              'A plot is a trapezoid with parallel sides 24 m and 16 m, 10 m apart. Land costs 60 dollars per square meter. What does the plot cost?',
              'Sebidang tanah berbentuk trapesium dengan sisi sejajar 24 m dan 16 m, berjarak 10 m. Harga tanah Rp400.000 per meter persegi. Berapa harga tanah itu?',
            ),
            options: [L('12,000 dollars', 'Rp80.000.000'), L('24,000 dollars', 'Rp160.000.000'), L('9,600 dollars', 'Rp64.000.000'), L('14,400 dollars', 'Rp96.000.000')],
            answer: 0,
            explain: L(
              'The area is $\\frac{(24+16)\\cdot10}{2}=200$ m², so the cost is $200\\cdot60=12000$ dollars.',
              'Luasnya $\\frac{(24+16)\\cdot10}{2}=200$ m², sehingga harganya 200 kali Rp400.000, yaitu Rp80.000.000.',
            ),
            hint: L('First find the area of the trapezoid, then multiply by the price per square meter.', 'Cari dulu luas trapesium, lalu kalikan dengan harga per meter persegi.'),
          },
        },
      ],
    },

    /* ---------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: quadrilaterals at a glance', 'Ringkasan: segiempat sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Definition:** four sides, four vertices, two diagonals; the angles of a simple quadrilateral add up to $360^\circ$.
- **Family tree:** square $\subset$ rectangle, rhombus $\subset$ parallelogram; rhombus $\subset$ kite; a trapezoid has exactly one parallel pair.
- **Parallelogram:** opposite sides parallel and equal, opposite angles equal, diagonals bisect each other.
- **Rectangle / rhombus / square:** equal diagonals / perpendicular diagonals / both.
- **Area:** $lw$, $bh$, $\frac{(a+b)h}{2}$, and $\frac{d_1d_2}{2}$ for a rhombus or kite; perimeter is the sum of the sides.
- **Coordinates:** cross product $0$ is parallel, dot product $0$ is perpendicular, squared distances for equal length; area is $\frac12\left|\sum(x_iy_{i+1}-x_{i+1}y_i)\right|$.
- **Code:** use integers or ´Fraction´, never float equality; order the vertices round the shape.`,
            T`- **Definisi:** empat sisi, empat titik sudut, dua diagonal; sudut segiempat sederhana berjumlah $360^\circ$.
- **Pohon keluarga:** persegi $\subset$ persegi panjang, belah ketupat $\subset$ jajargenjang; belah ketupat $\subset$ layang-layang; trapesium memiliki tepat satu pasang sisi sejajar.
- **Jajargenjang:** sisi berhadapan sejajar dan sama panjang, sudut berhadapan sama besar, diagonal saling membagi dua.
- **Persegi panjang / belah ketupat / persegi:** diagonal sama panjang / diagonal tegak lurus / keduanya.
- **Luas:** $lw$, $bh$, $\frac{(a+b)h}{2}$, dan $\frac{d_1d_2}{2}$ untuk belah ketupat atau layang-layang; keliling adalah jumlah sisi-sisinya.
- **Koordinat:** hasil kali silang $0$ berarti sejajar, hasil kali titik $0$ berarti tegak lurus, kuadrat jarak untuk panjang yang sama; luasnya $\frac12\left|\sum(x_iy_{i+1}-x_{i+1}y_i)\right|$.
- **Kode:** pakai bilangan bulat atau ´Fraction´, jangan kesamaan float; urutkan titik sudut mengelilingi bangun.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Quadrilateral', 'Segiempat'), definition: L('A polygon with four sides, four vertices and four interior angles that add up to 360 degrees.', 'Poligon dengan empat sisi, empat titik sudut, dan empat sudut dalam yang berjumlah 360 derajat.') },
    { term: L('Parallelogram', 'Jajargenjang'), definition: L('A quadrilateral whose two pairs of opposite sides are parallel, which makes opposite sides and opposite angles equal.', 'Segiempat yang kedua pasang sisi berhadapannya sejajar, sehingga sisi dan sudut berhadapannya sama.') },
    { term: L('Rectangle', 'Persegi panjang'), definition: L('A quadrilateral with four right angles, which is a parallelogram with equal diagonals.', 'Segiempat dengan empat sudut siku-siku, yaitu jajargenjang dengan diagonal sama panjang.') },
    { term: L('Rhombus', 'Belah ketupat'), definition: L('A quadrilateral with four equal sides, which is a parallelogram whose diagonals are perpendicular.', 'Segiempat dengan empat sisi sama panjang, yaitu jajargenjang yang diagonalnya tegak lurus.') },
    { term: L('Square', 'Persegi'), definition: L('A quadrilateral with four equal sides and four right angles, so it is both a rectangle and a rhombus.', 'Segiempat dengan empat sisi sama panjang dan empat sudut siku-siku, sehingga ia persegi panjang sekaligus belah ketupat.') },
    { term: L('Kite', 'Layang-layang'), definition: L('A quadrilateral with two pairs of equal adjacent sides, whose diagonals are perpendicular.', 'Segiempat dengan dua pasang sisi berdekatan yang sama panjang, yang diagonalnya tegak lurus.') },
    { term: L('Trapezoid', 'Trapesium'), definition: L('A quadrilateral with exactly one pair of parallel sides, called the bases, in the school definition used here.', 'Segiempat dengan tepat satu pasang sisi sejajar, yang disebut alas, dalam definisi sekolah yang dipakai di sini.') },
    { term: L('Diagonal', 'Diagonal'), definition: L('A segment that joins two opposite vertices of a quadrilateral.', 'Ruas garis yang menghubungkan dua titik sudut berhadapan pada segiempat.') },
    { term: L('Convex quadrilateral', 'Segiempat cembung'), definition: L('A quadrilateral in which every interior angle is less than 180 degrees and both diagonals lie inside.', 'Segiempat yang setiap sudut dalamnya kurang dari 180 derajat dan kedua diagonalnya berada di dalam.') },
    { term: L('Shoelace formula', 'Rumus tali sepatu'), definition: L('A formula giving the area of a simple polygon as half the absolute sum of x sub i times y sub i plus 1 minus x sub i plus 1 times y sub i.', 'Rumus yang memberi luas poligon sederhana sebagai setengah nilai mutlak jumlah x indeks i kali y indeks i tambah 1 dikurangi x indeks i tambah 1 kali y indeks i.') },
    { term: L('Line of symmetry', 'Sumbu simetri'), definition: L('A line that divides a shape into two mirror-image halves, so that reflecting the shape in it leaves it unchanged.', 'Garis yang membagi bangun menjadi dua bagian bayangan cermin, sehingga pencerminan bangun terhadapnya tidak mengubahnya.') },
  ],

  howTo: [
    {
      name: L('How to identify a quadrilateral from its properties', 'Cara menentukan jenis segiempat dari sifatnya'),
      description: L('Test the parallel sides first, then the side lengths and the right angles, and read the name off the family tree.', 'Uji sisi sejajar lebih dulu, lalu panjang sisi dan sudut siku-siku, dan baca namanya dari pohon keluarga.'),
      steps: [
        { name: L('Count the parallel pairs', 'Hitung pasangan sejajar'), text: L('Check which opposite sides are parallel: two pairs make a parallelogram, one pair a trapezoid, none a kite or a general quadrilateral.', 'Periksa sisi berhadapan mana yang sejajar: dua pasang menghasilkan jajargenjang, satu pasang trapesium, tidak ada layang-layang atau segiempat umum.') },
        { name: L('Compare the sides', 'Bandingkan sisi-sisinya'), text: L('For a parallelogram, check whether all four sides are equal, which makes a rhombus. With no parallel sides, check for two pairs of equal adjacent sides, which makes a kite.', 'Pada jajargenjang, periksa apakah keempat sisi sama panjang, yang menjadikannya belah ketupat. Tanpa sisi sejajar, periksa dua pasang sisi berdekatan yang sama panjang, yang menjadikannya layang-layang.') },
        { name: L('Check the right angles', 'Periksa sudut siku-siku'), text: L('A parallelogram with one right angle is a rectangle, and a rhombus with one right angle is a square.', 'Jajargenjang dengan satu sudut siku-siku adalah persegi panjang, dan belah ketupat dengan satu sudut siku-siku adalah persegi.') },
        { name: L('Name every type that applies', 'Sebutkan semua jenis yang berlaku'), text: L('A square is also a rectangle, a rhombus, a parallelogram and a kite; use the most specific name and mention the others when they matter.', 'Persegi juga persegi panjang, belah ketupat, jajargenjang, dan layang-layang; pakai nama yang paling khusus dan sebut yang lain bila perlu.') },
      ],
    },
    {
      name: L('How to find the area of a quadrilateral from its coordinates', 'Cara mencari luas segiempat dari koordinatnya'),
      description: L('List the vertices in order and apply the shoelace formula.', 'Daftar titik sudut berurutan dan terapkan rumus tali sepatu.'),
      steps: [
        { name: L('List the vertices in order', 'Daftar titik sudut berurutan'), text: L('Write the four vertices in order round the shape and repeat the first vertex at the end.', 'Tulis keempat titik sudut berurutan mengelilingi bangun dan ulangi titik pertama di akhir.') },
        { name: L('Compute each term', 'Hitung tiap suku'), text: L('For each edge compute x of this vertex times y of the next, minus x of the next times y of this one.', 'Untuk tiap sisi hitung x titik ini kali y titik berikutnya, dikurangi x titik berikutnya kali y titik ini.') },
        { name: L('Add the four terms', 'Jumlahkan keempat suku'), text: L('Add the four terms; a positive sum means the vertices run counterclockwise.', 'Jumlahkan keempat suku; jumlah positif berarti titik sudutnya berlawanan arah jarum jam.') },
        { name: L('Halve the absolute value', 'Setengahkan nilai mutlak'), text: L('The area is half the absolute value of the sum, valid when the polygon does not cross itself.', 'Luasnya setengah nilai mutlak jumlah itu, berlaku bila poligon tidak memotong dirinya sendiri.') },
      ],
    },
    {
      name: L('How to classify a quadrilateral from coordinates', 'Cara menentukan jenis segiempat dari koordinat'),
      description: L('Use cross products for parallel sides, dot products for right angles and squared distances for equal sides.', 'Pakai hasil kali silang untuk sisi sejajar, hasil kali titik untuk sudut siku-siku, dan kuadrat jarak untuk sisi sama panjang.'),
      steps: [
        { name: L('Write the four side vectors', 'Tulis keempat vektor sisi'), text: L('Subtract neighboring vertices to get the vectors AB, BC, CD and DA.', 'Kurangkan titik sudut bertetangga untuk mendapat vektor AB, BC, CD, dan DA.') },
        { name: L('Test for parallel sides', 'Uji sisi sejajar'), text: L('Opposite sides are parallel when the cross product of their vectors is exactly zero.', 'Sisi berhadapan sejajar bila hasil kali silang vektornya tepat nol.') },
        { name: L('Compare squared lengths', 'Bandingkan kuadrat panjang'), text: L('Compare the squared lengths of the sides; equal squares mean equal sides, with no square root needed.', 'Bandingkan kuadrat panjang sisi; kuadrat yang sama berarti sisi sama panjang, tanpa akar.') },
        { name: L('Test for a right angle', 'Uji sudut siku-siku'), text: L('Two neighboring sides are perpendicular when the dot product of their vectors is zero.', 'Dua sisi bertetangga tegak lurus bila hasil kali titik vektornya nol.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is a quadrilateral?', 'Apa itu segiempat?'),
      a: L(
        'A quadrilateral is a polygon with four sides, four vertices and four interior angles. The angles of any simple quadrilateral add up to 360 degrees. It can be convex, concave, or crossed like a bow-tie.',
        'Segiempat adalah poligon dengan empat sisi, empat titik sudut, dan empat sudut dalam. Sudut segiempat sederhana mana pun berjumlah 360 derajat. Ia bisa cembung, cekung, atau bersilang seperti pita.',
      ),
    },
    {
      q: L('What are the types of quadrilaterals?', 'Apa saja jenis-jenis segiempat?'),
      a: L(
        'The named types are the parallelogram, rectangle, rhombus, square, kite and trapezoid. A square is also a rectangle and a rhombus, and both of those are parallelograms. A trapezoid in the school definition has exactly one pair of parallel sides.',
        'Jenis yang bernama adalah jajargenjang, persegi panjang, belah ketupat, persegi, layang-layang, dan trapesium. Persegi juga persegi panjang dan belah ketupat, dan keduanya jajargenjang. Trapesium dalam definisi sekolah memiliki tepat satu pasang sisi sejajar.',
      ),
    },
    {
      q: L('Why do the angles of a quadrilateral add up to 360 degrees?', 'Mengapa sudut segiempat berjumlah 360 derajat?'),
      a: L(
        'A diagonal that lies inside the quadrilateral splits it into two triangles. Each triangle has angles adding up to 180 degrees, and the four angles of the quadrilateral are made of all six, so the total is 360 degrees.',
        'Diagonal yang berada di dalam segiempat membaginya menjadi dua segitiga. Sudut tiap segitiga berjumlah 180 derajat, dan keempat sudut segiempat tersusun dari keenam sudut itu, sehingga totalnya 360 derajat.',
      ),
    },
    {
      q: L('Is a square a rectangle?', 'Apakah persegi itu persegi panjang?'),
      a: L(
        'Yes. A rectangle is any quadrilateral with four right angles, and a square has them. A square is also a rhombus, a parallelogram and a kite. The reverse is false: a rectangle with unequal sides is not a square.',
        'Ya. Persegi panjang adalah segiempat mana pun dengan empat sudut siku-siku, dan persegi memilikinya. Persegi juga belah ketupat, jajargenjang, dan layang-layang. Kebalikannya salah: persegi panjang dengan sisi tak sama bukan persegi.',
      ),
    },
    {
      q: L('What is the difference between a rhombus and a parallelogram?', 'Apa beda belah ketupat dan jajargenjang?'),
      a: L(
        'Every rhombus is a parallelogram, but not the other way round. A parallelogram has opposite sides parallel and equal; a rhombus also has all four sides equal, so its diagonals are perpendicular and bisect its angles.',
        'Setiap belah ketupat adalah jajargenjang, tetapi tidak sebaliknya. Jajargenjang memiliki sisi berhadapan yang sejajar dan sama panjang; belah ketupat juga memiliki keempat sisi sama panjang, sehingga diagonalnya tegak lurus dan membagi dua sudutnya.',
      ),
    },
    {
      q: L('What are the properties of a parallelogram?', 'Apa sifat-sifat jajargenjang?'),
      a: L(
        'Opposite sides are parallel and equal, opposite angles are equal, angles next to a side add up to 180 degrees, and the diagonals bisect each other. A diagonal splits it into two congruent triangles.',
        'Sisi berhadapan sejajar dan sama panjang, sudut berhadapan sama besar, sudut yang berdekatan pada satu sisi berjumlah 180 derajat, dan diagonal saling membagi dua. Satu diagonal membaginya menjadi dua segitiga yang kongruen.',
      ),
    },
    {
      q: L('How do you find the area of a trapezoid?', 'Bagaimana mencari luas trapesium?'),
      a: L(
        'Add the two parallel sides, multiply by the height and divide by two. For parallel sides 8 and 4 and height 4 the area is 12 times 4 over 2, which is 24. The height is the perpendicular distance between the parallel sides.',
        'Jumlahkan kedua sisi sejajar, kalikan dengan tinggi, lalu bagi dua. Untuk sisi sejajar 8 dan 4 dan tinggi 4, luasnya 12 kali 4 dibagi 2, yaitu 24. Tinggi adalah jarak tegak lurus antara sisi-sisi sejajar.',
      ),
    },
    {
      q: L('How do you find the area of a rhombus or a kite?', 'Bagaimana mencari luas belah ketupat atau layang-layang?'),
      a: L(
        'Multiply the two diagonals and divide by two. This works because the diagonals are perpendicular, so the rectangle drawn round the shape has exactly twice its area. A rhombus with diagonals 10 and 24 has area 120.',
        'Kalikan kedua diagonal lalu bagi dua. Ini berlaku karena diagonalnya tegak lurus, sehingga persegi panjang yang mengelilingi bangun itu luasnya tepat dua kali luas bangun. Belah ketupat dengan diagonal 10 dan 24 berluas 120.',
      ),
    },
    {
      q: L('What is the shoelace formula?', 'Apa itu rumus tali sepatu?'),
      a: L(
        'It gives the area of a polygon from the coordinates of its vertices listed in order. For each edge compute x times the next y minus the next x times y, add them up and halve the absolute value. It is valid when the polygon does not cross itself.',
        'Rumus ini memberi luas poligon dari koordinat titik sudutnya yang dituliskan berurutan. Untuk tiap sisi hitung x kali y berikutnya dikurangi x berikutnya kali y, jumlahkan, lalu setengahkan nilai mutlaknya. Rumus berlaku bila poligon tidak memotong dirinya sendiri.',
      ),
    },
    {
      q: L('How can you tell from coordinates whether two sides are parallel?', 'Bagaimana mengetahui dari koordinat bahwa dua sisi sejajar?'),
      a: L(
        'Write each side as a vector and compute the cross product, u1 times v2 minus v1 times u2. Parallel sides give exactly zero. This test needs no division, so it also works for vertical sides, where a slope is undefined.',
        'Tulis tiap sisi sebagai vektor dan hitung hasil kali silang, u1 kali v2 dikurangi v1 kali u2. Sisi sejajar memberi tepat nol. Uji ini tidak memakai pembagian, sehingga berlaku juga untuk sisi tegak, di mana gradien tidak terdefinisi.',
      ),
    },
    {
      q: L('What is the difference between a trapezoid and a trapezium?', 'Apa beda trapezoid dan trapezium?'),
      a: L(
        'They name the same shape in different countries: American English says trapezoid, and British English says trapezium, for a quadrilateral with a pair of parallel sides. Indonesian uses trapesium. Books also differ on whether a parallelogram counts, so check the definition.',
        'Keduanya menamai bangun yang sama di negara berbeda: bahasa Inggris Amerika menyebut trapezoid dan bahasa Inggris Britania menyebut trapezium untuk segiempat dengan sepasang sisi sejajar. Bahasa Indonesia memakai trapesium. Buku juga berbeda soal apakah jajargenjang termasuk, jadi periksa definisinya.',
      ),
    },
    {
      q: L('What is a concave quadrilateral?', 'Apa itu segiempat cekung?'),
      a: L(
        'A concave quadrilateral has one interior angle greater than 180 degrees, so one vertex points inward and one diagonal lies outside the shape. A concave kite is called a dart or arrowhead. Its angles still add up to 360 degrees.',
        'Segiempat cekung memiliki satu sudut dalam lebih dari 180 derajat, sehingga satu titik sudut menjorok ke dalam dan satu diagonal berada di luar bangun. Layang-layang cekung disebut dart atau kepala panah. Sudutnya tetap berjumlah 360 derajat.',
      ),
    },
    {
      q: L('How do you classify a quadrilateral in Python?', 'Bagaimana mengklasifikasikan segiempat di Python?'),
      a: L(
        'Use integer or Fraction coordinates. Test parallel sides with the cross product being zero, right angles with the dot product being zero and equal sides by comparing squared distances. Avoid float equality, because 0.7 times 0.3 minus 0.1 times 2.1 is not exactly zero.',
        'Pakai koordinat bilangan bulat atau Fraction. Uji sisi sejajar dengan hasil kali silang sama dengan nol, sudut siku-siku dengan hasil kali titik sama dengan nol, dan sisi sama panjang dengan membandingkan kuadrat jarak. Hindari kesamaan float, karena 0,7 kali 0,3 dikurangi 0,1 kali 2,1 tidak tepat nol.',
      ),
    },
  ],

  references: [
    { title: 'The Thirteen Books of Euclid\'s Elements (2nd ed.), Book I, definition 22 and propositions 33–36', author: 'Thomas L. Heath (translator)', year: 1908, source: 'Cambridge University Press' },
    { title: 'Algebra, with Arithmetic and Mensuration, from the Sanskrit of Brahmegupta and Bhascara', author: 'Henry Thomas Colebrooke (translator)', year: 1817, source: 'John Murray' },
    { title: 'The Rhind Mathematical Papyrus', author: 'Arnold Buffum Chace', year: 1927, source: 'Mathematical Association of America' },
    { title: 'Geometry Revisited, chapter 2 (cyclic quadrilaterals)', author: 'H. S. M. Coxeter and Samuel L. Greitzer', year: 1967, source: 'Mathematical Association of America' },
    { title: 'The Surveyor\'s Area Formula', author: 'Bart Braden', year: 1986, source: 'The College Mathematics Journal, 17(4), 326–337' },
    { title: 'The Python Standard Library: fractions, rational numbers', author: 'Python Software Foundation', source: 'docs.python.org', url: 'https://docs.python.org/3/library/fractions.html' },
  ],

  related: ['irrational-numbers', 'exponents-and-radicals', 'algebraic-expressions', 'rational-numbers'],
}
