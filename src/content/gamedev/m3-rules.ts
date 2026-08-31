import type { Module } from '../types'

/** Module 3 — the rules around the motion: lives, mercy, time, and the phases
 *  a game moves between. */

export const module3: Module = {
  id: 'gd-m3',
  title: { en: 'The Rules of the Game', id: 'Aturan Permainan' },
  summary: {
    en: 'Lives and a moment of mercy, difficulty that grows, and a game that can start, end and start again.',
    id: 'Nyawa dan sesaat keringanan, kesulitan yang tumbuh, dan permainan yang bisa mulai, berakhir, lalu mulai lagi.',
  },
  submodules: [
    {
      id: 'gd-m3-s1',
      title: { en: 'Lives and Time', id: 'Nyawa dan Waktu' },
      summary: {
        en: 'Counters that go down, timers that count down with them, and difficulty derived from the clock.',
        id: 'Penghitung yang turun, pewaktu yang ikut menghitung mundur, dan kesulitan yang diturunkan dari jamnya.',
      },
      lessons: [
        {
          id: 'gd-m3-s1-l1',
          title: { en: 'Lives, and a moment of mercy', id: 'Nyawa, dan sesaat keringanan' },
          goal: { en: 'Take a life, then make the player briefly untouchable.', id: 'Mengambil satu nyawa, lalu membuat pemainnya sejenak tak tersentuh.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'One hit should cost one life', id: 'Satu benturan harusnya berbiaya satu nyawa' },
              body: {
                en: 'Subtract one from a counter and you have lives. The catch is that a collision is not an instant — a block overlapping the player stays overlapping for several frames, and at sixty frames a second an unguarded `lives - 1` empties three lives before the player\'s finger has left the key.',
                id: 'Kurangi satu dari sebuah penghitung dan kamu punya nyawa. Masalahnya, tabrakan bukan sekejap — balok yang bertumpang tindih dengan pemain tetap bertumpang tindih selama beberapa bingkai, dan pada enam puluh bingkai sedetik, `lives - 1` tanpa penjaga menghabiskan tiga nyawa sebelum jari pemainnya lepas dari tombol.',
              },
              code: {
                en: 'lives = max(0, lives - 1)   # never below zero',
                id: 'lives = max(0, lives - 1)   # tidak pernah di bawah nol',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Mercy is a timer', id: 'Keringanan adalah sebuah pewaktu' },
              body: {
                en: 'After a hit, make the player untouchable for a moment. It is the same countdown as the spawn timer: a number in the state, `dt` off it every frame, and a rule that only applies while it is at zero. Every game with lives has one, and you have never noticed it because it is doing its job.',
                id: 'Setelah terkena, buat pemainnya tak tersentuh sejenak. Ini hitungan mundur yang sama dengan pewaktu kemunculan: sebuah angka di keadaannya, dikurangi `dt` tiap bingkai, dan aturan yang hanya berlaku selagi ia bernilai nol. Tiap game bernyawa punya ini, dan kamu tak pernah menyadarinya karena ia bekerja dengan baik.',
              },
              code:
                'mercy = max(0.0, state["mercy"] - dt)\n\n' +
                'if hit and mercy <= 0:\n' +
                '    lives = max(0, lives - 1)\n' +
                '    mercy = 1.5',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Show it, or it looks like a bug', id: 'Tampakkan, atau ia terlihat seperti kutu' },
              body: {
                en: 'A player who is invulnerable and cannot tell will read it as the game failing to notice. Change the colour, or blink. The rule lives in `update` and the sign of it lives in `draw` — the state carries the fact, and both read it.',
                id: 'Pemain yang sedang kebal tanpa tahu akan membacanya sebagai game yang gagal menyadari. Ubah warnanya, atau buat berkedip. Aturannya tinggal di `update` dan tandanya tinggal di `draw` — keadaannya yang membawa faktanya, dan keduanya membacanya.',
              },
              code:
                'color = "#f5c65b" if state["mercy"] > 0 else "#24463d"',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Without an invulnerability timer, what does one block landing on the player cost?',
                id: 'Tanpa pewaktu kekebalan, satu balok yang mendarat di pemain berbiaya berapa?',
              },
              options: [
                { en: 'Several lives — one per frame they overlap', id: 'Beberapa nyawa — satu per bingkai selagi bertumpang tindih' },
                { en: 'Exactly one life', id: 'Tepat satu nyawa' },
                { en: 'None, until the block is removed', id: 'Tidak ada, sampai baloknya dibuang' },
                { en: 'It depends on the block size', id: 'Tergantung ukuran baloknya' },
              ],
              answer: 0,
              explain: {
                en: 'Removing the block on contact fixes it too — but the timer is what you want the moment anything can touch you twice.',
                id: 'Membuang baloknya saat bersentuhan juga memperbaikinya — tetapi pewaktunya yang kamu butuhkan begitu ada apa pun yang bisa menyentuhmu dua kali.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Count a timer down without letting it go negative.',
                id: 'Hitung mundur sebuah pewaktu tanpa membiarkannya negatif.',
              },
              template: 'mercy = ___(0.0, state["mercy"] ___ dt)',
              blanks: ['max', '-'],
              explain: {
                en: 'Subtract the elapsed time, and floor it at zero so it settles instead of running away downwards.',
                id: 'Kurangi waktu yang berlalu, dan beri lantai nol agar ia berhenti alih-alih terus lari ke bawah.',
              },
            },
            {
              kind: 'game',
              id: 'g1',
              prompt: {
                en: 'Blocks fall on a 16 by 16 player with 3 lives. A block that hits is removed; if the player is not already invulnerable it costs a life and grants 1.5 seconds of it. Lives never go below zero, and `draw` shows the invulnerable player in `#f5c65b`.',
                id: 'Balok berjatuhan pada pemain 16 kali 16 bernyawa 3. Balok yang mengenai akan dibuang; kalau pemainnya belum kebal, itu berbiaya satu nyawa dan memberi kekebalan 1,5 detik. Nyawa tak pernah di bawah nol, dan `draw` menampilkan pemain yang kebal dengan warna `#f5c65b`.',
              },
              starter:
                'SPOT_X = [30, 120, 210, 280, 70, 160]\n' +
                'SPEED = 190\n' +
                'FALL = 120\n' +
                'SPAWN_DELAY = 0.6\n' +
                'SIDE = 16\n' +
                'BLOCK = 14\n' +
                'PLAYER_Y = 210\n' +
                'MERCY = 1.5\n' +
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
                '    return {"x": 152.0, "blocks": [], "i": 0, "remaining": 0.0, "lives": 3, "mercy": 0.0}\n\n' +
                'def update(state, keys, dt):\n' +
                '    x = state["x"]\n' +
                '    if "left" in keys:\n' +
                '        x = x - SPEED * dt\n' +
                '    if "right" in keys:\n' +
                '        x = x + SPEED * dt\n' +
                '    x = max(0, min(WIDTH - SIDE, x))\n\n' +
                '    player = {"x": x, "y": PLAYER_Y, "w": SIDE, "h": SIDE}\n' +
                '    survivors = []\n' +
                '    for b in state["blocks"]:\n' +
                '        moved = {"x": b["x"], "y": b["y"] + FALL * dt}\n' +
                '        box = {"x": moved["x"], "y": moved["y"], "w": BLOCK, "h": BLOCK}\n' +
                '        if not overlaps(box, player) and moved["y"] <= HEIGHT:\n' +
                '            survivors.append(moved)\n\n' +
                '    i = state["i"]\n' +
                '    remaining = state["remaining"] - dt\n' +
                '    if remaining <= 0:\n' +
                '        survivors = survivors + [{"x": SPOT_X[i], "y": -float(BLOCK)}]\n' +
                '        i = (i + 1) % len(SPOT_X)\n' +
                '        remaining = SPAWN_DELAY\n\n' +
                '    return {"x": x, "blocks": survivors, "i": i, "remaining": remaining, "lives": state["lives"], "mercy": state["mercy"]}\n\n' +
                'def draw(state):\n' +
                '    result = []\n' +
                '    for b in state["blocks"]:\n' +
                '        result.append({"shape": "box", "x": b["x"], "y": b["y"], "w": BLOCK, "h": BLOCK, "color": "#ef8f70"})\n' +
                '    result.append({"shape": "box", "x": state["x"], "y": PLAYER_Y, "w": SIDE, "h": SIDE, "color": "#24463d"})\n' +
                '    result.append({"shape": "text", "x": 8, "y": 8, "text": "Lives: " + str(state["lives"]), "color": "#24463d"})\n' +
                '    return result\n',
              tests: [
                {
                  name: { en: 'A hit costs a life and grants mercy', id: 'Benturan berbiaya satu nyawa dan memberi keringanan' },
                  assert:
                    'k = update({"x": 152.0, "blocks": [{"x": 152, "y": 205.0}], "i": 0, "remaining": 5.0, "lives": 3, "mercy": 0.0}, set(), 1 / 60)\n' +
                    'assert k["lives"] == 2, f"must lose one life, now: {k[\'lives\']}"\n' +
                    'assert k["mercy"] > 1.0, f"mercy must switch on, now: {k[\'mercy\']}"\n' +
                    'assert len(k["blocks"]) == 0, "a block that hits must still be removed"',
                },
                {
                  name: { en: 'The timer counts down', id: 'Pewaktunya menghitung mundur' },
                  assert:
                    'k = update({"x": 0.0, "blocks": [], "i": 0, "remaining": 5.0, "lives": 3, "mercy": 1.0}, set(), 0.25)\n' +
                    'assert abs(k["mercy"] - 0.75) < 1e-9, f"must drop to 0.75, now: {k[\'mercy\']}"',
                },
                {
                  name: { en: 'It stops at zero', id: 'Ia berhenti di nol' },
                  assert:
                    'k = update({"x": 0.0, "blocks": [], "i": 0, "remaining": 5.0, "lives": 3, "mercy": 0.1}, set(), 0.5)\n' +
                    'assert k["mercy"] == 0, f"must not go negative, now: {k[\'mercy\']}"',
                },
                {
                  name: { en: 'A hit while invulnerable is free', id: 'Terkena saat kebal itu gratis' },
                  assert:
                    'k = update({"x": 152.0, "blocks": [{"x": 152, "y": 205.0}], "i": 0, "remaining": 5.0, "lives": 3, "mercy": 1.0}, set(), 1 / 60)\n' +
                    'assert k["lives"] == 3, f"while invulnerable, lives must not drop, now: {k[\'lives\']}"\n' +
                    'assert len(k["blocks"]) == 0, "the block must still be removed"\n' +
                    'assert k["mercy"] < 1.0, f"mercy must still count down, now: {k[\'mercy\']}"',
                },
                {
                  name: { en: 'One block does not empty the bar', id: 'Satu balok tidak menghabiskan seluruh nyawanya' },
                  assert:
                    'k = {"x": 152.0, "blocks": [{"x": 152, "y": 200.0}], "i": 0, "remaining": 5.0, "lives": 3, "mercy": 0.0}\n' +
                    'for _ in range(30):\n' +
                    '    k = update(k, set(), 1 / 60)\n' +
                    'assert k["lives"] == 2, f"half a second of contact must still be one life, now: {k[\'lives\']}"',
                },
                {
                  name: { en: 'Lives never go below zero', id: 'Nyawanya tak pernah di bawah nol' },
                  assert:
                    'k = update({"x": 152.0, "blocks": [{"x": 152, "y": 205.0}], "i": 0, "remaining": 5.0, "lives": 0, "mercy": 0.0}, set(), 1 / 60)\n' +
                    'assert k["lives"] == 0, f"must not go negative, now: {k[\'lives\']}"',
                },
                {
                  name: { en: 'A block that misses is still swept up', id: 'Balok yang meleset tetap disapu' },
                  assert:
                    'k = update({"x": 0.0, "blocks": [{"x": 300, "y": 239.0}], "i": 0, "remaining": 5.0, "lives": 3, "mercy": 0.0}, set(), 0.5)\n' +
                    'assert len(k["blocks"]) == 0, "the one that fell past must be removed"\n' +
                    'assert k["lives"] == 3, "and cost nothing"',
                },
                {
                  name: { en: 'Being invulnerable shows', id: 'Sedang kebal itu tampak' },
                  assert:
                    'normal = draw({"x": 152.0, "blocks": [], "i": 0, "remaining": 5.0, "lives": 3, "mercy": 0.0})\n' +
                    'invuln = draw({"x": 152.0, "blocks": [], "i": 0, "remaining": 5.0, "lives": 3, "mercy": 1.0})\n' +
                    'normal_colors = [p["color"] for p in normal if p["shape"] == "box"]\n' +
                    'invuln_colors = [p["color"] for p in invuln if p["shape"] == "box"]\n' +
                    'assert "#f5c65b" in invuln_colors, f"an invulnerable player must be drawn #f5c65b, now: {invuln_colors}"\n' +
                    'assert "#f5c65b" not in normal_colors, f"a normal player must not, now: {normal_colors}"',
                },
                {
                  name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
                  assert:
                    'k = {"x": 152.0, "blocks": [], "i": 0, "remaining": 5.0, "lives": 3, "mercy": 1.0}\n' +
                    'copy = dict(k)\n' +
                    'update(k, set(), 0.1)\n' +
                    'assert k == copy, f"update must not change the state it was given, now: {k}"',
                },
              ],
              hints: [
                { en: 'Everything except the lives is already written. Count the timer down first, before you use it.', id: 'Semuanya kecuali nyawanya sudah tertulis. Hitung mundur pewaktunya dulu, sebelum kamu memakainya.' },
                { en: 'The loop already knows which blocks hit — that is the branch where the life goes.', id: 'Loop-nya sudah tahu balok mana yang mengenai — di cabang itulah nyawanya berkurang.' },
                { en: 'Only take a life when `mercy <= 0`, and set `mercy = MERCY` at the same moment.', id: 'Hanya ambil nyawa ketika `mercy <= 0`, dan setel `mercy = MERCY` di saat yang sama.' },
                { en: 'In `draw`, pick the player colour from `state["mercy"] > 0`.', id: 'Di `draw`, pilih warna pemainnya dari `state["mercy"] > 0`.' },
              ],
              solution:
                'SPOT_X = [30, 120, 210, 280, 70, 160]\n' +
                'SPEED = 190\n' +
                'FALL = 120\n' +
                'SPAWN_DELAY = 0.6\n' +
                'SIDE = 16\n' +
                'BLOCK = 14\n' +
                'PLAYER_Y = 210\n' +
                'MERCY = 1.5\n' +
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
                '    return {"x": 152.0, "blocks": [], "i": 0, "remaining": 0.0, "lives": 3, "mercy": 0.0}\n\n' +
                'def update(state, keys, dt):\n' +
                '    x = state["x"]\n' +
                '    if "left" in keys:\n' +
                '        x = x - SPEED * dt\n' +
                '    if "right" in keys:\n' +
                '        x = x + SPEED * dt\n' +
                '    x = max(0, min(WIDTH - SIDE, x))\n\n' +
                '    lives = state["lives"]\n' +
                '    mercy = max(0.0, state["mercy"] - dt)\n\n' +
                '    player = {"x": x, "y": PLAYER_Y, "w": SIDE, "h": SIDE}\n' +
                '    survivors = []\n' +
                '    for b in state["blocks"]:\n' +
                '        moved = {"x": b["x"], "y": b["y"] + FALL * dt}\n' +
                '        box = {"x": moved["x"], "y": moved["y"], "w": BLOCK, "h": BLOCK}\n' +
                '        if overlaps(box, player):\n' +
                '            if mercy <= 0:\n' +
                '                lives = max(0, lives - 1)\n' +
                '                mercy = MERCY\n' +
                '        elif moved["y"] > HEIGHT:\n' +
                '            pass\n' +
                '        else:\n' +
                '            survivors.append(moved)\n\n' +
                '    i = state["i"]\n' +
                '    remaining = state["remaining"] - dt\n' +
                '    if remaining <= 0:\n' +
                '        survivors = survivors + [{"x": SPOT_X[i], "y": -float(BLOCK)}]\n' +
                '        i = (i + 1) % len(SPOT_X)\n' +
                '        remaining = SPAWN_DELAY\n\n' +
                '    return {"x": x, "blocks": survivors, "i": i, "remaining": remaining, "lives": lives, "mercy": mercy}\n\n' +
                'def draw(state):\n' +
                '    result = []\n' +
                '    for b in state["blocks"]:\n' +
                '        result.append({"shape": "box", "x": b["x"], "y": b["y"], "w": BLOCK, "h": BLOCK, "color": "#ef8f70"})\n' +
                '    color = "#f5c65b" if state["mercy"] > 0 else "#24463d"\n' +
                '    result.append({"shape": "box", "x": state["x"], "y": PLAYER_Y, "w": SIDE, "h": SIDE, "color": color})\n' +
                '    result.append({"shape": "text", "x": 8, "y": 8, "text": "Lives: " + str(state["lives"]), "color": "#24463d"})\n' +
                '    return result\n',
            },
          ],
        },
        {
          id: 'gd-m3-s1-l2',
          title: { en: 'Getting harder', id: 'Makin sulit' },
          goal: { en: 'Derive difficulty from elapsed time.', id: 'Menurunkan kesulitan dari waktu yang berlalu.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Elapsed time is one more accumulator', id: 'Waktu yang berlalu adalah satu akumulator lagi' },
              body: {
                en: 'Add `dt` to a number every frame and you have a clock. It is the same shape as everything else you have written — the only difference is that nothing resets it.',
                id: 'Tambahkan `dt` ke sebuah angka tiap bingkai dan kamu punya jam. Bentuknya sama dengan semua yang sudah kamu tulis — bedanya hanya tak ada yang menyetelnya ulang.',
              },
              code: 'time = state["time"] + dt',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Derive, do not store twice', id: 'Turunkan, jangan simpan dua kali' },
              body: {
                en: 'The spawn interval is a **function of** the clock, so work it out where you need it rather than keeping a second number in step with the first. Two numbers that must agree are two numbers that will eventually disagree.',
                id: 'Selang kemunculan adalah **fungsi dari** jamnya, jadi hitung ia di tempat kamu membutuhkannya alih-alih menyimpan angka kedua yang harus selalu sejalan dengan yang pertama. Dua angka yang harus sepakat adalah dua angka yang cepat atau lambat akan berselisih.',
              },
              code: {
                en:
                  'def spawn_delay(time):\n' +
                  '    return max(0.25, 0.9 - time * 0.02)\n\n' +
                  '# 0 seconds -> 0.9   10 seconds -> 0.7   40 seconds -> 0.25 (floor)',
                id:
                  'def spawn_delay(time):\n' +
                  '    return max(0.25, 0.9 - time * 0.02)\n\n' +
                  '# 0 detik -> 0.9   10 detik -> 0.7   40 detik -> 0.25 (dasar)',
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'A ramp needs a floor', id: 'Tanjakan butuh lantai' },
              body: {
                en: 'Subtract without a limit and the interval reaches zero, then goes negative, and a block appears every single frame. `max` puts a floor under it. The same shape appears everywhere in game tuning: a value that changes, and a bound that keeps it playable.',
                id: 'Kurangi tanpa batas dan selangnya mencapai nol, lalu jadi negatif, dan sebuah balok muncul di tiap bingkai. `max` memberinya lantai. Bentuk yang sama muncul di mana-mana saat menyetel game: sebuah nilai yang berubah, dan sebuah batas yang menjaganya tetap bisa dimainkan.',
              },
              code: 'return max(0.25, 0.9 - time * 0.02)',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'With `max(0.25, 0.9 - time * 0.02)`, when does the interval stop shrinking?',
                id: 'Dengan `max(0.25, 0.9 - time * 0.02)`, kapan selangnya berhenti mengecil?',
              },
              options: [
                { en: 'At 32.5 seconds', id: 'Pada 32,5 detik' },
                { en: 'At 25 seconds', id: 'Pada 25 detik' },
                { en: 'It never stops', id: 'Ia tak pernah berhenti' },
                { en: 'At 90 seconds', id: 'Pada 90 detik' },
              ],
              answer: 0,
              explain: {
                en: '0.9 minus 0.25 is 0.65, and 0.65 divided by 0.02 is 32.5.',
                id: '0,9 dikurangi 0,25 adalah 0,65, dan 0,65 dibagi 0,02 adalah 32,5.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a spawn that uses the ramp.',
                id: 'Susun kemunculan yang memakai tanjakannya.',
              },
              lines: [
                'time = state["time"] + dt',
                'remaining = state["remaining"] - dt',
                'if remaining <= 0:',
                '    blocks = blocks + [new_block]',
                '    remaining = spawn_delay(time)',
              ],
              explain: {
                en: 'The clock advances first, so the interval you set is the one for the moment you are in.',
                id: 'Jamnya maju lebih dulu, jadi selang yang kamu setel adalah selang untuk saat yang sedang kamu jalani.',
              },
            },
            {
              kind: 'game',
              id: 'g1',
              prompt: {
                en: 'Add a clock and a ramp. Write `spawn_delay(time)` returning `0.9 - time * 0.02`, never below `0.25`, and use it when a block spawns. `draw` shows the seconds as a whole number.',
                id: 'Tambahkan jam dan tanjakan. Tulis `spawn_delay(time)` yang mengembalikan `0.9 - time * 0.02`, tak pernah di bawah `0.25`, dan pakai saat balok muncul. `draw` menampilkan detiknya sebagai bilangan bulat.',
              },
              starter:
                'SPOT_X = [30, 120, 210, 280, 70, 160]\n' +
                'FALL = 120\n' +
                'BLOCK = 14\n' +
                'HEIGHT = 240\n\n' +
                'def spawn_delay(time):\n' +
                '    return 0.9\n\n' +
                'def start():\n' +
                '    return {"blocks": [], "i": 0, "remaining": 0.0, "time": 0.0}\n\n' +
                'def update(state, keys, dt):\n' +
                '    blocks = [{"x": b["x"], "y": b["y"] + FALL * dt} for b in state["blocks"]]\n' +
                '    blocks = [b for b in blocks if b["y"] <= HEIGHT]\n\n' +
                '    time = state["time"]\n' +
                '    i = state["i"]\n' +
                '    remaining = state["remaining"] - dt\n' +
                '    if remaining <= 0:\n' +
                '        blocks = blocks + [{"x": SPOT_X[i], "y": -float(BLOCK)}]\n' +
                '        i = (i + 1) % len(SPOT_X)\n' +
                '        remaining = 0.9\n\n' +
                '    return {"blocks": blocks, "i": i, "remaining": remaining, "time": time}\n\n' +
                'def draw(state):\n' +
                '    result = []\n' +
                '    for b in state["blocks"]:\n' +
                '        result.append({"shape": "box", "x": b["x"], "y": b["y"], "w": BLOCK, "h": BLOCK, "color": "#ef8f70"})\n' +
                '    result.append({"shape": "text", "x": 8, "y": 8, "text": "Time: 0", "color": "#24463d"})\n' +
                '    return result\n',
              tests: [
                {
                  name: { en: 'The ramp starts where it should', id: 'Tanjakannya mulai di tempat yang seharusnya' },
                  assert:
                    'assert abs(spawn_delay(0) - 0.9) < 1e-9, f"spawn_delay(0) must be 0.9, now: {spawn_delay(0)}"\n' +
                    'assert abs(spawn_delay(10) - 0.7) < 1e-9, f"spawn_delay(10) must be 0.7, now: {spawn_delay(10)}"\n' +
                    'assert abs(spawn_delay(20) - 0.5) < 1e-9, f"spawn_delay(20) must be 0.5, now: {spawn_delay(20)}"',
                },
                {
                  name: { en: 'And it has a floor', id: 'Dan ia punya lantai' },
                  assert:
                    'assert abs(spawn_delay(60) - 0.25) < 1e-9, f"spawn_delay(60) must lock at 0.25, now: {spawn_delay(60)}"\n' +
                    'assert abs(spawn_delay(1000) - 0.25) < 1e-9, f"spawn_delay(1000) is also 0.25, now: {spawn_delay(1000)}"\n' +
                    'assert spawn_delay(500) > 0, "the interval must not be zero or negative"',
                },
                {
                  name: { en: 'The clock runs', id: 'Jamnya berjalan' },
                  assert:
                    'k = update({"blocks": [], "i": 0, "remaining": 5.0, "time": 3.0}, set(), 0.25)\n' +
                    'assert abs(k["time"] - 3.25) < 1e-9, f"time must be 3.25, now: {k[\'time\']}"',
                },
                {
                  name: { en: 'Early on, blocks are rare', id: 'Di awal, baloknya jarang' },
                  assert:
                    'k = update({"blocks": [], "i": 0, "remaining": 0.0, "time": 0.0}, set(), 0.01)\n' +
                    'assert abs(k["remaining"] - 0.9) < 0.02, f"early in the game the timer must be set to about 0.9, now: {k[\'remaining\']}"',
                },
                {
                  name: { en: 'Later, they are not', id: 'Nanti, tidak lagi' },
                  assert:
                    'k = update({"blocks": [], "i": 0, "remaining": 0.0, "time": 20.0}, set(), 0.01)\n' +
                    'assert abs(k["remaining"] - 0.5) < 0.02, f"after 20 seconds it must be set to about 0.5, now: {k[\'remaining\']}"\n' +
                    'b = update({"blocks": [], "i": 0, "remaining": 0.0, "time": 100.0}, set(), 0.01)\n' +
                    'assert abs(b["remaining"] - 0.25) < 0.02, f"deep into the game it must be at the floor, now: {b[\'remaining\']}"',
                },
                {
                  name: { en: 'A long game really does speed up', id: 'Permainan panjang benar-benar makin cepat' },
                  assert:
                    '# a spawn resets the timer upward; counting the list length\n' +
                    '# would be wrong, since a block can be swept out the same frame.\n' +
                    'k = start()\n' +
                    'early_spawns = 0\n' +
                    'for _ in range(600):\n' +
                    '    before = k["remaining"]\n' +
                    '    k = update(k, set(), 1 / 60)\n' +
                    '    if k["remaining"] > before:\n' +
                    '        early_spawns += 1\n' +
                    'k = {**k, "time": 60.0}\n' +
                    'late_spawns = 0\n' +
                    'for _ in range(600):\n' +
                    '    before = k["remaining"]\n' +
                    '    k = update(k, set(), 1 / 60)\n' +
                    '    if k["remaining"] > before:\n' +
                    '        late_spawns += 1\n' +
                    'assert late_spawns > early_spawns, f"the last ten seconds must spawn more than the first ten, now: {early_spawns} then {late_spawns}"',
                },
                {
                  name: { en: 'The clock is on screen', id: 'Jamnya ada di layar' },
                  assert:
                    'a = draw({"blocks": [], "i": 0, "remaining": 5.0, "time": 7.4})\n' +
                    'text = [p["text"] for p in a if p["shape"] == "text"]\n' +
                    'assert any("7" in t for t in text), f"the seconds must show as 7, now: {text}"\n' +
                    'b = draw({"blocks": [], "i": 0, "remaining": 5.0, "time": 41.9})\n' +
                    'text_b = [p["text"] for p in b if p["shape"] == "text"]\n' +
                    'assert any("41" in t for t in text_b), f"41.9 seconds must show as 41, now: {text_b}"',
                },
                {
                  name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
                  assert:
                    'k = {"blocks": [], "i": 0, "remaining": 5.0, "time": 1.0}\n' +
                    'copy = dict(k)\n' +
                    'update(k, set(), 0.1)\n' +
                    'assert k == copy, f"update must not change the state it was given, now: {k}"',
                },
              ],
              hints: [
                { en: '`spawn_delay` is one line: the ramp inside a `max` with the floor.', id: '`spawn_delay` satu baris: tanjakannya di dalam `max` bersama lantainya.' },
                { en: 'Advance the clock before you use it to set the next interval.', id: 'Majukan jamnya sebelum kamu memakainya untuk menyetel selang berikutnya.' },
                { en: 'Whole seconds is `int(state["time"])`, which throws the fraction away.', id: 'Detik bulat adalah `int(state["time"])`, yang membuang pecahannya.' },
              ],
              solution:
                'SPOT_X = [30, 120, 210, 280, 70, 160]\n' +
                'FALL = 120\n' +
                'BLOCK = 14\n' +
                'HEIGHT = 240\n' +
                'SPAWN_START = 0.9\n' +
                'SPAWN_FLOOR = 0.25\n' +
                'RAMP = 0.02\n\n' +
                'def spawn_delay(time):\n' +
                '    return max(SPAWN_FLOOR, SPAWN_START - time * RAMP)\n\n' +
                'def start():\n' +
                '    return {"blocks": [], "i": 0, "remaining": 0.0, "time": 0.0}\n\n' +
                'def update(state, keys, dt):\n' +
                '    blocks = [{"x": b["x"], "y": b["y"] + FALL * dt} for b in state["blocks"]]\n' +
                '    blocks = [b for b in blocks if b["y"] <= HEIGHT]\n\n' +
                '    time = state["time"] + dt\n' +
                '    i = state["i"]\n' +
                '    remaining = state["remaining"] - dt\n' +
                '    if remaining <= 0:\n' +
                '        blocks = blocks + [{"x": SPOT_X[i], "y": -float(BLOCK)}]\n' +
                '        i = (i + 1) % len(SPOT_X)\n' +
                '        remaining = spawn_delay(time)\n\n' +
                '    return {"blocks": blocks, "i": i, "remaining": remaining, "time": time}\n\n' +
                'def draw(state):\n' +
                '    result = []\n' +
                '    for b in state["blocks"]:\n' +
                '        result.append({"shape": "box", "x": b["x"], "y": b["y"], "w": BLOCK, "h": BLOCK, "color": "#ef8f70"})\n' +
                '    result.append({"shape": "text", "x": 8, "y": 8, "text": "Time: " + str(int(state["time"])), "color": "#24463d"})\n' +
                '    return result\n',
            },
          ],
        },
      ],
      project: {
        id: 'gd-m3-s1-p1',
        runtime: 'game',
        title: { en: 'Survive', id: 'Bertahan' },
        brief: {
          en: 'Everything so far in one game: three lives, a moment of mercy, and a world that gets harder the longer you last.',
          id: 'Semua yang sudah ada dalam satu game: tiga nyawa, sesaat keringanan, dan dunia yang makin sulit selama kamu bertahan.',
        },
        requirements: [
          { en: '`start()` returns `{"x": 152.0, "blocks": [], "i": 0, "remaining": 0.0, "time": 0.0, "lives": 3, "mercy": 0.0}`.', id: '`start()` mengembalikan `{"x": 152.0, "balok": [], "i": 0, "sisa": 0.0, "waktu": 0.0, "nyawa": 3, "kebal": 0.0}`.' },
          { en: '`spawn_delay(time)` is `0.9 - time * 0.02`, never below `0.3`.', id: '`spawn_delay(time)` adalah `0.9 - time * 0.02`, tak pernah di bawah `0.3`.' },
          { en: '`speed(time)` is `110 + time * 3`, never above `260` — the blocks fall faster as well as more often.', id: '`speed(time)` adalah `110 + time * 3`, tak pernah di atas `260` — baloknya jatuh lebih cepat sekaligus lebih sering.' },
          { en: 'The clock only runs while `lives` is above zero. When it reaches zero the game is over and nothing moves any more.', id: 'Jamnya hanya berjalan selagi `lives` di atas nol. Ketika ia mencapai nol permainannya usai dan tak ada lagi yang bergerak.' },
          { en: 'The player is 16 by 16 at y 210, moving at 190. Blocks are 14 by 14 and spawn at `SPOT_X[i]`.', id: 'Pemainnya 16 kali 16 di y 210, bergerak 190. Baloknya 14 kali 14 dan muncul di `SPOT_X[i]`.' },
          { en: 'A hit removes the block; if `mercy` is not running it costs a life and starts 1.5 seconds of it.', id: 'Benturan membuang baloknya; kalau `mercy` tidak sedang berjalan, itu berbiaya satu nyawa dan memulai 1,5 detiknya.' },
          { en: '`draw` shows the seconds survived and the lives left, and shows the invulnerable player in `#f5c65b`.', id: '`draw` menampilkan detik bertahan dan nyawa tersisa, serta menampilkan pemain yang kebal dengan `#f5c65b`.' },
        ],
        starter:
          'SPOT_X = [30, 120, 210, 280, 70, 160]\n' +
          'SPEED = 190\n' +
          'SIDE = 16\n' +
          'BLOCK = 14\n' +
          'PLAYER_Y = 210\n' +
          'MERCY = 1.5\n' +
          'WIDTH = 320\n' +
          'HEIGHT = 240\n\n' +
          'def overlaps(a, b):\n' +
          '    return (\n' +
          '        a["x"] < b["x"] + b["w"]\n' +
          '        and a["x"] + a["w"] > b["x"]\n' +
          '        and a["y"] < b["y"] + b["h"]\n' +
          '        and a["y"] + a["h"] > b["y"]\n' +
          '    )\n\n' +
          'def spawn_delay(time):\n' +
          '    return 0.9\n\n' +
          'def speed(time):\n' +
          '    return 110\n\n' +
          'def start():\n' +
          '    return {"x": 152.0, "blocks": [], "i": 0, "remaining": 0.0, "time": 0.0, "lives": 3, "mercy": 0.0}\n\n' +
          'def update(state, keys, dt):\n' +
          '    return state\n\n' +
          'def draw(state):\n' +
          '    result = []\n' +
          '    for b in state["blocks"]:\n' +
          '        result.append({"shape": "box", "x": b["x"], "y": b["y"], "w": BLOCK, "h": BLOCK, "color": "#ef8f70"})\n' +
          '    result.append({"shape": "box", "x": state["x"], "y": PLAYER_Y, "w": SIDE, "h": SIDE, "color": "#24463d"})\n' +
          '    result.append({"shape": "text", "x": 8, "y": 8, "text": "Time: 0  Lives: 3", "color": "#24463d"})\n' +
          '    return result\n',
        tests: {
          en: [
            {
              name: { en: 'Both ramps have the right shape', id: 'Kedua tanjakannya berbentuk benar' },
              assert:
                'assert abs(spawn_delay(0) - 0.9) < 1e-9, f"spawn_delay(0) must be 0.9, now: {spawn_delay(0)}"\n' +
                'assert abs(spawn_delay(15) - 0.6) < 1e-9, f"spawn_delay(15) must be 0.6, now: {spawn_delay(15)}"\n' +
                'assert abs(spawn_delay(200) - 0.3) < 1e-9, f"spawn_delay must floor at 0.3, now: {spawn_delay(200)}"\n' +
                'assert abs(speed(0) - 110) < 1e-9, f"speed(0) must be 110, now: {speed(0)}"\n' +
                'assert abs(speed(20) - 170) < 1e-9, f"speed(20) must be 170, now: {speed(20)}"\n' +
                'assert abs(speed(200) - 260) < 1e-9, f"speed must cap at 260, now: {speed(200)}"',
            },
            {
              name: { en: 'The player moves and stays on the field', id: 'Pemainnya bergerak dan tetap di lapangan' },
              assert:
                'base = {"x": 100.0, "blocks": [], "i": 0, "remaining": 5.0, "time": 0.0, "lives": 3, "mercy": 0.0}\n' +
                'k = update(dict(base), {"right"}, 0.5)\n' +
                'assert abs(k["x"] - 195) < 1e-9, f"right for half a second must be 195, now: {k[\'x\']}"\n' +
                'b = update({**base, "x": 300.0}, {"right"}, 1.0)\n' +
                'assert abs(b["x"] - 304) < 1e-9, f"must clamp to 304, now: {b[\'x\']}"',
            },
            {
              name: { en: 'Blocks fall at the speed for the time', id: 'Balok jatuh pada kecepatan untuk waktunya' },
              assert:
                'k = update({"x": 0.0, "blocks": [{"x": 300, "y": 0.0}], "i": 0, "remaining": 5.0, "time": 0.0, "lives": 3, "mercy": 0.0}, set(), 0.5)\n' +
                '# the clock advances first, so the speed is speed(0.5), not speed(0)\n' +
                'assert abs(k["blocks"][0]["y"] - 55.75) < 1e-9, f"at second 0 it must fall 55.75, now: {k[\'blocks\'][0][\'y\']}"\n' +
                'b = update({"x": 0.0, "blocks": [{"x": 300, "y": 0.0}], "i": 0, "remaining": 5.0, "time": 20.0, "lives": 3, "mercy": 0.0}, set(), 0.5)\n' +
                'assert abs(b["blocks"][0]["y"] - 85.75) < 1e-9, f"at second 20 it must fall 85.75, now: {b[\'blocks\'][0][\'y\']}"',
            },
            {
              name: { en: 'A hit costs a life once', id: 'Benturan berbiaya satu nyawa, sekali' },
              assert:
                'k = {"x": 152.0, "blocks": [{"x": 152, "y": 200.0}], "i": 0, "remaining": 5.0, "time": 0.0, "lives": 3, "mercy": 0.0}\n' +
                'for _ in range(30):\n' +
                '    k = update(k, set(), 1 / 60)\n' +
                'assert k["lives"] == 2, f"half a second of contact must still be one life, now: {k[\'lives\']}"',
            },
            {
              name: { en: 'A hit while invulnerable is free', id: 'Terkena saat kebal itu gratis' },
              assert:
                'k = update({"x": 152.0, "blocks": [{"x": 152, "y": 205.0}], "i": 0, "remaining": 5.0, "time": 0.0, "lives": 3, "mercy": 1.0}, set(), 1 / 60)\n' +
                'assert k["lives"] == 3, f"while invulnerable, lives must not drop, now: {k[\'lives\']}"\n' +
                'assert len(k["blocks"]) == 0, "the block must still be removed"',
            },
            {
              name: { en: 'The clock runs while you are alive', id: 'Jamnya berjalan selagi kamu hidup' },
              assert:
                'k = update({"x": 0.0, "blocks": [], "i": 0, "remaining": 5.0, "time": 4.0, "lives": 3, "mercy": 0.0}, set(), 0.5)\n' +
                'assert abs(k["time"] - 4.5) < 1e-9, f"time must be 4.5, now: {k[\'time\']}"',
            },
            {
              name: { en: 'And stops when you are not', id: 'Dan berhenti ketika kamu tidak' },
              assert:
                'dead = {"x": 152.0, "blocks": [{"x": 30, "y": 50.0}], "i": 0, "remaining": 0.0, "time": 12.0, "lives": 0, "mercy": 0.0}\n' +
                'k = update(dict(dead), {"right"}, 0.5)\n' +
                'assert abs(k["time"] - 12.0) < 1e-9, f"the clock must stop, now: {k[\'time\']}"\n' +
                'assert abs(k["blocks"][0]["y"] - 50.0) < 1e-9, f"the blocks must stop, now: {k[\'blocks\'][0][\'y\']}"\n' +
                'assert abs(k["x"] - 152.0) < 1e-9, f"the player must stop, now: {k[\'x\']}"\n' +
                'assert len(k["blocks"]) == 1, "and nothing new must appear"',
            },
            {
              name: { en: 'It really is survivable, and really does end', id: 'Ia sungguh bisa dilalui, dan sungguh berakhir' },
              assert:
                'k = start()\n' +
                'for _ in range(600):\n' +
                '    k = update(k, set(), 1 / 60)\n' +
                'assert k["time"] > 0, "the clock must be running"\n' +
                'k = start()\n' +
                'for _ in range(6000):\n' +
                '    k = update(k, set(), 1 / 60)\n' +
                'assert k["lives"] == 0, f"standing still for 100 seconds must end the game, now lives: {k[\'lives\']}"',
            },
            {
              name: { en: 'The list never runs away', id: 'Daftarnya tak pernah lepas kendali' },
              assert:
                'k = start()\n' +
                'for _ in range(3000):\n' +
                '    k = update(k, {"right"} if (_ // 30) % 2 else {"left"}, 1 / 60)\n' +
                '    assert len(k["blocks"]) < 20, f"the list must stay small, now: {len(k[\'blocks\'])}"',
            },
            {
              name: { en: 'The score line reads right', id: 'Baris skornya terbaca benar' },
              assert:
                'a = draw({"x": 152.0, "blocks": [], "i": 0, "remaining": 5.0, "time": 12.7, "lives": 2, "mercy": 0.0})\n' +
                'text = " ".join(p["text"] for p in a if p["shape"] == "text")\n' +
                'assert "12" in text, f"the seconds must show as 12, now: {text}"\n' +
                'assert "2" in text, f"the lives must show, now: {text}"',
            },
            {
              name: { en: 'Being invulnerable shows', id: 'Sedang kebal itu tampak' },
              assert:
                'invuln = draw({"x": 152.0, "blocks": [], "i": 0, "remaining": 5.0, "time": 1.0, "lives": 2, "mercy": 1.0})\n' +
                'normal = draw({"x": 152.0, "blocks": [], "i": 0, "remaining": 5.0, "time": 1.0, "lives": 2, "mercy": 0.0})\n' +
                'assert "#f5c65b" in [p.get("color") for p in invuln], "an invulnerable player must be #f5c65b"\n' +
                'assert "#f5c65b" not in [p.get("color") for p in normal], "a normal player must not"',
            },
            {
              name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
              assert:
                'original = [{"x": 30, "y": 10.0}]\n' +
                'k = {"x": 152.0, "blocks": original, "i": 0, "remaining": 5.0, "time": 1.0, "lives": 3, "mercy": 0.0}\n' +
                'update(k, {"right"}, 0.5)\n' +
                'assert original[0]["y"] == 10.0, f"the old blocks must not move too, now: {original[0][\'y\']}"\n' +
                'assert k["x"] == 152.0 and k["time"] == 1.0, "the state it was given must not change"',
            },
          ],
          id: [
            {
              name: { en: 'Both ramps have the right shape', id: 'Kedua tanjakannya berbentuk benar' },
              assert:
                'assert abs(spawn_delay(0) - 0.9) < 1e-9, f"jeda(0) harus 0.9, sekarang: {spawn_delay(0)}"\n' +
                'assert abs(spawn_delay(15) - 0.6) < 1e-9, f"jeda(15) harus 0.6, sekarang: {spawn_delay(15)}"\n' +
                'assert abs(spawn_delay(200) - 0.3) < 1e-9, f"jeda harus berlantai 0.3, sekarang: {spawn_delay(200)}"\n' +
                'assert abs(speed(0) - 110) < 1e-9, f"laju(0) harus 110, sekarang: {speed(0)}"\n' +
                'assert abs(speed(20) - 170) < 1e-9, f"laju(20) harus 170, sekarang: {speed(20)}"\n' +
                'assert abs(speed(200) - 260) < 1e-9, f"laju harus berplafon 260, sekarang: {speed(200)}"',
            },
            {
              name: { en: 'The player moves and stays on the field', id: 'Pemainnya bergerak dan tetap di lapangan' },
              assert:
                'base = {"x": 100.0, "blocks": [], "i": 0, "remaining": 5.0, "time": 0.0, "lives": 3, "mercy": 0.0}\n' +
                'k = update(dict(base), {"right"}, 0.5)\n' +
                'assert abs(k["x"] - 195) < 1e-9, f"kanan setengah detik harus 195, sekarang: {k[\'x\']}"\n' +
                'b = update({**base, "x": 300.0}, {"right"}, 1.0)\n' +
                'assert abs(b["x"] - 304) < 1e-9, f"harus terjepit di 304, sekarang: {b[\'x\']}"',
            },
            {
              name: { en: 'Blocks fall at the speed for the time', id: 'Balok jatuh pada kecepatan untuk waktunya' },
              assert:
                'k = update({"x": 0.0, "blocks": [{"x": 300, "y": 0.0}], "i": 0, "remaining": 5.0, "time": 0.0, "lives": 3, "mercy": 0.0}, set(), 0.5)\n' +
                '# jamnya maju lebih dulu, jadi kecepatannya speed(0.5), bukan speed(0)\n' +
                'assert abs(k["blocks"][0]["y"] - 55.75) < 1e-9, f"pada detik 0 harus turun 55.75, sekarang: {k[\'blocks\'][0][\'y\']}"\n' +
                'b = update({"x": 0.0, "blocks": [{"x": 300, "y": 0.0}], "i": 0, "remaining": 5.0, "time": 20.0, "lives": 3, "mercy": 0.0}, set(), 0.5)\n' +
                'assert abs(b["blocks"][0]["y"] - 85.75) < 1e-9, f"pada detik 20 harus turun 85.75, sekarang: {b[\'blocks\'][0][\'y\']}"',
            },
            {
              name: { en: 'A hit costs a life once', id: 'Benturan berbiaya satu nyawa, sekali' },
              assert:
                'k = {"x": 152.0, "blocks": [{"x": 152, "y": 200.0}], "i": 0, "remaining": 5.0, "time": 0.0, "lives": 3, "mercy": 0.0}\n' +
                'for _ in range(30):\n' +
                '    k = update(k, set(), 1 / 60)\n' +
                'assert k["lives"] == 2, f"setengah detik menempel harus satu nyawa saja, sekarang: {k[\'lives\']}"',
            },
            {
              name: { en: 'A hit while invulnerable is free', id: 'Terkena saat kebal itu gratis' },
              assert:
                'k = update({"x": 152.0, "blocks": [{"x": 152, "y": 205.0}], "i": 0, "remaining": 5.0, "time": 0.0, "lives": 3, "mercy": 1.0}, set(), 1 / 60)\n' +
                'assert k["lives"] == 3, f"sedang kebal, tidak boleh berkurang, sekarang: {k[\'lives\']}"\n' +
                'assert len(k["blocks"]) == 0, "baloknya tetap dibuang"',
            },
            {
              name: { en: 'The clock runs while you are alive', id: 'Jamnya berjalan selagi kamu hidup' },
              assert:
                'k = update({"x": 0.0, "blocks": [], "i": 0, "remaining": 5.0, "time": 4.0, "lives": 3, "mercy": 0.0}, set(), 0.5)\n' +
                'assert abs(k["time"] - 4.5) < 1e-9, f"waktunya harus 4.5, sekarang: {k[\'time\']}"',
            },
            {
              name: { en: 'And stops when you are not', id: 'Dan berhenti ketika kamu tidak' },
              assert:
                'dead = {"x": 152.0, "blocks": [{"x": 30, "y": 50.0}], "i": 0, "remaining": 0.0, "time": 12.0, "lives": 0, "mercy": 0.0}\n' +
                'k = update(dict(dead), {"right"}, 0.5)\n' +
                'assert abs(k["time"] - 12.0) < 1e-9, f"jamnya harus berhenti, sekarang: {k[\'time\']}"\n' +
                'assert abs(k["blocks"][0]["y"] - 50.0) < 1e-9, f"baloknya harus berhenti, sekarang: {k[\'blocks\'][0][\'y\']}"\n' +
                'assert abs(k["x"] - 152.0) < 1e-9, f"pemainnya harus berhenti, sekarang: {k[\'x\']}"\n' +
                'assert len(k["blocks"]) == 1, "dan tidak ada yang baru muncul"',
            },
            {
              name: { en: 'It really is survivable, and really does end', id: 'Ia sungguh bisa dilalui, dan sungguh berakhir' },
              assert:
                'k = start()\n' +
                'for _ in range(600):\n' +
                '    k = update(k, set(), 1 / 60)\n' +
                'assert k["time"] > 0, "jamnya harus sudah berjalan"\n' +
                'k = start()\n' +
                'for _ in range(6000):\n' +
                '    k = update(k, set(), 1 / 60)\n' +
                'assert k["lives"] == 0, f"berdiri diam selama 100 detik harus berakhir, sekarang nyawa: {k[\'lives\']}"',
            },
            {
              name: { en: 'The list never runs away', id: 'Daftarnya tak pernah lepas kendali' },
              assert:
                'k = start()\n' +
                'for _ in range(3000):\n' +
                '    k = update(k, {"right"} if (_ // 30) % 2 else {"left"}, 1 / 60)\n' +
                '    assert len(k["blocks"]) < 20, f"daftarnya harus tetap kecil, sekarang: {len(k[\'blocks\'])}"',
            },
            {
              name: { en: 'The score line reads right', id: 'Baris skornya terbaca benar' },
              assert:
                'a = draw({"x": 152.0, "blocks": [], "i": 0, "remaining": 5.0, "time": 12.7, "lives": 2, "mercy": 0.0})\n' +
                'text = " ".join(p["text"] for p in a if p["shape"] == "text")\n' +
                'assert "12" in text, f"detiknya harus tampil sebagai 12, sekarang: {text}"\n' +
                'assert "2" in text, f"nyawanya harus tampil, sekarang: {text}"',
            },
            {
              name: { en: 'Being invulnerable shows', id: 'Sedang kebal itu tampak' },
              assert:
                'invuln = draw({"x": 152.0, "blocks": [], "i": 0, "remaining": 5.0, "time": 1.0, "lives": 2, "mercy": 1.0})\n' +
                'normal = draw({"x": 152.0, "blocks": [], "i": 0, "remaining": 5.0, "time": 1.0, "lives": 2, "mercy": 0.0})\n' +
                'assert "#f5c65b" in [p.get("color") for p in invuln], "pemain yang kebal harus #f5c65b"\n' +
                'assert "#f5c65b" not in [p.get("color") for p in normal], "pemain biasa tidak boleh"',
            },
            {
              name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
              assert:
                'original = [{"x": 30, "y": 10.0}]\n' +
                'k = {"x": 152.0, "blocks": original, "i": 0, "remaining": 5.0, "time": 1.0, "lives": 3, "mercy": 0.0}\n' +
                'update(k, {"right"}, 0.5)\n' +
                'assert original[0]["y"] == 10.0, f"balok lamanya tidak boleh ikut bergerak, sekarang: {original[0][\'y\']}"\n' +
                'assert k["x"] == 152.0 and k["time"] == 1.0, "keadaan yang diberikan tidak boleh berubah"',
            },
          ],
        },
        hints: [
          { en: 'The two ramps are one line each, both with a bound — one `max`, one `min`.', id: 'Kedua tanjakannya masing-masing satu baris, keduanya berbatas — satu `max`, satu `min`.' },
          { en: 'Game over is one early return: if `lives` is 0, hand back the state unchanged and do nothing else.', id: 'Permainan usai adalah satu return lebih awal: kalau `lives` bernilai 0, kembalikan keadaannya apa adanya dan jangan lakukan apa pun lagi.' },
          { en: 'Everything else is the previous two lessons stitched together — the falling speed just comes from `speed(time)` now.', id: 'Sisanya adalah dua pelajaran sebelumnya yang dijahit — kecepatan jatuhnya kini sekadar datang dari `speed(time)`.' },
          { en: 'Advance the clock before you use it, so the speed and the interval both belong to this frame.', id: 'Majukan jamnya sebelum kamu memakainya, agar kecepatan dan selangnya sama-sama milik bingkai ini.' },
        ],
        solution: {
          en:
            'SPOT_X = [30, 120, 210, 280, 70, 160]\n' +
            'SPEED = 190\n' +
            'SIDE = 16\n' +
            'BLOCK = 14\n' +
            'PLAYER_Y = 210\n' +
            'MERCY = 1.5\n' +
            'WIDTH = 320\n' +
            'HEIGHT = 240\n\n' +
            'def overlaps(a, b):\n' +
            '    return (\n' +
            '        a["x"] < b["x"] + b["w"]\n' +
            '        and a["x"] + a["w"] > b["x"]\n' +
            '        and a["y"] < b["y"] + b["h"]\n' +
            '        and a["y"] + a["h"] > b["y"]\n' +
            '    )\n\n' +
            'def spawn_delay(time):\n' +
            '    return max(0.3, 0.9 - time * 0.02)\n\n' +
            'def speed(time):\n' +
            '    return min(260, 110 + time * 3)\n\n' +
            'def start():\n' +
            '    return {"x": 152.0, "blocks": [], "i": 0, "remaining": 0.0, "time": 0.0, "lives": 3, "mercy": 0.0}\n\n' +
            'def update(state, keys, dt):\n' +
            '    if state["lives"] <= 0:\n' +
            '        return state\n\n' +
            '    time = state["time"] + dt\n\n' +
            '    x = state["x"]\n' +
            '    if "left" in keys:\n' +
            '        x = x - SPEED * dt\n' +
            '    if "right" in keys:\n' +
            '        x = x + SPEED * dt\n' +
            '    x = max(0, min(WIDTH - SIDE, x))\n\n' +
            '    lives = state["lives"]\n' +
            '    mercy = max(0.0, state["mercy"] - dt)\n' +
            '    fall_speed = speed(time)\n\n' +
            '    player = {"x": x, "y": PLAYER_Y, "w": SIDE, "h": SIDE}\n' +
            '    survivors = []\n' +
            '    for b in state["blocks"]:\n' +
            '        moved = {"x": b["x"], "y": b["y"] + fall_speed * dt}\n' +
            '        box = {"x": moved["x"], "y": moved["y"], "w": BLOCK, "h": BLOCK}\n' +
            '        if overlaps(box, player):\n' +
            '            if mercy <= 0:\n' +
            '                lives = max(0, lives - 1)\n' +
            '                mercy = MERCY\n' +
            '        elif moved["y"] <= HEIGHT:\n' +
            '            survivors.append(moved)\n\n' +
            '    i = state["i"]\n' +
            '    remaining = state["remaining"] - dt\n' +
            '    if remaining <= 0:\n' +
            '        survivors = survivors + [{"x": SPOT_X[i], "y": -float(BLOCK)}]\n' +
            '        i = (i + 1) % len(SPOT_X)\n' +
            '        remaining = spawn_delay(time)\n\n' +
            '    return {\n' +
            '        "x": x,\n' +
            '        "blocks": survivors,\n' +
            '        "i": i,\n' +
            '        "remaining": remaining,\n' +
            '        "time": time,\n' +
            '        "lives": lives,\n' +
            '        "mercy": mercy,\n' +
            '    }\n\n' +
            'def draw(state):\n' +
            '    result = []\n' +
            '    for b in state["blocks"]:\n' +
            '        result.append({"shape": "box", "x": b["x"], "y": b["y"], "w": BLOCK, "h": BLOCK, "color": "#ef8f70"})\n' +
            '    color = "#f5c65b" if state["mercy"] > 0 else "#24463d"\n' +
            '    result.append({"shape": "box", "x": state["x"], "y": PLAYER_Y, "w": SIDE, "h": SIDE, "color": color})\n' +
            '    result.append({\n' +
            '        "shape": "text",\n' +
            '        "x": 8,\n' +
            '        "y": 8,\n' +
            '        "text": "Time: " + str(int(state["time"])) + "  Lives: " + str(state["lives"]),\n' +
            '        "color": "#24463d",\n' +
            '    })\n' +
            '    return result\n',
          id:
            'SPOT_X = [30, 120, 210, 280, 70, 160]\n' +
            'SPEED = 190\n' +
            'SIDE = 16\n' +
            'BLOCK = 14\n' +
            'PLAYER_Y = 210\n' +
            'MERCY = 1.5\n' +
            'WIDTH = 320\n' +
            'HEIGHT = 240\n\n' +
            'def overlaps(a, b):\n' +
            '    return (\n' +
            '        a["x"] < b["x"] + b["w"]\n' +
            '        and a["x"] + a["w"] > b["x"]\n' +
            '        and a["y"] < b["y"] + b["h"]\n' +
            '        and a["y"] + a["h"] > b["y"]\n' +
            '    )\n\n' +
            'def spawn_delay(time):\n' +
            '    return max(0.3, 0.9 - time * 0.02)\n\n' +
            'def speed(time):\n' +
            '    return min(260, 110 + time * 3)\n\n' +
            'def start():\n' +
            '    return {"x": 152.0, "blocks": [], "i": 0, "remaining": 0.0, "time": 0.0, "lives": 3, "mercy": 0.0}\n\n' +
            'def update(state, keys, dt):\n' +
            '    if state["lives"] <= 0:\n' +
            '        return state\n\n' +
            '    time = state["time"] + dt\n\n' +
            '    x = state["x"]\n' +
            '    if "left" in keys:\n' +
            '        x = x - SPEED * dt\n' +
            '    if "right" in keys:\n' +
            '        x = x + SPEED * dt\n' +
            '    x = max(0, min(WIDTH - SIDE, x))\n\n' +
            '    lives = state["lives"]\n' +
            '    mercy = max(0.0, state["mercy"] - dt)\n' +
            '    fall_speed = speed(time)\n\n' +
            '    player = {"x": x, "y": PLAYER_Y, "w": SIDE, "h": SIDE}\n' +
            '    survivors = []\n' +
            '    for b in state["blocks"]:\n' +
            '        moved = {"x": b["x"], "y": b["y"] + fall_speed * dt}\n' +
            '        box = {"x": moved["x"], "y": moved["y"], "w": BLOCK, "h": BLOCK}\n' +
            '        if overlaps(box, player):\n' +
            '            if mercy <= 0:\n' +
            '                lives = max(0, lives - 1)\n' +
            '                mercy = MERCY\n' +
            '        elif moved["y"] <= HEIGHT:\n' +
            '            survivors.append(moved)\n\n' +
            '    i = state["i"]\n' +
            '    remaining = state["remaining"] - dt\n' +
            '    if remaining <= 0:\n' +
            '        survivors = survivors + [{"x": SPOT_X[i], "y": -float(BLOCK)}]\n' +
            '        i = (i + 1) % len(SPOT_X)\n' +
            '        remaining = spawn_delay(time)\n\n' +
            '    return {\n' +
            '        "x": x,\n' +
            '        "blocks": survivors,\n' +
            '        "i": i,\n' +
            '        "remaining": remaining,\n' +
            '        "time": time,\n' +
            '        "lives": lives,\n' +
            '        "mercy": mercy,\n' +
            '    }\n\n' +
            'def draw(state):\n' +
            '    result = []\n' +
            '    for b in state["blocks"]:\n' +
            '        result.append({"shape": "box", "x": b["x"], "y": b["y"], "w": BLOCK, "h": BLOCK, "color": "#ef8f70"})\n' +
            '    color = "#f5c65b" if state["mercy"] > 0 else "#24463d"\n' +
            '    result.append({"shape": "box", "x": state["x"], "y": PLAYER_Y, "w": SIDE, "h": SIDE, "color": color})\n' +
            '    result.append({\n' +
            '        "shape": "text",\n' +
            '        "x": 8,\n' +
            '        "y": 8,\n' +
            '        "text": "Time: " + str(int(state["time"])) + "  Lives: " + str(state["lives"]),\n' +
            '        "color": "#24463d",\n' +
            '    })\n' +
            '    return result\n',
        },
        xp: 50,
      },
    },
    {
      id: 'gd-m3-s2',
      title: { en: 'Phases', id: 'Fase' },
      summary: {
        en: 'A game that can be waiting, playing or finished — and knows the difference between a key held and a key pressed.',
        id: 'Permainan yang bisa menunggu, bermain, atau usai — dan tahu beda antara tombol ditahan dan tombol ditekan.',
      },
      lessons: [
        {
          id: 'gd-m3-s2-l1',
          title: { en: 'One key decides the rules', id: 'Satu kunci menentukan aturannya' },
          goal: { en: 'Move between phases, and detect a press rather than a hold.', id: 'Berpindah antar fase, dan mendeteksi tekanan alih-alih tahanan.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A phase is just another key in the state', id: 'Fase hanyalah satu kunci lagi di keadaannya' },
              body: {
                en: 'Games have a title screen, a game, and a game-over screen. That is one string in the state — `"ready"`, `"playing"`, `"over"` — and an `update` that starts by asking which one it is. No new machinery, and the rules for each phase stay separate instead of tangling.',
                id: 'Game punya layar judul, permainan, dan layar usai. Itu satu string di keadaannya — `"ready"`, `"playing"`, `"over"` — dan sebuah `update` yang mulai dengan menanyakan ia yang mana. Tanpa mesin baru, dan aturan tiap fasenya tetap terpisah alih-alih kusut.',
              },
              code:
                'def update(state, keys, dt):\n' +
                '    if state["phase"] == "ready":\n' +
                '        return waiting(state, keys)\n' +
                '    if state["phase"] == "over":\n' +
                '        return finished(state, keys)\n' +
                '    return playing(state, keys, dt)',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A held key is not a press', id: 'Tombol yang ditahan bukan tekanan' },
              body: {
                en: 'Here is the problem `keys` hands you: it is a snapshot, so "space is down" is true for every frame the finger rests there. Use it to start the game and the game restarts sixty times a second. What you want is the **moment** it went down: down now, and not down last frame.',
                id: 'Inilah masalah yang diberikan `keys` kepadamu: ia potret sesaat, jadi "spasi sedang ditekan" bernilai benar di tiap bingkai selama jarinya di sana. Pakai itu untuk memulai permainan dan permainannya mulai ulang enam puluh kali sedetik. Yang kamu mau adalah **saat** ia turun: turun sekarang, dan tidak turun di bingkai lalu.',
              },
              code: {
                en:
                  'down = "space" in keys\n' +
                  'pressed = down and not state["space_last"]\n\n' +
                  '# ...and save it for the next frame\n' +
                  'return {..., "space_last": down}',
                id:
                  'down = "space" in keys\n' +
                  'pressed = down and not state["space_last"]\n\n' +
                  '# ...dan simpan untuk bingkai berikutnya\n' +
                  'return {..., "space_last": down}',
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Remember it every frame, not only when it matters', id: 'Ingat tiap bingkai, bukan hanya ketika ia berarti' },
              body: {
                en: 'The previous key state has to be written on every path out of `update`, including the ones that do nothing else. Forget it in one branch and the game gets stuck: the flag says "still held" forever, and no press is ever seen again.',
                id: 'Keadaan tombol sebelumnya harus ditulis di tiap jalan keluar dari `update`, termasuk jalan yang tak melakukan apa-apa lagi. Lupakan di satu cabang dan permainannya tersangkut: penanda itu menyatakan "masih ditahan" selamanya, dan tak ada tekanan yang terlihat lagi.',
              },
              code: {
                en: '# every branch returns a fresh space_last\nreturn {"phase": "playing", ..., "space_last": down}',
                id: '# tiap cabang mengembalikan space_last yang segar\nreturn {"phase": "playing", ..., "space_last": down}',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'You start the game on `"space" in keys` with no memory. What happens when the player holds space?',
                id: 'Kamu memulai permainan pada `"space" in keys` tanpa ingatan. Apa yang terjadi ketika pemain menahan spasi?',
              },
              options: [
                { en: 'It restarts every frame, so nothing ever progresses', id: 'Ia mulai ulang tiap bingkai, jadi tak ada yang pernah maju' },
                { en: 'It starts once, correctly', id: 'Ia mulai sekali, dengan benar' },
                { en: 'It never starts', id: 'Ia tak pernah mulai' },
                { en: 'It starts after one second', id: 'Ia mulai setelah satu detik' },
              ],
              answer: 0,
              explain: {
                en: 'A snapshot cannot tell you about a change. Remembering last frame is the only way to see an edge.',
                id: 'Potret sesaat tak bisa memberitahumu tentang perubahan. Mengingat bingkai lalu adalah satu-satunya cara melihat sebuah tepi.',
              },
            },
            {
              kind: 'game',
              id: 'g1',
              prompt: {
                en: 'Three phases. In `"ready"` nothing moves and a space **press** starts a fresh game in `"playing"`. In `"playing"` the player dodges and the game ends at zero lives. In `"over"` nothing moves and a space press goes back to `"ready"`.',
                id: 'Tiga fase. Di `"ready"` tak ada yang bergerak dan **tekanan** spasi memulai permainan baru di `"playing"`. Di `"playing"` pemainnya menghindar dan permainannya berakhir saat nyawa nol. Di `"over"` tak ada yang bergerak dan tekanan spasi kembali ke `"ready"`.',
              },
              starter:
                'SPOT_X = [30, 120, 210, 280, 70, 160]\n' +
                'SPEED = 190\n' +
                'FALL = 130\n' +
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
                'def fresh(phase, space_last):\n' +
                '    return {\n' +
                '        "phase": phase,\n' +
                '        "x": 152.0,\n' +
                '        "blocks": [],\n' +
                '        "i": 0,\n' +
                '        "remaining": 0.0,\n' +
                '        "lives": 3,\n' +
                '        "space_last": space_last,\n' +
                '    }\n\n' +
                'def start():\n' +
                '    return fresh("ready", False)\n\n' +
                'def update(state, keys, dt):\n' +
                '    return state\n\n' +
                'def draw(state):\n' +
                '    result = []\n' +
                '    for b in state["blocks"]:\n' +
                '        result.append({"shape": "box", "x": b["x"], "y": b["y"], "w": BLOCK, "h": BLOCK, "color": "#ef8f70"})\n' +
                '    result.append({"shape": "box", "x": state["x"], "y": PLAYER_Y, "w": SIDE, "h": SIDE, "color": "#24463d"})\n' +
                '    if state["phase"] == "ready":\n' +
                '        result.append({"shape": "text", "x": 90, "y": 110, "text": "Space to start", "color": "#24463d"})\n' +
                '    elif state["phase"] == "over":\n' +
                '        result.append({"shape": "text", "x": 110, "y": 110, "text": "Game over!", "color": "#ef8f70"})\n' +
                '    else:\n' +
                '        result.append({"shape": "text", "x": 8, "y": 8, "text": "Lives: " + str(state["lives"]), "color": "#24463d"})\n' +
                '    return result\n',
              tests: [
                {
                  name: { en: 'It waits to be started', id: 'Ia menunggu untuk dimulai' },
                  assert:
                    'k = start()\n' +
                    'assert k["phase"] == "ready", f"must start in the ready phase, now: {k[\'phase\']}"\n' +
                    'for _ in range(120):\n' +
                    '    k = update(k, set(), 1 / 60)\n' +
                    'assert k["phase"] == "ready", "without a key it must keep waiting"\n' +
                    'assert len(k["blocks"]) == 0, "and nothing must appear"',
                },
                {
                  name: { en: 'A press starts it', id: 'Tekanan memulainya' },
                  assert:
                    'k = update(start(), {"space"}, 1 / 60)\n' +
                    'assert k["phase"] == "playing", f"must enter playing, now: {k[\'phase\']}"\n' +
                    'assert k["lives"] == 3, "and the game must be fresh"',
                },
                {
                  name: { en: 'Holding space does not restart it', id: 'Menahan spasi tidak mengulangnya' },
                  assert:
                    'k = update(start(), {"space"}, 1 / 60)\n' +
                    'for _ in range(120):\n' +
                    '    k = update(k, {"space"}, 1 / 60)\n' +
                    'assert k["phase"] == "playing", "must still be playing"\n' +
                    'assert len(k["blocks"]) > 0, "and the game must really be running, not restarting over and over"',
                },
                {
                  name: { en: 'Releasing and pressing again is a new press', id: 'Melepas lalu menekan lagi adalah tekanan baru' },
                  assert:
                    'k = {"phase": "over", "x": 152.0, "blocks": [], "i": 0, "remaining": 0.0, "lives": 0, "space_last": True}\n' +
                    'k = update(k, {"space"}, 1 / 60)\n' +
                    'assert k["phase"] == "over", "still held from before: must not move on yet"\n' +
                    'k = update(k, set(), 1 / 60)\n' +
                    'k = update(k, {"space"}, 1 / 60)\n' +
                    'assert k["phase"] == "ready", f"a new press must go back to ready, now: {k[\'phase\']}"',
                },
                {
                  name: { en: 'Playing, it plays', id: 'Saat bermain, ia bermain' },
                  assert:
                    'k = {"phase": "playing", "x": 100.0, "blocks": [{"x": 30, "y": 0.0}], "i": 0, "remaining": 5.0, "lives": 3, "space_last": False}\n' +
                    'b = update(k, {"right"}, 0.5)\n' +
                    'assert abs(b["x"] - 195) < 1e-9, f"the player must move, now: {b[\'x\']}"\n' +
                    'assert abs(b["blocks"][0]["y"] - 65) < 1e-9, f"the blocks must fall, now: {b[\'blocks\'][0][\'y\']}"',
                },
                {
                  name: { en: 'A hit costs a life', id: 'Benturan berbiaya satu nyawa' },
                  assert:
                    'k = {"phase": "playing", "x": 152.0, "blocks": [{"x": 152, "y": 205.0}], "i": 0, "remaining": 5.0, "lives": 3, "space_last": False}\n' +
                    'b = update(k, set(), 1 / 60)\n' +
                    'assert b["lives"] == 2, f"must lose one life, now: {b[\'lives\']}"\n' +
                    'assert len(b["blocks"]) == 0, "the block that hit must be removed"',
                },
                {
                  name: { en: 'The last life ends the game', id: 'Nyawa terakhir mengakhiri permainan' },
                  assert:
                    'k = {"phase": "playing", "x": 152.0, "blocks": [{"x": 152, "y": 205.0}], "i": 0, "remaining": 5.0, "lives": 1, "space_last": False}\n' +
                    'b = update(k, set(), 1 / 60)\n' +
                    'assert b["lives"] == 0, f"the lives must run out, now: {b[\'lives\']}"\n' +
                    'assert b["phase"] == "over", f"the phase must become over, now: {b[\'phase\']}"',
                },
                {
                  name: { en: 'Finished, nothing moves', id: 'Setelah usai, tak ada yang bergerak' },
                  assert:
                    'k = {"phase": "over", "x": 152.0, "blocks": [{"x": 30, "y": 50.0}], "i": 0, "remaining": 0.0, "lives": 0, "space_last": False}\n' +
                    'b = update(k, {"right"}, 0.5)\n' +
                    'assert abs(b["x"] - 152.0) < 1e-9, "the player must stay still"\n' +
                    'assert abs(b["blocks"][0]["y"] - 50.0) < 1e-9, "the blocks must stay still"\n' +
                    'assert len(b["blocks"]) == 1, "and nothing must appear"',
                },
                {
                  name: { en: 'The whole loop can be walked round', id: 'Seluruh lingkarannya bisa ditempuh' },
                  assert:
                    'k = start()\n' +
                    'k = update(k, {"space"}, 1 / 60)\n' +
                    'assert k["phase"] == "playing"\n' +
                    'for _ in range(4000):\n' +
                    '    k = update(k, set(), 1 / 60)\n' +
                    '    if k["phase"] == "over":\n' +
                    '        break\n' +
                    'assert k["phase"] == "over", "standing still must eventually end the game"\n' +
                    'k = update(k, {"space"}, 1 / 60)\n' +
                    'assert k["phase"] == "ready", "then space returns to the start screen"\n' +
                    'k = update(k, set(), 1 / 60)\n' +
                    'k = update(k, {"space"}, 1 / 60)\n' +
                    'assert k["phase"] == "playing" and k["lives"] == 3, "and it can be played again from the start"',
                },
                {
                  name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
                  assert:
                    'k = {"phase": "playing", "x": 152.0, "blocks": [], "i": 0, "remaining": 5.0, "lives": 3, "space_last": False}\n' +
                    'copy = dict(k)\n' +
                    'update(k, {"right"}, 0.1)\n' +
                    'assert k == copy, f"update must not change the state it was given, now: {k}"',
                },
              ],
              hints: [
                { en: '`fresh` already builds a whole new game for you — starting is `fresh("playing", down)`.', id: '`fresh` sudah membangun permainan baru untukmu — memulai berarti `fresh("playing", down)`.' },
                { en: 'Work out `down` and `pressed` once, at the top, before the phases split.', id: 'Hitung `down` dan `pressed` sekali, di atas, sebelum fasenya bercabang.' },
                { en: 'Every branch has to return `"space_last": down`, including the ones that change nothing else.', id: 'Tiap cabang harus mengembalikan `"space_last": down`, termasuk cabang yang tak mengubah apa pun lagi.' },
                { en: 'The playing branch is the module 2 dodge, plus one line: if the lives hit zero, the phase becomes `"over"`.', id: 'Cabang bermainnya adalah permainan hindar modul 2, ditambah satu baris: kalau nyawanya nol, fasenya jadi `"over"`.' },
              ],
              solution:
                'SPOT_X = [30, 120, 210, 280, 70, 160]\n' +
                'SPEED = 190\n' +
                'FALL = 130\n' +
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
                'def fresh(phase, space_last):\n' +
                '    return {\n' +
                '        "phase": phase,\n' +
                '        "x": 152.0,\n' +
                '        "blocks": [],\n' +
                '        "i": 0,\n' +
                '        "remaining": 0.0,\n' +
                '        "lives": 3,\n' +
                '        "space_last": space_last,\n' +
                '    }\n\n' +
                'def start():\n' +
                '    return fresh("ready", False)\n\n' +
                'def update(state, keys, dt):\n' +
                '    down = "space" in keys\n' +
                '    pressed = down and not state["space_last"]\n\n' +
                '    if state["phase"] == "ready":\n' +
                '        if pressed:\n' +
                '            return fresh("playing", down)\n' +
                '        return {**state, "space_last": down}\n\n' +
                '    if state["phase"] == "over":\n' +
                '        if pressed:\n' +
                '            return fresh("ready", down)\n' +
                '        return {**state, "space_last": down}\n\n' +
                '    x = state["x"]\n' +
                '    if "left" in keys:\n' +
                '        x = x - SPEED * dt\n' +
                '    if "right" in keys:\n' +
                '        x = x + SPEED * dt\n' +
                '    x = max(0, min(WIDTH - SIDE, x))\n\n' +
                '    lives = state["lives"]\n' +
                '    player = {"x": x, "y": PLAYER_Y, "w": SIDE, "h": SIDE}\n' +
                '    survivors = []\n' +
                '    for b in state["blocks"]:\n' +
                '        moved = {"x": b["x"], "y": b["y"] + FALL * dt}\n' +
                '        box = {"x": moved["x"], "y": moved["y"], "w": BLOCK, "h": BLOCK}\n' +
                '        if overlaps(box, player):\n' +
                '            lives = max(0, lives - 1)\n' +
                '        elif moved["y"] <= HEIGHT:\n' +
                '            survivors.append(moved)\n\n' +
                '    i = state["i"]\n' +
                '    remaining = state["remaining"] - dt\n' +
                '    if remaining <= 0:\n' +
                '        survivors = survivors + [{"x": SPOT_X[i], "y": -float(BLOCK)}]\n' +
                '        i = (i + 1) % len(SPOT_X)\n' +
                '        remaining = SPAWN_DELAY\n\n' +
                '    phase = "over" if lives <= 0 else "playing"\n\n' +
                '    return {\n' +
                '        "phase": phase,\n' +
                '        "x": x,\n' +
                '        "blocks": survivors,\n' +
                '        "i": i,\n' +
                '        "remaining": remaining,\n' +
                '        "lives": lives,\n' +
                '        "space_last": down,\n' +
                '    }\n\n' +
                'def draw(state):\n' +
                '    result = []\n' +
                '    for b in state["blocks"]:\n' +
                '        result.append({"shape": "box", "x": b["x"], "y": b["y"], "w": BLOCK, "h": BLOCK, "color": "#ef8f70"})\n' +
                '    result.append({"shape": "box", "x": state["x"], "y": PLAYER_Y, "w": SIDE, "h": SIDE, "color": "#24463d"})\n' +
                '    if state["phase"] == "ready":\n' +
                '        result.append({"shape": "text", "x": 90, "y": 110, "text": "Space to start", "color": "#24463d"})\n' +
                '    elif state["phase"] == "over":\n' +
                '        result.append({"shape": "text", "x": 110, "y": 110, "text": "Game over!", "color": "#ef8f70"})\n' +
                '    else:\n' +
                '        result.append({"shape": "text", "x": 8, "y": 8, "text": "Lives: " + str(state["lives"]), "color": "#24463d"})\n' +
                '    return result\n',
            },
          ],
        },
        {
          id: 'gd-m3-s2-l2',
          title: { en: 'Levels', id: 'Tingkat' },
          goal: { en: 'Turn a score into a level, and a level into difficulty.', id: 'Mengubah skor jadi tingkat, dan tingkat jadi kesulitan.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A level is a number you work out', id: 'Tingkat adalah angka yang kamu hitung' },
              body: {
                en: 'Levels do not need to be stored. Divide the score by how many points a level takes, throw away the remainder, and add one. It follows the score for free, it cannot disagree with it, and there is nothing to reset.',
                id: 'Tingkat tak perlu disimpan. Bagi skornya dengan berapa poin per tingkat, buang sisanya, lalu tambah satu. Ia mengikuti skornya secara cuma-cuma, ia tak bisa berselisih dengannya, dan tak ada yang perlu disetel ulang.',
              },
              code:
                'def level(score):\n' +
                '    return 1 + score // 5\n\n' +
                '# score 0..4 -> level 1, score 5..9 -> level 2',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Every difficulty knob reads the level', id: 'Tiap tuas kesulitan membaca tingkatnya' },
              body: {
                en: 'Once the level is a function, everything that should get harder is a function of it too — the fall speed, the interval, how many appear at once. Tuning the game becomes editing four small functions, not hunting for constants scattered through the update.',
                id: 'Begitu tingkatnya jadi sebuah fungsi, semua yang seharusnya makin sulit juga jadi fungsi darinya — kecepatan jatuh, selangnya, berapa yang muncul sekaligus. Menyetel game jadi menyunting empat fungsi kecil, bukan berburu konstanta yang berserak di seluruh pembaruan.',
              },
              code:
                'def speed(score):\n' +
                '    return min(300, 100 + level(score) * 25)\n\n' +
                'def spawn_delay(score):\n' +
                '    return max(0.3, 1.0 - level(score) * 0.08)',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'With `1 + score // 5`, what level is a score of 5?',
                id: 'Dengan `1 + score // 5`, skor 5 berada di tingkat berapa?',
              },
              options: [
                { en: '2', id: '2' },
                { en: '1', id: '1' },
                { en: '5', id: '5' },
                { en: '6', id: '6' },
              ],
              answer: 0,
              explain: {
                en: '5 // 5 is 1, plus one is 2. The first level covers scores 0 to 4.',
                id: '5 // 5 adalah 1, ditambah satu jadi 2. Tingkat pertama mencakup skor 0 sampai 4.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'A level every four points, starting at one.',
                id: 'Satu tingkat tiap empat poin, mulai dari satu.',
              },
              template: 'def level(score):\n    return ___ + score ___ 4',
              blanks: ['1', '//'],
              explain: {
                en: 'Floor division throws the remainder away, which is exactly what a level band is.',
                id: 'Pembagian bulat membuang sisanya, dan persis itulah yang dimaksud rentang tingkat.',
              },
            },
            {
              kind: 'game',
              id: 'g1',
              prompt: {
                en: 'Catch the falling items. Write `level(score)` as `1 + score // 5`, `speed(score)` as `100 + level * 25` capped at 300, and `spawn_delay(score)` as `1.0 - level * 0.08` floored at 0.3. Each catch is a point.',
                id: 'Tangkap benda yang jatuh. Tulis `level(score)` sebagai `1 + score // 5`, `speed(score)` sebagai `100 + level * 25` berplafon 300, dan `spawn_delay(score)` sebagai `1.0 - level * 0.08` berlantai 0,3. Tiap tangkapan bernilai satu poin.',
              },
              starter:
                'SPOT_X = [40, 160, 280, 100, 220]\n' +
                'SPEED = 200\n' +
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
                'def level(score):\n' +
                '    return 1\n\n' +
                'def speed(score):\n' +
                '    return 100\n\n' +
                'def spawn_delay(score):\n' +
                '    return 1.0\n\n' +
                'def start():\n' +
                '    return {"px": 130.0, "y": -12.0, "i": 0, "score": 0}\n\n' +
                'def update(state, keys, dt):\n' +
                '    px = state["px"]\n' +
                '    if "left" in keys:\n' +
                '        px = px - SPEED * dt\n' +
                '    if "right" in keys:\n' +
                '        px = px + SPEED * dt\n' +
                '    px = max(0, min(WIDTH - PADDLE_W, px))\n\n' +
                '    score = state["score"]\n' +
                '    y = state["y"] + 100 * dt\n' +
                '    i = state["i"]\n\n' +
                '    item = {"x": SPOT_X[i], "y": y, "w": ITEM, "h": ITEM}\n' +
                '    paddle = {"x": px, "y": PADDLE_Y, "w": PADDLE_W, "h": PADDLE_H}\n' +
                '    if overlaps(item, paddle):\n' +
                '        score = score + 1\n' +
                '        y = -12.0\n' +
                '        i = (i + 1) % len(SPOT_X)\n' +
                '    elif y > HEIGHT:\n' +
                '        y = -12.0\n' +
                '        i = (i + 1) % len(SPOT_X)\n\n' +
                '    return {"px": px, "y": y, "i": i, "score": score}\n\n' +
                'def draw(state):\n' +
                '    return [\n' +
                '        {"shape": "box", "x": SPOT_X[state["i"]], "y": state["y"], "w": ITEM, "h": ITEM, "color": "#f5c65b"},\n' +
                '        {"shape": "box", "x": state["px"], "y": PADDLE_Y, "w": PADDLE_W, "h": PADDLE_H, "color": "#24463d"},\n' +
                '        {"shape": "text", "x": 8, "y": 8, "text": "Score: " + str(state["score"]) + "  Level: 1", "color": "#24463d"},\n' +
                '    ]\n',
              tests: [
                {
                  name: { en: 'The level bands are right', id: 'Rentang tingkatnya benar' },
                  assert:
                    'assert level(0) == 1, f"score 0 must be level 1, now: {level(0)}"\n' +
                    'assert level(4) == 1, f"score 4 is still level 1, now: {level(4)}"\n' +
                    'assert level(5) == 2, f"score 5 must be level 2, now: {level(5)}"\n' +
                    'assert level(14) == 3, f"score 14 must be level 3, now: {level(14)}"\n' +
                    'assert level(15) == 4, f"score 15 must be level 4, now: {level(15)}"',
                },
                {
                  name: { en: 'The fall speed climbs, then stops', id: 'Kecepatan jatuhnya naik, lalu berhenti' },
                  assert:
                    'assert abs(speed(0) - 125) < 1e-9, f"level 1 must be 125, now: {speed(0)}"\n' +
                    'assert abs(speed(5) - 150) < 1e-9, f"level 2 must be 150, now: {speed(5)}"\n' +
                    'assert abs(speed(1000) - 300) < 1e-9, f"must cap at 300, now: {speed(1000)}"',
                },
                {
                  name: { en: 'The interval shrinks, then stops', id: 'Selangnya mengecil, lalu berhenti' },
                  assert:
                    'assert abs(spawn_delay(0) - 0.92) < 1e-9, f"level 1 must be 0.92, now: {spawn_delay(0)}"\n' +
                    'assert abs(spawn_delay(5) - 0.84) < 1e-9, f"level 2 must be 0.84, now: {spawn_delay(5)}"\n' +
                    'assert abs(spawn_delay(1000) - 0.3) < 1e-9, f"must floor at 0.3, now: {spawn_delay(1000)}"',
                },
                {
                  name: { en: 'The item falls at the level speed', id: 'Bendanya jatuh pada kecepatan tingkatnya' },
                  assert:
                    'k = update({"px": 0.0, "y": 0.0, "i": 2, "score": 0}, set(), 0.5)\n' +
                    'assert abs(k["y"] - 62.5) < 1e-9, f"level 1 for half a second must be 62.5, now: {k[\'y\']}"\n' +
                    'b = update({"px": 0.0, "y": 0.0, "i": 2, "score": 5}, set(), 0.5)\n' +
                    'assert abs(b["y"] - 75) < 1e-9, f"level 2 for half a second must be 75, now: {b[\'y\']}"',
                },
                {
                  name: { en: 'Catching still scores', id: 'Menangkap tetap menambah skor' },
                  assert:
                    'k = update({"px": 20.0, "y": 215.0, "i": 0, "score": 3}, set(), 1 / 60)\n' +
                    'assert k["score"] == 4, f"must be caught, now: {k[\'score\']}"\n' +
                    'assert k["i"] == 1, "and the next item follows"',
                },
                {
                  name: { en: 'A higher score really plays faster', id: 'Skor lebih tinggi sungguh bermain lebih cepat' },
                  assert:
                    'slow = update({"px": 0.0, "y": 100.0, "i": 2, "score": 0}, set(), 0.1)\n' +
                    'fast = update({"px": 0.0, "y": 100.0, "i": 2, "score": 40}, set(), 0.1)\n' +
                    'assert fast["y"] > slow["y"] + 1, f"score 40 must fall faster, now: {slow[\'y\']} vs {fast[\'y\']}"',
                },
                {
                  name: { en: 'The level is on screen', id: 'Tingkatnya ada di layar' },
                  assert:
                    'a = draw({"px": 130.0, "y": 0.0, "i": 0, "score": 12})\n' +
                    'text = " ".join(p["text"] for p in a if p["shape"] == "text")\n' +
                    'assert "12" in text, f"the score must show, now: {text}"\n' +
                    'assert "3" in text, f"level 3 must show, now: {text}"',
                },
                {
                  name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
                  assert:
                    'k = {"px": 130.0, "y": 0.0, "i": 0, "score": 0}\n' +
                    'copy = dict(k)\n' +
                    'update(k, {"right"}, 0.1)\n' +
                    'assert k == copy, f"update must not change the state it was given, now: {k}"',
                },
              ],
              hints: [
                { en: 'Three one-line functions, then one substitution inside `update`.', id: 'Tiga fungsi satu baris, lalu satu penggantian di dalam `update`.' },
                { en: '`speed` and `spawn_delay` both call `level` — that is the point of deriving it.', id: '`speed` dan `spawn_delay` sama-sama memanggil `level` — itulah gunanya menurunkannya.' },
                { en: 'The fall line becomes `state["y"] + speed(score) * dt`.', id: 'Baris jatuhnya jadi `state["y"] + speed(score) * dt`.' },
                { en: '`draw` can call `level(state["score"])` too — it is a function of the state like everything else.', id: '`draw` juga boleh memanggil `level(state["score"])` — ia fungsi dari keadaannya seperti yang lain.' },
              ],
              solution:
                'SPOT_X = [40, 160, 280, 100, 220]\n' +
                'SPEED = 200\n' +
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
                'def level(score):\n' +
                '    return 1 + score // 5\n\n' +
                'def speed(score):\n' +
                '    return min(300, 100 + level(score) * 25)\n\n' +
                'def spawn_delay(score):\n' +
                '    return max(0.3, 1.0 - level(score) * 0.08)\n\n' +
                'def start():\n' +
                '    return {"px": 130.0, "y": -12.0, "i": 0, "score": 0}\n\n' +
                'def update(state, keys, dt):\n' +
                '    px = state["px"]\n' +
                '    if "left" in keys:\n' +
                '        px = px - SPEED * dt\n' +
                '    if "right" in keys:\n' +
                '        px = px + SPEED * dt\n' +
                '    px = max(0, min(WIDTH - PADDLE_W, px))\n\n' +
                '    score = state["score"]\n' +
                '    y = state["y"] + speed(score) * dt\n' +
                '    i = state["i"]\n\n' +
                '    item = {"x": SPOT_X[i], "y": y, "w": ITEM, "h": ITEM}\n' +
                '    paddle = {"x": px, "y": PADDLE_Y, "w": PADDLE_W, "h": PADDLE_H}\n' +
                '    if overlaps(item, paddle):\n' +
                '        score = score + 1\n' +
                '        y = -12.0\n' +
                '        i = (i + 1) % len(SPOT_X)\n' +
                '    elif y > HEIGHT:\n' +
                '        y = -12.0\n' +
                '        i = (i + 1) % len(SPOT_X)\n\n' +
                '    return {"px": px, "y": y, "i": i, "score": score}\n\n' +
                'def draw(state):\n' +
                '    return [\n' +
                '        {"shape": "box", "x": SPOT_X[state["i"]], "y": state["y"], "w": ITEM, "h": ITEM, "color": "#f5c65b"},\n' +
                '        {"shape": "box", "x": state["px"], "y": PADDLE_Y, "w": PADDLE_W, "h": PADDLE_H, "color": "#24463d"},\n' +
                '        {\n' +
                '            "shape": "text",\n' +
                '            "x": 8,\n' +
                '            "y": 8,\n' +
                '            "text": "Score: " + str(state["score"]) + "  Level: " + str(level(state["score"])),\n' +
                '            "color": "#24463d",\n' +
                '        },\n' +
                '    ]\n',
            },
          ],
        },
      ],
      project: {
        id: 'gd-m3-s2-p1',
        runtime: 'game',
        title: { en: 'Start, Lose, Start Again', id: 'Mulai, Kalah, Mulai Lagi' },
        brief: {
          en: 'A game with a beginning and an end, and a way back to the beginning. Three phases, levels, and a best score that survives the restart.',
          id: 'Permainan dengan awal dan akhir, dan jalan kembali ke awalnya. Tiga fase, tingkat, dan rekor terbaik yang selamat dari mulai ulang.',
        },
        requirements: [
          { en: '`fresh(phase, space_last, record)` is given to you: use it to build every fresh game.', id: '`fresh(phase, space_last, record)` sudah diberikan: pakai untuk membangun tiap permainan baru.' },
          { en: 'Phases are `"ready"`, `"playing"` and `"over"`. A space **press** starts a game from `"ready"`, and from `"over"` it goes back to `"ready"`.', id: 'Fasenya `"ready"`, `"playing"`, dan `"over"`. **Tekanan** spasi memulai permainan dari `"ready"`, dan dari `"over"` ia kembali ke `"ready"`.' },
          { en: '`level(score)` is `1 + score // 4`; `speed(score)` is `110 + level * 20` capped at 280; `spawn_delay(score)` is `0.9 - level * 0.06` floored at 0.35.', id: '`level(score)` adalah `1 + score // 4`; `speed(score)` adalah `110 + level * 20` berplafon 280; `spawn_delay(score)` adalah `0.9 - level * 0.06` berlantai 0,35.' },
          { en: 'While playing: catching an item scores a point, missing one costs a life. Three lives.', id: 'Selagi bermain: menangkap benda menambah satu poin, melewatkannya berbiaya satu nyawa. Tiga nyawa.' },
          { en: 'At zero lives the phase becomes `"over"`, and `record` becomes the larger of `record` and `score`.', id: 'Saat nyawa nol, fasenya jadi `"over"`, dan `record` jadi yang lebih besar antara `record` dan `score`.' },
          { en: '`record` survives every restart; the score and the lives do not.', id: '`record` selamat dari tiap mulai ulang; skor dan nyawanya tidak.' },
        ],
        starter:
          'SPOT_X = [40, 160, 280, 100, 220]\n' +
          'SPEED = 200\n' +
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
          'def fresh(phase, space_last, record):\n' +
          '    return {\n' +
          '        "phase": phase,\n' +
          '        "px": 130.0,\n' +
          '        "y": -12.0,\n' +
          '        "i": 0,\n' +
          '        "score": 0,\n' +
          '        "lives": 3,\n' +
          '        "record": record,\n' +
          '        "space_last": space_last,\n' +
          '    }\n\n' +
          'def level(score):\n' +
          '    return 1\n\n' +
          'def speed(score):\n' +
          '    return 110\n\n' +
          'def spawn_delay(score):\n' +
          '    return 0.9\n\n' +
          'def start():\n' +
          '    return fresh("ready", False, 0)\n\n' +
          'def update(state, keys, dt):\n' +
          '    return state\n\n' +
          'def draw(state):\n' +
          '    result = [\n' +
          '        {"shape": "box", "x": SPOT_X[state["i"]], "y": state["y"], "w": ITEM, "h": ITEM, "color": "#f5c65b"},\n' +
          '        {"shape": "box", "x": state["px"], "y": PADDLE_Y, "w": PADDLE_W, "h": PADDLE_H, "color": "#24463d"},\n' +
          '    ]\n' +
          '    if state["phase"] == "ready":\n' +
          '        result.append({"shape": "text", "x": 90, "y": 110, "text": "Space to start", "color": "#24463d"})\n' +
          '    elif state["phase"] == "over":\n' +
          '        result.append({"shape": "text", "x": 84, "y": 110, "text": "Game over! Record " + str(state["record"]), "color": "#ef8f70"})\n' +
          '    else:\n' +
          '        result.append({"shape": "text", "x": 8, "y": 8, "text": "Score: " + str(state["score"]) + "  Lives: " + str(state["lives"]), "color": "#24463d"})\n' +
          '    return result\n',
        tests: {
          en: [
            {
              name: { en: 'The three tuning functions are right', id: 'Ketiga fungsi penyetelnya benar' },
              assert:
                'assert level(0) == 1 and level(3) == 1 and level(4) == 2 and level(11) == 3, "the level bands are wrong"\n' +
                'assert abs(speed(0) - 130) < 1e-9, f"level 1 must be 130, now: {speed(0)}"\n' +
                'assert abs(speed(4) - 150) < 1e-9, f"level 2 must be 150, now: {speed(4)}"\n' +
                'assert abs(speed(500) - 280) < 1e-9, f"must cap at 280, now: {speed(500)}"\n' +
                'assert abs(spawn_delay(0) - 0.84) < 1e-9, f"level 1 must be 0.84, now: {spawn_delay(0)}"\n' +
                'assert abs(spawn_delay(500) - 0.35) < 1e-9, f"must floor at 0.35, now: {spawn_delay(500)}"',
            },
            {
              name: { en: 'It waits, then a press starts it', id: 'Ia menunggu, lalu tekanan memulainya' },
              assert:
                'k = start()\n' +
                'assert k["phase"] == "ready"\n' +
                'for _ in range(60):\n' +
                '    k = update(k, set(), 1 / 60)\n' +
                'assert k["phase"] == "ready", "without a key it must keep waiting"\n' +
                'k = update(k, {"space"}, 1 / 60)\n' +
                'assert k["phase"] == "playing", f"must start, now: {k[\'phase\']}"\n' +
                'assert k["score"] == 0 and k["lives"] == 3, "and fresh"',
            },
            {
              name: { en: 'Holding space does not restart it', id: 'Menahan spasi tidak mengulangnya' },
              assert:
                'k = update(start(), {"space"}, 1 / 60)\n' +
                'for _ in range(180):\n' +
                '    k = update(k, {"space"}, 1 / 60)\n' +
                'assert k["phase"] == "playing", "must still be playing"\n' +
                'assert k["score"] + (3 - k["lives"]) > 0, "and the game must really be running"',
            },
            {
              name: { en: 'Catching scores, missing costs a life', id: 'Menangkap menambah skor, melewatkan berbiaya nyawa' },
              assert:
                'base = {"phase": "playing", "px": 20.0, "y": 215.0, "i": 0, "score": 2, "lives": 3, "record": 0, "space_last": False}\n' +
                'k = update(dict(base), set(), 1 / 60)\n' +
                'assert k["score"] == 3, f"must be caught, now: {k[\'score\']}"\n' +
                'assert k["lives"] == 3, "catching must not cost a life"\n' +
                'b = update({**base, "px": 250.0, "y": 239.0}, set(), 0.5)\n' +
                'assert b["lives"] == 2, f"missing must cost a life, now: {b[\'lives\']}"\n' +
                'assert b["score"] == 2, "and must not add to the score"',
            },
            {
              name: { en: 'The last life ends the game', id: 'Nyawa terakhir mengakhiri permainan' },
              assert:
                'k = update({"phase": "playing", "px": 250.0, "y": 239.0, "i": 0, "score": 7, "lives": 1, "record": 3, "space_last": False}, set(), 0.5)\n' +
                'assert k["lives"] == 0, f"the lives must run out, now: {k[\'lives\']}"\n' +
                'assert k["phase"] == "over", f"the phase must become over, now: {k[\'phase\']}"\n' +
                'assert k["record"] == 7, f"the record must rise to 7, now: {k[\'record\']}"',
            },
            {
              name: { en: 'A worse game does not lower the record', id: 'Permainan lebih buruk tidak menurunkan rekornya' },
              assert:
                'k = update({"phase": "playing", "px": 250.0, "y": 239.0, "i": 0, "score": 2, "lives": 1, "record": 9, "space_last": False}, set(), 0.5)\n' +
                'assert k["record"] == 9, f"the record must stay 9, now: {k[\'record\']}"',
            },
            {
              name: { en: 'Finished, nothing moves', id: 'Setelah usai, tak ada yang bergerak' },
              assert:
                'k = {"phase": "over", "px": 130.0, "y": 100.0, "i": 0, "score": 5, "lives": 0, "record": 5, "space_last": False}\n' +
                'b = update(dict(k), {"right"}, 0.5)\n' +
                'assert abs(b["px"] - 130.0) < 1e-9 and abs(b["y"] - 100.0) < 1e-9, "the paddle and item must stay still"\n' +
                'assert b["score"] == 5, "and the score must be frozen"',
            },
            {
              name: { en: 'The record survives the restart', id: 'Rekornya selamat dari mulai ulang' },
              assert:
                'k = {"phase": "over", "px": 130.0, "y": 100.0, "i": 0, "score": 5, "lives": 0, "record": 11, "space_last": False}\n' +
                'k = update(k, {"space"}, 1 / 60)\n' +
                'assert k["phase"] == "ready", f"must return to ready, now: {k[\'phase\']}"\n' +
                'assert k["record"] == 11, f"the record must survive, now: {k[\'record\']}"\n' +
                'k = update(k, set(), 1 / 60)\n' +
                'k = update(k, {"space"}, 1 / 60)\n' +
                'assert k["phase"] == "playing" and k["score"] == 0 and k["lives"] == 3, "the new game must be fresh"\n' +
                'assert k["record"] == 11, f"but the record stays, now: {k[\'record\']}"',
            },
            {
              name: { en: 'A higher score really plays faster', id: 'Skor lebih tinggi sungguh bermain lebih cepat' },
              assert:
                'base = {"phase": "playing", "px": 0.0, "y": 100.0, "i": 2, "score": 0, "lives": 3, "record": 0, "space_last": False}\n' +
                'slow = update(dict(base), set(), 0.1)\n' +
                'fast = update({**base, "score": 30}, set(), 0.1)\n' +
                'assert fast["y"] > slow["y"] + 1, f"score 30 must fall faster, now: {slow[\'y\']} vs {fast[\'y\']}"',
            },
            {
              name: { en: 'A whole game can be played end to end', id: 'Satu permainan penuh bisa dilalui ujung ke ujung' },
              assert:
                'k = update(start(), {"space"}, 1 / 60)\n' +
                'for _ in range(6000):\n' +
                '    target = SPOT_X[k["i"]] - 24\n' +
                '    held = set()\n' +
                '    if k["px"] < target - 2:\n' +
                '        held = {"right"}\n' +
                '    elif k["px"] > target + 2:\n' +
                '        held = {"left"}\n' +
                '    k = update(k, held, 1 / 60)\n' +
                '    if k["phase"] == "over":\n' +
                '        break\n' +
                'assert k["score"] > 3, f"a paddle that follows must score, now: {k[\'score\']}"',
            },
            {
              name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
              assert:
                'k = {"phase": "playing", "px": 130.0, "y": 0.0, "i": 0, "score": 0, "lives": 3, "record": 4, "space_last": False}\n' +
                'copy = dict(k)\n' +
                'update(k, {"right"}, 0.1)\n' +
                'assert k == copy, f"update must not change the state it was given, now: {k}"',
            },
          ],
          id: [
            {
              name: { en: 'The three tuning functions are right', id: 'Ketiga fungsi penyetelnya benar' },
              assert:
                'assert level(0) == 1 and level(3) == 1 and level(4) == 2 and level(11) == 3, "rentang tingkatnya salah"\n' +
                'assert abs(speed(0) - 130) < 1e-9, f"tingkat 1 harus 130, sekarang: {speed(0)}"\n' +
                'assert abs(speed(4) - 150) < 1e-9, f"tingkat 2 harus 150, sekarang: {speed(4)}"\n' +
                'assert abs(speed(500) - 280) < 1e-9, f"harus berplafon 280, sekarang: {speed(500)}"\n' +
                'assert abs(spawn_delay(0) - 0.84) < 1e-9, f"tingkat 1 harus 0.84, sekarang: {spawn_delay(0)}"\n' +
                'assert abs(spawn_delay(500) - 0.35) < 1e-9, f"harus berlantai 0.35, sekarang: {spawn_delay(500)}"',
            },
            {
              name: { en: 'It waits, then a press starts it', id: 'Ia menunggu, lalu tekanan memulainya' },
              assert:
                'k = start()\n' +
                'assert k["phase"] == "ready"\n' +
                'for _ in range(60):\n' +
                '    k = update(k, set(), 1 / 60)\n' +
                'assert k["phase"] == "ready", "tanpa tombol harus tetap menunggu"\n' +
                'k = update(k, {"space"}, 1 / 60)\n' +
                'assert k["phase"] == "playing", f"harus mulai, sekarang: {k[\'phase\']}"\n' +
                'assert k["score"] == 0 and k["lives"] == 3, "dan segar"',
            },
            {
              name: { en: 'Holding space does not restart it', id: 'Menahan spasi tidak mengulangnya' },
              assert:
                'k = update(start(), {"space"}, 1 / 60)\n' +
                'for _ in range(180):\n' +
                '    k = update(k, {"space"}, 1 / 60)\n' +
                'assert k["phase"] == "playing", "harus tetap bermain"\n' +
                'assert k["score"] + (3 - k["lives"]) > 0, "dan permainannya harus benar-benar berjalan"',
            },
            {
              name: { en: 'Catching scores, missing costs a life', id: 'Menangkap menambah skor, melewatkan berbiaya nyawa' },
              assert:
                'base = {"phase": "playing", "px": 20.0, "y": 215.0, "i": 0, "score": 2, "lives": 3, "record": 0, "space_last": False}\n' +
                'k = update(dict(base), set(), 1 / 60)\n' +
                'assert k["score"] == 3, f"harus tertangkap, sekarang: {k[\'score\']}"\n' +
                'assert k["lives"] == 3, "menangkap tidak berbiaya nyawa"\n' +
                'b = update({**base, "px": 250.0, "y": 239.0}, set(), 0.5)\n' +
                'assert b["lives"] == 2, f"terlewat harus berbiaya nyawa, sekarang: {b[\'lives\']}"\n' +
                'assert b["score"] == 2, "dan tidak menambah skor"',
            },
            {
              name: { en: 'The last life ends the game', id: 'Nyawa terakhir mengakhiri permainan' },
              assert:
                'k = update({"phase": "playing", "px": 250.0, "y": 239.0, "i": 0, "score": 7, "lives": 1, "record": 3, "space_last": False}, set(), 0.5)\n' +
                'assert k["lives"] == 0, f"nyawanya harus habis, sekarang: {k[\'lives\']}"\n' +
                'assert k["phase"] == "over", f"fasenya harus over, sekarang: {k[\'phase\']}"\n' +
                'assert k["record"] == 7, f"rekornya harus naik ke 7, sekarang: {k[\'record\']}"',
            },
            {
              name: { en: 'A worse game does not lower the record', id: 'Permainan lebih buruk tidak menurunkan rekornya' },
              assert:
                'k = update({"phase": "playing", "px": 250.0, "y": 239.0, "i": 0, "score": 2, "lives": 1, "record": 9, "space_last": False}, set(), 0.5)\n' +
                'assert k["record"] == 9, f"rekornya harus tetap 9, sekarang: {k[\'record\']}"',
            },
            {
              name: { en: 'Finished, nothing moves', id: 'Setelah usai, tak ada yang bergerak' },
              assert:
                'k = {"phase": "over", "px": 130.0, "y": 100.0, "i": 0, "score": 5, "lives": 0, "record": 5, "space_last": False}\n' +
                'b = update(dict(k), {"right"}, 0.5)\n' +
                'assert abs(b["px"] - 130.0) < 1e-9 and abs(b["y"] - 100.0) < 1e-9, "papan dan bendanya harus diam"\n' +
                'assert b["score"] == 5, "dan skornya beku"',
            },
            {
              name: { en: 'The record survives the restart', id: 'Rekornya selamat dari mulai ulang' },
              assert:
                'k = {"phase": "over", "px": 130.0, "y": 100.0, "i": 0, "score": 5, "lives": 0, "record": 11, "space_last": False}\n' +
                'k = update(k, {"space"}, 1 / 60)\n' +
                'assert k["phase"] == "ready", f"harus kembali ke ready, sekarang: {k[\'phase\']}"\n' +
                'assert k["record"] == 11, f"rekornya harus bertahan, sekarang: {k[\'record\']}"\n' +
                'k = update(k, set(), 1 / 60)\n' +
                'k = update(k, {"space"}, 1 / 60)\n' +
                'assert k["phase"] == "playing" and k["score"] == 0 and k["lives"] == 3, "permainan barunya segar"\n' +
                'assert k["record"] == 11, f"tetapi rekornya tetap, sekarang: {k[\'record\']}"',
            },
            {
              name: { en: 'A higher score really plays faster', id: 'Skor lebih tinggi sungguh bermain lebih cepat' },
              assert:
                'base = {"phase": "playing", "px": 0.0, "y": 100.0, "i": 2, "score": 0, "lives": 3, "record": 0, "space_last": False}\n' +
                'slow = update(dict(base), set(), 0.1)\n' +
                'fast = update({**base, "score": 30}, set(), 0.1)\n' +
                'assert fast["y"] > slow["y"] + 1, f"skor 30 harus jatuh lebih cepat, sekarang: {slow[\'y\']} lawan {fast[\'y\']}"',
            },
            {
              name: { en: 'A whole game can be played end to end', id: 'Satu permainan penuh bisa dilalui ujung ke ujung' },
              assert:
                'k = update(start(), {"space"}, 1 / 60)\n' +
                'for _ in range(6000):\n' +
                '    target = SPOT_X[k["i"]] - 24\n' +
                '    held = set()\n' +
                '    if k["px"] < target - 2:\n' +
                '        held = {"right"}\n' +
                '    elif k["px"] > target + 2:\n' +
                '        held = {"left"}\n' +
                '    k = update(k, held, 1 / 60)\n' +
                '    if k["phase"] == "over":\n' +
                '        break\n' +
                'assert k["score"] > 3, f"papan yang mengikuti harus mencetak skor, sekarang: {k[\'score\']}"',
            },
            {
              name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
              assert:
                'k = {"phase": "playing", "px": 130.0, "y": 0.0, "i": 0, "score": 0, "lives": 3, "record": 4, "space_last": False}\n' +
                'copy = dict(k)\n' +
                'update(k, {"right"}, 0.1)\n' +
                'assert k == copy, f"update tidak boleh mengubah keadaan yang diberikan, sekarang jadi: {k}"',
            },
          ],
        },
        hints: [
          { en: 'Work out `down` and the press at the very top, then split on the phase.', id: 'Hitung `down` dan tekanannya di paling atas, lalu bercabang pada fasenya.' },
          { en: 'The two waiting phases are two lines each: start a fresh game, or hand the state back with the new `space_last`.', id: 'Kedua fase menunggunya masing-masing dua baris: mulai permainan baru, atau kembalikan keadaannya dengan `space_last` yang baru.' },
          { en: 'Starting from `"over"` goes to `"ready"`, not straight into a game — one test walks the whole loop.', id: 'Memulai dari `"over"` menuju `"ready"`, bukan langsung ke permainan — ada satu tes yang menempuh seluruh lingkarannya.' },
          { en: 'The record is decided at the moment the last life goes: `max(record, score)`.', id: 'Rekornya ditentukan saat nyawa terakhir hilang: `max(record, score)`.' },
        ],
        solution: {
          en:
            'SPOT_X = [40, 160, 280, 100, 220]\n' +
            'SPEED = 200\n' +
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
            'def fresh(phase, space_last, record):\n' +
            '    return {\n' +
            '        "phase": phase,\n' +
            '        "px": 130.0,\n' +
            '        "y": -12.0,\n' +
            '        "i": 0,\n' +
            '        "score": 0,\n' +
            '        "lives": 3,\n' +
            '        "record": record,\n' +
            '        "space_last": space_last,\n' +
            '    }\n\n' +
            'def level(score):\n' +
            '    return 1 + score // 4\n\n' +
            'def speed(score):\n' +
            '    return min(280, 110 + level(score) * 20)\n\n' +
            'def spawn_delay(score):\n' +
            '    return max(0.35, 0.9 - level(score) * 0.06)\n\n' +
            'def start():\n' +
            '    return fresh("ready", False, 0)\n\n' +
            'def update(state, keys, dt):\n' +
            '    down = "space" in keys\n' +
            '    pressed = down and not state["space_last"]\n\n' +
            '    if state["phase"] == "ready":\n' +
            '        if pressed:\n' +
            '            return fresh("playing", down, state["record"])\n' +
            '        return {**state, "space_last": down}\n\n' +
            '    if state["phase"] == "over":\n' +
            '        if pressed:\n' +
            '            return fresh("ready", down, state["record"])\n' +
            '        return {**state, "space_last": down}\n\n' +
            '    px = state["px"]\n' +
            '    if "left" in keys:\n' +
            '        px = px - SPEED * dt\n' +
            '    if "right" in keys:\n' +
            '        px = px + SPEED * dt\n' +
            '    px = max(0, min(WIDTH - PADDLE_W, px))\n\n' +
            '    score = state["score"]\n' +
            '    lives = state["lives"]\n' +
            '    i = state["i"]\n' +
            '    y = state["y"] + speed(score) * dt\n\n' +
            '    item = {"x": SPOT_X[i], "y": y, "w": ITEM, "h": ITEM}\n' +
            '    paddle = {"x": px, "y": PADDLE_Y, "w": PADDLE_W, "h": PADDLE_H}\n' +
            '    if overlaps(item, paddle):\n' +
            '        score = score + 1\n' +
            '        y = -12.0\n' +
            '        i = (i + 1) % len(SPOT_X)\n' +
            '    elif y > HEIGHT:\n' +
            '        lives = max(0, lives - 1)\n' +
            '        y = -12.0\n' +
            '        i = (i + 1) % len(SPOT_X)\n\n' +
            '    record = state["record"]\n' +
            '    phase = "playing"\n' +
            '    if lives <= 0:\n' +
            '        phase = "over"\n' +
            '        record = max(record, score)\n\n' +
            '    return {\n' +
            '        "phase": phase,\n' +
            '        "px": px,\n' +
            '        "y": y,\n' +
            '        "i": i,\n' +
            '        "score": score,\n' +
            '        "lives": lives,\n' +
            '        "record": record,\n' +
            '        "space_last": down,\n' +
            '    }\n\n' +
            'def draw(state):\n' +
            '    result = [\n' +
            '        {"shape": "box", "x": SPOT_X[state["i"]], "y": state["y"], "w": ITEM, "h": ITEM, "color": "#f5c65b"},\n' +
            '        {"shape": "box", "x": state["px"], "y": PADDLE_Y, "w": PADDLE_W, "h": PADDLE_H, "color": "#24463d"},\n' +
            '    ]\n' +
            '    if state["phase"] == "ready":\n' +
            '        result.append({"shape": "text", "x": 90, "y": 110, "text": "Space to start", "color": "#24463d"})\n' +
            '    elif state["phase"] == "over":\n' +
            '        result.append({"shape": "text", "x": 84, "y": 110, "text": "Game over! Record " + str(state["record"]), "color": "#ef8f70"})\n' +
            '    else:\n' +
            '        result.append({\n' +
            '            "shape": "text",\n' +
            '            "x": 8,\n' +
            '            "y": 8,\n' +
            '            "text": "Score: " + str(state["score"]) + "  Lives: " + str(state["lives"]) + "  Level: " + str(level(state["score"])),\n' +
            '            "color": "#24463d",\n' +
            '        })\n' +
            '    return result\n',
          id:
            'SPOT_X = [40, 160, 280, 100, 220]\n' +
            'SPEED = 200\n' +
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
            'def fresh(phase, space_last, record):\n' +
            '    return {\n' +
            '        "phase": phase,\n' +
            '        "px": 130.0,\n' +
            '        "y": -12.0,\n' +
            '        "i": 0,\n' +
            '        "score": 0,\n' +
            '        "lives": 3,\n' +
            '        "record": record,\n' +
            '        "space_last": space_last,\n' +
            '    }\n\n' +
            'def level(score):\n' +
            '    return 1 + score // 4\n\n' +
            'def speed(score):\n' +
            '    return min(280, 110 + level(score) * 20)\n\n' +
            'def spawn_delay(score):\n' +
            '    return max(0.35, 0.9 - level(score) * 0.06)\n\n' +
            'def start():\n' +
            '    return fresh("ready", False, 0)\n\n' +
            'def update(state, keys, dt):\n' +
            '    down = "space" in keys\n' +
            '    pressed = down and not state["space_last"]\n\n' +
            '    if state["phase"] == "ready":\n' +
            '        if pressed:\n' +
            '            return fresh("playing", down, state["record"])\n' +
            '        return {**state, "space_last": down}\n\n' +
            '    if state["phase"] == "over":\n' +
            '        if pressed:\n' +
            '            return fresh("ready", down, state["record"])\n' +
            '        return {**state, "space_last": down}\n\n' +
            '    px = state["px"]\n' +
            '    if "left" in keys:\n' +
            '        px = px - SPEED * dt\n' +
            '    if "right" in keys:\n' +
            '        px = px + SPEED * dt\n' +
            '    px = max(0, min(WIDTH - PADDLE_W, px))\n\n' +
            '    score = state["score"]\n' +
            '    lives = state["lives"]\n' +
            '    i = state["i"]\n' +
            '    y = state["y"] + speed(score) * dt\n\n' +
            '    item = {"x": SPOT_X[i], "y": y, "w": ITEM, "h": ITEM}\n' +
            '    paddle = {"x": px, "y": PADDLE_Y, "w": PADDLE_W, "h": PADDLE_H}\n' +
            '    if overlaps(item, paddle):\n' +
            '        score = score + 1\n' +
            '        y = -12.0\n' +
            '        i = (i + 1) % len(SPOT_X)\n' +
            '    elif y > HEIGHT:\n' +
            '        lives = max(0, lives - 1)\n' +
            '        y = -12.0\n' +
            '        i = (i + 1) % len(SPOT_X)\n\n' +
            '    record = state["record"]\n' +
            '    phase = "playing"\n' +
            '    if lives <= 0:\n' +
            '        phase = "over"\n' +
            '        record = max(record, score)\n\n' +
            '    return {\n' +
            '        "phase": phase,\n' +
            '        "px": px,\n' +
            '        "y": y,\n' +
            '        "i": i,\n' +
            '        "score": score,\n' +
            '        "lives": lives,\n' +
            '        "record": record,\n' +
            '        "space_last": down,\n' +
            '    }\n\n' +
            'def draw(state):\n' +
            '    result = [\n' +
            '        {"shape": "box", "x": SPOT_X[state["i"]], "y": state["y"], "w": ITEM, "h": ITEM, "color": "#f5c65b"},\n' +
            '        {"shape": "box", "x": state["px"], "y": PADDLE_Y, "w": PADDLE_W, "h": PADDLE_H, "color": "#24463d"},\n' +
            '    ]\n' +
            '    if state["phase"] == "ready":\n' +
            '        result.append({"shape": "text", "x": 90, "y": 110, "text": "Space to start", "color": "#24463d"})\n' +
            '    elif state["phase"] == "over":\n' +
            '        result.append({"shape": "text", "x": 84, "y": 110, "text": "Game over! Record " + str(state["record"]), "color": "#ef8f70"})\n' +
            '    else:\n' +
            '        result.append({\n' +
            '            "shape": "text",\n' +
            '            "x": 8,\n' +
            '            "y": 8,\n' +
            '            "text": "Score: " + str(state["score"]) + "  Lives: " + str(state["lives"]) + "  Level: " + str(level(state["score"])),\n' +
            '            "color": "#24463d",\n' +
            '        })\n' +
            '    return result\n',
        },
        xp: 50,
      },
    },
  ],
}
