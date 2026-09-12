import type { Module } from '../types'

/** An inserted module — placed second in the array, between the informal idea
 *  of a limit and the limit laws that lean on it, exactly where it sits in the
 *  book this course follows. Its id keeps the "m1b" shape rather than
 *  renumbering the modules after it: display order comes from array
 *  position, not from parsing the id string, so nothing downstream needs to
 *  change. Everything here answers one question Module 1 left open: "close"
 *  and "approaches" were never actually defined — only shown in pictures. */
export const moduleDef: Module = {
  id: 'lim-m1b',
  title: { en: 'The Precise Definition of a Limit', id: 'Definisi Presisi Limit' },
  summary: {
    en: 'Replacing "gets close to" with a definition precise enough to prove, verify, or disprove any specific limit.',
    id: 'Mengganti "mendekati" dengan definisi yang cukup presisi untuk membuktikan, memverifikasi, atau menyangkal limit tertentu mana pun.',
  },
  submodules: [
    /* ------------------------------------------------- 1. the epsilon-delta definition */
    {
      id: 'lim-m1b-s1',
      title: { en: 'The Epsilon-Delta Definition', id: 'Definisi Epsilon-Delta' },
      summary: {
        en: 'Turning "as close as you like" into two numbers, epsilon and delta, that can actually be found.',
        id: 'Mengubah "sedekat yang kamu suka" menjadi dua bilangan, epsilon dan delta, yang benar-benar bisa dicari.',
      },
      lessons: [
        {
          id: 'lim-m1b-s1-l1',
          title: { en: 'What the Definition Says', id: 'Apa yang Dikatakan Definisinya' },
          goal: {
            en: 'State the epsilon-delta definition of a limit, and find delta for a given epsilon on a linear function.',
            id: 'Menyatakan definisi epsilon-delta dari limit, dan mencari delta untuk epsilon tertentu pada fungsi linear.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A challenge that never stops, unless one number answers all of it', id: 'Tantangan yang tak pernah berhenti, kecuali satu bilangan menjawab semuanya' },
              body: {
                en: 'Module 1 said $\\lim_{x\\to c} f(x) = L$ means $f(x)$ "gets arbitrarily close" to $L$ as $x$ "gets close" to $c$ — true in spirit, but neither phrase says how close is close enough, or proves it for every case at once. Someone skeptical of a claimed limit could demand: keep $f(x)$ within $\\frac{1}{10}$ of $L$. Fine — restrict $x$ to some interval around $c$. Skeptical still, they demand $\\frac{1}{100}$. Restrict further. Then $\\frac{1}{100{,}000}$. This could continue forever, and no finite number of successful responses proves the limit — only a rule that answers **every** possible demand at once does.\n\nThat rule is the **epsilon-delta definition**. $\\varepsilon$ (epsilon) is the challenger\'s tolerance — how close to $L$ they demand; $\\delta$ (delta) is the response — how close to $c$ that guarantees it:\n$$\\lim_{x\\to c} f(x) = L \\iff \\text{for every } \\varepsilon>0, \\text{ there exists } \\delta>0 \\text{ such that } 0<|x-c|<\\delta \\ \\Rightarrow \\ |f(x)-L|<\\varepsilon$$\n"For every $\\varepsilon$" is what settles the challenge permanently — not one response, but a method that produces a working $\\delta$ no matter which $\\varepsilon$ is named.',
                id: 'Modul 1 menyatakan $\\lim_{x\\to c} f(x) = L$ berarti $f(x)$ "mendekati sedekat-dekatnya" ke $L$ saat $x$ "mendekat" ke $c$ — benar dalam semangatnya, tetapi tak satu pun frasa itu mengatakan seberapa dekat sudah cukup dekat, atau membuktikannya untuk semua kasus sekaligus. Seseorang yang skeptis terhadap klaim limit bisa menuntut: jaga $f(x)$ dalam jarak $\\frac{1}{10}$ dari $L$. Baik — batasi $x$ pada suatu interval di sekitar $c$. Masih skeptis, mereka menuntut $\\frac{1}{100}$. Batasi lagi. Lalu $\\frac{1}{100{.}000}$. Ini bisa berlanjut selamanya, dan tak ada jumlah tanggapan berhasil yang hingga yang membuktikan limitnya — hanya aturan yang menjawab **setiap** tuntutan yang mungkin sekaligus yang bisa.\n\nAturan itu adalah **definisi epsilon-delta**. $\\varepsilon$ (epsilon) adalah toleransi si penantang — seberapa dekat ke $L$ yang mereka tuntut; $\\delta$ (delta) adalah tanggapannya — seberapa dekat ke $c$ yang menjaminnya:\n$$\\lim_{x\\to c} f(x) = L \\iff \\text{untuk setiap } \\varepsilon>0, \\text{ ada } \\delta>0 \\text{ sedemikian sehingga } 0<|x-c|<\\delta \\ \\Rightarrow \\ |f(x)-L|<\\varepsilon$$\n"Untuk setiap $\\varepsilon$" itulah yang menuntaskan tantangannya secara permanen — bukan satu tanggapan, melainkan sebuah metode yang menghasilkan $\\delta$ yang berhasil tak peduli $\\varepsilon$ mana yang disebutkan.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Working backward from the epsilon-inequality', id: 'Bekerja mundur dari pertidaksamaan epsilon' },
              body: {
                en: 'Prove $\\lim_{x\\to 2}(3x+1) = 7$. Given any $\\varepsilon>0$, a matching $\\delta$ must be found. Start from what must be shown and simplify toward $|x-2|$:\n$$|f(x)-7| = |(3x+1)-7| = |3x-6| = 3|x-2|$$\nSo $|f(x)-7|<\\varepsilon$ exactly when $3|x-2|<\\varepsilon$, i.e. $|x-2|<\\frac{\\varepsilon}{3}$. Taking $\\delta = \\frac{\\varepsilon}{3}$ works: if $0<|x-2|<\\delta$, then $|f(x)-7| = 3|x-2| < 3\\delta = 3\\cdot\\frac{\\varepsilon}{3} = \\varepsilon$. For a linear function, $\\delta$ always falls out of dividing $\\varepsilon$ by the slope\'s size — no interval-guessing needed, because the gap scales exactly in proportion.',
                id: 'Buktikan $\\lim_{x\\to 2}(3x+1) = 7$. Diberikan $\\varepsilon>0$ mana pun, sebuah $\\delta$ yang cocok harus ditemukan. Mulai dari yang harus ditunjukkan dan sederhanakan menuju $|x-2|$:\n$$|f(x)-7| = |(3x+1)-7| = |3x-6| = 3|x-2|$$\nJadi $|f(x)-7|<\\varepsilon$ tepat ketika $3|x-2|<\\varepsilon$, yaitu $|x-2|<\\frac{\\varepsilon}{3}$. Mengambil $\\delta = \\frac{\\varepsilon}{3}$ berhasil: jika $0<|x-2|<\\delta$, maka $|f(x)-7| = 3|x-2| < 3\\delta = 3\\cdot\\frac{\\varepsilon}{3} = \\varepsilon$. Untuk fungsi linear, $\\delta$ selalu keluar dari membagi $\\varepsilon$ dengan besar kemiringannya — tak perlu menebak interval, sebab celahnya berskala tepat sebanding.',
              },
              figure: {
                dim: 2,
                xSpan: [0, 4],
                ySpan: [0, 13],
                ticks: true,
                params: [{ name: 'eps', min: 0.5, max: 3, step: 0.25, value: 1.5, label: 'ε' }],
                items: [
                  { t: 'curve', f: '3*x+1', color: 'a' },
                  { t: 'hline', y: '7+eps', color: 'muted', dashed: true },
                  { t: 'hline', y: '7-eps', color: 'muted', dashed: true },
                  { t: 'vline', x: '2+eps/3', color: 'b', dashed: true },
                  { t: 'vline', x: '2-eps/3', color: 'b', dashed: true },
                  { t: 'dot', x: 2, y: 7, color: 'result', label: '(2,7)' },
                ],
                caption: {
                  en: 'Shrink $\\varepsilon$: the matching $\\delta=\\varepsilon/3$ shrinks right along with it, and the curve inside the vertical band never once escapes the horizontal one — try to break it and you can\'t.',
                  id: 'Kecilkan $\\varepsilon$: $\\delta=\\varepsilon/3$ yang cocok ikut mengecil bersamanya, dan kurva di dalam pita tegaknya tak pernah sekali pun lolos dari pita mendatarnya — coba dobrak dan kamu tak akan bisa.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What makes the epsilon-delta definition settle a limit claim permanently, rather than just for one tolerance?',
                id: 'Apa yang membuat definisi epsilon-delta menuntaskan klaim limit secara permanen, bukan hanya untuk satu toleransi?',
              },
              options: [
                { en: 'It requires a matching delta to exist for every possible epsilon, not just one specific value', id: 'Ia mensyaratkan sebuah delta yang cocok ada untuk setiap epsilon yang mungkin, bukan hanya satu nilai tertentu' },
                { en: 'It only needs to be checked once, for epsilon equal to 1', id: 'Hanya perlu diperiksa sekali, untuk epsilon sama dengan 1' },
                { en: 'It replaces delta with a fixed number that never changes', id: 'Ia mengganti delta dengan bilangan tetap yang tak pernah berubah' },
                { en: 'It avoids ever mentioning how close x must be to c', id: 'Ia menghindari penyebutan seberapa dekat x harus ke c' },
              ],
              answer: 0,
              explain: {
                en: 'A single successful epsilon-delta pair only answers one challenge. The definition demands a method that produces a working delta for every epsilon whatsoever — that universality is what closes off every possible objection at once.',
                id: 'Satu pasangan epsilon-delta yang berhasil hanya menjawab satu tantangan. Definisinya menuntut sebuah metode yang menghasilkan delta yang berhasil untuk epsilon apa pun — universalitas itulah yang menutup setiap kemungkinan keberatan sekaligus.',
              },
              hint: {
                en: 'Re-read the "for every epsilon" phrase in the definition above — what would be missing if it instead said "for epsilon equal to 1"?',
                id: 'Baca ulang frasa "untuk setiap epsilon" pada definisi di atas — apa yang akan hilang bila dikatakan "untuk epsilon sama dengan 1"?',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the delta-finding steps for the limit of $(2x - 1)$ as $x$ approaches $3$, which equals $5$.',
                id: 'Lengkapi langkah pencarian delta untuk limit dari $(2x - 1)$ saat $x$ mendekati $3$, yang sama dengan $5$.',
              },
              template: '|(2x-1)-5| = |2x-6| = ___|x-3| < \\varepsilon \\ \\Rightarrow \\ |x-3| < \\varepsilon/___',
              blanks: ['2', '2'],
              explain: {
                en: 'Factoring $2x - 6$ gives $2|x-3|$, so the inequality $2|x-3| < \\varepsilon$ rearranges to $|x-3| < \\varepsilon/2$ — $\\delta$ is $\\varepsilon$ divided by the coefficient of $x$.',
                id: 'Memfaktorkan $2x - 6$ memberi $2|x-3|$, sehingga pertidaksamaan $2|x-3| < \\varepsilon$ ditata ulang menjadi $|x-3| < \\varepsilon/2$ — $\\delta$ adalah $\\varepsilon$ dibagi koefisien $x$-nya.',
              },
              hint: {
                en: 'Factor $2x - 6$ so that $|x - 3|$ appears on its own — what number is left multiplying it?',
                id: 'Faktorkan $2x - 6$ sehingga $|x - 3|$ muncul sendirian — bilangan apa yang tersisa mengalikannya?',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For the limit of $(4x - 5)$ as $x$ approaches $2$ (which equals $3$), find the $\\delta$ that works for $\\varepsilon = 0.02$.',
                id: 'Untuk limit dari $(4x - 5)$ saat $x$ mendekati $2$ (yang sama dengan $3$), cari $\\delta$ yang berhasil untuk $\\varepsilon = 0.02$.',
              },
              blanks: [{ answer: 0.005 }],
              hints: [
                { en: '$|(4x-5)-3| = 4|x-2|$, so $\\delta = \\varepsilon/4$.', id: '$|(4x-5)-3| = 4|x-2|$, sehingga $\\delta = \\varepsilon/4$.' },
              ],
              explain: {
                en: '$\\delta = 0.02/4 = 0.005$.',
                id: '$\\delta = 0.02/4 = 0.005$.',
              },
            },
          ],
        },
        {
          id: 'lim-m1b-s1-l2',
          title: { en: 'Finding Delta for a Curved Function', id: 'Mencari Delta untuk Fungsi Melengkung' },
          goal: {
            en: 'Find delta for a nonlinear function by solving the epsilon-inequality for an interval, then centring delta inside it.',
            id: 'Mencari delta untuk fungsi taklinear dengan menyelesaikan pertidaksamaan epsilon untuk sebuah interval, lalu memusatkan delta di dalamnya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A curve does not scale evenly, so an interval comes first', id: 'Kurva tak berskala merata, jadi interval didahulukan' },
              body: {
                en: 'A linear function\'s gap scales by a fixed factor everywhere, so $\\delta$ falls straight out of algebra. A curve like $f(x)=x^2$ does not — the gap between $x^2$ and $9$ grows at a different rate depending on where $x$ is. The fix is a two-step method: first solve $|f(x)-L|<\\varepsilon$ for an actual interval of $x$-values, then find how far $c$ sits from that interval\'s nearer edge — that distance is $\\delta$.\n\nProve $\\lim_{x\\to 3} x^2 = 9$. Solve $|x^2-9|<\\varepsilon$:\n$$9-\\varepsilon < x^2 < 9+\\varepsilon \\ \\Rightarrow \\ \\sqrt{9-\\varepsilon} < x < \\sqrt{9+\\varepsilon} \\quad (\\text{for } \\varepsilon<9)$$\nThis interval sits around $x=3$, but **not** symmetrically — the two sides are different distances from $3$.',
                id: 'Celah fungsi linear berskala dengan faktor tetap di mana-mana, sehingga $\\delta$ langsung keluar dari aljabar. Kurva seperti $f(x)=x^2$ tidak — celah antara $x^2$ dan $9$ bertumbuh dengan laju berbeda tergantung di mana $x$ berada. Perbaikannya adalah metode dua langkah: pertama selesaikan $|f(x)-L|<\\varepsilon$ untuk sebuah interval nilai $x$ yang sungguhan, lalu cari seberapa jauh $c$ duduk dari tepi interval itu yang lebih dekat — jarak itulah $\\delta$.\n\nBuktikan $\\lim_{x\\to 3} x^2 = 9$. Selesaikan $|x^2-9|<\\varepsilon$:\n$$9-\\varepsilon < x^2 < 9+\\varepsilon \\ \\Rightarrow \\ \\sqrt{9-\\varepsilon} < x < \\sqrt{9+\\varepsilon} \\quad (\\text{untuk } \\varepsilon<9)$$\nInterval ini duduk di sekitar $x=3$, tetapi **tidak** simetris — kedua sisinya berjarak berbeda dari $3$.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Taking the nearer edge, to be safe on both sides', id: 'Mengambil tepi yang lebih dekat, agar aman di kedua sisi' },
              body: {
                en: 'Since the interval $\\left(\\sqrt{9-\\varepsilon},\\ \\sqrt{9+\\varepsilon}\\right)$ is not centred at $3$, a symmetric window $(3-\\delta, 3+\\delta)$ can only be guaranteed to sit fully inside it if $\\delta$ is the **smaller** of the two distances to the edges:\n$$\\delta = \\min\\left\\{3-\\sqrt{9-\\varepsilon},\\ \\sqrt{9+\\varepsilon}-3\\right\\}$$\nTaking the smaller distance is what keeps **both** sides safe — using the larger one would let the window poke out past the nearer edge. For a concrete check, $\\varepsilon = 0.5$: $\\sqrt{8.5}\\approx 2.9155$ and $\\sqrt{9.5}\\approx 3.0822$, so the two candidate distances are $3-2.9155=0.0845$ and $3.0822-3=0.0822$; the smaller, $\\delta\\approx 0.0822$, is the one that works.',
                id: 'Karena interval $\\left(\\sqrt{9-\\varepsilon},\\ \\sqrt{9+\\varepsilon}\\right)$ tak berpusat di $3$, jendela simetris $(3-\\delta, 3+\\delta)$ hanya bisa dijamin duduk sepenuhnya di dalamnya bila $\\delta$ adalah yang **lebih kecil** dari kedua jarak ke tepinya:\n$$\\delta = \\min\\left\\{3-\\sqrt{9-\\varepsilon},\\ \\sqrt{9+\\varepsilon}-3\\right\\}$$\nMengambil jarak yang lebih kecil itulah yang menjaga **kedua** sisi tetap aman — memakai yang lebih besar akan membiarkan jendelanya menyembul melewati tepi yang lebih dekat. Untuk pemeriksaan konkret, $\\varepsilon = 0.5$: $\\sqrt{8.5}\\approx 2.9155$ dan $\\sqrt{9.5}\\approx 3.0822$, sehingga kedua jarak kandidatnya adalah $3-2.9155=0.0845$ dan $3.0822-3=0.0822$; yang lebih kecil, $\\delta\\approx 0.0822$, itulah yang berhasil.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why must delta be the smaller of the two edge-distances when the epsilon-interval is not symmetric about c?',
                id: 'Mengapa delta harus yang lebih kecil dari kedua jarak tepi ketika interval epsilonnya tak simetris terhadap c?',
              },
              options: [
                { en: 'Using the larger distance would let the symmetric window extend past the nearer edge, outside where the inequality was proven to hold', id: 'Memakai jarak yang lebih besar akan membiarkan jendela simetrisnya melewati tepi yang lebih dekat, keluar dari tempat pertidaksamaannya terbukti berlaku' },
                { en: 'Delta must always equal exactly half the interval\'s width', id: 'Delta selalu harus tepat setengah lebar intervalnya' },
                { en: 'It is an arbitrary convention with no consequence either way', id: 'Ini konvensi sebarang tanpa akibat apa pun' },
                { en: 'The larger distance is actually the correct choice instead', id: 'Jarak yang lebih besar sebenarnya pilihan yang benar' },
              ],
              answer: 0,
              explain: {
                en: 'A symmetric window (c - delta, c + delta) reaches equally far on both sides. If delta matched the farther edge, the window would overshoot the nearer edge, including x-values where the epsilon-inequality was never shown to hold.',
                id: 'Jendela simetris (c - delta, c + delta) menjangkau sama jauh di kedua sisi. Jika delta cocok dengan tepi yang lebih jauh, jendelanya akan melampaui tepi yang lebih dekat, memasukkan nilai x yang tak pernah ditunjukkan memenuhi pertidaksamaan epsilonnya.',
              },
              hint: {
                en: 'A symmetric window around $c$ reaches the same distance on both sides. If that shared distance were set to the farther edge, what would happen on the side with the nearer edge?',
                id: 'Jendela simetris di sekitar $c$ menjangkau jarak yang sama di kedua sisi. Bila jarak bersama itu diatur sesuai tepi yang lebih jauh, apa yang terjadi pada sisi dengan tepi yang lebih dekat?',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the two-step method as applied to proving $\\lim_{x\\to 3} x^2 = 9$, for a given $\\varepsilon$.',
                id: 'Susun metode dua langkah yang diterapkan untuk membuktikan $\\lim_{x\\to 3} x^2 = 9$, untuk $\\varepsilon$ tertentu.',
              },
              lines: [
                '\\text{Solve } |x^2-9|<\\varepsilon \\text{ for an interval of } x',
                '\\sqrt{9-\\varepsilon} < x < \\sqrt{9+\\varepsilon}',
                '\\text{Find the distance from } x=3 \\text{ to each edge}',
                '\\delta = \\min\\{3-\\sqrt{9-\\varepsilon},\\ \\sqrt{9+\\varepsilon}-3\\}',
              ],
              explain: {
                en: 'Solve the epsilon-inequality for an interval first, then measure from c to each edge, then take the smaller distance as delta.',
                id: 'Selesaikan pertidaksamaan epsilonnya untuk sebuah interval lebih dahulu, lalu ukur dari c ke tiap tepinya, baru ambil jarak yang lebih kecil sebagai delta.',
              },
              hint: {
                en: 'Two of these lines are instructions (what to do next) and two are the results of doing it. A result naming the interval\'s edges has to follow the instruction that solves for that interval, and the same pattern holds for the distance step.',
                id: 'Dua dari baris ini adalah instruksi (apa yang harus dilakukan selanjutnya) dan dua lagi adalah hasil dari melakukannya. Hasil yang menyebut tepi-tepi intervalnya harus mengikuti instruksi yang menyelesaikan interval itu, dan pola yang sama berlaku untuk langkah jaraknya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For the limit of $x^2$ as $x$ approaches $2$ (which equals $4$), with $\\varepsilon = 0.5$, find the two candidate distances and report the smaller one as $\\delta$. (Round to 4 decimal places.)',
                id: 'Untuk limit dari $x^2$ saat $x$ mendekati $2$ (yang sama dengan $4$), dengan $\\varepsilon = 0.5$, cari kedua jarak kandidatnya dan laporkan yang lebih kecil sebagai $\\delta$. (Bulatkan ke 4 desimal.)',
              },
              blanks: [{ answer: 0.1213, tol: 0.001 }],
              hints: [
                { en: '$\\sqrt{3.5} \\approx 1.8708$ and $\\sqrt{4.5} \\approx 2.1213$.', id: '$\\sqrt{3.5} \\approx 1.8708$ dan $\\sqrt{4.5} \\approx 2.1213$.' },
              ],
              explain: {
                en: 'Distances: $2 - 1.8708 = 0.1292$, and $2.1213 - 2 = 0.1213$. The smaller of the two, $0.1213$, is $\\delta$.',
                id: 'Jarak: $2 - 1.8708 = 0.1292$, dan $2.1213 - 2 = 0.1213$. Yang lebih kecil dari keduanya, $0.1213$, itulah $\\delta$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'lim-m1b-s1-p',
        runtime: 'math',
        title: { en: 'Finding Delta', id: 'Mencari Delta' },
        brief: {
          en: 'Two linear deltas and one delta found from a curved function.',
          id: 'Dua delta linear dan satu delta yang dicari dari fungsi melengkung.',
        },
        requirements: [
          { en: 'A linear function\'s $\\delta$ is $\\varepsilon$ divided by the size of its slope.', id: 'Delta fungsi linear adalah $\\varepsilon$ dibagi besar kemiringannya.' },
          { en: 'A curved function needs an interval solved first, then the nearer edge-distance taken as $\\delta$.', id: 'Fungsi melengkung memerlukan interval yang diselesaikan lebih dahulu, baru jarak tepi yang lebih dekat diambil sebagai $\\delta$.' },
        ],
        tasks: [
          {
            prompt: { en: 'For the limit of $(5x + 2)$ as $x$ approaches $1$ (which equals $7$), find $\\delta$ for $\\varepsilon = 0.1$.', id: 'Untuk limit dari $(5x + 2)$ saat $x$ mendekati $1$ (yang sama dengan $7$), cari $\\delta$ untuk $\\varepsilon = 0.1$.' },
            blanks: [{ answer: 0.02 }],
            solution: ['|(5x+2)-7| = 5|x-1| < \\varepsilon \\Rightarrow \\delta = \\varepsilon/5 = 0{,}02'],
          },
          {
            prompt: { en: 'For the limit of $(-2x + 3)$ as $x$ approaches $-1$ (which equals $5$), find $\\delta$ for $\\varepsilon = 0.06$.', id: 'Untuk limit dari $(-2x + 3)$ saat $x$ mendekati $-1$ (yang sama dengan $5$), cari $\\delta$ untuk $\\varepsilon = 0.06$.' },
            blanks: [{ answer: 0.03 }],
            solution: ['|(-2x+3)-5| = 2|x+1| < \\varepsilon \\Rightarrow \\delta = \\varepsilon/2 = 0{,}03'],
          },
          {
            prompt: { en: 'For the limit of $x^2$ as $x$ approaches $4$ (which equals $16$), with $\\varepsilon = 1$, find the two candidate distances and report the smaller as $\\delta$. (Round to 4 decimal places.)', id: 'Untuk limit dari $x^2$ saat $x$ mendekati $4$ (yang sama dengan $16$), dengan $\\varepsilon = 1$, cari kedua jarak kandidatnya dan laporkan yang lebih kecil sebagai $\\delta$. (Bulatkan ke 4 desimal.)' },
            blanks: [{ answer: 0.1231, tol: 0.001 }],
            solution: ['\\sqrt{15}\\approx 3{,}8730, \\quad \\sqrt{17}\\approx 4{,}1231', '4-3{,}8730 = 0{,}1270, \\quad 4{,}1231-4 = 0{,}1231', '\\delta = \\min\\{0{,}1270,\\ 0{,}1231\\} = 0{,}1231'],
          },
        ],
        hints: [
          { en: 'Part 3: keep at least 4 decimal places in the square roots before subtracting, or the two candidate distances become hard to compare accurately.', id: 'Butir 3: pertahankan setidaknya 4 desimal pada akarnya sebelum mengurangkan, atau kedua jarak kandidatnya sulit dibandingkan secara akurat.' },
        ],
        xp: 50,
      },
    },

    /* ----------------------------------------------------- 2. proving and disproving */
    {
      id: 'lim-m1b-s2',
      title: { en: 'Proving and Disproving with the Definition', id: 'Membuktikan dan Menyangkal dengan Definisi' },
      summary: {
        en: 'Using the definition to prove a general limit law, and to show that a specific candidate limit is wrong.',
        id: 'Memakai definisi untuk membuktikan hukum limit secara umum, dan untuk menunjukkan kandidat limit tertentu itu salah.',
      },
      lessons: [
        {
          id: 'lim-m1b-s2-l1',
          title: { en: 'Proving the Sum Rule', id: 'Membuktikan Hukum Jumlah' },
          goal: {
            en: 'Prove that the limit of a sum is the sum of the limits, using the epsilon-delta definition and the triangle inequality.',
            id: 'Membuktikan bahwa limit dari sebuah jumlah adalah jumlah dari limitnya, memakai definisi epsilon-delta dan pertidaksamaan segitiga.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'What Module 2 assumed, this definition can finally prove', id: 'Yang diasumsikan Modul 2, definisi ini akhirnya bisa membuktikan' },
              body: {
                en: 'The Sum Law — $\\lim_{x\\to c}\\big(f(x)+g(x)\\big) = \\lim_{x\\to c}f(x) + \\lim_{x\\to c}g(x)$ — was simply stated and used. The epsilon-delta definition is what actually proves it. Suppose $\\lim_{x\\to c}f(x)=L$ and $\\lim_{x\\to c}g(x)=M$. Given any $\\varepsilon>0$, the goal is a $\\delta>0$ with $\\big|(f(x)+g(x))-(L+M)\\big|<\\varepsilon$ whenever $0<|x-c|<\\delta$.\n\nRegroup the target expression around the two known limits:\n$$\\big|(f(x)+g(x))-(L+M)\\big| = \\big|(f(x)-L)+(g(x)-M)\\big| \\leq |f(x)-L| + |g(x)-M|$$\nusing the **triangle inequality**, $|a+b|\\leq |a|+|b|$ — the total error is at most the sum of the two separate errors.',
                id: 'Hukum Jumlah — $\\lim_{x\\to c}\\big(f(x)+g(x)\\big) = \\lim_{x\\to c}f(x) + \\lim_{x\\to c}g(x)$ — sekadar dinyatakan dan dipakai. Definisi epsilon-delta inilah yang sungguh membuktikannya. Misalkan $\\lim_{x\\to c}f(x)=L$ dan $\\lim_{x\\to c}g(x)=M$. Diberikan $\\varepsilon>0$ mana pun, tujuannya adalah sebuah $\\delta>0$ dengan $\\big|(f(x)+g(x))-(L+M)\\big|<\\varepsilon$ setiap kali $0<|x-c|<\\delta$.\n\nKelompokkan ulang ekspresi tujuannya di sekitar kedua limit yang diketahui:\n$$\\big|(f(x)+g(x))-(L+M)\\big| = \\big|(f(x)-L)+(g(x)-M)\\big| \\leq |f(x)-L| + |g(x)-M|$$\nmemakai **pertidaksamaan segitiga**, $|a+b|\\leq |a|+|b|$ — total galatnya paling banyak adalah jumlah kedua galat terpisahnya.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Splitting the tolerance in half, and taking the stricter delta', id: 'Membagi toleransinya dua, dan mengambil delta yang lebih ketat' },
              body: {
                en: 'Since $\\lim_{x\\to c}f(x)=L$, applying the definition with tolerance $\\frac{\\varepsilon}{2}$ (a perfectly legal choice — the definition must hold for **every** positive tolerance) gives some $\\delta_1>0$ with $|f(x)-L|<\\frac{\\varepsilon}{2}$ whenever $0<|x-c|<\\delta_1$. Likewise $\\lim_{x\\to c}g(x)=M$ gives some $\\delta_2>0$ with $|g(x)-M|<\\frac{\\varepsilon}{2}$ whenever $0<|x-c|<\\delta_2$.\n\nTaking $\\delta=\\min\\{\\delta_1,\\delta_2\\}$ guarantees **both** bounds hold simultaneously whenever $0<|x-c|<\\delta$:\n$$\\big|(f(x)+g(x))-(L+M)\\big| \\leq |f(x)-L|+|g(x)-M| < \\frac{\\varepsilon}{2}+\\frac{\\varepsilon}{2} = \\varepsilon$$\nThis is a genuinely different kind of proof from Lesson 1\'s — no specific function was ever named. It holds for **any** $f$ and $g$ with limits, which is exactly why it earns the name "law" rather than "example".',
                id: 'Karena $\\lim_{x\\to c}f(x)=L$, menerapkan definisinya dengan toleransi $\\frac{\\varepsilon}{2}$ (pilihan yang sepenuhnya sah — definisinya harus berlaku untuk **setiap** toleransi positif) memberi suatu $\\delta_1>0$ dengan $|f(x)-L|<\\frac{\\varepsilon}{2}$ setiap kali $0<|x-c|<\\delta_1$. Begitu pula $\\lim_{x\\to c}g(x)=M$ memberi suatu $\\delta_2>0$ dengan $|g(x)-M|<\\frac{\\varepsilon}{2}$ setiap kali $0<|x-c|<\\delta_2$.\n\nMengambil $\\delta=\\min\\{\\delta_1,\\delta_2\\}$ menjamin **kedua** batasnya berlaku sekaligus setiap kali $0<|x-c|<\\delta$:\n$$\\big|(f(x)+g(x))-(L+M)\\big| \\leq |f(x)-L|+|g(x)-M| < \\frac{\\varepsilon}{2}+\\frac{\\varepsilon}{2} = \\varepsilon$$\nIni jenis bukti yang sungguh berbeda dari Pelajaran 1 — tak ada fungsi tertentu yang pernah disebutkan. Ini berlaku untuk $f$ dan $g$ **mana pun** yang punya limit, dan itulah persis sebabnya ia layak disebut "hukum", bukan "contoh".',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why is the tolerance split into $\\varepsilon/2$ for each of $f$ and $g$, rather than $\\varepsilon$ for each?',
                id: 'Mengapa toleransinya dibagi menjadi $\\varepsilon/2$ untuk masing-masing $f$ dan $g$, bukan $\\varepsilon$ untuk masing-masing?',
              },
              options: [
                { en: 'So that the two errors, added together by the triangle inequality, total at most $\\varepsilon$ rather than $2\\varepsilon$', id: 'Agar kedua galatnya, dijumlahkan lewat pertidaksamaan segitiga, bertotal paling banyak $\\varepsilon$, bukan $2\\varepsilon$' },
                { en: 'Because $\\delta$ must always be exactly half of $\\varepsilon$', id: 'Sebab $\\delta$ selalu harus tepat setengah dari $\\varepsilon$' },
                { en: 'It is an arbitrary simplification with no real justification', id: 'Ini penyederhanaan sebarang tanpa pembenaran sungguhan' },
                { en: 'Because $f$ and $g$ must have exactly the same limit', id: 'Sebab $f$ dan $g$ harus punya limit yang persis sama' },
              ],
              answer: 0,
              explain: {
                en: 'The triangle inequality bounds the total error by the sum of the two individual errors. Keeping each individual error under $\\varepsilon/2$ makes that sum come out under $\\varepsilon$ exactly — using $\\varepsilon$ for each would only guarantee a bound of $2\\varepsilon$.',
                id: 'Pertidaksamaan segitiga membatasi total galat dengan jumlah kedua galat individunya. Menjaga tiap galat individu di bawah $\\varepsilon/2$ membuat jumlah itu keluar tepat di bawah $\\varepsilon$ — memakai $\\varepsilon$ untuk masing-masing hanya akan menjamin batas $2\\varepsilon$.',
              },
              hint: {
                en: 'The triangle inequality adds the two individual errors together. What total would you get by adding two things each kept under $\\varepsilon/2$, versus two things each kept under $\\varepsilon$?',
                id: 'Pertidaksamaan segitiga menjumlahkan kedua galat individunya. Total apa yang kamu dapat dari menjumlahkan dua hal yang masing-masing dijaga di bawah $\\varepsilon/2$, dibandingkan dengan dua hal yang masing-masing di bawah $\\varepsilon$?',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the final step of the sum rule proof.',
                id: 'Lengkapi langkah terakhir bukti hukum jumlah.',
              },
              template: '|f(x)-L| + |g(x)-M| < \\varepsilon/___ + \\varepsilon/___ = \\varepsilon',
              blanks: ['2', '2'],
              explain: {
                en: 'Each piece is held under $\\varepsilon/2$ by construction, and the two halves recombine to exactly $\\varepsilon$.',
                id: 'Tiap bagian dijaga di bawah $\\varepsilon/2$ menurut konstruksinya, dan kedua setengahnya bergabung kembali menjadi tepat $\\varepsilon$.',
              },
              hint: {
                en: 'Each of $|f(x)-L|$ and $|g(x)-M|$ was arranged in the concept above to be held under the same fraction of $\\varepsilon$ — what fraction, and what do two of them add up to?',
                id: 'Baik $|f(x)-L|$ maupun $|g(x)-M|$ diatur pada konsep di atas agar dijaga di bawah pecahan yang sama dari $\\varepsilon$ — pecahan berapa, dan berapa jumlah keduanya?',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'In the sum rule proof, if $\\delta_1 = 0.03$ and $\\delta_2 = 0.05$ for a given $\\varepsilon$, what value must the final $\\delta$ be?',
                id: 'Dalam bukti hukum jumlah, jika $\\delta_1 = 0.03$ dan $\\delta_2 = 0.05$ untuk $\\varepsilon$ tertentu, berapa nilai $\\delta$ akhir yang harus dipakai?',
              },
              blanks: [{ answer: 0.03 }],
              hints: [
                { en: '$\\delta = \\min\\{\\delta_1, \\delta_2\\}$.', id: '$\\delta = \\min\\{\\delta_1, \\delta_2\\}$.' },
              ],
              explain: {
                en: 'The smaller of the two, $0.03$, is the only value guaranteed to satisfy both conditions at once.',
                id: 'Yang lebih kecil dari keduanya, $0.03$, adalah satu-satunya nilai yang dijamin memenuhi kedua syaratnya sekaligus.',
              },
            },
          ],
        },
        {
          id: 'lim-m1b-s2-l2',
          title: { en: 'Showing a Candidate Limit Is Wrong', id: 'Menunjukkan Kandidat Limit Itu Salah' },
          goal: {
            en: 'Use a single well-chosen epsilon to prove that a proposed limit value is not the actual limit.',
            id: 'Memakai satu epsilon yang dipilih dengan tepat untuk membuktikan nilai limit yang diusulkan bukanlah limit yang sebenarnya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Disproving needs only one epsilon that defeats every delta', id: 'Menyangkal hanya perlu satu epsilon yang mengalahkan setiap delta' },
              body: {
                en: 'Proving a limit needs a working $\\delta$ for **every** $\\varepsilon$. Disproving one is the logical opposite, and therefore easier: find just **one** $\\varepsilon>0$ for which **no** $\\delta>0$ works — meaning for every candidate $\\delta$, some $x$ within $\\delta$ of $c$ still lands outside $\\varepsilon$ of the proposed $L$.\n\nLet $f(x)=2x$ for $x<1$ and $f(x)=2x+1$ for $x\\geq 1$ — a jump of size $1$ at $x=1$. Someone claims $\\lim_{x\\to 1}f(x)=2$. Take $\\varepsilon = 0.4$. No matter how small $\\delta$ is chosen, the interval $(1,1+\\delta)$ contains points where $f(x)=2x+1$ is just above $3$ — and $|3-2|=1 > 0.4$. So $\\delta$ can never keep every nearby $f(x)$ within $0.4$ of $2$: the claim fails.',
                id: 'Membuktikan limit memerlukan $\\delta$ yang berhasil untuk **setiap** $\\varepsilon$. Menyangkalnya adalah kebalikan logisnya, dan karenanya lebih mudah: cari hanya **satu** $\\varepsilon>0$ yang untuknya **tak ada** $\\delta>0$ yang berhasil — artinya untuk setiap $\\delta$ kandidat, ada $x$ dalam jarak $\\delta$ dari $c$ yang tetap mendarat di luar jarak $\\varepsilon$ dari $L$ yang diusulkan.\n\nMisalkan $f(x)=2x$ untuk $x<1$ dan $f(x)=2x+1$ untuk $x\\geq 1$ — sebuah lompatan sebesar $1$ di $x=1$. Seseorang mengklaim $\\lim_{x\\to 1}f(x)=2$. Ambil $\\varepsilon = 0.4$. Tak peduli seberapa kecil $\\delta$ dipilih, interval $(1,1+\\delta)$ memuat titik-titik tempat $f(x)=2x+1$ sedikit di atas $3$ — dan $|3-2|=1 > 0.4$. Jadi $\\delta$ tak pernah bisa menjaga setiap $f(x)$ di dekatnya dalam jarak $0.4$ dari $2$: klaimnya gagal.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.5, 2.5],
                ySpan: [-0.5, 5.5],
                ticks: true,
                items: [
                  { t: 'curve', f: '2*x', from: -0.5, to: 1, color: 'a' },
                  { t: 'curve', f: '2*x+1', from: 1, to: 2.5, color: 'a' },
                  { t: 'dot', x: 1, y: 2, color: 'a', open: true },
                  { t: 'dot', x: 1, y: 3, color: 'result' },
                ],
                caption: {
                  en: 'A jump of size $1$ at $x = 1$ — no $\\delta$ can keep every nearby $f(x)$ within $0.4$ of the claimed limit $2$, since values just right of $x = 1$ sit near $3$.',
                  id: 'Lompatan sebesar $1$ di $x = 1$ — tak ada $\\delta$ yang bisa menjaga setiap $f(x)$ di dekatnya dalam jarak $0.4$ dari limit yang diklaim, $2$, sebab nilai tepat di kanan $x = 1$ duduk dekat $3$.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The true limit does not even exist here', id: 'Limit sebenarnya bahkan tak ada di sini' },
              body: {
                en: 'The same jump defeats **any** proposed value of $L$, not just $2$ — an $\\varepsilon$ smaller than half the jump size ($0.5$ here) always traps either the left-hand values near $2$ or the right-hand values near $3$ outside of it, whichever $L$ is claimed. This matches Module 1\'s informal observation that a jump discontinuity has no two-sided limit — the epsilon-delta definition now makes that claim airtight rather than visual. Disproving a specific wrong guess and disproving **every possible** guess are different tasks, but the same single counterexample often settles both at once.',
                id: 'Lompatan yang sama mengalahkan nilai $L$ yang diusulkan **mana pun**, bukan hanya $2$ — sebuah $\\varepsilon$ yang lebih kecil dari setengah besar lompatannya ($0.5$ di sini) selalu menjebak entah nilai kiri di dekat $2$ atau nilai kanan di dekat $3$ di luar jangkauannya, $L$ mana pun yang diklaim. Ini cocok dengan pengamatan informal Modul 1 bahwa diskontinuitas lompat tak punya limit dua sisi — definisi epsilon-delta kini membuat klaim itu kokoh, bukan sekadar visual. Menyangkal satu tebakan salah tertentu dan menyangkal **setiap kemungkinan** tebakan adalah tugas yang berbeda, tetapi contoh penyangkal tunggal yang sama sering menuntaskan keduanya sekaligus.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'To disprove a claimed limit, how many values of $\\varepsilon$ must be shown to defeat every $\\delta$?',
                id: 'Untuk menyangkal limit yang diklaim, berapa banyak nilai $\\varepsilon$ yang harus ditunjukkan mengalahkan setiap $\\delta$?',
              },
              options: [
                { en: 'Just one — a single $\\varepsilon$ for which no $\\delta$ works is enough', id: 'Hanya satu — satu $\\varepsilon$ yang untuknya tak ada $\\delta$ yang berhasil sudah cukup' },
                { en: 'Every possible $\\varepsilon$ must be checked individually', id: 'Setiap $\\varepsilon$ yang mungkin harus diperiksa satu per satu' },
                { en: 'Exactly two, one from each side of the point', id: 'Tepat dua, satu dari tiap sisi titiknya' },
                { en: 'None — a claimed limit can never actually be disproved', id: 'Tak ada — limit yang diklaim tak pernah bisa disangkal' },
              ],
              answer: 0,
              explain: {
                en: 'Proving needs a working $\\delta$ for every $\\varepsilon$; disproving is the logical negation, so exhibiting just one $\\varepsilon$ that defeats every $\\delta$ is sufficient to break the universal claim.',
                id: 'Membuktikan memerlukan $\\delta$ yang berhasil untuk setiap $\\varepsilon$; menyangkal adalah negasi logisnya, sehingga menunjukkan hanya satu $\\varepsilon$ yang mengalahkan setiap $\\delta$ sudah cukup untuk mematahkan klaim universalnya.',
              },
              hint: {
                en: 'Proving needed the claim to hold for every epsilon. What is the logical opposite of "holds for every epsilon" — does breaking that require checking all of them, or finding just one that fails?',
                id: 'Membuktikan mengharuskan klaimnya berlaku untuk setiap epsilon. Apa lawan logis dari "berlaku untuk setiap epsilon" — apakah mematahkannya memerlukan memeriksa semuanya, atau cukup menemukan satu yang gagal?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the figure above, why does $\\varepsilon = 0.4$ defeat the claim that the limit at $x = 1$ is $2$?',
                id: 'Dengan membaca gambar di atas, mengapa $\\varepsilon = 0.4$ mengalahkan klaim bahwa limit di $x = 1$ adalah $2$?',
              },
              figure: {
                dim: 2,
                xSpan: [-0.5, 2.5],
                ySpan: [-0.5, 5.5],
                ticks: true,
                items: [
                  { t: 'curve', f: '2*x', from: -0.5, to: 1, color: 'a' },
                  { t: 'curve', f: '2*x+1', from: 1, to: 2.5, color: 'a' },
                  { t: 'dot', x: 1, y: 2, color: 'a', open: true },
                  { t: 'dot', x: 1, y: 3, color: 'result' },
                ],
              },
              options: [
                { en: 'Points just to the right of $x = 1$ sit near $y = 3$, which is farther than $0.4$ from the claimed limit $2$', id: 'Titik tepat di kanan $x = 1$ duduk dekat $y = 3$, yang lebih jauh dari $0.4$ dari limit yang diklaim, $2$' },
                { en: 'The function is undefined at $x = 1$', id: 'Fungsinya tak terdefinisi di $x = 1$' },
                { en: 'The curve is a straight line with no jump at all', id: 'Kurvanya garis lurus tanpa lompatan sama sekali' },
                { en: '$\\varepsilon = 0.4$ is larger than the jump itself', id: '$\\varepsilon = 0.4$ lebih besar dari lompatannya sendiri' },
              ],
              answer: 0,
              explain: {
                en: 'No matter how small a $\\delta$-window is drawn around $x = 1$, it always contains points just to the right where $f(x)$ is near $3$ — a distance of about $1$ from the claimed limit of $2$, which is well outside the $0.4$ tolerance.',
                id: 'Tak peduli seberapa kecil jendela-$\\delta$ digambar di sekitar $x = 1$, ia selalu memuat titik tepat di kanan tempat $f(x)$ dekat $3$ — berjarak sekitar $1$ dari limit yang diklaim, $2$, yang jauh di luar toleransi $0.4$.',
              },
              hint: {
                en: 'Look at what height the right-hand branch sits at just past $x = 1$, and measure how far that height is from the claimed limit of $2$ — compare that distance to $0.4$.',
                id: 'Perhatikan ketinggian tempat cabang kanan berada tepat setelah $x = 1$, dan ukur seberapa jauh ketinggian itu dari limit yang diklaim, $2$ — bandingkan jarak itu dengan $0.4$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'A function jumps from 5 to 8 at $x = 2$. What is the largest $\\varepsilon$ guaranteed to defeat any claimed limit value at $x = 2$? (Half the jump size.)',
                id: 'Sebuah fungsi melompat dari 5 ke 8 di $x = 2$. Berapa $\\varepsilon$ terbesar yang dijamin mengalahkan nilai limit yang diklaim di $x = 2$? (Setengah besar lompatannya.)',
              },
              blanks: [{ answer: 1.5 }],
              hints: [
                { en: 'The jump size is $8 - 5 = 3$.', id: 'Besar lompatannya adalah $8 - 5 = 3$.' },
              ],
              explain: {
                en: 'Half of $3$ is $1.5$ — any $\\varepsilon$ up to this size is small enough that no single $L$ can keep both sides of the jump within $\\varepsilon$ of it.',
                id: 'Setengah dari $3$ adalah $1.5$ — $\\varepsilon$ berapa pun hingga besar ini cukup kecil sehingga tak ada satu $L$ pun yang bisa menjaga kedua sisi lompatannya dalam jarak $\\varepsilon$ darinya.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'lim-m1b-s2-p',
        runtime: 'math',
        title: { en: 'Proofs and Counterexamples', id: 'Bukti dan Contoh Penyangkal' },
        brief: {
          en: 'One sum-rule delta combination, and two jump-discontinuity counterexamples.',
          id: 'Satu kombinasi delta hukum jumlah, dan dua contoh penyangkal diskontinuitas lompat.',
        },
        requirements: [
          { en: 'The sum rule\'s final $\\delta$ is always the smaller of the two individual deltas.', id: 'Delta akhir hukum jumlah selalu yang lebih kecil dari kedua delta individunya.' },
          { en: 'A jump of size $J$ can always be defeated by any $\\varepsilon$ up to $J/2$.', id: 'Lompatan sebesar $J$ selalu bisa dikalahkan oleh $\\varepsilon$ berapa pun hingga $J/2$.' },
        ],
        tasks: [
          {
            prompt: { en: 'In a sum rule proof, $\\delta_1 = 0.12$ and $\\delta_2 = 0.07$ for a given $\\varepsilon$. What is the final $\\delta$?', id: 'Dalam bukti hukum jumlah, $\\delta_1 = 0.12$ dan $\\delta_2 = 0.07$ untuk $\\varepsilon$ tertentu. Berapa $\\delta$ akhirnya?' },
            blanks: [{ answer: 0.07 }],
            solution: ['\\delta = \\min\\{0{,}12,\\ 0{,}07\\} = 0{,}07'],
          },
          {
            prompt: { en: 'A function jumps from 10 to 16 at $x = 5$. What is the largest $\\varepsilon$ guaranteed to defeat any claimed limit at $x = 5$?', id: 'Sebuah fungsi melompat dari 10 ke 16 di $x = 5$. Berapa $\\varepsilon$ terbesar yang dijamin mengalahkan limit yang diklaim di $x = 5$?' },
            blanks: [{ answer: 3 }],
            solution: ['\\text{jump} = 16-10 = 6, \\quad \\varepsilon = 6/2 = 3'],
          },
          {
            prompt: { en: 'A function jumps from -2 to 3 at $x = 0$. What is the largest $\\varepsilon$ guaranteed to defeat any claimed limit at $x = 0$?', id: 'Sebuah fungsi melompat dari -2 ke 3 di $x = 0$. Berapa $\\varepsilon$ terbesar yang dijamin mengalahkan limit yang diklaim di $x = 0$?' },
            blanks: [{ answer: 2.5 }],
            solution: ['\\text{jump} = 3-(-2) = 5, \\quad \\varepsilon = 5/2 = 2{,}5'],
          },
        ],
        hints: [
          { en: 'The jump size is always the distance between the two one-sided values, regardless of their signs.', id: 'Besar lompatannya selalu jarak antara kedua nilai sepihaknya, tak peduli tandanya.' },
        ],
        xp: 50,
      },
    },
  ],
}
