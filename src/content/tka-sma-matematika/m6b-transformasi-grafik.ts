import type { Submodule } from '../types'
import { L, dot, line, plane, shape } from './figs'

/** Module 6, submodule 2 — transforming graphs, then combining
 *  transformations and symmetry. */

export const m6s2: Submodule = {
  id: 'tka-sma-m6-s2',
  title: L('Graphs, Compositions and Symmetry', 'Grafik, Komposisi, dan Simetri'),
  summary: L(
    'Shift, stretch and flip the graph of a function, combine transformations in order, and find the symmetry of a shape.',
    'Menggeser, meregangkan, dan membalik grafik fungsi, menggabungkan transformasi secara berurutan, serta menentukan simetri suatu bangun.',
  ),
  lessons: [
    /* ---------------------------------------------------- L1 transforming graphs */
    {
      id: 'tka-sma-m6-s2-l1',
      title: L('Transforming Graphs', 'Transformasi Grafik'),
      goal: L(
        'You can predict how $y=f(x)$ changes when you add, subtract, scale or negate inside or outside the function.',
        'Kamu bisa memprediksi bagaimana $y=f(x)$ berubah ketika kamu menambah, mengurang, menskalakan, atau menegasikan di dalam atau di luar fungsi.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Outside the Function Moves Up and Down', 'Ayo Amati: Di Luar Fungsi Menggeser Naik dan Turun'),
          body: L(
            'Start with $y=f(x)=x^2$ (green). Changes made **outside** $f$ act on the heights $y$, in the way you expect.\n\n- $y=f(x)+c$ moves the graph **up** by $c$ (down if $c<0$). The orange curve is $y=x^2+2$.\n- $y=-f(x)$ flips the graph over the $x$-axis.\n- $y=k\\,f(x)$ stretches the heights by $k$: $y=2x^2$ is twice as steep.\n\nEvery point $(x,y)$ on the green curve gives the point $(x,\\,y+2)$ on the orange one: the vertex $(0,0)$ moves to $(0,2)$.',
            'Mulai dari $y=f(x)=x^2$ (hijau). Perubahan di **luar** $f$ bekerja pada tinggi $y$, sesuai harapan.\n\n- $y=f(x)+c$ menggeser grafik **ke atas** sejauh $c$ (ke bawah jika $c<0$). Kurva oranye adalah $y=x^2+2$.\n- $y=-f(x)$ membalik grafik terhadap sumbu $x$.\n- $y=k\\,f(x)$ meregangkan tinggi $k$ kali: $y=2x^2$ dua kali lebih curam.\n\nSetiap titik $(x,y)$ pada kurva hijau memberi titik $(x,\\,y+2)$ pada kurva oranye: puncak $(0,0)$ pindah ke $(0,2)$.',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: 'x^2', from: -3, to: 3, color: 'a' },
                { t: 'curve', f: 'x^2+2', from: -3, to: 3, color: 'b' },
              ],
              { x: [-4, 4], y: [-3, 10] },
            ),
            caption: L('y = x² (green) and y = x² + 2 (orange).', 'y = x² (hijau) dan y = x² + 2 (oranye).'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Inside the Function Moves Sideways, Backwards', 'Contoh Bertahap: Di Dalam Fungsi Menggeser ke Samping, Terbalik'),
          body: L(
            'Changes made **inside** $f$ act on $x$, and they work **against** your first guess.\n\n- $y=f(x-3)$ moves the graph **right** by 3 (not left).\n- $y=f(x+3)$ moves it **left** by 3.\n- $y=f(-x)$ flips it over the $y$-axis.\n- $y=f(2x)$ squeezes it towards the $y$-axis by factor 2.\n\nWhy right? The old vertex of $x^2$ was at $x=0$. For $(x-3)^2$ the vertex needs $x-3=0$, which is $x=3$.\n\nIn the picture the green curve is $y=x^2$ and the orange curve is $y=(x-3)^2$. A quick check: the value $f(0)=0$ of the green curve appears at $x=3$ on the orange one.',
            'Perubahan di **dalam** $f$ bekerja pada $x$, dan bekerja **berlawanan** dengan dugaan pertamamu.\n\n- $y=f(x-3)$ menggeser grafik **ke kanan** 3 (bukan ke kiri).\n- $y=f(x+3)$ menggesernya **ke kiri** 3.\n- $y=f(-x)$ membaliknya terhadap sumbu $y$.\n- $y=f(2x)$ menekannya ke arah sumbu $y$ dengan faktor 2.\n\nMengapa ke kanan? Puncak $x^2$ semula di $x=0$. Untuk $(x-3)^2$ puncaknya membutuhkan $x-3=0$, yaitu $x=3$.\n\nPada gambar, kurva hijau adalah $y=x^2$ dan kurva oranye adalah $y=(x-3)^2$. Pemeriksaan cepat: nilai $f(0)=0$ pada kurva hijau muncul di $x=3$ pada kurva oranye.',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: 'x^2', from: -3, to: 3, color: 'a' },
                { t: 'curve', f: '(x-3)^2', from: 0, to: 6, color: 'b' },
              ],
              { x: [-4, 7], y: [-2, 10] },
            ),
            caption: L('y = x² (green) and y = (x - 3)² (orange).', 'y = x² (hijau) dan y = (x - 3)² (oranye).'),
          },
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Several Changes at Once', 'Contoh Bertahap: Beberapa Perubahan Sekaligus'),
          body: L(
            'Read $y=-(x-1)^2+4$ one piece at a time, starting from $y=x^2$:\n\n1. Step 1: $(x-1)^2$ moves the parabola **right 1**. The vertex is now $(1,0)$.\n2. Step 2: The minus sign flips it over, so it opens **downward**.\n3. Step 3: $+4$ lifts it **up 4**. The vertex is $(1,4)$.\n\nSo the graph opens down with its highest point at $(1,4)$ (red). Its greatest value is 4.\n\nIt crosses the $x$-axis where $-(x-1)^2+4=0$, so $(x-1)^2=4$, $x-1=\\pm2$, giving $x=3$ and $x=-1$.\n\n**Watch out:** the order matters for stretches. Always say what happens to $x$ (inside) and what happens to $y$ (outside) separately.',
            'Baca $y=-(x-1)^2+4$ sepotong demi sepotong, mulai dari $y=x^2$:\n\n1. Langkah 1: $(x-1)^2$ menggeser parabola **ke kanan 1**. Puncaknya kini $(1,0)$.\n2. Langkah 2: Tanda minus membaliknya, sehingga membuka **ke bawah**.\n3. Langkah 3: $+4$ mengangkatnya **naik 4**. Puncaknya $(1,4)$.\n\nJadi grafik membuka ke bawah dengan titik tertinggi $(1,4)$ (merah). Nilai terbesarnya 4.\n\nGrafik memotong sumbu $x$ di tempat $-(x-1)^2+4=0$, jadi $(x-1)^2=4$, $x-1=\\pm2$, memberi $x=3$ dan $x=-1$.\n\n**Awas:** urutan penting untuk peregangan. Selalu katakan apa yang terjadi pada $x$ (di dalam) dan apa yang terjadi pada $y$ (di luar) secara terpisah.',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: '-(x-1)^2+4', from: -2, to: 4, color: 'a' },
                dot([1, 4], '(1, 4)', 'result'),
                dot([3, 0], undefined, 'b'),
                dot([-1, 0], undefined, 'b'),
              ],
              { x: [-4, 6], y: [-4, 6] },
            ),
            caption: L('The graph of y = -(x - 1)² + 4.', 'Grafik y = -(x - 1)² + 4.'),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The green curve is $y=x^2$. Which equation gives the orange curve?',
            'Kurva hijau adalah $y=x^2$. Persamaan manakah yang memberikan kurva oranye?',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: 'x^2', from: -3, to: 3, color: 'a' },
                { t: 'curve', f: '(x+2)^2', from: -5, to: 1, color: 'b' },
              ],
              { x: [-6, 4], y: [-2, 10] },
            ),
            caption: L('A parabola and its image.', 'Sebuah parabola dan bayangannya.'),
          },
          options: [L('$y=(x+2)^2$', '$y=(x+2)^2$'), L('$y=(x-2)^2$', '$y=(x-2)^2$'), L('$y=x^2+2$', '$y=x^2+2$'), L('$y=x^2-2$', '$y=x^2-2$')],
          answer: 0,
          explain: L(
            'The vertex moved from $(0,0)$ to $(-2,0)$: 2 units left. Moving left means $x$ is replaced by $x+2$, so $y=(x+2)^2$. Adding 2 outside would lift the curve instead.',
            'Puncak pindah dari $(0,0)$ ke $(-2,0)$: 2 satuan ke kiri. Bergeser ke kiri berarti $x$ diganti $x+2$, jadi $y=(x+2)^2$. Menambah 2 di luar akan mengangkat kurva.',
          ),
          hint: L(
            'Find where the new vertex is. A shift sideways is written inside the brackets, with the opposite sign.',
            'Cari letak puncak yang baru. Pergeseran ke samping ditulis di dalam kurung, dengan tanda berlawanan.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: find the vertex $(p,q)$ of $y=(x-3)^2+1$.',
            'Coba bersama: tentukan titik puncak $(p,q)$ dari $y=(x-3)^2+1$.',
          ),
          template: 'V=(___,\\ ___)',
          blanks: ['3', '1'],
          explain: L(
            'The bracket $(x-3)$ is zero at $x=3$, and the constant $+1$ lifts the vertex by 1: $V=(3,1)$.',
            'Kurung $(x-3)$ bernilai nol di $x=3$, dan konstanta $+1$ mengangkat puncak 1: $V=(3,1)$.',
          ),
          hint: L(
            'For the first number, ask which $x$ makes the bracket zero. The second number is the constant at the end.',
            'Untuk bilangan pertama, tanyakan $x$ berapa yang membuat kurung nol. Bilangan kedua adalah konstanta di ujung.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('The graph of $y=f(x)$ is transformed. Choose the TWO true statements.', 'Grafik $y=f(x)$ ditransformasikan. Pilih DUA pernyataan yang benar.'),
          options: [
            L('$y=f(x)+3$ moves the graph up 3.', '$y=f(x)+3$ menggeser grafik naik 3.'),
            L('$y=f(x-3)$ moves the graph right 3.', '$y=f(x-3)$ menggeser grafik ke kanan 3.'),
            L('$y=f(x+3)$ moves the graph right 3.', '$y=f(x+3)$ menggeser grafik ke kanan 3.'),
            L('$y=-f(x)$ reflects the graph in the $y$-axis.', '$y=-f(x)$ mencerminkan grafik terhadap sumbu $y$.'),
          ],
          answer: [0, 1],
          explain: L(
            '$f(x+3)$ moves the graph **left** 3. And $-f(x)$ negates the heights, which reflects the graph in the $x$-axis (the $y$-axis reflection is $f(-x)$).',
            '$f(x+3)$ menggeser grafik **ke kiri** 3. Dan $-f(x)$ menegasikan tinggi, yang mencerminkan grafik terhadap sumbu $x$ (refleksi sumbu $y$ adalah $f(-x)$).',
          ),
          hint: L(
            'Changes inside the brackets behave the opposite way to what you first expect.',
            'Perubahan di dalam kurung bekerja berlawanan dengan dugaan pertamamu.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('$y=f(-x)$ is the reflection of $y=f(x)$ in the $y$-axis.', '$y=f(-x)$ adalah pencerminan $y=f(x)$ terhadap sumbu $y$.'),
            L('$y=2f(x)$ doubles all the heights of the graph.', '$y=2f(x)$ menggandakan semua tinggi grafik.'),
            L('$y=f(2x)$ stretches the graph away from the $y$-axis by factor 2.', '$y=f(2x)$ meregangkan grafik menjauhi sumbu $y$ dengan faktor 2.'),
            L('$y=f(x)-4$ moves the graph 4 units left.', '$y=f(x)-4$ menggeser grafik 4 satuan ke kiri.'),
          ],
          answer: [true, true, false, false],
          explain: L(
            'The first two are correct. $f(2x)$ squeezes the graph towards the $y$-axis (it reaches each height at half the $x$). And $f(x)-4$ moves the graph **down** 4.',
            'Dua yang pertama benar. $f(2x)$ menekan grafik ke arah sumbu $y$ (mencapai tiap tinggi pada setengah $x$). Dan $f(x)-4$ menggeser grafik **turun** 4.',
          ),
          hint: L(
            'A change outside $f$ acts on the height; a change inside acts on $x$.',
            'Perubahan di luar $f$ bekerja pada tinggi; perubahan di dalam bekerja pada $x$.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'The graph of $y=x^2$ is moved 2 units right and 3 units down. Its new equation is $y=(x-2)^2-3$. What is the value of $y$ when $x=5$?',
            'Grafik $y=x^2$ digeser 2 satuan ke kanan dan 3 satuan ke bawah. Persamaan barunya $y=(x-2)^2-3$. Berapa nilai $y$ saat $x=5$?',
          ),
          blanks: [{ label: 'y =', answer: 6 }],
          hints: [
            L('Substitute $x=5$ into the new equation.', 'Substitusikan $x=5$ ke persamaan yang baru.'),
            L('$(5-2)^2-3$: the bracket first.', '$(5-2)^2-3$: kurungnya dulu.'),
            L('$3^2=9$, then subtract 3.', '$3^2=9$, lalu kurangi 3.'),
          ],
          explain: L(
            '$y=(5-2)^2-3=9-3=6$.',
            '$y=(5-2)^2-3=9-3=6$.',
          ),
          solution: ['y=(5-2)^2-3', '=9-3=6'],
        },
      ],
    },
    /* --------------------------------------------- L2 compositions and symmetry */
    {
      id: 'tka-sma-m6-s2-l2',
      title: L('Compositions and Symmetry', 'Komposisi dan Simetri'),
      goal: L(
        'You can combine two transformations in the right order, name the result of two reflections, and count the symmetries of a shape.',
        'Kamu bisa menggabungkan dua transformasi dengan urutan yang benar, menyebut hasil dua refleksi, dan menghitung simetri suatu bangun.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Does the Order Matter?', 'Ayo Amati: Apakah Urutan Berpengaruh?'),
          body: L(
            'Take $P(1,3)$. Do two moves: **T**, a translation by $\\begin{pmatrix}2\\\\0\\end{pmatrix}$, and **R**, a reflection in the $y$-axis.\n\n- First T then R: $(1,3)\\to(3,3)\\to(-3,3)$.\n- First R then T: $(1,3)\\to(-1,3)\\to(1,3)$.\n\nThe results differ, $(-3,3)$ against $(1,3)$. So the **order matters**: the first move is done first, and the second move acts on its image.\n\nWrite a combination as "T then R" or, with function notation, $R\\circ T$ (the move written on the right is done first), just like composite functions.',
            'Ambil $P(1,3)$. Lakukan dua gerakan: **T**, translasi $\\begin{pmatrix}2\\\\0\\end{pmatrix}$, dan **R**, refleksi pada sumbu $y$.\n\n- T dulu lalu R: $(1,3)\\to(3,3)\\to(-3,3)$.\n- R dulu lalu T: $(1,3)\\to(-1,3)\\to(1,3)$.\n\nHasilnya berbeda, $(-3,3)$ dan $(1,3)$. Jadi **urutan berpengaruh**: gerakan pertama dilakukan lebih dulu, dan gerakan kedua bekerja pada bayangannya.\n\nTulis kombinasi sebagai "T lalu R" atau, dengan notasi fungsi, $R\\circ T$ (gerakan yang ditulis di kanan dilakukan lebih dulu), sama seperti fungsi komposisi.',
          ),
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Two Reflections Make Something New', 'Contoh Bertahap: Dua Refleksi Menghasilkan Sesuatu yang Baru'),
          body: L(
            'Reflect $P(2,3)$ in the $x$-axis and then in the $y$-axis.\n\n1. Step 1: Reflection in the $x$-axis: $(2,3)\\to(2,-3)$.\n2. Step 2: Reflection in the $y$-axis: $(2,-3)\\to(-2,-3)$.\n3. Step 3: The end point $(-2,-3)$ is $(-x,-y)$, a **half-turn** ($180^{\\circ}$ rotation) about the origin.\n\nIn general:\n\n- Two reflections in **parallel** mirrors make a **translation** (twice the distance between the mirrors).\n- Two reflections in mirrors that **cross** make a **rotation** about the crossing point (twice the angle between the mirrors).',
            'Cerminkan $P(2,3)$ pada sumbu $x$ lalu pada sumbu $y$.\n\n1. Langkah 1: Refleksi pada sumbu $x$: $(2,3)\\to(2,-3)$.\n2. Langkah 2: Refleksi pada sumbu $y$: $(2,-3)\\to(-2,-3)$.\n3. Langkah 3: Titik akhir $(-2,-3)$ adalah $(-x,-y)$, yaitu **setengah putaran** (rotasi $180^{\\circ}$) terhadap titik asal.\n\nSecara umum:\n\n- Dua refleksi pada cermin **sejajar** menghasilkan **translasi** (dua kali jarak antara cermin).\n- Dua refleksi pada cermin yang **berpotongan** menghasilkan **rotasi** terhadap titik potong (dua kali sudut antara cermin).',
          ),
          figure: {
            ...plane(
              [
                dot([2, 3], 'P', 'a'),
                dot([2, -3], undefined, 'b'),
                dot([-2, -3], undefined, 'result'),
                line([2, 3], [2, -3], 'muted', { dashed: true }),
                line([2, -3], [-2, -3], 'muted', { dashed: true }),
              ],
              { span: 5 },
            ),
            caption: L('P, then its image in the x-axis, then in the y-axis.', 'P, lalu bayangannya pada sumbu x, lalu pada sumbu y.'),
          },
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Counting Symmetries', 'Contoh Bertahap: Menghitung Simetri'),
          body: L(
            'A shape has **line symmetry** if a mirror line splits it into two matching halves. It has **rotational symmetry** if a turn of less than $360^{\\circ}$ about its centre maps it onto itself. The number of ways it fits in a full turn is the **order**.\n\n| Shape | Lines of symmetry | Order of rotation |\n|---|---|---|\n| Equilateral triangle | 3 | 3 (turns of $120^{\\circ}$) |\n| Square | 4 | 4 (turns of $90^{\\circ}$) |\n| Rectangle (not a square) | 2 | 2 (turns of $180^{\\circ}$) |\n| Regular $n$-sided polygon | $n$ | $n$ |\n\nThe picture shows the 4 lines of symmetry of a square.\n\n**Watch out:** a rectangle that is not a square has only 2 lines, through the midpoints of opposite sides. The diagonals are **not** lines of symmetry.',
            'Sebuah bangun punya **simetri lipat** jika garis cermin membaginya menjadi dua bagian yang saling menutupi. Bangun punya **simetri putar** jika putaran kurang dari $360^{\\circ}$ terhadap pusatnya memetakannya ke dirinya sendiri. Banyak cara bangun itu menempati posisi semula dalam satu putaran penuh disebut **orde**.\n\n| Bangun | Garis simetri | Orde putaran |\n|---|---|---|\n| Segitiga sama sisi | 3 | 3 (putaran $120^{\\circ}$) |\n| Persegi | 4 | 4 (putaran $90^{\\circ}$) |\n| Persegi panjang (bukan persegi) | 2 | 2 (putaran $180^{\\circ}$) |\n| Segi-$n$ beraturan | $n$ | $n$ |\n\nGambar menunjukkan 4 garis simetri sebuah persegi.\n\n**Awas:** persegi panjang yang bukan persegi hanya punya 2 garis, melalui titik tengah sisi yang berhadapan. Diagonalnya **bukan** garis simetri.',
          ),
          figure: {
            ...shape({
              pts: [[0, 0], [4, 0], [4, 4], [0, 4]],
              look: 'solid',
              extra: [
                line([2, -0.6], [2, 4.6], 'result', { dashed: true }),
                line([-0.6, 2], [4.6, 2], 'result', { dashed: true }),
                line([-0.5, -0.5], [4.5, 4.5], 'b', { dashed: true }),
                line([-0.5, 4.5], [4.5, -0.5], 'b', { dashed: true }),
              ],
            }),
            caption: L('A square and its four lines of symmetry.', 'Sebuah persegi dan keempat garis simetrinya.'),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'How many lines of symmetry does this rectangle (not a square) have?',
            'Berapa banyak garis simetri yang dimiliki persegi panjang ini (bukan persegi)?',
          ),
          figure: {
            ...shape({ pts: [[0, 0], [6, 0], [6, 3], [0, 3]], rights: [0, 1, 2, 3], sides: ['6', '3'] }),
            caption: L('A rectangle 6 by 3.', 'Persegi panjang 6 kali 3.'),
          },
          options: [L('2', '2'), L('4', '4'), L('1', '1'), L('0', '0')],
          answer: 0,
          explain: L(
            'The two lines through the midpoints of opposite sides. The diagonals do not work: folding along one does not make the corners match, because the sides are different lengths.',
            'Dua garis melalui titik tengah sisi yang berhadapan. Diagonalnya tidak bisa: melipat sepanjang diagonal tidak membuat sudut-sudut saling menutupi, karena panjang sisinya berbeda.',
          ),
          hint: L(
            'Imagine folding the paper: which folds make both halves match exactly?',
            'Bayangkan melipat kertas: lipatan mana yang membuat kedua bagian cocok persis?',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: reflect $(2,3)$ in the $x$-axis and then in the $y$-axis.',
            'Coba bersama: cerminkan $(2,3)$ pada sumbu $x$ lalu pada sumbu $y$.',
          ),
          template: '(2,3)\\to(2,\\ ___)\\to(___,\\ -3)',
          blanks: ['-3', '-2'],
          explain: L(
            'The $x$-axis reflection changes the sign of $y$: $(2,-3)$. The $y$-axis reflection then changes the sign of $x$: $(-2,-3)$.',
            'Refleksi sumbu $x$ mengubah tanda $y$: $(2,-3)$. Refleksi sumbu $y$ lalu mengubah tanda $x$: $(-2,-3)$.',
          ),
          hint: L(
            'First blank: the new $y$ after the first reflection. Second blank: the new $x$ after the second.',
            'Blanko pertama: $y$ baru setelah refleksi pertama. Blanko kedua: $x$ baru setelah refleksi kedua.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L('A square has 4 lines of symmetry.', 'Persegi punya 4 garis simetri.'),
            L('An equilateral triangle has rotational symmetry of order 3.', 'Segitiga sama sisi punya simetri putar orde 3.'),
            L('A rectangle that is not a square has 4 lines of symmetry.', 'Persegi panjang yang bukan persegi punya 4 garis simetri.'),
            L('A parallelogram that is not a rhombus has 2 lines of symmetry.', 'Jajargenjang yang bukan belah ketupat punya 2 garis simetri.'),
          ],
          answer: [0, 1],
          explain: L(
            'A rectangle has only 2 lines, and an ordinary parallelogram has none (it has only half-turn symmetry).',
            'Persegi panjang hanya punya 2 garis, dan jajargenjang biasa tidak punya (hanya punya simetri setengah putaran).',
          ),
          hint: L(
            'Test each by imagining a fold line through the middle.',
            'Uji tiap bangun dengan membayangkan garis lipat melalui tengahnya.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('Reflecting in the $x$-axis and then in the $y$-axis equals a $180^{\\circ}$ rotation about $O$.', 'Refleksi pada sumbu $x$ lalu sumbu $y$ sama dengan rotasi $180^{\\circ}$ terhadap $O$.'),
            L('The order of two transformations never matters.', 'Urutan dua transformasi tidak pernah berpengaruh.'),
            L('Two reflections in parallel mirrors make a translation.', 'Dua refleksi pada cermin sejajar menghasilkan translasi.'),
            L('A regular pentagon has 4 lines of symmetry.', 'Segi lima beraturan punya 4 garis simetri.'),
          ],
          answer: [true, false, true, false],
          explain: L(
            'The first and third are standard results. The order did matter for $P(1,3)$. A regular $n$-gon has $n$ lines, so a pentagon has 5.',
            'Yang pertama dan ketiga adalah hasil baku. Urutan terbukti berpengaruh untuk $P(1,3)$. Segi-$n$ beraturan punya $n$ garis, jadi segi lima punya 5.',
          ),
          hint: L(
            'Use the example with $P(1,3)$ from the start of the lesson for the second statement.',
            'Pakai contoh $P(1,3)$ di awal pelajaran untuk pernyataan kedua.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'The point $P(2,5)$ is reflected in the line $y=x$ and then rotated $90^{\\circ}$ anticlockwise about the origin. Find the final point.',
            'Titik $P(2,5)$ dicerminkan pada garis $y=x$ lalu diputar $90^{\\circ}$ berlawanan arah jarum jam terhadap titik asal. Tentukan titik akhirnya.',
          ),
          inline: true,
          blanks: [
            { label: 'x =', answer: -2 },
            { label: 'y =', answer: 5 },
          ],
          hints: [
            L('Do the reflection first: swap the coordinates.', 'Lakukan refleksi dulu: tukar koordinatnya.'),
            L('$(2,5)\\to(5,2)$. Now use the $90^{\\circ}$ rule $(x,y)\\to(-y,x)$.', '$(2,5)\\to(5,2)$. Sekarang pakai aturan $90^{\\circ}$: $(x,y)\\to(-y,x)$.'),
            L('Apply it to $(5,2)$.', 'Terapkan pada $(5,2)$.'),
          ],
          explain: L(
            '$(2,5)\\to(5,2)\\to(-2,5)$.',
            '$(2,5)\\to(5,2)\\to(-2,5)$.',
          ),
          solution: ['(2,5)\\to(5,2)', '(5,2)\\to(-2,\\ 5)'],
        },
      ],
    },
  ],
  project: {
    id: 'tka-sma-m6-s2-p',
    runtime: 'math',
    title: L('Transforming and Symmetry', 'Transformasi dan Simetri'),
    brief: L(
      'Read transformed graphs, combine transformations and count symmetries.',
      'Baca grafik yang ditransformasi, gabungkan transformasi, dan hitung simetri.',
    ),
    requirements: [
      L('Describe a graph transformation from its equation.', 'Menguraikan transformasi grafik dari persamaannya.'),
      L('Count lines and orders of symmetry.', 'Menghitung garis dan orde simetri.'),
    ],
    hints: [
      L('Inside brackets: sideways, opposite sign. Outside: up or down, same sign.', 'Di dalam kurung: ke samping, tanda berlawanan. Di luar: naik atau turun, tanda sama.'),
      L('To find where a graph crosses the axis, set $y=0$.', 'Untuk mencari tempat grafik memotong sumbu, tetapkan $y=0$.'),
      L('A regular $n$-gon has $n$ lines of symmetry and order $n$.', 'Segi-$n$ beraturan punya $n$ garis simetri dan orde $n$.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L(
          'The graph of $y=x^2$ is moved 3 units right and 2 units up. Find the vertex $(p,q)$.',
          'Grafik $y=x^2$ digeser 3 satuan ke kanan dan 2 satuan ke atas. Tentukan titik puncak $(p,q)$.',
        ),
        inline: true,
        blanks: [
          { label: 'p =', answer: 3 },
          { label: 'q =', answer: 2 },
        ],
        solution: ['y=(x-3)^2+2', 'V=(3,2)'],
      },
      {
        prompt: L(
          'Find where the graph of $y=(x-1)^2-4$ meets the $x$-axis. Give the smaller value of $x$ first.',
          'Tentukan di mana grafik $y=(x-1)^2-4$ memotong sumbu $x$. Tulis nilai $x$ yang lebih kecil lebih dulu.',
        ),
        figure: {
          ...plane(
            [
              { t: 'curve', f: '(x-1)^2-4', from: -2, to: 4, color: 'a' },
            ],
            { x: [-4, 6], y: [-6, 6] },
          ),
          caption: L('The graph of y = (x - 1)² - 4.', 'Grafik y = (x - 1)² - 4.'),
        },
        inline: true,
        blanks: [
          { label: { en: '\\text{smaller } x =', id: '\\text{yang kecil } x =' }, answer: -1 },
          { label: { en: '\\text{larger } x =', id: '\\text{yang besar } x =' }, answer: 3 },
        ],
        solution: ['(x-1)^2=4 \\Rightarrow x-1=\\pm2', 'x=-1 \\quad x=3'],
      },
      {
        prompt: L(
          'The graph of $y=f(x)$ passes through the point $(2,5)$. The graph of $y=f(x-3)+1$ passes through the image of that point. Find it.',
          'Grafik $y=f(x)$ melalui titik $(2,5)$. Grafik $y=f(x-3)+1$ melalui bayangan titik itu. Tentukan bayangannya.',
        ),
        inline: true,
        blanks: [
          { label: 'x =', answer: 5 },
          { label: 'y =', answer: 6 },
        ],
        solution: {
          en: ['x-3: \\text{right } 3 \\Rightarrow 2+3=5', '+1: \\text{up } 1 \\Rightarrow 5+1=6'],
          id: ['x-3: \\text{kanan } 3 \\Rightarrow 2+3=5', '+1: \\text{naik } 1 \\Rightarrow 5+1=6'],
        },
      },
      {
        prompt: L(
          'The parabola $y=x^2$ is reflected in the $x$-axis and then moved up 9 units, giving $y=9-x^2$. What is the positive value of $x$ where it meets the $x$-axis?',
          'Parabola $y=x^2$ dicerminkan pada sumbu $x$ lalu digeser naik 9 satuan, menghasilkan $y=9-x^2$. Berapa nilai $x$ positif tempat parabola itu memotong sumbu $x$?',
        ),
        blanks: [{ label: 'x =', answer: 3 }],
        solution: ['9-x^2=0 \\Rightarrow x^2=9', 'x=3'],
      },
      {
        prompt: L(
          'How many lines of symmetry does a regular hexagon have?',
          'Berapa banyak garis simetri yang dimiliki segi enam beraturan?',
        ),
        blanks: [{ answer: 6 }],
        solution: {
          en: ['\\text{a regular } n\\text{-gon has } n \\text{ lines}', 'n=6'],
          id: ['\\text{segi-}n\\text{ beraturan punya } n \\text{ garis}', 'n=6'],
        },
      },
    ],
  },
}
