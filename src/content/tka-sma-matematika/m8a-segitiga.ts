import type { Submodule } from '../types'
import { L, rightTriangle } from './figs'
import { lessonReciprocal } from './m8c-resiprokal'

/** Module 8, submodule 1 — trigonometric ratios in right triangles, and the
 *  reciprocal ratios cotangent, secant and cosecant. */

export const m8s1: Submodule = {
  id: 'tka-sma-m8-s1',
  title: L('Trigonometric Ratios', 'Perbandingan Trigonometri'),
  summary: L(
    'Use sine, cosine and tangent in right triangles with the special angles, and the reciprocal ratios cotangent, secant and cosecant.',
    'Memakai sinus, kosinus, dan tangen pada segitiga siku-siku dengan sudut istimewa, serta perbandingan kebalikan kotangen, sekan, dan kosekan.',
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
    lessonReciprocal,
  ],
  project: {
    id: 'tka-sma-m8-s1-p',
    runtime: 'math',
    title: L('Trigonometric Ratios at Work', 'Perbandingan Trigonometri dalam Pemakaian'),
    brief: L(
      'Find heights, sides and exact values with sine, cosine, tangent and their reciprocals.',
      'Cari tinggi, sisi, dan nilai eksak dengan sinus, kosinus, tangen, dan kebalikannya.',
    ),
    requirements: [
      L('Use sine, cosine and tangent of special angles in a right triangle.', 'Memakai sinus, kosinus, dan tangen sudut istimewa pada segitiga siku-siku.'),
      L('Use the reciprocal ratios.', 'Memakai perbandingan kebalikan.'),
    ],
    hints: [
      L('SOH-CAH-TOA: choose the ratio with the side you know and the side you want.', 'SOH-CAH-TOA: pilih perbandingan yang memuat sisi yang diketahui dan yang dicari.'),
      L('Learn the table of $30^{\\circ}$, $45^{\\circ}$ and $60^{\\circ}$.', 'Hafalkan tabel $30^{\\circ}$, $45^{\\circ}$, dan $60^{\\circ}$.'),
      L('$\\csc$, $\\sec$ and $\\cot$ are $\\frac{1}{\\sin}$, $\\frac{1}{\\cos}$ and $\\frac{1}{\\tan}$.', '$\\csc$, $\\sec$, dan $\\cot$ adalah $\\frac{1}{\\sin}$, $\\frac{1}{\\cos}$, dan $\\frac{1}{\\tan}$.'),
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
          'Find the value of $\\sin60^{\\circ}\\cos30^{\\circ}+\\cos60^{\\circ}\\sin30^{\\circ}$.',
          'Tentukan nilai $\\sin60^{\\circ}\\cos30^{\\circ}+\\cos60^{\\circ}\\sin30^{\\circ}$.',
        ),
        blanks: [{ answer: 1 }],
        solution: ['\\frac{\\sqrt{3}}{2}\\cdot\\frac{\\sqrt{3}}{2}+\\frac{1}{2}\\cdot\\frac{1}{2}=\\frac{3}{4}+\\frac{1}{4}', '=1'],
      },
      {
        prompt: L(
          'A ramp rises 3 m over a horizontal distance of 4 m. If $\\theta$ is its angle with the ground, what is $\\sin\\theta$? (Type it as a fraction such as 1/2.)',
          'Sebuah tanjakan naik 3 m pada jarak mendatar 4 m. Jika $\\theta$ adalah sudutnya dengan tanah, berapa $\\sin\\theta$? (Ketik sebagai pecahan seperti 1/2.)',
        ),
        blanks: [{ label: '\\sin\\theta =', answer: 3 / 5 }],
        solution: { en: ['\\text{length}=\\sqrt{3^2+4^2}=5', '\\sin\\theta=\\frac{3}{5}'], id: ['\\text{panjang}=\\sqrt{3^2+4^2}=5', '\\sin\\theta=\\frac{3}{5}'] },
      },
      {
        prompt: L(
          'Find the value of $\\csc45^{\\circ}\\times\\sec60^{\\circ}$ as a decimal, to two decimal places.',
          'Tentukan nilai $\\csc45^{\\circ}\\times\\sec60^{\\circ}$ sebagai desimal, sampai dua angka di belakang koma.',
        ),
        blanks: [{ answer: 2 * Math.sqrt(2) }],
        solution: ['\\csc45^{\\circ}=\\sqrt{2} \\quad \\sec60^{\\circ}=2', '\\sqrt{2}\\times2=2\\sqrt{2}'],
      },
    ],
  },
}
