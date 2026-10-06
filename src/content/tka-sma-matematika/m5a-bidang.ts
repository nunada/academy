import type { FigColor, FigItem } from '../../lib/figure'
import type { Submodule } from '../types'
import { L, circle2d, ellipsePts, fit, line, outline, rightTriangle, shape, txt } from './figs'
import type { Pt } from './figs'
import { lessonCongruence } from './m5c-kekongruenan'

/** Module 5, submodule 1 — triangles (angle sum, Pythagoras, similarity) and
 *  circles (central and inscribed angles, tangents, arcs and sectors). */

const rad = (d: number) => (d * Math.PI) / 180
const tidy = (n: number) => Number(n.toFixed(4))

/** A point on a circle of radius `r` about the origin, at `deg` degrees. */
const onCircle = (r: number, deg: number): Pt => [tidy(r * Math.cos(rad(deg))), tidy(r * Math.sin(rad(deg)))]

/** A circle of radius `r` about the origin with extra drawing on top. */
function circleWith(r: number, extra: FigItem[], more: Pt[] = []) {
  return {
    dim: 2 as const,
    axes: false as const,
    ...fit([[-r, -r], [r, r], ...more], 0.9),
    items: [outline(ellipsePts(0, 0, r, r), 'muted'), ...extra],
  }
}

const name = (p: Pt, text: string, out: number, color: FigColor = 'result'): FigItem => {
  const len = Math.hypot(p[0], p[1]) || 1
  return txt(tidy(p[0] + (p[0] / len) * out), tidy(p[1] + (p[1] / len) * out), text, 'lg', color)
}

export const m5s1: Submodule = {
  id: 'tka-sma-m5-s1',
  title: L('Triangles and Circles', 'Segitiga dan Lingkaran'),
  summary: L(
    'Use angle sums, the Pythagorean theorem and similar triangles; then use central and inscribed angles, tangents, arcs and sectors of a circle.',
    'Memakai jumlah sudut, teorema Pythagoras, dan segitiga sebangun; lalu memakai sudut pusat dan sudut keliling, garis singgung, busur, dan juring lingkaran.',
  ),
  lessons: [
    /* ---------------------------------------------------------- L1 triangles */
    {
      id: 'tka-sma-m5-s1-l1',
      title: L('Triangles: Angles, Pythagoras and Similarity', 'Segitiga: Sudut, Pythagoras, dan Kesebangunan'),
      goal: L(
        'You can use the angle sum and exterior angle, the Pythagorean theorem, and similar triangles to find unknown lengths and angles.',
        'Kamu bisa memakai jumlah sudut dan sudut luar, teorema Pythagoras, dan segitiga sebangun untuk mencari panjang dan sudut yang belum diketahui.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: The Angles of a Triangle', 'Ayo Amati: Sudut-Sudut Segitiga'),
          body: L(
            'The three angles of **every** triangle add up to $180^{\\circ}$. In the picture $50^{\\circ}+60^{\\circ}+70^{\\circ}=180^{\\circ}$.\n\n- Extend one side: the angle outside the triangle is the **exterior angle**. It equals the sum of the two interior angles **not** next to it. Here the exterior angle at $C$ is $50^{\\circ}+60^{\\circ}=110^{\\circ}$, and it also equals $180^{\\circ}-70^{\\circ}$.\n- In an **isosceles** triangle the angles opposite the equal sides are equal.\n- In an **equilateral** triangle all three angles are $60^{\\circ}$.',
            'Ketiga sudut **setiap** segitiga berjumlah $180^{\\circ}$. Pada gambar, $50^{\\circ}+60^{\\circ}+70^{\\circ}=180^{\\circ}$.\n\n- Perpanjang satu sisi: sudut di luar segitiga adalah **sudut luar**. Besarnya sama dengan jumlah dua sudut dalam yang **tidak** berdekatan dengannya. Di sini sudut luar di $C$ adalah $50^{\\circ}+60^{\\circ}=110^{\\circ}$, dan juga sama dengan $180^{\\circ}-70^{\\circ}$.\n- Pada segitiga **sama kaki**, sudut yang berhadapan dengan sisi-sisi sama panjang itu sama besar.\n- Pada segitiga **sama sisi**, ketiga sudutnya $60^{\\circ}$.',
          ),
          figure: {
            ...shape({
              pts: [[0, 0], [6, 0], [2, 3.2]],
              names: 'ABC',
              extra: [
                line([6, 0], [7, 0], 'muted'),
                { t: 'angle', at: [0, 0], from: [6, 0], to: [2, 3.2], label: '50°' },
                { t: 'angle', at: [6, 0], from: [2, 3.2], to: [0, 0], label: '60°' },
                { t: 'angle', at: [2, 3.2], from: [0, 0], to: [6, 0], label: '70°' },
              ],
            }),
            caption: L('A triangle with angles 50°, 60° and 70°.', 'Sebuah segitiga dengan sudut 50°, 60°, dan 70°.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Pythagoras and Special Triangles', 'Contoh Bertahap: Pythagoras dan Segitiga Istimewa'),
          body: L(
            'In a **right triangle** with legs $a,b$ and hypotenuse $c$ (the side opposite the right angle):\n\n$$a^2+b^2=c^2$$\n\nFind the hypotenuse of the triangle with legs 3 and 4.\n\n1. Step 1: $c^2=3^2+4^2=9+16=25$.\n2. Step 2: $c=\\sqrt{25}=5$.\n\nCommon triples: $3,4,5$; $5,12,13$; $8,15,17$; $7,24,25$ (and their multiples, like $6,8,10$).\n\nThe **converse** also works: if $a^2+b^2=c^2$, the triangle is right-angled. And two special triangles have fixed side ratios:\n\n- Half a square ($45^{\\circ},45^{\\circ},90^{\\circ}$): sides $1:1:\\sqrt{2}$.\n- Half an equilateral triangle ($30^{\\circ},60^{\\circ},90^{\\circ}$): sides $1:\\sqrt{3}:2$.',
            'Pada **segitiga siku-siku** dengan sisi tegak $a,b$ dan sisi miring $c$ (sisi di hadapan sudut siku-siku):\n\n$$a^2+b^2=c^2$$\n\nCari sisi miring segitiga dengan sisi tegak 3 dan 4.\n\n1. Langkah 1: $c^2=3^2+4^2=9+16=25$.\n2. Langkah 2: $c=\\sqrt{25}=5$.\n\nTripel yang umum: $3,4,5$; $5,12,13$; $8,15,17$; $7,24,25$ (dan kelipatannya, seperti $6,8,10$).\n\n**Kebalikannya** juga berlaku: jika $a^2+b^2=c^2$, segitiganya siku-siku. Dan dua segitiga istimewa punya perbandingan sisi tetap:\n\n- Setengah persegi ($45^{\\circ},45^{\\circ},90^{\\circ}$): sisi $1:1:\\sqrt{2}$.\n- Setengah segitiga sama sisi ($30^{\\circ},60^{\\circ},90^{\\circ}$): sisi $1:\\sqrt{3}:2$.',
          ),
          figure: {
            ...rightTriangle({ a: 4, b: 3, corners: ['A', 'B', 'C'], sides: { across: '4', up: '3', slant: '5' } }),
            caption: L('The 3-4-5 right triangle.', 'Segitiga siku-siku 3-4-5.'),
          },
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Similar Triangles', 'Contoh Bertahap: Segitiga Sebangun'),
          body: L(
            'Two triangles are **similar** if they have the same angles. Then the sides are in the same ratio: the **scale factor** $k$.\n\nIn the picture the small triangle has legs 4 and 3, and the large one has legs 8 and 6, so $k=2$.\n\n- Lengths scale by $k$, so the hypotenuse is 10 instead of 5.\n- **Areas** scale by $k^2$: $\\frac{24}{6}=4=2^2$.\n\nA person 1.5 m tall casts a shadow 2 m long. At the same moment a tree casts a shadow 12 m long. How tall is the tree?\n\n1. Step 1: Sun rays make equal angles, so the triangles are similar: $\\frac{\\text{height}}{\\text{shadow}}$ is the same.\n2. Step 2: $\\frac{h}{12}=\\frac{1.5}{2}$.\n3. Step 3: $h=12\\times0.75=9$ m.',
            'Dua segitiga **sebangun** jika sudut-sudutnya sama. Maka sisi-sisinya berperbandingan sama: **faktor skala** $k$.\n\nPada gambar, segitiga kecil bersisi tegak 4 dan 3, dan yang besar 8 dan 6, jadi $k=2$.\n\n- Panjang berskala $k$, jadi sisi miringnya 10 dan bukan 5.\n- **Luas** berskala $k^2$: $\\frac{24}{6}=4=2^2$.\n\nSeseorang setinggi 1,5 m bayangannya 2 m. Pada saat yang sama sebuah pohon bayangannya 12 m. Berapa tinggi pohon itu?\n\n1. Langkah 1: Sinar matahari membuat sudut yang sama, jadi segitiganya sebangun: $\\frac{\\text{tinggi}}{\\text{bayangan}}$ sama.\n2. Langkah 2: $\\frac{h}{12}=\\frac{1{,}5}{2}$.\n3. Langkah 3: $h=12\\times0{,}75=9$ m.',
          ),
          figure: {
            ...shape({
              pts: [[0, 0], [8, 0], [0, 6]],
              rights: [0],
              extra: [
                { t: 'poly', pts: [[0, 0], [4, 0], [0, 3]], color: 'b', look: 'solid' },
                txt(2, -0.6, '4', 'md', 'muted'),
                txt(6, -0.6, '8', 'md', 'muted'),
                txt(-0.6, 1.5, '3', 'md', 'muted'),
                txt(-0.6, 4.5, '6', 'md', 'muted'),
              ],
            }),
            caption: L('A small triangle inside a similar large one (scale factor 2).', 'Segitiga kecil di dalam segitiga besar yang sebangun (faktor skala 2).'),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'A right triangle has legs 9 and 12. What is the length of the hypotenuse?',
            'Sebuah segitiga siku-siku memiliki sisi tegak 9 dan 12. Berapa panjang sisi miringnya?',
          ),
          figure: {
            ...rightTriangle({ a: 12, b: 9, sides: { across: '12', up: '9', slant: '?' } }),
            caption: L('A right triangle with legs 9 and 12.', 'Segitiga siku-siku dengan sisi tegak 9 dan 12.'),
          },
          options: [L('15', '15'), L('21', '21'), L('$3\\sqrt{7}$', '$3\\sqrt{7}$'), L('7.5', '7,5')],
          answer: 0,
          explain: L(
            '$c^2=81+144=225$, so $c=15$. (A multiple of the 3-4-5 triangle: $3\\times3$, $3\\times4$, $3\\times5$.) $3\\sqrt{7}$ comes from subtracting instead of adding.',
            '$c^2=81+144=225$, jadi $c=15$. (Kelipatan segitiga 3-4-5: $3\\times3$, $3\\times4$, $3\\times5$.) $3\\sqrt{7}$ berasal dari mengurangkan, bukan menjumlahkan.',
          ),
          hint: L(
            'The hypotenuse is the longest side. Add the squares of the legs.',
            'Sisi miring adalah sisi terpanjang. Jumlahkan kuadrat sisi tegaknya.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: find the hypotenuse $AC$ of the triangle with legs 9 and 12.',
            'Coba bersama: cari sisi miring $AC$ segitiga dengan sisi tegak 9 dan 12.',
          ),
          template: 'AC^2=9^2+12^2=81+___=___ \\Rightarrow AC=___',
          blanks: ['144', '225', '15'],
          explain: L(
            '$12^2=144$ and $81+144=225$, and $\\sqrt{225}=15$.',
            '$12^2=144$ dan $81+144=225$, dan $\\sqrt{225}=15$.',
          ),
          hint: L(
            'Square 12 first, then add, then take the square root.',
            'Kuadratkan 12 dulu, lalu jumlahkan, lalu tarik akar kuadrat.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO sets of side lengths that form a right triangle.', 'Pilih DUA himpunan panjang sisi yang membentuk segitiga siku-siku.'),
          options: [L('5, 12, 13', '5, 12, 13'), L('8, 15, 17', '8, 15, 17'), L('6, 8, 11', '6, 8, 11'), L('7, 9, 12', '7, 9, 12')],
          answer: [0, 1],
          explain: L(
            '$25+144=169$ and $64+225=289$. But $36+64=100\\neq121$ and $49+81=130\\neq144$.',
            '$25+144=169$ dan $64+225=289$. Namun $36+64=100\\neq121$ dan $49+81=130\\neq144$.',
          ),
          hint: L(
            'Square the two shorter sides, add them, and compare with the square of the longest side.',
            'Kuadratkan dua sisi yang lebih pendek, jumlahkan, lalu bandingkan dengan kuadrat sisi terpanjang.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('The angles of a triangle add up to $180^{\\circ}$.', 'Sudut-sudut segitiga berjumlah $180^{\\circ}$.'),
            L('An exterior angle equals the sum of the two interior angles that are not next to it.', 'Sudut luar sama dengan jumlah dua sudut dalam yang tidak berdekatan dengannya.'),
            L('Two similar triangles always have equal areas.', 'Dua segitiga sebangun selalu memiliki luas yang sama.'),
            L('A triangle with sides 4, 5 and 6 is right-angled.', 'Segitiga dengan sisi 4, 5, dan 6 siku-siku.'),
          ],
          answer: [true, true, false, false],
          explain: L(
            'The first two are theorems. Similar triangles have equal angles but may differ in size, and the areas differ by $k^2$. And $16+25=41\\neq36$, so 4, 5, 6 is not a right triangle.',
            'Dua yang pertama adalah teorema. Segitiga sebangun punya sudut yang sama tetapi ukurannya bisa berbeda, dan luasnya berbeda $k^2$ kali. Dan $16+25=41\\neq36$, jadi 4, 5, 6 bukan segitiga siku-siku.',
          ),
          hint: L(
            'For the last one, compare $4^2+5^2$ with $6^2$.',
            'Untuk yang terakhir, bandingkan $4^2+5^2$ dengan $6^2$.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'A person 1.5 m tall casts a shadow 2 m long. At the same moment a tree casts a shadow 12 m long. How tall is the tree, in metres?',
            'Seseorang setinggi 1,5 m bayangannya 2 m. Pada saat yang sama sebuah pohon bayangannya 12 m. Berapa tinggi pohon itu, dalam meter?',
          ),
          blanks: [{ answer: 9, after: '\\text{m}' }],
          hints: [
            L('The person and the tree with their shadows make two similar right triangles.', 'Orang dan pohon beserta bayangannya membentuk dua segitiga siku-siku yang sebangun.'),
            L('The ratio height : shadow is the same: $\\frac{h}{12}=\\frac{1.5}{2}$.', 'Perbandingan tinggi : bayangan sama: $\\frac{h}{12}=\\frac{1{,}5}{2}$.'),
            L('Multiply both sides by 12.', 'Kalikan kedua ruas dengan 12.'),
          ],
          explain: L(
            '$h=12\\times\\frac{1.5}{2}=12\\times0.75=9$ m.',
            '$h=12\\times\\frac{1{,}5}{2}=12\\times0{,}75=9$ m.',
          ),
          solution: {
            en: ['\\frac{h}{12}=\\frac{1.5}{2}', 'h=12\\times0.75', 'h=9'],
            id: ['\\frac{h}{12}=\\frac{1{,}5}{2}', 'h=12\\times0{,}75', 'h=9'],
          },
        },
      ],
    },
    /* ----------------------------------------------------------- L2 circles */
    {
      id: 'tka-sma-m5-s1-l2',
      title: L('Circles: Angles, Tangents, Arcs', 'Lingkaran: Sudut, Garis Singgung, Busur'),
      goal: L(
        'You can use central and inscribed angles, tangent properties, and the length of an arc and the area of a sector.',
        'Kamu bisa memakai sudut pusat dan sudut keliling, sifat garis singgung, serta panjang busur dan luas juring.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Two Angles on One Arc', 'Ayo Amati: Dua Sudut pada Satu Busur'),
          body: L(
            'Look at the arc $AB$ of the circle with centre $O$.\n\n- The **central angle** $\\angle AOB$ has its corner at the centre. Here it is $100^{\\circ}$.\n- The **inscribed angle** $\\angle ACB$ has its corner $C$ on the circle and looks at the same arc. Here it is $50^{\\circ}$.\n\nThe key rule:\n\n$$\\text{inscribed angle}=\\tfrac{1}{2}\\times\\text{central angle on the same arc}$$\n\nSo every point $C$ on the big arc sees $AB$ under the same angle $50^{\\circ}$.',
            'Perhatikan busur $AB$ pada lingkaran berpusat $O$.\n\n- **Sudut pusat** $\\angle AOB$ titik sudutnya di pusat. Di sini besarnya $100^{\\circ}$.\n- **Sudut keliling** $\\angle ACB$ titik sudutnya $C$ di lingkaran dan menghadap busur yang sama. Di sini besarnya $50^{\\circ}$.\n\nAturan kuncinya:\n\n$$\\text{sudut keliling}=\\tfrac{1}{2}\\times\\text{sudut pusat pada busur yang sama}$$\n\nJadi setiap titik $C$ pada busur besar melihat $AB$ dengan sudut yang sama, $50^{\\circ}$.',
          ),
          figure: {
            ...circleWith(
              3,
              [
                line([0, 0], onCircle(3, 40), 'result', { width: 2.4 }),
                line([0, 0], onCircle(3, 140), 'result', { width: 2.4 }),
                line(onCircle(3, 270), onCircle(3, 40), 'a', { width: 2.4 }),
                line(onCircle(3, 270), onCircle(3, 140), 'a', { width: 2.4 }),
                { t: 'angle', at: [0, 0], from: onCircle(3, 40), to: onCircle(3, 140), label: '100°' },
                { t: 'angle', at: onCircle(3, 270), from: onCircle(3, 40), to: onCircle(3, 140), label: '50°' },
                { t: 'dot', x: 0, y: 0, color: 'muted' },
                txt(0.5, -0.4, 'O', 'lg', 'muted'),
                name(onCircle(3, 40), 'B', 0.5),
                name(onCircle(3, 140), 'A', 0.5),
                name(onCircle(3, 270), 'C', 0.5),
              ],
              [onCircle(3.6, 270)],
            ),
            caption: L('The central angle 100° and the inscribed angle 50° on the same arc.', 'Sudut pusat 100° dan sudut keliling 50° pada busur yang sama.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Tangents and Special Angles', 'Contoh Bertahap: Garis Singgung dan Sudut Istimewa'),
          body: L(
            'A **tangent** touches the circle at one point $T$.\n\n- The tangent is **perpendicular to the radius** at the touching point: $OT\\perp PT$.\n- Two tangents from the same outside point have **equal lengths**.\n\nA circle has radius 3 and the outside point $P$ is 5 from the centre $O$. How long is the tangent $PT$?\n\n1. Step 1: $OTP$ is a right triangle with the right angle at $T$.\n2. Step 2: $PT^2=OP^2-OT^2=25-9=16$.\n3. Step 3: $PT=4$.\n\nTwo more special angles:\n\n- An angle inscribed in a **semicircle** (on a diameter) is $90^{\\circ}$.\n- **Opposite angles of a cyclic quadrilateral** (all four corners on the circle) add up to $180^{\\circ}$.',
            '**Garis singgung** menyentuh lingkaran di satu titik $T$.\n\n- Garis singgung **tegak lurus jari-jari** di titik singgung: $OT\\perp PT$.\n- Dua garis singgung dari titik luar yang sama **sama panjang**.\n\nSebuah lingkaran berjari-jari 3 dan titik luar $P$ berjarak 5 dari pusat $O$. Berapa panjang garis singgung $PT$?\n\n1. Langkah 1: $OTP$ adalah segitiga siku-siku dengan sudut siku-siku di $T$.\n2. Langkah 2: $PT^2=OP^2-OT^2=25-9=16$.\n3. Langkah 3: $PT=4$.\n\nDua sudut istimewa lain:\n\n- Sudut keliling pada **setengah lingkaran** (menghadap diameter) adalah $90^{\\circ}$.\n- **Sudut-sudut berhadapan pada segi empat tali busur** (keempat titik sudut di lingkaran) berjumlah $180^{\\circ}$.',
          ),
          figure: {
            ...circleWith(
              3,
              [
                line([0, 0], [1.8, 2.4], 'a', { width: 2.4 }),
                line([1.8, 2.4], [5, 0], 'result', { width: 2.4 }),
                line([0, 0], [5, 0], 'muted', { dashed: true }),
                { t: 'right', at: [1.8, 2.4], from: [0, 0], to: [5, 0] },
                { t: 'dot', x: 0, y: 0, color: 'muted' },
                txt(-0.4, -0.45, 'O', 'lg', 'muted'),
                txt(5.4, -0.45, 'P', 'lg', 'result'),
                txt(1.6, 2.95, 'T', 'lg', 'result'),
                txt(0.4, 1.5, '3', 'md', 'a'),
                txt(3.7, 1.55, '4', 'md', 'result'),
                txt(2.5, -0.5, '5', 'md', 'muted'),
              ],
              [[5.8, -0.8]],
            ),
            caption: L('The tangent PT is perpendicular to the radius OT.', 'Garis singgung PT tegak lurus jari-jari OT.'),
          },
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Arc Length and Sector Area', 'Contoh Bertahap: Panjang Busur dan Luas Juring'),
          body: L(
            'A **sector** is the slice of a circle between two radii. With a central angle $\\theta$ (in degrees), the sector is the fraction $\\frac{\\theta}{360}$ of the whole circle.\n\n$$\\text{arc length}=\\frac{\\theta}{360}\\times2\\pi r\\qquad\\text{sector area}=\\frac{\\theta}{360}\\times\\pi r^2$$\n\nFor $r=6$ and $\\theta=60^{\\circ}$ (see the picture):\n\n1. Step 1: The fraction is $\\frac{60}{360}=\\frac{1}{6}$.\n2. Step 2: Arc length: $\\frac{1}{6}\\times2\\pi\\times6=2\\pi$.\n3. Step 3: Sector area: $\\frac{1}{6}\\times\\pi\\times36=6\\pi$.\n\n**Watch out:** the arc length is a length (units), the area is square units. Do not mix the formulas: the arc has $r$, the area has $r^2$.',
            '**Juring** adalah potongan lingkaran di antara dua jari-jari. Dengan sudut pusat $\\theta$ (dalam derajat), juring adalah bagian $\\frac{\\theta}{360}$ dari seluruh lingkaran.\n\n$$\\text{panjang busur}=\\frac{\\theta}{360}\\times2\\pi r\\qquad\\text{luas juring}=\\frac{\\theta}{360}\\times\\pi r^2$$\n\nUntuk $r=6$ dan $\\theta=60^{\\circ}$ (lihat gambar):\n\n1. Langkah 1: Bagiannya $\\frac{60}{360}=\\frac{1}{6}$.\n2. Langkah 2: Panjang busur: $\\frac{1}{6}\\times2\\pi\\times6=2\\pi$.\n3. Langkah 3: Luas juring: $\\frac{1}{6}\\times\\pi\\times36=6\\pi$.\n\n**Awas:** panjang busur adalah panjang (satuan), luas adalah satuan persegi. Jangan tertukar: busur memuat $r$, luas memuat $r^2$.',
          ),
          figure: {
            ...circle2d({ r: 3, radius: '6', sector: 60 }),
            caption: L('A sector of 60° in a circle of radius 6.', 'Juring 60° pada lingkaran berjari-jari 6.'),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            '$AB$ is a diameter of the circle and $\\angle CAB=35^{\\circ}$. What is $\\angle ABC$?',
            '$AB$ adalah diameter lingkaran dan $\\angle CAB=35^{\\circ}$. Berapa $\\angle ABC$?',
          ),
          figure: {
            ...circleWith(
              3,
              [
                line([-3, 0], [3, 0], 'muted', { width: 2.4 }),
                line([-3, 0], onCircle(3, 70), 'a', { width: 2.4 }),
                line([3, 0], onCircle(3, 70), 'a', { width: 2.4 }),
                { t: 'angle', at: [-3, 0], from: [3, 0], to: onCircle(3, 70), label: '35°' },
                txt(-3.5, -0.5, 'A', 'lg', 'result'),
                txt(3.5, -0.5, 'B', 'lg', 'result'),
                name(onCircle(3, 70), 'C', 0.5),
              ],
              [],
            ),
            caption: L('AB is a diameter and C is on the circle.', 'AB adalah diameter dan C berada di lingkaran.'),
          },
          options: [L('$55^{\\circ}$', '$55^{\\circ}$'), L('$35^{\\circ}$', '$35^{\\circ}$'), L('$90^{\\circ}$', '$90^{\\circ}$'), L('$145^{\\circ}$', '$145^{\\circ}$')],
          answer: 0,
          explain: L(
            'The angle at $C$ stands on the diameter, so $\\angle ACB=90^{\\circ}$. Then $\\angle ABC=180^{\\circ}-90^{\\circ}-35^{\\circ}=55^{\\circ}$.',
            'Sudut di $C$ menghadap diameter, jadi $\\angle ACB=90^{\\circ}$. Maka $\\angle ABC=180^{\\circ}-90^{\\circ}-35^{\\circ}=55^{\\circ}$.',
          ),
          hint: L(
            'First find the angle at $C$ using the diameter. Then use the angle sum of the triangle.',
            'Cari dulu sudut di $C$ memakai diameter. Lalu pakai jumlah sudut segitiga.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: for $r=6$ and $\\theta=60^{\\circ}$, find the arc length and the sector area (each is a multiple of $\\pi$).',
            'Coba bersama: untuk $r=6$ dan $\\theta=60^{\\circ}$, cari panjang busur dan luas juring (masing-masing kelipatan $\\pi$).',
          ),
          template: '\\frac{60}{360}\\times2\\pi\\times6=___\\pi \\quad \\frac{60}{360}\\times\\pi\\times6^2=___\\pi',
          blanks: ['2', '6'],
          explain: L(
            '$\\frac{1}{6}\\times12\\pi=2\\pi$ and $\\frac{1}{6}\\times36\\pi=6\\pi$.',
            '$\\frac{1}{6}\\times12\\pi=2\\pi$ dan $\\frac{1}{6}\\times36\\pi=6\\pi$.',
          ),
          hint: L(
            'The fraction $\\frac{60}{360}$ is $\\frac{1}{6}$. Multiply it by the whole circumference, then by the whole area.',
            'Pecahan $\\frac{60}{360}$ adalah $\\frac{1}{6}$. Kalikan dengan keliling seluruh lingkaran, lalu dengan luas seluruh lingkaran.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements about a circle.', 'Pilih DUA pernyataan yang benar tentang lingkaran.'),
          options: [
            L('An angle inscribed in a semicircle is a right angle.', 'Sudut keliling pada setengah lingkaran adalah sudut siku-siku.'),
            L('A central angle is twice the inscribed angle on the same arc.', 'Sudut pusat dua kali sudut keliling pada busur yang sama.'),
            L('A tangent is parallel to the radius at the touching point.', 'Garis singgung sejajar dengan jari-jari di titik singgung.'),
            L('Opposite angles of a cyclic quadrilateral are equal.', 'Sudut berhadapan segi empat tali busur sama besar.'),
          ],
          answer: [0, 1],
          explain: L(
            'The first two are circle theorems. A tangent is perpendicular, not parallel, to the radius. And opposite angles of a cyclic quadrilateral add up to $180^{\\circ}$; they are equal only in a rectangle or square.',
            'Dua yang pertama adalah teorema lingkaran. Garis singgung tegak lurus, bukan sejajar, dengan jari-jari. Dan sudut berhadapan segi empat tali busur berjumlah $180^{\\circ}$; keduanya sama besar hanya pada persegi panjang atau persegi.',
          ),
          hint: L(
            'Recall the rules for the semicircle, the central angle, the tangent and the cyclic quadrilateral.',
            'Ingat kembali aturan setengah lingkaran, sudut pusat, garis singgung, dan segi empat tali busur.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('A tangent is perpendicular to the radius at the touching point.', 'Garis singgung tegak lurus jari-jari di titik singgung.'),
            L('Two tangents from one outside point have equal lengths.', 'Dua garis singgung dari satu titik luar sama panjang.'),
            L('Opposite angles of a cyclic quadrilateral add up to $90^{\\circ}$.', 'Sudut berhadapan segi empat tali busur berjumlah $90^{\\circ}$.'),
            L('For $r=4$ and $\\theta=90^{\\circ}$, the arc length is $2\\pi$.', 'Untuk $r=4$ dan $\\theta=90^{\\circ}$, panjang busurnya $2\\pi$.'),
          ],
          answer: [true, true, false, true],
          explain: L(
            'The first two are tangent properties. Opposite angles add up to $180^{\\circ}$, not $90^{\\circ}$. And $\\frac{90}{360}\\times2\\pi\\times4=\\frac{1}{4}\\times8\\pi=2\\pi$.',
            'Dua yang pertama adalah sifat garis singgung. Sudut berhadapan berjumlah $180^{\\circ}$, bukan $90^{\\circ}$. Dan $\\frac{90}{360}\\times2\\pi\\times4=\\frac{1}{4}\\times8\\pi=2\\pi$.',
          ),
          hint: L(
            'For the last one, a $90^{\\circ}$ sector is one quarter of the circumference $8\\pi$.',
            'Untuk yang terakhir, juring $90^{\\circ}$ adalah seperempat keliling $8\\pi$.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'A tangent $PT$ is drawn from a point $P$ to a circle with centre $O$ and radius 5. $OP=13$. Find $PT$.',
            'Garis singgung $PT$ ditarik dari titik $P$ ke lingkaran berpusat $O$ dan berjari-jari 5. $OP=13$. Tentukan $PT$.',
          ),
          blanks: [{ label: 'PT =', answer: 12 }],
          hints: [
            L('The radius $OT$ is perpendicular to the tangent $PT$, so triangle $OTP$ has a right angle at $T$.', 'Jari-jari $OT$ tegak lurus garis singgung $PT$, jadi segitiga $OTP$ siku-siku di $T$.'),
            L('The hypotenuse is $OP=13$ and one leg is $OT=5$.', 'Sisi miringnya $OP=13$ dan satu sisi tegaknya $OT=5$.'),
            L('$PT^2=13^2-5^2$.', '$PT^2=13^2-5^2$.'),
          ],
          explain: L(
            '$PT^2=169-25=144$, so $PT=12$. (This is the 5-12-13 triangle.)',
            '$PT^2=169-25=144$, jadi $PT=12$. (Ini segitiga 5-12-13.)',
          ),
          solution: ['PT^2=OP^2-OT^2=169-25=144', 'PT=12'],
        },
      ],
    },
    lessonCongruence,
  ],
  project: {
    id: 'tka-sma-m5-s1-p',
    runtime: 'math',
    title: L('Triangles and Circles at Work', 'Segitiga dan Lingkaran dalam Pemakaian'),
    brief: L(
      'Find angles, lengths, similar-triangle heights, cyclic angles and arc lengths.',
      'Cari sudut, panjang, tinggi dengan segitiga sebangun, sudut pada segi empat tali busur, dan panjang busur.',
    ),
    requirements: [
      L('Use angle sums, Pythagoras and similarity.', 'Memakai jumlah sudut, Pythagoras, dan kesebangunan.'),
      L('Use circle theorems and the arc length formula.', 'Memakai teorema lingkaran dan rumus panjang busur.'),
    ],
    hints: [
      L('Angles in a triangle add up to $180^{\\circ}$.', 'Sudut-sudut dalam segitiga berjumlah $180^{\\circ}$.'),
      L('Similar triangles: write the equal ratios of the sides.', 'Segitiga sebangun: tulis perbandingan sisi yang sama.'),
      L('Arc length is the fraction $\\frac{\\theta}{360}$ of the circumference.', 'Panjang busur adalah bagian $\\frac{\\theta}{360}$ dari keliling.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L(
          'The angles of a triangle are $x$, $2x$ and $3x$. What is the size of the largest angle, in degrees?',
          'Sudut-sudut sebuah segitiga adalah $x$, $2x$, dan $3x$. Berapa besar sudut terbesar, dalam derajat?',
        ),
        blanks: [{ answer: 90, after: '^{\\circ}' }],
        solution: ['x+2x+3x=180 \\Rightarrow 6x=180', 'x=30 \\Rightarrow 3x=90'],
      },
      {
        prompt: L(
          'A rectangle is 12 cm long and 16 cm wide. How long is its diagonal, in centimetres?',
          'Sebuah persegi panjang panjangnya 12 cm dan lebarnya 16 cm. Berapa panjang diagonalnya, dalam sentimeter?',
        ),
        figure: {
          ...shape({
            pts: [[0, 0], [8, 0], [8, 6], [0, 6]],
            names: 'ABCD',
            rights: [0, 1, 2, 3],
            sides: ['16', '12'],
            extra: [line([0, 0], [8, 6], 'result', { width: 2.4 })],
          }),
          caption: L('A rectangle with its diagonal.', 'Sebuah persegi panjang dengan diagonalnya.'),
        },
        blanks: [{ answer: 20, after: '\\text{cm}' }],
        solution: ['d^2=12^2+16^2=144+256=400', 'd=20'],
      },
      {
        prompt: L(
          'A 6 m flagpole casts a shadow of 8 m. At the same moment a building casts a shadow of 40 m. How tall is the building, in metres?',
          'Sebuah tiang bendera 6 m bayangannya 8 m. Pada saat yang sama sebuah gedung bayangannya 40 m. Berapa tinggi gedung itu, dalam meter?',
        ),
        blanks: [{ answer: 30, after: '\\text{m}' }],
        solution: {
          en: ['\\frac{h}{40}=\\frac{6}{8}', 'h=40\\times0.75=30'],
          id: ['\\frac{h}{40}=\\frac{6}{8}', 'h=40\\times0{,}75=30'],
        },
      },
      {
        prompt: L(
          'In a cyclic quadrilateral $ABCD$, $\\angle A=110^{\\circ}$. What is the opposite angle $\\angle C$, in degrees?',
          'Pada segi empat tali busur $ABCD$, $\\angle A=110^{\\circ}$. Berapa sudut yang berhadapan $\\angle C$, dalam derajat?',
        ),
        blanks: [{ answer: 70, after: '^{\\circ}' }],
        solution: ['\\angle A+\\angle C=180^{\\circ}', '\\angle C=180-110=70'],
      },
      {
        prompt: L(
          'A sector of a circle with radius 12 cm has a central angle of $150^{\\circ}$. Its arc length is $k\\pi$ cm. Find $k$.',
          'Sebuah juring lingkaran berjari-jari 12 cm bersudut pusat $150^{\\circ}$. Panjang busurnya $k\\pi$ cm. Tentukan $k$.',
        ),
        blanks: [{ label: 'k =', answer: 10 }],
        solution: ['\\frac{150}{360}\\times2\\pi\\times12=\\frac{5}{12}\\times24\\pi', '=10\\pi'],
      },
      {
        prompt: L(
          'Two parallel lines are cut by a transversal. Two co-interior angles are $(3x+10)^{\\circ}$ and $(2x+20)^{\\circ}$. Find $x$.',
          'Dua garis sejajar dipotong oleh sebuah transversal. Dua sudut dalam sepihak adalah $(3x+10)^{\\circ}$ dan $(2x+20)^{\\circ}$. Tentukan $x$.',
        ),
        blanks: [{ label: 'x =', answer: 30 }],
        solution: ['(3x+10)+(2x+20)=180', '5x=150 \\Rightarrow x=30'],
      },
    ],
  },
}
