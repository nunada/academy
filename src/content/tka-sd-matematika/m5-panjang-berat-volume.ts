import type { Loc, Module } from '../types'
import type { FigColor, FigItem } from '../../lib/figure'
import type { Piece, Pt } from './figs'
import { fit, fractionBars, line, numberLine, outline, rectPts, solid, txt } from './figs'

/** Module 5 — length, weight and liquid volume: the seven units of each family,
 *  the "staircase" of x10 steps, reading rulers, scales and measuring jugs,
 *  converting, and word problems. (Volume of cubes and boxes in cm3 is module 9.) */

const L = (en: string, id: string): Loc => ({ en, id })

const LEN = ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm']
const WEI = ['kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg']
const VOL = ['kl', 'hl', 'dal', 'l', 'dl', 'cl', 'ml']

/* ------------------------------------------------------------- helpers */

/** The staircase of units: the biggest unit on the left, one step lower to the right.
 *  Every step down the staircase is "x10". `hi` outlines the steps to look at. */
function stairs(names: string[], hi: number[] = []): Piece {
  const n = names.length
  const items: FigItem[] = []
  names.forEach((nm, i) => {
    const x = i * 2.2
    const h = n - i
    const on = hi.includes(i)
    items.push(outline(rectPts(x, 0, 2, h), on ? 'result' : 'a'))
    items.push(txt(x + 1, h - 0.55, nm, 'lg', on ? 'result' : 'muted'))
    if (i > 0) items.push(txt(x + 1, h + 0.5, '×10', 'md', 'b'))
  })
  return { dim: 2, axes: false, ...fit([[-0.2, -0.2], [n * 2.2, n + 1]], 0.5), items }
}

/** A ruler 0 to 10 cm with mm marks and an object lying on it from `a` to `b` (cm).
 *  `guides` draws dashed lines from the two ends of the object down to the ruler. */
function ruler(a: number, b: number, guides = true): Piece {
  const base = numberLine({ from: 0, to: 10, step: 0.1, labelEvery: 10 })
  const items: FigItem[] = [...base.items]
  for (let v = 0; v <= 10; v++) items.push(line([v, -0.3], [v, 0.8], 'muted', { width: 2.5 }))
  items.push(solid([[a, 1.1], [b - 0.45, 1.1], [b, 1.5], [b - 0.45, 1.9], [a, 1.9]], 'c'))
  if (guides) {
    items.push(line([a, 1.1], [a, -0.3], 'b', { dashed: true }))
    items.push(line([b, 1.5], [b, -0.3], 'b', { dashed: true }))
  }
  return { ...base, items }
}

/** A scale with a pointer: a number line with an arrow pointing down at `at`. */
function scale(o: { max: number; step: number; labelEvery: number; at: number; unit: string }): Piece {
  const base = numberLine({ from: 0, to: o.max, step: o.step, labelEvery: o.labelEvery, marks: [{ at: o.at, color: 'result' }] })
  const items: FigItem[] = [...base.items]
  items.push({ t: 'vec', from: [o.at, 2.0], to: [o.at, 0.35], color: 'result' })
  items.push(txt(o.max, 1.9, o.unit, 'lg', 'b', 'end'))
  return { ...base, items }
}

type JugSpec = { max: number; step: number; labelEvery?: number; level: number; unit?: string; color?: FigColor }

/** One or more measuring jugs side by side: a scale on the left of each, the liquid shaded. */
function jugs(specs: JugSpec[]): Piece {
  const H = 6
  const items: FigItem[] = []
  const pts: Pt[] = []
  specs.forEach((s, i) => {
    const x0 = i * 7
    const bx = x0 + 1.4
    const k = H / s.max
    const water = s.level * k
    if (water > 0) items.push(solid(rectPts(bx, 0, 3, water), s.color ?? 'a'))
    items.push(outline(rectPts(bx, 0, 3, H), 'muted'))
    if (water > 0 && water < H) items.push(line([bx, water], [bx + 3, water], 'result', { width: 3 }))
    const n = Math.round(s.max / s.step)
    const every = s.labelEvery ?? 1
    for (let j = 0; j <= n; j++) {
      const v = j * s.step
      const y = v * k
      const lab = j % every === 0
      items.push(line([bx - (lab ? 0.5 : 0.3), y], [bx, y], 'muted', { width: lab ? 2.5 : 1.5 }))
      if (lab) items.push(txt(bx - 0.65, y, String(v), 'sm', 'muted', 'end'))
    }
    if (s.unit) items.push(txt(bx + 1.5, H + 0.6, s.unit, 'lg', 'b'))
    pts.push([x0 - 0.4, -0.3], [bx + 3.2, H + 1.1])
  })
  return { dim: 2, axes: false, ...fit(pts, 0.4), items }
}

/** A big container emptied into `n` small cups (two rows). */
function pour(bigLabel: string, n: number, cupLabel: string): Piece {
  const items: FigItem[] = []
  items.push(solid(rectPts(0, 0, 4, 3.8), 'a'))
  items.push(outline(rectPts(0, 0, 4, 5), 'muted'))
  items.push(txt(2, 5.7, bigLabel, 'lg', 'b'))
  items.push({ t: 'vec', from: [4.5, 2.5], to: [6.2, 2.5], color: 'result' })
  const cols = Math.ceil(n / 2)
  for (let c = 0; c < n; c++) {
    const col = c % cols
    const row = Math.floor(c / cols)
    items.push(solid(rectPts(7 + col * 1.5, row * 2.2, 1, 1.3), 'c'))
    items.push(outline(rectPts(7 + col * 1.5, row * 2.2, 1, 1.3), 'muted'))
  }
  items.push(txt(7 + (cols * 1.5 - 0.5) / 2, -0.9, cupLabel, 'lg', 'b'))
  return { dim: 2, axes: false, ...fit([[-0.3, -1.5], [7 + cols * 1.5, 6.3]], 0.4), items }
}

/** Ons on top (0 to 10), the same places in grams underneath: 1 kg = 10 ons = 1000 g.
 *  `at` marks a place on the line. */
function ladder(at?: number): Piece {
  const base = numberLine({ from: 0, to: 10, step: 1, marks: at === undefined ? [] : [{ at }] })
  const items: FigItem[] = [...base.items]
  for (let v = 0; v <= 10; v++) items.push(txt(v, -1.9, String(v * 100), 'sm', 'b'))
  items.push(txt(-0.7, -1, 'ons', 'md', 'muted', 'end'))
  items.push(txt(-0.7, -1.9, 'g', 'md', 'b', 'end'))
  return { dim: 2, axes: false, aspect: 2.6, xSpan: [-2.6, 11], ySpan: [-2.8, 2.4], items }
}

/* ---------------------------------------------------------------------------- the module */

export const module5: Module = {
  id: 'tka-m5',
  title: L('Length, Weight and Volume', 'Panjang, Berat, dan Volume'),
  summary: L(
    'Measuring is comparing with a standard unit. You will read rulers, scales and measuring jugs, climb the staircase of units for length, weight and liquid volume, and solve word problems about distance, shopping and pouring.',
    'Mengukur berarti membandingkan dengan satuan baku. Kamu akan membaca penggaris, timbangan, dan gelas ukur, menuruni dan menaiki tangga satuan panjang, berat, dan volume zat cair, lalu menyelesaikan soal cerita tentang jarak, belanja, dan menuang.',
  ),
  submodules: [
    /* ================================================================== S1 — length */
    {
      id: 'tka-m5-s1',
      title: L('Length', 'Panjang'),
      summary: L(
        'Seven standard units of length, from kilometres to millimetres. You will measure with a ruler, change one unit into another, and solve distance and rope problems.',
        'Tujuh satuan baku panjang, dari kilometer sampai milimeter. Kamu akan mengukur dengan penggaris, mengubah satuan, dan menyelesaikan soal jarak dan tali.',
      ),
      lessons: [
        /* ---------------------------------------------------------------- l1 */
        {
          id: 'tka-m5-s1-l1',
          title: L('Standard Units of Length and Measuring', 'Satuan Baku Panjang dan Mengukur'),
          goal: L(
            'You can name the units of length in order, read a ruler to the millimetre, and choose a sensible unit.',
            'Kamu bisa menyebutkan satuan panjang secara berurutan, membaca penggaris sampai milimeter, dan memilih satuan yang masuk akal.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Whose Hand Span Is Right?', 'Ayo Amati: Jengkal Siapa yang Benar?'),
              body: L(
                'Ani and Budi measure the same table. Ani uses her hand span and says, "The table is 8 hand spans long." Budi uses his bigger hand span and says, "It is 6 hand spans."\n\nBoth are right, but their numbers are different, because a hand span is not the same for everyone. So we need a **standard unit**: a unit that is the same length for everybody, everywhere.\n\nThe basic standard unit of length is the **metre (m)**. There are smaller units like the **centimetre (cm)** and the **millimetre (mm)**, and bigger ones like the **kilometre (km)**.',
                'Ani dan Budi mengukur meja yang sama. Ani memakai jengkalnya dan berkata, "Meja ini panjangnya 8 jengkal." Budi memakai jengkalnya yang lebih besar dan berkata, "6 jengkal."\n\nKeduanya benar, tetapi bilangannya berbeda, karena jengkal setiap orang tidak sama. Karena itu kita butuh **satuan baku**: satuan yang panjangnya sama untuk semua orang di mana saja.\n\nSatuan baku dasar untuk panjang adalah **meter (m)**. Ada satuan yang lebih kecil, seperti **sentimeter (cm)** dan **milimeter (mm)**, dan yang lebih besar, seperti **kilometer (km)**.',
              ),
              figure: {
                ...fractionBars([
                  { parts: 8, shaded: 8, label: 'Ani' },
                  { parts: 6, shaded: 6, label: 'Budi' },
                ]),
                caption: L(
                  'The same table, measured with two different hand spans: 8 small ones or 6 big ones.',
                  'Meja yang sama, diukur dengan dua jengkal yang berbeda: 8 jengkal kecil atau 6 jengkal besar.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: The Staircase of Length Units', 'Contoh Bertahap: Tangga Satuan Panjang'),
              body: L(
                'Let us put the seven units of length in order, from the biggest to the smallest.\n\n1. Step 1: Write the units from the biggest to the smallest: km, hm, dam, m, dm, cm, mm.\n2. Step 2: Every step down the staircase, the unit becomes 10 times smaller, so we need 10 times as many of them. 1 km = 10 hm, 1 hm = 10 dam, 1 dam = 10 m, and so on.\n3. Step 3: Go down three steps, from m to mm: $1 \\text{ m} = 10 \\text{ dm} = 100 \\text{ cm} = 1\\,000 \\text{ mm}$.\n4. Step 4: Going up the staircase is the opposite: 10 mm make 1 cm.\n\n**Remember:** the staircase, from the biggest unit to the smallest.\n\n| Unit | Symbol | One step down |\n| --- | --- | --- |\n| kilometre | km | 1 km = 10 hm |\n| hectometre | hm | 1 hm = 10 dam |\n| decametre | dam | 1 dam = 10 m |\n| metre | m | 1 m = 10 dm |\n| decimetre | dm | 1 dm = 10 cm |\n| centimetre | cm | 1 cm = 10 mm |\n| millimetre | mm | the smallest unit |\n\nA trick for the order: **K**ing **H**enry **D**ied **B**y **D**rinking **C**hocolate **M**ilk. The fourth word stands for the base unit, which is the metre.',
                'Mari kita urutkan tujuh satuan panjang dari yang terbesar sampai yang terkecil.\n\n1. Langkah 1: Tulis satuannya dari yang terbesar ke yang terkecil: km, hm, dam, m, dm, cm, mm.\n2. Langkah 2: Setiap turun satu anak tangga, satuannya menjadi 10 kali lebih kecil, jadi kita butuh 10 kali lebih banyak. 1 km = 10 hm, 1 hm = 10 dam, 1 dam = 10 m, dan seterusnya.\n3. Langkah 3: Turun tiga anak tangga, dari m ke mm: $1 \\text{ m} = 10 \\text{ dm} = 100 \\text{ cm} = 1\\,000 \\text{ mm}$.\n4. Langkah 4: Naik tangga berarti kebalikannya: 10 mm sama dengan 1 cm.\n\n**Ingat:** tangga satuan, dari satuan terbesar ke terkecil.\n\n| Satuan | Lambang | Satu anak tangga ke bawah |\n| --- | --- | --- |\n| kilometer | km | 1 km = 10 hm |\n| hektometer | hm | 1 hm = 10 dam |\n| dekameter | dam | 1 dam = 10 m |\n| meter | m | 1 m = 10 dm |\n| desimeter | dm | 1 dm = 10 cm |\n| sentimeter | cm | 1 cm = 10 mm |\n| milimeter | mm | satuan terkecil |\n\nKalimat pengingat urutannya: **K**akak **H**arus **D**engar **M**ama, **D**an **C**ici **M**enyanyi. Kata keempat mewakili satuan dasar, yaitu meter.',
              ),
              figure: {
                ...stairs(LEN),
                caption: L(
                  'The seven units of length. One step down: multiply by 10. One step up: divide by 10.',
                  'Tujuh satuan panjang. Turun satu anak tangga: kali 10. Naik satu anak tangga: bagi 10.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: Reading a Ruler', 'Contoh Bertahap: Membaca Penggaris'),
              body: L(
                'Read the length of the pencil in the picture.\n\n1. Step 1: Look at where the pencil starts. It starts at 2 cm, not at 0.\n2. Step 2: Look at where the tip ends. It is past 9 cm, then 5 small marks further: 9 cm 5 mm.\n3. Step 3: Subtract the start from the end: 9 cm 5 mm − 2 cm = 7 cm 5 mm.\n4. Step 4: Say it in mm. 1 cm = 10 mm, so 7 cm = 70 mm, and 7 cm 5 mm = 75 mm.\n\n**Remember:**\n\n- The numbers on a ruler are cm. Between two numbers there are 10 small spaces of 1 mm each.\n- If the object does not start at 0, subtract: end − start.',
                'Bacalah panjang pensil pada gambar.\n\n1. Langkah 1: Lihat di mana pensil mulai. Pensil mulai dari 2 cm, bukan dari 0.\n2. Langkah 2: Lihat di mana ujungnya berakhir. Ujungnya melewati 9 cm, lalu 5 garis kecil lagi: 9 cm 5 mm.\n3. Langkah 3: Kurangkan awal dari akhir: 9 cm 5 mm − 2 cm = 7 cm 5 mm.\n4. Langkah 4: Nyatakan dalam mm. 1 cm = 10 mm, jadi 7 cm = 70 mm, dan 7 cm 5 mm = 75 mm.\n\n**Ingat:**\n\n- Angka pada penggaris adalah cm. Di antara dua angka ada 10 ruang kecil, masing-masing 1 mm.\n- Jika benda tidak mulai dari 0, kurangkan: akhir − awal.',
              ),
              figure: {
                ...ruler(2, 9.5),
                caption: L(
                  'A pencil on a ruler. It starts at 2 cm and the tip is at 9 cm 5 mm.',
                  'Sebuah pensil di atas penggaris. Pensil mulai dari 2 cm dan ujungnya di 9 cm 5 mm.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Rulers and Units', 'Awas, Jebakan!: Penggaris dan Satuan'),
              body: L(
                '| Wrong | Right |\n| --- | --- |\n| The pencil is 9 cm 5 mm long, because the tip is at 9 cm 5 mm. | Look at the start too. It starts at 2 cm, so the length is 9 cm 5 mm − 2 cm = 7 cm 5 mm. |\n| The small marks on a ruler are cm. | The small marks are mm. Ten of them fill the space between two numbers, which is 1 cm. |\n| A door is about 2 mm high. | Choose a sensible unit: a door in m, a pencil in cm, a road in km. |',
                '| Salah | Benar |\n| --- | --- |\n| Pensil itu panjangnya 9 cm 5 mm, karena ujungnya di 9 cm 5 mm. | Lihat juga awalnya. Pensil mulai dari 2 cm, jadi panjangnya 9 cm 5 mm − 2 cm = 7 cm 5 mm. |\n| Garis kecil pada penggaris adalah cm. | Garis kecil adalah mm. Sepuluh ruang kecil mengisi jarak antara dua angka, yaitu 1 cm. |\n| Tinggi pintu sekitar 2 mm. | Pilih satuan yang masuk akal: pintu dengan m, pensil dengan cm, jalan dengan km. |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The pencil in the picture lies on a ruler. How long is the pencil?',
                'Pensil pada gambar diletakkan di atas penggaris. Berapa panjang pensil itu?',
              ),
              figure: {
                ...ruler(1, 6.3),
                caption: L('A pencil on a ruler, in cm.', 'Sebuah pensil di atas penggaris, dalam cm.'),
              },
              options: [
                L('5.3 cm', '5,3 cm'),
                L('6.3 cm', '6,3 cm'),
                L('7.3 cm', '7,3 cm'),
                L('4.7 cm', '4,7 cm'),
              ],
              answer: 0,
              explain: L(
                'The pencil starts at 1 cm and ends at 6 cm 3 mm, so its length is 6.3 − 1 = 5.3 cm. 6.3 cm forgets the start, 7.3 cm adds the start instead of subtracting it, and 4.7 cm counts the 3 small marks backwards from 6, which reads the tip as 5.7 cm.',
                'Pensil mulai dari 1 cm dan berakhir di 6 cm 3 mm, jadi panjangnya 6,3 − 1 = 5,3 cm. 6,3 cm melupakan awalnya, 7,3 cm menjumlahkan awalnya bukan mengurangkan, dan 4,7 cm menghitung 3 garis kecil mundur dari 6, sehingga ujungnya terbaca 5,7 cm.',
              ),
              hint: L(
                'Where does the pencil start? Read the tip, then take away the part before the pencil begins.',
                'Pensil mulai dari mana? Baca ujungnya, lalu kurangkan bagian sebelum pensil mulai.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: this pencil starts at 3 cm and its tip is at 8 cm 5 mm. Change both to mm and subtract.',
                'Coba bersama: pensil ini mulai dari 3 cm dan ujungnya di 8 cm 5 mm. Ubah keduanya ke mm lalu kurangkan.',
              ),
              figure: {
                ...ruler(3, 8.5),
                caption: L('A pencil on a ruler, in cm.', 'Sebuah pensil di atas penggaris, dalam cm.'),
              },
              template: '85 - 30 = ___ \\text{ mm} = ___ \\text{ cm } ___ \\text{ mm}',
              blanks: ['55', '5', '5'],
              explain: L(
                '8 cm 5 mm is 85 mm and 3 cm is 30 mm. 85 − 30 = 55 mm, which is 5 cm 5 mm.',
                '8 cm 5 mm adalah 85 mm dan 3 cm adalah 30 mm. 85 − 30 = 55 mm, yaitu 5 cm 5 mm.',
              ),
              hint: L(
                'First subtract: 85 take away 30. Then ten mm make 1 cm, so see how many tens are in your answer.',
                'Kurangkan dulu: 85 dikurangi 30. Lalu sepuluh mm menjadi 1 cm, jadi lihat ada berapa puluhan pada jawabanmu.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'Look at the staircase. Which unit is exactly 10 times bigger than the centimetre?',
                'Lihat tangga satuan. Satuan manakah yang tepat 10 kali lebih besar daripada sentimeter?',
              ),
              figure: {
                ...stairs(LEN, [5]),
                caption: L('The centimetre is outlined in red.', 'Sentimeter diberi garis merah.'),
              },
              options: [
                L('decimetre (dm)', 'desimeter (dm)'),
                L('metre (m)', 'meter (m)'),
                L('millimetre (mm)', 'milimeter (mm)'),
                L('decametre (dam)', 'dekameter (dam)'),
              ],
              answer: 0,
              explain: L(
                'One step up the staircase is 10 times bigger, so 1 dm = 10 cm. A metre is 100 cm, a decametre is 1,000 cm, and the millimetre is 10 times smaller, not bigger.',
                'Satu anak tangga ke atas berarti 10 kali lebih besar, jadi 1 dm = 10 cm. Satu meter adalah 100 cm, satu dekameter adalah 1.000 cm, dan milimeter 10 kali lebih kecil, bukan lebih besar.',
              ),
              hint: L(
                'Bigger units are higher up the staircase. Go up exactly one step from cm.',
                'Satuan yang lebih besar ada di atas tangga. Naiklah tepat satu anak tangga dari cm.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'Choose the two pairs where the unit makes sense.',
                'Pilih dua pasangan yang satuannya masuk akal.',
              ),
              options: [
                L('The height of the classroom door: about 2 m', 'Tinggi pintu kelas: sekitar 2 m'),
                L('The length of a pencil: about 15 cm', 'Panjang pensil: sekitar 15 cm'),
                L('The distance from Jakarta to Bandung: about 150 mm', 'Jarak Jakarta ke Bandung: sekitar 150 mm'),
                L('The thickness of an exercise book: about 5 m', 'Tebal buku tulis: sekitar 5 m'),
                L('The length of a football field: about 100 km', 'Panjang lapangan sepak bola: sekitar 100 km'),
              ],
              answer: [0, 1],
              explain: L(
                'A door is about 2 m high and a pencil about 15 cm long. Jakarta to Bandung is about 150 km, a book is a few mm thick, and a football field is about 100 m long.',
                'Pintu tingginya sekitar 2 m dan pensil panjangnya sekitar 15 cm. Jakarta ke Bandung sekitar 150 km, tebal buku beberapa mm, dan lapangan sepak bola panjangnya sekitar 100 m.',
              ),
              hint: L(
                'Picture the real thing. Is a metre, a centimetre or a kilometre the size that fits it?',
                'Bayangkan bendanya. Apakah meter, sentimeter, atau kilometer yang ukurannya cocok?',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Dewi lays her crayon on a ruler, as in the picture. How long is the crayon, in millimetres?',
                'Dewi meletakkan krayonnya di atas penggaris, seperti pada gambar. Berapa panjang krayon itu dalam milimeter?',
              ),
              figure: {
                ...ruler(2, 9.7, false),
                caption: L('A crayon on a ruler, in cm.', 'Sebuah krayon di atas penggaris, dalam cm.'),
              },
              blanks: [{ answer: 77, after: '\\text{ mm}' }],
              hints: [
                L(
                  'Where does the crayon start? It does not start at 0.',
                  'Krayon mulai dari mana? Krayon tidak mulai dari 0.',
                ),
                L(
                  'Read the start and the tip in cm and mm, then subtract the start from the tip.',
                  'Baca awal dan ujung krayon dalam cm dan mm, lalu kurangkan awal dari ujung.',
                ),
                L(
                  'The tip is at 9 cm 7 mm = 97 mm and the start is at 2 cm = 20 mm. Now subtract the two numbers.',
                  'Ujungnya di 9 cm 7 mm = 97 mm dan awalnya di 2 cm = 20 mm. Sekarang kurangkan kedua bilangan itu.',
                ),
              ],
              explain: L(
                'The crayon starts at 2 cm and the tip is at 9 cm 7 mm. 97 mm − 20 mm = 77 mm.',
                'Krayon mulai dari 2 cm dan ujungnya di 9 cm 7 mm. 97 mm − 20 mm = 77 mm.',
              ),
              solution: {
                en: ['\\text{tip} = 9\\text{ cm }7\\text{ mm} = 97\\text{ mm}', '\\text{start} = 2\\text{ cm} = 20\\text{ mm}', '97 - 20 = 77\\text{ mm}'],
                id: ['\\text{ujung} = 9\\text{ cm }7\\text{ mm} = 97\\text{ mm}', '\\text{awal} = 2\\text{ cm} = 20\\text{ mm}', '97 - 20 = 77\\text{ mm}'],
              },
            },
          ],
        },

        /* ---------------------------------------------------------------- l2 */
        {
          id: 'tka-m5-s1-l2',
          title: L('Converting Units of Length and Word Problems', 'Mengubah Satuan Panjang dan Soal Cerita'),
          goal: L(
            'You can change one unit of length into another, use mixed units, and solve distance and rope problems.',
            'Kamu bisa mengubah satu satuan panjang ke satuan lain, memakai satuan campuran, dan menyelesaikan soal jarak dan tali.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Down the Stairs and Up the Stairs', 'Ayo Amati: Turun dan Naik Tangga'),
              body: L(
                'Citra has a ribbon 2 m long. She wants to know how many centimetres that is. From m to cm we go **down** two steps on the staircase, and every step down is $\\times 10$. So $2 \\times 10 \\times 10 = 200$, and 2 m = 200 cm.\n\nNow the other way. A rope is 500 cm long. From cm to m we go **up** two steps, and every step up is $\\div 10$. So $500 \\div 10 \\div 10 = 5$, and 500 cm = 5 m.\n\nThe rule is short: **down = multiply, up = divide.** Going down gives a bigger number because the unit gets smaller.',
                'Citra punya pita sepanjang 2 m. Ia ingin tahu berapa sentimeter panjangnya. Dari m ke cm kita **turun** dua anak tangga, dan setiap turun satu anak tangga adalah $\\times 10$. Jadi $2 \\times 10 \\times 10 = 200$, dan 2 m = 200 cm.\n\nSekarang sebaliknya. Seutas tali panjangnya 500 cm. Dari cm ke m kita **naik** dua anak tangga, dan setiap naik satu anak tangga adalah $\\div 10$. Jadi $500 \\div 10 \\div 10 = 5$, dan 500 cm = 5 m.\n\nAturannya singkat: **turun = kali, naik = bagi.** Turun menghasilkan bilangan yang lebih besar karena satuannya menjadi lebih kecil.',
              ),
              figure: {
                ...stairs(LEN, [3, 5]),
                caption: L(
                  'From m down to cm is two steps: multiply by 10 twice.',
                  'Dari m turun ke cm ada dua anak tangga: kali 10 sebanyak dua kali.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Mixed Units, 3 km 450 m', 'Contoh Bertahap: Satuan Campuran, 3 km 450 m'),
              body: L(
                'The distance from Eko’s house to school is 3 km 450 m. How many metres is that?\n\n1. Step 1: The distance has two units, km and m. Change the bigger unit first.\n2. Step 2: From km to m we go down three steps (km, hm, dam, m), so we multiply by $10 \\times 10 \\times 10 = 1\\,000$. 3 km = 3 × 1,000 = 3,000 m.\n3. Step 3: Add the part that is already in metres: $3\\,000 + 450 = 3\\,450$ m.\n4. Step 4: Check by going back up: $3\\,450 \\div 1\\,000$ is a little more than 3, so 3 km 450 m is right.\n\n**Remember:**\n\n| From | To | What to do |\n| --- | --- | --- |\n| km | m | multiply by 1,000 |\n| m | cm | multiply by 100 |\n| cm | mm | multiply by 10 |\n| mm | cm | divide by 10 |\n| m | km | divide by 1,000 |',
                'Jarak dari rumah Eko ke sekolah adalah 3 km 450 m. Berapa meter jarak itu?\n\n1. Langkah 1: Jarak itu punya dua satuan, km dan m. Ubah dulu satuan yang lebih besar.\n2. Langkah 2: Dari km ke m kita turun tiga anak tangga (km, hm, dam, m), jadi kita kalikan $10 \\times 10 \\times 10 = 1\\,000$. 3 km = 3 × 1.000 = 3.000 m.\n3. Langkah 3: Tambahkan bagian yang sudah dalam meter: $3\\,000 + 450 = 3\\,450$ m.\n4. Langkah 4: Cek dengan naik kembali: $3\\,450 \\div 1\\,000$ sedikit lebih dari 3, jadi 3 km 450 m sudah benar.\n\n**Ingat:**\n\n| Dari | Ke | Caranya |\n| --- | --- | --- |\n| km | m | kali 1.000 |\n| m | cm | kali 100 |\n| cm | mm | kali 10 |\n| mm | cm | bagi 10 |\n| m | km | bagi 1.000 |',
              ),
              figure: {
                ...numberLine({
                  from: 0,
                  to: 4000,
                  step: 500,
                  labelEvery: 2,
                  jumps: [
                    { from: 0, to: 3000, label: '3 km', color: 'a' },
                    { from: 3000, to: 3450, label: '450 m', color: 'b' },
                  ],
                }),
                caption: L(
                  'The number line is in metres. 3 km is a jump of 3,000 m, then 450 m more.',
                  'Garis bilangan dalam meter. 3 km adalah lompatan 3.000 m, lalu 450 m lagi.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Converting Lengths', 'Awas, Jebakan!: Mengubah Satuan Panjang'),
              body: L(
                '| Wrong | Right |\n| --- | --- |\n| 5 m = 50 cm | From m to cm is two steps down, so multiply by 100: 5 m = 500 cm. |\n| 2 m 35 cm = 2 + 35 = 37 cm | Change the metres first: 200 cm + 35 cm = 235 cm. |\n| 1 m + 50 cm = 51 | The units must be the same before you add: 100 cm + 50 cm = 150 cm. |',
                '| Salah | Benar |\n| --- | --- |\n| 5 m = 50 cm | Dari m ke cm ada dua anak tangga turun, jadi kalikan 100: 5 m = 500 cm. |\n| 2 m 35 cm = 2 + 35 = 37 cm | Ubah dulu meternya: 200 cm + 35 cm = 235 cm. |\n| 1 m + 50 cm = 51 | Satuannya harus sama sebelum dijumlahkan: 100 cm + 50 cm = 150 cm. |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Look at the staircase from km down to m. How many metres are in 5 km?',
                'Lihat tangga dari km turun ke m. Ada berapa meter dalam 5 km?',
              ),
              figure: {
                ...stairs(LEN, [0, 3]),
                caption: L('From km to m is three steps down.', 'Dari km ke m ada tiga anak tangga turun.'),
              },
              options: [
                L('5,000 m', '5.000 m'),
                L('500 m', '500 m'),
                L('50 m', '50 m'),
                L('50,000 m', '50.000 m'),
              ],
              answer: 0,
              explain: L(
                'Three steps down means $\\times 10$ three times, which is $\\times 1\\,000$. So 5 km = 5,000 m. 500 m uses only two steps, 50 m only one, and 50,000 m uses four.',
                'Tiga anak tangga turun berarti $\\times 10$ tiga kali, yaitu $\\times 1\\,000$. Jadi 5 km = 5.000 m. 500 m hanya memakai dua anak tangga, 50 m hanya satu, dan 50.000 m memakai empat.',
              ),
              hint: L(
                'Count the steps from km to m on the staircase. Each step is ×10.',
                'Hitung anak tangga dari km ke m pada tangga. Tiap anak tangga adalah ×10.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: change 4 m 25 cm into centimetres.',
                'Coba bersama: ubah 4 m 25 cm menjadi sentimeter.',
              ),
              template: '4 \\text{ m} = ___ \\text{ cm},\\quad 400 + 25 = ___ \\text{ cm}',
              blanks: ['400', '425'],
              explain: L(
                '4 m = 4 × 100 = 400 cm, and 400 cm + 25 cm = 425 cm.',
                '4 m = 4 × 100 = 400 cm, dan 400 cm + 25 cm = 425 cm.',
              ),
              hint: L(
                'From m to cm is two steps down, so multiply by 100. Then add the 25 cm that is left.',
                'Dari m ke cm ada dua anak tangga turun, jadi kalikan 100. Lalu tambahkan 25 cm yang tersisa.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'Citra lays two pieces of rope end to end: one is 1 m 20 cm long and the other is 85 cm long. How long are they together?',
                'Citra menyambung dua tali: satu panjangnya 1 m 20 cm dan yang lain 85 cm. Berapa panjang keduanya bersama?',
              ),
              figure: {
                ...numberLine({
                  from: 0,
                  to: 250,
                  step: 10,
                  labelEvery: 5,
                  jumps: [
                    { from: 0, to: 120, label: '1 m 20 cm', color: 'a' },
                    { from: 120, to: 205, label: '85 cm', color: 'b' },
                  ],
                }),
                caption: L(
                  'The number line is in centimetres. The two pieces of rope are laid one after the other.',
                  'Garis bilangan dalam sentimeter. Kedua tali diletakkan berurutan.',
                ),
              },
              options: [
                L('205 cm', '205 cm'),
                L('105 cm', '105 cm'),
                L('305 cm', '305 cm'),
                L('1,105 cm', '1.105 cm'),
              ],
              answer: 0,
              explain: L(
                '1 m 20 cm = 120 cm, and 120 + 85 = 205 cm. 105 cm leaves out the 1 m, 305 cm counts 1 m as 200 cm, and 1,105 cm counts 1 m as 1,000 cm.',
                '1 m 20 cm = 120 cm, dan 120 + 85 = 205 cm. 105 cm melupakan 1 m, 305 cm menganggap 1 m sebagai 200 cm, dan 1.105 cm menganggap 1 m sebagai 1.000 cm.',
              ),
              hint: L(
                'Write both lengths in cm first. How many cm is 1 m?',
                'Tulis kedua panjang dalam cm dulu. 1 m sama dengan berapa cm?',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
              statements: [
                L('3 m = 300 cm.', '3 m = 300 cm.'),
                L('450 cm = 45 m.', '450 cm = 45 m.'),
                L('2 km 300 m = 2,300 m.', '2 km 300 m = 2.300 m.'),
                L('1 m 5 cm = 15 cm.', '1 m 5 cm = 15 cm.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                '3 m = 300 cm and 2 km 300 m = 2,000 m + 300 m = 2,300 m. But 450 cm = 4 m 50 cm, which is 4.5 m and not 45 m, and 1 m 5 cm = 100 + 5 = 105 cm, not 15 cm.',
                '3 m = 300 cm dan 2 km 300 m = 2.000 m + 300 m = 2.300 m. Tetapi 450 cm = 4 m 50 cm, yaitu 4,5 m dan bukan 45 m, dan 1 m 5 cm = 100 + 5 = 105 cm, bukan 15 cm.',
              ),
              hint: L(
                'Change each one step by step: count the steps on the staircase and multiply or divide by 10 for each step.',
                'Ubah satu per satu: hitung anak tangga pada tangga, lalu kali atau bagi 10 untuk tiap anak tangga.',
              ),
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: L(
                'Put the steps for changing 2 m 40 cm into centimetres in order.',
                'Urutkan langkah mengubah 2 m 40 cm menjadi sentimeter.',
              ),
              lines: [
                '2\\text{ m } 40\\text{ cm} = ?\\text{ cm}',
                '2\\text{ m} = 2 \\times 100 = 200\\text{ cm}',
                '200 + 40 = 240',
                '2\\text{ m } 40\\text{ cm} = 240\\text{ cm}',
              ],
              explain: L(
                'First change the big unit (m) into cm, then add the cm that were already there, and last write the answer.',
                'Pertama ubah satuan besar (m) ke cm, lalu tambahkan cm yang sudah ada, dan terakhir tulis jawabannya.',
              ),
              hint: L(
                'You cannot add the 40 cm before you know how many cm are in the 2 m.',
                'Kamu belum bisa menambahkan 40 cm sebelum tahu 2 m sama dengan berapa cm.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Ani walks 1 km 250 m from home to school. On the way home she takes a shortcut that is 350 m shorter. How many metres does Ani walk to school and back home?',
                'Ani berjalan 1 km 250 m dari rumah ke sekolah. Saat pulang ia lewat jalan pintas yang 350 m lebih pendek. Berapa meter Ani berjalan dari rumah ke sekolah dan pulang lagi?',
              ),
              blanks: [{ answer: 2150, after: '\\text{ m}' }],
              hints: [
                L(
                  'There are two trips: going to school and coming home. Write the length of each trip.',
                  'Ada dua perjalanan: pergi ke sekolah dan pulang. Tulis panjang tiap perjalanan.',
                ),
                L(
                  'Change 1 km 250 m into metres first. Then the way home is 350 m less.',
                  'Ubah dulu 1 km 250 m menjadi meter. Lalu jalan pulang kurang 350 m.',
                ),
                L(
                  'Going: 1,250 m. Coming back: 1,250 − 350 m. Add the two trips together.',
                  'Pergi: 1.250 m. Pulang: 1.250 − 350 m. Jumlahkan kedua perjalanan.',
                ),
              ],
              explain: L(
                '1 km 250 m = 1,250 m. The way home is 1,250 − 350 = 900 m. In all: 1,250 + 900 = 2,150 m.',
                '1 km 250 m = 1.250 m. Jalan pulang 1.250 − 350 = 900 m. Seluruhnya: 1.250 + 900 = 2.150 m.',
              ),
              solution: {
                en: ['1\\text{ km }250\\text{ m} = 1\\,250\\text{ m}', '\\text{way home} = 1\\,250 - 350 = 900\\text{ m}', '1\\,250 + 900 = 2\\,150\\text{ m}'],
                id: ['1\\text{ km }250\\text{ m} = 1\\,250\\text{ m}', '\\text{pulang} = 1\\,250 - 350 = 900\\text{ m}', '1\\,250 + 900 = 2\\,150\\text{ m}'],
              },
            },
          ],
        },
      ],
      project: {
        id: 'tka-m5-s1-p',
        runtime: 'math',
        title: L('Project: Measuring Lengths', 'Proyek: Mengukur Panjang'),
        brief: L(
          'Four problems about units of length, from changing one unit to a clever fence puzzle.',
          'Empat soal tentang satuan panjang, dari mengubah satuan sampai teka-teki pagar yang cerdik.',
        ),
        requirements: [
          L('Change units of length up and down the staircase.', 'Mengubah satuan panjang naik dan turun tangga.'),
          L('Add and subtract lengths written in different units.', 'Menjumlah dan mengurangkan panjang yang ditulis dalam satuan berbeda.'),
        ],
        tasks: [
          {
            prompt: L('How many metres are in 6 km?', 'Ada berapa meter dalam 6 km?'),
            blanks: [{ answer: 6000, after: '\\text{ m}' }],
            solution: ['6\\text{ km} = 6 \\times 1\\,000 = 6\\,000\\text{ m}'],
          },
          {
            prompt: L('Change 3 m 8 cm into centimetres.', 'Ubah 3 m 8 cm menjadi sentimeter.'),
            blanks: [{ answer: 308, after: '\\text{ cm}' }],
            solution: ['3\\text{ m} = 300\\text{ cm}', '300 + 8 = 308\\text{ cm}'],
          },
          {
            prompt: L(
              'Dewi has a ribbon 5 m 20 cm long. Eko has a ribbon 380 cm long. How many centimetres longer is Dewi’s ribbon?',
              'Dewi punya pita sepanjang 5 m 20 cm. Eko punya pita sepanjang 380 cm. Pita Dewi lebih panjang berapa sentimeter?',
            ),
            blanks: [{ answer: 140, after: '\\text{ cm}' }],
            solution: ['5\\text{ m }20\\text{ cm} = 520\\text{ cm}', '520 - 380 = 140\\text{ cm}'],
          },
          {
            prompt: L(
              'Pak Joko builds a straight fence 1 km long. He puts a post at the very start and then another post every 5 m, up to the very end. The picture shows the first 20 m. How many posts does he need in all?',
              'Pak Joko membuat pagar lurus sepanjang 1 km. Ia memasang tiang di awal pagar, lalu satu tiang lagi setiap 5 m, sampai ujung pagar. Gambar menunjukkan 20 m pertama. Berapa banyak tiang yang ia butuhkan seluruhnya?',
            ),
            figure: {
              ...numberLine({
                from: 0,
                to: 20,
                step: 5,
                marks: [{ at: 0 }, { at: 5 }, { at: 10 }, { at: 15 }, { at: 20 }],
              }),
              caption: L(
                'The first 20 m of the fence, in metres. Each dot is a post.',
                '20 m pertama dari pagar, dalam meter. Setiap titik adalah satu tiang.',
              ),
            },
            blanks: [{ answer: 201, after: { en: '\\text{ posts}', id: '\\text{ tiang}' } }],
            solution: {
              en: ['1\\text{ km} = 1\\,000\\text{ m}', '\\text{gaps} = 1\\,000 \\div 5 = 200', '\\text{posts} = 200 + 1 = 201'],
              id: ['1\\text{ km} = 1\\,000\\text{ m}', '\\text{jarak antartiang} = 1\\,000 \\div 5 = 200', '\\text{tiang} = 200 + 1 = 201'],
            },
          },
        ],
        hints: [
          L(
            'Write all the lengths in the same unit before you add or subtract.',
            'Tulis semua panjang dalam satuan yang sama sebelum menjumlah atau mengurangkan.',
          ),
          L(
            'Down the staircase you multiply by 10 for each step. Up the staircase you divide by 10.',
            'Turun tangga berarti kali 10 untuk tiap anak tangga. Naik tangga berarti bagi 10.',
          ),
          L(
            'For the fence, look at the picture: 20 m has 4 gaps but 5 posts. Count the gaps first.',
            'Untuk pagar, lihat gambar: 20 m punya 4 jarak tetapi 5 tiang. Hitung dulu jaraknya.',
          ),
        ],
        xp: 50,
      },
    },
    /* ================================================================== S2 — weight */
    {
      id: 'tka-m5-s2',
      title: L('Weight', 'Berat'),
      summary: L(
        'Seven standard units of weight, from kilograms to milligrams. You will read a scale, use the ons in the market, and solve shopping problems.',
        'Tujuh satuan baku berat, dari kilogram sampai miligram. Kamu akan membaca timbangan, memakai ons di pasar, dan menyelesaikan soal belanja.',
      ),
      lessons: [
        /* ---------------------------------------------------------------- l1 */
        {
          id: 'tka-m5-s2-l1',
          title: L('Standard Units of Weight and Weighing', 'Satuan Baku Berat dan Menimbang'),
          goal: L(
            'You can name the units of weight in order, read a scale, and choose a sensible unit.',
            'Kamu bisa menyebutkan satuan berat secara berurutan, membaca timbangan, dan memilih satuan yang masuk akal.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: The Scale at the Market', 'Ayo Amati: Timbangan di Pasar'),
              body: L(
                'Mrs. Siti buys sugar at the market. The seller puts the sugar on a scale and the pointer stops at 500. Five hundred what? On this scale the numbers are **grams (g)**.\n\n**Weight** tells us how heavy something is. The basic standard unit of weight is the **gram (g)**. Heavier things are weighed in **kilograms (kg)**, and 1 kg = 1,000 g, so 500 g is half a kilogram.\n\nIn the market people also use the **ons**. The ons is the same as the **hectogram (hg)**, and 1 ons = 100 g.',
                'Ibu Siti membeli gula di pasar. Penjual menaruh gula di timbangan dan jarumnya berhenti di angka 500. Lima ratus apa? Pada timbangan ini, angkanya dalam **gram (g)**.\n\n**Berat** menunjukkan seberapa berat suatu benda. Satuan baku dasar untuk berat adalah **gram (g)**. Benda yang lebih berat ditimbang dengan **kilogram (kg)**, dan 1 kg = 1.000 g, jadi 500 g adalah setengah kilogram.\n\nDi pasar orang juga memakai **ons**. Ons sama dengan **hektogram (hg)**, dan 1 ons = 100 g.',
              ),
              figure: {
                ...scale({ max: 1000, step: 100, labelEvery: 1, at: 500, unit: 'g' }),
                caption: L('The pointer of the scale stops at 500 g.', 'Jarum timbangan berhenti di 500 g.'),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: The Staircase of Weight Units', 'Contoh Bertahap: Tangga Satuan Berat'),
              body: L(
                'The units of weight make the same staircase as the units of length.\n\n1. Step 1: Write the units from the biggest to the smallest: kg, hg, dag, g, dg, cg, mg.\n2. Step 2: Every step down the staircase is $\\times 10$, and every step up is $\\div 10$.\n3. Step 3: Go down three steps, from kg to g: $1 \\text{ kg} = 10 \\text{ hg} = 100 \\text{ dag} = 1\\,000 \\text{ g}$.\n4. Step 4: The hg is the ons. So 1 ons = 1 hg = 10 dag = 100 g, and 1 kg = 10 ons.\n\n**Remember:** the staircase, from the biggest unit to the smallest.\n\n| Unit | Symbol | One step down |\n| --- | --- | --- |\n| kilogram | kg | 1 kg = 10 hg |\n| hectogram (ons) | hg | 1 hg = 10 dag |\n| decagram | dag | 1 dag = 10 g |\n| gram | g | 1 g = 10 dg |\n| decigram | dg | 1 dg = 10 cg |\n| centigram | cg | 1 cg = 10 mg |\n| milligram | mg | the smallest unit |\n\nThe same trick works here: **K**ing **H**enry **D**ied **B**y **D**rinking **C**hocolate **M**ilk. The fourth word is now the gram.',
                'Satuan berat membentuk tangga yang sama seperti satuan panjang.\n\n1. Langkah 1: Tulis satuannya dari yang terbesar ke yang terkecil: kg, hg, dag, g, dg, cg, mg.\n2. Langkah 2: Setiap turun satu anak tangga adalah $\\times 10$, dan setiap naik satu anak tangga adalah $\\div 10$.\n3. Langkah 3: Turun tiga anak tangga, dari kg ke g: $1 \\text{ kg} = 10 \\text{ hg} = 100 \\text{ dag} = 1\\,000 \\text{ g}$.\n4. Langkah 4: hg adalah ons. Jadi 1 ons = 1 hg = 10 dag = 100 g, dan 1 kg = 10 ons.\n\n**Ingat:** tangga satuan, dari satuan terbesar ke terkecil.\n\n| Satuan | Lambang | Satu anak tangga ke bawah |\n| --- | --- | --- |\n| kilogram | kg | 1 kg = 10 hg |\n| hektogram (ons) | hg | 1 hg = 10 dag |\n| dekagram | dag | 1 dag = 10 g |\n| gram | g | 1 g = 10 dg |\n| desigram | dg | 1 dg = 10 cg |\n| sentigram | cg | 1 cg = 10 mg |\n| miligram | mg | satuan terkecil |\n\nKalimat pengingat yang sama berlaku di sini: **K**akak **H**arus **D**engar **M**ama, **D**an **C**ici **M**enyanyi. Kata keempat sekarang mewakili gram.',
              ),
              figure: {
                ...stairs(WEI, [1]),
                caption: L(
                  'The seven units of weight. The hg (the ons) is outlined in red.',
                  'Tujuh satuan berat. hg (ons) diberi garis merah.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: Reading a Scale', 'Contoh Bertahap: Membaca Timbangan'),
              body: L(
                'Read the weight shown by the scale in the picture.\n\n1. Step 1: Look at the unit. This scale shows grams (g).\n2. Step 2: Find what one small space is worth. Between 300 and 400 there are 2 small spaces, so each one is $100 \\div 2 = 50$ g.\n3. Step 3: Find the last number the pointer has passed. It is 300.\n4. Step 4: Count the small spaces after it. There is 1 space, which is 50 g. So $300 + 50 = 350$ g.\n5. Step 5: Say it in ons: 350 g = 3 ons 50 g.\n\n**Remember:**\n\n- First find what one small space is worth, then count the spaces.\n- A pointer between two numbers has not reached the bigger one.',
                'Bacalah berat yang ditunjukkan timbangan pada gambar.\n\n1. Langkah 1: Lihat satuannya. Timbangan ini menunjukkan gram (g).\n2. Langkah 2: Cari nilai satu ruang kecil. Di antara 300 dan 400 ada 2 ruang kecil, jadi masing-masing $100 \\div 2 = 50$ g.\n3. Langkah 3: Cari angka terakhir yang sudah dilewati jarum. Angka itu 300.\n4. Langkah 4: Hitung ruang kecil sesudahnya. Ada 1 ruang, yaitu 50 g. Jadi $300 + 50 = 350$ g.\n5. Langkah 5: Nyatakan dalam ons: 350 g = 3 ons 50 g.\n\n**Ingat:**\n\n- Cari dulu nilai satu ruang kecil, baru hitung ruangnya.\n- Jarum di antara dua angka belum mencapai angka yang lebih besar.',
              ),
              figure: {
                ...scale({ max: 1000, step: 50, labelEvery: 2, at: 350, unit: 'g' }),
                caption: L(
                  'A scale in grams. The pointer is between 300 and 400.',
                  'Sebuah timbangan dalam gram. Jarum berada di antara 300 dan 400.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Scales and Weight Units', 'Awas, Jebakan!: Timbangan dan Satuan Berat'),
              body: L(
                '| Wrong | Right |\n| --- | --- |\n| The pointer is between 300 and 400, so the weight is 400 g. | The pointer has not reached 400. One small space is 50 g, so the weight is 300 + 50 = 350 g. |\n| 1 kg = 100 g | From kg to g is three steps down, so 1 kg = 1,000 g. |\n| 2,500 g is heavier than 3 kg, because 2,500 is more than 3. | Compare in the same unit: 3 kg = 3,000 g, and 3,000 is more than 2,500. |',
                '| Salah | Benar |\n| --- | --- |\n| Jarum di antara 300 dan 400, jadi beratnya 400 g. | Jarum belum mencapai 400. Satu ruang kecil adalah 50 g, jadi beratnya 300 + 50 = 350 g. |\n| 1 kg = 100 g | Dari kg ke g ada tiga anak tangga turun, jadi 1 kg = 1.000 g. |\n| 2.500 g lebih berat daripada 3 kg, karena 2.500 lebih besar daripada 3. | Bandingkan dalam satuan yang sama: 3 kg = 3.000 g, dan 3.000 lebih besar daripada 2.500. |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Dewi puts a bag of flour on the scale. How many grams does the flour weigh?',
                'Dewi menaruh sekantong tepung di timbangan. Berapa gram berat tepung itu?',
              ),
              figure: {
                ...scale({ max: 1000, step: 50, labelEvery: 2, at: 650, unit: 'g' }),
                caption: L('A scale in grams.', 'Sebuah timbangan dalam gram.'),
              },
              options: [L('650 g', '650 g'), L('600 g', '600 g'), L('700 g', '700 g'), L('750 g', '750 g')],
              answer: 0,
              explain: L(
                'The pointer passed 600 g and is one small space (50 g) further, so it shows 650 g. 600 g and 700 g are the nearest numbers, not the reading, and 750 g counts three small spaces.',
                'Jarum melewati 600 g dan berada satu ruang kecil (50 g) sesudahnya, jadi menunjukkan 650 g. 600 g dan 700 g adalah angka terdekat, bukan hasil bacaan, dan 750 g menghitung tiga ruang kecil.',
              ),
              hint: L(
                'Find what one small space is worth first. Then count the small spaces after the last number the pointer has passed.',
                'Cari dulu nilai satu ruang kecil. Lalu hitung ruang kecil setelah angka terakhir yang dilewati jarum.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: the pointer has passed 700 g and is one small space further. One small space is worth 50 g.',
                'Coba bersama: jarum sudah melewati 700 g dan berada satu ruang kecil sesudahnya. Satu ruang kecil bernilai 50 g.',
              ),
              figure: {
                ...scale({ max: 1000, step: 50, labelEvery: 2, at: 750, unit: 'g' }),
                caption: L('A scale in grams.', 'Sebuah timbangan dalam gram.'),
              },
              template: '700 + ___ = ___ \\text{ g}',
              blanks: ['50', '750'],
              explain: L(
                'One small space is 50 g, so 700 + 50 = 750 g.',
                'Satu ruang kecil adalah 50 g, jadi 700 + 50 = 750 g.',
              ),
              hint: L(
                'The first blank is what the one small space is worth. Add it to 700 for the second blank.',
                'Kotak pertama adalah nilai satu ruang kecil. Tambahkan ke 700 untuk kotak kedua.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The hg is also called the ons. Look at the staircase: how many grams is 1 ons?',
                'Hektogram (hg) juga disebut ons. Lihat tangga satuan: 1 ons sama dengan berapa gram?',
              ),
              figure: {
                ...stairs(WEI, [1, 3]),
                caption: L('The hg and the g are outlined in red.', 'hg dan g diberi garis merah.'),
              },
              options: [L('100 g', '100 g'), L('10 g', '10 g'), L('1,000 g', '1.000 g'), L('1 g', '1 g')],
              answer: 0,
              explain: L(
                'From hg down to g are two steps, so multiply by 10 twice: 1 ons = 100 g. 10 g is only one step and 1,000 g is the value of a kg.',
                'Dari hg turun ke g ada dua anak tangga, jadi kalikan 10 dua kali: 1 ons = 100 g. 10 g hanya satu anak tangga dan 1.000 g adalah nilai satu kg.',
              ),
              hint: L(
                'Count the steps from hg down to g. Each step is ×10.',
                'Hitung anak tangga dari hg turun ke g. Tiap anak tangga adalah ×10.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'Choose the two pairs where the unit makes sense.',
                'Pilih dua pasangan yang satuannya masuk akal.',
              ),
              options: [
                L('A sack of rice: about 25 kg', 'Sekarung beras: sekitar 25 kg'),
                L('One tablet of medicine: about 500 mg', 'Satu tablet obat: sekitar 500 mg'),
                L('A gold ring: about 5 kg', 'Sebuah cincin emas: sekitar 5 kg'),
                L('An apple: about 150 kg', 'Sebuah apel: sekitar 150 kg'),
                L('A cow: about 400 g', 'Seekor sapi: sekitar 400 g'),
              ],
              answer: [0, 1],
              explain: L(
                'A sack of rice is about 25 kg and a tablet is about 500 mg. A gold ring weighs a few g, an apple about 150 g, and a cow about 400 kg.',
                'Sekarung beras sekitar 25 kg dan satu tablet sekitar 500 mg. Cincin emas beratnya beberapa g, apel sekitar 150 g, dan sapi sekitar 400 kg.',
              ),
              hint: L(
                'Think about how heavy the real thing feels. Is a kg, a g or an mg the size that fits it?',
                'Bayangkan seberapa berat bendanya. Apakah kg, g, atau mg yang ukurannya cocok?',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'At the market Mrs. Siti buys 1 kg of rice, 3 ons of sugar and 250 g of salt. How many grams does she buy in all?',
                'Di pasar Ibu Siti membeli 1 kg beras, 3 ons gula, dan 250 g garam. Berapa gram seluruh belanjaannya?',
              ),
              blanks: [{ answer: 1550, after: '\\text{ g}' }],
              hints: [
                L(
                  'The three things are in three different units: kg, ons and g. What must you do before you add?',
                  'Ketiga barang memakai tiga satuan berbeda: kg, ons, dan g. Apa yang harus dilakukan sebelum menjumlahkan?',
                ),
                L(
                  'Change every amount into grams. 1 kg = 1,000 g and 1 ons = 100 g.',
                  'Ubah semua ke dalam gram. 1 kg = 1.000 g dan 1 ons = 100 g.',
                ),
                L(
                  'Rice: 1,000 g. Sugar: 3 × 100 g. Salt: 250 g. Add the three amounts.',
                  'Beras: 1.000 g. Gula: 3 × 100 g. Garam: 250 g. Jumlahkan ketiganya.',
                ),
              ],
              explain: L(
                '1 kg = 1,000 g and 3 ons = 300 g. Together: 1,000 + 300 + 250 = 1,550 g.',
                '1 kg = 1.000 g dan 3 ons = 300 g. Seluruhnya: 1.000 + 300 + 250 = 1.550 g.',
              ),
              solution: {
                en: ['1\\text{ kg} = 1\\,000\\text{ g}', '3\\text{ ons} = 3 \\times 100 = 300\\text{ g}', '1\\,000 + 300 + 250 = 1\\,550\\text{ g}'],
                id: ['1\\text{ kg} = 1\\,000\\text{ g}', '3\\text{ ons} = 3 \\times 100 = 300\\text{ g}', '1\\,000 + 300 + 250 = 1\\,550\\text{ g}'],
              },
            },
          ],
        },

        /* ---------------------------------------------------------------- l2 */
        {
          id: 'tka-m5-s2-l2',
          title: L('Converting Units of Weight and Word Problems', 'Mengubah Satuan Berat dan Soal Cerita'),
          goal: L(
            'You can change units of weight, use mixed units, and solve shopping problems with kg, ons and g.',
            'Kamu bisa mengubah satuan berat, memakai satuan campuran, dan menyelesaikan soal belanja dengan kg, ons, dan g.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Kilograms, Ons and Grams', 'Ayo Amati: Kilogram, Ons, dan Gram'),
              body: L(
                'Pak Budi weighs 1 kg of oranges on a scale that shows ons. The pointer stops at 10 ons. So 1 kg = 10 ons.\n\nLook at the double number line. The top row shows ons and the bottom row shows the same places in grams. One ons is 100 g, so 10 ons is 1,000 g.\n\nTo change units we use the staircase again: **down = multiply, up = divide.** From kg down to g we multiply by 1,000. From g up to kg we divide by 1,000.',
                'Pak Budi menimbang 1 kg jeruk dengan timbangan yang menunjukkan ons. Jarumnya berhenti di 10 ons. Jadi 1 kg = 10 ons.\n\nLihat garis bilangan ganda. Baris atas menunjukkan ons dan baris bawah menunjukkan tempat yang sama dalam gram. Satu ons adalah 100 g, jadi 10 ons adalah 1.000 g.\n\nUntuk mengubah satuan kita memakai tangga lagi: **turun = kali, naik = bagi.** Dari kg turun ke g kita kalikan 1.000. Dari g naik ke kg kita bagi 1.000.',
              ),
              figure: {
                ...ladder(10),
                caption: L(
                  'Top row: ons. Bottom row (orange): the same places in grams.',
                  'Baris atas: ons. Baris bawah (oranye): tempat yang sama dalam gram.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Mixed Units, 3 kg 250 g', 'Contoh Bertahap: Satuan Campuran, 3 kg 250 g'),
              body: L(
                'Ani’s bag weighs 3 kg 250 g. How many grams is that? And how do we write 3,250 g with kg and g?\n\n1. Step 1: Change the kg into g. From kg to g is three steps down, so multiply by 1,000: 3 kg = 3,000 g.\n2. Step 2: Add the grams that are already there: $3\\,000 + 250 = 3\\,250$ g.\n3. Step 3: Now go the other way. $3\\,250 \\div 1\\,000$ gives 3, and 250 is left over.\n4. Step 4: Write the answer with both units: 3,250 g = 3 kg 250 g.\n\n**Remember:**\n\n| From | To | What to do |\n| --- | --- | --- |\n| kg | g | multiply by 1,000 |\n| g | kg | divide by 1,000 |\n| kg | ons | multiply by 10 |\n| ons | g | multiply by 100 |\n| g | ons | divide by 100 |',
                'Tas Ani beratnya 3 kg 250 g. Berapa gram itu? Dan bagaimana menulis 3.250 g dengan kg dan g?\n\n1. Langkah 1: Ubah kg menjadi g. Dari kg ke g ada tiga anak tangga turun, jadi kalikan 1.000: 3 kg = 3.000 g.\n2. Langkah 2: Tambahkan gram yang sudah ada: $3\\,000 + 250 = 3\\,250$ g.\n3. Langkah 3: Sekarang arah sebaliknya. $3\\,250 \\div 1\\,000$ hasilnya 3, dan tersisa 250.\n4. Langkah 4: Tulis jawabannya dengan dua satuan: 3.250 g = 3 kg 250 g.\n\n**Ingat:**\n\n| Dari | Ke | Caranya |\n| --- | --- | --- |\n| kg | g | kali 1.000 |\n| g | kg | bagi 1.000 |\n| kg | ons | kali 10 |\n| ons | g | kali 100 |\n| g | ons | bagi 100 |',
              ),
              figure: {
                ...numberLine({
                  from: 0,
                  to: 4000,
                  step: 500,
                  labelEvery: 2,
                  jumps: [
                    { from: 0, to: 3000, label: '3 kg', color: 'a' },
                    { from: 3000, to: 3250, label: '250 g', color: 'b' },
                  ],
                }),
                caption: L(
                  'The number line is in grams. 3 kg is a jump of 3,000 g, then 250 g more.',
                  'Garis bilangan dalam gram. 3 kg adalah lompatan 3.000 g, lalu 250 g lagi.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Ons, hg and Prices', 'Awas, Jebakan!: Ons, hg, dan Harga'),
              body: L(
                '| Wrong | Right |\n| --- | --- |\n| 1 ons = 10 g | 1 ons = 1 hg = 100 g. From hg down to g are two steps, so multiply by 100. |\n| The hg and the ons are two different units. | They are two names for the same unit: 1 hg = 1 ons = 100 g. |\n| Sugar costs Rp16,000 per kg, so 5 ons cost 5 × Rp16,000. | 10 ons make 1 kg, so 5 ons is half a kg. They cost Rp16,000 ÷ 2 = Rp8,000. |',
                '| Salah | Benar |\n| --- | --- |\n| 1 ons = 10 g | 1 ons = 1 hg = 100 g. Dari hg turun ke g ada dua anak tangga, jadi kalikan 100. |\n| hg dan ons adalah dua satuan yang berbeda. | Keduanya dua nama untuk satuan yang sama: 1 hg = 1 ons = 100 g. |\n| Harga gula Rp16.000 per kg, jadi 5 ons harganya 5 × Rp16.000. | 10 ons sama dengan 1 kg, jadi 5 ons adalah setengah kg. Harganya Rp16.000 ÷ 2 = Rp8.000. |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The picture shows that 10 ons make 1 kg. How many ons are in 2 kg?',
                'Gambar menunjukkan bahwa 10 ons sama dengan 1 kg. Ada berapa ons dalam 2 kg?',
              ),
              figure: {
                ...ladder(),
                caption: L('1 kg = 10 ons = 1,000 g.', '1 kg = 10 ons = 1.000 g.'),
              },
              options: [L('20 ons', '20 ons'), L('2 ons', '2 ons'), L('200 ons', '200 ons'), L('2,000 ons', '2.000 ons')],
              answer: 0,
              explain: L(
                'Each kg is 10 ons, so 2 kg = 2 × 10 = 20 ons. 2 ons forgets to change units, 200 ons multiplies by 100 (that is for grams) and 2,000 ons uses the number of grams.',
                'Setiap kg adalah 10 ons, jadi 2 kg = 2 × 10 = 20 ons. 2 ons lupa mengubah satuan, 200 ons mengalikan 100 (itu untuk gram), dan 2.000 ons memakai banyaknya gram.',
              ),
              hint: L(
                'How many ons are in just 1 kg? Then take two of those.',
                'Ada berapa ons dalam 1 kg saja? Lalu ambil dua kali lipatnya.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: change 3 kg 4 ons into ons.',
                'Coba bersama: ubah 3 kg 4 ons menjadi ons.',
              ),
              template: '3 \\text{ kg} = ___ \\text{ ons},\\quad 30 + 4 = ___ \\text{ ons}',
              blanks: ['30', '34'],
              explain: L(
                '1 kg = 10 ons, so 3 kg = 30 ons. Then 30 + 4 = 34 ons.',
                '1 kg = 10 ons, jadi 3 kg = 30 ons. Lalu 30 + 4 = 34 ons.',
              ),
              hint: L(
                'There are 10 ons in every kg. Multiply 3 by 10, then add the 4 ons that are left.',
                'Ada 10 ons dalam setiap kg. Kalikan 3 dengan 10, lalu tambahkan 4 ons yang tersisa.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'Sugar costs Rp16,000 per kg. Ani buys 5 ons of sugar, the place marked on the double number line. How much does she pay?',
                'Gula harganya Rp16.000 per kg. Ani membeli 5 ons gula, yaitu tempat yang ditandai pada garis bilangan ganda. Berapa yang harus ia bayar?',
              ),
              figure: {
                ...ladder(5),
                caption: L(
                  'The dot is at 5 ons. The whole line is 10 ons, which is 1 kg.',
                  'Titik berada di 5 ons. Seluruh garis adalah 10 ons, yaitu 1 kg.',
                ),
              },
              options: [L('Rp8,000', 'Rp8.000'), L('Rp80,000', 'Rp80.000'), L('Rp16,000', 'Rp16.000'), L('Rp3,200', 'Rp3.200')],
              answer: 0,
              explain: L(
                '5 ons is half of 10 ons, so it is half a kg and costs half the price: 16,000 ÷ 2 = 8,000. Rp80,000 is 5 × 16,000, Rp16,000 is the price of 1 kg, and Rp3,200 is 16,000 ÷ 5.',
                '5 ons adalah setengah dari 10 ons, jadi setengah kg dan harganya setengah: 16.000 ÷ 2 = 8.000. Rp80.000 adalah 5 × 16.000, Rp16.000 adalah harga 1 kg, dan Rp3.200 adalah 16.000 ÷ 5.',
              ),
              hint: L(
                'The price is for 1 kg. What part of a kg is 5 ons?',
                'Harga itu untuk 1 kg. 5 ons adalah bagian berapa dari 1 kg?',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
              statements: [
                L('1 ons = 100 g.', '1 ons = 100 g.'),
                L('The ons and the hg are the same unit.', 'Ons dan hg adalah satuan yang sama.'),
                L('1 hg = 10 g.', '1 hg = 10 g.'),
                L('2 kg 50 g = 250 g.', '2 kg 50 g = 250 g.'),
              ],
              answer: [true, true, false, false],
              explain: L(
                '1 ons = 1 hg = 100 g, so the first two are right and 1 hg = 10 g is wrong. And 2 kg 50 g = 2,000 g + 50 g = 2,050 g, not 250 g.',
                '1 ons = 1 hg = 100 g, jadi dua pernyataan pertama benar dan 1 hg = 10 g salah. Lalu 2 kg 50 g = 2.000 g + 50 g = 2.050 g, bukan 250 g.',
              ),
              hint: L(
                'Count the steps from hg to g on the staircase. For the last one, change the kg into g first.',
                'Hitung anak tangga dari hg ke g pada tangga. Untuk yang terakhir, ubah dulu kg menjadi g.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Eggs cost Rp28,000 per kg. Mrs. Siti buys 2 kg 500 g of eggs and pays with Rp100,000. How many rupiah is her change?',
                'Harga telur Rp28.000 per kg. Ibu Siti membeli telur 2 kg 500 g dan membayar dengan uang Rp100.000. Berapa rupiah uang kembaliannya?',
              ),
              blanks: [{ answer: 30000, label: '\\text{Rp}' }],
              hints: [
                L(
                  'First find the price of the eggs. For that you need the weight in kg. What part of a kg is 500 g?',
                  'Cari dulu harga telurnya. Untuk itu kamu butuh beratnya dalam kg. 500 g adalah bagian berapa dari 1 kg?',
                ),
                L(
                  '500 g is half a kilogram. So the eggs cost 2 times Rp28,000, plus half of Rp28,000.',
                  '500 g adalah setengah kilogram. Jadi harga telur adalah 2 kali Rp28.000, ditambah setengah dari Rp28.000.',
                ),
                L(
                  'Price = 56,000 + 14,000. The change is 100,000 minus the price.',
                  'Harga = 56.000 + 14.000. Kembaliannya adalah 100.000 dikurangi harga.',
                ),
              ],
              explain: L(
                '2 kg cost 2 × 28,000 = 56,000. 500 g is half a kg and costs 14,000. In all she pays 70,000, so the change is 100,000 − 70,000 = 30,000.',
                '2 kg harganya 2 × 28.000 = 56.000. 500 g adalah setengah kg dan harganya 14.000. Seluruhnya 70.000, jadi kembaliannya 100.000 − 70.000 = 30.000.',
              ),
              solution: [
                '2 \\times 28\\,000 = 56\\,000',
                '500\\text{ g} = \\frac{1}{2}\\text{ kg} \\rightarrow 28\\,000 \\div 2 = 14\\,000',
                '56\\,000 + 14\\,000 = 70\\,000',
                '100\\,000 - 70\\,000 = 30\\,000',
              ],
            },
          ],
        },
      ],
      project: {
        id: 'tka-m5-s2-p',
        runtime: 'math',
        title: L('Project: Weighing and Shopping', 'Proyek: Menimbang dan Belanja'),
        brief: L(
          'Four problems about weight, from the ons to a puzzle with a scale and a basket of apples.',
          'Empat soal tentang berat, dari ons sampai teka-teki timbangan dan keranjang apel.',
        ),
        requirements: [
          L('Change units of weight, including the ons.', 'Mengubah satuan berat, termasuk ons.'),
          L('Read a scale and use weights in word problems.', 'Membaca timbangan dan memakai berat dalam soal cerita.'),
        ],
        tasks: [
          {
            prompt: L('How many grams are in 1 ons?', 'Satu ons sama dengan berapa gram?'),
            blanks: [{ answer: 100, after: '\\text{ g}' }],
            solution: ['1\\text{ ons} = 1\\text{ hg} = 100\\text{ g}'],
          },
          {
            prompt: L('Change 3 kg 40 g into grams.', 'Ubah 3 kg 40 g menjadi gram.'),
            blanks: [{ answer: 3040, after: '\\text{ g}' }],
            solution: ['3\\text{ kg} = 3\\,000\\text{ g}', '3\\,000 + 40 = 3\\,040\\text{ g}'],
          },
          {
            prompt: L(
              'Pak Budi has a sack with 25 kg of rice. He fills small bags with 500 g of rice each. How many bags can he fill?',
              'Pak Budi punya sekarung beras 25 kg. Ia mengisi kantong kecil dengan 500 g beras tiap kantong. Berapa kantong yang bisa ia isi?',
            ),
            blanks: [{ answer: 50, after: { en: '\\text{ bags}', id: '\\text{ kantong}' } }],
            solution: ['25\\text{ kg} = 25\\,000\\text{ g}', '25\\,000 \\div 500 = 50'],
          },
          {
            prompt: L(
              'A basket with 6 apples of the same weight stands on the scale in the picture. The empty basket weighs 250 g. How many grams does one apple weigh?',
              'Sebuah keranjang berisi 6 apel yang beratnya sama diletakkan di timbangan pada gambar. Keranjang kosong beratnya 250 g. Berapa gram berat satu apel?',
            ),
            figure: {
              ...scale({ max: 2000, step: 100, labelEvery: 2, at: 1300, unit: 'g' }),
              caption: L('The scale shows the basket with the apples, in grams.', 'Timbangan menunjukkan keranjang beserta apelnya, dalam gram.'),
            },
            blanks: [{ answer: 175, after: '\\text{ g}' }],
            solution: {
              en: ['\\text{basket and apples} = 1\\,300\\text{ g}', '\\text{apples} = 1\\,300 - 250 = 1\\,050\\text{ g}', '1\\,050 \\div 6 = 175\\text{ g}'],
              id: ['\\text{keranjang dan apel} = 1\\,300\\text{ g}', '\\text{apel} = 1\\,300 - 250 = 1\\,050\\text{ g}', '1\\,050 \\div 6 = 175\\text{ g}'],
            },
          },
        ],
        hints: [
          L(
            'Always write the weights in the same unit first, usually grams.',
            'Selalu tulis berat dalam satuan yang sama dulu, biasanya gram.',
          ),
          L(
            'Remember the staircase: kg to g is ×1,000, and ons to g is ×100.',
            'Ingat tangga satuan: kg ke g adalah ×1.000, dan ons ke g adalah ×100.',
          ),
          L(
            'For the last task, read the scale carefully, then take away the basket before you share among the apples.',
            'Untuk soal terakhir, baca timbangan dengan teliti, lalu kurangkan berat keranjang sebelum dibagi untuk apel.',
          ),
        ],
        xp: 50,
      },
    },

    /* ================================================================== S3 — liquid volume */
    {
      id: 'tka-m5-s3',
      title: L('Liquid Volume', 'Volume Zat Cair'),
      summary: L(
        'Seven standard units for the volume of liquids, from kilolitres to millilitres. You will read a measuring jug, change units, and solve pouring problems.',
        'Tujuh satuan baku untuk volume zat cair, dari kiloliter sampai mililiter. Kamu akan membaca gelas ukur, mengubah satuan, dan menyelesaikan soal menuang.',
      ),
      lessons: [
        /* ---------------------------------------------------------------- l1 */
        {
          id: 'tka-m5-s3-l1',
          title: L('Standard Units of Volume and the Measuring Jug', 'Satuan Baku Volume dan Gelas Ukur'),
          goal: L(
            'You can name the units of liquid volume in order, read a measuring jug, and choose a sensible unit.',
            'Kamu bisa menyebutkan satuan volume zat cair secara berurutan, membaca gelas ukur, dan memilih satuan yang masuk akal.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: A Jug of Water', 'Ayo Amati: Segelas Ukur Air'),
              body: L(
                'Ani makes a drink. She pours water into a measuring jug until the water reaches the line marked 600. The marks on this jug are in **millilitres (ml)**.\n\nThe amount of liquid in a container is its **volume**. The basic standard unit for the volume of liquids is the **litre (l)**.\n\nA small bottle of water holds about 600 ml, a big bottle holds 1 l, and $1 \\text{ l} = 1\\,000 \\text{ ml}$.',
                'Ani membuat minuman. Ia menuang air ke gelas ukur sampai air mencapai garis bertanda 600. Tanda pada gelas ukur ini dalam **mililiter (ml)**.\n\nBanyak cairan di dalam sebuah wadah disebut **volume**. Satuan baku dasar untuk volume zat cair adalah **liter (l)**.\n\nSebotol kecil air minum berisi sekitar 600 ml, sebotol besar berisi 1 l, dan $1 \\text{ l} = 1\\,000 \\text{ ml}$.',
              ),
              figure: {
                ...jugs([{ max: 1000, step: 100, labelEvery: 1, level: 600, unit: 'ml' }]),
                caption: L('A measuring jug with 600 ml of water.', 'Sebuah gelas ukur berisi 600 ml air.'),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: The Staircase of Volume Units', 'Contoh Bertahap: Tangga Satuan Volume'),
              body: L(
                'The units of liquid volume use the same staircase once more.\n\n1. Step 1: Write the units from the biggest to the smallest: kl, hl, dal, l, dl, cl, ml.\n2. Step 2: Every step down the staircase is $\\times 10$, and every step up is $\\div 10$.\n3. Step 3: Go down three steps, from l to ml: $1 \\text{ l} = 10 \\text{ dl} = 100 \\text{ cl} = 1\\,000 \\text{ ml}$.\n4. Step 4: Going up is the opposite: 10 ml make 1 cl, 10 cl make 1 dl, and 10 dl make 1 l.\n\n**Remember:** the staircase, from the biggest unit to the smallest.\n\n| Unit | Symbol | One step down |\n| --- | --- | --- |\n| kilolitre | kl | 1 kl = 10 hl |\n| hectolitre | hl | 1 hl = 10 dal |\n| decalitre | dal | 1 dal = 10 l |\n| litre | l | 1 l = 10 dl |\n| decilitre | dl | 1 dl = 10 cl |\n| centilitre | cl | 1 cl = 10 ml |\n| millilitre | ml | the smallest unit |\n\nThe same trick works again: **K**ing **H**enry **D**ied **B**y **D**rinking **C**hocolate **M**ilk. The fourth word is now the litre.',
                'Satuan volume zat cair memakai tangga yang sama lagi.\n\n1. Langkah 1: Tulis satuannya dari yang terbesar ke yang terkecil: kl, hl, dal, l, dl, cl, ml.\n2. Langkah 2: Setiap turun satu anak tangga adalah $\\times 10$, dan setiap naik satu anak tangga adalah $\\div 10$.\n3. Langkah 3: Turun tiga anak tangga, dari l ke ml: $1 \\text{ l} = 10 \\text{ dl} = 100 \\text{ cl} = 1\\,000 \\text{ ml}$.\n4. Langkah 4: Naik adalah kebalikannya: 10 ml menjadi 1 cl, 10 cl menjadi 1 dl, dan 10 dl menjadi 1 l.\n\n**Ingat:** tangga satuan, dari satuan terbesar ke terkecil.\n\n| Satuan | Lambang | Satu anak tangga ke bawah |\n| --- | --- | --- |\n| kiloliter | kl | 1 kl = 10 hl |\n| hektoliter | hl | 1 hl = 10 dal |\n| dekaliter | dal | 1 dal = 10 l |\n| liter | l | 1 l = 10 dl |\n| desiliter | dl | 1 dl = 10 cl |\n| sentiliter | cl | 1 cl = 10 ml |\n| mililiter | ml | satuan terkecil |\n\nKalimat pengingat yang sama berlaku lagi: **K**akak **H**arus **D**engar **M**ama, **D**an **C**ici **M**enyanyi. Kata keempat sekarang mewakili liter.',
              ),
              figure: {
                ...stairs(VOL, [3]),
                caption: L(
                  'The seven units of liquid volume. The litre is outlined in red.',
                  'Tujuh satuan volume zat cair. Liter diberi garis merah.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: Reading a Measuring Jug', 'Contoh Bertahap: Membaca Gelas Ukur'),
              body: L(
                'Read how much water is in the jug in the picture.\n\n1. Step 1: Look at the unit. This jug is marked in millilitres (ml).\n2. Step 2: Find what one small space is worth. Between 300 and 400 there are 2 small spaces, so each one is $100 \\div 2 = 50$ ml.\n3. Step 3: Look at the top of the water. It has passed the line for 300 ml.\n4. Step 4: Count the small spaces after 300. There is 1 space, which is 50 ml. So $300 + 50 = 350$ ml.\n\n**Remember:**\n\n- Read the top of the liquid, with your eyes level with it.\n- First find what one small space is worth, then count the spaces.',
                'Bacalah banyak air di dalam gelas ukur pada gambar.\n\n1. Langkah 1: Lihat satuannya. Gelas ukur ini bertanda mililiter (ml).\n2. Langkah 2: Cari nilai satu ruang kecil. Di antara 300 dan 400 ada 2 ruang kecil, jadi masing-masing $100 \\div 2 = 50$ ml.\n3. Langkah 3: Lihat permukaan atas air. Permukaan itu sudah melewati garis 300 ml.\n4. Langkah 4: Hitung ruang kecil sesudah 300. Ada 1 ruang, yaitu 50 ml. Jadi $300 + 50 = 350$ ml.\n\n**Ingat:**\n\n- Baca permukaan atas cairan, dengan mata sejajar permukaan itu.\n- Cari dulu nilai satu ruang kecil, baru hitung ruangnya.',
              ),
              figure: {
                ...jugs([{ max: 500, step: 50, labelEvery: 2, level: 350, unit: 'ml' }]),
                caption: L(
                  'A measuring jug in millilitres. The water is between 300 and 400.',
                  'Sebuah gelas ukur dalam mililiter. Air berada di antara 300 dan 400.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Jugs and Volume Units', 'Awas, Jebakan!: Gelas Ukur dan Satuan Volume'),
              body: L(
                '| Wrong | Right |\n| --- | --- |\n| The water is between 300 and 400, so it is 400 ml. | It has not reached 400. One small space is 50 ml, so it is 300 + 50 = 350 ml. |\n| 1 l = 100 ml | From l to ml is three steps down, so 1 l = 1,000 ml. |\n| 1 cl = 1 ml | From cl to ml is one step down, so 1 cl = 10 ml. |',
                '| Salah | Benar |\n| --- | --- |\n| Air berada di antara 300 dan 400, jadi 400 ml. | Air belum mencapai 400. Satu ruang kecil adalah 50 ml, jadi 300 + 50 = 350 ml. |\n| 1 l = 100 ml | Dari l ke ml ada tiga anak tangga turun, jadi 1 l = 1.000 ml. |\n| 1 cl = 1 ml | Dari cl ke ml ada satu anak tangga turun, jadi 1 cl = 10 ml. |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Citra pours orange juice into a measuring jug. How many millilitres of juice are in the jug?',
                'Citra menuang jus jeruk ke gelas ukur. Berapa mililiter jus di dalam gelas ukur itu?',
              ),
              figure: {
                ...jugs([{ max: 1000, step: 100, labelEvery: 2, level: 700, unit: 'ml' }]),
                caption: L('A measuring jug in millilitres.', 'Sebuah gelas ukur dalam mililiter.'),
              },
              options: [L('700 ml', '700 ml'), L('600 ml', '600 ml'), L('800 ml', '800 ml'), L('750 ml', '750 ml')],
              answer: 0,
              explain: L(
                'The numbers are written every 200 ml with one small mark between them, so one small space is 100 ml. The juice has passed 600 and is one small space further: 700 ml. 600 and 800 are numbers written on the jug, and 750 guesses a space of 50 ml.',
                'Angka ditulis setiap 200 ml dengan satu garis kecil di antaranya, jadi satu ruang kecil adalah 100 ml. Jus sudah melewati 600 dan satu ruang kecil lagi: 700 ml. 600 dan 800 adalah angka yang tertulis pada gelas ukur, dan 750 menebak ruang 50 ml.',
              ),
              hint: L(
                'Find what one small space is worth first. Look at how many small spaces lie between two written numbers.',
                'Cari dulu nilai satu ruang kecil. Lihat ada berapa ruang kecil di antara dua angka yang tertulis.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: the water has passed 100 ml and is one small space further. One small space is worth 50 ml.',
                'Coba bersama: air sudah melewati 100 ml dan berada satu ruang kecil sesudahnya. Satu ruang kecil bernilai 50 ml.',
              ),
              figure: {
                ...jugs([{ max: 500, step: 50, labelEvery: 2, level: 150, unit: 'ml' }]),
                caption: L('A measuring jug in millilitres.', 'Sebuah gelas ukur dalam mililiter.'),
              },
              template: '100 + ___ = ___ \\text{ ml}',
              blanks: ['50', '150'],
              explain: L(
                'One small space is 50 ml, so 100 + 50 = 150 ml.',
                'Satu ruang kecil adalah 50 ml, jadi 100 + 50 = 150 ml.',
              ),
              hint: L(
                'The first blank is what the one small space is worth. Add it to 100 for the second blank.',
                'Kotak pertama adalah nilai satu ruang kecil. Tambahkan ke 100 untuk kotak kedua.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'Look at the staircase. From l down to ml, how many millilitres are in 1 l?',
                'Lihat tangga satuan. Dari l turun ke ml, ada berapa mililiter dalam 1 l?',
              ),
              figure: {
                ...stairs(VOL, [3, 6]),
                caption: L('The l and the ml are outlined in red.', 'l dan ml diberi garis merah.'),
              },
              options: [L('1,000 ml', '1.000 ml'), L('100 ml', '100 ml'), L('10 ml', '10 ml'), L('10,000 ml', '10.000 ml')],
              answer: 0,
              explain: L(
                'From l to ml are three steps down, so $10 \\times 10 \\times 10 = 1\\,000$. 100 ml is only two steps, 10 ml only one, and 10,000 ml is four steps.',
                'Dari l ke ml ada tiga anak tangga turun, jadi $10 \\times 10 \\times 10 = 1\\,000$. 100 ml hanya dua anak tangga, 10 ml hanya satu, dan 10.000 ml adalah empat anak tangga.',
              ),
              hint: L(
                'Count the steps from l down to ml, then multiply by 10 for each step.',
                'Hitung anak tangga dari l turun ke ml, lalu kalikan 10 untuk tiap anak tangga.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'Choose the two pairs where the unit makes sense.',
                'Pilih dua pasangan yang satuannya masuk akal.',
              ),
              options: [
                L('A teaspoon of cough medicine: about 5 ml', 'Satu sendok teh obat batuk: sekitar 5 ml'),
                L('The water in a swimming pool: about 500 kl', 'Air dalam sebuah kolam renang: sekitar 500 kl'),
                L('The water in one glass: about 20 l', 'Air dalam satu gelas: sekitar 20 l'),
                L('A small bottle of mineral water: about 600 kl', 'Sebotol kecil air mineral: sekitar 600 kl'),
                L('The water in a bucket: about 10 ml', 'Air dalam satu ember: sekitar 10 ml'),
              ],
              answer: [0, 1],
              explain: L(
                'A teaspoon holds about 5 ml, and a swimming pool holds hundreds of kl. A glass holds about 200 ml, a small bottle about 600 ml, and a bucket about 10 l.',
                'Satu sendok teh berisi sekitar 5 ml, dan kolam renang berisi ratusan kl. Satu gelas berisi sekitar 200 ml, botol kecil sekitar 600 ml, dan ember sekitar 10 l.',
              ),
              hint: L(
                'Picture the real thing. Is it a few drops, a glassful, a bucketful or a whole pool?',
                'Bayangkan bendanya. Apakah beberapa tetes, segelas, seember, atau sekolam penuh?',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Ani needs exactly 1 l of syrup. The jug in the picture shows how much she has now. How many more millilitres must she pour in?',
                'Ani membutuhkan tepat 1 l sirup. Gelas ukur pada gambar menunjukkan banyak sirup yang ia punya sekarang. Berapa mililiter lagi yang harus ia tuang?',
              ),
              figure: {
                ...jugs([{ max: 1000, step: 50, labelEvery: 2, level: 650, unit: 'ml', color: 'b' }]),
                caption: L('A measuring jug in millilitres.', 'Sebuah gelas ukur dalam mililiter.'),
              },
              blanks: [{ answer: 350, after: '\\text{ ml}' }],
              hints: [
                L(
                  'First read how much syrup is in the jug now. Find what one small space is worth.',
                  'Baca dulu banyak sirup di gelas ukur sekarang. Cari nilai satu ruang kecil.',
                ),
                L(
                  'She needs 1 l, which is 1,000 ml. The part still missing is 1,000 minus what she has.',
                  'Ia butuh 1 l, yaitu 1.000 ml. Bagian yang masih kurang adalah 1.000 dikurangi yang sudah ada.',
                ),
                L(
                  'The jug shows 650 ml. Now work out 1,000 − 650.',
                  'Gelas ukur menunjukkan 650 ml. Sekarang hitung 1.000 − 650.',
                ),
              ],
              explain: L(
                'The syrup passed 600 ml and is one small space (50 ml) further, so there is 650 ml. 1 l = 1,000 ml, and 1,000 − 650 = 350 ml.',
                'Sirup sudah melewati 600 ml dan satu ruang kecil (50 ml) lagi, jadi ada 650 ml. 1 l = 1.000 ml, dan 1.000 − 650 = 350 ml.',
              ),
              solution: {
                en: ['\\text{now} = 650\\text{ ml}', '1\\text{ l} = 1\\,000\\text{ ml}', '1\\,000 - 650 = 350\\text{ ml}'],
                id: ['\\text{sekarang} = 650\\text{ ml}', '1\\text{ l} = 1\\,000\\text{ ml}', '1\\,000 - 650 = 350\\text{ ml}'],
              },
            },
          ],
        },

        /* ---------------------------------------------------------------- l2 */
        {
          id: 'tka-m5-s3-l2',
          title: L('Converting Units of Volume and Word Problems', 'Mengubah Satuan Volume dan Soal Cerita'),
          goal: L(
            'You can change units of volume and solve pouring, mixing and leftover problems.',
            'Kamu bisa mengubah satuan volume dan menyelesaikan soal menuang, mencampur, dan sisa.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Pouring into Glasses', 'Ayo Amati: Menuang ke Gelas'),
              body: L(
                'Pak Eko has 3 l of drink in a big container. He pours it into small glasses, 250 ml each. How many glasses can he fill?\n\nThe container is measured in l and the glasses in ml. To compare them, we first make the units the same: 3 l = 3,000 ml. Then we share: how many times does 250 ml fit into 3,000 ml?\n\nSo we change the units first, and then we **divide** to find how many glasses. To find the total of many glasses, we **multiply**.',
                'Pak Eko punya 3 l minuman dalam wadah besar. Ia menuangnya ke gelas-gelas kecil, masing-masing 250 ml. Berapa gelas yang bisa ia isi?\n\nWadah diukur dalam l dan gelas dalam ml. Agar bisa dibandingkan, kita samakan dulu satuannya: 3 l = 3.000 ml. Lalu kita bagi: 250 ml muat berapa kali di dalam 3.000 ml?\n\nJadi kita ubah satuannya dulu, lalu **membagi** untuk mencari banyak gelas. Untuk mencari jumlah dari banyak gelas, kita **mengalikan**.',
              ),
              figure: {
                ...pour('3 l', 12, '250 ml'),
                caption: L(
                  'A 3 l container poured into glasses of 250 ml each.',
                  'Wadah 3 l dituang ke gelas-gelas yang masing-masing 250 ml.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: How Many Glasses?', 'Contoh Bertahap: Berapa Gelas?'),
              body: L(
                'How many glasses of 250 ml can be filled from 3 l?\n\n1. Step 1: Write what you know: 3 l in all, and 250 ml in each glass.\n2. Step 2: Make the units the same. From l to ml is three steps down: 3 l = 3,000 ml.\n3. Step 3: Divide the total by the amount in one glass: $3\\,000 \\div 250 = 12$.\n4. Step 4: Check by multiplying: $12 \\times 250 = 3\\,000$ ml. It matches.\n\n**Remember:**\n\n| Question | What to do |\n| --- | --- |\n| How many glasses or bottles? | divide: total ÷ amount in one |\n| How much in all? | multiply: number × amount in one |\n| How much is left? | subtract: total − the part used |',
                'Berapa gelas 250 ml yang bisa diisi dari 3 l?\n\n1. Langkah 1: Tulis yang diketahui: 3 l seluruhnya, dan 250 ml tiap gelas.\n2. Langkah 2: Samakan satuannya. Dari l ke ml ada tiga anak tangga turun: 3 l = 3.000 ml.\n3. Langkah 3: Bagi jumlah seluruhnya dengan isi satu gelas: $3\\,000 \\div 250 = 12$.\n4. Langkah 4: Cek dengan mengalikan: $12 \\times 250 = 3\\,000$ ml. Cocok.\n\n**Ingat:**\n\n| Pertanyaan | Caranya |\n| --- | --- |\n| Berapa gelas atau botol? | bagi: jumlah ÷ isi satu |\n| Berapa seluruhnya? | kali: banyak × isi satu |\n| Berapa sisanya? | kurang: jumlah − bagian yang terpakai |',
              ),
              figure: {
                ...numberLine({
                  from: 0,
                  to: 3000,
                  step: 250,
                  labelEvery: 4,
                  jumps: Array.from({ length: 12 }, (_, i) => ({ from: i * 250, to: (i + 1) * 250, color: (i % 2 === 0 ? 'a' : 'b') as FigColor })),
                }),
                caption: L(
                  'The number line is in millilitres. Each arrow is one glass of 250 ml. There are 12 arrows.',
                  'Garis bilangan dalam mililiter. Setiap panah adalah satu gelas 250 ml. Ada 12 panah.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Mixing Units', 'Awas, Jebakan!: Satuan yang Dicampur'),
              body: L(
                '| Wrong | Right |\n| --- | --- |\n| 2 l = 200 ml | From l to ml is three steps down, so 2 l = 2,000 ml. |\n| 3 l ÷ 250 ml = 3 ÷ 250 | The units must match first: 3,000 ml ÷ 250 ml = 12. |\n| 4 l + 300 ml = 4 + 300 = 304 | Change the litres first: 4,000 ml + 300 ml = 4,300 ml. |',
                '| Salah | Benar |\n| --- | --- |\n| 2 l = 200 ml | Dari l ke ml ada tiga anak tangga turun, jadi 2 l = 2.000 ml. |\n| 3 l ÷ 250 ml = 3 ÷ 250 | Satuannya harus sama dulu: 3.000 ml ÷ 250 ml = 12. |\n| 4 l + 300 ml = 4 + 300 = 304 | Ubah dulu literannya: 4.000 ml + 300 ml = 4.300 ml. |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Ani pours 2 l of juice into glasses, as in the picture. Each glass holds 200 ml. How many glasses can she fill?',
                'Ani menuang 2 l jus ke gelas-gelas, seperti pada gambar. Tiap gelas berisi 200 ml. Berapa gelas yang bisa ia isi?',
              ),
              figure: {
                ...pour('2 l', 10, '200 ml'),
                caption: L('A 2 l container and glasses of 200 ml each.', 'Wadah 2 l dan gelas-gelas yang masing-masing 200 ml.'),
              },
              options: [L('10', '10'), L('1', '1'), L('100', '100'), L('400', '400')],
              answer: 0,
              explain: L(
                '2 l = 2,000 ml, and 2,000 ÷ 200 = 10. The answer 1 uses 1 l = 100 ml, 100 uses 1 l = 10,000 ml, and 400 multiplies 2 by 200 without changing the units.',
                '2 l = 2.000 ml, dan 2.000 ÷ 200 = 10. Jawaban 1 memakai 1 l = 100 ml, 100 memakai 1 l = 10.000 ml, dan 400 mengalikan 2 dengan 200 tanpa mengubah satuan.',
              ),
              hint: L(
                'Change 2 l into ml first. Then ask how many times 200 ml fits into it.',
                'Ubah dulu 2 l menjadi ml. Lalu tanyakan: 200 ml muat berapa kali di dalamnya.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: Dewi pours 2 l into small cups of 25 cl each. Change 2 l into cl, then divide.',
                'Coba bersama: Dewi menuang 2 l ke cangkir kecil yang masing-masing 25 cl. Ubah 2 l menjadi cl, lalu bagi.',
              ),
              template: '2 \\text{ l} = ___ \\text{ cl},\\quad 200 \\div 25 = ___',
              blanks: ['200', '8'],
              explain: L(
                'From l to cl is two steps down, so 2 l = 200 cl. Then 200 ÷ 25 = 8 cups.',
                'Dari l ke cl ada dua anak tangga turun, jadi 2 l = 200 cl. Lalu 200 ÷ 25 = 8 cangkir.',
              ),
              hint: L(
                'From l down to cl are two steps, so multiply by 100. Then see how many 25s fit into your answer.',
                'Dari l turun ke cl ada dua anak tangga, jadi kalikan 100. Lalu lihat ada berapa 25 dalam jawabanmu.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The two jugs are poured together into one big bowl. How many millilitres are in the bowl?',
                'Kedua gelas ukur dituang bersama ke dalam satu mangkuk besar. Berapa mililiter isi mangkuk itu?',
              ),
              figure: {
                ...jugs([
                  { max: 500, step: 50, labelEvery: 2, level: 350, unit: 'ml' },
                  { max: 500, step: 50, labelEvery: 2, level: 450, unit: 'ml', color: 'b' },
                ]),
                caption: L('Two measuring jugs in millilitres.', 'Dua gelas ukur dalam mililiter.'),
              },
              options: [L('800 ml', '800 ml'), L('100 ml', '100 ml'), L('900 ml', '900 ml'), L('700 ml', '700 ml')],
              answer: 0,
              explain: L(
                'The jugs hold 350 ml and 450 ml, and 350 + 450 = 800 ml. 100 ml subtracts instead of adding, 900 ml uses the next numbers (400 and 500), and 700 ml uses the numbers just passed (300 and 400).',
                'Gelas ukur berisi 350 ml dan 450 ml, dan 350 + 450 = 800 ml. 100 ml mengurangkan, bukan menjumlahkan, 900 ml memakai angka berikutnya (400 dan 500), dan 700 ml memakai angka yang baru dilewati (300 dan 400).',
              ),
              hint: L(
                'Read each jug first, counting the small spaces. Then add the two amounts.',
                'Baca tiap gelas ukur dulu, dengan menghitung ruang kecilnya. Lalu jumlahkan kedua banyaknya.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
              statements: [
                L('2 l = 2,000 ml.', '2 l = 2.000 ml.'),
                L('600 ml = 6 l.', '600 ml = 6 l.'),
                L('If 3 l is shared equally among 6 glasses, each glass gets 500 ml.', 'Jika 3 l dibagi sama banyak ke 6 gelas, tiap gelas mendapat 500 ml.'),
                L('1 cl = 100 ml.', '1 cl = 100 ml.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                '2 l = 2,000 ml, and 3 l = 3,000 ml, which shared among 6 glasses is 3,000 ÷ 6 = 500 ml each. But 600 ml is less than 1 l, so it cannot be 6 l, and 1 cl = 10 ml, not 100 ml.',
                '2 l = 2.000 ml, dan 3 l = 3.000 ml, yang dibagi ke 6 gelas menjadi 3.000 ÷ 6 = 500 ml tiap gelas. Tetapi 600 ml kurang dari 1 l, jadi tidak mungkin 6 l, dan 1 cl = 10 ml, bukan 100 ml.',
              ),
              hint: L(
                'Count the steps on the staircase for each conversion. For the glasses, change l to ml before you divide.',
                'Hitung anak tangga pada tangga untuk tiap perubahan satuan. Untuk soal gelas, ubah l menjadi ml sebelum membagi.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Pak Eko has 5 l of cooking oil. He fills as many bottles of 600 ml as he can. How many millilitres of oil are left over?',
                'Pak Eko punya 5 l minyak goreng. Ia mengisi botol-botol 600 ml sebanyak mungkin. Berapa mililiter minyak yang tersisa?',
              ),
              blanks: [{ answer: 200, after: '\\text{ ml}' }],
              hints: [
                L(
                  'The oil is in l and the bottles are in ml. What must you do first?',
                  'Minyak diukur dalam l dan botol dalam ml. Apa yang harus dilakukan lebih dulu?',
                ),
                L(
                  'Change 5 l into ml. Then find how many full bottles of 600 ml you can fill, and how much oil they use up.',
                  'Ubah 5 l menjadi ml. Lalu cari berapa botol penuh 600 ml yang bisa diisi, dan berapa minyak yang terpakai.',
                ),
                L(
                  '5,000 ÷ 600 gives 8 full bottles. Those bottles use 8 × 600 ml. The leftover is 5,000 minus that.',
                  '5.000 ÷ 600 menghasilkan 8 botol penuh. Botol-botol itu memakai 8 × 600 ml. Sisanya adalah 5.000 dikurangi itu.',
                ),
              ],
              explain: L(
                '5 l = 5,000 ml. 8 bottles use 8 × 600 = 4,800 ml, and a ninth bottle would need 5,400 ml, which is too much. Left over: 5,000 − 4,800 = 200 ml.',
                '5 l = 5.000 ml. 8 botol memakai 8 × 600 = 4.800 ml, dan botol kesembilan butuh 5.400 ml, terlalu banyak. Sisanya: 5.000 − 4.800 = 200 ml.',
              ),
              solution: {
                en: ['5\\text{ l} = 5\\,000\\text{ ml}', '5\\,000 \\div 600 = 8 \\text{ bottles, with some left}', '8 \\times 600 = 4\\,800\\text{ ml}', '5\\,000 - 4\\,800 = 200\\text{ ml}'],
                id: ['5\\text{ l} = 5\\,000\\text{ ml}', '5\\,000 \\div 600 = 8 \\text{ botol, ada sisa}', '8 \\times 600 = 4\\,800\\text{ ml}', '5\\,000 - 4\\,800 = 200\\text{ ml}'],
              },
            },
          ],
        },
      ],
      project: {
        id: 'tka-m5-s3-p',
        runtime: 'math',
        title: L('Project: Pouring and Measuring', 'Proyek: Menuang dan Mengukur'),
        brief: L(
          'Four problems about liquid volume, from reading a jug to a pitcher puzzle.',
          'Empat soal tentang volume zat cair, dari membaca gelas ukur sampai teka-teki teko.',
        ),
        requirements: [
          L('Read a measuring jug and change units of volume.', 'Membaca gelas ukur dan mengubah satuan volume.'),
          L('Solve pouring and sharing problems.', 'Menyelesaikan soal menuang dan membagi.'),
        ],
        tasks: [
          {
            prompt: L('How many millilitres of water are in the jug?', 'Berapa mililiter air di dalam gelas ukur?'),
            figure: {
              ...jugs([{ max: 500, step: 50, labelEvery: 2, level: 450, unit: 'ml' }]),
              caption: L('A measuring jug in millilitres.', 'Sebuah gelas ukur dalam mililiter.'),
            },
            blanks: [{ answer: 450, after: '\\text{ ml}' }],
            solution: {
              en: ['\\text{one small space} = 100 \\div 2 = 50\\text{ ml}', '400 + 50 = 450\\text{ ml}'],
              id: ['\\text{satu ruang kecil} = 100 \\div 2 = 50\\text{ ml}', '400 + 50 = 450\\text{ ml}'],
            },
          },
          {
            prompt: L('Change 2 l 50 ml into millilitres.', 'Ubah 2 l 50 ml menjadi mililiter.'),
            blanks: [{ answer: 2050, after: '\\text{ ml}' }],
            solution: ['2\\text{ l} = 2\\,000\\text{ ml}', '2\\,000 + 50 = 2\\,050\\text{ ml}'],
          },
          {
            prompt: L(
              'Mrs. Citra has 6 l of juice. She pours it into bottles that hold 750 ml each. How many bottles can she fill?',
              'Ibu Citra punya 6 l jus. Ia menuangnya ke botol yang masing-masing berisi 750 ml. Berapa botol yang bisa ia isi?',
            ),
            blanks: [{ answer: 8, after: { en: '\\text{ bottles}', id: '\\text{ botol}' } }],
            solution: ['6\\text{ l} = 6\\,000\\text{ ml}', '6\\,000 \\div 750 = 8'],
          },
          {
            prompt: L(
              'Dewi has an empty pitcher that holds 2 l. She fills the measuring jug in the picture up to the level shown, and pours it into the pitcher again and again. What is the greatest number of times she can pour in a jug filled to that level without the pitcher overflowing?',
              'Dewi punya teko kosong yang memuat 2 l. Ia mengisi gelas ukur pada gambar sampai tinggi yang ditunjukkan, lalu menuangnya ke teko berulang kali. Paling banyak berapa kali ia bisa menuang gelas ukur yang terisi sampai tinggi itu tanpa teko meluap?',
            ),
            figure: {
              ...jugs([{ max: 500, step: 50, labelEvery: 2, level: 350, unit: 'ml' }]),
              caption: L('The measuring jug, filled to this level each time.', 'Gelas ukur, diisi sampai tinggi ini setiap kali.'),
            },
            blanks: [{ answer: 5, after: { en: '\\text{ times}', id: '\\text{ kali}' } }],
            solution: {
              en: ['2\\text{ l} = 2\\,000\\text{ ml}', '2\\,000 \\div 350 = 5 \\text{ with } 250 \\text{ ml left}', '5 \\times 350 = 1\\,750 \\leq 2\\,000, \\quad 6 \\times 350 = 2\\,100 > 2\\,000', '\\Rightarrow 5'],
              id: ['2\\text{ l} = 2\\,000\\text{ ml}', '2\\,000 \\div 350 = 5 \\text{ sisa } 250 \\text{ ml}', '5 \\times 350 = 1\\,750 \\leq 2\\,000, \\quad 6 \\times 350 = 2\\,100 > 2\\,000', '\\Rightarrow 5'],
            },
          },
        ],
        hints: [
          L(
            'Always change both amounts into the same unit before you divide or compare.',
            'Selalu ubah kedua banyaknya ke satuan yang sama sebelum membagi atau membandingkan.',
          ),
          L(
            'To read a jug, first find what one small space is worth. Then count the spaces.',
            'Untuk membaca gelas ukur, cari dulu nilai satu ruang kecil. Lalu hitung ruangnya.',
          ),
          L(
            'For the last task, divide 2,000 by what the jug holds. The pitcher must not overflow, so a part of a jug does not count.',
            'Untuk soal terakhir, bagi 2.000 dengan isi gelas ukur. Teko tidak boleh meluap, jadi sebagian gelas tidak dihitung.',
          ),
        ],
        xp: 50,
      },
    },
  ],
}
