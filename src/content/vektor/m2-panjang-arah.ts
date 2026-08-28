import type { Module } from '../types'

/** Module 2 — magnitude, and the separation of a vector into "how long" and
 *  "which way". Normalisation is the idea the rest of the course leans on
 *  hardest: projections, plane normals and direction cosines are all it. */
export const module2: Module = {
  id: 'vek-m2',
  title: { en: 'Magnitude, Distance and Direction', id: 'Panjang, Jarak, dan Arah' },
  summary: {
    en: 'Measure a vector, measure the gap between two points, and split any vector into a length and a unit direction.',
    id: 'Mengukur panjang vektor, mengukur jarak dua titik, dan memisahkan vektor menjadi panjang dan arah satuan.',
  },
  submodules: [
    /* ------------------------------------------------------ 2.1 norm & distance */
    {
      id: 'vek-m2-s1',
      title: { en: 'Norm and Distance', id: 'Panjang dan Jarak' },
      summary: {
        en: 'Pythagoras in two and three dimensions, and the rules a magnitude obeys.',
        id: 'Pythagoras di dua dan tiga dimensi, serta aturan yang dipatuhi sebuah besar vektor.',
      },
      lessons: [
        {
          id: 'vek-m2-s1-l1',
          title: { en: 'The Length of a Vector', id: 'Panjang Sebuah Vektor' },
          goal: {
            en: 'Compute $|\\vec{a}|$ in the plane and in space.',
            id: 'Menghitung $|\\vec{a}|$ di bidang dan di ruang.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Pythagoras, once', id: 'Pythagoras, sekali' },
              body: {
                en: 'Draw $\\vec{a} = (a_1, a_2)$ from the origin. Its components are the two legs of a right triangle and the vector itself is the hypotenuse, so\n$$|\\vec{a}| = \\sqrt{a_1^2 + a_2^2}$$\nThe result is called the **norm**, or the **magnitude**, of the vector. It is never negative, and it is 0 only for $\\vec{0}$.',
                id: 'Gambar $\\vec{a} = (a_1, a_2)$ dari titik asal. Komponennya menjadi dua sisi siku-siku sebuah segitiga dan vektornya sendiri menjadi sisi miring, sehingga\n$$|\\vec{a}| = \\sqrt{a_1^2 + a_2^2}$$\nHasilnya disebut **norma**, atau **besar**, dari vektor itu. Nilainya tak pernah negatif, dan bernilai 0 hanya untuk $\\vec{0}$.',
              },
              figure: {
                dim: 2,
                range: 6,
                interactive: true,
                vars: { a: [3, 4] },
                items: [
                  { t: 'seg', from: [0, 0], to: { proj: [{ of: 'a' }, [1, 0]] }, color: 'b' },
                  { t: 'seg', from: { proj: [{ of: 'a' }, [1, 0]] }, to: { of: 'a' }, color: 'c' },
                  { t: 'right', at: { proj: [{ of: 'a' }, [1, 0]] }, from: [0, 0], to: { of: 'a' } },
                  { t: 'vec', to: { of: 'a' }, label: 'a', color: 'a', drag: 'a' },
                ],
                readouts: [
                  { label: 'a =', v: { of: 'a' }, dp: 1 },
                  { label: '|a| =', n: { norm: { of: 'a' } } },
                ],
                caption: {
                  en: 'The two legs are the components and the arrow is the hypotenuse. Drag the head: the length never goes negative, however far into the third quadrant you push it.',
                  id: 'Kedua sisi siku-sikunya adalah komponen dan anak panahnya adalah sisi miring. Seret ujungnya: panjangnya tak pernah menjadi negatif, sejauh apa pun kamu mendorongnya ke kuadran ketiga.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Pythagoras, twice', id: 'Pythagoras, dua kali' },
              body: {
                en: 'In space, apply the same theorem twice: first across the floor, to get the diagonal $\\sqrt{a_1^2 + a_2^2}$, and then upright, against $a_3$. The two square roots collapse into one:\n$$|\\vec{a}| = \\sqrt{a_1^2 + a_2^2 + a_3^2}$$\nSquaring removes every sign, so a negative component contributes exactly as much as a positive one of the same size. $|(3, -4)|$ and $|(3, 4)|$ are both 5.',
                id: 'Di ruang, terapkan teorema yang sama dua kali: pertama pada lantainya, untuk memperoleh diagonal $\\sqrt{a_1^2 + a_2^2}$, lalu tegak lurus terhadapnya, melawan $a_3$. Kedua akar itu menyatu menjadi satu:\n$$|\\vec{a}| = \\sqrt{a_1^2 + a_2^2 + a_3^2}$$\nMengkuadratkan menghapus semua tanda, jadi komponen negatif menyumbang persis sama besar dengan komponen positif seukurannya. $|(3, -4)|$ dan $|(3, 4)|$ sama-sama 5.',
              },
              figure: {
                dim: 3,
                range: 6,
                interactive: true,
                view: [40, 24],
                items: [
                  // The floor diagonal, then the upright: Pythagoras applied twice.
                  { t: 'seg', from: [0, 0, 0], to: [2, -3, 0], color: 'b' },
                  { t: 'seg', from: [2, -3, 0], to: [2, -3, 6], color: 'c' },
                  { t: 'right', at: [2, -3, 0], from: [0, 0, 0], to: [2, -3, 6] },
                  { t: 'seg', from: [2, 0, 0], to: [2, -3, 0], dashed: true },
                  { t: 'seg', from: [0, -3, 0], to: [2, -3, 0], dashed: true },
                  { t: 'vec', to: [2, -3, 6], label: 'a', color: 'a' },
                ],
                readouts: [
                  { label: 'lantai =', n: { norm: [2, -3, 0] } },
                  { label: '|a| =', n: { norm: [2, -3, 6] }, dp: 0 },
                ],
                caption: {
                  en: 'Turn the scene to see it: $\\vec{a} = (2, -3, 6)$ reaches its tip by a diagonal across the floor of length $\\sqrt{13}$, then straight up by 6. One right triangle standing on another — which is why the two square roots collapse into one.',
                  id: 'Putar gambarnya untuk melihatnya: $\\vec{a} = (2, -3, 6)$ mencapai ujungnya lewat diagonal di lantai sepanjang $\\sqrt{13}$, lalu tegak lurus ke atas sejauh 6. Satu segitiga siku-siku berdiri di atas segitiga lain — itulah sebabnya kedua akarnya menyatu menjadi satu.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which statement about $|\\vec{a}|$ is **false**?',
                id: 'Pernyataan manakah tentang $|\\vec{a}|$ yang **salah**?',
              },
              options: [
                { en: '$|\\vec{a}|$ is a scalar.', id: '$|\\vec{a}|$ adalah skalar.' },
                { en: '$|\\vec{a}| \\geq 0$ for every vector.', id: '$|\\vec{a}| \\geq 0$ untuk setiap vektor.' },
                { en: '$|\\vec{a}|$ can be negative when the components are negative.', id: '$|\\vec{a}|$ dapat negatif bila komponennya negatif.' },
                { en: '$|\\vec{a}| = 0$ only when $\\vec{a} = \\vec{0}$.', id: '$|\\vec{a}| = 0$ hanya bila $\\vec{a} = \\vec{0}$.' },
              ],
              answer: 2,
              explain: {
                en: 'Every component is squared before it is added, so the number under the root can never be negative, and the root itself is taken to be non-negative. A length that came out negative would be a length of nothing.',
                id: 'Setiap komponen dikuadratkan sebelum dijumlahkan, jadi bilangan di bawah akarnya tak pernah negatif, dan akarnya sendiri diambil yang tak negatif. Panjang yang keluar negatif tidaklah berarti apa-apa.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the working for $|\\vec{a}|$ where $\\vec{a} = (3, -4)$.',
                id: 'Lengkapi penyelesaian $|\\vec{a}|$ dengan $\\vec{a} = (3, -4)$.',
              },
              template: '|\\vec{a}| = \\sqrt{3^2 + (-4)^2} = \\sqrt{___} = ___',
              blanks: ['25', '5'],
              explain: {
                en: '$9 + 16 = 25$, and $\\sqrt{25} = 5$. The minus sign disappears the moment the component is squared.',
                id: '$9 + 16 = 25$, dan $\\sqrt{25} = 5$. Tanda minusnya lenyap begitu komponennya dikuadratkan.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find each magnitude.',
                id: 'Tentukan setiap besar vektor berikut.',
              },
              blanks: [
                { label: '|(2, -3, 6)| =', answer: 7 },
                { label: '|(1, 1, 1)| =', answer: Math.sqrt(3) },
              ],
              hints: [
                { en: 'Square, add, take the root. $4 + 9 + 36$ is a perfect square.', id: 'Kuadratkan, jumlahkan, akarkan. $4 + 9 + 36$ adalah kuadrat sempurna.' },
                { en: 'The second one is not a whole number — `sqrt(3)` or `1.73` are both accepted.', id: 'Yang kedua bukan bilangan bulat — `sqrt(3)` maupun `1,73` sama-sama diterima.' },
              ],
              solution: [
                '|(2, -3, 6)| = \\sqrt{4 + 9 + 36} = \\sqrt{49} = 7',
                '|(1, 1, 1)| = \\sqrt{1 + 1 + 1} = \\sqrt{3} \\approx 1{,}73',
              ],
              explain: {
                en: 'The first is a perfect square and comes out whole; the second does not, and $\\sqrt{3}$ is the exact answer. Leaving a root in the answer is normal, not unfinished.',
                id: 'Yang pertama kuadrat sempurna sehingga hasilnya bulat; yang kedua tidak, dan $\\sqrt{3}$ adalah jawaban eksaknya. Meninggalkan bentuk akar pada jawaban itu wajar, bukan berarti belum selesai.',
              },
            },
          ],
        },
        {
          id: 'vek-m2-s1-l2',
          title: { en: 'Distance and the Rules of Magnitude', id: 'Jarak dan Aturan Besar Vektor' },
          goal: {
            en: 'Find the distance between two points, and know what scaling does to a length.',
            id: 'Menentukan jarak dua titik, dan mengetahui pengaruh perkalian skalar terhadap panjang.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Distance is the length of the arrow between', id: 'Jarak adalah panjang anak panah di antaranya' },
              body: {
                en: 'The distance from $A$ to $B$ is simply $|\\vec{AB}|$ — build the vector between the points, then measure it:\n$$d(A, B) = |\\vec{AB}| = \\sqrt{(b_1 - a_1)^2 + (b_2 - a_2)^2 + (b_3 - a_3)^2}$$\nThe order of the points does not matter here, even though it very much matters for $\\vec{AB}$: $\\vec{BA}$ is the negative of $\\vec{AB}$, and the two have the same length.',
                id: 'Jarak dari $A$ ke $B$ hanyalah $|\\vec{AB}|$ — susun vektor antara kedua titiknya, lalu ukur:\n$$d(A, B) = |\\vec{AB}| = \\sqrt{(b_1 - a_1)^2 + (b_2 - a_2)^2 + (b_3 - a_3)^2}$$\nUrutan titiknya tidak berpengaruh di sini, meskipun sangat berpengaruh untuk $\\vec{AB}$: $\\vec{BA}$ adalah negatif dari $\\vec{AB}$, dan keduanya panjangnya sama.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Two rules worth knowing by heart', id: 'Dua aturan yang layak dihafal' },
              body: {
                en: 'Scaling a vector scales its length by the **absolute value** of the scalar:\n$$|k\\vec{a}| = |k|\\,|\\vec{a}|$$\nThe bars do different work on each side — around $k$ they mean absolute value, around $\\vec{a}$ they mean norm — but the idea is the same measurement in both places. So $|-3\\vec{a}| = 3|\\vec{a}|$: reversing a vector cannot shorten it.\n\nAnd the **triangle inequality**:\n$$|\\vec{a} + \\vec{b}| \\leq |\\vec{a}| + |\\vec{b}|$$\nGoing by way of $\\vec{b}$ is never shorter than going straight there, with equality only when the two point the same way.',
                id: 'Mengalikan vektor dengan skalar mengalikan panjangnya dengan **nilai mutlak** skalar itu:\n$$|k\\vec{a}| = |k|\\,|\\vec{a}|$$\nKedua pasang garisnya bekerja berbeda — di sekitar $k$ berarti nilai mutlak, di sekitar $\\vec{a}$ berarti norma — tetapi gagasannya pengukuran yang sama di kedua tempat. Jadi $|-3\\vec{a}| = 3|\\vec{a}|$: membalik arah vektor tak bisa memendekkannya.\n\nDan **ketaksamaan segitiga**:\n$$|\\vec{a} + \\vec{b}| \\leq |\\vec{a}| + |\\vec{b}|$$\nLewat $\\vec{b}$ tak pernah lebih pendek daripada langsung menuju tujuan, dan sama panjang hanya bila keduanya searah.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'If $|\\vec{a}| = 4$, what is $|-3\\vec{a}|$?',
                id: 'Jika $|\\vec{a}| = 4$, berapakah $|-3\\vec{a}|$?',
              },
              options: [
                { en: '$-12$', id: '$-12$' },
                { en: '$12$', id: '$12$' },
                { en: '$1$', id: '$1$' },
                { en: '$-3$', id: '$-3$' },
              ],
              answer: 1,
              explain: {
                en: '$|-3\\vec{a}| = |-3|\\,|\\vec{a}| = 3 \\cdot 4 = 12$. The minus sign turns the vector around; it does not shorten it, and a length is never negative.',
                id: '$|-3\\vec{a}| = |-3|\\,|\\vec{a}| = 3 \\cdot 4 = 12$. Tanda minusnya membalik arah vektornya; ia tidak memendekkannya, dan panjang tak pernah negatif.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the working for the distance from $A(1, -2, 3)$ to $B(4, 2, -9)$.',
                id: 'Susun langkah penyelesaian jarak dari $A(1, -2, 3)$ ke $B(4, 2, -9)$.',
              },
              lines: [
                '\\vec{AB} = (4 - 1,\\ 2 - (-2),\\ -9 - 3)',
                '\\vec{AB} = (3,\\ 4,\\ -12)',
                'd = \\sqrt{3^2 + 4^2 + (-12)^2} = \\sqrt{9 + 16 + 144}',
                'd = \\sqrt{169} = 13',
              ],
              explain: {
                en: 'Build the vector, square its components, add, take the root. Every distance problem in this course is these four lines.',
                id: 'Susun vektornya, kuadratkan komponennya, jumlahkan, akarkan. Setiap soal jarak dalam kursus ini adalah empat baris ini.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the distance between $A(1, -2, 3)$ and $B(4, 2, -9)$.',
                id: 'Tentukan jarak antara $A(1, -2, 3)$ dan $B(4, 2, -9)$.',
              },
              blanks: [{ label: 'd(A, B) =', answer: 13 }],
              hints: [
                { en: 'Find $\\vec{AB}$ first — it is $(3, 4, -12)$.', id: 'Cari $\\vec{AB}$ dulu — hasilnya $(3, 4, -12)$.' },
              ],
              explain: {
                en: '$\\sqrt{9 + 16 + 144} = \\sqrt{169} = 13$. Note that $(3, 4, 12)$ is a Pythagorean triple in space, the way $(3, 4, 5)$ is in the plane.',
                id: '$\\sqrt{9 + 16 + 144} = \\sqrt{169} = 13$. Perhatikan $(3, 4, 12)$ adalah tripel Pythagoras di ruang, sebagaimana $(3, 4, 5)$ di bidang.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'vek-m2-s1-p',
        runtime: 'math',
        title: { en: 'Measure It', id: 'Ukur Panjangnya' },
        brief: {
          en: 'Three magnitudes: one direct, one between two points, and one where the length is given and the scalar is not.',
          id: 'Tiga soal panjang: satu langsung, satu antara dua titik, dan satu ketika panjangnya diketahui tetapi skalarnya tidak.',
        },
        requirements: [
          { en: 'Square every component before adding — signs disappear at that step, not before.', id: 'Kuadratkan setiap komponen sebelum menjumlahkan — tandanya lenyap pada langkah itu, bukan sebelumnya.' },
          { en: 'The last part asks for a positive scalar.', id: 'Butir terakhir meminta skalar yang positif.' },
        ],
        tasks: [
          {
            prompt: { en: 'Find $|(-6, 8)|$.', id: 'Tentukan $|(-6, 8)|$.' },
            blanks: [{ answer: 10 }],
            solution: ['|(-6, 8)| = \\sqrt{36 + 64} = \\sqrt{100} = 10'],
          },
          {
            prompt: {
              en: 'Find the distance between $A(2, 1, -1)$ and $B(5, 5, 11)$.',
              id: 'Tentukan jarak antara $A(2, 1, -1)$ dan $B(5, 5, 11)$.',
            },
            blanks: [{ label: 'd =', answer: 13 }],
            solution: [
              '\\vec{AB} = (3,\\ 4,\\ 12)',
              'd = \\sqrt{9 + 16 + 144} = \\sqrt{169} = 13',
            ],
          },
          {
            prompt: {
              en: 'Let $\\vec{a} = (1, 2, 2)$. Find the positive scalar $k$ for which $|k\\vec{a}| = 12$.',
              id: 'Misalkan $\\vec{a} = (1, 2, 2)$. Tentukan skalar positif $k$ yang memenuhi $|k\\vec{a}| = 12$.',
            },
            blanks: [{ label: 'k =', answer: 4 }],
            solution: [
              '|\\vec{a}| = \\sqrt{1 + 4 + 4} = 3',
              '|k\\vec{a}| = |k|\\,|\\vec{a}| = 3k = 12',
              'k = 4',
            ],
          },
        ],
        hints: [
          { en: 'For part 3, find $|\\vec{a}|$ first, then use $|k\\vec{a}| = |k|\\,|\\vec{a}|$.', id: 'Untuk butir 3, cari $|\\vec{a}|$ dulu, lalu pakai $|k\\vec{a}| = |k|\\,|\\vec{a}|$.' },
          { en: '$|\\vec{a}| = 3$, so you need $3k = 12$.', id: '$|\\vec{a}| = 3$, jadi yang dicari memenuhi $3k = 12$.' },
        ],
        xp: 50,
      },
    },

    /* -------------------------------------------------- 2.2 unit vectors & direction */
    {
      id: 'vek-m2-s2',
      title: { en: 'Unit Vectors and Direction', id: 'Vektor Satuan dan Arah' },
      summary: {
        en: 'Strip a vector down to its direction alone, then rebuild it at any length you like.',
        id: 'Menyaring vektor sampai tinggal arahnya saja, lalu menyusunnya kembali dengan panjang sesuka hati.',
      },
      lessons: [
        {
          id: 'vek-m2-s2-l1',
          title: { en: 'Normalising a Vector', id: 'Menormalkan Vektor' },
          goal: {
            en: 'Turn any non-zero vector into a unit vector pointing the same way.',
            id: 'Mengubah sebarang vektor tak nol menjadi vektor satuan yang searah dengannya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Divide by your own length', id: 'Bagi dengan panjangmu sendiri' },
              body: {
                en: 'A **unit vector** is a vector of length 1. Every non-zero $\\vec{a}$ has one pointing in exactly its direction, found by dividing the vector by its own magnitude:\n$$\\hat{a} = \\frac{\\vec{a}}{|\\vec{a}|}$$\nThe check is immediate: $|\\hat{a}| = \\frac{1}{|\\vec{a}|}|\\vec{a}| = 1$. The process is called **normalising**, and it is how "which way" is separated from "how far".\n\nOnly $\\vec{0}$ has no unit vector — it has no direction to keep.',
                id: '**Vektor satuan** adalah vektor yang panjangnya 1. Setiap $\\vec{a}$ tak nol punya satu vektor satuan yang arahnya persis sama, diperoleh dengan membagi vektornya dengan besarnya sendiri:\n$$\\hat{a} = \\frac{\\vec{a}}{|\\vec{a}|}$$\nPemeriksaannya langsung: $|\\hat{a}| = \\frac{1}{|\\vec{a}|}|\\vec{a}| = 1$. Prosesnya disebut **normalisasi**, dan inilah cara memisahkan "ke mana arahnya" dari "seberapa jauh".\n\nHanya $\\vec{0}$ yang tak punya vektor satuan — ia tak punya arah untuk dipertahankan.',
              },
              figure: {
                dim: 2,
                range: 5,
                interactive: true,
                vars: { a: [3, -4] },
                items: [
                  { t: 'vec', to: { of: 'a' }, label: 'a', color: 'a', drag: 'a' },
                  { t: 'vec', to: { unit: { of: 'a' } }, label: 'â', color: 'result' },
                ],
                readouts: [
                  { label: '|a| =', n: { norm: { of: 'a' } } },
                  { label: 'â =', v: { unit: { of: 'a' } } },
                  { label: '|â| =', n: { norm: { unit: { of: 'a' } } } },
                ],
                caption: {
                  en: 'Drag $\\vec{a}$ anywhere you like. The short green arrow follows it exactly in direction, and its length stays at 1 no matter what — that is the whole of normalising.',
                  id: 'Seret $\\vec{a}$ ke mana pun. Anak panah hijau pendek mengikuti arahnya persis, dan panjangnya tetap 1 apa pun yang terjadi — itulah seluruh isi normalisasi.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which of these is a unit vector?',
                id: 'Manakah di antara berikut yang merupakan vektor satuan?',
              },
              options: [
                { en: '$(1, 1, 1)$', id: '$(1, 1, 1)$' },
                { en: '$(0, 0, 0)$', id: '$(0, 0, 0)$' },
                { en: '$\\left(\\tfrac{1}{2}, \\tfrac{1}{2}, \\tfrac{1}{2}\\right)$', id: '$\\left(\\tfrac{1}{2}, \\tfrac{1}{2}, \\tfrac{1}{2}\\right)$' },
                { en: '$(0, -1, 0)$', id: '$(0, -1, 0)$' },
              ],
              answer: 3,
              explain: {
                en: '$|(0, -1, 0)| = \\sqrt{0 + 1 + 0} = 1$. The first has length $\\sqrt{3}$, the third has length $\\sqrt{3}/2$, and the zero vector has length 0.',
                id: '$|(0, -1, 0)| = \\sqrt{0 + 1 + 0} = 1$. Yang pertama panjangnya $\\sqrt{3}$, yang ketiga panjangnya $\\sqrt{3}/2$, dan vektor nol panjangnya 0.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the unit vector of $\\vec{a} = (3, -4)$, which has $|\\vec{a}| = 5$.',
                id: 'Lengkapi vektor satuan dari $\\vec{a} = (3, -4)$, yang $|\\vec{a}| = 5$.',
              },
              template: '\\hat{a} = \\tfrac{1}{5}(3, -4) = (___,\\ ___)',
              blanks: ['0.6', '-0.8'],
              explain: {
                en: '$3/5 = 0.6$ and $-4/5 = -0.8$. As a check, $0.6^2 + 0.8^2 = 0.36 + 0.64 = 1$.',
                id: '$3/5 = 0{,}6$ dan $-4/5 = -0{,}8$. Sebagai pemeriksaan, $0{,}6^2 + 0{,}8^2 = 0{,}36 + 0{,}64 = 1$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              inline: true,
              prompt: {
                en: 'Find the unit vector in the direction of $\\vec{a} = (2, -3, 6)$.',
                id: 'Tentukan vektor satuan yang searah dengan $\\vec{a} = (2, -3, 6)$.',
              },
              given: '\\hat{a} = (\\,?\\,,\\ ?\\,,\\ ?\\,)',
              blanks: [{ answer: 2 / 7 }, { answer: -3 / 7 }, { answer: 6 / 7 }],
              hints: [
                { en: 'You already found $|(2, -3, 6)| = 7$ in the previous submodule.', id: 'Kamu sudah menemukan $|(2, -3, 6)| = 7$ pada submateri sebelumnya.' },
                { en: 'Divide each component by 7. Fractions such as `2/7` are read directly.', id: 'Bagi setiap komponen dengan 7. Pecahan seperti `2/7` terbaca langsung.' },
              ],
              solution: [
                '|\\vec{a}| = \\sqrt{4 + 9 + 36} = 7',
                '\\hat{a} = \\tfrac{1}{7}(2, -3, 6) = \\left(\\tfrac{2}{7}, -\\tfrac{3}{7}, \\tfrac{6}{7}\\right)',
              ],
              explain: {
                en: 'Dividing by 7 leaves the direction untouched and the length equal to 1. Notice the signs survive: normalising never flips a vector.',
                id: 'Membagi dengan 7 tidak menyentuh arahnya dan membuat panjangnya menjadi 1. Perhatikan tandanya tetap: normalisasi tak pernah membalik vektor.',
              },
            },
          ],
        },
        {
          id: 'vek-m2-s2-l2',
          title: { en: 'Building a Vector to Order', id: 'Menyusun Vektor Sesuai Pesanan' },
          goal: {
            en: 'Produce a vector of a given length in a given direction, and read off its direction cosines.',
            id: 'Menghasilkan vektor dengan panjang tertentu ke arah tertentu, dan membaca cosinus arahnya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Length times direction', id: 'Panjang kali arah' },
              body: {
                en: 'Normalising throws the length away. Multiplying by a new one puts a different length back:\n$$\\vec{v} = L\\,\\hat{a} = \\frac{L}{|\\vec{a}|}\\,\\vec{a}$$\nis the vector of length $L$ in the direction of $\\vec{a}$. Read the other way, every vector is its own length times its own direction, $\\vec{a} = |\\vec{a}|\\,\\hat{a}$ — which is the whole point of separating the two.',
                id: 'Normalisasi membuang panjangnya. Mengalikan dengan panjang baru mengembalikan panjang yang berbeda:\n$$\\vec{v} = L\\,\\hat{a} = \\frac{L}{|\\vec{a}|}\\,\\vec{a}$$\nadalah vektor sepanjang $L$ yang searah dengan $\\vec{a}$. Dibaca sebaliknya, setiap vektor adalah panjangnya sendiri dikali arahnya sendiri, $\\vec{a} = |\\vec{a}|\\,\\hat{a}$ — dan justru itulah gunanya memisahkan keduanya.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Direction cosines', id: 'Cosinus arah' },
              body: {
                en: 'Let $\\alpha, \\beta, \\gamma$ be the angles $\\vec{a}$ makes with the positive $x$, $y$ and $z$ axes. Then\n$$\\cos\\alpha = \\frac{a_1}{|\\vec{a}|}, \\qquad \\cos\\beta = \\frac{a_2}{|\\vec{a}|}, \\qquad \\cos\\gamma = \\frac{a_3}{|\\vec{a}|}$$\nThese three numbers are the **direction cosines**, and they are nothing other than the components of $\\hat{a}$. That gives the identity\n$$\\cos^2\\alpha + \\cos^2\\beta + \\cos^2\\gamma = 1$$\nwhich is just $|\\hat{a}| = 1$ written out.',
                id: 'Misalkan $\\alpha, \\beta, \\gamma$ adalah sudut yang dibentuk $\\vec{a}$ dengan sumbu $x$, $y$, dan $z$ positif. Maka\n$$\\cos\\alpha = \\frac{a_1}{|\\vec{a}|}, \\qquad \\cos\\beta = \\frac{a_2}{|\\vec{a}|}, \\qquad \\cos\\gamma = \\frac{a_3}{|\\vec{a}|}$$\nKetiga bilangan ini disebut **cosinus arah**, dan tak lain adalah komponen $\\hat{a}$. Dari situ diperoleh identitas\n$$\\cos^2\\alpha + \\cos^2\\beta + \\cos^2\\gamma = 1$$\nyang sebenarnya hanyalah $|\\hat{a}| = 1$ yang dituliskan lengkap.',
              },
              figure: {
                dim: 3,
                range: 3,
                interactive: true,
                view: [34, 22],
                items: [
                  { t: 'vec', to: [1, 2, 2], label: 'a', color: 'a' },
                  { t: 'vec', to: [3, 0, 0], color: 'muted', dashed: true },
                  { t: 'vec', to: [0, 3, 0], color: 'muted', dashed: true },
                  { t: 'vec', to: [0, 0, 3], color: 'muted', dashed: true },
                  { t: 'angle', from: [3, 0, 0], to: [1, 2, 2], label: 'α' },
                  { t: 'angle', from: [0, 3, 0], to: [1, 2, 2], label: 'β' },
                  { t: 'angle', from: [0, 0, 3], to: [1, 2, 2], label: 'γ' },
                ],
                readouts: [
                  { label: 'α =', n: { angle: [[3, 0, 0], [1, 2, 2]] } },
                  { label: 'β =', n: { angle: [[0, 3, 0], [1, 2, 2]] } },
                  { label: 'γ =', n: { angle: [[0, 0, 3], [1, 2, 2]] } },
                ],
                caption: {
                  en: 'The three angles $\\vec{a} = (1, 2, 2)$ makes with the axes. Turn the scene until each arc is face on — their cosines are $\\tfrac{1}{3}$, $\\tfrac{2}{3}$ and $\\tfrac{2}{3}$, the components of $\\hat{a}$.',
                  id: 'Ketiga sudut yang dibentuk $\\vec{a} = (1, 2, 2)$ dengan sumbu-sumbunya. Putar gambarnya sampai tiap busur terlihat dari depan — cosinusnya $\\tfrac{1}{3}$, $\\tfrac{2}{3}$, dan $\\tfrac{2}{3}$, yaitu komponen $\\hat{a}$.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A vector has direction cosines $\\cos\\alpha = 0.6$ and $\\cos\\beta = 0.8$ in the plane. What is $\\cos^2\\alpha + \\cos^2\\beta$?',
                id: 'Sebuah vektor di bidang mempunyai cosinus arah $\\cos\\alpha = 0{,}6$ dan $\\cos\\beta = 0{,}8$. Berapakah $\\cos^2\\alpha + \\cos^2\\beta$?',
              },
              options: [
                { en: '$1.4$', id: '$1{,}4$' },
                { en: '$1$', id: '$1$' },
                { en: '$0.48$', id: '$0{,}48$' },
                { en: 'It depends on the length of the vector.', id: 'Tergantung panjang vektornya.' },
              ],
              answer: 1,
              explain: {
                en: '$0.36 + 0.64 = 1$, and it always will: the direction cosines are the components of a unit vector, so their squares add to 1 whatever the original length was.',
                id: '$0{,}36 + 0{,}64 = 1$, dan akan selalu begitu: cosinus arah adalah komponen sebuah vektor satuan, jadi jumlah kuadratnya 1 berapa pun panjang vektor aslinya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              inline: true,
              prompt: {
                en: 'Find the vector of length 15 in the direction of $\\vec{a} = (2, -3, 6)$.',
                id: 'Tentukan vektor sepanjang 15 yang searah dengan $\\vec{a} = (2, -3, 6)$.',
              },
              blanks: [{ answer: 30 / 7 }, { answer: -45 / 7 }, { answer: 90 / 7 }],
              hints: [
                { en: '$|\\vec{a}| = 7$, so the scale factor is $15/7$.', id: '$|\\vec{a}| = 7$, jadi faktor pengalinya $15/7$.' },
                { en: 'Multiply each component by $15/7$. Type `30/7` if you prefer the fraction.', id: 'Kalikan setiap komponen dengan $15/7$. Ketik `30/7` bila lebih suka bentuk pecahan.' },
              ],
              solution: [
                '\\hat{a} = \\tfrac{1}{7}(2, -3, 6)',
                '\\vec{v} = 15\\hat{a} = \\tfrac{15}{7}(2, -3, 6) = \\left(\\tfrac{30}{7}, -\\tfrac{45}{7}, \\tfrac{90}{7}\\right)',
              ],
              explain: {
                en: 'Normalise, then scale — or do both at once with the factor $15/7$. As a check, $|\\vec{v}| = \\frac{15}{7} \\cdot 7 = 15$.',
                id: 'Normalkan, lalu kalikan — atau lakukan sekaligus dengan faktor $15/7$. Sebagai pemeriksaan, $|\\vec{v}| = \\frac{15}{7} \\cdot 7 = 15$.',
              },
            },
            {
              kind: 'math',
              id: 'm2',
              prompt: {
                en: 'Find the direction cosines of $\\vec{a} = (1, 2, 2)$.',
                id: 'Tentukan cosinus arah dari $\\vec{a} = (1, 2, 2)$.',
              },
              blanks: [
                { label: '\\cos\\alpha =', answer: 1 / 3 },
                { label: '\\cos\\beta =', answer: 2 / 3 },
                { label: '\\cos\\gamma =', answer: 2 / 3 },
              ],
              hints: [{ en: '$|\\vec{a}| = 3$. Divide each component by it.', id: '$|\\vec{a}| = 3$. Bagi setiap komponen dengannya.' }],
              solution: [
                '|\\vec{a}| = \\sqrt{1 + 4 + 4} = 3',
                '\\cos\\alpha = \\tfrac{1}{3}, \\quad \\cos\\beta = \\tfrac{2}{3}, \\quad \\cos\\gamma = \\tfrac{2}{3}',
                '\\text{periksa: } \\tfrac{1}{9} + \\tfrac{4}{9} + \\tfrac{4}{9} = 1 \\quad \\checkmark',
              ],
              explain: {
                en: 'The direction cosines are exactly the components of $\\hat{a}$, and $\\frac{1}{9} + \\frac{4}{9} + \\frac{4}{9} = 1$ confirms it.',
                id: 'Cosinus arahnya persis komponen $\\hat{a}$, dan $\\frac{1}{9} + \\frac{4}{9} + \\frac{4}{9} = 1$ membenarkannya.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'vek-m2-s2-p',
        runtime: 'math',
        title: { en: 'Direction and Unit', id: 'Arah dan Satuan' },
        brief: {
          en: 'Normalise, rebuild at a chosen length, and read a direction cosine straight off a component.',
          id: 'Menormalkan, menyusun ulang dengan panjang pilihan, dan membaca cosinus arah langsung dari komponennya.',
        },
        requirements: [
          { en: 'Find the magnitude before anything else — every part needs it.', id: 'Cari besarnya lebih dahulu — semua butir memerlukannya.' },
          { en: 'Fractions are accepted, so `-20/3` need not be turned into a decimal.', id: 'Pecahan diterima, jadi `-20/3` tak perlu diubah menjadi desimal.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Find the unit vector in the direction of $(-8, 6)$.',
              id: 'Tentukan vektor satuan yang searah dengan $(-8, 6)$.',
            },
            inline: true,
            blanks: [{ answer: -0.8 }, { answer: 0.6 }],
            solution: [
              '|(-8, 6)| = \\sqrt{64 + 36} = 10',
              '\\hat{a} = \\tfrac{1}{10}(-8, 6) = (-0{,}8,\\ 0{,}6)',
            ],
          },
          {
            prompt: {
              en: 'Find the vector of length 10 in the direction of $(1, -2, 2)$.',
              id: 'Tentukan vektor sepanjang 10 yang searah dengan $(1, -2, 2)$.',
            },
            inline: true,
            blanks: [{ answer: 10 / 3 }, { answer: -20 / 3 }, { answer: 20 / 3 }],
            solution: [
              '|(1, -2, 2)| = \\sqrt{1 + 4 + 4} = 3',
              '\\vec{v} = \\tfrac{10}{3}(1, -2, 2) = \\left(\\tfrac{10}{3}, -\\tfrac{20}{3}, \\tfrac{20}{3}\\right)',
            ],
          },
          {
            prompt: {
              en: 'For $\\vec{a} = (4, 0, -3)$, find $\\cos\\alpha$ and $\\cos\\gamma$.',
              id: 'Untuk $\\vec{a} = (4, 0, -3)$, tentukan $\\cos\\alpha$ dan $\\cos\\gamma$.',
            },
            blanks: [
              { label: '\\cos\\alpha =', answer: 0.8 },
              { label: '\\cos\\gamma =', answer: -0.6 },
            ],
            solution: [
              '|\\vec{a}| = \\sqrt{16 + 0 + 9} = 5',
              '\\cos\\alpha = \\tfrac{4}{5} = 0{,}8, \\qquad \\cos\\gamma = \\tfrac{-3}{5} = -0{,}6',
            ],
          },
        ],
        hints: [
          {
            en: 'A negative component gives a negative direction cosine — the angle with that axis is obtuse.',
            id: 'Komponen negatif memberi cosinus arah yang negatif — sudutnya terhadap sumbu itu tumpul.',
          },
          {
            en: 'In part 3 the middle component is 0, so $\\cos\\beta = 0$: the vector is perpendicular to the $y$ axis.',
            id: 'Pada butir 3 komponen tengahnya 0, jadi $\\cos\\beta = 0$: vektornya tegak lurus sumbu $y$.',
          },
        ],
        xp: 50,
      },
    },
  ],
}
