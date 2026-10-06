import type { Submodule } from '../types'
import { L, ellipsePts, line, rectPts, shape, solid, txt } from './figs'

/** Module 7, submodule 1 — units and rates, then perimeter and area of plane
 *  figures, composite and shaded regions. */

export const m7s1: Submodule = {
  id: 'tka-sma-m7-s1',
  title: L('Units, Perimeter and Area', 'Satuan, Keliling, dan Luas'),
  summary: L(
    'Change units, work with speed and flow rate, and find perimeter and area of polygons, circles, composite figures and shaded regions.',
    'Mengubah satuan, bekerja dengan kecepatan dan debit, serta mencari keliling dan luas poligon, lingkaran, bangun gabungan, dan daerah yang diarsir.',
  ),
  lessons: [
    /* --------------------------------------------------- L1 units and area formulas */
    {
      id: 'tka-sma-m7-s1-l1',
      title: L('Units, Rates and Area Formulas', 'Satuan, Laju, dan Rumus Luas'),
      goal: L(
        'You can convert units of length, area, volume and speed, find an average speed, and use the area formulas of the trapezoid, triangle and circle.',
        'Kamu bisa mengubah satuan panjang, luas, volume, dan kecepatan, mencari kecepatan rata-rata, dan memakai rumus luas trapesium, segitiga, dan lingkaran.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Why Area Units Grow So Fast', 'Ayo Amati: Mengapa Satuan Luas Cepat Membesar'),
          body: L(
            'A square with side 1 m has side 100 cm. Its area is $1\\ \\text{m}^2$, but also $100\\times100=10\\,000\\ \\text{cm}^2$. A conversion factor is **squared** for area and **cubed** for volume.\n\n| Length | Area | Volume |\n|---|---|---|\n| $1\\ \\text{m}=100\\ \\text{cm}$ | $1\\ \\text{m}^2=10\\,000\\ \\text{cm}^2$ | $1\\ \\text{m}^3=1\\,000\\,000\\ \\text{cm}^3$ |\n| $1\\ \\text{km}=1\\,000\\ \\text{m}$ | $1\\ \\text{km}^2=1\\,000\\,000\\ \\text{m}^2$ | $1\\ \\text{L}=1\\,000\\ \\text{cm}^3$, $1\\ \\text{m}^3=1\\,000\\ \\text{L}$ |\n\n**Speed:** $\\text{speed}=\\frac{\\text{distance}}{\\text{time}}$. To change km/h to m/s, multiply by 1000 and divide by 3600: $72\\ \\text{km/h}=\\frac{72\\times1000}{3600}=20\\ \\text{m/s}$.\n\n**Flow rate** (debit) is volume per time, such as litres per minute.',
            'Persegi dengan sisi 1 m bersisi 100 cm. Luasnya $1\\ \\text{m}^2$, tetapi juga $100\\times100=10\\,000\\ \\text{cm}^2$. Faktor konversi **dikuadratkan** untuk luas dan **dipangkatkan tiga** untuk volume.\n\n| Panjang | Luas | Volume |\n|---|---|---|\n| $1\\ \\text{m}=100\\ \\text{cm}$ | $1\\ \\text{m}^2=10\\,000\\ \\text{cm}^2$ | $1\\ \\text{m}^3=1\\,000\\,000\\ \\text{cm}^3$ |\n| $1\\ \\text{km}=1\\,000\\ \\text{m}$ | $1\\ \\text{km}^2=1\\,000\\,000\\ \\text{m}^2$ | $1\\ \\text{L}=1\\,000\\ \\text{cm}^3$, $1\\ \\text{m}^3=1\\,000\\ \\text{L}$ |\n\n**Kecepatan:** $\\text{kecepatan}=\\frac{\\text{jarak}}{\\text{waktu}}$. Untuk mengubah km/jam ke m/detik, kalikan 1000 dan bagi 3600: $72\\ \\text{km/jam}=\\frac{72\\times1000}{3600}=20\\ \\text{m/detik}$.\n\n**Debit** adalah volume per waktu, seperti liter per menit.',
          ),
          figure: {
            ...shape({
              pts: [[0, 0], [5, 0], [5, 5], [0, 5]],
              rights: [0, 1, 2, 3],
              extra: [txt(2.5, -0.9, '1 m = 100 cm', 'md', 'muted'), txt(2.5, 2.5, '10 000 cm²', 'lg', 'muted')],
            }),
            caption: L('A square of side 1 m has area 10 000 cm².', 'Persegi bersisi 1 m berluas 10 000 cm².'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Area Formulas', 'Contoh Bertahap: Rumus Luas'),
          body: L(
            '| Figure | Area |\n|---|---|\n| Rectangle | $l\\times w$ |\n| Parallelogram | base $\\times$ height |\n| Triangle | $\\frac{1}{2}\\times\\text{base}\\times\\text{height}$ |\n| Trapezoid | $\\frac{1}{2}(a+b)\\,h$ |\n| Circle | $\\pi r^2$ (circumference $2\\pi r$) |\n\nFind the area of the trapezoid with parallel sides 12 and 8 and height 5.\n\n1. Step 1: Add the parallel sides: $12+8=20$.\n2. Step 2: Half of that is the average side: $10$.\n3. Step 3: Multiply by the height: $10\\times5=50$.\n\nThe height must be **perpendicular** to the parallel sides (the dashed line), not the slanted side.',
            '| Bangun | Luas |\n|---|---|\n| Persegi panjang | $p\\times l$ |\n| Jajargenjang | alas $\\times$ tinggi |\n| Segitiga | $\\frac{1}{2}\\times\\text{alas}\\times\\text{tinggi}$ |\n| Trapesium | $\\frac{1}{2}(a+b)\\,t$ |\n| Lingkaran | $\\pi r^2$ (keliling $2\\pi r$) |\n\nCari luas trapesium dengan sisi sejajar 12 dan 8 serta tinggi 5.\n\n1. Langkah 1: Jumlahkan sisi sejajar: $12+8=20$.\n2. Langkah 2: Setengahnya adalah rata-rata sisi: $10$.\n3. Langkah 3: Kalikan dengan tinggi: $10\\times5=50$.\n\nTinggi harus **tegak lurus** terhadap sisi sejajar (garis putus-putus), bukan sisi miring.',
          ),
          figure: {
            ...shape({
              pts: [[0, 0], [12, 0], [10, 5], [2, 5]],
              sides: ['12', undefined, '8'],
              extra: [line([2, 0], [2, 5], 'muted', { dashed: true }), txt(1.2, 2.5, '5', 'md', 'muted')],
            }),
            caption: L('A trapezoid: parallel sides 12 and 8, height 5.', 'Trapesium: sisi sejajar 12 dan 8, tinggi 5.'),
          },
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Watch Out!: Three Classic Slips', 'Awas, Jebakan!: Tiga Kesalahan Klasik'),
          body: L(
            '**1. Squared factors.** $3\\ \\text{m}^2$ is $3\\times10\\,000=30\\,000\\ \\text{cm}^2$, **not** $3\\times100=300\\ \\text{cm}^2$.\n\n**2. Average speed.** A car drives 60 km at 60 km/h and returns at 40 km/h. The average speed is **not** $\\frac{60+40}{2}=50$. Use total distance over total time: the trip out takes 1 hour, the trip back takes $\\frac{60}{40}=1.5$ hours, so\n\n$$\\frac{120}{1+1.5}=48\\ \\text{km/h}$$\n\n**3. Radius or diameter.** $A=\\pi r^2$ uses the **radius**. A circle of diameter 10 has $r=5$ and area $25\\pi$, not $100\\pi$.',
            '**1. Faktor dikuadratkan.** $3\\ \\text{m}^2$ adalah $3\\times10\\,000=30\\,000\\ \\text{cm}^2$, **bukan** $3\\times100=300\\ \\text{cm}^2$.\n\n**2. Kecepatan rata-rata.** Mobil menempuh 60 km dengan 60 km/jam dan kembali dengan 40 km/jam. Kecepatan rata-ratanya **bukan** $\\frac{60+40}{2}=50$. Pakai jarak total dibagi waktu total: perjalanan pergi 1 jam, perjalanan pulang $\\frac{60}{40}=1{,}5$ jam, sehingga\n\n$$\\frac{120}{1+1{,}5}=48\\ \\text{km/jam}$$\n\n**3. Jari-jari atau diameter.** $A=\\pi r^2$ memakai **jari-jari**. Lingkaran berdiameter 10 punya $r=5$ dan luas $25\\pi$, bukan $100\\pi$.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'What is the area of this trapezoid, in square units?',
            'Berapa luas trapesium ini, dalam satuan persegi?',
          ),
          figure: {
            ...shape({
              pts: [[0, 0], [10, 0], [8, 4], [2, 4]],
              sides: ['10', undefined, '6'],
              extra: [line([2, 0], [2, 4], 'muted', { dashed: true }), txt(1.2, 2, '4', 'md', 'muted')],
            }),
            caption: L('Parallel sides 10 and 6, height 4.', 'Sisi sejajar 10 dan 6, tinggi 4.'),
          },
          options: [L('32', '32'), L('64', '64'), L('24', '24'), L('40', '40')],
          answer: 0,
          explain: L(
            '$\\frac{1}{2}(10+6)\\times4=8\\times4=32$. The value 64 forgets the half; 24 and 40 use only one of the parallel sides.',
            '$\\frac{1}{2}(10+6)\\times4=8\\times4=32$. Nilai 64 lupa setengahnya; 24 dan 40 hanya memakai satu sisi sejajar.',
          ),
          hint: L(
            'Add the two parallel sides, take half, and multiply by the height.',
            'Jumlahkan kedua sisi sejajar, ambil setengahnya, lalu kalikan dengan tinggi.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: change 72 km/h to metres per second.',
            'Coba bersama: ubah 72 km/jam menjadi meter per detik.',
          ),
          template: '\\frac{72\\times1000}{3600}=___',
          blanks: ['20'],
          explain: L(
            '$72\\,000\\div3\\,600=20$ metres per second.',
            '$72\\,000\\div3\\,600=20$ meter per detik.',
          ),
          hint: L(
            'There are 1000 metres in a kilometre and 3600 seconds in an hour.',
            'Ada 1000 meter dalam satu kilometer dan 3600 detik dalam satu jam.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true equalities.', 'Pilih DUA kesamaan yang benar.'),
          options: [
            L('$1\\ \\text{m}^2=10\\,000\\ \\text{cm}^2$', '$1\\ \\text{m}^2=10\\,000\\ \\text{cm}^2$'),
            L('$1\\ \\text{L}=1\\,000\\ \\text{cm}^3$', '$1\\ \\text{L}=1\\,000\\ \\text{cm}^3$'),
            L('$1\\ \\text{m}^3=100\\ \\text{L}$', '$1\\ \\text{m}^3=100\\ \\text{L}$'),
            L('$1\\ \\text{km/h}=\\frac{18}{5}\\ \\text{m/s}$', '$1\\ \\text{km/jam}=\\frac{18}{5}\\ \\text{m/detik}$'),
          ],
          answer: [0, 1],
          explain: L(
            '$1\\ \\text{m}^3=1\\,000\\ \\text{L}$. And $1\\ \\text{km/h}=\\frac{1000}{3600}=\\frac{5}{18}\\ \\text{m/s}$; the number $\\frac{18}{5}$ is the factor for the opposite direction.',
            '$1\\ \\text{m}^3=1\\,000\\ \\text{L}$. Dan $1\\ \\text{km/jam}=\\frac{1000}{3600}=\\frac{5}{18}\\ \\text{m/detik}$; bilangan $\\frac{18}{5}$ adalah faktor untuk arah sebaliknya.',
          ),
          hint: L(
            'For area, square the length factor; for volume, cube it.',
            'Untuk luas, kuadratkan faktor panjang; untuk volume, pangkatkan tiga.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('Going 60 km/h and returning 40 km/h gives an average speed of 50 km/h.', 'Pergi 60 km/jam dan pulang 40 km/jam memberi kecepatan rata-rata 50 km/jam.'),
            L('A circle of radius 7 has circumference $14\\pi$.', 'Lingkaran berjari-jari 7 berkeliling $14\\pi$.'),
            L('$3\\ \\text{m}^2=300\\ \\text{cm}^2$.', '$3\\ \\text{m}^2=300\\ \\text{cm}^2$.'),
            L('A triangle with base 6 and height 4 has area 12.', 'Segitiga beralas 6 dan tinggi 4 berluas 12.'),
          ],
          answer: [false, true, false, true],
          explain: L(
            'The average is $\\frac{120}{2.5}=48$ km/h. $2\\pi\\times7=14\\pi$. $3\\ \\text{m}^2=30\\,000\\ \\text{cm}^2$. And $\\frac{1}{2}\\times6\\times4=12$.',
            'Rata-ratanya $\\frac{120}{2{,}5}=48$ km/jam. $2\\pi\\times7=14\\pi$. $3\\ \\text{m}^2=30\\,000\\ \\text{cm}^2$. Dan $\\frac{1}{2}\\times6\\times4=12$.',
          ),
          hint: L(
            'For the speed, use total distance divided by total time.',
            'Untuk kecepatan, pakai jarak total dibagi waktu total.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'A tap delivers 8 litres of water per minute. How many minutes does it take to fill a tank of volume 2 m$^3$?',
            'Sebuah keran mengalirkan 8 liter air per menit. Berapa menit untuk mengisi tangki bervolume 2 m$^3$?',
          ),
          blanks: [{ answer: 250, after: '\\text{min}' }],
          hints: [
            L('Change the volume to litres first.', 'Ubah volume ke liter dulu.'),
            L('$1\\ \\text{m}^3=1\\,000\\ \\text{L}$, so the tank holds $2\\,000$ litres.', '$1\\ \\text{m}^3=1\\,000\\ \\text{L}$, jadi tangki memuat $2\\,000$ liter.'),
            L('Divide by the flow rate: $2\\,000\\div8$.', 'Bagi dengan debit: $2\\,000\\div8$.'),
          ],
          explain: L(
            '$2\\,000\\div8=250$ minutes.',
            '$2\\,000\\div8=250$ menit.',
          ),
          solution: ['2\\ \\text{m}^3=2\\,000\\ \\text{L}', '2\\,000\\div8=250'],
        },
      ],
    },
    /* ------------------------------------------------- L2 composite and shaded */
    {
      id: 'tka-sma-m7-s1-l2',
      title: L('Composite and Shaded Regions', 'Bangun Gabungan dan Daerah Arsiran'),
      goal: L(
        'You can find the area and perimeter of a figure made of several parts, and the area of a shaded region by subtracting.',
        'Kamu bisa mencari luas dan keliling bangun yang tersusun dari beberapa bagian, dan luas daerah arsiran dengan pengurangan.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: A Walkway Around a Pool', 'Ayo Amati: Jalan Setapak di Sekeliling Kolam'),
          body: L(
            'A pool is 12 m by 8 m. A walkway 2 m wide runs all around it. What is the area of the walkway?\n\nThe outer rectangle (pool plus walkway) is bigger by 2 m on **each** side, so it is $12+2+2=16$ m by $8+2+2=12$ m.\n\n1. Step 1: Whole region: $16\\times12=192\\ \\text{m}^2$.\n2. Step 2: Pool: $12\\times8=96\\ \\text{m}^2$.\n3. Step 3: Walkway $=192-96=96\\ \\text{m}^2$.\n\nThe idea: **whole minus part**. Find the big area and subtract the area you do not want.',
            'Sebuah kolam berukuran 12 m kali 8 m. Jalan setapak selebar 2 m mengelilinginya. Berapa luas jalan setapak itu?\n\nPersegi panjang luar (kolam ditambah jalan) lebih besar 2 m di **setiap** sisi, jadi ukurannya $12+2+2=16$ m kali $8+2+2=12$ m.\n\n1. Langkah 1: Seluruh daerah: $16\\times12=192\\ \\text{m}^2$.\n2. Langkah 2: Kolam: $12\\times8=96\\ \\text{m}^2$.\n3. Langkah 3: Jalan setapak $=192-96=96\\ \\text{m}^2$.\n\nIdenya: **keseluruhan dikurangi bagian**. Cari luas yang besar lalu kurangkan luas yang tidak diinginkan.',
          ),
          figure: {
            ...shape({
              pts: [[0, 0], [16, 0], [16, 12], [0, 12]],
              extra: [
                solid(rectPts(2, 2, 12, 8), 'b'),
                txt(8, -1, '16', 'md', 'muted'),
                txt(-1, 6, '12', 'md', 'muted'),
              ],
            }),
            caption: L('A 12 × 8 pool (orange) inside a 16 × 12 outline; the green ring is the walkway.', 'Kolam 12 × 8 (oranye) di dalam bingkai 16 × 12; cincin hijau adalah jalan setapak.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Rectangle Plus Semicircle', 'Contoh Bertahap: Persegi Panjang Ditambah Setengah Lingkaran'),
          body: L(
            'A running field is a rectangle 10 m by 6 m with a semicircle of radius 3 added on one 6 m side.\n\n**Area** (add the parts):\n\n1. Step 1: Rectangle: $10\\times6=60$.\n2. Step 2: Semicircle: $\\frac{1}{2}\\pi\\times3^2=\\frac{9}{2}\\pi$.\n3. Step 3: Total: $60+\\frac{9}{2}\\pi\\ \\text{m}^2$.\n\n**Perimeter** (walk around the outside only):\n\n1. Step 1: Two long sides: $10+10=20$, and the far short side $6$.\n2. Step 2: The curve: half a circumference, $\\frac{1}{2}\\times2\\pi\\times3=3\\pi$.\n3. Step 3: Total: $26+3\\pi$ m.\n\n**Watch out:** the 6 m side where the semicircle is attached is **inside** the figure, so it is not part of the perimeter.',
            'Sebuah lapangan lari berbentuk persegi panjang 10 m kali 6 m dengan setengah lingkaran berjari-jari 3 ditambahkan pada salah satu sisi 6 m.\n\n**Luas** (jumlahkan bagian-bagiannya):\n\n1. Langkah 1: Persegi panjang: $10\\times6=60$.\n2. Langkah 2: Setengah lingkaran: $\\frac{1}{2}\\pi\\times3^2=\\frac{9}{2}\\pi$.\n3. Langkah 3: Total: $60+\\frac{9}{2}\\pi\\ \\text{m}^2$.\n\n**Keliling** (hanya berjalan di sisi luar):\n\n1. Langkah 1: Dua sisi panjang: $10+10=20$, dan sisi pendek yang jauh $6$.\n2. Langkah 2: Lengkungannya: setengah keliling, $\\frac{1}{2}\\times2\\pi\\times3=3\\pi$.\n3. Langkah 3: Total: $26+3\\pi$ m.\n\n**Awas:** sisi 6 m tempat setengah lingkaran menempel berada **di dalam** bangun, jadi bukan bagian keliling.',
          ),
          figure: {
            ...shape({
              pts: [[0, 0], [10, 0], [10, 6], [0, 6]],
              extra: [
                solid(ellipsePts(10, 3, 3, 3, -90, 90), 'b'),
                txt(5, -0.9, '10', 'md', 'muted'),
                txt(-0.8, 3, '6', 'md', 'muted'),
                txt(11.5, 3.7, '3', 'md', 'result'),
                line([10, 3], [13, 3], 'result', { width: 2 }),
              ],
              pad: 1.6,
            }),
            caption: L('A rectangle 10 by 6 with a semicircle of radius 3.', 'Persegi panjang 10 kali 6 dengan setengah lingkaran berjari-jari 3.'),
          },
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: A Circle Inside a Square', 'Contoh Bertahap: Lingkaran di dalam Persegi'),
          body: L(
            'A circle just fits inside a square of side 8. The corners (green) are shaded. What is their total area?\n\n1. Step 1: Square: $8\\times8=64$.\n2. Step 2: The circle touches all four sides, so its diameter is 8 and its radius is 4. Circle: $\\pi\\times4^2=16\\pi$.\n3. Step 3: Shaded corners: $64-16\\pi$.\n\nIf the question says "use $\\pi=3.14$", then $64-16\\times3.14=13.76$. Leave the answer in terms of $\\pi$ when you can: it is exact.\n\n**Watch out:** the radius is **half** the side, not the whole side.',
            'Sebuah lingkaran tepat muat di dalam persegi bersisi 8. Keempat sudutnya (hijau) diarsir. Berapa luas total arsiran itu?\n\n1. Langkah 1: Persegi: $8\\times8=64$.\n2. Langkah 2: Lingkaran menyentuh keempat sisi, jadi diameternya 8 dan jari-jarinya 4. Lingkaran: $\\pi\\times4^2=16\\pi$.\n3. Langkah 3: Sudut yang diarsir: $64-16\\pi$.\n\nJika soal menyatakan "pakai $\\pi=3{,}14$", maka $64-16\\times3{,}14=13{,}76$. Biarkan jawaban dalam $\\pi$ bila bisa: itu eksak.\n\n**Awas:** jari-jari adalah **setengah** sisi, bukan seluruh sisi.',
          ),
          figure: {
            ...shape({
              pts: [[0, 0], [8, 0], [8, 8], [0, 8]],
              extra: [
                { t: 'poly', pts: ellipsePts(4, 4, 4, 4), color: 'c' },
                line([4, 4], [8, 4], 'result', { width: 2 }),
                txt(6, 4.7, '4', 'md', 'result'),
              ],
            }),
            caption: L('A circle of radius 4 inside a square of side 8.', 'Lingkaran berjari-jari 4 di dalam persegi bersisi 8.'),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'A rectangle 12 by 4 has a semicircle of radius 2 attached to one short side. What is the total area?',
            'Sebuah persegi panjang 12 kali 4 memiliki setengah lingkaran berjari-jari 2 pada salah satu sisi pendeknya. Berapa luas totalnya?',
          ),
          figure: {
            ...shape({
              pts: [[0, 0], [12, 0], [12, 4], [0, 4]],
              extra: [solid(ellipsePts(12, 2, 2, 2, -90, 90), 'b'), txt(6, -0.9, '12', 'md', 'muted'), txt(-0.8, 2, '4', 'md', 'muted')],
              pad: 1.4,
            }),
            caption: L('A rectangle with a semicircle on a short side.', 'Persegi panjang dengan setengah lingkaran pada sisi pendek.'),
          },
          options: [L('$48+2\\pi$', '$48+2\\pi$'), L('$48+4\\pi$', '$48+4\\pi$'), L('$48+\\pi$', '$48+\\pi$'), L('$52+2\\pi$', '$52+2\\pi$')],
          answer: 0,
          explain: L(
            'The rectangle is $12\\times4=48$. The semicircle has radius 2, so its area is $\\frac{1}{2}\\pi\\times2^2=2\\pi$. Total: $48+2\\pi$.',
            'Persegi panjangnya $12\\times4=48$. Setengah lingkaran berjari-jari 2, jadi luasnya $\\frac{1}{2}\\pi\\times2^2=2\\pi$. Total: $48+2\\pi$.',
          ),
          hint: L(
            'The diameter of the semicircle is the short side 4, so the radius is half of that.',
            'Diameter setengah lingkaran adalah sisi pendek 4, jadi jari-jarinya setengahnya.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: the walkway around the pool. Fill in the two areas and their difference.',
            'Coba bersama: jalan setapak di sekeliling kolam. Isi kedua luas dan selisihnya.',
          ),
          template: '16\\times12=___ \\quad 12\\times8=___ \\quad 192-96=___',
          blanks: ['192', '96', '96'],
          explain: L(
            'The whole region is 192 m$^2$, the pool 96 m$^2$, so the walkway is $192-96=96$ m$^2$.',
            'Seluruh daerah 192 m$^2$, kolam 96 m$^2$, jadi jalan setapak $192-96=96$ m$^2$.',
          ),
          hint: L(
            'Multiply the two sides of each rectangle, then subtract the smaller from the bigger.',
            'Kalikan kedua sisi tiap persegi panjang, lalu kurangkan yang kecil dari yang besar.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L('A semicircle of radius 6 has area $18\\pi$.', 'Setengah lingkaran berjari-jari 6 berluas $18\\pi$.'),
            L('The curved edge of a semicircle of radius 4 has length $4\\pi$.', 'Tepi lengkung setengah lingkaran berjari-jari 4 panjangnya $4\\pi$.'),
            L('A circle of radius 5 has circumference $25\\pi$.', 'Lingkaran berjari-jari 5 berkeliling $25\\pi$.'),
            L('The corners of a square of side 8 outside its circle have area $64-8\\pi$.', 'Sudut-sudut persegi bersisi 8 di luar lingkarannya berluas $64-8\\pi$.'),
          ],
          answer: [0, 1],
          explain: L(
            '$\\frac{1}{2}\\pi\\times36=18\\pi$ and $\\frac{1}{2}\\times2\\pi\\times4=4\\pi$. The circumference of radius 5 is $10\\pi$ ($25\\pi$ is the area), and the corners have area $64-16\\pi$.',
            '$\\frac{1}{2}\\pi\\times36=18\\pi$ dan $\\frac{1}{2}\\times2\\pi\\times4=4\\pi$. Keliling berjari-jari 5 adalah $10\\pi$ ($25\\pi$ adalah luasnya), dan sudut-sudutnya berluas $64-16\\pi$.',
          ),
          hint: L(
            'Do not mix up circumference ($2\\pi r$) and area ($\\pi r^2$).',
            'Jangan tertukar antara keliling ($2\\pi r$) dan luas ($\\pi r^2$).',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('A circle of radius 4 inside a square of side 8 leaves corners of area $64-16\\pi$.', 'Lingkaran berjari-jari 4 di dalam persegi bersisi 8 menyisakan sudut berluas $64-16\\pi$.'),
            L('A walkway 2 m wide around a $12$ by $8$ pool has area 80 m$^2$.', 'Jalan setapak selebar 2 m di sekeliling kolam $12$ kali $8$ berluas 80 m$^2$.'),
            L('A rectangle $10\\times6$ with a semicircle of radius 3 on a 6 side has perimeter $26+3\\pi$.', 'Persegi panjang $10\\times6$ dengan setengah lingkaran berjari-jari 3 pada sisi 6 berkeliling $26+3\\pi$.'),
            L('A circle of diameter 10 has area $100\\pi$.', 'Lingkaran berdiameter 10 berluas $100\\pi$.'),
          ],
          answer: [true, false, true, false],
          explain: L(
            'The first and third were worked out above. The walkway has area $16\\times12-12\\times8=96$, because the four corner squares also count. A diameter of 10 means radius 5 and area $25\\pi$.',
            'Yang pertama dan ketiga sudah dihitung di atas. Luas jalan setapak $16\\times12-12\\times8=96$, karena keempat persegi di pojok ikut terhitung. Diameter 10 berarti jari-jari 5 dan luas $25\\pi$.',
          ),
          hint: L(
            'For the walkway, find the outer rectangle first: each side gains 2 m at both ends.',
            'Untuk jalan setapak, cari persegi panjang luar dulu: tiap sisi bertambah 2 m di kedua ujung.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'A running track has two straight sections of 100 m each and two semicircular ends of radius 7 m. Use $\\pi=\\frac{22}{7}$. What is the length of one lap, in metres?',
            'Sebuah lintasan lari punya dua bagian lurus masing-masing 100 m dan dua ujung setengah lingkaran berjari-jari 7 m. Pakai $\\pi=\\frac{22}{7}$. Berapa panjang satu putaran, dalam meter?',
          ),
          blanks: [{ answer: 244, after: '\\text{m}' }],
          hints: [
            L('The two semicircles together make one full circle of radius 7.', 'Kedua setengah lingkaran bersama-sama membentuk satu lingkaran penuh berjari-jari 7.'),
            L('Its circumference is $2\\pi r=2\\times\\frac{22}{7}\\times7=44$.', 'Kelilingnya $2\\pi r=2\\times\\frac{22}{7}\\times7=44$.'),
            L('Add the two straight sections: $200+44$.', 'Tambahkan dua bagian lurus: $200+44$.'),
          ],
          explain: L(
            'Straights: $2\\times100=200$ m. Curves: $2\\pi\\times7=44$ m. One lap is $200+44=244$ m.',
            'Bagian lurus: $2\\times100=200$ m. Lengkungan: $2\\pi\\times7=44$ m. Satu putaran $200+44=244$ m.',
          ),
          solution: ['2\\pi r=2\\times\\frac{22}{7}\\times7=44', '200+44=244'],
        },
      ],
    },
  ],
  project: {
    id: 'tka-sma-m7-s1-p',
    runtime: 'math',
    title: L('Units and Areas at Work', 'Satuan dan Luas dalam Pemakaian'),
    brief: L(
      'Change units, find average speed and a flow time, and find the area of trapezoids and shaded regions.',
      'Ubah satuan, cari kecepatan rata-rata dan waktu pengisian, serta luas trapesium dan daerah arsiran.',
    ),
    requirements: [
      L('Convert units and compute rates.', 'Mengubah satuan dan menghitung laju.'),
      L('Find areas by adding and subtracting parts.', 'Mencari luas dengan menjumlahkan dan mengurangkan bagian-bagian.'),
    ],
    hints: [
      L('Square the length factor for area, cube it for volume.', 'Kuadratkan faktor panjang untuk luas, pangkatkan tiga untuk volume.'),
      L('Average speed = total distance / total time.', 'Kecepatan rata-rata = jarak total / waktu total.'),
      L('Shaded region = whole figure minus the part that is not shaded.', 'Daerah arsiran = seluruh bangun dikurangi bagian yang tidak diarsir.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L('Change 90 km/h to metres per second.', 'Ubah 90 km/jam menjadi meter per detik.'),
        blanks: [{ answer: 25, after: '\\text{m/s}' }],
        solution: ['\\frac{90\\times1000}{3600}=25'],
      },
      {
        prompt: L(
          'Find the area of a trapezoid with parallel sides 9 and 15 and height 7.',
          'Cari luas trapesium dengan sisi sejajar 9 dan 15 serta tinggi 7.',
        ),
        figure: {
          ...shape({
            pts: [[0, 0], [15, 0], [12, 7], [3, 7]],
            sides: ['15', undefined, '9'],
            extra: [line([3, 0], [3, 7], 'muted', { dashed: true }), txt(2.2, 3.5, '7', 'md', 'muted')],
          }),
          caption: L('A trapezoid.', 'Sebuah trapesium.'),
        },
        blanks: [{ answer: 84 }],
        solution: ['\\frac{1}{2}(9+15)\\times7=12\\times7', '=84'],
      },
      {
        prompt: L(
          'A circle of radius 7 sits inside a square of side 14. Use $\\pi=\\frac{22}{7}$. What is the area of the part of the square outside the circle?',
          'Sebuah lingkaran berjari-jari 7 berada di dalam persegi bersisi 14. Pakai $\\pi=\\frac{22}{7}$. Berapa luas bagian persegi di luar lingkaran?',
        ),
        blanks: [{ answer: 42 }],
        solution: ['14\\times14=196', '\\pi r^2=\\frac{22}{7}\\times49=154', '196-154=42'],
      },
      {
        prompt: L(
          'A car travels 120 km at 60 km/h, then another 120 km at 40 km/h. What is its average speed over the whole trip, in km/h?',
          'Sebuah mobil menempuh 120 km dengan 60 km/jam, lalu 120 km lagi dengan 40 km/jam. Berapa kecepatan rata-ratanya sepanjang perjalanan, dalam km/jam?',
        ),
        blanks: [{ answer: 48, after: '\\text{km/h}' }],
        solution: ['t=\\frac{120}{60}+\\frac{120}{40}=2+3=5', '\\frac{240}{5}=48'],
      },
      {
        prompt: L(
          'A tap delivers 20 litres per minute. How many minutes are needed to fill a tank of 3 m$^3$?',
          'Sebuah keran mengalirkan 20 liter per menit. Berapa menit diperlukan untuk mengisi tangki 3 m$^3$?',
        ),
        blanks: [{ answer: 150, after: '\\text{min}' }],
        solution: ['3\\ \\text{m}^3=3\\,000\\ \\text{L}', '3\\,000\\div20=150'],
      },
    ],
  },
}
