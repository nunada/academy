import type { Submodule } from '../types'
import { L, dot, numberLine, plane } from './figs'

/** Module 2, submodule 1 — linear equations and inequalities in one variable,
 *  with absolute value. */

export const m2s1: Submodule = {
  id: 'tka-sma-m2-s1',
  title: L('Linear Equations and Inequalities', 'Persamaan dan Pertidaksamaan Linear'),
  summary: L(
    'Solve linear equations (with fractions and absolute value) and linear inequalities in one variable, and write the solutions as intervals.',
    'Menyelesaikan persamaan linear (dengan pecahan dan nilai mutlak) dan pertidaksamaan linear satu variabel, lalu menulis penyelesaiannya sebagai interval.',
  ),
  lessons: [
    /* --------------------------------------------------------- L1 equations */
    {
      id: 'tka-sma-m2-s1-l1',
      title: L('Linear Equations and Absolute Value', 'Persamaan Linear dan Nilai Mutlak'),
      goal: L(
        'You can solve a linear equation in one variable, also with fractions, and an equation with an absolute value.',
        'Kamu bisa menyelesaikan persamaan linear satu variabel, juga dengan pecahan, dan persamaan dengan nilai mutlak.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Where the Line Meets the Axis', 'Ayo Amati: Di Mana Garis Memotong Sumbu'),
          body: L(
            'After $x$ minutes the water in a tank stands $y=2x-4$ cm above a marker (a negative number means below it). When is the water exactly at the marker? That is the equation $2x-4=0$.\n\nIn the graph the line $y=2x-4$ crosses the $x$-axis at the red dot $(2,0)$. So the **solution** of $2x-4=0$ is $x=2$: the $x$-value where the line is at height 0.\n\n- A **linear equation** in $x$ can be brought to the form $ax+b=0$ with $a\\neq0$.\n- It has **exactly one** solution, $x=-\\frac{b}{a}$.\n- Solving means keeping the equation balanced: whatever you do to one side, you do to the other.',
            'Setelah $x$ menit, air dalam sebuah tangki berada $y=2x-4$ cm di atas sebuah tanda (bilangan negatif berarti di bawahnya). Kapan air tepat berada di tanda itu? Itulah persamaan $2x-4=0$.\n\nPada grafik, garis $y=2x-4$ memotong sumbu $x$ di titik merah $(2,0)$. Jadi **penyelesaian** $2x-4=0$ adalah $x=2$: nilai $x$ saat garis berada pada ketinggian 0.\n\n- **Persamaan linear** dalam $x$ dapat diubah ke bentuk $ax+b=0$ dengan $a\\neq0$.\n- Persamaan ini punya **tepat satu** penyelesaian, $x=-\\frac{b}{a}$.\n- Menyelesaikan berarti menjaga keseimbangan: apa pun yang dilakukan pada satu ruas, dilakukan juga pada ruas lainnya.',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: '2*x-4', from: -1, to: 5, color: 'a' },
                dot([2, 0], '(2, 0)', 'result'),
              ],
              { x: [-2, 6], y: [-7, 7] },
            ),
            caption: L('The line y = 2x - 4 meets the x-axis at x = 2.', 'Garis y = 2x - 4 memotong sumbu x di x = 2.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Brackets and Fractions', 'Contoh Bertahap: Kurung dan Pecahan'),
          body: L(
            'Solve $3(x-2)+4=2x+5$.\n\n1. Step 1: Expand the bracket: $3x-6+4=2x+5$, so $3x-2=2x+5$.\n2. Step 2: Gather the $x$ terms on one side: $3x-2x=5+2$.\n3. Step 3: $x=7$. Check: $3(5)+4=19$ and $2(7)+5=19$.\n\nSolve $\\frac{x+1}{2}-\\frac{x-1}{3}=1$.\n\n1. Step 1: Multiply every term by the common denominator 6: $3(x+1)-2(x-1)=6$.\n2. Step 2: Expand: $3x+3-2x+2=6$, so $x+5=6$.\n3. Step 3: $x=1$.\n\n**Watch the minus sign** before a bracket: $-2(x-1)=-2x+2$, not $-2x-2$.',
            'Selesaikan $3(x-2)+4=2x+5$.\n\n1. Langkah 1: Jabarkan kurung: $3x-6+4=2x+5$, jadi $3x-2=2x+5$.\n2. Langkah 2: Kumpulkan suku $x$ di satu ruas: $3x-2x=5+2$.\n3. Langkah 3: $x=7$. Periksa: $3(5)+4=19$ dan $2(7)+5=19$.\n\nSelesaikan $\\frac{x+1}{2}-\\frac{x-1}{3}=1$.\n\n1. Langkah 1: Kalikan setiap suku dengan penyebut persekutuan 6: $3(x+1)-2(x-1)=6$.\n2. Langkah 2: Jabarkan: $3x+3-2x+2=6$, jadi $x+5=6$.\n3. Langkah 3: $x=1$.\n\n**Waspadai tanda minus** di depan kurung: $-2(x-1)=-2x+2$, bukan $-2x-2$.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Absolute Value Equations', 'Contoh Bertahap: Persamaan Nilai Mutlak'),
          body: L(
            '$|a|$ is the distance of $a$ from 0, and $|x-2|$ is the distance of $x$ from 2. So $|x-2|=3$ says: "$x$ is 3 steps away from 2".\n\n1. Step 1: Go 3 steps right of 2: $x=5$.\n2. Step 2: Go 3 steps left of 2: $x=-1$.\n3. Step 3: Both work: $|5-2|=3$ and $|-1-2|=3$.\n\nIn general $|A|=c$ with $c>0$ gives **two** equations: $A=c$ or $A=-c$.\n\n- $|A|=0$ gives one solution, $A=0$.\n- $|A|=c$ with $c<0$ has **no** solution, because a distance is never negative.',
            '$|a|$ adalah jarak $a$ dari 0, dan $|x-2|$ adalah jarak $x$ dari 2. Jadi $|x-2|=3$ berarti: "$x$ berjarak 3 langkah dari 2".\n\n1. Langkah 1: Geser 3 langkah ke kanan dari 2: $x=5$.\n2. Langkah 2: Geser 3 langkah ke kiri dari 2: $x=-1$.\n3. Langkah 3: Keduanya benar: $|5-2|=3$ dan $|-1-2|=3$.\n\nSecara umum $|A|=c$ dengan $c>0$ menghasilkan **dua** persamaan: $A=c$ atau $A=-c$.\n\n- $|A|=0$ memberi satu penyelesaian, $A=0$.\n- $|A|=c$ dengan $c<0$ **tidak punya** penyelesaian, karena jarak tidak pernah negatif.',
          ),
          figure: {
            ...numberLine({
              from: -3,
              to: 7,
              step: 1,
              marks: [
                { at: 2, color: 'muted' },
                { at: -1, color: 'a', label: '-1' },
                { at: 5, color: 'b', label: '5' },
              ],
              jumps: [
                { from: 2, to: 5, label: '3', color: 'b' },
                { from: 2, to: -1, label: '3', color: 'a' },
              ],
            }),
            caption: L('Points that are 3 steps from 2.', 'Titik-titik yang berjarak 3 langkah dari 2.'),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The dots on the number line are the solutions of which equation?',
            'Titik-titik pada garis bilangan adalah penyelesaian dari persamaan mana?',
          ),
          figure: {
            ...numberLine({
              from: -3,
              to: 7,
              step: 1,
              marks: [
                { at: -1, color: 'a', label: '-1' },
                { at: 5, color: 'b', label: '5' },
              ],
            }),
            caption: L('Two solutions, -1 and 5.', 'Dua penyelesaian, -1 dan 5.'),
          },
          options: [
            L('$|x-2|=3$', '$|x-2|=3$'),
            L('$|x+2|=3$', '$|x+2|=3$'),
            L('$|x-3|=2$', '$|x-3|=2$'),
            L('$|x-2|=-3$', '$|x-2|=-3$'),
          ],
          answer: 0,
          explain: L(
            'The midpoint of $-1$ and $5$ is 2, and each dot is 3 away from it, so $|x-2|=3$. The equation $|x-2|=-3$ has no solution at all.',
            'Titik tengah $-1$ dan $5$ adalah 2, dan masing-masing titik berjarak 3 darinya, jadi $|x-2|=3$. Persamaan $|x-2|=-3$ sama sekali tidak punya penyelesaian.',
          ),
          hint: L(
            'Find the number exactly in the middle of the two dots, and how far each dot is from it.',
            'Cari bilangan yang tepat di tengah kedua titik, dan seberapa jauh tiap titik darinya.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: solve $3(x-2)+4=2x+5$.',
            'Coba bersama: selesaikan $3(x-2)+4=2x+5$.',
          ),
          template: '3x-___=2x+5 \\Rightarrow x=___',
          blanks: ['2', '7'],
          explain: L(
            '$3(x-2)+4=3x-6+4=3x-2$. Then $3x-2=2x+5$ gives $x=7$.',
            '$3(x-2)+4=3x-6+4=3x-2$. Lalu $3x-2=2x+5$ memberi $x=7$.',
          ),
          hint: L(
            'Expand the bracket first, then add the plain numbers $-6+4$.',
            'Jabarkan kurung dulu, lalu jumlahkan bilangan biasanya $-6+4$.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO equations whose solution is $x=3$.', 'Pilih DUA persamaan yang penyelesaiannya $x=3$.'),
          options: [
            L('$2x+1=7$', '$2x+1=7$'),
            L('$4x-3=9$', '$4x-3=9$'),
            L('$\\frac{x}{3}+1=3$', '$\\frac{x}{3}+1=3$'),
            L('$5-x=-2$', '$5-x=-2$'),
          ],
          answer: [0, 1],
          explain: L(
            '$2(3)+1=7$ and $4(3)-3=9$ are true. But $\\frac{x}{3}+1=3$ gives $x=6$, and $5-x=-2$ gives $x=7$.',
            '$2(3)+1=7$ dan $4(3)-3=9$ benar. Namun $\\frac{x}{3}+1=3$ memberi $x=6$, dan $5-x=-2$ memberi $x=7$.',
          ),
          hint: L(
            'Substitute $x=3$ into each equation and see whether both sides agree.',
            'Substitusikan $x=3$ ke tiap persamaan dan lihat apakah kedua ruas sama.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('If $2x=10$, then $x=5$.', 'Jika $2x=10$, maka $x=5$.'),
            L('$|x|=-4$ has no solution.', '$|x|=-4$ tidak punya penyelesaian.'),
            L('$|x-1|=4$ has only one solution.', '$|x-1|=4$ hanya punya satu penyelesaian.'),
            L('$3x+6=3(x+2)$ has exactly one solution.', '$3x+6=3(x+2)$ punya tepat satu penyelesaian.'),
          ],
          answer: [true, true, false, false],
          explain: L(
            'Dividing by 2 gives $x=5$. A distance is never negative, so $|x|=-4$ is impossible. $|x-1|=4$ gives $x=5$ or $x=-3$. And $3(x+2)=3x+6$, so the equation is true for **every** $x$.',
            'Dibagi 2 memberi $x=5$. Jarak tidak pernah negatif, jadi $|x|=-4$ mustahil. $|x-1|=4$ memberi $x=5$ atau $x=-3$. Dan $3(x+2)=3x+6$, jadi persamaan ini benar untuk **setiap** $x$.',
          ),
          hint: L(
            'Expand the bracket in the last statement and compare both sides.',
            'Jabarkan kurung pada pernyataan terakhir dan bandingkan kedua ruasnya.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'A taxi charges Rp8,000 to start and Rp3,000 for every kilometre. A trip costs Rp32,000. How many kilometres was the trip?',
            'Sebuah taksi menarik biaya awal Rp8.000 dan Rp3.000 untuk setiap kilometer. Sebuah perjalanan berbiaya Rp32.000. Berapa kilometer jarak perjalanan itu?',
          ),
          blanks: [{ answer: 8, after: '\\text{km}' }],
          hints: [
            L('Let $x$ be the number of kilometres. Write the cost as an expression in $x$.', 'Misalkan $x$ banyak kilometer. Tulis biayanya sebagai ekspresi dalam $x$.'),
            L('The cost is $8\\,000+3\\,000x$, and it equals $32\\,000$.', 'Biayanya $8\\,000+3\\,000x$, dan sama dengan $32\\,000$.'),
            L('Subtract 8 000 from both sides, then divide by 3 000.', 'Kurangkan kedua ruas dengan 8.000, lalu bagi dengan 3.000.'),
          ],
          explain: L(
            '$8\\,000+3\\,000x=32\\,000$ gives $3\\,000x=24\\,000$, so $x=8$ km.',
            '$8\\,000+3\\,000x=32\\,000$ memberi $3\\,000x=24\\,000$, jadi $x=8$ km.',
          ),
          solution: ['8\\,000+3\\,000x=32\\,000', '3\\,000x=24\\,000', 'x=8'],
        },
      ],
    },
    /* ------------------------------------------------------- L2 inequalities */
    {
      id: 'tka-sma-m2-s1-l2',
      title: L('Linear Inequalities', 'Pertidaksamaan Linear'),
      goal: L(
        'You can solve a linear inequality (also a double or absolute-value one), show it on a number line and write it as an interval.',
        'Kamu bisa menyelesaikan pertidaksamaan linear (juga yang ganda atau bernilai mutlak), menggambarnya pada garis bilangan, dan menulisnya sebagai interval.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: A Whole Stretch of Answers', 'Ayo Amati: Satu Rentang Jawaban'),
          body: L(
            'An equation like $2x-3=5$ has one answer. An **inequality** like $2x-3\\le5$ has a whole stretch of answers.\n\n1. Step 1: Add 3 to both sides: $2x\\le8$.\n2. Step 2: Divide by 2: $x\\le4$.\n\nEvery number up to and including 4 works: 4, 0, $-10$, $3.9$, $\\ldots$ In the picture the green stretch ends at a filled dot at 4 (the end is included). In interval form: $(-\\infty,4]$.\n\nThe rules are the same as for equations, with **one exception** you will meet in the next step.',
            'Persamaan seperti $2x-3=5$ punya satu jawaban. **Pertidaksamaan** seperti $2x-3\\le5$ punya satu rentang jawaban.\n\n1. Langkah 1: Tambahkan 3 pada kedua ruas: $2x\\le8$.\n2. Langkah 2: Bagi 2: $x\\le4$.\n\nSetiap bilangan sampai dengan 4 memenuhi: 4, 0, $-10$, $3{,}9$, $\\ldots$ Pada gambar, rentang hijau berakhir pada titik penuh di 4 (ujungnya ikut). Dalam bentuk interval: $(-\\infty,4]$.\n\nAturannya sama seperti persamaan, dengan **satu pengecualian** yang akan kamu temui pada langkah berikutnya.',
          ),
          figure: {
            ...numberLine({
              from: -2,
              to: 6,
              step: 1,
              shade: [-2, 4],
              marks: [{ at: 4, color: 'a' }],
            }),
            caption: L('The solution x ≤ 4 (it keeps going to the left).', 'Penyelesaian x ≤ 4 (berlanjut ke kiri).'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: The Sign Flips', 'Contoh Bertahap: Tanda Berbalik'),
          body: L(
            'Multiplying or dividing both sides by a **negative** number turns the inequality around. Check with numbers: $2<5$ is true, but multiplying by $-1$ gives $-2$ and $-5$, and $-2>-5$.\n\nSolve $-2x+3>9$.\n\n1. Step 1: Subtract 3: $-2x>6$.\n2. Step 2: Divide by $-2$ and **flip** the sign: $x<-3$.\n3. Step 3: Check with $x=-4$: $-2(-4)+3=11>9$. True.\n\nThe solution in interval form is $(-\\infty,-3)$, with an open dot at $-3$.\n\n**Remember:** flip the sign only when you multiply or divide by a negative number, never when you just add or subtract.',
            'Mengalikan atau membagi kedua ruas dengan bilangan **negatif** membalik arah pertidaksamaan. Cek dengan bilangan: $2<5$ benar, tetapi dikali $-1$ menjadi $-2$ dan $-5$, dan $-2>-5$.\n\nSelesaikan $-2x+3>9$.\n\n1. Langkah 1: Kurangi 3: $-2x>6$.\n2. Langkah 2: Bagi $-2$ dan **balik** tandanya: $x<-3$.\n3. Langkah 3: Cek dengan $x=-4$: $-2(-4)+3=11>9$. Benar.\n\nPenyelesaian dalam bentuk interval adalah $(-\\infty,-3)$, dengan titik kosong di $-3$.\n\n**Ingat:** balik tanda hanya saat mengalikan atau membagi dengan bilangan negatif, tidak pernah saat sekadar menambah atau mengurang.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Double and Absolute-Value Inequalities', 'Contoh Bertahap: Pertidaksamaan Ganda dan Nilai Mutlak'),
          body: L(
            '**A double inequality** is solved in all three parts at once. Solve $-1<2x+1\\le7$.\n\n1. Step 1: Subtract 1 from all three parts: $-2<2x\\le6$.\n2. Step 2: Divide all three by 2: $-1<x\\le3$.\n\nThe interval is $(-1,3]$.\n\n**Absolute value** is a distance, so:\n\n- $|x-2|<3$ means "within 3 of 2": $-1<x<5$ (one stretch, the green part).\n- $|x-2|\\ge3$ means "at least 3 away from 2": $x\\le-1$ **or** $x\\ge5$ (two pieces).\n\nSo "less than" gives one piece in the middle and "greater than" gives two pieces outside.',
            '**Pertidaksamaan ganda** diselesaikan pada ketiga bagian sekaligus. Selesaikan $-1<2x+1\\le7$.\n\n1. Langkah 1: Kurangi 1 pada ketiga bagian: $-2<2x\\le6$.\n2. Langkah 2: Bagi ketiganya dengan 2: $-1<x\\le3$.\n\nIntervalnya $(-1,3]$.\n\n**Nilai mutlak** adalah jarak, sehingga:\n\n- $|x-2|<3$ berarti "dalam jarak 3 dari 2": $-1<x<5$ (satu rentang, bagian hijau).\n- $|x-2|\\ge3$ berarti "berjarak paling sedikit 3 dari 2": $x\\le-1$ **atau** $x\\ge5$ (dua bagian).\n\nJadi "kurang dari" memberi satu bagian di tengah dan "lebih dari" memberi dua bagian di luar.',
          ),
          figure: {
            ...numberLine({
              from: -3,
              to: 7,
              step: 1,
              shade: [-1, 5],
              marks: [
                { at: -1, color: 'a', open: true },
                { at: 5, color: 'a', open: true },
                { at: 2, color: 'muted' },
              ],
            }),
            caption: L('The solution of |x - 2| < 3 is the stretch from -1 to 5.', 'Penyelesaian |x - 2| < 3 adalah rentang dari -1 sampai 5.'),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The green stretch with an open dot at 3 is the solution of which inequality?',
            'Rentang hijau dengan titik kosong di 3 adalah penyelesaian dari pertidaksamaan mana?',
          ),
          figure: {
            ...numberLine({
              from: 0,
              to: 7,
              step: 1,
              shade: [3, 7],
              marks: [{ at: 3, color: 'a', open: true }],
            }),
            caption: L('The solution goes to the right of 3, without 3.', 'Penyelesaian ke kanan dari 3, tanpa 3.'),
          },
          options: [
            L('$-4x+5<-7$', '$-4x+5<-7$'),
            L('$-4x+5>-7$', '$-4x+5>-7$'),
            L('$4x-5<7$', '$4x-5<7$'),
            L('$4x+5<17$', '$4x+5<17$'),
          ],
          answer: 0,
          explain: L(
            '$-4x+5<-7$ gives $-4x<-12$, and dividing by $-4$ flips the sign: $x>3$. The others all give $x<3$.',
            '$-4x+5<-7$ memberi $-4x<-12$, dan dibagi $-4$ membalik tanda: $x>3$. Yang lain semuanya memberi $x<3$.',
          ),
          hint: L(
            'Solve each one. The picture needs $x>3$, so look out for the sign flip.',
            'Selesaikan satu per satu. Gambar membutuhkan $x>3$, jadi waspadai pembalikan tanda.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: solve $-2x+3>9$.',
            'Coba bersama: selesaikan $-2x+3>9$.',
          ),
          template: '-2x>___ \\Rightarrow x<___',
          blanks: ['6', '-3'],
          explain: L(
            '$-2x>9-3=6$. Dividing by $-2$ flips the sign: $x<-3$.',
            '$-2x>9-3=6$. Dibagi $-2$ membalik tanda: $x<-3$.',
          ),
          hint: L(
            'Move the 3 across first. Then, because you divide by a negative number, the sign turns.',
            'Pindahkan 3 dulu. Lalu, karena membagi dengan bilangan negatif, tandanya berbalik.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO numbers that satisfy $-3x+1>-8$.', 'Pilih DUA bilangan yang memenuhi $-3x+1>-8$.'),
          options: [L('2', '2'), L('$-5$', '$-5$'), L('3', '3'), L('4', '4')],
          answer: [0, 1],
          explain: L(
            '$-3x>-9$ and dividing by $-3$ flips the sign: $x<3$. So 2 and $-5$ work, but 3 does not (it gives equality) and 4 does not.',
            '$-3x>-9$ dan dibagi $-3$ membalik tanda: $x<3$. Jadi 2 dan $-5$ memenuhi, tetapi 3 tidak (memberi kesamaan) dan 4 tidak.',
          ),
          hint: L(
            'Solve the inequality first, then test each number against your answer.',
            'Selesaikan pertidaksamaannya dulu, lalu uji tiap bilangan terhadap jawabanmu.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('$x\\le4$ includes the number 4.', '$x\\le4$ menyertakan bilangan 4.'),
            L('Dividing both sides of $-3x<6$ by $-3$ gives $x<-2$.', 'Membagi kedua ruas $-3x<6$ dengan $-3$ memberi $x<-2$.'),
            L('The solution of $|x|<2$ is $-2<x<2$.', 'Penyelesaian $|x|<2$ adalah $-2<x<2$.'),
            L('The solution of $|x|>2$ is $-2<x<2$.', 'Penyelesaian $|x|>2$ adalah $-2<x<2$.'),
          ],
          answer: [true, false, true, false],
          explain: L(
            'A filled dot includes the end. Dividing by $-3$ flips the sign, so $x>-2$. $|x|<2$ means within 2 of 0. But $|x|>2$ means **more** than 2 away: $x<-2$ or $x>2$.',
            'Titik penuh menyertakan ujung. Dibagi $-3$ membalik tanda, jadi $x>-2$. $|x|<2$ berarti dalam jarak 2 dari 0. Tetapi $|x|>2$ berarti **lebih** dari 2 jauhnya: $x<-2$ atau $x>2$.',
          ),
          hint: L(
            'Think of $|x|$ as the distance from 0. Is "more than 2 away" the middle or the outside?',
            'Anggap $|x|$ sebagai jarak dari 0. Apakah "lebih dari 2 jauhnya" itu tengah atau luar?',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'How many integers $x$ satisfy $|2x-3|\\le7$?',
            'Ada berapa bilangan bulat $x$ yang memenuhi $|2x-3|\\le7$?',
          ),
          blanks: [{ answer: 8 }],
          hints: [
            L('Remove the absolute value: $|A|\\le7$ means $-7\\le A\\le7$.', 'Hilangkan nilai mutlak: $|A|\\le7$ berarti $-7\\le A\\le7$.'),
            L('So $-7\\le2x-3\\le7$. Add 3 to all three parts, then divide by 2.', 'Jadi $-7\\le2x-3\\le7$. Tambahkan 3 pada ketiga bagian, lalu bagi 2.'),
            L('You get $-2\\le x\\le5$. List the integers and count them.', 'Kamu mendapat $-2\\le x\\le5$. Daftar bilangan bulatnya dan hitung.'),
          ],
          explain: L(
            '$-4\\le2x\\le10$ gives $-2\\le x\\le5$. The integers are $-2,-1,0,1,2,3,4,5$: eight of them.',
            '$-4\\le2x\\le10$ memberi $-2\\le x\\le5$. Bilangan bulatnya $-2,-1,0,1,2,3,4,5$: delapan buah.',
          ),
          solution: {
            en: ['-7\\le2x-3\\le7', '-4\\le2x\\le10 \\Rightarrow -2\\le x\\le5', '\\text{8 integers}'],
            id: ['-7\\le2x-3\\le7', '-4\\le2x\\le10 \\Rightarrow -2\\le x\\le5', '\\text{8 bilangan bulat}'],
          },
        },
      ],
    },
  ],
  project: {
    id: 'tka-sma-m2-s1-p',
    runtime: 'math',
    title: L('Equations and Inequalities', 'Persamaan dan Pertidaksamaan'),
    brief: L(
      'Solve equations with fractions and absolute values, and inequalities that model a price comparison.',
      'Selesaikan persamaan dengan pecahan dan nilai mutlak, serta pertidaksamaan yang memodelkan perbandingan harga.',
    ),
    requirements: [
      L('Solve linear equations with fractions and with absolute value.', 'Menyelesaikan persamaan linear dengan pecahan dan nilai mutlak.'),
      L('Solve inequalities, flipping the sign when needed, and read the solution.', 'Menyelesaikan pertidaksamaan, membalik tanda bila perlu, dan membaca penyelesaiannya.'),
    ],
    hints: [
      L('Clear fractions by multiplying every term by the common denominator.', 'Hilangkan pecahan dengan mengalikan tiap suku dengan penyebut persekutuan.'),
      L('$|A|=c$ means $A=c$ or $A=-c$.', '$|A|=c$ berarti $A=c$ atau $A=-c$.'),
      L('Divide by a negative number: flip the inequality sign.', 'Membagi dengan bilangan negatif: balik tanda pertidaksamaan.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L(
          'Solve $\\frac{2x-1}{3}-\\frac{x+2}{4}=1$.',
          'Selesaikan $\\frac{2x-1}{3}-\\frac{x+2}{4}=1$.',
        ),
        blanks: [{ label: 'x =', answer: 4.4 }],
        solution: {
          en: ['12\\left(\\frac{2x-1}{3}-\\frac{x+2}{4}\\right)=12', '4(2x-1)-3(x+2)=12 \\Rightarrow 5x-10=12', 'x=\\frac{22}{5}=4.4'],
          id: ['12\\left(\\frac{2x-1}{3}-\\frac{x+2}{4}\\right)=12', '4(2x-1)-3(x+2)=12 \\Rightarrow 5x-10=12', 'x=\\frac{22}{5}=4{,}4'],
        },
      },
      {
        prompt: L(
          'Solve $|3x-6|=9$. Give the smaller solution first.',
          'Selesaikan $|3x-6|=9$. Tulis penyelesaian yang lebih kecil lebih dulu.',
        ),
        inline: true,
        blanks: [
          { label: { en: '\\text{smaller } x =', id: '\\text{yang kecil } x =' }, answer: -1 },
          { label: { en: '\\text{larger } x =', id: '\\text{yang besar } x =' }, answer: 5 },
        ],
        solution: ['3x-6=9 \\Rightarrow x=5', '3x-6=-9 \\Rightarrow x=-1'],
      },
      {
        prompt: L(
          'What is the largest integer $x$ with $-3(x-1)\\ge6$?',
          'Berapa bilangan bulat $x$ terbesar yang memenuhi $-3(x-1)\\ge6$?',
        ),
        blanks: [{ answer: -1 }],
        solution: {
          en: ['x-1\\le-2 \\quad \\text{(divide by }-3\\text{, flip)}', 'x\\le-1', 'x=-1'],
          id: ['x-1\\le-2 \\quad \\text{(bagi }-3\\text{, balik)}', 'x\\le-1', 'x=-1'],
        },
      },
      {
        prompt: L(
          'How many integers $x$ satisfy $3\\le2x-1<9$?',
          'Ada berapa bilangan bulat $x$ yang memenuhi $3\\le2x-1<9$?',
        ),
        figure: {
          ...numberLine({
            from: 0,
            to: 7,
            step: 1,
            shade: [2, 5],
            marks: [
              { at: 2, color: 'a' },
              { at: 5, color: 'a', open: true },
            ],
          }),
          caption: L('The solution stretch from 2 to 5.', 'Rentang penyelesaian dari 2 sampai 5.'),
        },
        blanks: [{ answer: 3 }],
        solution: ['4\\le2x<10', '2\\le x<5', 'x=2,3,4'],
      },
      {
        prompt: L(
          'Phone plan A costs Rp30,000 plus Rp2,000 for every GB. Plan B costs a flat Rp70,000. What is the largest whole number of GB for which plan A is cheaper than plan B?',
          'Paket ponsel A berbiaya Rp30.000 ditambah Rp2.000 untuk setiap GB. Paket B berbiaya tetap Rp70.000. Berapa GB bulat terbesar agar paket A lebih murah daripada paket B?',
        ),
        blanks: [{ answer: 19, after: '\\text{GB}' }],
        solution: ['30\\,000+2\\,000g<70\\,000', '2\\,000g<40\\,000 \\Rightarrow g<20', 'g=19'],
      },
    ],
  },
}
