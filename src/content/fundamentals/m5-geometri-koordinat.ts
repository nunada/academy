import type { Module } from '../types'

/** Module 5 — algebra meets geometry: a point becomes a pair of numbers, an
 *  equation becomes a curve, and a line's steepness becomes a single number
 *  worth dragging a slider to feel. */
export const module5: Module = {
  id: 'dsr-m5',
  title: { en: 'Coordinate Geometry and Lines', id: 'Geometri Koordinat dan Garis' },
  summary: {
    en: 'The coordinate plane, distance and midpoint, graphs and symmetry, circles, and every form of the equation of a line.',
    id: 'Bidang koordinat, jarak dan titik tengah, grafik dan simetri, lingkaran, dan setiap bentuk persamaan garis.',
  },
  submodules: [
    /* -------------------------------- 1.9 coordinate plane, graphs, circles */
    {
      id: 'dsr-m5-s1',
      title: { en: 'The Coordinate Plane, Distance, and Circles', id: 'Bidang Koordinat, Jarak, dan Lingkaran' },
      summary: {
        en: 'Plotting points, the distance and midpoint formulas, reading a graph for intercepts and symmetry, and the equation of a circle.',
        id: 'Memplot titik, formula jarak dan titik tengah, membaca grafik untuk perpotongan dan simetri, dan persamaan lingkaran.',
      },
      lessons: [
        {
          id: 'dsr-m5-s1-l1',
          title: { en: 'Points, Distance, and the Midpoint Formula', id: 'Titik, Jarak, dan Formula Titik Tengah' },
          goal: {
            en: 'Locate a point by its coordinates, and find the distance and midpoint between two points.',
            id: 'Menentukan letak titik lewat koordinatnya, dan mencari jarak serta titik tengah antara dua titik.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'An ordered pair as an address', id: 'Pasangan terurut sebagai alamat' },
              body: {
                en: 'Two perpendicular number lines, the $x$-axis and $y$-axis, meeting at the **origin** $(0,0)$, turn the plane into a grid. Every point gets a unique **ordered pair** $(a,b)$: $a$ is the $x$-coordinate (how far right, or left if negative), $b$ is the $y$-coordinate (how far up, or down if negative). The axes split the plane into four **quadrants**, numbered I through IV counterclockwise starting from the upper right.',
                id: 'Dua garis bilangan tegak lurus, sumbu-$x$ dan sumbu-$y$, bertemu di **titik asal** $(0,0)$, mengubah bidang menjadi kisi-kisi. Setiap titik mendapat **pasangan terurut** $(a,b)$ yang unik: $a$ adalah koordinat-$x$ (seberapa jauh ke kanan, atau ke kiri jika negatif), $b$ adalah koordinat-$y$ (seberapa jauh ke atas, atau ke bawah jika negatif). Sumbu-sumbunya membagi bidang menjadi empat **kuadran**, dinomori I sampai IV berlawanan arah jarum jam mulai dari kanan atas.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Distance and midpoint', id: 'Jarak dan titik tengah' },
              body: {
                en: 'The Pythagorean Theorem, applied to the horizontal and vertical legs between two points, gives the **Distance Formula**:\n$$d(A,B) = \\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$$\nAnd averaging the coordinates gives the **Midpoint Formula**:\n$$M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)$$\nFor $A(-1,2)$ and $B(5,10)$: $d(A,B)=\\sqrt{6^2+8^2}=\\sqrt{100}=10$, and the midpoint is $\\left(\\frac{-1+5}{2},\\frac{2+10}{2}\\right)=(2,6)$.',
                id: 'Teorema Pythagoras, diterapkan pada sisi tegak dan datar antara dua titik, memberi **Formula Jarak**:\n$$d(A,B) = \\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$$\nDan merata-ratakan koordinatnya memberi **Formula Titik Tengah**:\n$$M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)$$\nUntuk $A(-1,2)$ dan $B(5,10)$: $d(A,B)=\\sqrt{6^2+8^2}=\\sqrt{100}=10$, dan titik tengahnya adalah $\\left(\\frac{-1+5}{2},\\frac{2+10}{2}\\right)=(2,6)$.',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 7],
                ySpan: [-1, 12],
                ticks: true,
                vars: { A: [-1, 2], B: [5, 10] },
                items: [
                  { t: 'point', at: { of: 'A' }, label: 'A' },
                  { t: 'point', at: { of: 'B' }, label: 'B' },
                  { t: 'seg', from: { of: 'A' }, to: { of: 'B' }, color: 'a' },
                  { t: 'dot', x: 2, y: 6, color: 'result', label: 'M' },
                ],
                caption: {
                  en: '$M(2,6)$ is the midpoint of segment $AB$, exactly halfway along it.',
                  id: '$M(2,6)$ adalah titik tengah ruas $AB$, persis di tengah-tengahnya.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which quadrant contains the point $(-3, 5)$?',
                id: 'Kuadran manakah yang memuat titik $(-3, 5)$?',
              },
              options: [
                { en: 'II', id: 'II' },
                { en: 'I', id: 'I' },
                { en: 'III', id: 'III' },
                { en: 'IV', id: 'IV' },
              ],
              answer: 0,
              explain: {
                en: 'Negative $x$, positive $y$ is Quadrant II (upper left).',
                id: '$x$ negatif, $y$ positif adalah Kuadran II (kiri atas).',
              },
              hint: {
                en: 'Check the sign of each coordinate separately, then match that pair of signs to a quadrant\'s position on the plane.',
                id: 'Periksa tanda tiap koordinat secara terpisah, lalu cocokkan pasangan tanda itu dengan posisi kuadran pada bidang.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Which point is closer to $A(5,3)$: $P(1,-2)$ or $Q(8,9)$?',
                id: 'Titik mana yang lebih dekat ke $A(5,3)$: $P(1,-2)$ atau $Q(8,9)$?',
              },
              options: [
                { en: '$P(1,-2)$', id: '$P(1,-2)$' },
                { en: '$Q(8,9)$', id: '$Q(8,9)$' },
                { en: 'They are the same distance', id: 'Jaraknya sama' },
                { en: 'Cannot be determined', id: 'Tak bisa ditentukan' },
              ],
              answer: 0,
              explain: {
                en: '$d(P,A)=\\sqrt{4^2+5^2}=\\sqrt{41}\\approx6.4$, while $d(Q,A)=\\sqrt{3^2+6^2}=\\sqrt{45}\\approx6.7$. $P$ is slightly closer.',
                id: '$d(P,A)=\\sqrt{4^2+5^2}=\\sqrt{41}\\approx6.4$, sedangkan $d(Q,A)=\\sqrt{3^2+6^2}=\\sqrt{45}\\approx6.7$. $P$ sedikit lebih dekat.',
              },
              hint: {
                en: 'Apply the Distance Formula to both pairs — you don\'t even need to take the square root to compare, since the larger squared distance means the farther point.',
                id: 'Terapkan Formula Jarak pada kedua pasangan — kamu bahkan tak perlu mengambil akar kuadratnya untuk membandingkan, sebab jarak terkuadratkan yang lebih besar berarti titik yang lebih jauh.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Find the midpoint of the segment from $(-1, 2)$ to $(5, 10)$.',
                id: 'Cari titik tengah ruas dari $(-1, 2)$ ke $(5, 10)$.',
              },
              template: 'M = \\left(\\dfrac{-1+5}{2}, \\dfrac{2+10}{2}\\right) = ___',
              blanks: ['(2,6)'],
              explain: {
                en: 'Averaging each coordinate gives $M=(2,6)$.',
                id: 'Merata-ratakan tiap koordinat memberi $M=(2,6)$.',
              },
              hint: {
                en: 'This is the exact pair of points worked out in the concept above — just carry out the two averages shown in the template.',
                id: 'Ini persis pasangan titik yang dikerjakan pada konsep di atas — tinggal kerjakan dua rata-rata yang ditunjukkan pada template.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the distance between $(-2, 3)$ and $(4, -5)$.',
                id: 'Cari jarak antara $(-2, 3)$ dan $(4, -5)$.',
              },
              blanks: [{ answer: 10 }],
              hints: [
                { en: '$d = \\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$.', id: '$d = \\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$.' },
              ],
              explain: {
                en: '$d = \\sqrt{6^2+(-8)^2} = \\sqrt{100} = 10$.',
                id: '$d = \\sqrt{6^2+(-8)^2} = \\sqrt{100} = 10$.',
              },
            },
          ],
        },
        {
          id: 'dsr-m5-s1-l2',
          title: { en: 'Graphs, Intercepts, and Symmetry', id: 'Grafik, Perpotongan, dan Simetri' },
          goal: {
            en: 'Find the intercepts of a graph, and test an equation for symmetry about an axis or the origin.',
            id: 'Mencari titik perpotongan sebuah grafik, dan menguji simetri persamaan terhadap sumbu atau titik asal.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Intercepts: set the other variable to zero', id: 'Perpotongan: nolkan variabel yang lain' },
              body: {
                en: 'The graph of an equation is every point $(x,y)$ satisfying it. An $x$-**intercept** is where the graph crosses the $x$-axis — set $y=0$ and solve for $x$. A $y$-**intercept** is where it crosses the $y$-axis — set $x=0$ and solve for $y$.\n\nDrag the slider: the graph is $y=|x-h|$. Its $x$-intercept sits exactly at $x=h$ (where the V-shape touches the axis), and its $y$-intercept is $|h|$, read straight off where the curve meets the $y$-axis.',
                id: 'Grafik sebuah persamaan adalah setiap titik $(x,y)$ yang memenuhinya. Perpotongan-$x$ adalah tempat grafik memotong sumbu-$x$ — nolkan $y$ dan selesaikan untuk $x$. Perpotongan-$y$ adalah tempat ia memotong sumbu-$y$ — nolkan $x$ dan selesaikan untuk $y$.\n\nGeser penggesernya: grafiknya adalah $y=|x-h|$. Perpotongan-$x$-nya persis di $x=h$ (tempat bentuk V-nya menyentuh sumbunya), dan perpotongan-$y$-nya adalah $|h|$, dibaca langsung dari tempat kurvanya bertemu sumbu-$y$.',
              },
              figure: {
                dim: 2,
                xSpan: [-6, 6],
                ySpan: [-1, 8],
                ticks: true,
                params: [{ name: 'h', min: -4, max: 4, step: 0.5, value: 2, label: 'h' }],
                items: [
                  { t: 'curve', f: 'abs(x-h)', color: 'a' },
                  { t: 'dot', x: 'h', y: 0, color: 'result' },
                  { t: 'dot', x: 0, y: 'abs(h)', color: 'muted' },
                ],
                caption: {
                  en: 'The result-colored dot is the $x$-intercept $(h,0)$; the other dot is the $y$-intercept $(0,|h|)$.',
                  id: 'Titik berwarna result adalah perpotongan-$x$ $(h,0)$; titik lainnya adalah perpotongan-$y$ $(0,|h|)$.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Symmetry: a graph that repeats a reflection', id: 'Simetri: grafik yang mengulang refleksi' },
              body: {
                en: 'Test symmetry algebraically, by substituting and checking if the equation is unchanged: for the $x$-**axis**, replace $y$ with $-y$ — unchanged means the graph flips onto itself top-to-bottom; for the $y$-**axis**, replace $x$ with $-x$ — unchanged means left-right symmetry; for the **origin**, replace both — unchanged means $180°$ rotational symmetry.\n\nFor $y=x^2$: replacing $x$ with $-x$ gives $y=(-x)^2=x^2$, unchanged — symmetric about the $y$-axis. For $x=y^2$: replacing $y$ with $-y$ gives $x=(-y)^2=y^2$, unchanged — symmetric about the $x$-axis instead.',
                id: 'Uji simetri secara aljabar, dengan mensubstitusi dan memeriksa apakah persamaannya tak berubah: untuk sumbu-$x$, ganti $y$ dengan $-y$ — tak berubah berarti grafiknya membalik ke dirinya sendiri atas-bawah; untuk sumbu-$y$, ganti $x$ dengan $-x$ — tak berubah berarti simetri kiri-kanan; untuk **titik asal**, ganti keduanya — tak berubah berarti simetri rotasi $180°$.\n\nUntuk $y=x^2$: mengganti $x$ dengan $-x$ memberi $y=(-x)^2=x^2$, tak berubah — simetris terhadap sumbu-$y$. Untuk $x=y^2$: mengganti $y$ dengan $-y$ memberi $x=(-y)^2=y^2$, tak berubah — simetris terhadap sumbu-$x$ sebagai gantinya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What are the $x$-intercepts of $y = x^2 - 2$?',
                id: 'Apa perpotongan-$x$ dari $y = x^2 - 2$?',
              },
              options: [
                { en: '$\\pm\\sqrt{2}$', id: '$\\pm\\sqrt{2}$' },
                { en: '$\\pm 2$', id: '$\\pm 2$' },
                { en: '$-2$ only', id: '$-2$ saja' },
                { en: 'There are none', id: 'Tak ada' },
              ],
              answer: 0,
              explain: {
                en: 'Setting $y=0$: $x^2=2 \\Rightarrow x=\\pm\\sqrt2$.',
                id: 'Menolkan $y$: $x^2=2 \\Rightarrow x=\\pm\\sqrt2$.',
              },
              hint: {
                en: 'An $x$-intercept is where the graph crosses the $x$-axis — set $y$ to zero and solve for $x$.',
                id: 'Perpotongan-$x$ adalah tempat grafik memotong sumbu-$x$ — nolkan $y$ dan selesaikan untuk $x$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Test $y = x^3 - 9x$ for symmetry about the origin: replacing $x$ with $-x$ and $y$ with $-y$ gives:',
                id: 'Uji $y = x^3 - 9x$ untuk simetri terhadap titik asal: mengganti $x$ dengan $-x$ dan $y$ dengan $-y$ memberi:',
              },
              options: [
                { en: '$-y = -x^3+9x$, equivalent to the original — symmetric about the origin', id: '$-y = -x^3+9x$, setara dengan yang asli — simetris terhadap titik asal' },
                { en: 'A completely different equation — no symmetry', id: 'Persamaan yang sama sekali berbeda — tak ada simetri' },
                { en: '$y = x^3 - 9x$ unchanged directly, without needing to flip a sign', id: '$y = x^3 - 9x$ tak berubah langsung, tanpa perlu membalik tanda' },
                { en: 'It shows symmetry about the $y$-axis instead', id: 'Ia menunjukkan simetri terhadap sumbu-$y$ sebagai gantinya' },
              ],
              answer: 0,
              explain: {
                en: '$(-x)^3-9(-x) = -x^3+9x = -(x^3-9x)$, so the new equation is $-y=-(x^3-9x)$, i.e. $y=x^3-9x$ — the same equation. Symmetric about the origin.',
                id: '$(-x)^3-9(-x) = -x^3+9x = -(x^3-9x)$, sehingga persamaan barunya $-y=-(x^3-9x)$, yaitu $y=x^3-9x$ — persamaan yang sama. Simetris terhadap titik asal.',
              },
              hint: {
                en: 'Substitute $-x$ for every $x$ on the right side, simplify, and see whether the whole right side becomes the exact negative of what it was before.',
                id: 'Substitusikan $-x$ untuk setiap $x$ di ruas kanan, sederhanakan, dan lihat apakah seluruh ruas kanan menjadi persis negatif dari sebelumnya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Find the $y$-intercept of $y = x^2 - 2$.',
                id: 'Cari perpotongan-$y$ dari $y = x^2 - 2$.',
              },
              template: 'y = 0^2 - 2 = ___',
              blanks: ['-2'],
              explain: {
                en: 'Setting $x=0$ gives $y=-2$.',
                id: 'Menolkan $x$ memberi $y=-2$.',
              },
              hint: {
                en: 'The template already sets $x$ to $0$ for you — just carry out the arithmetic.',
                id: 'Templatenya sudah menolkan $x$ untukmu — tinggal kerjakan aritmetikanya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the positive $x$-intercept of $y = x^2 - 7$. (Round to two decimal places.)',
                id: 'Cari perpotongan-$x$ positif dari $y = x^2 - 7$. (Bulatkan ke dua desimal.)',
              },
              blanks: [{ answer: Math.sqrt(7), tol: 0.01 }],
              hints: [
                { en: 'Set $y=0$ and solve for $x$.', id: 'Nolkan $y$ dan selesaikan untuk $x$.' },
              ],
              explain: {
                en: '$x^2=7 \\Rightarrow x=\\sqrt7\\approx2{,}65$.',
                id: '$x^2=7 \\Rightarrow x=\\sqrt7\\approx2{,}65$.',
              },
            },
          ],
        },
        {
          id: 'dsr-m5-s1-l3',
          title: { en: 'Circles', id: 'Lingkaran' },
          goal: {
            en: 'Write the equation of a circle from its center and radius, and find the center and radius from an expanded equation.',
            id: 'Menulis persamaan lingkaran dari pusat dan jari-jarinya, dan mencari pusat serta jari-jari dari persamaan yang terjabar.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A circle is a distance condition', id: 'Lingkaran adalah syarat jarak' },
              body: {
                en: 'A circle is every point at a fixed **distance** (the radius $r$) from a fixed **center** $(h,k)$. Setting $d(P,C)=r$ and squaring both sides (to clear the root) gives the **standard form**:\n$$(x-h)^2+(y-k)^2=r^2$$\nDrag the slider below to change $r$ in $x^2+y^2=r^2$ — a circle centered at the origin — and watch the curve grow.',
                id: 'Lingkaran adalah setiap titik pada **jarak** tetap (jari-jari $r$) dari **pusat** tetap $(h,k)$. Menetapkan $d(P,C)=r$ dan mengkuadratkan kedua ruas (untuk menghilangkan akarnya) memberi **bentuk baku**:\n$$(x-h)^2+(y-k)^2=r^2$$\nGeser penggeser di bawah untuk mengubah $r$ pada $x^2+y^2=r^2$ — lingkaran berpusat di titik asal — dan amati kurvanya membesar.',
              },
              figure: {
                dim: 2,
                xSpan: [-6, 6],
                ySpan: [-6, 6],
                ticks: true,
                params: [{ name: 'r', min: 1, max: 5, step: 0.25, value: 3, label: 'r' }],
                items: [
                  { t: 'curve', f: 'sqrt(r^2-x^2)', color: 'a' },
                  { t: 'curve', f: '-sqrt(r^2-x^2)', color: 'a' },
                ],
                caption: {
                  en: 'The full circle $x^2+y^2=r^2$, drawn as its upper half $y=\\sqrt{r^2-x^2}$ together with its lower half $y=-\\sqrt{r^2-x^2}$.',
                  id: 'Lingkaran penuh $x^2+y^2=r^2$, digambar sebagai separuh atasnya $y=\\sqrt{r^2-x^2}$ bersama separuh bawahnya $y=-\\sqrt{r^2-x^2}$.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Recovering the center and radius', id: 'Mendapatkan kembali pusat dan jari-jari' },
              body: {
                en: 'A circle with center $(3,-2)$ and radius $4$ has equation $(x-3)^2+(y+2)^2=16$. Expanding it produces the **general form**: $x^2-6x+9+y^2+4y+4=16$, i.e. $x^2+y^2-6x+4y-3=0$ — no perfect squares visible.\n\nGiven only the general form, **complete the square** on the $x$-terms and the $y$-terms separately to recover the standard form:\n$$(x^2-6x)+(y^2+4y)=3 \\ \\Rightarrow \\ (x^2-6x+9)+(y^2+4y+4)=3+9+4 \\ \\Rightarrow \\ (x-3)^2+(y+2)^2=16$$\nwhich is exactly the circle we started with: center $(3,-2)$, radius $4$.',
                id: 'Lingkaran berpusat $(3,-2)$ dan berjari-jari $4$ berpersamaan $(x-3)^2+(y+2)^2=16$. Menjabarkannya menghasilkan **bentuk umum**: $x^2-6x+9+y^2+4y+4=16$, yaitu $x^2+y^2-6x+4y-3=0$ — tak ada kuadrat sempurna yang terlihat.\n\nDiberikan hanya bentuk umumnya, **lengkapkan kuadrat** pada suku-$x$ dan suku-$y$ secara terpisah untuk mendapatkan kembali bentuk bakunya:\n$$(x^2-6x)+(y^2+4y)=3 \\ \\Rightarrow \\ (x^2-6x+9)+(y^2+4y+4)=3+9+4 \\ \\Rightarrow \\ (x-3)^2+(y+2)^2=16$$\nyang persis lingkaran yang kita mulai: pusat $(3,-2)$, jari-jari $4$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is the equation of the circle with center $(-1, 4)$ and radius $2$?',
                id: 'Apa persamaan lingkaran berpusat $(-1, 4)$ dan berjari-jari $2$?',
              },
              options: [
                { en: '$(x+1)^2+(y-4)^2=4$', id: '$(x+1)^2+(y-4)^2=4$' },
                { en: '$(x-1)^2+(y+4)^2=4$', id: '$(x-1)^2+(y+4)^2=4$' },
                { en: '$(x+1)^2+(y-4)^2=2$', id: '$(x+1)^2+(y-4)^2=2$' },
                { en: '$x^2+y^2=4$', id: '$x^2+y^2=4$' },
              ],
              answer: 0,
              explain: {
                en: 'The standard form is $(x-h)^2+(y-k)^2=r^2$ with $(h,k)=(-1,4)$ and $r=2$, giving $(x-(-1))^2+(y-4)^2=2^2$, i.e. $(x+1)^2+(y-4)^2=4$.',
                id: 'Bentuk bakunya $(x-h)^2+(y-k)^2=r^2$ dengan $(h,k)=(-1,4)$ dan $r=2$, memberi $(x-(-1))^2+(y-4)^2=2^2$, yaitu $(x+1)^2+(y-4)^2=4$.',
              },
              hint: {
                en: 'Substitute $h=-1$, $k=4$, and $r=2$ directly into $(x-h)^2+(y-k)^2=r^2$ — watch the sign when subtracting a negative $h$.',
                id: 'Substitusikan $h=-1$, $k=4$, dan $r=2$ langsung ke $(x-h)^2+(y-k)^2=r^2$ — perhatikan tandanya saat mengurangi $h$ yang negatif.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'The equation $x^2+y^2-6x+4y-3=0$ represents a circle. Find its radius.',
                id: 'Persamaan $x^2+y^2-6x+4y-3=0$ mewakili sebuah lingkaran. Cari jari-jarinya.',
              },
              template: 'x^2+y^2-6x+4y-3=0 \\ \\Rightarrow \\ (x-3)^2+(y+2)^2=16 \\ \\Rightarrow \\ r = ___',
              blanks: ['4'],
              explain: {
                en: 'Completing the square gives $(x-3)^2+(y+2)^2=16=4^2$, so $r=4$.',
                id: 'Melengkapkan kuadrat memberi $(x-3)^2+(y+2)^2=16=4^2$, sehingga $r=4$.',
              },
              hint: {
                en: 'This is the exact circle worked out in the concept above — the template already gives you the standard form; $r^2$ is the number on the right.',
                id: 'Ini persis lingkaran yang dikerjakan pada konsep di atas — templatenya sudah memberi bentuk bakunya; $r^2$ adalah bilangan di ruas kanan.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the radius of the circle $x^2+y^2+2x-8y+8=0$.',
                id: 'Cari jari-jari lingkaran $x^2+y^2+2x-8y+8=0$.',
              },
              blanks: [{ answer: 3 }],
              hints: [
                { en: 'Complete the square on the $x$-terms and $y$-terms separately.', id: 'Lengkapkan kuadrat pada suku-$x$ dan suku-$y$ secara terpisah.' },
              ],
              explain: {
                en: '$(x^2+2x+1)+(y^2-8y+16)=-8+1+16 \\Rightarrow (x+1)^2+(y-4)^2=9$, so $r=3$.',
                id: '$(x^2+2x+1)+(y^2-8y+16)=-8+1+16 \\Rightarrow (x+1)^2+(y-4)^2=9$, sehingga $r=3$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'dsr-m5-s1-p',
        runtime: 'math',
        title: { en: 'Points, Circles, and Intercepts', id: 'Titik, Lingkaran, dan Perpotongan' },
        brief: {
          en: 'A midpoint calculation, a circle\'s radius recovered by completing the square, and an intercept.',
          id: 'Satu perhitungan titik tengah, satu jari-jari lingkaran didapatkan dengan melengkapkan kuadrat, dan satu perpotongan.',
        },
        requirements: [
          { en: 'Complete the square on the $x$-terms and $y$-terms of a circle\'s general form separately.', id: 'Lengkapkan kuadrat pada suku-$x$ dan suku-$y$ dari bentuk umum lingkaran secara terpisah.' },
        ],
        tasks: [
          {
            prompt: { en: 'Find the distance from $(2, -1)$ to $(-4, 7)$.', id: 'Cari jarak dari $(2, -1)$ ke $(-4, 7)$.' },
            blanks: [{ answer: 10 }],
            solution: ['d = \\sqrt{(-6)^2+8^2} = \\sqrt{100} = 10'],
          },
          {
            prompt: { en: 'Find the radius of the circle $x^2+y^2-4x-10y+13=0$.', id: 'Cari jari-jari lingkaran $x^2+y^2-4x-10y+13=0$.' },
            blanks: [{ answer: 4 }],
            solution: ['(x-2)^2+(y-5)^2 = -13+4+25 = 16 \\Rightarrow r=4'],
          },
          {
            prompt: { en: 'Find the positive $x$-intercept of $y = x^2 - 12$.', id: 'Cari perpotongan-$x$ positif dari $y = x^2 - 12$.' },
            blanks: [{ answer: 2 * Math.sqrt(3), tol: 0.01 }],
            solution: ['x^2=12 \\Rightarrow x=\\sqrt{12}=2\\sqrt3 \\approx 3{,}46'],
          },
        ],
        hints: [
          { en: 'The constant you add while completing the square on each variable also gets added to the right-hand side.', id: 'Konstanta yang kamu tambahkan saat melengkapkan kuadrat pada tiap variabel juga ditambahkan ke ruas kanan.' },
        ],
        xp: 50,
      },
    },

    /* ------------------------------------------------------------ 1.10 lines */
    {
      id: 'dsr-m5-s2',
      title: { en: 'Lines', id: 'Garis' },
      summary: {
        en: 'Slope, the point-slope and slope-intercept forms, and the slope conditions for parallel and perpendicular lines.',
        id: 'Kemiringan, bentuk titik-kemiringan dan kemiringan-perpotongan, serta syarat kemiringan untuk garis sejajar dan tegak lurus.',
      },
      lessons: [
        {
          id: 'dsr-m5-s2-l1',
          title: { en: 'Slope and the Point-Slope Form', id: 'Kemiringan dan Bentuk Titik-Kemiringan' },
          goal: {
            en: 'Compute the slope through two points, and write the equation of a line from a point and its slope.',
            id: 'Menghitung kemiringan melalui dua titik, dan menulis persamaan garis dari sebuah titik dan kemiringannya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Slope measures steepness', id: 'Kemiringan mengukur kecuraman' },
              body: {
                en: 'The **slope** of the line through $(x_1,y_1)$ and $(x_2,y_2)$ is the ratio of rise to run:\n$$m = \\frac{y_2-y_1}{x_2-x_1}$$\nPositive slope climbs left to right; negative slope falls; a horizontal line has slope $0$; a vertical line has **no** slope (the run is $0$, and division by $0$ is undefined). Through $(2,1)$ and $(8,5)$: $m=\\dfrac{5-1}{8-2}=\\dfrac{4}{6}=\\dfrac{2}{3}$ — for every $3$ units right, the line rises $2$.',
                id: '**Kemiringan** garis melalui $(x_1,y_1)$ dan $(x_2,y_2)$ adalah rasio naik terhadap datar:\n$$m = \\frac{y_2-y_1}{x_2-x_1}$$\nKemiringan positif menanjak dari kiri ke kanan; kemiringan negatif menurun; garis mendatar berkemiringan $0$; garis tegak **tak punya** kemiringan (datarnya $0$, dan pembagian dengan $0$ tak terdefinisi). Melalui $(2,1)$ dan $(8,5)$: $m=\\dfrac{5-1}{8-2}=\\dfrac{4}{6}=\\dfrac{2}{3}$ — untuk setiap $3$ satuan ke kanan, garisnya naik $2$.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Point-slope form, and a slider to feel it', id: 'Bentuk titik-kemiringan, dan penggeser untuk merasakannya' },
              body: {
                en: 'A line through $(x_1,y_1)$ with slope $m$ has equation\n$$y-y_1 = m(x-x_1)$$\nThrough $(1,3)$ with $m=-\\frac{1}{2}$: $y-3=-\\frac{1}{2}(x-1)$, which rearranges to $x+2y-7=0$.\n\nDrag the slider: the line always passes through the fixed point $(1,2)$, and only its slope $m$ changes — watch it flatten toward horizontal as $m \\to 0$ and swing past vertical as $|m|$ grows.',
                id: 'Garis melalui $(x_1,y_1)$ dengan kemiringan $m$ berpersamaan\n$$y-y_1 = m(x-x_1)$$\nMelalui $(1,3)$ dengan $m=-\\frac{1}{2}$: $y-3=-\\frac{1}{2}(x-1)$, yang ditata ulang menjadi $x+2y-7=0$.\n\nGeser penggesernya: garisnya selalu melalui titik tetap $(1,2)$, dan hanya kemiringannya $m$ yang berubah — amati ia merata mendekati mendatar ketika $m \\to 0$ dan berayun melewati tegak ketika $|m|$ membesar.',
              },
              figure: {
                dim: 2,
                xSpan: [-4, 6],
                ySpan: [-6, 10],
                ticks: true,
                params: [{ name: 'm', min: -3, max: 3, step: 0.25, value: 1, label: 'm' }],
                items: [
                  { t: 'curve', f: 'm*(x-1)+2', color: 'a' },
                  { t: 'dot', x: 1, y: 2, color: 'result' },
                ],
                caption: {
                  en: 'Every line here has the point-slope equation $y-2=m(x-1)$ — same pivot point, different slope.',
                  id: 'Setiap garis di sini punya persamaan titik-kemiringan $y-2=m(x-1)$ — titik poros yang sama, kemiringan yang berbeda.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is the slope of the line through $(-2, 5)$ and $(4, -7)$?',
                id: 'Berapa kemiringan garis melalui $(-2, 5)$ dan $(4, -7)$?',
              },
              options: [
                { en: '$-2$', id: '$-2$' },
                { en: '$2$', id: '$2$' },
                { en: '$-\\frac{1}{2}$', id: '$-\\frac{1}{2}$' },
                { en: '$6$', id: '$6$' },
              ],
              answer: 0,
              explain: {
                en: '$m = \\dfrac{-7-5}{4-(-2)} = \\dfrac{-12}{6} = -2$.',
                id: '$m = \\dfrac{-7-5}{4-(-2)} = \\dfrac{-12}{6} = -2$.',
              },
              hint: {
                en: 'Apply the slope formula directly — be careful with the double negative when subtracting the $x$-coordinates.',
                id: 'Terapkan formula kemiringan langsung — hati-hati dengan tanda ganda saat mengurangi koordinat-$x$-nya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'In the figure above, as $m$ increases from $0$ toward large positive values, the line:',
                id: 'Pada gambar di atas, saat $m$ bertambah dari $0$ ke nilai positif yang besar, garisnya:',
              },
              options: [
                { en: 'Pivots around $(1,2)$, swinging closer to vertical', id: 'Berputar mengelilingi $(1,2)$, berayun mendekati tegak' },
                { en: 'Shifts to a different fixed point', id: 'Berpindah ke titik tetap yang berbeda' },
                { en: 'Stays exactly the same', id: 'Tetap persis sama' },
                { en: 'Becomes horizontal', id: 'Menjadi mendatar' },
              ],
              answer: 0,
              explain: {
                en: 'The pivot point $(1,2)$ never moves — only the steepness changes, and a larger slope means a steeper line, approaching (but never reaching) vertical.',
                id: 'Titik poros $(1,2)$ tak pernah bergeser — hanya kecuramannya yang berubah, dan kemiringan yang lebih besar berarti garis yang lebih curam, mendekati (tapi tak pernah mencapai) tegak.',
              },
              hint: {
                en: 'Look at the point-slope equation itself — which part of it involves $m$, and which part stays fixed no matter what $m$ is?',
                id: 'Lihat persamaan titik-kemiringannya sendiri — bagian mana yang melibatkan $m$, dan bagian mana yang tetap tak peduli berapa pun $m$-nya?',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Find the equation of the line through $(1, 3)$ with slope $-\\dfrac{1}{2}$, in the form $Ax+By+C=0$.',
                id: 'Cari persamaan garis melalui $(1, 3)$ dengan kemiringan $-\\dfrac{1}{2}$, dalam bentuk $Ax+By+C=0$.',
              },
              template: 'y - 3 = -\\dfrac{1}{2}(x - 1) \\ \\Rightarrow \\ ___ = 0',
              blanks: ['x+2y-7'],
              explain: {
                en: 'Multiplying by $2$ and rearranging: $2y-6=-(x-1) \\Rightarrow x+2y-7=0$.',
                id: 'Mengalikan dengan $2$ dan menata ulang: $2y-6=-(x-1) \\Rightarrow x+2y-7=0$.',
              },
              hint: {
                en: 'This is the exact line worked out in the concept above — clear the fraction by multiplying through by $2$, then move everything to one side.',
                id: 'Ini persis garis yang dikerjakan pada konsep di atas — hilangkan pecahannya dengan mengalikan semua dengan $2$, lalu pindahkan semuanya ke satu ruas.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'A line has slope $3$ and passes through $(2, -1)$. Find its $y$-intercept.',
                id: 'Sebuah garis berkemiringan $3$ dan melalui $(2, -1)$. Cari perpotongan-$y$-nya.',
              },
              blanks: [{ answer: -7 }],
              hints: [
                { en: 'Write $y-(-1)=3(x-2)$, then set $x=0$.', id: 'Tulis $y-(-1)=3(x-2)$, lalu nolkan $x$.' },
              ],
              explain: {
                en: '$y+1=3(x-2) \\Rightarrow y=3x-7$; at $x=0$, $y=-7$.',
                id: '$y+1=3(x-2) \\Rightarrow y=3x-7$; di $x=0$, $y=-7$.',
              },
            },
          ],
        },
        {
          id: 'dsr-m5-s2-l2',
          title: { en: 'Slope-Intercept Form, Parallel, and Perpendicular Lines', id: 'Bentuk Kemiringan-Perpotongan, Garis Sejajar, dan Tegak Lurus' },
          goal: {
            en: 'Read slope and y-intercept directly from an equation, and use the slope conditions for parallel and perpendicular lines.',
            id: 'Membaca kemiringan dan perpotongan-y langsung dari persamaan, dan memakai syarat kemiringan untuk garis sejajar dan tegak lurus.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Slope-intercept and general form', id: 'Bentuk kemiringan-perpotongan dan bentuk umum' },
              body: {
                en: 'Solving the point-slope form for a line through $(0,b)$ gives the **slope-intercept form**:\n$$y = mx + b$$\nreading off $m$ and $b$ directly. For $4y+2x-8=0$: solving for $y$ gives $y=-\\frac{1}{2}x+2$, so $m=-\\frac{1}{2}$ and $b=2$.\n\nEvery line, including vertical ones ($x=a$, no slope), is the graph of a **general linear equation** $Ax+By+C=0$ with $A, B$ not both $0$.',
                id: 'Menyelesaikan bentuk titik-kemiringan untuk garis melalui $(0,b)$ memberi **bentuk kemiringan-perpotongan**:\n$$y = mx + b$$\nlangsung membaca $m$ dan $b$. Untuk $4y+2x-8=0$: menyelesaikan untuk $y$ memberi $y=-\\frac{1}{2}x+2$, sehingga $m=-\\frac{1}{2}$ dan $b=2$.\n\nSetiap garis, termasuk yang tegak ($x=a$, tanpa kemiringan), adalah grafik dari **persamaan linear umum** $Ax+By+C=0$ dengan $A, B$ tak keduanya $0$.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Parallel and perpendicular slopes', id: 'Kemiringan sejajar dan tegak lurus' },
              body: {
                en: 'Two nonvertical lines are **parallel** exactly when their slopes are equal, and **perpendicular** exactly when their slopes are negative reciprocals: $m_1 m_2 = -1$.\n\nA line parallel to $4x-6y+5=0$ (slope $\\frac{2}{3}$) through $(5,-2)$: same slope $\\frac{2}{3}$, giving $y+2=\\frac{2}{3}(x-5)$, i.e. $2x-3y-16=0$. A line perpendicular to $y=2x+1$ (slope $2$) through $(4,3)$: slope $-\\frac{1}{2}$, giving $y=-\\frac{1}{2}x+5$.',
                id: 'Dua garis tak tegak **sejajar** persis ketika kemiringannya sama, dan **tegak lurus** persis ketika kemiringannya kebalikan negatif: $m_1 m_2 = -1$.\n\nGaris sejajar dengan $4x-6y+5=0$ (kemiringan $\\frac{2}{3}$) melalui $(5,-2)$: kemiringan sama $\\frac{2}{3}$, memberi $y+2=\\frac{2}{3}(x-5)$, yaitu $2x-3y-16=0$. Garis tegak lurus dengan $y=2x+1$ (kemiringan $2$) melalui $(4,3)$: kemiringan $-\\frac{1}{2}$, memberi $y=-\\frac{1}{2}x+5$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A line has slope $\\dfrac{3}{4}$. What is the slope of a line perpendicular to it?',
                id: 'Sebuah garis berkemiringan $\\dfrac{3}{4}$. Berapa kemiringan garis yang tegak lurus terhadapnya?',
              },
              options: [
                { en: '$-\\dfrac{4}{3}$', id: '$-\\dfrac{4}{3}$' },
                { en: '$\\dfrac{4}{3}$', id: '$\\dfrac{4}{3}$' },
                { en: '$-\\dfrac{3}{4}$', id: '$-\\dfrac{3}{4}$' },
                { en: '$\\dfrac{3}{4}$', id: '$\\dfrac{3}{4}$' },
              ],
              answer: 0,
              explain: {
                en: 'Perpendicular slopes are negative reciprocals: the reciprocal of $\\frac{3}{4}$ is $\\frac{4}{3}$, negated gives $-\\frac{4}{3}$.',
                id: 'Kemiringan tegak lurus adalah kebalikan negatif: kebalikan dari $\\frac{3}{4}$ adalah $\\frac{4}{3}$, dinegasikan memberi $-\\frac{4}{3}$.',
              },
              hint: {
                en: 'Perpendicular slopes multiply to $-1$. Flip the fraction upside down, then negate it.',
                id: 'Kemiringan tegak lurus jika dikalikan menghasilkan $-1$. Balik pecahannya, lalu negasikan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Which line is parallel to $y = 5x - 2$?',
                id: 'Garis manakah yang sejajar dengan $y = 5x - 2$?',
              },
              options: [
                { en: '$y = 5x + 7$', id: '$y = 5x + 7$' },
                { en: '$y = -5x - 2$', id: '$y = -5x - 2$' },
                { en: '$y = \\frac{1}{5}x - 2$', id: '$y = \\frac{1}{5}x - 2$' },
                { en: '$5x + y = 7$', id: '$5x + y = 7$' },
              ],
              answer: 0,
              explain: {
                en: 'Parallel lines share a slope. $y=5x+7$ has slope $5$, matching $y=5x-2$ exactly — only the $y$-intercept differs.',
                id: 'Garis sejajar berbagi kemiringan yang sama. $y=5x+7$ berkemiringan $5$, cocok persis dengan $y=5x-2$ — hanya perpotongan-$y$-nya yang berbeda.',
              },
              hint: {
                en: 'Parallel means equal slope, not equal equation. Rewrite each option in slope-intercept form if needed, then compare only the slopes.',
                id: 'Sejajar berarti kemiringan sama, bukan persamaan yang sama. Tulis ulang tiap pilihan dalam bentuk kemiringan-perpotongan jika perlu, lalu bandingkan hanya kemiringannya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Find the slope and $y$-intercept of $4y + 2x - 8 = 0$.',
                id: 'Cari kemiringan dan perpotongan-$y$ dari $4y + 2x - 8 = 0$.',
              },
              template: '4y + 2x - 8 = 0 \\ \\Rightarrow \\ y = -\\dfrac{1}{2}x + ___',
              blanks: ['2'],
              explain: {
                en: 'Solving for $y$: $4y=-2x+8 \\Rightarrow y=-\\frac{1}{2}x+2$, so the $y$-intercept is $2$.',
                id: 'Menyelesaikan untuk $y$: $4y=-2x+8 \\Rightarrow y=-\\frac{1}{2}x+2$, sehingga perpotongan-$y$-nya $2$.',
              },
              hint: {
                en: 'This is the exact equation worked out in the concept above — isolate $y$ by moving everything else to the right side and dividing by $4$.',
                id: 'Ini persis persamaan yang dikerjakan pada konsep di atas — isolasi $y$ dengan memindahkan semua yang lain ke ruas kanan dan membagi dengan $4$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the $y$-intercept of the line through $(4, 3)$ perpendicular to $y = 2x + 1$.',
                id: 'Cari perpotongan-$y$ dari garis melalui $(4, 3)$ yang tegak lurus terhadap $y = 2x + 1$.',
              },
              blanks: [{ answer: 5 }],
              hints: [
                { en: 'The perpendicular slope is $-\\frac{1}{2}$. Use point-slope form, then set $x=0$.', id: 'Kemiringan tegak lurusnya $-\\frac{1}{2}$. Pakai bentuk titik-kemiringan, lalu nolkan $x$.' },
              ],
              explain: {
                en: '$y-3=-\\frac{1}{2}(x-4) \\Rightarrow y=-\\frac{1}{2}x+5$; the $y$-intercept is $5$.',
                id: '$y-3=-\\frac{1}{2}(x-4) \\Rightarrow y=-\\frac{1}{2}x+5$; perpotongan-$y$-nya $5$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'dsr-m5-s2-p',
        runtime: 'math',
        title: { en: 'Equations of Lines', id: 'Persamaan Garis' },
        brief: {
          en: 'A slope calculation, a parallel line, and a perpendicular line — each through a given point.',
          id: 'Satu perhitungan kemiringan, satu garis sejajar, dan satu garis tegak lurus — masing-masing melalui titik tertentu.',
        },
        requirements: [
          { en: 'Parallel lines share a slope; perpendicular slopes multiply to $-1$.', id: 'Garis sejajar berbagi kemiringan yang sama; kemiringan tegak lurus jika dikalikan menghasilkan $-1$.' },
        ],
        tasks: [
          {
            prompt: { en: 'Find the slope of the line through $(3, -2)$ and $(-1, 6)$.', id: 'Cari kemiringan garis melalui $(3, -2)$ dan $(-1, 6)$.' },
            blanks: [{ answer: -2 }],
            solution: ['m = \\dfrac{6-(-2)}{-1-3} = \\dfrac{8}{-4} = -2'],
          },
          {
            prompt: { en: 'Find the $y$-intercept of the line through $(2, 1)$ parallel to $y = 3x - 5$.', id: 'Cari perpotongan-$y$ dari garis melalui $(2, 1)$ sejajar dengan $y = 3x - 5$.' },
            blanks: [{ answer: -5 }],
            solution: ['y-1=3(x-2) \\Rightarrow y=3x-5, \\text{ y-intercept } -5'],
          },
          {
            prompt: { en: 'Find the $y$-intercept of the line through $(6, 2)$ perpendicular to $y = -3x + 1$.', id: 'Cari perpotongan-$y$ dari garis melalui $(6, 2)$ tegak lurus dengan $y = -3x + 1$.' },
            blanks: [{ answer: 0 }],
            solution: ['\\text{perpendicular slope } = \\tfrac{1}{3}; \\ y-2=\\tfrac{1}{3}(x-6) \\Rightarrow y=\\tfrac{1}{3}x, \\text{ y-intercept } 0'],
          },
        ],
        hints: [
          { en: 'For the third task, notice the y-intercept works out to a suspiciously round number — that\'s a good sign, not a mistake.', id: 'Untuk butir ketiga, perhatikan perpotongan-y-nya ternyata bilangan yang mencurigakan bulat — itu pertanda baik, bukan kesalahan.' },
        ],
        xp: 50,
      },
    },
  ],
}
