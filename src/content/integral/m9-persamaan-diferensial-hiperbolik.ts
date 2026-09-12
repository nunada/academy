import type { Module } from '../types'

/** Module 9 — an equation that names a derivative instead of a value, solved
 *  by separating the two variables onto opposite sides and integrating each;
 *  and a second family of functions built from e^x the way sine and cosine
 *  are built from the unit circle, except built from a hyperbola instead. */
export const module9: Module = {
  id: 'int-m9',
  title: { en: 'Separable Differential Equations and Hyperbolic Functions', id: 'Persamaan Diferensial Terpisah dan Fungsi Hiperbolik' },
  summary: {
    en: 'Solving an equation that relates a function to its own derivative, and a second family of functions built from e^x the way sine and cosine are built from the circle.',
    id: 'Menyelesaikan persamaan yang mengaitkan fungsi dengan turunannya sendiri, dan keluarga fungsi kedua yang dibangun dari e^x sebagaimana sinus dan cosinus dibangun dari lingkaran.',
  },
  submodules: [
    /* -------------------------------------------- 9.1 separable differential equations */
    {
      id: 'int-m9-s1',
      title: { en: 'Separable Differential Equations', id: 'Persamaan Diferensial Terpisah' },
      summary: {
        en: 'Solving an equation for dy/dx by separating x and y onto opposite sides, then integrating each independently.',
        id: 'Menyelesaikan persamaan untuk dy/dx dengan memisahkan x dan y ke ruas yang berlawanan, lalu mengintegralkan masing-masing secara bebas.',
      },
      lessons: [
        {
          id: 'int-m9-s1-l1',
          title: { en: 'Solving by Separating Variables', id: 'Menyelesaikan dengan Memisahkan Peubah' },
          goal: {
            en: 'Solve a differential equation by separating x and y onto opposite sides of the equation, then integrating both sides.',
            id: 'Menyelesaikan persamaan diferensial dengan memisahkan x dan y ke ruas persamaan yang berlawanan, lalu mengintegralkan kedua ruas.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'An equation about a rate, not a value', id: 'Persamaan tentang laju, bukan nilai' },
              body: {
                en: 'Every equation solved so far named a value: solve for $x$. A **differential equation** names a **derivative** instead: $\\frac{dy}{dx}=xy$ describes a whole family of functions whose rate of change is tied to both $x$ and the function\'s own current value $y$. When the equation can be arranged so all the $y$\'s (with $dy$) sit on one side and all the $x$\'s (with $dx$) sit on the other, it is **separable**:\n$$\\frac{dy}{dx}=xy \\ \\Rightarrow \\ \\frac{dy}{y} = x\\,dx$$\nIntegrating both sides independently — each is now an ordinary antiderivative problem from Module 1:\n$$\\int \\frac{dy}{y} = \\int x\\,dx \\ \\Rightarrow \\ \\ln|y| = \\frac{x^2}{2}+C$$',
                id: 'Setiap persamaan yang diselesaikan sejauh ini menamai sebuah nilai: selesaikan untuk $x$. **Persamaan diferensial** sebagai gantinya menamai sebuah **turunan**: $\\frac{dy}{dx}=xy$ mendeskripsikan seluruh keluarga fungsi yang laju perubahannya terkait dengan $x$ maupun nilai fungsinya sendiri saat ini, $y$. Ketika persamaannya bisa disusun sehingga semua $y$ (dengan $dy$) duduk di satu ruas dan semua $x$ (dengan $dx$) duduk di ruas lain, ia **terpisah**:\n$$\\frac{dy}{dx}=xy \\ \\Rightarrow \\ \\frac{dy}{y} = x\\,dx$$\nMengintegralkan kedua ruas secara bebas — masing-masing kini soal antiturunan biasa dari Modul 1:\n$$\\int \\frac{dy}{y} = \\int x\\,dx \\ \\Rightarrow \\ \\ln|y| = \\frac{x^2}{2}+C$$',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Solving for y, and using an initial condition', id: 'Menyelesaikan untuk y, dan memakai syarat awal' },
              body: {
                en: 'Exponentiating both sides undoes the logarithm: $|y|=e^{x^2/2+C} = e^C e^{x^2/2}$. Since $e^C$ is just some positive constant, rename it $A$: $y=Ae^{x^2/2}$ (allowing $A$ to be any real number absorbs the sign that $|y|$ left ambiguous). This is the **general solution** — a whole family, just like Module 1\'s antiderivatives.\n\nAn initial condition $y(0)=2$ pins down $A$ exactly like it pinned down $C$ back then: $2 = Ae^0 = A$, so $y=2e^{x^2/2}$. At $x=2$: $y=2e^2\\approx 14.78$.',
                id: 'Mengeksponenkan kedua ruas membalik logaritmanya: $|y|=e^{x^2/2+C} = e^C e^{x^2/2}$. Karena $e^C$ hanyalah suatu konstanta positif, namai ulang $A$: $y=Ae^{x^2/2}$ (mengizinkan $A$ bilangan real apa pun menyerap tanda yang ditinggalkan $|y|$ secara ambigu). Ini adalah **solusi umum** — seluruh keluarga, persis seperti antiturunan Modul 1.\n\nSyarat awal $y(0)=2$ menentukan $A$ persis seperti menentukan $C$ dahulu: $2 = Ae^0 = A$, sehingga $y=2e^{x^2/2}$. Di $x=2$: $y=2e^2\\approx 14{,}78$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What makes a differential equation "separable"?',
                id: 'Apa yang membuat persamaan diferensial "terpisah"?',
              },
              options: [
                { en: 'It can be rearranged so every y (with dy) sits on one side and every x (with dx) sits on the other', id: 'Ia bisa ditata ulang sehingga setiap y (dengan dy) duduk di satu ruas dan setiap x (dengan dx) duduk di ruas lain' },
                { en: 'It has no derivative in it at all', id: 'Sama sekali tak punya turunan di dalamnya' },
                { en: 'x and y never appear in the same equation', id: 'x dan y tak pernah muncul dalam persamaan yang sama' },
                { en: 'Every differential equation is automatically separable', id: 'Setiap persamaan diferensial otomatis terpisah' },
              ],
              answer: 0,
              explain: {
                en: 'Separability is exactly the property of being rearrangeable into $f(y)\\,dy = g(x)\\,dx$, after which each side can be antidifferentiated on its own.',
                id: 'Keterpisahan adalah persis sifat bisa ditata ulang menjadi $f(y)\\,dy = g(x)\\,dx$, setelah itu tiap ruas bisa diantiturunkan sendiri-sendiri.',
              },
              hint: {
                en: 'Think about what needs to happen algebraically to the equation before each side can be antidifferentiated completely on its own, with no leftover mixing of the two variables.',
                id: 'Pikirkan apa yang perlu terjadi secara aljabar pada persamaannya sebelum tiap ruas bisa diantiturunkan sepenuhnya sendiri-sendiri, tanpa sisa percampuran kedua peubahnya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the separation step for $\\dfrac{dy}{dx} = 3x^2 y$.',
                id: 'Lengkapi langkah pemisahan untuk $\\dfrac{dy}{dx} = 3x^2 y$.',
              },
              template: '\\dfrac{dy}{y} = ___\\,dx',
              blanks: ['3x^2'],
              explain: {
                en: 'Dividing both sides by $y$ moves every $y$-term to the left, leaving $3x^2$ alone on the right with $dx$.',
                id: 'Membagi kedua ruas dengan $y$ memindahkan setiap suku $y$ ke kiri, menyisakan $3x^2$ sendirian di kanan bersama $dx$.',
              },
              hint: {
                en: "Divide both sides of $\\dfrac{dy}{dx} = 3x^2 y$ by $y$ to move every $y$-term to the left — what is left standing alone on the right?",
                id: 'Bagi kedua ruas $\\dfrac{dy}{dx} = 3x^2 y$ dengan $y$ untuk memindahkan setiap suku $y$ ke kiri — apa yang tersisa sendirian di kanan?',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Solve $\\dfrac{dy}{dx} = 2xy$ with $y(0) = 3$, then evaluate $y$ at $x = 1$.',
                id: 'Selesaikan $\\dfrac{dy}{dx} = 2xy$ dengan $y(0) = 3$, lalu hitung $y$ di $x = 1$.',
              },
              blanks: [{ label: 'y(1) =', answer: 3 * Math.E }],
              hints: [
                { en: 'Separate: $\\dfrac{dy}{y} = 2x\\,dx$. Integrate: $\\ln|y| = x^2 + C$.', id: 'Pisahkan: $\\dfrac{dy}{y} = 2x\\,dx$. Integralkan: $\\ln|y| = x^2 + C$.' },
              ],
              explain: {
                en: '$y = Ae^{x^2}$, $y(0)=3$ gives $A=3$, so $y=3e^{x^2}$. $y(1) = 3e \\approx 8.15$.',
                id: '$y = Ae^{x^2}$, $y(0)=3$ memberi $A=3$, sehingga $y=3e^{x^2}$. $y(1) = 3e \\approx 8{,}15$.',
              },
            },
          ],
        },
        {
          id: 'int-m9-s1-l2',
          title: { en: 'Exponential Growth and Decay as a Differential Equation', id: 'Pertumbuhan dan Peluruhan Eksponen sebagai Persamaan Diferensial' },
          goal: {
            en: 'Derive the exponential growth model from the differential equation stating that a rate is proportional to the current amount.',
            id: 'Menurunkan model pertumbuhan eksponen dari persamaan diferensial yang menyatakan bahwa laju sebanding dengan jumlah saat ini.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A sentence turned into an equation, then solved', id: 'Sebuah kalimat diubah menjadi persamaan, lalu diselesaikan' },
              body: {
                en: 'The Functions course simply stated that population growth and radioactive decay follow $y=y_0a^t$. Here is where that model actually comes from. "The rate of change of a quantity is proportional to the quantity itself" translates directly into a differential equation:\n$$\\frac{dy}{dt} = ky$$\nThis is exactly the separable equation from the last lesson\'s pattern, with $x$ renamed $t$: $\\frac{dy}{y}=k\\,dt \\Rightarrow \\ln|y|=kt+C \\Rightarrow y=Ae^{kt}$. An initial condition $y(0)=y_0$ gives $A=y_0$ immediately:\n$$y = y_0 e^{kt}$$\n$k>0$ gives growth, $k<0$ gives decay — one equation, one solution method, covering both directions.',
                id: 'Kursus Fungsi hanya menyatakan pertumbuhan populasi dan peluruhan radioaktif mengikuti $y=y_0a^t$. Di sinilah model itu sebenarnya berasal. "Laju perubahan sebuah besaran sebanding dengan besaran itu sendiri" diterjemahkan langsung menjadi persamaan diferensial:\n$$\\frac{dy}{dt} = ky$$\nIni persis persamaan terpisah dari pola pelajaran sebelumnya, dengan $x$ dinamai ulang $t$: $\\frac{dy}{y}=k\\,dt \\Rightarrow \\ln|y|=kt+C \\Rightarrow y=Ae^{kt}$. Syarat awal $y(0)=y_0$ langsung memberi $A=y_0$:\n$$y = y_0 e^{kt}$$\n$k>0$ memberi pertumbuhan, $k<0$ memberi peluruhan — satu persamaan, satu metode penyelesaian, mencakup kedua arah.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A population, growing continuously', id: 'Sebuah populasi, bertumbuh sinambung' },
              body: {
                en: 'A population grows according to $\\frac{dP}{dt}=0.05P$ with $P(0)=1000$. From the formula just derived, $P(t)=1000e^{0.05t}$. At $t=10$:\n$$P(10) = 1000e^{0.5} \\approx 1648.7$$\nThe constant $k=0.05$ is the **continuous growth rate** — not quite the same as a 5% rate compounded once a year (the Functions course\'s compound interest), but its continuous-time limit, exactly the connection that section made when $e$ itself first appeared as the limit of ever-more-frequent compounding.',
                id: 'Sebuah populasi bertumbuh menurut $\\frac{dP}{dt}=0.05P$ dengan $P(0)=1000$. Dari rumus yang baru diturunkan, $P(t)=1000e^{0.05t}$. Di $t=10$:\n$$P(10) = 1000e^{0.5} \\approx 1648{,}7$$\nKonstanta $k=0.05$ adalah **laju pertumbuhan sinambung** — bukan persis sama dengan laju 5% yang dimajemukkan sekali setahun (bunga majemuk kursus Fungsi), tetapi limit waktu-sinambungnya, persis kaitan yang dibuat bagian itu ketika $e$ sendiri pertama kali muncul sebagai limit dari pemajemukan yang kian sering.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.5, 12],
                ySpan: [-100, 2000],
                ticks: true,
                items: [{ t: 'curve', f: '1000*e^(0.05*x)', from: 0, to: 11, color: 'a' }],
                caption: {
                  en: '$P(t) = 1000e^{0.05t}$ — the solution to $\\dfrac{dP}{dt} = 0.05P$, reaching about $1648.7$ at $t = 10$.',
                  id: '$P(t) = 1000e^{0.05t}$ — solusi dari $\\dfrac{dP}{dt} = 0.05P$, mencapai sekitar $1648{,}7$ di $t = 10$.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What differential equation does "the rate of change of P is proportional to P itself" translate into?',
                id: 'Persamaan diferensial apa yang menjadi terjemahan dari "laju perubahan P sebanding dengan P itu sendiri"?',
              },
              options: [
                { en: '$\\dfrac{dP}{dt} = kP$', id: '$\\dfrac{dP}{dt} = kP$' },
                { en: '$\\dfrac{dP}{dt} = k$', id: '$\\dfrac{dP}{dt} = k$' },
                { en: '$\\dfrac{dP}{dt} = kt$', id: '$\\dfrac{dP}{dt} = kt$' },
                { en: '$P = kt$', id: '$P = kt$' },
              ],
              answer: 0,
              explain: {
                en: '"Proportional to $P$ itself" means the rate equals a constant $k$ times $P$, not a constant alone and not a function of $t$ alone.',
                id: '"Sebanding dengan $P$ itu sendiri" berarti lajunya sama dengan konstanta $k$ dikali $P$, bukan konstanta saja dan bukan fungsi dari $t$ saja.',
              },
              hint: {
                en: '"Proportional to" always means a constant times the quantity — read the phrase word by word and match each part to a piece of the equation.',
                id: '"Sebanding dengan" selalu berarti sebuah konstanta dikali besarannya — baca frasanya kata demi kata dan cocokkan tiap bagian dengan bagian persamaannya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph above of $P(t) = 1000e^{0.05t}$, what is the value being approached at $t = 10$?',
                id: 'Dengan membaca grafik $P(t) = 1000e^{0.05t}$ di atas, nilai apa yang didekati di $t = 10$?',
              },
              figure: {
                dim: 2,
                xSpan: [-0.5, 12],
                ySpan: [-100, 2000],
                ticks: true,
                items: [{ t: 'curve', f: '1000*e^(0.05*x)', from: 0, to: 11, color: 'a' }],
              },
              options: [
                { en: 'About 1650', id: 'Sekitar 1650' },
                { en: 'About 1000', id: 'Sekitar 1000' },
                { en: 'About 500', id: 'Sekitar 500' },
                { en: 'About 2000', id: 'Sekitar 2000' },
              ],
              answer: 0,
              explain: {
                en: 'The curve visibly reaches somewhat above 1600 by $t = 10$, matching the computed value of approximately $1648.7$.',
                id: 'Kurvanya tampak mencapai sedikit di atas 1600 pada $t = 10$, cocok dengan nilai terhitung sekitar $1648{,}7$.',
              },
              hint: {
                en: 'This is the exact same $P(t)$ example already worked out numerically in the concept above — look back at what $P(10)$ came out to be there.',
                id: 'Ini persis contoh $P(t)$ yang sama yang sudah dikerjakan secara numerik pada konsep di atas — lihat kembali apa yang dihasilkan $P(10)$ di situ.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'A population follows $\\dfrac{dP}{dt} = 0.03P$ with $P(0) = 500$. Find $P(20)$.',
                id: 'Sebuah populasi mengikuti $\\dfrac{dP}{dt} = 0.03P$ dengan $P(0) = 500$. Cari $P(20)$.',
              },
              blanks: [{ answer: 500 * Math.exp(0.6) }],
              hints: [
                { en: '$P(t) = 500e^{0.03t}$.', id: '$P(t) = 500e^{0.03t}$.' },
              ],
              explain: {
                en: '$P(20) = 500e^{0.6} \\approx 911.06$.',
                id: '$P(20) = 500e^{0.6} \\approx 911{,}06$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'int-m9-s1-p',
        runtime: 'math',
        title: { en: 'Solving and Applying Separable Equations', id: 'Menyelesaikan dan Menerapkan Persamaan Terpisah' },
        brief: {
          en: 'One general separable equation, and two growth-model applications.',
          id: 'Satu persamaan terpisah umum, dan dua penerapan model pertumbuhan.',
        },
        requirements: [
          { en: 'Separate the variables completely before integrating either side.', id: 'Pisahkan peubahnya sepenuhnya sebelum mengintegralkan ruas mana pun.' },
          { en: '$\\dfrac{dy}{dt} = ky$ always solves to $y = y_0 e^{kt}$.', id: '$\\dfrac{dy}{dt} = ky$ selalu terselesaikan menjadi $y = y_0 e^{kt}$.' },
        ],
        tasks: [
          {
            prompt: { en: 'Solve $\\dfrac{dy}{dx} = 4x^3 y$ with $y(0) = 1$, then evaluate $y$ at $x = 1$.', id: 'Selesaikan $\\dfrac{dy}{dx} = 4x^3 y$ dengan $y(0) = 1$, lalu hitung $y$ di $x = 1$.' },
            blanks: [{ answer: Math.E, tol: 0.01 }],
            solution: ['\\dfrac{dy}{y}=4x^3\\,dx \\Rightarrow \\ln|y|=x^4+C', 'y(0)=1 \\Rightarrow C=0, \\quad y=e^{x^4}, \\quad y(1)=e \\approx 2{,}72'],
          },
          {
            prompt: { en: 'A radioactive sample follows $\\dfrac{dA}{dt} = -0.02A$ with $A(0) = 200$. Find $A(30)$. (Round to two decimal places.)', id: 'Sampel radioaktif mengikuti $\\dfrac{dA}{dt} = -0.02A$ dengan $A(0) = 200$. Cari $A(30)$. (Bulatkan ke dua desimal.)' },
            blanks: [{ answer: 200 * Math.exp(-0.6), tol: 0.5 }],
            solution: ['A(t)=200e^{-0.02t}, \\quad A(30)=200e^{-0.6} \\approx 109{,}76'],
          },
          {
            prompt: { en: 'A population follows $\\dfrac{dP}{dt} = 0.04P$ with $P(0) = 800$. Find $P(15)$. (Round to two decimal places.)', id: 'Sebuah populasi mengikuti $\\dfrac{dP}{dt} = 0.04P$ dengan $P(0) = 800$. Cari $P(15)$. (Bulatkan ke dua desimal.)' },
            blanks: [{ answer: 800 * Math.exp(0.6), tol: 0.5 }],
            solution: ['P(t)=800e^{0.04t}, \\quad P(15)=800e^{0.6} \\approx 1457{,}70'],
          },
        ],
        hints: [
          { en: 'A negative $k$ in $y_0 e^{kt}$ describes decay, not growth — the sign carries real meaning.', id: '$k$ negatif dalam $y_0 e^{kt}$ mendeskripsikan peluruhan, bukan pertumbuhan — tandanya membawa makna sungguhan.' },
        ],
        xp: 50,
      },
    },

    /* ----------------------------------------------------- 9.2 hyperbolic functions */
    {
      id: 'int-m9-s2',
      title: { en: 'Hyperbolic Functions', id: 'Fungsi Hiperbolik' },
      summary: {
        en: 'A second family of functions built from e^x, with their own Pythagorean-style identity and derivatives simpler than their trigonometric namesakes.',
        id: 'Keluarga fungsi kedua yang dibangun dari e^x, dengan identitas bergaya Pythagoras sendiri dan turunan yang lebih sederhana dari nama sejenis trigonometrinya.',
      },
      lessons: [
        {
          id: 'int-m9-s2-l1',
          title: { en: 'sinh x, cosh x, and Their Identities', id: 'sinh x, cosh x, dan Identitasnya' },
          goal: {
            en: 'Define the hyperbolic sine and cosine from e^x, and prove the identity that gives them their name.',
            id: 'Mendefinisikan sinus dan cosinus hiperbolik dari e^x, dan membuktikan identitas yang memberi mereka namanya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Splitting e^x into an even part and an odd part', id: 'Memecah e^x menjadi bagian genap dan bagian ganjil' },
              body: {
                en: 'Any function can be split into an even piece and an odd piece — the Functions course used exactly this idea. Applied to $e^x$:\n$$\\cosh x = \\frac{e^x+e^{-x}}{2} \\ (\\text{even}), \\qquad \\sinh x = \\frac{e^x-e^{-x}}{2} \\ (\\text{odd})$$\nread "hyperbolic cosine" and "hyperbolic sine". Adding them back recovers $e^x$ exactly: $\\cosh x+\\sinh x = e^x$. At $x=0$: $\\cosh 0 = \\frac{1+1}{2}=1$, $\\sinh 0=\\frac{1-1}{2}=0$ — matching $\\cos 0=1$ and $\\sin 0=0$, the first hint these are genuine counterparts to the circular functions.',
                id: 'Fungsi apa pun bisa dipecah menjadi bagian genap dan bagian ganjil — kursus Fungsi memakai persis gagasan ini. Diterapkan pada $e^x$:\n$$\\cosh x = \\frac{e^x+e^{-x}}{2} \\ (\\text{genap}), \\qquad \\sinh x = \\frac{e^x-e^{-x}}{2} \\ (\\text{ganjil})$$\ndibaca "cosinus hiperbolik" dan "sinus hiperbolik". Menjumlahkannya kembali memulihkan $e^x$ persis: $\\cosh x+\\sinh x = e^x$. Di $x=0$: $\\cosh 0 = \\frac{1+1}{2}=1$, $\\sinh 0=\\frac{1-1}{2}=0$ — cocok dengan $\\cos 0=1$ dan $\\sin 0=0$, petunjuk pertama bahwa ini padanan sungguhan dari fungsi sirkular.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A hyperbola, not a circle — hence the name', id: 'Sebuah hiperbola, bukan lingkaran — karenanya namanya begitu' },
              body: {
                en: 'Trig functions satisfy $\\cos^2\\theta+\\sin^2\\theta=1$, tracing the unit **circle** $x^2+y^2=1$. Hyperbolic functions satisfy the analogous identity with a sign flipped:\n$$\\cosh^2 x - \\sinh^2 x = 1$$\nProof, directly from the definitions: $\\cosh^2x-\\sinh^2x = \\left(\\frac{e^x+e^{-x}}{2}\\right)^2-\\left(\\frac{e^x-e^{-x}}{2}\\right)^2 = \\frac{(e^x+e^{-x})^2-(e^x-e^{-x})^2}{4}$. Expanding both squares, every $e^{2x}$ and $e^{-2x}$ term cancels between them, leaving $\\frac{4e^xe^{-x}}{4}=e^0=1$. The point $(\\cosh x,\\sinh x)$ traces the **hyperbola** $X^2-Y^2=1$ — the source of the name, and of every hyperbolic identity\'s family resemblance to a trig one.',
                id: 'Fungsi trigonometri memenuhi $\\cos^2\\theta+\\sin^2\\theta=1$, menjejaki lingkaran satuan $x^2+y^2=1$. Fungsi hiperbolik memenuhi identitas analog dengan tanda yang dibalik:\n$$\\cosh^2 x - \\sinh^2 x = 1$$\nBukti, langsung dari definisinya: $\\cosh^2x-\\sinh^2x = \\left(\\frac{e^x+e^{-x}}{2}\\right)^2-\\left(\\frac{e^x-e^{-x}}{2}\\right)^2 = \\frac{(e^x+e^{-x})^2-(e^x-e^{-x})^2}{4}$. Menjabarkan kedua kuadratnya, setiap suku $e^{2x}$ dan $e^{-2x}$ saling meniadakan di antara keduanya, menyisakan $\\frac{4e^xe^{-x}}{4}=e^0=1$. Titik $(\\cosh x,\\sinh x)$ menjejaki **hiperbola** $X^2-Y^2=1$ — sumber namanya, dan kemiripan keluarga setiap identitas hiperbolik dengan identitas trigonometri.',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 3],
                ySpan: [-4, 4],
                ticks: true,
                items: [
                  { t: 'curve', f: '(e^x+e^(-x))/2', from: -2, to: 2, color: 'a', label: 'cosh x' },
                  { t: 'curve', f: '(e^x-e^(-x))/2', from: -2, to: 2, color: 'b', label: 'sinh x' },
                ],
                caption: {
                  en: '$\\cosh x$ (always $\\geq 1$, even) and $\\sinh x$ (odd, passing through the origin) — built from $e^x$ the way $\\cos$ and $\\sin$ are built from the circle.',
                  id: '$\\cosh x$ (selalu $\\geq 1$, genap) dan $\\sinh x$ (ganjil, melalui titik asal) — dibangun dari $e^x$ sebagaimana $\\cos$ dan $\\sin$ dibangun dari lingkaran.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why is the hyperbolic identity $\\cosh^2(x) - \\sinh^2(x) = 1$ a subtraction, unlike the trig identity $\\cos^2 + \\sin^2 = 1$?',
                id: 'Mengapa identitas hiperbolik $\\cosh^2(x) - \\sinh^2(x) = 1$ adalah pengurangan, tak seperti identitas trigonometri $\\cos^2 + \\sin^2 = 1$?',
              },
              options: [
                { en: 'Expanding the definitions directly shows the $e^{2x}$ and $e^{-2x}$ terms only cancel when the squares are subtracted, not added', id: 'Menjabarkan definisinya langsung menunjukkan suku $e^{2x}$ dan $e^{-2x}$ hanya saling meniadakan ketika kuadratnya dikurangkan, bukan dijumlahkan' },
                { en: 'It is an arbitrary choice with no algebraic reason', id: 'Ini pilihan sebarang tanpa alasan aljabar' },
                { en: '$\\cosh$ and $\\sinh$ are actually equal to each other', id: '$\\cosh$ dan $\\sinh$ sebenarnya sama satu sama lain' },
                { en: 'The identity is actually $\\cosh^2 + \\sinh^2 = 1$ instead', id: 'Identitasnya sebenarnya $\\cosh^2 + \\sinh^2 = 1$' },
              ],
              answer: 0,
              explain: {
                en: 'Expanding $(e^x+e^{-x})^2$ and $(e^x-e^{-x})^2$ and subtracting cancels the $e^{2x}$ and $e^{-2x}$ cross terms, leaving exactly $4$ — dividing by the $4$ from squaring $1/2$ twice gives $1$. Adding instead would double those terms rather than cancel them.',
                id: 'Menjabarkan $(e^x+e^{-x})^2$ dan $(e^x-e^{-x})^2$ lalu mengurangkan meniadakan suku silang $e^{2x}$ dan $e^{-2x}$, menyisakan tepat $4$ — membagi dengan $4$ dari mengkuadratkan $1/2$ dua kali memberi $1$. Menjumlahkan sebagai gantinya justru akan menggandakan suku-suku itu, bukan meniadakannya.',
              },
              hint: {
                en: 'Expand $(e^x+e^{-x})^2$ and $(e^x-e^{-x})^2$ separately and track the middle cross term in each — does adding or subtracting the two expansions make that cross term disappear?',
                id: 'Jabarkan $(e^x+e^{-x})^2$ dan $(e^x-e^{-x})^2$ secara terpisah dan lacak suku silang di tengah masing-masing — apakah menjumlahkan atau mengurangkan kedua jabaran itu yang membuat suku silangnya lenyap?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph above, why is $\\cosh x$ never less than $1$?',
                id: 'Dengan membaca grafik di atas, mengapa $\\cosh x$ tak pernah kurang dari $1$?',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 3],
                ySpan: [-4, 4],
                ticks: true,
                items: [
                  { t: 'curve', f: '(e^x+e^(-x))/2', from: -2, to: 2, color: 'a' },
                  { t: 'curve', f: '(e^x-e^(-x))/2', from: -2, to: 2, color: 'b' },
                ],
              },
              options: [
                { en: 'It is an average of $e^x$ and $e^{-x}$, both positive, and it reaches its minimum of exactly $1$ at $x = 0$', id: 'Ia adalah rata-rata dari $e^x$ dan $e^{-x}$, keduanya positif, dan mencapai minimumnya tepat $1$ di $x = 0$' },
                { en: 'It happens to look that way in the figure but is not true in general', id: 'Kebetulan terlihat begitu pada gambar tetapi tak benar secara umum' },
                { en: '$\\cosh x$ is actually identical to $\\cos x$', id: '$\\cosh x$ sebenarnya identik dengan $\\cos x$' },
                { en: 'The graph shown is actually of $\\sinh x$', id: 'Grafik yang ditampilkan sebenarnya $\\sinh x$' },
              ],
              answer: 0,
              explain: {
                en: 'The curve dips to its lowest point exactly at the origin, at height 1, then rises symmetrically on both sides — the visible U-shape of an even function built from two positive exponentials.',
                id: 'Kurvanya menukik ke titik terendahnya persis di titik asal, pada ketinggian 1, lalu naik secara simetris di kedua sisi — bentuk U yang tampak dari fungsi genap yang dibangun dari dua eksponen positif.',
              },
              hint: {
                en: '$\\cosh x$ averages $e^x$ and $e^{-x}$ together — think about what the smallest possible value of that average could be, and where on the graph it occurs.',
                id: '$\\cosh x$ merata-ratakan $e^x$ dan $e^{-x}$ — pikirkan nilai terkecil yang mungkin dari rata-rata itu, dan di mana pada grafik itu terjadi.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Evaluate $\\sinh(1)$ and $\\cosh(1)$. (Round to four decimal places.)',
                id: 'Hitung $\\sinh(1)$ dan $\\cosh(1)$. (Bulatkan ke empat desimal.)',
              },
              blanks: [
                { label: '\\sinh(1) =', answer: 1.1752, tol: 0.001 },
                { label: '\\cosh(1) =', answer: 1.5431, tol: 0.001 },
              ],
              hints: [
                { en: '$\\sinh(1) = (e - 1/e)/2$, $\\cosh(1) = (e + 1/e)/2$.', id: '$\\sinh(1) = (e - 1/e)/2$, $\\cosh(1) = (e + 1/e)/2$.' },
              ],
              explain: {
                en: '$\\sinh(1) \\approx 1.1752$, $\\cosh(1) \\approx 1.5431$. Check: $1.5431^2 - 1.1752^2 \\approx 1$.',
                id: '$\\sinh(1) \\approx 1{,}1752$, $\\cosh(1) \\approx 1{,}5431$. Periksa: $1{,}5431^2 - 1{,}1752^2 \\approx 1$.',
              },
            },
          ],
        },
        {
          id: 'int-m9-s2-l2',
          title: { en: 'Derivatives and Integrals of Hyperbolic Functions', id: 'Turunan dan Integral Fungsi Hiperbolik' },
          goal: {
            en: 'Differentiate sinh x and cosh x directly from their e^x definitions, and integrate each accordingly.',
            id: 'Menurunkan sinh x dan cosh x langsung dari definisi e^x-nya, dan mengintegralkan masing-masing sesuai itu.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'No sign flip, unlike sine and cosine', id: 'Tak ada pembalikan tanda, tak seperti sinus dan cosinus' },
              body: {
                en: 'Differentiating the definitions directly, using $\\frac{d}{dx}(e^{-x})=-e^{-x}$ from the chain rule:\n$$\\frac{d}{dx}(\\sinh x) = \\frac{d}{dx}\\left(\\frac{e^x-e^{-x}}{2}\\right) = \\frac{e^x-(-e^{-x})}{2} = \\frac{e^x+e^{-x}}{2} = \\cosh x$$\n$$\\frac{d}{dx}(\\cosh x) = \\frac{d}{dx}\\left(\\frac{e^x+e^{-x}}{2}\\right) = \\frac{e^x-e^{-x}}{2} = \\sinh x$$\nUnlike $\\frac{d}{dx}(\\cos x)=-\\sin x$, there is **no minus sign** here — differentiating $\\cosh x$ gives back $\\sinh x$ directly, and differentiating that gives back $\\cosh x$ again. Two derivatives return to the start instead of trigonometry\'s four-step cycle.',
                id: 'Menurunkan definisinya langsung, memakai $\\frac{d}{dx}(e^{-x})=-e^{-x}$ dari aturan rantai:\n$$\\frac{d}{dx}(\\sinh x) = \\frac{d}{dx}\\left(\\frac{e^x-e^{-x}}{2}\\right) = \\frac{e^x-(-e^{-x})}{2} = \\frac{e^x+e^{-x}}{2} = \\cosh x$$\n$$\\frac{d}{dx}(\\cosh x) = \\frac{d}{dx}\\left(\\frac{e^x+e^{-x}}{2}\\right) = \\frac{e^x-e^{-x}}{2} = \\sinh x$$\nTak seperti $\\frac{d}{dx}(\\cos x)=-\\sin x$, **tak ada tanda minus** di sini — menurunkan $\\cosh x$ langsung mengembalikan $\\sinh x$, dan menurunkan itu mengembalikan $\\cosh x$ lagi. Dua turunan kembali ke awal, bukan siklus empat langkah trigonometri.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Reading the derivatives backward, as integrals', id: 'Membaca turunannya terbalik, sebagai integral' },
              body: {
                en: 'Read backward, exactly as every derivative rule in this course eventually was:\n$$\\int \\cosh x\\,dx = \\sinh x + C, \\qquad \\int \\sinh x\\,dx = \\cosh x + C$$\nFor $\\int_0^1 \\cosh x\\,dx$: antiderivative $\\sinh x$, so the integral is $\\sinh(1)-\\sinh(0) = 1.1752-0=1.1752$. For $\\int_0^{\\ln 2}\\sinh x\\,dx$: antiderivative $\\cosh x$, so it is $\\cosh(\\ln 2)-\\cosh(0)$. Since $\\cosh(\\ln 2)=\\frac{e^{\\ln2}+e^{-\\ln2}}{2}=\\frac{2+0.5}{2}=1.25$, the integral equals $1.25-1=0.25$ — an exact, clean value, because $\\ln 2$ was chosen precisely to make $e^{\\ln 2}=2$ come out simply.',
                id: 'Dibaca terbalik, persis seperti setiap aturan turunan dalam kursus ini akhirnya diperlakukan:\n$$\\int \\cosh x\\,dx = \\sinh x + C, \\qquad \\int \\sinh x\\,dx = \\cosh x + C$$\nUntuk $\\int_0^1 \\cosh x\\,dx$: antiturunannya $\\sinh x$, sehingga integralnya $\\sinh(1)-\\sinh(0) = 1.1752-0=1.1752$. Untuk $\\int_0^{\\ln 2}\\sinh x\\,dx$: antiturunannya $\\cosh x$, sehingga hasilnya $\\cosh(\\ln 2)-\\cosh(0)$. Karena $\\cosh(\\ln 2)=\\frac{e^{\\ln2}+e^{-\\ln2}}{2}=\\frac{2+0.5}{2}=1.25$, integralnya sama dengan $1.25-1=0.25$ — nilai yang eksak dan bersih, sebab $\\ln 2$ dipilih persis agar $e^{\\ln 2}=2$ keluar sederhana.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is the key difference between the derivative cycle of sinh/cosh and that of sin/cos?',
                id: 'Apa perbedaan kunci antara siklus turunan sinh/cosh dan sin/cos?',
              },
              options: [
                { en: 'sinh and cosh cycle back to themselves after two derivatives, with no minus sign ever appearing', id: 'sinh dan cosh berputar kembali ke dirinya sendiri setelah dua turunan, tanpa tanda minus yang pernah muncul' },
                { en: 'sinh and cosh have no derivatives at all', id: 'sinh dan cosh sama sekali tak punya turunan' },
                { en: 'sin and cos take four derivatives to cycle back, while sinh and cosh never cycle', id: 'sin dan cos memerlukan empat turunan untuk kembali, sedangkan sinh dan cosh tak pernah berputar' },
                { en: 'There is no difference — the two pairs behave identically', id: 'Tak ada bedanya — kedua pasangan berperilaku identik' },
              ],
              answer: 0,
              explain: {
                en: 'sin/cos need four derivatives to return to the start because of the alternating minus signs; sinh/cosh return after just two, since differentiating either one gives the other with no sign change at all.',
                id: 'sin/cos memerlukan empat turunan untuk kembali ke awal karena tanda minus yang berselang-seling; sinh/cosh kembali hanya setelah dua, sebab menurunkan salah satunya memberi yang lain tanpa perubahan tanda sama sekali.',
              },
              hint: {
                en: 'Count how many times you have to differentiate $\\cos x$ before it returns to $\\cos x$ again, then do the same count for $\\cosh x$ — and watch whether a minus sign ever shows up along the way for either one.',
                id: 'Hitung berapa kali kamu harus menurunkan $\\cos x$ sebelum kembali menjadi $\\cos x$ lagi, lalu lakukan hitungan yang sama untuk $\\cosh x$ — dan perhatikan apakah tanda minus pernah muncul di sepanjang jalan untuk keduanya.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the steps that evaluate $\\int_0^{\\ln 3} \\sinh(x)\\,dx$.',
                id: 'Susun langkah yang menghitung $\\int_0^{\\ln 3} \\sinh(x)\\,dx$.',
              },
              lines: [
                '\\int_0^{\\ln 3} \\sinh x\\,dx = \\Big[\\cosh x\\Big]_0^{\\ln 3}',
                '\\cosh(\\ln 3) = \\dfrac{3+1/3}{2} = \\dfrac{5}{3}',
                '= \\dfrac{5}{3} - 1 = \\dfrac{2}{3}',
              ],
              explain: {
                en: 'Write the antiderivative first, then evaluate $\\cosh$ at the upper bound using $e^{\\ln 3} = 3$, then subtract $\\cosh(0) = 1$.',
                id: 'Tulis antiturunannya lebih dahulu, lalu evaluasi $\\cosh$ di batas atas memakai $e^{\\ln 3} = 3$, baru kurangkan $\\cosh(0) = 1$.',
              },
              hint: {
                en: "You can't evaluate $\\cosh$ at the upper bound until the antiderivative has actually been written down — and you can't subtract $\\cosh(0)$ until that upper-bound value has been worked out numerically.",
                id: 'Kamu tak bisa mengevaluasi $\\cosh$ di batas atas sebelum antiturunannya benar-benar dituliskan — dan kamu tak bisa mengurangkan $\\cosh(0)$ sebelum nilai batas atas itu dikerjakan secara numerik.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Evaluate $\\int_0^{\\ln 2} \\sinh(x)\\,dx$.',
                id: 'Hitung $\\int_0^{\\ln 2} \\sinh(x)\\,dx$.',
              },
              blanks: [{ answer: 0.25 }],
              hints: [
                { en: 'Antiderivative is $\\cosh x$. $\\cosh(\\ln 2) = (2 + 0.5)/2$.', id: 'Antiturunannya $\\cosh x$. $\\cosh(\\ln 2) = (2 + 0.5)/2$.' },
              ],
              explain: {
                en: '$\\cosh(\\ln 2) - \\cosh(0) = 1.25 - 1 = 0.25$.',
                id: '$\\cosh(\\ln 2) - \\cosh(0) = 1{,}25 - 1 = 0{,}25$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'int-m9-s2-p',
        runtime: 'math',
        title: { en: 'Working with Hyperbolic Functions', id: 'Bekerja dengan Fungsi Hiperbolik' },
        brief: {
          en: 'An identity check, and two definite integrals of hyperbolic functions.',
          id: 'Satu pemeriksaan identitas, dan dua integral tentu fungsi hiperbolik.',
        },
        requirements: [
          { en: '$\\cosh^2(x) - \\sinh^2(x)$ always equals $1$, for any $x$.', id: '$\\cosh^2(x) - \\sinh^2(x)$ selalu sama dengan $1$, untuk $x$ mana pun.' },
          { en: 'The antiderivative of $\\cosh$ is $\\sinh$, and of $\\sinh$ is $\\cosh$ — with no sign change.', id: 'Antiturunan $\\cosh$ adalah $\\sinh$, dan $\\sinh$ adalah $\\cosh$ — tanpa perubahan tanda.' },
        ],
        tasks: [
          {
            prompt: { en: 'Given $\\sinh(x) = 0.75$, use the identity to find $\\cosh(x)$. (Round to two decimal places.)', id: 'Diberikan $\\sinh(x) = 0.75$, pakai identitas untuk mencari $\\cosh(x)$. (Bulatkan ke dua desimal.)' },
            blanks: [{ answer: 1.25 }],
            solution: ['\\cosh^2 x = 1+0.75^2 = 1.5625, \\quad \\cosh x = \\sqrt{1.5625} = 1{,}25'],
          },
          {
            prompt: { en: 'Evaluate $\\int_0^2 \\cosh(x)\\,dx$. (Round to two decimal places.)', id: 'Hitung $\\int_0^2 \\cosh(x)\\,dx$. (Bulatkan ke dua desimal.)' },
            blanks: [{ answer: 3.63, tol: 0.02 }],
            solution: ['\\Big[\\sinh x\\Big]_0^2 = \\sinh(2)-\\sinh(0) \\approx 3{,}6269-0 = 3{,}63'],
          },
          {
            prompt: { en: 'Evaluate $\\int_0^{\\ln 3} \\sinh(x)\\,dx$.', id: 'Hitung $\\int_0^{\\ln 3} \\sinh(x)\\,dx$.' },
            blanks: [{ answer: 2 / 3 }],
            solution: ['\\Big[\\cosh x\\Big]_0^{\\ln 3} = \\cosh(\\ln3)-1 = \\tfrac53-1=\\tfrac23 \\approx 0{,}67'],
          },
        ],
        hints: [
          { en: 'Part 3 mirrors the lesson\'s own ln(2) example — the same clean-value trick, with ln(3) instead.', id: 'Butir 3 mencerminkan contoh ln(2) pada pelajarannya sendiri — trik nilai bersih yang sama, dengan ln(3) sebagai gantinya.' },
        ],
        xp: 50,
      },
    },
  ],
}
