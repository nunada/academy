import type { Loc, Module } from '../types'
import type { FigColor, FigItem } from '../../lib/figure'
import type { Piece } from './figs'
import { barChart, fractionBars, numberLine, shape, txt } from './figs'

/** Module 1 — integers, rational numbers, integer powers, roots and
 *  scientific notation: the number sense the rest of the course stands on. */

const L = (en: string, id: string): Loc => ({ en, id })

/* ------------------------------------------------------------- helpers */

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

/** Tick label for a line cut in `d` equal steps per unit: 0, 1/4, -1/2, 3/2 ... */
function fracFmt(d: number) {
  return (v: number): string => {
    const n = Math.round(v * d)
    if (n === 0) return '0'
    if (n % d === 0) return String(n / d)
    const g = gcd(Math.abs(n), d)
    return `${n / g}/${d / g}`
  }
}

/** A number line with the jumps of a calculation drawn one above the other, so that a jump
 *  forward and a jump back do not sit on top of each other. */
function hops(o: { from: number; to: number; start: number; steps: { to: number; label: string; color: FigColor }[] }): Piece {
  let at = o.start
  const extra: FigItem[] = []
  o.steps.forEach((s, i) => {
    const y = 1.0 + i * 1.2
    extra.push({ t: 'vec', from: [at, y], to: [s.to, y], color: s.color })
    extra.push(txt((at + s.to) / 2, y + 0.6, s.label, 'md', s.color))
    at = s.to
  })
  const base = numberLine({
    from: o.from,
    to: o.to,
    step: 1,
    marks: [
      { at: o.start, color: 'muted' },
      { at, color: 'result' },
    ],
  })
  return { ...base, items: [...base.items, ...extra], ySpan: [-2.2, 1.0 + o.steps.length * 1.2 + 0.7], aspect: 2.3 }
}

/* -------------------------------------------------------------- module */

export const module1: Module = {
  id: 'tka-smp-m1',
  title: L('Integers, Rationals, Powers and Roots', 'Bilangan Bulat, Rasional, Pangkat, dan Akar'),
  summary: L(
    'Calculate with negative numbers, fractions, decimals and percents; use integer powers, square and cube roots, and write very large and very small numbers in scientific notation.',
    'Menghitung dengan bilangan negatif, pecahan, desimal, dan persen; memakai pangkat bulat, akar kuadrat dan akar pangkat tiga, serta menulis bilangan yang sangat besar atau sangat kecil dalam notasi ilmiah.',
  ),
  submodules: [
    /* ================================================ S1: integers and rationals */
    {
      id: 'tka-smp-m1-s1',
      title: L('Integers and Rational Numbers', 'Bilangan Bulat dan Rasional'),
      summary: L(
        'Order and compare integers, calculate with signs and the order of operations, and move between fractions, decimals and percents while adding, subtracting, multiplying and dividing fractions.',
        'Mengurutkan dan membandingkan bilangan bulat, menghitung dengan tanda dan urutan operasi, serta berpindah antara pecahan, desimal, dan persen sambil menjumlah, mengurang, mengalikan, dan membagi pecahan.',
      ),
      lessons: [
        /* ------------------------------------------------------ S1 L1 integers */
        {
          id: 'tka-smp-m1-s1-l1',
          title: L('Integers: Order and Operations', 'Bilangan Bulat: Urutan dan Operasi'),
          goal: L(
            'You can order integers, find absolute values, and calculate with signs, the order of operations and the properties of operations.',
            'Kamu bisa mengurutkan bilangan bulat, menentukan nilai mutlak, dan menghitung dengan tanda, urutan operasi, serta sifat-sifat operasi.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Numbers Below Zero', 'Ayo Amati: Bilangan di Bawah Nol'),
              body: L(
                'In Dieng the morning temperature can drop to $-3$ °C. A diver swims at $-12$ m, which means 12 metres below sea level. Numbers like these are **negative integers**. Together with 0 and the positive numbers they form the **integers**.\n\n- On the number line, the further **right** a number is, the **greater** it is. So $-8<-3<0<2$.\n- The **absolute value** $|x|$ is the distance from $x$ to 0. It is never negative: $|-4|=4$ and $|3|=3$.\n- Two numbers with the same absolute value but different signs, like $-4$ and $4$, lie on opposite sides of 0.\n\nIn the picture, the green dot is at $-4$ and the orange dot is at 3. The jumps show how far each one is from 0.',
                'Di Dieng, suhu pagi hari bisa turun sampai $-3$ °C. Seorang penyelam berenang di kedalaman $-12$ m, artinya 12 meter di bawah permukaan laut. Bilangan seperti ini disebut **bilangan bulat negatif**. Bersama 0 dan bilangan positif, semuanya membentuk **bilangan bulat**.\n\n- Pada garis bilangan, makin ke **kanan** letak suatu bilangan, makin **besar** bilangan itu. Jadi $-8<-3<0<2$.\n- **Nilai mutlak** $|x|$ adalah jarak $x$ ke 0. Nilai mutlak tidak pernah negatif: $|-4|=4$ dan $|3|=3$.\n- Dua bilangan yang nilai mutlaknya sama tetapi tandanya berbeda, seperti $-4$ dan $4$, terletak di dua sisi 0 yang berlawanan.\n\nPada gambar, titik hijau ada di $-4$ dan titik oranye ada di 3. Anak panah menunjukkan jarak masing-masing titik dari 0.',
              ),
              figure: {
                ...numberLine({
                  from: -6,
                  to: 6,
                  step: 1,
                  marks: [
                    { at: -4, color: 'a', label: '-4' },
                    { at: 3, color: 'b', label: '3' },
                  ],
                  jumps: [
                    { from: -4, to: 0, label: '4', color: 'a' },
                    { from: 0, to: 3, label: '3', color: 'b' },
                  ],
                }),
                caption: L(
                  'The distance from -4 to 0 is 4 and the distance from 0 to 3 is 3.',
                  'Jarak dari -4 ke 0 adalah 4 dan jarak dari 0 ke 3 adalah 3.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Adding and Subtracting', 'Contoh Bertahap: Menjumlah dan Mengurang'),
              body: L(
                'Let us calculate $-3+7-6$ by jumping on the number line.\n\n1. Step 1: Start at $-3$.\n2. Step 2: Adding 7 means 7 steps to the **right**: $-3+7=4$ (the green jump).\n3. Step 3: Subtracting 6 means 6 steps to the **left**: $4-6=-2$ (the orange jump).\n4. Step 4: The red dot is the answer: $-3+7-6=-2$.\n\n**Remember:**\n\n- Add a positive number: move right. Subtract a positive number: move left.\n- Subtracting a negative number is the same as adding its opposite: $5-(-3)=5+3=8$.',
                'Mari kita hitung $-3+7-6$ dengan melompat di garis bilangan.\n\n1. Langkah 1: Mulai dari $-3$.\n2. Langkah 2: Menambah 7 berarti 7 langkah ke **kanan**: $-3+7=4$ (lompatan hijau).\n3. Langkah 3: Mengurang 6 berarti 6 langkah ke **kiri**: $4-6=-2$ (lompatan oranye).\n4. Langkah 4: Titik merah adalah jawabannya: $-3+7-6=-2$.\n\n**Ingat:**\n\n- Menambah bilangan positif: geser ke kanan. Mengurang bilangan positif: geser ke kiri.\n- Mengurang bilangan negatif sama dengan menambah lawannya: $5-(-3)=5+3=8$.',
              ),
              figure: {
                ...hops({
                  from: -4,
                  to: 5,
                  start: -3,
                  steps: [
                    { to: 4, label: '+7', color: 'a' },
                    { to: -2, label: '-6', color: 'b' },
                  ],
                }),
                caption: L(
                  'Start at -3, jump 7 to the right, then 6 to the left.',
                  'Mulai dari -3, lompat 7 ke kanan, lalu 6 ke kiri.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: Signs and the Order of Operations', 'Contoh Bertahap: Tanda dan Urutan Operasi'),
              body: L(
                'Multiplying and dividing integers follows one simple rule: look at the signs.\n\n| Signs of the two numbers | Sign of the result | Example |\n|---|---|---|\n| both positive | positive | $6\\times3=18$ |\n| both negative | positive | $(-6)\\times(-3)=18$ and $(-12)\\div(-4)=3$ |\n| one positive, one negative | negative | $6\\times(-3)=-18$ and $(-12)\\div4=-3$ |\n\nWhen a calculation has several operations, follow the **order of operations**:\n\n1. Brackets first.\n2. Powers.\n3. Multiplication and division, from left to right.\n4. Addition and subtraction, from left to right.\n\nExample: $5-3\\times(-4)+(-18)\\div6$. First the multiplication and the division: $3\\times(-4)=-12$ and $(-18)\\div6=-3$. Then $5-(-12)+(-3)=5+12-3=14$.',
                'Mengalikan dan membagi bilangan bulat mengikuti satu aturan sederhana: lihat tandanya.\n\n| Tanda kedua bilangan | Tanda hasil | Contoh |\n|---|---|---|\n| sama-sama positif | positif | $6\\times3=18$ |\n| sama-sama negatif | positif | $(-6)\\times(-3)=18$ dan $(-12)\\div(-4)=3$ |\n| satu positif, satu negatif | negatif | $6\\times(-3)=-18$ dan $(-12)\\div4=-3$ |\n\nJika sebuah hitungan punya beberapa operasi, ikuti **urutan operasi**:\n\n1. Kurung dulu.\n2. Pangkat.\n3. Perkalian dan pembagian, dari kiri ke kanan.\n4. Penjumlahan dan pengurangan, dari kiri ke kanan.\n\nContoh: $5-3\\times(-4)+(-18)\\div6$. Pertama perkalian dan pembagian: $3\\times(-4)=-12$ dan $(-18)\\div6=-3$. Lalu $5-(-12)+(-3)=5+12-3=14$.',
              ),
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Three Traps and Two Shortcuts', 'Awas, Jebakan!: Tiga Jebakan dan Jalan Pintas'),
              body: L(
                'Three traps catch many students. Compare them carefully.\n\n| Wrong | Right |\n|---|---|\n| $-3-5=-2$ (the answer was found as $5-3$ and given a minus sign) | $-3-5=-8$ (start at $-3$ and move 5 steps left) |\n| $-2^2=4$ (the minus sign was squared too) | $-2^2=-(2\\times2)=-4$, but $(-2)^2=(-2)\\times(-2)=4$ |\n| $6-(-2)=4$ (the two minus signs were ignored) | $6-(-2)=6+2=8$ (subtracting a negative adds) |\n\nThe **properties** of operations make mental calculation easy:\n\n- **Commutative:** $a+b=b+a$ and $a\\times b=b\\times a$. The order can change.\n- **Associative:** $(a+b)+c=a+(b+c)$, and the same for $\\times$. The grouping can change.\n- **Distributive:** $a\\times(b+c)=a\\times b+a\\times c$.\n\nFor example, $25\\times17\\times4=(25\\times4)\\times17=100\\times17=1\\,700$ and $18\\times99=18\\times(100-1)=1\\,800-18=1\\,782$.',
                'Tiga jebakan ini sering membuat siswa salah. Bandingkan dengan teliti.\n\n| Salah | Benar |\n|---|---|\n| $-3-5=-2$ (jawaban dicari dengan $5-3$ lalu diberi tanda minus) | $-3-5=-8$ (mulai dari $-3$ lalu geser 5 langkah ke kiri) |\n| $-2^2=4$ (tanda minus ikut dikuadratkan) | $-2^2=-(2\\times2)=-4$, tetapi $(-2)^2=(-2)\\times(-2)=4$ |\n| $6-(-2)=4$ (kedua tanda minus diabaikan) | $6-(-2)=6+2=8$ (mengurang bilangan negatif berarti menambah) |\n\n**Sifat-sifat** operasi membuat hitungan di kepala jadi mudah:\n\n- **Komutatif:** $a+b=b+a$ dan $a\\times b=b\\times a$. Urutan boleh ditukar.\n- **Asosiatif:** $(a+b)+c=a+(b+c)$, dan sama untuk $\\times$. Pengelompokan boleh diubah.\n- **Distributif:** $a\\times(b+c)=a\\times b+a\\times c$.\n\nContoh: $25\\times17\\times4=(25\\times4)\\times17=100\\times17=1\\,700$ dan $18\\times99=18\\times(100-1)=1\\,800-18=1\\,782$.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The red dot is at $-5$ and the green dot is at $3$. Which statement is correct?',
                'Titik merah ada di $-5$ dan titik hijau ada di $3$. Pernyataan mana yang benar?',
              ),
              figure: {
                ...numberLine({
                  from: -6,
                  to: 6,
                  step: 1,
                  marks: [
                    { at: -5, color: 'result', label: '-5' },
                    { at: 3, color: 'a', label: '3' },
                  ],
                }),
                caption: L('Two dots on a number line.', 'Dua titik pada garis bilangan.'),
              },
              options: [
                L('$-5<3$ and $|-5|>|3|$', '$-5<3$ dan $|-5|>|3|$'),
                L('$-5>3$ because 5 is greater than 3', '$-5>3$ karena 5 lebih besar dari 3'),
                L('$-5<3$ and $|-5|<|3|$', '$-5<3$ dan $|-5|<|3|$'),
                L('$-5>3$ and $|-5|>|3|$', '$-5>3$ dan $|-5|>|3|$'),
              ],
              answer: 0,
              explain: L(
                '$-5$ is to the left of 3, so it is smaller. But $-5$ is 5 steps from 0 and 3 is only 3 steps away, so its absolute value is greater. Ignoring the sign gives the wrong order.',
                '$-5$ ada di sebelah kiri 3, jadi lebih kecil. Namun $-5$ berjarak 5 langkah dari 0 sedangkan 3 hanya 3 langkah, jadi nilai mutlaknya lebih besar. Mengabaikan tanda memberi urutan yang salah.',
              ),
              hint: L(
                'Two separate questions: which dot is further left, and which dot is further from 0?',
                'Ada dua pertanyaan terpisah: titik mana yang lebih ke kiri, dan titik mana yang lebih jauh dari 0?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: calculate $-4+9-7$. First the sum of the first two numbers, then subtract 7.',
                'Coba bersama: hitung $-4+9-7$. Pertama jumlahkan dua bilangan pertama, lalu kurangi 7.',
              ),
              template: '-4 + 9 = ___ \\quad 5 - 7 = ___',
              blanks: ['5', '-2'],
              explain: L(
                '$-4+9=5$ (9 steps to the right of $-4$) and $5-7=-2$ (7 steps to the left of 5), so $-4+9-7=-2$.',
                '$-4+9=5$ (9 langkah ke kanan dari $-4$) dan $5-7=-2$ (7 langkah ke kiri dari 5), jadi $-4+9-7=-2$.',
              ),
              hint: L(
                'Start at $-4$ and move right for the first jump. From your new spot, move left for the second.',
                'Mulai dari $-4$ dan geser ke kanan untuk lompatan pertama. Dari tempat yang baru, geser ke kiri untuk lompatan kedua.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'Choose the TWO calculations whose result is $-6$.',
                'Pilih DUA hitungan yang hasilnya $-6$.',
              ),
              options: [
                L('$(-2)\\times3$', '$(-2)\\times3$'),
                L('$12\\div(-2)$', '$12\\div(-2)$'),
                L('$(-2)\\times(-3)$', '$(-2)\\times(-3)$'),
                L('$(-18)\\div(-3)$', '$(-18)\\div(-3)$'),
              ],
              answer: [0, 1],
              explain: L(
                'Different signs give a negative result: $(-2)\\times3=-6$ and $12\\div(-2)=-6$. Two negative numbers give a positive result: $(-2)\\times(-3)=6$ and $(-18)\\div(-3)=6$.',
                'Tanda berbeda memberi hasil negatif: $(-2)\\times3=-6$ dan $12\\div(-2)=-6$. Dua bilangan negatif memberi hasil positif: $(-2)\\times(-3)=6$ dan $(-18)\\div(-3)=6$.',
              ),
              hint: L(
                'For each calculation, look at the signs of the two numbers before you look at the size of the answer.',
                'Pada setiap hitungan, lihat dulu tanda kedua bilangan sebelum melihat besar hasilnya.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
              statements: [
                L('$|-7|=7$', '$|-7|=7$'),
                L('$-8>-3$', '$-8>-3$'),
                L('$6-(-2)=8$', '$6-(-2)=8$'),
                L('$-2^2=4$', '$-2^2=4$'),
              ],
              answer: [true, false, true, false],
              explain: L(
                'The distance of $-7$ from 0 is 7. On the number line $-8$ is to the left of $-3$, so $-8<-3$. Subtracting a negative adds: $6+2=8$. And $-2^2=-(2\\times2)=-4$, because the square only touches the 2.',
                'Jarak $-7$ dari 0 adalah 7. Pada garis bilangan $-8$ ada di kiri $-3$, jadi $-8<-3$. Mengurang bilangan negatif berarti menambah: $6+2=8$. Dan $-2^2=-(2\\times2)=-4$, karena pangkat dua hanya mengenai angka 2.',
              ),
              hint: L(
                'For $-8$ and $-3$, ask which is further left. For $-2^2$, ask what the exponent is attached to.',
                'Untuk $-8$ dan $-3$, tanyakan mana yang lebih ke kiri. Untuk $-2^2$, tanyakan pangkat itu menempel pada apa.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'At 04.00 the temperature in Dieng is $-5$ °C. For the next 4 hours it rises 3 °C every hour. After that it falls 4 °C every hour for 2 hours. What is the final temperature?',
                'Pukul 04.00 suhu di Dieng adalah $-5$ °C. Selama 4 jam berikutnya suhu naik 3 °C setiap jam. Setelah itu suhu turun 4 °C setiap jam selama 2 jam. Berapa suhu akhirnya?',
              ),
              blanks: [{ answer: -1, after: '^{\\circ}\\text{C}' }],
              hints: [
                L(
                  'Split the story into three parts: the start, the rise and the fall. How much does the temperature rise in total, and how much does it fall in total?',
                  'Bagi ceritanya menjadi tiga bagian: awal, kenaikan, dan penurunan. Berapa total kenaikan suhu, dan berapa total penurunannya?',
                ),
                L(
                  'The total rise is $4\\times3$ and the total fall is $2\\times4$. The final temperature is start + rise $-$ fall.',
                  'Total kenaikan adalah $4\\times3$ dan total penurunan adalah $2\\times4$. Suhu akhir = awal + kenaikan $-$ penurunan.',
                ),
                L(
                  '$-5+12=7$. Now subtract the total fall from 7.',
                  '$-5+12=7$. Sekarang kurangi 7 dengan total penurunan.',
                ),
              ],
              explain: L(
                'The temperature rises $4\\times3=12$ degrees and falls $2\\times4=8$ degrees, so $-5+12-8=-1$ °C.',
                'Suhu naik $4\\times3=12$ derajat dan turun $2\\times4=8$ derajat, jadi $-5+12-8=-1$ °C.',
              ),
              solution: ['4\\times3=12 \\quad 2\\times4=8', '-5+12-8', '=7-8=-1'],
            },
          ],
        },
        /* --------------------------------------------------- S1 L2 rationals */
        {
          id: 'tka-smp-m1-s1-l2',
          title: L('Rational Numbers: Fractions and Decimals', 'Bilangan Rasional: Pecahan dan Desimal'),
          goal: L(
            'You can write a rational number as a fraction, a decimal or a percent, order rational numbers, and calculate with fractions.',
            'Kamu bisa menulis bilangan rasional sebagai pecahan, desimal, atau persen, mengurutkannya, dan menghitung dengan pecahan.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: One Number, Many Forms', 'Ayo Amati: Satu Bilangan, Banyak Bentuk'),
              body: L(
                'Ani drinks $\\frac{3}{4}$ litre of milk. Budi drinks 0.75 litre. Citra says she drank 75% of a 1-litre bottle. They all drank the same amount!\n\nA **rational number** is any number that can be written as $\\frac{a}{b}$, where $a$ and $b$ are integers and $b\\neq0$. Integers are rational too: $5=\\frac{5}{1}$ and $-2=\\frac{-2}{1}$.\n\n- A **fraction**, a **decimal** and a **percent** can name the same rational number: $\\frac{3}{4}=0.75=75\\%$.\n- **Equivalent fractions** such as $\\frac{3}{4}=\\frac{6}{8}=\\frac{15}{20}$ are the same point on the number line.\n- In the picture, the coloured part has the same length in every bar.',
                'Ani minum $\\frac{3}{4}$ liter susu. Budi minum 0,75 liter. Citra bilang ia minum 75% dari sebotol berukuran 1 liter. Ternyata jumlahnya sama!\n\n**Bilangan rasional** adalah bilangan yang dapat ditulis sebagai $\\frac{a}{b}$, dengan $a$ dan $b$ bilangan bulat dan $b\\neq0$. Bilangan bulat juga rasional: $5=\\frac{5}{1}$ dan $-2=\\frac{-2}{1}$.\n\n- Sebuah **pecahan**, **desimal**, dan **persen** bisa menamai bilangan rasional yang sama: $\\frac{3}{4}=0{,}75=75\\%$.\n- **Pecahan senilai** seperti $\\frac{3}{4}=\\frac{6}{8}=\\frac{15}{20}$ adalah titik yang sama pada garis bilangan.\n- Pada gambar, bagian yang berwarna sama panjang di setiap batang.',
              ),
              figure: {
                ...fractionBars([
                  { parts: 4, shaded: 3, label: '3/4' },
                  { parts: 8, shaded: 6, label: '6/8' },
                  { parts: 20, shaded: 15, label: '15/20' },
                ]),
                caption: L(
                  'Three bars of the same length. The coloured part is the same in all of them.',
                  'Tiga batang sama panjang. Bagian yang berwarna sama di semuanya.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Converting and Ordering', 'Contoh Bertahap: Mengubah Bentuk dan Mengurutkan'),
              body: L(
                'Let us order $\\frac{3}{4}$, $0.6$, $-\\frac{1}{2}$ and $35\\%$ from the smallest to the greatest.\n\n1. Step 1: Change every number to a decimal. A fraction is the numerator divided by the denominator: $\\frac{3}{4}=3\\div4=0.75$ and $-\\frac{1}{2}=-0.5$.\n2. Step 2: A percent is a number out of 100: $35\\%=\\frac{35}{100}=0.35$.\n3. Step 3: Mark the points on the number line: $A=\\frac{3}{4}$, $B=0.6$, $C=-\\frac{1}{2}$ and $D=35\\%$.\n4. Step 4: Read from left to right: $C<D<B<A$. So $-\\frac{1}{2}<35\\%<0.6<\\frac{3}{4}$.\n\n**Remember:**\n\n- Fraction to decimal: divide the numerator by the denominator. Decimal to fraction: write it over 10, 100, ... and simplify: $0.35=\\frac{35}{100}=\\frac{7}{20}$.\n- A decimal can **end**, like $\\frac{1}{8}=0.125$, or **repeat** for ever, like $\\frac{1}{3}=0.333\\ldots=0.\\overline{3}$. Both are rational.\n- Decimal to percent: multiply by 100. $0.35=35\\%$.',
                'Mari kita urutkan $\\frac{3}{4}$, $0{,}6$, $-\\frac{1}{2}$, dan $35\\%$ dari yang terkecil sampai yang terbesar.\n\n1. Langkah 1: Ubah semua bilangan menjadi desimal. Pecahan adalah pembilang dibagi penyebut: $\\frac{3}{4}=3\\div4=0{,}75$ dan $-\\frac{1}{2}=-0{,}5$.\n2. Langkah 2: Persen adalah bilangan per 100: $35\\%=\\frac{35}{100}=0{,}35$.\n3. Langkah 3: Letakkan titik-titik pada garis bilangan: $A=\\frac{3}{4}$, $B=0{,}6$, $C=-\\frac{1}{2}$, dan $D=35\\%$.\n4. Langkah 4: Baca dari kiri ke kanan: $C<D<B<A$. Jadi $-\\frac{1}{2}<35\\%<0{,}6<\\frac{3}{4}$.\n\n**Ingat:**\n\n- Pecahan ke desimal: bagi pembilang dengan penyebut. Desimal ke pecahan: tulis per 10, 100, ... lalu sederhanakan: $0{,}35=\\frac{35}{100}=\\frac{7}{20}$.\n- Desimal bisa **berakhir**, seperti $\\frac{1}{8}=0{,}125$, atau **berulang** tanpa henti, seperti $\\frac{1}{3}=0{,}333\\ldots=0{,}\\overline{3}$. Keduanya rasional.\n- Desimal ke persen: kalikan 100. $0{,}35=35\\%$.',
              ),
              figure: {
                ...numberLine({
                  from: -1,
                  to: 1,
                  step: 0.25,
                  fmt: fracFmt(4),
                  marks: [
                    { at: 0.75, color: 'a', label: 'A' },
                    { at: 0.6, color: 'b', label: 'B' },
                    { at: -0.5, color: 'c', label: 'C' },
                    { at: 0.35, color: 'result', label: 'D' },
                  ],
                }),
                caption: L(
                  'The four numbers as points A, B, C and D. The one furthest left is the smallest.',
                  'Keempat bilangan sebagai titik A, B, C, dan D. Yang paling kiri adalah yang terkecil.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: Operations with Fractions', 'Contoh Bertahap: Operasi pada Pecahan'),
              body: L(
                'Calculate $\\frac{3}{4}+\\frac{5}{6}\\div\\frac{10}{9}$. Division comes before addition.\n\n1. Step 1: Dividing by a fraction means multiplying by its **reciprocal** (flip it): $\\frac{5}{6}\\div\\frac{10}{9}=\\frac{5}{6}\\times\\frac{9}{10}$.\n2. Step 2: Simplify before multiplying. 5 and 10 share the factor 5, and 9 and 6 share the factor 3: $\\frac{5}{6}\\times\\frac{9}{10}=\\frac{1\\times3}{2\\times2}=\\frac{3}{4}$.\n3. Step 3: Add fractions with the same denominator: $\\frac{3}{4}+\\frac{3}{4}=\\frac{6}{4}$.\n4. Step 4: Simplify: $\\frac{6}{4}=\\frac{3}{2}=1\\frac{1}{2}$.\n\n**Remember:**\n\n- Add or subtract: make the denominators equal, then add or subtract only the numerators.\n- Multiply: numerator times numerator, denominator times denominator.\n- Divide: multiply by the reciprocal of the second fraction.',
                'Hitung $\\frac{3}{4}+\\frac{5}{6}\\div\\frac{10}{9}$. Pembagian dikerjakan sebelum penjumlahan.\n\n1. Langkah 1: Membagi dengan pecahan berarti mengalikan dengan **kebalikannya** (balik pecahannya): $\\frac{5}{6}\\div\\frac{10}{9}=\\frac{5}{6}\\times\\frac{9}{10}$.\n2. Langkah 2: Sederhanakan sebelum mengalikan. 5 dan 10 punya faktor 5, dan 9 dan 6 punya faktor 3: $\\frac{5}{6}\\times\\frac{9}{10}=\\frac{1\\times3}{2\\times2}=\\frac{3}{4}$.\n3. Langkah 3: Jumlahkan pecahan yang penyebutnya sama: $\\frac{3}{4}+\\frac{3}{4}=\\frac{6}{4}$.\n4. Langkah 4: Sederhanakan: $\\frac{6}{4}=\\frac{3}{2}=1\\frac{1}{2}$.\n\n**Ingat:**\n\n- Menjumlah atau mengurang: samakan penyebutnya, lalu jumlahkan atau kurangkan pembilangnya saja.\n- Mengalikan: pembilang kali pembilang, penyebut kali penyebut.\n- Membagi: kalikan dengan kebalikan pecahan kedua.',
              ),
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Adding Denominators and Dividing', 'Awas, Jebakan!: Menjumlah Penyebut dan Membagi'),
              body: L(
                'These mistakes are very common with fractions.\n\n| Wrong | Right |\n|---|---|\n| $\\frac{1}{2}+\\frac{1}{3}=\\frac{2}{5}$ (the denominators were added) | $\\frac{1}{2}+\\frac{1}{3}=\\frac{3}{6}+\\frac{2}{6}=\\frac{5}{6}$ |\n| $\\frac{3}{4}\\div\\frac{1}{2}=\\frac{3}{8}$ (nothing was flipped) | $\\frac{3}{4}\\div\\frac{1}{2}=\\frac{3}{4}\\times\\frac{2}{1}=\\frac{3}{2}$ |\n| $\\frac{1}{3}=0.33$ (a rounded value written with an equals sign) | $\\frac{1}{3}=0.333\\ldots=0.\\overline{3}$, a repeating decimal |',
                'Kesalahan ini sangat sering terjadi pada pecahan.\n\n| Salah | Benar |\n|---|---|\n| $\\frac{1}{2}+\\frac{1}{3}=\\frac{2}{5}$ (penyebutnya dijumlahkan) | $\\frac{1}{2}+\\frac{1}{3}=\\frac{3}{6}+\\frac{2}{6}=\\frac{5}{6}$ |\n| $\\frac{3}{4}\\div\\frac{1}{2}=\\frac{3}{8}$ (tidak ada yang dibalik) | $\\frac{3}{4}\\div\\frac{1}{2}=\\frac{3}{4}\\times\\frac{2}{1}=\\frac{3}{2}$ |\n| $\\frac{1}{3}=0{,}33$ (nilai pembulatan ditulis dengan tanda sama dengan) | $\\frac{1}{3}=0{,}333\\ldots=0{,}\\overline{3}$, desimal berulang |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The number line is cut into quarters. Which number does the red dot show?',
                'Garis bilangan dibagi menjadi seperempat-seperempat. Bilangan berapa yang ditunjukkan titik merah?',
              ),
              figure: {
                ...numberLine({ from: 0, to: 2, step: 0.25, labelEvery: 4, marks: [{ at: 1.25, color: 'result' }] }),
                caption: L('The numbers 0, 1 and 2 are labelled. Each small step is the same length.', 'Bilangan 0, 1, dan 2 diberi label. Setiap langkah kecil sama panjang.'),
              },
              options: [
                L('$\\frac{5}{4}$', '$\\frac{5}{4}$'),
                L('$\\frac{4}{5}$', '$\\frac{4}{5}$'),
                L('$1.5$', '$1{,}5$'),
                L('$1.2$', '$1{,}2$'),
              ],
              answer: 0,
              explain: L(
                'Each step is $\\frac{1}{4}$, and the dot is 5 steps from 0, so it shows $\\frac{5}{4}=1.25$. The fraction $\\frac{4}{5}$ is turned upside down, and 1.5 or 1.2 are guesses that are not on the quarter marks.',
                'Setiap langkah adalah $\\frac{1}{4}$, dan titik berjarak 5 langkah dari 0, jadi menunjukkan $\\frac{5}{4}=1{,}25$. Pecahan $\\frac{4}{5}$ terbalik, sedangkan 1,5 atau 1,2 hanyalah tebakan yang tidak ada pada tanda seperempat.',
              ),
              hint: L(
                'Count the small steps from 0 to the dot. What fraction of 1 is one small step?',
                'Hitung langkah kecil dari 0 sampai titik. Satu langkah kecil adalah berapa bagian dari 1?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: $\\frac{2}{3}\\div\\frac{4}{9}=\\frac{2}{3}\\times\\frac{9}{4}$. Multiply the numerators, multiply the denominators, then simplify.',
                'Coba bersama: $\\frac{2}{3}\\div\\frac{4}{9}=\\frac{2}{3}\\times\\frac{9}{4}$. Kalikan pembilangnya, kalikan penyebutnya, lalu sederhanakan.',
              ),
              template: '2 \\times 9 = ___ \\quad 3 \\times 4 = ___ \\quad \\frac{18}{12} = ___',
              blanks: ['18', '12', '3/2'],
              explain: L(
                '$\\frac{2}{3}\\times\\frac{9}{4}=\\frac{18}{12}$, and dividing the top and bottom by 6 gives $\\frac{3}{2}$.',
                '$\\frac{2}{3}\\times\\frac{9}{4}=\\frac{18}{12}$, dan membagi pembilang dan penyebut dengan 6 memberi $\\frac{3}{2}$.',
              ),
              hint: L(
                'The first two boxes are plain products. For the last one, find a number that divides both 18 and 12.',
                'Dua kotak pertama adalah hasil kali biasa. Untuk kotak terakhir, cari bilangan yang membagi 18 dan 12.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
              statements: [
                L('$0.8=\\frac{4}{5}=80\\%$', '$0{,}8=\\frac{4}{5}=80\\%$'),
                L('$\\frac{1}{3}+\\frac{1}{6}=\\frac{2}{9}$', '$\\frac{1}{3}+\\frac{1}{6}=\\frac{2}{9}$'),
                L('$\\frac{3}{4}\\div\\frac{1}{2}=\\frac{3}{2}$', '$\\frac{3}{4}\\div\\frac{1}{2}=\\frac{3}{2}$'),
                L('$0.\\overline{3}$ is not a rational number, because its decimals never end.', '$0{,}\\overline{3}$ bukan bilangan rasional, karena desimalnya tidak pernah berakhir.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                '$0.8=\\frac{8}{10}=\\frac{4}{5}=80\\%$. For the sum, $\\frac{1}{3}+\\frac{1}{6}=\\frac{2}{6}+\\frac{1}{6}=\\frac{3}{6}=\\frac{1}{2}$; the denominators must never be added. Dividing by $\\frac{1}{2}$ is multiplying by 2, giving $\\frac{3}{2}$. And $0.\\overline{3}=\\frac{1}{3}$ is rational: a decimal that repeats can still be written as a fraction.',
                '$0{,}8=\\frac{8}{10}=\\frac{4}{5}=80\\%$. Pada penjumlahan, $\\frac{1}{3}+\\frac{1}{6}=\\frac{2}{6}+\\frac{1}{6}=\\frac{3}{6}=\\frac{1}{2}$; penyebut tidak boleh dijumlahkan. Membagi dengan $\\frac{1}{2}$ sama dengan mengalikan 2, hasilnya $\\frac{3}{2}$. Dan $0{,}\\overline{3}=\\frac{1}{3}$ itu rasional: desimal yang berulang tetap bisa ditulis sebagai pecahan.',
              ),
              hint: L(
                'For the sum, make the denominators equal first. For $0.\\overline{3}$, which fraction does it equal?',
                'Untuk penjumlahan, samakan dulu penyebutnya. Untuk $0{,}\\overline{3}$, pecahan apa yang sama dengannya?',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Ani has a ribbon $4\\frac{1}{2}$ m long. Each bow needs $\\frac{3}{4}$ m of ribbon. How many bows can she make?',
                'Ani punya pita sepanjang $4\\frac{1}{2}$ m. Setiap pita kupu-kupu membutuhkan $\\frac{3}{4}$ m. Berapa pita kupu-kupu yang bisa Ani buat?',
              ),
              blanks: [{ answer: 6, after: { en: '\\text{ bows}', id: '\\text{ pita}' } }],
              hints: [
                L(
                  'How many pieces of $\\frac{3}{4}$ m fit into $4\\frac{1}{2}$ m? Which operation counts "how many fit"?',
                  'Ada berapa potong $\\frac{3}{4}$ m yang muat dalam $4\\frac{1}{2}$ m? Operasi apa yang menghitung "berapa yang muat"?',
                ),
                L(
                  'It is a division. Write $4\\frac{1}{2}$ as an improper fraction, $\\frac{9}{2}$, then multiply by the reciprocal of $\\frac{3}{4}$.',
                  'Ini pembagian. Tulis $4\\frac{1}{2}$ sebagai pecahan tak wajar, $\\frac{9}{2}$, lalu kalikan dengan kebalikan $\\frac{3}{4}$.',
                ),
                L(
                  '$\\frac{9}{2}\\times\\frac{4}{3}$. Simplify 9 with 3 and 4 with 2 before you multiply.',
                  '$\\frac{9}{2}\\times\\frac{4}{3}$. Sederhanakan 9 dengan 3 dan 4 dengan 2 sebelum mengalikan.',
                ),
              ],
              explain: L(
                '$\\frac{9}{2}\\div\\frac{3}{4}=\\frac{9}{2}\\times\\frac{4}{3}=6$, so Ani can make 6 bows.',
                '$\\frac{9}{2}\\div\\frac{3}{4}=\\frac{9}{2}\\times\\frac{4}{3}=6$, jadi Ani bisa membuat 6 pita kupu-kupu.',
              ),
              solution: ['4\\frac{1}{2}=\\frac{9}{2}', '\\frac{9}{2}\\div\\frac{3}{4}=\\frac{9}{2}\\times\\frac{4}{3}', '=\\frac{3\\times2}{1\\times1}=6'],
            },
          ],
        },
      ],
      project: {
        id: 'tka-smp-m1-s1-p',
        runtime: 'math',
        title: L('Integers and Rational Numbers', 'Bilangan Bulat dan Rasional'),
        brief: L(
          'Use number lines, signs and fractions in everyday problems: distances, calculations and spending money.',
          'Pakai garis bilangan, tanda, dan pecahan dalam soal sehari-hari: jarak, hitungan, dan membelanjakan uang.',
        ),
        requirements: [
          L('Compare integers, find distances and calculate with signs and the order of operations.', 'Membandingkan bilangan bulat, mencari jarak, dan menghitung dengan tanda serta urutan operasi.'),
          L('Calculate with fractions in word problems.', 'Menghitung dengan pecahan dalam soal cerita.'),
        ],
        hints: [
          L('Draw a quick number line, or write each step on its own line, and watch the signs.', 'Gambar garis bilangan singkat, atau tulis tiap langkah pada barisnya sendiri, dan perhatikan tandanya.'),
          L('Order of operations: brackets, powers, then multiply and divide, then add and subtract.', 'Urutan operasi: kurung, pangkat, lalu kali dan bagi, kemudian tambah dan kurang.'),
          L('In a fraction story, find "of what" each fraction is taken: the whole amount or what is left.', 'Pada soal cerita pecahan, cari "dari apa" tiap pecahan diambil: seluruhnya atau sisanya.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L(
              'Point A is the green dot and point B is the orange dot on the number line. What is the distance between A and B?',
              'Titik A adalah titik hijau dan titik B adalah titik oranye pada garis bilangan. Berapa jarak antara A dan B?',
            ),
            figure: {
              ...numberLine({
                from: -6,
                to: 6,
                step: 1,
                marks: [
                  { at: -3, color: 'a', label: 'A' },
                  { at: 4, color: 'b', label: 'B' },
                ],
              }),
              caption: L('Points A and B on a number line.', 'Titik A dan B pada garis bilangan.'),
            },
            blanks: [{ answer: 7 }],
            solution: ['|-3|=3 \\quad |4|=4', '3+4=7'],
          },
          {
            prompt: L('Calculate. Follow the order of operations.', 'Hitunglah. Ikuti urutan operasi.'),
            given: '-5+3\\times(-4)-(-9)',
            blanks: [{ answer: -8 }],
            solution: ['3\\times(-4)=-12', '-5+(-12)-(-9)=-5-12+9', '=-8'],
          },
          {
            prompt: L(
              'Rudi has Rp240,000. He spends $\\frac{1}{4}$ of it on a book. Then he spends $\\frac{2}{3}$ of the money that is left on shoes. How much money does he have left?',
              'Rudi punya Rp240.000. Ia memakai $\\frac{1}{4}$ uangnya untuk membeli buku. Lalu ia memakai $\\frac{2}{3}$ dari uang yang tersisa untuk membeli sepatu. Berapa uang Rudi sekarang?',
            ),
            blanks: [{ label: '\\text{Rp}', answer: 60000 }],
            solution: ['\\frac{1}{4}\\times240\\,000=60\\,000', '240\\,000-60\\,000=180\\,000', '\\frac{2}{3}\\times180\\,000=120\\,000', '180\\,000-120\\,000=60\\,000'],
          },
          {
            prompt: L(
              'Two integers have a sum of $-2$ and a product of $-15$. What are the two numbers?',
              'Dua bilangan bulat memiliki jumlah $-2$ dan hasil kali $-15$. Berapa kedua bilangan itu?',
            ),
            inline: true,
            blanks: [
              { label: { en: '\\text{greater} =', id: '\\text{lebih besar} =' }, answer: 3 },
              { label: { en: '\\text{smaller} =', id: '\\text{lebih kecil} =' }, answer: -5 },
            ],
            solution: {
              en: ['\\text{Pairs with product } -15:\\quad 1\\times(-15),\\ (-1)\\times15,\\ 3\\times(-5),\\ (-3)\\times5', '\\text{Their sums are } -14,\\ 14,\\ -2,\\ 2', '3+(-5)=-2 \\quad 3\\times(-5)=-15'],
              id: ['\\text{Pasangan dengan hasil kali } -15:\\quad 1\\times(-15),\\ (-1)\\times15,\\ 3\\times(-5),\\ (-3)\\times5', '\\text{Jumlahnya } -14,\\ 14,\\ -2,\\ 2', '3+(-5)=-2 \\quad 3\\times(-5)=-15'],
            },
          },
        ],
      },
    },

    /* ======================================== S2: powers, roots, scientific notation */
    {
      id: 'tka-smp-m1-s2',
      title: L('Powers, Roots and Scientific Notation', 'Pangkat, Akar, dan Notasi Ilmiah'),
      summary: L(
        'Use integer exponents and their laws, find and estimate square and cube roots, tell rational from irrational numbers, and write very large and very small numbers in scientific notation.',
        'Memakai eksponen bulat beserta hukumnya, menentukan dan menaksir akar kuadrat dan akar pangkat tiga, membedakan bilangan rasional dan irasional, serta menulis bilangan yang sangat besar dan sangat kecil dalam notasi ilmiah.',
      ),
      lessons: [
        /* -------------------------------------------------------- S2 L1 powers */
        {
          id: 'tka-smp-m1-s2-l1',
          title: L('Integer Powers', 'Bilangan Berpangkat Bulat'),
          goal: L(
            'You can work with positive, zero and negative exponents, use the laws of exponents and compare powers.',
            'Kamu bisa menghitung dengan pangkat positif, nol, dan negatif, memakai hukum eksponen, dan membandingkan bilangan berpangkat.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Repeated Multiplication', 'Ayo Amati: Perkalian Berulang'),
              body: L(
                'A culture starts with 1 bacterium, and every hour each bacterium splits in two: 1, 2, 4, 8, 16, 32, ... After 5 hours there are $2\\times2\\times2\\times2\\times2=2^5=32$ bacteria.\n\n- In $a^n$, $a$ is the **base** and $n$ is the **exponent**. The power $a^n$ means $n$ factors of $a$ multiplied together.\n- Go back in time instead: every step back divides by 2. $2^3=8$, $2^2=4$, $2^1=2$, so $2^0=1$, then $2^{-1}=\\frac{1}{2}$ and $2^{-2}=\\frac{1}{4}$.\n- So $a^0=1$ (for $a\\neq0$) and $a^{-n}=\\frac{1}{a^n}$. A negative exponent means "one over".\n\nThe bars show the number of bacteria after 0, 1, 2, 3, 4 and 5 hours.',
                'Sebuah biakan dimulai dengan 1 bakteri, dan setiap jam tiap bakteri membelah menjadi dua: 1, 2, 4, 8, 16, 32, ... Setelah 5 jam ada $2\\times2\\times2\\times2\\times2=2^5=32$ bakteri.\n\n- Pada $a^n$, $a$ adalah **bilangan pokok (basis)** dan $n$ adalah **eksponen**. Pangkat $a^n$ berarti $n$ faktor $a$ dikalikan.\n- Sekarang mundur ke belakang: setiap langkah mundur membagi dengan 2. $2^3=8$, $2^2=4$, $2^1=2$, jadi $2^0=1$, lalu $2^{-1}=\\frac{1}{2}$ dan $2^{-2}=\\frac{1}{4}$.\n- Jadi $a^0=1$ (untuk $a\\neq0$) dan $a^{-n}=\\frac{1}{a^n}$. Eksponen negatif berarti "satu per".\n\nBatang-batang menunjukkan banyak bakteri setelah 0, 1, 2, 3, 4, dan 5 jam.',
              ),
              figure: {
                ...barChart({
                  bars: [
                    { label: '0', value: 1 },
                    { label: '1', value: 2 },
                    { label: '2', value: 4 },
                    { label: '3', value: 8 },
                    { label: '4', value: 16 },
                    { label: '5', value: 32 },
                  ],
                  max: 32,
                  step: 8,
                }),
                caption: L(
                  'The number under each bar is the exponent. Each bar is twice as tall as the one before.',
                  'Angka di bawah tiap batang adalah eksponennya. Setiap batang dua kali lebih tinggi dari batang sebelumnya.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: The Laws of Exponents', 'Contoh Bertahap: Hukum Eksponen'),
              body: L(
                'Six rules cover almost every power problem. Each one comes with a worked example.\n\n| Rule | In symbols | Example |\n|---|---|---|\n| Multiply, same base | $a^m\\cdot a^n=a^{m+n}$ | $2^3\\cdot2^4=2^7=128$ |\n| Divide, same base | $a^m\\div a^n=a^{m-n}$ | $5^6\\div5^4=5^2=25$ |\n| Power of a power | $(a^m)^n=a^{m\\cdot n}$ | $(3^2)^3=3^6=729$ |\n| Power of a product | $(ab)^n=a^n\\cdot b^n$ | $(2\\cdot5)^3=2^3\\cdot5^3=8\\cdot125=1\\,000$ |\n| Zero exponent | $a^0=1$ with $a\\neq0$ | $7^0=1$ |\n| Negative exponent | $a^{-n}=\\frac{1}{a^n}$ | $2^{-3}=\\frac{1}{2^3}=\\frac{1}{8}$ |\n\nThe first two rules need the **same base**, and they work for products and quotients, never for sums.',
                'Enam aturan ini mencakup hampir semua soal pangkat. Setiap aturan disertai contoh.\n\n| Aturan | Dalam simbol | Contoh |\n|---|---|---|\n| Kali, basis sama | $a^m\\cdot a^n=a^{m+n}$ | $2^3\\cdot2^4=2^7=128$ |\n| Bagi, basis sama | $a^m\\div a^n=a^{m-n}$ | $5^6\\div5^4=5^2=25$ |\n| Pangkat dari pangkat | $(a^m)^n=a^{m\\cdot n}$ | $(3^2)^3=3^6=729$ |\n| Pangkat dari hasil kali | $(ab)^n=a^n\\cdot b^n$ | $(2\\cdot5)^3=2^3\\cdot5^3=8\\cdot125=1\\,000$ |\n| Eksponen nol | $a^0=1$ dengan $a\\neq0$ | $7^0=1$ |\n| Eksponen negatif | $a^{-n}=\\frac{1}{a^n}$ | $2^{-3}=\\frac{1}{2^3}=\\frac{1}{8}$ |\n\nDua aturan pertama membutuhkan **basis yang sama**, dan berlaku untuk perkalian dan pembagian, tidak pernah untuk penjumlahan.',
              ),
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: Simplifying and Comparing', 'Contoh Bertahap: Menyederhanakan dan Membandingkan'),
              body: L(
                'Simplify $\\frac{2^5\\cdot(2^2)^3}{2^4\\cdot2^{-1}}$.\n\n1. Step 1: Power of a power: $(2^2)^3=2^{2\\cdot3}=2^6$.\n2. Step 2: Numerator: $2^5\\cdot2^6=2^{5+6}=2^{11}$.\n3. Step 3: Denominator: $2^4\\cdot2^{-1}=2^{4+(-1)}=2^3$.\n4. Step 4: Divide: $2^{11}\\div2^3=2^{11-3}=2^8=256$.\n\n**Remember:**\n\n- Turn everything into one power of the same base, one rule at a time.\n- To compare powers, write them with the same base or work out each value. A bigger base does not always give the bigger power: $2^5=32$ is greater than $5^2=25$.',
                'Sederhanakan $\\frac{2^5\\cdot(2^2)^3}{2^4\\cdot2^{-1}}$.\n\n1. Langkah 1: Pangkat dari pangkat: $(2^2)^3=2^{2\\cdot3}=2^6$.\n2. Langkah 2: Pembilang: $2^5\\cdot2^6=2^{5+6}=2^{11}$.\n3. Langkah 3: Penyebut: $2^4\\cdot2^{-1}=2^{4+(-1)}=2^3$.\n4. Langkah 4: Bagi: $2^{11}\\div2^3=2^{11-3}=2^8=256$.\n\n**Ingat:**\n\n- Ubah semuanya menjadi satu pangkat dengan basis yang sama, satu aturan setiap kali.\n- Untuk membandingkan bilangan berpangkat, samakan basisnya atau hitung nilai masing-masing. Basis yang lebih besar belum tentu memberi hasil lebih besar: $2^5=32$ lebih besar dari $5^2=25$.',
              ),
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Signs and Sums', 'Awas, Jebakan!: Tanda dan Penjumlahan'),
              body: L(
                'Powers have three classic traps.\n\n| Wrong | Right |\n|---|---|\n| $-2^2=4$ | $-2^2=-(2\\times2)=-4$. Only with brackets is the sign squared: $(-2)^2=4$ |\n| $2^3\\cdot2^4=2^{12}$ (the exponents were multiplied) | $2^3\\cdot2^4=2^7$ (the exponents are added) |\n| $2^3+2^4=2^7$ (the exponents were added in a sum) | $2^3+2^4=8+16=24$ (the rules do not combine a sum) |',
                'Pangkat punya tiga jebakan klasik.\n\n| Salah | Benar |\n|---|---|\n| $-2^2=4$ | $-2^2=-(2\\times2)=-4$. Hanya jika memakai kurung tandanya ikut dikuadratkan: $(-2)^2=4$ |\n| $2^3\\cdot2^4=2^{12}$ (eksponennya dikalikan) | $2^3\\cdot2^4=2^7$ (eksponennya dijumlahkan) |\n| $2^3+2^4=2^7$ (eksponen dijumlahkan pada sebuah jumlah) | $2^3+2^4=8+16=24$ (aturan pangkat tidak menggabungkan jumlah) |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The whole bar stands for 1. It is cut into equal parts and one part is coloured. Which power equals the coloured part?',
                'Seluruh batang menyatakan 1. Batang itu dipotong menjadi bagian-bagian sama besar dan satu bagian diwarnai. Pangkat mana yang sama dengan bagian berwarna?',
              ),
              figure: {
                ...fractionBars([{ parts: 8, shaded: 1 }]),
                caption: L('One bar cut into equal parts. The first part is coloured.', 'Satu batang dipotong menjadi bagian-bagian sama besar. Bagian pertama diwarnai.'),
              },
              options: [
                L('$2^{-3}$', '$2^{-3}$'),
                L('$-2^{3}$', '$-2^{3}$'),
                L('$2^{-8}$', '$2^{-8}$'),
                L('$2^{3}$', '$2^{3}$'),
              ],
              answer: 0,
              explain: L(
                'There are 8 parts, so the coloured part is $\\frac{1}{8}=\\frac{1}{2^3}=2^{-3}$. The power $-2^3=-8$ is negative, $2^{-8}$ copies the number of parts into the exponent, and $2^3=8$ is the reciprocal.',
                'Ada 8 bagian, jadi bagian berwarna adalah $\\frac{1}{8}=\\frac{1}{2^3}=2^{-3}$. Pangkat $-2^3=-8$ itu negatif, $2^{-8}$ menyalin banyak bagian ke dalam eksponen, dan $2^3=8$ adalah kebalikannya.',
              ),
              hint: L(
                'Count the parts and write the coloured part as a fraction. Then write the denominator as a power of 2.',
                'Hitung banyak bagian dan tulis bagian berwarna sebagai pecahan. Lalu tulis penyebutnya sebagai pangkat dari 2.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: simplify $2^3\\cdot2^4\\div2^5$. Add the exponents of the product, subtract the exponent of the quotient, and work out the power.',
                'Coba bersama: sederhanakan $2^3\\cdot2^4\\div2^5$. Jumlahkan eksponen pada perkalian, kurangkan eksponen pada pembagian, lalu hitung pangkatnya.',
              ),
              template: '3 + 4 = ___ \\quad 7 - 5 = ___ \\quad 2^{2} = ___',
              blanks: ['7', '2', '4'],
              explain: L(
                '$2^3\\cdot2^4=2^7$, then $2^7\\div2^5=2^2=4$.',
                '$2^3\\cdot2^4=2^7$, lalu $2^7\\div2^5=2^2=4$.',
              ),
              hint: L(
                'Multiplying powers with the same base adds the exponents. Dividing subtracts them.',
                'Mengalikan pangkat yang basisnya sama berarti menjumlahkan eksponen. Membagi berarti mengurangkannya.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
              options: [
                L('$3^{-2}=\\frac{1}{9}$', '$3^{-2}=\\frac{1}{9}$'),
                L('$(2^3)^2=2^6$', '$(2^3)^2=2^6$'),
                L('$4^0=0$', '$4^0=0$'),
                L('$2^3+2^2=2^5$', '$2^3+2^2=2^5$'),
              ],
              answer: [0, 1],
              explain: L(
                '$3^{-2}=\\frac{1}{3^2}=\\frac{1}{9}$ and $(2^3)^2=2^{3\\cdot2}=2^6$. But $4^0=1$, and $2^3+2^2=8+4=12$, not $2^5=32$.',
                '$3^{-2}=\\frac{1}{3^2}=\\frac{1}{9}$ dan $(2^3)^2=2^{3\\cdot2}=2^6$. Namun $4^0=1$, dan $2^3+2^2=8+4=12$, bukan $2^5=32$.',
              ),
              hint: L(
                'Check each statement with the rule from the table. A power of a power multiplies exponents; a sum cannot use the rules.',
                'Periksa tiap pernyataan dengan aturan pada tabel. Pangkat dari pangkat mengalikan eksponen; sebuah jumlah tidak bisa memakai aturan itu.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L('Which of these numbers is the greatest?', 'Manakah bilangan yang paling besar?'),
              options: [
                L('$2^5$', '$2^5$'),
                L('$5^2$', '$5^2$'),
                L('$3^3$', '$3^3$'),
                L('$10^1$', '$10^1$'),
              ],
              answer: 0,
              explain: L(
                '$2^5=32$, $3^3=27$, $5^2=25$ and $10^1=10$. The biggest base, 10, has the smallest exponent, so it gives the smallest value.',
                '$2^5=32$, $3^3=27$, $5^2=25$, dan $10^1=10$. Basis terbesar, yaitu 10, punya eksponen terkecil, jadi nilainya paling kecil.',
              ),
              hint: L(
                'Work out each power as an ordinary number before you compare. Do not judge by the base alone.',
                'Hitung tiap pangkat menjadi bilangan biasa sebelum membandingkan. Jangan menilai dari basisnya saja.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'A lab starts with 5 bacteria. The number doubles every hour. How many bacteria are there after 6 hours?',
                'Sebuah laboratorium memulai dengan 5 bakteri. Jumlahnya menjadi dua kali lipat setiap jam. Berapa bakteri setelah 6 jam?',
              ),
              blanks: [{ answer: 320, after: { en: '\\text{ bacteria}', id: '\\text{ bakteri}' } }],
              hints: [
                L(
                  'Each hour the number is multiplied by 2. How many times is that in 6 hours?',
                  'Setiap jam jumlahnya dikali 2. Berapa kali perkalian itu dalam 6 jam?',
                ),
                L(
                  'After 6 hours the number is $5\\times2^6$.',
                  'Setelah 6 jam jumlahnya adalah $5\\times2^6$.',
                ),
                L(
                  'Work out $2^6$ first, then multiply it by 5.',
                  'Hitung $2^6$ dulu, lalu kalikan dengan 5.',
                ),
              ],
              explain: L(
                '$2^6=64$, so there are $5\\times64=320$ bacteria.',
                '$2^6=64$, jadi ada $5\\times64=320$ bakteri.',
              ),
              solution: ['5\\times2^6', '2^6=64', '5\\times64=320'],
            },
          ],
        },
        /* ----------------------------------------- S2 L2 roots and scientific notation */
        {
          id: 'tka-smp-m1-s2-l2',
          title: L('Roots, Irrational Numbers and Scientific Notation', 'Akar, Bilangan Irasional, dan Notasi Ilmiah'),
          goal: L(
            'You can find and estimate roots, simplify a square root, tell rational from irrational numbers, and use scientific notation.',
            'Kamu bisa menentukan dan menaksir akar, menyederhanakan akar kuadrat, membedakan bilangan rasional dan irasional, serta memakai notasi ilmiah.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Roots and Where They Sit', 'Ayo Amati: Akar dan Letaknya'),
              body: L(
                'A square garden has an area of 49 square metres. Its side is $\\sqrt{49}=7$ m, because $7^2=49$.\n\n- The **square root** $\\sqrt{n}$ is the non-negative number whose square is $n$. The **perfect squares** are 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, ...\n- The **cube root** $\\sqrt[3]{n}$ is the number whose cube is $n$: $\\sqrt[3]{27}=3$ because $3^3=27$, and $\\sqrt[3]{64}=4$.\n- To **estimate** $\\sqrt{20}$, find the perfect squares around 20: $16<20<25$, so $4<\\sqrt{20}<5$. It is a little less than 4.5.\n\nOn the number line, $\\sqrt{20}$ (the red dot) sits inside the green stretch between 4 and 5.',
                'Sebuah kebun berbentuk persegi luasnya 49 meter persegi. Panjang sisinya $\\sqrt{49}=7$ m, karena $7^2=49$.\n\n- **Akar kuadrat** $\\sqrt{n}$ adalah bilangan tak negatif yang kuadratnya $n$. **Bilangan kuadrat sempurna** adalah 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, ...\n- **Akar pangkat tiga** $\\sqrt[3]{n}$ adalah bilangan yang pangkat tiganya $n$: $\\sqrt[3]{27}=3$ karena $3^3=27$, dan $\\sqrt[3]{64}=4$.\n- Untuk **menaksir** $\\sqrt{20}$, cari bilangan kuadrat sempurna di sekitar 20: $16<20<25$, jadi $4<\\sqrt{20}<5$. Nilainya sedikit kurang dari 4,5.\n\nPada garis bilangan, $\\sqrt{20}$ (titik merah) berada di dalam bagian hijau di antara 4 dan 5.',
              ),
              figure: {
                ...numberLine({
                  from: 0,
                  to: 6,
                  step: 1,
                  shade: [4, 5],
                  marks: [{ at: Math.sqrt(20), color: 'result', label: '√20' }],
                }),
                caption: L(
                  'The square root of 20 lies between the whole numbers 4 and 5.',
                  'Akar kuadrat 20 terletak di antara bilangan bulat 4 dan 5.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Simplifying and Telling Numbers Apart', 'Contoh Bertahap: Menyederhanakan dan Membedakan Bilangan'),
              body: L(
                'Simplify $\\sqrt{12}$ by pulling out a perfect square.\n\n1. Step 1: Find the biggest perfect square that divides 12. It is 4, because $12=4\\times3$.\n2. Step 2: Split the root: $\\sqrt{12}=\\sqrt{4}\\times\\sqrt{3}$.\n3. Step 3: Take the root of the perfect square: $\\sqrt{4}=2$.\n4. Step 4: Write the result: $\\sqrt{12}=2\\sqrt{3}$.\n\nThe rule is $\\sqrt{a\\times b}=\\sqrt{a}\\times\\sqrt{b}$ for $a,b\\geq0$. Now compare two kinds of number:\n\n- **Rational:** can be written as $\\frac{a}{b}$. This includes integers, fractions, ending decimals, repeating decimals such as $0.\\overline{3}$, and roots of perfect squares such as $\\sqrt{49}=7$.\n- **Irrational:** the decimal never ends and never repeats. Examples are $\\sqrt{2}=1.41421\\ldots$, $\\sqrt{3}$ and $\\pi=3.14159\\ldots$.',
                'Sederhanakan $\\sqrt{12}$ dengan mengeluarkan bilangan kuadrat sempurna.\n\n1. Langkah 1: Cari bilangan kuadrat sempurna terbesar yang membagi 12. Itu 4, karena $12=4\\times3$.\n2. Langkah 2: Pecah akarnya: $\\sqrt{12}=\\sqrt{4}\\times\\sqrt{3}$.\n3. Langkah 3: Tarik akar dari bilangan kuadrat sempurna: $\\sqrt{4}=2$.\n4. Langkah 4: Tulis hasilnya: $\\sqrt{12}=2\\sqrt{3}$.\n\nAturannya adalah $\\sqrt{a\\times b}=\\sqrt{a}\\times\\sqrt{b}$ untuk $a,b\\geq0$. Sekarang bandingkan dua jenis bilangan:\n\n- **Rasional:** dapat ditulis sebagai $\\frac{a}{b}$. Termasuk bilangan bulat, pecahan, desimal berakhir, desimal berulang seperti $0{,}\\overline{3}$, dan akar dari bilangan kuadrat sempurna seperti $\\sqrt{49}=7$.\n- **Irasional:** desimalnya tidak pernah berakhir dan tidak pernah berulang. Contohnya $\\sqrt{2}=1{,}41421\\ldots$, $\\sqrt{3}$, dan $\\pi=3{,}14159\\ldots$.',
              ),
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: Scientific Notation', 'Contoh Bertahap: Notasi Ilmiah'),
              body: L(
                'The distance from the Earth to the Sun is about 150,000,000 km, and a hydrogen atom is about 0.0000000001 m wide. **Scientific notation** writes such numbers as $a\\times10^n$ with $1\\leq a<10$ and $n$ an integer.\n\n| Number | Scientific notation | What happened |\n|---|---|---|\n| $6\\,000\\,000$ | $6\\times10^{6}$ | the point moved 6 places left |\n| $150\\,000\\,000$ | $1.5\\times10^{8}$ | the point moved 8 places left |\n| $0.00032$ | $3.2\\times10^{-4}$ | the point moved 4 places right |\n\n- A big number has a positive exponent. A number between 0 and 1 has a negative exponent.\n- To multiply, multiply the coefficients and add the exponents: $(3\\times10^4)\\times(2\\times10^5)=6\\times10^9$. If the coefficient reaches 10 or more, adjust it: $20\\times10^5=2\\times10^6$.\n- To compare, look at the exponents first, then at the coefficients.',
                'Jarak dari Bumi ke Matahari sekitar 150.000.000 km, dan lebar sebuah atom hidrogen sekitar 0,0000000001 m. **Notasi ilmiah** menulis bilangan seperti itu sebagai $a\\times10^n$ dengan $1\\leq a<10$ dan $n$ bilangan bulat.\n\n| Bilangan | Notasi ilmiah | Apa yang terjadi |\n|---|---|---|\n| $6\\,000\\,000$ | $6\\times10^{6}$ | koma digeser 6 tempat ke kiri |\n| $150\\,000\\,000$ | $1{,}5\\times10^{8}$ | koma digeser 8 tempat ke kiri |\n| $0{,}00032$ | $3{,}2\\times10^{-4}$ | koma digeser 4 tempat ke kanan |\n\n- Bilangan besar punya eksponen positif. Bilangan di antara 0 dan 1 punya eksponen negatif.\n- Untuk mengalikan, kalikan koefisiennya dan jumlahkan eksponennya: $(3\\times10^4)\\times(2\\times10^5)=6\\times10^9$. Jika koefisien mencapai 10 atau lebih, sesuaikan: $20\\times10^5=2\\times10^6$.\n- Untuk membandingkan, lihat eksponennya dulu, baru koefisiennya.',
              ),
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Roots of Sums and Wrong Coefficients', 'Awas, Jebakan!: Akar dari Jumlah dan Koefisien yang Salah'),
              body: L(
                'Three mistakes appear again and again.\n\n| Wrong | Right |\n|---|---|\n| $\\sqrt{9+16}=\\sqrt{9}+\\sqrt{16}=7$ | $\\sqrt{9+16}=\\sqrt{25}=5$ (a root does not split over a sum) |\n| $25\\times10^{4}$ is scientific notation | $25\\times10^4=2.5\\times10^5$ (the coefficient must be at least 1 and less than 10) |\n| $0.0004=4\\times10^{4}$ | $0.0004=4\\times10^{-4}$ (a small number gets a negative exponent) |',
                'Tiga kesalahan ini muncul berulang kali.\n\n| Salah | Benar |\n|---|---|\n| $\\sqrt{9+16}=\\sqrt{9}+\\sqrt{16}=7$ | $\\sqrt{9+16}=\\sqrt{25}=5$ (akar tidak bisa dipecah pada penjumlahan) |\n| $25\\times10^{4}$ adalah notasi ilmiah | $25\\times10^4=2{,}5\\times10^5$ (koefisien harus minimal 1 dan kurang dari 10) |\n| $0{,}0004=4\\times10^{4}$ | $0{,}0004=4\\times10^{-4}$ (bilangan kecil mendapat eksponen negatif) |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The red dot is on the number line. Which number does it show?',
                'Titik merah ada pada garis bilangan. Bilangan berapa yang ditunjukkannya?',
              ),
              figure: {
                ...numberLine({ from: 4, to: 7, step: 1, marks: [{ at: Math.sqrt(30), color: 'result' }] }),
                caption: L('A red dot between two whole numbers.', 'Sebuah titik merah di antara dua bilangan bulat.'),
              },
              options: [
                L('$\\sqrt{30}$', '$\\sqrt{30}$'),
                L('$\\sqrt{25}$', '$\\sqrt{25}$'),
                L('$\\sqrt{40}$', '$\\sqrt{40}$'),
                L('$\\sqrt{20}$', '$\\sqrt{20}$'),
              ],
              answer: 0,
              explain: L(
                'The dot is between 5 and 6, and $5^2=25<30<36=6^2$, so it shows $\\sqrt{30}$. The value $\\sqrt{25}=5$ would sit exactly on 5, $\\sqrt{20}$ is between 4 and 5, and $\\sqrt{40}$ is between 6 and 7.',
                'Titik itu ada di antara 5 dan 6, dan $5^2=25<30<36=6^2$, jadi titik itu menunjukkan $\\sqrt{30}$. Nilai $\\sqrt{25}=5$ tepat berada di 5, $\\sqrt{20}$ ada di antara 4 dan 5, dan $\\sqrt{40}$ ada di antara 6 dan 7.',
              ),
              hint: L(
                'Read the two whole numbers around the dot, then square them. Which number under the root fits between those squares?',
                'Baca dua bilangan bulat di sekitar titik, lalu kuadratkan keduanya. Bilangan di bawah akar yang mana yang terletak di antara kedua kuadrat itu?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: simplify $\\sqrt{12}$. First write 12 as a perfect square times another number, then take the root of the perfect square.',
                'Coba bersama: sederhanakan $\\sqrt{12}$. Pertama tulis 12 sebagai kuadrat sempurna dikali bilangan lain, lalu tarik akar dari kuadrat sempurna itu.',
              ),
              template: '12 = ___ \\times 3 \\quad \\sqrt{4} = ___',
              blanks: ['4', '2'],
              explain: L(
                '$12=4\\times3$ and $\\sqrt{4}=2$, so $\\sqrt{12}=\\sqrt{4}\\times\\sqrt{3}=2\\sqrt{3}$.',
                '$12=4\\times3$ dan $\\sqrt{4}=2$, jadi $\\sqrt{12}=\\sqrt{4}\\times\\sqrt{3}=2\\sqrt{3}$.',
              ),
              hint: L(
                'Which perfect square (4, 9, 16, ...) divides 12?',
                'Kuadrat sempurna mana (4, 9, 16, ...) yang membagi 12?',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
              statements: [
                L('$\\sqrt{2}$ is an irrational number.', '$\\sqrt{2}$ adalah bilangan irasional.'),
                L('A repeating decimal such as $0.\\overline{27}$ is a rational number.', 'Desimal berulang seperti $0{,}\\overline{27}$ adalah bilangan rasional.'),
                L('$\\sqrt{9}+\\sqrt{16}=\\sqrt{25}$', '$\\sqrt{9}+\\sqrt{16}=\\sqrt{25}$'),
                L('$\\sqrt[3]{64}=8$', '$\\sqrt[3]{64}=8$'),
              ],
              answer: [true, true, false, false],
              explain: L(
                'The decimal of $\\sqrt{2}$ never ends and never repeats, so it is irrational. A repeating decimal is a fraction in disguise: $0.\\overline{27}=\\frac{3}{11}$. But $\\sqrt{9}+\\sqrt{16}=3+4=7$ while $\\sqrt{25}=5$, and $\\sqrt[3]{64}=4$ because $4^3=64$ (8 is the square root).',
                'Desimal $\\sqrt{2}$ tidak pernah berakhir dan tidak pernah berulang, jadi irasional. Desimal berulang adalah pecahan yang menyamar: $0{,}\\overline{27}=\\frac{3}{11}$. Namun $\\sqrt{9}+\\sqrt{16}=3+4=7$ sedangkan $\\sqrt{25}=5$, dan $\\sqrt[3]{64}=4$ karena $4^3=64$ (8 adalah akar kuadratnya).',
              ),
              hint: L(
                'For the sum of roots, work out each root first and add. For the cube root, ask which number multiplied by itself three times gives 64.',
                'Untuk jumlah akar, hitung tiap akar dulu lalu jumlahkan. Untuk akar pangkat tiga, tanyakan bilangan mana yang dikalikan tiga kali dengan dirinya sendiri menghasilkan 64.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'A red blood cell is about 0.000007 m wide. Which is its width in scientific notation?',
                'Lebar sebuah sel darah merah sekitar 0,000007 m. Manakah lebarnya dalam notasi ilmiah?',
              ),
              options: [
                L('$7\\times10^{-6}$ m', '$7\\times10^{-6}$ m'),
                L('$7\\times10^{6}$ m', '$7\\times10^{6}$ m'),
                L('$7\\times10^{-5}$ m', '$7\\times10^{-5}$ m'),
                L('$7\\times10^{-7}$ m', '$7\\times10^{-7}$ m'),
              ],
              answer: 0,
              explain: L(
                'The point moves 6 places to the right to reach 7, so the exponent is $-6$. A positive exponent would make the number huge, and $-5$ or $-7$ moves the point one place too few or too many.',
                'Koma digeser 6 tempat ke kanan sampai menjadi 7, jadi eksponennya $-6$. Eksponen positif akan membuat bilangan itu sangat besar, dan $-5$ atau $-7$ menggeser koma satu tempat terlalu sedikit atau terlalu banyak.',
              ),
              hint: L(
                'Count the places the decimal point must move to the right so that exactly one non-zero digit is before it.',
                'Hitung berapa tempat koma harus digeser ke kanan sampai tepat ada satu angka bukan nol di depannya.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'A factory makes $2.5\\times10^{4}$ bottles every day. How many bottles does it make in 20 days? Write the answer in scientific notation $a\\times10^{n}$.',
                'Sebuah pabrik membuat $2{,}5\\times10^{4}$ botol setiap hari. Berapa botol yang dibuat dalam 20 hari? Tulis jawabanmu dalam notasi ilmiah $a\\times10^{n}$.',
              ),
              inline: true,
              blanks: [
                { label: { en: '\\text{coefficient } a =', id: '\\text{koefisien } a =' }, answer: 5 },
                { label: { en: '\\text{exponent } n =', id: '\\text{eksponen } n =' }, answer: 5 },
              ],
              hints: [
                L(
                  'Multiply $2.5\\times10^4$ by 20. You can write 20 as $2\\times10^1$.',
                  'Kalikan $2{,}5\\times10^4$ dengan 20. Kamu bisa menulis 20 sebagai $2\\times10^1$.',
                ),
                L(
                  'Multiply the coefficients and add the exponents.',
                  'Kalikan koefisiennya dan jumlahkan eksponennya.',
                ),
                L(
                  '$2.5\\times10^4\\times2\\times10^1=(2.5\\times2)\\times10^{4+1}$. Finish both parts and check that the coefficient is between 1 and 10.',
                  '$2{,}5\\times10^4\\times2\\times10^1=(2{,}5\\times2)\\times10^{4+1}$. Selesaikan kedua bagian dan periksa bahwa koefisiennya di antara 1 dan 10.',
                ),
              ],
              explain: L(
                '$2.5\\times10^4\\times20=50\\times10^4=5\\times10^5$, so the factory makes $5\\times10^5=500\\,000$ bottles.',
                '$2{,}5\\times10^4\\times20=50\\times10^4=5\\times10^5$, jadi pabrik membuat $5\\times10^5=500\\,000$ botol.',
              ),
              solution: {
                en: ['2.5\\times10^4\\times20=50\\times10^4', '50\\times10^4=5\\times10^1\\times10^4', '=5\\times10^5'],
                id: ['2{,}5\\times10^4\\times20=50\\times10^4', '50\\times10^4=5\\times10^1\\times10^4', '=5\\times10^5'],
              },
            },
          ],
        },
      ],
      project: {
        id: 'tka-smp-m1-s2-p',
        runtime: 'math',
        title: L('Powers, Roots and Scientific Notation', 'Pangkat, Akar, dan Notasi Ilmiah'),
        brief: L(
          'Simplify powers, work with very big numbers and measure a square field with a root.',
          'Sederhanakan pangkat, bekerja dengan bilangan yang sangat besar, dan ukur sebuah lahan persegi dengan akar.',
        ),
        requirements: [
          L('Use the laws of exponents, including zero and negative exponents.', 'Memakai hukum eksponen, termasuk eksponen nol dan negatif.'),
          L('Use roots, estimation and scientific notation in problems.', 'Memakai akar, penaksiran, dan notasi ilmiah dalam soal.'),
        ],
        hints: [
          L('Write every power with the same base, and add or subtract the exponents.', 'Tulis tiap pangkat dengan basis yang sama, lalu jumlahkan atau kurangkan eksponennya.'),
          L('Scientific notation: multiply the coefficients, add the exponents, then fix the coefficient if it is 10 or more.', 'Notasi ilmiah: kalikan koefisien, jumlahkan eksponen, lalu perbaiki koefisien jika 10 atau lebih.'),
          L('To simplify a root, look for the biggest perfect square factor. To estimate, square numbers near your guess.', 'Untuk menyederhanakan akar, cari faktor kuadrat sempurna terbesar. Untuk menaksir, kuadratkan bilangan di dekat tebakanmu.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L('Write each power as an ordinary number.', 'Tulis setiap pangkat sebagai bilangan biasa.'),
            inline: true,
            blanks: [
              { label: '2^{-3} =', answer: 1 / 8 },
              { label: '5^{0} =', answer: 1 },
            ],
            solution: ['2^{-3}=\\frac{1}{2^3}=\\frac{1}{8}', '5^0=1'],
          },
          {
            prompt: L(
              'Simplify. Write your answer using $x$, for example x^5 or 1/x^2.',
              'Sederhanakan. Tulis jawabanmu dengan $x$, misalnya x^5 atau 1/x^2.',
            ),
            given: '\\frac{(x^2)^3\\cdot x^{-4}}{x^5}',
            blanks: [{ label: '=', formula: '1/x^3', variable: 'x', domain: [0.5, 4] }],
            solution: ['(x^2)^3=x^6', 'x^6\\cdot x^{-4}=x^{6-4}=x^2', 'x^2\\div x^5=x^{2-5}=x^{-3}=\\frac{1}{x^3}'],
          },
          {
            prompt: L(
              'A town has $2\\times10^{5}$ residents. Each resident uses $1.5\\times10^{2}$ litres of water a day. Write the total number of litres used in one day in scientific notation $a\\times10^{n}$.',
              'Sebuah kota punya $2\\times10^{5}$ penduduk. Setiap penduduk memakai $1{,}5\\times10^{2}$ liter air sehari. Tulis total liter air yang dipakai dalam sehari dalam notasi ilmiah $a\\times10^{n}$.',
            ),
            inline: true,
            blanks: [
              { label: { en: '\\text{coefficient } a =', id: '\\text{koefisien } a =' }, answer: 3 },
              { label: { en: '\\text{exponent } n =', id: '\\text{eksponen } n =' }, answer: 7 },
            ],
            solution: {
              en: ['(2\\times10^5)\\times(1.5\\times10^2)=(2\\times1.5)\\times10^{5+2}', '=3\\times10^7'],
              id: ['(2\\times10^5)\\times(1{,}5\\times10^2)=(2\\times1{,}5)\\times10^{5+2}', '=3\\times10^7'],
            },
          },
          {
            prompt: L(
              'A square rice field has an area of 75 m$^2$. Its side is $a\\sqrt{b}$ metres, with $b$ as small as possible. Find $a$ and $b$. Then the perimeter of the field is between $n$ and $n+1$ metres. Find $n$.',
              'Sebuah petak sawah berbentuk persegi luasnya 75 m$^2$. Panjang sisinya $a\\sqrt{b}$ meter, dengan $b$ sekecil mungkin. Tentukan $a$ dan $b$. Lalu keliling sawah itu berada di antara $n$ dan $n+1$ meter. Tentukan $n$.',
            ),
            figure: {
              ...shape({
                pts: [[0, 0], [4, 0], [4, 4], [0, 4]],
                names: 'ABCD',
                rights: [0, 1, 2, 3],
                extra: [txt(2, 2, '75', 'lg', 'muted')],
              }),
              caption: L('A square field. Its area is written inside.', 'Sebuah petak persegi. Luasnya ditulis di dalamnya.'),
            },
            inline: true,
            blanks: [
              { label: 'a =', answer: 5 },
              { label: 'b =', answer: 3 },
              { label: 'n =', answer: 34 },
            ],
            solution: {
              en: [
                '75=25\\times3 \\quad s=\\sqrt{75}=\\sqrt{25}\\times\\sqrt{3}=5\\sqrt{3}',
                '\\text{perimeter}=4\\times5\\sqrt{3}=20\\sqrt{3}',
                '(1.7)^2=2.89<3<3.0625=(1.75)^2 \\Rightarrow 1.7<\\sqrt{3}<1.75',
                '34<20\\sqrt{3}<35 \\Rightarrow n=34',
              ],
              id: [
                '75=25\\times3 \\quad s=\\sqrt{75}=\\sqrt{25}\\times\\sqrt{3}=5\\sqrt{3}',
                '\\text{keliling}=4\\times5\\sqrt{3}=20\\sqrt{3}',
                '(1{,}7)^2=2{,}89<3<3{,}0625=(1{,}75)^2 \\Rightarrow 1{,}7<\\sqrt{3}<1{,}75',
                '34<20\\sqrt{3}<35 \\Rightarrow n=34',
              ],
            },
          },
        ],
      },
    },
  ],
}
