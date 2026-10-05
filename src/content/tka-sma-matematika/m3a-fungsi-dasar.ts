import type { Submodule } from '../types'
import { L, arrowDiagram, dot, plane } from './figs'

/** Module 3, submodule 1 — functions, linear functions, composite and inverse
 *  functions. */

export const m3s1: Submodule = {
  id: 'tka-sma-m3-s1',
  title: L('Functions, Composites and Inverses', 'Fungsi, Komposisi, dan Invers'),
  summary: L(
    'Understand a function with its domain and range, write the equation of a line, and combine functions as composites and inverses.',
    'Memahami fungsi beserta domain dan rentangnya, menulis persamaan garis, serta menggabungkan fungsi sebagai komposisi dan invers.',
  ),
  lessons: [
    /* ---------------------------------------------------- L1 functions and lines */
    {
      id: 'tka-sma-m3-s1-l1',
      title: L('Functions and Linear Functions', 'Fungsi dan Fungsi Linear'),
      goal: L(
        'You can tell whether a rule is a function, find a domain, and write the equation of a line from two points.',
        'Kamu bisa menentukan apakah suatu aturan adalah fungsi, mencari domain, dan menulis persamaan garis dari dua titik.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: A Rule With One Answer', 'Ayo Amati: Aturan dengan Satu Jawaban'),
          body: L(
            'A **function** is a rule that gives **exactly one** output to each allowed input. The picture shows $f(x)=2x$: the inputs 1, 2, 3 go to 2, 4, 6. Every input has one arrow.\n\n- The set of allowed inputs is the **domain**. The set of outputs actually produced is the **range**.\n- Here the domain is $\\{1,2,3\\}$ and the range is $\\{2,4,6\\}$. The output 8 is not used, so it is not in the range.\n- On a graph, a rule is a function if **every vertical line** meets the graph at most once.\n\nIf one input had two arrows leaving it, the rule would **not** be a function.',
            '**Fungsi** adalah aturan yang memberi **tepat satu** keluaran untuk setiap masukan yang diperbolehkan. Gambar menunjukkan $f(x)=2x$: masukan 1, 2, 3 menuju 2, 4, 6. Setiap masukan punya satu panah.\n\n- Himpunan masukan yang diperbolehkan disebut **domain**. Himpunan keluaran yang benar-benar dihasilkan disebut **rentang** (range).\n- Di sini domainnya $\\{1,2,3\\}$ dan rentangnya $\\{2,4,6\\}$. Keluaran 8 tidak dipakai, jadi tidak termasuk rentang.\n- Pada grafik, sebuah aturan adalah fungsi jika **setiap garis vertikal** memotong grafik paling banyak sekali.\n\nJika satu masukan punya dua panah, aturan itu **bukan** fungsi.',
          ),
          figure: {
            ...arrowDiagram({
              domain: ['1', '2', '3'],
              codomain: ['2', '4', '6', '8'],
              pairs: [[0, 0], [1, 1], [2, 2]],
              titles: ['x', 'f(x)'],
            }),
            caption: L('The function f(x) = 2x on the inputs 1, 2, 3.', 'Fungsi f(x) = 2x pada masukan 1, 2, 3.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: The Equation of a Line', 'Contoh Bertahap: Persamaan Garis'),
          body: L(
            'A **linear function** is $f(x)=mx+c$. Its graph is a line with **gradient** (slope) $m$ and $y$-intercept $c$.\n\nFind the line through $(1,3)$ and $(3,7)$.\n\n1. Step 1: Gradient: $m=\\frac{y_2-y_1}{x_2-x_1}=\\frac{7-3}{3-1}=2$.\n2. Step 2: Use one point in $y=2x+c$: $3=2(1)+c$, so $c=1$.\n3. Step 3: The line is $y=2x+1$. Check with the other point: $2(3)+1=7$.\n\nUseful facts:\n\n- Parallel lines have the **same** gradient.\n- Perpendicular lines have gradients with product $-1$: $2$ and $-\\frac{1}{2}$.\n- A line through $(x_1,y_1)$ with gradient $m$ is $y-y_1=m(x-x_1)$.',
            '**Fungsi linear** adalah $f(x)=mx+c$. Grafiknya garis dengan **gradien** (kemiringan) $m$ dan titik potong sumbu $y$ di $c$.\n\nCari garis melalui $(1,3)$ dan $(3,7)$.\n\n1. Langkah 1: Gradien: $m=\\frac{y_2-y_1}{x_2-x_1}=\\frac{7-3}{3-1}=2$.\n2. Langkah 2: Pakai satu titik di $y=2x+c$: $3=2(1)+c$, jadi $c=1$.\n3. Langkah 3: Garisnya $y=2x+1$. Periksa dengan titik lain: $2(3)+1=7$.\n\nFakta berguna:\n\n- Garis sejajar punya gradien yang **sama**.\n- Garis tegak lurus punya gradien dengan hasil kali $-1$: $2$ dan $-\\frac{1}{2}$.\n- Garis melalui $(x_1,y_1)$ dengan gradien $m$ adalah $y-y_1=m(x-x_1)$.',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: '2*x+1', from: -1.5, to: 4, color: 'a' },
                dot([1, 3], '(1, 3)', 'result'),
                dot([3, 7], '(3, 7)', 'result'),
              ],
              { x: [-3, 6], y: [-3, 9] },
            ),
            caption: L('The line y = 2x + 1 through (1, 3) and (3, 7).', 'Garis y = 2x + 1 melalui (1, 3) dan (3, 7).'),
          },
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Watch Out!: Where a Function Does Not Exist', 'Awas, Jebakan!: Di Mana Fungsi Tidak Ada'),
          body: L(
            'Unless the question says otherwise, the domain is every real number for which the rule makes sense. Two things to avoid:\n\n- **Dividing by zero.** $f(x)=\\frac{1}{x-3}$ is undefined at $x=3$, so the domain is all $x\\neq3$.\n- **Square root of a negative number.** $f(x)=\\sqrt{x-2}$ needs $x-2\\ge0$, so the domain is $x\\ge2$ and the range is $f(x)\\ge0$.\n\nThe graph of $\\sqrt{x-2}$ begins at the red dot $(2,0)$ and goes to the right. Nothing is drawn to the left of $x=2$.\n\n**Remember:** the output of a square root is never negative, so the range of $\\sqrt{x-2}$ is $[0,\\infty)$, not all real numbers.',
            'Kecuali soal menyatakan lain, domain adalah semua bilangan real yang membuat aturan itu bermakna. Dua hal yang harus dihindari:\n\n- **Pembagian dengan nol.** $f(x)=\\frac{1}{x-3}$ tidak terdefinisi di $x=3$, jadi domainnya semua $x\\neq3$.\n- **Akar kuadrat dari bilangan negatif.** $f(x)=\\sqrt{x-2}$ memerlukan $x-2\\ge0$, jadi domainnya $x\\ge2$ dan rentangnya $f(x)\\ge0$.\n\nGrafik $\\sqrt{x-2}$ dimulai dari titik merah $(2,0)$ dan menuju ke kanan. Tidak ada gambar di sebelah kiri $x=2$.\n\n**Ingat:** hasil akar kuadrat tidak pernah negatif, jadi rentang $\\sqrt{x-2}$ adalah $[0,\\infty)$, bukan semua bilangan real.',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: 'sqrt(x-2)', from: 2, to: 8, color: 'a' },
                dot([2, 0], '(2, 0)', 'result'),
              ],
              { x: [-2, 9], y: [-2, 4] },
            ),
            caption: L('The graph of y = √(x - 2) starts at x = 2.', 'Grafik y = √(x - 2) dimulai di x = 2.'),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The line passes through the two red dots $(0,-1)$ and $(2,3)$. Which equation is the line?',
            'Garis melalui dua titik merah $(0,-1)$ dan $(2,3)$. Persamaan manakah yang merupakan garis itu?',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: '2*x-1', from: -1.5, to: 3.5, color: 'a' },
                dot([0, -1], undefined, 'result'),
                dot([2, 3], undefined, 'result'),
              ],
              { x: [-3, 5], y: [-4, 6] },
            ),
            caption: L('A line through two marked points.', 'Sebuah garis melalui dua titik yang ditandai.'),
          },
          options: [L('$y=2x-1$', '$y=2x-1$'), L('$y=2x+1$', '$y=2x+1$'), L('$y=x-1$', '$y=x-1$'), L('$y=-2x-1$', '$y=-2x-1$')],
          answer: 0,
          explain: L(
            'The gradient is $\\frac{3-(-1)}{2-0}=2$ and the line meets the $y$-axis at $-1$, so $y=2x-1$.',
            'Gradiennya $\\frac{3-(-1)}{2-0}=2$ dan garis memotong sumbu $y$ di $-1$, jadi $y=2x-1$.',
          ),
          hint: L(
            'One dot is on the $y$-axis, which gives the intercept. Then find the rise over the run.',
            'Satu titik berada pada sumbu $y$, yang memberi titik potongnya. Lalu cari kenaikan dibagi pergeseran mendatar.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: find the gradient of the line through $(1,3)$ and $(3,7)$.',
            'Coba bersama: cari gradien garis melalui $(1,3)$ dan $(3,7)$.',
          ),
          template: 'm=\\frac{7-3}{3-1}=\\frac{___}{2}=___',
          blanks: ['4', '2'],
          explain: L(
            'The rise is $7-3=4$ and the run is $3-1=2$, so $m=\\frac{4}{2}=2$.',
            'Kenaikannya $7-3=4$ dan pergeseran mendatarnya $3-1=2$, jadi $m=\\frac{4}{2}=2$.',
          ),
          hint: L(
            'Subtract the $y$-values on top and the $x$-values at the bottom, in the same order.',
            'Kurangkan nilai $y$ di atas dan nilai $x$ di bawah, dengan urutan yang sama.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements about $f(x)=\\frac{1}{x-3}$.', 'Pilih DUA pernyataan yang benar tentang $f(x)=\\frac{1}{x-3}$.'),
          options: [
            L('$x=3$ is not in the domain.', '$x=3$ tidak termasuk domain.'),
            L('$f(4)=1$.', '$f(4)=1$.'),
            L('$f(2)=1$.', '$f(2)=1$.'),
            L('$f(x)=0$ for some $x$.', '$f(x)=0$ untuk suatu $x$.'),
          ],
          answer: [0, 1],
          explain: L(
            'At $x=3$ the denominator is 0. $f(4)=\\frac{1}{1}=1$, but $f(2)=\\frac{1}{-1}=-1$. A fraction with numerator 1 is never 0.',
            'Di $x=3$ penyebutnya 0. $f(4)=\\frac{1}{1}=1$, tetapi $f(2)=\\frac{1}{-1}=-1$. Pecahan dengan pembilang 1 tidak pernah bernilai 0.',
          ),
          hint: L(
            'Put the numbers in and see what happens to the denominator.',
            'Masukkan bilangannya dan lihat apa yang terjadi pada penyebutnya.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('In a function, each input has exactly one output.', 'Pada fungsi, setiap masukan punya tepat satu keluaran.'),
            L('A vertical line can cross the graph of a function in two points.', 'Garis vertikal dapat memotong grafik fungsi di dua titik.'),
            L('Lines with gradients $2$ and $-\\frac{1}{2}$ are perpendicular.', 'Garis dengan gradien $2$ dan $-\\frac{1}{2}$ saling tegak lurus.'),
            L('The lines $y=3x+1$ and $y=3x-4$ meet at one point.', 'Garis $y=3x+1$ dan $y=3x-4$ bertemu di satu titik.'),
          ],
          answer: [true, false, true, false],
          explain: L(
            'That is the definition of a function, so a vertical line meets its graph at most once. $2\\times(-\\frac{1}{2})=-1$, so those lines are perpendicular. And equal gradients mean the lines are parallel, so they never meet.',
            'Itulah definisi fungsi, jadi garis vertikal memotong grafiknya paling banyak sekali. $2\\times(-\\frac{1}{2})=-1$, jadi garis-garis itu tegak lurus. Dan gradien yang sama berarti garis sejajar, sehingga tidak pernah bertemu.',
          ),
          hint: L(
            'For the last one, compare the two gradients.',
            'Untuk yang terakhir, bandingkan kedua gradiennya.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'The line through $(1,3)$ and $(a,9)$ has gradient 2. Find $a$.',
            'Garis melalui $(1,3)$ dan $(a,9)$ memiliki gradien 2. Tentukan $a$.',
          ),
          blanks: [{ label: 'a =', answer: 4 }],
          hints: [
            L('Write the gradient formula with the two points: $\\frac{9-3}{a-1}=2$.', 'Tulis rumus gradien dengan kedua titik: $\\frac{9-3}{a-1}=2$.'),
            L('So $\\frac{6}{a-1}=2$.', 'Jadi $\\frac{6}{a-1}=2$.'),
            L('Multiply both sides by $a-1$, then divide by 2.', 'Kalikan kedua ruas dengan $a-1$, lalu bagi 2.'),
          ],
          explain: L(
            '$6=2(a-1)$ gives $a-1=3$, so $a=4$. The point is $(4,9)$.',
            '$6=2(a-1)$ memberi $a-1=3$, jadi $a=4$. Titiknya $(4,9)$.',
          ),
          solution: ['\\frac{9-3}{a-1}=2', '6=2(a-1) \\Rightarrow a-1=3', 'a=4'],
        },
      ],
    },
    /* ---------------------------------------------- L2 composite and inverse */
    {
      id: 'tka-sma-m3-s1-l2',
      title: L('Composite and Inverse Functions', 'Fungsi Komposisi dan Invers'),
      goal: L(
        'You can combine two functions, find an inverse function, and use the fact that the inverse undoes the function.',
        'Kamu bisa menggabungkan dua fungsi, mencari fungsi invers, dan memakai fakta bahwa invers membatalkan fungsi.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Two Machines in a Row', 'Ayo Amati: Dua Mesin Berurutan'),
          body: L(
            'Let $f(x)=2x+1$ and $g(x)=x^2$. Feed a number to $g$ first, then feed that result to $f$. The result is a new function, the **composite** $f\\circ g$:\n\n$$(f\\circ g)(x)=f(g(x))=f(x^2)=2x^2+1$$\n\nThe other order gives a different function: $(g\\circ f)(x)=g(2x+1)=(2x+1)^2$.\n\n- Read $f(g(x))$ from the inside out: first $g$, then $f$.\n- Order matters. In the picture the green curve is $2x^2+1$ and the orange curve is $(2x+1)^2$: they are different.\n- Numbers check: $(f\\circ g)(2)=f(4)=9$ and $(g\\circ f)(2)=g(5)=25$.',
            'Misalkan $f(x)=2x+1$ dan $g(x)=x^2$. Masukkan bilangan ke $g$ lebih dulu, lalu hasilnya ke $f$. Hasilnya fungsi baru, yaitu **komposisi** $f\\circ g$:\n\n$$(f\\circ g)(x)=f(g(x))=f(x^2)=2x^2+1$$\n\nUrutan sebaliknya memberi fungsi yang berbeda: $(g\\circ f)(x)=g(2x+1)=(2x+1)^2$.\n\n- Baca $f(g(x))$ dari dalam ke luar: pertama $g$, lalu $f$.\n- Urutan berpengaruh. Pada gambar, kurva hijau adalah $2x^2+1$ dan kurva oranye adalah $(2x+1)^2$: keduanya berbeda.\n- Cek bilangan: $(f\\circ g)(2)=f(4)=9$ dan $(g\\circ f)(2)=g(5)=25$.',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: '2*x^2+1', from: -2.2, to: 2.2, color: 'a' },
                { t: 'curve', f: '(2*x+1)^2', from: -2.2, to: 1.6, color: 'b' },
              ],
              { x: [-3, 3], y: [-2, 12] },
            ),
            caption: L('f∘g (green) and g∘f (orange) are different curves.', 'f∘g (hijau) dan g∘f (oranye) adalah kurva yang berbeda.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Finding an Inverse', 'Contoh Bertahap: Mencari Invers'),
          body: L(
            'The **inverse** $f^{-1}$ undoes $f$: if $f(a)=b$ then $f^{-1}(b)=a$.\n\nFind the inverse of $f(x)=2x+1$.\n\n1. Step 1: Write $y=2x+1$.\n2. Step 2: Solve for $x$: $y-1=2x$, so $x=\\frac{y-1}{2}$.\n3. Step 3: Swap the names: $f^{-1}(x)=\\frac{x-1}{2}$.\n4. Step 4: Check: $f(3)=7$ and $f^{-1}(7)=\\frac{7-1}{2}=3$. It comes back.\n\nThe graph of $f^{-1}$ is the graph of $f$ **reflected in the line** $y=x$. In the picture the green line is $f$, the orange line is $f^{-1}$, and the dashed line is $y=x$.',
            '**Invers** $f^{-1}$ membatalkan $f$: jika $f(a)=b$ maka $f^{-1}(b)=a$.\n\nCari invers dari $f(x)=2x+1$.\n\n1. Langkah 1: Tulis $y=2x+1$.\n2. Langkah 2: Selesaikan untuk $x$: $y-1=2x$, jadi $x=\\frac{y-1}{2}$.\n3. Langkah 3: Tukar namanya: $f^{-1}(x)=\\frac{x-1}{2}$.\n4. Langkah 4: Periksa: $f(3)=7$ dan $f^{-1}(7)=\\frac{7-1}{2}=3$. Kembali lagi.\n\nGrafik $f^{-1}$ adalah grafik $f$ yang **dicerminkan terhadap garis** $y=x$. Pada gambar, garis hijau adalah $f$, garis oranye adalah $f^{-1}$, dan garis putus-putus adalah $y=x$.',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: '2*x+1', from: -2.5, to: 3.5, color: 'a' },
                { t: 'curve', f: '(x-1)/2', from: -4, to: 8, color: 'b' },
                { t: 'curve', f: 'x', from: -4, to: 8, color: 'muted', dashed: true },
              ],
              { x: [-4, 8], y: [-4, 8] },
            ),
            caption: L('f and its inverse mirror each other in y = x.', 'f dan inversnya saling mencerminkan pada y = x.'),
          },
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Watch Out!: When Is There an Inverse?', 'Awas, Jebakan!: Kapan Ada Invers?'),
          body: L(
            'An inverse exists only when every output comes from **exactly one** input (the function is **one-to-one**). Test with a **horizontal** line: it must meet the graph at most once.\n\n- $f(x)=x^2$ on all real numbers has no inverse function: $f(2)=f(-2)=4$, and the horizontal line $y=4$ meets the parabola twice. Restrict to $x\\ge0$ and the inverse is $\\sqrt{x}$.\n- Rational example: $f(x)=\\frac{2x+1}{x-3}$. From $y(x-3)=2x+1$ we get $xy-3y=2x+1$, so $x(y-2)=3y+1$ and $f^{-1}(x)=\\frac{3x+1}{x-2}$.\n- For a composite, the inverse reverses the order: $(f\\circ g)^{-1}=g^{-1}\\circ f^{-1}$, like taking off socks and shoes in the opposite order to putting them on.',
            'Invers ada hanya jika setiap keluaran berasal dari **tepat satu** masukan (fungsinya **satu-satu**). Ujilah dengan garis **horizontal**: garis itu harus memotong grafik paling banyak sekali.\n\n- $f(x)=x^2$ pada semua bilangan real tidak punya fungsi invers: $f(2)=f(-2)=4$, dan garis horizontal $y=4$ memotong parabola dua kali. Batasi ke $x\\ge0$ dan inversnya adalah $\\sqrt{x}$.\n- Contoh pecahan: $f(x)=\\frac{2x+1}{x-3}$. Dari $y(x-3)=2x+1$ diperoleh $xy-3y=2x+1$, jadi $x(y-2)=3y+1$ dan $f^{-1}(x)=\\frac{3x+1}{x-2}$.\n- Untuk komposisi, invers membalik urutan: $(f\\circ g)^{-1}=g^{-1}\\circ f^{-1}$, seperti melepas kaus kaki dan sepatu dalam urutan kebalikan saat memakainya.',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: 'x^2', from: -3, to: 3, color: 'a' },
                { t: 'hline', y: 4, color: 'result', dashed: true },
                dot([-2, 4], undefined, 'result'),
                dot([2, 4], undefined, 'result'),
              ],
              { x: [-4, 4], y: [-2, 10] },
            ),
            caption: L('The line y = 4 meets the parabola twice, so x² has no inverse on all reals.', 'Garis y = 4 memotong parabola dua kali, jadi x² tidak punya invers pada semua bilangan real.'),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The graph shows $f(x)=3x-2$. The red dot is $(3,7)$. What is $f^{-1}(7)$?',
            'Grafik menunjukkan $f(x)=3x-2$. Titik merah adalah $(3,7)$. Berapa $f^{-1}(7)$?',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: '3*x-2', from: -1, to: 4, color: 'a' },
                dot([3, 7], '(3, 7)', 'result'),
              ],
              { x: [-3, 6], y: [-6, 10] },
            ),
            caption: L('The graph of f(x) = 3x - 2.', 'Grafik f(x) = 3x - 2.'),
          },
          options: [L('3', '3'), L('7', '7'), L('19', '19'), L('$\\frac{1}{3}$', '$\\frac{1}{3}$')],
          answer: 0,
          explain: L(
            '$f(3)=7$, so the inverse sends 7 back to 3: $f^{-1}(7)=3$. Reading the graph backwards: from height 7, go to $x=3$.',
            '$f(3)=7$, jadi invers mengembalikan 7 ke 3: $f^{-1}(7)=3$. Membaca grafik terbalik: dari tinggi 7, pergi ke $x=3$.',
          ),
          hint: L(
            'The inverse swaps input and output. Which coordinate of the dot becomes the answer?',
            'Invers menukar masukan dan keluaran. Koordinat titik yang mana menjadi jawabannya?',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: find the inverse of $y=2x+1$ by solving for $x$.',
            'Coba bersama: cari invers $y=2x+1$ dengan menyelesaikan untuk $x$.',
          ),
          template: 'x=\\frac{y-___}{___}',
          blanks: ['1', '2'],
          explain: L(
            'Subtract 1 from both sides, then divide by 2: $x=\\frac{y-1}{2}$.',
            'Kurangkan 1 dari kedua ruas, lalu bagi 2: $x=\\frac{y-1}{2}$.',
          ),
          hint: L(
            'Undo the operations in the reverse order: the last one done to $x$ was +1.',
            'Batalkan operasinya dengan urutan terbalik: operasi terakhir pada $x$ adalah +1.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L(
            'Let $f(x)=2x+1$ and $g(x)=x^2$. Choose the TWO true statements.',
            'Misalkan $f(x)=2x+1$ dan $g(x)=x^2$. Pilih DUA pernyataan yang benar.',
          ),
          options: [
            L('$(f\\circ g)(1)=3$', '$(f\\circ g)(1)=3$'),
            L('$(g\\circ f)(1)=9$', '$(g\\circ f)(1)=9$'),
            L('$(f\\circ g)(2)=25$', '$(f\\circ g)(2)=25$'),
            L('$f^{-1}(5)=3$', '$f^{-1}(5)=3$'),
          ],
          answer: [0, 1],
          explain: L(
            '$(f\\circ g)(1)=f(1)=3$ and $(g\\circ f)(1)=g(3)=9$. But $(f\\circ g)(2)=f(4)=9$, not 25, and $f^{-1}(5)=2$ because $f(2)=5$.',
            '$(f\\circ g)(1)=f(1)=3$ dan $(g\\circ f)(1)=g(3)=9$. Namun $(f\\circ g)(2)=f(4)=9$, bukan 25, dan $f^{-1}(5)=2$ karena $f(2)=5$.',
          ),
          hint: L(
            'Work from the inside out: in $f\\circ g$ the function $g$ acts first.',
            'Kerjakan dari dalam ke luar: pada $f\\circ g$ fungsi $g$ bekerja lebih dulu.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('$(f\\circ g)(x)=(g\\circ f)(x)$ for every pair of functions.', '$(f\\circ g)(x)=(g\\circ f)(x)$ untuk setiap pasangan fungsi.'),
            L('If $f(a)=b$, then $f^{-1}(b)=a$.', 'Jika $f(a)=b$, maka $f^{-1}(b)=a$.'),
            L('$f(x)=x^2$ has an inverse function on all real numbers.', '$f(x)=x^2$ punya fungsi invers pada semua bilangan real.'),
            L('The graph of $f^{-1}$ is the reflection of the graph of $f$ in $y=x$.', 'Grafik $f^{-1}$ adalah pencerminan grafik $f$ terhadap $y=x$.'),
          ],
          answer: [false, true, false, true],
          explain: L(
            'Order matters: $2x^2+1\\neq(2x+1)^2$. The inverse undoes $f$. And $x^2$ is not one-to-one on all reals since $f(2)=f(-2)$.',
            'Urutan berpengaruh: $2x^2+1\\neq(2x+1)^2$. Invers membatalkan $f$. Dan $x^2$ tidak satu-satu pada semua bilangan real karena $f(2)=f(-2)$.',
          ),
          hint: L(
            'For the third statement, find two different inputs that give the same output.',
            'Untuk pernyataan ketiga, cari dua masukan berbeda yang memberi keluaran sama.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'Let $f(x)=2x-3$ and $g(x)=x+4$. Find $(f\\circ g)^{-1}(7)$, that is, the $x$ with $(f\\circ g)(x)=7$.',
            'Misalkan $f(x)=2x-3$ dan $g(x)=x+4$. Tentukan $(f\\circ g)^{-1}(7)$, yaitu $x$ dengan $(f\\circ g)(x)=7$.',
          ),
          blanks: [{ answer: 1 }],
          hints: [
            L('First find the formula for $(f\\circ g)(x)=f(g(x))$.', 'Cari dulu rumus $(f\\circ g)(x)=f(g(x))$.'),
            L('$f(g(x))=2(x+4)-3=2x+5$.', '$f(g(x))=2(x+4)-3=2x+5$.'),
            L('The inverse of 7 is the $x$ for which $2x+5=7$.', 'Invers dari 7 adalah $x$ yang membuat $2x+5=7$.'),
          ],
          explain: L(
            '$(f\\circ g)(x)=2x+5$. Setting $2x+5=7$ gives $x=1$. Check: $g(1)=5$ and $f(5)=7$.',
            '$(f\\circ g)(x)=2x+5$. Menetapkan $2x+5=7$ memberi $x=1$. Periksa: $g(1)=5$ dan $f(5)=7$.',
          ),
          solution: ['(f\\circ g)(x)=2(x+4)-3=2x+5', '2x+5=7', 'x=1'],
        },
      ],
    },
  ],
  project: {
    id: 'tka-sma-m3-s1-p',
    runtime: 'math',
    title: L('Functions at Work', 'Fungsi dalam Pemakaian'),
    brief: L(
      'Find the equation of a line, a domain, a composite value and an inverse value.',
      'Cari persamaan garis, domain, nilai komposisi, dan nilai invers.',
    ),
    requirements: [
      L('Work with gradients and the equation of a line.', 'Bekerja dengan gradien dan persamaan garis.'),
      L('Use composite and inverse functions.', 'Memakai fungsi komposisi dan invers.'),
    ],
    hints: [
      L('Gradient = rise over run. Then use one point to find the intercept.', 'Gradien = kenaikan dibagi pergeseran mendatar. Lalu pakai satu titik untuk mencari titik potong.'),
      L('For a domain: no division by zero, and nothing negative under a square root.', 'Untuk domain: tidak boleh bagi nol, dan tidak boleh ada yang negatif di bawah akar.'),
      L('For an inverse, solve $y=f(x)$ for $x$.', 'Untuk invers, selesaikan $y=f(x)$ untuk $x$.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L(
          'Find the line $y=mx+c$ through $(2,5)$ and $(4,11)$.',
          'Cari garis $y=mx+c$ yang melalui $(2,5)$ dan $(4,11)$.',
        ),
        inline: true,
        blanks: [
          { label: 'm =', answer: 3 },
          { label: 'c =', answer: -1 },
        ],
        solution: ['m=\\frac{11-5}{4-2}=3', '5=3(2)+c \\Rightarrow c=-1'],
      },
      {
        prompt: L(
          'What is the smallest integer in the domain of $f(x)=\\sqrt{2x-6}$?',
          'Berapa bilangan bulat terkecil dalam domain $f(x)=\\sqrt{2x-6}$?',
        ),
        blanks: [{ answer: 3 }],
        solution: ['2x-6\\ge0', 'x\\ge3', '3'],
      },
      {
        prompt: L(
          'Let $f(x)=x+2$ and $g(x)=3x$. Find $(f\\circ g)(4)$.',
          'Misalkan $f(x)=x+2$ dan $g(x)=3x$. Tentukan $(f\\circ g)(4)$.',
        ),
        blanks: [{ answer: 14 }],
        solution: ['g(4)=12', 'f(12)=14'],
      },
      {
        prompt: L(
          'Let $f(x)=\\frac{2x+1}{x-3}$. Its inverse is $f^{-1}(x)=\\frac{3x+1}{x-2}$. Find $f^{-1}(3)$.',
          'Misalkan $f(x)=\\frac{2x+1}{x-3}$. Inversnya $f^{-1}(x)=\\frac{3x+1}{x-2}$. Tentukan $f^{-1}(3)$.',
        ),
        blanks: [{ answer: 10 }],
        solution: ['f^{-1}(3)=\\frac{3(3)+1}{3-2}=10', 'f(10)=\\frac{21}{7}=3'],
      },
      {
        prompt: L(
          'Let $f(x)=3x+1$ and $g(x)=x^2$. Find the two values of $x$ with $(f\\circ g)(x)=(g\\circ f)(x)$. Give the smaller one first.',
          'Misalkan $f(x)=3x+1$ dan $g(x)=x^2$. Tentukan dua nilai $x$ dengan $(f\\circ g)(x)=(g\\circ f)(x)$. Tulis yang lebih kecil lebih dulu.',
        ),
        inline: true,
        blanks: [
          { label: { en: '\\text{smaller } x =', id: '\\text{yang kecil } x =' }, answer: -1 },
          { label: { en: '\\text{larger } x =', id: '\\text{yang besar } x =' }, answer: 0 },
        ],
        solution: {
          en: ['3x^2+1=(3x+1)^2=9x^2+6x+1', '6x^2+6x=0 \\Rightarrow 6x(x+1)=0', 'x=-1 \\text{ or } x=0'],
          id: ['3x^2+1=(3x+1)^2=9x^2+6x+1', '6x^2+6x=0 \\Rightarrow 6x(x+1)=0', 'x=-1 \\text{ atau } x=0'],
        },
      },
    ],
  },
}
