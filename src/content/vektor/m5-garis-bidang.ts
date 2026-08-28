import type { Module } from '../types'

/** Module 5 — where the algebra becomes geometry. A line needs a point and a
 *  direction; a plane needs a point and a normal. Every formula here is one of
 *  the two products from Modules 3 and 4, applied to that pair. */
export const module5: Module = {
  id: 'vek-m5',
  title: { en: 'Lines and Planes in Space', id: 'Garis dan Bidang di Ruang' },
  summary: {
    en: 'Describe a line by a point and a direction, a plane by a point and a normal, and measure the distance between them.',
    id: 'Menyatakan garis lewat sebuah titik dan sebuah arah, bidang lewat sebuah titik dan sebuah normal, serta mengukur jarak di antaranya.',
  },
  submodules: [
    /* --------------------------------------------------------- 5.1 lines */
    {
      id: 'vek-m5-s1',
      title: { en: 'The Equation of a Line', id: 'Persamaan Garis' },
      summary: {
        en: 'Vector, parametric and symmetric form — three ways of writing the same line.',
        id: 'Bentuk vektor, parametrik, dan simetrik — tiga cara menuliskan garis yang sama.',
      },
      lessons: [
        {
          id: 'vek-m5-s1-l1',
          title: { en: 'A Point and a Direction', id: 'Sebuah Titik dan Sebuah Arah' },
          goal: {
            en: 'Write a line in vector and parametric form, and find points on it.',
            id: 'Menulis garis dalam bentuk vektor dan parametrik, serta menentukan titik-titik padanya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Start somewhere, then walk', id: 'Mulai dari suatu tempat, lalu berjalan' },
              body: {
                en: 'A line in space is fixed by one point on it and one direction along it. Let $\\vec{r_0}$ be the position vector of a known point $P_0$, and $\\vec{v}$ a **direction vector**. Every point on the line is reached by starting at $P_0$ and walking some multiple of $\\vec{v}$:\n$$\\vec{r} = \\vec{r_0} + t\\,\\vec{v}, \\qquad t \\in R$$\nThat is the **vector form**. Each value of the parameter $t$ names one point: $t = 0$ gives $P_0$ itself, $t = 1$ gives the point one $\\vec{v}$ further on, negative $t$ goes backwards.\n\nNeither ingredient is unique — any point on the line will do for $\\vec{r_0}$, and any non-zero multiple of $\\vec{v}$ will do for the direction. Two lines with parallel direction vectors are parallel lines.',
                id: 'Sebuah garis di ruang ditentukan oleh satu titik padanya dan satu arah sepanjangnya. Misalkan $\\vec{r_0}$ vektor posisi sebuah titik $P_0$ yang diketahui, dan $\\vec{v}$ sebuah **vektor arah**. Setiap titik pada garis dicapai dengan berangkat dari $P_0$ lalu berjalan sekian kali $\\vec{v}$:\n$$\\vec{r} = \\vec{r_0} + t\\,\\vec{v}, \\qquad t \\in R$$\nItulah **bentuk vektor**. Setiap nilai parameter $t$ menamai satu titik: $t = 0$ memberi $P_0$ itu sendiri, $t = 1$ memberi titik sejauh satu $\\vec{v}$ berikutnya, $t$ negatif berjalan mundur.\n\nKedua bahannya tidak tunggal — titik mana pun pada garis boleh dipakai sebagai $\\vec{r_0}$, dan kelipatan tak nol mana pun dari $\\vec{v}$ boleh dipakai sebagai arahnya. Dua garis yang vektor arahnya sejajar adalah garis-garis yang sejajar.',
              },
              figure: {
                dim: 3,
                range: 6,
                interactive: true,
                view: [70, 20],
                items: [
                  // The line itself, drawn well past both ends of the sampled points.
                  { t: 'seg', from: [-5, -2, 6], to: [7, -2, 2], color: 'muted' },
                  { t: 'vec', to: [1, -2, 4], label: 'r₀', color: 'a', dashed: true },
                  { t: 'vec', from: [1, -2, 4], to: [4, -2, 3], label: 'v', color: 'b' },
                  { t: 'point', at: [1, -2, 4] },
                  { t: 'point', at: [4, -2, 3], label: 't = 1' },
                  { t: 'point', at: [-2, -2, 5], label: 't = -1' },
                ],
                caption: {
                  en: 'Start at $\\vec{r_0}$ and walk $t$ copies of $\\vec{v}$. Whole values of $t$ are marked; every real value in between names a point too, and negative ones walk backwards. Turn the scene to see that all of them really are on one line.',
                  id: 'Berangkat dari $\\vec{r_0}$ lalu berjalan sejauh $t$ kali $\\vec{v}$. Nilai bulat $t$ ditandai; setiap nilai real di antaranya juga menamai satu titik, dan nilai negatifnya berjalan mundur. Putar gambarnya untuk melihat bahwa semuanya memang terletak pada satu garis.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The same thing, one coordinate at a time', id: 'Hal yang sama, satu koordinat setiap kali' },
              body: {
                en: 'Reading $\\vec{r} = \\vec{r_0} + t\\vec{v}$ slot by slot gives the **parametric form**:\n$$x = x_0 + a t, \\qquad y = y_0 + b t, \\qquad z = z_0 + c t$$\nwhere $\\vec{v} = (a, b, c)$. Three equations, one shared parameter.\n\nTo test whether a point lies on the line, solve any one of the three for $t$ and check that the same $t$ satisfies the other two. If it does not, the point is off the line.',
                id: 'Membaca $\\vec{r} = \\vec{r_0} + t\\vec{v}$ slot demi slot memberi **bentuk parametrik**:\n$$x = x_0 + a t, \\qquad y = y_0 + b t, \\qquad z = z_0 + c t$$\ndengan $\\vec{v} = (a, b, c)$. Tiga persamaan, satu parameter bersama.\n\nUntuk menguji apakah sebuah titik terletak pada garis, selesaikan salah satu dari ketiganya untuk $t$ lalu periksa apakah $t$ yang sama memenuhi dua sisanya. Bila tidak, titiknya berada di luar garis.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which vector could **not** be used as the direction vector of the line $\\vec{r} = (1, 0, 2) + t(2, -4, 6)$?',
                id: 'Vektor manakah yang **tidak** dapat dipakai sebagai vektor arah garis $\\vec{r} = (1, 0, 2) + t(2, -4, 6)$?',
              },
              options: [
                { en: '$(1, -2, 3)$', id: '$(1, -2, 3)$' },
                { en: '$(-2, 4, -6)$', id: '$(-2, 4, -6)$' },
                { en: '$(1, 0, 2)$', id: '$(1, 0, 2)$' },
                { en: '$(4, -8, 12)$', id: '$(4, -8, 12)$' },
              ],
              answer: 2,
              explain: {
                en: 'A direction vector may be replaced by any non-zero multiple of itself. $(1,-2,3)$, $(-2,4,-6)$ and $(4,-8,12)$ are all multiples of $(2,-4,6)$; $(1,0,2)$ is not — it happens to be the position vector of the starting point, which is a different thing entirely.',
                id: 'Vektor arah boleh diganti dengan kelipatan tak nol mana pun dari dirinya. $(1,-2,3)$, $(-2,4,-6)$, dan $(4,-8,12)$ semuanya kelipatan $(2,-4,6)$; $(1,0,2)$ tidak — kebetulan ia vektor posisi titik pangkalnya, dan itu hal yang sama sekali berbeda.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'The line through $A(1, -2, 4)$ with direction $(3, 0, -1)$ is written parametrically. Complete the point at $t = 2$.',
                id: 'Garis melalui $A(1, -2, 4)$ dengan arah $(3, 0, -1)$ ditulis secara parametrik. Lengkapi titik pada $t = 2$.',
              },
              template: '(1 + 3t,\\ -2 + 0t,\\ 4 - t) \\text{ pada } t = 2: \\quad (___,\\ ___,\\ ___)',
              blanks: ['7', '-2', '2'],
              explain: {
                en: '$1 + 6 = 7$, the middle coordinate never moves because its direction component is 0, and $4 - 2 = 2$. A zero component means the line is level in that coordinate.',
                id: '$1 + 6 = 7$, koordinat tengahnya tak pernah bergerak karena komponen arahnya 0, dan $4 - 2 = 2$. Komponen nol berarti garisnya datar pada koordinat itu.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              inline: true,
              prompt: {
                en: 'For the line $\\vec{r} = (1, -2, 4) + t(3, 0, -1)$, find the point at $t = -1$.',
                id: 'Untuk garis $\\vec{r} = (1, -2, 4) + t(3, 0, -1)$, tentukan titik pada $t = -1$.',
              },
              blanks: [{ answer: -2 }, { answer: -2 }, { answer: 5 }],
              hints: [
                { en: 'A negative $t$ walks backwards along the direction vector.', id: '$t$ yang negatif berjalan mundur sepanjang vektor arahnya.' },
                { en: '$1 + 3(-1) = -2$, and $4 - (-1) = 5$.', id: '$1 + 3(-1) = -2$, dan $4 - (-1) = 5$.' },
              ],
              solution: ['(1 - 3,\\ -2 + 0,\\ 4 + 1) = (-2,\\ -2,\\ 5)'],
              explain: {
                en: 'The two $-2$s here are a coincidence: the first is $1 - 3$, the second is the fixed $y$ coordinate of the whole line.',
                id: 'Dua angka $-2$ di sini kebetulan saja: yang pertama berasal dari $1 - 3$, yang kedua adalah koordinat $y$ yang tetap sepanjang garis itu.',
              },
            },
          ],
        },
        {
          id: 'vek-m5-s1-l2',
          title: { en: 'Symmetric Form and Lines Through Two Points', id: 'Bentuk Simetrik dan Garis Melalui Dua Titik' },
          goal: {
            en: 'Eliminate the parameter, and build a line from two given points.',
            id: 'Menghilangkan parameternya, dan menyusun garis dari dua titik yang diberikan.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Getting rid of $t$', id: 'Menyingkirkan $t$' },
              body: {
                en: 'Solve each parametric equation for $t$ and set the three results equal. When $a$, $b$ and $c$ are all non-zero this gives the **symmetric form**:\n$$\\frac{x - x_0}{a} = \\frac{y - y_0}{b} = \\frac{z - z_0}{c}$$\nThe parameter is gone, and the denominators are the direction components — which is why you can read a direction vector straight off a line written this way.\n\nIf one component is zero the fraction is undefined, and that coordinate is simply held fixed instead: for $\\vec{v} = (3, 0, -1)$ through $(1, -2, 4)$, write $\\frac{x-1}{3} = \\frac{z-4}{-1}$, $y = -2$.',
                id: 'Selesaikan tiap persamaan parametrik untuk $t$ lalu samakan ketiga hasilnya. Bila $a$, $b$, dan $c$ semuanya tak nol, diperoleh **bentuk simetrik**:\n$$\\frac{x - x_0}{a} = \\frac{y - y_0}{b} = \\frac{z - z_0}{c}$$\nParameternya lenyap, dan penyebutnya adalah komponen arahnya — itu sebabnya vektor arah dapat dibaca langsung dari garis yang ditulis seperti ini.\n\nBila salah satu komponennya nol, pecahannya tak terdefinisi, dan koordinat itu cukup ditahan tetap: untuk $\\vec{v} = (3, 0, -1)$ melalui $(1, -2, 4)$, tulislah $\\frac{x-1}{3} = \\frac{z-4}{-1}$, $y = -2$.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Two points are enough', id: 'Dua titik sudah cukup' },
              body: {
                en: 'Given two points $P$ and $Q$ on a line, the direction is the vector between them:\n$$\\vec{v} = \\vec{PQ} = Q - P$$\nand either point serves as $\\vec{r_0}$. So\n$$\\vec{r} = P + t(Q - P)$$\nThis is the same "terminal minus initial" from Module 1, now doing structural work. Note that $t = 0$ lands on $P$ and $t = 1$ lands on $Q$, so the values between 0 and 1 trace the **segment** $PQ$ and everything outside them extends the line beyond.',
                id: 'Diberikan dua titik $P$ dan $Q$ pada sebuah garis, arahnya adalah vektor di antara keduanya:\n$$\\vec{v} = \\vec{PQ} = Q - P$$\ndan salah satu titiknya boleh dipakai sebagai $\\vec{r_0}$. Jadi\n$$\\vec{r} = P + t(Q - P)$$\nIni "ujung dikurangi pangkal" yang sama dari Modul 1, kini bekerja secara struktural. Perhatikan $t = 0$ jatuh di $P$ dan $t = 1$ jatuh di $Q$, sehingga nilai antara 0 dan 1 menelusuri **ruas** $PQ$ dan nilai di luarnya memperpanjang garisnya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A line is written $\\dfrac{x - 3}{2} = \\dfrac{y + 1}{-5} = \\dfrac{z}{4}$. What is a direction vector for it?',
                id: 'Sebuah garis ditulis $\\dfrac{x - 3}{2} = \\dfrac{y + 1}{-5} = \\dfrac{z}{4}$. Manakah vektor arahnya?',
              },
              options: [
                { en: '$(3, -1, 0)$', id: '$(3, -1, 0)$' },
                { en: '$(2, -5, 4)$', id: '$(2, -5, 4)$' },
                { en: '$(3, 1, 0)$', id: '$(3, 1, 0)$' },
                { en: '$(-2, 5, -4)$ only', id: 'Hanya $(-2, 5, -4)$' },
              ],
              answer: 1,
              explain: {
                en: 'The denominators are the direction components. The numerators give a point on the line, $(3, -1, 0)$ — note the sign flip, since $y + 1$ is $y - (-1)$. And $(-2, 5, -4)$ would also be a valid direction, just not the only one.',
                id: 'Penyebutnya adalah komponen arahnya. Pembilangnya memberi sebuah titik pada garis, $(3, -1, 0)$ — perhatikan tandanya berbalik, sebab $y + 1$ adalah $y - (-1)$. Dan $(-2, 5, -4)$ juga arah yang sah, hanya saja bukan satu-satunya.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the working that decides whether $R(8, 3, -5)$ lies on the line through $P(2, -1, 3)$ and $Q(5, 1, -1)$.',
                id: 'Susun langkah yang memutuskan apakah $R(8, 3, -5)$ terletak pada garis melalui $P(2, -1, 3)$ dan $Q(5, 1, -1)$.',
              },
              lines: [
                '\\vec{v} = \\vec{PQ} = (3,\\ 2,\\ -4)',
                '\\vec{r} = (2 + 3t,\\ -1 + 2t,\\ 3 - 4t)',
                '2 + 3t = 8 \\Rightarrow t = 2',
                '-1 + 2(2) = 3 \\quad \\checkmark, \\qquad 3 - 4(2) = -5 \\quad \\checkmark',
              ],
              explain: {
                en: 'Direction, then the parametric form, then solve one coordinate for $t$, then check the other two against it. Solving all three independently is the usual mistake — the point is that they must agree.',
                id: 'Arahnya, lalu bentuk parametriknya, lalu selesaikan satu koordinat untuk $t$, lalu periksa dua sisanya terhadapnya. Menyelesaikan ketiganya sendiri-sendiri adalah kesalahan yang lazim — intinya justru ketiganya harus sepakat.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the direction vector of the line through $P(2, -1, 3)$ and $Q(5, 1, -1)$, and the value of $t$ that reaches $R(8, 3, -5)$.',
                id: 'Tentukan vektor arah garis melalui $P(2, -1, 3)$ dan $Q(5, 1, -1)$, serta nilai $t$ yang mencapai $R(8, 3, -5)$.',
              },
              figure: {
                dim: 3,
                range: 9,
                interactive: true,
                view: [50, 20],
                height: 320,
                items: [
                  { t: 'seg', from: [-1, -3, 7], to: [8, 3, -5], color: 'muted' },
                  { t: 'point', at: [2, -1, 3], label: 'P' },
                  { t: 'point', at: [5, 1, -1], label: 'Q' },
                  { t: 'point', at: [8, 3, -5], label: 'R', color: 'b' },
                  { t: 'vec', from: [2, -1, 3], to: [5, 1, -1], label: 'v', color: 'a' },
                ],
                caption: {
                  en: 'Turn it: $R$ sits on the same line, further along than $Q$. The question is how many copies of $\\vec{v}$ further.',
                  id: 'Putar: $R$ terletak pada garis yang sama, lebih jauh daripada $Q$. Pertanyaannya, berapa kali $\\vec{v}$ lebih jauhnya.',
                },
              },
              blanks: [
                { label: '\\vec{v} = (', answer: 3 },
                { label: ',', answer: 2 },
                { label: ',', answer: -4, after: ')' },
                { label: 't =', answer: 2 },
              ],
              hints: [
                { en: '$\\vec{v} = Q - P$, taking $P$ as the starting point.', id: '$\\vec{v} = Q - P$, dengan $P$ sebagai titik pangkalnya.' },
                { en: 'For $t$: the $x$ equation is $2 + 3t = 8$.', id: 'Untuk $t$: persamaan $x$-nya adalah $2 + 3t = 8$.' },
              ],
              explain: {
                en: '$\\vec{v} = (3, 2, -4)$, and $t = 2$ satisfies all three coordinates at once — so $R$ is on the line, twice as far along as $Q$.',
                id: '$\\vec{v} = (3, 2, -4)$, dan $t = 2$ memenuhi ketiga koordinatnya sekaligus — jadi $R$ terletak pada garis itu, dua kali sejauh $Q$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'vek-m5-s1-p',
        runtime: 'math',
        title: { en: 'Building a Line', id: 'Menyusun Garis' },
        brief: {
          en: 'A direction from two points, a point from a parameter, and a parameter from a point.',
          id: 'Arah dari dua titik, titik dari sebuah parameter, dan parameter dari sebuah titik.',
        },
        requirements: [
          { en: 'Take the direction as $Q - P$, in the order the points are named.', id: 'Ambil arahnya sebagai $Q - P$, sesuai urutan penyebutan titiknya.' },
          { en: 'In the last part, one value of $t$ must satisfy all three coordinates.', id: 'Pada butir terakhir, satu nilai $t$ harus memenuhi ketiga koordinatnya.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Find a direction vector for the line through $A(0, 3, -2)$ and $B(4, 3, 1)$.',
              id: 'Tentukan vektor arah garis melalui $A(0, 3, -2)$ dan $B(4, 3, 1)$.',
            },
            inline: true,
            blanks: [{ answer: 4 }, { answer: 0 }, { answer: 3 }],
            solution: ['\\vec{v} = \\vec{AB} = (4 - 0,\\ 3 - 3,\\ 1 - (-2)) = (4,\\ 0,\\ 3)'],
          },
          {
            prompt: {
              en: 'On the line $\\vec{r} = (1, 2, -1) + t(2, -1, 4)$, find the point at $t = 3$.',
              id: 'Pada garis $\\vec{r} = (1, 2, -1) + t(2, -1, 4)$, tentukan titik pada $t = 3$.',
            },
            inline: true,
            blanks: [{ answer: 7 }, { answer: -1 }, { answer: 11 }],
            solution: ['(1 + 6,\\ 2 - 3,\\ -1 + 12) = (7,\\ -1,\\ 11)'],
          },
          {
            prompt: {
              en: 'Show that $C(5, 1, 7)$ lies on $\\vec{r} = (1, -3, -1) + t(2, 2, 4)$ by finding the value of $t$.',
              id: 'Tunjukkan bahwa $C(5, 1, 7)$ terletak pada $\\vec{r} = (1, -3, -1) + t(2, 2, 4)$ dengan menentukan nilai $t$.',
            },
            blanks: [{ label: 't =', answer: 2 }],
            solution: [
              '1 + 2t = 5 \\Rightarrow t = 2',
              '-3 + 2(2) = 1 \\quad \\checkmark, \\qquad -1 + 4(2) = 7 \\quad \\checkmark',
            ],
          },
        ],
        hints: [
          {
            en: 'In part 1 the middle component is 0 — the two points share a $y$ coordinate, so the line is level in $y$.',
            id: 'Pada butir 1 komponen tengahnya 0 — kedua titiknya berkoordinat $y$ sama, jadi garisnya datar dalam $y$.',
          },
          {
            en: 'In part 3, solve the easiest coordinate for $t$ and then confirm it in the other two.',
            id: 'Pada butir 3, selesaikan koordinat yang paling mudah untuk $t$ lalu benarkan pada dua koordinat lainnya.',
          },
        ],
        xp: 50,
      },
    },

    /* -------------------------------------------------------- 5.2 planes */
    {
      id: 'vek-m5-s2',
      title: { en: 'Planes and Distance', id: 'Bidang dan Jarak' },
      summary: {
        en: 'A plane from a point and a normal, the distance from a point to it, and the angle between two planes.',
        id: 'Bidang dari sebuah titik dan sebuah normal, jarak titik ke bidang, dan sudut antara dua bidang.',
      },
      lessons: [
        {
          id: 'vek-m5-s2-l1',
          title: { en: 'The Equation of a Plane', id: 'Persamaan Bidang' },
          goal: {
            en: 'Write down a plane given a point on it and a vector perpendicular to it.',
            id: 'Menuliskan persamaan bidang bila diberikan sebuah titik padanya dan sebuah vektor yang tegak lurus terhadapnya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A point and a normal', id: 'Sebuah titik dan sebuah normal' },
              body: {
                en: 'A line needed a direction to run **along**. A plane instead needs a direction to stand **perpendicular** to — a **normal vector** $\\vec{n}$.\n\nLet $P_0$ be a known point of the plane. A point $P$ lies on the plane exactly when $\\vec{P_0P}$ lies flat in it, which is to say perpendicular to $\\vec{n}$:\n$$\\vec{n} \\cdot (\\vec{r} - \\vec{r_0}) = 0$$\nThat is the whole definition, and it is Module 3 doing the work: a plane is the set of points whose displacement from $P_0$ dots to zero with $\\vec{n}$.',
                id: 'Sebuah garis memerlukan arah untuk **diikuti**. Sebuah bidang justru memerlukan arah untuk **ditegaklurusi** — sebuah **vektor normal** $\\vec{n}$.\n\nMisalkan $P_0$ titik yang diketahui pada bidang itu. Sebuah titik $P$ terletak pada bidang tepat ketika $\\vec{P_0P}$ terbaring rata di dalamnya, yang berarti tegak lurus terhadap $\\vec{n}$:\n$$\\vec{n} \\cdot (\\vec{r} - \\vec{r_0}) = 0$$\nItulah seluruh definisinya, dan Modul 3 yang mengerjakannya: bidang adalah himpunan titik yang perpindahannya dari $P_0$ menghasilkan nol ketika dititikkan dengan $\\vec{n}$.',
              },
              figure: {
                dim: 3,
                range: 5,
                interactive: true,
                view: [42, 20],
                height: 340,
                items: [
                  // A patch of the plane 2x + y + 2z = 6 around P0 = (1, 2, 1).
                  // Its four corners are P0 plus and minus two directions that
                  // dot to zero with n = (2, 1, 2), so all four lie in it.
                  {
                    t: 'poly',
                    pts: [
                      [2.25, 5, -1.75],
                      [3.75, -1, -0.25],
                      [-0.25, -1, 3.75],
                      [-1.75, 5, 2.25],
                    ],
                    color: 'result',
                  },
                  { t: 'point', at: [1, 2, 1], label: 'P₀' },
                  { t: 'vec', from: [1, 2, 1], to: [3, 3, 3], label: 'n', color: 'b' },
                  { t: 'vec', from: [1, 2, 1], to: [3, 2, -1], color: 'a' },
                  { t: 'vec', from: [1, 2, 1], to: [0.25, 5, 0.25], color: 'a' },
                  { t: 'right', at: [1, 2, 1], from: [3, 3, 3], to: [3, 2, -1] },
                ],
                readouts: [{ label: 'n·(P - P₀) =', n: { dot: [[2, 1, 2], [2, 0, -2]] }, dp: 0 }],
                caption: {
                  en: 'The normal $\\vec{n}$ leaves $P_0$ at a right angle to everything lying in the plane. The two dark arrows are displacements inside it, and each one dots to zero with $\\vec{n}$ — that single condition is the whole equation.',
                  id: 'Normal $\\vec{n}$ meninggalkan $P_0$ tegak lurus terhadap segala yang terbaring di bidang itu. Dua anak panah gelap adalah perpindahan di dalamnya, dan masing-masing memberi nol bila dititikkan dengan $\\vec{n}$ — satu syarat itulah seluruh persamaannya.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The form you will actually write', id: 'Bentuk yang benar-benar akan kamu tulis' },
              body: {
                en: 'Expand that dot product with $\\vec{n} = (a, b, c)$ and $\\vec{r_0} = (x_0, y_0, z_0)$:\n$$a(x - x_0) + b(y - y_0) + c(z - z_0) = 0$$\nand collect the constants on the right:\n$$ax + by + cz = d, \\qquad d = ax_0 + by_0 + cz_0$$\nThe payoff is worth stating on its own: **the coefficients of $x$, $y$ and $z$ are the components of the normal vector**. Given $3x - y + 4z = 12$ you can read off $\\vec{n} = (3, -1, 4)$ without doing anything at all.\n\nAnd if a plane is given by three points instead, the normal is the cross product of two vectors in it: $\\vec{n} = \\vec{AB} \\times \\vec{AC}$.',
                id: 'Jabarkan perkalian titik itu dengan $\\vec{n} = (a, b, c)$ dan $\\vec{r_0} = (x_0, y_0, z_0)$:\n$$a(x - x_0) + b(y - y_0) + c(z - z_0) = 0$$\nlalu kumpulkan konstantanya di ruas kanan:\n$$ax + by + cz = d, \\qquad d = ax_0 + by_0 + cz_0$$\nHasilnya layak disebut tersendiri: **koefisien $x$, $y$, dan $z$ adalah komponen vektor normalnya**. Diberikan $3x - y + 4z = 12$, kamu dapat langsung membaca $\\vec{n} = (3, -1, 4)$ tanpa mengerjakan apa pun.\n\nDan bila bidangnya diberikan lewat tiga titik, normalnya adalah perkalian silang dua vektor di dalamnya: $\\vec{n} = \\vec{AB} \\times \\vec{AC}$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is a normal vector to the plane $2x - 3y + z = 7$?',
                id: 'Manakah vektor normal bidang $2x - 3y + z = 7$?',
              },
              options: [
                { en: '$(2, -3, 1)$', id: '$(2, -3, 1)$' },
                { en: '$(2, -3, 7)$', id: '$(2, -3, 7)$' },
                { en: '$(7, 7, 7)$', id: '$(7, 7, 7)$' },
                { en: '$(2, 3, 1)$', id: '$(2, 3, 1)$' },
              ],
              answer: 0,
              explain: {
                en: 'The coefficients are the normal, signs included; the constant 7 has nothing to do with the direction — it only slides the plane along that normal.',
                id: 'Koefisiennya adalah normalnya, lengkap dengan tandanya; konstanta 7 tak berhubungan dengan arahnya — ia hanya menggeser bidangnya sepanjang normal itu.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the constant for the plane through $P(2, -1, 3)$ with normal $\\vec{n} = (4, 2, -5)$.',
                id: 'Lengkapi konstanta bidang melalui $P(2, -1, 3)$ dengan normal $\\vec{n} = (4, 2, -5)$.',
              },
              template: 'd = (4)(2) + (2)(-1) + (-5)(3) = 8 - 2 - 15 = ___',
              blanks: ['-9'],
              explain: {
                en: '$8 - 2 - 15 = -9$, so the plane is $4x + 2y - 5z = -9$. A negative constant is nothing unusual — it just means the plane passes on the far side of the origin.',
                id: '$8 - 2 - 15 = -9$, jadi bidangnya adalah $4x + 2y - 5z = -9$. Konstanta negatif bukan hal aneh — ia hanya berarti bidangnya melewati sisi seberang titik asal.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the equation $ax + by + cz = d$ of the plane through $P(1, 4, -2)$ with normal $\\vec{n} = (3, -1, 2)$.',
                id: 'Tentukan persamaan $ax + by + cz = d$ bidang melalui $P(1, 4, -2)$ dengan normal $\\vec{n} = (3, -1, 2)$.',
              },
              blanks: [
                { label: 'a =', answer: 3 },
                { label: 'b =', answer: -1 },
                { label: 'c =', answer: 2 },
                { label: 'd =', answer: -5 },
              ],
              hints: [
                { en: 'The first three need no work at all — they are the normal.', id: 'Tiga yang pertama sama sekali tak butuh kerja — itulah normalnya.' },
                { en: '$d = (3)(1) + (-1)(4) + (2)(-2)$.', id: '$d = (3)(1) + (-1)(4) + (2)(-2)$.' },
              ],
              solution: [
                '3x - y + 2z = d',
                'd = 3 - 4 - 4 = -5',
                '3x - y + 2z = -5',
              ],
              explain: {
                en: '$3 - 4 - 4 = -5$, so the plane is $3x - y + 2z = -5$. Substituting $P$ back in is the check, and it costs one line.',
                id: '$3 - 4 - 4 = -5$, jadi bidangnya $3x - y + 2z = -5$. Menyubstitusikan $P$ kembali adalah pemeriksaannya, dan itu hanya memakan satu baris.',
              },
            },
          ],
        },
        {
          id: 'vek-m5-s2-l2',
          title: { en: 'Distance and Angle', id: 'Jarak dan Sudut' },
          goal: {
            en: 'Find the distance from a point to a plane, and the angle between two planes.',
            id: 'Menentukan jarak titik ke bidang, dan sudut antara dua bidang.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Distance is a projection onto the normal', id: 'Jarak adalah proyeksi pada normalnya' },
              body: {
                en: 'The distance from a point $P_1(x_1, y_1, z_1)$ to the plane $ax + by + cz = d$ is\n$$D = \\frac{|ax_1 + by_1 + cz_1 - d|}{\\sqrt{a^2 + b^2 + c^2}}$$\nIt is Module 3 again: take any point $P_0$ on the plane and project $\\vec{P_0P_1}$ onto $\\vec{n}$. The numerator is that dot product with the constants collected, and the denominator is $|\\vec{n}|$.\n\nThe bars make $D$ non-negative, and $D = 0$ means the point is on the plane.',
                id: 'Jarak dari titik $P_1(x_1, y_1, z_1)$ ke bidang $ax + by + cz = d$ adalah\n$$D = \\frac{|ax_1 + by_1 + cz_1 - d|}{\\sqrt{a^2 + b^2 + c^2}}$$\nIni Modul 3 lagi: ambil sebarang titik $P_0$ pada bidang lalu proyeksikan $\\vec{P_0P_1}$ pada $\\vec{n}$. Pembilangnya adalah perkalian titik itu dengan konstantanya sudah dikumpulkan, dan penyebutnya adalah $|\\vec{n}|$.\n\nGaris mutlaknya membuat $D$ tak negatif, dan $D = 0$ berarti titiknya berada pada bidang itu.',
              },
              figure: {
                dim: 3,
                range: 5,
                interactive: true,
                view: [46, 16],
                height: 340,
                items: [
                  // The worked example of this lesson: the plane 2x - y + 2z = 1
                  // and the point (1, 2, 3), which is 5/3 away from it.
                  {
                    t: 'poly',
                    pts: [
                      [3.75, 4, -1.25],
                      [2.25, -2, -2.75],
                      [-1.75, -2, 1.25],
                      [-0.25, 4, 2.75],
                    ],
                    color: 'result',
                  },
                  { t: 'point', at: [1, 2, 3], label: 'P₁', color: 'b' },
                  // The foot of the perpendicular, P1 - (5/9)n.
                  { t: 'point', at: [-0.111, 2.556, 1.889] },
                  { t: 'seg', from: [1, 2, 3], to: [-0.111, 2.556, 1.889], color: 'b', label: 'D' },
                  { t: 'right', at: [-0.111, 2.556, 1.889], from: [1, 2, 3], to: [3.75, 4, -1.25] },
                  { t: 'vec', from: [-0.111, 2.556, 1.889], to: [1.889, 1.556, 3.889], label: 'n', color: 'a', dashed: true },
                ],
                readouts: [{ label: 'D =', n: { norm: [1.111, -0.556, 1.111] } }],
                caption: {
                  en: 'The distance is measured along the normal, not along any convenient axis. Turn the scene until you are looking edge-on at the plane and the dashed drop becomes a single upright line.',
                  id: 'Jaraknya diukur sepanjang normal, bukan sepanjang sumbu mana pun yang kebetulan mudah. Putar gambarnya sampai bidangnya terlihat dari sisi tipisnya, dan garis turun putus-putus itu menjadi satu garis tegak.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Two planes meet at the angle of their normals', id: 'Dua bidang berpotongan dengan sudut normalnya' },
              body: {
                en: 'The angle between two planes is the angle between their normal vectors:\n$$\\cos\\theta = \\frac{|\\vec{n_1} \\cdot \\vec{n_2}|}{|\\vec{n_1}|\\,|\\vec{n_2}|}$$\nThe bars in the numerator are a convention: two planes make two supplementary angles where they cross, and taking the absolute value reports the acute one.\n\nTwo useful special cases fall straight out. The planes are **parallel** when their normals are parallel, and **perpendicular** when $\\vec{n_1} \\cdot \\vec{n_2} = 0$.',
                id: 'Sudut antara dua bidang adalah sudut antara vektor normalnya:\n$$\\cos\\theta = \\frac{|\\vec{n_1} \\cdot \\vec{n_2}|}{|\\vec{n_1}|\\,|\\vec{n_2}|}$$\nGaris mutlak pada pembilangnya adalah kesepakatan: dua bidang membentuk dua sudut yang saling berpelurus di tempat perpotongannya, dan mengambil nilai mutlaknya melaporkan yang lancip.\n\nDua kasus khusus yang berguna langsung mengikuti. Kedua bidang **sejajar** bila normalnya sejajar, dan **tegak lurus** bila $\\vec{n_1} \\cdot \\vec{n_2} = 0$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Are the planes $2x - y + 3z = 5$ and $-4x + 2y - 6z = 1$ parallel, perpendicular, or neither?',
                id: 'Apakah bidang $2x - y + 3z = 5$ dan $-4x + 2y - 6z = 1$ sejajar, tegak lurus, atau bukan keduanya?',
              },
              options: [
                { en: 'Parallel', id: 'Sejajar' },
                { en: 'Perpendicular', id: 'Tegak lurus' },
                { en: 'Neither', id: 'Bukan keduanya' },
                { en: 'They are the same plane', id: 'Keduanya bidang yang sama' },
              ],
              answer: 0,
              explain: {
                en: '$\\vec{n_2} = (-4, 2, -6) = -2(2, -1, 3) = -2\\vec{n_1}$, so the normals are parallel and so are the planes. They are not the same plane: the constants do not scale by $-2$, since $-2 \\cdot 5 = -10 \\neq 1$.',
                id: '$\\vec{n_2} = (-4, 2, -6) = -2(2, -1, 3) = -2\\vec{n_1}$, jadi normalnya sejajar dan bidangnya pun sejajar. Keduanya bukan bidang yang sama: konstantanya tidak berskala $-2$, sebab $-2 \\cdot 5 = -10 \\neq 1$.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the working for the distance from $(1, 2, 3)$ to the plane $2x - y + 2z = 1$.',
                id: 'Susun langkah penyelesaian jarak dari $(1, 2, 3)$ ke bidang $2x - y + 2z = 1$.',
              },
              lines: [
                '\\vec{n} = (2, -1, 2), \\qquad |\\vec{n}| = \\sqrt{4 + 1 + 4} = 3',
                '2(1) - (2) + 2(3) = 2 - 2 + 6 = 6',
                'D = \\frac{|6 - 1|}{3}',
                'D = \\tfrac{5}{3} \\approx 1{,}67',
              ],
              explain: {
                en: 'Read the normal off the coefficients, substitute the point into the left-hand side, subtract the constant, divide by $|\\vec{n}|$. Forgetting to subtract $d$ is the usual slip.',
                id: 'Baca normalnya dari koefisiennya, substitusikan titiknya ke ruas kiri, kurangi konstantanya, lalu bagi dengan $|\\vec{n}|$. Lupa mengurangi $d$ adalah kekeliruan yang lazim.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the distance from $(1, 2, 3)$ to the plane $2x - y + 2z = 1$.',
                id: 'Tentukan jarak dari $(1, 2, 3)$ ke bidang $2x - y + 2z = 1$.',
              },
              blanks: [{ label: 'D =', answer: 5 / 3 }],
              hints: [
                { en: '$|\\vec{n}| = 3$, and the point gives $2 - 2 + 6 = 6$ on the left.', id: '$|\\vec{n}| = 3$, dan titiknya memberi $2 - 2 + 6 = 6$ di ruas kiri.' },
              ],
              explain: {
                en: '$D = |6 - 1| / 3 = 5/3 \\approx 1.67$. Had the point been on the plane, the numerator would have been 0.',
                id: '$D = |6 - 1| / 3 = 5/3 \\approx 1{,}67$. Seandainya titiknya berada pada bidang itu, pembilangnya akan bernilai 0.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'vek-m5-s2-p',
        runtime: 'math',
        title: { en: 'Planes in Space', id: 'Bidang di Ruang' },
        brief: {
          en: 'The whole course in three parts: a plane through three points, a distance, and an angle.',
          id: 'Seluruh kursus dalam tiga butir: bidang melalui tiga titik, sebuah jarak, dan sebuah sudut.',
        },
        requirements: [
          { en: 'For part 1, use exactly the normal $\\vec{AB} \\times \\vec{AC}$ — any multiple of it describes the same plane, but only one set of numbers is being marked.', id: 'Untuk butir 1, pakai tepat normal $\\vec{AB} \\times \\vec{AC}$ — kelipatan mana pun menyatakan bidang yang sama, tetapi hanya satu himpunan bilangan yang diperiksa di sini.' },
          { en: 'Give the angle in degrees, rounded to two decimal places.', id: 'Nyatakan sudutnya dalam derajat, dibulatkan sampai dua desimal.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Find $ax + by + cz = d$ for the plane through $A(1, 0, 2)$, $B(3, 1, 2)$ and $C(2, -1, 4)$, taking $\\vec{n} = \\vec{AB} \\times \\vec{AC}$.',
              id: 'Tentukan $ax + by + cz = d$ untuk bidang melalui $A(1, 0, 2)$, $B(3, 1, 2)$, dan $C(2, -1, 4)$, dengan $\\vec{n} = \\vec{AB} \\times \\vec{AC}$.',
            },
            blanks: [
              { label: 'a =', answer: 2 },
              { label: 'b =', answer: -4 },
              { label: 'c =', answer: -3 },
              { label: 'd =', answer: -4 },
            ],
            solution: [
              '\\vec{AB} = (2, 1, 0), \\qquad \\vec{AC} = (1, -1, 2)',
              '\\vec{n} = \\vec{AB} \\times \\vec{AC} = (2 - 0,\\ 0 - 4,\\ -2 - 1) = (2,\\ -4,\\ -3)',
              'd = 2(1) - 4(0) - 3(2) = -4',
              '2x - 4y - 3z = -4',
            ],
          },
          {
            prompt: {
              en: 'Find the distance from $(4, -1, 2)$ to the plane $x + 2y - 2z = 5$.',
              id: 'Tentukan jarak dari $(4, -1, 2)$ ke bidang $x + 2y - 2z = 5$.',
            },
            blanks: [{ label: 'D =', answer: 7 / 3 }],
            solution: [
              '|\\vec{n}| = \\sqrt{1 + 4 + 4} = 3',
              '4 + 2(-1) - 2(2) = 4 - 2 - 4 = -2',
              'D = \\frac{|-2 - 5|}{3} = \\tfrac{7}{3} \\approx 2{,}33',
            ],
          },
          {
            prompt: {
              en: 'Find the acute angle between the planes $2x - y + 2z = 3$ and $x + 2y + 2z = 1$.',
              id: 'Tentukan sudut lancip antara bidang $2x - y + 2z = 3$ dan $x + 2y + 2z = 1$.',
            },
            blanks: [
              { label: '\\cos\\theta =', answer: 4 / 9 },
              { label: '\\theta =', answer: 63.61, tol: 0.06, after: '^\\circ' },
            ],
            solution: [
              '\\vec{n_1} = (2, -1, 2), \\qquad \\vec{n_2} = (1, 2, 2)',
              '\\vec{n_1} \\cdot \\vec{n_2} = 2 - 2 + 4 = 4',
              '|\\vec{n_1}| = |\\vec{n_2}| = 3',
              '\\cos\\theta = \\tfrac{4}{9} \\approx 0{,}4444 \\Rightarrow \\theta \\approx 63{,}61^\\circ',
            ],
          },
        ],
        hints: [
          {
            en: 'Part 1 is Module 4 followed by Module 5: cross two edge vectors to get the normal, then substitute one of the points to get $d$.',
            id: 'Butir 1 adalah Modul 4 disusul Modul 5: silangkan dua vektor sisinya untuk memperoleh normal, lalu substitusikan salah satu titiknya untuk memperoleh $d$.',
          },
          {
            en: 'In part 2 the left-hand side comes out negative. That is fine — the absolute value is taken after subtracting $d$, not before.',
            id: 'Pada butir 2 ruas kirinya keluar negatif. Itu tidak masalah — nilai mutlaknya diambil setelah dikurangi $d$, bukan sebelumnya.',
          },
        ],
        xp: 50,
      },
    },
  ],
}
