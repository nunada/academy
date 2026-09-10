import type { Module } from '../types'

/** Module 5 — the payoff. Every rule proved in Modules 1-4 turns into a tool
 *  for a question that has nothing to do with formulas: how fast is this
 *  changing, what does the function look like nearby, where does it turn. */
export const module5: Module = {
  id: 'tur-m5',
  title: { en: 'Applications of the Derivative', id: 'Penerapan Turunan' },
  summary: {
    en: 'Related rates, linear approximation, and reading a function\'s shape — increasing, decreasing, and concavity — from its derivatives.',
    id: 'Laju terkait, hampiran linear, dan membaca bentuk fungsi — naik, turun, dan kecekungan — dari turunannya.',
  },
  submodules: [
    /* ------------------------------------------- 5.1 related rates + linear approx */
    {
      id: 'tur-m5-s1',
      title: { en: 'Related Rates and Linear Approximation', id: 'Laju Terkait dan Hampiran Linear' },
      summary: {
        en: 'Use the chain rule to relate how two quantities change together, then use a tangent line to approximate a function nearby.',
        id: 'Memakai aturan rantai untuk mengaitkan laju perubahan dua besaran, lalu memakai garis singgung untuk menghampiri fungsi di sekitarnya.',
      },
      lessons: [
        {
          id: 'tur-m5-s1-l1',
          title: { en: 'Related Rates', id: 'Laju Terkait' },
          goal: {
            en: 'Differentiate an equation relating two quantities with respect to time to find how fast one changes given the other.',
            id: 'Menurunkan persamaan yang mengaitkan dua besaran terhadap waktu untuk mencari seberapa cepat satu berubah bila yang lain diketahui.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Implicit differentiation, with time as the hidden variable', id: 'Turunan implisit, dengan waktu sebagai peubah tersembunyi' },
              body: {
                en: 'Module 3 differentiated an equation in $x$ and $y$ with respect to $x$, treating $y$ as secretly a function of $x$. Related rates does the same trick with $t$ (time) as the hidden variable instead: every quantity in the equation is secretly a function of $t$, so every term picks up a $\\frac{d(\\cdot)}{dt}$ factor when differentiated.\nA square\'s side $s$ grows at $\\frac{ds}{dt}=3$ cm/s. How fast does its area $A=s^2$ grow when $s=4$?\n$$\\frac{dA}{dt} = 2s\\cdot\\frac{ds}{dt}$$\nAt $s=4$: $\\dfrac{dA}{dt} = 2(4)(3) = 24$ cm²/s.',
                id: 'Modul 3 menurunkan persamaan dalam $x$ dan $y$ terhadap $x$, memperlakukan $y$ sebagai diam-diam fungsi dari $x$. Laju terkait memakai trik yang sama dengan $t$ (waktu) sebagai peubah tersembunyinya: setiap besaran dalam persamaan itu diam-diam fungsi dari $t$, sehingga setiap suku memperoleh faktor $\\frac{d(\\cdot)}{dt}$ ketika diturunkan.\nSisi sebuah persegi $s$ bertambah dengan laju $\\frac{ds}{dt}=3$ cm/s. Seberapa cepat luasnya $A=s^2$ bertambah ketika $s=4$?\n$$\\frac{dA}{dt} = 2s\\cdot\\frac{ds}{dt}$$\nDi $s=4$: $\\dfrac{dA}{dt} = 2(4)(3) = 24$ cm²/detik.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A four-step routine', id: 'Rutinitas empat langkah' },
              body: {
                en: 'Every related-rates problem follows the same four steps:\n1. Write an equation relating the quantities — often geometry (area, volume, the Pythagorean theorem).\n2. Differentiate both sides with respect to $t$, using the chain rule on every quantity.\n3. Substitute the *specific instant*\'s known values only **after** differentiating — differentiating a specific number first would just give $0$.\n4. Solve for the unknown rate.\nA ladder $10$ m long leans against a wall; its base slides away at $\\frac{dx}{dt}=2$ m/s. How fast does the top slide down when the base is $6$ m from the wall? With $x^2+y^2=100$:\n$$2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0$$\nAt $x=6$: $y=\\sqrt{100-36}=8$. Substituting, $2(6)(2) + 2(8)\\frac{dy}{dt} = 0 \\Rightarrow \\frac{dy}{dt} = -\\frac{24}{16} = -1.5$ m/s (negative: the top is sliding *down*).',
                id: 'Setiap soal laju terkait mengikuti empat langkah yang sama:\n1. Tulis persamaan yang mengaitkan besaran-besarannya — sering geometri (luas, volume, teorema Pythagoras).\n2. Turunkan kedua ruas terhadap $t$, memakai aturan rantai pada setiap besaran.\n3. Substitusikan nilai yang diketahui pada *saat tertentu* itu hanya **setelah** menurunkan — menurunkan sebuah angka tertentu lebih dahulu hanya akan memberi $0$.\n4. Selesaikan laju yang dicari.\nSebuah tangga sepanjang $10$ m bersandar pada dinding; ujung bawahnya bergeser menjauh dengan $\\frac{dx}{dt}=2$ m/detik. Seberapa cepat ujung atasnya turun ketika ujung bawah berjarak $6$ m dari dinding? Dengan $x^2+y^2=100$:\n$$2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0$$\nDi $x=6$: $y=\\sqrt{100-36}=8$. Substitusi memberi $2(6)(2) + 2(8)\\frac{dy}{dt} = 0 \\Rightarrow \\frac{dy}{dt} = -\\frac{24}{16} = -1.5$ m/detik (negatif: ujung atasnya sedang turun).',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'In a related-rates problem, why must the specific known values be substituted only after differentiating?',
                id: 'Dalam soal laju terkait, mengapa nilai yang diketahui pada saat tertentu harus disubstitusikan hanya setelah menurunkan?',
              },
              options: [
                { en: 'A specific number is a constant, and the derivative of a constant is 0 — substituting first would erase the variable relationship being differentiated', id: 'Angka tertentu adalah konstanta, dan turunan konstanta adalah 0 — substitusi lebih dahulu akan menghapus hubungan peubah yang sedang diturunkan' },
                { en: 'It changes the units of the answer', id: 'Mengubah satuan jawabannya' },
                { en: 'It makes the equation impossible to solve', id: 'Membuat persamaannya mustahil diselesaikan' },
                { en: 'There is no real reason — either order works identically', id: 'Tak ada alasan sungguhan — urutan mana pun bekerja identik' },
              ],
              answer: 0,
              explain: {
                en: 'The whole point is differentiating the *general relationship* between the changing quantities. Plugging in numbers first freezes them, and the derivative of any constant is $0$ — the rate information would be destroyed before it could be used.',
                id: 'Inti soalnya adalah menurunkan *hubungan umum* antara besaran yang berubah. Memasukkan angka lebih dahulu akan membekukannya, dan turunan konstanta mana pun adalah $0$ — informasi lajunya akan hancur sebelum sempat dipakai.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Fill in the missing pieces of the ladder problem\'s solution.',
                id: 'Lengkapi bagian yang hilang dari penyelesaian soal tangga.',
              },
              math: true,
              template: 'x^2 + y^2 = ___, \\quad 2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = ___, \\quad y = \\sqrt{100-36} = ___, \\quad \\frac{dy}{dt} = -\\frac{24}{16} = ___ \\text{ m/s}',
              blanks: ['100', '0', '8', '-1.5'],
              explain: {
                en: 'The right side of $x^2+y^2=100$ is a fixed constant, so its derivative is $0$ — that is exactly why the differentiated equation has nothing on the right.',
                id: 'Ruas kanan $x^2+y^2=100$ adalah konstanta tetap, sehingga turunannya $0$ — itulah persisnya sebabnya persamaan yang diturunkan tak punya apa-apa di ruas kanan.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'A circular oil spill\'s radius grows at $\\frac{dr}{dt}=0.5$ m/min. Find $\\frac{dA}{dt}$ (area $A=\\pi r^2$) when $r=10$ m.',
                id: 'Jari-jari tumpahan minyak berbentuk lingkaran bertambah dengan $\\frac{dr}{dt}=0.5$ m/menit. Cari $\\frac{dA}{dt}$ (luas $A=\\pi r^2$) ketika $r=10$ m.',
              },
              blanks: [{ label: '\\tfrac{dA}{dt} =', answer: 10 * Math.PI }],
              hints: [
                { en: '$\\frac{dA}{dt} = 2\\pi r\\cdot\\frac{dr}{dt}$.', id: '$\\frac{dA}{dt} = 2\\pi r\\cdot\\frac{dr}{dt}$.' },
              ],
              explain: {
                en: '$\\frac{dA}{dt} = 2\\pi(10)(0.5) = 10\\pi \\approx 31{,}42$ m²/min.',
                id: '$\\frac{dA}{dt} = 2\\pi(10)(0.5) = 10\\pi \\approx 31{,}42$ m²/menit.',
              },
            },
          ],
        },
        {
          id: 'tur-m5-s1-l2',
          title: { en: 'Linear Approximation', id: 'Hampiran Linear' },
          goal: {
            en: 'Use the tangent line at a known point to estimate a function\'s value nearby, without recomputing the function exactly.',
            id: 'Memakai garis singgung pada titik yang diketahui untuk menaksir nilai fungsi di dekatnya, tanpa menghitung ulang fungsinya secara eksak.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Zoom in far enough, and any curve looks straight', id: 'Perbesar cukup jauh, kurva apa pun tampak lurus' },
              body: {
                en: 'Near the point of tangency, a smooth curve is nearly indistinguishable from its own tangent line — that visual fact from every figure in this course is the entire idea behind linear approximation. The tangent line to $f$ at $x=a$ is\n$$L(x) = f(a) + f\'(a)(x-a)$$\nand for $x$ close to $a$, $f(x) \\approx L(x)$. This turns a hard computation ($\\sqrt{4.1}$, say) into an easy one built only from a known nearby value and a derivative.',
                id: 'Di dekat titik singgungnya, kurva yang mulus nyaris tak terbedakan dari garis singgungnya sendiri — fakta visual dari setiap gambar dalam kursus ini itulah seluruh gagasan di balik hampiran linear. Garis singgung $f$ di $x=a$ adalah\n$$L(x) = f(a) + f\'(a)(x-a)$$\ndan untuk $x$ dekat $a$, $f(x) \\approx L(x)$. Ini mengubah penghitungan yang sulit ($\\sqrt{4.1}$, misalnya) menjadi penghitungan yang mudah, dibangun hanya dari nilai dekat yang diketahui dan sebuah turunan.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Estimating a square root without a calculator', id: 'Menaksir akar kuadrat tanpa kalkulator' },
              body: {
                en: 'Estimate $\\sqrt{4.1}$ using $f(x)=\\sqrt x$ at $a=4$ (a perfect square, chosen precisely because $f(4)=2$ is exact and easy). $f\'(x) = \\dfrac{1}{2\\sqrt x}$, so $f\'(4) = \\dfrac14$.\n$$L(4.1) = f(4) + f\'(4)(4.1-4) = 2 + \\tfrac14(0.1) = 2.025$$\nThe true value is $\\sqrt{4.1} \\approx 2.0248...$ — the approximation is accurate to three decimal places, from nothing but a value and a slope.',
                id: 'Taksir $\\sqrt{4.1}$ memakai $f(x)=\\sqrt x$ di $a=4$ (kuadrat sempurna, dipilih persis karena $f(4)=2$ eksak dan mudah). $f\'(x) = \\dfrac{1}{2\\sqrt x}$, sehingga $f\'(4) = \\dfrac14$.\n$$L(4.1) = f(4) + f\'(4)(4.1-4) = 2 + \\tfrac14(0.1) = 2.025$$\nNilai sebenarnya adalah $\\sqrt{4.1} \\approx 2.0248...$ — hampirannya akurat hingga tiga desimal, hanya dari sebuah nilai dan sebuah kemiringan.',
              },
              figure: {
                dim: 2,
                xSpan: [2, 6],
                ySpan: [0, 3],
                ticks: true,
                items: [
                  { t: 'curve', f: 'sqrt(x)', from: 0.01, color: 'a' },
                  { t: 'seg', from: [2, 1.5], to: [6, 2.5], color: 'b' },
                  { t: 'dot', x: 4, y: 2, color: 'c', label: '(4, 2)' },
                ],
                caption: {
                  en: 'Near $x=4$, the tangent line (straight) and $y=\\sqrt x$ (curved) are nearly on top of each other — that closeness is exactly why the estimate works.',
                  id: 'Di dekat $x=4$, garis singgungnya (lurus) dan $y=\\sqrt x$ (melengkung) hampir berimpit — kedekatan itulah persisnya sebab taksirannya berhasil.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why was $a=4$ chosen to estimate $\\sqrt{4.1}$, rather than some other nearby number?',
                id: 'Mengapa $a=4$ dipilih untuk menaksir $\\sqrt{4.1}$, bukan angka dekat lainnya?',
              },
              options: [
                { en: 'It is a perfect square, so $f(a)$ and $f\'(a)$ are both exact and easy to compute', id: 'Ia kuadrat sempurna, sehingga $f(a)$ dan $f\'(a)$ keduanya eksak dan mudah dihitung' },
                { en: 'Linear approximation only works when $a$ is a perfect square', id: 'Hampiran linear hanya berlaku bila $a$ kuadrat sempurna' },
                { en: '$4$ is the only value close to $4.1$', id: '$4$ satu-satunya nilai dekat $4.1$' },
                { en: 'It was chosen at random — any nearby value works equally well', id: 'Dipilih secara acak — nilai dekat mana pun bekerja sama baiknya' },
              ],
              answer: 0,
              explain: {
                en: 'Linear approximation works near any point with a computable derivative — but it is only *useful* as a shortcut when $f(a)$ itself is easy to compute exactly, which is why a nearby perfect square is the natural choice here.',
                id: 'Hampiran linear berlaku di dekat titik mana pun dengan turunan yang bisa dihitung — tetapi ia hanya *berguna* sebagai jalan pintas bila $f(a)$ sendiri mudah dihitung secara eksak, itulah sebabnya kuadrat sempurna terdekat adalah pilihan wajar di sini.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph above, at $x=4$ (the point of tangency), how do the curve and the tangent line compare?',
                id: 'Dengan membaca grafik di atas, di $x=4$ (titik singgungnya), bagaimana kurva dan garis singgungnya dibandingkan?',
              },
              figure: {
                dim: 2,
                xSpan: [2, 6],
                ySpan: [0, 3],
                ticks: true,
                items: [
                  { t: 'curve', f: 'sqrt(x)', from: 0.01, color: 'a' },
                  { t: 'seg', from: [2, 1.5], to: [6, 2.5], color: 'b' },
                  { t: 'dot', x: 4, y: 2, color: 'c' },
                ],
              },
              options: [
                { en: 'They touch exactly at that point, and stay close nearby', id: 'Keduanya bersinggungan tepat di titik itu, dan tetap dekat di sekitarnya' },
                { en: 'They never meet anywhere on the graph', id: 'Keduanya tak pernah bertemu di mana pun pada grafiknya' },
                { en: 'The tangent line is always above the curve everywhere shown', id: 'Garis singgungnya selalu di atas kurva di seluruh bagian yang ditampilkan' },
                { en: 'The tangent line is always below the curve everywhere shown', id: 'Garis singgungnya selalu di bawah kurva di seluruh bagian yang ditampilkan' },
              ],
              answer: 0,
              explain: {
                en: 'They meet exactly at $(4,2)$ by construction, and visibly diverge only gradually further away — the whole basis for using the line as a nearby stand-in for the curve.',
                id: 'Keduanya bertemu tepat di $(4,2)$ menurut konstruksinya, dan tampak menjauh hanya secara bertahap lebih jauh dari itu — inilah seluruh dasar memakai garisnya sebagai pengganti dekat untuk kurvanya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Use linear approximation with $f(x)=\\sqrt[3]{x}$ at $a=8$ to estimate $\\sqrt[3]{8.24}$.',
                id: 'Pakai hampiran linear dengan $f(x)=\\sqrt[3]{x}$ di $a=8$ untuk menaksir $\\sqrt[3]{8.24}$.',
              },
              blanks: [{ label: '\\sqrt[3]{8.24} \\approx', answer: 2.02 }],
              hints: [
                { en: '$f\'(x) = \\frac13 x^{-2/3}$, so $f\'(8) = \\frac{1}{12}$.', id: '$f\'(x) = \\frac13 x^{-2/3}$, sehingga $f\'(8) = \\frac{1}{12}$.' },
                { en: '$L(8.24) = 2 + \\frac{1}{12}(0.24)$.', id: '$L(8.24) = 2 + \\frac{1}{12}(0.24)$.' },
              ],
              explain: {
                en: '$L(8.24) = 2 + \\frac{1}{12}(0.24) = 2 + 0.02 = 2.02$, close to the true $\\sqrt[3]{8.24}\\approx 2.0199$.',
                id: '$L(8.24) = 2 + \\frac{1}{12}(0.24) = 2 + 0.02 = 2.02$, dekat dengan nilai sebenarnya $\\sqrt[3]{8.24}\\approx 2.0199$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'tur-m5-s1-p',
        runtime: 'math',
        title: { en: 'Rates and Approximations', id: 'Laju dan Hampiran' },
        brief: {
          en: 'A related-rates setup, and a linear approximation.',
          id: 'Satu susunan laju terkait, dan satu hampiran linear.',
        },
        requirements: [
          { en: 'Differentiate the relating equation with respect to time before substituting any specific known value.', id: 'Turunkan persamaan pengaitnya terhadap waktu sebelum mensubstitusikan nilai tertentu apa pun yang diketahui.' },
          { en: 'A linear approximation only needs the function value and derivative at one nearby, easy point.', id: 'Hampiran linear hanya memerlukan nilai fungsi dan turunan pada satu titik dekat yang mudah.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'A spherical balloon\'s volume $V=\\frac43\\pi r^3$ grows at $\\frac{dV}{dt}=100$ cm³/s. Find $\\frac{dr}{dt}$ when $r=5$ cm. (Round to 3 decimals.)',
              id: 'Volume balon berbentuk bola $V=\\frac43\\pi r^3$ bertambah dengan $\\frac{dV}{dt}=100$ cm³/detik. Cari $\\frac{dr}{dt}$ ketika $r=5$ cm. (Bulatkan ke 3 desimal.)',
            },
            blanks: [{ answer: 0.318 }],
            solution: ['\\frac{dV}{dt}=4\\pi r^2\\frac{dr}{dt} \\Rightarrow \\frac{dr}{dt} = \\frac{100}{4\\pi(25)} = \\frac{1}{\\pi} \\approx 0{,}318'],
          },
          {
            prompt: {
              en: 'A rectangle\'s width $x$ shrinks at $2$ cm/s while length $y$ is fixed at $10$ cm. Find $\\frac{dA}{dt}$ (area $A=xy$) at any instant.',
              id: 'Lebar persegi panjang $x$ menyusut dengan $2$ cm/detik sedangkan panjangnya $y$ tetap $10$ cm. Cari $\\frac{dA}{dt}$ (luas $A=xy$) pada saat mana pun.',
            },
            blanks: [{ answer: -20 }],
            solution: ['\\frac{dA}{dt} = \\frac{dx}{dt}y + x\\frac{dy}{dt} = (-2)(10) + x(0) = -20 \\text{ cm}^2/\\text{s}'],
          },
          {
            prompt: {
              en: 'Use linear approximation with $f(x)=\\sqrt x$ at $a=9$ to estimate $\\sqrt{9.3}$.',
              id: 'Pakai hampiran linear dengan $f(x)=\\sqrt x$ di $a=9$ untuk menaksir $\\sqrt{9.3}$.',
            },
            blanks: [{ answer: 3.05 }],
            solution: ['f\'(9)=\\tfrac16, \\quad L(9.3) = 3 + \\tfrac16(0.3) = 3.05'],
          },
        ],
        hints: [
          { en: 'Part 2\'s $y$ never changes, so $\\frac{dy}{dt}=0$ — its term drops out entirely.', id: 'Butir 2, $y$-nya tak pernah berubah, sehingga $\\frac{dy}{dt}=0$ — sukunya lenyap sepenuhnya.' },
        ],
        xp: 50,
      },
    },

    /* ------------------------------------------- 5.2 curve sketching basics */
    {
      id: 'tur-m5-s2',
      title: { en: 'Curve Sketching Basics', id: 'Dasar Sketsa Kurva' },
      summary: {
        en: 'Read where a function increases or decreases from its first derivative, and where it curves up or down from its second.',
        id: 'Membaca tempat fungsi naik atau turun dari turunan pertamanya, dan tempat ia melengkung ke atas atau ke bawah dari turunan keduanya.',
      },
      lessons: [
        {
          id: 'tur-m5-s2-l1',
          title: { en: 'Increasing, Decreasing, and the First Derivative Test', id: 'Naik, Turun, dan Uji Turunan Pertama' },
          goal: {
            en: 'Use the sign of f\'(x) to find where a function increases and decreases, and classify critical points as maxima or minima.',
            id: 'Memakai tanda f\'(x) untuk mencari tempat fungsi naik dan turun, serta mengklasifikasikan titik kritis sebagai maksimum atau minimum.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The sign of the slope is the sign of the derivative', id: 'Tanda kemiringan adalah tanda turunannya' },
              body: {
                en: 'A positive slope means the curve is rising; a negative slope means it is falling. Since $f\'(x)$ *is* the slope at $x$:\n$$f\'(x) > 0 \\text{ on an interval} \\ \\Rightarrow \\ f \\text{ is increasing there}$$\n$$f\'(x) < 0 \\text{ on an interval} \\ \\Rightarrow \\ f \\text{ is decreasing there}$$\nA **critical point** is where $f\'(x)=0$ or is undefined — the only places the sign of $f\'$ *can* change, and therefore the only candidates for a peak or a valley.',
                id: 'Kemiringan positif berarti kurvanya sedang naik; kemiringan negatif berarti sedang turun. Karena $f\'(x)$ *adalah* kemiringan di $x$:\n$$f\'(x) > 0 \\text{ pada suatu interval} \\ \\Rightarrow \\ f \\text{ sedang naik di situ}$$\n$$f\'(x) < 0 \\text{ pada suatu interval} \\ \\Rightarrow \\ f \\text{ sedang turun di situ}$$\n**Titik kritis** adalah tempat $f\'(x)=0$ atau tak terdefinisi — satu-satunya tempat tanda $f\'$ *bisa* berubah, dan karenanya satu-satunya kandidat untuk puncak atau lembah.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The first derivative test, worked in full', id: 'Uji turunan pertama, dikerjakan tuntas' },
              body: {
                en: 'For $f(x) = x^3 - 3x$: $f\'(x) = 3x^2-3 = 3(x-1)(x+1)$, zero at $x=-1$ and $x=1$. Test the sign of $f\'$ in each of the three intervals these points create:\n- $x<-1$ (try $x=-2$): $f\'(-2)=3(9)>0$ — increasing\n- $-1<x<1$ (try $x=0$): $f\'(0)=-3<0$ — decreasing\n- $x>1$ (try $x=2$): $f\'(2)=9>0$ — increasing\nThe derivative switches **positive→negative** at $x=-1$: a local **maximum**, $f(-1)=2$. It switches **negative→positive** at $x=1$: a local **minimum**, $f(1)=-2$.',
                id: 'Untuk $f(x) = x^3 - 3x$: $f\'(x) = 3x^2-3 = 3(x-1)(x+1)$, nol di $x=-1$ dan $x=1$. Uji tanda $f\'$ pada setiap tiga interval yang dibentuk kedua titik ini:\n- $x<-1$ (coba $x=-2$): $f\'(-2)=3(9)>0$ — naik\n- $-1<x<1$ (coba $x=0$): $f\'(0)=-3<0$ — turun\n- $x>1$ (coba $x=2$): $f\'(2)=9>0$ — naik\nTurunannya berpindah **positif→negatif** di $x=-1$: **maksimum** lokal, $f(-1)=2$. Berpindah **negatif→positif** di $x=1$: **minimum** lokal, $f(1)=-2$.',
              },
              figure: {
                dim: 2,
                xSpan: [-2.5, 2.5],
                ySpan: [-3, 3],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^3-3*x', color: 'a' },
                  { t: 'dot', x: -1, y: 2, color: 'b', label: '(-1, 2)' },
                  { t: 'dot', x: 1, y: -2, color: 'c', label: '(1, -2)' },
                ],
                caption: {
                  en: 'The curve rises, turns down at $(-1,2)$, falls, then turns up again at $(1,-2)$ — exactly the sign pattern the first derivative test predicted.',
                  id: 'Kurvanya naik, berbalik turun di $(-1,2)$, turun, lalu berbalik naik lagi di $(1,-2)$ — persis pola tanda yang diprediksi uji turunan pertama.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'At a local maximum, how does f\'(x) behave as x increases through that point?',
                id: 'Pada maksimum lokal, bagaimana perilaku f\'(x) ketika x bertambah melewati titik itu?',
              },
              options: [
                { en: 'It switches from positive to negative', id: 'Berpindah dari positif ke negatif' },
                { en: 'It switches from negative to positive', id: 'Berpindah dari negatif ke positif' },
                { en: 'It stays positive throughout', id: 'Tetap positif sepanjang waktu' },
                { en: 'It is always exactly 1 at a maximum', id: 'Selalu tepat 1 pada maksimum' },
              ],
              answer: 0,
              explain: {
                en: 'A maximum is where increasing turns into decreasing — the slope goes from positive (rising) to negative (falling), which is exactly the sign switch that flags a peak.',
                id: 'Maksimum adalah tempat naik berubah menjadi turun — kemiringannya berubah dari positif (naik) menjadi negatif (turun), persis pergantian tanda yang menandai puncak.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph above of $f(x)=x^3-3x$, on which interval is f increasing?',
                id: 'Dengan membaca grafik $f(x)=x^3-3x$ di atas, pada interval manakah f sedang naik?',
              },
              figure: {
                dim: 2,
                xSpan: [-2.5, 2.5],
                ySpan: [-3, 3],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^3-3*x', color: 'a' },
                  { t: 'dot', x: -1, y: 2, color: 'b' },
                  { t: 'dot', x: 1, y: -2, color: 'c' },
                ],
              },
              options: [
                { en: '$x > 1$', id: '$x > 1$' },
                { en: '$-1 < x < 1$', id: '$-1 < x < 1$' },
                { en: 'Everywhere', id: 'Di mana-mana' },
                { en: 'Nowhere', id: 'Tak di mana pun' },
              ],
              answer: 0,
              explain: {
                en: 'Past $x=1$ (the local minimum), the curve visibly rises without turning back — increasing, matching $f\'(x)>0$ there.',
                id: 'Setelah $x=1$ (minimum lokal), kurvanya tampak naik terus tanpa berbalik — sedang naik, cocok dengan $f\'(x)>0$ di situ.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Arrange the first derivative test\'s steps in the order they are carried out.',
                id: 'Susun langkah uji turunan pertama sesuai urutan pengerjaannya.',
              },
              lines: {
                en: [
                  'Find f\'(x) and solve f\'(x) = 0 (or undefined) for the critical points',
                  'Use the critical points to split the domain into intervals',
                  'Test the sign of f\' at one sample point in each interval',
                  'Read off increasing/decreasing intervals, and classify each critical point by the sign change',
                ],
                id: [
                  'Cari f\'(x) dan selesaikan f\'(x) = 0 (atau tak terdefinisi) untuk titik kritisnya',
                  'Pakai titik kritisnya untuk membagi domain menjadi beberapa interval',
                  'Uji tanda f\' pada satu titik contoh di tiap interval',
                  'Baca interval naik/turun, dan klasifikasikan tiap titik kritis menurut perubahan tandanya',
                ],
              },
              explain: {
                en: 'Critical points first (they are the only places a switch can happen), then intervals between them, then a sign test in each, then the conclusion.',
                id: 'Titik kritis lebih dahulu (satu-satunya tempat pergantian bisa terjadi), lalu interval di antaranya, lalu uji tanda di masing-masing, baru kesimpulannya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $f(x) = x^2 - 4x + 1$, find the critical point and the minimum value of f there.',
                id: 'Untuk $f(x) = x^2 - 4x + 1$, cari titik kritisnya dan nilai minimum f di situ.',
              },
              blanks: [
                { label: 'x =', answer: 2 },
                { label: 'f(x) =', answer: -3 },
              ],
              hints: [
                { en: '$f\'(x) = 2x-4$, zero at $x=2$.', id: '$f\'(x) = 2x-4$, nol di $x=2$.' },
              ],
              explain: {
                en: '$f\'$ switches negative→positive at $x=2$: a minimum. $f(2) = 4-8+1=-3$.',
                id: '$f\'$ berpindah negatif→positif di $x=2$: sebuah minimum. $f(2) = 4-8+1=-3$.',
              },
            },
          ],
        },
        {
          id: 'tur-m5-s2-l2',
          title: { en: 'Concavity and the Second Derivative', id: 'Kecekungan dan Turunan Kedua' },
          goal: {
            en: 'Use the sign of f\'\'(x) to determine concavity and locate inflection points, and apply the second derivative test.',
            id: 'Memakai tanda f\'\'(x) untuk menentukan kecekungan dan menemukan titik belok, serta menerapkan uji turunan kedua.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The derivative of the derivative', id: 'Turunan dari turunan' },
              body: {
                en: 'Just as $f\'$ describes how $f$ itself changes, the **second derivative** $f\'\'=(f\')\'$ describes how $f\'$ changes — whether the slope itself is increasing or decreasing.\n$$f\'\'(x) > 0 \\ \\Rightarrow \\ f \\text{ is concave up (shaped like a cup } \\smile\\text{)}$$\n$$f\'\'(x) < 0 \\ \\Rightarrow \\ f \\text{ is concave down (shaped like a cap } \\frown\\text{)}$$\nA point where concavity switches is an **inflection point**.',
                id: 'Sebagaimana $f\'$ menggambarkan bagaimana $f$ sendiri berubah, **turunan kedua** $f\'\'=(f\')\'$ menggambarkan bagaimana $f\'$ berubah — apakah kemiringannya sendiri sedang bertambah atau berkurang.\n$$f\'\'(x) > 0 \\ \\Rightarrow \\ f \\text{ cekung ke atas (berbentuk mangkuk } \\smile\\text{)}$$\n$$f\'\'(x) < 0 \\ \\Rightarrow \\ f \\text{ cekung ke bawah (berbentuk kubah } \\frown\\text{)}$$\nTitik tempat kecekungan berpindah disebut **titik belok**.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The second derivative test, an alternative to sign charts', id: 'Uji turunan kedua, alternatif untuk bagan tanda' },
              body: {
                en: 'At a critical point where $f\'=0$, the concavity itself tells you what kind of point it is — no interval-sign-testing needed:\n$$f\'\'(c) > 0 \\ \\Rightarrow \\ \\text{local minimum at } c \\quad\\quad f\'\'(c) < 0 \\ \\Rightarrow \\ \\text{local maximum at } c$$\nFor $f(x)=x^3-3x$ from the last lesson: $f\'\'(x)=6x$. At $x=-1$: $f\'\'(-1)=-6<0$ — confirms the local **maximum** found earlier. At $x=1$: $f\'\'(1)=6>0$ — confirms the local **minimum**. Setting $f\'\'(x)=6x=0$ gives $x=0$ as the inflection point, where the curve switches from concave down to concave up.',
                id: 'Pada titik kritis tempat $f\'=0$, kecekungannya sendiri memberi tahu jenis titik apa itu — tanpa perlu uji tanda interval:\n$$f\'\'(c) > 0 \\ \\Rightarrow \\ \\text{minimum lokal di } c \\quad\\quad f\'\'(c) < 0 \\ \\Rightarrow \\ \\text{maksimum lokal di } c$$\nUntuk $f(x)=x^3-3x$ dari pelajaran sebelumnya: $f\'\'(x)=6x$. Di $x=-1$: $f\'\'(-1)=-6<0$ — mengonfirmasi maksimum lokal yang ditemukan sebelumnya. Di $x=1$: $f\'\'(1)=6>0$ — mengonfirmasi minimum lokal. Menetapkan $f\'\'(x)=6x=0$ memberi $x=0$ sebagai titik belok, tempat kurvanya berpindah dari cekung ke bawah menjadi cekung ke atas.',
              },
              figure: {
                dim: 2,
                xSpan: [-2.5, 2.5],
                ySpan: [-3, 3],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^3-3*x', color: 'a' },
                  { t: 'dot', x: 0, y: 0, color: 'b', label: '(0, 0)' },
                ],
                caption: {
                  en: 'To the left of $(0,0)$ the curve is concave down (capping over); to the right it is concave up (cupping under) — the inflection point is exactly where the bend flips.',
                  id: 'Di sebelah kiri $(0,0)$ kurvanya cekung ke bawah (melengkung menutup); di sebelah kanan cekung ke atas (melengkung membuka) — titik beloknya persis di tempat lengkungannya berbalik.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'At a critical point c, if f\'\'(c) < 0, what does that tell you?',
                id: 'Pada titik kritis c, jika f\'\'(c) < 0, apa artinya?',
              },
              options: [
                { en: 'c is a local maximum, since the curve is concave down there', id: 'c adalah maksimum lokal, sebab kurvanya cekung ke bawah di situ' },
                { en: 'c is a local minimum', id: 'c adalah minimum lokal' },
                { en: 'c is an inflection point', id: 'c adalah titik belok' },
                { en: 'f is not differentiable at c', id: 'f tak terdiferensialkan di c' },
              ],
              answer: 0,
              explain: {
                en: 'Concave down at a point where the slope is momentarily zero means the curve caps over — a peak, i.e. a local maximum. That is exactly the second derivative test.',
                id: 'Cekung ke bawah pada titik tempat kemiringannya sesaat nol berarti kurvanya melengkung menutup — sebuah puncak, yaitu maksimum lokal. Itulah persis uji turunan kedua.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph above of $f(x)=x^3-3x$ with its inflection point marked, is the curve concave up or down just to the left of $(0,0)$?',
                id: 'Dengan membaca grafik $f(x)=x^3-3x$ di atas beserta titik beloknya, apakah kurvanya cekung ke atas atau ke bawah tepat di sebelah kiri $(0,0)$?',
              },
              figure: {
                dim: 2,
                xSpan: [-2.5, 2.5],
                ySpan: [-3, 3],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^3-3*x', color: 'a' },
                  { t: 'dot', x: 0, y: 0, color: 'b' },
                ],
              },
              options: [
                { en: 'Concave down', id: 'Cekung ke bawah' },
                { en: 'Concave up', id: 'Cekung ke atas' },
                { en: 'Perfectly straight', id: 'Lurus sempurna' },
                { en: 'Cannot be determined from a graph', id: 'Tak bisa ditentukan dari grafik' },
              ],
              answer: 0,
              explain: {
                en: 'Just left of the inflection point, near the local max at $x=-1$, the curve caps over — concave down, matching $f\'\'(x)=6x<0$ for $x<0$.',
                id: 'Tepat di kiri titik beloknya, dekat maksimum lokal di $x=-1$, kurvanya melengkung menutup — cekung ke bawah, cocok dengan $f\'\'(x)=6x<0$ untuk $x<0$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $f(x)=x^3-6x^2+9x$, use the second derivative test to determine whether $x=1$ is a local max or min.',
                id: 'Untuk $f(x)=x^3-6x^2+9x$, pakai uji turunan kedua untuk menentukan apakah $x=1$ maksimum atau minimum lokal.',
              },
              blanks: [{ label: "f''(1) =", answer: -6 }],
              hints: [
                { en: '$f\'(x)=3x^2-12x+9$, $f\'\'(x)=6x-12$.', id: '$f\'(x)=3x^2-12x+9$, $f\'\'(x)=6x-12$.' },
              ],
              explain: {
                en: '$f\'\'(1) = 6-12 = -6 < 0$ — concave down, so $x=1$ is a local maximum.',
                id: '$f\'\'(1) = 6-12 = -6 < 0$ — cekung ke bawah, sehingga $x=1$ adalah maksimum lokal.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'tur-m5-s2-p',
        runtime: 'math',
        title: { en: 'Sketching From Derivatives', id: 'Mensketsa dari Turunan' },
        brief: {
          en: 'One first-derivative classification, one concavity check, and one full critical-point analysis.',
          id: 'Satu klasifikasi turunan pertama, satu pemeriksaan kecekungan, dan satu analisis titik kritis penuh.',
        },
        requirements: [
          { en: 'A sign switch in f\' at a critical point classifies it as a max or min; a sign in f\'\' does the same directly.', id: 'Pergantian tanda f\' pada titik kritis mengklasifikasikannya sebagai maks atau min; tanda f\'\' melakukannya secara langsung.' },
          { en: 'An inflection point is where f\'\' = 0 and concavity actually switches.', id: 'Titik belok adalah tempat f\'\' = 0 dan kecekungannya sungguh berpindah.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'For $f(x) = -x^2+6x$, find the critical point and state whether it is a max or min (type 1 for max, -1 for min).',
              id: 'Untuk $f(x) = -x^2+6x$, cari titik kritisnya dan nyatakan apakah maksimum atau minimum (ketik 1 untuk maks, -1 untuk min).',
            },
            blanks: [
              { answer: 3 },
              { answer: 1 },
            ],
            solution: ['f\'(x)=-2x+6=0 \\Rightarrow x=3, \\quad f\'\'(x)=-2<0 \\Rightarrow \\text{maximum}'],
          },
          {
            prompt: {
              en: 'For $f(x) = x^3$, find $f\'\'(x)$ and evaluate it at $x=0$.',
              id: 'Untuk $f(x) = x^3$, cari $f\'\'(x)$ dan hitung nilainya di $x=0$.',
            },
            blanks: [{ answer: 0 }],
            solution: ['f\'(x)=3x^2, \\quad f\'\'(x)=6x, \\quad f\'\'(0)=0 \\ (\\text{an inflection point, not a max/min})'],
          },
          {
            prompt: {
              en: 'For $f(x)=x^4-2x^2$, find all critical points, then report the one with the smallest x-value.',
              id: 'Untuk $f(x)=x^4-2x^2$, cari semua titik kritisnya, lalu laporkan yang nilai x-nya terkecil.',
            },
            blanks: [{ answer: -1 }],
            solution: ['f\'(x)=4x^3-4x=4x(x-1)(x+1)=0 \\Rightarrow x=-1,0,1; \\quad \\text{smallest is } x=-1'],
          },
        ],
        hints: [
          { en: 'Part 3 has three critical points from a cubic factorization of f\' — list all of them before picking the smallest.', id: 'Butir 3 punya tiga titik kritis dari faktorisasi kubik f\' — daftarkan semuanya sebelum memilih yang terkecil.' },
        ],
        xp: 50,
      },
    },
  ],
}
