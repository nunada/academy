import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './the-mean-value-theorem.meta'

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
    T`**If $f$ is continuous on $[a,b]$ and differentiable on $(a,b)$, the Mean Value Theorem says that some point $c$ in $(a,b)$ has $f'(c)=\frac{f(b)-f(a)}{b-a}$: the tangent there is parallel to the secant through the two ends.** Somewhere the instantaneous rate of change equals the average rate over the whole interval. Rolle's Theorem is the case $f(a)=f(b)$, where $f'(c)=0$.`,
    T`**Jika $f$ kontinu pada $[a,b]$ dan terdiferensialkan pada $(a,b)$, Teorema Nilai Rata-rata menyatakan bahwa ada titik $c$ di $(a,b)$ dengan $f'(c)=\frac{f(b)-f(a)}{b-a}$: garis singgung di sana sejajar dengan tali busur melalui kedua ujung.** Di suatu tempat laju perubahan sesaat sama dengan laju rata-rata sepanjang selang. Teorema Rolle adalah kasus $f(a)=f(b)$, tempat $f'(c)=0$.`,
  ),

  keyPoints: [
    L(
      T`Rolle's Theorem: if $f$ is continuous on $[a,b]$, differentiable on $(a,b)$ and $f(a)=f(b)$, then $f'(c)=0$ for some $c$ in $(a,b)$; the graph has a horizontal tangent between the two equal values.`,
      T`Teorema Rolle: jika $f$ kontinu pada $[a,b]$, terdiferensialkan pada $(a,b)$, dan $f(a)=f(b)$, maka $f'(c)=0$ untuk suatu $c$ di $(a,b)$; grafik memiliki garis singgung mendatar di antara dua nilai yang sama.`,
    ),
    L(
      T`Mean Value Theorem: under the same two hypotheses, $f'(c)=\frac{f(b)-f(a)}{b-a}$ for some $c$ in $(a,b)$; it is proved by applying Rolle's Theorem to the vertical gap between the graph and the secant.`,
      T`Teorema Nilai Rata-rata: dengan dua syarat yang sama, $f'(c)=\frac{f(b)-f(a)}{b-a}$ untuk suatu $c$ di $(a,b)$; teorema ini dibuktikan dengan menerapkan Teorema Rolle pada selisih tegak antara grafik dan tali busur.`,
    ),
    L(
      T`Both hypotheses matter, and differentiability is needed only inside the interval, not at the ends: $\sqrt{1-x^2}$ on $[-1,1]$ qualifies, while $|x|$ on $[-1,1]$ has a corner and no horizontal tangent.`,
      T`Kedua syarat penting, dan keterdiferensialan hanya diperlukan di dalam selang, bukan di ujungnya: $\sqrt{1-x^2}$ pada $[-1,1]$ memenuhi, sedangkan $|x|$ pada $[-1,1]$ memiliki sudut dan tidak punya garis singgung mendatar.`,
    ),
    L(
      T`Average speed is an instantaneous speed somewhere: a car that goes $176$ m in $8$ s must read $22$ m/s at some instant, and a truck that covers $230$ km in $2$ hours on a $100$ km/h road was speeding.`,
      T`Kecepatan rata-rata adalah kecepatan sesaat di suatu saat: mobil yang menempuh $176$ m dalam $8$ detik pasti menunjukkan $22$ m/detik pada suatu saat, dan truk yang menempuh $230$ km dalam $2$ jam di jalan berbatas $100$ km/jam pasti melanggar.`,
    ),
    L(
      T`Corollaries: if $f'=0$ on an interval then $f$ is constant there, and if $f'=g'$ then $f=g+C$; so every antiderivative of a function is one of them plus a constant, and one point fixes $C$.`,
      T`Akibatnya: jika $f'=0$ pada suatu selang maka $f$ konstan di sana, dan jika $f'=g'$ maka $f=g+C$; jadi setiap antiturunan suatu fungsi adalah salah satunya ditambah konstanta, dan satu titik menetapkan $C$.`,
    ),
    L(
      T`Uses: an equation has at most one more real solution than its derivative has zeros, and a bound $m\le f'\le M$ gives $m(b-a)\le f(b)-f(a)\le M(b-a)$.`,
      T`Kegunaan: persamaan memiliki paling banyak satu penyelesaian real lebih banyak daripada nol turunannya, dan batas $m\le f'\le M$ memberi $m(b-a)\le f(b)-f(a)\le M(b-a)$.`,
    ),
  ],

  sections: [
    /* ----------------------------------------------------------------------------- Rolle */
    {
      id: 'rolle',
      heading: L('What is Rolle’s Theorem?', 'Apa itu Teorema Rolle?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Rolle's Theorem says that if $y=f(x)$ is continuous on the closed interval $[a,b]$, differentiable at every point of $(a,b)$, and $f(a)=f(b)$, then there is at least one number $c$ in $(a,b)$ at which $f'(c)=0$.** As the graph suggests, a differentiable curve that crosses a horizontal line at two points has a horizontal tangent somewhere between them. There may be just one such point, or several.

*Proof.* Because $f$ is continuous, the [Extreme Value Theorem](article:extreme-values-on-closed-intervals#extreme-value-theorem) gives an absolute maximum and an absolute minimum on $[a,b]$, and each is taken at an interior point where $f'$ is zero, at an interior point where $f'$ does not exist, or at an endpoint. The hypothesis rules out the second possibility. If the maximum or the minimum is at an interior point $c$, then $f'(c)=0$ by the [First Derivative Theorem](article:extreme-values-on-closed-intervals#critical-points), and $c$ is the point we want. If both are at the endpoints, then since $f(a)=f(b)$ the largest and the smallest value are equal, so $f$ is constant, $f'(x)=0$ everywhere inside, and $c$ can be any point of $(a,b)$. ∎

**The hypotheses are essential.** If they fail at even one point, the graph may have no horizontal tangent at all:
- *discontinuous at an endpoint*: $f(x)=x$ for $0\le x<1$ and $f(1)=0$ has $f(0)=f(1)=0$, but its slope is $1$ everywhere inside;
- *discontinuous at an interior point*: a graph that jumps over the gap leaves both pieces sloping the same way;
- *continuous but not differentiable at an interior point*: $|x|$ on $[-1,1]$ has $f(-1)=f(1)$ and a corner at $0$, with slopes $-1$ and then $1$, never $0$; $x^{2/3}$ on $[-1,1]$ has a cusp at $0$.

The opposite also needs care: a failed hypothesis does not make the conclusion false, only unpromised. Choose a case below and see which hypothesis it breaks.`,
            T`**Teorema Rolle menyatakan bahwa jika $y=f(x)$ kontinu pada selang tertutup $[a,b]$, terdiferensialkan di setiap titik $(a,b)$, dan $f(a)=f(b)$, maka ada paling sedikit satu bilangan $c$ di $(a,b)$ tempat $f'(c)=0$.** Seperti ditunjukkan grafiknya, kurva terdiferensialkan yang memotong garis mendatar di dua titik memiliki garis singgung mendatar di suatu tempat di antara keduanya. Titik seperti itu bisa hanya satu, bisa juga beberapa.

*Bukti.* Karena $f$ kontinu, [Teorema Nilai Ekstrem](article:extreme-values-on-closed-intervals#extreme-value-theorem) memberi maksimum mutlak dan minimum mutlak pada $[a,b]$, dan masing-masing dicapai di titik dalam tempat $f'$ nol, di titik dalam tempat $f'$ tidak ada, atau di ujung selang. Syarat teorema menyingkirkan kemungkinan kedua. Jika maksimum atau minimum ada di titik dalam $c$, maka $f'(c)=0$ menurut [Teorema Turunan Pertama](article:extreme-values-on-closed-intervals#critical-points), dan $c$ adalah titik yang kita cari. Jika keduanya di ujung selang, maka karena $f(a)=f(b)$ nilai terbesar dan terkecil sama, sehingga $f$ konstan, $f'(x)=0$ di seluruh bagian dalam, dan $c$ boleh titik mana pun di $(a,b)$. ∎

**Syaratnya mutlak diperlukan.** Jika syarat gagal di satu titik saja, grafik mungkin tidak memiliki garis singgung mendatar sama sekali:
- *tidak kontinu di ujung*: $f(x)=x$ untuk $0\le x<1$ dan $f(1)=0$ memiliki $f(0)=f(1)=0$, tetapi gradiennya $1$ di mana-mana di dalam;
- *tidak kontinu di titik dalam*: grafik yang melompati celah meninggalkan kedua bagiannya miring ke arah yang sama;
- *kontinu tetapi tidak terdiferensialkan di titik dalam*: $|x|$ pada $[-1,1]$ memiliki $f(-1)=f(1)$ dan sudut di $0$, dengan gradien $-1$ lalu $1$, tidak pernah $0$; $x^{2/3}$ pada $[-1,1]$ memiliki titik puncak di $0$.

Kebalikannya juga perlu hati-hati: syarat yang gagal tidak membuat kesimpulan salah, hanya tidak dijanjikan. Pilih satu kasus di bawah dan lihat syarat mana yang dilanggarnya.`,
          ),
        },
        { kind: 'widget', name: 'rollecases' },
      ],
    },

    /* ---------------------------------------------------------------------------- roots */
    {
      id: 'roots',
      heading: L('How does Rolle’s Theorem count the solutions of an equation?', 'Bagaimana Teorema Rolle menghitung penyelesaian suatu persamaan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Rolle's Theorem turns a statement about zeros of $f$ into a statement about zeros of $f'$: between any two zeros of $f$ there is a zero of $f'$.** So if $f'$ has $k$ zeros, $f$ cannot have more than $k+1$.

**Example 1.** Show that $x^3+3x+1=0$ has exactly one real solution. Let $f(x)=x^3+3x+1$, which is continuous. Since $f(-1)=-3$ and $f(0)=1$, the Intermediate Value Theorem says the graph crosses the $x$-axis somewhere in $(-1,0)$, so there is *at least* one solution. Now suppose there were two zeros $x=a$ and $x=b$. Rolle's Theorem would give a point $c$ between them with $f'(c)=0$. But
$$f'(x)=3x^2+3$$
is never zero, because it is always at least $3$. So there cannot be two zeros, and there is *exactly* one.

The same reasoning counts roots in general. A cubic has a quadratic derivative with at most two zeros, so a cubic has at most three real zeros. For a polynomial with $n$ different real zeros, every one of the $n-1$ gaps between neighbours holds a zero of $f'$, and $f'$ has degree $n-1$, so those are all of its zeros: exactly one in each gap. Choose the zeros below and see it happen; the point with the horizontal tangent is always caught between two zeros.`,
            T`**Teorema Rolle mengubah pernyataan tentang nol $f$ menjadi pernyataan tentang nol $f'$: di antara dua nol $f$ ada nol $f'$.** Jadi jika $f'$ memiliki $k$ nol, $f$ tidak dapat memiliki lebih dari $k+1$.

**Contoh 1.** Tunjukkan bahwa $x^3+3x+1=0$ memiliki tepat satu penyelesaian real. Misalkan $f(x)=x^3+3x+1$, yang kontinu. Karena $f(-1)=-3$ dan $f(0)=1$, Teorema Nilai Antara menyatakan grafik memotong sumbu $x$ di suatu tempat dalam $(-1,0)$, sehingga ada *paling sedikit* satu penyelesaian. Sekarang andaikan ada dua nol $x=a$ dan $x=b$. Teorema Rolle akan memberi titik $c$ di antara keduanya dengan $f'(c)=0$. Tetapi
$$f'(x)=3x^2+3$$
tidak pernah nol, karena selalu paling sedikit $3$. Jadi tidak mungkin ada dua nol, dan ada *tepat* satu.

Penalaran yang sama menghitung akar secara umum. Polinom kubik memiliki turunan kuadrat dengan paling banyak dua nol, sehingga polinom kubik memiliki paling banyak tiga nol real. Untuk polinom dengan $n$ nol real berbeda, setiap dari $n-1$ celah antara nol bertetangga memuat nol $f'$, dan $f'$ berderajat $n-1$, sehingga itulah semua nolnya: tepat satu di setiap celah. Pilih nol di bawah dan lihat hal itu terjadi; titik dengan garis singgung mendatar selalu terjepit di antara dua nol.`,
          ),
        },
        { kind: 'widget', name: 'rolleroots' },
      ],
    },

    /* ---------------------------------------------------------------------------- the theorem */
    {
      id: 'mean-value-theorem',
      heading: L('What does the Mean Value Theorem say?', 'Apa isi Teorema Nilai Rata-rata?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The Mean Value Theorem is a slanted version of Rolle's Theorem: if $y=f(x)$ is continuous on $[a,b]$ and differentiable on $(a,b)$, then there is at least one point $c$ in $(a,b)$ at which**
$$\frac{f(b)-f(a)}{b-a}=f'(c).$$
Geometrically, the left side is the slope of the secant line through $A(a,f(a))$ and $B(b,f(b))$, and the right side is the slope of the tangent at $c$: somewhere between $a$ and $b$ the curve has a tangent line parallel to the secant. When $f(a)=f(b)$ the secant is horizontal and this is Rolle's Theorem.

*Proof.* The secant line is the graph of
$$g(x)=f(a)+\frac{f(b)-f(a)}{b-a}(x-a).$$
The vertical distance between the graph of $f$ and the secant is
$$h(x)=f(x)-g(x)$$
$$h(x)=f(x)-f(a)-\frac{f(b)-f(a)}{b-a}(x-a).$$
The function $h$ is continuous on $[a,b]$ and differentiable on $(a,b)$ because $f$ and $g$ are, and $h(a)=h(b)=0$ because both graphs pass through $A$ and $B$. So Rolle's Theorem gives a point $c$ in $(a,b)$ with $h'(c)=0$. Differentiating $h$ and putting $x=c$:
$$h'(c)=f'(c)-\frac{f(b)-f(a)}{b-a}=0,$$
which is the equation of the theorem. ∎

**What it needs, and what it does not.** Continuity on the closed interval and differentiability inside are all that the proof used. In particular $f$ need not be differentiable at $a$ or at $b$: one-sided continuity is enough. The function $f(x)=\sqrt{1-x^2}$ on $[-1,1]$ has vertical tangents at both ends, yet it satisfies the theorem, with $c=0$.

**What it does not say.** The theorem does not say there is only one point, and it gives no formula for $c$; it says only that at least one exists. Type a function and an interval below, or pick an example. The orange line is the secant, the green lines are the tangents at the points the theorem promises, and the two cases where a hypothesis fails show what the theorem does not cover.`,
            T`**Teorema Nilai Rata-rata adalah versi miring dari Teorema Rolle: jika $y=f(x)$ kontinu pada $[a,b]$ dan terdiferensialkan pada $(a,b)$, maka ada paling sedikit satu titik $c$ di $(a,b)$ tempat**
$$\frac{f(b)-f(a)}{b-a}=f'(c).$$
Secara geometri, ruas kiri adalah gradien tali busur melalui $A(a,f(a))$ dan $B(b,f(b))$, dan ruas kanan adalah gradien garis singgung di $c$: di suatu tempat antara $a$ dan $b$ kurva memiliki garis singgung yang sejajar dengan tali busur. Ketika $f(a)=f(b)$ tali busur mendatar dan ini adalah Teorema Rolle.

*Bukti.* Tali busur adalah grafik dari
$$g(x)=f(a)+\frac{f(b)-f(a)}{b-a}(x-a).$$
Jarak tegak antara grafik $f$ dan tali busur adalah
$$h(x)=f(x)-g(x)$$
$$h(x)=f(x)-f(a)-\frac{f(b)-f(a)}{b-a}(x-a).$$
Fungsi $h$ kontinu pada $[a,b]$ dan terdiferensialkan pada $(a,b)$ karena $f$ dan $g$ demikian, dan $h(a)=h(b)=0$ karena kedua grafik melalui $A$ dan $B$. Jadi Teorema Rolle memberi titik $c$ di $(a,b)$ dengan $h'(c)=0$. Dengan menurunkan $h$ dan mengambil $x=c$:
$$h'(c)=f'(c)-\frac{f(b)-f(a)}{b-a}=0,$$
yang merupakan persamaan pada teorema. ∎

**Apa yang dibutuhkan, dan apa yang tidak.** Kekontinuan pada selang tertutup dan keterdiferensialan di dalam adalah semua yang dipakai bukti. Khususnya $f$ tidak harus terdiferensialkan di $a$ atau di $b$: kekontinuan satu sisi sudah cukup. Fungsi $f(x)=\sqrt{1-x^2}$ pada $[-1,1]$ memiliki garis singgung tegak di kedua ujung, namun memenuhi teorema, dengan $c=0$.

**Apa yang tidak dikatakan.** Teorema ini tidak menyatakan hanya ada satu titik, dan tidak memberi rumus untuk $c$; ia hanya menyatakan paling sedikit satu ada. Ketik fungsi dan selang di bawah, atau pilih contoh. Garis oranye adalah tali busur, garis hijau adalah garis singgung di titik yang dijanjikan teorema, dan dua kasus tempat syaratnya gagal menunjukkan apa yang tidak dicakup teorema.`,
          ),
        },
        { kind: 'widget', name: 'mvtexplorer' },
      ],
    },

    /* -------------------------------------------------------------------------- finding c */
    {
      id: 'finding-c',
      heading: L('How do you find the point c?', 'Bagaimana mencari titik c?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To find $c$, compute the slope of the secant $m=\frac{f(b)-f(a)}{b-a}$, solve $f'(c)=m$, and keep the solutions that lie inside the open interval $(a,b)$.** The theorem guarantees that the list is not empty when the hypotheses hold.

**Example 2.** $f(x)=x^2$ on $[0,2]$. The slope is $\frac{4-0}{2-0}=2$ and $f'(c)=2c=2$, so $c=1$.

**Example 3.** $f(x)=x^2+2x-1$ on $[0,1]$. The slope is $\frac{2-(-1)}{1-0}=3$, and $f'(c)=2c+2=3$ gives $c=\frac12$.

**Example 4.** $f(x)=x^{2/3}$ on $[0,1]$. The slope is $1$ and $f'(c)=\frac23c^{-1/3}=1$ gives $c^{1/3}=\frac23$, so $c=\frac{8}{27}$. The cusp is at $0$, an endpoint, so $f$ is differentiable inside and the theorem applies.

**Example 5.** $f(x)=x^3-x^2$ on $[-1,2]$. The slope is $\frac{4-(-2)}{3}=2$, and $f'(c)=3c^2-2c=2$ gives
$$3c^2-2c-2=0\qquad c=\frac{1\pm\sqrt7}{3}.$$
Both $c\approx-0.549$ and $c\approx1.215$ lie in $(-1,2)$, so there are two points. The theorem said "at least one".

**The two means.** For $f(x)=\frac1x$ on an interval $[a,b]$ of positive numbers, the slope is $-\frac1{ab}$ and $f'(c)=-\frac1{c^2}$, so $c=\sqrt{ab}$, the *geometric mean* of $a$ and $b$. For $f(x)=x^2$ it is $2c=a+b$, so $c=\frac{a+b}{2}$, the *arithmetic mean*. Indeed for every quadratic $px^2+qx+r$ the slope of the secant is $p(a+b)+q$ and $f'(c)=2pc+q$, so $c$ is always the midpoint, and it is the only such point.

**When c cannot be written down.** For $f(x)=xe^x$ on $[0,1]$ the slope is $e$ and the equation is $(1+c)e^c=e$. It has exactly one solution in $(0,1)$, but no elementary formula; a computer finds $c\approx0.5571$. The theorem is valuable because it promises $c$ without needing to compute it.`,
            T`**Untuk mencari $c$, hitung gradien tali busur $m=\frac{f(b)-f(a)}{b-a}$, selesaikan $f'(c)=m$, dan simpan penyelesaian yang berada di dalam selang terbuka $(a,b)$.** Teorema menjamin daftarnya tidak kosong ketika syaratnya terpenuhi.

**Contoh 2.** $f(x)=x^2$ pada $[0,2]$. Gradiennya $\frac{4-0}{2-0}=2$ dan $f'(c)=2c=2$, sehingga $c=1$.

**Contoh 3.** $f(x)=x^2+2x-1$ pada $[0,1]$. Gradiennya $\frac{2-(-1)}{1-0}=3$, dan $f'(c)=2c+2=3$ memberi $c=\frac12$.

**Contoh 4.** $f(x)=x^{2/3}$ pada $[0,1]$. Gradiennya $1$ dan $f'(c)=\frac23c^{-1/3}=1$ memberi $c^{1/3}=\frac23$, sehingga $c=\frac{8}{27}$. Titik puncak ada di $0$, sebuah ujung selang, sehingga $f$ terdiferensialkan di dalam dan teorema berlaku.

**Contoh 5.** $f(x)=x^3-x^2$ pada $[-1,2]$. Gradiennya $\frac{4-(-2)}{3}=2$, dan $f'(c)=3c^2-2c=2$ memberi
$$3c^2-2c-2=0\qquad c=\frac{1\pm\sqrt7}{3}.$$
Baik $c\approx-0{,}549$ maupun $c\approx1{,}215$ berada di $(-1,2)$, sehingga ada dua titik. Teorema menyatakan "paling sedikit satu".

**Dua rata-rata.** Untuk $f(x)=\frac1x$ pada selang $[a,b]$ bilangan positif, gradiennya $-\frac1{ab}$ dan $f'(c)=-\frac1{c^2}$, sehingga $c=\sqrt{ab}$, *rata-rata geometri* $a$ dan $b$. Untuk $f(x)=x^2$ menjadi $2c=a+b$, sehingga $c=\frac{a+b}{2}$, *rata-rata aritmetika*. Memang untuk setiap kuadrat $px^2+qx+r$ gradien tali busur adalah $p(a+b)+q$ dan $f'(c)=2pc+q$, sehingga $c$ selalu titik tengah, dan itulah satu-satunya titik seperti itu.

**Ketika c tidak dapat dituliskan.** Untuk $f(x)=xe^x$ pada $[0,1]$ gradiennya $e$ dan persamaannya $(1+c)e^c=e$. Persamaan ini memiliki tepat satu penyelesaian di $(0,1)$, tetapi tidak ada rumus elementernya; komputer menemukan $c\approx0{,}5571$. Teorema ini berharga karena menjanjikan $c$ tanpa perlu menghitungnya.`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------------- speed */
    {
      id: 'speed',
      heading: L('What does the theorem say about speed and average rates?', 'Apa kata teorema tentang kecepatan dan laju rata-rata?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Read as a statement about rates, the Mean Value Theorem says that the average rate of change over an interval is the instantaneous rate at some interior point.** The number $\frac{f(b)-f(a)}{b-a}$ is the average change of $f$ over $[a,b]$, and $f'(c)$ is an instantaneous change; the theorem says they meet. It applies to anything whose rate is a derivative, as in the [motion along a line](article:the-derivative-as-a-rate-of-change#motion-along-a-line) of the rates article.

**Example 6.** A car accelerating from rest takes $8$ s to go $176$ m. Its average velocity is $\frac{176}{8}=22$ m/s, so at some moment during the acceleration the speedometer must read exactly $22$ m/s, which is $22\times3.6=79.2$ km/h. If the car has $s=2.75t^2$, which does match $176$ m at $t=8$, then $v=s'=5.5t$ equals $22$ at $t=4$ s.

**A speeding ticket.** A truck driver hands in a tollbooth ticket showing that she covered $230$ km of a toll road with a $100$ km/h limit in $2$ hours. The average speed is $115$ km/h, so by the theorem the truck was doing exactly $115$ km/h at some instant, above the limit: a citation is justified without anyone having seen her speed.

**More of the same.**
- A thermometer taken from a freezer at $-19$ °C into boiling water at $100$ °C and reading it after $14$ s rose $\frac{119}{14}=8.5$ °C per second on average, so at some moment the mercury was rising at exactly $8.5$ °C/s.
- A trireme that covered $184$ sea miles in $24$ hours averaged $7.67$ knots, so at some point its speed exceeded $7.5$ knots.
- A marathoner who ran $42$ km in $2.2$ hours averaged $19.09$ km/h. Her speed was $19.09$ km/h at some instant, by the theorem. It starts at $0$ and ends at $0$, and a speed that changes continuously cannot skip values (the Intermediate Value Theorem), so it passed $18$ km/h once on the way up and again on the way down: at least twice.

**What it does not say.** The theorem promises *an* instant, not that the speed stayed at the average, and it does not say when. It is an existence statement, and that is exactly what a proof or a legal argument needs.`,
            T`**Dibaca sebagai pernyataan tentang laju, Teorema Nilai Rata-rata menyatakan bahwa laju perubahan rata-rata pada suatu selang adalah laju sesaat di suatu titik dalam.** Bilangan $\frac{f(b)-f(a)}{b-a}$ adalah perubahan rata-rata $f$ pada $[a,b]$, dan $f'(c)$ adalah perubahan sesaat; teorema menyatakan keduanya bertemu. Teorema ini berlaku untuk apa pun yang lajunya adalah turunan, seperti pada [gerak sepanjang garis](article:the-derivative-as-a-rate-of-change#motion-along-a-line) di artikel laju perubahan.

**Contoh 6.** Mobil yang berakselerasi dari diam membutuhkan $8$ detik untuk menempuh $176$ m. Kecepatan rata-ratanya $\frac{176}{8}=22$ m/detik, sehingga pada suatu saat selama akselerasi spidometer pasti menunjukkan tepat $22$ m/detik, yaitu $22\times3{,}6=79{,}2$ km/jam. Jika mobil itu memiliki $s=2{,}75t^2$, yang memang cocok dengan $176$ m di $t=8$, maka $v=s'=5{,}5t$ sama dengan $22$ di $t=4$ detik.

**Surat tilang.** Seorang pengemudi truk menyerahkan karcis di gerbang tol yang menunjukkan ia menempuh $230$ km jalan tol berbatas $100$ km/jam dalam $2$ jam. Kecepatan rata-ratanya $115$ km/jam, sehingga menurut teorema truk itu melaju tepat $115$ km/jam pada suatu saat, di atas batas: tilang dibenarkan tanpa ada yang melihat kecepatannya.

**Contoh serupa.**
- Termometer yang dipindahkan dari pembeku bersuhu $-19$ °C ke air mendidih $100$ °C dan dibaca setelah $14$ detik naik rata-rata $\frac{119}{14}=8{,}5$ °C per detik, sehingga pada suatu saat air raksa naik tepat $8{,}5$ °C/detik.
- Kapal trireme yang menempuh $184$ mil laut dalam $24$ jam rata-rata melaju $7{,}67$ knot, sehingga pada suatu titik kecepatannya melebihi $7{,}5$ knot.
- Pelari maraton yang menempuh $42$ km dalam $2{,}2$ jam rata-rata melaju $19{,}09$ km/jam. Kecepatannya $19{,}09$ km/jam pada suatu saat, menurut teorema. Ia mulai dari $0$ dan berakhir di $0$, dan kecepatan yang berubah kontinu tidak dapat melompati nilai (Teorema Nilai Antara), sehingga ia melewati $18$ km/jam sekali saat naik dan sekali lagi saat turun: paling sedikit dua kali.

**Apa yang tidak dikatakan.** Teorema menjanjikan *suatu* saat, bukan bahwa kecepatan bertahan di rata-rata, dan tidak menyatakan kapan. Ini pernyataan keberadaan, dan itulah yang dibutuhkan bukti atau argumen hukum.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------------- corollaries */
    {
      id: 'corollaries',
      heading: L('What follows when two functions have the same derivative?', 'Apa akibatnya jika dua fungsi memiliki turunan yang sama?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The first question the theorem answers is which functions have a zero derivative: only constant ones.** *Corollary 1: if $f'(x)=0$ at every point of an open interval $(a,b)$, then $f(x)=C$ for all $x$ in $(a,b)$, where $C$ is a constant.*

*Proof.* Take any two points $x_1<x_2$ in $(a,b)$. The function $f$ is differentiable on $[x_1,x_2]$, hence continuous, so the theorem gives a point $c$ between them with
$$\frac{f(x_2)-f(x_1)}{x_2-x_1}=f'(c)=0.$$
Then $f(x_2)-f(x_1)=0$ and $f(x_1)=f(x_2)$. Since $x_1$ and $x_2$ were arbitrary, $f$ has one value on the whole interval. ∎

**The second question is how two functions with the same derivative are related.** *Corollary 2: if $f'(x)=g'(x)$ at every point of an open interval $(a,b)$, then there is a constant $C$ with $f(x)=g(x)+C$ for all $x$ in $(a,b)$.* Apply Corollary 1 to $h=f-g$, whose derivative is $h'=f'-g'=0$ on $(a,b)$, so $h=C$ there. Both corollaries remain true for infinite intervals. Geometrically, the graphs of functions with the same derivative differ only by a vertical shift, as the parabolas $y=x^2+C$ do for the derivative $2x$.

This is what makes *antiderivatives* well behaved. Once one function $g$ has the derivative $f'$ you want, *every* such function is $g(x)+C$, and a single point of the graph fixes $C$.

**Example 7.** Find the function $f(x)$ whose derivative is $\sin x$ and whose graph passes through $(0,2)$. The function $g(x)=-\cos x$ has $g'(x)=\sin x$, so $f(x)=-\cos x+C$. From $f(0)=-\cos0+C=2$ we get $C=3$, and $f(x)=-\cos x+3$.

**Example 8, free fall.** A body falls from rest with acceleration $9.8$ m/s², and the position $s$ is measured downward from the rest position. The velocity $v$ has derivative $9.8$, and so does $9.8t$, hence $v(t)=9.8t+C$, and $v(0)=0$ gives $C=0$: $v(t)=9.8t$. The position $s$ has derivative $9.8t$, and so does $4.9t^2$, hence $s(t)=4.9t^2+C$, and $s(0)=0$ gives $s(t)=4.9t^2$, until the body hits the ground. This is the same fall as in the [free fall and throws](article:the-derivative-as-a-rate-of-change#free-fall-and-throws) of the rates article, worked out backward from the acceleration.

Pick a derivative below and move the point the graph must pass through. The other curves are the same graph shifted, and only one of them goes through the point.`,
            T`**Pertanyaan pertama yang dijawab teorema ini adalah fungsi mana yang berturunan nol: hanya yang konstan.** *Akibat 1: jika $f'(x)=0$ di setiap titik pada selang terbuka $(a,b)$, maka $f(x)=C$ untuk semua $x$ di $(a,b)$, dengan $C$ konstanta.*

*Bukti.* Ambil dua titik mana pun $x_1<x_2$ di $(a,b)$. Fungsi $f$ terdiferensialkan pada $[x_1,x_2]$, sehingga kontinu, maka teorema memberi titik $c$ di antara keduanya dengan
$$\frac{f(x_2)-f(x_1)}{x_2-x_1}=f'(c)=0.$$
Maka $f(x_2)-f(x_1)=0$ dan $f(x_1)=f(x_2)$. Karena $x_1$ dan $x_2$ sembarang, $f$ bernilai sama di seluruh selang. ∎

**Pertanyaan kedua adalah bagaimana dua fungsi dengan turunan yang sama berhubungan.** *Akibat 2: jika $f'(x)=g'(x)$ di setiap titik pada selang terbuka $(a,b)$, maka ada konstanta $C$ dengan $f(x)=g(x)+C$ untuk semua $x$ di $(a,b)$.* Terapkan Akibat 1 pada $h=f-g$, yang turunannya $h'=f'-g'=0$ pada $(a,b)$, sehingga $h=C$ di sana. Kedua akibat tetap benar untuk selang tak hingga. Secara geometri, grafik fungsi-fungsi dengan turunan yang sama hanya berbeda oleh pergeseran tegak, seperti parabola $y=x^2+C$ untuk turunan $2x$.

Inilah yang membuat *antiturunan* teratur. Begitu satu fungsi $g$ memiliki turunan yang kamu inginkan, *setiap* fungsi seperti itu adalah $g(x)+C$, dan satu titik pada grafik menetapkan $C$.

**Contoh 7.** Tentukan fungsi $f(x)$ yang turunannya $\sin x$ dan grafiknya melalui $(0,2)$. Fungsi $g(x)=-\cos x$ memiliki $g'(x)=\sin x$, sehingga $f(x)=-\cos x+C$. Dari $f(0)=-\cos0+C=2$ kita peroleh $C=3$, dan $f(x)=-\cos x+3$.

**Contoh 8, jatuh bebas.** Benda jatuh dari diam dengan percepatan $9{,}8$ m/detik², dan posisi $s$ diukur ke bawah dari posisi diam. Kecepatan $v$ memiliki turunan $9{,}8$, begitu pula $9{,}8t$, maka $v(t)=9{,}8t+C$, dan $v(0)=0$ memberi $C=0$: $v(t)=9{,}8t$. Posisi $s$ memiliki turunan $9{,}8t$, begitu pula $4{,}9t^2$, maka $s(t)=4{,}9t^2+C$, dan $s(0)=0$ memberi $s(t)=4{,}9t^2$, sampai benda menyentuh tanah. Ini jatuh bebas yang sama dengan [jatuh bebas dan lemparan](article:the-derivative-as-a-rate-of-change#free-fall-and-throws) di artikel laju perubahan, dikerjakan mundur dari percepatan.

Pilih turunan di bawah dan geser titik yang harus dilalui grafik. Kurva lainnya adalah grafik yang sama digeser, dan hanya satu yang melalui titik itu.`,
          ),
        },
        { kind: 'widget', name: 'shiftcurves' },
      ],
    },

    /* ------------------------------------------------------------------------------ bounds */
    {
      id: 'bounds',
      heading: L('How does the theorem prove inequalities and bounds?', 'Bagaimana teorema ini membuktikan pertidaksamaan dan batas?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**If $m\le f'(x)\le M$ for every $x$ in $(a,b)$, and $f$ is continuous on $[a,b]$, then $m(b-a)\le f(b)-f(a)\le M(b-a)$.** The reason is one line: the theorem gives $\frac{f(b)-f(a)}{b-a}=f'(c)$ for some $c$, and $f'(c)$ is between $m$ and $M$. Knowing how fast a function can change tells how far it can move.

**Example 9.** If $|f'(x)|\le1$ for $1\le x\le4$, then $-3\le f(4)-f(1)\le3$, because $b-a=3$.

**Example 10, the sine inequality.** For any $a$ and $b$, $|\sin b-\sin a|\le|b-a|$. The derivative of $\sin$ is $\cos$, and $|\cos|\le1$, so $|\sin b-\sin a|=|\cos c|\,|b-a|\le|b-a|$. In the same way $|\cos x-1|\le|x|$ for all $x$: apply the theorem to $\cos t$ on the interval from $0$ to $x$, where $|\sin c|\le1$.

**Example 11, an estimate.** For $f(x)=\sqrt{1+x}$ on $[0,0.1]$ the derivative $f'(x)=\frac1{2\sqrt{1+x}}$ decreases from $0.5$ to $\frac1{2\sqrt{1.1}}\approx0.4767$, so
$$0.4767\cdot0.1\le f(0.1)-f(0)\le0.5\cdot0.1,$$
and $1.0477\le\sqrt{1.1}\le1.05$. The true value is $1.0488$. This is the same estimate as the [linearization](article:linearization-and-differentials#estimating) $1+\frac{0.1}{2}=1.05$, now with a guaranteed range on both sides, which linearization alone does not give.

**Example 12.** If $f'(x)\le3$ for all $x$ and $f(0)=1$, the largest $f(2)$ can be is $1+3\cdot2=7$, since $f(2)-f(0)\le3\cdot2$. And $\frac12\le\frac1{1+x^2}\le1$ on $(0,1)$ means $\frac12\le\arctan1\le1$ (it is $\frac\pi4\approx0.785$).`,
            T`**Jika $m\le f'(x)\le M$ untuk setiap $x$ di $(a,b)$, dan $f$ kontinu pada $[a,b]$, maka $m(b-a)\le f(b)-f(a)\le M(b-a)$.** Alasannya satu baris: teorema memberi $\frac{f(b)-f(a)}{b-a}=f'(c)$ untuk suatu $c$, dan $f'(c)$ berada di antara $m$ dan $M$. Mengetahui seberapa cepat fungsi dapat berubah memberi tahu seberapa jauh ia dapat bergerak.

**Contoh 9.** Jika $|f'(x)|\le1$ untuk $1\le x\le4$, maka $-3\le f(4)-f(1)\le3$, karena $b-a=3$.

**Contoh 10, pertidaksamaan sinus.** Untuk sembarang $a$ dan $b$, $|\sin b-\sin a|\le|b-a|$. Turunan $\sin$ adalah $\cos$, dan $|\cos|\le1$, sehingga $|\sin b-\sin a|=|\cos c|\,|b-a|\le|b-a|$. Dengan cara yang sama $|\cos x-1|\le|x|$ untuk semua $x$: terapkan teorema pada $\cos t$ pada selang dari $0$ sampai $x$, tempat $|\sin c|\le1$.

**Contoh 11, perkiraan.** Untuk $f(x)=\sqrt{1+x}$ pada $[0,0{,}1]$ turunan $f'(x)=\frac1{2\sqrt{1+x}}$ menurun dari $0{,}5$ ke $\frac1{2\sqrt{1{,}1}}\approx0{,}4767$, sehingga
$$0{,}4767\cdot0{,}1\le f(0{,}1)-f(0)\le0{,}5\cdot0{,}1,$$
dan $1{,}0477\le\sqrt{1{,}1}\le1{,}05$. Nilai sebenarnya $1{,}0488$. Ini perkiraan yang sama dengan [linearisasi](article:linearization-and-differentials#estimating) $1+\frac{0{,}1}{2}=1{,}05$, kini dengan rentang terjamin di kedua sisi, yang tidak diberikan linearisasi saja.

**Contoh 12.** Jika $f'(x)\le3$ untuk semua $x$ dan $f(0)=1$, nilai terbesar yang mungkin untuk $f(2)$ adalah $1+3\cdot2=7$, karena $f(2)-f(0)\le3\cdot2$. Dan $\frac12\le\frac1{1+x^2}\le1$ pada $(0,1)$ berarti $\frac12\le\arctan1\le1$ (nilainya $\frac\pi4\approx0{,}785$).`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------------- in code */
    {
      id: 'mvt-in-code',
      heading: L('How do you apply the theorem in code?', 'Bagaimana menerapkan teorema ini dalam kode?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**In code, finding $c$ means solving $f'(c)=m$ on the open interval, either exactly or by scanning for sign changes of $f'(x)-m$ and refining them by bisection.** SymPy does it exactly: ´sp.solveset(sp.diff(f, x) - slope, x, sp.Interval.open(a, b))´ returns every solution inside, and an empty set is the honest answer when a hypothesis fails. The scan has one trap that the theorem warns about: at a corner the derivative *jumps* across the level $m$, and a sign change there is not a zero, so each candidate has to be checked by evaluating $f'-m$ at the refined point.`,
            T`**Dalam kode, mencari $c$ berarti menyelesaikan $f'(c)=m$ pada selang terbuka, secara eksak atau dengan memindai perubahan tanda $f'(x)-m$ dan menghaluskannya dengan bisection.** SymPy melakukannya secara eksak: ´sp.solveset(sp.diff(f, x) - slope, x, sp.Interval.open(a, b))´ mengembalikan setiap penyelesaian di dalam, dan himpunan kosong adalah jawaban jujur ketika suatu syarat gagal. Pemindaian punya satu jebakan yang diperingatkan teorema: pada sudut turunan *melompat* melewati tingkat $m$, dan perubahan tanda di sana bukan nol, sehingga setiap kandidat harus diperiksa dengan menghitung $f'-m$ di titik yang dihaluskan.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python and SymPy: the points c, exactly', 'Python dan SymPy: titik c, secara eksak'),
          code: `import sympy as sp

x = sp.symbols('x', real=True)


def mvt_points(f, a, b):
    """The slope of the secant, and every c in (a, b) where f'(c) equals it."""
    slope = sp.simplify((f.subs(x, b) - f.subs(x, a)) / (b - a))
    return slope, sp.solveset(sp.diff(f, x) - slope, x, sp.Interval.open(a, b))


examples = (
    (x**2, 0, 2),                      # Example 2
    (x**3 - x**2, -1, 2),              # Example 5: two points
    (1 / x, 1, 4),                     # the geometric mean sqrt(1 * 4)
    (sp.sqrt(1 - x**2), -1, 1),        # not differentiable at the ends, still c = 0
    (sp.sin(x), 0, 3 * sp.pi),         # Rolle: three horizontal tangents
    (sp.Abs(x), -1, 2),                # a corner: a hypothesis fails and there is no c
)
for f, a, b in examples:
    print(f, [a, b], '->', mvt_points(f, a, b))
# x**2 [0, 2] -> (2, {1})
# x**3 - x**2 [-1, 2] -> (2, {1/3 - sqrt(7)/3, 1/3 + sqrt(7)/3})
# 1/x [1, 4] -> (-1/4, {2})
# sqrt(1 - x**2) [-1, 1] -> (0, {0})
# sin(x) [0, 3*pi] -> (0, {pi/2, 3*pi/2, 5*pi/2})
# Abs(x) [-1, 2] -> (1/3, EmptySet)`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: scan and bisect, without a CAS', 'JavaScript: pindai dan bisection, tanpa CAS'),
          code: `const mvt = (f, df, a, b, n = 4000) => {
  const slope = (f(b) - f(a)) / (b - a)
  const g = (x) => df(x) - slope                              // the points c are the zeros of g
  const cs = []
  for (let i = 0; i < n; i++) {
    let lo = a + ((b - a) * i) / n
    let hi = a + ((b - a) * (i + 1)) / n
    if (g(lo) === 0 && i > 0) cs.push(lo)                     // a zero that falls exactly on a grid point
    else if (g(lo) * g(hi) < 0) {                             // g changes sign: bisect
      for (let k = 0; k < 60; k++) {
        const mid = (lo + hi) / 2
        if (g(lo) * g(mid) <= 0) hi = mid
        else lo = mid
      }
      const c = (lo + hi) / 2
      if (Math.abs(g(c)) < 1e-6) cs.push(c)                   // a corner makes g jump across 0: that is not a zero
    }
  }
  return { slope, cs }
}
mvt((x) => x * x, (x) => 2 * x, 0, 2)                                        // slope 2, cs [1]
mvt((x) => x ** 3 - x ** 2, (x) => 3 * x * x - 2 * x, -1, 2)                 // slope 2, cs [-0.5486, 1.2153]
mvt((x) => x * Math.exp(x), (x) => (1 + x) * Math.exp(x), 0, 1)              // slope e = 2.7183, cs [0.5571]
mvt((x) => 1 / x, (x) => -1 / (x * x), 1, 4)                                 // slope -0.25, cs [2]
mvt(Math.abs, Math.sign, -1, 2)                                              // slope 0.3333, cs []: the corner at 0 is rejected`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++', 'C++'),
          code: `#include <iostream>
#include <cstdio>
#include <cmath>
using namespace std;

double f(int k, double x) {
  if (k == 0) return x * x * x - x * x;       // Example 5 on [-1, 2]
  if (k == 1) return x * exp(x);              // no formula for c, on [0, 1]
  return 1 / x;                               // the geometric mean, on [1, 4]
}
double df(int k, double x) {
  if (k == 0) return 3 * x * x - 2 * x;
  if (k == 1) return (1 + x) * exp(x);
  return -1 / (x * x);
}

void mvt(int k, double a, double b) {
  double slope = (f(k, b) - f(k, a)) / (b - a);
  int n = 2000;
  for (int i = 0; i < n; i++) {
    double lo = a + (b - a) * i / n;
    double hi = a + (b - a) * (i + 1) / n;
    if ((df(k, lo) - slope) * (df(k, hi) - slope) < 0) {     // f' - slope changes sign: bisect
      for (int j = 0; j < 60; j++) {
        double mid = (lo + hi) / 2;
        if ((df(k, lo) - slope) * (df(k, mid) - slope) <= 0) hi = mid; else lo = mid;
      }
      double c = (lo + hi) / 2;
      printf("slope=%.4f c=%.4f f'(c)=%.4f\\n", slope, c, df(k, c));
    }
  }
}

int main() {
  mvt(0, -1, 2);
  mvt(1, 0, 1);
  mvt(2, 1, 4);
  printf("%.4f %.4f\\n", sqrt(1.0 * 4), (1.0 + 4) / 2);   // the geometric and the arithmetic mean of 1 and 4
  return 0;
}

/* output:
slope=2.0000 c=-0.5486 f'(c)=2.0000
slope=2.0000 c=1.2153 f'(c)=2.0000
slope=2.7183 c=0.5571 f'(c)=2.7183
slope=-0.2500 c=2.0000 f'(c)=-0.2500
2.0000 2.5000
*/`,
        },
      ],
    },

    /* ---------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where does the Mean Value Theorem come from?', 'Dari mana asal Teorema Nilai Rata-rata?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The theorem is older than the definition of the derivative it is stated with, and it was proved first for polynomials.**

- **Parameshvara, 15th century.** The Indian astronomer Parameshvara of the Kerala school is credited with a special case of the theorem, for the sine function.
- **Rolle, 1691.** Michel Rolle showed, for polynomial equations, that between two roots there lies a root of the derivative, as a step in a method for separating the roots. He was a critic of the new infinitesimal calculus, and the name *Rolle's theorem* was given to the result in the 19th century (by Giusto Bellavitis, in 1846).
- **Lagrange, 1797.** Joseph-Louis Lagrange stated the Mean Value Theorem and used it as the base of his attempt to build calculus on power series. Its other name, the Lagrange mean value theorem, is from this.
- **Cauchy, 1823.** Augustin-Louis Cauchy, with the derivative defined as a limit, gave the proof by Rolle's Theorem used in books today, and a generalization to two functions, $\frac{f(b)-f(a)}{g(b)-g(a)}=\frac{f'(c)}{g'(c)}$, from which the rule of l'Hôpital for limits follows.`,
            T`**Teorema ini lebih tua daripada definisi turunan yang dipakai menyatakannya, dan mula-mula dibuktikan untuk polinom.**

- **Parameshvara, abad ke-15.** Astronom India Parameshvara dari aliran Kerala dianggap menemukan kasus khusus teorema ini, untuk fungsi sinus.
- **Rolle, 1691.** Michel Rolle menunjukkan, untuk persamaan polinom, bahwa di antara dua akar terdapat akar turunan, sebagai langkah dalam metode memisahkan akar. Ia seorang pengkritik kalkulus infinitesimal yang baru, dan nama *teorema Rolle* diberikan pada hasil ini pada abad ke-19 (oleh Giusto Bellavitis, tahun 1846).
- **Lagrange, 1797.** Joseph-Louis Lagrange menyatakan Teorema Nilai Rata-rata dan memakainya sebagai dasar upayanya membangun kalkulus di atas deret pangkat. Nama lainnya, teorema nilai rata-rata Lagrange, berasal dari sini.
- **Cauchy, 1823.** Augustin-Louis Cauchy, dengan turunan yang didefinisikan sebagai limit, memberi bukti dengan Teorema Rolle yang dipakai di buku sekarang, dan perampatan untuk dua fungsi, $\frac{f(b)-f(a)}{g(b)-g(a)}=\frac{f'(c)}{g'(c)}$, yang darinya aturan l'Hôpital untuk limit diturunkan.`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What mistakes do people make with the theorem?', 'Kesalahan apa yang sering terjadi pada teorema ini?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with the Mean Value Theorem are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ There is exactly one point $c$ | The theorem says at least one: $x^3-x^2$ on $[-1,2]$ has two, and $\sin x$ on $[0,3\pi]$ has three horizontal tangents. |
| ❌ Use it on $|x|$ over $[-1,2]$ | There is a corner at $0$, so $f$ is not differentiable inside; the slope of the secant is $\frac13$ and no tangent has that slope. |
| ❌ Use it on $\frac1x$ over $[-1,1]$ | $f$ is not continuous there, not even defined at $0$, so nothing is promised. |
| ❌ $f$ must be differentiable at the endpoints | Only continuity at the ends is needed: $\sqrt{1-x^2}$ on $[-1,1]$ works, with $c=0$. |
| ❌ The theorem says $f(c)$ is the average of the values of $f$ | It says $f'(c)$ is the average *rate*, $\frac{f(b)-f(a)}{b-a}$; averages of values belong to integrals. |
| ❌ $f'=0$ on $(-1,0)\cup(0,1)$, so $f$ is constant | The set must be one interval: $f(x)=\frac{x}{|x|}$ has $f'=0$ wherever defined and is $-1$ and then $1$. |
| ❌ $c$ is always the midpoint $\frac{a+b}{2}$ | Only for quadratics: $x^3$ on $[0,2]$ has $c=\frac{2}{\sqrt3}\approx1.155$, not $1$. |
| ❌ If $f'=g'$ then $f=g$ | They differ by a constant: $x^2$ and $x^2+3$ have the same derivative. |
| ❌ An average speed of $115$ km/h means the speed was always $115$ | The theorem gives at least one instant at that speed, not all of them. |`,
            T`**Kesalahan paling umum pada Teorema Nilai Rata-rata adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ Hanya ada tepat satu titik $c$ | Teorema menyatakan paling sedikit satu: $x^3-x^2$ pada $[-1,2]$ memiliki dua, dan $\sin x$ pada $[0,3\pi]$ memiliki tiga garis singgung mendatar. |
| ❌ Memakainya pada $|x|$ di $[-1,2]$ | Ada sudut di $0$, sehingga $f$ tidak terdiferensialkan di dalam; gradien tali busur $\frac13$ dan tidak ada garis singgung dengan gradien itu. |
| ❌ Memakainya pada $\frac1x$ di $[-1,1]$ | $f$ tidak kontinu di sana, bahkan tak terdefinisi di $0$, sehingga tidak ada yang dijanjikan. |
| ❌ $f$ harus terdiferensialkan di ujung selang | Hanya kekontinuan di ujung yang diperlukan: $\sqrt{1-x^2}$ pada $[-1,1]$ berlaku, dengan $c=0$. |
| ❌ Teorema menyatakan $f(c)$ adalah rata-rata nilai $f$ | Teorema menyatakan $f'(c)$ adalah *laju* rata-rata, $\frac{f(b)-f(a)}{b-a}$; rata-rata nilai adalah urusan integral. |
| ❌ $f'=0$ pada $(-1,0)\cup(0,1)$, jadi $f$ konstan | Himpunannya harus satu selang: $f(x)=\frac{x}{|x|}$ memiliki $f'=0$ di mana pun terdefinisi dan bernilai $-1$ lalu $1$. |
| ❌ $c$ selalu titik tengah $\frac{a+b}{2}$ | Hanya untuk kuadrat: $x^3$ pada $[0,2]$ memiliki $c=\frac{2}{\sqrt3}\approx1{,}155$, bukan $1$. |
| ❌ Jika $f'=g'$ maka $f=g$ | Keduanya berbeda oleh konstanta: $x^2$ dan $x^2+3$ memiliki turunan yang sama. |
| ❌ Kecepatan rata-rata $115$ km/jam berarti kecepatannya selalu $115$ | Teorema memberi paling sedikit satu saat dengan kecepatan itu, bukan semuanya. |`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------------- practice */
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
              L(T`Rolle's Theorem is the Mean Value Theorem for a function with $f(a)=f(b)$.`, T`Teorema Rolle adalah Teorema Nilai Rata-rata untuk fungsi dengan $f(a)=f(b)$.`),
              L(T`The Mean Value Theorem needs $f$ to be differentiable at $a$ and at $b$.`, T`Teorema Nilai Rata-rata memerlukan $f$ terdiferensialkan di $a$ dan di $b$.`),
              L(T`If $f$ is not continuous on $[a,b]$, the conclusion can fail.`, T`Jika $f$ tidak kontinu pada $[a,b]$, kesimpulannya dapat gagal.`),
              L(T`There is exactly one point $c$ in the conclusion.`, T`Ada tepat satu titik $c$ pada kesimpulan.`),
              L(T`If $f'=0$ on an interval, then $f$ is constant on it.`, T`Jika $f'=0$ pada suatu selang, maka $f$ konstan pada selang itu.`),
              L(T`If $f'=0$ on $(-1,0)\cup(0,1)$, then $f$ is constant on that set.`, T`Jika $f'=0$ pada $(-1,0)\cup(0,1)$, maka $f$ konstan pada himpunan itu.`),
            ],
            answer: [true, false, true, false, true, false],
            explain: L(
              T`Only continuity at the ends is needed, and the point $c$ need not be unique. A constant needs a single interval: $\frac{x}{|x|}$ has $f'=0$ on both pieces and is $-1$, then $1$.`,
              T`Hanya kekontinuan di ujung yang diperlukan, dan titik $c$ tidak harus tunggal. Konstanta memerlukan satu selang: $\frac{x}{|x|}$ memiliki $f'=0$ pada kedua bagian dan bernilai $-1$, lalu $1$.`,
            ),
            hint: L(T`Recall which hypotheses the proof used, and what "interval" means.`, T`Ingat syarat apa yang dipakai bukti, dan apa arti "selang".`),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L(T`Choose **all** the functions that satisfy both hypotheses of the Mean Value Theorem on $[-1,1]$.`, T`Pilih **semua** fungsi yang memenuhi kedua syarat Teorema Nilai Rata-rata pada $[-1,1]$.`),
            options: [
              L(T`$x^2$`, T`$x^2$`),
              L(T`$|x|$`, T`$|x|$`),
              L(T`$\sqrt{1-x^2}$`, T`$\sqrt{1-x^2}$`),
              L(T`$\frac1x$`, T`$\frac1x$`),
              L(T`$x^{1/3}$`, T`$x^{1/3}$`),
              L(T`$x^3-x$`, T`$x^3-x$`),
            ],
            answer: [0, 2, 5],
            explain: L(
              T`$x^2$, $x^3-x$ and $\sqrt{1-x^2}$ (differentiable inside, continuous on the closed interval) qualify. $|x|$ has a corner at $0$, $\frac1x$ has a pole there, and $x^{1/3}$ has a vertical tangent at $0$.`,
              T`$x^2$, $x^3-x$, dan $\sqrt{1-x^2}$ (terdiferensialkan di dalam, kontinu pada selang tertutup) memenuhi. $|x|$ memiliki sudut di $0$, $\frac1x$ memiliki kutub di sana, dan $x^{1/3}$ memiliki garis singgung tegak di $0$.`,
            ),
            hint: L(T`Look at the point $0$, in the middle of the interval.`, T`Perhatikan titik $0$, di tengah selang.`),
          },
        },
        {
          kind: 'activity',
          title: L('Find c', 'Cari c'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L(T`The slope of the secant is $\frac{f(4)-f(1)}{3}=\frac{28-1}{3}=9$.`, T`Gradien tali busur adalah $\frac{f(4)-f(1)}{3}=\frac{28-1}{3}=9$.`), L(T`Solve $f'(c)=4c-1=9$.`, T`Selesaikan $f'(c)=4c-1=9$.`)],
            explain: L(T`$f'(c)=4c-1=9$ gives $c=2.5$, which is inside $(1,4)$.`, T`$f'(c)=4c-1=9$ memberi $c=2{,}5$, yang berada di dalam $(1,4)$.`),
            prompt: L(T`Find the value of $c$ in the Mean Value Theorem for $f(x)=2x^2-x$ on $[1,4]$.`, T`Tentukan nilai $c$ pada Teorema Nilai Rata-rata untuk $f(x)=2x^2-x$ pada $[1,4]$.`),
            given: String.raw`c=v`,
            blanks: [{ label: 'c =', answer: 2.5 }],
          },
        },
        {
          kind: 'activity',
          title: L('An average speed', 'Kecepatan rata-rata'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L(T`Average speed is distance over time.`, T`Kecepatan rata-rata adalah jarak dibagi waktu.`), L(T`$\frac{270}{3}$ kilometers per hour.`, T`$\frac{270}{3}$ kilometer per jam.`)],
            explain: L(T`$\frac{270}{3}=90$ km/h, so at some instant the train goes exactly $90$ km/h.`, T`$\frac{270}{3}=90$ km/jam, sehingga pada suatu saat kereta melaju tepat $90$ km/jam.`),
            prompt: L(T`A train travels $270$ km in $3$ hours. At some instant its speed is exactly how many km/h?`, T`Kereta menempuh $270$ km dalam $3$ jam. Pada suatu saat kecepatannya tepat berapa km/jam?`),
            given: String.raw`v=v`,
            blanks: [{ label: 'v =', answer: 90 }],
          },
        },
        {
          kind: 'activity',
          title: L('What the theorem promises for |x|', 'Yang dijanjikan teorema untuk |x|'),
          step: {
            kind: 'quiz',
            id: 'p5',
            prompt: L(T`What does the Mean Value Theorem say about $f(x)=|x|$ on $[-1,2]$?`, T`Apa yang dinyatakan Teorema Nilai Rata-rata tentang $f(x)=|x|$ pada $[-1,2]$?`),
            options: [
              L(T`nothing: $f$ is not differentiable at $0$, inside the interval`, T`tidak ada: $f$ tidak terdiferensialkan di $0$, di dalam selang`),
              L(T`there is a point $c$ with $f'(c)=\frac13$`, T`ada titik $c$ dengan $f'(c)=\frac13$`),
              L(T`there is a point $c$ with $f'(c)=0$`, T`ada titik $c$ dengan $f'(c)=0$`),
              L(T`nothing: $f$ is not continuous`, T`tidak ada: $f$ tidak kontinu`),
            ],
            answer: 0,
            explain: L(T`$|x|$ is continuous, but the corner at $0$ breaks differentiability. The slope of the secant is $\frac13$, and the tangents have slopes $-1$ and $1$ only, so no point has $\frac13$.`, T`$|x|$ kontinu, tetapi sudut di $0$ merusak keterdiferensialan. Gradien tali busur $\frac13$, dan garis singgungnya hanya bergradien $-1$ dan $1$, sehingga tidak ada titik dengan $\frac13$.`),
            hint: L(T`Check continuity and differentiability separately.`, T`Periksa kekontinuan dan keterdiferensialan secara terpisah.`),
          },
        },
        {
          kind: 'activity',
          title: L('Rolle’s Theorem', 'Teorema Rolle'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L(T`$f(1)=0$ and $f(5)=0$, so Rolle's Theorem applies.`, T`$f(1)=0$ dan $f(5)=0$, sehingga Teorema Rolle berlaku.`), L(T`$f'(x)=2x-6=0$.`, T`$f'(x)=2x-6=0$.`)],
            explain: L(T`$f'(c)=2c-6=0$ gives $c=3$, halfway between the two zeros.`, T`$f'(c)=2c-6=0$ memberi $c=3$, tepat di tengah kedua nol.`),
            prompt: L(T`Find the $c$ of Rolle's Theorem for $f(x)=x^2-6x+5$ on $[1,5]$.`, T`Tentukan $c$ pada Teorema Rolle untuk $f(x)=x^2-6x+5$ pada $[1,5]$.`),
            given: String.raw`c=v`,
            blanks: [{ label: 'c =', answer: 3 }],
          },
        },
        {
          kind: 'activity',
          title: L('The same derivative', 'Turunan yang sama'),
          step: {
            kind: 'math',
            id: 'p7',
            hints: [L(T`$f(x)=3x^2-2x+C$.`, T`$f(x)=3x^2-2x+C$.`), L(T`$f(0)=C=5$, so $f(1)=3-2+5$.`, T`$f(0)=C=5$, sehingga $f(1)=3-2+5$.`)],
            explain: L(T`$f(x)=3x^2-2x+5$ by Corollary 2, so $f(1)=6$.`, T`$f(x)=3x^2-2x+5$ menurut Akibat 2, sehingga $f(1)=6$.`),
            prompt: L(T`$f'(x)=6x-2$ for all $x$ and $f(0)=5$. Find $f(1)$.`, T`$f'(x)=6x-2$ untuk semua $x$ dan $f(0)=5$. Tentukan $f(1)$.`),
            given: String.raw`f(1)=v`,
            blanks: [{ label: 'f(1) =', answer: 6 }],
          },
        },
        {
          kind: 'activity',
          title: L('The toll road', 'Jalan tol'),
          step: {
            kind: 'quiz',
            id: 'p8',
            prompt: L(T`A driver covers $230$ km of a road with a limit of $100$ km/h in $2$ hours. Why was she speeding?`, T`Seorang pengemudi menempuh $230$ km jalan berbatas $100$ km/jam dalam $2$ jam. Mengapa ia melanggar?`),
            options: [
              L(T`her average speed was $115$ km/h, so at some instant she went exactly $115$ km/h`, T`kecepatan rata-ratanya $115$ km/jam, sehingga pada suatu saat ia melaju tepat $115$ km/jam`),
              L(T`she was above $100$ km/h at every instant`, T`ia di atas $100$ km/jam di setiap saat`),
              L(T`her speed was $100$ km/h at the end`, T`kecepatannya $100$ km/jam di akhir`),
              L(T`the average of two speeds is always above the limit`, T`rata-rata dua kecepatan selalu di atas batas`),
            ],
            answer: 0,
            explain: L(T`The Mean Value Theorem gives an instant at the average speed $\frac{230}{2}=115$, which exceeds $100$. It does not say she was always above the limit.`, T`Teorema Nilai Rata-rata memberi satu saat dengan kecepatan rata-rata $\frac{230}{2}=115$, yang melebihi $100$. Teorema tidak menyatakan ia selalu di atas batas.`),
            hint: L(T`Compute the average speed first.`, T`Hitung kecepatan rata-ratanya dulu.`),
          },
        },
        {
          kind: 'activity',
          title: L('A sine antiderivative', 'Antiturunan sinus'),
          step: {
            kind: 'math',
            id: 'p9',
            hints: [L(T`$g'(x)=\cos x$ gives $g(x)=\sin x+C$.`, T`$g'(x)=\cos x$ memberi $g(x)=\sin x+C$.`), L(T`$g(0)=C=1$, so $g\left(\frac\pi2\right)=1+1$.`, T`$g(0)=C=1$, sehingga $g\left(\frac\pi2\right)=1+1$.`)],
            explain: L(T`$g(x)=\sin x+1$, so $g\left(\frac\pi2\right)=1+1=2$.`, T`$g(x)=\sin x+1$, sehingga $g\left(\frac\pi2\right)=1+1=2$.`),
            prompt: L(T`$g'(x)=\cos x$ and $g(0)=1$. Find $g\left(\frac\pi2\right)$.`, T`$g'(x)=\cos x$ dan $g(0)=1$. Tentukan $g\left(\frac\pi2\right)$.`),
            given: String.raw`g\left(\frac{\pi}{2}\right)=v`,
            blanks: [{ label: 'g =', answer: 2 }],
          },
        },
        {
          kind: 'activity',
          title: L('How many solutions?', 'Berapa penyelesaian?'),
          step: {
            kind: 'quiz',
            id: 'p10',
            prompt: L(T`How many real solutions does $x^5+2x+3=0$ have?`, T`Berapa penyelesaian real $x^5+2x+3=0$?`),
            options: [L('exactly one', 'tepat satu'), L('none', 'tidak ada'), L('exactly two', 'tepat dua'), L('exactly five', 'tepat lima')],
            answer: 0,
            explain: L(T`$f(-2)=-33<0$ and $f(0)=3>0$, so there is a solution. And $f'(x)=5x^4+2>0$ is never zero, so by Rolle's Theorem there cannot be two.`, T`$f(-2)=-33<0$ dan $f(0)=3>0$, sehingga ada penyelesaian. Dan $f'(x)=5x^4+2>0$ tidak pernah nol, sehingga menurut Teorema Rolle tidak mungkin ada dua.`),
            hint: L(T`Use the Intermediate Value Theorem for existence and the derivative for uniqueness.`, T`Pakai Teorema Nilai Antara untuk keberadaan dan turunan untuk ketunggalan.`),
          },
        },
        {
          kind: 'activity',
          title: L('A bound', 'Sebuah batas'),
          step: {
            kind: 'math',
            id: 'p11',
            hints: [L(T`$f(2)-f(0)=f'(c)\cdot2$ for some $c$.`, T`$f(2)-f(0)=f'(c)\cdot2$ untuk suatu $c$.`), L(T`$f'(c)\le3$, so $f(2)\le1+6$.`, T`$f'(c)\le3$, sehingga $f(2)\le1+6$.`)],
            explain: L(T`$f(2)=f(0)+2f'(c)\le1+6=7$, and $7$ is reached by $f(x)=3x+1$.`, T`$f(2)=f(0)+2f'(c)\le1+6=7$, dan $7$ dicapai oleh $f(x)=3x+1$.`),
            prompt: L(T`$f'(x)\le3$ for all $x$ and $f(0)=1$. What is the largest value $f(2)$ can have?`, T`$f'(x)\le3$ untuk semua $x$ dan $f(0)=1$. Berapa nilai terbesar yang dapat dimiliki $f(2)$?`),
            given: String.raw`f(2)_{\max}=v`,
            blanks: [{ label: 'f(2) =', answer: 7 }],
          },
        },
        {
          kind: 'activity',
          title: L('Zeros of the derivative', 'Nol turunan'),
          step: {
            kind: 'math',
            id: 'p12',
            hints: [L(T`There are three gaps between four zeros.`, T`Ada tiga celah di antara empat nol.`), L(T`Each gap holds a zero of $f'$, and $f'$ has degree $3$.`, T`Setiap celah memuat nol $f'$, dan $f'$ berderajat $3$.`)],
            explain: L(T`Each of the three gaps holds one zero of $f'$, and a degree-$3$ polynomial has at most three zeros, so $f'$ has exactly $3$.`, T`Masing-masing dari tiga celah memuat satu nol $f'$, dan polinom derajat $3$ memiliki paling banyak tiga nol, sehingga $f'$ memiliki tepat $3$.`),
            prompt: L(T`A polynomial has the four real zeros $-2,1,4,7$. How many real zeros does its derivative have?`, T`Sebuah polinom memiliki empat nol real $-2,1,4,7$. Berapa nol real turunannya?`),
            given: String.raw`n=v`,
            blanks: [{ label: 'n =', answer: 3 }],
          },
        },
      ],
    },

    /* ---------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: the Mean Value Theorem at a glance', 'Ringkasan: Teorema Nilai Rata-rata sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Rolle's Theorem:** $f$ continuous on $[a,b]$, differentiable on $(a,b)$, $f(a)=f(b)$ give some $c$ with $f'(c)=0$.
- **Mean Value Theorem:** the same two hypotheses give some $c$ with $f'(c)=\frac{f(b)-f(a)}{b-a}$, a tangent parallel to the secant.
- **Proof:** apply Rolle's Theorem to $h(x)=f(x)-f(a)-\frac{f(b)-f(a)}{b-a}(x-a)$.
- **Watch for:** corners, cusps and poles inside the interval; the point $c$ is not unique and has no formula in general.
- **Rates:** the average rate over an interval is the instantaneous rate at some interior instant.
- **Corollaries:** $f'=0$ on an interval means constant; $f'=g'$ means $f=g+C$.
- **Bounds:** $m\le f'\le M$ gives $m(b-a)\le f(b)-f(a)\le M(b-a)$.
- **Next:** the sign of $f'$ on an interval tells where $f$ rises and falls, the subject of the next article.
- **Code:** ´sp.solveset(sp.diff(f, x) - slope, x, sp.Interval.open(a, b))´, or a scan with bisection that rejects jumps.`,
            T`- **Teorema Rolle:** $f$ kontinu pada $[a,b]$, terdiferensialkan pada $(a,b)$, $f(a)=f(b)$ memberi suatu $c$ dengan $f'(c)=0$.
- **Teorema Nilai Rata-rata:** dua syarat yang sama memberi suatu $c$ dengan $f'(c)=\frac{f(b)-f(a)}{b-a}$, garis singgung sejajar tali busur.
- **Bukti:** terapkan Teorema Rolle pada $h(x)=f(x)-f(a)-\frac{f(b)-f(a)}{b-a}(x-a)$.
- **Waspadai:** sudut, titik puncak, dan kutub di dalam selang; titik $c$ tidak tunggal dan umumnya tidak punya rumus.
- **Laju:** laju rata-rata pada suatu selang adalah laju sesaat di suatu saat di dalamnya.
- **Akibat:** $f'=0$ pada suatu selang berarti konstan; $f'=g'$ berarti $f=g+C$.
- **Batas:** $m\le f'\le M$ memberi $m(b-a)\le f(b)-f(a)\le M(b-a)$.
- **Berikutnya:** tanda $f'$ pada suatu selang menunjukkan di mana $f$ naik dan turun, topik artikel berikutnya.
- **Kode:** ´sp.solveset(sp.diff(f, x) - slope, x, sp.Interval.open(a, b))´, atau pemindaian dengan bisection yang menolak lompatan.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Rolle’s Theorem', 'Teorema Rolle'), definition: L('The theorem that a function continuous on [a, b], differentiable on (a, b) and equal at the two ends has a point inside where the derivative is zero.', 'Teorema bahwa fungsi kontinu pada [a, b], terdiferensialkan pada (a, b), dan sama di kedua ujung memiliki titik di dalam tempat turunannya nol.') },
    { term: L('Mean Value Theorem', 'Teorema Nilai Rata-rata'), definition: L('The theorem that a function continuous on [a, b] and differentiable on (a, b) has a point inside where the tangent is parallel to the secant through the ends.', 'Teorema bahwa fungsi kontinu pada [a, b] dan terdiferensialkan pada (a, b) memiliki titik di dalam tempat garis singgung sejajar dengan tali busur melalui ujungnya.') },
    { term: L('Secant line', 'Tali busur'), definition: L('The line through two points of a graph; its slope is the average rate of change between them.', 'Garis melalui dua titik pada grafik; gradiennya adalah laju perubahan rata-rata di antara keduanya.') },
    { term: L('Average rate of change', 'Laju perubahan rata-rata'), definition: L('The change in the value of a function divided by the change in the variable over an interval: the slope of the secant.', 'Perubahan nilai fungsi dibagi perubahan peubah pada suatu selang: gradien tali busur.') },
    { term: L('Antiderivative', 'Antiturunan'), definition: L('A function whose derivative is a given function; on an interval, any two antiderivatives differ by a constant.', 'Fungsi yang turunannya adalah fungsi yang diberikan; pada suatu selang, dua antiturunan mana pun berbeda oleh konstanta.') },
    { term: L('Corollary', 'Akibat'), definition: L('A statement that follows directly from a theorem; the zero-derivative and equal-derivative results follow from the Mean Value Theorem.', 'Pernyataan yang mengikuti langsung dari suatu teorema; hasil turunan nol dan turunan sama mengikuti dari Teorema Nilai Rata-rata.') },
  ],

  howTo: [
    {
      name: L('How to find the point c of the Mean Value Theorem', 'Cara mencari titik c pada Teorema Nilai Rata-rata'),
      description: L('Check the hypotheses, compute the slope of the secant, and solve for the points where the derivative equals it.', 'Periksa syaratnya, hitung gradien tali busur, dan selesaikan titik tempat turunan sama dengannya.'),
      steps: [
        { name: L('Check the hypotheses', 'Periksa syaratnya'), text: L('Make sure the function is continuous on the closed interval and differentiable on the open interval; look for corners, cusps and poles.', 'Pastikan fungsi kontinu pada selang tertutup dan terdiferensialkan pada selang terbuka; cari sudut, titik puncak, dan kutub.') },
        { name: L('Compute the secant slope', 'Hitung gradien tali busur'), text: L('Work out the average rate of change, f of b minus f of a, divided by b minus a.', 'Hitung laju perubahan rata-rata, f(b) dikurangi f(a), dibagi b dikurangi a.') },
        { name: L('Solve f prime of c equals the slope', 'Selesaikan f aksen c sama dengan gradien'), text: L('Differentiate and solve the equation for c.', 'Turunkan dan selesaikan persamaan untuk c.') },
        { name: L('Keep the solutions inside', 'Simpan penyelesaian di dalam'), text: L('Keep only the solutions strictly between a and b; there is at least one, and there may be several.', 'Simpan hanya penyelesaian yang benar-benar di antara a dan b; ada paling sedikit satu, dan bisa beberapa.') },
      ],
    },
    {
      name: L('How to show that an equation has exactly one real solution', 'Cara menunjukkan bahwa persamaan memiliki tepat satu penyelesaian real'),
      description: L('Use the Intermediate Value Theorem for existence and Rolle’s Theorem for uniqueness.', 'Pakai Teorema Nilai Antara untuk keberadaan dan Teorema Rolle untuk ketunggalan.'),
      steps: [
        { name: L('Define the function', 'Definisikan fungsinya'), text: L('Move everything to one side and call it f, so that the solutions are the zeros of f.', 'Pindahkan semuanya ke satu ruas dan namai f, sehingga penyelesaiannya adalah nol f.') },
        { name: L('Show a sign change', 'Tunjukkan perubahan tanda'), text: L('Find two inputs where f has opposite signs; the Intermediate Value Theorem gives at least one zero between them.', 'Cari dua masukan tempat f berlawanan tanda; Teorema Nilai Antara memberi paling sedikit satu nol di antaranya.') },
        { name: L('Assume two zeros', 'Andaikan dua nol'), text: L('If there were two zeros, Rolle’s Theorem would put a zero of the derivative between them.', 'Jika ada dua nol, Teorema Rolle akan menempatkan nol turunan di antaranya.') },
        { name: L('Contradict it', 'Bantah'), text: L('Show that the derivative is never zero, for example because it is always positive; so there is only one zero.', 'Tunjukkan bahwa turunan tidak pernah nol, misalnya karena selalu positif; jadi hanya ada satu nol.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is the Mean Value Theorem?', 'Apa itu Teorema Nilai Rata-rata?'),
      a: L(
        'It says that if a function is continuous on a closed interval and differentiable inside it, then at some point inside, the slope of the tangent equals the slope of the secant through the two ends. The instantaneous rate equals the average rate somewhere.',
        'Teorema ini menyatakan bahwa jika fungsi kontinu pada selang tertutup dan terdiferensialkan di dalamnya, maka di suatu titik di dalam, gradien garis singgung sama dengan gradien tali busur melalui kedua ujung. Laju sesaat sama dengan laju rata-rata di suatu tempat.',
      ),
    },
    {
      q: L('What is the difference between Rolle’s Theorem and the Mean Value Theorem?', 'Apa beda Teorema Rolle dan Teorema Nilai Rata-rata?'),
      a: L(
        'Rolle’s Theorem is the special case where the function has the same value at both ends, so the secant is horizontal and the tangent at the promised point is horizontal too. The Mean Value Theorem tilts the picture to any secant.',
        'Teorema Rolle adalah kasus khusus tempat fungsi bernilai sama di kedua ujung, sehingga tali busur mendatar dan garis singgung di titik yang dijanjikan juga mendatar. Teorema Nilai Rata-rata memiringkan gambar itu untuk tali busur mana pun.',
      ),
    },
    {
      q: L('Why does the Mean Value Theorem need continuity and differentiability?', 'Mengapa Teorema Nilai Rata-rata memerlukan kekontinuan dan keterdiferensialan?'),
      a: L(
        'Continuity on the closed interval lets the extreme values exist, and differentiability inside lets a tangent exist at them. Without them there may be no tangent with the right slope, as for the absolute value function on an interval that contains its corner.',
        'Kekontinuan pada selang tertutup membuat nilai ekstrem ada, dan keterdiferensialan di dalam membuat garis singgung ada di sana. Tanpa keduanya mungkin tidak ada garis singgung dengan gradien yang tepat, seperti fungsi nilai mutlak pada selang yang memuat sudutnya.',
      ),
    },
    {
      q: L('How do you find the value of c?', 'Bagaimana mencari nilai c?'),
      a: L(
        'Compute the secant slope, the change in the function divided by the change in x, then solve the equation that sets the derivative equal to it. Keep the solutions that lie strictly between the two ends; there may be more than one.',
        'Hitung gradien tali busur, yaitu perubahan fungsi dibagi perubahan x, lalu selesaikan persamaan yang menyamakan turunan dengannya. Simpan penyelesaian yang benar-benar di antara kedua ujung; bisa lebih dari satu.',
      ),
    },
    {
      q: L('Is the point c in the Mean Value Theorem unique?', 'Apakah titik c pada Teorema Nilai Rata-rata tunggal?'),
      a: L(
        'No. The theorem guarantees at least one. The function x cubed minus x squared on the interval from minus 1 to 2 has two such points, and sine on the interval from 0 to 3 pi has three horizontal tangents.',
        'Tidak. Teorema menjamin paling sedikit satu. Fungsi x pangkat tiga dikurangi x kuadrat pada selang dari minus 1 sampai 2 memiliki dua titik seperti itu, dan sinus pada selang dari 0 sampai 3 pi memiliki tiga garis singgung mendatar.',
      ),
    },
    {
      q: L('What does the Mean Value Theorem say about speed?', 'Apa kata Teorema Nilai Rata-rata tentang kecepatan?'),
      a: L(
        'A moving body must have an instantaneous speed equal to its average speed at some moment. A car that goes 176 meters in 8 seconds read exactly 22 meters per second at some instant, and a truck that averaged 115 kilometers per hour was at 115.',
        'Benda bergerak pasti memiliki kecepatan sesaat yang sama dengan kecepatan rata-ratanya pada suatu saat. Mobil yang menempuh 176 meter dalam 8 detik pasti menunjukkan tepat 22 meter per detik pada suatu saat, dan truk yang rata-rata 115 kilometer per jam pasti pernah tepat 115.',
      ),
    },
    {
      q: L('Why does a zero derivative mean a constant function?', 'Mengapa turunan nol berarti fungsi konstan?'),
      a: L(
        'For any two points of the interval, the Mean Value Theorem says the change in the function equals the derivative somewhere between them times the distance. If the derivative is zero everywhere, the change is zero, so all values are equal.',
        'Untuk dua titik mana pun pada selang, Teorema Nilai Rata-rata menyatakan perubahan fungsi sama dengan turunan di suatu tempat di antaranya dikali jaraknya. Jika turunan nol di mana-mana, perubahannya nol, sehingga semua nilainya sama.',
      ),
    },
    {
      q: L('How is the Mean Value Theorem used to prove inequalities?', 'Bagaimana Teorema Nilai Rata-rata dipakai untuk membuktikan pertidaksamaan?'),
      a: L(
        'If the derivative stays between two numbers, the change in the function is between those numbers times the length of the interval. Since the derivative of sine is at most 1 in size, the sine of b minus the sine of a is at most b minus a.',
        'Jika turunan tetap di antara dua bilangan, perubahan fungsi berada di antara bilangan-bilangan itu dikali panjang selang. Karena turunan sinus besarnya paling banyak 1, selisih sinus b dan sinus a paling banyak b dikurangi a.',
      ),
    },
  ],

  references: [
    { title: "Thomas' Calculus: Early Transcendentals in SI Units (15th ed.), Section 4.2: The Mean Value Theorem", author: 'Joel Hass, Christopher Heil, Maurice D. Weir et al.', year: 2023, source: 'Pearson' },
    { title: 'Calculus (8th ed.), section 4.2: The Mean Value Theorem', author: 'James Stewart', year: 2015, source: 'Cengage Learning' },
    { title: "Démonstration d'une méthode pour résoudre les égalités de tous les degrés", author: 'Michel Rolle', year: 1691, source: 'Paris' },
    { title: 'Théorie des fonctions analytiques', author: 'Joseph-Louis Lagrange', year: 1797, source: 'Paris, Imprimerie de la République' },
    { title: "Résumé des leçons données à l'École royale polytechnique sur le calcul infinitésimal", author: 'Augustin-Louis Cauchy', year: 1823, source: 'Paris' },
  ],

  related: ['extreme-values-on-closed-intervals', 'the-derivative-as-a-rate-of-change', 'tangent-lines-and-derivative-at-a-point', 'linearization-and-differentials'],
}
