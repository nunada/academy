import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './applied-optimization.meta'

export { meta }

const L = (en: string, id: string): Loc => ({ en, id })

/** Prose is written between backticks with its TeX unescaped; the code marker
 *  inside it is ´ rather than a backtick, and `*word*` emphasis is dropped.
 *  `[words](article:id#section)` is a link to another article. */
const T = (s: TemplateStringsArray): string =>
  s.raw[0]
    .replace(/´([^´\n]+)´/g, '`$1`')
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '$1')
    .replace(/^\s+|\s+$/g, '')

export const body: ArticleBody = {
  answer: L(
    T`**To solve an applied optimization problem, write the quantity you want to make largest or smallest as a function of one variable, state the domain that the situation allows, and test the critical points and the endpoints of that domain.** A constraint is used to eliminate every other variable, and the answer is read back in the words of the problem: the dimensions, the price, the time, not just the value of $x$.`,
    T`**Untuk menyelesaikan soal optimisasi terapan, tulis besaran yang ingin dibuat terbesar atau terkecil sebagai fungsi satu peubah, tentukan domain yang diizinkan oleh keadaannya, lalu uji titik kritis dan ujung domain itu.** Kendala dipakai untuk menghilangkan semua peubah lain, dan jawabannya dibaca kembali dengan kata-kata soal: ukuran, harga, waktu, bukan hanya nilai $x$.`,
  ),

  keyPoints: [
    L(
      T`The strategy has four steps: read the problem and find the unknown to optimize; introduce variables and write every relation (a picture helps); express the unknown as a function of one variable with its domain; test the critical points and endpoints.`,
      T`Strateginya empat langkah: baca soal dan tentukan besaran yang dioptimalkan; perkenalkan peubah dan tulis setiap hubungan (gambar membantu); nyatakan besaran itu sebagai fungsi satu peubah beserta domainnya; uji titik kritis dan ujungnya.`,
    ),
    L(
      T`The domain comes from the situation, not from the formula: lengths cannot be negative and cut pieces cannot be larger than the sheet. A closed domain calls for the closed interval method; an open one calls for limits at the ends or the sign of $f'$ and $f''$.`,
      T`Domain berasal dari keadaan soal, bukan dari rumusnya: panjang tidak boleh negatif dan potongan tidak boleh lebih besar daripada karton. Domain tertutup memakai metode selang tertutup; domain terbuka memakai limit di ujung atau tanda $f'$ dan $f''$.`,
    ),
    L(
      T`Classic answers worth remembering: the closed can of a given volume uses the least metal when $h=2r$ (open top: $h=r$); a rectangle on a river fence is twice as long as it is wide; a rectangle in a semicircle has its corner at $45^\circ$ and area $R^2$.`,
      T`Jawaban klasik yang perlu diingat: kaleng tertutup dengan volume tertentu memakai logam paling sedikit saat $h=2r$ (tanpa tutup: $h=r$); persegi panjang di tepi sungai panjangnya dua kali lebarnya; persegi panjang dalam setengah lingkaran punya sudut di $45^\circ$ dan luas $R^2$.`,
    ),
    L(
      T`Three laws are optimization results: light takes the quickest path, which gives Snell's law $\frac{\sin\theta_1}{c_1}=\frac{\sin\theta_2}{c_2}$; profit peaks where marginal revenue equals marginal cost; and the delivery cycle $x=\sqrt{\frac{2K}{hd}}$ makes delivery cost equal storage cost.`,
      T`Tiga hukum adalah hasil optimisasi: cahaya menempuh jalur tercepat, yang memberi hukum Snell $\frac{\sin\theta_1}{c_1}=\frac{\sin\theta_2}{c_2}$; laba memuncak ketika pendapatan marjinal sama dengan biaya marjinal; dan siklus pengiriman $x=\sqrt{\frac{2K}{hd}}$ membuat biaya pengiriman sama dengan biaya penyimpanan.`,
    ),
    L(
      T`A lone critical point on an interval is the absolute extreme when $f''$ keeps one sign on the whole interval, or when $f'$ changes sign there and the function runs off to the same side at the open ends.`,
      T`Satu titik kritis tunggal pada suatu selang adalah ekstrem mutlak jika $f''$ tetap satu tanda di seluruh selang, atau jika $f'$ berganti tanda di sana dan fungsi menuju sisi yang sama di ujung terbuka.`,
    ),
    L(
      T`Check the answer against the problem: the units, whether the quantity must be a whole number (compare the whole numbers on both sides of the optimum), and whether the result answers what was asked.`,
      T`Periksa jawaban dengan soalnya: satuannya, apakah besarannya harus bilangan bulat (bandingkan bilangan bulat di kedua sisi optimum), dan apakah hasilnya menjawab yang ditanyakan.`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------------------------- the strategy */
    {
      id: 'four-steps',
      heading: L('How do you solve an applied optimization problem?', 'Bagaimana menyelesaikan soal optimisasi terapan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**An optimization problem asks for the best value of something: the rectangle of fixed perimeter with the most area, the cheapest can for a given volume, the production run with the largest profit.** The best value is a largest or smallest value of a function, and the [closed interval method](article:extreme-values-on-closed-intervals#closed-interval-method) already tells us how to find it. What is new is that the function is not given: you have to build it from a description in words.

**The four steps.**
1. *Read the problem* until you know what is given and which unknown is to be maximized or minimized.
2. *Introduce variables.* Name every relevant quantity, list every relation between them as an equation, and draw a picture whenever you can.
3. *Write the function.* Use the relations to express the unknown as a function of a single variable, and say for which values of that variable the situation makes sense. This is the longest step.
4. *Test the critical points and the endpoints* of that domain, with whatever you know about the shape of the graph, and use $f'$ and $f''$ to classify the critical points.

**Example.** You have 800 m of wire to fence a rectangular field that lies along a river, so only three sides need a fence. What is the largest area? The unknown is the area $A$. Call the two sides that meet the river $x$ and the side parallel to it $y$; the wire gives $2x+y=800$, so $y=800-2x$ and
$$A(x)=x(800-2x),\qquad 0\le x\le400,$$
because neither side can be negative. Then $A'(x)=800-4x$ is zero at $x=200$, and the values are $A(0)=0$, $A(200)=80000$ and $A(400)=0$. The largest area is $80000$ m², with sides $200$ m and $y=400$ m: the side along the river is twice each of the others, not equal to them.`,
            T`**Soal optimisasi meminta nilai terbaik dari sesuatu: persegi panjang dengan keliling tetap yang luasnya terbesar, kaleng termurah untuk volume tertentu, produksi dengan laba terbesar.** Nilai terbaik adalah nilai terbesar atau terkecil suatu fungsi, dan [metode selang tertutup](article:extreme-values-on-closed-intervals#closed-interval-method) sudah menunjukkan cara mencarinya. Yang baru adalah fungsinya tidak diberikan: kamu harus membangunnya dari uraian dengan kata-kata.

**Empat langkah.**
1. *Baca soal* sampai kamu tahu apa yang diketahui dan besaran mana yang harus dimaksimumkan atau diminimumkan.
2. *Perkenalkan peubah.* Beri nama setiap besaran yang relevan, tulis setiap hubungan di antaranya sebagai persamaan, dan gambarlah bila bisa.
3. *Tulis fungsinya.* Pakai hubungan itu untuk menyatakan besaran yang dicari sebagai fungsi satu peubah, dan tentukan untuk nilai peubah mana keadaannya masuk akal. Inilah langkah yang paling panjang.
4. *Uji titik kritis dan ujung* domain itu, dengan apa pun yang kamu ketahui tentang bentuk grafiknya, dan pakai $f'$ dan $f''$ untuk menggolongkan titik kritisnya.

**Contoh.** Kamu punya kawat 800 m untuk memagari tanah persegi panjang yang berbatasan dengan sungai, sehingga hanya tiga sisi yang perlu pagar. Berapa luas terbesar? Besaran yang dicari adalah luas $A$. Sebut dua sisi yang tegak lurus sungai $x$ dan sisi yang sejajar sungai $y$; kawat memberi $2x+y=800$, sehingga $y=800-2x$ dan
$$A(x)=x(800-2x),\qquad 0\le x\le400,$$
karena tidak ada sisi yang boleh negatif. Maka $A'(x)=800-4x$ nol di $x=200$, dan nilainya $A(0)=0$, $A(200)=80000$, dan $A(400)=0$. Luas terbesar $80000$ m², dengan sisi $200$ m dan $y=400$ m: sisi di sepanjang sungai dua kali masing-masing sisi lainnya, bukan sama dengannya.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------------------ geometry */
    {
      id: 'geometry',
      heading: L('How do you optimize boxes, cans and inscribed shapes?', 'Bagaimana mengoptimalkan kotak, kaleng, dan bangun dalam?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Geometry problems are the best place to practice step 3, because a constraint such as a fixed volume or a fixed perimeter must be used to remove a variable.**

**Example 1: the open box.** An open-top box is made from a $12$ cm by $12$ cm sheet of tin by cutting a square of side $x$ from each corner and folding up the sides. The box has base $(12-2x)\times(12-2x)$ and height $x$, so
$$V(x)=x(12-2x)^2=144x-48x^2+4x^3.$$
The sheet is only $12$ cm wide, so $0\le x\le6$. Then $V'(x)=144-96x+12x^2=12(x-2)(x-6)$, which is zero at $x=2$ and $x=6$; the second is an endpoint, and $V(0)=V(6)=0$. The only interior critical point gives $V(2)=128$, so the largest volume is $128$ cm³ with squares of side $2$ cm (a box $8$ by $8$ by $2$). The widget in the article on extreme values lets you change the sheet.

**Example 2: the one-liter can.** A closed can shaped like a cylinder must hold $1000$ cm³. The metal used is the surface area $A=2\pi r^2+2\pi rh$, and the volume gives $\pi r^2h=1000$, so $h=\frac{1000}{\pi r^2}$ and
$$A(r)=2\pi r^2+\frac{2000}{r},\qquad r>0.$$
The domain has no endpoints, so look at the derivative: $A'(r)=4\pi r-\frac{2000}{r^2}=0$ gives $r^3=\frac{500}{\pi}$, that is $r=\sqrt[3]{\frac{500}{\pi}}\approx5.42$ cm. Since $A''(r)=4\pi+\frac{4000}{r^3}>0$ for every $r>0$, the graph is concave up everywhere and this critical point is the absolute minimum. Then $h=\frac{1000}{\pi r^2}=2r\approx10.84$ cm. For *any* volume the best closed can has $h=2r$: as tall as it is wide. Real cans differ because of seams, thicker lids, and the shelf they stand on, which are not in the model. With no lid the ends cost half as much and the best can has $h=r$; if the ends are cut from squares of side $2r$ and the waste counts, the metal is $8r^2+2\pi rh$ and the best ratio is $\frac hr=\frac8\pi\approx2.55$.

**Example 3: the rectangle in a semicircle.** A rectangle is inscribed in a semicircle of radius $2$, with one side on the diameter. Put the center at the origin and let the upper right corner be $\left(x,\sqrt{4-x^2}\right)$. The rectangle has length $2x$, height $\sqrt{4-x^2}$ and area
$$A(x)=2x\sqrt{4-x^2},\qquad 0\le x\le2.$$
Then $A'(x)=2\sqrt{4-x^2}-\frac{2x^2}{\sqrt{4-x^2}}=\frac{8-4x^2}{\sqrt{4-x^2}}$, zero at $x=\sqrt2$ and not defined at the endpoint $x=2$. With $A(0)=A(2)=0$ and $A(\sqrt2)=4$, the largest area is $4$, for a rectangle $2\sqrt2$ long and $\sqrt2$ high. For a semicircle of radius $R$ the same steps give $x=\frac{R}{\sqrt2}$ and area $R^2$: the corner sits at $45^\circ$. A useful trick: $A$ is largest where $A^2=4x^2(4-x^2)$ is largest, which has no root to differentiate.

Choose a problem below. The widget shows the same four steps for fifteen textbook problems: what $x$ stands for, the relations, the domain, the graph, the table of critical points and ends with the best one marked, and the answer in the words of the problem.`,
            T`**Soal geometri adalah tempat terbaik melatih langkah 3, karena kendala seperti volume atau keliling tetap harus dipakai untuk menghilangkan satu peubah.**

**Contoh 1: kotak terbuka.** Kotak tanpa tutup dibuat dari lembaran timah $12$ cm kali $12$ cm dengan memotong persegi bersisi $x$ dari setiap sudut lalu melipat sisinya. Kotak itu beralas $(12-2x)\times(12-2x)$ dan tinggi $x$, sehingga
$$V(x)=x(12-2x)^2=144x-48x^2+4x^3.$$
Lembaran hanya selebar $12$ cm, sehingga $0\le x\le6$. Maka $V'(x)=144-96x+12x^2=12(x-2)(x-6)$, yang nol di $x=2$ dan $x=6$; yang kedua adalah ujung, dan $V(0)=V(6)=0$. Satu-satunya titik kritis di dalam memberi $V(2)=128$, sehingga volume terbesar $128$ cm³ dengan persegi bersisi $2$ cm (kotak $8$ kali $8$ kali $2$). Widget di artikel nilai ekstrem memungkinkan kamu mengubah ukuran lembarannya.

**Contoh 2: kaleng satu liter.** Kaleng tertutup berbentuk tabung harus memuat $1000$ cm³. Logam yang terpakai adalah luas permukaan $A=2\pi r^2+2\pi rh$, dan volumenya memberi $\pi r^2h=1000$, sehingga $h=\frac{1000}{\pi r^2}$ dan
$$A(r)=2\pi r^2+\frac{2000}{r},\qquad r>0.$$
Domainnya tidak punya ujung, jadi lihat turunannya: $A'(r)=4\pi r-\frac{2000}{r^2}=0$ memberi $r^3=\frac{500}{\pi}$, yaitu $r=\sqrt[3]{\frac{500}{\pi}}\approx5{,}42$ cm. Karena $A''(r)=4\pi+\frac{4000}{r^3}>0$ untuk setiap $r>0$, grafiknya cekung ke atas di mana-mana dan titik kritis ini adalah minimum mutlak. Maka $h=\frac{1000}{\pi r^2}=2r\approx10{,}84$ cm. Untuk *volume mana pun* kaleng tertutup terbaik memiliki $h=2r$: setinggi lebarnya. Kaleng nyata berbeda karena sambungan, tutup yang lebih tebal, dan rak tempat ia berdiri, yang tidak ada dalam model. Tanpa tutup, biaya bagian ujung separuhnya dan kaleng terbaik memiliki $h=r$; jika tutup dan alas dipotong dari persegi bersisi $2r$ dan sisa potongan dihitung, logamnya $8r^2+2\pi rh$ dan perbandingan terbaiknya $\frac hr=\frac8\pi\approx2{,}55$.

**Contoh 3: persegi panjang dalam setengah lingkaran.** Sebuah persegi panjang dibuat di dalam setengah lingkaran berjari-jari $2$, dengan satu sisinya pada diameter. Letakkan pusat di titik asal dan misalkan sudut kanan atasnya $\left(x,\sqrt{4-x^2}\right)$. Persegi panjang itu berpanjang $2x$, tinggi $\sqrt{4-x^2}$, dan luas
$$A(x)=2x\sqrt{4-x^2},\qquad 0\le x\le2.$$
Maka $A'(x)=2\sqrt{4-x^2}-\frac{2x^2}{\sqrt{4-x^2}}=\frac{8-4x^2}{\sqrt{4-x^2}}$, nol di $x=\sqrt2$ dan tidak terdefinisi di ujung $x=2$. Dengan $A(0)=A(2)=0$ dan $A(\sqrt2)=4$, luas terbesarnya $4$, untuk persegi panjang sepanjang $2\sqrt2$ dan setinggi $\sqrt2$. Untuk setengah lingkaran berjari-jari $R$ langkah yang sama memberi $x=\frac{R}{\sqrt2}$ dan luas $R^2$: sudutnya berada di $45^\circ$. Trik yang berguna: $A$ terbesar di tempat $A^2=4x^2(4-x^2)$ terbesar, yang tidak punya akar untuk diturunkan.

Pilih satu soal di bawah. Widget ini menunjukkan empat langkah yang sama untuk lima belas soal dari buku: arti $x$, hubungannya, domain, grafik, tabel titik kritis dan ujung dengan yang terbaik ditandai, dan jawaban dalam kata-kata soal.`,
          ),
        },
        { kind: 'widget', name: 'optproblems' },
        {
          kind: 'text',
          text: L(
            T`The can deserves its own look, because its answer does not depend on the volume. Change the volume, the kind of can and the radius below: the best radius changes with $V$, but the ratio $\frac hr$ does not.`,
            T`Kaleng layak dilihat tersendiri, karena jawabannya tidak bergantung pada volume. Ubah volume, jenis kaleng, dan jari-jarinya di bawah: jari-jari terbaik berubah menurut $V$, tetapi perbandingan $\frac hr$ tidak.`,
          ),
        },
        { kind: 'widget', name: 'optcan' },
      ],
    },

    /* --------------------------------------------------------------------------------- light */
    {
      id: 'light',
      heading: L('Why does light obey Snell’s law?', 'Mengapa cahaya mengikuti hukum Snell?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Fermat's principle says that light travels from one point to another along the path of least time, and from it the law of refraction follows as a calculus problem.** In a uniform medium the quickest path is the shortest, a straight line. When the path crosses from a medium where light has speed $c_1$ into one where it has speed $c_2$, it bends, and calculus tells us exactly how much.

**Example 4: refraction.** Let the boundary between the media be the $x$-axis, put $A=(0,a)$ in the first medium and $B=(d,-b)$ in the second, and let the ray cross at $P=(x,0)$ for some $x$ in $[0,d]$. Distance is rate times time, so the time is distance divided by speed on each piece:
$$t(x)=\frac{\sqrt{a^2+x^2}}{c_1}+\frac{\sqrt{b^2+(d-x)^2}}{c_2},\qquad 0\le x\le d.$$
The derivative is
$$t'(x)=\frac{x}{c_1\sqrt{a^2+x^2}}-\frac{d-x}{c_2\sqrt{b^2+(d-x)^2}}=\frac{\sin\theta_1}{c_1}-\frac{\sin\theta_2}{c_2},$$
where $\theta_1$ and $\theta_2$ are the angles that the two pieces make with the normal to the boundary. This is continuous, it is negative at $x=0$ and positive at $x=d$, and it is increasing because
$$t''(x)=\frac{a^2}{c_1\left(a^2+x^2\right)^{3/2}}+\frac{b^2}{c_2\left(b^2+(d-x)^2\right)^{3/2}}>0.$$
So $t'$ has exactly one zero, the Intermediate Value Theorem finds it, and it is the absolute minimum of $t$. At that point
$$\frac{\sin\theta_1}{c_1}=\frac{\sin\theta_2}{c_2},$$
which is Snell's law, the law of refraction. The ray bends toward the normal in the slower medium.

**A mirror.** If the ray bounces off a plane mirror and $B$ is on the same side, the speed is the same on both pieces, $c_1=c_2$, and $t'=0$ says $\sin\theta_1=\sin\theta_2$: the angle of incidence equals the angle of reflection. The same equation describes a lifeguard who runs on the sand and swims in the water, or Jane rowing and walking in the gallery above.

Change the two media, the positions and the crossing point below. The orange path is yours and the green one is the quickest.`,
            T`**Prinsip Fermat menyatakan bahwa cahaya menempuh jalur dari satu titik ke titik lain dengan waktu paling singkat, dan darinya hukum pembiasan mengikuti sebagai soal kalkulus.** Dalam medium yang seragam jalur tercepat adalah yang terpendek, yaitu garis lurus. Ketika jalur berpindah dari medium tempat cahaya berkecepatan $c_1$ ke medium berkecepatan $c_2$, ia membelok, dan kalkulus menunjukkan tepat seberapa banyak.

**Contoh 4: pembiasan.** Misalkan batas kedua medium adalah sumbu-$x$, letakkan $A=(0,a)$ di medium pertama dan $B=(d,-b)$ di medium kedua, dan misalkan sinar memotong di $P=(x,0)$ untuk suatu $x$ di $[0,d]$. Jarak adalah laju kali waktu, sehingga waktunya adalah jarak dibagi kecepatan pada tiap bagian:
$$t(x)=\frac{\sqrt{a^2+x^2}}{c_1}+\frac{\sqrt{b^2+(d-x)^2}}{c_2},\qquad 0\le x\le d.$$
Turunannya
$$t'(x)=\frac{x}{c_1\sqrt{a^2+x^2}}-\frac{d-x}{c_2\sqrt{b^2+(d-x)^2}}=\frac{\sin\theta_1}{c_1}-\frac{\sin\theta_2}{c_2},$$
dengan $\theta_1$ dan $\theta_2$ sudut yang dibentuk kedua bagian dengan garis normal batas. Ini kontinu, negatif di $x=0$ dan positif di $x=d$, dan naik karena
$$t''(x)=\frac{a^2}{c_1\left(a^2+x^2\right)^{3/2}}+\frac{b^2}{c_2\left(b^2+(d-x)^2\right)^{3/2}}>0.$$
Jadi $t'$ memiliki tepat satu nol, Teorema Nilai Antara menemukannya, dan itulah minimum mutlak $t$. Di titik itu
$$\frac{\sin\theta_1}{c_1}=\frac{\sin\theta_2}{c_2},$$
yaitu hukum Snell, hukum pembiasan. Sinar membelok mendekati normal di medium yang lebih lambat.

**Cermin.** Jika sinar memantul pada cermin datar dan $B$ ada di sisi yang sama, kecepatan sama pada kedua bagian, $c_1=c_2$, dan $t'=0$ berarti $\sin\theta_1=\sin\theta_2$: sudut datang sama dengan sudut pantul. Persamaan yang sama menggambarkan penjaga pantai yang berlari di pasir dan berenang di air, atau Jane yang mendayung dan berjalan di galeri di atas.

Ubah kedua medium, posisi, dan titik potongnya di bawah. Jalur oranye adalah jalurmu dan yang hijau adalah yang tercepat.`,
          ),
        },
        { kind: 'widget', name: 'snell' },
      ],
    },

    /* ------------------------------------------------------------------------------ economics */
    {
      id: 'economics',
      heading: L('How do cost, profit and inventory problems work?', 'Bagaimana soal biaya, laba, dan persediaan bekerja?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**In economics the best level of production is usually where the marginal revenue equals the marginal cost.** Let $r(x)$ be the revenue from selling $x$ items, $c(x)$ the cost of producing them, and $p(x)=r(x)-c(x)$ the profit. Items are whole numbers, but we learn most by treating $x$ as a real number and the functions as differentiable. The derivatives $r'$, $c'$ and $p'$ are the marginal revenue, marginal cost and marginal profit (see [marginal analysis](article:the-derivative-as-a-rate-of-change#marginal-analysis)). If the profit has a maximum at a critical point, then
$$p'(x)=r'(x)-c'(x)=0,\qquad\text{so}\qquad r'(x)=c'(x).$$
At a production level that maximizes profit, marginal revenue equals marginal cost.

**Example 5: MP3 players.** Suppose $r(x)=9x$ and $c(x)=x^3-6x^2+15x$ are the revenue and the cost in millions of dollars, with $x$ in millions of players. Then $r'(x)=9$ and $c'(x)=3x^2-12x+15$, and $c'(x)=r'(x)$ gives $3x^2-12x+6=0$, that is $x^2-4x+2=0$ and $x=2\pm\sqrt2$, about $0.586$ and $3.414$. The second derivative of the profit is $p''(x)=-c''(x)=-(6x-12)$, which is negative at $x=2+\sqrt2$ and positive at $x=2-\sqrt2$. So a maximum profit occurs at $x\approx3.414$ million players, where $p=4+4\sqrt2\approx9.66$ million dollars, and a maximum loss at $x\approx0.586$ million. The company breaks even where $r=c$, at $x=3\pm\sqrt3$, so the maximum profit is between the break-even points. If the price falls below $3$ the equation has no solution, because the marginal cost is never below $3$: every extra player then costs more than it earns, and the best plan is to make none.

**Example 6: how often to deliver.** A cabinetmaker uses $5$ units of cherry wood a day. Each delivery costs $5000$ dollars, and storing a unit costs $10$ dollars a day. If a delivery comes every $x$ days she must order $5x$ units, and the average amount in storage is about $\frac{5x}{2}$ units, held for $x$ days. The cost of one cycle is $5000+\frac{5x}{2}\cdot10\cdot x$, and the average daily cost is that divided by $x$:
$$c(x)=\frac{5000}{x}+25x,\qquad x>0.$$
Then $c'(x)=-\frac{5000}{x^2}+25=0$ gives $x^2=200$, $x=10\sqrt2\approx14.14$ days (the negative root is outside the domain), and $c''(x)=\frac{10000}{x^3}>0$ on the whole domain, so this is the absolute minimum: $c\approx707.11$ dollars a day, for an order of about $70$ units. Whole days are better for the schedule: $14$ days costs $707.14$ and $15$ days costs $708.33$.

**The general rule.** With a cost $K$ per delivery, $d$ units used a day and a storage cost $h$ per unit per day, $c(x)=\frac Kx+\frac{hd}{2}x$ has its minimum at
$$x=\sqrt{\frac{2K}{hd}},$$
and there the two terms are equal, $\frac Kx=\frac{hd}{2}x$: the delivery cost per day equals the storage cost per day. In inventory management the same result is the Wilson lot size formula: for an average weekly cost $A(q)=\frac{km}{q}+cm+\frac{hq}{2}$ of ordering, paying for and holding $q$ items, the best order is $q=\sqrt{\frac{2km}{h}}$.

Drag the price and the production level in the first widget and the costs in the second.`,
            T`**Dalam ekonomi, tingkat produksi terbaik biasanya ada di tempat pendapatan marjinal sama dengan biaya marjinal.** Misalkan $r(x)$ pendapatan dari penjualan $x$ barang, $c(x)$ biaya produksinya, dan $p(x)=r(x)-c(x)$ laba. Banyak barang adalah bilangan bulat, tetapi kita paling banyak belajar dengan memperlakukan $x$ sebagai bilangan real dan fungsinya terdiferensialkan. Turunan $r'$, $c'$, dan $p'$ adalah pendapatan marjinal, biaya marjinal, dan laba marjinal (lihat [analisis marjinal](article:the-derivative-as-a-rate-of-change#marginal-analysis)). Jika laba memiliki maksimum di suatu titik kritis, maka
$$p'(x)=r'(x)-c'(x)=0,\qquad\text{jadi}\qquad r'(x)=c'(x).$$
Pada tingkat produksi yang memaksimumkan laba, pendapatan marjinal sama dengan biaya marjinal.

**Contoh 5: pemutar MP3.** Misalkan $r(x)=9x$ dan $c(x)=x^3-6x^2+15x$ adalah pendapatan dan biaya dalam miliaran rupiah, dengan $x$ dalam jutaan pemutar. Maka $r'(x)=9$ dan $c'(x)=3x^2-12x+15$, dan $c'(x)=r'(x)$ memberi $3x^2-12x+6=0$, yaitu $x^2-4x+2=0$ dan $x=2\pm\sqrt2$, sekitar $0{,}586$ dan $3{,}414$. Turunan kedua laba adalah $p''(x)=-c''(x)=-(6x-12)$, yang negatif di $x=2+\sqrt2$ dan positif di $x=2-\sqrt2$. Jadi laba maksimum terjadi di $x\approx3{,}414$ juta pemutar, dengan $p=4+4\sqrt2\approx9{,}66$ miliar rupiah, dan rugi terbesar di $x\approx0{,}586$ juta. Perusahaan impas di tempat $r=c$, yaitu $x=3\pm\sqrt3$, sehingga laba maksimum ada di antara titik impas. Jika harga turun di bawah $3$, persamaannya tidak punya penyelesaian, karena biaya marjinal tidak pernah di bawah $3$: setiap pemutar tambahan lebih mahal daripada hasilnya, dan rencana terbaik adalah tidak membuat apa pun.

**Contoh 6: seberapa sering mengirim.** Seorang pembuat lemari memakai $5$ satuan kayu ceri sehari. Setiap pengiriman berbiaya $5000$ ribu rupiah, dan menyimpan satu satuan berbiaya $10$ ribu rupiah sehari. Jika pengiriman datang tiap $x$ hari ia harus memesan $5x$ satuan, dan jumlah rata-rata di gudang sekitar $\frac{5x}{2}$ satuan, disimpan selama $x$ hari. Biaya satu siklus $5000+\frac{5x}{2}\cdot10\cdot x$, dan biaya harian rata-ratanya adalah itu dibagi $x$:
$$c(x)=\frac{5000}{x}+25x,\qquad x>0.$$
Maka $c'(x)=-\frac{5000}{x^2}+25=0$ memberi $x^2=200$, $x=10\sqrt2\approx14{,}14$ hari (akar negatif di luar domain), dan $c''(x)=\frac{10000}{x^3}>0$ di seluruh domain, sehingga ini minimum mutlak: $c\approx707{,}11$ ribu rupiah sehari, untuk pesanan sekitar $70$ satuan. Hari bulat lebih baik untuk jadwal: $14$ hari berbiaya $707{,}14$ dan $15$ hari berbiaya $708{,}33$.

**Aturan umumnya.** Dengan biaya $K$ per pengiriman, $d$ satuan terpakai sehari, dan biaya simpan $h$ per satuan per hari, $c(x)=\frac Kx+\frac{hd}{2}x$ mencapai minimum di
$$x=\sqrt{\frac{2K}{hd}},$$
dan di sana kedua sukunya sama, $\frac Kx=\frac{hd}{2}x$: biaya pengiriman per hari sama dengan biaya penyimpanan per hari. Dalam manajemen persediaan hasil yang sama adalah rumus ukuran lot Wilson: untuk biaya mingguan rata-rata $A(q)=\frac{km}{q}+cm+\frac{hq}{2}$ untuk memesan, membayar, dan menyimpan $q$ barang, pesanan terbaik adalah $q=\sqrt{\frac{2km}{h}}$.

Geser harga dan tingkat produksi di widget pertama dan biayanya di widget kedua.`,
          ),
        },
        { kind: 'widget', name: 'profittool' },
        { kind: 'widget', name: 'deliverytool' },
      ],
    },

    /* ------------------------------------------------------------------------ open domains */
    {
      id: 'open-domains',
      heading: L('What if the domain is open, or has no endpoint to test?', 'Bagaimana jika domainnya terbuka, atau tidak punya ujung untuk diuji?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**When the domain is open, such as $r>0$, there is no endpoint to compare, so you show that the critical point is the absolute extreme by the shape of the function.** Four tools do it, from the strongest to the most common.

1. *The sign of $f''$ on the whole domain.* If $f''>0$ everywhere, the graph is concave up, a critical point is a minimum and it is the absolute minimum. This settled the can and the delivery cycle.
2. *The sign of $f'$.* If $f'<0$ to the left of the only critical point and $f'>0$ to its right, the function falls and then rises, which is the [First Derivative Test](article:monotonic-functions-and-the-first-derivative-test#first-derivative-test), and the point is the absolute minimum.
3. *Limits at the open ends.* If $f$ grows without bound at both ends, then no end can beat the critical value, so the lowest critical value is the absolute minimum. If $f$ only levels off toward a value, compare the critical value with that limit: a function can approach a value it never reaches, and then the extreme does not exist.
4. *One critical point.* A continuous function on an interval that has a single critical point cannot turn around anywhere else, so a local minimum there is the absolute minimum on the interval.

**Example 7: the poster.** A poster needs $312.5$ cm² of print, with margins of $10$ cm at the top and bottom and $5$ cm on each side. If the print is $x$ wide it is $\frac{312.5}{x}$ high, and the paper is $x+10$ by $\frac{312.5}{x}+20$:
$$P(x)=(x+10)\left(\frac{312.5}{x}+20\right)=20x+\frac{3125}{x}+512.5,\qquad x>0.$$
Then $P'(x)=20-\frac{3125}{x^2}=0$ gives $x=12.5$, and $P''(x)=\frac{6250}{x^3}>0$, so it is the absolute minimum: print $12.5$ by $25$, paper $22.5$ by $45$ cm, using $1012.5$ cm² of paper. As $x\to0^+$ and as $x\to\infty$ the area $P\to\infty$, so there is no largest poster, and asking for one would have no answer.

**Whole numbers.** If $x$ counts people or days, the real optimum is only a guide. The best whole number is one of the two on either side of it, and you compare their values, as with $14$ and $15$ days above. A tour with $x$ people at a fare of $300-2x$ dollars, fixed cost $6000$ and $32$ per person, has profit $p(x)=268x-2x^2-6000$ on $50\le x\le80$, with $p'(x)=268-4x=0$ at $x=67$, which happens to be a whole number: $67$ people, a fare of $166$ and a profit of $2978$. The widget above includes this problem.

**Check the answer.** Does it fall inside the domain? Is it a maximum or a minimum, as the problem asks? Are the units consistent? Does it answer the question asked, such as the dimensions or the least amount of material, and not just the value of $x$?`,
            T`**Ketika domainnya terbuka, seperti $r>0$, tidak ada ujung untuk dibandingkan, sehingga kamu menunjukkan bahwa titik kritis adalah ekstrem mutlak lewat bentuk fungsinya.** Empat alat melakukannya, dari yang paling kuat hingga yang paling lazim.

1. *Tanda $f''$ di seluruh domain.* Jika $f''>0$ di mana-mana, grafiknya cekung ke atas, titik kritis adalah minimum dan ia adalah minimum mutlak. Inilah yang menyelesaikan kaleng dan siklus pengiriman.
2. *Tanda $f'$.* Jika $f'<0$ di kiri satu-satunya titik kritis dan $f'>0$ di kanannya, fungsi turun lalu naik, yaitu [Uji Turunan Pertama](article:monotonic-functions-and-the-first-derivative-test#first-derivative-test), dan titik itu adalah minimum mutlak.
3. *Limit di ujung terbuka.* Jika $f$ membesar tanpa batas di kedua ujung, tidak ada ujung yang dapat mengalahkan nilai kritis, sehingga nilai kritis terendah adalah minimum mutlak. Jika $f$ hanya mendatar menuju suatu nilai, bandingkan nilai kritis dengan limit itu: fungsi dapat mendekati nilai yang tidak pernah dicapainya, dan ekstremnya lalu tidak ada.
4. *Satu titik kritis.* Fungsi kontinu pada suatu selang yang hanya memiliki satu titik kritis tidak dapat berbalik di tempat lain, sehingga minimum lokal di sana adalah minimum mutlak pada selang itu.

**Contoh 7: poster.** Sebuah poster memerlukan cetakan seluas $312{,}5$ cm², dengan margin $10$ cm di atas dan bawah serta $5$ cm di tiap sisi. Jika cetakan selebar $x$ maka tingginya $\frac{312{,}5}{x}$, dan kertasnya $x+10$ kali $\frac{312{,}5}{x}+20$:
$$P(x)=(x+10)\left(\frac{312{,}5}{x}+20\right)=20x+\frac{3125}{x}+512{,}5,\qquad x>0.$$
Maka $P'(x)=20-\frac{3125}{x^2}=0$ memberi $x=12{,}5$, dan $P''(x)=\frac{6250}{x^3}>0$, sehingga ini minimum mutlak: cetakan $12{,}5$ kali $25$, kertas $22{,}5$ kali $45$ cm, memakai kertas $1012{,}5$ cm². Ketika $x\to0^+$ dan ketika $x\to\infty$ luasnya $P\to\infty$, sehingga tidak ada poster terbesar, dan menanyakannya tidak akan punya jawaban.

**Bilangan bulat.** Jika $x$ menghitung orang atau hari, optimum real hanyalah penunjuk. Bilangan bulat terbaik adalah salah satu dari dua di kedua sisinya, dan kamu membandingkan nilainya, seperti $14$ dan $15$ hari di atas. Sebuah tur dengan $x$ peserta dengan tarif $300-2x$ ribu rupiah, biaya tetap $6000$ dan $32$ per orang, berlaba $p(x)=268x-2x^2-6000$ pada $50\le x\le80$, dengan $p'(x)=268-4x=0$ di $x=67$, yang kebetulan bilangan bulat: $67$ peserta, tarif $166$, dan laba $2978$. Widget di atas memuat soal ini.

**Periksa jawabannya.** Apakah jatuh di dalam domain? Apakah maksimum atau minimum, sesuai yang diminta soal? Apakah satuannya konsisten? Apakah menjawab yang ditanyakan, seperti ukuran atau bahan paling sedikit, dan bukan hanya nilai $x$?`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------------------- in code */
    {
      id: 'optimize-in-code',
      heading: L('How do you optimize in code?', 'Bagaimana mengoptimalkan dengan kode?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**In code, SymPy follows the four steps exactly: differentiate, solve $f'=0$, keep the roots inside the domain, and compare them with the value or limit at each end.** Without a CAS, a derivative-free search finds the minimum of a function that falls and then rises (a unimodal function): the golden-section search shrinks the interval around the minimum by the same ratio each time, and bisection on the sign of $f'$ does the same with the derivative. A search that uses only values of $f$ can locate the minimum to about the square root of the machine precision, roughly $10^{-8}$, because $f$ is flat there; the derivative gives a better answer.`,
            T`**Dalam kode, SymPy mengikuti empat langkah itu persis: turunkan, selesaikan $f'=0$, simpan akar yang ada di dalam domain, dan bandingkan dengan nilai atau limit di tiap ujung.** Tanpa CAS, pencarian tanpa turunan menemukan minimum fungsi yang turun lalu naik (fungsi unimodal): pencarian golden-section memperkecil selang di sekitar minimum dengan rasio yang sama setiap kali, dan bisection pada tanda $f'$ melakukan hal yang sama dengan turunannya. Pencarian yang hanya memakai nilai $f$ dapat menempatkan minimum hingga sekitar akar kuadrat ketelitian mesin, kira-kira $10^{-8}$, karena $f$ datar di sana; turunannya memberi jawaban yang lebih baik.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python and SymPy: the four steps for four problems', 'Python dan SymPy: empat langkah untuk empat soal'),
          code: `import sympy as sp

x = sp.symbols('x', positive=True)


def optimize(f, a, b, want='min'):
    """Best value of f on (a, b): the critical points inside, plus the value or limit at each end."""
    rows = [(s, sp.simplify(f.subs(x, s))) for s in sp.solve(sp.diff(f, x), x) if s.is_real and a < s < b]
    rows += [(end, sp.limit(f, x, end)) for end in (a, b)]
    pick = min if want == 'min' else max
    return pick(rows, key=lambda row: float(row[1])), rows


problems = (
    ('box', x * (12 - 2 * x) ** 2, 0, 6, 'max'),                                    # Example 1
    ('can', 2 * sp.pi * x ** 2 + 2000 / x, 0, sp.oo, 'min'),                         # Example 2
    ('poster', 20 * x + 3125 / x + sp.Rational(1025, 2), 0, sp.oo, 'min'),          # Example 7
    ('beam over a wall', (x + 5) * sp.sqrt(1 + 4 / x ** 2), 0, sp.oo, 'min'),       # a 2 m wall, 5 m from a building
)
for name, f, a, b, want in problems:
    (xb, fb), _ = optimize(f, a, b, want)
    print(name, xb, '->', sp.simplify(fb), '=', round(float(fb), 4))
# box 2 -> 128 = 128.0
# can 5*2**(2/3)/pi**(1/3) -> 300*2**(1/3)*pi**(1/3) = 553.581
# poster 25/2 -> 2025/2 = 1012.5
# beam over a wall 20**(1/3) -> sqrt(5)*(20**(1/3) + 5)**(3/2)/5 = 9.5823`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: golden-section search and bisection', 'JavaScript: pencarian golden-section dan bisection'),
          code: `// golden-section search: the smallest value of a function that falls and then rises on [a, b]
const golden = (f, a, b, tol = 1e-9) => {
  const g = (Math.sqrt(5) - 1) / 2
  let c = b - g * (b - a)
  let d = a + g * (b - a)
  while (b - a > tol) {
    if (f(c) < f(d)) b = d
    else a = c
    c = b - g * (b - a)
    d = a + g * (b - a)
  }
  return (a + b) / 2
}
const can = (r) => 2 * Math.PI * r * r + 2000 / r             // the one-liter can of Example 2
const r = golden(can, 0.1, 50)
;[r, 1000 / (Math.PI * r * r), can(r)].map((v) => +v.toFixed(4))     // [5.4193, 10.8385, 553.581]
const beam = (x) => (x + 5) * Math.sqrt(1 + 4 / (x * x))      // the shortest beam over a wall
const xb = golden(beam, 0.1, 50)
;[xb, beam(xb)].map((v) => +v.toFixed(4))                            // [2.7144, 9.5823]
// the same radius from the derivative: bisect on the sign of A'(r) = 4 pi r - 2000 / r^2
let lo = 0.1
let hi = 50
for (let i = 0; i < 60; i++) {
  const mid = (lo + hi) / 2
  if (4 * Math.PI * mid - 2000 / (mid * mid) < 0) lo = mid
  else hi = mid
}
+lo.toFixed(6)                                                       // 5.419261`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++', 'C++'),
          code: `#include <iostream>
#include <cstdio>
#include <cmath>
using namespace std;

double area(double r) {
  return 2 * 3.14159265358979 * r * r + 2000 / r;        // metal for a one-liter can
}

int main() {
  double lo = 0.1;
  double hi = 50;
  for (int i = 0; i < 100; i++) {                        // ternary search: the area falls and then rises
    double m1 = lo + (hi - lo) / 3;
    double m2 = hi - (hi - lo) / 3;
    if (area(m1) < area(m2)) hi = m2;
    else lo = m1;
  }
  double r = (lo + hi) / 2;
  double h = 1000 / (3.14159265358979 * r * r);
  printf("r=%.4f h=%.4f A=%.4f\\n", r, h, area(r));
  printf("h/r=%.4f\\n", h / r);                         // the best closed can is as tall as it is wide
  return 0;
}

/* output:
r=5.4193 h=10.8385 A=553.5810
h/r=2.0000
*/`,
        },
      ],
    },

    /* ----------------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where does optimization come from?', 'Dari mana optimisasi berasal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The oldest optimization problems are geometric, and the calculus way of solving them is only about four centuries old.**

- **Dido's problem, ancient.** The legend in Virgil's *Aeneid* says that Queen Dido was allowed as much land as an ox hide could surround, and cut the hide into a thin strip: how should a given length enclose the largest area? The answer, a circle, is among the first optimization problems.
- **Johannes Kepler, 1615.** Kepler studied the volume of wine barrels and noticed that near the largest volume a small change of shape hardly changes the volume. That flatness at the top is exactly what $f'=0$ says.
- **Pierre de Fermat, about 1629–1636.** Fermat described a method for maxima and minima: compare $f(x)$ with $f(x+e)$, divide by $e$, and then set $e$ to zero. Without the name, it is the derivative equal to zero.
- **Snell and Fermat, 1621 and 1662.** Willebrord Snell found the law of refraction around 1621 without publishing it; Descartes printed it in 1637. In 1662 Fermat showed that it follows from the principle that light takes the path of least time, one of the first physical laws stated as an optimization.
- **Harris and Wilson, 1913 and 1934.** Ford W. Harris derived the economic order quantity in 1913, and R. H. Wilson popularized it in 1934, which is why the inventory result is called the Wilson lot size formula.
- **Today.** Setting the derivative to zero, and its many-variable version with the gradient, is the core of fitting a line to data and of training machine-learning models, where the minimum is found by a search that moves downhill.`,
            T`**Soal optimisasi tertua bersifat geometri, dan cara kalkulus menyelesaikannya baru berumur sekitar empat abad.**

- **Soal Dido, zaman kuno.** Legenda dalam *Aeneid* karya Virgil mengatakan bahwa Ratu Dido diizinkan memiliki tanah seluas yang dapat dikelilingi sehelai kulit sapi, dan ia memotong kulit itu menjadi tali tipis: bagaimana panjang tertentu harus mengelilingi luas terbesar? Jawabannya, lingkaran, termasuk soal optimisasi paling awal.
- **Johannes Kepler, 1615.** Kepler mempelajari volume tong anggur dan memperhatikan bahwa di dekat volume terbesar perubahan kecil bentuk hampir tidak mengubah volume. Kedataran di puncak itu tepat apa yang dikatakan $f'=0$.
- **Pierre de Fermat, sekitar 1629–1636.** Fermat menjelaskan metode untuk maksimum dan minimum: bandingkan $f(x)$ dengan $f(x+e)$, bagi dengan $e$, lalu jadikan $e$ nol. Tanpa nama itu, ini adalah turunan sama dengan nol.
- **Snell dan Fermat, 1621 dan 1662.** Willebrord Snell menemukan hukum pembiasan sekitar 1621 tanpa menerbitkannya; Descartes mencetaknya pada 1637. Pada 1662 Fermat menunjukkan bahwa hukum itu mengikuti prinsip bahwa cahaya menempuh jalur dengan waktu paling singkat, salah satu hukum fisika pertama yang dinyatakan sebagai optimisasi.
- **Harris dan Wilson, 1913 dan 1934.** Ford W. Harris menurunkan jumlah pesanan ekonomis pada 1913, dan R. H. Wilson mempopulerkannya pada 1934, itulah sebabnya hasil persediaan itu disebut rumus ukuran lot Wilson.
- **Sekarang.** Menyamakan turunan dengan nol, dan versi banyak peubahnya dengan gradien, adalah inti pencocokan garis pada data dan pelatihan model pembelajaran mesin, tempat minimum dicari dengan pencarian yang bergerak menurun.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What mistakes do people make in optimization problems?', 'Kesalahan apa yang sering terjadi pada soal optimisasi?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes in applied optimization are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ Differentiate with two variables left in, such as $A=2\pi r^2+2\pi rh$ | Use the constraint $\pi r^2h=1000$ first: $A(r)=2\pi r^2+\frac{2000}{r}$, then differentiate. |
| ❌ Forget the domain | The situation sets it: $0\le x\le6$ for the box. A critical point outside it, like $x=-10\sqrt2$ for the deliveries, is thrown away. |
| ❌ Test only the critical points | The endpoints can win: $x^3-3x$ on $[-2,3]$ has the critical point $x=-1$ with value $2$, but the maximum is $18$ at $x=3$. |
| ❌ Assume a critical point is a maximum | Classify it: for the can, $A''(r)>0$ everywhere, so it is a minimum; with $A''<0$ it would be a maximum. |
| ❌ Answer with the value of $x$ | Answer what was asked: the largest volume is $V(2)=128$ cm³, and the cut is $2$ cm. |
| ❌ Optimize the wrong quantity | Minimize the surface area of the can, not its volume, which is fixed. |
| ❌ Mix units | Keep cm with cm, hours with hours, and thousand rupiah with thousand rupiah. |
| ❌ Round the real optimum | If $x$ must be a whole number, compare the whole numbers on both sides: $14$ days costs $707.14$, $15$ days $708.33$. |
| ❌ Expect the nicest shape | The best field on a river is $200$ by $400$, not a square, and the best rectangle in a semicircle is twice as long as it is high. |`,
            T`**Kesalahan paling umum pada optimisasi terapan adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ Menurunkan dengan dua peubah tersisa, seperti $A=2\pi r^2+2\pi rh$ | Pakai kendala $\pi r^2h=1000$ lebih dahulu: $A(r)=2\pi r^2+\frac{2000}{r}$, lalu turunkan. |
| ❌ Melupakan domain | Keadaan soal menentukannya: $0\le x\le6$ untuk kotak. Titik kritis di luarnya, seperti $x=-10\sqrt2$ pada pengiriman, dibuang. |
| ❌ Hanya menguji titik kritis | Ujung bisa menang: $x^3-3x$ pada $[-2,3]$ memiliki titik kritis $x=-1$ bernilai $2$, tetapi maksimumnya $18$ di $x=3$. |
| ❌ Mengira titik kritis adalah maksimum | Golongkan: untuk kaleng, $A''(r)>0$ di mana-mana, sehingga ia minimum; dengan $A''<0$ ia akan menjadi maksimum. |
| ❌ Menjawab dengan nilai $x$ | Jawab yang ditanyakan: volume terbesar adalah $V(2)=128$ cm³, dan potongannya $2$ cm. |
| ❌ Mengoptimalkan besaran yang salah | Minimumkan luas permukaan kaleng, bukan volumenya, yang tetap. |
| ❌ Mencampur satuan | Jaga cm dengan cm, jam dengan jam, dan ribu rupiah dengan ribu rupiah. |
| ❌ Membulatkan optimum real | Jika $x$ harus bilangan bulat, bandingkan bilangan bulat di kedua sisinya: $14$ hari berbiaya $707{,}14$, $15$ hari $708{,}33$. |
| ❌ Mengharapkan bentuk terindah | Lahan terbaik di tepi sungai berukuran $200$ kali $400$, bukan persegi, dan persegi panjang terbaik dalam setengah lingkaran dua kali lebih panjang daripada tingginya. |`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------------------------- practice */
    {
      id: 'practice',
      heading: L('Practice: test your understanding', 'Latihan: uji pemahamanmu'),
      blocks: [
        {
          kind: 'text',
          text: L(
            'These questions mix everything above. A wrong answer costs nothing here: read the hint and try again.',
            'Soal-soal ini mencampur semua yang dibahas di atas. Jika jawabanmu belum tepat, perhatikan petunjuk yang tersedia, lalu coba kembali.',
          ),
        },
        {
          kind: 'activity',
          title: L('True or false?', 'Benar atau salah?'),
          step: {
            kind: 'judge',
            id: 'p1',
            prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
            statements: [
              L(T`The constraint is used to write the quantity to optimize as a function of one variable.`, T`Kendala dipakai untuk menulis besaran yang dioptimalkan sebagai fungsi satu peubah.`),
              L(T`The domain of the function is read from the formula alone.`, T`Domain fungsi dibaca dari rumusnya saja.`),
              L(T`On a closed domain the endpoints must be compared with the critical points.`, T`Pada domain tertutup ujung harus dibandingkan dengan titik kritis.`),
              L(T`A critical point is always the answer to the problem.`, T`Titik kritis selalu merupakan jawaban soal.`),
              L(T`If $f''>0$ on the whole domain, a critical point is the absolute minimum.`, T`Jika $f''>0$ di seluruh domain, titik kritis adalah minimum mutlak.`),
              L(T`The value of $x$ is always the final answer.`, T`Nilai $x$ selalu merupakan jawaban akhir.`),
            ],
            answer: [true, false, true, false, true, false],
            explain: L(
              T`The domain comes from the situation. A critical point still has to be compared with the endpoints and classified. The final answer is the quantity the problem asks for, not $x$ itself.`,
              T`Domain berasal dari keadaan soal. Titik kritis tetap harus dibandingkan dengan ujung dan digolongkan. Jawaban akhir adalah besaran yang ditanyakan soal, bukan $x$ itu sendiri.`,
            ),
            hint: L(T`Recall the four steps and the mistakes table.`, T`Ingat empat langkah dan tabel kesalahan.`),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L(T`Which of these are tools for showing that a lone critical point of a function on an open interval is the absolute minimum? Choose **all** that apply.`, T`Mana dari berikut yang merupakan alat untuk menunjukkan bahwa satu titik kritis suatu fungsi pada selang terbuka adalah minimum mutlak? Pilih **semua** yang benar.`),
            options: [
              L(T`$f''>0$ on the whole domain`, T`$f''>0$ di seluruh domain`),
              L(T`$f'$ changes from negative to positive there`, T`$f'$ berganti dari negatif ke positif di sana`),
              L(T`$f$ grows without bound at both open ends`, T`$f$ membesar tanpa batas di kedua ujung terbuka`),
              L(T`$f'(x)=0$ alone`, T`$f'(x)=0$ saja`),
              L(T`the value of $f$ at the other critical points when there are some`, T`nilai $f$ di titik kritis lain bila ada`),
            ],
            answer: [0, 1, 2, 4],
            explain: L(T`$f'(x)=0$ alone also happens at maxima and at points that are neither. The other four tell the shape of the graph or compare values.`, T`$f'(x)=0$ saja juga terjadi di maksimum dan di titik yang bukan keduanya. Empat lainnya menunjukkan bentuk grafik atau membandingkan nilai.`),
            hint: L(T`Which ones say something about the shape of the graph?`, T`Mana yang menyatakan sesuatu tentang bentuk grafik?`),
          },
        },
        {
          kind: 'activity',
          title: L('The largest rectangle', 'Persegi panjang terbesar'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L(T`If the sides are $x$ and $20-x$, the area is $A(x)=x(20-x)$ on $0\le x\le20$.`, T`Jika sisinya $x$ dan $20-x$, luasnya $A(x)=x(20-x)$ pada $0\le x\le20$.`), L(T`$A'(x)=20-2x=0$ at $x=10$.`, T`$A'(x)=20-2x=0$ di $x=10$.`)],
            explain: L(T`$A(10)=100$ at the square of side $10$; the ends give $0$.`, T`$A(10)=100$ pada persegi bersisi $10$; ujungnya memberi $0$.`),
            prompt: L(T`What is the largest area of a rectangle with perimeter $40$ cm, in cm²?`, T`Berapa luas terbesar persegi panjang berkeliling $40$ cm, dalam cm²?`),
            given: String.raw`A=v`,
            blanks: [{ label: 'A =', answer: 100 }],
          },
        },
        {
          kind: 'activity',
          title: L('The smallest perimeter', 'Keliling terkecil'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L(T`With sides $x$ and $\frac{64}{x}$ the perimeter is $P(x)=2x+\frac{128}{x}$ for $x>0$.`, T`Dengan sisi $x$ dan $\frac{64}{x}$ kelilingnya $P(x)=2x+\frac{128}{x}$ untuk $x>0$.`), L(T`$P'(x)=2-\frac{128}{x^2}=0$ at $x=8$, and $P''>0$.`, T`$P'(x)=2-\frac{128}{x^2}=0$ di $x=8$, dan $P''>0$.`)],
            explain: L(T`$P(8)=16+16=32$ for the square of side $8$.`, T`$P(8)=16+16=32$ untuk persegi bersisi $8$.`),
            prompt: L(T`What is the smallest perimeter of a rectangle with area $64$ cm², in cm?`, T`Berapa keliling terkecil persegi panjang dengan luas $64$ cm², dalam cm?`),
            given: String.raw`P=v`,
            blanks: [{ label: 'P =', answer: 32 }],
          },
        },
        {
          kind: 'activity',
          title: L('The open can', 'Kaleng tanpa tutup'),
          step: {
            kind: 'quiz',
            id: 'p5',
            prompt: L(T`For a can with no lid that holds a fixed volume with the least metal, what is the ratio $\frac hr$?`, T`Untuk kaleng tanpa tutup yang memuat volume tertentu dengan logam paling sedikit, berapa perbandingan $\frac hr$?`),
            options: [
              L(T`$1$: the height equals the radius`, T`$1$: tingginya sama dengan jari-jari`),
              L(T`$2$: the height equals the diameter`, T`$2$: tingginya sama dengan diameter`),
              L(T`$\frac12$`, T`$\frac12$`),
              L(T`it depends on the volume`, T`bergantung pada volume`),
            ],
            answer: 0,
            explain: L(T`$A=\pi r^2+\frac{2V}{r}$, $A'=2\pi r-\frac{2V}{r^2}=0$ gives $r^3=\frac V\pi$, and $h=\frac{V}{\pi r^2}=r$. The ratio does not depend on $V$.`, T`$A=\pi r^2+\frac{2V}{r}$, $A'=2\pi r-\frac{2V}{r^2}=0$ memberi $r^3=\frac V\pi$, dan $h=\frac{V}{\pi r^2}=r$. Perbandingannya tidak bergantung pada $V$.`),
            hint: L(T`The lid is gone, so the area is $\pi r^2+2\pi rh$.`, T`Tutupnya tiada, jadi luasnya $\pi r^2+2\pi rh$.`),
          },
        },
        {
          kind: 'activity',
          title: L('A box from a card', 'Kotak dari karton'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L(T`$V(x)=x(24-2x)(45-2x)$ on $0\le x\le12$, and $V'(x)=12x^2-276x+1080$.`, T`$V(x)=x(24-2x)(45-2x)$ pada $0\le x\le12$, dan $V'(x)=12x^2-276x+1080$.`), L(T`$V'(x)=12(x-5)(x-18)$: only $x=5$ is in the domain.`, T`$V'(x)=12(x-5)(x-18)$: hanya $x=5$ ada di domain.`)],
            explain: L(T`$V(5)=5\cdot14\cdot35=2450$ cm³, with squares of side $5$ cm.`, T`$V(5)=5\cdot14\cdot35=2450$ cm³, dengan persegi bersisi $5$ cm.`),
            prompt: L(T`A $24$ cm by $45$ cm card is cut and folded into an open box by removing squares of side $x$ from the corners. What is the largest volume, in cm³?`, T`Karton $24$ cm kali $45$ cm dipotong dan dilipat menjadi kotak terbuka dengan membuang persegi bersisi $x$ dari sudutnya. Berapa volume terbesarnya, dalam cm³?`),
            given: String.raw`V=v`,
            blanks: [{ label: 'V =', answer: 2450 }],
          },
        },
        {
          kind: 'activity',
          title: L('A rectangle in a semicircle', 'Persegi panjang dalam setengah lingkaran'),
          step: {
            kind: 'math',
            id: 'p7',
            hints: [L(T`For radius $R$ the area is $2x\sqrt{R^2-x^2}$, largest at $x=\frac{R}{\sqrt2}$.`, T`Untuk jari-jari $R$ luasnya $2x\sqrt{R^2-x^2}$, terbesar di $x=\frac{R}{\sqrt2}$.`), L(T`Then the area is $R^2$.`, T`Maka luasnya $R^2$.`)],
            explain: L(T`The largest area is $R^2=6^2=36$.`, T`Luas terbesar $R^2=6^2=36$.`),
            prompt: L(T`What is the largest area of a rectangle inscribed in a semicircle of radius $6$?`, T`Berapa luas terbesar persegi panjang yang dibuat dalam setengah lingkaran berjari-jari $6$?`),
            given: String.raw`A=v`,
            blanks: [{ label: 'A =', answer: 36 }],
          },
        },
        {
          kind: 'activity',
          title: L('Marginal revenue and cost', 'Pendapatan dan biaya marjinal'),
          step: {
            kind: 'quiz',
            id: 'p8',
            prompt: L(T`At a production level that gives the maximum profit (at a critical point of the profit), what is true?`, T`Pada tingkat produksi yang memberi laba maksimum (di titik kritis laba), apa yang benar?`),
            options: [
              L(T`marginal revenue equals marginal cost`, T`pendapatan marjinal sama dengan biaya marjinal`),
              L(T`revenue equals cost`, T`pendapatan sama dengan biaya`),
              L(T`marginal cost is zero`, T`biaya marjinal nol`),
              L(T`the profit is zero`, T`labanya nol`),
            ],
            answer: 0,
            explain: L(T`$p=r-c$, so $p'=r'-c'=0$ gives $r'=c'$. Revenue equals cost at the break-even points, which is a different condition.`, T`$p=r-c$, sehingga $p'=r'-c'=0$ memberi $r'=c'$. Pendapatan sama dengan biaya di titik impas, yang merupakan syarat berbeda.`),
            hint: L(T`Differentiate $p(x)=r(x)-c(x)$.`, T`Turunkan $p(x)=r(x)-c(x)$.`),
          },
        },
        {
          kind: 'activity',
          title: L('How often to deliver', 'Seberapa sering mengirim'),
          step: {
            kind: 'math',
            id: 'p9',
            hints: [L(T`$c(x)=\frac{900}{x}+\frac{1\cdot2}{2}x=\frac{900}{x}+x$.`, T`$c(x)=\frac{900}{x}+\frac{1\cdot2}{2}x=\frac{900}{x}+x$.`), L(T`$c'(x)=-\frac{900}{x^2}+1=0$ gives $x^2=900$.`, T`$c'(x)=-\frac{900}{x^2}+1=0$ memberi $x^2=900$.`)],
            explain: L(T`$x=\sqrt{\frac{2K}{hd}}=\sqrt{\frac{1800}{2}}=30$ days.`, T`$x=\sqrt{\frac{2K}{hd}}=\sqrt{\frac{1800}{2}}=30$ hari.`),
            prompt: L(T`A delivery costs $900$, $2$ units are used a day and storing a unit costs $1$ a day. How many days between deliveries minimize the average daily cost?`, T`Satu pengiriman berbiaya $900$, $2$ satuan terpakai sehari dan menyimpan satu satuan berbiaya $1$ sehari. Berapa hari antar pengiriman yang meminimumkan biaya harian rata-rata?`),
            given: String.raw`x=v`,
            blanks: [{ label: 'x =', answer: 30 }],
          },
        },
        {
          kind: 'activity',
          title: L('The quickest light', 'Cahaya tercepat'),
          step: {
            kind: 'quiz',
            id: 'p10',
            prompt: L(T`Light goes from A in air ($c_1$) to B in water ($c_2<c_1$) along the quickest path. What is true at the point where it crosses?`, T`Cahaya bergerak dari A di udara ($c_1$) ke B di air ($c_2<c_1$) menurut jalur tercepat. Apa yang benar di titik tempat ia memotong?`),
            options: [
              L(T`$\frac{\sin\theta_1}{c_1}=\frac{\sin\theta_2}{c_2}$, so $\theta_2<\theta_1$: it bends toward the normal`, T`$\frac{\sin\theta_1}{c_1}=\frac{\sin\theta_2}{c_2}$, sehingga $\theta_2<\theta_1$: ia membelok mendekati normal`),
              L(T`$\theta_1=\theta_2$: it does not bend`, T`$\theta_1=\theta_2$: ia tidak membelok`),
              L(T`the path is the shortest one, a straight line from A to B`, T`jalurnya yang terpendek, garis lurus dari A ke B`),
              L(T`$\sin\theta_1=\sin\theta_2$ always`, T`$\sin\theta_1=\sin\theta_2$ selalu`),
            ],
            answer: 0,
            explain: L(T`The quickest path is not the shortest: spending more of it in the faster medium saves time. Then $t'(x)=0$ gives Snell's law, and with $c_2<c_1$ the angle $\theta_2$ is smaller.`, T`Jalur tercepat bukan yang terpendek: lebih banyak berada di medium yang lebih cepat menghemat waktu. Maka $t'(x)=0$ memberi hukum Snell, dan dengan $c_2<c_1$ sudut $\theta_2$ lebih kecil.`),
            hint: L(T`Write $t(x)$ for the two pieces and set $t'(x)=0$.`, T`Tulis $t(x)$ untuk dua bagian dan setel $t'(x)=0$.`),
          },
        },
        {
          kind: 'activity',
          title: L('A sum and a reciprocal', 'Jumlah dan kebalikan'),
          step: {
            kind: 'math',
            id: 'p11',
            hints: [L(T`$f(x)=x+\frac4x$ on $x>0$, and $f'(x)=1-\frac{4}{x^2}=0$ at $x=2$.`, T`$f(x)=x+\frac4x$ pada $x>0$, dan $f'(x)=1-\frac{4}{x^2}=0$ di $x=2$.`), L(T`$f''(2)=\frac{8}{8}>0$, so it is the minimum.`, T`$f''(2)=\frac{8}{8}>0$, sehingga ini minimum.`)],
            explain: L(T`$f(2)=2+2=4$.`, T`$f(2)=2+2=4$.`),
            prompt: L(T`What is the smallest value of $x+\frac4x$ for $x>0$?`, T`Berapa nilai terkecil $x+\frac4x$ untuk $x>0$?`),
            given: String.raw`f_{\min}=v`,
            blanks: [{ label: 'f =', answer: 4 }],
          },
        },
        {
          kind: 'activity',
          title: L('Why a lone critical point wins', 'Mengapa satu titik kritis tunggal menang'),
          step: {
            kind: 'quiz',
            id: 'p12',
            prompt: L(T`A function is continuous on $x>0$, has exactly one critical point, and $f(x)\to\infty$ as $x\to0^+$ and as $x\to\infty$. Why is that critical point the absolute minimum?`, T`Sebuah fungsi kontinu pada $x>0$, memiliki tepat satu titik kritis, dan $f(x)\to\infty$ ketika $x\to0^+$ dan ketika $x\to\infty$. Mengapa titik kritis itu adalah minimum mutlak?`),
            options: [
              L(T`the function must come down to a lowest value, which can only be at a critical point, and the only one is it`, T`fungsi harus turun ke nilai terendah, yang hanya dapat ada di titik kritis, dan satu-satunya adalah itu`),
              L(T`every critical point is a minimum`, T`setiap titik kritis adalah minimum`),
              L(T`because the interval is closed`, T`karena selangnya tertutup`),
              L(T`it need not be: a function that grows at both ends may have no minimum`, T`tidak harus: fungsi yang membesar di kedua ujung boleh tidak memiliki minimum`),
            ],
            answer: 0,
            explain: L(T`Far out at either end the values are huge, so the smallest value is reached somewhere inside, where $f'=0$ or does not exist. With only one such point, that is it.`, T`Jauh di kedua ujung nilainya sangat besar, sehingga nilai terkecil dicapai di suatu tempat di dalam, tempat $f'=0$ atau tidak ada. Dengan hanya satu titik seperti itu, itulah dia.`),
            hint: L(T`Where can a lowest value of a continuous function be if not at an end?`, T`Di mana nilai terendah fungsi kontinu jika bukan di ujung?`),
          },
        },
      ],
    },

    /* ----------------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: applied optimization at a glance', 'Ringkasan: optimisasi terapan sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **The four steps:** read; introduce variables and relations; write the objective as a function of one variable with its domain; test critical points and endpoints.
- **Domain:** from the situation; closed means compare the endpoints, open means limits at the ends or the sign of $f'$ and $f''$.
- **Geometry:** closed can $h=2r$, open can $h=r$, field on a river twice as long as it is wide, rectangle in a semicircle of radius $R$ has area $R^2$.
- **Light:** the quickest path gives $\frac{\sin\theta_1}{c_1}=\frac{\sin\theta_2}{c_2}$; a mirror gives equal angles.
- **Economics:** $r'(x)=c'(x)$ at maximum profit; the delivery cycle $x=\sqrt{\frac{2K}{hd}}$; the Wilson lot size $q=\sqrt{\frac{2km}{h}}$.
- **Whole numbers:** compare the two whole numbers around the optimum.
- **Check:** units, domain, maximum or minimum, and the quantity asked.
- **Code:** SymPy ´diff´, ´solve´, ´limit´, or a golden-section search for a function that falls and then rises.`,
            T`- **Empat langkah:** baca; perkenalkan peubah dan hubungan; tulis fungsi tujuan sebagai fungsi satu peubah beserta domainnya; uji titik kritis dan ujung.
- **Domain:** dari keadaan soal; tertutup berarti bandingkan ujung, terbuka berarti limit di ujung atau tanda $f'$ dan $f''$.
- **Geometri:** kaleng tertutup $h=2r$, kaleng tanpa tutup $h=r$, lahan di tepi sungai dua kali lebih panjang daripada lebarnya, persegi panjang dalam setengah lingkaran berjari-jari $R$ berluas $R^2$.
- **Cahaya:** jalur tercepat memberi $\frac{\sin\theta_1}{c_1}=\frac{\sin\theta_2}{c_2}$; cermin memberi sudut yang sama.
- **Ekonomi:** $r'(x)=c'(x)$ pada laba maksimum; siklus pengiriman $x=\sqrt{\frac{2K}{hd}}$; ukuran lot Wilson $q=\sqrt{\frac{2km}{h}}$.
- **Bilangan bulat:** bandingkan dua bilangan bulat di sekitar optimum.
- **Periksa:** satuan, domain, maksimum atau minimum, dan besaran yang ditanyakan.
- **Kode:** SymPy ´diff´, ´solve´, ´limit´, atau pencarian golden-section untuk fungsi yang turun lalu naik.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Objective function', 'Fungsi tujuan'), definition: L('The quantity to be made largest or smallest, written as a function of one variable.', 'Besaran yang akan dibuat terbesar atau terkecil, ditulis sebagai fungsi satu peubah.') },
    { term: L('Constraint', 'Kendala'), definition: L('A relation between the variables, such as a fixed volume or a fixed length of wire, used to remove all but one of them.', 'Hubungan di antara peubah, seperti volume tetap atau panjang kawat tetap, yang dipakai untuk menghilangkan semuanya kecuali satu.') },
    { term: L('Domain', 'Domain'), definition: L('The values of the variable for which the situation makes sense, which may be closed or open.', 'Nilai peubah yang membuat keadaannya masuk akal, yang boleh tertutup atau terbuka.') },
    { term: L('Critical point', 'Titik kritis'), definition: L('An interior point of the domain where the derivative is zero or does not exist.', 'Titik di dalam domain tempat turunannya nol atau tidak ada.') },
    { term: L('Marginal cost', 'Biaya marjinal'), definition: L('The derivative of the cost function, about the cost of making one more item.', 'Turunan fungsi biaya, kira-kira biaya membuat satu barang lagi.') },
    { term: L('Fermat’s principle', 'Prinsip Fermat'), definition: L('Light travels between two points along the path that takes the least time.', 'Cahaya bergerak antara dua titik menurut jalur yang memerlukan waktu paling singkat.') },
    { term: L('Snell’s law', 'Hukum Snell'), definition: L('The law of refraction: the sine of the angle from the normal divided by the speed is the same on both sides of a boundary.', 'Hukum pembiasan: sinus sudut dari normal dibagi kecepatan sama di kedua sisi suatu batas.') },
    { term: L('Wilson lot size', 'Ukuran lot Wilson'), definition: L('The order quantity that minimizes the average cost of ordering and holding stock, the square root of twice the ordering cost times the demand over the holding cost.', 'Jumlah pesanan yang meminimumkan biaya rata-rata memesan dan menyimpan persediaan, akar dari dua kali biaya pesan kali permintaan dibagi biaya simpan.') },
  ],

  howTo: [
    {
      name: L('How to solve an applied optimization problem', 'Cara menyelesaikan soal optimisasi terapan'),
      description: L('Turn the description into a function of one variable on a domain, and test the critical points and the endpoints.', 'Ubah uraian menjadi fungsi satu peubah pada suatu domain, dan uji titik kritis dan ujungnya.'),
      steps: [
        { name: L('Read and draw', 'Baca dan gambar'), text: L('Find what is given and which quantity is to be maximized or minimized, and draw a picture with the variables named.', 'Cari yang diketahui dan besaran mana yang dimaksimumkan atau diminimumkan, dan gambar dengan peubah diberi nama.') },
        { name: L('Write the relations', 'Tulis hubungannya'), text: L('List every relation between the variables as an equation, including the constraint.', 'Tulis setiap hubungan antarpeubah sebagai persamaan, termasuk kendalanya.') },
        { name: L('Make one variable', 'Jadikan satu peubah'), text: L('Use the constraint to write the quantity as a function of one variable and find the domain that the situation allows.', 'Pakai kendala untuk menulis besaran itu sebagai fungsi satu peubah dan tentukan domain yang diizinkan keadaannya.') },
        { name: L('Test and answer', 'Uji dan jawab'), text: L('Find the critical points, compare them with the endpoints or the limits at the open ends, and answer with the quantity the problem asked for, with its units.', 'Cari titik kritis, bandingkan dengan ujung atau limit di ujung terbuka, dan jawab dengan besaran yang ditanyakan soal, beserta satuannya.') },
      ],
    },
    {
      name: L('How to confirm that a critical point is the absolute minimum on an open interval', 'Cara memastikan titik kritis adalah minimum mutlak pada selang terbuka'),
      description: L('Use the shape of the function, since there is no endpoint to compare.', 'Pakai bentuk fungsi, karena tidak ada ujung untuk dibandingkan.'),
      steps: [
        { name: L('Find the critical point', 'Cari titik kritis'), text: L('Solve the derivative equal to zero inside the domain and discard the roots outside it.', 'Selesaikan turunan sama dengan nol di dalam domain dan buang akar di luarnya.') },
        { name: L('Look at the second derivative', 'Lihat turunan kedua'), text: L('If the second derivative is positive on the whole domain, the graph is concave up and the point is the absolute minimum.', 'Jika turunan kedua positif di seluruh domain, grafiknya cekung ke atas dan titik itu adalah minimum mutlak.') },
        { name: L('Otherwise use the first derivative', 'Jika tidak pakai turunan pertama'), text: L('Check that the derivative is negative on the left and positive on the right of the point.', 'Periksa bahwa turunannya negatif di kiri dan positif di kanan titik itu.') },
        { name: L('Check the open ends', 'Periksa ujung terbuka'), text: L('Compute the limits at the open ends: if they are larger than the critical value, it is the absolute minimum.', 'Hitung limit di ujung terbuka: jika lebih besar daripada nilai kritis, itulah minimum mutlak.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is an optimization problem in calculus?', 'Apa itu soal optimisasi dalam kalkulus?'),
      a: L(
        'It is a problem that asks for the largest or smallest value of some quantity, such as the greatest area or the least cost. You write the quantity as a function of one variable, find its domain, and use the derivative to find where it is largest or smallest.',
        'Itu adalah soal yang menanyakan nilai terbesar atau terkecil suatu besaran, seperti luas terbesar atau biaya terkecil. Kamu menulis besaran itu sebagai fungsi satu peubah, mencari domainnya, dan memakai turunan untuk mencari tempat ia terbesar atau terkecil.',
      ),
    },
    {
      q: L('What are the steps to solve an optimization problem?', 'Apa langkah menyelesaikan soal optimisasi?'),
      a: L(
        'Read the problem, introduce variables and write the relations, express the quantity as a function of one variable with its domain, and then test the critical points and the endpoints. Finally, answer in the words of the problem, with units.',
        'Baca soal, perkenalkan peubah dan tulis hubungannya, nyatakan besaran itu sebagai fungsi satu peubah beserta domainnya, lalu uji titik kritis dan ujungnya. Terakhir, jawab dengan kata-kata soal, beserta satuannya.',
      ),
    },
    {
      q: L('Why do you have to check the endpoints?', 'Mengapa ujung harus diperiksa?'),
      a: L(
        'On a closed domain the best value can be at an endpoint, where the derivative need not be zero. Only comparing the critical points with the endpoints guarantees the right answer, as the function x cubed minus 3x on minus 2 to 3 shows.',
        'Pada domain tertutup nilai terbaik dapat berada di ujung, tempat turunan tidak harus nol. Hanya membandingkan titik kritis dengan ujung yang menjamin jawaban yang benar, seperti ditunjukkan fungsi x pangkat tiga dikurangi 3x pada selang minus 2 sampai 3.',
      ),
    },
    {
      q: L('How do you know a critical point is a maximum or a minimum?', 'Bagaimana mengetahui titik kritis adalah maksimum atau minimum?'),
      a: L(
        'Compare it with the endpoints on a closed domain. On an open domain use the second derivative: positive on the whole domain means a minimum, negative means a maximum. You can also check that the first derivative changes sign, or look at the limits at the ends.',
        'Bandingkan dengan ujung pada domain tertutup. Pada domain terbuka pakai turunan kedua: positif di seluruh domain berarti minimum, negatif berarti maksimum. Kamu juga dapat memeriksa bahwa turunan pertama berganti tanda, atau melihat limit di ujungnya.',
      ),
    },
    {
      q: L('What shape of can uses the least metal?', 'Bentuk kaleng apa yang memakai logam paling sedikit?'),
      a: L(
        'For a closed cylindrical can of a given volume, the height equals the diameter, so h is twice r. With no lid the height equals the radius. The result does not depend on the volume, which is why the ratio is the same for every size.',
        'Untuk kaleng tabung tertutup dengan volume tertentu, tingginya sama dengan diameter, jadi h dua kali r. Tanpa tutup, tingginya sama dengan jari-jari. Hasilnya tidak bergantung pada volume, itulah sebabnya perbandingannya sama untuk setiap ukuran.',
      ),
    },
    {
      q: L('Why does profit peak where marginal revenue equals marginal cost?', 'Mengapa laba memuncak ketika pendapatan marjinal sama dengan biaya marjinal?'),
      a: L(
        'Profit is revenue minus cost, so its derivative is marginal revenue minus marginal cost. At a maximum that derivative is zero, so the two marginals are equal. Before that point one more item adds more revenue than cost, and after it adds less.',
        'Laba adalah pendapatan dikurangi biaya, sehingga turunannya adalah pendapatan marjinal dikurangi biaya marjinal. Di maksimum turunan itu nol, sehingga kedua marjinal sama. Sebelum titik itu satu barang lagi menambah pendapatan lebih besar daripada biaya, dan setelahnya lebih kecil.',
      ),
    },
    {
      q: L('What is the Wilson lot size or economic order quantity?', 'Apa itu ukuran lot Wilson atau jumlah pesanan ekonomis?'),
      a: L(
        'It is the order size that minimizes the average cost of ordering and storing stock. It equals the square root of twice the ordering cost times the demand, divided by the holding cost per item. At that size the ordering and storing costs are equal.',
        'Itu adalah ukuran pesanan yang meminimumkan biaya rata-rata memesan dan menyimpan persediaan. Nilainya sama dengan akar dari dua kali biaya pesan kali permintaan, dibagi biaya simpan per barang. Pada ukuran itu biaya memesan dan menyimpan sama besar.',
      ),
    },
    {
      q: L('How does Fermat’s principle give Snell’s law?', 'Bagaimana prinsip Fermat memberi hukum Snell?'),
      a: L(
        'Write the time of a ray from A to B through a point on the boundary, and set the derivative with respect to that point equal to zero. The result says that the sine of the angle divided by the speed is the same on both sides, which is Snell’s law.',
        'Tulis waktu sinar dari A ke B melalui suatu titik pada batas, dan setel turunannya terhadap titik itu sama dengan nol. Hasilnya menyatakan bahwa sinus sudut dibagi kecepatan sama di kedua sisi, yaitu hukum Snell.',
      ),
    },
  ],

  references: [
    { title: "Thomas' Calculus: Early Transcendentals in SI Units (15th ed.), Section 4.6: Applied Optimization", author: 'Joel Hass, Christopher Heil, Maurice D. Weir et al.', year: 2023, source: 'Pearson' },
    { title: 'Calculus (8th ed.), section 4.7: Optimization Problems', author: 'James Stewart', year: 2015, source: 'Cengage Learning' },
    { title: 'Methodus ad disquirendam maximam et minimam', author: 'Pierre de Fermat', year: 1636, source: 'Oeuvres de Fermat, Paris' },
    { title: 'How Many Parts to Make at Once', author: 'Ford W. Harris', year: 1913, source: 'Factory, The Magazine of Management' },
  ],

  related: ['extreme-values-on-closed-intervals', 'concavity-and-curve-sketching', 'monotonic-functions-and-the-first-derivative-test', 'the-derivative-as-a-rate-of-change'],
}
