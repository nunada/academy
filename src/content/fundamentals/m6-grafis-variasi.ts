import type { Module } from '../types'

/** Module 6 — a graph as a second way to solve, not just a picture of the
 *  answer; and variation, the pattern behind almost every formula in the
 *  sciences that isn't already familiar from this chapter. */
export const module6: Module = {
  id: 'dsr-m6',
  title: { en: 'Graphical Solutions and Variation', id: 'Solusi Grafis dan Variasi' },
  summary: {
    en: 'Solving an equation by finding where a graph crosses zero or where two graphs meet, and modeling with direct, inverse, and joint variation.',
    id: 'Menyelesaikan persamaan dengan mencari tempat grafik memotong nol atau tempat dua grafik bertemu, dan memodelkan dengan variasi langsung, terbalik, dan gabungan.',
  },
  submodules: [
    /* --------------------------------------------- 1.11 solving graphically */
    {
      id: 'dsr-m6-s1',
      title: { en: 'Solving Graphically', id: 'Menyelesaikan Secara Grafis' },
      summary: {
        en: 'An equation\'s solutions are the x-intercepts of a graph, or the intersection points of two graphs.',
        id: 'Solusi sebuah persamaan adalah perpotongan-x sebuah grafik, atau titik perpotongan dua grafik.',
      },
      lessons: [
        {
          id: 'dsr-m6-s1-l1',
          title: { en: 'Reading Solutions and Intersections off a Graph', id: 'Membaca Solusi dan Perpotongan dari Grafik' },
          goal: {
            en: 'Solve an equation graphically by finding x-intercepts, and solve a system by finding where two graphs intersect.',
            id: 'Menyelesaikan persamaan secara grafis dengan mencari perpotongan-x, dan menyelesaikan sistem dengan mencari tempat dua grafik berpotongan.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A solution is an x-intercept', id: 'Solusi adalah perpotongan-x' },
              body: {
                en: 'To solve $3x-5=0$ graphically, graph $y=3x-5$ — every solution of the original equation is exactly an **$x$-intercept** of this graph, since that is precisely where $y=0$. The algebraic method gives an exact answer, $x=\\frac{5}{3}$; the graphical method gives a numerical read-off, useful whenever the algebra is hard or impossible.\n\nThe same idea handles inequalities: to solve $3x-5>0$, find where the graph of $y=3x-5$ sits **above** the $x$-axis.',
                id: 'Untuk menyelesaikan $3x-5=0$ secara grafis, gambar $y=3x-5$ — setiap solusi persamaan aslinya persis **perpotongan-$x$** grafik ini, sebab itulah tempat $y=0$ persisnya. Metode aljabar memberi jawaban eksak, $x=\\frac{5}{3}$; metode grafis memberi pembacaan numerik, berguna kapan pun aljabarnya sulit atau mustahil.\n\nGagasan yang sama menangani pertidaksamaan: untuk menyelesaikan $3x-5>0$, cari tempat grafik $y=3x-5$ berada **di atas** sumbu-$x$.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Two graphs meeting is also solving an equation', id: 'Dua grafik bertemu juga sama dengan menyelesaikan persamaan' },
              body: {
                en: 'Solving $f(x)=g(x)$ is the same problem as finding where the graphs of $y=f(x)$ and $y=g(x)$ **intersect** — at an intersection, both curves share the same $(x,y)$, so that $x$ satisfies $f(x)=g(x)$.\n\nDrag the slider: it moves the line $y=x+k$ up and down against the fixed parabola $y=x^2$. Solving $x^2=x+k$ means $x^2-x-k=0$, with discriminant $1+4k$. Watch the two intersection points merge into one tangency and then disappear as $k$ drops below $-\\frac{1}{4}$ — exactly where $1+4k=0$.',
                id: 'Menyelesaikan $f(x)=g(x)$ adalah masalah yang sama dengan mencari tempat grafik $y=f(x)$ dan $y=g(x)$ **berpotongan** — di titik perpotongan, kedua kurva berbagi $(x,y)$ yang sama, sehingga $x$ itu memenuhi $f(x)=g(x)$.\n\nGeser penggesernya: ia menggerakkan garis $y=x+k$ naik-turun terhadap parabola tetap $y=x^2$. Menyelesaikan $x^2=x+k$ berarti $x^2-x-k=0$, dengan diskriminan $1+4k$. Amati kedua titik perpotongan menyatu menjadi satu singgungan lalu lenyap saat $k$ turun di bawah $-\\frac{1}{4}$ — persis di tempat $1+4k=0$.',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 4],
                ySpan: [-3, 8],
                ticks: true,
                params: [{ name: 'k', min: -2, max: 3, step: 0.25, value: 1, label: 'k' }],
                items: [
                  { t: 'curve', f: 'x^2', color: 'a', label: 'y=x^2' },
                  { t: 'curve', f: 'x+k', color: 'b', label: 'y=x+k' },
                  { t: 'dot', x: '0.5+sqrt(0.25+k)', y: '(0.5+sqrt(0.25+k))^2', color: 'result' },
                  { t: 'dot', x: '0.5-sqrt(0.25+k)', y: '(0.5-sqrt(0.25+k))^2', color: 'result' },
                ],
                caption: {
                  en: 'The dots mark where $x^2 = x+k$ — they exist only while $k \\geq -\\frac{1}{4}$.',
                  id: 'Titik-titik itu menandai tempat $x^2 = x+k$ — hanya ada selama $k \\geq -\\frac{1}{4}$.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Solving $f(x) = g(x)$ graphically means finding:',
                id: 'Menyelesaikan $f(x) = g(x)$ secara grafis berarti mencari:',
              },
              options: [
                { en: 'The $x$-coordinates where the graphs of $y=f(x)$ and $y=g(x)$ intersect', id: 'Koordinat-$x$ tempat grafik $y=f(x)$ dan $y=g(x)$ berpotongan' },
                { en: 'The $y$-intercept of $f$ only', id: 'Perpotongan-$y$ dari $f$ saja' },
                { en: 'The highest point on either graph', id: 'Titik tertinggi pada salah satu grafik' },
                { en: 'Where $f$ is increasing', id: 'Tempat $f$ naik' },
              ],
              answer: 0,
              explain: {
                en: 'At an intersection point, both graphs share the same $y$-value for that $x$ — exactly the condition $f(x)=g(x)$.',
                id: 'Pada titik perpotongan, kedua grafik berbagi nilai-$y$ yang sama untuk $x$ itu — persis syarat $f(x)=g(x)$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'In the figure above, at roughly what value of $k$ does the line become tangent to the parabola (exactly one intersection)?',
                id: 'Pada gambar di atas, kira-kira di nilai $k$ berapa garisnya menjadi menyinggung parabolanya (persis satu perpotongan)?',
              },
              options: [
                { en: '$k = -0.25$', id: '$k = -0.25$' },
                { en: '$k = 0$', id: '$k = 0$' },
                { en: '$k = 2$', id: '$k = 2$' },
                { en: '$k = -2$', id: '$k = -2$' },
              ],
              answer: 0,
              explain: {
                en: 'Tangency happens exactly when the discriminant $1+4k=0$, i.e. $k=-\\frac{1}{4}=-0.25$.',
                id: 'Singgungan terjadi persis ketika diskriminan $1+4k=0$, yaitu $k=-\\frac{1}{4}=-0.25$.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'To solve $2x^2 - 3 = 0$ graphically, which graph\'s $x$-intercepts give the solutions?',
                id: 'Untuk menyelesaikan $2x^2 - 3 = 0$ secara grafis, perpotongan-$x$ grafik yang mana yang memberi solusinya?',
              },
              template: 'y = ___',
              blanks: ['2x^2-3'],
              explain: {
                en: 'Move everything to one side and graph the result as $y=2x^2-3$; the $x$-intercepts of this graph are the solutions of the original equation.',
                id: 'Pindahkan semuanya ke satu ruas dan gambar hasilnya sebagai $y=2x^2-3$; perpotongan-$x$ grafik ini adalah solusi persamaan aslinya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the positive $x$-value where the graphs of $y=x^2$ and $y=x+6$ intersect.',
                id: 'Cari nilai $x$ positif tempat grafik $y=x^2$ dan $y=x+6$ berpotongan.',
              },
              blanks: [{ answer: 3 }],
              hints: [
                { en: 'Set $x^2=x+6$ and solve the resulting quadratic.', id: 'Tetapkan $x^2=x+6$ dan selesaikan kuadrat yang dihasilkan.' },
              ],
              explain: {
                en: '$x^2-x-6=0 \\Rightarrow (x-3)(x+2)=0 \\Rightarrow x=3$ or $x=-2$; the positive one is $3$.',
                id: '$x^2-x-6=0 \\Rightarrow (x-3)(x+2)=0 \\Rightarrow x=3$ atau $x=-2$; yang positif adalah $3$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'dsr-m6-s1-p',
        runtime: 'math',
        title: { en: 'Solving Graphically', id: 'Menyelesaikan Secara Grafis' },
        brief: {
          en: 'An x-intercept problem and two intersection-point problems.',
          id: 'Satu soal perpotongan-x dan dua soal titik perpotongan.',
        },
        requirements: [
          { en: 'A solution of $f(x)=g(x)$ is exactly the $x$-coordinate of a point where the two graphs meet.', id: 'Solusi dari $f(x)=g(x)$ persis koordinat-$x$ dari titik tempat kedua grafik bertemu.' },
        ],
        tasks: [
          {
            prompt: { en: 'Find the positive $x$-intercept of $y = x^2 - 10$. (Round to two decimal places.)', id: 'Cari perpotongan-$x$ positif dari $y = x^2 - 10$. (Bulatkan ke dua desimal.)' },
            blanks: [{ answer: Math.sqrt(10), tol: 0.01 }],
            solution: ['x^2=10 \\Rightarrow x=\\sqrt{10}\\approx3{,}16'],
          },
          {
            prompt: { en: 'Find the positive $x$-value where $y=x^2$ and $y=2x+8$ intersect.', id: 'Cari nilai $x$ positif tempat $y=x^2$ dan $y=2x+8$ berpotongan.' },
            blanks: [{ answer: 4 }],
            solution: ['x^2-2x-8=0 \\Rightarrow (x-4)(x+2)=0 \\Rightarrow x=4'],
          },
          {
            prompt: { en: 'Find the negative $x$-value where $y=x^2$ and $y=2x+8$ intersect.', id: 'Cari nilai $x$ negatif tempat $y=x^2$ dan $y=2x+8$ berpotongan.' },
            blanks: [{ answer: -2 }],
            solution: ['x^2-2x-8=0 \\Rightarrow (x-4)(x+2)=0 \\Rightarrow x=-2'],
          },
        ],
        hints: [
          { en: 'Setting the two right-hand sides equal turns an intersection problem into an ordinary equation to solve.', id: 'Menyamakan kedua ruas kanan mengubah soal perpotongan menjadi persamaan biasa untuk diselesaikan.' },
        ],
        xp: 50,
      },
    },

    /* --------------------------------------------------- 1.12 variation */
    {
      id: 'dsr-m6-s2',
      title: { en: 'Modeling Variation', id: 'Memodelkan Variasi' },
      summary: {
        en: 'Direct, inverse, and joint variation — the recurring pattern behind formulas throughout the sciences.',
        id: 'Variasi langsung, terbalik, dan gabungan — pola berulang di balik formula di seluruh sains.',
      },
      lessons: [
        {
          id: 'dsr-m6-s2-l1',
          title: { en: 'Direct and Inverse Variation', id: 'Variasi Langsung dan Terbalik' },
          goal: {
            en: 'Find the constant of proportionality for direct and inverse variation, and use it to predict a new value.',
            id: 'Mencari konstanta proporsionalitas untuk variasi langsung dan terbalik, dan memakainya untuk memprediksi nilai baru.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Direct variation: a constant multiple', id: 'Variasi langsung: kelipatan konstan' },
              body: {
                en: '$y$ **varies directly** as $x$ (or is **proportional** to $x$) when $y=kx$ for a fixed **constant of proportionality** $k$ — the graph is a line through the origin with slope $k$.\n\nThunder from a storm $5400$ ft away takes $5$ s to arrive; distance $d$ varies directly with time $t$: $d=kt \\Rightarrow 5400=k(5) \\Rightarrow k=1080$ (roughly the speed of sound, in ft/s). At $t=8$ s: $d=1080(8)=8640$ ft.',
                id: '$y$ **bervariasi langsung** terhadap $x$ (atau **sebanding** dengan $x$) ketika $y=kx$ untuk **konstanta proporsionalitas** $k$ yang tetap — grafiknya garis melalui titik asal berkemiringan $k$.\n\nGuntur dari badai sejauh $5400$ kaki butuh $5$ detik untuk tiba; jarak $d$ bervariasi langsung terhadap waktu $t$: $d=kt \\Rightarrow 5400=k(5) \\Rightarrow k=1080$ (kira-kira cepat rambat bunyi, dalam kaki/detik). Di $t=8$ detik: $d=1080(8)=8640$ kaki.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Inverse variation: bigger one way, smaller the other', id: 'Variasi terbalik: makin besar di satu sisi, makin kecil di sisi lain' },
              body: {
                en: '$y$ **varies inversely** as $x$ when $y=\\dfrac{k}{x}$ — as one grows, the other shrinks.\n\nBoyle\'s Law: a gas\'s pressure varies inversely with its volume. A sample at $V=0.106\\text{ m}^3$ has $P=50$ kPa: $k=PV=50(0.106)=5.3$. At $V=0.3\\text{ m}^3$: $P=\\dfrac{5.3}{0.3}\\approx17.7$ kPa.\n\nDrag the slider: it changes $k$ in $y=\\dfrac{k}{x}$, tightening or loosening the curve without changing its basic shape.',
                id: '$y$ **bervariasi terbalik** terhadap $x$ ketika $y=\\dfrac{k}{x}$ — saat yang satu membesar, yang lain mengecil.\n\nHukum Boyle: tekanan gas bervariasi terbalik terhadap volumenya. Sampel pada $V=0.106\\text{ m}^3$ punya $P=50$ kPa: $k=PV=50(0.106)=5.3$. Di $V=0.3\\text{ m}^3$: $P=\\dfrac{5.3}{0.3}\\approx17.7$ kPa.\n\nGeser penggesernya: ia mengubah $k$ pada $y=\\dfrac{k}{x}$, mengencangkan atau mengendurkan kurvanya tanpa mengubah bentuk dasarnya.',
              },
              figure: {
                dim: 2,
                xSpan: [0.1, 6],
                ySpan: [0, 10],
                ticks: true,
                params: [{ name: 'k', min: 1, max: 10, step: 0.5, value: 5.3, label: 'k' }],
                items: [{ t: 'curve', f: 'k/x', color: 'a' }],
                caption: {
                  en: '$y = k/x$ for $x>0$ — larger $k$ pushes the curve farther from the axes.',
                  id: '$y = k/x$ untuk $x>0$ — $k$ yang lebih besar mendorong kurvanya menjauh dari sumbu-sumbunya.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'If $y$ varies directly as $x$, and $y = 20$ when $x = 4$, what is $y$ when $x = 10$?',
                id: 'Jika $y$ bervariasi langsung terhadap $x$, dan $y = 20$ ketika $x = 4$, berapa $y$ ketika $x = 10$?',
              },
              options: [
                { en: '$50$', id: '$50$' },
                { en: '$26$', id: '$26$' },
                { en: '$8$', id: '$8$' },
                { en: '$200$', id: '$200$' },
              ],
              answer: 0,
              explain: {
                en: '$k=\\frac{20}{4}=5$, so $y=5(10)=50$.',
                id: '$k=\\frac{20}{4}=5$, sehingga $y=5(10)=50$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'If $y$ varies inversely as $x$, and $y = 8$ when $x = 3$, what is $y$ when $x = 6$?',
                id: 'Jika $y$ bervariasi terbalik terhadap $x$, dan $y = 8$ ketika $x = 3$, berapa $y$ ketika $x = 6$?',
              },
              options: [
                { en: '$4$', id: '$4$' },
                { en: '$16$', id: '$16$' },
                { en: '$2$', id: '$2$' },
                { en: '$24$', id: '$24$' },
              ],
              answer: 0,
              explain: {
                en: '$k=xy=3(8)=24$, so at $x=6$: $y=\\frac{24}{6}=4$ — doubling $x$ halved $y$, exactly as inverse variation predicts.',
                id: '$k=xy=3(8)=24$, sehingga di $x=6$: $y=\\frac{24}{6}=4$ — menggandakan $x$ membelah dua $y$, persis seperti diprediksi variasi terbalik.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Thunder from a storm $3240$ ft away takes $3$ s to arrive. Find the constant of proportionality $k$ in $d = kt$.',
                id: 'Guntur dari badai sejauh $3240$ kaki butuh $3$ detik untuk tiba. Cari konstanta proporsionalitas $k$ pada $d = kt$.',
              },
              template: 'k = \\dfrac{3240}{3} = ___',
              blanks: ['1080'],
              explain: {
                en: '$k=\\frac{3240}{3}=1080$ — the same speed of sound as the worked example, just different numbers.',
                id: '$k=\\frac{3240}{3}=1080$ — cepat rambat bunyi yang sama seperti contoh yang dikerjakan, hanya angkanya berbeda.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'A gas sample has $P = 40$ kPa at $V = 0.2 \\text{ m}^3$. Find $P$ when $V = 0.5 \\text{ m}^3$.',
                id: 'Sampel gas punya $P = 40$ kPa pada $V = 0.2 \\text{ m}^3$. Cari $P$ ketika $V = 0.5 \\text{ m}^3$.',
              },
              blanks: [{ answer: 16 }],
              hints: [
                { en: '$k = PV = 40(0.2)$.', id: '$k = PV = 40(0.2)$.' },
              ],
              explain: {
                en: '$k=8$, so $P=\\dfrac{8}{0.5}=16$ kPa.',
                id: '$k=8$, sehingga $P=\\dfrac{8}{0.5}=16$ kPa.',
              },
            },
          ],
        },
        {
          id: 'dsr-m6-s2-l2',
          title: { en: 'Joint Variation and Combined Models', id: 'Variasi Gabungan dan Model Kombinasi' },
          goal: {
            en: 'Set up a joint or combined variation model, and use it to predict the effect of changing several quantities at once.',
            id: 'Menyusun model variasi gabungan atau kombinasi, dan memakainya untuk memprediksi efek mengubah beberapa kuantitas sekaligus.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Joint variation, and inverse-square laws', id: 'Variasi gabungan, dan hukum kuadrat-terbalik' },
              body: {
                en: '$z$ **varies jointly** as $x$ and $y$ when $z=kxy$; variation types combine freely, direct with some variables and inverse with others in the same formula.\n\nThe apparent brightness $B$ of a light source is directly proportional to its luminosity $L$ and inversely proportional to the **square** of the distance $d$:\n$$B = k\\frac{L}{d^2}$$\nThis **inverse-square law** pattern also describes gravity — Newton\'s Law, $F=G\\dfrac{m_1m_2}{r^2}$, is $F$ jointly proportional to $m_1$ and $m_2$, inversely proportional to $r^2$.',
                id: '$z$ **bervariasi gabungan** terhadap $x$ dan $y$ ketika $z=kxy$; jenis-jenis variasi bergabung secara bebas, langsung untuk sebagian variabel dan terbalik untuk yang lain dalam formula yang sama.\n\nKecerahan tampak $B$ dari sumber cahaya berbanding langsung dengan luminositasnya $L$ dan berbanding terbalik dengan **kuadrat** jaraknya $d$:\n$$B = k\\frac{L}{d^2}$$\nPola **hukum kuadrat-terbalik** ini juga mendeskripsikan gravitasi — Hukum Newton, $F=G\\dfrac{m_1m_2}{r^2}$, adalah $F$ berbanding gabungan dengan $m_1$ dan $m_2$, berbanding terbalik dengan $r^2$.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Predicting the effect of a combined change', id: 'Memprediksi efek perubahan gabungan' },
              body: {
                en: 'Substitute the **new** values directly into the model to see the effect — no need to ever find $k$ itself. Doubling the distance in $B=k\\dfrac{L}{d^2}$:\n$$B_{\\text{new}} = k\\frac{L}{(2d)^2} = \\frac{1}{4} \\cdot k\\frac{L}{d^2} = \\frac{1}{4} B$$\nHalving the distance **and** tripling the luminosity:\n$$B_{\\text{new}} = k\\frac{3L}{(d/2)^2} = 3 \\cdot 4 \\cdot k\\frac{L}{d^2} = 12B$$',
                id: 'Substitusikan nilai **baru** langsung ke modelnya untuk melihat efeknya — tak perlu pernah mencari $k$ itu sendiri. Menggandakan jarak pada $B=k\\dfrac{L}{d^2}$:\n$$B_{\\text{baru}} = k\\frac{L}{(2d)^2} = \\frac{1}{4} \\cdot k\\frac{L}{d^2} = \\frac{1}{4} B$$\nMembelah dua jarak **dan** melipatgandakan tiga luminositasnya:\n$$B_{\\text{baru}} = k\\frac{3L}{(d/2)^2} = 3 \\cdot 4 \\cdot k\\frac{L}{d^2} = 12B$$',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'If $z$ varies jointly as $x$ and $y$, and $z=60$ when $x=4, y=5$, what is $k$?',
                id: 'Jika $z$ bervariasi gabungan terhadap $x$ dan $y$, dan $z=60$ ketika $x=4, y=5$, berapa $k$?',
              },
              options: [
                { en: '$3$', id: '$3$' },
                { en: '$12$', id: '$12$' },
                { en: '$1200$', id: '$1200$' },
                { en: '$0.33$', id: '$0.33$' },
              ],
              answer: 0,
              explain: {
                en: '$z=kxy \\Rightarrow 60=k(4)(5)=20k \\Rightarrow k=3$.',
                id: '$z=kxy \\Rightarrow 60=k(4)(5)=20k \\Rightarrow k=3$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'In $F = G\\dfrac{m_1m_2}{r^2}$, if $r$ is tripled, the force becomes:',
                id: 'Pada $F = G\\dfrac{m_1m_2}{r^2}$, jika $r$ dilipatgandakan tiga, gayanya menjadi:',
              },
              options: [
                { en: '$\\frac{1}{9}$ of the original', id: '$\\frac{1}{9}$ dari semula' },
                { en: '$3$ times the original', id: '$3$ kali semula' },
                { en: '$\\frac{1}{3}$ of the original', id: '$\\frac{1}{3}$ dari semula' },
                { en: '$9$ times the original', id: '$9$ kali semula' },
              ],
              answer: 0,
              explain: {
                en: 'Replacing $r$ with $3r$ gives $\\dfrac{1}{(3r)^2}=\\dfrac{1}{9r^2}$ — an inverse-square law shrinks by the square of the multiplier.',
                id: 'Mengganti $r$ dengan $3r$ memberi $\\dfrac{1}{(3r)^2}=\\dfrac{1}{9r^2}$ — hukum kuadrat-terbalik mengecil sebesar kuadrat dari pengalinya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'If the distance in $B = k\\dfrac{L}{d^2}$ is doubled, brightness becomes what fraction of the original?',
                id: 'Jika jarak pada $B = k\\dfrac{L}{d^2}$ digandakan, kecerahannya menjadi berapa fraksi dari semula?',
              },
              template: 'B_{\\text{new}} = k\\dfrac{L}{(2d)^2} = ___ \\cdot B',
              blanks: ['1/4'],
              explain: {
                en: '$(2d)^2=4d^2$, so the new brightness is $\\frac{1}{4}$ of the original.',
                id: '$(2d)^2=4d^2$, sehingga kecerahan barunya $\\frac{1}{4}$ dari semula.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $z = kxy$ with $k=2$, $x=3$, $y=7$, find $z$ if $x$ is doubled and $y$ stays the same.',
                id: 'Untuk $z = kxy$ dengan $k=2$, $x=3$, $y=7$, cari $z$ jika $x$ digandakan dan $y$ tetap.',
              },
              blanks: [{ answer: 84 }],
              hints: [
                { en: 'Substitute $x=6, y=7$ directly into $z=2xy$.', id: 'Substitusikan $x=6, y=7$ langsung ke $z=2xy$.' },
              ],
              explain: {
                en: '$z=2(6)(7)=84$ — exactly double the original $z=2(3)(7)=42$, matching direct variation in $x$.',
                id: '$z=2(6)(7)=84$ — persis dua kali $z$ semula $2(3)(7)=42$, cocok dengan variasi langsung terhadap $x$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'dsr-m6-s2-p',
        runtime: 'math',
        title: { en: 'Direct, Inverse, and Joint Variation', id: 'Variasi Langsung, Terbalik, dan Gabungan' },
        brief: {
          en: 'One direct-variation problem, one inverse-variation problem, and one inverse-square combined model.',
          id: 'Satu soal variasi langsung, satu soal variasi terbalik, dan satu model kombinasi kuadrat-terbalik.',
        },
        requirements: [
          { en: 'Substituting new values directly into the model avoids ever needing to solve for $k$.', id: 'Mensubstitusikan nilai baru langsung ke model menghindarkan keharusan menyelesaikan untuk $k$.' },
        ],
        tasks: [
          {
            prompt: { en: '$y$ varies directly as $x$. If $y=45$ when $x=9$, find $y$ when $x=20$.', id: '$y$ bervariasi langsung terhadap $x$. Jika $y=45$ ketika $x=9$, cari $y$ ketika $x=20$.' },
            blanks: [{ answer: 100 }],
            solution: ['k=45/9=5 \\Rightarrow y=5(20)=100'],
          },
          {
            prompt: { en: '$y$ varies inversely as $x$. If $y=6$ when $x=10$, find $y$ when $x=4$.', id: '$y$ bervariasi terbalik terhadap $x$. Jika $y=6$ ketika $x=10$, cari $y$ ketika $x=4$.' },
            blanks: [{ answer: 15 }],
            solution: ['k=xy=60 \\Rightarrow y=60/4=15'],
          },
          {
            prompt: { en: 'If brightness $B=kL/d^2$, and both $d$ is tripled and $L$ is doubled, brightness becomes what fraction (or multiple) of the original?', id: 'Jika kecerahan $B=kL/d^2$, dan $d$ dilipatgandakan tiga sementara $L$ digandakan, kecerahannya menjadi berapa fraksi (atau kelipatan) dari semula?' },
            blanks: [{ answer: 2 / 9, tol: 0.01 }],
            solution: ['B_{\\text{new}}=k\\dfrac{2L}{(3d)^2}=\\dfrac{2}{9}\\cdot k\\dfrac{L}{d^2} = \\dfrac{2}{9} B'],
          },
        ],
        hints: [
          { en: 'For the last task, handle the two changes one at a time: a factor for the distance change, times a factor for the luminosity change.', id: 'Untuk butir terakhir, tangani kedua perubahan satu per satu: satu faktor untuk perubahan jarak, dikali satu faktor untuk perubahan luminositas.' },
        ],
        xp: 50,
      },
    },
  ],
}
