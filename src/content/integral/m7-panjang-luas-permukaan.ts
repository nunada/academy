import type { Module } from '../types'

/** Module 7 — the same Riemann-sum idea Module 2 used to define area returns
 *  once more, this time chopping a curve into tiny straight secants instead
 *  of rectangles. Both new formulas get checked against plain geometry — a
 *  circle's circumference, a sphere's surface, a cone's slant — the same way
 *  the quarter-circle checked trigonometric substitution back in Module 4. */
export const module7: Module = {
  id: 'int-m7',
  title: { en: 'Arc Length and Surface Area', id: 'Panjang Busur dan Luas Permukaan' },
  summary: {
    en: 'Measuring the length of a curve and the surface area of a solid of revolution, both by summing infinitesimal pieces.',
    id: 'Mengukur panjang sebuah kurva dan luas permukaan benda putar, keduanya dengan menjumlahkan bagian yang sangat kecil.',
  },
  submodules: [
    /* ------------------------------------------------------------- 7.1 arc length */
    {
      id: 'int-m7-s1',
      title: { en: 'Arc Length', id: 'Panjang Busur' },
      summary: {
        en: 'Deriving the arc length formula from tiny straight secants, and checking it against a circle\'s own circumference.',
        id: 'Menurunkan rumus panjang busur dari tali busur lurus yang sangat kecil, dan memeriksanya terhadap keliling lingkaran sendiri.',
      },
      lessons: [
        {
          id: 'int-m7-s1-l1',
          title: { en: 'Deriving the Arc Length Formula', id: 'Menurunkan Rumus Panjang Busur' },
          goal: {
            en: 'Derive the arc length formula from the Pythagorean theorem on tiny secant segments, and apply it to a worked example.',
            id: 'Menurunkan rumus panjang busur dari teorema Pythagoras pada segmen tali busur yang sangat kecil, dan menerapkannya pada contoh yang dikerjakan.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Pythagoras on a piece too small to curve', id: 'Pythagoras pada sepotong yang terlalu kecil untuk melengkung' },
              body: {
                en: 'The same idea that built the definite integral in Module 2 — slice, approximate, sum, take a limit — measures a curve\'s length too. Slice $[a,b]$ into $n$ tiny strips of width $\\Delta x$. Across one strip, the curve rises by roughly $\\Delta y \\approx f\'(x)\\,\\Delta x$, and since the strip is so narrow the curve there looks like a straight secant, its length is given by the Pythagorean theorem:\n$$\\sqrt{(\\Delta x)^2+(\\Delta y)^2} = \\sqrt{1+\\left(\\frac{\\Delta y}{\\Delta x}\\right)^2}\\,\\Delta x \\approx \\sqrt{1+\\big(f\'(x)\\big)^2}\\,\\Delta x$$\nSumming every strip and taking the limit as $n\\to\\infty$ turns the sum into a definite integral — the **arc length formula**:\n$$L = \\int_a^b \\sqrt{1+\\big(f\'(x)\\big)^2}\\,dx$$',
                id: 'Gagasan yang sama yang membangun integral tentu pada Modul 2 — iris, hampiri, jumlahkan, ambil limit — mengukur panjang kurva juga. Iris $[a,b]$ menjadi $n$ jalur tipis berlebar $\\Delta x$. Sepanjang satu jalur, kurvanya naik kira-kira $\\Delta y \\approx f\'(x)\\,\\Delta x$, dan karena jalurnya sangat sempit kurva di situ terlihat seperti tali busur lurus, panjangnya diberikan oleh teorema Pythagoras:\n$$\\sqrt{(\\Delta x)^2+(\\Delta y)^2} = \\sqrt{1+\\left(\\frac{\\Delta y}{\\Delta x}\\right)^2}\\,\\Delta x \\approx \\sqrt{1+\\big(f\'(x)\\big)^2}\\,\\Delta x$$\nMenjumlahkan setiap jalur dan mengambil limit ketika $n\\to\\infty$ mengubah jumlahnya menjadi integral tentu — **rumus panjang busur**:\n$$L = \\int_a^b \\sqrt{1+\\big(f\'(x)\\big)^2}\\,dx$$',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A straight-line check, then a curve built to work out cleanly', id: 'Pemeriksaan garis lurus, lalu kurva yang dirancang agar bersih' },
              body: {
                en: 'For $f(x)=2x+1$ on $[0,3]$: $f\'(x)=2$, so $L=\\int_0^3\\sqrt{1+4}\\,dx = 3\\sqrt5$ — exactly the straight-line distance $\\sqrt{3^2+6^2}=\\sqrt{45}=3\\sqrt5$ from the Pythagorean theorem directly. The formula reduces to plain geometry when the curve already is a line.\n\nFor a genuinely curved example, $f(x)=\\frac{x^3}{6}+\\frac{1}{2x}$ on $[1,3]$: $f\'(x)=\\frac{x^2}{2}-\\frac{1}{2x^2}$, and squaring plus adding $1$ collapses to a perfect square (the cross terms cancel to $-\\tfrac12$ each time): $1+(f\')^2 = \\left(\\frac{x^2}{2}+\\frac{1}{2x^2}\\right)^2$. So:\n$$L = \\int_1^3 \\left(\\frac{x^2}{2}+\\frac{1}{2x^2}\\right)dx = \\left[\\frac{x^3}{6}-\\frac{1}{2x}\\right]_1^3 = \\left(4.5-\\frac16\\right)-\\left(\\frac16-0.5\\right) = \\frac{14}{3} \\approx 4.667$$\nMost arc length integrands do not simplify this cleanly — this function was built specifically so the square root would resolve.',
                id: 'Untuk $f(x)=2x+1$ pada $[0,3]$: $f\'(x)=2$, sehingga $L=\\int_0^3\\sqrt{1+4}\\,dx = 3\\sqrt5$ — persis jarak garis lurus $\\sqrt{3^2+6^2}=\\sqrt{45}=3\\sqrt5$ dari teorema Pythagoras langsung. Rumusnya menyusut menjadi geometri biasa ketika kurvanya memang sebuah garis.\n\nUntuk contoh yang sungguh melengkung, $f(x)=\\frac{x^3}{6}+\\frac{1}{2x}$ pada $[1,3]$: $f\'(x)=\\frac{x^2}{2}-\\frac{1}{2x^2}$, dan mengkuadratkan lalu menambah $1$ menyusut menjadi kuadrat sempurna (suku silangnya saling meniadakan menjadi $-\\tfrac12$ setiap kali): $1+(f\')^2 = \\left(\\frac{x^2}{2}+\\frac{1}{2x^2}\\right)^2$. Jadi:\n$$L = \\int_1^3 \\left(\\frac{x^2}{2}+\\frac{1}{2x^2}\\right)dx = \\left[\\frac{x^3}{6}-\\frac{1}{2x}\\right]_1^3 = \\left(4.5-\\frac16\\right)-\\left(\\frac16-0.5\\right) = \\frac{14}{3} \\approx 4.667$$\nKebanyakan integrand panjang busur tak menyederhana sebersih ini — fungsi ini dibangun khusus agar akar kuadratnya terselesaikan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why does the arc length formula reduce to the ordinary distance formula when $f$ is a straight line?',
                id: 'Mengapa rumus panjang busur menyusut menjadi rumus jarak biasa ketika $f$ adalah garis lurus?',
              },
              options: [
                { en: "$f'(x)$ is the constant slope, so $\\sqrt{1+(f')^2}$ is a constant, and integrating a constant over the interval just multiplies it by the width", id: "$f'(x)$ adalah kemiringan konstan, sehingga $\\sqrt{1+(f')^2}$ adalah konstanta, dan mengintegralkan konstanta pada interval hanya mengalikannya dengan lebarnya" },
                { en: 'Straight lines are not actually covered by the arc length formula', id: 'Garis lurus sebenarnya tak tercakup rumus panjang busur' },
                { en: 'It is a coincidence specific to this one example', id: 'Ini kebetulan yang khusus untuk contoh ini saja' },
                { en: 'The Pythagorean theorem does not apply to curves', id: 'Teorema Pythagoras tak berlaku untuk kurva' },
              ],
              answer: 0,
              explain: {
                en: "A line's derivative never changes, so the square root term inside the integral is the same number everywhere — the integral of a constant over $[a,b]$ is just that constant times $(b-a)$, which is exactly the run times the secant factor that recovers the straight-line distance.",
                id: 'Turunan garis tak pernah berubah, sehingga suku akar kuadrat di dalam integralnya adalah bilangan yang sama di mana-mana — integral konstanta pada $[a,b]$ hanyalah konstanta itu dikali $(b-a)$, yang persis merupakan jalan dikali faktor tali busur yang memulihkan jarak garis lurus.',
              },
              hint: {
                en: "A line's derivative $f'(x)$ never changes across the interval — think about what happens when you integrate a quantity that stays exactly the same number the whole way.",
                id: 'Turunan garis $f\'(x)$ tak pernah berubah sepanjang intervalnya — pikirkan apa yang terjadi saat kamu mengintegralkan besaran yang tetap persis bilangan yang sama sepanjang jalan.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the arc length setup for $f(x) = 2x + 1$ on $[0, 3]$.',
                id: 'Lengkapi penyusunan panjang busur untuk $f(x) = 2x + 1$ pada $[0, 3]$.',
              },
              template: 'L = \\int_0^3 \\sqrt{1+(f\')^2}\\,dx, \\quad f\'(x) = ___, \\quad 1+(f\')^2 = ___',
              blanks: ['2', '5'],
              explain: {
                en: "$f'(x) = 2$, and $1 + 2^2 = 5$ sits under the square root, constant across the whole interval.",
                id: "$f'(x) = 2$, dan $1 + 2^2 = 5$ duduk di bawah akar kuadrat, konstan sepanjang interval.",
              },
              hint: {
                en: "Differentiate $f(x) = 2x + 1$ first to fill the first blank, then square that result and add $1$ for the second.",
                id: 'Turunkan $f(x) = 2x + 1$ lebih dahulu untuk mengisi kekosongan pertama, lalu kuadratkan hasilnya dan tambah $1$ untuk kekosongan kedua.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the arc length of $f(x) = x^3/6 + 1/(2x)$ on $[2, 3]$, using the antiderivative $x^3/6 - 1/(2x)$ found in the lesson.',
                id: 'Cari panjang busur dari $f(x) = x^3/6 + 1/(2x)$ pada $[2, 3]$, memakai antiturunan $x^3/6 - 1/(2x)$ yang ditemukan di pelajaran.',
              },
              blanks: [{ answer: 3.25 }],
              hints: [
                { en: '$F(3) = 27/6 - 1/6$, $F(2) = 8/6 - 1/4$.', id: '$F(3) = 27/6 - 1/6$, $F(2) = 8/6 - 1/4$.' },
              ],
              explain: {
                en: '$F(3) = 13/3$, $F(2) = 13/12$. $F(3) - F(2) = 13/3 - 13/12 = 52/12 - 13/12 = 39/12 = 13/4 = 3.25$.',
                id: '$F(3) = 13/3$, $F(2) = 13/12$. $F(3) - F(2) = 13/3 - 13/12 = 52/12 - 13/12 = 39/12 = 13/4 = 3{,}25$.',
              },
            },
          ],
        },
        {
          id: 'int-m7-s1-l2',
          title: { en: 'Arc Length of a Circular Arc', id: 'Panjang Busur Lingkaran' },
          goal: {
            en: 'Apply the arc length formula to a semicircle and confirm it against the circumference formula from geometry.',
            id: 'Menerapkan rumus panjang busur pada setengah lingkaran dan memastikannya terhadap rumus keliling dari geometri.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The semicircle, checked against geometry\'s own formula', id: 'Setengah lingkaran, diperiksa terhadap rumus geometri sendiri' },
              body: {
                en: 'For $f(x)=\\sqrt{r^2-x^2}$ on $[-r,r]$ — the upper half of a circle of radius $r$ — Module 4\'s trigonometric substitution already simplified $f\'(x)=\\frac{-x}{\\sqrt{r^2-x^2}}$, so:\n$$1+\\big(f\'(x)\\big)^2 = 1+\\frac{x^2}{r^2-x^2} = \\frac{r^2}{r^2-x^2} \\ \\Rightarrow \\ \\sqrt{1+(f\')^2} = \\frac{r}{\\sqrt{r^2-x^2}}$$\nUsing the $\\arcsin$ antiderivative from the Derivatives course:\n$$L = \\int_{-r}^r \\frac{r}{\\sqrt{r^2-x^2}}\\,dx = r\\Big[\\arcsin\\frac{x}{r}\\Big]_{-r}^r = r\\left(\\frac{\\pi}{2}-\\left(-\\frac{\\pi}{2}\\right)\\right) = \\pi r$$\nGeometry\'s own formula for a semicircle\'s arc is half the circumference, $\\frac{1}{2}(2\\pi r)=\\pi r$ — an exact match.',
                id: 'Untuk $f(x)=\\sqrt{r^2-x^2}$ pada $[-r,r]$ — separuh atas lingkaran berjari-jari $r$ — substitusi trigonometri Modul 4 sudah menyederhanakan $f\'(x)=\\frac{-x}{\\sqrt{r^2-x^2}}$, sehingga:\n$$1+\\big(f\'(x)\\big)^2 = 1+\\frac{x^2}{r^2-x^2} = \\frac{r^2}{r^2-x^2} \\ \\Rightarrow \\ \\sqrt{1+(f\')^2} = \\frac{r}{\\sqrt{r^2-x^2}}$$\nMemakai antiturunan $\\arcsin$ dari kursus Turunan:\n$$L = \\int_{-r}^r \\frac{r}{\\sqrt{r^2-x^2}}\\,dx = r\\Big[\\arcsin\\frac{x}{r}\\Big]_{-r}^r = r\\left(\\frac{\\pi}{2}-\\left(-\\frac{\\pi}{2}\\right)\\right) = \\pi r$$\nRumus geometri sendiri untuk busur setengah lingkaran adalah setengah keliling, $\\frac{1}{2}(2\\pi r)=\\pi r$ — cocok persis.',
              },
              figure: {
                dim: 2,
                xSpan: [-3.5, 3.5],
                ySpan: [-1, 4],
                ticks: true,
                items: [{ t: 'curve', f: 'sqrt(9-x^2)', from: -3, to: 3, color: 'a' }],
                caption: {
                  en: 'The upper semicircle of radius 3 — its arc length by the formula is exactly $3\\pi$, matching half the circle\'s circumference.',
                  id: 'Setengah lingkaran atas berjari-jari 3 — panjang busurnya menurut rumus persis $3\\pi$, cocok dengan setengah keliling lingkarannya.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'When the antiderivative does not exist in closed form', id: 'Ketika antiturunannya tak ada dalam bentuk tertutup' },
              body: {
                en: 'Not every arc length integral resolves this cleanly. The arc length of an ellipse, or of $f(x)=\\sin x$ over most intervals, produces an integrand with no elementary antiderivative at all — not because of a missing technique, but because none exists, in the same sense Module 5 discussed for $e^{-x^2}$. In exactly those cases, Module 5\'s numerical methods (the Trapezoidal Rule, Simpson\'s Rule) are not a fallback for the lazy — they are the only route to a number at all.',
                id: 'Tak semua integral panjang busur menyelesaikan sebersih ini. Panjang busur elips, atau dari $f(x)=\\sin x$ pada kebanyakan interval, menghasilkan integrand yang sama sekali tak punya antiturunan elementer — bukan karena teknik yang hilang, melainkan karena memang tak ada, dalam pengertian yang sama seperti yang dibahas Modul 5 untuk $e^{-x^2}$. Justru dalam kasus semacam itu, metode numerik Modul 5 (Aturan Trapesium, Aturan Simpson) bukan jalan pintas bagi yang malas — melainkan satu-satunya jalan menuju sebuah angka sama sekali.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What confirms that the arc length formula gives the correct result for the semicircle?',
                id: 'Apa yang memastikan rumus panjang busur memberi hasil yang benar untuk setengah lingkaran?',
              },
              options: [
                { en: 'The integral evaluates to $\\pi r$, exactly matching half the circumference formula from geometry', id: 'Integralnya bernilai $\\pi r$, cocok persis dengan setengah rumus keliling dari geometri' },
                { en: 'The integral cannot actually be evaluated in this case', id: 'Integralnya sebenarnya tak bisa dievaluasi dalam kasus ini' },
                { en: 'Arc length formulas never apply to circles', id: 'Rumus panjang busur tak pernah berlaku untuk lingkaran' },
                { en: 'It is simply assumed, without any check', id: 'Ini sekadar diasumsikan, tanpa pemeriksaan apa pun' },
              ],
              answer: 0,
              explain: {
                en: 'The calculus result, $\\pi r$, is exactly what the independent geometric formula (half of $2\\pi r$) predicts — two completely different methods arriving at the same number is strong confirmation.',
                id: 'Hasil kalkulusnya, $\\pi r$, persis apa yang diprediksi rumus geometris yang independen (setengah dari $2\\pi r$) — dua metode yang sama sekali berbeda sampai pada angka yang sama adalah konfirmasi yang kuat.',
              },
              hint: {
                en: 'The concept above computed the arc length integral one way, using calculus — think about what independent formula from plain geometry it was then compared against.',
                id: 'Konsep di atas menghitung integral panjang busurnya dengan satu cara, memakai kalkulus — pikirkan rumus independen apa dari geometri biasa yang kemudian dibandingkan dengannya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the figure above, why must the arc length of this semicircle equal exactly $3\\pi$?',
                id: 'Dengan membaca gambar di atas, mengapa panjang busur setengah lingkaran ini harus tepat $3\\pi$?',
              },
              figure: {
                dim: 2,
                xSpan: [-3.5, 3.5],
                ySpan: [-1, 4],
                ticks: true,
                items: [{ t: 'curve', f: 'sqrt(9-x^2)', from: -3, to: 3, color: 'a' }],
              },
              options: [
                { en: 'The radius is $3$, and a semicircle\'s arc is always half of $2\\pi r$', id: 'Jari-jarinya $3$, dan busur setengah lingkaran selalu setengah dari $2\\pi r$' },
                { en: 'The interval $[-3, 3]$ has length exactly $3\\pi$', id: 'Interval $[-3, 3]$ panjangnya tepat $3\\pi$' },
                { en: '$\\pi$ only appears because of a coincidence in this specific radius', id: '$\\pi$ hanya muncul karena kebetulan pada jari-jari tertentu ini' },
                { en: 'Arc length formulas always produce multiples of $\\pi$', id: 'Rumus panjang busur selalu menghasilkan kelipatan $\\pi$' },
              ],
              answer: 0,
              explain: {
                en: 'This curve is literally half a circle of radius $3$, and geometry has always said a full circumference is $2\\pi r$ — half of that, $\\pi r$, is $3\\pi$ here regardless of which method computes it.',
                id: 'Kurva ini secara harfiah setengah lingkaran berjari-jari $3$, dan geometri selalu menyatakan keliling penuh adalah $2\\pi r$ — setengahnya, $\\pi r$, adalah $3\\pi$ di sini tak peduli metode mana yang menghitungnya.',
              },
              hint: {
                en: "Read the radius directly off the curve's equation, $\\sqrt{9-x^2}$, and recall what fraction of a full circle's circumference a semicircle's arc always is.",
                id: 'Baca jari-jarinya langsung dari persamaan kurvanya, $\\sqrt{9-x^2}$, dan ingat berapa bagian dari keliling lingkaran penuh yang selalu menjadi busur setengah lingkaran.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the arc length of the upper semicircle of radius 5, $y = \\sqrt{25 - x^2}$, on $[-5, 5]$.',
                id: 'Cari panjang busur setengah lingkaran atas berjari-jari 5, $y = \\sqrt{25 - x^2}$, pada $[-5, 5]$.',
              },
              blanks: [{ answer: 5 * Math.PI }],
              hints: [
                { en: 'The arc length of a semicircle of radius $r$ is always $\\pi r$.', id: 'Panjang busur setengah lingkaran berjari-jari $r$ selalu $\\pi r$.' },
              ],
              explain: {
                en: '$5\\pi \\approx 15.71$.',
                id: '$5\\pi \\approx 15{,}71$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'int-m7-s1-p',
        runtime: 'math',
        title: { en: 'Measuring Curves', id: 'Mengukur Kurva' },
        brief: {
          en: 'A straight-line check, a worked curve, and a circular arc.',
          id: 'Satu pemeriksaan garis lurus, satu kurva yang dikerjakan, dan satu busur lingkaran.',
        },
        requirements: [
          { en: 'Set up $\\sqrt{1 + (f\')^2}$ first, then antidifferentiate.', id: 'Susun $\\sqrt{1 + (f\')^2}$ lebih dahulu, baru antiturunkan.' },
          { en: 'A semicircle of radius $r$ always has arc length $\\pi r$.', id: 'Setengah lingkaran berjari-jari $r$ selalu punya panjang busur $\\pi r$.' },
        ],
        tasks: [
          {
            prompt: { en: 'Find the arc length of $f(x) = 3x - 2$ on $[1, 4]$.', id: 'Cari panjang busur dari $f(x) = 3x - 2$ pada $[1, 4]$.' },
            blanks: [{ answer: 3 * Math.sqrt(10) }],
            solution: ["L=\\int_1^4\\sqrt{1+9}\\,dx = 3\\sqrt{10} \\approx 9{,}49"],
          },
          {
            prompt: { en: 'Find the arc length of $f(x) = x^3/6 + 1/(2x)$ on $[1, 2]$, using $F(x) = x^3/6 - 1/(2x)$.', id: 'Cari panjang busur dari $f(x) = x^3/6 + 1/(2x)$ pada $[1, 2]$, memakai $F(x) = x^3/6 - 1/(2x)$.' },
            blanks: [{ answer: 17 / 12 }],
            solution: ["F(2)=8/6-1/4=4/3-1/4=13/12, \\quad F(1)=1/6-1/2=-1/3", "L=13/12-(-1/3)=13/12+4/12=17/12 \\approx 1{,}42"],
          },
          {
            prompt: { en: 'Find the arc length of the upper semicircle of radius 2, on $[-2, 2]$.', id: 'Cari panjang busur setengah lingkaran atas berjari-jari 2, pada $[-2, 2]$.' },
            blanks: [{ answer: 2 * Math.PI }],
            solution: ['L = \\pi(2) = 2\\pi \\approx 6{,}28'],
          },
        ],
        hints: [
          { en: 'Part 2: keep the fractions exact (twelfths) rather than converting to decimals until the very last step.', id: 'Butir 2: pertahankan pecahannya eksak (per dua belas) alih-alih mengonversi ke desimal sampai langkah paling akhir.' },
        ],
        xp: 50,
      },
    },

    /* -------------------------------------------------- 7.2 surface area of revolution */
    {
      id: 'int-m7-s2',
      title: { en: 'Areas of Surfaces of Revolution', id: 'Luas Permukaan Benda Putar' },
      summary: {
        en: 'Wrapping arc length in a circumference to measure the surface a revolved curve sweeps out, checked against a sphere and a cone.',
        id: 'Membungkus panjang busur dengan sebuah keliling untuk mengukur permukaan yang disapu kurva yang diputar, diperiksa terhadap bola dan kerucut.',
      },
      lessons: [
        {
          id: 'int-m7-s2-l1',
          title: { en: 'The Surface Area Formula', id: 'Rumus Luas Permukaan' },
          goal: {
            en: 'Derive the surface area of revolution formula by attaching a circumference to each arc length element, and confirm it against a sphere.',
            id: 'Menurunkan rumus luas permukaan benda putar dengan memasangkan keliling pada tiap elemen panjang busur, dan memastikannya terhadap bola.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Each tiny arc sweeps out a thin ring', id: 'Tiap busur kecil menyapu cincin yang tipis' },
              body: {
                en: 'Rotating $y=f(x)$ about the $x$-axis, each tiny arc-length piece $dL = \\sqrt{1+(f\')^2}\\,dx$ sweeps out a thin ring (a truncated cone) of radius $f(x)$ and width $dL$. Its surface area is circumference times width, $2\\pi f(x)\\,dL$. Summing over the whole curve gives the **surface area of revolution**:\n$$S = \\int_a^b 2\\pi f(x)\\sqrt{1+\\big(f\'(x)\\big)^2}\\,dx$$\nEvery surface area problem is, structurally, an arc length problem with an extra $2\\pi f(x)$ folded in — the same square root, wrapped in a circumference.',
                id: 'Memutar $y=f(x)$ mengelilingi sumbu-$x$, tiap potongan panjang busur kecil $dL = \\sqrt{1+(f\')^2}\\,dx$ menyapu cincin tipis (kerucut terpotong) berjari-jari $f(x)$ dan lebar $dL$. Luas permukaannya adalah keliling dikali lebar, $2\\pi f(x)\\,dL$. Menjumlahkan pada seluruh kurva memberi **luas permukaan benda putar**:\n$$S = \\int_a^b 2\\pi f(x)\\sqrt{1+\\big(f\'(x)\\big)^2}\\,dx$$\nSetiap soal luas permukaan, secara struktural, adalah soal panjang busur dengan tambahan $2\\pi f(x)$ yang dilipat masuk — akar kuadrat yang sama, dibungkus dalam sebuah keliling.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The sphere, exactly', id: 'Bola, secara eksak' },
              body: {
                en: 'For $f(x)=\\sqrt{r^2-x^2}$ on $[-r,r]$, the last lesson already found $\\sqrt{1+(f\')^2} = \\frac{r}{\\sqrt{r^2-x^2}}$. Substituting into the surface area formula, the $\\sqrt{r^2-x^2}$ terms cancel completely:\n$$S = \\int_{-r}^r 2\\pi\\sqrt{r^2-x^2}\\cdot\\frac{r}{\\sqrt{r^2-x^2}}\\,dx = \\int_{-r}^r 2\\pi r\\,dx = 2\\pi r\\cdot(2r) = 4\\pi r^2$$\nRotating a semicircle all the way around sweeps out a full sphere, and $4\\pi r^2$ is exactly its surface area from geometry — another exact match, and for the same structural reason as the arc length check: the messy square root was always going to cancel against the very thing being rotated.',
                id: 'Untuk $f(x)=\\sqrt{r^2-x^2}$ pada $[-r,r]$, pelajaran sebelumnya sudah menemukan $\\sqrt{1+(f\')^2} = \\frac{r}{\\sqrt{r^2-x^2}}$. Mensubstitusikannya ke rumus luas permukaan, suku $\\sqrt{r^2-x^2}$-nya saling meniadakan sepenuhnya:\n$$S = \\int_{-r}^r 2\\pi\\sqrt{r^2-x^2}\\cdot\\frac{r}{\\sqrt{r^2-x^2}}\\,dx = \\int_{-r}^r 2\\pi r\\,dx = 2\\pi r\\cdot(2r) = 4\\pi r^2$$\nMemutar setengah lingkaran sepenuhnya menyapu bola utuh, dan $4\\pi r^2$ persis luas permukaannya dari geometri — kecocokan eksak lainnya, dan untuk alasan struktural yang sama seperti pemeriksaan panjang busur: akar kuadrat yang rumit itu memang akan selalu saling meniadakan dengan hal yang sedang diputar itu sendiri.',
              },
              figure: {
                dim: 2,
                xSpan: [-3.5, 3.5],
                ySpan: [-1, 4],
                ticks: true,
                items: [{ t: 'curve', f: 'sqrt(9-x^2)', from: -3, to: 3, color: 'a' }],
                caption: {
                  en: 'Rotating this radius-3 semicircle fully around the x-axis sweeps out a sphere — surface area $4\\pi(3)^2 = 36\\pi$, computed here without ever needing the sphere formula as an assumption.',
                  id: 'Memutar setengah lingkaran berjari-jari 3 ini sepenuhnya mengelilingi sumbu-x menyapu sebuah bola — luas permukaan $4\\pi(3)^2 = 36\\pi$, dihitung di sini tanpa pernah memerlukan rumus bola sebagai asumsi.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'How does the surface area of revolution formula relate to the arc length formula?',
                id: 'Bagaimana rumus luas permukaan benda putar berkaitan dengan rumus panjang busur?',
              },
              options: [
                { en: "It is the arc length integrand multiplied by $2\\pi f(x)$, the circumference swept out at each point", id: "Ia adalah integrand panjang busur dikalikan $2\\pi f(x)$, keliling yang disapu di tiap titik" },
                { en: 'The two formulas are completely unrelated', id: 'Kedua rumus sama sekali tak berkaitan' },
                { en: 'Surface area is always exactly double the arc length', id: 'Luas permukaan selalu tepat dua kali panjang busur' },
                { en: 'It replaces the square root with a constant', id: 'Ia mengganti akar kuadratnya dengan konstanta' },
              ],
              answer: 0,
              explain: {
                en: "Each infinitesimal arc-length piece, when rotated, sweeps out a thin ring whose area is that piece's length times the circumference at that point — $2\\pi f(x)$ attached directly onto the same $\\sqrt{1+(f')^2}$ term.",
                id: "Tiap potongan panjang busur yang sangat kecil, ketika diputar, menyapu cincin tipis yang luasnya adalah panjang potongan itu dikali keliling di titik itu — $2\\pi f(x)$ dipasang langsung pada suku $\\sqrt{1+(f')^2}$ yang sama.",
              },
              hint: {
                en: "Compare the two integrands side by side — the surface area formula's integrand still has the same square root inside it as arc length's. What extra factor has been multiplied onto it?",
                id: 'Bandingkan kedua integrand berdampingan — integrand luas permukaan masih punya akar kuadrat yang sama di dalamnya seperti panjang busur. Faktor tambahan apa yang telah dikalikan padanya?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the figure above, what solid does rotating this semicircle fully around the x-axis produce?',
                id: 'Dengan membaca gambar di atas, benda apa yang dihasilkan memutar setengah lingkaran ini sepenuhnya mengelilingi sumbu-x?',
              },
              figure: {
                dim: 2,
                xSpan: [-3.5, 3.5],
                ySpan: [-1, 4],
                ticks: true,
                items: [{ t: 'curve', f: 'sqrt(9-x^2)', from: -3, to: 3, color: 'a' }],
              },
              options: [
                { en: 'A sphere', id: 'Sebuah bola' },
                { en: 'A cone', id: 'Sebuah kerucut' },
                { en: 'A cylinder', id: 'Sebuah silinder' },
                { en: 'A torus (a ring shape)', id: 'Sebuah torus (bentuk cincin)' },
              ],
              answer: 0,
              explain: {
                en: 'A semicircle rotated a full turn around its diameter sweeps out exactly a sphere of the same radius — the shape a semicircle is famous for producing.',
                id: 'Setengah lingkaran yang diputar satu putaran penuh mengelilingi diameternya menyapu tepat sebuah bola dengan jari-jari yang sama — bentuk yang terkenal dihasilkan oleh setengah lingkaran.',
              },
              hint: {
                en: 'Picture spinning this half-disk boundary all the way around the x-axis, its diameter — what three-dimensional shape does a semicircle famously trace out when it does a full turn?',
                id: 'Bayangkan memutar batas setengah cakram ini sepenuhnya mengelilingi sumbu-x, diameternya — bentuk tiga dimensi apa yang terkenal dijejaki setengah lingkaran ketika berputar satu putaran penuh?',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the surface area of the sphere formed by rotating the semicircle of radius 4 around the x-axis.',
                id: 'Cari luas permukaan bola yang terbentuk dari memutar setengah lingkaran berjari-jari 4 mengelilingi sumbu-x.',
              },
              blanks: [{ answer: 64 * Math.PI }],
              hints: [
                { en: '$S = 4\\pi r^2$.', id: '$S = 4\\pi r^2$.' },
              ],
              explain: {
                en: '$4\\pi(16) = 64\\pi \\approx 201.06$.',
                id: '$4\\pi(16) = 64\\pi \\approx 201{,}06$.',
              },
            },
          ],
        },
        {
          id: 'int-m7-s2-l2',
          title: { en: 'The Lateral Surface of a Cone', id: 'Luas Permukaan Selimut Kerucut' },
          goal: {
            en: 'Apply the surface area formula to a straight line and confirm it against the cone lateral surface formula from geometry.',
            id: 'Menerapkan rumus luas permukaan pada garis lurus dan memastikannya terhadap rumus luas selimut kerucut dari geometri.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A slanted line, rotated into a cone', id: 'Garis miring, diputar menjadi kerucut' },
              body: {
                en: 'Rotate $f(x)=\\frac{r}{h}x$ on $[0,h]$ about the $x$-axis — a line from the origin to $(h,r)$, sweeping out a cone of base radius $r$ and height $h$. Here $f\'(x)=\\frac{r}{h}$ is constant, so $\\sqrt{1+(f\')^2} = \\sqrt{1+\\frac{r^2}{h^2}} = \\frac{\\sqrt{h^2+r^2}}{h} = \\frac{l}{h}$, where $l=\\sqrt{h^2+r^2}$ is the cone\'s **slant height** — the actual length of the slanted line from apex to rim.\n$$S = \\int_0^h 2\\pi\\cdot\\frac{r}{h}x\\cdot\\frac{l}{h}\\,dx = \\frac{2\\pi rl}{h^2}\\int_0^h x\\,dx = \\frac{2\\pi rl}{h^2}\\cdot\\frac{h^2}{2} = \\pi r l$$',
                id: 'Putar $f(x)=\\frac{r}{h}x$ pada $[0,h]$ mengelilingi sumbu-$x$ — garis dari titik asal ke $(h,r)$, menyapu kerucut dengan jari-jari alas $r$ dan tinggi $h$. Di sini $f\'(x)=\\frac{r}{h}$ konstan, sehingga $\\sqrt{1+(f\')^2} = \\sqrt{1+\\frac{r^2}{h^2}} = \\frac{\\sqrt{h^2+r^2}}{h} = \\frac{l}{h}$, dengan $l=\\sqrt{h^2+r^2}$ adalah **garis pelukis** kerucutnya — panjang sebenarnya dari garis miring dari puncak ke tepi.\n$$S = \\int_0^h 2\\pi\\cdot\\frac{r}{h}x\\cdot\\frac{l}{h}\\,dx = \\frac{2\\pi rl}{h^2}\\int_0^h x\\,dx = \\frac{2\\pi rl}{h^2}\\cdot\\frac{h^2}{2} = \\pi r l$$',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Matching the geometry formula, with real numbers', id: 'Cocok dengan rumus geometri, dengan angka sungguhan' },
              body: {
                en: '$\\pi r l$ is exactly the cone lateral surface area formula from geometry — derived here from an integral instead of assumed. For $r=3$, $h=4$: $l=\\sqrt{16+9}=\\sqrt{25}=5$ (a 3-4-5 right triangle), so $S=\\pi(3)(5)=15\\pi\\approx 47.12$.\n\nThe pattern across this whole module is the same each time: set up the integral honestly from the formula, and it reproduces a fact geometry already knew — proof that the formula itself, not just these particular examples, is trustworthy.',
                id: '$\\pi r l$ persis rumus luas permukaan selimut kerucut dari geometri — diturunkan di sini dari sebuah integral alih-alih diasumsikan. Untuk $r=3$, $h=4$: $l=\\sqrt{16+9}=\\sqrt{25}=5$ (segitiga siku-siku 3-4-5), sehingga $S=\\pi(3)(5)=15\\pi\\approx 47.12$.\n\nPola di seluruh modul ini sama setiap kali: susun integralnya secara jujur dari rumusnya, dan ia mereproduksi fakta yang sudah diketahui geometri — bukti bahwa rumusnya sendiri, bukan hanya contoh tertentu ini, bisa dipercaya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: "What role does the cone's slant height $l$ play in the surface area formula $S = \\pi r l$?",
                id: 'Apa peran garis pelukis kerucut $l$ dalam rumus luas permukaan $S = \\pi r l$?',
              },
              options: [
                { en: "It is the actual length of the rotated line, arising from $\\sqrt{1+(f')^2}$ in the surface area integral", id: "Ia adalah panjang sebenarnya dari garis yang diputar, muncul dari $\\sqrt{1+(f')^2}$ pada integral luas permukaan" },
                { en: 'It is just another name for the height $h$', id: 'Hanya nama lain untuk tinggi $h$' },
                { en: 'It has no geometric meaning at all', id: 'Sama sekali tak punya makna geometris' },
                { en: 'It is always equal to the radius $r$', id: 'Selalu sama dengan jari-jari $r$' },
              ],
              answer: 0,
              explain: {
                en: "The slant height is exactly what the arc-length factor $\\sqrt{1+(f')^2}$ measures for a straight line — the true length of the segment being swept, as opposed to $h$, which is only its horizontal projection.",
                id: "Garis pelukis persis apa yang diukur faktor panjang-busur $\\sqrt{1+(f')^2}$ untuk garis lurus — panjang sebenarnya segmen yang disapu, berbeda dari $h$, yang hanya proyeksi mendatarnya.",
              },
              hint: {
                en: "Trace back to where $l$ came from in the derivation above — it replaced $\\sqrt{1+(f')^2}$ for this particular line. What does that square-root factor measure for a straight segment, as opposed to just its horizontal run $h$?",
                id: 'Telusuri dari mana $l$ berasal pada penurunan di atas — ia menggantikan $\\sqrt{1+(f\')^2}$ untuk garis khusus ini. Apa yang diukur faktor akar kuadrat itu untuk sebuah segmen lurus, berbeda dari sekadar jalan mendatarnya $h$?',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the steps that find the lateral surface area of a cone with $r = 6$, $h = 8$.',
                id: 'Susun langkah yang mencari luas permukaan selimut kerucut dengan $r = 6$, $h = 8$.',
              },
              lines: [
                'l = \\sqrt{h^2+r^2} = \\sqrt{64+36} = \\sqrt{100} = 10',
                'S = \\pi r l',
                'S = \\pi(6)(10) = 60\\pi',
              ],
              explain: {
                en: 'Find the slant height first from the Pythagorean theorem, then substitute both $r$ and $l$ into the formula, then multiply out.',
                id: 'Cari garis pelukisnya lebih dahulu dari teorema Pythagoras, lalu substitusikan $r$ dan $l$ ke rumusnya, baru kalikan.',
              },
              hint: {
                en: "You can't substitute a numeric value for $l$ into the formula until the Pythagorean theorem has actually produced one — and you can't multiply out a final number until both $r$ and $l$ have been substituted in.",
                id: 'Kamu tak bisa mensubstitusikan nilai numerik untuk $l$ ke rumusnya sebelum teorema Pythagoras benar-benar menghasilkannya — dan kamu tak bisa mengalikan hasil akhirnya sebelum $r$ dan $l$ keduanya disubstitusikan.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the lateral surface area of a cone with base radius 5 and height 12 (a 5-12-13 triangle).',
                id: 'Cari luas permukaan selimut kerucut dengan jari-jari alas 5 dan tinggi 12 (segitiga 5-12-13).',
              },
              blanks: [{ answer: 65 * Math.PI }],
              hints: [
                { en: '$l = \\sqrt{144+25} = 13$.', id: '$l = \\sqrt{144+25} = 13$.' },
              ],
              explain: {
                en: '$S = \\pi(5)(13) = 65\\pi \\approx 204.20$.',
                id: '$S = \\pi(5)(13) = 65\\pi \\approx 204{,}20$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'int-m7-s2-p',
        runtime: 'math',
        title: { en: 'Surfaces Swept by Revolution', id: 'Permukaan yang Disapu Benda Putar' },
        brief: {
          en: 'A sphere, a cone, and one surface area computed directly from the integral formula.',
          id: 'Sebuah bola, sebuah kerucut, dan satu luas permukaan dihitung langsung dari rumus integral.',
        },
        requirements: [
          { en: 'A sphere\'s surface area is $4\\pi r^2$, always.', id: 'Luas permukaan bola selalu $4\\pi r^2$.' },
          { en: 'A cone\'s lateral surface area needs the slant height, not the height itself.', id: 'Luas permukaan selimut kerucut memerlukan garis pelukis, bukan tingginya sendiri.' },
        ],
        tasks: [
          {
            prompt: { en: 'Find the surface area of the sphere of radius 6.', id: 'Cari luas permukaan bola berjari-jari 6.' },
            blanks: [{ answer: 144 * Math.PI }],
            solution: ['S = 4\\pi(36) = 144\\pi \\approx 452{,}39'],
          },
          {
            prompt: { en: 'Find the lateral surface area of a cone with $r = 9$, $h = 12$ (a 9-12-15 triangle).', id: 'Cari luas permukaan selimut kerucut dengan $r = 9$, $h = 12$ (segitiga 9-12-15).' },
            blanks: [{ answer: 135 * Math.PI }],
            solution: ['l=15, \\quad S=\\pi(9)(15)=135\\pi \\approx 424{,}12'],
          },
          {
            prompt: { en: 'Find the surface area from rotating $f(x) = 4x$ on $[0, 2]$ about the x-axis (a cone: find $r$ and $h$ first, then use $S = \\pi r l$).', id: 'Cari luas permukaan dari memutar $f(x) = 4x$ pada $[0, 2]$ mengelilingi sumbu-x (sebuah kerucut: cari $r$ dan $h$ lebih dahulu, baru pakai $S = \\pi r l$).' },
            blanks: [{ answer: 16 * Math.sqrt(17) * Math.PI, tol: 0.5 }],
            solution: ['h=2, \\ r=f(2)=8, \\quad l=\\sqrt{4+64}=\\sqrt{68}=2\\sqrt{17}', 'S=\\pi(8)(2\\sqrt{17})=16\\sqrt{17}\\pi \\approx 207{,}17'],
          },
        ],
        hints: [
          { en: 'Part 3: the height $h$ is the $x$-interval\'s width, and the radius $r$ is $f$ evaluated at the far end, $x = 2$.', id: 'Butir 3: tinggi $h$ adalah lebar interval $x$-nya, dan jari-jari $r$ adalah $f$ yang dievaluasi di ujung jauhnya, $x = 2$.' },
        ],
        xp: 50,
      },
    },
  ],
}
