import type { Submodule } from '../types'
import { L, dot, plane } from './figs'

/** Module 3, submodule 2 — quadratic functions. */

export const m3s2: Submodule = {
  id: 'tka-sma-m3-s2',
  title: L('Quadratic Functions', 'Fungsi Kuadrat'),
  summary: L(
    'Read and sketch a parabola from its roots and vertex, use the discriminant, and find the greatest or least value.',
    'Membaca dan menggambar parabola dari akar dan titik puncaknya, memakai diskriminan, serta mencari nilai terbesar atau terkecil.',
  ),
  lessons: [
    /* ------------------------------------------------------------ L1 quadratics */
    {
      id: 'tka-sma-m3-s2-l1',
      title: L('Quadratic Functions', 'Fungsi Kuadrat'),
      goal: L(
        'You can find the roots, the vertex and the greatest or least value of a quadratic function, and use the discriminant.',
        'Kamu bisa mencari akar, titik puncak, dan nilai terbesar atau terkecil fungsi kuadrat, serta memakai diskriminan.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: The Shape of a Parabola', 'Ayo Amati: Bentuk Parabola'),
          body: L(
            'The graph of $y=ax^2+bx+c$ ($a\\neq0$) is a **parabola**. Take $y=x^2-4x+3$.\n\n- It opens **upward** because $a=1>0$. (If $a<0$ it opens downward.)\n- The **roots** are where it meets the $x$-axis: $x^2-4x+3=(x-1)(x-3)=0$, so $x=1$ and $x=3$.\n- It meets the $y$-axis at $(0,c)=(0,3)$.\n- The **axis of symmetry** is halfway between the roots: $x=2$, which is also $x=-\\frac{b}{2a}=\\frac{4}{2}=2$.\n- The **vertex** is on the axis: $y=2^2-4(2)+3=-1$, so the vertex is $(2,-1)$, the lowest point.\n\nIn the picture the roots are the red dots and the vertex is the orange dot.',
            'Grafik $y=ax^2+bx+c$ ($a\\neq0$) adalah **parabola**. Ambil $y=x^2-4x+3$.\n\n- Parabola membuka ke **atas** karena $a=1>0$. (Jika $a<0$ membuka ke bawah.)\n- **Akar** adalah tempat parabola memotong sumbu $x$: $x^2-4x+3=(x-1)(x-3)=0$, jadi $x=1$ dan $x=3$.\n- Parabola memotong sumbu $y$ di $(0,c)=(0,3)$.\n- **Sumbu simetri** berada di tengah kedua akar: $x=2$, yang juga $x=-\\frac{b}{2a}=\\frac{4}{2}=2$.\n- **Titik puncak** berada pada sumbu itu: $y=2^2-4(2)+3=-1$, jadi puncaknya $(2,-1)$, titik terendah.\n\nPada gambar, akar-akarnya adalah titik merah dan puncaknya adalah titik oranye.',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: 'x^2-4*x+3', from: -0.5, to: 4.5, color: 'a' },
                dot([1, 0], undefined, 'result'),
                dot([3, 0], undefined, 'result'),
                dot([2, -1], '(2, -1)', 'b'),
                { t: 'vline', x: 2, color: 'muted', dashed: true },
              ],
              { x: [-2, 6], y: [-3, 9] },
            ),
            caption: L('The parabola y = x² - 4x + 3.', 'Parabola y = x² - 4x + 3.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: The Discriminant', 'Contoh Bertahap: Diskriminan'),
          body: L(
            'For $ax^2+bx+c=0$ the **quadratic formula** gives\n\n$$x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}$$\n\nThe number under the root, $D=b^2-4ac$, is the **discriminant**. It says how the parabola meets the $x$-axis:\n\n| $D$ | Roots | Picture |\n|---|---|---|\n| $D>0$ | two different real roots | cuts the axis twice |\n| $D=0$ | one repeated root | touches the axis |\n| $D<0$ | no real roots | floats above or below the axis |\n\nExample: $x^2-4x+3=0$ has $a=1$, $b=-4$, $c=3$.\n\n1. Step 1: $D=(-4)^2-4(1)(3)=16-12=4>0$.\n2. Step 2: $x=\\frac{4\\pm\\sqrt{4}}{2}=\\frac{4\\pm2}{2}$.\n3. Step 3: $x=3$ or $x=1$.\n\nAnother: $x^2+2x+5$ has $D=4-20=-16<0$, so it never equals zero.',
            'Untuk $ax^2+bx+c=0$, **rumus kuadrat** memberi\n\n$$x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}$$\n\nBilangan di bawah akar, $D=b^2-4ac$, disebut **diskriminan**. Diskriminan menyatakan bagaimana parabola memotong sumbu $x$:\n\n| $D$ | Akar | Gambar |\n|---|---|---|\n| $D>0$ | dua akar real berbeda | memotong sumbu dua kali |\n| $D=0$ | satu akar kembar | menyinggung sumbu |\n| $D<0$ | tidak ada akar real | melayang di atas atau di bawah sumbu |\n\nContoh: $x^2-4x+3=0$ dengan $a=1$, $b=-4$, $c=3$.\n\n1. Langkah 1: $D=(-4)^2-4(1)(3)=16-12=4>0$.\n2. Langkah 2: $x=\\frac{4\\pm\\sqrt{4}}{2}=\\frac{4\\pm2}{2}$.\n3. Langkah 3: $x=3$ atau $x=1$.\n\nContoh lain: $x^2+2x+5$ punya $D=4-20=-16<0$, jadi tidak pernah bernilai nol.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: The Greatest Value', 'Contoh Bertahap: Nilai Terbesar'),
          body: L(
            'The vertex gives the greatest value (if the parabola opens down) or the least value (if it opens up).\n\nA ball is thrown upward. Its height in metres after $t$ seconds is $h(t)=-5t^2+20t$.\n\n1. Step 1: $a=-5<0$, so the parabola opens downward and has a **greatest** value.\n2. Step 2: The vertex is at $t=-\\frac{b}{2a}=-\\frac{20}{-10}=2$ seconds.\n3. Step 3: The greatest height is $h(2)=-5(4)+40=20$ metres.\n\nThe ball is back on the ground when $h=0$: $-5t(t-4)=0$, so at $t=4$.\n\n**Completing the square** gives the same: $x^2-6x+5=(x-3)^2-4$, so the least value is $-4$ at $x=3$.',
            'Titik puncak memberi nilai terbesar (jika parabola membuka ke bawah) atau nilai terkecil (jika membuka ke atas).\n\nSebuah bola dilempar ke atas. Tingginya dalam meter setelah $t$ detik adalah $h(t)=-5t^2+20t$.\n\n1. Langkah 1: $a=-5<0$, jadi parabola membuka ke bawah dan punya nilai **terbesar**.\n2. Langkah 2: Puncaknya di $t=-\\frac{b}{2a}=-\\frac{20}{-10}=2$ detik.\n3. Langkah 3: Tinggi terbesar adalah $h(2)=-5(4)+40=20$ meter.\n\nBola kembali ke tanah saat $h=0$: $-5t(t-4)=0$, yaitu pada $t=4$.\n\n**Melengkapkan kuadrat** memberi hasil yang sama: $x^2-6x+5=(x-3)^2-4$, jadi nilai terkecilnya $-4$ di $x=3$.',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: '-5*x^2+20*x', from: 0, to: 4, color: 'a' },
                dot([2, 20], '(2, 20)', 'result'),
              ],
              { x: [-1, 5], y: [-4, 24] },
            ),
            caption: L('The height of the ball over time.', 'Tinggi bola terhadap waktu.'),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The red dot is the vertex of $y=x^2-6x+5$. What is the least value of $y$?',
            'Titik merah adalah puncak $y=x^2-6x+5$. Berapa nilai terkecil $y$?',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: 'x^2-6*x+5', from: 0, to: 6.5, color: 'a' },
                dot([3, -4], undefined, 'result'),
              ],
              { x: [-1, 8], y: [-6, 10] },
            ),
            caption: L('The parabola y = x² - 6x + 5.', 'Parabola y = x² - 6x + 5.'),
          },
          options: [L('$-4$', '$-4$'), L('3', '3'), L('5', '5'), L('$-3$', '$-3$')],
          answer: 0,
          explain: L(
            'The vertex is at $x=-\\frac{-6}{2}=3$, and $y=9-18+5=-4$. The least value is the height of the dot, $-4$. (The number 3 is where it happens, not the value.)',
            'Puncaknya di $x=-\\frac{-6}{2}=3$, dan $y=9-18+5=-4$. Nilai terkecil adalah tinggi titik itu, $-4$. (Bilangan 3 adalah tempat terjadinya, bukan nilainya.)',
          ),
          hint: L(
            'The least value is a height, so it is the $y$-coordinate of the lowest point.',
            'Nilai terkecil adalah sebuah tinggi, jadi itu koordinat $y$ titik terendah.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: solve $x^2-4x+3=0$ with the formula.',
            'Coba bersama: selesaikan $x^2-4x+3=0$ dengan rumus.',
          ),
          template: 'D=16-12=___ \\quad \\sqrt{D}=___ \\quad x=(4\\pm\\sqrt{D})\\div2',
          blanks: ['4', '2'],
          explain: L(
            '$D=(-4)^2-4(1)(3)=4$, and $\\sqrt{4}=2$, so $x=\\frac{4\\pm2}{2}$, which gives 3 and 1.',
            '$D=(-4)^2-4(1)(3)=4$, dan $\\sqrt{4}=2$, jadi $x=\\frac{4\\pm2}{2}$, yaitu 3 dan 1.',
          ),
          hint: L(
            'Subtract inside the first blank. For the second blank, take the square root of the first.',
            'Kurangkan di blanko pertama. Untuk blanko kedua, ambil akar kuadrat dari yang pertama.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements about $y=x^2-4x+3$.', 'Pilih DUA pernyataan yang benar tentang $y=x^2-4x+3$.'),
          options: [
            L('The graph meets the $x$-axis at $x=1$ and $x=3$.', 'Grafik memotong sumbu $x$ di $x=1$ dan $x=3$.'),
            L('The axis of symmetry is $x=2$.', 'Sumbu simetrinya $x=2$.'),
            L('The parabola opens downward.', 'Parabola membuka ke bawah.'),
            L('The $y$-intercept is $(0,-3)$.', 'Titik potong sumbu $y$ adalah $(0,-3)$.'),
          ],
          answer: [0, 1],
          explain: L(
            '$(x-1)(x-3)=0$ gives the roots, and the axis is halfway between them. But $a=1>0$ means it opens upward, and the $y$-intercept is $c=3$, not $-3$.',
            '$(x-1)(x-3)=0$ memberi akar-akarnya, dan sumbunya di tengah keduanya. Namun $a=1>0$ berarti membuka ke atas, dan titik potong sumbu $y$ adalah $c=3$, bukan $-3$.',
          ),
          hint: L(
            'Factor the quadratic, and use the sign of $a$ for the opening direction.',
            'Faktorkan bentuk kuadratnya, dan pakai tanda $a$ untuk arah bukaan.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('$x^2+2x+5=0$ has no real roots.', '$x^2+2x+5=0$ tidak punya akar real.'),
            L('If $D=0$, the parabola touches the $x$-axis at one point.', 'Jika $D=0$, parabola menyinggung sumbu $x$ di satu titik.'),
            L('$y=-2x^2+8$ has a least value.', '$y=-2x^2+8$ punya nilai terkecil.'),
            L('The axis of symmetry of $y=x^2-6x+5$ is $x=3$.', 'Sumbu simetri $y=x^2-6x+5$ adalah $x=3$.'),
          ],
          answer: [true, true, false, true],
          explain: L(
            '$D=4-20<0$. A repeated root means a touch. Because $a=-2<0$, the parabola opens downward and has a greatest value of 8, not a least value. And $-\\frac{b}{2a}=3$.',
            '$D=4-20<0$. Akar kembar berarti menyinggung. Karena $a=-2<0$, parabola membuka ke bawah dan punya nilai terbesar 8, bukan nilai terkecil. Dan $-\\frac{b}{2a}=3$.',
          ),
          hint: L(
            'Look at the sign of $a$ to decide between a greatest and a least value.',
            'Lihat tanda $a$ untuk memutuskan antara nilai terbesar dan terkecil.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'A ball has height $h(t)=-5t^2+20t$ metres after $t$ seconds. What is the greatest height, in metres?',
            'Sebuah bola setinggi $h(t)=-5t^2+20t$ meter setelah $t$ detik. Berapa tinggi terbesarnya, dalam meter?',
          ),
          blanks: [{ answer: 20, after: '\\text{m}' }],
          hints: [
            L('The greatest height happens at the vertex of the parabola.', 'Tinggi terbesar terjadi di puncak parabola.'),
            L('The vertex is at $t=-\\frac{b}{2a}$ with $a=-5$ and $b=20$.', 'Puncaknya di $t=-\\frac{b}{2a}$ dengan $a=-5$ dan $b=20$.'),
            L('Put that $t$ back into $h(t)$.', 'Masukkan $t$ itu kembali ke $h(t)$.'),
          ],
          explain: L(
            '$t=-\\frac{20}{-10}=2$ and $h(2)=-5(4)+20(2)=-20+40=20$ metres.',
            '$t=-\\frac{20}{-10}=2$ dan $h(2)=-5(4)+20(2)=-20+40=20$ meter.',
          ),
          solution: ['t=-\\frac{20}{2(-5)}=2', 'h(2)=-5(4)+20(2)', '=20'],
        },
      ],
    },
  ],
  project: {
    id: 'tka-sma-m3-s2-p',
    runtime: 'math',
    title: L('Parabolas at Work', 'Parabola dalam Pemakaian'),
    brief: L(
      'Find roots and vertices, use the discriminant, maximise an area and read a parabola from its graph.',
      'Cari akar dan titik puncak, pakai diskriminan, maksimumkan luas, dan baca parabola dari grafiknya.',
    ),
    requirements: [
      L('Find roots, vertex and greatest value of a quadratic.', 'Mencari akar, titik puncak, dan nilai terbesar fungsi kuadrat.'),
      L('Use the discriminant to count the roots.', 'Memakai diskriminan untuk menghitung banyak akar.'),
    ],
    hints: [
      L('Factor, or use the quadratic formula. The vertex is at $x=-\\frac{b}{2a}$.', 'Faktorkan, atau pakai rumus kuadrat. Puncak ada di $x=-\\frac{b}{2a}$.'),
      L('One repeated root means $D=0$.', 'Satu akar kembar berarti $D=0$.'),
      L('A parabola with no real roots has $D<0$.', 'Parabola tanpa akar real punya $D<0$.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L(
          'Solve $x^2-5x+6=0$. Give the smaller root first.',
          'Selesaikan $x^2-5x+6=0$. Tulis akar yang lebih kecil lebih dulu.',
        ),
        inline: true,
        blanks: [
          { label: { en: '\\text{smaller } x =', id: '\\text{yang kecil } x =' }, answer: 2 },
          { label: { en: '\\text{larger } x =', id: '\\text{yang besar } x =' }, answer: 3 },
        ],
        solution: ['(x-2)(x-3)=0', 'x=2 \\quad x=3'],
      },
      {
        prompt: L(
          'Find the vertex $(p,q)$ of $y=x^2-6x+8$.',
          'Tentukan titik puncak $(p,q)$ dari $y=x^2-6x+8$.',
        ),
        figure: {
          ...plane(
            [
              { t: 'curve', f: 'x^2-6*x+8', from: 0.2, to: 5.8, color: 'a' },
              dot([3, -1], undefined, 'result'),
            ],
            { x: [-1, 7], y: [-3, 9] },
          ),
          caption: L('The parabola with its vertex marked.', 'Parabola dengan titik puncaknya ditandai.'),
        },
        inline: true,
        blanks: [
          { label: 'p =', answer: 3 },
          { label: 'q =', answer: -1 },
        ],
        solution: ['p=-\\frac{-6}{2}=3', 'q=9-18+8=-1'],
      },
      {
        prompt: L(
          'For which value of $k$ does $x^2-4x+k=0$ have exactly one (repeated) root?',
          'Untuk nilai $k$ berapa $x^2-4x+k=0$ punya tepat satu akar (kembar)?',
        ),
        blanks: [{ label: 'k =', answer: 4 }],
        solution: ['D=(-4)^2-4(1)(k)=16-4k', '16-4k=0', 'k=4'],
      },
      {
        prompt: L(
          'A farmer has 40 m of fence for a rectangular pen. If the width is $x$ m, the length is $20-x$ m and the area is $x(20-x)$. What is the greatest area, in square metres?',
          'Seorang petani punya pagar sepanjang 40 m untuk kandang persegi panjang. Jika lebarnya $x$ m, panjangnya $20-x$ m dan luasnya $x(20-x)$. Berapa luas terbesar, dalam meter persegi?',
        ),
        blanks: [{ answer: 100, after: '\\text{m}^2' }],
        solution: ['A=20x-x^2=-x^2+20x', 'x=-\\frac{20}{2(-1)}=10', 'A=10\\times10=100'],
      },
      {
        prompt: L(
          'For which smallest integer $k$ does $x^2-6x+k=0$ have no real roots?',
          'Untuk bilangan bulat $k$ terkecil berapa $x^2-6x+k=0$ tidak punya akar real?',
        ),
        blanks: [{ label: 'k =', answer: 10 }],
        solution: ['D=(-6)^2-4(1)(k)=36-4k<0', 'k>9 \\Rightarrow k=10'],
      },
    ],
  },
}
