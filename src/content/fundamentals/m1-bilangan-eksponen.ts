import type { Module } from '../types'

/** Module 1 — the real number system, and the exponent and radical notation
 *  every later course leans on. Fast-paced by design: Stewart's own preface
 *  calls this chapter a review, covered "as much or as little... as needed." */
export const module1: Module = {
  id: 'dsr-m1',
  title: { en: 'Real Numbers, Exponents, and Radicals', id: 'Bilangan Real, Eksponen, dan Akar' },
  summary: {
    en: 'What kind of number a number is, the properties that let you rearrange an expression, and the exponent and radical rules behind every algebraic simplification.',
    id: 'Jenis suatu bilangan, sifat-sifat yang membolehkan sebuah bentuk aljabar ditata ulang, serta aturan eksponen dan akar di balik setiap penyederhanaan aljabar.',
  },
  submodules: [
    /* --------------------------------------------------- 1.1 real numbers */
    {
      id: 'dsr-m1-s1',
      title: { en: 'The Real Number System', id: 'Sistem Bilangan Real' },
      summary: {
        en: 'Natural numbers up through irrationals, the properties that govern them, sets and intervals, and absolute value as distance.',
        id: 'Dari bilangan asli hingga irasional, sifat-sifat yang mengaturnya, himpunan dan interval, serta nilai mutlak sebagai jarak.',
      },
      lessons: [
        {
          id: 'dsr-m1-s1-l1',
          title: { en: 'Kinds of Numbers, and the Real Line', id: 'Jenis-Jenis Bilangan, dan Garis Bilangan' },
          goal: {
            en: 'Classify a number as natural, integer, rational, or irrational, and read order off the real line.',
            id: 'Mengklasifikasikan bilangan sebagai asli, bulat, rasional, atau irasional, dan membaca urutan dari garis bilangan.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Building up the number system', id: 'Menyusun sistem bilangan' },
              body: {
                en: 'The **natural numbers** are $1, 2, 3, \\ldots$ The **integers** add their negatives and $0$: $\\ldots, -2, -1, 0, 1, 2, \\ldots$ A **rational number** is any ratio of integers $\\frac{m}{n}$ with $n \\neq 0$ — this covers $\\frac{1}{2}$, $46$ (as $\\frac{46}{1}$), and $0.17$ (as $\\frac{17}{100}$). Division by $0$ is always undefined: $\\frac{3}{0}$ and $\\frac{0}{0}$ are simply not numbers.\n\nSome real numbers — $\\sqrt{2}$, $\\pi$, $\\sqrt[3]{5}$ — cannot be written as a ratio of integers at all. These are **irrational**. Every real number is either rational or irrational, never both.',
                id: '**Bilangan asli** adalah $1, 2, 3, \\ldots$ **Bilangan bulat** menambahkan negatifnya dan $0$: $\\ldots, -2, -1, 0, 1, 2, \\ldots$ **Bilangan rasional** adalah rasio bilangan bulat mana pun $\\frac{m}{n}$ dengan $n \\neq 0$ — ini mencakup $\\frac{1}{2}$, $46$ (sebagai $\\frac{46}{1}$), dan $0.17$ (sebagai $\\frac{17}{100}$). Pembagian dengan $0$ selalu tak terdefinisi: $\\frac{3}{0}$ dan $\\frac{0}{0}$ sederhananya bukan bilangan.\n\nBeberapa bilangan real — $\\sqrt{2}$, $\\pi$, $\\sqrt[3]{5}$ — sama sekali tak bisa ditulis sebagai rasio bilangan bulat. Ini disebut **irasional**. Setiap bilangan real pasti rasional atau irasional, tak pernah keduanya.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Decimals tell rational from irrational', id: 'Desimal membedakan rasional dari irasional' },
              body: {
                en: 'Every real number has a decimal expansion, and the pattern of that expansion reveals which kind it is. A **rational** number\'s decimal always **repeats** (or terminates, which is repeating $0$s): $\\frac{1}{2} = 0.5\\overline{0}$, $\\frac{2}{3} = 0.\\overline{6}$, $\\frac{9}{7} = 1.\\overline{285714}$. An **irrational** number\'s decimal **never repeats**: $\\sqrt{2} = 1.414213562\\ldots$, $\\pi = 3.141592653\\ldots$\n\nOn the **real line**, positive numbers sit to the right of the origin $0$ and negative numbers to the left, each at a distance equal to its value. We say $a < b$ (\\"$a$ is less than $b$\\") exactly when $b - a$ is positive — equivalently, when $a$ sits to the left of $b$.',
                id: 'Setiap bilangan real punya ekspansi desimal, dan pola ekspansinya mengungkap jenisnya. Desimal bilangan **rasional** selalu **berulang** (atau berhenti, yang sama dengan berulang $0$): $\\frac{1}{2} = 0.5\\overline{0}$, $\\frac{2}{3} = 0.\\overline{6}$, $\\frac{9}{7} = 1.\\overline{285714}$. Desimal bilangan **irasional** **tak pernah berulang**: $\\sqrt{2} = 1.414213562\\ldots$, $\\pi = 3.141592653\\ldots$\n\nPada **garis bilangan**, bilangan positif duduk di kanan titik asal $0$ dan bilangan negatif di kiri, masing-masing sejauh nilainya. Kita tulis $a < b$ (\\"$a$ kurang dari $b$\\") persis ketika $b - a$ positif — setara dengan, ketika $a$ duduk di kiri $b$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which of these numbers is irrational?',
                id: 'Bilangan manakah di antara ini yang irasional?',
              },
              options: [
                { en: '$\\pi$', id: '$\\pi$' },
                { en: '$\\sqrt{16}$', id: '$\\sqrt{16}$' },
                { en: '$\\frac{22}{7}$', id: '$\\frac{22}{7}$' },
                { en: '$0.25$', id: '$0.25$' },
              ],
              answer: 0,
              explain: {
                en: '$\\sqrt{16} = 4$ and $\\frac{22}{7}$ and $0.25$ are all ratios of integers (or terminating decimals, which are the same thing) — genuinely rational. $\\pi$ has a decimal expansion that never repeats, so it cannot be written as $\\frac{m}{n}$.',
                id: '$\\sqrt{16} = 4$ dan $\\frac{22}{7}$ serta $0.25$ semuanya rasio bilangan bulat (atau desimal berhenti, yang sama saja) — sungguh rasional. $\\pi$ punya ekspansi desimal yang tak pernah berulang, sehingga tak bisa ditulis sebagai $\\frac{m}{n}$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Which of the following is a true statement, matching the order on the real line?',
                id: 'Manakah pernyataan berikut yang benar, sesuai urutan pada garis bilangan?',
              },
              options: [
                { en: '$-5 < -4.9$', id: '$-5 < -4.9$' },
                { en: '$-5 > -4.9$', id: '$-5 > -4.9$' },
                { en: '$4 > 4.4$', id: '$4 > 4.4$' },
                { en: '$-2 < -3$', id: '$-2 < -3$' },
              ],
              answer: 0,
              explain: {
                en: '$-4.9 - (-5) = 0.1$, a positive number, so $-5 < -4.9$ — on the real line, $-5$ sits to the left of $-4.9$ because it is **more** negative, even though $5 > 4.9$ as plain magnitudes.',
                id: '$-4.9 - (-5) = 0.1$, bilangan positif, sehingga $-5 < -4.9$ — pada garis bilangan, $-5$ duduk di kiri $-4.9$ karena ia **lebih** negatif, meskipun $5 > 4.9$ sebagai besaran biasa.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Write the terminating decimal $0.375$ as a fraction in lowest terms.',
                id: 'Tulis desimal berhenti $0.375$ sebagai pecahan dalam bentuk paling sederhana.',
              },
              template: '0.375 = ___',
              blanks: ['3/8'],
              explain: {
                en: '$0.375 = \\frac{375}{1000}$, and dividing top and bottom by $125$ gives $\\frac{3}{8}$ — a terminating decimal is always rational for exactly this reason.',
                id: '$0.375 = \\frac{375}{1000}$, dan membagi pembilang serta penyebut dengan $125$ memberi $\\frac{3}{8}$ — desimal berhenti selalu rasional persis karena alasan ini.',
              },
            },
          ],
        },
        {
          id: 'dsr-m1-s1-l2',
          title: { en: 'Properties, and the Arithmetic of Fractions', id: 'Sifat-Sifat, dan Aritmetika Pecahan' },
          goal: {
            en: 'Apply the commutative, associative, and distributive properties, and combine fractions using the least common denominator.',
            id: 'Menerapkan sifat komutatif, asosiatif, dan distributif, serta menggabungkan pecahan memakai KPK.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Commutative, associative, distributive', id: 'Komutatif, asosiatif, distributif' },
              body: {
                en: 'Three properties justify every rearrangement you make in an algebraic expression. For any real numbers $a, b, c$:\n$$a + b = b + a, \\qquad ab = ba \\qquad \\text{(Commutative — order doesn\'t matter)}$$\n$$(a+b)+c = a+(b+c), \\qquad (ab)c = a(bc) \\qquad \\text{(Associative — grouping doesn\'t matter)}$$\n$$a(b+c) = ab + ac \\qquad \\text{(Distributive — multiply a sum by distributing over it)}$$\nThe Distributive Property is the one that does real work: $2(x+3) = 2x + 6$, and reversed, it is exactly what **factoring** does.',
                id: 'Tiga sifat membenarkan setiap penataan ulang yang kamu lakukan pada bentuk aljabar. Untuk sebarang bilangan real $a, b, c$:\n$$a + b = b + a, \\qquad ab = ba \\qquad \\text{(Komutatif — urutan tak penting)}$$\n$$(a+b)+c = a+(b+c), \\qquad (ab)c = a(bc) \\qquad \\text{(Asosiatif — pengelompokan tak penting)}$$\n$$a(b+c) = ab + ac \\qquad \\text{(Distributif — mengalikan jumlah dengan menyebarkannya)}$$\nSifat Distributif yang benar-benar bekerja: $2(x+3) = 2x + 6$, dan dibalik, ini persis yang dilakukan **pemfaktoran**.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Properties of negatives', id: 'Sifat-sifat bilangan negatif' },
              body: {
                en: 'These follow from the Distributive Property and come up constantly when simplifying:\n$$-(-a) = a, \\qquad (-a)b = a(-b) = -(ab), \\qquad (-a)(-b) = ab$$\n$$-(a+b) = -a-b, \\qquad -(a-b) = b-a$$\nThe last one is why a minus sign in front of parentheses flips every sign inside: $-(x - 5) = -x + 5$, not $-x - 5$.',
                id: 'Ini mengikuti Sifat Distributif dan terus-menerus muncul saat menyederhanakan:\n$$-(-a) = a, \\qquad (-a)b = a(-b) = -(ab), \\qquad (-a)(-b) = ab$$\n$$-(a+b) = -a-b, \\qquad -(a-b) = b-a$$\nYang terakhir adalah alasan tanda minus di depan tanda kurung membalik setiap tanda di dalamnya: $-(x - 5) = -x + 5$, bukan $-x - 5$.',
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'The LCD for adding fractions', id: 'KPK untuk menjumlahkan pecahan' },
              body: {
                en: 'Fractions with the **same** denominator add directly: $\\frac{a}{c}+\\frac{b}{c}=\\frac{a+b}{c}$. With **different** denominators, find the **least common denominator (LCD)** — factor each denominator into primes and take the highest power of each prime that appears.\n\nFor $\\frac{5}{36}+\\frac{7}{120}$: $36 = 2^2 \\cdot 3^2$ and $120 = 2^3 \\cdot 3 \\cdot 5$, so the LCD is $2^3 \\cdot 3^2 \\cdot 5 = 360$. Rewriting each fraction over $360$: $\\frac{5}{36}=\\frac{50}{360}$ and $\\frac{7}{120}=\\frac{21}{360}$, so the sum is $\\frac{71}{360}$.',
                id: 'Pecahan dengan penyebut yang **sama** dijumlahkan langsung: $\\frac{a}{c}+\\frac{b}{c}=\\frac{a+b}{c}$. Dengan penyebut yang **berbeda**, cari **KPK (Kelipatan Persekutuan Terkecil)** — faktorkan tiap penyebut menjadi bilangan prima dan ambil pangkat tertinggi tiap prima yang muncul.\n\nUntuk $\\frac{5}{36}+\\frac{7}{120}$: $36 = 2^2 \\cdot 3^2$ dan $120 = 2^3 \\cdot 3 \\cdot 5$, sehingga KPK-nya $2^3 \\cdot 3^2 \\cdot 5 = 360$. Menulis ulang tiap pecahan atas $360$: $\\frac{5}{36}=\\frac{50}{360}$ dan $\\frac{7}{120}=\\frac{21}{360}$, sehingga jumlahnya $\\frac{71}{360}$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which equation is an application of the Distributive Property?',
                id: 'Persamaan manakah yang merupakan penerapan Sifat Distributif?',
              },
              options: [
                { en: '$5(x + 2) = 5x + 10$', id: '$5(x + 2) = 5x + 10$' },
                { en: '$5 + x = x + 5$', id: '$5 + x = x + 5$' },
                { en: '$(5 \\cdot x) \\cdot 2 = 5 \\cdot (x \\cdot 2)$', id: '$(5 \\cdot x) \\cdot 2 = 5 \\cdot (x \\cdot 2)$' },
                { en: '$5 \\cdot x = x \\cdot 5$', id: '$5 \\cdot x = x \\cdot 5$' },
              ],
              answer: 0,
              explain: {
                en: 'Multiplying a number by a sum and distributing that multiplication over each term is exactly the Distributive Property, $a(b+c)=ab+ac$. The other three are Commutative and Associative Properties, which rearrange or regroup rather than distribute.',
                id: 'Mengalikan bilangan dengan sebuah jumlah dan menyebarkan perkaliannya ke tiap suku persis Sifat Distributif, $a(b+c)=ab+ac$. Tiga lainnya adalah Sifat Komutatif dan Asosiatif, yang menata ulang atau mengelompokkan ulang, bukan menyebarkan.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the LCD addition $\\dfrac{5}{36} + \\dfrac{7}{120}$.',
                id: 'Lengkapi penjumlahan KPK $\\dfrac{5}{36} + \\dfrac{7}{120}$.',
              },
              template: '\\dfrac{5}{36} + \\dfrac{7}{120} = ___',
              blanks: ['71/360'],
              explain: {
                en: 'The LCD of $36$ and $120$ is $360$; rewriting gives $\\frac{50}{360}+\\frac{21}{360}=\\frac{71}{360}$, exactly as worked out above.',
                id: 'KPK dari $36$ dan $120$ adalah $360$; menulis ulang memberi $\\frac{50}{360}+\\frac{21}{360}=\\frac{71}{360}$, persis seperti yang dikerjakan di atas.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Evaluate $\\dfrac{2}{3} - \\dfrac{5}{9}$ using the LCD.',
                id: 'Hitung $\\dfrac{2}{3} - \\dfrac{5}{9}$ memakai KPK.',
              },
              blanks: [{ answer: 1 / 9 }],
              hints: [
                { en: 'The LCD of $3$ and $9$ is $9$. Rewrite $\\frac{2}{3}$ as ninths first.', id: 'KPK dari $3$ dan $9$ adalah $9$. Tulis ulang $\\frac{2}{3}$ menjadi perdelapan dulu.' },
              ],
              explain: {
                en: '$\\frac{2}{3}=\\frac{6}{9}$, so $\\frac{6}{9}-\\frac{5}{9}=\\frac{1}{9}$.',
                id: '$\\frac{2}{3}=\\frac{6}{9}$, sehingga $\\frac{6}{9}-\\frac{5}{9}=\\frac{1}{9}$.',
              },
            },
          ],
        },
        {
          id: 'dsr-m1-s1-l3',
          title: { en: 'Sets, Intervals, and Absolute Value', id: 'Himpunan, Interval, dan Nilai Mutlak' },
          goal: {
            en: 'Combine sets with union and intersection, write intervals both ways, and use absolute value to measure distance.',
            id: 'Menggabungkan himpunan dengan gabungan dan irisan, menulis interval dalam dua cara, dan memakai nilai mutlak untuk mengukur jarak.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Union and intersection', id: 'Gabungan dan irisan' },
              body: {
                en: 'A **set** is a collection of objects, its **elements**. Set-builder notation $\\{x \\vert \\text{condition on } x\\}$ names a set by the rule its elements satisfy, e.g. $\\{x \\vert x \\text{ is an integer and } 0 < x < 7\\} = \\{1,2,3,4,5,6\\}$.\n\nFor sets $S$ and $T$: the **union** $S \\cup T$ has everything in $S$ **or** $T$ (or both); the **intersection** $S \\cap T$ has only what is in **both**. If $S = \\{1,2,3,4,5\\}$ and $T = \\{4,5,6,7\\}$, then $S \\cup T = \\{1,2,3,4,5,6,7\\}$ and $S \\cap T = \\{4,5\\}$.',
                id: '**Himpunan** adalah kumpulan objek, **anggota**-anggotanya. Notasi pembentuk himpunan $\\{x \\vert \\text{syarat pada } x\\}$ menamai himpunan lewat aturan yang dipenuhi anggotanya, mis. $\\{x \\vert x \\text{ bilangan bulat dan } 0 < x < 7\\} = \\{1,2,3,4,5,6\\}$.\n\nUntuk himpunan $S$ dan $T$: **gabungan** $S \\cup T$ berisi segala sesuatu di $S$ **atau** $T$ (atau keduanya); **irisan** $S \\cap T$ hanya berisi yang ada di **keduanya**. Jika $S = \\{1,2,3,4,5\\}$ dan $T = \\{4,5,6,7\\}$, maka $S \\cup T = \\{1,2,3,4,5,6,7\\}$ dan $S \\cap T = \\{4,5\\}$.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Intervals: two notations for the same set', id: 'Interval: dua notasi untuk himpunan yang sama' },
              body: {
                en: 'An interval is a segment of the real line. Parentheses exclude an endpoint, brackets include it:\n$$(a,b) = \\{x \\vert a < x < b\\}, \\qquad [a,b] = \\{x \\vert a \\leq x \\leq b\\}$$\n$$[a,b) = \\{x \\vert a \\leq x < b\\}, \\qquad (a,\\infty) = \\{x \\vert a < x\\}$$\n$\\infty$ is not a number — $(a,\\infty)$ just says the interval has no right endpoint. To intersect or unite two intervals, sketch both on the real line and read off where they overlap or combine: $(-1,3) \\cap [2,7] = [2,3)$, while $(-1,3) \\cup [2,7] = (-1,7]$.',
                id: 'Interval adalah segmen garis bilangan. Tanda kurung mengecualikan titik ujung, tanda siku menyertakannya:\n$$(a,b) = \\{x \\vert a < x < b\\}, \\qquad [a,b] = \\{x \\vert a \\leq x \\leq b\\}$$\n$$[a,b) = \\{x \\vert a \\leq x < b\\}, \\qquad (a,\\infty) = \\{x \\vert a < x\\}$$\n$\\infty$ bukan bilangan — $(a,\\infty)$ hanya menyatakan interval itu tak punya titik ujung kanan. Untuk mengirisi atau menggabungkan dua interval, sketsakan keduanya pada garis bilangan dan baca di mana keduanya tumpang tindih atau tergabung: $(-1,3) \\cap [2,7] = [2,3)$, sedangkan $(-1,3) \\cup [2,7] = (-1,7]$.',
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Absolute value as distance', id: 'Nilai mutlak sebagai jarak' },
              body: {
                en: '$|a|$ is the distance from $a$ to $0$, so it is never negative: $|a| = a$ if $a \\geq 0$, and $|a| = -a$ if $a < 0$. For instance $|3| = 3$ and $|-3| = -(-3) = 3$.\n\nThis extends to the **distance between two points** on the real line:\n$$d(a,b) = |b - a|$$\nSo the distance between $2$ and $8$ is $d(2,8) = |8-2| = 6$, and between $-2$ and $8$ it is $|8-(-2)| = 10$ — subtraction inside the absolute value handles either order, since $|b-a|=|a-b|$.',
                id: '$|a|$ adalah jarak dari $a$ ke $0$, sehingga tak pernah negatif: $|a| = a$ jika $a \\geq 0$, dan $|a| = -a$ jika $a < 0$. Misalnya $|3| = 3$ dan $|-3| = -(-3) = 3$.\n\nIni meluas menjadi **jarak antara dua titik** pada garis bilangan:\n$$d(a,b) = |b - a|$$\nJadi jarak antara $2$ dan $8$ adalah $d(2,8) = |8-2| = 6$, dan antara $-2$ dan $8$ adalah $|8-(-2)| = 10$ — pengurangan di dalam nilai mutlak menangani urutan mana pun, sebab $|b-a|=|a-b|$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is $(-1, 3) \\cap [2, 7]$?',
                id: 'Berapakah $(-1, 3) \\cap [2, 7]$?',
              },
              options: [
                { en: '$[2, 3)$', id: '$[2, 3)$' },
                { en: '$(-1, 7]$', id: '$(-1, 7]$' },
                { en: '$(2, 3]$', id: '$(2, 3]$' },
                { en: '$\\emptyset$', id: '$\\emptyset$' },
              ],
              answer: 0,
              explain: {
                en: 'The overlap of $-1 < x < 3$ and $2 \\leq x \\leq 7$ is $2 \\leq x < 3$ — the lower bound $2$ is included (it comes from the closed interval), the upper bound $3$ is excluded (it comes from the open one), giving $[2,3)$.',
                id: 'Tumpang tindih dari $-1 < x < 3$ dan $2 \\leq x \\leq 7$ adalah $2 \\leq x < 3$ — batas bawah $2$ disertakan (berasal dari interval tertutup), batas atas $3$ dikecualikan (berasal dari interval terbuka), memberi $[2,3)$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Evaluate $|3 - \\pi|$.',
                id: 'Hitung $|3 - \\pi|$.',
              },
              options: [
                { en: '$\\pi - 3$', id: '$\\pi - 3$' },
                { en: '$3 - \\pi$', id: '$3 - \\pi$' },
                { en: '$3 + \\pi$', id: '$3 + \\pi$' },
                { en: '$0$', id: '$0$' },
              ],
              answer: 0,
              explain: {
                en: 'Since $\\pi \\approx 3.14 > 3$, the quantity $3 - \\pi$ is negative, so $|3-\\pi| = -(3-\\pi) = \\pi - 3$ by the definition of absolute value.',
                id: 'Karena $\\pi \\approx 3.14 > 3$, kuantitas $3 - \\pi$ negatif, sehingga $|3-\\pi| = -(3-\\pi) = \\pi - 3$ menurut definisi nilai mutlak.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Find the distance between $-8$ and $10$ on the real line.',
                id: 'Cari jarak antara $-8$ dan $10$ pada garis bilangan.',
              },
              template: 'd(-8, 10) = |10 - (-8)| = ___',
              blanks: ['18'],
              explain: {
                en: '$|10-(-8)| = |18| = 18$.',
                id: '$|10-(-8)| = |18| = 18$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the distance between $-12$ and $7$ on the real line.',
                id: 'Cari jarak antara $-12$ dan $7$ pada garis bilangan.',
              },
              blanks: [{ answer: 19 }],
              hints: [
                { en: '$d(a,b) = |b-a|$.', id: '$d(a,b) = |b-a|$.' },
              ],
              explain: {
                en: '$d(-12,7) = |7-(-12)| = |19| = 19$.',
                id: '$d(-12,7) = |7-(-12)| = |19| = 19$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'dsr-m1-s1-p',
        runtime: 'math',
        title: { en: 'Working with the Real Number System', id: 'Bekerja dengan Sistem Bilangan Real' },
        brief: {
          en: 'Combine fractions with the LCD, find where two intervals overlap, and measure a distance.',
          id: 'Menggabungkan pecahan dengan KPK, menemukan tumpang tindih dua interval, dan mengukur jarak.',
        },
        requirements: [
          { en: 'The LCD is built from the highest power of every prime factor appearing in either denominator.', id: 'KPK dibangun dari pangkat tertinggi tiap faktor prima yang muncul di salah satu penyebut.' },
          { en: 'An interval\'s endpoint is included only if that side used a bracket, not a parenthesis.', id: 'Titik ujung interval disertakan hanya jika sisi itu memakai tanda siku, bukan tanda kurung.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Use the LCD to combine $\\dfrac{3}{8} + \\dfrac{5}{12}$.',
              id: 'Pakai KPK untuk menggabungkan $\\dfrac{3}{8} + \\dfrac{5}{12}$.',
            },
            blanks: [{ answer: 19 / 24 }],
            solution: ['\\text{LCD}(8,12) = 24, \\quad \\dfrac{9}{24}+\\dfrac{10}{24} = \\dfrac{19}{24}'],
          },
          {
            prompt: {
              en: 'The intersection of $(-2, 6]$ and $[1, 9)$ is an interval $[a, b]$. Find $a$ and $b$.',
              id: 'Irisan dari $(-2, 6]$ dan $[1, 9)$ adalah interval $[a, b]$. Cari $a$ dan $b$.',
            },
            blanks: [
              { label: 'a =', answer: 1 },
              { label: 'b =', answer: 6 },
            ],
            solution: ['\\text{Overlap of } -2 < x \\leq 6 \\text{ and } 1 \\leq x < 9 \\text{ is } 1 \\leq x \\leq 6, \\text{ i.e. } [1,6]'],
          },
          {
            prompt: {
              en: 'Find the distance between $-15$ and $22$ on the real line.',
              id: 'Cari jarak antara $-15$ dan $22$ pada garis bilangan.',
            },
            blanks: [{ answer: 37 }],
            solution: ['d(-15,22) = |22-(-15)| = 37'],
          },
        ],
        hints: [
          { en: 'For the intersection, sketch both intervals on the same real line and read off where they overlap.', id: 'Untuk irisannya, sketsakan kedua interval pada garis bilangan yang sama dan baca di mana keduanya tumpang tindih.' },
        ],
        xp: 50,
      },
    },

    /* -------------------------------------------- 1.2 exponents, radicals */
    {
      id: 'dsr-m1-s2',
      title: { en: 'Exponents and Radicals', id: 'Eksponen dan Akar' },
      summary: {
        en: 'The laws of exponents, scientific notation, nth roots, and rational exponents.',
        id: 'Hukum eksponen, notasi ilmiah, akar ke-n, dan eksponen rasional.',
      },
      lessons: [
        {
          id: 'dsr-m1-s2-l1',
          title: { en: 'Integer Exponents and the Laws', id: 'Eksponen Bulat dan Hukumnya' },
          goal: {
            en: 'Use zero and negative exponents, and apply the laws of exponents to simplify an expression.',
            id: 'Memakai eksponen nol dan negatif, dan menerapkan hukum eksponen untuk menyederhanakan bentuk aljabar.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Zero and negative exponents', id: 'Eksponen nol dan negatif' },
              body: {
                en: 'For a positive integer $n$, $a^n = a \\cdot a \\cdots a$ ($n$ factors). To keep the exponent rules working when $n$ is $0$ or negative, we **define**, for $a \\neq 0$:\n$$a^0 = 1, \\qquad a^{-n} = \\frac{1}{a^n}$$\nSo $\\left(\\frac{7}{4}\\right)^0 = 1$, and $(-2)^{-3} = \\frac{1}{(-2)^3} = -\\frac{1}{8}$. These are definitions, not things to derive — they are chosen precisely so every law below stays true.',
                id: 'Untuk bilangan bulat positif $n$, $a^n = a \\cdot a \\cdots a$ ($n$ faktor). Agar aturan eksponen tetap berlaku saat $n$ adalah $0$ atau negatif, kita **definisikan**, untuk $a \\neq 0$:\n$$a^0 = 1, \\qquad a^{-n} = \\frac{1}{a^n}$$\nJadi $\\left(\\frac{7}{4}\\right)^0 = 1$, dan $(-2)^{-3} = \\frac{1}{(-2)^3} = -\\frac{1}{8}$. Ini definisi, bukan sesuatu yang diturunkan — dipilih persis agar setiap hukum di bawah tetap benar.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The laws of exponents', id: 'Hukum-hukum eksponen' },
              body: {
                en: 'For real numbers $a, b$ and integers $m, n$:\n$$a^m a^n = a^{m+n}, \\qquad \\frac{a^m}{a^n} = a^{m-n}, \\qquad (a^m)^n = a^{mn}$$\n$$(ab)^n = a^n b^n, \\qquad \\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}$$\nFor example, $x^4 x^7 = x^{11}$ (Law 1), and $(3x)^3 = 3^3 x^3 = 27x^3$ (Law 4) — the exponent applies to **every** factor inside the parentheses, not just the variable.',
                id: 'Untuk bilangan real $a, b$ dan bilangan bulat $m, n$:\n$$a^m a^n = a^{m+n}, \\qquad \\frac{a^m}{a^n} = a^{m-n}, \\qquad (a^m)^n = a^{mn}$$\n$$(ab)^n = a^n b^n, \\qquad \\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}$$\nMisalnya, $x^4 x^7 = x^{11}$ (Hukum 1), dan $(3x)^3 = 3^3 x^3 = 27x^3$ (Hukum 4) — eksponennya berlaku untuk **setiap** faktor di dalam tanda kurung, tak hanya variabelnya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is $(3x)^3$?',
                id: 'Berapakah $(3x)^3$?',
              },
              options: [
                { en: '$27x^3$', id: '$27x^3$' },
                { en: '$3x^3$', id: '$3x^3$' },
                { en: '$9x^3$', id: '$9x^3$' },
                { en: '$x^9$', id: '$x^9$' },
              ],
              answer: 0,
              explain: {
                en: 'By Law 4, $(3x)^3 = 3^3 x^3 = 27x^3$ — every factor inside the parentheses, including the $3$, gets raised to the power.',
                id: 'Menurut Hukum 4, $(3x)^3 = 3^3 x^3 = 27x^3$ — setiap faktor di dalam tanda kurung, termasuk $3$-nya, dipangkatkan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Evaluate $\\left(\\dfrac{1}{2}\\right)^{-3}$.',
                id: 'Hitung $\\left(\\dfrac{1}{2}\\right)^{-3}$.',
              },
              options: [
                { en: '$8$', id: '$8$' },
                { en: '$-8$', id: '$-8$' },
                { en: '$\\frac{1}{8}$', id: '$\\frac{1}{8}$' },
                { en: '$-\\frac{1}{8}$', id: '$-\\frac{1}{8}$' },
              ],
              answer: 0,
              explain: {
                en: 'A negative exponent inverts the base: $\\left(\\frac{1}{2}\\right)^{-3} = \\left(\\frac{2}{1}\\right)^3 = 2^3 = 8$.',
                id: 'Eksponen negatif membalik basisnya: $\\left(\\frac{1}{2}\\right)^{-3} = \\left(\\frac{2}{1}\\right)^3 = 2^3 = 8$.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Simplify $a^4b^2 \\cdot a^{-1}b^3$, writing it as $a^3b^5$, by finding the exponent on each base.',
                id: 'Sederhanakan $a^4b^2 \\cdot a^{-1}b^3$, ditulis sebagai $a^3b^5$, dengan mencari eksponen tiap basisnya.',
              },
              template: 'a^4b^2 \\cdot a^{-1}b^3 = a^3b^5, \\quad \\text{exponent on } a = ___, \\ \\text{exponent on } b = ___',
              blanks: ['3', '5'],
              explain: {
                en: 'Adding exponents of matching bases: $4+(-1)=3$ for $a$, and $2+3=5$ for $b$.',
                id: 'Menjumlahkan eksponen basis yang sama: $4+(-1)=3$ untuk $a$, dan $2+3=5$ untuk $b$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Simplify $2^5 \\cdot 2^{-3}$.',
                id: 'Sederhanakan $2^5 \\cdot 2^{-3}$.',
              },
              blanks: [{ answer: 4 }],
              hints: [
                { en: 'Law 1: $a^m a^n = a^{m+n}$.', id: 'Hukum 1: $a^m a^n = a^{m+n}$.' },
              ],
              explain: {
                en: '$2^5 \\cdot 2^{-3} = 2^{5-3} = 2^2 = 4$.',
                id: '$2^5 \\cdot 2^{-3} = 2^{5-3} = 2^2 = 4$.',
              },
            },
          ],
        },
        {
          id: 'dsr-m1-s2-l2',
          title: { en: 'Scientific Notation', id: 'Notasi Ilmiah' },
          goal: {
            en: 'Convert between decimal and scientific notation, and compute with numbers written that way.',
            id: 'Mengonversi antara notasi desimal dan ilmiah, dan menghitung dengan bilangan yang ditulis begitu.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A compact way to write extreme numbers', id: 'Cara ringkas menulis bilangan ekstrem' },
              body: {
                en: 'A positive number is in **scientific notation** when written $a \\times 10^n$ with $1 \\leq a < 10$ and $n$ an integer. The distance to Proxima Centauri, about $40{,}000{,}000{,}000{,}000$ km, is $4 \\times 10^{13}$ km — the exponent $13$ says "move the decimal point 13 places right." The mass of a hydrogen atom, about $0.00000000000000000000000166$ g, is $1.66 \\times 10^{-24}$ g — the negative exponent moves the decimal point **left** instead.',
                id: 'Bilangan positif berada dalam **notasi ilmiah** ketika ditulis $a \\times 10^n$ dengan $1 \\leq a < 10$ dan $n$ bilangan bulat. Jarak ke Proxima Centauri, sekitar $40{.}000{.}000{.}000{.}000$ km, adalah $4 \\times 10^{13}$ km — eksponen $13$ berarti "pindahkan titik desimal 13 tempat ke kanan." Massa atom hidrogen, sekitar $0{,}00000000000000000000000166$ g, adalah $1.66 \\times 10^{-24}$ g — eksponen negatif memindahkan titik desimal ke **kiri** sebagai gantinya.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Converting back, and computing', id: 'Mengonversi kembali, dan menghitung' },
              body: {
                en: 'Going the other way, $6.97 \\times 10^9 = 6{,}970{,}000{,}000$ (decimal point 9 places right), and $4.6271 \\times 10^{-6} = 0.0000046271$ (6 places left). Products and quotients combine the mantissas and add or subtract the exponents: $(3\\times10^5)(2\\times10^{-2}) = 6 \\times 10^{3} = 6000$.',
                id: 'Ke arah sebaliknya, $6.97 \\times 10^9 = 6{.}970{.}000{.}000$ (titik desimal 9 tempat ke kanan), dan $4.6271 \\times 10^{-6} = 0.0000046271$ (6 tempat ke kiri). Hasil kali dan bagi menggabungkan mantisanya dan menjumlah atau mengurangkan eksponennya: $(3\\times10^5)(2\\times10^{-2}) = 6 \\times 10^{3} = 6000$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which is written correctly in scientific notation?',
                id: 'Manakah yang ditulis benar dalam notasi ilmiah?',
              },
              options: [
                { en: '$3.52 \\times 10^5$', id: '$3.52 \\times 10^5$' },
                { en: '$35.2 \\times 10^4$', id: '$35.2 \\times 10^4$' },
                { en: '$0.352 \\times 10^6$', id: '$0.352 \\times 10^6$' },
                { en: '$3.52^5$', id: '$3.52^5$' },
              ],
              answer: 0,
              explain: {
                en: 'Scientific notation requires the mantissa to satisfy $1 \\leq a < 10$. $35.2$ is too big and $0.352$ is too small; $3.52^5$ isn\'t even the right form (it means $3.52$ raised to the 5th power, not times $10^5$).',
                id: 'Notasi ilmiah mensyaratkan mantisanya memenuhi $1 \\leq a < 10$. $35.2$ terlalu besar dan $0.352$ terlalu kecil; $3.52^5$ bahkan bukan bentuk yang tepat (artinya $3.52$ dipangkatkan 5, bukan dikali $10^5$).',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Write $56{,}920$ in scientific notation $5.692 \\times 10^n$, and find $n$.',
                id: 'Tulis $56{.}920$ dalam notasi ilmiah $5.692 \\times 10^n$, dan cari $n$.',
              },
              template: '56{,}920 = 5.692 \\times 10^n, \\quad n = ___',
              blanks: ['4'],
              explain: {
                en: 'Moving the decimal point from $56920.$ to between $5$ and $6$ takes $4$ places, so $n=4$.',
                id: 'Memindahkan titik desimal dari $56920.$ ke antara $5$ dan $6$ butuh $4$ tempat, sehingga $n=4$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'If $a = 3 \\times 10^5$ and $b = 2 \\times 10^{-2}$, find $a \\cdot b$.',
                id: 'Jika $a = 3 \\times 10^5$ dan $b = 2 \\times 10^{-2}$, cari $a \\cdot b$.',
              },
              blanks: [{ answer: 6000 }],
              hints: [
                { en: 'Multiply the mantissas and add the exponents: $(3\\cdot2)\\times10^{5+(-2)}$.', id: 'Kalikan mantisanya dan jumlahkan eksponennya: $(3\\cdot2)\\times10^{5+(-2)}$.' },
              ],
              explain: {
                en: '$a \\cdot b = 6 \\times 10^3 = 6000$.',
                id: '$a \\cdot b = 6 \\times 10^3 = 6000$.',
              },
            },
          ],
        },
        {
          id: 'dsr-m1-s2-l3',
          title: { en: 'Radicals and Rational Exponents', id: 'Akar dan Eksponen Rasional' },
          goal: {
            en: 'Simplify nth roots, define and use rational exponents, and rationalize a denominator.',
            id: 'Menyederhanakan akar ke-n, mendefinisikan dan memakai eksponen rasional, dan merasionalkan penyebut.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'nth roots, and simplifying them', id: 'Akar ke-n, dan menyederhanakannya' },
              body: {
                en: 'The **principal** $n$th root, $\\sqrt[n]{a}$, is the number $b$ with $b^n = a$ (and $b \\geq 0$ when $n$ is even, since an even power is never negative). Roots combine like this:\n$$\\sqrt[n]{ab} = \\sqrt[n]{a}\\sqrt[n]{b}, \\qquad \\sqrt[n]{a^n} = a \\ \\text{(n odd)}, \\qquad \\sqrt[n]{a^n} = |a| \\ \\text{(n even)}$$\nTo simplify $\\sqrt{32}$, pull out the largest perfect square factor: $\\sqrt{32} = \\sqrt{16 \\cdot 2} = \\sqrt{16}\\sqrt{2} = 4\\sqrt{2}$. Like radicals combine the way like terms do: $2\\sqrt{3} + 5\\sqrt{3} = 7\\sqrt{3}$.',
                id: '**Utama** — akar ke-$n$, $\\sqrt[n]{a}$, adalah bilangan $b$ dengan $b^n = a$ (dan $b \\geq 0$ ketika $n$ genap, sebab pangkat genap tak pernah negatif). Akar-akar bergabung seperti ini:\n$$\\sqrt[n]{ab} = \\sqrt[n]{a}\\sqrt[n]{b}, \\qquad \\sqrt[n]{a^n} = a \\ \\text{(n ganjil)}, \\qquad \\sqrt[n]{a^n} = |a| \\ \\text{(n genap)}$$\nUntuk menyederhanakan $\\sqrt{32}$, keluarkan faktor kuadrat sempurna terbesar: $\\sqrt{32} = \\sqrt{16 \\cdot 2} = \\sqrt{16}\\sqrt{2} = 4\\sqrt{2}$. Akar sejenis bergabung seperti suku sejenis: $2\\sqrt{3} + 5\\sqrt{3} = 7\\sqrt{3}$.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Rational exponents', id: 'Eksponen rasional' },
              body: {
                en: 'To make the exponent laws work for a fraction $\\frac{m}{n}$, we define:\n$$a^{m/n} = \\left(\\sqrt[n]{a}\\right)^m = \\sqrt[n]{a^m}$$\nSo $8^{2/3} = \\left(\\sqrt[3]{8}\\right)^2 = 2^2 = 4$, and $125^{-1/3} = \\frac{1}{\\sqrt[3]{125}} = \\frac{1}{5}$. Every law of exponents from the last lesson holds exactly as before, now with fractional exponents.',
                id: 'Agar hukum eksponen berlaku untuk pecahan $\\frac{m}{n}$, kita definisikan:\n$$a^{m/n} = \\left(\\sqrt[n]{a}\\right)^m = \\sqrt[n]{a^m}$$\nJadi $8^{2/3} = \\left(\\sqrt[3]{8}\\right)^2 = 2^2 = 4$, dan $125^{-1/3} = \\frac{1}{\\sqrt[3]{125}} = \\frac{1}{5}$. Setiap hukum eksponen dari pelajaran sebelumnya tetap berlaku persis seperti sebelumnya, kini dengan eksponen pecahan.',
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Rationalizing the denominator', id: 'Merasionalkan penyebut' },
              body: {
                en: 'A fraction is in **standard form** when its denominator has no radical. To clear $\\sqrt{a}$ from a denominator, multiply top and bottom by $\\sqrt{a}$ — this multiplies by $1$, so nothing changes value:\n$$\\frac{2}{\\sqrt{3}} = \\frac{2}{\\sqrt{3}} \\cdot \\frac{\\sqrt{3}}{\\sqrt{3}} = \\frac{2\\sqrt{3}}{3}$$\nFor an $n$th root $\\sqrt[n]{a^m}$ with $m<n$, multiply by $\\sqrt[n]{a^{n-m}}$ instead, since $\\sqrt[n]{a^m}\\sqrt[n]{a^{n-m}} = \\sqrt[n]{a^n} = a$.',
                id: 'Pecahan berada dalam **bentuk baku** ketika penyebutnya tak memuat akar. Untuk menghilangkan $\\sqrt{a}$ dari penyebut, kalikan pembilang dan penyebut dengan $\\sqrt{a}$ — ini mengalikan dengan $1$, sehingga nilainya tak berubah:\n$$\\frac{2}{\\sqrt{3}} = \\frac{2}{\\sqrt{3}} \\cdot \\frac{\\sqrt{3}}{\\sqrt{3}} = \\frac{2\\sqrt{3}}{3}$$\nUntuk akar ke-$n$ $\\sqrt[n]{a^m}$ dengan $m<n$, kalikan dengan $\\sqrt[n]{a^{n-m}}$ sebagai gantinya, sebab $\\sqrt[n]{a^m}\\sqrt[n]{a^{n-m}} = \\sqrt[n]{a^n} = a$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Evaluate $8^{2/3}$.',
                id: 'Hitung $8^{2/3}$.',
              },
              options: [
                { en: '$4$', id: '$4$' },
                { en: '$6$', id: '$6$' },
                { en: '$16$', id: '$16$' },
                { en: '$2$', id: '$2$' },
              ],
              answer: 0,
              explain: {
                en: '$8^{2/3} = (\\sqrt[3]{8})^2 = 2^2 = 4$.',
                id: '$8^{2/3} = (\\sqrt[3]{8})^2 = 2^2 = 4$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Simplify $\\sqrt{32}$.',
                id: 'Sederhanakan $\\sqrt{32}$.',
              },
              options: [
                { en: '$4\\sqrt{2}$', id: '$4\\sqrt{2}$' },
                { en: '$2\\sqrt{8}$', id: '$2\\sqrt{8}$' },
                { en: '$16\\sqrt{2}$', id: '$16\\sqrt{2}$' },
                { en: '$8\\sqrt{4}$', id: '$8\\sqrt{4}$' },
              ],
              answer: 0,
              explain: {
                en: 'The largest perfect-square factor of $32$ is $16$: $\\sqrt{32} = \\sqrt{16 \\cdot 2} = 4\\sqrt{2}$. $2\\sqrt{8}$ is numerically equal but not fully simplified, since $\\sqrt{8}$ itself still has a perfect-square factor.',
                id: 'Faktor kuadrat sempurna terbesar dari $32$ adalah $16$: $\\sqrt{32} = \\sqrt{16 \\cdot 2} = 4\\sqrt{2}$. $2\\sqrt{8}$ secara numerik sama tetapi belum sepenuhnya sederhana, sebab $\\sqrt{8}$ sendiri masih punya faktor kuadrat sempurna.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Rationalize the denominator of $\\dfrac{2}{\\sqrt{3}}$, keeping $3$ as the new denominator.',
                id: 'Rasionalkan penyebut dari $\\dfrac{2}{\\sqrt{3}}$, tetap memakai $3$ sebagai penyebut baru.',
              },
              template: '\\dfrac{2}{\\sqrt{3}} = ___ / 3',
              blanks: ['2*sqrt(3)'],
              explain: {
                en: 'Multiplying numerator and denominator by $\\sqrt{3}$ gives $\\frac{2\\sqrt{3}}{3}$.',
                id: 'Mengalikan pembilang dan penyebut dengan $\\sqrt{3}$ memberi $\\frac{2\\sqrt{3}}{3}$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Evaluate $27^{2/3}$.',
                id: 'Hitung $27^{2/3}$.',
              },
              blanks: [{ answer: 9 }],
              hints: [
                { en: '$27^{2/3} = (\\sqrt[3]{27})^2$.', id: '$27^{2/3} = (\\sqrt[3]{27})^2$.' },
              ],
              explain: {
                en: '$\\sqrt[3]{27}=3$, so $27^{2/3} = 3^2 = 9$.',
                id: '$\\sqrt[3]{27}=3$, sehingga $27^{2/3} = 3^2 = 9$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'dsr-m1-s2-p',
        runtime: 'math',
        title: { en: 'Exponents and Radicals in Practice', id: 'Eksponen dan Akar dalam Praktik' },
        brief: {
          en: 'A law-of-exponents simplification, a scientific-notation computation, and a rational-exponent evaluation.',
          id: 'Satu penyederhanaan hukum eksponen, satu perhitungan notasi ilmiah, dan satu evaluasi eksponen rasional.',
        },
        requirements: [
          { en: 'A negative exponent inverts the base; it never makes the result negative.', id: 'Eksponen negatif membalik basisnya; ia tak pernah membuat hasilnya negatif.' },
          { en: '$a^{m/n} = \\left(\\sqrt[n]{a}\\right)^m$.', id: '$a^{m/n} = \\left(\\sqrt[n]{a}\\right)^m$.' },
        ],
        tasks: [
          {
            prompt: { en: 'Simplify $2^3 \\cdot 2^{-1}$.', id: 'Sederhanakan $2^3 \\cdot 2^{-1}$.' },
            blanks: [{ answer: 4 }],
            solution: ['2^3 \\cdot 2^{-1} = 2^{3-1} = 2^2 = 4'],
          },
          {
            prompt: { en: 'Find $(3 \\times 10^4)(2 \\times 10^{-6})$.', id: 'Cari $(3 \\times 10^4)(2 \\times 10^{-6})$.' },
            blanks: [{ answer: 0.06 }],
            solution: ['(3 \\times 10^4)(2 \\times 10^{-6}) = 6 \\times 10^{-2} = 0.06'],
          },
          {
            prompt: { en: 'Evaluate $16^{3/4}$.', id: 'Hitung $16^{3/4}$.' },
            blanks: [{ answer: 8 }],
            solution: ['16^{3/4} = (\\sqrt[4]{16})^3 = 2^3 = 8'],
          },
        ],
        hints: [
          { en: 'For the middle task, multiply the mantissas and add the exponents of $10$ separately.', id: 'Untuk butir tengah, kalikan mantisanya dan jumlahkan eksponen $10$-nya secara terpisah.' },
        ],
        xp: 50,
      },
    },
  ],
}
