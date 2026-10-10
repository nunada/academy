import type { FigItem } from '../../lib/figure'
import type { Loc } from '../types'
import type { ArticleBlock, ArticleBody } from './types'
import { meta } from './pythagorean-theorem.meta'

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

/** A triangle ABC drawn to scale on a plain canvas, with construction lines on request. */
const tri = (pts: [number, number][], caption: Loc, extra: FigItem[] = []): ArticleBlock => {
  const xs = pts.map((p) => p[0])
  const ys = pts.map((p) => p[1])
  const pad = 1.2
  const xSpan: [number, number] = [Math.min(...xs) - pad, Math.max(...xs) + pad]
  const ySpan: [number, number] = [Math.min(...ys) - pad, Math.max(...ys) + pad]
  const aspect = Math.min(3, Math.max(0.5, (xSpan[1] - xSpan[0]) / (ySpan[1] - ySpan[0])))
  const items: FigItem[] = [{ t: 'poly', pts, color: 'a' }, ...extra]
  pts.forEach((p, i) => items.push({ t: 'point', at: p, label: 'ABC'[i], color: 'b' }))
  return { kind: 'figure', figure: { dim: 2, axes: false, xSpan, ySpan, aspect, items, caption } }
}

export const body: ArticleBody = {
  answer: L(
    T`**The Pythagorean theorem says that in a right triangle the square of the hypotenuse equals the sum of the squares of the two legs: $a^2+b^2=c^2$.** In pictures, the square built on the longest side has the same area as the two squares on the other sides together. It gives a missing side as $c=\sqrt{a^2+b^2}$, shows that three sides form a right angle exactly when $a^2+b^2=c^2$, and, with whole numbers such as $3,4,5$, produces the Pythagorean triples.`,
    T`**Teorema Pythagoras menyatakan bahwa pada segitiga siku-siku kuadrat hipotenusa sama dengan jumlah kuadrat kedua sisi tegak: $a^2+b^2=c^2$.** Dalam gambar, persegi pada sisi terpanjang berluas sama dengan kedua persegi pada sisi lainnya bersama-sama. Teorema ini memberi sisi yang hilang sebagai $c=\sqrt{a^2+b^2}$, menunjukkan bahwa tiga sisi membentuk sudut siku-siku tepat bila $a^2+b^2=c^2$, dan, dengan bilangan bulat seperti $3,4,5$, menghasilkan tripel Pythagoras.`,
  ),

  keyPoints: [
    L(
      T`In a right triangle with legs $a,b$ and hypotenuse $c$: $a^2+b^2=c^2$; the missing hypotenuse is $\sqrt{a^2+b^2}$ and a missing leg is $\sqrt{c^2-a^2}$, with a subtraction under the root.`,
      T`Pada segitiga siku-siku dengan sisi tegak $a,b$ dan hipotenusa $c$: $a^2+b^2=c^2$; hipotenusa yang hilang adalah $\sqrt{a^2+b^2}$ dan sisi tegak yang hilang adalah $\sqrt{c^2-a^2}$, dengan pengurangan di bawah akar.`,
    ),
    L(
      T`The theorem can be proved by rearranging areas, by similar triangles, by shearing squares (Euclid) or by the area of a trapezoid (Garfield); each takes only a few lines.`,
      T`Teorema ini dapat dibuktikan dengan menata ulang luas, dengan segitiga sebangun, dengan menggeser persegi (Euclid), atau dengan luas trapesium (Garfield); masing-masing hanya beberapa baris.`,
    ),
    L(
      T`The converse is true: if $a^2+b^2=c^2$ the angle opposite $c$ is a right angle, which is the idea behind squaring a corner with a $3$–$4$–$5$ rope.`,
      T`Kebalikannya benar: jika $a^2+b^2=c^2$ maka sudut di depan $c$ adalah sudut siku-siku, yang menjadi dasar menyiku sudut dengan tali $3$–$4$–$5$.`,
    ),
    L(
      T`Euclid's formula $(m^2-n^2,\;2mn,\;m^2+n^2)$ builds every primitive triple; they grow in a tree from $(3,4,5)$, and one leg is always a multiple of 3, one of 4 and one number of 5.`,
      T`Rumus Euclid $(m^2-n^2,\;2mn,\;m^2+n^2)$ membentuk setiap tripel primitif; semuanya tumbuh dalam sebuah pohon dari $(3,4,5)$, dan selalu ada satu sisi kelipatan 3, satu kelipatan 4, dan satu bilangan kelipatan 5.`,
    ),
    L(
      T`The distance between two points is $\sqrt{\Delta x^2+\Delta y^2}$, and the diagonal of a box is $\sqrt{l^2+w^2+h^2}$: the theorem used once in the plane and twice in space.`,
      T`Jarak antara dua titik adalah $\sqrt{\Delta x^2+\Delta y^2}$, dan diagonal ruang balok adalah $\sqrt{l^2+w^2+h^2}$: teorema yang dipakai sekali di bidang dan dua kali di ruang.`,
    ),
    L(
      T`Generalizations: the law of cosines for any triangle, areas of similar shapes on the sides, the distance formula in any dimension, and Fermat's Last Theorem for higher powers.`,
      T`Perluasannya: aturan kosinus untuk segitiga mana pun, luas bangun sebangun pada sisi-sisinya, rumus jarak di dimensi mana pun, dan Teorema Terakhir Fermat untuk pangkat yang lebih tinggi.`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------------ statement */
    {
      id: 'what-is-the-theorem',
      heading: L('What is the Pythagorean theorem?', 'Apa itu teorema Pythagoras?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**In a right triangle with legs $a$ and $b$ and hypotenuse $c$, the Pythagorean theorem states that $a^2+b^2=c^2$.** The legs are the two sides that meet at the right angle; the hypotenuse is the side opposite it, which is always the longest (see [right triangles](article:triangles#right-triangles)).

The equation is about *area*. The square built on the hypotenuse has exactly the same area as the two squares built on the legs added together, which is the picture in the tool below. The name honors Pythagoras of Samos (about 570–495 BCE), but the relation was known in Babylonia, India and China long before him; the history is at the end.

Two things follow at once:

- **A missing hypotenuse:** $c=\sqrt{a^2+b^2}$. For legs $3$ and $4$ it is $\sqrt{9+16}=5$. For two legs of $1$ it is $\sqrt2$, which is [irrational](article:irrational-numbers#why-sqrt2-is-irrational), and for legs $6$ and $4$ it is $\sqrt{52}=2\sqrt{13}$ once you [simplify the radical](article:exponents-and-radicals#simplify-radicals).
- **A missing leg:** $b=\sqrt{c^2-a^2}$, with a *subtraction* under the root, because the hypotenuse is the big one. For $c=13$ and $a=5$ it is $\sqrt{169-25}=12$.

Keep every length in the same unit, and keep the square root as a root, or in simplified form, until the final step. The theorem needs a right angle: for other triangles see the law of cosines in the section on generalizations below.

Try it: give two sides and get the third, exactly, with a square drawn on every side.`,
            T`**Pada segitiga siku-siku dengan sisi tegak $a$ dan $b$ dan hipotenusa $c$, teorema Pythagoras menyatakan bahwa $a^2+b^2=c^2$.** Sisi tegak adalah dua sisi yang bertemu di sudut siku-siku; hipotenusa adalah sisi di depannya, yang selalu terpanjang (lihat [segitiga siku-siku](article:triangles#right-triangles)).

Persamaan itu tentang *luas*. Persegi pada hipotenusa berluas tepat sama dengan jumlah luas kedua persegi pada sisi tegak, yaitu gambar pada alat di bawah. Namanya mengabadikan Pythagoras dari Samos (sekitar 570–495 SM), tetapi hubungan itu sudah dikenal di Babilonia, India, dan Tiongkok jauh sebelum dia; sejarahnya ada di bagian akhir.

Dua hal langsung mengikutinya:

- **Hipotenusa yang hilang:** $c=\sqrt{a^2+b^2}$. Untuk sisi tegak $3$ dan $4$ hasilnya $\sqrt{9+16}=5$. Untuk dua sisi tegak $1$ hasilnya $\sqrt2$, yang [irasional](article:irrational-numbers#why-sqrt2-is-irrational), dan untuk sisi tegak $6$ dan $4$ hasilnya $\sqrt{52}=2\sqrt{13}$ setelah kamu [menyederhanakan bentuk akar](article:exponents-and-radicals#simplify-radicals).
- **Sisi tegak yang hilang:** $b=\sqrt{c^2-a^2}$, dengan *pengurangan* di bawah akar, karena hipotenusa adalah yang terbesar. Untuk $c=13$ dan $a=5$ hasilnya $\sqrt{169-25}=12$.

Jaga semua panjang dalam satuan yang sama, dan biarkan akar kuadrat tetap sebagai akar, atau dalam bentuk sederhana, sampai langkah terakhir. Teorema ini membutuhkan sudut siku-siku: untuk segitiga lain lihat aturan kosinus pada bagian perluasan di bawah.

Cobalah: berikan dua sisi dan dapatkan sisi ketiga secara eksak, dengan persegi digambar pada setiap sisi.`,
          ),
        },
        { kind: 'widget', name: 'pythsolve' },
      ],
    },

    /* --------------------------------------------------------------- proofs */
    {
      id: 'proofs',
      heading: L('How do you prove the Pythagorean theorem?', 'Bagaimana membuktikan teorema Pythagoras?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**There are hundreds of proofs, and four of the clearest rearrange areas, use similar triangles, shear squares into rectangles, or add up a trapezoid; each takes only a few lines.** Here they are, starting with the one in the tool below.

**1. Rearranging four triangles.** Take four copies of the right triangle, each of area $\frac12ab$, and fit them inside a square of side $a+b$. Two arrangements are possible. In the first, the triangles leave a *tilted* square of side $c$ in the middle. In the second, the same triangles leave two squares, one of side $a$ and one of side $b$. The big square has the same area both times, and so do the four triangles, so what is left over must be equal:
$$c^2=(a+b)^2-4\cdot\tfrac12ab=a^2+b^2.$$
This is the diagram of the Chinese *Zhoubi Suanjing*. Slide $a$ and $b$ and switch the arrangement below.`,
            T`**Ada ratusan bukti, dan empat yang paling jelas menata ulang luas, memakai segitiga sebangun, menggeser persegi menjadi persegi panjang, atau menjumlahkan luas trapesium; masing-masing hanya beberapa baris.** Inilah keempatnya, dimulai dari yang ada pada alat di bawah.

**1. Menata ulang empat segitiga.** Ambil empat salinan segitiga siku-siku, masing-masing berluas $\frac12ab$, dan susun di dalam persegi bersisi $a+b$. Ada dua penataan. Pada yang pertama, segitiga-segitiga itu menyisakan persegi *miring* bersisi $c$ di tengah. Pada yang kedua, segitiga yang sama menyisakan dua persegi, satu bersisi $a$ dan satu bersisi $b$. Persegi besar berluas sama pada kedua penataan, begitu pula keempat segitiga, sehingga sisanya pasti sama:
$$c^2=(a+b)^2-4\cdot\tfrac12ab=a^2+b^2.$$
Inilah diagram *Zhoubi Suanjing* dari Tiongkok. Geser $a$ dan $b$ dan ganti penataannya di bawah.`,
          ),
        },
        { kind: 'widget', name: 'pythproof' },
        tri(
          [[4, 0], [0, 3], [0, 0]],
          L(
            'The altitude from the right angle C to the hypotenuse AB splits the triangle into two smaller triangles that are similar to the whole one, and splits the hypotenuse into two parts p and q.',
            'Garis tinggi dari sudut siku-siku C ke hipotenusa AB membagi segitiga menjadi dua segitiga lebih kecil yang sebangun dengan segitiga utuh, dan membagi hipotenusa menjadi dua bagian p dan q.',
          ),
          [{ t: 'seg', from: [0, 0], to: [1.44, 1.92], color: 'c', dashed: true, label: 'h' }],
        ),
        {
          kind: 'text',
          text: L(
            T`**2. Similar triangles.** Draw the altitude from the right angle to the hypotenuse. It cuts the hypotenuse $c$ into two pieces $p$ and $q$ with $p+q=c$, and cuts the triangle into two smaller ones, each similar to the whole by AA, as in [similar triangles](article:triangles#congruence-similarity). Comparing the ratios of corresponding sides gives $\frac{a}{c}=\frac{p}{a}$ and $\frac{b}{c}=\frac{q}{b}$, that is, $a^2=cp$ and $b^2=cq$. Add them:
$$a^2+b^2=c(p+q)=c\cdot c=c^2.$$

**3. Euclid's proof (Elements I.47).** The same two equations say that if the altitude is extended through the square on the hypotenuse, it splits that square into two rectangles, one of area $cp=a^2$ and one of area $cq=b^2$. Euclid showed this without ratios, by shearing: a square and a rectangle on the same base and between the same parallels, cut in half by a diagonal, give triangles of equal area, so each square on a leg equals one rectangle of the big square.

**4. Garfield's trapezoid (1876).** Put two copies of the right triangle side by side so that the hypotenuses form a right angle; with a third right triangle of legs $c$ and $c$ in between, the figure is a trapezoid with parallel sides $a$ and $b$ and height $a+b$. Its area is $\frac12(a+b)(a+b)$, and also the sum of the three triangles, $\frac12ab+\frac12ab+\frac12c^2$. So $\frac12(a+b)^2=ab+\frac12c^2$, which becomes $a^2+2ab+b^2=2ab+c^2$ and again $a^2+b^2=c^2$. James Garfield found it while he was a member of the US House of Representatives, and he became the 20th president five years later.

A collection by Elisha Loomis, in its 1940 edition, gathers about 370 proofs of the theorem.`,
            T`**2. Segitiga sebangun.** Gambar garis tinggi dari sudut siku-siku ke hipotenusa. Garis itu membagi hipotenusa $c$ menjadi dua bagian $p$ dan $q$ dengan $p+q=c$, dan membagi segitiga menjadi dua segitiga lebih kecil, masing-masing sebangun dengan segitiga utuh menurut AA, seperti pada [segitiga sebangun](article:triangles#congruence-similarity). Membandingkan perbandingan sisi-sisi yang bersesuaian memberi $\frac{a}{c}=\frac{p}{a}$ dan $\frac{b}{c}=\frac{q}{b}$, yaitu $a^2=cp$ dan $b^2=cq$. Jumlahkan:
$$a^2+b^2=c(p+q)=c\cdot c=c^2.$$

**3. Bukti Euclid (Elements I.47).** Kedua persamaan yang sama itu mengatakan bahwa bila garis tinggi diperpanjang menembus persegi pada hipotenusa, ia membagi persegi itu menjadi dua persegi panjang, satu berluas $cp=a^2$ dan satu berluas $cq=b^2$. Euclid menunjukkannya tanpa perbandingan, dengan menggeser: persegi dan persegi panjang pada alas yang sama dan di antara garis sejajar yang sama, dibelah dua oleh diagonal, memberi segitiga berluas sama, sehingga setiap persegi pada sisi tegak sama dengan satu persegi panjang dari persegi besar.

**4. Trapesium Garfield (1876).** Letakkan dua salinan segitiga siku-siku berdampingan sehingga hipotenusanya membentuk sudut siku-siku; dengan segitiga siku-siku ketiga bersisi tegak $c$ dan $c$ di antaranya, bangunnya adalah trapesium dengan sisi sejajar $a$ dan $b$ dan tinggi $a+b$. Luasnya $\frac12(a+b)(a+b)$, dan juga jumlah ketiga segitiga, $\frac12ab+\frac12ab+\frac12c^2$. Jadi $\frac12(a+b)^2=ab+\frac12c^2$, yang menjadi $a^2+2ab+b^2=2ab+c^2$ dan lagi-lagi $a^2+b^2=c^2$. James Garfield menemukannya saat menjadi anggota DPR Amerika Serikat, dan ia menjadi presiden ke-20 lima tahun kemudian.

Kumpulan karya Elisha Loomis, dalam edisi 1940, menghimpun sekitar 370 bukti teorema ini.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------- converse */
    {
      id: 'converse',
      heading: L('How do you use the converse to check for a right angle?', 'Bagaimana memakai kebalikannya untuk memeriksa sudut siku-siku?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**If the three sides of a triangle satisfy $a^2+b^2=c^2$, the angle opposite $c$ is a right angle; this converse is how builders square a corner with a $3$–$4$–$5$ rope.**

**Why the converse is true.** Suppose a triangle has sides $a$, $b$, $c$ with $a^2+b^2=c^2$. Build a *right* triangle with legs $a$ and $b$. By the theorem its hypotenuse is $\sqrt{a^2+b^2}=c$, so it has the same three sides as the given triangle. Two triangles with three equal sides are congruent (SSS), so the given triangle has a right angle too. Euclid proves it as proposition I.48, the last of Book I.

**The 3–4–5 rope.** Tie a loop of rope with $12$ equal spaces marked by knots. Hold the knots $3$ apart and $4$ apart and pull the loop tight into a triangle: the sides are $3$, $4$ and $5$, and $9+16=25$, so the corner between the sides $3$ and $4$ is exactly square. Surveyors and builders have done this for thousands of years. Any multiple works equally well, such as $6$–$8$–$10$ for a large room.

**The diagonal check.** A frame $2.4$ m by $1.8$ m is a rectangle only if its diagonals are $3.0$ m, because $1.8^2+2.4^2=3.24+5.76=9.00=3.0^2$. If a diagonal is longer or shorter, the frame is leaning.

**What if the test fails?** Then the angle is not a right angle, and the size of $c^2$ against $a^2+b^2$ tells which way it goes: a larger $c^2$ means an obtuse angle, a smaller one an acute angle, as set out under the [types of triangles](article:triangles#types). The sides $5$, $7$, $9$ give $25+49=74<81$, so the biggest angle is obtuse.`,
            T`**Jika ketiga sisi suatu segitiga memenuhi $a^2+b^2=c^2$, sudut di depan $c$ adalah sudut siku-siku; kebalikan ini adalah cara tukang bangunan menyiku sudut dengan tali $3$–$4$–$5$.**

**Mengapa kebalikannya benar.** Misalkan segitiga memiliki sisi $a$, $b$, $c$ dengan $a^2+b^2=c^2$. Bangun segitiga *siku-siku* dengan sisi tegak $a$ dan $b$. Menurut teorema, hipotenusanya $\sqrt{a^2+b^2}=c$, sehingga ketiga sisinya sama dengan segitiga yang diberikan. Dua segitiga dengan tiga sisi sama adalah kongruen (SSS), sehingga segitiga yang diberikan juga memiliki sudut siku-siku. Euclid membuktikannya sebagai proposisi I.48, yang terakhir pada Buku I.

**Tali 3–4–5.** Ikat tali melingkar dengan $12$ ruas sama yang ditandai simpul. Pegang simpul berjarak $3$ dan $4$ lalu tarik lingkaran itu kencang menjadi segitiga: sisinya $3$, $4$, dan $5$, dan $9+16=25$, sehingga sudut di antara sisi $3$ dan $4$ tepat siku-siku. Pengukur tanah dan tukang bangunan telah melakukannya selama ribuan tahun. Kelipatan mana pun sama baiknya, seperti $6$–$8$–$10$ untuk ruangan besar.

**Pemeriksaan diagonal.** Bingkai $2{,}4$ m kali $1{,}8$ m adalah persegi panjang hanya bila diagonalnya $3{,}0$ m, karena $1{,}8^2+2{,}4^2=3{,}24+5{,}76=9{,}00=3{,}0^2$. Jika diagonalnya lebih panjang atau lebih pendek, bingkainya miring.

**Bagaimana bila ujinya gagal?** Maka sudutnya bukan sudut siku-siku, dan besar $c^2$ terhadap $a^2+b^2$ menunjukkan arahnya: $c^2$ yang lebih besar berarti sudut tumpul, yang lebih kecil berarti sudut lancip, seperti diuraikan pada [jenis-jenis segitiga](article:triangles#types). Sisi $5$, $7$, $9$ memberi $25+49=74<81$, sehingga sudut terbesarnya tumpul.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------- triples */
    {
      id: 'pythagorean-triples',
      heading: L('What are Pythagorean triples and how do you find them?', 'Apa itu tripel Pythagoras dan bagaimana menemukannya?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A Pythagorean triple is a set of three positive whole numbers $a,b,c$ with $a^2+b^2=c^2$, and Euclid's formula $(m^2-n^2,\;2mn,\;m^2+n^2)$ produces every primitive one.** The triple $(3,4,5)$ is the smallest; $(5,12,13)$ and $(8,15,17)$ follow. A multiple of a triple is a triple ($(6,8,10)$ is twice $(3,4,5)$), so the interesting ones are the *primitive* triples, with no common factor, as in the [greatest common divisor](article:integers#gcd-lcm).

**Euclid's formula.** For whole numbers $m>n>0$ the triple $(m^2-n^2,\,2mn,\,m^2+n^2)$ works, because $(m^2-n^2)^2+(2mn)^2=m^4-2m^2n^2+n^4+4m^2n^2=(m^2+n^2)^2$. It is primitive exactly when $m$ and $n$ are coprime and one of them is even, and then it gives every primitive triple once.

| $m$ | $n$ | Primitive triple |
|---|---|---|
| $2$ | $1$ | $3,4,5$ |
| $3$ | $2$ | $5,12,13$ |
| $4$ | $1$ | $8,15,17$ |
| $4$ | $3$ | $7,24,25$ |
| $5$ | $2$ | $20,21,29$ |
| $5$ | $4$ | $9,40,41$ |
| $6$ | $1$ | $12,35,37$ |
| $7$ | $2$ | $28,45,53$ |

There are $16$ primitive triples with hypotenuse at most $100$, and $52$ triples in all once the multiples are counted.

**Patterns in every triple.** In a primitive triple exactly one leg is even and the hypotenuse is odd. Among $a,b,c$ one leg is a multiple of $3$, one leg is a multiple of $4$, and one of the three numbers is a multiple of $5$, so $abc$ is always divisible by $60$ (see [divisibility](article:integers#divisibility)). The area $\frac12ab$ is always a whole number.

**All triangles with a given leg.** Write $a^2=c^2-b^2=(c-b)(c+b)$ and list the ways to factor $a^2$ into two numbers of the same parity. For $a=12$, $a^2=144=2\cdot72=4\cdot36=6\cdot24=8\cdot18$, giving $(c,b)=(37,35),(20,16),(15,9),(13,5)$: four right triangles with a leg of $12$.

Explore the lists below, then walk the tree.`,
            T`**Tripel Pythagoras adalah tiga bilangan bulat positif $a,b,c$ dengan $a^2+b^2=c^2$, dan rumus Euclid $(m^2-n^2,\;2mn,\;m^2+n^2)$ menghasilkan setiap tripel primitif.** Tripel $(3,4,5)$ yang terkecil; $(5,12,13)$ dan $(8,15,17)$ menyusul. Kelipatan suatu tripel juga tripel ($(6,8,10)$ adalah dua kali $(3,4,5)$), sehingga yang menarik adalah tripel *primitif*, tanpa faktor persekutuan, seperti pada [faktor persekutuan terbesar](article:integers#gcd-lcm).

**Rumus Euclid.** Untuk bilangan bulat $m>n>0$ tripel $(m^2-n^2,\,2mn,\,m^2+n^2)$ berlaku, karena $(m^2-n^2)^2+(2mn)^2=m^4-2m^2n^2+n^4+4m^2n^2=(m^2+n^2)^2$. Ia primitif tepat bila $m$ dan $n$ saling prima dan salah satunya genap, dan lalu memberi setiap tripel primitif satu kali.

| $m$ | $n$ | Tripel primitif |
|---|---|---|
| $2$ | $1$ | $3,4,5$ |
| $3$ | $2$ | $5,12,13$ |
| $4$ | $1$ | $8,15,17$ |
| $4$ | $3$ | $7,24,25$ |
| $5$ | $2$ | $20,21,29$ |
| $5$ | $4$ | $9,40,41$ |
| $6$ | $1$ | $12,35,37$ |
| $7$ | $2$ | $28,45,53$ |

Ada $16$ tripel primitif dengan hipotenusa paling besar $100$, dan $52$ tripel seluruhnya bila kelipatannya dihitung.

**Pola pada setiap tripel.** Pada tripel primitif tepat satu sisi tegak genap dan hipotenusanya ganjil. Di antara $a,b,c$ satu sisi tegak adalah kelipatan $3$, satu sisi tegak kelipatan $4$, dan satu dari ketiga bilangan kelipatan $5$, sehingga $abc$ selalu habis dibagi $60$ (lihat [keterbagian](article:integers#divisibility)). Luas $\frac12ab$ selalu bilangan bulat.

**Semua segitiga dengan sisi tegak tertentu.** Tulis $a^2=c^2-b^2=(c-b)(c+b)$ dan daftar cara memfaktorkan $a^2$ menjadi dua bilangan yang sama paritasnya. Untuk $a=12$, $a^2=144=2\cdot72=4\cdot36=6\cdot24=8\cdot18$, memberi $(c,b)=(37,35),(20,16),(15,9),(13,5)$: empat segitiga siku-siku dengan sisi tegak $12$.

Jelajahi daftarnya di bawah, lalu telusuri pohonnya.`,
          ),
        },
        { kind: 'widget', name: 'pythtriples' },
        {
          kind: 'text',
          text: L(
            T`**The tree of primitive triples.** In 1934 the Swedish mathematician Berggren found that all primitive triples fit in one tree. The root is $(3,4,5)$ and every triple has exactly three children, found with three fixed linear rules, so each primitive triple appears exactly once. With the odd leg first, $(3,4,5)$ has the children $(5,12,13)$, $(21,20,29)$ and $(15,8,17)$.

The triples are not just curiosities: $\left(\frac35,\frac45\right)$ is a point of the unit circle because $3^2+4^2=5^2$, and every triple gives such a point, as in the [equation of a circle](article:circles#equation).`,
            T`**Pohon tripel primitif.** Pada 1934 matematikawan Swedia Berggren menemukan bahwa semua tripel primitif muat dalam satu pohon. Akarnya $(3,4,5)$ dan setiap tripel memiliki tepat tiga anak, yang ditemukan dengan tiga aturan linear tetap, sehingga setiap tripel primitif muncul tepat satu kali. Dengan sisi tegak ganjil di depan, $(3,4,5)$ memiliki anak $(5,12,13)$, $(21,20,29)$, dan $(15,8,17)$.

Tripel bukan sekadar keanehan: $\left(\frac35,\frac45\right)$ adalah titik pada lingkaran satuan karena $3^2+4^2=5^2$, dan setiap tripel memberi titik seperti itu, seperti pada [persamaan lingkaran](article:circles#equation).`,
          ),
        },
        { kind: 'widget', name: 'pythtree' },
      ],
    },

    /* ----------------------------------------------------- distance, diagonals */
    {
      id: 'distance-and-diagonals',
      heading: L('How does the theorem give distances and diagonals?', 'Bagaimana teorema ini memberi jarak dan diagonal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The distance between two points is the hypotenuse of a right triangle whose legs are the horizontal and the vertical differences, so $d=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$; one more use of the theorem gives the diagonal of a box in space.**

**In the plane.** From $(1,2)$ to $(7,10)$ the legs are $6$ and $8$, so the distance is $\sqrt{36+64}=10$. Comparing squared distances needs no square root at all, which is how the [quadrilateral tests](article:quadrilaterals#coordinates) check equal sides, and the equation $(x-h)^2+(y-k)^2=r^2$ of a [circle](article:circles#equation) is the distance formula saying "the distance to the center is $r$".

**In space.** Use the theorem twice. The diagonal of the floor of a box $l\times w$ is $\sqrt{l^2+w^2}$, and this diagonal and the height $h$ are the legs of a second right triangle whose hypotenuse is the diagonal of the box:
$$d=\sqrt{l^2+w^2+h^2}.$$
A box $2\times3\times6$ has diagonal $\sqrt{4+9+36}=7$, and the longest rod that fits in a box $3\times4\times12$ is $\sqrt{9+16+144}=13$. A unit cube has diagonal $\sqrt3$. The same pattern, a sum of squared differences under a root, gives the distance in any number of dimensions.

**Everyday uses.**

- **A ladder** $5$ m long with its foot $1.4$ m from the wall reaches $\sqrt{25-1.96}=4.8$ m up the wall.
- **A shortcut** across a field $60$ m by $80$ m is $100$ m, against $140$ m along the edges.
- **A screen size** is its diagonal. A 55-inch screen with the shape $16:9$ has width and height proportional to $16$ and $9$, and $\sqrt{16^2+9^2}=\sqrt{337}$, so it is about $47.9$ in wide and $27.0$ in high, since $\frac{55\cdot16}{\sqrt{337}}\approx47.9$ and $\frac{55\cdot9}{\sqrt{337}}\approx27.0$.
- **A paved diagonal path** across a rectangular garden $30$ m by $40$ m is $50$ m long; at 20 dollars per meter it costs 1,000 dollars.`,
            T`**Jarak antara dua titik adalah hipotenusa segitiga siku-siku yang sisi tegaknya selisih mendatar dan selisih tegak, sehingga $d=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$; satu pemakaian teorema lagi memberi diagonal ruang balok.**

**Di bidang.** Dari $(1,2)$ ke $(7,10)$ sisi tegaknya $6$ dan $8$, sehingga jaraknya $\sqrt{36+64}=10$. Membandingkan kuadrat jarak tidak memerlukan akar sama sekali, begitulah [uji segiempat](article:quadrilaterals#coordinates) memeriksa sisi yang sama panjang, dan persamaan $(x-h)^2+(y-k)^2=r^2$ sebuah [lingkaran](article:circles#equation) adalah rumus jarak yang mengatakan "jarak ke pusat adalah $r$".

**Di ruang.** Pakai teorema dua kali. Diagonal alas balok $l\times w$ adalah $\sqrt{l^2+w^2}$, dan diagonal ini bersama tinggi $h$ adalah sisi tegak segitiga siku-siku kedua yang hipotenusanya diagonal ruang balok:
$$d=\sqrt{l^2+w^2+h^2}.$$
Balok $2\times3\times6$ memiliki diagonal ruang $\sqrt{4+9+36}=7$, dan batang terpanjang yang muat dalam balok $3\times4\times12$ adalah $\sqrt{9+16+144}=13$. Kubus satuan memiliki diagonal ruang $\sqrt3$. Pola yang sama, jumlah kuadrat selisih di bawah akar, memberi jarak dalam dimensi sebanyak apa pun.

**Pemakaian sehari-hari.**

- **Tangga** sepanjang $5$ m dengan kaki $1{,}4$ m dari tembok mencapai ketinggian $\sqrt{25-1{,}96}=4{,}8$ m pada tembok.
- **Jalan pintas** melintasi lapangan $60$ m kali $80$ m adalah $100$ m, dibandingkan $140$ m menyusuri tepinya.
- **Ukuran layar** adalah diagonalnya. Layar 55 inci berbentuk $16:9$ memiliki lebar dan tinggi sebanding dengan $16$ dan $9$, dan $\sqrt{16^2+9^2}=\sqrt{337}$, sehingga lebarnya sekitar $47{,}9$ inci dan tingginya $27{,}0$ inci, karena $\frac{55\cdot16}{\sqrt{337}}\approx47{,}9$ dan $\frac{55\cdot9}{\sqrt{337}}\approx27{,}0$.
- **Jalan setapak diagonal** berpaving melintasi taman persegi panjang $30$ m kali $40$ m panjangnya $50$ m; dengan harga Rp150.000 per meter biayanya 50 kali Rp150.000, yaitu Rp7.500.000.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------ generalizations */
    {
      id: 'generalizations',
      heading: L('Can the Pythagorean theorem be generalized?', 'Dapatkah teorema Pythagoras diperluas?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Yes: the law of cosines extends it to every triangle, any similar shapes drawn on the three sides have areas that add up in the same way, the distance formula carries it into any dimension, and for powers above two the equation has no whole-number solutions at all.**

- **The law of cosines.** For any triangle, $c^2=a^2+b^2-2ab\cos C$. At a right angle $\cos C=0$ and the correction vanishes, which is the Pythagorean theorem; for an acute angle the correction subtracts, for an obtuse angle it adds. See [solving a triangle](article:triangles#solve-a-triangle).
- **Other shapes on the sides.** Area grows with the square of length, so *any* similar figures built on the three sides satisfy $A_a+A_b=A_c$: semicircles, equilateral triangles, even copies of your favorite drawing. With semicircles, Hippocrates of Chios (5th century BCE) drew the two crescents (lunes) outside the hypotenuse's semicircle and showed that, for a right triangle, the two lunes together have exactly the area of the triangle.
- **Vectors and higher dimensions.** If two vectors are perpendicular, $|u+v|^2=|u|^2+|v|^2$; this is the theorem for the triangle they span, and the distance in any number of dimensions is built from it.
- **A curved surface.** On a sphere of radius $1$, a triangle with a right angle satisfies $\cos c=\cos a\cos b$ instead, with the sides measured along the surface. The plain theorem needs a flat plane.
- **Higher powers.** The equation $x^2+y^2=z^2$ has infinitely many whole-number solutions, the triples above. For $x^n+y^n=z^n$ with $n\ge3$ there are none in positive whole numbers. Pierre de Fermat wrote this in a margin around 1637, saying that he had a proof too long for the margin; the first proof was found by Andrew Wiles, with a gap closed by Richard Taylor, in 1995. This is *Fermat's Last Theorem*.`,
            T`**Ya: aturan kosinus memperluasnya ke setiap segitiga, bangun sebangun mana pun yang dibuat pada ketiga sisi memiliki luas yang menjumlah dengan cara yang sama, rumus jarak membawanya ke dimensi mana pun, dan untuk pangkat di atas dua persamaannya sama sekali tidak punya penyelesaian bilangan bulat.**

- **Aturan kosinus.** Untuk segitiga mana pun, $c^2=a^2+b^2-2ab\cos C$. Pada sudut siku-siku $\cos C=0$ dan koreksinya lenyap, yaitu teorema Pythagoras; untuk sudut lancip koreksinya mengurangi, untuk sudut tumpul koreksinya menambah. Lihat [memecahkan segitiga](article:triangles#solve-a-triangle).
- **Bangun lain pada sisi-sisinya.** Luas tumbuh sebagai kuadrat panjang, sehingga bangun sebangun *mana pun* yang dibuat pada ketiga sisi memenuhi $A_a+A_b=A_c$: setengah lingkaran, segitiga sama sisi, bahkan salinan gambar kesukaanmu. Dengan setengah lingkaran, Hippokrates dari Khios (abad ke-5 SM) menggambar dua bulan sabit (lunula) di luar setengah lingkaran pada hipotenusa dan menunjukkan bahwa, untuk segitiga siku-siku, kedua lunula bersama-sama berluas tepat sama dengan segitiganya.
- **Vektor dan dimensi lebih tinggi.** Jika dua vektor tegak lurus, $|u+v|^2=|u|^2+|v|^2$; ini adalah teorema untuk segitiga yang dibentuknya, dan jarak dalam dimensi sebanyak apa pun dibangun darinya.
- **Permukaan lengkung.** Pada bola berjari-jari $1$, segitiga bersudut siku-siku memenuhi $\cos c=\cos a\cos b$, dengan sisi diukur sepanjang permukaan. Teorema biasa membutuhkan bidang datar.
- **Pangkat lebih tinggi.** Persamaan $x^2+y^2=z^2$ memiliki tak berhingga banyak penyelesaian bilangan bulat, yaitu tripel di atas. Untuk $x^n+y^n=z^n$ dengan $n\ge3$ tidak ada penyelesaian bilangan bulat positif. Pierre de Fermat menuliskannya di pinggir halaman sekitar 1637, dengan mengatakan bahwa ia memiliki bukti yang terlalu panjang untuk pinggir halaman; bukti pertama ditemukan oleh Andrew Wiles, dengan celah yang ditutup oleh Richard Taylor, pada 1995. Inilah *Teorema Terakhir Fermat*.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------- in code */
    {
      id: 'pythagoras-in-code',
      heading: L('How do you use the Pythagorean theorem in code?', 'Bagaimana memakai teorema Pythagoras dalam kode?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Use ´math.hypot´ for lengths, and integers with ´math.isqrt´ for exact tests.** The square root of a float is rounded, so a right angle is best tested with whole numbers, and a huge or tiny length is best computed with ´hypot´, which cannot overflow.`,
            T`**Pakai ´math.hypot´ untuk panjang, dan bilangan bulat dengan ´math.isqrt´ untuk uji yang eksak.** Akar kuadrat float dibulatkan, sehingga sudut siku-siku paling baik diuji dengan bilangan bulat, dan panjang yang sangat besar atau kecil paling baik dihitung dengan ´hypot´, yang tidak dapat meluap.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python', 'Python'),
          code: `from math import hypot, dist, isqrt, sqrt, gcd

def is_triple(a, b, c):
    return a * a + b * b == c * c                 # exact for whole numbers

def hyp_exact(a, b):                              # (isqrt, True) when the hypotenuse is whole
    s = a * a + b * b
    c = isqrt(s)
    return c, c * c == s

def primitive_triples(limit):                     # Euclid's formula
    out = []
    m = 2
    while m * m + 1 <= limit:
        for n in range(1, m):
            if (m - n) % 2 and gcd(m, n) == 1 and m * m + n * n <= limit:
                a, b = sorted((m * m - n * n, 2 * m * n))
                out.append((a, b, m * m + n * n))
        m += 1
    return sorted(out, key=lambda t: t[2])

>>> is_triple(5, 12, 13), is_triple(4, 5, 6)
(True, False)
>>> hyp_exact(8, 15), hyp_exact(1, 1)
((17, True), (1, False))
>>> primitive_triples(30)
[(3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25), (20, 21, 29)]
>>> len(primitive_triples(100))
16
>>> hypot(3, 4), dist((1, 2), (7, 10)), hypot(2, 3, 6)   # 2D, between points, 3D
(5.0, 10.0, 7.0)
>>> sqrt(1.2 ** 2 + 3.5 ** 2) == 3.7                 # should be True: 1.2, 3.5, 3.7 is a triple
False
>>> hypot(1.2, 3.5) == 3.7
True
>>> sqrt(1e200 ** 2 + 1e200 ** 2)                    # squaring overflows
OverflowError: (34, 'Result too large')
>>> hypot(1e200, 1e200)
1.414213562373095e+200`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript', 'JavaScript'),
          code: `Math.hypot(3, 4)                                   // 5
Math.hypot(1, 2, 2)                                // 3: the diagonal of a 1 by 2 by 2 box
const isTriple = (a, b, c) => a * a + b * b === c * c   // exact for whole numbers
isTriple(20, 21, 29)                               // true
Math.sqrt(1.2 ** 2 + 3.5 ** 2) === 3.7             // false: the float sum rounds, as in Python`,
        },
        {
          kind: 'text',
          text: L(
            T`The pitfalls, in order of how often they bite:

| Pitfall | What happens | What to do |
|---|---|---|
| Testing a right angle with a float root | ´sqrt(1.2**2 + 3.5**2) == 3.7´ is false | compare whole numbers ´a*a + b*b == c*c´, use ´Fraction´ as in [real numbers in code](article:real-numbers#real-numbers-in-code), or ´math.isclose´ |
| Squaring a huge or tiny length | ´1e200 ** 2´ overflows, ´1e-200 ** 2´ becomes 0 | use ´math.hypot´ |
| ´int(sqrt(n))´ for a big whole number | the float root loses digits and the integer is off by one | use ´math.isqrt´ |
| ´^´ for a square | it is XOR, not a power | use ´**´ or multiply |
| Squaring a sum | ´(a + b) ** 2´ is not ´a**2 + b**2´ | expand it: ´a*a + 2*a*b + b*b´ |
| Mixed units | 3 ft and 40 in give nonsense | convert to one unit first |`,
            T`Jebakannya, berdasarkan seberapa sering terjadi:

| Jebakan | Yang terjadi | Yang sebaiknya dilakukan |
|---|---|---|
| Menguji sudut siku-siku dengan akar float | ´sqrt(1.2**2 + 3.5**2) == 3.7´ bernilai salah | bandingkan bilangan bulat ´a*a + b*b == c*c´, pakai ´Fraction´ seperti pada [bilangan real dalam kode](article:real-numbers#real-numbers-in-code), atau ´math.isclose´ |
| Mengkuadratkan panjang yang sangat besar atau kecil | ´1e200 ** 2´ meluap, ´1e-200 ** 2´ menjadi 0 | pakai ´math.hypot´ |
| ´int(sqrt(n))´ untuk bilangan bulat besar | akar float kehilangan digit dan hasil bulatnya meleset satu | pakai ´math.isqrt´ |
| ´^´ untuk kuadrat | itu XOR, bukan pangkat | pakai ´**´ atau kalikan |
| Mengkuadratkan jumlah | ´(a + b) ** 2´ bukan ´a**2 + b**2´ | jabarkan: ´a*a + 2*a*b + b*b´ |
| Satuan campur aduk | 3 kaki dan 40 inci memberi hasil tak masuk akal | ubah ke satu satuan lebih dulu |`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Who discovered the Pythagorean theorem?', 'Siapa yang menemukan teorema Pythagoras?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**No single person discovered it: the relation was used in Babylonia, India and China long before Pythagoras, and the first proofs we can read come from Euclid.**

- **c. 1800 BCE.** The Babylonian clay tablet Plimpton 322 lists what appear to be Pythagorean triples, such as $(119,120,169)$, so the relation was in use a thousand years before Greek geometry.
- **c. 800–500 BCE.** The Indian *Sulba Sutras*, rules for building altars, state that the rope along the diagonal of a rectangle produces the area of the squares on both sides together.
- **c. 570–495 BCE.** Pythagoras of Samos, in southern Italy, founded the school that bears his name. Nothing he wrote survives, and the credit for the theorem comes from writers centuries later.
- **Before the 1st century BCE.** The Chinese *Zhoubi Suanjing* explains the $3$–$4$–$5$ triangle and a diagram with a tilted square, the *gougu* (leg-and-leg) theorem.
- **c. 300 BCE.** Euclid's *Elements* proves the theorem as I.47 and its converse as I.48.
- **12th century.** Bhaskara II draws the rearrangement diagram with the single word "Behold!".
- **1876.** Garfield's trapezoid proof appears in print.
- **1995.** Wiles proves Fermat's Last Theorem, the answer to the question of whether the Pythagorean equation works with exponent three or more.

A popular story says that the Greeks were shaken by the discovery that the diagonal of a square is not a ratio of whole numbers, the first irrational number, which the theorem makes unavoidable: see the [proof that the square root of 2 is irrational](article:irrational-numbers#why-sqrt2-is-irrational).`,
            T`**Tidak ada satu orang yang menemukannya: hubungan ini dipakai di Babilonia, India, dan Tiongkok jauh sebelum Pythagoras, dan bukti pertama yang dapat kita baca berasal dari Euclid.**

- **Sekitar 1800 SM.** Lempeng tanah liat Babilonia Plimpton 322 mendaftar apa yang tampaknya tripel Pythagoras, seperti $(119,120,169)$, sehingga hubungan itu sudah dipakai seribu tahun sebelum geometri Yunani.
- **Sekitar 800–500 SM.** *Sulba Sutra* India, aturan membangun altar, menyatakan bahwa tali sepanjang diagonal persegi panjang menghasilkan luas persegi pada kedua sisinya bersama-sama.
- **Sekitar 570–495 SM.** Pythagoras dari Samos, di Italia selatan, mendirikan perguruan yang memakai namanya. Tidak ada tulisannya yang bertahan, dan penghargaan atas teorema ini berasal dari penulis berabad-abad kemudian.
- **Sebelum abad ke-1 SM.** *Zhoubi Suanjing* dari Tiongkok menjelaskan segitiga $3$–$4$–$5$ dan diagram dengan persegi miring, teorema *gougu* (kaki dan kaki).
- **Sekitar 300 SM.** *Elements* Euclid membuktikan teorema ini sebagai I.47 dan kebalikannya sebagai I.48.
- **Abad ke-12.** Bhaskara II menggambar diagram penataan ulang dengan satu kata saja, "Lihatlah!".
- **1876.** Bukti trapesium Garfield terbit.
- **1995.** Wiles membuktikan Teorema Terakhir Fermat, jawaban atas pertanyaan apakah persamaan Pythagoras berlaku dengan pangkat tiga atau lebih.

Sebuah kisah populer mengatakan bahwa bangsa Yunani terguncang oleh penemuan bahwa diagonal persegi bukan perbandingan bilangan bulat, bilangan irasional pertama, yang tak terelakkan akibat teorema ini: lihat [bukti bahwa akar 2 irasional](article:irrational-numbers#why-sqrt2-is-irrational).`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What mistakes do people make with the Pythagorean theorem?', 'Kesalahan apa yang sering terjadi pada teorema Pythagoras?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with the theorem are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ $(a+b)^2=a^2+b^2$ | $(a+b)^2=a^2+2ab+b^2$; the missing $2ab$ is exactly what the proof by rearranging accounts for. |
| ❌ $c=a+b$ | $c=\sqrt{a^2+b^2}$ is shorter than $a+b$: the hypotenuse is a shortcut. |
| ❌ $c^2=25$, so $c=25$ | Take the square root: $c=5$. |
| ❌ A missing leg is $\sqrt{c^2+a^2}$ | Subtract: $b=\sqrt{c^2-a^2}$. |
| ❌ $\sqrt{a^2+b^2}=\sqrt{a^2}+\sqrt{b^2}$ | A root of a sum is not the sum of the roots: $\sqrt{9+16}=5$, but $\sqrt9+\sqrt{16}=7$. |
| ❌ Rounding early: $c^2=2$ so $c=1.41$ | $\sqrt2$ is irrational; keep $\sqrt2$ until the last step. |
| ❌ Every right triangle has whole-number sides | Legs $1$ and $1$ give $\sqrt2$; whole-number sides are the special case of triples. |
| ❌ The theorem tells whether a triangle looks right-angled | It only decides when the numbers match exactly; test with $a^2+b^2=c^2$, not by eye. |
| ❌ Mixing units | Convert first: legs of $3$ ft and $40$ in need one common unit. |`,
            T`**Kesalahan paling umum pada teorema ini adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ $(a+b)^2=a^2+b^2$ | $(a+b)^2=a^2+2ab+b^2$; $2ab$ yang hilang itulah yang dijelaskan oleh bukti dengan menata ulang. |
| ❌ $c=a+b$ | $c=\sqrt{a^2+b^2}$ lebih pendek daripada $a+b$: hipotenusa adalah jalan pintas. |
| ❌ $c^2=25$, sehingga $c=25$ | Tarik akar kuadrat: $c=5$. |
| ❌ Sisi tegak yang hilang adalah $\sqrt{c^2+a^2}$ | Kurangkan: $b=\sqrt{c^2-a^2}$. |
| ❌ $\sqrt{a^2+b^2}=\sqrt{a^2}+\sqrt{b^2}$ | Akar dari jumlah bukan jumlah akar: $\sqrt{9+16}=5$, tetapi $\sqrt9+\sqrt{16}=7$. |
| ❌ Membulatkan terlalu dini: $c^2=2$ sehingga $c=1{,}41$ | $\sqrt2$ irasional; biarkan $\sqrt2$ sampai langkah terakhir. |
| ❌ Setiap segitiga siku-siku bersisi bilangan bulat | Sisi tegak $1$ dan $1$ memberi $\sqrt2$; sisi bilangan bulat adalah kasus khusus tripel. |
| ❌ Teorema menentukan apakah segitiga tampak siku-siku | Ia hanya menentukan bila angkanya cocok persis; uji dengan $a^2+b^2=c^2$, bukan dengan mata. |
| ❌ Satuan campur aduk | Ubah dulu: sisi tegak $3$ kaki dan $40$ inci membutuhkan satu satuan yang sama. |`,
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
              L('In a right triangle, the square of the hypotenuse equals the sum of the squares of the legs.', 'Pada segitiga siku-siku, kuadrat hipotenusa sama dengan jumlah kuadrat sisi tegak.'),
              L('The theorem holds for every triangle.', 'Teorema ini berlaku untuk setiap segitiga.'),
              L('$(a+b)^2=a^2+b^2$.', '$(a+b)^2=a^2+b^2$.'),
              L('$(6,8,10)$ is a Pythagorean triple.', '$(6,8,10)$ adalah tripel Pythagoras.'),
              L('If $a^2+b^2=c^2$, the angle opposite $c$ is a right angle.', 'Jika $a^2+b^2=c^2$, sudut di depan $c$ adalah sudut siku-siku.'),
              L('A triangle with sides $4$, $5$ and $6$ has a right angle.', 'Segitiga dengan sisi $4$, $5$, dan $6$ memiliki sudut siku-siku.'),
            ],
            answer: [true, false, false, true, true, false],
            explain: L(
              'The theorem needs a right angle. $(a+b)^2$ also has the middle term $2ab$. $36+64=100$. The converse is true. For $4,5,6$: $16+25=41\\ne36$.',
              'Teorema ini membutuhkan sudut siku-siku. $(a+b)^2$ juga memiliki suku tengah $2ab$. $36+64=100$. Kebalikannya benar. Untuk $4,5,6$: $16+25=41\\ne36$.',
            ),
            hint: L('Check each claim with numbers: square, add, compare.', 'Periksa tiap pernyataan dengan angka: kuadratkan, jumlahkan, bandingkan.'),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L('Choose **all** the Pythagorean triples.', 'Pilih **semua** tripel Pythagoras.'),
            options: [L('$(5,12,13)$', '$(5,12,13)$'), L('$(8,15,17)$', '$(8,15,17)$'), L('$(7,24,26)$', '$(7,24,26)$'), L('$(20,21,29)$', '$(20,21,29)$'), L('$(9,12,16)$', '$(9,12,16)$')],
            answer: [0, 1, 3],
            explain: L(
              '$25+144=169$, $64+225=289$ and $400+441=841=29^2$. But $49+576=625=25^2$, not $26^2$, and $81+144=225=15^2$, not $16^2$.',
              '$25+144=169$, $64+225=289$, dan $400+441=841=29^2$. Tetapi $49+576=625=25^2$, bukan $26^2$, dan $81+144=225=15^2$, bukan $16^2$.',
            ),
            hint: L('Square the two smaller numbers, add, and compare with the square of the largest.', 'Kuadratkan dua bilangan yang lebih kecil, jumlahkan, dan bandingkan dengan kuadrat yang terbesar.'),
          },
        },
        {
          kind: 'activity',
          title: L('The hypotenuse', 'Hipotenusa'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L('$c=\\sqrt{a^2+b^2}$.', '$c=\\sqrt{a^2+b^2}$.'), L('$64+225=289$.', '$64+225=289$.')],
            explain: L('$c=\\sqrt{64+225}=\\sqrt{289}=17$.', '$c=\\sqrt{64+225}=\\sqrt{289}=17$.'),
            prompt: L('The legs of a right triangle are $8$ and $15$. Find the hypotenuse.', 'Sisi tegak segitiga siku-siku adalah $8$ dan $15$. Tentukan hipotenusanya.'),
            given: String.raw`c=\sqrt{8^2+15^2}=v`,
            blanks: [{ label: 'c =', answer: 17 }],
          },
        },
        {
          kind: 'activity',
          title: L('A missing leg', 'Sisi tegak yang hilang'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L('Subtract: $b=\\sqrt{c^2-a^2}$.', 'Kurangkan: $b=\\sqrt{c^2-a^2}$.'), L('$676-100=576$.', '$676-100=576$.')],
            explain: L('$b=\\sqrt{26^2-10^2}=\\sqrt{676-100}=\\sqrt{576}=24$.', '$b=\\sqrt{26^2-10^2}=\\sqrt{676-100}=\\sqrt{576}=24$.'),
            prompt: L('The hypotenuse is $26$ and one leg is $10$. Find the other leg.', 'Hipotenusanya $26$ dan satu sisi tegak $10$. Tentukan sisi tegak yang lain.'),
            given: String.raw`b=\sqrt{26^2-10^2}=v`,
            blanks: [{ label: 'b =', answer: 24 }],
          },
        },
        {
          kind: 'activity',
          title: L('A square root left alone', 'Akar yang dibiarkan'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [L('$c^2=a^2+b^2$ with $a=2$ and $b=3$.', '$c^2=a^2+b^2$ dengan $a=2$ dan $b=3$.'), L('$4+9=13$, and $\\sqrt{13}$ is not a whole number.', '$4+9=13$, dan $\\sqrt{13}$ bukan bilangan bulat.')],
            explain: L('$c^2=4+9=13$, so $c=\\sqrt{13}\\approx3.61$, an irrational length.', '$c^2=4+9=13$, sehingga $c=\\sqrt{13}\\approx3{,}61$, panjang irasional.'),
            prompt: L('The legs of a right triangle are $2$ and $3$. What is $c^2$?', 'Sisi tegak segitiga siku-siku adalah $2$ dan $3$. Berapa $c^2$?'),
            given: String.raw`c^2=2^2+3^2=v`,
            blanks: [{ label: 'c² =', answer: 13 }],
          },
        },
        {
          kind: 'activity',
          title: L('A ladder', 'Sebuah tangga'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L('The ladder is the hypotenuse.', 'Tangga adalah hipotenusa.'), L('$25-9=16$.', '$25-9=16$.')],
            explain: L('$\\sqrt{5^2-3^2}=\\sqrt{16}=4$ m.', '$\\sqrt{5^2-3^2}=\\sqrt{16}=4$ m.'),
            prompt: L('A 5 m ladder stands with its foot 3 m from a wall. How high up the wall does it reach, in meters?', 'Tangga 5 m berdiri dengan kakinya 3 m dari tembok. Seberapa tinggi ia mencapai tembok, dalam meter?'),
            given: String.raw`h=\sqrt{5^2-3^2}=v`,
            blanks: [{ label: 'h =', answer: 4 }],
          },
        },
        {
          kind: 'activity',
          title: L('A distance', 'Sebuah jarak'),
          step: {
            kind: 'math',
            id: 'p7',
            hints: [L('The legs are the differences of the coordinates: $6$ and $8$.', 'Sisi tegaknya selisih koordinat: $6$ dan $8$.'), L('$36+64=100$.', '$36+64=100$.')],
            explain: L('$\\sqrt{(7-1)^2+(10-2)^2}=\\sqrt{36+64}=10$.', '$\\sqrt{(7-1)^2+(10-2)^2}=\\sqrt{36+64}=10$.'),
            prompt: L('Find the distance between $(1,2)$ and $(7,10)$.', 'Tentukan jarak antara $(1,2)$ dan $(7,10)$.'),
            given: String.raw`d=\sqrt{(7-1)^2+(10-2)^2}=v`,
            blanks: [{ label: 'd =', answer: 10 }],
          },
        },
        {
          kind: 'activity',
          title: L('A box', 'Sebuah balok'),
          step: {
            kind: 'math',
            id: 'p8',
            hints: [L('Use $d=\\sqrt{l^2+w^2+h^2}$.', 'Pakai $d=\\sqrt{l^2+w^2+h^2}$.'), L('$1+16+64=81$.', '$1+16+64=81$.')],
            explain: L('$d=\\sqrt{1+16+64}=\\sqrt{81}=9$.', '$d=\\sqrt{1+16+64}=\\sqrt{81}=9$.'),
            prompt: L('A box is $1$ by $4$ by $8$. How long is its space diagonal?', 'Sebuah balok berukuran $1$ kali $4$ kali $8$. Berapa panjang diagonal ruangnya?'),
            given: String.raw`d=\sqrt{1^2+4^2+8^2}=v`,
            blanks: [{ label: 'd =', answer: 9 }],
          },
        },
        {
          kind: 'activity',
          title: L('The converse', 'Kebalikannya'),
          step: {
            kind: 'quiz',
            id: 'p9',
            prompt: L('Which triangle has a right angle?', 'Segitiga mana yang memiliki sudut siku-siku?'),
            options: [L('sides $6,7,9$', 'sisi $6,7,9$'), L('sides $7,24,25$', 'sisi $7,24,25$'), L('sides $5,6,8$', 'sisi $5,6,8$'), L('sides $4,5,7$', 'sisi $4,5,7$')],
            answer: 1,
            explain: L(
              '$7^2+24^2=49+576=625=25^2$, so the sides $7,24,25$ give a right angle. The others fail: $36+49=85\\ne81$, $25+36=61\\ne64$ and $16+25=41\\ne49$.',
              '$7^2+24^2=49+576=625=25^2$, sehingga sisi $7,24,25$ membentuk sudut siku-siku. Yang lain gagal: $36+49=85\\ne81$, $25+36=61\\ne64$, dan $16+25=41\\ne49$.',
            ),
            hint: L('Square the two shorter sides, add, and compare with the square of the longest.', 'Kuadratkan dua sisi yang lebih pendek, jumlahkan, dan bandingkan dengan kuadrat sisi terpanjang.'),
          },
        },
        {
          kind: 'activity',
          title: L("Euclid's formula", 'Rumus Euclid'),
          step: {
            kind: 'quiz',
            id: 'p10',
            prompt: L("Euclid's formula with $m=4$ and $n=3$ gives which triple?", 'Rumus Euclid dengan $m=4$ dan $n=3$ memberi tripel yang mana?'),
            options: [L('$(7,24,25)$', '$(7,24,25)$'), L('$(8,6,10)$', '$(8,6,10)$'), L('$(15,8,17)$', '$(15,8,17)$'), L('$(12,5,13)$', '$(12,5,13)$')],
            answer: 0,
            explain: L('$m^2-n^2=16-9=7$, $2mn=24$ and $m^2+n^2=16+9=25$.', '$m^2-n^2=16-9=7$, $2mn=24$, dan $m^2+n^2=16+9=25$.'),
            hint: L('Compute $m^2-n^2$, $2mn$ and $m^2+n^2$.', 'Hitung $m^2-n^2$, $2mn$, dan $m^2+n^2$.'),
          },
        },
        {
          kind: 'activity',
          title: L('A diagonal path', 'Jalan setapak diagonal'),
          step: {
            kind: 'quiz',
            id: 'p11',
            prompt: L(
              'A rectangular garden is 24 m by 32 m. A paved path along the diagonal costs 30 dollars per meter. What does the path cost?',
              'Sebuah taman persegi panjang berukuran 24 m kali 32 m. Jalan setapak berpaving sepanjang diagonal berharga Rp200.000 per meter. Berapa biaya jalan itu?',
            ),
            options: [L('1,200 dollars', 'Rp8.000.000'), L('1,680 dollars', 'Rp11.200.000'), L('840 dollars', 'Rp5.600.000'), L('2,400 dollars', 'Rp16.000.000')],
            answer: 0,
            explain: L(
              'The diagonal is $\\sqrt{24^2+32^2}=\\sqrt{1600}=40$ m, so the path costs $40\\cdot30=1200$ dollars.',
              'Diagonalnya $\\sqrt{24^2+32^2}=\\sqrt{1600}=40$ m, sehingga biaya jalannya 40 kali Rp200.000, yaitu Rp8.000.000.',
            ),
            hint: L('This is $8\\cdot(3,4)$, so the diagonal is $8\\cdot5$.', 'Ini $8\\cdot(3,4)$, sehingga diagonalnya $8\\cdot5$.'),
          },
        },
        {
          kind: 'activity',
          title: L('Higher powers', 'Pangkat yang lebih tinggi'),
          step: {
            kind: 'quiz',
            id: 'p12',
            prompt: L('Which of these equations has solutions in positive whole numbers?', 'Persamaan mana yang memiliki penyelesaian bilangan bulat positif?'),
            options: [L('$x^2+y^2=z^2$', '$x^2+y^2=z^2$'), L('$x^3+y^3=z^3$', '$x^3+y^3=z^3$'), L('$x^4+y^4=z^4$', '$x^4+y^4=z^4$'), L('$x^5+y^5=z^5$', '$x^5+y^5=z^5$')],
            answer: 0,
            explain: L(
              'The square equation has infinitely many solutions, the Pythagorean triples. By Fermat\'s Last Theorem (Wiles, 1995) the equations with exponent $3$ or more have none.',
              'Persamaan kuadrat memiliki tak berhingga penyelesaian, yaitu tripel Pythagoras. Menurut Teorema Terakhir Fermat (Wiles, 1995) persamaan dengan pangkat $3$ atau lebih tidak memilikinya.',
            ),
            hint: L('Only one exponent has the triples $3,4,5$ and $5,12,13$.', 'Hanya satu pangkat yang memiliki tripel $3,4,5$ dan $5,12,13$.'),
          },
        },
      ],
    },

    /* ---------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: the Pythagorean theorem at a glance', 'Ringkasan: teorema Pythagoras sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Statement:** right triangle with legs $a,b$ and hypotenuse $c$: $a^2+b^2=c^2$; $c=\sqrt{a^2+b^2}$, a leg is $\sqrt{c^2-a^2}$.
- **Proofs:** rearranging four triangles in an $(a+b)$ square; similar triangles ($a^2=cp$, $b^2=cq$); Euclid's shearing; Garfield's trapezoid.
- **Converse:** $a^2+b^2=c^2\Rightarrow$ right angle; the $3$–$4$–$5$ rope, the diagonal check.
- **Triples:** $(m^2-n^2,2mn,m^2+n^2)$; primitive when $\gcd(m,n)=1$ and opposite parity; $60\mid abc$; Berggren tree from $(3,4,5)$.
- **Distance:** $\sqrt{\Delta x^2+\Delta y^2}$; box diagonal $\sqrt{l^2+w^2+h^2}$.
- **Generalizations:** law of cosines, similar shapes on the sides, any dimension, spheres ($\cos c=\cos a\cos b$), Fermat's Last Theorem.
- **Code:** ´math.hypot´, whole-number tests with ´isqrt´, never float equality.`,
            T`- **Pernyataan:** segitiga siku-siku dengan sisi tegak $a,b$ dan hipotenusa $c$: $a^2+b^2=c^2$; $c=\sqrt{a^2+b^2}$, sisi tegak adalah $\sqrt{c^2-a^2}$.
- **Bukti:** menata ulang empat segitiga dalam persegi $(a+b)$; segitiga sebangun ($a^2=cp$, $b^2=cq$); penggeseran Euclid; trapesium Garfield.
- **Kebalikan:** $a^2+b^2=c^2\Rightarrow$ sudut siku-siku; tali $3$–$4$–$5$, pemeriksaan diagonal.
- **Tripel:** $(m^2-n^2,2mn,m^2+n^2)$; primitif bila $\gcd(m,n)=1$ dan paritas berbeda; $60\mid abc$; pohon Berggren dari $(3,4,5)$.
- **Jarak:** $\sqrt{\Delta x^2+\Delta y^2}$; diagonal ruang balok $\sqrt{l^2+w^2+h^2}$.
- **Perluasan:** aturan kosinus, bangun sebangun pada sisi-sisinya, dimensi mana pun, bola ($\cos c=\cos a\cos b$), Teorema Terakhir Fermat.
- **Kode:** ´math.hypot´, uji bilangan bulat dengan ´isqrt´, jangan kesamaan float.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Pythagorean theorem', 'Teorema Pythagoras'), definition: L('The rule that in a right triangle the square of the hypotenuse equals the sum of the squares of the two legs.', 'Aturan bahwa pada segitiga siku-siku kuadrat hipotenusa sama dengan jumlah kuadrat kedua sisi tegak.') },
    { term: L('Legs of a right triangle', 'Sisi tegak segitiga siku-siku'), definition: L('The two sides of a right triangle that meet at the right angle, as opposed to the hypotenuse.', 'Dua sisi segitiga siku-siku yang bertemu di sudut siku-siku, berbeda dari hipotenusa.') },
    { term: L('Converse of the Pythagorean theorem', 'Kebalikan teorema Pythagoras'), definition: L('The statement that a triangle whose sides satisfy a squared plus b squared equals c squared has a right angle opposite the side c.', 'Pernyataan bahwa segitiga yang sisinya memenuhi a kuadrat ditambah b kuadrat sama dengan c kuadrat memiliki sudut siku-siku di depan sisi c.') },
    { term: L('Pythagorean triple', 'Tripel Pythagoras'), definition: L('Three positive whole numbers a, b and c with a squared plus b squared equal to c squared, such as 3, 4 and 5.', 'Tiga bilangan bulat positif a, b, dan c dengan a kuadrat ditambah b kuadrat sama dengan c kuadrat, seperti 3, 4, dan 5.') },
    { term: L('Primitive Pythagorean triple', 'Tripel Pythagoras primitif'), definition: L('A Pythagorean triple whose three numbers have no common factor greater than 1, so it is not a multiple of a smaller triple.', 'Tripel Pythagoras yang ketiga bilangannya tidak punya faktor persekutuan lebih dari 1, sehingga bukan kelipatan tripel yang lebih kecil.') },
    { term: L("Euclid's formula", 'Rumus Euclid'), definition: L('The rule that for whole numbers m greater than n the numbers m squared minus n squared, 2mn and m squared plus n squared form a Pythagorean triple.', 'Aturan bahwa untuk bilangan bulat m lebih besar dari n bilangan m kuadrat dikurangi n kuadrat, 2mn, dan m kuadrat ditambah n kuadrat membentuk tripel Pythagoras.') },
    { term: L('Berggren tree', 'Pohon Berggren'), definition: L('The tree that starts at the triple 3, 4, 5 and gives every primitive Pythagorean triple exactly once through three rules that produce three children.', 'Pohon yang bermula dari tripel 3, 4, 5 dan memberi setiap tripel Pythagoras primitif tepat satu kali lewat tiga aturan yang menghasilkan tiga anak.') },
    { term: L('Distance formula', 'Rumus jarak'), definition: L('The formula that gives the distance between two points as the square root of the sum of the squared coordinate differences, found with the Pythagorean theorem.', 'Rumus yang memberi jarak antara dua titik sebagai akar dari jumlah kuadrat selisih koordinat, ditemukan dengan teorema Pythagoras.') },
    { term: L("Fermat's Last Theorem", 'Teorema Terakhir Fermat'), definition: L('The theorem that x to the power n plus y to the power n equals z to the power n has no solution in positive whole numbers when n is greater than 2.', 'Teorema bahwa x pangkat n ditambah y pangkat n sama dengan z pangkat n tidak memiliki penyelesaian bilangan bulat positif bila n lebih besar dari 2.') },
  ],

  howTo: [
    {
      name: L('How to find the missing side of a right triangle', 'Cara mencari sisi yang hilang pada segitiga siku-siku'),
      description: L('Decide whether the unknown is the hypotenuse or a leg, then add or subtract the squares.', 'Tentukan apakah yang tidak diketahui hipotenusa atau sisi tegak, lalu jumlahkan atau kurangkan kuadratnya.'),
      steps: [
        { name: L('Find the hypotenuse', 'Tentukan hipotenusa'), text: L('The hypotenuse is the side opposite the right angle and the longest side; call it c.', 'Hipotenusa adalah sisi di depan sudut siku-siku dan sisi terpanjang; namai c.') },
        { name: L('Write the equation', 'Tulis persamaannya'), text: L('Write a squared plus b squared equal to c squared with the known numbers filled in.', 'Tulis a kuadrat ditambah b kuadrat sama dengan c kuadrat dengan bilangan yang diketahui.') },
        { name: L('Add or subtract the squares', 'Jumlahkan atau kurangkan kuadratnya'), text: L('For the hypotenuse add the two squared legs; for a leg subtract the other squared leg from c squared.', 'Untuk hipotenusa jumlahkan kuadrat kedua sisi tegak; untuk sisi tegak kurangkan kuadrat sisi tegak lainnya dari c kuadrat.') },
        { name: L('Take the square root', 'Tarik akar kuadrat'), text: L('Take the positive square root; legs 8 and 15 give the root of 289, which is 17.', 'Tarik akar kuadrat positif; sisi tegak 8 dan 15 memberi akar dari 289, yaitu 17.') },
      ],
    },
    {
      name: L('How to check that a corner is square with the 3-4-5 method', 'Cara memeriksa bahwa sudut siku dengan metode 3-4-5'),
      description: L('Measure 3 units along one side and 4 along the other, and check that the distance between the marks is exactly 5.', 'Ukur 3 satuan sepanjang satu sisi dan 4 sepanjang sisi lain, lalu periksa bahwa jarak antara kedua tanda tepat 5.'),
      steps: [
        { name: L('Mark 3 units on one side', 'Tandai 3 satuan pada satu sisi'), text: L('Measure 3 units from the corner along one edge and make a mark; any unit works.', 'Ukur 3 satuan dari sudut sepanjang satu tepi dan buat tanda; satuan apa pun boleh.') },
        { name: L('Mark 4 units on the other side', 'Tandai 4 satuan pada sisi lain'), text: L('Measure 4 of the same units from the corner along the other edge and make a mark.', 'Ukur 4 satuan yang sama dari sudut sepanjang tepi lain dan buat tanda.') },
        { name: L('Measure across', 'Ukur melintang'), text: L('Measure the straight distance between the two marks.', 'Ukur jarak lurus antara kedua tanda.') },
        { name: L('Compare with 5', 'Bandingkan dengan 5'), text: L('If the distance is exactly 5 units the corner is square; if it is longer the angle is too wide, if shorter too narrow.', 'Jika jaraknya tepat 5 satuan sudutnya siku; jika lebih panjang sudutnya terlalu lebar, jika lebih pendek terlalu sempit.') },
      ],
    },
    {
      name: L("How to generate Pythagorean triples with Euclid's formula", 'Cara membuat tripel Pythagoras dengan rumus Euclid'),
      description: L('Choose two whole numbers m and n and compute three expressions.', 'Pilih dua bilangan bulat m dan n lalu hitung tiga ekspresi.'),
      steps: [
        { name: L('Choose m and n', 'Pilih m dan n'), text: L('Pick whole numbers with m greater than n; for a primitive triple make them coprime with one even.', 'Pilih bilangan bulat dengan m lebih besar dari n; untuk tripel primitif buat keduanya saling prima dengan salah satunya genap.') },
        { name: L('Compute the first leg', 'Hitung sisi tegak pertama'), text: L('Subtract the squares: for m equal to 4 and n equal to 3 the leg is 16 minus 9, which is 7.', 'Kurangkan kuadratnya: untuk m sama dengan 4 dan n sama dengan 3 sisi tegaknya 16 dikurangi 9, yaitu 7.') },
        { name: L('Compute the second leg', 'Hitung sisi tegak kedua'), text: L('Take twice the product: 2 times 4 times 3 is 24.', 'Ambil dua kali hasil kali: 2 kali 4 kali 3 adalah 24.') },
        { name: L('Compute the hypotenuse', 'Hitung hipotenusa'), text: L('Add the squares: 16 plus 9 is 25, giving the triple 7, 24, 25.', 'Jumlahkan kuadratnya: 16 ditambah 9 adalah 25, memberi tripel 7, 24, 25.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is the Pythagorean theorem?', 'Apa itu teorema Pythagoras?'),
      a: L(
        'In a right triangle the square of the hypotenuse equals the sum of the squares of the two legs, written a squared plus b squared equals c squared. For legs 3 and 4 the hypotenuse is 5. It only holds for triangles with a right angle.',
        'Pada segitiga siku-siku kuadrat hipotenusa sama dengan jumlah kuadrat kedua sisi tegak, ditulis a kuadrat ditambah b kuadrat sama dengan c kuadrat. Untuk sisi tegak 3 dan 4 hipotenusanya 5. Teorema ini hanya berlaku untuk segitiga bersudut siku-siku.',
      ),
    },
    {
      q: L('What is the formula for the Pythagorean theorem?', 'Apa rumus teorema Pythagoras?'),
      a: L(
        'The formula is a squared plus b squared equals c squared, where c is the hypotenuse. The hypotenuse is the square root of a squared plus b squared, and a missing leg is the square root of c squared minus a squared.',
        'Rumusnya a kuadrat ditambah b kuadrat sama dengan c kuadrat, dengan c hipotenusa. Hipotenusa adalah akar dari a kuadrat ditambah b kuadrat, dan sisi tegak yang hilang adalah akar dari c kuadrat dikurangi a kuadrat.',
      ),
    },
    {
      q: L('Who discovered the Pythagorean theorem?', 'Siapa yang menemukan teorema Pythagoras?'),
      a: L(
        'No single person did. Babylonian tablets from about 1800 BCE list triples, Indian and Chinese texts state the rule, and Euclid gave the first proofs that survive. It is named after Pythagoras of Samos, but nothing he wrote has survived.',
        'Tidak ada satu orang pun. Lempeng Babilonia sekitar 1800 SM mendaftar tripel, teks India dan Tiongkok menyatakan aturannya, dan Euclid memberi bukti pertama yang bertahan. Namanya diambil dari Pythagoras dari Samos, tetapi tidak ada tulisannya yang bertahan.',
      ),
    },
    {
      q: L('How do you prove the Pythagorean theorem?', 'Bagaimana membuktikan teorema Pythagoras?'),
      a: L(
        'One proof puts four copies of the triangle inside a square of side a plus b. They leave either a tilted square of side c or two squares of sides a and b, so c squared equals a squared plus b squared. There are hundreds of other proofs.',
        'Salah satu bukti meletakkan empat salinan segitiga di dalam persegi bersisi a ditambah b. Segitiga-segitiga itu menyisakan persegi miring bersisi c atau dua persegi bersisi a dan b, sehingga c kuadrat sama dengan a kuadrat ditambah b kuadrat. Ada ratusan bukti lain.',
      ),
    },
    {
      q: L('What is the converse of the Pythagorean theorem?', 'Apa kebalikan teorema Pythagoras?'),
      a: L(
        'If the sides of a triangle satisfy a squared plus b squared equals c squared, the angle opposite c is a right angle. It follows because a right triangle with legs a and b has the same three sides, so the two triangles are congruent.',
        'Jika sisi-sisi segitiga memenuhi a kuadrat ditambah b kuadrat sama dengan c kuadrat, sudut di depan c adalah sudut siku-siku. Itu karena segitiga siku-siku dengan sisi tegak a dan b memiliki ketiga sisi yang sama, sehingga kedua segitiga kongruen.',
      ),
    },
    {
      q: L('What is the 3-4-5 rule?', 'Apa aturan 3-4-5?'),
      a: L(
        'It is a builder\'s method to make a right angle. Mark 3 units on one line and 4 units on the other from the corner; if the distance between the marks is exactly 5 units, the corner is square, because 3 squared plus 4 squared is 5 squared.',
        'Itu metode tukang bangunan untuk membuat sudut siku-siku. Tandai 3 satuan pada satu garis dan 4 satuan pada garis lain dari sudut; jika jarak antara kedua tanda tepat 5 satuan, sudutnya siku, karena 3 kuadrat ditambah 4 kuadrat adalah 5 kuadrat.',
      ),
    },
    {
      q: L('What are Pythagorean triples?', 'Apa itu tripel Pythagoras?'),
      a: L(
        'They are sets of three positive whole numbers a, b and c with a squared plus b squared equal to c squared, such as 3, 4, 5 and 5, 12, 13. A primitive triple has no common factor, and every other triple is a multiple of one.',
        'Itu kumpulan tiga bilangan bulat positif a, b, dan c dengan a kuadrat ditambah b kuadrat sama dengan c kuadrat, seperti 3, 4, 5 dan 5, 12, 13. Tripel primitif tidak punya faktor persekutuan, dan setiap tripel lain adalah kelipatan salah satunya.',
      ),
    },
    {
      q: L('How do you generate Pythagorean triples?', 'Bagaimana membuat tripel Pythagoras?'),
      a: L(
        'Use Euclid\'s formula: for whole numbers m greater than n, the numbers m squared minus n squared, 2mn and m squared plus n squared form a triple. With m 2 and n 1 it gives 3, 4, 5; with m 3 and n 2 it gives 5, 12, 13.',
        'Pakai rumus Euclid: untuk bilangan bulat m lebih besar dari n, bilangan m kuadrat dikurangi n kuadrat, 2mn, dan m kuadrat ditambah n kuadrat membentuk tripel. Dengan m 2 dan n 1 hasilnya 3, 4, 5; dengan m 3 dan n 2 hasilnya 5, 12, 13.',
      ),
    },
    {
      q: L('How does the Pythagorean theorem give the distance formula?', 'Bagaimana teorema Pythagoras memberi rumus jarak?'),
      a: L(
        'The segment between two points is the hypotenuse of a right triangle whose legs are the differences of the x and y coordinates. So the distance is the square root of the squared x difference plus the squared y difference.',
        'Ruas garis antara dua titik adalah hipotenusa segitiga siku-siku yang sisi tegaknya selisih koordinat x dan y. Jadi jaraknya adalah akar dari kuadrat selisih x ditambah kuadrat selisih y.',
      ),
    },
    {
      q: L('How do you find the diagonal of a box?', 'Bagaimana mencari diagonal ruang balok?'),
      a: L(
        'Apply the theorem twice: the diagonal is the square root of length squared plus width squared plus height squared. A box 2 by 3 by 6 has a diagonal of the square root of 49, which is 7.',
        'Terapkan teorema dua kali: diagonal ruang adalah akar dari panjang kuadrat ditambah lebar kuadrat ditambah tinggi kuadrat. Balok 2 kali 3 kali 6 memiliki diagonal ruang akar dari 49, yaitu 7.',
      ),
    },
    {
      q: L('Does the Pythagorean theorem work for triangles that are not right triangles?', 'Apakah teorema Pythagoras berlaku untuk segitiga yang bukan siku-siku?'),
      a: L(
        'Not as stated. For any triangle use the law of cosines, c squared equals a squared plus b squared minus 2ab times the cosine of the angle between a and b. For a right angle the cosine is zero and it becomes the Pythagorean theorem.',
        'Tidak seperti yang dinyatakan. Untuk segitiga mana pun pakai aturan kosinus, c kuadrat sama dengan a kuadrat ditambah b kuadrat dikurangi 2ab kali kosinus sudut di antara a dan b. Untuk sudut siku-siku kosinusnya nol dan ia menjadi teorema Pythagoras.',
      ),
    },
    {
      q: L('Is there a Pythagorean theorem for cubes and higher powers?', 'Adakah teorema Pythagoras untuk pangkat tiga dan lebih tinggi?'),
      a: L(
        'There is no such equation with whole-number solutions. Fermat\'s Last Theorem says that x to the n plus y to the n equals z to the n has no positive whole-number solution for n greater than 2, and Andrew Wiles proved it in 1995.',
        'Tidak ada persamaan seperti itu dengan penyelesaian bilangan bulat. Teorema Terakhir Fermat menyatakan bahwa x pangkat n ditambah y pangkat n sama dengan z pangkat n tidak punya penyelesaian bilangan bulat positif untuk n lebih besar dari 2, dan Andrew Wiles membuktikannya pada 1995.',
      ),
    },
    {
      q: L('How do you use the Pythagorean theorem in Python?', 'Bagaimana memakai teorema Pythagoras di Python?'),
      a: L(
        'Use math.hypot for lengths, because it avoids overflow, and math.dist for the distance between points. To test a right angle compare whole numbers, a times a plus b times b equal to c times c, not float square roots, which round.',
        'Pakai math.hypot untuk panjang, karena menghindari luapan, dan math.dist untuk jarak antara titik. Untuk menguji sudut siku-siku bandingkan bilangan bulat, a kali a ditambah b kali b sama dengan c kali c, bukan akar float yang dibulatkan.',
      ),
    },
  ],

  references: [
    { title: 'The Thirteen Books of Euclid\'s Elements (2nd ed.), Book I, propositions 47 and 48', author: 'Thomas L. Heath (translator)', year: 1908, source: 'Cambridge University Press' },
    { title: 'The Pythagorean Theorem: A 4,000-Year History', author: 'Eli Maor', year: 2007, source: 'Princeton University Press' },
    { title: 'The Pythagorean Proposition', author: 'Elisha Scott Loomis', year: 1940, source: 'National Council of Teachers of Mathematics' },
    { title: 'Mathematical Cuneiform Texts (the tablet Plimpton 322)', author: 'Otto Neugebauer and Abraham Sachs', year: 1945, source: 'American Oriental Society' },
    { title: 'A new proof of the Pythagorean theorem', author: 'James A. Garfield', year: 1876, source: 'New-England Journal of Education, 3(14), 161' },
    { title: 'The Python Standard Library: math (hypot, dist and isqrt)', author: 'Python Software Foundation', source: 'docs.python.org', url: 'https://docs.python.org/3/library/math.html' },
  ],

  related: ['triangles', 'circles', 'quadrilaterals', 'irrational-numbers'],
}
