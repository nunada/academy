import type { Lesson } from '../types'
import { L, rightTriangle } from './figs'

/** Module 8 — the reciprocal ratios cotangent, secant and cosecant. */

export const lessonReciprocal: Lesson = {
  id: 'tka-sma-m8-s1-l3',
  title: L('Cotangent, Secant and Cosecant', 'Kotangen, Sekan, dan Kosekan'),
  goal: L(
    'You can use the three reciprocal ratios, know their exact values for $30^{\\circ}$, $45^{\\circ}$, $60^{\\circ}$, and use the identities that link them.',
    'Kamu bisa memakai tiga perbandingan kebalikan, mengetahui nilai eksaknya untuk $30^{\\circ}$, $45^{\\circ}$, $60^{\\circ}$, dan memakai identitas yang menghubungkannya.',
  ),
  xp: 20,
  steps: [
    {
      kind: 'concept',
      id: 'c1',
      title: L('Look Closely: Turning the Ratios Upside Down', 'Ayo Amati: Membalik Perbandingan'),
      body: L(
        'Besides sine, cosine and tangent there are three more ratios. Each is the **reciprocal** (one over) of one of them:\n\n$$\\csc\\theta=\\frac{1}{\\sin\\theta}\\qquad\\sec\\theta=\\frac{1}{\\cos\\theta}\\qquad\\cot\\theta=\\frac{1}{\\tan\\theta}=\\frac{\\cos\\theta}{\\sin\\theta}$$\n\n(**cosecant**, **secant**, **cotangent**). In a right triangle with opposite side $a$, adjacent side $b$ and hypotenuse $c$:\n\n$$\\csc\\theta=\\frac{c}{a}\\qquad\\sec\\theta=\\frac{c}{b}\\qquad\\cot\\theta=\\frac{b}{a}$$\n\nFor the 3-4-5 triangle with $\\theta$ at the bottom right: $\\csc\\theta=\\frac{5}{3}$, $\\sec\\theta=\\frac{5}{4}$, $\\cot\\theta=\\frac{4}{3}$.\n\n**Remember:** $\\csc$ goes with $\\sin$, and $\\sec$ with $\\cos$ (the "co" letters do **not** match).',
        'Selain sinus, kosinus, dan tangen ada tiga perbandingan lagi. Masing-masing adalah **kebalikan** (satu per) dari salah satunya:\n\n$$\\csc\\theta=\\frac{1}{\\sin\\theta}\\qquad\\sec\\theta=\\frac{1}{\\cos\\theta}\\qquad\\cot\\theta=\\frac{1}{\\tan\\theta}=\\frac{\\cos\\theta}{\\sin\\theta}$$\n\n(**kosekan**, **sekan**, **kotangen**). Pada segitiga siku-siku dengan sisi depan $a$, sisi samping $b$, dan sisi miring $c$:\n\n$$\\csc\\theta=\\frac{c}{a}\\qquad\\sec\\theta=\\frac{c}{b}\\qquad\\cot\\theta=\\frac{b}{a}$$\n\nUntuk segitiga 3-4-5 dengan $\\theta$ di kanan bawah: $\\csc\\theta=\\frac{5}{3}$, $\\sec\\theta=\\frac{5}{4}$, $\\cot\\theta=\\frac{4}{3}$.\n\n**Ingat:** $\\csc$ berpasangan dengan $\\sin$, dan $\\sec$ dengan $\\cos$ (huruf "co" **tidak** cocok).',
      ),
      figure: {
        ...rightTriangle({ a: 4, b: 3, angle: 'θ', sides: { across: 'b', up: 'a', slant: 'c' } }),
        caption: L('The angle θ with opposite side a, adjacent side b and hypotenuse c.', 'Sudut θ dengan sisi depan a, sisi samping b, dan sisi miring c.'),
      },
    },
    {
      kind: 'concept',
      id: 'c2',
      title: L('Step by Step: Exact Values', 'Contoh Bertahap: Nilai Eksak'),
      body: L(
        'Turn the values of sine, cosine and tangent of the special angles upside down.\n\n| $\\theta$ | $30^{\\circ}$ | $45^{\\circ}$ | $60^{\\circ}$ |\n|---|---|---|---|\n| $\\csc\\theta$ | $2$ | $\\sqrt{2}$ | $\\frac{2}{\\sqrt{3}}=\\frac{2\\sqrt{3}}{3}$ |\n| $\\sec\\theta$ | $\\frac{2}{\\sqrt{3}}=\\frac{2\\sqrt{3}}{3}$ | $\\sqrt{2}$ | $2$ |\n| $\\cot\\theta$ | $\\sqrt{3}$ | $1$ | $\\frac{1}{\\sqrt{3}}=\\frac{\\sqrt{3}}{3}$ |\n\nExample: $\\csc30^{\\circ}=\\frac{1}{\\sin30^{\\circ}}=\\frac{1}{1/2}=2$.\n\nThe picture shows the $30^{\\circ}$-$60^{\\circ}$-$90^{\\circ}$ triangle again: with $\\theta=30^{\\circ}$, $\\csc\\theta=\\frac{\\text{hypotenuse}}{\\text{opposite}}=\\frac{2}{1}=2$ and $\\cot\\theta=\\frac{\\sqrt{3}}{1}=\\sqrt{3}$.\n\nA note: $\\sec\\theta$ and $\\csc\\theta$ are never between $-1$ and $1$, because $\\sin\\theta$ and $\\cos\\theta$ never exceed 1 in size.',
        'Balikkan nilai sinus, kosinus, dan tangen sudut istimewa.\n\n| $\\theta$ | $30^{\\circ}$ | $45^{\\circ}$ | $60^{\\circ}$ |\n|---|---|---|---|\n| $\\csc\\theta$ | $2$ | $\\sqrt{2}$ | $\\frac{2}{\\sqrt{3}}=\\frac{2\\sqrt{3}}{3}$ |\n| $\\sec\\theta$ | $\\frac{2}{\\sqrt{3}}=\\frac{2\\sqrt{3}}{3}$ | $\\sqrt{2}$ | $2$ |\n| $\\cot\\theta$ | $\\sqrt{3}$ | $1$ | $\\frac{1}{\\sqrt{3}}=\\frac{\\sqrt{3}}{3}$ |\n\nContoh: $\\csc30^{\\circ}=\\frac{1}{\\sin30^{\\circ}}=\\frac{1}{1/2}=2$.\n\nGambar menunjukkan lagi segitiga $30^{\\circ}$-$60^{\\circ}$-$90^{\\circ}$: dengan $\\theta=30^{\\circ}$, $\\csc\\theta=\\frac{\\text{miring}}{\\text{depan}}=\\frac{2}{1}=2$ dan $\\cot\\theta=\\frac{\\sqrt{3}}{1}=\\sqrt{3}$.\n\nCatatan: $\\sec\\theta$ dan $\\csc\\theta$ tidak pernah berada di antara $-1$ dan $1$, karena $\\sin\\theta$ dan $\\cos\\theta$ tidak pernah lebih dari 1 besarnya.',
      ),
      figure: {
        ...rightTriangle({ a: 1.732, b: 1, angle: '30°', sides: { across: '√3', up: '1', slant: '2' } }),
        caption: L('The 30°-60°-90° triangle with sides 1, √3 and 2.', 'Segitiga 30°-60°-90° dengan sisi 1, √3, dan 2.'),
      },
    },
    {
      kind: 'concept',
      id: 'c3',
      title: L('Step by Step: Identities with Reciprocals', 'Contoh Bertahap: Identitas dengan Kebalikan'),
      body: L(
        'Dividing $\\sin^2\\theta+\\cos^2\\theta=1$ by $\\cos^2\\theta$, and then by $\\sin^2\\theta$, gives two more identities:\n\n$$1+\\tan^2\\theta=\\sec^2\\theta\\qquad 1+\\cot^2\\theta=\\csc^2\\theta$$\n\nAlso $\\sin\\theta\\csc\\theta=1$, $\\cos\\theta\\sec\\theta=1$ and $\\tan\\theta\\cot\\theta=1$.\n\nIf $\\theta$ is acute and $\\tan\\theta=\\frac{3}{4}$, find $\\sec\\theta$.\n\n1. Step 1: $\\sec^2\\theta=1+\\tan^2\\theta=1+\\frac{9}{16}=\\frac{25}{16}$.\n2. Step 2: $\\sec\\theta=\\frac{5}{4}$ (positive, since $\\theta$ is acute).\n3. Step 3: Then $\\cos\\theta=\\frac{4}{5}$.\n\n**Watch out:** do not turn $\\sin^{-1}$ into $\\csc$. $\\sin^{-1}x$ is the **inverse** function (an angle), but $\\frac{1}{\\sin x}$ is $\\csc x$ (a number).',
        'Membagi $\\sin^2\\theta+\\cos^2\\theta=1$ dengan $\\cos^2\\theta$, lalu dengan $\\sin^2\\theta$, memberi dua identitas lagi:\n\n$$1+\\tan^2\\theta=\\sec^2\\theta\\qquad 1+\\cot^2\\theta=\\csc^2\\theta$$\n\nJuga $\\sin\\theta\\csc\\theta=1$, $\\cos\\theta\\sec\\theta=1$, dan $\\tan\\theta\\cot\\theta=1$.\n\nJika $\\theta$ lancip dan $\\tan\\theta=\\frac{3}{4}$, cari $\\sec\\theta$.\n\n1. Langkah 1: $\\sec^2\\theta=1+\\tan^2\\theta=1+\\frac{9}{16}=\\frac{25}{16}$.\n2. Langkah 2: $\\sec\\theta=\\frac{5}{4}$ (positif, karena $\\theta$ lancip).\n3. Langkah 3: Maka $\\cos\\theta=\\frac{4}{5}$.\n\n**Awas:** jangan mengubah $\\sin^{-1}$ menjadi $\\csc$. $\\sin^{-1}x$ adalah fungsi **invers** (sebuah sudut), tetapi $\\frac{1}{\\sin x}$ adalah $\\csc x$ (sebuah bilangan).',
      ),
    },
    {
      kind: 'quiz',
      id: 'q1',
      prompt: L(
        'In the right triangle, the angle $\\theta$ is at the bottom right. What is $\\csc\\theta$?',
        'Pada segitiga siku-siku, sudut $\\theta$ ada di kanan bawah. Berapa $\\csc\\theta$?',
      ),
      figure: {
        ...rightTriangle({ a: 12, b: 5, angle: 'θ', sides: { across: '12', up: '5', slant: '13' } }),
        caption: L('A right triangle with sides 5, 12 and 13.', 'Segitiga siku-siku dengan sisi 5, 12, dan 13.'),
      },
      options: [L('$\\frac{13}{5}$', '$\\frac{13}{5}$'), L('$\\frac{13}{12}$', '$\\frac{13}{12}$'), L('$\\frac{12}{5}$', '$\\frac{12}{5}$'), L('$\\frac{5}{13}$', '$\\frac{5}{13}$')],
      answer: 0,
      explain: L(
        'The side opposite $\\theta$ is the vertical side 5, so $\\sin\\theta=\\frac{5}{13}$ and $\\csc\\theta=\\frac{13}{5}$. The value $\\frac{5}{13}$ is the sine itself, $\\frac{13}{12}$ is the secant and $\\frac{12}{5}$ is the cotangent.',
        'Sisi di hadapan $\\theta$ adalah sisi tegak 5, jadi $\\sin\\theta=\\frac{5}{13}$ dan $\\csc\\theta=\\frac{13}{5}$. Nilai $\\frac{5}{13}$ adalah sinusnya sendiri, $\\frac{13}{12}$ adalah sekan, dan $\\frac{12}{5}$ adalah kotangen.',
      ),
      hint: L(
        'Find $\\sin\\theta$ first (opposite over hypotenuse), then turn it upside down.',
        'Cari $\\sin\\theta$ dulu (depan per miring), lalu balikkan.',
      ),
    },
    {
      kind: 'fill',
      id: 'f1',
      math: true,
      prompt: L(
        'Try it together: $\\csc30^{\\circ}$ from $\\sin30^{\\circ}$.',
        'Coba bersama: $\\csc30^{\\circ}$ dari $\\sin30^{\\circ}$.',
      ),
      template: '\\csc30^{\\circ}=\\frac{1}{\\sin30^{\\circ}}=\\frac{1}{1/___}=___',
      blanks: ['2', '2'],
      explain: L(
        '$\\sin30^{\\circ}=\\frac{1}{2}$, and one divided by one half is 2.',
        '$\\sin30^{\\circ}=\\frac{1}{2}$, dan satu dibagi setengah adalah 2.',
      ),
      hint: L(
        'Dividing by a fraction means multiplying by its reciprocal.',
        'Membagi dengan pecahan berarti mengalikan dengan kebalikannya.',
      ),
    },
    {
      kind: 'multi',
      id: 'mc1',
      prompt: L('Choose the TWO true equalities.', 'Pilih DUA kesamaan yang benar.'),
      options: [
        L('$\\sec60^{\\circ}=2$', '$\\sec60^{\\circ}=2$'),
        L('$\\cot45^{\\circ}=1$', '$\\cot45^{\\circ}=1$'),
        L('$\\csc30^{\\circ}=\\frac{1}{2}$', '$\\csc30^{\\circ}=\\frac{1}{2}$'),
        L('$\\sec30^{\\circ}=\\frac{\\sqrt{3}}{2}$', '$\\sec30^{\\circ}=\\frac{\\sqrt{3}}{2}$'),
      ],
      answer: [0, 1],
      explain: L(
        '$\\sec60^{\\circ}=\\frac{1}{1/2}=2$ and $\\cot45^{\\circ}=\\frac{1}{1}=1$. But $\\csc30^{\\circ}=2$, and $\\frac{\\sqrt{3}}{2}$ is $\\cos30^{\\circ}$ itself: $\\sec30^{\\circ}=\\frac{2}{\\sqrt{3}}$.',
        '$\\sec60^{\\circ}=\\frac{1}{1/2}=2$ dan $\\cot45^{\\circ}=\\frac{1}{1}=1$. Namun $\\csc30^{\\circ}=2$, dan $\\frac{\\sqrt{3}}{2}$ adalah $\\cos30^{\\circ}$ sendiri: $\\sec30^{\\circ}=\\frac{2}{\\sqrt{3}}$.',
      ),
      hint: L(
        'Take each ratio and turn it upside down: a reciprocal of a value below 1 is above 1.',
        'Ambil tiap perbandingan dan balikkan: kebalikan dari nilai di bawah 1 berada di atas 1.',
      ),
    },
    {
      kind: 'judge',
      id: 'j1',
      prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
      statements: [
        L('$\\csc\\theta=\\frac{1}{\\sin\\theta}$.', '$\\csc\\theta=\\frac{1}{\\sin\\theta}$.'),
        L('$\\cot\\theta=\\frac{1}{\\cos\\theta}$.', '$\\cot\\theta=\\frac{1}{\\cos\\theta}$.'),
        L('$1+\\tan^2\\theta=\\sec^2\\theta$.', '$1+\\tan^2\\theta=\\sec^2\\theta$.'),
        L('$\\sec\\theta$ can equal $\\frac{1}{2}$ for some real angle $\\theta$.', '$\\sec\\theta$ dapat bernilai $\\frac{1}{2}$ untuk suatu sudut real $\\theta$.'),
      ],
      answer: [true, false, true, false],
      explain: L(
        '$\\cot\\theta=\\frac{1}{\\tan\\theta}$ (that is $\\sec$ for the cosine). And $|\\cos\\theta|\\le1$, so $|\\sec\\theta|\\ge1$: it can never be $\\frac{1}{2}$.',
        '$\\cot\\theta=\\frac{1}{\\tan\\theta}$ ($\\frac{1}{\\cos\\theta}$ adalah sekan). Dan $|\\cos\\theta|\\le1$, sehingga $|\\sec\\theta|\\ge1$: nilainya tidak pernah $\\frac{1}{2}$.',
      ),
      hint: L(
        'Match each name with its own ratio: cosecant-sine, secant-cosine, cotangent-tangent.',
        'Cocokkan tiap nama dengan perbandingannya: kosekan-sinus, sekan-kosinus, kotangen-tangen.',
      ),
    },
    {
      kind: 'math',
      id: 'm1',
      prompt: L(
        '$\\theta$ is acute and $\\tan\\theta=\\frac{3}{4}$. Find $\\sec\\theta$.',
        '$\\theta$ lancip dan $\\tan\\theta=\\frac{3}{4}$. Tentukan $\\sec\\theta$.',
      ),
      blanks: [{ label: '\\sec\\theta =', answer: 1.25 }],
      hints: [
        L('Use the identity $1+\\tan^2\\theta=\\sec^2\\theta$.', 'Pakai identitas $1+\\tan^2\\theta=\\sec^2\\theta$.'),
        L('$\\sec^2\\theta=1+\\frac{9}{16}=\\frac{25}{16}$.', '$\\sec^2\\theta=1+\\frac{9}{16}=\\frac{25}{16}$.'),
        L('Take the positive square root, since $\\theta$ is acute.', 'Ambil akar kuadrat positif, karena $\\theta$ lancip.'),
      ],
      explain: L(
        '$\\sec\\theta=\\sqrt{\\frac{25}{16}}=\\frac{5}{4}=1.25$. (A 3-4-5 triangle with $\\tan\\theta=\\frac{3}{4}$.)',
        '$\\sec\\theta=\\sqrt{\\frac{25}{16}}=\\frac{5}{4}=1{,}25$. (Segitiga 3-4-5 dengan $\\tan\\theta=\\frac{3}{4}$.)',
      ),
      solution: {
        en: ['\\sec^2\\theta=1+\\frac{9}{16}=\\frac{25}{16}', '\\sec\\theta=\\frac{5}{4}=1.25'],
        id: ['\\sec^2\\theta=1+\\frac{9}{16}=\\frac{25}{16}', '\\sec\\theta=\\frac{5}{4}=1{,}25'],
      },
    },
  ],
}
