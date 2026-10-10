import type { Module } from '../types'

/** Module 2 — the plane described by distance and direction instead of right
 *  and up: how a point is named, how polar equations are graphed, and the two
 *  calculus questions (area swept out, length of the curve) rewritten for them. */
export const module2: Module = {
  id: 'par-m2',
  title: { en: 'Polar Coordinates', id: 'Koordinat Kutub' },
  summary: {
    en: 'Naming a point by its distance and direction from a pole, graphing roses, limaçons and spirals, and then finding the area a rotating radius sweeps out and the length of the curve it draws.',
    id: 'Menamai sebuah titik dengan jarak dan arahnya dari sebuah kutub, menggambar mawar, limaçon, dan spiral, lalu mencari luas yang disapu sebuah jari-jari yang berputar dan panjang kurva yang digambarnya.',
  },
  submodules: [
    /* ------------------------------------------------ 10.3-10.4 polar coordinates and graphs */
    {
      id: 'par-m2-s1',
      title: { en: 'Polar Coordinates and Their Graphs', id: 'Koordinat Kutub dan Grafiknya' },
      summary: {
        en: 'A point named by distance and angle, conversion to and from $(x,y)$, symmetry tests, and the standard families of polar curves.',
        id: 'Titik yang dinamai dengan jarak dan sudut, konversi dari dan ke $(x,y)$, uji simetri, dan keluarga baku kurva kutub.',
      },
      lessons: [
        {
          id: 'par-m2-s1-l1',
          title: { en: 'Locating a Point by Distance and Direction', id: 'Menentukan Titik dengan Jarak dan Arah' },
          goal: {
            en: 'Name a point as $(r,\\theta)$, recognize its many names, and convert points and equations between polar and Cartesian form.',
            id: 'Menamai titik sebagai $(r,\\theta)$, mengenali banyak namanya, dan mengonversi titik serta persamaan antara bentuk kutub dan Kartesius.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'One point, two numbers: distance and direction', id: 'Satu titik, dua bilangan: jarak dan arah' },
              body: {
                en: 'Instead of walking right and then up, give directions the way a lighthouse keeper would: turn to face a direction, then say how far away the ship is. Fix a point $O$, the **pole**, and a ray from it, the **polar axis** (the positive $x$-axis). A point $P$ is written $(r,\\theta)$, where $\\theta$ is the angle measured counterclockwise from the polar axis and $r$ is the distance from the pole in that direction.\n\nUnlike $(x,y)$, a point has **many** polar names:\n\n- $(r,\\theta)$ and $(r,\\theta+2\\pi k)$ are the same point for every integer $k$, since a full turn changes nothing.\n- $(-r,\\theta)$ is the point at distance $r$ in the **opposite** direction, so $(-r,\\theta)=(r,\\theta+\\pi)$.\n- The pole itself is $(0,\\theta)$ for every $\\theta$.\n\nDrag both sliders: the dashed circle holds every point with the same $r$, and the arc marks the angle $\\theta$.',
                id: 'Alih-alih berjalan ke kanan lalu ke atas, beri petunjuk arah seperti penjaga mercusuar: menghadaplah ke satu arah, lalu sebutkan seberapa jauh kapalnya. Tetapkan sebuah titik $O$, yaitu **kutub**, dan sebuah sinar darinya, yaitu **sumbu kutub** (sumbu-$x$ positif). Sebuah titik $P$ ditulis $(r,\\theta)$, dengan $\\theta$ sudut yang diukur berlawanan arah jarum jam dari sumbu kutub dan $r$ jarak dari kutub ke arah itu.\n\nTidak seperti $(x,y)$, sebuah titik punya **banyak** nama kutub:\n\n- $(r,\\theta)$ dan $(r,\\theta+2\\pi k)$ adalah titik yang sama untuk setiap bilangan bulat $k$, sebab satu putaran penuh tidak mengubah apa pun.\n- $(-r,\\theta)$ adalah titik berjarak $r$ ke arah **berlawanan**, sehingga $(-r,\\theta)=(r,\\theta+\\pi)$.\n- Kutub itu sendiri adalah $(0,\\theta)$ untuk setiap $\\theta$.\n\nGeser kedua penggeser: lingkaran putus-putus memuat semua titik dengan $r$ yang sama, dan busurnya menandai sudut $\\theta$.',
              },
              figure: {
                dim: 2,
                polar: true,
                xSpan: [-3.5, 3.5],
                ySpan: [-3.5, 3.5],
                ticks: true,
                params: [
                  { name: 'a', min: 0.5, max: 3, step: 0.25, value: 2.5, label: 'r' },
                  { name: 'phi', min: 0, max: 6.28, step: 0.05, value: 1, label: 'θ' },
                ],
                items: [
                  { t: 'polar', r: 'a', from: 0, to: 6.2832, color: 'muted', dashed: true },
                  { t: 'param', x: 't*a*cos(phi)', y: 't*a*sin(phi)', from: 0, to: 1, color: 'a', label: 'r' },
                  { t: 'polar', r: '0.6', from: 0, to: 'phi', color: 'result', label: 'θ' },
                  { t: 'dot', x: 'a*cos(phi)', y: 'a*sin(phi)', color: 'b', label: 'P' },
                ],
                caption: {
                  en: 'The point $P=(r,\\theta)$ sits on the ray at angle $\\theta$, a distance $r$ from the pole. Drag $r$ to move along the ray and $\\theta$ to turn the ray — the dashed circle is the path of $P$ when only $\\theta$ changes.',
                  id: 'Titik $P=(r,\\theta)$ berada pada sinar bersudut $\\theta$, berjarak $r$ dari kutub. Geser $r$ untuk bergerak sepanjang sinar dan $\\theta$ untuk memutar sinarnya — lingkaran putus-putus adalah lintasan $P$ ketika hanya $\\theta$ yang berubah.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Moving between (r, θ) and (x, y)', id: 'Berpindah antara (r, θ) dan (x, y)' },
              body: {
                en: 'Lay the polar axis along the positive $x$-axis and both systems share one picture. The right triangle formed by the pole, $P$, and the foot of the perpendicular to the $x$-axis has hypotenuse $r$ and angle $\\theta$, and that gives every conversion at once:\n\n| Direction | Formulas |\n|---|---|\n| Polar to Cartesian | $x=r\\cos\\theta$, $y=r\\sin\\theta$ |\n| Cartesian to polar | $r^2=x^2+y^2$, $\\tan\\theta=\\dfrac{y}{x}$ |\n\nOne warning about $\\tan\\theta=y/x$: it cannot tell $(1,1)$ from $(-1,-1)$, since both give $y/x=1$. Pick $\\theta$ from the quadrant of $(x,y)$, not from the calculator alone.\n\nThe same formulas convert whole equations. $r=2$ becomes $x^2+y^2=4$, a circle about the pole; $r\\cos\\theta=3$ is just the vertical line $x=3$; and $r=2\\cos\\theta$ is a circle through the pole, which you can see by multiplying both sides by $r$ before substituting.',
                id: 'Letakkan sumbu kutub sepanjang sumbu-$x$ positif dan kedua sistem berbagi satu gambar. Segitiga siku-siku yang dibentuk kutub, $P$, dan kaki garis tegak lurus ke sumbu-$x$ punya sisi miring $r$ dan sudut $\\theta$, dan itu memberi semua konversi sekaligus:\n\n| Arah | Rumus |\n|---|---|\n| Kutub ke Kartesius | $x=r\\cos\\theta$, $y=r\\sin\\theta$ |\n| Kartesius ke kutub | $r^2=x^2+y^2$, $\\tan\\theta=\\dfrac{y}{x}$ |\n\nSatu peringatan soal $\\tan\\theta=y/x$: ia tak bisa membedakan $(1,1)$ dari $(-1,-1)$, sebab keduanya memberi $y/x=1$. Pilih $\\theta$ dari kuadran $(x,y)$, bukan dari kalkulator saja.\n\nRumus yang sama mengonversi persamaan utuh. $r=2$ menjadi $x^2+y^2=4$, lingkaran terhadap kutub; $r\\cos\\theta=3$ hanyalah garis tegak $x=3$; dan $r=2\\cos\\theta$ adalah lingkaran yang melalui kutub, yang terlihat dengan mengalikan kedua ruas dengan $r$ sebelum menyubstitusi.',
              },
              figure: {
                dim: 2,
                polar: true,
                xSpan: [-3.5, 3.5],
                ySpan: [-3.5, 3.5],
                ticks: true,
                items: [
                  { t: 'polar', r: '2', from: 0, to: 6.2832, color: 'a', label: 'r = 2' },
                  { t: 'vline', x: 3, color: 'b', label: 'r cos θ = 3' },
                  { t: 'polar', r: '2*cos(theta)', from: 0, to: 3.1416, color: 'result', label: 'r = 2 cos θ' },
                ],
                caption: {
                  en: 'Three equations, three shapes: $r=2$ is a circle about the pole, $r\\cos\\theta=3$ is the vertical line $x=3$, and $r=2\\cos\\theta$ is a circle of radius $1$ that passes through the pole.',
                  id: 'Tiga persamaan, tiga bentuk: $r=2$ adalah lingkaran terhadap kutub, $r\\cos\\theta=3$ adalah garis tegak $x=3$, dan $r=2\\cos\\theta$ adalah lingkaran berjari-jari $1$ yang melalui kutub.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which of these is **not** another name for the point $(2,\\tfrac{\\pi}{6})$?',
                id: 'Manakah di antara ini yang **bukan** nama lain untuk titik $(2,\\tfrac{\\pi}{6})$?',
              },
              options: [
                { en: '$(-2,\\tfrac{\\pi}{6})$', id: '$(-2,\\tfrac{\\pi}{6})$' },
                { en: '$(2,\\tfrac{13\\pi}{6})$', id: '$(2,\\tfrac{13\\pi}{6})$' },
                { en: '$(-2,\\tfrac{7\\pi}{6})$', id: '$(-2,\\tfrac{7\\pi}{6})$' },
                { en: '$(2,-\\tfrac{11\\pi}{6})$', id: '$(2,-\\tfrac{11\\pi}{6})$' },
              ],
              answer: 0,
              explain: {
                en: 'A negative $r$ means walking the same distance backward, so $(-2,\\tfrac{\\pi}{6})$ lands on the opposite side of the pole. The others differ from $(2,\\tfrac{\\pi}{6})$ by a full turn or by a half turn paired with a sign change.',
                id: '$r$ negatif berarti berjalan sejauh yang sama ke belakang, sehingga $(-2,\\tfrac{\\pi}{6})$ mendarat di sisi seberang kutub. Yang lain berbeda dari $(2,\\tfrac{\\pi}{6})$ sebesar satu putaran penuh atau setengah putaran yang dipasangkan dengan pergantian tanda.',
              },
              hint: {
                en: 'Test each option: add or subtract full turns, and when $r$ changes sign, check whether the angle moved by exactly half a turn.',
                id: 'Uji tiap pilihan: tambah atau kurangi putaran penuh, dan ketika $r$ berganti tanda, periksa apakah sudutnya bergeser tepat setengah putaran.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Read the point $P$ in the figure. Which pair names it?',
                id: 'Baca titik $P$ pada gambar. Pasangan mana yang menamainya?',
              },
              figure: {
                dim: 2,
                polar: true,
                xSpan: [-3.5, 3.5],
                ySpan: [-3.5, 3.5],
                ticks: true,
                items: [{ t: 'dot', x: -2.598, y: 1.5, color: 'b', label: 'P' }],
                caption: {
                  en: 'A point on the polar grid: the circles mark the distance from the pole and the rays are drawn every $30^\\circ$.',
                  id: 'Sebuah titik pada kisi kutub: lingkarannya menandai jarak dari kutub dan sinarnya digambar setiap $30^\\circ$.',
                },
              },
              options: [
                { en: '$(3,\\tfrac{5\\pi}{6})$', id: '$(3,\\tfrac{5\\pi}{6})$' },
                { en: '$(3,\\tfrac{\\pi}{6})$', id: '$(3,\\tfrac{\\pi}{6})$' },
                { en: '$(-3,\\tfrac{5\\pi}{6})$', id: '$(-3,\\tfrac{5\\pi}{6})$' },
                { en: '$(3,\\tfrac{7\\pi}{6})$', id: '$(3,\\tfrac{7\\pi}{6})$' },
              ],
              answer: 0,
              explain: {
                en: '$P$ lies on the third circle, so $r=3$, and on the ray $150^\\circ=\\tfrac{5\\pi}{6}$ from the polar axis, in the second quadrant.',
                id: '$P$ berada pada lingkaran ketiga, sehingga $r=3$, dan pada sinar $150^\\circ=\\tfrac{5\\pi}{6}$ dari sumbu kutub, di kuadran kedua.',
              },
              hint: {
                en: 'Read the distance from the circle the dot sits on, then count the rays counterclockwise from the polar axis. Watch which quadrant the dot is in.',
                id: 'Baca jarak dari lingkaran tempat titik berada, lalu hitung sinarnya berlawanan arah jarum jam dari sumbu kutub. Perhatikan di kuadran mana titik itu berada.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the steps that turn $r=2\\cos\\theta$ into a Cartesian equation.',
                id: 'Susun langkah yang mengubah $r=2\\cos\\theta$ menjadi persamaan Kartesius.',
              },
              lines: [
                'r = 2\\cos\\theta',
                'r^2 = 2r\\cos\\theta',
                'x^2+y^2 = 2x',
                '(x-1)^2+y^2 = 1',
              ],
              explain: {
                en: 'Multiplying by $r$ makes both $r^2$ and $r\\cos\\theta$ appear, so each can be replaced; completing the square then reveals the circle with center $(1,0)$ and radius $1$.',
                id: 'Mengalikan dengan $r$ memunculkan $r^2$ dan $r\\cos\\theta$ sekaligus, sehingga masing-masing bisa diganti; melengkapkan kuadrat lalu menampakkan lingkaran berpusat $(1,0)$ dan berjari-jari $1$.',
              },
              hint: {
                en: 'You cannot replace $\\cos\\theta$ alone by $x$; first make the combination $r\\cos\\theta$ appear. Completing the square comes last.',
                id: '$\\cos\\theta$ sendirian tak bisa diganti dengan $x$; munculkan dulu kombinasi $r\\cos\\theta$. Melengkapkan kuadrat dilakukan paling akhir.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Convert the polar point $(r,\\theta)=(4,\\tfrac{5\\pi}{6})$ to Cartesian coordinates.',
                id: 'Konversikan titik kutub $(r,\\theta)=(4,\\tfrac{5\\pi}{6})$ ke koordinat Kartesius.',
              },
              blanks: [
                { label: 'x =', answer: -2 * Math.sqrt(3) },
                { label: 'y =', answer: 2 },
              ],
              hints: [
                { en: 'Use $x=r\\cos\\theta$ and $y=r\\sin\\theta$ with $\\theta=150^\\circ$; cosine is negative in the second quadrant.', id: 'Pakai $x=r\\cos\\theta$ dan $y=r\\sin\\theta$ dengan $\\theta=150^\\circ$; cosinus negatif di kuadran kedua.' },
                { en: '$\\cos\\tfrac{5\\pi}{6}=-\\tfrac{\\sqrt3}{2}$ and $\\sin\\tfrac{5\\pi}{6}=\\tfrac12$. You may type `-2sqrt(3)`.', id: '$\\cos\\tfrac{5\\pi}{6}=-\\tfrac{\\sqrt3}{2}$ dan $\\sin\\tfrac{5\\pi}{6}=\\tfrac12$. Kamu boleh mengetik `-2sqrt(3)`.' },
              ],
              explain: {
                en: '$x=4\\cdot(-\\tfrac{\\sqrt3}{2})=-2\\sqrt3\\approx-3.46$ and $y=4\\cdot\\tfrac12=2$, a point in the second quadrant, matching its angle.',
                id: '$x=4\\cdot(-\\tfrac{\\sqrt3}{2})=-2\\sqrt3\\approx-3{,}46$ dan $y=4\\cdot\\tfrac12=2$, sebuah titik di kuadran kedua, sesuai sudutnya.',
              },
            },
          ],
        },
        {
          id: 'par-m2-s1-l2',
          title: { en: 'Graphing Polar Equations', id: 'Menggambar Persamaan Kutub' },
          goal: {
            en: 'Use symmetry tests and recognize the standard polar families: circles, limaçons, roses, lemniscates, and spirals.',
            id: 'Memakai uji simetri dan mengenali keluarga kutub baku: lingkaran, limaçon, mawar, lemniskat, dan spiral.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Symmetry first, plotting second', id: 'Simetri dahulu, menggambar kemudian' },
              body: {
                en: 'A polar equation is plotted by choosing angles and computing $r$, and symmetry cuts that work in half. Replace a point by its mirror image; if the equation still holds, the curve is symmetric:\n\n- **About the $x$-axis:** replacing $\\theta$ by $-\\theta$ leaves the equation unchanged, as in $r=2+\\cos\\theta$.\n- **About the $y$-axis:** replacing $\\theta$ by $\\pi-\\theta$ leaves it unchanged, as in $r=2+\\sin\\theta$.\n- **About the pole:** replacing $r$ by $-r$, or $\\theta$ by $\\theta+\\pi$, leaves it unchanged, as in $r^2=4\\cos2\\theta$.\n\nPassing a test proves symmetry, but failing one proves nothing, because a single point has many names. Try the substitutions, then plot only the part of the curve the symmetry does not already give you.',
                id: 'Persamaan kutub digambar dengan memilih sudut dan menghitung $r$, dan simetri memotong pekerjaan itu menjadi separuh. Ganti sebuah titik dengan bayangan cerminnya; jika persamaannya masih berlaku, kurvanya simetris:\n\n- **Terhadap sumbu-$x$:** mengganti $\\theta$ dengan $-\\theta$ tidak mengubah persamaan, seperti pada $r=2+\\cos\\theta$.\n- **Terhadap sumbu-$y$:** mengganti $\\theta$ dengan $\\pi-\\theta$ tidak mengubahnya, seperti pada $r=2+\\sin\\theta$.\n- **Terhadap kutub:** mengganti $r$ dengan $-r$, atau $\\theta$ dengan $\\theta+\\pi$, tidak mengubahnya, seperti pada $r^2=4\\cos2\\theta$.\n\nLulus satu uji membuktikan simetri, tetapi gagal satu uji tidak membuktikan apa-apa, karena satu titik punya banyak nama. Coba penggantian itu, lalu gambar hanya bagian kurva yang belum diberikan oleh simetrinya.',
              },
              figure: {
                dim: 2,
                polar: true,
                xSpan: [-3.5, 3.5],
                ySpan: [-3.5, 3.5],
                ticks: true,
                items: [{ t: 'polar', r: 'sqrt(4*cos(2*theta))', from: 0, to: 6.2832, color: 'a', label: 'r² = 4 cos 2θ' }],
                caption: {
                  en: 'The lemniscate $r^2=4\\cos2\\theta$ passes all three tests: it is mirror-symmetric about both axes and unchanged by a half turn about the pole.',
                  id: 'Lemniskat $r^2=4\\cos2\\theta$ lulus ketiga uji: ia simetris cermin terhadap kedua sumbu dan tak berubah oleh setengah putaran terhadap kutub.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The standard families', id: 'Keluarga baku' },
              body: {
                en: 'A handful of equations produce almost every polar curve you will meet. Learn them as families, with the constants $a,b,n$ as controls:\n\n| Family | Equation | Shape |\n|---|---|---|\n| Circle about the pole | $r=a$ | circle of radius $a$ |\n| Circle through the pole | $r=2a\\cos\\theta$ or $r=2a\\sin\\theta$ | circle of radius $a$ on an axis |\n| Limaçon | $r=a+b\\cos\\theta$ or $r=a+b\\sin\\theta$ | looped or heart-like curve |\n| Rose | $r=a\\cos n\\theta$ or $r=a\\sin n\\theta$ | petals around the pole |\n| Lemniscate | $r^2=a^2\\cos2\\theta$ | figure-eight |\n| Archimedean spiral | $r=\\theta$ | winds steadily outward |\n\nFor a limaçon with $a,b>0$, the shape is decided by comparing $a$ with $b$:\n\n- $a\\ge 2b$: a smooth, convex oval.\n- $b<a<2b$: an oval with a dimple on the side facing the pole.\n- $a=b$: a **cardioid**, a heart with a cusp at the pole.\n- $a<b$: a curve with an inner loop, where $r$ turns negative.\n\nIn the figure, $a$ is fixed at $1$; sweep $b$ through the four cases.',
                id: 'Segelintir persamaan menghasilkan hampir semua kurva kutub yang akan kamu temui. Pelajari sebagai keluarga, dengan konstanta $a,b,n$ sebagai pengendali:\n\n| Keluarga | Persamaan | Bentuk |\n|---|---|---|\n| Lingkaran terhadap kutub | $r=a$ | lingkaran berjari-jari $a$ |\n| Lingkaran melalui kutub | $r=2a\\cos\\theta$ atau $r=2a\\sin\\theta$ | lingkaran berjari-jari $a$ pada sebuah sumbu |\n| Limaçon | $r=a+b\\cos\\theta$ atau $r=a+b\\sin\\theta$ | kurva bersimpul atau mirip hati |\n| Mawar | $r=a\\cos n\\theta$ atau $r=a\\sin n\\theta$ | kelopak di sekitar kutub |\n| Lemniskat | $r^2=a^2\\cos2\\theta$ | angka delapan |\n| Spiral Archimedes | $r=\\theta$ | melilit keluar secara tetap |\n\nUntuk limaçon dengan $a,b>0$, bentuknya ditentukan dengan membandingkan $a$ dengan $b$:\n\n- $a\\ge 2b$: oval mulus yang cembung.\n- $b<a<2b$: oval dengan lekukan di sisi yang menghadap kutub.\n- $a=b$: **kardioid**, hati dengan ujung runcing di kutub.\n- $a<b$: kurva dengan simpul dalam, tempat $r$ menjadi negatif.\n\nPada gambar, $a$ ditetapkan $1$; geser $b$ melewati keempat kasus.',
              },
              figure: {
                dim: 2,
                polar: true,
                xSpan: [-3.5, 3.5],
                ySpan: [-3.5, 3.5],
                ticks: true,
                params: [{ name: 'b', min: 0, max: 2.4, step: 0.1, value: 0.7, label: 'b' }],
                items: [{ t: 'polar', r: '1+b*cos(theta)', from: 0, to: 6.2832, color: 'a', label: 'r = 1 + b cos θ' }],
                caption: {
                  en: 'The limaçon $r=1+b\\cos\\theta$. Drag $b$ from $0$ upward: a circle, then an oval with a dimple once $b>\\tfrac12$, a cardioid at $b=1$, and an inner loop beyond.',
                  id: 'Limaçon $r=1+b\\cos\\theta$. Geser $b$ dari $0$ ke atas: lingkaran, lalu oval berlekuk begitu $b>\\tfrac12$, kardioid pada $b=1$, dan simpul dalam sesudahnya.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Roses and counting petals', id: 'Mawar dan menghitung kelopak' },
              body: {
                en: 'The rose $r=a\\cos n\\theta$ has a petal tip each time $|\\cos n\\theta|=1$, and $a$ only sets its size. What matters is the whole number $n$:\n\n- **$n$ odd:** exactly $n$ petals, and the curve closes after $\\theta$ runs through $[0,\\pi]$.\n- **$n$ even:** $2n$ petals, and the curve closes only after $[0,2\\pi]$.\n- $r=a\\sin n\\theta$ gives the same rose, turned by $\\pi/2n$.\n\nThe reason is the sign of $r$. For even $n$ the stretches with $r<0$ land in the gaps between the petals, doubling the count; for odd $n$ they land exactly on top of petals already drawn.',
                id: 'Mawar $r=a\\cos n\\theta$ punya ujung kelopak setiap kali $|\\cos n\\theta|=1$, dan $a$ hanya menentukan ukurannya. Yang penting adalah bilangan bulat $n$:\n\n- **$n$ ganjil:** tepat $n$ kelopak, dan kurvanya menutup setelah $\\theta$ melewati $[0,\\pi]$.\n- **$n$ genap:** $2n$ kelopak, dan kurvanya menutup baru setelah $[0,2\\pi]$.\n- $r=a\\sin n\\theta$ memberi mawar yang sama, diputar sebesar $\\pi/2n$.\n\nAlasannya adalah tanda $r$. Untuk $n$ genap, bagian dengan $r<0$ mendarat di celah antar kelopak, menggandakan jumlahnya; untuk $n$ ganjil, bagian itu mendarat tepat di atas kelopak yang sudah tergambar.',
              },
              figure: {
                dim: 2,
                polar: true,
                xSpan: [-3.5, 3.5],
                ySpan: [-3.5, 3.5],
                ticks: true,
                params: [{ name: 'n', min: 1, max: 6, step: 1, value: 3, label: 'n' }],
                items: [{ t: 'polar', r: '3*cos(n*theta)', from: 0, to: 6.2832, color: 'a', label: 'r = 3 cos nθ' }],
                caption: {
                  en: 'The rose $r=3\\cos n\\theta$. Step $n$ from $1$ to $6$ and count the petals: $1,4,3,8,5,12$ — the count jumps to $2n$ every time $n$ is even.',
                  id: 'Mawar $r=3\\cos n\\theta$. Naikkan $n$ dari $1$ ke $6$ dan hitung kelopaknya: $1,4,3,8,5,12$ — jumlahnya melompat menjadi $2n$ setiap kali $n$ genap.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which curve passes the test for symmetry about the $x$-axis, replacing $\\theta$ by $-\\theta$?',
                id: 'Kurva mana yang lulus uji simetri terhadap sumbu-$x$ dengan mengganti $\\theta$ oleh $-\\theta$?',
              },
              options: [
                { en: '$r=3+2\\cos\\theta$', id: '$r=3+2\\cos\\theta$' },
                { en: '$r=3+2\\sin\\theta$', id: '$r=3+2\\sin\\theta$' },
                { en: '$r=\\theta$', id: '$r=\\theta$' },
                { en: '$r=2\\sin\\theta$', id: '$r=2\\sin\\theta$' },
              ],
              answer: 0,
              explain: {
                en: 'Cosine is an even function, $\\cos(-\\theta)=\\cos\\theta$, so the equation is unchanged. Replacing $\\theta$ by $-\\theta$ flips the sign of $\\sin\\theta$ and of $\\theta$ itself, changing the other equations.',
                id: 'Cosinus adalah fungsi genap, $\\cos(-\\theta)=\\cos\\theta$, sehingga persamaannya tak berubah. Mengganti $\\theta$ dengan $-\\theta$ membalik tanda $\\sin\\theta$ dan $\\theta$ itu sendiri, sehingga persamaan lainnya berubah.',
              },
              hint: {
                en: 'Substitute $-\\theta$ in each equation and ask which function gives back exactly the same value.',
                id: 'Substitusikan $-\\theta$ ke tiap persamaan dan tanyakan fungsi mana yang memberi nilai yang persis sama.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Which equation draws the rose in the figure?',
                id: 'Persamaan mana yang menggambar mawar pada gambar?',
              },
              figure: {
                dim: 2,
                polar: true,
                xSpan: [-3.5, 3.5],
                ySpan: [-3.5, 3.5],
                ticks: true,
                items: [{ t: 'polar', r: '3*cos(4*theta)', from: 0, to: 6.2832, color: 'a' }],
                caption: {
                  en: 'A rose drawn for $0\\le\\theta\\le2\\pi$; one petal tip points along the polar axis.',
                  id: 'Sebuah mawar yang digambar untuk $0\\le\\theta\\le2\\pi$; satu ujung kelopak menunjuk sepanjang sumbu kutub.',
                },
              },
              options: [
                { en: '$r=3\\cos4\\theta$', id: '$r=3\\cos4\\theta$' },
                { en: '$r=3\\cos8\\theta$', id: '$r=3\\cos8\\theta$' },
                { en: '$r=3\\cos2\\theta$', id: '$r=3\\cos2\\theta$' },
                { en: '$r=3\\cos3\\theta$', id: '$r=3\\cos3\\theta$' },
              ],
              answer: 0,
              explain: {
                en: 'The figure has $8$ petals, an even count, so $2n=8$ and $n=4$. The radius reaches $3$, matching the amplitude $a=3$.',
                id: 'Gambar itu punya $8$ kelopak, jumlah genap, sehingga $2n=8$ dan $n=4$. Jari-jarinya mencapai $3$, sesuai amplitudo $a=3$.',
              },
              hint: {
                en: 'Count the petals first, then decide whether the count equals $n$ or $2n$.',
                id: 'Hitung kelopaknya lebih dulu, lalu tentukan apakah jumlahnya sama dengan $n$ atau $2n$.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the petal counts.',
                id: 'Lengkapi jumlah kelopaknya.',
              },
              template: {
                en: 'r=\\cos5\\theta: ___ \\text{ petals} \\qquad r=\\sin6\\theta: ___ \\text{ petals}',
                id: 'r=\\cos5\\theta: ___ \\text{ kelopak} \\qquad r=\\sin6\\theta: ___ \\text{ kelopak}',
              },
              blanks: ['5', '12'],
              explain: {
                en: 'An odd $n=5$ gives $5$ petals; an even $n=6$ gives $2n=12$.',
                id: '$n=5$ yang ganjil memberi $5$ kelopak; $n=6$ yang genap memberi $2n=12$.',
              },
              hint: {
                en: 'Check whether each $n$ is odd or even, then use the matching rule.',
                id: 'Periksa apakah tiap $n$ ganjil atau genap, lalu pakai aturan yang cocok.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Answer each question about these curves.',
                id: 'Jawab tiap pertanyaan tentang kurva-kurva ini.',
              },
              blanks: [
                { label: { en: '\\text{petals of } r=2\\sin8\\theta:', id: '\\text{kelopak } r=2\\sin8\\theta:' }, answer: 16 },
                { label: { en: '\\text{the } b \\text{ that makes } r=5+b\\cos\\theta \\text{ a cardioid } (b>0):', id: '\\text{nilai } b \\text{ yang membuat } r=5+b\\cos\\theta \\text{ kardioid } (b>0):' }, answer: 5 },
                { label: { en: '\\text{largest distance from the pole on } r^2=9\\cos2\\theta:', id: '\\text{jarak terjauh dari kutub pada } r^2=9\\cos2\\theta:' }, answer: 3 },
              ],
              hints: [
                { en: 'Even $n$ doubles the count. For a limaçon $a+b\\cos\\theta$, the cardioid is the borderline case between a dimple and an inner loop.', id: '$n$ genap menggandakan jumlahnya. Untuk limaçon $a+b\\cos\\theta$, kardioid adalah kasus batas antara lekukan dan simpul dalam.' },
                { en: 'On $r^2=9\\cos2\\theta$, the largest $r$ occurs when $\\cos2\\theta=1$.', id: 'Pada $r^2=9\\cos2\\theta$, $r$ terbesar terjadi ketika $\\cos2\\theta=1$.' },
              ],
              explain: {
                en: '$n=8$ is even, so $2n=16$ petals. A cardioid needs $a=b$, so $b=5$. And $r^2\\le 9$ means $r\\le 3$, reached at $\\theta=0$.',
                id: '$n=8$ genap, sehingga $2n=16$ kelopak. Kardioid memerlukan $a=b$, jadi $b=5$. Dan $r^2\\le 9$ berarti $r\\le 3$, tercapai pada $\\theta=0$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'par-m2-s1-p',
        runtime: 'math',
        title: { en: 'Converting and Recognizing Curves', id: 'Mengonversi dan Mengenali Kurva' },
        brief: {
          en: 'Two point conversions, one in each direction, and one equation converted from Cartesian to polar form.',
          id: 'Dua konversi titik, satu pada tiap arah, dan satu persamaan yang dikonversi dari bentuk Kartesius ke kutub.',
        },
        requirements: [
          { en: 'Use $x=r\\cos\\theta$, $y=r\\sin\\theta$, $r^2=x^2+y^2$, and $\\tan\\theta=y/x$.', id: 'Gunakan $x=r\\cos\\theta$, $y=r\\sin\\theta$, $r^2=x^2+y^2$, dan $\\tan\\theta=y/x$.' },
          { en: 'Choose $\\theta$ from the quadrant of the point, and type exact forms such as `3sqrt(3)` or `2pi/3`.', id: 'Pilih $\\theta$ dari kuadran titik itu, dan ketik bentuk eksak seperti `3sqrt(3)` atau `2pi/3`.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Convert the polar point $(r,\\theta)=(6,\\tfrac{2\\pi}{3})$ to Cartesian coordinates.',
              id: 'Konversikan titik kutub $(r,\\theta)=(6,\\tfrac{2\\pi}{3})$ ke koordinat Kartesius.',
            },
            blanks: [
              { label: 'x =', answer: -3 },
              { label: 'y =', answer: 3 * Math.sqrt(3) },
            ],
            solution: ['x=6\\cos\\tfrac{2\\pi}{3}=6\\cdot\\left(-\\tfrac12\\right)=-3', 'y=6\\sin\\tfrac{2\\pi}{3}=6\\cdot\\tfrac{\\sqrt3}{2}=3\\sqrt3'],
          },
          {
            prompt: {
              en: 'Convert the Cartesian point $(x,y)=(-2,\\,2\\sqrt3)$ to polar coordinates with $r>0$ and $0\\le\\theta<2\\pi$.',
              id: 'Konversikan titik Kartesius $(x,y)=(-2,\\,2\\sqrt3)$ ke koordinat kutub dengan $r>0$ dan $0\\le\\theta<2\\pi$.',
            },
            blanks: [
              { label: 'r =', answer: 4 },
              { label: '\\theta =', answer: (2 * Math.PI) / 3 },
            ],
            solution: ['r=\\sqrt{(-2)^2+(2\\sqrt3)^2}=\\sqrt{16}=4', '\\tan\\theta=\\dfrac{2\\sqrt3}{-2}=-\\sqrt3,\\quad x<0,\\ y>0\\ \\Rightarrow\\ \\theta=\\tfrac{2\\pi}{3}'],
          },
          {
            prompt: {
              en: 'The equation $x^2+y^2=4x$ describes a circle. Write it in polar form $r=\\ldots$ as an expression in $\\theta$, and give the circle\'s radius.',
              id: 'Persamaan $x^2+y^2=4x$ menggambarkan sebuah lingkaran. Tuliskan dalam bentuk kutub $r=\\ldots$ sebagai ekspresi dalam $\\theta$, dan berikan jari-jari lingkaran itu.',
            },
            blanks: [
              { label: 'r =', formula: '4*cos(theta)', variable: 'theta', domain: [-3, 3] },
              { label: { en: '\\text{radius} =', id: '\\text{jari-jari} =' }, answer: 2 },
            ],
            solution: ['r^2=4r\\cos\\theta\\ \\Rightarrow\\ r=4\\cos\\theta', 'x^2-4x+y^2=0\\ \\Rightarrow\\ (x-2)^2+y^2=2^2'],
          },
        ],
        hints: [
          { en: 'For the point in the second quadrant, the calculator\'s $\\arctan$ lands in the fourth; add $\\pi$ to bring it back.', id: 'Untuk titik di kuadran kedua, $\\arctan$ pada kalkulator mendarat di kuadran keempat; tambahkan $\\pi$ untuk mengembalikannya.' },
          { en: 'For part 3, replace $x^2+y^2$ by $r^2$ and $x$ by $r\\cos\\theta$, then divide by $r$.', id: 'Untuk butir 3, ganti $x^2+y^2$ dengan $r^2$ dan $x$ dengan $r\\cos\\theta$, lalu bagi dengan $r$.' },
        ],
        xp: 50,
      },
    },

    /* ------------------------------------------------ 10.5 areas and lengths in polar coordinates */
    {
      id: 'par-m2-s2',
      title: { en: 'Calculus in Polar Coordinates', id: 'Kalkulus dalam Koordinat Kutub' },
      summary: {
        en: 'The area swept out by a rotating radius, the area between two polar curves, and the length of a polar curve, with its tangent slope.',
        id: 'Luas yang disapu sebuah jari-jari yang berputar, luas di antara dua kurva kutub, dan panjang sebuah kurva kutub, beserta kemiringan garis singgungnya.',
      },
      lessons: [
        {
          id: 'par-m2-s2-l1',
          title: { en: 'Area Swept by a Radius', id: 'Luas yang Disapu oleh Jari-jari' },
          goal: {
            en: 'Compute areas enclosed by polar curves and between two polar curves with $A=\\tfrac12\\int r^2\\,d\\theta$.',
            id: 'Menghitung luas yang dibatasi kurva kutub dan di antara dua kurva kutub dengan $A=\\tfrac12\\int r^2\\,d\\theta$.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Adding up thin sectors', id: 'Menjumlahkan sektor tipis' },
              body: {
                en: 'A strip under $y=f(x)$ is a thin rectangle. In polar coordinates the natural slice is a thin **sector**, a piece of pie between two rays with its tip at the pole. A sector of radius $r$ and angle $\\Delta\\theta$ is the fraction $\\Delta\\theta/2\\pi$ of a disc, so its area is\n$$\\frac{\\Delta\\theta}{2\\pi}\\cdot\\pi r^2=\\tfrac12\\,r^2\\,\\Delta\\theta$$\nCut the region swept by $r=f(\\theta)$, for $\\alpha\\le\\theta\\le\\beta$, into $n$ sectors of angle $\\Delta\\theta$, take $r_i=f(\\theta_i^*)$ in each, and add. The Riemann sum $\\sum\\tfrac12 r_i^2\\,\\Delta\\theta$ becomes an integral as $n\\to\\infty$:\n$$A=\\int_\\alpha^\\beta\\tfrac12\\,r^2\\,d\\theta=\\tfrac12\\int_\\alpha^\\beta f(\\theta)^2\\,d\\theta$$\nThe radius is **squared**, and the sweep should not overlap itself, so keep $\\beta-\\alpha\\le2\\pi$. Drag $\\phi$ to move the upper limit and watch the shaded region grow.',
                id: 'Sebuah pita di bawah $y=f(x)$ adalah persegi panjang tipis. Dalam koordinat kutub, irisan alaminya adalah **sektor** tipis, sepotong pai di antara dua sinar dengan ujung di kutub. Sebuah sektor berjari-jari $r$ dan bersudut $\\Delta\\theta$ adalah pecahan $\\Delta\\theta/2\\pi$ dari sebuah cakram, sehingga luasnya\n$$\\frac{\\Delta\\theta}{2\\pi}\\cdot\\pi r^2=\\tfrac12\\,r^2\\,\\Delta\\theta$$\nPotong daerah yang disapu $r=f(\\theta)$, untuk $\\alpha\\le\\theta\\le\\beta$, menjadi $n$ sektor bersudut $\\Delta\\theta$, ambil $r_i=f(\\theta_i^*)$ pada tiap sektor, lalu jumlahkan. Jumlah Riemann $\\sum\\tfrac12 r_i^2\\,\\Delta\\theta$ menjadi integral ketika $n\\to\\infty$:\n$$A=\\int_\\alpha^\\beta\\tfrac12\\,r^2\\,d\\theta=\\tfrac12\\int_\\alpha^\\beta f(\\theta)^2\\,d\\theta$$\nJari-jarinya **dikuadratkan**, dan sapuannya tak boleh bertumpuk, jadi jaga $\\beta-\\alpha\\le2\\pi$. Geser $\\phi$ untuk memindahkan batas atas dan lihat daerah yang diarsir tumbuh.',
              },
              figure: {
                dim: 2,
                polar: true,
                xSpan: [-2.5, 2.5],
                ySpan: [-2.5, 2.5],
                ticks: true,
                params: [{ name: 'phi', min: 0.1, max: 6.28, step: 0.05, value: 1.5, label: 'φ' }],
                items: [
                  { t: 'polar', r: '1+cos(theta)', from: 0, to: 6.2832, color: 'muted', dashed: true },
                  { t: 'polar', r: '1+cos(theta)', from: 0, to: 'phi', color: 'a', fill: true, label: 'r = 1 + cos θ' },
                  { t: 'dot', x: '(1+cos(phi))*cos(phi)', y: '(1+cos(phi))*sin(phi)', color: 'b' },
                ],
                caption: {
                  en: 'The shaded region is everything the radius of $r=1+\\cos\\theta$ sweeps out as $\\theta$ runs from $0$ to $\\phi$. Drag $\\phi$ to $2\\pi$ and the sectors fill the whole cardioid.',
                  id: 'Daerah yang diarsir adalah semua yang disapu jari-jari $r=1+\\cos\\theta$ ketika $\\theta$ berjalan dari $0$ sampai $\\phi$. Geser $\\phi$ ke $2\\pi$ dan sektornya memenuhi seluruh kardioid.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A cardioid, a circle, and a petal', id: 'Sebuah kardioid, lingkaran, dan kelopak' },
              body: {
                en: 'The cardioid $r=1+\\cos\\theta$ is traced once for $0\\le\\theta\\le2\\pi$. Using $\\cos^2\\theta=\\tfrac12+\\tfrac12\\cos2\\theta$, the cosine terms integrate to zero over a whole period:\n$$A=\\tfrac12\\int_0^{2\\pi}(1+\\cos\\theta)^2d\\theta=\\tfrac12\\int_0^{2\\pi}\\Big(\\tfrac32+2\\cos\\theta+\\tfrac12\\cos2\\theta\\Big)d\\theta=\\tfrac12\\cdot3\\pi=\\frac{3\\pi}{2}$$\nAs a sanity check, the circle $r=a$ gives $\\tfrac12\\int_0^{2\\pi}a^2\\,d\\theta=\\pi a^2$, the formula you already know.\n\nFor a rose, integrate one petal and multiply. A petal runs between two consecutive zeros of $r$: for $r=\\cos2\\theta$, between $\\theta=-\\tfrac\\pi4$ and $\\theta=\\tfrac\\pi4$. Integrating all the way around would also count petals that the curve retraces.',
                id: 'Kardioid $r=1+\\cos\\theta$ digambar sekali untuk $0\\le\\theta\\le2\\pi$. Dengan $\\cos^2\\theta=\\tfrac12+\\tfrac12\\cos2\\theta$, suku-suku cosinus terintegralkan menjadi nol sepanjang satu periode penuh:\n$$A=\\tfrac12\\int_0^{2\\pi}(1+\\cos\\theta)^2d\\theta=\\tfrac12\\int_0^{2\\pi}\\Big(\\tfrac32+2\\cos\\theta+\\tfrac12\\cos2\\theta\\Big)d\\theta=\\tfrac12\\cdot3\\pi=\\frac{3\\pi}{2}$$\nSebagai pemeriksaan, lingkaran $r=a$ memberi $\\tfrac12\\int_0^{2\\pi}a^2\\,d\\theta=\\pi a^2$, rumus yang sudah kamu kenal.\n\nUntuk mawar, integralkan satu kelopak lalu kalikan. Sebuah kelopak berjalan di antara dua nol $r$ yang berurutan: untuk $r=\\cos2\\theta$, di antara $\\theta=-\\tfrac\\pi4$ dan $\\theta=\\tfrac\\pi4$. Mengintegralkan sepanjang putaran penuh akan menghitung juga kelopak yang digambar ulang kurvanya.',
              },
              figure: {
                dim: 2,
                polar: true,
                xSpan: [-1.5, 1.5],
                ySpan: [-1.5, 1.5],
                ticks: true,
                items: [
                  { t: 'polar', r: 'cos(2*theta)', from: 0, to: 6.2832, color: 'muted', dashed: true },
                  { t: 'polar', r: 'cos(2*theta)', from: -0.7854, to: 0.7854, color: 'a', fill: true, label: 'one petal' },
                ],
                caption: {
                  en: 'One petal of $r=\\cos2\\theta$, swept as $\\theta$ goes from $-\\tfrac\\pi4$ to $\\tfrac\\pi4$, between two moments when $r$ is zero.',
                  id: 'Satu kelopak $r=\\cos2\\theta$, disapu ketika $\\theta$ berjalan dari $-\\tfrac\\pi4$ ke $\\tfrac\\pi4$, di antara dua saat $r$ bernilai nol.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Between two curves', id: 'Di antara dua kurva' },
              body: {
                en: 'For the region between an outer curve $r_{\\text{out}}$ and an inner curve $r_{\\text{in}}$, subtract the sectors:\n$$A=\\tfrac12\\int_\\alpha^\\beta\\big(r_{\\text{out}}^2-r_{\\text{in}}^2\\big)\\,d\\theta$$\nThe cardioid $r=1+\\cos\\theta$ and the circle $r=1$ meet where $1+\\cos\\theta=1$, at $\\theta=\\pm\\tfrac\\pi2$. Between those angles the cardioid is outside, so the area inside it and outside the circle is\n$$\\tfrac12\\int_{-\\pi/2}^{\\pi/2}\\big((1+\\cos\\theta)^2-1\\big)d\\theta=\\int_0^{\\pi/2}\\big(2\\cos\\theta+\\cos^2\\theta\\big)d\\theta=2+\\frac\\pi4$$\nA reliable routine:\n\n1. Sketch both curves and decide which is outer on which angles.\n2. Solve $r_1(\\theta)=r_2(\\theta)$ for the crossing angles.\n3. Check the pole separately: curves can both pass through it at different angles, which equating the $r$ values misses.\n4. Split the integral wherever the outer curve changes.',
                id: 'Untuk daerah di antara kurva luar $r_{\\text{out}}$ dan kurva dalam $r_{\\text{in}}$, kurangkan sektornya:\n$$A=\\tfrac12\\int_\\alpha^\\beta\\big(r_{\\text{out}}^2-r_{\\text{in}}^2\\big)\\,d\\theta$$\nKardioid $r=1+\\cos\\theta$ dan lingkaran $r=1$ bertemu di $1+\\cos\\theta=1$, yaitu $\\theta=\\pm\\tfrac\\pi2$. Di antara sudut itu kardioid berada di luar, sehingga luas di dalamnya dan di luar lingkaran adalah\n$$\\tfrac12\\int_{-\\pi/2}^{\\pi/2}\\big((1+\\cos\\theta)^2-1\\big)d\\theta=\\int_0^{\\pi/2}\\big(2\\cos\\theta+\\cos^2\\theta\\big)d\\theta=2+\\frac\\pi4$$\nRutinitas yang andal:\n\n1. Sketsa kedua kurva dan tentukan mana yang di luar pada sudut yang mana.\n2. Selesaikan $r_1(\\theta)=r_2(\\theta)$ untuk sudut perpotongannya.\n3. Periksa kutub secara terpisah: kedua kurva bisa melaluinya pada sudut berbeda, yang terlewat bila hanya menyamakan nilai $r$.\n4. Pecah integralnya di setiap tempat kurva luarnya berganti.',
              },
              figure: {
                dim: 2,
                polar: true,
                xSpan: [-2.5, 2.5],
                ySpan: [-2.5, 2.5],
                ticks: true,
                items: [
                  { t: 'polar', r: '1+cos(theta)', from: 0, to: 6.2832, color: 'a', label: 'r = 1 + cos θ' },
                  { t: 'polar', r: '1', from: 0, to: 6.2832, color: 'b', label: 'r = 1' },
                  { t: 'dot', x: 0, y: 1, color: 'result' },
                  { t: 'dot', x: 0, y: -1, color: 'result' },
                ],
                caption: {
                  en: 'The cardioid and the unit circle cross at $\\theta=\\pm\\tfrac\\pi2$ (the two dots). The region inside the cardioid and outside the circle lies to the right of the $y$-axis.',
                  id: 'Kardioid dan lingkaran satuan berpotongan di $\\theta=\\pm\\tfrac\\pi2$ (kedua titik). Daerah di dalam kardioid dan di luar lingkaran terletak di sebelah kanan sumbu-$y$.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why does the area formula contain $\\tfrac12r^2$?',
                id: 'Mengapa rumus luas memuat $\\tfrac12r^2$?',
              },
              options: [
                { en: 'A sector of radius $r$ and angle $\\Delta\\theta$ has area $\\tfrac12r^2\\Delta\\theta$', id: 'Sebuah sektor berjari-jari $r$ dan bersudut $\\Delta\\theta$ berluas $\\tfrac12r^2\\Delta\\theta$' },
                { en: 'A thin rectangle of height $r$ and width $d\\theta$ has area $r\\,d\\theta$', id: 'Persegi panjang tipis setinggi $r$ dan selebar $d\\theta$ berluas $r\\,d\\theta$' },
                { en: 'The radius changes at half the speed of the angle', id: 'Jari-jari berubah dengan separuh laju sudut' },
                { en: 'Only half of the curve is ever traced', id: 'Hanya separuh kurva yang pernah digambar' },
              ],
              answer: 0,
              explain: {
                en: 'The slices are sectors, not rectangles, and a sector is the fraction $\\Delta\\theta/2\\pi$ of the disc $\\pi r^2$, which simplifies to $\\tfrac12r^2\\Delta\\theta$.',
                id: 'Irisannya adalah sektor, bukan persegi panjang, dan sebuah sektor adalah pecahan $\\Delta\\theta/2\\pi$ dari cakram $\\pi r^2$, yang menyederhana menjadi $\\tfrac12r^2\\Delta\\theta$.',
              },
              hint: {
                en: 'Ask what shape one thin slice has when all its edges meet at the pole.',
                id: 'Tanyakan bentuk apa yang dimiliki satu irisan tipis ketika semua sisinya bertemu di kutub.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Which integral gives the area of the shaded region of the cardioid $r=1+\\cos\\theta$?',
                id: 'Integral mana yang memberi luas daerah yang diarsir pada kardioid $r=1+\\cos\\theta$?',
              },
              figure: {
                dim: 2,
                polar: true,
                xSpan: [-2.5, 2.5],
                ySpan: [-2.5, 2.5],
                ticks: true,
                items: [
                  { t: 'polar', r: '1+cos(theta)', from: 0, to: 6.2832, color: 'muted', dashed: true },
                  { t: 'polar', r: '1+cos(theta)', from: 0, to: 1.5708, color: 'a', fill: true },
                ],
                caption: {
                  en: 'The shaded part of the cardioid starts on the polar axis and ends on the $y$-axis.',
                  id: 'Bagian kardioid yang diarsir mulai dari sumbu kutub dan berakhir di sumbu-$y$.',
                },
              },
              options: [
                { en: '$\\tfrac12\\int_0^{\\pi/2}(1+\\cos\\theta)^2\\,d\\theta$', id: '$\\tfrac12\\int_0^{\\pi/2}(1+\\cos\\theta)^2\\,d\\theta$' },
                { en: '$\\int_0^{\\pi/2}(1+\\cos\\theta)^2\\,d\\theta$', id: '$\\int_0^{\\pi/2}(1+\\cos\\theta)^2\\,d\\theta$' },
                { en: '$\\tfrac12\\int_0^{\\pi}(1+\\cos\\theta)^2\\,d\\theta$', id: '$\\tfrac12\\int_0^{\\pi}(1+\\cos\\theta)^2\\,d\\theta$' },
                { en: '$\\tfrac12\\int_0^{\\pi/2}(1+\\cos\\theta)\\,d\\theta$', id: '$\\tfrac12\\int_0^{\\pi/2}(1+\\cos\\theta)\\,d\\theta$' },
              ],
              answer: 0,
              explain: {
                en: 'The region is swept from the ray $\\theta=0$ to the ray $\\theta=\\tfrac\\pi2$, and the integrand is $\\tfrac12r^2$ with $r=1+\\cos\\theta$ squared.',
                id: 'Daerah itu disapu dari sinar $\\theta=0$ ke sinar $\\theta=\\tfrac\\pi2$, dan integrannya adalah $\\tfrac12r^2$ dengan $r=1+\\cos\\theta$ dikuadratkan.',
              },
              hint: {
                en: 'Read both bounding rays off the figure, then check the integrand for the factor $\\tfrac12$ and for the square.',
                id: 'Baca kedua sinar pembatas dari gambar, lalu periksa integrannya untuk faktor $\\tfrac12$ dan untuk kuadratnya.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the steps that find the area of one petal of $r=\\cos2\\theta$.',
                id: 'Susun langkah yang mencari luas satu kelopak $r=\\cos2\\theta$.',
              },
              lines: [
                'A = \\tfrac12\\int_{-\\pi/4}^{\\pi/4}\\cos^2 2\\theta\\,d\\theta',
                '= \\tfrac12\\int_{-\\pi/4}^{\\pi/4}\\tfrac{1+\\cos4\\theta}{2}\\,d\\theta',
                '= \\tfrac14\\Big[\\theta+\\tfrac14\\sin4\\theta\\Big]_{-\\pi/4}^{\\pi/4}',
                '= \\tfrac14\\cdot\\tfrac{\\pi}{2}',
                '= \\tfrac{\\pi}{8}',
              ],
              explain: {
                en: 'Set up $\\tfrac12\\int r^2$ between the zeros of $r$, use the double-angle identity to lower the power, then evaluate; the $\\sin4\\theta$ term vanishes at both ends.',
                id: 'Susun $\\tfrac12\\int r^2$ di antara nol-nol $r$, pakai identitas sudut ganda untuk menurunkan pangkat, lalu evaluasi; suku $\\sin4\\theta$ lenyap di kedua ujung.',
              },
              hint: {
                en: 'Write the integral first, lower the power of the cosine next, find the antiderivative, and only then substitute the limits.',
                id: 'Tulis integralnya dulu, turunkan pangkat cosinus berikutnya, cari antiturunannya, dan baru kemudian substitusikan batasnya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'The rose $r=2\\cos3\\theta$ has three petals. Find the area of one petal and of the whole rose.',
                id: 'Mawar $r=2\\cos3\\theta$ punya tiga kelopak. Cari luas satu kelopak dan luas seluruh mawar.',
              },
              blanks: [
                { label: { en: '\\text{one petal} =', id: '\\text{satu kelopak} =' }, answer: Math.PI / 3 },
                { label: { en: '\\text{whole rose} =', id: '\\text{seluruh mawar} =' }, answer: Math.PI },
              ],
              hints: [
                { en: 'One petal runs from $\\theta=-\\tfrac\\pi6$ to $\\theta=\\tfrac\\pi6$, where $r$ is between zeros. Use $\\cos^2 3\\theta=\\tfrac12(1+\\cos6\\theta)$.', id: 'Satu kelopak berjalan dari $\\theta=-\\tfrac\\pi6$ ke $\\theta=\\tfrac\\pi6$, di antara nol $r$. Pakai $\\cos^2 3\\theta=\\tfrac12(1+\\cos6\\theta)$.' },
                { en: 'The three petals are congruent, so multiply by $3$. Type `pi/3` and `pi`.', id: 'Ketiga kelopak kongruen, jadi kalikan dengan $3$. Ketik `pi/3` dan `pi`.' },
              ],
              explain: {
                en: 'One petal: $\\tfrac12\\int_{-\\pi/6}^{\\pi/6}4\\cos^23\\theta\\,d\\theta=\\tfrac\\pi3$. Three of them give $\\pi$. Integrating over $[0,2\\pi]$ would give $2\\pi$, because an odd rose is traced twice there.',
                id: 'Satu kelopak: $\\tfrac12\\int_{-\\pi/6}^{\\pi/6}4\\cos^23\\theta\\,d\\theta=\\tfrac\\pi3$. Tiga kelopak memberi $\\pi$. Mengintegralkan pada $[0,2\\pi]$ akan memberi $2\\pi$, karena mawar ganjil digambar dua kali di sana.',
              },
            },
          ],
        },
        {
          id: 'par-m2-s2-l2',
          title: { en: 'Length of a Polar Curve', id: 'Panjang Kurva Kutub' },
          goal: {
            en: 'Find the length of a polar curve with $L=\\int\\sqrt{r^2+(dr/d\\theta)^2}\\,d\\theta$ and the slope of its tangent.',
            id: 'Mencari panjang kurva kutub dengan $L=\\int\\sqrt{r^2+(dr/d\\theta)^2}\\,d\\theta$ dan kemiringan garis singgungnya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Arc length from the parametric formula', id: 'Panjang busur dari rumus parametrik' },
              body: {
                en: 'A polar curve is a parametric curve whose parameter is $\\theta$: $x=r\\cos\\theta$ and $y=r\\sin\\theta$ with $r=f(\\theta)$. The previous module found $L=\\int\\sqrt{(dx/d\\theta)^2+(dy/d\\theta)^2}\\,d\\theta$, and the product rule gives\n$$\\frac{dx}{d\\theta}=\\frac{dr}{d\\theta}\\cos\\theta-r\\sin\\theta,\\qquad\\frac{dy}{d\\theta}=\\frac{dr}{d\\theta}\\sin\\theta+r\\cos\\theta$$\nWhen these are squared and added, the cross terms cancel and $\\cos^2\\theta+\\sin^2\\theta=1$ finishes the job, leaving $r^2+(dr/d\\theta)^2$. Therefore\n$$L=\\int_\\alpha^\\beta\\sqrt{r^2+\\Big(\\frac{dr}{d\\theta}\\Big)^2}\\,d\\theta$$\nIn the figure, drag $s$ to extend the traced part of the cardioid; $L$ is the length of the path from the start to the moving dot.',
                id: 'Kurva kutub adalah kurva parametrik dengan parameter $\\theta$: $x=r\\cos\\theta$ dan $y=r\\sin\\theta$ dengan $r=f(\\theta)$. Modul sebelumnya menemukan $L=\\int\\sqrt{(dx/d\\theta)^2+(dy/d\\theta)^2}\\,d\\theta$, dan aturan hasil kali memberi\n$$\\frac{dx}{d\\theta}=\\frac{dr}{d\\theta}\\cos\\theta-r\\sin\\theta,\\qquad\\frac{dy}{d\\theta}=\\frac{dr}{d\\theta}\\sin\\theta+r\\cos\\theta$$\nKetika dikuadratkan dan dijumlahkan, suku silangnya saling meniadakan dan $\\cos^2\\theta+\\sin^2\\theta=1$ menyelesaikan sisanya, menyisakan $r^2+(dr/d\\theta)^2$. Karena itu\n$$L=\\int_\\alpha^\\beta\\sqrt{r^2+\\Big(\\frac{dr}{d\\theta}\\Big)^2}\\,d\\theta$$\nPada gambar, geser $s$ untuk memperpanjang bagian kardioid yang sudah digambar; $L$ adalah panjang lintasan dari awal sampai titik yang bergerak.',
              },
              figure: {
                dim: 2,
                polar: true,
                xSpan: [-2.5, 2.5],
                ySpan: [-2.5, 2.5],
                ticks: true,
                params: [{ name: 's', min: 0.1, max: 6.28, step: 0.05, value: 3.5, label: 's' }],
                items: [
                  { t: 'polar', r: '1+cos(theta)', from: 0, to: 6.2832, color: 'muted', dashed: true },
                  { t: 'polar', r: '1+cos(theta)', from: 0, to: 's', color: 'a', label: 'r = 1 + cos θ' },
                  { t: 'dot', x: '(1+cos(s))*cos(s)', y: '(1+cos(s))*sin(s)', color: 'b' },
                ],
                caption: {
                  en: 'The solid colored part of the cardioid is the arc traced as $\\theta$ goes from $0$ to $s$. Its length is the integral of $\\sqrt{r^2+(dr/d\\theta)^2}$ over that same range.',
                  id: 'Bagian kardioid yang berwarna penuh adalah busur yang digambar ketika $\\theta$ berjalan dari $0$ ke $s$. Panjangnya adalah integral $\\sqrt{r^2+(dr/d\\theta)^2}$ pada rentang yang sama.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A circle, a cardioid, and a spiral', id: 'Sebuah lingkaran, kardioid, dan spiral' },
              body: {
                en: 'First the sanity check. For the circle $r=a$ we have $dr/d\\theta=0$, so $L=\\int_0^{2\\pi}a\\,d\\theta=2\\pi a$, the circumference.\n\nFor the cardioid $r=1+\\cos\\theta$, $dr/d\\theta=-\\sin\\theta$ and $r^2+(dr/d\\theta)^2=2+2\\cos\\theta=4\\cos^2\\tfrac\\theta2$. The root is $2|\\cos\\tfrac\\theta2|$, and the absolute value matters, because $\\cos\\tfrac\\theta2$ is negative on $[\\pi,2\\pi]$:\n$$L=\\int_0^{2\\pi}2\\Big|\\cos\\tfrac\\theta2\\Big|\\,d\\theta=2\\int_0^{\\pi}2\\cos\\tfrac\\theta2\\,d\\theta=8$$\nDropping the absolute value would give $0$, an impossible length.\n\nThe spiral $r=\\theta$ gives $\\sqrt{\\theta^2+1}$. By trigonometric substitution, an antiderivative is $\\tfrac12\\big[\\theta\\sqrt{1+\\theta^2}+\\ln\\big(\\theta+\\sqrt{1+\\theta^2}\\big)\\big]$, so one full turn $0\\le\\theta\\le2\\pi$ has length about $21.26$.',
                id: 'Pertama, pemeriksaan kewajaran. Untuk lingkaran $r=a$ berlaku $dr/d\\theta=0$, sehingga $L=\\int_0^{2\\pi}a\\,d\\theta=2\\pi a$, yaitu kelilingnya.\n\nUntuk kardioid $r=1+\\cos\\theta$, $dr/d\\theta=-\\sin\\theta$ dan $r^2+(dr/d\\theta)^2=2+2\\cos\\theta=4\\cos^2\\tfrac\\theta2$. Akarnya adalah $2|\\cos\\tfrac\\theta2|$, dan nilai mutlaknya penting, sebab $\\cos\\tfrac\\theta2$ negatif pada $[\\pi,2\\pi]$:\n$$L=\\int_0^{2\\pi}2\\Big|\\cos\\tfrac\\theta2\\Big|\\,d\\theta=2\\int_0^{\\pi}2\\cos\\tfrac\\theta2\\,d\\theta=8$$\nMenghilangkan nilai mutlak akan memberi $0$, panjang yang mustahil.\n\nSpiral $r=\\theta$ memberi $\\sqrt{\\theta^2+1}$. Dengan substitusi trigonometri, sebuah antiturunannya adalah $\\tfrac12\\big[\\theta\\sqrt{1+\\theta^2}+\\ln\\big(\\theta+\\sqrt{1+\\theta^2}\\big)\\big]$, sehingga satu putaran penuh $0\\le\\theta\\le2\\pi$ berpanjang sekitar $21{,}26$.',
              },
              figure: {
                dim: 2,
                polar: true,
                xSpan: [-7, 7],
                ySpan: [-7, 7],
                ticks: true,
                params: [{ name: 's', min: 0.2, max: 6.28, step: 0.05, value: 4, label: 's' }],
                items: [
                  { t: 'polar', r: 'theta', from: 0, to: 6.2832, color: 'muted', dashed: true },
                  { t: 'polar', r: 'theta', from: 0, to: 's', color: 'a', label: 'r = θ' },
                  { t: 'dot', x: 's*cos(s)', y: 's*sin(s)', color: 'b' },
                ],
                caption: {
                  en: 'The spiral $r=\\theta$ for one turn, with the part traced up to $\\theta=s$ in solid color. Drag $s$ and watch the arc lengthen faster than $s$ itself, since it also moves outward.',
                  id: 'Spiral $r=\\theta$ untuk satu putaran, dengan bagian yang digambar sampai $\\theta=s$ berwarna penuh. Geser $s$ dan lihat busurnya memanjang lebih cepat daripada $s$ sendiri, karena ia juga bergerak keluar.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'The slope of a polar curve', id: 'Kemiringan kurva kutub' },
              body: {
                en: 'The same parametric view gives the tangent slope, $\\dfrac{dy}{dx}=\\dfrac{dy/d\\theta}{dx/d\\theta}$, and the derivatives from before turn it into\n$$\\frac{dy}{dx}=\\frac{\\dfrac{dr}{d\\theta}\\sin\\theta+r\\cos\\theta}{\\dfrac{dr}{d\\theta}\\cos\\theta-r\\sin\\theta}$$\nFor the cardioid at $\\theta=\\tfrac\\pi2$ we have $r=1$ and $dr/d\\theta=-1$, so the numerator is $-1$ and the denominator is $-1$: the slope is $1$ at the point $(0,1)$, as the figure shows.\n\nThe numerator and denominator also classify special tangents:\n\n- **Horizontal tangent:** the numerator is zero and the denominator is not.\n- **Vertical tangent:** the denominator is zero and the numerator is not.\n- **At the pole** ($r=0$, $dr/d\\theta\\ne0$): the slope is $\\tan\\theta_0$, the direction in which the curve leaves the pole.',
                id: 'Pandangan parametrik yang sama memberi kemiringan garis singgung, $\\dfrac{dy}{dx}=\\dfrac{dy/d\\theta}{dx/d\\theta}$, dan turunan sebelumnya mengubahnya menjadi\n$$\\frac{dy}{dx}=\\frac{\\dfrac{dr}{d\\theta}\\sin\\theta+r\\cos\\theta}{\\dfrac{dr}{d\\theta}\\cos\\theta-r\\sin\\theta}$$\nUntuk kardioid di $\\theta=\\tfrac\\pi2$ kita punya $r=1$ dan $dr/d\\theta=-1$, sehingga pembilangnya $-1$ dan penyebutnya $-1$: kemiringannya $1$ di titik $(0,1)$, seperti terlihat pada gambar.\n\nPembilang dan penyebut juga mengklasifikasikan garis singgung khusus:\n\n- **Garis singgung mendatar:** pembilang nol dan penyebut tidak.\n- **Garis singgung tegak:** penyebut nol dan pembilang tidak.\n- **Di kutub** ($r=0$, $dr/d\\theta\\ne0$): kemiringannya $\\tan\\theta_0$, arah kurva meninggalkan kutub.',
              },
              figure: {
                dim: 2,
                polar: true,
                xSpan: [-2.5, 2.5],
                ySpan: [-2.5, 2.5],
                ticks: true,
                items: [
                  { t: 'polar', r: '1+cos(theta)', from: 0, to: 6.2832, color: 'a', label: 'r = 1 + cos θ' },
                  { t: 'curve', f: 'x+1', from: -1.5, to: 1.5, color: 'result', label: 'slope 1' },
                  { t: 'dot', x: 0, y: 1, color: 'b' },
                ],
                caption: {
                  en: 'The tangent line to the cardioid at $\\theta=\\tfrac\\pi2$, the point $(0,1)$, rises with slope $1$.',
                  id: 'Garis singgung kardioid di $\\theta=\\tfrac\\pi2$, yaitu titik $(0,1)$, naik dengan kemiringan $1$.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which expression is the integrand for the length of $r=f(\\theta)$?',
                id: 'Ekspresi mana yang menjadi integran untuk panjang $r=f(\\theta)$?',
              },
              options: [
                { en: '$\\sqrt{r^2+(dr/d\\theta)^2}$', id: '$\\sqrt{r^2+(dr/d\\theta)^2}$' },
                { en: '$r^2+(dr/d\\theta)^2$', id: '$r^2+(dr/d\\theta)^2$' },
                { en: '$\\sqrt{1+(dr/d\\theta)^2}$', id: '$\\sqrt{1+(dr/d\\theta)^2}$' },
                { en: '$\\tfrac12\\sqrt{r^2+(dr/d\\theta)^2}$', id: '$\\tfrac12\\sqrt{r^2+(dr/d\\theta)^2}$' },
              ],
              answer: 0,
              explain: {
                en: 'Arc length adds up tiny pieces $\\sqrt{dx^2+dy^2}$, and with $x=r\\cos\\theta$, $y=r\\sin\\theta$ that is $\\sqrt{r^2+(dr/d\\theta)^2}\\,d\\theta$. The factor $\\tfrac12$ belongs to area, not length.',
                id: 'Panjang busur menjumlahkan potongan kecil $\\sqrt{dx^2+dy^2}$, dan dengan $x=r\\cos\\theta$, $y=r\\sin\\theta$ itu menjadi $\\sqrt{r^2+(dr/d\\theta)^2}\\,d\\theta$. Faktor $\\tfrac12$ milik luas, bukan panjang.',
              },
              hint: {
                en: 'Length comes from a square root of a sum of squares; also ask which of the options contains the radius $r$ itself.',
                id: 'Panjang berasal dari akar jumlah kuadrat; tanyakan juga pilihan mana yang memuat jari-jari $r$ itu sendiri.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'The figure shows $r=a\\cos\\theta$ traced once for $-\\tfrac\\pi2\\le\\theta\\le\\tfrac\\pi2$. Read $a$ from the figure. What is the length of the curve?',
                id: 'Gambar menunjukkan $r=a\\cos\\theta$ yang digambar sekali untuk $-\\tfrac\\pi2\\le\\theta\\le\\tfrac\\pi2$. Baca $a$ dari gambar. Berapa panjang kurvanya?',
              },
              figure: {
                dim: 2,
                polar: true,
                xSpan: [-5, 5],
                ySpan: [-5, 5],
                ticks: true,
                items: [{ t: 'polar', r: '4*cos(theta)', from: -1.5708, to: 1.5708, color: 'a' }],
                caption: {
                  en: 'A circle through the pole, with its far point on the polar axis.',
                  id: 'Sebuah lingkaran yang melalui kutub, dengan titik terjauhnya pada sumbu kutub.',
                },
              },
              options: [
                { en: '$4\\pi$', id: '$4\\pi$' },
                { en: '$8\\pi$', id: '$8\\pi$' },
                { en: '$2\\pi$', id: '$2\\pi$' },
                { en: '$16$', id: '$16$' },
              ],
              answer: 0,
              explain: {
                en: 'The farthest point is at $r=4$, so the diameter is $4$ and the circle has radius $2$. Its length is $\\pi\\cdot4=4\\pi$; the formula agrees, since $r^2+(dr/d\\theta)^2=16$ over a range of length $\\pi$.',
                id: 'Titik terjauh berada di $r=4$, sehingga diameternya $4$ dan jari-jarinya $2$. Panjangnya $\\pi\\cdot4=4\\pi$; rumusnya sepakat, sebab $r^2+(dr/d\\theta)^2=16$ pada rentang sepanjang $\\pi$.',
              },
              hint: {
                en: 'The $r$ you read at the far point is a diameter, not a radius. A whole circle is traced exactly once.',
                id: 'Nilai $r$ yang kamu baca di titik terjauh adalah diameter, bukan jari-jari. Seluruh lingkaran digambar tepat sekali.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'For the cardioid $r=1+\\cos\\theta$, simplify the quantity under the root.',
                id: 'Untuk kardioid $r=1+\\cos\\theta$, sederhanakan besaran di bawah akar.',
              },
              template: 'r^2+\\Big(\\dfrac{dr}{d\\theta}\\Big)^2 = ___ + ___\\cos\\theta',
              blanks: ['2', '2'],
              explain: {
                en: '$(1+\\cos\\theta)^2+\\sin^2\\theta=1+2\\cos\\theta+\\cos^2\\theta+\\sin^2\\theta=2+2\\cos\\theta$.',
                id: '$(1+\\cos\\theta)^2+\\sin^2\\theta=1+2\\cos\\theta+\\cos^2\\theta+\\sin^2\\theta=2+2\\cos\\theta$.',
              },
              hint: {
                en: 'Here $dr/d\\theta=-\\sin\\theta$. Expand the square, then combine $\\cos^2\\theta+\\sin^2\\theta$.',
                id: 'Di sini $dr/d\\theta=-\\sin\\theta$. Jabarkan kuadratnya, lalu gabungkan $\\cos^2\\theta+\\sin^2\\theta$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the length of $r=\\theta^2$ for $0\\le\\theta\\le2$, the length of the cardioid $r=3(1+\\cos\\theta)$, and the slope $dy/dx$ of $r=\\theta$ at $\\theta=\\tfrac\\pi2$.',
                id: 'Cari panjang $r=\\theta^2$ untuk $0\\le\\theta\\le2$, panjang kardioid $r=3(1+\\cos\\theta)$, dan kemiringan $dy/dx$ dari $r=\\theta$ di $\\theta=\\tfrac\\pi2$.',
              },
              blanks: [
                { label: { en: '\\text{length of } r=\\theta^2:', id: '\\text{panjang } r=\\theta^2:' }, answer: (16 * Math.sqrt(2) - 8) / 3 },
                { label: { en: '\\text{length of } r=3(1+\\cos\\theta):', id: '\\text{panjang } r=3(1+\\cos\\theta):' }, answer: 24 },
                { label: { en: '\\text{slope of } r=\\theta \\text{ at } \\theta=\\tfrac\\pi2:', id: '\\text{kemiringan } r=\\theta \\text{ di } \\theta=\\tfrac\\pi2:' }, answer: -2 / Math.PI },
              ],
              hints: [
                { en: 'For $r=\\theta^2$ the integrand is $\\sqrt{\\theta^4+4\\theta^2}=\\theta\\sqrt{\\theta^2+4}$; substitute $u=\\theta^2+4$. For the cardioid, scaling $r$ by $3$ scales the length by $3$.', id: 'Untuk $r=\\theta^2$ integrannya $\\sqrt{\\theta^4+4\\theta^2}=\\theta\\sqrt{\\theta^2+4}$; substitusikan $u=\\theta^2+4$. Untuk kardioid, mengalikan $r$ dengan $3$ mengalikan panjang dengan $3$.' },
                { en: 'For the slope, take $r=\\theta$, $dr/d\\theta=1$ at $\\theta=\\tfrac\\pi2$, where $\\sin=1$ and $\\cos=0$. You may type `-2/pi`.', id: 'Untuk kemiringan, ambil $r=\\theta$, $dr/d\\theta=1$ di $\\theta=\\tfrac\\pi2$, tempat $\\sin=1$ dan $\\cos=0$. Kamu boleh mengetik `-2/pi`.' },
              ],
              explain: {
                en: '$\\int_0^2\\theta\\sqrt{\\theta^2+4}\\,d\\theta=\\tfrac13\\big(8^{3/2}-8\\big)=\\tfrac{16\\sqrt2-8}{3}\\approx4.88$. The scaled cardioid has length $3\\cdot8=24$. And the slope is $\\dfrac{1\\cdot1+\\tfrac\\pi2\\cdot0}{1\\cdot0-\\tfrac\\pi2\\cdot1}=-\\dfrac2\\pi$.',
                id: '$\\int_0^2\\theta\\sqrt{\\theta^2+4}\\,d\\theta=\\tfrac13\\big(8^{3/2}-8\\big)=\\tfrac{16\\sqrt2-8}{3}\\approx4{,}88$. Kardioid yang diskalakan berpanjang $3\\cdot8=24$. Dan kemiringannya $\\dfrac{1\\cdot1+\\tfrac\\pi2\\cdot0}{1\\cdot0-\\tfrac\\pi2\\cdot1}=-\\dfrac2\\pi$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'par-m2-s2-p',
        runtime: 'math',
        title: { en: 'Polar Area and Length', id: 'Luas dan Panjang Kutub' },
        brief: {
          en: 'The area of a lemniscate loop, the area between a circle and a cardioid, and the length of a spiral-like curve.',
          id: 'Luas satu simpul lemniskat, luas di antara lingkaran dan kardioid, dan panjang sebuah kurva mirip spiral.',
        },
        requirements: [
          { en: 'Use $A=\\tfrac12\\int(r_{\\text{out}}^2-r_{\\text{in}}^2)\\,d\\theta$ for area and $L=\\int\\sqrt{r^2+(dr/d\\theta)^2}\\,d\\theta$ for length.', id: 'Gunakan $A=\\tfrac12\\int(r_{\\text{out}}^2-r_{\\text{in}}^2)\\,d\\theta$ untuk luas dan $L=\\int\\sqrt{r^2+(dr/d\\theta)^2}\\,d\\theta$ untuk panjang.' },
          { en: 'Type exact forms such as `pi`, `3sqrt(5)/2`, or a plain number.', id: 'Ketik bentuk eksak seperti `pi`, `3sqrt(5)/2`, atau bilangan biasa.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Find the area of the right-hand loop of the lemniscate $r^2=4\\cos2\\theta$, drawn for $-\\tfrac\\pi4\\le\\theta\\le\\tfrac\\pi4$.',
              id: 'Cari luas simpul kanan lemniskat $r^2=4\\cos2\\theta$, yang digambar untuk $-\\tfrac\\pi4\\le\\theta\\le\\tfrac\\pi4$.',
            },
            blanks: [{ label: 'A =', answer: 2 }],
            solution: ['A=\\tfrac12\\int_{-\\pi/4}^{\\pi/4}4\\cos2\\theta\\,d\\theta=2\\Big[\\tfrac12\\sin2\\theta\\Big]_{-\\pi/4}^{\\pi/4}=2'],
          },
          {
            prompt: {
              en: 'Find the area inside the circle $r=3\\cos\\theta$ and outside the cardioid $r=1+\\cos\\theta$.',
              id: 'Cari luas di dalam lingkaran $r=3\\cos\\theta$ dan di luar kardioid $r=1+\\cos\\theta$.',
            },
            blanks: [{ label: 'A =', answer: Math.PI }],
            solution: [
              '3\\cos\\theta=1+\\cos\\theta\\ \\Rightarrow\\ \\cos\\theta=\\tfrac12\\ \\Rightarrow\\ \\theta=\\pm\\tfrac\\pi3',
              'A=\\tfrac12\\int_{-\\pi/3}^{\\pi/3}\\big(9\\cos^2\\theta-(1+\\cos\\theta)^2\\big)d\\theta=\\int_0^{\\pi/3}(3+4\\cos2\\theta-2\\cos\\theta)\\,d\\theta',
              'A=\\Big[3\\theta+2\\sin2\\theta-2\\sin\\theta\\Big]_0^{\\pi/3}=\\pi+\\sqrt3-\\sqrt3=\\pi',
            ],
          },
          {
            prompt: {
              en: 'Find the length of the curve $r=e^{2\\theta}$ for $0\\le\\theta\\le\\ln2$.',
              id: 'Cari panjang kurva $r=e^{2\\theta}$ untuk $0\\le\\theta\\le\\ln2$.',
            },
            blanks: [{ label: 'L =', answer: (3 * Math.sqrt(5)) / 2 }],
            solution: [
              'r^2+\\Big(\\dfrac{dr}{d\\theta}\\Big)^2=e^{4\\theta}+4e^{4\\theta}=5e^{4\\theta}',
              'L=\\int_0^{\\ln2}\\sqrt5\\,e^{2\\theta}\\,d\\theta=\\tfrac{\\sqrt5}{2}\\big(e^{2\\ln2}-1\\big)=\\tfrac{\\sqrt5}{2}\\cdot3=\\tfrac{3\\sqrt5}{2}',
            ],
          },
        ],
        hints: [
          { en: 'In part 2, find the crossing angles first, and note that the circle is outer between them. Use $\\cos^2\\theta=\\tfrac12(1+\\cos2\\theta)$ to integrate.', id: 'Pada butir 2, cari dulu sudut perpotongannya, dan perhatikan bahwa lingkaran berada di luar di antara keduanya. Pakai $\\cos^2\\theta=\\tfrac12(1+\\cos2\\theta)$ untuk mengintegralkan.' },
          { en: 'In part 3, the root simplifies to a constant times $e^{2\\theta}$, which integrates directly.', id: 'Pada butir 3, akarnya menyederhana menjadi konstanta kali $e^{2\\theta}$, yang bisa langsung diintegralkan.' },
        ],
        xp: 50,
      },
    },
  ],
}
