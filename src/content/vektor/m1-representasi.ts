import type { Module } from '../types'

/** Module 1 — what a vector is, how it is written down, and the algebra that
 *  comes with it. Everything later in the course is this module plus a
 *  product, so the components have to become automatic here. */
export const module1: Module = {
  id: 'vek-m1',
  title: { en: 'Vectors and How They Are Written', id: 'Vektor dan Cara Menuliskannya' },
  summary: {
    en: 'Directed quantities, their components in the plane and in space, and the algebra of adding and scaling them.',
    id: 'Besaran berarah, komponennya di bidang dan di ruang, serta aljabar penjumlahan dan perkalian skalarnya.',
  },
  submodules: [
    /* ------------------------------------------------ 1.1 directed quantities */
    {
      id: 'vek-m1-s1',
      title: { en: 'Directed Quantities', id: 'Besaran Berarah' },
      summary: {
        en: 'Tell a vector from a scalar, read its components, and build one from two points.',
        id: 'Membedakan vektor dari skalar, membaca komponennya, dan menyusunnya dari dua titik.',
      },
      lessons: [
        {
          id: 'vek-m1-s1-l1',
          title: { en: 'Scalars and Vectors', id: 'Skalar dan Vektor' },
          goal: {
            en: 'Say what makes a quantity a vector, and read the notation for one.',
            id: 'Menyebut apa yang membuat suatu besaran disebut vektor, dan membaca notasinya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Two kinds of quantity', id: 'Dua jenis besaran' },
              body: {
                en: 'A **scalar** is finished once you have said how much: a mass of 5 kg, a temperature of 27 °C, a length of 3 m. A **vector** is not finished until you have also said which way: a displacement of 3 m **to the east**, a force of 5 N **downwards**.\n\nSo a vector carries two things at once — a **magnitude** (a non-negative number) and a **direction**. Two vectors are the same vector when both agree; where they happen to be drawn does not matter.',
                id: 'Sebuah **skalar** sudah lengkap begitu kamu menyebut seberapa banyak: massa 5 kg, suhu 27 °C, panjang 3 m. Sebuah **vektor** belum lengkap sebelum kamu juga menyebut ke mana arahnya: perpindahan 3 m **ke timur**, gaya 5 N **ke bawah**.\n\nJadi vektor membawa dua hal sekaligus — **besar** (bilangan tak negatif) dan **arah**. Dua vektor adalah vektor yang sama bila keduanya cocok; di mana ia kebetulan digambar tidak menjadi soal.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Writing one down', id: 'Menuliskannya' },
              body: {
                en: 'A vector is drawn as a **directed line segment** — an arrow. The arrow from a point $A$ to a point $B$ is written $\\vec{AB}$; $A$ is its **initial point** and $B$ its **terminal point**. A vector with no particular endpoints named is written with a single letter, $\\vec{a}$ (in print, often bold: $\\mathbf{a}$).\n\nIts magnitude is written between bars, $|\\vec{a}|$, and is a scalar. Two vectors deserve their own names: the **zero vector** $\\vec{0}$, with magnitude 0 and no direction, and the **negative** $-\\vec{a}$, which has the same magnitude as $\\vec{a}$ and points the opposite way.',
                id: 'Vektor digambar sebagai **ruas garis berarah** — sebuah anak panah. Anak panah dari titik $A$ ke titik $B$ ditulis $\\vec{AB}$; $A$ disebut **titik pangkal** dan $B$ **titik ujung**. Vektor yang tidak menyebut ujung-ujungnya ditulis dengan satu huruf, $\\vec{a}$ (dalam cetakan sering dicetak tebal: $\\mathbf{a}$).\n\nBesarnya ditulis di antara dua garis, $|\\vec{a}|$, dan berupa skalar. Dua vektor punya nama khusus: **vektor nol** $\\vec{0}$, yang besarnya 0 dan tak punya arah, serta **negatifnya** $-\\vec{a}$, yang besarnya sama dengan $\\vec{a}$ tetapi arahnya berlawanan.',
              },
              figure: {
                dim: 2,
                range: 5,
                items: [
                  { t: 'point', at: [-4, -2], label: 'A' },
                  { t: 'point', at: [-1, 1], label: 'B' },
                  { t: 'vec', from: [-4, -2], to: [-1, 1], label: 'AB', color: 'a' },
                  { t: 'vec', from: [1, -2], to: [4, 1], label: 'a', color: 'a' },
                  { t: 'vec', from: [4, -3], to: [1, -3], label: '-a', color: 'b' },
                ],
                caption: {
                  en: 'The same vector twice: an arrow named by its endpoints, and the identical arrow slid to the right and named $\\vec{a}$. Both are 3 across and 3 up, so both are the same vector. Below it, $-\\vec{a}$ — the same length, the other way.',
                  id: 'Vektor yang sama, dua kali: satu anak panah dinamai lewat ujung-ujungnya, dan anak panah yang persis sama digeser ke kanan lalu dinamai $\\vec{a}$. Keduanya 3 ke kanan dan 3 ke atas, jadi keduanya vektor yang sama. Di bawahnya $-\\vec{a}$ — sama panjang, arah sebaliknya.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which of these is a **vector** quantity?',
                id: 'Manakah yang merupakan besaran **vektor**?',
              },
              options: [
                { en: 'The speed of a car: 60 km/h', id: 'Kelajuan mobil: 60 km/jam' },
                { en: 'The velocity of a car: 60 km/h due north', id: 'Kecepatan mobil: 60 km/jam ke arah utara' },
                { en: 'The mass of a car: 1200 kg', id: 'Massa mobil: 1200 kg' },
                { en: 'The price of a car', id: 'Harga mobil' },
              ],
              answer: 1,
              explain: {
                en: 'Only the second one names a direction. Speed is the magnitude of velocity — the scalar left over once the direction is thrown away.',
                id: 'Hanya yang kedua menyebut arah. Kelajuan adalah besar dari kecepatan — skalar yang tersisa setelah arahnya dibuang.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Two arrows are drawn in different places on the page. Both are 4 cm long and both point 30° above the horizontal. What is true?',
                id: 'Dua anak panah digambar di tempat berbeda pada halaman. Keduanya panjang 4 cm dan sama-sama mengarah 30° di atas garis mendatar. Manakah yang benar?',
              },
              options: [
                { en: 'They are different vectors, because they start at different points.', id: 'Keduanya vektor yang berbeda, karena pangkalnya berbeda.' },
                { en: 'They are the same vector.', id: 'Keduanya vektor yang sama.' },
                { en: 'One is the negative of the other.', id: 'Yang satu adalah negatif dari yang lain.' },
                { en: 'Nothing can be said without knowing the coordinates.', id: 'Tak bisa disimpulkan tanpa mengetahui koordinatnya.' },
              ],
              answer: 1,
              explain: {
                en: 'Magnitude and direction agree, so they are the same vector. This is what "free vector" means: an arrow may be slid anywhere as long as its length and direction are kept.',
                id: 'Besar dan arahnya cocok, jadi keduanya vektor yang sama. Inilah makna "vektor bebas": anak panah boleh digeser ke mana saja asalkan panjang dan arahnya dijaga.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'A vector $\\vec{a}$ has magnitude 7. Fill in each magnitude below.',
                id: 'Sebuah vektor $\\vec{a}$ besarnya 7. Isikan setiap besar di bawah ini.',
              },
              blanks: [
                { label: '|-\\vec{a}| =', answer: 7 },
                { label: '|\\vec{0}| =', answer: 0 },
              ],
              hints: [
                {
                  en: 'The negative of a vector turns it around. Turning something around does not make it shorter.',
                  id: 'Negatif sebuah vektor membalik arahnya. Membalik arah tidak membuatnya lebih pendek.',
                },
              ],
              explain: {
                en: '$-\\vec{a}$ has the same length as $\\vec{a}$, only the opposite direction, so $|-\\vec{a}| = |\\vec{a}| = 7$. The zero vector is the one vector with magnitude 0.',
                id: '$-\\vec{a}$ panjangnya sama dengan $\\vec{a}$, hanya arahnya berlawanan, jadi $|-\\vec{a}| = |\\vec{a}| = 7$. Vektor nol adalah satu-satunya vektor yang besarnya 0.',
              },
            },
          ],
        },
        {
          id: 'vek-m1-s1-l2',
          title: { en: 'Components and Position Vectors', id: 'Komponen dan Vektor Posisi' },
          goal: {
            en: 'Write a vector as an ordered list of numbers, and build one from two points.',
            id: 'Menulis vektor sebagai deretan bilangan terurut, dan menyusunnya dari dua titik.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Components', id: 'Komponen' },
              body: {
                en: 'Slide a vector so that its initial point sits on the origin. Its terminal point is then one particular point, and the coordinates of that point are the **components** of the vector:\n$$\\vec{a} = (a_1, a_2) \\text{ di } R^2, \\qquad \\vec{a} = (a_1, a_2, a_3) \\text{ di } R^3$$\nA vector drawn from the origin to a point $P$ is called the **position vector** of $P$, and its components are simply the coordinates of $P$. Two vectors are equal exactly when every matching component is equal.',
                id: 'Geser sebuah vektor sampai titik pangkalnya berada di titik asal. Titik ujungnya kini menjadi satu titik tertentu, dan koordinat titik itulah **komponen** vektornya:\n$$\\vec{a} = (a_1, a_2) \\text{ di } R^2, \\qquad \\vec{a} = (a_1, a_2, a_3) \\text{ di } R^3$$\nVektor yang digambar dari titik asal ke sebuah titik $P$ disebut **vektor posisi** dari $P$, dan komponennya persis koordinat $P$. Dua vektor sama tepat ketika setiap komponen yang bersesuaian sama.',
              },
              figure: {
                dim: 2,
                range: 5,
                interactive: true,
                vars: { a: [3, 2] },
                items: [
                  // The two components, as the legs of the right triangle they are.
                  { t: 'seg', from: [0, 0], to: { proj: [{ of: 'a' }, [1, 0]] }, color: 'muted', dashed: true },
                  { t: 'seg', from: { proj: [{ of: 'a' }, [1, 0]] }, to: { of: 'a' }, color: 'muted', dashed: true },
                  { t: 'vec', to: { of: 'a' }, label: 'a', color: 'a', drag: 'a' },
                ],
                readouts: [
                  { label: 'a =', v: { of: 'a' }, dp: 1 },
                  { label: '|a| =', n: { norm: { of: 'a' } } },
                ],
                caption: {
                  en: 'Drag the head. The two numbers under the drawing are the components — how far across, then how far up — and they are also the coordinates of the point the arrow reaches.',
                  id: 'Seret ujungnya. Dua bilangan di bawah gambar adalah komponennya — sejauh apa ke kanan, lalu sejauh apa ke atas — dan itu juga koordinat titik yang dicapai anak panahnya.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'From two points to a vector', id: 'Dari dua titik menjadi vektor' },
              body: {
                en: 'Given $A(a_1, a_2, a_3)$ and $B(b_1, b_2, b_3)$, the arrow from $A$ to $B$ is the position vector of $B$ minus the position vector of $A$:\n$$\\vec{AB} = (b_1 - a_1,\\ b_2 - a_2,\\ b_3 - a_3)$$\nIt is worth reading that as **terminal minus initial** — writing it the other way round is the single most common slip in this whole course, and it gives you $\\vec{BA}$ instead.',
                id: 'Diberikan $A(a_1, a_2, a_3)$ dan $B(b_1, b_2, b_3)$, anak panah dari $A$ ke $B$ adalah vektor posisi $B$ dikurangi vektor posisi $A$:\n$$\\vec{AB} = (b_1 - a_1,\\ b_2 - a_2,\\ b_3 - a_3)$$\nBacalah itu sebagai **ujung dikurangi pangkal** — menuliskannya terbalik adalah kekeliruan yang paling sering terjadi di sepanjang kursus ini, dan hasilnya adalah $\\vec{BA}$, bukan $\\vec{AB}$.',
              },
              figure: {
                dim: 2,
                range: 5,
                interactive: true,
                vars: { A: [-2, 1], B: [3, 3] },
                items: [
                  { t: 'vec', to: { of: 'A' }, label: 'OA', color: 'a', dashed: true, drag: 'A' },
                  { t: 'vec', to: { of: 'B' }, label: 'OB', color: 'b', dashed: true, drag: 'B' },
                  { t: 'vec', from: { of: 'A' }, to: { of: 'B' }, label: 'AB', color: 'result' },
                ],
                readouts: [
                  { label: 'A', v: { of: 'A' }, dp: 1 },
                  { label: 'B', v: { of: 'B' }, dp: 1 },
                  { label: 'AB = B - A =', v: { diff: [{ of: 'B' }, { of: 'A' }] }, dp: 1 },
                ],
                caption: {
                  en: 'Move either point. The green arrow always runs from $A$ to $B$, and the numbers under it are always $B$ minus $A$ — swap the points and every sign flips.',
                  id: 'Pindahkan salah satu titiknya. Anak panah hijau selalu berjalan dari $A$ ke $B$, dan bilangan di bawahnya selalu $B$ dikurangi $A$ — tukar titiknya dan semua tandanya berbalik.',
                },
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'With $A(2, -1)$ and $B(5, 3)$, complete the components of $\\vec{AB}$.',
                id: 'Dengan $A(2, -1)$ dan $B(5, 3)$, lengkapi komponen $\\vec{AB}$.',
              },
              template: '\\vec{AB} = (5 - 2,\\ 3 - (-1)) = (___,\\ ___)',
              blanks: ['3', '4'],
              explain: {
                en: 'Terminal minus initial in each slot: $5 - 2 = 3$ and $3 - (-1) = 4$. Subtracting a negative adds.',
                id: 'Ujung dikurangi pangkal pada tiap slot: $5 - 2 = 3$ dan $3 - (-1) = 4$. Mengurangi bilangan negatif berarti menambah.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'The point $P$ has position vector $(4, -2, 7)$. What are the coordinates of $P$?',
                id: 'Titik $P$ mempunyai vektor posisi $(4, -2, 7)$. Berapa koordinat $P$?',
              },
              options: [
                { en: '$(-4, 2, -7)$', id: '$(-4, 2, -7)$' },
                { en: '$(4, -2, 7)$', id: '$(4, -2, 7)$' },
                { en: '$(7, -2, 4)$', id: '$(7, -2, 4)$' },
                { en: 'It cannot be decided from the position vector alone.', id: 'Tidak dapat ditentukan hanya dari vektor posisinya.' },
              ],
              answer: 1,
              explain: {
                en: 'A position vector starts at the origin, so its components and the coordinates of its terminal point are the same three numbers.',
                id: 'Vektor posisi berpangkal di titik asal, jadi komponennya dan koordinat titik ujungnya adalah tiga bilangan yang sama.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              inline: true,
              prompt: {
                en: 'Given $A(2, -1, 4)$ and $B(5, 3, -2)$, find the components of $\\vec{AB}$.',
                id: 'Diberikan $A(2, -1, 4)$ dan $B(5, 3, -2)$, tentukan komponen $\\vec{AB}$.',
              },
              given: '\\vec{AB} = (\\,?\\,,\\ ?\\,,\\ ?\\,)',
              blanks: [{ answer: 3 }, { answer: 4 }, { answer: -6 }],
              hints: [
                { en: 'Terminal minus initial, one coordinate at a time.', id: 'Ujung dikurangi pangkal, satu koordinat setiap kali.' },
                { en: 'The third slot is $-2 - 4$, and both signs matter.', id: 'Slot ketiga adalah $-2 - 4$, dan kedua tandanya berpengaruh.' },
              ],
              solution: [
                '\\vec{AB} = (5 - 2,\\ 3 - (-1),\\ -2 - 4)',
                '\\vec{AB} = (3,\\ 4,\\ -6)',
              ],
              explain: {
                en: 'Subtracting $A$ from $B$ coordinate by coordinate gives $(3, 4, -6)$. Had you subtracted the other way you would have found $\\vec{BA} = (-3, -4, 6)$.',
                id: 'Mengurangkan $A$ dari $B$ koordinat demi koordinat memberi $(3, 4, -6)$. Kalau dikurangkan terbalik, yang didapat adalah $\\vec{BA} = (-3, -4, 6)$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'vek-m1-s1-p',
        runtime: 'math',
        title: { en: 'From Points to Vectors', id: 'Dari Titik Menjadi Vektor' },
        brief: {
          en: 'Three short problems on components, position vectors, and reading the definition backwards.',
          id: 'Tiga soal singkat tentang komponen, vektor posisi, dan membaca definisinya secara terbalik.',
        },
        requirements: [
          { en: 'Every box has to be right before a part counts as answered.', id: 'Setiap kotak harus benar sebelum satu butir dihitung terjawab.' },
          { en: 'Work with exact numbers — none of these need a calculator.', id: 'Kerjakan dengan bilangan eksak — tak satu pun butir ini butuh kalkulator.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Given $P(-3, 5)$ and $Q(4, -1)$, find $\\vec{PQ}$.',
              id: 'Diberikan $P(-3, 5)$ dan $Q(4, -1)$, tentukan $\\vec{PQ}$.',
            },
            inline: true,
            blanks: [{ answer: 7 }, { answer: -6 }],
            solution: ['\\vec{PQ} = (4 - (-3),\\ -1 - 5) = (7,\\ -6)'],
          },
          {
            prompt: {
              en: 'Given $A(1, 2, 3)$ and $B(1, 2, 3)$, find $\\vec{AB}$.',
              id: 'Diberikan $A(1, 2, 3)$ dan $B(1, 2, 3)$, tentukan $\\vec{AB}$.',
            },
            inline: true,
            blanks: [{ answer: 0 }, { answer: 0 }, { answer: 0 }],
            solution: [
              '\\vec{AB} = (1 - 1,\\ 2 - 2,\\ 3 - 3) = (0,\\ 0,\\ 0) = \\vec{0}',
            ],
          },
          {
            prompt: {
              en: 'A vector $\\vec{AB} = (2, -5)$ starts at $A(3, 1)$. Where is $B$?',
              id: 'Sebuah vektor $\\vec{AB} = (2, -5)$ berpangkal di $A(3, 1)$. Di mana letak $B$?',
            },
            inline: true,
            blanks: [
              { label: 'B(', answer: 5 },
              { label: ',', answer: -4, after: ')' },
            ],
            solution: [
              '\\vec{AB} = B - A \\Rightarrow B = A + \\vec{AB}',
              'B = (3 + 2,\\ 1 + (-5)) = (5,\\ -4)',
            ],
          },
        ],
        hints: [
          {
            en: 'Parts 1 and 2 are the definition read forwards; part 3 is the same definition rearranged.',
            id: 'Butir 1 dan 2 adalah definisinya dibaca maju; butir 3 adalah definisi yang sama disusun ulang.',
          },
          {
            en: 'For part 3: if $\\vec{AB} = B - A$, then $B = A + \\vec{AB}$.',
            id: 'Untuk butir 3: jika $\\vec{AB} = B - A$, maka $B = A + \\vec{AB}$.',
          },
        ],
        xp: 50,
      },
    },

    /* --------------------------------------------------- 1.2 vector algebra */
    {
      id: 'vek-m1-s2',
      title: { en: 'Vector Algebra', id: 'Aljabar Vektor' },
      summary: {
        en: 'Add, subtract, scale, and write any vector as a combination of the standard unit vectors.',
        id: 'Menjumlah, mengurang, mengalikan dengan skalar, dan menulis vektor apa pun sebagai kombinasi vektor satuan baku.',
      },
      lessons: [
        {
          id: 'vek-m1-s2-l1',
          title: { en: 'Adding and Subtracting', id: 'Penjumlahan dan Pengurangan' },
          goal: {
            en: 'Add and subtract vectors both geometrically and component by component.',
            id: 'Menjumlah dan mengurangkan vektor secara geometris maupun komponen demi komponen.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Nose to tail', id: 'Ujung ke pangkal' },
              body: {
                en: 'To add $\\vec{a}$ and $\\vec{b}$ geometrically, put the initial point of $\\vec{b}$ on the terminal point of $\\vec{a}$; the sum is the arrow from the start of $\\vec{a}$ to the end of $\\vec{b}$. That is the **triangle rule**. Drawing both from a common initial point instead gives the **parallelogram rule**, and the same answer — the sum is the diagonal.\n\nIn components it is much shorter. Add the matching slots:\n$$\\vec{a} + \\vec{b} = (a_1 + b_1,\\ a_2 + b_2,\\ a_3 + b_3)$$',
                id: 'Untuk menjumlahkan $\\vec{a}$ dan $\\vec{b}$ secara geometris, letakkan pangkal $\\vec{b}$ pada ujung $\\vec{a}$; jumlahnya adalah anak panah dari awal $\\vec{a}$ ke akhir $\\vec{b}$. Itulah **aturan segitiga**. Menggambar keduanya dari satu pangkal yang sama memberi **aturan jajargenjang**, dengan hasil yang sama — jumlahnya adalah diagonalnya.\n\nDalam komponen jauh lebih ringkas. Jumlahkan slot yang bersesuaian:\n$$\\vec{a} + \\vec{b} = (a_1 + b_1,\\ a_2 + b_2,\\ a_3 + b_3)$$',
              },
              figure: {
                dim: 2,
                range: 6,
                interactive: true,
                vars: { a: [3, 1], b: [1, 3] },
                items: [
                  { t: 'poly', pts: [[0, 0], { of: 'a' }, { sum: [{ of: 'a' }, { of: 'b' }] }, { of: 'b' }], color: 'result' },
                  // b again, moved so its tail sits on the head of a: the triangle rule.
                  { t: 'vec', from: { of: 'a' }, to: { sum: [{ of: 'a' }, { of: 'b' }] }, color: 'b', dashed: true },
                  { t: 'vec', to: { of: 'a' }, label: 'a', color: 'a', drag: 'a' },
                  { t: 'vec', to: { of: 'b' }, label: 'b', color: 'b', drag: 'b' },
                  { t: 'vec', to: { sum: [{ of: 'a' }, { of: 'b' }] }, label: 'a + b', color: 'result' },
                ],
                readouts: [
                  { label: 'a', v: { of: 'a' }, dp: 1 },
                  { label: 'b', v: { of: 'b' }, dp: 1 },
                  { label: 'a + b =', v: { sum: [{ of: 'a' }, { of: 'b' }] }, dp: 1 },
                ],
                caption: {
                  en: 'Drag either arrow. The dashed copy of $\\vec{b}$ starts where $\\vec{a}$ ends — that is the triangle rule — and the shaded parallelogram is the same construction seen the other way.',
                  id: 'Seret salah satu anak panahnya. Salinan putus-putus $\\vec{b}$ berangkat dari tempat $\\vec{a}$ berakhir — itulah aturan segitiga — dan jajargenjang yang diarsir adalah susunan yang sama dilihat dari sisi lain.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Subtraction is addition in disguise', id: 'Pengurangan adalah penjumlahan yang menyamar' },
              body: {
                en: '$\\vec{a} - \\vec{b}$ means $\\vec{a} + (-\\vec{b})$: turn $\\vec{b}$ around, then add. In components, subtract the matching slots.\n$$\\vec{a} - \\vec{b} = (a_1 - b_1,\\ a_2 - b_2,\\ a_3 - b_3)$$\nGeometrically this is worth remembering: if $\\vec{a}$ and $\\vec{b}$ are drawn from the same point, then $\\vec{a} - \\vec{b}$ is the arrow **from the tip of $\\vec{b}$ to the tip of $\\vec{a}$**. It is the same "terminal minus initial" rule as $\\vec{AB} = B - A$.',
                id: '$\\vec{a} - \\vec{b}$ berarti $\\vec{a} + (-\\vec{b})$: balikkan $\\vec{b}$, lalu jumlahkan. Dalam komponen, kurangkan slot yang bersesuaian.\n$$\\vec{a} - \\vec{b} = (a_1 - b_1,\\ a_2 - b_2,\\ a_3 - b_3)$$\nSecara geometris ini layak diingat: bila $\\vec{a}$ dan $\\vec{b}$ digambar dari titik yang sama, maka $\\vec{a} - \\vec{b}$ adalah anak panah **dari ujung $\\vec{b}$ ke ujung $\\vec{a}$**. Aturannya sama persis dengan "ujung dikurangi pangkal" pada $\\vec{AB} = B - A$.',
              },
              figure: {
                dim: 2,
                range: 6,
                interactive: true,
                vars: { a: [4, 1], b: [1, 3] },
                items: [
                  { t: 'vec', to: { of: 'a' }, label: 'a', color: 'a', drag: 'a' },
                  { t: 'vec', to: { of: 'b' }, label: 'b', color: 'b', drag: 'b' },
                  // The difference twice: in place, and slid back to the origin.
                  { t: 'vec', from: { of: 'b' }, to: { of: 'a' }, label: 'a - b', color: 'result' },
                  { t: 'vec', to: { diff: [{ of: 'a' }, { of: 'b' }] }, color: 'result', dashed: true },
                ],
                readouts: [
                  { label: 'a - b =', v: { diff: [{ of: 'a' }, { of: 'b' }] }, dp: 1 },
                  { label: 'b - a =', v: { diff: [{ of: 'b' }, { of: 'a' }] }, dp: 1 },
                ],
                caption: {
                  en: 'The solid green arrow goes from the tip of $\\vec{b}$ to the tip of $\\vec{a}$; the dashed one is the same vector slid back to the origin. $\\vec{b} - \\vec{a}$ would be the one pointing the other way.',
                  id: 'Anak panah hijau penuh berjalan dari ujung $\\vec{b}$ ke ujung $\\vec{a}$; yang putus-putus adalah vektor yang sama, digeser kembali ke titik asal. $\\vec{b} - \\vec{a}$ adalah yang arahnya sebaliknya.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Points $A$, $B$ and $C$ are anywhere in space. What is $\\vec{AB} + \\vec{BC}$?',
                id: 'Titik $A$, $B$, dan $C$ berada di mana saja dalam ruang. Berapakah $\\vec{AB} + \\vec{BC}$?',
              },
              options: [
                { en: '$\\vec{AC}$', id: '$\\vec{AC}$' },
                { en: '$\\vec{CA}$', id: '$\\vec{CA}$' },
                { en: '$\\vec{0}$, always', id: '$\\vec{0}$, selalu' },
                { en: 'It depends where the points are.', id: 'Tergantung letak titik-titiknya.' },
              ],
              answer: 0,
              explain: {
                en: 'This is the triangle rule itself: go from $A$ to $B$, then from $B$ to $C$, and you have gone from $A$ to $C$. In components, $(B - A) + (C - B) = C - A$.',
                id: 'Inilah aturan segitiga itu sendiri: dari $A$ ke $B$, lalu dari $B$ ke $C$, berarti kamu telah berpindah dari $A$ ke $C$. Dalam komponen, $(B - A) + (C - B) = C - A$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              inline: true,
              prompt: {
                en: 'With $\\vec{a} = (3, -1, 2)$ and $\\vec{b} = (-4, 5, 0)$, find $\\vec{a} + \\vec{b}$.',
                id: 'Dengan $\\vec{a} = (3, -1, 2)$ dan $\\vec{b} = (-4, 5, 0)$, tentukan $\\vec{a} + \\vec{b}$.',
              },
              blanks: [{ answer: -1 }, { answer: 4 }, { answer: 2 }],
              hints: [{ en: 'One slot at a time. $3 + (-4)$ first.', id: 'Satu slot setiap kali. $3 + (-4)$ dulu.' }],
              solution: ['\\vec{a} + \\vec{b} = (3 + (-4),\\ -1 + 5,\\ 2 + 0) = (-1,\\ 4,\\ 2)'],
              explain: {
                en: 'Matching slots add: $3 + (-4) = -1$, $-1 + 5 = 4$, $2 + 0 = 2$.',
                id: 'Slot yang bersesuaian dijumlahkan: $3 + (-4) = -1$, $-1 + 5 = 4$, $2 + 0 = 2$.',
              },
            },
            {
              kind: 'math',
              id: 'm2',
              inline: true,
              prompt: {
                en: 'Same two vectors. Now find $\\vec{a} - \\vec{b}$.',
                id: 'Dua vektor yang sama. Sekarang tentukan $\\vec{a} - \\vec{b}$.',
              },
              given: '\\vec{a} = (3, -1, 2), \\quad \\vec{b} = (-4, 5, 0)',
              blanks: [{ answer: 7 }, { answer: -6 }, { answer: 2 }],
              hints: [
                {
                  en: 'The first slot is $3 - (-4)$. Subtracting a negative adds.',
                  id: 'Slot pertama adalah $3 - (-4)$. Mengurangi bilangan negatif berarti menambah.',
                },
              ],
              solution: ['\\vec{a} - \\vec{b} = (3 - (-4),\\ -1 - 5,\\ 2 - 0) = (7,\\ -6,\\ 2)'],
              explain: {
                en: '$3 - (-4) = 7$, $-1 - 5 = -6$, $2 - 0 = 2$. Notice $\\vec{a} - \\vec{b}$ is not $\\vec{b} - \\vec{a}$: it is its negative.',
                id: '$3 - (-4) = 7$, $-1 - 5 = -6$, $2 - 0 = 2$. Perhatikan $\\vec{a} - \\vec{b}$ bukan $\\vec{b} - \\vec{a}$: ia negatifnya.',
              },
            },
          ],
        },
        {
          id: 'vek-m1-s2-l2',
          title: { en: 'Multiplying by a Scalar', id: 'Perkalian dengan Skalar' },
          goal: {
            en: 'Stretch, shrink, and reverse a vector, and use the algebraic laws that follow.',
            id: 'Memanjangkan, memendekkan, dan membalik vektor, serta memakai hukum aljabar yang menyertainya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'What a scalar does to a vector', id: 'Apa yang dilakukan skalar pada vektor' },
              body: {
                en: 'Multiplying $\\vec{a}$ by a real number $k$ multiplies every component by $k$:\n$$k\\vec{a} = (ka_1,\\ ka_2,\\ ka_3)$$\nGeometrically, $k\\vec{a}$ is $|k|$ times as long as $\\vec{a}$. Its direction is the same as $\\vec{a}$ when $k > 0$ and the opposite when $k < 0$; and $0\\vec{a} = \\vec{0}$. So a scalar can stretch, shrink, and flip — but it can never tilt.\n\nThat last point matters: two non-zero vectors are **parallel** exactly when one is a scalar multiple of the other.',
                id: 'Mengalikan $\\vec{a}$ dengan bilangan real $k$ berarti mengalikan setiap komponennya dengan $k$:\n$$k\\vec{a} = (ka_1,\\ ka_2,\\ ka_3)$$\nSecara geometris, $k\\vec{a}$ panjangnya $|k|$ kali panjang $\\vec{a}$. Arahnya sama dengan $\\vec{a}$ bila $k > 0$ dan berlawanan bila $k < 0$; dan $0\\vec{a} = \\vec{0}$. Jadi skalar bisa memanjangkan, memendekkan, dan membalik — tetapi tak pernah bisa memiringkan.\n\nHal terakhir itu penting: dua vektor tak nol **sejajar** tepat ketika yang satu merupakan kelipatan skalar dari yang lain.',
              },
              figure: {
                dim: 2,
                range: 6,
                interactive: true,
                vars: { a: [2, 1] },
                items: [
                  { t: 'vec', to: { scale: 2, v: { of: 'a' } }, label: '2a', color: 'b' },
                  { t: 'vec', to: { of: 'a' }, label: 'a', color: 'a', drag: 'a' },
                  { t: 'vec', to: { scale: 0.5, v: { of: 'a' } }, label: '½a', color: 'result' },
                  { t: 'vec', to: { scale: -1, v: { of: 'a' } }, label: '-a', color: 'c' },
                ],
                readouts: [
                  { label: '|a| =', n: { norm: { of: 'a' } } },
                  { label: '|2a| =', n: { norm: { scale: 2, v: { of: 'a' } } } },
                  { label: '|-a| =', n: { norm: { scale: -1, v: { of: 'a' } } } },
                ],
                caption: {
                  en: 'Every multiple of $\\vec{a}$ lies on one line through the origin, whichever way you drag it. A scalar can lengthen, shorten and reverse — it can never turn.',
                  id: 'Setiap kelipatan $\\vec{a}$ terletak pada satu garis lewat titik asal, ke mana pun kamu menyeretnya. Skalar bisa memanjangkan, memendekkan, dan membalik — ia tak pernah bisa memutar.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The laws you may use', id: 'Hukum yang boleh dipakai' },
              body: {
                en: 'For any vectors $\\vec{a}, \\vec{b}, \\vec{c}$ and any scalars $k, m$:\n$$\\vec{a} + \\vec{b} = \\vec{b} + \\vec{a}, \\qquad (\\vec{a} + \\vec{b}) + \\vec{c} = \\vec{a} + (\\vec{b} + \\vec{c})$$\n$$k(\\vec{a} + \\vec{b}) = k\\vec{a} + k\\vec{b}, \\qquad (k + m)\\vec{a} = k\\vec{a} + m\\vec{a}, \\qquad k(m\\vec{a}) = (km)\\vec{a}$$\nEach of these is just the corresponding law for real numbers, applied in every slot at once. That is why vector algebra looks so much like ordinary algebra — and why you may collect like terms, expand brackets, and move things across an equals sign exactly as you are used to.',
                id: 'Untuk sebarang vektor $\\vec{a}, \\vec{b}, \\vec{c}$ dan sebarang skalar $k, m$:\n$$\\vec{a} + \\vec{b} = \\vec{b} + \\vec{a}, \\qquad (\\vec{a} + \\vec{b}) + \\vec{c} = \\vec{a} + (\\vec{b} + \\vec{c})$$\n$$k(\\vec{a} + \\vec{b}) = k\\vec{a} + k\\vec{b}, \\qquad (k + m)\\vec{a} = k\\vec{a} + m\\vec{a}, \\qquad k(m\\vec{a}) = (km)\\vec{a}$$\nMasing-masing hanyalah hukum yang bersesuaian untuk bilangan real, diterapkan serentak pada setiap slot. Itu sebabnya aljabar vektor sangat mirip aljabar biasa — dan sebabnya kamu boleh menggabungkan suku sejenis, menjabarkan kurung, dan memindahkan ruas persis seperti yang sudah biasa.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which vector is **parallel** to $(2, -6, 4)$?',
                id: 'Vektor manakah yang **sejajar** dengan $(2, -6, 4)$?',
              },
              options: [
                { en: '$(1, -3, 2)$', id: '$(1, -3, 2)$' },
                { en: '$(2, 6, 4)$', id: '$(2, 6, 4)$' },
                { en: '$(4, -6, 8)$', id: '$(4, -6, 8)$' },
                { en: '$(-2, 6, -3)$', id: '$(-2, 6, -3)$' },
              ],
              answer: 0,
              explain: {
                en: '$(2, -6, 4) = 2(1, -3, 2)$, so the two are scalar multiples of each other. In the others the ratio is not the same in every slot.',
                id: '$(2, -6, 4) = 2(1, -3, 2)$, jadi keduanya saling kelipatan skalar. Pada pilihan lain perbandingannya tidak sama di setiap slot.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the components of $2\\vec{a}$ where $\\vec{a} = (3, -1, 2)$.',
                id: 'Lengkapi komponen $2\\vec{a}$ dengan $\\vec{a} = (3, -1, 2)$.',
              },
              template: '2\\vec{a} = 2(3, -1, 2) = (___,\\ ___,\\ ___)',
              blanks: ['6', '-2', '4'],
              explain: {
                en: 'Every slot doubles: $2 \\cdot 3 = 6$, $2 \\cdot (-1) = -2$, $2 \\cdot 2 = 4$.',
                id: 'Setiap slot digandakan: $2 \\cdot 3 = 6$, $2 \\cdot (-1) = -2$, $2 \\cdot 2 = 4$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              inline: true,
              prompt: {
                en: 'With $\\vec{a} = (3, -1, 2)$ and $\\vec{b} = (-4, 5, 0)$, find $2\\vec{a} - 3\\vec{b}$.',
                id: 'Dengan $\\vec{a} = (3, -1, 2)$ dan $\\vec{b} = (-4, 5, 0)$, tentukan $2\\vec{a} - 3\\vec{b}$.',
              },
              blanks: [{ answer: 18 }, { answer: -17 }, { answer: 4 }],
              hints: [
                { en: 'Scale each vector first, then subtract.', id: 'Kalikan dulu masing-masing vektor, baru kurangkan.' },
                { en: '$3\\vec{b} = (-12, 15, 0)$, and subtracting $-12$ adds.', id: '$3\\vec{b} = (-12, 15, 0)$, dan mengurangi $-12$ berarti menambah.' },
              ],
              solution: [
                '2\\vec{a} = (6, -2, 4), \\qquad 3\\vec{b} = (-12, 15, 0)',
                '2\\vec{a} - 3\\vec{b} = (6 - (-12),\\ -2 - 15,\\ 4 - 0)',
                '2\\vec{a} - 3\\vec{b} = (18,\\ -17,\\ 4)',
              ],
              explain: {
                en: 'Scaling first keeps the arithmetic in one place: $(6, -2, 4) - (-12, 15, 0) = (18, -17, 4)$.',
                id: 'Mengalikan lebih dahulu menjaga hitungannya tetap rapi: $(6, -2, 4) - (-12, 15, 0) = (18, -17, 4)$.',
              },
            },
          ],
        },
        {
          id: 'vek-m1-s2-l3',
          title: { en: 'The Standard Unit Vectors', id: 'Vektor Satuan Baku' },
          goal: {
            en: 'Move between component form and $\\hat{i}, \\hat{j}, \\hat{k}$ form without thinking about it.',
            id: 'Berpindah antara bentuk komponen dan bentuk $\\hat{i}, \\hat{j}, \\hat{k}$ tanpa perlu berpikir lama.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Three vectors of length one', id: 'Tiga vektor yang panjangnya satu' },
              body: {
                en: 'Three particular vectors get their own names, one along each axis:\n$$\\hat{i} = (1, 0, 0), \\qquad \\hat{j} = (0, 1, 0), \\qquad \\hat{k} = (0, 0, 1)$$\nEach has length 1, which is what the hat is telling you. In $R^2$ only $\\hat{i}$ and $\\hat{j}$ are needed.',
                id: 'Tiga vektor tertentu mendapat namanya sendiri, satu di sepanjang tiap sumbu:\n$$\\hat{i} = (1, 0, 0), \\qquad \\hat{j} = (0, 1, 0), \\qquad \\hat{k} = (0, 0, 1)$$\nMasing-masing panjangnya 1, dan itulah yang diberitahukan oleh tanda topinya. Di $R^2$ hanya $\\hat{i}$ dan $\\hat{j}$ yang diperlukan.',
              },
              figure: {
                dim: 3,
                range: 3,
                interactive: true,
                view: [58, 22],
                items: [
                  { t: 'vec', to: [1, 0, 0], label: 'i', color: 'a' },
                  { t: 'vec', to: [0, 1, 0], label: 'j', color: 'b' },
                  { t: 'vec', to: [0, 0, 1], label: 'k', color: 'c' },
                  { t: 'vec', to: [2, 1.5, 2], label: 'a', color: 'result' },
                  { t: 'seg', from: [0, 0, 0], to: [2, 1.5, 0], dashed: true },
                  { t: 'seg', from: [2, 1.5, 0], to: [2, 1.5, 2], dashed: true },
                ],
                caption: {
                  en: 'Drag to turn the scene. The three short arrows are $\\hat{i}$, $\\hat{j}$ and $\\hat{k}$; the long one is $2\\hat{i} + 1{,}5\\hat{j} + 2\\hat{k}$, and the dashed path is how you would walk to its tip one axis at a time.',
                  id: 'Seret untuk memutar. Tiga anak panah pendek adalah $\\hat{i}$, $\\hat{j}$, dan $\\hat{k}$; yang panjang adalah $2\\hat{i} + 1{,}5\\hat{j} + 2\\hat{k}$, dan jalur putus-putusnya adalah cara berjalan menuju ujungnya satu sumbu setiap kali.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Every vector is a combination of them', id: 'Setiap vektor adalah kombinasi ketiganya' },
              body: {
                en: 'Because a scalar multiple stretches along one axis and addition puts the pieces together, any vector can be built out of the three:\n$$(a_1, a_2, a_3) = a_1\\hat{i} + a_2\\hat{j} + a_3\\hat{k}$$\nThe two notations say exactly the same thing — $(2, -3, 6)$ and $2\\hat{i} - 3\\hat{j} + 6\\hat{k}$ are the same vector — and you will meet both in any textbook, often on the same page. A missing term means a zero component: $\\vec{b} = -\\hat{i} + 4\\hat{j}$ is $(-1, 4, 0)$.',
                id: 'Karena perkalian skalar memanjangkan sepanjang satu sumbu dan penjumlahan menyatukan bagian-bagiannya, vektor apa pun dapat disusun dari ketiganya:\n$$(a_1, a_2, a_3) = a_1\\hat{i} + a_2\\hat{j} + a_3\\hat{k}$$\nKedua notasi menyatakan hal yang persis sama — $(2, -3, 6)$ dan $2\\hat{i} - 3\\hat{j} + 6\\hat{k}$ adalah vektor yang sama — dan kamu akan menemui keduanya di buku mana pun, sering pada halaman yang sama. Suku yang tidak ditulis berarti komponennya nol: $\\vec{b} = -\\hat{i} + 4\\hat{j}$ adalah $(-1, 4, 0)$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Written in component form, what is $5\\hat{j} - 2\\hat{k}$?',
                id: 'Ditulis dalam bentuk komponen, berapakah $5\\hat{j} - 2\\hat{k}$?',
              },
              options: [
                { en: '$(5, -2, 0)$', id: '$(5, -2, 0)$' },
                { en: '$(0, 5, -2)$', id: '$(0, 5, -2)$' },
                { en: '$(5, -2)$', id: '$(5, -2)$' },
                { en: '$(0, -2, 5)$', id: '$(0, -2, 5)$' },
              ],
              answer: 1,
              explain: {
                en: 'There is no $\\hat{i}$ term, so the first component is 0. The $\\hat{j}$ coefficient goes in the second slot and the $\\hat{k}$ coefficient in the third.',
                id: 'Tidak ada suku $\\hat{i}$, jadi komponen pertamanya 0. Koefisien $\\hat{j}$ masuk ke slot kedua dan koefisien $\\hat{k}$ ke slot ketiga.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Put the working for $\\vec{a} + 2\\vec{b}$, where $\\vec{a} = 2\\hat{i} - 3\\hat{j} + 6\\hat{k}$ and $\\vec{b} = -\\hat{i} + 4\\hat{j}$, into order.',
                id: 'Susun langkah penyelesaian $\\vec{a} + 2\\vec{b}$, dengan $\\vec{a} = 2\\hat{i} - 3\\hat{j} + 6\\hat{k}$ dan $\\vec{b} = -\\hat{i} + 4\\hat{j}$, menjadi urutan yang benar.',
              },
              lines: [
                '\\vec{a} = (2, -3, 6), \\quad \\vec{b} = (-1, 4, 0)',
                '2\\vec{b} = (-2, 8, 0)',
                '\\vec{a} + 2\\vec{b} = (2 + (-2),\\ -3 + 8,\\ 6 + 0)',
                '\\vec{a} + 2\\vec{b} = (0, 5, 6) = 5\\hat{j} + 6\\hat{k}',
              ],
              explain: {
                en: 'Read the two vectors into components, scale, add slot by slot, and put the answer back into whichever notation the question used.',
                id: 'Baca kedua vektor menjadi komponen, kalikan dengan skalarnya, jumlahkan slot demi slot, lalu kembalikan jawabannya ke notasi yang dipakai soal.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              inline: true,
              prompt: {
                en: 'With $\\vec{a} = 2\\hat{i} - 3\\hat{j} + 6\\hat{k}$ and $\\vec{b} = -\\hat{i} + 4\\hat{j}$, find the components of $\\vec{a} + 2\\vec{b}$.',
                id: 'Dengan $\\vec{a} = 2\\hat{i} - 3\\hat{j} + 6\\hat{k}$ dan $\\vec{b} = -\\hat{i} + 4\\hat{j}$, tentukan komponen $\\vec{a} + 2\\vec{b}$.',
              },
              blanks: [{ answer: 0 }, { answer: 5 }, { answer: 6 }],
              hints: [
                { en: '$\\vec{b}$ has no $\\hat{k}$ term, so its third component is 0.', id: '$\\vec{b}$ tak punya suku $\\hat{k}$, jadi komponen ketiganya 0.' },
              ],
              explain: {
                en: '$(2, -3, 6) + (-2, 8, 0) = (0, 5, 6)$ — the $\\hat{i}$ terms cancel exactly.',
                id: '$(2, -3, 6) + (-2, 8, 0) = (0, 5, 6)$ — suku $\\hat{i}$-nya saling meniadakan tepat.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'vek-m1-s2-p',
        runtime: 'math',
        title: { en: 'Linear Combinations', id: 'Kombinasi Linear' },
        brief: {
          en: 'Combine vectors with scalars — and then run the process backwards to find a scalar you were not given.',
          id: 'Menggabungkan vektor dengan skalar — lalu membalik prosesnya untuk mencari skalar yang tidak diberikan.',
        },
        requirements: [
          { en: 'Scale each vector before you add or subtract.', id: 'Kalikan tiap vektor dengan skalarnya sebelum menjumlah atau mengurangkan.' },
          { en: 'Answers may be typed as fractions: `-5/2` is read the same as `-2.5`.', id: 'Jawaban boleh diketik sebagai pecahan: `-5/2` dibaca sama dengan `-2,5`.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'With $\\vec{u} = (2, -3)$ and $\\vec{v} = (-1, 5)$, find $3\\vec{u} + 2\\vec{v}$.',
              id: 'Dengan $\\vec{u} = (2, -3)$ dan $\\vec{v} = (-1, 5)$, tentukan $3\\vec{u} + 2\\vec{v}$.',
            },
            inline: true,
            blanks: [{ answer: 4 }, { answer: 1 }],
            solution: [
              '3\\vec{u} = (6, -9), \\qquad 2\\vec{v} = (-2, 10)',
              '3\\vec{u} + 2\\vec{v} = (6 - 2,\\ -9 + 10) = (4,\\ 1)',
            ],
          },
          {
            prompt: {
              en: 'With $\\vec{a} = \\hat{i} - 2\\hat{j} + 3\\hat{k}$ and $\\vec{b} = 4\\hat{i} + \\hat{j} - \\hat{k}$, find the components of $2\\vec{a} - \\vec{b}$.',
              id: 'Dengan $\\vec{a} = \\hat{i} - 2\\hat{j} + 3\\hat{k}$ dan $\\vec{b} = 4\\hat{i} + \\hat{j} - \\hat{k}$, tentukan komponen $2\\vec{a} - \\vec{b}$.',
            },
            inline: true,
            blanks: [{ answer: -2 }, { answer: -5 }, { answer: 7 }],
            solution: [
              '\\vec{a} = (1, -2, 3), \\quad \\vec{b} = (4, 1, -1)',
              '2\\vec{a} = (2, -4, 6)',
              '2\\vec{a} - \\vec{b} = (2 - 4,\\ -4 - 1,\\ 6 - (-1)) = (-2,\\ -5,\\ 7)',
            ],
          },
          {
            prompt: {
              en: 'Find the scalar $m$ for which $m(2, -6) = (-5, 15)$.',
              id: 'Tentukan skalar $m$ yang memenuhi $m(2, -6) = (-5, 15)$.',
            },
            blanks: [{ label: 'm =', answer: -2.5 }],
            solution: {
              en: [
                '2m = -5 \\Rightarrow m = -\\tfrac{5}{2}',
                '\\text{check: } -\\tfrac{5}{2}(-6) = 15 \\quad \\checkmark',
              ],
              id: [
                '2m = -5 \\Rightarrow m = -\\tfrac{5}{2}',
                '\\text{periksa: } -\\tfrac{5}{2}(-6) = 15 \\quad \\checkmark',
              ],
            },
          },
        ],
        hints: [
          {
            en: 'For the last part, two vectors are equal only when every slot matches — so each slot gives you an equation for $m$, and both must agree.',
            id: 'Untuk butir terakhir, dua vektor sama hanya bila setiap slot cocok — jadi tiap slot memberi satu persamaan untuk $m$, dan keduanya harus sepakat.',
          },
          {
            en: 'The first slot says $2m = -5$. Check your answer against the second slot before you type it.',
            id: 'Slot pertama memberi $2m = -5$. Periksa jawabanmu terhadap slot kedua sebelum mengetiknya.',
          },
        ],
        xp: 50,
      },
    },
  ],
}
