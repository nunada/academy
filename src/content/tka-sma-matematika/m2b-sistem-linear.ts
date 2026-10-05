import type { Submodule } from '../types'
import { L, dot, plane, solid, txt } from './figs'
import { lessonThreeUnknowns } from './m2c-tiga-variabel'

/** Module 2, submodule 2 — systems of two linear equations, and linear
 *  inequalities in two variables with a simple optimisation. */

export const m2s2: Submodule = {
  id: 'tka-sma-m2-s2',
  title: L('Systems of Linear Equations', 'Sistem Persamaan Linear'),
  summary: L(
    'Solve a system of two linear equations by graph, substitution and elimination, decide how many solutions it has, and use systems and inequalities in two variables to model problems.',
    'Menyelesaikan sistem dua persamaan linear dengan grafik, substitusi, dan eliminasi, menentukan banyak penyelesaiannya, serta memakai sistem dan pertidaksamaan dua variabel untuk memodelkan masalah.',
  ),
  lessons: [
    /* ------------------------------------------------------------ L1 two equations */
    {
      id: 'tka-sma-m2-s2-l1',
      title: L('Two Equations, Two Unknowns', 'Dua Persamaan, Dua Variabel'),
      goal: L(
        'You can solve a system of two linear equations by substitution and by elimination, and tell when it has no or infinitely many solutions.',
        'Kamu bisa menyelesaikan sistem dua persamaan linear dengan substitusi dan eliminasi, dan mengenali kapan tidak ada atau tak hingga banyak penyelesaian.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Where Two Lines Cross', 'Ayo Amati: Di Mana Dua Garis Berpotongan'),
          body: L(
            'One equation with two unknowns, like $2x+y=7$, has many solutions: $(3,1)$, $(2,3)$, $(0,7)$, $\\ldots$ Together they form a **line**.\n\nA **system** of two equations asks for the pair $(x,y)$ that satisfies **both**: the point lying on both lines.\n\n$$\\begin{cases}2x+y=7\\\\x-y=2\\end{cases}$$\n\nIn the graph the green line is $2x+y=7$ and the orange line is $x-y=2$. They cross at the red dot $(3,1)$, so the solution is $x=3$, $y=1$. Check: $2(3)+1=7$ and $3-1=2$.',
            'Satu persamaan dengan dua variabel, seperti $2x+y=7$, punya banyak penyelesaian: $(3,1)$, $(2,3)$, $(0,7)$, $\\ldots$ Semuanya membentuk sebuah **garis**.\n\n**Sistem** dua persamaan mencari pasangan $(x,y)$ yang memenuhi **keduanya**: titik yang terletak pada kedua garis.\n\n$$\\begin{cases}2x+y=7\\\\x-y=2\\end{cases}$$\n\nPada grafik, garis hijau adalah $2x+y=7$ dan garis oranye adalah $x-y=2$. Keduanya berpotongan di titik merah $(3,1)$, jadi penyelesaiannya $x=3$, $y=1$. Periksa: $2(3)+1=7$ dan $3-1=2$.',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: '7-2*x', from: -1, to: 5, color: 'a' },
                { t: 'curve', f: 'x-2', from: -1, to: 6, color: 'b' },
                dot([3, 1], '(3, 1)', 'result'),
              ],
              { x: [-2, 6], y: [-4, 8] },
            ),
            caption: L('Two lines meet at (3, 1).', 'Dua garis bertemu di (3, 1).'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Substitution and Elimination', 'Contoh Bertahap: Substitusi dan Eliminasi'),
          body: L(
            '**Elimination.** Solve $2x+y=7$ and $x-y=2$.\n\n1. Step 1: The $y$ terms are $+y$ and $-y$, so **add** the equations: $3x=9$.\n2. Step 2: $x=3$.\n3. Step 3: Put it into $x-y=2$: $3-y=2$, so $y=1$.\n\nIf no variable cancels, multiply an equation first. For $x+2y=5$ and $3x-y=1$: multiply the second by 2 to get $6x-2y=2$, then add to get $7x=7$.\n\n**Substitution.** Solve one equation for a variable and put it into the other. From $x-y=2$ we get $x=y+2$. Then $2(y+2)+y=7$ gives $3y+4=7$, so $y=1$ and $x=3$.\n\nBoth methods give the same answer. Use elimination when the coefficients match up, and substitution when one variable is already alone.',
            '**Eliminasi.** Selesaikan $2x+y=7$ dan $x-y=2$.\n\n1. Langkah 1: Suku $y$ adalah $+y$ dan $-y$, jadi **jumlahkan** kedua persamaan: $3x=9$.\n2. Langkah 2: $x=3$.\n3. Langkah 3: Masukkan ke $x-y=2$: $3-y=2$, jadi $y=1$.\n\nJika tidak ada variabel yang habis, kalikan salah satu persamaan dulu. Untuk $x+2y=5$ dan $3x-y=1$: kalikan yang kedua dengan 2 menjadi $6x-2y=2$, lalu jumlahkan menjadi $7x=7$.\n\n**Substitusi.** Selesaikan satu persamaan untuk sebuah variabel dan masukkan ke persamaan lainnya. Dari $x-y=2$ diperoleh $x=y+2$. Lalu $2(y+2)+y=7$ memberi $3y+4=7$, jadi $y=1$ dan $x=3$.\n\nKedua cara memberi jawaban yang sama. Pakai eliminasi saat koefisiennya cocok, dan substitusi saat salah satu variabel sudah sendirian.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Watch Out!: No Solution or Infinitely Many', 'Awas, Jebakan!: Tanpa Penyelesaian atau Tak Hingga Banyak'),
          body: L(
            'Two lines in a plane can be placed in three ways.\n\n| Picture | Algebra | Solutions |\n|---|---|---|\n| cross at one point | different slopes | exactly one |\n| parallel, apart | same slope, different position, e.g. $x+2y=4$ and $2x+4y=10$ | **none** |\n| the same line | one equation is a multiple of the other, e.g. $x+2y=4$ and $2x+4y=8$ | **infinitely many** |\n\nIn elimination, the signs are clear: if the unknowns vanish and leave a **false** statement like $0=2$, there is no solution. If they leave a **true** statement like $0=0$, there are infinitely many.\n\nThe picture shows $x+2y=4$ (green) and $2x+4y=10$ (orange): two parallel lines that never meet.',
            'Dua garis pada bidang dapat berada dalam tiga posisi.\n\n| Gambar | Aljabar | Penyelesaian |\n|---|---|---|\n| berpotongan di satu titik | kemiringan berbeda | tepat satu |\n| sejajar, terpisah | kemiringan sama, letak berbeda, mis. $x+2y=4$ dan $2x+4y=10$ | **tidak ada** |\n| garis yang sama | satu persamaan kelipatan yang lain, mis. $x+2y=4$ dan $2x+4y=8$ | **tak hingga banyak** |\n\nPada eliminasi, tandanya jelas: jika variabel habis dan menyisakan pernyataan **salah** seperti $0=2$, tidak ada penyelesaian. Jika menyisakan pernyataan **benar** seperti $0=0$, ada tak hingga banyak.\n\nGambar menunjukkan $x+2y=4$ (hijau) dan $2x+4y=10$ (oranye): dua garis sejajar yang tidak pernah bertemu.',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: '(4-x)/2', from: -2, to: 8, color: 'a' },
                { t: 'curve', f: '(5-x)/2', from: -2, to: 8, color: 'b' },
              ],
              { x: [-3, 9], y: [-3, 5] },
            ),
            caption: L('Two parallel lines: no common point.', 'Dua garis sejajar: tidak ada titik persekutuan.'),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The graph shows two lines. The red dot is where they cross. What is the solution $(x,y)$ of the system of the two lines?',
            'Grafik menunjukkan dua garis. Titik merah adalah tempat keduanya berpotongan. Berapa penyelesaian $(x,y)$ dari sistem kedua garis itu?',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: 'x+1', from: -1, to: 7, color: 'a' },
                { t: 'curve', f: '7-x', from: -1, to: 8, color: 'b' },
                dot([3, 4], undefined, 'result'),
              ],
              { x: [-1, 8], y: [-1, 8] },
            ),
            caption: L('The lines y = x + 1 and y = 7 - x.', 'Garis y = x + 1 dan y = 7 - x.'),
          },
          options: [L('$(3,4)$', '$(3,4)$'), L('$(4,3)$', '$(4,3)$'), L('$(1,7)$', '$(1,7)$'), L('$(0,1)$', '$(0,1)$')],
          answer: 0,
          explain: L(
            'Reading the dot: 3 across and 4 up, so $(3,4)$. Check in $y=x+1$: $4=3+1$. In $y=7-x$: $4=7-3$.',
            'Membaca titiknya: 3 ke kanan dan 4 ke atas, jadi $(3,4)$. Periksa di $y=x+1$: $4=3+1$. Di $y=7-x$: $4=7-3$.',
          ),
          hint: L(
            'The first number of a point is across (x), the second is up (y). Then check the point in both equations.',
            'Bilangan pertama titik adalah ke samping (x), yang kedua ke atas (y). Lalu periksa titik itu di kedua persamaan.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: solve $2x+y=7$ and $x-y=2$ by adding the equations.',
            'Coba bersama: selesaikan $2x+y=7$ dan $x-y=2$ dengan menjumlahkan kedua persamaan.',
          ),
          template: '3x=___ \\Rightarrow x=___ \\Rightarrow y=___',
          blanks: ['9', '3', '1'],
          explain: L(
            'Adding gives $3x=9$, so $x=3$. Then $x-y=2$ gives $y=3-2=1$.',
            'Menjumlahkan memberi $3x=9$, jadi $x=3$. Lalu $x-y=2$ memberi $y=3-2=1$.',
          ),
          hint: L(
            'On adding, $+y$ and $-y$ cancel. Add the right sides too: $7+2$.',
            'Saat dijumlahkan, $+y$ dan $-y$ saling menghapus. Jumlahkan juga ruas kanannya: $7+2$.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO pairs $(x,y)$ that satisfy $2x+y=7$.', 'Pilih DUA pasangan $(x,y)$ yang memenuhi $2x+y=7$.'),
          options: [L('$(3,1)$', '$(3,1)$'), L('$(2,3)$', '$(2,3)$'), L('$(1,4)$', '$(1,4)$'), L('$(4,0)$', '$(4,0)$')],
          answer: [0, 1],
          explain: L(
            '$2(3)+1=7$ and $2(2)+3=7$. But $2(1)+4=6$ and $2(4)+0=8$.',
            '$2(3)+1=7$ dan $2(2)+3=7$. Namun $2(1)+4=6$ dan $2(4)+0=8$.',
          ),
          hint: L(
            'Substitute each pair into the left side and compare with 7.',
            'Substitusikan tiap pasangan ke ruas kiri dan bandingkan dengan 7.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('$(2,1)$ is the solution of $x+y=3$ and $x-y=1$.', '$(2,1)$ adalah penyelesaian dari $x+y=3$ dan $x-y=1$.'),
            L('Two parallel lines meet at exactly one point.', 'Dua garis sejajar bertemu di tepat satu titik.'),
            L('If both equations describe the same line, there are infinitely many solutions.', 'Jika kedua persamaan menggambarkan garis yang sama, ada tak hingga banyak penyelesaian.'),
            L('$x+2y=4$ and $2x+4y=8$ have exactly one solution.', '$x+2y=4$ dan $2x+4y=8$ punya tepat satu penyelesaian.'),
          ],
          answer: [true, false, true, false],
          explain: L(
            '$2+1=3$ and $2-1=1$. Parallel lines never meet. The same line shares every point. And $2x+4y=8$ is just twice $x+2y=4$, so they are the same line.',
            '$2+1=3$ dan $2-1=1$. Garis sejajar tidak pernah bertemu. Garis yang sama memiliki semua titik bersama. Dan $2x+4y=8$ hanyalah dua kali $x+2y=4$, jadi keduanya garis yang sama.',
          ),
          hint: L(
            'Compare the second system: is one equation a multiple of the other?',
            'Bandingkan sistem terakhir: apakah satu persamaan kelipatan yang lain?',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            '3 adult tickets and 2 child tickets cost Rp190,000. 1 adult ticket and 2 child tickets cost Rp110,000. How many rupiah is one adult ticket?',
            '3 tiket dewasa dan 2 tiket anak berharga Rp190.000. 1 tiket dewasa dan 2 tiket anak berharga Rp110.000. Berapa rupiah harga satu tiket dewasa?',
          ),
          blanks: [{ label: 'Rp', answer: 40000 }],
          hints: [
            L('Let $a$ be an adult ticket and $c$ a child ticket. Write two equations.', 'Misalkan $a$ tiket dewasa dan $c$ tiket anak. Tulis dua persamaan.'),
            L('$3a+2c=190\\,000$ and $a+2c=110\\,000$. The $2c$ is the same in both.', '$3a+2c=190\\,000$ dan $a+2c=110\\,000$. Suku $2c$ sama pada keduanya.'),
            L('Subtract the second equation from the first so that $c$ disappears.', 'Kurangkan persamaan kedua dari yang pertama sehingga $c$ hilang.'),
          ],
          explain: L(
            'Subtracting gives $2a=80\\,000$, so $a=40\\,000$. (Then $2c=70\\,000$, so a child ticket is Rp35,000.)',
            'Mengurangkan memberi $2a=80\\,000$, jadi $a=40\\,000$. (Lalu $2c=70\\,000$, jadi tiket anak Rp35.000.)',
          ),
          solution: ['(3a+2c)-(a+2c)=190\\,000-110\\,000', '2a=80\\,000', 'a=40\\,000'],
        },
      ],
    },
    /* ------------------------------------------------- L2 two-variable inequalities */
    {
      id: 'tka-sma-m2-s2-l2',
      title: L('Regions and Best Choices', 'Daerah dan Pilihan Terbaik'),
      goal: L(
        'You can shade the region of a linear inequality in two variables, find the corner points of a region, and use them to find a greatest value.',
        'Kamu bisa mengarsir daerah pertidaksamaan linear dua variabel, mencari titik sudut suatu daerah, dan memakainya untuk mencari nilai terbesar.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Half of the Plane', 'Ayo Amati: Setengah Bidang'),
          body: L(
            'A line like $x+y=6$ cuts the plane into two halves. The inequality $x+y\\le6$ picks one half.\n\n1. Step 1: Draw the line $x+y=6$ through $(6,0)$ and $(0,6)$. Draw it solid for $\\le$ or $\\ge$ (the line is included), and dashed for $<$ or $>$.\n2. Step 2: **Test a point** not on the line, usually $(0,0)$: $0+0\\le6$ is true, so the half containing the origin is the solution.\n3. Step 3: Shade that half.\n\nThe picture shows the points with $x\\ge0$, $y\\ge0$ and $x+y\\le6$: a triangle with corners $(0,0)$, $(6,0)$ and $(0,6)$.',
            'Garis seperti $x+y=6$ membagi bidang menjadi dua bagian. Pertidaksamaan $x+y\\le6$ memilih salah satu bagian.\n\n1. Langkah 1: Gambar garis $x+y=6$ melalui $(6,0)$ dan $(0,6)$. Gambar tegas untuk $\\le$ atau $\\ge$ (garis ikut), dan putus-putus untuk $<$ atau $>$.\n2. Langkah 2: **Uji sebuah titik** yang tidak pada garis, biasanya $(0,0)$: $0+0\\le6$ benar, jadi bagian yang memuat titik asal adalah penyelesaian.\n3. Langkah 3: Arsir bagian itu.\n\nGambar menunjukkan titik-titik dengan $x\\ge0$, $y\\ge0$, dan $x+y\\le6$: sebuah segitiga dengan titik sudut $(0,0)$, $(6,0)$, dan $(0,6)$.',
          ),
          figure: {
            ...plane(
              [
                solid([[0, 0], [6, 0], [0, 6]], 'a'),
                { t: 'curve', f: '6-x', from: -1, to: 7, color: 'result' },
                txt(1.6, 1.6, 'x+y≤6', 'md', 'muted'),
              ],
              { x: [-2, 8], y: [-2, 8] },
            ),
            caption: L('The region x ≥ 0, y ≥ 0, x + y ≤ 6.', 'Daerah x ≥ 0, y ≥ 0, x + y ≤ 6.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Corner Points of a Region', 'Contoh Bertahap: Titik Sudut Suatu Daerah'),
          body: L(
            'A region cut out by several lines has **corner points** where two boundary lines meet. Find them by solving two equations at a time.\n\nThe region has $x\\ge0$, $y\\ge0$, $x+y\\le6$ and $x+2y\\le8$.\n\n1. Step 1: On the axes: $(0,0)$; $(6,0)$ where $x+y=6$ meets $y=0$; $(0,4)$ where $x+2y=8$ meets $x=0$.\n2. Step 2: The two slanted lines meet where $x+y=6$ and $x+2y=8$. Subtract: $y=2$, so $x=4$. The corner is $(4,2)$.\n3. Step 3: The four corners are $(0,0)$, $(6,0)$, $(4,2)$ and $(0,4)$.\n\nThe corners are the "extreme" places of the region: a straight line can only touch it last (or first) at a corner.',
            'Daerah yang dibatasi beberapa garis punya **titik sudut** di tempat dua garis batas bertemu. Carilah dengan menyelesaikan dua persamaan sekali.\n\nDaerah itu memenuhi $x\\ge0$, $y\\ge0$, $x+y\\le6$, dan $x+2y\\le8$.\n\n1. Langkah 1: Pada sumbu: $(0,0)$; $(6,0)$ tempat $x+y=6$ bertemu $y=0$; $(0,4)$ tempat $x+2y=8$ bertemu $x=0$.\n2. Langkah 2: Dua garis miring bertemu di tempat $x+y=6$ dan $x+2y=8$. Kurangkan: $y=2$, jadi $x=4$. Titik sudutnya $(4,2)$.\n3. Langkah 3: Keempat titik sudutnya $(0,0)$, $(6,0)$, $(4,2)$, dan $(0,4)$.\n\nTitik sudut adalah tempat "paling ujung" dari daerah: sebuah garis lurus hanya dapat menyentuhnya terakhir (atau pertama) di titik sudut.',
          ),
          figure: {
            ...plane(
              [
                solid([[0, 0], [6, 0], [4, 2], [0, 4]], 'a'),
                dot([0, 0], undefined, 'result'),
                dot([6, 0], undefined, 'result'),
                dot([4, 2], undefined, 'result'),
                dot([0, 4], undefined, 'result'),
              ],
              { x: [-1, 8], y: [-1, 7] },
            ),
            caption: L('A region with four corner points (red).', 'Sebuah daerah dengan empat titik sudut (merah).'),
          },
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: The Greatest Value', 'Contoh Bertahap: Nilai Terbesar'),
          body: L(
            'A bakery wants the greatest profit $z=3x+2y$ while staying inside the region of the last step.\n\nThe key fact: the greatest (and the smallest) value of a linear expression over such a region happens at a **corner point**. So compute $z$ at each corner:\n\n| Corner | $z=3x+2y$ |\n|---|---|\n| $(0,0)$ | $0$ |\n| $(6,0)$ | $18$ |\n| $(4,2)$ | $16$ |\n| $(0,4)$ | $8$ |\n\nThe greatest value is $18$, at $(6,0)$.\n\n**Watch out:** check that the corner really is inside **all** the inequalities, and never pick the "middle" of the region, because the best value is never found there.',
            'Sebuah toko roti menginginkan keuntungan terbesar $z=3x+2y$ dengan tetap berada di dalam daerah pada langkah sebelumnya.\n\nFakta kuncinya: nilai terbesar (dan terkecil) dari ekspresi linear di atas daerah seperti ini terjadi di **titik sudut**. Jadi hitung $z$ di setiap titik sudut:\n\n| Titik sudut | $z=3x+2y$ |\n|---|---|\n| $(0,0)$ | $0$ |\n| $(6,0)$ | $18$ |\n| $(4,2)$ | $16$ |\n| $(0,4)$ | $8$ |\n\nNilai terbesarnya $18$, di $(6,0)$.\n\n**Awas:** pastikan titik sudutnya benar-benar berada di dalam **semua** pertidaksamaan, dan jangan memilih "tengah" daerah, karena nilai terbaik tidak pernah ada di sana.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'Which system of inequalities describes the shaded triangle?',
            'Sistem pertidaksamaan manakah yang menggambarkan segitiga yang diarsir?',
          ),
          figure: {
            ...plane([solid([[0, 0], [4, 0], [0, 2]], 'a')], { x: [-1, 6], y: [-1, 4] }),
            caption: L('A triangle with corners (0, 0), (4, 0) and (0, 2).', 'Sebuah segitiga dengan titik sudut (0, 0), (4, 0), dan (0, 2).'),
          },
          options: [
            L('$x\\ge0,\\ y\\ge0,\\ x+2y\\le4$', '$x\\ge0,\\ y\\ge0,\\ x+2y\\le4$'),
            L('$x\\ge0,\\ y\\ge0,\\ 2x+y\\le4$', '$x\\ge0,\\ y\\ge0,\\ 2x+y\\le4$'),
            L('$x\\ge0,\\ y\\ge0,\\ x+2y\\ge4$', '$x\\ge0,\\ y\\ge0,\\ x+2y\\ge4$'),
            L('$x\\le0,\\ y\\le0,\\ x+2y\\le4$', '$x\\le0,\\ y\\le0,\\ x+2y\\le4$'),
          ],
          answer: 0,
          explain: L(
            'The slanted side passes through $(4,0)$ and $(0,2)$, which is the line $x+2y=4$. The origin makes $x+2y\\le4$ true, and the triangle is in the first quadrant, so $x\\ge0$ and $y\\ge0$.',
            'Sisi miring melalui $(4,0)$ dan $(0,2)$, yaitu garis $x+2y=4$. Titik asal membuat $x+2y\\le4$ benar, dan segitiga berada di kuadran pertama, jadi $x\\ge0$ dan $y\\ge0$.',
          ),
          hint: L(
            'Find the equation of the slanted side from its two end points, then test the origin.',
            'Cari persamaan sisi miring dari dua titik ujungnya, lalu uji titik asal.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: find the corner where $x+y=6$ meets $x+2y=8$ by subtracting.',
            'Coba bersama: cari titik sudut tempat $x+y=6$ bertemu $x+2y=8$ dengan mengurangkan.',
          ),
          template: '(x+2y)-(x+y)=8-6 \\Rightarrow y=___ \\Rightarrow x=___',
          blanks: ['2', '4'],
          explain: L(
            'The $x$ cancels and leaves $y=2$. Then $x+2=6$ gives $x=4$.',
            'Suku $x$ habis dan tersisa $y=2$. Lalu $x+2=6$ memberi $x=4$.',
          ),
          hint: L(
            'Subtract the left sides and the right sides separately. What is left of the left side?',
            'Kurangkan ruas kiri dan ruas kanan secara terpisah. Apa yang tersisa dari ruas kiri?',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L(
            'Choose the TWO points inside the region $x\\ge0$, $y\\ge0$, $x+y\\le6$ (the edge counts as inside).',
            'Pilih DUA titik di dalam daerah $x\\ge0$, $y\\ge0$, $x+y\\le6$ (tepi dianggap di dalam).',
          ),
          options: [L('$(2,3)$', '$(2,3)$'), L('$(6,0)$', '$(6,0)$'), L('$(4,4)$', '$(4,4)$'), L('$(-1,2)$', '$(-1,2)$')],
          answer: [0, 1],
          explain: L(
            '$2+3=5\\le6$ and $6+0=6\\le6$. But $4+4=8>6$, and $-1<0$ breaks $x\\ge0$.',
            '$2+3=5\\le6$ dan $6+0=6\\le6$. Namun $4+4=8>6$, dan $-1<0$ melanggar $x\\ge0$.',
          ),
          hint: L(
            'A point must satisfy all three inequalities at once.',
            'Sebuah titik harus memenuhi ketiga pertidaksamaan sekaligus.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('$(1,1)$ satisfies $2x+y\\le8$.', '$(1,1)$ memenuhi $2x+y\\le8$.'),
            L('A dashed boundary line means the line itself is not part of the region.', 'Garis batas putus-putus berarti garis itu sendiri bukan bagian dari daerah.'),
            L('$(5,3)$ satisfies $x+y\\le6$.', '$(5,3)$ memenuhi $x+y\\le6$.'),
            L('The greatest value of $3x+2y$ over a region is found at its middle.', 'Nilai terbesar $3x+2y$ pada suatu daerah ditemukan di tengahnya.'),
          ],
          answer: [true, true, false, false],
          explain: L(
            '$2+1=3\\le8$. A dashed line is used for $<$ and $>$, which leave the line out. $5+3=8>6$. And the greatest value of a linear expression is at a corner point, not in the middle.',
            '$2+1=3\\le8$. Garis putus-putus dipakai untuk $<$ dan $>$, yang tidak menyertakan garis. $5+3=8>6$. Dan nilai terbesar ekspresi linear ada di titik sudut, bukan di tengah.',
          ),
          hint: L(
            'Substitute the point for the first and third statements. Where do the extreme values of a linear expression sit?',
            'Substitusikan titik untuk pernyataan pertama dan ketiga. Di mana letak nilai ekstrem ekspresi linear?',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'Over the region $x\\ge0$, $y\\ge0$, $x+y\\le6$, $x+2y\\le8$, what is the greatest value of $z=3x+2y$?',
            'Pada daerah $x\\ge0$, $y\\ge0$, $x+y\\le6$, $x+2y\\le8$, berapa nilai terbesar $z=3x+2y$?',
          ),
          blanks: [{ label: 'z =', answer: 18 }],
          hints: [
            L('The greatest value happens at a corner point of the region.', 'Nilai terbesar terjadi di titik sudut daerah.'),
            L('The corners are $(0,0)$, $(6,0)$, $(4,2)$ and $(0,4)$.', 'Titik sudutnya $(0,0)$, $(6,0)$, $(4,2)$, dan $(0,4)$.'),
            L('Compute $3x+2y$ at each corner and take the biggest.', 'Hitung $3x+2y$ di tiap titik sudut dan ambil yang terbesar.'),
          ],
          explain: L(
            'The values are $0$, $18$, $16$ and $8$, so the greatest is $18$ at $(6,0)$.',
            'Nilainya $0$, $18$, $16$, dan $8$, jadi yang terbesar $18$ di $(6,0)$.',
          ),
          solution: ['(0,0):\\ 0 \\quad (6,0):\\ 18', '(4,2):\\ 12+4=16 \\quad (0,4):\\ 8', 'z_{\\max}=18'],
        },
      ],
    },
    lessonThreeUnknowns,
  ],
  project: {
    id: 'tka-sma-m2-s2-p',
    runtime: 'math',
    title: L('Systems and Best Choices', 'Sistem dan Pilihan Terbaik'),
    brief: L(
      'Solve systems by elimination and substitution, model a shop problem, and find the best choice for a bakery.',
      'Selesaikan sistem dengan eliminasi dan substitusi, modelkan masalah toko, dan cari pilihan terbaik untuk sebuah toko roti.',
    ),
    requirements: [
      L('Solve systems of two linear equations.', 'Menyelesaikan sistem dua persamaan linear.'),
      L('Use the corner points of a region to find a greatest value.', 'Memakai titik sudut suatu daerah untuk mencari nilai terbesar.'),
    ],
    hints: [
      L('Add or subtract the equations so one unknown disappears.', 'Jumlahkan atau kurangkan persamaan agar satu variabel hilang.'),
      L('If one variable is alone in an equation, substitute it into the other.', 'Jika satu variabel sudah sendirian pada suatu persamaan, substitusikan ke persamaan lain.'),
      L('Corner points are where two boundary lines meet. Test them all.', 'Titik sudut adalah tempat dua garis batas bertemu. Uji semuanya.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L('Solve $3x+2y=16$ and $x-2y=0$.', 'Selesaikan $3x+2y=16$ dan $x-2y=0$.'),
        inline: true,
        blanks: [
          { label: 'x =', answer: 4 },
          { label: 'y =', answer: 2 },
        ],
        solution: ['(3x+2y)+(x-2y)=16+0 \\Rightarrow 4x=16', 'x=4 \\quad y=\\frac{x}{2}=2'],
      },
      {
        prompt: L('Solve $y=2x-1$ and $3x+y=14$.', 'Selesaikan $y=2x-1$ dan $3x+y=14$.'),
        inline: true,
        blanks: [
          { label: 'x =', answer: 3 },
          { label: 'y =', answer: 5 },
        ],
        solution: ['3x+(2x-1)=14 \\Rightarrow 5x=15', 'x=3 \\quad y=2(3)-1=5'],
      },
      {
        prompt: L(
          'For which value of $k$ does the system $x+2y=4$ and $2x+ky=8$ have infinitely many solutions?',
          'Untuk nilai $k$ berapa sistem $x+2y=4$ dan $2x+ky=8$ punya tak hingga banyak penyelesaian?',
        ),
        blanks: [{ label: 'k =', answer: 4 }],
        solution: ['2(x+2y)=2\\cdot4 \\Rightarrow 2x+4y=8', 'k=4'],
      },
      {
        prompt: L(
          '2 notebooks and 3 pens cost Rp19,000. 1 notebook and 1 pen cost Rp8,000. How many rupiah is one notebook?',
          '2 buku tulis dan 3 pena berharga Rp19.000. 1 buku tulis dan 1 pena berharga Rp8.000. Berapa rupiah harga satu buku tulis?',
        ),
        blanks: [{ label: 'Rp', answer: 5000 }],
        solution: ['2n+3p=19\\,000 \\quad n+p=8\\,000', '2n+3p-3(n+p)=19\\,000-24\\,000 \\Rightarrow -n=-5\\,000', 'n=5\\,000'],
      },
      {
        prompt: L(
          'Solve $x+y+z=6$, $x-y+z=2$ and $2x+y-z=1$. Find the product $xyz$.',
          'Selesaikan $x+y+z=6$, $x-y+z=2$, dan $2x+y-z=1$. Tentukan hasil kali $xyz$.',
        ),
        blanks: [{ label: 'xyz =', answer: 6 }],
        solution: ['y=2, \\quad x+z=4, \\quad 2x-z=-1', 'x=1, \\quad z=3', 'xyz=1\\cdot2\\cdot3=6'],
      },
      {
        prompt: L(
          'A baker makes $x$ cakes and $y$ brownies. The flour allows $2x+y\\le12$ and the eggs allow $x+y\\le8$, with $x,y\\ge0$. The profit is $z=4x+3y$ (in thousands of rupiah). What is the greatest profit?',
          'Seorang pembuat roti membuat $x$ kue dan $y$ brownies. Tepung membatasi $2x+y\\le12$ dan telur membatasi $x+y\\le8$, dengan $x,y\\ge0$. Keuntungannya $z=4x+3y$ (dalam ribuan rupiah). Berapa keuntungan terbesar?',
        ),
        figure: {
          ...plane(
            [
              solid([[0, 0], [6, 0], [4, 4], [0, 8]], 'a'),
              dot([4, 4], undefined, 'result'),
            ],
            { x: [-1, 9], y: [-1, 9] },
          ),
          caption: L('The allowed region, with corners (0, 0), (6, 0), (4, 4) and (0, 8).', 'Daerah yang diperbolehkan, dengan titik sudut (0, 0), (6, 0), (4, 4), dan (0, 8).'),
        },
        blanks: [{ label: 'z =', answer: 28 }],
        solution: ['(0,0):0 \\quad (6,0):24 \\quad (0,8):24', '(4,4):16+12=28', 'z_{\\max}=28'],
      },
    ],
  },
}
