import type { Module } from '../types'

/** Module 1 — a curve as the path of a moving point. Two halves: describing
 *  curves that way (lines, circles, ellipses, cycloids, and what changes when
 *  the same path is walked differently), then carrying slopes, area and arc
 *  length over from y = f(x) by the chain rule and substitution. */
export const module1: Module = {
  id: 'par-m1',
  title: { en: 'Parametric Curves', id: 'Kurva Parametrik' },
  summary: {
    en: 'Describing a curve as the path of a moving point, then carrying slopes, areas, and lengths over from y = f(x) to curves given by a parameter.',
    id: 'Melukiskan kurva sebagai lintasan sebuah titik yang bergerak, lalu membawa kemiringan, luas, dan panjang dari y = f(x) ke kurva yang diberikan oleh sebuah parameter.',
  },
  submodules: [
    /* ------------------------------------------------ 10.1 parametrizations of plane curves */
    {
      id: 'par-m1-s1',
      title: { en: 'Describing a Curve by a Moving Point', id: 'Melukiskan Kurva dengan Titik yang Bergerak' },
      summary: {
        en: 'A parametrization says where a point is, which way it is heading, and how fast. Lines, circles, ellipses, and cycloids all come out of that one idea.',
        id: 'Sebuah parametrisasi menyatakan di mana sebuah titik berada, ke mana ia menuju, dan seberapa cepat. Garis, lingkaran, elips, dan sikloid semuanya lahir dari satu gagasan itu.',
      },
      lessons: [
        {
          id: 'par-m1-s1-l1',
          title: { en: 'A Point in Motion', id: 'Titik yang Bergerak' },
          goal: {
            en: 'Read a parametrization as a moving point, eliminate the parameter to find the curve, and see how the range of t decides how much of it is drawn.',
            id: 'Membaca parametrisasi sebagai titik yang bergerak, menghilangkan parameter untuk menemukan kurvanya, dan melihat bagaimana rentang t menentukan seberapa banyak yang tergambar.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The curve is the path, the parametrization is the trip', id: 'Kurva adalah lintasan, parametrisasi adalah perjalanannya' },
              body: {
                en: 'Instead of writing $y=f(x)$, give the position of a moving point as two functions of a third variable $t$, usually thought of as time:\n$$x=x(t),\\qquad y=y(t),\\qquad \\alpha\\le t\\le\\beta$$\nAs $t$ runs from $\\alpha$ to $\\beta$, the point $(x(t),y(t))$ traces out a curve.\n\nThe curve itself is only the path. The parametrization knows more: **which way** the point travels, **how fast**, and **where it starts**. Two different parametrizations can draw exactly the same path.\n\nThe parabola $y=x^2$ is the simplest case. With $x=t$ and $y=t^2$, the point is at $(-2,4)$ when $t=-2$, at the origin when $t=0$, and at $(2,4)$ when $t=2$. Drag $s$ below to watch it run along the parabola from left to right.',
                id: 'Alih-alih menulis $y=f(x)$, berikan posisi sebuah titik yang bergerak sebagai dua fungsi dari variabel ketiga $t$, yang biasanya dipikirkan sebagai waktu:\n$$x=x(t),\\qquad y=y(t),\\qquad \\alpha\\le t\\le\\beta$$\nSaat $t$ berjalan dari $\\alpha$ ke $\\beta$, titik $(x(t),y(t))$ menggambar sebuah kurva.\n\nKurva itu sendiri hanyalah lintasan. Parametrisasi tahu lebih banyak: **ke arah mana** titik itu bergerak, **seberapa cepat**, dan **dari mana ia mulai**. Dua parametrisasi yang berbeda bisa menggambar lintasan yang persis sama.\n\nParabola $y=x^2$ adalah kasus paling sederhana. Dengan $x=t$ dan $y=t^2$, titiknya ada di $(-2,4)$ saat $t=-2$, di titik asal saat $t=0$, dan di $(2,4)$ saat $t=2$. Geser $s$ di bawah untuk melihatnya berlari sepanjang parabola dari kiri ke kanan.',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 3],
                ySpan: [-1, 5],
                ticks: true,
                params: [{ name: 's', min: -2, max: 2, step: 0.1, value: 1, label: 's' }],
                items: [
                  { t: 'param', x: 't', y: 't^2', from: -2, to: 2, color: 'muted', dashed: true },
                  { t: 'param', x: 't', y: 't^2', from: -2, to: 's', color: 'a' },
                  { t: 'dot', x: 's', y: 's^2', color: 'b', label: 'P' },
                ],
                caption: {
                  en: 'Drag $s$ to move the end of the traced part: the solid curve is the path covered for $-2\\le t\\le s$, and the dot $P$ is where the point is at time $t=s$. The dashed parabola is the whole path for $-2\\le t\\le 2$.',
                  id: 'Geser $s$ untuk memindahkan ujung bagian yang tergambar: kurva tebal adalah lintasan yang sudah ditempuh untuk $-2\\le t\\le s$, dan titik $P$ adalah posisi titik pada waktu $t=s$. Parabola putus-putus adalah seluruh lintasan untuk $-2\\le t\\le 2$.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Eliminating the parameter, and cutting the range', id: 'Menghilangkan parameter, dan memotong rentangnya' },
              body: {
                en: 'To see which curve a parametrization draws, **eliminate the parameter**: solve one equation for $t$ and substitute into the other, or combine the two so that $t$ cancels.\n\n- $x=t,\\ y=t^2$: substituting gives $y=x^2$, a parabola.\n- $x=\\cos t,\\ y=\\sin t$: since $\\cos^2t+\\sin^2t=1$, we get $x^2+y^2=1$, the unit circle.\n\nElimination returns the curve but never the trip, and the range of $t$ decides how much of it is actually drawn. With $x=\\cos t,\\ y=\\sin t$, the range $0\\le t\\le 2\\pi$ draws the whole circle, but $0\\le t\\le\\pi$ draws only the upper half, because $y=\\sin t\\ge 0$ there.\n\nIn the same way, $x=t,\\ y=t^2$ with $t\\ge 0$ is only the right half of $y=x^2$.',
                id: 'Untuk melihat kurva mana yang digambar sebuah parametrisasi, **hilangkan parameternya**: selesaikan satu persamaan untuk $t$ lalu substitusikan ke persamaan yang lain, atau gabungkan keduanya sehingga $t$ saling meniadakan.\n\n- $x=t,\\ y=t^2$: substitusi memberi $y=x^2$, sebuah parabola.\n- $x=\\cos t,\\ y=\\sin t$: karena $\\cos^2t+\\sin^2t=1$, kita dapat $x^2+y^2=1$, lingkaran satuan.\n\nPenghilangan parameter mengembalikan kurvanya tetapi tidak pernah perjalanannya, dan rentang $t$ menentukan seberapa banyak yang benar-benar tergambar. Dengan $x=\\cos t,\\ y=\\sin t$, rentang $0\\le t\\le 2\\pi$ menggambar seluruh lingkaran, tetapi $0\\le t\\le\\pi$ hanya menggambar setengah atasnya, karena di situ $y=\\sin t\\ge 0$.\n\nDengan cara yang sama, $x=t,\\ y=t^2$ dengan $t\\ge 0$ hanyalah setengah kanan dari $y=x^2$.',
              },
              figure: {
                dim: 2,
                xSpan: [-1.5, 1.5],
                ySpan: [-1.5, 1.5],
                ticks: true,
                params: [{ name: 's', min: 0, max: 6.28, step: 0.05, value: 3.14, label: 's' }],
                items: [
                  { t: 'param', x: 'cos(t)', y: 'sin(t)', from: 0, to: 6.2832, color: 'muted', dashed: true },
                  { t: 'param', x: 'cos(t)', y: 'sin(t)', from: 0, to: 's', color: 'a' },
                  { t: 'dot', x: 1, y: 0, color: 'muted', label: 'start' },
                  { t: 'dot', x: 'cos(s)', y: 'sin(s)', color: 'b', label: 'P' },
                ],
                caption: {
                  en: 'Drag $s$: the solid arc is $x=\\cos t,\\ y=\\sin t$ for $0\\le t\\le s$. At $s=\\pi$ (about $3.14$) it is exactly the upper half circle, and only at $s=2\\pi$ is the whole circle drawn.',
                  id: 'Geser $s$: busur tebal adalah $x=\\cos t,\\ y=\\sin t$ untuk $0\\le t\\le s$. Pada $s=\\pi$ (sekitar $3{,}14$) ia tepat setengah lingkaran atas, dan hanya pada $s=2\\pi$ seluruh lingkaran tergambar.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Eliminate $t$ from $x=2t,\\ y=4t^2$. Which equation do you get?',
                id: 'Hilangkan $t$ dari $x=2t,\\ y=4t^2$. Persamaan mana yang kamu dapat?',
              },
              options: [
                { en: '$y=x^2$', id: '$y=x^2$' },
                { en: '$y=2x^2$', id: '$y=2x^2$' },
                { en: '$y=4x^2$', id: '$y=4x^2$' },
                { en: '$y=\\dfrac{x^2}{4}$', id: '$y=\\dfrac{x^2}{4}$' },
              ],
              answer: 0,
              explain: {
                en: 'From $x=2t$ we get $t=x/2$, so $y=4t^2=4\\left(\\dfrac x2\\right)^2=x^2$.',
                id: 'Dari $x=2t$ kita dapat $t=x/2$, sehingga $y=4t^2=4\\left(\\dfrac x2\\right)^2=x^2$.',
              },
              hint: {
                en: 'Solve the first equation for $t$, put that into the second one, and simplify carefully — the square applies to the 2 as well.',
                id: 'Selesaikan persamaan pertama untuk $t$, masukkan ke persamaan kedua, lalu sederhanakan dengan teliti — kuadratnya berlaku juga untuk angka 2.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'The solid arc in the figure is part of $x=3\\cos t,\\ y=3\\sin t$. It runs from the dot at $(3,0)$ to the dot at $(0,3)$. Which range of $t$ draws exactly this arc?',
                id: 'Busur tebal pada gambar adalah bagian dari $x=3\\cos t,\\ y=3\\sin t$. Ia berjalan dari titik di $(3,0)$ ke titik di $(0,3)$. Rentang $t$ mana yang menggambar persis busur ini?',
              },
              figure: {
                dim: 2,
                xSpan: [-4, 4],
                ySpan: [-4, 4],
                ticks: true,
                items: [
                  { t: 'param', x: '3cos(t)', y: '3sin(t)', from: 0, to: 6.2832, color: 'muted', dashed: true },
                  { t: 'param', x: '3cos(t)', y: '3sin(t)', from: 0, to: 1.5708, color: 'a' },
                  { t: 'dot', x: 3, y: 0, color: 'b', label: 'A' },
                  { t: 'dot', x: 0, y: 3, color: 'b', label: 'B' },
                ],
              },
              options: [
                { en: '$0\\le t\\le \\dfrac{\\pi}{2}$', id: '$0\\le t\\le \\dfrac{\\pi}{2}$' },
                { en: '$0\\le t\\le \\pi$', id: '$0\\le t\\le \\pi$' },
                { en: '$\\dfrac{\\pi}{2}\\le t\\le \\pi$', id: '$\\dfrac{\\pi}{2}\\le t\\le \\pi$' },
                { en: '$0\\le t\\le 2\\pi$', id: '$0\\le t\\le 2\\pi$' },
              ],
              answer: 0,
              explain: {
                en: 'At $t=0$ the point is $(3,0)$, and at $t=\\pi/2$ it is $(0,3)$. In between, both coordinates are positive, which is exactly the arc in the first quadrant.',
                id: 'Pada $t=0$ titiknya $(3,0)$, dan pada $t=\\pi/2$ titiknya $(0,3)$. Di antaranya kedua koordinat positif, dan itu persis busur di kuadran pertama.',
              },
              hint: {
                en: 'Evaluate $(3\\cos t,\\ 3\\sin t)$ for a few values of $t$ to find which value gives the starting dot and which gives the ending dot.',
                id: 'Hitung $(3\\cos t,\\ 3\\sin t)$ untuk beberapa nilai $t$ untuk menemukan nilai mana yang memberi titik awal dan mana yang memberi titik akhir.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the elimination for $x=3\\cos t,\\ y=3\\sin t$.',
                id: 'Lengkapi penghilangan parameter untuk $x=3\\cos t,\\ y=3\\sin t$.',
              },
              template: 'x^2+y^2=9\\cos^2 t+9\\sin^2 t=___',
              blanks: ['9'],
              explain: {
                en: '$9(\\cos^2t+\\sin^2t)=9\\cdot 1=9$, so $x^2+y^2=9$: a circle of radius $3$.',
                id: '$9(\\cos^2t+\\sin^2t)=9\\cdot 1=9$, sehingga $x^2+y^2=9$: lingkaran berjari-jari $3$.',
              },
              hint: {
                en: 'Factor the common coefficient out of both terms. What is left inside the bracket is an identity you know.',
                id: 'Faktorkan koefisien persekutuan dari kedua suku. Yang tersisa di dalam kurung adalah identitas yang kamu kenal.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'A point moves with $x=2t,\\ y=t^2-1$. Find its position at $t=3$. Then use the eliminated equation $y=\\dfrac{x^2}{4}-1$ to find $y$ where $x=10$.',
                id: 'Sebuah titik bergerak dengan $x=2t,\\ y=t^2-1$. Cari posisinya pada $t=3$. Lalu pakai persamaan hasil eliminasi $y=\\dfrac{x^2}{4}-1$ untuk mencari $y$ di mana $x=10$.',
              },
              blanks: [
                { label: 'x(3) =', answer: 6 },
                { label: 'y(3) =', answer: 8 },
                { label: 'y\\big|_{x=10} =', answer: 24 },
              ],
              hints: [
                { en: 'Substitute $t=3$ into both formulas.', id: 'Substitusikan $t=3$ ke kedua rumus.' },
                { en: 'For the last box, put $x=10$ into $\\frac{x^2}{4}-1$.', id: 'Untuk kotak terakhir, masukkan $x=10$ ke $\\frac{x^2}{4}-1$.' },
              ],
              explain: {
                en: 'At $t=3$: $(x,y)=(6,\\,8)$. At $x=10$ (that is $t=5$): $y=\\dfrac{100}{4}-1=24$, the same as $5^2-1$.',
                id: 'Pada $t=3$: $(x,y)=(6,\\,8)$. Di $x=10$ (yaitu $t=5$): $y=\\dfrac{100}{4}-1=24$, sama dengan $5^2-1$.',
              },
            },
          ],
        },
        {
          id: 'par-m1-s1-l2',
          title: { en: 'Lines, Circles, Ellipses and Cycloids', id: 'Garis, Lingkaran, Elips, dan Sikloid' },
          goal: {
            en: 'Write standard parametrizations of lines, circles, and ellipses, change speed and direction without changing the path, and build the cycloid.',
            id: 'Menuliskan parametrisasi baku garis, lingkaran, dan elips, mengubah kelajuan dan arah tanpa mengubah lintasan, serta membangun sikloid.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Three standard parametrizations', id: 'Tiga parametrisasi baku' },
              body: {
                en: 'Three curves come up again and again, and each has a parametrization worth knowing by heart.\n\n| Curve | Parametrization | Eliminated form |\n|---|---|---|\n| Line through $(x_0,y_0)$ and $(x_1,y_1)$ | $x=x_0+(x_1-x_0)t,\\ y=y_0+(y_1-y_0)t$ | $\\dfrac{x-x_0}{x_1-x_0}=\\dfrac{y-y_0}{y_1-y_0}$ |\n| Circle of radius $a$ | $x=a\\cos t,\\ y=a\\sin t$ | $x^2+y^2=a^2$ |\n| Ellipse with semi-axes $a,b$ | $x=a\\cos t,\\ y=b\\sin t$ | $\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}=1$ |\n\nOn the line, $t=0$ is the first point and $t=1$ the second, so $0\\le t\\le 1$ is just the segment between them. For the circle and the ellipse, $0\\le t\\le 2\\pi$ goes once around counterclockwise, starting at $(a,0)$.\n\nThe path does not determine the parametrization. For the unit circle:\n\n- $x=\\cos 2t,\\ y=\\sin 2t$ is the same circle traced twice as fast.\n- $x=\\cos t,\\ y=-\\sin t$ is the same circle traced clockwise.\n- $x=\\cos(t+\\pi/2),\\ y=\\sin(t+\\pi/2)$ starts at $(0,1)$ instead of $(1,0)$.',
                id: 'Tiga kurva muncul berulang kali, dan masing-masing punya parametrisasi yang layak dihafal.\n\n| Kurva | Parametrisasi | Bentuk tereliminasi |\n|---|---|---|\n| Garis melalui $(x_0,y_0)$ dan $(x_1,y_1)$ | $x=x_0+(x_1-x_0)t,\\ y=y_0+(y_1-y_0)t$ | $\\dfrac{x-x_0}{x_1-x_0}=\\dfrac{y-y_0}{y_1-y_0}$ |\n| Lingkaran berjari-jari $a$ | $x=a\\cos t,\\ y=a\\sin t$ | $x^2+y^2=a^2$ |\n| Elips dengan setengah sumbu $a,b$ | $x=a\\cos t,\\ y=b\\sin t$ | $\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}=1$ |\n\nPada garis, $t=0$ adalah titik pertama dan $t=1$ titik kedua, sehingga $0\\le t\\le 1$ hanyalah ruas garis di antara keduanya. Untuk lingkaran dan elips, $0\\le t\\le 2\\pi$ berkeliling satu kali berlawanan arah jarum jam, mulai dari $(a,0)$.\n\nLintasan tidak menentukan parametrisasinya. Untuk lingkaran satuan:\n\n- $x=\\cos 2t,\\ y=\\sin 2t$ adalah lingkaran yang sama, digambar dua kali lebih cepat.\n- $x=\\cos t,\\ y=-\\sin t$ adalah lingkaran yang sama, digambar searah jarum jam.\n- $x=\\cos(t+\\pi/2),\\ y=\\sin(t+\\pi/2)$ mulai dari $(0,1)$, bukan $(1,0)$.',
              },
              figure: {
                dim: 2,
                xSpan: [-5, 5],
                ySpan: [-5, 5],
                ticks: true,
                params: [
                  { name: 'a', min: 1, max: 4, step: 0.1, value: 3, label: 'a' },
                  { name: 'b', min: 1, max: 4, step: 0.1, value: 2, label: 'b' },
                ],
                items: [
                  { t: 'param', x: 'a*cos(t)', y: 'b*sin(t)', from: 0, to: 6.2832, color: 'a' },
                  { t: 'dot', x: 'a', y: 0, color: 'b', label: 'a' },
                  { t: 'dot', x: 0, y: 'b', color: 'b', label: 'b' },
                ],
                caption: {
                  en: 'Drag $a$ and $b$: the ellipse $x=a\\cos t,\\ y=b\\sin t$ stretches to reach $x=\\pm a$ and $y=\\pm b$. When $a=b$ it becomes a circle.',
                  id: 'Geser $a$ dan $b$: elips $x=a\\cos t,\\ y=b\\sin t$ meregang hingga mencapai $x=\\pm a$ dan $y=\\pm b$. Ketika $a=b$ ia menjadi lingkaran.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The cycloid: a point on a rolling wheel', id: 'Sikloid: titik pada roda yang menggelinding' },
              body: {
                en: 'Roll a wheel of radius $a$ along the $x$-axis and follow one point on its rim, starting at the origin. After the wheel has turned through an angle $t$, its center is at $(at,\\ a)$, because the rim has unrolled a length $at$ along the ground.\n\nThe rim point started $a$ below the center, and the wheel turns clockwise as it rolls, so relative to the center the point is at $(-a\\sin t,\\ -a\\cos t)$. Adding the two positions gives the **cycloid**:\n$$x=a(t-\\sin t),\\qquad y=a(1-\\cos t)$$\n\nOne turn of the wheel, $0\\le t\\le 2\\pi$, draws one arch. It runs from $(0,0)$ up to the top $(\\pi a,\\,2a)$ at $t=\\pi$ and back down to $(2\\pi a,\\,0)$, where the point touches the ground again.',
                id: 'Gulirkan roda berjari-jari $a$ sepanjang sumbu-$x$ dan ikuti satu titik di tepinya, yang mulai dari titik asal. Setelah roda berputar sebesar sudut $t$, pusatnya ada di $(at,\\ a)$, karena tepi roda sudah terbentang sepanjang $at$ di tanah.\n\nTitik di tepi roda mulai $a$ di bawah pusat, dan roda berputar searah jarum jam saat menggelinding, sehingga relatif terhadap pusat titik itu ada di $(-a\\sin t,\\ -a\\cos t)$. Menjumlahkan kedua posisi memberi **sikloid**:\n$$x=a(t-\\sin t),\\qquad y=a(1-\\cos t)$$\n\nSatu putaran roda, $0\\le t\\le 2\\pi$, menggambar satu lengkungan. Ia berjalan dari $(0,0)$ naik ke puncak $(\\pi a,\\,2a)$ pada $t=\\pi$ dan turun kembali ke $(2\\pi a,\\,0)$, tempat titik itu menyentuh tanah lagi.',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 8],
                ySpan: [-3.5, 5.5],
                ticks: true,
                params: [{ name: 's', min: 0, max: 6.28, step: 0.02, value: 2.5, label: 's' }],
                items: [
                  { t: 'hline', y: 0, color: 'muted' },
                  { t: 'param', x: 't-sin(t)', y: '1-cos(t)', from: 0, to: 6.2832, color: 'muted', dashed: true },
                  { t: 'param', x: 't-sin(t)', y: '1-cos(t)', from: 0, to: 's', color: 'a' },
                  { t: 'param', x: 's+cos(t)', y: '1+sin(t)', from: 0, to: 6.2832, color: 'b', dashed: true },
                  { t: 'dot', x: 's', y: 1, color: 'b' },
                  { t: 'dot', x: 's-sin(s)', y: '1-cos(s)', color: 'result', label: 'P' },
                ],
                caption: {
                  en: 'Drag $s$ to roll the wheel (radius $1$) along the ground: the dot $P$ on its rim leaves the solid arch behind. At $s=\\pi$ the dot is at the top of the arch, and at $s=2\\pi$ it is back on the ground after exactly one turn.',
                  id: 'Geser $s$ untuk menggulirkan roda (jari-jari $1$) sepanjang tanah: titik $P$ di tepinya meninggalkan lengkungan tebal di belakang. Pada $s=\\pi$ titik itu ada di puncak lengkungan, dan pada $s=2\\pi$ ia kembali di tanah setelah tepat satu putaran.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'The point $x=\\cos 2t,\\ y=\\sin 2t$ moves for $0\\le t\\le 2\\pi$. What does it do?',
                id: 'Titik $x=\\cos 2t,\\ y=\\sin 2t$ bergerak untuk $0\\le t\\le 2\\pi$. Apa yang dilakukannya?',
              },
              options: [
                { en: 'Goes around the unit circle twice, counterclockwise', id: 'Mengelilingi lingkaran satuan dua kali, berlawanan arah jarum jam' },
                { en: 'Goes around the unit circle once, counterclockwise', id: 'Mengelilingi lingkaran satuan satu kali, berlawanan arah jarum jam' },
                { en: 'Goes around the unit circle twice, clockwise', id: 'Mengelilingi lingkaran satuan dua kali, searah jarum jam' },
                { en: 'Goes around the unit circle once, clockwise', id: 'Mengelilingi lingkaran satuan satu kali, searah jarum jam' },
              ],
              answer: 0,
              explain: {
                en: 'The angle $2t$ runs from $0$ to $4\\pi$, which is two full turns, and an increasing angle means counterclockwise.',
                id: 'Sudut $2t$ berjalan dari $0$ sampai $4\\pi$, yaitu dua putaran penuh, dan sudut yang bertambah berarti berlawanan arah jarum jam.',
              },
              hint: {
                en: 'Follow the angle $2t$ as $t$ goes from $0$ to $2\\pi$: how far does it turn in total, and does it grow or shrink?',
                id: 'Ikuti sudut $2t$ saat $t$ berjalan dari $0$ sampai $2\\pi$: berapa jauh total putarannya, dan apakah ia bertambah atau berkurang?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Which parametrization draws the ellipse in the figure exactly once, counterclockwise from its rightmost point, for $0\\le t\\le 2\\pi$?',
                id: 'Parametrisasi mana yang menggambar elips pada gambar tepat satu kali, berlawanan arah jarum jam dari titik paling kanannya, untuk $0\\le t\\le 2\\pi$?',
              },
              figure: {
                dim: 2,
                xSpan: [-5, 5],
                ySpan: [-5, 5],
                ticks: true,
                items: [{ t: 'param', x: '4cos(t)', y: '2sin(t)', from: 0, to: 6.2832, color: 'a' }],
              },
              options: [
                { en: '$x=4\\cos t,\\ y=2\\sin t$', id: '$x=4\\cos t,\\ y=2\\sin t$' },
                { en: '$x=2\\cos t,\\ y=4\\sin t$', id: '$x=2\\cos t,\\ y=4\\sin t$' },
                { en: '$x=4\\cos t,\\ y=4\\sin t$', id: '$x=4\\cos t,\\ y=4\\sin t$' },
                { en: '$x=16\\cos t,\\ y=4\\sin t$', id: '$x=16\\cos t,\\ y=4\\sin t$' },
              ],
              answer: 0,
              explain: {
                en: 'The ellipse crosses the $x$-axis at $\\pm4$ and the $y$-axis at $\\pm2$, so $a=4$ goes with $\\cos t$ and $b=2$ goes with $\\sin t$. At $t=0$ the point is $(4,0)$, the rightmost point.',
                id: 'Elips memotong sumbu-$x$ di $\\pm4$ dan sumbu-$y$ di $\\pm2$, sehingga $a=4$ berpasangan dengan $\\cos t$ dan $b=2$ dengan $\\sin t$. Pada $t=0$ titiknya $(4,0)$, titik paling kanan.',
              },
              hint: {
                en: 'Read where the curve crosses each axis. The horizontal semi-axis multiplies $\\cos t$ and the vertical one multiplies $\\sin t$.',
                id: 'Baca di mana kurva memotong tiap sumbu. Setengah sumbu horizontal mengalikan $\\cos t$ dan yang vertikal mengalikan $\\sin t$.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the steps that put the rim point of a rolling wheel into coordinates.',
                id: 'Susun langkah yang menyatakan titik di tepi roda yang menggelinding dalam koordinat.',
              },
              lines: {
                en: [
                  '\\text{The center is at } (at,\\ a)',
                  '\\text{Relative to the center, the point is at } (-a\\sin t,\\ -a\\cos t)',
                  'x=at-a\\sin t,\\quad y=a-a\\cos t',
                  'x=a(t-\\sin t),\\quad y=a(1-\\cos t)',
                ],
                id: [
                  '\\text{Pusat roda ada di } (at,\\ a)',
                  '\\text{Relatif terhadap pusat, titik ada di } (-a\\sin t,\\ -a\\cos t)',
                  'x=at-a\\sin t,\\quad y=a-a\\cos t',
                  'x=a(t-\\sin t),\\quad y=a(1-\\cos t)',
                ],
              },
              explain: {
                en: 'Place the center first, then the point relative to it, add the two, and finally factor out $a$.',
                id: 'Tempatkan pusatnya dahulu, lalu titik relatif terhadapnya, jumlahkan keduanya, dan terakhir keluarkan faktor $a$.',
              },
              hint: {
                en: 'The final coordinates are a sum, so the two pieces being added must come before it. Factoring is the very last tidy-up.',
                id: 'Koordinat akhirnya adalah penjumlahan, jadi kedua bagian yang dijumlahkan harus muncul lebih dulu. Memfaktorkan adalah perapian paling akhir.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'A wheel of radius $3$ rolls along the ground, and its rim point follows $x=3(t-\\sin t),\\ y=3(1-\\cos t)$. Find the position of the point at $t=\\pi$.',
                id: 'Sebuah roda berjari-jari $3$ menggelinding di tanah, dan titik di tepinya mengikuti $x=3(t-\\sin t),\\ y=3(1-\\cos t)$. Cari posisi titik itu pada $t=\\pi$.',
              },
              blanks: [
                { label: 'x =', answer: 3 * Math.PI },
                { label: 'y =', answer: 6 },
              ],
              hints: [
                { en: 'Evaluate $\\sin\\pi$ and $\\cos\\pi$ first.', id: 'Hitung $\\sin\\pi$ dan $\\cos\\pi$ lebih dulu.' },
                { en: 'You may type `3pi` directly into the first box.', id: 'Kamu boleh mengetik `3pi` langsung ke kotak pertama.' },
              ],
              explain: {
                en: '$x=3(\\pi-0)=3\\pi$ and $y=3(1-(-1))=6$. This is the top of the arch, at a height equal to the wheel\'s diameter.',
                id: '$x=3(\\pi-0)=3\\pi$ dan $y=3(1-(-1))=6$. Ini puncak lengkungan, pada ketinggian yang sama dengan diameter roda.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'par-m1-s1-p',
        runtime: 'math',
        title: { en: 'Reading and Writing Parametrizations', id: 'Membaca dan Menulis Parametrisasi' },
        brief: {
          en: 'Evaluate a parametrized point and check it against the eliminated equation, write a parametrization for a given ellipse, and find when a cycloid point reaches its top.',
          id: 'Hitung sebuah titik yang terparametrisasi dan periksa terhadap persamaan hasil eliminasi, tuliskan parametrisasi untuk sebuah elips, dan cari kapan titik sikloid mencapai puncaknya.',
        },
        requirements: [
          { en: 'The horizontal semi-axis of an ellipse goes with $\\cos t$ and the vertical one with $\\sin t$.', id: 'Setengah sumbu horizontal elips berpasangan dengan $\\cos t$ dan yang vertikal dengan $\\sin t$.' },
          { en: 'In the formula boxes you may type trigonometric functions in radians, such as `7*cos(t)`.', id: 'Pada kotak rumus kamu boleh mengetik fungsi trigonometri dalam radian, misalnya `7*cos(t)`.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'A point moves along $x=6\\cos t,\\ y=2\\sin t$. Find its position at $t=\\pi/3$, then evaluate the left side of $\\dfrac{x^2}{36}+\\dfrac{y^2}{4}=1$ at that point.',
              id: 'Sebuah titik bergerak sepanjang $x=6\\cos t,\\ y=2\\sin t$. Cari posisinya pada $t=\\pi/3$, lalu hitung ruas kiri $\\dfrac{x^2}{36}+\\dfrac{y^2}{4}=1$ di titik itu.',
            },
            blanks: [
              { label: 'x =', answer: 3 },
              { label: 'y =', answer: Math.sqrt(3) },
              { label: '\\dfrac{x^2}{36}+\\dfrac{y^2}{4} =', answer: 1 },
            ],
            solution: [
              'x=6\\cos\\tfrac{\\pi}{3}=3,\\qquad y=2\\sin\\tfrac{\\pi}{3}=\\sqrt3',
              '\\dfrac{3^2}{36}+\\dfrac{(\\sqrt3)^2}{4}=\\dfrac14+\\dfrac34=1',
            ],
          },
          {
            prompt: {
              en: 'Write a parametrization of the ellipse $\\dfrac{x^2}{49}+\\dfrac{y^2}{16}=1$ that goes once around counterclockwise, starting at $(7,0)$, for $0\\le t\\le 2\\pi$.',
              id: 'Tuliskan parametrisasi elips $\\dfrac{x^2}{49}+\\dfrac{y^2}{16}=1$ yang berkeliling satu kali berlawanan arah jarum jam, mulai dari $(7,0)$, untuk $0\\le t\\le 2\\pi$.',
            },
            blanks: [
              { label: 'x(t) =', formula: '7*cos(t)', variable: 't', domain: [0, 6.28] },
              { label: 'y(t) =', formula: '4*sin(t)', variable: 't', domain: [0, 6.28] },
            ],
            solution: [
              'a^2=49,\\ b^2=16 \\ \\Rightarrow\\ a=7,\\ b=4',
              'x(t)=7\\cos t,\\qquad y(t)=4\\sin t',
            ],
          },
          {
            prompt: {
              en: 'A wheel of radius $2$ rolls along the ground, and its rim point follows $x=2(t-\\sin t),\\ y=2(1-\\cos t)$. At which $t$ in $(0,2\\pi)$ does the point reach its highest position, and what is its $x$-coordinate there?',
              id: 'Sebuah roda berjari-jari $2$ menggelinding di tanah, dan titik di tepinya mengikuti $x=2(t-\\sin t),\\ y=2(1-\\cos t)$. Pada $t$ berapa di $(0,2\\pi)$ titik itu mencapai posisi tertingginya, dan berapa koordinat-$x$-nya di sana?',
            },
            blanks: [
              { label: 't =', answer: Math.PI },
              { label: 'x =', answer: 2 * Math.PI },
            ],
            solution: {
              en: [
                'y=2(1-\\cos t)\\text{ is largest when }\\cos t=-1\\ \\Rightarrow\\ t=\\pi',
                'x=2(\\pi-\\sin\\pi)=2\\pi',
              ],
              id: [
                'y=2(1-\\cos t)\\text{ terbesar ketika }\\cos t=-1\\ \\Rightarrow\\ t=\\pi',
                'x=2(\\pi-\\sin\\pi)=2\\pi',
              ],
            },
          },
        ],
        hints: [
          { en: 'In task 3, the height $y=2(1-\\cos t)$ is largest when $\\cos t$ is as small as it can be.', id: 'Pada butir 3, tinggi $y=2(1-\\cos t)$ terbesar ketika $\\cos t$ sekecil mungkin.' },
          { en: 'In task 2, compare the denominators $49$ and $16$ with $a^2$ and $b^2$.', id: 'Pada butir 2, bandingkan penyebut $49$ dan $16$ dengan $a^2$ dan $b^2$.' },
        ],
        xp: 50,
      },
    },

    /* ------------------------------------------------ 10.2 calculus with parametric curves */
    {
      id: 'par-m1-s2',
      title: { en: 'Calculus with Parametric Curves', id: 'Kalkulus pada Kurva Parametrik' },
      summary: {
        en: 'The chain rule and the substitution rule carry slopes, tangent lines, areas, arc lengths, and surface areas over to curves given by a parameter.',
        id: 'Aturan rantai dan aturan substitusi membawa kemiringan, garis singgung, luas, panjang busur, dan luas permukaan ke kurva yang diberikan oleh sebuah parameter.',
      },
      lessons: [
        {
          id: 'par-m1-s2-l1',
          title: { en: 'Slopes of Parametric Curves', id: 'Kemiringan Kurva Parametrik' },
          goal: {
            en: 'Find slopes, tangent lines, and second derivatives of a curve given by x(t), y(t), and recognize horizontal tangents, vertical tangents, and cusps.',
            id: 'Mencari kemiringan, garis singgung, dan turunan kedua dari kurva yang diberikan oleh x(t), y(t), serta mengenali garis singgung mendatar, garis singgung tegak, dan puncak runcing.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The slope from two rates', id: 'Kemiringan dari dua laju' },
              body: {
                en: 'The point $(x(t),y(t))$ moves with horizontal rate $\\dfrac{dx}{dt}$ and vertical rate $\\dfrac{dy}{dt}$. Where $y$ is a differentiable function of $x$, the chain rule says $\\dfrac{dy}{dt}=\\dfrac{dy}{dx}\\cdot\\dfrac{dx}{dt}$, and dividing by $\\dfrac{dx}{dt}$ gives\n$$\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}\\qquad\\text{whenever }\\frac{dx}{dt}\\neq 0$$\nThe tangent direction is the velocity $\\left(\\dfrac{dx}{dt},\\dfrac{dy}{dt}\\right)$, and the slope is its rise over its run.\n\nFor the ellipse $x=3\\cos t,\\ y=2\\sin t$ we have $\\dfrac{dx}{dt}=-3\\sin t$ and $\\dfrac{dy}{dt}=2\\cos t$, so $\\dfrac{dy}{dx}=-\\dfrac{2\\cos t}{3\\sin t}$. At $t=\\pi/4$ the slope is $-\\dfrac23$ and the point is $\\left(\\dfrac{3\\sqrt2}{2},\\,\\sqrt2\\right)$, so the tangent line is $y-\\sqrt2=-\\dfrac23\\left(x-\\dfrac{3\\sqrt2}{2}\\right)$.',
                id: 'Titik $(x(t),y(t))$ bergerak dengan laju horizontal $\\dfrac{dx}{dt}$ dan laju vertikal $\\dfrac{dy}{dt}$. Di mana $y$ merupakan fungsi $x$ yang terdiferensialkan, aturan rantai menyatakan $\\dfrac{dy}{dt}=\\dfrac{dy}{dx}\\cdot\\dfrac{dx}{dt}$, dan membaginya dengan $\\dfrac{dx}{dt}$ memberi\n$$\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}\\qquad\\text{asalkan }\\frac{dx}{dt}\\neq 0$$\nArah garis singgung adalah kecepatan $\\left(\\dfrac{dx}{dt},\\dfrac{dy}{dt}\\right)$, dan kemiringannya adalah naik per jalannya.\n\nUntuk elips $x=3\\cos t,\\ y=2\\sin t$ kita punya $\\dfrac{dx}{dt}=-3\\sin t$ dan $\\dfrac{dy}{dt}=2\\cos t$, sehingga $\\dfrac{dy}{dx}=-\\dfrac{2\\cos t}{3\\sin t}$. Pada $t=\\pi/4$ kemiringannya $-\\dfrac23$ dan titiknya $\\left(\\dfrac{3\\sqrt2}{2},\\,\\sqrt2\\right)$, sehingga garis singgungnya $y-\\sqrt2=-\\dfrac23\\left(x-\\dfrac{3\\sqrt2}{2}\\right)$.',
              },
              figure: {
                dim: 2,
                xSpan: [-5, 5],
                ySpan: [-5, 5],
                ticks: true,
                params: [{ name: 's', min: 0.15, max: 3, step: 0.01, value: 0.79, label: 's' }],
                items: [
                  { t: 'param', x: '3cos(t)', y: '2sin(t)', from: 0, to: 6.2832, color: 'a' },
                  { t: 'curve', f: '2*sin(s) - (2*cos(s)/(3*sin(s)))*(x - 3*cos(s))', color: 'b', dashed: true, label: 'tangent' },
                  { t: 'dot', x: '3cos(s)', y: '2sin(s)', color: 'result', label: 'P' },
                ],
                caption: {
                  en: 'Drag $s$ to move $P=(3\\cos s,\\,2\\sin s)$ around the upper half of the ellipse. The dashed tangent has slope $-\\dfrac{2\\cos s}{3\\sin s}$: negative on the right where the ellipse falls, positive on the left, and flat at the top ($s=\\pi/2$).',
                  id: 'Geser $s$ untuk menggerakkan $P=(3\\cos s,\\,2\\sin s)$ mengelilingi setengah atas elips. Garis singgung putus-putus berkemiringan $-\\dfrac{2\\cos s}{3\\sin s}$: negatif di kanan tempat elips menurun, positif di kiri, dan datar di puncak ($s=\\pi/2$).',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Horizontal, vertical, cusps, and the second derivative', id: 'Mendatar, tegak, puncak runcing, dan turunan kedua' },
              body: {
                en: 'Look at the two rates separately. Whether the tangent is flat or upright depends on which of them vanishes:\n\n- $\\dfrac{dy}{dt}=0$ and $\\dfrac{dx}{dt}\\neq0$: the tangent is **horizontal**.\n- $\\dfrac{dx}{dt}=0$ and $\\dfrac{dy}{dt}\\neq0$: the tangent is **vertical**.\n- Both rates are $0$: the formula gives $\\dfrac00$ and decides nothing, so look at the limit of $\\dfrac{dy}{dx}$ as $t$ approaches that value.\n\nThe cycloid $x=a(t-\\sin t),\\ y=a(1-\\cos t)$ shows all three. Here $\\dfrac{dx}{dt}=a(1-\\cos t)$ and $\\dfrac{dy}{dt}=a\\sin t$, so $\\dfrac{dy}{dx}=\\dfrac{\\sin t}{1-\\cos t}$. At the top ($t=\\pi$) the slope is $0$; at the ground ($t=0$ or $2\\pi$) both rates vanish and the slope tends to $\\pm\\infty$, so the arch ends in a sharp **cusp** with a vertical tangent.\n\nFor concavity, differentiate the slope with respect to $x$: differentiate with respect to $t$, then divide by $\\dfrac{dx}{dt}$ once more.\n$$\\frac{d^2y}{dx^2}=\\frac{\\dfrac{d}{dt}\\left(\\dfrac{dy}{dx}\\right)}{\\dfrac{dx}{dt}}$$\nThis is **not** the same as $\\dfrac{d^2y/dt^2}{d^2x/dt^2}$.',
                id: 'Lihat kedua laju secara terpisah. Apakah garis singgungnya datar atau tegak bergantung pada laju mana yang lenyap:\n\n- $\\dfrac{dy}{dt}=0$ dan $\\dfrac{dx}{dt}\\neq0$: garis singgungnya **mendatar**.\n- $\\dfrac{dx}{dt}=0$ dan $\\dfrac{dy}{dt}\\neq0$: garis singgungnya **tegak**.\n- Kedua laju bernilai $0$: rumusnya memberi $\\dfrac00$ dan tidak memutuskan apa pun, jadi lihat limit $\\dfrac{dy}{dx}$ saat $t$ mendekati nilai itu.\n\nSikloid $x=a(t-\\sin t),\\ y=a(1-\\cos t)$ menunjukkan ketiganya. Di sini $\\dfrac{dx}{dt}=a(1-\\cos t)$ dan $\\dfrac{dy}{dt}=a\\sin t$, sehingga $\\dfrac{dy}{dx}=\\dfrac{\\sin t}{1-\\cos t}$. Di puncak ($t=\\pi$) kemiringannya $0$; di tanah ($t=0$ atau $2\\pi$) kedua laju lenyap dan kemiringannya menuju $\\pm\\infty$, sehingga lengkungan berakhir pada **puncak runcing** (kuspa) dengan garis singgung tegak.\n\nUntuk kecekungan, turunkan kemiringan terhadap $x$: turunkan terhadap $t$, lalu bagi dengan $\\dfrac{dx}{dt}$ sekali lagi.\n$$\\frac{d^2y}{dx^2}=\\frac{\\dfrac{d}{dt}\\left(\\dfrac{dy}{dx}\\right)}{\\dfrac{dx}{dt}}$$\nIni **bukan** sama dengan $\\dfrac{d^2y/dt^2}{d^2x/dt^2}$.',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 8],
                ySpan: [-3.5, 5.5],
                ticks: true,
                params: [{ name: 's', min: 0.3, max: 6, step: 0.01, value: 2, label: 's' }],
                items: [
                  { t: 'param', x: 't-sin(t)', y: '1-cos(t)', from: 0, to: 6.2832, color: 'a' },
                  { t: 'curve', f: '(1-cos(s)) + (sin(s)/(1-cos(s)))*(x - (s - sin(s)))', color: 'b', dashed: true, label: 'tangent' },
                  { t: 'dot', x: 's-sin(s)', y: '1-cos(s)', color: 'result', label: 'P' },
                ],
                caption: {
                  en: 'Drag $s$ along the arch of the cycloid with $a=1$. The dashed tangent has slope $\\dfrac{\\sin s}{1-\\cos s}$: it is exactly flat at the top ($s=\\pi$) and gets steeper and steeper as $P$ nears the ground, where the cusps are.',
                  id: 'Geser $s$ sepanjang lengkungan sikloid dengan $a=1$. Garis singgung putus-putus berkemiringan $\\dfrac{\\sin s}{1-\\cos s}$: ia tepat datar di puncak ($s=\\pi$) dan makin curam saat $P$ mendekati tanah, tempat puncak runcingnya berada.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which formula gives $\\dfrac{dy}{dx}$ for a curve $x=x(t),\\ y=y(t)$?',
                id: 'Rumus mana yang memberi $\\dfrac{dy}{dx}$ untuk kurva $x=x(t),\\ y=y(t)$?',
              },
              options: [
                { en: '$\\dfrac{dy/dt}{dx/dt}$', id: '$\\dfrac{dy/dt}{dx/dt}$' },
                { en: '$\\dfrac{dx/dt}{dy/dt}$', id: '$\\dfrac{dx/dt}{dy/dt}$' },
                { en: '$\\dfrac{d^2y/dt^2}{d^2x/dt^2}$', id: '$\\dfrac{d^2y/dt^2}{d^2x/dt^2}$' },
                { en: '$\\dfrac{dy}{dt}\\cdot\\dfrac{dx}{dt}$', id: '$\\dfrac{dy}{dt}\\cdot\\dfrac{dx}{dt}$' },
              ],
              answer: 0,
              explain: {
                en: 'The chain rule gives $\\dfrac{dy}{dt}=\\dfrac{dy}{dx}\\dfrac{dx}{dt}$; dividing by $\\dfrac{dx}{dt}$ leaves $\\dfrac{dy}{dx}$ alone.',
                id: 'Aturan rantai memberi $\\dfrac{dy}{dt}=\\dfrac{dy}{dx}\\dfrac{dx}{dt}$; membagi dengan $\\dfrac{dx}{dt}$ menyisakan $\\dfrac{dy}{dx}$ sendirian.',
              },
              hint: {
                en: 'Slope is rise over run. Which of the two rates measures the rise, and which measures the run?',
                id: 'Kemiringan adalah naik per jalan. Laju mana dari keduanya yang mengukur naik, dan mana yang mengukur jalan?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'The figure shows one arch of a cycloid with three marked points. At which point is the tangent line horizontal?',
                id: 'Gambar menunjukkan satu lengkungan sikloid dengan tiga titik bertanda. Di titik mana garis singgungnya mendatar?',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 8],
                ySpan: [-3.5, 5.5],
                ticks: true,
                items: [
                  { t: 'param', x: 't-sin(t)', y: '1-cos(t)', from: 0, to: 6.2832, color: 'a' },
                  { t: 'dot', x: 0, y: 0, color: 'b', label: 'A' },
                  { t: 'dot', x: 3.1416, y: 2, color: 'b', label: 'B' },
                  { t: 'dot', x: 0.5708, y: 1, color: 'b', label: 'C' },
                ],
              },
              options: [
                { en: 'B, the top of the arch', id: 'B, puncak lengkungan' },
                { en: 'A, where the arch meets the ground', id: 'A, tempat lengkungan menyentuh tanah' },
                { en: 'C, partway up the arch', id: 'C, di tengah jalan menuju puncak' },
                { en: 'Every point of the arch', id: 'Setiap titik pada lengkungan' },
              ],
              answer: 0,
              explain: {
                en: 'Only at the top is $\\dfrac{dy}{dt}=a\\sin t$ zero while $\\dfrac{dx}{dt}\\neq0$. At A both rates vanish (a cusp with a vertical tangent), and at C the curve is still climbing.',
                id: 'Hanya di puncak $\\dfrac{dy}{dt}=a\\sin t$ bernilai nol sementara $\\dfrac{dx}{dt}\\neq0$. Di A kedua laju lenyap (puncak runcing dengan garis singgung tegak), dan di C kurvanya masih menanjak.',
              },
              hint: {
                en: 'A horizontal tangent means the point is neither rising nor falling for an instant. Where on the arch does the height stop growing and start shrinking?',
                id: 'Garis singgung mendatar berarti titik itu sesaat tidak naik dan tidak turun. Di mana pada lengkungan tinggi berhenti bertambah dan mulai berkurang?',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the steps for finding where $x=t^2,\\ y=t^3-3t$ has a horizontal tangent.',
                id: 'Susun langkah untuk mencari di mana $x=t^2,\\ y=t^3-3t$ mempunyai garis singgung mendatar.',
              },
              lines: {
                en: [
                  '\\dfrac{dx}{dt}=2t,\\qquad \\dfrac{dy}{dt}=3t^2-3',
                  '\\dfrac{dy}{dx}=\\dfrac{3t^2-3}{2t}',
                  '\\text{Horizontal: } 3t^2-3=0 \\text{ while } 2t\\neq 0',
                  't=\\pm 1',
                ],
                id: [
                  '\\dfrac{dx}{dt}=2t,\\qquad \\dfrac{dy}{dt}=3t^2-3',
                  '\\dfrac{dy}{dx}=\\dfrac{3t^2-3}{2t}',
                  '\\text{Mendatar: } 3t^2-3=0 \\text{ sementara } 2t\\neq 0',
                  't=\\pm 1',
                ],
              },
              explain: {
                en: 'Rates first, slope second; then set the numerator to zero (checking that the denominator is not) and solve.',
                id: 'Laju dahulu, kemiringan kedua; lalu nolkan pembilangnya (sambil memeriksa penyebutnya bukan nol) dan selesaikan.',
              },
              hint: {
                en: 'Differentiate both coordinates before dividing, and impose the horizontal condition only once the slope formula exists.',
                id: 'Turunkan kedua koordinat sebelum membagi, dan terapkan syarat mendatar hanya setelah rumus kemiringan ada.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $x=t^2,\\ y=t^3-3t$, find the slope at $t=2$ and the $y$-intercept of the tangent line there.',
                id: 'Untuk $x=t^2,\\ y=t^3-3t$, cari kemiringan pada $t=2$ dan titik potong-$y$ garis singgung di titik itu.',
              },
              blanks: [
                { label: '\\dfrac{dy}{dx}\\Big|_{t=2} =', answer: 9 / 4 },
                { label: { en: 'y\\text{-intercept} =', id: '\\text{titik potong } y =' }, answer: -7 },
              ],
              hints: [
                { en: 'The point at $t=2$ is $(4,\\,2)$, and the slope is $\\dfrac{3t^2-3}{2t}$ at $t=2$.', id: 'Titik pada $t=2$ adalah $(4,\\,2)$, dan kemiringannya $\\dfrac{3t^2-3}{2t}$ di $t=2$.' },
                { en: 'The tangent line is $y=2+m(x-4)$; set $x=0$.', id: 'Garis singgungnya $y=2+m(x-4)$; setel $x=0$.' },
              ],
              explain: {
                en: 'The slope is $\\dfrac{12-3}{4}=\\dfrac94$. The tangent is $y=2+\\dfrac94(x-4)$, which at $x=0$ gives $2-9=-7$.',
                id: 'Kemiringannya $\\dfrac{12-3}{4}=\\dfrac94$. Garis singgungnya $y=2+\\dfrac94(x-4)$, yang di $x=0$ memberi $2-9=-7$.',
              },
            },
          ],
        },
        {
          id: 'par-m1-s2-l2',
          title: { en: 'Area and Length of a Parametric Curve', id: 'Luas dan Panjang Kurva Parametrik' },
          goal: {
            en: 'Compute the area under a parametric curve and its arc length, and recall the surface-area formula, using the cycloid as the running example.',
            id: 'Menghitung luas di bawah kurva parametrik dan panjang busurnya, serta mengingat rumus luas permukaan, dengan sikloid sebagai contoh berjalan.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Area: substitute x = x(t) into the integral', id: 'Luas: substitusikan x = x(t) ke dalam integral' },
              body: {
                en: 'The area under a curve $y\\ge 0$ is $\\int y\\,dx$. If the curve is traced by $x=x(t),\\ y=y(t)$, then $dx=\\dfrac{dx}{dt}\\,dt$, and the substitution rule turns the integral into one in $t$:\n$$A=\\int_{x_1}^{x_2} y\\,dx=\\int_{\\alpha}^{\\beta} y(t)\\,\\frac{dx}{dt}\\,dt$$\nHere $x$ runs from $x_1$ at $t=\\alpha$ to $x_2$ at $t=\\beta$.\n\nTwo cautions. The curve must be traced **once** with $y\\ge0$, and direction matters: if $x$ **decreases** as $t$ grows, then $\\dfrac{dx}{dt}<0$ and the integral comes out as the **negative** of the area.\n\nOne arch of the cycloid ($0\\le t\\le 2\\pi$, with $x$ increasing) has\n$$A=\\int_0^{2\\pi}a(1-\\cos t)\\cdot a(1-\\cos t)\\,dt=a^2\\int_0^{2\\pi}\\left(1-2\\cos t+\\cos^2t\\right)dt=3\\pi a^2$$\nwhich is three times the area $\\pi a^2$ of the wheel that drew it.',
                id: 'Luas di bawah kurva $y\\ge 0$ adalah $\\int y\\,dx$. Jika kurva digambar oleh $x=x(t),\\ y=y(t)$, maka $dx=\\dfrac{dx}{dt}\\,dt$, dan aturan substitusi mengubah integralnya menjadi integral dalam $t$:\n$$A=\\int_{x_1}^{x_2} y\\,dx=\\int_{\\alpha}^{\\beta} y(t)\\,\\frac{dx}{dt}\\,dt$$\nDi sini $x$ berjalan dari $x_1$ pada $t=\\alpha$ ke $x_2$ pada $t=\\beta$.\n\nDua kewaspadaan. Kurva harus digambar **satu kali** dengan $y\\ge0$, dan arah penting: jika $x$ **menurun** saat $t$ bertambah, maka $\\dfrac{dx}{dt}<0$ dan integralnya keluar sebagai **negatif** dari luas.\n\nSatu lengkungan sikloid ($0\\le t\\le 2\\pi$, dengan $x$ naik) mempunyai\n$$A=\\int_0^{2\\pi}a(1-\\cos t)\\cdot a(1-\\cos t)\\,dt=a^2\\int_0^{2\\pi}\\left(1-2\\cos t+\\cos^2t\\right)dt=3\\pi a^2$$\nyaitu tiga kali luas $\\pi a^2$ dari roda yang menggambarnya.',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 10.5],
                ySpan: [-4, 7.5],
                ticks: true,
                params: [{ name: 'a', min: 0.5, max: 1.5, step: 0.1, value: 1, label: 'a' }],
                items: [
                  { t: 'hline', y: 0, color: 'muted' },
                  { t: 'param', x: 'a*(t-sin(t))', y: 'a*(1-cos(t))', from: 0, to: 6.2832, color: 'a' },
                  { t: 'param', x: 'pi*a+a*cos(t)', y: 'a+a*sin(t)', from: 0, to: 6.2832, color: 'muted', dashed: true, label: 'wheel' },
                  { t: 'dot', x: 'pi*a', y: '2*a', color: 'b', label: 'top' },
                  { t: 'dot', x: '2*pi*a', y: 0, color: 'b' },
                ],
                caption: {
                  en: 'Drag $a$ to resize the wheel: the arch always has width $2\\pi a$ and height $2a$. The area under it is $3\\pi a^2$, three times the area of the dashed wheel, however large the wheel is.',
                  id: 'Geser $a$ untuk mengubah ukuran roda: lengkungan selalu berlebar $2\\pi a$ dan bertinggi $2a$. Luas di bawahnya $3\\pi a^2$, tiga kali luas roda putus-putus, sebesar apa pun rodanya.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Arc length from speed', id: 'Panjang busur dari kelajuan' },
              body: {
                en: 'The Applications of Definite Integrals course gave $L=\\int\\sqrt{1+\\left(\\dfrac{dy}{dx}\\right)^2}\\,dx$. Put in $\\dfrac{dy}{dx}=\\dfrac{dy/dt}{dx/dt}$ and $dx=\\dfrac{dx}{dt}\\,dt$ (with $x$ increasing), and the square root absorbs $\\dfrac{dx}{dt}$:\n$$L=\\int_{\\alpha}^{\\beta}\\sqrt{\\left(\\frac{dx}{dt}\\right)^2+\\left(\\frac{dy}{dt}\\right)^2}\\,dt$$\nThe integrand is the **speed** of the moving point, so the formula says: distance travelled is the integral of speed.\n\nA circle of radius $a$, $x=a\\cos t,\\ y=a\\sin t$, has constant speed $a$, so one turn is $L=\\int_0^{2\\pi}a\\,dt=2\\pi a$. The cycloid has speed $a\\sqrt{(1-\\cos t)^2+\\sin^2t}=a\\sqrt{2-2\\cos t}=2a\\sin\\tfrac t2$ on $0\\le t\\le 2\\pi$, so\n$$L=\\int_0^{2\\pi}2a\\sin\\frac t2\\,dt=\\left[-4a\\cos\\frac t2\\right]_0^{2\\pi}=8a$$\nfour times the wheel\'s diameter.\n\nRotating the curve about the $x$-axis (with $y\\ge0$, traced once) gives a surface of area\n$$S=\\int_{\\alpha}^{\\beta}2\\pi\\,y\\sqrt{\\left(\\frac{dx}{dt}\\right)^2+\\left(\\frac{dy}{dt}\\right)^2}\\,dt$$\nFor the half circle $x=a\\cos t,\\ y=a\\sin t,\\ 0\\le t\\le\\pi$ this is $\\int_0^\\pi 2\\pi a\\sin t\\cdot a\\,dt=4\\pi a^2$, the surface of a sphere.',
                id: 'Kursus Aplikasi Integral Tentu memberi $L=\\int\\sqrt{1+\\left(\\dfrac{dy}{dx}\\right)^2}\\,dx$. Masukkan $\\dfrac{dy}{dx}=\\dfrac{dy/dt}{dx/dt}$ dan $dx=\\dfrac{dx}{dt}\\,dt$ (dengan $x$ naik), dan akar kuadratnya menyerap $\\dfrac{dx}{dt}$:\n$$L=\\int_{\\alpha}^{\\beta}\\sqrt{\\left(\\frac{dx}{dt}\\right)^2+\\left(\\frac{dy}{dt}\\right)^2}\\,dt$$\nIntegrannya adalah **kelajuan** titik yang bergerak, sehingga rumus ini mengatakan: jarak tempuh adalah integral kelajuan.\n\nLingkaran berjari-jari $a$, $x=a\\cos t,\\ y=a\\sin t$, berkelajuan tetap $a$, sehingga satu putaran adalah $L=\\int_0^{2\\pi}a\\,dt=2\\pi a$. Sikloid berkelajuan $a\\sqrt{(1-\\cos t)^2+\\sin^2t}=a\\sqrt{2-2\\cos t}=2a\\sin\\tfrac t2$ pada $0\\le t\\le 2\\pi$, sehingga\n$$L=\\int_0^{2\\pi}2a\\sin\\frac t2\\,dt=\\left[-4a\\cos\\frac t2\\right]_0^{2\\pi}=8a$$\nempat kali diameter roda.\n\nMemutar kurva terhadap sumbu-$x$ (dengan $y\\ge0$, digambar satu kali) menghasilkan permukaan seluas\n$$S=\\int_{\\alpha}^{\\beta}2\\pi\\,y\\sqrt{\\left(\\frac{dx}{dt}\\right)^2+\\left(\\frac{dy}{dt}\\right)^2}\\,dt$$\nUntuk setengah lingkaran $x=a\\cos t,\\ y=a\\sin t,\\ 0\\le t\\le\\pi$ ini adalah $\\int_0^\\pi 2\\pi a\\sin t\\cdot a\\,dt=4\\pi a^2$, luas permukaan bola.',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 8],
                ySpan: [-3.5, 5.5],
                ticks: true,
                params: [{ name: 's', min: 0, max: 6.28, step: 0.02, value: 3.14, label: 's' }],
                items: [
                  { t: 'param', x: 't-sin(t)', y: '1-cos(t)', from: 0, to: 6.2832, color: 'muted', dashed: true },
                  { t: 'param', x: 't-sin(t)', y: '1-cos(t)', from: 0, to: 's', color: 'a' },
                  { t: 'dot', x: 's-sin(s)', y: '1-cos(s)', color: 'b', label: 'P' },
                ],
                caption: {
                  en: 'Drag $s$: the solid arc is the path travelled for $0\\le t\\le s$ on the cycloid with $a=1$. Its length is $\\int_0^s 2\\sin\\frac t2\\,dt=4\\left(1-\\cos\\frac s2\\right)$, which is $4$ at the top ($s=\\pi$), exactly half of the full $8$.',
                  id: 'Geser $s$: busur tebal adalah lintasan yang ditempuh untuk $0\\le t\\le s$ pada sikloid dengan $a=1$. Panjangnya $\\int_0^s 2\\sin\\frac t2\\,dt=4\\left(1-\\cos\\frac s2\\right)$, yaitu $4$ di puncak ($s=\\pi$), tepat setengah dari $8$ penuh.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'In $L=\\int_\\alpha^\\beta\\sqrt{(dx/dt)^2+(dy/dt)^2}\\,dt$, what does the integrand $\\sqrt{(dx/dt)^2+(dy/dt)^2}$ represent?',
                id: 'Pada $L=\\int_\\alpha^\\beta\\sqrt{(dx/dt)^2+(dy/dt)^2}\\,dt$, apa yang diwakili integran $\\sqrt{(dx/dt)^2+(dy/dt)^2}$?',
              },
              options: [
                { en: 'The speed of the moving point', id: 'Kelajuan titik yang bergerak' },
                { en: 'The slope of the tangent line', id: 'Kemiringan garis singgung' },
                { en: 'The area swept out per unit time', id: 'Luas yang tersapu per satuan waktu' },
                { en: 'The second derivative $d^2y/dx^2$', id: 'Turunan kedua $d^2y/dx^2$' },
              ],
              answer: 0,
              explain: {
                en: 'The point moves $\\frac{dx}{dt}$ across and $\\frac{dy}{dt}$ up per unit time, so by Pythagoras it covers $\\sqrt{(dx/dt)^2+(dy/dt)^2}$ along the curve: its speed.',
                id: 'Titik bergerak sejauh $\\frac{dx}{dt}$ ke samping dan $\\frac{dy}{dt}$ ke atas per satuan waktu, sehingga menurut Pythagoras ia menempuh $\\sqrt{(dx/dt)^2+(dy/dt)^2}$ sepanjang kurva: kelajuannya.',
              },
              hint: {
                en: 'The two rates are the legs of a right triangle. What is the length of its hypotenuse, and what would that length measure per unit time?',
                id: 'Kedua laju adalah sisi tegak sebuah segitiga siku-siku. Berapa panjang sisi miringnya, dan apa yang diukur panjang itu per satuan waktu?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'A point traces the upper semicircle in the figure, starting at the dot labeled start and ending at the dot labeled end. What is $\\int y\\,dx$ evaluated along this path?',
                id: 'Sebuah titik menelusuri setengah lingkaran atas pada gambar, mulai dari titik berlabel start dan berakhir di titik berlabel end. Berapa nilai $\\int y\\,dx$ yang dihitung sepanjang lintasan ini?',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 3],
                ySpan: [-3, 3],
                ticks: true,
                items: [
                  { t: 'param', x: '2cos(t)', y: '2sin(t)', from: 0, to: 3.1416, color: 'a' },
                  { t: 'dot', x: 2, y: 0, color: 'b', label: 'start' },
                  { t: 'dot', x: -2, y: 0, color: 'result', label: 'end' },
                ],
              },
              options: [
                { en: '$-2\\pi$', id: '$-2\\pi$' },
                { en: '$2\\pi$', id: '$2\\pi$' },
                { en: '$4\\pi$', id: '$4\\pi$' },
                { en: '$-4\\pi$', id: '$-4\\pi$' },
              ],
              answer: 0,
              explain: {
                en: 'The area under a semicircle of radius $2$ is $\\tfrac12\\pi\\cdot 2^2=2\\pi$. The path runs from right to left, so $x$ decreases and the integral is the negative of that area: $-2\\pi$.',
                id: 'Luas di bawah setengah lingkaran berjari-jari $2$ adalah $\\tfrac12\\pi\\cdot 2^2=2\\pi$. Lintasan berjalan dari kanan ke kiri, sehingga $x$ menurun dan integralnya adalah negatif dari luas itu: $-2\\pi$.',
              },
              hint: {
                en: 'Find the area under the arc first, then decide whether $x$ increases or decreases along the path from start to end.',
                id: 'Cari dulu luas di bawah busur, lalu putuskan apakah $x$ bertambah atau berkurang sepanjang lintasan dari start ke end.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'The point $x=3t,\\ y=4t$ moves for $0\\le t\\le 2$. Complete the arc length computation.',
                id: 'Titik $x=3t,\\ y=4t$ bergerak untuk $0\\le t\\le 2$. Lengkapi perhitungan panjang busurnya.',
              },
              template: '\\dfrac{dx}{dt}=3,\\ \\dfrac{dy}{dt}=4:\\quad \\sqrt{3^2+4^2}=___,\\quad L=\\int_0^2 ___\\,dt=___',
              blanks: ['5', '5', '10'],
              explain: {
                en: 'The speed $5$ is constant, so $L=\\int_0^2 5\\,dt=10$, which is the length of the straight segment from $(0,0)$ to $(6,8)$.',
                id: 'Kelajuan $5$ konstan, sehingga $L=\\int_0^2 5\\,dt=10$, yaitu panjang ruas garis lurus dari $(0,0)$ ke $(6,8)$.',
              },
              hint: {
                en: 'The speed is the length of the velocity vector $(3,4)$, and the second blank is that same speed.',
                id: 'Kelajuan adalah panjang vektor kecepatan $(3,4)$, dan kotak kedua adalah kelajuan yang sama itu.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For the curve $x=3t^2,\\ y=2t^3,\\ 0\\le t\\le 1$, find its arc length $L$ and the area $A$ under it above the $x$-axis.',
                id: 'Untuk kurva $x=3t^2,\\ y=2t^3,\\ 0\\le t\\le 1$, cari panjang busurnya $L$ dan luas $A$ di bawahnya di atas sumbu-$x$.',
              },
              blanks: [
                { label: 'L =', answer: 4 * Math.sqrt(2) - 2 },
                { label: 'A =', answer: 12 / 5 },
              ],
              hints: [
                { en: 'The speed is $\\sqrt{36t^2+36t^4}=6t\\sqrt{1+t^2}$; substitute $u=1+t^2$.', id: 'Kelajuannya $\\sqrt{36t^2+36t^4}=6t\\sqrt{1+t^2}$; substitusikan $u=1+t^2$.' },
                { en: 'For the area, $A=\\int_0^1 y\\,\\dfrac{dx}{dt}\\,dt$ with $\\dfrac{dx}{dt}=6t$.', id: 'Untuk luas, $A=\\int_0^1 y\\,\\dfrac{dx}{dt}\\,dt$ dengan $\\dfrac{dx}{dt}=6t$.' },
              ],
              explain: {
                en: '$L=\\int_0^1 6t\\sqrt{1+t^2}\\,dt=\\left[2(1+t^2)^{3/2}\\right]_0^1=4\\sqrt2-2$, and $A=\\int_0^1 2t^3\\cdot 6t\\,dt=\\int_0^1 12t^4\\,dt=\\dfrac{12}{5}$.',
                id: '$L=\\int_0^1 6t\\sqrt{1+t^2}\\,dt=\\left[2(1+t^2)^{3/2}\\right]_0^1=4\\sqrt2-2$, dan $A=\\int_0^1 2t^3\\cdot 6t\\,dt=\\int_0^1 12t^4\\,dt=\\dfrac{12}{5}$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'par-m1-s2-p',
        runtime: 'math',
        title: { en: 'Slopes, Areas, and Lengths', id: 'Kemiringan, Luas, dan Panjang' },
        brief: {
          en: 'A tangent line to an ellipse, an area with a sign to watch, and an arc length where the square root simplifies.',
          id: 'Sebuah garis singgung pada elips, sebuah luas dengan tanda yang harus diperhatikan, dan sebuah panjang busur dengan akar kuadrat yang menyederhana.',
        },
        requirements: [
          { en: 'Differentiate $x(t)$ and $y(t)$ first, then divide for the slope or combine for the speed.', id: 'Turunkan $x(t)$ dan $y(t)$ lebih dahulu, lalu bagi untuk kemiringan atau gabungkan untuk kelajuan.' },
          { en: 'You may type exact forms like `-3sqrt(3)/4` or `5pi` directly into a box.', id: 'Kamu boleh mengetik bentuk eksak seperti `-3sqrt(3)/4` atau `5pi` langsung ke kotaknya.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'On the ellipse $x=4\\cos t,\\ y=3\\sin t$, find the slope of the tangent line at $t=\\pi/6$, and the $y$-intercept of that tangent line.',
              id: 'Pada elips $x=4\\cos t,\\ y=3\\sin t$, cari kemiringan garis singgung pada $t=\\pi/6$, dan titik potong-$y$ garis singgung itu.',
            },
            blanks: [
              { label: '\\dfrac{dy}{dx} =', answer: (-3 * Math.sqrt(3)) / 4 },
              { label: { en: 'y\\text{-intercept} =', id: '\\text{titik potong } y =' }, answer: 6 },
            ],
            solution: [
              '\\dfrac{dy}{dx}=\\dfrac{3\\cos t}{-4\\sin t}\\ \\Rightarrow\\ \\dfrac{3\\cdot\\frac{\\sqrt3}{2}}{-4\\cdot\\frac12}=-\\dfrac{3\\sqrt3}{4}',
              '(x_0,y_0)=\\left(2\\sqrt3,\\ \\tfrac32\\right),\\qquad y=\\tfrac32-\\tfrac{3\\sqrt3}{4}\\left(x-2\\sqrt3\\right)',
              'x=0:\\ y=\\tfrac32+\\tfrac{3\\sqrt3}{4}\\cdot 2\\sqrt3=\\tfrac32+\\tfrac92=6',
            ],
          },
          {
            prompt: {
              en: 'For the upper half of the ellipse $x=5\\cos t,\\ y=2\\sin t,\\ 0\\le t\\le\\pi$, find the area $A$ under the arc, and the value of $\\\int_0^{\\pi} y\\,\\dfrac{dx}{dt}\\,dt$ along this path.',
              id: 'Untuk setengah atas elips $x=5\\cos t,\\ y=2\\sin t,\\ 0\\le t\\le\\pi$, cari luas $A$ di bawah busur, dan nilai $\\\int_0^{\\pi} y\\,\\dfrac{dx}{dt}\\,dt$ sepanjang lintasan ini.',
            },
            blanks: [
              { label: 'A =', answer: 5 * Math.PI },
              { label: '\\\int_0^{\\pi} y\\,\\tfrac{dx}{dt}\\,dt =', answer: -5 * Math.PI },
            ],
            solution: {
              en: [
                '\\int_0^{\\pi}2\\sin t\\cdot(-5\\sin t)\\,dt=-10\\int_0^{\\pi}\\sin^2t\\,dt=-10\\cdot\\dfrac{\\pi}{2}=-5\\pi',
                '\\text{The path runs right to left, so the area has the opposite sign: } A=5\\pi',
              ],
              id: [
                '\\int_0^{\\pi}2\\sin t\\cdot(-5\\sin t)\\,dt=-10\\int_0^{\\pi}\\sin^2t\\,dt=-10\\cdot\\dfrac{\\pi}{2}=-5\\pi',
                '\\text{Lintasan berjalan dari kanan ke kiri, sehingga luasnya bertanda berlawanan: } A=5\\pi',
              ],
            },
          },
          {
            prompt: {
              en: 'A point moves along $x=t^3,\\ y=\\tfrac32t^2$. Find its speed at $t=1$, and the arc length for $0\\le t\\le\\sqrt3$.',
              id: 'Sebuah titik bergerak sepanjang $x=t^3,\\ y=\\tfrac32t^2$. Cari kelajuannya pada $t=1$, dan panjang busur untuk $0\\le t\\le\\sqrt3$.',
            },
            blanks: [
              { label: { en: '\\text{speed at } t=1 =', id: '\\text{kelajuan di } t=1 =' }, answer: 3 * Math.sqrt(2) },
              { label: 'L =', answer: 7 },
            ],
            solution: [
              '\\dfrac{dx}{dt}=3t^2,\\quad \\dfrac{dy}{dt}=3t \\ \\Rightarrow\\ \\sqrt{9t^4+9t^2}=3t\\sqrt{t^2+1}',
              't=1:\\ 3\\sqrt2',
              'L=\\int_0^{\\sqrt3}3t\\sqrt{t^2+1}\\,dt=\\Big[(t^2+1)^{3/2}\\Big]_0^{\\sqrt3}=8-1=7',
            ],
          },
        ],
        hints: [
          { en: 'In task 2, the sign of the integral is decided by whether $x$ increases or decreases along the path.', id: 'Pada butir 2, tanda integral ditentukan oleh apakah $x$ bertambah atau berkurang sepanjang lintasan.' },
          { en: 'In task 3, factor $9t^2$ out of $9t^4+9t^2$ before taking the square root, then substitute $u=t^2+1$.', id: 'Pada butir 3, faktorkan $9t^2$ dari $9t^4+9t^2$ sebelum mengakarkan, lalu substitusikan $u=t^2+1$.' },
        ],
        xp: 50,
      },
    },
  ],
}
