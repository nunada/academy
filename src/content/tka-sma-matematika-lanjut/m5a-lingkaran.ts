import type { Submodule } from '../types'
import { L, circle, dot, line, plane, solid } from './figs'
import type { Pt } from './figs'

/** Module 5 — the circle: its equation, tangent lines, arcs, sectors and
 *  segments. */

/** The polygon that approximates a sector of radius `r` and angle `deg`. */
const sectorPts = (r: number, deg: number): Pt[] => {
  const n = 24
  const out: Pt[] = [[0, 0]]
  for (let i = 0; i <= n; i++) {
    const t = (deg * Math.PI * i) / (180 * n)
    out.push([Number((r * Math.cos(t)).toFixed(4)), Number((r * Math.sin(t)).toFixed(4))])
  }
  return out
}

const center2 = () =>
  plane([circle([2, -1], 5, 'a'), dot([2, -1], undefined, 'result'), dot([6, 2], undefined, 'b'), line([2, -1], [6, 2], 'muted')], { x: [-5, 9], y: [-7, 7] })

const tangent = () =>
  plane(
    [
      circle([0, 0], 5, 'a'),
      { t: 'curve', f: '(25-3*x)/4', from: -1, to: 7.5, color: 'b' },
      line([0, 0], [3, 4], 'muted'),
      dot([3, 4], undefined, 'result'),
      dot([0, 0], undefined, 'muted'),
    ],
    { x: [-7, 9], y: [-7, 8] },
  )

const sector = () => plane([solid(sectorPts(6, 60), 'a'), dot([0, 0], undefined, 'result')], { x: [-1, 8], y: [-1, 7] })

export const m5s1: Submodule = {
  id: 'tka-sml-m5-s1',
  title: L('The Circle', 'Lingkaran'),
  summary: L(
    'The equation of a circle, tangent lines, and the arc, sector and segment of a circle.',
    'Persamaan lingkaran, garis singgung, serta busur, juring, dan tembereng lingkaran.',
  ),
  lessons: [
    /* ----------------------------------------------------- L1 the equation */
    {
      id: 'tka-sml-m5-s1-l1',
      title: L('The Equation of a Circle', 'Persamaan Lingkaran'),
      goal: L(
        'You can write and read the equation of a circle, convert the general form, and decide whether a point or a line meets a circle.',
        'Kamu bisa menulis dan membaca persamaan lingkaran, mengubah bentuk umum, dan menentukan apakah titik atau garis memotong lingkaran.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Distance From the Centre', 'Ayo Amati: Jarak dari Pusat'),
          body: L(
            'A circle is all points at the distance $r$ from the centre $(a,b)$. By Pythagoras, the point $(x,y)$ is on it when\n\n$$(x-a)^2+(y-b)^2=r^2$$\n\nThe picture shows $(x-2)^2+(y+1)^2=25$: centre $(2,-1)$ and radius $5$. Notice the signs: $y+1=y-(-1)$, so the centre has $b=-1$.\n\nThe red point $(6,2)$ is on the circle: $(6-2)^2+(2+1)^2=16+9=25$ ✓. It is at the end of a radius.',
            'Lingkaran adalah semua titik yang berjarak $r$ dari pusat $(a,b)$. Dengan Pythagoras, titik $(x,y)$ ada padanya bila\n\n$$(x-a)^2+(y-b)^2=r^2$$\n\nGambar menunjukkan $(x-2)^2+(y+1)^2=25$: pusat $(2,-1)$ dan jari-jari $5$. Perhatikan tandanya: $y+1=y-(-1)$, jadi pusatnya berkoordinat $b=-1$.\n\nTitik merah $(6,2)$ ada pada lingkaran: $(6-2)^2+(2+1)^2=16+9=25$ ✓. Ia berada di ujung sebuah jari-jari.',
          ),
          figure: {
            ...center2(),
            caption: L('The circle with centre (2, −1) and radius 5. The orange point (6, 2) is on it.', 'Lingkaran berpusat (2, −1) dan berjari-jari 5. Titik oranye (6, 2) ada padanya.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: The General Form', 'Contoh Bertahap: Bentuk Umum'),
          body: L(
            'Expanding gives the **general form** $x^2+y^2+Ax+By+C=0$. To read the centre and radius, **complete the square**:\n\n$$\\text{centre }\\left(-\\frac A2,\\,-\\frac B2\\right)\\qquad r^2=\\frac{A^2}{4}+\\frac{B^2}{4}-C$$\n\nFind the circle $x^2+y^2-4x+6y-12=0$.\n\n1. Step 1: $(x^2-4x)+(y^2+6y)=12$.\n2. Step 2: Complete the squares: $(x-2)^2-4+(y+3)^2-9=12$.\n3. Step 3: $(x-2)^2+(y+3)^2=25$: centre $(2,-3)$, radius $5$.\n\nThe equation only describes a circle when $r^2>0$.',
            'Menjabarkan memberi **bentuk umum** $x^2+y^2+Ax+By+C=0$. Untuk membaca pusat dan jari-jari, **lengkapkan kuadrat**:\n\n$$\\text{pusat }\\left(-\\frac A2,\\,-\\frac B2\\right)\\qquad r^2=\\frac{A^2}{4}+\\frac{B^2}{4}-C$$\n\nCari lingkaran $x^2+y^2-4x+6y-12=0$.\n\n1. Langkah 1: $(x^2-4x)+(y^2+6y)=12$.\n2. Langkah 2: Lengkapkan kuadrat: $(x-2)^2-4+(y+3)^2-9=12$.\n3. Langkah 3: $(x-2)^2+(y+3)^2=25$: pusat $(2,-3)$, jari-jari $5$.\n\nPersamaan itu hanya menggambarkan lingkaran bila $r^2>0$.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Points and Lines Against a Circle', 'Contoh Bertahap: Titik dan Garis terhadap Lingkaran'),
          body: L(
            'Substitute a point into $(x-a)^2+(y-b)^2$ and compare with $r^2$: **less** means inside, **equal** means on the circle, **more** means outside.\n\nFor a line, substitute it into the circle. Take $(x-2)^2+(y+1)^2=25$:\n\n- the line $y=2$: $(x-2)^2+9=25$, so $(x-2)^2=16$ and $x=-2$ or $x=6$. **Two** points.\n- the line $y=4$: $(x-2)^2+25=25$, so $x=2$. **One** point: the line touches.\n- the line $y=5$: $(x-2)^2+36=25$ has no solution. **No** point.\n\nSo a line meets a circle in $0$, $1$ or $2$ points.',
            'Substitusikan titik ke $(x-a)^2+(y-b)^2$ dan bandingkan dengan $r^2$: **kurang** berarti di dalam, **sama** berarti pada lingkaran, **lebih** berarti di luar.\n\nUntuk garis, substitusikan ke lingkaran. Ambil $(x-2)^2+(y+1)^2=25$:\n\n- garis $y=2$: $(x-2)^2+9=25$, jadi $(x-2)^2=16$ dan $x=-2$ atau $x=6$. **Dua** titik.\n- garis $y=4$: $(x-2)^2+25=25$, jadi $x=2$. **Satu** titik: garis menyinggung.\n- garis $y=5$: $(x-2)^2+36=25$ tidak punya penyelesaian. **Tidak ada** titik.\n\nJadi garis memotong lingkaran di $0$, $1$, atau $2$ titik.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The circle has its centre at the red point (2, −1) and passes through the orange point (6, 2). Which is its equation?',
            'Lingkaran berpusat di titik merah (2, −1) dan melalui titik oranye (6, 2). Manakah persamaannya?',
          ),
          figure: {
            ...center2(),
            caption: L('A circle through the orange point.', 'Lingkaran melalui titik oranye.'),
          },
          options: [
            '(x-2)^2+(y+1)^2=25',
            '(x+2)^2+(y-1)^2=25',
            '(x-2)^2+(y+1)^2=5',
            '(x-2)^2+(y-1)^2=25',
            '(x+2)^2+(y+1)^2=25',
          ].map((s) => L(`$${s}$`, `$${s}$`)),
          answer: 0,
          explain: L(
            'The centre $(2,-1)$ gives $(x-2)^2+(y+1)^2$. The radius is the distance to $(6,2)$: $\\sqrt{4^2+3^2}=5$, so the right side is $r^2=25$, not $5$. The options with $(x+2)$ or $(y-1)$ have the wrong signs for the centre.',
            'Pusat $(2,-1)$ memberi $(x-2)^2+(y+1)^2$. Jari-jarinya adalah jarak ke $(6,2)$: $\\sqrt{4^2+3^2}=5$, jadi ruas kanan adalah $r^2=25$, bukan $5$. Pilihan dengan $(x+2)$ atau $(y-1)$ salah tanda untuk pusatnya.',
          ),
          hint: L(
            'Write the centre into the brackets with the opposite signs, then find $r^2$ from the distance to the orange point.',
            'Tulis pusat ke dalam kurung dengan tanda berlawanan, lalu cari $r^2$ dari jarak ke titik oranye.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L('Try it together: read the circle $(x-2)^2+(y+1)^2=25$.', 'Coba bersama: baca lingkaran $(x-2)^2+(y+1)^2=25$.'),
          template: '(a,b)=(___,\\ ___) \\qquad r=\\sqrt{25}=___',
          blanks: ['2', '-1', '5'],
          explain: L('The centre is $(2,-1)$ and $r=\\sqrt{25}=5$.', 'Pusatnya $(2,-1)$ dan $r=\\sqrt{25}=5$.'),
          hint: L('The signs in the brackets are the opposite of the centre.', 'Tanda dalam kurung berlawanan dengan pusat.'),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L(
            'Choose ALL the points on the circle $(x-2)^2+(y+1)^2=25$.',
            'Pilih SEMUA titik pada lingkaran $(x-2)^2+(y+1)^2=25$.',
          ),
          options: ['(6,2)', '(-2,-1)', '(2,4)', '(3,3)', '(0,0)'].map((s) => L(`$${s}$`, `$${s}$`)),
          answer: [0, 2],
          explain: L(
            '$(6,2)$: $16+9=25$ ✓. $(2,4)$: $0+25=25$ ✓. $(-2,-1)$ gives $16$, $(3,3)$ gives $17$ and $(0,0)$ gives $5$: all less than $25$, so they are inside.',
            '$(6,2)$: $16+9=25$ ✓. $(2,4)$: $0+25=25$ ✓. $(-2,-1)$ memberi $16$, $(3,3)$ memberi $17$ dan $(0,0)$ memberi $5$: semuanya kurang dari $25$, jadi ada di dalam.',
          ),
          hint: L('Substitute each point and see whether you get $25$.', 'Substitusikan tiap titik dan lihat apakah hasilnya $25$.'),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L(
            'Let the circle be $x^2+y^2-4x+6y-12=0$. Decide whether each statement is True or False.',
            'Misalkan lingkarannya $x^2+y^2-4x+6y-12=0$. Tentukan tiap pernyataan Benar atau Salah.',
          ),
          statements: [
            L('The centre is $(2,-3)$.', 'Pusatnya $(2,-3)$.'),
            L('The radius is $5$.', 'Jari-jarinya $5$.'),
            L('The point $(2,2)$ is on the circle.', 'Titik $(2,2)$ ada pada lingkaran.'),
            L('The centre is $(-2,3)$.', 'Pusatnya $(-2,3)$.'),
          ],
          answer: [true, true, true, false],
          explain: L(
            'Completing the squares gives $(x-2)^2+(y+3)^2=25$. The point $(2,2)$: $0+25=25$ ✓. The centre is not $(-2,3)$; that has the signs of the equation, not of the centre.',
            'Melengkapkan kuadrat memberi $(x-2)^2+(y+3)^2=25$. Titik $(2,2)$: $0+25=25$ ✓. Pusatnya bukan $(-2,3)$; itu tanda pada persamaan, bukan pada pusat.',
          ),
          hint: L('Complete the square in $x$ and in $y$.', 'Lengkapkan kuadrat dalam $x$ dan dalam $y$.'),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'Find the radius of the circle $x^2+y^2+8x-6y+9=0$.',
            'Cari jari-jari lingkaran $x^2+y^2+8x-6y+9=0$.',
          ),
          blanks: [{ label: 'r =', answer: 4 }],
          hints: [
            L('Complete the square in $x$ and in $y$.', 'Lengkapkan kuadrat dalam $x$ dan dalam $y$.'),
            L('$(x+4)^2-16+(y-3)^2-9+9=0$.', '$(x+4)^2-16+(y-3)^2-9+9=0$.'),
            L('So $(x+4)^2+(y-3)^2=16$.', 'Jadi $(x+4)^2+(y-3)^2=16$.'),
          ],
          explain: L('$r^2=16$, so $r=4$.', '$r^2=16$, jadi $r=4$.'),
          solution: ['(x+4)^2+(y-3)^2=16+9-9', 'r=\\sqrt{16}=4'],
        },
      ],
    },
    /* ------------------------------------------------------- L2 tangents */
    {
      id: 'tka-sml-m5-s1-l2',
      title: L('Tangent Lines', 'Garis Singgung'),
      goal: L(
        'You can find the tangent at a point of a circle, decide when a line is tangent, and find the length of a tangent from an outside point.',
        'Kamu bisa mencari garis singgung di titik pada lingkaran, menentukan kapan garis menyinggung, dan mencari panjang garis singgung dari titik di luar.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Perpendicular to the Radius', 'Ayo Amati: Tegak Lurus pada Jari-Jari'),
          body: L(
            'A **tangent** touches the circle at exactly one point, and it is **perpendicular to the radius** there.\n\nTake $x^2+y^2=25$ and the point $P(3,4)$. The radius to $P$ has slope $\\frac43$, so the tangent has slope $-\\frac34$ and passes through $P$:\n\n$$y-4=-\\tfrac34(x-3)\\ \\iff\\ 3x+4y=25$$\n\nA shortcut for a circle centred at the origin: the tangent at $(x_1,y_1)$ is $x_1x+y_1y=r^2$. Here $3x+4y=25$ ✓.',
            '**Garis singgung** menyentuh lingkaran di tepat satu titik, dan **tegak lurus pada jari-jari** di situ.\n\nAmbil $x^2+y^2=25$ dan titik $P(3,4)$. Jari-jari ke $P$ bergradien $\\frac43$, jadi garis singgung bergradien $-\\frac34$ dan melalui $P$:\n\n$$y-4=-\\tfrac34(x-3)\\ \\iff\\ 3x+4y=25$$\n\nJalan pintas untuk lingkaran berpusat di titik asal: garis singgung di $(x_1,y_1)$ adalah $x_1x+y_1y=r^2$. Di sini $3x+4y=25$ ✓.',
          ),
          figure: {
            ...tangent(),
            caption: L('The circle x² + y² = 25, the radius to P(3, 4) and the tangent at P (orange).', 'Lingkaran x² + y² = 25, jari-jari ke P(3, 4), dan garis singgung di P (oranye).'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: The Tangent at a Point', 'Contoh Bertahap: Garis Singgung di Suatu Titik'),
          body: L(
            'For a circle with centre $(a,b)$, the tangent at $(x_1,y_1)$ is\n\n$$(x_1-a)(x-a)+(y_1-b)(y-b)=r^2$$\n\nFind the tangent to $(x-2)^2+(y+1)^2=25$ at $P(6,2)$.\n\n1. Step 1: Check $P$ is on the circle: $16+9=25$ ✓.\n2. Step 2: $x_1-a=4$ and $y_1-b=2-(-1)=3$.\n3. Step 3: $4(x-2)+3(y+1)=25$, so $4x+3y-5=25$.\n4. Step 4: $4x+3y=30$. Check $P$: $24+6=30$ ✓.\n\nThe radius direction $(4,3)$ is the normal of the tangent line $4x+3y=30$.',
            'Untuk lingkaran berpusat $(a,b)$, garis singgung di $(x_1,y_1)$ adalah\n\n$$(x_1-a)(x-a)+(y_1-b)(y-b)=r^2$$\n\nCari garis singgung $(x-2)^2+(y+1)^2=25$ di $P(6,2)$.\n\n1. Langkah 1: Periksa $P$ ada pada lingkaran: $16+9=25$ ✓.\n2. Langkah 2: $x_1-a=4$ dan $y_1-b=2-(-1)=3$.\n3. Langkah 3: $4(x-2)+3(y+1)=25$, jadi $4x+3y-5=25$.\n4. Langkah 4: $4x+3y=30$. Periksa $P$: $24+6=30$ ✓.\n\nArah jari-jari $(4,3)$ adalah normal garis singgung $4x+3y=30$.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: When Is a Line Tangent?', 'Contoh Bertahap: Kapan Garis Menyinggung?'),
          body: L(
            'A line is tangent exactly when the **distance from the centre to the line equals the radius**. The distance from $(a,b)$ to $px+qy+k=0$ is\n\n$$\\frac{|pa+qb+k|}{\\sqrt{p^2+q^2}}$$\n\n1. Step 1: When is $3x+4y=k$ tangent to $x^2+y^2=16$? The distance from the origin is $\\frac{|k|}{\\sqrt{9+16}}=\\frac{|k|}{5}$.\n2. Step 2: Set it equal to $r=4$: $|k|=20$, so $k=\\pm20$.\n\n**A circle from its tangent.** Find the circle with centre $A(-2,1)$ tangent to the line $4x+3y-20=0$. The radius is the distance from $A$ to the line: $\\frac{|4(-2)+3(1)-20|}{\\sqrt{16+9}}=\\frac{25}{5}=5$. So the circle is $(x+2)^2+(y-1)^2=25$.\n\n**Tangent length.** From an outside point $P$ at distance $d$ from the centre, the tangent is $\\sqrt{d^2-r^2}$ long (Pythagoras: the radius is perpendicular to the tangent). For $P(13,0)$ and $x^2+y^2=25$: $\\sqrt{169-25}=12$.',
            'Garis menyinggung tepat ketika **jarak dari pusat ke garis sama dengan jari-jari**. Jarak dari $(a,b)$ ke $px+qy+k=0$ adalah\n\n$$\\frac{|pa+qb+k|}{\\sqrt{p^2+q^2}}$$\n\n1. Langkah 1: Kapan $3x+4y=k$ menyinggung $x^2+y^2=16$? Jarak dari titik asal adalah $\\frac{|k|}{\\sqrt{9+16}}=\\frac{|k|}{5}$.\n2. Langkah 2: Samakan dengan $r=4$: $|k|=20$, jadi $k=\\pm20$.\n\n**Lingkaran dari garis singgungnya.** Cari lingkaran berpusat $A(-2,1)$ yang menyinggung garis $4x+3y-20=0$. Jari-jarinya adalah jarak $A$ ke garis: $\\frac{|4(-2)+3(1)-20|}{\\sqrt{16+9}}=\\frac{25}{5}=5$. Jadi lingkarannya $(x+2)^2+(y-1)^2=25$.\n\n**Panjang garis singgung.** Dari titik luar $P$ yang berjarak $d$ dari pusat, garis singgungnya sepanjang $\\sqrt{d^2-r^2}$ (Pythagoras: jari-jari tegak lurus pada garis singgung). Untuk $P(13,0)$ dan $x^2+y^2=25$: $\\sqrt{169-25}=12$.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'What is the equation of the tangent to $x^2+y^2=25$ at the red point P(3, 4)?',
            'Apa persamaan garis singgung pada $x^2+y^2=25$ di titik merah P(3, 4)?',
          ),
          figure: {
            ...tangent(),
            caption: L('The circle with the point P(3, 4).', 'Lingkaran dengan titik P(3, 4).'),
          },
          options: ['3x+4y=25', '4x+3y=25', '3x-4y=25', '3x+4y=5', 'x+y=7'].map((s) => L(`$${s}$`, `$${s}$`)),
          answer: 0,
          explain: L(
            'For a circle centred at the origin the tangent at $(x_1,y_1)$ is $x_1x+y_1y=r^2$, which is $3x+4y=25$. The option $4x+3y=25$ swaps the coordinates and does not pass through $P$: $12+12=24\\ne25$.',
            'Untuk lingkaran berpusat di titik asal garis singgung di $(x_1,y_1)$ adalah $x_1x+y_1y=r^2$, yaitu $3x+4y=25$. Pilihan $4x+3y=25$ menukar koordinat dan tidak melalui $P$: $12+12=24\\ne25$.',
          ),
          hint: L('Use $x_1x+y_1y=r^2$ and check that $P$ is on the line.', 'Pakai $x_1x+y_1y=r^2$ dan periksa bahwa $P$ ada pada garis.'),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L('Try it together: complete the tangent equation.', 'Coba bersama: lengkapi persamaan garis singgung.'),
          template: 'x_1x+y_1y=r^2:\\quad 3x+4y=___',
          blanks: ['25'],
          explain: L('$r^2=25$.', '$r^2=25$.'),
          hint: L('The right side is the radius squared.', 'Ruas kanan adalah jari-jari kuadrat.'),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L('A tangent is perpendicular to the radius at the point of tangency.', 'Garis singgung tegak lurus pada jari-jari di titik singgung.'),
            L('The line $y=5$ is tangent to $x^2+y^2=25$.', 'Garis $y=5$ menyinggung $x^2+y^2=25$.'),
            L('The line $y=4$ is tangent to $x^2+y^2=25$.', 'Garis $y=4$ menyinggung $x^2+y^2=25$.'),
            L('A tangent meets the circle in exactly two points.', 'Garis singgung memotong lingkaran di tepat dua titik.'),
          ],
          answer: [0, 1],
          explain: L(
            'The distance from the origin to $y=5$ is $5=r$, so it touches. The line $y=4$ is at distance $4<5$, so it cuts the circle twice. A tangent has exactly one common point.',
            'Jarak dari titik asal ke $y=5$ adalah $5=r$, jadi ia menyentuh. Garis $y=4$ berjarak $4<5$, jadi memotong lingkaran dua kali. Garis singgung memiliki tepat satu titik persekutuan.',
          ),
          hint: L('Compare the distance from the centre with the radius.', 'Bandingkan jarak dari pusat dengan jari-jari.'),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L(
            'Let the circle be $(x-2)^2+(y+1)^2=25$ and $P=(6,2)$. Decide whether each statement is True or False.',
            'Misalkan lingkarannya $(x-2)^2+(y+1)^2=25$ dan $P=(6,2)$. Tentukan tiap pernyataan Benar atau Salah.',
          ),
          statements: [
            L('$P$ lies on the circle.', '$P$ terletak pada lingkaran.'),
            L('The radius from the centre to $P$ has slope $\\frac34$.', 'Jari-jari dari pusat ke $P$ bergradien $\\frac34$.'),
            L('The tangent at $P$ is $4x+3y=30$.', 'Garis singgung di $P$ adalah $4x+3y=30$.'),
            L('The tangent at $P$ has slope $\\frac34$.', 'Garis singgung di $P$ bergradien $\\frac34$.'),
          ],
          answer: [true, true, true, false],
          explain: L(
            'The slope of the radius is $\\frac{2-(-1)}{6-2}=\\frac34$. The tangent is perpendicular, so its slope is $-\\frac43$, which agrees with $4x+3y=30$. It is not $\\frac34$.',
            'Gradien jari-jari adalah $\\frac{2-(-1)}{6-2}=\\frac34$. Garis singgung tegak lurus, jadi gradiennya $-\\frac43$, yang sesuai dengan $4x+3y=30$. Gradiennya bukan $\\frac34$.',
          ),
          hint: L('Find the slope of the radius first. The tangent is perpendicular to it.', 'Cari dulu gradien jari-jari. Garis singgung tegak lurus padanya.'),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'The line $3x+4y=k$ with $k>0$ is tangent to $x^2+y^2=16$. Find $k$.',
            'Garis $3x+4y=k$ dengan $k>0$ menyinggung $x^2+y^2=16$. Tentukan $k$.',
          ),
          blanks: [{ label: 'k =', answer: 20 }],
          hints: [
            L('Tangent means the distance from the centre equals the radius.', 'Menyinggung berarti jarak dari pusat sama dengan jari-jari.'),
            L('The distance from the origin is $\\frac{k}{\\sqrt{3^2+4^2}}=\\frac{k}{5}$.', 'Jarak dari titik asal adalah $\\frac{k}{\\sqrt{3^2+4^2}}=\\frac{k}{5}$.'),
            L('Set $\\frac{k}{5}=4$.', 'Samakan $\\frac{k}{5}=4$.'),
          ],
          explain: L('$\\frac{k}{5}=4$ gives $k=20$.', '$\\frac{k}{5}=4$ memberi $k=20$.'),
          solution: ['d=\\frac{k}{\\sqrt{9+16}}=\\frac{k}{5}=4', 'k=20'],
        },
      ],
    },
    /* ------------------------------------------------ L3 arcs, sectors */
    {
      id: 'tka-sml-m5-s1-l3',
      title: L('Arcs, Sectors and Segments', 'Busur, Juring, dan Tembereng'),
      goal: L(
        'You can find the length of an arc, the area of a sector and of a segment, and the area and perimeter of regions made of circles.',
        'Kamu bisa mencari panjang busur, luas juring dan tembereng, serta luas dan keliling daerah yang tersusun dari lingkaran.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: A Slice of the Circle', 'Ayo Amati: Seiris Lingkaran'),
          body: L(
            'A **sector** is a slice with a central angle $\\theta$. It is the fraction $\\frac{\\theta}{360^{\\circ}}$ of the whole circle:\n\n$$\\text{arc}=\\frac{\\theta}{360^{\\circ}}\\cdot2\\pi r\\qquad\\text{area}=\\frac{\\theta}{360^{\\circ}}\\cdot\\pi r^2$$\n\nFor $r=6$ and $\\theta=60^{\\circ}$ (the fraction is $\\frac16$):\n\n1. Step 1: Arc: $\\frac16\\cdot12\\pi=2\\pi$.\n2. Step 2: Area: $\\frac16\\cdot36\\pi=6\\pi$.\n3. Step 3: The perimeter of the sector adds the two radii: $12+2\\pi$.',
            '**Juring** adalah seiris dengan sudut pusat $\\theta$. Ia adalah bagian $\\frac{\\theta}{360^{\\circ}}$ dari seluruh lingkaran:\n\n$$\\text{busur}=\\frac{\\theta}{360^{\\circ}}\\cdot2\\pi r\\qquad\\text{luas}=\\frac{\\theta}{360^{\\circ}}\\cdot\\pi r^2$$\n\nUntuk $r=6$ dan $\\theta=60^{\\circ}$ (bagiannya $\\frac16$):\n\n1. Langkah 1: Busur: $\\frac16\\cdot12\\pi=2\\pi$.\n2. Langkah 2: Luas: $\\frac16\\cdot36\\pi=6\\pi$.\n3. Langkah 3: Keliling juring menambahkan dua jari-jari: $12+2\\pi$.',
          ),
          figure: {
            ...sector(),
            caption: L('A sector of radius 6 and central angle 60°.', 'Juring berjari-jari 6 dan sudut pusat 60°.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: The Segment', 'Contoh Bertahap: Tembereng'),
          body: L(
            'A **segment** is the part between a chord and its arc. Its area is the sector **minus the triangle** formed by the two radii and the chord.\n\nFor $r=4$ and $\\theta=90^{\\circ}$:\n\n1. Step 1: Sector: $\\frac14\\cdot\\pi\\cdot16=4\\pi$.\n2. Step 2: Triangle: a right triangle with legs $4$ and $4$: $\\frac12\\cdot4\\cdot4=8$.\n3. Step 3: Segment: $4\\pi-8$.\n\nIn general the triangle has area $\\frac12r^2\\sin\\theta$.',
            '**Tembereng** adalah bagian antara tali busur dan busurnya. Luasnya adalah juring **dikurangi segitiga** yang dibentuk oleh dua jari-jari dan tali busur.\n\nUntuk $r=4$ dan $\\theta=90^{\\circ}$:\n\n1. Langkah 1: Juring: $\\frac14\\cdot\\pi\\cdot16=4\\pi$.\n2. Langkah 2: Segitiga: segitiga siku-siku dengan sisi $4$ dan $4$: $\\frac12\\cdot4\\cdot4=8$.\n3. Langkah 3: Tembereng: $4\\pi-8$.\n\nSecara umum segitiganya berluas $\\frac12r^2\\sin\\theta$.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Shaded Regions', 'Contoh Bertahap: Daerah Arsiran'),
          body: L(
            'For regions made of circles, **add or subtract** simple pieces.\n\n- **Square with an inscribed circle** (side $8$): the circle has $r=4$ and area $16\\pi$. The four shaded corners together have area $64-16\\pi$.\n- **Ring** (outer radius $R$, inner radius $r$): area $\\pi(R^2-r^2)$.\n- **Perimeter** of a composite shape: add only the lengths of the **outer boundary**; a shared edge is not on the boundary.\n\nA rectangle $10\\times6$ with a semicircle on a $6$ side has perimeter $10+10+6+\\pi\\cdot3$ (the semicircle replaces one side of $6$).',
            'Untuk daerah yang tersusun dari lingkaran, **jumlahkan atau kurangkan** bagian-bagian sederhana.\n\n- **Persegi dengan lingkaran dalam** (sisi $8$): lingkaran berjari-jari $4$ dan luas $16\\pi$. Keempat sudut yang diarsir bersama-sama berluas $64-16\\pi$.\n- **Cincin** (jari-jari luar $R$, jari-jari dalam $r$): luas $\\pi(R^2-r^2)$.\n- **Keliling** bangun gabungan: jumlahkan hanya panjang **batas luar**; sisi bersama bukan bagian batas.\n\nPersegi panjang $10\\times6$ dengan setengah lingkaran pada sisi $6$ berkeliling $10+10+6+\\pi\\cdot3$ (setengah lingkaran menggantikan satu sisi $6$).',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'What is the area of the sector in the picture, with radius 6 and central angle 60°?',
            'Berapa luas juring pada gambar, berjari-jari 6 dan bersudut pusat 60°?',
          ),
          figure: {
            ...sector(),
            caption: L('A sector of radius 6 and angle 60°.', 'Juring berjari-jari 6 dan bersudut 60°.'),
          },
          options: ['6\\pi', '12\\pi', '36\\pi', '2\\pi', '3\\pi'].map((s) => L(`$${s}$`, `$${s}$`)),
          answer: 0,
          explain: L(
            '$\\frac{60}{360}\\cdot\\pi\\cdot6^2=\\frac16\\cdot36\\pi=6\\pi$. The value $2\\pi$ is the arc length, and $36\\pi$ is the whole circle.',
            '$\\frac{60}{360}\\cdot\\pi\\cdot6^2=\\frac16\\cdot36\\pi=6\\pi$. Nilai $2\\pi$ adalah panjang busur, dan $36\\pi$ adalah seluruh lingkaran.',
          ),
          hint: L('Take the fraction $\\frac{60}{360}$ of the area $\\pi r^2$.', 'Ambil bagian $\\frac{60}{360}$ dari luas $\\pi r^2$.'),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L('Try it together: the area of the sector.', 'Coba bersama: luas juring.'),
          template: '\\frac{60}{360}\\cdot\\pi\\cdot6^2=\\frac16\\cdot36\\pi=___\\pi',
          blanks: ['6'],
          explain: L('$\\frac{60}{360}=\\frac16$, and $\\frac16\\cdot36\\pi=6\\pi$.', '$\\frac{60}{360}=\\frac16$, dan $\\frac16\\cdot36\\pi=6\\pi$.'),
          hint: L('Simplify the fraction first.', 'Sederhanakan dulu pecahannya.'),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L(
            'A sector has $r=4$ and $\\theta=90^{\\circ}$. Choose the TWO true statements.',
            'Sebuah juring memiliki $r=4$ dan $\\theta=90^{\\circ}$. Pilih DUA pernyataan yang benar.',
          ),
          options: [
            L('Its area is $4\\pi$.', 'Luasnya $4\\pi$.'),
            L('Its arc length is $2\\pi$.', 'Panjang busurnya $2\\pi$.'),
            L('The area of its segment is $4\\pi$.', 'Luas temberengnya $4\\pi$.'),
            L('The perimeter of the sector is $2\\pi$.', 'Keliling juringnya $2\\pi$.'),
          ],
          answer: [0, 1],
          explain: L(
            'Area: $\\frac14\\cdot16\\pi=4\\pi$. Arc: $\\frac14\\cdot8\\pi=2\\pi$. The segment is $4\\pi-8$, and the perimeter of the sector is $8+2\\pi$ because it includes the two radii.',
            'Luas: $\\frac14\\cdot16\\pi=4\\pi$. Busur: $\\frac14\\cdot8\\pi=2\\pi$. Temberengnya $4\\pi-8$, dan keliling juring $8+2\\pi$ karena memuat dua jari-jari.',
          ),
          hint: L('The fraction of the circle is $\\frac{90}{360}=\\frac14$.', 'Bagian lingkarannya adalah $\\frac{90}{360}=\\frac14$.'),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L(
            'A circle is drawn inside a square of side $8$, touching all four sides. Decide whether each statement is True or False.',
            'Sebuah lingkaran digambar di dalam persegi bersisi $8$, menyentuh keempat sisinya. Tentukan tiap pernyataan Benar atau Salah.',
          ),
          statements: [
            L('The radius is $4$.', 'Jari-jarinya $4$.'),
            L('The area of the circle is $16\\pi$.', 'Luas lingkaran $16\\pi$.'),
            L('The four corners together have area $64-16\\pi$.', 'Keempat sudut bersama-sama berluas $64-16\\pi$.'),
            L('The four corners together have area $64-8\\pi$.', 'Keempat sudut bersama-sama berluas $64-8\\pi$.'),
          ],
          answer: [true, true, true, false],
          explain: L(
            'The diameter equals the side $8$, so $r=4$ and the area is $16\\pi$. The corners are the square minus the circle: $64-16\\pi$.',
            'Diameternya sama dengan sisi $8$, jadi $r=4$ dan luasnya $16\\pi$. Sudut-sudutnya adalah persegi dikurangi lingkaran: $64-16\\pi$.',
          ),
          hint: L('The diameter of the circle is the side of the square.', 'Diameter lingkaran adalah sisi persegi.'),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'A ring has outer radius $7$ and inner radius $3$. Its area is $k\\pi$. Find $k$.',
            'Sebuah cincin berjari-jari luar $7$ dan jari-jari dalam $3$. Luasnya $k\\pi$. Tentukan $k$.',
          ),
          blanks: [{ label: 'k =', answer: 40 }],
          hints: [
            L('Subtract the inner circle from the outer circle.', 'Kurangkan lingkaran dalam dari lingkaran luar.'),
            L('$\\pi\\cdot7^2-\\pi\\cdot3^2$.', '$\\pi\\cdot7^2-\\pi\\cdot3^2$.'),
            L('$49\\pi-9\\pi$.', '$49\\pi-9\\pi$.'),
          ],
          explain: L('$49\\pi-9\\pi=40\\pi$.', '$49\\pi-9\\pi=40\\pi$.'),
          solution: ['\\pi(7^2-3^2)=\\pi(49-9)', '=40\\pi'],
        },
      ],
    },
  ],
  project: {
    id: 'tka-sml-m5-s1-p',
    runtime: 'math',
    title: L('Circles at Work', 'Lingkaran dalam Pemakaian'),
    brief: L(
      'Use equations of circles, tangents, arcs and segments.',
      'Pakai persamaan lingkaran, garis singgung, busur, dan tembereng.',
    ),
    requirements: [
      L('Find the radius from a centre and a point.', 'Mencari jari-jari dari pusat dan sebuah titik.'),
      L('Use the distance from the centre to find a tangent.', 'Memakai jarak dari pusat untuk mencari garis singgung.'),
    ],
    hints: [
      L('The radius is the distance from the centre to a point on the circle.', 'Jari-jari adalah jarak dari pusat ke titik pada lingkaran.'),
      L('Tangent: the distance from the centre equals the radius.', 'Garis singgung: jarak dari pusat sama dengan jari-jari.'),
      L('A segment is a sector minus a triangle.', 'Tembereng adalah juring dikurangi segitiga.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L(
          'A circle has its centre at $(1,2)$ and passes through $(4,6)$. Find $r^2$.',
          'Sebuah lingkaran berpusat di $(1,2)$ dan melalui $(4,6)$. Cari $r^2$.',
        ),
        blanks: [{ label: 'r^2 =', answer: 25 }],
        solution: ['r^2=(4-1)^2+(6-2)^2=9+16', '=25'],
      },
      {
        prompt: L(
          'The line $y=x+k$ with $k>0$ is tangent to $x^2+y^2=8$. Find $k$.',
          'Garis $y=x+k$ dengan $k>0$ menyinggung $x^2+y^2=8$. Tentukan $k$.',
        ),
        blanks: [{ label: 'k =', answer: 4 }],
        solution: ['d=\\frac{k}{\\sqrt2}=\\sqrt8=2\\sqrt2', 'k=4'],
      },
      {
        prompt: L(
          'Find the length of the tangent from $(13,0)$ to the circle $x^2+y^2=25$.',
          'Cari panjang garis singgung dari $(13,0)$ ke lingkaran $x^2+y^2=25$.',
        ),
        blanks: [{ answer: 12 }],
        solution: ['\\sqrt{13^2-5^2}=\\sqrt{144}', '=12'],
      },
      {
        prompt: L(
          'The arc of a sector of radius $9$ and central angle $120^{\\circ}$ has length $k\\pi$. Find $k$.',
          'Busur sebuah juring berjari-jari $9$ dan sudut pusat $120^{\\circ}$ panjangnya $k\\pi$. Tentukan $k$.',
        ),
        blanks: [{ label: 'k =', answer: 6 }],
        solution: ['\\frac{120}{360}\\cdot2\\pi\\cdot9=\\frac13\\cdot18\\pi', '=6\\pi'],
      },
      {
        prompt: L(
          'The segment of a circle of radius $4$ cut off by a chord that subtends $90^{\\circ}$ at the centre has area $k\\pi-8$. Find $k$.',
          'Tembereng lingkaran berjari-jari $4$ yang dipotong oleh tali busur yang menghadap sudut pusat $90^{\\circ}$ berluas $k\\pi-8$. Tentukan $k$.',
        ),
        blanks: [{ label: 'k =', answer: 4 }],
        solution: ['\\frac14\\cdot16\\pi-\\frac12\\cdot4\\cdot4=4\\pi-8', '=4\\pi-8'],
      },
    ],
  },
}
