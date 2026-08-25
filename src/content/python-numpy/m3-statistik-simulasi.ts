import type { Module } from '../types'

/** Module 3 — descriptive statistics over an array, then a vectorized Monte
 *  Carlo estimate of π: no explicit loop, the comparison and the sum both
 *  run across the whole array at once. */
export const module3: Module = {
  id: 'pynum-m3',
  title: { en: 'Statistics and Simulation', id: 'Statistik dan Simulasi' },
  summary: {
    en: 'Summarize a dataset in three numbers, then let randomness and a large count estimate something exact.',
    id: 'Ringkas sebuah dataset dalam tiga angka, lalu biarkan keacakan dan hitungan besar menaksir sesuatu yang eksak.',
  },
  submodules: [
    /* --------------------------------------------------- 3.1 statistics */
    {
      id: 'pynum-m3-s1',
      title: { en: 'Statistics with NumPy', id: 'Statistik dengan NumPy' },
      summary: {
        en: 'mean, median, and std summarize a whole array in three numbers — and a comparison against the mean sorts it into two groups.',
        id: 'mean, median, dan std meringkas seluruh array dalam tiga angka — dan perbandingan terhadap rata-rata menggolongkannya jadi dua kelompok.',
      },
      lessons: [
        {
          id: 'pynum-m3-s1-l1',
          title: { en: 'mean, median, std', id: 'mean, median, std' },
          goal: { en: 'Summarize an array with three numbers.', id: 'Meringkas array dengan tiga angka.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The average, in one call', id: 'Rata-rata, dalam satu pemanggilan' },
              body: {
                en: '`np.mean(nilai)` adds every element and divides by how many there are — the same average from every math class, without writing the sum and the division out by hand.',
                id: '`np.mean(nilai)` menjumlahkan tiap unsur dan membaginya dengan banyaknya — rata-rata yang sama dari tiap pelajaran matematika, tanpa menulis jumlah dan pembagiannya secara manual.',
              },
              code: 'import numpy as np\nnilai = np.array([70, 80, 90])\nprint(np.mean(nilai))',
              output: '80.0',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The middle value, and how spread out things are', id: 'Nilai tengah, dan seberapa tersebar' },
              body: {
                en: '`np.median` is the middle value once everything is sorted — for an even count, the average of the two middle ones. `np.std` says how spread out the values typically are from the mean; a small std means the values cluster tightly.',
                id: '`np.median` adalah nilai tengah setelah semuanya diurutkan — untuk jumlah genap, rata-rata dari dua nilai tengahnya. `np.std` menyatakan seberapa tersebar nilai-nilainya biasanya dari rata-rata; std yang kecil berarti nilainya berkumpul rapat.',
              },
              code: 'import numpy as np\nnilai = np.array([70, 80, 90, 100])\nprint(np.median(nilai))\nprint(round(np.std(nilai), 2))',
              output: '85.0\n11.18',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is np.median(np.array([70, 80, 90]))?', id: 'Berapa np.median(np.array([70, 80, 90]))?' },
              options: [
                { en: '80.0', id: '80.0' },
                { en: '70.0', id: '70.0' },
                { en: '90.0', id: '90.0' },
                { en: '80', id: '80' },
              ],
              answer: 0,
              explain: {
                en: 'With three sorted values, the median is simply the one in the middle: 80.',
                id: 'Dengan tiga nilai terurut, mediannya sekadar yang di tengah: 80.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Compute the average of an array.',
                id: 'Hitung rata-rata sebuah array.',
              },
              template: 'import numpy as np\nnilai = np.array([10, 20, 30, 40])\nprint(np.___(nilai))',
              blanks: ['mean'],
              explain: {
                en: 'mean is the function under np.array that computes the average directly.',
                id: 'mean adalah fungsi di bawah np yang langsung menghitung rata-rata.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program printing the mean and median of an array.',
                id: 'Susun program yang mencetak rata-rata dan median sebuah array.',
              },
              lines: ['import numpy as np', 'nilai = np.array([5, 15, 25])', 'print(np.mean(nilai))', 'print(np.median(nilai))'],
              explain: {
                en: 'The array has to exist before either statistic can be computed from it.',
                id: 'Arraynya harus ada dulu sebelum statistik mana pun bisa dihitung darinya.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read `n`, then `n` numbers into array `nilai`. Print the mean, median, and standard deviation, each rounded to 2 decimal places, each on its own line.',
                id: 'Baca `n`, lalu `n` angka ke dalam array `nilai`. Cetak rata-rata, median, dan simpangan baku, masing-masing dibulatkan ke 2 angka desimal, di baris sendiri-sendiri.',
              },
              starter: 'import numpy as np\nn = int(input())\nnilai = np.array([float(input()) for _ in range(n)])\n',
              tests: [
                { name: { en: '70,80,90', id: '70,80,90' }, stdin: ['3', '70', '80', '90'], expectOutput: '80.0\n80.0\n8.16' },
                { name: { en: '60,70,80,90,100', id: '60,70,80,90,100' }, stdin: ['5', '60', '70', '80', '90', '100'], expectOutput: '80.0\n80.0\n14.14' },
                { name: { en: 'all equal', id: 'semua sama' }, stdin: ['4', '50', '50', '50', '50'], expectOutput: '50.0\n50.0\n0.0' },
              ],
              hints: [
                { en: 'round(float(np.mean(nilai)), 2) — the float() keeps round() happy with numpy\'s own number type.', id: 'round(float(np.mean(nilai)), 2) — float()-nya membuat round() nyaman dengan tipe angka numpy sendiri.' },
              ],
              solution:
                'import numpy as np\nn = int(input())\nnilai = np.array([float(input()) for _ in range(n)])\nprint(round(float(np.mean(nilai)), 2))\nprint(round(float(np.median(nilai)), 2))\nprint(round(float(np.std(nilai)), 2))',
            },
          ],
        },
        {
          id: 'pynum-m3-s1-l2',
          title: { en: 'Analyzing a Dataset', id: 'Menganalisis Dataset' },
          goal: { en: 'Sort a dataset into two groups by comparing it to its own mean.', id: 'Menggolongkan dataset jadi dua kelompok dengan membandingkannya ke rata-ratanya sendiri.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A comparison across a whole array', id: 'Perbandingan atas seluruh array' },
              body: {
                en: '`nilai > rata` compares every element to `rata` at once, producing an array of `True`/`False` the same size as `nilai` — one verdict per element, no loop written.',
                id: '`nilai > rata` membandingkan tiap unsur dengan `rata` sekaligus, menghasilkan array `True`/`False` seukuran `nilai` — satu vonis per unsur, tanpa perulangan yang ditulis.',
              },
              code: 'import numpy as np\nnilai = np.array([60, 70, 80, 90, 100])\nrata = np.mean(nilai)\ndi_atas = nilai > rata\nprint(di_atas)\nprint(np.sum(di_atas))',
              output: '[False False False  True  True]\n2',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'True counts as 1', id: 'True dihitung sebagai 1' },
              body: {
                en: '`np.sum` on a `True`/`False` array counts the `True`s, because Python treats `True` as `1` and `False` as `0` — that is exactly how the count above worked. Dividing that count by the total turns it into a percentage.',
                id: '`np.sum` pada array `True`/`False` menghitung yang `True`, karena Python memperlakukan `True` sebagai `1` dan `False` sebagai `0` — persis begitulah hitungan di atas bekerja. Membagi hitungan itu dengan totalnya mengubahnya jadi persentase.',
              },
              code: 'import numpy as np\nnilai = np.array([60, 70, 80, 90, 100])\nrata = np.mean(nilai)\ndi_atas = nilai > rata\npersen = np.sum(di_atas) / len(nilai) * 100\nprint(round(persen, 1))',
              output: '40.0',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'nilai = [50, 50, 50, 50]. What is np.sum(nilai > np.mean(nilai))?',
                id: 'nilai = [50, 50, 50, 50]. Berapa np.sum(nilai > np.mean(nilai))?',
              },
              options: [
                { en: '0', id: '0' },
                { en: '4', id: '4' },
                { en: '2', id: '2' },
                { en: 'An error', id: 'Error' },
              ],
              answer: 0,
              explain: {
                en: 'The mean of four equal values is that same value — nothing is strictly greater than it, so the count is 0.',
                id: 'Rata-rata dari empat nilai yang sama adalah nilai itu sendiri — tak ada yang secara tegas lebih besar darinya, jadi hitungannya 0.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Count how many values are below the mean.',
                id: 'Hitung berapa nilai yang di bawah rata-rata.',
              },
              template: 'import numpy as np\nnilai = np.array([40, 60, 80, 100])\nrata = np.mean(nilai)\ndi_bawah = nilai ___ rata\nprint(np.sum(di_bawah))',
              blanks: ['<'],
              explain: {
                en: '"Below" is the < comparison, the mirror image of the > used for "above".',
                id: '"Di bawah" adalah perbandingan <, kebalikan dari > yang dipakai untuk "di atas".',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program counting how many values equal the array\'s own mean.',
                id: 'Susun program yang menghitung berapa nilai yang sama dengan rata-rata arraynya sendiri.',
              },
              lines: ['import numpy as np', 'nilai = np.array([10, 10, 20, 30])', 'rata = np.mean(nilai)', 'print(np.sum(nilai == rata))'],
              explain: {
                en: 'rata has to be computed first — the comparison needs something to compare against.',
                id: 'rata harus dihitung dulu — perbandingannya butuh sesuatu untuk dibandingkan.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read `n`, then `n` numbers into array `nilai`. Print how many are strictly above the mean, as a percentage rounded to 1 decimal place.',
                id: 'Baca `n`, lalu `n` angka ke dalam array `nilai`. Cetak berapa yang secara tegas di atas rata-rata, sebagai persentase dibulatkan ke 1 angka desimal.',
              },
              starter: 'import numpy as np\nn = int(input())\nnilai = np.array([float(input()) for _ in range(n)])\n',
              tests: [
                { name: { en: '60,70,80,90,100', id: '60,70,80,90,100' }, stdin: ['5', '60', '70', '80', '90', '100'], expectOutput: '40.0' },
                { name: { en: 'all equal', id: 'semua sama' }, stdin: ['3', '50', '50', '50'], expectOutput: '0.0' },
                { name: { en: '40,60,80,100', id: '40,60,80,100' }, stdin: ['4', '40', '60', '80', '100'], expectOutput: '50.0' },
              ],
              hints: [
                { en: 'rata = np.mean(nilai); persen = np.sum(nilai > rata) / n * 100.', id: 'rata = np.mean(nilai); persen = np.sum(nilai > rata) / n * 100.' },
              ],
              solution:
                'import numpy as np\nn = int(input())\nnilai = np.array([float(input()) for _ in range(n)])\nrata = np.mean(nilai)\npersen = np.sum(nilai > rata) / n * 100\nprint(round(persen, 1))',
            },
          ],
        },
      ],
      project: {
        id: 'pynum-m3-s1-p',
        title: { en: 'Exam Score Summary', id: 'Ringkasan Statistik Nilai Ujian' },
        brief: {
          en: 'A finished statistical report on a set of exam scores: mean, median, spread, and how many did better than average.',
          id: 'Laporan statistik yang lengkap atas sekumpulan nilai ujian: rata-rata, median, sebaran, dan berapa yang lebih baik dari rata-rata.',
        },
        requirements: [
          { en: 'Read `n`, then `n` scores into array `nilai`.', id: 'Baca `n`, lalu `n` nilai ke dalam array `nilai`.' },
          { en: 'Print the mean, median, and standard deviation, each rounded to 2 decimal places.', id: 'Cetak rata-rata, median, dan simpangan baku, masing-masing dibulatkan ke 2 angka desimal.' },
          { en: 'Print how many scores are strictly above the mean, as a whole number.', id: 'Cetak berapa nilai yang secara tegas di atas rata-rata, sebagai bilangan bulat.' },
        ],
        starter: 'import numpy as np\nn = int(input())\nnilai = np.array([float(input()) for _ in range(n)])\n',
        tests: [
          { name: { en: '70,80,90', id: '70,80,90' }, stdin: ['3', '70', '80', '90'], expectOutput: '80.0\n80.0\n8.16\n1' },
          { name: { en: '60,70,80,90,100', id: '60,70,80,90,100' }, stdin: ['5', '60', '70', '80', '90', '100'], expectOutput: '80.0\n80.0\n14.14\n2' },
          { name: { en: 'all equal', id: 'semua sama' }, stdin: ['4', '50', '50', '50', '50'], expectOutput: '50.0\n50.0\n0.0\n0' },
          { name: { en: '40,60,80,100', id: '40,60,80,100' }, stdin: ['4', '40', '60', '80', '100'], expectOutput: '70.0\n70.0\n22.36\n2' },
        ],
        hints: [
          { en: 'Four print statements: mean, median, std, then np.sum(nilai > mean) as an int.', id: 'Empat pernyataan print: rata-rata, median, std, lalu np.sum(nilai > rata) sebagai int.' },
          { en: 'int(np.sum(...)) turns numpy\'s own integer type into a plain one for a clean print.', id: 'int(np.sum(...)) mengubah tipe bilangan bulat numpy sendiri jadi yang biasa untuk cetakan yang bersih.' },
        ],
        solution:
          'import numpy as np\nn = int(input())\nnilai = np.array([float(input()) for _ in range(n)])\nprint(round(float(np.mean(nilai)), 2))\nprint(round(float(np.median(nilai)), 2))\nprint(round(float(np.std(nilai)), 2))\nprint(int(np.sum(nilai > np.mean(nilai))))',
        xp: 50,
      },
    },

    /* -------------------------------------------------- 3.2 Monte Carlo */
    {
      id: 'pynum-m3-s2',
      title: { en: 'Monte Carlo Simulation', id: 'Simulasi Monte Carlo' },
      summary: {
        en: 'Scatter random points, count how many land somewhere specific, and let the ratio estimate something exact — no loop needed anywhere.',
        id: 'Sebarkan titik acak, hitung berapa yang mendarat di tempat tertentu, dan biarkan rasionya menaksir sesuatu yang eksak — tanpa perulangan di mana pun.',
      },
      lessons: [
        {
          id: 'pynum-m3-s2-l1',
          title: { en: 'np.random and Drawing Many Values at Once', id: 'np.random dan Pengambilan Acak Sekaligus' },
          goal: { en: 'Draw a whole array of random values in one call.', id: 'Mengambil satu array penuh nilai acak dalam satu pemanggilan.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'One call, many random values', id: 'Satu pemanggilan, banyak nilai acak' },
              body: {
                en: '`np.random.random(n)` draws `n` random values between 0 and 1 at once, into a single array — no loop appending one value at a time. `np.random.seed` reproduces a sequence, exactly like `random.seed` did earlier in this track, but for numpy\'s own separate generator.',
                id: '`np.random.random(n)` mengambil `n` nilai acak antara 0 dan 1 sekaligus, ke dalam satu array — tanpa perulangan yang menambahkan satu nilai setiap kali. `np.random.seed` membuat urutannya bisa diulang, persis seperti `random.seed` sebelumnya di jalur ini, tapi untuk generator numpy sendiri yang terpisah.',
              },
              code: 'import numpy as np\nnp.random.seed(1)\nprint(np.round(np.random.random(3), 2))',
              output: '[0.42 0.72 0.  ]',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Scaling into a different range', id: 'Menskalakan ke rentang berbeda' },
              body: {
                en: 'Values from `np.random.random` always fall between 0 and 1 — multiplying the whole array stretches that range. `* 10` spreads the same values across 0 to 10.',
                id: 'Nilai dari `np.random.random` selalu jatuh antara 0 dan 1 — mengalikan seluruh arraynya merentangkan jangkauan itu. `* 10` menyebarkan nilai yang sama ke rentang 0 sampai 10.',
              },
              code: 'import numpy as np\nnp.random.seed(0)\nangka = np.round(np.random.random(4) * 10, 1)\nprint(angka)',
              output: '[5.5 7.2 6.  5.4]',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Every value np.random.random() can ever produce falls in which range?',
                id: 'Setiap nilai yang bisa dihasilkan np.random.random() jatuh dalam rentang mana?',
              },
              options: [
                { en: '0 to 1', id: '0 sampai 1' },
                { en: '-1 to 1', id: '-1 sampai 1' },
                { en: '0 to 10', id: '0 sampai 10' },
                { en: 'Any whole number', id: 'Bilangan bulat mana pun' },
              ],
              answer: 0,
              explain: {
                en: 'random() always draws from 0 up to (but not including) 1 — every other range comes from scaling that afterward.',
                id: 'random() selalu mengambil dari 0 sampai (tapi tidak termasuk) 1 — rentang lain mana pun datang dari menskalakannya sesudahnya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Draw 5 random values at once.',
                id: 'Ambil 5 nilai acak sekaligus.',
              },
              template: 'import numpy as np\nnp.random.seed(2)\nnilai = np.random.___(5)\nprint(len(nilai))',
              blanks: ['random'],
              explain: {
                en: 'np.random.random(n) is the call that draws n values in one step.',
                id: 'np.random.random(n) adalah pemanggilan yang mengambil n nilai dalam satu langkah.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program drawing 6 reproducible random values between 0 and 1.',
                id: 'Susun program yang mengambil 6 nilai acak antara 0 dan 1 yang bisa diulang.',
              },
              lines: ['import numpy as np', 'np.random.seed(5)', 'nilai = np.random.random(6)', 'print(len(nilai))'],
              explain: {
                en: 'The seed has to be set before the first draw for the sequence to be reproducible.',
                id: 'Seed-nya harus ditetapkan sebelum pengambilan pertama supaya urutannya bisa diulang.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read a whole number `s` and a whole number `n`. Seed numpy\'s generator with `s`, then print the length of `np.random.random(n)`.',
                id: 'Baca bilangan bulat `s` dan bilangan bulat `n`. Seed generator numpy dengan `s`, lalu cetak panjang `np.random.random(n)`.',
              },
              starter: 'import numpy as np\ns = int(input())\nn = int(input())\n',
              tests: [
                { name: { en: 's=1, n=5', id: 's=1, n=5' }, stdin: ['1', '5'], expectOutput: '5' },
                { name: { en: 's=0, n=8', id: 's=0, n=8' }, stdin: ['0', '8'], expectOutput: '8' },
                { name: { en: 's=3, n=1', id: 's=3, n=1' }, stdin: ['3', '1'], expectOutput: '1' },
              ],
              hints: [
                { en: 'np.random.seed(s), then print(len(np.random.random(n))).', id: 'np.random.seed(s), lalu print(len(np.random.random(n))).' },
              ],
              solution: 'import numpy as np\ns = int(input())\nn = int(input())\nnp.random.seed(s)\nprint(len(np.random.random(n)))',
            },
          ],
        },
        {
          id: 'pynum-m3-s2-l2',
          title: { en: 'Estimating π with Random Points', id: 'Menaksir π dengan Titik Acak' },
          goal: { en: 'Estimate a geometric constant from the fraction of points inside a shape.', id: 'Menaksir konstanta geometris dari pecahan titik yang jatuh di dalam sebuah bentuk.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A quarter circle inside a square', id: 'Seperempat lingkaran di dalam persegi' },
              body: {
                en: 'Scatter points randomly inside a 1-by-1 square. A point `(x, y)` falls inside the quarter circle of radius 1 exactly when `x² + y² ≤ 1`. The quarter circle covers `π/4` of the square\'s area — so the *fraction* of points landing inside it estimates `π/4`, and multiplying that fraction by 4 estimates π itself.',
                id: 'Sebarkan titik secara acak di dalam persegi 1 kali 1. Titik `(x, y)` jatuh di dalam seperempat lingkaran berjari-jari 1 tepat ketika `x² + y² ≤ 1`. Seperempat lingkarannya mencakup `π/4` dari luas perseginya — jadi *pecahan* titik yang mendarat di dalamnya menaksir `π/4`, dan mengalikan pecahan itu dengan 4 menaksir π itu sendiri.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'No loop needed to check every point', id: 'Tak perlu perulangan untuk memeriksa tiap titik' },
              body: {
                en: '`x**2 + y**2 <= 1` compares every point in both arrays at once, the same as the "above the mean" check earlier — `di_dalam` ends up an array of True/False, one per point, and `np.sum` counts how many landed inside.',
                id: '`x**2 + y**2 <= 1` membandingkan tiap titik di kedua arraynya sekaligus, sama seperti pemeriksaan "di atas rata-rata" sebelumnya — `di_dalam` menjadi array True/False, satu per titik, dan `np.sum` menghitung berapa yang mendarat di dalam.',
              },
              code: 'import numpy as np\nnp.random.seed(0)\nx = np.random.random(8)\ny = np.random.random(8)\ndi_dalam = x**2 + y**2 <= 1\nprint(di_dalam)\nprint(np.sum(di_dalam))',
              output: '[False  True  True  True  True False  True  True]\n6',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: '8 points were scattered, 6 landed inside the quarter circle. What does 4 * 6 / 8 estimate?',
                id: '8 titik disebar, 6 mendarat di dalam seperempat lingkaran. Apa yang ditaksir oleh 4 * 6 / 8?',
              },
              options: [
                { en: 'π (roughly — 8 points is very few)', id: 'π (kasar — 8 titik sangat sedikit)' },
                { en: 'The radius of the circle', id: 'Jari-jari lingkarannya' },
                { en: 'The number of points outside', id: 'Jumlah titik di luar' },
                { en: 'Exactly π, no matter how few points', id: 'Tepat π, tak peduli seberapa sedikit titiknya' },
              ],
              answer: 0,
              explain: {
                en: 'It estimates π — roughly, since 8 points is a tiny sample. More points means a steadily better estimate.',
                id: 'Ia menaksir π — secara kasar, karena 8 titik adalah sampel yang sangat kecil. Lebih banyak titik berarti taksiran yang terus membaik.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Check which points land inside the quarter circle.',
                id: 'Periksa titik mana yang jatuh di dalam seperempat lingkaran.',
              },
              template: 'import numpy as np\nnp.random.seed(4)\nx = np.random.random(6)\ny = np.random.random(6)\ndi_dalam = x**2 + y**2 ___ 1\nprint(np.sum(di_dalam))',
              blanks: ['<='],
              explain: {
                en: 'Inside or exactly on the circle\'s edge is <= 1 for the squared distance from the origin.',
                id: 'Di dalam atau tepat di tepi lingkarannya adalah <= 1 untuk jarak terkuadrat dari titik asal.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program estimating π from 100 random points.',
                id: 'Susun program yang menaksir π dari 100 titik acak.',
              },
              lines: [
                'import numpy as np',
                'np.random.seed(1)',
                'x = np.random.random(100)',
                'y = np.random.random(100)',
                'di_dalam = x**2 + y**2 <= 1',
                'print(4 * np.sum(di_dalam) / 100)',
              ],
              explain: {
                en: 'Both coordinate arrays have to be drawn before the inside/outside check can compare them.',
                id: 'Kedua array koordinatnya harus diambil dulu sebelum pemeriksaan di-dalam/di-luar bisa membandingkannya.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read `s` and `n`. Seed with `s`, draw `x` and `y` as `n` random values each, and print 4 * (count inside) / n, rounded to 4 decimal places.',
                id: 'Baca `s` dan `n`. Seed dengan `s`, ambil `x` dan `y` masing-masing `n` nilai acak, dan cetak 4 * (hitungan di dalam) / n, dibulatkan ke 4 angka desimal.',
              },
              starter: 'import numpy as np\ns = int(input())\nn = int(input())\nnp.random.seed(s)\n',
              tests: [
                { name: { en: 's=0, n=8 → 3.0', id: 's=0, n=8 → 3.0' }, stdin: ['0', '8'], expectOutput: '3.0' },
                { name: { en: 's=2, n=8 → 3.5', id: 's=2, n=8 → 3.5' }, stdin: ['2', '8'], expectOutput: '3.5' },
                { name: { en: 's=3, n=10 → 3.2', id: 's=3, n=10 → 3.2' }, stdin: ['3', '10'], expectOutput: '3.2' },
                { name: { en: 's=4, n=10 → 2.4', id: 's=4, n=10 → 2.4' }, stdin: ['4', '10'], expectOutput: '2.4' },
              ],
              hints: [
                { en: 'x = np.random.random(n); y = np.random.random(n); di_dalam = x**2 + y**2 <= 1.', id: 'x = np.random.random(n); y = np.random.random(n); di_dalam = x**2 + y**2 <= 1.' },
              ],
              solution:
                'import numpy as np\ns = int(input())\nn = int(input())\nnp.random.seed(s)\nx = np.random.random(n)\ny = np.random.random(n)\ndi_dalam = x**2 + y**2 <= 1\nprint(round(4 * np.sum(di_dalam) / n, 4))',
            },
          ],
        },
      ],
      project: {
        id: 'pynum-m3-s2-p',
        title: { en: 'Monte Carlo Estimate of π', id: 'Estimasi π dengan Monte Carlo' },
        brief: {
          en: 'The complete simulation from this submodule\'s lessons, as a standalone project: scatter points, count, and estimate.',
          id: 'Simulasi lengkap dari pelajaran submodul ini, sebagai proyek berdiri sendiri: sebarkan titik, hitung, dan taksir.',
        },
        requirements: [
          { en: 'Read a whole number `s` (seed) and a whole number `n` (point count).', id: 'Baca bilangan bulat `s` (seed) dan bilangan bulat `n` (banyak titik).' },
          { en: 'Seed numpy\'s generator with `s`, then draw `x` and `y`, each `n` random values.', id: 'Seed generator numpy dengan `s`, lalu ambil `x` dan `y`, masing-masing `n` nilai acak.' },
          { en: 'Print 4 times the fraction of points with `x² + y² ≤ 1`, rounded to 4 decimal places.', id: 'Cetak 4 kali pecahan titik dengan `x² + y² ≤ 1`, dibulatkan ke 4 angka desimal.' },
        ],
        starter: 'import numpy as np\ns = int(input())\nn = int(input())\nnp.random.seed(s)\n',
        tests: [
          { name: { en: 's=0, n=8 → 3.0', id: 's=0, n=8 → 3.0' }, stdin: ['0', '8'], expectOutput: '3.0' },
          { name: { en: 's=2, n=8 → 3.5', id: 's=2, n=8 → 3.5' }, stdin: ['2', '8'], expectOutput: '3.5' },
          { name: { en: 's=3, n=10 → 3.2', id: 's=3, n=10 → 3.2' }, stdin: ['3', '10'], expectOutput: '3.2' },
          { name: { en: 's=4, n=10 → 2.4', id: 's=4, n=10 → 2.4' }, stdin: ['4', '10'], expectOutput: '2.4' },
        ],
        hints: [
          { en: 'Exactly the formula from this submodule\'s own lessons — no loop anywhere.', id: 'Persis formula dari pelajaran submodul ini sendiri — tanpa perulangan di mana pun.' },
        ],
        solution:
          'import numpy as np\ns = int(input())\nn = int(input())\nnp.random.seed(s)\nx = np.random.random(n)\ny = np.random.random(n)\ndi_dalam = x**2 + y**2 <= 1\nprint(round(4 * np.sum(di_dalam) / n, 4))',
        xp: 50,
      },
    },
  ],
}
