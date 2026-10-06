import type { FigItem } from '../../lib/figure'
import type { Submodule } from '../types'
import { L, dot, line, plane, solid, outline, txt } from './figs'
import type { Pt } from './figs'

/** Module 6, submodule 1 — translation, reflection, rotation and dilation of
 *  points and shapes on the coordinate plane. */

const pts = (...p: Pt[]) => p

/** Axis-aligned label next to a point. */
const tag = (p: Pt, text: string, dx = 0.35, dy = 0.45, color: 'muted' | 'result' = 'muted'): FigItem => txt(p[0] + dx, p[1] + dy, text, 'md', color)

export const m6s1: Submodule = {
  id: 'tka-sma-m6-s1',
  title: L('Moving Points and Shapes', 'Memindahkan Titik dan Bangun'),
  summary: L(
    'Translate, reflect, rotate and dilate points and shapes on the coordinate plane, using coordinate rules.',
    'Menggeser, mencerminkan, memutar, dan mendilatasi titik dan bangun pada bidang koordinat, memakai aturan koordinat.',
  ),
  lessons: [
    /* -------------------------------------------- L1 translation and reflection */
    {
      id: 'tka-sma-m6-s1-l1',
      title: L('Translation and Reflection', 'Translasi dan Refleksi'),
      goal: L(
        'You can slide a point or shape by a vector and reflect it in the axes, in $y=x$ and in a vertical or horizontal line.',
        'Kamu bisa menggeser titik atau bangun dengan vektor dan mencerminkannya terhadap sumbu, garis $y=x$, dan garis tegak atau mendatar.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Slide Without Turning', 'Ayo Amati: Menggeser Tanpa Memutar'),
          body: L(
            'A **translation** moves every point of a shape the same distance in the same direction. It is written with a vector $\\begin{pmatrix}a\\\\b\\end{pmatrix}$: $a$ units right and $b$ units up.\n\n$$(x,y)\\ \\to\\ (x+a,\\ y+b)$$\n\nIn the picture the green triangle $A(1,1)$, $B(4,1)$, $C(1,3)$ is moved by $\\begin{pmatrix}3\\\\2\\end{pmatrix}$ to the orange triangle: $A\'(4,3)$, $B\'(7,3)$, $C\'(4,5)$.\n\n- The shape keeps its size, its angles and its direction.\n- Every point moves by the **same** vector, so each segment joining a point to its image is parallel and equal in length.',
            '**Translasi** menggeser setiap titik sebuah bangun sejauh yang sama ke arah yang sama. Translasi ditulis dengan vektor $\\begin{pmatrix}a\\\\b\\end{pmatrix}$: $a$ satuan ke kanan dan $b$ satuan ke atas.\n\n$$(x,y)\\ \\to\\ (x+a,\\ y+b)$$\n\nPada gambar, segitiga hijau $A(1,1)$, $B(4,1)$, $C(1,3)$ digeser dengan $\\begin{pmatrix}3\\\\2\\end{pmatrix}$ menjadi segitiga oranye: $A\'(4,3)$, $B\'(7,3)$, $C\'(4,5)$.\n\n- Bangun tetap berukuran sama, bersudut sama, dan menghadap arah yang sama.\n- Setiap titik bergeser dengan vektor yang **sama**, sehingga ruas yang menghubungkan titik dengan bayangannya sejajar dan sama panjang.',
          ),
          figure: {
            ...plane(
              [
                solid(pts([1, 1], [4, 1], [1, 3]), 'a'),
                solid(pts([4, 3], [7, 3], [4, 5]), 'b'),
                line([1, 1], [4, 3], 'muted', { dashed: true }),
                tag([1, 1], 'A', -0.5, -0.5),
                tag([4, 3], "A'", 0.45, -0.5),
              ],
              { x: [-1, 9], y: [-1, 7] },
            ),
            caption: L('A triangle and its image after a translation by (3, 2).', 'Sebuah segitiga dan bayangannya setelah translasi (3, 2).'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Reflection Rules', 'Contoh Bertahap: Aturan Refleksi'),
          body: L(
            'A **reflection** flips a point over a mirror line, so the mirror is exactly halfway between the point and its image.\n\n| Mirror | $(x,y)$ goes to |\n|---|---|\n| the $x$-axis | $(x,\\,-y)$ |\n| the $y$-axis | $(-x,\\,y)$ |\n| the line $y=x$ | $(y,\\,x)$ |\n| the line $y=-x$ | $(-y,\\,-x)$ |\n| the line $x=k$ | $(2k-x,\\,y)$ |\n| the line $y=k$ | $(x,\\,2k-y)$ |\n\nThe picture shows $P(3,2)$ and three images: $(3,-2)$ in the $x$-axis, $(-3,2)$ in the $y$-axis and $(2,3)$ in $y=x$.\n\nExample: reflect $(3,2)$ in the line $x=1$. $2(1)-3=-1$, so the image is $(-1,2)$. Check: the point $(3,2)$ is 2 to the right of the line, and $(-1,2)$ is 2 to the left.',
            '**Refleksi** membalik titik terhadap garis cermin, sehingga cermin tepat di tengah antara titik dan bayangannya.\n\n| Cermin | $(x,y)$ menjadi |\n|---|---|\n| sumbu $x$ | $(x,\\,-y)$ |\n| sumbu $y$ | $(-x,\\,y)$ |\n| garis $y=x$ | $(y,\\,x)$ |\n| garis $y=-x$ | $(-y,\\,-x)$ |\n| garis $x=k$ | $(2k-x,\\,y)$ |\n| garis $y=k$ | $(x,\\,2k-y)$ |\n\nGambar menunjukkan $P(3,2)$ dan tiga bayangannya: $(3,-2)$ pada sumbu $x$, $(-3,2)$ pada sumbu $y$, dan $(2,3)$ pada $y=x$.\n\nContoh: cerminkan $(3,2)$ terhadap garis $x=1$. $2(1)-3=-1$, jadi bayangannya $(-1,2)$. Periksa: titik $(3,2)$ berada 2 di kanan garis, dan $(-1,2)$ berada 2 di kiri garis.',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: 'x', from: -5, to: 5, color: 'muted', dashed: true },
                dot([3, 2], 'P', 'result'),
                dot([3, -2], undefined, 'a'),
                dot([-3, 2], undefined, 'b'),
                dot([2, 3], undefined, 'c'),
              ],
              { span: 5 },
            ),
            caption: L('P(3, 2) and its images in the x-axis, the y-axis and the line y = x.', 'P(3, 2) dan bayangannya pada sumbu x, sumbu y, dan garis y = x.'),
          },
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Watch Out!: Translating a Graph, Mixing Up Coordinates', 'Awas, Jebakan!: Menggeser Grafik, Tertukarnya Koordinat'),
          body: L(
            'To translate a whole line or curve, move **every** point, which changes its equation. The rule for a shift of $a$ to the right: replace $x$ by $x-a$.\n\nThe line $y=2x+1$ moved 3 units right becomes\n\n$$y=2(x-3)+1=2x-5$$\n\nThe orange line in the picture is parallel to the green one, 3 units to the right (and 6 units down).\n\nTwo common mix-ups:\n\n- Reflecting in the $x$-axis changes the sign of $y$, **not** $x$. Reflecting in the $y$-axis changes the sign of $x$.\n- Reflecting in $y=x$ **swaps** the coordinates; it does not change any sign.\n\nAll of these motions are **isometries**: distances and angles do not change.',
            'Untuk menggeser seluruh garis atau kurva, geser **setiap** titiknya, yang mengubah persamaannya. Aturan untuk pergeseran $a$ ke kanan: ganti $x$ dengan $x-a$.\n\nGaris $y=2x+1$ yang digeser 3 satuan ke kanan menjadi\n\n$$y=2(x-3)+1=2x-5$$\n\nGaris oranye pada gambar sejajar dengan garis hijau, 3 satuan di kanannya (dan 6 satuan di bawahnya).\n\nDua kekeliruan umum:\n\n- Refleksi pada sumbu $x$ mengubah tanda $y$, **bukan** $x$. Refleksi pada sumbu $y$ mengubah tanda $x$.\n- Refleksi pada $y=x$ **menukar** koordinat; tidak ada tanda yang berubah.\n\nSemua gerakan ini adalah **isometri**: jarak dan sudut tidak berubah.',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: '2*x+1', from: -3, to: 5, color: 'a' },
                { t: 'curve', f: '2*x-5', from: -3, to: 5, color: 'b' },
              ],
              { x: [-4, 7], y: [-6, 8] },
            ),
            caption: L('y = 2x + 1 (green) and its image y = 2x - 5 (orange).', 'y = 2x + 1 (hijau) dan bayangannya y = 2x - 5 (oranye).'),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The green triangle is mapped to the orange triangle. Which transformation does this?',
            'Segitiga hijau dipetakan ke segitiga oranye. Transformasi manakah yang melakukannya?',
          ),
          figure: {
            ...plane(
              [
                solid(pts([1, 1], [3, 1], [1, 3]), 'a'),
                solid(pts([-1, 1], [-3, 1], [-1, 3]), 'b'),
              ],
              { x: [-5, 5], y: [-1, 5] },
            ),
            caption: L('A triangle and its image.', 'Sebuah segitiga dan bayangannya.'),
          },
          options: [
            L('Reflection in the $y$-axis', 'Refleksi pada sumbu $y$'),
            L('Translation by $\\begin{pmatrix}-2\\\\0\\end{pmatrix}$', 'Translasi $\\begin{pmatrix}-2\\\\0\\end{pmatrix}$'),
            L('Reflection in the $x$-axis', 'Refleksi pada sumbu $x$'),
            L('Rotation by $180^{\\circ}$ about the origin', 'Rotasi $180^{\\circ}$ terhadap titik asal'),
          ],
          answer: 0,
          explain: L(
            'Each point $(x,y)$ goes to $(-x,y)$: $(1,1)\\to(-1,1)$, $(3,1)\\to(-3,1)$, $(1,3)\\to(-1,3)$. A translation by $(-2,0)$ would send $(3,1)$ to $(1,1)$, not $(-3,1)$. The $x$-axis reflection and the half-turn would put the image below the axis.',
            'Setiap titik $(x,y)$ menjadi $(-x,y)$: $(1,1)\\to(-1,1)$, $(3,1)\\to(-3,1)$, $(1,3)\\to(-1,3)$. Translasi $(-2,0)$ akan memindahkan $(3,1)$ ke $(1,1)$, bukan $(-3,1)$. Refleksi sumbu $x$ dan putaran setengah putaran akan menaruh bayangan di bawah sumbu.',
          ),
          hint: L(
            'Check all the corners, not just one. Compare the signs of the coordinates.',
            'Periksa semua titik sudut, bukan hanya satu. Bandingkan tanda koordinatnya.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: translate $A(1,1)$ by $\\begin{pmatrix}3\\\\2\\end{pmatrix}$.',
            'Coba bersama: geser $A(1,1)$ dengan $\\begin{pmatrix}3\\\\2\\end{pmatrix}$.',
          ),
          template: '(x,y)\\to(x+3,\\ y+2):\\quad (1,1)\\to(___,\\ ___)',
          blanks: ['4', '3'],
          explain: L(
            '$1+3=4$ and $1+2=3$, so $A\'=(4,3)$.',
            '$1+3=4$ dan $1+2=3$, jadi $A\'=(4,3)$.',
          ),
          hint: L(
            'Add the first number of the vector to $x$ and the second to $y$.',
            'Tambahkan bilangan pertama vektor ke $x$ dan bilangan kedua ke $y$.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L('The reflection of $(3,2)$ in the $x$-axis is $(3,-2)$.', 'Bayangan $(3,2)$ oleh refleksi pada sumbu $x$ adalah $(3,-2)$.'),
            L('The reflection of $(3,2)$ in the line $y=x$ is $(2,3)$.', 'Bayangan $(3,2)$ oleh refleksi pada garis $y=x$ adalah $(2,3)$.'),
            L('The reflection of $(3,2)$ in the $y$-axis is $(3,-2)$.', 'Bayangan $(3,2)$ oleh refleksi pada sumbu $y$ adalah $(3,-2)$.'),
            L('The translation by $\\begin{pmatrix}-1\\\\4\\end{pmatrix}$ sends $(3,2)$ to $(2,-2)$.', 'Translasi $\\begin{pmatrix}-1\\\\4\\end{pmatrix}$ memindahkan $(3,2)$ ke $(2,-2)$.'),
          ],
          answer: [0, 1],
          explain: L(
            'The $y$-axis reflection gives $(-3,2)$. The translation gives $(3-1,\\,2+4)=(2,6)$, not $(2,-2)$.',
            'Refleksi sumbu $y$ memberi $(-3,2)$. Translasi memberi $(3-1,\\,2+4)=(2,6)$, bukan $(2,-2)$.',
          ),
          hint: L(
            'Apply each rule from the table to $(3,2)$.',
            'Terapkan tiap aturan dari tabel pada $(3,2)$.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('A reflection keeps the distance between any two points.', 'Refleksi mempertahankan jarak antara dua titik mana pun.'),
            L('Reflection in the $y$-axis changes $(x,y)$ to $(x,-y)$.', 'Refleksi pada sumbu $y$ mengubah $(x,y)$ menjadi $(x,-y)$.'),
            L('Moving the line $y=2x+1$ three units right gives $y=2x-5$.', 'Menggeser garis $y=2x+1$ tiga satuan ke kanan menghasilkan $y=2x-5$.'),
            L('A translation makes a shape bigger.', 'Translasi membuat bangun menjadi lebih besar.'),
          ],
          answer: [true, false, true, false],
          explain: L(
            'Reflections and translations are isometries, so they keep distances and sizes. The $y$-axis reflection changes the sign of $x$: $(-x,y)$. And $y=2(x-3)+1=2x-5$.',
            'Refleksi dan translasi adalah isometri, jadi mempertahankan jarak dan ukuran. Refleksi sumbu $y$ mengubah tanda $x$: $(-x,y)$. Dan $y=2(x-3)+1=2x-5$.',
          ),
          hint: L(
            'For the line, replace $x$ by $x-3$ and simplify.',
            'Untuk garis, ganti $x$ dengan $x-3$ lalu sederhanakan.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'The point $P(4,3)$ is reflected in the line $y=x$ and then translated by $\\begin{pmatrix}-2\\\\5\\end{pmatrix}$. Find the final point.',
            'Titik $P(4,3)$ dicerminkan pada garis $y=x$ lalu digeser dengan $\\begin{pmatrix}-2\\\\5\\end{pmatrix}$. Tentukan titik akhirnya.',
          ),
          inline: true,
          blanks: [
            { label: 'x =', answer: 1 },
            { label: 'y =', answer: 9 },
          ],
          hints: [
            L('Do the two steps in order. First swap the coordinates of $P$.', 'Kerjakan kedua langkah berurutan. Pertama tukar koordinat $P$.'),
            L('The reflection gives $(3,4)$.', 'Refleksi memberi $(3,4)$.'),
            L('Now add the vector: $(3-2,\\ 4+5)$.', 'Sekarang tambahkan vektornya: $(3-2,\\ 4+5)$.'),
          ],
          explain: L(
            '$(4,3)\\to(3,4)\\to(3-2,\\,4+5)=(1,9)$.',
            '$(4,3)\\to(3,4)\\to(3-2,\\,4+5)=(1,9)$.',
          ),
          solution: ['(4,3)\\to(3,4)', '(3,4)+(-2,5)=(1,9)'],
        },
      ],
    },
    /* ----------------------------------------------- L2 rotation and dilation */
    {
      id: 'tka-sma-m6-s1-l2',
      title: L('Rotation and Dilation', 'Rotasi dan Dilatasi'),
      goal: L(
        'You can rotate a point about the origin or another point, and enlarge or shrink a shape with a dilation, including what happens to areas.',
        'Kamu bisa memutar titik terhadap titik asal atau titik lain, dan memperbesar atau memperkecil bangun dengan dilatasi, termasuk yang terjadi pada luas.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Turning About the Origin', 'Ayo Amati: Berputar terhadap Titik Asal'),
          body: L(
            'A **rotation** turns a shape about a fixed point, the **centre**, through a given angle. Anticlockwise is the positive direction.\n\nThe point $A(3,1)$ is turned $90^{\\circ}$ anticlockwise about the origin $O$ and lands on $A_1(-1,3)$; turned $180^{\\circ}$ it lands on $A_2(-3,-1)$.\n\n- The distance from the centre does not change: $OA=OA_1=OA_2=\\sqrt{10}$.\n- The angle $AOA_1$ is exactly the angle of rotation, $90^{\\circ}$.\n\nThe rotation keeps size and shape, so it is an isometry like the translation and the reflection.',
            '**Rotasi** memutar sebuah bangun terhadap titik tetap, yaitu **pusat**, sebesar sudut tertentu. Berlawanan arah jarum jam adalah arah positif.\n\nTitik $A(3,1)$ diputar $90^{\\circ}$ berlawanan arah jarum jam terhadap titik asal $O$ dan jatuh di $A_1(-1,3)$; diputar $180^{\\circ}$ jatuh di $A_2(-3,-1)$.\n\n- Jarak dari pusat tidak berubah: $OA=OA_1=OA_2=\\sqrt{10}$.\n- Sudut $AOA_1$ tepat sama dengan sudut rotasi, $90^{\\circ}$.\n\nRotasi mempertahankan ukuran dan bentuk, jadi merupakan isometri seperti translasi dan refleksi.',
          ),
          figure: {
            ...plane(
              [
                line([0, 0], [3, 1], 'a', { width: 2.4 }),
                line([0, 0], [-1, 3], 'b', { width: 2.4 }),
                line([0, 0], [-3, -1], 'c', { width: 2.4 }),
                { t: 'angle', at: [0, 0], from: [3, 1], to: [-1, 3], label: '90°' },
                dot([3, 1], 'A', 'a'),
                dot([-1, 3], 'A1', 'b'),
                dot([-3, -1], 'A2', 'c'),
              ],
              { span: 5 },
            ),
            caption: L('A rotated 90° (A1) and 180° (A2) about the origin.', 'A diputar 90° (A1) dan 180° (A2) terhadap titik asal.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Rotation Rules and Other Centres', 'Contoh Bertahap: Aturan Rotasi dan Pusat Lain'),
          body: L(
            'About the origin, anticlockwise:\n\n| Angle | $(x,y)$ goes to |\n|---|---|\n| $90^{\\circ}$ | $(-y,\\,x)$ |\n| $180^{\\circ}$ | $(-x,\\,-y)$ |\n| $270^{\\circ}$ (same as $90^{\\circ}$ clockwise) | $(y,\\,-x)$ |\n\nExample: $(4,-1)$ turned $90^{\\circ}$ anticlockwise goes to $(1,4)$.\n\n**About another centre** $C$: shift so that $C$ becomes the origin, rotate, shift back. Rotate $(5,2)$ by $90^{\\circ}$ anticlockwise about $C(1,1)$.\n\n1. Step 1: Subtract the centre: $(5,2)-(1,1)=(4,1)$.\n2. Step 2: Rotate: $(4,1)\\to(-1,4)$.\n3. Step 3: Add the centre back: $(-1,4)+(1,1)=(0,5)$.',
            'Terhadap titik asal, berlawanan arah jarum jam:\n\n| Sudut | $(x,y)$ menjadi |\n|---|---|\n| $90^{\\circ}$ | $(-y,\\,x)$ |\n| $180^{\\circ}$ | $(-x,\\,-y)$ |\n| $270^{\\circ}$ (sama dengan $90^{\\circ}$ searah jarum jam) | $(y,\\,-x)$ |\n\nContoh: $(4,-1)$ diputar $90^{\\circ}$ berlawanan arah jarum jam menjadi $(1,4)$.\n\n**Terhadap pusat lain** $C$: geser sehingga $C$ menjadi titik asal, putar, lalu geser kembali. Putar $(5,2)$ sebesar $90^{\\circ}$ berlawanan arah jarum jam terhadap $C(1,1)$.\n\n1. Langkah 1: Kurangkan pusat: $(5,2)-(1,1)=(4,1)$.\n2. Langkah 2: Putar: $(4,1)\\to(-1,4)$.\n3. Langkah 3: Tambahkan pusat kembali: $(-1,4)+(1,1)=(0,5)$.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Dilation', 'Contoh Bertahap: Dilatasi'),
          body: L(
            'A **dilation** with centre $O$ and scale factor $k$ sends $(x,y)$ to $(kx,\\,ky)$. It changes the size but keeps the shape.\n\nIn the picture the green triangle $(1,1)$, $(3,1)$, $(1,2)$ is enlarged with $k=2$ to the orange triangle $(2,2)$, $(6,2)$, $(2,4)$.\n\n- Lengths are multiplied by $|k|$.\n- **Areas** are multiplied by $k^2$: the green area is 1, the orange area is 4.\n- $|k|>1$ enlarges and $0<|k|<1$ shrinks. A **negative** $k$ also puts the image on the other side of the centre.\n\nExample: a triangle of area 6 is dilated with $k=3$. The new area is $6\\times3^2=54$.\n\n**Watch out:** do not multiply the area by $k$; the area grows with $k^2$.',
            '**Dilatasi** dengan pusat $O$ dan faktor skala $k$ memetakan $(x,y)$ ke $(kx,\\,ky)$. Dilatasi mengubah ukuran tetapi mempertahankan bentuk.\n\nPada gambar, segitiga hijau $(1,1)$, $(3,1)$, $(1,2)$ diperbesar dengan $k=2$ menjadi segitiga oranye $(2,2)$, $(6,2)$, $(2,4)$.\n\n- Panjang dikalikan $|k|$.\n- **Luas** dikalikan $k^2$: luas hijau 1, luas oranye 4.\n- $|k|>1$ memperbesar dan $0<|k|<1$ memperkecil. $k$ yang **negatif** juga menaruh bayangan di sisi lain pusat.\n\nContoh: segitiga seluas 6 didilatasi dengan $k=3$. Luas barunya $6\\times3^2=54$.\n\n**Awas:** jangan mengalikan luas dengan $k$; luas bertambah dengan $k^2$.',
          ),
          figure: {
            ...plane(
              [
                solid(pts([1, 1], [3, 1], [1, 2]), 'a'),
                outline(pts([2, 2], [6, 2], [2, 4]), 'b'),
                line([0, 0], [6, 2], 'muted', { dashed: true }),
                line([0, 0], [2, 4], 'muted', { dashed: true }),
                dot([0, 0], 'O', 'muted'),
              ],
              { x: [-1, 8], y: [-1, 6] },
            ),
            caption: L('A dilation with centre O and scale factor 2.', 'Dilatasi dengan pusat O dan faktor skala 2.'),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The point $A(3,1)$ is mapped to $A_1(-1,3)$. Which rotation about the origin does this?',
            'Titik $A(3,1)$ dipetakan ke $A_1(-1,3)$. Rotasi terhadap titik asal manakah yang melakukannya?',
          ),
          figure: {
            ...plane(
              [
                dot([3, 1], 'A', 'a'),
                dot([-1, 3], 'A1', 'result'),
                line([0, 0], [3, 1], 'a', { width: 2 }),
                line([0, 0], [-1, 3], 'result', { width: 2 }),
              ],
              { span: 5 },
            ),
            caption: L('A point and its image.', 'Sebuah titik dan bayangannya.'),
          },
          options: [
            L('$90^{\\circ}$ anticlockwise', '$90^{\\circ}$ berlawanan arah jarum jam'),
            L('$90^{\\circ}$ clockwise', '$90^{\\circ}$ searah jarum jam'),
            L('$180^{\\circ}$', '$180^{\\circ}$'),
            L('$270^{\\circ}$ anticlockwise', '$270^{\\circ}$ berlawanan arah jarum jam'),
          ],
          answer: 0,
          explain: L(
            '$(x,y)\\to(-y,x)$ gives $(3,1)\\to(-1,3)$, which is the rule for $90^{\\circ}$ anticlockwise. The $90^{\\circ}$ clockwise turn would give $(1,-3)$.',
            '$(x,y)\\to(-y,x)$ memberi $(3,1)\\to(-1,3)$, yaitu aturan $90^{\\circ}$ berlawanan arah jarum jam. Putaran $90^{\\circ}$ searah jarum jam akan memberi $(1,-3)$.',
          ),
          hint: L(
            'Apply the rule $(-y,x)$ to $(3,1)$ and see whether it matches.',
            'Terapkan aturan $(-y,x)$ pada $(3,1)$ dan lihat apakah cocok.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: rotate $(4,-1)$ by $90^{\\circ}$ anticlockwise about the origin.',
            'Coba bersama: putar $(4,-1)$ sebesar $90^{\\circ}$ berlawanan arah jarum jam terhadap titik asal.',
          ),
          template: '(x,y)\\to(-y,\\ x):\\quad (4,-1)\\to(___,\\ ___)',
          blanks: ['1', '4'],
          explain: L(
            '$-y=-(-1)=1$ and $x=4$, so the image is $(1,4)$.',
            '$-y=-(-1)=1$ dan $x=4$, jadi bayangannya $(1,4)$.',
          ),
          hint: L(
            'The new $x$ is minus the old $y$ (careful: the old $y$ is already negative).',
            '$x$ yang baru adalah minus $y$ yang lama (hati-hati: $y$ lama sudah negatif).',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L('A rotation by $180^{\\circ}$ about $O$ sends $(a,b)$ to $(-a,-b)$.', 'Rotasi $180^{\\circ}$ terhadap $O$ memetakan $(a,b)$ ke $(-a,-b)$.'),
            L('A dilation with $k=3$ multiplies all lengths by 3.', 'Dilatasi dengan $k=3$ mengalikan semua panjang dengan 3.'),
            L('A rotation changes the distance between two points.', 'Rotasi mengubah jarak antara dua titik.'),
            L('A dilation with $k=3$ multiplies areas by 3.', 'Dilatasi dengan $k=3$ mengalikan luas dengan 3.'),
          ],
          answer: [0, 1],
          explain: L(
            'A rotation is an isometry, so distances stay the same. Areas grow by $k^2=9$, not 3.',
            'Rotasi adalah isometri, jadi jarak tetap sama. Luas bertambah $k^2=9$ kali, bukan 3.',
          ),
          hint: L(
            'Which of the two transformations changes size, and by what factor for lengths and for areas?',
            'Dari kedua transformasi itu mana yang mengubah ukuran, dan dengan faktor berapa untuk panjang dan untuk luas?',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('Turning $(2,5)$ by $90^{\\circ}$ anticlockwise about $O$ gives $(-5,2)$.', 'Memutar $(2,5)$ sebesar $90^{\\circ}$ berlawanan arah jarum jam terhadap $O$ menghasilkan $(-5,2)$.'),
            L('A dilation with $k=\\frac{1}{2}$ makes a shape bigger.', 'Dilatasi dengan $k=\\frac{1}{2}$ membuat bangun lebih besar.'),
            L('A dilation with $k=-2$ puts the image on the other side of the centre.', 'Dilatasi dengan $k=-2$ menaruh bayangan di sisi lain pusat.'),
            L('Rotation by $90^{\\circ}$ anticlockwise sends $(x,y)$ to $(y,-x)$.', 'Rotasi $90^{\\circ}$ berlawanan arah jarum jam memetakan $(x,y)$ ke $(y,-x)$.'),
          ],
          answer: [true, false, true, false],
          explain: L(
            '$(-y,x)=(-5,2)$. A factor between 0 and 1 shrinks. A negative factor flips through the centre. And $(y,-x)$ is the rule for $90^{\\circ}$ **clockwise**.',
            '$(-y,x)=(-5,2)$. Faktor di antara 0 dan 1 memperkecil. Faktor negatif membalik melalui pusat. Dan $(y,-x)$ adalah aturan $90^{\\circ}$ **searah** jarum jam.',
          ),
          hint: L(
            'Test the last rule with a point like $(1,0)$: anticlockwise should send it up to $(0,1)$.',
            'Uji aturan terakhir dengan titik seperti $(1,0)$: berlawanan arah jarum jam seharusnya memindahkannya ke atas, ke $(0,1)$.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'A triangle has area 6 cm$^2$. It is dilated with scale factor 3. What is the area of the image, in cm$^2$?',
            'Sebuah segitiga luasnya 6 cm$^2$. Segitiga itu didilatasi dengan faktor skala 3. Berapa luas bayangannya, dalam cm$^2$?',
          ),
          blanks: [{ answer: 54, after: '\\text{cm}^2' }],
          hints: [
            L('Lengths are multiplied by 3. What happens to an area, which has two dimensions?', 'Panjang dikalikan 3. Apa yang terjadi pada luas, yang berdimensi dua?'),
            L('Area is multiplied by $k^2=3^2=9$.', 'Luas dikalikan $k^2=3^2=9$.'),
            L('$6\\times9$.', '$6\\times9$.'),
          ],
          explain: L(
            '$6\\times3^2=6\\times9=54$ cm$^2$.',
            '$6\\times3^2=6\\times9=54$ cm$^2$.',
          ),
          solution: {
            en: ['\\text{area}\\times k^2=6\\times3^2', '=54'],
            id: ['\\text{luas}\\times k^2=6\\times3^2', '=54'],
          },
        },
      ],
    },
  ],
  project: {
    id: 'tka-sma-m6-s1-p',
    runtime: 'math',
    title: L('Transformations of Points', 'Transformasi Titik'),
    brief: L(
      'Apply translations, reflections, rotations and dilations to points and shapes.',
      'Terapkan translasi, refleksi, rotasi, dan dilatasi pada titik dan bangun.',
    ),
    requirements: [
      L('Use the coordinate rules for each transformation.', 'Memakai aturan koordinat untuk tiap transformasi.'),
      L('Do several transformations in order.', 'Melakukan beberapa transformasi secara berurutan.'),
    ],
    hints: [
      L('Write the rule as $(x,y)\\to(\\ldots)$ before you substitute.', 'Tulis aturannya sebagai $(x,y)\\to(\\ldots)$ sebelum mensubstitusi.'),
      L('For another centre: shift the centre to the origin, transform, shift back.', 'Untuk pusat lain: geser pusat ke titik asal, transformasikan, geser kembali.'),
      L('Areas change by $k^2$, lengths by $k$.', 'Luas berubah $k^2$ kali, panjang $k$ kali.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L('Translate $(-2,5)$ by $\\begin{pmatrix}4\\\\-3\\end{pmatrix}$.', 'Geser $(-2,5)$ dengan $\\begin{pmatrix}4\\\\-3\\end{pmatrix}$.'),
        inline: true,
        blanks: [
          { label: 'x =', answer: 2 },
          { label: 'y =', answer: 2 },
        ],
        solution: ['(-2+4,\\ 5-3)=(2,2)'],
      },
      {
        prompt: L('Reflect $(6,-1)$ in the line $x=2$.', 'Cerminkan $(6,-1)$ pada garis $x=2$.'),
        figure: {
          ...plane(
            [
              { t: 'vline', x: 2, color: 'muted', dashed: true },
              dot([6, -1], 'P', 'result'),
            ],
            { x: [-5, 8], y: [-4, 4] },
          ),
          caption: L('The point P and the mirror line x = 2.', 'Titik P dan garis cermin x = 2.'),
        },
        inline: true,
        blanks: [
          { label: 'x =', answer: -2 },
          { label: 'y =', answer: -1 },
        ],
        solution: ['(2k-x,\\ y)=(2\\cdot2-6,\\ -1)=(-2,-1)'],
      },
      {
        prompt: L(
          'Rotate $(5,2)$ by $90^{\\circ}$ anticlockwise about the centre $(1,1)$.',
          'Putar $(5,2)$ sebesar $90^{\\circ}$ berlawanan arah jarum jam terhadap pusat $(1,1)$.',
        ),
        inline: true,
        blanks: [
          { label: 'x =', answer: 0 },
          { label: 'y =', answer: 5 },
        ],
        solution: ['(5,2)-(1,1)=(4,1)', '(4,1)\\to(-1,4)', '(-1,4)+(1,1)=(0,5)'],
      },
      {
        prompt: L(
          'A rectangle 3 cm by 4 cm is dilated with scale factor 2.5. What is the area of the image, in cm$^2$?',
          'Sebuah persegi panjang 3 cm kali 4 cm didilatasi dengan faktor skala 2,5. Berapa luas bayangannya, dalam cm$^2$?',
        ),
        blanks: [{ answer: 75, after: '\\text{cm}^2' }],
        solution: {
          en: ['12\\times2.5^2=12\\times6.25', '=75'],
          id: ['12\\times2{,}5^2=12\\times6{,}25', '=75'],
        },
      },
      {
        prompt: L(
          'The point $(2,5)$ is reflected in the line $y=x$ and then translated by $\\begin{pmatrix}1\\\\-1\\end{pmatrix}$. Find the final point.',
          'Titik $(2,5)$ dicerminkan pada garis $y=x$ lalu digeser dengan $\\begin{pmatrix}1\\\\-1\\end{pmatrix}$. Tentukan titik akhirnya.',
        ),
        inline: true,
        blanks: [
          { label: 'x =', answer: 6 },
          { label: 'y =', answer: 1 },
        ],
        solution: ['(2,5)\\to(5,2)', '(5+1,\\ 2-1)=(6,1)'],
      },
    ],
  },
}
