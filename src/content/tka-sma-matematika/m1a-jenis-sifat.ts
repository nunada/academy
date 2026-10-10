import type { Submodule } from '../types'
import { L, barChart, fractionBars, numberLine } from './figs'

/** Module 1, submodule 1 — the kinds of real numbers, and calculating with
 *  them in everyday settings: ratio, percent, interest. */

export const m1s1: Submodule = {
  id: 'tka-sma-m1-s1',
  title: L('Real Numbers and Their Uses', 'Bilangan Real dan Kegunaannya'),
  summary: L(
    'Sort numbers into integers, rationals and irrationals, write repeating decimals as fractions, use intervals, and calculate with ratio, percent and compound interest.',
    'Mengelompokkan bilangan menjadi bulat, rasional, dan irasional, menulis desimal berulang sebagai pecahan, memakai interval, serta menghitung dengan rasio, persen, dan bunga majemuk.',
  ),
  lessons: [
    /* ---------------------------------------------------- L1 kinds of real numbers */
    {
      id: 'tka-sma-m1-s1-l1',
      title: L('Kinds of Real Numbers', 'Jenis-Jenis Bilangan Real'),
      goal: L(
        'You can tell integers, rational and irrational numbers apart, turn a repeating decimal into a fraction, and write a set of numbers as an interval.',
        'Kamu bisa membedakan bilangan bulat, rasional, dan irasional, mengubah desimal berulang menjadi pecahan, dan menulis himpunan bilangan sebagai interval.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Numbers Between the Whole Numbers', 'Ayo Amati: Bilangan di Antara Bilangan Bulat'),
          body: L(
            'Every point on the number line is a **real number**. Some of them are easy to name and some are not.\n\n- **Integers:** $\\ldots,-2,-1,0,1,2,\\ldots$\n- **Rational numbers:** numbers that can be written as $\\frac{a}{b}$ with $a,b$ integers and $b\\neq0$, such as $\\frac{3}{4}$, $-\\frac{1}{2}$, $0.25$ and $5$. Every integer is rational.\n- **Irrational numbers:** real numbers that **cannot** be written like that, such as $\\sqrt{2}$ and $\\pi$.\n\nSo the sets are nested: integers $\\subset$ rationals $\\subset$ reals, and the irrationals fill the gaps. In the picture the dots show $-\\frac{3}{2}$ (rational), $\\sqrt{2}\\approx1.41$ and $\\pi\\approx3.14$ (both irrational).',
            'Setiap titik pada garis bilangan adalah **bilangan real**. Ada yang mudah diberi nama, ada yang tidak.\n\n- **Bilangan bulat:** $\\ldots,-2,-1,0,1,2,\\ldots$\n- **Bilangan rasional:** bilangan yang dapat ditulis sebagai $\\frac{a}{b}$ dengan $a,b$ bilangan bulat dan $b\\neq0$, seperti $\\frac{3}{4}$, $-\\frac{1}{2}$, $0{,}25$, dan $5$. Setiap bilangan bulat adalah rasional.\n- **Bilangan irasional:** bilangan real yang **tidak** dapat ditulis seperti itu, seperti $\\sqrt{2}$ dan $\\pi$.\n\nJadi himpunannya bersarang: bulat $\\subset$ rasional $\\subset$ real, dan bilangan irasional mengisi celah-celahnya. Pada gambar, titik-titik menunjukkan $-\\frac{3}{2}$ (rasional), $\\sqrt{2}\\approx1{,}41$ dan $\\pi\\approx3{,}14$ (keduanya irasional).',
          ),
          figure: {
            ...numberLine({
              from: -2,
              to: 4,
              step: 1,
              marks: [
                { at: -1.5, color: 'a', label: '-3/2' },
                { at: 1.414, color: 'b', label: '√2' },
                { at: 3.1416, color: 'result', label: 'π' },
              ],
            }),
            caption: L(
              'A rational point (green) and two irrational points (orange and red).',
              'Satu titik rasional (hijau) dan dua titik irasional (oranye dan merah).',
            ),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Rational or Irrational?', 'Contoh Bertahap: Rasional atau Irasional?'),
          body: L(
            'A decimal gives the quickest test.\n\n- If the decimal **ends** ($0.25$) or **repeats** ($0.\\overline{3}=0.333\\ldots$), the number is **rational**.\n- If the decimal goes on for ever with **no repeating block** ($\\sqrt{2}=1.41421\\ldots$, $\\pi=3.14159\\ldots$), it is **irrational**.\n- A square root of a number that is **not** a perfect square is irrational: $\\sqrt{9}=3$ is rational, $\\sqrt{10}$ is not.\n\n**Turning a repeating decimal into a fraction.** Write $x=0.\\overline{36}$.\n\n1. Step 1: The block has 2 digits, so multiply by 100: $100x=36.\\overline{36}$.\n2. Step 2: Subtract: $100x-x=36.\\overline{36}-0.\\overline{36}$, so $99x=36$.\n3. Step 3: Divide: $x=\\frac{36}{99}=\\frac{4}{11}$.',
            'Desimal memberi uji tercepat.\n\n- Jika desimalnya **berakhir** ($0{,}25$) atau **berulang** ($0{,}\\overline{3}=0{,}333\\ldots$), bilangannya **rasional**.\n- Jika desimalnya berlanjut tanpa henti dan **tanpa blok berulang** ($\\sqrt{2}=1{,}41421\\ldots$, $\\pi=3{,}14159\\ldots$), bilangannya **irasional**.\n- Akar dari bilangan yang **bukan** kuadrat sempurna adalah irasional: $\\sqrt{9}=3$ rasional, $\\sqrt{10}$ bukan.\n\n**Mengubah desimal berulang menjadi pecahan.** Tulis $x=0{,}\\overline{36}$.\n\n1. Langkah 1: Blok berulang punya 2 angka, jadi kalikan 100: $100x=36{,}\\overline{36}$.\n2. Langkah 2: Kurangkan: $100x-x=36{,}\\overline{36}-0{,}\\overline{36}$, sehingga $99x=36$.\n3. Langkah 3: Bagi: $x=\\frac{36}{99}=\\frac{4}{11}$.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Watch Out!: Intervals and Open Dots', 'Awas, Jebakan!: Interval dan Titik Kosong'),
          body: L(
            'A stretch of the number line is written as an **interval**.\n\n| Inequality | Interval | On the line |\n|---|---|---|\n| $-1\\le x<3$ | $[-1,3)$ | filled dot at $-1$, open dot at 3 |\n| $x>2$ | $(2,\\infty)$ | open dot at 2, going right |\n| $x\\le0$ | $(-\\infty,0]$ | filled dot at 0, going left |\n\nA **square bracket** or **filled dot** includes the end; a **round bracket** or **open dot** leaves it out. Infinity is never included, so it always has a round bracket.\n\nThe integers in $[-1,3)$ are $-1,0,1,2$. The number 3 is **not** one of them. Also, between two rational numbers there are infinitely many more rational **and** irrational numbers: the number line has no gaps.',
            'Sebagian garis bilangan ditulis sebagai **interval**.\n\n| Pertidaksamaan | Interval | Pada garis |\n|---|---|---|\n| $-1\\le x<3$ | $[-1,3)$ | titik penuh di $-1$, titik kosong di 3 |\n| $x>2$ | $(2,\\infty)$ | titik kosong di 2, ke kanan |\n| $x\\le0$ | $(-\\infty,0]$ | titik penuh di 0, ke kiri |\n\n**Kurung siku** atau **titik penuh** menyertakan ujungnya; **kurung biasa** atau **titik kosong** tidak menyertakannya. Tak hingga tidak pernah ikut, jadi selalu memakai kurung biasa.\n\nBilangan bulat dalam $[-1,3)$ adalah $-1,0,1,2$. Bilangan 3 **bukan** salah satunya. Di antara dua bilangan rasional ada tak hingga banyak bilangan rasional **dan** irasional: garis bilangan tidak punya celah.',
          ),
          figure: {
            ...numberLine({
              from: -3,
              to: 5,
              step: 1,
              shade: [-1, 3],
              marks: [
                { at: -1, color: 'a' },
                { at: 3, color: 'a', open: true },
              ],
            }),
            caption: L('The interval [-1, 3): filled at -1, open at 3.', 'Interval [-1, 3): penuh di -1, kosong di 3.'),
          },
        },
        {
          kind: 'concept',
          id: 'c4',
          title: L('Step by Step: Properties of the Operations', 'Contoh Bertahap: Sifat-Sifat Operasi'),
          body: L(
            'Real numbers follow rules that make calculation easier.\n\n| Property | Addition | Multiplication |\n|---|---|---|\n| **Commutative** (order) | $a+b=b+a$ | $a\\times b=b\\times a$ |\n| **Associative** (grouping) | $(a+b)+c=a+(b+c)$ | $(a\\times b)\\times c=a\\times(b\\times c)$ |\n| **Distributive** | $a\\times(b+c)=a\\times b+a\\times c$ | |\n| **Identity** | $a+0=a$ | $a\\times1=a$ |\n| **Inverse** | $a+(-a)=0$ | $a\\times\\frac{1}{a}=1$ ($a\\neq0$) |\n\nUse them to calculate by head:\n\n- $25\\times17\\times4=(25\\times4)\\times17=100\\times17=1\\,700$ (commutative and associative).\n- $18\\times99=18\\times(100-1)=1\\,800-18=1\\,782$ (distributive).\n\n**Watch out:** subtraction and division are **not** commutative or associative. $7-3\\neq3-7$, and $(8-4)-2=2$ but $8-(4-2)=6$.',
            'Bilangan real mengikuti aturan yang memudahkan perhitungan.\n\n| Sifat | Penjumlahan | Perkalian |\n|---|---|---|\n| **Komutatif** (urutan) | $a+b=b+a$ | $a\\times b=b\\times a$ |\n| **Asosiatif** (pengelompokan) | $(a+b)+c=a+(b+c)$ | $(a\\times b)\\times c=a\\times(b\\times c)$ |\n| **Distributif** | $a\\times(b+c)=a\\times b+a\\times c$ | |\n| **Identitas** | $a+0=a$ | $a\\times1=a$ |\n| **Invers** | $a+(-a)=0$ | $a\\times\\frac{1}{a}=1$ ($a\\neq0$) |\n\nPakai untuk menghitung di kepala:\n\n- $25\\times17\\times4=(25\\times4)\\times17=100\\times17=1\\,700$ (komutatif dan asosiatif).\n- $18\\times99=18\\times(100-1)=1\\,800-18=1\\,782$ (distributif).\n\n**Awas:** pengurangan dan pembagian **tidak** komutatif maupun asosiatif. $7-3\\neq3-7$, dan $(8-4)-2=2$ tetapi $8-(4-2)=6$.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The red dot marks $\\sqrt{10}$. Between which two consecutive integers does it lie?',
            'Titik merah menandai $\\sqrt{10}$. Di antara dua bilangan bulat berurutan manakah titik itu?',
          ),
          figure: {
            ...numberLine({ from: 0, to: 5, step: 1, marks: [{ at: 3.1623, color: 'result', label: '√10' }] }),
            caption: L('A point on the number line.', 'Sebuah titik pada garis bilangan.'),
          },
          options: [L('3 and 4', '3 dan 4'), L('2 and 3', '2 dan 3'), L('4 and 5', '4 dan 5'), L('9 and 11', '9 dan 11')],
          answer: 0,
          explain: L(
            '$3^2=9<10<16=4^2$, so $3<\\sqrt{10}<4$. The number 10 is not a perfect square, so $\\sqrt{10}$ is irrational.',
            '$3^2=9<10<16=4^2$, jadi $3<\\sqrt{10}<4$. Bilangan 10 bukan kuadrat sempurna, jadi $\\sqrt{10}$ irasional.',
          ),
          hint: L(
            'Square the integers near your guess and compare with 10.',
            'Kuadratkan bilangan bulat di dekat tebakanmu lalu bandingkan dengan 10.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: write $x=0.\\overline{6}$ as a fraction. One digit repeats, so multiply by 10 and subtract.',
            'Coba bersama: tulis $x=0{,}\\overline{6}$ sebagai pecahan. Satu angka berulang, jadi kalikan 10 lalu kurangkan.',
          ),
          template: '10x - x = 6 \\Rightarrow 9x = ___ \\Rightarrow x = 6 \\div ___ = \\frac{2}{3}',
          blanks: ['6', '9'],
          explain: L(
            '$10x=6.\\overline{6}$ and $x=0.\\overline{6}$, so $9x=6$ and $x=\\frac{6}{9}=\\frac{2}{3}$.',
            '$10x=6{,}\\overline{6}$ dan $x=0{,}\\overline{6}$, jadi $9x=6$ dan $x=\\frac{6}{9}=\\frac{2}{3}$.',
          ),
          hint: L(
            'After the subtraction the repeating tails cancel and only 6 is left on the right.',
            'Setelah dikurangkan, bagian berulangnya habis dan hanya tersisa 6 di ruas kanan.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO irrational numbers.', 'Pilih DUA bilangan irasional.'),
          options: [
            L('$\\sqrt{16}$', '$\\sqrt{16}$'),
            L('$\\sqrt{7}$', '$\\sqrt{7}$'),
            L('$\\pi$', '$\\pi$'),
            L('$\\frac{22}{7}$', '$\\frac{22}{7}$'),
          ],
          answer: [1, 2],
          explain: L(
            '$\\sqrt{16}=4$ and $\\frac{22}{7}$ are rational. $\\sqrt{7}$ is the root of a number that is not a perfect square, and $\\pi$ never repeats, so both are irrational. (22/7 only approximates $\\pi$.)',
            '$\\sqrt{16}=4$ dan $\\frac{22}{7}$ rasional. $\\sqrt{7}$ adalah akar dari bilangan yang bukan kuadrat sempurna, dan $\\pi$ tidak pernah berulang, jadi keduanya irasional. (22/7 hanya hampiran $\\pi$.)',
          ),
          hint: L(
            'Simplify each root first. Does the decimal end, repeat, or neither?',
            'Sederhanakan tiap akar dulu. Apakah desimalnya berakhir, berulang, atau tidak keduanya?',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('Every integer is a rational number.', 'Setiap bilangan bulat adalah bilangan rasional.'),
            L('The sum of two irrational numbers is always irrational.', 'Jumlah dua bilangan irasional selalu irasional.'),
            L('$\\sqrt{49}$ is irrational.', '$\\sqrt{49}$ irasional.'),
            L('$2\\sqrt{3}$ is irrational.', '$2\\sqrt{3}$ irasional.'),
          ],
          answer: [true, false, false, true],
          explain: L(
            'An integer $n=\\frac{n}{1}$ is rational. But $\\sqrt{2}+(-\\sqrt{2})=0$ is a sum of two irrationals that is rational. $\\sqrt{49}=7$ is rational. And $2\\sqrt{3}$ is a nonzero rational times an irrational, so it is irrational.',
            'Bilangan bulat $n=\\frac{n}{1}$ adalah rasional. Namun $\\sqrt{2}+(-\\sqrt{2})=0$ adalah jumlah dua bilangan irasional yang hasilnya rasional. $\\sqrt{49}=7$ rasional. Dan $2\\sqrt{3}$ adalah rasional tak nol kali irasional, jadi irasional.',
          ),
          hint: L(
            'To test the second statement, try $\\sqrt{2}$ and $-\\sqrt{2}$.',
            'Untuk menguji pernyataan kedua, coba $\\sqrt{2}$ dan $-\\sqrt{2}$.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'Find the sum of all integers $n$ with $-\\sqrt{20}<n<\\sqrt{30}$.',
            'Tentukan jumlah semua bilangan bulat $n$ dengan $-\\sqrt{20}<n<\\sqrt{30}$.',
          ),
          blanks: [{ answer: 5 }],
          hints: [
            L(
              'Find the integers just below and just above $\\sqrt{20}$ and $\\sqrt{30}$ by squaring.',
              'Cari bilangan bulat di sekitar $\\sqrt{20}$ dan $\\sqrt{30}$ dengan mengkuadratkan.',
            ),
            L(
              '$4^2=16<20<25=5^2$ and $5^2=25<30<36=6^2$. So $4<\\sqrt{20}<5$ and $5<\\sqrt{30}<6$.',
              '$4^2=16<20<25=5^2$ dan $5^2=25<30<36=6^2$. Jadi $4<\\sqrt{20}<5$ dan $5<\\sqrt{30}<6$.',
            ),
            L(
              'The integers run from $-4$ up to 5. Add them: the negatives cancel the positives.',
              'Bilangan bulatnya dari $-4$ sampai 5. Jumlahkan: yang negatif menghapus yang positif.',
            ),
          ],
          explain: L(
            '$-5<-\\sqrt{20}<-4$ and $5<\\sqrt{30}<6$, so $n=-4,-3,\\ldots,5$. The pairs $-4+4$, $-3+3$, $-2+2$, $-1+1$ and 0 give 0, leaving 5.',
            '$-5<-\\sqrt{20}<-4$ dan $5<\\sqrt{30}<6$, jadi $n=-4,-3,\\ldots,5$. Pasangan $-4+4$, $-3+3$, $-2+2$, $-1+1$ dan 0 berjumlah 0, tersisa 5.',
          ),
          solution: {
            en: ['4<\\sqrt{20}<5 \\quad 5<\\sqrt{30}<6', 'n=-4,-3,-2,-1,0,1,2,3,4,5', '\\text{sum}=5'],
            id: ['4<\\sqrt{20}<5 \\quad 5<\\sqrt{30}<6', 'n=-4,-3,-2,-1,0,1,2,3,4,5', '\\text{jumlah}=5'],
          },
        },
      ],
    },
    /* ------------------------------------------------- L2 ratio, percent, interest */
    {
      id: 'tka-sma-m1-s1-l2',
      title: L('Ratio, Percent and Interest', 'Rasio, Persen, dan Bunga'),
      goal: L(
        'You can share a quantity in a ratio, find percent change (also several in a row), and compute compound interest.',
        'Kamu bisa membagi suatu besaran menurut rasio, menghitung perubahan persen (juga beberapa kali berturut-turut), dan menghitung bunga majemuk.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Sharing in a Ratio', 'Ayo Amati: Membagi Menurut Rasio'),
          body: L(
            'Two friends put money into a shop in the ratio $2:3$. The bar below is cut into $2+3=5$ equal parts: the first friend owns 2 parts and the second owns 3.\n\n- A ratio $a:b$ splits a total $T$ into $\\frac{a}{a+b}T$ and $\\frac{b}{a+b}T$.\n- If the profit is Rp500,000, one part is $500\\,000\\div5=100\\,000$, so the shares are $2\\times100\\,000$ and $3\\times100\\,000$.\n- Equal ratios are proportional: $2:3=4:6=\\frac{2}{3}$.',
            'Dua sahabat menanam modal di sebuah toko dengan perbandingan $2:3$. Batang di bawah dibagi menjadi $2+3=5$ bagian sama: sahabat pertama memiliki 2 bagian dan yang kedua 3 bagian.\n\n- Rasio $a:b$ membagi total $T$ menjadi $\\frac{a}{a+b}T$ dan $\\frac{b}{a+b}T$.\n- Jika keuntungan Rp500.000, satu bagian adalah $500\\,000\\div5=100\\,000$, jadi bagiannya $2\\times100\\,000$ dan $3\\times100\\,000$.\n- Rasio yang sama itu sebanding: $2:3=4:6=\\frac{2}{3}$.',
          ),
          figure: {
            ...fractionBars([{ parts: 5, shaded: 2, label: '2 : 3', color: 'a' }]),
            caption: L(
              'One bar in 5 parts. The colored 2 parts belong to the first friend.',
              'Satu batang dalam 5 bagian. 2 bagian berwarna milik sahabat pertama.',
            ),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Percent Change', 'Contoh Bertahap: Perubahan Persen'),
          body: L(
            'A **percent change** multiplies by a factor.\n\n- Increase by $p\\%$: multiply by $1+\\frac{p}{100}$. Decrease by $p\\%$: multiply by $1-\\frac{p}{100}$.\n- Percent change $=\\frac{\\text{new}-\\text{old}}{\\text{old}}\\times100\\%$.\n\nA jacket costs Rp200,000. The price goes up 25% and then down 20%.\n\n1. Step 1: After the rise: $200\\,000\\times1.25=250\\,000$.\n2. Step 2: After the fall: $250\\,000\\times0.8=200\\,000$.\n3. Step 3: The factors combine: $1.25\\times0.8=1$. The price is back where it started.\n\n**Remember:** successive percents are **multiplied**, not added. A rise of 25% followed by a fall of 20% is not a change of $+5\\%$.',
            '**Perubahan persen** berarti mengalikan dengan suatu faktor.\n\n- Naik $p\\%$: kalikan dengan $1+\\frac{p}{100}$. Turun $p\\%$: kalikan dengan $1-\\frac{p}{100}$.\n- Persen perubahan $=\\frac{\\text{baru}-\\text{lama}}{\\text{lama}}\\times100\\%$.\n\nSebuah jaket harganya Rp200.000. Harganya naik 25% lalu turun 20%.\n\n1. Langkah 1: Setelah naik: $200\\,000\\times1{,}25=250\\,000$.\n2. Langkah 2: Setelah turun: $250\\,000\\times0{,}8=200\\,000$.\n3. Langkah 3: Faktornya digabung: $1{,}25\\times0{,}8=1$. Harganya kembali seperti semula.\n\n**Ingat:** persen berturut-turut **dikalikan**, bukan dijumlahkan. Naik 25% lalu turun 20% bukan perubahan $+5\\%$.',
          ),
          figure: {
            ...barChart({
              bars: [
                { label: '0', value: 200, color: 'a' },
                { label: '1', value: 250, color: 'b' },
                { label: '2', value: 200, color: 'c' },
              ],
              max: 300,
              step: 100,
              title: 'Rp×1000',
            }),
            caption: L('The price: start, after the rise, after the fall.', 'Harga: awal, setelah naik, setelah turun.'),
          },
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Compound Interest', 'Contoh Bertahap: Bunga Majemuk'),
          body: L(
            'With **compound interest** the interest of each year is added to the money, so the next year earns interest on a bigger amount.\n\n$$A=P\\left(1+\\frac{r}{100}\\right)^{n}$$\n\nwhere $P$ is the starting amount, $r\\%$ the yearly rate and $n$ the number of years.\n\nExample: Rp1,000,000 at 10% a year.\n\n1. Year 1: $1\\,000\\,000\\times1.1=1\\,100\\,000$.\n2. Year 2: $1\\,100\\,000\\times1.1=1\\,210\\,000$.\n3. Year 3: $1\\,210\\,000\\times1.1=1\\,331\\,000$.\n\n**Simple interest** would add the same Rp100,000 every year and give only Rp1,300,000 after 3 years. The bars grow faster and faster under compound interest.',
            'Pada **bunga majemuk**, bunga tiap tahun ditambahkan ke uang, sehingga tahun berikutnya berbunga dari jumlah yang lebih besar.\n\n$$A=P\\left(1+\\frac{r}{100}\\right)^{n}$$\n\ndengan $P$ jumlah awal, $r\\%$ bunga per tahun, dan $n$ banyak tahun.\n\nContoh: Rp1.000.000 dengan bunga 10% per tahun.\n\n1. Tahun 1: $1\\,000\\,000\\times1{,}1=1\\,100\\,000$.\n2. Tahun 2: $1\\,100\\,000\\times1{,}1=1\\,210\\,000$.\n3. Tahun 3: $1\\,210\\,000\\times1{,}1=1\\,331\\,000$.\n\n**Bunga tunggal** menambah Rp100.000 yang sama setiap tahun dan hanya memberi Rp1.300.000 setelah 3 tahun. Batang-batang tumbuh makin cepat pada bunga majemuk.',
          ),
          figure: {
            ...barChart({
              bars: [
                { label: '0', value: 1000, color: 'a' },
                { label: '1', value: 1100, color: 'b' },
                { label: '2', value: 1210, color: 'c' },
                { label: '3', value: 1331, color: 'result' },
              ],
              max: 1500,
              step: 500,
              title: 'Rp×1000',
            }),
            caption: L('The balance at the end of each year.', 'Saldo pada akhir tiap tahun.'),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'A phone costs Rp1,000,000. The shop raises the price by 20%, then gives a 20% discount. What is the final price?',
            'Sebuah ponsel harganya Rp1.000.000. Toko menaikkan harga 20%, lalu memberi diskon 20%. Berapa harga akhirnya?',
          ),
          figure: {
            ...barChart({
              bars: [
                { label: '0', value: 1000, color: 'a' },
                { label: '1', value: 1200, color: 'b' },
                { label: '2', value: 960, color: 'c' },
              ],
              max: 1500,
              step: 500,
              showValues: false,
              title: 'Rp×1000',
            }),
            caption: L('Price at the start, after the rise and after the discount.', 'Harga awal, setelah naik, dan setelah diskon.'),
          },
          options: [L('Rp960,000', 'Rp960.000'), L('Rp1,000,000', 'Rp1.000.000'), L('Rp1,040,000', 'Rp1.040.000'), L('Rp800,000', 'Rp800.000')],
          answer: 0,
          explain: L(
            '$1\\,000\\,000\\times1.2=1\\,200\\,000$, then $1\\,200\\,000\\times0.8=960\\,000$. The discount is taken from the bigger price, so the result is below the start.',
            '$1\\,000\\,000\\times1{,}2=1\\,200\\,000$, lalu $1\\,200\\,000\\times0{,}8=960\\,000$. Diskon diambil dari harga yang lebih besar, jadi hasilnya di bawah harga awal.',
          ),
          hint: L(
            'Do the two steps one after the other. The 20% off is of the new price, not the old one.',
            'Kerjakan dua langkah satu per satu. Diskon 20% itu dari harga yang baru, bukan harga lama.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: Rp1,000 at 10% compound interest. Find the balance after year 1 and after year 2.',
            'Coba bersama: Rp1.000 dengan bunga majemuk 10%. Cari saldo setelah tahun 1 dan setelah tahun 2.',
          ),
          template: {
            en: '1000\\times1.1=___ \\quad ___\\times1.1=___',
            id: '1000\\times1{,}1=___ \\quad ___\\times1{,}1=___',
          },
          blanks: ['1100', '1100', '1210'],
          explain: L(
            '$1000\\times1.1=1100$, and the second year starts from 1100: $1100\\times1.1=1210$.',
            '$1000\\times1{,}1=1100$, dan tahun kedua dimulai dari 1100: $1100\\times1{,}1=1210$.',
          ),
          hint: L(
            'The second line starts from the answer of the first.',
            'Baris kedua dimulai dari jawaban baris pertama.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO expressions that equal 30.', 'Pilih DUA ekspresi yang hasilnya 30.'),
          options: [
            L('$0.2\\times150$', '$0{,}2\\times150$'),
            L('$150\\div5$', '$150\\div5$'),
            L('$2\\%\\times150$', '$2\\%\\times150$'),
            L('$150-0.2\\times150$', '$150-0{,}2\\times150$'),
          ],
          answer: [0, 1],
          explain: L(
            '20% of 150 is $0.2\\times150=30$, and $150\\div5=30$ too (20% is one fifth). But 2% of 150 is 3, and $150-30=120$.',
            '20% dari 150 adalah $0{,}2\\times150=30$, dan $150\\div5=30$ juga (20% adalah seperlima). Namun 2% dari 150 adalah 3, dan $150-30=120$.',
          ),
          hint: L(
            'Work out each one. Watch the difference between 20% and 2%.',
            'Hitung masing-masing. Perhatikan beda antara 20% dan 2%.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('A rise of 10% followed by a fall of 10% gives back the original value.', 'Naik 10% lalu turun 10% mengembalikan nilai semula.'),
            L('Sharing 40 in the ratio $3:5$ gives parts 15 and 25.', 'Membagi 40 dengan rasio $3:5$ menghasilkan bagian 15 dan 25.'),
            L('Going from 50 to 75 is an increase of 50%.', 'Dari 50 menjadi 75 berarti naik 50%.'),
            L('After a 20% discount a shirt costs Rp80,000, so its old price was Rp96,000.', 'Setelah diskon 20% sebuah kemeja harganya Rp80.000, jadi harga lamanya Rp96.000.'),
          ],
          answer: [false, true, true, false],
          explain: L(
            '$1.1\\times0.9=0.99$, not 1. One part is $40\\div8=5$, so the parts are 15 and 25. $\\frac{75-50}{50}=50\\%$. And $80\\,000\\div0.8=100\\,000$, not 96,000.',
            '$1{,}1\\times0{,}9=0{,}99$, bukan 1. Satu bagian adalah $40\\div8=5$, jadi bagiannya 15 dan 25. $\\frac{75-50}{50}=50\\%$. Dan $80\\,000\\div0{,}8=100\\,000$, bukan 96.000.',
          ),
          hint: L(
            'For the discount, the new price is 80% of the old price, so divide to go back.',
            'Untuk diskon, harga baru adalah 80% dari harga lama, jadi bagi untuk kembali.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'Rp2,000,000 is saved at 5% compound interest a year. How many rupiah is the balance after 2 years?',
            'Uang Rp2.000.000 ditabung dengan bunga majemuk 5% per tahun. Berapa rupiah saldo setelah 2 tahun?',
          ),
          blanks: [{ label: 'Rp', answer: 2205000 }],
          hints: [
            L('Each year multiplies the balance by the same factor. What is that factor for 5%?', 'Setiap tahun saldo dikalikan faktor yang sama. Berapa faktor untuk 5%?'),
            L('The factor is $1.05$, and 2 years means multiplying twice: $2\\,000\\,000\\times1.05^2$.', 'Faktornya $1{,}05$, dan 2 tahun berarti mengalikan dua kali: $2\\,000\\,000\\times1{,}05^2$.'),
            L('$1.05^2=1.1025$. Multiply it by $2\\,000\\,000$.', '$1{,}05^2=1{,}1025$. Kalikan dengan $2\\,000\\,000$.'),
          ],
          explain: L(
            '$A=2\\,000\\,000\\times1.05^2=2\\,000\\,000\\times1.1025=2\\,205\\,000$.',
            '$A=2\\,000\\,000\\times1{,}05^2=2\\,000\\,000\\times1{,}1025=2\\,205\\,000$.',
          ),
          solution: {
            en: ['A=2\\,000\\,000\\times1.05^2', '=2\\,000\\,000\\times1.1025', '=2\\,205\\,000'],
            id: ['A=2\\,000\\,000\\times1{,}05^2', '=2\\,000\\,000\\times1{,}1025', '=2\\,205\\,000'],
          },
        },
      ],
    },
  ],
  project: {
    id: 'tka-sma-m1-s1-p',
    runtime: 'math',
    title: L('Real Numbers at Work', 'Bilangan Real dalam Pemakaian'),
    brief: L(
      'Place numbers on the line, change a repeating decimal to a fraction, and solve shop problems with ratio and percent.',
      'Letakkan bilangan pada garis, ubah desimal berulang menjadi pecahan, dan selesaikan soal toko dengan rasio dan persen.',
    ),
    requirements: [
      L('Compare roots and write intervals.', 'Membandingkan akar dan menulis interval.'),
      L('Use ratio, percent change and compound interest.', 'Memakai rasio, perubahan persen, dan bunga majemuk.'),
    ],
    hints: [
      L('To compare a root with an integer, square both.', 'Untuk membandingkan akar dengan bilangan bulat, kuadratkan keduanya.'),
      L('A repeating block of $k$ digits: multiply by $10^k$ and subtract.', 'Blok berulang dengan $k$ angka: kalikan $10^k$ lalu kurangkan.'),
      L('Successive percents multiply: write each as a factor.', 'Persen berturut-turut dikalikan: tulis tiap persen sebagai faktor.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L(
          'What is the smallest integer greater than $\\sqrt{50}$?',
          'Berapa bilangan bulat terkecil yang lebih besar dari $\\sqrt{50}$?',
        ),
        figure: {
          ...numberLine({ from: 5, to: 9, step: 1, marks: [{ at: 7.0711, color: 'result', label: '√50' }] }),
          caption: L('The point $\\sqrt{50}$ on the number line.', 'Titik $\\sqrt{50}$ pada garis bilangan.'),
        },
        blanks: [{ answer: 8 }],
        solution: {
          en: ['7^2=49<50<64=8^2', '7<\\sqrt{50}<8', '\\text{smallest integer}=8'],
          id: ['7^2=49<50<64=8^2', '7<\\sqrt{50}<8', '\\text{bilangan bulat terkecil}=8'],
        },
      },
      {
        prompt: L(
          'Write $0.\\overline{27}$ as a fraction $\\frac{a}{b}$ in simplest form.',
          'Tulis $0{,}\\overline{27}$ sebagai pecahan $\\frac{a}{b}$ dalam bentuk paling sederhana.',
        ),
        inline: true,
        blanks: [
          { label: 'a =', answer: 3 },
          { label: 'b =', answer: 11 },
        ],
        solution: ['x=0.\\overline{27} \\Rightarrow 100x-x=27', '99x=27 \\Rightarrow x=\\frac{27}{99}=\\frac{3}{11}'],
      },
      {
        prompt: L(
          'A bag costs Rp500,000. It gets a 20% discount, and then a further 10% discount on the new price. What is the final price in rupiah?',
          'Sebuah tas harganya Rp500.000. Tas itu diskon 20%, lalu diskon 10% lagi dari harga barunya. Berapa rupiah harga akhirnya?',
        ),
        blanks: [{ label: 'Rp', answer: 360000 }],
        solution: {
          en: ['500\\,000\\times0.8=400\\,000', '400\\,000\\times0.9=360\\,000'],
          id: ['500\\,000\\times0{,}8=400\\,000', '400\\,000\\times0{,}9=360\\,000'],
        },
      },
      {
        prompt: L(
          'Rp540,000 is shared among three friends in the ratio $2:3:4$. How many rupiah does each get, from the smallest share to the biggest?',
          'Uang Rp540.000 dibagi untuk tiga sahabat dengan rasio $2:3:4$. Berapa rupiah yang diterima masing-masing, dari bagian terkecil sampai terbesar?',
        ),
        inline: true,
        blanks: [
          { label: 'Rp', answer: 120000 },
          { label: 'Rp', answer: 180000 },
          { label: 'Rp', answer: 240000 },
        ],
        solution: ['2+3+4=9 \\quad 540\\,000\\div9=60\\,000', '2\\times60\\,000=120\\,000', '3\\times60\\,000=180\\,000 \\quad 4\\times60\\,000=240\\,000'],
      },
      {
        prompt: L(
          'How many integers $x$ satisfy $-3\\le x<2$?',
          'Ada berapa bilangan bulat $x$ yang memenuhi $-3\\le x<2$?',
        ),
        figure: {
          ...numberLine({
            from: -4,
            to: 3,
            step: 1,
            shade: [-3, 2],
            marks: [
              { at: -3, color: 'a' },
              { at: 2, color: 'a', open: true },
            ],
          }),
          caption: L('The interval from -3 (included) to 2 (not included).', 'Interval dari -3 (termasuk) sampai 2 (tidak termasuk).'),
        },
        blanks: [{ answer: 5 }],
        solution: {
          en: ['x=-3,-2,-1,0,1', '\\text{5 integers}'],
          id: ['x=-3,-2,-1,0,1', '\\text{5 bilangan bulat}'],
        },
      },
      {
        prompt: L(
          'Use the properties of the operations to calculate $25\\times17\\times4$.',
          'Gunakan sifat-sifat operasi untuk menghitung $25\\times17\\times4$.',
        ),
        blanks: [{ answer: 1700 }],
        solution: ['(25\\times4)\\times17=100\\times17', '=1\\,700'],
      },
    ],
  },
}
