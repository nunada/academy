import type { Submodule } from '../types'
import { L, barChart, dot, line, lineChart, numberLine, pieChart, plane, solid } from './figs'

/** Module 9, submodule 1 — measures of centre and spread, and reading data
 *  displays. */

/** A box plot drawn above a number line. */
function boxPlot(o: { from: number; to: number; step: number; min: number; q1: number; med: number; q3: number; max: number }) {
  const base = numberLine({ from: o.from, to: o.to, step: o.step })
  const y0 = 0.7
  const y1 = 2
  const ym = (y0 + y1) / 2
  return {
    ...base,
    ySpan: [-2.2, 3] as [number, number],
    items: [
      ...base.items,
      solid([[o.q1, y0], [o.q3, y0], [o.q3, y1], [o.q1, y1]], 'a'),
      line([o.med, y0], [o.med, y1], 'result', { width: 4 }),
      line([o.min, ym], [o.q1, ym], 'muted', { width: 2.5 }),
      line([o.q3, ym], [o.max, ym], 'muted', { width: 2.5 }),
      line([o.min, y0 + 0.3], [o.min, y1 - 0.3], 'muted', { width: 2.5 }),
      line([o.max, y0 + 0.3], [o.max, y1 - 0.3], 'muted', { width: 2.5 }),
    ],
  }
}

export const m9s1: Submodule = {
  id: 'tka-sma-m9-s1',
  title: L('Describing and Displaying Data', 'Menggambarkan dan Menyajikan Data'),
  summary: L(
    'Find the mean, median, mode, quartiles and spread of data, and read frequency tables, histograms, pie charts and scatter plots.',
    'Mencari rata-rata, median, modus, kuartil, dan ukuran sebaran data, serta membaca tabel frekuensi, histogram, diagram lingkaran, dan diagram pencar.',
  ),
  lessons: [
    /* ------------------------------------------------ L1 centre and spread */
    {
      id: 'tka-sma-m9-s1-l1',
      title: L('Centre and Spread', 'Pusat dan Sebaran Data'),
      goal: L(
        'You can find the mean, median, mode, range and quartiles of a data set, a weighted mean, and a variance.',
        'Kamu bisa mencari rata-rata, median, modus, jangkauan, dan kuartil suatu data, rata-rata tertimbang, dan variansi.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: One Number for a Whole Set', 'Ayo Amati: Satu Bilangan untuk Seluruh Data'),
          body: L(
            'Seven students scored 2, 4, 4, 5, 7, 8 and 12 on a quiz (the bars). Three numbers describe the **centre**:\n\n- The **mean** is the sum divided by the count: $\\frac{2+4+4+5+7+8+12}{7}=\\frac{42}{7}=6$.\n- The **median** is the middle value of the **sorted** data: the 4th of 7 values, which is $5$. With an even count, take the average of the two middle values.\n- The **mode** is the most frequent value: $4$.\n\nThe **range** is the biggest minus the smallest: $12-2=10$.\n\nThe mean (6) is pulled up by the high score 12, while the median (5) is not.',
            'Tujuh siswa mendapat nilai 2, 4, 4, 5, 7, 8, dan 12 pada sebuah kuis (batang-batang). Tiga bilangan menggambarkan **pusat** data:\n\n- **Rata-rata** (mean) adalah jumlah dibagi banyak data: $\\frac{2+4+4+5+7+8+12}{7}=\\frac{42}{7}=6$.\n- **Median** adalah nilai tengah dari data yang **terurut**: data ke-4 dari 7 data, yaitu $5$. Jika banyak datanya genap, ambil rata-rata dua nilai tengah.\n- **Modus** adalah nilai yang paling sering muncul: $4$.\n\n**Jangkauan** adalah nilai terbesar dikurangi nilai terkecil: $12-2=10$.\n\nRata-rata (6) tertarik naik oleh nilai tinggi 12, sedangkan median (5) tidak.',
          ),
          figure: {
            ...barChart({
              bars: [2, 4, 4, 5, 7, 8, 12].map((v, i) => ({ label: String(i + 1), value: v, color: v === 12 ? ('result' as const) : ('a' as const) })),
              max: 12,
              step: 4,
            }),
            caption: L('Seven scores. The tallest bar (red) pulls the mean up.', 'Tujuh nilai. Batang tertinggi (merah) menarik rata-rata naik.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Weighted Mean and Which Average to Use', 'Contoh Bertahap: Rata-rata Tertimbang dan Memilih Ukuran Pusat'),
          body: L(
            'When groups have different sizes, the average of the group means is **not** the overall mean. Use a **weighted mean**.\n\nClass A has 20 students with mean 70. Class B has 30 students with mean 80. The combined mean:\n\n1. Step 1: Total of A: $20\\times70=1\\,400$.\n2. Step 2: Total of B: $30\\times80=2\\,400$.\n3. Step 3: Combined: $\\frac{1\\,400+2\\,400}{50}=76$, not $\\frac{70+80}{2}=75$.\n\nWhich average?\n\n- The **mean** uses every value, but extreme values pull it.\n- The **median** is not affected by extreme values: good for house prices or incomes.\n- The **mode** suits categories, like the most common shoe size.',
            'Bila kelompok berukuran berbeda, rata-rata dari rata-rata kelompok **bukan** rata-rata keseluruhan. Pakai **rata-rata tertimbang**.\n\nKelas A punya 20 siswa dengan rata-rata 70. Kelas B punya 30 siswa dengan rata-rata 80. Rata-rata gabungannya:\n\n1. Langkah 1: Jumlah A: $20\\times70=1\\,400$.\n2. Langkah 2: Jumlah B: $30\\times80=2\\,400$.\n3. Langkah 3: Gabungan: $\\frac{1\\,400+2\\,400}{50}=76$, bukan $\\frac{70+80}{2}=75$.\n\nUkuran pusat mana?\n\n- **Rata-rata** memakai setiap nilai, tetapi nilai ekstrem menariknya.\n- **Median** tidak terpengaruh nilai ekstrem: cocok untuk harga rumah atau pendapatan.\n- **Modus** cocok untuk kategori, seperti ukuran sepatu yang paling umum.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Quartiles and Variance', 'Contoh Bertahap: Kuartil dan Variansi'),
          body: L(
            'The **quartiles** cut sorted data into four equal parts. For $2,4,4,5,7,8,12$:\n\n1. Step 1: The median is $Q_2=5$.\n2. Step 2: $Q_1$ is the median of the lower half $2,4,4$, so $Q_1=4$. $Q_3$ is the median of the upper half $7,8,12$, so $Q_3=8$.\n3. Step 3: The **interquartile range** is $\\text{IQR}=Q_3-Q_1=4$.\n\nThe box plot shows the minimum 2, $Q_1=4$, the median 5 (red line), $Q_3=8$ and the maximum 12.\n\nThe **variance** is the mean of the squared distances from the mean. For $2,4,6,8$ (mean 5): the distances are $-3,-1,1,3$, the squares are $9,1,1,9$, so the variance is $\\frac{20}{4}=5$ and the **standard deviation** is $\\sqrt{5}$.\n\n**Watch out:** adding the same number to every value moves the mean but does **not** change the range or the standard deviation.',
            '**Kuartil** membagi data terurut menjadi empat bagian sama banyak. Untuk $2,4,4,5,7,8,12$:\n\n1. Langkah 1: Mediannya $Q_2=5$.\n2. Langkah 2: $Q_1$ adalah median bagian bawah $2,4,4$, jadi $Q_1=4$. $Q_3$ adalah median bagian atas $7,8,12$, jadi $Q_3=8$.\n3. Langkah 3: **Jangkauan antarkuartil** $\\text{IQR}=Q_3-Q_1=4$.\n\nDiagram kotak-garis menunjukkan minimum 2, $Q_1=4$, median 5 (garis merah), $Q_3=8$, dan maksimum 12.\n\n**Variansi** adalah rata-rata kuadrat jarak dari rata-rata. Untuk $2,4,6,8$ (rata-rata 5): jaraknya $-3,-1,1,3$, kuadratnya $9,1,1,9$, jadi variansinya $\\frac{20}{4}=5$ dan **simpangan baku** $\\sqrt{5}$.\n\n**Awas:** menambah bilangan yang sama pada setiap nilai menggeser rata-rata tetapi **tidak** mengubah jangkauan atau simpangan baku.',
          ),
          figure: {
            ...boxPlot({ from: 0, to: 14, step: 2, min: 2, q1: 4, med: 5, q3: 8, max: 12 }),
            caption: L('A box plot of 2, 4, 4, 5, 7, 8, 12.', 'Diagram kotak-garis dari 2, 4, 4, 5, 7, 8, 12.'),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The bars show five scores: 2, 3, 5, 6 and 14. What is their mean?',
            'Batang-batang menunjukkan lima nilai: 2, 3, 5, 6, dan 14. Berapa rata-ratanya?',
          ),
          figure: {
            ...barChart({
              bars: [2, 3, 5, 6, 14].map((v, i) => ({ label: String(i + 1), value: v, color: (['a', 'b', 'c', 'result', 'a'] as const)[i] })),
              max: 14,
              step: 7,
            }),
            caption: L('Five scores.', 'Lima nilai.'),
          },
          options: [L('6', '6'), L('5', '5'), L('7', '7'), L('8', '8')],
          answer: 0,
          explain: L(
            '$\\frac{2+3+5+6+14}{5}=\\frac{30}{5}=6$. The value 5 is the median, and 8 is the midpoint of the smallest and the largest value, which is not the mean.',
            '$\\frac{2+3+5+6+14}{5}=\\frac{30}{5}=6$. Nilai 5 adalah median, dan 8 adalah titik tengah nilai terkecil dan terbesar, bukan rata-rata.',
          ),
          hint: L(
            'Add all five values, then divide by how many there are.',
            'Jumlahkan kelima nilai, lalu bagi dengan banyaknya.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: the mean of $2,4,4,5,7,8,12$.',
            'Coba bersama: rata-rata dari $2,4,4,5,7,8,12$.',
          ),
          template: '\\frac{2+4+4+5+7+8+12}{7}=\\frac{___}{7}=___',
          blanks: ['42', '6'],
          explain: L(
            'The sum is 42 and $42\\div7=6$.',
            'Jumlahnya 42 dan $42\\div7=6$.',
          ),
          hint: L(
            'Add the seven numbers first, then divide by 7.',
            'Jumlahkan tujuh bilangan itu dulu, lalu bagi 7.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('For the data $2,4,4,5,7,8,12$, choose the TWO true statements.', 'Untuk data $2,4,4,5,7,8,12$, pilih DUA pernyataan yang benar.'),
          options: [
            L('The median is 5.', 'Mediannya 5.'),
            L('The mode is 4.', 'Modusnya 4.'),
            L('The mean is 5.', 'Rata-ratanya 5.'),
            L('The range is 12.', 'Jangkauannya 12.'),
          ],
          answer: [0, 1],
          explain: L(
            'The mean is 6 (not 5) and the range is $12-2=10$ (not 12).',
            'Rata-ratanya 6 (bukan 5) dan jangkauannya $12-2=10$ (bukan 12).',
          ),
          hint: L(
            'Compute each one: mean from the sum, median from the middle, range from the biggest minus the smallest.',
            'Hitung masing-masing: rata-rata dari jumlah, median dari tengah, jangkauan dari terbesar dikurangi terkecil.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('The median is hardly affected by one very large value.', 'Median hampir tidak terpengaruh oleh satu nilai yang sangat besar.'),
            L('The mean is always one of the values in the data.', 'Rata-rata selalu salah satu nilai dalam data.'),
            L('$\\text{IQR}=Q_3-Q_1$.', '$\\text{IQR}=Q_3-Q_1$.'),
            L('If 3 is added to every value, the range increases by 3.', 'Jika 3 ditambahkan pada setiap nilai, jangkauan bertambah 3.'),
          ],
          answer: [true, false, true, false],
          explain: L(
            'The mean of 1 and 2 is 1.5, which is not in the data. Adding the same number shifts everything, so the biggest minus the smallest stays the same.',
            'Rata-rata 1 dan 2 adalah 1,5, yang tidak ada dalam data. Menambah bilangan yang sama menggeser semuanya, sehingga terbesar dikurangi terkecil tetap sama.',
          ),
          hint: L(
            'For the last statement, try the data 1, 2, 3 and 4, 5, 6.',
            'Untuk pernyataan terakhir, coba data 1, 2, 3 dan 4, 5, 6.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'Class A has 20 students with a mean score of 70. Class B has 30 students with a mean score of 80. What is the mean score of all 50 students?',
            'Kelas A punya 20 siswa dengan nilai rata-rata 70. Kelas B punya 30 siswa dengan nilai rata-rata 80. Berapa nilai rata-rata seluruh 50 siswa?',
          ),
          blanks: [{ answer: 76 }],
          hints: [
            L('Find the total score of each class first.', 'Cari dulu jumlah nilai tiap kelas.'),
            L('Class A: $20\\times70=1\\,400$. Class B: $30\\times80=2\\,400$.', 'Kelas A: $20\\times70=1\\,400$. Kelas B: $30\\times80=2\\,400$.'),
            L('Add the totals and divide by 50 students.', 'Jumlahkan total itu dan bagi dengan 50 siswa.'),
          ],
          explain: L(
            '$\\frac{1\\,400+2\\,400}{50}=\\frac{3\\,800}{50}=76$.',
            '$\\frac{1\\,400+2\\,400}{50}=\\frac{3\\,800}{50}=76$.',
          ),
          solution: ['20\\times70+30\\times80=1\\,400+2\\,400=3\\,800', '3\\,800\\div50=76'],
        },
      ],
    },
    /* --------------------------------------------------------- L2 displays */
    {
      id: 'tka-sma-m9-s1-l2',
      title: L('Reading Data Displays', 'Membaca Penyajian Data'),
      goal: L(
        'You can use a frequency table and grouped data to find a mean, and read pie charts and scatter plots.',
        'Kamu bisa memakai tabel frekuensi dan data berkelompok untuk mencari rata-rata, dan membaca diagram lingkaran dan diagram pencar.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: A Frequency Table as a Bar Chart', 'Ayo Amati: Tabel Frekuensi sebagai Diagram Batang'),
          body: L(
            'Ten students gave their test score. The bar chart shows how many students got each score:\n\n| Score $x$ | 5 | 6 | 7 | 8 | 9 |\n|---|---|---|---|---|---|\n| Frequency $f$ | 1 | 2 | 4 | 2 | 1 |\n\nThe total frequency is $\\sum f=10$. To find the mean, multiply each score by its frequency:\n\n$$\\bar{x}=\\frac{\\sum fx}{\\sum f}=\\frac{5\\cdot1+6\\cdot2+7\\cdot4+8\\cdot2+9\\cdot1}{10}=\\frac{70}{10}=7$$\n\nThe tallest bar is the **mode**, 7. For the median, the 5th and 6th values are both 7.',
            'Sepuluh siswa menyebutkan nilai ujiannya. Diagram batang menunjukkan berapa siswa yang mendapat tiap nilai:\n\n| Nilai $x$ | 5 | 6 | 7 | 8 | 9 |\n|---|---|---|---|---|---|\n| Frekuensi $f$ | 1 | 2 | 4 | 2 | 1 |\n\nFrekuensi total $\\sum f=10$. Untuk mencari rata-rata, kalikan tiap nilai dengan frekuensinya:\n\n$$\\bar{x}=\\frac{\\sum fx}{\\sum f}=\\frac{5\\cdot1+6\\cdot2+7\\cdot4+8\\cdot2+9\\cdot1}{10}=\\frac{70}{10}=7$$\n\nBatang tertinggi adalah **modus**, 7. Untuk median, nilai ke-5 dan ke-6 keduanya 7.',
          ),
          figure: {
            ...barChart({
              bars: [
                { label: '5', value: 1, color: 'a' },
                { label: '6', value: 2, color: 'b' },
                { label: '7', value: 4, color: 'result' },
                { label: '8', value: 2, color: 'c' },
                { label: '9', value: 1, color: 'a' },
              ],
              max: 4,
              step: 1,
            }),
            caption: L('How many students got each score.', 'Banyak siswa untuk tiap nilai.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Grouped Data', 'Contoh Bertahap: Data Berkelompok'),
          body: L(
            'When there are many values, they are grouped in **classes**. In a histogram the bars touch, and the height shows the frequency.\n\nTwenty people waited: 4 people for 0–10 minutes, 10 people for 10–20 minutes and 6 people for 20–30 minutes.\n\nTo **estimate** the mean, pretend everyone in a class is at the **class midpoint**: 5, 15 and 25.\n\n1. Step 1: $4\\times5+10\\times15+6\\times25=20+150+150=320$.\n2. Step 2: Estimated mean $=\\frac{320}{20}=16$ minutes.\n\nThe class with the highest bar (10–20) is the **modal class**. The answer is only an estimate, because we do not know where inside each class the values really are.\n\n**Spread of grouped data.** Use the same midpoints. The variance is $\\frac{\\sum f(m-\\bar{x})^2}{\\sum f}$ with $\\bar{x}=16$: $\\frac{4(-11)^2+10(-1)^2+6(9)^2}{20}=\\frac{484+10+486}{20}=49$. The standard deviation is $\\sqrt{49}=7$ minutes.',
            'Bila ada banyak nilai, nilai-nilai itu dikelompokkan dalam **kelas**. Pada histogram, batang-batangnya bersentuhan, dan tinggi batang menunjukkan frekuensi.\n\nDua puluh orang menunggu: 4 orang selama 0–10 menit, 10 orang selama 10–20 menit, dan 6 orang selama 20–30 menit.\n\nUntuk **menaksir** rata-rata, anggap semua orang dalam suatu kelas berada pada **titik tengah kelas**: 5, 15, dan 25.\n\n1. Langkah 1: $4\\times5+10\\times15+6\\times25=20+150+150=320$.\n2. Langkah 2: Rata-rata taksiran $=\\frac{320}{20}=16$ menit.\n\nKelas dengan batang tertinggi (10–20) adalah **kelas modus**. Jawabannya hanya taksiran, karena kita tidak tahu letak sebenarnya nilai-nilai di dalam tiap kelas.\n\n**Sebaran data berkelompok.** Pakai titik tengah yang sama. Variansinya $\\frac{\\sum f(m-\\bar{x})^2}{\\sum f}$ dengan $\\bar{x}=16$: $\\frac{4(-11)^2+10(-1)^2+6(9)^2}{20}=\\frac{484+10+486}{20}=49$. Simpangan bakunya $\\sqrt{49}=7$ menit.',
          ),
          figure: {
            ...barChart({
              bars: [
                { label: '0–10', value: 4, color: 'a' },
                { label: '10–20', value: 10, color: 'result' },
                { label: '20–30', value: 6, color: 'b' },
              ],
              max: 10,
              step: 5,
            }),
            caption: L('Waiting times in three classes.', 'Waktu tunggu dalam tiga kelas.'),
          },
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Pie Charts and Scatter Plots', 'Contoh Bertahap: Diagram Lingkaran dan Diagram Pencar'),
          body: L(
            '**Pie chart.** A slice that is $p\\%$ of the whole has a central angle of $\\frac{p}{100}\\times360^{\\circ}$. A $25\\%$ slice is $90^{\\circ}$, a $20\\%$ slice is $72^{\\circ}$. Going the other way, a slice of $54^{\\circ}$ is $\\frac{54}{360}=15\\%$.\n\n**Scatter plot.** Each pair of values is one dot.\n\n- If the dots rise from left to right, there is a **positive correlation**. If they fall, it is **negative**. If there is no pattern, there is **no correlation**.\n- A **line of best fit** passes close to the dots, with roughly equal numbers above and below. It need not pass through any dot.\n- Use the line to predict, but only inside the range of the data.\n\n**Watch out:** correlation does not prove cause. Ice-cream sales and sunburn both rise in summer, but one does not cause the other.',
            '**Diagram lingkaran.** Juring yang $p\\%$ dari keseluruhan bersudut pusat $\\frac{p}{100}\\times360^{\\circ}$. Juring $25\\%$ adalah $90^{\\circ}$, juring $20\\%$ adalah $72^{\\circ}$. Sebaliknya, juring $54^{\\circ}$ adalah $\\frac{54}{360}=15\\%$.\n\n**Diagram pencar.** Setiap pasang nilai adalah satu titik.\n\n- Jika titik-titik naik dari kiri ke kanan, ada **korelasi positif**. Jika turun, **negatif**. Jika tidak berpola, **tidak ada korelasi**.\n- **Garis kecocokan terbaik** melewati dekat titik-titik, dengan kira-kira sama banyak di atas dan di bawah. Garis itu tidak harus melalui satu titik pun.\n- Pakai garis itu untuk memprediksi, tetapi hanya di dalam rentang data.\n\n**Awas:** korelasi tidak membuktikan sebab. Penjualan es krim dan kulit terbakar sama-sama naik di musim panas, tetapi yang satu bukan penyebab yang lain.',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: 'x+1', from: 0, to: 7, color: 'muted', dashed: true },
                dot([1, 2], undefined, 'a'),
                dot([2, 3], undefined, 'a'),
                dot([3, 4], undefined, 'a'),
                dot([4, 4], undefined, 'a'),
                dot([5, 6], undefined, 'a'),
                dot([6, 7], undefined, 'a'),
              ],
              { x: [0, 8], y: [0, 9] },
            ),
            caption: L('A scatter plot with a positive correlation and a line of best fit.', 'Diagram pencar dengan korelasi positif dan garis kecocokan terbaik.'),
          },
        },
        {
          kind: 'concept',
          id: 'c4',
          title: L('Step by Step: Line Charts', 'Contoh Bertahap: Diagram Garis'),
          body: L(
            'A **line chart** joins points in order, so it shows how a value **changes** over time.\n\nThe chart shows the number of visitors (in hundreds) over five months: 20, 30, 25, 40, 50.\n\n- A line going **up** means an increase; going **down** means a decrease. The **steeper** the line, the faster the change.\n- Change between two months: subtract. From month 2 to 3: $25-30=-5$ (a fall). From month 3 to 4: $40-25=+15$, the biggest rise.\n- The overall trend is upward: from 20 to 50.\n- Read between the points only as an estimate, and be careful with predictions beyond the last point.\n\nCompare displays: a **bar chart** compares categories, a **line chart** follows time, a **pie chart** shows shares of a whole, and a **scatter plot** shows the relation between two variables.',
            '**Diagram garis** menghubungkan titik-titik secara berurutan, sehingga menunjukkan bagaimana suatu nilai **berubah** menurut waktu.\n\nDiagram menunjukkan banyak pengunjung (dalam ratusan) selama lima bulan: 20, 30, 25, 40, 50.\n\n- Garis yang **naik** berarti kenaikan; yang **turun** berarti penurunan. Makin **curam** garisnya, makin cepat perubahannya.\n- Perubahan antara dua bulan: kurangkan. Dari bulan 2 ke 3: $25-30=-5$ (turun). Dari bulan 3 ke 4: $40-25=+15$, kenaikan terbesar.\n- Kecenderungan keseluruhan naik: dari 20 menjadi 50.\n- Membaca di antara titik hanya berupa taksiran, dan berhati-hatilah dengan prediksi di luar titik terakhir.\n\nBandingkan penyajian: **diagram batang** membandingkan kategori, **diagram garis** mengikuti waktu, **diagram lingkaran** menunjukkan bagian dari keseluruhan, dan **diagram pencar** menunjukkan hubungan dua variabel.',
          ),
          figure: {
            ...lineChart({
              points: [20, 30, 25, 40, 50].map((v, i) => ({ label: String(i + 1), value: v })),
              max: 50,
              step: 10,
            }),
            caption: L('Visitors per month (in hundreds).', 'Pengunjung per bulan (dalam ratusan).'),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The pie chart shows how 200 people travel to work (percent of the whole). How many people take slice B?',
            'Diagram lingkaran menunjukkan cara 200 orang pergi ke tempat kerja (persen dari keseluruhan). Berapa orang yang memilih juring B?',
          ),
          figure: {
            ...pieChart({
              slices: [
                { label: 'A', value: 50 },
                { label: 'B', value: 30 },
                { label: 'C', value: 20 },
              ],
              unit: '%',
            }),
            caption: L('A pie chart with three slices.', 'Diagram lingkaran dengan tiga juring.'),
          },
          options: [L('60', '60'), L('30', '30'), L('50', '50'), L('6', '6')],
          answer: 0,
          explain: L(
            '$30\\%$ of $200=0.3\\times200=60$. The number 30 is the percentage, not the number of people.',
            '$30\\%$ dari $200=0{,}3\\times200=60$. Bilangan 30 adalah persentasenya, bukan banyak orang.',
          ),
          hint: L(
            'Find 30% of the total of 200 people.',
            'Cari 30% dari total 200 orang.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: the mean from the frequency table (scores 5 to 9 with frequencies 1, 2, 4, 2, 1).',
            'Coba bersama: rata-rata dari tabel frekuensi (nilai 5 sampai 9 dengan frekuensi 1, 2, 4, 2, 1).',
          ),
          template: '\\bar{x}=\\frac{5\\cdot1+6\\cdot2+7\\cdot4+8\\cdot2+9\\cdot1}{10}=\\frac{___}{10}=___',
          blanks: ['70', '7'],
          explain: L(
            '$5+12+28+16+9=70$, and $70\\div10=7$.',
            '$5+12+28+16+9=70$, dan $70\\div10=7$.',
          ),
          hint: L(
            'Add the five products first.',
            'Jumlahkan dulu kelima hasil kali itu.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L('The mean from a frequency table is $\\frac{\\sum fx}{\\sum f}$.', 'Rata-rata dari tabel frekuensi adalah $\\frac{\\sum fx}{\\sum f}$.'),
            L('A pie slice of 25% has a central angle of $90^{\\circ}$.', 'Juring 25% bersudut pusat $90^{\\circ}$.'),
            L('A correlation proves that one variable causes the other.', 'Korelasi membuktikan bahwa satu variabel menyebabkan yang lain.'),
            L('If $y$ falls as $x$ rises, the correlation is positive.', 'Jika $y$ turun saat $x$ naik, korelasinya positif.'),
          ],
          answer: [0, 1],
          explain: L(
            'Correlation shows a pattern, not a cause. And when $y$ falls as $x$ rises, the correlation is negative.',
            'Korelasi menunjukkan pola, bukan sebab. Dan bila $y$ turun saat $x$ naik, korelasinya negatif.',
          ),
          hint: L(
            'Picture the dots of a scatter plot: do they go up or down from left to right?',
            'Bayangkan titik pada diagram pencar: apakah naik atau turun dari kiri ke kanan?',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('For grouped data we estimate the mean with the class midpoints.', 'Untuk data berkelompok kita menaksir rata-rata dengan titik tengah kelas.'),
            L('A pie slice of 20% has a central angle of $20^{\\circ}$.', 'Juring 20% bersudut pusat $20^{\\circ}$.'),
            L('A positive correlation means the dots tend to rise from left to right.', 'Korelasi positif berarti titik-titik cenderung naik dari kiri ke kanan.'),
            L('A line of best fit must pass through every dot.', 'Garis kecocokan terbaik harus melalui setiap titik.'),
          ],
          answer: [true, false, true, false],
          explain: L(
            '20% of $360^{\\circ}$ is $72^{\\circ}$. A line of best fit follows the trend and need not touch any dot.',
            '20% dari $360^{\\circ}$ adalah $72^{\\circ}$. Garis kecocokan terbaik mengikuti kecenderungan dan tidak harus menyentuh satu titik pun.',
          ),
          hint: L(
            'A full circle is $360^{\\circ}$ and it stands for 100%.',
            'Satu lingkaran penuh adalah $360^{\\circ}$ dan mewakili 100%.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'Twenty people waited: 4 for 0–10 minutes, 10 for 10–20 minutes and 6 for 20–30 minutes. Use the class midpoints to estimate the mean waiting time, in minutes.',
            'Dua puluh orang menunggu: 4 orang selama 0–10 menit, 10 orang selama 10–20 menit, dan 6 orang selama 20–30 menit. Pakai titik tengah kelas untuk menaksir rata-rata waktu tunggu, dalam menit.',
          ),
          blanks: [{ answer: 16, after: '\\text{min}' }],
          hints: [
            L('The class midpoints are 5, 15 and 25.', 'Titik tengah kelasnya 5, 15, dan 25.'),
            L('Multiply each midpoint by its frequency and add: $4\\times5+10\\times15+6\\times25$.', 'Kalikan tiap titik tengah dengan frekuensinya lalu jumlahkan: $4\\times5+10\\times15+6\\times25$.'),
            L('The total is 320. Divide by the 20 people.', 'Totalnya 320. Bagi dengan 20 orang.'),
          ],
          explain: L(
            '$\\frac{20+150+150}{20}=\\frac{320}{20}=16$ minutes.',
            '$\\frac{20+150+150}{20}=\\frac{320}{20}=16$ menit.',
          ),
          solution: ['4\\times5+10\\times15+6\\times25=320', '320\\div20=16'],
        },
      ],
    },
  ],
  project: {
    id: 'tka-sma-m9-s1-p',
    runtime: 'math',
    title: L('Data at Work', 'Data dalam Pemakaian'),
    brief: L(
      'Find the centre and spread of data, a weighted mean, and read charts.',
      'Cari pusat dan sebaran data, rata-rata tertimbang, dan baca diagram.',
    ),
    requirements: [
      L('Compute the mean, median and quartiles.', 'Menghitung rata-rata, median, dan kuartil.'),
      L('Use frequency tables and pie charts.', 'Memakai tabel frekuensi dan diagram lingkaran.'),
    ],
    hints: [
      L('Sort the data first. The median splits it in half, and the quartiles split each half.', 'Urutkan data dulu. Median membaginya dua, dan kuartil membagi tiap bagian.'),
      L('Mean from a table: add the products $fx$, then divide by the total frequency.', 'Rata-rata dari tabel: jumlahkan hasil kali $fx$, lalu bagi dengan frekuensi total.'),
      L('A slice of $p\\%$ has the angle $\\frac{p}{100}\\times360^{\\circ}$.', 'Juring $p\\%$ bersudut $\\frac{p}{100}\\times360^{\\circ}$.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L(
          'For the data $4,6,6,8,9,11,12$, find the mean and the interquartile range.',
          'Untuk data $4,6,6,8,9,11,12$, tentukan rata-rata dan jangkauan antarkuartil.',
        ),
        figure: {
          ...boxPlot({ from: 2, to: 14, step: 2, min: 4, q1: 6, med: 8, q3: 11, max: 12 }),
          caption: L('A box plot of the data.', 'Diagram kotak-garis dari data.'),
        },
        inline: true,
        blanks: [
          { label: { en: '\\text{mean} =', id: '\\text{rata-rata} =' }, answer: 8 },
          { label: 'Q_3-Q_1 =', answer: 5 },
        ],
        solution: {
          en: ['\\text{mean}=\\frac{56}{7}=8', 'Q_1=6 \\quad Q_3=11 \\Rightarrow \\text{IQR}=5'],
          id: ['\\text{rata-rata}=\\frac{56}{7}=8', 'Q_1=6 \\quad Q_3=11 \\Rightarrow \\text{IQR}=5'],
        },
      },
      {
        prompt: L(
          'Three students scored 6, four scored 7 and three scored 8. Find the mean score.',
          'Tiga siswa mendapat nilai 6, empat siswa mendapat nilai 7, dan tiga siswa mendapat nilai 8. Tentukan nilai rata-ratanya.',
        ),
        blanks: [{ answer: 7 }],
        solution: ['\\frac{3\\cdot6+4\\cdot7+3\\cdot8}{10}=\\frac{70}{10}=7'],
      },
      {
        prompt: L(
          'In a pie chart a slice is 15% of the whole. What is its central angle, in degrees?',
          'Pada diagram lingkaran, sebuah juring adalah 15% dari keseluruhan. Berapa sudut pusatnya, dalam derajat?',
        ),
        blanks: [{ answer: 54, after: '^{\\circ}' }],
        solution: ['\\frac{15}{100}\\times360^{\\circ}=54^{\\circ}'],
      },
      {
        prompt: L(
          'The numbers 2, 4, 6 and 8 have mean 5. What number must be added so that the mean of the five numbers is 6?',
          'Bilangan 2, 4, 6, dan 8 punya rata-rata 5. Bilangan berapa yang harus ditambahkan agar rata-rata kelima bilangan menjadi 6?',
        ),
        blanks: [{ answer: 10 }],
        solution: ['\\frac{20+x}{5}=6', '20+x=30 \\Rightarrow x=10'],
      },
      {
        prompt: L(
          'The line chart shows visitors (in hundreds) over five months. What is the biggest rise between two consecutive months?',
          'Diagram garis menunjukkan pengunjung (dalam ratusan) selama lima bulan. Berapa kenaikan terbesar antara dua bulan berurutan?',
        ),
        figure: {
          ...lineChart({
            points: [20, 30, 25, 40, 50].map((v, i) => ({ label: String(i + 1), value: v })),
            max: 50,
            step: 10,
          }),
          caption: L('Visitors per month (in hundreds).', 'Pengunjung per bulan (dalam ratusan).'),
        },
        blanks: [{ answer: 15 }],
        solution: ['30-20=10 \\quad 25-30=-5', '40-25=15 \\quad 50-40=10', '\\max=15'],
      },
    ],
  },
}
