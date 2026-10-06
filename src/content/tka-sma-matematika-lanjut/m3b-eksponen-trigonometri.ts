import type { Submodule } from '../types'
import { L, dot, plane } from './figs'

/** Module 3, submodule 2 — exponential, logarithmic and trigonometric functions. */

const growth = (dots: [number, number][]) => ({
  ...plane(
    [{ t: 'curve', f: '3*2^x', from: -1.5, to: 3.2, color: 'a' }, ...dots.map((p) => dot(p, undefined, 'result'))],
    { x: [-2, 4], y: [-3, 28] },
  ),
  aspect: 1,
})

/** y = 2 sin 2x + 1, with x in degrees. */
const wave = (dots: [number, number][]) => ({
  ...plane(
    [
      { t: 'curve', f: '2*sin(x*pi/90)+1', from: 0, to: 360, color: 'a' },
      { t: 'hline', y: 1, color: 'muted', dashed: true },
      ...dots.map((p) => dot(p, undefined, 'result')),
    ],
    { x: [-45, 405], y: [-2, 4] },
  ),
  aspect: 1.8,
})

export const m3s2: Submodule = {
  id: 'tka-sml-m3-s2',
  title: L('Exponential, Logarithmic and Trigonometric Functions', 'Fungsi Eksponensial, Logaritma, dan Trigonometri'),
  summary: L(
    'Work with growth models, logarithms, and sine and cosine graphs: amplitude, period, shift and range.',
    'Bekerja dengan model pertumbuhan, logaritma, dan grafik sinus dan kosinus: amplitudo, periode, pergeseran, dan daerah hasil.',
  ),
  lessons: [
    /* ------------------------------------------- L1 exponential, logarithm */
    {
      id: 'tka-sml-m3-s2-l1',
      title: L('Exponential and Logarithmic Functions', 'Fungsi Eksponensial dan Logaritma'),
      goal: L(
        'You can read an exponential growth model, solve a simple exponential equation, and use the meaning and rules of logarithms.',
        'Kamu bisa membaca model pertumbuhan eksponensial, menyelesaikan persamaan eksponensial sederhana, dan memakai arti serta aturan logaritma.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Doubling Again and Again', 'Ayo Amati: Berlipat Ganda Berulang-ulang'),
          body: L(
            'An **exponential function** $f(x)=k\\cdot a^{x}$ multiplies by the base $a$ each time $x$ goes up by $1$. Here the base is a whole number such as $2$, $3$ or $4$.\n\nThe number of viewers of a video, in thousands, after $t$ days is $f(t)=3\\cdot2^{t}$:\n\n- $t=0$: $3$ thousand (the starting value $k$);\n- $t=1$: $6$; $t=2$: $12$; $t=3$: $24$. It **doubles** every day.\n\nThe graph is always above the $x$-axis, it rises faster and faster for $a>1$, and it passes through $(0,k)$.',
            '**Fungsi eksponensial** $f(x)=k\\cdot a^{x}$ dikalikan dengan basis $a$ setiap kali $x$ naik $1$. Di sini basisnya bilangan asli seperti $2$, $3$, atau $4$.\n\nBanyak penonton sebuah video, dalam ribuan, setelah $t$ hari adalah $f(t)=3\\cdot2^{t}$:\n\n- $t=0$: $3$ ribu (nilai awal $k$);\n- $t=1$: $6$; $t=2$: $12$; $t=3$: $24$. Banyaknya **berlipat dua** setiap hari.\n\nGrafiknya selalu di atas sumbu $x$, naik makin cepat untuk $a>1$, dan melalui $(0,k)$.',
          ),
          figure: {
            ...growth([[0, 3], [1, 6], [2, 12], [3, 24]]),
            caption: L('The graph of 3 · 2^t with the points for t = 0, 1, 2, 3.', 'Grafik 3 · 2^t dengan titik-titik untuk t = 0, 1, 2, 3.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Logarithms Undo Powers', 'Contoh Bertahap: Logaritma Membatalkan Pangkat'),
          body: L(
            '$\\log_a b=c$ means $a^{c}=b$: the logarithm is the **exponent**. It exists for $b>0$ (and base $a>0$, $a\\ne1$).\n\n1. Step 1: $\\log_2 8=3$, because $2^3=8$.\n2. Step 2: $\\log_3 81=4$, because $3^4=81$.\n3. Step 3: Rules: $\\log_a(xy)=\\log_a x+\\log_a y$, $\\ \\log_a\\frac{x}{y}=\\log_a x-\\log_a y$, $\\ \\log_a x^n=n\\log_a x$.\n4. Step 4: $\\log_2 12-\\log_2 3=\\log_2\\frac{12}{3}=\\log_2 4=2$.\n\nTo solve $2^{x+1}=32$ write $32=2^5$: then $x+1=5$ and $x=4$.',
            '$\\log_a b=c$ berarti $a^{c}=b$: logaritma adalah **eksponen**. Ia ada untuk $b>0$ (dan basis $a>0$, $a\\ne1$).\n\n1. Langkah 1: $\\log_2 8=3$, karena $2^3=8$.\n2. Langkah 2: $\\log_3 81=4$, karena $3^4=81$.\n3. Langkah 3: Aturan: $\\log_a(xy)=\\log_a x+\\log_a y$, $\\ \\log_a\\frac{x}{y}=\\log_a x-\\log_a y$, $\\ \\log_a x^n=n\\log_a x$.\n4. Langkah 4: $\\log_2 12-\\log_2 3=\\log_2\\frac{12}{3}=\\log_2 4=2$.\n\nUntuk menyelesaikan $2^{x+1}=32$ tulis $32=2^5$: maka $x+1=5$ dan $x=4$.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Watch Out!: Where a Model Stops Working', 'Awas, Jebakan!: Saat Model Berhenti Cocok'),
          body: L(
            'A model is a description, not a law. The video model $3\\cdot2^t$ says $3\\cdot2^{30}$ thousand viewers after a month, which is more than the whole world. So a model of growth is only **reasonable for a limited time**.\n\nTwo more traps:\n\n- $\\log(a+b)\\ne\\log a+\\log b$. The rule is for a **product**.\n- $2^{x}\\cdot2^{y}=2^{x+y}$, but $2^x+2^y$ does not simplify.\n\nWhen a question says "does the model fit large $t$?", compare the model with what is possible.',
            'Model adalah gambaran, bukan hukum. Model video $3\\cdot2^t$ berkata ada $3\\cdot2^{30}$ ribu penonton setelah sebulan, lebih banyak daripada seluruh penduduk dunia. Jadi model pertumbuhan hanya **masuk akal untuk waktu yang terbatas**.\n\nDua jebakan lagi:\n\n- $\\log(a+b)\\ne\\log a+\\log b$. Aturannya untuk **hasil kali**.\n- $2^{x}\\cdot2^{y}=2^{x+y}$, tetapi $2^x+2^y$ tidak dapat disederhanakan.\n\nBila soal bertanya "apakah model cocok untuk $t$ besar?", bandingkan model dengan apa yang mungkin.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The graph of an exponential function passes through (0, 3) and (2, 12). Which function is it?',
            'Grafik fungsi eksponensial melalui (0, 3) dan (2, 12). Fungsi manakah itu?',
          ),
          figure: {
            ...growth([[0, 3], [2, 12]]),
            caption: L('An exponential graph through the red points.', 'Grafik eksponensial melalui titik-titik merah.'),
          },
          options: ['3\\cdot2^{x}', '2\\cdot3^{x}', '3\\cdot4^{x}', '3x^{2}', '3+4x'].map((s) => L(`$f(x)=${s}$`, `$f(x)=${s}$`)),
          answer: 0,
          explain: L(
            'The point $(0,3)$ gives $k=3$. Then $f(2)=3a^2=12$, so $a^2=4$ and $a=2$. The option $3x^2$ is not exponential, although it also gives $12$ at $x=2$; but $f(0)=0$, not $3$.',
            'Titik $(0,3)$ memberi $k=3$. Lalu $f(2)=3a^2=12$, jadi $a^2=4$ dan $a=2$. Pilihan $3x^2$ bukan eksponensial, walaupun juga memberi $12$ di $x=2$; tetapi $f(0)=0$, bukan $3$.',
          ),
          hint: L(
            'The value at $x=0$ is the starting value. Then use the second point to find the base.',
            'Nilai di $x=0$ adalah nilai awal. Lalu pakai titik kedua untuk mencari basisnya.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L('Try it together: find $\\log_2 32$.', 'Coba bersama: cari $\\log_2 32$.'),
          template: '2^x=32 \\Rightarrow x=___ \\qquad \\log_2 32=___',
          blanks: ['5', '5'],
          explain: L('$2^5=32$, so the exponent $5$ is the logarithm.', '$2^5=32$, jadi eksponen $5$ adalah logaritmanya.'),
          hint: L('Ask: $2$ to which power gives $32$?', 'Tanyakan: $2$ pangkat berapa yang memberi $32$?'),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L('$\\log_2 8=3$', '$\\log_2 8=3$'),
            L('$\\log_3 9=3$', '$\\log_3 9=3$'),
            L('$\\log(a+b)=\\log a+\\log b$ for all positive $a,b$', '$\\log(a+b)=\\log a+\\log b$ untuk semua $a,b$ positif'),
            L('$\\log_2 12-\\log_2 3=2$', '$\\log_2 12-\\log_2 3=2$'),
          ],
          answer: [0, 3],
          explain: L(
            '$2^3=8$. $\\log_3 9=2$ because $3^2=9$. The product rule does not apply to a sum. And $\\log_2 12-\\log_2 3=\\log_2 4=2$.',
            '$2^3=8$. $\\log_3 9=2$ karena $3^2=9$. Aturan hasil kali tidak berlaku untuk jumlah. Dan $\\log_2 12-\\log_2 3=\\log_2 4=2$.',
          ),
          hint: L('Turn each into a power: $\\log_a b=c$ means $a^c=b$.', 'Ubah tiap pernyataan menjadi pangkat: $\\log_a b=c$ berarti $a^c=b$.'),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L(
            'A video has $f(t)=3\\cdot2^{t}$ thousand viewers after $t$ days. Decide whether each statement is True or False.',
            'Sebuah video memiliki $f(t)=3\\cdot2^{t}$ ribu penonton setelah $t$ hari. Tentukan tiap pernyataan Benar atau Salah.',
          ),
          statements: [
            L('At the start the video has $3$ thousand viewers.', 'Pada awalnya video memiliki $3$ ribu penonton.'),
            L('After $2$ days it has $12$ thousand viewers.', 'Setelah $2$ hari video memiliki $12$ ribu penonton.'),
            L('The number of viewers doubles every day.', 'Banyak penonton berlipat dua setiap hari.'),
            L('After $10$ days it has exactly $30$ thousand viewers.', 'Setelah $10$ hari video memiliki tepat $30$ ribu penonton.'),
          ],
          answer: [true, true, true, false],
          explain: L(
            '$f(0)=3$, $f(2)=3\\cdot4=12$ and each day multiplies by $2$. But $f(10)=3\\cdot1024=3072$ thousand, not $30$ thousand.',
            '$f(0)=3$, $f(2)=3\\cdot4=12$ dan tiap hari dikalikan $2$. Tetapi $f(10)=3\\cdot1024=3072$ ribu, bukan $30$ ribu.',
          ),
          hint: L('Substitute the values of $t$ into $3\\cdot2^t$.', 'Substitusikan nilai $t$ ke $3\\cdot2^t$.'),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'Solve $3\\cdot2^{x}=96$.',
            'Selesaikan $3\\cdot2^{x}=96$.',
          ),
          blanks: [{ label: 'x =', answer: 5 }],
          hints: [
            L('Divide both sides by $3$.', 'Bagi kedua ruas dengan $3$.'),
            L('$2^{x}=32$.', '$2^{x}=32$.'),
            L('Write $32$ as a power of $2$.', 'Tulis $32$ sebagai pangkat dari $2$.'),
          ],
          explain: L('$2^x=32=2^5$, so $x=5$.', '$2^x=32=2^5$, jadi $x=5$.'),
          solution: ['2^{x}=\\frac{96}{3}=32=2^{5}', 'x=5'],
        },
      ],
    },
    /* ---------------------------------------------------- L2 trigonometric */
    {
      id: 'tka-sml-m3-s2-l2',
      title: L('Trigonometric Functions', 'Fungsi Trigonometri'),
      goal: L(
        'You can read the amplitude, period, shift and range of y = a sin(bx − c) + d, and match it to a graph.',
        'Kamu bisa membaca amplitudo, periode, pergeseran, dan daerah hasil y = a sin(bx − c) + d, dan mencocokkannya dengan grafik.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Amplitude, Period, Midline', 'Ayo Amati: Amplitudo, Periode, Garis Tengah'),
          body: L(
            'The graph of $y=a\\sin(bx)+d$ is a wave:\n\n- **amplitude** $|a|$: the height of the wave above its middle;\n- **period** $\\dfrac{360^{\\circ}}{|b|}$: the length of one full wave;\n- **midline** $y=d$: the middle height;\n- **range** $d-|a|\\le y\\le d+|a|$.\n\nThe picture shows $y=2\\sin2x+1$ ($x$ in degrees): amplitude $2$, period $\\frac{360^{\\circ}}{2}=180^{\\circ}$, midline $y=1$, range $-1\\le y\\le3$. It reaches the top $3$ at $x=45^{\\circ}$ and the bottom $-1$ at $x=135^{\\circ}$.',
            'Grafik $y=a\\sin(bx)+d$ adalah gelombang:\n\n- **amplitudo** $|a|$: tinggi gelombang di atas tengahnya;\n- **periode** $\\dfrac{360^{\\circ}}{|b|}$: panjang satu gelombang penuh;\n- **garis tengah** $y=d$: tinggi tengah;\n- **daerah hasil** $d-|a|\\le y\\le d+|a|$.\n\nGambar menunjukkan $y=2\\sin2x+1$ ($x$ dalam derajat): amplitudo $2$, periode $\\frac{360^{\\circ}}{2}=180^{\\circ}$, garis tengah $y=1$, daerah hasil $-1\\le y\\le3$. Ia mencapai puncak $3$ di $x=45^{\\circ}$ dan dasar $-1$ di $x=135^{\\circ}$.',
          ),
          figure: {
            ...wave([[0, 1], [45, 3], [135, -1]]),
            caption: L('The graph of 2 sin 2x + 1 for x from 0° to 360°. The dashed line is the midline.', 'Grafik 2 sin 2x + 1 untuk x dari 0° sampai 360°. Garis putus-putus adalah garis tengah.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Reading y = −3 sin(2x − 30°) + 4', 'Contoh Bertahap: Membaca y = −3 sin(2x − 30°) + 4'),
          body: L(
            'Factor out the $2$ to see the shift: $2x-30^{\\circ}=2(x-15^{\\circ})$.\n\n1. Step 1: Amplitude: $|-3|=3$.\n2. Step 2: Period: $\\frac{360^{\\circ}}{2}=180^{\\circ}$.\n3. Step 3: Shift: $15^{\\circ}$ to the **right** (not $30^{\\circ}$).\n4. Step 4: Midline $y=4$, so the range is $4-3\\le y\\le4+3$, that is $1\\le y\\le7$.\n5. Step 5: The minus sign flips the wave: from the midline it first goes **down**.\n\nThe period depends only on $b$; a shift or a flip never changes it.',
            'Keluarkan $2$ untuk melihat pergeseran: $2x-30^{\\circ}=2(x-15^{\\circ})$.\n\n1. Langkah 1: Amplitudo: $|-3|=3$.\n2. Langkah 2: Periode: $\\frac{360^{\\circ}}{2}=180^{\\circ}$.\n3. Langkah 3: Pergeseran: $15^{\\circ}$ ke **kanan** (bukan $30^{\\circ}$).\n4. Langkah 4: Garis tengah $y=4$, jadi daerah hasilnya $4-3\\le y\\le4+3$, yaitu $1\\le y\\le7$.\n5. Langkah 5: Tanda minus membalik gelombang: dari garis tengah ia mula-mula **turun**.\n\nPeriode hanya bergantung pada $b$; pergeseran atau pembalikan tidak pernah mengubahnya.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Watch Out!: Cosine, Tangent and Common Slips', 'Awas, Jebakan!: Kosinus, Tangen, dan Kekeliruan Umum'),
          body: L(
            '- **Cosine** is a sine shifted: $y=\\cos x$ starts at its **top** at $x=0$, while $\\sin x$ starts at the middle.\n- The period of $\\tan(bx)$ is $\\dfrac{180^{\\circ}}{|b|}$, half of that of sine, and it has vertical asymptotes.\n- The amplitude is **never negative**: $y=-3\\sin x$ has amplitude $3$.\n- The shift is $\\frac{c}{b}$, not $c$, in $\\sin(bx-c)$.\n\nExample: $y=2\\cos3x+1$ has period $\\frac{360^{\\circ}}{3}=120^{\\circ}$, maximum $3$ at $x=0$ and minimum $-1$ at $x=60^{\\circ}$.',
            '- **Kosinus** adalah sinus yang digeser: $y=\\cos x$ mulai di **puncak** pada $x=0$, sedangkan $\\sin x$ mulai di tengah.\n- Periode $\\tan(bx)$ adalah $\\dfrac{180^{\\circ}}{|b|}$, setengah dari periode sinus, dan ia punya asimtot tegak.\n- Amplitudo **tidak pernah negatif**: $y=-3\\sin x$ beramplitudo $3$.\n- Pergeserannya $\\frac{c}{b}$, bukan $c$, pada $\\sin(bx-c)$.\n\nContoh: $y=2\\cos3x+1$ berperiode $\\frac{360^{\\circ}}{3}=120^{\\circ}$, maksimum $3$ di $x=0$ dan minimum $-1$ di $x=60^{\\circ}$.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The graph shows a wave with its midline dashed. Which function is it ($x$ in degrees)?',
            'Grafik menunjukkan sebuah gelombang dengan garis tengah putus-putus. Fungsi manakah itu ($x$ dalam derajat)?',
          ),
          figure: {
            ...wave([[0, 1], [45, 3], [135, -1]]),
            caption: L('A wave with top 3 at 45° and bottom −1 at 135°.', 'Gelombang dengan puncak 3 di 45° dan dasar −1 di 135°.'),
          },
          options: ['2\\sin2x+1', '2\\sin x+1', '2\\cos2x+1', '\\sin2x+2', '2\\sin2x-1'].map((s) => L(`$y=${s}$`, `$y=${s}$`)),
          answer: 0,
          explain: L(
            'The top is $3$ and the bottom is $-1$, so the midline is $y=1$ and the amplitude is $2$. One full wave takes $180^{\\circ}$, so $b=2$. It leaves the midline going up, which is a sine. The cosine option would start at its top, and $\\sin x$ would take $360^{\\circ}$.',
            'Puncaknya $3$ dan dasarnya $-1$, jadi garis tengahnya $y=1$ dan amplitudonya $2$. Satu gelombang penuh memerlukan $180^{\\circ}$, jadi $b=2$. Ia meninggalkan garis tengah dengan naik, yaitu sinus. Pilihan kosinus akan mulai dari puncaknya, dan $\\sin x$ memerlukan $360^{\\circ}$.',
          ),
          hint: L(
            'Find the midline and amplitude from the top and bottom. Then find how long one wave is.',
            'Cari garis tengah dan amplitudo dari puncak dan dasar. Lalu cari panjang satu gelombang.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L('Try it together: the period and range of $y=3\\sin4x+2$.', 'Coba bersama: periode dan daerah hasil $y=3\\sin4x+2$.'),
          template: '\\frac{360^{\\circ}}{4}=___^{\\circ} \\qquad ___\\le y\\le___',
          blanks: ['90', '-1', '5'],
          explain: L(
            'The period is $\\frac{360^{\\circ}}{4}=90^{\\circ}$. The range is $2-3\\le y\\le2+3$, that is $-1\\le y\\le5$.',
            'Periodenya $\\frac{360^{\\circ}}{4}=90^{\\circ}$. Daerah hasilnya $2-3\\le y\\le2+3$, yaitu $-1\\le y\\le5$.',
          ),
          hint: L('Period: $360^{\\circ}$ divided by $b$. Range: midline $\\pm$ amplitude.', 'Periode: $360^{\\circ}$ dibagi $b$. Daerah hasil: garis tengah $\\pm$ amplitudo.'),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L(
            'Choose the TWO true statements about $f(x)=-3\\sin(2x-30^{\\circ})+4$.',
            'Pilih DUA pernyataan yang benar tentang $f(x)=-3\\sin(2x-30^{\\circ})+4$.',
          ),
          options: [
            L('Its period is $180^{\\circ}$.', 'Periodenya $180^{\\circ}$.'),
            L('Its range is $1\\le y\\le7$.', 'Daerah hasilnya $1\\le y\\le7$.'),
            L('Its amplitude is $-3$.', 'Amplitudonya $-3$.'),
            L('Its period is $360^{\\circ}$.', 'Periodenya $360^{\\circ}$.'),
          ],
          answer: [0, 1],
          explain: L(
            'The period is $\\frac{360^{\\circ}}{2}=180^{\\circ}$ and the range is $4\\pm3$. An amplitude is never negative, and $360^{\\circ}$ would be the period of $\\sin x$.',
            'Periodenya $\\frac{360^{\\circ}}{2}=180^{\\circ}$ dan daerah hasilnya $4\\pm3$. Amplitudo tidak pernah negatif, dan $360^{\\circ}$ adalah periode $\\sin x$.',
          ),
          hint: L('Period uses only $b=2$. The range uses the midline and $|a|$.', 'Periode hanya memakai $b=2$. Daerah hasil memakai garis tengah dan $|a|$.'),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L(
            'Let $y=2\\cos3x+1$ with $x$ in degrees. Decide whether each statement is True or False.',
            'Misalkan $y=2\\cos3x+1$ dengan $x$ dalam derajat. Tentukan tiap pernyataan Benar atau Salah.',
          ),
          statements: [
            L('The period is $120^{\\circ}$.', 'Periodenya $120^{\\circ}$.'),
            L('The maximum value is $3$.', 'Nilai maksimumnya $3$.'),
            L('The minimum value is $-1$.', 'Nilai minimumnya $-1$.'),
            L('The value at $x=60^{\\circ}$ is $3$.', 'Nilai di $x=60^{\\circ}$ adalah $3$.'),
          ],
          answer: [true, true, true, false],
          explain: L(
            'The period is $\\frac{360^{\\circ}}{3}=120^{\\circ}$ and the range is $1\\pm2$, so $-1\\le y\\le3$. At $x=60^{\\circ}$: $2\\cos180^{\\circ}+1=-1$, the minimum, not $3$.',
            'Periodenya $\\frac{360^{\\circ}}{3}=120^{\\circ}$ dan daerah hasilnya $1\\pm2$, jadi $-1\\le y\\le3$. Di $x=60^{\\circ}$: $2\\cos180^{\\circ}+1=-1$, yaitu minimum, bukan $3$.',
          ),
          hint: L('Substitute $x=60^{\\circ}$: what is $\\cos180^{\\circ}$?', 'Substitusikan $x=60^{\\circ}$: berapa $\\cos180^{\\circ}$?'),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'For $y=2\\sin2x+1$, find the smallest positive $x$, in degrees, at which the maximum value is reached.',
            'Untuk $y=2\\sin2x+1$, cari $x$ positif terkecil, dalam derajat, saat nilai maksimum dicapai.',
          ),
          blanks: [{ label: 'x =', answer: 45, after: '^{\\circ}' }],
          hints: [
            L('The maximum occurs when $\\sin2x=1$.', 'Maksimum terjadi ketika $\\sin2x=1$.'),
            L('$\\sin\\theta=1$ first at $\\theta=90^{\\circ}$.', '$\\sin\\theta=1$ pertama kali di $\\theta=90^{\\circ}$.'),
            L('So $2x=90^{\\circ}$.', 'Jadi $2x=90^{\\circ}$.'),
          ],
          explain: L('$2x=90^{\\circ}$ gives $x=45^{\\circ}$, where $y=2+1=3$.', '$2x=90^{\\circ}$ memberi $x=45^{\\circ}$, tempat $y=2+1=3$.'),
          solution: ['\\sin2x=1 \\Rightarrow 2x=90^{\\circ}', 'x=45^{\\circ}'],
        },
      ],
    },
  ],
  project: {
    id: 'tka-sml-m3-s2-p',
    runtime: 'math',
    title: L('Growth, Logarithms and Waves at Work', 'Pertumbuhan, Logaritma, dan Gelombang dalam Pemakaian'),
    brief: L(
      'Use exponential models, logarithms and trigonometric graphs.',
      'Pakai model eksponensial, logaritma, dan grafik trigonometri.',
    ),
    requirements: [
      L('Evaluate and solve exponential models.', 'Menghitung dan menyelesaikan model eksponensial.'),
      L('Read the period and range of a sine wave.', 'Membaca periode dan daerah hasil gelombang sinus.'),
    ],
    hints: [
      L('Write both sides as powers of the same base.', 'Tulis kedua ruas sebagai pangkat dari basis yang sama.'),
      L('$\\log_a b$ is the exponent that turns $a$ into $b$.', '$\\log_a b$ adalah eksponen yang mengubah $a$ menjadi $b$.'),
      L('Period $=\\frac{360^{\\circ}}{|b|}$; range $=d\\pm|a|$.', 'Periode $=\\frac{360^{\\circ}}{|b|}$; daerah hasil $=d\\pm|a|$.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L(
          'A culture has $P(t)=200\\cdot2^{t/3}$ bacteria after $t$ hours. How many bacteria are there after $9$ hours?',
          'Sebuah biakan memiliki $P(t)=200\\cdot2^{t/3}$ bakteri setelah $t$ jam. Berapa bakteri setelah $9$ jam?',
        ),
        blanks: [{ answer: 1600 }],
        solution: ['P(9)=200\\cdot2^{3}=200\\cdot8', '=1\\,600'],
      },
      {
        prompt: L('Solve $2^{x+1}=32$.', 'Selesaikan $2^{x+1}=32$.'),
        blanks: [{ label: 'x =', answer: 4 }],
        solution: ['2^{x+1}=2^{5}', 'x+1=5 \\Rightarrow x=4'],
      },
      {
        prompt: L('Find $\\log_2 40-\\log_2 5$.', 'Cari $\\log_2 40-\\log_2 5$.'),
        blanks: [{ answer: 3 }],
        solution: ['\\log_2\\frac{40}{5}=\\log_2 8', '=3'],
      },
      {
        prompt: L(
          'Find the period, in degrees, of $y=\\sin4x$.',
          'Cari periode, dalam derajat, dari $y=\\sin4x$.',
        ),
        blanks: [{ answer: 90, after: '^{\\circ}' }],
        solution: ['\\frac{360^{\\circ}}{4}', '=90^{\\circ}'],
      },
      {
        prompt: L(
          'Find the maximum value of $y=-3\\sin(2x-30^{\\circ})+4$.',
          'Cari nilai maksimum $y=-3\\sin(2x-30^{\\circ})+4$.',
        ),
        blanks: [{ answer: 7 }],
        solution: ['y_{\\max}=4+|-3|', '=7'],
      },
    ],
  },
}
