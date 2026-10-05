import type { FigItem, Figure } from '../../lib/figure'
import type { Submodule } from '../types'
import { L, dot, line, plane, txt } from './figs'
import type { Pt } from './figs'

/** Module 8, submodule 2 — the unit circle and radians, identities and
 *  equations, and the graphs of sine and cosine. */

const rad = (d: number) => (d * Math.PI) / 180
const tidy = (n: number) => Number(n.toFixed(4))
const at = (deg: number, r = 1): Pt => [tidy(r * Math.cos(rad(deg))), tidy(r * Math.sin(rad(deg)))]

/** The unit circle on equal axes, with extra items drawn over it. */
function unitCircle(extra: FigItem[]): Figure {
  return plane(
    [{ t: 'param', x: 'cos(t)', y: 'sin(t)', from: 0, to: 6.2832, color: 'muted' }, ...extra],
    { x: [-1.7, 1.7], y: [-1.7, 1.7] },
  )
}

export const m8s2: Submodule = {
  id: 'tka-sma-m8-s2',
  title: L('The Unit Circle, Identities and Graphs', 'Lingkaran Satuan, Identitas, dan Grafik'),
  summary: L(
    'Use the unit circle and radians for angles of any size, the basic identities, simple trigonometric equations, and the graphs of sine and cosine.',
    'Memakai lingkaran satuan dan radian untuk sudut berukuran apa pun, identitas dasar, persamaan trigonometri sederhana, dan grafik sinus dan kosinus.',
  ),
  lessons: [
    /* ------------------------------------------------------ L1 unit circle */
    {
      id: 'tka-sma-m8-s2-l1',
      title: L('The Unit Circle and Radians', 'Lingkaran Satuan dan Radian'),
      goal: L(
        'You can read sine and cosine of any angle from the unit circle, use reference angles, and convert between degrees and radians.',
        'Kamu bisa membaca sinus dan kosinus sudut apa pun dari lingkaran satuan, memakai sudut acuan, dan mengubah antara derajat dan radian.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Angles Around the Circle', 'Ayo Amati: Sudut di Sekeliling Lingkaran'),
          body: L(
            'Triangles only give angles up to $90^{\\circ}$. The **unit circle** (radius 1, centre at the origin) works for any angle.\n\nTurn from the positive $x$-axis anticlockwise by $\\theta$. You land on the point $P=(\\cos\\theta,\\ \\sin\\theta)$.\n\n- The $x$-coordinate of $P$ is $\\cos\\theta$ and the $y$-coordinate is $\\sin\\theta$.\n- For $\\theta=60^{\\circ}$: $P=\\left(\\frac{1}{2},\\ \\frac{\\sqrt{3}}{2}\\right)$ (the red dot).\n- $\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}$ is the slope of the line $OP$.\n\nThe signs follow the quadrants. Quadrant I: all positive. II: only sine positive. III: only tangent positive. IV: only cosine positive.',
            'Segitiga hanya memberi sudut sampai $90^{\\circ}$. **Lingkaran satuan** (jari-jari 1, pusat di titik asal) berlaku untuk sudut apa pun.\n\nPutar dari sumbu $x$ positif berlawanan arah jarum jam sebesar $\\theta$. Kamu mendarat di titik $P=(\\cos\\theta,\\ \\sin\\theta)$.\n\n- Koordinat $x$ dari $P$ adalah $\\cos\\theta$ dan koordinat $y$ adalah $\\sin\\theta$.\n- Untuk $\\theta=60^{\\circ}$: $P=\\left(\\frac{1}{2},\\ \\frac{\\sqrt{3}}{2}\\right)$ (titik merah).\n- $\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}$ adalah kemiringan garis $OP$.\n\nTandanya mengikuti kuadran. Kuadran I: semua positif. II: hanya sinus positif. III: hanya tangen positif. IV: hanya kosinus positif.',
          ),
          figure: {
            ...unitCircle([
              line([0, 0], at(60), 'result', { width: 2.4 }),
              line(at(60), [0.5, 0], 'muted', { dashed: true }),
              line(at(60), [0, 0.866], 'muted', { dashed: true }),
              { t: 'angle', at: [0, 0], from: [1, 0], to: at(60), label: '60°' },
              dot(at(60), 'P', 'result'),
            ]),
            caption: L('The point P at angle 60° on the unit circle.', 'Titik P pada sudut 60° di lingkaran satuan.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Reference Angles', 'Contoh Bertahap: Sudut Acuan'),
          body: L(
            'Every angle has a **reference angle**: the acute angle between its line and the $x$-axis. Values of sine and cosine equal those of the reference angle, up to a **sign** decided by the quadrant.\n\n- Quadrant II: $\\sin(180^{\\circ}-\\theta)=\\sin\\theta$, $\\cos(180^{\\circ}-\\theta)=-\\cos\\theta$.\n- Quadrant III: $\\sin(180^{\\circ}+\\theta)=-\\sin\\theta$, $\\cos(180^{\\circ}+\\theta)=-\\cos\\theta$.\n- Quadrant IV: $\\sin(360^{\\circ}-\\theta)=-\\sin\\theta$, $\\cos(360^{\\circ}-\\theta)=\\cos\\theta$.\n\nExample: $\\cos150^{\\circ}$.\n\n1. Step 1: $150^{\\circ}$ is in quadrant II; its reference angle is $180^{\\circ}-150^{\\circ}=30^{\\circ}$.\n2. Step 2: $\\cos30^{\\circ}=\\frac{\\sqrt{3}}{2}$.\n3. Step 3: In quadrant II cosine is negative: $\\cos150^{\\circ}=-\\frac{\\sqrt{3}}{2}$.\n\nThe four points in the picture are $30^{\\circ}$, $150^{\\circ}$, $210^{\\circ}$ and $330^{\\circ}$: they share the numbers $\\frac{\\sqrt{3}}{2}$ and $\\frac{1}{2}$, with different signs.',
            'Setiap sudut punya **sudut acuan**: sudut lancip antara garisnya dan sumbu $x$. Nilai sinus dan kosinus sama dengan sudut acuannya, hingga **tanda** yang ditentukan oleh kuadran.\n\n- Kuadran II: $\\sin(180^{\\circ}-\\theta)=\\sin\\theta$, $\\cos(180^{\\circ}-\\theta)=-\\cos\\theta$.\n- Kuadran III: $\\sin(180^{\\circ}+\\theta)=-\\sin\\theta$, $\\cos(180^{\\circ}+\\theta)=-\\cos\\theta$.\n- Kuadran IV: $\\sin(360^{\\circ}-\\theta)=-\\sin\\theta$, $\\cos(360^{\\circ}-\\theta)=\\cos\\theta$.\n\nContoh: $\\cos150^{\\circ}$.\n\n1. Langkah 1: $150^{\\circ}$ ada di kuadran II; sudut acuannya $180^{\\circ}-150^{\\circ}=30^{\\circ}$.\n2. Langkah 2: $\\cos30^{\\circ}=\\frac{\\sqrt{3}}{2}$.\n3. Langkah 3: Di kuadran II kosinus negatif: $\\cos150^{\\circ}=-\\frac{\\sqrt{3}}{2}$.\n\nKeempat titik pada gambar adalah $30^{\\circ}$, $150^{\\circ}$, $210^{\\circ}$, dan $330^{\\circ}$: semuanya memakai bilangan $\\frac{\\sqrt{3}}{2}$ dan $\\frac{1}{2}$, dengan tanda yang berbeda.',
          ),
          figure: {
            ...unitCircle([
              dot(at(30), '30°', 'a'),
              dot(at(150), '150°', 'b'),
              dot(at(210), '210°', 'c'),
              dot(at(330), '330°', 'result'),
              line(at(30), at(150), 'muted', { dashed: true }),
              line(at(210), at(330), 'muted', { dashed: true }),
              line(at(30), at(330), 'muted', { dashed: true }),
              line(at(150), at(210), 'muted', { dashed: true }),
            ]),
            caption: L('Four angles with the same reference angle 30°.', 'Empat sudut dengan sudut acuan yang sama, 30°.'),
          },
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Radians', 'Contoh Bertahap: Radian'),
          body: L(
            'A **radian** measures an angle by the arc it cuts on the unit circle. A half-turn cuts an arc of length $\\pi$, so\n\n$$180^{\\circ}=\\pi\\ \\text{radians}\\qquad 1^{\\circ}=\\frac{\\pi}{180}\\ \\text{rad}$$\n\n| Degrees | $30^{\\circ}$ | $45^{\\circ}$ | $60^{\\circ}$ | $90^{\\circ}$ | $180^{\\circ}$ | $360^{\\circ}$ |\n|---|---|---|---|---|---|---|\n| Radians | $\\frac{\\pi}{6}$ | $\\frac{\\pi}{4}$ | $\\frac{\\pi}{3}$ | $\\frac{\\pi}{2}$ | $\\pi$ | $2\\pi$ |\n\nConvert $150^{\\circ}$: $150\\times\\frac{\\pi}{180}=\\frac{5\\pi}{6}$.\n\nIn radians, an arc of a circle of radius $r$ with angle $\\theta$ has length $s=r\\theta$ and the sector has area $\\frac{1}{2}r^2\\theta$. For $r=6$ and $\\theta=\\frac{\\pi}{3}$: $s=6\\times\\frac{\\pi}{3}=2\\pi$.',
            '**Radian** mengukur sudut dengan busur yang dipotongnya pada lingkaran satuan. Setengah putaran memotong busur sepanjang $\\pi$, sehingga\n\n$$180^{\\circ}=\\pi\\ \\text{radian}\\qquad 1^{\\circ}=\\frac{\\pi}{180}\\ \\text{rad}$$\n\n| Derajat | $30^{\\circ}$ | $45^{\\circ}$ | $60^{\\circ}$ | $90^{\\circ}$ | $180^{\\circ}$ | $360^{\\circ}$ |\n|---|---|---|---|---|---|---|\n| Radian | $\\frac{\\pi}{6}$ | $\\frac{\\pi}{4}$ | $\\frac{\\pi}{3}$ | $\\frac{\\pi}{2}$ | $\\pi$ | $2\\pi$ |\n\nUbah $150^{\\circ}$: $150\\times\\frac{\\pi}{180}=\\frac{5\\pi}{6}$.\n\nDalam radian, busur lingkaran berjari-jari $r$ dengan sudut $\\theta$ panjangnya $s=r\\theta$ dan juringnya berluas $\\frac{1}{2}r^2\\theta$. Untuk $r=6$ dan $\\theta=\\frac{\\pi}{3}$: $s=6\\times\\frac{\\pi}{3}=2\\pi$.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The red dot is at the angle $150^{\\circ}$ on the unit circle. What is $\\cos150^{\\circ}$?',
            'Titik merah berada pada sudut $150^{\\circ}$ di lingkaran satuan. Berapa $\\cos150^{\\circ}$?',
          ),
          figure: {
            ...unitCircle([
              line([0, 0], at(150), 'result', { width: 2.4 }),
              { t: 'angle', at: [0, 0], from: [1, 0], to: at(150), label: '150°' },
              dot(at(150), undefined, 'result'),
            ]),
            caption: L('A point on the unit circle at 150°.', 'Sebuah titik pada lingkaran satuan di 150°.'),
          },
          options: [
            L('$-\\frac{\\sqrt{3}}{2}$', '$-\\frac{\\sqrt{3}}{2}$'),
            L('$\\frac{\\sqrt{3}}{2}$', '$\\frac{\\sqrt{3}}{2}$'),
            L('$-\\frac{1}{2}$', '$-\\frac{1}{2}$'),
            L('$\\frac{1}{2}$', '$\\frac{1}{2}$'),
          ],
          answer: 0,
          explain: L(
            'The cosine is the $x$-coordinate. The dot is left of the $y$-axis, so it is negative, and the reference angle is $30^{\\circ}$, so its size is $\\frac{\\sqrt{3}}{2}$. The height of the dot, $\\frac{1}{2}$, is the sine.',
            'Kosinus adalah koordinat $x$. Titik berada di kiri sumbu $y$, jadi negatif, dan sudut acuannya $30^{\\circ}$, jadi besarnya $\\frac{\\sqrt{3}}{2}$. Tinggi titik, $\\frac{1}{2}$, adalah sinus.',
          ),
          hint: L(
            'Cosine is the $x$-coordinate. Is the dot to the left or right of the vertical axis?',
            'Kosinus adalah koordinat $x$. Apakah titik berada di kiri atau kanan sumbu tegak?',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: use the reference angle to find $\\sin150^{\\circ}$.',
            'Coba bersama: pakai sudut acuan untuk mencari $\\sin150^{\\circ}$.',
          ),
          template: '\\sin150^{\\circ}=\\sin___^{\\circ}=\\frac{1}{___}',
          blanks: ['30', '2'],
          explain: L(
            '$\\sin(180^{\\circ}-150^{\\circ})=\\sin30^{\\circ}=\\frac{1}{2}$, and sine is positive in quadrant II.',
            '$\\sin(180^{\\circ}-150^{\\circ})=\\sin30^{\\circ}=\\frac{1}{2}$, dan sinus positif di kuadran II.',
          ),
          hint: L(
            'In quadrant II, the sine equals the sine of $180^{\\circ}$ minus the angle.',
            'Di kuadran II, sinus sama dengan sinus dari $180^{\\circ}$ dikurangi sudutnya.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO values equal to $\\frac{1}{2}$.', 'Pilih DUA nilai yang sama dengan $\\frac{1}{2}$.'),
          options: [
            L('$\\sin150^{\\circ}$', '$\\sin150^{\\circ}$'),
            L('$\\cos60^{\\circ}$', '$\\cos60^{\\circ}$'),
            L('$\\cos120^{\\circ}$', '$\\cos120^{\\circ}$'),
            L('$\\sin210^{\\circ}$', '$\\sin210^{\\circ}$'),
          ],
          answer: [0, 1],
          explain: L(
            '$\\sin150^{\\circ}=\\sin30^{\\circ}=\\frac{1}{2}$ and $\\cos60^{\\circ}=\\frac{1}{2}$. But $\\cos120^{\\circ}=-\\frac{1}{2}$ and $\\sin210^{\\circ}=-\\frac{1}{2}$, because the signs there are negative.',
            '$\\sin150^{\\circ}=\\sin30^{\\circ}=\\frac{1}{2}$ dan $\\cos60^{\\circ}=\\frac{1}{2}$. Namun $\\cos120^{\\circ}=-\\frac{1}{2}$ dan $\\sin210^{\\circ}=-\\frac{1}{2}$, karena tandanya di sana negatif.',
          ),
          hint: L(
            'For each angle find the quadrant and the reference angle, then decide the sign.',
            'Untuk tiap sudut cari kuadran dan sudut acuannya, lalu tentukan tandanya.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('$180^{\\circ}=\\pi$ radians.', '$180^{\\circ}=\\pi$ radian.'),
            L('$\\cos120^{\\circ}$ is positive.', '$\\cos120^{\\circ}$ positif.'),
            L('$\\sin210^{\\circ}=-\\frac{1}{2}$.', '$\\sin210^{\\circ}=-\\frac{1}{2}$.'),
            L('$\\frac{\\pi}{3}$ radians equals $45^{\\circ}$.', '$\\frac{\\pi}{3}$ radian sama dengan $45^{\\circ}$.'),
          ],
          answer: [true, false, true, false],
          explain: L(
            '$120^{\\circ}$ is in quadrant II, where cosine is negative. $210^{\\circ}$ is in quadrant III, where sine is negative, and its reference angle is $30^{\\circ}$. And $\\frac{\\pi}{3}=60^{\\circ}$.',
            '$120^{\\circ}$ ada di kuadran II, tempat kosinus negatif. $210^{\\circ}$ ada di kuadran III, tempat sinus negatif, dan sudut acuannya $30^{\\circ}$. Dan $\\frac{\\pi}{3}=60^{\\circ}$.',
          ),
          hint: L(
            'Change radians to degrees with $\\pi=180^{\\circ}$.',
            'Ubah radian ke derajat dengan $\\pi=180^{\\circ}$.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'A circle has radius 6. An arc of it subtends the central angle $\\frac{\\pi}{3}$ radians. The arc length is $k\\pi$. Find $k$.',
            'Sebuah lingkaran berjari-jari 6. Sebuah busurnya menghadap sudut pusat $\\frac{\\pi}{3}$ radian. Panjang busurnya $k\\pi$. Tentukan $k$.',
          ),
          blanks: [{ label: 'k =', answer: 2 }],
          hints: [
            L('With the angle in radians, the arc length is $s=r\\theta$.', 'Dengan sudut dalam radian, panjang busur adalah $s=r\\theta$.'),
            L('$s=6\\times\\frac{\\pi}{3}$.', '$s=6\\times\\frac{\\pi}{3}$.'),
            L('Simplify: $\\frac{6}{3}=2$.', 'Sederhanakan: $\\frac{6}{3}=2$.'),
          ],
          explain: L(
            '$s=r\\theta=6\\times\\frac{\\pi}{3}=2\\pi$, so $k=2$.',
            '$s=r\\theta=6\\times\\frac{\\pi}{3}=2\\pi$, jadi $k=2$.',
          ),
          solution: ['s=r\\theta=6\\times\\frac{\\pi}{3}', '=2\\pi'],
        },
      ],
    },
    /* -------------------------------------------- L2 identities, equations, graphs */
    {
      id: 'tka-sma-m8-s2-l2',
      title: L('Identities, Equations and Graphs', 'Identitas, Persamaan, dan Grafik'),
      goal: L(
        'You can use $\\sin^2\\theta+\\cos^2\\theta=1$, solve a basic equation like $\\sin x=\\frac{1}{2}$, and read amplitude and period from a graph.',
        'Kamu bisa memakai $\\sin^2\\theta+\\cos^2\\theta=1$, menyelesaikan persamaan dasar seperti $\\sin x=\\frac{1}{2}$, dan membaca amplitudo dan periode dari grafik.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Pythagoras on the Unit Circle', 'Ayo Amati: Pythagoras pada Lingkaran Satuan'),
          body: L(
            'The point $P=(\\cos\\theta,\\sin\\theta)$ is on the unit circle, whose radius is 1. By Pythagoras, in the little right triangle under $P$:\n\n$$\\sin^2\\theta+\\cos^2\\theta=1$$\n\nThis holds for **every** angle. Together with $\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}$ it lets you find one ratio from another.\n\nIf $\\sin\\theta=\\frac{3}{5}$ and $\\theta$ is acute:\n\n1. Step 1: $\\cos^2\\theta=1-\\frac{9}{25}=\\frac{16}{25}$.\n2. Step 2: $\\cos\\theta=\\frac{4}{5}$ (positive, since $\\theta$ is acute).\n3. Step 3: $\\tan\\theta=\\frac{3/5}{4/5}=\\frac{3}{4}$.\n\nIn quadrant II the same $\\sin\\theta=\\frac{3}{5}$ gives $\\cos\\theta=-\\frac{4}{5}$: the identity gives the size, the quadrant gives the sign.',
            'Titik $P=(\\cos\\theta,\\sin\\theta)$ berada pada lingkaran satuan yang jari-jarinya 1. Dengan Pythagoras pada segitiga siku-siku kecil di bawah $P$:\n\n$$\\sin^2\\theta+\\cos^2\\theta=1$$\n\nIni berlaku untuk **setiap** sudut. Bersama $\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}$, rumus ini memungkinkan kamu mencari satu perbandingan dari yang lain.\n\nJika $\\sin\\theta=\\frac{3}{5}$ dan $\\theta$ lancip:\n\n1. Langkah 1: $\\cos^2\\theta=1-\\frac{9}{25}=\\frac{16}{25}$.\n2. Langkah 2: $\\cos\\theta=\\frac{4}{5}$ (positif, karena $\\theta$ lancip).\n3. Langkah 3: $\\tan\\theta=\\frac{3/5}{4/5}=\\frac{3}{4}$.\n\nDi kuadran II, $\\sin\\theta=\\frac{3}{5}$ yang sama memberi $\\cos\\theta=-\\frac{4}{5}$: identitas memberi besarnya, kuadran memberi tandanya.',
          ),
          figure: {
            ...unitCircle([
              line([0, 0], at(37), 'a', { width: 2.4 }),
              line(at(37), [0.7986, 0], 'result', { width: 2.4 }),
              line([0, 0], [0.7986, 0], 'b', { width: 2.4 }),
              dot(at(37), 'P', 'result'),
              txt(0.4, -0.25, 'cos', 'md', 'muted'),
              txt(0.95, 0.3, 'sin', 'md', 'muted'),
            ]),
            caption: L('The right triangle under P has hypotenuse 1.', 'Segitiga siku-siku di bawah P berhipotenusa 1.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Solving a Basic Equation', 'Contoh Bertahap: Menyelesaikan Persamaan Dasar'),
          body: L(
            'Solve $\\sin x=\\frac{1}{2}$ for $0^{\\circ}\\le x\\le360^{\\circ}$.\n\n1. Step 1: The reference angle: $\\sin30^{\\circ}=\\frac{1}{2}$.\n2. Step 2: Sine is positive in quadrants I and II, so there are two angles: $x=30^{\\circ}$ and $x=180^{\\circ}-30^{\\circ}=150^{\\circ}$.\n3. Step 3: Check with the graph. The line $y=\\frac{1}{2}$ meets the sine curve twice between 0 and $2\\pi$ (the red dots, at $\\frac{\\pi}{6}$ and $\\frac{5\\pi}{6}$).\n\nOther basic equations on $0^{\\circ}\\le x\\le360^{\\circ}$:\n\n- $\\cos x=-\\frac{1}{2}$: $x=120^{\\circ}$ and $240^{\\circ}$.\n- $\\tan x=1$: $x=45^{\\circ}$ and $225^{\\circ}$.\n\n**Watch out:** do not stop at the first solution. Always ask in which quadrants the sign fits.',
            'Selesaikan $\\sin x=\\frac{1}{2}$ untuk $0^{\\circ}\\le x\\le360^{\\circ}$.\n\n1. Langkah 1: Sudut acuan: $\\sin30^{\\circ}=\\frac{1}{2}$.\n2. Langkah 2: Sinus positif di kuadran I dan II, jadi ada dua sudut: $x=30^{\\circ}$ dan $x=180^{\\circ}-30^{\\circ}=150^{\\circ}$.\n3. Langkah 3: Periksa dengan grafik. Garis $y=\\frac{1}{2}$ memotong kurva sinus dua kali antara 0 dan $2\\pi$ (titik merah, di $\\frac{\\pi}{6}$ dan $\\frac{5\\pi}{6}$).\n\nPersamaan dasar lain pada $0^{\\circ}\\le x\\le360^{\\circ}$:\n\n- $\\cos x=-\\frac{1}{2}$: $x=120^{\\circ}$ dan $240^{\\circ}$.\n- $\\tan x=1$: $x=45^{\\circ}$ dan $225^{\\circ}$.\n\n**Awas:** jangan berhenti pada penyelesaian pertama. Selalu tanyakan di kuadran mana tandanya cocok.',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: 'sin(x)', from: 0, to: 6.2832, color: 'a' },
                { t: 'hline', y: 0.5, color: 'muted', dashed: true },
                dot([0.5236, 0.5], undefined, 'result'),
                dot([2.618, 0.5], undefined, 'result'),
              ],
              { x: [-0.5, 7], y: [-1.5, 1.5] },
            ),
            caption: L('The line y = 1/2 meets y = sin x at x = π/6 and x = 5π/6.', 'Garis y = 1/2 memotong y = sin x di x = π/6 dan x = 5π/6.'),
          },
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Amplitude and Period', 'Contoh Bertahap: Amplitudo dan Periode'),
          body: L(
            'The graph of $y=A\\sin(Bx)+C$ is a stretched, squeezed and lifted sine wave.\n\n- **Amplitude** $|A|$: how far the wave goes above and below the middle line.\n- **Period** $\\frac{360^{\\circ}}{B}$ (or $\\frac{2\\pi}{B}$): the length of one full wave.\n- **Middle line** $y=C$.\n\nTake $y=2\\sin(3x)+1$.\n\n1. Step 1: Amplitude 2.\n2. Step 2: Period $\\frac{360^{\\circ}}{3}=120^{\\circ}$, that is $\\frac{2\\pi}{3}$: three waves fit in a full turn.\n3. Step 3: Middle line $y=1$, so the greatest value is $1+2=3$ and the least value is $1-2=-1$.\n\n**Watch out:** the amplitude is never negative. For $y=-2\\cos x$ it is 2; the minus sign only flips the wave.',
            'Grafik $y=A\\sin(Bx)+C$ adalah gelombang sinus yang diregangkan, ditekan, dan diangkat.\n\n- **Amplitudo** $|A|$: seberapa jauh gelombang naik dan turun dari garis tengah.\n- **Periode** $\\frac{360^{\\circ}}{B}$ (atau $\\frac{2\\pi}{B}$): panjang satu gelombang penuh.\n- **Garis tengah** $y=C$.\n\nAmbil $y=2\\sin(3x)+1$.\n\n1. Langkah 1: Amplitudo 2.\n2. Langkah 2: Periode $\\frac{360^{\\circ}}{3}=120^{\\circ}$, yaitu $\\frac{2\\pi}{3}$: tiga gelombang muat dalam satu putaran penuh.\n3. Langkah 3: Garis tengah $y=1$, jadi nilai terbesar $1+2=3$ dan nilai terkecil $1-2=-1$.\n\n**Awas:** amplitudo tidak pernah negatif. Untuk $y=-2\\cos x$ amplitudonya 2; tanda minus hanya membalik gelombang.',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: '2*sin(3*x)+1', from: 0, to: 6.2832, color: 'a' },
                { t: 'hline', y: 1, color: 'muted', dashed: true },
              ],
              { x: [-0.5, 7], y: [-2, 4] },
            ),
            caption: L('The graph of y = 2 sin 3x + 1: three waves between −1 and 3.', 'Grafik y = 2 sin 3x + 1: tiga gelombang di antara −1 dan 3.'),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'Which equation gives this graph (shown for $0\\le x\\le2\\pi$)?',
            'Persamaan manakah yang memberikan grafik ini (ditampilkan untuk $0\\le x\\le2\\pi$)?',
          ),
          figure: {
            ...plane(
              [{ t: 'curve', f: '3*sin(2*x)', from: 0, to: 6.2832, color: 'a' }],
              { x: [-0.5, 7], y: [-4, 4] },
            ),
            caption: L('A sine wave with two full cycles.', 'Gelombang sinus dengan dua siklus penuh.'),
          },
          options: [L('$y=3\\sin2x$', '$y=3\\sin2x$'), L('$y=2\\sin3x$', '$y=2\\sin3x$'), L('$y=3\\sin x$', '$y=3\\sin x$'), L('$y=\\sin6x$', '$y=\\sin6x$')],
          answer: 0,
          explain: L(
            'The wave reaches 3 and $-3$, so the amplitude is 3. Two full waves fit in $2\\pi$, so the period is $\\pi$ and $B=\\frac{2\\pi}{\\pi}=2$. So $y=3\\sin2x$.',
            'Gelombang mencapai 3 dan $-3$, jadi amplitudonya 3. Dua gelombang penuh muat dalam $2\\pi$, jadi periodenya $\\pi$ dan $B=\\frac{2\\pi}{\\pi}=2$. Jadi $y=3\\sin2x$.',
          ),
          hint: L(
            'Read the highest point for the amplitude, and count how many waves fit between 0 and $2\\pi$ for $B$.',
            'Baca titik tertinggi untuk amplitudo, dan hitung berapa gelombang muat antara 0 dan $2\\pi$ untuk $B$.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: $\\sin\\theta=\\frac{3}{5}$ and $\\theta$ is acute. Find $\\cos\\theta$.',
            'Coba bersama: $\\sin\\theta=\\frac{3}{5}$ dan $\\theta$ lancip. Cari $\\cos\\theta$.',
          ),
          template: '\\cos^2\\theta=1-\\frac{9}{25}=\\frac{___}{25} \\Rightarrow \\cos\\theta=\\frac{___}{5}',
          blanks: ['16', '4'],
          explain: L(
            '$1-\\frac{9}{25}=\\frac{16}{25}$, and the square root of $\\frac{16}{25}$ is $\\frac{4}{5}$.',
            '$1-\\frac{9}{25}=\\frac{16}{25}$, dan akar kuadrat $\\frac{16}{25}$ adalah $\\frac{4}{5}$.',
          ),
          hint: L(
            'Write 1 as $\\frac{25}{25}$ and subtract.',
            'Tulis 1 sebagai $\\frac{25}{25}$ lalu kurangkan.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true identities.', 'Pilih DUA identitas yang benar.'),
          options: [
            L('$\\sin^2\\theta+\\cos^2\\theta=1$', '$\\sin^2\\theta+\\cos^2\\theta=1$'),
            L('$\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}$', '$\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}$'),
            L('$\\sin2\\theta=2\\sin\\theta$', '$\\sin2\\theta=2\\sin\\theta$'),
            L('$\\cos^2\\theta-\\sin^2\\theta=1$', '$\\cos^2\\theta-\\sin^2\\theta=1$'),
          ],
          answer: [0, 1],
          explain: L(
            'Test $\\theta=30^{\\circ}$: $\\sin60^{\\circ}=\\frac{\\sqrt{3}}{2}$ but $2\\sin30^{\\circ}=1$, and $\\cos^2-\\sin^2=\\frac{3}{4}-\\frac{1}{4}=\\frac{1}{2}$, not 1.',
            'Uji $\\theta=30^{\\circ}$: $\\sin60^{\\circ}=\\frac{\\sqrt{3}}{2}$ tetapi $2\\sin30^{\\circ}=1$, dan $\\cos^2-\\sin^2=\\frac{3}{4}-\\frac{1}{4}=\\frac{1}{2}$, bukan 1.',
          ),
          hint: L(
            'Test the doubtful ones with a special angle such as $30^{\\circ}$.',
            'Uji yang meragukan dengan sudut istimewa seperti $30^{\\circ}$.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('If $\\sin\\theta=\\frac{3}{5}$, then $\\theta$ can lie in quadrant I or in quadrant II.', 'Jika $\\sin\\theta=\\frac{3}{5}$, maka $\\theta$ dapat berada di kuadran I atau kuadran II.'),
            L('The equation $\\sin x=2$ has a solution.', 'Persamaan $\\sin x=2$ punya penyelesaian.'),
            L('The period of $y=\\sin3x$ is $120^{\\circ}$.', 'Periode $y=\\sin3x$ adalah $120^{\\circ}$.'),
            L('The amplitude of $y=-2\\cos x$ is $-2$.', 'Amplitudo $y=-2\\cos x$ adalah $-2$.'),
          ],
          answer: [true, false, true, false],
          explain: L(
            'Sine is positive in both quadrants I and II. A sine never exceeds 1. The period is $\\frac{360^{\\circ}}{3}=120^{\\circ}$. And an amplitude is never negative: it is 2.',
            'Sinus positif di kuadran I dan II. Sinus tidak pernah melebihi 1. Periodenya $\\frac{360^{\\circ}}{3}=120^{\\circ}$. Dan amplitudo tidak pernah negatif: nilainya 2.',
          ),
          hint: L(
            'The sine of any angle is between $-1$ and 1.',
            'Sinus sudut apa pun berada di antara $-1$ dan 1.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'Solve $2\\sin x=1$ for $0^{\\circ}\\le x\\le180^{\\circ}$. There are two solutions. What is their sum, in degrees?',
            'Selesaikan $2\\sin x=1$ untuk $0^{\\circ}\\le x\\le180^{\\circ}$. Ada dua penyelesaian. Berapa jumlahnya, dalam derajat?',
          ),
          blanks: [{ answer: 180, after: '^{\\circ}' }],
          hints: [
            L('First write the equation as $\\sin x=\\frac{1}{2}$.', 'Tulis dulu persamaan sebagai $\\sin x=\\frac{1}{2}$.'),
            L('One solution is $30^{\\circ}$. Sine is positive in quadrant II too, so the other is $180^{\\circ}-30^{\\circ}$.', 'Satu penyelesaian $30^{\\circ}$. Sinus juga positif di kuadran II, jadi yang lain $180^{\\circ}-30^{\\circ}$.'),
            L('Add $30^{\\circ}$ and $150^{\\circ}$.', 'Jumlahkan $30^{\\circ}$ dan $150^{\\circ}$.'),
          ],
          explain: L(
            '$x=30^{\\circ}$ or $150^{\\circ}$, and $30+150=180$.',
            '$x=30^{\\circ}$ atau $150^{\\circ}$, dan $30+150=180$.',
          ),
          solution: {
            en: ['\\sin x=\\frac{1}{2} \\Rightarrow x=30^{\\circ}, \\ 150^{\\circ}', '30+150=180'],
            id: ['\\sin x=\\frac{1}{2} \\Rightarrow x=30^{\\circ}, \\ 150^{\\circ}', '30+150=180'],
          },
        },
      ],
    },
  ],
  project: {
    id: 'tka-sma-m8-s2-p',
    runtime: 'math',
    title: L('The Unit Circle and Graphs at Work', 'Lingkaran Satuan dan Grafik dalam Pemakaian'),
    brief: L(
      'Convert angles, use reference angles, solve basic equations and read a sine graph.',
      'Ubah sudut, pakai sudut acuan, selesaikan persamaan dasar, dan baca grafik sinus.',
    ),
    requirements: [
      L('Work with radians and the unit circle.', 'Bekerja dengan radian dan lingkaran satuan.'),
      L('Solve $\\sin$, $\\cos$ equations and read amplitude and period.', 'Menyelesaikan persamaan $\\sin$, $\\cos$ dan membaca amplitudo dan periode.'),
    ],
    hints: [
      L('Multiply degrees by $\\frac{\\pi}{180}$ to get radians.', 'Kalikan derajat dengan $\\frac{\\pi}{180}$ untuk mendapatkan radian.'),
      L('Find the reference angle first, then decide the quadrants by the sign.', 'Cari sudut acuan dulu, lalu tentukan kuadran berdasarkan tanda.'),
      L('Period $=\\frac{360^{\\circ}}{B}$, amplitude $=|A|$.', 'Periode $=\\frac{360^{\\circ}}{B}$, amplitudo $=|A|$.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L(
          'Write $150^{\\circ}$ in radians as $\\frac{p}{q}\\pi$ in lowest terms.',
          'Tulis $150^{\\circ}$ dalam radian sebagai $\\frac{p}{q}\\pi$ dalam bentuk paling sederhana.',
        ),
        inline: true,
        blanks: [
          { label: 'p =', answer: 5 },
          { label: 'q =', answer: 6 },
        ],
        solution: ['150\\times\\frac{\\pi}{180}=\\frac{5\\pi}{6}'],
      },
      {
        prompt: L(
          'Find the value of $\\cos120^{\\circ}+\\sin210^{\\circ}$.',
          'Tentukan nilai $\\cos120^{\\circ}+\\sin210^{\\circ}$.',
        ),
        blanks: [{ answer: -1 }],
        solution: ['\\cos120^{\\circ}=-\\cos60^{\\circ}=-\\frac{1}{2}', '\\sin210^{\\circ}=-\\sin30^{\\circ}=-\\frac{1}{2}', '-\\frac{1}{2}-\\frac{1}{2}=-1'],
      },
      {
        prompt: L(
          '$\\theta$ is acute and $\\sin\\theta=\\frac{5}{13}$. Find $\\cos\\theta$.',
          '$\\theta$ lancip dan $\\sin\\theta=\\frac{5}{13}$. Tentukan $\\cos\\theta$.',
        ),
        blanks: [{ label: '\\cos\\theta =', answer: 12 / 13 }],
        solution: ['\\cos^2\\theta=1-\\frac{25}{169}=\\frac{144}{169}', '\\cos\\theta=\\frac{12}{13}'],
      },
      {
        prompt: L(
          'Solve $2\\cos x=1$ for $0^{\\circ}\\le x\\le360^{\\circ}$. Give the smaller solution first.',
          'Selesaikan $2\\cos x=1$ untuk $0^{\\circ}\\le x\\le360^{\\circ}$. Tulis penyelesaian yang lebih kecil lebih dulu.',
        ),
        inline: true,
        blanks: [
          { label: { en: '\\text{smaller } x =', id: '\\text{yang kecil } x =' }, answer: 60 },
          { label: { en: '\\text{larger } x =', id: '\\text{yang besar } x =' }, answer: 300 },
        ],
        solution: ['\\cos x=\\frac{1}{2} \\Rightarrow x=60^{\\circ}', 'x=360^{\\circ}-60^{\\circ}=300^{\\circ}'],
      },
      {
        prompt: L(
          'For $y=2\\sin3x+1$, find the greatest value and the period in degrees.',
          'Untuk $y=2\\sin3x+1$, tentukan nilai terbesar dan periode dalam derajat.',
        ),
        figure: {
          ...plane(
            [{ t: 'curve', f: '2*sin(3*x)+1', from: 0, to: 6.2832, color: 'a' }],
            { x: [-0.5, 7], y: [-2, 4] },
          ),
          caption: L('The graph of y = 2 sin 3x + 1.', 'Grafik y = 2 sin 3x + 1.'),
        },
        inline: true,
        blanks: [
          { label: { en: '\\text{greatest value} =', id: '\\text{nilai terbesar} =' }, answer: 3 },
          { label: { en: '\\text{period} =', id: '\\text{periode} =' }, answer: 120 },
        ],
        solution: { en: ['\\text{greatest value}=1+2=3', '\\text{period}=\\frac{360^{\\circ}}{3}=120^{\\circ}'], id: ['\\text{nilai terbesar}=1+2=3', '\\text{periode}=\\frac{360^{\\circ}}{3}=120^{\\circ}'] },
      },
    ],
  },
}
