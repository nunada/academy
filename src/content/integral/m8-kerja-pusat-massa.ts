import type { Module } from '../types'

/** Module 8 — physics questions that a constant-force formula (work = force
 *  times distance) or a single-point formula (mass at a location) cannot
 *  answer, because the force or the density changes continuously across the
 *  object. Slice, approximate with a constant, sum, and take the limit — the
 *  Riemann-sum idea from Module 2, aimed at three new kinds of quantity. */
export const module8: Module = {
  id: 'int-m8',
  title: { en: 'Work, Fluid Forces, and Centers of Mass', id: 'Usaha, Gaya Fluida, dan Pusat Massa' },
  summary: {
    en: 'Integrating a variable force to find work done, a variable pressure to find fluid force, and a variable density to find a center of mass.',
    id: 'Mengintegralkan gaya yang berubah untuk mencari usaha, tekanan yang berubah untuk mencari gaya fluida, dan kerapatan yang berubah untuk mencari pusat massa.',
  },
  submodules: [
    /* ---------------------------------------------------- 8.1 work and fluid forces */
    {
      id: 'int-m8-s1',
      title: { en: 'Work and Fluid Forces', id: 'Usaha dan Gaya Fluida' },
      summary: {
        en: 'Integrating a spring\'s changing resistance to find the work to stretch it, and integrating pressure to find the force on a submerged plate.',
        id: 'Mengintegralkan perlawanan pegas yang berubah untuk mencari usaha meregangkannya, dan mengintegralkan tekanan untuk mencari gaya pada lempeng yang terendam.',
      },
      lessons: [
        {
          id: 'int-m8-s1-l1',
          title: { en: 'Work as an Integral of a Variable Force', id: 'Usaha sebagai Integral dari Gaya yang Berubah' },
          goal: {
            en: 'Extend work equals force times distance to a variable force by integrating, and apply it to a stretching spring.',
            id: 'Memperluas usaha sama dengan gaya kali jarak untuk gaya yang berubah dengan mengintegralkan, dan menerapkannya pada pegas yang meregang.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Slicing distance into pieces small enough to treat the force as constant', id: 'Mengiris jarak menjadi bagian yang cukup kecil untuk memperlakukan gaya sebagai konstan' },
              body: {
                en: 'Physics defines work simply as $W=F\\cdot d$ — but only when the force $F$ stays constant over the whole distance $d$. A spring resists more the further it stretches, so its force is a function $F(x)$, not a constant. Slice the stretch $[a,b]$ into tiny pieces $\\Delta x$; across one piece, $F(x)$ barely changes, so the work done there is approximately $F(x)\\,\\Delta x$. Summing every piece and taking the limit turns the sum into an integral:\n$$W = \\int_a^b F(x)\\,dx$$\nWork is a Riemann sum in exactly the same way area was in Module 2 — only the quantity being summed has changed.',
                id: 'Fisika mendefinisikan usaha sederhananya sebagai $W=F\\cdot d$ — tetapi hanya ketika gaya $F$ tetap konstan sepanjang jarak $d$. Pegas melawan lebih kuat semakin jauh ia meregang, sehingga gayanya adalah fungsi $F(x)$, bukan konstanta. Iris regangan $[a,b]$ menjadi bagian kecil $\\Delta x$; sepanjang satu bagian, $F(x)$ nyaris tak berubah, sehingga usaha yang dilakukan di situ kira-kira $F(x)\\,\\Delta x$. Menjumlahkan setiap bagian dan mengambil limitnya mengubah jumlahnya menjadi integral:\n$$W = \\int_a^b F(x)\\,dx$$\nUsaha adalah jumlah Riemann dengan cara yang persis sama seperti luas pada Modul 2 — hanya besaran yang dijumlahkan yang berubah.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: "Hooke's Law, integrated", id: 'Hukum Hooke, diintegralkan' },
              body: {
                en: "**Hooke's Law** says a spring's resistance is proportional to how far it is stretched from its natural length: $F(x)=kx$, where $k$ is the spring constant. A spring that needs $10$ N of force to hold it stretched $0.1$ m has $k=\\frac{10}{0.1}=100$ N/m. The work to stretch it from its natural length to $0.2$ m:\n$$W = \\int_0^{0.2} 100x\\,dx = \\Big[50x^2\\Big]_0^{0.2} = 50(0.04) = 2 \\text{ J}$$\nStretching it further, from $0.2$ m to $0.3$ m, costs *more* work for the *same* $0.1$ m of additional stretch — $W=\\int_{0.2}^{0.3}100x\\,dx = 50(0.09-0.04) = 2.5$ J — because the spring is already resisting harder by the time that second stretch begins.",
                id: '**Hukum Hooke** menyatakan perlawanan pegas sebanding dengan seberapa jauh ia diregangkan dari panjang alaminya: $F(x)=kx$, dengan $k$ adalah konstanta pegas. Pegas yang memerlukan gaya $10$ N untuk menahannya teregang $0.1$ m punya $k=\\frac{10}{0.1}=100$ N/m. Usaha untuk meregangkannya dari panjang alaminya sampai $0.2$ m:\n$$W = \\int_0^{0.2} 100x\\,dx = \\Big[50x^2\\Big]_0^{0.2} = 50(0.04) = 2 \\text{ J}$$\nMeregangkannya lebih jauh, dari $0.2$ m sampai $0.3$ m, memerlukan usaha yang *lebih besar* untuk regangan tambahan $0.1$ m yang *sama* — $W=\\int_{0.2}^{0.3}100x\\,dx = 50(0.09-0.04) = 2.5$ J — sebab pegasnya sudah melawan lebih keras pada saat regangan kedua itu dimulai.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why does stretching a spring from 0.2 m to 0.3 m take more work than stretching it from 0 m to 0.1 m, even though both are 0.1 m of stretch?',
                id: 'Mengapa meregangkan pegas dari 0.2 m ke 0.3 m memerlukan usaha lebih besar daripada meregangkannya dari 0 m ke 0.1 m, meski keduanya regangan 0.1 m?',
              },
              options: [
                { en: "Hooke's Law makes the force $F(x) = kx$ larger at greater stretch, so the same distance costs more work when the spring is already stretched", id: "Hukum Hooke membuat gaya $F(x) = kx$ lebih besar pada regangan yang lebih jauh, sehingga jarak yang sama memerlukan usaha lebih besar ketika pegasnya sudah teregang" },
                { en: 'It actually takes exactly the same work in both cases', id: 'Sebenarnya memerlukan usaha yang persis sama pada kedua kasus' },
                { en: 'Work only depends on distance, never on force', id: 'Usaha hanya bergantung pada jarak, tak pernah pada gaya' },
                { en: "Hooke's Law does not apply to a spring already under tension", id: 'Hukum Hooke tak berlaku untuk pegas yang sudah dalam tegangan' },
              ],
              answer: 0,
              explain: {
                en: 'The integral of a larger function over the same width of interval always gives a larger result — and $F(x) = kx$ is genuinely larger throughout $[0.2, 0.3]$ than throughout $[0, 0.1]$.',
                id: 'Integral dari fungsi yang lebih besar pada lebar interval yang sama selalu memberi hasil yang lebih besar — dan $F(x) = kx$ memang lebih besar sepanjang $[0.2, 0.3]$ dibanding sepanjang $[0, 0.1]$.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the work integral for a spring with $k = 100$ stretched from 0 to 0.2 m.',
                id: 'Lengkapi integral usaha untuk pegas dengan $k = 100$ diregangkan dari 0 sampai 0.2 m.',
              },
              template: 'W = \\int_0^{0.2} 100x\\,dx = \\Big[50x^2\\Big]_0^{0.2} = 50(___) = ___ \\text{ J}',
              blanks: ['0.04', '2'],
              explain: {
                en: '0.2 squared is 0.04, and 50 times 0.04 is 2.',
                id: '0.2 dikuadratkan adalah 0.04, dan 50 kali 0.04 adalah 2.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'A spring has $k = 50$ N/m. Find the work to stretch it from its natural length to 0.4 m.',
                id: 'Sebuah pegas punya $k = 50$ N/m. Cari usaha untuk meregangkannya dari panjang alaminya sampai 0.4 m.',
              },
              blanks: [{ answer: 4 }],
              hints: [
                { en: '$W = \\int_0^{0.4} 50x\\,dx = 25x^2$.', id: '$W = \\int_0^{0.4} 50x\\,dx = 25x^2$.' },
              ],
              explain: {
                en: '$25(0.4)^2 = 25(0.16) = 4$ J.',
                id: '$25(0.4)^2 = 25(0.16) = 4$ J.',
              },
            },
          ],
        },
        {
          id: 'int-m8-s1-l2',
          title: { en: 'Fluid Force Against a Submerged Plate', id: 'Gaya Fluida pada Lempeng Terendam' },
          goal: {
            en: 'Integrate pressure over depth to find the total force a fluid exerts on a submerged flat plate.',
            id: 'Mengintegralkan tekanan pada kedalaman untuk mencari total gaya yang diberikan fluida pada lempeng datar yang terendam.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Pressure changes with depth, so force must be integrated too', id: 'Tekanan berubah dengan kedalaman, jadi gaya pun harus diintegralkan' },
              body: {
                en: 'Fluid pressure at depth $y$ is $\\rho g y$ ($\\rho$ the fluid density, $g$ gravitational acceleration) — deeper water presses harder. On a vertical plate of width $w(y)$ at depth $y$, the force on a thin horizontal strip of height $dy$ is pressure times area, $\\rho g y \\cdot w(y)\\,dy$. Summing over the whole plate:\n$$F = \\int_a^b \\rho g\\, y\\, w(y)\\,dy$$\nFor water, $\\rho g \\approx 9800$ N/m³. A rectangular plate of constant width $3$ m, submerged with its top edge at depth $2$ m and bottom edge at depth $5$ m:\n$$F = \\int_2^5 9800(3)y\\,dy = 29400\\left[\\frac{y^2}{2}\\right]_2^5 = 29400\\left(\\frac{25-4}{2}\\right) = 29400(10.5) = 308{,}700 \\text{ N}$$',
                id: 'Tekanan fluida di kedalaman $y$ adalah $\\rho g y$ ($\\rho$ kerapatan fluida, $g$ percepatan gravitasi) — air yang lebih dalam menekan lebih kuat. Pada lempeng tegak berlebar $w(y)$ di kedalaman $y$, gaya pada jalur mendatar tipis bertinggi $dy$ adalah tekanan dikali luas, $\\rho g y \\cdot w(y)\\,dy$. Menjumlahkan pada seluruh lempeng:\n$$F = \\int_a^b \\rho g\\, y\\, w(y)\\,dy$$\nUntuk air, $\\rho g \\approx 9800$ N/m³. Lempeng persegi panjang berlebar tetap $3$ m, terendam dengan tepi atasnya di kedalaman $2$ m dan tepi bawahnya di kedalaman $5$ m:\n$$F = \\int_2^5 9800(3)y\\,dy = 29400\\left[\\frac{y^2}{2}\\right]_2^5 = 29400\\left(\\frac{25-4}{2}\\right) = 29400(10.5) = 308{.}700 \\text{ N}$$',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A plate touching the surface, and why the bounds do the real work', id: 'Lempeng yang menyentuh permukaan, dan mengapa batasnyalah yang benar-benar bekerja' },
              body: {
                en: 'For a plate of width $2$ m with its top edge right at the surface ($a=0$) down to depth $4$ m:\n$$F = \\int_0^4 9800(2)y\\,dy = 19600\\left[\\frac{y^2}{2}\\right]_0^4 = 19600(8) = 156{,}800 \\text{ N}$$\nThe entire problem lives in choosing the right bounds and width function — once those are set up correctly from the physical picture, the integral itself is routine. This is the same lesson optimization problems taught in the Derivatives course: the translation from a physical setup into a function is the genuinely hard step.',
                id: 'Untuk lempeng berlebar $2$ m dengan tepi atasnya tepat di permukaan ($a=0$) sampai kedalaman $4$ m:\n$$F = \\int_0^4 9800(2)y\\,dy = 19600\\left[\\frac{y^2}{2}\\right]_0^4 = 19600(8) = 156{.}800 \\text{ N}$$\nSeluruh soalnya terletak pada memilih batas dan fungsi lebar yang tepat — begitu itu disusun dengan benar dari gambaran fisiknya, integralnya sendiri rutin. Ini pelajaran yang sama yang diajarkan soal optimisasi di kursus Turunan: penerjemahan dari susunan fisik menjadi fungsi adalah langkah yang sungguh sulit.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why does fluid force on a submerged plate need an integral, rather than a single pressure-times-area calculation?',
                id: 'Mengapa gaya fluida pada lempeng terendam memerlukan integral, bukan penghitungan tekanan-kali-luas tunggal?',
              },
              options: [
                { en: 'Pressure increases with depth, so different horizontal strips of the plate feel different pressure', id: 'Tekanan bertambah dengan kedalaman, sehingga jalur mendatar yang berbeda pada lempeng merasakan tekanan yang berbeda' },
                { en: 'Pressure is actually constant at every depth', id: 'Tekanan sebenarnya konstan di setiap kedalaman' },
                { en: 'Fluid never actually exerts force on a flat plate', id: 'Fluida sebenarnya tak pernah memberi gaya pada lempeng datar' },
                { en: 'The plate\'s width is the only thing that ever changes', id: 'Lebar lempengnya satu-satunya yang pernah berubah' },
              ],
              answer: 0,
              explain: {
                en: 'A single pressure-times-area calculation would only be valid if pressure were the same everywhere on the plate. Since pressure genuinely depends on depth, each thin strip needs its own pressure, and integrating adds all those strips up correctly.',
                id: 'Penghitungan tekanan-kali-luas tunggal hanya sah bila tekanannya sama di mana-mana pada lempengnya. Karena tekanan memang bergantung pada kedalaman, tiap jalur tipis memerlukan tekanannya sendiri, dan mengintegralkan menjumlahkan semua jalur itu dengan benar.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the steps for the fluid force on a plate of width 2 m from depth 0 to 4 m.',
                id: 'Susun langkah gaya fluida pada lempeng berlebar 2 m dari kedalaman 0 sampai 4 m.',
              },
              lines: [
                'F = \\int_0^4 9800(2)y\\,dy',
                '= 19600\\left[\\dfrac{y^2}{2}\\right]_0^4',
                '= 19600(8)',
                '= 156{.}800 \\text{ N}',
              ],
              explain: {
                en: 'Set up the integral with the width and $\\rho g$ in place, antidifferentiate, substitute the bounds, then multiply out.',
                id: 'Susun integralnya dengan lebar dan $\\rho g$ terpasang, antiturunkan, substitusikan batasnya, baru kalikan.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the fluid force on a rectangular plate of width 4 m, submerged from depth 0 to 2 m. (Use $\\rho g = 9800$.)',
                id: 'Cari gaya fluida pada lempeng persegi panjang berlebar 4 m, terendam dari kedalaman 0 sampai 2 m. (Pakai $\\rho g = 9800$.)',
              },
              blanks: [{ answer: 78400 }],
              hints: [
                { en: '$F = 9800(4)\\int_0^2 y\\,dy$.', id: '$F = 9800(4)\\int_0^2 y\\,dy$.' },
              ],
              explain: {
                en: '$F = 39200\\left[\\dfrac{y^2}{2}\\right]_0^2 = 39200(2) = 78{,}400$ N.',
                id: '$F = 39200\\left[\\dfrac{y^2}{2}\\right]_0^2 = 39200(2) = 78{.}400$ N.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'int-m8-s1-p',
        runtime: 'math',
        title: { en: 'Springs and Submerged Plates', id: 'Pegas dan Lempeng Terendam' },
        brief: {
          en: 'A spring problem, and two fluid force problems.',
          id: 'Satu soal pegas, dan dua soal gaya fluida.',
        },
        requirements: [
          { en: "Hooke's Law gives $F(x) = kx$; find $k$ first from the given force and stretch.", id: 'Hukum Hooke memberi $F(x) = kx$; cari $k$ lebih dahulu dari gaya dan regangan yang diberikan.' },
          { en: 'Fluid force integrates $\\rho g\\,y\\,w(y)$ over the depth the plate spans.', id: 'Gaya fluida mengintegralkan $\\rho g\\,y\\,w(y)$ pada kedalaman yang dijangkau lempengnya.' },
        ],
        tasks: [
          {
            prompt: { en: 'A spring needs 5 N to stretch 0.1 m. Find the work to stretch it from its natural length to 0.4 m.', id: 'Sebuah pegas memerlukan 5 N untuk meregang 0.1 m. Cari usaha untuk meregangkannya dari panjang alaminya sampai 0.4 m.' },
            blanks: [{ answer: 4 }],
            solution: ['k=5/0.1=50, \\quad W=\\int_0^{0.4}50x\\,dx = 25(0.16) = 4 \\text{ J}'],
          },
          {
            prompt: { en: 'Find the fluid force on a rectangular plate of width 5 m, submerged from depth 1 to 3 m.', id: 'Cari gaya fluida pada lempeng persegi panjang berlebar 5 m, terendam dari kedalaman 1 sampai 3 m.' },
            blanks: [{ answer: 196000 }],
            solution: ["F=9800(5)\\int_1^3 y\\,dy = 49000\\left(\\dfrac{9-1}{2}\\right) = 49000(4) = 196{.}000 \\text{ N}"],
          },
          {
            prompt: { en: 'Find the fluid force on a rectangular plate of width 4 m, submerged from depth 0 to 2 m.', id: 'Cari gaya fluida pada lempeng persegi panjang berlebar 4 m, terendam dari kedalaman 0 sampai 2 m.' },
            blanks: [{ answer: 78400 }],
            solution: ["F=9800(4)\\int_0^2 y\\,dy = 39200(2) = 78{.}400 \\text{ N}"],
          },
        ],
        hints: [
          { en: 'Part 3 repeats the same setup as the lesson\'s own example — a useful check on the method itself.', id: 'Butir 3 mengulang susunan yang sama seperti contoh pada pelajarannya sendiri — pemeriksaan yang berguna untuk metodenya sendiri.' },
        ],
        xp: 50,
      },
    },

    /* ------------------------------------------------ 8.2 moments and center of mass */
    {
      id: 'int-m8-s2',
      title: { en: 'Moments and Centers of Mass', id: 'Momen dan Pusat Massa' },
      summary: {
        en: 'Finding the balance point of a rod with varying density, and of a flat region bounded by a curve.',
        id: 'Mencari titik keseimbangan sebuah batang dengan kerapatan yang berubah, dan sebuah daerah datar yang dibatasi kurva.',
      },
      lessons: [
        {
          id: 'int-m8-s2-l1',
          title: { en: 'Moments and the Center of Mass of a Rod', id: 'Momen dan Pusat Massa Sebuah Batang' },
          goal: {
            en: 'Find the balance point of a rod with variable density using a mass integral and a moment integral.',
            id: 'Mencari titik keseimbangan batang dengan kerapatan yang berubah memakai integral massa dan integral momen.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A weighted average, built from two integrals', id: 'Rata-rata berbobot, dibangun dari dua integral' },
              body: {
                en: 'For a rod along $[a,b]$ with density $\\delta(x)$ (mass per unit length), the total mass is $M=\\int_a^b \\delta(x)\\,dx$. The **moment** about the origin, $M_0=\\int_a^b x\\,\\delta(x)\\,dx$, weighs each piece\'s position by its mass. The **center of mass** is the balance point:\n$$\\bar{x} = \\frac{M_0}{M} = \\frac{\\int_a^b x\\,\\delta(x)\\,dx}{\\int_a^b \\delta(x)\\,dx}$$\nFor $\\delta(x)=x+1$ on $[0,4]$ (denser toward the right end): $M=\\int_0^4(x+1)\\,dx = 8+4=12$. $M_0=\\int_0^4 x(x+1)\\,dx = \\left[\\frac{x^3}{3}+\\frac{x^2}{2}\\right]_0^4 = \\frac{64}{3}+8=\\frac{88}{3}$. So $\\bar{x}=\\frac{88/3}{12}=\\frac{22}{9}\\approx 2.44$ — right of the geometric midpoint $2$, exactly as expected since the rod is heavier on that side.',
                id: 'Untuk batang sepanjang $[a,b]$ dengan kerapatan $\\delta(x)$ (massa per satuan panjang), total massanya adalah $M=\\int_a^b \\delta(x)\\,dx$. **Momen** terhadap titik asal, $M_0=\\int_a^b x\\,\\delta(x)\\,dx$, membobot posisi tiap bagian dengan massanya. **Pusat massa** adalah titik keseimbangannya:\n$$\\bar{x} = \\frac{M_0}{M} = \\frac{\\int_a^b x\\,\\delta(x)\\,dx}{\\int_a^b \\delta(x)\\,dx}$$\nUntuk $\\delta(x)=x+1$ pada $[0,4]$ (lebih rapat ke ujung kanan): $M=\\int_0^4(x+1)\\,dx = 8+4=12$. $M_0=\\int_0^4 x(x+1)\\,dx = \\left[\\frac{x^3}{3}+\\frac{x^2}{2}\\right]_0^4 = \\frac{64}{3}+8=\\frac{88}{3}$. Jadi $\\bar{x}=\\frac{88/3}{12}=\\frac{22}{9}\\approx 2.44$ — di kanan titik tengah geometris $2$, persis seperti yang diharapkan sebab batangnya lebih berat di sisi itu.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Why the center of mass leans toward the heavier end', id: 'Mengapa pusat massa condong ke ujung yang lebih berat' },
              body: {
                en: '$\\bar{x}$ is structurally identical to an average, just weighted continuously by $\\delta(x)$ instead of by equal counts — the same idea as a weighted average grade, where an exam worth more counts for more. Since $\\delta(x)=x+1$ grows toward $x=4$, the pieces near $x=4$ pull the balance point rightward more than the light pieces near $x=0$ pull it left, landing $\\bar{x}$ past the plain midpoint. A rod with *constant* density has $\\delta(x)=k$ for some constant $k$, and the formula reduces to exactly the geometric midpoint $\\frac{a+b}{2}$ — uniform weighting recovers the ordinary average.',
                id: '$\\bar{x}$ secara struktural identik dengan sebuah rata-rata, hanya dibobot secara sinambung oleh $\\delta(x)$ alih-alih dengan jumlah yang sama — gagasan yang sama seperti nilai rata-rata berbobot, tempat ujian yang bobotnya lebih besar dihitung lebih banyak. Karena $\\delta(x)=x+1$ bertumbuh menuju $x=4$, bagian-bagian dekat $x=4$ menarik titik keseimbangannya ke kanan lebih kuat dibanding bagian ringan dekat $x=0$ menariknya ke kiri, mendaratkan $\\bar{x}$ melewati titik tengah biasa. Batang dengan kerapatan *konstan* punya $\\delta(x)=k$ untuk suatu konstanta $k$, dan rumusnya menyusut menjadi persis titik tengah geometris $\\frac{a+b}{2}$ — pembobotan yang seragam memulihkan rata-rata biasa.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why does the center of mass of a rod with increasing density land to the right of the geometric midpoint?',
                id: 'Mengapa pusat massa batang dengan kerapatan yang meningkat mendarat di kanan titik tengah geometris?',
              },
              options: [
                { en: 'The heavier pieces on the right pull the weighted balance point in their direction, more than the lighter pieces on the left pull it the other way', id: 'Bagian yang lebih berat di kanan menarik titik keseimbangan berbobotnya ke arah mereka, lebih kuat dibanding bagian yang lebih ringan di kiri menariknya ke arah sebaliknya' },
                { en: 'It never actually does — the center of mass always equals the geometric midpoint', id: 'Sebenarnya tak pernah begitu — pusat massa selalu sama dengan titik tengah geometris' },
                { en: 'The moment integral ignores mass entirely', id: 'Integral momen sama sekali mengabaikan massa' },
                { en: 'Density has no effect on the center of mass', id: 'Kerapatan tak berpengaruh pada pusat massa' },
              ],
              answer: 0,
              explain: {
                en: 'The center of mass is a mass-weighted average of position. When more mass sits toward one end, that end has proportionally more influence on the average, pulling the balance point toward it.',
                id: 'Pusat massa adalah rata-rata posisi yang dibobot massa. Ketika lebih banyak massa duduk ke satu ujung, ujung itu punya pengaruh yang proporsional lebih besar pada rata-ratanya, menarik titik keseimbangannya ke arah situ.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the center of mass computation for a rod of constant density $k$ on $[a, b]$.',
                id: 'Lengkapi penghitungan pusat massa batang berkerapatan konstan $k$ pada $[a, b]$.',
              },
              template: '\\bar{x} = \\dfrac{\\int_a^b x\\cdot k\\,dx}{\\int_a^b k\\,dx} = \\dfrac{k(b^2-a^2)/2}{k(b-a)} = (a+___)/___',
              blanks: ['b', '2'],
              explain: {
                en: '$(b^2 - a^2)/(b - a)$ simplifies to $(a + b)$, and dividing by the extra factor of 2 in the numerator leaves the plain average $(a + b)/2$.',
                id: '$(b^2 - a^2)/(b - a)$ menyederhana menjadi $(a + b)$, dan membagi dengan faktor tambahan 2 di pembilang menyisakan rata-rata biasa $(a + b)/2$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the center of mass of a rod on $[0, 3]$ with density $\\delta(x) = 2x$.',
                id: 'Cari pusat massa batang pada $[0, 3]$ dengan kerapatan $\\delta(x) = 2x$.',
              },
              blanks: [{ answer: 2 }],
              hints: [
                { en: '$M = \\int 2x\\,dx = x^2$. $M_0 = \\int 2x^2\\,dx = \\tfrac23 x^3$.', id: '$M = \\int 2x\\,dx = x^2$. $M_0 = \\int 2x^2\\,dx = \\tfrac23 x^3$.' },
              ],
              explain: {
                en: '$M = 9$, $M_0 = 18$, $\\bar x = 18/9 = 2$.',
                id: '$M = 9$, $M_0 = 18$, $\\bar x = 18/9 = 2$.',
              },
            },
          ],
        },
        {
          id: 'int-m8-s2-l2',
          title: { en: 'Center of Mass of a Planar Region', id: 'Pusat Massa Daerah Datar' },
          goal: {
            en: 'Extend the center of mass formulas to a two-dimensional region bounded by a curve, finding both coordinates.',
            id: 'Memperluas rumus pusat massa ke daerah dua dimensi yang dibatasi kurva, mencari kedua koordinatnya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A vertical strip stands in for a point mass', id: 'Jalur tegak menggantikan sebuah massa titik' },
              body: {
                en: 'For a flat region of constant density under $y=f(x)$ on $[a,b]$, each thin vertical strip at position $x$ acts like a point mass at height $\\frac{f(x)}{2}$ (its own midpoint) with mass proportional to its area $f(x)\\,dx$. This gives two coordinates for the **centroid** (center of mass of a shape):\n$$\\bar{x} = \\frac{\\int_a^b x\\,f(x)\\,dx}{\\int_a^b f(x)\\,dx}, \\qquad \\bar{y} = \\frac{\\int_a^b \\tfrac12\\big[f(x)\\big]^2\\,dx}{\\int_a^b f(x)\\,dx}$$\nFor $f(x)=x^2$ on $[0,2]$: area $A=\\int_0^2 x^2\\,dx=\\frac83$. $\\bar{x}=\\frac{\\int_0^2 x^3\\,dx}{8/3} = \\frac{4}{8/3}=1.5$. $\\bar{y}=\\frac{\\frac12\\int_0^2 x^4\\,dx}{8/3} = \\frac{16/5}{8/3}=1.2$. The centroid sits at $(1.5,\\,1.2)$ — inside the region, closer to the taller right side, exactly as intuition about a heavier right side would suggest.',
                id: 'Untuk daerah datar berkerapatan konstan di bawah $y=f(x)$ pada $[a,b]$, tiap jalur tegak tipis di posisi $x$ berperan seperti massa titik pada tinggi $\\frac{f(x)}{2}$ (titik tengahnya sendiri) dengan massa sebanding luasnya $f(x)\\,dx$. Ini memberi dua koordinat untuk **sentroid** (pusat massa sebuah bentuk):\n$$\\bar{x} = \\frac{\\int_a^b x\\,f(x)\\,dx}{\\int_a^b f(x)\\,dx}, \\qquad \\bar{y} = \\frac{\\int_a^b \\tfrac12\\big[f(x)\\big]^2\\,dx}{\\int_a^b f(x)\\,dx}$$\nUntuk $f(x)=x^2$ pada $[0,2]$: luas $A=\\int_0^2 x^2\\,dx=\\frac83$. $\\bar{x}=\\frac{\\int_0^2 x^3\\,dx}{8/3} = \\frac{4}{8/3}=1.5$. $\\bar{y}=\\frac{\\frac12\\int_0^2 x^4\\,dx}{8/3} = \\frac{16/5}{8/3}=1.2$. Sentroidnya duduk di $(1.5,\\,1.2)$ — di dalam daerahnya, lebih dekat ke sisi kanan yang lebih tinggi, persis seperti yang disarankan intuisi tentang sisi kanan yang lebih berat.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.5, 2.5],
                ySpan: [-0.5, 4.5],
                ticks: true,
                items: [
                  { t: 'poly', pts: [[0, 0], [0.5, 0.25], [1, 1], [1.5, 2.25], [2, 4], [2, 0]], color: 'result' },
                  { t: 'curve', f: 'x^2', from: 0, to: 2, color: 'a' },
                  { t: 'dot', x: 1.5, y: 1.2, color: 'b', label: '(1.5, 1.2)' },
                ],
                caption: {
                  en: 'The region under $y = x^2$ on $[0, 2]$, with its centroid marked at $(1.5, 1.2)$ — pulled toward the taller, wider right side.',
                  id: 'Daerah di bawah $y = x^2$ pada $[0, 2]$, dengan sentroidnya ditandai di $(1.5, 1.2)$ — tertarik ke sisi kanan yang lebih tinggi dan lebar.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Symmetry decides a coordinate before any integral is computed', id: 'Simetri memutuskan satu koordinat sebelum integral apa pun dihitung' },
              body: {
                en: 'If a region is symmetric about a vertical line $x=c$, its centroid must lie on that line — $\\bar{x}=c$ exactly, with no integration needed for that coordinate. A semicircular region under $y=\\sqrt{r^2-x^2}$ is symmetric about $x=0$, so $\\bar{x}=0$ is immediate, and only $\\bar{y}$ genuinely requires a computation. Checking for symmetry first can cut the work for a centroid problem in half — the same habit of looking before computing that paid off throughout the Derivatives course.',
                id: 'Jika sebuah daerah simetris terhadap garis tegak $x=c$, sentroidnya harus terletak pada garis itu — $\\bar{x}=c$ persis, tanpa perlu integral untuk koordinat itu. Daerah setengah lingkaran di bawah $y=\\sqrt{r^2-x^2}$ simetris terhadap $x=0$, sehingga $\\bar{x}=0$ langsung diketahui, dan hanya $\\bar{y}$ yang sungguh memerlukan penghitungan. Memeriksa simetri lebih dahulu bisa memotong separuh pekerjaan soal sentroid — kebiasaan melihat sebelum menghitung yang sama yang terbayar sepanjang kursus Turunan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'If a region is symmetric about the vertical line $x = 3$, what can be said about its centroid without computing any integral?',
                id: 'Jika sebuah daerah simetris terhadap garis tegak $x = 3$, apa yang bisa dikatakan tentang sentroidnya tanpa menghitung integral apa pun?',
              },
              options: [
                { en: 'Its $x$-coordinate must be exactly $3$', id: 'Koordinat $x$-nya harus tepat $3$' },
                { en: 'Its $y$-coordinate must be exactly $3$', id: 'Koordinat $y$-nya harus tepat $3$' },
                { en: 'Nothing can be said without computing both integrals', id: 'Tak ada yang bisa dikatakan tanpa menghitung kedua integral' },
                { en: 'The region must have zero area', id: 'Daerahnya harus berluas nol' },
              ],
              answer: 0,
              explain: {
                en: 'A shape symmetric about a vertical line balances perfectly across that line, so its horizontal balance point — the x-coordinate of the centroid — must sit exactly on it.',
                id: 'Bentuk yang simetris terhadap garis tegak seimbang sempurna melintasi garis itu, sehingga titik keseimbangan mendatarnya — koordinat x sentroidnya — harus duduk tepat di situ.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the figure above, why does the centroid sit above the region\'s geometric midpoint $x = 1$, at $x = 1.5$ instead?',
                id: 'Dengan membaca gambar di atas, mengapa sentroidnya duduk di atas titik tengah geometris daerahnya $x = 1$, di $x = 1.5$ sebagai gantinya?',
              },
              figure: {
                dim: 2,
                xSpan: [-0.5, 2.5],
                ySpan: [-0.5, 4.5],
                ticks: true,
                items: [
                  { t: 'poly', pts: [[0, 0], [0.5, 0.25], [1, 1], [1.5, 2.25], [2, 4], [2, 0]], color: 'result' },
                  { t: 'curve', f: 'x^2', from: 0, to: 2, color: 'a' },
                  { t: 'dot', x: 1.5, y: 1.2, color: 'b' },
                ],
              },
              options: [
                { en: 'The region is much taller (and so has more area) on its right side than its left, pulling the balance point rightward', id: 'Daerahnya jauh lebih tinggi (dan karenanya berluas lebih besar) di sisi kanannya dibanding kirinya, menarik titik keseimbangannya ke kanan' },
                { en: 'x = 1.5 is actually a computational mistake', id: 'x = 1.5 sebenarnya kesalahan penghitungan' },
                { en: 'The region is symmetric, so this is a coincidence', id: 'Daerahnya simetris, jadi ini kebetulan' },
                { en: 'Centroids are always at the right edge of a region', id: 'Sentroid selalu di tepi kanan sebuah daerah' },
              ],
              answer: 0,
              explain: {
                en: '$y = x^2$ rises steeply, so the strips near $x = 2$ are far taller (and heavier) than the strips near $x = 0$ — an asymmetric region has no reason to balance at its plain geometric midpoint.',
                id: '$y = x^2$ naik dengan curam, sehingga jalur dekat $x = 2$ jauh lebih tinggi (dan lebih berat) dibanding jalur dekat $x = 0$ — daerah yang tak simetris tak punya alasan untuk seimbang di titik tengah geometris biasanya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find $\\bar y$ for the triangular region under $y = 3x$ on $[0, 2]$.',
                id: 'Cari $\\bar y$ untuk daerah segitiga di bawah $y = 3x$ pada $[0, 2]$.',
              },
              blanks: [{ label: '\\bar y =', answer: 2 }],
              hints: [
                { en: '$A = \\int 3x\\,dx = 6$. The $\\bar y$ numerator is $\\tfrac12\\int (3x)^2\\,dx$.', id: '$A = \\int 3x\\,dx = 6$. Pembilang $\\bar y$ adalah $\\tfrac12\\int (3x)^2\\,dx$.' },
              ],
              explain: {
                en: 'Numerator $= \\tfrac12(9)(8/3) = 12$. $\\bar y = 12/6 = 2$.',
                id: 'Pembilang $= \\tfrac12(9)(8/3) = 12$. $\\bar y = 12/6 = 2$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'int-m8-s2-p',
        runtime: 'math',
        title: { en: 'Balance Points', id: 'Titik Keseimbangan' },
        brief: {
          en: 'A rod\'s center of mass, and a region\'s centroid, both coordinates.',
          id: 'Pusat massa sebuah batang, dan sentroid sebuah daerah, kedua koordinatnya.',
        },
        requirements: [
          { en: '$\\bar x$ is always the moment integral divided by the mass or area integral.', id: '$\\bar x$ selalu integral momen dibagi integral massa atau luas.' },
          { en: 'A region\'s $\\bar y$ uses $\\tfrac12$ times the integral of $f(x)$ squared as its numerator.', id: '$\\bar y$ sebuah daerah memakai $\\tfrac12$ dikali integral dari $f(x)$ kuadrat sebagai pembilangnya.' },
        ],
        tasks: [
          {
            prompt: { en: 'Find the center of mass of a rod on $[0, 5]$ with density $\\delta(x) = 2x + 3$. (Round to two decimal places.)', id: 'Cari pusat massa batang pada $[0, 5]$ dengan kerapatan $\\delta(x) = 2x + 3$. (Bulatkan ke dua desimal.)' },
            blanks: [{ answer: 3.02 }],
            solution: ['M=\\int_0^5(2x+3)dx = 25+15=40', 'M_0=\\int_0^5 x(2x+3)dx = \\tfrac{2(125)}{3}+\\tfrac{3(25)}{2} \\approx 83{,}33+37{,}5=120{,}83', '\\bar x = 120{,}83/40 \\approx 3{,}02'],
          },
          {
            prompt: { en: 'Find $\\bar x$ for the region under $y = \\sqrt{x}$ on $[0, 4]$.', id: 'Cari $\\bar x$ untuk daerah di bawah $y = \\sqrt{x}$ pada $[0, 4]$.' },
            blanks: [{ answer: 2.4 }],
            solution: ['A=\\tfrac23(4)^{1.5}=\\tfrac{16}{3}, \\quad \\int_0^4 x\\sqrt x\\,dx = \\tfrac25(4)^{2.5}=\\tfrac{64}{5}', '\\bar x = \\dfrac{64/5}{16/3} = 2{,}4'],
          },
          {
            prompt: { en: 'Find $\\bar y$ for the same region under $y = \\sqrt{x}$ on $[0, 4]$.', id: 'Cari $\\bar y$ untuk daerah yang sama di bawah $y = \\sqrt{x}$ pada $[0, 4]$.' },
            blanks: [{ answer: 0.75 }],
            solution: ['\\text{numerator} = \\tfrac12\\int_0^4 x\\,dx = \\tfrac12(8)=4', '\\bar y = \\dfrac{4}{16/3} = 0{,}75'],
          },
        ],
        hints: [
          { en: 'Parts 2 and 3 share the same area, computed once — reuse it instead of recomputing.', id: 'Butir 2 dan 3 berbagi luas yang sama, dihitung sekali — pakai ulang alih-alih menghitung ulang.' },
        ],
        xp: 50,
      },
    },
  ],
}
