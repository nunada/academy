import type { Loc, Module } from '../types'
import type { FigColor, FigItem, Figure } from '../../lib/figure'
import type { Piece, Pt } from './figs'
import {
  circle2d,
  cone2d,
  coneNet,
  cylinder2d,
  cylinderNet,
  ellipsePts,
  fit,
  gridRect,
  line,
  outline,
  prism3d,
  pyramidNet,
  rectPts,
  sectorPts,
  shape,
  solid,
  sphere2d,
  triPrismNet,
  txt,
} from './figs'

/** Module 6 — single transformations on a coordinate grid (reflection, translation,
 *  rotation, dilation), perimeter and area of polygons, circles and combined regions,
 *  and nets and volumes of solids (prism, cylinder, pyramid, cone, sphere). Surface area is
 *  outside the scope. */

const L = (en: string, id: string): Loc => ({ en, id })

/* ------------------------------------------------------------- helpers */

/** A square coordinate plane with the numbers on the axes. */
const plane = (items: FigItem[], span = 6): Figure => ({
  dim: 2,
  xSpan: [-span, span],
  ySpan: [-span, span],
  ticks: true,
  items,
})

/* The transformations, as rules on points. */
const refLineX = (k: number) => (p: Pt): Pt => [2 * k - p[0], p[1]]
const slide = (a: number, b: number) => (p: Pt): Pt => [p[0] + a, p[1] + b]
const rot90 = (p: Pt): Pt => [-p[1], p[0]]
const rot180 = (p: Pt): Pt => [-p[0], -p[1]]
const dilate = (k: number) => (p: Pt): Pt => [k * p[0], k * p[1]]

/** The original (green) and, when given, its image (red), with the corners named on a grid. */
function trans(orig: Pt[], names: string, img?: Pt[], extra: FigItem[] = [], span = 6): Figure {
  const items: FigItem[] = [...extra, { t: 'poly', pts: orig, color: 'a', look: 'solid' }]
  if (img) items.push({ t: 'poly', pts: img, color: 'result', look: 'solid' })
  orig.forEach((p, i) => items.push({ t: 'dot', x: p[0], y: p[1], color: 'a', label: names[i] }))
  img?.forEach((p, i) => items.push({ t: 'dot', x: p[0], y: p[1], color: 'result', label: names[i] + "'" }))
  return plane(items, span)
}

const dashedV = (x: number, color: FigColor = 'c'): FigItem => ({ t: 'vline', x, color, dashed: true })
const dashedH = (y: number, color: FigColor = 'c'): FigItem => ({ t: 'hline', y, color, dashed: true })

/** A named point on the grid. */
const dot = (p: Pt, label: string, color: FigColor = 'a'): FigItem => ({ t: 'dot', x: p[0], y: p[1], color, label })

/** A regular polygon with `n` corners and circumradius `r`, counterclockwise. */
const regular = (n: number, r: number): Pt[] =>
  Array.from({ length: n }, (_, i) => {
    const a = Math.PI / 2 + (2 * Math.PI * i) / n
    return [Number((r * Math.cos(a)).toFixed(4)), Number((r * Math.sin(a)).toFixed(4))] as Pt
  })

/** A ring: an outer and an inner circle with a radius drawn in each. */
function ring(R: number, r: number, outerLabel: string, innerLabel: string): Piece {
  const items: FigItem[] = [
    solid(ellipsePts(0, 0, R, R), 'a'),
    solid(ellipsePts(0, 0, r, r), 'muted'),
    outline(ellipsePts(0, 0, R, R), 'muted'),
    outline(ellipsePts(0, 0, r, r), 'muted'),
    { t: 'dot', x: 0, y: 0, color: 'muted' },
    line([0, 0], [R, 0], 'result', { width: 2.4 }),
    line([0, 0], [0, r], 'b', { width: 2.4 }),
    txt(R * 0.62, -0.05 * R - 0.45, outerLabel, 'md', 'result'),
    txt(0.4, r * 0.55, innerLabel, 'md', 'b', 'start'),
  ]
  return { dim: 2, axes: false, ...fit([[-R, -R], [R, R]], 0.5), items }
}

/** A running track: a rectangle of length `len` and width `2r` with a half circle at each end. */
function stadium(len: number, r: number, lenLabel: string, widthLabel: string): Piece {
  const items: FigItem[] = [
    solid(rectPts(0, -r, len, 2 * r), 'a'),
    solid(sectorPts(0, 0, r, 90, 270), 'c'),
    solid(sectorPts(len, 0, r, -90, 90), 'c'),
    line([0, -r], [len, -r], 'muted', { width: 2.4 }),
    line([0, r], [len, r], 'muted', { width: 2.4 }),
    line([0, -r], [0, r], 'b', { dashed: true }),
    line([len, -r], [len, r], 'b', { dashed: true }),
    txt(len / 2, r + 0.6, lenLabel, 'md', 'muted'),
    txt(len + r + 0.4, 0, widthLabel, 'md', 'b', 'start'),
  ]
  return { dim: 2, axes: false, ...fit([[-r, -r - 0.4], [len + r + 2.4, r + 1]], 0.4), items }
}

/** A window: a rectangle `w` wide and `h` high with a half circle on top. */
function windowFig(w: number, h: number, wLabel: string, hLabel: string): Piece {
  const r = w / 2
  const items: FigItem[] = [
    solid(rectPts(0, 0, w, h), 'a'),
    solid(sectorPts(r, h, r, 0, 180), 'c'),
    line([0, h], [w, h], 'b', { dashed: true }),
    txt(r, -0.55, wLabel, 'md', 'muted'),
    txt(w + 0.35, h / 2, hLabel, 'md', 'muted', 'start'),
  ]
  return { dim: 2, axes: false, ...fit([[-0.3, -1], [w + 2.4, h + r + 0.3]], 0.4), items }
}

/* -------------------------------------------------------------- module */

export const module6: Module = {
  id: 'tka-smp-m6',
  title: L('Transformations, Area and Volume', 'Transformasi, Luas, dan Volume'),
  summary: L(
    'Move shapes on a coordinate grid by reflection, translation, rotation and dilation; find the perimeter and area of polygons, circles and combined regions; and learn the nets and the volumes of prisms, cylinders, pyramids, cones and spheres.',
    'Memindahkan bangun pada bidang koordinat dengan refleksi, translasi, rotasi, dan dilatasi; mencari keliling dan luas segi banyak, lingkaran, dan daerah gabungan; serta mempelajari jaring-jaring dan volume prisma, tabung, limas, kerucut, dan bola.',
  ),
  submodules: [
    /* ============================================ S1: geometric transformations */
    {
      id: 'tka-smp-m6-s1',
      title: L('Geometric Transformations', 'Transformasi Geometri'),
      summary: L(
        'Reflect, slide, turn and resize points and shapes on a coordinate grid, and find the image from the rule or the rule from the image.',
        'Mencerminkan, menggeser, memutar, dan memperbesar atau memperkecil titik dan bangun pada bidang koordinat, serta mencari bayangan dari aturannya atau aturannya dari bayangannya.',
      ),
      lessons: [
        /* ------------------------------------------ S1 L1 reflection and translation */
        {
          id: 'tka-smp-m6-s1-l1',
          title: L('Reflection and Translation', 'Refleksi dan Translasi'),
          goal: L(
            'You can reflect a point or a shape in an axis or a line, slide it by a vector, and find the mirror line or the shift from a before-and-after picture.',
            'Kamu bisa mencerminkan titik atau bangun terhadap sumbu atau garis, menggesernya dengan vektor translasi, serta mencari garis cermin atau pergeserannya dari gambar sebelum dan sesudah.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: A Mirror and a Slide', 'Ayo Amati: Cermin dan Geseran'),
              body: L(
                `A **transformation** moves a shape to a new place by a fixed rule. The shape we start with is the **object**; the shape we get is the **image**. A point $A$ becomes $A'$ (read "A prime").\n\nTwo transformations keep the size and the shape of a figure unchanged:\n\n- **Reflection** (a mirror): the figure is flipped over a **mirror line**. A point and its image are the same distance from the mirror line, on opposite sides.\n- **Translation** (a slide): every point moves the same distance in the same direction. A translation by $(a,b)$ means $a$ units to the right and $b$ units up. A negative number means left or down.\n\nIn the picture, the green triangle is reflected in the dashed gold line $x=1$ and gives the red triangle.`,
                `**Transformasi** memindahkan sebuah bangun ke tempat baru dengan aturan tertentu. Bangun awal disebut **objek**, dan bangun hasilnya disebut **bayangan**. Titik $A$ menjadi $A'$ (dibaca "A aksen").\n\nDua transformasi menjaga ukuran dan bentuk bangun tetap sama:\n\n- **Refleksi** (pencerminan): bangun dibalik terhadap sebuah **garis cermin**. Sebuah titik dan bayangannya berjarak sama dari garis cermin, tetapi berada di sisi yang berlawanan.\n- **Translasi** (pergeseran): setiap titik berpindah sejauh yang sama ke arah yang sama. Translasi $(a,b)$ berarti $a$ satuan ke kanan dan $b$ satuan ke atas. Bilangan negatif berarti ke kiri atau ke bawah.\n\nPada gambar, segitiga hijau dicerminkan terhadap garis putus-putus emas $x=1$ dan menghasilkan segitiga merah.`,
              ),
              figure: {
                ...trans([[2, 1], [5, 1], [2, 3]], 'PQR', [[2, 1], [5, 1], [2, 3]].map((p) => refLineX(1)(p as Pt)), [dashedV(1)]),
                caption: L(
                  'Triangle PQR and its mirror image in the line x = 1. Each point and its image are the same distance from the line.',
                  'Segitiga PQR dan bayangan cerminnya terhadap garis x = 1. Setiap titik dan bayangannya berjarak sama dari garis itu.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Finding the Image', 'Contoh Bertahap: Mencari Bayangan'),
              body: L(
                `Reflect the triangle $A(1,2)$, $B(3,2)$, $C(1,5)$ in the line $x=-1$.\n\n1. Step 1: Find how far each point is from the mirror line. $A$ and $C$ have $x=1$, which is $1-(-1)=2$ units to the right of the line. $B$ has $x=3$, which is $4$ units to the right.\n2. Step 2: The image is the same distance on the other side, so it is that far to the left of $x=-1$. $A'$ and $C'$ have $x=-1-2=-3$, and $B'$ has $x=-1-4=-5$.\n3. Step 3: The $y$-values do not change, because the mirror line is vertical.\n4. Step 4: Write the images: $A'(-3,2)$, $B'(-5,2)$, $C'(-3,5)$.\n\n**Remember:**\n\n| Transformation | Rule | Point $(3,2)$ becomes |\n|---|---|---|\n| Reflection in the $x$-axis | $(x,y)\\rightarrow(x,-y)$ | $(3,-2)$ |\n| Reflection in the $y$-axis | $(x,y)\\rightarrow(-x,y)$ | $(-3,2)$ |\n| Reflection in the line $x=k$ | $(x,y)\\rightarrow(2k-x,y)$ | with $k=1$: $(-1,2)$ |\n| Reflection in the line $y=k$ | $(x,y)\\rightarrow(x,2k-y)$ | with $k=1$: $(3,0)$ |\n| Translation by $(a,b)$ | $(x,y)\\rightarrow(x+a,y+b)$ | with $(a,b)=(2,-1)$: $(5,1)$ |`,
                `Cerminkan segitiga $A(1,2)$, $B(3,2)$, $C(1,5)$ terhadap garis $x=-1$.\n\n1. Langkah 1: Cari jarak setiap titik ke garis cermin. $A$ dan $C$ punya $x=1$, yaitu $1-(-1)=2$ satuan di sebelah kanan garis. $B$ punya $x=3$, yaitu $4$ satuan di sebelah kanan.\n2. Langkah 2: Bayangan berjarak sama di sisi seberang, jadi berada sejauh itu di sebelah kiri $x=-1$. $A'$ dan $C'$ punya $x=-1-2=-3$, dan $B'$ punya $x=-1-4=-5$.\n3. Langkah 3: Nilai $y$ tidak berubah, karena garis cerminnya tegak.\n4. Langkah 4: Tulis bayangannya: $A'(-3,2)$, $B'(-5,2)$, $C'(-3,5)$.\n\n**Ingat:**\n\n| Transformasi | Aturan | Titik $(3,2)$ menjadi |\n|---|---|---|\n| Refleksi terhadap sumbu $x$ | $(x,y)\\rightarrow(x,-y)$ | $(3,-2)$ |\n| Refleksi terhadap sumbu $y$ | $(x,y)\\rightarrow(-x,y)$ | $(-3,2)$ |\n| Refleksi terhadap garis $x=k$ | $(x,y)\\rightarrow(2k-x,y)$ | dengan $k=1$: $(-1,2)$ |\n| Refleksi terhadap garis $y=k$ | $(x,y)\\rightarrow(x,2k-y)$ | dengan $k=1$: $(3,0)$ |\n| Translasi $(a,b)$ | $(x,y)\\rightarrow(x+a,y+b)$ | dengan $(a,b)=(2,-1)$: $(5,1)$ |`,
              ),
              figure: {
                ...trans([[1, 2], [3, 2], [1, 5]], 'ABC', [[1, 2], [3, 2], [1, 5]].map((p) => refLineX(-1)(p as Pt)), [dashedV(-1)]),
                caption: L(
                  'The green triangle ABC and its image in the dashed gold line x = -1.',
                  'Segitiga hijau ABC dan bayangannya terhadap garis putus-putus emas x = -1.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Axes and Signs', 'Awas, Jebakan!: Sumbu dan Tanda'),
              body: L(
                `Reflections and translations only move a figure. They never change its size, its shape or the length of its sides.\n\n| Wrong | Right |\n|---|---|\n| Reflecting $(4,-3)$ in the $x$-axis gives $(-4,-3)$ | The $x$-axis is the horizontal axis, so only the $y$-value changes sign: $(4,3)$. The other result belongs to the $y$-axis |\n| Translation by $(-3,2)$ moves a point 3 to the right and 2 down | A negative first number means left and a positive second number means up: 3 to the left and 2 up |\n| Reflecting $(5,1)$ in the line $x=3$ gives $(-5,1)$ | $(5,1)$ is 2 to the right of the line, so the image is 2 to the left of it: $(1,1)$ |`,
                `Refleksi dan translasi hanya memindahkan bangun. Keduanya tidak mengubah ukuran, bentuk, maupun panjang sisinya.\n\n| Salah | Benar |\n|---|---|\n| Refleksi $(4,-3)$ terhadap sumbu $x$ menghasilkan $(-4,-3)$ | Sumbu $x$ adalah sumbu mendatar, jadi hanya nilai $y$ yang berganti tanda: $(4,3)$. Hasil yang lain milik sumbu $y$ |\n| Translasi $(-3,2)$ menggeser titik 3 ke kanan dan 2 ke bawah | Bilangan pertama yang negatif berarti ke kiri dan bilangan kedua yang positif berarti ke atas: 3 ke kiri dan 2 ke atas |\n| Refleksi $(5,1)$ terhadap garis $x=3$ menghasilkan $(-5,1)$ | $(5,1)$ berada 2 di sebelah kanan garis, jadi bayangannya 2 di sebelah kiri garis: $(1,1)$ |`,
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The point $P(-3,4)$ is reflected in the $x$-axis. What is the image of $P$?',
                'Titik $P(-3,4)$ dicerminkan terhadap sumbu $x$. Berapa bayangan $P$?',
              ),
              figure: {
                ...plane([dot([-3, 4], 'P')]),
                caption: L('The point P on the coordinate grid.', 'Titik P pada bidang koordinat.'),
              },
              options: [
                L('$(-3,-4)$', '$(-3,-4)$'),
                L('$(3,4)$', '$(3,4)$'),
                L('$(3,-4)$', '$(3,-4)$'),
                L('$(-4,3)$', '$(-4,3)$'),
              ],
              answer: 0,
              explain: L(
                'The $x$-axis is the mirror, so the point goes to the other side of it and only the $y$-value changes sign. $(3,4)$ is the reflection in the $y$-axis and $(3,-4)$ changes both signs.',
                'Sumbu $x$ adalah cerminnya, jadi titik pindah ke sisi seberang dan hanya nilai $y$ yang berganti tanda. $(3,4)$ adalah refleksi terhadap sumbu $y$ dan $(3,-4)$ mengubah kedua tanda.',
              ),
              hint: L(
                'The $x$-axis runs left to right. P is above it, so the image must be below it. Which coordinate says "above" or "below"?',
                'Sumbu $x$ membentang dari kiri ke kanan. P ada di atasnya, jadi bayangannya harus di bawahnya. Koordinat mana yang menyatakan "atas" atau "bawah"?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: reflect $A(5,2)$ in the line $x=3$. Use the rule $x\\rightarrow2k-x$ with $k=3$.',
                'Coba bersama: cerminkan $A(5,2)$ terhadap garis $x=3$. Pakai aturan $x\\rightarrow2k-x$ dengan $k=3$.',
              ),
              template: `A'(2\\times3-5,\\ 2)=A'(___,\\ ___)`,
              blanks: ['1', '2'],
              explain: L(
                `$2\\times3-5=1$, and the $y$-value stays 2. So $A'(1,2)$. Check: $A$ is 2 to the right of the line $x=3$, and $A'$ is 2 to the left of it.`,
                `$2\\times3-5=1$, dan nilai $y$ tetap 2. Jadi $A'(1,2)$. Cek: $A$ berada 2 di sebelah kanan garis $x=3$, dan $A'$ berada 2 di sebelah kirinya.`,
              ),
              hint: L(
                'Work out $2\\times3$ first, then subtract 5. The mirror line is vertical, so the $y$-value does not change.',
                'Hitung dulu $2\\times3$, lalu kurangi 5. Garis cermin tegak, jadi nilai $y$ tidak berubah.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The green triangle $ABC$ is translated onto the red triangle $A\'B\'C\'$. Which translation was used?',
                'Segitiga hijau $ABC$ digeser menjadi segitiga merah $A\'B\'C\'$. Translasi manakah yang dipakai?',
              ),
              figure: {
                ...trans([[-4, 1], [-1, 1], [-4, 3]], 'ABC', [[-4, 1], [-1, 1], [-4, 3]].map((p) => slide(5, -3)(p as Pt))),
                caption: L('Compare A with A\' to see how far every point moved.', 'Bandingkan A dengan A\' untuk melihat seberapa jauh setiap titik bergeser.'),
              },
              options: [
                L('$(5,-3)$', '$(5,-3)$'),
                L('$(-5,3)$', '$(-5,3)$'),
                L('$(5,3)$', '$(5,3)$'),
                L('$(3,-5)$', '$(3,-5)$'),
              ],
              answer: 0,
              explain: L(
                'A goes from $(-4,1)$ to $(1,-2)$: that is 5 to the right ($-4+5=1$) and 3 down ($1-3=-2$). So the translation is $(5,-3)$. The other options have a wrong sign or have the two numbers swapped.',
                'A berpindah dari $(-4,1)$ ke $(1,-2)$: itu 5 ke kanan ($-4+5=1$) dan 3 ke bawah ($1-3=-2$). Jadi translasinya $(5,-3)$. Pilihan lain salah tanda atau kedua bilangannya tertukar.',
              ),
              hint: L(
                'Follow one point, for example A to A\'. How many units did it move across, and how many up or down? Right and up are positive.',
                'Ikuti satu titik, misalnya A ke A\'. Berapa satuan bergeser mendatar, dan berapa naik atau turun? Ke kanan dan ke atas bernilai positif.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan apakah setiap pernyataan Benar atau Salah.'),
              statements: [
                L('A reflection and a translation both keep the size and the shape of a figure.', 'Refleksi dan translasi sama-sama menjaga ukuran dan bentuk bangun.'),
                L('Reflecting the point $(2,5)$ in the $x$-axis gives $(-2,5)$.', 'Refleksi titik $(2,5)$ terhadap sumbu $x$ menghasilkan $(-2,5)$.'),
                L('A translation by $(-3,2)$ moves every point 3 units left and 2 units up.', 'Translasi $(-3,2)$ menggeser setiap titik 3 satuan ke kiri dan 2 satuan ke atas.'),
                L('Reflecting the point $(4,1)$ in the line $x=2$ gives $(-4,1)$.', 'Refleksi titik $(4,1)$ terhadap garis $x=2$ menghasilkan $(-4,1)$.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                'Reflection and translation only move a figure. Reflecting in the $x$-axis changes the sign of $y$, giving $(2,-5)$. Reflecting in $x=2$ gives $2\\times2-4=0$, so $(0,1)$; $(-4,1)$ would be the reflection in the $y$-axis.',
                'Refleksi dan translasi hanya memindahkan bangun. Refleksi terhadap sumbu $x$ mengubah tanda $y$, menghasilkan $(2,-5)$. Refleksi terhadap $x=2$ menghasilkan $2\\times2-4=0$, jadi $(0,1)$; $(-4,1)$ adalah refleksi terhadap sumbu $y$.',
              ),
              hint: L(
                'For each reflection, decide which coordinate changes. For a line $x=k$, use the distance from the line.',
                'Untuk setiap refleksi, tentukan koordinat mana yang berubah. Untuk garis $x=k$, pakai jarak dari garis itu.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'The point $P(3,-2)$ is moved by a transformation. Choose the TWO correct statements about its image.',
                'Titik $P(3,-2)$ dipindahkan oleh sebuah transformasi. Pilih DUA pernyataan yang benar tentang bayangannya.',
              ),
              options: [
                L('Reflection in the $x$-axis gives $(3,2)$.', 'Refleksi terhadap sumbu $x$ menghasilkan $(3,2)$.'),
                L('Translation by $(-1,4)$ gives $(2,2)$.', 'Translasi $(-1,4)$ menghasilkan $(2,2)$.'),
                L('Reflection in the $y$-axis gives $(3,2)$.', 'Refleksi terhadap sumbu $y$ menghasilkan $(3,2)$.'),
                L('Translation by $(4,-1)$ gives $(-1,-3)$.', 'Translasi $(4,-1)$ menghasilkan $(-1,-3)$.'),
              ],
              answer: [0, 1],
              explain: L(
                'In the $x$-axis only $y$ changes sign: $(3,2)$. Translation adds the numbers: $(3-1,-2+4)=(2,2)$. The reflection in the $y$-axis is $(-3,-2)$, and translation by $(4,-1)$ gives $(7,-3)$.',
                'Pada sumbu $x$ hanya $y$ yang berganti tanda: $(3,2)$. Translasi menjumlahkan bilangannya: $(3-1,-2+4)=(2,2)$. Refleksi terhadap sumbu $y$ adalah $(-3,-2)$, dan translasi $(4,-1)$ menghasilkan $(7,-3)$.',
              ),
              hint: L(
                'Work out each image yourself. For a translation add $a$ to $x$ and $b$ to $y$; for a reflection ask which coordinate changes sign.',
                'Hitung sendiri setiap bayangannya. Untuk translasi, tambahkan $a$ ke $x$ dan $b$ ke $y$; untuk refleksi, tanyakan koordinat mana yang berganti tanda.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                `The point $M(-3,4)$ is reflected in the dashed line $y=1$. Find the coordinates of the image $M'$.`,
                `Titik $M(-3,4)$ dicerminkan terhadap garis putus-putus $y=1$. Tentukan koordinat bayangan $M'$.`,
              ),
              figure: {
                ...plane([dashedH(1), dot([-3, 4], 'M')]),
                caption: L('The point M and the mirror line y = 1.', 'Titik M dan garis cermin y = 1.'),
              },
              inline: true,
              blanks: [
                { label: 'x =', answer: -3 },
                { label: 'y =', answer: -2 },
              ],
              hints: [
                L(
                  'The mirror line is horizontal. Which coordinate of M is going to change, and which stays the same?',
                  'Garis cermin mendatar. Koordinat M yang mana akan berubah, dan mana yang tetap?',
                ),
                L(
                  'Find how far M is above the line $y=1$. The image is the same distance below the line.',
                  'Cari seberapa jauh M di atas garis $y=1$. Bayangannya berjarak sama di bawah garis.',
                ),
                L(
                  'M is $4-1=3$ units above the line. Go 3 units below $y=1$ to find the new $y$-value, and keep $x$ as it is.',
                  'M berada $4-1=3$ satuan di atas garis. Turun 3 satuan di bawah $y=1$ untuk mendapat nilai $y$ yang baru, dan biarkan $x$ seperti semula.',
                ),
              ],
              explain: L(
                `$M$ is $4-1=3$ units above the line $y=1$, so $M'$ is 3 units below it: $y=1-3=-2$. The mirror line is horizontal, so $x$ stays $-3$. The image is $M'(-3,-2)$.`,
                `$M$ berada $4-1=3$ satuan di atas garis $y=1$, jadi $M'$ berada 3 satuan di bawahnya: $y=1-3=-2$. Garis cermin mendatar, jadi $x$ tetap $-3$. Bayangannya $M'(-3,-2)$.`,
              ),
              solution: ['4-1=3', 'y\'=1-3=-2', '2\\times1-4=-2', 'M\'(-3,-2)'],
            },
          ],
        },
        /* ------------------------------------------ S1 L2 rotation and dilation */
        {
          id: 'tka-smp-m6-s1-l2',
          title: L('Rotation and Dilation', 'Rotasi dan Dilatasi'),
          goal: L(
            'You can turn a shape about a point, enlarge or shrink it from the origin, and tell which transformation maps one figure onto another.',
            'Kamu bisa memutar bangun terhadap suatu titik, memperbesar atau memperkecilnya dari titik asal, serta menentukan transformasi mana yang memetakan satu bangun ke bangun lain.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Turning a Figure', 'Ayo Amati: Memutar Bangun'),
              body: L(
                `A **rotation** turns a figure about a fixed point, the **center**, through an angle. A turn **counterclockwise** (against the hands of a clock) counts as positive. A rotation keeps the size and the shape of the figure.\n\nFor a center at the origin $O$, the three turns of $90^\\circ$, $180^\\circ$ and $270^\\circ$ counterclockwise have simple rules:\n\n| Rotation about $O$ | Rule | Point $(3,1)$ becomes |\n|---|---|---|\n| $90^\\circ$ counterclockwise | $(x,y)\\rightarrow(-y,x)$ | $(-1,3)$ |\n| $180^\\circ$ | $(x,y)\\rightarrow(-x,-y)$ | $(-3,-1)$ |\n| $270^\\circ$ counterclockwise | $(x,y)\\rightarrow(y,-x)$ | $(1,-3)$ |\n\nA turn of $90^\\circ$ clockwise is the same as a turn of $270^\\circ$ counterclockwise. In the picture the green triangle is turned $90^\\circ$ counterclockwise about $O$.`,
                `**Rotasi** memutar sebuah bangun terhadap titik tetap, yaitu **pusat rotasi**, sebesar suatu sudut. Putaran **berlawanan arah jarum jam** dihitung positif. Rotasi menjaga ukuran dan bentuk bangun.\n\nUntuk pusat di titik asal $O$, tiga putaran $90^\\circ$, $180^\\circ$, dan $270^\\circ$ berlawanan arah jarum jam punya aturan sederhana:\n\n| Rotasi terhadap $O$ | Aturan | Titik $(3,1)$ menjadi |\n|---|---|---|\n| $90^\\circ$ berlawanan arah jarum jam | $(x,y)\\rightarrow(-y,x)$ | $(-1,3)$ |\n| $180^\\circ$ | $(x,y)\\rightarrow(-x,-y)$ | $(-3,-1)$ |\n| $270^\\circ$ berlawanan arah jarum jam | $(x,y)\\rightarrow(y,-x)$ | $(1,-3)$ |\n\nPutaran $90^\\circ$ searah jarum jam sama dengan putaran $270^\\circ$ berlawanan arah jarum jam. Pada gambar, segitiga hijau diputar $90^\\circ$ berlawanan arah jarum jam terhadap $O$.`,
              ),
              figure: {
                ...trans([[1, 1], [4, 1], [1, 3]], 'ABC', [[1, 1], [4, 1], [1, 3]].map((p) => rot90(p as Pt))),
                caption: L(
                  'Triangle ABC turned 90 degrees counterclockwise about the origin.',
                  'Segitiga ABC diputar 90 derajat berlawanan arah jarum jam terhadap titik asal.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Turning About Another Point', 'Contoh Bertahap: Memutar terhadap Titik Lain'),
              body: L(
                `Rotate the point $A(4,2)$ by $90^\\circ$ counterclockwise about the center $P(1,1)$. No protractor is needed: count steps on the grid.\n\n1. Step 1: Start at the center. To reach $A$ you go 3 steps right and 1 step up, so the steps are $(3,1)$.\n2. Step 2: Turn the steps by $90^\\circ$ counterclockwise: "right" becomes "up" and "up" becomes "left". So 3 right becomes 3 up, and 1 up becomes 1 left. The new steps are $(-1,3)$. This is the rule $(x,y)\\rightarrow(-y,x)$ applied to the steps.\n3. Step 3: Start at the center again and take the new steps: $(1-1,\\ 1+3)=(0,4)$.\n4. Step 4: The image is $A'(0,4)$. Check: $PA'$ and $PA$ have the same length and make a right angle.\n\n**Remember:**\n\n- Subtract the center to get the steps from the center to the point.\n- Turn the steps with the rule for the origin.\n- Add the center back.\n- For a $180^\\circ$ turn the image is on the opposite side of the center at the same distance, so $A'=2P-A$.`,
                `Putar titik $A(4,2)$ sebesar $90^\\circ$ berlawanan arah jarum jam terhadap pusat $P(1,1)$. Busur derajat tidak diperlukan: hitung langkah pada kisi.\n\n1. Langkah 1: Mulai dari pusat. Untuk sampai ke $A$ kamu melangkah 3 ke kanan dan 1 ke atas, jadi langkahnya $(3,1)$.\n2. Langkah 2: Putar langkah itu $90^\\circ$ berlawanan arah jarum jam: "kanan" menjadi "atas" dan "atas" menjadi "kiri". Jadi 3 ke kanan menjadi 3 ke atas, dan 1 ke atas menjadi 1 ke kiri. Langkah barunya $(-1,3)$. Ini adalah aturan $(x,y)\\rightarrow(-y,x)$ yang dipakai pada langkahnya.\n3. Langkah 3: Mulai lagi dari pusat dan ambil langkah baru itu: $(1-1,\\ 1+3)=(0,4)$.\n4. Langkah 4: Bayangannya adalah $A'(0,4)$. Cek: $PA'$ dan $PA$ sama panjang dan membentuk sudut siku-siku.\n\n**Ingat:**\n\n- Kurangkan pusat untuk mendapat langkah dari pusat ke titik.\n- Putar langkah itu dengan aturan untuk titik asal.\n- Tambahkan kembali pusatnya.\n- Untuk putaran $180^\\circ$ bayangan berada di seberang pusat pada jarak yang sama, jadi $A'=2P-A$.`,
              ),
              figure: {
                ...plane([
                  { t: 'seg', from: [1, 1], to: [4, 2], color: 'a', width: 2.4 },
                  { t: 'seg', from: [1, 1], to: [0, 4], color: 'result', width: 2.4 },
                  { t: 'right', at: [1, 1], from: [4, 2], to: [0, 4] },
                  dot([1, 1], 'P', 'b'),
                  dot([4, 2], 'A', 'a'),
                  dot([0, 4], "A'", 'result'),
                ]),
                caption: L(
                  'A turns 90 degrees counterclockwise about P: the green segment PA becomes the red segment PA\'.',
                  'A berputar 90 derajat berlawanan arah jarum jam terhadap P: ruas hijau PA menjadi ruas merah PA\'.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: Dilation, and Slips to Avoid', 'Contoh Bertahap: Dilatasi dan Kesalahan yang Perlu Dihindari'),
              body: L(
                `A **dilation** with the origin as center and **scale factor** $k$ multiplies both coordinates by $k$: $(x,y)\\rightarrow(kx,ky)$. Enlarge the triangle $A(1,1)$, $B(2,1)$, $C(1,2)$ with $k=2$.\n\n1. Step 1: Multiply each coordinate by 2.\n2. Step 2: $A(1,1)\\rightarrow A'(2,2)$, $B(2,1)\\rightarrow B'(4,2)$, $C(1,2)\\rightarrow C'(2,4)$.\n3. Step 3: Check. $AB=1$ and $A'B'=2$, so every length is multiplied by 2. The angles stay the same, so the image is **similar** to the original, but it is not congruent.\n\n| Scale factor | What happens |\n|---|---|\n| $k>1$ | the figure is enlarged and moves farther from $O$ |\n| $k=1$ | the figure stays the same |\n| $0<k<1$ | the figure is shrunk and moves closer to $O$ |\n\nCommon slips:\n\n| Wrong | Right |\n|---|---|\n| With $k=3$: $(2,1)\\rightarrow(5,4)$, adding 3 | Multiply: $(2,1)\\rightarrow(6,3)$ |\n| $90^\\circ$ counterclockwise: $(x,y)\\rightarrow(y,-x)$ | That is $270^\\circ$ counterclockwise. For $90^\\circ$ use $(-y,x)$ |\n| Using the rule for the origin when the center is another point | Subtract the center, turn the steps, then add the center back |`,
                `**Dilatasi** dengan pusat di titik asal dan **faktor skala** $k$ mengalikan kedua koordinat dengan $k$: $(x,y)\\rightarrow(kx,ky)$. Perbesar segitiga $A(1,1)$, $B(2,1)$, $C(1,2)$ dengan $k=2$.\n\n1. Langkah 1: Kalikan setiap koordinat dengan 2.\n2. Langkah 2: $A(1,1)\\rightarrow A'(2,2)$, $B(2,1)\\rightarrow B'(4,2)$, $C(1,2)\\rightarrow C'(2,4)$.\n3. Langkah 3: Cek. $AB=1$ dan $A'B'=2$, jadi setiap panjang dikalikan 2. Sudut-sudutnya tetap, jadi bayangannya **sebangun** dengan aslinya, tetapi tidak kongruen.\n\n| Faktor skala | Yang terjadi |\n|---|---|\n| $k>1$ | bangun diperbesar dan menjauh dari $O$ |\n| $k=1$ | bangun tetap sama |\n| $0<k<1$ | bangun diperkecil dan mendekat ke $O$ |\n\nKesalahan yang sering terjadi:\n\n| Salah | Benar |\n|---|---|\n| Dengan $k=3$: $(2,1)\\rightarrow(5,4)$, karena menambah 3 | Kalikan: $(2,1)\\rightarrow(6,3)$ |\n| $90^\\circ$ berlawanan arah jarum jam: $(x,y)\\rightarrow(y,-x)$ | Itu $270^\\circ$ berlawanan arah jarum jam. Untuk $90^\\circ$ pakai $(-y,x)$ |\n| Memakai aturan titik asal padahal pusatnya titik lain | Kurangkan pusat, putar langkahnya, lalu tambahkan kembali pusatnya |`,
              ),
              figure: {
                ...trans(
                  [[1, 1], [2, 1], [1, 2]],
                  'ABC',
                  [[1, 1], [2, 1], [1, 2]].map((p) => dilate(2)(p as Pt)),
                  [
                    { t: 'seg', from: [0, 0], to: [2, 2], color: 'muted', dashed: true },
                    { t: 'seg', from: [0, 0], to: [4, 2], color: 'muted', dashed: true },
                    { t: 'seg', from: [0, 0], to: [2, 4], color: 'muted', dashed: true },
                  ],
                ),
                caption: L(
                  'Triangle ABC is enlarged with center O and scale factor 2. Each image point lies on the dashed ray from O through the original point.',
                  'Segitiga ABC diperbesar dengan pusat O dan faktor skala 2. Setiap titik bayangan terletak pada sinar putus-putus dari O melalui titik aslinya.',
                ),
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Which transformation maps the green triangle onto the red triangle?',
                'Transformasi manakah yang memetakan segitiga hijau ke segitiga merah?',
              ),
              figure: {
                ...trans([[2, 1], [5, 1], [2, 3]], 'ABC', [[2, 1], [5, 1], [2, 3]].map((p) => rot180(p as Pt))),
                caption: L('Follow the point A to A\'.', 'Ikuti titik A ke A\'.'),
              },
              options: [
                L('A rotation of $180^\\circ$ about $O$', 'Rotasi $180^\\circ$ terhadap $O$'),
                L('A reflection in the $x$-axis', 'Refleksi terhadap sumbu $x$'),
                L('A reflection in the $y$-axis', 'Refleksi terhadap sumbu $y$'),
                L('A rotation of $90^\\circ$ counterclockwise about $O$', 'Rotasi $90^\\circ$ berlawanan arah jarum jam terhadap $O$'),
              ],
              answer: 0,
              explain: L(
                'A goes from $(2,1)$ to $(-2,-1)$: both signs change, which is the rule of a $180^\\circ$ turn. A reflection in one axis changes only one sign, and a $90^\\circ$ turn would give $(-1,2)$.',
                'A berpindah dari $(2,1)$ ke $(-2,-1)$: kedua tanda berubah, itulah aturan putaran $180^\\circ$. Refleksi terhadap satu sumbu hanya mengubah satu tanda, dan putaran $90^\\circ$ akan menghasilkan $(-1,2)$.',
              ),
              hint: L(
                'Read the coordinates of A and of A\'. Which signs changed, and do the numbers keep their places?',
                'Baca koordinat A dan A\'. Tanda mana yang berubah, dan apakah bilangannya tetap pada tempatnya?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: enlarge $A(2,3)$ with center $O$ and scale factor $3$.',
                'Coba bersama: perbesar $A(2,3)$ dengan pusat $O$ dan faktor skala $3$.',
              ),
              template: `(2,\\ 3)\\rightarrow(3\\times2,\\ 3\\times3)=(___,\\ ___)`,
              blanks: ['6', '9'],
              explain: L(
                `Multiply each coordinate by 3: $3\\times2=6$ and $3\\times3=9$. So $A'(6,9)$, three times as far from $O$.`,
                `Kalikan setiap koordinat dengan 3: $3\\times2=6$ dan $3\\times3=9$. Jadi $A'(6,9)$, tiga kali lebih jauh dari $O$.`,
              ),
              hint: L(
                'A dilation multiplies. Do not add 3 to the coordinates.',
                'Dilatasi itu mengalikan. Jangan menambahkan 3 pada koordinatnya.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'The green triangle is mapped onto the red triangle. Choose the TWO correct statements.',
                'Segitiga hijau dipetakan ke segitiga merah. Pilih DUA pernyataan yang benar.',
              ),
              figure: {
                ...trans([[2, 2], [6, 2], [2, 4]], 'ABC', [[2, 2], [6, 2], [2, 4]].map((p) => dilate(0.5)(p as Pt)), [], 7),
                caption: L('The red triangle is closer to O and smaller.', 'Segitiga merah lebih dekat ke O dan lebih kecil.'),
              },
              options: [
                L('It is a dilation with center $O$ and scale factor $\\frac{1}{2}$.', 'Itu dilatasi dengan pusat $O$ dan faktor skala $\\frac{1}{2}$.'),
                L('Every side of the red triangle is half as long as the matching side of the green triangle.', 'Setiap sisi segitiga merah separuh panjang sisi yang bersesuaian pada segitiga hijau.'),
                L('The red triangle is congruent to the green triangle.', 'Segitiga merah kongruen dengan segitiga hijau.'),
                L('It is a translation by $(-1,-1)$.', 'Itu translasi $(-1,-1)$.'),
              ],
              answer: [0, 1],
              explain: L(
                'Every coordinate of the green triangle is halved: $(2,2)\\rightarrow(1,1)$, $(6,2)\\rightarrow(3,1)$, $(2,4)\\rightarrow(1,2)$. So the sides are halved too, and the triangles are similar, not congruent. A translation by $(-1,-1)$ would send $(6,2)$ to $(5,1)$.',
                'Setiap koordinat segitiga hijau dibagi dua: $(2,2)\\rightarrow(1,1)$, $(6,2)\\rightarrow(3,1)$, $(2,4)\\rightarrow(1,2)$. Jadi sisi-sisinya juga menjadi separuh, dan segitiganya sebangun, bukan kongruen. Translasi $(-1,-1)$ akan memindahkan $(6,2)$ ke $(5,1)$.',
              ),
              hint: L(
                'Compare the coordinates of each green corner with the matching red corner. Is one number added, or is every number multiplied?',
                'Bandingkan koordinat setiap titik sudut hijau dengan titik sudut merah yang bersesuaian. Apakah satu bilangan ditambahkan, atau setiap bilangan dikalikan?',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan apakah setiap pernyataan Benar atau Salah.'),
              statements: [
                L('Rotating $(3,1)$ by $90^\\circ$ counterclockwise about $O$ gives $(-1,3)$.', 'Memutar $(3,1)$ sebesar $90^\\circ$ berlawanan arah jarum jam terhadap $O$ menghasilkan $(-1,3)$.'),
                L('Rotating $(2,5)$ by $270^\\circ$ counterclockwise about $O$ gives $(-5,2)$.', 'Memutar $(2,5)$ sebesar $270^\\circ$ berlawanan arah jarum jam terhadap $O$ menghasilkan $(-5,2)$.'),
                L('A dilation with scale factor $\\frac{1}{2}$ gives a smaller figure that is similar to the original.', 'Dilatasi dengan faktor skala $\\frac{1}{2}$ menghasilkan bangun yang lebih kecil dan sebangun dengan aslinya.'),
                L('Under a dilation with scale factor 3, a side of length 4 becomes a side of length 7.', 'Pada dilatasi dengan faktor skala 3, sisi sepanjang 4 menjadi sisi sepanjang 7.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                'The $90^\\circ$ rule $(-y,x)$ gives $(-1,3)$. The $270^\\circ$ rule $(y,-x)$ gives $(5,-2)$, not $(-5,2)$. Lengths are multiplied by the scale factor: $4\\times3=12$, not $4+3=7$.',
                'Aturan $90^\\circ$ yaitu $(-y,x)$ menghasilkan $(-1,3)$. Aturan $270^\\circ$ yaitu $(y,-x)$ menghasilkan $(5,-2)$, bukan $(-5,2)$. Panjang dikalikan faktor skala: $4\\times3=12$, bukan $4+3=7$.',
              ),
              hint: L(
                'Apply the rule for each turn to the point, and remember that lengths are multiplied by the scale factor, not added to it.',
                'Terapkan aturan setiap putaran pada titiknya, dan ingat bahwa panjang dikalikan dengan faktor skala, bukan ditambah.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                `Hasan enlarged triangle $PQR$ with center $O$ and scale factor $3$. The image of $P$ is $P'(-6,9)$. Find the coordinates of $P$.`,
                `Hasan memperbesar segitiga $PQR$ dengan pusat $O$ dan faktor skala $3$. Bayangan $P$ adalah $P'(-6,9)$. Tentukan koordinat $P$.`,
              ),
              inline: true,
              blanks: [
                { label: 'x =', answer: -2 },
                { label: 'y =', answer: 3 },
              ],
              hints: [
                L(
                  'The image came from multiplying the coordinates of $P$ by 3. Which operation undoes a multiplication?',
                  'Bayangan diperoleh dengan mengalikan koordinat $P$ dengan 3. Operasi apa yang membatalkan perkalian?',
                ),
                L(
                  'Divide each coordinate of $P\'$ by the scale factor 3.',
                  'Bagi setiap koordinat $P\'$ dengan faktor skala 3.',
                ),
                L(
                  'Work out $-6\\div3$ for the $x$-value and $9\\div3$ for the $y$-value. Check by multiplying back.',
                  'Hitung $-6\\div3$ untuk nilai $x$ dan $9\\div3$ untuk nilai $y$. Cek dengan mengalikan kembali.',
                ),
              ],
              explain: L(
                `Going back from the image to the original divides by the scale factor: $-6\\div3=-2$ and $9\\div3=3$. So $P(-2,3)$. Check: $3\\times(-2)=-6$ and $3\\times3=9$.`,
                `Kembali dari bayangan ke aslinya berarti membagi dengan faktor skala: $-6\\div3=-2$ dan $9\\div3=3$. Jadi $P(-2,3)$. Cek: $3\\times(-2)=-6$ dan $3\\times3=9$.`,
              ),
              solution: ['x\\cdot3=-6 \\Rightarrow x=-6\\div3=-2', 'y\\cdot3=9 \\Rightarrow y=9\\div3=3', 'P(-2,3)'],
            },
          ],
        },
      ],
      project: {
        id: 'tka-smp-m6-s1-p',
        runtime: 'math',
        title: L('Moving Shapes on the Grid', 'Memindahkan Bangun pada Kisi'),
        brief: L(
          'Reflect a point, read a translation from a picture, turn a point about the origin, and find a mirror line.',
          'Mencerminkan titik, membaca translasi dari gambar, memutar titik terhadap titik asal, dan mencari garis cermin.',
        ),
        requirements: [
          L('Find the image of a point under a reflection, a translation or a rotation.', 'Mencari bayangan sebuah titik pada refleksi, translasi, atau rotasi.'),
          L('Find the shift or the mirror line from a before-and-after picture.', 'Mencari pergeseran atau garis cermin dari gambar sebelum dan sesudah.'),
        ],
        hints: [
          L('For a reflection in an axis, decide which coordinate changes sign. For a translation, add the shift to each coordinate.', 'Untuk refleksi terhadap sumbu, tentukan koordinat mana yang berganti tanda. Untuk translasi, tambahkan pergeserannya pada setiap koordinat.'),
          L('To find a translation, subtract the coordinates of the original point from those of its image.', 'Untuk mencari translasi, kurangkan koordinat titik asli dari koordinat bayangannya.'),
          L('A point and its mirror image are the same distance from the mirror line, so the mirror line is halfway between them.', 'Sebuah titik dan bayangan cerminnya berjarak sama dari garis cermin, jadi garis cermin berada di tengah-tengah keduanya.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L(
              `The point $Q(5,-2)$ is reflected in the $y$-axis. Find the coordinates of $Q'$.`,
              `Titik $Q(5,-2)$ dicerminkan terhadap sumbu $y$. Tentukan koordinat $Q'$.`,
            ),
            figure: {
              ...plane([dot([5, -2], 'Q')]),
              caption: L('The point Q on the grid.', 'Titik Q pada kisi.'),
            },
            inline: true,
            blanks: [
              { label: 'x =', answer: -5 },
              { label: 'y =', answer: -2 },
            ],
            solution: ['(x,y)\\rightarrow(-x,y)', '(5,-2)\\rightarrow(-5,-2)', 'Q\'(-5,-2)'],
          },
          {
            prompt: L(
              'The green triangle is translated onto the red triangle. Find the translation $(a,b)$.',
              'Segitiga hijau digeser menjadi segitiga merah. Tentukan translasi $(a,b)$.',
            ),
            figure: {
              ...trans([[-2, 1], [0, 1], [-2, 3]], 'ABC', [[-2, 1], [0, 1], [-2, 3]].map((p) => slide(5, -3)(p as Pt))),
              caption: L('Compare A with A\'.', 'Bandingkan A dengan A\'.'),
            },
            inline: true,
            blanks: [
              { label: 'a =', answer: 5 },
              { label: 'b =', answer: -3 },
            ],
            solution: ['A(-2,1),\\ A\'(3,-2)', 'a=3-(-2)=5', 'b=-2-1=-3', '(a,b)=(5,-3)'],
          },
          {
            prompt: L(
              `On a map of the school yard, the origin is the flagpole and one unit is 1 meter. A light stands at $L(4,-2)$. It is turned $90^\\circ$ counterclockwise about the flagpole. Find the new coordinates.`,
              `Pada denah halaman sekolah, titik asal adalah tiang bendera dan satu satuan sama dengan 1 meter. Sebuah lampu berdiri di $L(4,-2)$. Lampu itu diputar $90^\\circ$ berlawanan arah jarum jam terhadap tiang bendera. Tentukan koordinat barunya.`,
            ),
            figure: {
              ...plane([dot([4, -2], 'L'), dot([0, 0], 'O', 'b')]),
              caption: L('The light L and the flagpole O.', 'Lampu L dan tiang bendera O.'),
            },
            inline: true,
            blanks: [
              { label: 'x =', answer: 2 },
              { label: 'y =', answer: 4 },
            ],
            solution: ['(x,y)\\rightarrow(-y,x)', '(4,-2)\\rightarrow(2,4)', 'L\'(2,4)'],
          },
          {
            prompt: L(
              `The green triangle is reflected in a vertical line $x=k$ and gives the red triangle. Find $k$. Then find the $x$-coordinate of $D'$, the image of the point $D(-2,5)$ in the same line.`,
              `Segitiga hijau dicerminkan terhadap garis tegak $x=k$ dan menghasilkan segitiga merah. Tentukan $k$. Lalu tentukan koordinat $x$ dari $D'$, bayangan titik $D(-2,5)$ pada garis yang sama.`,
            ),
            figure: {
              ...trans([[-3, 2], [-1, 2], [-3, 4]], 'ABC', [[-3, 2], [-1, 2], [-3, 4]].map((p) => refLineX(1)(p as Pt))),
              caption: L('The mirror line lies halfway between A and A\'.', 'Garis cermin berada di tengah antara A dan A\'.'),
            },
            blanks: [
              { label: 'k =', answer: 1 },
              { label: 'x_{D\'} =', answer: 4 },
            ],
            solution: ['A(-3,2),\\ A\'(5,2)', 'k=\\frac{-3+5}{2}=1', 'x_{D\'}=2\\times1-(-2)=4'],
          },
        ],
      },
    },
    /* ============================================ S2: perimeter and area */
    {
      id: 'tka-smp-m6-s2',
      title: L('Perimeter and Area', 'Keliling dan Luas'),
      summary: L(
        'Perimeter and area of triangles, quadrilaterals and combined polygons, then circles, semicircles, sectors, rings and regions made of rectangles and circle parts.',
        'Keliling dan luas segitiga, segi empat, dan segi banyak gabungan, lalu lingkaran, setengah lingkaran, juring, cincin, dan daerah yang tersusun dari persegi panjang dan bagian lingkaran.',
      ),
      lessons: [
        /* ------------------------------------------ S2 L1 polygons */
        {
          id: 'tka-smp-m6-s2-l1',
          title: L('Perimeter and Area of Polygons', 'Keliling dan Luas Segi Banyak'),
          goal: L(
            'You can find the perimeter and area of triangles, quadrilaterals and L, T and U shaped regions, and use them to work out costs.',
            'Kamu bisa mencari keliling dan luas segitiga, segi empat, serta daerah berbentuk L, T, dan U, lalu memakainya untuk menghitung biaya.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Around and Inside', 'Ayo Amati: Sekeliling dan Bagian Dalam'),
              body: L(
                'Ani wants to put a ribbon along the edge of a photo and cover its front with colored paper. The ribbon needs the **perimeter**. The paper needs the **area**.\n\n- **Perimeter** is the total length of the boundary. It is measured in a length unit such as cm or m.\n- **Area** is the amount of flat surface inside the boundary. It is measured in square units such as $\\text{cm}^2$ or $\\text{m}^2$.\n\nThe picture shows a rectangle 5 cm long and 3 cm wide. It covers 15 unit squares, so its area is $15\\text{ cm}^2$. Its perimeter is $5+3+5+3=16$ cm.',
                'Ani ingin memasang pita di sepanjang tepi sebuah foto dan menutupi bagian depannya dengan kertas warna. Pita membutuhkan **keliling**. Kertas membutuhkan **luas**.\n\n- **Keliling** adalah panjang seluruh garis tepi. Satuannya satuan panjang seperti cm atau m.\n- **Luas** adalah besar permukaan datar di dalam garis tepi. Satuannya satuan persegi seperti $\\text{cm}^2$ atau $\\text{m}^2$.\n\nGambar menunjukkan persegi panjang dengan panjang 5 cm dan lebar 3 cm. Bangun itu menutupi 15 persegi satuan, jadi luasnya $15\\text{ cm}^2$. Kelilingnya $5+3+5+3=16$ cm.',
              ),
              figure: {
                ...gridRect({ cols: 5, rows: 3, shade: 15, dims: ['5', '3'] }),
                caption: L('A 5 by 3 rectangle: 15 squares inside, 16 units around.', 'Persegi panjang 5 kali 3: 15 persegi di dalam, 16 satuan di sekelilingnya.'),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: An L-Shaped Plan', 'Contoh Bertahap: Denah Berbentuk L'),
              body: L(
                'Find the perimeter and the area of this L-shaped plan. All lengths are in cm.\n\n1. Step 1: Perimeter. Walk round the edge and add every side: $6+2+4+3+2+5=22$ cm.\n2. Step 2: Area. Split the L into two rectangles with the dashed orange line. The lower one is 6 by 2 and the upper one is 2 by 3.\n3. Step 3: Add the two areas: $6\\times2+2\\times3=12+6=18\\text{ cm}^2$.\n4. Step 4: Check by subtracting. The big rectangle is $6\\times5=30$. The missing corner is $4\\times3=12$. Then $30-12=18\\text{ cm}^2$.\n\n**Remember:**\n\n| Shape | Area |\n|---|---|\n| Rectangle | $\\text{length}\\times\\text{width}$ |\n| Triangle | $\\frac{1}{2}\\times\\text{base}\\times\\text{height}$ |\n| Parallelogram | $\\text{base}\\times\\text{height}$ |\n| Trapezium | $\\frac{1}{2}\\times(\\text{sum of parallel sides})\\times\\text{height}$ |\n| Kite and rhombus | $\\frac{1}{2}\\times d_1\\times d_2$ (the two diagonals) |',
                'Cari keliling dan luas denah berbentuk L ini. Semua panjang dalam cm.\n\n1. Langkah 1: Keliling. Susuri tepinya dan jumlahkan setiap sisi: $6+2+4+3+2+5=22$ cm.\n2. Langkah 2: Luas. Bagi bangun L menjadi dua persegi panjang dengan garis putus-putus oranye. Yang bawah berukuran 6 kali 2 dan yang atas berukuran 2 kali 3.\n3. Langkah 3: Jumlahkan kedua luasnya: $6\\times2+2\\times3=12+6=18\\text{ cm}^2$.\n4. Langkah 4: Cek dengan pengurangan. Persegi panjang besarnya $6\\times5=30$. Sudut yang hilang $4\\times3=12$. Maka $30-12=18\\text{ cm}^2$.\n\n**Ingat:**\n\n| Bangun | Luas |\n|---|---|\n| Persegi panjang | $\\text{panjang}\\times\\text{lebar}$ |\n| Segitiga | $\\frac{1}{2}\\times\\text{alas}\\times\\text{tinggi}$ |\n| Jajar genjang | $\\text{alas}\\times\\text{tinggi}$ |\n| Trapesium | $\\frac{1}{2}\\times(\\text{jumlah sisi sejajar})\\times\\text{tinggi}$ |\n| Layang-layang dan belah ketupat | $\\frac{1}{2}\\times d_1\\times d_2$ (kedua diagonalnya) |',
              ),
              figure: {
                ...shape({
                  pts: [[0, 0], [6, 0], [6, 2], [2, 2], [2, 5], [0, 5]],
                  sides: ['6', '2', '4', '3', '2', '5'],
                  extra: [line([0, 2], [2, 2], 'b', { dashed: true, width: 2.4 })],
                }),
                caption: L('An L-shaped plan. The dashed orange line splits it into two rectangles.', 'Denah berbentuk L. Garis putus-putus oranye membaginya menjadi dua persegi panjang.'),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Height, Units and Slants', 'Awas, Jebakan!: Tinggi, Satuan, dan Sisi Miring'),
              body: L(
                '| Wrong | Right |\n|---|---|\n| A parallelogram has base 8 cm, slanted side 5 cm and height 4 cm. Area $=8\\times5=40\\text{ cm}^2$ | The height is the perpendicular distance between the parallel sides, not the slanted side: $8\\times4=32\\text{ cm}^2$ |\n| A triangle has base 6 cm and height 10 cm. Area $=6\\times10=60\\text{ cm}^2$ | A triangle is half of a rectangle: $\\frac{1}{2}\\times6\\times10=30\\text{ cm}^2$ |\n| $1\\text{ m}^2=100\\text{ cm}^2$ | $1\\text{ m}=100\\text{ cm}$, so $1\\text{ m}^2=100\\times100=10\\,000\\text{ cm}^2$ |\n| The perimeter of a $6\\text{ cm}\\times4\\text{ cm}$ rectangle is $20\\text{ cm}^2$ | A perimeter is a length: $20$ cm. Only the area, $24\\text{ cm}^2$, has square units |',
                '| Salah | Benar |\n|---|---|\n| Jajar genjang beralas 8 cm, sisi miring 5 cm, dan tinggi 4 cm. Luas $=8\\times5=40\\text{ cm}^2$ | Tinggi adalah jarak tegak lurus antara sisi-sisi sejajar, bukan sisi miring: $8\\times4=32\\text{ cm}^2$ |\n| Segitiga beralas 6 cm dan tinggi 10 cm. Luas $=6\\times10=60\\text{ cm}^2$ | Segitiga adalah setengah persegi panjang: $\\frac{1}{2}\\times6\\times10=30\\text{ cm}^2$ |\n| $1\\text{ m}^2=100\\text{ cm}^2$ | $1\\text{ m}=100\\text{ cm}$, jadi $1\\text{ m}^2=100\\times100=10\\,000\\text{ cm}^2$ |\n| Keliling persegi panjang $6\\text{ cm}\\times4\\text{ cm}$ adalah $20\\text{ cm}^2$ | Keliling adalah panjang: $20$ cm. Hanya luas, $24\\text{ cm}^2$, yang bersatuan persegi |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'What is the area of this parallelogram?',
                'Berapa luas jajar genjang ini?',
              ),
              figure: {
                ...shape({
                  pts: [[0, 0], [8, 0], [11, 4], [3, 4]],
                  sides: ['8', '5', '8', '5'],
                  extra: [
                    line([3, 4], [3, 0], 'result', { dashed: true, width: 2.4 }),
                    { t: 'right', at: [3, 0], from: [8, 0], to: [3, 4] },
                    txt(2.4, 2, '4', 'md', 'result', 'end'),
                  ],
                }),
                caption: L('A parallelogram in cm. The dashed red line is the height.', 'Jajar genjang dalam cm. Garis putus-putus merah adalah tingginya.'),
              },
              options: [
                L('$32\\text{ cm}^2$', '$32\\text{ cm}^2$'),
                L('$40\\text{ cm}^2$', '$40\\text{ cm}^2$'),
                L('$26\\text{ cm}^2$', '$26\\text{ cm}^2$'),
                L('$20\\text{ cm}^2$', '$20\\text{ cm}^2$'),
              ],
              answer: 0,
              explain: L(
                'The area is base times the perpendicular height: $8\\times4=32\\text{ cm}^2$. The answer 40 uses the slanted side, 26 is the perimeter, and 20 halves a product as if it were a triangle.',
                'Luasnya adalah alas kali tinggi tegak lurus: $8\\times4=32\\text{ cm}^2$. Jawaban 40 memakai sisi miring, 26 adalah kelilingnya, dan 20 membagi dua hasil kali seakan-akan segitiga.',
              ),
              hint: L(
                'Which of the numbers on the picture is the distance between the two parallel sides at a right angle?',
                'Bilangan mana pada gambar yang menyatakan jarak antara kedua sisi sejajar secara tegak lurus?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: find the area of this L-shape (cm) by splitting it with the dashed orange line into a lower rectangle $8\\times3$ and an upper rectangle $3\\times3$.',
                'Coba bersama: cari luas bangun L ini (cm) dengan membaginya memakai garis putus-putus oranye menjadi persegi panjang bawah $8\\times3$ dan persegi panjang atas $3\\times3$.',
              ),
              figure: {
                ...shape({
                  pts: [[0, 0], [8, 0], [8, 3], [3, 3], [3, 6], [0, 6]],
                  sides: ['8', '3', '5', '3', '3', '6'],
                  extra: [line([0, 3], [3, 3], 'b', { dashed: true, width: 2.4 })],
                }),
                caption: L('An L-shape with the sides in cm.', 'Bangun L dengan panjang sisi dalam cm.'),
              },
              template: '8\\times3+3\\times3=___+___=___',
              blanks: ['24', '9', '33'],
              explain: L(
                'The lower rectangle has area $8\\times3=24$ and the upper one has $3\\times3=9$. Together $24+9=33\\text{ cm}^2$. Check: $8\\times6-5\\times3=48-15=33$.',
                'Persegi panjang bawah luasnya $8\\times3=24$ dan yang atas $3\\times3=9$. Bersama-sama $24+9=33\\text{ cm}^2$. Cek: $8\\times6-5\\times3=48-15=33$.',
              ),
              hint: L(
                'Multiply the two sides of each rectangle first, then add the two areas.',
                'Kalikan dulu kedua sisi setiap persegi panjang, lalu jumlahkan kedua luasnya.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The diagonals of a rhombus are 16 cm and 12 cm long. What is its area?',
                'Diagonal-diagonal sebuah belah ketupat panjangnya 16 cm dan 12 cm. Berapa luasnya?',
              ),
              figure: {
                ...shape({
                  pts: [[8, 0], [0, 6], [-8, 0], [0, -6]],
                  extra: [
                    line([-8, 0], [8, 0], 'b', { dashed: true, width: 2.4 }),
                    line([0, -6], [0, 6], 'b', { dashed: true, width: 2.4 }),
                    txt(4, 0.7, '16', 'md', 'muted'),
                    txt(0.4, 3, '12', 'md', 'muted', 'start'),
                  ],
                }),
                caption: L('A rhombus with its two diagonals (dashed).', 'Belah ketupat dengan kedua diagonalnya (putus-putus).'),
              },
              options: [
                L('$96\\text{ cm}^2$', '$96\\text{ cm}^2$'),
                L('$192\\text{ cm}^2$', '$192\\text{ cm}^2$'),
                L('$40\\text{ cm}^2$', '$40\\text{ cm}^2$'),
                L('$28\\text{ cm}^2$', '$28\\text{ cm}^2$'),
              ],
              answer: 0,
              explain: L(
                'Area $=\\frac{1}{2}\\times16\\times12=96\\text{ cm}^2$. The answer 192 forgets the half, 40 is the perimeter (each side is 10 cm), and 28 adds the diagonals.',
                'Luas $=\\frac{1}{2}\\times16\\times12=96\\text{ cm}^2$. Jawaban 192 lupa setengahnya, 40 adalah kelilingnya (setiap sisi 10 cm), dan 28 menjumlahkan diagonalnya.',
              ),
              hint: L(
                'A rhombus is made of four equal right triangles. Use the formula with the two diagonals, and do not forget the half.',
                'Belah ketupat tersusun dari empat segitiga siku-siku yang sama. Pakai rumus dengan kedua diagonalnya, dan jangan lupa setengahnya.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan apakah setiap pernyataan Benar atau Salah.'),
              statements: [
                L('A rectangle $6\\text{ cm}\\times4\\text{ cm}$ and a rectangle $8\\text{ cm}\\times3\\text{ cm}$ have the same area.', 'Persegi panjang $6\\text{ cm}\\times4\\text{ cm}$ dan persegi panjang $8\\text{ cm}\\times3\\text{ cm}$ mempunyai luas yang sama.'),
                L('Those two rectangles also have the same perimeter.', 'Kedua persegi panjang itu juga mempunyai keliling yang sama.'),
                L('$1\\text{ m}^2$ equals $100\\text{ cm}^2$.', '$1\\text{ m}^2$ sama dengan $100\\text{ cm}^2$.'),
                L('A triangle with base 10 cm and height 6 cm has area $30\\text{ cm}^2$.', 'Segitiga dengan alas 10 cm dan tinggi 6 cm mempunyai luas $30\\text{ cm}^2$.'),
              ],
              answer: [true, false, false, true],
              explain: L(
                'Both areas are 24. The perimeters are $2(6+4)=20$ and $2(8+3)=22$, so they differ. $1\\text{ m}^2=10\\,000\\text{ cm}^2$. The triangle is $\\frac{1}{2}\\times10\\times6=30$.',
                'Kedua luasnya 24. Kelilingnya $2(6+4)=20$ dan $2(8+3)=22$, jadi berbeda. $1\\text{ m}^2=10\\,000\\text{ cm}^2$. Luas segitiganya $\\frac{1}{2}\\times10\\times6=30$.',
              ),
              hint: L(
                'Work out the area and the perimeter of each shape separately. For units, think about how many centimeters make one meter, and what that means for a square.',
                'Hitung luas dan keliling setiap bangun secara terpisah. Untuk satuan, pikirkan berapa sentimeter dalam satu meter, dan apa artinya bagi sebuah persegi.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'Choose the TWO shapes whose area is $24\\text{ cm}^2$.',
                'Pilih DUA bangun yang luasnya $24\\text{ cm}^2$.',
              ),
              options: [
                L('A triangle with base 8 cm and height 6 cm', 'Segitiga dengan alas 8 cm dan tinggi 6 cm'),
                L('A parallelogram with base 6 cm, slanted side 5 cm and height 4 cm', 'Jajar genjang dengan alas 6 cm, sisi miring 5 cm, dan tinggi 4 cm'),
                L('A trapezium with parallel sides 4 cm and 8 cm and height 6 cm', 'Trapesium dengan sisi sejajar 4 cm dan 8 cm serta tinggi 6 cm'),
                L('A kite with diagonals 10 cm and 6 cm', 'Layang-layang dengan diagonal 10 cm dan 6 cm'),
              ],
              answer: [0, 1],
              explain: L(
                'Triangle: $\\frac{1}{2}\\times8\\times6=24$. Parallelogram: $6\\times4=24$ (the slanted side is not used). The trapezium is $\\frac{1}{2}\\times(4+8)\\times6=36$ and the kite is $\\frac{1}{2}\\times10\\times6=30$.',
                'Segitiga: $\\frac{1}{2}\\times8\\times6=24$. Jajar genjang: $6\\times4=24$ (sisi miring tidak dipakai). Trapesium $\\frac{1}{2}\\times(4+8)\\times6=36$ dan layang-layang $\\frac{1}{2}\\times10\\times6=30$.',
              ),
              hint: L(
                'Compute each area with the right formula. Remember the half for a triangle, a trapezium and a kite.',
                'Hitung setiap luas dengan rumus yang tepat. Ingat setengahnya untuk segitiga, trapesium, dan layang-layang.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'A courtyard is shaped like a U. All lengths in the picture are in meters. It will be paved, and paving costs Rp45,000 per square meter. Find the area of the courtyard and the total cost.',
                'Sebuah halaman berbentuk huruf U. Semua panjang pada gambar dalam meter. Halaman itu akan dipaving, dan biaya paving Rp45.000 per meter persegi. Tentukan luas halaman dan biaya totalnya.',
              ),
              figure: {
                ...shape({
                  pts: [[0, 0], [10, 0], [10, 8], [7, 8], [7, 3], [3, 3], [3, 8], [0, 8]],
                  sides: ['10', '8', '3', '5', '4', '5', '3', '8'],
                }),
                caption: L('A U-shaped courtyard, lengths in meters.', 'Halaman berbentuk U, panjang dalam meter.'),
              },
              blanks: [
                { label: { en: '\\text{area} =', id: '\\text{luas} =' }, answer: 60, after: '\\text{ m}^2' },
                { label: { en: '\\text{cost} = \\text{Rp}', id: '\\text{biaya} = \\text{Rp}' }, answer: 2700000 },
              ],
              hints: [
                L(
                  'Imagine the U inside a big rectangle. What is cut out of that rectangle?',
                  'Bayangkan huruf U berada di dalam sebuah persegi panjang besar. Bagian apa yang dipotong dari persegi panjang itu?',
                ),
                L(
                  'The big rectangle is $10\\times8$. The cut-out is 4 wide (from 3 to 7) and 5 deep (from 3 to 8). Subtract its area.',
                  'Persegi panjang besarnya $10\\times8$. Bagian yang dipotong lebarnya 4 (dari 3 sampai 7) dan dalamnya 5 (dari 3 sampai 8). Kurangkan luasnya.',
                ),
                L(
                  'Once you have the area in square meters, multiply it by the price of one square meter.',
                  'Setelah mendapat luas dalam meter persegi, kalikan dengan harga satu meter persegi.',
                ),
              ],
              explain: L(
                'The area is $10\\times8-4\\times5=80-20=60\\text{ m}^2$. The cost is $60\\times45\\,000=2\\,700\\,000$ rupiah, which is Rp2,700,000.',
                'Luasnya $10\\times8-4\\times5=80-20=60\\text{ m}^2$. Biayanya $60\\times45\\,000=2\\,700\\,000$ rupiah, yaitu Rp2.700.000.',
              ),
              solution: ['10\\times8=80', '4\\times5=20', '80-20=60\\text{ m}^2', '60\\times45\\,000=2\\,700\\,000'],
            },
          ],
        },
        /* ------------------------------------------ S2 L2 circles */
        {
          id: 'tka-smp-m6-s2-l2',
          title: L('Circles and Combined Regions', 'Lingkaran dan Daerah Gabungan'),
          goal: L(
            'You can find the circumference and area of a circle, a semicircle, a sector and a ring, and of regions that combine a rectangle with part of a circle.',
            'Kamu bisa mencari keliling dan luas lingkaran, setengah lingkaran, juring, dan cincin, serta daerah yang menggabungkan persegi panjang dengan bagian lingkaran.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Parts of a Circle', 'Ayo Amati: Bagian-Bagian Lingkaran'),
              body: L(
                'A bicycle wheel is a circle. The red segment in the picture is the **radius** $r$: the distance from the center to the edge. The orange segment is the **diameter** $d$: a line through the center from edge to edge, so $d=2r$.\n\nThe distance once round the circle is its **circumference** $C$. The space inside is its area $A$. Both use the number $\\pi$ (pi), which is about $3.14$, or about $\\frac{22}{7}$ when the radius is a multiple of 7.\n\n- Circumference: $C=2\\pi r=\\pi d$\n- Area: $A=\\pi r^2$\n\nWhen a problem says "in terms of $\\pi$", leave $\\pi$ in the answer, for example $36\\pi$.',
                'Roda sepeda berbentuk lingkaran. Ruas merah pada gambar adalah **jari-jari** $r$: jarak dari pusat ke tepi. Ruas oranye adalah **diameter** $d$: garis lurus melalui pusat dari tepi ke tepi, sehingga $d=2r$.\n\nJarak satu putaran mengelilingi lingkaran disebut **keliling** $C$. Ruang di dalamnya adalah luas $A$. Keduanya memakai bilangan $\\pi$ (pi), yang kira-kira $3{,}14$, atau kira-kira $\\frac{22}{7}$ jika jari-jarinya kelipatan 7.\n\n- Keliling: $C=2\\pi r=\\pi d$\n- Luas: $A=\\pi r^2$\n\nJika soal berkata "dalam $\\pi$", biarkan $\\pi$ tetap ada pada jawaban, misalnya $36\\pi$.',
              ),
              figure: {
                ...circle2d({ r: 3, radius: 'r', diameter: 'd' }),
                caption: L('A circle with its radius r (red) and diameter d (orange).', 'Lingkaran dengan jari-jari r (merah) dan diameter d (oranye).'),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: A Semicircle', 'Contoh Bertahap: Setengah Lingkaran'),
              body: L(
                'A semicircle has diameter 14 cm. Find its perimeter and its area. Use $\\pi=\\frac{22}{7}$.\n\n1. Step 1: The radius is half the diameter: $r=7$ cm.\n2. Step 2: For the whole circle, $C=2\\times\\frac{22}{7}\\times7=44$ cm and $A=\\frac{22}{7}\\times7\\times7=154\\text{ cm}^2$.\n3. Step 3: The curved edge is half of the circumference: $44\\div2=22$ cm. The area is half of the circle: $154\\div2=77\\text{ cm}^2$.\n4. Step 4: The perimeter of the semicircle also has the straight edge, the diameter: $22+14=36$ cm.\n\n**Remember:**\n\n| Region | Boundary length | Area |\n|---|---|---|\n| Circle | $2\\pi r$ | $\\pi r^2$ |\n| Semicircle | $\\pi r+2r$ | $\\frac{1}{2}\\pi r^2$ |\n| Quarter circle | $\\frac{1}{2}\\pi r+2r$ | $\\frac{1}{4}\\pi r^2$ |\n| Sector with angle $\\theta$ | $\\frac{\\theta}{360}\\times2\\pi r+2r$ | $\\frac{\\theta}{360}\\times\\pi r^2$ |\n| Ring with radii $R$ and $r$ | $2\\pi R+2\\pi r$ | $\\pi R^2-\\pi r^2$ |\n\nIn a sector, the **arc length** is only the curved part: $\\frac{\\theta}{360}\\times2\\pi r$.',
                'Sebuah setengah lingkaran berdiameter 14 cm. Cari keliling dan luasnya. Pakai $\\pi=\\frac{22}{7}$.\n\n1. Langkah 1: Jari-jari adalah setengah diameter: $r=7$ cm.\n2. Langkah 2: Untuk lingkaran penuh, $C=2\\times\\frac{22}{7}\\times7=44$ cm dan $A=\\frac{22}{7}\\times7\\times7=154\\text{ cm}^2$.\n3. Langkah 3: Tepi lengkungnya setengah dari keliling lingkaran: $44\\div2=22$ cm. Luasnya setengah lingkaran: $154\\div2=77\\text{ cm}^2$.\n4. Langkah 4: Keliling setengah lingkaran juga memuat tepi lurusnya, yaitu diameter: $22+14=36$ cm.\n\n**Ingat:**\n\n| Daerah | Panjang batas | Luas |\n|---|---|---|\n| Lingkaran | $2\\pi r$ | $\\pi r^2$ |\n| Setengah lingkaran | $\\pi r+2r$ | $\\frac{1}{2}\\pi r^2$ |\n| Seperempat lingkaran | $\\frac{1}{2}\\pi r+2r$ | $\\frac{1}{4}\\pi r^2$ |\n| Juring bersudut $\\theta$ | $\\frac{\\theta}{360}\\times2\\pi r+2r$ | $\\frac{\\theta}{360}\\times\\pi r^2$ |\n| Cincin berjari-jari $R$ dan $r$ | $2\\pi R+2\\pi r$ | $\\pi R^2-\\pi r^2$ |\n\nPada juring, **panjang busur** hanya bagian lengkungnya: $\\frac{\\theta}{360}\\times2\\pi r$.',
              ),
              figure: {
                ...circle2d({ r: 3, radius: '7', diameter: '14', sector: 180 }),
                caption: L('The shaded green half is the semicircle with diameter 14.', 'Setengah bagian hijau yang diarsir adalah setengah lingkaran berdiameter 14.'),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Radius, Diameter and Ring', 'Awas, Jebakan!: Jari-Jari, Diameter, dan Cincin'),
              body: L(
                '| Wrong | Right |\n|---|---|\n| A circle has diameter 10 cm, so its area is $\\pi\\times10^2=100\\pi$ | The formula needs the radius: $r=5$, so $A=\\pi\\times5^2=25\\pi$ |\n| The area of a circle with $r=3$ is $2\\pi\\times3=6\\pi$ | $2\\pi r$ is the circumference, a length. The area is $\\pi r^2=9\\pi$ |\n| The perimeter of a semicircle with diameter 14 cm is 22 cm (curved part only) | Add the straight edge too: $22+14=36$ cm |\n| A ring with radii 10 and 6 has area $\\pi(10-6)^2=16\\pi$ | Subtract the two areas, not the radii: $\\pi(10^2-6^2)=64\\pi$ |',
                '| Salah | Benar |\n|---|---|\n| Lingkaran berdiameter 10 cm, jadi luasnya $\\pi\\times10^2=100\\pi$ | Rumus memerlukan jari-jari: $r=5$, jadi $A=\\pi\\times5^2=25\\pi$ |\n| Luas lingkaran dengan $r=3$ adalah $2\\pi\\times3=6\\pi$ | $2\\pi r$ adalah keliling, yaitu panjang. Luasnya $\\pi r^2=9\\pi$ |\n| Keliling setengah lingkaran berdiameter 14 cm adalah 22 cm (hanya bagian lengkung) | Tambahkan juga tepi lurusnya: $22+14=36$ cm |\n| Cincin berjari-jari 10 dan 6 luasnya $\\pi(10-6)^2=16\\pi$ | Kurangkan kedua luasnya, bukan jari-jarinya: $\\pi(10^2-6^2)=64\\pi$ |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The circle has a diameter of 20 cm. What is its area, in terms of $\\pi$?',
                'Lingkaran itu berdiameter 20 cm. Berapa luasnya, dalam $\\pi$?',
              ),
              figure: {
                ...circle2d({ r: 3, diameter: '20' }),
                caption: L('A circle with diameter 20 cm.', 'Lingkaran dengan diameter 20 cm.'),
              },
              options: [
                L('$100\\pi\\text{ cm}^2$', '$100\\pi\\text{ cm}^2$'),
                L('$400\\pi\\text{ cm}^2$', '$400\\pi\\text{ cm}^2$'),
                L('$20\\pi\\text{ cm}^2$', '$20\\pi\\text{ cm}^2$'),
                L('$200\\pi\\text{ cm}^2$', '$200\\pi\\text{ cm}^2$'),
              ],
              answer: 0,
              explain: L(
                'The radius is $20\\div2=10$ cm, so $A=\\pi\\times10^2=100\\pi$. The answer $400\\pi$ uses the diameter as the radius, $20\\pi$ is the circumference, and $200\\pi$ doubles the area.',
                'Jari-jarinya $20\\div2=10$ cm, jadi $A=\\pi\\times10^2=100\\pi$. Jawaban $400\\pi$ memakai diameter sebagai jari-jari, $20\\pi$ adalah keliling, dan $200\\pi$ menggandakan luasnya.',
              ),
              hint: L(
                'The area formula uses the radius. What is the radius when the diameter is 20?',
                'Rumus luas memakai jari-jari. Berapa jari-jarinya jika diameternya 20?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: the area of a semicircle with diameter 14 cm, so $r=7$. Use $\\pi=\\frac{22}{7}$.',
                'Coba bersama: luas setengah lingkaran berdiameter 14 cm, jadi $r=7$. Pakai $\\pi=\\frac{22}{7}$.',
              ),
              template: '\\frac{1}{2}\\times\\frac{22}{7}\\times7^2=\\frac{1}{2}\\times___=___',
              blanks: ['154', '77'],
              explain: L(
                '$\\frac{22}{7}\\times49=154$ is the area of the whole circle. Half of it is $77\\text{ cm}^2$.',
                '$\\frac{22}{7}\\times49=154$ adalah luas lingkaran penuh. Setengahnya adalah $77\\text{ cm}^2$.',
              ),
              hint: L(
                'First find the area of the whole circle, $\\frac{22}{7}\\times49$: divide 49 by 7, then multiply by 22. Then take half.',
                'Cari dulu luas lingkaran penuh, $\\frac{22}{7}\\times49$: bagi 49 dengan 7, lalu kalikan 22. Setelah itu ambil setengahnya.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The picture shows a ring. What is the area of the green part, in terms of $\\pi$?',
                'Gambar menunjukkan sebuah cincin. Berapa luas bagian hijau, dalam $\\pi$?',
              ),
              figure: {
                ...ring(10, 6, '10', '6'),
                caption: L('The outer radius is 10 cm. The gray inner circle has radius 6 cm and is cut out.', 'Jari-jari luarnya 10 cm. Lingkaran abu-abu di dalam berjari-jari 6 cm dan dipotong.'),
              },
              options: [
                L('$64\\pi\\text{ cm}^2$', '$64\\pi\\text{ cm}^2$'),
                L('$16\\pi\\text{ cm}^2$', '$16\\pi\\text{ cm}^2$'),
                L('$136\\pi\\text{ cm}^2$', '$136\\pi\\text{ cm}^2$'),
                L('$8\\pi\\text{ cm}^2$', '$8\\pi\\text{ cm}^2$'),
              ],
              answer: 0,
              explain: L(
                'The ring is the big circle minus the small one: $\\pi\\times10^2-\\pi\\times6^2=100\\pi-36\\pi=64\\pi$. The answer $16\\pi$ squares the difference of the radii, $136\\pi$ adds the two areas, and $8\\pi$ is a difference of circumferences.',
                'Cincin adalah lingkaran besar dikurangi lingkaran kecil: $\\pi\\times10^2-\\pi\\times6^2=100\\pi-36\\pi=64\\pi$. Jawaban $16\\pi$ mengkuadratkan selisih jari-jari, $136\\pi$ menjumlahkan kedua luas, dan $8\\pi$ adalah selisih keliling.',
              ),
              hint: L(
                'Find the area of each circle on its own, then decide whether to add or subtract.',
                'Cari luas masing-masing lingkaran sendiri-sendiri, lalu tentukan apakah dijumlahkan atau dikurangkan.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'The shaded part is a quarter of a circle with radius 14 cm. Use $\\pi=\\frac{22}{7}$. Choose the TWO correct statements.',
                'Bagian yang diarsir adalah seperempat lingkaran berjari-jari 14 cm. Pakai $\\pi=\\frac{22}{7}$. Pilih DUA pernyataan yang benar.',
              ),
              figure: {
                ...circle2d({ r: 3, sector: 90, radius: '14' }),
                caption: L('A quarter circle with radius 14 cm.', 'Seperempat lingkaran berjari-jari 14 cm.'),
              },
              options: [
                L('The arc length is 22 cm.', 'Panjang busurnya 22 cm.'),
                L('The area is $154\\text{ cm}^2$.', 'Luasnya $154\\text{ cm}^2$.'),
                L('The arc length is 44 cm.', 'Panjang busurnya 44 cm.'),
                L('The area is $308\\text{ cm}^2$.', 'Luasnya $308\\text{ cm}^2$.'),
              ],
              answer: [0, 1],
              explain: L(
                'The full circle has $C=2\\times\\frac{22}{7}\\times14=88$ cm and $A=\\frac{22}{7}\\times196=616\\text{ cm}^2$. A quarter of them is 22 cm and $154\\text{ cm}^2$. The values 44 and 308 are the halves, which belong to a semicircle.',
                'Lingkaran penuh punya $C=2\\times\\frac{22}{7}\\times14=88$ cm dan $A=\\frac{22}{7}\\times196=616\\text{ cm}^2$. Seperempatnya adalah 22 cm dan $154\\text{ cm}^2$. Nilai 44 dan 308 adalah setengahnya, yang milik setengah lingkaran.',
              ),
              hint: L(
                'Find the circumference and the area of the whole circle first, then take the fraction of the circle that is shaded.',
                'Cari dulu keliling dan luas lingkaran penuh, lalu ambil bagian lingkaran yang diarsir.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan apakah setiap pernyataan Benar atau Salah.'),
              statements: [
                L('A circle with diameter 10 cm has circumference $10\\pi$ cm.', 'Lingkaran berdiameter 10 cm mempunyai keliling $10\\pi$ cm.'),
                L('A circle with radius 5 cm has area $10\\pi\\text{ cm}^2$.', 'Lingkaran berjari-jari 5 cm mempunyai luas $10\\pi\\text{ cm}^2$.'),
                L('A quarter circle with radius $r$ has area $\\frac{1}{4}\\pi r^2$.', 'Seperempat lingkaran berjari-jari $r$ mempunyai luas $\\frac{1}{4}\\pi r^2$.'),
                L('If the radius of a circle is doubled, its area is doubled.', 'Jika jari-jari sebuah lingkaran digandakan, luasnya ikut digandakan.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                '$C=\\pi d=10\\pi$. The area with $r=5$ is $\\pi\\times25=25\\pi$, not $10\\pi$. A quarter of $\\pi r^2$ is $\\frac{1}{4}\\pi r^2$. Doubling $r$ gives $\\pi(2r)^2=4\\pi r^2$, which is four times the area.',
                '$C=\\pi d=10\\pi$. Luas dengan $r=5$ adalah $\\pi\\times25=25\\pi$, bukan $10\\pi$. Seperempat dari $\\pi r^2$ adalah $\\frac{1}{4}\\pi r^2$. Menggandakan $r$ menghasilkan $\\pi(2r)^2=4\\pi r^2$, yaitu empat kali luasnya.',
              ),
              hint: L(
                'Write the formula for each claim and put the numbers in. Take care: the radius is squared in the area.',
                'Tulis rumus untuk setiap pernyataan lalu masukkan angkanya. Hati-hati: jari-jari dikuadratkan pada luas.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'A running track is a rectangle 40 m long with a half circle at each short end. The track is 14 m wide. Use $\\pi=\\frac{22}{7}$. Find the distance once round the outside of the track, and the area of the whole region.',
                'Sebuah lintasan lari berbentuk persegi panjang sepanjang 40 m dengan setengah lingkaran di setiap ujungnya yang pendek. Lebar lintasan 14 m. Pakai $\\pi=\\frac{22}{7}$. Tentukan jarak satu putaran di sisi luar lintasan, dan luas seluruh daerahnya.',
              ),
              figure: {
                ...stadium(40, 7, '40', '14'),
                caption: L('A rectangle with a half circle at each end. Lengths in meters.', 'Persegi panjang dengan setengah lingkaran di setiap ujung. Panjang dalam meter.'),
              },
              blanks: [
                { label: { en: '\\text{distance round} =', id: '\\text{jarak satu putaran} =' }, answer: 124, after: '\\text{ m}' },
                { label: { en: '\\text{area} =', id: '\\text{luas} =' }, answer: 714, after: '\\text{ m}^2' },
              ],
              hints: [
                L(
                  'The two half circles together make one whole circle. What is its diameter?',
                  'Kedua setengah lingkaran bersama-sama membentuk satu lingkaran penuh. Berapa diameternya?',
                ),
                L(
                  'The distance round is the two straight sides plus the circumference of that circle. The area is the rectangle plus the area of that circle.',
                  'Jarak satu putaran adalah dua sisi lurus ditambah keliling lingkaran itu. Luasnya adalah persegi panjang ditambah luas lingkaran itu.',
                ),
                L(
                  'The radius is $14\\div2=7$ m. Work out $2\\times40$, $2\\times\\frac{22}{7}\\times7$, $40\\times14$ and $\\frac{22}{7}\\times7\\times7$, then add in pairs.',
                  'Jari-jarinya $14\\div2=7$ m. Hitung $2\\times40$, $2\\times\\frac{22}{7}\\times7$, $40\\times14$, dan $\\frac{22}{7}\\times7\\times7$, lalu jumlahkan berpasangan.',
                ),
              ],
              explain: L(
                'The two half circles make one circle with $r=7$: circumference $44$ m, area $154\\text{ m}^2$. Distance round $=2\\times40+44=124$ m. Area $=40\\times14+154=560+154=714\\text{ m}^2$.',
                'Kedua setengah lingkaran membentuk satu lingkaran dengan $r=7$: keliling $44$ m, luas $154\\text{ m}^2$. Jarak satu putaran $=2\\times40+44=124$ m. Luas $=40\\times14+154=560+154=714\\text{ m}^2$.',
              ),
              solution: {
                en: ['r=14\\div2=7', 'C=2\\times\\frac{22}{7}\\times7=44', '\\text{round}=2\\times40+44=124', 'A=40\\times14+\\frac{22}{7}\\times7\\times7=560+154=714'],
                id: ['r=14\\div2=7', 'C=2\\times\\frac{22}{7}\\times7=44', '\\text{satu putaran}=2\\times40+44=124', 'A=40\\times14+\\frac{22}{7}\\times7\\times7=560+154=714'],
              },
            },
          ],
        },
      ],
      project: {
        id: 'tka-smp-m6-s2-p',
        runtime: 'math',
        title: L('Plans, Wheels and Windows', 'Denah, Roda, dan Jendela'),
        brief: L(
          'Use circle formulas, rings and combined regions to answer questions about a pond, a wheel and a window.',
          'Memakai rumus lingkaran, cincin, dan daerah gabungan untuk menjawab soal tentang kolam, roda, dan jendela.',
        ),
        requirements: [
          L('Find the circumference and the area of a circle, in terms of $\\pi$ or with a given $\\pi$.', 'Mencari keliling dan luas lingkaran, dalam $\\pi$ atau dengan nilai $\\pi$ yang diberikan.'),
          L('Split a combined region into simple parts, or subtract one part from another.', 'Membagi daerah gabungan menjadi bagian-bagian sederhana, atau mengurangkan satu bagian dari bagian lain.'),
        ],
        hints: [
          L('Find the radius first. The diameter is twice the radius.', 'Cari jari-jari lebih dulu. Diameter adalah dua kali jari-jari.'),
          L('For a ring, subtract the area of the inner circle from the area of the outer circle.', 'Untuk cincin, kurangkan luas lingkaran dalam dari luas lingkaran luar.'),
          L('For a combined region, write down which simple parts it is made of, and decide whether to add or subtract their areas.', 'Untuk daerah gabungan, tuliskan bagian sederhana apa saja yang menyusunnya, lalu tentukan apakah luasnya ditambah atau dikurangkan.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L(
              'A circle has a diameter of 12 cm. Find its circumference and its area, in terms of $\\pi$. Type your answers like $12\\pi$ as 12pi.',
              'Sebuah lingkaran berdiameter 12 cm. Tentukan keliling dan luasnya, dalam $\\pi$. Ketik jawabanmu seperti $12\\pi$ sebagai 12pi.',
            ),
            figure: {
              ...circle2d({ r: 3, diameter: '12' }),
              caption: L('A circle with diameter 12 cm.', 'Lingkaran dengan diameter 12 cm.'),
            },
            blanks: [
              { label: { en: '\\text{circumference} =', id: '\\text{keliling} =' }, answer: 12 * Math.PI, after: '\\text{ cm}' },
              { label: { en: '\\text{area} =', id: '\\text{luas} =' }, answer: 36 * Math.PI, after: '\\text{ cm}^2' },
            ],
            solution: ['r=12\\div2=6', 'C=\\pi d=12\\pi', 'A=\\pi r^2=\\pi\\times6^2=36\\pi'],
          },
          {
            prompt: L(
              'A round pond has a radius of 14 m. A path 7 m wide goes all the way round the pond. Use $\\pi=\\frac{22}{7}$. Find the area of the path.',
              'Sebuah kolam bundar berjari-jari 14 m. Jalan setapak selebar 7 m mengelilingi kolam itu. Pakai $\\pi=\\frac{22}{7}$. Tentukan luas jalan setapak itu.',
            ),
            figure: {
              ...ring(21, 14, '14+7', '14'),
              caption: L('The pond (gray) and the path round it (green).', 'Kolam (abu-abu) dan jalan setapak di sekelilingnya (hijau).'),
            },
            blanks: [{ label: { en: '\\text{area of path} =', id: '\\text{luas jalan} =' }, answer: 770, after: '\\text{ m}^2' }],
            solution: ['R=14+7=21', 'A=\\pi(21^2-14^2)=\\frac{22}{7}\\times(441-196)', '=\\frac{22}{7}\\times245=770'],
          },
          {
            prompt: L(
              'A bicycle wheel has a diameter of 70 cm. Use $\\pi=\\frac{22}{7}$. Find the circumference of the wheel, and the distance the bicycle travels when the wheel turns 100 times, in meters.',
              'Roda sepeda berdiameter 70 cm. Pakai $\\pi=\\frac{22}{7}$. Tentukan keliling roda itu, dan jarak yang ditempuh sepeda ketika roda berputar 100 kali, dalam meter.',
            ),
            blanks: [
              { label: { en: '\\text{circumference} =', id: '\\text{keliling} =' }, answer: 220, after: '\\text{ cm}' },
              { label: { en: '\\text{distance} =', id: '\\text{jarak} =' }, answer: 220, after: '\\text{ m}' },
            ],
            solution: ['C=\\pi d=\\frac{22}{7}\\times70=220\\text{ cm}', '100\\times220=22\\,000\\text{ cm}', '22\\,000\\div100=220\\text{ m}'],
          },
          {
            prompt: L(
              'A window is a rectangle 42 cm wide and 60 cm high with a half circle on top. The diameter of the half circle is the top side of the rectangle. Use $\\pi=\\frac{22}{7}$. Find the area of the glass, and the length of the frame that goes round the whole window (the bottom, the two sides and the curved top).',
              'Sebuah jendela berbentuk persegi panjang selebar 42 cm dan setinggi 60 cm dengan setengah lingkaran di atasnya. Diameter setengah lingkaran itu adalah sisi atas persegi panjang. Pakai $\\pi=\\frac{22}{7}$. Tentukan luas kaca, dan panjang bingkai yang mengelilingi seluruh jendela (sisi bawah, kedua sisi tegak, dan lengkung di atas).',
            ),
            figure: {
              ...windowFig(42, 60, '42', '60'),
              caption: L('A window. The dashed orange line is the diameter of the half circle.', 'Sebuah jendela. Garis putus-putus oranye adalah diameter setengah lingkaran.'),
            },
            blanks: [
              { label: { en: '\\text{area} =', id: '\\text{luas} =' }, answer: 3213, after: '\\text{ cm}^2' },
              { label: { en: '\\text{frame} =', id: '\\text{bingkai} =' }, answer: 228, after: '\\text{ cm}' },
            ],
            solution: {
              en: ['r=42\\div2=21', 'A=42\\times60+\\frac{1}{2}\\times\\frac{22}{7}\\times21^2=2\\,520+693=3\\,213', '\\text{arc}=\\frac{1}{2}\\times2\\times\\frac{22}{7}\\times21=66', '\\text{frame}=42+60+60+66=228'],
              id: ['r=42\\div2=21', 'A=42\\times60+\\frac{1}{2}\\times\\frac{22}{7}\\times21^2=2\\,520+693=3\\,213', '\\text{busur}=\\frac{1}{2}\\times2\\times\\frac{22}{7}\\times21=66', '\\text{bingkai}=42+60+60+66=228'],
            },
          },
        ],
      },
    },
    /* ============================================ S3: solid shapes */
    {
      id: 'tka-smp-m6-s3',
      title: L('Solid Shapes', 'Bangun Ruang'),
      summary: L(
        'Read the nets of prisms, cylinders, pyramids and cones, count faces, edges and vertices, and find the volume of prisms, cylinders, pyramids, cones and spheres.',
        'Membaca jaring-jaring prisma, tabung, limas, dan kerucut, menghitung sisi, rusuk, dan titik sudut, serta mencari volume prisma, tabung, limas, kerucut, dan bola.',
      ),
      lessons: [
        /* ------------------------------------------ S3 L1 nets */
        {
          id: 'tka-smp-m6-s3-l1',
          title: L('Nets of Prisms, Cylinders, Pyramids and Cones', 'Jaring-jaring Prisma, Tabung, Limas, dan Kerucut'),
          goal: L(
            'You can match a net with its solid, count faces, edges and vertices, and read lengths from a net.',
            'Kamu bisa menjodohkan jaring-jaring dengan bangun ruangnya, menghitung sisi, rusuk, dan titik sudut, serta membaca panjang dari jaring-jaring.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Unfolding a Solid', 'Ayo Amati: Membuka Bangun Ruang'),
              body: L(
                'Cut open a cereal box along its edges and lay it flat: you get a **net**. A net is the surface of a solid unfolded into one flat piece. Every solid has its own kind of net.\n\n- A **prism** has two identical **bases** (polygons) joined by rectangles. A triangular prism has two triangles and three rectangles.\n- A **pyramid** has one base and triangles that meet at one point, the **apex**.\n- A **cylinder** has two circles and one rectangle that wraps round them.\n- A **cone** has one circle and one **sector** (a slice of a circle) that wraps round it.',
                'Gunting sebuah kotak sereal sepanjang rusuknya lalu bentangkan: kamu mendapat **jaring-jaring**. Jaring-jaring adalah permukaan bangun ruang yang dibentangkan menjadi satu bidang datar. Setiap bangun ruang punya jaring-jaring sendiri.\n\n- **Prisma** punya dua **alas** yang sama (segi banyak) yang dihubungkan oleh persegi panjang. Prisma segitiga punya dua segitiga dan tiga persegi panjang.\n- **Limas** punya satu alas dan segitiga-segitiga yang bertemu di satu titik, yaitu **puncak**.\n- **Tabung** punya dua lingkaran dan satu persegi panjang yang melingkupinya.\n- **Kerucut** punya satu lingkaran dan satu **juring** (potongan lingkaran) yang melingkupinya.',
              ),
              figure: {
                ...triPrismNet({ a: 3, b: 4, c: 5, h: 6 }),
                caption: L('The net of a triangular prism: three rectangles in a row and two triangles.', 'Jaring-jaring prisma segitiga: tiga persegi panjang berderet dan dua segitiga.'),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Faces, Edges and Vertices', 'Contoh Bertahap: Sisi, Rusuk, dan Titik Sudut'),
              body: L(
                'A **face** is a flat surface, an **edge** is where two faces meet, and a **vertex** is a corner. Count them for a prism with a hexagonal base.\n\n1. Step 1: Faces. The hexagon has 6 sides, so there are 6 rectangles. Add the 2 bases: $6+2=8$ faces.\n2. Step 2: Edges. Each hexagon has 6 edges, so the two bases give $6+6=12$. Then 6 more edges go up between them: $12+6=18$ edges.\n3. Step 3: Vertices. Each hexagon has 6 corners: $6+6=12$ vertices.\n\n**Remember:**\n\n| Solid | Faces | Edges | Vertices |\n|---|---|---|---|\n| Triangular prism | 5 | 9 | 6 |\n| Box (cuboid) | 6 | 12 | 8 |\n| Hexagonal prism | 8 | 18 | 12 |\n| Triangular pyramid | 4 | 6 | 4 |\n| Square pyramid | 5 | 8 | 5 |\n| Prism with an $n$-sided base | $n+2$ | $3n$ | $2n$ |\n| Pyramid with an $n$-sided base | $n+1$ | $2n$ | $n+1$ |',
                '**Sisi** adalah bidang datar, **rusuk** adalah tempat dua sisi bertemu, dan **titik sudut** adalah pojoknya. Hitunglah semuanya untuk prisma beralas segi enam.\n\n1. Langkah 1: Sisi. Segi enam punya 6 sisi, jadi ada 6 persegi panjang. Tambahkan 2 alas: $6+2=8$ sisi.\n2. Langkah 2: Rusuk. Setiap segi enam punya 6 rusuk, jadi kedua alas memberi $6+6=12$. Lalu 6 rusuk lagi naik di antara keduanya: $12+6=18$ rusuk.\n3. Langkah 3: Titik sudut. Setiap segi enam punya 6 pojok: $6+6=12$ titik sudut.\n\n**Ingat:**\n\n| Bangun ruang | Sisi | Rusuk | Titik sudut |\n|---|---|---|---|\n| Prisma segitiga | 5 | 9 | 6 |\n| Balok | 6 | 12 | 8 |\n| Prisma segi enam | 8 | 18 | 12 |\n| Limas segitiga | 4 | 6 | 4 |\n| Limas segi empat | 5 | 8 | 5 |\n| Prisma beralas segi-$n$ | $n+2$ | $3n$ | $2n$ |\n| Limas beralas segi-$n$ | $n+1$ | $2n$ | $n+1$ |',
              ),
              figure: {
                ...prism3d({ base: regular(6, 2), h: 3 }),
                caption: L('A prism with a hexagonal base.', 'Prisma beralas segi enam.'),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Counting and Wrapping', 'Awas, Jebakan!: Menghitung dan Melingkupi'),
              body: L(
                'The side of a cylinder is a rectangle. When it is rolled up, its long side goes all the way round a circle, so that side is as long as the circumference: $2\\pi r$.\n\n| Wrong | Right |\n|---|---|\n| A square pyramid has 4 faces (the triangles only) | Do not forget the base: 4 triangles and 1 square make 5 faces |\n| The rectangle in the net of a cylinder is as long as the diameter of the circle | It wraps round the whole circle, so it is as long as the circumference $2\\pi r$ |\n| A prism whose base has 5 sides has 5 faces | It has 5 rectangles and 2 bases: 7 faces |',
                'Selimut tabung adalah persegi panjang. Ketika digulung, sisi panjangnya mengelilingi lingkaran satu putaran penuh, jadi sisi itu sama panjang dengan keliling: $2\\pi r$.\n\n| Salah | Benar |\n|---|---|\n| Limas segi empat punya 4 sisi (hanya segitiganya) | Jangan lupa alasnya: 4 segitiga dan 1 persegi menjadi 5 sisi |\n| Persegi panjang pada jaring-jaring tabung sepanjang diameter lingkaran | Persegi panjang itu melingkupi seluruh lingkaran, jadi panjangnya sama dengan keliling $2\\pi r$ |\n| Prisma yang alasnya bersisi 5 punya 5 sisi | Prisma itu punya 5 persegi panjang dan 2 alas: 7 sisi |',
              ),
              figure: {
                ...cylinderNet({ r: 1, h: 3, width: '2πr', height: 'h' }),
                caption: L('The net of a cylinder: a rectangle as long as 2πr and a circle at each end.', 'Jaring-jaring tabung: persegi panjang sepanjang 2πr dan satu lingkaran di setiap ujungnya.'),
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Which solid can be folded from this net?',
                'Bangun ruang manakah yang dapat dibentuk dari jaring-jaring ini?',
              ),
              figure: {
                ...pyramidNet({ side: 3, slant: 4 }),
                caption: L('A net made of one square and four triangles.', 'Jaring-jaring yang terdiri dari satu persegi dan empat segitiga.'),
              },
              options: [
                L('A square pyramid', 'Limas segi empat'),
                L('A cube', 'Kubus'),
                L('A triangular prism', 'Prisma segitiga'),
                L('A cone', 'Kerucut'),
              ],
              answer: 0,
              explain: L(
                'One square base and four triangles that meet at a point fold into a square pyramid. A cube needs six squares, a triangular prism needs rectangles, and a cone has a curved face.',
                'Satu alas persegi dan empat segitiga yang bertemu di satu titik membentuk limas segi empat. Kubus membutuhkan enam persegi, prisma segitiga membutuhkan persegi panjang, dan kerucut punya bidang lengkung.',
              ),
              hint: L(
                'Count the faces of each kind. Triangles meeting at a point are the sign of a pyramid.',
                'Hitung bidang menurut jenisnya. Segitiga yang bertemu di satu titik adalah ciri limas.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: a prism has a pentagonal base ($n=5$). Complete the number of faces, edges and vertices, in that order.',
                'Coba bersama: sebuah prisma beralas segi lima ($n=5$). Lengkapi banyak sisi, rusuk, dan titik sudutnya, dalam urutan itu.',
              ),
              figure: {
                ...prism3d({ base: regular(5, 2), h: 3 }),
                caption: L('A prism with a pentagonal base.', 'Prisma beralas segi lima.'),
              },
              template: '5+2=___,\\quad 3\\times5=___,\\quad 2\\times5=___',
              blanks: ['7', '15', '10'],
              explain: L(
                'Faces: 5 rectangles and 2 bases, so 7. Edges: $3\\times5=15$. Vertices: $2\\times5=10$.',
                'Sisi: 5 persegi panjang dan 2 alas, jadi 7. Rusuk: $3\\times5=15$. Titik sudut: $2\\times5=10$.',
              ),
              hint: L(
                'Faces: one rectangle for each side of the base, plus the two bases. Edges: $n$ on the top, $n$ on the bottom and $n$ going up. Vertices: $n$ on the top and $n$ on the bottom.',
                'Sisi: satu persegi panjang untuk setiap sisi alas, ditambah dua alas. Rusuk: $n$ di atas, $n$ di bawah, dan $n$ yang menaik. Titik sudut: $n$ di atas dan $n$ di bawah.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The picture shows the net of a can. The circles have radius 7 cm and the can is 10 cm high. Use $\\pi=\\frac{22}{7}$. How long is the side of the rectangle marked with a question mark?',
                'Gambar menunjukkan jaring-jaring sebuah kaleng. Lingkarannya berjari-jari 7 cm dan kaleng itu setinggi 10 cm. Pakai $\\pi=\\frac{22}{7}$. Berapa panjang sisi persegi panjang yang ditandai tanda tanya?',
              ),
              figure: {
                ...cylinderNet({ r: 7, h: 10, width: '?', height: '10' }),
                caption: L('The net of a can.', 'Jaring-jaring sebuah kaleng.'),
              },
              options: [
                L('44 cm', '44 cm'),
                L('22 cm', '22 cm'),
                L('14 cm', '14 cm'),
                L('154 cm', '154 cm'),
              ],
              answer: 0,
              explain: L(
                'The marked side wraps once round a circle, so it equals the circumference: $2\\times\\frac{22}{7}\\times7=44$ cm. The value 22 is half of that, 14 is the diameter, and 154 is the area of a circle.',
                'Sisi yang ditandai melingkupi lingkaran satu putaran, jadi sama dengan keliling: $2\\times\\frac{22}{7}\\times7=44$ cm. Nilai 22 adalah setengahnya, 14 adalah diameter, dan 154 adalah luas lingkaran.',
              ),
              hint: L(
                'The rectangle goes all the way round the circle. Which circle measurement is that?',
                'Persegi panjang itu mengelilingi lingkaran satu putaran penuh. Ukuran lingkaran yang mana itu?',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan apakah setiap pernyataan Benar atau Salah.'),
              figure: {
                ...coneNet({ r: 3, s: 5 }),
                caption: L('A net made of a circle and a sector.', 'Jaring-jaring yang terdiri dari sebuah lingkaran dan sebuah juring.'),
              },
              statements: [
                L('The net of a cone consists of a circle and a sector of a circle.', 'Jaring-jaring kerucut terdiri dari sebuah lingkaran dan sebuah juring lingkaran.'),
                L('A triangular pyramid has 6 edges.', 'Limas segitiga punya 6 rusuk.'),
                L('A prism with a hexagonal base has 12 faces.', 'Prisma beralas segi enam punya 12 sisi.'),
                L('A square pyramid has as many edges as a cube.', 'Limas segi empat punya rusuk sebanyak kubus.'),
              ],
              answer: [true, true, false, false],
              explain: L(
                'A cone has one flat circle and one curved face that opens into a sector. A triangular pyramid has 3 edges on the base and 3 going up. The hexagonal prism has $6+2=8$ faces (12 is its number of vertices). The square pyramid has 8 edges and the cube has 12.',
                'Kerucut punya satu lingkaran datar dan satu bidang lengkung yang terbuka menjadi juring. Limas segitiga punya 3 rusuk pada alas dan 3 yang naik. Prisma segi enam punya $6+2=8$ sisi (12 adalah banyak titik sudutnya). Limas segi empat punya 8 rusuk dan kubus punya 12.',
              ),
              hint: L(
                'Count each kind of edge for the pyramid: those on the base and those that go up to the apex. For the prism, count sides of the base plus two.',
                'Hitung setiap jenis rusuk pada limas: yang ada di alas dan yang naik ke puncak. Untuk prisma, hitung banyak sisi alas lalu tambah dua.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'The picture shows a pyramid with a pentagonal base. Choose the TWO correct statements.',
                'Gambar menunjukkan limas beralas segi lima. Pilih DUA pernyataan yang benar.',
              ),
              figure: {
                ...prism3d({ base: regular(5, 2), h: 3, apex: true }),
                caption: L('A pyramid with a pentagonal base.', 'Limas beralas segi lima.'),
              },
              options: [
                L('It has 6 faces.', 'Limas itu punya 6 sisi.'),
                L('It has 10 edges.', 'Limas itu punya 10 rusuk.'),
                L('It has 5 vertices.', 'Limas itu punya 5 titik sudut.'),
                L('Its net has one pentagon and six triangles.', 'Jaring-jaringnya punya satu segi lima dan enam segitiga.'),
              ],
              answer: [0, 1],
              explain: L(
                'With $n=5$: faces $n+1=6$ (5 triangles and the base), edges $2n=10$, vertices $n+1=6$ (5 on the base and the apex). The net has one pentagon and five triangles.',
                'Dengan $n=5$: sisi $n+1=6$ (5 segitiga dan alas), rusuk $2n=10$, titik sudut $n+1=6$ (5 di alas dan puncak). Jaring-jaringnya punya satu segi lima dan lima segitiga.',
              ),
              hint: L(
                'Count the triangles round the sides, then add the base. Do not forget the apex when you count the vertices.',
                'Hitung segitiga di sekeliling sisi, lalu tambahkan alasnya. Jangan lupa puncak saat menghitung titik sudut.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'The label of a can is a rectangle 44 cm long and 10 cm wide. It wraps exactly once round the side of the can, with no overlap. Use $\\pi=\\frac{22}{7}$. Find the radius of the can, and the area of its circular lid.',
                'Label sebuah kaleng berbentuk persegi panjang dengan panjang 44 cm dan lebar 10 cm. Label itu melingkupi sisi kaleng tepat satu kali, tanpa tumpang tindih. Pakai $\\pi=\\frac{22}{7}$. Tentukan jari-jari kaleng itu, dan luas tutupnya yang berbentuk lingkaran.',
              ),
              figure: {
                ...shape({ pts: rectPts(0, 0, 44, 10), sides: ['44', '10', '44', '10'], rights: [0, 1, 2, 3], color: 'b' }),
                caption: L('The label, lengths in cm.', 'Label kaleng, panjang dalam cm.'),
              },
              blanks: [
                { label: { en: '\\text{radius} =', id: '\\text{jari-jari} =' }, answer: 7, after: '\\text{ cm}' },
                { label: { en: '\\text{lid area} =', id: '\\text{luas tutup} =' }, answer: 154, after: '\\text{ cm}^2' },
              ],
              hints: [
                L(
                  'The 44 cm side goes once round the can. Which measurement of the circular lid is 44 cm?',
                  'Sisi 44 cm melingkari kaleng satu kali. Ukuran tutup lingkaran yang mana yang panjangnya 44 cm?',
                ),
                L(
                  'The circumference is $44=2\\pi r$ with $\\pi=\\frac{22}{7}$. Solve for $r$.',
                  'Kelilingnya $44=2\\pi r$ dengan $\\pi=\\frac{22}{7}$. Selesaikan untuk $r$.',
                ),
                L(
                  'Since $2\\times\\frac{22}{7}\\times r=44$, we get $\\frac{44}{7}r=44$. Then use the radius in $\\pi r^2$ for the lid.',
                  'Karena $2\\times\\frac{22}{7}\\times r=44$, kita dapat $\\frac{44}{7}r=44$. Lalu pakai jari-jari itu pada $\\pi r^2$ untuk tutupnya.',
                ),
              ],
              explain: L(
                'The circumference of the lid is 44 cm: $\\frac{44}{7}r=44$, so $r=7$ cm. The lid has area $\\frac{22}{7}\\times7\\times7=154\\text{ cm}^2$.',
                'Keliling tutup adalah 44 cm: $\\frac{44}{7}r=44$, jadi $r=7$ cm. Luas tutup adalah $\\frac{22}{7}\\times7\\times7=154\\text{ cm}^2$.',
              ),
              solution: ['2\\pi r=44', '2\\times\\frac{22}{7}\\times r=44 \\Rightarrow \\frac{44}{7}r=44', 'r=7', 'A=\\frac{22}{7}\\times7\\times7=154'],
            },
          ],
        },
        /* ------------------------------------------ S3 L2 volume */
        {
          id: 'tka-smp-m6-s3-l2',
          title: L('Volume of Prisms, Cylinders, Pyramids, Cones and Spheres', 'Volume Prisma, Tabung, Limas, Kerucut, dan Bola'),
          goal: L(
            'You can find the volume of a prism, a cylinder, a pyramid, a cone and a sphere, and solve pouring problems and missing-length problems.',
            'Kamu bisa mencari volume prisma, tabung, limas, kerucut, dan bola, serta menyelesaikan soal menuang air dan soal mencari panjang yang hilang.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Volume as Layers', 'Ayo Amati: Volume sebagai Lapisan'),
              body: L(
                'Volume is the amount of space inside a solid. It is measured in cubic units such as $\\text{cm}^3$ and $\\text{m}^3$. Liquids use liters: $1\\text{ L}=1\\,000\\text{ cm}^3$ and $1\\text{ mL}=1\\text{ cm}^3$.\n\nA prism is a stack of identical layers, so its volume is the area of one layer (the base) times the number of layers (the height). A cylinder is like a prism whose base is a circle, so its volume is also base area $\\times$ height $=\\pi r^2\\times h$. A pyramid fits exactly three times into a prism with the same base and the same height, so it holds one third as much. A cone is a pyramid whose base is a circle, so it also holds one third of the cylinder with the same base and height.\n\n| Solid | Volume | Worked example |\n|---|---|---|\n| Prism | $V=\\text{base area}\\times\\text{height}$ | base area $6\\text{ cm}^2$, height 10 cm: $V=6\\times10=60\\text{ cm}^3$ |\n| Cylinder (a prism with a circle base) | $V=\\pi r^2h$ | $r=7$ cm, $h=10$ cm, $\\pi=\\frac{22}{7}$: $V=\\frac{22}{7}\\times49\\times10=1\\,540\\text{ cm}^3$ |\n| Pyramid | $V=\\frac{1}{3}\\times\\text{base area}\\times\\text{height}$ | square base $6\\times6$ cm, height 5 cm: $V=\\frac{1}{3}\\times36\\times5=60\\text{ cm}^3$ |\n| Cone (a pyramid with a circle base) | $V=\\frac{1}{3}\\pi r^2h$ | $r=3$ cm, $h=7$ cm: $V=\\frac{1}{3}\\pi\\times9\\times7=21\\pi\\text{ cm}^3$ |\n| Sphere | $V=\\frac{4}{3}\\pi r^3$ | $r=3$ cm: $V=\\frac{4}{3}\\pi\\times27=36\\pi\\text{ cm}^3$ |',
                'Volume adalah besar ruang di dalam sebuah bangun ruang. Satuannya satuan kubik seperti $\\text{cm}^3$ dan $\\text{m}^3$. Zat cair memakai liter: $1\\text{ L}=1\\,000\\text{ cm}^3$ dan $1\\text{ mL}=1\\text{ cm}^3$.\n\nPrisma adalah tumpukan lapisan yang sama, jadi volumenya adalah luas satu lapisan (alas) kali banyak lapisan (tinggi). Tabung seperti prisma yang alasnya lingkaran, jadi volumenya juga luas alas $\\times$ tinggi $=\\pi r^2\\times h$. Sebuah limas muat tepat tiga kali ke dalam prisma yang alas dan tingginya sama, jadi isinya sepertiga. Kerucut adalah limas yang alasnya lingkaran, jadi ia juga memuat sepertiga tabung yang alas dan tingginya sama.\n\n| Bangun ruang | Volume | Contoh |\n|---|---|---|\n| Prisma | $V=\\text{luas alas}\\times\\text{tinggi}$ | luas alas $6\\text{ cm}^2$, tinggi 10 cm: $V=6\\times10=60\\text{ cm}^3$ |\n| Tabung (prisma beralas lingkaran) | $V=\\pi r^2h$ | $r=7$ cm, $h=10$ cm, $\\pi=\\frac{22}{7}$: $V=\\frac{22}{7}\\times49\\times10=1\\,540\\text{ cm}^3$ |\n| Limas | $V=\\frac{1}{3}\\times\\text{luas alas}\\times\\text{tinggi}$ | alas persegi $6\\times6$ cm, tinggi 5 cm: $V=\\frac{1}{3}\\times36\\times5=60\\text{ cm}^3$ |\n| Kerucut (limas beralas lingkaran) | $V=\\frac{1}{3}\\pi r^2h$ | $r=3$ cm, $h=7$ cm: $V=\\frac{1}{3}\\pi\\times9\\times7=21\\pi\\text{ cm}^3$ |\n| Bola | $V=\\frac{4}{3}\\pi r^3$ | $r=3$ cm: $V=\\frac{4}{3}\\pi\\times27=36\\pi\\text{ cm}^3$ |',
              ),
              figure: {
                ...cylinder2d({ r: 3, h: 5, labels: { r: 'r', h: 'h' } }),
                caption: L('A cylinder with radius r and height h (dashed red lines).', 'Tabung dengan jari-jari r dan tinggi h (garis putus-putus merah).'),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Pouring Water', 'Contoh Bertahap: Menuang Air'),
              body: L(
                'A full cylindrical jug has radius 7 cm and height 20 cm. Its water is poured into an empty box with a base of 20 cm by 14 cm. Use $\\pi=\\frac{22}{7}$. How deep is the water in the box?\n\n1. Step 1: Volume of the water: $V=\\pi r^2h=\\frac{22}{7}\\times7\\times7\\times20=3\\,080\\text{ cm}^3$. In liters this is $3\\,080\\div1\\,000=3.08$ L.\n2. Step 2: Pouring does not change the volume, so the water in the box is also $3\\,080\\text{ cm}^3$.\n3. Step 3: The base of the box has area $20\\times14=280\\text{ cm}^2$, so $280\\times h=3\\,080$.\n4. Step 4: Divide: $h=3\\,080\\div280=11$ cm.\n\n**Remember:**\n\n- The volume of the liquid stays the same when it is poured from one container to another.\n- To find a missing height, divide the volume by the base area: $h=V\\div\\text{base area}$.\n- To change $\\text{cm}^3$ into liters, divide by 1 000.',
                'Sebuah kendi tabung penuh air berjari-jari 7 cm dan tinggi 20 cm. Airnya dituang ke sebuah kotak kosong yang alasnya 20 cm kali 14 cm. Pakai $\\pi=\\frac{22}{7}$. Berapa dalam air di dalam kotak?\n\n1. Langkah 1: Volume air: $V=\\pi r^2h=\\frac{22}{7}\\times7\\times7\\times20=3\\,080\\text{ cm}^3$. Dalam liter ini $3\\,080\\div1\\,000=3{,}08$ L.\n2. Langkah 2: Menuang tidak mengubah volume, jadi air di dalam kotak juga $3\\,080\\text{ cm}^3$.\n3. Langkah 3: Alas kotak luasnya $20\\times14=280\\text{ cm}^2$, jadi $280\\times h=3\\,080$.\n4. Langkah 4: Bagi: $h=3\\,080\\div280=11$ cm.\n\n**Ingat:**\n\n- Volume zat cair tetap sama ketika dituang dari satu wadah ke wadah lain.\n- Untuk mencari tinggi yang hilang, bagi volume dengan luas alas: $h=V\\div\\text{luas alas}$.\n- Untuk mengubah $\\text{cm}^3$ menjadi liter, bagi dengan 1 000.',
              ),
              figure: {
                ...cylinder2d({ r: 7, h: 20, labels: { r: '7', h: '20' } }),
                caption: L('The jug: radius 7 cm, height 20 cm.', 'Kendi: jari-jari 7 cm, tinggi 20 cm.'),
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Step by Step: Cones', 'Contoh Bertahap: Kerucut'),
              body: L(
                'A cone is like a pyramid with a circle for its base. It has a radius $r$, a height $h$ (straight up from the center of the base to the tip) and a slant height $s$ (along the side). Only $r$ and $h$ go into the volume.\n\nFill a cone with sand and pour it into a cylinder with the same base and the same height: you need exactly 3 cones to fill the cylinder. So a cone holds one third of that cylinder.\n\nAn ice-cream cone has radius 3 cm and height 7 cm. Leave $\\pi$ in the answer. How much ice cream fits in the cone?\n\n1. Step 1: Base area: $\\pi r^2=\\pi\\times3^2=9\\pi\\text{ cm}^2$.\n2. Step 2: The cylinder with the same base and height would hold $9\\pi\\times7=63\\pi\\text{ cm}^3$.\n3. Step 3: The cone holds one third of that: $V=\\frac{1}{3}\\times63\\pi=21\\pi\\text{ cm}^3$.\n4. Step 4: With $\\pi\\approx3.14$ this is about $66\\text{ cm}^3$, which is about 66 mL.\n\n**Remember:**\n\n- $V_{\\text{cone}}=\\frac{1}{3}\\pi r^2h$, one third of the cylinder with the same base and height.\n- Use the height $h$, not the slant height $s$.\n- Check: 3 cones of the same size fill 1 cylinder.',
                'Kerucut seperti limas yang alasnya lingkaran. Kerucut punya jari-jari $r$, tinggi $h$ (lurus ke atas dari pusat alas sampai ujung) dan garis pelukis $s$ (sepanjang sisi miring). Hanya $r$ dan $h$ yang dipakai untuk volume.\n\nIsi sebuah kerucut dengan pasir lalu tuang ke tabung yang alas dan tingginya sama: kamu memerlukan tepat 3 kerucut untuk memenuhi tabung itu. Jadi kerucut memuat sepertiga tabung tersebut.\n\nSebuah cone es krim berjari-jari 3 cm dan tinggi 7 cm. Biarkan $\\pi$ dalam jawaban. Berapa banyak es krim yang muat di dalam kerucut?\n\n1. Langkah 1: Luas alas: $\\pi r^2=\\pi\\times3^2=9\\pi\\text{ cm}^2$.\n2. Langkah 2: Tabung dengan alas dan tinggi yang sama memuat $9\\pi\\times7=63\\pi\\text{ cm}^3$.\n3. Langkah 3: Kerucut memuat sepertiganya: $V=\\frac{1}{3}\\times63\\pi=21\\pi\\text{ cm}^3$.\n4. Langkah 4: Dengan $\\pi\\approx3{,}14$ ini sekitar $66\\text{ cm}^3$, yaitu sekitar 66 mL.\n\n**Ingat:**\n\n- $V_{\\text{kerucut}}=\\frac{1}{3}\\pi r^2h$, sepertiga tabung yang alas dan tingginya sama.\n- Pakai tinggi $h$, bukan garis pelukis $s$.\n- Periksa: 3 kerucut yang sama besar memenuhi 1 tabung.',
              ),
              figure: {
                ...cone2d({ r: 3, h: 7, labels: { r: '3', h: '7' } }),
                caption: L('The ice-cream cone: radius 3 cm, height 7 cm (dashed red lines).', 'Cone es krim: jari-jari 3 cm, tinggi 7 cm (garis putus-putus merah).'),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Formulas and Units', 'Awas, Jebakan!: Rumus dan Satuan'),
              body: L(
                '| Wrong | Right |\n|---|---|\n| A cylinder has $r=3$ and $h=5$: $V=\\pi\\times3\\times5=15\\pi$ | The radius is squared: $V=\\pi\\times3^2\\times5=45\\pi$ |\n| A pyramid has volume base area $\\times$ height | A pyramid is one third of the prism: $\\frac{1}{3}\\times\\text{base area}\\times\\text{height}$ |\n| A sphere has diameter 6 cm: $V=\\frac{4}{3}\\pi\\times6^3$ | The formula needs the radius: $r=3$, so $V=\\frac{4}{3}\\pi\\times27=36\\pi$ |\n| $5\\text{ L}=500\\text{ cm}^3$ | $1\\text{ L}=1\\,000\\text{ cm}^3$, so $5\\text{ L}=5\\,000\\text{ cm}^3$ |\n| A cone has volume $\\pi r^2h$ | A cone is one third of the cylinder: $\\frac{1}{3}\\pi r^2h$ |\n| A cone has $r=3$, $h=4$ and slant height $s=5$: $V=\\frac{1}{3}\\pi\\times3^2\\times5=15\\pi$ | Use the height 4, not the slant height 5: $V=\\frac{1}{3}\\pi\\times9\\times4=12\\pi$ |',
                '| Salah | Benar |\n|---|---|\n| Tabung dengan $r=3$ dan $h=5$: $V=\\pi\\times3\\times5=15\\pi$ | Jari-jari dikuadratkan: $V=\\pi\\times3^2\\times5=45\\pi$ |\n| Volume limas adalah luas alas $\\times$ tinggi | Limas adalah sepertiga prisma: $\\frac{1}{3}\\times\\text{luas alas}\\times\\text{tinggi}$ |\n| Bola berdiameter 6 cm: $V=\\frac{4}{3}\\pi\\times6^3$ | Rumus memerlukan jari-jari: $r=3$, jadi $V=\\frac{4}{3}\\pi\\times27=36\\pi$ |\n| $5\\text{ L}=500\\text{ cm}^3$ | $1\\text{ L}=1\\,000\\text{ cm}^3$, jadi $5\\text{ L}=5\\,000\\text{ cm}^3$ |\n| Volume kerucut adalah $\\pi r^2h$ | Kerucut adalah sepertiga tabung: $\\frac{1}{3}\\pi r^2h$ |\n| Kerucut dengan $r=3$, $h=4$, dan garis pelukis $s=5$: $V=\\frac{1}{3}\\pi\\times3^2\\times5=15\\pi$ | Pakai tinggi 4, bukan garis pelukis 5: $V=\\frac{1}{3}\\pi\\times9\\times4=12\\pi$ |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'A pyramid has a square base of 6 cm by 6 cm and a height of 5 cm. What is its volume?',
                'Sebuah limas beralas persegi 6 cm kali 6 cm dan tingginya 5 cm. Berapa volumenya?',
              ),
              figure: {
                ...prism3d({ base: [[0, 0], [6, 0], [6, 6], [0, 6]], h: 5, apex: true }),
                caption: L('A square pyramid: base 6 by 6 cm, height 5 cm.', 'Limas beralas persegi: alas 6 kali 6 cm, tinggi 5 cm.'),
              },
              options: [
                L('$60\\text{ cm}^3$', '$60\\text{ cm}^3$'),
                L('$180\\text{ cm}^3$', '$180\\text{ cm}^3$'),
                L('$36\\text{ cm}^3$', '$36\\text{ cm}^3$'),
                L('$30\\text{ cm}^3$', '$30\\text{ cm}^3$'),
              ],
              answer: 0,
              explain: L(
                'The base area is $6\\times6=36$, so $V=\\frac{1}{3}\\times36\\times5=60\\text{ cm}^3$. The answer 180 forgets the one third, 36 is only the base area, and 30 multiplies one side by the height.',
                'Luas alas $6\\times6=36$, jadi $V=\\frac{1}{3}\\times36\\times5=60\\text{ cm}^3$. Jawaban 180 lupa sepertiganya, 36 hanyalah luas alasnya, dan 30 mengalikan satu sisi dengan tingginya.',
              ),
              hint: L(
                'First find the area of the square base. Then multiply by the height and take one third.',
                'Cari dulu luas alas persegi. Lalu kalikan dengan tinggi dan ambil sepertiganya.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: the volume of a sphere with radius 3 cm, in terms of $\\pi$.',
                'Coba bersama: volume bola berjari-jari 3 cm, dalam $\\pi$.',
              ),
              template: '\\frac{4}{3}\\pi\\times3^3=\\frac{4}{3}\\pi\\times___=___\\pi',
              blanks: ['27', '36'],
              explain: L(
                '$3^3=27$, and $\\frac{4}{3}\\times27=36$. So $V=36\\pi\\text{ cm}^3$.',
                '$3^3=27$, dan $\\frac{4}{3}\\times27=36$. Jadi $V=36\\pi\\text{ cm}^3$.',
              ),
              hint: L(
                'Cube the radius: $3\\times3\\times3$. Then multiply by $\\frac{4}{3}$: divide by 3 first, then multiply by 4.',
                'Pangkatkan tiga jari-jarinya: $3\\times3\\times3$. Lalu kalikan dengan $\\frac{4}{3}$: bagi 3 dulu, lalu kalikan 4.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The base of this prism is a right triangle with legs 6 cm and 8 cm. The prism is 10 cm long. What is its volume?',
                'Alas prisma ini adalah segitiga siku-siku dengan sisi siku-siku 6 cm dan 8 cm. Prisma itu panjangnya 10 cm. Berapa volumenya?',
              ),
              figure: {
                ...prism3d({ base: [[0, 0], [6, 0], [0, 8]], h: 10 }),
                caption: L('A triangular prism, 10 cm long.', 'Prisma segitiga, panjang 10 cm.'),
              },
              options: [
                L('$240\\text{ cm}^3$', '$240\\text{ cm}^3$'),
                L('$480\\text{ cm}^3$', '$480\\text{ cm}^3$'),
                L('$120\\text{ cm}^3$', '$120\\text{ cm}^3$'),
                L('$140\\text{ cm}^3$', '$140\\text{ cm}^3$'),
              ],
              answer: 0,
              explain: L(
                'The base area is $\\frac{1}{2}\\times6\\times8=24\\text{ cm}^2$, so $V=24\\times10=240\\text{ cm}^3$. The answer 480 forgets the half in the triangle, and 140 adds the legs and multiplies by 10.',
                'Luas alas $\\frac{1}{2}\\times6\\times8=24\\text{ cm}^2$, jadi $V=24\\times10=240\\text{ cm}^3$. Jawaban 480 lupa setengah pada segitiga, dan 140 menjumlahkan kedua sisi siku-siku lalu mengalikan 10.',
              ),
              hint: L(
                'Find the area of the triangular base first, with the half. Then multiply by the length of the prism.',
                'Cari dulu luas alas segitiga, dengan setengahnya. Lalu kalikan dengan panjang prisma.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q3',
              prompt: L(
                'A funnel is a cone with radius 6 cm and height 8 cm. Its slant height is 10 cm. What is the volume of the funnel?',
                'Sebuah corong berbentuk kerucut dengan jari-jari 6 cm dan tinggi 8 cm. Garis pelukisnya 10 cm. Berapa volume corong itu?',
              ),
              figure: {
                ...cone2d({ r: 6, h: 8, labels: { r: '6', h: '8', s: '10' } }),
                caption: L('The funnel: radius 6 cm, height 8 cm, slant height 10 cm.', 'Corong: jari-jari 6 cm, tinggi 8 cm, garis pelukis 10 cm.'),
              },
              options: [
                L('$96\\pi\\text{ cm}^3$', '$96\\pi\\text{ cm}^3$'),
                L('$120\\pi\\text{ cm}^3$', '$120\\pi\\text{ cm}^3$'),
                L('$288\\pi\\text{ cm}^3$', '$288\\pi\\text{ cm}^3$'),
                L('$144\\pi\\text{ cm}^3$', '$144\\pi\\text{ cm}^3$'),
              ],
              answer: 0,
              explain: L(
                'The base area is $\\pi\\times6^2=36\\pi$, so $V=\\frac{1}{3}\\times36\\pi\\times8=96\\pi\\text{ cm}^3$. The answer 120π uses the slant height 10 instead of the height 8, 288π forgets the one third, and 144π takes one half.',
                'Luas alas $\\pi\\times6^2=36\\pi$, jadi $V=\\frac{1}{3}\\times36\\pi\\times8=96\\pi\\text{ cm}^3$. Jawaban 120π memakai garis pelukis 10, bukan tinggi 8, 288π lupa sepertiganya, dan 144π mengambil setengah.',
              ),
              hint: L(
                'Which of the three lengths belongs in the formula: the radius, the height or the slant height? Then do not forget the fraction in front.',
                'Dari ketiga panjang itu, mana yang masuk rumus: jari-jari, tinggi, atau garis pelukis? Lalu jangan lupa pecahan di depannya.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan apakah setiap pernyataan Benar atau Salah.'),
              statements: [
                L('A cone with radius 3 cm, height 4 cm and slant height 5 cm has volume $15\\pi\\text{ cm}^3$.', 'Kerucut berjari-jari 3 cm, tinggi 4 cm, dan garis pelukis 5 cm mempunyai volume $15\\pi\\text{ cm}^3$.'),
                L('A pyramid and a prism with the same base and the same height have the same volume.', 'Limas dan prisma dengan alas yang sama dan tinggi yang sama mempunyai volume yang sama.'),
                L('A sphere with radius 6 cm has volume $288\\pi\\text{ cm}^3$.', 'Bola berjari-jari 6 cm mempunyai volume $288\\pi\\text{ cm}^3$.'),
                L('$1$ liter is the same as $100\\text{ cm}^3$.', '$1$ liter sama dengan $100\\text{ cm}^3$.'),
              ],
              answer: [false, false, true, false],
              explain: L(
                'A cone uses the height 4, not the slant height 5: $\\frac{1}{3}\\pi\\times3^2\\times4=12\\pi$. The pyramid has only one third of the volume of the prism. $\\frac{4}{3}\\pi\\times6^3=\\frac{4}{3}\\pi\\times216=288\\pi$. One liter is $1\\,000\\text{ cm}^3$.',
                'Kerucut memakai tinggi 4, bukan garis pelukis 5: $\\frac{1}{3}\\pi\\times3^2\\times4=12\\pi$. Limas hanya punya sepertiga volume prisma. $\\frac{4}{3}\\pi\\times6^3=\\frac{4}{3}\\pi\\times216=288\\pi$. Satu liter adalah $1\\,000\\text{ cm}^3$.',
              ),
              hint: L(
                'Put the numbers into each formula. Remember the one third for a pyramid, and think about how liters and cubic centimeters are linked.',
                'Masukkan angkanya ke setiap rumus. Ingat sepertiga untuk limas, dan pikirkan hubungan antara liter dan sentimeter kubik.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'Choose the TWO correct statements.',
                'Pilih DUA pernyataan yang benar.',
              ),
              options: [
                L('A cylinder with radius 2 cm and height 9 cm has the same volume as a cylinder with radius 3 cm and height 4 cm.', 'Tabung berjari-jari 2 cm dan tinggi 9 cm mempunyai volume yang sama dengan tabung berjari-jari 3 cm dan tinggi 4 cm.'),
                L('If the radius of a cylinder is doubled and the height stays the same, the volume becomes 4 times as large.', 'Jika jari-jari tabung digandakan dan tingginya tetap, volumenya menjadi 4 kali lipat.'),
                L('If the radius of a sphere is doubled, its volume is doubled.', 'Jika jari-jari bola digandakan, volumenya ikut digandakan.'),
                L('A pyramid has the same volume as a prism with the same base and height.', 'Limas mempunyai volume yang sama dengan prisma yang alas dan tingginya sama.'),
              ],
              answer: [0, 1],
              explain: L(
                'Both cylinders have volume $36\\pi$ ($\\pi\\times4\\times9$ and $\\pi\\times9\\times4$). Doubling $r$ in $\\pi r^2h$ multiplies the volume by $2^2=4$. Doubling $r$ in $\\frac{4}{3}\\pi r^3$ multiplies the volume by $2^3=8$, and a pyramid holds only one third of the prism.',
                'Kedua tabung bervolume $36\\pi$ ($\\pi\\times4\\times9$ dan $\\pi\\times9\\times4$). Menggandakan $r$ pada $\\pi r^2h$ mengalikan volume dengan $2^2=4$. Menggandakan $r$ pada $\\frac{4}{3}\\pi r^3$ mengalikan volume dengan $2^3=8$, dan limas hanya memuat sepertiga prisma.',
              ),
              hint: L(
                'Work out the volumes with the formulas. For the doubling questions, try a small radius such as 1 and then 2.',
                'Hitung volumenya dengan rumus. Untuk soal penggandaan, coba jari-jari kecil seperti 1 lalu 2.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'A cylindrical drum has radius 14 cm and height 50 cm, and it is full of water. All the water is poured into an empty box with a rectangular base of 40 cm by 22 cm. Use $\\pi=\\frac{22}{7}$. Find the volume of the water, and the depth of the water in the box.',
                'Sebuah drum berbentuk tabung berjari-jari 14 cm dan tinggi 50 cm, dan penuh berisi air. Seluruh airnya dituang ke sebuah kotak kosong yang alasnya persegi panjang 40 cm kali 22 cm. Pakai $\\pi=\\frac{22}{7}$. Tentukan volume air, dan kedalaman air di dalam kotak.',
              ),
              figure: {
                ...cylinder2d({ r: 14, h: 50, labels: { r: '14', h: '50' } }),
                caption: L('The drum: radius 14 cm, height 50 cm.', 'Drum: jari-jari 14 cm, tinggi 50 cm.'),
              },
              blanks: [
                { label: { en: '\\text{volume} =', id: '\\text{volume} =' }, answer: 30800, after: '\\text{ cm}^3' },
                { label: { en: '\\text{depth} =', id: '\\text{kedalaman} =' }, answer: 35, after: '\\text{ cm}' },
              ],
              hints: [
                L(
                  'The volume of the water is the volume of the cylinder. Which formula do you need?',
                  'Volume air sama dengan volume tabung. Rumus mana yang kamu perlukan?',
                ),
                L(
                  'Use $V=\\pi r^2h$ with $r=14$ and $h=50$. Then the depth in the box is the volume divided by the base area $40\\times22$.',
                  'Pakai $V=\\pi r^2h$ dengan $r=14$ dan $h=50$. Lalu kedalaman di dalam kotak adalah volume dibagi luas alas $40\\times22$.',
                ),
                L(
                  'Work out $\\frac{22}{7}\\times14\\times14\\times50$ by dividing 14 by 7 first. For the depth, divide your volume by 880.',
                  'Hitung $\\frac{22}{7}\\times14\\times14\\times50$ dengan membagi 14 dengan 7 lebih dulu. Untuk kedalaman, bagi volumemu dengan 880.',
                ),
              ],
              explain: L(
                '$V=\\frac{22}{7}\\times14\\times14\\times50=22\\times2\\times14\\times50=30\\,800\\text{ cm}^3$. The base of the box is $40\\times22=880\\text{ cm}^2$, so the depth is $30\\,800\\div880=35$ cm.',
                '$V=\\frac{22}{7}\\times14\\times14\\times50=22\\times2\\times14\\times50=30\\,800\\text{ cm}^3$. Alas kotak $40\\times22=880\\text{ cm}^2$, jadi kedalamannya $30\\,800\\div880=35$ cm.',
              ),
              solution: {
                en: ['V=\\frac{22}{7}\\times14^2\\times50=22\\times28\\times50=30\\,800', '\\text{base}=40\\times22=880', 'h=30\\,800\\div880=35'],
                id: ['V=\\frac{22}{7}\\times14^2\\times50=22\\times28\\times50=30\\,800', '\\text{alas}=40\\times22=880', 'h=30\\,800\\div880=35'],
              },
            },
            {
              kind: 'math',
              id: 'm2',
              prompt: L(
                'A funnel is a cone with radius 14 cm and height 15 cm, and it is full of water. Use $\\pi=\\frac{22}{7}$. Find the volume of the water. The water is then poured into an empty cylinder with the same radius, 14 cm. How deep is the water in the cylinder?',
                'Sebuah corong berbentuk kerucut berjari-jari 14 cm dan tinggi 15 cm, dan penuh berisi air. Pakai $\\pi=\\frac{22}{7}$. Tentukan volume air. Air itu lalu dituang ke sebuah tabung kosong dengan jari-jari yang sama, 14 cm. Berapa dalam air di dalam tabung?',
              ),
              figure: {
                ...cone2d({ r: 14, h: 15, labels: { r: '14', h: '15' } }),
                caption: L('The funnel: radius 14 cm, height 15 cm.', 'Corong: jari-jari 14 cm, tinggi 15 cm.'),
              },
              blanks: [
                { label: { en: '\\text{volume} =', id: '\\text{volume} =' }, answer: 3080, after: '\\text{ cm}^3' },
                { label: { en: '\\text{depth} =', id: '\\text{kedalaman} =' }, answer: 5, after: '\\text{ cm}' },
              ],
              hints: [
                L(
                  'A cone is one third of a cylinder with the same base and height. Write the cone formula first.',
                  'Kerucut adalah sepertiga tabung yang alas dan tingginya sama. Tulis dulu rumus kerucut.',
                ),
                L(
                  'Use $V=\\frac{1}{3}\\pi r^2h$ with $r=14$ and $h=15$. For the depth in the cylinder, divide the volume by the base area $\\pi r^2$.',
                  'Pakai $V=\\frac{1}{3}\\pi r^2h$ dengan $r=14$ dan $h=15$. Untuk kedalaman di dalam tabung, bagi volume dengan luas alas $\\pi r^2$.',
                ),
                L(
                  'Work out $\\frac{1}{3}\\times\\frac{22}{7}\\times14\\times14\\times15$ by dividing 14 by 7 and 15 by 3 first. The base area of the cylinder is $\\frac{22}{7}\\times14\\times14$.',
                  'Hitung $\\frac{1}{3}\\times\\frac{22}{7}\\times14\\times14\\times15$ dengan membagi 14 dengan 7 dan 15 dengan 3 lebih dulu. Luas alas tabung adalah $\\frac{22}{7}\\times14\\times14$.',
                ),
              ],
              explain: L(
                '$V=\\frac{1}{3}\\times\\frac{22}{7}\\times14^2\\times15=22\\times28\\times5=3\\,080\\text{ cm}^3$. The base of the cylinder has area $\\frac{22}{7}\\times14^2=616\\text{ cm}^2$, so the depth is $3\\,080\\div616=5$ cm, one third of the height 15.',
                '$V=\\frac{1}{3}\\times\\frac{22}{7}\\times14^2\\times15=22\\times28\\times5=3\\,080\\text{ cm}^3$. Alas tabung luasnya $\\frac{22}{7}\\times14^2=616\\text{ cm}^2$, jadi kedalamannya $3\\,080\\div616=5$ cm, sepertiga dari tinggi 15.',
              ),
              solution: {
                en: ['V=\\frac{1}{3}\\times\\frac{22}{7}\\times14^2\\times15=22\\times28\\times5=3\\,080', '\\text{base}=\\frac{22}{7}\\times14^2=616', 'h=3\\,080\\div616=5'],
                id: ['V=\\frac{1}{3}\\times\\frac{22}{7}\\times14^2\\times15=22\\times28\\times5=3\\,080', '\\text{alas}=\\frac{22}{7}\\times14^2=616', 'h=3\\,080\\div616=5'],
              },
            },
          ],
        },
      ],
      project: {
        id: 'tka-smp-m6-s3-p',
        runtime: 'math',
        title: L('Balls, Tanks, Pyramids and Cones', 'Bola, Tangki, Limas, dan Kerucut'),
        brief: L(
          'Find volumes of a ball, a cone, a cylinder and a pyramid, a missing height of a tank, and the rise of the water when a ball is dropped in.',
          'Mencari volume bola, kerucut, tabung, dan limas, tinggi tangki yang hilang, serta kenaikan air ketika sebuah bola dijatuhkan ke dalamnya.',
        ),
        requirements: [
          L('Use the volume formulas of the prism, cylinder, pyramid, cone and sphere.', 'Memakai rumus volume prisma, tabung, limas, kerucut, dan bola.'),
          L('Use the fact that a volume of water does not change when it is moved or displaced.', 'Memakai kenyataan bahwa volume air tidak berubah ketika dipindahkan atau terdesak.'),
        ],
        hints: [
          L('Write the formula first, then put in the numbers. Check whether you were given a radius or a diameter.', 'Tulis rumusnya dulu, lalu masukkan angkanya. Periksa apakah yang diberikan jari-jari atau diameter.'),
          L('To find a missing height, divide the volume by the base area.', 'Untuk mencari tinggi yang hilang, bagi volume dengan luas alas.'),
          L('When an object sinks into water, the extra volume of the water is the same as the volume of the object.', 'Ketika sebuah benda tenggelam ke dalam air, tambahan volume air sama dengan volume benda itu.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L(
              'A ball has a radius of 6 cm. Find its volume in terms of $\\pi$. Type your answer like $288\\pi$ as 288pi.',
              'Sebuah bola berjari-jari 6 cm. Tentukan volumenya dalam $\\pi$. Ketik jawabanmu seperti $288\\pi$ sebagai 288pi.',
            ),
            figure: {
              ...sphere2d({ r: 3, label: '6' }),
              caption: L('A ball with radius 6 cm.', 'Bola berjari-jari 6 cm.'),
            },
            blanks: [{ label: 'V =', answer: 288 * Math.PI, after: '\\text{ cm}^3' }],
            solution: ['V=\\frac{4}{3}\\pi r^3=\\frac{4}{3}\\pi\\times6^3', '=\\frac{4}{3}\\pi\\times216=288\\pi'],
          },
          {
            prompt: L(
              'A traffic cone is a cone with radius 6 cm and height 10 cm. Find its volume in terms of $\\pi$. Then find the volume of a cylinder with the same radius and the same height. Type your answers like $288\\pi$ as 288pi.',
              'Sebuah pembatas jalan berbentuk kerucut dengan jari-jari 6 cm dan tinggi 10 cm. Tentukan volumenya dalam $\\pi$. Lalu tentukan volume tabung dengan jari-jari dan tinggi yang sama. Ketik jawabanmu seperti $288\\pi$ sebagai 288pi.',
            ),
            figure: {
              ...cone2d({ r: 6, h: 10, labels: { r: '6', h: '10' } }),
              caption: L('A traffic cone: radius 6 cm, height 10 cm.', 'Kerucut lalu lintas: jari-jari 6 cm, tinggi 10 cm.'),
            },
            blanks: [
              { label: { en: '\\text{cone} =', id: '\\text{kerucut} =' }, answer: 120 * Math.PI, after: '\\text{ cm}^3' },
              { label: { en: '\\text{cylinder} =', id: '\\text{tabung} =' }, answer: 360 * Math.PI, after: '\\text{ cm}^3' },
            ],
            solution: {
              en: ['V_{\\text{cone}}=\\frac{1}{3}\\pi\\times6^2\\times10=\\frac{1}{3}\\times360\\pi=120\\pi', 'V_{\\text{cylinder}}=\\pi\\times6^2\\times10=360\\pi'],
              id: ['V_{\\text{kerucut}}=\\frac{1}{3}\\pi\\times6^2\\times10=\\frac{1}{3}\\times360\\pi=120\\pi', 'V_{\\text{tabung}}=\\pi\\times6^2\\times10=360\\pi'],
            },
          },
          {
            prompt: L(
              'A cylindrical water tank has a radius of 7 dm. When it is full it holds 4,620 liters (remember $1\\text{ L}=1\\text{ dm}^3$). Use $\\pi=\\frac{22}{7}$. Find the area of the base, and the height of the tank.',
              'Sebuah tangki air berbentuk tabung berjari-jari 7 dm. Ketika penuh, tangki itu memuat 4.620 liter (ingat $1\\text{ L}=1\\text{ dm}^3$). Pakai $\\pi=\\frac{22}{7}$. Tentukan luas alas, dan tinggi tangki.',
            ),
            blanks: [
              { label: { en: '\\text{base area} =', id: '\\text{luas alas} =' }, answer: 154, after: '\\text{ dm}^2' },
              { label: { en: '\\text{height} =', id: '\\text{tinggi} =' }, answer: 30, after: '\\text{ dm}' },
            ],
            solution: {
              en: ['\\text{base}=\\frac{22}{7}\\times7\\times7=154', '154\\times h=4\\,620', 'h=4\\,620\\div154=30'],
              id: ['\\text{alas}=\\frac{22}{7}\\times7\\times7=154', '154\\times h=4\\,620', 'h=4\\,620\\div154=30'],
            },
          },
          {
            prompt: L(
              'A cylindrical tank of radius 12 cm holds enough water to cover a ball. A ball of radius 6 cm is dropped in and sinks completely, and no water spills. Find the volume of the ball in terms of $\\pi$, and how many centimeters the water level rises. Type the volume like $288\\pi$ as 288pi.',
              'Sebuah tangki tabung berjari-jari 12 cm berisi air yang cukup untuk menutupi sebuah bola. Sebuah bola berjari-jari 6 cm dijatuhkan dan tenggelam seluruhnya, dan tidak ada air yang tumpah. Tentukan volume bola dalam $\\pi$, dan berapa sentimeter permukaan air naik. Ketik volumenya seperti $288\\pi$ sebagai 288pi.',
            ),
            figure: {
              ...cylinder2d({ r: 12, h: 20, labels: { r: '12' } }),
              caption: L('The tank has radius 12 cm.', 'Tangki berjari-jari 12 cm.'),
            },
            blanks: [
              { label: { en: '\\text{ball} =', id: '\\text{bola} =' }, answer: 288 * Math.PI, after: '\\text{ cm}^3' },
              { label: { en: '\\text{rise} =', id: '\\text{kenaikan} =' }, answer: 2, after: '\\text{ cm}' },
            ],
            solution: {
              en: ['V_{\\text{ball}}=\\frac{4}{3}\\pi\\times6^3=288\\pi', '\\text{rise}\\times\\pi\\times12^2=288\\pi', '\\text{rise}=\\frac{288\\pi}{144\\pi}=2'],
              id: ['V_{\\text{bola}}=\\frac{4}{3}\\pi\\times6^3=288\\pi', '\\text{kenaikan}\\times\\pi\\times12^2=288\\pi', '\\text{kenaikan}=\\frac{288\\pi}{144\\pi}=2'],
            },
          },
        ],
      },
    },
  ],
}
