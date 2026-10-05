import type { Submodule } from '../types'
import { L, dot, plane } from './figs'

/** Module 3, submodule 2 — quadratic functions, then exponential growth and
 *  decay. */

export const m3s2: Submodule = {
  id: 'tka-sma-m3-s2',
  title: L('Quadratic and Exponential Functions', 'Fungsi Kuadrat dan Eksponensial'),
  summary: L(
    'Read and sketch a parabola from its roots and vertex, use the discriminant, and model growth and decay with an exponential function.',
    'Membaca dan menggambar parabola dari akar dan titik puncaknya, memakai diskriminan, serta memodelkan pertumbuhan dan peluruhan dengan fungsi eksponensial.',
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
          template: 'D=16-12=___ \\quad x=\\frac{4\\pm___}{2}',
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
    /* --------------------------------------------------------- L2 exponential */
    {
      id: 'tka-sma-m3-s2-l2',
      title: L('Exponential Growth and Decay', 'Pertumbuhan dan Peluruhan Eksponensial'),
      goal: L(
        'You can read the graph of an exponential function, model growth and half-life, and solve a simple exponential equation.',
        'Kamu bisa membaca grafik fungsi eksponensial, memodelkan pertumbuhan dan waktu paruh, dan menyelesaikan persamaan eksponensial sederhana.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Up Fast, Down Slowly', 'Ayo Amati: Naik Cepat, Turun Perlahan'),
          body: L(
            'In an **exponential function** $y=a^x$ the variable is in the exponent ($a>0$, $a\\neq1$).\n\n- If $a>1$ the graph **rises** faster and faster: $y=2^x$ (green).\n- If $0<a<1$ the graph **falls** and flattens: $y=\\left(\\frac{1}{2}\\right)^x$ (orange).\n- Both pass through $(0,1)$ because $a^0=1$.\n- Both stay **above** the $x$-axis: $a^x>0$ for every $x$. The $x$-axis is a horizontal **asymptote**: the curve comes closer and closer but never touches it.\n\nThe two curves are mirror images in the $y$-axis, because $\\left(\\frac{1}{2}\\right)^x=2^{-x}$.',
            'Pada **fungsi eksponensial** $y=a^x$ variabelnya berada di eksponen ($a>0$, $a\\neq1$).\n\n- Jika $a>1$ grafik **naik** makin cepat: $y=2^x$ (hijau).\n- Jika $0<a<1$ grafik **turun** dan mendatar: $y=\\left(\\frac{1}{2}\\right)^x$ (oranye).\n- Keduanya melalui $(0,1)$ karena $a^0=1$.\n- Keduanya tetap **di atas** sumbu $x$: $a^x>0$ untuk setiap $x$. Sumbu $x$ adalah **asimtot** mendatar: kurva makin dekat tetapi tidak pernah menyentuhnya.\n\nKedua kurva saling bercermin terhadap sumbu $y$, karena $\\left(\\frac{1}{2}\\right)^x=2^{-x}$.',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: '2^x', from: -3, to: 3.2, color: 'a' },
                { t: 'curve', f: '0.5^x', from: -3.2, to: 3, color: 'b' },
                dot([0, 1], '(0, 1)', 'result'),
              ],
              { x: [-4, 4], y: [-2, 9] },
            ),
            caption: L('y = 2^x (green) and y = (1/2)^x (orange).', 'y = 2^x (hijau) dan y = (1/2)^x (oranye).'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Growth and Half-Life', 'Contoh Bertahap: Pertumbuhan dan Waktu Paruh'),
          body: L(
            'A quantity that grows or shrinks by the same **factor** in equal time steps is modelled by\n\n$$N=N_0\\cdot r^{t}$$\n\nwhere $N_0$ is the starting amount and $r$ is the factor per step.\n\n**Growth:** 100 bacteria that double every hour: $N=100\\cdot2^{t}$. After 3 hours: $100\\times8=800$.\n\n**Decay (half-life):** a medicine has a half-life of 3 days: every 3 days half is left. From 80 g:\n\n1. Step 1: After 3 days: $80\\times\\frac{1}{2}=40$ g.\n2. Step 2: After 6 days: $40\\times\\frac{1}{2}=20$ g.\n3. Step 3: After 9 days: $20\\times\\frac{1}{2}=10$ g.\n\nIn one formula: $A=80\\cdot\\left(\\frac{1}{2}\\right)^{t/3}$. At $t=9$ it gives $80\\cdot\\left(\\frac{1}{2}\\right)^{3}=10$.',
            'Besaran yang bertambah atau berkurang dengan **faktor** yang sama pada selang waktu yang sama dimodelkan dengan\n\n$$N=N_0\\cdot r^{t}$$\n\ndengan $N_0$ jumlah awal dan $r$ faktor per langkah.\n\n**Pertumbuhan:** 100 bakteri yang berlipat dua setiap jam: $N=100\\cdot2^{t}$. Setelah 3 jam: $100\\times8=800$.\n\n**Peluruhan (waktu paruh):** sebuah obat punya waktu paruh 3 hari: setiap 3 hari tersisa setengah. Dari 80 g:\n\n1. Langkah 1: Setelah 3 hari: $80\\times\\frac{1}{2}=40$ g.\n2. Langkah 2: Setelah 6 hari: $40\\times\\frac{1}{2}=20$ g.\n3. Langkah 3: Setelah 9 hari: $20\\times\\frac{1}{2}=10$ g.\n\nDalam satu rumus: $A=80\\cdot\\left(\\frac{1}{2}\\right)^{t/3}$. Pada $t=9$ rumus ini memberi $80\\cdot\\left(\\frac{1}{2}\\right)^{3}=10$.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Watch Out!: Solving an Exponential Equation', 'Awas, Jebakan!: Menyelesaikan Persamaan Eksponensial'),
          body: L(
            'If two powers with the same base are equal, the exponents are equal: $a^m=a^n\\Rightarrow m=n$. So write both sides with the same base.\n\nSolve $3^{x+1}=81$.\n\n1. Step 1: $81=3^4$.\n2. Step 2: $3^{x+1}=3^4$, so $x+1=4$.\n3. Step 3: $x=3$.\n\nIf the bases cannot be matched, use a logarithm: $2^x=10$ gives $x=\\log_2 10\\approx3.32$.\n\n**Common mistakes:**\n\n- $2^x$ is **not** the same as $2x$: $2^3=8$ but $2\\times3=6$.\n- $(2^x)^2=2^{2x}$, not $2^{x+2}$.\n- An exponential never equals zero or a negative number: $2^x=-4$ has no solution.',
            'Jika dua pangkat dengan basis sama bernilai sama, eksponennya sama: $a^m=a^n\\Rightarrow m=n$. Jadi tulis kedua ruas dengan basis yang sama.\n\nSelesaikan $3^{x+1}=81$.\n\n1. Langkah 1: $81=3^4$.\n2. Langkah 2: $3^{x+1}=3^4$, jadi $x+1=4$.\n3. Langkah 3: $x=3$.\n\nJika basisnya tidak dapat disamakan, pakai logaritma: $2^x=10$ memberi $x=\\log_2 10\\approx3{,}32$.\n\n**Kesalahan umum:**\n\n- $2^x$ **bukan** sama dengan $2x$: $2^3=8$ tetapi $2\\times3=6$.\n- $(2^x)^2=2^{2x}$, bukan $2^{x+2}$.\n- Eksponensial tidak pernah bernilai nol atau negatif: $2^x=-4$ tidak punya penyelesaian.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'Which equation gives the orange curve?',
            'Persamaan manakah yang memberikan kurva oranye?',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: '2^x', from: -3, to: 3.2, color: 'a' },
                { t: 'curve', f: '0.5^x', from: -3.2, to: 3, color: 'b' },
              ],
              { x: [-4, 4], y: [-2, 9] },
            ),
            caption: L('Two exponential curves.', 'Dua kurva eksponensial.'),
          },
          options: [
            L('$y=\\left(\\frac{1}{2}\\right)^x$', '$y=\\left(\\frac{1}{2}\\right)^x$'),
            L('$y=2^x$', '$y=2^x$'),
            L('$y=2^x-1$', '$y=2^x-1$'),
            L('$y=x^2$', '$y=x^2$'),
          ],
          answer: 0,
          explain: L(
            'The orange curve falls as $x$ grows and passes through $(0,1)$, so its base is between 0 and 1: $y=\\left(\\frac{1}{2}\\right)^x$. The green curve is $2^x$.',
            'Kurva oranye turun saat $x$ membesar dan melalui $(0,1)$, jadi basisnya antara 0 dan 1: $y=\\left(\\frac{1}{2}\\right)^x$. Kurva hijau adalah $2^x$.',
          ),
          hint: L(
            'Does the orange curve rise or fall to the right? What base does that mean?',
            'Apakah kurva oranye naik atau turun ke kanan? Basis seperti apa artinya?',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: 80 g of a medicine with a half-life of 3 days. How much is left after 3 days and after 6 days?',
            'Coba bersama: 80 g obat dengan waktu paruh 3 hari. Berapa yang tersisa setelah 3 hari dan setelah 6 hari?',
          ),
          template: '80\\times\\frac{1}{2}=___ \\quad ___\\times\\frac{1}{2}=___',
          blanks: ['40', '40', '20'],
          explain: L(
            'After 3 days half of 80 is 40. After another 3 days half of 40 is 20.',
            'Setelah 3 hari setengah dari 80 adalah 40. Setelah 3 hari lagi setengah dari 40 adalah 20.',
          ),
          hint: L(
            'The second row starts from the answer of the first.',
            'Baris kedua dimulai dari jawaban baris pertama.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements about $y=2^x$.', 'Pilih DUA pernyataan yang benar tentang $y=2^x$.'),
          options: [
            L('The graph passes through $(0,1)$.', 'Grafik melalui $(0,1)$.'),
            L('$y$ is always positive.', '$y$ selalu positif.'),
            L('$y$ takes negative values for negative $x$.', '$y$ bernilai negatif untuk $x$ negatif.'),
            L('The graph goes down as $x$ increases.', 'Grafik turun saat $x$ bertambah.'),
          ],
          answer: [0, 1],
          explain: L(
            '$2^0=1$, and a positive base to any power is positive. For negative $x$ the value is a small positive number, like $2^{-3}=\\frac{1}{8}$. And with base 2 the graph goes up.',
            '$2^0=1$, dan basis positif dipangkatkan apa pun hasilnya positif. Untuk $x$ negatif nilainya bilangan positif kecil, seperti $2^{-3}=\\frac{1}{8}$. Dan dengan basis 2 grafik naik.',
          ),
          hint: L(
            'Try $x=0$, $x=3$ and $x=-3$ and look at the values.',
            'Coba $x=0$, $x=3$, dan $x=-3$ lalu lihat nilainya.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('$y=\\left(\\frac{1}{3}\\right)^x$ is a decreasing function.', '$y=\\left(\\frac{1}{3}\\right)^x$ adalah fungsi turun.'),
            L('$2^x=0$ for some value of $x$.', '$2^x=0$ untuk suatu nilai $x$.'),
            L('If $2^x=2^5$, then $x=5$.', 'Jika $2^x=2^5$, maka $x=5$.'),
            L('$3^{x+1}=81$ gives $x=4$.', '$3^{x+1}=81$ memberi $x=4$.'),
          ],
          answer: [true, false, true, false],
          explain: L(
            'A base between 0 and 1 gives a falling graph. An exponential is never 0. Equal bases mean equal exponents. And $3^{x+1}=3^4$ gives $x+1=4$, so $x=3$.',
            'Basis antara 0 dan 1 memberi grafik turun. Eksponensial tidak pernah 0. Basis sama berarti eksponen sama. Dan $3^{x+1}=3^4$ memberi $x+1=4$, jadi $x=3$.',
          ),
          hint: L(
            'For the last one, remember the exponent is $x+1$, not $x$.',
            'Untuk yang terakhir, ingat eksponennya $x+1$, bukan $x$.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'A substance has a half-life of 5 hours. From 100 g, after $t$ hours $A=100\\cdot\\left(\\frac{1}{2}\\right)^{t/5}$ grams remain. After how many hours are 6.25 g left?',
            'Sebuah zat punya waktu paruh 5 jam. Dari 100 g, setelah $t$ jam tersisa $A=100\\cdot\\left(\\frac{1}{2}\\right)^{t/5}$ gram. Setelah berapa jam tersisa 6,25 g?',
          ),
          blanks: [{ label: 't =', answer: 20, after: '\\text{h}' }],
          hints: [
            L('Divide 100 by 6.25 to see how many halvings are needed.', 'Bagi 100 dengan 6,25 untuk mengetahui berapa kali harus dibelah dua.'),
            L('$100\\div6.25=16=2^4$, so $\\left(\\frac{1}{2}\\right)^{t/5}=\\frac{1}{16}=\\left(\\frac{1}{2}\\right)^4$.', '$100\\div6{,}25=16=2^4$, jadi $\\left(\\frac{1}{2}\\right)^{t/5}=\\frac{1}{16}=\\left(\\frac{1}{2}\\right)^4$.'),
            L('Equal bases: $\\frac{t}{5}=4$.', 'Basis sama: $\\frac{t}{5}=4$.'),
          ],
          explain: L(
            '$6.25=100\\cdot\\left(\\frac{1}{2}\\right)^{t/5}$ gives $\\left(\\frac{1}{2}\\right)^{t/5}=\\frac{1}{16}=\\left(\\frac{1}{2}\\right)^4$, so $\\frac{t}{5}=4$ and $t=20$ hours.',
            '$6{,}25=100\\cdot\\left(\\frac{1}{2}\\right)^{t/5}$ memberi $\\left(\\frac{1}{2}\\right)^{t/5}=\\frac{1}{16}=\\left(\\frac{1}{2}\\right)^4$, jadi $\\frac{t}{5}=4$ dan $t=20$ jam.',
          ),
          solution: {
            en: ['\\left(\\frac{1}{2}\\right)^{t/5}=\\frac{6.25}{100}=\\frac{1}{16}=\\left(\\frac{1}{2}\\right)^4', '\\frac{t}{5}=4', 't=20'],
            id: ['\\left(\\frac{1}{2}\\right)^{t/5}=\\frac{6{,}25}{100}=\\frac{1}{16}=\\left(\\frac{1}{2}\\right)^4', '\\frac{t}{5}=4', 't=20'],
          },
        },
      ],
    },
  ],
  project: {
    id: 'tka-sma-m3-s2-p',
    runtime: 'math',
    title: L('Parabolas and Exponentials', 'Parabola dan Eksponensial'),
    brief: L(
      'Find roots and vertices, use the discriminant, maximise an area and model decay.',
      'Cari akar dan titik puncak, pakai diskriminan, maksimumkan luas, dan modelkan peluruhan.',
    ),
    requirements: [
      L('Find roots, vertex and greatest value of a quadratic.', 'Mencari akar, titik puncak, dan nilai terbesar fungsi kuadrat.'),
      L('Model growth or decay with an exponential function.', 'Memodelkan pertumbuhan atau peluruhan dengan fungsi eksponensial.'),
    ],
    hints: [
      L('Factor, or use the quadratic formula. The vertex is at $x=-\\frac{b}{2a}$.', 'Faktorkan, atau pakai rumus kuadrat. Puncak ada di $x=-\\frac{b}{2a}$.'),
      L('One repeated root means $D=0$.', 'Satu akar kembar berarti $D=0$.'),
      L('In decay, halve once per half-life.', 'Pada peluruhan, bagi dua sekali per waktu paruh.'),
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
          '640 g of a substance with a half-life of 4 years remain after $t$ years as $640\\cdot\\left(\\frac{1}{2}\\right)^{t/4}$ g. How many grams are left after 12 years?',
          'Zat 640 g dengan waktu paruh 4 tahun tersisa setelah $t$ tahun sebanyak $640\\cdot\\left(\\frac{1}{2}\\right)^{t/4}$ g. Berapa gram yang tersisa setelah 12 tahun?',
        ),
        blanks: [{ answer: 80, after: '\\text{g}' }],
        solution: {
          en: ['\\frac{12}{4}=3 \\text{ half-lives}', '640\\cdot\\left(\\frac{1}{2}\\right)^3=640\\cdot\\frac{1}{8}=80'],
          id: ['\\frac{12}{4}=3 \\text{ waktu paruh}', '640\\cdot\\left(\\frac{1}{2}\\right)^3=640\\cdot\\frac{1}{8}=80'],
        },
      },
    ],
  },
}
