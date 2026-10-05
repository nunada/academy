import type { Lesson } from '../types'
import { L, box3d } from './figs'

/** Module 5 — distances between geometric objects in space: point–line,
 *  point–plane, line–line and plane–plane. */

export const lessonDistances: Lesson = {
  id: 'tka-sma-m5-s2-l3',
  title: L('Distances Between Objects in Space', 'Jarak antara Objek dalam Ruang'),
  goal: L(
    'You can find the distance from a point to a line, from a point to a plane, and between two lines or two planes.',
    'Kamu bisa mencari jarak dari titik ke garis, dari titik ke bidang, dan antara dua garis atau dua bidang.',
  ),
  xp: 20,
  steps: [
    {
      kind: 'concept',
      id: 'c1',
      title: L('Look Closely: The Shortest Way Is Perpendicular', 'Ayo Amati: Jalan Terpendek Adalah yang Tegak Lurus'),
      body: L(
        'The **distance** from a point to a line (or a plane) is the length of the **shortest** segment between them. That segment is always **perpendicular** to the line (or plane).\n\nThe box $ABCD.EFGH$ has $AB=9$, $BC=12$ and $CG=20$. Find the distance from $C$ to the line $AG$.\n\n1. Step 1: Draw the foot $P$ on $AG$ so that $CP\\perp AG$. The distance is $CP$.\n2. Step 2: Triangle $ACG$ is right-angled at $C$ ($CG$ is vertical). $AC=\\sqrt{9^2+12^2}=15$, $CG=20$ and $AG=\\sqrt{15^2+20^2}=25$.\n3. Step 3: The area of the right triangle can be written two ways: $\\frac{1}{2}\\times AC\\times CG=\\frac{1}{2}\\times AG\\times CP$.\n4. Step 4: $CP=\\frac{15\\times20}{25}=12$.\n\nThe shortcut: **distance from the right-angle corner to the hypotenuse $=\\frac{\\text{leg}\\times\\text{leg}}{\\text{hypotenuse}}$.**',
        '**Jarak** dari titik ke garis (atau bidang) adalah panjang ruas **terpendek** di antara keduanya. Ruas itu selalu **tegak lurus** pada garis (atau bidang) tersebut.\n\nBalok $ABCD.EFGH$ memiliki $AB=9$, $BC=12$, dan $CG=20$. Cari jarak dari $C$ ke garis $AG$.\n\n1. Langkah 1: Gambar kaki $P$ pada $AG$ sehingga $CP\\perp AG$. Jaraknya $CP$.\n2. Langkah 2: Segitiga $ACG$ siku-siku di $C$ ($CG$ tegak). $AC=\\sqrt{9^2+12^2}=15$, $CG=20$, dan $AG=\\sqrt{15^2+20^2}=25$.\n3. Langkah 3: Luas segitiga siku-siku dapat ditulis dua cara: $\\frac{1}{2}\\times AC\\times CG=\\frac{1}{2}\\times AG\\times CP$.\n4. Langkah 4: $CP=\\frac{15\\times20}{25}=12$.\n\nJalan pintasnya: **jarak dari titik sudut siku-siku ke sisi miring $=\\frac{\\text{sisi tegak}\\times\\text{sisi tegak}}{\\text{sisi miring}}$.**',
      ),
      figure: {
        ...box3d({
          l: 9,
          w: 12,
          h: 20,
          pts: { P: [3.24, 4.32, 7.2] },
          segs: [
            { from: 'A', to: 'G', color: 'b' },
            { from: 'C', to: 'P', color: 'result' },
          ],
        }),
        caption: L('The distance from C to the line AG is the segment CP.', 'Jarak dari C ke garis AG adalah ruas CP.'),
      },
    },
    {
      kind: 'concept',
      id: 'c2',
      title: L('Step by Step: A Point and a Plane', 'Contoh Bertahap: Titik dan Bidang'),
      body: L(
        'The distance from a point to a **plane** is the length of the perpendicular from the point to the plane.\n\nIn a cube of edge 6:\n\n- The distance from $G$ to the floor $ABCD$ is $GC=6$, because $GC$ is perpendicular to the floor.\n- The distance from $B$ to the vertical plane $ACG$: that plane stands on the diagonal $AC$ of the floor, so the shortest way from $B$ to it is the perpendicular $BO$ to $AC$ on the floor ($O$ is the centre of the floor).\n\n1. Step 1: The diagonal $BD=6\\sqrt{2}$ passes through $O$, and $O$ is its midpoint.\n2. Step 2: $BO=\\frac{1}{2}\\times6\\sqrt{2}=3\\sqrt{2}$.\n\nSo the distance from $B$ to the plane $ACG$ is $3\\sqrt{2}\\approx4.24$.\n\n**Tip:** when a plane is **vertical** (like $ACG$), the distance from a point to it is measured **on the floor**, as the distance from the point to the plane\'s line on the floor.',
        'Jarak dari titik ke **bidang** adalah panjang garis tegak lurus dari titik itu ke bidang.\n\nPada kubus berusuk 6:\n\n- Jarak dari $G$ ke alas $ABCD$ adalah $GC=6$, karena $GC$ tegak lurus alas.\n- Jarak dari $B$ ke bidang tegak $ACG$: bidang itu berdiri di atas diagonal $AC$ alas, jadi jalan terpendek dari $B$ ke bidang itu adalah garis tegak lurus $BO$ ke $AC$ pada alas ($O$ adalah pusat alas).\n\n1. Langkah 1: Diagonal $BD=6\\sqrt{2}$ melalui $O$, dan $O$ adalah titik tengahnya.\n2. Langkah 2: $BO=\\frac{1}{2}\\times6\\sqrt{2}=3\\sqrt{2}$.\n\nJadi jarak dari $B$ ke bidang $ACG$ adalah $3\\sqrt{2}\\approx4{,}24$.\n\n**Tips:** bila bidangnya **tegak** (seperti $ACG$), jarak dari titik ke bidang itu diukur **pada alas**, sebagai jarak dari titik ke garis perpotongan bidang itu dengan alas.',
      ),
      figure: {
        ...box3d({
          l: 6,
          pts: { O: [3, 3, 0] },
          segs: [
            { from: 'A', to: 'C', color: 'b' },
            { from: 'B', to: 'O', color: 'result' },
          ],
        }),
        caption: L('The segment BO is perpendicular to the diagonal AC on the floor.', 'Ruas BO tegak lurus diagonal AC pada alas.'),
      },
    },
    {
      kind: 'concept',
      id: 'c3',
      title: L('Step by Step: Two Lines and Two Planes', 'Contoh Bertahap: Dua Garis dan Dua Bidang'),
      body: L(
        '**Two parallel planes**, such as the floor $ABCD$ and the ceiling $EFGH$ of a cube of edge 6: the distance is the length of any edge perpendicular to both, $AE=6$.\n\n**Two parallel lines:** the length of a segment perpendicular to both. For example $AB$ and $EF$ are 6 apart.\n\n**Two skew lines** (not parallel, never meeting), such as $AB$ and $CG$ in the cube: the distance is the length of the **common perpendicular**, a segment that is perpendicular to **both** lines.\n\n1. Step 1: $BC$ meets $AB$ at $B$ at a right angle, and meets $CG$ at $C$ at a right angle.\n2. Step 2: So $BC$ is the common perpendicular, and the distance is $BC=6$.\n\n**Watch out:** the distance between skew lines is **not** a corner-to-corner diagonal. Look for the segment that is perpendicular to both.',
        '**Dua bidang sejajar**, seperti alas $ABCD$ dan atap $EFGH$ pada kubus berusuk 6: jaraknya adalah panjang rusuk mana pun yang tegak lurus pada keduanya, $AE=6$.\n\n**Dua garis sejajar:** panjang ruas yang tegak lurus pada keduanya. Misalnya $AB$ dan $EF$ berjarak 6.\n\n**Dua garis bersilangan** (tidak sejajar, tidak pernah bertemu), seperti $AB$ dan $CG$ pada kubus: jaraknya adalah panjang **garis tegak lurus persekutuan**, yaitu ruas yang tegak lurus pada **kedua** garis.\n\n1. Langkah 1: $BC$ bertemu $AB$ di $B$ dengan sudut siku-siku, dan bertemu $CG$ di $C$ dengan sudut siku-siku.\n2. Langkah 2: Jadi $BC$ adalah garis tegak lurus persekutuan, dan jaraknya $BC=6$.\n\n**Awas:** jarak antara garis bersilangan **bukan** diagonal dari sudut ke sudut. Carilah ruas yang tegak lurus pada keduanya.',
      ),
      figure: {
        ...box3d({
          l: 6,
          segs: [
            { from: 'A', to: 'B', color: 'a' },
            { from: 'C', to: 'G', color: 'a' },
            { from: 'B', to: 'C', color: 'result' },
          ],
        }),
        caption: L('The skew lines AB and CG, and their common perpendicular BC.', 'Garis bersilangan AB dan CG, dan garis tegak lurus persekutuannya BC.'),
      },
    },
    {
      kind: 'quiz',
      id: 'q1',
      prompt: L(
        'The cube has edge 6. $O$ is the centre of the floor $ABCD$. What is the distance from $B$ to the plane $ACG$ (the segment $BO$)?',
        'Kubus berusuk 6. $O$ adalah pusat alas $ABCD$. Berapa jarak dari $B$ ke bidang $ACG$ (ruas $BO$)?',
      ),
      figure: {
        ...box3d({
          l: 6,
          pts: { O: [3, 3, 0] },
          segs: [
            { from: 'A', to: 'C', color: 'b' },
            { from: 'B', to: 'O', color: 'result' },
          ],
        }),
        caption: L('A cube with the segment BO.', 'Kubus dengan ruas BO.'),
      },
      options: [L('$3\\sqrt{2}$', '$3\\sqrt{2}$'), L('$6$', '$6$'), L('$3$', '$3$'), L('$6\\sqrt{2}$', '$6\\sqrt{2}$')],
      answer: 0,
      explain: L(
        '$BO$ is half of the floor diagonal $BD=6\\sqrt{2}$, so $BO=3\\sqrt{2}$. The value $6\\sqrt{2}$ is the whole diagonal, and 6 is an edge.',
        '$BO$ adalah setengah diagonal alas $BD=6\\sqrt{2}$, jadi $BO=3\\sqrt{2}$. Nilai $6\\sqrt{2}$ adalah seluruh diagonal, dan 6 adalah sebuah rusuk.',
      ),
      hint: L(
        'The two floor diagonals cross at the centre, and each is cut in half there.',
        'Kedua diagonal alas berpotongan di pusat, dan masing-masing terbagi dua di sana.',
      ),
    },
    {
      kind: 'fill',
      id: 'f1',
      math: true,
      prompt: L(
        'Try it together: the distance from $C$ to $AG$ in the box with $AC=15$, $CG=20$ and $AG=25$.',
        'Coba bersama: jarak dari $C$ ke $AG$ pada balok dengan $AC=15$, $CG=20$, dan $AG=25$.',
      ),
      template: '15\\times20=___ \\quad CP=300\\div25=___',
      blanks: ['300', '12'],
      explain: L(
        '$15\\times20=300$ and $300\\div25=12$.',
        '$15\\times20=300$ dan $300\\div25=12$.',
      ),
      hint: L(
        'Multiply the two legs, then divide by the hypotenuse.',
        'Kalikan kedua sisi tegak, lalu bagi dengan sisi miring.',
      ),
    },
    {
      kind: 'multi',
      id: 'mc1',
      prompt: L('In the cube $ABCD.EFGH$ of edge 6, choose the TWO true statements.', 'Pada kubus $ABCD.EFGH$ berusuk 6, pilih DUA pernyataan yang benar.'),
      options: [
        L('The distance from $G$ to the plane $ABCD$ is 6.', 'Jarak dari $G$ ke bidang $ABCD$ adalah 6.'),
        L('The distance between the skew lines $AB$ and $CG$ is 6.', 'Jarak antara garis bersilangan $AB$ dan $CG$ adalah 6.'),
        L('The distance from $B$ to the plane $ACG$ is 6.', 'Jarak dari $B$ ke bidang $ACG$ adalah 6.'),
        L('The distance from $G$ to the line $AC$ is $6\\sqrt{2}$.', 'Jarak dari $G$ ke garis $AC$ adalah $6\\sqrt{2}$.'),
      ],
      answer: [0, 1],
      explain: L(
        '$GC\\perp$ the floor gives 6, and $BC$ is the common perpendicular of $AB$ and $CG$. The distance from $B$ to $ACG$ is $3\\sqrt{2}$, and the distance from $G$ to the line $AC$ is $GC=6$ because $GC\\perp AC$.',
        '$GC\\perp$ alas memberi 6, dan $BC$ adalah garis tegak lurus persekutuan $AB$ dan $CG$. Jarak dari $B$ ke $ACG$ adalah $3\\sqrt{2}$, dan jarak dari $G$ ke garis $AC$ adalah $GC=6$ karena $GC\\perp AC$.',
      ),
      hint: L(
        'For each statement find the segment that is perpendicular to the object.',
        'Untuk tiap pernyataan, cari ruas yang tegak lurus pada objeknya.',
      ),
    },
    {
      kind: 'judge',
      id: 'j1',
      prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
      statements: [
        L('The distance from a point to a line is the length of the perpendicular segment.', 'Jarak dari titik ke garis adalah panjang ruas yang tegak lurus.'),
        L('The distance between two parallel planes can be measured along any slanted segment joining them.', 'Jarak antara dua bidang sejajar dapat diukur sepanjang sembarang ruas miring yang menghubungkannya.'),
        L('In the box with $AB=9$, $BC=12$, $CG=20$, the distance from $C$ to the line $AG$ is 12.', 'Pada balok dengan $AB=9$, $BC=12$, $CG=20$, jarak dari $C$ ke garis $AG$ adalah 12.'),
        L('The shortest distance from a point to a plane is along a slanted segment.', 'Jarak terpendek dari titik ke bidang adalah sepanjang ruas miring.'),
      ],
      answer: [true, false, true, false],
      explain: L(
        'A slanted segment is longer than the perpendicular one, so only the perpendicular gives the distance. And $CP=\\frac{15\\times20}{25}=12$.',
        'Ruas miring lebih panjang daripada yang tegak lurus, jadi hanya yang tegak lurus memberi jarak. Dan $CP=\\frac{15\\times20}{25}=12$.',
      ),
      hint: L(
        'Which is shorter: a slanted segment or the perpendicular one?',
        'Mana yang lebih pendek: ruas miring atau yang tegak lurus?',
      ),
    },
    {
      kind: 'math',
      id: 'm1',
      prompt: L(
        'In the box $ABCD.EFGH$, $AB=15$ and $BC=20$. What is the distance from $B$ to the plane $ACG$ (the vertical plane through the floor diagonal $AC$)?',
        'Pada balok $ABCD.EFGH$, $AB=15$ dan $BC=20$. Berapa jarak dari $B$ ke bidang $ACG$ (bidang tegak melalui diagonal alas $AC$)?',
      ),
      blanks: [{ answer: 12 }],
      hints: [
        L('Work on the floor: the distance is from $B$ to the line $AC$.', 'Kerjakan pada alas: jaraknya dari $B$ ke garis $AC$.'),
        L('Triangle $ABC$ is right-angled at $B$ with $AC=\\sqrt{15^2+20^2}=25$.', 'Segitiga $ABC$ siku-siku di $B$ dengan $AC=\\sqrt{15^2+20^2}=25$.'),
        L('Distance $=\\frac{AB\\times BC}{AC}$.', 'Jarak $=\\frac{AB\\times BC}{AC}$.'),
      ],
      explain: L(
        '$\\frac{15\\times20}{25}=12$.',
        '$\\frac{15\\times20}{25}=12$.',
      ),
      solution: ['AC=\\sqrt{15^2+20^2}=25', '\\frac{15\\times20}{25}=12'],
    },
  ],
}
