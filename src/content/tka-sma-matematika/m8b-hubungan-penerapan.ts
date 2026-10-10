import type { Submodule } from '../types'
import { L, rightTriangle } from './figs'

/** Module 8, submodule 2 — relations between the trigonometric ratios, and
 *  solving problems with them. */

export const m8s2: Submodule = {
  id: 'tka-sma-m8-s2',
  title: L('Relations and Applications of the Ratios', 'Hubungan dan Penerapan Perbandingan Trigonometri'),
  summary: L(
    'Use the relations between the six ratios (complementary angles and the basic identities) and solve problems with elevation, depression, slopes and two-triangle figures.',
    'Memakai hubungan antara keenam perbandingan (sudut penyiku dan identitas dasar) dan menyelesaikan soal sudut elevasi, depresi, kemiringan, dan gambar dua segitiga.',
  ),
  lessons: [
    /* ------------------------------------------------- L1 relations */
    {
      id: 'tka-sma-m8-s2-l1',
      title: L('Relations Between the Ratios', 'Hubungan antara Perbandingan Trigonometri'),
      goal: L(
        'You can use complementary angles and the basic identities to find one ratio from another.',
        'Kamu bisa memakai sudut penyiku dan identitas dasar untuk mencari satu perbandingan dari yang lain.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Two Acute Angles, Swapped Sides', 'Ayo Amati: Dua Sudut Lancip, Sisi Bertukar'),
          body: L(
            'The two acute angles of a right triangle add up to $90^{\\circ}$: they are **complementary**. If one is $\\theta$, the other is $90^{\\circ}-\\theta$.\n\nThe side that is **opposite** $\\theta$ is **adjacent** to $90^{\\circ}-\\theta$, and the other way round. So the ratios swap:\n\n$$\\sin\\theta=\\cos(90^{\\circ}-\\theta)\\qquad\\tan\\theta=\\cot(90^{\\circ}-\\theta)\\qquad\\sec\\theta=\\csc(90^{\\circ}-\\theta)$$\n\nThis explains why $\\sin30^{\\circ}=\\cos60^{\\circ}=\\frac{1}{2}$ and $\\sin25^{\\circ}=\\cos65^{\\circ}$.\n\nIn the 3-4-5 triangle of the picture: $\\sin\\theta=\\frac{3}{5}$, and the other acute angle has $\\cos(90^{\\circ}-\\theta)=\\frac{3}{5}$ as well.',
            'Kedua sudut lancip segitiga siku-siku berjumlah $90^{\\circ}$: keduanya **saling penyiku**. Jika yang satu $\\theta$, yang lain $90^{\\circ}-\\theta$.\n\nSisi yang **di hadapan** $\\theta$ adalah sisi yang **di samping** $90^{\\circ}-\\theta$, dan sebaliknya. Jadi perbandingannya bertukar:\n\n$$\\sin\\theta=\\cos(90^{\\circ}-\\theta)\\qquad\\tan\\theta=\\cot(90^{\\circ}-\\theta)\\qquad\\sec\\theta=\\csc(90^{\\circ}-\\theta)$$\n\nIni menjelaskan mengapa $\\sin30^{\\circ}=\\cos60^{\\circ}=\\frac{1}{2}$ dan $\\sin25^{\\circ}=\\cos65^{\\circ}$.\n\nPada segitiga 3-4-5 di gambar: $\\sin\\theta=\\frac{3}{5}$, dan sudut lancip lainnya juga punya $\\cos(90^{\\circ}-\\theta)=\\frac{3}{5}$.',
          ),
          figure: {
            ...rightTriangle({
              a: 4,
              b: 3,
              angle: 'θ',
              sides: { across: '4', up: '3', slant: '5' },
              extra: [{ t: 'angle', at: [0, 3], from: [4, 0], to: [0, 0], label: '90°-θ' }],
            }),
            caption: L('The two acute angles θ and 90° - θ.', 'Kedua sudut lancip θ dan 90° - θ.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: The Basic Identities', 'Contoh Bertahap: Identitas Dasar'),
          body: L(
            'Draw a right triangle with hypotenuse **1**. The opposite side is then $\\sin\\theta$ and the adjacent side is $\\cos\\theta$. By Pythagoras:\n\n$$\\sin^2\\theta+\\cos^2\\theta=1$$\n\nTwo more relations come from the definitions:\n\n$$\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}\\qquad\\cot\\theta=\\frac{\\cos\\theta}{\\sin\\theta}$$\n\nand dividing the first identity by $\\cos^2\\theta$ or by $\\sin^2\\theta$ gives $1+\\tan^2\\theta=\\sec^2\\theta$ and $1+\\cot^2\\theta=\\csc^2\\theta$.\n\nExample: $\\sin\\theta=\\frac{3}{5}$, $\\theta$ acute.\n\n1. Step 1: $\\cos^2\\theta=1-\\frac{9}{25}=\\frac{16}{25}$.\n2. Step 2: $\\cos\\theta=\\frac{4}{5}$ (positive for an acute angle).\n3. Step 3: $\\tan\\theta=\\frac{3/5}{4/5}=\\frac{3}{4}$.\n\n**Note:** $\\sin^2\\theta$ means $(\\sin\\theta)^2$, not $\\sin(\\theta^2)$.',
            'Gambar segitiga siku-siku dengan sisi miring **1**. Sisi depannya adalah $\\sin\\theta$ dan sisi sampingnya $\\cos\\theta$. Dengan Pythagoras:\n\n$$\\sin^2\\theta+\\cos^2\\theta=1$$\n\nDua hubungan lagi berasal dari definisi:\n\n$$\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}\\qquad\\cot\\theta=\\frac{\\cos\\theta}{\\sin\\theta}$$\n\ndan membagi identitas pertama dengan $\\cos^2\\theta$ atau $\\sin^2\\theta$ memberi $1+\\tan^2\\theta=\\sec^2\\theta$ dan $1+\\cot^2\\theta=\\csc^2\\theta$.\n\nContoh: $\\sin\\theta=\\frac{3}{5}$, $\\theta$ lancip.\n\n1. Langkah 1: $\\cos^2\\theta=1-\\frac{9}{25}=\\frac{16}{25}$.\n2. Langkah 2: $\\cos\\theta=\\frac{4}{5}$ (positif untuk sudut lancip).\n3. Langkah 3: $\\tan\\theta=\\frac{3/5}{4/5}=\\frac{3}{4}$.\n\n**Catatan:** $\\sin^2\\theta$ berarti $(\\sin\\theta)^2$, bukan $\\sin(\\theta^2)$.',
          ),
          figure: {
            ...rightTriangle({ a: 4, b: 3, angle: 'θ', sides: { across: 'cos', up: 'sin', slant: '1' } }),
            caption: L('A right triangle with hypotenuse 1: the legs are sin θ and cos θ.', 'Segitiga siku-siku berhipotenusa 1: sisi tegaknya sin θ dan cos θ.'),
          },
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: All Six Ratios from One', 'Contoh Bertahap: Keenam Perbandingan dari Satu'),
          body: L(
            'Given one ratio of an acute angle, **draw the triangle** and find the missing side by Pythagoras.\n\nGiven $\\tan\\theta=\\frac{12}{5}$:\n\n1. Step 1: $\\tan\\theta=\\frac{\\text{opposite}}{\\text{adjacent}}$, so take opposite $=12$ and adjacent $=5$.\n2. Step 2: Hypotenuse $=\\sqrt{12^2+5^2}=13$.\n3. Step 3: Read off all six: $\\sin\\theta=\\frac{12}{13}$, $\\cos\\theta=\\frac{5}{13}$, $\\cot\\theta=\\frac{5}{12}$, $\\sec\\theta=\\frac{13}{5}$, $\\csc\\theta=\\frac{13}{12}$.\n\n**Watch out:**\n\n- For an acute angle every ratio is positive.\n- $\\sin\\theta$ and $\\cos\\theta$ are never above 1; $\\sec\\theta$ and $\\csc\\theta$ are never below 1.\n- $\\sin30^{\\circ}+\\cos30^{\\circ}\\neq\\sin60^{\\circ}$: ratios of a sum are **not** sums of ratios.',
            'Jika satu perbandingan sudut lancip diketahui, **gambar segitiganya** dan cari sisi yang hilang dengan Pythagoras.\n\nDiketahui $\\tan\\theta=\\frac{12}{5}$:\n\n1. Langkah 1: $\\tan\\theta=\\frac{\\text{depan}}{\\text{samping}}$, jadi ambil sisi depan $=12$ dan sisi samping $=5$.\n2. Langkah 2: Sisi miring $=\\sqrt{12^2+5^2}=13$.\n3. Langkah 3: Baca keenamnya: $\\sin\\theta=\\frac{12}{13}$, $\\cos\\theta=\\frac{5}{13}$, $\\cot\\theta=\\frac{5}{12}$, $\\sec\\theta=\\frac{13}{5}$, $\\csc\\theta=\\frac{13}{12}$.\n\n**Awas:**\n\n- Untuk sudut lancip semua perbandingan positif.\n- $\\sin\\theta$ dan $\\cos\\theta$ tidak pernah di atas 1; $\\sec\\theta$ dan $\\csc\\theta$ tidak pernah di bawah 1.\n- $\\sin30^{\\circ}+\\cos30^{\\circ}\\neq\\sin60^{\\circ}$: perbandingan dari suatu jumlah **bukan** jumlah perbandingan.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'In the right triangle the acute angles are $\\theta$ and $90^{\\circ}-\\theta$. $\\sin\\theta$ equals the cosine of which angle?',
            'Pada segitiga siku-siku, sudut lancipnya $\\theta$ dan $90^{\\circ}-\\theta$. $\\sin\\theta$ sama dengan kosinus sudut yang mana?',
          ),
          figure: {
            ...rightTriangle({
              a: 4,
              b: 3,
              angle: 'θ',
              sides: { across: '4', up: '3', slant: '5' },
              extra: [{ t: 'angle', at: [0, 3], from: [4, 0], to: [0, 0], label: '90°-θ' }],
            }),
            caption: L('A right triangle with its two acute angles.', 'Segitiga siku-siku dengan kedua sudut lancipnya.'),
          },
          options: [L('$90^{\\circ}-\\theta$', '$90^{\\circ}-\\theta$'), L('$\\theta$', '$\\theta$'), L('$180^{\\circ}-\\theta$', '$180^{\\circ}-\\theta$'), L('$2\\theta$', '$2\\theta$')],
          answer: 0,
          explain: L(
            'The side opposite $\\theta$ (length 3) is adjacent to $90^{\\circ}-\\theta$, so $\\sin\\theta=\\frac{3}{5}=\\cos(90^{\\circ}-\\theta)$.',
            'Sisi di hadapan $\\theta$ (panjang 3) berada di samping $90^{\\circ}-\\theta$, jadi $\\sin\\theta=\\frac{3}{5}=\\cos(90^{\\circ}-\\theta)$.',
          ),
          hint: L(
            'Which side is opposite $\\theta$? Is it adjacent to the other acute angle?',
            'Sisi mana yang di hadapan $\\theta$? Apakah sisi itu di samping sudut lancip lainnya?',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: write $\\sin25^{\\circ}$ as a cosine.',
            'Coba bersama: tulis $\\sin25^{\\circ}$ sebagai kosinus.',
          ),
          template: '\\sin25^{\\circ}=\\cos(90^{\\circ}-25^{\\circ})=\\cos___^{\\circ}',
          blanks: ['65'],
          explain: L(
            '$90-25=65$, so $\\sin25^{\\circ}=\\cos65^{\\circ}$.',
            '$90-25=65$, jadi $\\sin25^{\\circ}=\\cos65^{\\circ}$.',
          ),
          hint: L(
            'Subtract 25 from 90.',
            'Kurangkan 25 dari 90.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L('$\\sin^2\\theta+\\cos^2\\theta=1$', '$\\sin^2\\theta+\\cos^2\\theta=1$'),
            L('$\\sin40^{\\circ}=\\cos50^{\\circ}$', '$\\sin40^{\\circ}=\\cos50^{\\circ}$'),
            L('$\\tan\\theta=\\frac{\\cos\\theta}{\\sin\\theta}$', '$\\tan\\theta=\\frac{\\cos\\theta}{\\sin\\theta}$'),
            L('$\\sin2\\theta=2\\sin\\theta$', '$\\sin2\\theta=2\\sin\\theta$'),
          ],
          answer: [0, 1],
          explain: L(
            '$\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}$ (the fraction in the option is $\\cot\\theta$). And $\\sin2\\theta\\neq2\\sin\\theta$: for $\\theta=30^{\\circ}$, $\\sin60^{\\circ}=\\frac{\\sqrt{3}}{2}$ but $2\\sin30^{\\circ}=1$.',
            '$\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}$ (pecahan pada pilihan adalah $\\cot\\theta$). Dan $\\sin2\\theta\\neq2\\sin\\theta$: untuk $\\theta=30^{\\circ}$, $\\sin60^{\\circ}=\\frac{\\sqrt{3}}{2}$ tetapi $2\\sin30^{\\circ}=1$.',
          ),
          hint: L(
            'Test the doubtful ones with $\\theta=30^{\\circ}$.',
            'Uji yang meragukan dengan $\\theta=30^{\\circ}$.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('$\\sin70^{\\circ}=\\cos20^{\\circ}$.', '$\\sin70^{\\circ}=\\cos20^{\\circ}$.'),
            L('$\\tan\\theta\\cdot\\cot\\theta=1$.', '$\\tan\\theta\\cdot\\cot\\theta=1$.'),
            L('$\\sin\\theta=1.2$ is possible for an acute angle $\\theta$.', '$\\sin\\theta=1{,}2$ mungkin untuk sudut lancip $\\theta$.'),
            L('$\\sin30^{\\circ}+\\cos30^{\\circ}=1$.', '$\\sin30^{\\circ}+\\cos30^{\\circ}=1$.'),
          ],
          answer: [true, true, false, false],
          explain: L(
            '$70+20=90$, so the sine and cosine match. A leg is shorter than the hypotenuse, so $\\sin\\theta<1$. And $\\frac{1}{2}+\\frac{\\sqrt{3}}{2}\\approx1.37$, not 1.',
            '$70+20=90$, jadi sinus dan kosinus cocok. Sisi tegak lebih pendek dari sisi miring, jadi $\\sin\\theta<1$. Dan $\\frac{1}{2}+\\frac{\\sqrt{3}}{2}\\approx1{,}37$, bukan 1.',
          ),
          hint: L(
            'For the last one, use the exact values and add them.',
            'Untuk yang terakhir, pakai nilai eksak lalu jumlahkan.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            '$\\theta$ is acute and $\\sin\\theta=\\frac{5}{13}$. Find $\\tan\\theta$ (type it as a fraction such as 3/4).',
            '$\\theta$ lancip dan $\\sin\\theta=\\frac{5}{13}$. Tentukan $\\tan\\theta$ (ketik sebagai pecahan seperti 3/4).',
          ),
          blanks: [{ label: '\\tan\\theta =', answer: 5 / 12 }],
          hints: [
            L('Draw a right triangle with opposite side 5 and hypotenuse 13.', 'Gambar segitiga siku-siku dengan sisi depan 5 dan sisi miring 13.'),
            L('The adjacent side is $\\sqrt{13^2-5^2}=12$.', 'Sisi sampingnya $\\sqrt{13^2-5^2}=12$.'),
            L('$\\tan\\theta=\\frac{\\text{opposite}}{\\text{adjacent}}$.', '$\\tan\\theta=\\frac{\\text{depan}}{\\text{samping}}$.'),
          ],
          explain: L(
            '$\\cos\\theta=\\frac{12}{13}$, so $\\tan\\theta=\\frac{5}{12}$.',
            '$\\cos\\theta=\\frac{12}{13}$, jadi $\\tan\\theta=\\frac{5}{12}$.',
          ),
          solution: ['b=\\sqrt{13^2-5^2}=12', '\\tan\\theta=\\frac{5}{12}'],
        },
      ],
    },
    /* ------------------------------------------------ L2 applications */
    {
      id: 'tka-sma-m8-s2-l2',
      title: L('Solving Problems with the Ratios', 'Menyelesaikan Soal dengan Perbandingan Trigonometri'),
      goal: L(
        'You can choose the right ratio, solve problems with angles of elevation and depression and with slopes, and handle a figure with two triangles.',
        'Kamu bisa memilih perbandingan yang tepat, menyelesaikan soal sudut elevasi, sudut depresi, dan kemiringan, dan menangani gambar dengan dua segitiga.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Which Ratio Do I Need?', 'Ayo Amati: Perbandingan Mana yang Saya Perlukan?'),
          body: L(
            'Mark the **known side**, the **wanted side** and the **angle**. Then choose the ratio that contains exactly those two sides.\n\n| Known and wanted sides | Ratio |\n|---|---|\n| opposite and hypotenuse | $\\sin$ |\n| adjacent and hypotenuse | $\\cos$ |\n| opposite and adjacent | $\\tan$ |\n\nIn the picture the side opposite $30^{\\circ}$ is 12 and the hypotenuse $x$ is wanted: use sine.\n\n$$\\sin30^{\\circ}=\\frac{12}{x}\\ \\Rightarrow\\ x=\\frac{12}{\\sin30^{\\circ}}=\\frac{12}{1/2}=24$$\n\nWhen the **unknown is the denominator**, the angle ratio ends up under the known side, so you divide.',
            'Tandai **sisi yang diketahui**, **sisi yang dicari**, dan **sudutnya**. Lalu pilih perbandingan yang memuat tepat kedua sisi itu.\n\n| Sisi yang diketahui dan dicari | Perbandingan |\n|---|---|\n| depan dan miring | $\\sin$ |\n| samping dan miring | $\\cos$ |\n| depan dan samping | $\\tan$ |\n\nPada gambar sisi di hadapan $30^{\\circ}$ adalah 12 dan sisi miring $x$ yang dicari: pakai sinus.\n\n$$\\sin30^{\\circ}=\\frac{12}{x}\\ \\Rightarrow\\ x=\\frac{12}{\\sin30^{\\circ}}=\\frac{12}{1/2}=24$$\n\nBila **yang tidak diketahui adalah penyebut**, perbandingan sudut berakhir di bawah sisi yang diketahui, jadi kamu membagi.',
          ),
          figure: {
            ...rightTriangle({ a: 10.39, b: 6, angle: '30°', sides: { up: '12', slant: 'x' } }),
            caption: L('A right triangle with an angle of 30°, the opposite side 12 and the hypotenuse x.', 'Segitiga siku-siku dengan sudut 30°, sisi depan 12, dan sisi miring x.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Elevation, Depression and Slopes', 'Contoh Bertahap: Elevasi, Depresi, dan Kemiringan'),
          body: L(
            '- The **angle of elevation** is measured **upward from the horizontal**. The **angle of depression** is measured **downward from the horizontal**. Both are measured from the horizontal, never from the vertical.\n- The angle of depression from $A$ down to $B$ equals the angle of elevation from $B$ up to $A$ (alternate angles).\n- The **gradient** (slope) of a line is rise over run, which is $\\tan$ of the angle it makes with the horizontal.\n\nExample: from the top of a lighthouse 50 m high the angle of depression of a boat is $45^{\\circ}$. How far is the boat from the foot of the lighthouse?\n\n1. Step 1: The angle at the boat is also $45^{\\circ}$ (alternate angles).\n2. Step 2: $\\tan45^{\\circ}=\\frac{50}{d}$, so $d=\\frac{50}{1}=50$ m.\n\nExample: a ramp rises 3 m over a horizontal distance of 4 m. The gradient is $\\frac{3}{4}$, so $\\tan\\theta=\\frac{3}{4}$, and the ramp is 5 m long, so $\\sin\\theta=\\frac{3}{5}$.',
            '- **Sudut elevasi** diukur **ke atas dari garis mendatar**. **Sudut depresi** diukur **ke bawah dari garis mendatar**. Keduanya diukur dari garis mendatar, tidak pernah dari garis tegak.\n- Sudut depresi dari $A$ ke bawah menuju $B$ sama dengan sudut elevasi dari $B$ ke atas menuju $A$ (sudut dalam berseberangan).\n- **Gradien** (kemiringan) suatu garis adalah kenaikan per pergeseran mendatar, yaitu $\\tan$ dari sudut yang dibentuknya dengan garis mendatar.\n\nContoh: dari puncak mercusuar setinggi 50 m, sudut depresi sebuah perahu $45^{\\circ}$. Seberapa jauh perahu dari kaki mercusuar?\n\n1. Langkah 1: Sudut di perahu juga $45^{\\circ}$ (sudut dalam berseberangan).\n2. Langkah 2: $\\tan45^{\\circ}=\\frac{50}{d}$, jadi $d=\\frac{50}{1}=50$ m.\n\nContoh: sebuah tanjakan naik 3 m pada jarak mendatar 4 m. Gradiennya $\\frac{3}{4}$, jadi $\\tan\\theta=\\frac{3}{4}$, dan tanjakan itu panjangnya 5 m, jadi $\\sin\\theta=\\frac{3}{5}$.',
          ),
          figure: {
            ...rightTriangle({ a: 5, b: 5, angle: '45°', sides: { across: 'd', up: '50' } }),
            caption: L('The lighthouse (50), the sea (d) and the line of sight make a right triangle.', 'Mercusuar (50), laut (d), dan garis pandang membentuk segitiga siku-siku.'),
          },
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: A Figure with Two Triangles', 'Contoh Bertahap: Gambar dengan Dua Segitiga'),
          body: L(
            'Sometimes one picture holds two right triangles that share a side. Write one equation for each, then solve them together.\n\nA tower stands on level ground. From a point $A$ the angle of elevation of its top is $60^{\\circ}$. From a point $B$, 20 m farther from the tower on the same line, it is $30^{\\circ}$. How far is $A$ from the tower?\n\n1. Step 1: Let $x$ be the distance from $A$ to the tower, and $h$ the height.\n2. Step 2: From $A$: $\\tan60^{\\circ}=\\frac{h}{x}$, so $h=\\sqrt{3}\\,x$.\n3. Step 3: From $B$: $\\tan30^{\\circ}=\\frac{h}{x+20}$, so $h=\\frac{x+20}{\\sqrt{3}}$.\n4. Step 4: Equal heights: $\\sqrt{3}\\,x=\\frac{x+20}{\\sqrt{3}}$, so $3x=x+20$ and $x=10$.\n\n(The height is $10\\sqrt{3}\\approx17.3$ m.) The shared side, here the height $h$, is the link between the two equations.',
            'Kadang satu gambar memuat dua segitiga siku-siku yang berbagi sebuah sisi. Tulis satu persamaan untuk tiap segitiga, lalu selesaikan bersama.\n\nSebuah menara berdiri di tanah datar. Dari titik $A$ sudut elevasi puncaknya $60^{\\circ}$. Dari titik $B$, 20 m lebih jauh dari menara pada garis yang sama, sudutnya $30^{\\circ}$. Seberapa jauh $A$ dari menara?\n\n1. Langkah 1: Misalkan $x$ jarak $A$ ke menara, dan $h$ tingginya.\n2. Langkah 2: Dari $A$: $\\tan60^{\\circ}=\\frac{h}{x}$, jadi $h=\\sqrt{3}\\,x$.\n3. Langkah 3: Dari $B$: $\\tan30^{\\circ}=\\frac{h}{x+20}$, jadi $h=\\frac{x+20}{\\sqrt{3}}$.\n4. Langkah 4: Tinggi sama: $\\sqrt{3}\\,x=\\frac{x+20}{\\sqrt{3}}$, jadi $3x=x+20$ dan $x=10$.\n\n(Tingginya $10\\sqrt{3}\\approx17{,}3$ m.) Sisi bersama, yaitu tinggi $h$, adalah penghubung kedua persamaan.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'In the right triangle the side opposite the $30^{\\circ}$ angle is 12. How long is the hypotenuse $x$?',
            'Pada segitiga siku-siku, sisi di hadapan sudut $30^{\\circ}$ adalah 12. Berapa panjang sisi miring $x$?',
          ),
          figure: {
            ...rightTriangle({ a: 10.39, b: 6, angle: '30°', sides: { up: '12', slant: 'x' } }),
            caption: L('A right triangle with a 30° angle.', 'Segitiga siku-siku dengan sudut 30°.'),
          },
          options: [L('$24$', '$24$'), L('$6$', '$6$'), L('$12\\sqrt{3}$', '$12\\sqrt{3}$'), L('$12$', '$12$')],
          answer: 0,
          explain: L(
            '$\\sin30^{\\circ}=\\frac{12}{x}$ gives $x=\\frac{12}{1/2}=24$. The value 6 multiplies by $\\sin30^{\\circ}$ instead of dividing, and the hypotenuse must be longer than 12.',
            '$\\sin30^{\\circ}=\\frac{12}{x}$ memberi $x=\\frac{12}{1/2}=24$. Nilai 6 mengalikan dengan $\\sin30^{\\circ}$, bukan membagi, dan sisi miring harus lebih panjang dari 12.',
          ),
          hint: L(
            'The hypotenuse is the longest side. The unknown is under the 12 in the ratio, so divide.',
            'Sisi miring adalah sisi terpanjang. Yang tidak diketahui ada di bawah 12 pada perbandingan, jadi bagi.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: the hypotenuse $x$ of the triangle with the opposite side 12 and the angle $30^{\\circ}$.',
            'Coba bersama: sisi miring $x$ dari segitiga dengan sisi depan 12 dan sudut $30^{\\circ}$.',
          ),
          template: 'x=\\frac{12}{\\sin30^{\\circ}}=\\frac{12}{1/2}=___',
          blanks: ['24'],
          explain: L(
            'Dividing by one half is multiplying by 2: $12\\times2=24$.',
            'Membagi dengan setengah sama dengan mengalikan 2: $12\\times2=24$.',
          ),
          hint: L(
            'Dividing by a fraction means multiplying by its reciprocal.',
            'Membagi dengan pecahan berarti mengalikan dengan kebalikannya.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L('An angle of elevation is measured upward from the horizontal.', 'Sudut elevasi diukur ke atas dari garis mendatar.'),
            L('An angle of depression is measured downward from the horizontal.', 'Sudut depresi diukur ke bawah dari garis mendatar.'),
            L('The gradient of a slope equals the sine of its angle.', 'Gradien suatu kemiringan sama dengan sinus sudutnya.'),
            L('An angle of elevation is measured from the vertical.', 'Sudut elevasi diukur dari garis tegak.'),
          ],
          answer: [0, 1],
          explain: L(
            'Both angles are measured from the **horizontal**. The gradient is rise over run, which is the **tangent** of the angle.',
            'Kedua sudut diukur dari garis **mendatar**. Gradien adalah kenaikan per pergeseran mendatar, yaitu **tangen** sudutnya.',
          ),
          hint: L(
            'Rise over run uses the vertical and the horizontal side: which ratio is that?',
            'Kenaikan per pergeseran mendatar memakai sisi tegak dan mendatar: itu perbandingan yang mana?',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('The angle of depression from $A$ to $B$ equals the angle of elevation from $B$ to $A$.', 'Sudut depresi dari $A$ ke $B$ sama dengan sudut elevasi dari $B$ ke $A$.'),
            L('A road with gradient 1 rises at an angle of $45^{\\circ}$.', 'Jalan bergradien 1 naik dengan sudut $45^{\\circ}$.'),
            L('To find a side from the hypotenuse and an angle, only the tangent can be used.', 'Untuk mencari sebuah sisi dari sisi miring dan sebuah sudut, hanya tangen yang dapat dipakai.'),
            L('Rise over run equals the sine of the slope angle.', 'Kenaikan per pergeseran mendatar sama dengan sinus sudut kemiringan.'),
          ],
          answer: [true, true, false, false],
          explain: L(
            'Alternate angles are equal, and $\\tan45^{\\circ}=1$. With the hypotenuse you use sine or cosine. Rise over run is the tangent.',
            'Sudut dalam berseberangan sama besar, dan $\\tan45^{\\circ}=1$. Dengan sisi miring kamu memakai sinus atau kosinus. Kenaikan per pergeseran mendatar adalah tangen.',
          ),
          hint: L(
            'The tangent does not involve the hypotenuse at all.',
            'Tangen sama sekali tidak melibatkan sisi miring.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'A tower stands on level ground. From a point $A$ the angle of elevation of its top is $60^{\\circ}$; from a point $B$, 20 m farther away on the same line, it is $30^{\\circ}$. How far is $A$ from the foot of the tower, in meters?',
            'Sebuah menara berdiri di tanah datar. Dari titik $A$ sudut elevasi puncaknya $60^{\\circ}$; dari titik $B$, 20 m lebih jauh pada garis yang sama, sudutnya $30^{\\circ}$. Seberapa jauh $A$ dari kaki menara, dalam meter?',
          ),
          blanks: [{ label: 'x =', answer: 10, after: '\\text{m}' }],
          hints: [
            L('Let $x$ be the distance from $A$ and $h$ the height. Write $h$ from each point.', 'Misalkan $x$ jarak dari $A$ dan $h$ tinggi. Tulis $h$ dari tiap titik.'),
            L('$h=x\\tan60^{\\circ}=\\sqrt{3}\\,x$ and $h=(x+20)\\tan30^{\\circ}=\\frac{x+20}{\\sqrt{3}}$.', '$h=x\\tan60^{\\circ}=\\sqrt{3}\\,x$ dan $h=(x+20)\\tan30^{\\circ}=\\frac{x+20}{\\sqrt{3}}$.'),
            L('Set them equal: $\\sqrt{3}\\,x=\\frac{x+20}{\\sqrt{3}}$, then multiply by $\\sqrt{3}$.', 'Samakan: $\\sqrt{3}\\,x=\\frac{x+20}{\\sqrt{3}}$, lalu kalikan dengan $\\sqrt{3}$.'),
          ],
          explain: L(
            '$3x=x+20$ gives $x=10$. Check: $h=10\\sqrt{3}$, and from $B$: $\\frac{10\\sqrt{3}}{30}=\\frac{1}{\\sqrt{3}}=\\tan30^{\\circ}$ ✓.',
            '$3x=x+20$ memberi $x=10$. Periksa: $h=10\\sqrt{3}$, dan dari $B$: $\\frac{10\\sqrt{3}}{30}=\\frac{1}{\\sqrt{3}}=\\tan30^{\\circ}$ ✓.',
          ),
          solution: ['h=\\sqrt{3}\\,x \\quad h=\\frac{x+20}{\\sqrt{3}}', '3x=x+20', 'x=10'],
        },
      ],
    },
  ],
  project: {
    id: 'tka-sma-m8-s2-p',
    runtime: 'math',
    title: L('Relations and Applications at Work', 'Hubungan dan Penerapan dalam Pemakaian'),
    brief: L(
      'Use the relations between the ratios and solve problems with depression and slopes.',
      'Pakai hubungan antara perbandingan trigonometri dan selesaikan soal depresi dan kemiringan.',
    ),
    requirements: [
      L('Use complementary angles and the basic identities.', 'Memakai sudut penyiku dan identitas dasar.'),
      L('Choose the right ratio for a side.', 'Memilih perbandingan yang tepat untuk suatu sisi.'),
    ],
    hints: [
      L('Draw the triangle and find the missing side with Pythagoras.', 'Gambar segitiganya dan cari sisi yang hilang dengan Pythagoras.'),
      L('$\\sin\\theta=\\cos(90^{\\circ}-\\theta)$.', '$\\sin\\theta=\\cos(90^{\\circ}-\\theta)$.'),
      L('Angles of elevation and depression are measured from the horizontal.', 'Sudut elevasi dan depresi diukur dari garis mendatar.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L(
          '$\\theta$ is acute and $\\sin\\theta=\\frac{5}{13}$. Find $\\cos\\theta$ (type it as a fraction).',
          '$\\theta$ lancip dan $\\sin\\theta=\\frac{5}{13}$. Tentukan $\\cos\\theta$ (ketik sebagai pecahan).',
        ),
        blanks: [{ label: '\\cos\\theta =', answer: 12 / 13 }],
        solution: ['\\cos^2\\theta=1-\\frac{25}{169}=\\frac{144}{169}', '\\cos\\theta=\\frac{12}{13}'],
      },
      {
        prompt: L(
          '$\\theta$ is acute and $\\tan\\theta=\\frac{12}{5}$. Find $\\sec\\theta$ as a decimal.',
          '$\\theta$ lancip dan $\\tan\\theta=\\frac{12}{5}$. Tentukan $\\sec\\theta$ sebagai desimal.',
        ),
        blanks: [{ label: '\\sec\\theta =', answer: 2.6 }],
        solution: {
          en: ['\\text{hypotenuse}=\\sqrt{12^2+5^2}=13', '\\sec\\theta=\\frac{13}{5}=2.6'],
          id: ['\\text{sisi miring}=\\sqrt{12^2+5^2}=13', '\\sec\\theta=\\frac{13}{5}=2{,}6'],
        },
      },
      {
        prompt: L(
          'Find the value of $\\sin65^{\\circ}-\\cos25^{\\circ}$.',
          'Tentukan nilai $\\sin65^{\\circ}-\\cos25^{\\circ}$.',
        ),
        blanks: [{ answer: 0 }],
        solution: ['\\cos25^{\\circ}=\\sin(90^{\\circ}-25^{\\circ})=\\sin65^{\\circ}', '\\sin65^{\\circ}-\\sin65^{\\circ}=0'],
      },
      {
        prompt: L(
          'From the top of a lighthouse 50 m high, the angle of depression of a boat is $45^{\\circ}$. How far is the boat from the foot of the lighthouse, in meters?',
          'Dari puncak mercusuar setinggi 50 m, sudut depresi sebuah perahu $45^{\\circ}$. Seberapa jauh perahu dari kaki mercusuar, dalam meter?',
        ),
        figure: {
          ...rightTriangle({ a: 5, b: 5, angle: '45°', sides: { across: 'd', up: '50' } }),
          caption: L('The lighthouse, the sea and the line of sight.', 'Mercusuar, laut, dan garis pandang.'),
        },
        blanks: [{ answer: 50, after: '\\text{m}' }],
        solution: ['\\tan45^{\\circ}=\\frac{50}{d}', 'd=50'],
      },
      {
        prompt: L(
          'A ladder 8 m long has its foot 4 m from a wall. What angle does it make with the ground, in degrees?',
          'Sebuah tangga sepanjang 8 m kakinya berjarak 4 m dari dinding. Berapa sudut yang dibentuknya dengan tanah, dalam derajat?',
        ),
        blanks: [{ answer: 60, after: '^{\\circ}' }],
        solution: ['\\cos\\theta=\\frac{4}{8}=\\frac{1}{2}', '\\theta=60^{\\circ}'],
      },
    ],
  },
}
