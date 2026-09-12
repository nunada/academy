import type { Module } from '../types'

/** Module 6 — the payoff. Every technique from Modules 1-5 turns into a tool
 *  for questions with nothing abstract left in them: how much area sits
 *  between two curves, how far something actually travelled versus where it
 *  ended up, and how much a solid weighs once a flat region is spun into one. */
export const module6: Module = {
  id: 'int-m6',
  title: { en: 'Applications of the Integral', id: 'Penerapan Integral' },
  summary: {
    en: 'Area between two curves, distance recovered from a velocity that changes sign, and the volume of a solid formed by spinning a region around an axis.',
    id: 'Luas di antara dua kurva, jarak yang dipulihkan dari kecepatan yang berganti tanda, dan volume benda yang terbentuk dari memutar sebuah daerah pada sebuah sumbu.',
  },
  submodules: [
    /* --------------------------------------- 6.1 area and accumulated change */
    {
      id: 'int-m6-s1',
      title: { en: 'Area and Accumulated Change', id: 'Luas dan Perubahan Terakumulasi' },
      summary: {
        en: 'The area trapped between two curves, and the difference between net displacement and total distance travelled.',
        id: 'Luas yang terjebak di antara dua kurva, dan perbedaan antara perpindahan neto dan total jarak yang ditempuh.',
      },
      lessons: [
        {
          id: 'int-m6-s1-l1',
          title: { en: 'Area Between Two Curves', id: 'Luas di Antara Dua Kurva' },
          goal: {
            en: 'Find the area trapped between two curves by integrating the top function minus the bottom function.',
            id: 'Mencari luas yang terjebak di antara dua kurva dengan mengintegralkan fungsi atas dikurangi fungsi bawah.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Subtracting one region from another', id: 'Mengurangkan satu daerah dari daerah lain' },
              body: {
                en: 'A single definite integral $\\int_a^b f(x)\\,dx$ measures area against the $x$-axis. To measure the area trapped **between** two curves $f$ and $g$ (with $f(x) \\geq g(x)$ throughout $[a,b]$), take the area under the top curve and subtract the area under the bottom one:\n$$A = \\int_a^b \\big(f(x) - g(x)\\big)\\,dx$$\nFor the region between $y=x$ and $y=x^2$ on $[0,1]$ (they cross at $x=0$ and $x=1$): at $x=0.5$, $x=0.5$ but $x^2=0.25$, so $y=x$ is on top.\n$$A = \\int_0^1 (x-x^2)\\,dx = \\left[\\frac{x^2}{2}-\\frac{x^3}{3}\\right]_0^1 = \\frac{1}{2}-\\frac{1}{3} = \\frac{1}{6}$$',
                id: 'Satu integral tentu $\\int_a^b f(x)\\,dx$ mengukur luas terhadap sumbu-$x$. Untuk mengukur luas yang terjebak **di antara** dua kurva $f$ dan $g$ (dengan $f(x) \\geq g(x)$ di seluruh $[a,b]$), ambil luas di bawah kurva atas dan kurangkan luas di bawah kurva bawah:\n$$A = \\int_a^b \\big(f(x) - g(x)\\big)\\,dx$$\nUntuk daerah di antara $y=x$ dan $y=x^2$ pada $[0,1]$ (keduanya berpotongan di $x=0$ dan $x=1$): di $x=0.5$, $x=0.5$ tetapi $x^2=0.25$, sehingga $y=x$ berada di atas.\n$$A = \\int_0^1 (x-x^2)\\,dx = \\left[\\frac{x^2}{2}-\\frac{x^3}{3}\\right]_0^1 = \\frac{1}{2}-\\frac{1}{3} = \\frac{1}{6}$$',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 1.4],
                ySpan: [-0.3, 1.3],
                ticks: true,
                items: [
                  { t: 'poly', pts: [[0, 0], [0.25, 0.25], [0.5, 0.5], [0.75, 0.75], [1, 1], [0.75, 0.5625], [0.5, 0.25], [0.25, 0.0625], [0, 0]], color: 'result' },
                  { t: 'curve', f: 'x', from: 0, to: 1, color: 'a' },
                  { t: 'curve', f: 'x^2', from: 0, to: 1, color: 'b' },
                ],
                caption: {
                  en: 'The lens-shaped region trapped between $y = x$ and $y = x^2$ on $[0, 1]$ — area $1/6$, the top curve\'s integral minus the bottom curve\'s.',
                  id: 'Daerah berbentuk lensa yang terjebak di antara $y = x$ dan $y = x^2$ pada $[0, 1]$ — luas $1/6$, integral kurva atas dikurangi kurva bawah.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Finding the bounds by finding where the curves cross', id: 'Mencari batasnya dengan mencari tempat kurvanya berpotongan' },
              body: {
                en: 'A problem rarely hands over the bounds directly — they come from solving $f(x)=g(x)$. For $f(x)=2x-x^2$ and $g(x)=x^2$: $2x-x^2=x^2 \\Rightarrow 2x=2x^2 \\Rightarrow x=0$ or $x=1$. Checking $x=0.5$: $f(0.5)=0.75$, $g(0.5)=0.25$, so $f$ is on top across $(0,1)$.\n$$A = \\int_0^1 \\big((2x-x^2)-x^2\\big)\\,dx = \\int_0^1 (2x-2x^2)\\,dx = \\left[x^2-\\frac{2x^3}{3}\\right]_0^1 = 1-\\frac{2}{3} = \\frac{1}{3}$$\nEvery area-between-curves problem is really three steps: solve for the intersections, check which function is on top between them, then integrate the difference.',
                id: 'Sebuah soal jarang menyerahkan batasnya secara langsung — batasnya datang dari menyelesaikan $f(x)=g(x)$. Untuk $f(x)=2x-x^2$ dan $g(x)=x^2$: $2x-x^2=x^2 \\Rightarrow 2x=2x^2 \\Rightarrow x=0$ atau $x=1$. Memeriksa $x=0.5$: $f(0.5)=0.75$, $g(0.5)=0.25$, sehingga $f$ berada di atas sepanjang $(0,1)$.\n$$A = \\int_0^1 \\big((2x-x^2)-x^2\\big)\\,dx = \\int_0^1 (2x-2x^2)\\,dx = \\left[x^2-\\frac{2x^3}{3}\\right]_0^1 = 1-\\frac{2}{3} = \\frac{1}{3}$$\nSetiap soal luas-di-antara-kurva sebenarnya tiga langkah: selesaikan titik potongnya, periksa fungsi mana yang di atas di antaranya, lalu integralkan selisihnya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why must the intersection points be found before setting up the area integral?',
                id: 'Mengapa titik potongnya harus dicari sebelum menyusun integral luasnya?',
              },
              options: [
                { en: 'They give the bounds of integration, and which function stays on top can change beyond them', id: 'Mereka memberi batas integrasi, dan fungsi mana yang tetap di atas bisa berubah di luar batas itu' },
                { en: 'They tell you the final numeric answer directly', id: 'Mereka langsung memberi tahu jawaban numerik akhir' },
                { en: 'Intersection points are needed only when the curves never actually cross', id: 'Titik potong hanya diperlukan ketika kurvanya sebenarnya tak pernah berpotongan' },
                { en: 'They are not actually necessary — any bounds work equally well', id: 'Sebenarnya tak perlu — batas apa pun bekerja sama baiknya' },
              ],
              answer: 0,
              explain: {
                en: 'Between two intersection points, one function stays consistently on top; past an intersection, the two curves can swap places, which would silently turn a signed area calculation into nonsense if the wrong bounds were used.',
                id: 'Di antara dua titik potong, satu fungsi tetap konsisten di atas; melewati titik potong, kedua kurva bisa bertukar tempat, yang secara diam-diam akan mengubah penghitungan luas bertanda menjadi tak masuk akal bila batas yang salah dipakai.',
              },
              hint: {
                en: 'Think about what happens past an intersection point — could the identity of which function is "on top" possibly flip there, and what would that do to a fixed top-minus-bottom formula?',
                id: 'Pikirkan apa yang terjadi melewati titik potong — bisakah identitas fungsi mana yang "di atas" berubah di situ, dan apa yang akan terjadi pada rumus tetap atas-dikurangi-bawah?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the figure above, which curve is on top across the shaded region between $y = x$ and $y = x^2$ on $[0, 1]$?',
                id: 'Dengan membaca gambar di atas, kurva mana yang di atas sepanjang daerah bayangan antara $y = x$ dan $y = x^2$ pada $[0, 1]$?',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 1.4],
                ySpan: [-0.3, 1.3],
                ticks: true,
                items: [
                  { t: 'poly', pts: [[0, 0], [0.25, 0.25], [0.5, 0.5], [0.75, 0.75], [1, 1], [0.75, 0.5625], [0.5, 0.25], [0.25, 0.0625], [0, 0]], color: 'result' },
                  { t: 'curve', f: 'x', from: 0, to: 1, color: 'a' },
                  { t: 'curve', f: 'x^2', from: 0, to: 1, color: 'b' },
                ],
              },
              options: [
                { en: '$y = x$, the straight line', id: '$y = x$, garis lurusnya' },
                { en: '$y = x^2$, the parabola', id: '$y = x^2$, parabolanya' },
                { en: 'Neither — they overlap everywhere shown', id: 'Tak satu pun — keduanya berimpit di seluruh bagian yang ditampilkan' },
                { en: 'It alternates partway through the region', id: 'Bergantian di tengah-tengah daerahnya' },
              ],
              answer: 0,
              explain: {
                en: 'The straight line rises faster than the parabola for every $x$ strictly between $0$ and $1$, staying on top across the whole shaded lens.',
                id: 'Garis lurusnya naik lebih cepat dari parabolanya untuk setiap $x$ yang benar-benar di antara $0$ dan $1$, tetap di atas sepanjang seluruh lensa bayangan.',
              },
              hint: {
                en: 'Pick a value strictly between $0$ and $1$, like $x = 0.5$, and evaluate both $x$ and $x^2$ there directly — which output is larger?',
                id: 'Pilih nilai yang benar-benar di antara $0$ dan $1$, seperti $x = 0.5$, dan evaluasi $x$ dan $x^2$ langsung di situ — hasil mana yang lebih besar?',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the intersection points of $f(x) = 8 - x^2$ and $g(x) = x^2$, then compute the area they enclose.',
                id: 'Cari titik potong $f(x) = 8 - x^2$ dan $g(x) = x^2$, lalu hitung luas yang mereka lingkupi.',
              },
              blanks: [{ answer: 64 / 3 }],
              hints: [
                { en: '$8 - x^2 = x^2$ gives $x = -2$ and $x = 2$.', id: '$8 - x^2 = x^2$ memberi $x = -2$ dan $x = 2$.' },
                { en: 'At $x=0$, $8-x^2 = 8$ is larger than $x^2 = 0$, so $8-x^2$ is on top.', id: 'Di $x=0$, $8-x^2 = 8$ lebih besar dari $x^2 = 0$, sehingga $8-x^2$ di atas.' },
              ],
              explain: {
                en: '$A = \\int_{-2}^2 (8-2x^2)\\,dx = \\left[8x - \\tfrac{2x^3}{3}\\right]_{-2}^2 = 2\\left(16 - \\tfrac{16}{3}\\right) = \\tfrac{64}{3} \\approx 21.33$.',
                id: '$A = \\int_{-2}^2 (8-2x^2)\\,dx = \\left[8x - \\tfrac{2x^3}{3}\\right]_{-2}^2 = 2\\left(16 - \\tfrac{16}{3}\\right) = \\tfrac{64}{3} \\approx 21{,}33$.',
              },
            },
          ],
        },
        {
          id: 'int-m6-s1-l2',
          title: { en: 'Total Change from a Rate', id: 'Total Perubahan dari Sebuah Laju' },
          goal: {
            en: 'Recover net change by integrating a rate, and distinguish net displacement from total distance travelled when the rate changes sign.',
            id: 'Memulihkan perubahan neto dengan mengintegralkan sebuah laju, dan membedakan perpindahan neto dari total jarak yang ditempuh ketika lajunya berganti tanda.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The Net Change Theorem, restating FTC Part 2', id: 'Teorema Perubahan Neto, menyatakan ulang TDK Bagian 2' },
              body: {
                en: 'Since $\\int_a^b F\'(x)\\,dx = F(b)-F(a)$, integrating any rate of change over an interval gives the **net change** in the quantity itself over that interval:\n$$\\int_a^b (\\text{rate of change of } Q)\\,dt = Q(b) - Q(a)$$\nThis is FTC Part 2 wearing an application\'s clothing: integrating a flow rate gives total volume added, integrating marginal cost gives total cost increase, integrating velocity gives net displacement. Nothing new is being proved — every one of these is the same theorem, read for a specific quantity.',
                id: 'Karena $\\int_a^b F\'(x)\\,dx = F(b)-F(a)$, mengintegralkan laju perubahan apa pun pada suatu interval memberi **perubahan neto** pada besaran itu sendiri sepanjang interval itu:\n$$\\int_a^b (\\text{laju perubahan } Q)\\,dt = Q(b) - Q(a)$$\nIni adalah TDK Bagian 2 yang mengenakan pakaian penerapan: mengintegralkan laju aliran memberi total volume yang ditambahkan, mengintegralkan biaya marjinal memberi total kenaikan biaya, mengintegralkan kecepatan memberi perpindahan neto. Tak ada yang baru dibuktikan — setiap satu ini adalah teorema yang sama, dibaca untuk besaran tertentu.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'When the rate changes sign, distance and displacement split apart', id: 'Ketika lajunya berganti tanda, jarak dan perpindahan berpisah' },
              body: {
                en: 'For velocity $v(t) = t^2-4$ on $[0,3]$: $v(t)=0$ at $t=2$, negative before and positive after — the particle moves backward, then forward. Plain integration gives **displacement**, the net change in position:\n$$\\int_0^3 (t^2-4)\\,dt = \\left[\\frac{t^3}{3}-4t\\right]_0^3 = (9-12)-0 = -3$$\nBut **total distance travelled** must count backward motion as positive distance too, which means integrating $|v(t)|$ — splitting at $t=2$ where the sign changes:\n$$\\int_0^2 \\big(4-t^2\\big)\\,dt + \\int_2^3 \\big(t^2-4\\big)\\,dt = \\frac{16}{3} + \\frac{7}{3} = \\frac{23}{3} \\approx 7.67$$\nThe particle ends up $3$ units behind where it started, having actually travelled $\\frac{23}{3}$ units to get there.',
                id: 'Untuk kecepatan $v(t) = t^2-4$ pada $[0,3]$: $v(t)=0$ di $t=2$, negatif sebelumnya dan positif sesudahnya — partikelnya bergerak mundur, lalu maju. Integrasi biasa memberi **perpindahan**, perubahan neto posisi:\n$$\\int_0^3 (t^2-4)\\,dt = \\left[\\frac{t^3}{3}-4t\\right]_0^3 = (9-12)-0 = -3$$\nTetapi **total jarak yang ditempuh** harus menghitung gerak mundur sebagai jarak positif juga, yang berarti mengintegralkan $|v(t)|$ — memecah di $t=2$ tempat tandanya berganti:\n$$\\int_0^2 \\big(4-t^2\\big)\\,dt + \\int_2^3 \\big(t^2-4\\big)\\,dt = \\frac{16}{3} + \\frac{7}{3} = \\frac{23}{3} \\approx 7.67$$\nPartikelnya berakhir $3$ satuan di belakang tempat ia mulai, meski sebenarnya sudah menempuh $\\frac{23}{3}$ satuan untuk sampai di situ.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why does total distance travelled require splitting the integral at the point where velocity changes sign?',
                id: 'Mengapa total jarak yang ditempuh memerlukan pemecahan integral di titik tempat kecepatan berganti tanda?',
              },
              options: [
                { en: 'Distance uses $|v(t)|$, and the absolute value flips sign of the negative stretch — a change that must be applied separately on each side of the sign change', id: 'Jarak memakai $|v(t)|$, dan nilai mutlak membalik tanda bagian yang negatif — perubahan yang harus diterapkan terpisah di tiap sisi pergantian tandanya' },
                { en: 'It does not actually require splitting — plain integration already gives distance', id: 'Sebenarnya tak memerlukan pemecahan — integrasi biasa sudah memberi jarak' },
                { en: 'Splitting is only a computational convenience with no mathematical necessity', id: 'Pemecahan hanyalah kemudahan komputasi tanpa keperluan matematis' },
                { en: 'Velocity can never actually change sign', id: 'Kecepatan sebenarnya tak pernah bisa berganti tanda' },
              ],
              answer: 0,
              explain: {
                en: 'Integrating $v(t)$ directly lets a backward stretch subtract from a forward one, giving net displacement. To add distances instead, the negative stretch must be negated first — which only works if it is isolated in its own integral.',
                id: 'Mengintegralkan $v(t)$ langsung membiarkan bagian mundur mengurangi bagian maju, memberi perpindahan neto. Untuk menjumlahkan jarak sebagai gantinya, bagian negatifnya harus dinegasikan lebih dahulu — yang hanya berhasil bila diisolasi dalam integralnya sendiri.',
              },
              hint: {
                en: 'Think about what taking an absolute value does to a function on the stretch where it is negative, and whether that change can be applied while the negative and positive stretches are still combined in one integral.',
                id: 'Pikirkan apa yang dilakukan nilai mutlak pada fungsi di bagian yang negatif, dan apakah perubahan itu bisa diterapkan selama bagian negatif dan positif masih digabung dalam satu integral.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the total-distance setup for $v(t) = t^2 - 4$ on $[0, 3]$.',
                id: 'Lengkapi penyusunan total-jarak untuk $v(t) = t^2 - 4$ pada $[0, 3]$.',
              },
              template: '\\text{distance} = \\int_0^2 ___\\,dt + \\int_2^3 (t^2-4)\\,dt',
              blanks: ['(4-t^2)'],
              explain: {
                en: 'On $[0, 2]$, $v$ is negative, so $|v(t)| = -(t^2-4) = 4-t^2$. On $[2, 3]$, $v$ is already non-negative, so $|v(t)| = v(t)$ unchanged.',
                id: 'Pada $[0, 2]$, $v$ negatif, sehingga $|v(t)| = -(t^2-4) = 4-t^2$. Pada $[2, 3]$, $v$ sudah tak negatif, sehingga $|v(t)| = v(t)$ tanpa perubahan.',
              },
              hint: {
                en: 'On $[0, 2]$, check the sign of $v(t) = t^2-4$ there, then recall what taking $|v(t)|$ does to an expression that comes out negative.',
                id: 'Pada $[0, 2]$, periksa tanda $v(t) = t^2-4$ di situ, lalu ingat apa yang dilakukan $|v(t)|$ pada ekspresi yang hasilnya negatif.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $v(t) = 3t^2 - 12$ on $[0, 4]$ (zero at $t = 2$), find the net displacement.',
                id: 'Untuk $v(t) = 3t^2 - 12$ pada $[0, 4]$ (nol di $t = 2$), cari perpindahan neto.',
              },
              blanks: [{ answer: 16 }],
              hints: [
                { en: '$F(t) = t^3 - 12t$.', id: '$F(t) = t^3 - 12t$.' },
              ],
              explain: {
                en: '$F(4) - F(0) = (64 - 48) - 0 = 16$.',
                id: '$F(4) - F(0) = (64 - 48) - 0 = 16$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'int-m6-s1-p',
        runtime: 'math',
        title: { en: 'Area and Motion', id: 'Luas dan Gerak' },
        brief: {
          en: 'One area-between-curves problem, and one distance-versus-displacement problem.',
          id: 'Satu soal luas-di-antara-kurva, dan satu soal jarak-berbanding-perpindahan.',
        },
        requirements: [
          { en: 'Find where the curves cross before setting up the integral of top minus bottom.', id: 'Cari tempat kurvanya berpotongan sebelum menyusun integral atas dikurangi bawah.' },
          { en: 'Total distance needs the integral split wherever the rate changes sign.', id: 'Total jarak memerlukan integral yang dipecah di mana pun lajunya berganti tanda.' },
        ],
        tasks: [
          {
            prompt: { en: 'Find the area between $f(x) = x^2$ and $g(x) = 4$ (they meet at $x = -2$ and $x = 2$).', id: 'Cari luas antara $f(x) = x^2$ dan $g(x) = 4$ (bertemu di $x = -2$ dan $x = 2$).' },
            blanks: [{ answer: 32 / 3 }],
            solution: ['A = \\int_{-2}^2 (4-x^2)\\,dx = \\left[4x-\\tfrac{x^3}{3}\\right]_{-2}^2 = 2\\left(8-\\tfrac83\\right) = \\tfrac{32}{3} \\approx 10{,}67'],
          },
          {
            prompt: { en: 'For $v(t) = 2t - 6$ on $[0, 5]$ (zero at $t = 3$), find the net displacement.', id: 'Untuk $v(t) = 2t - 6$ pada $[0, 5]$ (nol di $t = 3$), cari perpindahan neto.' },
            blanks: [{ answer: -5 }],
            solution: ['F(t)=t^2-6t, \\quad F(5)-F(0) = (25-30)-0 = -5'],
          },
          {
            prompt: { en: 'For the same $v(t) = 2t - 6$ on $[0, 5]$, find the total distance travelled.', id: 'Untuk $v(t) = 2t - 6$ yang sama pada $[0, 5]$, cari total jarak yang ditempuh.' },
            blanks: [{ answer: 13 }],
            solution: ['\\int_0^3(6-2t)\\,dt + \\int_3^5(2t-6)\\,dt = 9 + 4 = 13'],
          },
        ],
        hints: [
          { en: 'Part 3: the two pieces do not need to be equal — check the sign of $v$ on each side of $t = 3$ separately.', id: 'Butir 3: kedua bagiannya tak perlu sama — periksa tanda $v$ pada tiap sisi $t = 3$ secara terpisah.' },
        ],
        xp: 50,
      },
    },

    /* ---------------------------------------------------- 6.2 volumes of revolution */
    {
      id: 'int-m6-s2',
      title: { en: 'Volumes of Revolution', id: 'Volume Benda Putar' },
      summary: {
        en: 'Slicing a solid of revolution into disks or washers, and rebuilding it instead from concentric cylindrical shells.',
        id: 'Mengiris benda putar menjadi cakram atau cincin, dan membangunnya kembali sebagai gantinya dari kulit silinder konsentris.',
      },
      lessons: [
        {
          id: 'int-m6-s2-l1',
          title: { en: 'Disks and Washers', id: 'Cakram dan Cincin' },
          goal: {
            en: 'Find the volume of a solid of revolution by integrating the area of a circular disk, or a washer when there is a hole.',
            id: 'Mencari volume benda putar dengan mengintegralkan luas sebuah cakram lingkaran, atau cincin ketika ada lubang.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Slicing a solid into circular coins', id: 'Mengiris benda menjadi koin-koin lingkaran' },
              body: {
                en: 'Rotate the region under $y=f(x)$ on $[a,b]$ around the $x$-axis. Every thin vertical slice sweeps out a circular disk of radius $f(x)$ and thickness $dx$, with volume $\\pi[f(x)]^2\\,dx$. Summing (integrating) over every slice gives the **disk method**:\n$$V = \\int_a^b \\pi\\big[f(x)\\big]^2\\,dx$$\nFor $y=\\sqrt{x}$ on $[0,4]$, rotated about the $x$-axis:\n$$V = \\int_0^4 \\pi\\big(\\sqrt{x}\\big)^2\\,dx = \\pi\\int_0^4 x\\,dx = \\pi\\left[\\frac{x^2}{2}\\right]_0^4 = 8\\pi$$',
                id: 'Putar daerah di bawah $y=f(x)$ pada $[a,b]$ mengelilingi sumbu-$x$. Tiap irisan tegak yang tipis menyapu sebuah cakram lingkaran berjari-jari $f(x)$ dan tebal $dx$, bervolume $\\pi[f(x)]^2\\,dx$. Menjumlahkan (mengintegralkan) di seluruh irisan memberi **metode cakram**:\n$$V = \\int_a^b \\pi\\big[f(x)\\big]^2\\,dx$$\nUntuk $y=\\sqrt{x}$ pada $[0,4]$, diputar mengelilingi sumbu-$x$:\n$$V = \\int_0^4 \\pi\\big(\\sqrt{x}\\big)^2\\,dx = \\pi\\int_0^4 x\\,dx = \\pi\\left[\\frac{x^2}{2}\\right]_0^4 = 8\\pi$$',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 4.5],
                ySpan: [-2.5, 2.5],
                ticks: true,
                params: [{ name: 'x0', min: 0.1, max: 4, step: 0.1, value: 2, label: 'x' }],
                items: [
                  { t: 'curve', f: 'sqrt(x)', from: 0, to: 4, color: 'a' },
                  { t: 'curve', f: '-sqrt(x)', from: 0, to: 4, color: 'a', dashed: true },
                  { t: 'vline', x: 'x0', color: 'result', dashed: true },
                  { t: 'dot', x: 'x0', y: 'sqrt(x0)', color: 'result', label: 'f(x)' },
                  { t: 'dot', x: 'x0', y: '-sqrt(x0)', color: 'result' },
                ],
                caption: {
                  en: 'Drag $x$: the dashed vertical segment is one slice\'s diameter, radius $f(x)$ on each side — rotate the whole region about the $x$-axis and every such slice sweeps out one circular disk of the solid.',
                  id: 'Geser $x$: segmen tegak putus-putus adalah diameter satu irisan, berjari-jari $f(x)$ di tiap sisinya — putar seluruh daerahnya mengelilingi sumbu-$x$ dan tiap irisan seperti itu menyapu satu cakram lingkaran benda putarnya.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A hole in the middle: the washer method', id: 'Lubang di tengah: metode cincin' },
              body: {
                en: 'Rotating the region **between** two curves $f(x) \\geq g(x)$ leaves a hole down the middle — every slice is a **washer**, an annulus with outer radius $f(x)$ and inner radius $g(x)$:\n$$V = \\int_a^b \\pi\\Big(\\big[f(x)\\big]^2 - \\big[g(x)\\big]^2\\Big)\\,dx$$\nFor the region between $y=x$ (outer, on top) and $y=x^2$ (inner) on $[0,1]$, rotated about the $x$-axis:\n$$V = \\pi\\int_0^1 \\big(x^2 - x^4\\big)\\,dx = \\pi\\left[\\frac{x^3}{3}-\\frac{x^5}{5}\\right]_0^1 = \\pi\\left(\\frac{1}{3}-\\frac{1}{5}\\right) = \\frac{2\\pi}{15} \\approx 0.42$$\nSquaring both radii before subtracting is essential — subtracting the radii first and squaring the difference is a different (wrong) quantity entirely.',
                id: 'Memutar daerah **di antara** dua kurva $f(x) \\geq g(x)$ menyisakan lubang di tengahnya — tiap irisan adalah sebuah **cincin**, sebuah anulus dengan jari-jari luar $f(x)$ dan jari-jari dalam $g(x)$:\n$$V = \\int_a^b \\pi\\Big(\\big[f(x)\\big]^2 - \\big[g(x)\\big]^2\\Big)\\,dx$$\nUntuk daerah di antara $y=x$ (luar, di atas) dan $y=x^2$ (dalam) pada $[0,1]$, diputar mengelilingi sumbu-$x$:\n$$V = \\pi\\int_0^1 \\big(x^2 - x^4\\big)\\,dx = \\pi\\left[\\frac{x^3}{3}-\\frac{x^5}{5}\\right]_0^1 = \\pi\\left(\\frac{1}{3}-\\frac{1}{5}\\right) = \\frac{2\\pi}{15} \\approx 0.42$$\nMengkuadratkan kedua jari-jari sebelum mengurangkan sangatlah penting — mengurangkan jari-jarinya lebih dahulu lalu mengkuadratkan selisihnya adalah besaran yang sama sekali berbeda (dan salah).',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why does the washer method square each radius before subtracting, rather than subtracting first?',
                id: 'Mengapa metode cincin mengkuadratkan tiap jari-jari sebelum mengurangkan, bukan mengurangkan lebih dahulu?',
              },
              options: [
                { en: 'The volume comes from the area of an annulus, $\\pi(R^2 - r^2)$, which is not the same as $\\pi(R-r)^2$', id: 'Volumenya berasal dari luas anulus, $\\pi(R^2 - r^2)$, yang tak sama dengan $\\pi(R-r)^2$' },
                { en: 'Squaring first and subtracting first always give the same result', id: 'Mengkuadratkan lebih dahulu dan mengurangkan lebih dahulu selalu memberi hasil yang sama' },
                { en: 'It is an arbitrary notational choice', id: 'Ini pilihan notasi yang sebarang' },
                { en: 'The washer method never actually squares anything', id: 'Metode cincin sebenarnya tak pernah mengkuadratkan apa pun' },
              ],
              answer: 0,
              explain: {
                en: 'The area of an annulus (a ring) is the outer circle\'s area minus the inner circle\'s area — each computed as $\\pi$ times its own radius squared, then subtracted. Squaring the difference of the radii instead computes something else entirely.',
                id: 'Luas anulus (sebuah cincin) adalah luas lingkaran luar dikurangi luas lingkaran dalam — masing-masing dihitung sebagai $\\pi$ dikali kuadrat jari-jarinya sendiri, baru dikurangkan. Mengkuadratkan selisih jari-jarinya malah menghitung sesuatu yang sama sekali berbeda.',
              },
              hint: {
                en: 'Write out the area of an annulus as the outer circle\'s area minus the inner circle\'s area, each using the standard circle-area formula — compare that to squaring the difference of the two radii directly.',
                id: 'Tulis luas anulus sebagai luas lingkaran luar dikurangi luas lingkaran dalam, masing-masing memakai rumus luas lingkaran standar — bandingkan itu dengan mengkuadratkan selisih kedua jari-jarinya langsung.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the figure above, what does the dashed segment at $x = 2$ represent?',
                id: 'Dengan membaca gambar di atas, apa yang direpresentasikan segmen putus-putus di $x = 2$?',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 4.5],
                ySpan: [-0.5, 2.5],
                ticks: true,
                items: [
                  { t: 'curve', f: 'sqrt(x)', from: 0, to: 4, color: 'a' },
                  { t: 'seg', from: [2, 0], to: [2, 1.414], color: 'result', dashed: true, label: 'f(2)' },
                ],
              },
              options: [
                { en: 'The radius of the disk swept out at $x = 2$ when the curve is rotated about the $x$-axis', id: 'Jari-jari cakram yang disapu di $x = 2$ ketika kurvanya diputar mengelilingi sumbu-$x$' },
                { en: 'The width of one integration strip', id: 'Lebar satu jalur integrasi' },
                { en: 'The volume of the entire solid', id: 'Volume seluruh benda' },
                { en: 'An asymptote of the function', id: 'Sebuah asimtot fungsinya' },
              ],
              answer: 0,
              explain: {
                en: 'Its length is $f(2) = \\sqrt{2}$ — exactly the radius of the circular disk that sweeping the curve at $x = 2$ around the $x$-axis produces.',
                id: 'Panjangnya adalah $f(2) = \\sqrt{2}$ — persis jari-jari cakram lingkaran yang dihasilkan menyapu kurva di $x = 2$ mengelilingi sumbu-$x$.',
              },
              hint: {
                en: 'The segment runs from the x-axis up to the curve at $x = 2$ — think about what that vertical distance becomes once the whole picture is spun around the x-axis.',
                id: 'Segmennya berjalan dari sumbu-x sampai ke kurva di $x = 2$ — pikirkan jarak tegak itu menjadi apa begitu seluruh gambarnya diputar mengelilingi sumbu-x.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the volume of the solid formed by rotating $y = \\sqrt{x}$ on $[1, 4]$ about the $x$-axis. (Round to two decimal places.)',
                id: 'Cari volume benda dari memutar $y = \\sqrt{x}$ pada $[1, 4]$ mengelilingi sumbu-$x$. (Bulatkan ke dua desimal.)',
              },
              blanks: [{ answer: 23.56 }],
              hints: [
                { en: '$V = \\pi \\displaystyle\\int_1^4 x\\,dx$.', id: '$V = \\pi \\displaystyle\\int_1^4 x\\,dx$.' },
              ],
              explain: {
                en: '$V = \\pi\\left[\\tfrac{x^2}{2}\\right]_1^4 = \\pi(8 - 0.5) = 7.5\\pi \\approx 23.56$.',
                id: '$V = \\pi\\left[\\tfrac{x^2}{2}\\right]_1^4 = \\pi(8 - 0.5) = 7.5\\pi \\approx 23{,}56$.',
              },
            },
          ],
        },
        {
          id: 'int-m6-s2-l2',
          title: { en: 'Cylindrical Shells', id: 'Kulit Silinder' },
          goal: {
            en: 'Find a volume of revolution by summing thin cylindrical shells, and check the result against the washer method.',
            id: 'Mencari volume benda putar dengan menjumlahkan kulit silinder yang tipis, dan memeriksa hasilnya terhadap metode cincin.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Wrapping a thin sheet around the axis instead of stacking coins', id: 'Membungkus lembaran tipis mengelilingi sumbu, bukan menumpuk koin' },
              body: {
                en: 'Rotating a region about the $y$-axis with disks would need $x$ solved as a function of $y$ — not always convenient. Instead, keep $x$ as the variable and picture a thin vertical strip at position $x$, height $f(x)$, thickness $dx$, spun around the $y$-axis: it sweeps out a thin cylindrical **shell** of radius $x$, height $f(x)$, whose surface area unrolls to $2\\pi x \\cdot f(x)$, giving volume $2\\pi x f(x)\\,dx$. Summing over all strips gives the **shell method**:\n$$V = \\int_a^b 2\\pi x\\,f(x)\\,dx$$\nFor $y=x^2$ on $[0,2]$, rotated about the $y$-axis:\n$$V = \\int_0^2 2\\pi x \\cdot x^2\\,dx = 2\\pi\\int_0^2 x^3\\,dx = 2\\pi\\left[\\frac{x^4}{4}\\right]_0^2 = 2\\pi(4) = 8\\pi$$',
                id: 'Memutar sebuah daerah mengelilingi sumbu-$y$ dengan cakram akan memerlukan $x$ diselesaikan sebagai fungsi dari $y$ — tak selalu mudah. Sebagai gantinya, pertahankan $x$ sebagai peubahnya dan bayangkan sebuah jalur tegak tipis di posisi $x$, tinggi $f(x)$, tebal $dx$, diputar mengelilingi sumbu-$y$: ia menyapu sebuah **kulit** silinder tipis berjari-jari $x$, tinggi $f(x)$, yang luas permukaannya tergulung menjadi $2\\pi x \\cdot f(x)$, memberi volume $2\\pi x f(x)\\,dx$. Menjumlahkan seluruh jalurnya memberi **metode kulit**:\n$$V = \\int_a^b 2\\pi x\\,f(x)\\,dx$$\nUntuk $y=x^2$ pada $[0,2]$, diputar mengelilingi sumbu-$y$:\n$$V = \\int_0^2 2\\pi x \\cdot x^2\\,dx = 2\\pi\\int_0^2 x^3\\,dx = 2\\pi\\left[\\frac{x^4}{4}\\right]_0^2 = 2\\pi(4) = 8\\pi$$',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The same solid, checked by washers in y', id: 'Benda yang sama, diperiksa dengan cincin dalam y' },
              body: {
                en: 'The same solid can be built with washers instead, using $y$ as the variable: solving $y=x^2$ for $x$ gives $x=\\sqrt{y}$, and for $y$ from $0$ to $4$, the solid runs from the axis out to $x=2$ (outer radius $2$, constant) with a "hole" carved out from $0$ to $\\sqrt{y}$ (inner radius $\\sqrt{y}$):\n$$V = \\int_0^4 \\pi\\Big(2^2 - \\big(\\sqrt{y}\\big)^2\\Big)\\,dy = \\pi\\int_0^4 (4-y)\\,dy = \\pi\\left[4y-\\frac{y^2}{2}\\right]_0^4 = \\pi(16-8) = 8\\pi$$\nExactly matching the shell computation. Shells avoided ever solving for $x$ in terms of $y$ — the two methods reach the identical solid from opposite directions, and either is valid; shells are simply less bookkeeping whenever inverting the function is awkward.',
                id: 'Benda yang sama bisa dibangun dengan cincin sebagai gantinya, memakai $y$ sebagai peubahnya: menyelesaikan $y=x^2$ untuk $x$ memberi $x=\\sqrt{y}$, dan untuk $y$ dari $0$ sampai $4$, bendanya berjalan dari sumbunya keluar sampai $x=2$ (jari-jari luar $2$, tetap) dengan sebuah "lubang" yang terukir dari $0$ sampai $\\sqrt{y}$ (jari-jari dalam $\\sqrt{y}$):\n$$V = \\int_0^4 \\pi\\Big(2^2 - \\big(\\sqrt{y}\\big)^2\\Big)\\,dy = \\pi\\int_0^4 (4-y)\\,dy = \\pi\\left[4y-\\frac{y^2}{2}\\right]_0^4 = \\pi(16-8) = 8\\pi$$\nPersis cocok dengan penghitungan kulitnya. Kulit menghindari harus menyelesaikan $x$ dalam bentuk $y$ sama sekali — kedua metode mencapai benda yang identik dari arah yang berlawanan, dan keduanya sah; kulit sekadar lebih sedikit pembukuan setiap kali membalik fungsinya merepotkan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What advantage does the shell method have over disks or washers when rotating about the y-axis?',
                id: 'Keunggulan apa yang dimiliki metode kulit dibanding cakram atau cincin ketika memutar mengelilingi sumbu-y?',
              },
              options: [
                { en: 'It keeps $x$ as the variable of integration, avoiding the need to solve for $x$ as a function of $y$', id: 'Ia mempertahankan $x$ sebagai peubah integrasi, menghindari keperluan menyelesaikan $x$ sebagai fungsi dari $y$' },
                { en: 'It always gives a different, more correct volume', id: 'Selalu memberi volume yang berbeda dan lebih benar' },
                { en: 'It never requires setting up an integral at all', id: 'Sama sekali tak memerlukan penyusunan integral' },
                { en: 'It only works when the region touches the y-axis', id: 'Hanya berlaku ketika daerahnya menyentuh sumbu-y' },
              ],
              answer: 0,
              explain: {
                en: 'Disks and washers around the $y$-axis need everything rewritten in terms of $y$. Shells let the strip stay described by $x$ and its height $f(x)$, which is often the more convenient direction to work in.',
                id: 'Cakram dan cincin mengelilingi sumbu-$y$ memerlukan segalanya ditulis ulang dalam bentuk $y$. Kulit membiarkan jalurnya tetap dideskripsikan oleh $x$ dan tingginya $f(x)$, yang sering menjadi arah yang lebih nyaman untuk dikerjakan.',
              },
              hint: {
                en: 'Disks and washers around the $y$-axis need the boundary curve rewritten as $x$ in terms of $y$ — think about which variable a shell\'s radius and height stay expressed in instead.',
                id: 'Cakram dan cincin mengelilingi sumbu-$y$ memerlukan kurva batasnya ditulis ulang sebagai $x$ dalam bentuk $y$ — pikirkan peubah mana yang tetap dipakai jari-jari dan tinggi kulit sebagai gantinya.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the steps of the shell method for rotating $y = x^3$ on $[0, 1]$ about the y-axis.',
                id: 'Susun langkah metode kulit untuk memutar $y = x^3$ pada $[0, 1]$ mengelilingi sumbu-y.',
              },
              lines: [
                'V = \\int_0^1 2\\pi x \\cdot x^3\\,dx',
                '= 2\\pi\\int_0^1 x^4\\,dx',
                '= 2\\pi\\left[\\dfrac{x^5}{5}\\right]_0^1',
                '= \\dfrac{2\\pi}{5}',
              ],
              explain: {
                en: 'Set up the shell integral with radius $x$ and height $f(x)$, simplify the integrand, antidifferentiate, then evaluate at the bounds.',
                id: 'Susun integral kulit dengan jari-jari $x$ dan tinggi $f(x)$, sederhanakan integrandnya, antiturunkan, lalu evaluasi pada batasnya.',
              },
              hint: {
                en: 'You can\'t antidifferentiate until the radius and height have actually been multiplied together into a single power of $x$ — and you can\'t plug in the bounds until that antiderivative has been found.',
                id: 'Kamu tak bisa mengantiturunkan sebelum jari-jari dan tingginya benar-benar dikalikan menjadi satu pangkat $x$ — dan kamu tak bisa memasukkan batasnya sebelum antiturunan itu ditemukan.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the volume formed by rotating $y = x^3$ on $[0, 1]$ about the y-axis using shells. (Round to two decimal places.)',
                id: 'Cari volume dari memutar $y = x^3$ pada $[0, 1]$ mengelilingi sumbu-y memakai kulit. (Bulatkan ke dua desimal.)',
              },
              blanks: [{ answer: 1.26 }],
              hints: [
                { en: '$V = 2\\pi \\displaystyle\\int_0^1 x^4\\,dx$.', id: '$V = 2\\pi \\displaystyle\\int_0^1 x^4\\,dx$.' },
              ],
              explain: {
                en: '$V = 2\\pi\\left[\\tfrac{x^5}{5}\\right]_0^1 = \\tfrac{2\\pi}{5} \\approx 1.26$.',
                id: '$V = 2\\pi\\left[\\tfrac{x^5}{5}\\right]_0^1 = \\tfrac{2\\pi}{5} \\approx 1{,}26$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'int-m6-s2-p',
        runtime: 'math',
        title: { en: 'Building Solids Two Ways', id: 'Membangun Benda dengan Dua Cara' },
        brief: {
          en: 'A disk volume, a washer volume, and a shell volume.',
          id: 'Satu volume cakram, satu volume cincin, dan satu volume kulit.',
        },
        requirements: [
          { en: 'A disk needs one radius squared; a washer needs outer squared minus inner squared.', id: 'Cakram memerlukan satu jari-jari yang dikuadratkan; cincin memerlukan luar dikuadratkan dikurangi dalam dikuadratkan.' },
          { en: 'A shell integrates $2\\pi \\cdot (\\text{radius}) \\cdot (\\text{height})$ over the axis perpendicular to the rotation axis.', id: 'Kulit mengintegralkan $2\\pi \\cdot (\\text{jari-jari}) \\cdot (\\text{tinggi})$ pada sumbu yang tegak lurus terhadap sumbu putarnya.' },
        ],
        tasks: [
          {
            prompt: { en: 'Find the volume from rotating $y = x^2$ on $[0, 2]$ about the x-axis. (Round to two decimal places.)', id: 'Cari volume dari memutar $y = x^2$ pada $[0, 2]$ mengelilingi sumbu-x. (Bulatkan ke dua desimal.)' },
            blanks: [{ answer: 20.11 }],
            solution: ['V = \\pi\\int_0^2 x^4\\,dx = \\pi\\left[\\tfrac{x^5}{5}\\right]_0^2 = \\tfrac{32\\pi}{5} \\approx 20{,}11'],
          },
          {
            prompt: { en: 'Find the volume from rotating the region between $y = \\sqrt{x}$ (outer) and $y = x$ (inner) on $[0, 1]$ about the x-axis. (Round to two decimal places.)', id: 'Cari volume dari memutar daerah antara $y = \\sqrt{x}$ (luar) dan $y = x$ (dalam) pada $[0, 1]$ mengelilingi sumbu-x. (Bulatkan ke dua desimal.)' },
            blanks: [{ answer: 0.52 }],
            solution: ['V = \\pi\\int_0^1 (x-x^2)\\,dx = \\pi\\left(\\tfrac12-\\tfrac13\\right) = \\tfrac{\\pi}{6} \\approx 0{,}52'],
          },
          {
            prompt: { en: 'Find the volume from rotating $y = x^2$ on $[0, 1]$ about the y-axis using shells. (Round to two decimal places.)', id: 'Cari volume dari memutar $y = x^2$ pada $[0, 1]$ mengelilingi sumbu-y memakai kulit. (Bulatkan ke dua desimal.)' },
            blanks: [{ answer: 1.57 }],
            solution: ['V = 2\\pi\\int_0^1 x^3\\,dx = 2\\pi\\left[\\tfrac{x^4}{4}\\right]_0^1 = \\tfrac{\\pi}{2} \\approx 1{,}57'],
          },
        ],
        hints: [
          { en: 'Part 2: $\\sqrt{x}$ is the outer radius on $[0, 1]$ since it lies above $y = x$ there — check a middle value like $x = 0.25$ if unsure.', id: 'Butir 2: $\\sqrt{x}$ adalah jari-jari luar pada $[0, 1]$ sebab berada di atas $y = x$ di situ — periksa nilai tengah seperti $x = 0.25$ bila ragu.' },
        ],
        xp: 50,
      },
    },
  ],
}
