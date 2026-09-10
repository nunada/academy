import type { Module } from '../types'

/** Module 6 — Module 5's curve-sketching tests quietly assumed two things:
 *  that a local extremum can only happen where the derivative is zero or
 *  undefined, and that finding where a function is biggest or smallest on a
 *  bounded interval is a finite, checkable procedure. Both assumptions get
 *  their proof and their procedure here — and the Mean Value Theorem this
 *  module ends on turns out to be the reason the Integral course's "family
 *  of antiderivatives" was ever allowed to say "the only difference is a
 *  constant" in the first place. */
export const module6: Module = {
  id: 'tur-m6',
  title: { en: 'Extreme Values and the Mean Value Theorem', id: 'Nilai Ekstrem dan Teorema Nilai Rata-rata' },
  summary: {
    en: 'Local versus absolute extrema, the closed interval method for finding them exactly, and the theorem behind why an antiderivative family is only ever off by a constant.',
    id: 'Ekstrem lokal berbanding mutlak, metode selang tertutup untuk menemukannya secara eksak, dan teorema di balik mengapa keluarga antiturunan hanya pernah berbeda oleh sebuah konstanta.',
  },
  submodules: [
    /* ------------------------------------------------------ 6.1 extreme values */
    {
      id: 'tur-m6-s1',
      title: { en: 'Extreme Values of a Function', id: 'Nilai Ekstrem Sebuah Fungsi' },
      summary: {
        en: 'Local extrema versus absolute extrema on a whole interval, and the theorem that pins every local extremum to a critical point.',
        id: 'Ekstrem lokal berbanding ekstrem mutlak pada seluruh interval, dan teorema yang memastikan setiap ekstrem lokal berada di titik kritis.',
      },
      lessons: [
        {
          id: 'tur-m6-s1-l1',
          title: { en: 'Local and Absolute Extrema', id: 'Ekstrem Lokal dan Mutlak' },
          goal: {
            en: 'Distinguish a local extremum from an absolute one, and prove that a local extremum can only occur at a critical point.',
            id: 'Membedakan ekstrem lokal dari ekstrem mutlak, dan membuktikan bahwa ekstrem lokal hanya bisa terjadi di titik kritis.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Biggest nearby, versus biggest anywhere', id: 'Terbesar di sekitarnya, berbanding terbesar di mana pun' },
              body: {
                en: 'Module 5 used "local maximum" and "local minimum" informally: a point where $f$ turns from increasing to decreasing, or back. Formally, $f$ has a **local maximum** at $c$ if $f(c) \\geq f(x)$ for every $x$ near $c$; a **local minimum** if $f(c) \\leq f(x)$ nearby. Neither claim says anything about points far away.\n\nAn **absolute maximum** on an interval is stronger: $f(c) \\geq f(x)$ for *every* $x$ in that entire interval, not just nearby ones. A function can have several local maxima with different heights — only the tallest one is also an absolute maximum, and on a closed interval the absolute extremum might not be a local one at all: it can sit right at an endpoint, where the function does not turn, it simply stops.',
                id: 'Modul 5 memakai "maksimum lokal" dan "minimum lokal" secara informal: titik tempat $f$ berbalik dari naik menjadi turun, atau sebaliknya. Secara formal, $f$ punya **maksimum lokal** di $c$ jika $f(c) \\geq f(x)$ untuk setiap $x$ di dekat $c$; **minimum lokal** jika $f(c) \\leq f(x)$ di dekatnya. Tak satu pun klaim itu mengatakan apa pun tentang titik yang jauh.\n\n**Maksimum mutlak** pada suatu interval lebih kuat: $f(c) \\geq f(x)$ untuk *setiap* $x$ di seluruh interval itu, bukan hanya yang di dekatnya. Sebuah fungsi bisa punya beberapa maksimum lokal dengan tinggi berbeda-beda — hanya yang tertinggi yang juga maksimum mutlak, dan pada interval tertutup ekstrem mutlaknya mungkin bukan ekstrem lokal sama sekali: ia bisa duduk tepat di titik ujung, tempat fungsinya tak berbalik, ia sekadar berhenti.',
              },
              figure: {
                dim: 2,
                xSpan: [-2.5, 3.5],
                ySpan: [-4, 20],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^3-3*x', from: -2, to: 3, color: 'a' },
                  { t: 'dot', x: -1, y: 2, color: 'b', label: '(-1, 2)' },
                  { t: 'dot', x: 3, y: 18, color: 'result', label: '(3, 18)' },
                ],
                caption: {
                  en: 'On [-2, 3], f(x) = x^3 - 3x has a local maximum at (-1, 2) — but the absolute maximum on this interval is at the endpoint (3, 18), far taller and not a local extremum at all.',
                  id: 'Pada [-2, 3], f(x) = x^3 - 3x punya maksimum lokal di (-1, 2) — tetapi maksimum mutlak pada interval ini ada di titik ujung (3, 18), jauh lebih tinggi dan sama sekali bukan ekstrem lokal.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Why the search can stop at critical points', id: 'Mengapa pencariannya bisa berhenti di titik kritis' },
              body: {
                en: '**Fermat\'s Theorem**: if $f$ has a local extremum at an interior point $c$ and $f\'(c)$ exists, then $f\'(c)=0$. Sketch: if $f$ has a local max at $c$, then for small $h>0$, $f(c+h)\\leq f(c)$, so $\\frac{f(c+h)-f(c)}{h}\\leq 0$; taking $h\\to 0^+$ gives $f\'(c)\\leq 0$. For small $h<0$, the same quotient is $\\geq 0$, giving $f\'(c)\\geq 0$ as $h\\to 0^-$. Both must hold, forcing $f\'(c)=0$.\n\nThis is *why* Module 5\'s tests only ever checked **critical points** — places where $f\'=0$ or $f\'$ is undefined: Fermat\'s theorem guarantees no local extremum can hide anywhere else at an interior point. The converse is false, though — $f(x)=x^3$ has $f\'(0)=0$ but no extremum there at all, only a flattened inflection point. A critical point is a candidate, never a guarantee.',
                id: '**Teorema Fermat**: jika $f$ punya ekstrem lokal di titik dalam $c$ dan $f\'(c)$ ada, maka $f\'(c)=0$. Sketsa buktinya: jika $f$ punya maksimum lokal di $c$, maka untuk $h>0$ kecil, $f(c+h)\\leq f(c)$, sehingga $\\frac{f(c+h)-f(c)}{h}\\leq 0$; mengambil $h\\to 0^+$ memberi $f\'(c)\\leq 0$. Untuk $h<0$ kecil, hasil bagi yang sama adalah $\\geq 0$, memberi $f\'(c)\\geq 0$ ketika $h\\to 0^-$. Keduanya harus berlaku, memaksa $f\'(c)=0$.\n\nInilah *sebabnya* uji-uji Modul 5 hanya pernah memeriksa **titik kritis** — tempat $f\'=0$ atau $f\'$ tak terdefinisi: teorema Fermat menjamin tak ada ekstrem lokal yang bisa bersembunyi di tempat lain mana pun pada titik dalam. Kebalikannya salah, meski begitu — $f(x)=x^3$ punya $f\'(0)=0$ tetapi sama sekali tak punya ekstrem di situ, hanya titik belok yang memipih. Titik kritis adalah kandidat, tak pernah jaminan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What does Fermat\'s Theorem guarantee about a local extremum at an interior point where the derivative exists?',
                id: 'Apa yang dijamin Teorema Fermat tentang ekstrem lokal di titik dalam tempat turunannya ada?',
              },
              options: [
                { en: 'The derivative there must equal zero', id: 'Turunannya di situ harus sama dengan nol' },
                { en: 'The derivative there must be undefined', id: 'Turunannya di situ harus tak terdefinisi' },
                { en: 'The function must be increasing there', id: 'Fungsinya harus sedang naik di situ' },
                { en: 'The point must be an endpoint of the domain', id: 'Titiknya harus titik ujung domain' },
              ],
              answer: 0,
              explain: {
                en: 'Approaching from the right forces the derivative to be at most zero, and approaching from the left forces it to be at least zero — the only way to satisfy both is for it to equal exactly zero.',
                id: 'Mendekat dari kanan memaksa turunannya paling banyak nol, dan mendekat dari kiri memaksanya paling sedikit nol — satu-satunya cara memenuhi keduanya adalah bila ia sama dengan tepat nol.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the figure above, why is the point (3, 18) an absolute maximum but not a local one?',
                id: 'Dengan membaca gambar di atas, mengapa titik (3, 18) adalah maksimum mutlak tetapi bukan maksimum lokal?',
              },
              figure: {
                dim: 2,
                xSpan: [-2.5, 3.5],
                ySpan: [-4, 20],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^3-3*x', from: -2, to: 3, color: 'a' },
                  { t: 'dot', x: -1, y: 2, color: 'b' },
                  { t: 'dot', x: 3, y: 18, color: 'result' },
                ],
              },
              options: [
                { en: 'It sits at the right endpoint, where the function simply stops rather than turning around', id: 'Ia duduk di titik ujung kanan, tempat fungsinya sekadar berhenti alih-alih berbalik' },
                { en: 'It is not actually the tallest point on the interval', id: 'Sebenarnya bukan titik tertinggi pada interval itu' },
                { en: 'The function is decreasing at that point', id: 'Fungsinya sedang turun di titik itu' },
                { en: 'Local and absolute maxima are always the same point', id: 'Maksimum lokal dan mutlak selalu titik yang sama' },
              ],
              answer: 0,
              explain: {
                en: 'A local extremum requires the function to turn around nearby — rise then fall, or fall then rise. At an endpoint the curve is simply cut off, with no "nearby on both sides" to compare against, so it can be an absolute extremum without being a local one.',
                id: 'Ekstrem lokal mensyaratkan fungsinya berbalik di dekatnya — naik lalu turun, atau turun lalu naik. Di titik ujung kurvanya sekadar terpotong, tanpa "dekatnya di kedua sisi" untuk dibandingkan, sehingga ia bisa menjadi ekstrem mutlak tanpa menjadi ekstrem lokal.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For f(x) = x^2 - 6x + 5, find the critical point and confirm it is a local minimum by evaluating f there.',
                id: 'Untuk f(x) = x^2 - 6x + 5, cari titik kritisnya dan pastikan itu minimum lokal dengan menghitung f di situ.',
              },
              blanks: [
                { label: 'x =', answer: 3 },
                { label: 'f(x) =', answer: -4 },
              ],
              hints: [
                { en: "f'(x) = 2x - 6, zero at x = 3.", id: "f'(x) = 2x - 6, nol di x = 3." },
              ],
              explain: {
                en: 'The parabola opens upward, so its one critical point is automatically its minimum. f(3) = 9 - 18 + 5 = -4.',
                id: 'Parabolanya membuka ke atas, sehingga satu titik kritisnya otomatis adalah minimumnya. f(3) = 9 - 18 + 5 = -4.',
              },
            },
          ],
        },
        {
          id: 'tur-m6-s1-l2',
          title: { en: 'The Closed Interval Method', id: 'Metode Selang Tertutup' },
          goal: {
            en: 'Find the absolute maximum and minimum of a continuous function on a closed interval by checking critical points and endpoints.',
            id: 'Mencari maksimum dan minimum mutlak fungsi kontinu pada selang tertutup dengan memeriksa titik kritis dan titik ujung.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A finite list of candidates is all it takes', id: 'Daftar kandidat yang hingga sudah cukup' },
              body: {
                en: 'A continuous function on a closed interval $[a,b]$ is guaranteed to attain an absolute maximum and minimum somewhere on it — and by the last lesson, that somewhere is either a critical point or an endpoint, since nowhere else can a local extremum (or a boundary effect) occur. This gives a complete, finite procedure, the **Closed Interval Method**:\n1. Find every critical point of $f$ in $(a,b)$.\n2. Evaluate $f$ at each critical point and at both endpoints $a$ and $b$.\n3. The largest value is the absolute maximum; the smallest is the absolute minimum.\n\nFor $f(x)=x^3-3x$ on $[-2,3]$: $f\'(x)=3x^2-3=0$ gives $x=\\pm 1$, both inside $(-2,3)$. Evaluating all four candidates: $f(-2)=-2$, $f(-1)=2$, $f(1)=-2$, $f(3)=18$. The absolute maximum is $18$ at $x=3$ — an endpoint, exactly as the figure in the last lesson showed.',
                id: 'Fungsi kontinu pada selang tertutup $[a,b]$ dijamin mencapai maksimum dan minimum mutlak di suatu tempat padanya — dan menurut pelajaran sebelumnya, tempat itu adalah titik kritis atau titik ujung, sebab di tempat lain mana pun tak ada ekstrem lokal (atau efek batas) yang bisa terjadi. Ini memberi prosedur yang lengkap dan hingga, **Metode Selang Tertutup**:\n1. Cari setiap titik kritis $f$ pada $(a,b)$.\n2. Evaluasi $f$ di tiap titik kritis dan di kedua titik ujung $a$ dan $b$.\n3. Nilai terbesar adalah maksimum mutlak; yang terkecil adalah minimum mutlak.\n\nUntuk $f(x)=x^3-3x$ pada $[-2,3]$: $f\'(x)=3x^2-3=0$ memberi $x=\\pm 1$, keduanya di dalam $(-2,3)$. Mengevaluasi keempat kandidatnya: $f(-2)=-2$, $f(-1)=2$, $f(1)=-2$, $f(3)=18$. Maksimum mutlaknya adalah $18$ di $x=3$ — sebuah titik ujung, persis seperti yang ditunjukkan gambar pada pelajaran sebelumnya.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The minimum can tie, and the winner is never assumed', id: 'Minimumnya bisa seri, dan pemenangnya tak pernah diasumsikan' },
              body: {
                en: 'From the same example, $f(-2)=-2$ and $f(1)=-2$ tie for the absolute minimum — the method does not care which candidate "looks like" the answer, it simply compares every value. A second example, $f(x)=x^2-4x+1$ on $[0,5]$: $f\'(x)=2x-4=0$ gives $x=2$. Evaluating: $f(0)=1$, $f(2)=-3$, $f(5)=6$. The absolute minimum is $-3$ at the critical point $x=2$, but the absolute *maximum* is $6$ at the endpoint $x=5$ — not at $x=0$, even though both are endpoints. Nothing about which endpoint wins can be guessed without evaluating both.',
                id: 'Dari contoh yang sama, $f(-2)=-2$ dan $f(1)=-2$ seri untuk minimum mutlak — metodenya tak peduli kandidat mana yang "terlihat seperti" jawabannya, ia sekadar membandingkan setiap nilai. Contoh kedua, $f(x)=x^2-4x+1$ pada $[0,5]$: $f\'(x)=2x-4=0$ memberi $x=2$. Mengevaluasi: $f(0)=1$, $f(2)=-3$, $f(5)=6$. Minimum mutlaknya adalah $-3$ di titik kritis $x=2$, tetapi *maksimum* mutlaknya adalah $6$ di titik ujung $x=5$ — bukan di $x=0$, meski keduanya titik ujung. Tak ada yang bisa ditebak soal titik ujung mana yang menang tanpa mengevaluasi keduanya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why must both endpoints of a closed interval always be evaluated, even when a critical point is also a candidate?',
                id: 'Mengapa kedua titik ujung selang tertutup harus selalu dievaluasi, bahkan ketika titik kritis juga menjadi kandidat?',
              },
              options: [
                { en: 'The absolute maximum or minimum can occur at an endpoint instead of a critical point, and which one wins is never known without comparing every value', id: 'Maksimum atau minimum mutlak bisa terjadi di titik ujung, bukan titik kritis, dan mana yang menang tak pernah diketahui tanpa membandingkan setiap nilai' },
                { en: 'Endpoints are always automatically the absolute extrema', id: 'Titik ujung selalu otomatis menjadi ekstrem mutlak' },
                { en: 'Critical points are never actually valid candidates', id: 'Titik kritis sebenarnya tak pernah menjadi kandidat yang sah' },
                { en: 'Only one endpoint ever needs checking, never both', id: 'Hanya satu titik ujung yang pernah perlu diperiksa, tak pernah keduanya' },
              ],
              answer: 0,
              explain: {
                en: 'The method\'s entire safety comes from checking every candidate. Skipping an endpoint on the assumption it "can\'t win" is exactly the kind of guess the second worked example showed to be unreliable — x = 0 looked like a plausible candidate but the real maximum was at x = 5.',
                id: 'Seluruh keamanan metode ini berasal dari memeriksa setiap kandidat. Melewatkan titik ujung dengan asumsi ia "tak mungkin menang" persis jenis tebakan yang ditunjukkan tak dapat diandalkan oleh contoh kedua — x = 0 terlihat seperti kandidat yang masuk akal tetapi maksimum sebenarnya ada di x = 5.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the Closed Interval Method as applied to f(x) = x^2 - 2x on [0, 4].',
                id: 'Susun Metode Selang Tertutup yang diterapkan pada f(x) = x^2 - 2x pada [0, 4].',
              },
              lines: [
                "f'(x) = 2x - 2 = 0 \\Rightarrow x = 1",
                'f(0) = 0, \\quad f(1) = -1, \\quad f(4) = 8',
                '\\text{Absolute maximum: } 8 \\text{ at } x=4, \\quad \\text{absolute minimum: } -1 \\text{ at } x=1',
              ],
              explain: {
                en: 'Find the critical point first, then evaluate f at that point and at both endpoints, then compare all three values to name the winners.',
                id: 'Cari titik kritisnya lebih dahulu, lalu evaluasi f di titik itu dan di kedua titik ujungnya, baru bandingkan ketiga nilainya untuk menyebutkan pemenangnya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the absolute maximum of f(x) = x^3 - 12x on [0, 4].',
                id: 'Cari maksimum mutlak dari f(x) = x^3 - 12x pada [0, 4].',
              },
              blanks: [{ answer: 16 }],
              hints: [
                { en: "f'(x) = 3x^2 - 12 = 0 gives x = 2 (x = -2 is outside [0, 4]).", id: "f'(x) = 3x^2 - 12 = 0 memberi x = 2 (x = -2 di luar [0, 4])." },
                { en: 'Evaluate f(0), f(2), and f(4).', id: 'Evaluasi f(0), f(2), dan f(4).' },
              ],
              explain: {
                en: 'f(0) = 0, f(2) = 8 - 24 = -16, f(4) = 64 - 48 = 16. The largest is 16, at the endpoint x = 4.',
                id: 'f(0) = 0, f(2) = 8 - 24 = -16, f(4) = 64 - 48 = 16. Yang terbesar adalah 16, di titik ujung x = 4.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'tur-m6-s1-p',
        runtime: 'math',
        title: { en: 'Finding Absolute Extrema', id: 'Mencari Ekstrem Mutlak' },
        brief: {
          en: 'Two applications of the closed interval method, and one check of Fermat\'s theorem.',
          id: 'Dua penerapan metode selang tertutup, dan satu pemeriksaan teorema Fermat.',
        },
        requirements: [
          { en: 'List every critical point in the open interval, plus both endpoints, before comparing.', id: 'Daftarkan setiap titik kritis pada interval terbuka, ditambah kedua titik ujung, sebelum membandingkan.' },
          { en: 'A critical point is only a candidate — evaluating it is what decides whether it wins.', id: 'Titik kritis hanyalah kandidat — mengevaluasinya itulah yang memutuskan apakah ia menang.' },
        ],
        tasks: [
          {
            prompt: { en: 'Find the absolute minimum of f(x) = x^2 - 4x + 6 on [0, 5].', id: 'Cari minimum mutlak dari f(x) = x^2 - 4x + 6 pada [0, 5].' },
            blanks: [{ answer: 2 }],
            solution: ["f'(x)=2x-4=0 \\Rightarrow x=2, \\quad f(0)=6,\\ f(2)=2,\\ f(5)=11 \\Rightarrow \\text{min} = 2"],
          },
          {
            prompt: { en: 'Find the absolute maximum of f(x) = x^3 - 3x^2 on [-1, 3].', id: 'Cari maksimum mutlak dari f(x) = x^3 - 3x^2 pada [-1, 3].' },
            blanks: [{ answer: 0 }],
            solution: ["f'(x)=3x^2-6x=0 \\Rightarrow x=0,2, \\quad f(-1)=-4,\\ f(0)=0,\\ f(2)=-4,\\ f(3)=0 \\Rightarrow \\text{max} = 0"],
          },
          {
            prompt: { en: 'For f(x) = |x| on [-2, 2], f has a local (and absolute) minimum at x = 0, but f prime(0) does not exist. Does this contradict Fermat\'s Theorem? Type 1 for yes, 0 for no.', id: 'Untuk f(x) = |x| pada [-2, 2], f punya minimum lokal (dan mutlak) di x = 0, tetapi f aksen(0) tak ada. Apakah ini bertentangan dengan Teorema Fermat? Ketik 1 untuk ya, 0 untuk tidak.' },
            blanks: [{ answer: 0 }],
            solution: ['\\text{Fermat requires } f\'(c) \\text{ to exist; it says nothing when the derivative is undefined, so there is no contradiction}'],
          },
        ],
        hints: [
          { en: 'Part 3: Fermat\'s Theorem is a conditional statement — check exactly what it assumes before deciding whether it applies.', id: 'Butir 3: Teorema Fermat adalah pernyataan bersyarat — periksa persis apa yang diasumsikannya sebelum memutuskan apakah ia berlaku.' },
        ],
        xp: 50,
      },
    },

    /* -------------------------------------------------- 6.2 the mean value theorem */
    {
      id: 'tur-m6-s2',
      title: { en: 'The Mean Value Theorem', id: 'Teorema Nilai Rata-rata' },
      summary: {
        en: 'From Rolle\'s Theorem to the Mean Value Theorem, and the proof behind why antiderivatives only ever differ by a constant.',
        id: 'Dari Teorema Rolle ke Teorema Nilai Rata-rata, dan bukti di balik mengapa antiturunan hanya pernah berbeda oleh sebuah konstanta.',
      },
      lessons: [
        {
          id: 'tur-m6-s2-l1',
          title: { en: 'Rolle\'s Theorem', id: 'Teorema Rolle' },
          goal: {
            en: 'Prove that a function returning to the same height somewhere must have a horizontal tangent in between.',
            id: 'Membuktikan bahwa fungsi yang kembali ke ketinggian yang sama di suatu tempat pasti punya garis singgung mendatar di antaranya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Equal heights force a flat spot somewhere between', id: 'Ketinggian yang sama memaksa tempat datar di antaranya' },
              body: {
                en: '**Rolle\'s Theorem**: if $f$ is continuous on $[a,b]$, differentiable on $(a,b)$, and $f(a)=f(b)$, then $f\'(c)=0$ for some $c$ in $(a,b)$. Intuitively: a curve that starts and ends at the same height, without any breaks, must turn around somewhere in between — and Fermat\'s Theorem says that turning point has a zero derivative.\n\nProof sketch: a continuous function on $[a,b]$ attains an absolute max and min somewhere on it. If both occur only at the endpoints, then since $f(a)=f(b)$, the max equals the min, meaning $f$ is constant — and then $f\'=0$ everywhere. Otherwise, at least one extremum occurs at an interior point $c$, where Fermat\'s Theorem forces $f\'(c)=0$.\n\nFor $f(x)=x^2-4x+3$ on $[1,3]$: $f(1)=1-4+3=0$ and $f(3)=9-12+3=0$ — equal heights. $f\'(x)=2x-4=0$ gives $c=2$, which is indeed inside $(1,3)$.',
                id: '**Teorema Rolle**: jika $f$ kontinu pada $[a,b]$, terdiferensialkan pada $(a,b)$, dan $f(a)=f(b)$, maka $f\'(c)=0$ untuk suatu $c$ di $(a,b)$. Secara intuitif: kurva yang mulai dan berakhir pada ketinggian yang sama, tanpa putus, pasti berbalik di suatu tempat di antaranya — dan Teorema Fermat menyatakan titik berbalik itu punya turunan nol.\n\nSketsa buktinya: fungsi kontinu pada $[a,b]$ mencapai maksimum dan minimum mutlak di suatu tempat padanya. Jika keduanya hanya terjadi di titik ujung, maka karena $f(a)=f(b)$, maksimumnya sama dengan minimumnya, berarti $f$ konstan — dan $f\'=0$ di mana-mana. Jika tidak, setidaknya satu ekstrem terjadi di titik dalam $c$, tempat Teorema Fermat memaksa $f\'(c)=0$.\n\nUntuk $f(x)=x^2-4x+3$ pada $[1,3]$: $f(1)=1-4+3=0$ dan $f(3)=9-12+3=0$ — ketinggian yang sama. $f\'(x)=2x-4=0$ memberi $c=2$, yang memang berada di dalam $(1,3)$.',
              },
              figure: {
                dim: 2,
                xSpan: [0.5, 3.5],
                ySpan: [-1.5, 0.5],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^2-4*x+3', from: 1, to: 3, color: 'a' },
                  { t: 'seg', from: [1.5, -0.75], to: [2.5, -0.75], color: 'b', dashed: true },
                ],
                caption: {
                  en: 'f(x) = x^2 - 4x + 3 on [1, 3]: equal height 0 at both ends, and a horizontal tangent (dashed) exactly at x = 2 in between.',
                  id: 'f(x) = x^2 - 4x + 3 pada [1, 3]: ketinggian yang sama, 0, di kedua ujung, dan garis singgung mendatar (putus-putus) tepat di x = 2 di antaranya.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Every requirement in the theorem is load-bearing', id: 'Setiap syarat dalam teorema itu benar-benar diperlukan' },
              body: {
                en: 'Drop any one hypothesis and the conclusion can fail. $f(x)=|x|$ on $[-1,1]$ has $f(-1)=f(1)=1$, but is not differentiable at $x=0$ — and indeed no point anywhere has $f\'=0$ (the slope is always $\\pm 1$). A function with a jump discontinuity but equal endpoint heights can likewise skip straight over any flat spot. Rolle\'s Theorem is not a vague heuristic; it is exactly as strong as its three hypotheses, and no stronger.',
                id: 'Lepaskan satu saja hipotesisnya dan kesimpulannya bisa gagal. $f(x)=|x|$ pada $[-1,1]$ punya $f(-1)=f(1)=1$, tetapi tak terdiferensialkan di $x=0$ — dan memang tak ada titik mana pun yang punya $f\'=0$ (kemiringannya selalu $\\pm 1$). Fungsi dengan diskontinuitas lompat tetapi tinggi titik ujung yang sama pun bisa melompati tempat datar mana pun sepenuhnya. Teorema Rolle bukan heuristik yang samar; ia tepat sekuat ketiga hipotesisnya, tak lebih kuat dari itu.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why does f(x) = |x| on [-1, 1] not contradict Rolle\'s Theorem, even though f(-1) = f(1) and no point has a zero derivative?',
                id: 'Mengapa f(x) = |x| pada [-1, 1] tak bertentangan dengan Teorema Rolle, meski f(-1) = f(1) dan tak ada titik yang berturunan nol?',
              },
              options: [
                { en: 'It fails the differentiability hypothesis at x = 0, so the theorem simply does not apply', id: 'Ia gagal memenuhi hipotesis keterdiferensialan di x = 0, sehingga teoremanya sekadar tak berlaku' },
                { en: 'Rolle\'s Theorem is simply wrong in this case', id: 'Teorema Rolle sekadar salah dalam kasus ini' },
                { en: 'f(-1) does not actually equal f(1)', id: 'f(-1) sebenarnya tak sama dengan f(1)' },
                { en: '|x| is not continuous on [-1, 1]', id: '|x| tak kontinu pada [-1, 1]' },
              ],
              answer: 0,
              explain: {
                en: 'Rolle\'s Theorem requires differentiability on the entire open interval. |x| fails this at x = 0 (a corner), so the theorem\'s conclusion is not guaranteed — there is no contradiction, only a hypothesis that was never met.',
                id: 'Teorema Rolle mensyaratkan keterdiferensialan pada seluruh interval terbuka. |x| gagal memenuhi ini di x = 0 (sebuah sudut), sehingga kesimpulan teoremanya tak dijamin — tak ada pertentangan, hanya hipotesis yang tak pernah terpenuhi.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the figure above, what two facts together guarantee the dashed horizontal tangent exists somewhere in (1, 3)?',
                id: 'Dengan membaca gambar di atas, dua fakta apa yang bersama-sama menjamin garis singgung mendatar putus-putus itu ada di suatu tempat dalam (1, 3)?',
              },
              figure: {
                dim: 2,
                xSpan: [0.5, 3.5],
                ySpan: [-1.5, 0.5],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^2-4*x+3', from: 1, to: 3, color: 'a' },
                  { t: 'seg', from: [1.5, -0.75], to: [2.5, -0.75], color: 'b', dashed: true },
                ],
              },
              options: [
                { en: 'The curve is smooth (no corners or breaks) and returns to the same height at both ends', id: 'Kurvanya mulus (tanpa sudut atau putus) dan kembali ke ketinggian yang sama di kedua ujung' },
                { en: 'The curve is a parabola specifically', id: 'Kurvanya secara khusus adalah parabola' },
                { en: 'The interval has a specific length of exactly 2', id: 'Intervalnya punya panjang tepat 2' },
                { en: 'The function is always positive on the interval', id: 'Fungsinya selalu positif pada interval itu' },
              ],
              answer: 0,
              explain: {
                en: 'Rolle\'s Theorem needs exactly continuity, differentiability throughout the open interval, and equal endpoint values — nothing about the specific shape of the curve, its sign, or the interval\'s length matters.',
                id: 'Teorema Rolle hanya memerlukan kekontinuan, keterdiferensialan di seluruh interval terbuka, dan nilai titik ujung yang sama — tak ada yang penting soal bentuk spesifik kurvanya, tandanya, atau panjang intervalnya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For f(x) = x^2 - 6x + 8 on [2, 4] (check: f(2) = f(4) = 0), find the point c guaranteed by Rolle\'s Theorem.',
                id: 'Untuk f(x) = x^2 - 6x + 8 pada [2, 4] (periksa: f(2) = f(4) = 0), cari titik c yang dijamin Teorema Rolle.',
              },
              blanks: [{ answer: 3 }],
              hints: [
                { en: "f'(x) = 2x - 6.", id: "f'(x) = 2x - 6." },
              ],
              explain: {
                en: '2x - 6 = 0 gives x = 3, which lies inside (2, 4).',
                id: '2x - 6 = 0 memberi x = 3, yang berada di dalam (2, 4).',
              },
            },
          ],
        },
        {
          id: 'tur-m6-s2-l2',
          title: { en: 'The Mean Value Theorem and Its Consequences', id: 'Teorema Nilai Rata-rata dan Akibatnya' },
          goal: {
            en: 'State the Mean Value Theorem as a tilted version of Rolle\'s Theorem, and use it to prove why antiderivatives only ever differ by a constant.',
            id: 'Menyatakan Teorema Nilai Rata-rata sebagai versi Teorema Rolle yang dimiringkan, dan memakainya untuk membuktikan mengapa antiturunan hanya pernah berbeda oleh sebuah konstanta.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Tilting Rolle\'s Theorem to allow different heights', id: 'Memiringkan Teorema Rolle agar mengizinkan ketinggian berbeda' },
              body: {
                en: 'Rolle\'s Theorem required $f(a)=f(b)$ — a flat secant line. The **Mean Value Theorem** drops that restriction: if $f$ is continuous on $[a,b]$ and differentiable on $(a,b)$, then for *some* $c$ in $(a,b)$,\n$$f\'(c) = \\frac{f(b)-f(a)}{b-a}$$\nGeometrically, the tangent at $c$ is parallel to the secant line through the endpoints — somewhere, the instantaneous rate of change must equal the average rate of change over the whole interval. Rolle\'s Theorem is the special case where that average happens to be zero.\n\nFor $f(x)=x^3$ on $[0,2]$: average rate $= \\frac{f(2)-f(0)}{2-0} = \\frac{8-0}{2} = 4$. Setting $f\'(c)=3c^2=4$ gives $c = \\sqrt{4/3} \\approx 1.1547$, which lies inside $(0,2)$.',
                id: 'Teorema Rolle mensyaratkan $f(a)=f(b)$ — garis tali busur yang datar. **Teorema Nilai Rata-rata** melepaskan batasan itu: jika $f$ kontinu pada $[a,b]$ dan terdiferensialkan pada $(a,b)$, maka untuk *suatu* $c$ di $(a,b)$,\n$$f\'(c) = \\frac{f(b)-f(a)}{b-a}$$\nSecara geometris, garis singgung di $c$ sejajar dengan garis tali busur melalui titik ujungnya — di suatu tempat, laju perubahan sesaat harus sama dengan laju perubahan rata-rata pada seluruh interval. Teorema Rolle adalah kasus khusus tempat rata-rata itu kebetulan nol.\n\nUntuk $f(x)=x^3$ pada $[0,2]$: laju rata-rata $= \\frac{f(2)-f(0)}{2-0} = \\frac{8-0}{2} = 4$. Menetapkan $f\'(c)=3c^2=4$ memberi $c = \\sqrt{4/3} \\approx 1.1547$, yang berada di dalam $(0,2)$.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The fact the Integral course used without proof', id: 'Fakta yang dipakai kursus Integral tanpa bukti' },
              body: {
                en: 'A first consequence: if $f\'(x)=0$ for every $x$ on an interval, then $f$ is constant there. Proof: pick any two points $a<b$ in the interval; the Mean Value Theorem gives $f(b)-f(a) = f\'(c)(b-a) = 0\\cdot(b-a) = 0$, so $f(a)=f(b)$ — true for *any* two points, meaning $f$ never changes value.\n\nA second consequence follows immediately: if $f\'(x)=g\'(x)$ for every $x$ on an interval, then $f(x)=g(x)+C$ for some constant $C$. Proof: let $h(x)=f(x)-g(x)$; then $h\'(x)=f\'(x)-g\'(x)=0$ everywhere, so by the first consequence $h$ is constant. This is exactly the fact the Integral course built its entire Module 1 on — that any two antiderivatives of the same function differ only by a constant — stated there and finally proved here.',
                id: 'Akibat pertama: jika $f\'(x)=0$ untuk setiap $x$ pada suatu interval, maka $f$ konstan di situ. Bukti: ambil dua titik mana pun $a<b$ pada interval itu; Teorema Nilai Rata-rata memberi $f(b)-f(a) = f\'(c)(b-a) = 0\\cdot(b-a) = 0$, sehingga $f(a)=f(b)$ — benar untuk dua titik *mana pun*, berarti $f$ tak pernah berubah nilainya.\n\nAkibat kedua langsung mengikuti: jika $f\'(x)=g\'(x)$ untuk setiap $x$ pada suatu interval, maka $f(x)=g(x)+C$ untuk suatu konstanta $C$. Bukti: misalkan $h(x)=f(x)-g(x)$; maka $h\'(x)=f\'(x)-g\'(x)=0$ di mana-mana, sehingga menurut akibat pertama $h$ konstan. Inilah persis fakta yang menjadi dasar seluruh Modul 1 kursus Integral — bahwa dua antiturunan mana pun dari fungsi yang sama hanya berbeda oleh sebuah konstanta — dinyatakan di situ dan akhirnya dibuktikan di sini.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'How does the Mean Value Theorem relate to Rolle\'s Theorem?',
                id: 'Bagaimana Teorema Nilai Rata-rata berkaitan dengan Teorema Rolle?',
              },
              options: [
                { en: 'Rolle\'s Theorem is the special case where the average rate of change happens to be zero', id: 'Teorema Rolle adalah kasus khusus tempat laju perubahan rata-ratanya kebetulan nol' },
                { en: 'They are unrelated theorems about completely different topics', id: 'Keduanya teorema yang tak berkaitan tentang topik yang sama sekali berbeda' },
                { en: 'The Mean Value Theorem is a special case of Rolle\'s Theorem', id: 'Teorema Nilai Rata-rata adalah kasus khusus dari Teorema Rolle' },
                { en: 'Rolle\'s Theorem applies only to polynomials, unlike the Mean Value Theorem', id: 'Teorema Rolle hanya berlaku untuk polinom, tak seperti Teorema Nilai Rata-rata' },
              ],
              answer: 0,
              explain: {
                en: 'When f(a) = f(b), the average rate of change (f(b)-f(a))/(b-a) is exactly 0, and the Mean Value Theorem\'s conclusion f\'(c) = 0 is precisely Rolle\'s Theorem.',
                id: 'Ketika f(a) = f(b), laju perubahan rata-rata (f(b)-f(a))/(b-a) tepat 0, dan kesimpulan Teorema Nilai Rata-rata f\'(c) = 0 persis Teorema Rolle.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the proof that f prime = 0 everywhere implies f is constant.',
                id: 'Lengkapi bukti bahwa f aksen = 0 di mana-mana mengakibatkan f konstan.',
              },
              template: 'f(b)-f(a) = f\'(c)(b-a) = ___\\cdot(b-a) = ___ \\ \\Rightarrow \\ f(a)=f(b)',
              blanks: ['0', '0'],
              explain: {
                en: 'Since f prime is 0 everywhere, f prime(c) is 0 too, so the whole product collapses to 0, forcing f(a) and f(b) to be equal.',
                id: 'Karena f aksen adalah 0 di mana-mana, f aksen(c) juga 0, sehingga seluruh hasil kalinya runtuh menjadi 0, memaksa f(a) dan f(b) sama.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For f(x) = x^2 on [1, 4], find the value of c guaranteed by the Mean Value Theorem.',
                id: 'Untuk f(x) = x^2 pada [1, 4], cari nilai c yang dijamin Teorema Nilai Rata-rata.',
              },
              blanks: [{ answer: 2.5 }],
              hints: [
                { en: 'Average rate = (f(4)-f(1))/(4-1) = 15/3 = 5. Solve 2c = 5.', id: 'Laju rata-rata = (f(4)-f(1))/(4-1) = 15/3 = 5. Selesaikan 2c = 5.' },
              ],
              explain: {
                en: 'c = 5/2 = 2.5.',
                id: 'c = 5/2 = 2.5.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'tur-m6-s2-p',
        runtime: 'math',
        title: { en: 'Rolle and the Mean Value Theorem', id: 'Rolle dan Teorema Nilai Rata-rata' },
        brief: {
          en: 'One application of Rolle\'s Theorem, and two of the Mean Value Theorem.',
          id: 'Satu penerapan Teorema Rolle, dan dua Teorema Nilai Rata-rata.',
        },
        requirements: [
          { en: 'Rolle\'s Theorem needs equal heights at both endpoints; the Mean Value Theorem does not.', id: 'Teorema Rolle memerlukan ketinggian yang sama di kedua titik ujung; Teorema Nilai Rata-rata tidak.' },
          { en: 'The guaranteed point always solves f prime(c) equals the average rate of change.', id: 'Titik yang dijamin selalu menyelesaikan f aksen(c) sama dengan laju perubahan rata-rata.' },
        ],
        tasks: [
          {
            prompt: { en: 'For f(x) = x^2 - 4x on [0, 4] (check: f(0) = f(4) = 0), find the point c guaranteed by Rolle\'s Theorem.', id: 'Untuk f(x) = x^2 - 4x pada [0, 4] (periksa: f(0) = f(4) = 0), cari titik c yang dijamin Teorema Rolle.' },
            blanks: [{ answer: 2 }],
            solution: ["f'(x)=2x-4=0 \\Rightarrow c=2"],
          },
          {
            prompt: { en: 'For f(x) = x^3 on [0, 3], find the value of c guaranteed by the Mean Value Theorem. (Round to two decimal places.)', id: 'Untuk f(x) = x^3 pada [0, 3], cari nilai c yang dijamin Teorema Nilai Rata-rata. (Bulatkan ke dua desimal.)' },
            blanks: [{ answer: 1.73 }],
            solution: ["\\text{avg rate} = 27/3 = 9, \\quad 3c^2=9 \\Rightarrow c=\\sqrt3 \\approx 1{,}73"],
          },
          {
            prompt: { en: 'For f(x) = 1/x on [1, 4], find the value of c guaranteed by the Mean Value Theorem.', id: 'Untuk f(x) = 1/x pada [1, 4], cari nilai c yang dijamin Teorema Nilai Rata-rata.' },
            blanks: [{ answer: 2 }],
            solution: ["\\text{avg rate} = \\dfrac{1/4 - 1}{3} = -\\dfrac14, \\quad -\\dfrac{1}{c^2} = -\\dfrac14 \\Rightarrow c^2=4 \\Rightarrow c=2"],
          },
        ],
        hints: [
          { en: 'Part 3: only the positive root of c^2 = 4 lies inside (1, 4).', id: 'Butir 3: hanya akar positif dari c^2 = 4 yang berada di dalam (1, 4).' },
        ],
        xp: 50,
      },
    },
  ],
}
