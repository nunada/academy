import type { Lesson } from '../types'
import { L, line, parallelLines, shape, txt } from './figs'

/** Module 5 — angles with parallel lines, congruent triangles, quadrilaterals. */

export const lessonCongruence: Lesson = {
  id: 'tka-sma-m5-s1-l3',
  title: L('Parallel Lines, Congruence and Quadrilaterals', 'Garis Sejajar, Kekongruenan, dan Segi Empat'),
  goal: L(
    'You can use the angles formed by parallel lines, the conditions for congruent triangles, and the properties of quadrilaterals.',
    'Kamu bisa memakai sudut yang terbentuk oleh garis sejajar, syarat segitiga kongruen, dan sifat segi empat.',
  ),
  xp: 20,
  steps: [
    {
      kind: 'concept',
      id: 'c1',
      title: L('Look Closely: A Line Cutting Two Parallel Lines', 'Ayo Amati: Garis yang Memotong Dua Garis Sejajar'),
      body: L(
        'A line that crosses two **parallel** lines is a **transversal**. It makes eight angles, and they come in only two sizes: one acute size and one obtuse size that add up to $180^{\\circ}$.\n\n- **Corresponding angles** (same place at each crossing) are equal.\n- **Alternate interior angles** (between the lines, on opposite sides) are equal.\n- **Co-interior angles** (between the lines, on the same side) add up to $180^{\\circ}$.\n- **Vertically opposite angles** (opposite at one crossing) are equal.\n\nIn the picture, one angle is $65^{\\circ}$. Every angle marked the same way is also $65^{\\circ}$, and the others are $180^{\\circ}-65^{\\circ}=115^{\\circ}$.\n\nThe converse also works: if corresponding angles are equal, the two lines are parallel.',
        'Garis yang memotong dua garis **sejajar** disebut **transversal**. Garis itu membentuk delapan sudut, dan besarnya hanya dua macam: satu lancip dan satu tumpul yang berjumlah $180^{\\circ}$.\n\n- **Sudut sehadap** (letak sama pada tiap perpotongan) sama besar.\n- **Sudut dalam berseberangan** (di antara garis, di sisi berlawanan) sama besar.\n- **Sudut dalam sepihak** (di antara garis, di sisi yang sama) berjumlah $180^{\\circ}$.\n- **Sudut bertolak belakang** (berseberangan pada satu perpotongan) sama besar.\n\nPada gambar, satu sudut $65^{\\circ}$. Setiap sudut yang ditandai dengan cara yang sama juga $65^{\\circ}$, dan yang lain $180^{\\circ}-65^{\\circ}=115^{\\circ}$.\n\nKebalikannya juga berlaku: jika sudut sehadap sama besar, kedua garis sejajar.',
      ),
      figure: {
        ...parallelLines({ deg: 65, labels: ['65°', undefined, undefined, undefined, '65°'] }),
        caption: L('Two parallel lines and a transversal; two corresponding angles of 65°.', 'Dua garis sejajar dan sebuah transversal; dua sudut sehadap 65°.'),
      },
    },
    {
      kind: 'concept',
      id: 'c2',
      title: L('Step by Step: Congruent Triangles', 'Contoh Bertahap: Segitiga Kongruen'),
      body: L(
        'Two triangles are **congruent** when they have the same shape **and** the same size. Their matching sides and angles are equal. You do not need to check everything: one of these sets is enough.\n\n| Condition | Meaning |\n|---|---|\n| **SSS** | three pairs of equal sides |\n| **SAS** | two sides and the angle **between** them |\n| **ASA** or **AAS** | two angles and a side |\n| **RHS** | right angle, hypotenuse and one side |\n\n**Not enough:** **AAA** (three equal angles) gives similar triangles, not necessarily congruent; and **SSA** can fail.\n\nExample: in the parallelogram $ABCD$ the diagonal $AC$ cuts it into two triangles. $AB=CD$, $BC=DA$ (opposite sides) and $AC$ is shared. By **SSS**, $\\triangle ABC\\cong\\triangle CDA$, so the opposite angles of the parallelogram are equal.',
        'Dua segitiga **kongruen** bila bentuknya sama **dan** ukurannya sama. Sisi dan sudut yang bersesuaian sama besar. Kamu tidak perlu memeriksa semuanya: satu dari himpunan berikut sudah cukup.\n\n| Syarat | Arti |\n|---|---|\n| **SSS** | tiga pasang sisi sama panjang |\n| **SAS** | dua sisi dan sudut **apit**nya |\n| **ASA** atau **AAS** | dua sudut dan sebuah sisi |\n| **RHS** | sudut siku-siku, sisi miring, dan satu sisi |\n\n**Tidak cukup:** **AAA** (tiga sudut sama) memberi segitiga sebangun, belum tentu kongruen; dan **SSA** dapat gagal.\n\nContoh: pada jajargenjang $ABCD$ diagonal $AC$ membaginya menjadi dua segitiga. $AB=CD$, $BC=DA$ (sisi berhadapan) dan $AC$ dipakai bersama. Dengan **SSS**, $\\triangle ABC\\cong\\triangle CDA$, sehingga sudut-sudut berhadapan jajargenjang sama besar.',
      ),
      figure: {
        ...shape({
          pts: [[0, 0], [6, 0], [8, 3], [2, 3]],
          names: 'ABCD',
          sides: ['6', undefined, '6'],
          extra: [line([0, 0], [8, 3], 'result', { width: 2.4 })],
        }),
        caption: L('The diagonal AC splits the parallelogram into two congruent triangles.', 'Diagonal AC membagi jajargenjang menjadi dua segitiga kongruen.'),
      },
    },
    {
      kind: 'concept',
      id: 'c3',
      title: L('Step by Step: Properties of Quadrilaterals', 'Contoh Bertahap: Sifat Segi Empat'),
      body: L(
        'The angles of every quadrilateral add up to $360^{\\circ}$.\n\n| Shape | Key properties |\n|---|---|\n| Parallelogram | opposite sides parallel and equal; diagonals **bisect** each other |\n| Rectangle | a parallelogram with four right angles; diagonals **equal** |\n| Rhombus | a parallelogram with four equal sides; diagonals **perpendicular** and bisect the angles |\n| Square | rectangle and rhombus at once |\n| Trapezoid | one pair of parallel sides |\n| Kite | two pairs of equal neighboring sides; diagonals perpendicular |\n\nA rhombus has diagonals 6 and 8. They cross at right angles and cut each other in half, so each side is the hypotenuse of a triangle with legs $3$ and $4$:\n\n1. Step 1: Side $=\\sqrt{3^2+4^2}=5$.\n2. Step 2: Perimeter $=4\\times5=20$.\n3. Step 3: Area $=\\frac{1}{2}d_1d_2=\\frac{1}{2}\\times6\\times8=24$.',
        'Sudut-sudut setiap segi empat berjumlah $360^{\\circ}$.\n\n| Bangun | Sifat utama |\n|---|---|\n| Jajargenjang | sisi berhadapan sejajar dan sama panjang; diagonal saling **membagi dua** |\n| Persegi panjang | jajargenjang dengan empat sudut siku-siku; diagonal **sama panjang** |\n| Belah ketupat | jajargenjang dengan empat sisi sama; diagonal **tegak lurus** dan membagi dua sudut |\n| Persegi | persegi panjang dan belah ketupat sekaligus |\n| Trapesium | satu pasang sisi sejajar |\n| Layang-layang | dua pasang sisi bersebelahan sama panjang; diagonal tegak lurus |\n\nSebuah belah ketupat berdiagonal 6 dan 8. Diagonalnya berpotongan tegak lurus dan saling membagi dua, jadi setiap sisi adalah sisi miring segitiga bersisi tegak $3$ dan $4$:\n\n1. Langkah 1: Sisi $=\\sqrt{3^2+4^2}=5$.\n2. Langkah 2: Keliling $=4\\times5=20$.\n3. Langkah 3: Luas $=\\frac{1}{2}d_1d_2=\\frac{1}{2}\\times6\\times8=24$.',
      ),
      figure: {
        ...shape({
          pts: [[4, 0], [8, 3], [4, 6], [0, 3]],
          names: 'ABCD',
          extra: [
            line([4, 0], [4, 6], 'result', { width: 2.2 }),
            line([0, 3], [8, 3], 'result', { width: 2.2 }),
            txt(4.5, 4.4, '3', 'md', 'muted'),
            txt(2, 3.4, '4', 'md', 'muted'),
          ],
        }),
        caption: L('A rhombus with its two perpendicular diagonals.', 'Belah ketupat dengan kedua diagonalnya yang tegak lurus.'),
      },
    },
    {
      kind: 'quiz',
      id: 'q1',
      prompt: L(
        'The two lines are parallel, and one marked angle is $70^{\\circ}$. What is the angle $x$ between the lines on the same side of the transversal as the $70^{\\circ}$ angle (a co-interior angle)?',
        'Kedua garis sejajar, dan satu sudut yang ditandai $70^{\\circ}$. Berapa sudut $x$ di antara kedua garis pada sisi transversal yang sama dengan sudut $70^{\\circ}$ itu (sudut dalam sepihak)?',
      ),
      figure: {
        ...parallelLines({ deg: 70, labels: [undefined, undefined, '70°', undefined, undefined, 'x'] }),
        caption: L('Two parallel lines and a transversal.', 'Dua garis sejajar dan sebuah transversal.'),
      },
      options: [L('$110^{\\circ}$', '$110^{\\circ}$'), L('$70^{\\circ}$', '$70^{\\circ}$'), L('$20^{\\circ}$', '$20^{\\circ}$'), L('$290^{\\circ}$', '$290^{\\circ}$')],
      answer: 0,
      explain: L(
        'Co-interior angles add up to $180^{\\circ}$, so $x=180^{\\circ}-70^{\\circ}=110^{\\circ}$. The value $70^{\\circ}$ would be right for a corresponding or alternate angle.',
        'Sudut dalam sepihak berjumlah $180^{\\circ}$, jadi $x=180^{\\circ}-70^{\\circ}=110^{\\circ}$. Nilai $70^{\\circ}$ benar untuk sudut sehadap atau sudut dalam berseberangan.',
      ),
      hint: L(
        'Co-interior angles lie between the lines on the same side. Do they equal each other or add to a straight angle?',
        'Sudut dalam sepihak berada di antara garis pada sisi yang sama. Apakah keduanya sama atau berjumlah sudut lurus?',
      ),
    },
    {
      kind: 'fill',
      id: 'f1',
      math: true,
      prompt: L(
        'Try it together: a co-interior angle of $70^{\\circ}$.',
        'Coba bersama: sudut dalam sepihak dari $70^{\\circ}$.',
      ),
      template: 'x+70^{\\circ}=180^{\\circ} \\Rightarrow x=___^{\\circ}',
      blanks: ['110'],
      explain: L(
        '$180-70=110$.',
        '$180-70=110$.',
      ),
      hint: L(
        'Subtract 70 from 180.',
        'Kurangkan 70 dari 180.',
      ),
    },
    {
      kind: 'multi',
      id: 'mc1',
      prompt: L('Two lines are parallel and cut by a transversal. Choose the TWO true statements.', 'Dua garis sejajar dipotong oleh sebuah transversal. Pilih DUA pernyataan yang benar.'),
      options: [
        L('Corresponding angles are equal.', 'Sudut sehadap sama besar.'),
        L('Alternate interior angles are equal.', 'Sudut dalam berseberangan sama besar.'),
        L('Co-interior angles are equal.', 'Sudut dalam sepihak sama besar.'),
        L('Vertically opposite angles add up to $180^{\\circ}$.', 'Sudut bertolak belakang berjumlah $180^{\\circ}$.'),
      ],
      answer: [0, 1],
      explain: L(
        'Co-interior angles add up to $180^{\\circ}$ (they are equal only when both are $90^{\\circ}$), and vertically opposite angles are equal.',
        'Sudut dalam sepihak berjumlah $180^{\\circ}$ (keduanya sama hanya bila masing-masing $90^{\\circ}$), dan sudut bertolak belakang sama besar.',
      ),
      hint: L(
        'Two of the four rules are about equal angles; the other two are about the sum $180^{\\circ}$ or are swapped.',
        'Dua dari empat aturan menyangkut sudut yang sama besar; dua lainnya menyangkut jumlah $180^{\\circ}$ atau tertukar.',
      ),
    },
    {
      kind: 'judge',
      id: 'j1',
      prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
      statements: [
        L('Two triangles with three pairs of equal sides are congruent.', 'Dua segitiga dengan tiga pasang sisi sama panjang kongruen.'),
        L('Two triangles with three pairs of equal angles are always congruent.', 'Dua segitiga dengan tiga pasang sudut sama besar selalu kongruen.'),
        L('The diagonals of a rhombus are perpendicular.', 'Diagonal belah ketupat saling tegak lurus.'),
        L('The diagonals of every parallelogram are equal in length.', 'Diagonal setiap jajargenjang sama panjang.'),
      ],
      answer: [true, false, true, false],
      explain: L(
        'SSS gives congruence. Equal angles (AAA) give only similar triangles. A rhombus has perpendicular diagonals. Equal diagonals are special to rectangles.',
        'SSS menjamin kekongruenan. Sudut sama (AAA) hanya menjamin sebangun. Belah ketupat berdiagonal tegak lurus. Diagonal sama panjang khas bagi persegi panjang.',
      ),
      hint: L(
        'For the angle statement: can a small and a large triangle have the same angles?',
        'Untuk pernyataan sudut: dapatkah segitiga kecil dan besar punya sudut yang sama?',
      ),
    },
    {
      kind: 'math',
      id: 'm1',
      prompt: L(
        'A rhombus has diagonals of length 6 and 8. What is its perimeter?',
        'Sebuah belah ketupat berdiagonal 6 dan 8. Berapa kelilingnya?',
      ),
      blanks: [{ answer: 20 }],
      hints: [
        L('The diagonals of a rhombus cross at right angles and cut each other in half.', 'Diagonal belah ketupat berpotongan tegak lurus dan saling membagi dua.'),
        L('One side is the hypotenuse of a right triangle with legs 3 and 4.', 'Satu sisinya adalah sisi miring segitiga siku-siku dengan sisi tegak 3 dan 4.'),
        L('The side is 5; all four sides are equal.', 'Sisinya 5; keempat sisi sama panjang.'),
      ],
      explain: L(
        'Side $=\\sqrt{3^2+4^2}=5$, so the perimeter is $4\\times5=20$.',
        'Sisi $=\\sqrt{3^2+4^2}=5$, jadi kelilingnya $4\\times5=20$.',
      ),
      solution: ['s=\\sqrt{3^2+4^2}=5', '4\\times5=20'],
    },
  ],
}
