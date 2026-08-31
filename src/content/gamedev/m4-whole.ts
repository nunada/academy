import type { Module } from '../types'

/** Module 4 — the closing module: an update big enough to need taking apart,
 *  the small touches that make a game feel like one, and a whole game. */

export const module4: Module = {
  id: 'gd-m4',
  title: { en: 'A Whole Game', id: 'Game Utuh' },
  summary: {
    en: 'Break a long update into named pieces, add the feedback that makes a hit land, and build the whole thing.',
    id: 'Memecah pembaruan panjang jadi bagian bernama, menambahkan umpan balik yang membuat benturan terasa, dan membangun keseluruhannya.',
  },
  submodules: [
    {
      id: 'gd-m4-s1',
      title: { en: 'Putting It Together', id: 'Menyatukannya' },
      summary: {
        en: 'Helpers that each do one thing, and the difference between working and feeling right.',
        id: 'Pembantu yang masing-masing mengerjakan satu hal, dan beda antara berfungsi dan terasa benar.',
      },
      lessons: [
        {
          id: 'gd-m4-s1-l1',
          title: { en: 'Taking the update apart', id: 'Memecah pembaruannya' },
          goal: { en: 'Split one long function into three you can test.', id: 'Memecah satu fungsi panjang jadi tiga yang bisa kamu uji.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A long update is not wrong, it is just hard to check', id: 'Pembaruan panjang tidak salah, ia hanya sulit diperiksa' },
              body: {
                en: 'By now `update` does five things. It works — but to ask "does the clamping handle the right edge" you have to build a whole game state and read one number out of the answer. Split the five things into five functions and each question has a one-line answer.',
                id: 'Sampai di sini `update` mengerjakan lima hal. Ia berfungsi — tetapi untuk bertanya "apakah penjepitannya menangani tepi kanan" kamu harus membangun keadaan permainan utuh lalu membaca satu angka dari jawabannya. Pecah kelima hal itu jadi lima fungsi dan tiap pertanyaan punya jawaban satu baris.',
              },
              code: {
                en:
                  'move_player(100.0, {"right"}, 0.5)   # 195.0\n' +
                  '# ...instead of building the whole state just to look at one number',
                id:
                  'move_player(100.0, {"right"}, 0.5)   # 195.0\n' +
                  '# ...alih-alih membangun seluruh keadaan hanya untuk melihat satu angka',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Each helper takes what it needs, and no more', id: 'Tiap pembantu menerima yang ia butuhkan, tak lebih' },
              body: {
                en: 'The player mover needs an `x`, the keys and `dt` — not the whole state. Passing less makes the function easier to read, impossible to misuse, and trivial to call from a check. If a helper needs six things, that is a sign it is really two helpers.',
                id: 'Penggerak pemain butuh sebuah `x`, tombolnya, dan `dt` — bukan seluruh keadaan. Mengoper lebih sedikit membuat fungsinya lebih mudah dibaca, mustahil disalahgunakan, dan sepele dipanggil dari sebuah pemeriksaan. Kalau sebuah pembantu butuh enam hal, itu tanda ia sebenarnya dua pembantu.',
              },
              code:
                'def move_player(x, keys, dt):\n' +
                '    if "left" in keys:\n' +
                '        x = x - SPEED * dt\n' +
                '    if "right" in keys:\n' +
                '        x = x + SPEED * dt\n' +
                '    return max(0, min(WIDTH - SIDE, x))',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'A helper may answer more than one thing', id: 'Sebuah pembantu boleh menjawab lebih dari satu hal' },
              body: {
                en: 'Sorting the blocks answers two questions at once: which ones are left, and how many hit. Return both as a tuple and unpack it at the call. That is much clearer than a helper that also updates a counter it was handed — and it stays a function of its arguments, which is what makes it testable.',
                id: 'Memilah baloknya menjawab dua pertanyaan sekaligus: mana yang tersisa, dan berapa yang mengenai. Kembalikan keduanya sebagai tuple dan bongkar saat memanggilnya. Itu jauh lebih jelas daripada pembantu yang sekalian memperbarui penghitung yang dioperkan padanya — dan ia tetap fungsi dari argumennya, dan itulah yang membuatnya bisa diuji.',
              },
              code:
                'survivors, hit, dodged = resolve(blocks, player)',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why pass `x` to the mover rather than the whole state?',
                id: 'Mengapa mengoper `x` ke penggeraknya alih-alih seluruh keadaan?',
              },
              options: [
                { en: 'It cannot touch anything else, and a check can call it with one number', id: 'Ia tak bisa menyentuh apa pun yang lain, dan sebuah pemeriksaan bisa memanggilnya dengan satu angka' },
                { en: 'Dictionaries are slow', id: 'Dictionary itu lambat' },
                { en: 'Python does not allow passing dictionaries', id: 'Python tidak membolehkan mengoper dictionary' },
                { en: 'It makes no difference', id: 'Tidak ada bedanya' },
              ],
              answer: 0,
              explain: {
                en: 'A function that can only see one number can only get that one number wrong.',
                id: 'Fungsi yang hanya bisa melihat satu angka hanya bisa salah pada satu angka itu.',
              },
            },
            {
              kind: 'game',
              id: 'g1',
              prompt: {
                en: 'The game already works. Take it apart: write `move_player(x, keys, dt)` returning the new clamped x, `fall(blocks, dt)` returning a new moved list, and `resolve(blocks, player)` returning `(survivors, hit, dodged)` — then make `update` call all three.',
                id: 'Gamenya sudah berfungsi. Pecah ia: tulis `move_player(x, keys, dt)` yang mengembalikan x baru yang sudah dijepit, `fall(blocks, dt)` yang mengembalikan daftar baru yang sudah bergerak, dan `resolve(blocks, player)` yang mengembalikan `(survivors, hit, dodged)` — lalu buat `update` memanggil ketiganya.',
              },
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
                'def move_player(x, keys, dt):\n' +
                '    return x\n\n' +
                'def fall(blocks, dt):\n' +
                '    return blocks\n\n' +
                'def resolve(blocks, player):\n' +
                '    return blocks, 0, 0\n\n' +
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
                '    survivors = []\n' +
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
              tests: [
                {
                  name: { en: 'The mover moves', id: 'Penggeraknya menggerakkan' },
                  assert:
                    'assert abs(move_player(100.0, {"right"}, 0.5) - 195) < 1e-9, f"right for half a second must be 195, now: {move_player(100.0, {\'right\'}, 0.5)}"\n' +
                    'assert abs(move_player(100.0, {"left"}, 0.5) - 5) < 1e-9, f"left for half a second must be 5, now: {move_player(100.0, {\'left\'}, 0.5)}"\n' +
                    'assert abs(move_player(100.0, set(), 0.5) - 100) < 1e-9, "no keys means no movement"',
                },
                {
                  name: { en: 'The mover clamps', id: 'Penggeraknya menjepit' },
                  assert:
                    'assert abs(move_player(10.0, {"left"}, 1.0)) < 1e-9, f"must clamp to 0, now: {move_player(10.0, {\'left\'}, 1.0)}"\n' +
                    'assert abs(move_player(300.0, {"right"}, 1.0) - 304) < 1e-9, f"must clamp to 304, now: {move_player(300.0, {\'right\'}, 1.0)}"',
                },
                {
                  name: { en: 'The dropper drops, without touching the old list', id: 'Penjatuhnya menjatuhkan, tanpa menyentuh daftar lama' },
                  assert:
                    'original = [{"x": 30, "y": 0.0}, {"x": 70, "y": 100.0}]\n' +
                    'moved = fall(original, 0.5)\n' +
                    'assert len(moved) == 2, f"must stay two, now: {len(moved)}"\n' +
                    'assert abs(moved[0]["y"] - 60) < 1e-9, f"must fall 60, now: {moved[0][\'y\']}"\n' +
                    'assert abs(moved[1]["y"] - 160) < 1e-9, f"so must the second, now: {moved[1][\'y\']}"\n' +
                    'assert moved[0]["x"] == 30, "x must not change"\n' +
                    'assert original[0]["y"] == 0.0, f"the original list must not move too, now: {original[0][\'y\']}"\n' +
                    'assert fall([], 0.5) == [], "an empty list stays empty"',
                },
                {
                  name: { en: 'The sorter finds the hits', id: 'Pemilahnya menemukan yang mengenai' },
                  assert:
                    'player = {"x": 152.0, "y": 210, "w": 16, "h": 16}\n' +
                    'survivors, hit, dodged = resolve([{"x": 152, "y": 208.0}], player)\n' +
                    'assert hit == 1, f"must be one hit, now: {hit}"\n' +
                    'assert dodged == 0 and survivors == [], "and nothing left over"',
                },
                {
                  name: { en: 'And the ones that got away', id: 'Dan yang lolos' },
                  assert:
                    'player = {"x": 0.0, "y": 210, "w": 16, "h": 16}\n' +
                    'survivors, hit, dodged = resolve([{"x": 300, "y": 250.0}], player)\n' +
                    'assert dodged == 1, f"must be one dodge, now: {dodged}"\n' +
                    'assert hit == 0 and survivors == [], "and nothing left over"',
                },
                {
                  name: { en: 'And leaves the rest alone', id: 'Dan membiarkan sisanya' },
                  assert:
                    'player = {"x": 152.0, "y": 210, "w": 16, "h": 16}\n' +
                    'blocks = [{"x": 152, "y": 208.0}, {"x": 300, "y": 250.0}, {"x": 30, "y": 50.0}]\n' +
                    'survivors, hit, dodged = resolve(blocks, player)\n' +
                    'assert hit == 1 and dodged == 1, f"one and one, now: {hit} and {dodged}"\n' +
                    'assert len(survivors) == 1 and survivors[0]["x"] == 30, f"one still falling, now: {survivors}"\n' +
                    'assert resolve([], player) == ([], 0, 0), "an empty list gives all zeros"',
                },
                {
                  name: { en: 'And the game still plays', id: 'Dan gamenya tetap bisa dimainkan' },
                  assert:
                    'k = update({"x": 152.0, "blocks": [{"x": 152, "y": 205.0}], "i": 0, "remaining": 5.0, "dodged": 0, "hit": 0}, set(), 1 / 60)\n' +
                    'assert k["hit"] == 1, f"must count as a hit, now: {k[\'hit\']}"\n' +
                    'b = update({"x": 100.0, "blocks": [], "i": 0, "remaining": 5.0, "dodged": 0, "hit": 0}, {"right"}, 0.5)\n' +
                    'assert abs(b["x"] - 195) < 1e-9, f"the player must move, now: {b[\'x\']}"\n' +
                    'c = start()\n' +
                    'for _ in range(600):\n' +
                    '    c = update(c, set(), 1 / 60)\n' +
                    'assert c["hit"] + c["dodged"] > 3, "ten seconds must resolve several blocks"\n' +
                    'assert len(c["blocks"]) < 12, f"and the list must stay small, now: {len(c[\'blocks\'])}"',
                },
                {
                  name: { en: 'update really does use the helpers', id: 'perbarui benar-benar memakai pembantunya' },
                  assert:
                    'original = move_player\n' +
                    'called = []\n\n' +
                    'def spy(x, keys, dt):\n' +
                    '    called.append(True)\n' +
                    '    return original(x, keys, dt)\n\n' +
                    'globals()["move_player"] = spy\n' +
                    'try:\n' +
                    '    update({"x": 100.0, "blocks": [], "i": 0, "remaining": 5.0, "dodged": 0, "hit": 0}, {"right"}, 0.1)\n' +
                    'finally:\n' +
                    '    globals()["move_player"] = original\n' +
                    'assert called, "update must call move_player, not repeat its contents"',
                },
                {
                  name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
                  assert:
                    'original = [{"x": 30, "y": 10.0}]\n' +
                    'k = {"x": 152.0, "blocks": original, "i": 0, "remaining": 5.0, "dodged": 0, "hit": 0}\n' +
                    'update(k, {"right"}, 0.5)\n' +
                    'assert original[0]["y"] == 10.0, f"the old blocks must not move too, now: {original[0][\'y\']}"\n' +
                    'assert k["x"] == 152.0, "the state it was given must not change"',
                },
              ],
              hints: [
                { en: 'Nothing new is being written. Every line you need is already inside `update` — it is being moved, not invented.', id: 'Tak ada yang baru ditulis. Tiap baris yang kamu butuhkan sudah ada di dalam `update` — ia dipindahkan, bukan dikarang.' },
                { en: '`fall` is one comprehension, building a new dictionary per block.', id: '`fall` adalah satu comprehension, membangun dictionary baru per balok.' },
                { en: '`resolve` takes blocks that have **already** fallen, so it only sorts them — it does not move anything.', id: '`resolve` menerima balok yang **sudah** jatuh, jadi ia hanya memilah — ia tidak menggerakkan apa pun.' },
                { en: 'Return the three with commas: `return survivors, hit, dodged`.', id: 'Kembalikan ketiganya dengan koma: `return survivors, hit, dodged`.' },
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
                'def move_player(x, keys, dt):\n' +
                '    if "left" in keys:\n' +
                '        x = x - SPEED * dt\n' +
                '    if "right" in keys:\n' +
                '        x = x + SPEED * dt\n' +
                '    return max(0, min(WIDTH - SIDE, x))\n\n' +
                'def fall(blocks, dt):\n' +
                '    return [{"x": b["x"], "y": b["y"] + FALL * dt} for b in blocks]\n\n' +
                'def resolve(blocks, player):\n' +
                '    survivors = []\n' +
                '    hit = 0\n' +
                '    dodged = 0\n' +
                '    for b in blocks:\n' +
                '        box = {"x": b["x"], "y": b["y"], "w": BLOCK, "h": BLOCK}\n' +
                '        if overlaps(box, player):\n' +
                '            hit = hit + 1\n' +
                '        elif b["y"] > HEIGHT:\n' +
                '            dodged = dodged + 1\n' +
                '        else:\n' +
                '            survivors.append(b)\n' +
                '    return survivors, hit, dodged\n\n' +
                'def start():\n' +
                '    return {"x": 152.0, "blocks": [], "i": 0, "remaining": 0.0, "dodged": 0, "hit": 0}\n\n' +
                'def update(state, keys, dt):\n' +
                '    x = move_player(state["x"], keys, dt)\n' +
                '    player = {"x": x, "y": PLAYER_Y, "w": SIDE, "h": SIDE}\n\n' +
                '    survivors, hit, dodged = resolve(fall(state["blocks"], dt), player)\n\n' +
                '    i = state["i"]\n' +
                '    remaining = state["remaining"] - dt\n' +
                '    if remaining <= 0:\n' +
                '        survivors = survivors + [{"x": SPOT_X[i], "y": -float(BLOCK)}]\n' +
                '        i = (i + 1) % len(SPOT_X)\n' +
                '        remaining = SPAWN_DELAY\n\n' +
                '    return {\n' +
                '        "x": x,\n' +
                '        "blocks": survivors,\n' +
                '        "i": i,\n' +
                '        "remaining": remaining,\n' +
                '        "dodged": state["dodged"] + dodged,\n' +
                '        "hit": state["hit"] + hit,\n' +
                '    }\n\n' +
                'def draw(state):\n' +
                '    result = []\n' +
                '    for b in state["blocks"]:\n' +
                '        result.append({"shape": "box", "x": b["x"], "y": b["y"], "w": BLOCK, "h": BLOCK, "color": "#ef8f70"})\n' +
                '    result.append({"shape": "box", "x": state["x"], "y": PLAYER_Y, "w": SIDE, "h": SIDE, "color": "#24463d"})\n' +
                '    result.append({"shape": "text", "x": 8, "y": 8, "text": "Dodged: " + str(state["dodged"]) + "  Hit: " + str(state["hit"]), "color": "#24463d"})\n' +
                '    return result\n',
            },
          ],
        },
        {
          id: 'gd-m4-s1-l2',
          title: { en: 'Making a hit land', id: 'Membuat benturan terasa' },
          goal: { en: 'Add feedback the player can feel.', id: 'Menambahkan umpan balik yang bisa dirasakan pemain.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A correct game can still feel broken', id: 'Game yang benar masih bisa terasa rusak' },
              body: {
                en: 'Take a life away and change nothing on screen and the player will swear it did not happen. The rule was right; the game never said so. Feedback is not decoration — it is how a player learns what the rules are, and it costs a few lines.',
                id: 'Ambil satu nyawa tanpa mengubah apa pun di layar dan pemainnya akan bersumpah itu tidak terjadi. Aturannya benar; gamenya tak pernah mengatakannya. Umpan balik bukan hiasan — ia cara pemain mempelajari aturannya, dan biayanya beberapa baris.',
              },
              code: {
                en: '# the rule is correct, and invisible\nlives = max(0, lives - 1)',
                id: '# aturannya benar, dan tak terlihat\nlives = max(0, lives - 1)',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Blinking is a timer read differently', id: 'Berkedip adalah pewaktu yang dibaca berbeda' },
              body: {
                en: 'You already have the invulnerability timer. Read its value as a stripe rather than a number — multiply, take the whole part, and ask whether it is odd — and it blinks. No new state, and the blink stops exactly when the mercy does.',
                id: 'Kamu sudah punya pewaktu kekebalannya. Baca nilainya sebagai garis alih-alih angka — kalikan, ambil bagian bulatnya, lalu tanyakan apakah ganjil — dan ia berkedip. Tanpa state baru, dan kedipnya berhenti persis ketika keringanannya berhenti.',
              },
              code: {
                en:
                  'def blink(mercy):\n' +
                  '    return mercy > 0 and int(mercy * 10) % 2 == 1\n\n' +
                  '# 1.15 -> int(11.5) = 11 -> odd -> blinks\n' +
                  '# 1.00 -> int(10.0) = 10 -> even -> does not',
                id:
                  'def blink(mercy):\n' +
                  '    return mercy > 0 and int(mercy * 10) % 2 == 1\n\n' +
                  '# 1.15 -> int(11.5) = 11 -> ganjil -> berkedip\n' +
                  '# 1.00 -> int(10.0) = 10 -> genap -> tidak',
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'A shake is an offset, not a moved world', id: 'Guncangan adalah pergeseran, bukan dunia yang berpindah' },
              body: {
                en: 'Do not move anything in `update` to shake the screen — the positions are the truth of the game and must not lie. Keep a timer, work out an offset from it in `draw`, and add that to every coordinate as you draw. The world stays where it is; only the picture wobbles.',
                id: 'Jangan menggerakkan apa pun di `update` untuk mengguncang layar — posisinya adalah kebenaran permainannya dan tak boleh berdusta. Simpan sebuah pewaktu, hitung pergeseran darinya di `draw`, dan tambahkan itu ke tiap koordinat saat menggambar. Dunianya tetap di tempatnya; hanya gambarnya yang bergoyang.',
              },
              code:
                'def shake_offset(shake):\n' +
                '    if shake <= 0:\n' +
                '        return 0\n' +
                '    return 4 if int(shake * 60) % 2 == 0 else -4',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why work the shake out in `draw` rather than moving things in `update`?',
                id: 'Mengapa menghitung guncangannya di `draw` alih-alih menggerakkan benda di `update`?',
              },
              options: [
                { en: 'The positions are the game — shaking them would change what collides', id: 'Posisinya adalah permainannya — mengguncangnya akan mengubah apa yang bertabrakan' },
                { en: '`update` cannot do arithmetic', id: '`update` tidak bisa berhitung' },
                { en: 'It is faster', id: 'Itu lebih cepat' },
                { en: 'There is no difference', id: 'Tidak ada bedanya' },
              ],
              answer: 0,
              explain: {
                en: 'Anything that is only for the player to see belongs where the seeing happens.',
                id: 'Apa pun yang hanya untuk dilihat pemain, tempatnya di tempat melihat itu terjadi.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a draw that shakes the whole picture.',
                id: 'Susun penggambaran yang mengguncang seluruh gambarnya.',
              },
              lines: [
                'def draw(state):',
                '    offset = shake_offset(state["shake"])',
                '    result = []',
                '    for b in state["blocks"]:',
                '        result.append({"shape": "box", "x": b["x"] + offset, "y": b["y"], "w": BLOCK, "h": BLOCK, "color": "#ef8f70"})',
                '    return result',
              ],
              explain: {
                en: 'Work the offset out once, then add it as you build each command.',
                id: 'Hitung pergeserannya sekali, lalu tambahkan saat kamu membangun tiap perintahnya.',
              },
            },
            {
              kind: 'game',
              id: 'g1',
              prompt: {
                en: 'Add the feel. Write `blink(mercy)` and `shake_offset(shake)`, start a 0.3 second shake on every hit, count it down like the mercy timer, and make `draw` shift everything by the offset and skip drawing the player while it is blinking.',
                id: 'Tambahkan rasanya. Tulis `blink(mercy)` dan `shake_offset(shake)`, mulai guncangan 0,3 detik tiap benturan, hitung mundur seperti pewaktu keringanannya, dan buat `draw` menggeser semuanya sebesar pergeserannya serta melewatkan penggambaran pemain selagi ia berkedip.',
              },
              starter:
                'SPOT_X = [30, 120, 210, 280, 70, 160]\n' +
                'SPEED = 190\n' +
                'FALL = 130\n' +
                'SPAWN_DELAY = 0.6\n' +
                'SIDE = 16\n' +
                'BLOCK = 14\n' +
                'PLAYER_Y = 210\n' +
                'MERCY = 1.5\n' +
                'SHAKE = 0.3\n' +
                'WIDTH = 320\n' +
                'HEIGHT = 240\n\n' +
                'def overlaps(a, b):\n' +
                '    return (\n' +
                '        a["x"] < b["x"] + b["w"]\n' +
                '        and a["x"] + a["w"] > b["x"]\n' +
                '        and a["y"] < b["y"] + b["h"]\n' +
                '        and a["y"] + a["h"] > b["y"]\n' +
                '    )\n\n' +
                'def blink(mercy):\n' +
                '    return False\n\n' +
                'def shake_offset(shake):\n' +
                '    return 0\n\n' +
                'def start():\n' +
                '    return {"x": 152.0, "blocks": [], "i": 0, "remaining": 0.0, "lives": 3, "mercy": 0.0, "shake": 0.0}\n\n' +
                'def update(state, keys, dt):\n' +
                '    x = state["x"]\n' +
                '    if "left" in keys:\n' +
                '        x = x - SPEED * dt\n' +
                '    if "right" in keys:\n' +
                '        x = x + SPEED * dt\n' +
                '    x = max(0, min(WIDTH - SIDE, x))\n\n' +
                '    lives = state["lives"]\n' +
                '    mercy = max(0.0, state["mercy"] - dt)\n' +
                '    shake = state["shake"]\n\n' +
                '    player = {"x": x, "y": PLAYER_Y, "w": SIDE, "h": SIDE}\n' +
                '    survivors = []\n' +
                '    for b in state["blocks"]:\n' +
                '        moved = {"x": b["x"], "y": b["y"] + FALL * dt}\n' +
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
                '        remaining = SPAWN_DELAY\n\n' +
                '    return {"x": x, "blocks": survivors, "i": i, "remaining": remaining, "lives": lives, "mercy": mercy, "shake": shake}\n\n' +
                'def draw(state):\n' +
                '    result = []\n' +
                '    for b in state["blocks"]:\n' +
                '        result.append({"shape": "box", "x": b["x"], "y": b["y"], "w": BLOCK, "h": BLOCK, "color": "#ef8f70"})\n' +
                '    result.append({"shape": "box", "x": state["x"], "y": PLAYER_Y, "w": SIDE, "h": SIDE, "color": "#24463d"})\n' +
                '    result.append({"shape": "text", "x": 8, "y": 8, "text": "Lives: " + str(state["lives"]), "color": "#24463d"})\n' +
                '    return result\n',
              tests: [
                {
                  name: { en: 'The blink is off when the mercy is', id: 'Kedipnya mati ketika keringanannya mati' },
                  assert:
                    'assert blink(0.0) is False or not blink(0.0), "without mercy it must not blink"\n' +
                    'assert not blink(-1.0), "a negative value must not either"',
                },
                {
                  name: { en: 'And it alternates while it runs', id: 'Dan ia berganti-ganti selagi berjalan' },
                  assert:
                    'assert blink(1.15), f"1.15 must blink, now: {blink(1.15)}"\n' +
                    'assert not blink(1.05), f"1.05 must not, now: {blink(1.05)}"\n' +
                    'assert blink(0.35), f"0.35 must blink, now: {blink(0.35)}"\n' +
                    'on = sum(1 for n in range(1, 15) if blink(n / 10 + 0.05))\n' +
                    'assert 5 <= on <= 9, f"it must alternate roughly half the time, now: {on} of 14"',
                },
                {
                  name: { en: 'A still screen does not shake', id: 'Layar yang tenang tidak berguncang' },
                  assert:
                    'assert shake_offset(0.0) == 0, f"without a shake it must be zero, now: {shake_offset(0.0)}"\n' +
                    'assert shake_offset(-1.0) == 0, "a negative value must also be zero"',
                },
                {
                  name: { en: 'And a shaken one moves both ways', id: 'Dan yang terguncang bergerak ke dua arah' },
                  assert:
                    'values = set(shake_offset(n / 60 + 0.001) for n in range(1, 20))\n' +
                    'assert 4 in values and -4 in values, f"must move both ways, now: {sorted(values)}"\n' +
                    'assert all(abs(v) == 4 for v in values), f"the size must always be 4, now: {sorted(values)}"',
                },
                {
                  name: { en: 'A hit starts the shake', id: 'Benturan memulai guncangannya' },
                  assert:
                    'k = update({"x": 152.0, "blocks": [{"x": 152, "y": 205.0}], "i": 0, "remaining": 5.0, "lives": 3, "mercy": 0.0, "shake": 0.0}, set(), 1 / 60)\n' +
                    'assert k["shake"] > 0.2, f"the shake must switch on, now: {k[\'shake\']}"\n' +
                    'assert k["lives"] == 2, "and the lives must still drop"',
                },
                {
                  name: { en: 'And it settles down', id: 'Dan ia mereda' },
                  assert:
                    'k = update({"x": 0.0, "blocks": [], "i": 0, "remaining": 5.0, "lives": 3, "mercy": 0.0, "shake": 0.2}, set(), 0.05)\n' +
                    'assert abs(k["shake"] - 0.15) < 1e-9, f"must drop to 0.15, now: {k[\'shake\']}"\n' +
                    'b = update({"x": 0.0, "blocks": [], "i": 0, "remaining": 5.0, "lives": 3, "mercy": 0.0, "shake": 0.05}, set(), 0.5)\n' +
                    'assert b["shake"] == 0, f"must not go negative, now: {b[\'shake\']}"',
                },
                {
                  name: { en: 'A hit while merciful does not shake again', id: 'Benturan saat kebal tidak mengguncang lagi' },
                  assert:
                    'k = update({"x": 152.0, "blocks": [{"x": 152, "y": 205.0}], "i": 0, "remaining": 5.0, "lives": 3, "mercy": 1.0, "shake": 0.0}, set(), 1 / 60)\n' +
                    'assert k["shake"] == 0, f"while invulnerable, it must not shake, now: {k[\'shake\']}"',
                },
                {
                  name: { en: 'The picture moves with the shake', id: 'Gambarnya ikut bergerak bersama guncangannya' },
                  assert:
                    'base = {"x": 100.0, "blocks": [{"x": 50, "y": 60.0}], "i": 0, "remaining": 5.0, "lives": 3, "mercy": 0.0, "shake": 0.0}\n' +
                    'still = draw(dict(base))\n' +
                    'shaken = draw({**base, "shake": 0.25})\n' +
                    'offset = shake_offset(0.25)\n' +
                    'boxes_still = [p for p in still if p["shape"] == "box"]\n' +
                    'boxes_shaken = [p for p in shaken if p["shape"] == "box"]\n' +
                    'assert len(boxes_still) == len(boxes_shaken), "the number of boxes must not change"\n' +
                    'for a, b in zip(boxes_still, boxes_shaken):\n' +
                    '    assert abs((b["x"] - a["x"]) - offset) < 1e-9, f"each box must shift by {offset}, now: {b[\'x\'] - a[\'x\']}"',
                },
                {
                  name: { en: 'The player flickers while merciful', id: 'Pemainnya berkelip selagi kebal' },
                  assert:
                    'base = {"x": 100.0, "blocks": [], "i": 0, "remaining": 5.0, "lives": 3, "shake": 0.0}\n' +
                    'on = draw({**base, "mercy": 1.05})\n' +
                    'off = draw({**base, "mercy": 1.15})\n' +
                    'assert len([p for p in on if p["shape"] == "box"]) == 1, "on the visible phase the player must be drawn"\n' +
                    'assert len([p for p in off if p["shape"] == "box"]) == 0, "on the hidden phase the player must vanish"\n' +
                    'normal = draw({**base, "mercy": 0.0})\n' +
                    'assert len([p for p in normal if p["shape"] == "box"]) == 1, "outside mercy the player must always be drawn"',
                },
                {
                  name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
                  assert:
                    'k = {"x": 152.0, "blocks": [], "i": 0, "remaining": 5.0, "lives": 3, "mercy": 0.0, "shake": 0.2}\n' +
                    'copy = dict(k)\n' +
                    'update(k, set(), 0.05)\n' +
                    'assert k == copy, f"update must not change the state it was given, now: {k}"',
                },
              ],
              hints: [
                { en: 'Both helpers are one or two lines, and neither needs any state of its own.', id: 'Kedua pembantunya satu atau dua baris, dan tak satu pun butuh state-nya sendiri.' },
                { en: 'The shake timer counts down exactly like `mercy` — one `max(0.0, ... - dt)`.', id: 'Pewaktu guncangannya menghitung mundur persis seperti `mercy` — satu `max(0.0, ... - dt)`.' },
                { en: 'Start it in the same branch that takes the life, so mercy silences it too.', id: 'Mulai ia di cabang yang sama dengan yang mengambil nyawanya, agar keringanannya juga membungkamnya.' },
                { en: 'In `draw`, work `offset` out once and add it to every `x` — including the text.', id: 'Di `draw`, hitung `offset` sekali dan tambahkan ke tiap `x` — termasuk teksnya.' },
              ],
              solution:
                'SPOT_X = [30, 120, 210, 280, 70, 160]\n' +
                'SPEED = 190\n' +
                'FALL = 130\n' +
                'SPAWN_DELAY = 0.6\n' +
                'SIDE = 16\n' +
                'BLOCK = 14\n' +
                'PLAYER_Y = 210\n' +
                'MERCY = 1.5\n' +
                'SHAKE = 0.3\n' +
                'WIDTH = 320\n' +
                'HEIGHT = 240\n\n' +
                'def overlaps(a, b):\n' +
                '    return (\n' +
                '        a["x"] < b["x"] + b["w"]\n' +
                '        and a["x"] + a["w"] > b["x"]\n' +
                '        and a["y"] < b["y"] + b["h"]\n' +
                '        and a["y"] + a["h"] > b["y"]\n' +
                '    )\n\n' +
                'def blink(mercy):\n' +
                '    return mercy > 0 and int(mercy * 10) % 2 == 1\n\n' +
                'def shake_offset(shake):\n' +
                '    if shake <= 0:\n' +
                '        return 0\n' +
                '    return 4 if int(shake * 60) % 2 == 0 else -4\n\n' +
                'def start():\n' +
                '    return {"x": 152.0, "blocks": [], "i": 0, "remaining": 0.0, "lives": 3, "mercy": 0.0, "shake": 0.0}\n\n' +
                'def update(state, keys, dt):\n' +
                '    x = state["x"]\n' +
                '    if "left" in keys:\n' +
                '        x = x - SPEED * dt\n' +
                '    if "right" in keys:\n' +
                '        x = x + SPEED * dt\n' +
                '    x = max(0, min(WIDTH - SIDE, x))\n\n' +
                '    lives = state["lives"]\n' +
                '    mercy = max(0.0, state["mercy"] - dt)\n' +
                '    shake = max(0.0, state["shake"] - dt)\n\n' +
                '    player = {"x": x, "y": PLAYER_Y, "w": SIDE, "h": SIDE}\n' +
                '    survivors = []\n' +
                '    for b in state["blocks"]:\n' +
                '        moved = {"x": b["x"], "y": b["y"] + FALL * dt}\n' +
                '        box = {"x": moved["x"], "y": moved["y"], "w": BLOCK, "h": BLOCK}\n' +
                '        if overlaps(box, player):\n' +
                '            if mercy <= 0:\n' +
                '                lives = max(0, lives - 1)\n' +
                '                mercy = MERCY\n' +
                '                shake = SHAKE\n' +
                '        elif moved["y"] <= HEIGHT:\n' +
                '            survivors.append(moved)\n\n' +
                '    i = state["i"]\n' +
                '    remaining = state["remaining"] - dt\n' +
                '    if remaining <= 0:\n' +
                '        survivors = survivors + [{"x": SPOT_X[i], "y": -float(BLOCK)}]\n' +
                '        i = (i + 1) % len(SPOT_X)\n' +
                '        remaining = SPAWN_DELAY\n\n' +
                '    return {\n' +
                '        "x": x,\n' +
                '        "blocks": survivors,\n' +
                '        "i": i,\n' +
                '        "remaining": remaining,\n' +
                '        "lives": lives,\n' +
                '        "mercy": mercy,\n' +
                '        "shake": shake,\n' +
                '    }\n\n' +
                'def draw(state):\n' +
                '    offset = shake_offset(state["shake"])\n' +
                '    result = []\n' +
                '    for b in state["blocks"]:\n' +
                '        result.append({"shape": "box", "x": b["x"] + offset, "y": b["y"], "w": BLOCK, "h": BLOCK, "color": "#ef8f70"})\n' +
                '    if not blink(state["mercy"]):\n' +
                '        result.append({"shape": "box", "x": state["x"] + offset, "y": PLAYER_Y, "w": SIDE, "h": SIDE, "color": "#24463d"})\n' +
                '    result.append({"shape": "text", "x": 8 + offset, "y": 8, "text": "Lives: " + str(state["lives"]), "color": "#24463d"})\n' +
                '    return result\n',
            },
          ],
        },
      ],
      project: {
        id: 'gd-m4-s1-p1',
        runtime: 'game',
        title: { en: 'Harvest', id: 'Panen' },
        brief: {
          en: 'The whole course in one game. Catch the good, dodge the bad, keep three lives, climb the levels, and beat your own record.',
          id: 'Seluruh kursus dalam satu game. Tangkap yang baik, hindari yang buruk, jaga tiga nyawa, naiki tingkatnya, dan kalahkan rekormu sendiri.',
        },
        requirements: [
          { en: 'Phases `"ready"`, `"playing"`, `"over"`. A space **press** starts a game from `"ready"`; from `"over"` it goes back to `"ready"`. `fresh` is given to you.', id: 'Fase `"ready"`, `"playing"`, `"over"`. **Tekanan** spasi memulai permainan dari `"ready"`; dari `"over"` ia kembali ke `"ready"`. `fresh` sudah diberikan.' },
          { en: '`level(score)` is `1 + score // 5`; `speed(score)` is `120 + level * 20` capped at 300; `spawn_delay(score)` is `0.9 - level * 0.06` floored at 0.35.', id: '`level(score)` adalah `1 + score // 5`; `speed(score)` adalah `120 + level * 20` berplafon 300; `spawn_delay(score)` adalah `0.9 - level * 0.06` berlantai 0,35.' },
          { en: 'Items are 14 by 14 and spawn at `SPOT_X[i % len(SPOT_X)]` with `kind` from `PATTERN[i % len(PATTERN)]`. `i` only ever counts up.', id: 'Bendanya 14 kali 14 dan muncul di `SPOT_X[i % len(SPOT_X)]` dengan `kind` dari `PATTERN[i % len(PATTERN)]`. `i` hanya pernah bertambah.' },
          { en: 'Catching a `"good"` scores a point. Catching a `"bad"` costs a life, starts 1.5 seconds of mercy and a 0.3 second shake — unless mercy is already running, in which case it is only removed.', id: 'Menangkap `"good"` menambah satu poin. Menangkap `"bad"` berbiaya satu nyawa, memulai keringanan 1,5 detik dan guncangan 0,3 detik — kecuali keringanannya sedang berjalan, dan kalau begitu ia hanya dibuang.' },
          { en: 'Anything that reaches the bottom is simply gone. Missing costs nothing.', id: 'Apa pun yang mencapai dasar sekadar hilang. Melewatkan tidak berbiaya apa pun.' },
          { en: 'At zero lives the phase becomes `"over"` and `record` becomes the larger of `record` and `score`. `record` survives every restart.', id: 'Saat nyawa nol, fasenya jadi `"over"` dan `record` jadi yang lebih besar antara `record` dan `score`. `record` selamat dari tiap mulai ulang.' },
          { en: '`draw` shifts everything by `shake_offset(shake)`, hides the player on the dark half of `blink(mercy)`, and draws good items in `#f5c65b` and bad ones in `#ef8f70`.', id: '`draw` menggeser semuanya sebesar `shake_offset(shake)`, menyembunyikan pemainnya pada separuh gelap `blink(mercy)`, dan menggambar benda baik dengan `#f5c65b` serta yang buruk dengan `#ef8f70`.' },
        ],
        starter:
          'SPOT_X = [40, 160, 280, 100, 220]\n' +
          'PATTERN = ["good", "good", "bad", "good", "bad", "good"]\n' +
          'SPEED = 200\n' +
          'PADDLE_W = 56\n' +
          'PADDLE_H = 12\n' +
          'PADDLE_Y = 214\n' +
          'ITEM = 14\n' +
          'MERCY = 1.5\n' +
          'SHAKE = 0.3\n' +
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
          '        "px": 132.0,\n' +
          '        "items": [],\n' +
          '        "i": 0,\n' +
          '        "remaining": 0.0,\n' +
          '        "score": 0,\n' +
          '        "lives": 3,\n' +
          '        "mercy": 0.0,\n' +
          '        "shake": 0.0,\n' +
          '        "record": record,\n' +
          '        "space_last": space_last,\n' +
          '    }\n\n' +
          'def level(score):\n' +
          '    return 1\n\n' +
          'def speed(score):\n' +
          '    return 120\n\n' +
          'def spawn_delay(score):\n' +
          '    return 0.9\n\n' +
          'def blink(mercy):\n' +
          '    return False\n\n' +
          'def shake_offset(shake):\n' +
          '    return 0\n\n' +
          'def start():\n' +
          '    return fresh("ready", False, 0)\n\n' +
          'def update(state, keys, dt):\n' +
          '    return state\n\n' +
          'def draw(state):\n' +
          '    result = []\n' +
          '    for b in state["items"]:\n' +
          '        result.append({"shape": "box", "x": b["x"], "y": b["y"], "w": ITEM, "h": ITEM, "color": "#f5c65b"})\n' +
          '    result.append({"shape": "box", "x": state["px"], "y": PADDLE_Y, "w": PADDLE_W, "h": PADDLE_H, "color": "#24463d"})\n' +
          '    result.append({"shape": "text", "x": 8, "y": 8, "text": "Score: 0", "color": "#24463d"})\n' +
          '    return result\n',
        tests: {
          en: [
            {
              name: { en: 'The tuning functions are right', id: 'Fungsi penyetelnya benar' },
              assert:
                'assert level(0) == 1 and level(4) == 1 and level(5) == 2 and level(14) == 3, "the level bands are wrong"\n' +
                'assert abs(speed(0) - 140) < 1e-9, f"level 1 must be 140, now: {speed(0)}"\n' +
                'assert abs(speed(5) - 160) < 1e-9, f"level 2 must be 160, now: {speed(5)}"\n' +
                'assert abs(speed(500) - 300) < 1e-9, f"must cap at 300, now: {speed(500)}"\n' +
                'assert abs(spawn_delay(0) - 0.84) < 1e-9, f"level 1 must be 0.84, now: {spawn_delay(0)}"\n' +
                'assert abs(spawn_delay(500) - 0.35) < 1e-9, f"must floor at 0.35, now: {spawn_delay(500)}"',
            },
            {
              name: { en: 'The feel helpers are right', id: 'Pembantu rasanya benar' },
              assert:
                'assert not blink(0.0) and not blink(-1.0), "without mercy it must not blink"\n' +
                'assert blink(1.15) and not blink(1.05), "it must alternate while it runs"\n' +
                'assert shake_offset(0.0) == 0, "without a shake it must not shift"\n' +
                'values = set(shake_offset(n / 60 + 0.001) for n in range(1, 20))\n' +
                'assert 4 in values and -4 in values and all(abs(v) == 4 for v in values), f"must shift by 4 both ways, now: {sorted(values)}"',
            },
            {
              name: { en: 'It waits, starts, and does not restart while held', id: 'Ia menunggu, mulai, dan tidak mengulang selagi ditahan' },
              assert:
                'k = start()\n' +
                'for _ in range(60):\n' +
                '    k = update(k, set(), 1 / 60)\n' +
                'assert k["phase"] == "ready" and len(k["items"]) == 0, "without a key it must keep waiting"\n' +
                'k = update(k, {"space"}, 1 / 60)\n' +
                'assert k["phase"] == "playing" and k["score"] == 0 and k["lives"] == 3, f"must start fresh, now: {k[\'phase\']}"\n' +
                'for _ in range(180):\n' +
                '    k = update(k, {"space"}, 1 / 60)\n' +
                'assert k["phase"] == "playing", "holding space must not restart it"\n' +
                'assert k["i"] > 1, "and the game must really be running"',
            },
            {
              name: { en: 'Items spawn in the right pattern', id: 'Bendanya muncul dengan pola yang benar' },
              assert:
                'k = update({**fresh("playing", True, 0), "remaining": 0.0, "i": 7}, set(), 0.01)\n' +
                'assert len(k["items"]) == 1, f"one must appear, now: {len(k[\'items\'])}"\n' +
                'b = k["items"][0]\n' +
                'assert b["x"] == SPOT_X[7 % len(SPOT_X)], f"x must come from SPOT_X, now: {b[\'x\']}"\n' +
                'assert b["kind"] == PATTERN[7 % len(PATTERN)], f"the kind must come from PATTERN, now: {b[\'kind\']}"\n' +
                'assert abs(b["y"] + 14) < 1e-9, f"must start at -14, now: {b[\'y\']}"\n' +
                'assert k["i"] == 8, f"i must keep rising, now: {k[\'i\']}"',
            },
            {
              name: { en: 'Items fall at the level speed', id: 'Bendanya jatuh pada kecepatan tingkatnya' },
              assert:
                'base = {**fresh("playing", True, 0), "remaining": 5.0, "items": [{"x": 40, "y": 0.0, "kind": "good"}]}\n' +
                'k = update(dict(base), set(), 0.5)\n' +
                'assert abs(k["items"][0]["y"] - 70) < 1e-9, f"level 1 for half a second must be 70, now: {k[\'items\'][0][\'y\']}"\n' +
                'b = update({**base, "score": 5}, set(), 0.5)\n' +
                'assert abs(b["items"][0]["y"] - 80) < 1e-9, f"level 2 for half a second must be 80, now: {b[\'items\'][0][\'y\']}"',
            },
            {
              name: { en: 'Catching the good scores', id: 'Menangkap yang baik menambah skor' },
              assert:
                'k = update({**fresh("playing", True, 0), "remaining": 5.0, "px": 132.0, "score": 2, "items": [{"x": 140, "y": 210.0, "kind": "good"}]}, set(), 1 / 60)\n' +
                'assert k["score"] == 3, f"must add to the score, now: {k[\'score\']}"\n' +
                'assert k["lives"] == 3, "and cost nothing"\n' +
                'assert len(k["items"]) == 0, "the item must be removed"',
            },
            {
              name: { en: 'Catching the bad hurts', id: 'Menangkap yang buruk menyakitkan' },
              assert:
                'k = update({**fresh("playing", True, 0), "remaining": 5.0, "px": 132.0, "score": 2, "items": [{"x": 140, "y": 210.0, "kind": "bad"}]}, set(), 1 / 60)\n' +
                'assert k["lives"] == 2, f"must lose a life, now: {k[\'lives\']}"\n' +
                'assert k["score"] == 2, "and must not add to the score"\n' +
                'assert k["mercy"] > 1.0, f"mercy must switch on, now: {k[\'mercy\']}"\n' +
                'assert k["shake"] > 0.2, f"the shake must switch on, now: {k[\'shake\']}"\n' +
                'assert len(k["items"]) == 0, "the item must be removed"',
            },
            {
              name: { en: 'Mercy protects, but the item still goes', id: 'Keringanan melindungi, tapi bendanya tetap pergi' },
              assert:
                'k = update({**fresh("playing", True, 0), "remaining": 5.0, "px": 132.0, "mercy": 1.0, "items": [{"x": 140, "y": 210.0, "kind": "bad"}]}, set(), 1 / 60)\n' +
                'assert k["lives"] == 3, f"while invulnerable, lives must not drop, now: {k[\'lives\']}"\n' +
                'assert k["shake"] == 0, f"and it must not shake, now: {k[\'shake\']}"\n' +
                'assert len(k["items"]) == 0, "the item must still be removed"',
            },
            {
              name: { en: 'Missing costs nothing', id: 'Melewatkan tidak berbiaya apa pun' },
              assert:
                'base = {**fresh("playing", True, 0), "remaining": 5.0, "px": 0.0, "score": 4}\n' +
                'k = update({**base, "items": [{"x": 280, "y": 239.0, "kind": "good"}]}, set(), 0.5)\n' +
                'assert k["score"] == 4 and k["lives"] == 3, "missing a good one must cost nothing"\n' +
                'assert len(k["items"]) == 0, "but the item is gone"\n' +
                'b = update({**base, "items": [{"x": 280, "y": 239.0, "kind": "bad"}]}, set(), 0.5)\n' +
                'assert b["lives"] == 3, "missing a bad one is actually good"',
            },
            {
              name: { en: 'The last life ends it, and sets the record', id: 'Nyawa terakhir mengakhirinya, dan menetapkan rekornya' },
              assert:
                'k = update({**fresh("playing", True, 3), "remaining": 5.0, "px": 132.0, "score": 9, "lives": 1, "items": [{"x": 140, "y": 210.0, "kind": "bad"}]}, set(), 1 / 60)\n' +
                'assert k["lives"] == 0 and k["phase"] == "over", f"must end, now: {k[\'phase\']}"\n' +
                'assert k["record"] == 9, f"the record must rise to 9, now: {k[\'record\']}"\n' +
                'b = update({**fresh("playing", True, 20), "remaining": 5.0, "px": 132.0, "score": 2, "lives": 1, "items": [{"x": 140, "y": 210.0, "kind": "bad"}]}, set(), 1 / 60)\n' +
                'assert b["record"] == 20, f"a worse game must not lower the record, now: {b[\'record\']}"',
            },
            {
              name: { en: 'Finished, nothing moves; the record survives', id: 'Setelah usai, tak ada yang bergerak; rekornya bertahan' },
              assert:
                'k = {**fresh("over", False, 11), "items": [{"x": 40, "y": 100.0, "kind": "good"}], "lives": 0, "score": 6}\n' +
                'b = update(dict(k), {"right"}, 0.5)\n' +
                'assert abs(b["px"] - 132.0) < 1e-9, "the paddle must stay still"\n' +
                'assert abs(b["items"][0]["y"] - 100.0) < 1e-9, "the items must stay still"\n' +
                'c = update(b, {"space"}, 1 / 60)\n' +
                'assert c["phase"] == "ready" and c["record"] == 11, f"must return to ready with the record intact, now: {c[\'phase\']}, {c[\'record\']}"\n' +
                'd = update(update(c, set(), 1 / 60), {"space"}, 1 / 60)\n' +
                'assert d["phase"] == "playing" and d["score"] == 0 and d["record"] == 11, "the new game must be fresh, the record must not"',
            },
            {
              name: { en: 'The picture shakes and flickers', id: 'Gambarnya berguncang dan berkelip' },
              assert:
                'base = {**fresh("playing", True, 0), "items": [{"x": 40, "y": 60.0, "kind": "good"}]}\n' +
                'still = draw(dict(base))\n' +
                'shaken = draw({**base, "shake": 0.25})\n' +
                'offset = shake_offset(0.25)\n' +
                'a = [p for p in still if p["shape"] == "box"]\n' +
                'b = [p for p in shaken if p["shape"] == "box"]\n' +
                'assert len(a) == len(b) and len(a) == 2, f"must be two boxes in both pictures, now: {len(a)} and {len(b)}"\n' +
                'for one, two in zip(a, b):\n' +
                '    assert abs((two["x"] - one["x"]) - offset) < 1e-9, "everything must shift the same"\n' +
                'hidden = draw({**base, "mercy": 1.15})\n' +
                'assert len([p for p in hidden if p["shape"] == "box"]) == 1, "on the hidden phase the paddle must vanish"',
            },
            {
              name: { en: 'Good and bad look different', id: 'Yang baik dan yang buruk tampak berbeda' },
              assert:
                'a = draw({**fresh("playing", True, 0), "items": [\n' +
                '    {"x": 40, "y": 60.0, "kind": "good"},\n' +
                '    {"x": 160, "y": 60.0, "kind": "bad"},\n' +
                ']})\n' +
                'colors = [p["color"] for p in a if p["shape"] == "box"]\n' +
                'assert "#f5c65b" in colors, f"a good one must be #f5c65b, now: {colors}"\n' +
                'assert "#ef8f70" in colors, f"a bad one must be #ef8f70, now: {colors}"',
            },
            {
              name: { en: 'A whole game can be played end to end', id: 'Satu permainan penuh bisa dilalui ujung ke ujung' },
              assert:
                'k = update(start(), {"space"}, 1 / 60)\n' +
                'for _ in range(9000):\n' +
                '    # chase the nearest good one, and do not sit under a bad one\n' +
                '    target_item = None\n' +
                '    for b in k["items"]:\n' +
                '        if b["kind"] == "good" and (target_item is None or b["y"] > target_item["y"]):\n' +
                '            target_item = b\n' +
                '    held = set()\n' +
                '    if target_item is not None:\n' +
                '        target = target_item["x"] - 21\n' +
                '        if k["px"] < target - 2:\n' +
                '            held = {"right"}\n' +
                '        elif k["px"] > target + 2:\n' +
                '            held = {"left"}\n' +
                '    k = update(k, held, 1 / 60)\n' +
                '    if k["phase"] == "over":\n' +
                '        break\n' +
                'assert k["score"] > 5, f"a player that chases must score, now: {k[\'score\']}"\n' +
                'assert len(k["items"]) < 20, f"the list must stay small, now: {len(k[\'items\'])}"',
            },
            {
              name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
              assert:
                'original = [{"x": 40, "y": 10.0, "kind": "good"}]\n' +
                'k = {**fresh("playing", False, 4), "items": original, "remaining": 5.0}\n' +
                'update(k, {"right"}, 0.5)\n' +
                'assert original[0]["y"] == 10.0, f"the old items must not move too, now: {original[0][\'y\']}"\n' +
                'assert k["px"] == 132.0 and k["score"] == 0, "the state it was given must not change"',
            },
          ],
          id: [
            {
              name: { en: 'The tuning functions are right', id: 'Fungsi penyetelnya benar' },
              assert:
                'assert level(0) == 1 and level(4) == 1 and level(5) == 2 and level(14) == 3, "rentang tingkatnya salah"\n' +
                'assert abs(speed(0) - 140) < 1e-9, f"tingkat 1 harus 140, sekarang: {speed(0)}"\n' +
                'assert abs(speed(5) - 160) < 1e-9, f"tingkat 2 harus 160, sekarang: {speed(5)}"\n' +
                'assert abs(speed(500) - 300) < 1e-9, f"harus berplafon 300, sekarang: {speed(500)}"\n' +
                'assert abs(spawn_delay(0) - 0.84) < 1e-9, f"tingkat 1 harus 0.84, sekarang: {spawn_delay(0)}"\n' +
                'assert abs(spawn_delay(500) - 0.35) < 1e-9, f"harus berlantai 0.35, sekarang: {spawn_delay(500)}"',
            },
            {
              name: { en: 'The feel helpers are right', id: 'Pembantu rasanya benar' },
              assert:
                'assert not blink(0.0) and not blink(-1.0), "tanpa kekebalan tidak berkedip"\n' +
                'assert blink(1.15) and not blink(1.05), "harus berganti-ganti selagi berjalan"\n' +
                'assert shake_offset(0.0) == 0, "tanpa guncangan tidak bergeser"\n' +
                'values = set(shake_offset(n / 60 + 0.001) for n in range(1, 20))\n' +
                'assert 4 in values and -4 in values and all(abs(v) == 4 for v in values), f"harus bergoyang empat ke kedua sisi, sekarang: {sorted(values)}"',
            },
            {
              name: { en: 'It waits, starts, and does not restart while held', id: 'Ia menunggu, mulai, dan tidak mengulang selagi ditahan' },
              assert:
                'k = start()\n' +
                'for _ in range(60):\n' +
                '    k = update(k, set(), 1 / 60)\n' +
                'assert k["phase"] == "ready" and len(k["items"]) == 0, "tanpa tombol harus tetap menunggu"\n' +
                'k = update(k, {"space"}, 1 / 60)\n' +
                'assert k["phase"] == "playing" and k["score"] == 0 and k["lives"] == 3, f"harus mulai segar, sekarang: {k[\'phase\']}"\n' +
                'for _ in range(180):\n' +
                '    k = update(k, {"space"}, 1 / 60)\n' +
                'assert k["phase"] == "playing", "menahan spasi tidak boleh mengulang"\n' +
                'assert k["i"] > 1, "dan permainannya harus benar-benar berjalan"',
            },
            {
              name: { en: 'Items spawn in the right pattern', id: 'Bendanya muncul dengan pola yang benar' },
              assert:
                'k = update({**fresh("playing", True, 0), "remaining": 0.0, "i": 7}, set(), 0.01)\n' +
                'assert len(k["items"]) == 1, f"harus muncul satu, sekarang: {len(k[\'items\'])}"\n' +
                'b = k["items"][0]\n' +
                'assert b["x"] == SPOT_X[7 % len(SPOT_X)], f"x harus dari SPOT_X, sekarang: {b[\'x\']}"\n' +
                'assert b["kind"] == PATTERN[7 % len(PATTERN)], f"jenisnya harus dari PATTERN, sekarang: {b[\'kind\']}"\n' +
                'assert abs(b["y"] + 14) < 1e-9, f"harus mulai di -14, sekarang: {b[\'y\']}"\n' +
                'assert k["i"] == 8, f"i harus terus naik, sekarang: {k[\'i\']}"',
            },
            {
              name: { en: 'Items fall at the level speed', id: 'Bendanya jatuh pada kecepatan tingkatnya' },
              assert:
                'base = {**fresh("playing", True, 0), "remaining": 5.0, "items": [{"x": 40, "y": 0.0, "kind": "good"}]}\n' +
                'k = update(dict(base), set(), 0.5)\n' +
                'assert abs(k["items"][0]["y"] - 70) < 1e-9, f"tingkat 1 setengah detik harus 70, sekarang: {k[\'items\'][0][\'y\']}"\n' +
                'b = update({**base, "score": 5}, set(), 0.5)\n' +
                'assert abs(b["items"][0]["y"] - 80) < 1e-9, f"tingkat 2 setengah detik harus 80, sekarang: {b[\'items\'][0][\'y\']}"',
            },
            {
              name: { en: 'Catching the good scores', id: 'Menangkap yang baik menambah skor' },
              assert:
                'k = update({**fresh("playing", True, 0), "remaining": 5.0, "px": 132.0, "score": 2, "items": [{"x": 140, "y": 210.0, "kind": "good"}]}, set(), 1 / 60)\n' +
                'assert k["score"] == 3, f"harus menambah skor, sekarang: {k[\'score\']}"\n' +
                'assert k["lives"] == 3, "dan tidak berbiaya nyawa"\n' +
                'assert len(k["items"]) == 0, "bendanya harus dibuang"',
            },
            {
              name: { en: 'Catching the bad hurts', id: 'Menangkap yang buruk menyakitkan' },
              assert:
                'k = update({**fresh("playing", True, 0), "remaining": 5.0, "px": 132.0, "score": 2, "items": [{"x": 140, "y": 210.0, "kind": "bad"}]}, set(), 1 / 60)\n' +
                'assert k["lives"] == 2, f"harus kehilangan nyawa, sekarang: {k[\'lives\']}"\n' +
                'assert k["score"] == 2, "dan tidak menambah skor"\n' +
                'assert k["mercy"] > 1.0, f"keringanannya harus menyala, sekarang: {k[\'mercy\']}"\n' +
                'assert k["shake"] > 0.2, f"guncangannya harus menyala, sekarang: {k[\'shake\']}"\n' +
                'assert len(k["items"]) == 0, "bendanya harus dibuang"',
            },
            {
              name: { en: 'Mercy protects, but the item still goes', id: 'Keringanan melindungi, tapi bendanya tetap pergi' },
              assert:
                'k = update({**fresh("playing", True, 0), "remaining": 5.0, "px": 132.0, "mercy": 1.0, "items": [{"x": 140, "y": 210.0, "kind": "bad"}]}, set(), 1 / 60)\n' +
                'assert k["lives"] == 3, f"sedang kebal, tidak boleh berkurang, sekarang: {k[\'lives\']}"\n' +
                'assert k["shake"] == 0, f"dan tidak mengguncang, sekarang: {k[\'shake\']}"\n' +
                'assert len(k["items"]) == 0, "bendanya tetap dibuang"',
            },
            {
              name: { en: 'Missing costs nothing', id: 'Melewatkan tidak berbiaya apa pun' },
              assert:
                'base = {**fresh("playing", True, 0), "remaining": 5.0, "px": 0.0, "score": 4}\n' +
                'k = update({**base, "items": [{"x": 280, "y": 239.0, "kind": "good"}]}, set(), 0.5)\n' +
                'assert k["score"] == 4 and k["lives"] == 3, "melewatkan yang baik tidak berbiaya"\n' +
                'assert len(k["items"]) == 0, "tapi bendanya hilang"\n' +
                'b = update({**base, "items": [{"x": 280, "y": 239.0, "kind": "bad"}]}, set(), 0.5)\n' +
                'assert b["lives"] == 3, "melewatkan yang buruk justru bagus"',
            },
            {
              name: { en: 'The last life ends it, and sets the record', id: 'Nyawa terakhir mengakhirinya, dan menetapkan rekornya' },
              assert:
                'k = update({**fresh("playing", True, 3), "remaining": 5.0, "px": 132.0, "score": 9, "lives": 1, "items": [{"x": 140, "y": 210.0, "kind": "bad"}]}, set(), 1 / 60)\n' +
                'assert k["lives"] == 0 and k["phase"] == "over", f"harus berakhir, sekarang: {k[\'phase\']}"\n' +
                'assert k["record"] == 9, f"rekornya harus naik ke 9, sekarang: {k[\'record\']}"\n' +
                'b = update({**fresh("playing", True, 20), "remaining": 5.0, "px": 132.0, "score": 2, "lives": 1, "items": [{"x": 140, "y": 210.0, "kind": "bad"}]}, set(), 1 / 60)\n' +
                'assert b["record"] == 20, f"permainan lebih buruk tidak menurunkan rekor, sekarang: {b[\'record\']}"',
            },
            {
              name: { en: 'Finished, nothing moves; the record survives', id: 'Setelah usai, tak ada yang bergerak; rekornya bertahan' },
              assert:
                'k = {**fresh("over", False, 11), "items": [{"x": 40, "y": 100.0, "kind": "good"}], "lives": 0, "score": 6}\n' +
                'b = update(dict(k), {"right"}, 0.5)\n' +
                'assert abs(b["px"] - 132.0) < 1e-9, "papannya harus diam"\n' +
                'assert abs(b["items"][0]["y"] - 100.0) < 1e-9, "bendanya harus diam"\n' +
                'c = update(b, {"space"}, 1 / 60)\n' +
                'assert c["phase"] == "ready" and c["record"] == 11, f"harus kembali ke ready dengan rekor utuh, sekarang: {c[\'phase\']}, {c[\'record\']}"\n' +
                'd = update(update(c, set(), 1 / 60), {"space"}, 1 / 60)\n' +
                'assert d["phase"] == "playing" and d["score"] == 0 and d["record"] == 11, "permainan barunya segar, rekornya tidak"',
            },
            {
              name: { en: 'The picture shakes and flickers', id: 'Gambarnya berguncang dan berkelip' },
              assert:
                'base = {**fresh("playing", True, 0), "items": [{"x": 40, "y": 60.0, "kind": "good"}]}\n' +
                'still = draw(dict(base))\n' +
                'shaken = draw({**base, "shake": 0.25})\n' +
                'offset = shake_offset(0.25)\n' +
                'a = [p for p in still if p["shape"] == "box"]\n' +
                'b = [p for p in shaken if p["shape"] == "box"]\n' +
                'assert len(a) == len(b) and len(a) == 2, f"harus dua kotak di kedua gambar, sekarang: {len(a)} dan {len(b)}"\n' +
                'for one, two in zip(a, b):\n' +
                '    assert abs((two["x"] - one["x"]) - offset) < 1e-9, "semuanya harus bergeser sama"\n' +
                'hidden = draw({**base, "mercy": 1.15})\n' +
                'assert len([p for p in hidden if p["shape"] == "box"]) == 1, "pada fase padam papannya harus hilang"',
            },
            {
              name: { en: 'Good and bad look different', id: 'Yang baik dan yang buruk tampak berbeda' },
              assert:
                'a = draw({**fresh("playing", True, 0), "items": [\n' +
                '    {"x": 40, "y": 60.0, "kind": "good"},\n' +
                '    {"x": 160, "y": 60.0, "kind": "bad"},\n' +
                ']})\n' +
                'colors = [p["color"] for p in a if p["shape"] == "box"]\n' +
                'assert "#f5c65b" in colors, f"yang baik harus #f5c65b, sekarang: {colors}"\n' +
                'assert "#ef8f70" in colors, f"yang buruk harus #ef8f70, sekarang: {colors}"',
            },
            {
              name: { en: 'A whole game can be played end to end', id: 'Satu permainan penuh bisa dilalui ujung ke ujung' },
              assert:
                'k = update(start(), {"space"}, 1 / 60)\n' +
                'for _ in range(9000):\n' +
                '    # kejar yang baik terdekat, dan jangan berdiri di bawah yang buruk\n' +
                '    target_item = None\n' +
                '    for b in k["items"]:\n' +
                '        if b["kind"] == "good" and (target_item is None or b["y"] > target_item["y"]):\n' +
                '            target_item = b\n' +
                '    held = set()\n' +
                '    if target_item is not None:\n' +
                '        target = target_item["x"] - 21\n' +
                '        if k["px"] < target - 2:\n' +
                '            held = {"right"}\n' +
                '        elif k["px"] > target + 2:\n' +
                '            held = {"left"}\n' +
                '    k = update(k, held, 1 / 60)\n' +
                '    if k["phase"] == "over":\n' +
                '        break\n' +
                'assert k["score"] > 5, f"pemain yang mengejar harus mencetak skor, sekarang: {k[\'score\']}"\n' +
                'assert len(k["items"]) < 20, f"daftarnya harus tetap kecil, sekarang: {len(k[\'items\'])}"',
            },
            {
              name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
              assert:
                'original = [{"x": 40, "y": 10.0, "kind": "good"}]\n' +
                'k = {**fresh("playing", False, 4), "items": original, "remaining": 5.0}\n' +
                'update(k, {"right"}, 0.5)\n' +
                'assert original[0]["y"] == 10.0, f"benda lamanya tidak boleh ikut bergerak, sekarang: {original[0][\'y\']}"\n' +
                'assert k["px"] == 132.0 and k["score"] == 0, "keadaan yang diberikan tidak boleh berubah"',
            },
          ],
        },
        hints: [
          { en: 'You have written all of this before. The only new thing is that an item carries a `kind`, and the two kinds are resolved differently.', id: 'Kamu sudah pernah menulis semua ini. Satu-satunya yang baru adalah bendanya membawa `kind`, dan kedua jenisnya diselesaikan berbeda.' },
          { en: 'Keep `i` as a plain counter and take the remainder where you read the lists — that is why the pattern and the positions can be different lengths.', id: 'Jaga `i` tetap penghitung biasa dan ambil sisanya di tempat kamu membaca daftarnya — itulah sebabnya polanya dan posisinya boleh berbeda panjang.' },
          { en: 'The bad-item branch has two cases inside it: mercy running, or not. Only one of them costs anything.', id: 'Cabang benda buruknya punya dua kasus di dalamnya: keringanan sedang berjalan, atau tidak. Hanya satu dari keduanya yang berbiaya.' },
          { en: 'Work `offset` out once at the top of `draw`, and remember the text moves with everything else.', id: 'Hitung `offset` sekali di atas `draw`, dan ingat teksnya ikut bergerak bersama yang lain.' },
        ],
        solution: {
          en:
            'SPOT_X = [40, 160, 280, 100, 220]\n' +
            'PATTERN = ["good", "good", "bad", "good", "bad", "good"]\n' +
            'SPEED = 200\n' +
            'PADDLE_W = 56\n' +
            'PADDLE_H = 12\n' +
            'PADDLE_Y = 214\n' +
            'ITEM = 14\n' +
            'MERCY = 1.5\n' +
            'SHAKE = 0.3\n' +
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
            '        "px": 132.0,\n' +
            '        "items": [],\n' +
            '        "i": 0,\n' +
            '        "remaining": 0.0,\n' +
            '        "score": 0,\n' +
            '        "lives": 3,\n' +
            '        "mercy": 0.0,\n' +
            '        "shake": 0.0,\n' +
            '        "record": record,\n' +
            '        "space_last": space_last,\n' +
            '    }\n\n' +
            'def level(score):\n' +
            '    return 1 + score // 5\n\n' +
            'def speed(score):\n' +
            '    return min(300, 120 + level(score) * 20)\n\n' +
            'def spawn_delay(score):\n' +
            '    return max(0.35, 0.9 - level(score) * 0.06)\n\n' +
            'def blink(mercy):\n' +
            '    return mercy > 0 and int(mercy * 10) % 2 == 1\n\n' +
            'def shake_offset(shake):\n' +
            '    if shake <= 0:\n' +
            '        return 0\n' +
            '    return 4 if int(shake * 60) % 2 == 0 else -4\n\n' +
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
            '    mercy = max(0.0, state["mercy"] - dt)\n' +
            '    shake = max(0.0, state["shake"] - dt)\n' +
            '    fall_speed = speed(score)\n\n' +
            '    paddle = {"x": px, "y": PADDLE_Y, "w": PADDLE_W, "h": PADDLE_H}\n' +
            '    survivors = []\n' +
            '    for b in state["items"]:\n' +
            '        moved = {"x": b["x"], "y": b["y"] + fall_speed * dt, "kind": b["kind"]}\n' +
            '        box = {"x": moved["x"], "y": moved["y"], "w": ITEM, "h": ITEM}\n' +
            '        if overlaps(box, paddle):\n' +
            '            if moved["kind"] == "good":\n' +
            '                score = score + 1\n' +
            '            elif mercy <= 0:\n' +
            '                lives = max(0, lives - 1)\n' +
            '                mercy = MERCY\n' +
            '                shake = SHAKE\n' +
            '        elif moved["y"] <= HEIGHT:\n' +
            '            survivors.append(moved)\n\n' +
            '    i = state["i"]\n' +
            '    remaining = state["remaining"] - dt\n' +
            '    if remaining <= 0:\n' +
            '        survivors = survivors + [{\n' +
            '            "x": SPOT_X[i % len(SPOT_X)],\n' +
            '            "y": -float(ITEM),\n' +
            '            "kind": PATTERN[i % len(PATTERN)],\n' +
            '        }]\n' +
            '        i = i + 1\n' +
            '        remaining = spawn_delay(score)\n\n' +
            '    record = state["record"]\n' +
            '    phase = "playing"\n' +
            '    if lives <= 0:\n' +
            '        phase = "over"\n' +
            '        record = max(record, score)\n\n' +
            '    return {\n' +
            '        "phase": phase,\n' +
            '        "px": px,\n' +
            '        "items": survivors,\n' +
            '        "i": i,\n' +
            '        "remaining": remaining,\n' +
            '        "score": score,\n' +
            '        "lives": lives,\n' +
            '        "mercy": mercy,\n' +
            '        "shake": shake,\n' +
            '        "record": record,\n' +
            '        "space_last": down,\n' +
            '    }\n\n' +
            'def draw(state):\n' +
            '    offset = shake_offset(state["shake"])\n' +
            '    result = []\n\n' +
            '    for b in state["items"]:\n' +
            '        color = "#f5c65b" if b["kind"] == "good" else "#ef8f70"\n' +
            '        result.append({"shape": "box", "x": b["x"] + offset, "y": b["y"], "w": ITEM, "h": ITEM, "color": color})\n\n' +
            '    if not blink(state["mercy"]):\n' +
            '        result.append({\n' +
            '            "shape": "box",\n' +
            '            "x": state["px"] + offset,\n' +
            '            "y": PADDLE_Y,\n' +
            '            "w": PADDLE_W,\n' +
            '            "h": PADDLE_H,\n' +
            '            "color": "#24463d",\n' +
            '        })\n\n' +
            '    if state["phase"] == "ready":\n' +
            '        result.append({"shape": "text", "x": 90 + offset, "y": 110, "text": "Space to start", "color": "#24463d"})\n' +
            '    elif state["phase"] == "over":\n' +
            '        result.append({"shape": "text", "x": 84 + offset, "y": 110, "text": "Game over! Record " + str(state["record"]), "color": "#ef8f70"})\n' +
            '    else:\n' +
            '        result.append({\n' +
            '            "shape": "text",\n' +
            '            "x": 8 + offset,\n' +
            '            "y": 8,\n' +
            '            "text": "Score: " + str(state["score"]) + "  Lives: " + str(state["lives"]) + "  Level: " + str(level(state["score"])),\n' +
            '            "color": "#24463d",\n' +
            '        })\n\n' +
            '    return result\n',
          id:
            'SPOT_X = [40, 160, 280, 100, 220]\n' +
            'PATTERN = ["good", "good", "bad", "good", "bad", "good"]\n' +
            'SPEED = 200\n' +
            'PADDLE_W = 56\n' +
            'PADDLE_H = 12\n' +
            'PADDLE_Y = 214\n' +
            'ITEM = 14\n' +
            'MERCY = 1.5\n' +
            'SHAKE = 0.3\n' +
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
            '        "px": 132.0,\n' +
            '        "items": [],\n' +
            '        "i": 0,\n' +
            '        "remaining": 0.0,\n' +
            '        "score": 0,\n' +
            '        "lives": 3,\n' +
            '        "mercy": 0.0,\n' +
            '        "shake": 0.0,\n' +
            '        "record": record,\n' +
            '        "space_last": space_last,\n' +
            '    }\n\n' +
            'def level(score):\n' +
            '    return 1 + score // 5\n\n' +
            'def speed(score):\n' +
            '    return min(300, 120 + level(score) * 20)\n\n' +
            'def spawn_delay(score):\n' +
            '    return max(0.35, 0.9 - level(score) * 0.06)\n\n' +
            'def blink(mercy):\n' +
            '    return mercy > 0 and int(mercy * 10) % 2 == 1\n\n' +
            'def shake_offset(shake):\n' +
            '    if shake <= 0:\n' +
            '        return 0\n' +
            '    return 4 if int(shake * 60) % 2 == 0 else -4\n\n' +
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
            '    mercy = max(0.0, state["mercy"] - dt)\n' +
            '    shake = max(0.0, state["shake"] - dt)\n' +
            '    fall_speed = speed(score)\n\n' +
            '    paddle = {"x": px, "y": PADDLE_Y, "w": PADDLE_W, "h": PADDLE_H}\n' +
            '    survivors = []\n' +
            '    for b in state["items"]:\n' +
            '        moved = {"x": b["x"], "y": b["y"] + fall_speed * dt, "kind": b["kind"]}\n' +
            '        box = {"x": moved["x"], "y": moved["y"], "w": ITEM, "h": ITEM}\n' +
            '        if overlaps(box, paddle):\n' +
            '            if moved["kind"] == "good":\n' +
            '                score = score + 1\n' +
            '            elif mercy <= 0:\n' +
            '                lives = max(0, lives - 1)\n' +
            '                mercy = MERCY\n' +
            '                shake = SHAKE\n' +
            '        elif moved["y"] <= HEIGHT:\n' +
            '            survivors.append(moved)\n\n' +
            '    i = state["i"]\n' +
            '    remaining = state["remaining"] - dt\n' +
            '    if remaining <= 0:\n' +
            '        survivors = survivors + [{\n' +
            '            "x": SPOT_X[i % len(SPOT_X)],\n' +
            '            "y": -float(ITEM),\n' +
            '            "kind": PATTERN[i % len(PATTERN)],\n' +
            '        }]\n' +
            '        i = i + 1\n' +
            '        remaining = spawn_delay(score)\n\n' +
            '    record = state["record"]\n' +
            '    phase = "playing"\n' +
            '    if lives <= 0:\n' +
            '        phase = "over"\n' +
            '        record = max(record, score)\n\n' +
            '    return {\n' +
            '        "phase": phase,\n' +
            '        "px": px,\n' +
            '        "items": survivors,\n' +
            '        "i": i,\n' +
            '        "remaining": remaining,\n' +
            '        "score": score,\n' +
            '        "lives": lives,\n' +
            '        "mercy": mercy,\n' +
            '        "shake": shake,\n' +
            '        "record": record,\n' +
            '        "space_last": down,\n' +
            '    }\n\n' +
            'def draw(state):\n' +
            '    offset = shake_offset(state["shake"])\n' +
            '    result = []\n\n' +
            '    for b in state["items"]:\n' +
            '        color = "#f5c65b" if b["kind"] == "good" else "#ef8f70"\n' +
            '        result.append({"shape": "box", "x": b["x"] + offset, "y": b["y"], "w": ITEM, "h": ITEM, "color": color})\n\n' +
            '    if not blink(state["mercy"]):\n' +
            '        result.append({\n' +
            '            "shape": "box",\n' +
            '            "x": state["px"] + offset,\n' +
            '            "y": PADDLE_Y,\n' +
            '            "w": PADDLE_W,\n' +
            '            "h": PADDLE_H,\n' +
            '            "color": "#24463d",\n' +
            '        })\n\n' +
            '    if state["phase"] == "ready":\n' +
            '        result.append({"shape": "text", "x": 90 + offset, "y": 110, "text": "Space to start", "color": "#24463d"})\n' +
            '    elif state["phase"] == "over":\n' +
            '        result.append({"shape": "text", "x": 84 + offset, "y": 110, "text": "Game over! Record " + str(state["record"]), "color": "#ef8f70"})\n' +
            '    else:\n' +
            '        result.append({\n' +
            '            "shape": "text",\n' +
            '            "x": 8 + offset,\n' +
            '            "y": 8,\n' +
            '            "text": "Score: " + str(state["score"]) + "  Lives: " + str(state["lives"]) + "  Level: " + str(level(state["score"])),\n' +
            '            "color": "#24463d",\n' +
            '        })\n\n' +
            '    return result\n',
        },
        xp: 80,
      },
    },
  ],
}
