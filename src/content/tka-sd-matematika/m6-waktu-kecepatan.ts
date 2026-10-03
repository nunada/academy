import type { Loc, MathBlank, Module } from '../types'
import type { FigColor, FigItem } from '../../lib/figure'
import type { Piece } from './figs'
import { clockFace, fit, line, numberLine, outline, txt } from './figs'

/** Module 6 — time and speed: the units of time and reading a clock, working out
 *  how long something lasts, and speed as distance covered in one unit of time. */

const L = (en: string, id: string): Loc => ({ en, id })

/* ------------------------------------------------------------- helpers */

const pad2 = (n: number) => String(n).padStart(2, '0')

/** Tick label for a time given in hours: 7.5 -> 07.30. Past 24 it wraps, so 27 -> 03.00. */
const hm = (v: number): string => {
  const total = Math.round(v * 60)
  return `${pad2(Math.floor(total / 60) % 24)}.${pad2(total % 60)}`
}

type NL = Parameters<typeof numberLine>[0]

/** A number line of clock times (hours on the line, one label per `labelEvery` ticks). */
const timeLine = (from: number, to: number, step: number, labelEvery: number, extra: Pick<NL, 'marks' | 'jumps' | 'shade'> = {}): Piece =>
  numberLine({ from, to, step, labelEvery, fmt: hm, ...extra })

/** Number line for one hour, labelled in minutes: 0, 15, 30, 45, 60. */
const minuteLine = (marks: NL['marks']): Piece =>
  numberLine({ from: 0, to: 1, step: 0.25, fmt: (v) => String(Math.round(v * 60)), marks })

interface Series {
  pts: [number, number][]
  color: FigColor
  /** Write the distance beside every dot (default true). */
  labels?: boolean
}

/** Distance against time: dots joined by line pieces. Time (whole hours) runs across,
 *  distance up; only numbers are written, the caption says what they mean. */
function distTime(o: { xMax: number; yMax: number; yStep: number; series: Series[] }): Piece {
  const W = 10
  const H = 6
  const sx = W / o.xMax
  const sy = H / o.yMax
  const items: FigItem[] = []
  for (let x = 0; x <= o.xMax; x++) {
    if (x > 0) items.push(line([x * sx, 0], [x * sx, H], 'muted', { dashed: true }))
    items.push(txt(x * sx, -0.55, String(x), 'md', 'muted'))
  }
  for (let y = 0; y <= o.yMax + 1e-9; y += o.yStep) {
    if (y > 0) items.push(line([0, y * sy], [W, y * sy], 'muted', { dashed: true }))
    items.push(txt(-0.3, y * sy, String(y), 'md', 'muted', 'end'))
  }
  items.push(line([0, 0], [W, 0], 'muted', { width: 2.5 }), line([0, 0], [0, H], 'muted', { width: 2.5 }))
  for (const s of o.series) {
    for (let i = 0; i + 1 < s.pts.length; i++) {
      items.push(line([s.pts[i][0] * sx, s.pts[i][1] * sy], [s.pts[i + 1][0] * sx, s.pts[i + 1][1] * sy], s.color, { width: 3 }))
    }
    for (const [x, y] of s.pts) {
      items.push({ t: 'dot', x: x * sx, y: y * sy, color: s.color, label: s.labels !== false && y > 0 ? String(y) : undefined })
    }
  }
  return { dim: 2, axes: false, ...fit([[-1, -1], [W + 0.4, H + 0.4]], 0.3), items }
}

/** The s-v-t triangle: s on top, v and t underneath. Cover the one you want. */
function svtTriangle(): Piece {
  const items: FigItem[] = [
    outline([[0, 0], [8, 0], [4, 6.9]], 'a'),
    line([2, 3.45], [6, 3.45], 'a', { width: 2.5 }),
    line([4, 0], [4, 3.45], 'a', { width: 2.5 }),
    txt(4, 4.7, 's', 'lg', 'result'),
    txt(2.3, 1.3, 'v', 'lg', 'b'),
    txt(5.7, 1.3, 't', 'lg', 'a'),
  ]
  return { dim: 2, axes: false, ...fit([[0, 0], [8, 6.9]], 0.6), items }
}

/** Two boxes for a time: hours, then minutes. */
const HOURS = (n: number): MathBlank => ({ label: { en: '\\text{hours} =', id: '\\text{jam} =' }, answer: n })
const MINUTES = (n: number): MathBlank => ({ label: { en: '\\text{minutes} =', id: '\\text{menit} =' }, answer: n })
const MIN_AFTER = { en: '\\text{ minutes}', id: '\\text{ menit}' }
const HR_AFTER = { en: '\\text{ hours}', id: '\\text{ jam}' }
const KM_AFTER = '\\text{ km}'
const KMH_AFTER = { en: '\\text{ km/h}', id: '\\text{ km/jam}' }

/* -------------------------------------------------------------- module */

export const module6: Module = {
  id: 'tka-m6',
  title: L('Time and Speed', 'Waktu dan Kecepatan'),
  summary: L(
    'Know the units of time, read a clock, work out how long something lasts, and use speed, distance and time in everyday journeys.',
    'Mengenal satuan waktu, membaca jam, menghitung lama waktu, serta memakai kecepatan, jarak, dan waktu dalam perjalanan sehari-hari.',
  ),
  submodules: [
    /* ================================================================ S1: time */
    {
      id: 'tka-m6-s1',
      title: L('Time', 'Waktu'),
      summary: L(
        'Seconds, minutes, hours, days, weeks, months and years; reading the clock; and working out how long something takes.',
        'Detik, menit, jam, hari, pekan, bulan, dan tahun; membaca jam; dan menghitung berapa lama sesuatu berlangsung.',
      ),
      lessons: [
        /* ------------------------------------------------ S1 L1 units and clock */
        {
          id: 'tka-m6-s1-l1',
          title: L('Units of Time and Reading the Clock', 'Satuan Waktu dan Membaca Jam'),
          goal: L(
            'You can change between units of time and read a clock in 12-hour and 24-hour time.',
            'Kamu bisa mengubah satuan waktu dan membaca jam dengan cara 12 jam maupun 24 jam.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: The Units of Time', 'Ayo Amati: Satuan Waktu'),
              body: L(
                'Every day you use time: school starts at 07.00, break lasts 30 minutes, and you go home at 13.00. Time has different units, and they are all linked.\n\nLook at the clock. The long hand goes once all the way round, from 12 back to 12. That takes 60 **minutes**, which is 1 **hour**.\n\n| Unit | Equals |\n|---|---|\n| 1 minute | 60 seconds |\n| 1 hour | 60 minutes |\n| 1 day | 24 hours |\n| 1 week | 7 days |\n| 1 month | 28 to 31 days (about 4 weeks) |\n| 1 year | 12 months = 365 days |\n\nA **leap year** has 366 days, because February has 29 days. A leap year comes every 4 years.',
                'Setiap hari kamu memakai waktu: sekolah mulai pukul 07.00, istirahat 30 menit, dan kamu pulang pukul 13.00. Waktu punya beberapa satuan, dan semuanya saling berhubungan.\n\nLihat jam di bawah. Jarum panjang berputar satu putaran penuh, dari angka 12 kembali ke angka 12. Itu memerlukan 60 **menit**, yaitu 1 **jam**.\n\n| Satuan | Sama dengan |\n|---|---|\n| 1 menit | 60 detik |\n| 1 jam | 60 menit |\n| 1 hari | 24 jam |\n| 1 pekan (satu minggu) | 7 hari |\n| 1 bulan | 28 sampai 31 hari (kira-kira 4 pekan) |\n| 1 tahun | 12 bulan = 365 hari |\n\nTahun **kabisat** punya 366 hari, karena bulan Februari punya 29 hari. Tahun kabisat datang setiap 4 tahun.',
              ),
              figure: {
                ...clockFace({ h: 3, m: 0 }),
                caption: L(
                  'The long hand goes round once: 60 minutes = 1 hour.',
                  'Jarum panjang berputar satu kali: 60 menit = 1 jam.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Reading the Clock', 'Contoh Bertahap: Membaca Jam'),
              body: L(
                'What time does the clock show?\n\n1. Step 1: Find the short, thick hand (orange). It has passed 3 but not reached 4, so the hour is 3.\n2. Step 2: Find the long hand (green). It points to 8. Count in fives: $8 \\times 5 = 40$ minutes.\n3. Step 3: Write the hour first, then the minutes: 3:40, which is 40 minutes past 3.\n4. Step 4: If it is afternoon, add 12 for 24-hour time: $3 + 12 = 15$, so the time is 15.40.\n\n**Remember:**\n\n- The short hand shows the hour. The long hand shows the minutes.\n- On the long hand, the numbers 1 to 12 mean 5, 10, 15, ... 60 minutes.\n- Morning is about 04.00 to 10.00, noon is 11.00 to 14.00, afternoon is 15.00 to 17.00, and night is 18.00 to 03.00.',
                'Pukul berapa yang ditunjukkan jam ini?\n\n1. Langkah 1: Cari jarum yang pendek dan tebal (oranye). Jarum itu sudah lewat angka 3 tetapi belum sampai angka 4, jadi jamnya 3.\n2. Langkah 2: Cari jarum panjang (hijau). Jarum itu menunjuk angka 8. Hitung loncat 5: $8 \\times 5 = 40$ menit.\n3. Langkah 3: Tulis jamnya dulu, lalu menitnya: pukul 3.40, dibaca 40 menit lewat pukul 3.\n4. Langkah 4: Kalau waktunya sore, tambahkan 12 untuk jam 24-an: $3 + 12 = 15$, jadi pukul 15.40.\n\n**Ingat:**\n\n- Jarum pendek menunjukkan jam. Jarum panjang menunjukkan menit.\n- Pada jarum panjang, angka 1 sampai 12 berarti 5, 10, 15, ... 60 menit.\n- Pagi kira-kira pukul 04.00 sampai 10.00, siang pukul 11.00 sampai 14.00, sore pukul 15.00 sampai 17.00, dan malam pukul 18.00 sampai 03.00.',
              ),
              figure: {
                ...clockFace({ h: 3, m: 40 }),
                caption: L(
                  'The short orange hand is between 3 and 4. The long green hand points to 8.',
                  'Jarum pendek oranye ada di antara 3 dan 4. Jarum panjang hijau menunjuk angka 8.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Mixed-Up Hands', 'Awas, Jebakan!: Jarum Tertukar'),
              body: L(
                'Watch out for these three mistakes.\n\n| Wrong | Right |\n|---|---|\n| The long hand points to 6, so it is 6 o\'clock (the hands were swapped) | The long hand on 6 means $6 \\times 5 = 30$ minutes. The hour comes from the short hand |\n| The long hand points to 7, so it is 7 minutes past | The 7 means $7 \\times 5 = 35$ minutes past |\n| 15.30 is the same as 5:30 in the afternoon | $15 - 12 = 3$, so 15.30 is 3:30 in the afternoon |',
                'Awas, ada tiga kesalahan yang sering terjadi.\n\n| Salah | Benar |\n|---|---|\n| Jarum panjang menunjuk angka 6, jadi pukul 6 (jarum tertukar) | Jarum panjang di angka 6 berarti $6 \\times 5 = 30$ menit. Jamnya dilihat dari jarum pendek |\n| Jarum panjang menunjuk angka 7, jadi lewat 7 menit | Angka 7 berarti lewat $7 \\times 5 = 35$ menit |\n| Pukul 15.30 sama dengan pukul 5.30 sore | $15 - 12 = 3$, jadi pukul 15.30 adalah pukul 3.30 sore |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L('What time does the clock show?', 'Pukul berapa yang ditunjukkan jam ini?'),
              figure: {
                ...clockFace({ h: 8, m: 25 }),
                caption: L('A clock. The short hand shows the hour and the long hand shows the minutes.', 'Sebuah jam. Jarum pendek menunjukkan jam dan jarum panjang menunjukkan menit.'),
              },
              options: [
                L('25 minutes past 8', 'pukul 8.25'),
                L('40 minutes past 5', 'pukul 5.40'),
                L('5 minutes past 8', 'pukul 8.05'),
                L('25 minutes past 9', 'pukul 9.25'),
              ],
              answer: 0,
              explain: L(
                'The short hand is between 8 and 9, so the hour is 8. The long hand is on 5, and $5 \\times 5 = 25$ minutes. Swapping the hands gives 5:40, and reading the 5 as 5 minutes gives 8:05.',
                'Jarum pendek ada di antara 8 dan 9, jadi jamnya 8. Jarum panjang di angka 5, dan $5 \\times 5 = 25$ menit. Kalau jarumnya tertukar hasilnya 5.40, dan kalau angka 5 dibaca 5 menit hasilnya 8.05.',
              ),
              hint: L(
                'First find the short hand: it tells you the hour. Then count in fives with the long hand.',
                'Cari dulu jarum pendek: ia menunjukkan jam. Lalu hitung loncat 5 dengan jarum panjang.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: read this clock. The long hand points to 7. The short hand is between 6 and 7.',
                'Coba bersama: baca jam ini. Jarum panjang menunjuk angka 7. Jarum pendek ada di antara 6 dan 7.',
              ),
              figure: {
                ...clockFace({ h: 6, m: 35 }),
                caption: L('The short hand has not reached 7 yet.', 'Jarum pendek belum sampai angka 7.'),
              },
              template: {
                en: '7 \\times 5 = ___ \\text{ minutes} \\quad \\text{hour} = ___',
                id: '7 \\times 5 = ___ \\text{ menit} \\quad \\text{jam} = ___',
              },
              blanks: ['35', '6'],
              explain: L(
                'The clock shows 6:35. The hour is 6 because the short hand has not reached 7, and the minutes are $7 \\times 5 = 35$.',
                'Jam menunjukkan pukul 6.35. Jamnya 6 karena jarum pendek belum sampai angka 7, dan menitnya $7 \\times 5 = 35$.',
              ),
              hint: L(
                'For the minutes, multiply the number the long hand points to by 5. For the hour, use the number the short hand has just passed.',
                'Untuk menit, kalikan angka yang ditunjuk jarum panjang dengan 5. Untuk jam, pakai angka yang baru saja dilewati jarum pendek.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The school clock shows the time in the picture. It is afternoon. How is this time written in 24-hour time?',
                'Jam dinding sekolah menunjukkan waktu seperti pada gambar. Waktu itu sore hari. Bagaimana menuliskannya dalam jam 24-an?',
              ),
              figure: {
                ...clockFace({ h: 3, m: 20 }),
                caption: L('The short hand is just past 3. The long hand points to 4.', 'Jarum pendek baru lewat angka 3. Jarum panjang menunjuk angka 4.'),
              },
              options: [L('15.20', '15.20'), L('03.20', '03.20'), L('13.20', '13.20'), L('15.04', '15.04')],
              answer: 0,
              explain: L(
                'The clock reads 3:20 and it is afternoon, so add 12 to the hour: 15.20. The time 03.20 is in the night, 15.04 reads the 4 as 4 minutes (it is $4 \\times 5 = 20$), and 13.20 added only 10 hours.',
                'Jam terbaca 3.20 dan waktunya sore, jadi jamnya ditambah 12: 15.20. Pukul 03.20 itu malam hari, 15.04 membaca angka 4 sebagai 4 menit (padahal $4 \\times 5 = 20$), dan 13.20 hanya menambah 10 jam.',
              ),
              hint: L(
                'Read the clock first (hour, then minutes). Then think: for the afternoon, what do you add to the hour?',
                'Baca jamnya dulu (jam, lalu menit). Lalu pikirkan: untuk waktu sore, hal apa yang ditambahkan ke jamnya?',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L('Choose TWO correct statements.', 'Pilih DUA pernyataan yang benar.'),
              options: [
                L('2 hours = 120 minutes', '2 jam = 120 menit'),
                L('3 days = 72 hours', '3 hari = 72 jam'),
                L('1 week = 5 days', '1 pekan = 5 hari'),
                L('1 minute = 100 seconds', '1 menit = 100 detik'),
              ],
              answer: [0, 1],
              explain: L(
                '$2 \\times 60 = 120$ minutes and $3 \\times 24 = 72$ hours. A week has 7 days, and a minute has 60 seconds, not 100.',
                '$2 \\times 60 = 120$ menit dan $3 \\times 24 = 72$ jam. Satu pekan ada 7 hari, dan satu menit ada 60 detik, bukan 100.',
              ),
              hint: L(
                'Check each statement with the table: 1 hour is 60 minutes, 1 day is 24 hours, 1 week is 7 days, 1 minute is 60 seconds.',
                'Periksa tiap pernyataan dengan tabel: 1 jam = 60 menit, 1 hari = 24 jam, 1 pekan = 7 hari, 1 menit = 60 detik.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Ani practises dancing for 2 hours every day for 1 week. How many minutes does Ani practise in the whole week?',
                'Ani berlatih menari 2 jam setiap hari selama 1 pekan. Berapa menit Ani berlatih seluruhnya dalam 1 pekan?',
              ),
              blanks: [{ answer: 840, after: MIN_AFTER }],
              hints: [
                L('How many days are in a week, and how many minutes are in one hour?', 'Ada berapa hari dalam satu pekan, dan ada berapa menit dalam satu jam?'),
                L('Change the 2 hours of one day into minutes first.', 'Ubah dulu 2 jam dalam satu hari menjadi menit.'),
                L('One day is $2 \\times 60 = 120$ minutes. Now multiply by the number of days in a week.', 'Satu hari ada $2 \\times 60 = 120$ menit. Sekarang kalikan dengan banyak hari dalam satu pekan.'),
              ],
              explain: L(
                'One day is $2 \\times 60 = 120$ minutes, and a week has 7 days: $120 \\times 7 = 840$ minutes.',
                'Satu hari ada $2 \\times 60 = 120$ menit, dan satu pekan ada 7 hari: $120 \\times 7 = 840$ menit.',
              ),
              solution: ['2 \\times 60 = 120', '120 \\times 7 = 840'],
            },
          ],
        },
        /* ---------------------------------------------- S1 L2 how long it lasts */
        {
          id: 'tka-m6-s1-l2',
          title: L('Working Out How Long', 'Menghitung Lama Waktu'),
          goal: L(
            'You can work out how long something lasts, add and subtract times, and change between hours and minutes.',
            'Kamu bisa menghitung lama waktu, menjumlah dan mengurangi waktu, serta mengubah jam menjadi menit.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: How Long Did It Take?', 'Ayo Amati: Berapa Lama?'),
              body: L(
                'Ani leaves for her grandmother\'s house at 07.30 and arrives at 10.00. How long was the trip? We do not need hard subtraction. We just **jump** along a time line.\n\n- Jump to the next whole hour: from 07.30 to 08.00 is 30 minutes.\n- Jump hour by hour: from 08.00 to 10.00 is 2 hours.\n- Add them up. The **duration** (how long it lasts) is 2 hours 30 minutes.',
                'Ani berangkat ke rumah nenek pukul 07.30 dan tiba pukul 10.00. Berapa lama perjalanannya? Kita tidak perlu mengurangkan dengan cara sulit. Kita cukup **melompat** di garis waktu.\n\n- Lompat ke jam bulat berikutnya: dari 07.30 ke 08.00 ada 30 menit.\n- Lompat jam demi jam: dari 08.00 ke 10.00 ada 2 jam.\n- Jumlahkan. **Lama waktu** (berapa lama sesuatu berlangsung) adalah 2 jam 30 menit.',
              ),
              figure: {
                ...timeLine(7, 11, 0.25, 4, {
                  marks: [{ at: 7.5, label: '07.30', color: 'result' }, { at: 10, label: '10.00', color: 'result' }],
                  jumps: [{ from: 7.5, to: 8, label: '+30', color: 'b' }, { from: 8, to: 10, label: '+2', color: 'a' }],
                }),
                caption: L(
                  'The orange jump counts minutes (30). The green jump counts hours (2).',
                  'Lompatan oranye menghitung menit (30). Lompatan hijau menghitung jam (2).',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Adding Up the Jumps', 'Contoh Bertahap: Menjumlah Lompatan'),
              body: L(
                'A film starts at 14.45 and ends at 17.10. How long is the film?\n\n1. Step 1: Jump to the next whole hour: from 14.45 to 15.00 is 15 minutes.\n2. Step 2: Jump hour by hour: from 15.00 to 17.00 is 2 hours.\n3. Step 3: Jump the minutes that are left: from 17.00 to 17.10 is 10 minutes.\n4. Step 4: Add up: 2 hours and $15 + 10 = 25$ minutes. The film lasts 2 hours 25 minutes.\n\n**Remember:**\n\n- When the minutes reach 60 or more, change them: 75 minutes = 1 hour 15 minutes.\n- Past midnight, 24.00 is the same as 00.00.\n- On a calendar, the same day comes back every 7 days. From a Wednesday, 10 days later is 1 week and 3 days later, which is a Saturday.',
                'Sebuah film mulai pukul 14.45 dan selesai pukul 17.10. Berapa lama film itu?\n\n1. Langkah 1: Lompat ke jam bulat berikutnya: dari 14.45 ke 15.00 ada 15 menit.\n2. Langkah 2: Lompat jam demi jam: dari 15.00 ke 17.00 ada 2 jam.\n3. Langkah 3: Lompat menit yang tersisa: dari 17.00 ke 17.10 ada 10 menit.\n4. Langkah 4: Jumlahkan: 2 jam dan $15 + 10 = 25$ menit. Film itu berlangsung 2 jam 25 menit.\n\n**Ingat:**\n\n- Kalau menitnya sudah 60 atau lebih, ubah dulu: 75 menit = 1 jam 15 menit.\n- Melewati tengah malam, pukul 24.00 sama dengan pukul 00.00.\n- Di kalender, hari yang sama datang lagi setiap 7 hari. Dari hari Rabu, 10 hari lagi sama dengan 1 pekan lebih 3 hari, yaitu hari Sabtu.',
              ),
              figure: {
                ...timeLine(14, 18, 1 / 12, 12, {
                  marks: [{ at: 14.75, label: '14.45', color: 'result' }, { at: 17 + 1 / 6, label: '17.10', color: 'result' }],
                  jumps: [
                    { from: 14.75, to: 15, label: '+15', color: 'b' },
                    { from: 15, to: 17, label: '+2', color: 'a' },
                    { from: 17, to: 17 + 1 / 6, label: '+10', color: 'b' },
                  ],
                }),
                caption: L(
                  'Three jumps: 15 minutes, 2 hours, 10 minutes.',
                  'Tiga lompatan: 15 menit, 2 jam, 10 menit.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Time Is Not Counted in Hundreds', 'Awas, Jebakan!: Waktu Tidak Dihitung per Seratus'),
              body: L(
                'Watch out for these three mistakes.\n\n| Wrong | Right |\n|---|---|\n| $1.5$ hours = 1 hour 50 minutes | $1.5$ hours = 1 hour + half an hour = 1 hour 30 minutes |\n| 09.15 $-$ 08.45 = 0.70, so 70 minutes | 08.45 to 09.00 is 15 minutes, and 09.00 to 09.15 is 15 minutes, so 30 minutes |\n| 1 hour 45 minutes + 30 minutes = 1 hour 75 minutes | $45 + 30 = 75$ minutes = 1 hour 15 minutes, so the answer is 2 hours 15 minutes |',
                'Awas, ada tiga kesalahan yang sering terjadi.\n\n| Salah | Benar |\n|---|---|\n| $1{,}5$ jam = 1 jam 50 menit | $1{,}5$ jam = 1 jam + setengah jam = 1 jam 30 menit |\n| 09.15 $-$ 08.45 = 0,70, jadi 70 menit | 08.45 ke 09.00 ada 15 menit, dan 09.00 ke 09.15 ada 15 menit, jadi 30 menit |\n| 1 jam 45 menit + 30 menit = 1 jam 75 menit | $45 + 30 = 75$ menit = 1 jam 15 menit, jadi jawabannya 2 jam 15 menit |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Rudi leaves for the farm at 08.30 and arrives at 10.15. The time line shows his jumps. How long is the trip?',
                'Rudi berangkat ke kebun pukul 08.30 dan tiba pukul 10.15. Garis waktu menunjukkan lompatannya. Berapa lama perjalanan Rudi?',
              ),
              figure: {
                ...timeLine(8, 11, 1 / 12, 12, {
                  marks: [{ at: 8.5, label: '08.30', color: 'result' }, { at: 10.25, label: '10.15', color: 'result' }],
                  jumps: [
                    { from: 8.5, to: 9, label: '+30', color: 'b' },
                    { from: 9, to: 10, label: '+1', color: 'a' },
                    { from: 10, to: 10.25, label: '+15', color: 'b' },
                  ],
                }),
                caption: L(
                  'Orange jumps count minutes. The green jump counts hours.',
                  'Lompatan oranye menghitung menit. Lompatan hijau menghitung jam.',
                ),
              },
              options: [
                L('1 hour 45 minutes', '1 jam 45 menit'),
                L('1 hour 85 minutes', '1 jam 85 menit'),
                L('2 hours 15 minutes', '2 jam 15 menit'),
                L('1 hour 15 minutes', '1 jam 15 menit'),
              ],
              answer: 0,
              explain: L(
                'The minutes are $30 + 15 = 45$, and there is 1 hour: 1 hour 45 minutes. Subtracting 10.15 $-$ 8.30 like ordinary decimals gives 1 hour 85 minutes, which is not possible. Forgetting the first 30 minutes gives 1 hour 15 minutes.',
                'Menitnya $30 + 15 = 45$, dan ada 1 jam: 1 jam 45 menit. Mengurangkan 10.15 $-$ 8.30 seperti desimal biasa menghasilkan 1 jam 85 menit, dan itu tidak mungkin. Lupa 30 menit yang pertama menghasilkan 1 jam 15 menit.',
              ),
              hint: L(
                'Add the two orange jumps together first, then add the green jump.',
                'Jumlahkan dulu kedua lompatan oranye, lalu tambahkan lompatan hijau.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: a scout meeting starts at 09.40 and ends at 11.25. The time line shows the jumps: 20 minutes, 1 hour, 25 minutes. Add them up.',
                'Coba bersama: pertemuan pramuka mulai pukul 09.40 dan selesai pukul 11.25. Garis waktu menunjukkan lompatannya: 20 menit, 1 jam, 25 menit. Jumlahkan semuanya.',
              ),
              figure: {
                ...timeLine(9, 12, 1 / 12, 12, {
                  marks: [{ at: 9 + 2 / 3, label: '09.40', color: 'result' }, { at: 11 + 5 / 12, label: '11.25', color: 'result' }],
                  jumps: [
                    { from: 9 + 2 / 3, to: 10, label: '+20', color: 'b' },
                    { from: 10, to: 11, label: '+1', color: 'a' },
                    { from: 11, to: 11 + 5 / 12, label: '+25', color: 'b' },
                  ],
                }),
                caption: L('Three jumps along the time line.', 'Tiga lompatan di sepanjang garis waktu.'),
              },
              template: {
                en: '\\text{minutes: } 20 + 25 = ___ \\quad \\text{hours: } ___',
                id: '\\text{menit: } 20 + 25 = ___ \\quad \\text{jam: } ___',
              },
              blanks: ['45', '1'],
              explain: L(
                'The meeting lasts 1 hour 45 minutes: 45 minutes from the two small jumps and 1 hour from the big jump.',
                'Pertemuan itu berlangsung 1 jam 45 menit: 45 menit dari dua lompatan kecil dan 1 jam dari lompatan besar.',
              ),
              hint: L(
                'Add the two minute jumps together. The hour jump stays as it is.',
                'Jumlahkan kedua lompatan menit. Lompatan jam dibiarkan seperti itu.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'A night train leaves at 22.30 and arrives at 03.00 the next morning. The time line shows both times. How long is the train journey?',
                'Kereta malam berangkat pukul 22.30 dan tiba pukul 03.00 keesokan paginya. Garis waktu menunjukkan kedua waktu itu. Berapa lama perjalanan kereta?',
              ),
              figure: {
                ...timeLine(22, 27, 0.25, 4, {
                  marks: [{ at: 22.5, label: '22.30', color: 'result' }, { at: 27, label: '03.00', color: 'result' }],
                }),
                caption: L(
                  'The line goes past midnight: after 23.00 comes 00.00, then 01.00 and so on.',
                  'Garis ini melewati tengah malam: setelah 23.00 datang 00.00, lalu 01.00, dan seterusnya.',
                ),
              },
              options: [
                L('4 hours 30 minutes', '4 jam 30 menit'),
                L('5 hours 30 minutes', '5 jam 30 menit'),
                L('19 hours 30 minutes', '19 jam 30 menit'),
                L('1 hour 30 minutes', '1 jam 30 menit'),
              ],
              answer: 0,
              explain: L(
                'From 22.30 to 00.00 is 1 hour 30 minutes, and from 00.00 to 03.00 is 3 hours. Together that is 4 hours 30 minutes. Counting 22 to 03 as 5 hours and then adding 30 minutes is wrong, because the 30 minutes were already used up in the first hour.',
                'Dari 22.30 ke 00.00 ada 1 jam 30 menit, dan dari 00.00 ke 03.00 ada 3 jam. Jumlahnya 4 jam 30 menit. Menghitung 22 sampai 03 sebagai 5 jam lalu menambah 30 menit itu salah, karena 30 menitnya sudah terpakai di jam pertama.',
              ),
              hint: L(
                'Jump to midnight first (00.00). Then jump from midnight to 03.00.',
                'Lompat dulu ke tengah malam (00.00). Lalu lompat dari tengah malam ke 03.00.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
              statements: [
                L('$1.5$ hours is the same as 90 minutes.', '$1{,}5$ jam sama dengan 90 menit.'),
                L('1 hour 50 minutes is the same as $1.5$ hours.', '1 jam 50 menit sama dengan $1{,}5$ jam.'),
                L('From 08.45 to 09.30 is 45 minutes.', 'Dari pukul 08.45 sampai pukul 09.30 ada 45 menit.'),
                L('If today is Wednesday, then 10 days from now is a Friday.', 'Kalau hari ini Rabu, maka 10 hari lagi adalah hari Jumat.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                '$1.5$ hours = 1 hour + 30 minutes = 90 minutes. But 1 hour 50 minutes is 110 minutes. From 08.45 to 09.00 is 15 minutes and from 09.00 to 09.30 is 30 minutes, so 45 in all. Ten days is 1 week and 3 days, so Wednesday becomes Saturday, not Friday.',
                '$1{,}5$ jam = 1 jam + 30 menit = 90 menit. Tetapi 1 jam 50 menit adalah 110 menit. Dari 08.45 ke 09.00 ada 15 menit dan dari 09.00 ke 09.30 ada 30 menit, jadi seluruhnya 45. Sepuluh hari adalah 1 pekan lebih 3 hari, jadi Rabu menjadi Sabtu, bukan Jumat.',
              ),
              hint: L(
                'Remember half an hour is 30 minutes. For the days, take away whole weeks first.',
                'Ingat setengah jam adalah 30 menit. Untuk hari, buang dulu pekan yang penuh.',
              ),
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: L(
                'Put the steps in order to find how long a film lasts from 13.50 to 15.20.',
                'Urutkan langkah untuk mencari lama film dari pukul 13.50 sampai 15.20.',
              ),
              lines: {
                en: [
                  '13.50 \\rightarrow 14.00: 10 \\text{ minutes}',
                  '14.00 \\rightarrow 15.00: 1 \\text{ hour}',
                  '15.00 \\rightarrow 15.20: 20 \\text{ minutes}',
                  '10 + 20 = 30 \\text{ minutes, so } 1 \\text{ hour } 30 \\text{ minutes}',
                ],
                id: [
                  '13.50 \\rightarrow 14.00: 10 \\text{ menit}',
                  '14.00 \\rightarrow 15.00: 1 \\text{ jam}',
                  '15.00 \\rightarrow 15.20: 20 \\text{ menit}',
                  '10 + 20 = 30 \\text{ menit, jadi } 1 \\text{ jam } 30 \\text{ menit}',
                ],
              },
              explain: L(
                'Jump forward in time order: first to the whole hour, then hour by hour, then the last minutes. Add everything up at the end.',
                'Lompat maju sesuai urutan waktu: pertama ke jam bulat, lalu jam demi jam, lalu menit terakhir. Jumlahkan semuanya di akhir.',
              ),
              hint: L(
                'The jumps follow the clock from the start time to the end time. The adding up is the last step.',
                'Lompatannya mengikuti jam dari waktu mulai sampai waktu selesai. Menjumlahkan adalah langkah terakhir.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Pak Joko works in a workshop from 07.45 to 16.15. He rests for 45 minutes. How long does he really work? Write the hours and the minutes.',
                'Pak Joko bekerja di bengkel dari pukul 07.45 sampai pukul 16.15. Ia istirahat 45 menit. Berapa lama Pak Joko benar-benar bekerja? Tulis jam dan menitnya.',
              ),
              inline: true,
              blanks: [{ ...HOURS(7), after: HR_AFTER }, { ...MINUTES(45), after: MIN_AFTER }],
              hints: [
                L('First find how long he is at the workshop in all, from 07.45 to 16.15.', 'Cari dulu berapa lama ia ada di bengkel seluruhnya, dari pukul 07.45 sampai 16.15.'),
                L('Jump: 07.45 to 08.00, then hour by hour to 16.00, then to 16.15. Then take away the rest.', 'Lompat: 07.45 ke 08.00, lalu jam demi jam sampai 16.00, lalu ke 16.15. Setelah itu kurangi dengan waktu istirahat.'),
                L('In all it is 8 hours 30 minutes. Take 45 minutes away from that.', 'Seluruhnya 8 jam 30 menit. Kurangi dengan 45 menit.'),
              ],
              explain: L(
                'In the workshop: 15 minutes + 8 hours + 15 minutes = 8 hours 30 minutes = 510 minutes. Take away the rest: $510 - 45 = 465$ minutes = 7 hours 45 minutes.',
                'Di bengkel: 15 menit + 8 jam + 15 menit = 8 jam 30 menit = 510 menit. Kurangi istirahat: $510 - 45 = 465$ menit = 7 jam 45 menit.',
              ),
              solution: {
                en: ['15 \\text{ min} + 8 \\text{ h} + 15 \\text{ min} = 8 \\text{ h } 30 \\text{ min} = 510 \\text{ min}', '510 - 45 = 465 \\text{ min}', '465 \\text{ min} = 7 \\text{ h } 45 \\text{ min}'],
                id: ['15 \\text{ mnt} + 8 \\text{ jam} + 15 \\text{ mnt} = 8 \\text{ jam } 30 \\text{ mnt} = 510 \\text{ mnt}', '510 - 45 = 465 \\text{ mnt}', '465 \\text{ mnt} = 7 \\text{ jam } 45 \\text{ mnt}'],
              },
            },
          ],
        },
      ],
      project: {
        id: 'tka-m6-s1-p',
        runtime: 'math',
        title: L('Clocks and How Long', 'Jam dan Lama Waktu'),
        brief: L(
          'Read a clock, change between hours and minutes, and find out how long things last.',
          'Baca jam, ubah jam menjadi menit, dan cari tahu berapa lama sesuatu berlangsung.',
        ),
        requirements: [
          L('Read the hands of an analogue clock correctly.', 'Membaca jarum jam analog dengan benar.'),
          L('Work out how long something lasts and change between hours and minutes.', 'Menghitung lama waktu dan mengubah jam menjadi menit.'),
        ],
        hints: [
          L('The short hand shows the hour. Count in fives with the long hand.', 'Jarum pendek menunjukkan jam. Hitung loncat 5 dengan jarum panjang.'),
          L('Change times into the same unit first, and remember $1.5$ hours is 1 hour 30 minutes.', 'Ubah waktu ke satuan yang sama dulu, dan ingat $1{,}5$ jam adalah 1 jam 30 menit.'),
          L('For how long, jump to the whole hour, then hour by hour, then the last minutes.', 'Untuk lama waktu, lompat ke jam bulat, lalu jam demi jam, lalu menit terakhir.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L('Read the clock. Write the hour and the minutes.', 'Baca jam ini. Tulis jam dan menitnya.'),
            figure: {
              ...clockFace({ h: 9, m: 50 }),
              caption: L('The short hand is close to 10, but it has not reached it.', 'Jarum pendek sudah dekat angka 10, tetapi belum sampai.'),
            },
            inline: true,
            blanks: [HOURS(9), MINUTES(50)],
            solution: {
              en: ['\\text{short hand has not reached 10: hour } = 9', '\\text{long hand on 10: } 10 \\times 5 = 50 \\text{ minutes}'],
              id: ['\\text{jarum pendek belum sampai 10: jam } = 9', '\\text{jarum panjang di 10: } 10 \\times 5 = 50 \\text{ menit}'],
            },
          },
          {
            prompt: L(
              'Siti watches a film for $1.5$ hours and then studies for 45 minutes. How many minutes is that in all?',
              'Siti menonton film selama $1{,}5$ jam, lalu belajar selama 45 menit. Berapa menit waktu itu seluruhnya?',
            ),
            blanks: [{ answer: 135, after: MIN_AFTER }],
            solution: {
              en: ['1.5 \\text{ hours} = 1 \\text{ hour } 30 \\text{ minutes} = 90 \\text{ minutes}', '90 + 45 = 135'],
              id: ['1{,}5 \\text{ jam} = 1 \\text{ jam } 30 \\text{ menit} = 90 \\text{ menit}', '90 + 45 = 135'],
            },
          },
          {
            prompt: L(
              'A train leaves at 10.40 and arrives at 14.15. How long is the journey? Write the hours and the minutes.',
              'Sebuah kereta berangkat pukul 10.40 dan tiba pukul 14.15. Berapa lama perjalanannya? Tulis jam dan menitnya.',
            ),
            inline: true,
            blanks: [{ ...HOURS(3), after: HR_AFTER }, { ...MINUTES(35), after: MIN_AFTER }],
            solution: {
              en: ['10.40 \\rightarrow 11.00: 20 \\text{ minutes}', '11.00 \\rightarrow 14.00: 3 \\text{ hours}', '14.00 \\rightarrow 14.15: 15 \\text{ minutes}', '20 + 15 = 35 \\text{ minutes}, \\ \\text{so } 3 \\text{ hours } 35 \\text{ minutes}'],
              id: ['10.40 \\rightarrow 11.00: 20 \\text{ menit}', '11.00 \\rightarrow 14.00: 3 \\text{ jam}', '14.00 \\rightarrow 14.15: 15 \\text{ menit}', '20 + 15 = 35 \\text{ menit}, \\ \\text{jadi } 3 \\text{ jam } 35 \\text{ menit}'],
            },
          },
          {
            prompt: L(
              'The market is open from 05.30 to 14.00 every day except Friday. How many hours is the market open in one week?',
              'Pasar buka dari pukul 05.30 sampai 14.00 setiap hari kecuali hari Jumat. Berapa jam pasar itu buka dalam satu pekan?',
            ),
            figure: {
              ...timeLine(5, 14, 0.5, 2, {
                marks: [{ at: 5.5, label: '05.30', color: 'result' }, { at: 14, label: '14.00', color: 'result' }],
                shade: [5.5, 14],
              }),
              caption: L('The green stretch is the time the market is open each day.', 'Bagian hijau adalah waktu pasar buka setiap hari.'),
            },
            blanks: [{ answer: 51, after: HR_AFTER }],
            solution: {
              en: ['05.30 \\rightarrow 14.00 = 8 \\text{ hours } 30 \\text{ minutes} = 8.5 \\text{ hours}', '\\text{open days: } 7 - 1 = 6', '8.5 \\times 6 = 51'],
              id: ['05.30 \\rightarrow 14.00 = 8 \\text{ jam } 30 \\text{ menit} = 8{,}5 \\text{ jam}', '\\text{hari buka: } 7 - 1 = 6', '8{,}5 \\times 6 = 51'],
            },
          },
        ],
      },
    },

    /* ============================================================== S2: speed */
    {
      id: 'tka-m6-s2',
      title: L('Speed', 'Kecepatan'),
      summary: L(
        'Speed as the distance covered in one unit of time, the three links between speed, distance and time, and speed word problems.',
        'Kecepatan sebagai jarak yang ditempuh dalam satu satuan waktu, tiga hubungan antara kecepatan, jarak, dan waktu, serta soal cerita kecepatan.',
      ),
      lessons: [
        /* ------------------------------------------- S2 L1 speed, distance, time */
        {
          id: 'tka-m6-s2-l1',
          title: L('Speed, Distance and Time', 'Kecepatan, Jarak, dan Waktu'),
          goal: L(
            'You can find speed, distance or time when the other two are known.',
            'Kamu bisa mencari kecepatan, jarak, atau waktu kalau dua yang lain diketahui.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: How Fast?', 'Ayo Amati: Seberapa Cepat?'),
              body: L(
                'Pak Rudi\'s bus keeps going at the same pace. Every 1 hour it covers 60 km. So the bus goes 60 km/h, which is read "60 kilometres per hour".\n\n**Speed** is the distance covered in one unit of time. The unit can be km/h or m/s. A runner who covers 5 m in every second has a speed of 5 m/s.\n\n| Time (hours) | Distance (km) |\n|---|---|\n| 1 | 60 |\n| 2 | 120 |\n| 3 | 180 |\n| 4 | 240 |\n\nLook at the picture. The dots for the bus lie on one straight line. Every hour adds 60 km.',
                'Bus Pak Rudi melaju terus dengan laju yang sama. Setiap 1 jam bus itu menempuh 60 km. Jadi bus itu berkecepatan 60 km/jam, dibaca "60 kilometer per jam".\n\n**Kecepatan** adalah jarak yang ditempuh dalam satu satuan waktu. Satuannya bisa km/jam atau m/detik. Pelari yang menempuh 5 m setiap detik berkecepatan 5 m/detik.\n\n| Waktu (jam) | Jarak (km) |\n|---|---|\n| 1 | 60 |\n| 2 | 120 |\n| 3 | 180 |\n| 4 | 240 |\n\nLihat gambar. Titik-titik bus berada pada satu garis lurus. Setiap jam bertambah 60 km.',
              ),
              figure: {
                ...distTime({
                  xMax: 4,
                  yMax: 240,
                  yStep: 60,
                  series: [{ pts: [[0, 0], [1, 60], [2, 120], [3, 180], [4, 240]], color: 'a' }],
                }),
                caption: L(
                  'Across: time in hours. Up: distance in km. Each dot is one more hour.',
                  'Mendatar: waktu dalam jam. Tegak: jarak dalam km. Setiap titik adalah satu jam lagi.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Speed, Distance and Time', 'Contoh Bertahap: Kecepatan, Jarak, dan Waktu'),
              body: L(
                'Eko\'s motorbike covers 150 km in 3 hours. What is its speed? The triangle helps: cover the letter you want, and read what is left.\n\n1. Step 1: Write what you know: distance $s = 150$ km, time $t = 3$ hours.\n2. Step 2: We want the speed $v$. Cover $v$ in the triangle. What is left is $s$ over $t$: $v = s \\div t$.\n3. Step 3: Calculate: $150 \\div 3 = 50$.\n4. Step 4: Write the unit: distance in km and time in hours, so the speed is 50 km/h.\n\n| To find | Use |\n|---|---|\n| Speed ($v$) | $v = s \\div t$ |\n| Distance ($s$) | $s = v \\times t$ |\n| Time ($t$) | $t = s \\div v$ |\n\n**Remember:** $s$ is distance, $v$ is speed and $t$ is time.',
                'Sepeda motor Eko menempuh 150 km dalam 3 jam. Berapa kecepatannya? Segitiga ini membantu: tutup huruf yang kamu cari, lalu baca sisanya.\n\n1. Langkah 1: Tulis yang diketahui: jarak $s = 150$ km, waktu $t = 3$ jam.\n2. Langkah 2: Kita mencari kecepatan $v$. Tutup $v$ di segitiga. Sisanya $s$ di atas $t$: $v = s \\div t$.\n3. Langkah 3: Hitung: $150 \\div 3 = 50$.\n4. Langkah 4: Tulis satuannya: jarak dalam km dan waktu dalam jam, jadi kecepatannya 50 km/jam.\n\n| Yang dicari | Pakai |\n|---|---|\n| Kecepatan ($v$) | $v = s \\div t$ |\n| Jarak ($s$) | $s = v \\times t$ |\n| Waktu ($t$) | $t = s \\div v$ |\n\n**Ingat:** $s$ adalah jarak, $v$ adalah kecepatan, dan $t$ adalah waktu.',
              ),
              figure: {
                ...svtTriangle(),
                caption: L(
                  'Cover s and you see v times t. Cover v or t and you see s divided by the other one.',
                  'Tutup s dan kamu melihat v kali t. Tutup v atau t dan kamu melihat s dibagi yang satunya.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Upside-Down Formulas and Units', 'Awas, Jebakan!: Rumus Terbalik dan Satuan'),
              body: L(
                'Watch out for these three mistakes.\n\n| Wrong | Right |\n|---|---|\n| Speed = time $\\div$ distance (upside down) | Speed = distance $\\div$ time. Check: km divided by hours gives km/h |\n| 120 km in 2 hours: $120 \\times 2 = 240$ km/h | $120 \\div 2 = 60$ km/h |\n| 60 km/h means 60 km in 1 minute | 60 km/h means 60 km in 1 hour |',
                'Awas, ada tiga kesalahan yang sering terjadi.\n\n| Salah | Benar |\n|---|---|\n| Kecepatan = waktu $\\div$ jarak (terbalik) | Kecepatan = jarak $\\div$ waktu. Cek: km dibagi jam menghasilkan km/jam |\n| 120 km dalam 2 jam: $120 \\times 2 = 240$ km/jam | $120 \\div 2 = 60$ km/jam |\n| 60 km/jam berarti 60 km dalam 1 menit | 60 km/jam berarti 60 km dalam 1 jam |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The dots show the distance a bus has covered after 1, 2 and 3 hours. What is the speed of the bus?',
                'Titik-titik menunjukkan jarak yang sudah ditempuh sebuah bus setelah 1, 2, dan 3 jam. Berapa kecepatan bus itu?',
              ),
              figure: {
                ...distTime({ xMax: 3, yMax: 150, yStep: 50, series: [{ pts: [[0, 0], [1, 50], [2, 100], [3, 150]], color: 'a' }] }),
                caption: L(
                  'Across: time in hours. Up: distance in km.',
                  'Mendatar: waktu dalam jam. Tegak: jarak dalam km.',
                ),
              },
              options: [
                L('50 km/h', '50 km/jam'),
                L('150 km/h', '150 km/jam'),
                L('450 km/h', '450 km/jam'),
                L('3 km/h', '3 km/jam'),
              ],
              answer: 0,
              explain: L(
                'In 1 hour the bus covers 50 km, and $150 \\div 3 = 50$. The number 150 is only the distance, 450 comes from multiplying instead of dividing, and 3 is the time in hours.',
                'Dalam 1 jam bus menempuh 50 km, dan $150 \\div 3 = 50$. Angka 150 hanya jaraknya, 450 berasal dari mengalikan, bukan membagi, dan 3 adalah waktu dalam jam.',
              ),
              hint: L(
                'Speed is the distance covered in ONE hour. How far does the bus go in the first hour?',
                'Kecepatan adalah jarak yang ditempuh dalam SATU jam. Berapa jauh bus melaju pada jam pertama?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: a car covers 180 km in 3 hours. Find its speed. Then find the distance it covers in 5 hours at that speed.',
                'Coba bersama: sebuah mobil menempuh 180 km dalam 3 jam. Cari kecepatannya. Lalu cari jarak yang ditempuh dalam 5 jam dengan kecepatan itu.',
              ),
              template: 'v = 180 \\div 3 = ___ \\quad s = v \\times 5 = ___',
              blanks: ['60', '300'],
              explain: L(
                'The speed is $180 \\div 3 = 60$ km/h. In 5 hours the car covers $60 \\times 5 = 300$ km.',
                'Kecepatannya $180 \\div 3 = 60$ km/jam. Dalam 5 jam mobil menempuh $60 \\times 5 = 300$ km.',
              ),
              hint: L(
                'Speed: divide the distance by the time. Distance: multiply the speed by the time.',
                'Kecepatan: bagi jarak dengan waktu. Jarak: kalikan kecepatan dengan waktu.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The green line is a motorbike and the orange line is a bicycle. The dots show the distance covered after each hour. After 2 hours, how many km farther has the motorbike gone than the bicycle?',
                'Garis hijau adalah sepeda motor dan garis oranye adalah sepeda. Titik-titiknya menunjukkan jarak yang ditempuh setelah tiap jam. Setelah 2 jam, berapa km motor lebih jauh daripada sepeda?',
              ),
              figure: {
                ...distTime({
                  xMax: 3,
                  yMax: 120,
                  yStep: 40,
                  series: [
                    { pts: [[0, 0], [1, 40], [2, 80], [3, 120]], color: 'a' },
                    { pts: [[0, 0], [1, 15], [2, 30], [3, 45]], color: 'b' },
                  ],
                }),
                caption: L(
                  'Across: time in hours. Up: distance in km. Green: motorbike. Orange: bicycle.',
                  'Mendatar: waktu dalam jam. Tegak: jarak dalam km. Hijau: sepeda motor. Oranye: sepeda.',
                ),
              },
              options: [L('50 km', '50 km'), L('110 km', '110 km'), L('25 km', '25 km'), L('65 km', '65 km')],
              answer: 0,
              explain: L(
                'After 2 hours the motorbike is at 80 km and the bicycle at 30 km: $80 - 30 = 50$ km. Adding them gives 110, the gap after only 1 hour is 25, and 65 mixes up the hours.',
                'Setelah 2 jam motor ada di 80 km dan sepeda di 30 km: $80 - 30 = 50$ km. Menjumlahkan keduanya memberi 110, selisih setelah 1 jam saja adalah 25, dan 65 mencampur jam yang berbeda.',
              ),
              hint: L(
                'Find the 2-hour mark on the line across. Read both dots above it, then find the difference.',
                'Cari tanda 2 jam pada garis mendatar. Baca kedua titik di atasnya, lalu cari selisihnya.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
              statements: [
                L('A distance of 90 km covered in 3 hours means a speed of 30 km/h.', 'Jarak 90 km yang ditempuh dalam 3 jam berarti kecepatan 30 km/jam.'),
                L('At 40 km/h, the distance covered in 2 hours is 20 km.', 'Dengan kecepatan 40 km/jam, jarak yang ditempuh dalam 2 jam adalah 20 km.'),
                L('Time = distance $\\div$ speed.', 'Waktu = jarak $\\div$ kecepatan.'),
                L('A speed of 5 m/s means 5 seconds for every 1 metre.', 'Kecepatan 5 m/detik berarti 5 detik untuk setiap 1 meter.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                '$90 \\div 3 = 30$ is right. At 40 km/h, 2 hours gives $40 \\times 2 = 80$ km, not 20. Time is distance divided by speed. A speed of 5 m/s means 5 metres every second.',
                '$90 \\div 3 = 30$ itu benar. Dengan 40 km/jam, 2 jam memberi $40 \\times 2 = 80$ km, bukan 20. Waktu adalah jarak dibagi kecepatan. Kecepatan 5 m/detik berarti 5 meter setiap detik.',
              ),
              hint: L(
                'Use the triangle: cover the letter you want and read what is left.',
                'Pakai segitiga: tutup huruf yang dicari dan baca sisanya.',
              ),
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: L(
                'Put the steps in order. A car at 60 km/h covers 240 km. How long does it take?',
                'Urutkan langkahnya. Sebuah mobil berkecepatan 60 km/jam menempuh 240 km. Berapa lama waktunya?',
              ),
              lines: {
                en: ['s = 240 \\text{ km} \\quad v = 60 \\text{ km/h}', 't = s \\div v', 't = 240 \\div 60', 't = 4 \\text{ hours}'],
                id: ['s = 240 \\text{ km} \\quad v = 60 \\text{ km/jam}', 't = s \\div v', 't = 240 \\div 60', 't = 4 \\text{ jam}'],
              },
              explain: L(
                'Write what is known, choose the formula, put the numbers in, then calculate and add the unit.',
                'Tulis yang diketahui, pilih rumusnya, masukkan angkanya, lalu hitung dan tambahkan satuannya.',
              ),
              hint: L(
                'You need the formula before you can put numbers into it. The answer comes last.',
                'Kamu perlu rumusnya sebelum memasukkan angka. Jawabannya datang paling akhir.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Pak Joko drives a car at 55 km/h for 3 hours. After a rest he drives 35 km more. How many km is the whole journey?',
                'Pak Joko mengendarai mobil dengan kecepatan 55 km/jam selama 3 jam. Setelah istirahat, ia menempuh 35 km lagi. Berapa km seluruh perjalanannya?',
              ),
              blanks: [{ answer: 200, after: KM_AFTER }],
              hints: [
                L('The journey has two parts. Find the length of each part.', 'Perjalanan itu punya dua bagian. Cari panjang tiap bagian.'),
                L('For the first part, you know the speed and the time. Which formula gives the distance?', 'Untuk bagian pertama, kamu tahu kecepatan dan waktunya. Rumus mana yang memberi jarak?'),
                L('First part: $55 \\times 3$ km. Then add the 35 km.', 'Bagian pertama: $55 \\times 3$ km. Lalu tambahkan 35 km.'),
              ],
              explain: L(
                'The first part is $55 \\times 3 = 165$ km. The whole journey is $165 + 35 = 200$ km.',
                'Bagian pertama adalah $55 \\times 3 = 165$ km. Seluruh perjalanan adalah $165 + 35 = 200$ km.',
              ),
              solution: ['s = 55 \\times 3 = 165', '165 + 35 = 200'],
            },
          ],
        },
        /* -------------------------------------------- S2 L2 speed word problems */
        {
          id: 'tka-m6-s2-l2',
          title: L('Speed Word Problems', 'Soal Cerita Kecepatan'),
          goal: L(
            'You can solve speed problems with minutes, arrival times, two travellers and average speed.',
            'Kamu bisa menyelesaikan soal kecepatan dengan menit, waktu tiba, dua pejalan, dan kecepatan rata-rata.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Make the Units Match', 'Ayo Amati: Samakan Satuannya Dulu'),
              body: L(
                'Ani rides her bicycle at 12 km/h for 30 minutes. How far does she go? The speed uses hours but the time uses minutes, so we must match the units first.\n\nOne hour has 60 minutes. Look at the line: 30 minutes is half an hour, so she covers half of 12 km, which is 6 km.\n\n- 15 minutes = $\\frac{1}{4}$ hour = 0.25 hour\n- 30 minutes = $\\frac{1}{2}$ hour = 0.5 hour\n- 45 minutes = $\\frac{3}{4}$ hour = 0.75 hour\n\nAnother way is to change the speed. A speed of 60 km/h is 1 km every minute, because 60 km $\\div$ 60 minutes = 1 km per minute.',
                'Ani bersepeda dengan kecepatan 12 km/jam selama 30 menit. Berapa km jaraknya? Kecepatan memakai jam, waktunya memakai menit, jadi satuannya harus disamakan dulu.\n\nSatu jam ada 60 menit. Lihat garisnya: 30 menit adalah setengah jam, jadi Ani menempuh setengah dari 12 km, yaitu 6 km.\n\n- 15 menit = $\\frac{1}{4}$ jam = 0,25 jam\n- 30 menit = $\\frac{1}{2}$ jam = 0,5 jam\n- 45 menit = $\\frac{3}{4}$ jam = 0,75 jam\n\nCara lain adalah mengubah kecepatannya. Kecepatan 60 km/jam sama dengan 1 km setiap menit, karena 60 km $\\div$ 60 menit = 1 km per menit.',
              ),
              figure: {
                ...minuteLine([
                  { at: 0.25, label: '1/4', color: 'b' },
                  { at: 0.5, label: '1/2', color: 'result' },
                  { at: 0.75, label: '3/4', color: 'b' },
                ]),
                caption: L(
                  'The whole line is 1 hour. The numbers under it are minutes. The labels on the dots are parts of an hour.',
                  'Seluruh garis adalah 1 jam. Angka di bawahnya adalah menit. Tulisan pada titik adalah bagian dari satu jam.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Finding the Arrival Time', 'Contoh Bertahap: Mencari Waktu Tiba'),
              body: L(
                'Pak Rudi leaves at 07.15 on a bus going 60 km/h. His destination is 150 km away. When does he arrive?\n\n1. Step 1: Find the travel time: $t = s \\div v = 150 \\div 60 = 2.5$ hours.\n2. Step 2: Change 2.5 hours: 2 hours + 0.5 hour = 2 hours 30 minutes.\n3. Step 3: Add the hours first: 07.15 plus 2 hours is 09.15.\n4. Step 4: Add the minutes: 09.15 plus 30 minutes is 09.45. Pak Rudi arrives at 09.45.\n\n**Remember:**\n\n- Find the travel time first, then add it to the leaving time.\n- Change part of an hour into minutes: 0.5 hour = 30 minutes and 0.25 hour = 15 minutes.\n- If the speed is in km/h and the time is in minutes, change the unit first.',
                'Pak Rudi berangkat pukul 07.15 naik bus berkecepatan 60 km/jam. Tujuannya sejauh 150 km. Pukul berapa ia tiba?\n\n1. Langkah 1: Cari lama perjalanan: $t = s \\div v = 150 \\div 60 = 2{,}5$ jam.\n2. Langkah 2: Ubah 2,5 jam: 2 jam + 0,5 jam = 2 jam 30 menit.\n3. Langkah 3: Tambahkan jamnya dulu: pukul 07.15 ditambah 2 jam menjadi 09.15.\n4. Langkah 4: Tambahkan menitnya: 09.15 ditambah 30 menit menjadi 09.45. Pak Rudi tiba pukul 09.45.\n\n**Ingat:**\n\n- Cari dulu lama perjalanan, lalu tambahkan ke waktu berangkat.\n- Ubah bagian dari satu jam menjadi menit: 0,5 jam = 30 menit dan 0,25 jam = 15 menit.\n- Kalau kecepatannya km/jam dan waktunya menit, ubah dulu satuannya.',
              ),
              figure: {
                ...timeLine(7, 10, 1 / 12, 12, {
                  marks: [{ at: 7.25, label: '07.15', color: 'result' }, { at: 9.75, label: '09.45', color: 'result' }],
                  jumps: [{ from: 7.25, to: 9.25, label: '+2', color: 'a' }, { from: 9.25, to: 9.75, label: '+30', color: 'b' }],
                }),
                caption: L(
                  'From 07.15: jump 2 hours (green), then 30 minutes (orange).',
                  'Dari 07.15: lompat 2 jam (hijau), lalu 30 menit (oranye).',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Minutes, Decimals and Averages', 'Awas, Jebakan!: Menit, Desimal, dan Rata-rata'),
              body: L(
                'Watch out for these three mistakes.\n\n| Wrong | Right |\n|---|---|\n| 12 km/h for 30 minutes: $12 \\times 30 = 360$ km | 30 minutes = 0.5 hour, so $12 \\times 0.5 = 6$ km |\n| 2.5 hours = 2 hours 50 minutes | 2.5 hours = 2 hours 30 minutes |\n| A bicycle covers 30 km in 2 hours, then 30 km in 3 hours. Average speed $= (15 + 10) \\div 2 = 12.5$ km/h | Average speed = total distance $\\div$ total time $= 60 \\div 5 = 12$ km/h |',
                'Awas, ada tiga kesalahan yang sering terjadi.\n\n| Salah | Benar |\n|---|---|\n| 12 km/jam selama 30 menit: $12 \\times 30 = 360$ km | 30 menit = 0,5 jam, jadi $12 \\times 0{,}5 = 6$ km |\n| 2,5 jam = 2 jam 50 menit | 2,5 jam = 2 jam 30 menit |\n| Sepeda menempuh 30 km dalam 2 jam, lalu 30 km dalam 3 jam. Kecepatan rata-rata $= (15 + 10) \\div 2 = 12{,}5$ km/jam | Kecepatan rata-rata = jarak total $\\div$ waktu total $= 60 \\div 5 = 12$ km/jam |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Hasan leaves at 06.45 on a motorbike going 40 km/h. His destination is 100 km away. The red dot shows when he leaves. When does he arrive?',
                'Hasan berangkat pukul 06.45 naik sepeda motor berkecepatan 40 km/jam. Tujuannya sejauh 100 km. Titik merah menunjukkan waktu Hasan berangkat. Pukul berapa Hasan tiba?',
              ),
              figure: {
                ...timeLine(6, 10, 0.25, 4, { marks: [{ at: 6.75, label: '06.45', color: 'result' }] }),
                caption: L('The red dot is the time Hasan leaves.', 'Titik merah adalah waktu Hasan berangkat.'),
              },
              options: [L('09.15', 'pukul 09.15'), L('09.35', 'pukul 09.35'), L('08.45', 'pukul 08.45'), L('09.45', 'pukul 09.45')],
              answer: 0,
              explain: L(
                'The travel time is $100 \\div 40 = 2.5$ hours = 2 hours 30 minutes. From 06.45: plus 2 hours is 08.45, plus 30 minutes is 09.15. Reading 2.5 hours as 2 hours 50 minutes gives 09.35, and adding only 2 hours gives 08.45.',
                'Lama perjalanan $100 \\div 40 = 2{,}5$ jam = 2 jam 30 menit. Dari pukul 06.45: ditambah 2 jam menjadi 08.45, ditambah 30 menit menjadi 09.15. Membaca 2,5 jam sebagai 2 jam 50 menit memberi 09.35, dan hanya menambah 2 jam memberi 08.45.',
              ),
              hint: L(
                'First find the travel time with distance $\\div$ speed. Change the part of an hour into minutes, then add.',
                'Cari dulu lama perjalanan dengan jarak $\\div$ kecepatan. Ubah bagian dari satu jam menjadi menit, lalu tambahkan.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: a bus goes 90 km at 60 km/h. Find the travel time, then write it in hours and minutes.',
                'Coba bersama: sebuah bus menempuh 90 km dengan kecepatan 60 km/jam. Cari lama perjalanannya, lalu tulis dalam jam dan menit.',
              ),
              template: {
                en: '90 \\div 60 = 1.5 \\text{ hours} = ___ \\text{ hour } ___ \\text{ minutes}',
                id: '90 \\div 60 = 1{,}5 \\text{ jam} = ___ \\text{ jam } ___ \\text{ menit}',
              },
              blanks: ['1', '30'],
              explain: L(
                '$1.5$ hours is 1 hour and half an hour, which is 1 hour 30 minutes.',
                '$1{,}5$ jam adalah 1 jam dan setengah jam, yaitu 1 jam 30 menit.',
              ),
              hint: L(
                'The 0.5 part of an hour is half an hour. How many minutes is that?',
                'Bagian 0,5 dari satu jam adalah setengah jam. Berapa menit itu?',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'Gita rides a motorbike. The dots show how far she has gone after 1 hour and after 3 hours. What is her average speed for the whole trip?',
                'Gita naik sepeda motor. Titik-titik menunjukkan jarak yang sudah ia tempuh setelah 1 jam dan setelah 3 jam. Berapa kecepatan rata-rata Gita selama seluruh perjalanan?',
              ),
              figure: {
                ...distTime({ xMax: 3, yMax: 120, yStep: 40, series: [{ pts: [[0, 0], [1, 60], [3, 120]], color: 'a' }] }),
                caption: L(
                  'Across: time in hours. Up: distance in km.',
                  'Mendatar: waktu dalam jam. Tegak: jarak dalam km.',
                ),
              },
              options: [L('40 km/h', '40 km/jam'), L('45 km/h', '45 km/jam'), L('60 km/h', '60 km/jam'), L('30 km/h', '30 km/jam')],
              answer: 0,
              explain: L(
                'The whole trip is 120 km in 3 hours, and $120 \\div 3 = 40$. The speeds of the two parts are 60 and 30. Their middle, 45, is wrong because the two parts did not take the same time.',
                'Seluruh perjalanan adalah 120 km dalam 3 jam, dan $120 \\div 3 = 40$. Kecepatan kedua bagian adalah 60 dan 30. Nilai tengahnya, 45, salah karena kedua bagian tidak memakan waktu yang sama.',
              ),
              hint: L(
                'For the average speed, look at the whole trip: the total distance and the total time.',
                'Untuk kecepatan rata-rata, lihat seluruh perjalanan: jarak total dan waktu total.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'Ani covers 18 km in 3 hours. Budi covers 20 km in 4 hours. Both keep the same speed. Choose TWO correct statements.',
                'Ani menempuh 18 km dalam 3 jam. Budi menempuh 20 km dalam 4 jam. Keduanya bergerak dengan kecepatan tetap. Pilih DUA pernyataan yang benar.',
              ),
              options: [
                L('Ani\'s speed is 6 km/h.', 'Kecepatan Ani adalah 6 km/jam.'),
                L('Ani is faster than Budi.', 'Ani lebih cepat daripada Budi.'),
                L('Budi is faster because he went farther.', 'Budi lebih cepat karena ia menempuh jarak yang lebih jauh.'),
                L('Budi\'s speed is 80 km/h.', 'Kecepatan Budi adalah 80 km/jam.'),
              ],
              answer: [0, 1],
              explain: L(
                'Ani: $18 \\div 3 = 6$ km/h. Budi: $20 \\div 4 = 5$ km/h. So Ani is faster. A longer distance does not mean a higher speed, because Budi also took more time. The number 80 comes from multiplying instead of dividing.',
                'Ani: $18 \\div 3 = 6$ km/jam. Budi: $20 \\div 4 = 5$ km/jam. Jadi Ani lebih cepat. Jarak yang lebih jauh belum tentu kecepatan yang lebih tinggi, karena Budi juga memakan waktu lebih lama. Angka 80 berasal dari mengalikan, bukan membagi.',
              ),
              hint: L(
                'Find each speed with distance $\\div$ time, and compare the two speeds.',
                'Cari kecepatan masing-masing dengan jarak $\\div$ waktu, lalu bandingkan kedua kecepatan itu.',
              ),
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: L(
                'Put the steps in order. A motorbike goes 40 km/h for 30 minutes. How far does it go?',
                'Urutkan langkahnya. Sebuah sepeda motor melaju 40 km/jam selama 30 menit. Berapa km jarak yang ditempuh?',
              ),
              lines: {
                en: ['30 \\text{ minutes} = 0.5 \\text{ hour}', 's = v \\times t', 's = 40 \\times 0.5', 's = 20 \\text{ km}'],
                id: ['30 \\text{ menit} = 0{,}5 \\text{ jam}', 's = v \\times t', 's = 40 \\times 0{,}5', 's = 20 \\text{ km}'],
              },
              explain: L(
                'Match the units first, then choose the formula, put the numbers in, and calculate.',
                'Samakan dulu satuannya, lalu pilih rumus, masukkan angka, dan hitung.',
              ),
              hint: L(
                'The speed is in km per HOUR, so the time must be in hours before you multiply.',
                'Kecepatannya dalam km per JAM, jadi waktunya harus dalam jam sebelum dikalikan.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Pak Joko rides a motorbike at 40 km/h for 2 hours. Then he rides at 60 km/h for 3 hours. What is his average speed for the whole trip?',
                'Pak Joko naik sepeda motor dengan kecepatan 40 km/jam selama 2 jam. Lalu ia melaju 60 km/jam selama 3 jam. Berapa kecepatan rata-rata Pak Joko selama seluruh perjalanan?',
              ),
              blanks: [{ answer: 52, after: KMH_AFTER }],
              hints: [
                L('Average speed uses the WHOLE trip: the total distance and the total time.', 'Kecepatan rata-rata memakai SELURUH perjalanan: jarak total dan waktu total.'),
                L('Find the distance of each part with speed $\\times$ time. Then add the two distances and the two times.', 'Cari jarak tiap bagian dengan kecepatan $\\times$ waktu. Lalu jumlahkan kedua jarak dan kedua waktu.'),
                L('The distances are $40 \\times 2$ and $60 \\times 3$. The total time is $2 + 3$ hours. Divide the total distance by the total time.', 'Jaraknya $40 \\times 2$ dan $60 \\times 3$. Waktu totalnya $2 + 3$ jam. Bagi jarak total dengan waktu total.'),
              ],
              explain: L(
                'The distances are $40 \\times 2 = 80$ km and $60 \\times 3 = 180$ km, so 260 km in $2 + 3 = 5$ hours. The average speed is $260 \\div 5 = 52$ km/h.',
                'Jaraknya $40 \\times 2 = 80$ km dan $60 \\times 3 = 180$ km, jadi 260 km dalam $2 + 3 = 5$ jam. Kecepatan rata-ratanya $260 \\div 5 = 52$ km/jam.',
              ),
              solution: ['40 \\times 2 = 80 \\quad 60 \\times 3 = 180', '80 + 180 = 260 \\quad 2 + 3 = 5', '260 \\div 5 = 52'],
            },
          ],
        },
      ],
      project: {
        id: 'tka-m6-s2-p',
        runtime: 'math',
        title: L('Speed on the Road', 'Kecepatan di Jalan'),
        brief: L(
          'Use speed, distance and time to plan trips and find arrival times.',
          'Pakai kecepatan, jarak, dan waktu untuk merencanakan perjalanan dan mencari waktu tiba.',
        ),
        requirements: [
          L('Find speed, distance or time with the right relation and the right units.', 'Mencari kecepatan, jarak, atau waktu dengan hubungan dan satuan yang tepat.'),
          L('Combine speed with clock times in a multi-step trip.', 'Menggabungkan kecepatan dengan waktu jam dalam perjalanan yang bertahap.'),
        ],
        hints: [
          L('Speed = distance $\\div$ time. Cover the letter you want in the s, v, t triangle.', 'Kecepatan = jarak $\\div$ waktu. Tutup huruf yang dicari pada segitiga s, v, t.'),
          L('Match the units first: 20 minutes is $\\frac{1}{3}$ hour, and 30 minutes is half an hour.', 'Samakan dulu satuannya: 20 menit adalah $\\frac{1}{3}$ jam, dan 30 menit adalah setengah jam.'),
          L('For the last task, find how long he is really driving before you divide the distance.', 'Untuk soal terakhir, cari dulu berapa lama ia benar-benar mengemudi sebelum membagi jaraknya.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L(
              'A car covers 240 km in 3 hours. What is its speed?',
              'Sebuah mobil menempuh 240 km dalam 3 jam. Berapa kecepatannya?',
            ),
            blanks: [{ answer: 80, after: KMH_AFTER }],
            solution: ['v = s \\div t', 'v = 240 \\div 3 = 80'],
          },
          {
            prompt: L(
              'Siti rides a bicycle at 18 km/h for 20 minutes. How many km does she cover?',
              'Siti bersepeda dengan kecepatan 18 km/jam selama 20 menit. Berapa km yang ia tempuh?',
            ),
            blanks: [{ answer: 6, after: KM_AFTER }],
            solution: {
              en: ['20 \\text{ minutes} = \\frac{1}{3} \\text{ hour}', 's = v \\times t = 18 \\times \\frac{1}{3} = 18 \\div 3 = 6'],
              id: ['20 \\text{ menit} = \\frac{1}{3} \\text{ jam}', 's = v \\times t = 18 \\times \\frac{1}{3} = 18 \\div 3 = 6'],
            },
          },
          {
            prompt: L(
              'A bus leaves Surabaya at 08.40 and goes 210 km at 60 km/h. At what time does it arrive? Write the hours and the minutes.',
              'Sebuah bus berangkat dari Surabaya pukul 08.40 dan menempuh 210 km dengan kecepatan 60 km/jam. Pukul berapa bus itu tiba? Tulis jam dan menitnya.',
            ),
            inline: true,
            blanks: [HOURS(12), MINUTES(10)],
            solution: {
              en: ['t = 210 \\div 60 = 3.5 \\text{ hours} = 3 \\text{ hours } 30 \\text{ minutes}', '08.40 + 3 \\text{ hours} = 11.40', '11.40 + 30 \\text{ minutes} = 12.10'],
              id: ['t = 210 \\div 60 = 3{,}5 \\text{ jam} = 3 \\text{ jam } 30 \\text{ menit}', '08.40 + 3 \\text{ jam} = 11.40', '11.40 + 30 \\text{ menit} = 12.10'],
            },
          },
          {
            prompt: L(
              'Pak Eko leaves at 06.30 and arrives at 11.15 after covering 120 km. On the way he rests for 45 minutes. What is his average speed while he is really driving?',
              'Pak Eko berangkat pukul 06.30 dan tiba pukul 11.15 setelah menempuh 120 km. Di tengah jalan ia istirahat 45 menit. Berapa kecepatan rata-rata Pak Eko saat benar-benar mengemudi?',
            ),
            figure: {
              ...timeLine(6, 12, 0.25, 4, {
                marks: [{ at: 6.5, label: '06.30', color: 'result' }, { at: 11.25, label: '11.15', color: 'result' }],
                shade: [6.5, 11.25],
              }),
              caption: L('The green stretch is the whole time from leaving to arriving, including the rest.', 'Bagian hijau adalah seluruh waktu dari berangkat sampai tiba, termasuk istirahat.'),
            },
            blanks: [{ answer: 30, after: KMH_AFTER }],
            solution: {
              en: ['06.30 \\rightarrow 11.15 = 4 \\text{ hours } 45 \\text{ minutes}', '4 \\text{ hours } 45 \\text{ minutes} - 45 \\text{ minutes} = 4 \\text{ hours}', 'v = 120 \\div 4 = 30'],
              id: ['06.30 \\rightarrow 11.15 = 4 \\text{ jam } 45 \\text{ menit}', '4 \\text{ jam } 45 \\text{ menit} - 45 \\text{ menit} = 4 \\text{ jam}', 'v = 120 \\div 4 = 30'],
            },
          },
        ],
      },
    },
  ],
}
