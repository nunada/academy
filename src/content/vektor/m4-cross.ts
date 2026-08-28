import type { Module } from '../types'

/** Module 4 — the cross product, and the two measurements it exists to make.
 *  Unlike the dot product this one lives only in R³, and the determinant
 *  layout is the only reliable way most people remember the components. */
export const module4: Module = {
  id: 'vek-m4',
  title: { en: 'The Cross Product', id: 'Perkalian Silang' },
  summary: {
    en: 'Multiply two vectors in space into a third one perpendicular to both, then use its length to measure area and volume.',
    id: 'Mengalikan dua vektor di ruang menjadi vektor ketiga yang tegak lurus keduanya, lalu memakai panjangnya untuk mengukur luas dan volume.',
  },
  submodules: [
    /* --------------------------------------------------- 4.1 definition & properties */
    {
      id: 'vek-m4-s1',
      title: { en: 'Definition and Properties', id: 'Definisi dan Sifat' },
      summary: {
        en: 'Compute a cross product from a determinant, and know what makes it different from a dot product.',
        id: 'Menghitung perkalian silang dari determinan, dan mengetahui apa yang membedakannya dari perkalian titik.',
      },
      lessons: [
        {
          id: 'vek-m4-s1-l1',
          title: { en: 'Computing a Cross Product', id: 'Menghitung Perkalian Silang' },
          goal: {
            en: 'Expand the $3 \\times 3$ determinant that gives $\\vec{a} \\times \\vec{b}$.',
            id: 'Menjabarkan determinan $3 \\times 3$ yang memberikan $\\vec{a} \\times \\vec{b}$.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A determinant with vectors on top', id: 'Determinan dengan vektor di baris atas' },
              body: {
                en: 'For two vectors in $R^3$, the **cross product** is written as a determinant:\n$$\\vec{a} \\times \\vec{b} = \\begin{vmatrix} \\hat{i} & \\hat{j} & \\hat{k} \\\\ a_1 & a_2 & a_3 \\\\ b_1 & b_2 & b_3 \\end{vmatrix}$$\nExpanding along the top row gives the components:\n$$\\vec{a} \\times \\vec{b} = (a_2b_3 - a_3b_2,\\ a_3b_1 - a_1b_3,\\ a_1b_2 - a_2b_1)$$\nThe answer is a **vector**, which is the first difference from the dot product. The second: the cross product exists only in three dimensions.',
                id: 'Untuk dua vektor di $R^3$, **perkalian silang** dituliskan sebagai determinan:\n$$\\vec{a} \\times \\vec{b} = \\begin{vmatrix} \\hat{i} & \\hat{j} & \\hat{k} \\\\ a_1 & a_2 & a_3 \\\\ b_1 & b_2 & b_3 \\end{vmatrix}$$\nMenjabarkannya sepanjang baris pertama memberi komponennya:\n$$\\vec{a} \\times \\vec{b} = (a_2b_3 - a_3b_2,\\ a_3b_1 - a_1b_3,\\ a_1b_2 - a_2b_1)$$\nHasilnya berupa **vektor**, dan itulah beda pertamanya dari perkalian titik. Beda kedua: perkalian silang hanya ada di tiga dimensi.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Cover up a column', id: 'Tutup satu kolom' },
              body: {
                en: 'You do not have to memorise those six products. For the $\\hat{i}$ component, cover the $\\hat{i}$ column and take the $2 \\times 2$ determinant that is left:\n$$\\begin{vmatrix} a_2 & a_3 \\\\ b_2 & b_3 \\end{vmatrix} = a_2b_3 - a_3b_2$$\nDo the same for $\\hat{j}$ and $\\hat{k}$ — but the middle one carries a **minus sign** in front of it. Written out:\n$$\\vec{a} \\times \\vec{b} = \\begin{vmatrix} a_2 & a_3 \\\\ b_2 & b_3 \\end{vmatrix}\\hat{i} - \\begin{vmatrix} a_1 & a_3 \\\\ b_1 & b_3 \\end{vmatrix}\\hat{j} + \\begin{vmatrix} a_1 & a_2 \\\\ b_1 & b_2 \\end{vmatrix}\\hat{k}$$\nThat middle minus is where nearly every wrong answer comes from.',
                id: 'Kamu tak perlu menghafal keenam hasil kali itu. Untuk komponen $\\hat{i}$, tutup kolom $\\hat{i}$ lalu ambil determinan $2 \\times 2$ yang tersisa:\n$$\\begin{vmatrix} a_2 & a_3 \\\\ b_2 & b_3 \\end{vmatrix} = a_2b_3 - a_3b_2$$\nLakukan hal yang sama untuk $\\hat{j}$ dan $\\hat{k}$ — hanya saja yang tengah membawa **tanda minus** di depannya. Ditulis lengkap:\n$$\\vec{a} \\times \\vec{b} = \\begin{vmatrix} a_2 & a_3 \\\\ b_2 & b_3 \\end{vmatrix}\\hat{i} - \\begin{vmatrix} a_1 & a_3 \\\\ b_1 & b_3 \\end{vmatrix}\\hat{j} + \\begin{vmatrix} a_1 & a_2 \\\\ b_1 & b_2 \\end{vmatrix}\\hat{k}$$\nMinus di tengah itulah sumber hampir semua jawaban yang keliru.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What kind of object is $\\vec{a} \\times \\vec{b}$, and where does it live?',
                id: 'Objek jenis apakah $\\vec{a} \\times \\vec{b}$, dan di mana ia berlaku?',
              },
              options: [
                { en: 'A scalar, in any dimension', id: 'Skalar, di dimensi mana pun' },
                { en: 'A vector, in $R^3$ only', id: 'Vektor, hanya di $R^3$' },
                { en: 'A vector, in any dimension', id: 'Vektor, di dimensi mana pun' },
                { en: 'A scalar, in $R^3$ only', id: 'Skalar, hanya di $R^3$' },
              ],
              answer: 1,
              explain: {
                en: 'The determinant has three columns and produces three components, so both the input and the output are three-dimensional. In the plane there is no direction left over to point in.',
                id: 'Determinannya berkolom tiga dan menghasilkan tiga komponen, jadi masukan dan keluarannya sama-sama berdimensi tiga. Di bidang tak tersisa arah untuk ditunjuk.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete $\\vec{a} \\times \\vec{b}$ for $\\vec{a} = (1, 2, 3)$ and $\\vec{b} = (4, 5, 6)$.',
                id: 'Lengkapi $\\vec{a} \\times \\vec{b}$ untuk $\\vec{a} = (1, 2, 3)$ dan $\\vec{b} = (4, 5, 6)$.',
              },
              template:
                '\\vec{a} \\times \\vec{b} = (2 \\cdot 6 - 3 \\cdot 5,\\ 3 \\cdot 4 - 1 \\cdot 6,\\ 1 \\cdot 5 - 2 \\cdot 4) = (___,\\ ___,\\ ___)',
              blanks: ['-3', '6', '-3'],
              explain: {
                en: '$12 - 15 = -3$, $12 - 6 = 6$, $5 - 8 = -3$. Notice the middle slot is written $a_3b_1 - a_1b_3$, which already has the minus sign folded into it.',
                id: '$12 - 15 = -3$, $12 - 6 = 6$, $5 - 8 = -3$. Perhatikan slot tengahnya ditulis $a_3b_1 - a_1b_3$, yang tanda minusnya sudah terlipat di dalamnya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              inline: true,
              prompt: {
                en: 'Find $\\vec{a} \\times \\vec{b}$ for $\\vec{a} = (2, 0, -1)$ and $\\vec{b} = (1, 3, 0)$.',
                id: 'Tentukan $\\vec{a} \\times \\vec{b}$ untuk $\\vec{a} = (2, 0, -1)$ dan $\\vec{b} = (1, 3, 0)$.',
              },
              blanks: [{ answer: 3 }, { answer: -1 }, { answer: 6 }],
              hints: [
                { en: 'First slot: $a_2b_3 - a_3b_2 = (0)(0) - (-1)(3)$.', id: 'Slot pertama: $a_2b_3 - a_3b_2 = (0)(0) - (-1)(3)$.' },
                { en: 'Middle slot: $a_3b_1 - a_1b_3 = (-1)(1) - (2)(0)$.', id: 'Slot tengah: $a_3b_1 - a_1b_3 = (-1)(1) - (2)(0)$.' },
              ],
              solution: [
                '\\vec{a} \\times \\vec{b} = ((0)(0) - (-1)(3),\\ (-1)(1) - (2)(0),\\ (2)(3) - (0)(1))',
                '\\vec{a} \\times \\vec{b} = (3,\\ -1,\\ 6)',
              ],
              explain: {
                en: 'Check it against $\\vec{a}$: $(2)(3) + (0)(-1) + (-1)(6) = 0$. A cross product that is not perpendicular to both inputs is a cross product with an arithmetic slip in it — this is the check to run every time.',
                id: 'Periksa terhadap $\\vec{a}$: $(2)(3) + (0)(-1) + (-1)(6) = 0$. Perkalian silang yang tidak tegak lurus terhadap kedua vektor asalnya berarti ada salah hitung di dalamnya — inilah pemeriksaan yang layak dijalankan setiap kali.',
              },
            },
          ],
        },
        {
          id: 'vek-m4-s1-l2',
          title: { en: 'What the Cross Product Is For', id: 'Untuk Apa Perkalian Silang' },
          goal: {
            en: 'Use its direction, its anticommutativity, and $|\\vec{a} \\times \\vec{b}| = |\\vec{a}||\\vec{b}|\\sin\\theta$.',
            id: 'Memakai arahnya, sifat antikomutatifnya, dan $|\\vec{a} \\times \\vec{b}| = |\\vec{a}||\\vec{b}|\\sin\\theta$.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Perpendicular to both, and order matters', id: 'Tegak lurus keduanya, dan urutannya berpengaruh' },
              body: {
                en: 'Two facts define $\\vec{a} \\times \\vec{b}$ as much as the formula does.\n\nFirst, it is **perpendicular to both** $\\vec{a}$ and $\\vec{b}$: $\\vec{a} \\cdot (\\vec{a} \\times \\vec{b}) = 0$ and $\\vec{b} \\cdot (\\vec{a} \\times \\vec{b}) = 0$, always. Which of the two perpendicular directions it takes is settled by the **right-hand rule**: curl the fingers of your right hand from $\\vec{a}$ towards $\\vec{b}$, and your thumb points along $\\vec{a} \\times \\vec{b}$.\n\nSecond, it is **anticommutative**:\n$$\\vec{b} \\times \\vec{a} = -(\\vec{a} \\times \\vec{b})$$\nSwapping two rows of a determinant flips its sign. So unlike the dot product, the order here is not optional.',
                id: 'Dua kenyataan mendefinisikan $\\vec{a} \\times \\vec{b}$ sama kuatnya dengan rumusnya.\n\nPertama, ia **tegak lurus terhadap keduanya**, $\\vec{a}$ maupun $\\vec{b}$: $\\vec{a} \\cdot (\\vec{a} \\times \\vec{b}) = 0$ dan $\\vec{b} \\cdot (\\vec{a} \\times \\vec{b}) = 0$, selalu. Yang menentukan ke arah mana dari dua arah tegak lurus itu adalah **kaidah tangan kanan**: lengkungkan jari tangan kananmu dari $\\vec{a}$ menuju $\\vec{b}$, dan ibu jarimu menunjuk arah $\\vec{a} \\times \\vec{b}$.\n\nKedua, ia **antikomutatif**:\n$$\\vec{b} \\times \\vec{a} = -(\\vec{a} \\times \\vec{b})$$\nMenukar dua baris determinan membalik tandanya. Jadi berbeda dari perkalian titik, urutan di sini bukan hal yang bebas.',
              },
              figure: {
                dim: 3,
                range: 4,
                interactive: true,
                view: [30, 24],
                items: [
                  { t: 'poly', pts: [[0, 0, 0], [3, 0, 0], [3, 3, 0], [0, 3, 0]], color: 'muted' },
                  { t: 'vec', to: [3, 0, 0], label: 'a', color: 'a' },
                  { t: 'vec', to: [0, 3, 0], label: 'b', color: 'b' },
                  { t: 'vec', to: { cross: [[3, 0, 0], [0, 3, 0]] }, label: 'a × b', color: 'result' },
                  { t: 'vec', to: { cross: [[0, 3, 0], [3, 0, 0]] }, label: 'b × a', color: 'c', dashed: true },
                  { t: 'right', from: [3, 0, 0], to: { cross: [[3, 0, 0], [0, 3, 0]] } },
                ],
                readouts: [
                  { label: 'a × b =', v: { cross: [[3, 0, 0], [0, 3, 0]] }, dp: 0 },
                  { label: 'b × a =', v: { cross: [[0, 3, 0], [3, 0, 0]] }, dp: 0 },
                ],
                caption: {
                  en: 'Turn the scene until you are looking along the shaded plane. Both products stand at right angles to it; swapping the order sends the arrow out of the other face. Curl your right hand from $\\vec{a}$ to $\\vec{b}$ and your thumb picks the green one.',
                  id: 'Putar gambarnya sampai kamu memandang menyusuri bidang yang diarsir. Kedua hasilnya berdiri tegak lurus terhadapnya; menukar urutannya mengirim anak panah keluar lewat sisi yang lain. Lengkungkan tangan kananmu dari $\\vec{a}$ ke $\\vec{b}$ dan ibu jarimu memilih yang hijau.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Its length is a sine', id: 'Panjangnya adalah sebuah sinus' },
              body: {
                en: 'Where the dot product carries a cosine, the cross product carries a sine:\n$$|\\vec{a} \\times \\vec{b}| = |\\vec{a}|\\,|\\vec{b}|\\sin\\theta$$\nwith $0° \\leq \\theta \\leq 180°$, so the sine — and hence the length — is never negative.\n\nThe consequence is the mirror image of the one for the dot product: the cross product vanishes when the vectors are **parallel** ($\\sin 0° = 0$), and is largest when they are perpendicular. In particular $\\vec{a} \\times \\vec{a} = \\vec{0}$ for every $\\vec{a}$.\n\nSo the two products answer opposite questions. $\\vec{a} \\cdot \\vec{b} = 0$ means perpendicular; $\\vec{a} \\times \\vec{b} = \\vec{0}$ means parallel.',
                id: 'Bila perkalian titik membawa cosinus, perkalian silang membawa sinus:\n$$|\\vec{a} \\times \\vec{b}| = |\\vec{a}|\\,|\\vec{b}|\\sin\\theta$$\ndengan $0° \\leq \\theta \\leq 180°$, sehingga sinusnya — dan karenanya panjangnya — tak pernah negatif.\n\nAkibatnya merupakan bayangan cermin dari perkalian titik: perkalian silang lenyap ketika kedua vektor **sejajar** ($\\sin 0° = 0$), dan terbesar ketika keduanya tegak lurus. Khususnya $\\vec{a} \\times \\vec{a} = \\vec{0}$ untuk setiap $\\vec{a}$.\n\nJadi kedua perkalian itu menjawab pertanyaan yang berlawanan. $\\vec{a} \\cdot \\vec{b} = 0$ berarti tegak lurus; $\\vec{a} \\times \\vec{b} = \\vec{0}$ berarti sejajar.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Two non-zero vectors satisfy $\\vec{u} \\times \\vec{v} = \\vec{0}$. What follows?',
                id: 'Dua vektor tak nol memenuhi $\\vec{u} \\times \\vec{v} = \\vec{0}$. Apa yang dapat disimpulkan?',
              },
              options: [
                { en: 'They are perpendicular.', id: 'Keduanya tegak lurus.' },
                { en: 'They are parallel.', id: 'Keduanya sejajar.' },
                { en: 'They have the same magnitude.', id: 'Besarnya sama.' },
                { en: 'One of them must be $\\vec{0}$ after all.', id: 'Salah satunya ternyata pasti $\\vec{0}$.' },
              ],
              answer: 1,
              explain: {
                en: 'The magnitudes are non-zero, so $\\sin\\theta = 0$, which means $\\theta = 0°$ or $180°$ — the same line either way. A zero **dot** product is the one that means perpendicular.',
                id: 'Besar kedua vektornya tak nol, jadi $\\sin\\theta = 0$, yang berarti $\\theta = 0°$ atau $180°$ — sama-sama pada satu garis. Perkalian **titik** yang bernilai nol itulah yang berarti tegak lurus.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the working for $|\\vec{a} \\times \\vec{b}|$ with $\\vec{a} = (2, 0, -1)$ and $\\vec{b} = (1, 3, 0)$.',
                id: 'Susun langkah penyelesaian $|\\vec{a} \\times \\vec{b}|$ dengan $\\vec{a} = (2, 0, -1)$ dan $\\vec{b} = (1, 3, 0)$.',
              },
              lines: [
                '\\vec{a} \\times \\vec{b} = \\begin{vmatrix} \\hat{i} & \\hat{j} & \\hat{k} \\\\ 2 & 0 & -1 \\\\ 1 & 3 & 0 \\end{vmatrix}',
                '\\vec{a} \\times \\vec{b} = (3,\\ -1,\\ 6)',
                '|\\vec{a} \\times \\vec{b}| = \\sqrt{9 + 1 + 36}',
                '|\\vec{a} \\times \\vec{b}| = \\sqrt{46} \\approx 6{,}78',
              ],
              explain: {
                en: 'Set up the determinant, expand it, then take the magnitude of the vector you got. The length comes last — there is no shortcut that skips the components.',
                id: 'Susun determinannya, jabarkan, lalu ambil besar dari vektor yang diperoleh. Panjangnya datang terakhir — tak ada jalan pintas yang melewati komponennya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'With $\\vec{a} = (2, 0, -1)$ and $\\vec{b} = (1, 3, 0)$, whose cross product you found to be $(3, -1, 6)$, fill in both.',
                id: 'Dengan $\\vec{a} = (2, 0, -1)$ dan $\\vec{b} = (1, 3, 0)$, yang perkalian silangnya sudah kamu peroleh $(3, -1, 6)$, isikan keduanya.',
              },
              blanks: [
                { label: '|\\vec{a} \\times \\vec{b}| =', answer: Math.sqrt(46) },
                { label: '\\vec{b} \\times \\vec{a} = (', answer: -3 },
                { label: ',', answer: 1 },
                { label: ',', answer: -6, after: ')' },
              ],
              hints: [
                { en: 'The magnitude is $\\sqrt{3^2 + (-1)^2 + 6^2}$ — `sqrt(46)` is accepted as it stands.', id: 'Besarnya adalah $\\sqrt{3^2 + (-1)^2 + 6^2}$ — `sqrt(46)` diterima apa adanya.' },
                { en: 'The second one needs no new determinant: swapping the order negates every component.', id: 'Yang kedua tak butuh determinan baru: menukar urutannya membalik tanda setiap komponen.' },
              ],
              explain: {
                en: '$\\sqrt{46} \\approx 6.78$, and $\\vec{b} \\times \\vec{a} = -(3, -1, 6) = (-3, 1, -6)$. The two products have the same length and opposite directions.',
                id: '$\\sqrt{46} \\approx 6{,}78$, dan $\\vec{b} \\times \\vec{a} = -(3, -1, 6) = (-3, 1, -6)$. Kedua hasilnya sama panjang dan berlawanan arah.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'vek-m4-s1-p',
        runtime: 'math',
        title: { en: 'Crossing and Perpendicularity', id: 'Menyilangkan dan Ketegaklurusan' },
        brief: {
          en: 'One cross product, one unit vector built from it, and one length found without any components at all.',
          id: 'Satu perkalian silang, satu vektor satuan yang disusun darinya, dan satu panjang yang dicari tanpa komponen sama sekali.',
        },
        requirements: [
          { en: 'Watch the sign of the middle component.', id: 'Perhatikan tanda komponen tengahnya.' },
          { en: 'Check your answer by dotting it with both inputs — both should give 0.', id: 'Periksa jawabanmu dengan menitikkannya pada kedua vektor asal — keduanya harus memberi 0.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Find $(3, -1, 2) \\times (2, 4, -1)$.',
              id: 'Tentukan $(3, -1, 2) \\times (2, 4, -1)$.',
            },
            inline: true,
            blanks: [{ answer: -7 }, { answer: 7 }, { answer: 14 }],
            solution: [
              '\\vec{a} \\times \\vec{b} = ((-1)(-1) - (2)(4),\\ (2)(2) - (3)(-1),\\ (3)(4) - (-1)(2))',
              '\\vec{a} \\times \\vec{b} = (1 - 8,\\ 4 + 3,\\ 12 + 2) = (-7,\\ 7,\\ 14)',
            ],
          },
          {
            prompt: {
              en: 'Find the unit vector perpendicular to both $(3, -1, 2)$ and $(2, 4, -1)$, taking the direction of their cross product.',
              id: 'Tentukan vektor satuan yang tegak lurus terhadap $(3, -1, 2)$ dan $(2, 4, -1)$, dengan mengambil arah perkalian silangnya.',
            },
            inline: true,
            blanks: [
              { answer: -1 / Math.sqrt(6) },
              { answer: 1 / Math.sqrt(6) },
              { answer: 2 / Math.sqrt(6) },
            ],
            solution: [
              '\\vec{a} \\times \\vec{b} = (-7,\\ 7,\\ 14) = 7(-1,\\ 1,\\ 2)',
              '|\\vec{a} \\times \\vec{b}| = 7\\sqrt{6} \\approx 17{,}15',
              '\\hat{n} = \\tfrac{1}{\\sqrt{6}}(-1,\\ 1,\\ 2) \\approx (-0{,}41,\\ 0{,}41,\\ 0{,}82)',
            ],
          },
          {
            prompt: {
              en: 'Two vectors have $|\\vec{a}| = 4$ and $|\\vec{b}| = 5$, with a 30° angle between them. Find $|\\vec{a} \\times \\vec{b}|$.',
              id: 'Dua vektor mempunyai $|\\vec{a}| = 4$ dan $|\\vec{b}| = 5$, dengan sudut 30° di antaranya. Tentukan $|\\vec{a} \\times \\vec{b}|$.',
            },
            blanks: [{ answer: 10 }],
            solution: ['|\\vec{a} \\times \\vec{b}| = (4)(5)\\sin 30^\\circ = 20 \\cdot \\tfrac{1}{2} = 10'],
          },
        ],
        hints: [
          {
            en: 'In part 2, pull the common factor 7 out of the cross product first — normalising $(-1, 1, 2)$ is much less work.',
            id: 'Pada butir 2, keluarkan dulu faktor bersama 7 dari perkalian silangnya — menormalkan $(-1, 1, 2)$ jauh lebih ringan.',
          },
          {
            en: 'Part 3 has no components to work with, so it needs $|\\vec{a}||\\vec{b}|\\sin\\theta$ — the length form, not the determinant.',
            id: 'Butir 3 tak punya komponen untuk dikerjakan, jadi ia memerlukan $|\\vec{a}||\\vec{b}|\\sin\\theta$ — bentuk panjangnya, bukan determinannya.',
          },
        ],
        xp: 50,
      },
    },

    /* ---------------------------------------------------------- 4.2 area & volume */
    {
      id: 'vek-m4-s2',
      title: { en: 'Area and Volume', id: 'Luas dan Volume' },
      summary: {
        en: 'Measure a parallelogram, a triangle, and a box in space using the two products together.',
        id: 'Mengukur jajargenjang, segitiga, dan balok miring di ruang dengan kedua perkalian sekaligus.',
      },
      lessons: [
        {
          id: 'vek-m4-s2-l1',
          title: { en: 'Area of a Parallelogram and a Triangle', id: 'Luas Jajargenjang dan Segitiga' },
          goal: {
            en: 'Find the area of a figure in space from the vectors along its edges.',
            id: 'Menentukan luas bangun di ruang dari vektor-vektor sepanjang sisinya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Base times height, hidden in a sine', id: 'Alas kali tinggi, tersembunyi dalam sinus' },
              body: {
                en: 'Draw $\\vec{a}$ and $\\vec{b}$ from one point and complete the parallelogram. Its base is $|\\vec{a}|$ and its height is $|\\vec{b}|\\sin\\theta$, so its area is $|\\vec{a}||\\vec{b}|\\sin\\theta$ — which is exactly the length of the cross product:\n$$L_{\\text{jajargenjang}} = |\\vec{a} \\times \\vec{b}|$$\nA triangle with those two sides is half of it:\n$$L_{\\text{segitiga}} = \\tfrac{1}{2}|\\vec{a} \\times \\vec{b}|$$\nFor a triangle $ABC$, take the two vectors from the same corner: $\\vec{AB}$ and $\\vec{AC}$.',
                id: 'Gambar $\\vec{a}$ dan $\\vec{b}$ dari satu titik lalu lengkapi jajargenjangnya. Alasnya $|\\vec{a}|$ dan tingginya $|\\vec{b}|\\sin\\theta$, sehingga luasnya $|\\vec{a}||\\vec{b}|\\sin\\theta$ — yang persis sama dengan panjang perkalian silangnya:\n$$L_{\\text{jajargenjang}} = |\\vec{a} \\times \\vec{b}|$$\nSegitiga dengan kedua sisi itu luasnya separuhnya:\n$$L_{\\text{segitiga}} = \\tfrac{1}{2}|\\vec{a} \\times \\vec{b}|$$\nUntuk segitiga $ABC$, ambil dua vektor dari titik sudut yang sama: $\\vec{AB}$ dan $\\vec{AC}$.',
              },
              figure: {
                dim: 2,
                range: 6,
                interactive: true,
                vars: { a: [4, 1], b: [1, 3] },
                items: [
                  { t: 'poly', pts: [[0, 0], { of: 'a' }, { sum: [{ of: 'a' }, { of: 'b' }] }, { of: 'b' }], color: 'result' },
                  { t: 'poly', pts: [[0, 0], { of: 'a' }, { of: 'b' }], color: 'c' },
                  { t: 'seg', from: { of: 'b' }, to: { proj: [{ of: 'b' }, { of: 'a' }] }, dashed: true, label: 't' },
                  { t: 'right', at: { proj: [{ of: 'b' }, { of: 'a' }] }, from: [0, 0], to: { of: 'b' } },
                  { t: 'vec', to: { of: 'a' }, label: 'a', color: 'a', drag: 'a' },
                  { t: 'vec', to: { of: 'b' }, label: 'b', color: 'b', drag: 'b' },
                ],
                readouts: [
                  { label: 'jajargenjang =', n: { area: [{ of: 'a' }, { of: 'b' }] } },
                  { label: 'segitiga =', n: { tri: [{ of: 'a' }, { of: 'b' }] } },
                ],
                caption: {
                  en: 'Base $|\\vec{a}|$, height the dashed drop from the tip of $\\vec{b}$. Slide $\\vec{b}$ along its own direction and the area does not move — same base, same height. Bring the two arrows into line and the area falls to zero.',
                  id: 'Alasnya $|\\vec{a}|$, tingginya garis putus-putus yang turun dari ujung $\\vec{b}$. Geser $\\vec{b}$ menyusuri arahnya sendiri dan luasnya tak berubah — alas sama, tinggi sama. Sejajarkan kedua anak panahnya dan luasnya jatuh ke nol.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'To find the area of triangle $ABC$, which pair of vectors should you cross?',
                id: 'Untuk menentukan luas segitiga $ABC$, pasangan vektor mana yang harus disilangkan?',
              },
              options: [
                { en: '$\\vec{AB}$ and $\\vec{BC}$, then halve', id: '$\\vec{AB}$ dan $\\vec{BC}$, lalu dibagi dua' },
                { en: '$\\vec{AB}$ and $\\vec{AC}$, then halve', id: '$\\vec{AB}$ dan $\\vec{AC}$, lalu dibagi dua' },
                { en: 'The position vectors of $A$ and $B$', id: 'Vektor posisi $A$ dan $B$' },
                { en: '$\\vec{AB}$ and $\\vec{AC}$, without halving', id: '$\\vec{AB}$ dan $\\vec{AC}$, tanpa dibagi dua' },
              ],
              answer: 1,
              explain: {
                en: 'Both vectors must leave the **same** corner, so that they are two sides of the triangle meeting there. (As it happens $\\vec{AB} \\times \\vec{BC}$ gives the same magnitude, but the reasoning behind it is harder to see.) The half is what turns a parallelogram into a triangle.',
                id: 'Kedua vektornya harus berangkat dari titik sudut yang **sama**, agar keduanya menjadi dua sisi segitiga yang bertemu di situ. (Kebetulan $\\vec{AB} \\times \\vec{BC}$ memberi besar yang sama, tetapi alasannya lebih sulit dilihat.) Pembagian dua itulah yang mengubah jajargenjang menjadi segitiga.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the area of the parallelogram with sides $\\vec{u} = (3, 0, 0)$ and $\\vec{v} = (0, 4, 0)$.',
                id: 'Tentukan luas jajargenjang dengan sisi $\\vec{u} = (3, 0, 0)$ dan $\\vec{v} = (0, 4, 0)$.',
              },
              blanks: [{ label: 'L =', answer: 12 }],
              hints: [
                { en: 'The two vectors are perpendicular and lie in the $xy$ plane, so the answer should match the rectangle you can picture.', id: 'Kedua vektornya tegak lurus dan terletak pada bidang $xy$, jadi jawabannya harus cocok dengan persegi panjang yang bisa kamu bayangkan.' },
              ],
              solution: [
                '\\vec{u} \\times \\vec{v} = (0,\\ 0,\\ 12)',
                'L = |(0, 0, 12)| = 12',
              ],
              explain: {
                en: 'The cross product is $(0, 0, 12)$, pointing straight up out of the plane, and its length is 12 — the area of a $3 \\times 4$ rectangle, as it should be.',
                id: 'Perkalian silangnya $(0, 0, 12)$, menunjuk tegak lurus keluar bidang, dan panjangnya 12 — luas persegi panjang $3 \\times 4$, sebagaimana mestinya.',
              },
            },
            {
              kind: 'math',
              id: 'm2',
              prompt: {
                en: 'Find the area of triangle $ABC$ with $A(1, 1, 0)$, $B(3, 2, 1)$ and $C(2, 4, 2)$.',
                id: 'Tentukan luas segitiga $ABC$ dengan $A(1, 1, 0)$, $B(3, 2, 1)$, dan $C(2, 4, 2)$.',
              },
              figure: {
                dim: 3,
                range: 5,
                interactive: true,
                view: [52, 22],
                height: 320,
                items: [
                  { t: 'poly', pts: [[1, 1, 0], [3, 2, 1], [2, 4, 2]], color: 'result' },
                  { t: 'point', at: [1, 1, 0], label: 'A' },
                  { t: 'point', at: [3, 2, 1], label: 'B' },
                  { t: 'point', at: [2, 4, 2], label: 'C' },
                  { t: 'vec', from: [1, 1, 0], to: [3, 2, 1], color: 'a' },
                  { t: 'vec', from: [1, 1, 0], to: [2, 4, 2], color: 'b' },
                ],
                caption: {
                  en: 'The triangle really is tilted in space — turn it and see. That is why its area cannot be read off any one pair of coordinates.',
                  id: 'Segitiganya memang miring di dalam ruang — putar dan lihat sendiri. Itu sebabnya luasnya tak bisa dibaca dari sepasang koordinat mana pun.',
                },
              },
              blanks: [{ label: 'L =', answer: Math.sqrt(35) / 2 }],
              hints: [
                { en: '$\\vec{AB} = (2, 1, 1)$ and $\\vec{AC} = (1, 3, 2)$.', id: '$\\vec{AB} = (2, 1, 1)$ dan $\\vec{AC} = (1, 3, 2)$.' },
                { en: 'Their cross product is $(-1, -3, 5)$. Now take half its length.', id: 'Perkalian silangnya $(-1, -3, 5)$. Sekarang ambil separuh panjangnya.' },
              ],
              solution: [
                '\\vec{AB} = (2, 1, 1), \\qquad \\vec{AC} = (1, 3, 2)',
                '\\vec{AB} \\times \\vec{AC} = (2 - 3,\\ 1 - 4,\\ 6 - 1) = (-1,\\ -3,\\ 5)',
                'L = \\tfrac{1}{2}\\sqrt{1 + 9 + 25} = \\tfrac{1}{2}\\sqrt{35} \\approx 2{,}96',
              ],
              explain: {
                en: '$\\tfrac{1}{2}\\sqrt{35} \\approx 2.96$. Three steps every time: two vectors from one corner, cross, halve the length.',
                id: '$\\tfrac{1}{2}\\sqrt{35} \\approx 2{,}96$. Selalu tiga langkah: dua vektor dari satu titik sudut, silangkan, lalu ambil separuh panjangnya.',
              },
            },
          ],
        },
        {
          id: 'vek-m4-s2-l2',
          title: { en: 'The Triple Product and Volume', id: 'Hasil Kali Tripel dan Volume' },
          goal: {
            en: 'Compute $\\vec{a} \\cdot (\\vec{b} \\times \\vec{c})$ and read a volume — or a coplanarity — from it.',
            id: 'Menghitung $\\vec{a} \\cdot (\\vec{b} \\times \\vec{c})$ dan membaca volume — atau kesebidangan — darinya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A dot product of a cross product', id: 'Perkalian titik dari sebuah perkalian silang' },
              body: {
                en: 'The **scalar triple product** of three vectors is\n$$\\vec{a} \\cdot (\\vec{b} \\times \\vec{c}) = \\begin{vmatrix} a_1 & a_2 & a_3 \\\\ b_1 & b_2 & b_3 \\\\ c_1 & c_2 & c_3 \\end{vmatrix}$$\nThe brackets are not optional in the middle expression, but they are also the only sensible reading: $(\\vec{a} \\cdot \\vec{b}) \\times \\vec{c}$ would be a scalar crossed with a vector, which means nothing. Compute the cross product first, then dot.',
                id: '**Hasil kali tripel skalar** dari tiga vektor adalah\n$$\\vec{a} \\cdot (\\vec{b} \\times \\vec{c}) = \\begin{vmatrix} a_1 & a_2 & a_3 \\\\ b_1 & b_2 & b_3 \\\\ c_1 & c_2 & c_3 \\end{vmatrix}$$\nTanda kurung pada bentuk di tengah tidak boleh dihilangkan, tetapi ia juga satu-satunya pembacaan yang masuk akal: $(\\vec{a} \\cdot \\vec{b}) \\times \\vec{c}$ berarti menyilangkan skalar dengan vektor, dan itu tak bermakna. Hitung perkalian silangnya dahulu, baru titiknya.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'What it measures', id: 'Apa yang diukurnya' },
              body: {
                en: 'Three vectors from one point span a **parallelepiped** — a box whose faces are parallelograms. Its volume is\n$$V = |\\vec{a} \\cdot (\\vec{b} \\times \\vec{c})|$$\nThe reasoning is the previous lesson twice over: $|\\vec{b} \\times \\vec{c}|$ is the area of the base, and dotting with $\\vec{a}$ picks out the height perpendicular to that base.\n\nThe bars matter — the triple product itself can be negative, and its sign records the handedness of the three vectors rather than anything about size.\n\nAnd when the volume is zero the box is flat, so\n$$\\vec{a} \\cdot (\\vec{b} \\times \\vec{c}) = 0 \\iff \\text{the three are coplanar}$$',
                id: 'Tiga vektor dari satu titik membentangkan sebuah **paralelepipedum** — balok miring yang setiap sisinya jajargenjang. Volumenya adalah\n$$V = |\\vec{a} \\cdot (\\vec{b} \\times \\vec{c})|$$\nAlasannya adalah pelajaran sebelumnya yang dipakai dua kali: $|\\vec{b} \\times \\vec{c}|$ adalah luas alasnya, dan menitikkannya dengan $\\vec{a}$ mengambil tinggi yang tegak lurus alas itu.\n\nGaris mutlaknya penting — hasil kali tripelnya sendiri bisa negatif, dan tandanya merekam kekidalan susunan ketiga vektor, bukan sesuatu tentang ukurannya.\n\nDan ketika volumenya nol, baloknya gepeng, sehingga\n$$\\vec{a} \\cdot (\\vec{b} \\times \\vec{c}) = 0 \\iff \\text{ketiganya sebidang (koplanar)}$$',
              },
              figure: {
                dim: 3,
                range: 4,
                interactive: true,
                view: [34, 20],
                height: 340,
                items: [
                  { t: 'box', a: [3, 0.5, 0], b: [0.5, 3, 0], c: [1, 1, 3] },
                  { t: 'poly', pts: [[0, 0, 0], [3, 0.5, 0], [3.5, 3.5, 0], [0.5, 3, 0]], color: 'result' },
                  { t: 'vec', to: [3, 0.5, 0], label: 'b', color: 'b' },
                  { t: 'vec', to: [0.5, 3, 0], label: 'c', color: 'c' },
                  { t: 'vec', to: [1, 1, 3], label: 'a', color: 'a' },
                  // The true b × c is 8.75 long and would leave the picture, so
                  // the direction is shown at a readable length instead.
                  {
                    t: 'vec',
                    to: { scale: 2.5, v: { unit: { cross: [[3, 0.5, 0], [0.5, 3, 0]] } } },
                    label: 'b × c',
                    color: 'result',
                    dashed: true,
                  },
                ],
                readouts: [
                  { label: 'luas alas =', n: { area: [[3, 0.5, 0], [0.5, 3, 0]] } },
                  { label: 'V =', n: { volume: [[1, 1, 3], [3, 0.5, 0], [0.5, 3, 0]] } },
                ],
                caption: {
                  en: 'The shaded face is the parallelogram on $\\vec{b}$ and $\\vec{c}$, its area $|\\vec{b} \\times \\vec{c}|$. Dotting $\\vec{a}$ with that cross product measures how far $\\vec{a}$ rises out of the face — base area times height, which is the volume.',
                  id: 'Sisi yang diarsir adalah jajargenjang pada $\\vec{b}$ dan $\\vec{c}$, luasnya $|\\vec{b} \\times \\vec{c}|$. Menitikkan $\\vec{a}$ dengan perkalian silang itu mengukur seberapa tinggi $\\vec{a}$ naik dari sisi tersebut — luas alas kali tinggi, yaitu volumenya.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Three vectors give $\\vec{a} \\cdot (\\vec{b} \\times \\vec{c}) = 0$. What does that say about them?',
                id: 'Tiga vektor memberi $\\vec{a} \\cdot (\\vec{b} \\times \\vec{c}) = 0$. Apa artinya tentang ketiganya?',
              },
              options: [
                { en: 'They are mutually perpendicular.', id: 'Ketiganya saling tegak lurus.' },
                { en: 'They all lie in one plane.', id: 'Ketiganya terletak pada satu bidang.' },
                { en: 'They are all unit vectors.', id: 'Ketiganya vektor satuan.' },
                { en: 'At least one of them is $\\vec{0}$.', id: 'Sedikitnya satu di antaranya $\\vec{0}$.' },
              ],
              answer: 1,
              explain: {
                en: 'A zero volume means the box has collapsed flat, which is exactly what it means for three vectors to be coplanar. Mutually perpendicular vectors would give the **largest** volume for their lengths, not zero.',
                id: 'Volume nol berarti baloknya sudah gepeng, dan itu persis makna tiga vektor yang sebidang. Vektor yang saling tegak lurus justru memberi volume **terbesar** untuk panjang yang sama, bukan nol.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the working for $\\vec{a} \\cdot (\\vec{b} \\times \\vec{c})$ with $\\vec{a} = (1, 2, 3)$, $\\vec{b} = (0, 1, 4)$ and $\\vec{c} = (5, 6, 0)$.',
                id: 'Susun langkah penyelesaian $\\vec{a} \\cdot (\\vec{b} \\times \\vec{c})$ dengan $\\vec{a} = (1, 2, 3)$, $\\vec{b} = (0, 1, 4)$, dan $\\vec{c} = (5, 6, 0)$.',
              },
              lines: [
                '\\vec{b} \\times \\vec{c} = ((1)(0) - (4)(6),\\ (4)(5) - (0)(0),\\ (0)(6) - (1)(5))',
                '\\vec{b} \\times \\vec{c} = (-24,\\ 20,\\ -5)',
                '\\vec{a} \\cdot (\\vec{b} \\times \\vec{c}) = (1)(-24) + (2)(20) + (3)(-5)',
                '\\vec{a} \\cdot (\\vec{b} \\times \\vec{c}) = -24 + 40 - 15 = 1',
              ],
              explain: {
                en: 'Cross first, dot second. Doing it the other way round is not a different route to the answer — it is not defined at all.',
                id: 'Silangkan dahulu, titikkan kemudian. Membaliknya bukan jalan lain menuju jawaban — bentuk itu memang tak terdefinisi.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'With $\\vec{a} = (1, 2, 3)$, $\\vec{b} = (0, 1, 4)$ and $\\vec{c} = (5, 6, 0)$, find the volume of the parallelepiped they span.',
                id: 'Dengan $\\vec{a} = (1, 2, 3)$, $\\vec{b} = (0, 1, 4)$, dan $\\vec{c} = (5, 6, 0)$, tentukan volume paralelepipedum yang dibentangkan ketiganya.',
              },
              blanks: [{ label: 'V =', answer: 1 }],
              hints: [{ en: 'You already have the triple product from the previous step.', id: 'Hasil kali tripelnya sudah kamu peroleh pada langkah sebelumnya.' }],
              explain: {
                en: 'The triple product is 1, so the volume is $|1| = 1$. A box of volume 1 built from vectors this long is very nearly flat — the three directions are close to coplanar without quite being so.',
                id: 'Hasil kali tripelnya 1, jadi volumenya $|1| = 1$. Balok bervolume 1 yang disusun dari vektor sepanjang ini hampir gepeng — ketiga arahnya nyaris sebidang meski belum benar-benar sebidang.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'vek-m4-s2-p',
        runtime: 'math',
        title: { en: 'Area and Content', id: 'Luas dan Isi' },
        brief: {
          en: 'A parallelogram, a triangle given by three points, and a parallelepiped.',
          id: 'Sebuah jajargenjang, sebuah segitiga yang diberikan lewat tiga titik, dan sebuah paralelepipedum.',
        },
        requirements: [
          { en: 'Give areas and volumes as positive numbers.', id: 'Nyatakan luas dan volume sebagai bilangan positif.' },
          { en: 'Round to two decimal places, or leave the root in — `sqrt(230)` is read as it stands.', id: 'Bulatkan sampai dua desimal, atau biarkan dalam bentuk akar — `sqrt(230)` terbaca apa adanya.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Find the area of the parallelogram with sides $\\vec{u} = (2, -1, 3)$ and $\\vec{v} = (1, 4, -2)$.',
              id: 'Tentukan luas jajargenjang dengan sisi $\\vec{u} = (2, -1, 3)$ dan $\\vec{v} = (1, 4, -2)$.',
            },
            blanks: [{ label: 'L =', answer: Math.sqrt(230) }],
            solution: [
              '\\vec{u} \\times \\vec{v} = (2 - 12,\\ 3 + 4,\\ 8 + 1) = (-10,\\ 7,\\ 9)',
              'L = \\sqrt{100 + 49 + 81} = \\sqrt{230} \\approx 15{,}17',
            ],
          },
          {
            prompt: {
              en: 'Find the area of triangle $PQR$ with $P(1, 0, 1)$, $Q(2, 3, 0)$ and $R(0, 1, 4)$.',
              id: 'Tentukan luas segitiga $PQR$ dengan $P(1, 0, 1)$, $Q(2, 3, 0)$, dan $R(0, 1, 4)$.',
            },
            blanks: [{ label: 'L =', answer: Math.sqrt(120) / 2 }],
            solution: [
              '\\vec{PQ} = (1, 3, -1), \\qquad \\vec{PR} = (-1, 1, 3)',
              '\\vec{PQ} \\times \\vec{PR} = (9 + 1,\\ 1 - 3,\\ 1 + 3) = (10,\\ -2,\\ 4)',
              'L = \\tfrac{1}{2}\\sqrt{100 + 4 + 16} = \\tfrac{1}{2}\\sqrt{120} \\approx 5{,}48',
            ],
          },
          {
            prompt: {
              en: 'Find the volume of the parallelepiped spanned by $\\vec{a} = (1, 0, 2)$, $\\vec{b} = (3, 1, -1)$ and $\\vec{c} = (2, 4, 1)$.',
              id: 'Tentukan volume paralelepipedum yang dibentangkan oleh $\\vec{a} = (1, 0, 2)$, $\\vec{b} = (3, 1, -1)$, dan $\\vec{c} = (2, 4, 1)$.',
            },
            blanks: [{ label: 'V =', answer: 25 }],
            solution: [
              '\\vec{b} \\times \\vec{c} = (1 + 4,\\ -2 - 3,\\ 12 - 2) = (5,\\ -5,\\ 10)',
              '\\vec{a} \\cdot (\\vec{b} \\times \\vec{c}) = 5 + 0 + 20 = 25',
              'V = |25| = 25',
            ],
          },
        ],
        hints: [
          {
            en: 'For part 2, both vectors must start at the same vertex — $\\vec{PQ}$ and $\\vec{PR}$, not $\\vec{PQ}$ and $\\vec{QR}$.',
            id: 'Untuk butir 2, kedua vektornya harus berpangkal di titik sudut yang sama — $\\vec{PQ}$ dan $\\vec{PR}$, bukan $\\vec{PQ}$ dan $\\vec{QR}$.',
          },
          {
            en: 'For part 3, cross $\\vec{b}$ with $\\vec{c}$ first, then dot the result with $\\vec{a}$.',
            id: 'Untuk butir 3, silangkan $\\vec{b}$ dengan $\\vec{c}$ dahulu, lalu titikkan hasilnya dengan $\\vec{a}$.',
          },
        ],
        xp: 50,
      },
    },
  ],
}
