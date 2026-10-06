import type { Lesson } from '../types'
import { L, fit, outline, rectPts, solid, txt } from './figs'

/** Module 7 — nets of solids, and fitting nets on a sheet. */

/** The net of a 4 × 3 × 2 box, drawn to scale, each face marked with its area. */
const boxNet = () => {
  const faces: [number, number, number, number, string][] = [
    [0, 0, 4, 3, '12'], // bottom
    [0, 3, 4, 2, '8'], // back
    [0, -2, 4, 2, '8'], // front
    [0, -5, 4, 3, '12'], // top
    [-2, 0, 2, 3, '6'], // left
    [4, 0, 2, 3, '6'], // right
  ]
  const items = faces.flatMap(([x, y, w, h, a]) => [
    outline(rectPts(x, y, w, h), 'a'),
    txt(x + w / 2, y + h / 2 - 0.15, a, 'md', 'muted'),
  ])
  items.push(txt(2, 5.6, '4', 'md', 'result'), txt(-2.6, 1.5, '3', 'md', 'result'), txt(-1, 3.6, '2', 'md', 'result'))
  return { dim: 2 as const, axes: false, ...fit([[-3.2, -5.4], [6.4, 6.2]], 0.3), items }
}

/** A 40 × 30 sheet with fifteen 8 × 10 pieces cut from it. */
const sheet = () => {
  const items = [outline(rectPts(0, 0, 40, 30), 'muted')]
  for (let c = 0; c < 5; c++) for (let r = 0; r < 3; r++) items.push(solid(rectPts(c * 8, r * 10, 8, 10), 'a'))
  items.push(txt(20, -2.6, '40', 'md', 'result'), txt(-2.6, 15, '30', 'md', 'result'))
  return { dim: 2 as const, axes: false, ...fit([[-5, -5], [42, 32]], 0.3), items }
}

export const lessonNets: Lesson = {
  id: 'tka-sma-m7-s2-l3',
  title: L('Nets of Solids and Packing', 'Jaring-Jaring Bangun Ruang dan Penataan'),
  goal: L(
    'You can find a surface area from a net, find the net of a cylinder, and decide how many nets fit on a sheet.',
    'Kamu bisa mencari luas permukaan dari jaring-jaring, menentukan jaring-jaring tabung, dan memutuskan berapa jaring-jaring yang muat pada selembar bahan.',
  ),
  xp: 20,
  steps: [
    {
      kind: 'concept',
      id: 'c1',
      title: L('Look Closely: A Box Cut Open', 'Ayo Amati: Balok yang Dibuka'),
      body: L(
        'A **net** is a solid cut along some edges and laid flat. Its area is the **surface area** of the solid.\n\nThe picture shows a net of a box that is 4 long, 3 wide and 2 high. Every face is a rectangle, and the faces come in three equal pairs:\n\n1. Step 1: Bottom and top: $4\\times3=12$ each.\n2. Step 2: Front and back: $4\\times2=8$ each.\n3. Step 3: Left and right: $3\\times2=6$ each.\n4. Step 4: Add all six: $12+12+8+8+6+6=52$.\n\nSo the surface area is $2(12+8+6)=52$. A cube has a net of six equal squares.',
        '**Jaring-jaring** adalah bangun ruang yang digunting pada beberapa rusuknya dan dibentangkan. Luasnya sama dengan **luas permukaan** bangun ruang itu.\n\nGambar menunjukkan jaring-jaring balok yang panjangnya 4, lebarnya 3, dan tingginya 2. Setiap sisi berupa persegi panjang, dan sisinya terdiri dari tiga pasang yang sama:\n\n1. Langkah 1: Alas dan tutup: $4\\times3=12$ masing-masing.\n2. Langkah 2: Depan dan belakang: $4\\times2=8$ masing-masing.\n3. Langkah 3: Kiri dan kanan: $3\\times2=6$ masing-masing.\n4. Langkah 4: Jumlahkan keenamnya: $12+12+8+8+6+6=52$.\n\nJadi luas permukaannya $2(12+8+6)=52$. Kubus punya jaring-jaring berupa enam persegi yang sama.',
      ),
      figure: {
        ...boxNet(),
        caption: L('A net of a 4 × 3 × 2 box. Each face shows its area.', 'Jaring-jaring balok 4 × 3 × 2. Setiap sisi menunjukkan luasnya.'),
      },
    },
    {
      kind: 'concept',
      id: 'c2',
      title: L('Step by Step: The Net of a Cylinder', 'Contoh Bertahap: Jaring-Jaring Tabung'),
      body: L(
        'The net of a cylinder has **one rectangle and two circles**. The rectangle wraps around the side, so:\n\n- its **width** is the circumference of the base, $2\\pi r$;\n- its **height** is the height of the cylinder, $h$.\n\nA cylinder has $r=7$ and $h=10$. Use $\\pi=\\frac{22}{7}$.\n\n1. Step 1: Width of the rectangle: $2\\times\\frac{22}{7}\\times7=44$.\n2. Step 2: Area of the rectangle: $44\\times10=440$.\n3. Step 3: Each circle: $\\frac{22}{7}\\times7^2=154$, so two circles are $308$.\n4. Step 4: Surface area: $440+308=748$.\n\nThe net of a **cone** is one circle and one **sector** (a slice of a circle), not a triangle.',
        'Jaring-jaring tabung terdiri dari **satu persegi panjang dan dua lingkaran**. Persegi panjang itu membungkus sisi samping, sehingga:\n\n- **lebarnya** adalah keliling alas, $2\\pi r$;\n- **tingginya** adalah tinggi tabung, $t$.\n\nSebuah tabung punya $r=7$ dan $t=10$. Pakai $\\pi=\\frac{22}{7}$.\n\n1. Langkah 1: Lebar persegi panjang: $2\\times\\frac{22}{7}\\times7=44$.\n2. Langkah 2: Luas persegi panjang: $44\\times10=440$.\n3. Langkah 3: Tiap lingkaran: $\\frac{22}{7}\\times7^2=154$, jadi dua lingkaran $308$.\n4. Langkah 4: Luas permukaan: $440+308=748$.\n\nJaring-jaring **kerucut** adalah satu lingkaran dan satu **juring** (potongan lingkaran), bukan segitiga.',
      ),
    },
    {
      kind: 'concept',
      id: 'c3',
      title: L('Step by Step: Fitting Nets on a Sheet', 'Contoh Bertahap: Menata Jaring-Jaring pada Bahan'),
      body: L(
        'The net of the box above fits inside a rectangle of $8\\times10$: its width is $4+2+2=8$ and its height is $3+2+2+3=10$.\n\nHow many such nets can be cut from a sheet $40\\times30$ if each piece is kept straight (not tilted)?\n\n1. Step 1: Pieces standing as $8\\times10$: along 40 fit $\\frac{40}{8}=5$, along 30 fit $\\frac{30}{10}=3$. That is $5\\times3=15$.\n2. Step 2: Turn the pieces to $10\\times8$: $\\frac{40}{10}=4$ and $\\frac{30}{8}=3.75$, so $4\\times3=12$.\n3. Step 3: Try both ways and keep the larger: **15**.\n\nOnly **whole** pieces count, so round **down** each division. To find the cost, divide the number of nets needed by the number per sheet and round **up** to whole sheets.',
        'Jaring-jaring balok di atas muat dalam persegi panjang $8\\times10$: lebarnya $4+2+2=8$ dan tingginya $3+2+2+3=10$.\n\nBerapa jaring-jaring seperti itu yang bisa digunting dari selembar bahan $40\\times30$ bila tiap potongan diletakkan lurus (tidak miring)?\n\n1. Langkah 1: Potongan berdiri $8\\times10$: sepanjang 40 muat $\\frac{40}{8}=5$, sepanjang 30 muat $\\frac{30}{10}=3$. Jadi $5\\times3=15$.\n2. Langkah 2: Putar potongan menjadi $10\\times8$: $\\frac{40}{10}=4$ dan $\\frac{30}{8}=3{,}75$, jadi $4\\times3=12$.\n3. Langkah 3: Coba kedua cara dan ambil yang lebih besar: **15**.\n\nHanya potongan **utuh** yang dihitung, jadi bulatkan **ke bawah** setiap hasil bagi. Untuk menghitung biaya, bagi banyak jaring-jaring yang diperlukan dengan banyak per lembar lalu bulatkan **ke atas** menjadi lembar utuh.',
      ),
      figure: {
        ...sheet(),
        caption: L('Fifteen pieces of 8 × 10 cut from a sheet of 40 × 30.', 'Lima belas potongan 8 × 10 digunting dari bahan 40 × 30.'),
      },
    },
    {
      kind: 'quiz',
      id: 'q1',
      prompt: L(
        'The net in the picture folds into a box that is 4 long, 3 wide and 2 high. What is the surface area of the box?',
        'Jaring-jaring pada gambar dilipat menjadi balok yang panjangnya 4, lebarnya 3, dan tingginya 2. Berapa luas permukaan balok itu?',
      ),
      figure: {
        ...boxNet(),
        caption: L('A net of a 4 × 3 × 2 box.', 'Jaring-jaring balok 4 × 3 × 2.'),
      },
      options: ['52', '24', '26', '48', '104'].map((s) => L(s, s)),
      answer: 0,
      explain: L(
        'Three pairs of faces: $12+12+8+8+6+6=52$. The volume is $24$, which is a different thing. $26$ counts each pair once.',
        'Tiga pasang sisi: $12+12+8+8+6+6=52$. Volumenya $24$, itu hal yang berbeda. $26$ menghitung tiap pasang sekali saja.',
      ),
      hint: L(
        'Find the area of each face. The faces come in three equal pairs.',
        'Cari luas setiap sisi. Sisinya terdiri dari tiga pasang yang sama.',
      ),
    },
    {
      kind: 'fill',
      id: 'f1',
      math: true,
      prompt: L(
        'The net of a cylinder with $r=7$ and $h=10$ has a rectangle. Find the width of the rectangle and its area. Use $\\pi=\\frac{22}{7}$.',
        'Jaring-jaring tabung dengan $r=7$ dan $t=10$ memiliki sebuah persegi panjang. Cari lebar persegi panjang itu dan luasnya. Pakai $\\pi=\\frac{22}{7}$.',
      ),
      template: '2\\pi r=___ \\qquad 2\\pi r\\times h=___',
      blanks: ['44', '440'],
      explain: L(
        'The width is the circumference $2\\times\\frac{22}{7}\\times7=44$. The area is $44\\times10=440$.',
        'Lebarnya adalah keliling $2\\times\\frac{22}{7}\\times7=44$. Luasnya $44\\times10=440$.',
      ),
      hint: L(
        'The rectangle wraps around the side, so its width is the circumference of the base.',
        'Persegi panjang itu membungkus sisi samping, jadi lebarnya adalah keliling alas.',
      ),
    },
    {
      kind: 'multi',
      id: 'mc1',
      prompt: L('Choose the TWO true statements about nets.', 'Pilih DUA pernyataan yang benar tentang jaring-jaring.'),
      options: [
        L('The area of a net equals the surface area of the solid.', 'Luas jaring-jaring sama dengan luas permukaan bangun ruangnya.'),
        L('The net of a cube is made of six equal squares.', 'Jaring-jaring kubus terdiri dari enam persegi yang sama.'),
        L('The net of a cylinder is made of three rectangles.', 'Jaring-jaring tabung terdiri dari tiga persegi panjang.'),
        L('The net of a cone is a circle and a triangle.', 'Jaring-jaring kerucut adalah satu lingkaran dan satu segitiga.'),
      ],
      answer: [0, 1],
      explain: L(
        'A cylinder has one rectangle and two circles. A cone has one circle and one sector, not a triangle.',
        'Tabung punya satu persegi panjang dan dua lingkaran. Kerucut punya satu lingkaran dan satu juring, bukan segitiga.',
      ),
      hint: L(
        'Picture cutting each solid open and laying it flat.',
        'Bayangkan tiap bangun ruang digunting dan dibentangkan.',
      ),
    },
    {
      kind: 'judge',
      id: 'j1',
      prompt: L(
        'A box is 6 long, 4 wide and 3 high. Decide whether each statement is True or False.',
        'Sebuah balok panjangnya 6, lebarnya 4, dan tingginya 3. Tentukan tiap pernyataan Benar atau Salah.',
      ),
      statements: [
        L('The surface area is $108$.', 'Luas permukaannya $108$.'),
        L('Its net has three different pairs of equal rectangles.', 'Jaring-jaringnya punya tiga pasang persegi panjang yang sama.'),
        L('The surface area is $6\\times4\\times3=72$.', 'Luas permukaannya $6\\times4\\times3=72$.'),
        L('A sheet of area $108$ is always enough to cut the net from.', 'Bahan seluas $108$ selalu cukup untuk menggunting jaring-jaring itu.'),
      ],
      answer: [true, true, false, false],
      explain: L(
        'The surface area is $2(24+18+12)=108$. The product $72$ is the volume. A sheet of the same area leaves no room for waste, and the net must also fit inside the shape of the sheet.',
        'Luas permukaannya $2(24+18+12)=108$. Hasil kali $72$ adalah volume. Bahan yang luasnya sama tidak menyisakan ruang untuk sisa, dan jaring-jaring juga harus muat pada bentuk bahan.',
      ),
      hint: L(
        'Pair up the faces: $6\\times4$, $6\\times3$ and $4\\times3$, each twice.',
        'Pasangkan sisinya: $6\\times4$, $6\\times3$, dan $4\\times3$, masing-masing dua kali.',
      ),
    },
    {
      kind: 'math',
      id: 'm1',
      prompt: L(
        'Pieces of $8\\times10$ are cut from a sheet of $40\\times30$, all standing the same way. How many pieces fit at most?',
        'Potongan $8\\times10$ digunting dari bahan $40\\times30$, semuanya dengan arah yang sama. Paling banyak berapa potongan yang muat?',
      ),
      blanks: [{ answer: 15 }],
      hints: [
        L('Try the pieces standing both ways and keep the larger count.', 'Coba potongan dengan kedua arah dan ambil jumlah yang lebih besar.'),
        L('As $8\\times10$: $\\frac{40}{8}=5$ along the length and $\\frac{30}{10}=3$ across.', 'Sebagai $8\\times10$: $\\frac{40}{8}=5$ sepanjang bahan dan $\\frac{30}{10}=3$ melintang.'),
        L('As $10\\times8$: $4\\times3=12$. Keep the larger.', 'Sebagai $10\\times8$: $4\\times3=12$. Ambil yang lebih besar.'),
      ],
      explain: L(
        'One way gives $5\\times3=15$, the other gives $4\\times3=12$. The best is $15$.',
        'Satu cara memberi $5\\times3=15$, cara lain memberi $4\\times3=12$. Yang terbaik $15$.',
      ),
      solution: { en: ['\\frac{40}{8}\\times\\frac{30}{10}=5\\times3=15', '\\frac{40}{10}\\times\\frac{30}{8}\\to4\\times3=12', '\\text{largest}=15'], id: ['\\frac{40}{8}\\times\\frac{30}{10}=5\\times3=15', '\\frac{40}{10}\\times\\frac{30}{8}\\to4\\times3=12', '\\text{terbesar}=15'] },
    },
  ],
}
