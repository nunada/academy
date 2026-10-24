import type { Figure } from '../../lib/figure'
import type { Loc } from '../types'
import type { ArticleBlock, ArticleBody } from './types'
import { meta } from './law-of-cosines.meta'

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

/* ------------------------------------------------------------------------------- the figures */

/** The proof for an acute angle: the altitude from A cuts a into b cos C and a − b cos C. */
const FIG_ACUTE: ArticleBlock = fig({
  range: 1.6, // the size of the angle arc and of the right-angle mark follows this
  xSpan: [-0.8, 6.9],
  ySpan: [-1.2, 3.9],
  items: [
    { t: 'poly', pts: [[0, 0], [6, 0], [2.6, 3.2]], color: 'a' },
    { t: 'seg', from: [0, 0], to: [6, 0], color: 'b', width: 2.6, label: 'a' },
    { t: 'seg', from: [0, 0], to: [2.6, 3.2], color: 'c', width: 2.6, label: 'b' },
    { t: 'seg', from: [2.6, 3.2], to: [6, 0], color: 'result', width: 2.6, label: 'c' },
    { t: 'seg', from: [2.6, 0], to: [2.6, 3.2], color: 'muted', width: 2, dashed: true, label: 'h' },
    { t: 'right', at: [2.6, 0], from: [0, 0], to: [2.6, 3.2] },
    { t: 'angle', at: [0, 0], from: [1, 0], to: [2.6, 3.2], label: 'C' },
    { t: 'text', at: [1.3, -0.6], text: 'b cos C', size: 'sm', color: 'c' },
    { t: 'text', at: [4.3, -0.6], text: 'a − b cos C', size: 'sm', color: 'b' },
    { t: 'point', at: [0, 0], color: 'muted' },
    { t: 'point', at: [6, 0], color: 'muted' },
    { t: 'point', at: [2.6, 3.2], color: 'muted' },
  ],
  caption: L(
    T`An acute angle $C$. The altitude $h$ from $A$ falls on the side $a$ and cuts it into $b\cos C$ and $a-b\cos C$, with $h=b\sin C$. Pythagoras in the right triangle on the right gives $c^2=h^2+(a-b\cos C)^2$, which with $h=b\sin C$ expands to $a^2+b^2-2ab\cos C$.`,
    T`Sudut $C$ lancip. Garis tinggi $h$ dari $A$ jatuh pada sisi $a$ dan membaginya menjadi $b\cos C$ dan $a-b\cos C$, dengan $h=b\sin C$. Pythagoras pada segitiga siku-siku di kanan memberi $c^2=h^2+(a-b\cos C)^2$, yang dengan $h=b\sin C$ dijabarkan menjadi $a^2+b^2-2ab\cos C$.`,
  ),
})

/** The same for an obtuse angle: the foot of the altitude is outside, and b cos C is negative. */
const FIG_OBTUSE: ArticleBlock = fig({
  range: 1.6,
  xSpan: [-2.6, 6.2],
  ySpan: [-1.2, 3.9],
  items: [
    { t: 'poly', pts: [[0, 0], [5, 0], [-1.6, 3]], color: 'a' },
    { t: 'seg', from: [0, 0], to: [5, 0], color: 'b', width: 2.6, label: 'a' },
    { t: 'seg', from: [0, 0], to: [-1.6, 3], color: 'c', width: 2.6, label: 'b' },
    { t: 'seg', from: [-1.6, 3], to: [5, 0], color: 'result', width: 2.6, label: 'c' },
    { t: 'seg', from: [-1.6, 0], to: [-1.6, 3], color: 'muted', width: 2, dashed: true, label: 'h' },
    { t: 'seg', from: [-1.6, 0], to: [0, 0], color: 'muted', width: 2, dashed: true },
    { t: 'right', at: [-1.6, 0], from: [5, 0], to: [-1.6, 3] },
    { t: 'angle', at: [0, 0], from: [1, 0], to: [-1.6, 3], label: 'C' },
    { t: 'text', at: [-0.8, -0.6], text: '|b cos C|', size: 'sm', color: 'c' },
    { t: 'text', at: [2.5, -0.6], text: 'a + |b cos C|', size: 'sm', color: 'b' },
    { t: 'point', at: [0, 0], color: 'muted' },
    { t: 'point', at: [5, 0], color: 'muted' },
    { t: 'point', at: [-1.6, 3], color: 'muted' },
  ],
  caption: L(
    T`An obtuse angle $C$. The foot of the altitude is now outside the triangle, on the extension of $a$, at the distance $|b\cos C|=-b\cos C$ from $C$. The right triangle has the leg $a+|b\cos C|=a-b\cos C$, so the same computation gives $c^2=h^2+(a-b\cos C)^2=a^2+b^2-2ab\cos C$: the formula needs no separate case, since $\cos C$ is negative.`,
    T`Sudut $C$ tumpul. Kaki garis tinggi kini berada di luar segitiga, pada perpanjangan $a$, berjarak $|b\cos C|=-b\cos C$ dari $C$. Segitiga siku-siku itu memiliki sisi tegak $a+|b\cos C|=a-b\cos C$, sehingga perhitungan yang sama memberi $c^2=h^2+(a-b\cos C)^2=a^2+b^2-2ab\cos C$: rumusnya tak memerlukan kasus tersendiri, karena $\cos C$ negatif.`,
  ),
})

/** Two forces of 30 and 40 at 60°. */
const FIG_FORCES: ArticleBlock = fig({
  range: 2.2,
  xSpan: [-0.8, 6.0],
  ySpan: [-0.8, 4.4],
  items: [
    { t: 'poly', pts: [[0, 0], [3, 0], [5, 3.4641]], color: 'a' },
    { t: 'seg', from: [2, 3.4641], to: [5, 3.4641], color: 'muted', dashed: true, width: 1.6 },
    { t: 'seg', from: [3, 0], to: [5, 3.4641], color: 'muted', dashed: true, width: 1.6 },
    { t: 'vec', from: [0, 0], to: [3, 0], color: 'b', label: 'F₁' },
    { t: 'vec', from: [0, 0], to: [2, 3.4641], color: 'c', label: 'F₂' },
    { t: 'vec', from: [0, 0], to: [5, 3.4641], color: 'result', label: 'R' },
    { t: 'angle', at: [0, 0], from: [1, 0], to: [2, 3.4641], label: '60°' },
    { t: 'angle', at: [3, 0], from: [0, 0], to: [5, 3.4641], label: '120°' },
  ],
  caption: L(
    T`Two forces of $30$ N and $40$ N whose directions make an angle of $60^\circ$ (drawn at a tenth of the scale). Their sum $R$ is the diagonal of the parallelogram, and the triangle $0,F_1,R$ has the angle $180^\circ-60^\circ=120^\circ$ at the end of $F_1$. So $R^2=30^2+40^2-2\cdot30\cdot40\cos120^\circ=3700$ and $R\approx60.83$ N.`,
    T`Dua gaya $30$ N dan $40$ N yang arahnya membentuk sudut $60^\circ$ (digambar pada sepersepuluh skala). Jumlahnya $R$ adalah diagonal jajar genjang, dan segitiga $0,F_1,R$ memiliki sudut $180^\circ-60^\circ=120^\circ$ di ujung $F_1$. Jadi $R^2=30^2+40^2-2\cdot30\cdot40\cos120^\circ=3700$ dan $R\approx60{,}83$ N.`,
  ),
})

/** The ship: 120 km on 060°, then 90 km on 120°, drawn at a twentieth of the scale (north up). */
const FIG_TRIP: ArticleBlock = fig({
  range: 4,
  xSpan: [-1.5, 10.6],
  ySpan: [-1.2, 4.6],
  items: [
    { t: 'poly', pts: [[0, 0], [5.196, 3.0], [9.093, 0.75]], color: 'a' },
    { t: 'seg', from: [0, 0], to: [9.093, 0.75], color: 'result', width: 2, dashed: true },
    { t: 'seg', from: [0, 0], to: [5.196, 3.0], color: 'b', width: 3 },
    { t: 'seg', from: [5.196, 3.0], to: [9.093, 0.75], color: 'c', width: 3 },
    { t: 'vec', from: [-1.0, 0], to: [-1.0, 1.7], color: 'muted' },
    { t: 'text', at: [-1.0, 2.15], text: 'N', size: 'sm', color: 'muted' },
    { t: 'angle', at: [5.196, 3.0], from: [0, 0], to: [9.093, 0.75], label: '120°' },
    { t: 'text', at: [2.1, 2.2], text: '120 km · 060°', size: 'sm', color: 'b' },
    { t: 'text', at: [7.7, 2.7], text: '90 km · 120°', size: 'sm', color: 'c' },
    { t: 'text', at: [4.6, -0.55], text: '182.5 km · 085.3°', size: 'sm', color: 'result' },
    { t: 'point', at: [0, 0], color: 'muted' },
    { t: 'point', at: [5.196, 3.0], color: 'muted' },
    { t: 'point', at: [9.093, 0.75], color: 'result' },
  ],
  caption: L(
    T`A ship sails $120$ km on bearing $060^\circ$ (measured clockwise from north) and then $90$ km on bearing $120^\circ$. The course turns by $60^\circ$ at the bend, so the triangle's angle there is $180^\circ-60^\circ=120^\circ$ and the law of cosines gives the distance back to the start: $\sqrt{120^2+90^2-2\cdot120\cdot90\cos120^\circ}=\sqrt{33300}\approx182.5$ km, on bearing $085.3^\circ$.`,
    T`Sebuah kapal berlayar $120$ km pada arah $060^\circ$ (diukur searah jarum jam dari utara) lalu $90$ km pada arah $120^\circ$. Haluan berbelok $60^\circ$ di tikungan, sehingga sudut segitiga di sana $180^\circ-60^\circ=120^\circ$ dan aturan kosinus memberi jarak ke awal: $\sqrt{120^2+90^2-2\cdot120\cdot90\cos120^\circ}=\sqrt{33300}\approx182{,}5$ km, pada arah $085{,}3^\circ$.`,
  ),
})

export const body: ArticleBody = {
  answer: L(
    T`**The law of cosines says that in a triangle with sides $a$, $b$ and the angle $C$ between them, the opposite side satisfies $c^2=a^2+b^2-2ab\cos C$: the Pythagorean theorem with a correction that vanishes at a right angle.** It finds the third side from two sides and the angle between them, and every angle from three sides, with $\cos C=\frac{a^2+b^2-c^2}{2ab}$. The sign of the correction also says whether the angle is acute, right or obtuse. It also adds forces at an angle.`,
    T`**Aturan kosinus mengatakan bahwa pada segitiga dengan sisi $a$, $b$ dan sudut $C$ di antaranya, sisi di depannya memenuhi $c^2=a^2+b^2-2ab\cos C$: teorema Pythagoras dengan koreksi yang lenyap pada sudut siku-siku.** Ia mencari sisi ketiga dari dua sisi dan sudut apitnya, dan setiap sudut dari tiga sisi, dengan $\cos C=\frac{a^2+b^2-c^2}{2ab}$. Tanda koreksinya juga mengatakan apakah sudutnya lancip, siku-siku, atau tumpul. Rumus yang sama menjumlahkan dua gaya pada sebuah sudut dan mengubah dua leg perjalanan menjadi jarak.`,
  ),

  keyPoints: [
    L(
      T`In $c^2=a^2+b^2-2ab\cos C$, $C$ is the angle *between* $a$ and $b$, which is also the angle opposite $c$. At $C=90^\circ$, $\cos C=0$ and it is the Pythagorean theorem; for an acute angle the correction subtracts and $c$ is shorter than the hypotenuse of the same legs, for an obtuse angle it adds.`,
      T`Pada $c^2=a^2+b^2-2ab\cos C$, $C$ adalah sudut *di antara* $a$ dan $b$, yang juga sudut di depan $c$. Pada $C=90^\circ$, $\cos C=0$ dan ia menjadi teorema Pythagoras; untuk sudut lancip koreksinya mengurangi dan $c$ lebih pendek daripada sisi miring bersisi tegak yang sama, untuk sudut tumpul ia menambah.`,
    ),
    L(
      T`It follows from one altitude and Pythagoras: the altitude splits $a$ into $b\cos C$ and $a-b\cos C$ (the first is negative, and the foot falls outside, if $C$ is obtuse), and $c^2=h^2+(a-b\cos C)^2$ with $h=b\sin C$.`,
      T`Ia mengikuti dari satu garis tinggi dan Pythagoras: garis tinggi membagi $a$ menjadi $b\cos C$ dan $a-b\cos C$ (yang pertama negatif, dan kakinya jatuh di luar, bila $C$ tumpul), dan $c^2=h^2+(a-b\cos C)^2$ dengan $h=b\sin C$.`,
    ),
    L(
      T`Two sides and the angle between them (SAS) give the third side directly. Three sides (SSS) give every angle, $\cos C=\frac{a^2+b^2-c^2}{2ab}$: find the largest angle first, the one opposite the longest side, because it is the only one that can be obtuse.`,
      T`Dua sisi dan sudut apitnya (SAS) memberi sisi ketiga secara langsung. Tiga sisi (SSS) memberi setiap sudut, $\cos C=\frac{a^2+b^2-c^2}{2ab}$: cari sudut terbesar dulu, yang di depan sisi terpanjang, karena hanya ia yang dapat tumpul.`,
    ),
    L(
      T`Since $-1\le\cos C\le1$, the third side is always between $|a-b|$ and $a+b$: the law contains the triangle inequality. And comparing $c^2$ with $a^2+b^2$ tells acute, right or obtuse from the sides alone, which proves the converse of the Pythagorean theorem.`,
      T`Karena $-1\le\cos C\le1$, sisi ketiga selalu berada di antara $|a-b|$ dan $a+b$: aturan itu memuat ketaksamaan segitiga. Dan membandingkan $c^2$ dengan $a^2+b^2$ memberi tahu lancip, siku-siku, atau tumpul dari sisi-sisinya saja, yang membuktikan kebalikan teorema Pythagoras.`,
    ),
    L(
      T`Two forces $F_1$ and $F_2$ whose directions make the angle $\theta$ add to $R$ with $R^2=F_1^2+F_2^2+2F_1F_2\cos\theta$, a plus because the triangle's angle is $180^\circ-\theta$. A journey of two legs on bearings is the same triangle, and the law gives the distance and the bearing back.`,
      T`Dua gaya $F_1$ dan $F_2$ yang arahnya membentuk sudut $\theta$ menjumlah menjadi $R$ dengan $R^2=F_1^2+F_2^2+2F_1F_2\cos\theta$, dengan plus karena sudut segitiganya $180^\circ-\theta$. Perjalanan dua leg pada arah mata angin adalah segitiga yang sama, dan aturan itu memberi jarak dan arah pulang.`,
    ),
    L(
      T`In a program, the arccosine form loses the angle of a thin triangle: sides $10^8$, $10^8$ and $1$ give $\cos C$ rounded to $1$ and an angle of $0$ instead of $5.7\times10^{-7}$ degrees. The half-angle form $\tan\frac C2=\sqrt{\frac{(s-a)(s-b)}{s(s-c)}}$, with $s-a$ and $s-b$ computed as $\frac{c\pm(b-a)}{2}$, keeps it.`,
      T`Dalam program, bentuk arkus kosinus kehilangan sudut segitiga tipis: sisi $10^8$, $10^8$, dan $1$ memberi $\cos C$ yang dibulatkan menjadi $1$ dan sudut $0$ alih-alih $5{,}7\times10^{-7}$ derajat. Bentuk setengah sudut $\tan\frac C2=\sqrt{\frac{(s-a)(s-b)}{s(s-c)}}$, dengan $s-a$ dan $s-b$ dihitung sebagai $\frac{c\pm(b-a)}{2}$, menjaganya.`,
    ),
  ],

  sections: [
    /* ---------------------------------------------------------------------------------- what */
    {
      id: 'what-it-says',
      heading: L('What does the law of cosines say?', 'Apa bunyi aturan kosinus?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The law of cosines says that in a triangle with sides $a$ and $b$ enclosing the angle $C$, the third side $c$, opposite $C$, satisfies $c^2=a^2+b^2-2ab\cos C$.** Read it as the Pythagorean theorem plus a correction. If $C$ is a right angle, $\cos C=0$, the correction disappears and $c^2=a^2+b^2$. If $C$ is acute, $\cos C>0$ and the correction *subtracts*: the third side is shorter than the hypotenuse of a right triangle with the same two legs. If $C$ is obtuse, $\cos C<0$ and the correction *adds*: it is longer.

The letters follow the same convention as in the law of sines: $A$, $B$, $C$ are the angles and $a$, $b$, $c$ the sides opposite them. In the formula above $C$ is both the angle opposite $c$ and the angle *between* $a$ and $b$, and it is the same angle. The other two forms are the same law with the letters moved: $a^2=b^2+c^2-2bc\cos A$ and $b^2=a^2+c^2-2ac\cos B$. Solving for the cosine gives the form for finding an angle:
$$\cos C=\frac{a^2+b^2-c^2}{2ab}.$$

A first check with the triangle $13$, $14$, $15$: for the angle $A$ opposite $13$, $\cos A=\frac{14^2+15^2-13^2}{2\cdot14\cdot15}=\frac{252}{420}=0.6$, so $A=53.13^\circ$, the same angle as in the $3$-$4$-$5$ triangle. When is it needed? The law of sines needs a side together with its opposite angle; when there is none, with two sides and the angle between them or with three sides, the law of cosines is the way in (see [the law of sines](article:law-of-sines#sines-or-cosines) for the choice between them, and [the article on triangles](article:triangles#solve-a-triangle) for the overview).`,
            T`**Aturan kosinus mengatakan bahwa pada segitiga dengan sisi $a$ dan $b$ yang mengapit sudut $C$, sisi ketiga $c$, di depan $C$, memenuhi $c^2=a^2+b^2-2ab\cos C$.** Bacalah sebagai teorema Pythagoras ditambah koreksi. Bila $C$ sudut siku-siku, $\cos C=0$, koreksinya lenyap dan $c^2=a^2+b^2$. Bila $C$ lancip, $\cos C>0$ dan koreksinya *mengurangi*: sisi ketiga lebih pendek daripada sisi miring segitiga siku-siku dengan dua sisi tegak yang sama. Bila $C$ tumpul, $\cos C<0$ dan koreksinya *menambah*: ia lebih panjang.

Huruf-hurufnya mengikuti kesepakatan yang sama seperti pada aturan sinus: $A$, $B$, $C$ adalah sudut dan $a$, $b$, $c$ sisi di depannya. Pada rumus di atas $C$ adalah sekaligus sudut di depan $c$ dan sudut *di antara* $a$ dan $b$, dan itu sudut yang sama. Dua bentuk lainnya adalah aturan yang sama dengan huruf dipindahkan: $a^2=b^2+c^2-2bc\cos A$ dan $b^2=a^2+c^2-2ac\cos B$. Menyelesaikan untuk kosinus memberi bentuk untuk mencari sudut:
$$\cos C=\frac{a^2+b^2-c^2}{2ab}.$$

Pemeriksaan pertama dengan segitiga $13$, $14$, $15$: untuk sudut $A$ di depan $13$, $\cos A=\frac{14^2+15^2-13^2}{2\cdot14\cdot15}=\frac{252}{420}=0{,}6$, sehingga $A=53{,}13^\circ$, sudut yang sama seperti pada segitiga $3$-$4$-$5$. Kapan ia diperlukan? Aturan sinus memerlukan sebuah sisi bersama sudut di depannya; bila tak ada, dengan dua sisi dan sudut apitnya atau dengan tiga sisi, aturan kosinus adalah jalan masuknya (lihat [aturan sinus](article:law-of-sines#sines-or-cosines) untuk pilihan di antara keduanya, dan [artikel tentang segitiga](article:triangles#solve-a-triangle) untuk gambaran umumnya).`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------------------------- proof */
    {
      id: 'proof',
      heading: L('Why is the law of cosines true? A proof with one altitude', 'Mengapa aturan kosinus benar? Bukti dengan satu garis tinggi'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The law of cosines follows from the Pythagorean theorem applied to a right triangle cut off by an altitude.** Put the angle $C$ at the vertex $C$ and drop the altitude $h$ from $A$ onto the line $CB$. In the right triangle with hypotenuse $b$ and the angle $C$, the adjacent side is $b\cos C$ and the height is $h=b\sin C$ (see [the right triangle](article:basic-trigonometry#right-triangles)). The altitude cuts the side $a$ into $b\cos C$ and $a-b\cos C$. The other right triangle has the hypotenuse $c$ and legs $h$ and $a-b\cos C$, so by Pythagoras
$$c^2=h^2+(a-b\cos C)^2=b^2\sin^2C+a^2-2ab\cos C+b^2\cos^2C.$$
Collect $b^2\sin^2C+b^2\cos^2C=b^2$ (the identity $\sin^2C+\cos^2C=1$, see [the identities](article:trigonometric-identities#fundamental)) and you are left with
$$c^2=a^2+b^2-2ab\cos C.$$

If $C$ is obtuse, the foot of the altitude falls outside the triangle, on the extension of $a$, at the distance $-b\cos C$ (a positive number, since $\cos C<0$) from $C$, and the right triangle has the leg $a+(-b\cos C)=a-b\cos C$. The computation is word for word the same, so one formula covers both cases.

**A second proof, by coordinates.** Put $C$ at the origin, $B$ at $(a,0)$ and $A$ at $(b\cos C,\,b\sin C)$. The distance from $A$ to $B$ squared is $(b\cos C-a)^2+(b\sin C)^2$, which expands to the same thing. In vector language it is the identity $|u-v|^2=|u|^2+|v|^2-2\,u\cdot v$ with $u\cdot v=|u||v|\cos C$, which is why the dot product is defined with a cosine.`,
            T`**Aturan kosinus mengikuti dari teorema Pythagoras yang diterapkan pada segitiga siku-siku yang dipotong oleh sebuah garis tinggi.** Letakkan sudut $C$ di titik sudut $C$ dan jatuhkan garis tinggi $h$ dari $A$ ke garis $CB$. Pada segitiga siku-siku dengan sisi miring $b$ dan sudut $C$, sisi samping adalah $b\cos C$ dan tingginya $h=b\sin C$ (lihat [segitiga siku-siku](article:basic-trigonometry#right-triangles)). Garis tinggi itu membagi sisi $a$ menjadi $b\cos C$ dan $a-b\cos C$. Segitiga siku-siku yang lain memiliki sisi miring $c$ dan sisi tegak $h$ serta $a-b\cos C$, sehingga menurut Pythagoras
$$c^2=h^2+(a-b\cos C)^2=b^2\sin^2C+a^2-2ab\cos C+b^2\cos^2C.$$
Kumpulkan $b^2\sin^2C+b^2\cos^2C=b^2$ (identitas $\sin^2C+\cos^2C=1$, lihat [identitas](article:trigonometric-identities#fundamental)) dan tersisa
$$c^2=a^2+b^2-2ab\cos C.$$

Bila $C$ tumpul, kaki garis tinggi jatuh di luar segitiga, pada perpanjangan $a$, berjarak $-b\cos C$ (bilangan positif, karena $\cos C<0$) dari $C$, dan segitiga siku-siku memiliki sisi tegak $a+(-b\cos C)=a-b\cos C$. Perhitungannya sama persis, jadi satu rumus mencakup kedua kasus.

**Bukti kedua, dengan koordinat.** Letakkan $C$ di titik asal, $B$ di $(a,0)$ dan $A$ di $(b\cos C,\,b\sin C)$. Kuadrat jarak $A$ ke $B$ adalah $(b\cos C-a)^2+(b\sin C)^2$, yang dijabarkan menjadi hal yang sama. Dalam bahasa vektor ia adalah identitas $|u-v|^2=|u|^2+|v|^2-2\,u\cdot v$ dengan $u\cdot v=|u||v|\cos C$, itulah sebabnya perkalian titik didefinisikan dengan kosinus.`,
          ),
        },
        FIG_ACUTE,
        FIG_OBTUSE,
      ],
    },

    /* ------------------------------------------------------------------------------------ hinge */
    {
      id: 'hinge',
      heading: L('How does the law turn the Pythagorean theorem into a rule for every angle?', 'Bagaimana aturan itu mengubah teorema Pythagoras menjadi aturan untuk setiap sudut?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Picture two sides of fixed lengths $a$ and $b$ joined at a hinge, with the angle $C$ between them: the third side $c$ is the distance between their free ends, and it grows as the hinge opens.** At $C$ near $0^\circ$ the two sides lie almost on top of each other and $c\approx|a-b|$. At $C=90^\circ$ they are perpendicular and $c=\sqrt{a^2+b^2}$. At $C$ near $180^\circ$ they point in opposite directions and $c\approx a+b$. In between, $c$ increases steadily, because $\cos C$ decreases from $1$ to $-1$.

This is the triangle inequality in disguise. Since $-1\le\cos C\le1$, the law gives $a^2+b^2-2ab\le c^2\le a^2+b^2+2ab$, that is $(a-b)^2\le c^2\le(a+b)^2$, so
$$|a-b|\le c\le a+b.$$
Here is the sign rule in one line: $c^2<a^2+b^2$ exactly when $\cos C>0$ ($C$ acute), $c^2=a^2+b^2$ exactly when $C=90^\circ$, and $c^2>a^2+b^2$ exactly when $C$ is obtuse. So the Pythagorean theorem and its converse (a triangle with $c^2=a^2+b^2$ has a right angle at $C$) are the one case $\cos C=0$ of a single law.

Open the hinge below, move the two sides, and watch the correction term change sign at the right angle.`,
            T`**Bayangkan dua sisi dengan panjang tetap $a$ dan $b$ yang disambung dengan engsel, dengan sudut $C$ di antaranya: sisi ketiga $c$ adalah jarak antara ujung-ujung bebasnya, dan ia bertambah ketika engsel membuka.** Pada $C$ dekat $0^\circ$ kedua sisi hampir bertumpuk dan $c\approx|a-b|$. Pada $C=90^\circ$ keduanya tegak lurus dan $c=\sqrt{a^2+b^2}$. Pada $C$ dekat $180^\circ$ keduanya menunjuk berlawanan arah dan $c\approx a+b$. Di antaranya, $c$ bertambah terus, karena $\cos C$ menurun dari $1$ ke $-1$.

Inilah ketaksamaan segitiga dalam penyamaran. Karena $-1\le\cos C\le1$, aturan itu memberi $a^2+b^2-2ab\le c^2\le a^2+b^2+2ab$, yaitu $(a-b)^2\le c^2\le(a+b)^2$, sehingga
$$|a-b|\le c\le a+b.$$
Inilah aturan tanda dalam satu baris: $c^2<a^2+b^2$ tepat ketika $\cos C>0$ ($C$ lancip), $c^2=a^2+b^2$ tepat ketika $C=90^\circ$, dan $c^2>a^2+b^2$ tepat ketika $C$ tumpul. Jadi teorema Pythagoras dan kebalikannya (segitiga dengan $c^2=a^2+b^2$ bersudut siku-siku di $C$) adalah satu kasus $\cos C=0$ dari satu aturan.

Buka engsel di bawah, ubah kedua sisinya, dan lihat suku koreksi berganti tanda di sudut siku-siku.`,
          ),
        },
        { kind: 'widget', name: 'lchinge' },
      ],
    },

    /* ---------------------------------------------------------------------------------- SAS, SSS */
    {
      id: 'sas-and-sss',
      heading: L('How do you find the third side from two sides, or all the angles from three sides?', 'Bagaimana mencari sisi ketiga dari dua sisi, atau semua sudut dari tiga sisi?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**With two sides and the angle between them (SAS), the law of cosines gives the third side in one step; with three sides (SSS), it gives each angle, and the order matters: start with the largest angle.**

**SAS.** $a=7$, $b=10$ and $C=120^\circ$. Then $c^2=149-140\cos120^\circ=149+70=219$, so $c=14.80$. The angle is obtuse and the correction $+70$ made $c$ longer than the hypotenuse $\sqrt{149}=12.21$. The two other angles come next, with the law of cosines again or with [the law of sines](article:law-of-sines#two-angles-and-a-side): $\sin A=\frac{7\sin120^\circ}{14.80}=0.4096$, and since $A$ is not the largest angle it is acute, so $A=24.18^\circ$ and $B=180^\circ-120^\circ-24.18^\circ=35.82^\circ$.

**SSS.** Take the sides $5$, $7$, $10$. The longest side, $10$, is opposite the largest angle $C$, and it is the only angle that could be obtuse, so find it first: $\cos C=\frac{25+49-100}{2\cdot5\cdot7}=\frac{-26}{70}=-0.3714$, and the *negative* cosine says $C=111.80^\circ$ is obtuse (the arccosine returns a single angle from $0^\circ$ to $180^\circ$, so it cannot be wrong about that). Then $\cos A=\frac{49+100-25}{2\cdot7\cdot10}=\frac{124}{140}=0.8857$, $A=27.66^\circ$, and $B=180^\circ-111.80^\circ-27.66^\circ=40.54^\circ$. A check: the angles add up to $180^\circ$, and the largest angle faces the longest side.

Why largest first? Once the largest angle is known to be acute (or found to be obtuse) the others are certainly acute, so even the law of sines, whose arcsine only returns acute angles, is safe for them. Start with a smaller angle by the law of sines and an obtuse largest angle gives the wrong answer.`,
            T`**Dengan dua sisi dan sudut apitnya (SAS), aturan kosinus memberi sisi ketiga dalam satu langkah; dengan tiga sisi (SSS), ia memberi tiap sudut, dan urutannya penting: mulailah dari sudut terbesar.**

**SAS.** $a=7$, $b=10$, dan $C=120^\circ$. Maka $c^2=149-140\cos120^\circ=149+70=219$, sehingga $c=14{,}80$. Sudutnya tumpul dan koreksi $+70$ membuat $c$ lebih panjang daripada sisi miring $\sqrt{149}=12{,}21$. Kedua sudut lain berikutnya, dengan aturan kosinus lagi atau dengan [aturan sinus](article:law-of-sines#two-angles-and-a-side): $\sin A=\frac{7\sin120^\circ}{14{,}80}=0{,}4096$, dan karena $A$ bukan sudut terbesar ia lancip, sehingga $A=24{,}18^\circ$ dan $B=180^\circ-120^\circ-24{,}18^\circ=35{,}82^\circ$.

**SSS.** Ambil sisi $5$, $7$, $10$. Sisi terpanjang, $10$, berada di depan sudut terbesar $C$, dan hanya ia yang dapat tumpul, jadi cari lebih dulu: $\cos C=\frac{25+49-100}{2\cdot5\cdot7}=\frac{-26}{70}=-0{,}3714$, dan kosinus yang *negatif* mengatakan $C=111{,}80^\circ$ tumpul (arkus kosinus mengembalikan satu sudut dari $0^\circ$ sampai $180^\circ$, sehingga ia tak dapat keliru tentang itu). Lalu $\cos A=\frac{49+100-25}{2\cdot7\cdot10}=\frac{124}{140}=0{,}8857$, $A=27{,}66^\circ$, dan $B=180^\circ-111{,}80^\circ-27{,}66^\circ=40{,}54^\circ$. Pemeriksaan: sudut-sudutnya berjumlah $180^\circ$, dan sudut terbesar menghadap sisi terpanjang.

Mengapa yang terbesar dulu? Begitu sudut terbesar diketahui lancip (atau ditemukan tumpul) sudut lainnya pasti lancip, sehingga bahkan aturan sinus, yang arkus sinusnya hanya mengembalikan sudut lancip, aman untuk mereka. Mulai dari sudut yang lebih kecil dengan aturan sinus dan sudut terbesar yang tumpul memberi jawaban yang salah.`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------------------- kinds */
    {
      id: 'acute-right-obtuse',
      heading: L('How can you tell from the sides alone whether a triangle is acute, right or obtuse?', 'Bagaimana mengetahui dari sisi-sisinya saja apakah segitiga lancip, siku-siku, atau tumpul?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Compare the square of the longest side with the sum of the squares of the other two: smaller means all angles are acute, equal means a right angle, larger means an obtuse angle.** This is the law of cosines read for the sign. If $c$ is the longest side, the angle $C$ opposite it is the largest, and $c^2-(a^2+b^2)=-2ab\cos C$ has the sign of $-\cos C$: negative for an acute $C$, zero for a right angle, positive for an obtuse one. The other two angles are smaller than $C$, so they are acute whenever $C$ is not obtuse; if $C$ is obtuse they are acute anyway, since a triangle has at most one angle of $90^\circ$ or more.

| Sides | $c^2$ | $a^2+b^2$ | The largest angle |
|---|---|---|---|
| $4$, $5$, $6$ | $36$ | $41$ | acute: $c^2<a^2+b^2$ |
| $5$, $12$, $13$ | $169$ | $169$ | right: $c^2=a^2+b^2$ |
| $4$, $5$, $7$ | $49$ | $41$ | obtuse: $c^2>a^2+b^2$ |

The middle row is the **converse of the Pythagorean theorem**: if the squares of the sides satisfy $c^2=a^2+b^2$, the triangle has a right angle opposite $c$. The converse is not obvious from the statement of the theorem alone, but with the law of cosines it takes a line: $c^2=a^2+b^2$ forces $-2ab\cos C=0$, so $\cos C=0$ and $C=90^\circ$. This test needs only squares of lengths, so it can be done exactly (see [the types of triangles](article:triangles#types)).`,
            T`**Bandingkan kuadrat sisi terpanjang dengan jumlah kuadrat dua sisi lainnya: lebih kecil berarti semua sudut lancip, sama berarti sudut siku-siku, lebih besar berarti ada sudut tumpul.** Ini adalah aturan kosinus yang dibaca untuk tandanya. Bila $c$ sisi terpanjang, sudut $C$ di depannya adalah yang terbesar, dan $c^2-(a^2+b^2)=-2ab\cos C$ bertanda sama dengan $-\cos C$: negatif untuk $C$ lancip, nol untuk sudut siku-siku, positif untuk yang tumpul. Kedua sudut lain lebih kecil daripada $C$, sehingga lancip selama $C$ tidak tumpul; bila $C$ tumpul keduanya tetap lancip, karena segitiga memiliki paling banyak satu sudut $90^\circ$ atau lebih.

| Sisi | $c^2$ | $a^2+b^2$ | Sudut terbesar |
|---|---|---|---|
| $4$, $5$, $6$ | $36$ | $41$ | lancip: $c^2<a^2+b^2$ |
| $5$, $12$, $13$ | $169$ | $169$ | siku-siku: $c^2=a^2+b^2$ |
| $4$, $5$, $7$ | $49$ | $41$ | tumpul: $c^2>a^2+b^2$ |

Baris tengah adalah **kebalikan teorema Pythagoras**: bila kuadrat sisi-sisinya memenuhi $c^2=a^2+b^2$, segitiga itu bersudut siku-siku di depan $c$. Kebalikannya tidak jelas dari pernyataan teorema saja, tetapi dengan aturan kosinus ia hanya satu baris: $c^2=a^2+b^2$ memaksa $-2ab\cos C=0$, sehingga $\cos C=0$ dan $C=90^\circ$. Uji ini hanya memerlukan kuadrat panjang, sehingga dapat dikerjakan secara eksak (lihat [jenis-jenis segitiga](article:triangles#types)).`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------------------------- forces */
    {
      id: 'forces',
      heading: L('How do you add two forces that pull at an angle?', 'Bagaimana menjumlahkan dua gaya yang menarik pada sebuah sudut?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Two forces pulling in directions that make the angle $\theta$ add up to a single force $R$ with $R^2=F_1^2+F_2^2+2F_1F_2\cos\theta$, which is the law of cosines with the *other* angle of the parallelogram.** Draw $F_1$ and then $F_2$ from its tip: the resultant $R$ closes the triangle. The angle of that triangle at the tip of $F_1$ is not $\theta$ but $180^\circ-\theta$, because the direction of $F_2$ makes $\theta$ with the *extension* of $F_1$. Since $\cos(180^\circ-\theta)=-\cos\theta$, the minus of the law becomes a plus.

**Example.** $30$ N and $40$ N with $60^\circ$ between their directions: $R^2=2500+2400\cos60^\circ=2500+1200=3700$, so $R=60.83$ N. At $90^\circ$ it is $\sqrt{900+1600}=50$ N, the Pythagorean theorem. At $0^\circ$ the forces pull the same way and add, $70$ N; at $180^\circ$ they oppose and subtract, $10$ N. The direction of $R$ makes the angle $\arctan\frac{F_2\sin\theta}{F_1+F_2\cos\theta}=34.7^\circ$ with $F_1$. The same rule adds any two vectors, such as velocities (a boat and a current) or displacements.

The mistake to avoid is writing the minus: it belongs to the angle *inside* the triangle, the plus to the angle between the two directions as the problem gives it.`,
            T`**Dua gaya yang menarik pada arah yang membentuk sudut $\theta$ menjumlah menjadi satu gaya $R$ dengan $R^2=F_1^2+F_2^2+2F_1F_2\cos\theta$, yaitu aturan kosinus dengan sudut jajar genjang yang *lain*.** Gambar $F_1$ lalu $F_2$ dari ujungnya: resultan $R$ menutup segitiganya. Sudut segitiga itu di ujung $F_1$ bukan $\theta$ melainkan $180^\circ-\theta$, karena arah $F_2$ membentuk $\theta$ dengan *perpanjangan* $F_1$. Karena $\cos(180^\circ-\theta)=-\cos\theta$, minus pada aturan itu menjadi plus.

**Contoh.** $30$ N dan $40$ N dengan $60^\circ$ di antara arahnya: $R^2=2500+2400\cos60^\circ=2500+1200=3700$, sehingga $R=60{,}83$ N. Pada $90^\circ$ ia $\sqrt{900+1600}=50$ N, teorema Pythagoras. Pada $0^\circ$ gaya menarik ke arah yang sama dan menjumlah, $70$ N; pada $180^\circ$ saling berlawanan dan mengurang, $10$ N. Arah $R$ membentuk sudut $\arctan\frac{F_2\sin\theta}{F_1+F_2\cos\theta}=34{,}7^\circ$ dengan $F_1$. Aturan yang sama menjumlah dua vektor mana pun, seperti kecepatan (perahu dan arus) atau perpindahan.

Kesalahan yang harus dihindari adalah menulis minus: ia milik sudut *di dalam* segitiga, plus milik sudut antara kedua arah sebagaimana diberikan soal.`,
          ),
        },
        FIG_FORCES,
      ],
    },

    /* --------------------------------------------------------------------------------- journey */
    {
      id: 'journey',
      heading: L('How do you find the distance and the bearing after a journey of two legs?', 'Bagaimana mencari jarak dan arah setelah perjalanan dua leg?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A journey of two straight legs is two sides of a triangle, the distance back to the start is the third side, and the law of cosines gives it from the lengths and the turn at the bend.** A *bearing* is an angle measured clockwise from north, written with three digits ($060^\circ$, $085^\circ$), the way a ship or aircraft is steered. If the course changes from the bearing $b_1$ to $b_2$, it turns through $|b_2-b_1|$ (the smaller way round, never more than $180^\circ$), and the angle of the triangle at the bend is $180^\circ$ minus that turn.

**Example.** $120$ km on $060^\circ$, then $90$ km on $120^\circ$. The turn is $60^\circ$, so the angle at the bend is $120^\circ$ and the distance back is
$$s=\sqrt{120^2+90^2-2\cdot120\cdot90\cos120^\circ}=\sqrt{33300}=182.48\ \text{km}.$$
For the direction, find the angle at the start between the first leg and the straight line, again by the law of cosines on the three sides. It is opposite the second leg of $90$ km, so $\cos\alpha=\frac{120^2+182.48^2-90^2}{2\cdot120\cdot182.48}=0.9042$ and $\alpha=25.3^\circ$. The course turned to the right at the bend, so the end lies to the right of the first bearing: $060^\circ+25.3^\circ=085.3^\circ$. The bearing back is $085.3^\circ+180^\circ=265.3^\circ$.

Set your own journey below; the widget finds the angle at the start by the law of cosines and chooses the side from the direction of the turn.`,
            T`**Perjalanan dua leg lurus adalah dua sisi sebuah segitiga, jarak kembali ke awal adalah sisi ketiga, dan aturan kosinus memberikannya dari panjang kedua leg dan belokan di tikungan.** *Arah mata angin* (bearing) adalah sudut yang diukur searah jarum jam dari utara, ditulis tiga angka ($060^\circ$, $085^\circ$), seperti kapal atau pesawat dikemudikan. Bila haluan berubah dari arah $b_1$ ke $b_2$, ia berbelok sebesar $|b_2-b_1|$ (lewat jalan yang lebih pendek, tak pernah lebih dari $180^\circ$), dan sudut segitiga di tikungan adalah $180^\circ$ dikurangi belokan itu.

**Contoh.** $120$ km pada $060^\circ$, lalu $90$ km pada $120^\circ$. Belokannya $60^\circ$, jadi sudut di tikungan $120^\circ$ dan jarak kembali
$$s=\sqrt{120^2+90^2-2\cdot120\cdot90\cos120^\circ}=\sqrt{33300}=182{,}48\ \text{km}.$$
Untuk arahnya, cari sudut di awal antara leg pertama dan garis lurus, lagi dengan aturan kosinus pada ketiga sisi: sudut di awal ada di depan leg kedua sepanjang $90$ km, sehingga $\cos\alpha=\frac{120^2+182{,}48^2-90^2}{2\cdot120\cdot182{,}48}=0{,}9042$ dan $\alpha=25{,}3^\circ$. Haluan berbelok ke kanan di tikungan, jadi ujungnya berada di kanan arah pertama: arah akhir $060^\circ+25{,}3^\circ=085{,}3^\circ$. Arah pulang $085{,}3^\circ+180^\circ=265{,}3^\circ$.

Atur perjalananmu sendiri di bawah; widget mencari sudut di awal dengan aturan kosinus dan memilih sisinya dari arah belokan.`,
          ),
        },
        FIG_TRIP,
        { kind: 'widget', name: 'lctrip' },
      ],
    },

    /* ------------------------------------------------------------------------- Heron and median */
    {
      id: 'heron-and-median',
      heading: L('How is the law of cosines connected to Heron\'s formula and to the length of a median?', 'Bagaimana aturan kosinus terhubung dengan rumus Heron dan panjang garis berat?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Two classic formulas come out of the law of cosines by algebra: the area from three sides (Heron) and the length of a median (Apollonius).**

**Heron's formula.** The area is $K=\frac12ab\sin C$, so $16K^2=4a^2b^2\sin^2C=4a^2b^2(1-\cos^2C)$. Put in $2ab\cos C=a^2+b^2-c^2$ from the law:
$$16K^2=4a^2b^2-(a^2+b^2-c^2)^2=\left[2ab-(a^2+b^2-c^2)\right]\left[2ab+(a^2+b^2-c^2)\right].$$
The first bracket is $c^2-(a-b)^2=(c-a+b)(c+a-b)$ and the second is $(a+b)^2-c^2=(a+b-c)(a+b+c)$, so $16K^2=(a+b+c)(-a+b+c)(a-b+c)(a+b-c)$, which with $s=\frac{a+b+c}{2}$ is $K=\sqrt{s(s-a)(s-b)(s-c)}$. For $13$, $14$, $15$ this is $\sqrt{21\cdot8\cdot7\cdot6}=84$ (see [the area of a triangle](article:triangles#perimeter-and-area)).

**The median.** Let $m_c$ be the median from $C$ to the midpoint $M$ of $c$. Apply the law of cosines to the two triangles $ACM$ and $BCM$, whose angles at $M$ add up to $180^\circ$, so their cosines are opposite: $a^2=m_c^2+\frac{c^2}{4}-m_cc\cos\mu$ and $b^2=m_c^2+\frac{c^2}{4}+m_cc\cos\mu$. Add the two equations and the cosine cancels:
$$a^2+b^2=2m_c^2+\frac{c^2}{2}\quad\Rightarrow\quad m_c=\frac12\sqrt{2a^2+2b^2-c^2}.$$
For $a=13$, $b=15$, $c=14$: $m_c=\frac12\sqrt{338+450-196}=\frac12\sqrt{592}=12.17$. In a right triangle with $a=6$, $b=8$, $c=10$ it gives $\frac12\sqrt{72+128-100}=5$, half the hypotenuse, a fact about the circumcenter of a right triangle (see [the medians and centers](article:triangles#centers)).`,
            T`**Dua rumus klasik keluar dari aturan kosinus lewat aljabar: luas dari tiga sisi (Heron) dan panjang garis berat (Apollonius).**

**Rumus Heron.** Luasnya $K=\frac12ab\sin C$, sehingga $16K^2=4a^2b^2\sin^2C=4a^2b^2(1-\cos^2C)$. Masukkan $2ab\cos C=a^2+b^2-c^2$ dari aturan itu:
$$16K^2=4a^2b^2-(a^2+b^2-c^2)^2=\left[2ab-(a^2+b^2-c^2)\right]\left[2ab+(a^2+b^2-c^2)\right].$$
Kurung pertama adalah $c^2-(a-b)^2=(c-a+b)(c+a-b)$ dan yang kedua $(a+b)^2-c^2=(a+b-c)(a+b+c)$, sehingga $16K^2=(a+b+c)(-a+b+c)(a-b+c)(a+b-c)$, yang dengan $s=\frac{a+b+c}{2}$ adalah $K=\sqrt{s(s-a)(s-b)(s-c)}$. Untuk $13$, $14$, $15$ ini $\sqrt{21\cdot8\cdot7\cdot6}=84$ (lihat [luas segitiga](article:triangles#perimeter-and-area)).

**Garis berat.** Misalkan $m_c$ garis berat dari $C$ ke titik tengah $M$ sisi $c$. Terapkan aturan kosinus pada dua segitiga $ACM$ dan $BCM$, yang sudutnya di $M$ berjumlah $180^\circ$, sehingga kosinusnya berlawanan: $a^2=m_c^2+\frac{c^2}{4}-m_cc\cos\mu$ dan $b^2=m_c^2+\frac{c^2}{4}+m_cc\cos\mu$. Jumlahkan kedua persamaan itu dan kosinusnya saling meniadakan:
$$a^2+b^2=2m_c^2+\frac{c^2}{2}\quad\Rightarrow\quad m_c=\frac12\sqrt{2a^2+2b^2-c^2}.$$
Untuk $a=13$, $b=15$, $c=14$: $m_c=\frac12\sqrt{338+450-196}=\frac12\sqrt{592}=12{,}17$. Pada segitiga siku-siku dengan $a=6$, $b=8$, $c=10$ ia memberi $\frac12\sqrt{72+128-100}=5$, setengah sisi miring, fakta tentang pusat lingkaran luar segitiga siku-siku (lihat [garis berat dan titik-titik penting](article:triangles#centers)).`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------------- numerics */
    {
      id: 'thin-triangles',
      heading: L('Why does the law of cosines lose the angle of a thin triangle, and what do you do?', 'Mengapa aturan kosinus kehilangan sudut segitiga tipis, dan apa yang dilakukan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**For a very thin triangle the arccosine form $\arccos\frac{a^2+b^2-c^2}{2ab}$ throws away the angle, because the cosine of a tiny angle is a number that rounds to $1$; the half-angle form keeps it.** Take the sides $10^8$, $10^8$ and $1$. The true angle opposite the side $1$ is $2\arcsin\frac{1}{2\cdot10^8}=5.73\times10^{-7}$ degrees. But $a^2+b^2=2\times10^{16}$ and subtracting $c^2=1$ changes nothing a double-precision number can show (the spacing of doubles near $2\times10^{16}$ is $4$), so the ratio is exactly $1$ and the arccosine is exactly $0$: the angle has vanished. Before that point, the angle is correct but carries fewer and fewer digits: the cosine of an angle near $0$ is flat, so an error of $10^{-16}$ in it is an error of $10^{-8}$ radians in the angle.

Two ways out. For a thin triangle with a small angle $C$, find *that* angle with the law of sines, which does not square anything. Or use the half-angle form, in terms of the half-perimeter $s=\frac{a+b+c}{2}$:
$$\tan\frac C2=\sqrt{\frac{(s-a)(s-b)}{s(s-c)}}.$$
It needs care in one place: $s-a=\frac{b+c-a}{2}$ is a small difference of big numbers if $c$ is tiny, so write it as $s-a=\frac{c+(b-a)}{2}$ and $s-b=\frac{c-(b-a)}{2}$, where the subtraction $b-a$ of two long, close sides is exact. The widget below shows both forms for any three sides; try "very thin".`,
            T`**Untuk segitiga yang sangat tipis, bentuk arkus kosinus $\arccos\frac{a^2+b^2-c^2}{2ab}$ membuang sudutnya, karena kosinus sudut yang sangat kecil adalah bilangan yang dibulatkan menjadi $1$; bentuk setengah sudut menjaganya.** Ambil sisi $10^8$, $10^8$, dan $1$. Sudut sebenarnya di depan sisi $1$ adalah $2\arcsin\frac{1}{2\cdot10^8}=5{,}73\times10^{-7}$ derajat. Tetapi $a^2+b^2=2\times10^{16}$ dan mengurangkan $c^2=1$ tidak mengubah apa pun yang dapat ditunjukkan bilangan presisi ganda (jarak antar-bilangan ganda di dekat $2\times10^{16}$ adalah $4$), sehingga rasionya tepat $1$ dan arkus kosinusnya tepat $0$: sudutnya lenyap. Sebelum titik itu, sudutnya benar tetapi membawa makin sedikit digit: kosinus sudut dekat $0$ itu landai, sehingga galat $10^{-16}$ padanya adalah galat $10^{-8}$ radian pada sudutnya.

Dua jalan keluar. Untuk segitiga tipis dengan sudut kecil $C$, cari sudut *itu* dengan aturan sinus, yang tidak mengkuadratkan apa pun. Atau pakai bentuk setengah sudut, dalam setengah keliling $s=\frac{a+b+c}{2}$:
$$\tan\frac C2=\sqrt{\frac{(s-a)(s-b)}{s(s-c)}}.$$
Ia memerlukan kehati-hatian di satu tempat: $s-a=\frac{b+c-a}{2}$ adalah selisih kecil bilangan besar bila $c$ sangat kecil, jadi tulis $s-a=\frac{c+(b-a)}{2}$ dan $s-b=\frac{c-(b-a)}{2}$, tempat pengurangan $b-a$ dua sisi panjang yang berdekatan itu eksak. Widget di bawah memperlihatkan kedua bentuk untuk tiga sisi mana pun; coba "sangat tipis".`,
          ),
        },
        { kind: 'widget', name: 'lcsss' },
      ],
    },

    /* ------------------------------------------------------------------------------------ code */
    {
      id: 'law-of-cosines-in-code',
      heading: L('How do you use the law of cosines in a program?', 'Bagaimana memakai aturan kosinus dalam program?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A program uses the law of cosines in three functions: the third side from two sides and the included angle, the angle from three sides, and the resultant of two vectors; the one place that needs care is the angle from three sides.** Convert degrees to radians before ´cos´, check the triangle inequality before taking an arccosine, and clamp the ratio into $[-1,1]$ so that rounding cannot make ´acos´ fail. For a thin triangle, do not trust the plain arccosine, as the section above showed.

The programs below find the third side for $a=7$, $b=10$, $C=120^\circ$ (giving $14.7986$), the three angles of the triangle $5$, $7$, $10$ (largest first: $111.80^\circ$, $27.66^\circ$, $40.54^\circ$), the resultant of $30$ N and $40$ N at $60^\circ$ ($60.83$ N), and the thin triangle $10^8$, $10^8$, $1$ whose angle, in millionths of a degree, is $0$ by the arccosine and $0.573$ by the half-angle form.`,
            T`**Program memakai aturan kosinus dalam tiga fungsi: sisi ketiga dari dua sisi dan sudut apit, sudut dari tiga sisi, dan resultan dua vektor; satu-satunya tempat yang memerlukan kehati-hatian adalah sudut dari tiga sisi.** Ubah derajat ke radian sebelum ´cos´, periksa ketaksamaan segitiga sebelum mengambil arkus kosinus, dan batasi rasionya ke $[-1,1]$ agar pembulatan tidak membuat ´acos´ gagal. Untuk segitiga tipis, jangan percaya arkus kosinus biasa, seperti yang ditunjukkan bagian di atas.

Program di bawah mencari sisi ketiga untuk $a=7$, $b=10$, $C=120^\circ$ (memberi $14{,}7986$), ketiga sudut segitiga $5$, $7$, $10$ (terbesar dulu: $111{,}80^\circ$, $27{,}66^\circ$, $40{,}54^\circ$), resultan $30$ N dan $40$ N pada $60^\circ$ ($60{,}83$ N), dan segitiga tipis $10^8$, $10^8$, $1$ yang sudutnya, dalam sepersejuta derajat, adalah $0$ menurut arkus kosinus dan $0{,}573$ menurut bentuk setengah sudut.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: the third side, the angles, the resultant and a thin triangle', 'Python: sisi ketiga, sudut, resultan, dan segitiga tipis'),
          code: `import math


def third_side(a, b, C):
    """The side opposite C (degrees) between the sides a and b: c^2 = a^2 + b^2 - 2ab cos C."""
    return math.sqrt(a * a + b * b - 2 * a * b * math.cos(math.radians(C)))


def angle_naive(a, b, c):
    """The angle opposite c by the arccosine, the ratio clamped into [-1, 1]."""
    x = (a * a + b * b - c * c) / (2 * a * b)
    return math.degrees(math.acos(max(-1.0, min(1.0, x))))


def angle_stable(a, b, c):
    """The same angle by the half-angle form; s - a and s - b are written (c +- (b - a)) / 2 so a tiny c is not lost."""
    u = (c + (b - a)) / 2
    v = (c - (b - a)) / 2
    s = (a + b + c) / 2
    return math.degrees(2 * math.atan(math.sqrt(u * v / (s * (s - c)))))


def resultant(F1, F2, theta):
    """The size of the sum of two forces whose directions make the angle theta (degrees)."""
    return math.sqrt(F1 * F1 + F2 * F2 + 2 * F1 * F2 * math.cos(math.radians(theta)))


print(round(third_side(7, 10, 120), 4))                       # 14.7986
a, b, c = 5, 7, 10                                             # the largest angle first: the one opposite the longest side
C = angle_naive(a, b, c)
A = angle_naive(b, c, a)
print(round(C, 2), round(A, 2), round(180 - C - A, 2))         # 111.8 27.66 40.54
print(round(resultant(30, 40, 60), 2))                         # 60.83
print(round(angle_naive(1e8, 1e8, 1) * 1e6, 4), round(angle_stable(1e8, 1e8, 1) * 1e6, 4))   # 0.0 0.573`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: the same four functions', 'JavaScript: keempat fungsi yang sama'),
          code: `const rad = (d) => (d * Math.PI) / 180
const deg = (r) => (r * 180) / Math.PI

// the side opposite C (degrees) between the sides a and b: c^2 = a^2 + b^2 - 2ab cos C
const thirdSide = (a, b, C) => Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad(C)))

// the angle opposite c by the arccosine, the ratio clamped into [-1, 1]
function angleNaive(a, b, c) {
  const x = (a * a + b * b - c * c) / (2 * a * b)
  return deg(Math.acos(Math.max(-1, Math.min(1, x))))
}

// the same angle by the half-angle form; s - a and s - b are written (c +- (b - a)) / 2 so a tiny c is not lost
function angleStable(a, b, c) {
  const u = (c + (b - a)) / 2
  const v = (c - (b - a)) / 2
  const s = (a + b + c) / 2
  return deg(2 * Math.atan(Math.sqrt((u * v) / (s * (s - c)))))
}

// the size of the sum of two forces whose directions make the angle theta (degrees)
const resultant = (F1, F2, theta) => Math.sqrt(F1 * F1 + F2 * F2 + 2 * F1 * F2 * Math.cos(rad(theta)))

+thirdSide(7, 10, 120).toFixed(4)                              // 14.7986
const [a, b, c] = [5, 7, 10]                                   // the largest angle first: the one opposite the longest side
const C = angleNaive(a, b, c)
const A = angleNaive(b, c, a)
;[+C.toFixed(2), +A.toFixed(2), +(180 - C - A).toFixed(2)]     // [111.8, 27.66, 40.54]
+resultant(30, 40, 60).toFixed(2)                              // 60.83
;[+(angleNaive(1e8, 1e8, 1) * 1e6).toFixed(4), +(angleStable(1e8, 1e8, 1) * 1e6).toFixed(4)]   // [0, 0.573]`,
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

// the side opposite C (degrees) between the sides a and b
double thirdSide(double a, double b, double C) { return sqrt(a * a + b * b - 2 * a * b * cos(rad(C))); }

// the angle opposite c by the arccosine, the ratio clamped into [-1, 1]
double angleNaive(double a, double b, double c) {
  double x = (a * a + b * b - c * c) / (2 * a * b);
  if (x > 1) x = 1;
  if (x < -1) x = -1;
  return deg(acos(x));
}

// the same angle by the half-angle form; s - a and s - b are written (c +- (b - a)) / 2 so a tiny c is not lost
double angleStable(double a, double b, double c) {
  double u = (c + (b - a)) / 2;
  double v = (c - (b - a)) / 2;
  double s = (a + b + c) / 2;
  return deg(2 * atan(sqrt(u * v / (s * (s - c)))));
}

// the size of the sum of two forces whose directions make the angle theta (degrees)
double resultant(double F1, double F2, double theta) { return sqrt(F1 * F1 + F2 * F2 + 2 * F1 * F2 * cos(rad(theta))); }

int main() {
  printf("%.4f\\n", thirdSide(7, 10, 120));
  double C = angleNaive(5, 7, 10);                  // the largest angle first: the one opposite the longest side
  double A = angleNaive(7, 10, 5);
  printf("%.2f %.2f %.2f\\n", C, A, 180 - C - A);
  printf("%.2f\\n", resultant(30, 40, 60));
  printf("%.4f %.4f\\n", angleNaive(1e8, 1e8, 1) * 1e6, angleStable(1e8, 1e8, 1) * 1e6);
  return 0;
}

/* output:
14.7986
111.80 27.66 40.54
60.83
0.0000 0.5730
*/`,
        },
      ],
    },

    /* ---------------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where does the law of cosines come from?', 'Dari mana aturan kosinus berasal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The law of cosines is older than the cosine: Euclid proved it as two theorems about squares and rectangles, and it became a formula only when the cosine became a number.**

- **About 300 BCE.** Euclid's *Elements*, Book II, Propositions 12 and 13, are the law of cosines in the language of geometry: in an obtuse triangle the square on the side opposite the obtuse angle is *greater* than the squares on the other two sides by twice a rectangle, and in an acute triangle it is *less* by twice a rectangle. The rectangle is $a\cdot b\cos C$, built from a side and the projection of the other.
- **15th century.** Jamshid al-Kashi, working in Samarkand, states the law in a form suited to computing a side from two sides and the angle between them with a table of sines. In France it is still called Al-Kashi's theorem.
- **1748.** Euler's *Introductio* treats the sine and cosine as functions of a number, so that the rectangle can be written $ab\cos C$ and the law as the single formula used today.
- **19th and 20th centuries.** With vectors, the law becomes $|u-v|^2=|u|^2+|v|^2-2\,u\cdot v$, and the dot product $u\cdot v=|u||v|\cos\theta$ is defined so that this holds, which carries the law into any number of dimensions.`,
            T`**Aturan kosinus lebih tua daripada kosinus: Euclid membuktikannya sebagai dua teorema tentang persegi dan persegi panjang, dan ia menjadi rumus hanya ketika kosinus menjadi bilangan.**

- **Sekitar 300 SM.** *Elements* Euclid, Buku II, Proposisi 12 dan 13, adalah aturan kosinus dalam bahasa geometri: pada segitiga tumpul kuadrat sisi di depan sudut tumpul *lebih besar* daripada kuadrat dua sisi lainnya sebesar dua kali sebuah persegi panjang, dan pada segitiga lancip ia *lebih kecil* sebesar dua kali sebuah persegi panjang. Persegi panjang itu adalah $a\cdot b\cos C$, dibangun dari sebuah sisi dan proyeksi sisi lainnya.
- **Abad ke-15.** Jamshid al-Kashi, yang bekerja di Samarkand, menyatakan aturan itu dalam bentuk yang cocok untuk menghitung sebuah sisi dari dua sisi dan sudut apitnya dengan tabel sinus. Di Prancis ia masih disebut teorema Al-Kashi.
- **1748.** *Introductio* karya Euler memperlakukan sinus dan kosinus sebagai fungsi bilangan, sehingga persegi panjang itu dapat ditulis $ab\cos C$ dan aturannya sebagai satu rumus yang dipakai sekarang.
- **Abad ke-19 dan ke-20.** Dengan vektor, aturan itu menjadi $|u-v|^2=|u|^2+|v|^2-2\,u\cdot v$, dan perkalian titik $u\cdot v=|u||v|\cos\theta$ didefinisikan agar ini berlaku, yang membawa aturan itu ke dimensi mana pun.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What are the common mistakes with the law of cosines?', 'Apa kesalahan umum pada aturan kosinus?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with the law of cosines are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ $c^2=a^2+b^2-2ab\cos A$ (the wrong angle) | The angle is $C$, between $a$ and $b$ and opposite $c$. |
| ❌ $c=a+b-2ab\cos C$ (forgetting the squares) | It is $c^2$ on the left; take the square root at the end. |
| ❌ $(a^2+b^2-2ab)\cos C$ | The cosine multiplies only the term $2ab$: $a^2+b^2-2ab\cos C$. |
| ❌ Take $\arccos$ of a ratio without checking | Check the triangle inequality first, and clamp the ratio into $[-1,1]$ in a program. |
| ❌ Calculator in radian mode with degree data | Set degrees, or convert, or every cosine is wrong. |
| ❌ $R^2=F_1^2+F_2^2-2F_1F_2\cos\theta$ for forces at the angle $\theta$ | The triangle's angle is $180^\circ-\theta$: $R^2=F_1^2+F_2^2+2F_1F_2\cos\theta$. |
| ❌ Find a small angle first by the arccosine and subtract to get the largest | Find the largest angle first (opposite the longest side); only it can be obtuse. |
| ❌ Trust $\arccos$ for a very thin triangle | The cosine rounds to $1$: use the half-angle form or the law of sines. |
| ❌ A bearing is measured from the east axis | A bearing is measured clockwise from north, with three digits ($060^\circ$). |`,
            T`**Kesalahan paling umum pada aturan kosinus adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ $c^2=a^2+b^2-2ab\cos A$ (sudut yang salah) | Sudutnya $C$, di antara $a$ dan $b$ dan di depan $c$. |
| ❌ $c=a+b-2ab\cos C$ (lupa kuadrat) | Ruas kiri adalah $c^2$; tarik akar kuadrat di akhir. |
| ❌ $(a^2+b^2-2ab)\cos C$ | Kosinus hanya mengalikan suku $2ab$: $a^2+b^2-2ab\cos C$. |
| ❌ Mengambil $\arccos$ dari rasio tanpa memeriksa | Periksa ketaksamaan segitiga dulu, dan batasi rasio ke $[-1,1]$ dalam program. |
| ❌ Kalkulator mode radian dengan data derajat | Atur ke derajat, atau ubah, kalau tidak setiap kosinus salah. |
| ❌ $R^2=F_1^2+F_2^2-2F_1F_2\cos\theta$ untuk gaya pada sudut $\theta$ | Sudut segitiganya $180^\circ-\theta$: $R^2=F_1^2+F_2^2+2F_1F_2\cos\theta$. |
| ❌ Mencari sudut kecil dulu dengan arkus kosinus lalu mengurangi untuk mendapat yang terbesar | Cari sudut terbesar dulu (di depan sisi terpanjang); hanya ia yang dapat tumpul. |
| ❌ Mempercayai $\arccos$ untuk segitiga yang sangat tipis | Kosinus dibulatkan menjadi $1$: pakai bentuk setengah sudut atau aturan sinus. |
| ❌ Arah mata angin diukur dari sumbu timur | Arah diukur searah jarum jam dari utara, dengan tiga angka ($060^\circ$). |`,
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
              L(T`At $C=90^\circ$ the law of cosines is the Pythagorean theorem.`, T`Pada $C=90^\circ$ aturan kosinus adalah teorema Pythagoras.`),
              L(T`In $c^2=a^2+b^2-2ab\cos C$, $C$ is the angle between $a$ and $b$, opposite $c$.`, T`Pada $c^2=a^2+b^2-2ab\cos C$, $C$ adalah sudut di antara $a$ dan $b$, di depan $c$.`),
              L(T`If $C$ is obtuse, then $c^2$ is smaller than $a^2+b^2$.`, T`Bila $C$ tumpul, maka $c^2$ lebih kecil daripada $a^2+b^2$.`),
              L(T`Given all three sides, the law of cosines gives each angle.`, T`Dengan ketiga sisi diketahui, aturan kosinus memberi tiap sudut.`),
              L(T`The law of cosines works only for acute triangles.`, T`Aturan kosinus hanya berlaku untuk segitiga lancip.`),
              L(T`The third side of a triangle with sides $a$ and $b$ can be longer than $a+b$.`, T`Sisi ketiga segitiga dengan sisi $a$ dan $b$ dapat lebih panjang daripada $a+b$.`),
            ],
            answer: [true, true, false, true, false, false],
            explain: L(
              T`For an obtuse angle $\cos C<0$, so the correction $-2ab\cos C$ is positive and $c^2>a^2+b^2$. The law holds for every triangle, and the third side is always between $|a-b|$ and $a+b$.`,
              T`Untuk sudut tumpul $\cos C<0$, sehingga koreksi $-2ab\cos C$ positif dan $c^2>a^2+b^2$. Aturan itu berlaku untuk setiap segitiga, dan sisi ketiga selalu berada di antara $|a-b|$ dan $a+b$.`,
            ),
            hint: L(T`Think about the sign of the cosine of an obtuse angle, and about what the largest and smallest values of $\cos C$ give.`, T`Pikirkan tanda kosinus sudut tumpul, dan apa yang diberikan nilai terbesar dan terkecil $\cos C$.`),
          },
        },
        {
          kind: 'activity',
          title: L('The third side', 'Sisi ketiga'),
          step: {
            kind: 'math',
            id: 'p2',
            hints: [L(T`$c^2=a^2+b^2-2ab\cos C$ with $\cos120^\circ=-\frac12$.`, T`$c^2=a^2+b^2-2ab\cos C$ dengan $\cos120^\circ=-\frac12$.`), L(T`$9+25+15$, then the square root.`, T`$9+25+15$, lalu akar kuadrat.`)],
            explain: L(T`$c^2=9+25-2\cdot3\cdot5\cdot(-\frac12)=9+25+15=49$, so $c=7$.`, T`$c^2=9+25-2\cdot3\cdot5\cdot(-\frac12)=9+25+15=49$, jadi $c=7$.`),
            prompt: L(T`Two sides of a triangle are $3$ and $5$ and the angle between them is $120^\circ$. How long is the third side?`, T`Dua sisi segitiga adalah $3$ dan $5$ dan sudut apitnya $120^\circ$. Berapa panjang sisi ketiganya?`),
            given: String.raw`c=v`,
            blanks: [{ label: 'c =', answer: 7 }],
          },
        },
        {
          kind: 'activity',
          title: L('A cosine from three sides', 'Kosinus dari tiga sisi'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L(T`$\cos A=\frac{b^2+c^2-a^2}{2bc}$ for the angle opposite $a=13$.`, T`$\cos A=\frac{b^2+c^2-a^2}{2bc}$ untuk sudut di depan $a=13$.`), L(T`$\frac{196+225-169}{420}$.`, T`$\frac{196+225-169}{420}$.`)],
            explain: L(T`$\cos A=\frac{14^2+15^2-13^2}{2\cdot14\cdot15}=\frac{252}{420}=0.6$.`, T`$\cos A=\frac{14^2+15^2-13^2}{2\cdot14\cdot15}=\frac{252}{420}=0{,}6$.`),
            prompt: L(T`A triangle has sides $13$, $14$ and $15$. What is the cosine of the angle opposite the side $13$?`, T`Sebuah segitiga bersisi $13$, $14$, dan $15$. Berapa kosinus sudut di depan sisi $13$?`),
            given: String.raw`k=v`,
            blanks: [{ label: 'cos A =', answer: 0.6 }],
          },
        },
        {
          kind: 'activity',
          title: L('Another cosine', 'Kosinus lain'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L(T`The angle opposite $7$ is between the sides $5$ and $6$.`, T`Sudut di depan $7$ berada di antara sisi $5$ dan $6$.`), L(T`$\frac{25+36-49}{2\cdot5\cdot6}$.`, T`$\frac{25+36-49}{2\cdot5\cdot6}$.`)],
            explain: L(T`$\cos C=\frac{25+36-49}{60}=\frac{12}{60}=0.2$.`, T`$\cos C=\frac{25+36-49}{60}=\frac{12}{60}=0{,}2$.`),
            prompt: L(T`A triangle has sides $5$, $6$ and $7$. What is the cosine of the angle opposite the side $7$?`, T`Sebuah segitiga bersisi $5$, $6$, dan $7$. Berapa kosinus sudut di depan sisi $7$?`),
            given: String.raw`k=v`,
            blanks: [{ label: 'cos C =', answer: 0.2 }],
          },
        },
        {
          kind: 'activity',
          title: L('How long can the third side be?', 'Seberapa panjang sisi ketiga?'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [L(T`The third side is between $|a-b|$ and $a+b$, and both ends are excluded.`, T`Sisi ketiga berada di antara $|a-b|$ dan $a+b$, dan kedua ujung dikecualikan.`), L(T`Whole numbers strictly between $5$ and $13$.`, T`Bilangan bulat yang benar-benar di antara $5$ dan $13$.`)],
            explain: L(T`$|9-4|=5<c<13=9+4$, so $c$ can be $6,7,\ldots,12$: seven whole values.`, T`$|9-4|=5<c<13=9+4$, sehingga $c$ dapat berupa $6,7,\ldots,12$: tujuh nilai bulat.`),
            prompt: L(T`Two sides of a triangle are $9$ and $4$. How many whole-number lengths can the third side have?`, T`Dua sisi segitiga adalah $9$ dan $4$. Berapa banyak panjang bilangan bulat yang dapat dimiliki sisi ketiga?`),
            given: String.raw`k=v`,
            blanks: [{ label: 'k =', answer: 7 }],
          },
        },
        {
          kind: 'activity',
          title: L('Two forces', 'Dua gaya'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L(T`At $90^\circ$ between the directions, $\cos\theta=0$.`, T`Pada $90^\circ$ di antara arahnya, $\cos\theta=0$.`), L(T`$\sqrt{36+64}$.`, T`$\sqrt{36+64}$.`)],
            explain: L(T`$R^2=6^2+8^2+0=100$, so $R=10$ N.`, T`$R^2=6^2+8^2+0=100$, jadi $R=10$ N.`),
            prompt: L(T`Two forces of $6$ N and $8$ N pull at right angles to each other. What is the size of their sum, in newtons?`, T`Dua gaya $6$ N dan $8$ N menarik saling tegak lurus. Berapa besar jumlahnya, dalam newton?`),
            given: String.raw`R=v`,
            blanks: [{ label: 'R =', answer: 10 }],
          },
        },
        {
          kind: 'activity',
          title: L('A median', 'Garis berat'),
          step: {
            kind: 'math',
            id: 'p7',
            hints: [L(T`$m_c=\frac12\sqrt{2a^2+2b^2-c^2}$.`, T`$m_c=\frac12\sqrt{2a^2+2b^2-c^2}$.`), L(T`$2\cdot36+2\cdot64-100=100$.`, T`$2\cdot36+2\cdot64-100=100$.`)],
            explain: L(T`$m_c=\frac12\sqrt{72+128-100}=\frac12\cdot10=5$, half the hypotenuse of this right triangle.`, T`$m_c=\frac12\sqrt{72+128-100}=\frac12\cdot10=5$, setengah sisi miring segitiga siku-siku ini.`),
            prompt: L(T`A triangle has sides $a=6$, $b=8$ and $c=10$. How long is the median to the side $c$?`, T`Sebuah segitiga bersisi $a=6$, $b=8$, dan $c=10$. Berapa panjang garis berat ke sisi $c$?`),
            given: String.raw`m=v`,
            blanks: [{ label: 'm =', answer: 5 }],
          },
        },
        {
          kind: 'activity',
          title: L('Which angle first?', 'Sudut mana dulu?'),
          step: {
            kind: 'quiz',
            id: 'p8',
            prompt: L('You know all three sides and want all three angles. What should you find first?', 'Kamu tahu ketiga sisi dan ingin ketiga sudutnya. Apa yang dicari pertama?'),
            options: [L('the largest angle, opposite the longest side', 'sudut terbesar, di depan sisi terpanjang'), L('the smallest angle, opposite the shortest side', 'sudut terkecil, di depan sisi terpendek'), L('the angle sum, 180°', 'jumlah sudut, 180°'), L('the area', 'luasnya')],
            answer: 0,
            explain: L('Only the largest angle can be obtuse. The arccosine finds it correctly (a negative cosine means obtuse), and the other two are then certainly acute.', 'Hanya sudut terbesar yang dapat tumpul. Arkus kosinus menemukannya dengan benar (kosinus negatif berarti tumpul), dan dua lainnya lalu pasti lancip.'),
            hint: L('Which angle could be obtuse?', 'Sudut mana yang dapat tumpul?'),
          },
        },
        {
          kind: 'activity',
          title: L('What kind of triangle?', 'Segitiga jenis apa?'),
          step: {
            kind: 'quiz',
            id: 'p9',
            prompt: L('A triangle has sides 6, 7 and 10. What is the largest angle?', 'Sebuah segitiga bersisi 6, 7, dan 10. Apa sudut terbesarnya?'),
            options: [L('acute', 'lancip'), L('a right angle', 'siku-siku'), L('obtuse', 'tumpul'), L('it cannot be a triangle', 'tidak dapat menjadi segitiga')],
            answer: 2,
            explain: L('$10^2=100$ is larger than $6^2+7^2=36+49=85$, so the angle opposite $10$ is obtuse. And $6+7=13>10$, so it is a triangle.', '$10^2=100$ lebih besar daripada $6^2+7^2=36+49=85$, sehingga sudut di depan $10$ tumpul. Dan $6+7=13>10$, jadi ia segitiga.'),
            hint: L('Compare the square of the longest side with the sum of the other two squares.', 'Bandingkan kuadrat sisi terpanjang dengan jumlah dua kuadrat lainnya.'),
          },
        },
        {
          kind: 'activity',
          title: L('Which forms are right?', 'Bentuk mana yang benar?'),
          step: {
            kind: 'multi',
            id: 'p10',
            prompt: L('Which of these are correct forms of the law of cosines? Choose **all** that apply.', 'Mana dari berikut yang merupakan bentuk aturan kosinus yang benar? Pilih **semua** yang benar.'),
            options: [
              L(T`$c^2=a^2+b^2-2ab\cos C$`, T`$c^2=a^2+b^2-2ab\cos C$`),
              L(T`$a^2=b^2+c^2-2bc\cos A$`, T`$a^2=b^2+c^2-2bc\cos A$`),
              L(T`$a^2=b^2+c^2-2bc\cos B$`, T`$a^2=b^2+c^2-2bc\cos B$`),
              L(T`$c^2=a^2+b^2+2ab\cos C$`, T`$c^2=a^2+b^2+2ab\cos C$`),
              L(T`$\cos C=\frac{a^2+b^2-c^2}{2ab}$`, T`$\cos C=\frac{a^2+b^2-c^2}{2ab}$`),
            ],
            answer: [0, 1, 4],
            explain: L(T`The angle in the cosine must be the one opposite the side on the left, and the sign is a minus. The last form is the first solved for the cosine.`, T`Sudut dalam kosinus harus yang di depan sisi di ruas kiri, dan tandanya minus. Bentuk terakhir adalah yang pertama diselesaikan untuk kosinus.`),
            hint: L('Check the angle against the side on the left, and the sign of the last term.', 'Periksa sudutnya terhadap sisi di ruas kiri, dan tanda suku terakhir.'),
          },
        },
        {
          kind: 'activity',
          title: L('Order the solution', 'Urutkan penyelesaiannya'),
          step: {
            kind: 'order',
            id: 'p11',
            prompt: L('Put the steps of finding the angles of a triangle from its three sides in order.', 'Urutkan langkah mencari sudut segitiga dari ketiga sisinya.'),
            lines: {
              en: ['Check the triangle inequality: each side is shorter than the sum of the other two', 'Find the largest angle, opposite the longest side: cos C = (a² + b² − c²) / 2ab', 'Find a second angle in the same way', 'Find the third angle: 180° minus the other two, and check that the largest angle faces the longest side'],
              id: ['Periksa ketaksamaan segitiga: tiap sisi lebih pendek daripada jumlah dua lainnya', 'Cari sudut terbesar, di depan sisi terpanjang: cos C = (a² + b² − c²) / 2ab', 'Cari sudut kedua dengan cara yang sama', 'Cari sudut ketiga: 180° dikurangi dua lainnya, dan periksa bahwa sudut terbesar menghadap sisi terpanjang'],
            },
            explain: L(T`A triangle must exist before you look for its angles, and the largest angle goes first.`, T`Segitiga harus ada sebelum kita mencari sudutnya, dan sudut terbesar didahulukan.`),
            hint: L(T`The check on the sides comes first; the angle sum finishes it.`, T`Pemeriksaan pada sisi-sisinya datang pertama; jumlah sudut menutupnya.`),
          },
        },
        {
          kind: 'activity',
          title: L('Fill in the angle', 'Isi sudutnya'),
          step: {
            kind: 'fill',
            id: 'p12',
            prompt: L('Complete the law of cosines for the side c.', 'Lengkapi aturan kosinus untuk sisi c.'),
            template: {
              en: 'c² = a² + b² − 2ab cos ___',
              id: 'c² = a² + b² − 2ab cos ___',
            },
            blanks: { en: ['C'], id: ['C'] },
            explain: L(T`The angle is $C$, the one between $a$ and $b$ and opposite $c$.`, T`Sudutnya $C$, yang berada di antara $a$ dan $b$ dan di depan $c$.`),
            hint: L(T`Which angle is enclosed by the two sides $a$ and $b$?`, T`Sudut mana yang diapit oleh kedua sisi $a$ dan $b$?`),
          },
        },
      ],
    },

    /* --------------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: the law of cosines at a glance', 'Ringkasan: aturan kosinus sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **The law:** $c^2=a^2+b^2-2ab\cos C$, with $C$ between $a$ and $b$ and opposite $c$; and $\cos C=\frac{a^2+b^2-c^2}{2ab}$.
- **Pythagoras with a correction:** at $90^\circ$ it vanishes; acute subtracts, obtuse adds.
- **Proof:** the altitude splits $a$ into $b\cos C$ and $a-b\cos C$ (the first is negative for an obtuse $C$), and $h=b\sin C$.
- **Range and kinds:** $|a-b|\le c\le a+b$; comparing $c^2$ with $a^2+b^2$ gives acute, right or obtuse, and proves the converse of Pythagoras.
- **SAS:** the third side in one step. **SSS:** each angle; the largest first.
- **Forces:** $R^2=F_1^2+F_2^2+2F_1F_2\cos\theta$ for the angle $\theta$ between the directions. **Journeys:** the angle at the bend is $180^\circ$ minus the turn.
- **Heron and median:** $16K^2=4a^2b^2-(a^2+b^2-c^2)^2$ gives Heron's formula; $m_c=\frac12\sqrt{2a^2+2b^2-c^2}$.
- **Numerics:** the arccosine loses a thin triangle's angle; use $\tan\frac C2=\sqrt{\frac{(s-a)(s-b)}{s(s-c)}}$ with $s-a=\frac{c+(b-a)}{2}$ and $s-b=\frac{c-(b-a)}{2}$.`,
            T`- **Aturannya:** $c^2=a^2+b^2-2ab\cos C$, dengan $C$ di antara $a$ dan $b$ dan di depan $c$; dan $\cos C=\frac{a^2+b^2-c^2}{2ab}$.
- **Pythagoras dengan koreksi:** pada $90^\circ$ ia lenyap; lancip mengurangi, tumpul menambah.
- **Bukti:** garis tinggi membagi $a$ menjadi $b\cos C$ dan $a-b\cos C$ (yang pertama negatif untuk $C$ tumpul), dan $h=b\sin C$.
- **Jangkauan dan jenis:** $|a-b|\le c\le a+b$; membandingkan $c^2$ dengan $a^2+b^2$ memberi lancip, siku-siku, atau tumpul, dan membuktikan kebalikan Pythagoras.
- **SAS:** sisi ketiga dalam satu langkah. **SSS:** tiap sudut; yang terbesar dulu.
- **Gaya:** $R^2=F_1^2+F_2^2+2F_1F_2\cos\theta$ untuk sudut $\theta$ di antara arahnya. **Perjalanan:** sudut di tikungan adalah $180^\circ$ dikurangi belokan.
- **Heron dan garis berat:** $16K^2=4a^2b^2-(a^2+b^2-c^2)^2$ memberi rumus Heron; $m_c=\frac12\sqrt{2a^2+2b^2-c^2}$.
- **Numerik:** arkus kosinus kehilangan sudut segitiga tipis; pakai $\tan\frac C2=\sqrt{\frac{(s-a)(s-b)}{s(s-c)}}$ dengan $s-a=\frac{c+(b-a)}{2}$ dan $s-b=\frac{c-(b-a)}{2}$.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Law of cosines', 'Aturan kosinus'), definition: L('The rule that in a triangle the square of a side equals the sum of the squares of the other two minus twice their product times the cosine of the angle between them.', 'Aturan bahwa pada segitiga kuadrat sebuah sisi sama dengan jumlah kuadrat dua sisi lainnya dikurangi dua kali hasil kalinya kali kosinus sudut di antaranya.') },
    { term: L('Included angle', 'Sudut apit'), definition: L('The angle between two given sides of a triangle, which is also the angle opposite the third side.', 'Sudut di antara dua sisi yang diberikan pada segitiga, yang juga sudut di depan sisi ketiga.') },
    { term: L('Correction term', 'Suku koreksi'), definition: L('The term minus 2ab cos C that turns the Pythagorean theorem into the law of cosines; it is zero at a right angle, negative for an acute angle and positive for an obtuse one.', 'Suku minus 2ab cos C yang mengubah teorema Pythagoras menjadi aturan kosinus; ia nol pada sudut siku-siku, negatif untuk sudut lancip, dan positif untuk yang tumpul.') },
    { term: L('Triangle inequality', 'Ketaksamaan segitiga'), definition: L('The rule that each side of a triangle is shorter than the sum of the other two and longer than their difference, which the law of cosines contains.', 'Aturan bahwa tiap sisi segitiga lebih pendek daripada jumlah dua sisi lainnya dan lebih panjang daripada selisihnya, yang termuat dalam aturan kosinus.') },
    { term: L('Resultant', 'Resultan'), definition: L('The single force or vector equal to the sum of two others; its size follows from the law of cosines with the angle 180 degrees minus the angle between the directions.', 'Gaya atau vektor tunggal yang sama dengan jumlah dua lainnya; besarnya mengikuti aturan kosinus dengan sudut 180 derajat dikurangi sudut di antara arahnya.') },
    { term: L('Bearing', 'Arah mata angin'), definition: L('A direction given as an angle measured clockwise from north, written with three digits, such as 060 degrees.', 'Arah yang diberikan sebagai sudut yang diukur searah jarum jam dari utara, ditulis dengan tiga angka, seperti 060 derajat.') },
    { term: L('Median', 'Garis berat'), definition: L('The segment from a vertex of a triangle to the midpoint of the opposite side; its length is a half of the square root of 2a squared plus 2b squared minus c squared.', 'Ruas dari sebuah titik sudut segitiga ke titik tengah sisi di depannya; panjangnya setengah akar dari 2a kuadrat ditambah 2b kuadrat dikurangi c kuadrat.') },
    { term: L('Half-angle form', 'Bentuk setengah sudut'), definition: L('The formula tan of C over 2 equals the square root of s minus a times s minus b over s times s minus c, which finds an angle from three sides without losing the digits of a tiny angle.', 'Rumus tan C per 2 sama dengan akar dari s dikurangi a kali s dikurangi b per s kali s dikurangi c, yang mencari sudut dari tiga sisi tanpa kehilangan digit sudut yang sangat kecil.') },
  ],

  howTo: [
    {
      name: L('How to find the third side from two sides and the angle between them', 'Cara mencari sisi ketiga dari dua sisi dan sudut apitnya'),
      description: L('Put the two sides and the included angle into the law of cosines and take the square root.', 'Masukkan dua sisi dan sudut apit ke aturan kosinus dan tarik akar kuadratnya.'),
      steps: [
        { name: L('Name the sides and the angle', 'Namai sisi dan sudutnya'), text: L('Call the two known sides a and b and the angle between them C, so that the unknown side c is opposite C.', 'Sebut kedua sisi yang diketahui a dan b dan sudut di antaranya C, sehingga sisi c yang tak diketahui berada di depan C.') },
        { name: L('Compute the squares and the product', 'Hitung kuadrat dan hasil kalinya'), text: L('Compute a squared, b squared and 2 a b cos C, with the calculator in degree mode.', 'Hitung a kuadrat, b kuadrat, dan 2 a b cos C, dengan kalkulator mode derajat.') },
        { name: L('Combine and take the root', 'Gabungkan dan tarik akarnya'), text: L('c squared is a squared plus b squared minus 2 a b cos C; take the square root for c.', 'c kuadrat adalah a kuadrat ditambah b kuadrat dikurangi 2 a b cos C; tarik akar kuadrat untuk c.') },
        { name: L('Check the range', 'Periksa jangkauannya'), text: L('c must be between the absolute difference of a and b and the sum of a and b.', 'c harus berada di antara selisih mutlak a dan b dan jumlah a dan b.') },
      ],
    },
    {
      name: L('How to find the three angles of a triangle from its three sides', 'Cara mencari ketiga sudut segitiga dari ketiga sisinya'),
      description: L('Find the largest angle first with the law of cosines, then the other two.', 'Cari sudut terbesar dulu dengan aturan kosinus, lalu dua lainnya.'),
      steps: [
        { name: L('Check the sides', 'Periksa sisinya'), text: L('Each side must be shorter than the sum of the other two, or there is no triangle.', 'Tiap sisi harus lebih pendek daripada jumlah dua lainnya, kalau tidak tak ada segitiga.') },
        { name: L('Find the largest angle', 'Cari sudut terbesar'), text: L('The largest angle is opposite the longest side c: cos C equals a squared plus b squared minus c squared, over 2 a b. A negative cosine means an obtuse angle.', 'Sudut terbesar berada di depan sisi terpanjang c: cos C sama dengan a kuadrat ditambah b kuadrat dikurangi c kuadrat, per 2 a b. Kosinus negatif berarti sudut tumpul.') },
        { name: L('Find a second angle', 'Cari sudut kedua'), text: L('Use the same form for another angle, with the sides renamed; it is certainly acute.', 'Pakai bentuk yang sama untuk sudut lain, dengan sisi diberi nama ulang; ia pasti lancip.') },
        { name: L('Subtract for the third', 'Kurangkan untuk yang ketiga'), text: L('The third angle is 180 degrees minus the other two.', 'Sudut ketiga adalah 180 derajat dikurangi dua lainnya.') },
      ],
    },
    {
      name: L('How to find the distance and bearing after a journey of two legs', 'Cara mencari jarak dan arah setelah perjalanan dua leg'),
      description: L('Find the turn at the bend, the angle inside the triangle, and use the law of cosines for the distance and the angle at the start.', 'Cari belokan di tikungan, sudut di dalam segitiga, dan pakai aturan kosinus untuk jarak dan sudut di awal.'),
      steps: [
        { name: L('Find the turn', 'Cari belokannya'), text: L('The turn at the bend is the difference between the two bearings, taken the short way round, never more than 180 degrees.', 'Belokan di tikungan adalah selisih kedua arah mata angin, lewat jalan yang pendek, tak pernah lebih dari 180 derajat.') },
        { name: L('Find the angle in the triangle', 'Cari sudut dalam segitiga'), text: L('The angle of the triangle at the bend is 180 degrees minus the turn.', 'Sudut segitiga di tikungan adalah 180 derajat dikurangi belokan.') },
        { name: L('Apply the law of cosines', 'Terapkan aturan kosinus'), text: L('The distance back is the square root of d1 squared plus d2 squared minus 2 d1 d2 cos of that angle.', 'Jarak kembali adalah akar dari d1 kuadrat ditambah d2 kuadrat dikurangi 2 d1 d2 cos sudut itu.') },
        { name: L('Find the bearing', 'Cari arahnya'), text: L('Find the angle at the start by the law of cosines on the three sides and add it to the first bearing if the course turned right, or subtract it if left.', 'Cari sudut di awal dengan aturan kosinus pada ketiga sisi dan tambahkan pada arah pertama bila haluan berbelok ke kanan, atau kurangkan bila ke kiri.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is the formula for the law of cosines?', 'Apa rumus aturan kosinus?'),
      a: L(
        'In a triangle with sides a, b, c and the angle C between a and b, c squared equals a squared plus b squared minus 2 a b times the cosine of C. For a right angle the cosine is zero and it becomes the Pythagorean theorem.',
        'Pada segitiga dengan sisi a, b, c dan sudut C di antara a dan b, c kuadrat sama dengan a kuadrat ditambah b kuadrat dikurangi 2 a b kali kosinus C. Untuk sudut siku-siku kosinusnya nol dan ia menjadi teorema Pythagoras.',
      ),
    },
    {
      q: L('How do you prove the law of cosines?', 'Bagaimana membuktikan aturan kosinus?'),
      a: L(
        'Drop the altitude from A onto side a. It cuts a into b cos C and a minus b cos C, and its height is b sin C. Pythagoras in the right triangle on the other side gives c squared, and sin squared plus cos squared equals 1 finishes it.',
        'Jatuhkan garis tinggi dari A ke sisi a. Ia membagi a menjadi b cos C dan a dikurangi b cos C, dan tingginya b sin C. Pythagoras pada segitiga siku-siku di sisi lain memberi c kuadrat, dan sin kuadrat ditambah cos kuadrat sama dengan 1 menyelesaikannya.',
      ),
    },
    {
      q: L('When do you use the law of cosines instead of the law of sines?', 'Kapan memakai aturan kosinus alih-alih aturan sinus?'),
      a: L(
        'When no side comes with its opposite angle: two sides and the angle between them, or three sides. With a side and its opposite angle known, the law of sines is quicker. For finding an angle the law of cosines is also safer.',
        'Ketika tak ada sisi yang disertai sudut di depannya: dua sisi dan sudut apitnya, atau tiga sisi. Dengan sebuah sisi dan sudut di depannya diketahui, aturan sinus lebih cepat. Untuk mencari sudut, aturan kosinus juga lebih aman.',
      ),
    },
    {
      q: L('How do you find an angle from three sides?', 'Bagaimana mencari sudut dari tiga sisi?'),
      a: L(
        'Use cos C equals a squared plus b squared minus c squared, over 2 a b, and take the arccosine. Find the largest angle first, opposite the longest side, since only it can be obtuse; a negative cosine means obtuse.',
        'Pakai cos C sama dengan a kuadrat ditambah b kuadrat dikurangi c kuadrat, per 2 a b, dan ambil arkus kosinus. Cari sudut terbesar dulu, di depan sisi terpanjang, karena hanya ia yang dapat tumpul; kosinus negatif berarti tumpul.',
      ),
    },
    {
      q: L('Why does the law of cosines become the Pythagorean theorem at 90 degrees?', 'Mengapa aturan kosinus menjadi teorema Pythagoras pada 90 derajat?'),
      a: L(
        'The cosine of 90 degrees is zero, so the term minus 2 a b cos C disappears and c squared equals a squared plus b squared. The term is the correction for an angle that is not a right angle: negative if acute, positive if obtuse.',
        'Kosinus 90 derajat adalah nol, sehingga suku minus 2 a b cos C lenyap dan c kuadrat sama dengan a kuadrat ditambah b kuadrat. Suku itu adalah koreksi untuk sudut yang bukan siku-siku: negatif bila lancip, positif bila tumpul.',
      ),
    },
    {
      q: L('How do you add two forces at an angle?', 'Bagaimana menjumlahkan dua gaya pada sebuah sudut?'),
      a: L(
        'Use R squared equals F1 squared plus F2 squared plus 2 F1 F2 cos theta, where theta is the angle between the directions of the two forces. It is a plus because the angle inside the triangle is 180 degrees minus theta.',
        'Pakai R kuadrat sama dengan F1 kuadrat ditambah F2 kuadrat ditambah 2 F1 F2 cos theta, dengan theta sudut di antara arah kedua gaya. Ia plus karena sudut di dalam segitiga adalah 180 derajat dikurangi theta.',
      ),
    },
    {
      q: L('Why does the law of cosines give a wrong angle for a very thin triangle?', 'Mengapa aturan kosinus memberi sudut yang salah untuk segitiga yang sangat tipis?'),
      a: L(
        'The cosine of a tiny angle is a number extremely close to 1, which a computer rounds to exactly 1, so the arccosine returns 0. Use the half-angle formula for tan of C over 2, or the law of sines, which keep the digits.',
        'Kosinus sudut yang sangat kecil adalah bilangan yang sangat dekat dengan 1, yang dibulatkan komputer menjadi tepat 1, sehingga arkus kosinus mengembalikan 0. Pakai rumus setengah sudut untuk tan C per 2, atau aturan sinus, yang menjaga digitnya.',
      ),
    },
    {
      q: L('How do you find the distance after two legs of a journey with different bearings?', 'Bagaimana mencari jarak setelah dua leg perjalanan dengan arah berbeda?'),
      a: L(
        'The angle of the triangle at the bend is 180 degrees minus the turn between the two bearings. Then the distance is the square root of d1 squared plus d2 squared minus 2 d1 d2 times the cosine of that angle.',
        'Sudut segitiga di tikungan adalah 180 derajat dikurangi belokan di antara kedua arah. Lalu jaraknya adalah akar dari d1 kuadrat ditambah d2 kuadrat dikurangi 2 d1 d2 kali kosinus sudut itu.',
      ),
    },
  ],

  references: [
    { title: 'Precalculus: Mathematics for Calculus (chapters on the law of sines and the law of cosines)', author: 'James Stewart, Lothar Redlin, Saleem Watson', year: 2016, source: 'Cengage Learning' },
    { title: 'Trigonometry (2nd ed.)', author: 'I. M. Gelfand, Mark Saul', year: 2001, source: 'Birkhäuser' },
    { title: 'Trigonometric Delights', author: 'Eli Maor', year: 1998, source: 'Princeton University Press' },
    { title: 'The Thirteen Books of Euclid\'s Elements (Book II, Propositions 12 and 13)', author: 'Thomas L. Heath (translator)', year: 1956, source: 'Dover' },
    { title: 'A History of Mathematics (3rd ed.)', author: 'Carl B. Boyer, Uta C. Merzbach', year: 2011, source: 'Wiley' },
    { title: 'Introductio in analysin infinitorum', author: 'Leonhard Euler', year: 1748, source: 'Marcum-Michaelem Bousquet' },
    { title: 'What Every Computer Scientist Should Know About Floating-Point Arithmetic', author: 'David Goldberg', year: 1991, source: 'ACM Computing Surveys' },
  ],

  related: ['law-of-sines', 'triangles', 'pythagorean-theorem', 'trigonometric-identities'],
}
