import type { Lesson } from '../types'
import { L, dot, plane } from './figs'

/** Module 2 — a system of three equations in three unknowns (the framework
 *  allows at most three variables). */

export const lessonThreeUnknowns: Lesson = {
  id: 'tka-sma-m2-s2-l3',
  title: L('Three Equations, Three Unknowns', 'Tiga Persamaan, Tiga Variabel'),
  goal: L(
    'You can solve a system of three linear equations in three unknowns by elimination, and use it in a word problem.',
    'Kamu bisa menyelesaikan sistem tiga persamaan linear dengan tiga variabel dengan eliminasi, dan memakainya dalam soal cerita.',
  ),
  xp: 20,
  steps: [
    {
      kind: 'concept',
      id: 'c1',
      title: L('Look Closely: Two Unknowns Hide Inside Three', 'Ayo Amati: Dua Variabel Tersembunyi di dalam Tiga'),
      body: L(
        'The TKA allows at most **three** variables. A system of three equations is solved by turning it into a system of **two**, then one equation.\n\n$$\\begin{cases}x+y+z=6\\\\x-y+z=2\\\\2x+y-z=1\\end{cases}$$\n\n1. Step 1: Pick one unknown and remove it from **two different pairs** of equations. Subtracting the 2nd from the 1st: $2y=4$, so $y=2$ at once.\n2. Step 2: Put $y=2$ into the others: $x+z=4$ and $2x-z=-1$. This is a system of two equations.\n3. Step 3: Add them: $3x=3$, so $x=1$, and $z=4-1=3$.\n\nThe solution is $(x,y,z)=(1,2,3)$. The picture shows the two-unknown system $x+z=4$ and $2x-z=-1$ (with $x$ across and $z$ up): the lines cross at the red dot $(1,3)$.',
        'TKA membatasi paling banyak **tiga** variabel. Sistem tiga persamaan diselesaikan dengan mengubahnya menjadi sistem **dua** persamaan, lalu satu persamaan.\n\n$$\\begin{cases}x+y+z=6\\\\x-y+z=2\\\\2x+y-z=1\\end{cases}$$\n\n1. Langkah 1: Pilih satu variabel dan hilangkan dari **dua pasangan persamaan yang berbeda**. Mengurangkan persamaan ke-2 dari ke-1: $2y=4$, jadi $y=2$ seketika.\n2. Langkah 2: Masukkan $y=2$ ke persamaan lain: $x+z=4$ dan $2x-z=-1$. Ini sistem dua persamaan.\n3. Langkah 3: Jumlahkan: $3x=3$, jadi $x=1$, dan $z=4-1=3$.\n\nPenyelesaiannya $(x,y,z)=(1,2,3)$. Gambar menunjukkan sistem dua variabel $x+z=4$ dan $2x-z=-1$ (dengan $x$ ke samping dan $z$ ke atas): garis-garis berpotongan di titik merah $(1,3)$.',
      ),
      figure: {
        ...plane(
          [
            { t: 'curve', f: '4-x', from: -1, to: 5, color: 'a' },
            { t: 'curve', f: '2*x+1', from: -1, to: 4, color: 'b' },
            dot([1, 3], '(1, 3)', 'result'),
          ],
          { x: [-2, 6], y: [-3, 9] },
        ),
        caption: L('The lines x + z = 4 and 2x - z = -1 meet at (1, 3).', 'Garis x + z = 4 dan 2x - z = -1 bertemu di (1, 3).'),
      },
    },
    {
      kind: 'concept',
      id: 'c2',
      title: L('Step by Step: A Word Problem with Three Prices', 'Contoh Bertahap: Soal Cerita dengan Tiga Harga'),
      body: L(
        'Two pens and 1 book cost Rp9,000. One pen, 2 books and 1 ruler cost Rp13,000. One book and 1 ruler cost Rp6,000. Find each price (in thousands of rupiah).\n\n1. Step 1: Let $p$, $b$, $r$ be the prices of a pen, a book and a ruler. The facts: $2p+b=9$, $p+2b+r=13$, $b+r=6$.\n2. Step 2: From the third, $r=6-b$. Put it in the second: $p+2b+6-b=13$, so $p+b=7$.\n3. Step 3: Now $2p+b=9$ and $p+b=7$. Subtract: $p=2$, so $b=5$ and $r=1$.\n4. Step 4: Check all three: $2(2)+5=9$ ✓, $2+10+1=13$ ✓, $5+1=6$ ✓.\n\nThe prices are Rp2,000, Rp5,000 and Rp1,000.',
        'Dua pena dan 1 buku berharga Rp9.000. Satu pena, 2 buku, dan 1 penggaris berharga Rp13.000. Satu buku dan 1 penggaris berharga Rp6.000. Tentukan tiap harga (dalam ribuan rupiah).\n\n1. Langkah 1: Misalkan $p$, $b$, $r$ harga sebuah pena, buku, dan penggaris. Faktanya: $2p+b=9$, $p+2b+r=13$, $b+r=6$.\n2. Langkah 2: Dari yang ketiga, $r=6-b$. Masukkan ke yang kedua: $p+2b+6-b=13$, jadi $p+b=7$.\n3. Langkah 3: Kini $2p+b=9$ dan $p+b=7$. Kurangkan: $p=2$, jadi $b=5$ dan $r=1$.\n4. Langkah 4: Periksa ketiganya: $2(2)+5=9$ ✓, $2+10+1=13$ ✓, $5+1=6$ ✓.\n\nHarganya Rp2.000, Rp5.000, dan Rp1.000.',
      ),
    },
    {
      kind: 'concept',
      id: 'c3',
      title: L('Watch Out!: Checking and Special Cases', 'Awas, Jebakan!: Memeriksa dan Kasus Khusus'),
      body: L(
        '- **Eliminate the same unknown from two different pairs.** If you remove $y$ from one pair and $z$ from another, you get two equations with different unknowns that cannot be combined.\n- **Check in all three equations.** A solution that fits only two is not a solution.\n- **Choose the easy unknown first**: the one with coefficient $\\pm1$ or with opposite signs.\n- **Special cases.** If the unknowns vanish and leave $0=5$ the system has **no** solution; if they leave $0=0$ it has **infinitely many**, as with two lines.\n- **Keep the question in mind.** The question may ask for $x+y+z$ or for one price, not for every unknown.',
        '- **Hilangkan variabel yang sama dari dua pasangan yang berbeda.** Jika kamu menghilangkan $y$ dari satu pasangan dan $z$ dari pasangan lain, kamu mendapat dua persamaan dengan variabel berbeda yang tidak dapat digabung.\n- **Periksa di ketiga persamaan.** Penyelesaian yang hanya cocok pada dua persamaan bukan penyelesaian.\n- **Pilih dulu variabel yang mudah**: yang berkoefisien $\\pm1$ atau bertanda berlawanan.\n- **Kasus khusus.** Jika variabel habis dan menyisakan $0=5$, sistem **tidak** punya penyelesaian; jika menyisakan $0=0$, ada **tak hingga banyak**, seperti pada dua garis.\n- **Ingat pertanyaannya.** Soal mungkin menanyakan $x+y+z$ atau satu harga, bukan semua variabel.',
      ),
    },
    {
      kind: 'quiz',
      id: 'q1',
      prompt: L(
        'After removing $y$ from the system, the two lines in the picture remain ($x$ across, $z$ up). The red dot is their crossing. What is $z$?',
        'Setelah $y$ dihilangkan dari sistem, tersisa dua garis pada gambar ($x$ ke samping, $z$ ke atas). Titik merah adalah perpotongannya. Berapa $z$?',
      ),
      figure: {
        ...plane(
          [
            { t: 'curve', f: '4-x', from: -1, to: 5, color: 'a' },
            { t: 'curve', f: '2*x+1', from: -1, to: 4, color: 'b' },
            dot([1, 3], undefined, 'result'),
          ],
          { x: [-2, 6], y: [-3, 9] },
        ),
        caption: L('Two lines that cross at one point.', 'Dua garis yang berpotongan di satu titik.'),
      },
      options: [L('3', '3'), L('1', '1'), L('4', '4'), L('2', '2')],
      answer: 0,
      explain: L(
        'The dot is 1 across and 3 up, so $x=1$ and $z=3$. The value 1 is $x$, and $y=2$ was found earlier.',
        'Titik itu 1 ke samping dan 3 ke atas, jadi $x=1$ dan $z=3$. Nilai 1 adalah $x$, dan $y=2$ ditemukan lebih awal.',
      ),
      hint: L(
        'Read the dot: the first number is $x$ (across), the second is $z$ (up).',
        'Baca titiknya: bilangan pertama adalah $x$ (ke samping), yang kedua adalah $z$ (ke atas).',
      ),
    },
    {
      kind: 'fill',
      id: 'f1',
      math: true,
      prompt: L(
        'Try it together: add $x+z=4$ and $2x-z=-1$.',
        'Coba bersama: jumlahkan $x+z=4$ dan $2x-z=-1$.',
      ),
      template: '3x=___ \\Rightarrow x=___ \\Rightarrow z=4-x=___',
      blanks: ['3', '1', '3'],
      explain: L(
        'Adding gives $3x=3$, so $x=1$ and $z=4-1=3$.',
        'Menjumlahkan memberi $3x=3$, jadi $x=1$ dan $z=4-1=3$.',
      ),
      hint: L(
        'On adding, $+z$ and $-z$ cancel. The right sides add up to $4+(-1)$.',
        'Saat dijumlahkan, $+z$ dan $-z$ saling menghapus. Ruas kanan berjumlah $4+(-1)$.',
      ),
    },
    {
      kind: 'multi',
      id: 'mc1',
      prompt: L(
        'Choose the TWO triples $(x,y,z)$ that satisfy both $x+y+z=6$ and $x-y+z=2$.',
        'Pilih DUA tripel $(x,y,z)$ yang memenuhi sekaligus $x+y+z=6$ dan $x-y+z=2$.',
      ),
      options: [L('$(1,2,3)$', '$(1,2,3)$'), L('$(2,2,2)$', '$(2,2,2)$'), L('$(3,1,2)$', '$(3,1,2)$'), L('$(1,3,2)$', '$(1,3,2)$')],
      answer: [0, 1],
      explain: L(
        'Both equations hold for $(1,2,3)$ and $(2,2,2)$ ($y=2$ and $x+z=4$). For $(3,1,2)$ the second gives $4$, and for $(1,3,2)$ it gives $0$.',
        'Kedua persamaan berlaku untuk $(1,2,3)$ dan $(2,2,2)$ ($y=2$ dan $x+z=4$). Untuk $(3,1,2)$ yang kedua memberi $4$, dan untuk $(1,3,2)$ memberi $0$.',
      ),
      hint: L(
        'Substitute each triple into both equations.',
        'Substitusikan tiap tripel ke kedua persamaan.',
      ),
    },
    {
      kind: 'judge',
      id: 'j1',
      prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
      statements: [
        L('A system of three linear equations in three unknowns always has exactly one solution.', 'Sistem tiga persamaan linear dengan tiga variabel selalu punya tepat satu penyelesaian.'),
        L('A solution must be checked in all three original equations.', 'Penyelesaian harus diperiksa di ketiga persamaan semula.'),
        L('Adding two equations removes a variable when its coefficients are opposites.', 'Menjumlahkan dua persamaan menghilangkan satu variabel bila koefisiennya berlawanan.'),
        L('$(0,0,0)$ is a solution of $x+y+z=6$.', '$(0,0,0)$ adalah penyelesaian $x+y+z=6$.'),
      ],
      answer: [false, true, true, false],
      explain: L(
        'Such a system can have no solution or infinitely many. Opposite coefficients cancel when added, and $0+0+0=0\\neq6$.',
        'Sistem seperti itu dapat tidak punya penyelesaian atau tak hingga banyak. Koefisien berlawanan saling menghapus bila dijumlahkan, dan $0+0+0=0\\neq6$.',
      ),
      hint: L(
        'Think of two parallel lines: can a system have no solution?',
        'Bayangkan dua garis sejajar: dapatkah sistem tidak punya penyelesaian?',
      ),
    },
    {
      kind: 'math',
      id: 'm1',
      prompt: L(
        '2 pens and 1 book cost Rp9,000. 1 pen, 2 books and 1 ruler cost Rp13,000. 1 book and 1 ruler cost Rp6,000. How many rupiah is one book?',
        '2 pena dan 1 buku berharga Rp9.000. 1 pena, 2 buku, dan 1 penggaris berharga Rp13.000. 1 buku dan 1 penggaris berharga Rp6.000. Berapa rupiah harga satu buku?',
      ),
      blanks: [{ label: 'Rp', answer: 5000 }],
      hints: [
        L('Write three equations with $p$, $b$ and $r$ (in thousands).', 'Tulis tiga persamaan dengan $p$, $b$, dan $r$ (dalam ribuan).'),
        L('From $b+r=6$ get $r=6-b$, and put it in the second equation to find $p+b=7$.', 'Dari $b+r=6$ diperoleh $r=6-b$, dan masukkan ke persamaan kedua untuk mendapat $p+b=7$.'),
        L('Subtract $p+b=7$ from $2p+b=9$.', 'Kurangkan $p+b=7$ dari $2p+b=9$.'),
      ],
      explain: L(
        '$p=2$, so $b=7-2=5$, which is Rp5,000. (And $r=1$.)',
        '$p=2$, jadi $b=7-2=5$, yaitu Rp5.000. (Dan $r=1$.)',
      ),
      solution: { en: ['p+b=7 \\quad 2p+b=9 \\Rightarrow p=2', 'b=7-2=5 \\ \\text{(thousand rupiah)}'], id: ['p+b=7 \\quad 2p+b=9 \\Rightarrow p=2', 'b=7-2=5 \\ \\text{(ribu rupiah)}'] },
    },
  ],
}
