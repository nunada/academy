import type { Module } from '../types'
import { L, S, T } from './kit'
import { beamScene, loadScene, logStiffnessScene, logStrengthScene, tankScene } from './scenes'

/** Module 1 — a beam is a function, and the four things an engineer asks of it (how far it sags, how much it turns, how hard it bends, how hard it
 *  shears) are that function's derivatives, one after another. Then the first design question: which rectangle to cut from a round log. */
export const module1: Module = {
  id: 'sip-m1',
  title: L('Beams: Deflection, Moment, and the Best Section', 'Balok: Lendutan, Momen, dan Penampang Terbaik'),
  summary: L(
    'The deflection of a beam and its derivatives, slope, bending moment, shear and load, and how a derivative set to zero picks the strongest and the stiffest section.',
    'Lendutan sebuah balok dan turunan-turunannya, kemiringan, momen lentur, gaya geser, dan beban, serta bagaimana turunan yang disamakan dengan nol memilih penampang terkuat dan terkaku.',
  ),
  submodules: [
    /* ------------------------------------------------------------- 1.1 the chain of derivatives */
    {
      id: 'sip-m1-s1',
      title: L('A Beam Is a Chain of Derivatives', 'Balok adalah Rantai Turunan'),
      summary: L(
        'From the deflection curve to slope, bending moment, shear and load, each the derivative of the one before, and where each is largest.',
        'Dari kurva lendutan ke kemiringan, momen lentur, gaya geser, dan beban, masing-masing turunan dari yang sebelumnya, dan di mana masing-masing terbesar.',
      ),
      lessons: [
        {
          id: 'sip-m1-s1-l1',
          title: L('Deflection, Slope, and Bending Moment', 'Lendutan, Kemiringan, dan Momen Lentur'),
          goal: L(
            'Read the deflection of a beam as a function, its first derivative as the slope and its second derivative as the bending moment.',
            'Membaca lendutan balok sebagai fungsi, turunan pertamanya sebagai kemiringan, dan turunan keduanya sebagai momen lentur.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('A loaded beam is the graph of a function', 'Balok yang dibebani adalah grafik sebuah fungsi'),
              body: L(
                T`
A beam that carries a load sags. Measure $x$ along the beam from its left support, and call $y(x)$ how far the beam has moved at $x$, negative when it moves down. That curve is the **deflection** of the beam, and everything a structural engineer needs is read from it with derivatives.

Take a beam of span $L=6$ m resting on two supports, under a load of $w=10$ kN on every meter, with stiffness $EI=20\,000\text{ kN·m}^2$ (more on $EI$ in a moment). Its deflection is
$$y(x)=-\frac{w\,x\,(L^3-2Lx^2+x^3)}{24\,EI}$$
$$=-\frac{x\,(216-12x^2+x^3)}{48\,000}\ \text{m}.$$

- At the supports, $y(0)=y(6)=0$: the beam cannot move there.
- At the middle, $y(3)=-\frac{3\cdot135}{48\,000}\approx-0.0084$ m: the beam sags about $8.4$ mm.

The **first derivative** $y'(x)$ is the **slope** of the bent beam, the small angle (in radians) by which a section has turned. Where $y'=0$ the beam is level, and that is exactly where the sag is largest: the same rule that finds any maximum or minimum.`,
                T`
Balok yang memikul beban akan melendut. Ukur $x$ sepanjang balok dari tumpuan kirinya, dan sebut $y(x)$ seberapa jauh balok berpindah di $x$, negatif bila turun. Kurva itu adalah **lendutan** balok, dan semua yang diperlukan insinyur struktur dibaca darinya dengan turunan.

Ambil balok berbentang $L=6$ m yang bertumpu pada dua tumpuan, memikul beban $w=10$ kN pada setiap meter, dengan kekakuan $EI=20.000\text{ kN·m}^2$ (tentang $EI$ sebentar lagi). Lendutannya adalah
$$y(x)=-\frac{w\,x\,(L^3-2Lx^2+x^3)}{24\,EI}$$
$$=-\frac{x\,(216-12x^2+x^3)}{48.000}\ \text{m}.$$

- Di tumpuan, $y(0)=y(6)=0$: balok tak dapat bergerak di sana.
- Di tengah, $y(3)=-\frac{3\cdot135}{48.000}\approx-0{,}0084$ m: balok melendut sekitar $8{,}4$ mm.

**Turunan pertama** $y'(x)$ adalah **kemiringan** balok yang melentur, sudut kecil (dalam radian) perputaran sebuah penampang. Di tempat $y'=0$ balok mendatar, dan tepat di situlah lendutan terbesar: aturan yang sama yang menemukan maksimum atau minimum mana pun.`,
              ),
              scene3d: beamScene,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The beam and its load are symmetric about the middle. Where is the slope $y\'$ equal to zero?',
                'Balok dan bebannya simetris terhadap tengah bentang. Di mana kemiringan $y\'$ sama dengan nol?',
              ),
              options: [
                L('At the middle of the span, where the sag is largest', 'Di tengah bentang, tempat lendutan terbesar'),
                L('At the two supports', 'Di kedua tumpuan'),
                L('At a quarter of the span', 'Di seperempat bentang'),
                L('Nowhere: a bent beam always slopes', 'Tidak di mana pun: balok yang melentur selalu miring'),
              ],
              answer: 0,
              explain: L(
                'The lowest point of a smooth curve has a horizontal tangent, so $y\'=0$ there, and by symmetry the lowest point is the middle. At the supports the deflection is zero but the slope is at its steepest.',
                'Titik terendah sebuah kurva mulus memiliki garis singgung mendatar, sehingga $y\'=0$ di sana, dan karena simetri titik terendah itu adalah tengah bentang. Di tumpuan lendutannya nol tetapi kemiringannya justru paling curam.',
              ),
              hint: L(
                'Move $x$ in the picture and watch the slope readout change sign. What must the tangent look like at the lowest point of the curve?',
                'Geser $x$ pada gambar dan perhatikan angka kemiringan berganti tanda. Seperti apa garis singgung di titik terendah kurva?',
              ),
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('The second derivative is the bending moment', 'Turunan kedua adalah momen lentur'),
              body: L(
                T`
How hard is the beam being bent at $x$? That is the **bending moment** $M(x)$, and it is tied to the deflection by the most used equation in structural engineering:
$$EI\,y''(x)=M(x).$$
$E$ measures the material (steel is stiffer than timber) and $I$ the shape of the cross-section, so $EI$ is the beam's resistance to bending. The second derivative $y''$ is how fast the slope changes, the **curvature**: a large moment or a small $EI$ bends the beam sharply.

For our beam, multiply the deflection by $EI$ and differentiate twice:

| Quantity | Formula |
|---|---|
| $EI\,y$ | $-\frac{5}{12}x^4+5x^3-90x$ |
| $EI\,y'$ | $-\frac{5}{3}x^3+15x^2-90$ |
| $EI\,y''=M$ | $-5x^2+30x=5x(6-x)$ |

So $M(3)=5\cdot3\cdot3=45\text{ kN·m}$ at the middle and $M(0)=M(6)=0$ at the supports, which is what a support that lets the beam turn freely must give.`,
                T`
Seberapa kuat balok dilenturkan di $x$? Itulah **momen lentur** $M(x)$, dan ia terikat pada lendutan oleh persamaan yang paling sering dipakai dalam rekayasa struktur:
$$EI\,y''(x)=M(x).$$
$E$ mengukur bahannya (baja lebih kaku daripada kayu) dan $I$ bentuk penampangnya, sehingga $EI$ adalah ketahanan balok terhadap lenturan. Turunan kedua $y''$ adalah seberapa cepat kemiringan berubah, yaitu **kelengkungan**: momen yang besar atau $EI$ yang kecil melenturkan balok dengan tajam.

Untuk balok kita, kalikan lendutan dengan $EI$ dan turunkan dua kali:

| Besaran | Rumus |
|---|---|
| $EI\,y$ | $-\frac{5}{12}x^4+5x^3-90x$ |
| $EI\,y'$ | $-\frac{5}{3}x^3+15x^2-90$ |
| $EI\,y''=M$ | $-5x^2+30x=5x(6-x)$ |

Jadi $M(3)=5\cdot3\cdot3=45\text{ kN·m}$ di tengah dan $M(0)=M(6)=0$ di tumpuan, seperti yang harus diberikan tumpuan yang membiarkan balok berputar bebas.`,
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Differentiate $EI\\,y\' = -\\frac{5}{3}x^3+15x^2-90$ once more to get the bending moment.',
                'Turunkan $EI\\,y\' = -\\frac{5}{3}x^3+15x^2-90$ sekali lagi untuk memperoleh momen lentur.',
              ),
              template: "EI\\,y'' = ___x^2 + ___x",
              blanks: ['-5', '30'],
              explain: L(
                'The power rule term by term: $-\\frac{5}{3}\\cdot3x^2=-5x^2$, $15\\cdot2x=30x$, and the constant $-90$ disappears.',
                'Aturan pangkat suku demi suku: $-\\frac{5}{3}\\cdot3x^2=-5x^2$, $15\\cdot2x=30x$, dan konstanta $-90$ hilang.',
              ),
              hint: L(
                'Bring each exponent down as a factor and lower it by one. What happens to a constant?',
                'Turunkan tiap pangkat menjadi faktor dan kurangi pangkatnya satu. Apa yang terjadi pada konstanta?',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'Two beams carry the same bending moment, but the second has twice the stiffness $EI$. How does its curvature $y\'\'$ compare?',
                'Dua balok memikul momen lentur yang sama, tetapi yang kedua memiliki kekakuan $EI$ dua kali lipat. Bagaimana kelengkungannya $y\'\'$?',
              ),
              options: [
                L('Half as large', 'Setengahnya'),
                L('Twice as large', 'Dua kali lipat'),
                L('The same', 'Sama'),
                L('Four times as large', 'Empat kali lipat'),
              ],
              answer: 0,
              explain: L(
                'From $EI\\,y\'\'=M$, the curvature is $y\'\'=\\frac{M}{EI}$: the same moment divided by twice the stiffness is half the curvature. A stiffer beam bends less.',
                'Dari $EI\\,y\'\'=M$, kelengkungannya $y\'\'=\\frac{M}{EI}$: momen yang sama dibagi kekakuan dua kali lipat adalah setengah kelengkungan. Balok yang lebih kaku melentur lebih sedikit.',
              ),
              hint: L(
                'Solve $EI\\,y\'\'=M$ for $y\'\'$ and see where $EI$ ends up.',
                'Selesaikan $EI\\,y\'\'=M$ untuk $y\'\'$ dan lihat di mana $EI$ berada.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'For the beam of this lesson, $y(x)=-\\dfrac{x\\,(216-12x^2+x^3)}{48\\,000}$ m. How many millimeters does it sag at the middle, $x=3$? Give the size of the sag as a positive number.',
                'Untuk balok pada pelajaran ini, $y(x)=-\\dfrac{x\\,(216-12x^2+x^3)}{48.000}$ m. Berapa milimeter lendutannya di tengah, $x=3$? Berikan besar lendutan sebagai bilangan positif.',
              ),
              blanks: [{ label: '|y(3)| =', answer: 8.4375, tol: 0.03, after: '\\text{mm}' }],
              hints: [
                L('Put $x=3$ into the bracket first: $216-12\\cdot9+27$.', 'Masukkan $x=3$ ke dalam kurung dulu: $216-12\\cdot9+27$.'),
                L('The result is in meters. One meter is $1000$ mm.', 'Hasilnya dalam meter. Satu meter adalah $1000$ mm.'),
              ],
              explain: L(
                '$y(3)=-\\dfrac{3\\cdot135}{48\\,000}=-0.0084375$ m, a sag of about $8.44$ mm. In formula form this is $\\dfrac{5wL^4}{384EI}$, the best-known deflection in the handbook.',
                '$y(3)=-\\dfrac{3\\cdot135}{48.000}=-0{,}0084375$ m, lendutan sekitar $8{,}44$ mm. Dalam bentuk rumus ini adalah $\\dfrac{5wL^4}{384EI}$, lendutan paling terkenal di buku pegangan.',
              ),
              solution: S('y(3)=-\\dfrac{3\\,(216-108+27)}{48000}=-\\dfrac{405}{48000}=-0.0084375\\ \\text{m}', '|y(3)|\\approx 8.44\\ \\text{mm}'),
            },
            {
              kind: 'math',
              id: 'm2',
              prompt: L(
                'With $EI=20\\,000\\text{ kN·m}^2$ and $EI\\,y\'=-\\frac{5}{3}x^3+15x^2-90$, find the slope $y\'(0)$ at the left support, in radians.',
                'Dengan $EI=20.000\\text{ kN·m}^2$ dan $EI\\,y\'=-\\frac{5}{3}x^3+15x^2-90$, cari kemiringan $y\'(0)$ di tumpuan kiri, dalam radian.',
              ),
              blanks: [{ label: "y'(0) =", answer: -0.0045, tol: 0.00005, after: '\\text{rad}' }],
              hints: [
                L('At $x=0$ only the constant term is left.', 'Di $x=0$ hanya suku konstanta yang tersisa.'),
                L('Divide by $EI$ to get $y\'$ itself.', 'Bagi dengan $EI$ untuk memperoleh $y\'$ itu sendiri.'),
              ],
              explain: L(
                '$EI\\,y\'(0)=-90$, so $y\'(0)=-\\dfrac{90}{20\\,000}=-0.0045$ rad, about a quarter of a degree downward to the right. The beam is steepest at its supports.',
                '$EI\\,y\'(0)=-90$, jadi $y\'(0)=-\\dfrac{90}{20.000}=-0{,}0045$ rad, sekitar seperempat derajat menurun ke kanan. Balok paling curam di tumpuannya.',
              ),
              solution: S("EI\\,y'(0)=-90", "y'(0)=-\\dfrac{90}{20000}=-0.0045"),
            },
          ],
        },
        {
          id: 'sip-m1-s1-l2',
          title: L('Shear, Load, and Where the Moment Peaks', 'Gaya Geser, Beban, dan Letak Momen Terbesar'),
          goal: L(
            'Differentiate the bending moment to get the shear and the load, and find the largest moment where the shear is zero.',
            'Menurunkan momen lentur untuk memperoleh gaya geser dan beban, dan menemukan momen terbesar di tempat gaya geser nol.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Two more derivatives: shear and load', 'Dua turunan lagi: gaya geser dan beban'),
              body: L(
                T`
The chain does not stop at the moment. Differentiate it and you get the **shear force** $V$, the force that tries to slide one part of the beam past the next; differentiate once more and you are back at the load itself:
$$V(x)=\frac{dM}{dx},\qquad q(x)=-\frac{dV}{dx}.$$

For the beam of the last lesson, $M=30x-5x^2$:

| Quantity | Formula | Meaning |
|---|---|---|
| $M$ | $30x-5x^2$ | bending moment, kN·m |
| $V=M'$ | $30-10x$ | shear force, kN |
| $q=-V'$ | $10$ | the load, kN/m |

The last line is the load we started with, $10$ kN on every meter, which is a check on the whole chain. Read from the top instead, the picture is complete: **deflection, slope, moment, shear, load** are $y$, $y'$, $EI\,y''$, $EI\,y'''$ and $-EI\,y''''$. Four derivatives of one function.

Because $V=M'$, the sign of the shear tells whether the moment is rising or falling, and the moment has its largest value where $V=0$. Here $30-10x=0$ gives $x=3$, the middle, as symmetry promised.`,
                T`
Rantainya tidak berhenti pada momen. Turunkan momen dan kamu memperoleh **gaya geser** $V$, gaya yang berusaha menggeser satu bagian balok terhadap bagian berikutnya; turunkan sekali lagi dan kamu kembali pada beban itu sendiri:
$$V(x)=\frac{dM}{dx},\qquad q(x)=-\frac{dV}{dx}.$$

Untuk balok pada pelajaran lalu, $M=30x-5x^2$:

| Besaran | Rumus | Arti |
|---|---|---|
| $M$ | $30x-5x^2$ | momen lentur, kN·m |
| $V=M'$ | $30-10x$ | gaya geser, kN |
| $q=-V'$ | $10$ | beban, kN/m |

Baris terakhir adalah beban semula, $10$ kN pada setiap meter, yang menjadi pemeriksaan seluruh rantai. Dibaca dari atas, gambarnya lengkap: **lendutan, kemiringan, momen, gaya geser, beban** adalah $y$, $y'$, $EI\,y''$, $EI\,y'''$, dan $-EI\,y''''$. Empat turunan dari satu fungsi.

Karena $V=M'$, tanda gaya geser memberi tahu apakah momen sedang naik atau turun, dan momen mencapai nilai terbesarnya di tempat $V=0$. Di sini $30-10x=0$ memberi $x=3$, tengah bentang, seperti yang dijanjikan simetri.`,
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'On a stretch of a beam the shear force $V$ is positive. What is the bending moment $M$ doing there as $x$ increases?',
                'Pada suatu ruas balok gaya geser $V$ positif. Apa yang terjadi pada momen lentur $M$ di sana saat $x$ bertambah?',
              ),
              options: [
                L('It is increasing', 'Ia naik'),
                L('It is decreasing', 'Ia turun'),
                L('It is constant', 'Ia tetap'),
                L('It is zero', 'Ia nol'),
              ],
              answer: 0,
              explain: L(
                '$V$ is the derivative of $M$, and a function with a positive derivative is increasing. The moment keeps growing until the shear reaches zero.',
                '$V$ adalah turunan $M$, dan fungsi dengan turunan positif adalah fungsi naik. Momen terus bertambah sampai gaya geser mencapai nol.',
              ),
              hint: L(
                'Which of the two is the derivative of the other? What does a positive derivative say about a function?',
                'Mana dari keduanya yang merupakan turunan yang lain? Apa kata turunan positif tentang sebuah fungsi?',
              ),
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('A load that is not symmetric', 'Beban yang tidak simetris'),
              body: L(
                T`
Symmetry found the middle for us. Take it away. The same $6$ m beam now carries a load that grows from $0$ at the left support to $12$ kN/m at the right one, as soil or water pressing on a wall does. Its bending moment is
$$M(x)=12x-\frac{x^3}{3}\ \text{kN·m}$$
$$0\le x\le6.$$

Differentiate:
$$V(x)=M'(x)=12-x^2$$
$$q(x)=-V'(x)=2x$$
The load $2x$ is indeed $0$ at $x=0$ and $12$ at $x=6$. The moment is largest where the shear is zero:
$$12-x^2=0$$
$$\Rightarrow\ x=\sqrt{12}\approx3.46\text{ m}$$
$$M(\sqrt{12})=12\sqrt{12}-\frac{12\sqrt{12}}{3}$$
$$=8\sqrt{12}\approx27.71\text{ kN·m}.$$

The peak is **not** at the middle: it has moved towards the heavier side. At the ends $M(0)=M(6)=0$, so the closed interval method confirms that $27.71$ is the largest value on $[0,6]$. This is the number the beam has to be designed for.`,
                T`
Simetri menemukan tengah bentang untuk kita. Hilangkan simetri itu. Balok $6$ m yang sama kini memikul beban yang membesar dari $0$ di tumpuan kiri sampai $12$ kN/m di tumpuan kanan, seperti tanah atau air yang menekan dinding. Momen lenturnya adalah
$$M(x)=12x-\frac{x^3}{3}\ \text{kN·m}$$
$$0\le x\le6.$$

Turunkan:
$$V(x)=M'(x)=12-x^2$$
$$q(x)=-V'(x)=2x$$
Beban $2x$ memang $0$ di $x=0$ dan $12$ di $x=6$. Momen terbesar di tempat gaya geser nol:
$$12-x^2=0$$
$$\Rightarrow\ x=\sqrt{12}\approx3{,}46\text{ m}$$
$$M(\sqrt{12})=12\sqrt{12}-\frac{12\sqrt{12}}{3}$$
$$=8\sqrt{12}\approx27{,}71\text{ kN·m}.$$

Puncaknya **bukan** di tengah: ia bergeser ke sisi yang lebih berat. Di ujung-ujung $M(0)=M(6)=0$, sehingga metode selang tertutup memastikan bahwa $27{,}71$ adalah nilai terbesar pada $[0,6]$. Inilah bilangan yang menjadi dasar perancangan balok.`,
              ),
              scene3d: loadScene,
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Differentiate $M(x)=12x-\\frac{x^3}{3}$ to get the shear force $V$, then once more for the load $q=-V\'$.',
                'Turunkan $M(x)=12x-\\frac{x^3}{3}$ untuk memperoleh gaya geser $V$, lalu sekali lagi untuk beban $q=-V\'$.',
              ),
              template: 'V(x) = ___ - x^2,\\quad q(x) = ___\\,x',
              blanks: ['12', '2'],
              explain: L(
                'The derivative of $12x$ is $12$ and the derivative of $\\frac{x^3}{3}$ is $x^2$, so $V=12-x^2$. Then $q=-V\'=2x$: the load grows by $2$ kN/m with every meter, as in the picture.',
                'Turunan $12x$ adalah $12$ dan turunan $\\frac{x^3}{3}$ adalah $x^2$, jadi $V=12-x^2$. Lalu $q=-V\'=2x$: beban bertambah $2$ kN/m tiap meter, seperti pada gambar.',
              ),
              hint: L(
                'Differentiate term by term. For the load, differentiate $V$ and mind the minus sign in $q=-V\'$.',
                'Turunkan suku demi suku. Untuk beban, turunkan $V$ dan perhatikan tanda minus pada $q=-V\'$.',
              ),
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: L(
                'Order the working that finds the largest bending moment of $M(x)=12x-\\frac{x^3}{3}$ on $[0,6]$.',
                'Susun langkah yang menemukan momen lentur terbesar dari $M(x)=12x-\\frac{x^3}{3}$ pada $[0,6]$.',
              ),
              lines: S("V(x)=M'(x)=12-x^2", '12-x^2=0', 'x=\\sqrt{12}\\approx 3.46', 'M(\\sqrt{12})=8\\sqrt{12}\\approx 27.71', 'M(0)=M(6)=0 \\Rightarrow M_{\\max}\\approx 27.71'),
              explain: L(
                'Differentiate, set the derivative to zero, solve, evaluate, and compare with the ends of the interval: the closed interval method, with the shear playing the part of the derivative.',
                'Turunkan, samakan turunan dengan nol, selesaikan, hitung nilainya, dan bandingkan dengan ujung-ujung selang: metode selang tertutup, dengan gaya geser berperan sebagai turunan.',
              ),
              hint: L(
                'The comparison with the endpoints comes last, after the critical point has a value.',
                'Perbandingan dengan titik ujung datang terakhir, setelah titik kritis memiliki nilai.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'A beam of span $10$ m under a uniform load has $M(x)=20x-2x^2$ kN·m. Find where the shear is zero, and the largest bending moment.',
                'Balok berbentang $10$ m dengan beban merata memiliki $M(x)=20x-2x^2$ kN·m. Cari tempat gaya geser nol, dan momen lentur terbesar.',
              ),
              blanks: [
                { label: 'x =', answer: 5, after: '\\text{m}' },
                { label: 'M_{\\max} =', answer: 50, after: '\\text{kN·m}' },
              ],
              hints: [
                L('$V(x)=M\'(x)=20-4x$.', '$V(x)=M\'(x)=20-4x$.'),
                L('Put the $x$ you found back into $M$.', 'Masukkan $x$ yang kamu temukan kembali ke $M$.'),
              ],
              explain: L(
                '$V=20-4x=0$ at $x=5$, and $M(5)=100-50=50$ kN·m: the formula $\\frac{wL^2}{8}$ with $w=4$ and $L=10$.',
                '$V=20-4x=0$ di $x=5$, dan $M(5)=100-50=50$ kN·m: rumus $\\frac{wL^2}{8}$ dengan $w=4$ dan $L=10$.',
              ),
              solution: S("V=M'=20-4x=0\\Rightarrow x=5", 'M(5)=20\\cdot5-2\\cdot25=50'),
            },
            {
              kind: 'math',
              id: 'm2',
              prompt: L(
                'A beam of span $9$ m under a load growing from $0$ to $6$ kN/m has $M(x)=9x-\\dfrac{x^3}{9}$ kN·m. Find where the moment is largest, and its value.',
                'Balok berbentang $9$ m dengan beban yang membesar dari $0$ sampai $6$ kN/m memiliki $M(x)=9x-\\dfrac{x^3}{9}$ kN·m. Cari tempat momen terbesar, dan nilainya.',
              ),
              blanks: [
                { label: 'x =', answer: 5.196152, tol: 0.02, after: '\\text{m}' },
                { label: 'M_{\\max} =', answer: 31.176915, tol: 0.1, after: '\\text{kN·m}' },
              ],
              hints: [
                L('$V(x)=9-\\dfrac{x^2}{3}$. Set it to zero.', '$V(x)=9-\\dfrac{x^2}{3}$. Samakan dengan nol.'),
                L('$x^2=27$, so $x=\\sqrt{27}$. You may type sqrt(27).', '$x^2=27$, jadi $x=\\sqrt{27}$. Kamu boleh mengetik sqrt(27).'),
              ],
              explain: L(
                '$V=9-\\frac{x^2}{3}=0$ gives $x=\\sqrt{27}\\approx5.20$ m, and $M(\\sqrt{27})=9\\sqrt{27}-3\\sqrt{27}=6\\sqrt{27}\\approx31.18$ kN·m, again past the middle, towards the heavier end.',
                '$V=9-\\frac{x^2}{3}=0$ memberi $x=\\sqrt{27}\\approx5{,}20$ m, dan $M(\\sqrt{27})=9\\sqrt{27}-3\\sqrt{27}=6\\sqrt{27}\\approx31{,}18$ kN·m, lagi-lagi melewati tengah, ke arah ujung yang lebih berat.',
              ),
              solution: S("V=M'=9-\\dfrac{x^2}{3}=0\\Rightarrow x=\\sqrt{27}\\approx5.196", 'M(\\sqrt{27})=9\\sqrt{27}-\\dfrac{27\\sqrt{27}}{9}=6\\sqrt{27}\\approx31.18'),
            },
          ],
        },
      ],
      project: {
        id: 'sip-m1-s1-p',
        runtime: 'math',
        title: L('A Cantilever and a Loaded Span', 'Kantilever dan Bentang yang Dibebani'),
        brief: L(
          'A balcony beam fixed in a wall at one end, and two spans on supports. Use the chain deflection, slope, moment, shear.',
          'Balok balkon yang terjepit pada dinding di satu ujung, dan dua bentang di atas tumpuan. Pakai rantai lendutan, kemiringan, momen, gaya geser.',
        ),
        requirements: [
          L('Differentiate the moment to get the shear before looking for the largest moment.', 'Turunkan momen untuk memperoleh gaya geser sebelum mencari momen terbesar.'),
          L('Keep the units: meters and kN inside the formulas, millimeters only at the end.', 'Jaga satuannya: meter dan kN di dalam rumus, milimeter hanya di akhir.'),
        ],
        tasks: [
          {
            prompt: L(
              'A cantilever of length $L=3$ m, fixed at $x=0$, carries $w=8$ kN/m with $EI=20\\,000\\text{ kN·m}^2$. Its deflection is $y(x)=-\\dfrac{w\\,x^2\\,(6L^2-4Lx+x^2)}{24\\,EI}$. How many millimeters does the free end $x=3$ sag?',
              'Kantilever sepanjang $L=3$ m, terjepit di $x=0$, memikul $w=8$ kN/m dengan $EI=20.000\\text{ kN·m}^2$. Lendutannya $y(x)=-\\dfrac{w\\,x^2\\,(6L^2-4Lx+x^2)}{24\\,EI}$. Berapa milimeter lendutan ujung bebas $x=3$?',
            ),
            blanks: [{ label: '|y(3)| =', answer: 4.05, tol: 0.02, after: '\\text{mm}' }],
            solution: S('y(3)=-\\dfrac{8\\cdot9\\,(54-36+9)}{480000}=-\\dfrac{1944}{480000}=-0.00405\\ \\text{m}', '|y(3)|=4.05\\ \\text{mm}'),
          },
          {
            prompt: L(
              'The same cantilever has $M(x)=-4(3-x)^2$ kN·m. Find the shear force $V(0)$ at the wall.',
              'Kantilever yang sama memiliki $M(x)=-4(3-x)^2$ kN·m. Cari gaya geser $V(0)$ di dinding.',
            ),
            blanks: [{ label: 'V(0) =', answer: 24, after: '\\text{kN}' }],
            solution: S("V(x)=M'(x)=-4\\cdot2(3-x)(-1)=8(3-x)", 'V(0)=24'),
          },
          {
            prompt: L(
              'A span of $8$ m on two supports carries $12$ kN/m, so $M(x)=48x-6x^2$ kN·m. What is the largest bending moment?',
              'Bentang $8$ m di atas dua tumpuan memikul $12$ kN/m, sehingga $M(x)=48x-6x^2$ kN·m. Berapa momen lentur terbesarnya?',
            ),
            blanks: [{ label: 'M_{\\max} =', answer: 96, after: '\\text{kN·m}' }],
            solution: S("V=M'=48-12x=0\\Rightarrow x=4", 'M(4)=192-96=96'),
          },
          {
            prompt: L(
              'A beam has $M(x)=18x-\\dfrac{x^3}{2}$ kN·m for $0\\le x\\le6$. Find where the shear is zero, and the largest moment.',
              'Sebuah balok memiliki $M(x)=18x-\\dfrac{x^3}{2}$ kN·m untuk $0\\le x\\le6$. Cari tempat gaya geser nol, dan momen terbesar.',
            ),
            blanks: [
              { label: 'x =', answer: 3.464102, tol: 0.02, after: '\\text{m}' },
              { label: 'M_{\\max} =', answer: 41.569219, tol: 0.1, after: '\\text{kN·m}' },
            ],
            solution: S("V=M'=18-\\dfrac{3x^2}{2}=0\\Rightarrow x=\\sqrt{12}\\approx3.464", 'M(\\sqrt{12})=18\\sqrt{12}-6\\sqrt{12}=12\\sqrt{12}\\approx41.57'),
          },
        ],
        hints: [
          L('Part 2: the chain rule on $(3-x)^2$ brings out a factor $-1$.', 'Butir 2: aturan rantai pada $(3-x)^2$ memunculkan faktor $-1$.'),
          L('Part 4: $x^2=12$; put $x=\\sqrt{12}$ into $M$ and factor out $\\sqrt{12}$.', 'Butir 4: $x^2=12$; masukkan $x=\\sqrt{12}$ ke $M$ dan keluarkan faktor $\\sqrt{12}$.'),
        ],
        xp: 50,
      },
    },

    /* --------------------------------------------------------------------- 1.2 the best section */
    {
      id: 'sip-m1-s2',
      title: L('Choosing the Best Section', 'Memilih Penampang Terbaik'),
      summary: L(
        'Optimization with a constraint: the strongest and the stiffest rectangle that fits in a round log, and the open tank that needs the least concrete.',
        'Optimisasi dengan kendala: persegi panjang terkuat dan terkaku yang muat dalam gelondong bulat, dan tangki terbuka yang memerlukan beton paling sedikit.',
      ),
      lessons: [
        {
          id: 'sip-m1-s2-l1',
          title: L('The Strongest Beam Cut from a Log', 'Balok Terkuat dari Sebatang Gelondong'),
          goal: L(
            'Write the strength of a rectangular beam as a function of its width alone, and find the width that makes it largest.',
            'Menuliskan kekuatan balok persegi panjang sebagai fungsi lebarnya saja, dan mencari lebar yang membuatnya terbesar.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Why depth matters more than width', 'Mengapa tinggi lebih penting daripada lebar'),
              body: L(
                T`
A beam fails when the stress in its outer fibers gets too large. For a rectangular section of width $b$ and depth $h$, the largest bending stress under a moment $M$ is
$$\sigma=\frac{M}{S},\qquad S=\frac{b\,h^2}{6}.$$
$S$ is the **section modulus**: the larger it is, the more moment the beam can take. Width counts once and depth counts squared, so the same piece of timber is far stronger standing on its narrow edge than lying flat.

Take a plank $10$ cm by $20$ cm:

| How it is laid | $b$ | $h$ | $S=\frac{bh^2}{6}$ |
|---|---|---|---|
| On edge | $10$ | $20$ | $\frac{10\cdot400}{6}\approx667\text{ cm}^3$ |
| Flat | $20$ | $10$ | $\frac{20\cdot100}{6}\approx333\text{ cm}^3$ |

The same wood, twice the strength. That is why floor joists stand on edge.`,
                T`
Balok runtuh ketika tegangan pada serat terluarnya terlalu besar. Untuk penampang persegi panjang dengan lebar $b$ dan tinggi $h$, tegangan lentur terbesar akibat momen $M$ adalah
$$\sigma=\frac{M}{S},\qquad S=\frac{b\,h^2}{6}.$$
$S$ adalah **modulus penampang**: makin besar nilainya, makin besar momen yang dapat dipikul balok. Lebar dihitung sekali dan tinggi dihitung kuadrat, sehingga sepotong kayu yang sama jauh lebih kuat berdiri pada sisi sempitnya daripada terbaring datar.

Ambil papan $10$ cm kali $20$ cm:

| Cara meletakkan | $b$ | $h$ | $S=\frac{bh^2}{6}$ |
|---|---|---|---|
| Berdiri | $10$ | $20$ | $\frac{10\cdot400}{6}\approx667\text{ cm}^3$ |
| Rebah | $20$ | $10$ | $\frac{20\cdot100}{6}\approx333\text{ cm}^3$ |

Kayu yang sama, kekuatan dua kali lipat. Itulah sebabnya balok lantai dipasang berdiri.`,
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'A beam $12$ cm wide and $18$ cm deep is replaced by one $12$ cm wide and $36$ cm deep. How many times as large is its section modulus $S=\\frac{bh^2}{6}$?',
                'Balok selebar $12$ cm dan setinggi $18$ cm diganti dengan balok selebar $12$ cm dan setinggi $36$ cm. Berapa kali lipat modulus penampangnya $S=\\frac{bh^2}{6}$?',
              ),
              options: [L('4 times', '4 kali'), L('2 times', '2 kali'), L('8 times', '8 kali'), L('The same', 'Sama')],
              answer: 0,
              explain: L(
                'The depth is doubled and it enters squared: $2^2=4$. From $648$ to $2592\\text{ cm}^3$.',
                'Tingginya digandakan dan ia masuk sebagai kuadrat: $2^2=4$. Dari $648$ menjadi $2592\\text{ cm}^3$.',
              ),
              hint: L('Which of $b$ and $h$ changed, and with what power does it appear in $S$?', 'Mana dari $b$ dan $h$ yang berubah, dan dengan pangkat berapa ia muncul dalam $S$?'),
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('One log, one constraint, one variable', 'Satu gelondong, satu kendala, satu peubah'),
              body: L(
                T`
A sawmill has a round log $30$ cm across and wants the **strongest** rectangular beam it can cut from it. Wider means shallower: the corners of the rectangle lie on the circle, so by the Pythagorean theorem
$$b^2+h^2=30^2=900.$$
That is the constraint. Use it to remove $h$, and the strength becomes a function of the width alone:
$$S(b)=\frac{b\,h^2}{6}=\frac{b\,(900-b^2)}{6}=150b-\frac{b^3}{6}$$
$$0\le b\le30.$$

Now the closed interval method:
$$S'(b)=150-\frac{b^2}{2}=0$$
$$\Rightarrow\ b^2=300$$
$$b=10\sqrt3\approx17.32\text{ cm}.$$
Then $h=\sqrt{900-300}=\sqrt{600}\approx24.49$ cm. At the ends of the interval, $S(0)=S(30)=0$: a beam with no width or no depth carries nothing. So the critical point is the maximum, $S\approx1732\text{ cm}^3$.

The depth is $\sqrt2$ times the width, $h=b\sqrt2$, whatever the size of the log. Carpenters have marked this out on the end of a log for centuries.`,
                T`
Sebuah penggergajian memiliki gelondong bulat berdiameter $30$ cm dan menginginkan balok persegi panjang **terkuat** yang dapat dipotong darinya. Makin lebar berarti makin pendek: sudut-sudut persegi panjang terletak pada lingkaran, sehingga menurut teorema Pythagoras
$$b^2+h^2=30^2=900.$$
Itulah kendalanya. Pakai ia untuk menghilangkan $h$, dan kekuatan menjadi fungsi lebar saja:
$$S(b)=\frac{b\,h^2}{6}=\frac{b\,(900-b^2)}{6}=150b-\frac{b^3}{6}$$
$$0\le b\le30.$$

Sekarang metode selang tertutup:
$$S'(b)=150-\frac{b^2}{2}=0$$
$$\Rightarrow\ b^2=300$$
$$b=10\sqrt3\approx17{,}32\text{ cm}.$$
Lalu $h=\sqrt{900-300}=\sqrt{600}\approx24{,}49$ cm. Di ujung-ujung selang, $S(0)=S(30)=0$: balok tanpa lebar atau tanpa tinggi tidak memikul apa pun. Jadi titik kritis itu adalah maksimum, $S\approx1732\text{ cm}^3$.

Tingginya $\sqrt2$ kali lebarnya, $h=b\sqrt2$, berapa pun ukuran gelondongnya. Tukang kayu telah menandai ini pada ujung gelondong selama berabad-abad.`,
              ),
              scene3d: logStrengthScene,
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Complete the derivative of $S(b)=150b-\\frac{b^3}{6}$ and the equation for the best width.',
                'Lengkapi turunan $S(b)=150b-\\frac{b^3}{6}$ dan persamaan untuk lebar terbaik.',
              ),
              template: "S'(b) = ___ - \\dfrac{b^2}{___} = 0 \\Rightarrow b^2 = ___",
              blanks: ['150', '2', '300'],
              explain: L(
                'The derivative of $\\frac{b^3}{6}$ is $\\frac{3b^2}{6}=\\frac{b^2}{2}$, and $150=\\frac{b^2}{2}$ gives $b^2=300$.',
                'Turunan $\\frac{b^3}{6}$ adalah $\\frac{3b^2}{6}=\\frac{b^2}{2}$, dan $150=\\frac{b^2}{2}$ memberi $b^2=300$.',
              ),
              hint: L('Simplify $\\frac{3}{6}$ after the power rule, then solve for $b^2$.', 'Sederhanakan $\\frac{3}{6}$ setelah aturan pangkat, lalu selesaikan untuk $b^2$.'),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The graph shows $S(b)$ for the $30$ cm log. Why is the critical point at $b\\approx17.3$ certain to be the largest value on $[0,30]$?',
                'Grafik menunjukkan $S(b)$ untuk gelondong $30$ cm. Mengapa titik kritis di $b\\approx17{,}3$ pasti merupakan nilai terbesar pada $[0,30]$?',
              ),
              figure: {
                dim: 2,
                xSpan: [-1, 31],
                ySpan: [-100, 1900],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x*(900-x^2)/6', from: 0, to: 30, color: 'a' },
                  { t: 'dot', x: 17.3205, y: 1732.05, color: 'result' },
                ],
              },
              options: [
                L('It is the only critical point inside the interval, and $S$ is $0$ at both ends', 'Ia satu-satunya titik kritis di dalam selang, dan $S$ bernilai $0$ di kedua ujung'),
                L('Every critical point is a maximum', 'Setiap titik kritis adalah maksimum'),
                L('Because $17.3$ is more than half of $30$', 'Karena $17{,}3$ lebih dari setengah $30$'),
                L('It is not certain without trying every width', 'Tidak pasti tanpa mencoba setiap lebar'),
              ],
              answer: 0,
              explain: L(
                'On a closed interval the largest value is at a critical point or at an end. The ends give $S=0$ and the one critical point gives $1732$, so the comparison is over.',
                'Pada selang tertutup nilai terbesar berada di titik kritis atau di ujung. Kedua ujung memberi $S=0$ dan satu-satunya titik kritis memberi $1732$, jadi perbandingannya selesai.',
              ),
              hint: L('List the candidates of the closed interval method and compare their values.', 'Daftarkan kandidat metode selang tertutup dan bandingkan nilainya.'),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'A log is $45$ cm across. Find the width and the depth of the strongest rectangular beam that can be cut from it.',
                'Sebuah gelondong berdiameter $45$ cm. Cari lebar dan tinggi balok persegi panjang terkuat yang dapat dipotong darinya.',
              ),
              blanks: [
                { label: 'b =', answer: 25.980762, tol: 0.05, after: '\\text{cm}' },
                { label: 'h =', answer: 36.742346, tol: 0.05, after: '\\text{cm}' },
              ],
              hints: [
                L('$S(b)=\\dfrac{b\\,(45^2-b^2)}{6}$, so $S\'(b)=\\dfrac{45^2-3b^2}{6}$.', '$S(b)=\\dfrac{b\\,(45^2-b^2)}{6}$, jadi $S\'(b)=\\dfrac{45^2-3b^2}{6}$.'),
                L('$b=\\dfrac{45}{\\sqrt3}$, and $h=b\\sqrt2$.', '$b=\\dfrac{45}{\\sqrt3}$, dan $h=b\\sqrt2$.'),
              ],
              explain: L(
                '$b=\\frac{45}{\\sqrt3}\\approx25.98$ cm and $h=\\sqrt{45^2-b^2}=45\\sqrt{\\frac23}\\approx36.74$ cm: the same proportions $h=b\\sqrt2$ as before.',
                '$b=\\frac{45}{\\sqrt3}\\approx25{,}98$ cm dan $h=\\sqrt{45^2-b^2}=45\\sqrt{\\frac23}\\approx36{,}74$ cm: perbandingan $h=b\\sqrt2$ yang sama seperti sebelumnya.',
              ),
              solution: S("S'(b)=\\dfrac{2025-3b^2}{6}=0\\Rightarrow b=\\sqrt{675}\\approx25.98", 'h=\\sqrt{2025-675}=\\sqrt{1350}\\approx36.74'),
            },
            {
              kind: 'math',
              id: 'm2',
              prompt: L(
                'For the $30$ cm log, what is the largest section modulus $S=\\dfrac{b\\,(900-b^2)}{6}$, in $\\text{cm}^3$?',
                'Untuk gelondong $30$ cm, berapa modulus penampang terbesar $S=\\dfrac{b\\,(900-b^2)}{6}$, dalam $\\text{cm}^3$?',
              ),
              blanks: [{ label: 'S_{\\max} =', answer: 1732.0508, tol: 2, after: '\\text{cm}^3' }],
              hints: [L('Use $b=10\\sqrt3$, for which $900-b^2=600$.', 'Pakai $b=10\\sqrt3$, sehingga $900-b^2=600$.')],
              explain: L(
                '$S=\\dfrac{10\\sqrt3\\cdot600}{6}=1000\\sqrt3\\approx1732\\text{ cm}^3$.',
                '$S=\\dfrac{10\\sqrt3\\cdot600}{6}=1000\\sqrt3\\approx1732\\text{ cm}^3$.',
              ),
              solution: S('S(10\\sqrt3)=\\dfrac{10\\sqrt3\\,(900-300)}{6}=1000\\sqrt3\\approx1732'),
            },
          ],
        },
        {
          id: 'sip-m1-s2-l2',
          title: L('The Stiffest Beam and the Cheapest Tank', 'Balok Terkaku dan Tangki Termurah'),
          goal: L(
            'Maximize the stiffness of a beam with the product and chain rules, and minimize the concrete of an open tank of given volume.',
            'Memaksimalkan kekakuan balok dengan aturan hasil kali dan aturan rantai, dan meminimalkan beton tangki terbuka bervolume tertentu.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Strong is not the same as stiff', 'Kuat tidak sama dengan kaku'),
              body: L(
                T`
A floor can be strong enough not to break and still bounce underfoot. How little a beam **deflects** is its stiffness, and it depends on the **second moment of area**
$$I=\frac{b\,h^3}{12}.$$
Depth now counts cubed. For the same $30$ cm log, with $h^2=900-b^2$:
$$I(b)=\frac{b\,(900-b^2)^{3/2}}{12}.$$

The product rule and the chain rule give
$$I'(b)=\frac{(900-b^2)^{3/2}-3b^2\,(900-b^2)^{1/2}}{12}$$
$$=\frac{(900-b^2)^{1/2}\,(900-4b^2)}{12}.$$
It is zero inside the interval when $900-4b^2=0$:
$$b=15\text{ cm}$$
$$h=\sqrt{675}=15\sqrt3\approx25.98\text{ cm}$$
$$I\approx21\,921\text{ cm}^4.$$

The stiffest beam is **narrower and deeper** than the strongest one ($h=b\sqrt3$ instead of $h=b\sqrt2$). The strongest beam, $b\approx17.32$, has $I\approx21\,213\text{ cm}^4$: about $3\%$ less stiff. Which one to cut depends on whether the design is ruled by breaking or by sagging.`,
                T`
Lantai bisa cukup kuat untuk tidak patah namun tetap memantul saat diinjak. Seberapa kecil sebuah balok **melendut** adalah kekakuannya, dan ia bergantung pada **momen inersia penampang**
$$I=\frac{b\,h^3}{12}.$$
Tinggi kini dihitung pangkat tiga. Untuk gelondong $30$ cm yang sama, dengan $h^2=900-b^2$:
$$I(b)=\frac{b\,(900-b^2)^{3/2}}{12}.$$

Aturan hasil kali dan aturan rantai memberi
$$I'(b)=\frac{(900-b^2)^{3/2}-3b^2\,(900-b^2)^{1/2}}{12}$$
$$=\frac{(900-b^2)^{1/2}\,(900-4b^2)}{12}.$$
Ia nol di dalam selang ketika $900-4b^2=0$:
$$b=15\text{ cm}$$
$$h=\sqrt{675}=15\sqrt3\approx25{,}98\text{ cm}$$
$$I\approx21.921\text{ cm}^4.$$

Balok terkaku **lebih sempit dan lebih tinggi** daripada balok terkuat ($h=b\sqrt3$, bukan $h=b\sqrt2$). Balok terkuat, $b\approx17{,}32$, memiliki $I\approx21.213\text{ cm}^4$: sekitar $3\%$ kurang kaku. Mana yang dipotong bergantung pada apakah rancangan ditentukan oleh patah atau oleh lendutan.`,
              ),
              scene3d: logStiffnessScene,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'From the same log, which beam is deeper: the strongest or the stiffest?',
                'Dari gelondong yang sama, balok mana yang lebih tinggi: yang terkuat atau yang terkaku?',
              ),
              options: [
                L('The stiffest, because depth counts cubed in $I$ and only squared in $S$', 'Yang terkaku, sebab tinggi dihitung pangkat tiga dalam $I$ dan hanya kuadrat dalam $S$'),
                L('The strongest, because strength needs more material', 'Yang terkuat, sebab kekuatan memerlukan lebih banyak bahan'),
                L('They are the same beam', 'Keduanya balok yang sama'),
                L('It depends on the diameter of the log', 'Bergantung pada diameter gelondong'),
              ],
              answer: 0,
              explain: L(
                'The stiffest has $h=b\\sqrt3$ and the strongest $h=b\\sqrt2$. The higher the power of $h$ in the quantity, the more width is worth giving up for depth, and the answer does not depend on the size of the log.',
                'Yang terkaku memiliki $h=b\\sqrt3$ dan yang terkuat $h=b\\sqrt2$. Makin tinggi pangkat $h$ dalam besarannya, makin layak lebar dikorbankan demi tinggi, dan jawabannya tidak bergantung pada ukuran gelondong.',
              ),
              hint: L('Compare the power of $h$ in $S=\\frac{bh^2}{6}$ and in $I=\\frac{bh^3}{12}$.', 'Bandingkan pangkat $h$ dalam $S=\\frac{bh^2}{6}$ dan dalam $I=\\frac{bh^3}{12}$.'),
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('The least concrete for a given volume', 'Beton paling sedikit untuk volume tertentu'),
              body: L(
                T`
The same method prices a structure. An open water tank with a square base of side $s$ must hold $32\text{ m}^3$. Concrete is needed for the floor and the four walls, and its cost follows its area.

The constraint is the volume, $s^2h=32$, so $h=\dfrac{32}{s^2}$. The area to minimize is
$$A(s)=s^2+4sh=s^2+\frac{128}{s},\qquad s>0.$$

Differentiate and set to zero:
$$A'(s)=2s-\frac{128}{s^2}=0$$
$$\Rightarrow\ s^3=64$$
$$s=4\text{ m}$$
$$h=\frac{32}{16}=2\text{ m}.$$
Is it a minimum? $A''(s)=2+\dfrac{256}{s^3}$ is positive for every $s>0$, so the graph is concave up everywhere and the one critical point is the lowest: $A(4)=16+32=48\text{ m}^2$.

The best open tank is **half as tall as it is wide**. Make it $3$ m wide instead and the area rises to $51.7\text{ m}^2$; make it $6$ m wide and it is $57.3\text{ m}^2$.`,
                T`
Metode yang sama menghitung biaya sebuah bangunan. Tangki air terbuka beralas persegi bersisi $s$ harus memuat $32\text{ m}^3$. Beton diperlukan untuk lantai dan keempat dinding, dan biayanya mengikuti luasnya.

Kendalanya adalah volume, $s^2h=32$, sehingga $h=\dfrac{32}{s^2}$. Luas yang diminimalkan adalah
$$A(s)=s^2+4sh=s^2+\frac{128}{s},\qquad s>0.$$

Turunkan dan samakan dengan nol:
$$A'(s)=2s-\frac{128}{s^2}=0$$
$$\Rightarrow\ s^3=64$$
$$s=4\text{ m}$$
$$h=\frac{32}{16}=2\text{ m}.$$
Apakah itu minimum? $A''(s)=2+\dfrac{256}{s^3}$ positif untuk setiap $s>0$, sehingga grafiknya cekung ke atas di mana-mana dan satu-satunya titik kritis itu adalah yang terendah: $A(4)=16+32=48\text{ m}^2$.

Tangki terbuka terbaik **tingginya setengah lebarnya**. Buat lebarnya $3$ m dan luasnya naik menjadi $51{,}7\text{ m}^2$; buat lebarnya $6$ m dan luasnya $57{,}3\text{ m}^2$.`,
              ),
              scene3d: tankScene,
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Complete the derivative of $A(s)=s^2+\\dfrac{128}{s}$.',
                'Lengkapi turunan $A(s)=s^2+\\dfrac{128}{s}$.',
              ),
              template: "A'(s) = ___s - \\dfrac{___}{s^2}",
              blanks: ['2', '128'],
              explain: L(
                'Write $\\frac{128}{s}=128s^{-1}$; its derivative is $-128s^{-2}$.',
                'Tulis $\\frac{128}{s}=128s^{-1}$; turunannya $-128s^{-2}$.',
              ),
              hint: L('Rewrite $\\frac{1}{s}$ as a power of $s$ before differentiating.', 'Tulis ulang $\\frac{1}{s}$ sebagai pangkat $s$ sebelum menurunkan.'),
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: L(
                'Order the working for the open tank of volume $32\\text{ m}^3$.',
                'Susun langkah untuk tangki terbuka bervolume $32\\text{ m}^3$.',
              ),
              lines: S('s^2h=32 \\Rightarrow h=\\dfrac{32}{s^2}', 'A(s)=s^2+4sh=s^2+\\dfrac{128}{s}', "A'(s)=2s-\\dfrac{128}{s^2}=0", 's^3=64 \\Rightarrow s=4', "A''(s)=2+\\dfrac{256}{s^3}>0"),
              explain: L(
                'The constraint comes first, because it is what turns two unknowns into one. The second derivative comes last, to confirm that the critical point is a minimum.',
                'Kendala datang pertama, sebab dialah yang mengubah dua besaran tak diketahui menjadi satu. Turunan kedua datang terakhir, untuk memastikan titik kritisnya minimum.',
              ),
              hint: L('No derivative can be taken until the area depends on one variable.', 'Tak ada turunan yang dapat diambil sebelum luas bergantung pada satu peubah.'),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'A log is $40$ cm across. Find the width and the depth of the stiffest rectangular beam (the one with the largest $I=\\frac{bh^3}{12}$).',
                'Sebuah gelondong berdiameter $40$ cm. Cari lebar dan tinggi balok persegi panjang terkaku (yang $I=\\frac{bh^3}{12}$-nya terbesar).',
              ),
              blanks: [
                { label: 'b =', answer: 20, tol: 0.05, after: '\\text{cm}' },
                { label: 'h =', answer: 34.641016, tol: 0.05, after: '\\text{cm}' },
              ],
              hints: [
                L('The critical point comes from $D^2-4b^2=0$.', 'Titik kritisnya berasal dari $D^2-4b^2=0$.'),
                L('$b=\\dfrac{D}{2}$ and $h=\\sqrt{D^2-b^2}$.', '$b=\\dfrac{D}{2}$ dan $h=\\sqrt{D^2-b^2}$.'),
              ],
              explain: L(
                '$b=\\frac{40}{2}=20$ cm and $h=\\sqrt{1600-400}=20\\sqrt3\\approx34.64$ cm.',
                '$b=\\frac{40}{2}=20$ cm dan $h=\\sqrt{1600-400}=20\\sqrt3\\approx34{,}64$ cm.',
              ),
              solution: S('1600-4b^2=0\\Rightarrow b=20', 'h=\\sqrt{1600-400}=\\sqrt{1200}\\approx34.64'),
            },
            {
              kind: 'math',
              id: 'm2',
              prompt: L(
                'An open tank with a square base must hold $108\\text{ m}^3$. Find the side $s$ and the height $h$ that need the least concrete.',
                'Tangki terbuka beralas persegi harus memuat $108\\text{ m}^3$. Cari sisi $s$ dan tinggi $h$ yang memerlukan beton paling sedikit.',
              ),
              blanks: [
                { label: 's =', answer: 6, after: '\\text{m}' },
                { label: 'h =', answer: 3, after: '\\text{m}' },
              ],
              hints: [
                L('$A(s)=s^2+\\dfrac{4\\cdot108}{s}$.', '$A(s)=s^2+\\dfrac{4\\cdot108}{s}$.'),
                L('$A\'(s)=2s-\\dfrac{432}{s^2}=0$ gives $s^3=216$.', '$A\'(s)=2s-\\dfrac{432}{s^2}=0$ memberi $s^3=216$.'),
              ],
              explain: L(
                '$s^3=216$, so $s=6$ m and $h=\\frac{108}{36}=3$ m: again half as tall as it is wide.',
                '$s^3=216$, jadi $s=6$ m dan $h=\\frac{108}{36}=3$ m: lagi-lagi tingginya setengah lebarnya.',
              ),
              solution: S("A(s)=s^2+\\dfrac{432}{s},\\quad A'(s)=2s-\\dfrac{432}{s^2}=0", 's^3=216\\Rightarrow s=6,\\quad h=\\dfrac{108}{36}=3'),
            },
          ],
        },
      ],
      project: {
        id: 'sip-m1-s2-p',
        runtime: 'math',
        title: L('Cutting Beams and Pouring a Tank', 'Memotong Balok dan Mengecor Tangki'),
        brief: L(
          'One log, two beams, and one tank: three optimizations with a constraint.',
          'Satu gelondong, dua balok, dan satu tangki: tiga optimisasi dengan kendala.',
        ),
        requirements: [
          L('Use the constraint to write the quantity as a function of one variable before differentiating.', 'Pakai kendala untuk menuliskan besaran sebagai fungsi satu peubah sebelum menurunkan.'),
          L('Round to two decimal places at the end only.', 'Bulatkan ke dua desimal hanya di akhir.'),
        ],
        tasks: [
          {
            prompt: L(
              'A log is $24$ cm across. Find the width and the depth of the **strongest** beam (largest $S=\\frac{bh^2}{6}$).',
              'Sebuah gelondong berdiameter $24$ cm. Cari lebar dan tinggi balok **terkuat** ($S=\\frac{bh^2}{6}$ terbesar).',
            ),
            blanks: [
              { label: 'b =', answer: 13.856406, tol: 0.03, after: '\\text{cm}' },
              { label: 'h =', answer: 19.595918, tol: 0.03, after: '\\text{cm}' },
            ],
            solution: S("S(b)=\\dfrac{b(576-b^2)}{6},\\quad S'(b)=\\dfrac{576-3b^2}{6}=0\\Rightarrow b=\\sqrt{192}\\approx13.86", 'h=\\sqrt{576-192}=\\sqrt{384}\\approx19.60'),
          },
          {
            prompt: L(
              'From the same $24$ cm log, find the width and the depth of the **stiffest** beam (largest $I=\\frac{bh^3}{12}$).',
              'Dari gelondong $24$ cm yang sama, cari lebar dan tinggi balok **terkaku** ($I=\\frac{bh^3}{12}$ terbesar).',
            ),
            blanks: [
              { label: 'b =', answer: 12, tol: 0.03, after: '\\text{cm}' },
              { label: 'h =', answer: 20.784610, tol: 0.03, after: '\\text{cm}' },
            ],
            solution: S('576-4b^2=0\\Rightarrow b=12', 'h=\\sqrt{576-144}=\\sqrt{432}\\approx20.78'),
          },
          {
            prompt: L(
              'For any log, the strongest beam is a little less stiff than the stiffest one. What percent of the largest $I$ does the strongest beam have?',
              'Untuk gelondong mana pun, balok terkuat sedikit kurang kaku daripada balok terkaku. Berapa persen dari $I$ terbesar yang dimiliki balok terkuat?',
            ),
            blanks: [{ answer: 96.7735, tol: 0.1, after: '\\%' }],
            solution: S(
              'I\\propto b\\,h^3,\\quad b_S=\\dfrac{D}{\\sqrt3},\\ h_S=D\\sqrt{\\tfrac23},\\quad b_I=\\dfrac{D}{2},\\ h_I=\\dfrac{D\\sqrt3}{2}',
              '\\dfrac{\\frac{1}{\\sqrt3}\\left(\\frac23\\right)^{3/2}}{\\frac12\\left(\\frac34\\right)^{3/2}}\\approx\\dfrac{0.31427}{0.32476}\\approx0.9677=96.77\\%'),
          },
          {
            prompt: L(
              'An open tank with a square base must hold $13.5\\text{ m}^3$. Find the side that needs the least concrete, and that least area.',
              'Tangki terbuka beralas persegi harus memuat $13{,}5\\text{ m}^3$. Cari sisi yang memerlukan beton paling sedikit, dan luas terkecil itu.',
            ),
            blanks: [
              { label: 's =', answer: 3, after: '\\text{m}' },
              { label: 'A_{\\min} =', answer: 27, after: '\\text{m}^2' },
            ],
            solution: S("A(s)=s^2+\\dfrac{54}{s},\\quad A'(s)=2s-\\dfrac{54}{s^2}=0\\Rightarrow s^3=27,\\ s=3", 'A(3)=9+18=27'),
          },
        ],
        hints: [
          L('Part 3: the diameter cancels, so take $D=1$ and compare $b\\,h^3$ for the two beams.', 'Butir 3: diameternya saling menghapus, jadi ambil $D=1$ dan bandingkan $b\\,h^3$ kedua balok.'),
          L('Part 4: $h=\\dfrac{13.5}{s^2}$, so the walls have area $4sh=\\dfrac{54}{s}$.', 'Butir 4: $h=\\dfrac{13{,}5}{s^2}$, sehingga dinding memiliki luas $4sh=\\dfrac{54}{s}$.'),
        ],
        xp: 50,
      },
    },
  ],
}
