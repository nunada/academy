import type { Submodule } from '../types'
import { L, arrow, dot, line, plane } from './figs'
import type { FigItem } from '../../lib/figure'

/** Module 4 — vectors in the plane and in space. */

const dashed = (to: [number, number], from: [number, number], color: 'a' | 'b' | 'muted' = 'muted'): FigItem => ({ t: 'vec', from, to, color, dashed: true })

export const m4s1: Submodule = {
  id: 'tka-sml-m4-s1',
  title: L('Vectors in the Plane and in Space', 'Vektor pada Bidang dan Ruang'),
  summary: L(
    'Components and length of a vector, adding and scaling vectors, and the dot product with the angle between two vectors.',
    'Komponen dan panjang vektor, menjumlah dan mengalikan skalar vektor, serta hasil kali titik dan sudut antara dua vektor.',
  ),
  lessons: [
    /* ------------------------------------------------- L1 components, length */
    {
      id: 'tka-sml-m4-s1-l1',
      title: L('Components and Length', 'Komponen dan Panjang'),
      goal: L(
        'You can write a vector from two points, find its length in the plane and in space, and make a unit vector.',
        'Kamu bisa menulis vektor dari dua titik, mencari panjangnya pada bidang dan ruang, dan membuat vektor satuan.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: An Arrow Between Two Points', 'Ayo Amati: Anak Panah di Antara Dua Titik'),
          body: L(
            'A **vector** has a length and a direction, and is written with **components**, for example $\\mathbf{a}=(3,2)$: $3$ to the right and $2$ up. In space it has three components $(x,y,z)$.\n\nThe vector from $A$ to $B$ is\n\n$$\\vec{AB}=B-A\\quad\\text{(end minus start)}$$\n\nFor $A(1,1)$ and $B(4,3)$: $\\vec{AB}=(4-1,\\,3-1)=(3,2)$. A vector has **no fixed position**: the dashed arrow from the origin is the same vector.',
            '**Vektor** memiliki panjang dan arah, dan ditulis dengan **komponen**, misalnya $\\mathbf{a}=(3,2)$: $3$ ke kanan dan $2$ ke atas. Di ruang ia punya tiga komponen $(x,y,z)$.\n\nVektor dari $A$ ke $B$ adalah\n\n$$\\vec{AB}=B-A\\quad\\text{(ujung dikurangi pangkal)}$$\n\nUntuk $A(1,1)$ dan $B(4,3)$: $\\vec{AB}=(4-1,\\,3-1)=(3,2)$. Vektor **tidak punya posisi tetap**: anak panah putus-putus dari titik asal adalah vektor yang sama.',
          ),
          figure: {
            ...plane(
              [arrow([4, 3], 'AB', 'a', [1, 1]), dashed([3, 2], [0, 0]), dot([1, 1], 'A', 'result'), dot([4, 3], 'B', 'result')],
              { x: [-1, 6], y: [-1, 5] },
            ),
            caption: L('The vector AB from A to B, and the same vector drawn from the origin (dashed).', 'Vektor AB dari A ke B, dan vektor yang sama digambar dari titik asal (putus-putus).'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Length and Unit Vector', 'Contoh Bertahap: Panjang dan Vektor Satuan'),
          body: L(
            'The **length** (magnitude) follows from Pythagoras:\n\n$$|\\mathbf{a}|=\\sqrt{a_1^2+a_2^2}\\qquad|\\mathbf{a}|=\\sqrt{a_1^2+a_2^2+a_3^2}\\ \\text{(space)}$$\n\n1. Step 1: $|(3,4)|=\\sqrt{9+16}=5$.\n2. Step 2: $|(1,2,2)|=\\sqrt{1+4+4}=3$.\n3. Step 3: A **unit vector** has length $1$. Divide a vector by its length: $\\dfrac{(3,4)}{5}=\\left(\\frac35,\\frac45\\right)$.\n4. Step 4: The distance between $A$ and $B$ is $|\\vec{AB}|$.',
            '**Panjang** (besar) vektor berasal dari Pythagoras:\n\n$$|\\mathbf{a}|=\\sqrt{a_1^2+a_2^2}\\qquad|\\mathbf{a}|=\\sqrt{a_1^2+a_2^2+a_3^2}\\ \\text{(ruang)}$$\n\n1. Langkah 1: $|(3,4)|=\\sqrt{9+16}=5$.\n2. Langkah 2: $|(1,2,2)|=\\sqrt{1+4+4}=3$.\n3. Langkah 3: **Vektor satuan** berpanjang $1$. Bagi vektor dengan panjangnya: $\\dfrac{(3,4)}{5}=\\left(\\frac35,\\frac45\\right)$.\n4. Langkah 4: Jarak antara $A$ dan $B$ adalah $|\\vec{AB}|$.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Watch Out!: Direction and Space', 'Awas, Jebakan!: Arah dan Ruang'),
          body: L(
            '- $\\vec{AB}=B-A$, **not** $A-B$. The other order gives the opposite vector $\\vec{BA}=-\\vec{AB}$.\n- Do not add the components to get the length: $|(3,4)|=5$, not $7$.\n- In space the third component counts: for $A(1,2,3)$ and $B(4,6,3)$ we get $\\vec{AB}=(3,4,0)$ and $|\\vec{AB}|=5$, because the points have the same height.\n\nTwo vectors are **parallel** when one is a multiple of the other: $(2,-4,6)=2\\cdot(1,-2,3)$.',
            '- $\\vec{AB}=B-A$, **bukan** $A-B$. Urutan yang lain memberi vektor berlawanan $\\vec{BA}=-\\vec{AB}$.\n- Jangan menjumlahkan komponen untuk mendapat panjang: $|(3,4)|=5$, bukan $7$.\n- Di ruang komponen ketiga ikut dihitung: untuk $A(1,2,3)$ dan $B(4,6,3)$ didapat $\\vec{AB}=(3,4,0)$ dan $|\\vec{AB}|=5$, karena kedua titik sama tingginya.\n\nDua vektor **sejajar** bila yang satu kelipatan yang lain: $(2,-4,6)=2\\cdot(1,-2,3)$.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'What is the length of the vector PQ in the picture?',
            'Berapa panjang vektor PQ pada gambar?',
          ),
          figure: {
            ...plane([arrow([5, 4], 'PQ', 'a', [1, 1]), dot([1, 1], 'P', 'result'), dot([5, 4], 'Q', 'result')], { x: [-1, 7], y: [-1, 6] }),
            caption: L('A vector from P(1, 1) to Q(5, 4).', 'Vektor dari P(1, 1) ke Q(5, 4).'),
          },
          options: ['5', '7', '25', '1', '4'].map((s) => L(`$${s}$`, `$${s}$`)),
          answer: 0,
          explain: L(
            '$\\vec{PQ}=(5-1,\\,4-1)=(4,3)$ and $|\\vec{PQ}|=\\sqrt{16+9}=5$. The value $7$ adds the components, and $25$ forgets the square root.',
            '$\\vec{PQ}=(5-1,\\,4-1)=(4,3)$ dan $|\\vec{PQ}|=\\sqrt{16+9}=5$. Nilai $7$ menjumlahkan komponen, dan $25$ lupa akar kuadrat.',
          ),
          hint: L(
            'Subtract the start from the end to get the components, then use Pythagoras.',
            'Kurangkan pangkal dari ujung untuk mendapat komponen, lalu pakai Pythagoras.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L('Try it together: $A(1,2)$ and $B(4,6)$.', 'Coba bersama: $A(1,2)$ dan $B(4,6)$.'),
          template: '\\vec{AB}=(4-1,\\ 6-2)=(___,\\ ___) \\qquad |\\vec{AB}|=___',
          blanks: ['3', '4', '5'],
          explain: L('$\\vec{AB}=(3,4)$ and $\\sqrt{9+16}=5$.', '$\\vec{AB}=(3,4)$ dan $\\sqrt{9+16}=5$.'),
          hint: L('End minus start, then the square root of the sum of squares.', 'Ujung dikurangi pangkal, lalu akar dari jumlah kuadrat.'),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L('$|(2,-3,6)|=7$', '$|(2,-3,6)|=7$'),
            L('$\\vec{AB}=B-A$', '$\\vec{AB}=B-A$'),
            L('$|\\mathbf{a}|=a_1+a_2$ for $\\mathbf{a}=(a_1,a_2)$', '$|\\mathbf{a}|=a_1+a_2$ untuk $\\mathbf{a}=(a_1,a_2)$'),
            L('$\\vec{AB}=\\vec{BA}$', '$\\vec{AB}=\\vec{BA}$'),
          ],
          answer: [0, 1],
          explain: L(
            '$\\sqrt{4+9+36}=\\sqrt{49}=7$. The length is a square root of a sum of squares, not a sum of components. And $\\vec{BA}$ is the opposite of $\\vec{AB}$.',
            '$\\sqrt{4+9+36}=\\sqrt{49}=7$. Panjang adalah akar dari jumlah kuadrat, bukan jumlah komponen. Dan $\\vec{BA}$ berlawanan dengan $\\vec{AB}$.',
          ),
          hint: L('Compute $|(2,-3,6)|$ and recall which end is subtracted.', 'Hitung $|(2,-3,6)|$ dan ingat ujung mana yang dikurangkan.'),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L(
            'Let $\\mathbf{u}=(1,1,-1)$ and $\\mathbf{v}=(1,2,2)$. Decide whether each statement is True or False.',
            'Misalkan $\\mathbf{u}=(1,1,-1)$ dan $\\mathbf{v}=(1,2,2)$. Tentukan tiap pernyataan Benar atau Salah.',
          ),
          statements: [
            L('$|\\mathbf{v}|=3$', '$|\\mathbf{v}|=3$'),
            L('$|\\mathbf{u}|=\\sqrt{3}$', '$|\\mathbf{u}|=\\sqrt{3}$'),
            L('$\\dfrac{1}{\\sqrt3}\\mathbf{u}$ is a unit vector.', '$\\dfrac{1}{\\sqrt3}\\mathbf{u}$ adalah vektor satuan.'),
            L('$|\\mathbf{u}|=3$', '$|\\mathbf{u}|=3$'),
          ],
          answer: [true, true, true, false],
          explain: L(
            '$|\\mathbf{v}|=\\sqrt{1+4+4}=3$ and $|\\mathbf{u}|=\\sqrt{1+1+1}=\\sqrt3$. Dividing by the length gives a unit vector. So $|\\mathbf{u}|=3$ is false.',
            '$|\\mathbf{v}|=\\sqrt{1+4+4}=3$ dan $|\\mathbf{u}|=\\sqrt{1+1+1}=\\sqrt3$. Membagi dengan panjang memberi vektor satuan. Jadi $|\\mathbf{u}|=3$ salah.',
          ),
          hint: L('Square each component and add.', 'Kuadratkan tiap komponen dan jumlahkan.'),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'Find the distance between $A(1,2,3)$ and $B(3,6,7)$.',
            'Cari jarak antara $A(1,2,3)$ dan $B(3,6,7)$.',
          ),
          blanks: [{ answer: 6 }],
          hints: [
            L('The distance is the length of $\\vec{AB}$.', 'Jarak adalah panjang $\\vec{AB}$.'),
            L('$\\vec{AB}=(2,4,4)$.', '$\\vec{AB}=(2,4,4)$.'),
            L('$\\sqrt{4+16+16}$.', '$\\sqrt{4+16+16}$.'),
          ],
          explain: L('$\\sqrt{4+16+16}=\\sqrt{36}=6$.', '$\\sqrt{4+16+16}=\\sqrt{36}=6$.'),
          solution: ['\\vec{AB}=(2,4,4)', '|\\vec{AB}|=\\sqrt{4+16+16}=6'],
        },
      ],
    },
    /* ------------------------------------------------------ L2 operations */
    {
      id: 'tka-sml-m4-s1-l2',
      title: L('Adding and Scaling Vectors', 'Menjumlah dan Mengalikan Skalar Vektor'),
      goal: L(
        'You can add and subtract vectors, multiply a vector by a number, and use vectors for a moving boat.',
        'Kamu bisa menjumlah dan mengurangi vektor, mengalikan vektor dengan bilangan, dan memakai vektor untuk perahu yang bergerak.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Head to Tail', 'Ayo Amati: Ujung ke Pangkal'),
          body: L(
            'To add vectors, add the components: $(3,1)+(1,2)=(4,3)$. As a picture, place the **tail** of the second vector at the **head** of the first; the sum goes from the first tail to the last head. This makes a parallelogram.\n\nMultiplying by a number $k$ multiplies each component and stretches the arrow: $2(3,1)=(6,2)$, and $k<0$ turns it around. Subtracting is adding the opposite: $\\mathbf{u}-\\mathbf{v}=\\mathbf{u}+(-\\mathbf{v})$.',
            'Untuk menjumlahkan vektor, jumlahkan komponennya: $(3,1)+(1,2)=(4,3)$. Sebagai gambar, letakkan **pangkal** vektor kedua di **ujung** vektor pertama; jumlahnya dari pangkal pertama ke ujung terakhir. Ini membentuk jajargenjang.\n\nMengalikan dengan bilangan $k$ mengalikan tiap komponen dan meregangkan anak panah: $2(3,1)=(6,2)$, dan $k<0$ membaliknya. Mengurang adalah menjumlah lawannya: $\\mathbf{u}-\\mathbf{v}=\\mathbf{u}+(-\\mathbf{v})$.',
          ),
          figure: {
            ...plane(
              [
                arrow([3, 1], 'u', 'a'),
                arrow([1, 2], 'v', 'b'),
                dashed([4, 3], [3, 1], 'b'),
                dashed([4, 3], [1, 2], 'a'),
                arrow([4, 3], 'u+v', 'result'),
              ],
              { x: [-1, 6], y: [-1, 5] },
            ),
            caption: L('u (green) and v (orange) with their sum u + v (red).', 'u (hijau) dan v (oranye) dengan jumlahnya u + v (merah).'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Operations in Space', 'Contoh Bertahap: Operasi di Ruang'),
          body: L(
            'Let $\\mathbf{u}=(2,-1,3)$ and $\\mathbf{v}=(-1,4,2)$. Work component by component.\n\n1. Step 1: $\\mathbf{u}+\\mathbf{v}=(2-1,\\,-1+4,\\,3+2)=(1,3,5)$.\n2. Step 2: $\\mathbf{u}-\\mathbf{v}=(2+1,\\,-1-4,\\,3-2)=(3,-5,1)$.\n3. Step 3: $2\\mathbf{u}-\\mathbf{v}=(4+1,\\,-2-4,\\,6-2)=(5,-6,4)$.\n\nTo find an unknown component, equate components. If $\\mathbf{w}=\\mathbf{u}-\\mathbf{v}$ with $\\mathbf{u}=(2,1,-1)$ and $\\mathbf{v}=(2,v_1,3)$, then $\\mathbf{w}=(0,\\,1-v_1,\\,-4)$.',
            'Misalkan $\\mathbf{u}=(2,-1,3)$ dan $\\mathbf{v}=(-1,4,2)$. Kerjakan komponen demi komponen.\n\n1. Langkah 1: $\\mathbf{u}+\\mathbf{v}=(2-1,\\,-1+4,\\,3+2)=(1,3,5)$.\n2. Langkah 2: $\\mathbf{u}-\\mathbf{v}=(2+1,\\,-1-4,\\,3-2)=(3,-5,1)$.\n3. Langkah 3: $2\\mathbf{u}-\\mathbf{v}=(4+1,\\,-2-4,\\,6-2)=(5,-6,4)$.\n\nUntuk mencari komponen yang belum diketahui, samakan komponen-komponennya. Jika $\\mathbf{w}=\\mathbf{u}-\\mathbf{v}$ dengan $\\mathbf{u}=(2,1,-1)$ dan $\\mathbf{v}=(2,v_1,3)$, maka $\\mathbf{w}=(0,\\,1-v_1,\\,-4)$.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: A Boat Crossing a River', 'Contoh Bertahap: Perahu Menyeberangi Sungai'),
          body: L(
            'Velocities are vectors, so they add. A river is $60$ m wide. A boat heads straight across at $30$ m/min, while the current carries it along the bank at $12$ m/min.\n\n1. Step 1: Velocity of the boat in still water: $(0,30)$ (across). Current: $(12,0)$ (along the bank).\n2. Step 2: The real velocity is the sum $(12,30)$.\n3. Step 3: Time to cross $60$ m at $30$ m/min: $\\frac{60}{30}=2$ min.\n4. Step 4: In that time the current moves the boat $12\\times2=24$ m along the bank.\n\nThe boat lands $24$ m from the point straight opposite its start. The two directions do not interfere: **across** and **along** are separate components.',
            'Kecepatan adalah vektor, jadi dijumlahkan. Sebuah sungai selebar $60$ m. Sebuah perahu mengarah lurus ke seberang dengan $30$ m/menit, sedangkan arus membawanya sepanjang tepi dengan $12$ m/menit.\n\n1. Langkah 1: Kecepatan perahu di air tenang: $(0,30)$ (ke seberang). Arus: $(12,0)$ (sepanjang tepi).\n2. Langkah 2: Kecepatan sebenarnya adalah jumlahnya $(12,30)$.\n3. Langkah 3: Waktu menyeberang $60$ m dengan $30$ m/menit: $\\frac{60}{30}=2$ menit.\n4. Langkah 4: Dalam waktu itu arus menggeser perahu $12\\times2=24$ m sepanjang tepi.\n\nPerahu mendarat $24$ m dari titik yang lurus berseberangan dengan titik awalnya. Kedua arah tidak saling mengganggu: **ke seberang** dan **sepanjang tepi** adalah komponen yang terpisah.',
          ),
        },
        {
          kind: 'concept',
          id: 'c4',
          title: L('Step by Step: A Point That Divides a Segment', 'Contoh Bertahap: Titik yang Membagi Ruas'),
          body: L(
            'Vectors describe shapes. If the point $T$ is on $AB$ with $AT:TB=m:n$, then $\\vec{AT}=\\frac{m}{m+n}\\vec{AB}$, and\n\n$$T=\\frac{n\\,A+m\\,B}{m+n}$$\n\nTake $A(6,0)$ and $B(0,6)$ with $AT:TB=1:2$.\n\n1. Step 1: $\\vec{AB}=(-6,6)$.\n2. Step 2: $\\vec{AT}=\\frac13(-6,6)=(-2,2)$.\n3. Step 3: $T=A+\\vec{AT}=(6-2,\\,0+2)=(4,2)$.\n\nThe midpoint $M=\\frac{A+B}{2}=(3,3)$ is the case $m=n$. Notice that the **nearer** end gets the **smaller** share: $T$ is closer to $A$.',
            'Vektor menggambarkan bangun. Jika titik $T$ ada pada $AB$ dengan $AT:TB=m:n$, maka $\\vec{AT}=\\frac{m}{m+n}\\vec{AB}$, dan\n\n$$T=\\frac{n\\,A+m\\,B}{m+n}$$\n\nAmbil $A(6,0)$ dan $B(0,6)$ dengan $AT:TB=1:2$.\n\n1. Langkah 1: $\\vec{AB}=(-6,6)$.\n2. Langkah 2: $\\vec{AT}=\\frac13(-6,6)=(-2,2)$.\n3. Langkah 3: $T=A+\\vec{AT}=(6-2,\\,0+2)=(4,2)$.\n\nTitik tengah $M=\\frac{A+B}{2}=(3,3)$ adalah kasus $m=n$. Perhatikan bahwa ujung yang **lebih dekat** mendapat bagian yang **lebih kecil**: $T$ lebih dekat ke $A$.',
          ),
          figure: {
            ...plane(
              [line([6, 0], [0, 6], 'a'), dot([6, 0], 'A', 'result'), dot([0, 6], 'B', 'result'), dot([4, 2], 'T', 'b'), dot([3, 3], 'M', 'c')],
              { x: [-1, 8], y: [-1, 8] },
            ),
            caption: L('T divides AB in the ratio 1 : 2, and M is the midpoint.', 'T membagi AB dengan perbandingan 1 : 2, dan M adalah titik tengah.'),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The picture shows u and v. Which vector is u + v?',
            'Gambar menunjukkan u dan v. Vektor manakah u + v?',
          ),
          figure: {
            ...plane([arrow([3, 1], 'u', 'a'), arrow([1, 2], 'v', 'b')], { x: [-1, 6], y: [-1, 5] }),
            caption: L('u = (3, 1) in green and v = (1, 2) in orange.', 'u = (3, 1) berwarna hijau dan v = (1, 2) berwarna oranye.'),
          },
          options: ['(4,3)', '(2,-1)', '(3,2)', '(2,1)', '(4,-1)'].map((s) => L(`$${s}$`, `$${s}$`)),
          answer: 0,
          explain: L(
            'Add the components: $(3+1,\\,1+2)=(4,3)$. The option $(2,-1)$ is $\\mathbf{u}-\\mathbf{v}$, and $(3,2)$ multiplies the components instead of adding them.',
            'Jumlahkan komponen: $(3+1,\\,1+2)=(4,3)$. Pilihan $(2,-1)$ adalah $\\mathbf{u}-\\mathbf{v}$, dan $(3,2)$ mengalikan komponen, bukan menjumlahkannya.',
          ),
          hint: L('Read the components of $\\mathbf{u}$ and $\\mathbf{v}$ from the picture, then add.', 'Baca komponen $\\mathbf{u}$ dan $\\mathbf{v}$ dari gambar, lalu jumlahkan.'),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L('Try it together: add the vectors.', 'Coba bersama: jumlahkan vektor-vektornya.'),
          template: '(2,-1,3)+(-1,4,2)=(___,\\ ___,\\ ___)',
          blanks: ['1', '3', '5'],
          explain: L('$2-1=1$, $-1+4=3$ and $3+2=5$.', '$2-1=1$, $-1+4=3$, dan $3+2=5$.'),
          hint: L('Add the first components, then the second, then the third.', 'Jumlahkan komponen pertama, lalu kedua, lalu ketiga.'),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L(
            'Let $\\mathbf{u}=(2,1,-1)$, $\\mathbf{v}=(2,v_1,3)$ and $\\mathbf{w}=(0,w_1,w_2)$ with $\\mathbf{w}=\\mathbf{u}-\\mathbf{v}$. Choose ALL possible pairs $(v_1,w_1)$.',
            'Misalkan $\\mathbf{u}=(2,1,-1)$, $\\mathbf{v}=(2,v_1,3)$ dan $\\mathbf{w}=(0,w_1,w_2)$ dengan $\\mathbf{w}=\\mathbf{u}-\\mathbf{v}$. Pilih SEMUA pasangan $(v_1,w_1)$ yang mungkin.',
          ),
          options: [
            L('$v_1=0$ and $w_1=1$', '$v_1=0$ dan $w_1=1$'),
            L('$v_1=3$ and $w_1=-2$', '$v_1=3$ dan $w_1=-2$'),
            L('$v_1=1$ and $w_1=1$', '$v_1=1$ dan $w_1=1$'),
            L('$v_1=2$ and $w_1=0$', '$v_1=2$ dan $w_1=0$'),
            L('$v_1=-1$ and $w_1=2$', '$v_1=-1$ dan $w_1=2$'),
          ],
          answer: [0, 1, 4],
          explain: L(
            'The second component of $\\mathbf{u}-\\mathbf{v}$ is $w_1=1-v_1$. So $v_1=0$ gives $1$, $v_1=3$ gives $-2$, and $v_1=-1$ gives $2$. For $v_1=1$ it would be $0$, and for $v_1=2$ it would be $-1$.',
            'Komponen kedua $\\mathbf{u}-\\mathbf{v}$ adalah $w_1=1-v_1$. Jadi $v_1=0$ memberi $1$, $v_1=3$ memberi $-2$, dan $v_1=-1$ memberi $2$. Untuk $v_1=1$ nilainya $0$, dan untuk $v_1=2$ nilainya $-1$.',
          ),
          hint: L('Write $w_1$ in terms of $v_1$ first: subtract the second components.', 'Tulis dulu $w_1$ dalam $v_1$: kurangkan komponen kedua.'),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L(
            'Let $\\mathbf{u}=(2,-1,3)$ and $\\mathbf{v}=(-1,4,2)$. Decide whether each statement is True or False.',
            'Misalkan $\\mathbf{u}=(2,-1,3)$ dan $\\mathbf{v}=(-1,4,2)$. Tentukan tiap pernyataan Benar atau Salah.',
          ),
          statements: [
            L('$\\mathbf{u}+\\mathbf{v}=(1,3,5)$', '$\\mathbf{u}+\\mathbf{v}=(1,3,5)$'),
            L('$2\\mathbf{u}-\\mathbf{v}=(5,-6,4)$', '$2\\mathbf{u}-\\mathbf{v}=(5,-6,4)$'),
            L('$\\mathbf{u}-\\mathbf{v}=(3,3,1)$', '$\\mathbf{u}-\\mathbf{v}=(3,3,1)$'),
            L('$|\\mathbf{u}|=\\sqrt{14}$', '$|\\mathbf{u}|=\\sqrt{14}$'),
          ],
          answer: [true, true, false, true],
          explain: L(
            'Component by component: $\\mathbf{u}-\\mathbf{v}=(2+1,\\,-1-4,\\,3-2)=(3,-5,1)$, so the second component is $-5$, not $3$. And $|\\mathbf{u}|=\\sqrt{4+1+9}=\\sqrt{14}$.',
            'Komponen demi komponen: $\\mathbf{u}-\\mathbf{v}=(2+1,\\,-1-4,\\,3-2)=(3,-5,1)$, jadi komponen kedua $-5$, bukan $3$. Dan $|\\mathbf{u}|=\\sqrt{4+1+9}=\\sqrt{14}$.',
          ),
          hint: L('Compute each result one component at a time.', 'Hitung tiap hasil satu komponen demi satu komponen.'),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'A river is $60$ m wide. A boat heads straight across at $30$ m/min and the current is $12$ m/min along the bank. How many metres downstream does the boat land from the point straight opposite its start?',
            'Sebuah sungai selebar $60$ m. Perahu mengarah lurus ke seberang dengan $30$ m/menit dan arus $12$ m/menit sepanjang tepi. Berapa meter ke hilir perahu mendarat dari titik yang lurus berseberangan dengan titik awalnya?',
          ),
          blanks: [{ answer: 24, after: '\\text{m}' }],
          hints: [
            L('First find the time to cross.', 'Cari dulu waktu menyeberang.'),
            L('Time $=\\frac{60}{30}=2$ minutes.', 'Waktu $=\\frac{60}{30}=2$ menit.'),
            L('The current moves the boat $12$ m each minute.', 'Arus menggeser perahu $12$ m tiap menit.'),
          ],
          explain: L('In $2$ minutes the current moves the boat $12\\times2=24$ m.', 'Dalam $2$ menit arus menggeser perahu $12\\times2=24$ m.'),
          solution: ['t=\\frac{60}{30}=2', 'd=12\\times2=24'],
        },
      ],
    },
    /* --------------------------------------------- L3 dot product and angle */
    {
      id: 'tka-sml-m4-s1-l3',
      title: L('The Dot Product and the Angle', 'Hasil Kali Titik dan Sudut'),
      goal: L(
        'You can compute a dot product, find the angle between two vectors, test for perpendicular vectors, and project one vector on another.',
        'Kamu bisa menghitung hasil kali titik, mencari sudut antara dua vektor, menguji vektor yang tegak lurus, dan memproyeksikan satu vektor pada vektor lain.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Two Ways to Write the Dot Product', 'Ayo Amati: Dua Cara Menulis Hasil Kali Titik'),
          body: L(
            'The **dot product** of two vectors is a **number**:\n\n$$\\mathbf{a}\\cdot\\mathbf{b}=a_1b_1+a_2b_2+a_3b_3=|\\mathbf{a}||\\mathbf{b}|\\cos\\theta$$\n\nwhere $\\theta$ is the angle between them.\n\nFor $\\mathbf{a}=(3,1)$ and $\\mathbf{b}=(1,3)$ (see the picture): $\\mathbf{a}\\cdot\\mathbf{b}=3+3=6$ and $|\\mathbf{a}||\\mathbf{b}|=\\sqrt{10}\\cdot\\sqrt{10}=10$. So\n\n$$\\cos\\theta=\\frac{6}{10}=\\frac35$$\n\nEqual formulas give the angle: $\\cos\\theta=\\dfrac{\\mathbf{a}\\cdot\\mathbf{b}}{|\\mathbf{a}||\\mathbf{b}|}$.',
            '**Hasil kali titik** dua vektor adalah sebuah **bilangan**:\n\n$$\\mathbf{a}\\cdot\\mathbf{b}=a_1b_1+a_2b_2+a_3b_3=|\\mathbf{a}||\\mathbf{b}|\\cos\\theta$$\n\ndengan $\\theta$ sudut di antara keduanya.\n\nUntuk $\\mathbf{a}=(3,1)$ dan $\\mathbf{b}=(1,3)$ (lihat gambar): $\\mathbf{a}\\cdot\\mathbf{b}=3+3=6$ dan $|\\mathbf{a}||\\mathbf{b}|=\\sqrt{10}\\cdot\\sqrt{10}=10$. Jadi\n\n$$\\cos\\theta=\\frac{6}{10}=\\frac35$$\n\nKedua rumus yang sama itu memberi sudut: $\\cos\\theta=\\dfrac{\\mathbf{a}\\cdot\\mathbf{b}}{|\\mathbf{a}||\\mathbf{b}|}$.',
          ),
          figure: {
            ...plane(
              [arrow([3, 1], 'a', 'a'), arrow([1, 3], 'b', 'b'), { t: 'angle', from: [3, 1], to: [1, 3], label: 'θ' }],
              { x: [-1, 5], y: [-1, 5] },
            ),
            caption: L('The angle θ between a = (3, 1) and b = (1, 3).', 'Sudut θ antara a = (3, 1) dan b = (1, 3).'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Angles and Perpendicular Vectors', 'Contoh Bertahap: Sudut dan Vektor Tegak Lurus'),
          body: L(
            'Find the angle between $\\mathbf{a}=(1,1,0)$ and $\\mathbf{b}=(0,1,1)$.\n\n1. Step 1: $\\mathbf{a}\\cdot\\mathbf{b}=0+1+0=1$.\n2. Step 2: $|\\mathbf{a}|=|\\mathbf{b}|=\\sqrt2$.\n3. Step 3: $\\cos\\theta=\\dfrac{1}{\\sqrt2\\cdot\\sqrt2}=\\dfrac12$, so $\\theta=60^{\\circ}$.\n\nTwo non-zero vectors are **perpendicular** exactly when $\\mathbf{a}\\cdot\\mathbf{b}=0$, since $\\cos90^{\\circ}=0$. For example $(2,-1)\\cdot(1,2)=2-2=0$.\n\nThe dot product is positive for an acute angle and negative for an obtuse angle.',
            'Cari sudut antara $\\mathbf{a}=(1,1,0)$ dan $\\mathbf{b}=(0,1,1)$.\n\n1. Langkah 1: $\\mathbf{a}\\cdot\\mathbf{b}=0+1+0=1$.\n2. Langkah 2: $|\\mathbf{a}|=|\\mathbf{b}|=\\sqrt2$.\n3. Langkah 3: $\\cos\\theta=\\dfrac{1}{\\sqrt2\\cdot\\sqrt2}=\\dfrac12$, jadi $\\theta=60^{\\circ}$.\n\nDua vektor tak nol **tegak lurus** tepat ketika $\\mathbf{a}\\cdot\\mathbf{b}=0$, karena $\\cos90^{\\circ}=0$. Contohnya $(2,-1)\\cdot(1,2)=2-2=0$.\n\nHasil kali titik positif untuk sudut lancip dan negatif untuk sudut tumpul.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Projection', 'Contoh Bertahap: Proyeksi'),
          body: L(
            'The **scalar projection** of $\\mathbf{a}$ on $\\mathbf{b}$ is the length of the shadow of $\\mathbf{a}$ on the line of $\\mathbf{b}$:\n\n$$\\frac{\\mathbf{a}\\cdot\\mathbf{b}}{|\\mathbf{b}|}$$\n\nThe **vector projection** is $\\dfrac{\\mathbf{a}\\cdot\\mathbf{b}}{|\\mathbf{b}|^{2}}\\,\\mathbf{b}$.\n\n1. Step 1: Project $\\mathbf{a}=(2,3)$ on $\\mathbf{b}=(1,1)$: $\\mathbf{a}\\cdot\\mathbf{b}=5$ and $|\\mathbf{b}|^2=2$.\n2. Step 2: The vector projection is $\\frac{5}{2}(1,1)=\\left(\\frac52,\\frac52\\right)$.\n3. Step 3: Useful identities: $\\mathbf{a}\\cdot\\mathbf{a}=|\\mathbf{a}|^2$ and $|\\mathbf{a}+\\mathbf{b}|^2=|\\mathbf{a}|^2+2\\,\\mathbf{a}\\cdot\\mathbf{b}+|\\mathbf{b}|^2$.\n\nRemember: $\\mathbf{a}\\cdot\\mathbf{b}=0$ does **not** need $\\mathbf{a}$ or $\\mathbf{b}$ to be zero.',
            '**Proyeksi skalar** $\\mathbf{a}$ pada $\\mathbf{b}$ adalah panjang bayangan $\\mathbf{a}$ pada garis $\\mathbf{b}$:\n\n$$\\frac{\\mathbf{a}\\cdot\\mathbf{b}}{|\\mathbf{b}|}$$\n\n**Proyeksi vektor** adalah $\\dfrac{\\mathbf{a}\\cdot\\mathbf{b}}{|\\mathbf{b}|^{2}}\\,\\mathbf{b}$.\n\n1. Langkah 1: Proyeksikan $\\mathbf{a}=(2,3)$ pada $\\mathbf{b}=(1,1)$: $\\mathbf{a}\\cdot\\mathbf{b}=5$ dan $|\\mathbf{b}|^2=2$.\n2. Langkah 2: Proyeksi vektornya $\\frac{5}{2}(1,1)=\\left(\\frac52,\\frac52\\right)$.\n3. Langkah 3: Identitas berguna: $\\mathbf{a}\\cdot\\mathbf{a}=|\\mathbf{a}|^2$ dan $|\\mathbf{a}+\\mathbf{b}|^2=|\\mathbf{a}|^2+2\\,\\mathbf{a}\\cdot\\mathbf{b}+|\\mathbf{b}|^2$.\n\nIngat: $\\mathbf{a}\\cdot\\mathbf{b}=0$ **tidak** memerlukan $\\mathbf{a}$ atau $\\mathbf{b}$ bernilai nol.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'What is cos θ, where θ is the angle between a = (3, 1) and b = (1, 3) in the picture?',
            'Berapa cos θ, dengan θ sudut antara a = (3, 1) dan b = (1, 3) pada gambar?',
          ),
          figure: {
            ...plane(
              [arrow([3, 1], 'a', 'a'), arrow([1, 3], 'b', 'b'), { t: 'angle', from: [3, 1], to: [1, 3], label: 'θ' }],
              { x: [-1, 5], y: [-1, 5] },
            ),
            caption: L('Two vectors from the origin.', 'Dua vektor dari titik asal.'),
          },
          options: ['\\frac{3}{5}', '6', '\\frac{3}{10}', '\\frac{4}{5}', '\\frac{1}{2}'].map((s) => L(`$${s}$`, `$${s}$`)),
          answer: 0,
          explain: L(
            '$\\mathbf{a}\\cdot\\mathbf{b}=6$ and $|\\mathbf{a}||\\mathbf{b}|=\\sqrt{10}\\sqrt{10}=10$, so $\\cos\\theta=\\frac{6}{10}=\\frac35$. The value $6$ is only the dot product, and a cosine cannot exceed $1$.',
            '$\\mathbf{a}\\cdot\\mathbf{b}=6$ dan $|\\mathbf{a}||\\mathbf{b}|=\\sqrt{10}\\sqrt{10}=10$, jadi $\\cos\\theta=\\frac{6}{10}=\\frac35$. Nilai $6$ hanya hasil kali titik, dan kosinus tidak dapat melebihi $1$.',
          ),
          hint: L('Divide the dot product by the product of the two lengths.', 'Bagi hasil kali titik dengan hasil kali kedua panjang.'),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L('Try it together: $\\mathbf{a}=(1,1,0)$ and $\\mathbf{b}=(0,1,1)$.', 'Coba bersama: $\\mathbf{a}=(1,1,0)$ dan $\\mathbf{b}=(0,1,1)$.'),
          template: '\\mathbf{a}\\cdot\\mathbf{b}=0+1+0=___ \\qquad |\\mathbf{a}||\\mathbf{b}|=\\sqrt2\\cdot\\sqrt2=___',
          blanks: ['1', '1'],
          explain: L('$\\mathbf{a}\\cdot\\mathbf{b}=1$, and $|\\mathbf{a}||\\mathbf{b}|=\\sqrt2\\cdot\\sqrt2=2$.', '$\\mathbf{a}\\cdot\\mathbf{b}=1$, dan $|\\mathbf{a}||\\mathbf{b}|=\\sqrt2\\cdot\\sqrt2=2$.'),
          hint: L('Multiply matching components, then add.', 'Kalikan komponen yang bersesuaian, lalu jumlahkan.'),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L('$(2,-1)$ and $(1,2)$ are perpendicular.', '$(2,-1)$ dan $(1,2)$ tegak lurus.'),
            L('$\\mathbf{a}\\cdot\\mathbf{a}=|\\mathbf{a}|^2$', '$\\mathbf{a}\\cdot\\mathbf{a}=|\\mathbf{a}|^2$'),
            L('The dot product of two vectors is a vector.', 'Hasil kali titik dua vektor adalah vektor.'),
            L('If $\\mathbf{a}\\cdot\\mathbf{b}=0$, then $\\mathbf{a}=\\mathbf{0}$ or $\\mathbf{b}=\\mathbf{0}$.', 'Jika $\\mathbf{a}\\cdot\\mathbf{b}=0$, maka $\\mathbf{a}=\\mathbf{0}$ atau $\\mathbf{b}=\\mathbf{0}$.'),
          ],
          answer: [0, 1],
          explain: L(
            '$2\\cdot1+(-1)\\cdot2=0$. And $\\mathbf{a}\\cdot\\mathbf{a}=a_1^2+a_2^2=|\\mathbf{a}|^2$. The dot product is a number. And a zero product can happen for perpendicular vectors that are not zero.',
            '$2\\cdot1+(-1)\\cdot2=0$. Dan $\\mathbf{a}\\cdot\\mathbf{a}=a_1^2+a_2^2=|\\mathbf{a}|^2$. Hasil kali titik adalah bilangan. Dan hasil kali nol dapat terjadi pada vektor tegak lurus yang bukan nol.',
          ),
          hint: L('Compute the dot product of the first pair.', 'Hitung hasil kali titik pasangan pertama.'),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L(
            'Let $\\mathbf{a}=(1,1,0)$ and $\\mathbf{b}=(0,1,1)$. Decide whether each statement is True or False.',
            'Misalkan $\\mathbf{a}=(1,1,0)$ dan $\\mathbf{b}=(0,1,1)$. Tentukan tiap pernyataan Benar atau Salah.',
          ),
          statements: [
            L('$\\mathbf{a}\\cdot\\mathbf{b}=1$', '$\\mathbf{a}\\cdot\\mathbf{b}=1$'),
            L('$|\\mathbf{a}|=|\\mathbf{b}|=\\sqrt2$', '$|\\mathbf{a}|=|\\mathbf{b}|=\\sqrt2$'),
            L('$\\cos\\theta=\\dfrac12$', '$\\cos\\theta=\\dfrac12$'),
            L('The angle between them is $30^{\\circ}$.', 'Sudut di antara keduanya $30^{\\circ}$.'),
          ],
          answer: [true, true, true, false],
          explain: L(
            'The dot product is $1$ and both lengths are $\\sqrt2$, so $\\cos\\theta=\\frac12$ and $\\theta=60^{\\circ}$, not $30^{\\circ}$.',
            'Hasil kali titiknya $1$ dan kedua panjangnya $\\sqrt2$, jadi $\\cos\\theta=\\frac12$ dan $\\theta=60^{\\circ}$, bukan $30^{\\circ}$.',
          ),
          hint: L('$\\cos\\theta=\\frac12$ for which angle?', '$\\cos\\theta=\\frac12$ untuk sudut berapa?'),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'The vectors $(k,6)$ and $(3,-1)$ are perpendicular. Find $k$.',
            'Vektor $(k,6)$ dan $(3,-1)$ tegak lurus. Tentukan $k$.',
          ),
          blanks: [{ label: 'k =', answer: 2 }],
          hints: [
            L('Perpendicular vectors have dot product $0$.', 'Vektor tegak lurus memiliki hasil kali titik $0$.'),
            L('$3k+6\\cdot(-1)=0$.', '$3k+6\\cdot(-1)=0$.'),
            L('Solve $3k-6=0$.', 'Selesaikan $3k-6=0$.'),
          ],
          explain: L('$3k-6=0$ gives $k=2$.', '$3k-6=0$ memberi $k=2$.'),
          solution: ['(k,6)\\cdot(3,-1)=3k-6=0', 'k=2'],
        },
      ],
    },
  ],
  project: {
    id: 'tka-sml-m4-s1-p',
    runtime: 'math',
    title: L('Vectors at Work', 'Vektor dalam Pemakaian'),
    brief: L(
      'Compute lengths, operations and dot products of vectors.',
      'Hitung panjang, operasi, dan hasil kali titik vektor.',
    ),
    requirements: [
      L('Find a vector between two points and its length.', 'Mencari vektor di antara dua titik dan panjangnya.'),
      L('Use the dot product for angles and projections.', 'Memakai hasil kali titik untuk sudut dan proyeksi.'),
    ],
    hints: [
      L('End minus start gives the vector.', 'Ujung dikurangi pangkal memberi vektor.'),
      L('Operate on one component at a time.', 'Operasikan satu komponen demi satu komponen.'),
      L('Perpendicular means the dot product is $0$.', 'Tegak lurus berarti hasil kali titik $0$.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L('Find the length of $(2,-3,6)$.', 'Cari panjang $(2,-3,6)$.'),
        blanks: [{ answer: 7 }],
        solution: ['\\sqrt{4+9+36}=\\sqrt{49}', '=7'],
      },
      {
        prompt: L(
          'Find the distance between $A(1,-2,4)$ and $B(4,2,16)$.',
          'Cari jarak antara $A(1,-2,4)$ dan $B(4,2,16)$.',
        ),
        blanks: [{ answer: 13 }],
        solution: ['\\vec{AB}=(3,4,12)', '\\sqrt{9+16+144}=13'],
      },
      {
        prompt: L(
          'Let $\\mathbf{u}=(1,2,-1)$ and $\\mathbf{v}=(-2,1,3)$. Find the first component of $2\\mathbf{u}-3\\mathbf{v}$.',
          'Misalkan $\\mathbf{u}=(1,2,-1)$ dan $\\mathbf{v}=(-2,1,3)$. Cari komponen pertama $2\\mathbf{u}-3\\mathbf{v}$.',
        ),
        blanks: [{ answer: 8 }],
        solution: ['2\\cdot1-3\\cdot(-2)=2+6', '=8'],
      },
      {
        prompt: L(
          'Find $\\mathbf{a}\\cdot\\mathbf{b}$ for $\\mathbf{a}=(3,-1,2)$ and $\\mathbf{b}=(2,4,5)$.',
          'Cari $\\mathbf{a}\\cdot\\mathbf{b}$ untuk $\\mathbf{a}=(3,-1,2)$ dan $\\mathbf{b}=(2,4,5)$.',
        ),
        blanks: [{ answer: 12 }],
        solution: ['3\\cdot2+(-1)\\cdot4+2\\cdot5', '=6-4+10=12'],
      },
      {
        prompt: L(
          'Find the scalar projection of $\\mathbf{a}=(3,4)$ on $\\mathbf{b}=(0,5)$.',
          'Cari proyeksi skalar $\\mathbf{a}=(3,4)$ pada $\\mathbf{b}=(0,5)$.',
        ),
        blanks: [{ answer: 4 }],
        solution: ['\\frac{\\mathbf{a}\\cdot\\mathbf{b}}{|\\mathbf{b}|}=\\frac{20}{5}', '=4'],
      },
    ],
  },
}
