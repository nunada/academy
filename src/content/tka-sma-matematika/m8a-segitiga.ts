import type { Submodule } from '../types'
import { L, rightTriangle, shape } from './figs'

/** Module 8, submodule 1 — trigonometric ratios in right triangles, and the
 *  sine rule, cosine rule and area formula for any triangle. */

export const m8s1: Submodule = {
  id: 'tka-sma-m8-s1',
  title: L('Trigonometry in Triangles', 'Trigonometri pada Segitiga'),
  summary: L(
    'Use sine, cosine and tangent in right triangles, then the sine rule, the cosine rule and the area formula in any triangle.',
    'Memakai sinus, kosinus, dan tangen pada segitiga siku-siku, lalu aturan sinus, aturan kosinus, dan rumus luas pada segitiga sembarang.',
  ),
  lessons: [
    /* ------------------------------------------------------ L1 right triangles */
    {
      id: 'tka-sma-m8-s1-l1',
      title: L('Sine, Cosine and Tangent', 'Sinus, Kosinus, dan Tangen'),
      goal: L(
        'You can find a ratio or a side in a right triangle, know the values for $30^{\\circ}$, $45^{\\circ}$ and $60^{\\circ}$, and solve elevation problems.',
        'Kamu bisa mencari perbandingan atau sisi pada segitiga siku-siku, mengetahui nilai untuk $30^{\\circ}$, $45^{\\circ}$, dan $60^{\\circ}$, dan menyelesaikan soal sudut elevasi.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Three Ratios of One Angle', 'Ayo Amati: Tiga Perbandingan dari Satu Sudut'),
          body: L(
            'In a right triangle, pick one acute angle $\\theta$. Its three sides get names from where they sit:\n\n- the **hypotenuse** $c$ is opposite the right angle (the longest side);\n- the **opposite** side $a$ is across from $\\theta$;\n- the **adjacent** side $b$ touches $\\theta$ (and is not the hypotenuse).\n\n$$\\sin\\theta=\\frac{\\text{opposite}}{\\text{hypotenuse}}\\qquad\\cos\\theta=\\frac{\\text{adjacent}}{\\text{hypotenuse}}\\qquad\\tan\\theta=\\frac{\\text{opposite}}{\\text{adjacent}}$$\n\nThe memory trick is **SOH-CAH-TOA**. In the picture, $\\theta$ is at the bottom right: $\\sin\\theta=\\frac{a}{c}$, $\\cos\\theta=\\frac{b}{c}$, $\\tan\\theta=\\frac{a}{b}$. For the 3-4-5 triangle: $\\sin\\theta=\\frac{3}{5}$, $\\cos\\theta=\\frac{4}{5}$, $\\tan\\theta=\\frac{3}{4}$.\n\nThe ratios depend only on the angle, not on the size of the triangle.',
            'Pada segitiga siku-siku, pilih satu sudut lancip $\\theta$. Ketiga sisinya diberi nama menurut letaknya:\n\n- **sisi miring** $c$ berhadapan dengan sudut siku-siku (sisi terpanjang);\n- sisi **depan** $a$ berseberangan dengan $\\theta$;\n- sisi **samping** $b$ menyentuh $\\theta$ (dan bukan sisi miring).\n\n$$\\sin\\theta=\\frac{\\text{depan}}{\\text{miring}}\\qquad\\cos\\theta=\\frac{\\text{samping}}{\\text{miring}}\\qquad\\tan\\theta=\\frac{\\text{depan}}{\\text{samping}}$$\n\nSingkatannya **SOH-CAH-TOA** (sin = depan/miring, cos = samping/miring, tan = depan/samping). Pada gambar, $\\theta$ ada di kanan bawah: $\\sin\\theta=\\frac{a}{c}$, $\\cos\\theta=\\frac{b}{c}$, $\\tan\\theta=\\frac{a}{b}$. Untuk segitiga 3-4-5: $\\sin\\theta=\\frac{3}{5}$, $\\cos\\theta=\\frac{4}{5}$, $\\tan\\theta=\\frac{3}{4}$.\n\nPerbandingan ini hanya bergantung pada sudutnya, bukan pada ukuran segitiga.',
          ),
          figure: {
            ...rightTriangle({ a: 4, b: 3, angle: 'θ', sides: { across: 'b', up: 'a', slant: 'c' } }),
            caption: L('The angle θ with its opposite side a, adjacent side b and hypotenuse c.', 'Sudut θ dengan sisi depan a, sisi samping b, dan sisi miring c.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: The Special Angles', 'Contoh Bertahap: Sudut Istimewa'),
          body: L(
            'Three angles have exact values worth remembering. They come from two half-shapes:\n\n- Half of a square (sides $1,1,\\sqrt{2}$) gives $45^{\\circ}$.\n- Half of an equilateral triangle of side 2 (sides $1,\\sqrt{3},2$) gives $30^{\\circ}$ and $60^{\\circ}$.\n\n| $\\theta$ | $30^{\\circ}$ | $45^{\\circ}$ | $60^{\\circ}$ |\n|---|---|---|---|\n| $\\sin\\theta$ | $\\frac{1}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{\\sqrt{3}}{2}$ |\n| $\\cos\\theta$ | $\\frac{\\sqrt{3}}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{1}{2}$ |\n| $\\tan\\theta$ | $\\frac{1}{\\sqrt{3}}$ | $1$ | $\\sqrt{3}$ |\n\nIn the picture the small angle $30^{\\circ}$ is opposite the side 1, so $\\sin30^{\\circ}=\\frac{1}{2}$ and $\\tan30^{\\circ}=\\frac{1}{\\sqrt{3}}$.\n\nNotice $\\sin30^{\\circ}=\\cos60^{\\circ}$: the sine of an angle equals the cosine of its **complement** ($90^{\\circ}$ minus it).',
            'Tiga sudut punya nilai eksak yang perlu diingat. Nilai-nilai itu berasal dari dua setengah bangun:\n\n- Setengah persegi (sisi $1,1,\\sqrt{2}$) memberi $45^{\\circ}$.\n- Setengah segitiga sama sisi bersisi 2 (sisi $1,\\sqrt{3},2$) memberi $30^{\\circ}$ dan $60^{\\circ}$.\n\n| $\\theta$ | $30^{\\circ}$ | $45^{\\circ}$ | $60^{\\circ}$ |\n|---|---|---|---|\n| $\\sin\\theta$ | $\\frac{1}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{\\sqrt{3}}{2}$ |\n| $\\cos\\theta$ | $\\frac{\\sqrt{3}}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{1}{2}$ |\n| $\\tan\\theta$ | $\\frac{1}{\\sqrt{3}}$ | $1$ | $\\sqrt{3}$ |\n\nPada gambar, sudut kecil $30^{\\circ}$ berhadapan dengan sisi 1, jadi $\\sin30^{\\circ}=\\frac{1}{2}$ dan $\\tan30^{\\circ}=\\frac{1}{\\sqrt{3}}$.\n\nPerhatikan $\\sin30^{\\circ}=\\cos60^{\\circ}$: sinus suatu sudut sama dengan kosinus **penyikunya** ($90^{\\circ}$ dikurangi sudut itu).',
          ),
          figure: {
            ...rightTriangle({ a: 1.732, b: 1, angle: '30°', sides: { across: '√3', up: '1', slant: '2' } }),
            caption: L('The 30°-60°-90° triangle with sides 1, √3 and 2.', 'Segitiga 30°-60°-90° dengan sisi 1, √3, dan 2.'),
          },
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Angles of Elevation', 'Contoh Bertahap: Sudut Elevasi'),
          body: L(
            'The **angle of elevation** is the angle above the horizontal when you look up at something. (The **angle of depression** is the angle below the horizontal when you look down; it equals the angle of elevation from the other end, as alternate angles.)\n\nYou stand 40 m from the foot of a tower. The angle of elevation of the top is $45^{\\circ}$. How tall is the tower?\n\n1. Step 1: Draw the right triangle: the ground distance 40 is **adjacent**, the height $h$ is **opposite**.\n2. Step 2: Opposite and adjacent go with tangent: $\\tan45^{\\circ}=\\frac{h}{40}$.\n3. Step 3: $\\tan45^{\\circ}=1$, so $h=40$ m.\n\nTo find a side, choose the ratio that has **the side you know and the side you want**. Keep a calculator in **degree** mode.',
            '**Sudut elevasi** adalah sudut di atas garis mendatar saat kamu menengadah melihat sesuatu. (**Sudut depresi** adalah sudut di bawah garis mendatar saat kamu menunduk; besarnya sama dengan sudut elevasi dari ujung yang lain, sebagai sudut dalam berseberangan.)\n\nKamu berdiri 40 m dari kaki sebuah menara. Sudut elevasi puncak menara $45^{\\circ}$. Berapa tinggi menara?\n\n1. Langkah 1: Gambar segitiga siku-sikunya: jarak mendatar 40 adalah sisi **samping**, tinggi $h$ adalah sisi **depan**.\n2. Langkah 2: Depan dan samping berpasangan dengan tangen: $\\tan45^{\\circ}=\\frac{h}{40}$.\n3. Langkah 3: $\\tan45^{\\circ}=1$, jadi $h=40$ m.\n\nUntuk mencari sisi, pilih perbandingan yang memuat **sisi yang diketahui dan sisi yang dicari**. Pastikan kalkulator dalam mode **derajat**.',
          ),
          figure: {
            ...rightTriangle({ a: 5, b: 5, angle: '45°', sides: { across: '40', up: 'h' } }),
            caption: L('The tower, the ground and the line of sight form a right triangle.', 'Menara, tanah, dan garis pandang membentuk segitiga siku-siku.'),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'In the triangle, what is $\\sin\\theta$?',
            'Pada segitiga ini, berapa $\\sin\\theta$?',
          ),
          figure: {
            ...rightTriangle({ a: 4, b: 3, angle: 'θ', sides: { across: '4', up: '3', slant: '5' } }),
            caption: L('A right triangle with sides 3, 4 and 5.', 'Segitiga siku-siku dengan sisi 3, 4, dan 5.'),
          },
          options: [L('$\\frac{3}{5}$', '$\\frac{3}{5}$'), L('$\\frac{4}{5}$', '$\\frac{4}{5}$'), L('$\\frac{3}{4}$', '$\\frac{3}{4}$'), L('$\\frac{5}{3}$', '$\\frac{5}{3}$')],
          answer: 0,
          explain: L(
            'The side opposite $\\theta$ is the vertical side 3, and the hypotenuse is 5, so $\\sin\\theta=\\frac{3}{5}$. The value $\\frac{4}{5}$ is $\\cos\\theta$ and $\\frac{3}{4}$ is $\\tan\\theta$.',
            'Sisi di hadapan $\\theta$ adalah sisi tegak 3, dan sisi miringnya 5, jadi $\\sin\\theta=\\frac{3}{5}$. Nilai $\\frac{4}{5}$ adalah $\\cos\\theta$ dan $\\frac{3}{4}$ adalah $\\tan\\theta$.',
          ),
          hint: L(
            'Find the side across from the angle $\\theta$, then divide by the longest side.',
            'Cari sisi yang berseberangan dengan sudut $\\theta$, lalu bagi dengan sisi terpanjang.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: complete the two exact values.',
            'Coba bersama: lengkapi dua nilai eksak ini.',
          ),
          template: '\\sin30^{\\circ}=\\frac{1}{___} \\quad \\tan45^{\\circ}=___',
          blanks: ['2', '1'],
          explain: L(
            '$\\sin30^{\\circ}=\\frac{1}{2}$ (opposite 1, hypotenuse 2), and in the half-square the two legs are equal, so $\\tan45^{\\circ}=1$.',
            '$\\sin30^{\\circ}=\\frac{1}{2}$ (depan 1, miring 2), dan pada setengah persegi kedua sisi tegaknya sama, jadi $\\tan45^{\\circ}=1$.',
          ),
          hint: L(
            'Use the half equilateral triangle for $30^{\\circ}$ and the half square for $45^{\\circ}$.',
            'Pakai setengah segitiga sama sisi untuk $30^{\\circ}$ dan setengah persegi untuk $45^{\\circ}$.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true equalities.', 'Pilih DUA kesamaan yang benar.'),
          options: [
            L('$\\sin30^{\\circ}=\\cos60^{\\circ}$', '$\\sin30^{\\circ}=\\cos60^{\\circ}$'),
            L('$\\tan45^{\\circ}=1$', '$\\tan45^{\\circ}=1$'),
            L('$\\cos30^{\\circ}=\\frac{1}{2}$', '$\\cos30^{\\circ}=\\frac{1}{2}$'),
            L('$\\sin60^{\\circ}=\\frac{1}{2}$', '$\\sin60^{\\circ}=\\frac{1}{2}$'),
          ],
          answer: [0, 1],
          explain: L(
            '$\\cos30^{\\circ}=\\frac{\\sqrt{3}}{2}$ and $\\sin60^{\\circ}=\\frac{\\sqrt{3}}{2}$. The value $\\frac{1}{2}$ belongs to $\\sin30^{\\circ}$ and $\\cos60^{\\circ}$.',
            '$\\cos30^{\\circ}=\\frac{\\sqrt{3}}{2}$ dan $\\sin60^{\\circ}=\\frac{\\sqrt{3}}{2}$. Nilai $\\frac{1}{2}$ milik $\\sin30^{\\circ}$ dan $\\cos60^{\\circ}$.',
          ),
          hint: L(
            'Remember the table: the small angle has the small sine.',
            'Ingat tabelnya: sudut kecil punya sinus kecil.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('In a right triangle, $\\sin\\theta=\\frac{\\text{opposite}}{\\text{hypotenuse}}$.', 'Pada segitiga siku-siku, $\\sin\\theta=\\frac{\\text{depan}}{\\text{miring}}$.'),
            L('$\\sin45^{\\circ}=\\cos45^{\\circ}$.', '$\\sin45^{\\circ}=\\cos45^{\\circ}$.'),
            L('$\\tan60^{\\circ}=\\frac{1}{\\sqrt{3}}$.', '$\\tan60^{\\circ}=\\frac{1}{\\sqrt{3}}$.'),
            L('The sine of an acute angle can be equal to 1.5.', 'Sinus sudut lancip dapat bernilai 1,5.'),
          ],
          answer: [true, true, false, false],
          explain: L(
            'In the half-square the legs are equal. $\\tan60^{\\circ}=\\sqrt{3}$; $\\frac{1}{\\sqrt{3}}$ is $\\tan30^{\\circ}$. And a leg is shorter than the hypotenuse, so the sine of an acute angle is less than 1.',
            'Pada setengah persegi kedua sisi tegaknya sama. $\\tan60^{\\circ}=\\sqrt{3}$; $\\frac{1}{\\sqrt{3}}$ adalah $\\tan30^{\\circ}$. Dan sisi tegak lebih pendek dari sisi miring, jadi sinus sudut lancip kurang dari 1.',
          ),
          hint: L(
            'For the last one, which side is longer: a leg or the hypotenuse?',
            'Untuk yang terakhir, mana yang lebih panjang: sisi tegak atau sisi miring?',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'A ladder 10 m long leans against a wall and makes an angle of $30^{\\circ}$ with the ground. How high up the wall does it reach, in metres?',
            'Sebuah tangga sepanjang 10 m bersandar pada dinding dan membuat sudut $30^{\\circ}$ dengan tanah. Seberapa tinggi tangga mencapai dinding, dalam meter?',
          ),
          blanks: [{ answer: 5, after: '\\text{m}' }],
          hints: [
            L('The ladder is the hypotenuse, and the height is the side opposite the $30^{\\circ}$ angle.', 'Tangga adalah sisi miring, dan tinggi adalah sisi di hadapan sudut $30^{\\circ}$.'),
            L('Opposite and hypotenuse go with sine: $\\sin30^{\\circ}=\\frac{h}{10}$.', 'Depan dan miring berpasangan dengan sinus: $\\sin30^{\\circ}=\\frac{h}{10}$.'),
            L('$\\sin30^{\\circ}=\\frac{1}{2}$.', '$\\sin30^{\\circ}=\\frac{1}{2}$.'),
          ],
          explain: L(
            '$h=10\\sin30^{\\circ}=10\\times\\frac{1}{2}=5$ m.',
            '$h=10\\sin30^{\\circ}=10\\times\\frac{1}{2}=5$ m.',
          ),
          solution: ['\\sin30^{\\circ}=\\frac{h}{10}', 'h=10\\times\\frac{1}{2}=5'],
        },
      ],
    },
    /* --------------------------------------------------- L2 sine and cosine rules */
    {
      id: 'tka-sma-m8-s1-l2',
      title: L('The Sine Rule, Cosine Rule and Area', 'Aturan Sinus, Aturan Kosinus, dan Luas'),
      goal: L(
        'You can choose and use the sine rule or the cosine rule in any triangle, and find its area from two sides and the angle between them.',
        'Kamu bisa memilih dan memakai aturan sinus atau aturan kosinus pada segitiga sembarang, dan mencari luasnya dari dua sisi dan sudut di antaranya.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Sides and Opposite Angles', 'Ayo Amati: Sisi dan Sudut yang Berhadapan'),
          body: L(
            'In a triangle $ABC$, name each side by the small letter of the angle **opposite** it: $a$ is opposite $A$, $b$ is opposite $B$, $c$ is opposite $C$.\n\nThe **sine rule** says that every side divided by the sine of its opposite angle gives the same number:\n\n$$\\frac{a}{\\sin A}=\\frac{b}{\\sin B}=\\frac{c}{\\sin C}=2R$$\n\nwhere $R$ is the radius of the circle through the three corners.\n\nExample: $a=10$ and $A=30^{\\circ}$. Then $2R=\\frac{10}{\\sin30^{\\circ}}=\\frac{10}{\\frac{1}{2}}=20$, so $R=10$.\n\nUse the sine rule when you know **an angle and its opposite side** (plus one more angle or side).',
            'Pada segitiga $ABC$, beri nama tiap sisi dengan huruf kecil dari sudut yang **berhadapan** dengannya: $a$ berhadapan dengan $A$, $b$ dengan $B$, $c$ dengan $C$.\n\n**Aturan sinus** menyatakan bahwa setiap sisi dibagi sinus sudut di hadapannya memberi bilangan yang sama:\n\n$$\\frac{a}{\\sin A}=\\frac{b}{\\sin B}=\\frac{c}{\\sin C}=2R$$\n\ndengan $R$ jari-jari lingkaran yang melalui ketiga titik sudut.\n\nContoh: $a=10$ dan $A=30^{\\circ}$. Maka $2R=\\frac{10}{\\sin30^{\\circ}}=\\frac{10}{\\frac{1}{2}}=20$, jadi $R=10$.\n\nPakai aturan sinus bila kamu tahu **sebuah sudut dan sisi di hadapannya** (ditambah satu sudut atau sisi lain).',
          ),
          figure: {
            ...shape({
              pts: [[0, 0], [6, 0], [2, 3.2]],
              names: 'ABC',
              sides: ['c', 'a', 'b'],
            }),
            caption: L('Side a is opposite angle A, side b opposite B and side c opposite C.', 'Sisi a berhadapan dengan sudut A, sisi b dengan B, dan sisi c dengan C.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: The Cosine Rule', 'Contoh Bertahap: Aturan Kosinus'),
          body: L(
            'The **cosine rule** is Pythagoras with a correction for the angle:\n\n$$c^2=a^2+b^2-2ab\\cos C$$\n\nHere $C$ is the angle **between** sides $a$ and $b$, and $c$ is opposite it. If $C=90^{\\circ}$, then $\\cos C=0$ and we get Pythagoras back.\n\nIn the picture $a=5$, $b=8$ and $C=60^{\\circ}$. Find $c$.\n\n1. Step 1: $c^2=5^2+8^2-2\\times5\\times8\\times\\cos60^{\\circ}$.\n2. Step 2: $=25+64-80\\times\\frac{1}{2}=89-40=49$.\n3. Step 3: $c=7$.\n\nUse the cosine rule when you know **two sides and the angle between them**, or **all three sides** (to find an angle: $\\cos C=\\frac{a^2+b^2-c^2}{2ab}$).',
            '**Aturan kosinus** adalah Pythagoras dengan koreksi untuk sudutnya:\n\n$$c^2=a^2+b^2-2ab\\cos C$$\n\nDi sini $C$ adalah sudut **di antara** sisi $a$ dan $b$, dan $c$ berhadapan dengannya. Jika $C=90^{\\circ}$, maka $\\cos C=0$ dan kita kembali ke Pythagoras.\n\nPada gambar, $a=5$, $b=8$, dan $C=60^{\\circ}$. Cari $c$.\n\n1. Langkah 1: $c^2=5^2+8^2-2\\times5\\times8\\times\\cos60^{\\circ}$.\n2. Langkah 2: $=25+64-80\\times\\frac{1}{2}=89-40=49$.\n3. Langkah 3: $c=7$.\n\nPakai aturan kosinus bila kamu tahu **dua sisi dan sudut di antaranya**, atau **ketiga sisi** (untuk mencari sudut: $\\cos C=\\frac{a^2+b^2-c^2}{2ab}$).',
          ),
          figure: {
            ...shape({
              pts: [[0, 0], [8, 0], [2.5, 4.33]],
              names: 'CAB',
              sides: ['8', '?', '5'],
              extra: [{ t: 'angle', at: [0, 0], from: [8, 0], to: [2.5, 4.33], label: '60°' }],
            }),
            caption: L('A triangle with sides 5 and 8 and the angle 60° between them.', 'Segitiga dengan sisi 5 dan 8 dan sudut 60° di antaranya.'),
          },
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Area and Choosing the Rule', 'Contoh Bertahap: Luas dan Memilih Aturan'),
          body: L(
            'The area of **any** triangle from two sides and the angle between them:\n\n$$\\text{area}=\\frac{1}{2}ab\\sin C$$\n\nIn the picture, $a=6$, $b=8$ and $C=30^{\\circ}$. The area is $\\frac{1}{2}\\times6\\times8\\times\\sin30^{\\circ}=\\frac{1}{2}\\times48\\times\\frac{1}{2}=12$.\n\nWhich rule?\n\n| You know | Use |\n|---|---|\n| two angles and a side | sine rule |\n| a side and its opposite angle | sine rule |\n| two sides and the **included** angle | cosine rule |\n| three sides | cosine rule |\n\n**Watch out:** the largest angle is opposite the **longest** side and the smallest angle is opposite the shortest. If your answer breaks that, check for a slip.',
            'Luas **setiap** segitiga dari dua sisi dan sudut di antaranya:\n\n$$\\text{luas}=\\frac{1}{2}ab\\sin C$$\n\nPada gambar, $a=6$, $b=8$, dan $C=30^{\\circ}$. Luasnya $\\frac{1}{2}\\times6\\times8\\times\\sin30^{\\circ}=\\frac{1}{2}\\times48\\times\\frac{1}{2}=12$.\n\nAturan mana?\n\n| Yang diketahui | Pakai |\n|---|---|\n| dua sudut dan sebuah sisi | aturan sinus |\n| sebuah sisi dan sudut di hadapannya | aturan sinus |\n| dua sisi dan sudut **apit** | aturan kosinus |\n| tiga sisi | aturan kosinus |\n\n**Awas:** sudut terbesar berhadapan dengan sisi **terpanjang** dan sudut terkecil berhadapan dengan sisi terpendek. Jika jawabanmu melanggar itu, periksa kembali.',
          ),
          figure: {
            ...shape({
              pts: [[0, 0], [8, 0], [5.196, 3]],
              names: 'CAB',
              sides: ['8', undefined, '6'],
              extra: [{ t: 'angle', at: [0, 0], from: [8, 0], to: [5.196, 3], label: '30°' }],
            }),
            caption: L('Sides 6 and 8 with the angle 30° between them.', 'Sisi 6 dan 8 dengan sudut 30° di antaranya.'),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'In the triangle, two sides are 3 and 5 and the angle between them is $120^{\\circ}$ ($\\cos120^{\\circ}=-\\frac{1}{2}$). What is the third side?',
            'Pada segitiga, dua sisi adalah 3 dan 5 dan sudut di antaranya $120^{\\circ}$ ($\\cos120^{\\circ}=-\\frac{1}{2}$). Berapa sisi ketiga?',
          ),
          figure: {
            ...shape({
              pts: [[0, 0], [5, 0], [-1.5, 2.598]],
              names: 'CAB',
              sides: ['5', '?', '3'],
              extra: [{ t: 'angle', at: [0, 0], from: [5, 0], to: [-1.5, 2.598], label: '120°' }],
            }),
            caption: L('A triangle with sides 3 and 5 and the angle 120° between them.', 'Segitiga dengan sisi 3 dan 5 dan sudut 120° di antaranya.'),
          },
          options: [L('7', '7'), L('$\\sqrt{34}$', '$\\sqrt{34}$'), L('8', '8'), L('4', '4')],
          answer: 0,
          explain: L(
            '$c^2=9+25-2\\times3\\times5\\times\\left(-\\frac{1}{2}\\right)=34+15=49$, so $c=7$. The value $\\sqrt{34}$ forgets that $\\cos120^{\\circ}$ is negative, so the correction **adds** 15.',
            '$c^2=9+25-2\\times3\\times5\\times\\left(-\\frac{1}{2}\\right)=34+15=49$, jadi $c=7$. Nilai $\\sqrt{34}$ melupakan bahwa $\\cos120^{\\circ}$ negatif, sehingga koreksinya **menambah** 15.',
          ),
          hint: L(
            'Use $c^2=a^2+b^2-2ab\\cos C$. Take care with the sign: minus times minus.',
            'Pakai $c^2=a^2+b^2-2ab\\cos C$. Hati-hati dengan tandanya: minus kali minus.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: find $c^2$ for $a=5$, $b=8$ and $C=60^{\\circ}$.',
            'Coba bersama: cari $c^2$ untuk $a=5$, $b=8$, dan $C=60^{\\circ}$.',
          ),
          template: 'c^2=25+64-80\\times\\frac{1}{2}=89-___=___',
          blanks: ['40', '49'],
          explain: L(
            '$80\\times\\frac{1}{2}=40$ and $89-40=49$, so $c=7$.',
            '$80\\times\\frac{1}{2}=40$ dan $89-40=49$, jadi $c=7$.',
          ),
          hint: L(
            'Multiply $80$ by $\\cos60^{\\circ}=\\frac{1}{2}$ first, then subtract.',
            'Kalikan $80$ dengan $\\cos60^{\\circ}=\\frac{1}{2}$ dulu, lalu kurangkan.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L('The cosine rule finds the third side when two sides and the angle between them are known.', 'Aturan kosinus mencari sisi ketiga bila dua sisi dan sudut di antaranya diketahui.'),
            L('The sine rule says $\\frac{a}{\\sin A}=\\frac{b}{\\sin B}$.', 'Aturan sinus menyatakan $\\frac{a}{\\sin A}=\\frac{b}{\\sin B}$.'),
            L('The area of a triangle is $ab\\sin C$.', 'Luas segitiga adalah $ab\\sin C$.'),
            L('The cosine rule is $c^2=a^2+b^2+2ab\\cos C$.', 'Aturan kosinus adalah $c^2=a^2+b^2+2ab\\cos C$.'),
          ],
          answer: [0, 1],
          explain: L(
            'The area has a factor $\\frac{1}{2}$, and the cosine rule has a **minus** sign: $c^2=a^2+b^2-2ab\\cos C$.',
            'Luas memuat faktor $\\frac{1}{2}$, dan aturan kosinus bertanda **minus**: $c^2=a^2+b^2-2ab\\cos C$.',
          ),
          hint: L(
            'If $C=90^{\\circ}$, the cosine rule must turn into Pythagoras. Which sign does that need?',
            'Jika $C=90^{\\circ}$, aturan kosinus harus berubah menjadi Pythagoras. Tanda mana yang diperlukan?',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('The area of a triangle is $\\frac{1}{2}ab\\sin C$.', 'Luas segitiga adalah $\\frac{1}{2}ab\\sin C$.'),
            L('If $C=90^{\\circ}$, the cosine rule becomes the Pythagorean theorem.', 'Jika $C=90^{\\circ}$, aturan kosinus menjadi teorema Pythagoras.'),
            L('The sine rule is the right tool when two sides and the angle between them are known.', 'Aturan sinus adalah alat yang tepat bila dua sisi dan sudut di antaranya diketahui.'),
            L('The smallest angle of a triangle is opposite its longest side.', 'Sudut terkecil segitiga berhadapan dengan sisi terpanjangnya.'),
          ],
          answer: [true, true, false, false],
          explain: L(
            'For two sides and the included angle you need the cosine rule. And the **largest** angle is opposite the longest side.',
            'Untuk dua sisi dan sudut apit diperlukan aturan kosinus. Dan sudut **terbesar** berhadapan dengan sisi terpanjang.',
          ),
          hint: L(
            'Check the table of which rule goes with which information.',
            'Periksa tabel aturan mana yang cocok dengan informasi apa.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'A triangle has two sides 6 and 8 with an angle of $30^{\\circ}$ between them. What is its area?',
            'Sebuah segitiga punya dua sisi 6 dan 8 dengan sudut $30^{\\circ}$ di antaranya. Berapa luasnya?',
          ),
          blanks: [{ answer: 12 }],
          hints: [
            L('Use the formula with two sides and the included angle.', 'Pakai rumus dengan dua sisi dan sudut apit.'),
            L('$\\text{area}=\\frac{1}{2}\\times6\\times8\\times\\sin30^{\\circ}$.', '$\\text{luas}=\\frac{1}{2}\\times6\\times8\\times\\sin30^{\\circ}$.'),
            L('$\\sin30^{\\circ}=\\frac{1}{2}$, and $\\frac{1}{2}\\times48=24$.', '$\\sin30^{\\circ}=\\frac{1}{2}$, dan $\\frac{1}{2}\\times48=24$.'),
          ],
          explain: L(
            '$\\frac{1}{2}\\times6\\times8\\times\\frac{1}{2}=24\\times\\frac{1}{2}=12$.',
            '$\\frac{1}{2}\\times6\\times8\\times\\frac{1}{2}=24\\times\\frac{1}{2}=12$.',
          ),
          solution: ['\\frac{1}{2}\\times6\\times8\\times\\sin30^{\\circ}', '=24\\times\\frac{1}{2}=12'],
        },
      ],
    },
  ],
  project: {
    id: 'tka-sma-m8-s1-p',
    runtime: 'math',
    title: L('Trigonometry in Triangles at Work', 'Trigonometri pada Segitiga dalam Pemakaian'),
    brief: L(
      'Find heights, sides, areas and a circumradius with trigonometry.',
      'Cari tinggi, sisi, luas, dan jari-jari lingkaran luar dengan trigonometri.',
    ),
    requirements: [
      L('Use sine, cosine and tangent of special angles in a right triangle.', 'Memakai sinus, kosinus, dan tangen sudut istimewa pada segitiga siku-siku.'),
      L('Choose between the sine rule and the cosine rule.', 'Memilih antara aturan sinus dan aturan kosinus.'),
    ],
    hints: [
      L('SOH-CAH-TOA: choose the ratio with the side you know and the side you want.', 'SOH-CAH-TOA: pilih perbandingan yang memuat sisi yang diketahui dan yang dicari.'),
      L('Two sides and the angle between them: cosine rule and the area formula.', 'Dua sisi dan sudut apit: aturan kosinus dan rumus luas.'),
      L('An angle and its opposite side: sine rule, $2R=\\frac{a}{\\sin A}$.', 'Sebuah sudut dan sisi di hadapannya: aturan sinus, $2R=\\frac{a}{\\sin A}$.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L(
          'A kite string is 50 m long and makes an angle of $30^{\\circ}$ with the level ground. How high is the kite, in metres? (Assume the string is straight.)',
          'Tali layang-layang sepanjang 50 m membentuk sudut $30^{\\circ}$ dengan tanah datar. Seberapa tinggi layang-layang itu, dalam meter? (Anggap tali lurus.)',
        ),
        blanks: [{ answer: 25, after: '\\text{m}' }],
        solution: ['h=50\\sin30^{\\circ}', '=50\\times\\frac{1}{2}=25'],
      },
      {
        prompt: L(
          'From a point 40 m from the foot of a tower, the angle of elevation of the top is $45^{\\circ}$. How tall is the tower, in metres?',
          'Dari titik yang berjarak 40 m dari kaki menara, sudut elevasi puncak menara $45^{\\circ}$. Berapa tinggi menara, dalam meter?',
        ),
        figure: {
          ...rightTriangle({ a: 5, b: 5, angle: '45°', sides: { across: '40', up: 'h' } }),
          caption: L('The tower and the line of sight.', 'Menara dan garis pandang.'),
        },
        blanks: [{ answer: 40, after: '\\text{m}' }],
        solution: ['\\tan45^{\\circ}=\\frac{h}{40}', 'h=40\\times1=40'],
      },
      {
        prompt: L(
          'Triangle $ABC$ has $a=5$, $b=8$ and $C=60^{\\circ}$. Find $c$.',
          'Segitiga $ABC$ memiliki $a=5$, $b=8$, dan $C=60^{\\circ}$. Tentukan $c$.',
        ),
        blanks: [{ label: 'c =', answer: 7 }],
        solution: ['c^2=25+64-2\\cdot5\\cdot8\\cdot\\frac{1}{2}=49', 'c=7'],
      },
      {
        prompt: L(
          'Two sides of a triangle are 10 and 12 and the angle between them is $30^{\\circ}$. Find its area.',
          'Dua sisi sebuah segitiga adalah 10 dan 12 dan sudut di antaranya $30^{\\circ}$. Tentukan luasnya.',
        ),
        blanks: [{ answer: 30 }],
        solution: ['\\frac{1}{2}\\times10\\times12\\times\\sin30^{\\circ}', '=60\\times\\frac{1}{2}=30'],
      },
      {
        prompt: L(
          'In triangle $ABC$, $a=10$ and $A=30^{\\circ}$. Find the radius $R$ of the circle through $A$, $B$ and $C$.',
          'Pada segitiga $ABC$, $a=10$ dan $A=30^{\\circ}$. Tentukan jari-jari $R$ lingkaran yang melalui $A$, $B$, dan $C$.',
        ),
        blanks: [{ label: 'R =', answer: 10 }],
        solution: ['2R=\\frac{a}{\\sin A}=\\frac{10}{1/2}=20', 'R=10'],
      },
    ],
  },
}
