import type { Submodule } from '../types'
import { L, box3d } from './figs'
import { lessonDistances } from './m5d-jarak'

/** Module 5, submodule 2 — the cube and the box: diagonals, distances, and
 *  angles between lines and planes. Corners are named ABCD (bottom) and
 *  EFGH (top), with E above A, F above B, G above C and H above D. */

export const m5s2: Submodule = {
  id: 'tka-sma-m5-s2',
  title: L('Cubes, Boxes and Angles in Space', 'Kubus, Balok, dan Sudut dalam Ruang'),
  summary: L(
    'Find diagonals and distances in a cube or box with Pythagoras, and find angles between lines and planes.',
    'Mencari diagonal dan jarak pada kubus atau balok dengan Pythagoras, serta mencari sudut antara garis dan bidang.',
  ),
  lessons: [
    /* ---------------------------------------------------- L1 distances in a box */
    {
      id: 'tka-sma-m5-s2-l1',
      title: L('Diagonals and Distances in a Box', 'Diagonal dan Jarak pada Balok'),
      goal: L(
        'You can find a face diagonal, a space diagonal and other distances inside a cube or box using Pythagoras twice.',
        'Kamu bisa mencari diagonal bidang, diagonal ruang, dan jarak lain di dalam kubus atau balok dengan memakai Pythagoras dua kali.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Two Kinds of Diagonal', 'Ayo Amati: Dua Jenis Diagonal'),
          body: L(
            'The cube $ABCD.EFGH$ has the floor $ABCD$ and the ceiling $EFGH$, with $E$ above $A$, $F$ above $B$, and so on. Its edge is $a$. The dashed edges are hidden behind the cube.\n\n- A **face diagonal** joins opposite corners of one face, like $AC$ on the floor. It is the hypotenuse of a right triangle with two edges as legs: $AC=\\sqrt{a^2+a^2}=a\\sqrt{2}$.\n- A **space diagonal** goes through the inside, like $AG$. The triangle $ACG$ is right-angled at $C$, because $CG$ is vertical and $AC$ is on the floor. So $AG=\\sqrt{AC^2+CG^2}=\\sqrt{2a^2+a^2}=a\\sqrt{3}$.\n\nA cube has 12 edges, 12 face diagonals (2 on each of 6 faces) and 4 space diagonals.',
            'Kubus $ABCD.EFGH$ punya alas $ABCD$ dan atap $EFGH$, dengan $E$ di atas $A$, $F$ di atas $B$, dan seterusnya. Rusuknya $a$. Rusuk putus-putus tersembunyi di balik kubus.\n\n- **Diagonal bidang** menghubungkan titik sudut berhadapan pada satu sisi, seperti $AC$ pada alas. Diagonal ini adalah sisi miring segitiga siku-siku dengan dua rusuk sebagai sisi tegaknya: $AC=\\sqrt{a^2+a^2}=a\\sqrt{2}$.\n- **Diagonal ruang** melalui bagian dalam, seperti $AG$. Segitiga $ACG$ siku-siku di $C$, karena $CG$ tegak dan $AC$ ada di alas. Jadi $AG=\\sqrt{AC^2+CG^2}=\\sqrt{2a^2+a^2}=a\\sqrt{3}$.\n\nKubus punya 12 rusuk, 12 diagonal bidang (2 pada tiap dari 6 sisi), dan 4 diagonal ruang.',
          ),
          figure: {
            ...box3d({
              l: 6,
              segs: [
                { from: 'A', to: 'C', color: 'b' },
                { from: 'A', to: 'G', color: 'result' },
              ],
            }),
            caption: L('The face diagonal AC (orange) and the space diagonal AG (red).', 'Diagonal bidang AC (oranye) dan diagonal ruang AG (merah).'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: A Distance to a Midpoint', 'Contoh Bertahap: Jarak ke Titik Tengah'),
          body: L(
            'The cube has edge 6 cm and $M$ is the midpoint of the edge $CG$. Find the length $AM$.\n\n1. Step 1: Find the right triangle. $AC$ lies on the floor and $CM$ is vertical, so $\\angle ACM=90^{\\circ}$.\n2. Step 2: $AC=6\\sqrt{2}$, so $AC^2=72$. And $CM=\\frac{6}{2}=3$, so $CM^2=9$.\n3. Step 3: $AM^2=72+9=81$, so $AM=9$ cm.\n\nThe method: **find a right triangle with a floor line and a vertical line**, and use Pythagoras. In a space problem, a drawing of the right triangle on its own often makes it easier to see.',
            'Kubus berusuk 6 cm dan $M$ titik tengah rusuk $CG$. Cari panjang $AM$.\n\n1. Langkah 1: Cari segitiga siku-siku. $AC$ ada di alas dan $CM$ tegak, jadi $\\angle ACM=90^{\\circ}$.\n2. Langkah 2: $AC=6\\sqrt{2}$, jadi $AC^2=72$. Dan $CM=\\frac{6}{2}=3$, jadi $CM^2=9$.\n3. Langkah 3: $AM^2=72+9=81$, jadi $AM=9$ cm.\n\nMetodenya: **cari segitiga siku-siku dengan satu garis di alas dan satu garis tegak**, lalu pakai Pythagoras. Pada soal ruang, gambar segitiga siku-siku itu sendiri sering memudahkan.',
          ),
          figure: {
            ...box3d({
              l: 6,
              pts: { M: [6, 6, 3] },
              segs: [
                { from: 'A', to: 'C', color: 'b' },
                { from: 'C', to: 'M', color: 'b' },
                { from: 'A', to: 'M', color: 'result' },
              ],
            }),
            caption: L('The triangle ACM has a right angle at C.', 'Segitiga ACM siku-siku di C.'),
          },
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: The Box', 'Contoh Bertahap: Balok'),
          body: L(
            'For a **box** with length $l$, width $w$ and height $h$, the space diagonal is\n\n$$d=\\sqrt{l^2+w^2+h^2}$$\n\nThe box in the picture has $AB=4$, $BC=3$ and $BF=12$.\n\n1. Step 1: The floor diagonal $AC=\\sqrt{4^2+3^2}=5$.\n2. Step 2: $AG=\\sqrt{AC^2+CG^2}=\\sqrt{25+144}=13$.\n3. Step 3: Directly: $\\sqrt{16+9+144}=\\sqrt{169}=13$.\n\n**Watch out:** do not add the lengths of the edges; add their **squares** under one root. For a cube $l=w=h=a$ this gives $a\\sqrt{3}$.',
            'Untuk **balok** dengan panjang $l$, lebar $w$, dan tinggi $h$, diagonal ruangnya\n\n$$d=\\sqrt{l^2+w^2+h^2}$$\n\nBalok pada gambar punya $AB=4$, $BC=3$, dan $BF=12$.\n\n1. Langkah 1: Diagonal alas $AC=\\sqrt{4^2+3^2}=5$.\n2. Langkah 2: $AG=\\sqrt{AC^2+CG^2}=\\sqrt{25+144}=13$.\n3. Langkah 3: Langsung: $\\sqrt{16+9+144}=\\sqrt{169}=13$.\n\n**Awas:** jangan menjumlahkan panjang rusuk; jumlahkan **kuadrat**-nya di bawah satu akar. Untuk kubus $l=w=h=a$ ini memberi $a\\sqrt{3}$.',
          ),
          figure: {
            ...box3d({
              l: 4,
              w: 3,
              h: 12,
              segs: [{ from: 'A', to: 'G', color: 'result' }],
              edgeLabels: [
                { from: 'A', to: 'B', text: '4' },
                { from: 'B', to: 'C', text: '3' },
                { from: 'B', to: 'F', text: '12' },
              ],
            }),
            caption: L('A box 4 × 3 × 12 and its space diagonal AG.', 'Balok 4 × 3 × 12 dan diagonal ruangnya AG.'),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The cube has edge 6 cm. What is the length of the space diagonal $AG$?',
            'Kubus berusuk 6 cm. Berapa panjang diagonal ruang $AG$?',
          ),
          figure: {
            ...box3d({ l: 6, segs: [{ from: 'A', to: 'G', color: 'result' }] }),
            caption: L('A cube with its space diagonal AG.', 'Sebuah kubus dengan diagonal ruang AG.'),
          },
          options: [L('$6\\sqrt{3}$ cm', '$6\\sqrt{3}$ cm'), L('$6\\sqrt{2}$ cm', '$6\\sqrt{2}$ cm'), L('18 cm', '18 cm'), L('12 cm', '12 cm')],
          answer: 0,
          explain: L(
            '$AG=a\\sqrt{3}=6\\sqrt{3}$ cm. The value $6\\sqrt{2}$ is only a face diagonal, and 18 comes from adding three edges, which is not how lengths combine.',
            '$AG=a\\sqrt{3}=6\\sqrt{3}$ cm. Nilai $6\\sqrt{2}$ hanya diagonal bidang, dan 18 berasal dari menjumlahkan tiga rusuk, padahal bukan begitu panjang digabungkan.',
          ),
          hint: L(
            'Use Pythagoras twice: first the floor diagonal $AC$, then the triangle $ACG$.',
            'Pakai Pythagoras dua kali: pertama diagonal alas $AC$, lalu segitiga $ACG$.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: the cube has edge 6. Find $AC^2$ and then $AG^2$.',
            'Coba bersama: kubus berusuk 6. Cari $AC^2$ lalu $AG^2$.',
          ),
          template: 'AC^2=6^2+6^2=___ \\quad AG^2=AC^2+6^2=___',
          blanks: ['72', '108'],
          explain: L(
            '$36+36=72$ and $72+36=108=36\\times3$, so $AG=\\sqrt{108}=6\\sqrt{3}$.',
            '$36+36=72$ dan $72+36=108=36\\times3$, jadi $AG=\\sqrt{108}=6\\sqrt{3}$.',
          ),
          hint: L(
            'Triangle $ACG$ has legs $AC$ and $CG=6$. Use the square of $AC$ you just found.',
            'Segitiga $ACG$ punya sisi tegak $AC$ dan $CG=6$. Pakai kuadrat $AC$ yang baru kamu cari.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('A cube has edge $a$. Choose the TWO true statements.', 'Sebuah kubus berusuk $a$. Pilih DUA pernyataan yang benar.'),
          options: [
            L('A face diagonal has length $a\\sqrt{2}$.', 'Diagonal bidang panjangnya $a\\sqrt{2}$.'),
            L('A space diagonal has length $a\\sqrt{3}$.', 'Diagonal ruang panjangnya $a\\sqrt{3}$.'),
            L('A space diagonal has length $2a$.', 'Diagonal ruang panjangnya $2a$.'),
            L('A face diagonal has length $a\\sqrt{3}$.', 'Diagonal bidang panjangnya $a\\sqrt{3}$.'),
          ],
          answer: [0, 1],
          explain: L(
            'Face diagonal: $\\sqrt{a^2+a^2}=a\\sqrt{2}$. Space diagonal: $\\sqrt{a^2+a^2+a^2}=a\\sqrt{3}$. The other two statements mix up the numbers.',
            'Diagonal bidang: $\\sqrt{a^2+a^2}=a\\sqrt{2}$. Diagonal ruang: $\\sqrt{a^2+a^2+a^2}=a\\sqrt{3}$. Dua pernyataan lain mencampuradukkan bilangannya.',
          ),
          hint: L(
            'Count how many equal squares go under the root for a face and for the whole cube.',
            'Hitung berapa kuadrat yang sama berada di bawah akar untuk satu sisi dan untuk seluruh kubus.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('A cube has 12 edges.', 'Kubus punya 12 rusuk.'),
            L('A cube has 4 space diagonals.', 'Kubus punya 4 diagonal ruang.'),
            L('The space diagonal of a cube with edge 1 is 2.', 'Diagonal ruang kubus berusuk 1 adalah 2.'),
            L('In the cube $ABCD.EFGH$, the edges $AB$ and $CG$ are parallel.', 'Pada kubus $ABCD.EFGH$, rusuk $AB$ dan $CG$ sejajar.'),
          ],
          answer: [true, true, false, false],
          explain: L(
            'The four space diagonals are $AG$, $BH$, $CE$ and $DF$. The unit cube has diagonal $\\sqrt{3}\\approx1.73$. And $AB$ is along the floor while $CG$ is vertical: they are not parallel (they are skew lines).',
            'Keempat diagonal ruang adalah $AG$, $BH$, $CE$, dan $DF$. Kubus satuan punya diagonal $\\sqrt{3}\\approx1{,}73$. Dan $AB$ sepanjang alas sedangkan $CG$ tegak: keduanya tidak sejajar (keduanya garis bersilangan).',
          ),
          hint: L(
            'Think of the direction of each edge: along the floor or vertical?',
            'Pikirkan arah tiap rusuk: sepanjang alas atau tegak?',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'In the cube $ABCD.EFGH$ with edge 6 cm, $M$ is the midpoint of the edge $CG$. Find the length $AM$, in centimetres.',
            'Pada kubus $ABCD.EFGH$ berusuk 6 cm, $M$ titik tengah rusuk $CG$. Tentukan panjang $AM$, dalam sentimeter.',
          ),
          blanks: [{ label: 'AM =', answer: 9, after: '\\text{cm}' }],
          hints: [
            L('Find a right triangle that contains $A$ and $M$. The angle at $C$ is a right angle.', 'Cari segitiga siku-siku yang memuat $A$ dan $M$. Sudut di $C$ siku-siku.'),
            L('$AC^2=72$ and $CM=3$.', '$AC^2=72$ dan $CM=3$.'),
            L('$AM^2=72+9$.', '$AM^2=72+9$.'),
          ],
          explain: L(
            '$AM^2=AC^2+CM^2=72+9=81$, so $AM=9$ cm.',
            '$AM^2=AC^2+CM^2=72+9=81$, jadi $AM=9$ cm.',
          ),
          solution: ['AC^2=6^2+6^2=72 \\quad CM=3', 'AM^2=72+9=81', 'AM=9'],
        },
      ],
    },
    /* -------------------------------------------------------- L2 angles in space */
    {
      id: 'tka-sma-m5-s2-l2',
      title: L('Angles Between Lines and Planes', 'Sudut antara Garis dan Bidang'),
      goal: L(
        'You can find the angle between a line and a plane, between two planes, and between two skew lines in a cube or box.',
        'Kamu bisa mencari sudut antara garis dan bidang, antara dua bidang, dan antara dua garis bersilangan pada kubus atau balok.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: A Line Against the Floor', 'Ayo Amati: Sebuah Garis terhadap Lantai'),
          body: L(
            'The **angle between a line and a plane** is the angle between the line and its **shadow** (projection) on the plane. It is always between $0^{\\circ}$ and $90^{\\circ}$.\n\nIn the cube, the face diagonal $AF$ leans against the floor $ABCD$. Its shadow on the floor is the edge $AB$ (the point $F$ is straight above $B$).\n\n1. Step 1: The triangle $ABF$ has a right angle at $B$, because $BF$ is vertical.\n2. Step 2: $\\tan\\angle FAB=\\frac{BF}{AB}=\\frac{a}{a}=1$.\n3. Step 3: So the angle is $45^{\\circ}$.\n\nThe recipe: **drop a perpendicular** from the top of the line to the plane; the triangle formed has the angle you want.',
            '**Sudut antara garis dan bidang** adalah sudut antara garis itu dan **bayangannya** (proyeksinya) pada bidang. Besarnya selalu di antara $0^{\\circ}$ dan $90^{\\circ}$.\n\nPada kubus, diagonal bidang $AF$ bersandar pada alas $ABCD$. Bayangannya pada alas adalah rusuk $AB$ (titik $F$ tepat di atas $B$).\n\n1. Langkah 1: Segitiga $ABF$ siku-siku di $B$, karena $BF$ tegak.\n2. Langkah 2: $\\tan\\angle FAB=\\frac{BF}{AB}=\\frac{a}{a}=1$.\n3. Langkah 3: Jadi sudutnya $45^{\\circ}$.\n\nResepnya: **tarik garis tegak lurus** dari ujung atas garis ke bidang; segitiga yang terbentuk memuat sudut yang dicari.',
          ),
          figure: {
            ...box3d({
              l: 6,
              segs: [
                { from: 'A', to: 'F', color: 'result' },
                { from: 'B', to: 'F', color: 'b' },
              ],
            }),
            caption: L('The line AF and its shadow AB on the floor.', 'Garis AF dan bayangannya AB pada alas.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: The Angle Between Two Planes', 'Contoh Bertahap: Sudut antara Dua Bidang'),
          body: L(
            'Two planes meet along a line. The **angle between the planes** is measured by two lines, one in each plane, both **perpendicular to the meeting line** at the same point.\n\nFind the angle between the floor $ABCD$ and the plane $ABGH$ (the slanted plane through $A$, $B$, $G$, $H$).\n\n1. Step 1: The planes meet along the line $AB$.\n2. Step 2: In the floor, $BC\\perp AB$. In the plane $ABGH$, $BG\\perp AB$ (since $AB\\perp$ the face $BCGF$).\n3. Step 3: So the angle is $\\angle CBG$. In the right triangle $BCG$, $BC=CG=a$, so $\\angle CBG=45^{\\circ}$.\n\nAgain the key move: find two lines **perpendicular to the common line**.',
            'Dua bidang bertemu sepanjang sebuah garis. **Sudut antara kedua bidang** diukur oleh dua garis, satu pada tiap bidang, keduanya **tegak lurus pada garis pertemuan** di titik yang sama.\n\nCari sudut antara alas $ABCD$ dan bidang $ABGH$ (bidang miring melalui $A$, $B$, $G$, $H$).\n\n1. Langkah 1: Kedua bidang bertemu sepanjang garis $AB$.\n2. Langkah 2: Pada alas, $BC\\perp AB$. Pada bidang $ABGH$, $BG\\perp AB$ (karena $AB\\perp$ sisi $BCGF$).\n3. Langkah 3: Jadi sudutnya $\\angle CBG$. Pada segitiga siku-siku $BCG$, $BC=CG=a$, jadi $\\angle CBG=45^{\\circ}$.\n\nLangkah kuncinya lagi: cari dua garis **tegak lurus pada garis persekutuan**.',
          ),
          figure: {
            ...box3d({
              l: 6,
              segs: [
                { from: 'B', to: 'C', color: 'b' },
                { from: 'B', to: 'G', color: 'result' },
                { from: 'A', to: 'H', color: 'muted' },
              ],
            }),
            caption: L('The angle CBG measures the angle between the two planes.', 'Sudut CBG mengukur sudut antara kedua bidang.'),
          },
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Watch Out!: Skew Lines and a Hidden Triangle', 'Awas, Jebakan!: Garis Bersilangan dan Segitiga Tersembunyi'),
          body: L(
            '**Skew lines** do not meet and are not parallel, such as $AC$ (on the floor) and $BG$ (on the side face). Their angle is found by sliding one line **parallel** to itself until the two lines meet.\n\n1. Step 1: $BG\\parallel AH$ (opposite edges of the face $ABGH$). Replace $BG$ by $AH$, which meets $AC$ at $A$.\n2. Step 2: Now look at the triangle $ACH$. Its sides are face diagonals: $AC=CH=AH=a\\sqrt{2}$.\n3. Step 3: The triangle is **equilateral**, so every angle is $60^{\\circ}$.\n\nThe angle between $AC$ and $BG$ is $60^{\\circ}$.\n\n**Common slip:** reading the angle straight off the picture. A drawing of a 3D box distorts angles, so always calculate.',
            '**Garis bersilangan** tidak bertemu dan tidak sejajar, seperti $AC$ (di alas) dan $BG$ (di sisi samping). Sudutnya dicari dengan menggeser salah satu garis **sejajar** dirinya sampai kedua garis bertemu.\n\n1. Langkah 1: $BG\\parallel AH$ (rusuk berhadapan pada sisi $ABGH$). Ganti $BG$ dengan $AH$, yang bertemu $AC$ di $A$.\n2. Langkah 2: Sekarang lihat segitiga $ACH$. Sisi-sisinya adalah diagonal bidang: $AC=CH=AH=a\\sqrt{2}$.\n3. Langkah 3: Segitiga itu **sama sisi**, jadi setiap sudutnya $60^{\\circ}$.\n\nSudut antara $AC$ dan $BG$ adalah $60^{\\circ}$.\n\n**Kesalahan umum:** membaca sudut langsung dari gambar. Gambar balok 3D mengubah sudut, jadi selalu hitung.',
          ),
          figure: {
            ...box3d({
              l: 6,
              segs: [
                { from: 'A', to: 'C', color: 'result' },
                { from: 'C', to: 'H', color: 'result' },
                { from: 'A', to: 'H', color: 'result' },
              ],
            }),
            caption: L('The triangle ACH has three equal sides.', 'Segitiga ACH punya tiga sisi sama panjang.'),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            '$\\theta$ is the angle between the space diagonal $AG$ and the floor $ABCD$. What is $\\tan\\theta$?',
            '$\\theta$ adalah sudut antara diagonal ruang $AG$ dan alas $ABCD$. Berapa $\\tan\\theta$?',
          ),
          figure: {
            ...box3d({
              l: 6,
              segs: [
                { from: 'A', to: 'G', color: 'result' },
                { from: 'A', to: 'C', color: 'b' },
              ],
            }),
            caption: L('The line AG and its shadow AC on the floor.', 'Garis AG dan bayangannya AC pada alas.'),
          },
          options: [
            L('$\\frac{1}{\\sqrt{2}}$', '$\\frac{1}{\\sqrt{2}}$'),
            L('$1$', '$1$'),
            L('$\\sqrt{2}$', '$\\sqrt{2}$'),
            L('$\\frac{1}{\\sqrt{3}}$', '$\\frac{1}{\\sqrt{3}}$'),
          ],
          answer: 0,
          explain: L(
            'The shadow of $AG$ on the floor is $AC=6\\sqrt{2}$, and the height is $CG=6$. So $\\tan\\theta=\\frac{CG}{AC}=\\frac{6}{6\\sqrt{2}}=\\frac{1}{\\sqrt{2}}$.',
            'Bayangan $AG$ pada alas adalah $AC=6\\sqrt{2}$, dan tingginya $CG=6$. Jadi $\\tan\\theta=\\frac{CG}{AC}=\\frac{6}{6\\sqrt{2}}=\\frac{1}{\\sqrt{2}}$.',
          ),
          hint: L(
            'Use the right triangle $ACG$: the angle at $A$ has opposite side $CG$ and adjacent side $AC$.',
            'Pakai segitiga siku-siku $ACG$: sudut di $A$ punya sisi depan $CG$ dan sisi samping $AC$.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: the angle $CBG$ between the floor and the plane $ABGH$ in a cube of edge 6.',
            'Coba bersama: sudut $CBG$ antara alas dan bidang $ABGH$ pada kubus berusuk 6.',
          ),
          template: 'BC=___ \\quad \\tan\\angle CBG=\\frac{6}{6}=___',
          blanks: ['6', '1'],
          explain: L(
            '$BC=6$ and $\\tan\\angle CBG=1$, so $\\angle CBG=45^{\\circ}$.',
            '$BC=6$ dan $\\tan\\angle CBG=1$, jadi $\\angle CBG=45^{\\circ}$.',
          ),
          hint: L(
            'In the right triangle $BCG$ the edge $BC$ is the adjacent side.',
            'Pada segitiga siku-siku $BCG$ rusuk $BC$ adalah sisi samping.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('In a cube $ABCD.EFGH$, choose the TWO true statements.', 'Pada kubus $ABCD.EFGH$, pilih DUA pernyataan yang benar.'),
          options: [
            L('The angle between $AF$ and the plane $ABCD$ is $45^{\\circ}$.', 'Sudut antara $AF$ dan bidang $ABCD$ adalah $45^{\\circ}$.'),
            L('The angle between the planes $ABCD$ and $ABGH$ is $45^{\\circ}$.', 'Sudut antara bidang $ABCD$ dan $ABGH$ adalah $45^{\\circ}$.'),
            L('The triangle $ACH$ has a right angle.', 'Segitiga $ACH$ memiliki sudut siku-siku.'),
            L('The angle between $AC$ and $BG$ is $90^{\\circ}$.', 'Sudut antara $AC$ dan $BG$ adalah $90^{\\circ}$.'),
          ],
          answer: [0, 1],
          explain: L(
            'The first two are worked out in this lesson. But $ACH$ is equilateral, so all its angles are $60^{\\circ}$, and the angle between $AC$ and $BG$ is $60^{\\circ}$, not $90^{\\circ}$.',
            'Dua yang pertama dihitung dalam pelajaran ini. Namun $ACH$ sama sisi, jadi semua sudutnya $60^{\\circ}$, dan sudut antara $AC$ dan $BG$ adalah $60^{\\circ}$, bukan $90^{\\circ}$.',
          ),
          hint: L(
            'Triangle $ACH$ has three face diagonals as sides. What kind of triangle is that?',
            'Segitiga $ACH$ bersisi tiga diagonal bidang. Segitiga jenis apa itu?',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('In a cube, the triangle $ACH$ is equilateral.', 'Pada kubus, segitiga $ACH$ sama sisi.'),
            L('The angle between two skew lines is found by sliding one parallel until they meet.', 'Sudut antara dua garis bersilangan dicari dengan menggeser salah satunya sejajar sampai bertemu.'),
            L('The angle between a line and a plane can be $120^{\\circ}$.', 'Sudut antara garis dan bidang dapat bernilai $120^{\\circ}$.'),
            L('The space diagonal $AG$ is perpendicular to the floor $ABCD$.', 'Diagonal ruang $AG$ tegak lurus alas $ABCD$.'),
          ],
          answer: [true, true, false, false],
          explain: L(
            'All three sides of $ACH$ are face diagonals. The angle between a line and a plane is at most $90^{\\circ}$. And $AG$ leans: its angle with the floor has $\\tan\\theta=\\frac{1}{\\sqrt{2}}$, not 90°.',
            'Ketiga sisi $ACH$ adalah diagonal bidang. Sudut antara garis dan bidang paling besar $90^{\\circ}$. Dan $AG$ miring: sudutnya dengan alas punya $\\tan\\theta=\\frac{1}{\\sqrt{2}}$, bukan 90°.',
          ),
          hint: L(
            'Recall the definition: the angle with the shadow on the plane.',
            'Ingat definisinya: sudut dengan bayangan pada bidang.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'In the box $ABCD.EFGH$, $AB=3$, $BC=4$ and $CG=10$. If $\\theta$ is the angle between $AG$ and the floor $ABCD$, find $\\tan\\theta$.',
            'Pada balok $ABCD.EFGH$, $AB=3$, $BC=4$, dan $CG=10$. Jika $\\theta$ adalah sudut antara $AG$ dan alas $ABCD$, tentukan $\\tan\\theta$.',
          ),
          blanks: [{ label: '\\tan\\theta =', answer: 2 }],
          hints: [
            L('The shadow of $AG$ on the floor is the floor diagonal $AC$.', 'Bayangan $AG$ pada alas adalah diagonal alas $AC$.'),
            L('$AC=\\sqrt{3^2+4^2}=5$.', '$AC=\\sqrt{3^2+4^2}=5$.'),
            L('$\\tan\\theta=\\frac{CG}{AC}$.', '$\\tan\\theta=\\frac{CG}{AC}$.'),
          ],
          explain: L(
            '$AC=5$, so $\\tan\\theta=\\frac{CG}{AC}=\\frac{10}{5}=2$.',
            '$AC=5$, jadi $\\tan\\theta=\\frac{CG}{AC}=\\frac{10}{5}=2$.',
          ),
          solution: ['AC=\\sqrt{3^2+4^2}=5', '\\tan\\theta=\\frac{CG}{AC}=\\frac{10}{5}', '=2'],
        },
      ],
    },
    lessonDistances,
  ],
  project: {
    id: 'tka-sma-m5-s2-p',
    runtime: 'math',
    title: L('Space Geometry at Work', 'Geometri Ruang dalam Pemakaian'),
    brief: L(
      'Use Pythagoras and angles in cubes and boxes.',
      'Pakai Pythagoras dan sudut pada kubus dan balok.',
    ),
    requirements: [
      L('Find diagonals and distances in a cube or box.', 'Mencari diagonal dan jarak pada kubus atau balok.'),
      L('Find angles between lines and planes.', 'Mencari sudut antara garis dan bidang.'),
    ],
    hints: [
      L('Find a right triangle that has a line on the floor and a vertical line.', 'Cari segitiga siku-siku yang punya satu garis di alas dan satu garis tegak.'),
      L('Space diagonal of a box: $\\sqrt{l^2+w^2+h^2}$.', 'Diagonal ruang balok: $\\sqrt{l^2+w^2+h^2}$.'),
      L('For skew lines, slide one parallel until they meet and look for a special triangle.', 'Untuk garis bersilangan, geser salah satunya sejajar sampai bertemu dan cari segitiga istimewa.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L(
          'A cube has edge 10 cm. Find the square of the length of its space diagonal $AG$.',
          'Sebuah kubus berusuk 10 cm. Tentukan kuadrat panjang diagonal ruangnya $AG$.',
        ),
        figure: {
          ...box3d({ l: 10, segs: [{ from: 'A', to: 'G', color: 'result' }] }),
          caption: L('A cube with its space diagonal.', 'Sebuah kubus dengan diagonal ruangnya.'),
        },
        blanks: [{ label: 'AG^2 =', answer: 300 }],
        solution: ['AC^2=10^2+10^2=200', 'AG^2=200+100=300'],
      },
      {
        prompt: L(
          'A box measures 3 cm, 4 cm and 12 cm. How long is its space diagonal, in centimetres?',
          'Sebuah balok berukuran 3 cm, 4 cm, dan 12 cm. Berapa panjang diagonal ruangnya, dalam sentimeter?',
        ),
        blanks: [{ answer: 13, after: '\\text{cm}' }],
        solution: ['d^2=3^2+4^2+12^2=9+16+144=169', 'd=13'],
      },
      {
        prompt: L(
          'In a cube of edge 4 cm, $M$ is the midpoint of the edge $CG$. Find $AM$, in centimetres.',
          'Pada kubus berusuk 4 cm, $M$ titik tengah rusuk $CG$. Tentukan $AM$, dalam sentimeter.',
        ),
        blanks: [{ label: 'AM =', answer: 6, after: '\\text{cm}' }],
        solution: ['AC^2=16+16=32 \\quad CM=2', 'AM^2=32+4=36 \\Rightarrow AM=6'],
      },
      {
        prompt: L(
          'In a cube, find the angle between the skew lines $AC$ and $BG$, in degrees.',
          'Pada kubus, tentukan sudut antara garis bersilangan $AC$ dan $BG$, dalam derajat.',
        ),
        blanks: [{ answer: 60, after: '^{\\circ}' }],
        solution: {
          en: ['BG\\parallel AH \\Rightarrow \\text{angle}=\\angle CAH', '\\triangle ACH \\text{ is equilateral} \\Rightarrow 60^{\\circ}'],
          id: ['BG\\parallel AH \\Rightarrow \\text{sudut}=\\angle CAH', '\\triangle ACH \\text{ sama sisi} \\Rightarrow 60^{\\circ}'],
        },
      },
      {
        prompt: L(
          'In the box $ABCD.EFGH$, $AB=6$, $BC=8$ and $CG=10$. Find the angle between $AG$ and the floor, in degrees.',
          'Pada balok $ABCD.EFGH$, $AB=6$, $BC=8$, dan $CG=10$. Tentukan sudut antara $AG$ dan alas, dalam derajat.',
        ),
        blanks: [{ answer: 45, after: '^{\\circ}' }],
        solution: ['AC=\\sqrt{36+64}=10', '\\tan\\theta=\\frac{CG}{AC}=\\frac{10}{10}=1 \\Rightarrow \\theta=45^{\\circ}'],
      },
      {
        prompt: L(
          'In the box $ABCD.EFGH$, $AB=6$ and $BC=8$. Find the distance from $B$ to the vertical plane $ACG$.',
          'Pada balok $ABCD.EFGH$, $AB=6$ dan $BC=8$. Tentukan jarak dari $B$ ke bidang tegak $ACG$.',
        ),
        blanks: [{ answer: 4.8 }],
        solution: {
          en: ['AC=\\sqrt{6^2+8^2}=10', '\\frac{6\\times8}{10}=4.8'],
          id: ['AC=\\sqrt{6^2+8^2}=10', '\\frac{6\\times8}{10}=4{,}8'],
        },
      },
    ],
  },
}
