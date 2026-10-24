import type { Figure } from '../../lib/figure'
import type { Loc } from '../types'
import type { ArticleBlock, ArticleBody } from './types'
import { meta } from './law-of-sines.meta'

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

/** A static drawing on a plain canvas: the figure items are the only things in it, with no sliders and nothing to drag. The labels inside a
 *  drawing are letters, numbers and symbols, which read the same in both languages; the words are in the caption. */
const fig = (f: Omit<Figure, 'dim' | 'axes'>): ArticleBlock => {
  // With both spans given and no aspect, choose the frame that gives one scale on both axes (a 460-wide drawing with 26 of margin all round)
  const aspect = f.aspect ?? (f.xSpan && f.ySpan ? Math.min(3, Math.max(0.5, 460 / (52 + (460 - 52) * ((f.ySpan[1] - f.ySpan[0]) / (f.xSpan[1] - f.xSpan[0]))))) : 1)
  return { kind: 'figure', figure: { dim: 2, axes: false, ...f, aspect } }
}
const TURN = 6.2832

/* ------------------------------------------------------------------------------- the figures */

/** The proof by the altitude: h = b sin A = a sin B. */
const FIG_ALTITUDE: ArticleBlock = fig({
  range: 1.6, // the size of the angle arcs and of the right-angle mark follows this
  xSpan: [-0.8, 6.9],
  ySpan: [-0.7, 3.9],
  items: [
    { t: 'poly', pts: [[0, 0], [6, 0], [4, 3.2]], color: 'a' },
    { t: 'seg', from: [0, 0], to: [6, 0], color: 'muted', width: 2.4 },
    { t: 'seg', from: [0, 0], to: [4, 3.2], color: 'b', width: 2.6, label: 'b' },
    { t: 'seg', from: [6, 0], to: [4, 3.2], color: 'c', width: 2.6, label: 'a' },
    { t: 'seg', from: [4, 0], to: [4, 3.2], color: 'result', width: 2.2, dashed: true, label: 'h' },
    { t: 'right', at: [4, 0], from: [0, 0], to: [4, 3.2] },
    { t: 'angle', at: [0, 0], from: [1, 0], to: [4, 3.2], label: 'A' },
    { t: 'angle', at: [6, 0], from: [0, 0], to: [4, 3.2], label: 'B' },
    { t: 'point', at: [0, 0], color: 'muted' },
    { t: 'point', at: [6, 0], color: 'muted' },
    { t: 'point', at: [4, 3.2], label: 'C', color: 'muted' },
  ],
  caption: L(
    T`The altitude $h$ from $C$ makes two right triangles. In one, $h=b\sin A$; in the other, $h=a\sin B$. So $b\sin A=a\sin B$, which is $\frac{a}{\sin A}=\frac{b}{\sin B}$.`,
    T`Garis tinggi $h$ dari $C$ membentuk dua segitiga siku-siku. Pada yang satu, $h=b\sin A$; pada yang lain, $h=a\sin B$. Jadi $b\sin A=a\sin B$, yaitu $\frac{a}{\sin A}=\frac{b}{\sin B}$.`,
  ),
})

/** The circle through the vertices and the diameter from B. */
const ang = (deg: number): [number, number] => [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)]
const FIG_CIRCLE: ArticleBlock = fig({
  range: 1.5,
  xSpan: [-1.45, 1.45],
  ySpan: [-1.25, 1.3],
  items: [
    { t: 'param', x: 'cos(t)', y: 'sin(t)', from: 0, to: TURN, color: 'muted' },
    { t: 'poly', pts: [ang(20), [-1, 0], ang(70)], color: 'a' },
    { t: 'seg', from: [-1, 0], to: [1, 0], color: 'result', width: 2, dashed: true },
    { t: 'seg', from: ang(70), to: [1, 0], color: 'result', width: 2, dashed: true },
    { t: 'seg', from: [-1, 0], to: ang(70), color: 'c', width: 3, label: 'a' },
    { t: 'seg', from: [-1, 0], to: ang(20), color: 'b', width: 2.6 },
    { t: 'seg', from: ang(20), to: ang(70), color: 'b', width: 2.6 },
    { t: 'right', at: ang(70), from: [-1, 0], to: [1, 0] },
    { t: 'point', at: [0, 0], label: 'O', color: 'muted' },
    { t: 'point', at: ang(20), label: 'A', color: 'muted' },
    { t: 'point', at: [-1, 0], label: 'B', color: 'muted' },
    { t: 'point', at: ang(70), label: 'C', color: 'muted' },
    { t: 'point', at: [1, 0], label: 'B′', color: 'result' },
  ],
  caption: L(
    T`The circle through $A$, $B$ and $C$, with centre $O$ and radius $R$. $BB'$ is a diameter, so the angle at $C$ is a right angle, and the angle at $B'$ equals the angle at $A$ (both look at the chord $BC$ from the same arc). In the right triangle $BCB'$: $\sin A=\frac{a}{2R}$.`,
    T`Lingkaran melalui $A$, $B$, dan $C$, dengan pusat $O$ dan jari-jari $R$. $BB'$ adalah diameter, sehingga sudut di $C$ siku-siku, dan sudut di $B'$ sama dengan sudut di $A$ (keduanya memandang tali busur $BC$ dari busur yang sama). Pada segitiga siku-siku $BCB'$: $\sin A=\frac{a}{2R}$.`,
  ),
})

/** The ambiguous case: a = 3, b = 5, A = 30°. */
const FIG_AMBIGUOUS: ArticleBlock = fig({
  range: 2.4,
  xSpan: [-1, 8.4],
  ySpan: [-0.9, 5.9],
  items: [
    { t: 'seg', from: [-0.5, 0], to: [8, 0], color: 'muted', width: 2 },
    { t: 'param', x: '4.3301+3*cos(t)', y: '2.5+3*sin(t)', from: 0, to: TURN, color: 'muted', dashed: true },
    { t: 'poly', pts: [[0, 0], [2.6718, 0], [4.3301, 2.5]], color: 'a' },
    { t: 'poly', pts: [[0, 0], [5.9884, 0], [4.3301, 2.5]], color: 'b', look: 'outline' },
    { t: 'seg', from: [0, 0], to: [4.3301, 2.5], color: 'result', width: 2.6, label: 'b' },
    { t: 'seg', from: [4.3301, 2.5], to: [2.6718, 0], color: 'c', width: 2.6, label: 'a' },
    { t: 'seg', from: [4.3301, 2.5], to: [5.9884, 0], color: 'c', width: 2.6, label: 'a' },
    { t: 'angle', at: [0, 0], from: [1, 0], to: [4.3301, 2.5], label: '30°' },
    { t: 'point', at: [0, 0], label: 'A', color: 'muted' },
    { t: 'point', at: [4.3301, 2.5], label: 'C', color: 'muted' },
    { t: 'point', at: [2.6718, 0], label: 'B₁', color: 'result' },
    { t: 'point', at: [5.9884, 0], label: 'B₂', color: 'result' },
  ],
  caption: L(
    T`The ambiguous case with $A=30^\circ$, $b=5$ and $a=3$. The vertex $C$ is fixed. The unknown vertex $B$ is on the ray from $A$ at distance $a=3$ from $C$, that is, where the circle of radius $3$ around $C$ meets the ray: at two points, $B_1$ and $B_2$, so two triangles ($c\approx2.67$ and $c\approx5.99$).`,
    T`Kasus ambigu dengan $A=30^\circ$, $b=5$, dan $a=3$. Titik sudut $C$ tetap. Titik sudut $B$ yang belum diketahui berada pada sinar dari $A$ dengan jarak $a=3$ dari $C$, yaitu di tempat lingkaran berjari-jari $3$ di sekitar $C$ memotong sinar: di dua titik, $B_1$ dan $B_2$, sehingga ada dua segitiga ($c\approx2{,}67$ dan $c\approx5{,}99$).`,
  ),
})

/** The survey: L = 10 units (100 m), alpha = 60 degrees, beta = 70 degrees. */
const FIG_SURVEY: ArticleBlock = fig({
  range: 3.5,
  xSpan: [-1.2, 11.2],
  ySpan: [-1.3, 11.6],
  items: [
    { t: 'poly', pts: [[0, 0], [10, 0], [6.1334, 10.6234]], color: 'a' },
    { t: 'seg', from: [0, 0], to: [10, 0], color: 'b', width: 3.4, label: 'L' },
    { t: 'seg', from: [0, 0], to: [6.1334, 10.6234], color: 'c', width: 2.4 },
    { t: 'seg', from: [10, 0], to: [6.1334, 10.6234], color: 'c', width: 2.4 },
    { t: 'seg', from: [6.1334, 10.6234], to: [6.1334, 0], color: 'result', width: 2.2, dashed: true, label: 'h' },
    { t: 'right', at: [6.1334, 0], from: [0, 0], to: [6.1334, 10.6234] },
    { t: 'angle', at: [0, 0], from: [1, 0], to: [6.1334, 10.6234], label: 'α' },
    { t: 'angle', at: [10, 0], from: [0, 0], to: [6.1334, 10.6234], label: 'β' },
    { t: 'point', at: [0, 0], label: 'P', color: 'muted' },
    { t: 'point', at: [10, 0], label: 'Q', color: 'muted' },
    { t: 'point', at: [6.1334, 10.6234], label: 'T', color: 'result' },
  ],
  caption: L(
    T`Measuring across a river. Two observers $P$ and $Q$ stand a distance $L$ apart on one bank and read the angles $\alpha$ and $\beta$ to a tree $T$ on the other. The angle at $T$ is $180^\circ-\alpha-\beta$, the law of sines gives $PT=\frac{L\sin\beta}{\sin(\alpha+\beta)}$, and the width is $h=PT\sin\alpha$. (Drawn with $L=100$ m, $\alpha=60^\circ$ and $\beta=70^\circ$, where $h\approx106$ m.)`,
    T`Mengukur lebar sungai. Dua pengamat $P$ dan $Q$ berdiri berjarak $L$ di satu tepi dan membaca sudut $\alpha$ dan $\beta$ ke sebuah pohon $T$ di tepi seberang. Sudut di $T$ adalah $180^\circ-\alpha-\beta$, aturan sinus memberi $PT=\frac{L\sin\beta}{\sin(\alpha+\beta)}$, dan lebarnya $h=PT\sin\alpha$. (Digambar dengan $L=100$ m, $\alpha=60^\circ$, dan $\beta=70^\circ$, dengan $h\approx106$ m.)`,
  ),
})

/** The decision tree of the ambiguous case, as a table. */
const SSA_TABLE_EN = `| The angle $A$ | The side $a$ opposite it | Triangles |
|---|---|---|
| acute | $a<b\\sin A$ (too short to reach) | none |
| acute | $a=b\\sin A$ (just touches) | one, a right triangle |
| acute | $b\\sin A<a<b$ | **two** |
| acute | $a\\ge b$ | one |
| right or obtuse | $a>b$ | one |
| right or obtuse | $a\\le b$ | none |`
const SSA_TABLE_ID = `| Sudut $A$ | Sisi $a$ di depannya | Segitiga |
|---|---|---|
| lancip | $a<b\\sin A$ (terlalu pendek untuk mencapai) | tidak ada |
| lancip | $a=b\\sin A$ (hanya menyentuh) | satu, segitiga siku-siku |
| lancip | $b\\sin A<a<b$ | **dua** |
| lancip | $a\\ge b$ | satu |
| siku-siku atau tumpul | $a>b$ | satu |
| siku-siku atau tumpul | $a\\le b$ | tidak ada |`

export const body: ArticleBody = {
  answer: L(
    T`**The law of sines says that in every triangle each side divided by the sine of the opposite angle gives the same number, $\frac{a}{\sin A}=\frac{b}{\sin B}=\frac{c}{\sin C}$, and that number is the diameter $2R$ of the circle through the three vertices.** It solves a triangle once you know a side and its opposite angle, plus one more angle or side: two angles and a side give one triangle, while two sides and an angle opposite one of them give none, one or two. It also gives the area $\frac12ab\sin C$.`,
    T`**Aturan sinus mengatakan bahwa pada setiap segitiga tiap sisi dibagi sinus sudut di depannya memberi bilangan yang sama, $\frac{a}{\sin A}=\frac{b}{\sin B}=\frac{c}{\sin C}$, dan bilangan itu adalah diameter $2R$ lingkaran yang melalui ketiga titik sudut.** Ia memecahkan segitiga begitu kita tahu sebuah sisi dan sudut di depannya, ditambah satu sudut lagi atau satu sisi lagi: dua sudut dan satu sisi memberi satu segitiga, sedangkan dua sisi dan sudut di depan salah satunya dapat memberi nol, satu, atau dua. Ia juga memberi luas $\frac12ab\sin C$.`,
  ),

  keyPoints: [
    L(
      T`In a triangle with sides $a$, $b$, $c$ opposite the angles $A$, $B$, $C$, $\frac{a}{\sin A}=\frac{b}{\sin B}=\frac{c}{\sin C}$. It holds for every triangle, acute or obtuse, since $\sin(180^\circ-x)=\sin x$.`,
      T`Pada segitiga dengan sisi $a$, $b$, $c$ di depan sudut $A$, $B$, $C$, $\frac{a}{\sin A}=\frac{b}{\sin B}=\frac{c}{\sin C}$. Ia berlaku untuk setiap segitiga, lancip maupun tumpul, karena $\sin(180^\circ-x)=\sin x$.`,
    ),
    L(
      T`The proof is one altitude: $h=b\sin A=a\sin B$. The common value is the diameter of the circumscribed circle: $\frac{a}{\sin A}=2R$, because a diameter from $B$ makes a right triangle with the side $a$ as a leg.`,
      T`Buktinya satu garis tinggi: $h=b\sin A=a\sin B$. Nilai bersamanya adalah diameter lingkaran luar: $\frac{a}{\sin A}=2R$, karena diameter dari $B$ membentuk segitiga siku-siku dengan sisi $a$ sebagai salah satu sisi tegaknya.`,
    ),
    L(
      T`Two angles and any side (ASA or AAS) determine one triangle: find the third angle as $180^\circ-A-B$, then use $k=\frac{a}{\sin A}$ and $b=k\sin B$, $c=k\sin C$.`,
      T`Dua sudut dan sembarang sisi (ASA atau AAS) menentukan satu segitiga: cari sudut ketiga sebagai $180^\circ-A-B$, lalu pakai $k=\frac{a}{\sin A}$ dan $b=k\sin B$, $c=k\sin C$.`,
    ),
    L(
      T`Two sides and an angle opposite one of them (SSA) can give zero, one or two triangles. The sine of the unknown angle has two answers between $0^\circ$ and $180^\circ$, $B$ and $180^\circ-B$, and each is a triangle if it leaves room for the third angle.`,
      T`Dua sisi dan sudut di depan salah satunya (SSA) dapat memberi nol, satu, atau dua segitiga. Sinus sudut yang tak diketahui punya dua jawaban di antara $0^\circ$ dan $180^\circ$, yaitu $B$ dan $180^\circ-B$, dan masing-masing menjadi segitiga bila menyisakan ruang untuk sudut ketiga.`,
    ),
    L(
      T`The area is $\frac12ab\sin C$ with any pair of sides and the angle between them, and also $\frac{abc}{4R}$. Two angles and a side give it as $\frac{a^2\sin B\sin C}{2\sin A}$.`,
      T`Luasnya $\frac12ab\sin C$ dengan sepasang sisi dan sudut apitnya, dan juga $\frac{abc}{4R}$. Dua sudut dan satu sisi memberinya sebagai $\frac{a^2\sin B\sin C}{2\sin A}$.`,
    ),
    L(
      T`From a baseline $L$ and two angles to a far point, the law of sines gives its distance, but an error of one degree in a reading can move the answer by $5\%$ or by $25\%$ depending on the angle at the point: lines of sight that cross at nearly a right angle are the steadiest.`,
      T`Dari garis dasar $L$ dan dua sudut ke titik yang jauh, aturan sinus memberi jaraknya, tetapi galat satu derajat pada bacaan dapat menggeser jawaban sebesar $5\%$ atau $25\%$ tergantung sudut di titik itu: garis pandang yang berpotongan hampir siku-siku adalah yang paling stabil.`,
    ),
  ],

  sections: [
    /* ---------------------------------------------------------------------------------- what */
    {
      id: 'what-it-says',
      heading: L('What does the law of sines say?', 'Apa bunyi aturan sinus?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The law of sines says that in every triangle the ratio of a side to the sine of the angle opposite it is the same for all three sides: $\frac{a}{\sin A}=\frac{b}{\sin B}=\frac{c}{\sin C}$.** The letters follow one convention: $A$, $B$, $C$ are the angles, and $a$, $b$, $c$ the sides *opposite* them, so $a$ is the side across from $A$. Take the $3$-$4$-$5$ right triangle: the angle opposite the side $3$ is $36.87^\circ$, whose sine is $0.6$, and $\frac{3}{0.6}=5$; opposite $4$ is $53.13^\circ$ with sine $0.8$ and $\frac{4}{0.8}=5$; and opposite $5$ is the right angle, with sine $1$ and $\frac{5}{1}=5$. All three ratios are $5$.

It is usually written in one of three equivalent ways. As a chain of ratios (above). As proportions, $a:b:c=\sin A:\sin B:\sin C$, which says that the sides are in the same proportion as the sines of their opposite angles (not as the angles themselves). Or upside down, $\frac{\sin A}{a}=\frac{\sin B}{b}=\frac{\sin C}{c}$, which is the form to use when the unknown is an angle. It holds for obtuse triangles too, because the sine of an obtuse angle is positive and equals the sine of its supplement, $\sin(180^\circ-x)=\sin x$.

What it needs is a *pair*: a side together with the angle opposite it. Once you have one pair, any other side or angle gives you a second, and the equation can be solved for the missing one. This article shows why the law is true, what the common value means, how to use it in each case, and what goes wrong in one case, the ambiguous one. For solving a triangle in general, with the law of cosines as well, see [the article on triangles](article:triangles#solve-a-triangle).`,
            T`**Aturan sinus mengatakan bahwa pada setiap segitiga perbandingan sebuah sisi terhadap sinus sudut di depannya sama untuk ketiga sisi: $\frac{a}{\sin A}=\frac{b}{\sin B}=\frac{c}{\sin C}$.** Huruf-hurufnya mengikuti satu kesepakatan: $A$, $B$, $C$ adalah sudut, dan $a$, $b$, $c$ sisi *di depannya*, jadi $a$ adalah sisi yang berseberangan dengan $A$. Ambil segitiga siku-siku $3$-$4$-$5$: sudut di depan sisi $3$ adalah $36{,}87^\circ$, yang sinusnya $0{,}6$, dan $\frac{3}{0{,}6}=5$; di depan $4$ adalah $53{,}13^\circ$ dengan sinus $0{,}8$ dan $\frac{4}{0{,}8}=5$; dan di depan $5$ adalah sudut siku-siku, dengan sinus $1$ dan $\frac{5}{1}=5$. Ketiga perbandingan itu $5$.

Biasanya ia ditulis dalam salah satu dari tiga cara yang setara. Sebagai rantai perbandingan (di atas). Sebagai perbandingan senilai, $a:b:c=\sin A:\sin B:\sin C$, yang mengatakan bahwa sisi-sisinya berbanding sama dengan sinus sudut di depannya (bukan dengan sudutnya sendiri). Atau terbalik, $\frac{\sin A}{a}=\frac{\sin B}{b}=\frac{\sin C}{c}$, bentuk yang dipakai bila yang tak diketahui adalah sudut. Ia berlaku juga untuk segitiga tumpul, karena sinus sudut tumpul positif dan sama dengan sinus pelurusnya, $\sin(180^\circ-x)=\sin x$.

Yang diperlukannya adalah sebuah *pasangan*: sebuah sisi bersama sudut di depannya. Begitu ada satu pasangan, sisi atau sudut lain memberi pasangan kedua, dan persamaannya dapat diselesaikan untuk yang hilang. Artikel ini menunjukkan mengapa aturan itu benar, apa arti nilai bersamanya, bagaimana memakainya dalam tiap kasus, dan apa yang salah pada satu kasus, yang ambigu. Untuk memecahkan segitiga secara umum, dengan aturan kosinus juga, lihat [artikel tentang segitiga](article:triangles#solve-a-triangle).`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------------------------- proof */
    {
      id: 'proof-altitude',
      heading: L('Why is the law of sines true? A proof with one altitude', 'Mengapa aturan sinus benar? Bukti dengan satu garis tinggi'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The law of sines follows from writing the same altitude of the triangle in two ways.** Draw the altitude $h$ from $C$ down to the line $AB$. It splits the triangle into two right triangles that share the side $h$. In the one with the angle $A$ and hypotenuse $b$, the definition of the sine (see [the right triangle](article:basic-trigonometry#right-triangles)) gives $\sin A=\frac{h}{b}$, so $h=b\sin A$. In the one with the angle $B$ and hypotenuse $a$, $\sin B=\frac{h}{a}$, so $h=a\sin B$.

The two expressions are the same length, so $b\sin A=a\sin B$. Divide both sides by $\sin A\sin B$ and you get
$$\frac{a}{\sin A}=\frac{b}{\sin B}.$$
Draw an altitude from another vertex and the same argument ties $b$ and $c$, or $a$ and $c$, so all three ratios are equal.

If the angle at $A$ or at $B$ is obtuse, the foot of the altitude falls outside the side $AB$, on its extension, and the right triangle that contains $h$ has the angle $180^\circ-A$ instead of $A$. Nothing changes, because $\sin(180^\circ-A)=\sin A$. That is also why the law holds for every triangle, and it is the seed of the ambiguous case later: an angle and its supplement have the same sine.`,
            T`**Aturan sinus mengikuti dari penulisan garis tinggi segitiga yang sama dalam dua cara.** Gambar garis tinggi $h$ dari $C$ turun ke garis $AB$. Ia membelah segitiga menjadi dua segitiga siku-siku yang berbagi sisi $h$. Pada yang bersudut $A$ dan sisi miring $b$, definisi sinus (lihat [segitiga siku-siku](article:basic-trigonometry#right-triangles)) memberi $\sin A=\frac{h}{b}$, sehingga $h=b\sin A$. Pada yang bersudut $B$ dan sisi miring $a$, $\sin B=\frac{h}{a}$, sehingga $h=a\sin B$.

Kedua bentuk itu panjangnya sama, jadi $b\sin A=a\sin B$. Bagi kedua ruas dengan $\sin A\sin B$ dan diperoleh
$$\frac{a}{\sin A}=\frac{b}{\sin B}.$$
Gambar garis tinggi dari titik sudut lain dan argumen yang sama mengikat $b$ dan $c$, atau $a$ dan $c$, sehingga ketiga perbandingan sama.

Bila sudut di $A$ atau di $B$ tumpul, kaki garis tinggi jatuh di luar sisi $AB$, pada perpanjangannya, dan segitiga siku-siku yang memuat $h$ bersudut $180^\circ-A$ alih-alih $A$. Tak ada yang berubah, karena $\sin(180^\circ-A)=\sin A$. Itu juga sebabnya aturan ini berlaku untuk setiap segitiga, dan ia adalah benih kasus ambigu nanti: sebuah sudut dan pelurusnya memiliki sinus yang sama.`,
          ),
        },
        FIG_ALTITUDE,
      ],
    },

    /* ------------------------------------------------------------------------------ circumcircle */
    {
      id: 'circumcircle',
      heading: L('What is the common value of the three ratios? The circle through the vertices', 'Apa nilai bersama ketiga perbandingan itu? Lingkaran yang melalui titik-titik sudut'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The common value $\frac{a}{\sin A}=\frac{b}{\sin B}=\frac{c}{\sin C}$ is the diameter $2R$ of the circle that passes through the three vertices (the circumscribed circle), where $R$ is its radius.** To see why, draw that circle with centre $O$ and a diameter $BB'$ from the vertex $B$. Two facts about circles do the work. An angle that sits on a diameter is a right angle (Thales), so in the triangle $BCB'$ the angle at $C$ is $90^\circ$. And two angles that look at the same chord $BC$ from the same arc are equal, so the angle at $B'$ equals the angle $A$. In the right triangle $BCB'$ the side $BC=a$ is opposite the angle $B'=A$ and the hypotenuse is $BB'=2R$, hence
$$\sin A=\frac{a}{2R},\qquad\text{that is}\qquad\frac{a}{\sin A}=2R.$$
(If $A$ is obtuse, $B'$ is on the other arc and its angle is $180^\circ-A$, with the same sine.) The same argument works from any vertex, so all three ratios are $2R$.

This gives a formula for the circumradius, $R=\frac{a}{2\sin A}$, and a few quick consequences. In a right triangle with $C=90^\circ$, $\sin C=1$, so $c=2R$: the hypotenuse is a diameter, and the centre is the midpoint of the hypotenuse (the $3$-$4$-$5$ triangle has $R=2.5$). For the triangle with sides $13$, $14$, $15$, the angles are $53.13^\circ$, $59.49^\circ$ and $67.38^\circ$ and $\frac{13}{\sin53.13^\circ}=16.25$, so $R=8.125$. The centre of this circle, the circumcenter, is one of the triangle's four classical centres (see [the centres of a triangle](article:triangles#centers)).

Set two angles and a side below and read the three ratios, the circle and the area.`,
            T`**Nilai bersama $\frac{a}{\sin A}=\frac{b}{\sin B}=\frac{c}{\sin C}$ adalah diameter $2R$ lingkaran yang melalui ketiga titik sudut (lingkaran luar), dengan $R$ jari-jarinya.** Untuk melihat alasannya, gambar lingkaran itu dengan pusat $O$ dan diameter $BB'$ dari titik sudut $B$. Dua fakta tentang lingkaran bekerja di sini. Sudut yang bertumpu pada diameter adalah sudut siku-siku (Thales), jadi pada segitiga $BCB'$ sudut di $C$ adalah $90^\circ$. Dan dua sudut yang memandang tali busur $BC$ yang sama dari busur yang sama adalah sama besar, jadi sudut di $B'$ sama dengan sudut $A$. Pada segitiga siku-siku $BCB'$ sisi $BC=a$ berada di depan sudut $B'=A$ dan sisi miringnya $BB'=2R$, sehingga
$$\sin A=\frac{a}{2R},\qquad\text{yaitu}\qquad\frac{a}{\sin A}=2R.$$
(Bila $A$ tumpul, $B'$ berada pada busur yang lain dan sudutnya $180^\circ-A$, dengan sinus yang sama.) Argumen yang sama berlaku dari titik sudut mana pun, sehingga ketiga perbandingan adalah $2R$.

Ini memberi rumus jari-jari lingkaran luar, $R=\frac{a}{2\sin A}$, dan beberapa akibat cepat. Pada segitiga siku-siku dengan $C=90^\circ$, $\sin C=1$, jadi $c=2R$: sisi miring adalah diameter, dan pusatnya titik tengah sisi miring (segitiga $3$-$4$-$5$ memiliki $R=2{,}5$). Untuk segitiga bersisi $13$, $14$, $15$, sudutnya $53{,}13^\circ$, $59{,}49^\circ$, dan $67{,}38^\circ$ dan $\frac{13}{\sin53{,}13^\circ}=16{,}25$, sehingga $R=8{,}125$. Pusat lingkaran ini, pusat lingkaran luar, adalah salah satu dari empat titik penting klasik segitiga (lihat [titik-titik penting segitiga](article:triangles#centers)).

Atur dua sudut dan satu sisi di bawah dan baca ketiga perbandingan, lingkaran, dan luasnya.`,
          ),
        },
        FIG_CIRCLE,
        { kind: 'widget', name: 'lsratio' },
      ],
    },

    /* ---------------------------------------------------------------------------------- solving */
    {
      id: 'two-angles-and-a-side',
      heading: L('How do you solve a triangle when you know two angles and a side?', 'Bagaimana memecahkan segitiga bila dua sudut dan satu sisi diketahui?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**When two angles and any side are known (ASA or AAS), the triangle is completely determined: find the third angle from the angle sum, then use the law of sines for the other two sides.** The third angle is free, because the three angles of a triangle add up to $180^\circ$ (see [the angle sum](article:triangles#angle-sum)). After that there is always a side with its opposite angle, which is the pair the law needs.

1. **Third angle.** $C=180^\circ-A-B$. If this is not positive, there is no triangle.
2. **The common ratio.** Compute $k=\frac{a}{\sin A}$ from the side and angle you were given.
3. **The other sides.** $b=k\sin B$ and $c=k\sin C$.
4. **Check.** The longest side must be opposite the largest angle, and the three ratios must agree.

**Example.** $A=40^\circ$, $B=65^\circ$ and $a=12$. Then $C=180^\circ-40^\circ-65^\circ=75^\circ$ and $k=\frac{12}{\sin40^\circ}=18.6687$, so $b=18.6687\sin65^\circ=16.92$ and $c=18.6687\sin75^\circ=18.03$. The largest angle, $75^\circ$, is opposite the longest side, $18.03$, as it should be. The same triangle is described by ASA: given $A=40^\circ$, the side $c=18.03$ between the angles $A$ and $B$, and $B=65^\circ$, the same steps give the same sides.

Two practical points. Keep the full value of $k$ in your calculator, and use the *given* data, not a rounded result of an earlier step, so that errors do not pile up. And if you know only angles, the triangle is not determined: every triangle similar to it has the same angles, and one side sets the size.`,
            T`**Bila dua sudut dan sembarang sisi diketahui (ASA atau AAS), segitiga itu sepenuhnya ditentukan: cari sudut ketiga dari jumlah sudut, lalu pakai aturan sinus untuk dua sisi lainnya.** Sudut ketiga gratis, karena ketiga sudut segitiga berjumlah $180^\circ$ (lihat [jumlah sudut](article:triangles#angle-sum)). Sesudah itu selalu ada sebuah sisi dengan sudut di depannya, yaitu pasangan yang diperlukan aturan itu.

1. **Sudut ketiga.** $C=180^\circ-A-B$. Bila ini tidak positif, tak ada segitiga.
2. **Perbandingan bersama.** Hitung $k=\frac{a}{\sin A}$ dari sisi dan sudut yang diberikan.
3. **Sisi lainnya.** $b=k\sin B$ dan $c=k\sin C$.
4. **Periksa.** Sisi terpanjang harus berada di depan sudut terbesar, dan ketiga perbandingan harus sama.

**Contoh.** $A=40^\circ$, $B=65^\circ$, dan $a=12$. Maka $C=180^\circ-40^\circ-65^\circ=75^\circ$ dan $k=\frac{12}{\sin40^\circ}=18{,}6687$, sehingga $b=18{,}6687\sin65^\circ=16{,}92$ dan $c=18{,}6687\sin75^\circ=18{,}03$. Sudut terbesar, $75^\circ$, berada di depan sisi terpanjang, $18{,}03$, sebagaimana mestinya. Segitiga yang sama digambarkan oleh ASA: diberikan $A=40^\circ$, sisi $c=18{,}03$ di antara sudut $A$ dan $B$, dan $B=65^\circ$, langkah yang sama memberi sisi yang sama.

Dua hal praktis. Simpan nilai penuh $k$ di kalkulator, dan pakai data yang *diberikan*, bukan hasil bulatan dari langkah sebelumnya, agar galat tidak menumpuk. Dan bila hanya sudut yang diketahui, segitiga tidak tertentu: setiap segitiga yang sebangun dengannya memiliki sudut yang sama, dan satu sisi menetapkan ukurannya.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------------------------- SSA */
    {
      id: 'ambiguous-case',
      heading: L('Why do two sides and an angle sometimes give two triangles, or none?', 'Mengapa dua sisi dan satu sudut kadang memberi dua segitiga, atau tak satu pun?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Two sides and an angle opposite one of them (SSA) can give no triangle, one or two, because the sine of the unknown angle has two answers between $0^\circ$ and $180^\circ$, $B$ and $180^\circ-B$, and each one is a triangle only if it leaves room for the third angle.** Say $a$, $b$ and $A$ are given. The law of sines gives $\sin B=\frac{b\sin A}{a}$. Three things can happen.

- If $\frac{b\sin A}{a}>1$, no angle has that sine: **no triangle**. The side $a$ is too short to reach.
- If the value is exactly $1$, $B=90^\circ$: **one right triangle**.
- Otherwise there are two angles, $B_1=\arcsin\left(\frac{b\sin A}{a}\right)$ (the acute one, the only one that a calculator reports) and $B_2=180^\circ-B_1$ (obtuse). The second one is a triangle only if $A+B_2<180^\circ$.

The picture shows it. Put $A$ at the origin with a ray going right, and $C$ at distance $b$ from $A$ at the angle $A$. The unknown vertex $B$ is on the ray at distance $a$ from $C$: that is where the circle of radius $a$ around $C$ meets the ray. A circle and a ray can meet in $0$, $1$ or $2$ points, and the height of $C$ above the ray, $h=b\sin A$, decides which.

${SSA_TABLE_EN}

**Example.** $a=3$, $b=5$, $A=30^\circ$. The height is $h=5\sin30^\circ=2.5$, and $2.5<3<5$: two triangles. $\sin B=\frac{5\sin30^\circ}{3}=\frac56=0.8333$, so $B_1=56.44^\circ$ and $B_2=123.56^\circ$. For $B_1$: $C=180^\circ-30^\circ-56.44^\circ=93.56^\circ$ and $c=\frac{3\sin93.56^\circ}{\sin30^\circ}=5.99$. For $B_2$: $C=26.44^\circ$ and $c=2.67$. Both fit the data. With $a=9$, $b=5$ and $A=120^\circ$ (obtuse) only one triangle exists: $B=28.76^\circ$, $C=31.24^\circ$, $c=5.39$, since a second angle $B$ of $151.24^\circ$ would leave no room next to $120^\circ$. And $a=2$, $b=5$, $A=30^\circ$ is shorter than $h=2.5$: no triangle.

The ambiguity is exactly the equation $\sin B=c$ of [the article on trigonometric equations](article:trigonometric-equations#what-it-is): an inverse sine returns one angle, and the other is yours to find. Slide $a$ below and watch the circle.`,
            T`**Dua sisi dan sudut di depan salah satunya (SSA) dapat memberi tak ada segitiga, satu, atau dua, karena sinus sudut yang tak diketahui punya dua jawaban di antara $0^\circ$ dan $180^\circ$, yaitu $B$ dan $180^\circ-B$, dan masing-masing menjadi segitiga hanya bila menyisakan ruang untuk sudut ketiga.** Misalkan $a$, $b$, dan $A$ diberikan. Aturan sinus memberi $\sin B=\frac{b\sin A}{a}$. Tiga hal dapat terjadi.

- Bila $\frac{b\sin A}{a}>1$, tak ada sudut dengan sinus itu: **tidak ada segitiga**. Sisi $a$ terlalu pendek untuk mencapai.
- Bila nilainya tepat $1$, $B=90^\circ$: **satu segitiga siku-siku**.
- Selain itu ada dua sudut, $B_1=\arcsin\left(\frac{b\sin A}{a}\right)$ (yang lancip, satu-satunya yang dilaporkan kalkulator) dan $B_2=180^\circ-B_1$ (tumpul). Yang kedua menjadi segitiga hanya bila $A+B_2<180^\circ$.

Gambarnya menunjukkan hal itu. Letakkan $A$ di titik asal dengan sinar ke kanan, dan $C$ pada jarak $b$ dari $A$ dengan sudut $A$. Titik sudut $B$ yang belum diketahui berada pada sinar dengan jarak $a$ dari $C$: itulah tempat lingkaran berjari-jari $a$ di sekitar $C$ memotong sinar. Lingkaran dan sinar dapat bertemu di $0$, $1$, atau $2$ titik, dan tinggi $C$ di atas sinar, $h=b\sin A$, menentukan yang mana.

${SSA_TABLE_ID}

**Contoh.** $a=3$, $b=5$, $A=30^\circ$. Tingginya $h=5\sin30^\circ=2{,}5$, dan $2{,}5<3<5$: dua segitiga. $\sin B=\frac{5\sin30^\circ}{3}=\frac56=0{,}8333$, sehingga $B_1=56{,}44^\circ$ dan $B_2=123{,}56^\circ$. Untuk $B_1$: $C=180^\circ-30^\circ-56{,}44^\circ=93{,}56^\circ$ dan $c=\frac{3\sin93{,}56^\circ}{\sin30^\circ}=5{,}99$. Untuk $B_2$: $C=26{,}44^\circ$ dan $c=2{,}67$. Keduanya cocok dengan data. Dengan $a=9$, $b=5$, dan $A=120^\circ$ (tumpul) hanya ada satu segitiga: $B=28{,}76^\circ$, $C=31{,}24^\circ$, $c=5{,}39$, sebab sudut $B$ kedua sebesar $151{,}24^\circ$ tidak menyisakan ruang di samping $120^\circ$. Dan $a=2$, $b=5$, $A=30^\circ$ lebih pendek daripada $h=2{,}5$: tidak ada segitiga.

Ambiguitas itu persis persamaan $\sin B=c$ dalam [artikel tentang persamaan trigonometri](article:trigonometric-equations#what-it-is): sinus invers mengembalikan satu sudut, dan yang lain harus dicari sendiri. Geser $a$ di bawah dan lihat lingkarannya.`,
          ),
        },
        FIG_AMBIGUOUS,
        { kind: 'widget', name: 'lsambig' },
      ],
    },

    /* ------------------------------------------------------------------------------------ area */
    {
      id: 'area-from-sines',
      heading: L('How does the law of sines connect to the area of a triangle?', 'Bagaimana aturan sinus berhubungan dengan luas segitiga?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The area of a triangle is half the product of two sides and the sine of the angle between them, $K=\frac12ab\sin C$, and putting it together with the law of sines gives $K=\frac{abc}{4R}$.** The first formula is the altitude formula with the height written as $h=b\sin C$ instead of measured: area is $\frac12\times$ base $a$ $\times$ height $h$, and the height from $A$ is $b\sin C$. It holds for any pair, $K=\frac12bc\sin A=\frac12ac\sin B=\frac12ab\sin C$, which is a good check on a solved triangle.

Replace $\sin C$ by $\frac{c}{2R}$ (the law of sines) and it becomes $K=\frac12ab\cdot\frac{c}{2R}=\frac{abc}{4R}$, so the radius of the circle through the vertices is $R=\frac{abc}{4K}$. For the $13$, $14$, $15$ triangle the area is $84$ (see [the area of a triangle](article:triangles#perimeter-and-area)), so $R=\frac{13\cdot14\cdot15}{4\cdot84}=\frac{2730}{336}=8.125$, the same value as before. And $\frac12\cdot13\cdot14\cdot\sin67.38^\circ=84$ again.

When two angles and a side are known (AAS) you do not even need the other sides: $K=\frac{a^2\sin B\sin C}{2\sin A}$. For $A=40^\circ$, $B=65^\circ$, $a=12$ this is $\frac{144\cdot0.9063\cdot0.9659}{2\cdot0.6428}=98.06$, the same as $\frac12\cdot12\cdot16.92\cdot\sin75^\circ$. This is how a plot of land is measured from a baseline and angles.`,
            T`**Luas segitiga adalah setengah hasil kali dua sisi dan sinus sudut apitnya, $K=\frac12ab\sin C$, dan jika digabung dengan aturan sinus memberi $K=\frac{abc}{4R}$.** Rumus pertama adalah rumus garis tinggi dengan tinggi ditulis $h=b\sin C$ alih-alih diukur: luas adalah $\frac12\times$ alas $a$ $\times$ tinggi $h$, dan tinggi dari $A$ adalah $b\sin C$. Ia berlaku untuk pasangan mana pun, $K=\frac12bc\sin A=\frac12ac\sin B=\frac12ab\sin C$, yang merupakan pemeriksaan yang baik untuk segitiga yang sudah terpecahkan.

Ganti $\sin C$ dengan $\frac{c}{2R}$ (aturan sinus) dan ia menjadi $K=\frac12ab\cdot\frac{c}{2R}=\frac{abc}{4R}$, sehingga jari-jari lingkaran yang melalui titik-titik sudut adalah $R=\frac{abc}{4K}$. Untuk segitiga $13$, $14$, $15$ luasnya $84$ (lihat [luas segitiga](article:triangles#perimeter-and-area)), sehingga $R=\frac{13\cdot14\cdot15}{4\cdot84}=\frac{2730}{336}=8{,}125$, nilai yang sama seperti tadi. Dan $\frac12\cdot13\cdot14\cdot\sin67{,}38^\circ=84$ lagi.

Bila dua sudut dan satu sisi diketahui (AAS) kita bahkan tak memerlukan sisi lainnya: $K=\frac{a^2\sin B\sin C}{2\sin A}$. Untuk $A=40^\circ$, $B=65^\circ$, $a=12$ ini adalah $\frac{144\cdot0{,}9063\cdot0{,}9659}{2\cdot0{,}6428}=98{,}06$, sama dengan $\frac12\cdot12\cdot16{,}92\cdot\sin75^\circ$. Begitulah sebidang tanah diukur dari garis dasar dan sudut.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------------------- surveying */
    {
      id: 'measuring-across-a-river',
      heading: L('How do you measure the width of a river with the law of sines?', 'Bagaimana mengukur lebar sungai dengan aturan sinus?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To measure a distance you cannot walk, measure a baseline you can walk and two angles, and the law of sines does the rest; this is triangulation.** A tree $T$ stands on the far bank. On your bank you mark two points $P$ and $Q$ a known distance $L$ apart, and from each you read the angle between the baseline and the line of sight to the tree, $\alpha$ at $P$ and $\beta$ at $Q$. The three angles of the triangle $PQT$ add up to $180^\circ$, so the angle at the tree is $\gamma=180^\circ-\alpha-\beta$, and the law of sines pairs the side $L$ with the angle $\gamma$:
$$\frac{PT}{\sin\beta}=\frac{L}{\sin\gamma}\quad\Rightarrow\quad PT=\frac{L\sin\beta}{\sin(\alpha+\beta)},\qquad QT=\frac{L\sin\alpha}{\sin(\alpha+\beta)}.$$
(because $\sin\gamma=\sin(180^\circ-\alpha-\beta)=\sin(\alpha+\beta)$). The width of the river is the perpendicular distance from $T$ to the baseline, $h=PT\sin\alpha$.

**Example.** $L=100$ m, $\alpha=60^\circ$ and $\beta=70^\circ$. Then $\gamma=50^\circ$, $PT=\frac{100\sin70^\circ}{\sin50^\circ}=122.67$ m, $QT=\frac{100\sin60^\circ}{\sin50^\circ}=113.05$ m and the river is $h=122.67\sin60^\circ=106.23$ m wide. No one crossed the water.

**How good is the answer?** The angles are read with an instrument, and every reading is a little off. If each of the two angles may be wrong by $1^\circ$, the width above could be anywhere from $101.2$ m to $111.3$ m, about $5\%$ either way. The error depends on the shape of the triangle: with $\alpha=\beta=85^\circ$ the lines of sight are nearly parallel, the angle at the tree is only $10^\circ$ and the same $1^\circ$ error can change the answer by $25\%$; with $\alpha=\beta=45^\circ$, a right angle at the tree, it is only $3.6\%$. A surveyor therefore chooses the baseline so that the two lines of sight cross at a healthy angle, near $90^\circ$. The method is older than any instrument: Thales' shadow measurement used similar triangles, as in [the article on triangles](article:triangles#congruence-similarity), and triangulation uses angles instead of shadows. Try your own baseline and angles below.`,
            T`**Untuk mengukur jarak yang tak dapat dilalui, ukur garis dasar yang dapat dilalui dan dua sudut, dan aturan sinus mengerjakan sisanya; inilah triangulasi.** Sebuah pohon $T$ berdiri di tepi seberang. Di tepimu kamu menandai dua titik $P$ dan $Q$ yang berjarak $L$ yang diketahui, dan dari masing-masing kamu membaca sudut antara garis dasar dan garis pandang ke pohon, $\alpha$ di $P$ dan $\beta$ di $Q$. Ketiga sudut segitiga $PQT$ berjumlah $180^\circ$, sehingga sudut di pohon adalah $\gamma=180^\circ-\alpha-\beta$, dan aturan sinus memasangkan sisi $L$ dengan sudut $\gamma$:
$$\frac{PT}{\sin\beta}=\frac{L}{\sin\gamma}\quad\Rightarrow\quad PT=\frac{L\sin\beta}{\sin(\alpha+\beta)},\qquad QT=\frac{L\sin\alpha}{\sin(\alpha+\beta)}.$$
(karena $\sin\gamma=\sin(180^\circ-\alpha-\beta)=\sin(\alpha+\beta)$). Lebar sungai adalah jarak tegak lurus dari $T$ ke garis dasar, $h=PT\sin\alpha$.

**Contoh.** $L=100$ m, $\alpha=60^\circ$, dan $\beta=70^\circ$. Maka $\gamma=50^\circ$, $PT=\frac{100\sin70^\circ}{\sin50^\circ}=122{,}67$ m, $QT=\frac{100\sin60^\circ}{\sin50^\circ}=113{,}05$ m dan lebar sungai $h=122{,}67\sin60^\circ=106{,}23$ m. Tak seorang pun menyeberangi air.

**Seberapa baik jawabannya?** Sudutnya dibaca dengan alat, dan setiap bacaan sedikit meleset. Bila tiap dari kedua sudut boleh salah $1^\circ$, lebar di atas dapat berada di mana pun dari $101{,}2$ m sampai $111{,}3$ m, sekitar $5\%$ ke tiap arah. Galatnya bergantung pada bentuk segitiga: dengan $\alpha=\beta=85^\circ$ garis pandang hampir sejajar, sudut di pohon hanya $10^\circ$ dan galat $1^\circ$ yang sama dapat mengubah jawaban sebesar $25\%$; dengan $\alpha=\beta=45^\circ$, sudut siku-siku di pohon, hanya $3{,}6\%$. Karena itu seorang juru ukur memilih garis dasar sehingga kedua garis pandang berpotongan pada sudut yang sehat, dekat $90^\circ$. Metode ini lebih tua dari alat mana pun: pengukuran bayangan oleh Thales memakai segitiga sebangun, seperti dalam [artikel tentang segitiga](article:triangles#congruence-similarity), dan triangulasi memakai sudut alih-alih bayangan. Coba garis dasar dan sudutmu sendiri di bawah.`,
          ),
        },
        FIG_SURVEY,
        { kind: 'widget', name: 'lssurvey' },
      ],
    },

    /* ------------------------------------------------------------------------------ which law */
    {
      id: 'sines-or-cosines',
      heading: L('When do you use the law of sines and when the law of cosines?', 'Kapan memakai aturan sinus dan kapan aturan kosinus?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Use the law of sines when you know a side and its opposite angle (a pair), and the law of cosines when you do not.** Look at what the three given measurements are:

| You know | Is there a pair? | Start with |
|---|---|---|
| two angles and a side (ASA, AAS) | yes, after the third angle | law of sines |
| two sides and an angle opposite one (SSA) | yes | law of sines (check for two) |
| two sides and the angle between them (SAS) | no | law of cosines for the third side |
| three sides (SSS) | no | law of cosines for an angle |

The law of cosines, $c^2=a^2+b^2-2ab\cos C$, is the [Pythagorean theorem](article:pythagorean-theorem#generalizations) with a correction. It is the safer tool for finding an angle, since the arccosine returns a single angle between $0^\circ$ and $180^\circ$ and so tells acute from obtuse, while the arcsine cannot. A common plan for SAS: use the law of cosines for the third side, then find the *smaller* of the two other angles with the law of sines, because the smaller angle is always acute and the arcsine is then right.`,
            T`**Pakai aturan sinus bila kita tahu sebuah sisi dan sudut di depannya (sebuah pasangan), dan aturan kosinus bila tidak.** Lihat apa ketiga ukuran yang diberikan:

| Diketahui | Ada pasangan? | Mulai dengan |
|---|---|---|
| dua sudut dan satu sisi (ASA, AAS) | ya, setelah sudut ketiga | aturan sinus |
| dua sisi dan sudut di depan salah satunya (SSA) | ya | aturan sinus (periksa kemungkinan dua) |
| dua sisi dan sudut apitnya (SAS) | tidak | aturan kosinus untuk sisi ketiga |
| tiga sisi (SSS) | tidak | aturan kosinus untuk sebuah sudut |

Aturan kosinus, $c^2=a^2+b^2-2ab\cos C$, adalah [teorema Pythagoras](article:pythagorean-theorem#generalizations) dengan koreksi. Ia alat yang lebih aman untuk mencari sudut, karena arkus kosinus mengembalikan satu sudut di antara $0^\circ$ dan $180^\circ$ sehingga membedakan lancip dari tumpul, sedangkan arkus sinus tidak. Rencana yang umum untuk SAS: pakai aturan kosinus untuk sisi ketiga, lalu cari sudut yang *lebih kecil* dari dua sudut lainnya dengan aturan sinus, karena sudut yang lebih kecil selalu lancip dan arkus sinusnya lalu benar.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------------------------ code */
    {
      id: 'law-of-sines-in-code',
      heading: L('How do you use the law of sines in a program?', 'Bagaimana memakai aturan sinus dalam program?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A program solves AAS directly and has to treat SSA as a list: compute $\sin B$, return nothing if it is above $1$, and otherwise try both $B$ and $180^\circ-B$.** Three details. Convert degrees to radians before calling ´sin´. Do not call ´asin´ with a value that is $1.0000000000000002$ by rounding: allow a tiny margin and clamp. And keep the second angle only if the third, $180^\circ-A-B$, is positive. A program that returns the single acute $B$ silently loses the second triangle.

The programs below solve $A=40^\circ$, $B=65^\circ$, $a=12$ (giving $b=16.9196$ and $c=18.0326$), then $a=3$, $b=5$, $A=30^\circ$ (two triangles, $B=56.44^\circ$ and $B=123.56^\circ$), count the triangles for $a=2$ and for the obtuse case $a=9$, $b=5$, $A=120^\circ$, and finally find the river width $106.23$ m.`,
            T`**Program memecahkan AAS secara langsung dan harus memperlakukan SSA sebagai daftar: hitung $\sin B$, kembalikan kosong bila di atas $1$, dan selain itu coba $B$ maupun $180^\circ-B$.** Tiga hal. Ubah derajat ke radian sebelum memanggil ´sin´. Jangan memanggil ´asin´ dengan nilai yang $1{,}0000000000000002$ karena pembulatan: beri margin kecil dan batasi. Dan simpan sudut kedua hanya bila sudut ketiga, $180^\circ-A-B$, positif. Program yang hanya mengembalikan $B$ lancip yang tunggal diam-diam kehilangan segitiga kedua.

Program di bawah memecahkan $A=40^\circ$, $B=65^\circ$, $a=12$ (memberi $b=16{,}9196$ dan $c=18{,}0326$), lalu $a=3$, $b=5$, $A=30^\circ$ (dua segitiga, $B=56{,}44^\circ$ dan $B=123{,}56^\circ$), menghitung segitiga untuk $a=2$ dan untuk kasus tumpul $a=9$, $b=5$, $A=120^\circ$, dan akhirnya mencari lebar sungai $106{,}23$ m.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: AAS, the ambiguous SSA case and the river', 'Python: AAS, kasus ambigu SSA, dan sungai'),
          code: `import math


def solve_aas(A, B, a):
    """Two angles (degrees) and the side a opposite A: the sides and angles (a, b, c, A, B, C), or None."""
    C = 180 - A - B
    if min(A, B, C, a) <= 0:
        return None                                       # the angles leave nothing for the third
    k = a / math.sin(math.radians(A))                     # the common ratio, 2R
    return a, k * math.sin(math.radians(B)), k * math.sin(math.radians(C)), A, B, C


def solve_ssa(a, b, A):
    """Two sides and the angle A opposite a: a list with 0, 1 or 2 triangles (a, b, c, A, B, C)."""
    s = b * math.sin(math.radians(A)) / a                 # sin B
    if s > 1 + 1e-12:
        return []                                         # no angle has a sine above 1
    B1 = math.degrees(math.asin(min(1.0, s)))             # asin gives only the acute angle
    found = []
    for B in sorted({B1, 180 - B1}):                      # the other angle with the same sine
        C = 180 - A - B
        if C > 1e-9:                                      # it is a triangle only if something is left for C
            found.append((a, b, a * math.sin(math.radians(C)) / math.sin(math.radians(A)), A, B, C))
    return found


def river_width(L, alpha, beta):
    """Baseline L and the angles alpha, beta at its ends: the distance from the target to the baseline."""
    gamma = 180 - alpha - beta
    pt = L * math.sin(math.radians(beta)) / math.sin(math.radians(gamma))
    return pt * math.sin(math.radians(alpha))


print([round(x, 4) for x in solve_aas(40, 65, 12)])      # [12, 16.9196, 18.0326, 40, 65, 75]
for t in solve_ssa(3, 5, 30):
    print(round(t[4], 2), round(t[5], 2), round(t[2], 2))   # 56.44 93.56 5.99, then 123.56 26.44 2.67
print(len(solve_ssa(2, 5, 30)), len(solve_ssa(9, 5, 120)))  # 0 1
print(round(river_width(100, 60, 70), 2))                    # 106.23`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: the same three functions', 'JavaScript: tiga fungsi yang sama'),
          code: `const rad = (d) => (d * Math.PI) / 180
const deg = (r) => (r * 180) / Math.PI

function solveAas(A, B, a) {
  // two angles (degrees) and the side a opposite A: [a, b, c, A, B, C], or null
  const C = 180 - A - B
  if (Math.min(A, B, C, a) <= 0) return null                    // the angles leave nothing for the third
  const k = a / Math.sin(rad(A))                                // the common ratio, 2R
  return [a, k * Math.sin(rad(B)), k * Math.sin(rad(C)), A, B, C]
}

function solveSsa(a, b, A) {
  // two sides and the angle A opposite a: a list with 0, 1 or 2 triangles
  const s = (b * Math.sin(rad(A))) / a                          // sin B
  if (s > 1 + 1e-12) return []                                  // no angle has a sine above 1
  const B1 = deg(Math.asin(Math.min(1, s)))                     // asin gives only the acute angle
  const found = []
  for (const B of [...new Set([B1, 180 - B1])].sort((p, q) => p - q)) {   // the other angle with the same sine
    const C = 180 - A - B
    if (C > 1e-9) found.push([a, b, (a * Math.sin(rad(C))) / Math.sin(rad(A)), A, B, C])   // a triangle only if something is left for C
  }
  return found
}

function riverWidth(L, alpha, beta) {
  // baseline L and the angles alpha, beta at its ends: the distance from the target to the baseline
  const gamma = 180 - alpha - beta
  const pt = (L * Math.sin(rad(beta))) / Math.sin(rad(gamma))
  return pt * Math.sin(rad(alpha))
}

solveAas(40, 65, 12).map((x) => +x.toFixed(4))                  // [12, 16.9196, 18.0326, 40, 65, 75]
solveSsa(3, 5, 30).map((t) => [+t[4].toFixed(2), +t[5].toFixed(2), +t[2].toFixed(2)])   // [[56.44, 93.56, 5.99], [123.56, 26.44, 2.67]]
;[solveSsa(2, 5, 30).length, solveSsa(9, 5, 120).length]        // [0, 1]
+riverWidth(100, 60, 70).toFixed(2)                              // 106.23`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++: the same with <cmath>', 'C++: yang sama dengan <cmath>'),
          code: `#include <iostream>
#include <cstdio>
#include <cmath>
using namespace std;

const double PI = 3.14159265358979323846;
double rad(double d) { return d * PI / 180.0; }
double deg(double r) { return r * 180.0 / PI; }

double Bs[2], Cs[2], cs[2];                         // the triangles of the last solveSsa call

// Two sides and the angle A opposite a: fills Bs, Cs, cs and returns how many triangles (0, 1 or 2).
int solveSsa(double a, double b, double A) {
  double s = b * sin(rad(A)) / a;                   // sin B
  if (s > 1 + 1e-12) return 0;                      // no angle has a sine above 1
  if (s > 1) s = 1;
  double B1 = deg(asin(s));                         // asin gives only the acute angle
  int count = 0;
  for (int i = 0; i < 2; i++) {
    double B = i == 0 ? B1 : 180 - B1;              // the other angle with the same sine
    if (i == 1 && fabs(B - B1) < 1e-9) continue;
    double C = 180 - A - B;
    if (C > 1e-9) {                                 // a triangle only if something is left for C
      Bs[count] = B;
      Cs[count] = C;
      cs[count] = a * sin(rad(C)) / sin(rad(A));
      count++;
    }
  }
  return count;
}

double riverWidth(double L, double alpha, double beta) {
  double gamma = 180 - alpha - beta;
  double pt = L * sin(rad(beta)) / sin(rad(gamma));
  return pt * sin(rad(alpha));
}

int main() {
  double A = 40, B = 65, a = 12;                    // two angles and a side
  double C = 180 - A - B;
  double k = a / sin(rad(A));                       // the common ratio, 2R
  printf("%.4f %.4f %.0f\\n", k * sin(rad(B)), k * sin(rad(C)), C);
  int n = solveSsa(3, 5, 30);
  for (int i = 0; i < n; i++) printf("%.2f %.2f %.2f\\n", Bs[i], Cs[i], cs[i]);
  int none = solveSsa(2, 5, 30);
  int obtuse = solveSsa(9, 5, 120);
  printf("%d %d\\n", none, obtuse);
  printf("%.2f\\n", riverWidth(100, 60, 70));
  return 0;
}

/* output:
16.9196 18.0326 75
56.44 93.56 5.99
123.56 26.44 2.67
0 1
106.23
*/`,
        },
      ],
    },

    /* ---------------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where does the law of sines come from?', 'Dari mana aturan sinus berasal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The law of sines grew out of astronomy, was stated in its plane form by mathematicians writing in Arabic, and became the working tool of the surveyors who measured whole countries.**

- **10th to 13th century.** Mathematicians writing in Arabic, among them Abu al-Wafa, al-Jayyani and al-Tusi, state and prove the law of sines, first for triangles on a sphere (needed for astronomy and for the direction of Mecca) and then for plane triangles. Al-Tusi's treatise on the quadrilateral is the best-known source for the plane form.
- **1464.** Regiomontanus writes *De triangulis omnimodis* (printed in 1533), the first European book to treat triangles, with the law of sines, as a subject of its own and not as a chapter of astronomy.
- **1533.** Gemma Frisius describes triangulation, fixing the position of a point from a measured baseline and two angles.
- **1617.** Willebrord Snellius measures a degree of the meridian by a chain of triangles, the first measurement of the Earth by triangulation, in *Eratosthenes Batavus*.
- **From 1802.** The Great Trigonometrical Survey of India, begun by William Lambton, carries a chain of triangles across the subcontinent from the south to the Himalaya, with angles read by instruments and sides computed by the law of sines. In 1856 it announced the height of Peak XV, later called Everest, as about $8.8$ km.`,
            T`**Aturan sinus tumbuh dari astronomi, dinyatakan dalam bentuk bidangnya oleh para matematikawan yang menulis dalam bahasa Arab, dan menjadi alat kerja para juru ukur yang mengukur seluruh negeri.**

- **Abad ke-10 sampai ke-13.** Para matematikawan yang menulis dalam bahasa Arab, di antaranya Abu al-Wafa, al-Jayyani, dan al-Tusi, menyatakan dan membuktikan aturan sinus, pertama untuk segitiga pada bola (diperlukan untuk astronomi dan untuk arah Mekah) lalu untuk segitiga bidang. Risalah al-Tusi tentang segi empat adalah sumber paling terkenal untuk bentuk bidangnya.
- **1464.** Regiomontanus menulis *De triangulis omnimodis* (dicetak tahun 1533), buku Eropa pertama yang memperlakukan segitiga, dengan aturan sinus, sebagai pokok bahasan tersendiri dan bukan sebagai bab astronomi.
- **1533.** Gemma Frisius menguraikan triangulasi, menetapkan posisi sebuah titik dari garis dasar yang diukur dan dua sudut.
- **1617.** Willebrord Snellius mengukur satu derajat meridian dengan rantai segitiga, pengukuran Bumi pertama dengan triangulasi, dalam *Eratosthenes Batavus*.
- **Mulai 1802.** Survei Trigonometri Agung India, dimulai oleh William Lambton, membawa rantai segitiga melintasi anak benua dari selatan sampai Himalaya, dengan sudut dibaca oleh alat dan sisi dihitung dengan aturan sinus. Pada 1856 ia mengumumkan tinggi Puncak XV, yang kemudian disebut Everest, sekitar $8{,}8$ km.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What are the common mistakes with the law of sines?', 'Apa kesalahan umum pada aturan sinus?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with the law of sines are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ $\frac{a}{\sin B}=\frac{b}{\sin A}$ (a side with the wrong angle) | Each side goes with the angle *opposite* it: $\frac{a}{\sin A}=\frac{b}{\sin B}$. |
| ❌ $\frac{a}{A}=\frac{b}{B}$ (the angles themselves) | Sides are proportional to the *sines* of the angles, not to the angles. |
| ❌ Take only $B=\arcsin\left(\frac{b\sin A}{a}\right)$ and stop | The other angle is $180^\circ-B$, and it may give a second triangle. |
| ❌ Keep $B=180^\circ-B_1$ without checking | It is a triangle only if $A+B_2<180^\circ$. |
| ❌ Go on when $\sin B$ comes out above $1$ | No angle has such a sine: there is no triangle. |
| ❌ Use the law of sines for SAS or SSS | There is no known side–angle pair: use the law of cosines first. |
| ❌ The longest side is opposite the smallest angle | It is opposite the *largest* angle. |
| ❌ Round $k$ or $b$ and then use it to find $c$ | Use the given data and keep full precision until the end. |
| ❌ Calculator in radian mode with degree data | Set degrees (or convert), or every sine is wrong. |`,
            T`**Kesalahan paling umum pada aturan sinus adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ $\frac{a}{\sin B}=\frac{b}{\sin A}$ (sisi dengan sudut yang salah) | Tiap sisi berpasangan dengan sudut *di depannya*: $\frac{a}{\sin A}=\frac{b}{\sin B}$. |
| ❌ $\frac{a}{A}=\frac{b}{B}$ (sudutnya sendiri) | Sisi sebanding dengan *sinus* sudut, bukan dengan sudutnya. |
| ❌ Hanya mengambil $B=\arcsin\left(\frac{b\sin A}{a}\right)$ lalu berhenti | Sudut lainnya adalah $180^\circ-B$, dan ia dapat memberi segitiga kedua. |
| ❌ Menyimpan $B=180^\circ-B_1$ tanpa memeriksa | Ia segitiga hanya bila $A+B_2<180^\circ$. |
| ❌ Melanjutkan ketika $\sin B$ lebih dari $1$ | Tak ada sudut dengan sinus seperti itu: tidak ada segitiga. |
| ❌ Memakai aturan sinus untuk SAS atau SSS | Tak ada pasangan sisi–sudut yang diketahui: pakai aturan kosinus dulu. |
| ❌ Sisi terpanjang berada di depan sudut terkecil | Ia berada di depan sudut *terbesar*. |
| ❌ Membulatkan $k$ atau $b$ lalu memakainya untuk mencari $c$ | Pakai data yang diberikan dan simpan ketelitian penuh sampai akhir. |
| ❌ Kalkulator mode radian dengan data derajat | Atur ke derajat (atau ubah), kalau tidak setiap sinus salah. |`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------------- practice */
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
              L(T`In every triangle, $\frac{a}{\sin A}=\frac{b}{\sin B}=\frac{c}{\sin C}$.`, T`Pada setiap segitiga, $\frac{a}{\sin A}=\frac{b}{\sin B}=\frac{c}{\sin C}$.`),
              L(T`The law of sines needs a side and the angle opposite it to be known.`, T`Aturan sinus memerlukan sebuah sisi dan sudut di depannya diketahui.`),
              L(T`Two angles and any one side determine exactly one triangle.`, T`Dua sudut dan satu sisi sembarang menentukan tepat satu segitiga.`),
              L(T`The law of sines works only for acute triangles.`, T`Aturan sinus hanya berlaku untuk segitiga lancip.`),
              L(T`Two sides and an angle opposite one of them always give exactly one triangle.`, T`Dua sisi dan sudut di depan salah satunya selalu memberi tepat satu segitiga.`),
              L(T`With two sides and the angle between them, the law of sines alone solves the triangle.`, T`Dengan dua sisi dan sudut apitnya, aturan sinus saja memecahkan segitiganya.`),
            ],
            answer: [true, true, true, false, false, false],
            explain: L(
              T`The law holds for every triangle, since $\sin(180^\circ-x)=\sin x$. SSA can give $0$, $1$ or $2$ triangles. With SAS there is no side–angle pair, so you start with the law of cosines.`,
              T`Aturan itu berlaku untuk setiap segitiga, karena $\sin(180^\circ-x)=\sin x$. SSA dapat memberi $0$, $1$, atau $2$ segitiga. Dengan SAS tak ada pasangan sisi–sudut, jadi kita mulai dengan aturan kosinus.`,
            ),
            hint: L(T`Ask whether each situation gives you a pair of a side and its opposite angle, and remember what the sine of an obtuse angle is.`, T`Tanyakan apakah tiap keadaan memberi pasangan sebuah sisi dan sudut di depannya, dan ingat berapa sinus sudut tumpul.`),
          },
        },
        {
          kind: 'activity',
          title: L('A side from the ratio', 'Sebuah sisi dari perbandingan'),
          step: {
            kind: 'math',
            id: 'p2',
            hints: [L(T`$\frac{a}{\sin A}=\frac{b}{\sin B}$, so $b=\frac{a\sin B}{\sin A}$.`, T`$\frac{a}{\sin A}=\frac{b}{\sin B}$, sehingga $b=\frac{a\sin B}{\sin A}$.`), L(T`$\frac{6\cdot0.5}{0.3}$.`, T`$\frac{6\cdot0{,}5}{0{,}3}$.`)],
            explain: L(T`$b=\frac{6\cdot0.5}{0.3}=10$.`, T`$b=\frac{6\cdot0{,}5}{0{,}3}=10$.`),
            prompt: L(T`In a triangle $a=6$, $\sin A=0.3$ and $\sin B=0.5$. What is $b$?`, T`Pada sebuah segitiga $a=6$, $\sin A=0{,}3$, dan $\sin B=0{,}5$. Berapa $b$?`),
            given: String.raw`b=v`,
            blanks: [{ label: 'b =', answer: 10 }],
          },
        },
        {
          kind: 'activity',
          title: L('The circumradius', 'Jari-jari lingkaran luar'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L(T`$\frac{a}{\sin A}=2R$.`, T`$\frac{a}{\sin A}=2R$.`), L(T`$\sin30^\circ=\frac12$, so $2R=\frac{10}{1/2}$.`, T`$\sin30^\circ=\frac12$, sehingga $2R=\frac{10}{1/2}$.`)],
            explain: L(T`$2R=\frac{10}{\sin30^\circ}=20$, so $R=10$.`, T`$2R=\frac{10}{\sin30^\circ}=20$, jadi $R=10$.`),
            prompt: L(T`A triangle has a side $a=10$ opposite an angle $A=30^\circ$. What is the radius $R$ of the circle through its vertices?`, T`Sebuah segitiga memiliki sisi $a=10$ di depan sudut $A=30^\circ$. Berapa jari-jari $R$ lingkaran yang melalui titik-titik sudutnya?`),
            given: String.raw`R=v`,
            blanks: [{ label: 'R =', answer: 10 }],
          },
        },
        {
          kind: 'activity',
          title: L('The angle at the tree', 'Sudut di pohon'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L(T`The three angles of triangle $PQT$ add up to $180^\circ$.`, T`Ketiga sudut segitiga $PQT$ berjumlah $180^\circ$.`), L(T`$180-60-70$.`, T`$180-60-70$.`)],
            explain: L(T`$\gamma=180^\circ-60^\circ-70^\circ=50^\circ$.`, T`$\gamma=180^\circ-60^\circ-70^\circ=50^\circ$.`),
            prompt: L(T`Two observers read the angles $60^\circ$ and $70^\circ$ between their baseline and the lines of sight to a tree on the far bank. What is the angle at the tree, in degrees?`, T`Dua pengamat membaca sudut $60^\circ$ dan $70^\circ$ antara garis dasar dan garis pandang ke pohon di tepi seberang. Berapa sudut di pohon, dalam derajat?`),
            given: String.raw`g=v`,
            blanks: [{ label: 'g =', answer: 50 }],
          },
        },
        {
          kind: 'activity',
          title: L('How many triangles? (1)', 'Berapa segitiga? (1)'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [L(T`The height is $h=b\sin A=10\sin30^\circ=5$.`, T`Tingginya $h=b\sin A=10\sin30^\circ=5$.`), L(T`Compare $a=7$ with $h=5$ and $b=10$.`, T`Bandingkan $a=7$ dengan $h=5$ dan $b=10$.`)],
            explain: L(T`$h=5<a=7<b=10$ with an acute $A$: two triangles.`, T`$h=5<a=7<b=10$ dengan $A$ lancip: dua segitiga.`),
            prompt: L(T`How many triangles have $a=7$, $b=10$ and $A=30^\circ$?`, T`Berapa banyak segitiga yang memiliki $a=7$, $b=10$, dan $A=30^\circ$?`),
            given: String.raw`k=v`,
            blanks: [{ label: 'k =', answer: 2 }],
          },
        },
        {
          kind: 'activity',
          title: L('How many triangles? (2)', 'Berapa segitiga? (2)'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L(T`The height is $h=10\sin30^\circ=5$.`, T`Tingginya $h=10\sin30^\circ=5$.`), L(T`Is $a=4$ long enough to reach the ray?`, T`Apakah $a=4$ cukup panjang untuk mencapai sinar?`)],
            explain: L(T`$a=4<h=5$: the circle around $C$ never reaches the ray, so there is no triangle.`, T`$a=4<h=5$: lingkaran di sekitar $C$ tak pernah mencapai sinar, jadi tak ada segitiga.`),
            prompt: L(T`How many triangles have $a=4$, $b=10$ and $A=30^\circ$?`, T`Berapa banyak segitiga yang memiliki $a=4$, $b=10$, dan $A=30^\circ$?`),
            given: String.raw`k=v`,
            blanks: [{ label: 'k =', answer: 0 }],
          },
        },
        {
          kind: 'activity',
          title: L('How many triangles? (3)', 'Berapa segitiga? (3)'),
          step: {
            kind: 'math',
            id: 'p7',
            hints: [L(T`$A=120^\circ$ is obtuse: only a side $a$ longer than $b$ works.`, T`$A=120^\circ$ tumpul: hanya sisi $a$ yang lebih panjang daripada $b$ yang berlaku.`), L(T`Compare $a=9$ with $b=5$.`, T`Bandingkan $a=9$ dengan $b=5$.`)],
            explain: L(T`The side opposite the obtuse angle is the longest, and $9>5$: exactly one triangle.`, T`Sisi di depan sudut tumpul adalah yang terpanjang, dan $9>5$: tepat satu segitiga.`),
            prompt: L(T`How many triangles have $a=9$, $b=5$ and $A=120^\circ$?`, T`Berapa banyak segitiga yang memiliki $a=9$, $b=5$, dan $A=120^\circ$?`),
            given: String.raw`k=v`,
            blanks: [{ label: 'k =', answer: 1 }],
          },
        },
        {
          kind: 'activity',
          title: L('The area', 'Luas'),
          step: {
            kind: 'math',
            id: 'p8',
            hints: [L(T`$K=\frac12ab\sin C$.`, T`$K=\frac12ab\sin C$.`), L(T`$\sin30^\circ=\frac12$.`, T`$\sin30^\circ=\frac12$.`)],
            explain: L(T`$K=\frac12\cdot10\cdot8\cdot\sin30^\circ=\frac12\cdot80\cdot\frac12=20$.`, T`$K=\frac12\cdot10\cdot8\cdot\sin30^\circ=\frac12\cdot80\cdot\frac12=20$.`),
            prompt: L(T`Two sides of a triangle are $10$ and $8$ and the angle between them is $30^\circ$. What is its area?`, T`Dua sisi sebuah segitiga adalah $10$ dan $8$ dan sudut apitnya $30^\circ$. Berapa luasnya?`),
            given: String.raw`K=v`,
            blanks: [{ label: 'K =', answer: 20 }],
          },
        },
        {
          kind: 'activity',
          title: L('Which law first?', 'Aturan mana dulu?'),
          step: {
            kind: 'quiz',
            id: 'p9',
            prompt: L(T`You know the sides $a$ and $b$ and the angle $C$ between them. Which do you use first?`, T`Kamu tahu sisi $a$ dan $b$ dan sudut apit $C$. Mana yang dipakai pertama?`),
            options: [L('the law of sines', 'aturan sinus'), L('the law of cosines', 'aturan kosinus'), L('the angle sum', 'jumlah sudut'), L('Heron\'s formula', 'rumus Heron')],
            answer: 1,
            explain: L('There is no side with a known opposite angle, so the law of sines has nothing to start from. The law of cosines gives the third side from $a$, $b$ and $C$.', 'Tak ada sisi dengan sudut di depan yang diketahui, jadi aturan sinus tak punya titik awal. Aturan kosinus memberi sisi ketiga dari $a$, $b$, dan $C$.'),
            hint: L('The law of sines needs a side together with its opposite angle.', 'Aturan sinus memerlukan sebuah sisi bersama sudut di depannya.'),
          },
        },
        {
          kind: 'activity',
          title: L('Where can you start with the law of sines?', 'Di mana kita dapat mulai dengan aturan sinus?'),
          step: {
            kind: 'multi',
            id: 'p10',
            prompt: L('Which sets of data let you start with the law of sines? Choose **all** that apply.', 'Kumpulan data mana yang memungkinkan kita mulai dengan aturan sinus? Pilih **semua** yang benar.'),
            options: [L('two angles and the side between them (ASA)', 'dua sudut dan sisi di antaranya (ASA)'), L('three sides (SSS)', 'tiga sisi (SSS)'), L('two angles and a side opposite one of them (AAS)', 'dua sudut dan sisi di depan salah satunya (AAS)'), L('two sides and the angle between them (SAS)', 'dua sisi dan sudut apitnya (SAS)'), L('two sides and an angle opposite one of them (SSA)', 'dua sisi dan sudut di depan salah satunya (SSA)')],
            answer: [0, 2, 4],
            explain: L('ASA and AAS give a pair once the third angle is found, and SSA already contains one. SSS and SAS contain no side with its opposite angle.', 'ASA dan AAS memberi pasangan setelah sudut ketiga ditemukan, dan SSA sudah memuatnya. SSS dan SAS tak memuat sisi dengan sudut di depannya.'),
            hint: L('Look for a side with its opposite angle, either given or one step away.', 'Cari sebuah sisi dengan sudut di depannya, entah diberikan atau berjarak satu langkah.'),
          },
        },
        {
          kind: 'activity',
          title: L('Order the solution', 'Urutkan penyelesaiannya'),
          step: {
            kind: 'order',
            id: 'p11',
            prompt: L('Put the steps of solving a triangle from two angles and a side in order.', 'Urutkan langkah memecahkan segitiga dari dua sudut dan satu sisi.'),
            lines: {
              en: ['Find the third angle: C = 180° − A − B', 'Compute the common ratio k = a / sin A', 'Find the other sides: b = k sin B and c = k sin C', 'Check: the longest side is opposite the largest angle'],
              id: ['Cari sudut ketiga: C = 180° − A − B', 'Hitung perbandingan bersama k = a / sin A', 'Cari sisi lainnya: b = k sin B dan c = k sin C', 'Periksa: sisi terpanjang berada di depan sudut terbesar'],
            },
            explain: L(T`You need all three angles before the ratio makes sense, and the ratio before the sides.`, T`Kita memerlukan ketiga sudut sebelum perbandingan itu bermakna, dan perbandingan sebelum sisi-sisinya.`),
            hint: L(T`The angle sum comes first; the check comes last.`, T`Jumlah sudut datang pertama; pemeriksaan datang terakhir.`),
          },
        },
        {
          kind: 'activity',
          title: L('Fill in the ratio', 'Isi perbandingannya'),
          step: {
            kind: 'fill',
            id: 'p12',
            prompt: L('Complete the law of sines.', 'Lengkapi aturan sinus.'),
            template: {
              en: 'a / sin A = b / sin ___ = c / sin ___',
              id: 'a / sin A = b / sin ___ = c / sin ___',
            },
            blanks: { en: ['B', 'C'], id: ['B', 'C'] },
            explain: L(T`Each side is paired with the sine of the angle opposite it: $b$ with $B$ and $c$ with $C$.`, T`Tiap sisi dipasangkan dengan sinus sudut di depannya: $b$ dengan $B$ dan $c$ dengan $C$.`),
            hint: L(T`The side $a$ is opposite the angle $A$; the same naming holds for the other two.`, T`Sisi $a$ berada di depan sudut $A$; penamaan yang sama berlaku untuk dua lainnya.`),
          },
        },
      ],
    },

    /* --------------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: the law of sines at a glance', 'Ringkasan: aturan sinus sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **The law:** $\frac{a}{\sin A}=\frac{b}{\sin B}=\frac{c}{\sin C}$, with each side opposite its angle; true for every triangle, since $\sin(180^\circ-x)=\sin x$.
- **Why:** the altitude is $h=b\sin A=a\sin B$; the common value is the diameter $2R$ of the circle through the vertices.
- **ASA and AAS:** $C=180^\circ-A-B$, then $k=\frac{a}{\sin A}$, $b=k\sin B$, $c=k\sin C$; one triangle.
- **SSA:** $\sin B=\frac{b\sin A}{a}$ has two answers, $B$ and $180^\circ-B$; with $h=b\sin A$ and an acute $A$: $a<h$ none, $a=h$ one right, $h<a<b$ two, $a\ge b$ one; with an obtuse $A$: $a>b$ one, otherwise none.
- **Area:** $K=\frac12ab\sin C=\frac{abc}{4R}$; with AAS, $K=\frac{a^2\sin B\sin C}{2\sin A}$.
- **Surveying:** baseline $L$ and angles $\alpha$, $\beta$ give $PT=\frac{L\sin\beta}{\sin(\alpha+\beta)}$ and the width $h=PT\sin\alpha$; lines of sight that cross near a right angle are steadiest.
- **Which law:** a side with its opposite angle, use sines; SAS and SSS, use cosines first.`,
            T`- **Aturannya:** $\frac{a}{\sin A}=\frac{b}{\sin B}=\frac{c}{\sin C}$, dengan tiap sisi di depan sudutnya; benar untuk setiap segitiga, karena $\sin(180^\circ-x)=\sin x$.
- **Mengapa:** garis tinggi $h=b\sin A=a\sin B$; nilai bersamanya adalah diameter $2R$ lingkaran yang melalui titik-titik sudut.
- **ASA dan AAS:** $C=180^\circ-A-B$, lalu $k=\frac{a}{\sin A}$, $b=k\sin B$, $c=k\sin C$; satu segitiga.
- **SSA:** $\sin B=\frac{b\sin A}{a}$ punya dua jawaban, $B$ dan $180^\circ-B$; dengan $h=b\sin A$ dan $A$ lancip: $a<h$ tidak ada, $a=h$ satu siku-siku, $h<a<b$ dua, $a\ge b$ satu; dengan $A$ tumpul: $a>b$ satu, selain itu tidak ada.
- **Luas:** $K=\frac12ab\sin C=\frac{abc}{4R}$; dengan AAS, $K=\frac{a^2\sin B\sin C}{2\sin A}$.
- **Survei:** garis dasar $L$ dan sudut $\alpha$, $\beta$ memberi $PT=\frac{L\sin\beta}{\sin(\alpha+\beta)}$ dan lebar $h=PT\sin\alpha$; garis pandang yang berpotongan dekat sudut siku-siku paling stabil.
- **Aturan mana:** sisi dengan sudut di depannya, pakai sinus; SAS dan SSS, pakai kosinus lebih dulu.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Law of sines', 'Aturan sinus'), definition: L('The rule that in every triangle each side divided by the sine of the opposite angle gives the same number, which is the diameter of the circle through the three vertices.', 'Aturan bahwa pada setiap segitiga tiap sisi dibagi sinus sudut di depannya memberi bilangan yang sama, yaitu diameter lingkaran yang melalui ketiga titik sudut.') },
    { term: L('Opposite angle', 'Sudut di depan'), definition: L('The angle across the triangle from a given side, the one whose vertex is not an end of that side; side a is opposite angle A.', 'Sudut yang berseberangan dengan sebuah sisi, yang titik sudutnya bukan ujung sisi itu; sisi a berada di depan sudut A.') },
    { term: L('Circumscribed circle', 'Lingkaran luar'), definition: L('The circle that passes through all three vertices of a triangle; its radius R satisfies a over sin A equal to 2R.', 'Lingkaran yang melalui ketiga titik sudut sebuah segitiga; jari-jarinya R memenuhi a per sin A sama dengan 2R.') },
    { term: L('ASA and AAS', 'ASA dan AAS'), definition: L('The cases in which two angles and a side of a triangle are known, which determine exactly one triangle.', 'Kasus ketika dua sudut dan satu sisi segitiga diketahui, yang menentukan tepat satu segitiga.') },
    { term: L('Ambiguous case (SSA)', 'Kasus ambigu (SSA)'), definition: L('The case in which two sides and an angle opposite one of them are known, which can fit no triangle, one triangle or two triangles.', 'Kasus ketika dua sisi dan sudut di depan salah satunya diketahui, yang dapat cocok dengan tak ada segitiga, satu segitiga, atau dua segitiga.') },
    { term: L('Supplementary angles', 'Sudut berpelurus'), definition: L('Two angles that add up to 180 degrees; they have the same sine, which is why the law of sines can give two answers.', 'Dua sudut yang berjumlah 180 derajat; keduanya memiliki sinus yang sama, itulah sebabnya aturan sinus dapat memberi dua jawaban.') },
    { term: L('Baseline', 'Garis dasar'), definition: L('A measured distance between two observation points, from which the distance to a faraway point is found with two angles.', 'Jarak terukur antara dua titik pengamatan, yang dari sana jarak ke titik yang jauh dicari dengan dua sudut.') },
    { term: L('Triangulation', 'Triangulasi'), definition: L('Finding the position of a point, or a distance, by measuring a baseline and the angles to the point and solving the triangle with the law of sines.', 'Mencari posisi sebuah titik, atau jarak, dengan mengukur garis dasar dan sudut-sudut ke titik itu dan memecahkan segitiganya dengan aturan sinus.') },
  ],

  howTo: [
    {
      name: L('How to solve a triangle from two angles and a side', 'Cara memecahkan segitiga dari dua sudut dan satu sisi'),
      description: L('Find the third angle, then use the common ratio of the law of sines for the two missing sides.', 'Cari sudut ketiga, lalu pakai perbandingan bersama aturan sinus untuk kedua sisi yang hilang.'),
      steps: [
        { name: L('Find the third angle', 'Cari sudut ketiga'), text: L('Subtract the two known angles from 180 degrees. If the result is not positive, there is no triangle.', 'Kurangkan kedua sudut yang diketahui dari 180 derajat. Bila hasilnya tidak positif, tak ada segitiga.') },
        { name: L('Compute the common ratio', 'Hitung perbandingan bersama'), text: L('Divide the known side by the sine of its opposite angle to get k.', 'Bagi sisi yang diketahui dengan sinus sudut di depannya untuk mendapat k.') },
        { name: L('Find the other two sides', 'Cari dua sisi lainnya'), text: L('Multiply k by the sine of each remaining angle to get the sides opposite them.', 'Kalikan k dengan sinus tiap sudut yang tersisa untuk mendapat sisi di depannya.') },
        { name: L('Check the result', 'Periksa hasilnya'), text: L('The longest side must be opposite the largest angle, and the three ratios must agree.', 'Sisi terpanjang harus berada di depan sudut terbesar, dan ketiga perbandingan harus sama.') },
      ],
    },
    {
      name: L('How to solve the ambiguous case with two sides and an angle', 'Cara memecahkan kasus ambigu dengan dua sisi dan satu sudut'),
      description: L('Find sin B, take both angles with that sine, and keep each that leaves room for the third angle.', 'Cari sin B, ambil kedua sudut dengan sinus itu, dan simpan yang menyisakan ruang untuk sudut ketiga.'),
      steps: [
        { name: L('Compute sin B', 'Hitung sin B'), text: L('Use sin B equals b sin A over a. If it is above 1, there is no triangle.', 'Pakai sin B sama dengan b sin A per a. Bila di atas 1, tak ada segitiga.') },
        { name: L('Take both angles', 'Ambil kedua sudut'), text: L('Let B1 be the acute angle with that sine and B2 be 180 degrees minus B1.', 'Misalkan B1 sudut lancip dengan sinus itu dan B2 adalah 180 derajat dikurangi B1.') },
        { name: L('Keep the ones that fit', 'Simpan yang cocok'), text: L('For each B, the third angle is 180 minus A minus B. Keep it only if that is positive.', 'Untuk tiap B, sudut ketiga adalah 180 dikurangi A dikurangi B. Simpan hanya bila positif.') },
        { name: L('Find the third side', 'Cari sisi ketiga'), text: L('For each triangle kept, find c as a sin C over sin A.', 'Untuk tiap segitiga yang disimpan, cari c sebagai a sin C per sin A.') },
      ],
    },
    {
      name: L('How to find the distance across a river with two angles', 'Cara mencari jarak menyeberangi sungai dengan dua sudut'),
      description: L('Measure a baseline on one bank and the angles to a point on the other, then solve the triangle with the law of sines.', 'Ukur garis dasar di satu tepi dan sudut ke sebuah titik di tepi lain, lalu pecahkan segitiganya dengan aturan sinus.'),
      steps: [
        { name: L('Measure the baseline', 'Ukur garis dasar'), text: L('Mark two points P and Q on your bank and measure the distance L between them.', 'Tandai dua titik P dan Q di tepimu dan ukur jarak L di antaranya.') },
        { name: L('Read the two angles', 'Baca kedua sudut'), text: L('From P and from Q, read the angle between the baseline and the line of sight to the target: alpha and beta.', 'Dari P dan dari Q, baca sudut antara garis dasar dan garis pandang ke sasaran: alfa dan beta.') },
        { name: L('Find the angle at the target', 'Cari sudut di sasaran'), text: L('The angle at the target is 180 minus alpha minus beta.', 'Sudut di sasaran adalah 180 dikurangi alfa dikurangi beta.') },
        { name: L('Use the law of sines', 'Pakai aturan sinus'), text: L('PT equals L sin beta over sin of alpha plus beta, and the width of the river is PT times sin alpha.', 'PT sama dengan L sin beta per sin dari alfa ditambah beta, dan lebar sungai adalah PT kali sin alfa.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is the law of sines formula?', 'Apa rumus aturan sinus?'),
      a: L(
        'In a triangle with sides a, b, c opposite the angles A, B, C, a over sin A equals b over sin B equals c over sin C. Each side divided by the sine of its opposite angle is the same number for all three sides.',
        'Pada segitiga dengan sisi a, b, c di depan sudut A, B, C, a per sin A sama dengan b per sin B sama dengan c per sin C. Tiap sisi dibagi sinus sudut di depannya adalah bilangan yang sama untuk ketiga sisi.',
      ),
    },
    {
      q: L('How do you prove the law of sines?', 'Bagaimana membuktikan aturan sinus?'),
      a: L(
        'Draw the altitude from one vertex. It equals b sin A and also a sin B, so b sin A equals a sin B, which rearranges to a over sin A equals b over sin B. Repeating with another altitude covers the third side.',
        'Gambar garis tinggi dari satu titik sudut. Ia sama dengan b sin A dan juga a sin B, sehingga b sin A sama dengan a sin B, yang disusun ulang menjadi a per sin A sama dengan b per sin B. Mengulang dengan garis tinggi lain mencakup sisi ketiga.',
      ),
    },
    {
      q: L('What does the common value in the law of sines mean?', 'Apa arti nilai bersama pada aturan sinus?'),
      a: L(
        'It is the diameter of the circumscribed circle, the circle through the three vertices. A side divided by the sine of its opposite angle equals 2R, so the radius is R equals a over 2 sin A.',
        'Ia adalah diameter lingkaran luar, lingkaran yang melalui ketiga titik sudut. Sebuah sisi dibagi sinus sudut di depannya sama dengan 2R, sehingga jari-jarinya R sama dengan a per 2 sin A.',
      ),
    },
    {
      q: L('When can you use the law of sines?', 'Kapan aturan sinus dapat dipakai?'),
      a: L(
        'When you know a side together with the angle opposite it: two angles and a side, or two sides and an angle opposite one of them. With two sides and the angle between them, or three sides, use the law of cosines first.',
        'Ketika kita tahu sebuah sisi bersama sudut di depannya: dua sudut dan satu sisi, atau dua sisi dan sudut di depan salah satunya. Dengan dua sisi dan sudut apitnya, atau tiga sisi, pakai aturan kosinus lebih dulu.',
      ),
    },
    {
      q: L('How do you find the second solution in the ambiguous case?', 'Bagaimana mencari penyelesaian kedua pada kasus ambigu?'),
      a: L(
        'A calculator gives only the acute angle B for sin B. The other angle is 180 degrees minus B. It is a second triangle only if A plus that angle is less than 180 degrees, and then the third side follows from the law of sines.',
        'Kalkulator hanya memberi sudut lancip B untuk sin B. Sudut lainnya adalah 180 derajat dikurangi B. Ia menjadi segitiga kedua hanya bila A ditambah sudut itu kurang dari 180 derajat, dan sisi ketiga lalu mengikuti dari aturan sinus.',
      ),
    },
    {
      q: L('How do you find the area of a triangle with sines?', 'Bagaimana mencari luas segitiga dengan sinus?'),
      a: L(
        'Use one half times two sides times the sine of the angle between them: one half a b sin C. With the law of sines this also equals a b c over 4R, where R is the radius of the circumscribed circle.',
        'Pakai setengah kali dua sisi kali sinus sudut apitnya: setengah a b sin C. Dengan aturan sinus ini juga sama dengan a b c per 4R, dengan R jari-jari lingkaran luar.',
      ),
    },
    {
      q: L('Does the law of sines work for obtuse triangles?', 'Apakah aturan sinus berlaku untuk segitiga tumpul?'),
      a: L(
        'Yes, for every triangle. The sine of an obtuse angle is positive and equals the sine of its supplement, 180 degrees minus the angle, which is what the altitude proof uses when the foot of the altitude falls outside the side.',
        'Ya, untuk setiap segitiga. Sinus sudut tumpul positif dan sama dengan sinus pelurusnya, 180 derajat dikurangi sudut itu, yang dipakai bukti garis tinggi ketika kaki garis tinggi jatuh di luar sisi.',
      ),
    },
    {
      q: L('How do you measure the width of a river with the law of sines?', 'Bagaimana mengukur lebar sungai dengan aturan sinus?'),
      a: L(
        'Measure a baseline L on your bank and the angles alpha and beta to a point on the far bank. The distance from one end is L sin beta over sin of alpha plus beta, and multiplying by sin alpha gives the width.',
        'Ukur garis dasar L di tepimu dan sudut alfa dan beta ke sebuah titik di tepi seberang. Jarak dari satu ujung adalah L sin beta per sin dari alfa ditambah beta, dan mengalikan dengan sin alfa memberi lebarnya.',
      ),
    },
  ],

  references: [
    { title: 'Precalculus: Mathematics for Calculus (chapters on the law of sines and the law of cosines)', author: 'James Stewart, Lothar Redlin, Saleem Watson', year: 2016, source: 'Cengage Learning' },
    { title: 'Trigonometry (2nd ed.)', author: 'I. M. Gelfand, Mark Saul', year: 2001, source: 'Birkhäuser' },
    { title: 'Trigonometric Delights', author: 'Eli Maor', year: 1998, source: 'Princeton University Press' },
    { title: 'A History of Mathematics (3rd ed.)', author: 'Carl B. Boyer, Uta C. Merzbach', year: 2011, source: 'Wiley' },
    { title: 'De triangulis omnimodis', author: 'Johannes Regiomontanus', year: 1533, source: 'Johannes Petreius, Nuremberg' },
    { title: 'Eratosthenes Batavus', author: 'Willebrord Snellius', year: 1617, source: 'Elzevir, Leiden' },
    { title: 'The Great Arc', author: 'John Keay', year: 2000, source: 'HarperCollins' },
  ],

  related: ['triangles', 'basic-trigonometry', 'trigonometric-equations', 'pythagorean-theorem'],
}
