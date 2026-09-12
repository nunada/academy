import type { Module } from '../types'

/** Module 1 — what a function is, and what its graph shows you.
 *
 *  This is the chapter every calculus course opens with, and the one students
 *  arrive thinking they already know. They usually know how to evaluate; what
 *  they have not been made to do is say where a function is allowed to be
 *  evaluated, and read that off a picture. So domain comes early and stays. */
export const module1: Module = {
  id: 'fun-m1',
  title: { en: 'Functions and Their Graphs', id: 'Fungsi dan Grafiknya' },
  summary: {
    en: 'What a function is, where it is allowed to act, everything its graph tells you at a glance, and how to build one from a description.',
    id: 'Apa itu fungsi, di mana ia boleh bekerja, segala yang langsung diberitahukan grafiknya, dan cara membangunnya dari sebuah deskripsi.',
  },
  submodules: [
    /* ------------------------------------------------ 1.1 domain and range */
    {
      id: 'fun-m1-s1',
      title: { en: 'Functions, Domain and Range', id: 'Fungsi, Domain, dan Range' },
      summary: {
        en: 'Evaluate a function, find where it is defined, and read both off a graph.',
        id: 'Menghitung nilai fungsi, menentukan di mana ia terdefinisi, dan membaca keduanya dari grafik.',
      },
      lessons: [
        {
          id: 'fun-m1-s1-l1',
          title: { en: 'What a Function Is', id: 'Apa Itu Fungsi' },
          goal: {
            en: 'Say what makes a rule a function, and evaluate one at a number and at an expression.',
            id: 'Menyebut apa yang membuat suatu aturan disebut fungsi, dan menghitung nilainya pada bilangan maupun pada bentuk aljabar.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'One input, one output', id: 'Satu masukan, satu keluaran' },
              body: {
                en: 'A **function** from a set $D$ to a set $Y$ is a rule that assigns to **each** element of $D$ **exactly one** element of $Y$. The set $D$ is the **domain**; the set of values the rule actually produces is the **range**.\n\nThe word doing the work is "exactly one". A rule that gives two answers for the same input is not a function — and neither is one that gives no answer at all for something in its domain.\n\nWe write $y = f(x)$, read "$y$ equals $f$ of $x$". Here $x$ is the **independent variable** (what you choose) and $y$ the **dependent variable** (what the rule then forces). The letter $f$ is the name of the rule, not a number, and $f(x)$ does not mean $f$ times $x$.',
                id: 'Sebuah **fungsi** dari himpunan $D$ ke himpunan $Y$ adalah aturan yang memasangkan **setiap** anggota $D$ dengan **tepat satu** anggota $Y$. Himpunan $D$ disebut **domain**; himpunan nilai yang benar-benar dihasilkan aturan itu disebut **range** (daerah hasil).\n\nKata yang bekerja di situ adalah "tepat satu". Aturan yang memberi dua jawaban untuk masukan yang sama bukanlah fungsi — begitu pula aturan yang tak memberi jawaban apa pun untuk sesuatu yang ada di domainnya.\n\nKita tulis $y = f(x)$, dibaca "$y$ sama dengan $f$ dari $x$". Di sini $x$ adalah **variabel bebas** (yang kamu pilih) dan $y$ **variabel terikat** (yang kemudian dipaksa oleh aturannya). Huruf $f$ adalah nama aturannya, bukan bilangan, dan $f(x)$ tidak berarti $f$ dikali $x$.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Evaluating', id: 'Menghitung nilainya' },
              body: {
                en: 'To evaluate, put the input everywhere the variable appears. With $f(x) = x^2 - 3x$:\n$$f(4) = 4^2 - 3(4) = 16 - 12 = 4$$\nThe input need not be a number. Whatever you write in the brackets goes in every slot, brackets and all:\n$$f(-2) = (-2)^2 - 3(-2) = 4 + 6 = 10$$\n$$f(a + 1) = (a+1)^2 - 3(a+1)$$\nThose brackets around $-2$ are not decoration. Without them $-2^2$ is $-4$, and the sign of the whole answer changes.',
                id: 'Untuk menghitung nilainya, masukkan bilangannya ke setiap tempat variabelnya muncul. Dengan $f(x) = x^2 - 3x$:\n$$f(4) = 4^2 - 3(4) = 16 - 12 = 4$$\nMasukannya tidak harus bilangan. Apa pun yang kamu tulis di dalam kurung masuk ke setiap slot, lengkap dengan kurungnya:\n$$f(-2) = (-2)^2 - 3(-2) = 4 + 6 = 10$$\n$$f(a + 1) = (a+1)^2 - 3(a+1)$$\nKurung di sekeliling $-2$ itu bukan hiasan. Tanpanya $-2^2$ bernilai $-4$, dan tanda seluruh jawabannya berubah.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which rule is **not** a function of $x$?',
                id: 'Aturan manakah yang **bukan** fungsi dari $x$?',
              },
              options: [
                { en: '$y = x^2$', id: '$y = x^2$' },
                { en: '$y^2 = x$', id: '$y^2 = x$' },
                { en: '$y = |x|$', id: '$y = |x|$' },
                { en: '$y = 5$ for every $x$', id: '$y = 5$ untuk setiap $x$' },
              ],
              answer: 1,
              explain: {
                en: '$y^2 = x$ gives two values of $y$ for every positive $x$ — at $x = 4$ both $y = 2$ and $y = -2$ satisfy it. The constant rule is a perfectly good function: every input gets exactly one output, and it happens to be the same one.',
                id: '$y^2 = x$ memberi dua nilai $y$ untuk setiap $x$ positif — pada $x = 4$ baik $y = 2$ maupun $y = -2$ memenuhinya. Aturan konstan justru fungsi yang sah: setiap masukan mendapat tepat satu keluaran, kebetulan keluaran yang sama.',
              },
              hint: {
                en: 'For each rule, pick one specific $x$ and ask how many values of $y$ actually satisfy it. Three of the four force exactly one answer no matter what $x$ you try.',
                id: 'Untuk tiap aturan, pilih satu $x$ tertentu dan tanyakan ada berapa nilai $y$ yang memenuhinya. Tiga dari empat aturan selalu memaksa tepat satu jawaban, berapa pun $x$-nya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph of $f(x) = x^2 - 3x$ below, what is the marked value $f(4)$?',
                id: 'Dengan membaca grafik $f(x) = x^2 - 3x$ di bawah, berapakah nilai $f(4)$ yang ditandai?',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 5],
                ySpan: [-3, 8],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^2-3*x', color: 'a', label: 'f(x)' },
                  { t: 'vline', x: 4, color: 'muted', dashed: true },
                  { t: 'dot', x: 4, y: 4, color: 'result' },
                ],
                caption: {
                  en: 'The dot marks the point $(4, f(4))$.',
                  id: 'Titik itu menandai titik $(4, f(4))$.',
                },
              },
              options: [
                { en: '16', id: '16' },
                { en: '4', id: '4' },
                { en: '-4', id: '-4' },
                { en: '28', id: '28' },
              ],
              answer: 1,
              explain: {
                en: '$f(4) = 4^2 - 3(4) = 16 - 12 = 4$, the same worked example as above. Forgetting the $-3x$ term gives 16 instead.',
                id: '$f(4) = 4^2 - 3(4) = 16 - 12 = 4$, contoh yang sama seperti di atas. Melupakan suku $-3x$ memberi 16.',
              },
              hint: {
                en: 'The dot on the graph sits at the marked height directly above $x = 4$ — but check that against the formula itself: square the input first, then subtract three times it.',
                id: 'Titik pada grafiknya berada tepat pada ketinggian yang ditandai di atas $x = 4$ — tetapi cocokkan dengan rumusnya sendiri: kuadratkan dulu masukannya, baru kurangi tiga kalinya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the evaluation of $f(x) = x^2 - 3x$ at $x = 2$.',
                id: 'Lengkapi penghitungan $f(x) = x^2 - 3x$ pada $x = 2$.',
              },
              template: 'f(2) = 2^2 - 3(2) = 4 - 6 = ___',
              blanks: ['-2'],
              explain: {
                en: '$4 - 6 = -2$. A function may perfectly well return a negative value at a positive input.',
                id: '$4 - 6 = -2$. Fungsi boleh saja menghasilkan nilai negatif pada masukan yang positif.',
              },
              hint: {
                en: 'You are subtracting a bigger number from a smaller one — which direction on the number line does that push the result?',
                id: 'Kamu mengurangkan bilangan yang lebih besar dari yang lebih kecil — ke arah mana hasilnya terdorong pada garis bilangan?',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Let $f(x) = 2x^2 - 5x + 1$. Evaluate it at each of these.',
                id: 'Misalkan $f(x) = 2x^2 - 5x + 1$. Hitung nilainya pada tiap masukan berikut.',
              },
              blanks: [
                { label: 'f(3) =', answer: 4 },
                { label: 'f(-1) =', answer: 8 },
                { label: 'f(0) =', answer: 1 },
              ],
              hints: [
                { en: 'Square first, then multiply, then add — the usual order.', id: 'Kuadratkan dulu, lalu kalikan, lalu jumlahkan — urutan operasi biasa.' },
                { en: 'For $f(-1)$: $2(-1)^2 = 2$ and $-5(-1) = +5$.', id: 'Untuk $f(-1)$: $2(-1)^2 = 2$ dan $-5(-1) = +5$.' },
              ],
              solution: [
                'f(3) = 2(9) - 15 + 1 = 18 - 15 + 1 = 4',
                'f(-1) = 2(1) + 5 + 1 = 8',
                'f(0) = 0 - 0 + 1 = 1',
              ],
              explain: {
                en: 'Note $f(0) = 1$: the constant term is always the value at zero, which is also where the graph crosses the vertical axis.',
                id: 'Perhatikan $f(0) = 1$: suku konstannya selalu merupakan nilai pada nol, dan di situ pula grafiknya memotong sumbu tegak.',
              },
            },
          ],
        },
        {
          id: 'fun-m1-s1-l2',
          title: { en: 'Natural Domain', id: 'Domain Alami' },
          goal: {
            en: 'Find every input a formula forbids, and state the domain that is left.',
            id: 'Menemukan setiap masukan yang dilarang oleh rumusnya, dan menyatakan domain yang tersisa.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Two things arithmetic refuses', id: 'Dua hal yang ditolak aritmetika' },
              body: {
                en: 'When a function is given by a formula and nothing else is said, its domain is the **natural domain**: every real number the formula can actually be evaluated at. Only two things rule an input out, and you look for both every time.\n\n**A zero denominator.** $\\dfrac{1}{x-3}$ is undefined at $x = 3$. Set the denominator to zero, solve, and throw those values out.\n\n**An even root of a negative.** $\\sqrt{x-4}$ is undefined for $x < 4$. Set what is under the root $\\geq 0$ and solve. An **odd** root has no such trouble: $\\sqrt[3]{-8} = -2$.\n\nLater you will meet a third — the logarithm, which refuses zero and everything below it.',
                id: 'Ketika sebuah fungsi diberikan lewat rumus dan tak ada keterangan lain, domainnya adalah **domain alami**: semua bilangan real yang benar-benar bisa dimasukkan ke rumus itu. Hanya dua hal yang menggugurkan sebuah masukan, dan keduanya diperiksa setiap kali.\n\n**Penyebut nol.** $\\dfrac{1}{x-3}$ tak terdefinisi di $x = 3$. Nolkan penyebutnya, selesaikan, lalu buang nilai-nilai itu.\n\n**Akar genap dari bilangan negatif.** $\\sqrt{x-4}$ tak terdefinisi untuk $x < 4$. Buat yang di bawah akarnya $\\geq 0$ lalu selesaikan. Akar **ganjil** tidak bermasalah: $\\sqrt[3]{-8} = -2$.\n\nNanti kamu akan bertemu yang ketiga — logaritma, yang menolak nol dan semua yang di bawahnya.',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 8],
                ySpan: [-4, 4],
                ticks: true,
                items: [
                  { t: 'curve', f: '1/(x-3)', color: 'a', label: '1/(x−3)' },
                  { t: 'vline', x: 3, color: 'a' },
                  { t: 'curve', f: 'sqrt(x-4)', from: 4, color: 'b', label: '√(x−4)' },
                  { t: 'dot', x: 4, y: 0, color: 'b' },
                ],
                caption: {
                  en: 'Two forbidden inputs, and what they look like. The first curve has nothing at all at $x = 3$ — it runs off in both directions instead. The second simply does not start until $x = 4$.',
                  id: 'Dua masukan terlarang, dan seperti apa bentuknya. Kurva pertama sama sekali tak punya nilai di $x = 3$ — ia justru lari ke dua arah. Kurva kedua sekadar belum mulai sebelum $x = 4$.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Writing a domain down', id: 'Menuliskan domain' },
              body: {
                en: 'Interval notation is the usual shorthand. A square bracket includes the endpoint, a round one excludes it, and infinity always gets a round one because it is not a number you can reach.\n$$[4, \\infty) \\text{ means } x \\geq 4$$\n$$(-\\infty, 3) \\cup (3, \\infty) \\text{ means every } x \\text{ except } 3$$\nWhen a formula has both kinds of trouble, both conditions must hold at once. For $\\dfrac{\\sqrt{x-1}}{x-5}$ you need $x \\geq 1$ **and** $x \\neq 5$, so the domain is $[1, 5) \\cup (5, \\infty)$.',
                id: 'Notasi selang adalah cara ringkas yang lazim. Kurung siku memuat titik ujungnya, kurung biasa tidak, dan tak hingga selalu memakai kurung biasa karena ia bukan bilangan yang bisa dicapai.\n$$[4, \\infty) \\text{ berarti } x \\geq 4$$\n$$(-\\infty, 3) \\cup (3, \\infty) \\text{ berarti setiap } x \\text{ kecuali } 3$$\nBila sebuah rumus mengandung kedua jenis masalah, kedua syaratnya harus berlaku bersamaan. Untuk $\\dfrac{\\sqrt{x-1}}{x-5}$ diperlukan $x \\geq 1$ **dan** $x \\neq 5$, sehingga domainnya $[1, 5) \\cup (5, \\infty)$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is the natural domain of $g(x) = \\sqrt{9 - x^2}$?',
                id: 'Apa domain alami dari $g(x) = \\sqrt{9 - x^2}$?',
              },
              options: [
                { en: '$x \\geq 3$', id: '$x \\geq 3$' },
                { en: '$-3 \\leq x \\leq 3$', id: '$-3 \\leq x \\leq 3$' },
                { en: 'Every real number', id: 'Semua bilangan real' },
                { en: '$x \\leq -3$ or $x \\geq 3$', id: '$x \\leq -3$ atau $x \\geq 3$' },
              ],
              answer: 1,
              explain: {
                en: 'You need $9 - x^2 \\geq 0$, that is $x^2 \\leq 9$, which is $-3 \\leq x \\leq 3$. Squaring makes both ends matter: $x = -4$ fails just as $x = 4$ does.',
                id: 'Diperlukan $9 - x^2 \\geq 0$, yaitu $x^2 \\leq 9$, yang berarti $-3 \\leq x \\leq 3$. Pengkuadratan membuat kedua ujungnya berpengaruh: $x = -4$ gagal sama seperti $x = 4$.',
              },
              hint: {
                en: 'A square root needs what is underneath it to be at least zero. Write down $9 - x^2 \\geq 0$ and think about which $x$ make $x^2$ too big for that to hold, on both sides of zero.',
                id: 'Akar kuadrat memerlukan isinya sekurang-kurangnya nol. Tulis $9 - x^2 \\geq 0$ dan pikirkan $x$ mana yang membuat $x^2$ terlalu besar untuk itu, di kedua sisi nol.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'The graph of $y = \\sqrt{x+2}$ is shown below. What is its domain?',
                id: 'Grafik $y = \\sqrt{x+2}$ ditunjukkan di bawah. Berapa domainnya?',
              },
              figure: {
                dim: 2,
                xSpan: [-4, 4],
                ySpan: [-1, 4],
                ticks: true,
                items: [
                  { t: 'curve', f: 'sqrt(x+2)', from: -2, color: 'a', label: '√(x+2)' },
                  { t: 'dot', x: -2, y: 0, color: 'a' },
                ],
                caption: {
                  en: 'The curve begins at the marked dot and runs rightward forever.',
                  id: 'Kurvanya bermula di titik yang ditandai dan berlanjut ke kanan selamanya.',
                },
              },
              options: [
                { en: '$[-2, \\infty)$', id: '$[-2, \\infty)$' },
                { en: '$(-\\infty, -2]$', id: '$(-\\infty, -2]$' },
                { en: '$[2, \\infty)$', id: '$[2, \\infty)$' },
                { en: 'Every real number', id: 'Semua bilangan real' },
              ],
              answer: 0,
              explain: {
                en: 'The curve starts exactly where the drawing shows it starting, at $x = -2$, and never stops — matching $x + 2 \\geq 0 \\Leftrightarrow x \\geq -2$.',
                id: 'Kurvanya bermula persis di tempat gambar menunjukkannya bermula, di $x = -2$, dan tak pernah berhenti — sesuai dengan $x + 2 \\geq 0 \\Leftrightarrow x \\geq -2$.',
              },
              hint: {
                en: 'Look at exactly where the drawn curve starts and which direction it keeps going. Then check that against solving $x + 2 \\geq 0$.',
                id: 'Perhatikan persis di mana kurvanya bermula dan ke arah mana ia terus berlanjut. Cocokkan itu dengan menyelesaikan $x + 2 \\geq 0$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the number each formula forbids or begins at.',
                id: 'Tentukan bilangan yang dilarang atau yang menjadi awal bagi tiap rumus.',
              },
              blanks: [
                {
                  label: {
                    en: '\\tfrac{5}{2x - 7}: \\text{ x excluded} =',
                    id: '\\tfrac{5}{2x - 7}: \\text{ x yang dilarang} =',
                  },
                  answer: 3.5,
                },
                {
                  label: {
                    en: '\\sqrt{3x - 12}: \\text{ smallest x} =',
                    id: '\\sqrt{3x - 12}: \\text{ x terkecil} =',
                  },
                  answer: 4,
                },
              ],
              hints: [
                { en: 'Set the denominator to zero for the first; set the inside of the root to zero for the second.', id: 'Nolkan penyebutnya untuk yang pertama; nolkan isi akarnya untuk yang kedua.' },
              ],
              solution: [
                '2x - 7 = 0 \\Rightarrow x = \\tfrac{7}{2} = 3{,}5',
                '3x - 12 \\geq 0 \\Rightarrow x \\geq 4',
              ],
              explain: {
                en: 'The first has domain $(-\\infty, 3{,}5) \\cup (3{,}5, \\infty)$; the second $[4, \\infty)$. One value is removed from the middle, the other is where everything starts.',
                id: 'Yang pertama berdomain $(-\\infty; 3{,}5) \\cup (3{,}5; \\infty)$; yang kedua $[4, \\infty)$. Yang satu membuang satu nilai di tengah, yang lain menjadi tempat semuanya bermula.',
              },
            },
          ],
        },
        {
          id: 'fun-m1-s1-l3',
          title: { en: 'Graphs and the Vertical Line Test', id: 'Grafik dan Uji Garis Tegak' },
          goal: {
            en: 'Read domain, range and intercepts off a picture, and test whether a curve is a function at all.',
            id: 'Membaca domain, range, dan titik potong dari gambar, serta menguji apakah suatu kurva memang fungsi.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The graph is the set of pairs', id: 'Grafik adalah himpunan pasangannya' },
              body: {
                en: 'The **graph** of $f$ is the set of points $(x, f(x))$ for every $x$ in the domain. So a graph is not a decoration attached to the formula — it **is** the function, drawn.\n\nThat gives the **vertical line test**: a curve in the plane is the graph of a function of $x$ exactly when no vertical line meets it more than once. A second meeting would be a second value of $y$ for one $x$, which the definition forbids.\n\nFrom the picture you can read: the **domain** as the shadow of the curve on the horizontal axis, the **range** as its shadow on the vertical axis, the **$y$-intercept** as $f(0)$, and the **$x$-intercepts** as the solutions of $f(x) = 0$.',
                id: '**Grafik** dari $f$ adalah himpunan titik $(x, f(x))$ untuk setiap $x$ di domainnya. Jadi grafik bukan hiasan yang ditempelkan pada rumus — ia **adalah** fungsinya, digambar.\n\nDari situ lahir **uji garis tegak**: sebuah kurva di bidang merupakan grafik fungsi dari $x$ tepat ketika tak ada garis tegak yang memotongnya lebih dari sekali. Perpotongan kedua berarti ada nilai $y$ kedua untuk satu $x$, dan itu dilarang oleh definisinya.\n\nDari gambarnya kamu bisa membaca: **domain** sebagai bayangan kurva pada sumbu mendatar, **range** sebagai bayangannya pada sumbu tegak, **titik potong sumbu $y$** sebagai $f(0)$, dan **titik potong sumbu $x$** sebagai penyelesaian $f(x) = 0$.',
              },
              figure: {
                dim: 2,
                xSpan: [-4, 4],
                ySpan: [-4, 4],
                ticks: true,
                items: [
                  { t: 'curve', f: 'sqrt(9-x^2)', from: -3, to: 3, color: 'a', label: 'setengah atas' },
                  { t: 'curve', f: '-sqrt(9-x^2)', from: -3, to: 3, color: 'muted', dashed: true, label: 'setengah bawah' },
                  { t: 'vline', x: 1.5, color: 'b' },
                ],
                caption: {
                  en: 'The whole circle fails the test — the vertical line meets it twice. The solid upper half passes, and it is the graph of $y = \\sqrt{9 - x^2}$: domain $[-3, 3]$, range $[0, 3]$.',
                  id: 'Lingkaran utuh tidak lolos uji — garis tegaknya memotong dua kali. Setengah bagian atas yang digambar penuh lolos, dan itulah grafik $y = \\sqrt{9 - x^2}$: domain $[-3, 3]$, range $[0, 3]$.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A graph runs from $x = -2$ to $x = 5$, dipping to a lowest point of $-3$ and rising to a highest point of $4$. What is its range?',
                id: 'Sebuah grafik terbentang dari $x = -2$ sampai $x = 5$, turun sampai titik terendah $-3$ dan naik sampai titik tertinggi $4$. Apa range-nya?',
              },
              options: [
                { en: '$[-2, 5]$', id: '$[-2, 5]$' },
                { en: '$[-3, 4]$', id: '$[-3, 4]$' },
                { en: '$[-3, 5]$', id: '$[-3, 5]$' },
                { en: 'It cannot be told from that description.', id: 'Tak bisa ditentukan dari keterangan itu.' },
              ],
              answer: 1,
              explain: {
                en: 'The range is read off the **vertical** axis: lowest output to highest output, $[-3, 4]$. The $x$ values $[-2, 5]$ are the domain — swapping the two is the most common slip here.',
                id: 'Range dibaca dari sumbu **tegak**: dari keluaran terendah sampai tertinggi, $[-3, 4]$. Nilai $x$ yaitu $[-2, 5]$ adalah domainnya — menukar keduanya adalah kekeliruan yang paling sering terjadi di sini.',
              },
              hint: {
                en: 'Range comes from the heights the graph reaches, not the horizontal stretch it runs along. Re-read the description and separate which numbers describe up-down and which describe left-right.',
                id: 'Range berasal dari ketinggian yang dicapai grafiknya, bukan rentang mendatar yang dilaluinya. Baca ulang keterangannya dan pisahkan bilangan mana yang menggambarkan naik-turun dan mana yang kiri-kanan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'What is the range of the function graphed below, for $-2 \\leq x \\leq 4$?',
                id: 'Berapa range fungsi yang digambar di bawah, untuk $-2 \\leq x \\leq 4$?',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 5],
                ySpan: [-1, 4],
                ticks: true,
                items: [
                  { t: 'curve', f: 'abs(x-1)', from: -2, to: 4, color: 'a' },
                  { t: 'dot', x: 1, y: 0, color: 'result' },
                ],
              },
              options: [
                { en: '$[0, 3]$', id: '$[0, 3]$' },
                { en: '$[-2, 4]$', id: '$[-2, 4]$' },
                { en: '$[0, 4]$', id: '$[0, 4]$' },
                { en: 'Every non-negative real number', id: 'Semua bilangan real tak negatif' },
              ],
              answer: 0,
              explain: {
                en: 'The lowest point is $0$, at the marked dot; the highest points are the two ends, each at height $|{-2}-1| = |4-1| = 3$. So the range is $[0, 3]$ — $[-2, 4]$ is the domain, not the range.',
                id: 'Titik terendahnya $0$, di titik yang ditandai; titik tertingginya kedua ujung, masing-masing setinggi $|{-2}-1| = |4-1| = 3$. Jadi range-nya $[0, 3]$ — $[-2, 4]$ adalah domain, bukan range.',
              },
              hint: {
                en: 'Trace only the curve\'s height across the picture, ignoring the horizontal axis. What is the lowest point it touches, and how high do the two ends reach?',
                id: 'Telusuri hanya ketinggian kurvanya pada gambar, abaikan sumbu mendatar. Berapa titik terendah yang disentuhnya, dan setinggi apa kedua ujungnya?',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the working that finds the intercepts of $y = x^2 - 4x + 3$.',
                id: 'Susun langkah untuk menentukan titik-titik potong $y = x^2 - 4x + 3$.',
              },
              lines: {
                en: [
                  'x = 0: \\quad y = 0 - 0 + 3 = 3',
                  '\\text{y-intercept}: (0, 3)',
                  'y = 0: \\quad x^2 - 4x + 3 = (x-1)(x-3) = 0',
                  '\\text{x-intercepts}: (1, 0) \\text{ and } (3, 0)',
                ],
                id: [
                  'x = 0: \\quad y = 0 - 0 + 3 = 3',
                  '\\text{potong sumbu } y: (0, 3)',
                  'y = 0: \\quad x^2 - 4x + 3 = (x-1)(x-3) = 0',
                  '\\text{potong sumbu } x: (1, 0) \\text{ dan } (3, 0)',
                ],
              },
              explain: {
                en: 'Set $x = 0$ for the vertical intercept and $y = 0$ for the horizontal ones. There is at most one of the first — a function has only one value at zero — but there may be several of the second.',
                id: 'Nolkan $x$ untuk titik potong sumbu tegak dan nolkan $y$ untuk yang mendatar. Yang pertama paling banyak satu — fungsi hanya punya satu nilai di nol — sedangkan yang kedua bisa beberapa.',
              },
              hint: {
                en: 'Two of these lines are computations and two are announcements of a point. An announcement can only come after the computation that produces the number it names — which line hands the y-intercept its number, and which hands the x-intercepts theirs?',
                id: 'Dua dari baris ini adalah perhitungan dan dua lagi adalah pengumuman sebuah titik. Pengumuman hanya bisa muncul setelah perhitungan yang menghasilkan bilangan yang disebutnya — baris mana yang memberi bilangan untuk titik potong sumbu $y$, dan mana untuk titik potong sumbu $x$?',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $y = x^2 - 4x + 3$, find the intercepts and the lowest point.',
                id: 'Untuk $y = x^2 - 4x + 3$, tentukan titik-titik potongnya dan titik terendahnya.',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 5],
                ySpan: [-2, 6],
                ticks: true,
                items: [{ t: 'curve', f: 'x^2-4*x+3', color: 'a' }],
                caption: {
                  en: 'Read your answers against the curve when you are done.',
                  id: 'Cocokkan jawabanmu dengan kurvanya setelah selesai.',
                },
              },
              blanks: [
                {
                  label: { en: '\\text{y-intercept}: \\ y =', id: '\\text{potong sumbu } y: \\ y =' },
                  answer: 3,
                },
                {
                  label: { en: '\\text{x-intercept}: \\ x =', id: '\\text{potong sumbu } x: \\ x =' },
                  answer: 1,
                },
                { label: { en: '\\text{and } x =', id: '\\text{dan } x =' }, answer: 3 },
                {
                  label: { en: '\\text{lowest point: } y =', id: '\\text{titik terendah: } y =' },
                  answer: -1,
                },
              ],
              hints: [
                { en: 'The lowest point of $ax^2 + bx + c$ sits at $x = -b/(2a)$.', id: 'Titik terendah $ax^2 + bx + c$ berada di $x = -b/(2a)$.' },
                { en: 'Here $x = 4/2 = 2$; now put 2 back into the formula.', id: 'Di sini $x = 4/2 = 2$; sekarang masukkan 2 kembali ke rumusnya.' },
              ],
              solution: {
                en: [
                  'y\\text{-int}: f(0) = 3',
                  'x\\text{-int}: (x-1)(x-3) = 0 \\Rightarrow x = 1, \\ x = 3',
                  'x_{\\text{vertex}} = \\tfrac{4}{2} = 2, \\quad f(2) = 4 - 8 + 3 = -1',
                ],
                id: [
                  'y\\text{-int}: f(0) = 3',
                  'x\\text{-int}: (x-1)(x-3) = 0 \\Rightarrow x = 1, \\ x = 3',
                  'x_{\\text{puncak}} = \\tfrac{4}{2} = 2, \\quad f(2) = 4 - 8 + 3 = -1',
                ],
              },
              explain: {
                en: 'The turning point sits halfway between the two roots, at $x = 2$, and its value $-1$ is the smallest the function takes. So the range is $[-1, \\infty)$.',
                id: 'Titik baliknya berada tepat di tengah kedua akarnya, di $x = 2$, dan nilainya $-1$ adalah yang terkecil yang dicapai fungsi itu. Jadi range-nya $[-1, \\infty)$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'fun-m1-s1-p',
        runtime: 'math',
        title: { en: 'Domain, Range, Value', id: 'Domain, Range, Nilai' },
        brief: {
          en: 'Three problems: evaluate, find what a formula forbids, and read a parabola.',
          id: 'Tiga soal: menghitung nilai, menemukan yang dilarang sebuah rumus, dan membaca parabola.',
        },
        requirements: [
          { en: 'Check every formula for a zero denominator and for an even root of a negative.', id: 'Periksa setiap rumus terhadap penyebut nol dan akar genap dari bilangan negatif.' },
          { en: 'Fractions are read as they are: `7/2` needs no decimal.', id: 'Pecahan dibaca apa adanya: `7/2` tak perlu diubah ke desimal.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'For $f(x) = \\dfrac{x + 1}{x - 2}$, evaluate $f(5)$ and $f(0)$.',
              id: 'Untuk $f(x) = \\dfrac{x + 1}{x - 2}$, hitung $f(5)$ dan $f(0)$.',
            },
            blanks: [
              { label: 'f(5) =', answer: 2 },
              { label: 'f(0) =', answer: -0.5 },
            ],
            solution: ['f(5) = \\tfrac{6}{3} = 2', 'f(0) = \\tfrac{1}{-2} = -\\tfrac{1}{2}'],
          },
          {
            prompt: {
              en: 'The domain of $g(x) = \\dfrac{\\sqrt{x - 1}}{x - 5}$ starts at one number and is missing another. Find both.',
              id: 'Domain dari $g(x) = \\dfrac{\\sqrt{x - 1}}{x - 5}$ dimulai pada satu bilangan dan kehilangan satu bilangan lain. Tentukan keduanya.',
            },
            blanks: [
              { label: { en: '\\text{starts at } x =', id: '\\text{dimulai di } x =' }, answer: 1 },
              { label: { en: '\\text{excluded: } x =', id: '\\text{dilarang: } x =' }, answer: 5 },
            ],
            solution: [
              'x - 1 \\geq 0 \\Rightarrow x \\geq 1',
              'x - 5 \\neq 0 \\Rightarrow x \\neq 5',
              'D = [1, 5) \\cup (5, \\infty)',
            ],
          },
          {
            prompt: {
              en: 'For $y = -x^2 + 6x - 5$, find the two $x$-intercepts and the highest value the function reaches.',
              id: 'Untuk $y = -x^2 + 6x - 5$, tentukan kedua titik potong sumbu $x$ dan nilai tertinggi yang dicapai fungsi itu.',
            },
            blanks: [
              { label: 'x =', answer: 1 },
              { label: { en: '\\text{and } x =', id: '\\text{dan } x =' }, answer: 5 },
              { label: { en: 'y_{\\text{max}} =', id: 'y_{\\text{maks}} =' }, answer: 4 },
            ],
            solution: {
              en: [
                '-x^2 + 6x - 5 = -(x-1)(x-5) = 0 \\Rightarrow x = 1, \\ x = 5',
                'x_{\\text{vertex}} = \\tfrac{-6}{2(-1)} = 3',
                'y = -9 + 18 - 5 = 4',
              ],
              id: [
                '-x^2 + 6x - 5 = -(x-1)(x-5) = 0 \\Rightarrow x = 1, \\ x = 5',
                'x_{\\text{puncak}} = \\tfrac{-6}{2(-1)} = 3',
                'y = -9 + 18 - 5 = 4',
              ],
            },
          },
        ],
        hints: [
          {
            en: 'In part 3 the leading coefficient is negative, so the parabola opens downwards and the turning point is a maximum, not a minimum.',
            id: 'Pada butir 3 koefisien utamanya negatif, jadi parabolanya terbuka ke bawah dan titik baliknya maksimum, bukan minimum.',
          },
          {
            en: 'The turning point always sits halfway between the two roots — here halfway between 1 and 5.',
            id: 'Titik baliknya selalu berada tepat di tengah kedua akarnya — di sini di tengah 1 dan 5.',
          },
        ],
        xp: 50,
      },
    },

    /* --------------------------------------------- 1.2 reading off a graph */
    {
      id: 'fun-m1-s2',
      title: { en: 'Reading a Graph', id: 'Membaca Grafik' },
      summary: {
        en: 'Piecewise rules, symmetry, where a function rises and falls, and the families it may belong to.',
        id: 'Aturan sepotong-sepotong, kesimetrian, di mana fungsi naik dan turun, serta keluarga tempat ia bernaung.',
      },
      lessons: [
        {
          id: 'fun-m1-s2-l1',
          title: { en: 'Piecewise Functions and Absolute Value', id: 'Fungsi Sepotong-sepotong dan Nilai Mutlak' },
          goal: {
            en: 'Evaluate a function given by different rules on different intervals, and see |x| as one of them.',
            id: 'Menghitung nilai fungsi yang aturannya berbeda pada selang berbeda, dan melihat |x| sebagai salah satunya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A different rule on each stretch', id: 'Aturan berbeda di tiap bagian' },
              body: {
                en: 'Nothing says one function must be one formula. A **piecewise** function gives a rule for each part of its domain:\n$$f(x) = \\begin{cases} -x, & x < 1 \\\\ x^2, & x \\geq 1 \\end{cases}$$\nTo evaluate, first decide which line the input falls under, then use only that line. $f(-3)$ uses the top ($-3 < 1$) and equals 3; $f(4)$ uses the bottom and equals 16.\n\nThe boundary belongs to exactly one line — here $x = 1$ goes with the bottom, because of the $\\geq$. On the graph that is drawn with a **filled dot** where the value is taken and a **hollow dot** where it is not.',
                id: 'Tak ada yang mengharuskan satu fungsi berupa satu rumus. Fungsi **sepotong-sepotong** memberi satu aturan untuk tiap bagian domainnya:\n$$f(x) = \\begin{cases} -x, & x < 1 \\\\ x^2, & x \\geq 1 \\end{cases}$$\nUntuk menghitung nilainya, tentukan dulu masukannya jatuh pada baris yang mana, lalu pakai baris itu saja. $f(-3)$ memakai baris atas ($-3 < 1$) dan bernilai 3; $f(4)$ memakai baris bawah dan bernilai 16.\n\nBatasnya menjadi milik tepat satu baris — di sini $x = 1$ ikut baris bawah, karena tanda $\\geq$-nya. Pada grafik hal itu digambar dengan **titik penuh** di tempat nilainya diambil dan **titik kosong** di tempat nilainya tidak diambil.',
              },
              figure: {
                dim: 2,
                xSpan: [-4, 4],
                ySpan: [-3, 5],
                ticks: true,
                items: [
                  { t: 'curve', f: '-x', from: -4, to: 1, color: 'a' },
                  { t: 'curve', f: 'x^2', from: 1, to: 2.2, color: 'b' },
                  { t: 'dot', x: 1, y: -1, open: true, color: 'a' },
                  { t: 'dot', x: 1, y: 1, color: 'b' },
                ],
                caption: {
                  en: 'At $x = 1$ the top rule would have given $-1$, but it is not allowed to — hence the hollow dot. The value there is $1$, from the bottom rule.',
                  id: 'Di $x = 1$ aturan atas akan memberi $-1$, tetapi ia tidak diizinkan — karena itulah titiknya kosong. Nilainya di situ adalah $1$, dari aturan bawah.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Absolute value is piecewise', id: 'Nilai mutlak itu sepotong-sepotong' },
              body: {
                en: '$|x|$ means the distance from $x$ to zero, which is exactly\n$$|x| = \\begin{cases} x, & x \\geq 0 \\\\ -x, & x < 0 \\end{cases}$$\nSo $|-7| = -(-7) = 7$. The minus sign in the second line does not make the answer negative; it makes it positive, because $x$ was already negative.\n\nIts graph is a V with the corner at the origin. Every absolute-value graph in this course is that V, moved and stretched.',
                id: '$|x|$ berarti jarak dari $x$ ke nol, yang persis sama dengan\n$$|x| = \\begin{cases} x, & x \\geq 0 \\\\ -x, & x < 0 \\end{cases}$$\nJadi $|-7| = -(-7) = 7$. Tanda minus pada baris kedua tidak membuat jawabannya negatif; justru membuatnya positif, karena $x$-nya memang sudah negatif.\n\nGrafiknya berupa huruf V dengan sudut di titik asal. Setiap grafik nilai mutlak dalam kursus ini adalah V itu, yang digeser dan diregangkan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'With $f$ as in the figure above, what is $f(1)$?',
                id: 'Dengan $f$ seperti pada gambar di atas, berapakah $f(1)$?',
              },
              options: [
                { en: '$-1$', id: '$-1$' },
                { en: '$1$', id: '$1$' },
                { en: 'Both — it is defined twice.', id: 'Keduanya — ia terdefinisi dua kali.' },
                { en: 'Undefined.', id: 'Tak terdefinisi.' },
              ],
              answer: 1,
              explain: {
                en: 'The second line carries $x \\geq 1$, so $x = 1$ belongs to it and $f(1) = 1^2 = 1$. If both lines had claimed $x = 1$ with different values, the rule would not be a function at all.',
                id: 'Baris kedua membawa syarat $x \\geq 1$, jadi $x = 1$ menjadi miliknya dan $f(1) = 1^2 = 1$. Kalau kedua baris sama-sama mengklaim $x = 1$ dengan nilai berbeda, aturannya justru bukan fungsi.',
              },
              hint: {
                en: 'Look at the two inequality signs closely — one is strict ($<$) and one includes equality ($\\geq$). Which line actually owns the boundary point $x = 1$?',
                id: 'Perhatikan baik-baik kedua tanda pertidaksamaannya — satu tegas ($<$) dan satu memuat kesamaan ($\\geq$). Baris mana yang sebenarnya memiliki titik batas $x = 1$?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'With $g(x) = x + 2$ for $x < 0$ and $g(x) = 3$ for $x \\geq 0$, graphed below, what is $g(0)$?',
                id: 'Dengan $g(x) = x + 2$ untuk $x < 0$ dan $g(x) = 3$ untuk $x \\geq 0$, yang digambar di bawah, berapakah $g(0)$?',
              },
              figure: {
                dim: 2,
                xSpan: [-4, 4],
                ySpan: [-2, 4],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x+2', from: -4, to: 0, color: 'a' },
                  { t: 'dot', x: 0, y: 2, open: true, color: 'a' },
                  { t: 'seg', from: [0, 3], to: [4, 3], color: 'b' },
                  { t: 'dot', x: 0, y: 3, color: 'b' },
                ],
              },
              options: [
                { en: '2', id: '2' },
                { en: '3', id: '3' },
                { en: 'Undefined', id: 'Tak terdefinisi' },
                { en: 'Both 2 and 3', id: 'Keduanya, 2 dan 3' },
              ],
              answer: 1,
              explain: {
                en: 'The boundary $x = 0$ belongs to the bottom rule, because of the $\\geq$ — shown by the filled dot at $(0, 3)$. The hollow dot at $(0, 2)$ is the value the top rule would have given, but is not taken.',
                id: 'Batas $x = 0$ menjadi milik aturan bawah, karena tanda $\\geq$-nya — ditunjukkan oleh titik penuh di $(0, 3)$. Titik kosong di $(0, 2)$ adalah nilai yang akan diberikan aturan atas, tetapi tidak diambil.',
              },
              hint: {
                en: 'Look at the graph right at $x = 0$: one dot there is filled in and one is hollow. The filled dot is the value actually taken.',
                id: 'Perhatikan grafiknya tepat di $x = 0$: satu titik di situ penuh dan satu kosong. Titik yang penuh adalah nilai yang sungguh diambil.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'With $f(x) = -x$ for $x < 1$ and $f(x) = x^2$ for $x \\geq 1$, evaluate each.',
                id: 'Dengan $f(x) = -x$ untuk $x < 1$ dan $f(x) = x^2$ untuk $x \\geq 1$, hitung tiap nilainya.',
              },
              blanks: [
                { label: 'f(-3) =', answer: 3 },
                { label: 'f(0) =', answer: 0 },
                { label: 'f(1) =', answer: 1 },
                { label: 'f(3) =', answer: 9 },
              ],
              hints: [
                { en: 'Decide which line the input falls under before you calculate anything.', id: 'Tentukan masukannya jatuh pada baris yang mana sebelum menghitung apa pun.' },
                { en: '$-3$ and $0$ are both below 1; $1$ and $3$ are not.', id: '$-3$ dan $0$ sama-sama di bawah 1; $1$ dan $3$ tidak.' },
              ],
              explain: {
                en: 'Three of these use the first rule or the second cleanly. The interesting one is $f(1) = 1$, which is where the two rules meet — and here they happen to disagree, which is why the graph jumps.',
                id: 'Tiga di antaranya memakai aturan pertama atau kedua dengan jelas. Yang menarik adalah $f(1) = 1$, tempat kedua aturan bertemu — dan di sini keduanya kebetulan tidak sepakat, itulah sebabnya grafiknya melompat.',
              },
            },
          ],
        },
        {
          id: 'fun-m1-s2-l2',
          title: { en: 'Even, Odd, and Symmetry', id: 'Genap, Ganjil, dan Simetri' },
          goal: {
            en: 'Test a formula for symmetry, and know what each kind looks like.',
            id: 'Menguji kesimetrian sebuah rumus, dan mengetahui rupa masing-masing jenisnya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Two symmetries, one test', id: 'Dua kesimetrian, satu uji' },
              body: {
                en: 'A function is **even** if $f(-x) = f(x)$ for every $x$ in its domain, and **odd** if $f(-x) = -f(x)$.\n\nThe test is always the same: replace $x$ by $-x$, simplify, and compare the result with the original.\n\n**Even** means the graph is symmetric about the $y$-axis — fold the page along it and the halves match. $x^2$, $x^4$ and $|x|$ are even, and the even powers are where the name comes from.\n\n**Odd** means symmetric about the origin — turn the page a half-turn and the graph lands on itself. $x$, $x^3$ and $1/x$ are odd.\n\nMost functions are neither. $x^2 + x$ is neither, and there is nothing wrong with it.',
                id: 'Sebuah fungsi disebut **genap** bila $f(-x) = f(x)$ untuk setiap $x$ di domainnya, dan **ganjil** bila $f(-x) = -f(x)$.\n\nUjinya selalu sama: ganti $x$ dengan $-x$, sederhanakan, lalu bandingkan hasilnya dengan yang semula.\n\n**Genap** berarti grafiknya simetris terhadap sumbu $y$ — lipat kertasnya pada sumbu itu dan kedua belahannya berimpit. $x^2$, $x^4$, dan $|x|$ genap, dan dari pangkat genap itulah namanya berasal.\n\n**Ganjil** berarti simetris terhadap titik asal — putar kertasnya setengah putaran dan grafiknya kembali menempati dirinya. $x$, $x^3$, dan $1/x$ ganjil.\n\nKebanyakan fungsi bukan keduanya. $x^2 + x$ bukan genap maupun ganjil, dan itu sama sekali tidak keliru.',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 3],
                ySpan: [-4, 4],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^2', color: 'a', label: 'x² genap' },
                  { t: 'curve', f: 'x^3', color: 'b', label: 'x³ ganjil' },
                ],
                caption: {
                  en: 'Fold along the vertical axis and the parabola matches itself. Turn the page half a turn and the cubic matches itself.',
                  id: 'Lipat pada sumbu tegak dan parabolanya berimpit dengan dirinya. Putar kertasnya setengah putaran dan kurva pangkat tiganya berimpit dengan dirinya.',
                },
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Substitute $-x$ into $f(x) = x^4 - 3x^2$ and finish the comparison.',
                id: 'Substitusikan $-x$ ke $f(x) = x^4 - 3x^2$ lalu selesaikan perbandingannya.',
              },
              template: 'f(-x) = (-x)^4 - 3(-x)^2 = x^4 - ___ x^2',
              blanks: ['3'],
              explain: {
                en: 'Both powers are even, so both minus signs vanish and $f(-x) = f(x)$: the function is even.',
                id: 'Kedua pangkatnya genap, jadi kedua tanda minusnya lenyap dan $f(-x) = f(x)$: fungsinya genap.',
              },
              hint: {
                en: 'A negative number raised to an even power comes out positive. Apply that to both $(-x)^4$ and $(-x)^2$ before you decide what coefficient is left in front of $x^2$.',
                id: 'Bilangan negatif dipangkatkan genap hasilnya positif. Terapkan itu pada $(-x)^4$ maupun $(-x)^2$ sebelum menentukan koefisien apa yang tersisa di depan $x^2$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Is $h(x) = x^3 + 2x$ even, odd, or neither?',
                id: 'Apakah $h(x) = x^3 + 2x$ genap, ganjil, atau bukan keduanya?',
              },
              options: [
                { en: 'Even', id: 'Genap' },
                { en: 'Odd', id: 'Ganjil' },
                { en: 'Neither', id: 'Bukan keduanya' },
                { en: 'Both', id: 'Keduanya' },
              ],
              answer: 1,
              explain: {
                en: '$h(-x) = -x^3 - 2x = -(x^3 + 2x) = -h(x)$. Every power is odd, so every term changes sign together — which is exactly what being odd means.',
                id: '$h(-x) = -x^3 - 2x = -(x^3 + 2x) = -h(x)$. Setiap pangkatnya ganjil, jadi semua sukunya berganti tanda bersama-sama — dan itu persis makna ganjil.',
              },
              hint: {
                en: 'Substitute $-x$ into $h$ and simplify completely, then compare the result to $h(x)$ and separately to $-h(x)$ — only one of those two comparisons will match.',
                id: 'Substitusikan $-x$ ke $h$ dan sederhanakan sepenuhnya, lalu bandingkan hasilnya dengan $h(x)$ dan secara terpisah dengan $-h(x)$ — hanya satu dari kedua perbandingan itu yang cocok.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Looking only at the graph below — no algebra — is this function even, odd, or neither?',
                id: 'Hanya dengan melihat grafik di bawah — tanpa aljabar — apakah fungsi ini genap, ganjil, atau bukan keduanya?',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 2],
                ySpan: [-1.5, 1],
                ticks: true,
                items: [{ t: 'curve', f: 'x^4-2*x^2', color: 'a' }],
              },
              options: [
                { en: 'Even', id: 'Genap' },
                { en: 'Odd', id: 'Ganjil' },
                { en: 'Neither', id: 'Bukan keduanya' },
                { en: 'It cannot be told from a picture', id: 'Tak bisa ditentukan hanya dari gambar' },
              ],
              answer: 0,
              explain: {
                en: 'Fold the page along the vertical axis and the two halves land on each other — exactly the visual test for an even function.',
                id: 'Lipat halamannya pada sumbu tegak dan kedua belahannya berimpit — persis uji visual untuk fungsi genap.',
              },
              hint: {
                en: 'Imagine two different moves on the picture: folding it along the vertical axis, and spinning it a half-turn around the origin. Which one leaves this particular curve looking exactly the same?',
                id: 'Bayangkan dua gerakan berbeda pada gambarnya: melipatnya pada sumbu tegak, dan memutarnya setengah putaran mengelilingi titik asal. Yang mana yang membuat kurva ini tampak persis sama?',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $h(x) = x^3 + 2x$, compute both values and see the symmetry in the numbers.',
                id: 'Untuk $h(x) = x^3 + 2x$, hitung kedua nilainya dan lihat kesimetriannya pada bilangan-bilangannya.',
              },
              blanks: [
                { label: 'h(2) =', answer: 12 },
                { label: 'h(-2) =', answer: -12 },
              ],
              hints: [{ en: '$(-2)^3 = -8$, not $8$.', id: '$(-2)^3 = -8$, bukan $8$.' }],
              solution: ['h(2) = 8 + 4 = 12', 'h(-2) = -8 - 4 = -12 = -h(2)'],
              explain: {
                en: 'The two values are negatives of each other, as they must be for an odd function. An even function would have given the same number twice.',
                id: 'Kedua nilainya saling berlawanan tanda, sebagaimana seharusnya untuk fungsi ganjil. Fungsi genap akan memberi bilangan yang sama dua kali.',
              },
            },
          ],
        },
        {
          id: 'fun-m1-s2-l3',
          title: { en: 'Rising, Falling, and the Standard Families', id: 'Naik, Turun, dan Keluarga Fungsi Baku' },
          goal: {
            en: 'Say where a function increases or decreases, and name the family a formula belongs to.',
            id: 'Menyebut di mana fungsi naik atau turun, dan menamai keluarga tempat sebuah rumus bernaung.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Increasing and decreasing', id: 'Naik dan turun' },
              body: {
                en: 'On an interval $I$, a function is **increasing** if $f(x_1) < f(x_2)$ whenever $x_1 < x_2$ in $I$, and **decreasing** if $f(x_1) > f(x_2)$ instead.\n\nTwo things are worth saying plainly. First, these are properties **of an interval**, never of a single point: $x^2$ is decreasing on $(-\\infty, 0]$ and increasing on $[0, \\infty)$, and it is neither "at" $x = 0$. Second, reading a graph left to right, increasing means going uphill.\n\nWhere a function stops rising and starts falling is where its largest value sits — which is the question all of optimisation turns out to be.',
                id: 'Pada suatu selang $I$, fungsi disebut **naik** bila $f(x_1) < f(x_2)$ setiap kali $x_1 < x_2$ di $I$, dan **turun** bila justru $f(x_1) > f(x_2)$.\n\nDua hal layak dinyatakan terang-terangan. Pertama, sifat ini melekat **pada selang**, tak pernah pada satu titik: $x^2$ turun pada $(-\\infty, 0]$ dan naik pada $[0, \\infty)$, dan ia bukan keduanya "di" $x = 0$. Kedua, membaca grafik dari kiri ke kanan, naik berarti menanjak.\n\nTempat sebuah fungsi berhenti naik lalu mulai turun adalah tempat nilai terbesarnya berada — dan ternyata itulah pertanyaan yang ditanyakan seluruh persoalan optimasi.',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 3],
                ySpan: [-4, 4],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^3-3*x', color: 'a', label: 'x³ − 3x' },
                  { t: 'dot', x: -1, y: 2, label: 'puncak' },
                  { t: 'dot', x: 1, y: -2, label: 'lembah' },
                ],
                caption: {
                  en: 'Uphill until $x = -1$, downhill from there to $x = 1$, uphill again after. The two marked points are where it turns.',
                  id: 'Menanjak sampai $x = -1$, menurun dari situ sampai $x = 1$, lalu menanjak lagi. Dua titik yang ditandai adalah tempat ia berbalik.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The families you will keep meeting', id: 'Keluarga yang akan terus kamu temui' },
              body: {
                en: '**Linear**: $f(x) = mx + b$. A straight line, slope $m$.\n**Power**: $f(x) = x^a$. Whole $a$ gives parabolas and cubics; $a = -1$ gives $1/x$; $a = \\tfrac{1}{2}$ gives $\\sqrt{x}$.\n**Polynomial**: a sum of whole-number powers, $a_nx^n + \\ldots + a_0$. Defined for every real number, always.\n**Rational**: one polynomial over another, $p(x)/q(x)$. Defined wherever $q(x) \\neq 0$ — which is where domain trouble starts.\n**Algebraic**: anything built from polynomials with $+ - \\times \\div$ and roots.\n\nEverything past that point is called **transcendental**, and this course meets three of them: trigonometric, exponential, and logarithmic. They take up the next four modules.',
                id: '**Linear**: $f(x) = mx + b$. Berupa garis lurus, dengan kemiringan $m$.\n**Pangkat**: $f(x) = x^a$. $a$ bilangan bulat memberi parabola dan kurva pangkat tiga; $a = -1$ memberi $1/x$; $a = \\tfrac{1}{2}$ memberi $\\sqrt{x}$.\n**Polinom**: jumlahan pangkat bilangan bulat, $a_nx^n + \\ldots + a_0$. Selalu terdefinisi untuk setiap bilangan real.\n**Rasional**: satu polinom dibagi polinom lain, $p(x)/q(x)$. Terdefinisi di mana pun $q(x) \\neq 0$ — dan di situlah masalah domain bermula.\n**Aljabar**: apa pun yang dibangun dari polinom dengan $+ - \\times \\div$ dan akar.\n\nSemua yang di luar itu disebut **transenden**, dan kursus ini menemui tiga di antaranya: trigonometri, eksponen, dan logaritma. Ketiganya mengisi empat modul berikutnya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'On which interval is $f(x) = (x - 4)^2$ decreasing?',
                id: 'Pada selang mana $f(x) = (x - 4)^2$ turun?',
              },
              options: [
                { en: '$(-\\infty, 4]$', id: '$(-\\infty, 4]$' },
                { en: '$[4, \\infty)$', id: '$[4, \\infty)$' },
                { en: '$(-\\infty, 0]$', id: '$(-\\infty, 0]$' },
                { en: 'Nowhere — a square is never decreasing.', id: 'Tidak di mana pun — kuadrat tak pernah turun.' },
              ],
              answer: 0,
              explain: {
                en: 'It is the parabola $x^2$ moved four to the right, so its turning point is at $x = 4$: downhill before it, uphill after. That "moved four to the right" is the whole of Module 2.',
                id: 'Ia adalah parabola $x^2$ yang digeser empat satuan ke kanan, jadi titik baliknya di $x = 4$: menurun sebelum itu, menanjak sesudahnya. "Digeser empat ke kanan" itulah seluruh isi Modul 2.',
              },
              hint: {
                en: 'This is $x^2$ shifted horizontally. Work out where its turning point has moved to, then recall which side of a parabola\'s turning point goes downhill.',
                id: 'Ini adalah $x^2$ yang digeser mendatar. Cari tahu titik baliknya berpindah ke mana, lalu ingat sisi mana dari titik balik parabola yang menurun.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'On which interval is the function graphed below increasing?',
                id: 'Pada selang mana fungsi yang digambar di bawah naik?',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 5],
                ySpan: [-2, 4],
                ticks: true,
                items: [
                  { t: 'curve', f: '-(x-2)^2+3', color: 'a' },
                  { t: 'dot', x: 2, y: 3, label: 'puncak' },
                ],
              },
              options: [
                { en: '$(-\\infty, 2]$', id: '$(-\\infty, 2]$' },
                { en: '$[2, \\infty)$', id: '$[2, \\infty)$' },
                { en: 'Everywhere', id: 'Di mana pun' },
                { en: 'Nowhere', id: 'Tidak di mana pun' },
              ],
              answer: 0,
              explain: {
                en: 'Reading left to right, the curve climbs uphill until the marked peak at $x = 2$, then falls — so it increases on $(-\\infty, 2]$.',
                id: 'Dibaca dari kiri ke kanan, kurvanya menanjak sampai puncak yang ditandai di $x = 2$, lalu turun — jadi ia naik pada $(-\\infty, 2]$.',
              },
              hint: {
                en: 'Read the picture left to right and find the one $x$-value where the curve stops climbing and starts falling. Increasing means everything on the uphill side of that point.',
                id: 'Baca gambarnya dari kiri ke kanan dan temukan satu nilai $x$ tempat kurvanya berhenti menanjak lalu mulai turun. Naik berarti semua yang berada di sisi tanjakan dari titik itu.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $f(x) = x^2 - 6x + 5$, find where it turns and the value it takes there.',
                id: 'Untuk $f(x) = x^2 - 6x + 5$, tentukan di mana ia berbalik dan nilai yang dicapainya di situ.',
              },
              blanks: [
                { label: 'x =', answer: 3 },
                { label: 'f(x) =', answer: -4 },
              ],
              hints: [
                { en: 'The turning point of $ax^2 + bx + c$ is at $x = -b/(2a)$.', id: 'Titik balik $ax^2 + bx + c$ berada di $x = -b/(2a)$.' },
                { en: '$x = 6/2 = 3$. Now substitute.', id: '$x = 6/2 = 3$. Sekarang substitusikan.' },
              ],
              solution: ['x = \\tfrac{6}{2} = 3', 'f(3) = 9 - 18 + 5 = -4'],
              explain: {
                en: 'So $f$ decreases on $(-\\infty, 3]$ and increases on $[3, \\infty)$, and its range is $[-4, \\infty)$ — three answers from one calculation.',
                id: 'Jadi $f$ turun pada $(-\\infty, 3]$ dan naik pada $[3, \\infty)$, dan range-nya $[-4, \\infty)$ — tiga jawaban dari satu perhitungan.',
              },
            },
          ],
        },
        {
          id: 'fun-m1-s2-l4',
          title: { en: 'The Greatest Integer (Floor) Function', id: 'Fungsi Bilangan Bulat Terbesar (Lantai)' },
          goal: {
            en: 'Evaluate the floor function at any real number, including negative non-integers, and read its step graph.',
            id: 'Menghitung nilai fungsi lantai pada sembarang bilangan real, termasuk pecahan negatif, dan membaca grafik tangganya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The largest integer that still fits', id: 'Bilangan bulat terbesar yang masih muat' },
              body: {
                en: 'The **floor function**, written $\\lfloor x \\rfloor$, gives the largest integer less than or equal to $x$ — rounding down, always, never toward zero.\n\nFor a positive number this matches intuition: $\\lfloor 2.7 \\rfloor = 2$, and an integer is already its own floor: $\\lfloor 5 \\rfloor = 5$.\n\nFor a **negative** number, rounding down means moving further from zero, not closer to it: $\\lfloor -1.3 \\rfloor = -2$, since $-2$ is the largest integer that is still $\\leq -1.3$ — not $-1$, which is bigger than $-1.3$ and so does not qualify at all.',
                id: '**Fungsi lantai**, ditulis $\\lfloor x \\rfloor$, memberi bilangan bulat terbesar yang kurang dari atau sama dengan $x$ — membulatkan ke bawah, selalu, tak pernah ke arah nol.\n\nUntuk bilangan positif ini sesuai intuisi: $\\lfloor 2.7 \\rfloor = 2$, dan bilangan bulat sudah menjadi lantainya sendiri: $\\lfloor 5 \\rfloor = 5$.\n\nUntuk bilangan **negatif**, membulatkan ke bawah berarti menjauh dari nol, bukan mendekatinya: $\\lfloor -1.3 \\rfloor = -2$, sebab $-2$ adalah bilangan bulat terbesar yang masih $\\leq -1.3$ — bukan $-1$, yang lebih besar dari $-1.3$ dan sama sekali tak memenuhi syarat.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A staircase, not a ramp', id: 'Tangga, bukan tanjakan' },
              body: {
                en: 'On the interval $[k, k+1)$ — every $x$ from an integer $k$ up to, but not including, the next one — $\\lfloor x \\rfloor$ is constant and equal to $k$. Then it jumps up by exactly $1$ the instant $x$ reaches $k+1$.\n\nThe domain is every real number; the range is only the integers. The function is neither even nor odd, and it is discontinuous at every integer — the graph genuinely cannot be drawn without lifting the pencil there, unlike every continuous curve met so far.',
                id: 'Pada selang $[k, k+1)$ — setiap $x$ dari bilangan bulat $k$ sampai, tetapi tidak termasuk, bilangan bulat berikutnya — $\\lfloor x \\rfloor$ konstan dan sama dengan $k$. Lalu ia melompat naik tepat $1$ persis saat $x$ mencapai $k+1$.\n\nDomainnya semua bilangan real; range-nya hanya bilangan bulat. Fungsinya bukan genap maupun ganjil, dan ia tak kontinu di setiap bilangan bulat — grafiknya sungguh tak bisa digambar tanpa mengangkat pena di situ, tak seperti setiap kurva kontinu yang ditemui sejauh ini.',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 3.5],
                ySpan: [-3, 3],
                ticks: true,
                items: [
                  { t: 'seg', from: [-2, -2], to: [-1, -2], color: 'a' },
                  { t: 'dot', x: -2, y: -2, color: 'a' },
                  { t: 'dot', x: -1, y: -2, color: 'a', open: true },
                  { t: 'seg', from: [-1, -1], to: [0, -1], color: 'a' },
                  { t: 'dot', x: -1, y: -1, color: 'a' },
                  { t: 'dot', x: 0, y: -1, color: 'a', open: true },
                  { t: 'seg', from: [0, 0], to: [1, 0], color: 'a' },
                  { t: 'dot', x: 0, y: 0, color: 'a' },
                  { t: 'dot', x: 1, y: 0, color: 'a', open: true },
                  { t: 'seg', from: [1, 1], to: [2, 1], color: 'a' },
                  { t: 'dot', x: 1, y: 1, color: 'a' },
                  { t: 'dot', x: 2, y: 1, color: 'a', open: true },
                  { t: 'seg', from: [2, 2], to: [3, 2], color: 'a' },
                  { t: 'dot', x: 2, y: 2, color: 'a' },
                  { t: 'dot', x: 3, y: 2, color: 'a', open: true },
                ],
                caption: {
                  en: 'Constant on each interval $[k, k+1)$, jumping up by $1$ at every integer — a filled dot where the step is taken, a hollow one where it is not.',
                  id: 'Konstan pada tiap selang $[k, k+1)$, melompat naik $1$ di setiap bilangan bulat — titik penuh tempat tangganya dipijak, titik berlubang tempat ia tidak.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is $\\lfloor -2.3 \\rfloor$?',
                id: 'Berapakah $\\lfloor -2.3 \\rfloor$?',
              },
              options: [
                { en: '$-2$', id: '$-2$' },
                { en: '$-3$', id: '$-3$' },
                { en: '$2$', id: '$2$' },
                { en: '$3$', id: '$3$' },
              ],
              answer: 1,
              explain: {
                en: 'Rounding down for a negative number moves further from zero. $-3 \\leq -2.3$, but $-2 > -2.3$, so $-2$ fails to qualify at all — the floor is $-3$.',
                id: 'Membulatkan ke bawah untuk bilangan negatif berarti menjauh dari nol. $-3 \\leq -2.3$, tetapi $-2 > -2.3$, sehingga $-2$ sama sekali tak memenuhi syarat — lantainya adalah $-3$.',
              },
              hint: {
                en: 'List the two integers that sit just above and just below $-2.3$ on the number line, then ask which of those two is still less than or equal to $-2.3$.',
                id: 'Sebutkan dua bilangan bulat yang berada tepat di atas dan di bawah $-2{,}3$ pada garis bilangan, lalu tanyakan mana dari keduanya yang masih kurang dari atau sama dengan $-2{,}3$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the step graph above, what is $\\lfloor -0.5 \\rfloor$?',
                id: 'Dengan membaca grafik tangga di atas, berapakah $\\lfloor -0.5 \\rfloor$?',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 3.5],
                ySpan: [-3, 3],
                ticks: true,
                items: [
                  { t: 'seg', from: [-2, -2], to: [-1, -2], color: 'a' },
                  { t: 'dot', x: -2, y: -2, color: 'a' },
                  { t: 'dot', x: -1, y: -2, color: 'a', open: true },
                  { t: 'seg', from: [-1, -1], to: [0, -1], color: 'a' },
                  { t: 'dot', x: -1, y: -1, color: 'a' },
                  { t: 'dot', x: 0, y: -1, color: 'a', open: true },
                  { t: 'seg', from: [0, 0], to: [1, 0], color: 'a' },
                  { t: 'dot', x: 0, y: 0, color: 'a' },
                  { t: 'dot', x: 1, y: 0, color: 'a', open: true },
                ],
              },
              options: [
                { en: '$0$', id: '$0$' },
                { en: '$-1$', id: '$-1$' },
                { en: '$-2$', id: '$-2$' },
                { en: '$0.5$', id: '$0{,}5$' },
              ],
              answer: 1,
              explain: {
                en: '$-0.5$ sits in the interval $[-1, 0)$, where the graph is flat at height $-1$ — the step has not reached $0$ yet, since that jump only happens exactly at $x = 0$.',
                id: '$-0.5$ berada pada selang $[-1, 0)$, tempat grafiknya datar pada ketinggian $-1$ — tangganya belum mencapai $0$, sebab lompatan itu hanya terjadi tepat di $x = 0$.',
              },
              hint: {
                en: 'Find which flat step of the staircase covers $x = -0.5$, remembering that each step runs from an integer $k$ up to, but not including, $k+1$.',
                id: 'Temukan anak tangga mana yang datar dan mencakup $x = -0{,}5$, ingat tiap anak tangga berjalan dari bilangan bulat $k$ sampai, tetapi tidak termasuk, $k+1$.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete both evaluations.',
                id: 'Lengkapi kedua penghitungan ini.',
              },
              template: '\\lfloor 6.999 \\rfloor = ___ \\qquad \\lfloor -3 \\rfloor = ___',
              blanks: ['6', '-3'],
              explain: {
                en: '$6.999$ has not reached $7$, so its floor is still $6$. And $-3$ is already an integer, so it is its own floor — nothing to round.',
                id: '$6.999$ belum mencapai $7$, jadi lantainya masih $6$. Dan $-3$ sudah bilangan bulat, jadi ia menjadi lantainya sendiri — tak ada yang perlu dibulatkan.',
              },
              hint: {
                en: '$6.999$ is sitting just under the next whole number — which integer is it still trapped below? And a number that is already an integer needs no rounding at all.',
                id: '$6{,}999$ berada tepat di bawah bilangan bulat berikutnya — bilangan bulat mana yang masih menjadi batas atasnya? Dan bilangan yang sudah bulat sama sekali tak perlu dibulatkan.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Evaluate each of these.',
                id: 'Hitung tiap nilai berikut.',
              },
              blanks: [
                { label: '\\lfloor 4.8 \\rfloor =', answer: 4 },
                { label: '\\lfloor -0.5 \\rfloor =', answer: -1 },
                { label: '\\lfloor -3 \\rfloor =', answer: -3 },
              ],
              hints: [
                { en: 'For a negative non-integer, the floor is one **less** than truncating toward zero would give.', id: 'Untuk pecahan negatif, lantainya satu **lebih kecil** daripada memotong ke arah nol.' },
                { en: 'An integer needs no rounding at all — it is already its own floor.', id: 'Bilangan bulat sama sekali tak perlu dibulatkan — ia sudah menjadi lantainya sendiri.' },
              ],
              solution: [
                '\\lfloor 4.8 \\rfloor = 4',
                '\\lfloor -0.5 \\rfloor = -1',
                '\\lfloor -3 \\rfloor = -3',
              ],
              explain: {
                en: 'Three different behaviours in one problem: rounding down normally, rounding down across zero, and an integer that needs no rounding at all.',
                id: 'Tiga perilaku berbeda dalam satu soal: pembulatan ke bawah biasa, pembulatan ke bawah yang melintasi nol, dan bilangan bulat yang sama sekali tak perlu dibulatkan.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'fun-m1-s2-p',
        runtime: 'math',
        title: { en: 'Reading a Graph', id: 'Membaca Grafik' },
        brief: {
          en: 'A piecewise rule, a symmetry test done with numbers, and a turning point.',
          id: 'Satu aturan sepotong-sepotong, satu uji kesimetrian lewat bilangan, dan satu titik balik.',
        },
        requirements: [
          { en: 'For the piecewise part, choose the line before you calculate.', id: 'Untuk butir sepotong-sepotong, pilih barisnya sebelum menghitung.' },
          { en: 'Give the turning point as a coordinate, one box each.', id: 'Nyatakan titik baliknya sebagai koordinat, satu kotak masing-masing.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Let $g(x) = 2x + 1$ for $x \\leq 0$ and $g(x) = |x - 3|$ for $x > 0$. Evaluate $g(-2)$, $g(1)$ and $g(5)$.',
              id: 'Misalkan $g(x) = 2x + 1$ untuk $x \\leq 0$ dan $g(x) = |x - 3|$ untuk $x > 0$. Hitung $g(-2)$, $g(1)$, dan $g(5)$.',
            },
            inline: true,
            blanks: [{ answer: -3 }, { answer: 2 }, { answer: 2 }],
            solution: [
              'g(-2) = 2(-2) + 1 = -3',
              'g(1) = |1 - 3| = 2',
              'g(5) = |5 - 3| = 2',
            ],
          },
          {
            prompt: {
              en: 'For $p(x) = x^4 + x^2$, compute $p(3)$ and $p(-3)$. Equal values would say it is even.',
              id: 'Untuk $p(x) = x^4 + x^2$, hitung $p(3)$ dan $p(-3)$. Nilai yang sama menandakan ia genap.',
            },
            blanks: [
              { label: 'p(3) =', answer: 90 },
              { label: 'p(-3) =', answer: 90 },
            ],
            solution: ['p(3) = 81 + 9 = 90', 'p(-3) = 81 + 9 = 90 = p(3) \\quad \\checkmark'],
          },
          {
            prompt: {
              en: 'Find the turning point of $f(x) = 2x^2 + 8x + 3$.',
              id: 'Tentukan titik balik dari $f(x) = 2x^2 + 8x + 3$.',
            },
            inline: true,
            blanks: [{ answer: -2 }, { answer: -5 }],
            solution: ['x = \\tfrac{-8}{2(2)} = -2', 'f(-2) = 8 - 16 + 3 = -5'],
          },
          {
            prompt: {
              en: 'For $h(x) = \\lfloor x \\rfloor$, evaluate $h(-1.2)$ and $h(2.9)$.',
              id: 'Untuk $h(x) = \\lfloor x \\rfloor$, hitung $h(-1.2)$ dan $h(2.9)$.',
            },
            inline: true,
            blanks: [{ answer: -2 }, { answer: 2 }],
            solution: ['h(-1.2) = -2 \\quad (\\text{largest integer} \\leq -1.2)', 'h(2.9) = 2'],
          },
        ],
        hints: [
          {
            en: 'Two equal values do not **prove** a function is even — but they are what you would check first, and $x^4 + x^2$ has only even powers.',
            id: 'Dua nilai yang sama belum **membuktikan** sebuah fungsi genap — tetapi itulah yang pertama kali kamu periksa, dan $x^4 + x^2$ hanya berpangkat genap.',
          },
          {
            en: 'In part 3 the leading coefficient is 2, so remember the $2a$ in $-b/(2a)$.',
            id: 'Pada butir 3 koefisien utamanya 2, jadi jangan lupa $2a$ pada $-b/(2a)$.',
          },
          {
            en: 'Part 4: for a negative non-integer, the floor rounds further from zero, not toward it.',
            id: 'Butir 4: untuk pecahan negatif, lantainya membulat menjauh dari nol, bukan mendekatinya.',
          },
        ],
        xp: 50,
      },
    },

    /* ---------------------------------------------- 1.3 building functions */
    {
      id: 'fun-m1-s3',
      title: { en: 'Building Functions from Descriptions', id: 'Membangun Fungsi dari Deskripsi' },
      summary: {
        en: 'Turn a geometric setup into a function of one variable, state the domain the setup itself demands, and reuse the vertex trick to optimize it exactly.',
        id: 'Mengubah situasi geometris menjadi fungsi satu peubah, menyatakan domain yang dituntut situasinya sendiri, dan memakai ulang trik titik balik untuk mengoptimalkannya secara eksak.',
      },
      lessons: [
        {
          id: 'fun-m1-s3-l1',
          title: { en: 'Turning a Sentence into a Function', id: 'Mengubah Kalimat Menjadi Fungsi' },
          goal: {
            en: 'Name the unknowns, find the relationship linking them, and substitute to leave a function of one variable alone.',
            id: 'Menamai besaran yang tak diketahui, mencari relasi yang menghubungkannya, dan mensubstitusikannya hingga tersisa fungsi satu peubah saja.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'One equation buys back one variable', id: 'Satu persamaan membeli kembali satu peubah' },
              body: {
                en: 'A problem described in words usually starts with **two** related unknowns, not one. The move that turns it into a function: name both, write down the equation that relates them, then use that equation to eliminate one.\n\nLet $P=(x,y)$ be a point on the curve $y=x^2-1$, and ask for its distance $d$ from the origin. Two unknowns, $x$ and $y$ — but one equation already connects them. The distance formula gives $d=\\sqrt{x^2+y^2}$, still in both variables, so substitute $y=x^2-1$ into it:\n$$d(x) = \\sqrt{x^2+(x^2-1)^2}$$\nOne substitution, and $d$ is now a function of $x$ alone. At $x=0$: $d(0)=\\sqrt{0+1}=1$. At $x=1$: $d(1)=\\sqrt{1+0}=1$ — two different points on the curve, the same distance from the origin.',
                id: 'Soal yang dideskripsikan lewat kalimat biasanya bermula dengan **dua** besaran tak diketahui yang saling berkaitan, bukan satu. Langkah yang mengubahnya menjadi fungsi: namai keduanya, tulis persamaan yang menghubungkannya, lalu pakai persamaan itu untuk mengeliminasi satu.\n\nMisalkan $P=(x,y)$ adalah titik pada kurva $y=x^2-1$, dan tanyakan jaraknya $d$ dari titik asal. Dua besaran tak diketahui, $x$ dan $y$ — tetapi satu persamaan sudah menghubungkannya. Rumus jarak memberi $d=\\sqrt{x^2+y^2}$, masih dalam kedua peubah, jadi substitusikan $y=x^2-1$ ke dalamnya:\n$$d(x) = \\sqrt{x^2+(x^2-1)^2}$$\nSatu substitusi, dan $d$ kini fungsi dari $x$ saja. Di $x=0$: $d(0)=\\sqrt{0+1}=1$. Di $x=1$: $d(1)=\\sqrt{1+0}=1$ — dua titik berbeda pada kurvanya, jarak yang sama dari titik asal.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Squaring away the root', id: 'Menghilangkan akar dengan mengkuadratkan' },
              body: {
                en: 'A square root is awkward to work with, and there is a shortcut: since $d \\geq 0$ always, $d$ is smallest exactly when $D=d^2$ is smallest — squaring never changes which input wins, only which expression is easier to handle.\n\nHere $D(x) = x^4-x^2+1$. Substituting $u=x^2$ turns this into the ordinary quadratic $D=u^2-u+1$, and Module 1\'s vertex formula finds its minimum immediately: $u=\\tfrac{1}{2}$, giving $D=\\tfrac{1}{4}-\\tfrac{1}{2}+1=\\tfrac{3}{4}$. Since $u=x^2=\\tfrac{1}{2}$, $x=\\pm\\tfrac{1}{\\sqrt2}$, and the minimum distance is $d=\\sqrt{\\tfrac{3}{4}}=\\tfrac{\\sqrt3}{2}\\approx 0.87$ — an exact answer, no calculus needed, because the substitution turned a quartic into a parabola in disguise.',
                id: 'Akar kuadrat merepotkan untuk dikerjakan, dan ada jalan pintasnya: karena $d \\geq 0$ selalu, $d$ terkecil tepat ketika $D=d^2$ terkecil — mengkuadratkan tak pernah mengubah masukan mana yang menang, hanya ekspresi mana yang lebih mudah ditangani.\n\nDi sini $D(x) = x^4-x^2+1$. Mensubstitusikan $u=x^2$ mengubahnya menjadi kuadrat biasa $D=u^2-u+1$, dan rumus titik balik Modul 1 langsung menemukan minimumnya: $u=\\tfrac{1}{2}$, memberi $D=\\tfrac{1}{4}-\\tfrac{1}{2}+1=\\tfrac{3}{4}$. Karena $u=x^2=\\tfrac{1}{2}$, $x=\\pm\\tfrac{1}{\\sqrt2}$, dan jarak minimumnya adalah $d=\\sqrt{\\tfrac{3}{4}}=\\tfrac{\\sqrt3}{2}\\approx 0{,}87$ — jawaban eksak, tanpa kalkulus, sebab substitusinya mengubah kuartik menjadi parabola yang menyamar.',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 2],
                ySpan: [-0.5, 3],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^4-x^2+1', color: 'a', label: 'D(x)' },
                  { t: 'dot', x: 0.7071, y: 0.75, color: 'result', label: 'min' },
                  { t: 'dot', x: -0.7071, y: 0.75, color: 'result' },
                ],
                caption: {
                  en: 'The minimum of $D(x)=x^4-x^2+1$ sits at $x=\\pm\\tfrac{1}{\\sqrt2}\\approx\\pm0.71$, found exactly through the substitution $u=x^2$.',
                  id: 'Minimum $D(x)=x^4-x^2+1$ berada di $x=\\pm\\tfrac{1}{\\sqrt2}\\approx\\pm0{,}71$, ditemukan secara eksak lewat substitusi $u=x^2$.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why is it enough to minimize $D=d^2$ instead of $d$ itself?',
                id: 'Mengapa cukup meminimumkan $D=d^2$ alih-alih $d$ itu sendiri?',
              },
              options: [
                { en: 'Because $d \\geq 0$ always, squaring preserves the order of which value is smallest', id: 'Karena $d \\geq 0$ selalu, mengkuadratkan menjaga urutan nilai mana yang terkecil' },
                { en: 'Because $D$ is always smaller than $d$', id: 'Karena $D$ selalu lebih kecil dari $d$' },
                { en: 'It is only a coincidence that works this one time', id: 'Ini hanya kebetulan yang berhasil sekali ini saja' },
                { en: 'Because $D$ is easier to graph, with no other reason', id: 'Karena $D$ lebih mudah digambar, tanpa alasan lain' },
              ],
              answer: 0,
              explain: {
                en: 'Squaring is an increasing operation on non-negative numbers: if $0 \\leq d_1 < d_2$ then $d_1^2 < d_2^2$. Since distance is never negative, whichever $x$ makes $D$ smallest also makes $d$ smallest.',
                id: 'Mengkuadratkan adalah operasi yang naik pada bilangan tak negatif: jika $0 \\leq d_1 < d_2$ maka $d_1^2 < d_2^2$. Karena jarak tak pernah negatif, $x$ mana pun yang membuat $D$ terkecil juga membuat $d$ terkecil.',
              },
              hint: {
                en: 'Squaring preserves order among non-negative numbers — if one distance is smaller than another, its square stays smaller too. What does that fact let you get away with?',
                id: 'Mengkuadratkan menjaga urutan di antara bilangan tak negatif — jika satu jarak lebih kecil dari yang lain, kuadratnya juga tetap lebih kecil. Apa yang bisa kamu manfaatkan dari fakta itu?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph above of $D(x)=x^4-x^2+1$, near what $x$-value does it reach its minimum?',
                id: 'Dengan membaca grafik di atas dari $D(x)=x^4-x^2+1$, di sekitar nilai $x$ berapa ia mencapai minimumnya?',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 2],
                ySpan: [-0.5, 3],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^4-x^2+1', color: 'a' },
                  { t: 'dot', x: 0.7071, y: 0.75, color: 'result' },
                  { t: 'dot', x: -0.7071, y: 0.75, color: 'result' },
                ],
              },
              options: [
                { en: '$x \\approx \\pm 0.71$', id: '$x \\approx \\pm 0{,}71$' },
                { en: '$x = 0$', id: '$x = 0$' },
                { en: '$x = 1$', id: '$x = 1$' },
                { en: '$x = 2$', id: '$x = 2$' },
              ],
              answer: 0,
              explain: {
                en: 'The two marked dots, at $x=\\pm\\tfrac{1}{\\sqrt2}\\approx\\pm0.71$, are exactly where the algebra placed the minimum — the picture and the substitution agree.',
                id: 'Kedua titik yang ditandai, di $x=\\pm\\tfrac{1}{\\sqrt2}\\approx\\pm0{,}71$, persis tempat aljabar menaruh minimumnya — gambar dan substitusinya sepakat.',
              },
              hint: {
                en: 'Read the horizontal position of the two marked dots directly off the picture, rather than recomputing anything.',
                id: 'Baca posisi mendatar kedua titik yang ditandai langsung dari gambarnya, tanpa perlu menghitung ulang apa pun.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'A point $P=(x,y)$ lies on the curve $y = x^2 + 4$. Using $u=x^2$ on $D(x)=x^2+(x^2+4)^2$, find the minimum distance $d$ from $P$ to the origin.',
                id: 'Titik $P=(x,y)$ berada pada kurva $y = x^2 + 4$. Memakai $u=x^2$ pada $D(x)=x^2+(x^2+4)^2$, cari jarak minimum $d$ dari $P$ ke titik asal.',
              },
              blanks: [{ label: 'd =', answer: 4 }],
              hints: [
                { en: 'Expanding gives $D = u^2+9u+16$ where $u=x^2$.', id: 'Menjabarkan memberi $D = u^2+9u+16$ dengan $u=x^2$.' },
                { en: 'The vertex of $u^2+9u+16$ sits at $u=-4.5$ — but $u=x^2$ can never be negative, so the smallest $u$ actually allowed is $0$.', id: 'Titik balik $u^2+9u+16$ berada di $u=-4{,}5$ — tetapi $u=x^2$ tak pernah bisa negatif, jadi $u$ terkecil yang benar-benar diizinkan adalah $0$.' },
              ],
              solution: [
                'D(u) = u^2+9u+16, \\quad u = x^2 \\geq 0',
                '\\text{vertex at } u=-4.5 \\text{ is outside the allowed domain}',
                '\\text{on } u\\geq 0, D \\text{ is increasing, so the minimum is at } u=0',
                'D(0) = 16 \\Rightarrow d = \\sqrt{16} = 4',
              ],
              explain: {
                en: 'The vertex formula wants $u=-4.5$, which is impossible since $u=x^2$. Because $D=u^2+9u+16$ is increasing for every $u \\geq 0$, the smallest value on the allowed domain sits right at its edge, $u=0$ — giving $D=16$ and $d=4$, exactly the curve\'s own lowest point, $(0,4)$.',
                id: 'Rumus titik balik menginginkan $u=-4{,}5$, yang mustahil sebab $u=x^2$. Karena $D=u^2+9u+16$ naik untuk setiap $u \\geq 0$, nilai terkecil pada domain yang diizinkan berada tepat di tepinya, $u=0$ — memberi $D=16$ dan $d=4$, persis titik terendah kurvanya sendiri, $(0,4)$.',
              },
            },
          ],
        },
        {
          id: 'fun-m1-s3-l2',
          title: { en: 'Domain from the Setup, and an Exact Maximum', id: 'Domain dari Situasinya, dan Maksimum Eksak' },
          goal: {
            en: 'State the domain a geometric setup itself demands, then reuse the vertex trick to maximize an area exactly.',
            id: 'Menyatakan domain yang dituntut situasi geometrisnya sendiri, lalu memakai ulang trik titik balik untuk memaksimalkan luas secara eksak.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The formula allows more than the picture does', id: 'Rumusnya mengizinkan lebih banyak daripada gambarnya' },
              body: {
                en: 'A rectangle sits symmetrically under the semicircle $y=\\sqrt{25-x^2}$: base $2x$ centred on the origin, height $y$, top corners on the curve. Its area is\n$$A(x) = 2x\\sqrt{25-x^2}$$\nThe formula itself only needs $25-x^2 \\geq 0$, i.e. $-5 \\leq x \\leq 5$ — but the **picture** demands more: a rectangle needs a positive width and a positive height, so $x>0$ strictly. The domain the situation allows is $0 < x < 5$, narrower than the formula\'s own natural domain from Module 1\'s Lesson 2. The setup can always demand more than the algebra alone would.',
                id: 'Sebuah persegi panjang duduk simetris di bawah setengah lingkaran $y=\\sqrt{25-x^2}$: alasnya $2x$ berpusat di titik asal, tinggi $y$, kedua sudut atasnya pada kurvanya. Luasnya adalah\n$$A(x) = 2x\\sqrt{25-x^2}$$\nRumusnya sendiri hanya memerlukan $25-x^2 \\geq 0$, yaitu $-5 \\leq x \\leq 5$ — tetapi **gambarnya** menuntut lebih: persegi panjang memerlukan lebar dan tinggi yang positif, sehingga $x>0$ secara ketat. Domain yang diizinkan situasinya adalah $0 < x < 5$, lebih sempit dari domain alami rumusnya sendiri dari Pelajaran 2 Modul 1. Situasinya selalu bisa menuntut lebih daripada aljabar semata.',
              },
              figure: {
                dim: 2,
                xSpan: [-6, 6],
                ySpan: [-1, 6],
                ticks: true,
                items: [
                  { t: 'curve', f: 'sqrt(25-x^2)', from: -5, to: 5, color: 'a' },
                  { t: 'poly', pts: [[-3, 0], [3, 0], [3, 4], [-3, 4]], color: 'result' },
                ],
                caption: {
                  en: 'One rectangle in the family, at $x=3$: width $6$, height $y=\\sqrt{25-9}=4$ — a $3$-$4$-$5$ right triangle hiding in the corner.',
                  id: 'Satu persegi panjang dalam keluarganya, di $x=3$: lebar $6$, tinggi $y=\\sqrt{25-9}=4$ — segitiga siku-siku $3$-$4$-$5$ bersembunyi di sudutnya.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Maximizing without calculus, again', id: 'Memaksimalkan tanpa kalkulus, sekali lagi' },
              body: {
                en: 'The same squaring trick as last lesson removes the root: $A^2 = 4x^2(25-x^2) = -4x^4+100x^2$. Substituting $u=x^2$ gives $A^2=-4u^2+100u$ — a downward parabola in $u$, maximized at $u=\\dfrac{100}{2(4)}=12.5$.\n\nSo $x=\\sqrt{12.5}\\approx 3.54$, and $A^2 = -4(12.5)^2+100(12.5) = 625$, giving the exact maximum area $A=\\sqrt{625}=25$ — a clean whole number out of a problem that started with a square root, reached the same way as the distance problem: square it, substitute $u=x^2$, use the vertex formula.',
                id: 'Trik mengkuadratkan yang sama seperti pelajaran sebelumnya menghilangkan akarnya: $A^2 = 4x^2(25-x^2) = -4x^4+100x^2$. Mensubstitusikan $u=x^2$ memberi $A^2=-4u^2+100u$ — parabola yang membuka ke bawah dalam $u$, maksimum di $u=\\dfrac{100}{2(4)}=12{,}5$.\n\nJadi $x=\\sqrt{12{,}5}\\approx 3{,}54$, dan $A^2 = -4(12{,}5)^2+100(12{,}5) = 625$, memberi luas maksimum eksak $A=\\sqrt{625}=25$ — bilangan bulat yang bersih dari soal yang bermula dengan akar kuadrat, dicapai dengan cara yang sama seperti soal jarak: kuadratkan, substitusikan $u=x^2$, pakai rumus titik balik.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why is the allowed domain $0 < x < 5$ rather than the formula\'s own $-5 \\leq x \\leq 5$?',
                id: 'Mengapa domain yang diizinkan adalah $0 < x < 5$, bukan $-5 \\leq x \\leq 5$ milik rumusnya sendiri?',
              },
              options: [
                { en: 'A rectangle needs a strictly positive width and height, and the endpoints $x=0$ or $x=5$ collapse it to zero area', id: 'Persegi panjang memerlukan lebar dan tinggi yang tegas positif, dan titik ujung $x=0$ atau $x=5$ membuat luasnya runtuh menjadi nol' },
                { en: 'The formula is only defined for $x>0$ to begin with', id: 'Rumusnya sendiri hanya terdefinisi untuk $x>0$ sejak awal' },
                { en: 'It is an arbitrary restriction with no geometric reason', id: 'Ini pembatasan sebarang tanpa alasan geometris' },
                { en: 'Negative $x$ would make the square root undefined', id: 'x negatif akan membuat akar kuadratnya tak terdefinisi' },
              ],
              answer: 0,
              explain: {
                en: 'The formula $2x\\sqrt{25-x^2}$ is perfectly defined on all of $[-5,5]$. It is the **rectangle** — not the formula — that needs a genuine width and height, which rules out $x \\leq 0$ and the endpoint $x=5$ where the height vanishes.',
                id: 'Rumus $2x\\sqrt{25-x^2}$ terdefinisi sempurna pada seluruh $[-5,5]$. **Persegi panjangnyalah** — bukan rumusnya — yang memerlukan lebar dan tinggi yang sungguhan, yang menyingkirkan $x \\leq 0$ dan titik ujung $x=5$ tempat tingginya lenyap.',
              },
              hint: {
                en: 'Check what happens to the rectangle\'s width or its height at each endpoint of the formula\'s own domain, $x=-5$, $x=0$ and $x=5$ — does a genuine rectangle survive there?',
                id: 'Periksa apa yang terjadi pada lebar atau tinggi persegi panjangnya di tiap ujung domain alami rumusnya, $x=-5$, $x=0$, dan $x=5$ — apakah persegi panjang yang sungguhan masih bertahan di situ?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the figure above, what happens to the rectangle\'s area as $x \\to 5$?',
                id: 'Dengan membaca gambar di atas, apa yang terjadi pada luas persegi panjangnya saat $x \\to 5$?',
              },
              figure: {
                dim: 2,
                xSpan: [-6, 6],
                ySpan: [-1, 6],
                ticks: true,
                items: [
                  { t: 'curve', f: 'sqrt(25-x^2)', from: -5, to: 5, color: 'a' },
                  { t: 'poly', pts: [[-3, 0], [3, 0], [3, 4], [-3, 4]], color: 'result' },
                ],
              },
              options: [
                { en: 'It shrinks to zero, since the curve meets the x-axis there and the height vanishes', id: 'Menyusut menuju nol, sebab kurvanya bertemu sumbu-x di situ dan tingginya lenyap' },
                { en: 'It keeps growing without bound', id: 'Terus bertambah tanpa batas' },
                { en: 'It stays exactly at the maximum found in the lesson', id: 'Tetap tepat di maksimum yang ditemukan pada pelajaran' },
                { en: 'The rectangle turns into a triangle', id: 'Persegi panjangnya berubah menjadi segitiga' },
              ],
              answer: 0,
              explain: {
                en: 'At $x=5$ the semicircle has come back down to the axis, so $y=\\sqrt{25-25}=0$ — a rectangle with zero height, hence zero area. The maximum happens somewhere in between, not at either extreme.',
                id: 'Di $x=5$ setengah lingkarannya sudah kembali turun ke sumbunya, sehingga $y=\\sqrt{25-25}=0$ — persegi panjang dengan tinggi nol, jadi luasnya nol. Maksimumnya terjadi di suatu tempat di antaranya, bukan di salah satu ekstrem.',
              },
              hint: {
                en: 'Evaluate the height $y=\\sqrt{25-x^2}$ as $x$ gets close to $5$ — what does that do to the rectangle\'s shape, and so to its area?',
                id: 'Hitung tinggi $y=\\sqrt{25-x^2}$ saat $x$ mendekati $5$ — apa yang terjadi pada bentuk persegi panjangnya, dan karenanya pada luasnya?',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'A rectangle sits the same way under the semicircle $y=\\sqrt{16-x^2}$, with area $A(x)=2x\\sqrt{16-x^2}$. Using the same substitution, find the exact maximum area.',
                id: 'Persegi panjang duduk dengan cara yang sama di bawah setengah lingkaran $y=\\sqrt{16-x^2}$, dengan luas $A(x)=2x\\sqrt{16-x^2}$. Memakai substitusi yang sama, cari luas maksimum eksak.',
              },
              blanks: [{ label: 'A_{max} =', answer: 16 }],
              hints: [
                { en: '$A^2 = -4u^2+64u$ where $u=x^2$; its vertex is at $u=\\dfrac{64}{8}=8$.', id: '$A^2 = -4u^2+64u$ dengan $u=x^2$; titik baliknya di $u=\\dfrac{64}{8}=8$.' },
              ],
              explain: {
                en: '$A^2 = -4(8)^2+64(8) = 256$, so $A_{max}=\\sqrt{256}=16$ — and in general, a rectangle inscribed this way under a semicircle of radius $r$ has maximum area exactly $r^2$.',
                id: '$A^2 = -4(8)^2+64(8) = 256$, sehingga $A_{maks}=\\sqrt{256}=16$ — dan secara umum, persegi panjang yang terpasang seperti ini di bawah setengah lingkaran berjari-jari $r$ punya luas maksimum tepat $r^2$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'fun-m1-s3-p',
        runtime: 'math',
        title: { en: 'Modeling with One Variable', id: 'Memodelkan dengan Satu Peubah' },
        brief: {
          en: 'Building a function, stating the domain it demands, and finding an exact maximum.',
          id: 'Membangun sebuah fungsi, menyatakan domain yang dituntutnya, dan mencari maksimum eksak.',
        },
        requirements: [
          { en: 'Name both unknowns, find the equation linking them, then substitute to leave one variable.', id: 'Namai kedua besaran tak diketahuinya, cari persamaan yang menghubungkannya, lalu substitusikan hingga tersisa satu peubah.' },
          { en: 'The picture can demand a narrower domain than the formula alone would allow.', id: 'Gambarnya bisa menuntut domain yang lebih sempit daripada yang diizinkan rumusnya semata.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'A point $P=(x,y)$ lies on $y=x^2-4$. Express $d(x)$, the distance from $P$ to the origin, then evaluate $d(2)$.',
              id: 'Titik $P=(x,y)$ berada pada $y=x^2-4$. Nyatakan $d(x)$, jarak dari $P$ ke titik asal, lalu hitung $d(2)$.',
            },
            blanks: [{ answer: 2 }],
            solution: ['d(x) = \\sqrt{x^2+(x^2-4)^2}', 'd(2) = \\sqrt{4+0} = 2'],
          },
          {
            prompt: {
              en: 'A rectangle sits symmetrically under the semicircle $y=\\sqrt{9-x^2}$, with area $A(x)=2x\\sqrt{9-x^2}$. What are the smallest and largest $x$ the picture allows?',
              id: 'Persegi panjang duduk simetris di bawah setengah lingkaran $y=\\sqrt{9-x^2}$, dengan luas $A(x)=2x\\sqrt{9-x^2}$. Berapa $x$ terkecil dan terbesar yang diizinkan gambarnya?',
            },
            inline: true,
            blanks: [{ answer: 0 }, { answer: 3 }],
            solution: ['\\text{A rectangle needs } x>0 \\text{ and } y>0, \\text{ so } 0 < x < 3'],
          },
          {
            prompt: {
              en: 'For that same rectangle under $y=\\sqrt{9-x^2}$, find the exact maximum area.',
              id: 'Untuk persegi panjang yang sama di bawah $y=\\sqrt{9-x^2}$, cari luas maksimum eksaknya.',
            },
            blanks: [{ answer: 9 }],
            solution: [
              'A^2 = -4u^2+36u, \\quad u=x^2, \\quad \\text{vertex at } u=\\dfrac{36}{8}=4.5',
              'A^2 = -4(4.5)^2+36(4.5) = 81 \\Rightarrow A_{max} = 9',
            ],
          },
        ],
        hints: [
          { en: 'Part 3 follows the same pattern as the lesson\'s own example — only the radius under the root has changed.', id: 'Butir 3 mengikuti pola yang sama seperti contoh pada pelajarannya sendiri — hanya jari-jari di bawah akarnya yang berubah.' },
        ],
        xp: 50,
      },
    },
  ],
}
