import type { Module } from '../types'

/** Module 2 — when two things are in the same place, and what to do about it. */

export const module2: Module = {
  id: 'gd-m2',
  title: { en: 'When Things Touch', id: 'Ketika Benda Bersentuhan' },
  summary: {
    en: 'Overlap tests for boxes and circles, bouncing, and a list of things that comes and goes.',
    id: 'Uji tumpang tindih untuk kotak dan lingkaran, pemantulan, dan daftar benda yang datang dan pergi.',
  },
  submodules: [
    {
      id: 'gd-m2-s1',
      title: { en: 'Boxes and Circles', id: 'Kotak dan Lingkaran' },
      summary: {
        en: 'Two shapes, two overlap tests, and the arithmetic behind each.',
        id: 'Dua bentuk, dua uji tumpang tindih, dan hitungan di balik masing-masing.',
      },
      lessons: [
        {
          id: 'gd-m2-s1-l1',
          title: { en: 'Do two boxes overlap?', id: 'Apakah dua kotak bertumpang tindih?' },
          goal: { en: 'Write the box overlap test and use it.', id: 'Menulis uji tumpang tindih kotak dan memakainya.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Ask when they do NOT overlap', id: 'Tanyakan kapan mereka TIDAK bertumpang tindih' },
              body: {
                en: 'Two rectangles miss each other when one is entirely left of the other, or entirely right, or entirely above, or entirely below. Four simple cases. They overlap exactly when **none** of those four is true — which is much easier to get right than trying to enumerate the ways they can touch.',
                id: 'Dua persegi panjang saling luput ketika yang satu sepenuhnya di kiri yang lain, atau sepenuhnya di kanan, atau sepenuhnya di atas, atau sepenuhnya di bawah. Empat kasus sederhana. Keduanya bertumpang tindih tepat ketika **tak satu pun** dari keempatnya benar — dan itu jauh lebih mudah dibuat benar daripada mencoba mendaftar segala cara mereka bisa bersentuhan.',
              },
              code:
                'a sepenuhnya di kiri b   ->  a.x + a.l <= b.x\n' +
                'a sepenuhnya di kanan b  ->  a.x       >= b.x + b.l\n' +
                'a sepenuhnya di atas b   ->  a.y + a.t <= b.y\n' +
                'a sepenuhnya di bawah b  ->  a.y       >= b.y + b.t',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Turned around, it is four comparisons', id: 'Dibalik, ia jadi empat perbandingan' },
              body: {
                en: 'Negate all four and you get the test everybody writes. Note it says `<` and `>`, not `<=` and `>=`: two boxes that merely share an edge are touching, not overlapping. Which one you want is a design decision — but it should be a decision, not an accident.',
                id: 'Ingkarkan keempatnya dan kamu mendapat uji yang ditulis semua orang. Perhatikan ia memakai `<` dan `>`, bukan `<=` dan `>=`: dua kotak yang sekadar berbagi tepi itu bersentuhan, bukan bertumpang tindih. Yang mana yang kamu mau adalah keputusan desain — tetapi ia harus jadi keputusan, bukan kecelakaan.',
              },
              code:
                'def tabrakan(a, b):\n' +
                '    return (\n' +
                '        a["x"] < b["x"] + b["l"]\n' +
                '        and a["x"] + a["l"] > b["x"]\n' +
                '        and a["y"] < b["y"] + b["t"]\n' +
                '        and a["y"] + a["t"] > b["y"]\n' +
                '    )',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'A box is four numbers, wherever it came from', id: 'Kotak adalah empat angka, dari mana pun asalnya' },
              body: {
                en: 'The state does not have to store boxes. Build one where you need it, out of whatever the state does keep — the player position, a coin position, a constant size. The overlap test does not care where the numbers came from, and that keeps it a function you can test on its own.',
                id: 'Keadaannya tak harus menyimpan kotak. Bangun satu di tempat kamu membutuhkannya, dari apa pun yang memang disimpan keadaannya — posisi pemain, posisi koin, ukuran yang tetap. Uji tumpang tindihnya tak peduli angkanya datang dari mana, dan itu menjaganya tetap jadi fungsi yang bisa kamu uji sendiri.',
              },
              code:
                'pemain = {"x": keadaan["x"], "y": keadaan["y"], "l": 20, "t": 20}\n' +
                'koin = {"x": kx, "y": ky, "l": 16, "t": 16}\n\n' +
                'if tabrakan(pemain, koin):\n' +
                '    skor = skor + 1',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Box A runs from x 0 to 10. Box B runs from x 10 to 20. Same rows. Does `tabrakan` say yes?',
                id: 'Kotak A membentang dari x 0 sampai 10. Kotak B dari x 10 sampai 20. Barisnya sama. Apakah `tabrakan` menjawab ya?',
              },
              options: [
                { en: 'No — they share an edge but do not overlap', id: 'Tidak — keduanya berbagi tepi tetapi tidak bertumpang tindih' },
                { en: 'Yes — they are touching', id: 'Ya — keduanya bersentuhan' },
                { en: 'It depends on which is checked first', id: 'Tergantung mana yang diperiksa duluan' },
                { en: 'Only if they are the same size', id: 'Hanya kalau ukurannya sama' },
              ],
              answer: 0,
              explain: {
                en: '`a["x"] + a["l"] > b["x"]` is `10 > 10`, which is false. Strict comparisons mean an edge is not an overlap.',
                id: '`a["x"] + a["l"] > b["x"]` menjadi `10 > 10`, yang salah. Perbandingan ketat berarti sebuah tepi bukanlah tumpang tindih.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the first two of the four comparisons.',
                id: 'Lengkapi dua dari empat perbandingannya.',
              },
              template: 'a["x"] ___ b["x"] + b["l"] and a["x"] + a["l"] ___ b["x"]',
              blanks: ['<', '>'],
              explain: {
                en: 'A starts before B ends, and A ends after B starts.',
                id: 'A mulai sebelum B berakhir, dan A berakhir setelah B mulai.',
              },
            },
            {
              kind: 'game',
              id: 'g1',
              prompt: {
                en: 'Write `tabrakan(a, b)` for two boxes, then use it: a 20 by 20 player moves at 140 pixels per second and stays on the field, and touching the 16 by 16 coin scores a point and sends the coin to the next spot in `TITIK`.',
                id: 'Tulis `tabrakan(a, b)` untuk dua kotak, lalu pakai: pemain 20 kali 20 bergerak 140 piksel per detik dan tetap di lapangan, dan menyentuh koin 16 kali 16 menambah satu poin serta mengirim koinnya ke titik berikutnya di `TITIK`.',
              },
              starter:
                'TITIK = [(250, 40), (40, 180), (270, 190), (150, 60)]\n' +
                'LAJU = 140\n' +
                'SISI = 20\n' +
                'KOIN = 16\n\n' +
                'def tabrakan(a, b):\n' +
                '    return False\n\n' +
                'def awal():\n' +
                '    return {"x": 160.0, "y": 120.0, "koin": 0, "skor": 0}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    x = keadaan["x"]\n' +
                '    y = keadaan["y"]\n' +
                '    if "kiri" in tombol:\n' +
                '        x = x - LAJU * dt\n' +
                '    if "kanan" in tombol:\n' +
                '        x = x + LAJU * dt\n' +
                '    if "atas" in tombol:\n' +
                '        y = y - LAJU * dt\n' +
                '    if "bawah" in tombol:\n' +
                '        y = y + LAJU * dt\n' +
                '    x = max(0, min(320 - SISI, x))\n' +
                '    y = max(0, min(240 - SISI, y))\n' +
                '    return {"x": x, "y": y, "koin": keadaan["koin"], "skor": keadaan["skor"]}\n\n' +
                'def gambar(keadaan):\n' +
                '    kx, ky = TITIK[keadaan["koin"]]\n' +
                '    return [\n' +
                '        {"bentuk": "kotak", "x": kx, "y": ky, "l": KOIN, "t": KOIN, "warna": "#f5c65b"},\n' +
                '        {"bentuk": "kotak", "x": keadaan["x"], "y": keadaan["y"], "l": SISI, "t": SISI, "warna": "#24463d"},\n' +
                '        {"bentuk": "teks", "x": 8, "y": 8, "isi": "Skor: " + str(keadaan["skor"]), "warna": "#24463d"},\n' +
                '    ]\n',
              tests: [
                {
                  name: { en: 'Overlapping boxes are a hit', id: 'Kotak yang bertumpang tindih itu kena' },
                  assert:
                    'a = {"x": 0, "y": 0, "l": 10, "t": 10}\n' +
                    'assert tabrakan(a, {"x": 5, "y": 5, "l": 10, "t": 10}) is True or tabrakan(a, {"x": 5, "y": 5, "l": 10, "t": 10}), "kotak yang jelas bertindihan harus kena"\n' +
                    'assert tabrakan(a, {"x": -5, "y": -5, "l": 10, "t": 10}), "bertindihan dari kiri atas juga harus kena"\n' +
                    'besar = {"x": 0, "y": 0, "l": 100, "t": 100}\n' +
                    'assert tabrakan(besar, {"x": 40, "y": 40, "l": 5, "t": 5}), "kotak kecil di dalam kotak besar harus kena"\n' +
                    'assert tabrakan({"x": 40, "y": 40, "l": 5, "t": 5}, besar), "urutannya tidak boleh berpengaruh"',
                },
                {
                  name: { en: 'Separated boxes are not', id: 'Kotak yang terpisah tidak' },
                  assert:
                    'a = {"x": 0, "y": 0, "l": 10, "t": 10}\n' +
                    'assert not tabrakan(a, {"x": 11, "y": 0, "l": 10, "t": 10}), "ada celah di kanan, tidak boleh kena"\n' +
                    'assert not tabrakan(a, {"x": -11, "y": 0, "l": 10, "t": 10}), "ada celah di kiri, tidak boleh kena"\n' +
                    'assert not tabrakan(a, {"x": 0, "y": 11, "l": 10, "t": 10}), "ada celah di bawah, tidak boleh kena"\n' +
                    'assert not tabrakan(a, {"x": 0, "y": -11, "l": 10, "t": 10}), "ada celah di atas, tidak boleh kena"',
                },
                {
                  name: { en: 'A shared edge is not an overlap', id: 'Tepi yang dibagi bukan tumpang tindih' },
                  assert:
                    'a = {"x": 0, "y": 0, "l": 10, "t": 10}\n' +
                    'assert not tabrakan(a, {"x": 10, "y": 0, "l": 10, "t": 10}), "bersentuhan tepat di tepi kanan tidak boleh kena"\n' +
                    'assert not tabrakan(a, {"x": 0, "y": 10, "l": 10, "t": 10}), "bersentuhan tepat di tepi bawah tidak boleh kena"',
                },
                {
                  name: { en: 'Overlapping across only one axis is not enough', id: 'Bertindihan di satu sumbu saja tidak cukup' },
                  assert:
                    'a = {"x": 0, "y": 0, "l": 10, "t": 10}\n' +
                    'assert not tabrakan(a, {"x": 5, "y": 50, "l": 10, "t": 10}), "x bertindihan tapi y jauh: tidak kena"\n' +
                    'assert not tabrakan(a, {"x": 50, "y": 5, "l": 10, "t": 10}), "y bertindihan tapi x jauh: tidak kena"',
                },
                {
                  name: { en: 'Standing on the coin scores', id: 'Berdiri di atas koin menambah skor' },
                  assert:
                    'kx, ky = TITIK[0]\n' +
                    'k = perbarui({"x": float(kx), "y": float(ky), "koin": 0, "skor": 0}, set(), 1 / 60)\n' +
                    'assert k["skor"] == 1, f"harus menambah skor, sekarang: {k[\'skor\']}"\n' +
                    'assert k["koin"] == 1, f"koinnya harus pindah ke titik berikutnya, sekarang: {k[\'koin\']}"',
                },
                {
                  name: { en: 'Standing anywhere else does not', id: 'Berdiri di tempat lain tidak' },
                  assert:
                    'k = perbarui({"x": 5.0, "y": 5.0, "koin": 0, "skor": 0}, set(), 1 / 60)\n' +
                    'assert k["skor"] == 0, f"jauh dari koin, skor harus tetap 0, sekarang: {k[\'skor\']}"\n' +
                    'assert k["koin"] == 0, f"koinnya tidak boleh pindah, sekarang: {k[\'koin\']}"',
                },
                {
                  name: { en: 'The coin cycles back to the start', id: 'Koinnya berputar kembali ke awal' },
                  assert:
                    'terakhir = len(TITIK) - 1\n' +
                    'kx, ky = TITIK[terakhir]\n' +
                    'k = perbarui({"x": float(kx), "y": float(ky), "koin": terakhir, "skor": 9}, set(), 1 / 60)\n' +
                    'assert k["koin"] == 0, f"setelah titik terakhir harus kembali ke 0, sekarang: {k[\'koin\']}"\n' +
                    'assert k["skor"] == 10, f"skornya harus 10, sekarang: {k[\'skor\']}"',
                },
                {
                  name: { en: 'The player still moves and stays on the field', id: 'Pemainnya tetap bergerak dan tetap di lapangan' },
                  assert:
                    'k = perbarui({"x": 100.0, "y": 100.0, "koin": 0, "skor": 0}, {"kanan"}, 0.5)\n' +
                    'assert abs(k["x"] - 170) < 1e-9, f"kanan setengah detik harus 170, sekarang: {k[\'x\']}"\n' +
                    'b = perbarui({"x": 310.0, "y": 100.0, "koin": 0, "skor": 0}, {"kanan"}, 1.0)\n' +
                    'assert abs(b["x"] - 300) < 1e-9, f"harus terjepit di 300, sekarang: {b[\'x\']}"',
                },
                {
                  name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
                  assert:
                    'kx, ky = TITIK[0]\n' +
                    'k = {"x": float(kx), "y": float(ky), "koin": 0, "skor": 0}\n' +
                    'salinan = dict(k)\n' +
                    'perbarui(k, set(), 1 / 60)\n' +
                    'assert k == salinan, f"perbarui tidak boleh mengubah keadaan yang diberikan, sekarang jadi: {k}"',
                },
              ],
              hints: [
                { en: 'The movement is already written. Only `tabrakan` and the scoring are missing.', id: 'Gerakannya sudah tertulis. Yang kurang hanya `tabrakan` dan penskorannya.' },
                { en: 'Four comparisons joined with `and`, all strict.', id: 'Empat perbandingan digabung dengan `and`, semuanya ketat.' },
                { en: 'Build both boxes after the player has moved, then compare them.', id: 'Bangun kedua kotaknya setelah pemainnya bergerak, lalu bandingkan.' },
                { en: 'Wrap the coin index with the remainder: `(koin + 1) % len(TITIK)`.', id: 'Putar indeks koinnya dengan sisa bagi: `(koin + 1) % len(TITIK)`.' },
              ],
              solution:
                'TITIK = [(250, 40), (40, 180), (270, 190), (150, 60)]\n' +
                'LAJU = 140\n' +
                'SISI = 20\n' +
                'KOIN = 16\n\n' +
                'def tabrakan(a, b):\n' +
                '    return (\n' +
                '        a["x"] < b["x"] + b["l"]\n' +
                '        and a["x"] + a["l"] > b["x"]\n' +
                '        and a["y"] < b["y"] + b["t"]\n' +
                '        and a["y"] + a["t"] > b["y"]\n' +
                '    )\n\n' +
                'def awal():\n' +
                '    return {"x": 160.0, "y": 120.0, "koin": 0, "skor": 0}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    x = keadaan["x"]\n' +
                '    y = keadaan["y"]\n' +
                '    if "kiri" in tombol:\n' +
                '        x = x - LAJU * dt\n' +
                '    if "kanan" in tombol:\n' +
                '        x = x + LAJU * dt\n' +
                '    if "atas" in tombol:\n' +
                '        y = y - LAJU * dt\n' +
                '    if "bawah" in tombol:\n' +
                '        y = y + LAJU * dt\n' +
                '    x = max(0, min(320 - SISI, x))\n' +
                '    y = max(0, min(240 - SISI, y))\n\n' +
                '    koin = keadaan["koin"]\n' +
                '    skor = keadaan["skor"]\n' +
                '    kx, ky = TITIK[koin]\n' +
                '    if tabrakan(\n' +
                '        {"x": x, "y": y, "l": SISI, "t": SISI},\n' +
                '        {"x": kx, "y": ky, "l": KOIN, "t": KOIN},\n' +
                '    ):\n' +
                '        skor = skor + 1\n' +
                '        koin = (koin + 1) % len(TITIK)\n\n' +
                '    return {"x": x, "y": y, "koin": koin, "skor": skor}\n\n' +
                'def gambar(keadaan):\n' +
                '    kx, ky = TITIK[keadaan["koin"]]\n' +
                '    return [\n' +
                '        {"bentuk": "kotak", "x": kx, "y": ky, "l": KOIN, "t": KOIN, "warna": "#f5c65b"},\n' +
                '        {"bentuk": "kotak", "x": keadaan["x"], "y": keadaan["y"], "l": SISI, "t": SISI, "warna": "#24463d"},\n' +
                '        {"bentuk": "teks", "x": 8, "y": 8, "isi": "Skor: " + str(keadaan["skor"]), "warna": "#24463d"},\n' +
                '    ]\n',
            },
          ],
        },
        {
          id: 'gd-m2-s1-l2',
          title: { en: 'Round things', id: 'Benda bundar' },
          goal: { en: 'Use distance to test two circles.', id: 'Memakai jarak untuk menguji dua lingkaran.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Circles are easier than boxes', id: 'Lingkaran lebih mudah daripada kotak' },
              body: {
                en: 'Two circles overlap when the distance between their centres is less than the sum of their radii. One comparison, no cases, and it works at any angle — which is why round hitboxes are so common even in games drawn entirely out of squares.',
                id: 'Dua lingkaran bertumpang tindih ketika jarak antara pusatnya kurang dari jumlah jari-jarinya. Satu perbandingan, tanpa kasus, dan berlaku di sudut mana pun — dan itulah sebabnya kotak tabrak bundar begitu umum bahkan di game yang seluruhnya digambar dari persegi.',
              },
              code:
                'import math\n\n' +
                'def jarak(x1, y1, x2, y2):\n' +
                '    return math.hypot(x2 - x1, y2 - y1)\n\n' +
                'def sentuh(a, b):\n' +
                '    return jarak(a["x"], a["y"], b["x"], b["y"]) < a["r"] + b["r"]',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'hypot is the distance formula', id: 'hypot adalah rumus jaraknya' },
              body: {
                en: '`math.hypot(dx, dy)` is `sqrt(dx*dx + dy*dy)`, written once and correct. It is the length of the straight line between two points — the same Pythagoras you already know, with the squaring and the square root already in the box.',
                id: '`math.hypot(dx, dy)` adalah `sqrt(dx*dx + dy*dy)`, ditulis sekali dan sudah benar. Ia panjang garis lurus antara dua titik — Pythagoras yang sudah kamu kenal, dengan pengkuadratan dan akarnya sudah ada di dalam kotaknya.',
              },
              code:
                'jarak(0, 0, 3, 4)    # 5.0\n' +
                'jarak(10, 10, 10, 15) # 5.0',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Which shape should you use?', id: 'Bentuk mana yang sebaiknya kamu pakai?' },
              body: {
                en: 'Neither is more correct — the hitbox is a lie either way, and the question is which lie the player will forgive. Boxes suit things that stack and sit on ledges; circles suit things that fly and bump. Most games use whichever is kinder to the player and never mention it.',
                id: 'Tak satu pun lebih benar — kotak tabraknya toh sama-sama kebohongan, dan pertanyaannya kebohongan mana yang akan dimaafkan pemain. Kotak cocok untuk benda yang bertumpuk dan bertengger di tepian; lingkaran cocok untuk benda yang terbang dan berbenturan. Kebanyakan game memakai mana pun yang lebih ramah bagi pemain dan tak pernah menyebutkannya.',
              },
              code:
                '# pemain bundar, benda bundar: satu perbandingan\n' +
                'if sentuh(pemain, benda):\n' +
                '    skor = skor + 1',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Two circles of radius 5 have centres 10 apart. Do they overlap?',
                id: 'Dua lingkaran berjari-jari 5 pusatnya berjarak 10. Apakah keduanya bertumpang tindih?',
              },
              options: [
                { en: 'No — they touch at exactly one point', id: 'Tidak — keduanya bersentuhan tepat di satu titik' },
                { en: 'Yes', id: 'Ya' },
                { en: 'Only if they are the same colour', id: 'Hanya kalau warnanya sama' },
                { en: 'There is not enough information', id: 'Informasinya tidak cukup' },
              ],
              answer: 0,
              explain: {
                en: '`10 < 5 + 5` is false. As with boxes, a strict comparison means touching is not overlapping.',
                id: '`10 < 5 + 5` itu salah. Seperti pada kotak, perbandingan ketat berarti bersentuhan bukanlah bertumpang tindih.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble the circle overlap test.',
                id: 'Susun uji tumpang tindih lingkarannya.',
              },
              lines: [
                'import math',
                'def jarak(x1, y1, x2, y2):',
                '    return math.hypot(x2 - x1, y2 - y1)',
                'def sentuh(a, b):',
                '    return jarak(a["x"], a["y"], b["x"], b["y"]) < a["r"] + b["r"]',
              ],
              explain: {
                en: 'The import first, then the helper, then the thing that uses it.',
                id: 'Import-nya dulu, lalu pembantunya, lalu yang memakainya.',
              },
            },
            {
              kind: 'game',
              id: 'g1',
              prompt: {
                en: 'Write `jarak` and `sentuh`, then a collector: a circle of radius 10 moves at 150 pixels per second and picks up a dot of radius 6, which moves on to the next spot in `TITIK` and adds a point.',
                id: 'Tulis `jarak` dan `sentuh`, lalu sebuah pengumpul: lingkaran berjari-jari 10 bergerak 150 piksel per detik dan memungut titik berjari-jari 6, yang lalu pindah ke titik berikutnya di `TITIK` dan menambah satu poin.',
              },
              starter:
                'import math\n\n' +
                'TITIK = [(260, 60), (60, 180), (250, 200), (80, 50)]\n' +
                'LAJU = 150\n' +
                'JARI = 10\n' +
                'BUTIR = 6\n\n' +
                'def jarak(x1, y1, x2, y2):\n' +
                '    return 0.0\n\n' +
                'def sentuh(a, b):\n' +
                '    return False\n\n' +
                'def awal():\n' +
                '    return {"x": 160.0, "y": 120.0, "butir": 0, "skor": 0}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    x = keadaan["x"]\n' +
                '    y = keadaan["y"]\n' +
                '    if "kiri" in tombol:\n' +
                '        x = x - LAJU * dt\n' +
                '    if "kanan" in tombol:\n' +
                '        x = x + LAJU * dt\n' +
                '    if "atas" in tombol:\n' +
                '        y = y - LAJU * dt\n' +
                '    if "bawah" in tombol:\n' +
                '        y = y + LAJU * dt\n' +
                '    x = max(JARI, min(320 - JARI, x))\n' +
                '    y = max(JARI, min(240 - JARI, y))\n' +
                '    return {"x": x, "y": y, "butir": keadaan["butir"], "skor": keadaan["skor"]}\n\n' +
                'def gambar(keadaan):\n' +
                '    bx, by = TITIK[keadaan["butir"]]\n' +
                '    return [\n' +
                '        {"bentuk": "lingkaran", "x": bx, "y": by, "r": BUTIR, "warna": "#f5c65b"},\n' +
                '        {"bentuk": "lingkaran", "x": keadaan["x"], "y": keadaan["y"], "r": JARI, "warna": "#24463d"},\n' +
                '        {"bentuk": "teks", "x": 8, "y": 8, "isi": "Skor: " + str(keadaan["skor"]), "warna": "#24463d"},\n' +
                '    ]\n',
              tests: [
                {
                  name: { en: 'The distance is right', id: 'Jaraknya benar' },
                  assert:
                    'assert abs(jarak(0, 0, 3, 4) - 5) < 1e-9, f"jarak(0,0,3,4) harus 5, sekarang: {jarak(0, 0, 3, 4)}"\n' +
                    'assert abs(jarak(10, 10, 10, 10)) < 1e-9, f"titik yang sama harus 0, sekarang: {jarak(10, 10, 10, 10)}"\n' +
                    'assert abs(jarak(5, 5, 1, 2) - 5) < 1e-9, f"jarak(5,5,1,2) harus 5, sekarang: {jarak(5, 5, 1, 2)}"\n' +
                    'assert abs(jarak(3, 4, 0, 0) - 5) < 1e-9, "arahnya tidak boleh berpengaruh — jarak tidak pernah negatif"',
                },
                {
                  name: { en: 'Overlapping circles touch', id: 'Lingkaran yang bertindihan bersentuhan' },
                  assert:
                    'a = {"x": 0, "y": 0, "r": 5}\n' +
                    'assert sentuh(a, {"x": 6, "y": 0, "r": 5}), "pusat berjarak 6, jumlah jari-jari 10: harus kena"\n' +
                    'assert sentuh(a, {"x": 0, "y": 0, "r": 1}), "pusat yang sama harus kena"\n' +
                    'assert sentuh({"x": 6, "y": 0, "r": 5}, a), "urutannya tidak boleh berpengaruh"',
                },
                {
                  name: { en: 'Distant ones do not', id: 'Yang berjauhan tidak' },
                  assert:
                    'a = {"x": 0, "y": 0, "r": 5}\n' +
                    'assert not sentuh(a, {"x": 11, "y": 0, "r": 5}), "pusat berjarak 11, jumlah jari-jari 10: tidak kena"\n' +
                    'assert not sentuh(a, {"x": 8, "y": 8, "r": 5}), "menyerong dan terlalu jauh: tidak kena"',
                },
                {
                  name: { en: 'Exactly touching is not overlapping', id: 'Bersentuhan tepat bukan bertumpang tindih' },
                  assert:
                    'a = {"x": 0, "y": 0, "r": 5}\n' +
                    'assert not sentuh(a, {"x": 10, "y": 0, "r": 5}), "berjarak tepat 10 dengan jumlah jari-jari 10 tidak boleh kena"',
                },
                {
                  name: { en: 'Landing on the dot scores', id: 'Mendarat di butirnya menambah skor' },
                  assert:
                    'bx, by = TITIK[0]\n' +
                    'k = perbarui({"x": float(bx), "y": float(by), "butir": 0, "skor": 0}, set(), 1 / 60)\n' +
                    'assert k["skor"] == 1, f"harus menambah skor, sekarang: {k[\'skor\']}"\n' +
                    'assert k["butir"] == 1, f"butirnya harus pindah, sekarang: {k[\'butir\']}"',
                },
                {
                  name: { en: 'Being nearby is not enough', id: 'Berada di dekatnya tidak cukup' },
                  assert:
                    'bx, by = TITIK[0]\n' +
                    'k = perbarui({"x": float(bx) + 40, "y": float(by), "butir": 0, "skor": 0}, set(), 1 / 60)\n' +
                    'assert k["skor"] == 0, f"40 piksel jauhnya bukan sentuhan, sekarang skor: {k[\'skor\']}"',
                },
                {
                  name: { en: 'The dots cycle round', id: 'Butirnya berputar' },
                  assert:
                    'terakhir = len(TITIK) - 1\n' +
                    'bx, by = TITIK[terakhir]\n' +
                    'k = perbarui({"x": float(bx), "y": float(by), "butir": terakhir, "skor": 3}, set(), 1 / 60)\n' +
                    'assert k["butir"] == 0, f"setelah yang terakhir harus kembali ke 0, sekarang: {k[\'butir\']}"',
                },
                {
                  name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
                  assert:
                    'k = {"x": 100.0, "y": 100.0, "butir": 0, "skor": 0}\n' +
                    'salinan = dict(k)\n' +
                    'perbarui(k, {"kiri"}, 0.1)\n' +
                    'assert k == salinan, f"perbarui tidak boleh mengubah keadaan yang diberikan, sekarang jadi: {k}"',
                },
              ],
              hints: [
                { en: '`math.hypot(dx, dy)` takes the two differences, not the four coordinates.', id: '`math.hypot(dx, dy)` menerima kedua selisihnya, bukan keempat koordinatnya.' },
                { en: '`sentuh` compares that distance against the sum of the two radii, strictly.', id: '`sentuh` membandingkan jarak itu dengan jumlah kedua jari-jarinya, secara ketat.' },
                { en: 'In `perbarui`, build both circles as dictionaries with `x`, `y` and `r`, then call `sentuh`.', id: 'Di `perbarui`, bangun kedua lingkarannya sebagai dictionary berisi `x`, `y`, dan `r`, lalu panggil `sentuh`.' },
              ],
              solution:
                'import math\n\n' +
                'TITIK = [(260, 60), (60, 180), (250, 200), (80, 50)]\n' +
                'LAJU = 150\n' +
                'JARI = 10\n' +
                'BUTIR = 6\n\n' +
                'def jarak(x1, y1, x2, y2):\n' +
                '    return math.hypot(x2 - x1, y2 - y1)\n\n' +
                'def sentuh(a, b):\n' +
                '    return jarak(a["x"], a["y"], b["x"], b["y"]) < a["r"] + b["r"]\n\n' +
                'def awal():\n' +
                '    return {"x": 160.0, "y": 120.0, "butir": 0, "skor": 0}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    x = keadaan["x"]\n' +
                '    y = keadaan["y"]\n' +
                '    if "kiri" in tombol:\n' +
                '        x = x - LAJU * dt\n' +
                '    if "kanan" in tombol:\n' +
                '        x = x + LAJU * dt\n' +
                '    if "atas" in tombol:\n' +
                '        y = y - LAJU * dt\n' +
                '    if "bawah" in tombol:\n' +
                '        y = y + LAJU * dt\n' +
                '    x = max(JARI, min(320 - JARI, x))\n' +
                '    y = max(JARI, min(240 - JARI, y))\n\n' +
                '    butir = keadaan["butir"]\n' +
                '    skor = keadaan["skor"]\n' +
                '    bx, by = TITIK[butir]\n' +
                '    if sentuh({"x": x, "y": y, "r": JARI}, {"x": bx, "y": by, "r": BUTIR}):\n' +
                '        skor = skor + 1\n' +
                '        butir = (butir + 1) % len(TITIK)\n\n' +
                '    return {"x": x, "y": y, "butir": butir, "skor": skor}\n\n' +
                'def gambar(keadaan):\n' +
                '    bx, by = TITIK[keadaan["butir"]]\n' +
                '    return [\n' +
                '        {"bentuk": "lingkaran", "x": bx, "y": by, "r": BUTIR, "warna": "#f5c65b"},\n' +
                '        {"bentuk": "lingkaran", "x": keadaan["x"], "y": keadaan["y"], "r": JARI, "warna": "#24463d"},\n' +
                '        {"bentuk": "teks", "x": 8, "y": 8, "isi": "Skor: " + str(keadaan["skor"]), "warna": "#24463d"},\n' +
                '    ]\n',
            },
          ],
        },
      ],
      project: {
        id: 'gd-m2-s1-p1',
        runtime: 'game',
        title: { en: 'Catch', id: 'Tangkap' },
        brief: {
          en: 'A paddle at the bottom and something falling. Two counters — caught and missed — and every rule in the game is one `if`.',
          id: 'Sebuah papan di bawah dan sesuatu yang jatuh. Dua penghitung — tertangkap dan terlewat — dan tiap aturan permainannya adalah satu `if`.',
        },
        requirements: [
          { en: '`awal()` returns `{"px": 130.0, "y": -12.0, "i": 0, "skor": 0, "lewat": 0}`.', id: '`awal()` mengembalikan `{"px": 130.0, "y": -12.0, "i": 0, "skor": 0, "lewat": 0}`.' },
          { en: 'The paddle is 60 by 10, sits at y 220, moves left and right at 200 pixels per second, and stays on the field.', id: 'Papannya 60 kali 10, berada di y 220, bergerak kiri dan kanan 200 piksel per detik, dan tetap di lapangan.' },
          { en: 'The item is 12 by 12, falls at 90 pixels per second, and its x is `TITIK_X[i]`.', id: 'Bendanya 12 kali 12, jatuh 90 piksel per detik, dan x-nya adalah `TITIK_X[i]`.' },
          { en: 'Move the paddle first, then the item, then decide what happened.', id: 'Gerakkan papannya dulu, lalu bendanya, baru putuskan apa yang terjadi.' },
          { en: 'Caught (the two boxes overlap): `skor` goes up, and the item restarts at y -12 with the next `i`.', id: 'Tertangkap (kedua kotaknya bertumpang tindih): `skor` naik, dan bendanya mulai lagi di y -12 dengan `i` berikutnya.' },
          { en: 'Missed (its y passes 240): `lewat` goes up, and the item restarts the same way. A frame is one or the other, never both.', id: 'Terlewat (y-nya melewati 240): `lewat` naik, dan bendanya mulai lagi dengan cara yang sama. Satu bingkai adalah salah satunya, tak pernah keduanya.' },
        ],
        starter:
          'TITIK_X = [40, 160, 280, 100, 220]\n' +
          'LAJU = 200\n' +
          'JATUH = 90\n' +
          'PAPAN_L = 60\n' +
          'PAPAN_T = 10\n' +
          'PAPAN_Y = 220\n' +
          'BENDA = 12\n\n' +
          'def tabrakan(a, b):\n' +
          '    return (\n' +
          '        a["x"] < b["x"] + b["l"]\n' +
          '        and a["x"] + a["l"] > b["x"]\n' +
          '        and a["y"] < b["y"] + b["t"]\n' +
          '        and a["y"] + a["t"] > b["y"]\n' +
          '    )\n\n' +
          'def awal():\n' +
          '    return {"px": 130.0, "y": -12.0, "i": 0, "skor": 0, "lewat": 0}\n\n' +
          'def perbarui(keadaan, tombol, dt):\n' +
          '    return keadaan\n\n' +
          'def gambar(keadaan):\n' +
          '    return [\n' +
          '        {"bentuk": "kotak", "x": TITIK_X[keadaan["i"]], "y": keadaan["y"], "l": BENDA, "t": BENDA, "warna": "#f5c65b"},\n' +
          '        {"bentuk": "kotak", "x": keadaan["px"], "y": PAPAN_Y, "l": PAPAN_L, "t": PAPAN_T, "warna": "#24463d"},\n' +
          '        {"bentuk": "teks", "x": 8, "y": 8, "isi": "Tangkap: " + str(keadaan["skor"]) + "  Lewat: " + str(keadaan["lewat"]), "warna": "#24463d"},\n' +
          '    ]\n',
        tests: [
          {
            name: { en: 'The paddle moves and stays on the field', id: 'Papannya bergerak dan tetap di lapangan' },
            assert:
              'k = perbarui({"px": 100.0, "y": 0.0, "i": 0, "skor": 0, "lewat": 0}, {"kanan"}, 0.5)\n' +
              'assert abs(k["px"] - 200) < 1e-9, f"kanan setengah detik harus 200, sekarang: {k[\'px\']}"\n' +
              'b = perbarui({"px": 250.0, "y": 0.0, "i": 0, "skor": 0, "lewat": 0}, {"kanan"}, 1.0)\n' +
              'assert abs(b["px"] - 260) < 1e-9, f"harus terjepit di 320 - 60 = 260, sekarang: {b[\'px\']}"\n' +
              'c = perbarui({"px": 10.0, "y": 0.0, "i": 0, "skor": 0, "lewat": 0}, {"kiri"}, 1.0)\n' +
              'assert abs(c["px"]) < 1e-9, f"harus terjepit di 0, sekarang: {c[\'px\']}"',
          },
          {
            name: { en: 'The item falls at its speed', id: 'Bendanya jatuh pada kecepatannya' },
            assert:
              'k = perbarui({"px": 130.0, "y": 0.0, "i": 0, "skor": 0, "lewat": 0}, set(), 0.5)\n' +
              'assert abs(k["y"] - 45) < 1e-9, f"setengah detik harus turun 45, sekarang: {k[\'y\']}"\n' +
              'assert k["skor"] == 0 and k["lewat"] == 0, "di tengah lapangan belum ada apa-apa"',
          },
          {
            name: { en: 'Catching it scores and restarts it', id: 'Menangkapnya menambah skor dan mengulangnya' },
            assert:
              '# benda 0 ada di x 40; papan digeser ke bawahnya, benda tepat di ketinggian papan\n' +
              'k = perbarui({"px": 20.0, "y": 215.0, "i": 0, "skor": 3, "lewat": 1}, set(), 1 / 60)\n' +
              'assert k["skor"] == 4, f"harus tertangkap, sekarang skor: {k[\'skor\']}"\n' +
              'assert k["lewat"] == 1, f"tertangkap bukan terlewat, sekarang lewat: {k[\'lewat\']}"\n' +
              'assert abs(k["y"] + 12) < 1e-9, f"bendanya harus mulai lagi di -12, sekarang: {k[\'y\']}"\n' +
              'assert k["i"] == 1, f"harus lanjut ke benda berikutnya, sekarang: {k[\'i\']}"',
          },
          {
            name: { en: 'A paddle out of the way catches nothing', id: 'Papan yang menyingkir tidak menangkap apa pun' },
            assert:
              'k = perbarui({"px": 250.0, "y": 215.0, "i": 0, "skor": 0, "lewat": 0}, set(), 1 / 60)\n' +
              'assert k["skor"] == 0, f"papannya jauh di kanan, tidak boleh menangkap, sekarang: {k[\'skor\']}"',
          },
          {
            name: { en: 'Missing it counts, and restarts it', id: 'Melewatkannya terhitung, dan mengulangnya' },
            assert:
              'k = perbarui({"px": 250.0, "y": 239.0, "i": 2, "skor": 5, "lewat": 0}, set(), 0.5)\n' +
              'assert k["lewat"] == 1, f"harus terhitung lewat, sekarang: {k[\'lewat\']}"\n' +
              'assert k["skor"] == 5, f"terlewat tidak boleh menambah skor, sekarang: {k[\'skor\']}"\n' +
              'assert abs(k["y"] + 12) < 1e-9, f"harus mulai lagi di -12, sekarang: {k[\'y\']}"\n' +
              'assert k["i"] == 3, f"harus lanjut ke benda berikutnya, sekarang: {k[\'i\']}"',
          },
          {
            name: { en: 'A frame is a catch or a miss, never both', id: 'Satu bingkai adalah tangkapan atau kelewatan, tak pernah keduanya' },
            assert:
              'k = perbarui({"px": 20.0, "y": 230.0, "i": 0, "skor": 0, "lewat": 0}, set(), 0.5)\n' +
              'assert k["skor"] + k["lewat"] == 1, f"tepat satu dari keduanya harus naik, sekarang: skor {k[\'skor\']}, lewat {k[\'lewat\']}"',
          },
          {
            name: { en: 'The items cycle round', id: 'Bendanya berputar' },
            assert:
              'terakhir = len(TITIK_X) - 1\n' +
              'k = perbarui({"px": 250.0, "y": 239.0, "i": terakhir, "skor": 0, "lewat": 0}, set(), 0.5)\n' +
              'assert k["i"] == 0, f"setelah yang terakhir harus kembali ke 0, sekarang: {k[\'i\']}"',
          },
          {
            name: { en: 'It never falls off the bottom and stays there', id: 'Ia tak pernah jatuh ke bawah lalu menetap di sana' },
            assert:
              'k = awal()\n' +
              'for _ in range(1500):\n' +
              '    k = perbarui(k, set(), 1 / 60)\n' +
              '    assert k["y"] <= 241, f"bendanya lolos ke bawah dan tidak diulang: {k[\'y\']}"\n' +
              'assert k["lewat"] > 0, "tanpa menggerakkan papannya, seharusnya ada yang terlewat"',
          },
          {
            name: { en: 'A run with the paddle underneath scores', id: 'Perjalanan dengan papan di bawahnya menghasilkan skor' },
            assert:
              'k = awal()\n' +
              'for _ in range(1500):\n' +
              '    # jaga papannya tetap di bawah benda yang sedang jatuh\n' +
              '    target = TITIK_X[k["i"]] - 24\n' +
              '    ditekan = set()\n' +
              '    if k["px"] < target - 2:\n' +
              '        ditekan = {"kanan"}\n' +
              '    elif k["px"] > target + 2:\n' +
              '        ditekan = {"kiri"}\n' +
              '    k = perbarui(k, ditekan, 1 / 60)\n' +
              'assert k["skor"] > 5, f"papan yang mengikuti harus menangkap banyak, sekarang: {k[\'skor\']}"',
          },
          {
            name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
            assert:
              'k = {"px": 20.0, "y": 215.0, "i": 0, "skor": 0, "lewat": 0}\n' +
              'salinan = dict(k)\n' +
              'perbarui(k, {"kanan"}, 0.1)\n' +
              'assert k == salinan, f"perbarui tidak boleh mengubah keadaan yang diberikan, sekarang jadi: {k}"',
          },
        ],
        hints: [
          { en: '`tabrakan` is already written for you. The whole project is one `perbarui`.', id: '`tabrakan` sudah dituliskan untukmu. Seluruh proyeknya adalah satu `perbarui`.' },
          { en: 'Follow the stated order. Building the item box before moving the paddle would test last frame\'s paddle against this frame\'s item.', id: 'Ikuti urutan yang disebutkan. Membangun kotak bendanya sebelum menggerakkan papan berarti menguji papan bingkai lalu terhadap benda bingkai ini.' },
          { en: 'The two outcomes are `if` and `elif`, not two `if`s — one test exists to catch exactly that.', id: 'Kedua hasilnya adalah `if` dan `elif`, bukan dua `if` — ada satu tes khusus untuk menangkap itu.' },
          { en: 'Restarting is three assignments together: y back to -12, `i` to the next one, and the counter up.', id: 'Mengulang berarti tiga penugasan sekaligus: y kembali ke -12, `i` ke berikutnya, dan penghitungnya naik.' },
        ],
        solution:
          'TITIK_X = [40, 160, 280, 100, 220]\n' +
          'LAJU = 200\n' +
          'JATUH = 90\n' +
          'PAPAN_L = 60\n' +
          'PAPAN_T = 10\n' +
          'PAPAN_Y = 220\n' +
          'BENDA = 12\n' +
          'LEBAR = 320\n' +
          'TINGGI = 240\n\n' +
          'def tabrakan(a, b):\n' +
          '    return (\n' +
          '        a["x"] < b["x"] + b["l"]\n' +
          '        and a["x"] + a["l"] > b["x"]\n' +
          '        and a["y"] < b["y"] + b["t"]\n' +
          '        and a["y"] + a["t"] > b["y"]\n' +
          '    )\n\n' +
          'def awal():\n' +
          '    return {"px": 130.0, "y": -12.0, "i": 0, "skor": 0, "lewat": 0}\n\n' +
          'def perbarui(keadaan, tombol, dt):\n' +
          '    px = keadaan["px"]\n' +
          '    if "kiri" in tombol:\n' +
          '        px = px - LAJU * dt\n' +
          '    if "kanan" in tombol:\n' +
          '        px = px + LAJU * dt\n' +
          '    px = max(0, min(LEBAR - PAPAN_L, px))\n\n' +
          '    y = keadaan["y"] + JATUH * dt\n' +
          '    i = keadaan["i"]\n' +
          '    skor = keadaan["skor"]\n' +
          '    lewat = keadaan["lewat"]\n\n' +
          '    benda = {"x": TITIK_X[i], "y": y, "l": BENDA, "t": BENDA}\n' +
          '    papan = {"x": px, "y": PAPAN_Y, "l": PAPAN_L, "t": PAPAN_T}\n\n' +
          '    if tabrakan(benda, papan):\n' +
          '        skor = skor + 1\n' +
          '        y = -12.0\n' +
          '        i = (i + 1) % len(TITIK_X)\n' +
          '    elif y > TINGGI:\n' +
          '        lewat = lewat + 1\n' +
          '        y = -12.0\n' +
          '        i = (i + 1) % len(TITIK_X)\n\n' +
          '    return {"px": px, "y": y, "i": i, "skor": skor, "lewat": lewat}\n\n' +
          'def gambar(keadaan):\n' +
          '    return [\n' +
          '        {"bentuk": "kotak", "x": TITIK_X[keadaan["i"]], "y": keadaan["y"], "l": BENDA, "t": BENDA, "warna": "#f5c65b"},\n' +
          '        {"bentuk": "kotak", "x": keadaan["px"], "y": PAPAN_Y, "l": PAPAN_L, "t": PAPAN_T, "warna": "#24463d"},\n' +
          '        {"bentuk": "teks", "x": 8, "y": 8, "isi": "Tangkap: " + str(keadaan["skor"]) + "  Lewat: " + str(keadaan["lewat"]), "warna": "#24463d"},\n' +
          '    ]\n',
        xp: 50,
      },
    },
    {
      id: 'gd-m2-s2',
      title: { en: 'Bouncing, and Lists That Change', id: 'Memantul, dan Daftar yang Berubah' },
      summary: {
        en: 'Send a ball back where it came from, and keep a list of things that appear and vanish.',
        id: 'Memantulkan bola kembali ke asalnya, dan mengelola daftar benda yang muncul lalu lenyap.',
      },
      lessons: [
        {
          id: 'gd-m2-s2-l1',
          title: { en: 'Bouncing off a paddle', id: 'Memantul dari papan' },
          goal: { en: 'Reflect a ball, and let the player aim it.', id: 'Memantulkan bola, dan membiarkan pemain mengarahkannya.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A bounce is one sign change', id: 'Pantulan adalah satu perubahan tanda' },
              body: {
                en: 'Hitting a horizontal surface flips the vertical velocity and leaves the horizontal one alone. That is the whole of it. As with the walls in module 1, choose the direction rather than negating — `vy = -abs(vy)` sends it upwards whatever it was doing, and never gets stuck.',
                id: 'Menabrak permukaan mendatar membalik kecepatan tegaknya dan membiarkan yang mendatar. Hanya itu. Seperti dinding di modul 1, pilih arahnya alih-alih mengingkarinya — `vy = -abs(vy)` mengirimnya ke atas apa pun yang tadi ia lakukan, dan tak pernah tersangkut.',
              },
              code:
                'if tabrakan(bola, papan):\n' +
                '    vy = -abs(vy)   # selalu ke atas, tak pernah menggigil',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Where it hit should matter', id: 'Tempat kenanya seharusnya berarti' },
              body: {
                en: 'A ball that always leaves at the same angle is a ball the player cannot aim. Measure how far from the paddle\'s centre it landed, as a fraction from `-1` to `1`, and turn that into horizontal speed. Now the edge of the paddle is a tool, and a game of luck becomes a game of skill.',
                id: 'Bola yang selalu pergi dengan sudut sama adalah bola yang tak bisa diarahkan pemain. Ukur seberapa jauh dari pusat papannya ia mendarat, sebagai pecahan dari `-1` sampai `1`, lalu ubah itu jadi kecepatan mendatar. Sekarang tepi papannya jadi alat, dan permainan untung-untungan berubah jadi permainan keterampilan.',
              },
              code:
                'tengah = px + PAPAN_L / 2\n' +
                'beda = (bola_x - tengah) / (PAPAN_L / 2)   # -1 di ujung kiri, 1 di kanan\n' +
                'vx = beda * 180',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Put it back where it should have been', id: 'Kembalikan ia ke tempat seharusnya' },
              body: {
                en: 'A fast ball can be several pixels inside the paddle by the time you notice. Reflecting alone leaves it there for another frame, and on a bad frame it hits again and goes back down. So move it out as well as turning it — put its bottom edge exactly on the paddle\'s top.',
                id: 'Bola cepat bisa sudah beberapa piksel di dalam papan saat kamu menyadarinya. Memantulkan saja meninggalkannya di situ satu bingkai lagi, dan di bingkai buruk ia kena lagi lalu kembali turun. Maka pindahkan ia keluar sekalian membaliknya — taruh tepi bawahnya tepat di atas papannya.',
              },
              code:
                'y = PAPAN_Y - JARI\n' +
                'vy = -abs(vy)',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'The ball hits the exact centre of the paddle. What should `vx` become?',
                id: 'Bolanya mengenai pusat papan tepat. `vx` harusnya jadi berapa?',
              },
              options: [
                { en: '0 — straight back up', id: '0 — lurus kembali ke atas' },
                { en: 'The same as before', id: 'Sama seperti sebelumnya' },
                { en: 'The maximum', id: 'Nilai maksimumnya' },
                { en: 'Negative', id: 'Negatif' },
              ],
              answer: 0,
              explain: {
                en: 'The difference from the centre is zero, so zero times the speed is zero. The edges are where the steering lives.',
                id: 'Selisih dari pusatnya nol, jadi nol dikali kecepatannya adalah nol. Tepinya-lah tempat pengarahannya berada.',
              },
            },
            {
              kind: 'game',
              id: 'g1',
              prompt: {
                en: 'A ball bounces off the three walls and off the paddle. On a paddle hit, put the ball on top of it, send it up, and set `vx` from how far off centre it landed, times 180. It falls past the bottom for now.',
                id: 'Bola memantul dari tiga dinding dan dari papan. Saat kena papan, taruh bolanya di atas papan, kirim ke atas, dan setel `vx` dari seberapa jauh dari pusat ia mendarat, dikali 180. Untuk sekarang ia boleh lolos ke bawah.',
              },
              starter:
                'LAJU = 220\n' +
                'JARI = 6\n' +
                'PAPAN_L = 60\n' +
                'PAPAN_T = 10\n' +
                'PAPAN_Y = 210\n' +
                'LEBAR = 320\n\n' +
                'def tabrakan(a, b):\n' +
                '    return (\n' +
                '        a["x"] < b["x"] + b["l"]\n' +
                '        and a["x"] + a["l"] > b["x"]\n' +
                '        and a["y"] < b["y"] + b["t"]\n' +
                '        and a["y"] + a["t"] > b["y"]\n' +
                '    )\n\n' +
                'def awal():\n' +
                '    return {"px": 130.0, "x": 160.0, "y": 60.0, "vx": 70.0, "vy": 150.0}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    px = keadaan["px"]\n' +
                '    if "kiri" in tombol:\n' +
                '        px = px - LAJU * dt\n' +
                '    if "kanan" in tombol:\n' +
                '        px = px + LAJU * dt\n' +
                '    px = max(0, min(LEBAR - PAPAN_L, px))\n\n' +
                '    x = keadaan["x"] + keadaan["vx"] * dt\n' +
                '    y = keadaan["y"] + keadaan["vy"] * dt\n' +
                '    vx = keadaan["vx"]\n' +
                '    vy = keadaan["vy"]\n\n' +
                '    return {"px": px, "x": x, "y": y, "vx": vx, "vy": vy}\n\n' +
                'def gambar(keadaan):\n' +
                '    return [\n' +
                '        {"bentuk": "kotak", "x": keadaan["px"], "y": PAPAN_Y, "l": PAPAN_L, "t": PAPAN_T, "warna": "#24463d"},\n' +
                '        {"bentuk": "lingkaran", "x": keadaan["x"], "y": keadaan["y"], "r": JARI, "warna": "#ef8f70"},\n' +
                '    ]\n',
              tests: [
                {
                  name: { en: 'The side walls turn it around', id: 'Dinding sampingnya memutarnya balik' },
                  assert:
                    'k = perbarui({"px": 130.0, "x": 8.0, "y": 100.0, "vx": -100.0, "vy": 0.0}, set(), 0.1)\n' +
                    'assert abs(k["x"] - 6) < 1e-9, f"harus terjepit di jari-jari, 6, sekarang: {k[\'x\']}"\n' +
                    'assert k["vx"] > 0, f"vx harus jadi positif, sekarang: {k[\'vx\']}"\n' +
                    'b = perbarui({"px": 130.0, "x": 312.0, "y": 100.0, "vx": 100.0, "vy": 0.0}, set(), 0.1)\n' +
                    'assert abs(b["x"] - 314) < 1e-9, f"harus terjepit di 320 - 6 = 314, sekarang: {b[\'x\']}"\n' +
                    'assert b["vx"] < 0, f"vx harus jadi negatif, sekarang: {b[\'vx\']}"',
                },
                {
                  name: { en: 'The ceiling sends it back down', id: 'Langit-langitnya mengirimnya turun lagi' },
                  assert:
                    'k = perbarui({"px": 130.0, "x": 100.0, "y": 8.0, "vx": 0.0, "vy": -100.0}, set(), 0.1)\n' +
                    'assert abs(k["y"] - 6) < 1e-9, f"harus terjepit di 6, sekarang: {k[\'y\']}"\n' +
                    'assert k["vy"] > 0, f"vy harus jadi positif, sekarang: {k[\'vy\']}"',
                },
                {
                  name: { en: 'The paddle sends it back up', id: 'Papannya mengirimnya naik lagi' },
                  assert:
                    '# bola tepat di atas papan yang mulai di 130, jatuh ke dalamnya\n' +
                    'k = perbarui({"px": 130.0, "x": 160.0, "y": 206.0, "vx": 0.0, "vy": 150.0}, set(), 1 / 60)\n' +
                    'assert k["vy"] < 0, f"harus terpantul ke atas, sekarang vy: {k[\'vy\']}"\n' +
                    'assert abs(k["y"] - (210 - 6)) < 1e-9, f"harus ditaruh di atas papan, y = 204, sekarang: {k[\'y\']}"',
                },
                {
                  name: { en: 'The centre sends it straight up', id: 'Pusatnya mengirimnya lurus ke atas' },
                  assert:
                    '# papan 130..190, pusatnya 160; bolanya mendarat tepat di sana\n' +
                    'k = perbarui({"px": 130.0, "x": 159.9, "y": 206.0, "vx": 10.0, "vy": 150.0}, set(), 0.01)\n' +
                    'assert abs(k["vx"]) < 1e-6, f"kena tepat di pusat harus membuat vx nol, sekarang: {k[\'vx\']}"',
                },
                {
                  name: { en: 'The edges steer it', id: 'Tepinya mengarahkannya' },
                  assert:
                    'kanan = perbarui({"px": 130.0, "x": 188.0, "y": 206.0, "vx": 0.0, "vy": 150.0}, set(), 1 / 60)\n' +
                    'assert kanan["vx"] > 100, f"kena dekat tepi kanan harus melempar ke kanan dengan kuat, sekarang: {kanan[\'vx\']}"\n' +
                    'kiri = perbarui({"px": 130.0, "x": 132.0, "y": 206.0, "vx": 0.0, "vy": 150.0}, set(), 1 / 60)\n' +
                    'assert kiri["vx"] < -100, f"kena dekat tepi kiri harus melempar ke kiri dengan kuat, sekarang: {kiri[\'vx\']}"',
                },
                {
                  name: { en: 'It does not stick to the paddle', id: 'Ia tidak menempel di papan' },
                  assert:
                    'k = {"px": 130.0, "x": 160.0, "y": 206.0, "vx": 0.0, "vy": 150.0}\n' +
                    'k = perbarui(k, set(), 1 / 60)\n' +
                    'k = perbarui(k, set(), 1 / 60)\n' +
                    'assert k["vy"] < 0, f"bingkai berikutnya harus tetap naik, bukan terpantul lagi, sekarang: {k[\'vy\']}"',
                },
                {
                  name: { en: 'A paddle out of the way does nothing', id: 'Papan yang menyingkir tak melakukan apa-apa' },
                  assert:
                    'k = perbarui({"px": 0.0, "x": 300.0, "y": 206.0, "vx": 0.0, "vy": 150.0}, set(), 1 / 60)\n' +
                    'assert k["vy"] > 0, f"papannya jauh, bolanya harus terus turun, sekarang: {k[\'vy\']}"',
                },
                {
                  name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
                  assert:
                    'k = {"px": 130.0, "x": 160.0, "y": 206.0, "vx": 0.0, "vy": 150.0}\n' +
                    'salinan = dict(k)\n' +
                    'perbarui(k, set(), 1 / 60)\n' +
                    'assert k == salinan, f"perbarui tidak boleh mengubah keadaan yang diberikan, sekarang jadi: {k}"',
                },
              ],
              hints: [
                { en: 'The three walls first — the same shape as the bouncing ball project, minus the floor.', id: 'Ketiga dindingnya dulu — bentuk yang sama dengan proyek bola pantul, dikurangi lantainya.' },
                { en: 'Build the ball as a box for `tabrakan`: `{"x": x - JARI, "y": y - JARI, "l": 2 * JARI, "t": 2 * JARI}`.', id: 'Bangun bolanya sebagai kotak untuk `tabrakan`: `{"x": x - JARI, "y": y - JARI, "l": 2 * JARI, "t": 2 * JARI}`.' },
                { en: 'On a hit, do all three: y to `PAPAN_Y - JARI`, `vy = -abs(vy)`, and vx from the offset.', id: 'Saat kena, lakukan ketiganya: y jadi `PAPAN_Y - JARI`, `vy = -abs(vy)`, dan vx dari selisihnya.' },
                { en: 'The offset is `(x - (px + PAPAN_L / 2)) / (PAPAN_L / 2)`, then times 180.', id: 'Selisihnya adalah `(x - (px + PAPAN_L / 2)) / (PAPAN_L / 2)`, lalu dikali 180.' },
              ],
              solution:
                'LAJU = 220\n' +
                'JARI = 6\n' +
                'PAPAN_L = 60\n' +
                'PAPAN_T = 10\n' +
                'PAPAN_Y = 210\n' +
                'LEBAR = 320\n' +
                'ARAH = 180\n\n' +
                'def tabrakan(a, b):\n' +
                '    return (\n' +
                '        a["x"] < b["x"] + b["l"]\n' +
                '        and a["x"] + a["l"] > b["x"]\n' +
                '        and a["y"] < b["y"] + b["t"]\n' +
                '        and a["y"] + a["t"] > b["y"]\n' +
                '    )\n\n' +
                'def awal():\n' +
                '    return {"px": 130.0, "x": 160.0, "y": 60.0, "vx": 70.0, "vy": 150.0}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    px = keadaan["px"]\n' +
                '    if "kiri" in tombol:\n' +
                '        px = px - LAJU * dt\n' +
                '    if "kanan" in tombol:\n' +
                '        px = px + LAJU * dt\n' +
                '    px = max(0, min(LEBAR - PAPAN_L, px))\n\n' +
                '    x = keadaan["x"] + keadaan["vx"] * dt\n' +
                '    y = keadaan["y"] + keadaan["vy"] * dt\n' +
                '    vx = keadaan["vx"]\n' +
                '    vy = keadaan["vy"]\n\n' +
                '    if x < JARI:\n' +
                '        x = JARI\n' +
                '        vx = abs(vx)\n' +
                '    if x > LEBAR - JARI:\n' +
                '        x = LEBAR - JARI\n' +
                '        vx = -abs(vx)\n' +
                '    if y < JARI:\n' +
                '        y = JARI\n' +
                '        vy = abs(vy)\n\n' +
                '    bola = {"x": x - JARI, "y": y - JARI, "l": 2 * JARI, "t": 2 * JARI}\n' +
                '    papan = {"x": px, "y": PAPAN_Y, "l": PAPAN_L, "t": PAPAN_T}\n' +
                '    if tabrakan(bola, papan):\n' +
                '        y = PAPAN_Y - JARI\n' +
                '        vy = -abs(vy)\n' +
                '        beda = (x - (px + PAPAN_L / 2)) / (PAPAN_L / 2)\n' +
                '        vx = beda * ARAH\n\n' +
                '    return {"px": px, "x": x, "y": y, "vx": vx, "vy": vy}\n\n' +
                'def gambar(keadaan):\n' +
                '    return [\n' +
                '        {"bentuk": "kotak", "x": keadaan["px"], "y": PAPAN_Y, "l": PAPAN_L, "t": PAPAN_T, "warna": "#24463d"},\n' +
                '        {"bentuk": "lingkaran", "x": keadaan["x"], "y": keadaan["y"], "r": JARI, "warna": "#ef8f70"},\n' +
                '    ]\n',
            },
          ],
        },
        {
          id: 'gd-m2-s2-l2',
          title: { en: 'A list that comes and goes', id: 'Daftar yang datang dan pergi' },
          goal: { en: 'Spawn things on a timer and drop them when they are done.', id: 'Memunculkan benda dengan pewaktu dan membuangnya saat selesai.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Many of a thing is a list of dictionaries', id: 'Banyak benda adalah daftar dictionary' },
              body: {
                en: 'One falling block is `{"x": …, "y": …}`. Twenty of them is a list of those. Nothing else changes: you move each one the same way you moved the single one, and everything you learned about `dt` applies unchanged.',
                id: 'Satu balok jatuh adalah `{"x": …, "y": …}`. Dua puluh di antaranya adalah daftar berisi itu. Tak ada lagi yang berubah: kamu menggerakkan tiap satu dengan cara yang sama seperti menggerakkan yang tunggal, dan semua yang kamu pelajari tentang `dt` berlaku tanpa perubahan.',
              },
              code:
                'balok = [\n' +
                '    {"x": 40, "y": 10.0},\n' +
                '    {"x": 160, "y": 50.0},\n' +
                ']',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Build a new list; do not edit while looping', id: 'Bangun daftar baru; jangan menyunting sambil menelusuri' },
              body: {
                en: 'Removing items from a list you are iterating over skips elements — a bug that shows up as "some blocks never disappear" and is maddening to find. A comprehension sidesteps it completely: describe the list you want, and let the old one go.',
                id: 'Membuang item dari daftar yang sedang kamu telusuri akan melewati elemen — kutu yang muncul sebagai "sebagian balok tak pernah lenyap" dan menjengkelkan untuk dilacak. Comprehension menghindarinya sama sekali: jelaskan daftar yang kamu mau, dan lepaskan yang lama.',
              },
              code:
                '# gerakkan semuanya\n' +
                'balok = [{"x": b["x"], "y": b["y"] + JATUH * dt} for b in keadaan["balok"]]\n\n' +
                '# lalu simpan yang masih di layar\n' +
                'balok = [b for b in balok if b["y"] <= 240]',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'A timer is a number you count down', id: 'Pewaktu adalah angka yang kamu hitung mundur' },
              body: {
                en: 'Keep a number in the state, subtract `dt` from it every frame, and when it drops to zero or below, do the thing and set it back. That is every cooldown, every spawn interval, and every "you are invulnerable for two seconds" in every game you have played.',
                id: 'Simpan sebuah angka di keadaannya, kurangi `dt` darinya tiap bingkai, dan ketika ia turun ke nol atau kurang, lakukan hal itu lalu setel kembali. Itulah tiap masa jeda, tiap selang kemunculan, dan tiap "kamu kebal selama dua detik" di tiap game yang pernah kamu mainkan.',
              },
              code:
                'sisa = keadaan["sisa"] - dt\n' +
                'if sisa <= 0:\n' +
                '    balok = balok + [{"x": TITIK_X[i], "y": -20.0}]\n' +
                '    i = (i + 1) % len(TITIK_X)\n' +
                '    sisa = JEDA',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why set the timer back to `JEDA` rather than to `0`?',
                id: 'Kenapa menyetel pewaktunya kembali ke `JEDA` alih-alih ke `0`?',
              },
              options: [
                { en: 'At 0 it would fire again on the very next frame, forever', id: 'Di 0 ia akan menyala lagi di bingkai berikutnya, selamanya' },
                { en: 'Timers cannot hold zero', id: 'Pewaktu tak bisa bernilai nol' },
                { en: 'It makes no difference', id: 'Tidak ada bedanya' },
                { en: 'Because dt is never exactly zero', id: 'Karena dt tak pernah tepat nol' },
              ],
              answer: 0,
              explain: {
                en: 'The condition is "zero or below", so leaving it at zero means it is still true next frame — and you get a wall of blocks in about a second.',
                id: 'Kondisinya "nol atau kurang", jadi meninggalkannya di nol berarti ia masih benar di bingkai berikutnya — dan kamu mendapat tembok balok dalam sekitar sedetik.',
              },
            },
            {
              kind: 'game',
              id: 'g1',
              prompt: {
                en: 'Blocks 14 by 14 fall at 110 pixels per second. Every 0.7 seconds a new one appears at `TITIK_X[i]` and y -14, and `i` moves on. A block whose y passes 240 is dropped from the list.',
                id: 'Balok 14 kali 14 jatuh 110 piksel per detik. Tiap 0,7 detik satu balok baru muncul di `TITIK_X[i]` dan y -14, dan `i` maju. Balok yang y-nya melewati 240 dibuang dari daftarnya.',
              },
              starter:
                'TITIK_X = [30, 120, 210, 280, 70]\n' +
                'JATUH = 110\n' +
                'JEDA = 0.7\n' +
                'SISI = 14\n' +
                'TINGGI = 240\n\n' +
                'def awal():\n' +
                '    return {"balok": [], "i": 0, "sisa": 0.0}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    return keadaan\n\n' +
                'def gambar(keadaan):\n' +
                '    hasil = []\n' +
                '    for b in keadaan["balok"]:\n' +
                '        hasil.append({"bentuk": "kotak", "x": b["x"], "y": b["y"], "l": SISI, "t": SISI, "warna": "#ef8f70"})\n' +
                '    hasil.append({"bentuk": "teks", "x": 8, "y": 8, "isi": "Balok: " + str(len(keadaan["balok"])), "warna": "#24463d"})\n' +
                '    return hasil\n',
              tests: [
                {
                  name: { en: 'The blocks fall', id: 'Baloknya jatuh' },
                  assert:
                    'k = perbarui({"balok": [{"x": 30, "y": 0.0}], "i": 0, "sisa": 5.0}, set(), 0.5)\n' +
                    'assert len(k["balok"]) == 1, f"belum saatnya muncul yang baru, sekarang: {len(k[\'balok\'])}"\n' +
                    'assert abs(k["balok"][0]["y"] - 55) < 1e-9, f"setengah detik harus turun 55, sekarang: {k[\'balok\'][0][\'y\']}"\n' +
                    'assert k["balok"][0]["x"] == 30, "x tidak boleh berubah"',
                },
                {
                  name: { en: 'The timer counts down', id: 'Pewaktunya menghitung mundur' },
                  assert:
                    'k = perbarui({"balok": [], "i": 0, "sisa": 0.5}, set(), 0.2)\n' +
                    'assert abs(k["sisa"] - 0.3) < 1e-9, f"sisa harus 0.3, sekarang: {k[\'sisa\']}"\n' +
                    'assert len(k["balok"]) == 0, "belum saatnya muncul"',
                },
                {
                  name: { en: 'A new block appears when it reaches zero', id: 'Balok baru muncul ketika ia mencapai nol' },
                  assert:
                    'k = perbarui({"balok": [], "i": 2, "sisa": 0.05}, set(), 0.1)\n' +
                    'assert len(k["balok"]) == 1, f"harus muncul satu, sekarang: {len(k[\'balok\'])}"\n' +
                    'assert k["balok"][0]["x"] == TITIK_X[2], f"harus muncul di TITIK_X[2], sekarang: {k[\'balok\'][0][\'x\']}"\n' +
                    'assert abs(k["balok"][0]["y"] + 14) < 1e-9, f"harus mulai di -14, sekarang: {k[\'balok\'][0][\'y\']}"\n' +
                    'assert k["i"] == 3, f"i harus maju, sekarang: {k[\'i\']}"\n' +
                    'assert k["sisa"] > 0.5, f"pewaktunya harus disetel ulang, sekarang: {k[\'sisa\']}"',
                },
                {
                  name: { en: 'The spawn point cycles round', id: 'Titik munculnya berputar' },
                  assert:
                    'terakhir = len(TITIK_X) - 1\n' +
                    'k = perbarui({"balok": [], "i": terakhir, "sisa": 0.0}, set(), 0.01)\n' +
                    'assert k["i"] == 0, f"setelah yang terakhir harus kembali ke 0, sekarang: {k[\'i\']}"',
                },
                {
                  name: { en: 'Blocks past the bottom are dropped', id: 'Balok yang melewati bawah dibuang' },
                  assert:
                    'k = perbarui({"balok": [{"x": 30, "y": 239.0}, {"x": 70, "y": 10.0}], "i": 0, "sisa": 5.0}, set(), 0.5)\n' +
                    'assert len(k["balok"]) == 1, f"yang di bawah harus dibuang, sekarang tersisa: {len(k[\'balok\'])}"\n' +
                    'assert k["balok"][0]["x"] == 70, "yang tersisa harus yang masih di layar"',
                },
                {
                  name: { en: 'Everything on screen is kept', id: 'Semua yang masih di layar disimpan' },
                  assert:
                    'awal_balok = [{"x": 30, "y": 0.0}, {"x": 70, "y": 100.0}, {"x": 120, "y": 200.0}]\n' +
                    'k = perbarui({"balok": awal_balok, "i": 0, "sisa": 5.0}, set(), 0.1)\n' +
                    'assert len(k["balok"]) == 3, f"tak satu pun sudah lewat, ketiganya harus tetap ada, sekarang: {len(k[\'balok\'])}"',
                },
                {
                  name: { en: 'The list does not grow without limit', id: 'Daftarnya tidak tumbuh tanpa batas' },
                  assert:
                    'k = awal()\n' +
                    'for _ in range(1800):\n' +
                    '    k = perbarui(k, set(), 1 / 60)\n' +
                    'assert len(k["balok"]) < 12, f"setelah 30 detik daftarnya harus tetap kecil, sekarang: {len(k[\'balok\'])}"\n' +
                    'assert len(k["balok"]) > 0, "tetapi harus ada yang sedang jatuh"',
                },
                {
                  name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
                  assert:
                    'asal = [{"x": 30, "y": 10.0}]\n' +
                    'k = {"balok": asal, "i": 0, "sisa": 5.0}\n' +
                    'perbarui(k, set(), 0.5)\n' +
                    'assert asal[0]["y"] == 10.0, f"balok lamanya tidak boleh ikut bergerak, sekarang: {asal[0][\'y\']}"\n' +
                    'assert len(k["balok"]) == 1 and k["sisa"] == 5.0, "keadaan yang diberikan tidak boleh berubah"',
                },
              ],
              hints: [
                { en: 'Three steps, in order: move them all, drop the ones that are gone, then maybe add one.', id: 'Tiga langkah, berurutan: gerakkan semuanya, buang yang sudah hilang, lalu mungkin tambahkan satu.' },
                { en: 'Moving means a **new** dictionary per block, not `b["y"] += …` — one test checks exactly that.', id: 'Menggerakkan berarti dictionary **baru** per balok, bukan `b["y"] += …` — ada satu tes yang memeriksa persis itu.' },
                { en: 'Adding is `balok + [yang_baru]`, which builds a new list rather than appending to the old one.', id: 'Menambah adalah `balok + [yang_baru]`, yang membangun daftar baru alih-alih menambahkan ke yang lama.' },
                { en: 'Set the timer back to `JEDA`, not to zero.', id: 'Setel pewaktunya kembali ke `JEDA`, bukan ke nol.' },
              ],
              solution:
                'TITIK_X = [30, 120, 210, 280, 70]\n' +
                'JATUH = 110\n' +
                'JEDA = 0.7\n' +
                'SISI = 14\n' +
                'TINGGI = 240\n\n' +
                'def awal():\n' +
                '    return {"balok": [], "i": 0, "sisa": 0.0}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    balok = [{"x": b["x"], "y": b["y"] + JATUH * dt} for b in keadaan["balok"]]\n' +
                '    balok = [b for b in balok if b["y"] <= TINGGI]\n\n' +
                '    i = keadaan["i"]\n' +
                '    sisa = keadaan["sisa"] - dt\n' +
                '    if sisa <= 0:\n' +
                '        balok = balok + [{"x": TITIK_X[i], "y": -float(SISI)}]\n' +
                '        i = (i + 1) % len(TITIK_X)\n' +
                '        sisa = JEDA\n\n' +
                '    return {"balok": balok, "i": i, "sisa": sisa}\n\n' +
                'def gambar(keadaan):\n' +
                '    hasil = []\n' +
                '    for b in keadaan["balok"]:\n' +
                '        hasil.append({"bentuk": "kotak", "x": b["x"], "y": b["y"], "l": SISI, "t": SISI, "warna": "#ef8f70"})\n' +
                '    hasil.append({"bentuk": "teks", "x": 8, "y": 8, "isi": "Balok: " + str(len(keadaan["balok"])), "warna": "#24463d"})\n' +
                '    return hasil\n',
            },
          ],
        },
      ],
      project: {
        id: 'gd-m2-s2-p1',
        runtime: 'game',
        title: { en: 'Dodge', id: 'Hindari' },
        brief: {
          en: 'Blocks fall, you do not want to be under them. A list, a timer, a collision test and two counters — everything this module covered, in one update.',
          id: 'Balok berjatuhan, dan kamu tak ingin berada di bawahnya. Sebuah daftar, sebuah pewaktu, sebuah uji tabrakan, dan dua penghitung — semua isi modul ini, dalam satu pembaruan.',
        },
        requirements: [
          { en: '`awal()` returns `{"x": 152.0, "balok": [], "i": 0, "sisa": 0.0, "lolos": 0, "kena": 0}`.', id: '`awal()` mengembalikan `{"x": 152.0, "balok": [], "i": 0, "sisa": 0.0, "lolos": 0, "kena": 0}`.' },
          { en: 'The player is 16 by 16 at y 210, moves left and right at 190 pixels per second, and stays on the field.', id: 'Pemainnya 16 kali 16 di y 210, bergerak kiri dan kanan 190 piksel per detik, dan tetap di lapangan.' },
          { en: 'Blocks are 14 by 14, fall at 120 pixels per second, and a new one appears every 0.6 seconds at `TITIK_X[i]`, y -14.', id: 'Baloknya 14 kali 14, jatuh 120 piksel per detik, dan yang baru muncul tiap 0,6 detik di `TITIK_X[i]`, y -14.' },
          { en: 'In order: move the player, move the blocks, then resolve each block.', id: 'Berurutan: gerakkan pemainnya, gerakkan baloknya, lalu selesaikan tiap baloknya.' },
          { en: 'A block that overlaps the player is removed and `kena` goes up. A block past y 240 is removed and `lolos` goes up. Everything else stays.', id: 'Balok yang bertumpang tindih dengan pemain dibuang dan `kena` naik. Balok yang melewati y 240 dibuang dan `lolos` naik. Sisanya tetap.' },
          { en: 'Then, if the timer has run out, add the next block.', id: 'Setelah itu, kalau pewaktunya habis, tambahkan balok berikutnya.' },
        ],
        starter:
          'TITIK_X = [30, 120, 210, 280, 70, 160]\n' +
          'LAJU = 190\n' +
          'JATUH = 120\n' +
          'JEDA = 0.6\n' +
          'SISI = 16\n' +
          'BALOK = 14\n' +
          'PEMAIN_Y = 210\n' +
          'LEBAR = 320\n' +
          'TINGGI = 240\n\n' +
          'def tabrakan(a, b):\n' +
          '    return (\n' +
          '        a["x"] < b["x"] + b["l"]\n' +
          '        and a["x"] + a["l"] > b["x"]\n' +
          '        and a["y"] < b["y"] + b["t"]\n' +
          '        and a["y"] + a["t"] > b["y"]\n' +
          '    )\n\n' +
          'def awal():\n' +
          '    return {"x": 152.0, "balok": [], "i": 0, "sisa": 0.0, "lolos": 0, "kena": 0}\n\n' +
          'def perbarui(keadaan, tombol, dt):\n' +
          '    return keadaan\n\n' +
          'def gambar(keadaan):\n' +
          '    hasil = []\n' +
          '    for b in keadaan["balok"]:\n' +
          '        hasil.append({"bentuk": "kotak", "x": b["x"], "y": b["y"], "l": BALOK, "t": BALOK, "warna": "#ef8f70"})\n' +
          '    hasil.append({"bentuk": "kotak", "x": keadaan["x"], "y": PEMAIN_Y, "l": SISI, "t": SISI, "warna": "#24463d"})\n' +
          '    hasil.append({"bentuk": "teks", "x": 8, "y": 8, "isi": "Lolos: " + str(keadaan["lolos"]) + "  Kena: " + str(keadaan["kena"]), "warna": "#24463d"})\n' +
          '    return hasil\n',
        tests: [
          {
            name: { en: 'The player moves and stays on the field', id: 'Pemainnya bergerak dan tetap di lapangan' },
            assert:
              'dasar = {"x": 100.0, "balok": [], "i": 0, "sisa": 5.0, "lolos": 0, "kena": 0}\n' +
              'k = perbarui(dict(dasar), {"kanan"}, 0.5)\n' +
              'assert abs(k["x"] - 195) < 1e-9, f"kanan setengah detik harus 195, sekarang: {k[\'x\']}"\n' +
              'b = perbarui({**dasar, "x": 300.0}, {"kanan"}, 1.0)\n' +
              'assert abs(b["x"] - 304) < 1e-9, f"harus terjepit di 320 - 16 = 304, sekarang: {b[\'x\']}"',
          },
          {
            name: { en: 'The blocks fall', id: 'Baloknya jatuh' },
            assert:
              'k = perbarui({"x": 0.0, "balok": [{"x": 300, "y": 0.0}], "i": 0, "sisa": 5.0, "lolos": 0, "kena": 0}, set(), 0.5)\n' +
              'assert len(k["balok"]) == 1, f"harus masih ada satu, sekarang: {len(k[\'balok\'])}"\n' +
              'assert abs(k["balok"][0]["y"] - 60) < 1e-9, f"setengah detik harus turun 60, sekarang: {k[\'balok\'][0][\'y\']}"',
          },
          {
            name: { en: 'A block that lands on you counts as a hit', id: 'Balok yang mendarat di kamu terhitung kena' },
            assert:
              'k = perbarui({"x": 152.0, "balok": [{"x": 152, "y": 205.0}], "i": 0, "sisa": 5.0, "lolos": 0, "kena": 0}, set(), 1 / 60)\n' +
              'assert k["kena"] == 1, f"harus terhitung kena, sekarang: {k[\'kena\']}"\n' +
              'assert k["lolos"] == 0, f"kena bukan lolos, sekarang: {k[\'lolos\']}"\n' +
              'assert len(k["balok"]) == 0, f"balok yang mengenai harus dibuang, sekarang tersisa: {len(k[\'balok\'])}"',
          },
          {
            name: { en: 'A block that misses you counts as a dodge', id: 'Balok yang meleset terhitung lolos' },
            assert:
              'k = perbarui({"x": 0.0, "balok": [{"x": 300, "y": 239.0}], "i": 0, "sisa": 5.0, "lolos": 0, "kena": 0}, set(), 0.5)\n' +
              'assert k["lolos"] == 1, f"harus terhitung lolos, sekarang: {k[\'lolos\']}"\n' +
              'assert k["kena"] == 0, f"lolos bukan kena, sekarang: {k[\'kena\']}"\n' +
              'assert len(k["balok"]) == 0, f"balok yang lewat harus dibuang, sekarang tersisa: {len(k[\'balok\'])}"',
          },
          {
            name: { en: 'Blocks in mid-air are left alone', id: 'Balok di udara dibiarkan' },
            assert:
              'k = perbarui({"x": 152.0, "balok": [{"x": 30, "y": 50.0}, {"x": 120, "y": 100.0}], "i": 0, "sisa": 5.0, "lolos": 0, "kena": 0}, set(), 0.1)\n' +
              'assert len(k["balok"]) == 2, f"keduanya masih jatuh, sekarang: {len(k[\'balok\'])}"\n' +
              'assert k["lolos"] == 0 and k["kena"] == 0, "belum ada yang terjadi"',
          },
          {
            name: { en: 'Several blocks are resolved in one frame', id: 'Beberapa balok diselesaikan dalam satu bingkai' },
            assert:
              'k = perbarui({\n' +
              '    "x": 152.0,\n' +
              '    "balok": [{"x": 152, "y": 205.0}, {"x": 300, "y": 239.0}, {"x": 30, "y": 10.0}],\n' +
              '    "i": 0, "sisa": 5.0, "lolos": 0, "kena": 0,\n' +
              '}, set(), 1 / 60)\n' +
              'assert k["kena"] == 1, f"satu kena, sekarang: {k[\'kena\']}"\n' +
              'assert k["lolos"] == 1, f"satu lolos, sekarang: {k[\'lolos\']}"\n' +
              'assert len(k["balok"]) == 1, f"satu masih jatuh, sekarang: {len(k[\'balok\'])}"',
          },
          {
            name: { en: 'New blocks arrive on the timer', id: 'Balok baru datang mengikuti pewaktu' },
            assert:
              'k = perbarui({"x": 152.0, "balok": [], "i": 3, "sisa": 0.05, "lolos": 0, "kena": 0}, set(), 0.1)\n' +
              'assert len(k["balok"]) == 1, f"harus muncul satu, sekarang: {len(k[\'balok\'])}"\n' +
              'assert k["balok"][0]["x"] == TITIK_X[3], f"harus di TITIK_X[3], sekarang: {k[\'balok\'][0][\'x\']}"\n' +
              'assert abs(k["balok"][0]["y"] + 14) < 1e-9, f"harus mulai di -14, sekarang: {k[\'balok\'][0][\'y\']}"\n' +
              'assert k["i"] == 4, f"i harus maju, sekarang: {k[\'i\']}"\n' +
              'assert k["sisa"] > 0.4, f"pewaktunya harus disetel ulang, sekarang: {k[\'sisa\']}"',
          },
          {
            name: { en: 'A new block is not resolved the moment it appears', id: 'Balok baru tidak langsung diselesaikan begitu muncul' },
            assert:
              'k = perbarui({"x": 30.0, "balok": [], "i": 0, "sisa": 0.0, "lolos": 0, "kena": 0}, set(), 0.01)\n' +
              'assert len(k["balok"]) == 1, "balok yang baru muncul harus tetap ada"\n' +
              'assert k["kena"] == 0 and k["lolos"] == 0, "balok di atas layar belum menyentuh apa pun"',
          },
          {
            name: { en: 'Standing still gets you hit', id: 'Diam saja membuatmu terkena' },
            assert:
              'k = awal()\n' +
              'for _ in range(1800):\n' +
              '    k = perbarui(k, set(), 1 / 60)\n' +
              'assert k["kena"] > 0, "berdiri di tengah selama 30 detik pasti kena sesuatu"\n' +
              'assert k["lolos"] > 0, "dan sebagian besar lainnya harus lolos"\n' +
              'assert len(k["balok"]) < 12, f"daftarnya harus tetap kecil, sekarang: {len(k[\'balok\'])}"',
          },
          {
            name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
            assert:
              'asal = [{"x": 30, "y": 10.0}]\n' +
              'k = {"x": 152.0, "balok": asal, "i": 0, "sisa": 5.0, "lolos": 0, "kena": 0}\n' +
              'salinan = {"x": 152.0, "i": 0, "sisa": 5.0, "lolos": 0, "kena": 0}\n' +
              'perbarui(k, {"kanan"}, 0.5)\n' +
              'assert asal[0]["y"] == 10.0, f"balok lamanya tidak boleh ikut bergerak, sekarang: {asal[0][\'y\']}"\n' +
              'assert all(k[kunci] == nilai for kunci, nilai in salinan.items()), f"keadaan yang diberikan tidak boleh berubah, sekarang: {k}"',
          },
        ],
        hints: [
          { en: 'The player is the easy half — it is the same clamped mover as module 1.', id: 'Pemainnya bagian yang mudah — ia penggerak terjepit yang sama seperti modul 1.' },
          { en: 'Resolving the blocks is one loop over the moved list, sorting each one into hit, dodged, or still falling.', id: 'Menyelesaikan baloknya adalah satu loop atas daftar yang sudah digerakkan, memilah tiap balok jadi kena, lolos, atau masih jatuh.' },
          { en: 'Build a new list of the survivors rather than removing from the one you are looping over.', id: 'Bangun daftar baru berisi yang bertahan alih-alih membuang dari daftar yang sedang kamu telusuri.' },
          { en: 'Spawn **after** resolving, or a block can be judged in the same frame it appeared — one test checks that.', id: 'Munculkan **setelah** menyelesaikan, atau sebuah balok bisa dinilai di bingkai yang sama saat ia muncul — ada satu tes yang memeriksanya.' },
        ],
        solution:
          'TITIK_X = [30, 120, 210, 280, 70, 160]\n' +
          'LAJU = 190\n' +
          'JATUH = 120\n' +
          'JEDA = 0.6\n' +
          'SISI = 16\n' +
          'BALOK = 14\n' +
          'PEMAIN_Y = 210\n' +
          'LEBAR = 320\n' +
          'TINGGI = 240\n\n' +
          'def tabrakan(a, b):\n' +
          '    return (\n' +
          '        a["x"] < b["x"] + b["l"]\n' +
          '        and a["x"] + a["l"] > b["x"]\n' +
          '        and a["y"] < b["y"] + b["t"]\n' +
          '        and a["y"] + a["t"] > b["y"]\n' +
          '    )\n\n' +
          'def awal():\n' +
          '    return {"x": 152.0, "balok": [], "i": 0, "sisa": 0.0, "lolos": 0, "kena": 0}\n\n' +
          'def perbarui(keadaan, tombol, dt):\n' +
          '    x = keadaan["x"]\n' +
          '    if "kiri" in tombol:\n' +
          '        x = x - LAJU * dt\n' +
          '    if "kanan" in tombol:\n' +
          '        x = x + LAJU * dt\n' +
          '    x = max(0, min(LEBAR - SISI, x))\n\n' +
          '    pemain = {"x": x, "y": PEMAIN_Y, "l": SISI, "t": SISI}\n' +
          '    lolos = keadaan["lolos"]\n' +
          '    kena = keadaan["kena"]\n' +
          '    tersisa = []\n\n' +
          '    for b in keadaan["balok"]:\n' +
          '        turun = {"x": b["x"], "y": b["y"] + JATUH * dt}\n' +
          '        kotak = {"x": turun["x"], "y": turun["y"], "l": BALOK, "t": BALOK}\n' +
          '        if tabrakan(kotak, pemain):\n' +
          '            kena = kena + 1\n' +
          '        elif turun["y"] > TINGGI:\n' +
          '            lolos = lolos + 1\n' +
          '        else:\n' +
          '            tersisa.append(turun)\n\n' +
          '    i = keadaan["i"]\n' +
          '    sisa = keadaan["sisa"] - dt\n' +
          '    if sisa <= 0:\n' +
          '        tersisa = tersisa + [{"x": TITIK_X[i], "y": -float(BALOK)}]\n' +
          '        i = (i + 1) % len(TITIK_X)\n' +
          '        sisa = JEDA\n\n' +
          '    return {"x": x, "balok": tersisa, "i": i, "sisa": sisa, "lolos": lolos, "kena": kena}\n\n' +
          'def gambar(keadaan):\n' +
          '    hasil = []\n' +
          '    for b in keadaan["balok"]:\n' +
          '        hasil.append({"bentuk": "kotak", "x": b["x"], "y": b["y"], "l": BALOK, "t": BALOK, "warna": "#ef8f70"})\n' +
          '    hasil.append({"bentuk": "kotak", "x": keadaan["x"], "y": PEMAIN_Y, "l": SISI, "t": SISI, "warna": "#24463d"})\n' +
          '    hasil.append({"bentuk": "teks", "x": 8, "y": 8, "isi": "Lolos: " + str(keadaan["lolos"]) + "  Kena: " + str(keadaan["kena"]), "warna": "#24463d"})\n' +
          '    return hasil\n',
        xp: 50,
      },
    },
  ],
}
