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
                'a entirely left of b   ->  a.x + a.w <= b.x\n' +
                'a entirely right of b  ->  a.x       >= b.x + b.w\n' +
                'a entirely above b     ->  a.y + a.h <= b.y\n' +
                'a entirely below b     ->  a.y       >= b.y + b.h',
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
                'def overlaps(a, b):\n' +
                '    return (\n' +
                '        a["x"] < b["x"] + b["w"]\n' +
                '        and a["x"] + a["w"] > b["x"]\n' +
                '        and a["y"] < b["y"] + b["h"]\n' +
                '        and a["y"] + a["h"] > b["y"]\n' +
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
                'player = {"x": state["x"], "y": state["y"], "w": 20, "h": 20}\n' +
                'coin = {"x": cx, "y": cy, "w": 16, "h": 16}\n\n' +
                'if overlaps(player, coin):\n' +
                '    score = score + 1',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Box A runs from x 0 to 10. Box B runs from x 10 to 20. Same rows. Does `overlaps` say yes?',
                id: 'Kotak A membentang dari x 0 sampai 10. Kotak B dari x 10 sampai 20. Barisnya sama. Apakah `overlaps` menjawab ya?',
              },
              options: [
                { en: 'No — they share an edge but do not overlap', id: 'Tidak — keduanya berbagi tepi tetapi tidak bertumpang tindih' },
                { en: 'Yes — they are touching', id: 'Ya — keduanya bersentuhan' },
                { en: 'It depends on which is checked first', id: 'Tergantung mana yang diperiksa duluan' },
                { en: 'Only if they are the same size', id: 'Hanya kalau ukurannya sama' },
              ],
              answer: 0,
              explain: {
                en: '`a["x"] + a["w"] > b["x"]` is `10 > 10`, which is false. Strict comparisons mean an edge is not an overlap.',
                id: '`a["x"] + a["w"] > b["x"]` menjadi `10 > 10`, yang salah. Perbandingan ketat berarti sebuah tepi bukanlah tumpang tindih.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the first two of the four comparisons.',
                id: 'Lengkapi dua dari empat perbandingannya.',
              },
              template: 'a["x"] ___ b["x"] + b["w"] and a["x"] + a["w"] ___ b["x"]',
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
                en: 'Write `overlaps(a, b)` for two boxes, then use it: a 20 by 20 player moves at 140 pixels per second and stays on the field, and touching the 16 by 16 coin scores a point and sends the coin to the next spot in `SPOTS`.',
                id: 'Tulis `overlaps(a, b)` untuk dua kotak, lalu pakai: pemain 20 kali 20 bergerak 140 piksel per detik dan tetap di lapangan, dan menyentuh koin 16 kali 16 menambah satu poin serta mengirim koinnya ke titik berikutnya di `SPOTS`.',
              },
              starter:
                'SPOTS = [(250, 40), (40, 180), (270, 190), (150, 60)]\n' +
                'SPEED = 140\n' +
                'SIDE = 20\n' +
                'COIN = 16\n\n' +
                'def overlaps(a, b):\n' +
                '    return False\n\n' +
                'def start():\n' +
                '    return {"x": 160.0, "y": 120.0, "coin": 0, "score": 0}\n\n' +
                'def update(state, keys, dt):\n' +
                '    x = state["x"]\n' +
                '    y = state["y"]\n' +
                '    if "left" in keys:\n' +
                '        x = x - SPEED * dt\n' +
                '    if "right" in keys:\n' +
                '        x = x + SPEED * dt\n' +
                '    if "up" in keys:\n' +
                '        y = y - SPEED * dt\n' +
                '    if "down" in keys:\n' +
                '        y = y + SPEED * dt\n' +
                '    x = max(0, min(320 - SIDE, x))\n' +
                '    y = max(0, min(240 - SIDE, y))\n' +
                '    return {"x": x, "y": y, "coin": state["coin"], "score": state["score"]}\n\n' +
                'def draw(state):\n' +
                '    sx, sy = SPOTS[state["coin"]]\n' +
                '    return [\n' +
                '        {"shape": "box", "x": sx, "y": sy, "w": COIN, "h": COIN, "color": "#f5c65b"},\n' +
                '        {"shape": "box", "x": state["x"], "y": state["y"], "w": SIDE, "h": SIDE, "color": "#24463d"},\n' +
                '        {"shape": "text", "x": 8, "y": 8, "text": "Score: " + str(state["score"]), "color": "#24463d"},\n' +
                '    ]\n',
              tests: [
                {
                  name: { en: 'Overlapping boxes are a hit', id: 'Kotak yang bertumpang tindih itu kena' },
                  assert:
                    'a = {"x": 0, "y": 0, "w": 10, "h": 10}\n' +
                    'assert overlaps(a, {"x": 5, "y": 5, "w": 10, "h": 10}) is True or overlaps(a, {"x": 5, "y": 5, "w": 10, "h": 10}), "clearly overlapping boxes must be a hit"\n' +
                    'assert overlaps(a, {"x": -5, "y": -5, "w": 10, "h": 10}), "overlapping from the top left must also be a hit"\n' +
                    'big = {"x": 0, "y": 0, "w": 100, "h": 100}\n' +
                    'assert overlaps(big, {"x": 40, "y": 40, "w": 5, "h": 5}), "a small box inside a big one must be a hit"\n' +
                    'assert overlaps({"x": 40, "y": 40, "w": 5, "h": 5}, big), "order must not matter"',
                },
                {
                  name: { en: 'Separated boxes are not', id: 'Kotak yang terpisah tidak' },
                  assert:
                    'a = {"x": 0, "y": 0, "w": 10, "h": 10}\n' +
                    'assert not overlaps(a, {"x": 11, "y": 0, "w": 10, "h": 10}), "a gap on the right must not be a hit"\n' +
                    'assert not overlaps(a, {"x": -11, "y": 0, "w": 10, "h": 10}), "a gap on the left must not be a hit"\n' +
                    'assert not overlaps(a, {"x": 0, "y": 11, "w": 10, "h": 10}), "a gap below must not be a hit"\n' +
                    'assert not overlaps(a, {"x": 0, "y": -11, "w": 10, "h": 10}), "a gap above must not be a hit"',
                },
                {
                  name: { en: 'A shared edge is not an overlap', id: 'Tepi yang dibagi bukan tumpang tindih' },
                  assert:
                    'a = {"x": 0, "y": 0, "w": 10, "h": 10}\n' +
                    'assert not overlaps(a, {"x": 10, "y": 0, "w": 10, "h": 10}), "touching exactly at the right edge must not be a hit"\n' +
                    'assert not overlaps(a, {"x": 0, "y": 10, "w": 10, "h": 10}), "touching exactly at the bottom edge must not be a hit"',
                },
                {
                  name: { en: 'Overlapping across only one axis is not enough', id: 'Bertindihan di satu sumbu saja tidak cukup' },
                  assert:
                    'a = {"x": 0, "y": 0, "w": 10, "h": 10}\n' +
                    'assert not overlaps(a, {"x": 5, "y": 50, "w": 10, "h": 10}), "x overlaps but y is far: not a hit"\n' +
                    'assert not overlaps(a, {"x": 50, "y": 5, "w": 10, "h": 10}), "y overlaps but x is far: not a hit"',
                },
                {
                  name: { en: 'Standing on the coin scores', id: 'Berdiri di atas koin menambah skor' },
                  assert:
                    'sx, sy = SPOTS[0]\n' +
                    'k = update({"x": float(sx), "y": float(sy), "coin": 0, "score": 0}, set(), 1 / 60)\n' +
                    'assert k["score"] == 1, f"must add to the score, now: {k[\'score\']}"\n' +
                    'assert k["coin"] == 1, f"the coin must move to the next spot, now: {k[\'coin\']}"',
                },
                {
                  name: { en: 'Standing anywhere else does not', id: 'Berdiri di tempat lain tidak' },
                  assert:
                    'k = update({"x": 5.0, "y": 5.0, "coin": 0, "score": 0}, set(), 1 / 60)\n' +
                    'assert k["score"] == 0, f"far from the coin, the score must stay 0, now: {k[\'score\']}"\n' +
                    'assert k["coin"] == 0, f"the coin must not move, now: {k[\'coin\']}"',
                },
                {
                  name: { en: 'The coin cycles back to the start', id: 'Koinnya berputar kembali ke awal' },
                  assert:
                    'last = len(SPOTS) - 1\n' +
                    'sx, sy = SPOTS[last]\n' +
                    'k = update({"x": float(sx), "y": float(sy), "coin": last, "score": 9}, set(), 1 / 60)\n' +
                    'assert k["coin"] == 0, f"after the last spot it must go back to 0, now: {k[\'coin\']}"\n' +
                    'assert k["score"] == 10, f"the score must be 10, now: {k[\'score\']}"',
                },
                {
                  name: { en: 'The player still moves and stays on the field', id: 'Pemainnya tetap bergerak dan tetap di lapangan' },
                  assert:
                    'k = update({"x": 100.0, "y": 100.0, "coin": 0, "score": 0}, {"right"}, 0.5)\n' +
                    'assert abs(k["x"] - 170) < 1e-9, f"right for half a second must be 170, now: {k[\'x\']}"\n' +
                    'b = update({"x": 310.0, "y": 100.0, "coin": 0, "score": 0}, {"right"}, 1.0)\n' +
                    'assert abs(b["x"] - 300) < 1e-9, f"must clamp to 300, now: {b[\'x\']}"',
                },
                {
                  name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
                  assert:
                    'sx, sy = SPOTS[0]\n' +
                    'k = {"x": float(sx), "y": float(sy), "coin": 0, "score": 0}\n' +
                    'copy = dict(k)\n' +
                    'update(k, set(), 1 / 60)\n' +
                    'assert k == copy, f"update must not change the state it was given, now: {k}"',
                },
              ],
              hints: [
                { en: 'The movement is already written. Only `overlaps` and the scoring are missing.', id: 'Gerakannya sudah tertulis. Yang kurang hanya `overlaps` dan penskorannya.' },
                { en: 'Four comparisons joined with `and`, all strict.', id: 'Empat perbandingan digabung dengan `and`, semuanya ketat.' },
                { en: 'Build both boxes after the player has moved, then compare them.', id: 'Bangun kedua kotaknya setelah pemainnya bergerak, lalu bandingkan.' },
                { en: 'Wrap the coin index with the remainder: `(coin + 1) % len(SPOTS)`.', id: 'Putar indeks koinnya dengan sisa bagi: `(coin + 1) % len(SPOTS)`.' },
              ],
              solution:
                'SPOTS = [(250, 40), (40, 180), (270, 190), (150, 60)]\n' +
                'SPEED = 140\n' +
                'SIDE = 20\n' +
                'COIN = 16\n\n' +
                'def overlaps(a, b):\n' +
                '    return (\n' +
                '        a["x"] < b["x"] + b["w"]\n' +
                '        and a["x"] + a["w"] > b["x"]\n' +
                '        and a["y"] < b["y"] + b["h"]\n' +
                '        and a["y"] + a["h"] > b["y"]\n' +
                '    )\n\n' +
                'def start():\n' +
                '    return {"x": 160.0, "y": 120.0, "coin": 0, "score": 0}\n\n' +
                'def update(state, keys, dt):\n' +
                '    x = state["x"]\n' +
                '    y = state["y"]\n' +
                '    if "left" in keys:\n' +
                '        x = x - SPEED * dt\n' +
                '    if "right" in keys:\n' +
                '        x = x + SPEED * dt\n' +
                '    if "up" in keys:\n' +
                '        y = y - SPEED * dt\n' +
                '    if "down" in keys:\n' +
                '        y = y + SPEED * dt\n' +
                '    x = max(0, min(320 - SIDE, x))\n' +
                '    y = max(0, min(240 - SIDE, y))\n\n' +
                '    coin = state["coin"]\n' +
                '    score = state["score"]\n' +
                '    sx, sy = SPOTS[coin]\n' +
                '    if overlaps(\n' +
                '        {"x": x, "y": y, "w": SIDE, "h": SIDE},\n' +
                '        {"x": sx, "y": sy, "w": COIN, "h": COIN},\n' +
                '    ):\n' +
                '        score = score + 1\n' +
                '        coin = (coin + 1) % len(SPOTS)\n\n' +
                '    return {"x": x, "y": y, "coin": coin, "score": score}\n\n' +
                'def draw(state):\n' +
                '    sx, sy = SPOTS[state["coin"]]\n' +
                '    return [\n' +
                '        {"shape": "box", "x": sx, "y": sy, "w": COIN, "h": COIN, "color": "#f5c65b"},\n' +
                '        {"shape": "box", "x": state["x"], "y": state["y"], "w": SIDE, "h": SIDE, "color": "#24463d"},\n' +
                '        {"shape": "text", "x": 8, "y": 8, "text": "Score: " + str(state["score"]), "color": "#24463d"},\n' +
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
                'def distance(x1, y1, x2, y2):\n' +
                '    return math.hypot(x2 - x1, y2 - y1)\n\n' +
                'def touches(a, b):\n' +
                '    return distance(a["x"], a["y"], b["x"], b["y"]) < a["r"] + b["r"]',
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
                'distance(0, 0, 3, 4)    # 5.0\n' +
                'distance(10, 10, 10, 15) # 5.0',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Which shape should you use?', id: 'Bentuk mana yang sebaiknya kamu pakai?' },
              body: {
                en: 'Neither is more correct — the hitbox is a lie either way, and the question is which lie the player will forgive. Boxes suit things that stack and sit on ledges; circles suit things that fly and bump. Most games use whichever is kinder to the player and never mention it.',
                id: 'Tak satu pun lebih benar — kotak tabraknya toh sama-sama kebohongan, dan pertanyaannya kebohongan mana yang akan dimaafkan pemain. Kotak cocok untuk benda yang bertumpuk dan bertengger di tepian; lingkaran cocok untuk benda yang terbang dan berbenturan. Kebanyakan game memakai mana pun yang lebih ramah bagi pemain dan tak pernah menyebutkannya.',
              },
              code: {
                en:
                  '# player round, thing round: one comparison\n' +
                  'if touches(player, thing):\n' +
                  '    score = score + 1',
                id:
                  '# pemain bundar, benda bundar: satu perbandingan\n' +
                  'if touches(player, thing):\n' +
                  '    score = score + 1',
              },
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
                'def distance(x1, y1, x2, y2):',
                '    return math.hypot(x2 - x1, y2 - y1)',
                'def touches(a, b):',
                '    return distance(a["x"], a["y"], b["x"], b["y"]) < a["r"] + b["r"]',
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
                en: 'Write `distance` and `touches`, then a collector: a circle of radius 10 moves at 150 pixels per second and picks up a dot of radius 6, which moves on to the next spot in `SPOTS` and adds a point.',
                id: 'Tulis `distance` dan `touches`, lalu sebuah pengumpul: lingkaran berjari-jari 10 bergerak 150 piksel per detik dan memungut titik berjari-jari 6, yang lalu pindah ke titik berikutnya di `SPOTS` dan menambah satu poin.',
              },
              starter:
                'import math\n\n' +
                'SPOTS = [(260, 60), (60, 180), (250, 200), (80, 50)]\n' +
                'SPEED = 150\n' +
                'RADIUS = 10\n' +
                'DOT = 6\n\n' +
                'def distance(x1, y1, x2, y2):\n' +
                '    return 0.0\n\n' +
                'def touches(a, b):\n' +
                '    return False\n\n' +
                'def start():\n' +
                '    return {"x": 160.0, "y": 120.0, "dot": 0, "score": 0}\n\n' +
                'def update(state, keys, dt):\n' +
                '    x = state["x"]\n' +
                '    y = state["y"]\n' +
                '    if "left" in keys:\n' +
                '        x = x - SPEED * dt\n' +
                '    if "right" in keys:\n' +
                '        x = x + SPEED * dt\n' +
                '    if "up" in keys:\n' +
                '        y = y - SPEED * dt\n' +
                '    if "down" in keys:\n' +
                '        y = y + SPEED * dt\n' +
                '    x = max(RADIUS, min(320 - RADIUS, x))\n' +
                '    y = max(RADIUS, min(240 - RADIUS, y))\n' +
                '    return {"x": x, "y": y, "dot": state["dot"], "score": state["score"]}\n\n' +
                'def draw(state):\n' +
                '    sx, sy = SPOTS[state["dot"]]\n' +
                '    return [\n' +
                '        {"shape": "circle", "x": sx, "y": sy, "r": DOT, "color": "#f5c65b"},\n' +
                '        {"shape": "circle", "x": state["x"], "y": state["y"], "r": RADIUS, "color": "#24463d"},\n' +
                '        {"shape": "text", "x": 8, "y": 8, "text": "Score: " + str(state["score"]), "color": "#24463d"},\n' +
                '    ]\n',
              tests: [
                {
                  name: { en: 'The distance is right', id: 'Jaraknya benar' },
                  assert:
                    'assert abs(distance(0, 0, 3, 4) - 5) < 1e-9, f"distance(0,0,3,4) must be 5, now: {distance(0, 0, 3, 4)}"\n' +
                    'assert abs(distance(10, 10, 10, 10)) < 1e-9, f"the same point must be 0, now: {distance(10, 10, 10, 10)}"\n' +
                    'assert abs(distance(5, 5, 1, 2) - 5) < 1e-9, f"distance(5,5,1,2) must be 5, now: {distance(5, 5, 1, 2)}"\n' +
                    'assert abs(distance(3, 4, 0, 0) - 5) < 1e-9, "direction must not matter — distance is never negative"',
                },
                {
                  name: { en: 'Overlapping circles touch', id: 'Lingkaran yang bertindihan bersentuhan' },
                  assert:
                    'a = {"x": 0, "y": 0, "r": 5}\n' +
                    'assert touches(a, {"x": 6, "y": 0, "r": 5}), "centres 6 apart, radii sum to 10: must be a hit"\n' +
                    'assert touches(a, {"x": 0, "y": 0, "r": 1}), "the same centre must be a hit"\n' +
                    'assert touches({"x": 6, "y": 0, "r": 5}, a), "order must not matter"',
                },
                {
                  name: { en: 'Distant ones do not', id: 'Yang berjauhan tidak' },
                  assert:
                    'a = {"x": 0, "y": 0, "r": 5}\n' +
                    'assert not touches(a, {"x": 11, "y": 0, "r": 5}), "centres 11 apart, radii sum to 10: not a hit"\n' +
                    'assert not touches(a, {"x": 8, "y": 8, "r": 5}), "diagonal and too far: not a hit"',
                },
                {
                  name: { en: 'Exactly touching is not overlapping', id: 'Bersentuhan tepat bukan bertumpang tindih' },
                  assert:
                    'a = {"x": 0, "y": 0, "r": 5}\n' +
                    'assert not touches(a, {"x": 10, "y": 0, "r": 5}), "centres exactly 10 apart with radii summing to 10 must not be a hit"',
                },
                {
                  name: { en: 'Landing on the dot scores', id: 'Mendarat di butirnya menambah skor' },
                  assert:
                    'sx, sy = SPOTS[0]\n' +
                    'k = update({"x": float(sx), "y": float(sy), "dot": 0, "score": 0}, set(), 1 / 60)\n' +
                    'assert k["score"] == 1, f"must add to the score, now: {k[\'score\']}"\n' +
                    'assert k["dot"] == 1, f"the dot must move on, now: {k[\'dot\']}"',
                },
                {
                  name: { en: 'Being nearby is not enough', id: 'Berada di dekatnya tidak cukup' },
                  assert:
                    'sx, sy = SPOTS[0]\n' +
                    'k = update({"x": float(sx) + 40, "y": float(sy), "dot": 0, "score": 0}, set(), 1 / 60)\n' +
                    'assert k["score"] == 0, f"40 pixels away is not a touch, now score: {k[\'score\']}"',
                },
                {
                  name: { en: 'The dots cycle round', id: 'Butirnya berputar' },
                  assert:
                    'last = len(SPOTS) - 1\n' +
                    'sx, sy = SPOTS[last]\n' +
                    'k = update({"x": float(sx), "y": float(sy), "dot": last, "score": 3}, set(), 1 / 60)\n' +
                    'assert k["dot"] == 0, f"after the last one it must go back to 0, now: {k[\'dot\']}"',
                },
                {
                  name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
                  assert:
                    'k = {"x": 100.0, "y": 100.0, "dot": 0, "score": 0}\n' +
                    'copy = dict(k)\n' +
                    'update(k, {"left"}, 0.1)\n' +
                    'assert k == copy, f"update must not change the state it was given, now: {k}"',
                },
              ],
              hints: [
                { en: '`math.hypot(dx, dy)` takes the two differences, not the four coordinates.', id: '`math.hypot(dx, dy)` menerima kedua selisihnya, bukan keempat koordinatnya.' },
                { en: '`touches` compares that distance against the sum of the two radii, strictly.', id: '`touches` membandingkan jarak itu dengan jumlah kedua jari-jarinya, secara ketat.' },
                { en: 'In `update`, build both circles as dictionaries with `x`, `y` and `r`, then call `touches`.', id: 'Di `update`, bangun kedua lingkarannya sebagai dictionary berisi `x`, `y`, dan `r`, lalu panggil `touches`.' },
              ],
              solution:
                'import math\n\n' +
                'SPOTS = [(260, 60), (60, 180), (250, 200), (80, 50)]\n' +
                'SPEED = 150\n' +
                'RADIUS = 10\n' +
                'DOT = 6\n\n' +
                'def distance(x1, y1, x2, y2):\n' +
                '    return math.hypot(x2 - x1, y2 - y1)\n\n' +
                'def touches(a, b):\n' +
                '    return distance(a["x"], a["y"], b["x"], b["y"]) < a["r"] + b["r"]\n\n' +
                'def start():\n' +
                '    return {"x": 160.0, "y": 120.0, "dot": 0, "score": 0}\n\n' +
                'def update(state, keys, dt):\n' +
                '    x = state["x"]\n' +
                '    y = state["y"]\n' +
                '    if "left" in keys:\n' +
                '        x = x - SPEED * dt\n' +
                '    if "right" in keys:\n' +
                '        x = x + SPEED * dt\n' +
                '    if "up" in keys:\n' +
                '        y = y - SPEED * dt\n' +
                '    if "down" in keys:\n' +
                '        y = y + SPEED * dt\n' +
                '    x = max(RADIUS, min(320 - RADIUS, x))\n' +
                '    y = max(RADIUS, min(240 - RADIUS, y))\n\n' +
                '    dot = state["dot"]\n' +
                '    score = state["score"]\n' +
                '    sx, sy = SPOTS[dot]\n' +
                '    if touches({"x": x, "y": y, "r": RADIUS}, {"x": sx, "y": sy, "r": DOT}):\n' +
                '        score = score + 1\n' +
                '        dot = (dot + 1) % len(SPOTS)\n\n' +
                '    return {"x": x, "y": y, "dot": dot, "score": score}\n\n' +
                'def draw(state):\n' +
                '    sx, sy = SPOTS[state["dot"]]\n' +
                '    return [\n' +
                '        {"shape": "circle", "x": sx, "y": sy, "r": DOT, "color": "#f5c65b"},\n' +
                '        {"shape": "circle", "x": state["x"], "y": state["y"], "r": RADIUS, "color": "#24463d"},\n' +
                '        {"shape": "text", "x": 8, "y": 8, "text": "Score: " + str(state["score"]), "color": "#24463d"},\n' +
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
          { en: '`start()` returns `{"px": 130.0, "y": -12.0, "i": 0, "score": 0, "missed": 0}`.', id: '`start()` mengembalikan `{"px": 130.0, "y": -12.0, "i": 0, "score": 0, "missed": 0}`.' },
          { en: 'The paddle is 60 by 10, sits at y 220, moves left and right at 200 pixels per second, and stays on the field.', id: 'Papannya 60 kali 10, berada di y 220, bergerak kiri dan kanan 200 piksel per detik, dan tetap di lapangan.' },
          { en: 'The item is 12 by 12, falls at 90 pixels per second, and its x is `SPOT_X[i]`.', id: 'Bendanya 12 kali 12, jatuh 90 piksel per detik, dan x-nya adalah `SPOT_X[i]`.' },
          { en: 'Move the paddle first, then the item, then decide what happened.', id: 'Gerakkan papannya dulu, lalu bendanya, baru putuskan apa yang terjadi.' },
          { en: 'Caught (the two boxes overlap): `score` goes up, and the item restarts at y -12 with the next `i`.', id: 'Tertangkap (kedua kotaknya bertumpang tindih): `score` naik, dan bendanya mulai lagi di y -12 dengan `i` berikutnya.' },
          { en: 'Missed (its y passes 240): `missed` goes up, and the item restarts the same way. A frame is one or the other, never both.', id: 'Terlewat (y-nya melewati 240): `missed` naik, dan bendanya mulai lagi dengan cara yang sama. Satu bingkai adalah salah satunya, tak pernah keduanya.' },
        ],
        starter:
          'SPOT_X = [40, 160, 280, 100, 220]\n' +
          'SPEED = 200\n' +
          'FALL = 90\n' +
          'PADDLE_W = 60\n' +
          'PADDLE_H = 10\n' +
          'PADDLE_Y = 220\n' +
          'ITEM = 12\n\n' +
          'def overlaps(a, b):\n' +
          '    return (\n' +
          '        a["x"] < b["x"] + b["w"]\n' +
          '        and a["x"] + a["w"] > b["x"]\n' +
          '        and a["y"] < b["y"] + b["h"]\n' +
          '        and a["y"] + a["h"] > b["y"]\n' +
          '    )\n\n' +
          'def start():\n' +
          '    return {"px": 130.0, "y": -12.0, "i": 0, "score": 0, "missed": 0}\n\n' +
          'def update(state, keys, dt):\n' +
          '    return state\n\n' +
          'def draw(state):\n' +
          '    return [\n' +
          '        {"shape": "box", "x": SPOT_X[state["i"]], "y": state["y"], "w": ITEM, "h": ITEM, "color": "#f5c65b"},\n' +
          '        {"shape": "box", "x": state["px"], "y": PADDLE_Y, "w": PADDLE_W, "h": PADDLE_H, "color": "#24463d"},\n' +
          '        {"shape": "text", "x": 8, "y": 8, "text": "Caught: " + str(state["score"]) + "  Missed: " + str(state["missed"]), "color": "#24463d"},\n' +
          '    ]\n',
        tests: [
          {
            name: { en: 'The paddle moves and stays on the field', id: 'Papannya bergerak dan tetap di lapangan' },
            assert:
              'k = update({"px": 100.0, "y": 0.0, "i": 0, "score": 0, "missed": 0}, {"right"}, 0.5)\n' +
              'assert abs(k["px"] - 200) < 1e-9, f"right for half a second must be 200, now: {k[\'px\']}"\n' +
              'b = update({"px": 250.0, "y": 0.0, "i": 0, "score": 0, "missed": 0}, {"right"}, 1.0)\n' +
              'assert abs(b["px"] - 260) < 1e-9, f"must clamp to 320 - 60 = 260, now: {b[\'px\']}"\n' +
              'c = update({"px": 10.0, "y": 0.0, "i": 0, "score": 0, "missed": 0}, {"left"}, 1.0)\n' +
              'assert abs(c["px"]) < 1e-9, f"must clamp to 0, now: {c[\'px\']}"',
          },
          {
            name: { en: 'The item falls at its speed', id: 'Bendanya jatuh pada kecepatannya' },
            assert:
              'k = update({"px": 130.0, "y": 0.0, "i": 0, "score": 0, "missed": 0}, set(), 0.5)\n' +
              'assert abs(k["y"] - 45) < 1e-9, f"half a second must fall 45, now: {k[\'y\']}"\n' +
              'assert k["score"] == 0 and k["missed"] == 0, "nothing has happened yet in the middle of the field"',
          },
          {
            name: { en: 'Catching it scores and restarts it', id: 'Menangkapnya menambah skor dan mengulangnya' },
            assert:
              '# item 0 is at x 40; the paddle is moved under it, right at paddle height\n' +
              'k = update({"px": 20.0, "y": 215.0, "i": 0, "score": 3, "missed": 1}, set(), 1 / 60)\n' +
              'assert k["score"] == 4, f"must be caught, now score: {k[\'score\']}"\n' +
              'assert k["missed"] == 1, f"caught, not missed, now missed: {k[\'missed\']}"\n' +
              'assert abs(k["y"] + 12) < 1e-9, f"the item must restart at -12, now: {k[\'y\']}"\n' +
              'assert k["i"] == 1, f"must move on to the next item, now: {k[\'i\']}"',
          },
          {
            name: { en: 'A paddle out of the way catches nothing', id: 'Papan yang menyingkir tidak menangkap apa pun' },
            assert:
              'k = update({"px": 250.0, "y": 215.0, "i": 0, "score": 0, "missed": 0}, set(), 1 / 60)\n' +
              'assert k["score"] == 0, f"the paddle is far to the right, it must not catch, now: {k[\'score\']}"',
          },
          {
            name: { en: 'Missing it counts, and restarts it', id: 'Melewatkannya terhitung, dan mengulangnya' },
            assert:
              'k = update({"px": 250.0, "y": 239.0, "i": 2, "score": 5, "missed": 0}, set(), 0.5)\n' +
              'assert k["missed"] == 1, f"must count as missed, now: {k[\'missed\']}"\n' +
              'assert k["score"] == 5, f"a miss must not add to the score, now: {k[\'score\']}"\n' +
              'assert abs(k["y"] + 12) < 1e-9, f"must restart at -12, now: {k[\'y\']}"\n' +
              'assert k["i"] == 3, f"must move on to the next item, now: {k[\'i\']}"',
          },
          {
            name: { en: 'A frame is a catch or a miss, never both', id: 'Satu bingkai adalah tangkapan atau kelewatan, tak pernah keduanya' },
            assert:
              'k = update({"px": 20.0, "y": 230.0, "i": 0, "score": 0, "missed": 0}, set(), 0.5)\n' +
              'assert k["score"] + k["missed"] == 1, f"exactly one of the two must go up, now: score {k[\'score\']}, missed {k[\'missed\']}"',
          },
          {
            name: { en: 'The items cycle round', id: 'Bendanya berputar' },
            assert:
              'last = len(SPOT_X) - 1\n' +
              'k = update({"px": 250.0, "y": 239.0, "i": last, "score": 0, "missed": 0}, set(), 0.5)\n' +
              'assert k["i"] == 0, f"after the last one it must go back to 0, now: {k[\'i\']}"',
          },
          {
            name: { en: 'It never falls off the bottom and stays there', id: 'Ia tak pernah jatuh ke bawah lalu menetap di sana' },
            assert:
              'k = start()\n' +
              'for _ in range(1500):\n' +
              '    k = update(k, set(), 1 / 60)\n' +
              '    assert k["y"] <= 241, f"the item escaped downward and was not restarted: {k[\'y\']}"\n' +
              'assert k["missed"] > 0, "without moving the paddle, something should have been missed"',
          },
          {
            name: { en: 'A run with the paddle underneath scores', id: 'Perjalanan dengan papan di bawahnya menghasilkan skor' },
            assert:
              'k = start()\n' +
              'for _ in range(1500):\n' +
              '    # keep the paddle under the currently falling item\n' +
              '    target = SPOT_X[k["i"]] - 24\n' +
              '    held = set()\n' +
              '    if k["px"] < target - 2:\n' +
              '        held = {"right"}\n' +
              '    elif k["px"] > target + 2:\n' +
              '        held = {"left"}\n' +
              '    k = update(k, held, 1 / 60)\n' +
              'assert k["score"] > 5, f"a paddle that follows should catch a lot, now: {k[\'score\']}"',
          },
          {
            name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
            assert:
              'k = {"px": 20.0, "y": 215.0, "i": 0, "score": 0, "missed": 0}\n' +
              'copy = dict(k)\n' +
              'update(k, {"right"}, 0.1)\n' +
              'assert k == copy, f"update must not change the state it was given, now: {k}"',
          },
        ],
        hints: [
          { en: '`overlaps` is already written for you. The whole project is one `update`.', id: '`overlaps` sudah dituliskan untukmu. Seluruh proyeknya adalah satu `update`.' },
          { en: 'Follow the stated order. Building the item box before moving the paddle would test last frame\'s paddle against this frame\'s item.', id: 'Ikuti urutan yang disebutkan. Membangun kotak bendanya sebelum menggerakkan papan berarti menguji papan bingkai lalu terhadap benda bingkai ini.' },
          { en: 'The two outcomes are `if` and `elif`, not two `if`s — one test exists to catch exactly that.', id: 'Kedua hasilnya adalah `if` dan `elif`, bukan dua `if` — ada satu tes khusus untuk menangkap itu.' },
          { en: 'Restarting is three assignments together: y back to -12, `i` to the next one, and the counter up.', id: 'Mengulang berarti tiga penugasan sekaligus: y kembali ke -12, `i` ke berikutnya, dan penghitungnya naik.' },
        ],
        solution:
          'SPOT_X = [40, 160, 280, 100, 220]\n' +
          'SPEED = 200\n' +
          'FALL = 90\n' +
          'PADDLE_W = 60\n' +
          'PADDLE_H = 10\n' +
          'PADDLE_Y = 220\n' +
          'ITEM = 12\n' +
          'WIDTH = 320\n' +
          'HEIGHT = 240\n\n' +
          'def overlaps(a, b):\n' +
          '    return (\n' +
          '        a["x"] < b["x"] + b["w"]\n' +
          '        and a["x"] + a["w"] > b["x"]\n' +
          '        and a["y"] < b["y"] + b["h"]\n' +
          '        and a["y"] + a["h"] > b["y"]\n' +
          '    )\n\n' +
          'def start():\n' +
          '    return {"px": 130.0, "y": -12.0, "i": 0, "score": 0, "missed": 0}\n\n' +
          'def update(state, keys, dt):\n' +
          '    px = state["px"]\n' +
          '    if "left" in keys:\n' +
          '        px = px - SPEED * dt\n' +
          '    if "right" in keys:\n' +
          '        px = px + SPEED * dt\n' +
          '    px = max(0, min(WIDTH - PADDLE_W, px))\n\n' +
          '    y = state["y"] + FALL * dt\n' +
          '    i = state["i"]\n' +
          '    score = state["score"]\n' +
          '    missed = state["missed"]\n\n' +
          '    item = {"x": SPOT_X[i], "y": y, "w": ITEM, "h": ITEM}\n' +
          '    paddle = {"x": px, "y": PADDLE_Y, "w": PADDLE_W, "h": PADDLE_H}\n\n' +
          '    if overlaps(item, paddle):\n' +
          '        score = score + 1\n' +
          '        y = -12.0\n' +
          '        i = (i + 1) % len(SPOT_X)\n' +
          '    elif y > HEIGHT:\n' +
          '        missed = missed + 1\n' +
          '        y = -12.0\n' +
          '        i = (i + 1) % len(SPOT_X)\n\n' +
          '    return {"px": px, "y": y, "i": i, "score": score, "missed": missed}\n\n' +
          'def draw(state):\n' +
          '    return [\n' +
          '        {"shape": "box", "x": SPOT_X[state["i"]], "y": state["y"], "w": ITEM, "h": ITEM, "color": "#f5c65b"},\n' +
          '        {"shape": "box", "x": state["px"], "y": PADDLE_Y, "w": PADDLE_W, "h": PADDLE_H, "color": "#24463d"},\n' +
          '        {"shape": "text", "x": 8, "y": 8, "text": "Caught: " + str(state["score"]) + "  Missed: " + str(state["missed"]), "color": "#24463d"},\n' +
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
              code: {
                en: 'if overlaps(ball, paddle):\n    vy = -abs(vy)   # always upward, never jittering',
                id: 'if overlaps(ball, paddle):\n    vy = -abs(vy)   # selalu ke atas, tak pernah menggigil',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Where it hit should matter', id: 'Tempat kenanya seharusnya berarti' },
              body: {
                en: 'A ball that always leaves at the same angle is a ball the player cannot aim. Measure how far from the paddle\'s centre it landed, as a fraction from `-1` to `1`, and turn that into horizontal speed. Now the edge of the paddle is a tool, and a game of luck becomes a game of skill.',
                id: 'Bola yang selalu pergi dengan sudut sama adalah bola yang tak bisa diarahkan pemain. Ukur seberapa jauh dari pusat papannya ia mendarat, sebagai pecahan dari `-1` sampai `1`, lalu ubah itu jadi kecepatan mendatar. Sekarang tepi papannya jadi alat, dan permainan untung-untungan berubah jadi permainan keterampilan.',
              },
              code: {
                en:
                  'center = px + PADDLE_W / 2\n' +
                  'offset = (ball_x - center) / (PADDLE_W / 2)   # -1 at the left edge, 1 at the right\n' +
                  'vx = offset * 180',
                id:
                  'center = px + PADDLE_W / 2\n' +
                  'offset = (ball_x - center) / (PADDLE_W / 2)   # -1 di ujung kiri, 1 di kanan\n' +
                  'vx = offset * 180',
              },
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
                'y = PADDLE_Y - RADIUS\n' +
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
                'SPEED = 220\n' +
                'RADIUS = 6\n' +
                'PADDLE_W = 60\n' +
                'PADDLE_H = 10\n' +
                'PADDLE_Y = 210\n' +
                'WIDTH = 320\n\n' +
                'def overlaps(a, b):\n' +
                '    return (\n' +
                '        a["x"] < b["x"] + b["w"]\n' +
                '        and a["x"] + a["w"] > b["x"]\n' +
                '        and a["y"] < b["y"] + b["h"]\n' +
                '        and a["y"] + a["h"] > b["y"]\n' +
                '    )\n\n' +
                'def start():\n' +
                '    return {"px": 130.0, "x": 160.0, "y": 60.0, "vx": 70.0, "vy": 150.0}\n\n' +
                'def update(state, keys, dt):\n' +
                '    px = state["px"]\n' +
                '    if "left" in keys:\n' +
                '        px = px - SPEED * dt\n' +
                '    if "right" in keys:\n' +
                '        px = px + SPEED * dt\n' +
                '    px = max(0, min(WIDTH - PADDLE_W, px))\n\n' +
                '    x = state["x"] + state["vx"] * dt\n' +
                '    y = state["y"] + state["vy"] * dt\n' +
                '    vx = state["vx"]\n' +
                '    vy = state["vy"]\n\n' +
                '    return {"px": px, "x": x, "y": y, "vx": vx, "vy": vy}\n\n' +
                'def draw(state):\n' +
                '    return [\n' +
                '        {"shape": "box", "x": state["px"], "y": PADDLE_Y, "w": PADDLE_W, "h": PADDLE_H, "color": "#24463d"},\n' +
                '        {"shape": "circle", "x": state["x"], "y": state["y"], "r": RADIUS, "color": "#ef8f70"},\n' +
                '    ]\n',
              tests: [
                {
                  name: { en: 'The side walls turn it around', id: 'Dinding sampingnya memutarnya balik' },
                  assert:
                    'k = update({"px": 130.0, "x": 8.0, "y": 100.0, "vx": -100.0, "vy": 0.0}, set(), 0.1)\n' +
                    'assert abs(k["x"] - 6) < 1e-9, f"must clamp to the radius, 6, now: {k[\'x\']}"\n' +
                    'assert k["vx"] > 0, f"vx must become positive, now: {k[\'vx\']}"\n' +
                    'b = update({"px": 130.0, "x": 312.0, "y": 100.0, "vx": 100.0, "vy": 0.0}, set(), 0.1)\n' +
                    'assert abs(b["x"] - 314) < 1e-9, f"must clamp to 320 - 6 = 314, now: {b[\'x\']}"\n' +
                    'assert b["vx"] < 0, f"vx must become negative, now: {b[\'vx\']}"',
                },
                {
                  name: { en: 'The ceiling sends it back down', id: 'Langit-langitnya mengirimnya turun lagi' },
                  assert:
                    'k = update({"px": 130.0, "x": 100.0, "y": 8.0, "vx": 0.0, "vy": -100.0}, set(), 0.1)\n' +
                    'assert abs(k["y"] - 6) < 1e-9, f"must clamp to 6, now: {k[\'y\']}"\n' +
                    'assert k["vy"] > 0, f"vy must become positive, now: {k[\'vy\']}"',
                },
                {
                  name: { en: 'The paddle sends it back up', id: 'Papannya mengirimnya naik lagi' },
                  assert:
                    '# the ball is right above a paddle starting at 130, falling into it\n' +
                    'k = update({"px": 130.0, "x": 160.0, "y": 206.0, "vx": 0.0, "vy": 150.0}, set(), 1 / 60)\n' +
                    'assert k["vy"] < 0, f"must bounce upward, now vy: {k[\'vy\']}"\n' +
                    'assert abs(k["y"] - (210 - 6)) < 1e-9, f"must be placed on top of the paddle, y = 204, now: {k[\'y\']}"',
                },
                {
                  name: { en: 'The centre sends it straight up', id: 'Pusatnya mengirimnya lurus ke atas' },
                  assert:
                    '# paddle 130..190, centre 160; the ball lands exactly there\n' +
                    'k = update({"px": 130.0, "x": 159.9, "y": 206.0, "vx": 10.0, "vy": 150.0}, set(), 0.01)\n' +
                    'assert abs(k["vx"]) < 1e-6, f"hitting exactly at the centre must make vx zero, now: {k[\'vx\']}"',
                },
                {
                  name: { en: 'The edges steer it', id: 'Tepinya mengarahkannya' },
                  assert:
                    'right = update({"px": 130.0, "x": 188.0, "y": 206.0, "vx": 0.0, "vy": 150.0}, set(), 1 / 60)\n' +
                    'assert right["vx"] > 100, f"hitting near the right edge must throw it strongly right, now: {right[\'vx\']}"\n' +
                    'left = update({"px": 130.0, "x": 132.0, "y": 206.0, "vx": 0.0, "vy": 150.0}, set(), 1 / 60)\n' +
                    'assert left["vx"] < -100, f"hitting near the left edge must throw it strongly left, now: {left[\'vx\']}"',
                },
                {
                  name: { en: 'It does not stick to the paddle', id: 'Ia tidak menempel di papan' },
                  assert:
                    'k = {"px": 130.0, "x": 160.0, "y": 206.0, "vx": 0.0, "vy": 150.0}\n' +
                    'k = update(k, set(), 1 / 60)\n' +
                    'k = update(k, set(), 1 / 60)\n' +
                    'assert k["vy"] < 0, f"the next frame must still be moving up, not bounced again, now: {k[\'vy\']}"',
                },
                {
                  name: { en: 'A paddle out of the way does nothing', id: 'Papan yang menyingkir tak melakukan apa-apa' },
                  assert:
                    'k = update({"px": 0.0, "x": 300.0, "y": 206.0, "vx": 0.0, "vy": 150.0}, set(), 1 / 60)\n' +
                    'assert k["vy"] > 0, f"the paddle is far away, the ball must keep falling, now: {k[\'vy\']}"',
                },
                {
                  name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
                  assert:
                    'k = {"px": 130.0, "x": 160.0, "y": 206.0, "vx": 0.0, "vy": 150.0}\n' +
                    'copy = dict(k)\n' +
                    'update(k, set(), 1 / 60)\n' +
                    'assert k == copy, f"update must not change the state it was given, now: {k}"',
                },
              ],
              hints: [
                { en: 'The three walls first — the same shape as the bouncing ball project, minus the floor.', id: 'Ketiga dindingnya dulu — bentuk yang sama dengan proyek bola pantul, dikurangi lantainya.' },
                { en: 'Build the ball as a box for `overlaps`: `{"x": x - RADIUS, "y": y - RADIUS, "w": 2 * RADIUS, "h": 2 * RADIUS}`.', id: 'Bangun bolanya sebagai kotak untuk `overlaps`: `{"x": x - RADIUS, "y": y - RADIUS, "w": 2 * RADIUS, "h": 2 * RADIUS}`.' },
                { en: 'On a hit, do all three: y to `PADDLE_Y - RADIUS`, `vy = -abs(vy)`, and vx from the offset.', id: 'Saat kena, lakukan ketiganya: y jadi `PADDLE_Y - RADIUS`, `vy = -abs(vy)`, dan vx dari selisihnya.' },
                { en: 'The offset is `(x - (px + PADDLE_W / 2)) / (PADDLE_W / 2)`, then times 180.', id: 'Selisihnya adalah `(x - (px + PADDLE_W / 2)) / (PADDLE_W / 2)`, lalu dikali 180.' },
              ],
              solution:
                'SPEED = 220\n' +
                'RADIUS = 6\n' +
                'PADDLE_W = 60\n' +
                'PADDLE_H = 10\n' +
                'PADDLE_Y = 210\n' +
                'WIDTH = 320\n' +
                'STEER = 180\n\n' +
                'def overlaps(a, b):\n' +
                '    return (\n' +
                '        a["x"] < b["x"] + b["w"]\n' +
                '        and a["x"] + a["w"] > b["x"]\n' +
                '        and a["y"] < b["y"] + b["h"]\n' +
                '        and a["y"] + a["h"] > b["y"]\n' +
                '    )\n\n' +
                'def start():\n' +
                '    return {"px": 130.0, "x": 160.0, "y": 60.0, "vx": 70.0, "vy": 150.0}\n\n' +
                'def update(state, keys, dt):\n' +
                '    px = state["px"]\n' +
                '    if "left" in keys:\n' +
                '        px = px - SPEED * dt\n' +
                '    if "right" in keys:\n' +
                '        px = px + SPEED * dt\n' +
                '    px = max(0, min(WIDTH - PADDLE_W, px))\n\n' +
                '    x = state["x"] + state["vx"] * dt\n' +
                '    y = state["y"] + state["vy"] * dt\n' +
                '    vx = state["vx"]\n' +
                '    vy = state["vy"]\n\n' +
                '    if x < RADIUS:\n' +
                '        x = RADIUS\n' +
                '        vx = abs(vx)\n' +
                '    if x > WIDTH - RADIUS:\n' +
                '        x = WIDTH - RADIUS\n' +
                '        vx = -abs(vx)\n' +
                '    if y < RADIUS:\n' +
                '        y = RADIUS\n' +
                '        vy = abs(vy)\n\n' +
                '    ball = {"x": x - RADIUS, "y": y - RADIUS, "w": 2 * RADIUS, "h": 2 * RADIUS}\n' +
                '    paddle = {"x": px, "y": PADDLE_Y, "w": PADDLE_W, "h": PADDLE_H}\n' +
                '    if overlaps(ball, paddle):\n' +
                '        y = PADDLE_Y - RADIUS\n' +
                '        vy = -abs(vy)\n' +
                '        offset = (x - (px + PADDLE_W / 2)) / (PADDLE_W / 2)\n' +
                '        vx = offset * STEER\n\n' +
                '    return {"px": px, "x": x, "y": y, "vx": vx, "vy": vy}\n\n' +
                'def draw(state):\n' +
                '    return [\n' +
                '        {"shape": "box", "x": state["px"], "y": PADDLE_Y, "w": PADDLE_W, "h": PADDLE_H, "color": "#24463d"},\n' +
                '        {"shape": "circle", "x": state["x"], "y": state["y"], "r": RADIUS, "color": "#ef8f70"},\n' +
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
                'blocks = [\n' +
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
              code: {
                en:
                  '# move everything\n' +
                  'blocks = [{"x": b["x"], "y": b["y"] + FALL * dt} for b in state["blocks"]]\n\n' +
                  '# then keep what is still on screen\n' +
                  'blocks = [b for b in blocks if b["y"] <= 240]',
                id:
                  '# gerakkan semuanya\n' +
                  'blocks = [{"x": b["x"], "y": b["y"] + FALL * dt} for b in state["blocks"]]\n\n' +
                  '# lalu simpan yang masih di layar\n' +
                  'blocks = [b for b in blocks if b["y"] <= 240]',
              },
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
                'remaining = state["remaining"] - dt\n' +
                'if remaining <= 0:\n' +
                '    blocks = blocks + [{"x": SPOT_X[i], "y": -20.0}]\n' +
                '    i = (i + 1) % len(SPOT_X)\n' +
                '    remaining = SPAWN_DELAY',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why set the timer back to `SPAWN_DELAY` rather than to `0`?',
                id: 'Kenapa menyetel pewaktunya kembali ke `SPAWN_DELAY` alih-alih ke `0`?',
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
                en: 'Blocks 14 by 14 fall at 110 pixels per second. Every 0.7 seconds a new one appears at `SPOT_X[i]` and y -14, and `i` moves on. A block whose y passes 240 is dropped from the list.',
                id: 'Balok 14 kali 14 jatuh 110 piksel per detik. Tiap 0,7 detik satu balok baru muncul di `SPOT_X[i]` dan y -14, dan `i` maju. Balok yang y-nya melewati 240 dibuang dari daftarnya.',
              },
              starter:
                'SPOT_X = [30, 120, 210, 280, 70]\n' +
                'FALL = 110\n' +
                'SPAWN_DELAY = 0.7\n' +
                'SIDE = 14\n' +
                'HEIGHT = 240\n\n' +
                'def start():\n' +
                '    return {"blocks": [], "i": 0, "remaining": 0.0}\n\n' +
                'def update(state, keys, dt):\n' +
                '    return state\n\n' +
                'def draw(state):\n' +
                '    result = []\n' +
                '    for b in state["blocks"]:\n' +
                '        result.append({"shape": "box", "x": b["x"], "y": b["y"], "w": SIDE, "h": SIDE, "color": "#ef8f70"})\n' +
                '    result.append({"shape": "text", "x": 8, "y": 8, "text": "Blocks: " + str(len(state["blocks"])), "color": "#24463d"})\n' +
                '    return result\n',
              tests: [
                {
                  name: { en: 'The blocks fall', id: 'Baloknya jatuh' },
                  assert:
                    'k = update({"blocks": [{"x": 30, "y": 0.0}], "i": 0, "remaining": 5.0}, set(), 0.5)\n' +
                    'assert len(k["blocks"]) == 1, f"not time for a new one yet, now: {len(k[\'blocks\'])}"\n' +
                    'assert abs(k["blocks"][0]["y"] - 55) < 1e-9, f"half a second must fall 55, now: {k[\'blocks\'][0][\'y\']}"\n' +
                    'assert k["blocks"][0]["x"] == 30, "x must not change"',
                },
                {
                  name: { en: 'The timer counts down', id: 'Pewaktunya menghitung mundur' },
                  assert:
                    'k = update({"blocks": [], "i": 0, "remaining": 0.5}, set(), 0.2)\n' +
                    'assert abs(k["remaining"] - 0.3) < 1e-9, f"remaining must be 0.3, now: {k[\'remaining\']}"\n' +
                    'assert len(k["blocks"]) == 0, "not time for one to appear yet"',
                },
                {
                  name: { en: 'A new block appears when it reaches zero', id: 'Balok baru muncul ketika ia mencapai nol' },
                  assert:
                    'k = update({"blocks": [], "i": 2, "remaining": 0.05}, set(), 0.1)\n' +
                    'assert len(k["blocks"]) == 1, f"one must appear, now: {len(k[\'blocks\'])}"\n' +
                    'assert k["blocks"][0]["x"] == SPOT_X[2], f"must appear at SPOT_X[2], now: {k[\'blocks\'][0][\'x\']}"\n' +
                    'assert abs(k["blocks"][0]["y"] + 14) < 1e-9, f"must start at -14, now: {k[\'blocks\'][0][\'y\']}"\n' +
                    'assert k["i"] == 3, f"i must move on, now: {k[\'i\']}"\n' +
                    'assert k["remaining"] > 0.5, f"the timer must be reset, now: {k[\'remaining\']}"',
                },
                {
                  name: { en: 'The spawn point cycles round', id: 'Titik munculnya berputar' },
                  assert:
                    'last = len(SPOT_X) - 1\n' +
                    'k = update({"blocks": [], "i": last, "remaining": 0.0}, set(), 0.01)\n' +
                    'assert k["i"] == 0, f"after the last one it must go back to 0, now: {k[\'i\']}"',
                },
                {
                  name: { en: 'Blocks past the bottom are dropped', id: 'Balok yang melewati bawah dibuang' },
                  assert:
                    'k = update({"blocks": [{"x": 30, "y": 239.0}, {"x": 70, "y": 10.0}], "i": 0, "remaining": 5.0}, set(), 0.5)\n' +
                    'assert len(k["blocks"]) == 1, f"the one at the bottom must be dropped, now remaining: {len(k[\'blocks\'])}"\n' +
                    'assert k["blocks"][0]["x"] == 70, "the survivor must be the one still on screen"',
                },
                {
                  name: { en: 'Everything on screen is kept', id: 'Semua yang masih di layar disimpan' },
                  assert:
                    'starting_blocks = [{"x": 30, "y": 0.0}, {"x": 70, "y": 100.0}, {"x": 120, "y": 200.0}]\n' +
                    'k = update({"blocks": starting_blocks, "i": 0, "remaining": 5.0}, set(), 0.1)\n' +
                    'assert len(k["blocks"]) == 3, f"none has passed yet, all three must remain, now: {len(k[\'blocks\'])}"',
                },
                {
                  name: { en: 'The list does not grow without limit', id: 'Daftarnya tidak tumbuh tanpa batas' },
                  assert:
                    'k = start()\n' +
                    'for _ in range(1800):\n' +
                    '    k = update(k, set(), 1 / 60)\n' +
                    'assert len(k["blocks"]) < 12, f"after 30 seconds the list must stay small, now: {len(k[\'blocks\'])}"\n' +
                    'assert len(k["blocks"]) > 0, "but something should still be falling"',
                },
                {
                  name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
                  assert:
                    'original = [{"x": 30, "y": 10.0}]\n' +
                    'k = {"blocks": original, "i": 0, "remaining": 5.0}\n' +
                    'update(k, set(), 0.5)\n' +
                    'assert original[0]["y"] == 10.0, f"the old blocks must not move too, now: {original[0][\'y\']}"\n' +
                    'assert len(k["blocks"]) == 1 and k["remaining"] == 5.0, "the state it was given must not change"',
                },
              ],
              hints: [
                { en: 'Three steps, in order: move them all, drop the ones that are gone, then maybe add one.', id: 'Tiga langkah, berurutan: gerakkan semuanya, buang yang sudah hilang, lalu mungkin tambahkan satu.' },
                { en: 'Moving means a **new** dictionary per block, not `b["y"] += …` — one test checks exactly that.', id: 'Menggerakkan berarti dictionary **baru** per balok, bukan `b["y"] += …` — ada satu tes yang memeriksa persis itu.' },
                { en: 'Adding is `blocks + [new_block]`, which builds a new list rather than appending to the old one.', id: 'Menambah adalah `blocks + [new_block]`, yang membangun daftar baru alih-alih menambahkan ke yang lama.' },
                { en: 'Set the timer back to `SPAWN_DELAY`, not to zero.', id: 'Setel pewaktunya kembali ke `SPAWN_DELAY`, bukan ke nol.' },
              ],
              solution:
                'SPOT_X = [30, 120, 210, 280, 70]\n' +
                'FALL = 110\n' +
                'SPAWN_DELAY = 0.7\n' +
                'SIDE = 14\n' +
                'HEIGHT = 240\n\n' +
                'def start():\n' +
                '    return {"blocks": [], "i": 0, "remaining": 0.0}\n\n' +
                'def update(state, keys, dt):\n' +
                '    blocks = [{"x": b["x"], "y": b["y"] + FALL * dt} for b in state["blocks"]]\n' +
                '    blocks = [b for b in blocks if b["y"] <= HEIGHT]\n\n' +
                '    i = state["i"]\n' +
                '    remaining = state["remaining"] - dt\n' +
                '    if remaining <= 0:\n' +
                '        blocks = blocks + [{"x": SPOT_X[i], "y": -float(SIDE)}]\n' +
                '        i = (i + 1) % len(SPOT_X)\n' +
                '        remaining = SPAWN_DELAY\n\n' +
                '    return {"blocks": blocks, "i": i, "remaining": remaining}\n\n' +
                'def draw(state):\n' +
                '    result = []\n' +
                '    for b in state["blocks"]:\n' +
                '        result.append({"shape": "box", "x": b["x"], "y": b["y"], "w": SIDE, "h": SIDE, "color": "#ef8f70"})\n' +
                '    result.append({"shape": "text", "x": 8, "y": 8, "text": "Blocks: " + str(len(state["blocks"])), "color": "#24463d"})\n' +
                '    return result\n',
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
          { en: '`start()` returns `{"x": 152.0, "blocks": [], "i": 0, "remaining": 0.0, "dodged": 0, "hit": 0}`.', id: '`start()` mengembalikan `{"x": 152.0, "blocks": [], "i": 0, "remaining": 0.0, "dodged": 0, "hit": 0}`.' },
          { en: 'The player is 16 by 16 at y 210, moves left and right at 190 pixels per second, and stays on the field.', id: 'Pemainnya 16 kali 16 di y 210, bergerak kiri dan kanan 190 piksel per detik, dan tetap di lapangan.' },
          { en: 'Blocks are 14 by 14, fall at 120 pixels per second, and a new one appears every 0.6 seconds at `SPOT_X[i]`, y -14.', id: 'Baloknya 14 kali 14, jatuh 120 piksel per detik, dan yang baru muncul tiap 0,6 detik di `SPOT_X[i]`, y -14.' },
          { en: 'In order: move the player, move the blocks, then resolve each block.', id: 'Berurutan: gerakkan pemainnya, gerakkan baloknya, lalu selesaikan tiap baloknya.' },
          { en: 'A block that overlaps the player is removed and `hit` goes up. A block past y 240 is removed and `dodged` goes up. Everything else stays.', id: 'Balok yang bertumpang tindih dengan pemain dibuang dan `hit` naik. Balok yang melewati y 240 dibuang dan `dodged` naik. Sisanya tetap.' },
          { en: 'Then, if the timer has run out, add the next block.', id: 'Setelah itu, kalau pewaktunya habis, tambahkan balok berikutnya.' },
        ],
        starter:
          'SPOT_X = [30, 120, 210, 280, 70, 160]\n' +
          'SPEED = 190\n' +
          'FALL = 120\n' +
          'SPAWN_DELAY = 0.6\n' +
          'SIDE = 16\n' +
          'BLOCK = 14\n' +
          'PLAYER_Y = 210\n' +
          'WIDTH = 320\n' +
          'HEIGHT = 240\n\n' +
          'def overlaps(a, b):\n' +
          '    return (\n' +
          '        a["x"] < b["x"] + b["w"]\n' +
          '        and a["x"] + a["w"] > b["x"]\n' +
          '        and a["y"] < b["y"] + b["h"]\n' +
          '        and a["y"] + a["h"] > b["y"]\n' +
          '    )\n\n' +
          'def start():\n' +
          '    return {"x": 152.0, "blocks": [], "i": 0, "remaining": 0.0, "dodged": 0, "hit": 0}\n\n' +
          'def update(state, keys, dt):\n' +
          '    return state\n\n' +
          'def draw(state):\n' +
          '    result = []\n' +
          '    for b in state["blocks"]:\n' +
          '        result.append({"shape": "box", "x": b["x"], "y": b["y"], "w": BLOCK, "h": BLOCK, "color": "#ef8f70"})\n' +
          '    result.append({"shape": "box", "x": state["x"], "y": PLAYER_Y, "w": SIDE, "h": SIDE, "color": "#24463d"})\n' +
          '    result.append({"shape": "text", "x": 8, "y": 8, "text": "Dodged: " + str(state["dodged"]) + "  Hit: " + str(state["hit"]), "color": "#24463d"})\n' +
          '    return result\n',
        tests: [
          {
            name: { en: 'The player moves and stays on the field', id: 'Pemainnya bergerak dan tetap di lapangan' },
            assert:
              'base = {"x": 100.0, "blocks": [], "i": 0, "remaining": 5.0, "dodged": 0, "hit": 0}\n' +
              'k = update(dict(base), {"right"}, 0.5)\n' +
              'assert abs(k["x"] - 195) < 1e-9, f"right for half a second must be 195, now: {k[\'x\']}"\n' +
              'b = update({**base, "x": 300.0}, {"right"}, 1.0)\n' +
              'assert abs(b["x"] - 304) < 1e-9, f"must clamp to 320 - 16 = 304, now: {b[\'x\']}"',
          },
          {
            name: { en: 'The blocks fall', id: 'Baloknya jatuh' },
            assert:
              'k = update({"x": 0.0, "blocks": [{"x": 300, "y": 0.0}], "i": 0, "remaining": 5.0, "dodged": 0, "hit": 0}, set(), 0.5)\n' +
              'assert len(k["blocks"]) == 1, f"one must remain, now: {len(k[\'blocks\'])}"\n' +
              'assert abs(k["blocks"][0]["y"] - 60) < 1e-9, f"half a second must fall 60, now: {k[\'blocks\'][0][\'y\']}"',
          },
          {
            name: { en: 'A block that lands on you counts as a hit', id: 'Balok yang mendarat di kamu terhitung kena' },
            assert:
              'k = update({"x": 152.0, "blocks": [{"x": 152, "y": 205.0}], "i": 0, "remaining": 5.0, "dodged": 0, "hit": 0}, set(), 1 / 60)\n' +
              'assert k["hit"] == 1, f"must count as a hit, now: {k[\'hit\']}"\n' +
              'assert k["dodged"] == 0, f"hit, not dodged, now: {k[\'dodged\']}"\n' +
              'assert len(k["blocks"]) == 0, f"the block that hit must be removed, now remaining: {len(k[\'blocks\'])}"',
          },
          {
            name: { en: 'A block that misses you counts as a dodge', id: 'Balok yang meleset terhitung lolos' },
            assert:
              'k = update({"x": 0.0, "blocks": [{"x": 300, "y": 239.0}], "i": 0, "remaining": 5.0, "dodged": 0, "hit": 0}, set(), 0.5)\n' +
              'assert k["dodged"] == 1, f"must count as dodged, now: {k[\'dodged\']}"\n' +
              'assert k["hit"] == 0, f"dodged, not hit, now: {k[\'hit\']}"\n' +
              'assert len(k["blocks"]) == 0, f"the block that got away must be removed, now remaining: {len(k[\'blocks\'])}"',
          },
          {
            name: { en: 'Blocks in mid-air are left alone', id: 'Balok di udara dibiarkan' },
            assert:
              'k = update({"x": 152.0, "blocks": [{"x": 30, "y": 50.0}, {"x": 120, "y": 100.0}], "i": 0, "remaining": 5.0, "dodged": 0, "hit": 0}, set(), 0.1)\n' +
              'assert len(k["blocks"]) == 2, f"both are still falling, now: {len(k[\'blocks\'])}"\n' +
              'assert k["dodged"] == 0 and k["hit"] == 0, "nothing has happened yet"',
          },
          {
            name: { en: 'Several blocks are resolved in one frame', id: 'Beberapa balok diselesaikan dalam satu bingkai' },
            assert:
              'k = update({\n' +
              '    "x": 152.0,\n' +
              '    "blocks": [{"x": 152, "y": 205.0}, {"x": 300, "y": 239.0}, {"x": 30, "y": 10.0}],\n' +
              '    "i": 0, "remaining": 5.0, "dodged": 0, "hit": 0,\n' +
              '}, set(), 1 / 60)\n' +
              'assert k["hit"] == 1, f"one hit, now: {k[\'hit\']}"\n' +
              'assert k["dodged"] == 1, f"one dodge, now: {k[\'dodged\']}"\n' +
              'assert len(k["blocks"]) == 1, f"one still falling, now: {len(k[\'blocks\'])}"',
          },
          {
            name: { en: 'New blocks arrive on the timer', id: 'Balok baru datang mengikuti pewaktu' },
            assert:
              'k = update({"x": 152.0, "blocks": [], "i": 3, "remaining": 0.05, "dodged": 0, "hit": 0}, set(), 0.1)\n' +
              'assert len(k["blocks"]) == 1, f"one must appear, now: {len(k[\'blocks\'])}"\n' +
              'assert k["blocks"][0]["x"] == SPOT_X[3], f"must be at SPOT_X[3], now: {k[\'blocks\'][0][\'x\']}"\n' +
              'assert abs(k["blocks"][0]["y"] + 14) < 1e-9, f"must start at -14, now: {k[\'blocks\'][0][\'y\']}"\n' +
              'assert k["i"] == 4, f"i must move on, now: {k[\'i\']}"\n' +
              'assert k["remaining"] > 0.4, f"the timer must be reset, now: {k[\'remaining\']}"',
          },
          {
            name: { en: 'A new block is not resolved the moment it appears', id: 'Balok baru tidak langsung diselesaikan begitu muncul' },
            assert:
              'k = update({"x": 30.0, "blocks": [], "i": 0, "remaining": 0.0, "dodged": 0, "hit": 0}, set(), 0.01)\n' +
              'assert len(k["blocks"]) == 1, "the newly appeared block must still be there"\n' +
              'assert k["hit"] == 0 and k["dodged"] == 0, "a block still off the top of the screen has not touched anything"',
          },
          {
            name: { en: 'Standing still gets you hit', id: 'Diam saja membuatmu terkena' },
            assert:
              'k = start()\n' +
              'for _ in range(1800):\n' +
              '    k = update(k, set(), 1 / 60)\n' +
              'assert k["hit"] > 0, "standing in the middle for 30 seconds is bound to get hit by something"\n' +
              'assert k["dodged"] > 0, "and most of the rest should be dodged"\n' +
              'assert len(k["blocks"]) < 12, f"the list must stay small, now: {len(k[\'blocks\'])}"',
          },
          {
            name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
            assert:
              'original = [{"x": 30, "y": 10.0}]\n' +
              'k = {"x": 152.0, "blocks": original, "i": 0, "remaining": 5.0, "dodged": 0, "hit": 0}\n' +
              'copy = {"x": 152.0, "i": 0, "remaining": 5.0, "dodged": 0, "hit": 0}\n' +
              'update(k, {"right"}, 0.5)\n' +
              'assert original[0]["y"] == 10.0, f"the old blocks must not move too, now: {original[0][\'y\']}"\n' +
              'assert all(k[key] == value for key, value in copy.items()), f"the state it was given must not change, now: {k}"',
          },
        ],
        hints: [
          { en: 'The player is the easy half — it is the same clamped mover as module 1.', id: 'Pemainnya bagian yang mudah — ia penggerak terjepit yang sama seperti modul 1.' },
          { en: 'Resolving the blocks is one loop over the moved list, sorting each one into hit, dodged, or still falling.', id: 'Menyelesaikan baloknya adalah satu loop atas daftar yang sudah digerakkan, memilah tiap balok jadi kena, lolos, atau masih jatuh.' },
          { en: 'Build a new list of the survivors rather than removing from the one you are looping over.', id: 'Bangun daftar baru berisi yang bertahan alih-alih membuang dari daftar yang sedang kamu telusuri.' },
          { en: 'Spawn **after** resolving, or a block can be judged in the same frame it appeared — one test checks that.', id: 'Munculkan **setelah** menyelesaikan, atau sebuah balok bisa dinilai di bingkai yang sama saat ia muncul — ada satu tes yang memeriksanya.' },
        ],
        solution:
          'SPOT_X = [30, 120, 210, 280, 70, 160]\n' +
          'SPEED = 190\n' +
          'FALL = 120\n' +
          'SPAWN_DELAY = 0.6\n' +
          'SIDE = 16\n' +
          'BLOCK = 14\n' +
          'PLAYER_Y = 210\n' +
          'WIDTH = 320\n' +
          'HEIGHT = 240\n\n' +
          'def overlaps(a, b):\n' +
          '    return (\n' +
          '        a["x"] < b["x"] + b["w"]\n' +
          '        and a["x"] + a["w"] > b["x"]\n' +
          '        and a["y"] < b["y"] + b["h"]\n' +
          '        and a["y"] + a["h"] > b["y"]\n' +
          '    )\n\n' +
          'def start():\n' +
          '    return {"x": 152.0, "blocks": [], "i": 0, "remaining": 0.0, "dodged": 0, "hit": 0}\n\n' +
          'def update(state, keys, dt):\n' +
          '    x = state["x"]\n' +
          '    if "left" in keys:\n' +
          '        x = x - SPEED * dt\n' +
          '    if "right" in keys:\n' +
          '        x = x + SPEED * dt\n' +
          '    x = max(0, min(WIDTH - SIDE, x))\n\n' +
          '    player = {"x": x, "y": PLAYER_Y, "w": SIDE, "h": SIDE}\n' +
          '    dodged = state["dodged"]\n' +
          '    hit = state["hit"]\n' +
          '    survivors = []\n\n' +
          '    for b in state["blocks"]:\n' +
          '        moved = {"x": b["x"], "y": b["y"] + FALL * dt}\n' +
          '        box = {"x": moved["x"], "y": moved["y"], "w": BLOCK, "h": BLOCK}\n' +
          '        if overlaps(box, player):\n' +
          '            hit = hit + 1\n' +
          '        elif moved["y"] > HEIGHT:\n' +
          '            dodged = dodged + 1\n' +
          '        else:\n' +
          '            survivors.append(moved)\n\n' +
          '    i = state["i"]\n' +
          '    remaining = state["remaining"] - dt\n' +
          '    if remaining <= 0:\n' +
          '        survivors = survivors + [{"x": SPOT_X[i], "y": -float(BLOCK)}]\n' +
          '        i = (i + 1) % len(SPOT_X)\n' +
          '        remaining = SPAWN_DELAY\n\n' +
          '    return {"x": x, "blocks": survivors, "i": i, "remaining": remaining, "dodged": dodged, "hit": hit}\n\n' +
          'def draw(state):\n' +
          '    result = []\n' +
          '    for b in state["blocks"]:\n' +
          '        result.append({"shape": "box", "x": b["x"], "y": b["y"], "w": BLOCK, "h": BLOCK, "color": "#ef8f70"})\n' +
          '    result.append({"shape": "box", "x": state["x"], "y": PLAYER_Y, "w": SIDE, "h": SIDE, "color": "#24463d"})\n' +
          '    result.append({"shape": "text", "x": 8, "y": 8, "text": "Dodged: " + str(state["dodged"]) + "  Hit: " + str(state["hit"]), "color": "#24463d"})\n' +
          '    return result\n',
        xp: 50,
      },
    },
  ],
}
