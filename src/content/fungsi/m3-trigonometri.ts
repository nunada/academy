import type { Module } from '../types'

/** Module 3 — trigonometry as functions rather than as triangle-solving.
 *
 *  The shift that matters here is from "an angle in a triangle" to "a number
 *  on the real line": radians are not an alternative unit to be converted at
 *  the end, they are the reason the calculus of sine works at all. So radians
 *  come first and degrees are the visitor. */
export const module3: Module = {
  id: 'fun-m3',
  title: { en: 'Trigonometric Functions', id: 'Fungsi Trigonometri' },
  summary: {
    en: 'Radians, the unit circle, the six functions and the identities that tie them together — and what all of it looks like graphed.',
    id: 'Radian, lingkaran satuan, keenam fungsinya dan identitas yang mengikatnya — serta rupa semuanya ketika digambar.',
  },
  submodules: [
    /* ----------------------------------------------- 3.1 angles and values */
    {
      id: 'fun-m3-s1',
      title: { en: 'Angles and Values', id: 'Sudut dan Nilai' },
      summary: {
        en: 'Measure an angle the way calculus does, read the six functions off the unit circle, and use the identities.',
        id: 'Mengukur sudut sebagaimana kalkulus mengukurnya, membaca keenam fungsinya dari lingkaran satuan, dan memakai identitasnya.',
      },
      lessons: [
        {
          id: 'fun-m3-s1-l1',
          title: { en: 'Radians', id: 'Radian' },
          goal: {
            en: 'Convert between degrees and radians, and use radians for arc length and area.',
            id: 'Mengubah derajat menjadi radian dan sebaliknya, serta memakai radian untuk panjang busur dan luas juring.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'An angle measured by the arc it cuts', id: 'Sudut yang diukur oleh busur yang dipotongnya' },
              body: {
                en: 'Put an angle at the centre of a circle of radius $r$ and let it cut off an arc of length $s$. The angle **in radians** is\n$$\\theta = \\frac{s}{r}$$\nA length divided by a length: radians are a pure number, with no unit attached. That is why they are the measure calculus uses — you can add $\\theta$ to an ordinary number and it means something.\n\nOne full turn is an arc of $2\\pi r$ around a radius of $r$, so a full turn is $2\\pi$ radians. Half a turn gives the conversion everything else follows from:\n$$180^\\circ = \\pi \\text{ rad}$$\nSo multiply by $\\pi/180$ to go from degrees to radians, and by $180/\\pi$ to come back.',
                id: 'Letakkan sebuah sudut di pusat lingkaran berjari-jari $r$ dan biarkan ia memotong busur sepanjang $s$. Besar sudut **dalam radian** adalah\n$$\\theta = \\frac{s}{r}$$\nPanjang dibagi panjang: radian adalah bilangan murni, tanpa satuan yang menempel. Itulah sebabnya radian menjadi ukuran yang dipakai kalkulus — kamu bisa menjumlahkan $\\theta$ dengan bilangan biasa dan hasilnya bermakna.\n\nSatu putaran penuh adalah busur sepanjang $2\\pi r$ pada jari-jari $r$, jadi satu putaran penuh adalah $2\\pi$ radian. Setengah putaran memberi konversi yang menjadi dasar segalanya:\n$$180^\\circ = \\pi \\text{ rad}$$\nJadi kalikan dengan $\\pi/180$ untuk mengubah derajat menjadi radian, dan dengan $180/\\pi$ untuk kembali.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'What radians buy you', id: 'Apa yang kamu dapat dari radian' },
              body: {
                en: 'Rearranging the definition gives the arc length directly, and the sector area follows:\n$$s = r\\theta, \\qquad L = \\tfrac{1}{2}r^2\\theta$$\nBoth are wrong in degrees. In degrees the same two formulas need a factor of $\\pi/180$ carried through every line — exactly the sort of constant that vanishes once you switch units and never comes back.\n\nThe angles worth knowing by heart:\n$$30^\\circ = \\tfrac{\\pi}{6}, \\quad 45^\\circ = \\tfrac{\\pi}{4}, \\quad 60^\\circ = \\tfrac{\\pi}{3}, \\quad 90^\\circ = \\tfrac{\\pi}{2}$$',
                id: 'Menyusun ulang definisinya langsung memberi panjang busurnya, dan luas juringnya menyusul:\n$$s = r\\theta, \\qquad L = \\tfrac{1}{2}r^2\\theta$$\nKeduanya salah bila memakai derajat. Dalam derajat, kedua rumus yang sama memerlukan faktor $\\pi/180$ yang harus dibawa di setiap baris — persis jenis konstanta yang lenyap begitu satuannya diganti dan tak pernah kembali.\n\nSudut-sudut yang layak dihafal:\n$$30^\\circ = \\tfrac{\\pi}{6}, \\quad 45^\\circ = \\tfrac{\\pi}{4}, \\quad 60^\\circ = \\tfrac{\\pi}{3}, \\quad 90^\\circ = \\tfrac{\\pi}{2}$$',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is $\\dfrac{3\\pi}{4}$ radians in degrees?',
                id: 'Berapa derajatkah $\\dfrac{3\\pi}{4}$ radian?',
              },
              options: [
                { en: '$120^\\circ$', id: '$120^\\circ$' },
                { en: '$135^\\circ$', id: '$135^\\circ$' },
                { en: '$150^\\circ$', id: '$150^\\circ$' },
                { en: '$225^\\circ$', id: '$225^\\circ$' },
              ],
              answer: 1,
              explain: {
                en: '$\\frac{3\\pi}{4} \\cdot \\frac{180}{\\pi} = \\frac{3 \\cdot 180}{4} = 135$. A quick check: $\\pi$ is $180^\\circ$, so three quarters of it must be three quarters of $180$.',
                id: '$\\frac{3\\pi}{4} \\cdot \\frac{180}{\\pi} = \\frac{3 \\cdot 180}{4} = 135$. Pemeriksaan cepat: $\\pi$ adalah $180^\\circ$, jadi tiga perempatnya pasti tiga perempat dari $180$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'A sector of a circle of radius 5 has a central angle of $\\tfrac{\\pi}{3}$. Answer all three.',
                id: 'Sebuah juring lingkaran berjari-jari 5 mempunyai sudut pusat $\\tfrac{\\pi}{3}$. Jawab ketiganya.',
              },
              blanks: [
                {
                  label: { en: '\\tfrac{\\pi}{3} \\text{ in degrees} =', id: '\\tfrac{\\pi}{3} \\text{ dalam derajat} =' },
                  answer: 60,
                },
                { label: 's =', answer: (5 * Math.PI) / 3 },
                { label: 'L =', answer: (25 * Math.PI) / 6 },
              ],
              hints: [
                { en: 'You may type `5*pi/3` — the box reads $\\pi$.', id: 'Kamu boleh mengetik `5*pi/3` — kotaknya membaca $\\pi$.' },
                { en: 'Area is $\\tfrac{1}{2}r^2\\theta$, so $\\tfrac{1}{2}(25)(\\pi/3)$.', id: 'Luasnya $\\tfrac{1}{2}r^2\\theta$, yaitu $\\tfrac{1}{2}(25)(\\pi/3)$.' },
              ],
              solution: [
                '\\tfrac{\\pi}{3} \\cdot \\tfrac{180}{\\pi} = 60^\\circ',
                's = r\\theta = 5 \\cdot \\tfrac{\\pi}{3} = \\tfrac{5\\pi}{3} \\approx 5{,}24',
                'L = \\tfrac{1}{2}(5)^2\\tfrac{\\pi}{3} = \\tfrac{25\\pi}{6} \\approx 13{,}09',
              ],
              explain: {
                en: 'Neither formula needed a conversion, because the angle was already a pure number. Had it been given as $60^\\circ$, the first job would have been to undo that.',
                id: 'Kedua rumusnya tak memerlukan konversi, sebab sudutnya sudah berupa bilangan murni. Seandainya diberikan sebagai $60^\\circ$, pekerjaan pertamanya adalah membatalkan itu dulu.',
              },
            },
          ],
        },
        {
          id: 'fun-m3-s1-l2',
          title: { en: 'The Six Functions on the Unit Circle', id: 'Enam Fungsi pada Lingkaran Satuan' },
          goal: {
            en: 'Define sine and cosine as coordinates, get the other four from them, and know the signs in each quadrant.',
            id: 'Mendefinisikan sinus dan cosinus sebagai koordinat, memperoleh empat lainnya dari keduanya, dan mengetahui tandanya di tiap kuadran.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Cosine across, sine up', id: 'Cosinus mendatar, sinus tegak' },
              body: {
                en: 'Draw the circle of radius 1 about the origin. Start at $(1, 0)$ and travel anticlockwise through an angle $\\theta$. Wherever you land, that point is\n$$(\\cos\\theta, \\ \\sin\\theta)$$\nThat is the definition — cosine is the first coordinate, sine the second. It works for **every** real $\\theta$, not just the angles that fit in a right triangle: negative ones go clockwise, and ones past $2\\pi$ go round again.\n\nThe other four are ratios of these two:\n$$\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}, \\quad \\cot\\theta = \\frac{\\cos\\theta}{\\sin\\theta}, \\quad \\sec\\theta = \\frac{1}{\\cos\\theta}, \\quad \\csc\\theta = \\frac{1}{\\sin\\theta}$$\nSo four of the six are undefined wherever their denominator is zero, and that is where their graphs will have gaps.',
                id: 'Gambar lingkaran berjari-jari 1 berpusat di titik asal. Mulai dari $(1, 0)$ lalu berjalan berlawanan arah jarum jam sejauh sudut $\\theta$. Di mana pun kamu mendarat, titik itu adalah\n$$(\\cos\\theta, \\ \\sin\\theta)$$\nItulah definisinya — cosinus adalah koordinat pertama, sinus koordinat kedua. Ia berlaku untuk **setiap** $\\theta$ real, bukan hanya sudut yang muat dalam segitiga siku-siku: yang negatif berjalan searah jarum jam, dan yang melewati $2\\pi$ berputar lagi.\n\nEmpat lainnya adalah perbandingan keduanya:\n$$\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}, \\quad \\cot\\theta = \\frac{\\cos\\theta}{\\sin\\theta}, \\quad \\sec\\theta = \\frac{1}{\\cos\\theta}, \\quad \\csc\\theta = \\frac{1}{\\sin\\theta}$$\nJadi empat dari enam fungsi itu tak terdefinisi di mana pun penyebutnya nol, dan di situlah grafiknya nanti berlubang.',
              },
              figure: {
                dim: 2,
                xSpan: [-1.4, 1.4],
                ySpan: [-1.4, 1.4],
                ticks: true,
                height: 340,
                items: [
                  { t: 'curve', f: 'sqrt(1-x^2)', from: -1, to: 1, color: 'muted' },
                  { t: 'curve', f: '-sqrt(1-x^2)', from: -1, to: 1, color: 'muted' },
                  { t: 'seg', from: [0.5, 0], to: [0.5, 0.866], color: 'b', label: 'sin θ' },
                  { t: 'seg', from: [0, 0], to: [0.5, 0], color: 'c', label: 'cos θ' },
                  { t: 'vec', to: [0.5, 0.866], color: 'a', label: '1' },
                  { t: 'angle', from: [1, 0], to: [0.5, 0.866], label: 'θ' },
                  { t: 'dot', x: 0.5, y: 0.866 },
                ],
                caption: {
                  en: 'At $\\theta = \\tfrac{\\pi}{3}$ the point is $\\left(\\tfrac{1}{2}, \\tfrac{\\sqrt{3}}{2}\\right)$. The radius is 1, so the two legs of that right triangle *are* the cosine and the sine — and $\\cos^2\\theta + \\sin^2\\theta = 1$ is just Pythagoras on it.',
                  id: 'Pada $\\theta = \\tfrac{\\pi}{3}$ titiknya adalah $\\left(\\tfrac{1}{2}, \\tfrac{\\sqrt{3}}{2}\\right)$. Jari-jarinya 1, jadi kedua sisi siku-siku segitiga itu *adalah* cosinus dan sinusnya — dan $\\cos^2\\theta + \\sin^2\\theta = 1$ tak lain adalah Pythagoras padanya.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Signs, and the values to know', id: 'Tanda, dan nilai yang perlu diketahui' },
              body: {
                en: 'The sign of each function is just the sign of the coordinate. In the second quadrant $x$ is negative and $y$ positive, so cosine is negative and sine positive — and tangent, being their ratio, is negative.\n$$\\begin{array} \\theta & 0 & \\tfrac{\\pi}{6} & \\tfrac{\\pi}{4} & \\tfrac{\\pi}{3} & \\tfrac{\\pi}{2} \\\\ \\sin\\theta & 0 & \\tfrac{1}{2} & \\tfrac{\\sqrt2}{2} & \\tfrac{\\sqrt3}{2} & 1 \\\\ \\cos\\theta & 1 & \\tfrac{\\sqrt3}{2} & \\tfrac{\\sqrt2}{2} & \\tfrac{1}{2} & 0 \\end{array}$$\nRead the sine row left to right and the cosine row right to left: they are the same five numbers. That is not a coincidence — it is $\\cos\\theta = \\sin\\left(\\tfrac{\\pi}{2} - \\theta\\right)$, the reason the "co" is there.',
                id: 'Tanda tiap fungsinya tak lain adalah tanda koordinatnya. Di kuadran kedua $x$ negatif dan $y$ positif, jadi cosinusnya negatif dan sinusnya positif — dan tangen, sebagai perbandingan keduanya, negatif.\n$$\\begin{array} \\theta & 0 & \\tfrac{\\pi}{6} & \\tfrac{\\pi}{4} & \\tfrac{\\pi}{3} & \\tfrac{\\pi}{2} \\\\ \\sin\\theta & 0 & \\tfrac{1}{2} & \\tfrac{\\sqrt2}{2} & \\tfrac{\\sqrt3}{2} & 1 \\\\ \\cos\\theta & 1 & \\tfrac{\\sqrt3}{2} & \\tfrac{\\sqrt2}{2} & \\tfrac{1}{2} & 0 \\end{array}$$\nBaca baris sinus dari kiri ke kanan dan baris cosinus dari kanan ke kiri: keduanya lima bilangan yang sama. Itu bukan kebetulan — itulah $\\cos\\theta = \\sin\\left(\\tfrac{\\pi}{2} - \\theta\\right)$, sebab adanya awalan "co".',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'An angle $\\theta$ lies in the second quadrant. Which is true?',
                id: 'Sebuah sudut $\\theta$ berada di kuadran kedua. Manakah yang benar?',
              },
              options: [
                { en: '$\\sin\\theta > 0$ and $\\tan\\theta > 0$', id: '$\\sin\\theta > 0$ dan $\\tan\\theta > 0$' },
                { en: '$\\sin\\theta > 0$ and $\\tan\\theta < 0$', id: '$\\sin\\theta > 0$ dan $\\tan\\theta < 0$' },
                { en: '$\\cos\\theta > 0$ and $\\tan\\theta < 0$', id: '$\\cos\\theta > 0$ dan $\\tan\\theta < 0$' },
                { en: 'All three are positive.', id: 'Ketiganya positif.' },
              ],
              answer: 1,
              explain: {
                en: 'Second quadrant: $x < 0$, $y > 0$. So $\\cos\\theta < 0$, $\\sin\\theta > 0$, and their ratio is negative. Only sine (and its reciprocal cosecant) survives positive there.',
                id: 'Kuadran kedua: $x < 0$, $y > 0$. Jadi $\\cos\\theta < 0$, $\\sin\\theta > 0$, dan perbandingan keduanya negatif. Hanya sinus (dan kebalikannya, cosecan) yang tetap positif di situ.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Give each value exactly. You may type `sqrt(3)/2` or the decimal.',
                id: 'Sebutkan tiap nilainya dengan tepat. Kamu boleh mengetik `sqrt(3)/2` atau desimalnya.',
              },
              blanks: [
                { label: '\\sin\\tfrac{\\pi}{6} =', answer: 0.5 },
                { label: '\\cos\\tfrac{\\pi}{6} =', answer: Math.sqrt(3) / 2 },
                { label: '\\tan\\tfrac{\\pi}{4} =', answer: 1 },
                { label: '\\cos\\tfrac{2\\pi}{3} =', answer: -0.5 },
              ],
              hints: [
                { en: '$\\tfrac{2\\pi}{3}$ is $120^\\circ$ — second quadrant, so the cosine is negative.', id: '$\\tfrac{2\\pi}{3}$ adalah $120^\\circ$ — kuadran kedua, jadi cosinusnya negatif.' },
                { en: 'At $\\tfrac{\\pi}{4}$ sine and cosine are equal, so their ratio is 1.', id: 'Pada $\\tfrac{\\pi}{4}$ sinus dan cosinusnya sama, jadi perbandingannya 1.' },
              ],
              solution: [
                '\\sin\\tfrac{\\pi}{6} = \\tfrac{1}{2}, \\qquad \\cos\\tfrac{\\pi}{6} = \\tfrac{\\sqrt3}{2}',
                '\\tan\\tfrac{\\pi}{4} = \\tfrac{\\sqrt2/2}{\\sqrt2/2} = 1',
                '\\cos\\tfrac{2\\pi}{3} = -\\cos\\tfrac{\\pi}{3} = -\\tfrac{1}{2}',
              ],
              explain: {
                en: 'The last one uses the reference angle: $\\tfrac{2\\pi}{3}$ is $\\tfrac{\\pi}{3}$ from the negative $x$-axis, so it has the same value up to a sign, and the quadrant fixes the sign.',
                id: 'Yang terakhir memakai sudut acuan: $\\tfrac{2\\pi}{3}$ berjarak $\\tfrac{\\pi}{3}$ dari sumbu $x$ negatif, jadi nilainya sama sampai pada tandanya, dan kuadrannya yang menentukan tandanya.',
              },
            },
          ],
        },
        {
          id: 'fun-m3-s1-l3',
          title: { en: 'The Identities', id: 'Identitas' },
          goal: {
            en: 'Use the Pythagorean, sum and double-angle identities to get one value from another.',
            id: 'Memakai identitas Pythagoras, jumlah sudut, dan sudut ganda untuk memperoleh satu nilai dari nilai lain.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Pythagoras, three times', id: 'Pythagoras, tiga kali' },
              body: {
                en: 'The point $(\\cos\\theta, \\sin\\theta)$ is on a circle of radius 1, so\n$$\\cos^2\\theta + \\sin^2\\theta = 1$$\nDivide it through by $\\cos^2\\theta$, then by $\\sin^2\\theta$, and two more identities fall out:\n$$1 + \\tan^2\\theta = \\sec^2\\theta, \\qquad \\cot^2\\theta + 1 = \\csc^2\\theta$$\nThree identities, one fact. Note the notation: $\\sin^2\\theta$ means $(\\sin\\theta)^2$, not $\\sin(\\theta^2)$ — a shorthand that exists only because it is so common.',
                id: 'Titik $(\\cos\\theta, \\sin\\theta)$ berada pada lingkaran berjari-jari 1, sehingga\n$$\\cos^2\\theta + \\sin^2\\theta = 1$$\nBagi seluruhnya dengan $\\cos^2\\theta$, lalu dengan $\\sin^2\\theta$, dan dua identitas lain jatuh dengan sendirinya:\n$$1 + \\tan^2\\theta = \\sec^2\\theta, \\qquad \\cot^2\\theta + 1 = \\csc^2\\theta$$\nTiga identitas, satu kenyataan. Perhatikan notasinya: $\\sin^2\\theta$ berarti $(\\sin\\theta)^2$, bukan $\\sin(\\theta^2)$ — singkatan yang ada semata-mata karena bentuk itu sangat sering muncul.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Sums and double angles', id: 'Jumlah sudut dan sudut ganda' },
              body: {
                en: 'Two formulas carry the rest:\n$$\\cos(A + B) = \\cos A\\cos B - \\sin A\\sin B$$\n$$\\sin(A + B) = \\sin A\\cos B + \\cos A\\sin B$$\nPut $B = A$ in each and the **double-angle** identities appear:\n$$\\sin 2\\theta = 2\\sin\\theta\\cos\\theta, \\qquad \\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta$$\nUsing $\\cos^2 = 1 - \\sin^2$, the second one has two more faces:\n$$\\cos 2\\theta = 1 - 2\\sin^2\\theta = 2\\cos^2\\theta - 1$$\nRearranged, those last two are the **half-angle** forms $\\sin^2\\theta = \\frac{1 - \\cos 2\\theta}{2}$ and $\\cos^2\\theta = \\frac{1 + \\cos 2\\theta}{2}$, and that is how integrals of squared trigonometric functions get done later.\n\nOne warning that never stops being needed: $\\sin(A + B)$ is **not** $\\sin A + \\sin B$.',
                id: 'Dua rumus menopang selebihnya:\n$$\\cos(A + B) = \\cos A\\cos B - \\sin A\\sin B$$\n$$\\sin(A + B) = \\sin A\\cos B + \\cos A\\sin B$$\nAmbil $B = A$ pada masing-masing dan identitas **sudut ganda** muncul:\n$$\\sin 2\\theta = 2\\sin\\theta\\cos\\theta, \\qquad \\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta$$\nDengan memakai $\\cos^2 = 1 - \\sin^2$, yang kedua punya dua wajah lagi:\n$$\\cos 2\\theta = 1 - 2\\sin^2\\theta = 2\\cos^2\\theta - 1$$\nDisusun ulang, kedua bentuk terakhir menjadi rumus **setengah sudut** $\\sin^2\\theta = \\frac{1 - \\cos 2\\theta}{2}$ dan $\\cos^2\\theta = \\frac{1 + \\cos 2\\theta}{2}$, dan lewat itulah integral fungsi trigonometri berkuadrat nanti dikerjakan.\n\nSatu peringatan yang tak pernah berhenti diperlukan: $\\sin(A + B)$ **bukan** $\\sin A + \\sin B$.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Given $\\sin\\theta = \\tfrac{3}{5}$ with $\\theta$ in the second quadrant, order the working for $\\cos\\theta$.',
                id: 'Diberikan $\\sin\\theta = \\tfrac{3}{5}$ dengan $\\theta$ di kuadran kedua, susun langkah untuk mencari $\\cos\\theta$.',
              },
              lines: {
                en: [
                  '\\cos^2\\theta = 1 - \\sin^2\\theta = 1 - \\tfrac{9}{25}',
                  '\\cos^2\\theta = \\tfrac{16}{25}',
                  '\\cos\\theta = \\pm\\tfrac{4}{5}',
                  '\\text{quadrant II} \\Rightarrow \\cos\\theta = -\\tfrac{4}{5}',
                ],
                id: [
                  '\\cos^2\\theta = 1 - \\sin^2\\theta = 1 - \\tfrac{9}{25}',
                  '\\cos^2\\theta = \\tfrac{16}{25}',
                  '\\cos\\theta = \\pm\\tfrac{4}{5}',
                  '\\text{kuadran II} \\Rightarrow \\cos\\theta = -\\tfrac{4}{5}',
                ],
              },
              explain: {
                en: 'The identity only ever gives the square, so it gives two candidates. The quadrant is what chooses between them — and it is the step people leave out.',
                id: 'Identitasnya hanya pernah memberi kuadratnya, jadi ia memberi dua calon. Kuadrannyalah yang memilih di antara keduanya — dan justru langkah itulah yang sering ditinggalkan.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'With $\\sin\\theta = \\tfrac{3}{5}$ and $\\theta$ in the second quadrant, find each.',
                id: 'Dengan $\\sin\\theta = \\tfrac{3}{5}$ dan $\\theta$ di kuadran kedua, tentukan masing-masing.',
              },
              blanks: [
                { label: '\\cos\\theta =', answer: -0.8 },
                { label: '\\tan\\theta =', answer: -0.75 },
                { label: '\\sin 2\\theta =', answer: -0.96 },
              ],
              hints: [
                { en: 'Cosine first, then tangent is the ratio, then the double angle formula.', id: 'Cosinus dulu, lalu tangen sebagai perbandingannya, baru rumus sudut ganda.' },
                { en: '$\\sin 2\\theta = 2\\sin\\theta\\cos\\theta = 2 \\cdot \\tfrac{3}{5} \\cdot \\left(-\\tfrac{4}{5}\\right)$.', id: '$\\sin 2\\theta = 2\\sin\\theta\\cos\\theta = 2 \\cdot \\tfrac{3}{5} \\cdot \\left(-\\tfrac{4}{5}\\right)$.' },
              ],
              solution: [
                '\\cos\\theta = -\\tfrac{4}{5} = -0{,}8',
                '\\tan\\theta = \\tfrac{3/5}{-4/5} = -\\tfrac{3}{4} = -0{,}75',
                '\\sin 2\\theta = 2\\left(\\tfrac{3}{5}\\right)\\left(-\\tfrac{4}{5}\\right) = -\\tfrac{24}{25} = -0{,}96',
              ],
              explain: {
                en: 'Since $\\sin 2\\theta$ is negative while $\\sin\\theta$ is positive, doubling the angle has carried it out of the second quadrant — and it has: $\\theta$ is about $143^\\circ$, so $2\\theta$ is about $287^\\circ$.',
                id: 'Karena $\\sin 2\\theta$ negatif sementara $\\sin\\theta$ positif, menggandakan sudutnya telah membawanya keluar dari kuadran kedua — dan memang begitu: $\\theta$ sekitar $143^\\circ$, jadi $2\\theta$ sekitar $287^\\circ$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'fun-m3-s1-p',
        runtime: 'math',
        title: { en: 'Angles, Values, Identities', id: 'Sudut, Nilai, Identitas' },
        brief: {
          en: 'A conversion with an arc, a set of exact values, and one identity chain from a single given.',
          id: 'Satu konversi beserta busurnya, sekumpulan nilai eksak, dan satu rangkaian identitas dari satu keterangan saja.',
        },
        requirements: [
          { en: 'Work in radians unless a question says degrees.', id: 'Bekerjalah dalam radian kecuali soalnya menyebut derajat.' },
          { en: 'Decide the quadrant before you choose a sign.', id: 'Tentukan kuadrannya sebelum memilih tanda.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Convert $150^\\circ$ to radians, then find the arc it cuts on a circle of radius 6.',
              id: 'Ubah $150^\\circ$ menjadi radian, lalu tentukan busur yang dipotongnya pada lingkaran berjari-jari 6.',
            },
            blanks: [
              { label: '\\theta =', answer: (5 * Math.PI) / 6 },
              { label: 's =', answer: 5 * Math.PI },
            ],
            solution: [
              '150 \\cdot \\tfrac{\\pi}{180} = \\tfrac{5\\pi}{6}',
              's = 6 \\cdot \\tfrac{5\\pi}{6} = 5\\pi \\approx 15{,}71',
            ],
          },
          {
            prompt: {
              en: 'Give the exact values of $\\sin\\tfrac{\\pi}{3}$, $\\cos\\pi$ and $\\tan\\tfrac{3\\pi}{4}$.',
              id: 'Sebutkan nilai eksak dari $\\sin\\tfrac{\\pi}{3}$, $\\cos\\pi$, dan $\\tan\\tfrac{3\\pi}{4}$.',
            },
            inline: true,
            blanks: [{ answer: Math.sqrt(3) / 2 }, { answer: -1 }, { answer: -1 }],
            solution: [
              '\\sin\\tfrac{\\pi}{3} = \\tfrac{\\sqrt3}{2}, \\qquad \\cos\\pi = -1',
              '\\tan\\tfrac{3\\pi}{4} = \\tfrac{\\sqrt2/2}{-\\sqrt2/2} = -1',
            ],
          },
          {
            prompt: {
              en: 'Given $\\cos\\theta = -\\tfrac{5}{13}$ with $\\theta$ in the third quadrant, find $\\sin\\theta$ and $\\cos 2\\theta$.',
              id: 'Diberikan $\\cos\\theta = -\\tfrac{5}{13}$ dengan $\\theta$ di kuadran ketiga, tentukan $\\sin\\theta$ dan $\\cos 2\\theta$.',
            },
            blanks: [
              { label: '\\sin\\theta =', answer: -12 / 13 },
              { label: '\\cos 2\\theta =', answer: -119 / 169 },
            ],
            solution: {
              en: [
                '\\sin^2\\theta = 1 - \\tfrac{25}{169} = \\tfrac{144}{169} \\Rightarrow \\sin\\theta = \\pm\\tfrac{12}{13}',
                '\\text{quadrant III} \\Rightarrow \\sin\\theta = -\\tfrac{12}{13}',
                '\\cos 2\\theta = 2\\cos^2\\theta - 1 = \\tfrac{50}{169} - 1 = -\\tfrac{119}{169} \\approx -0{,}704',
              ],
              id: [
                '\\sin^2\\theta = 1 - \\tfrac{25}{169} = \\tfrac{144}{169} \\Rightarrow \\sin\\theta = \\pm\\tfrac{12}{13}',
                '\\text{kuadran III} \\Rightarrow \\sin\\theta = -\\tfrac{12}{13}',
                '\\cos 2\\theta = 2\\cos^2\\theta - 1 = \\tfrac{50}{169} - 1 = -\\tfrac{119}{169} \\approx -0{,}704',
              ],
            },
          },
        ],
        hints: [
          {
            en: 'In the third quadrant both coordinates are negative, so both sine and cosine are.',
            id: 'Di kuadran ketiga kedua koordinatnya negatif, jadi sinus dan cosinusnya sama-sama negatif.',
          },
          {
            en: 'For $\\cos 2\\theta$, the version $2\\cos^2\\theta - 1$ needs only what you were given — no sign decision at all.',
            id: 'Untuk $\\cos 2\\theta$, bentuk $2\\cos^2\\theta - 1$ hanya memerlukan yang sudah diberikan — sama sekali tak perlu memutuskan tanda.',
          },
        ],
        xp: 50,
      },
    },

    /* ---------------------------------------------------------- 3.2 graphs */
    {
      id: 'fun-m3-s2',
      title: { en: 'Trigonometric Graphs', id: 'Grafik Trigonometri' },
      summary: {
        en: 'Period and amplitude, the general sinusoid, and the four functions that have asymptotes.',
        id: 'Periode dan amplitudo, sinusoid umum, serta empat fungsi yang punya asimtot.',
      },
      lessons: [
        {
          id: 'fun-m3-s2-l1',
          title: { en: 'Sine and Cosine', id: 'Sinus dan Cosinus' },
          goal: {
            en: 'Draw both graphs from memory, and state period, amplitude, domain and range.',
            id: 'Menggambar kedua grafiknya dari ingatan, serta menyebut periode, amplitudo, domain, dan range-nya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Going round again', id: 'Berputar lagi' },
              body: {
                en: 'Walking round the unit circle brings you back where you started after $2\\pi$, so\n$$\\sin(x + 2\\pi) = \\sin x, \\qquad \\cos(x + 2\\pi) = \\cos x$$\nA function with $f(x + p) = f(x)$ for some smallest positive $p$ is **periodic** with **period** $p$. Sine and cosine have period $2\\pi$; their graphs are one shape repeated forever in both directions.\n\nBoth have domain all of $R$ — you can go round by any amount — and range $[-1, 1]$, because a coordinate on a circle of radius 1 cannot be bigger than 1. Half the distance from the lowest to the highest value is the **amplitude**, here 1.\n\nOne is the other shifted: $\\cos x = \\sin\\left(x + \\tfrac{\\pi}{2}\\right)$. They are the same wave, started at different moments.',
                id: 'Berjalan mengelilingi lingkaran satuan membawamu kembali ke tempat semula setelah $2\\pi$, sehingga\n$$\\sin(x + 2\\pi) = \\sin x, \\qquad \\cos(x + 2\\pi) = \\cos x$$\nFungsi dengan $f(x + p) = f(x)$ untuk suatu $p$ positif terkecil disebut **periodik** dengan **periode** $p$. Sinus dan cosinus berperiode $2\\pi$; grafiknya satu bentuk yang berulang selamanya ke dua arah.\n\nKeduanya berdomain seluruh $R$ — kamu boleh berputar sebanyak apa pun — dan berrange $[-1, 1]$, sebab koordinat pada lingkaran berjari-jari 1 tak mungkin lebih besar dari 1. Separuh jarak dari nilai terendah ke tertinggi disebut **amplitudo**, di sini 1.\n\nYang satu adalah yang lain yang digeser: $\\cos x = \\sin\\left(x + \\tfrac{\\pi}{2}\\right)$. Keduanya gelombang yang sama, hanya dimulai pada saat yang berbeda.',
              },
              figure: {
                dim: 2,
                xSpan: [-6.5, 6.5],
                ySpan: [-1.8, 1.8],
                ticks: true,
                items: [
                  { t: 'curve', f: 'sin(x)', color: 'a', label: 'sin x' },
                  { t: 'curve', f: 'cos(x)', color: 'b', label: 'cos x' },
                  { t: 'hline', y: 1 },
                  { t: 'hline', y: -1 },
                ],
                caption: {
                  en: 'Two copies of one wave, a quarter-turn apart. Neither ever leaves the band between $-1$ and $1$, and both repeat every $2\\pi \\approx 6{,}28$.',
                  id: 'Dua salinan dari satu gelombang, berselisih seperempat putaran. Tak satu pun pernah keluar dari pita antara $-1$ dan $1$, dan keduanya berulang tiap $2\\pi \\approx 6{,}28$.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Sine is odd and cosine is even. What does that say about their graphs?',
                id: 'Sinus itu ganjil dan cosinus itu genap. Apa artinya bagi grafik keduanya?',
              },
              options: [
                { en: 'Both are symmetric about the $y$-axis.', id: 'Keduanya simetris terhadap sumbu $y$.' },
                { en: 'Sine is symmetric about the origin; cosine about the $y$-axis.', id: 'Sinus simetris terhadap titik asal; cosinus terhadap sumbu $y$.' },
                { en: 'Sine is symmetric about the $y$-axis; cosine about the origin.', id: 'Sinus simetris terhadap sumbu $y$; cosinus terhadap titik asal.' },
                { en: 'Neither has any symmetry.', id: 'Keduanya tak punya kesimetrian.' },
              ],
              answer: 1,
              explain: {
                en: '$\\sin(-x) = -\\sin x$ is the origin symmetry; $\\cos(-x) = \\cos x$ is the $y$-axis one. On the circle this is just reflecting the point across the horizontal axis: the first coordinate is unchanged, the second changes sign.',
                id: '$\\sin(-x) = -\\sin x$ adalah kesimetrian titik asal; $\\cos(-x) = \\cos x$ adalah kesimetrian sumbu $y$. Pada lingkaran, ini tak lain mencerminkan titiknya terhadap sumbu mendatar: koordinat pertamanya tetap, koordinat keduanya berganti tanda.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Read these off the graph or the circle.',
                id: 'Bacalah nilai-nilai ini dari grafiknya atau dari lingkarannya.',
              },
              blanks: [
                { label: '\\sin\\pi =', answer: 0 },
                { label: '\\cos\\tfrac{\\pi}{2} =', answer: 0 },
                { label: '\\sin\\tfrac{3\\pi}{2} =', answer: -1 },
                { label: '\\cos 2\\pi =', answer: 1 },
              ],
              hints: [
                { en: 'These are the four points where the circle meets an axis.', id: 'Keempatnya adalah titik-titik tempat lingkarannya menyentuh sumbu.' },
                { en: '$\\tfrac{3\\pi}{2}$ is three-quarters of the way round: straight down.', id: '$\\tfrac{3\\pi}{2}$ adalah tiga perempat putaran: tepat ke bawah.' },
              ],
              explain: {
                en: 'Every one of these is a coordinate of $(1,0)$, $(0,1)$, $(-1,0)$ or $(0,-1)$. Knowing those four points is most of knowing the graphs.',
                id: 'Tiap nilainya adalah koordinat dari $(1,0)$, $(0,1)$, $(-1,0)$, atau $(0,-1)$. Menguasai keempat titik itu sudah sebagian besar dari menguasai grafiknya.',
              },
            },
          ],
        },
        {
          id: 'fun-m3-s2-l2',
          title: { en: 'The General Sinusoid', id: 'Sinusoid Umum' },
          goal: {
            en: 'Read amplitude, period, phase shift and midline out of $y = A\\sin(B(x - C)) + D$.',
            id: 'Membaca amplitudo, periode, pergeseran fase, dan garis tengah dari $y = A\\sin(B(x - C)) + D$.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Four numbers, four jobs', id: 'Empat bilangan, empat tugas' },
              body: {
                en: 'This is Module 2 applied to one wave:\n$$y = A\\sin\\big(B(x - C)\\big) + D$$\n**$|A|$ is the amplitude** — how tall the wave is above and below its middle. A negative $A$ also turns it upside down.\n**$B$ sets the period**, which is $\\dfrac{2\\pi}{|B|}$. Bigger $B$ means more waves in the same space, not fewer.\n**$C$ is the phase shift**, how far right the wave starts.\n**$D$ is the midline**, the level the wave oscillates about. The range is $[D - |A|, \\ D + |A|]$.\n\nAs always the inside must be factored first. $y = \\sin(2x - \\pi)$ is $\\sin\\left(2\\left(x - \\tfrac{\\pi}{2}\\right)\\right)$: period $\\pi$, shifted $\\tfrac{\\pi}{2}$ — not $\\pi$.',
                id: 'Ini Modul 2 yang diterapkan pada satu gelombang:\n$$y = A\\sin\\big(B(x - C)\\big) + D$$\n**$|A|$ adalah amplitudo** — seberapa tinggi gelombangnya di atas dan di bawah garis tengahnya. $A$ yang negatif juga membalikkannya.\n**$B$ menentukan periode**, yaitu $\\dfrac{2\\pi}{|B|}$. $B$ yang lebih besar berarti lebih banyak gelombang dalam ruang yang sama, bukan lebih sedikit.\n**$C$ adalah pergeseran fase**, sejauh apa gelombangnya bermula ke kanan.\n**$D$ adalah garis tengah**, ketinggian tempat gelombangnya berayun. Range-nya $[D - |A|, \\ D + |A|]$.\n\nSeperti biasa bagian dalamnya harus difaktorkan lebih dulu. $y = \\sin(2x - \\pi)$ adalah $\\sin\\left(2\\left(x - \\tfrac{\\pi}{2}\\right)\\right)$: periodenya $\\pi$, pergeserannya $\\tfrac{\\pi}{2}$ — bukan $\\pi$.',
              },
              figure: {
                dim: 2,
                xSpan: [-6.5, 6.5],
                ySpan: [-5, 5],
                ticks: true,
                params: [
                  { name: 'a', min: -3, max: 3, step: 0.25, value: 1, label: 'A' },
                  { name: 'b', min: 0.5, max: 3, step: 0.25, value: 1, label: 'B' },
                  { name: 'd', min: -2, max: 2, step: 0.5, value: 0, label: 'D' },
                ],
                items: [
                  { t: 'curve', f: 'sin(x)', color: 'muted', dashed: true, label: 'sin x' },
                  { t: 'curve', f: 'a*sin(b*x)+d', color: 'a', label: 'A sin(Bx) + D' },
                  { t: 'hline', y: 'd', label: 'garis tengah' },
                  { t: 'hline', y: 'd+abs(a)', color: 'b' },
                  { t: 'hline', y: 'd-abs(a)', color: 'b' },
                ],
                caption: {
                  en: 'Move $A$ and the wave grows between the two outer lines; move $B$ and it packs tighter without changing height; move $D$ and the whole thing rides up. Negative $A$ turns it over.',
                  id: 'Geser $A$ dan gelombangnya membesar di antara kedua garis luar; geser $B$ dan ia merapat tanpa berubah tinggi; geser $D$ dan seluruhnya terangkat. $A$ yang negatif membalikkannya.',
                },
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the period of $y = 4\\cos(3x)$.',
                id: 'Lengkapi periode dari $y = 4\\cos(3x)$.',
              },
              template: { en: '\\text{period} = \\frac{2\\pi}{___}', id: '\\text{periode} = \\frac{2\\pi}{___}' },
              blanks: ['3'],
              explain: {
                en: 'The period is $\\frac{2\\pi}{|B|} = \\frac{2\\pi}{3}$. The 4 out front changes the height, never the period.',
                id: 'Periodenya $\\frac{2\\pi}{|B|} = \\frac{2\\pi}{3}$. Angka 4 di depan mengubah tingginya, tak pernah periodenya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is the range of $y = -2\\sin x + 5$?',
                id: 'Berapa range dari $y = -2\\sin x + 5$?',
              },
              options: [
                { en: '$[-2, 2]$', id: '$[-2, 2]$' },
                { en: '$[3, 7]$', id: '$[3, 7]$' },
                { en: '$[-7, -3]$', id: '$[-7, -3]$' },
                { en: '$[5, 7]$', id: '$[5, 7]$' },
              ],
              answer: 1,
              explain: {
                en: 'Midline 5, amplitude $|-2| = 2$, so $[5-2, 5+2] = [3, 7]$. The minus sign flips the wave but does not move the band it lives in — the highest and lowest values are the same either way.',
                id: 'Garis tengah 5, amplitudo $|-2| = 2$, jadi $[5-2, 5+2] = [3, 7]$. Tanda minusnya membalik gelombangnya tetapi tidak memindahkan pita tempatnya berada — nilai tertinggi dan terendahnya sama saja.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $y = 3\\sin(2x - \\pi) + 1$, find each of these.',
                id: 'Untuk $y = 3\\sin(2x - \\pi) + 1$, tentukan masing-masing.',
              },
              blanks: [
                { label: { en: '\\text{amplitude} =', id: '\\text{amplitudo} =' }, answer: 3 },
                { label: { en: '\\text{period} =', id: '\\text{periode} =' }, answer: Math.PI },
                { label: { en: '\\text{phase shift} =', id: '\\text{pergeseran fase} =' }, answer: Math.PI / 2 },
                { label: { en: 'y_{\\text{max}} =', id: 'y_{\\text{maks}} =' }, answer: 4 },
              ],
              hints: [
                { en: 'Factor the inside: $2x - \\pi = 2\\left(x - \\tfrac{\\pi}{2}\\right)$.', id: 'Faktorkan bagian dalamnya: $2x - \\pi = 2\\left(x - \\tfrac{\\pi}{2}\\right)$.' },
                { en: 'The maximum is midline plus amplitude.', id: 'Nilai maksimumnya adalah garis tengah ditambah amplitudo.' },
              ],
              solution: {
                en: [
                  'y = 3\\sin\\left(2\\left(x - \\tfrac{\\pi}{2}\\right)\\right) + 1',
                  'A = 3, \\quad B = 2 \\Rightarrow \\text{period} = \\tfrac{2\\pi}{2} = \\pi',
                  'C = \\tfrac{\\pi}{2}, \\quad D = 1 \\Rightarrow y_{\\text{max}} = 1 + 3 = 4',
                ],
                id: [
                  'y = 3\\sin\\left(2\\left(x - \\tfrac{\\pi}{2}\\right)\\right) + 1',
                  'A = 3, \\quad B = 2 \\Rightarrow \\text{periode} = \\tfrac{2\\pi}{2} = \\pi',
                  'C = \\tfrac{\\pi}{2}, \\quad D = 1 \\Rightarrow y_{\\text{maks}} = 1 + 3 = 4',
                ],
              },
              explain: {
                en: 'Reading $C = \\pi$ straight off the unfactored formula is the mistake this question exists to catch. The shift is $\\tfrac{\\pi}{2}$.',
                id: 'Membaca $C = \\pi$ langsung dari rumus yang belum difaktorkan adalah kekeliruan yang justru ingin ditangkap soal ini. Pergeserannya $\\tfrac{\\pi}{2}$.',
              },
            },
          ],
        },
        {
          id: 'fun-m3-s2-l3',
          title: { en: 'Tangent and the Reciprocals', id: 'Tangen dan Kebalikannya' },
          goal: {
            en: 'Know where the other four functions blow up, and why their periods differ.',
            id: 'Mengetahui di mana empat fungsi lainnya meledak, dan mengapa periodenya berbeda.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A gap wherever the denominator is zero', id: 'Berlubang di mana pun penyebutnya nol' },
              body: {
                en: '$\\tan x = \\dfrac{\\sin x}{\\cos x}$ is undefined exactly where $\\cos x = 0$, which is at $\\pm\\tfrac{\\pi}{2}, \\pm\\tfrac{3\\pi}{2}, \\ldots$ — that is, at $\\tfrac{\\pi}{2} + k\\pi$ for every whole $k$. At each of those the graph has a **vertical asymptote**: it runs off to $+\\infty$ on one side and comes back from $-\\infty$ on the other.\n\nBetween two asymptotes it climbs once through every real number, so its **range is all of $R$** — unlike sine and cosine. And its **period is $\\pi$**, not $2\\pi$: going half a turn round the circle negates both coordinates, which leaves the ratio alone.\n\n$\\sec x = 1/\\cos x$ has the same asymptotes as tangent, and $\\csc x = 1/\\sin x$ has them where $\\sin x = 0$, at every multiple of $\\pi$. Both have range $(-\\infty, -1] \\cup [1, \\infty)$ — the reciprocal of something no bigger than 1 is never smaller than 1.',
                id: '$\\tan x = \\dfrac{\\sin x}{\\cos x}$ tak terdefinisi persis di tempat $\\cos x = 0$, yaitu di $\\pm\\tfrac{\\pi}{2}, \\pm\\tfrac{3\\pi}{2}, \\ldots$ — dengan kata lain di $\\tfrac{\\pi}{2} + k\\pi$ untuk setiap bilangan bulat $k$. Di tiap tempat itu grafiknya punya **asimtot tegak**: ia lari ke $+\\infty$ di satu sisi dan kembali dari $-\\infty$ di sisi lain.\n\nDi antara dua asimtot ia menanjak sekali melewati setiap bilangan real, sehingga **range-nya seluruh $R$** — berbeda dari sinus dan cosinus. Dan **periodenya $\\pi$**, bukan $2\\pi$: berjalan setengah putaran pada lingkaran menegatifkan kedua koordinatnya, dan itu membiarkan perbandingannya tak berubah.\n\n$\\sec x = 1/\\cos x$ punya asimtot yang sama dengan tangen, dan $\\csc x = 1/\\sin x$ punya asimtot di tempat $\\sin x = 0$, yaitu di setiap kelipatan $\\pi$. Keduanya berrange $(-\\infty, -1] \\cup [1, \\infty)$ — kebalikan dari sesuatu yang tak lebih besar dari 1 tak pernah lebih kecil dari 1.',
              },
              figure: {
                dim: 2,
                xSpan: [-6.5, 6.5],
                ySpan: [-5, 5],
                ticks: true,
                items: [
                  { t: 'curve', f: 'tan(x)', color: 'a', label: 'tan x' },
                  { t: 'vline', x: 'pi/2' },
                  { t: 'vline', x: '-pi/2' },
                  { t: 'vline', x: '3*pi/2' },
                  { t: 'vline', x: '-3*pi/2' },
                ],
                caption: {
                  en: 'One complete branch fits between each pair of dashed lines, and the whole picture repeats every $\\pi$. The gaps are not places where the curve is steep — they are places where there is no value at all.',
                  id: 'Satu cabang utuh muat di antara tiap pasang garis putus-putus, dan seluruh gambarnya berulang tiap $\\pi$. Celahnya bukan tempat kurvanya curam — melainkan tempat yang sama sekali tak punya nilai.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Where does $y = \\sec x$ have vertical asymptotes?',
                id: 'Di mana $y = \\sec x$ mempunyai asimtot tegak?',
              },
              options: [
                { en: 'At every multiple of $\\pi$', id: 'Di setiap kelipatan $\\pi$' },
                { en: 'At $\\tfrac{\\pi}{2} + k\\pi$', id: 'Di $\\tfrac{\\pi}{2} + k\\pi$' },
                { en: 'Nowhere', id: 'Tidak di mana pun' },
                { en: 'At $x = \\pm 1$', id: 'Di $x = \\pm 1$' },
              ],
              answer: 1,
              explain: {
                en: '$\\sec x = 1/\\cos x$, so it fails exactly where cosine is zero — the same places tangent fails, since they share the denominator.',
                id: '$\\sec x = 1/\\cos x$, jadi ia gagal persis di tempat cosinusnya nol — tempat yang sama dengan kegagalan tangen, sebab keduanya berbagi penyebut.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Answer each from the definitions.',
                id: 'Jawab masing-masing dari definisinya.',
              },
              blanks: [
                { label: '\\tan\\tfrac{\\pi}{3} =', answer: Math.sqrt(3) },
                { label: '\\sec\\pi =', answer: -1 },
                { label: { en: '\\text{period } \\tan =', id: '\\text{periode } \\tan =' }, answer: Math.PI },
                { label: { en: '\\text{smallest positive tan asymptote: } x =', id: '\\text{asimtot tan positif terkecil: } x =' }, answer: Math.PI / 2 },
              ],
              hints: [
                { en: '$\\tan\\tfrac{\\pi}{3} = \\tfrac{\\sqrt3/2}{1/2}$.', id: '$\\tan\\tfrac{\\pi}{3} = \\tfrac{\\sqrt3/2}{1/2}$.' },
                { en: '$\\sec\\pi = 1/\\cos\\pi = 1/(-1)$.', id: '$\\sec\\pi = 1/\\cos\\pi = 1/(-1)$.' },
              ],
              solution: {
                en: [
                  '\\tan\\tfrac{\\pi}{3} = \\tfrac{\\sqrt3/2}{1/2} = \\sqrt3 \\approx 1{,}73',
                  '\\sec\\pi = \\tfrac{1}{-1} = -1',
                  '\\text{period } \\tan = \\pi, \\qquad \\text{first asymptote } x = \\tfrac{\\pi}{2}',
                ],
                id: [
                  '\\tan\\tfrac{\\pi}{3} = \\tfrac{\\sqrt3/2}{1/2} = \\sqrt3 \\approx 1{,}73',
                  '\\sec\\pi = \\tfrac{1}{-1} = -1',
                  '\\text{periode } \\tan = \\pi, \\qquad \\text{asimtot pertama } x = \\tfrac{\\pi}{2}',
                ],
              },
              explain: {
                en: 'Dividing the two circle coordinates is all a tangent ever is, and $\\sqrt{3}$ is what $\\tfrac{\\sqrt3/2}{1/2}$ comes to. Notice it is larger than 1 — tangent is not bounded the way its two parents are.',
                id: 'Membagi kedua koordinat lingkaran itulah seluruh isi tangen, dan $\\sqrt{3}$ adalah hasil dari $\\tfrac{\\sqrt3/2}{1/2}$. Perhatikan nilainya lebih besar dari 1 — tangen tidak terbatas seperti kedua induknya.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'fun-m3-s2-p',
        runtime: 'math',
        title: { en: 'Reading a Wave', id: 'Membaca Gelombang' },
        brief: {
          en: 'Pull the four numbers out of two sinusoids, and locate an asymptote.',
          id: 'Menarik keempat bilangan dari dua sinusoid, dan menemukan letak sebuah asimtot.',
        },
        requirements: [
          { en: 'Factor the inside of the bracket before reading a phase shift.', id: 'Faktorkan isi kurungnya sebelum membaca pergeseran fase.' },
          { en: 'You may type `pi` and `pi/4` — the boxes read them.', id: 'Kamu boleh mengetik `pi` dan `pi/4` — kotaknya membacanya.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'For $y = 5\\cos\\left(\\tfrac{x}{2}\\right) - 3$, give the amplitude, the period and the smallest value.',
              id: 'Untuk $y = 5\\cos\\left(\\tfrac{x}{2}\\right) - 3$, sebutkan amplitudo, periode, dan nilai terkecilnya.',
            },
            blanks: [
              { label: '|A| =', answer: 5 },
              { label: { en: '\\text{period} =', id: '\\text{periode} =' }, answer: 4 * Math.PI },
              { label: 'y_{\\min} =', answer: -8 },
            ],
            solution: {
              en: [
                'B = \\tfrac{1}{2} \\Rightarrow \\text{period} = \\tfrac{2\\pi}{1/2} = 4\\pi \\approx 12{,}57',
                'y_{\\min} = D - |A| = -3 - 5 = -8',
              ],
              id: [
                'B = \\tfrac{1}{2} \\Rightarrow \\text{periode} = \\tfrac{2\\pi}{1/2} = 4\\pi \\approx 12{,}57',
                'y_{\\min} = D - |A| = -3 - 5 = -8',
              ],
            },
          },
          {
            prompt: {
              en: 'For $y = 2\\sin(4x + \\pi)$, give the period and the phase shift.',
              id: 'Untuk $y = 2\\sin(4x + \\pi)$, sebutkan periode dan pergeseran fasenya.',
            },
            blanks: [
              { label: { en: '\\text{period} =', id: '\\text{periode} =' }, answer: Math.PI / 2 },
              { label: 'C =', answer: -Math.PI / 4 },
            ],
            solution: {
              en: [
                '4x + \\pi = 4\\left(x + \\tfrac{\\pi}{4}\\right) = 4\\left(x - \\left(-\\tfrac{\\pi}{4}\\right)\\right)',
                '\\text{period} = \\tfrac{2\\pi}{4} = \\tfrac{\\pi}{2}, \\qquad C = -\\tfrac{\\pi}{4}',
              ],
              id: [
                '4x + \\pi = 4\\left(x + \\tfrac{\\pi}{4}\\right) = 4\\left(x - \\left(-\\tfrac{\\pi}{4}\\right)\\right)',
                '\\text{periode} = \\tfrac{2\\pi}{4} = \\tfrac{\\pi}{2}, \\qquad C = -\\tfrac{\\pi}{4}',
              ],
            },
          },
          {
            prompt: {
              en: 'The graph of $y = \\tan(2x)$ has its smallest positive asymptote at some $x$. Find it, and the period.',
              id: 'Grafik $y = \\tan(2x)$ mempunyai asimtot positif terkecil pada suatu $x$. Tentukan letaknya, dan periodenya.',
            },
            blanks: [
              { label: 'x =', answer: Math.PI / 4 },
              { label: { en: '\\text{period} =', id: '\\text{periode} =' }, answer: Math.PI / 2 },
            ],
            solution: {
              en: [
                '2x = \\tfrac{\\pi}{2} \\Rightarrow x = \\tfrac{\\pi}{4}',
                '\\text{period of tan} = \\tfrac{\\pi}{|B|} = \\tfrac{\\pi}{2}',
              ],
              id: [
                '2x = \\tfrac{\\pi}{2} \\Rightarrow x = \\tfrac{\\pi}{4}',
                '\\text{periode tan} = \\tfrac{\\pi}{|B|} = \\tfrac{\\pi}{2}',
              ],
            },
          },
        ],
        hints: [
          {
            en: 'A phase shift may be negative — that just means the wave starts to the left.',
            id: 'Pergeseran fase boleh negatif — itu sekadar berarti gelombangnya bermula di sebelah kiri.',
          },
          {
            en: 'The period of tangent is $\\pi/|B|$, not $2\\pi/|B|$: it repeats twice as often as sine does.',
            id: 'Periode tangen adalah $\\pi/|B|$, bukan $2\\pi/|B|$: ia berulang dua kali lebih sering daripada sinus.',
          },
        ],
        xp: 50,
      },
    },
  ],
}
