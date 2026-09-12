import type { Module } from '../types'

/** Module 1 — the derivative as what a limit becomes when it is aimed at a
 *  slope. Nothing here is a new kind of mathematics: it is the limit course,
 *  pointed at one specific question — how steep is a curve right here — and
 *  the answer turns out to be a function in its own right. */
export const module1: Module = {
  id: 'tur-m1',
  title: { en: 'The Derivative as a Limit', id: 'Turunan sebagai Limit' },
  summary: {
    en: 'From the slope of a secant to the slope of a tangent, the formal definition, and when a derivative fails to exist.',
    id: 'Dari kemiringan tali busur menuju kemiringan garis singgung, definisi formalnya, dan kapan turunan gagal ada.',
  },
  submodules: [
    /* --------------------------------------------- 1.1 secant to tangent */
    {
      id: 'tur-m1-s1',
      title: { en: 'The Slope of a Tangent Line', id: 'Kemiringan Garis Singgung' },
      summary: {
        en: 'Measure a rate of change with a secant line, then take it to its limit to find the slope right at one point.',
        id: 'Mengukur laju perubahan dengan tali busur, lalu membawanya ke limitnya untuk mencari kemiringan tepat di satu titik.',
      },
      lessons: [
        {
          id: 'tur-m1-s1-l1',
          title: { en: 'From Secant to Tangent', id: 'Dari Tali Busur ke Garis Singgung' },
          goal: {
            en: 'Compute an average rate of change from a secant line, and see a tangent line as its limit.',
            id: 'Menghitung laju perubahan rata-rata dari tali busur, dan melihat garis singgung sebagai limitnya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A slope between two points', id: 'Kemiringan antara dua titik' },
              body: {
                en: 'A line through two points on a curve, $(a, f(a))$ and $(b, f(b))$, is called a **secant line**. Its slope is the familiar rise over run:\n$$\\frac{f(b) - f(a)}{b - a}$$\nThis number is the **average rate of change** of $f$ over $[a,b]$ — average, because it treats the whole stretch as if the function climbed at one steady rate, when in fact it may have sped up and slowed down along the way.',
                id: 'Garis yang melalui dua titik pada kurva, $(a, f(a))$ dan $(b, f(b))$, disebut **tali busur**. Kemiringannya adalah kenaikan per jarak yang sudah dikenal:\n$$\\frac{f(b) - f(a)}{b - a}$$\nBilangan ini adalah **laju perubahan rata-rata** $f$ pada $[a,b]$ — rata-rata, sebab ia memperlakukan seluruh rentang seakan fungsinya menanjak dengan satu laju tetap, padahal bisa saja ia melaju cepat lalu melambat di sepanjang jalan.',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 5],
                ySpan: [-1, 10],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^2', color: 'a' },
                  { t: 'point', at: [1, 1], label: 'A' },
                  { t: 'point', at: [3, 9], label: 'B' },
                  { t: 'seg', from: [1, 1], to: [3, 9], color: 'b' },
                ],
                caption: {
                  en: 'The secant line through $A(1,1)$ and $B(3,9)$ on $y=x^2$ has slope $\\frac{9-1}{3-1} = 4$ — the average rate the curve climbed between them, a straight-line stand-in for a bending curve.',
                  id: 'Tali busur melalui $A(1,1)$ dan $B(3,9)$ pada $y=x^2$ mempunyai kemiringan $\\frac{9-1}{3-1} = 4$ — laju rata-rata kurvanya menanjak di antara keduanya, sebuah pengganti garis lurus untuk kurva yang melengkung.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Sliding B toward A', id: 'Menggeser B menuju A' },
              body: {
                en: 'Now let $B$ slide along the curve back toward $A$. Each position of $B$ gives a new secant line, and as $B \\to A$, these secants stop cutting through two separate points and start **hugging the curve at $A$ alone** — the line they approach is the **tangent line**, and its slope is the **instantaneous rate of change** of $f$ at $a$.\n\nWriting $b = a + h$ so that $h$ is the (shrinking) gap between the two points, the average rate becomes\n$$\\frac{f(a+h) - f(a)}{h}$$\nand the tangent slope is exactly what this expression approaches as $h \\to 0$ — a limit, and the definition the next lesson makes official.',
                id: 'Kini biarkan $B$ bergeser sepanjang kurva kembali menuju $A$. Setiap posisi $B$ memberi tali busur baru, dan saat $B \\to A$, tali busur ini berhenti memotong dua titik terpisah dan mulai **merapat pada kurva hanya di $A$** — garis yang didekatinya adalah **garis singgung**, dan kemiringannya adalah **laju perubahan sesaat** $f$ di $a$.\n\nMenulis $b = a + h$ sehingga $h$ adalah celah (yang menyusut) antara kedua titik, laju rata-ratanya menjadi\n$$\\frac{f(a+h) - f(a)}{h}$$\ndan kemiringan garis singgungnya persis apa yang didekati ekspresi ini saat $h \\to 0$ — sebuah limit, dan definisi yang diresmikan pelajaran berikutnya.',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 5],
                ySpan: [-1, 10],
                ticks: true,
                params: [{ name: 'h', min: -1.9, max: 1.1, step: 0.1, value: 1, label: 'h' }],
                items: [
                  { t: 'curve', f: 'x^2', color: 'a' },
                  { t: 'dot', x: 2, y: 4, color: 'result', label: 'A' },
                  { t: 'dot', x: '2+h', y: '(2+h)^2', color: 'b', label: 'B' },
                  { t: 'curve', f: '4+(4+h)*(x-2)', color: 'b', dashed: true, label: 'secant' },
                ],
                caption: {
                  en: 'Drag $h$ toward $0$: $B=(2+h,\\,(2+h)^2)$ slides along the curve toward $A$, and the secant (dashed) swings to become the tangent — slope exactly $4$ right at $h=0$.',
                  id: 'Geser $h$ menuju $0$: $B=(2+h,\\,(2+h)^2)$ bergeser sepanjang kurva menuju $A$, dan tali busurnya (putus-putus) berputar menjadi garis singgung — kemiringan tepat $4$ persis di $h=0$.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'As point $B$ slides along the curve toward $A$, what does the secant line through $A$ and $B$ approach?',
                id: 'Ketika titik $B$ bergeser sepanjang kurva menuju $A$, apa yang didekati tali busur melalui $A$ dan $B$?',
              },
              options: [
                { en: 'The tangent line at $A$', id: 'Garis singgung di $A$' },
                { en: 'A vertical line through $A$', id: 'Garis tegak melalui $A$' },
                { en: 'The $x$-axis', id: 'Sumbu $x$' },
                { en: 'Nothing — the secant is undefined once $B$ reaches $A$', id: 'Tak ada — tali busur tak terdefinisi begitu $B$ mencapai $A$' },
              ],
              answer: 0,
              explain: {
                en: 'The secant needs two distinct points, so it is genuinely undefined exactly at $B=A$ — but as $B$ gets arbitrarily close without reaching it, the secants close in on one particular line: the tangent. This is a limit in exactly the sense of the previous course.',
                id: 'Tali busur memerlukan dua titik yang berbeda, jadi ia memang tak terdefinisi tepat di $B=A$ — tetapi saat $B$ mendekat sedekat apa pun tanpa mencapainya, tali busurnya merapat ke satu garis tertentu: garis singgung. Ini limit persis dalam pengertian kursus sebelumnya.',
              },
              hint: {
                en: 'Think about what happens to the secant\'s slope specifically as $B$ gets arbitrarily close to $A$ without reaching it — not what happens to the line\'s position in general.',
                id: 'Pikirkan apa yang terjadi khususnya pada kemiringan tali busur saat $B$ mendekat sedekat apa pun ke $A$ tanpa mencapainya — bukan apa yang terjadi pada posisi garisnya secara umum.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph below, what is the average rate of change of $y=x^2$ from $x=1$ to $x=4$?',
                id: 'Dengan membaca grafik di bawah, berapa laju perubahan rata-rata $y=x^2$ dari $x=1$ ke $x=4$?',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 5],
                ySpan: [-1, 17],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^2', color: 'a' },
                  { t: 'point', at: [1, 1], label: 'A' },
                  { t: 'point', at: [4, 16], label: 'B' },
                  { t: 'seg', from: [1, 1], to: [4, 16], color: 'b' },
                ],
              },
              options: [
                { en: '5', id: '5' },
                { en: '15', id: '15' },
                { en: '3', id: '3' },
                { en: '16', id: '16' },
              ],
              answer: 0,
              explain: {
                en: 'Reading the two marked points, $A(1,1)$ and $B(4,16)$: slope $= \\dfrac{16-1}{4-1} = \\dfrac{15}{3} = 5$.',
                id: 'Membaca kedua titik yang ditandai, $A(1,1)$ dan $B(4,16)$: kemiringan $= \\dfrac{16-1}{4-1} = \\dfrac{15}{3} = 5$.',
              },
              hint: {
                en: 'Read the coordinates of $A$ and $B$ straight off the graph, then apply rise over run between them — this is nothing more than a secant slope.',
                id: 'Baca koordinat $A$ dan $B$ langsung dari grafiknya, lalu terapkan kenaikan per jarak di antara keduanya — ini tak lain kemiringan tali busur.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the average rate of change of $f(x) = x^2 + 1$ on $[2, 5]$.',
                id: 'Tentukan laju perubahan rata-rata $f(x) = x^2 + 1$ pada $[2, 5]$.',
              },
              blanks: [{ answer: 7 }],
              hints: [
                { en: '$f(2) = 5$ and $f(5) = 26$.', id: '$f(2) = 5$ dan $f(5) = 26$.' },
              ],
              explain: {
                en: '$\\dfrac{f(5)-f(2)}{5-2} = \\dfrac{26-5}{3} = \\dfrac{21}{3} = 7$.',
                id: '$\\dfrac{f(5)-f(2)}{5-2} = \\dfrac{26-5}{3} = \\dfrac{21}{3} = 7$.',
              },
            },
          ],
        },
        {
          id: 'tur-m1-s1-l2',
          title: { en: 'The Definition of the Derivative', id: 'Definisi Turunan' },
          goal: {
            en: 'State the limit definition of f\'(a), and use it directly to find a tangent slope.',
            id: 'Menyatakan definisi limit dari f\'(a), dan memakainya langsung untuk mencari kemiringan garis singgung.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'One formula, made official', id: 'Satu rumus, diresmikan' },
              body: {
                en: 'The **derivative of $f$ at $a$**, written $f\'(a)$, is\n$$f\'(a) = \\lim_{h \\to 0} \\frac{f(a+h) - f(a)}{h}$$\nprovided the limit exists. This is exactly last lesson\'s sliding secant, written as a limit instead of a picture. $f\'(a)$ is a single number: the slope of the tangent line to $y=f(x)$ at the point $(a, f(a))$, and equivalently the instantaneous rate of change of $f$ right at $a$.\n\nThe quotient $\\dfrac{f(a+h)-f(a)}{h}$ is called the **difference quotient**, and substituting $h=0$ directly always gives $\\dfrac{0}{0}$ — so finding a derivative from this definition is, every single time, a $\\frac{0}{0}$ limit to be cleared by factoring or expanding, exactly the toolkit from the last course.',
                id: '**Turunan $f$ di $a$**, ditulis $f\'(a)$, adalah\n$$f\'(a) = \\lim_{h \\to 0} \\frac{f(a+h) - f(a)}{h}$$\nasalkan limitnya ada. Ini persis tali busur yang bergeser dari pelajaran sebelumnya, ditulis sebagai limit alih-alih gambar. $f\'(a)$ adalah satu bilangan: kemiringan garis singgung $y=f(x)$ di titik $(a, f(a))$, dan setara dengan laju perubahan sesaat $f$ tepat di $a$.\n\nHasil bagi $\\dfrac{f(a+h)-f(a)}{h}$ disebut **hasil bagi selisih**, dan mensubstitusi $h=0$ langsung selalu memberi $\\dfrac{0}{0}$ — jadi mencari turunan dari definisi ini, setiap kali, adalah limit $\\frac{0}{0}$ yang diselesaikan dengan pemfaktoran atau penjabaran, persis perkakas dari kursus sebelumnya.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Working one example all the way through', id: 'Mengerjakan satu contoh sampai tuntas' },
              body: {
                en: 'Find $f\'(3)$ for $f(x) = x^2$.\n$$f\'(3) = \\lim_{h \\to 0} \\frac{f(3+h) - f(3)}{h} = \\lim_{h \\to 0} \\frac{(3+h)^2 - 9}{h}$$\nExpand the top: $(3+h)^2 - 9 = 9 + 6h + h^2 - 9 = 6h + h^2$. So\n$$f\'(3) = \\lim_{h \\to 0} \\frac{6h + h^2}{h} = \\lim_{h \\to 0} \\frac{h(6+h)}{h} = \\lim_{h \\to 0}(6+h) = 6$$\nThe factoring step is not optional decoration — it is the only reason the $\\frac{0}{0}$ clears at all, cancelling the very $h$ that direct substitution tripped over.',
                id: 'Cari $f\'(3)$ untuk $f(x) = x^2$.\n$$f\'(3) = \\lim_{h \\to 0} \\frac{f(3+h) - f(3)}{h} = \\lim_{h \\to 0} \\frac{(3+h)^2 - 9}{h}$$\nJabarkan bagian atas: $(3+h)^2 - 9 = 9 + 6h + h^2 - 9 = 6h + h^2$. Jadi\n$$f\'(3) = \\lim_{h \\to 0} \\frac{6h + h^2}{h} = \\lim_{h \\to 0} \\frac{h(6+h)}{h} = \\lim_{h \\to 0}(6+h) = 6$$\nLangkah pemfaktoran bukan hiasan opsional — itulah satu-satunya sebab $\\frac{0}{0}$-nya bisa selesai sama sekali, mencoret persis $h$ yang membuat substitusi langsung tersandung.',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 6],
                ySpan: [-1, 12],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^2', color: 'a' },
                  { t: 'point', at: [3, 9], label: 'A' },
                  { t: 'seg', from: [1, 3], to: [5, 15], color: 'b' },
                ],
                caption: {
                  en: 'The tangent line at $(3,9)$ has slope $6$, exactly the value the limit computed — a picture of the number the algebra just found.',
                  id: 'Garis singgung di $(3,9)$ mempunyai kemiringan $6$, persis nilai yang dihitung limitnya — gambar dari bilangan yang baru saja ditemukan aljabar.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which limit correctly defines $f\'(2)$?',
                id: 'Limit manakah yang secara benar mendefinisikan $f\'(2)$?',
              },
              options: [
                { en: '$\\lim_{h \\to 0} \\dfrac{f(2+h) - f(2)}{h}$', id: '$\\lim_{h \\to 0} \\dfrac{f(2+h) - f(2)}{h}$' },
                { en: '$\\lim_{h \\to 0} \\dfrac{f(2+h) - f(2)}{2}$', id: '$\\lim_{h \\to 0} \\dfrac{f(2+h) - f(2)}{2}$' },
                { en: '$\\dfrac{f(2+h) - f(2)}{h}$, for a fixed small $h$', id: '$\\dfrac{f(2+h) - f(2)}{h}$, untuk $h$ kecil yang tetap' },
                { en: '$\\lim_{h \\to 2} \\dfrac{f(h) - f(2)}{h}$', id: '$\\lim_{h \\to 2} \\dfrac{f(h) - f(2)}{h}$' },
              ],
              answer: 0,
              explain: {
                en: 'The denominator must be $h$ itself, not the fixed point $2$, and $h$ must actually go to $0$ in a limit — a single small $h$ only ever gives an approximation, one more secant, not the tangent itself.',
                id: 'Penyebutnya harus $h$ itu sendiri, bukan titik tetap $2$, dan $h$ harus sungguh-sungguh menuju $0$ dalam sebuah limit — satu $h$ kecil saja hanya pernah memberi hampiran, satu tali busur lagi, bukan garis singgungnya sendiri.',
              },
              hint: {
                en: 'Check each option against two separate requirements: is the denominator the shrinking gap itself, and does that gap actually approach zero in a limit rather than sit fixed?',
                id: 'Periksa tiap pilihan terhadap dua syarat terpisah: apakah penyebutnya adalah celah yang menyusut itu sendiri, dan apakah celah itu sungguh menuju nol dalam sebuah limit, bukan tetap diam?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the tangent line drawn below at $x=3$, what is $f\'(3)$ for $f(x)=x^2$?',
                id: 'Dengan membaca garis singgung yang digambar di bawah pada $x=3$, berapakah $f\'(3)$ untuk $f(x)=x^2$?',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 6],
                ySpan: [-1, 12],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^2', color: 'a' },
                  { t: 'point', at: [3, 9], label: 'A' },
                  { t: 'seg', from: [1, 3], to: [5, 15], color: 'b' },
                ],
              },
              options: [
                { en: '6', id: '6' },
                { en: '9', id: '9' },
                { en: '3', id: '3' },
                { en: '1', id: '1' },
              ],
              answer: 0,
              explain: {
                en: 'The tangent line rises from $(1,3)$ to $(5,15)$: slope $= \\dfrac{15-3}{5-1} = \\dfrac{12}{4} = 6$.',
                id: 'Garis singgungnya naik dari $(1,3)$ ke $(5,15)$: kemiringan $= \\dfrac{15-3}{5-1} = \\dfrac{12}{4} = 6$.',
              },
              hint: {
                en: 'Pick two points the drawn line clearly passes through and compute rise over run between them, exactly as you would for any straight line.',
                id: 'Pilih dua titik yang jelas dilalui garis yang digambar dan hitung kenaikan per jarak di antara keduanya, persis seperti garis lurus mana pun.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Use the limit definition to find $f\'(2)$ for $f(x) = x^2$.',
                id: 'Pakai definisi limit untuk mencari $f\'(2)$ dari $f(x) = x^2$.',
              },
              blanks: [{ label: 'f\'(2) =', answer: 4 }],
              hints: [
                { en: '$(2+h)^2 - 4 = 4h + h^2$, and dividing by $h$ leaves $4 + h$.', id: '$(2+h)^2 - 4 = 4h + h^2$, dan membagi dengan $h$ menyisakan $4 + h$.' },
              ],
              explain: {
                en: '$\\lim_{h\\to 0} \\dfrac{(2+h)^2-4}{h} = \\lim_{h\\to 0}\\dfrac{4h+h^2}{h} = \\lim_{h\\to 0}(4+h) = 4$.',
                id: '$\\lim_{h\\to 0} \\dfrac{(2+h)^2-4}{h} = \\lim_{h\\to 0}\\dfrac{4h+h^2}{h} = \\lim_{h\\to 0}(4+h) = 4$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'tur-m1-s1-p',
        runtime: 'math',
        title: { en: 'Slopes, Average and Instantaneous', id: 'Kemiringan, Rata-rata dan Sesaat' },
        brief: {
          en: 'An average rate of change, and two derivatives found straight from the limit definition.',
          id: 'Satu laju perubahan rata-rata, dan dua turunan yang dicari langsung dari definisi limit.',
        },
        requirements: [
          { en: 'A derivative from the definition always starts as a $\\frac{0}{0}$ limit — expand or factor to clear it.', id: 'Turunan dari definisi selalu bermula sebagai limit $\\frac{0}{0}$ — jabarkan atau faktorkan untuk menyelesaikannya.' },
          { en: 'The $h$ in the denominator must fully cancel before you substitute $h=0$.', id: '$h$ di penyebut harus tercoret habis sebelum kamu mensubstitusi $h=0$.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Find the average rate of change of $f(x) = x^2 - 1$ on $[1, 3]$.',
              id: 'Tentukan laju perubahan rata-rata $f(x) = x^2 - 1$ pada $[1, 3]$.',
            },
            blanks: [{ answer: 4 }],
            solution: ['\\dfrac{f(3)-f(1)}{3-1} = \\dfrac{8-0}{2} = 4'],
          },
          {
            prompt: {
              en: 'Use the limit definition to find $f\'(1)$ for $f(x) = x^2 + 3x$.',
              id: 'Pakai definisi limit untuk mencari $f\'(1)$ dari $f(x) = x^2 + 3x$.',
            },
            blanks: [{ answer: 5 }],
            solution: [
              'f(1+h)-f(1) = (1+h)^2+3(1+h) - 4 = 5h+h^2',
              '\\lim_{h\\to 0} \\dfrac{5h+h^2}{h} = 5',
            ],
          },
          {
            prompt: {
              en: 'Use the limit definition to find $f\'(2)$ for $f(x) = 3x^2$.',
              id: 'Pakai definisi limit untuk mencari $f\'(2)$ dari $f(x) = 3x^2$.',
            },
            blanks: [{ answer: 12 }],
            solution: [
              'f(2+h)-f(2) = 3(2+h)^2 - 12 = 12h + 3h^2',
              '\\lim_{h\\to 0}\\dfrac{12h+3h^2}{h} = 12',
            ],
          },
        ],
        hints: [
          { en: 'Expand $(a+h)^2$ fully before subtracting $f(a)$ — combining terms too early hides the common factor of $h$.', id: 'Jabarkan $(a+h)^2$ sepenuhnya sebelum mengurangi $f(a)$ — menggabungkan suku terlalu awal menyembunyikan faktor $h$ yang sama.' },
        ],
        xp: 50,
      },
    },

    /* ------------------------------------- 1.2 the derivative as a function */
    {
      id: 'tur-m1-s2',
      title: { en: 'The Derivative as a Function', id: 'Turunan sebagai Fungsi' },
      summary: {
        en: 'Let a leave a fixed point behind and become x, producing a derivative function — and see the three ways it can fail to exist.',
        id: 'Membiarkan a meninggalkan titik tetap dan menjadi x, menghasilkan fungsi turunan — dan melihat tiga cara ia bisa gagal ada.',
      },
      lessons: [
        {
          id: 'tur-m1-s2-l1',
          title: { en: 'f\'(x) from the Limit Definition', id: 'f\'(x) dari Definisi Limit' },
          goal: {
            en: 'Replace the fixed point a with the variable x, and derive a whole derivative function at once.',
            id: 'Mengganti titik tetap a dengan variabel x, dan menurunkan seluruh fungsi turunan sekaligus.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'One point at a time, all at once', id: 'Satu titik setiap kali, sekaligus semuanya' },
              body: {
                en: 'Nothing forces $a$ to stay fixed. Writing $x$ in its place gives\n$$f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$\na single limit computation that produces, for every $x$ where it exists, the slope of the tangent there. $f\'$ is a genuine **function** — the **derivative function** — not a single number the way $f\'(3)$ was. Once you have $f\'(x)$, plugging in any particular $a$ gives $f\'(a)$ for free, without repeating the whole limit.',
                id: 'Tak ada yang mengharuskan $a$ tetap tak berubah. Menulis $x$ di tempatnya memberi\n$$f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$\nsatu penghitungan limit yang menghasilkan, untuk setiap $x$ tempat ia ada, kemiringan garis singgung di situ. $f\'$ adalah **fungsi** sungguhan — **fungsi turunan** — bukan satu bilangan seperti $f\'(3)$ tadi. Begitu kamu punya $f\'(x)$, memasukkan $a$ tertentu mana pun memberi $f\'(a)$ secara gratis, tanpa mengulang seluruh limitnya.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Two derivative functions, worked in full', id: 'Dua fungsi turunan, dikerjakan tuntas' },
              body: {
                en: 'For $f(x) = x^2$:\n$$f\'(x) = \\lim_{h\\to 0}\\frac{(x+h)^2-x^2}{h} = \\lim_{h\\to 0}\\frac{2xh+h^2}{h} = \\lim_{h\\to 0}(2x+h) = 2x$$\nEvery earlier numeric answer was this formula in disguise: $f\'(3) = 2(3) = 6$, matching exactly.\n\nFor $f(x) = \\dfrac{1}{x}$, the algebra leans on the rationalising-adjacent move of a common denominator:\n$$f\'(x) = \\lim_{h\\to 0}\\frac{\\frac{1}{x+h}-\\frac{1}{x}}{h} = \\lim_{h\\to 0}\\frac{\\frac{x-(x+h)}{x(x+h)}}{h} = \\lim_{h\\to 0}\\frac{-h}{hx(x+h)} = \\lim_{h\\to 0}\\frac{-1}{x(x+h)} = -\\frac{1}{x^2}$$\nSame recipe every time: expand or combine, cancel the shared $h$, then let $h \\to 0$ in what remains.',
                id: 'Untuk $f(x) = x^2$:\n$$f\'(x) = \\lim_{h\\to 0}\\frac{(x+h)^2-x^2}{h} = \\lim_{h\\to 0}\\frac{2xh+h^2}{h} = \\lim_{h\\to 0}(2x+h) = 2x$$\nSetiap jawaban numerik sebelumnya adalah rumus ini yang menyamar: $f\'(3) = 2(3) = 6$, cocok persis.\n\nUntuk $f(x) = \\dfrac{1}{x}$, aljabarnya bersandar pada gerakan sejenis penyamaan penyebut:\n$$f\'(x) = \\lim_{h\\to 0}\\frac{\\frac{1}{x+h}-\\frac{1}{x}}{h} = \\lim_{h\\to 0}\\frac{\\frac{x-(x+h)}{x(x+h)}}{h} = \\lim_{h\\to 0}\\frac{-h}{hx(x+h)} = \\lim_{h\\to 0}\\frac{-1}{x(x+h)} = -\\frac{1}{x^2}$$\nResep yang sama setiap kali: jabarkan atau samakan penyebut, coret $h$ yang sama, lalu biarkan $h \\to 0$ pada sisanya.',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 3],
                ySpan: [-4, 4],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^2', color: 'a', label: 'f(x)=x²' },
                  { t: 'curve', f: '2*x', color: 'result', label: 'f\'(x)=2x' },
                ],
                caption: {
                  en: 'Two different graphs, same variable $x$: the parabola, and the line that reports its slope at every point. Where $f$ is falling ($x<0$), $f\'$ is negative; where $f$ is rising, $f\'$ is positive — and exactly at the bottom, $x=0$, $f\'$ is zero.',
                  id: 'Dua grafik berbeda, variabel $x$ yang sama: parabolanya, dan garis yang melaporkan kemiringannya di setiap titik. Tempat $f$ turun ($x<0$), $f\'$ negatif; tempat $f$ naik, $f\'$ positif — dan persis di dasarnya, $x=0$, $f\'$ nol.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Once you know $f\'(x) = 2x$, how do you find $f\'(5)$?',
                id: 'Setelah kamu tahu $f\'(x) = 2x$, bagaimana mencari $f\'(5)$?',
              },
              options: [
                { en: 'Substitute $x=5$: $f\'(5) = 10$', id: 'Substitusikan $x=5$: $f\'(5) = 10$' },
                { en: 'Redo the whole limit definition with $a=5$', id: 'Ulangi seluruh definisi limit dengan $a=5$' },
                { en: 'It cannot be found without more information', id: 'Tak bisa dicari tanpa informasi lebih' },
                { en: 'Substitute $h=5$ instead', id: 'Substitusikan $h=5$ sebagai gantinya' },
              ],
              answer: 0,
              explain: {
                en: 'The whole point of having the derivative **function** is that plugging in a number is all that is left to do — the limit has already been done once, for every $x$ at the same time.',
                id: 'Seluruh gunanya memiliki **fungsi** turunan adalah memasukkan sebuah bilangan sudah cukup — limitnya sudah dikerjakan sekali, untuk setiap $x$ pada saat yang sama.',
              },
              hint: {
                en: 'You already have a formula that works for every $x$ at once — think about what is actually left to do with a formula once you have it, versus what deriving it from scratch would require.',
                id: 'Kamu sudah punya rumus yang berlaku untuk setiap $x$ sekaligus — pikirkan apa yang sebenarnya masih perlu dilakukan dengan sebuah rumus setelah kamu memilikinya, dibanding menurunkannya dari awal.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the two graphs above ($f(x)=x^2$ and $f\'(x)=2x$), on which interval is $f\'(x)$ negative?',
                id: 'Dengan membaca kedua grafik di atas ($f(x)=x^2$ dan $f\'(x)=2x$), pada selang mana $f\'(x)$ negatif?',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 3],
                ySpan: [-4, 4],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^2', color: 'a', label: 'f' },
                  { t: 'curve', f: '2*x', color: 'result', label: "f'" },
                ],
              },
              options: [
                { en: '$x < 0$', id: '$x < 0$' },
                { en: '$x > 0$', id: '$x > 0$' },
                { en: 'Nowhere', id: 'Tidak di mana pun' },
                { en: 'Everywhere', id: 'Di mana-mana' },
              ],
              answer: 0,
              explain: {
                en: 'The line $f\'(x)=2x$ sits below the axis exactly where $x<0$ — matching where the parabola is sloping downward.',
                id: 'Garis $f\'(x)=2x$ berada di bawah sumbu persis tempat $x<0$ — cocok dengan tempat parabolanya melandai turun.',
              },
              hint: {
                en: 'Find the interval where the line labeled $f\'$ dips below the horizontal axis, and check that it matches where the parabola itself is heading downward.',
                id: 'Cari selang tempat garis berlabel $f\'$ turun di bawah sumbu mendatar, dan periksa apakah cocok dengan tempat parabolanya sendiri menurun.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Use the limit definition to find the derivative function of $f(x) = x^2 - 4x$, then evaluate it at $x=1$.',
                id: 'Pakai definisi limit untuk mencari fungsi turunan $f(x) = x^2 - 4x$, lalu hitung nilainya di $x=1$.',
              },
              blanks: [
                { label: 'f\'(x) =', formula: '2*x-4', domain: [-2, 6] },
                { label: 'f\'(1) =', answer: -2 },
              ],
              hints: [
                { en: '$(x+h)^2 - 4(x+h) - (x^2-4x) = 2xh + h^2 - 4h$; divide by $h$ and let $h \\to 0$.', id: '$(x+h)^2 - 4(x+h) - (x^2-4x) = 2xh + h^2 - 4h$; bagi dengan $h$ dan biarkan $h \\to 0$.' },
              ],
              explain: {
                en: '$f\'(x) = 2x - 4$, and $f\'(1) = 2(1)-4 = -2$ — a tangent sloping downward at $x=1$.',
                id: '$f\'(x) = 2x - 4$, dan $f\'(1) = 2(1)-4 = -2$ — garis singgung yang melandai turun di $x=1$.',
              },
            },
          ],
        },
        {
          id: 'tur-m1-s2-l2',
          title: { en: 'Differentiability and Continuity', id: 'Keterdiferensialan dan Kekontinuan' },
          goal: {
            en: 'Show differentiability implies continuity, and recognise the shapes where a derivative fails to exist.',
            id: 'Menunjukkan keterdiferensialan mengakibatkan kekontinuan, dan mengenali bentuk-bentuk tempat turunan gagal ada.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'One implication, and not the other way around', id: 'Satu akibat, dan tak berlaku sebaliknya' },
              body: {
                en: 'If $f\'(a)$ exists, then $f$ is **continuous at $a$**. The difference quotient having a finite limit forces $f(a+h) - f(a) \\to 0$ as $h \\to 0$, which is exactly $\\lim_{x\\to a} f(x) = f(a)$ — continuity, from Module 4 of the last course.\n\nThe arrow runs only one way. $f(x) = |x|$ is continuous everywhere, including at $x=0$ — no hole, no jump, no run-away — yet, as the next page shows, it has no derivative there at all. **Differentiable implies continuous; continuous does not imply differentiable.** Differentiability is the stronger, harder-to-earn condition.',
                id: 'Jika $f\'(a)$ ada, maka $f$ **kontinu di $a$**. Hasil bagi selisih yang mempunyai limit berhingga memaksa $f(a+h) - f(a) \\to 0$ saat $h \\to 0$, dan itu persis $\\lim_{x\\to a} f(x) = f(a)$ — kekontinuan, dari Modul 4 kursus sebelumnya.\n\nPanahnya hanya berlaku satu arah. $f(x) = |x|$ kontinu di mana-mana, termasuk di $x=0$ — tak berlubang, tak melompat, tak lari — namun, seperti ditunjukkan halaman berikutnya, ia sama sekali tak punya turunan di situ. **Terdiferensial mengakibatkan kontinu; kontinu tak mengakibatkan terdiferensial.** Keterdiferensialan adalah syarat yang lebih kuat, lebih sulit dipenuhi.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A corner the derivative cannot cross', id: 'Sudut yang tak bisa dilintasi turunan' },
              body: {
                en: 'At $x=0$, $f(x)=|x|$ has a **corner** — the graph is continuous but changes direction sharply rather than smoothly. Checking the difference quotient from each side:\n$$\\lim_{h \\to 0^+} \\frac{|h|-0}{h} = \\lim_{h \\to 0^+}\\frac{h}{h} = 1, \\qquad \\lim_{h \\to 0^-} \\frac{|h|-0}{h} = \\lim_{h \\to 0^-}\\frac{-h}{h} = -1$$\nThe one-sided limits of the difference quotient disagree — $1 \\neq -1$ — so the two-sided limit defining $f\'(0)$ does not exist, using exactly the one-sided-limit machinery from the previous course.\n\nA corner is one of three classic shapes where a derivative fails: a **corner** (one-sided derivatives disagree, as here), a **cusp** (both one-sided derivatives run off to $\\pm\\infty$ in opposite directions), or a **vertical tangent** (the difference quotient itself diverges to $\\infty$ from both sides).',
                id: 'Di $x=0$, $f(x)=|x|$ mempunyai **sudut** — grafiknya kontinu tetapi berubah arah secara tajam, bukan mulus. Memeriksa hasil bagi selisih dari tiap sisi:\n$$\\lim_{h \\to 0^+} \\frac{|h|-0}{h} = \\lim_{h \\to 0^+}\\frac{h}{h} = 1, \\qquad \\lim_{h \\to 0^-} \\frac{|h|-0}{h} = \\lim_{h \\to 0^-}\\frac{-h}{h} = -1$$\nLimit sepihak dari hasil bagi selisihnya tidak sepakat — $1 \\neq -1$ — jadi limit dua sisi yang mendefinisikan $f\'(0)$ tak ada, memakai persis perkakas limit sepihak dari kursus sebelumnya.\n\nSudut adalah satu dari tiga bentuk klasik tempat turunan gagal: **sudut** (turunan sepihaknya tak sepakat, seperti di sini), **puncak tajam / cusp** (kedua turunan sepihaknya lari ke $\\pm\\infty$ berlawanan arah), atau **garis singgung tegak** (hasil bagi selisihnya sendiri menuju $\\infty$ dari kedua sisi).',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 3],
                ySpan: [-1, 4],
                ticks: true,
                items: [
                  { t: 'curve', f: 'abs(x)', color: 'a' },
                  { t: 'point', at: [0, 0], label: 'sudut' },
                ],
                caption: {
                  en: 'Perfectly continuous through the corner, but no single tangent line makes sense there — the left side wants slope $-1$, the right side wants slope $1$, and neither wins.',
                  id: 'Sempurna kontinu melewati sudutnya, tetapi tak ada satu garis singgung pun yang masuk akal di situ — sisi kiri menginginkan kemiringan $-1$, sisi kanan menginginkan kemiringan $1$, dan tak satu pun menang.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Does $f(x) = |x|$ have a derivative at $x=0$?',
                id: 'Apakah $f(x) = |x|$ mempunyai turunan di $x=0$?',
              },
              options: [
                { en: 'No — the one-sided difference quotients disagree, $1 \\neq -1$', id: 'Tidak — hasil bagi selisih sepihaknya tak sepakat, $1 \\neq -1$' },
                { en: 'Yes, and it equals $0$', id: 'Ya, dan sama dengan $0$' },
                { en: 'Yes, and it equals $1$', id: 'Ya, dan sama dengan $1$' },
                { en: 'No, because $f$ is not continuous at $0$', id: 'Tidak, karena $f$ tak kontinu di $0$' },
              ],
              answer: 0,
              explain: {
                en: '$f$ is perfectly continuous at $0$ — the failure is entirely about the derivative, not continuity. The corner makes the two one-sided difference quotients disagree, so the two-sided limit does not exist.',
                id: '$f$ kontinu sempurna di $0$ — kegagalannya sepenuhnya tentang turunan, bukan kekontinuan. Sudutnya membuat kedua hasil bagi selisih sepihak tak sepakat, jadi limit dua sisinya tak ada.',
              },
              hint: {
                en: 'Work out the difference-quotient limit approaching from the left and separately from the right. Do the two one-sided results actually agree?',
                id: 'Kerjakan limit hasil bagi selisih dari sisi kiri dan secara terpisah dari sisi kanan. Apakah kedua hasil sepihak itu benar-benar sepakat?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph of $y=|x|$ above, why does no single tangent line make sense at $x=0$?',
                id: 'Dengan membaca grafik $y=|x|$ di atas, mengapa tak ada satu garis singgung pun yang masuk akal di $x=0$?',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 3],
                ySpan: [-1, 4],
                ticks: true,
                items: [{ t: 'curve', f: 'abs(x)', color: 'a' }],
              },
              options: [
                { en: 'The graph changes direction sharply there, so approaching from the left and right suggests different slopes', id: 'Grafiknya berubah arah tajam di situ, jadi mendekat dari kiri dan kanan menyarankan kemiringan berbeda' },
                { en: 'The graph has a hole at $x=0$', id: 'Grafiknya berlubang di $x=0$' },
                { en: 'The graph is not defined at $x=0$', id: 'Grafiknya tak terdefinisi di $x=0$' },
                { en: 'The graph is a straight line, so it has no single tangent', id: 'Grafiknya garis lurus, jadi tak punya satu garis singgung' },
              ],
              answer: 0,
              explain: {
                en: 'The V-shape is exactly a corner: the left arm suggests slope $-1$, the right arm suggests slope $1$, and a genuine tangent line would have to pick one — which the picture refuses to let it do.',
                id: 'Bentuk V-nya persis sebuah sudut: lengan kirinya menyarankan kemiringan $-1$, lengan kanannya menyarankan kemiringan $1$, dan garis singgung sejati harus memilih salah satu — dan gambarnya menolak membiarkan itu terjadi.',
              },
              hint: {
                en: 'A genuine tangent line has to commit to one single slope. Look at the two arms of the V near $x=0$ — do they suggest the same slope, or two different ones?',
                id: 'Garis singgung sejati harus berkomitmen pada satu kemiringan tunggal. Perhatikan kedua lengan bentuk V dekat $x=0$ — apakah keduanya menyarankan kemiringan yang sama, atau dua yang berbeda?',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $g(x) = |x - 2|$, find both one-sided difference-quotient limits at $x=2$.',
                id: 'Untuk $g(x) = |x - 2|$, tentukan kedua limit hasil bagi selisih sepihak di $x=2$.',
              },
              blanks: [
                { label: '\\lim_{h \\to 0^-} \\tfrac{g(2+h)-g(2)}{h} =', answer: -1 },
                { label: '\\lim_{h \\to 0^+} \\tfrac{g(2+h)-g(2)}{h} =', answer: 1 },
              ],
              hints: [
                { en: 'Near $x=2$, $g(x) = |x-2|$ behaves exactly like $|x|$ did near $0$, just shifted.', id: 'Dekat $x=2$, $g(x) = |x-2|$ berperilaku persis seperti $|x|$ dekat $0$, hanya digeser.' },
              ],
              explain: {
                en: 'Same corner, relocated to $x=2$: the left-hand difference quotient gives $-1$, the right-hand gives $1$. They disagree, so $g\'(2)$ does not exist.',
                id: 'Sudut yang sama, dipindahkan ke $x=2$: hasil bagi selisih kiri memberi $-1$, kanan memberi $1$. Keduanya tak sepakat, jadi $g\'(2)$ tak ada.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'tur-m1-s2-p',
        runtime: 'math',
        title: { en: 'Building a Derivative Function', id: 'Menyusun Fungsi Turunan' },
        brief: {
          en: 'Derive one function from the definition, evaluate it, and find a corner where a derivative fails.',
          id: 'Menurunkan satu fungsi dari definisi, menghitung nilainya, dan menemukan sudut tempat turunan gagal.',
        },
        requirements: [
          { en: 'Derive f\'(x) once, then substitute — never repeat the limit for each point.', id: 'Turunkan f\'(x) sekali, lalu substitusikan — jangan pernah mengulang limitnya untuk tiap titik.' },
          { en: 'A corner shows up as disagreeing one-sided difference-quotient limits.', id: 'Sudut tampak sebagai limit hasil bagi selisih sepihak yang tak sepakat.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Use the limit definition to find the derivative function of $f(x) = 3x^2 + 2x$, then evaluate it at $x=2$.',
              id: 'Pakai definisi limit untuk mencari fungsi turunan $f(x) = 3x^2 + 2x$, lalu hitung nilainya di $x=2$.',
            },
            blanks: [
              { label: 'f\'(x) =', formula: '6*x+2', domain: [-2, 6] },
              { label: 'f\'(2) =', answer: 14 },
            ],
            solution: ['f\'(x) = 6x+2 \\Rightarrow f\'(2) = 12+2 = 14'],
          },
          {
            prompt: {
              en: 'Use the limit definition to find the derivative function of $f(x) = \\dfrac{1}{x+1}$.',
              id: 'Pakai definisi limit untuk mencari fungsi turunan $f(x) = \\dfrac{1}{x+1}$.',
            },
            blanks: [{ label: 'f\'(x) =', formula: '-1/(x+1)^2', domain: [0, 4] }],
            solution: [
              '\\frac{\\frac{1}{x+h+1}-\\frac{1}{x+1}}{h} = \\frac{-h}{h(x+h+1)(x+1)} \\to \\frac{-1}{(x+1)^2}',
            ],
          },
          {
            prompt: {
              en: 'For $h(x) = |x + 3|$, find both one-sided difference-quotient limits at $x=-3$.',
              id: 'Untuk $h(x) = |x + 3|$, tentukan kedua limit hasil bagi selisih sepihak di $x=-3$.',
            },
            blanks: [
              { label: '\\lim_{t \\to 0^-} =', answer: -1 },
              { label: '\\lim_{t \\to 0^+} =', answer: 1 },
            ],
            solution: ['\\text{Same corner shape as } |x|, \\text{ relocated to } x=-3'],
          },
        ],
        hints: [
          { en: 'Part 2 needs a common denominator before anything can cancel — the same move as the lesson\'s worked example.', id: 'Butir 2 memerlukan penyamaan penyebut sebelum apa pun bisa tercoret — gerakan yang sama seperti contoh yang dikerjakan pelajaran.' },
        ],
        xp: 50,
      },
    },
  ],
}
