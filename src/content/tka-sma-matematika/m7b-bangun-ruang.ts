import type { Submodule } from '../types'
import { L, cone2d, cylinder2d, prism3d, sphere2d } from './figs'
import { lessonNets } from './m7c-jaring'

/** Module 7, submodule 2 — volume and surface area of prisms, cylinders,
 *  pyramids, cones and spheres. */

export const m7s2: Submodule = {
  id: 'tka-sma-m7-s2',
  title: L('Volume and Surface Area of Solids', 'Volume dan Luas Permukaan Bangun Ruang'),
  summary: L(
    'Find the volume and the surface area of prisms, cylinders, pyramids, cones and spheres, and use them in problems.',
    'Mencari volume dan luas permukaan prisma, tabung, limas, kerucut, dan bola, serta memakainya dalam soal.',
  ),
  lessons: [
    /* ------------------------------------------------- L1 prisms and cylinders */
    {
      id: 'tka-sma-m7-s2-l1',
      title: L('Prisms and Cylinders', 'Prisma dan Tabung'),
      goal: L(
        'You can find the volume and surface area of a prism and a cylinder.',
        'Kamu bisa mencari volume dan luas permukaan prisma dan tabung.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: A Shape Stacked Up', 'Ayo Amati: Bangun yang Ditumpuk'),
          body: L(
            'A **prism** is a base shape pulled straight up by a height $h$. Every slice parallel to the base is the same. So its volume is the base area times the height:\n\n$$V=\\text{base area}\\times h$$\n\nThe picture shows a triangular prism. Its base is a right triangle with legs 4 and 3, so the base area is $\\frac{1}{2}\\times4\\times3=6$. With height $h=10$, the volume is $6\\times10=60$.\n\nFor a **box** the base is $l\\times w$, so $V=lwh$. For a **cube** of edge $a$, $V=a^3$.',
            '**Prisma** adalah bangun alas yang ditarik lurus ke atas setinggi $t$. Setiap irisan sejajar alas sama. Jadi volumenya adalah luas alas kali tinggi:\n\n$$V=\\text{luas alas}\\times t$$\n\nGambar menunjukkan prisma segitiga. Alasnya segitiga siku-siku dengan sisi tegak 4 dan 3, jadi luas alasnya $\\frac{1}{2}\\times4\\times3=6$. Dengan tinggi $t=10$, volumenya $6\\times10=60$.\n\nUntuk **balok** alasnya $p\\times l$, jadi $V=plt$. Untuk **kubus** berusuk $a$, $V=a^3$.',
          ),
          figure: {
            ...prism3d({ base: [[0, 0], [4, 0], [0, 3]], h: 10 }),
            caption: L('A triangular prism: base area 6, height 10.', 'Prisma segitiga: luas alas 6, tinggi 10.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Surface Area of a Prism', 'Contoh Bertahap: Luas Permukaan Prisma'),
          body: L(
            'The **surface area** is the total area of all faces. For a prism it is two bases plus the sides, and the sides together make one big rectangle when unrolled:\n\n$$\\text{surface area}=2\\times\\text{base area}+\\text{base perimeter}\\times h$$\n\nFor the triangular prism: legs 3 and 4, hypotenuse 5, height 10.\n\n1. Step 1: Two bases: $2\\times6=12$.\n2. Step 2: Base perimeter: $3+4+5=12$.\n3. Step 3: The sides: $12\\times10=120$.\n4. Step 4: Total: $12+120=132$.\n\nFor a cube of edge 5: $6\\times5^2=150$.\n\n**Watch out:** volume is in cubic units and surface area is in square units.',
            '**Luas permukaan** adalah jumlah luas semua sisi. Untuk prisma, luasnya dua alas ditambah sisi-sisi tegak, dan sisi tegak itu bersama-sama membentuk satu persegi panjang besar bila dibuka:\n\n$$\\text{luas permukaan}=2\\times\\text{luas alas}+\\text{keliling alas}\\times t$$\n\nUntuk prisma segitiga: sisi tegak 3 dan 4, sisi miring 5, tinggi 10.\n\n1. Langkah 1: Dua alas: $2\\times6=12$.\n2. Langkah 2: Keliling alas: $3+4+5=12$.\n3. Langkah 3: Sisi-sisi tegak: $12\\times10=120$.\n4. Langkah 4: Total: $12+120=132$.\n\nUntuk kubus berusuk 5: $6\\times5^2=150$.\n\n**Awas:** volume dalam satuan kubik dan luas permukaan dalam satuan persegi.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: The Cylinder', 'Contoh Bertahap: Tabung'),
          body: L(
            'A cylinder is a prism whose base is a circle of radius $r$:\n\n$$V=\\pi r^2h\\qquad\\text{surface area}=2\\pi r^2+2\\pi rh$$\n\nThe side, unrolled, is a rectangle of width $2\\pi r$ (the circumference) and height $h$. In the picture $r=3$ and $h=10$.\n\n1. Step 1: Volume: $\\pi\\times3^2\\times10=90\\pi$.\n2. Step 2: Two circles: $2\\pi\\times3^2=18\\pi$.\n3. Step 3: The side: $2\\pi\\times3\\times10=60\\pi$.\n4. Step 4: Surface area: $18\\pi+60\\pi=78\\pi$.\n\nDoubling the radius makes the volume **four** times as big ($r^2$), but doubling the height only doubles it.',
            'Tabung adalah prisma yang alasnya lingkaran berjari-jari $r$:\n\n$$V=\\pi r^2t\\qquad\\text{luas permukaan}=2\\pi r^2+2\\pi rt$$\n\nSelimutnya, jika dibuka, adalah persegi panjang selebar $2\\pi r$ (keliling) dan setinggi $t$. Pada gambar $r=3$ dan $t=10$.\n\n1. Langkah 1: Volume: $\\pi\\times3^2\\times10=90\\pi$.\n2. Langkah 2: Dua lingkaran: $2\\pi\\times3^2=18\\pi$.\n3. Langkah 3: Selimut: $2\\pi\\times3\\times10=60\\pi$.\n4. Langkah 4: Luas permukaan: $18\\pi+60\\pi=78\\pi$.\n\nMenggandakan jari-jari membuat volume **empat** kali ($r^2$), tetapi menggandakan tinggi hanya menggandakan volume.',
          ),
          figure: {
            ...cylinder2d({ r: 3, h: 10, labels: { r: '3', h: '10' } }),
            caption: L('A cylinder with radius 3 and height 10.', 'Tabung dengan jari-jari 3 dan tinggi 10.'),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'What is the volume of this cylinder?',
            'Berapa volume tabung ini?',
          ),
          figure: {
            ...cylinder2d({ r: 5, h: 4, labels: { r: '5', h: '4' } }),
            caption: L('A cylinder with radius 5 and height 4.', 'Tabung dengan jari-jari 5 dan tinggi 4.'),
          },
          options: [L('$100\\pi$', '$100\\pi$'), L('$40\\pi$', '$40\\pi$'), L('$200\\pi$', '$200\\pi$'), L('$50\\pi$', '$50\\pi$')],
          answer: 0,
          explain: L(
            '$V=\\pi r^2h=\\pi\\times25\\times4=100\\pi$. The value $40\\pi$ uses $r$ instead of $r^2$.',
            '$V=\\pi r^2t=\\pi\\times25\\times4=100\\pi$. Nilai $40\\pi$ memakai $r$ bukan $r^2$.',
          ),
          hint: L(
            'Square the radius first, then multiply by $\\pi$ and the height.',
            'Kuadratkan jari-jari dulu, lalu kalikan dengan $\\pi$ dan tinggi.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: a cylinder with $r=3$ and $h=10$. Find its volume and surface area (each is a multiple of $\\pi$).',
            'Coba bersama: tabung dengan $r=3$ dan $t=10$. Cari volume dan luas permukaannya (masing-masing kelipatan $\\pi$).',
          ),
          template: 'V=\\pi\\times3^2\\times10=___\\pi \\quad L=2\\pi\\times3^2+2\\pi\\times3\\times10=___\\pi',
          blanks: ['90', '78'],
          explain: L(
            '$9\\times10=90$, and $18+60=78$.',
            '$9\\times10=90$, dan $18+60=78$.',
          ),
          hint: L(
            'For the surface area add the two circles ($2\\pi r^2$) and the side ($2\\pi rh$).',
            'Untuk luas permukaan, jumlahkan dua lingkaran ($2\\pi r^2$) dan selimut ($2\\pi rt$).',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L('The volume of a prism is base area times height.', 'Volume prisma adalah luas alas kali tinggi.'),
            L('The side area of a cylinder is $2\\pi rh$.', 'Luas selimut tabung adalah $2\\pi rt$.'),
            L('The volume of a cylinder is $2\\pi r^2h$.', 'Volume tabung adalah $2\\pi r^2t$.'),
            L('The surface area of a box is $lwh$.', 'Luas permukaan balok adalah $plt$.'),
          ],
          answer: [0, 1],
          explain: L(
            'The cylinder volume is $\\pi r^2h$, and $lwh$ is the **volume** of a box. Its surface area is $2(lw+lh+wh)$.',
            'Volume tabung adalah $\\pi r^2t$, dan $plt$ adalah **volume** balok. Luas permukaannya $2(pl+pt+lt)$.',
          ),
          hint: L(
            'Check the units: volume has three lengths multiplied, area only two.',
            'Periksa satuannya: volume memuat tiga panjang yang dikalikan, luas hanya dua.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('A triangular prism with base area 6 and height 10 has volume 60.', 'Prisma segitiga dengan luas alas 6 dan tinggi 10 bervolume 60.'),
            L('Doubling the radius of a cylinder doubles its volume.', 'Menggandakan jari-jari tabung menggandakan volumenya.'),
            L('Doubling the height of a cylinder doubles its volume.', 'Menggandakan tinggi tabung menggandakan volumenya.'),
            L('A cube of edge 5 has surface area 125.', 'Kubus berusuk 5 berluas permukaan 125.'),
          ],
          answer: [true, false, true, false],
          explain: L(
            'The volume has $r^2$, so doubling $r$ gives four times the volume. A cube has 6 faces of area 25, so $150$, not $125$ (that is its volume).',
            'Volume memuat $r^2$, jadi menggandakan $r$ memberi volume empat kali. Kubus punya 6 sisi seluas 25, jadi $150$, bukan $125$ (itu volumenya).',
          ),
          hint: L(
            'Write the formula and see how the changed letter appears in it.',
            'Tulis rumusnya dan lihat bagaimana huruf yang diubah muncul di dalamnya.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'A cylindrical tank has radius 50 cm and height 140 cm. Use $\\pi=\\frac{22}{7}$. How many liters of water does it hold when full? ($1\\ \\text{L}=1\\,000\\ \\text{cm}^3$)',
            'Sebuah tangki berbentuk tabung berjari-jari 50 cm dan tinggi 140 cm. Pakai $\\pi=\\frac{22}{7}$. Berapa liter air yang termuat saat penuh? ($1\\ \\text{L}=1\\,000\\ \\text{cm}^3$)',
          ),
          blanks: [{ answer: 1100, after: '\\text{L}' }],
          hints: [
            L('First find the volume in cubic centimeters: $\\pi r^2h$.', 'Cari dulu volume dalam sentimeter kubik: $\\pi r^2t$.'),
            L('$V=\\frac{22}{7}\\times50^2\\times140=22\\times2\\,500\\times20=1\\,100\\,000\\ \\text{cm}^3$.', '$V=\\frac{22}{7}\\times50^2\\times140=22\\times2\\,500\\times20=1\\,100\\,000\\ \\text{cm}^3$.'),
            L('Divide by 1 000 to change to liters.', 'Bagi dengan 1.000 untuk mengubah ke liter.'),
          ],
          explain: L(
            '$140\\div7=20$, so $V=22\\times2\\,500\\times20=1\\,100\\,000\\ \\text{cm}^3$, which is $1\\,100$ liters.',
            '$140\\div7=20$, jadi $V=22\\times2\\,500\\times20=1\\,100\\,000\\ \\text{cm}^3$, yaitu $1\\,100$ liter.',
          ),
          solution: ['V=\\frac{22}{7}\\times50^2\\times140=1\\,100\\,000\\ \\text{cm}^3', '1\\,100\\,000\\div1\\,000=1\\,100'],
        },
      ],
    },
    /* ------------------------------------------------ L2 pyramids, cones, spheres */
    {
      id: 'tka-sma-m7-s2-l2',
      title: L('Pyramids, Cones and Spheres', 'Limas, Kerucut, dan Bola'),
      goal: L(
        'You can find the volume and surface area of a pyramid, a cone and a sphere, and compare shapes of equal volume.',
        'Kamu bisa mencari volume dan luas permukaan limas, kerucut, dan bola, serta membandingkan bangun yang bervolume sama.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: A Third of the Prism', 'Ayo Amati: Sepertiga Prisma'),
          body: L(
            'A **pyramid** with the same base and height as a prism holds exactly one third as much:\n\n$$V=\\frac{1}{3}\\times\\text{base area}\\times h$$\n\nThe picture shows a pyramid with a square base of side 6 and height 4.\n\n1. Step 1: Volume: $\\frac{1}{3}\\times6^2\\times4=\\frac{1}{3}\\times144=48$.\n2. Step 2: The side faces are four triangles. Their height (the **slant height**) is found with Pythagoras from the middle of a base side to the top: $\\sqrt{3^2+4^2}=5$.\n3. Step 3: Each triangle: $\\frac{1}{2}\\times6\\times5=15$, so four of them make $60$.\n4. Step 4: Surface area: $36+60=96$.',
            '**Limas** dengan alas dan tinggi yang sama seperti prisma memuat tepat sepertiganya:\n\n$$V=\\frac{1}{3}\\times\\text{luas alas}\\times t$$\n\nGambar menunjukkan limas beralas persegi bersisi 6 dan tinggi 4.\n\n1. Langkah 1: Volume: $\\frac{1}{3}\\times6^2\\times4=\\frac{1}{3}\\times144=48$.\n2. Langkah 2: Sisi tegaknya empat segitiga. Tinggi segitiga itu (**tinggi sisi tegak**) dicari dengan Pythagoras dari tengah sisi alas ke puncak: $\\sqrt{3^2+4^2}=5$.\n3. Langkah 3: Tiap segitiga: $\\frac{1}{2}\\times6\\times5=15$, jadi keempatnya $60$.\n4. Langkah 4: Luas permukaan: $36+60=96$.',
          ),
          figure: {
            ...prism3d({ base: [[0, 0], [6, 0], [6, 6], [0, 6]], h: 4, apex: true }),
            caption: L('A pyramid with a square base of side 6 and height 4.', 'Limas beralas persegi bersisi 6 dan tinggi 4.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: The Cone', 'Contoh Bertahap: Kerucut'),
          body: L(
            'A cone is a pyramid with a circular base:\n\n$$V=\\frac{1}{3}\\pi r^2h\\qquad\\text{curved surface}=\\pi rs\\qquad\\text{total}=\\pi r^2+\\pi rs$$\n\nwhere $s$ is the **slant height**, along the side: $s^2=r^2+h^2$.\n\nA cone has $r=3$ and $h=4$ (see the picture).\n\n1. Step 1: Slant height: $s=\\sqrt{3^2+4^2}=5$.\n2. Step 2: Volume: $\\frac{1}{3}\\pi\\times9\\times4=12\\pi$.\n3. Step 3: Curved surface: $\\pi\\times3\\times5=15\\pi$.\n4. Step 4: Total surface: $\\pi\\times9+15\\pi=24\\pi$.\n\n**Watch out:** the volume uses the **height** $h$; the surface uses the **slant height** $s$. They are different.',
            'Kerucut adalah limas beralas lingkaran:\n\n$$V=\\frac{1}{3}\\pi r^2t\\qquad\\text{selimut}=\\pi rs\\qquad\\text{total}=\\pi r^2+\\pi rs$$\n\ndengan $s$ **garis pelukis** (sisi miring), sepanjang sisi: $s^2=r^2+t^2$.\n\nSebuah kerucut punya $r=3$ dan $t=4$ (lihat gambar).\n\n1. Langkah 1: Garis pelukis: $s=\\sqrt{3^2+4^2}=5$.\n2. Langkah 2: Volume: $\\frac{1}{3}\\pi\\times9\\times4=12\\pi$.\n3. Langkah 3: Selimut: $\\pi\\times3\\times5=15\\pi$.\n4. Langkah 4: Luas permukaan total: $\\pi\\times9+15\\pi=24\\pi$.\n\n**Awas:** volume memakai **tinggi** $t$; luas permukaan memakai **garis pelukis** $s$. Keduanya berbeda.',
          ),
          figure: {
            ...cone2d({ r: 3, h: 4, labels: { r: '3', h: '4', s: '5' } }),
            caption: L('A cone: radius 3, height 4, slant height 5.', 'Kerucut: jari-jari 3, tinggi 4, garis pelukis 5.'),
          },
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: The Sphere', 'Contoh Bertahap: Bola'),
          body: L(
            'For a sphere of radius $r$:\n\n$$V=\\frac{4}{3}\\pi r^3\\qquad\\text{surface area}=4\\pi r^2$$\n\nFor $r=3$:\n\n1. Step 1: Volume: $\\frac{4}{3}\\pi\\times27=36\\pi$.\n2. Step 2: Surface area: $4\\pi\\times9=36\\pi$.\n\nA useful comparison: a cylinder, a cone and a sphere that all have the same radius and height $=2r$ hold in the ratio cone : sphere : cylinder $=1:2:3$ in volume.\n\n**Melting and recasting:** the volume stays the same. A solid sphere of radius 3 cm ($36\\pi\\ \\text{cm}^3$) melted into a cylinder of radius 3 cm gives $\\pi\\times9\\times h=36\\pi$, so $h=4$ cm.\n\n**Scale:** doubling the radius multiplies the volume by $2^3=8$ and the surface area by $2^2=4$.',
            'Untuk bola berjari-jari $r$:\n\n$$V=\\frac{4}{3}\\pi r^3\\qquad\\text{luas permukaan}=4\\pi r^2$$\n\nUntuk $r=3$:\n\n1. Langkah 1: Volume: $\\frac{4}{3}\\pi\\times27=36\\pi$.\n2. Langkah 2: Luas permukaan: $4\\pi\\times9=36\\pi$.\n\nPerbandingan berguna: tabung, kerucut, dan bola yang jari-jarinya sama dan tingginya $=2r$ memuat volume dengan perbandingan kerucut : bola : tabung $=1:2:3$.\n\n**Dilebur dan dicetak ulang:** volume tetap sama. Bola padat berjari-jari 3 cm ($36\\pi\\ \\text{cm}^3$) dilebur menjadi tabung berjari-jari 3 cm menghasilkan $\\pi\\times9\\times t=36\\pi$, jadi $t=4$ cm.\n\n**Skala:** menggandakan jari-jari mengalikan volume dengan $2^3=8$ dan luas permukaan dengan $2^2=4$.',
          ),
          figure: {
            ...sphere2d({ r: 3, label: '3' }),
            caption: L('A sphere of radius 3.', 'Bola berjari-jari 3.'),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'What is the volume of this cone?',
            'Berapa volume kerucut ini?',
          ),
          figure: {
            ...cone2d({ r: 3, h: 4, labels: { r: '3', h: '4' } }),
            caption: L('A cone with radius 3 and height 4.', 'Kerucut dengan jari-jari 3 dan tinggi 4.'),
          },
          options: [L('$12\\pi$', '$12\\pi$'), L('$36\\pi$', '$36\\pi$'), L('$15\\pi$', '$15\\pi$'), L('$4\\pi$', '$4\\pi$')],
          answer: 0,
          explain: L(
            '$V=\\frac{1}{3}\\pi\\times3^2\\times4=12\\pi$. Without the $\\frac{1}{3}$ you would get the cylinder volume $36\\pi$.',
            '$V=\\frac{1}{3}\\pi\\times3^2\\times4=12\\pi$. Tanpa $\\frac{1}{3}$ kamu akan mendapat volume tabung $36\\pi$.',
          ),
          hint: L(
            'A cone is one third of the cylinder with the same base and height.',
            'Kerucut adalah sepertiga tabung dengan alas dan tinggi yang sama.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: the volume of the pyramid with square base 6 and height 4.',
            'Coba bersama: volume limas beralas persegi 6 dan tinggi 4.',
          ),
          template: 'V=\\frac{1}{3}\\times6^2\\times4=\\frac{1}{3}\\times___=___',
          blanks: ['144', '48'],
          explain: L(
            '$6^2\\times4=144$ and a third of 144 is 48.',
            '$6^2\\times4=144$ dan sepertiga dari 144 adalah 48.',
          ),
          hint: L(
            'Work out base area times height first, then divide by 3.',
            'Hitung luas alas kali tinggi dulu, lalu bagi 3.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L('The volume of a sphere is $\\frac{4}{3}\\pi r^3$.', 'Volume bola adalah $\\frac{4}{3}\\pi r^3$.'),
            L('The surface area of a sphere is $4\\pi r^2$.', 'Luas permukaan bola adalah $4\\pi r^2$.'),
            L('The volume of a cone is $\\pi r^2h$.', 'Volume kerucut adalah $\\pi r^2t$.'),
            L('The volume of a pyramid is base area times height.', 'Volume limas adalah luas alas kali tinggi.'),
          ],
          answer: [0, 1],
          explain: L(
            'Cones and pyramids carry a factor $\\frac{1}{3}$: $\\frac{1}{3}\\pi r^2h$ and $\\frac{1}{3}\\times\\text{base}\\times h$.',
            'Kerucut dan limas memuat faktor $\\frac{1}{3}$: $\\frac{1}{3}\\pi r^2t$ dan $\\frac{1}{3}\\times\\text{alas}\\times t$.',
          ),
          hint: L(
            'Which solids come to a point at the top? What does that do to the volume?',
            'Bangun mana yang meruncing ke puncak? Apa akibatnya pada volume?',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('A cone with $r=3$ and $h=4$ has slant height 5.', 'Kerucut dengan $r=3$ dan $t=4$ punya garis pelukis 5.'),
            L('Doubling the radius of a sphere doubles its volume.', 'Menggandakan jari-jari bola menggandakan volumenya.'),
            L('A cone has one third of the volume of the cylinder with the same base and height.', 'Kerucut bervolume sepertiga tabung dengan alas dan tinggi yang sama.'),
            L('The surface area of a sphere of radius 3 is $12\\pi$.', 'Luas permukaan bola berjari-jari 3 adalah $12\\pi$.'),
          ],
          answer: [true, false, true, false],
          explain: L(
            '$\\sqrt{9+16}=5$. The volume has $r^3$, so doubling $r$ gives eight times the volume. And $4\\pi\\times9=36\\pi$.',
            '$\\sqrt{9+16}=5$. Volume memuat $r^3$, jadi menggandakan $r$ memberi volume delapan kali. Dan $4\\pi\\times9=36\\pi$.',
          ),
          hint: L(
            'For the sphere statements, put $r=3$ and $r=6$ into the formula and compare.',
            'Untuk pernyataan bola, masukkan $r=3$ dan $r=6$ ke rumus lalu bandingkan.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'A solid metal sphere of radius 3 cm is melted and recast as a solid cylinder of radius 3 cm. How tall is the cylinder, in centimeters?',
            'Sebuah bola logam padat berjari-jari 3 cm dilebur dan dicetak ulang menjadi tabung padat berjari-jari 3 cm. Berapa tinggi tabung itu, dalam sentimeter?',
          ),
          blanks: [{ answer: 4, after: '\\text{cm}' }],
          hints: [
            L('The volume does not change when the metal is melted.', 'Volume tidak berubah saat logam dilebur.'),
            L('The sphere has $\\frac{4}{3}\\pi\\times27=36\\pi$. The cylinder has $\\pi\\times9\\times h$.', 'Bola bervolume $\\frac{4}{3}\\pi\\times27=36\\pi$. Tabung bervolume $\\pi\\times9\\times t$.'),
            L('Solve $9\\pi h=36\\pi$.', 'Selesaikan $9\\pi t=36\\pi$.'),
          ],
          explain: L(
            '$9\\pi h=36\\pi$ gives $h=4$ cm.',
            '$9\\pi t=36\\pi$ memberi $t=4$ cm.',
          ),
          solution: { en: ['V_{\\text{sphere}}=\\frac{4}{3}\\pi\\times3^3=36\\pi', '\\pi\\times3^2\\times h=36\\pi', 'h=4'], id: ['V_{\\text{bola}}=\\frac{4}{3}\\pi\\times3^3=36\\pi', '\\pi\\times3^2\\times t=36\\pi', 't=4'] },
        },
      ],
    },
    lessonNets,
  ],
  project: {
    id: 'tka-sma-m7-s2-p',
    runtime: 'math',
    title: L('Solids at Work', 'Bangun Ruang dalam Pemakaian'),
    brief: L(
      'Find surface areas and volumes of boxes, cylinders, cones and spheres.',
      'Cari luas permukaan dan volume balok, tabung, kerucut, dan bola.',
    ),
    requirements: [
      L('Use the volume and surface area formulas of the common solids.', 'Memakai rumus volume dan luas permukaan bangun ruang yang umum.'),
      L('Use volume to compare and recast solids.', 'Memakai volume untuk membandingkan dan mencetak ulang bangun.'),
    ],
    hints: [
      L('Surface area adds up all faces; volume fills the inside.', 'Luas permukaan menjumlahkan semua sisi; volume mengisi bagian dalam.'),
      L('Cones and pyramids hold a third of the matching prism or cylinder.', 'Kerucut dan limas memuat sepertiga prisma atau tabung yang bersesuaian.'),
      L('When a solid is melted and recast, the volume stays the same.', 'Bila suatu bangun dilebur dan dicetak ulang, volumenya tetap.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L(
          'A box measures 5 cm by 4 cm by 3 cm. Find its surface area, in square centimeters.',
          'Sebuah balok berukuran 5 cm kali 4 cm kali 3 cm. Cari luas permukaannya, dalam sentimeter persegi.',
        ),
        blanks: [{ answer: 94, after: '\\text{cm}^2' }],
        solution: ['2(5\\cdot4+5\\cdot3+4\\cdot3)=2(20+15+12)', '=94'],
      },
      {
        prompt: L(
          'A cylinder has radius 7 cm and height 10 cm. Use $\\pi=\\frac{22}{7}$. Find its volume, in cubic centimeters.',
          'Sebuah tabung berjari-jari 7 cm dan tinggi 10 cm. Pakai $\\pi=\\frac{22}{7}$. Cari volumenya, dalam sentimeter kubik.',
        ),
        figure: {
          ...cylinder2d({ r: 7, h: 10, labels: { r: '7', h: '10' } }),
          caption: L('A cylinder with radius 7 and height 10.', 'Tabung dengan jari-jari 7 dan tinggi 10.'),
        },
        blanks: [{ answer: 1540, after: '\\text{cm}^3' }],
        solution: ['V=\\frac{22}{7}\\times7^2\\times10=22\\times7\\times10', '=1\\,540'],
      },
      {
        prompt: L(
          'A cone has radius 6 cm and height 8 cm, so its slant height is 10 cm. Its curved surface area is $k\\pi$ cm$^2$. Find $k$.',
          'Sebuah kerucut berjari-jari 6 cm dan tinggi 8 cm, sehingga garis pelukisnya 10 cm. Luas selimutnya $k\\pi$ cm$^2$. Tentukan $k$.',
        ),
        blanks: [{ label: 'k =', answer: 60 }],
        solution: ['\\pi rs=\\pi\\times6\\times10', '=60\\pi'],
      },
      {
        prompt: L(
          'A sphere has radius 6 cm. Its volume is $k\\pi$ cm$^3$. Find $k$.',
          'Sebuah bola berjari-jari 6 cm. Volumenya $k\\pi$ cm$^3$. Tentukan $k$.',
        ),
        blanks: [{ label: 'k =', answer: 288 }],
        solution: ['\\frac{4}{3}\\pi\\times6^3=\\frac{4}{3}\\times216\\pi', '=288\\pi'],
      },
      {
        prompt: L(
          'A cylinder and a cone have the same base and the same height. The cylinder holds 90 liters. How many liters does the cone hold?',
          'Sebuah tabung dan sebuah kerucut punya alas dan tinggi yang sama. Tabung memuat 90 liter. Berapa liter yang termuat kerucut?',
        ),
        blanks: [{ answer: 30, after: '\\text{L}' }],
        solution: { en: ['V_{\\text{cone}}=\\frac{1}{3}V_{\\text{cylinder}}=\\frac{1}{3}\\times90', '=30'], id: ['V_{\\text{kerucut}}=\\frac{1}{3}V_{\\text{tabung}}=\\frac{1}{3}\\times90', '=30'] },
      },
      {
        prompt: L(
          'The net of a box needs a piece of $8\\times10$ cm. A sheet is $40\\times30$ cm, and the pieces are kept straight. How many sheets are needed for 150 nets?',
          'Jaring-jaring sebuah kotak memerlukan potongan $8\\times10$ cm. Selembar bahan berukuran $40\\times30$ cm, dan potongan diletakkan lurus. Berapa lembar bahan yang diperlukan untuk 150 jaring-jaring?',
        ),
        blanks: [{ answer: 10 }],
        solution: { en: ['\\frac{40}{8}\\times\\frac{30}{10}=15\\text{ per sheet}', '\\frac{150}{15}=10'], id: ['\\frac{40}{8}\\times\\frac{30}{10}=15\\text{ per lembar}', '\\frac{150}{15}=10'] },
      },
    ],
  },
}
