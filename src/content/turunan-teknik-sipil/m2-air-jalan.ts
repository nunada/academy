import type { Module } from '../types'
import { L, S, T } from './kit'
import { channelScene, planScene, pondScene, roadScene, towerScene, trapezoidScene } from './scenes'

/** Module 2 — water and roads. A channel is shaped by setting a derivative to zero, a pond fills at a rate found by differentiating its volume, a road
 *  is drawn so that its grade, a derivative, changes steadily, and the tightness of a bend is a second derivative. */
export const module2: Module = {
  id: 'sip-m2',
  title: L('Water and Roads', 'Air dan Jalan'),
  summary: L(
    'The channel that carries the most water, the rate at which a pond fills, the vertical curve that joins two grades, and the radius of a bend, each read from a derivative.',
    'Saluran yang membawa air paling banyak, laju pengisian kolam, lengkung vertikal yang menyambung dua kelandaian, dan jari-jari tikungan, masing-masing dibaca dari turunan.',
  ),
  submodules: [
    /* --------------------------------------------------------------------- 2.1 channels and ponds */
    {
      id: 'sip-m2-s1',
      title: L('Channels and Ponds', 'Saluran dan Kolam'),
      summary: L(
        'The best hydraulic section by minimizing the wetted perimeter, and related rates for a pond with sloping banks.',
        'Penampang hidraulik terbaik dengan meminimalkan keliling basah, dan laju terkait untuk kolam bertebing miring.',
      ),
      lessons: [
        {
          id: 'sip-m2-s1-l1',
          title: L('The Best Hydraulic Section', 'Penampang Hidraulik Terbaik'),
          goal: L(
            'Find the depth of a rectangular or trapezoidal channel that carries the most water for a given cross-section.',
            'Mencari kedalaman saluran persegi panjang atau trapesium yang membawa air paling banyak untuk luas penampang tertentu.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Water is slowed by what it touches', 'Air diperlambat oleh apa yang disentuhnya'),
              body: L(
                T`
How much water a channel carries each second, its **discharge** $Q$, is given by Manning's formula:
$$Q=\frac{1}{n}\,A\,R^{2/3}\,\sqrt{S}$$
$$R=\frac{A}{P}.$$

- $A$ is the area of the water's cross-section, which is what has to be dug and lined.
- $P$ is the **wetted perimeter**, the length of bed and banks that the water touches in that cross-section.
- $R=\frac{A}{P}$ is the hydraulic radius, $n$ the roughness of the lining, $S$ the slope of the channel.

Friction acts where water touches the lining. For a given area $A$, roughness and slope, $Q$ grows as $R$ grows, and $R=\frac{A}{P}$ grows as $P$ shrinks. So the design question is a calculus question:

**Among all channels with the same area, which has the smallest wetted perimeter?** That one is called the **best hydraulic section**: it carries the most water for the same excavation, or needs the least lining for the same water.`,
                T`
Banyaknya air yang dibawa saluran tiap detik, yaitu **debit** $Q$, diberikan oleh rumus Manning:
$$Q=\frac{1}{n}\,A\,R^{2/3}\,\sqrt{S}$$
$$R=\frac{A}{P}.$$

- $A$ adalah luas penampang air, yaitu yang harus digali dan dilapisi.
- $P$ adalah **keliling basah**, panjang dasar dan tebing yang disentuh air pada penampang itu.
- $R=\frac{A}{P}$ adalah jari-jari hidraulik, $n$ kekasaran lapisan, $S$ kemiringan saluran.

Gesekan bekerja di tempat air menyentuh lapisan. Untuk luas $A$, kekasaran, dan kemiringan tertentu, $Q$ bertambah saat $R$ bertambah, dan $R=\frac{A}{P}$ bertambah saat $P$ menyusut. Jadi pertanyaan perancangannya adalah pertanyaan kalkulus:

**Di antara semua saluran dengan luas yang sama, mana yang keliling basahnya terkecil?** Itulah yang disebut **penampang hidraulik terbaik**: ia membawa air paling banyak untuk galian yang sama, atau memerlukan lapisan paling sedikit untuk air yang sama.`,
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Two channels have the same cross-section area, lining and slope. The first has a wetted perimeter of $8$ m, the second $10$ m. Which carries more water?',
                'Dua saluran memiliki luas penampang, lapisan, dan kemiringan yang sama. Yang pertama memiliki keliling basah $8$ m, yang kedua $10$ m. Mana yang membawa air lebih banyak?',
              ),
              options: [
                L('The first: less lining touched means less friction', 'Yang pertama: lapisan yang disentuh lebih sedikit berarti gesekan lebih kecil'),
                L('The second: a longer perimeter holds more water', 'Yang kedua: keliling yang lebih panjang menampung lebih banyak air'),
                L('They carry the same, because the areas are equal', 'Keduanya sama, sebab luasnya sama'),
                L('It cannot be known without the depth', 'Tak dapat diketahui tanpa kedalaman'),
              ],
              answer: 0,
              explain: L(
                'With $A$ fixed, $R=\\frac{A}{P}$ is larger for the smaller $P$, and $Q$ grows with $R^{2/3}$. The first channel carries about $16\\%$ more.',
                'Dengan $A$ tetap, $R=\\frac{A}{P}$ lebih besar untuk $P$ yang lebih kecil, dan $Q$ bertambah mengikuti $R^{2/3}$. Saluran pertama membawa sekitar $16\\%$ lebih banyak.',
              ),
              hint: L('In Manning\'s formula, where does $P$ sit: on top or underneath?', 'Dalam rumus Manning, di mana $P$ berada: di atas atau di bawah?'),
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('The rectangular channel: half a square', 'Saluran persegi panjang: setengah persegi'),
              body: L(
                T`
A concrete channel with vertical walls must carry a cross-section of $A=8\text{ m}^2$. Let $y$ be the depth of the water and $b$ the width. The constraint is $b\,y=8$, so $b=\dfrac{8}{y}$, and the water touches the bed and two walls:
$$P(y)=b+2y=\frac{8}{y}+2y,\qquad y>0.$$

A very shallow channel is all bed, a very deep one all wall, and $P$ is large both ways. Between them:
$$P'(y)=-\frac{8}{y^2}+2=0$$
$$\Rightarrow\ y^2=4$$
$$y=2\text{ m}$$
$$b=\frac{8}{2}=4\text{ m}.$$
Since $P''(y)=\dfrac{16}{y^3}>0$, this is the minimum: $P=4+4=8$ m.

The best rectangular channel is **twice as wide as it is deep**, $b=2y$: half of a square. With $n=0.015$ (concrete) and $S=0.001$ it carries $Q=\dfrac{1}{0.015}\cdot8\cdot1^{2/3}\cdot\sqrt{0.001}\approx16.87\text{ m}^3/\text{s}$, more than any other rectangle of the same area.`,
                T`
Saluran beton berdinding tegak harus membawa penampang $A=8\text{ m}^2$. Misalkan $y$ kedalaman air dan $b$ lebarnya. Kendalanya $b\,y=8$, sehingga $b=\dfrac{8}{y}$, dan air menyentuh dasar serta dua dinding:
$$P(y)=b+2y=\frac{8}{y}+2y,\qquad y>0.$$

Saluran yang sangat dangkal hampir seluruhnya dasar, yang sangat dalam hampir seluruhnya dinding, dan $P$ besar pada keduanya. Di antaranya:
$$P'(y)=-\frac{8}{y^2}+2=0$$
$$\Rightarrow\ y^2=4$$
$$y=2\text{ m}$$
$$b=\frac{8}{2}=4\text{ m}.$$
Karena $P''(y)=\dfrac{16}{y^3}>0$, ini minimum: $P=4+4=8$ m.

Saluran persegi panjang terbaik **lebarnya dua kali kedalamannya**, $b=2y$: setengah dari sebuah persegi. Dengan $n=0{,}015$ (beton) dan $S=0{,}001$ ia membawa $Q=\dfrac{1}{0{,}015}\cdot8\cdot1^{2/3}\cdot\sqrt{0{,}001}\approx16{,}87\text{ m}^3/\text{s}$, lebih banyak daripada persegi panjang lain berluas sama.`,
              ),
              scene3d: channelScene,
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Complete the derivative of the wetted perimeter $P(y)=\\dfrac{8}{y}+2y$.',
                'Lengkapi turunan keliling basah $P(y)=\\dfrac{8}{y}+2y$.',
              ),
              template: "P'(y) = -\\dfrac{___}{y^2} + ___",
              blanks: ['8', '2'],
              explain: L(
                '$\\frac{8}{y}=8y^{-1}$ has derivative $-8y^{-2}$, and $2y$ has derivative $2$.',
                '$\\frac{8}{y}=8y^{-1}$ memiliki turunan $-8y^{-2}$, dan $2y$ memiliki turunan $2$.',
              ),
              hint: L('Write $\\frac{8}{y}$ as $8y^{-1}$ and use the power rule.', 'Tulis $\\frac{8}{y}$ sebagai $8y^{-1}$ dan pakai aturan pangkat.'),
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Sloping banks do better', 'Tebing miring lebih baik'),
              body: L(
                T`
Earth channels have sloping banks. Let the **side slope** $m$ be how far a bank goes across for each meter it rises, so a bank of depth $y$ is $y\sqrt{1+m^2}$ long. With bottom width $b$:
$$A=(b+my)\,y,\qquad P=b+2y\sqrt{1+m^2}.$$

For a fixed area $A$, the constraint gives $b=\dfrac{A}{y}-my$, and
$$P(y)=\frac{A}{y}-my+2y\sqrt{1+m^2}$$
$$P'(y)=-\frac{A}{y^2}-m+2\sqrt{1+m^2}=0.$$
So the best depth for a given side slope is
$$y=\sqrt{\frac{A}{2\sqrt{1+m^2}-m}}.$$

For $A=12\text{ m}^2$:

| Section | Best depth $y$ | Wetted perimeter $P$ |
|---|---|---|
| Rectangle, $m=0$ | $2.45$ m | $9.80$ m |
| Banks at $45^\circ$, $m=1$ | $2.56$ m | $9.37$ m |
| Banks at $60^\circ$, $m=\frac{1}{\sqrt3}$ | $2.63$ m | $9.12$ m |

The winner of all trapezoids is the last: banks at $60^\circ$ and a bottom as long as each bank, **half of a regular hexagon**. It is the trapezoid closest to a half circle, the shape with the least perimeter of all.`,
                T`
Saluran tanah memiliki tebing miring. Misalkan **kemiringan sisi** $m$ adalah seberapa jauh tebing bergeser mendatar untuk tiap meter kenaikannya, sehingga tebing sedalam $y$ panjangnya $y\sqrt{1+m^2}$. Dengan lebar dasar $b$:
$$A=(b+my)\,y,\qquad P=b+2y\sqrt{1+m^2}.$$

Untuk luas tetap $A$, kendala memberi $b=\dfrac{A}{y}-my$, dan
$$P(y)=\frac{A}{y}-my+2y\sqrt{1+m^2}$$
$$P'(y)=-\frac{A}{y^2}-m+2\sqrt{1+m^2}=0.$$
Jadi kedalaman terbaik untuk kemiringan sisi tertentu adalah
$$y=\sqrt{\frac{A}{2\sqrt{1+m^2}-m}}.$$

Untuk $A=12\text{ m}^2$:

| Penampang | Kedalaman terbaik $y$ | Keliling basah $P$ |
|---|---|---|
| Persegi panjang, $m=0$ | $2{,}45$ m | $9{,}80$ m |
| Tebing $45^\circ$, $m=1$ | $2{,}56$ m | $9{,}37$ m |
| Tebing $60^\circ$, $m=\frac{1}{\sqrt3}$ | $2{,}63$ m | $9{,}12$ m |

Pemenang dari semua trapesium adalah yang terakhir: tebing $60^\circ$ dan dasar sepanjang tiap tebing, **setengah dari segienam beraturan**. Itulah trapesium yang paling mendekati setengah lingkaran, bentuk dengan keliling terkecil dari semuanya.`,
              ),
              scene3d: trapezoidScene,
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'For the same area, which trapezoidal channel has the smallest wetted perimeter?',
                'Untuk luas yang sama, saluran trapesium mana yang keliling basahnya terkecil?',
              ),
              options: [
                L('Banks at $60^\\circ$ to the horizontal: half of a regular hexagon', 'Tebing $60^\\circ$ terhadap horizontal: setengah segienam beraturan'),
                L('Vertical walls: a rectangle', 'Dinding tegak: persegi panjang'),
                L('Banks at $45^\\circ$', 'Tebing $45^\\circ$'),
                L('The flatter the banks, the better', 'Makin landai tebingnya, makin baik'),
              ],
              answer: 0,
              explain: L(
                'Minimizing over the side slope as well gives $m=\\frac{1}{\\sqrt3}$, banks at $60^\\circ$. Flatter banks get long faster than they save bottom width.',
                'Meminimalkan terhadap kemiringan sisi juga memberi $m=\\frac{1}{\\sqrt3}$, tebing $60^\\circ$. Tebing yang lebih landai memanjang lebih cepat daripada penghematan lebar dasarnya.',
              ),
              hint: L('Look at the last column of the table, or search with the two sliders.', 'Lihat kolom terakhir tabel, atau cari dengan kedua penggeser.'),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'A rectangular channel must carry a cross-section of $18\\text{ m}^2$. Find the depth and the width of the best hydraulic section.',
                'Saluran persegi panjang harus membawa penampang $18\\text{ m}^2$. Cari kedalaman dan lebar penampang hidraulik terbaik.',
              ),
              blanks: [
                { label: 'y =', answer: 3, after: '\\text{m}' },
                { label: 'b =', answer: 6, after: '\\text{m}' },
              ],
              hints: [
                L('$P(y)=\\dfrac{18}{y}+2y$.', '$P(y)=\\dfrac{18}{y}+2y$.'),
                L('$P\'(y)=-\\dfrac{18}{y^2}+2=0$ gives $y^2=9$.', '$P\'(y)=-\\dfrac{18}{y^2}+2=0$ memberi $y^2=9$.'),
              ],
              explain: L(
                '$y^2=9$, so $y=3$ m and $b=\\frac{18}{3}=6$ m: twice as wide as deep, with $P=12$ m.',
                '$y^2=9$, jadi $y=3$ m dan $b=\\frac{18}{3}=6$ m: lebarnya dua kali kedalamannya, dengan $P=12$ m.',
              ),
              solution: S("P(y)=\\dfrac{18}{y}+2y,\\quad P'(y)=-\\dfrac{18}{y^2}+2=0", 'y=3,\\quad b=\\dfrac{18}{3}=6'),
            },
            {
              kind: 'math',
              id: 'm2',
              prompt: L(
                'A trapezoidal channel with banks at $45^\\circ$ ($m=1$) must carry $12\\text{ m}^2$. Find its best depth and the wetted perimeter at that depth.',
                'Saluran trapesium dengan tebing $45^\\circ$ ($m=1$) harus membawa $12\\text{ m}^2$. Cari kedalaman terbaiknya dan keliling basah pada kedalaman itu.',
              ),
              blanks: [
                { label: 'y =', answer: 2.561860, tol: 0.01, after: '\\text{m}' },
                { label: 'P =', answer: 9.368166, tol: 0.02, after: '\\text{m}' },
              ],
              hints: [
                L('$y=\\sqrt{\\dfrac{A}{2\\sqrt{1+m^2}-m}}$ with $A=12$ and $m=1$.', '$y=\\sqrt{\\dfrac{A}{2\\sqrt{1+m^2}-m}}$ dengan $A=12$ dan $m=1$.'),
                L('Then $b=\\dfrac{12}{y}-y$ and $P=b+2y\\sqrt2$.', 'Lalu $b=\\dfrac{12}{y}-y$ dan $P=b+2y\\sqrt2$.'),
              ],
              explain: L(
                '$y=\\sqrt{\\frac{12}{2\\sqrt2-1}}\\approx2.56$ m, $b\\approx2.12$ m, and $P\\approx2.12+7.25=9.37$ m, less than the $9.80$ m of the best rectangle.',
                '$y=\\sqrt{\\frac{12}{2\\sqrt2-1}}\\approx2{,}56$ m, $b\\approx2{,}12$ m, dan $P\\approx2{,}12+7{,}25=9{,}37$ m, lebih kecil daripada $9{,}80$ m milik persegi panjang terbaik.',
              ),
              solution: S('y=\\sqrt{\\dfrac{12}{2\\sqrt2-1}}\\approx2.562', 'b=\\dfrac{12}{y}-y\\approx2.122', 'P=b+2y\\sqrt2\\approx9.368'),
            },
          ],
        },
        {
          id: 'sip-m2-s1-l2',
          title: L('Related Rates: A Pond That Fills', 'Laju Terkait: Kolam yang Terisi'),
          goal: L(
            'Relate the rate at which water flows in to the rate at which its level rises, through the derivative of the volume.',
            'Mengaitkan laju air masuk dengan laju kenaikan muka airnya, melalui turunan volume.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('The derivative of the volume is the water surface', 'Turunan volume adalah permukaan air'),
              body: L(
                T`
A retention pond has a flat floor $20$ m by $10$ m and banks that go $2$ m across for each meter up. When the water is $h$ meters deep, its surface is a rectangle $(20+4h)$ by $(10+4h)$, and the volume of water is
$$V(h)=200h+60h^2+\frac{16}{3}h^3\ \text{m}^3.$$

Differentiate with respect to the depth:
$$\frac{dV}{dh}=200+120h+16h^2$$
$$=(20+4h)(10+4h).$$
The derivative of the volume is **the area of the water surface**. That is no accident: raise the level by a thin layer $dh$ and the water added is the surface area times $dh$. It holds for any tank, pond or reservoir, whatever its shape.

Now let time run. If water enters at $Q$ cubic meters a minute, the chain rule ties the two rates together:
$$\frac{dV}{dt}=\frac{dV}{dh}\cdot\frac{dh}{dt}$$
$$\Rightarrow\quad \frac{dh}{dt}=\frac{Q}{A(h)},$$
where $A(h)$ is the surface area at depth $h$.`,
                T`
Sebuah kolam retensi memiliki dasar datar $20$ m kali $10$ m dan tebing yang bergeser $2$ m mendatar untuk tiap meter kenaikan. Saat air sedalam $h$ meter, permukaannya adalah persegi panjang $(20+4h)$ kali $(10+4h)$, dan volume airnya
$$V(h)=200h+60h^2+\frac{16}{3}h^3\ \text{m}^3.$$

Turunkan terhadap kedalaman:
$$\frac{dV}{dh}=200+120h+16h^2$$
$$=(20+4h)(10+4h).$$
Turunan volume adalah **luas permukaan air**. Itu bukan kebetulan: naikkan muka air setebal lapisan tipis $dh$ dan air yang bertambah adalah luas permukaan kali $dh$. Ini berlaku untuk tangki, kolam, atau waduk apa pun, bagaimanapun bentuknya.

Sekarang biarkan waktu berjalan. Bila air masuk $Q$ meter kubik per menit, aturan rantai mengikat kedua laju itu:
$$\frac{dV}{dt}=\frac{dV}{dh}\cdot\frac{dh}{dt}$$
$$\Rightarrow\quad \frac{dh}{dt}=\frac{Q}{A(h)},$$
dengan $A(h)$ luas permukaan pada kedalaman $h$.`,
              ),
              scene3d: pondScene,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Water flows into the pond at a constant rate. How does the water level rise as the pond fills?',
                'Air mengalir ke kolam dengan laju tetap. Bagaimana muka air naik saat kolam terisi?',
              ),
              options: [
                L('More and more slowly, because the surface keeps widening', 'Makin lambat, sebab permukaannya terus melebar'),
                L('At a constant speed, because the inflow is constant', 'Dengan kecepatan tetap, sebab aliran masuknya tetap'),
                L('Faster and faster', 'Makin cepat'),
                L('Slowly at first, then at a constant speed', 'Lambat mula-mula, lalu dengan kecepatan tetap'),
              ],
              answer: 0,
              explain: L(
                '$\\frac{dh}{dt}=\\frac{Q}{A(h)}$, and the surface $A(h)$ grows with the depth because the banks slope outward. The same $Q$ divided by a larger area is a smaller rise.',
                '$\\frac{dh}{dt}=\\frac{Q}{A(h)}$, dan permukaan $A(h)$ bertambah seiring kedalaman karena tebingnya miring ke luar. $Q$ yang sama dibagi luas yang lebih besar adalah kenaikan yang lebih kecil.',
              ),
              hint: L('Raise $h$ in the picture and watch the surface area and the rise.', 'Naikkan $h$ pada gambar dan perhatikan luas permukaan serta kenaikannya.'),
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('A rate at an instant, and a time to fill', 'Laju pada suatu saat, dan waktu untuk penuh'),
              body: L(
                T`
Let the inflow be $Q=6\text{ m}^3/\text{min}$.

**When the water is $1$ m deep,** the surface is $24\cdot14=336\text{ m}^2$, so
$$\frac{dh}{dt}=\frac{6}{336}\approx0.0179\text{ m/min}$$
$$\approx1.79\text{ cm/min}.$$

**When it is $2$ m deep,** the surface is $28\cdot18=504\text{ m}^2$ and the level rises only $\dfrac{6}{504}\approx0.0119$ m/min, which is $1.19$ cm/min.

A rate belongs to an instant. It cannot be multiplied by a time to find how long the pond takes to fill, because it keeps changing. The time to fill comes from the volume itself: to a depth of $3$ m the pond holds
$$V(3)=600+540+144=1284\text{ m}^3$$
$$t=\frac{1284}{6}=214\text{ min}.$$

Every related-rates problem follows the same steps: name the quantities and the rate that is known, write the equation that ties the quantities together, differentiate it with respect to time, and only then put in the numbers of the instant.`,
                T`
Misalkan aliran masuk $Q=6\text{ m}^3/\text{menit}$.

**Saat air sedalam $1$ m,** permukaannya $24\cdot14=336\text{ m}^2$, sehingga
$$\frac{dh}{dt}=\frac{6}{336}\approx0{,}0179\text{ m/menit}$$
$$\approx1{,}79\text{ cm/menit}.$$

**Saat sedalam $2$ m,** permukaannya $28\cdot18=504\text{ m}^2$ dan muka air hanya naik $\dfrac{6}{504}\approx0{,}0119$ m/menit, yaitu $1{,}19$ cm/menit.

Sebuah laju adalah milik suatu saat. Ia tak dapat dikalikan dengan waktu untuk mencari berapa lama kolam penuh, sebab ia terus berubah. Waktu untuk penuh berasal dari volumenya sendiri: sampai kedalaman $3$ m kolam memuat
$$V(3)=600+540+144=1284\text{ m}^3$$
$$t=\frac{1284}{6}=214\text{ menit}.$$

Setiap soal laju terkait mengikuti langkah yang sama: namai besaran-besarannya dan laju yang diketahui, tulis persamaan yang mengikat besaran-besaran itu, turunkan terhadap waktu, dan baru kemudian masukkan angka pada saat itu.`,
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Complete the derivative of $V(h)=200h+60h^2+\\dfrac{16}{3}h^3$.',
                'Lengkapi turunan $V(h)=200h+60h^2+\\dfrac{16}{3}h^3$.',
              ),
              template: '\\dfrac{dV}{dh} = 200 + ___h + ___h^2',
              blanks: ['120', '16'],
              explain: L(
                '$60\\cdot2h=120h$ and $\\frac{16}{3}\\cdot3h^2=16h^2$. The result factors as $(20+4h)(10+4h)$, the surface.',
                '$60\\cdot2h=120h$ dan $\\frac{16}{3}\\cdot3h^2=16h^2$. Hasilnya terfaktor menjadi $(20+4h)(10+4h)$, permukaannya.',
              ),
              hint: L('The power rule on each term; the $3$ from the exponent cancels the $3$ underneath.', 'Aturan pangkat pada tiap suku; angka $3$ dari pangkat menghapus angka $3$ di bawah.'),
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: L(
                'Put the steps of a related-rates problem in order.',
                'Urutkan langkah-langkah soal laju terkait.',
              ),
              lines: {
                en: [
                  'Name the quantities that change, and write down the rate that is known',
                  'Write the equation that ties the quantities together',
                  'Differentiate both sides with respect to time, using the chain rule',
                  'Put in the values at the instant asked about',
                  'Solve for the rate that is wanted, with its unit',
                ],
                id: [
                  'Namai besaran yang berubah, dan tuliskan laju yang diketahui',
                  'Tulis persamaan yang mengikat besaran-besaran itu',
                  'Turunkan kedua ruas terhadap waktu, dengan aturan rantai',
                  'Masukkan nilai pada saat yang ditanyakan',
                  'Selesaikan untuk laju yang dicari, dengan satuannya',
                ],
              },
              explain: L(
                'The numbers of the instant go in after differentiating. Put them in before and the quantities become constants, whose derivative is zero.',
                'Angka pada saat itu dimasukkan setelah menurunkan. Bila dimasukkan sebelumnya, besaran-besaran itu menjadi konstanta, yang turunannya nol.',
              ),
              hint: L('Which must come first: differentiating, or substituting the values of one instant?', 'Mana yang harus lebih dulu: menurunkan, atau memasukkan nilai pada satu saat?'),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'The pond of this lesson is filled at $6\\text{ m}^3/\\text{min}$. How fast is the level rising, in cm per minute, when the water is $2$ m deep?',
                'Kolam pada pelajaran ini diisi $6\\text{ m}^3/\\text{menit}$. Seberapa cepat muka air naik, dalam cm per menit, saat air sedalam $2$ m?',
              ),
              blanks: [{ label: '\\dfrac{dh}{dt} =', answer: 1.190476, tol: 0.01, after: { en: '\\text{cm/min}', id: '\\text{cm/menit}' } }],
              hints: [
                L('The surface at $h=2$ is $(20+8)(10+8)$.', 'Permukaan di $h=2$ adalah $(20+8)(10+8)$.'),
                L('$\\dfrac{dh}{dt}=\\dfrac{Q}{A}$ in meters per minute; multiply by $100$.', '$\\dfrac{dh}{dt}=\\dfrac{Q}{A}$ dalam meter per menit; kalikan $100$.'),
              ],
              explain: L(
                '$A=28\\cdot18=504\\text{ m}^2$, so $\\frac{dh}{dt}=\\frac{6}{504}\\approx0.0119$ m/min $\\approx1.19$ cm/min.',
                '$A=28\\cdot18=504\\text{ m}^2$, jadi $\\frac{dh}{dt}=\\frac{6}{504}\\approx0{,}0119$ m/menit $\\approx1{,}19$ cm/menit.',
              ),
              solution: S('A(2)=28\\cdot18=504', '\\dfrac{dh}{dt}=\\dfrac{6}{504}\\approx0.0119\\ \\text{m}\\approx1.19\\ \\text{cm}'),
            },
            {
              kind: 'math',
              id: 'm2',
              prompt: L(
                'A drainage trough is $6$ m long and its cross-section is a triangle, point down, $2$ m wide at the top and $1$ m deep, so water $h$ m deep has volume $V=6h^2$. Water enters at $0.3\\text{ m}^3/\\text{min}$. How fast is the level rising, in cm per minute, when $h=0.5$ m?',
                'Sebuah talang drainase panjangnya $6$ m dan penampangnya segitiga, lancip ke bawah, selebar $2$ m di atas dan sedalam $1$ m, sehingga air sedalam $h$ m bervolume $V=6h^2$. Air masuk $0{,}3\\text{ m}^3/\\text{menit}$. Seberapa cepat muka air naik, dalam cm per menit, saat $h=0{,}5$ m?',
              ),
              blanks: [{ label: '\\dfrac{dh}{dt} =', answer: 5, tol: 0.03, after: { en: '\\text{cm/min}', id: '\\text{cm/menit}' } }],
              hints: [
                L('$\\dfrac{dV}{dt}=12h\\,\\dfrac{dh}{dt}$.', '$\\dfrac{dV}{dt}=12h\\,\\dfrac{dh}{dt}$.'),
                L('$0.3=12\\cdot0.5\\cdot\\dfrac{dh}{dt}$.', '$0{,}3=12\\cdot0{,}5\\cdot\\dfrac{dh}{dt}$.'),
              ],
              explain: L(
                '$\\frac{dV}{dt}=12h\\frac{dh}{dt}$, so $\\frac{dh}{dt}=\\frac{0.3}{6}=0.05$ m/min $=5$ cm/min. Here $12h=6\\text{ m}^2$ is the water surface: $6$ m long and $1$ m wide.',
                '$\\frac{dV}{dt}=12h\\frac{dh}{dt}$, jadi $\\frac{dh}{dt}=\\frac{0{,}3}{6}=0{,}05$ m/menit $=5$ cm/menit. Di sini $12h=6\\text{ m}^2$ adalah permukaan air: panjang $6$ m dan lebar $1$ m.',
              ),
              solution: S('\\dfrac{dV}{dt}=12h\\,\\dfrac{dh}{dt}', '0.3=12\\cdot0.5\\cdot\\dfrac{dh}{dt}\\Rightarrow\\dfrac{dh}{dt}=0.05\\ \\text{m}=5\\ \\text{cm}'),
            },
          ],
        },
      ],
      project: {
        id: 'sip-m2-s1-p',
        runtime: 'math',
        title: L('A Channel and a Pond', 'Sebuah Saluran dan Sebuah Kolam'),
        brief: L(
          'Shape a channel for the most flow, then follow the level of the pond it feeds.',
          'Bentuk saluran untuk aliran terbesar, lalu ikuti muka air kolam yang diisinya.',
        ),
        requirements: [
          L('Minimize the wetted perimeter, not the area: the area is given.', 'Minimalkan keliling basah, bukan luas: luasnya diketahui.'),
          L('For a rate, differentiate first and substitute the instant afterwards.', 'Untuk laju, turunkan dulu dan masukkan nilai saat itu sesudahnya.'),
        ],
        tasks: [
          {
            prompt: L(
              'A rectangular channel must carry a cross-section of $12.5\\text{ m}^2$. Find the depth and the width of the best hydraulic section.',
              'Saluran persegi panjang harus membawa penampang $12{,}5\\text{ m}^2$. Cari kedalaman dan lebar penampang hidraulik terbaik.',
            ),
            blanks: [
              { label: 'y =', answer: 2.5, after: '\\text{m}' },
              { label: 'b =', answer: 5, after: '\\text{m}' },
            ],
            solution: S("P(y)=\\dfrac{12.5}{y}+2y,\\quad P'(y)=-\\dfrac{12.5}{y^2}+2=0\\Rightarrow y=2.5", 'b=\\dfrac{12.5}{2.5}=5'),
          },
          {
            prompt: L(
              'For that channel ($A=12.5\\text{ m}^2$, $P=10$ m), compute the discharge $Q=\\dfrac{1}{n}AR^{2/3}\\sqrt{S}$ with $n=0.015$ and $S=0.001$, in $\\text{m}^3/\\text{s}$.',
              'Untuk saluran itu ($A=12{,}5\\text{ m}^2$, $P=10$ m), hitung debit $Q=\\dfrac{1}{n}AR^{2/3}\\sqrt{S}$ dengan $n=0{,}015$ dan $S=0{,}001$, dalam $\\text{m}^3/\\text{s}$.',
            ),
            blanks: [{ label: 'Q =', answer: 30.580, tol: 0.1, after: '\\text{m}^3/\\text{s}' }],
            solution: S('R=\\dfrac{12.5}{10}=1.25', 'Q=\\dfrac{1}{0.015}\\cdot12.5\\cdot1.25^{2/3}\\cdot\\sqrt{0.001}\\approx30.58'),
          },
          {
            prompt: L(
              'The pond with floor $20$ m by $10$ m and banks $2$ across for $1$ up is filled at $6\\text{ m}^3/\\text{min}$. How fast is the level rising, in cm per minute, when the water is $3$ m deep?',
              'Kolam berdasar $20$ m kali $10$ m dengan tebing $2$ mendatar untuk $1$ naik diisi $6\\text{ m}^3/\\text{menit}$. Seberapa cepat muka air naik, dalam cm per menit, saat air sedalam $3$ m?',
            ),
            blanks: [{ label: '\\dfrac{dh}{dt} =', answer: 0.852273, tol: 0.01, after: { en: '\\text{cm/min}', id: '\\text{cm/menit}' } }],
            solution: S('A(3)=32\\cdot22=704', '\\dfrac{dh}{dt}=\\dfrac{6}{704}\\approx0.00852\\ \\text{m}\\approx0.85\\ \\text{cm}'),
          },
          {
            prompt: L(
              'How many minutes does it take to fill that pond from empty to a depth of $3$ m at $6\\text{ m}^3/\\text{min}$? Use $V(h)=200h+60h^2+\\frac{16}{3}h^3$.',
              'Berapa menit yang diperlukan untuk mengisi kolam itu dari kosong sampai kedalaman $3$ m dengan $6\\text{ m}^3/\\text{menit}$? Pakai $V(h)=200h+60h^2+\\frac{16}{3}h^3$.',
            ),
            blanks: [{ label: 't =', answer: 214, tol: 0.5, after: { en: '\\text{min}', id: '\\text{menit}' } }],
            solution: S('V(3)=600+540+144=1284', 't=\\dfrac{1284}{6}=214'),
          },
        ],
        hints: [
          L('Part 2: the hydraulic radius is $R=\\dfrac{A}{P}$; a power $\\frac23$ is a cube root, squared.', 'Butir 2: jari-jari hidraulik adalah $R=\\dfrac{A}{P}$; pangkat $\\frac23$ adalah akar pangkat tiga yang dikuadratkan.'),
          L('Part 4: the rate changes all the time, so use the volume, not a rate times a time.', 'Butir 4: lajunya berubah terus, jadi pakai volume, bukan laju kali waktu.'),
        ],
        xp: 50,
      },
    },

    /* ----------------------------------------------------------------------- 2.2 road geometry */
    {
      id: 'sip-m2-s2',
      title: L('The Geometry of a Road', 'Geometri Jalan'),
      summary: L(
        'Grade as a derivative, the parabola that joins two grades, the curvature of a bend, and what a small error in a measurement does to a result.',
        'Kelandaian sebagai turunan, parabola yang menyambung dua kelandaian, kelengkungan tikungan, dan akibat galat kecil suatu pengukuran pada hasilnya.',
      ),
      lessons: [
        {
          id: 'sip-m2-s2-l1',
          title: L('Vertical Curves: Grade Is a Derivative', 'Lengkung Vertikal: Kelandaian adalah Turunan'),
          goal: L(
            'Join two grades with a parabola, and find the highest or lowest point of the road where the grade is zero.',
            'Menyambung dua kelandaian dengan parabola, dan mencari titik tertinggi atau terendah jalan di tempat kelandaian nol.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('A road sign that states a derivative', 'Rambu jalan yang menyatakan turunan'),
              body: L(
                T`
A sign that says $4\%$ means the road rises $4$ m for every $100$ m forward. If $y(x)$ is the elevation of the road at distance $x$, that number is the derivative:
$$\text{grade}=\frac{dy}{dx}=0.04.$$

A road that climbs at $+4\%$ and then descends at $-2\%$ cannot simply change from one to the other: the sudden kink would throw a vehicle and hide what lies ahead. The two grades are joined by a **vertical curve** along which the grade changes steadily. If the curve is $L$ meters long and the grade must go evenly from $g_1$ to $g_2$:
$$y'(x)=g_1+\frac{g_2-g_1}{L}\,x,\qquad 0\le x\le L.$$

The elevation is the function whose derivative that is,
$$y(x)=y_0+g_1x+\frac{g_2-g_1}{2L}\,x^2,$$
as differentiating it shows. It is a **parabola**, and its second derivative $y''=\dfrac{g_2-g_1}{L}$ is constant: the same change of grade on every meter.`,
                T`
Rambu bertuliskan $4\%$ berarti jalan naik $4$ m untuk setiap $100$ m maju. Bila $y(x)$ adalah elevasi jalan pada jarak $x$, bilangan itu adalah turunannya:
$$\text{kelandaian}=\frac{dy}{dx}=0{,}04.$$

Jalan yang menanjak $+4\%$ lalu menurun $-2\%$ tak dapat begitu saja berganti dari satu ke yang lain: patahan mendadak itu akan melempar kendaraan dan menyembunyikan apa yang ada di depan. Kedua kelandaian disambung oleh **lengkung vertikal** yang kelandaiannya berubah dengan tetap. Bila lengkung itu sepanjang $L$ meter dan kelandaian harus berubah merata dari $g_1$ ke $g_2$:
$$y'(x)=g_1+\frac{g_2-g_1}{L}\,x,\qquad 0\le x\le L.$$

Elevasinya adalah fungsi yang turunannya demikian,
$$y(x)=y_0+g_1x+\frac{g_2-g_1}{2L}\,x^2,$$
seperti terlihat bila diturunkan. Itu sebuah **parabola**, dan turunan keduanya $y''=\dfrac{g_2-g_1}{L}$ tetap: perubahan kelandaian yang sama pada setiap meter.`,
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'On a vertical curve $y(x)=y_0+g_1x+\\dfrac{g_2-g_1}{2L}x^2$, what is the second derivative $y\'\'$?',
                'Pada lengkung vertikal $y(x)=y_0+g_1x+\\dfrac{g_2-g_1}{2L}x^2$, berapa turunan kedua $y\'\'$?',
              ),
              options: [
                L('The constant $\\dfrac{g_2-g_1}{L}$: the change of grade per meter', 'Konstanta $\\dfrac{g_2-g_1}{L}$: perubahan kelandaian per meter'),
                L('$g_1$, the grade at the start', '$g_1$, kelandaian di awal'),
                L('Zero, because a road is nearly straight', 'Nol, sebab jalan hampir lurus'),
                L('It changes from point to point', 'Berubah dari titik ke titik'),
              ],
              answer: 0,
              explain: L(
                '$y\'=g_1+\\frac{g_2-g_1}{L}x$ is a straight line in $x$, so its derivative is its slope, $\\frac{g_2-g_1}{L}$. That constant is what makes the ride even.',
                '$y\'=g_1+\\frac{g_2-g_1}{L}x$ adalah garis lurus dalam $x$, sehingga turunannya adalah kemiringannya, $\\frac{g_2-g_1}{L}$. Konstanta itulah yang membuat perjalanan terasa rata.',
              ),
              hint: L('Differentiate twice: first to the grade, then once more.', 'Turunkan dua kali: pertama ke kelandaian, lalu sekali lagi.'),
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('The top of the hill is where the grade is zero', 'Puncak bukit adalah tempat kelandaian nol'),
              body: L(
                T`
A crest curve $L=300$ m long joins $g_1=+4\%$ to $g_2=-2\%$, starting at elevation $y_0=100$ m. Then
$$y(x)=100+0.04x-0.0001x^2$$
$$y'(x)=0.04-0.0002x.$$

The road is highest where it is level, $y'=0$:
$$0.04-0.0002x=0\ \Rightarrow\ x=200\text{ m}$$
$$y(200)=100+8-4=104\text{ m}.$$
The top is **not** at the middle of the curve ($x=150$): it lies towards the gentler grade. The curve ends at $y(300)=100+12-9=103$ m.

In general the grade is zero at
$$x=\frac{-g_1L}{g_2-g_1},$$
and that is a highest or lowest point of the road only if it falls between $0$ and $L$, which happens exactly when $g_1$ and $g_2$ have opposite signs. Drainage inlets are placed at the lowest point of a sag curve, and the sight distance over a crest is judged from its highest.`,
                T`
Lengkung cembung sepanjang $L=300$ m menyambung $g_1=+4\%$ ke $g_2=-2\%$, mulai dari elevasi $y_0=100$ m. Maka
$$y(x)=100+0{,}04x-0{,}0001x^2$$
$$y'(x)=0{,}04-0{,}0002x.$$

Jalan paling tinggi di tempat ia mendatar, $y'=0$:
$$0{,}04-0{,}0002x=0\ \Rightarrow\ x=200\text{ m}$$
$$y(200)=100+8-4=104\text{ m}.$$
Puncaknya **bukan** di tengah lengkung ($x=150$): ia berada ke arah kelandaian yang lebih landai. Lengkung berakhir di $y(300)=100+12-9=103$ m.

Secara umum kelandaian nol di
$$x=\frac{-g_1L}{g_2-g_1},$$
dan itu titik tertinggi atau terendah jalan hanya bila letaknya di antara $0$ dan $L$, yang terjadi tepat ketika $g_1$ dan $g_2$ berlawanan tanda. Lubang drainase ditempatkan di titik terendah lengkung cekung, dan jarak pandang di atas lengkung cembung dinilai dari titik tertingginya.`,
              ),
              scene3d: roadScene,
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'For $y(x)=100+\\dfrac{4}{100}x-\\dfrac{x^2}{10\\,000}$, complete the grade and the place where it is zero.',
                'Untuk $y(x)=100+\\dfrac{4}{100}x-\\dfrac{x^2}{10.000}$, lengkapi kelandaian dan tempat ia nol.',
              ),
              template: "y'(x) = \\dfrac{4}{100} - \\dfrac{x}{___} = 0 \\Rightarrow x = ___",
              blanks: ['5000', '200'],
              explain: L(
                'The derivative of $\\frac{x^2}{10\\,000}$ is $\\frac{2x}{10\\,000}=\\frac{x}{5000}$, and $\\frac{x}{5000}=\\frac{4}{100}$ gives $x=200$.',
                'Turunan $\\frac{x^2}{10.000}$ adalah $\\frac{2x}{10.000}=\\frac{x}{5000}$, dan $\\frac{x}{5000}=\\frac{4}{100}$ memberi $x=200$.',
              ),
              hint: L('The $2$ from the exponent halves the denominator.', 'Angka $2$ dari pangkat membagi dua penyebutnya.'),
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: L(
                'Order the working that finds the highest point of the crest curve with $g_1=0.04$, $g_2=-0.02$, $L=300$, $y_0=100$.',
                'Susun langkah yang menemukan titik tertinggi lengkung cembung dengan $g_1=0{,}04$, $g_2=-0{,}02$, $L=300$, $y_0=100$.',
              ),
              lines: S('y(x)=100+0.04x-0.0001x^2', "y'(x)=0.04-0.0002x", '0.04-0.0002x=0', 'x=200', 'y(200)=100+8-4=104'),
              explain: L(
                'Write the elevation, differentiate to the grade, set the grade to zero, solve for the place, and only then compute the elevation there.',
                'Tulis elevasinya, turunkan menjadi kelandaian, samakan kelandaian dengan nol, selesaikan untuk tempatnya, dan baru kemudian hitung elevasi di sana.',
              ),
              hint: L('The elevation of the top can only be computed once its place is known.', 'Elevasi puncak baru dapat dihitung setelah tempatnya diketahui.'),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'A sag curve $200$ m long joins $g_1=-3\\%$ to $g_2=+2\\%$ and starts at elevation $50$ m, so $y(x)=50-0.03x+0.000125x^2$. Find the lowest point of the road: its distance $x$ and its elevation.',
                'Lengkung cekung sepanjang $200$ m menyambung $g_1=-3\\%$ ke $g_2=+2\\%$ dan mulai pada elevasi $50$ m, sehingga $y(x)=50-0{,}03x+0{,}000125x^2$. Cari titik terendah jalan: jaraknya $x$ dan elevasinya.',
              ),
              blanks: [
                { label: 'x =', answer: 120, tol: 0.5, after: '\\text{m}' },
                { label: 'y =', answer: 48.2, tol: 0.02, after: '\\text{m}' },
              ],
              hints: [
                L('$y\'(x)=-0.03+0.00025x$.', '$y\'(x)=-0{,}03+0{,}00025x$.'),
                L('$x=\\dfrac{0.03}{0.00025}$; then put it into $y$.', '$x=\\dfrac{0{,}03}{0{,}00025}$; lalu masukkan ke $y$.'),
              ],
              explain: L(
                '$y\'=0$ at $x=120$ m, and $y(120)=50-3.6+1.8=48.2$ m. This is where the water collects, so this is where the drain goes.',
                '$y\'=0$ di $x=120$ m, dan $y(120)=50-3{,}6+1{,}8=48{,}2$ m. Di sinilah air terkumpul, jadi di sinilah saluran pembuangnya dipasang.',
              ),
              solution: S("y'(x)=-0.03+0.00025x=0\\Rightarrow x=120", 'y(120)=50-3.6+1.8=48.2'),
            },
            {
              kind: 'math',
              id: 'm2',
              prompt: L(
                'A crest curve $400$ m long joins $g_1=+5\\%$ to $g_2=-3\\%$ and starts at elevation $20$ m. Find the distance $x$ of the highest point and its elevation.',
                'Lengkung cembung sepanjang $400$ m menyambung $g_1=+5\\%$ ke $g_2=-3\\%$ dan mulai pada elevasi $20$ m. Cari jarak $x$ titik tertinggi dan elevasinya.',
              ),
              blanks: [
                { label: 'x =', answer: 250, tol: 0.5, after: '\\text{m}' },
                { label: 'y =', answer: 26.25, tol: 0.02, after: '\\text{m}' },
              ],
              hints: [
                L('$y(x)=20+0.05x+\\dfrac{-0.03-0.05}{2\\cdot400}x^2$.', '$y(x)=20+0{,}05x+\\dfrac{-0{,}03-0{,}05}{2\\cdot400}x^2$.'),
                L('$y\'(x)=0.05-0.0002x$.', '$y\'(x)=0{,}05-0{,}0002x$.'),
              ],
              explain: L(
                '$y=20+0.05x-0.0001x^2$, $y\'=0.05-0.0002x=0$ at $x=250$ m, and $y(250)=20+12.5-6.25=26.25$ m.',
                '$y=20+0{,}05x-0{,}0001x^2$, $y\'=0{,}05-0{,}0002x=0$ di $x=250$ m, dan $y(250)=20+12{,}5-6{,}25=26{,}25$ m.',
              ),
              solution: S('y(x)=20+0.05x-0.0001x^2', "y'(x)=0.05-0.0002x=0\\Rightarrow x=250", 'y(250)=20+12.5-6.25=26.25'),
            },
          ],
        },
        {
          id: 'sip-m2-s2-l2',
          title: L('Curvature, Radius, and Small Errors', 'Kelengkungan, Jari-jari, dan Galat Kecil'),
          goal: L(
            'Compute the radius of a bend from the first two derivatives, and estimate the effect of a small error with a differential.',
            'Menghitung jari-jari tikungan dari dua turunan pertama, dan memperkirakan akibat galat kecil dengan diferensial.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('How tight is a bend?', 'Seberapa tajam sebuah tikungan?'),
              body: L(
                T`
Seen from above, the centerline of a road is a curve $y=f(x)$. At each point there is one circle that fits the curve best, and its radius $R$ is the **radius of curvature**. The tighter the bend, the smaller the circle. Its reciprocal $\kappa=\dfrac1R$ is the **curvature**, and both come from the first two derivatives:
$$\kappa=\frac{|y''|}{\left(1+y'^2\right)^{3/2}}$$
$$R=\frac1\kappa.$$

Take a road with centerline $y=\dfrac{x^2}{400}$ (in meters). Then $y'=\dfrac{x}{200}$ and $y''=\dfrac{1}{200}$.

- At $x=0$: $y'=0$, so $\kappa=\dfrac{1}{200}$ and $R=200$ m.
- At $x=100$: $y'=0.5$, so $R=200\cdot(1.25)^{3/2}\approx279.5$ m.

The bend is tightest at the vertex and opens up on both sides. The radius matters because a vehicle at speed $v$ needs a sideways acceleration $\dfrac{v^2}{R}$ to follow the bend: at $20$ m/s ($72$ km/h) on $R=200$ m that is $2\text{ m/s}^2$, which the tires and the banking of the road must supply.`,
                T`
Dilihat dari atas, garis tengah jalan adalah kurva $y=f(x)$. Di setiap titik ada satu lingkaran yang paling pas dengan kurva itu, dan jari-jarinya $R$ adalah **jari-jari kelengkungan**. Makin tajam tikungannya, makin kecil lingkarannya. Kebalikannya $\kappa=\dfrac1R$ adalah **kelengkungan**, dan keduanya berasal dari dua turunan pertama:
$$\kappa=\frac{|y''|}{\left(1+y'^2\right)^{3/2}}$$
$$R=\frac1\kappa.$$

Ambil jalan dengan garis tengah $y=\dfrac{x^2}{400}$ (dalam meter). Maka $y'=\dfrac{x}{200}$ dan $y''=\dfrac{1}{200}$.

- Di $x=0$: $y'=0$, sehingga $\kappa=\dfrac{1}{200}$ dan $R=200$ m.
- Di $x=100$: $y'=0{,}5$, sehingga $R=200\cdot(1{,}25)^{3/2}\approx279{,}5$ m.

Tikungan paling tajam di puncak parabola dan makin landai di kedua sisinya. Jari-jari itu penting karena kendaraan berkecepatan $v$ memerlukan percepatan ke samping $\dfrac{v^2}{R}$ untuk mengikuti tikungan: pada $20$ m/s ($72$ km/jam) di $R=200$ m nilainya $2\text{ m/s}^2$, yang harus disediakan ban dan kemiringan melintang jalan.`,
              ),
              scene3d: planScene,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'On the road $y=\\dfrac{x^2}{400}$, where is the bend tightest (the radius of curvature smallest)?',
                'Pada jalan $y=\\dfrac{x^2}{400}$, di mana tikungan paling tajam (jari-jari kelengkungan terkecil)?',
              ),
              options: [
                L('At $x=0$, where the slope $y\'$ is zero', 'Di $x=0$, tempat kemiringan $y\'$ nol'),
                L('At $x=100$', 'Di $x=100$'),
                L('It is equally tight everywhere, because $y\'\'$ is constant', 'Sama tajam di mana-mana, sebab $y\'\'$ tetap'),
                L('Far from the origin, where the road is steepest', 'Jauh dari titik asal, tempat jalan paling curam'),
              ],
              answer: 0,
              explain: L(
                '$y\'\'$ is constant, but the curvature divides it by $(1+y\'^2)^{3/2}$, which is smallest when $y\'=0$. A parabola is not a circle: only a circle bends the same everywhere.',
                '$y\'\'$ tetap, tetapi kelengkungan membaginya dengan $(1+y\'^2)^{3/2}$, yang terkecil ketika $y\'=0$. Parabola bukan lingkaran: hanya lingkaran yang melengkung sama di mana-mana.',
              ),
              hint: L('In the formula for $\\kappa$, the top is constant here. When is the bottom smallest?', 'Dalam rumus $\\kappa$, pembilangnya tetap di sini. Kapan penyebutnya terkecil?'),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'For the road $y=\\dfrac{x^2}{400}$, find the radius of curvature at $x=200$ m.',
                'Untuk jalan $y=\\dfrac{x^2}{400}$, cari jari-jari kelengkungan di $x=200$ m.',
              ),
              blanks: [{ label: 'R =', answer: 565.685425, tol: 1, after: '\\text{m}' }],
              hints: [
                L('At $x=200$, $y\'=1$ and $y\'\'=\\dfrac{1}{200}$.', 'Di $x=200$, $y\'=1$ dan $y\'\'=\\dfrac{1}{200}$.'),
                L('$R=\\dfrac{(1+1)^{3/2}}{1/200}$.', '$R=\\dfrac{(1+1)^{3/2}}{1/200}$.'),
              ],
              explain: L(
                '$R=200\\cdot2^{3/2}=400\\sqrt2\\approx565.7$ m: almost three times the radius at the vertex.',
                '$R=200\\cdot2^{3/2}=400\\sqrt2\\approx565{,}7$ m: hampir tiga kali jari-jari di puncak parabola.',
              ),
              solution: S("y'(200)=1,\\quad y''=\\dfrac{1}{200}", 'R=\\dfrac{(1+1^2)^{3/2}}{1/200}=200\\cdot2\\sqrt2\\approx565.69'),
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('What a small error costs', 'Akibat sebuah galat kecil'),
              body: L(
                T`
No measurement is exact. If a result $f$ is computed from a measured $x$, a small error $dx$ in the measurement changes the result by about
$$df=f'(x)\,dx.$$
The derivative is the exchange rate between the error going in and the error coming out.

**A tower.** A surveyor $50$ m from a tower measures the angle to its top as $\theta=60^\circ$, so $h=50\tan\theta\approx86.6$ m. If the angle may be off by $0.5^\circ=0.00873$ rad:
$$dh=50\sec^2\theta\,d\theta$$
$$=50\cdot4\cdot0.00873\approx1.75\text{ m}.$$
At $30^\circ$ the same half degree costs only $0.58$ m, because $\sec^2\theta$ is three times smaller there. Steep sightings are unforgiving.

**A span.** The sag of a beam is proportional to $L^4$. Then $\dfrac{dy}{y}=4\,\dfrac{dL}{L}$: a span $1\%$ longer sags about $4\%$ more. An exponent in a formula is the factor by which relative error is multiplied.

**A bridge.** A steel deck $120$ m long grows by $dL=\alpha L\,dT$ when it warms. With $\alpha=12\times10^{-6}$ per degree and a swing of $40^\circ$C, $dL=0.0576$ m: the expansion joint must take about $58$ mm.`,
                T`
Tak ada pengukuran yang eksak. Bila hasil $f$ dihitung dari $x$ yang diukur, galat kecil $dx$ pada pengukuran mengubah hasil sekitar
$$df=f'(x)\,dx.$$
Turunan adalah nilai tukar antara galat yang masuk dan galat yang keluar.

**Sebuah menara.** Juru ukur yang berada $50$ m dari menara mengukur sudut ke puncaknya sebesar $\theta=60^\circ$, sehingga $h=50\tan\theta\approx86{,}6$ m. Bila sudut itu mungkin meleset $0{,}5^\circ=0{,}00873$ rad:
$$dh=50\sec^2\theta\,d\theta$$
$$=50\cdot4\cdot0{,}00873\approx1{,}75\text{ m}.$$
Pada $30^\circ$ setengah derajat yang sama hanya berarti $0{,}58$ m, sebab $\sec^2\theta$ tiga kali lebih kecil di sana. Bidikan yang curam tidak kenal ampun.

**Sebuah bentang.** Lendutan balok sebanding dengan $L^4$. Maka $\dfrac{dy}{y}=4\,\dfrac{dL}{L}$: bentang yang $1\%$ lebih panjang melendut sekitar $4\%$ lebih besar. Pangkat dalam sebuah rumus adalah faktor pengali galat relatif.

**Sebuah jembatan.** Lantai baja sepanjang $120$ m memanjang $dL=\alpha L\,dT$ saat memanas. Dengan $\alpha=12\times10^{-6}$ per derajat dan ayunan suhu $40^\circ$C, $dL=0{,}0576$ m: sambungan muai harus menampung sekitar $58$ mm.`,
              ),
              scene3d: towerScene,
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Complete the two rules for relative error: for a sag $y=kL^4$, and for a section modulus $S=\\frac{bh^2}{6}$ with $b$ fixed.',
                'Lengkapi dua aturan galat relatif: untuk lendutan $y=kL^4$, dan untuk modulus penampang $S=\\frac{bh^2}{6}$ dengan $b$ tetap.',
              ),
              template: '\\dfrac{dy}{y} = ___\\,\\dfrac{dL}{L}, \\qquad \\dfrac{dS}{S} = ___\\,\\dfrac{dh}{h}',
              blanks: ['4', '2'],
              explain: L(
                'For $f=kx^n$, $df=nkx^{n-1}dx$, so $\\frac{df}{f}=n\\frac{dx}{x}$: the exponent multiplies the relative error.',
                'Untuk $f=kx^n$, $df=nkx^{n-1}dx$, sehingga $\\frac{df}{f}=n\\frac{dx}{x}$: pangkatnya mengalikan galat relatif.',
              ),
              hint: L('Differentiate $kx^n$, then divide by $kx^n$ itself.', 'Turunkan $kx^n$, lalu bagi dengan $kx^n$ itu sendiri.'),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The surveyor $50$ m from the tower has the same doubt of $0.5^\\circ$ in every angle. Compared with a sighting at $30^\\circ$, how large is the error in height for a sighting at $60^\\circ$?',
                'Juru ukur yang $50$ m dari menara memiliki keraguan $0{,}5^\\circ$ yang sama pada setiap sudut. Dibanding bidikan $30^\\circ$, seberapa besar galat tinggi untuk bidikan $60^\\circ$?',
              ),
              options: [L('3 times as large', '3 kali lipat'), L('2 times as large', '2 kali lipat'), L('The same', 'Sama'), L('Half as large', 'Setengahnya')],
              answer: 0,
              explain: L(
                '$dh=50\\sec^2\\theta\\,d\\theta$, and $\\sec^260^\\circ=4$ while $\\sec^230^\\circ=\\frac43$. The ratio is $3$.',
                '$dh=50\\sec^2\\theta\\,d\\theta$, dan $\\sec^260^\\circ=4$ sedangkan $\\sec^230^\\circ=\\frac43$. Perbandingannya $3$.',
              ),
              hint: L('Compare $\\sec^2\\theta=\\dfrac{1}{\\cos^2\\theta}$ at the two angles.', 'Bandingkan $\\sec^2\\theta=\\dfrac{1}{\\cos^2\\theta}$ pada kedua sudut.'),
            },
            {
              kind: 'math',
              id: 'm2',
              prompt: L(
                'A surveyor $80$ m from a building measures the angle to its top as $45^\\circ$, with a possible error of $0.25^\\circ$. Estimate the error in the height $h=80\\tan\\theta$, in meters.',
                'Juru ukur yang $80$ m dari sebuah gedung mengukur sudut ke puncaknya sebesar $45^\\circ$, dengan kemungkinan galat $0{,}25^\\circ$. Perkirakan galat tinggi $h=80\\tan\\theta$, dalam meter.',
              ),
              blanks: [{ label: 'dh =', answer: 0.698132, tol: 0.01, after: '\\text{m}' }],
              hints: [
                L('$dh=80\\sec^2\\theta\\,d\\theta$, with $d\\theta$ in radians.', '$dh=80\\sec^2\\theta\\,d\\theta$, dengan $d\\theta$ dalam radian.'),
                L('$\\sec^245^\\circ=2$ and $0.25^\\circ=0.25\\cdot\\dfrac{\\pi}{180}$ rad.', '$\\sec^245^\\circ=2$ dan $0{,}25^\\circ=0{,}25\\cdot\\dfrac{\\pi}{180}$ rad.'),
              ],
              explain: L(
                '$dh=80\\cdot2\\cdot0.004363\\approx0.70$ m on a height of $80$ m: under one percent.',
                '$dh=80\\cdot2\\cdot0{,}004363\\approx0{,}70$ m pada tinggi $80$ m: kurang dari satu persen.',
              ),
              solution: S('d\\theta=0.25\\cdot\\dfrac{\\pi}{180}\\approx0.004363', 'dh=80\\sec^2 45^\\circ\\,d\\theta=80\\cdot2\\cdot0.004363\\approx0.698'),
            },
            {
              kind: 'math',
              id: 'm3',
              prompt: L(
                'A steel bridge deck is $200$ m long. With $\\alpha=12\\times10^{-6}$ per degree, how many millimeters does it lengthen when its temperature rises by $35^\\circ$C?',
                'Lantai jembatan baja panjangnya $200$ m. Dengan $\\alpha=12\\times10^{-6}$ per derajat, berapa milimeter ia memanjang saat suhunya naik $35^\\circ$C?',
              ),
              blanks: [{ label: 'dL =', answer: 84, tol: 0.5, after: '\\text{mm}' }],
              hints: [L('$dL=\\alpha L\\,dT$, in meters; then convert to millimeters.', '$dL=\\alpha L\\,dT$, dalam meter; lalu ubah ke milimeter.')],
              explain: L(
                '$dL=12\\times10^{-6}\\cdot200\\cdot35=0.084$ m $=84$ mm.',
                '$dL=12\\times10^{-6}\\cdot200\\cdot35=0{,}084$ m $=84$ mm.',
              ),
              solution: S('dL=12\\times10^{-6}\\cdot200\\cdot35=0.084\\ \\text{m}=84\\ \\text{mm}'),
            },
          ],
        },
      ],
      project: {
        id: 'sip-m2-s2-p',
        runtime: 'math',
        title: L('Setting Out a Road', 'Mematok Sebuah Jalan'),
        brief: L(
          'One vertical curve, one bend, and two estimates of error.',
          'Satu lengkung vertikal, satu tikungan, dan dua perkiraan galat.',
        ),
        requirements: [
          L('Write grades as decimals: $3\\%$ is $0.03$.', 'Tulis kelandaian sebagai desimal: $3\\%$ adalah $0{,}03$.'),
          L('Angles inside a differential are in radians.', 'Sudut di dalam diferensial dinyatakan dalam radian.'),
        ],
        tasks: [
          {
            prompt: L(
              'A crest curve $200$ m long joins $g_1=+3\\%$ to $g_2=-1\\%$ and starts at elevation $60$ m. Find the distance $x$ of the highest point and its elevation.',
              'Lengkung cembung sepanjang $200$ m menyambung $g_1=+3\\%$ ke $g_2=-1\\%$ dan mulai pada elevasi $60$ m. Cari jarak $x$ titik tertinggi dan elevasinya.',
            ),
            blanks: [
              { label: 'x =', answer: 150, tol: 0.5, after: '\\text{m}' },
              { label: 'y =', answer: 62.25, tol: 0.02, after: '\\text{m}' },
            ],
            solution: S('y(x)=60+0.03x-0.0001x^2', "y'(x)=0.03-0.0002x=0\\Rightarrow x=150", 'y(150)=60+4.5-2.25=62.25'),
          },
          {
            prompt: L(
              'A road has centerline $y=\\dfrac{x^2}{200}$ (meters). Find its radius of curvature at $x=50$ m.',
              'Sebuah jalan memiliki garis tengah $y=\\dfrac{x^2}{200}$ (meter). Cari jari-jari kelengkungannya di $x=50$ m.',
            ),
            blanks: [{ label: 'R =', answer: 139.754249, tol: 0.5, after: '\\text{m}' }],
            solution: S("y'(50)=0.5,\\quad y''=0.01", 'R=\\dfrac{(1+0.25)^{3/2}}{0.01}\\approx139.75'),
          },
          {
            prompt: L(
              'The sag of a beam is proportional to $L^4$. If the span is made $2\\%$ longer, by about what percent does the sag grow?',
              'Lendutan balok sebanding dengan $L^4$. Bila bentangnya dibuat $2\\%$ lebih panjang, kira-kira berapa persen lendutannya bertambah?',
            ),
            blanks: [{ answer: 8, tol: 0.3, after: '\\%' }],
            solution: S('\\dfrac{dy}{y}=4\\,\\dfrac{dL}{L}=4\\cdot2\\%=8\\%'),
          },
          {
            prompt: L(
              'A surveyor $30$ m from a mast measures the angle to its top as $60^\\circ$, with a possible error of $1^\\circ$. Estimate the error in the height $h=30\\tan\\theta$, in meters.',
              'Juru ukur yang $30$ m dari sebuah tiang mengukur sudut ke puncaknya sebesar $60^\\circ$, dengan kemungkinan galat $1^\\circ$. Perkirakan galat tinggi $h=30\\tan\\theta$, dalam meter.',
            ),
            blanks: [{ label: 'dh =', answer: 2.094395, tol: 0.02, after: '\\text{m}' }],
            solution: S('d\\theta=\\dfrac{\\pi}{180}\\approx0.017453', 'dh=30\\sec^2 60^\\circ\\,d\\theta=30\\cdot4\\cdot0.017453\\approx2.094'),
          },
        ],
        hints: [
          L('Part 1: the coefficient of $x^2$ is $\\dfrac{g_2-g_1}{2L}$.', 'Butir 1: koefisien $x^2$ adalah $\\dfrac{g_2-g_1}{2L}$.'),
          L('Part 2: $R=\\dfrac{(1+y\'^2)^{3/2}}{|y\'\'|}$.', 'Butir 2: $R=\\dfrac{(1+y\'^2)^{3/2}}{|y\'\'|}$.'),
        ],
        xp: 50,
      },
    },
  ],
}
