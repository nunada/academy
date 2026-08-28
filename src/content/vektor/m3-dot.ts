import type { Module } from '../types'

/** Module 3 — the dot product. Two definitions of the same number, one for
 *  computing and one for interpreting; every application in this module comes
 *  from setting them equal to each other. */
export const module3: Module = {
  id: 'vek-m3',
  title: { en: 'The Dot Product', id: 'Perkalian Titik' },
  summary: {
    en: 'Multiply two vectors into a scalar, read an angle out of it, and use it to split one vector along another.',
    id: 'Mengalikan dua vektor menjadi skalar, membaca sudut darinya, dan memakainya untuk menguraikan satu vektor sepanjang vektor lain.',
  },
  submodules: [
    /* ------------------------------------------------------ 3.1 definition & angle */
    {
      id: 'vek-m3-s1',
      title: { en: 'Definition and Angle', id: 'Definisi dan Sudut' },
      summary: {
        en: 'Compute a dot product from components, and get the angle between two vectors out of it.',
        id: 'Menghitung perkalian titik dari komponen, dan memperoleh sudut antara dua vektor darinya.',
      },
      lessons: [
        {
          id: 'vek-m3-s1-l1',
          title: { en: 'Multiplying into a Scalar', id: 'Mengalikan Menjadi Skalar' },
          goal: {
            en: 'Compute $\\vec{a} \\cdot \\vec{b}$ from components and use its algebraic laws.',
            id: 'Menghitung $\\vec{a} \\cdot \\vec{b}$ dari komponen dan memakai hukum aljabarnya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Multiply, then add', id: 'Kalikan, lalu jumlahkan' },
              body: {
                en: 'The **dot product** of $\\vec{a}$ and $\\vec{b}$ multiplies matching components and adds the results:\n$$\\vec{a} \\cdot \\vec{b} = a_1b_1 + a_2b_2 + a_3b_3$$\nWhat comes out is a **scalar**, not a vector — which is why it is also called the scalar product. That is worth saying twice, because an answer to a dot product that has brackets round three numbers is a wrong answer.',
                id: '**Perkalian titik** dari $\\vec{a}$ dan $\\vec{b}$ mengalikan komponen yang bersesuaian lalu menjumlahkan hasilnya:\n$$\\vec{a} \\cdot \\vec{b} = a_1b_1 + a_2b_2 + a_3b_3$$\nYang keluar adalah **skalar**, bukan vektor — karena itu ia juga disebut perkalian skalar. Ini layak disebut dua kali, sebab jawaban perkalian titik yang berupa tiga bilangan dalam kurung adalah jawaban yang salah.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The laws, and one identity', id: 'Hukumnya, dan satu identitas' },
              body: {
                en: 'The dot product is **commutative** and **distributive**:\n$$\\vec{a} \\cdot \\vec{b} = \\vec{b} \\cdot \\vec{a}, \\qquad \\vec{a} \\cdot (\\vec{b} + \\vec{c}) = \\vec{a} \\cdot \\vec{b} + \\vec{a} \\cdot \\vec{c}, \\qquad (k\\vec{a}) \\cdot \\vec{b} = k(\\vec{a} \\cdot \\vec{b})$$\nAnd dotting a vector with itself gives its length squared:\n$$\\vec{a} \\cdot \\vec{a} = a_1^2 + a_2^2 + a_3^2 = |\\vec{a}|^2$$\nThat identity is how magnitude and the dot product are the same tool, and it is used constantly from here on.\n\nOne law is **missing**: there is no associativity. $(\\vec{a} \\cdot \\vec{b}) \\cdot \\vec{c}$ is not even defined — the bracket is a scalar, and a scalar has nothing to dot with.',
                id: 'Perkalian titik bersifat **komutatif** dan **distributif**:\n$$\\vec{a} \\cdot \\vec{b} = \\vec{b} \\cdot \\vec{a}, \\qquad \\vec{a} \\cdot (\\vec{b} + \\vec{c}) = \\vec{a} \\cdot \\vec{b} + \\vec{a} \\cdot \\vec{c}, \\qquad (k\\vec{a}) \\cdot \\vec{b} = k(\\vec{a} \\cdot \\vec{b})$$\nDan mengalikan sebuah vektor dengan dirinya sendiri memberi kuadrat panjangnya:\n$$\\vec{a} \\cdot \\vec{a} = a_1^2 + a_2^2 + a_3^2 = |\\vec{a}|^2$$\nIdentitas itulah yang membuat besar vektor dan perkalian titik menjadi alat yang sama, dan ia dipakai terus-menerus mulai dari sini.\n\nSatu hukum **tidak ada**: tidak ada sifat asosiatif. $(\\vec{a} \\cdot \\vec{b}) \\cdot \\vec{c}$ bahkan tak terdefinisi — isi kurungnya skalar, dan skalar tak punya apa pun untuk dititikkan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What kind of object is $\\vec{a} \\cdot \\vec{b}$?',
                id: 'Objek jenis apakah $\\vec{a} \\cdot \\vec{b}$?',
              },
              options: [
                { en: 'A vector in the same direction as $\\vec{a}$', id: 'Vektor yang searah dengan $\\vec{a}$' },
                { en: 'A vector perpendicular to both', id: 'Vektor yang tegak lurus keduanya' },
                { en: 'A scalar', id: 'Skalar' },
                { en: 'A vector, unless the two are perpendicular', id: 'Vektor, kecuali bila keduanya tegak lurus' },
              ],
              answer: 2,
              explain: {
                en: 'Three products are computed and then added into a single number. The vector perpendicular to both is the cross product, which is Module 4.',
                id: 'Tiga hasil kali dihitung lalu dijumlahkan menjadi satu bilangan. Vektor yang tegak lurus keduanya adalah perkalian silang, yang dibahas pada Modul 4.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the dot product of $\\vec{a} = (2, -1, 3)$ and $\\vec{b} = (4, 5, -2)$.',
                id: 'Lengkapi perkalian titik dari $\\vec{a} = (2, -1, 3)$ dan $\\vec{b} = (4, 5, -2)$.',
              },
              template: '\\vec{a} \\cdot \\vec{b} = (2)(4) + (-1)(5) + (3)(-2) = 8 - 5 - 6 = ___',
              blanks: ['-3'],
              explain: {
                en: 'Two of the three products are negative, and $8 - 5 - 6 = -3$. A negative dot product is perfectly ordinary — the next lesson says what it means.',
                id: 'Dua dari tiga hasil kalinya negatif, dan $8 - 5 - 6 = -3$. Perkalian titik yang negatif itu biasa saja — pelajaran berikutnya menjelaskan artinya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'With $\\vec{a} = (2, -1, 3)$ and $\\vec{b} = (4, 5, -2)$, compute both of these.',
                id: 'Dengan $\\vec{a} = (2, -1, 3)$ dan $\\vec{b} = (4, 5, -2)$, hitung keduanya.',
              },
              blanks: [
                { label: '\\vec{b} \\cdot \\vec{a} =', answer: -3 },
                { label: '\\vec{a} \\cdot \\vec{a} =', answer: 14 },
              ],
              hints: [
                { en: 'The first needs no new work — the dot product is commutative.', id: 'Yang pertama tak butuh kerja baru — perkalian titik bersifat komutatif.' },
                { en: 'The second is $|\\vec{a}|^2 = 4 + 1 + 9$.', id: 'Yang kedua adalah $|\\vec{a}|^2 = 4 + 1 + 9$.' },
              ],
              explain: {
                en: '$\\vec{b} \\cdot \\vec{a}$ is the same $-3$, since the order does not matter. And $\\vec{a} \\cdot \\vec{a} = 14$, so $|\\vec{a}| = \\sqrt{14}$ — the magnitude formula and the dot product are one and the same.',
                id: '$\\vec{b} \\cdot \\vec{a}$ tetap $-3$, karena urutannya tidak berpengaruh. Dan $\\vec{a} \\cdot \\vec{a} = 14$, sehingga $|\\vec{a}| = \\sqrt{14}$ — rumus besar vektor dan perkalian titik memang satu hal yang sama.',
              },
            },
          ],
        },
        {
          id: 'vek-m3-s1-l2',
          title: { en: 'The Angle Between', id: 'Sudut di Antaranya' },
          goal: {
            en: 'Use $\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta$ to find an angle, and read the sign of a dot product.',
            id: 'Memakai $\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta$ untuk mencari sudut, dan membaca tanda perkalian titik.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The same number, said geometrically', id: 'Bilangan yang sama, dinyatakan secara geometris' },
              body: {
                en: 'The dot product has a second face. If $\\theta$ is the angle between $\\vec{a}$ and $\\vec{b}$ when both are drawn from the same point, with $0° \\leq \\theta \\leq 180°$, then\n$$\\vec{a} \\cdot \\vec{b} = |\\vec{a}|\\,|\\vec{b}|\\cos\\theta$$\nThe left side is computed from components; the right side says what that number means. Setting them equal and rearranging gives the angle:\n$$\\cos\\theta = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}|\\,|\\vec{b}|}$$',
                id: 'Perkalian titik punya wajah kedua. Bila $\\theta$ adalah sudut antara $\\vec{a}$ dan $\\vec{b}$ ketika keduanya digambar dari titik yang sama, dengan $0° \\leq \\theta \\leq 180°$, maka\n$$\\vec{a} \\cdot \\vec{b} = |\\vec{a}|\\,|\\vec{b}|\\cos\\theta$$\nRuas kiri dihitung dari komponen; ruas kanan menyatakan apa arti bilangan itu. Menyamakan keduanya lalu menyusun ulang memberi sudutnya:\n$$\\cos\\theta = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}|\\,|\\vec{b}|}$$',
              },
              figure: {
                dim: 2,
                range: 6,
                interactive: true,
                vars: { a: [4, 1], b: [1, 3.5] },
                items: [
                  { t: 'angle', from: { of: 'a' }, to: { of: 'b' }, label: 'θ' },
                  { t: 'vec', to: { of: 'a' }, label: 'a', color: 'a', drag: 'a' },
                  { t: 'vec', to: { of: 'b' }, label: 'b', color: 'b', drag: 'b' },
                ],
                readouts: [
                  { label: 'a·b =', n: { dot: [{ of: 'a' }, { of: 'b' }] } },
                  { label: 'θ =', n: { angle: [{ of: 'a' }, { of: 'b' }] } },
                ],
                caption: {
                  en: 'Drag the two arrows towards each other and apart. Watch the dot product: positive while the angle is under 90°, zero exactly at a right angle, negative beyond it.',
                  id: 'Seret kedua anak panahnya saling mendekat lalu menjauh. Perhatikan perkalian titiknya: positif selama sudutnya di bawah 90°, nol tepat pada sudut siku-siku, negatif setelah melewatinya.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'What the sign tells you at a glance', id: 'Apa yang langsung diberitahukan oleh tandanya' },
              body: {
                en: 'Both magnitudes are positive, so the sign of $\\vec{a} \\cdot \\vec{b}$ is the sign of $\\cos\\theta$ — and that alone classifies the angle:\n\n**positive** — $\\theta < 90°$, an acute angle, the vectors broadly agree\n**zero** — $\\theta = 90°$, they are perpendicular\n**negative** — $\\theta > 90°$, an obtuse angle, they broadly oppose\n\nSo you can tell whether two vectors point the same general way without computing a single square root.',
                id: 'Kedua besarnya positif, jadi tanda $\\vec{a} \\cdot \\vec{b}$ adalah tanda $\\cos\\theta$ — dan itu saja sudah menggolongkan sudutnya:\n\n**positif** — $\\theta < 90°$, sudut lancip, kedua vektor secara umum searah\n**nol** — $\\theta = 90°$, keduanya tegak lurus\n**negatif** — $\\theta > 90°$, sudut tumpul, keduanya secara umum berlawanan\n\nJadi kamu bisa tahu apakah dua vektor mengarah ke sisi yang sama tanpa menghitung satu akar pun.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Two non-zero vectors have $\\vec{a} \\cdot \\vec{b} = -12$. What can you say about the angle between them?',
                id: 'Dua vektor tak nol memenuhi $\\vec{a} \\cdot \\vec{b} = -12$. Apa yang dapat kamu katakan tentang sudut di antaranya?',
              },
              options: [
                { en: 'It is acute.', id: 'Sudutnya lancip.' },
                { en: 'It is a right angle.', id: 'Sudutnya siku-siku.' },
                { en: 'It is obtuse.', id: 'Sudutnya tumpul.' },
                { en: 'Nothing, without knowing the magnitudes.', id: 'Tidak ada, tanpa mengetahui besar kedua vektornya.' },
              ],
              answer: 2,
              explain: {
                en: 'The magnitudes are positive, so a negative dot product forces $\\cos\\theta < 0$, which means $90° < \\theta \\leq 180°$. The magnitudes would only be needed to pin down the exact angle.',
                id: 'Besar kedua vektornya positif, jadi perkalian titik yang negatif memaksa $\\cos\\theta < 0$, yang berarti $90° < \\theta \\leq 180°$. Besarnya baru diperlukan untuk menentukan sudut tepatnya.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the working for the angle between $\\vec{a} = (1, 1, 0)$ and $\\vec{b} = (1, 0, 1)$.',
                id: 'Susun langkah penyelesaian sudut antara $\\vec{a} = (1, 1, 0)$ dan $\\vec{b} = (1, 0, 1)$.',
              },
              lines: [
                '\\vec{a} \\cdot \\vec{b} = (1)(1) + (1)(0) + (0)(1) = 1',
                '|\\vec{a}| = \\sqrt{2}, \\qquad |\\vec{b}| = \\sqrt{2}',
                '\\cos\\theta = \\frac{1}{\\sqrt{2} \\cdot \\sqrt{2}} = \\frac{1}{2}',
                '\\theta = 60^\\circ',
              ],
              explain: {
                en: 'Dot product, then the two magnitudes, then the quotient, then the inverse cosine. The order never changes, whatever the vectors are.',
                id: 'Perkalian titik, lalu kedua besarnya, lalu hasil baginya, lalu invers cosinusnya. Urutannya tak pernah berubah, apa pun vektornya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the angle between $\\vec{a} = (1, 1, 0)$ and $\\vec{b} = (1, 0, 1)$, in degrees.',
                id: 'Tentukan sudut antara $\\vec{a} = (1, 1, 0)$ dan $\\vec{b} = (1, 0, 1)$, dalam derajat.',
              },
              blanks: [
                { label: '\\cos\\theta =', answer: 0.5 },
                { label: '\\theta =', answer: 60, after: '^\\circ' },
              ],
              hints: [
                { en: 'The dot product is 1 and both magnitudes are $\\sqrt{2}$.', id: 'Perkalian titiknya 1 dan kedua besarnya $\\sqrt{2}$.' },
                { en: '$\\sqrt{2} \\cdot \\sqrt{2} = 2$, so $\\cos\\theta = 1/2$ — an angle you already know.', id: '$\\sqrt{2} \\cdot \\sqrt{2} = 2$, jadi $\\cos\\theta = 1/2$ — sudut yang sudah kamu kenal.' },
              ],
              explain: {
                en: '$\\cos\\theta = \\tfrac{1}{2}$ gives $\\theta = 60°$. The product of the two roots simplifying to 2 is what makes this one come out exactly; most do not, and a decimal is the honest answer there.',
                id: '$\\cos\\theta = \\tfrac{1}{2}$ memberi $\\theta = 60°$. Hasil kali kedua akarnya yang menyederhana menjadi 2 itulah yang membuat soal ini keluar eksak; kebanyakan tidak, dan desimal adalah jawaban yang jujur di situ.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'vek-m3-s1-p',
        runtime: 'math',
        title: { en: 'The Angle Between', id: 'Sudut di Antaranya' },
        brief: {
          en: 'One dot product, then two angles — one that comes out neatly and one that does not.',
          id: 'Satu perkalian titik, lalu dua sudut — satu yang keluar rapi dan satu yang tidak.',
        },
        requirements: [
          { en: 'Give every angle in degrees, rounded to two decimal places.', id: 'Nyatakan setiap sudut dalam derajat, dibulatkan sampai dua desimal.' },
          { en: 'Compute $\\cos\\theta$ first; the angle is the last step, not the first.', id: 'Hitung $\\cos\\theta$ dahulu; sudutnya adalah langkah terakhir, bukan yang pertama.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Find $\\vec{a} \\cdot \\vec{b}$ for $\\vec{a} = (2, 3)$ and $\\vec{b} = (-1, 4)$.',
              id: 'Tentukan $\\vec{a} \\cdot \\vec{b}$ untuk $\\vec{a} = (2, 3)$ dan $\\vec{b} = (-1, 4)$.',
            },
            blanks: [{ answer: 10 }],
            solution: ['\\vec{a} \\cdot \\vec{b} = (2)(-1) + (3)(4) = -2 + 12 = 10'],
          },
          {
            prompt: {
              en: 'Find the angle between $\\vec{a} = (1, -2, 2)$ and $\\vec{b} = (3, 0, 4)$.',
              id: 'Tentukan sudut antara $\\vec{a} = (1, -2, 2)$ dan $\\vec{b} = (3, 0, 4)$.',
            },
            blanks: [
              { label: '\\cos\\theta =', answer: 11 / 15 },
              { label: '\\theta =', answer: 42.83, tol: 0.05, after: '^\\circ' },
            ],
            solution: [
              '\\vec{a} \\cdot \\vec{b} = 3 + 0 + 8 = 11',
              '|\\vec{a}| = 3, \\qquad |\\vec{b}| = 5',
              '\\cos\\theta = \\tfrac{11}{15} \\approx 0{,}7333',
              '\\theta \\approx 42{,}83^\\circ',
            ],
          },
          {
            prompt: {
              en: 'Find the angle between $\\vec{a} = (2, 2, -1)$ and $\\vec{b} = (5, -3, 2)$.',
              id: 'Tentukan sudut antara $\\vec{a} = (2, 2, -1)$ dan $\\vec{b} = (5, -3, 2)$.',
            },
            blanks: [
              { label: '\\vec{a} \\cdot \\vec{b} =', answer: 2 },
              { label: '\\theta =', answer: 83.79, tol: 0.06, after: '^\\circ' },
            ],
            solution: [
              '\\vec{a} \\cdot \\vec{b} = 10 - 6 - 2 = 2',
              '|\\vec{a}| = 3, \\qquad |\\vec{b}| = \\sqrt{38} \\approx 6{,}164',
              '\\cos\\theta = \\frac{2}{3\\sqrt{38}} \\approx 0{,}1081',
              '\\theta \\approx 83{,}79^\\circ',
            ],
          },
        ],
        hints: [
          {
            en: 'A dot product close to zero means an angle close to 90°, which is a useful sanity check on part 3.',
            id: 'Perkalian titik yang mendekati nol berarti sudutnya mendekati 90°, dan itu pemeriksaan cepat yang berguna untuk butir 3.',
          },
          {
            en: 'Keep the full precision of $\\cos\\theta$ in your calculator before taking the inverse cosine — rounding it first moves the angle.',
            id: 'Simpan $\\cos\\theta$ dengan ketelitian penuh di kalkulator sebelum mengambil invers cosinusnya — membulatkannya lebih dulu menggeser sudutnya.',
          },
        ],
        xp: 50,
      },
    },

    /* ------------------------------------------------ 3.2 orthogonality & projection */
    {
      id: 'vek-m3-s2',
      title: { en: 'Perpendicularity and Projection', id: 'Ketegaklurusan dan Proyeksi' },
      summary: {
        en: 'Test for a right angle in one line, split a vector along a direction, and compute work.',
        id: 'Menguji sudut siku-siku dalam satu baris, menguraikan vektor sepanjang suatu arah, dan menghitung usaha.',
      },
      lessons: [
        {
          id: 'vek-m3-s2-l1',
          title: { en: 'Perpendicular Vectors', id: 'Vektor yang Tegak Lurus' },
          goal: {
            en: 'Test two vectors for perpendicularity, and solve for an unknown that makes them so.',
            id: 'Menguji ketegaklurusan dua vektor, dan mencari bilangan tak diketahui yang membuatnya demikian.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A right angle is a zero', id: 'Sudut siku-siku adalah sebuah nol' },
              body: {
                en: 'Since $\\cos 90° = 0$, for non-zero vectors\n$$\\vec{a} \\perp \\vec{b} \\iff \\vec{a} \\cdot \\vec{b} = 0$$\nThis is the single most used fact about the dot product. Checking whether two directions are at right angles becomes three multiplications and two additions — no roots, no inverse cosine, no rounding.\n\nBy convention $\\vec{0}$ is taken to be perpendicular to everything, since its dot product with anything is 0. Vectors at right angles are also called **orthogonal**.',
                id: 'Karena $\\cos 90° = 0$, untuk vektor-vektor tak nol berlaku\n$$\\vec{a} \\perp \\vec{b} \\iff \\vec{a} \\cdot \\vec{b} = 0$$\nInilah fakta perkalian titik yang paling sering dipakai. Memeriksa apakah dua arah saling siku-siku menjadi tiga perkalian dan dua penjumlahan — tanpa akar, tanpa invers cosinus, tanpa pembulatan.\n\nSecara kesepakatan $\\vec{0}$ dianggap tegak lurus terhadap apa pun, sebab perkalian titiknya dengan apa pun bernilai 0. Vektor yang saling siku-siku juga disebut **ortogonal**.',
              },
              figure: {
                dim: 2,
                range: 4,
                items: [
                  { t: 'vec', to: [3, 1], label: 'a', color: 'a' },
                  { t: 'vec', to: [-1, 3], label: 'b', color: 'b' },
                  { t: 'right', from: [3, 1], to: [-1, 3] },
                ],
                readouts: [{ label: 'a·b = 3(-1) + 1(3) =', n: { dot: [[3, 1], [-1, 3]] }, dp: 0 }],
                caption: {
                  en: 'Two vectors at a right angle, and their dot product is zero. Note that neither is horizontal or vertical — perpendicularity has nothing to do with the axes.',
                  id: 'Dua vektor yang membentuk sudut siku-siku, dan perkalian titiknya nol. Perhatikan tak satu pun mendatar atau tegak — ketegaklurusan tak ada hubungannya dengan sumbu.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Are $(1, 2, 2)$ and $(2, -2, 1)$ perpendicular?',
                id: 'Apakah $(1, 2, 2)$ dan $(2, -2, 1)$ saling tegak lurus?',
              },
              options: [
                { en: 'Yes — their dot product is 0.', id: 'Ya — perkalian titiknya 0.' },
                { en: 'No — their dot product is 6.', id: 'Tidak — perkalian titiknya 6.' },
                { en: 'No — they have the same magnitude.', id: 'Tidak — besarnya sama.' },
                { en: 'It cannot be decided from the components.', id: 'Tak dapat ditentukan dari komponennya.' },
              ],
              answer: 0,
              explain: {
                en: '$2 - 4 + 2 = 0$, so they are perpendicular. Having the same magnitude, which they do, says nothing at all about the angle.',
                id: '$2 - 4 + 2 = 0$, jadi keduanya tegak lurus. Besarnya yang kebetulan sama sama sekali tidak berbicara tentang sudutnya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Set the dot product of $(2, k, -1)$ and $(3, -2, 4)$ to zero and finish the equation.',
                id: 'Nolkan perkalian titik dari $(2, k, -1)$ dan $(3, -2, 4)$, lalu selesaikan persamaannya.',
              },
              template: '6 - 2k - 4 = 0 \\Rightarrow 2 - 2k = 0 \\Rightarrow k = ___',
              blanks: ['1'],
              explain: {
                en: '$2 - 2k = 0$ gives $k = 1$. Substituting back, $(2, 1, -1) \\cdot (3, -2, 4) = 6 - 2 - 4 = 0$.',
                id: '$2 - 2k = 0$ memberi $k = 1$. Disubstitusikan kembali, $(2, 1, -1) \\cdot (3, -2, 4) = 6 - 2 - 4 = 0$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the value of $k$ that makes $(4, k, 2)$ perpendicular to $(1, 3, -5)$.',
                id: 'Tentukan nilai $k$ yang membuat $(4, k, 2)$ tegak lurus terhadap $(1, 3, -5)$.',
              },
              blanks: [{ label: 'k =', answer: 2 }],
              hints: [
                { en: 'Write the dot product with $k$ in it, then set the whole thing to 0.', id: 'Tuliskan perkalian titiknya dengan $k$ di dalamnya, lalu nolkan seluruhnya.' },
                { en: '$4 + 3k - 10 = 0$.', id: '$4 + 3k - 10 = 0$.' },
              ],
              solution: [
                '(4)(1) + (k)(3) + (2)(-5) = 0',
                '4 + 3k - 10 = 0',
                '3k = 6 \\Rightarrow k = 2',
              ],
              explain: {
                en: 'The condition is one linear equation in $k$, so there is exactly one answer: $k = 2$. Check: $4 + 6 - 10 = 0$.',
                id: 'Syaratnya berupa satu persamaan linear dalam $k$, jadi jawabannya tepat satu: $k = 2$. Periksa: $4 + 6 - 10 = 0$.',
              },
            },
          ],
        },
        {
          id: 'vek-m3-s2-l2',
          title: { en: 'Orthogonal Projection', id: 'Proyeksi Ortogonal' },
          goal: {
            en: 'Find how much of one vector lies along another, as a number and as a vector.',
            id: 'Menentukan seberapa banyak bagian satu vektor yang terletak sepanjang vektor lain, sebagai bilangan dan sebagai vektor.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The shadow of one vector on another', id: 'Bayangan satu vektor pada vektor lain' },
              body: {
                en: 'Shine a light straight down onto the line of $\\vec{b}$. The shadow $\\vec{a}$ casts is its **projection** onto $\\vec{b}$. Its signed length is the **scalar component**\n$$\\text{comp}_{\\vec{b}}\\,\\vec{a} = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|} = |\\vec{a}|\\cos\\theta$$\nIt is negative when the shadow falls on the far side of the origin — that is, when the angle is obtuse. Note which vector is on the bottom: you divide by the length of the one you are projecting **onto**.',
                id: 'Sorotkan cahaya tegak lurus ke garis $\\vec{b}$. Bayangan yang dijatuhkan $\\vec{a}$ adalah **proyeksi**-nya pada $\\vec{b}$. Panjang bertandanya disebut **komponen skalar**\n$$\\text{comp}_{\\vec{b}}\\,\\vec{a} = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|} = |\\vec{a}|\\cos\\theta$$\nNilainya negatif bila bayangannya jatuh di seberang titik asal — yaitu ketika sudutnya tumpul. Perhatikan vektor mana yang ada di penyebut: yang dibagi adalah panjang vektor yang menjadi **tempat** proyeksi.',
              },
              figure: {
                dim: 2,
                range: 6,
                interactive: true,
                vars: { a: [2, 4], b: [5, 1] },
                items: [
                  { t: 'seg', from: { of: 'a' }, to: { proj: [{ of: 'a' }, { of: 'b' }] }, dashed: true },
                  { t: 'right', at: { proj: [{ of: 'a' }, { of: 'b' }] }, from: [0, 0], to: { of: 'a' } },
                  { t: 'vec', to: { of: 'b' }, label: 'b', color: 'b', drag: 'b' },
                  { t: 'vec', to: { of: 'a' }, label: 'a', color: 'a', drag: 'a' },
                  { t: 'vec', to: { proj: [{ of: 'a' }, { of: 'b' }] }, label: 'proj', color: 'result' },
                ],
                readouts: [
                  { label: 'a·b =', n: { dot: [{ of: 'a' }, { of: 'b' }] } },
                  { label: 'θ =', n: { angle: [{ of: 'a' }, { of: 'b' }] } },
                ],
                caption: {
                  en: 'The dashed line is the light falling straight onto the line of $\\vec{b}$, and the green arrow is the shadow. Swing $\\vec{a}$ past a right angle and the shadow crosses to the other side of the origin — that is what a negative scalar component means.',
                  id: 'Garis putus-putus adalah cahaya yang jatuh tegak lurus ke garis $\\vec{b}$, dan anak panah hijau adalah bayangannya. Ayunkan $\\vec{a}$ melewati sudut siku-siku dan bayangannya berpindah ke seberang titik asal — itulah makna komponen skalar yang negatif.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The shadow as a vector', id: 'Bayangan itu sebagai vektor' },
              body: {
                en: 'To turn that length back into a vector, point it along $\\hat{b}$:\n$$\\text{proj}_{\\vec{b}}\\,\\vec{a} = \\left(\\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|}\\right)\\hat{b} = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|^2}\\,\\vec{b}$$\nThe right-hand form is the one to use: the denominator is $\\vec{b} \\cdot \\vec{b}$, so no square root ever appears.\n\nWhat is left over, $\\vec{a} - \\text{proj}_{\\vec{b}}\\,\\vec{a}$, is perpendicular to $\\vec{b}$. So any vector splits into a part along a chosen direction and a part at right angles to it — which is exactly what "resolving a force" means in mechanics.',
                id: 'Untuk mengubah panjang itu kembali menjadi vektor, arahkan sepanjang $\\hat{b}$:\n$$\\text{proj}_{\\vec{b}}\\,\\vec{a} = \\left(\\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|}\\right)\\hat{b} = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|^2}\\,\\vec{b}$$\nBentuk di ruas kanan itulah yang sebaiknya dipakai: penyebutnya adalah $\\vec{b} \\cdot \\vec{b}$, sehingga tak pernah muncul akar.\n\nSisanya, $\\vec{a} - \\text{proj}_{\\vec{b}}\\,\\vec{a}$, tegak lurus terhadap $\\vec{b}$. Jadi vektor apa pun terurai menjadi bagian sepanjang arah pilihan dan bagian yang siku-siku terhadapnya — dan itulah persis makna "menguraikan gaya" dalam mekanika.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is $\\text{proj}_{\\vec{b}}\\,\\vec{a}$ when $\\vec{a}$ and $\\vec{b}$ are perpendicular?',
                id: 'Berapakah $\\text{proj}_{\\vec{b}}\\,\\vec{a}$ bila $\\vec{a}$ dan $\\vec{b}$ tegak lurus?',
              },
              options: [
                { en: '$\\vec{a}$ itself', id: '$\\vec{a}$ itu sendiri' },
                { en: '$\\vec{b}$ itself', id: '$\\vec{b}$ itu sendiri' },
                { en: '$\\vec{0}$', id: '$\\vec{0}$' },
                { en: '$|\\vec{a}|\\,\\hat{b}$', id: '$|\\vec{a}|\\,\\hat{b}$' },
              ],
              answer: 2,
              explain: {
                en: 'The numerator $\\vec{a} \\cdot \\vec{b}$ is 0, so the whole projection is the zero vector. Geometrically: shine the light along $\\vec{a}$ and its shadow on a perpendicular line is a single point.',
                id: 'Pembilangnya $\\vec{a} \\cdot \\vec{b}$ bernilai 0, jadi seluruh proyeksinya adalah vektor nol. Secara geometris: sorotkan cahaya sepanjang $\\vec{a}$ dan bayangannya pada garis yang tegak lurus hanyalah satu titik.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the working for $\\text{proj}_{\\vec{b}}\\,\\vec{a}$ with $\\vec{a} = (2, 3, 1)$ and $\\vec{b} = (1, 2, 2)$.',
                id: 'Susun langkah penyelesaian $\\text{proj}_{\\vec{b}}\\,\\vec{a}$ dengan $\\vec{a} = (2, 3, 1)$ dan $\\vec{b} = (1, 2, 2)$.',
              },
              lines: [
                '\\vec{a} \\cdot \\vec{b} = 2 + 6 + 2 = 10',
                '|\\vec{b}|^2 = 1 + 4 + 4 = 9',
                '\\text{proj}_{\\vec{b}}\\,\\vec{a} = \\tfrac{10}{9}(1, 2, 2)',
                '\\text{proj}_{\\vec{b}}\\,\\vec{a} = \\left(\\tfrac{10}{9}, \\tfrac{20}{9}, \\tfrac{20}{9}\\right)',
              ],
              explain: {
                en: 'Dot product on top, squared magnitude underneath, then multiply the whole fraction through $\\vec{b}$. Never normalise $\\vec{b}$ separately — the squared form saves you the root.',
                id: 'Perkalian titik di atas, kuadrat besarnya di bawah, lalu kalikan seluruh pecahannya dengan $\\vec{b}$. Jangan menormalkan $\\vec{b}$ secara terpisah — bentuk kuadratnya menghemat satu langkah akar.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'With $\\vec{a} = (2, 3, 1)$ and $\\vec{b} = (1, 2, 2)$, find the scalar component and then the projection.',
                id: 'Dengan $\\vec{a} = (2, 3, 1)$ dan $\\vec{b} = (1, 2, 2)$, tentukan komponen skalarnya lalu proyeksinya.',
              },
              blanks: [
                { label: '\\text{comp}_{\\vec{b}}\\,\\vec{a} =', answer: 10 / 3 },
                { label: '\\text{proj}_{\\vec{b}}\\,\\vec{a} = (', answer: 10 / 9 },
                { label: ',', answer: 20 / 9 },
                { label: ',', answer: 20 / 9, after: ')' },
              ],
              hints: [
                { en: '$\\vec{a} \\cdot \\vec{b} = 10$ and $|\\vec{b}| = 3$.', id: '$\\vec{a} \\cdot \\vec{b} = 10$ dan $|\\vec{b}| = 3$.' },
                { en: 'The scalar component divides by $|\\vec{b}|$; the projection divides by $|\\vec{b}|^2$ and then multiplies by $\\vec{b}$.', id: 'Komponen skalarnya dibagi $|\\vec{b}|$; proyeksinya dibagi $|\\vec{b}|^2$ lalu dikalikan $\\vec{b}$.' },
              ],
              explain: {
                en: 'The scalar component is $10/3$; the projection is $\\frac{10}{9}(1, 2, 2)$. The two differ by exactly one factor of $|\\vec{b}|$, which is the difference between a length and a vector.',
                id: 'Komponen skalarnya $10/3$; proyeksinya $\\frac{10}{9}(1, 2, 2)$. Keduanya berbeda tepat satu faktor $|\\vec{b}|$, dan itulah beda antara sebuah panjang dan sebuah vektor.',
              },
            },
          ],
        },
        {
          id: 'vek-m3-s2-l3',
          title: { en: 'Work Done by a Force', id: 'Usaha oleh Sebuah Gaya' },
          goal: {
            en: 'Compute work from a force and a displacement, in components or from an angle.',
            id: 'Menghitung usaha dari gaya dan perpindahan, lewat komponen maupun dari sudutnya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Only the part along the motion counts', id: 'Hanya bagian sepanjang gerak yang diperhitungkan' },
              body: {
                en: 'A force $\\vec{F}$ moving an object through a displacement $\\vec{d}$ does **work**\n$$W = \\vec{F} \\cdot \\vec{d} = |\\vec{F}|\\,|\\vec{d}|\\cos\\theta$$\nThe cosine is the whole physical content: only the component of the force along the motion does any work. Push a crate sideways while it moves forwards and you have done none.\n\nA negative $W$ means the force opposed the motion — friction, for instance. And $W$ is a scalar, measured in joules when $\\vec{F}$ is in newtons and $\\vec{d}$ in metres.',
                id: 'Sebuah gaya $\\vec{F}$ yang memindahkan benda sejauh perpindahan $\\vec{d}$ melakukan **usaha**\n$$W = \\vec{F} \\cdot \\vec{d} = |\\vec{F}|\\,|\\vec{d}|\\cos\\theta$$\nCosinusnya adalah seluruh isi fisisnya: hanya komponen gaya yang searah gerak yang melakukan usaha. Dorong peti ke samping sementara ia bergerak maju, dan usaha yang kamu lakukan nol.\n\n$W$ yang negatif berarti gayanya melawan gerak — gesekan, misalnya. Dan $W$ adalah skalar, bersatuan joule bila $\\vec{F}$ dalam newton dan $\\vec{d}$ dalam meter.',
              },
              figure: {
                dim: 2,
                range: 6,
                interactive: true,
                vars: { F: [3, 3] },
                items: [
                  { t: 'vec', to: [5, 0], label: 'd', color: 'b' },
                  { t: 'seg', from: { of: 'F' }, to: { proj: [{ of: 'F' }, [5, 0]] }, dashed: true },
                  { t: 'angle', from: [5, 0], to: { of: 'F' }, label: 'θ' },
                  { t: 'vec', to: { of: 'F' }, label: 'F', color: 'a', drag: 'F' },
                  { t: 'vec', to: { proj: [{ of: 'F' }, [5, 0]] }, color: 'result' },
                ],
                readouts: [
                  { label: 'θ =', n: { angle: [{ of: 'F' }, [5, 0]] } },
                  { label: 'W = F·d =', n: { dot: [{ of: 'F' }, [5, 0]] } },
                ],
                caption: {
                  en: 'Drag the force. Only the green part — its shadow on the displacement — does any work. Turn $\\vec{F}$ straight up and the work falls to zero; turn it backwards and the work goes negative.',
                  id: 'Seret gayanya. Hanya bagian hijaunya — bayangan gaya pada perpindahan — yang melakukan usaha. Putar $\\vec{F}$ tegak lurus ke atas dan usahanya jatuh ke nol; putar ke belakang dan usahanya menjadi negatif.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A porter carries a suitcase horizontally along a corridor. The force they exert on it is vertical, holding it up. How much work does that force do?',
                id: 'Seorang porter membawa koper mendatar di sepanjang lorong. Gaya yang ia berikan pada koper itu vertikal, menahannya agar tidak jatuh. Berapa usaha yang dilakukan gaya itu?',
              },
              options: [
                { en: 'Zero — the force is perpendicular to the displacement.', id: 'Nol — gayanya tegak lurus perpindahan.' },
                { en: 'The weight times the distance walked.', id: 'Berat koper dikali jarak berjalan.' },
                { en: 'Negative, since carrying is tiring.', id: 'Negatif, karena membawa beban itu melelahkan.' },
                { en: 'It cannot be computed without the mass.', id: 'Tak dapat dihitung tanpa mengetahui massanya.' },
              ],
              answer: 0,
              explain: {
                en: '$\\theta = 90°$, so $\\cos\\theta = 0$ and $W = 0$. Getting tired is about the muscles holding the load, not about work in this sense.',
                id: '$\\theta = 90°$, sehingga $\\cos\\theta = 0$ dan $W = 0$. Rasa lelah berkaitan dengan otot yang menahan beban, bukan dengan usaha dalam pengertian ini.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'A force $\\vec{F} = (4, -1, 3)$ N moves an object through $\\vec{d} = (2, 5, 1)$ m. Find the work done.',
                id: 'Sebuah gaya $\\vec{F} = (4, -1, 3)$ N memindahkan benda sejauh $\\vec{d} = (2, 5, 1)$ m. Tentukan usaha yang dilakukan.',
              },
              blanks: [{ label: 'W =', answer: 6, after: '\\text{ J}' }],
              hints: [{ en: 'Work is just a dot product: multiply matching slots and add.', id: 'Usaha hanyalah perkalian titik: kalikan slot yang bersesuaian lalu jumlahkan.' }],
              solution: ['W = (4)(2) + (-1)(5) + (3)(1) = 8 - 5 + 3 = 6 \\text{ J}'],
              explain: {
                en: '$8 - 5 + 3 = 6$ J. The middle term is negative because that component of the force pushed against that part of the motion.',
                id: '$8 - 5 + 3 = 6$ J. Suku tengahnya negatif karena komponen gaya itu melawan bagian gerak yang bersesuaian.',
              },
            },
            {
              kind: 'math',
              id: 'm2',
              prompt: {
                en: 'A force of 20 N acts at 60° to a displacement of 6 m. Find the work done.',
                id: 'Sebuah gaya 20 N bekerja membentuk sudut 60° terhadap perpindahan sejauh 6 m. Tentukan usaha yang dilakukan.',
              },
              blanks: [{ label: 'W =', answer: 60, after: '\\text{ J}' }],
              hints: [{ en: 'Here the components are not given, so use $W = |\\vec{F}||\\vec{d}|\\cos\\theta$ with $\\cos 60° = 0{,}5$.', id: 'Di sini komponennya tidak diberikan, jadi pakai $W = |\\vec{F}||\\vec{d}|\\cos\\theta$ dengan $\\cos 60° = 0{,}5$.' }],
              solution: ['W = (20)(6)\\cos 60^\\circ = 120 \\cdot \\tfrac{1}{2} = 60 \\text{ J}'],
              explain: {
                en: '$120 \\cdot 0.5 = 60$ J. Half the force is doing nothing at all — it points across the motion.',
                id: '$120 \\cdot 0{,}5 = 60$ J. Separuh gayanya sama sekali tak berbuat apa-apa — arahnya melintang terhadap gerak.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'vek-m3-s2-p',
        runtime: 'math',
        title: { en: 'Projection and Work', id: 'Proyeksi dan Usaha' },
        brief: {
          en: 'A scalar component, a projection vector, and a work problem where the displacement has to be built first.',
          id: 'Sebuah komponen skalar, sebuah vektor proyeksi, dan satu soal usaha yang perpindahannya harus disusun lebih dahulu.',
        },
        requirements: [
          { en: 'Mind which vector is being projected onto which — the denominator belongs to the second one.', id: 'Perhatikan vektor mana yang diproyeksikan ke mana — penyebutnya milik vektor yang kedua.' },
          { en: 'In part 3 the displacement is not given; build it from the two points.', id: 'Pada butir 3 perpindahannya tidak diberikan; susun dari kedua titiknya.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'With $\\vec{a} = (5, -2)$ and $\\vec{b} = (3, 4)$, find $\\text{comp}_{\\vec{b}}\\,\\vec{a}$.',
              id: 'Dengan $\\vec{a} = (5, -2)$ dan $\\vec{b} = (3, 4)$, tentukan $\\text{comp}_{\\vec{b}}\\,\\vec{a}$.',
            },
            blanks: [{ answer: 1.4 }],
            solution: [
              '\\vec{a} \\cdot \\vec{b} = 15 - 8 = 7',
              '|\\vec{b}| = 5',
              '\\text{comp}_{\\vec{b}}\\,\\vec{a} = \\tfrac{7}{5} = 1{,}4',
            ],
          },
          {
            prompt: {
              en: 'With $\\vec{a} = (3, 1, -2)$ and $\\vec{b} = (2, -2, 1)$, find $\\text{proj}_{\\vec{b}}\\,\\vec{a}$.',
              id: 'Dengan $\\vec{a} = (3, 1, -2)$ dan $\\vec{b} = (2, -2, 1)$, tentukan $\\text{proj}_{\\vec{b}}\\,\\vec{a}$.',
            },
            inline: true,
            blanks: [{ answer: 4 / 9 }, { answer: -4 / 9 }, { answer: 2 / 9 }],
            solution: [
              '\\vec{a} \\cdot \\vec{b} = 6 - 2 - 2 = 2',
              '|\\vec{b}|^2 = 4 + 4 + 1 = 9',
              '\\text{proj}_{\\vec{b}}\\,\\vec{a} = \\tfrac{2}{9}(2, -2, 1) = \\left(\\tfrac{4}{9}, -\\tfrac{4}{9}, \\tfrac{2}{9}\\right)',
            ],
          },
          {
            prompt: {
              en: 'A force $\\vec{F} = (3, 4, -2)$ N moves an object from $A(1, 0, 2)$ to $B(4, 2, 1)$, in metres. Find the work done.',
              id: 'Sebuah gaya $\\vec{F} = (3, 4, -2)$ N memindahkan benda dari $A(1, 0, 2)$ ke $B(4, 2, 1)$, dalam meter. Tentukan usaha yang dilakukan.',
            },
            blanks: [{ label: 'W =', answer: 19, after: '\\text{ J}' }],
            solution: [
              '\\vec{d} = \\vec{AB} = (3,\\ 2,\\ -1)',
              'W = (3)(3) + (4)(2) + (-2)(-1) = 9 + 8 + 2 = 19 \\text{ J}',
            ],
          },
        ],
        hints: [
          {
            en: 'Part 2 never needs a square root: use $\\dfrac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|^2}\\vec{b}$, and $|\\vec{b}|^2$ is just $\\vec{b} \\cdot \\vec{b}$.',
            id: 'Butir 2 sama sekali tak butuh akar: pakai $\\dfrac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|^2}\\vec{b}$, dan $|\\vec{b}|^2$ tak lain adalah $\\vec{b} \\cdot \\vec{b}$.',
          },
          {
            en: 'In part 3, $\\vec{AB} = B - A = (3, 2, -1)$. Then it is one dot product.',
            id: 'Pada butir 3, $\\vec{AB} = B - A = (3, 2, -1)$. Setelah itu tinggal satu perkalian titik.',
          },
        ],
        xp: 50,
      },
    },
  ],
}
