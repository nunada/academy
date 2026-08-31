import type { Module } from '../types'

/** Module 4 — update() finally does something: a held key changes one
 *  number in the state, and draw() keeps reflecting it. Every check calls
 *  update() once with a made-up keys set and dt, and checks the single
 *  resulting state — nothing here depends on frame rate or holding a key
 *  across many calls, matching how this course's checks have worked since
 *  module 3. */
export const module4: Module = {
  id: 'pymed-m4',
  title: { en: 'Interactive Teaching Aids', id: 'Peraga Interaktif' },
  summary: {
    en: 'A key changes a value, and the picture keeps up — a fraction bar a class can step through, a line that tilts as its slope changes.',
    id: 'Tombol mengubah sebuah nilai, dan gambarnya mengikuti — batang pecahan yang bisa dilangkahi satu kelas, garis yang miring seiring kemiringannya berubah.',
  },
  submodules: [
    /* ------------------------------------------------------- 4.1 fraction bar */
    {
      id: 'pymed-m4-s1',
      title: { en: 'Fraction Visualizer', id: 'Peraga Pecahan' },
      summary: {
        en: 'One key changes the numerator, another the denominator — and a bar of coloured segments always shows exactly that fraction.',
        id: 'Satu tombol mengubah pembilang, satu lagi penyebut — dan batang berisi segmen berwarna selalu menunjukkan persis pecahan itu.',
      },
      lessons: [
        {
          id: 'pymed-m4-s1-l1',
          title: { en: 'One Key, One Change', id: 'Satu Tombol, Satu Perubahan' },
          goal: { en: 'Read keys inside update and change part of the state.', id: 'Membaca tombol di dalam perbarui dan mengubah bagian dari keadaan.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'keys is a set of what is held right now', id: 'tombol adalah kumpulan yang sedang ditekan sekarang' },
              body: {
                en: '`keys` holds the names of every key down at this instant — checking `"right" in keys` is exactly like checking membership in any other set. When nothing relevant is held, update simply hands back the state as it was.',
                id: '`tombol` menyimpan nama tiap tombol yang sedang ditekan saat ini — memeriksa `"kanan" in tombol` persis seperti memeriksa keanggotaan di set mana pun. Kalau tak ada yang relevan sedang ditekan, perbarui sekadar mengembalikan keadaannya seperti semula.',
              },
              code:
                'def update(state, keys, dt):\n    if "right" in keys:\n        state = dict(state)\n        state["x"] += 1\n    return state\n\nprint(update({"x": 5}, {"right"}, 0.1))\nprint(update({"x": 5}, set(), 0.1))',
              output: "{'x': 6}\n{'x': 5}",
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Keeping a value inside its bounds', id: 'Menjaga nilai tetap di dalam batasnya' },
              body: {
                en: 'A value that only ever goes up needs a ceiling. `min(value, limit)` never lets the result exceed `limit` — the same idea as `max(value, 0)` for a floor that stops it going negative.',
                id: 'Nilai yang hanya pernah bertambah butuh batas atas. `min(nilai, batas)` tak pernah membiarkan hasilnya melebihi `batas` — ide yang sama seperti `max(nilai, 0)` untuk batas bawah yang mencegahnya jadi negatif.',
              },
              code: 'value = 8\nlimit = 6\nprint(min(value, limit))\nprint(max(-3, 0))',
              output: '6\n0',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'update checks "right" in keys. keys is {"right", "up"} — both keys are held. What happens?',
                id: 'perbarui memeriksa "kanan" in tombol. tombol adalah {"kanan", "atas"} — kedua tombol sedang ditekan. Apa yang terjadi?',
              },
              options: [
                { en: 'The check is True, since "right" is one of the members', id: 'Pemeriksaannya True, karena "kanan" salah satu anggotanya' },
                { en: 'The check is False, since more than one key is held', id: 'Pemeriksaannya False, karena lebih dari satu tombol ditekan' },
                { en: 'It raises an error', id: 'Ia melempar galat' },
                { en: 'It depends on the order the keys were pressed', id: 'Bergantung urutan tombolnya ditekan' },
              ],
              answer: 0,
              explain: {
                en: '"in" only asks whether the one name is a member of the set — extra members held alongside it change nothing.',
                id: '"in" hanya bertanya apakah satu nama itu anggota dari set-nya — anggota lain yang ikut ditekan tak mengubah apa pun.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Cap value so it never exceeds 10.',
                id: 'Batasi nilai agar tak pernah melebihi 10.',
              },
              template: 'value = 14\nvalue = ___(value, 10)\nprint(value)',
              blanks: ['min'],
              explain: {
                en: 'min keeps the smaller of the two — exactly a ceiling.',
                id: 'min menjaga yang lebih kecil dari keduanya — persis sebuah batas atas.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble an update that increases y when "up" is held, floored at 0.',
                id: 'Susun perbarui yang menambah y ketika "atas" ditekan, dengan batas bawah 0.',
              },
              lines: [
                'def update(state, keys, dt):',
                '    if "up" in keys:',
                '        state = dict(state)',
                '        state["y"] = max(0, state["y"] - 1)',
                '    return state',
              ],
              explain: {
                en: '"up" moves y toward 0 on this canvas — the floor still has to be checked with max.',
                id: '"atas" menggerakkan y menuju 0 pada kanvas ini — batas bawahnya tetap harus diperiksa dengan max.',
              },
            },
            {
              kind: 'game',
              id: 'k1',
              prompt: {
                en: 'The state holds `n`. Write `start()` returning `{"n": 3}`. Write `update` so that holding "right" adds 1 to n, capped at 10; nothing else changes n. Write `draw` returning one text showing `str(n)`.',
                id: 'Keadaannya menyimpan `n`. Tulis `start()` yang mengembalikan `{"n": 3}`. Tulis `update` sehingga menekan "kanan" menambah 1 ke n, dengan batas atas 10; selain itu n tak berubah. Tulis `draw` yang mengembalikan satu text menampilkan `str(n)`.',
              },
              starter:
                'def start():\n    return {}\n\ndef update(state, keys, dt):\n    return state\n\ndef draw(state):\n    return []\n',
              tests: [
                {
                  name: { en: 'start() starts at n=3', id: 'start() mulai di n=3' },
                  assert: 'k = start()\nassert k.get("n") == 3, f\'start()["n"] must be 3, now: {k.get("n")}\'',
                },
                {
                  name: { en: 'holding right adds 1', id: 'menekan kanan menambah 1' },
                  assert: 'k = update({"n": 3}, {"right"}, 0.1)\nassert k.get("n") == 4, f\'n must become 4, now: {k.get("n")}\'',
                },
                {
                  name: { en: 'nothing held changes nothing', id: 'tak ada yang ditekan, tak ada yang berubah' },
                  assert: 'k = update({"n": 3}, set(), 0.1)\nassert k.get("n") == 3, f\'n must stay 3, now: {k.get("n")}\'',
                },
                {
                  name: { en: 'n is capped at 10', id: 'n dibatasi sampai 10' },
                  assert: 'k = update({"n": 10}, {"right"}, 0.1)\nassert k.get("n") == 10, f\'n must not pass 10, now: {k.get("n")}\'',
                },
                {
                  name: { en: 'draw shows n as text', id: 'draw menampilkan n sebagai teks' },
                  assert:
                    'a = draw({"n": 7})\nassert len(a) == 1 and a[0].get("shape") == "text", f"must be exactly one text command, now: {a}"\nassert a[0].get("text") == "7", f\'the text must be "7", now: {a[0].get("text")}\'',
                },
              ],
              hints: [
                { en: 'state["n"] = min(10, state["n"] + 1) inside the "right" branch.', id: 'state["n"] = min(10, state["n"] + 1) di dalam cabang "kanan".' },
                { en: "draw's text must be a string: str(n), not n by itself.", id: 'Teks pada draw harus string: str(n), bukan n begitu saja.' },
              ],
              solution:
                'def start():\n    return {"n": 3}\n\ndef update(state, keys, dt):\n    if "right" in keys:\n        state = dict(state)\n        state["n"] = min(10, state["n"] + 1)\n    return state\n\ndef draw(state):\n    return [{"shape": "text", "x": 10, "y": 10, "text": str(state["n"]), "size": 12}]',
            },
          ],
        },
        {
          id: 'pymed-m4-s1-l2',
          title: { en: 'Drawing a Fraction as a Divided Bar', id: 'Menggambar Pecahan sebagai Kotak Terbagi' },
          goal: { en: 'Colour part of a bar to show a fraction.', id: 'Mewarnai sebagian batang untuk menunjukkan sebuah pecahan.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A bar, cut into equal segments', id: 'Batang, dipotong jadi segmen sama besar' },
              body: {
                en: 'denominator segments, each 20 pixels wide, laid side by side starting at x=40 — segment `i` sits at `x = 40 + i * 20`. Whether it counts as filled depends only on whether its index is less than numerator.',
                id: 'penyebut segmen, masing-masing lebar 20 piksel, berjajar mulai dari x=40 — segmen ke-`i` berada di `x = 40 + i * 20`. Apakah ia terisi hanya bergantung pada apakah indeksnya kurang dari pembilang.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Two colours, one loop', id: 'Dua warna, satu perulangan' },
              body: {
                en: 'The same loop draws every segment; only the colour changes, chosen by a small if/else based on the index. The result is a bar where exactly `numerator` out of `denominator` segments stand out.',
                id: 'Perulangan yang sama menggambar tiap segmen; hanya warnanya yang berubah, dipilih lewat if/else kecil berdasarkan indeksnya. Hasilnya batang yang tepat `pembilang` dari `penyebut` segmennya menonjol.',
              },
              code:
                'def draw(state):\n    numerator, denominator = state["numerator"], state["denominator"]\n    commands = []\n    for i in range(denominator):\n        color = "#437649" if i < numerator else "#e5e5e5"\n        commands.append({"shape": "box", "x": 40 + i * 20, "y": 100, "w": 18, "h": 30, "color": color})\n    return commands\n\nresult = draw({"numerator": 2, "denominator": 4})\nprint(len(result))\nprint([p["color"] for p in result])',
              output: "4\n['#437649', '#437649', '#e5e5e5', '#e5e5e5']",
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'numerator=0, denominator=5. How many segments come out coloured "#437649"?',
                id: 'pembilang=0, penyebut=5. Berapa segmen yang berwarna "#437649"?',
              },
              options: [
                { en: '0', id: '0' },
                { en: '5', id: '5' },
                { en: '1', id: '1' },
                { en: 'It raises an error', id: 'Melempar galat' },
              ],
              answer: 0,
              explain: {
                en: 'i < numerator is i < 0, which is never true for i starting at 0 — no segment qualifies.',
                id: 'i < pembilang adalah i < 0, yang tak pernah benar untuk i yang mulai dari 0 — tak ada segmen yang memenuhi.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the check deciding whether segment i is filled.',
                id: 'Lengkapi pemeriksaan yang menentukan apakah segmen i terisi.',
              },
              template: 'numerator = 3\ni = 2\nfilled = i ___ numerator\nprint(filled)',
              blanks: ['<'],
              explain: {
                en: 'Segments 0, 1, and 2 are the first three — indices strictly less than numerator.',
                id: 'Segmen 0, 1, dan 2 adalah tiga yang pertama — indeks yang secara tegas kurang dari pembilang.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a loop drawing 3 segments, the first 2 filled.',
                id: 'Susun perulangan yang menggambar 3 segmen, 2 pertama terisi.',
              },
              lines: [
                'commands = []',
                'for i in range(3):',
                '    color = "#437649" if i < 2 else "#e5e5e5"',
                '    commands.append({"shape": "box", "x": 40 + i * 20, "y": 100, "w": 18, "h": 30, "color": color})',
              ],
              explain: {
                en: 'The empty list has to exist before the loop can append to it, same as every other loop-building exercise so far.',
                id: 'List kosongnya harus ada sebelum perulangannya bisa menambahkan ke situ, sama seperti tiap latihan membangun-lewat-perulangan sejauh ini.',
              },
            },
            {
              kind: 'game',
              id: 'k1',
              prompt: {
                en: 'The state holds `numerator` and `denominator`. Write `start()` returning `{"numerator": 1, "denominator": 4}`. Write `draw` drawing `denominator` segments exactly as the concept above. Write `update` returning the state unchanged.',
                id: 'Keadaannya menyimpan `numerator` dan `denominator`. Tulis `start()` yang mengembalikan `{"numerator": 1, "denominator": 4}`. Tulis `draw` yang menggambar `denominator` segmen persis seperti konsep di atas. Tulis `update` yang mengembalikan keadaannya tanpa perubahan.',
              },
              starter:
                'def start():\n    return {}\n\ndef update(state, keys, dt):\n    return state\n\ndef draw(state):\n    return []\n',
              tests: [
                {
                  name: { en: 'start() starts at 1/4', id: 'start() mulai di 1/4' },
                  assert: 'k = start()\nassert k.get("numerator") == 1 and k.get("denominator") == 4, f"start() is wrong: {k}"',
                },
                {
                  name: { en: 'denominator segments come out', id: 'segmennya sejumlah penyebut' },
                  assert: 'a = draw({"numerator": 1, "denominator": 4})\nassert len(a) == 4, f"must be 4 segments, now: {len(a)}"',
                },
                {
                  name: { en: 'exactly numerator are filled', id: 'tepat pembilang yang terisi' },
                  assert:
                    'a = draw({"numerator": 2, "denominator": 5})\nfilled = sum(1 for p in a if p.get("color") == "#437649")\nassert filled == 2, f"must be 2 filled segments, now: {filled}"\nassert len(a) == 5, f"must be 5 segments total, now: {len(a)}"',
                },
                {
                  name: { en: 'zero filled colours nothing', id: 'nol terisi tak mewarnai apa pun' },
                  assert:
                    'a = draw({"numerator": 0, "denominator": 3})\nfilled = sum(1 for p in a if p.get("color") == "#437649")\nassert filled == 0, f"nothing must be filled, now: {filled}"',
                },
                {
                  name: { en: 'segments sit side by side', id: 'segmennya berjajar' },
                  assert:
                    'a = draw({"numerator": 1, "denominator": 3})\nxs = sorted(p.get("x") for p in a)\nassert xs == [40, 60, 80], f"the segment positions are wrong, expected [40, 60, 80]: {xs}"',
                },
                {
                  name: { en: 'nothing moves', id: 'tak ada yang bergerak' },
                  assert: 'k = update({"numerator": 1, "denominator": 4}, set(), 0.2)\nassert k.get("numerator") == 1 and k.get("denominator") == 4, "nothing moves yet in this lesson"',
                },
              ],
              hints: [
                { en: 'One loop over range(denominator), colour decided by i < numerator.', id: 'Satu perulangan atas range(denominator), warnanya ditentukan oleh i < numerator.' },
              ],
              solution:
                'def start():\n    return {"numerator": 1, "denominator": 4}\n\ndef update(state, keys, dt):\n    return state\n\ndef draw(state):\n    numerator, denominator = state["numerator"], state["denominator"]\n    commands = []\n    for i in range(denominator):\n        color = "#437649" if i < numerator else "#e5e5e5"\n        commands.append({"shape": "box", "x": 40 + i * 20, "y": 100, "w": 18, "h": 30, "color": color})\n    return commands',
            },
          ],
        },
      ],
      project: {
        id: 'pymed-m4-s1-p',
        title: { en: 'Interactive Fraction Visualizer', id: 'Peraga Pecahan Interaktif' },
        brief: {
          en: 'Combine both lessons: keys change numerator and denominator, and the divided bar always reflects the current fraction.',
          id: 'Gabungkan kedua pelajaran: tombol mengubah pembilang dan penyebut, dan batang terbaginya selalu mencerminkan pecahan saat ini.',
        },
        requirements: [
          { en: 'The state holds `numerator` and `denominator`. `start()` returns `{"numerator": 1, "denominator": 4}`.', id: 'Keadaannya menyimpan `numerator` dan `denominator`. `start()` mengembalikan `{"numerator": 1, "denominator": 4}`.' },
          { en: '"right" adds 1 to numerator, capped at denominator. "left" subtracts 1, floored at 0.', id: '"kanan" menambah 1 ke pembilang, dengan batas atas penyebut. "kiri" mengurangi 1, dengan batas bawah 0.' },
          { en: '"up" adds 1 to denominator, capped at 12. "down" subtracts 1, floored at 1.', id: '"atas" menambah 1 ke penyebut, dengan batas atas 12. "bawah" mengurangi 1, dengan batas bawah 1.' },
          { en: 'draw draws denominator segments, the first numerator of them filled — the same shape as the lesson.', id: 'draw menggambar denominator segmen, numerator pertama di antaranya terisi — bentuk yang sama seperti di pelajaran.' },
        ],
        starter: 'def start():\n    return {}\n\ndef update(state, keys, dt):\n    return state\n\ndef draw(state):\n    return []\n',
        tests: [
          {
            name: { en: 'start() starts at 1/4', id: 'start() mulai di 1/4' },
            assert: 'k = start()\nassert k.get("numerator") == 1 and k.get("denominator") == 4, f"start() is wrong: {k}"',
          },
          {
            name: { en: 'right raises numerator', id: 'kanan menaikkan pembilang' },
            assert: 'k = update({"numerator": 1, "denominator": 4}, {"right"}, 0.1)\nassert k.get("numerator") == 2 and k.get("denominator") == 4, f"wrong: {k}"',
          },
          {
            name: { en: 'numerator is capped at denominator', id: 'pembilang dibatasi sampai penyebut' },
            assert: 'k = update({"numerator": 4, "denominator": 4}, {"right"}, 0.1)\nassert k.get("numerator") == 4, f"numerator must not pass denominator, now: {k.get(\'numerator\')}"',
          },
          {
            name: { en: 'left lowers numerator, floored at 0', id: 'kiri menurunkan pembilang, batas bawah 0' },
            assert:
              'k = update({"numerator": 0, "denominator": 4}, {"left"}, 0.1)\nassert k.get("numerator") == 0, f"numerator must not go negative, now: {k.get(\'numerator\')}"\nk2 = update({"numerator": 2, "denominator": 4}, {"left"}, 0.1)\nassert k2.get("numerator") == 1, f"wrong: {k2}"',
          },
          {
            name: { en: 'up raises denominator, capped at 12', id: 'atas menaikkan penyebut, batas atas 12' },
            assert:
              'k = update({"numerator": 1, "denominator": 4}, {"up"}, 0.1)\nassert k.get("denominator") == 5, f"wrong: {k}"\nk2 = update({"numerator": 1, "denominator": 12}, {"up"}, 0.1)\nassert k2.get("denominator") == 12, f"denominator must not pass 12, now: {k2.get(\'denominator\')}"',
          },
          {
            name: { en: 'down lowers denominator, floored at 1', id: 'bawah menurunkan penyebut, batas bawah 1' },
            assert: 'k = update({"numerator": 1, "denominator": 1}, {"down"}, 0.1)\nassert k.get("denominator") == 1, f"denominator must not go below 1, now: {k.get(\'denominator\')}"',
          },
          {
            name: { en: 'draw reflects the current fraction', id: 'gambar mencerminkan pecahan saat ini' },
            assert:
              'a = draw({"numerator": 3, "denominator": 5})\nassert len(a) == 5, f"must be 5 segments, now: {len(a)}"\nfilled = sum(1 for p in a if p.get("color") == "#437649")\nassert filled == 3, f"must be 3 filled segments, now: {filled}"',
          },
        ],
        hints: [
          { en: 'Four independent if-branches in update, one per key — reuse min/max from the lesson for each cap.', id: 'Empat cabang if independen di perbarui, satu per tombol — pakai ulang min/max dari pelajaran untuk tiap batasnya.' },
          { en: 'draw is exactly the loop from lesson 2, unchanged.', id: 'draw persis perulangan dari pelajaran 2, tanpa perubahan.' },
        ],
        solution:
          'def start():\n    return {"numerator": 1, "denominator": 4}\n\ndef update(state, keys, dt):\n    state = dict(state)\n    if "right" in keys:\n        state["numerator"] = min(state["denominator"], state["numerator"] + 1)\n    if "left" in keys:\n        state["numerator"] = max(0, state["numerator"] - 1)\n    if "up" in keys:\n        state["denominator"] = min(12, state["denominator"] + 1)\n    if "down" in keys:\n        state["denominator"] = max(1, state["denominator"] - 1)\n    return state\n\ndef draw(state):\n    numerator, denominator = state["numerator"], state["denominator"]\n    commands = []\n    for i in range(denominator):\n        color = "#437649" if i < numerator else "#e5e5e5"\n        commands.append({"shape": "box", "x": 40 + i * 20, "y": 100, "w": 18, "h": 30, "color": color})\n    return commands',
        xp: 50,
      },
    },

    /* --------------------------------------------------- 4.2 linear function */
    {
      id: 'pymed-m4-s2',
      title: { en: 'Linear Function Plot', id: 'Grafik Fungsi Linear' },
      summary: {
        en: 'A handful of points, connected — and a key that tilts the whole line by changing one number.',
        id: 'Beberapa titik, dihubungkan — dan tombol yang memiringkan seluruh garisnya dengan mengubah satu angka.',
      },
      lessons: [
        {
          id: 'pymed-m4-s2-l1',
          title: { en: 'Drawing a Function as Connected Lines', id: 'Menggambar Fungsi sebagai Rangkaian Garis' },
          goal: { en: 'Convert math coordinates to screen coordinates, then connect the dots.', id: 'Mengubah koordinat matematis ke koordinat layar, lalu menghubungkan titik-titiknya.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Two coordinate systems, one formula each', id: 'Dua sistem koordinat, masing-masing satu formula' },
              body: {
                en: 'Math coordinates put (0, 0) at the centre, with y growing upward. Screen coordinates put (0, 0) at the top-left, with y growing downward. `screen_x = 160 + x * 20` and `screen_y = 120 - y * 20` convert one into the other — the minus sign is what flips y the right way.',
                id: 'Koordinat matematis menaruh (0, 0) di tengah, dengan y bertambah ke atas. Koordinat layar menaruh (0, 0) di kiri atas, dengan y bertambah ke bawah. `screen_x = 160 + x * 20` dan `screen_y = 120 - y * 20` mengubah satu ke yang lain — tanda minusnya itulah yang membalik y ke arah yang benar.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A few points, connected', id: 'Beberapa titik, dihubungkan' },
              body: {
                en: 'For `f(x) = m*x + c`, sampling just three x values and drawing a `line` between each consecutive pair already looks like a straight line — a straight function needs no more points than that to be exact.',
                id: 'Untuk `f(x) = m*x + c`, mencuplik tiga nilai x saja dan menggambar `line` antar tiap pasangan berurutan sudah terlihat seperti garis lurus — fungsi linear tak butuh titik lebih dari itu untuk tepat.',
              },
              code:
                'def draw(state):\n    m, c = state["m"], state["c"]\n    points_x = [-3, 0, 3]\n    points = []\n    for x in points_x:\n        y = m * x + c\n        points.append((160 + x * 20, 120 - y * 20))\n    commands = []\n    for i in range(len(points) - 1):\n        x1, y1 = points[i]\n        x2, y2 = points[i + 1]\n        commands.append({"shape": "line", "x1": x1, "y1": y1, "x2": x2, "y2": y2, "thickness": 2})\n    return commands\n\nprint(draw({"m": 1, "c": 0}))',
              output:
                "[{'shape': 'line', 'x1': 100, 'y1': 180, 'x2': 160, 'y2': 120, 'thickness': 2}, {'shape': 'line', 'x1': 160, 'y1': 120, 'x2': 220, 'y2': 60, 'thickness': 2}]",
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'With m=1, c=0, the point at math x=0 lands at screen (160, 120) — the exact centre. Why is that not a coincidence?',
                id: 'Dengan m=1, c=0, titik pada x matematis=0 mendarat di layar (160, 120) — tepat di tengah. Mengapa itu bukan kebetulan?',
              },
              options: [
                { en: 'f(0) = 0, and (0, 0) in math coordinates is exactly the screen\'s centre by the formula\'s design', id: 'f(0) = 0, dan (0, 0) dalam koordinat matematis persis pusat layar menurut rancangan formulanya' },
                { en: 'It only works for m=1', id: 'Hanya berlaku untuk m=1' },
                { en: 'It only works for c=0', id: 'Hanya berlaku untuk c=0' },
                { en: 'It is a coincidence', id: 'Itu memang kebetulan' },
              ],
              answer: 0,
              explain: {
                en: 'screen_x = 160 + 0*20 = 160 and screen_y = 120 - 0*20 = 120 for ANY line through the origin — the +160 and 120 in the formula are exactly what places math (0,0) at the screen\'s middle.',
                id: 'screen_x = 160 + 0*20 = 160 dan screen_y = 120 - 0*20 = 120 untuk garis MANA PUN yang melalui titik asal — +160 dan 120 pada formulanya itulah yang menaruh (0,0) matematis di tengah layar.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Convert a math y-coordinate to a screen y-coordinate.',
                id: 'Ubah koordinat y matematis ke koordinat y layar.',
              },
              template: 'y = 2\nscreen_y = 120 ___ y * 20',
              blanks: ['-'],
              explain: {
                en: 'Subtracting is what flips math\'s "up is positive" into the screen\'s "down is positive".',
                id: 'Mengurangi itulah yang membalik "atas itu positif" ala matematika menjadi "bawah itu positif" ala layar.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble the conversion of one math point (x=2, y=1) into screen coordinates.',
                id: 'Susun konversi satu titik matematis (x=2, y=1) ke koordinat layar.',
              },
              lines: ['x, y = 2, 1', 'screen_x = 160 + x * 20', 'screen_y = 120 - y * 20', 'point = (screen_x, screen_y)'],
              explain: {
                en: 'Both coordinates have to be converted before they can be paired into one screen point.',
                id: 'Kedua koordinatnya harus dikonversi dulu sebelum bisa dipasangkan jadi satu titik layar.',
              },
            },
            {
              kind: 'game',
              id: 'k1',
              prompt: {
                en: 'The state holds `m` and `c`. Write `start()` returning `{"m": 1, "c": 0}`. Write `draw` drawing the two connected line segments exactly as the concept above (sampling x = -3, 0, 3). Write `update` returning the state unchanged.',
                id: 'Keadaannya menyimpan `m` dan `c`. Tulis `start()` yang mengembalikan `{"m": 1, "c": 0}`. Tulis `draw` yang menggambar dua ruas garis tersambung persis seperti konsep di atas (mencuplik x = -3, 0, 3). Tulis `update` yang mengembalikan keadaannya tanpa perubahan.',
              },
              starter:
                'def start():\n    return {}\n\ndef update(state, keys, dt):\n    return state\n\ndef draw(state):\n    return []\n',
              tests: [
                {
                  name: { en: 'start() starts at m=1, c=0', id: 'start() mulai di m=1, c=0' },
                  assert: 'k = start()\nassert k.get("m") == 1 and k.get("c") == 0, f"start() is wrong: {k}"',
                },
                {
                  name: { en: 'exactly two line segments', id: 'tepat dua ruas garis' },
                  assert: 'a = draw({"m": 1, "c": 0})\nassert len(a) == 2, f"must be 2 line segments, now: {len(a)}"',
                },
                {
                  name: { en: 'passes through the screen centre for m=1, c=0', id: 'melewati pusat layar untuk m=1, c=0' },
                  assert:
                    'a = draw({"m": 1, "c": 0})\npoints = {(a[0]["x1"], a[0]["y1"]), (a[0]["x2"], a[0]["y2"]), (a[1]["x2"], a[1]["y2"])}\nassert (160, 120) in points, f"the line must pass through (160, 120), points present: {points}"',
                },
                {
                  name: { en: 'a different m changes the shape', id: 'm berbeda mengubah bentuknya' },
                  assert:
                    'a = draw({"m": 0, "c": 0})\npoints = {(a[0]["x1"], a[0]["y1"]), (a[0]["x2"], a[0]["y2"]), (a[1]["x2"], a[1]["y2"])}\nassert (100, 120) in points and (220, 120) in points, f"with m=0 the line must be flat at y=120, points present: {points}"',
                },
                {
                  name: { en: 'nothing moves', id: 'tak ada yang bergerak' },
                  assert: 'k = update({"m": 1, "c": 0}, set(), 0.3)\nassert k.get("m") == 1 and k.get("c") == 0, "nothing moves yet in this lesson"',
                },
              ],
              hints: [
                { en: 'Sample points_x = [-3, 0, 3], convert each to screen coordinates, then connect consecutive pairs.', id: 'Cuplik points_x = [-3, 0, 3], ubah tiap satu ke koordinat layar, lalu hubungkan tiap pasangan berurutan.' },
              ],
              solution:
                'def start():\n    return {"m": 1, "c": 0}\n\ndef update(state, keys, dt):\n    return state\n\ndef draw(state):\n    m, c = state["m"], state["c"]\n    points_x = [-3, 0, 3]\n    points = []\n    for x in points_x:\n        y = m * x + c\n        points.append((160 + x * 20, 120 - y * 20))\n    commands = []\n    for i in range(len(points) - 1):\n        x1, y1 = points[i]\n        x2, y2 = points[i + 1]\n        commands.append({"shape": "line", "x1": x1, "y1": y1, "x2": x2, "y2": y2, "thickness": 2})\n    return commands',
            },
          ],
        },
        {
          id: 'pymed-m4-s2-l2',
          title: { en: 'Changing the Slope With a Key', id: 'Mengubah Kemiringan dengan Tombol' },
          goal: { en: 'Let right and left tilt the line.', id: 'Biarkan kanan dan kiri memiringkan garisnya.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A key changes one number in the state', id: 'Tombol mengubah satu angka di keadaan' },
              body: {
                en: 'Nothing about drawing the line has to change — only `m` does, by a fixed step, whenever "right" or "left" is held. The very same draw() from the last lesson keeps working, because it always reads m fresh from the state.',
                id: 'Tak ada yang perlu berubah dari cara menggambar garisnya — hanya `m` yang berubah, sebesar langkah tetap, tiap kali "kanan" atau "kiri" ditekan. draw() yang persis sama dari pelajaran lalu tetap berjalan, karena ia selalu membaca m segar dari keadaan.',
              },
              code:
                'def update(state, keys, dt):\n    state = dict(state)\n    if "right" in keys:\n        state["m"] += 0.5\n    if "left" in keys:\n        state["m"] -= 0.5\n    return state\n\nprint(update({"m": 1, "c": 0}, {"right"}, 0.1))',
              output: "{'m': 1.5, 'c': 0}",
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Two keys, two directions, one variable', id: 'Dua tombol, dua arah, satu variabel' },
              body: {
                en: 'right and left each check independently — both can theoretically be held at once, in which case they cancel out, which is a perfectly reasonable thing for opposite keys to do.',
                id: 'kanan dan kiri masing-masing diperiksa secara independen — keduanya bisa saja ditekan bersamaan, yang membuat efeknya saling meniadakan, dan itu wajar saja untuk sepasang tombol yang berlawanan.',
              },
              code:
                'def update(state, keys, dt):\n    state = dict(state)\n    if "right" in keys:\n        state["m"] += 0.5\n    if "left" in keys:\n        state["m"] -= 0.5\n    return state\n\nprint(update({"m": 2, "c": 0}, {"right", "left"}, 0.1))',
              output: "{'m': 2.0, 'c': 0}",
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'm starts at 2 and "left" is held for one call to update. What is m afterward?',
                id: 'm mulai dari 2 dan "kiri" ditekan untuk satu pemanggilan perbarui. Berapa m setelahnya?',
              },
              options: [
                { en: '1.5', id: '1.5' },
                { en: '2.5', id: '2.5' },
                { en: '2', id: '2' },
                { en: '0', id: '0' },
              ],
              answer: 0,
              explain: {
                en: '"left" subtracts 0.5 — 2 minus 0.5 is 1.5.',
                id: '"kiri" mengurangi 0.5 — 2 dikurangi 0.5 adalah 1.5.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the check for the other direction.',
                id: 'Lengkapi pemeriksaan untuk arah satunya.',
              },
              template: 'state = {"m": 1}\nkeys = {"left"}\nif ___ in keys:\n    state["m"] -= 0.5\nprint(state)',
              blanks: ['"left"'],
              explain: {
                en: 'Decreasing is what "left" does, matching how it lowers x elsewhere in this course.',
                id: 'Mengurangi adalah yang dilakukan "kiri", selaras dengan bagaimana ia menurunkan x di tempat lain di kursus ini.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble an update that changes c instead of m, with up/down.',
                id: 'Susun perbarui yang mengubah c alih-alih m, dengan atas/bawah.',
              },
              lines: [
                'def update(state, keys, dt):',
                '    state = dict(state)',
                '    if "up" in keys:',
                '        state["c"] += 1',
                '    if "down" in keys:',
                '        state["c"] -= 1',
                '    return state',
              ],
              explain: {
                en: 'Same shape as the m version, with a different key pair and a different step size.',
                id: 'Bentuknya sama seperti versi m, dengan pasangan tombol dan besar langkah yang berbeda.',
              },
            },
            {
              kind: 'game',
              id: 'k1',
              prompt: {
                en: 'The state holds `m` and `c` as in the last lesson. Write `update` so "right" adds 0.5 to m and "left" subtracts 0.5 — nothing else changes. Reuse `start()` and `draw` from the last lesson unchanged.',
                id: 'Keadaannya menyimpan `m` dan `c` seperti pada pelajaran lalu. Tulis `update` sehingga "kanan" menambah 0.5 ke m dan "kiri" mengurangi 0.5 — selain itu tak berubah. Pakai ulang `start()` dan `draw` dari pelajaran lalu tanpa perubahan.',
              },
              starter:
                'def start():\n    return {"m": 1, "c": 0}\n\ndef update(state, keys, dt):\n    return state\n\ndef draw(state):\n    m, c = state["m"], state["c"]\n    points_x = [-3, 0, 3]\n    points = []\n    for x in points_x:\n        y = m * x + c\n        points.append((160 + x * 20, 120 - y * 20))\n    commands = []\n    for i in range(len(points) - 1):\n        x1, y1 = points[i]\n        x2, y2 = points[i + 1]\n        commands.append({"shape": "line", "x1": x1, "y1": y1, "x2": x2, "y2": y2, "thickness": 2})\n    return commands\n',
              tests: [
                {
                  name: { en: 'right raises m by 0.5', id: 'kanan menaikkan m sebesar 0.5' },
                  assert: 'k = update({"m": 1, "c": 0}, {"right"}, 0.1)\nassert abs(k.get("m") - 1.5) < 0.0001 and k.get("c") == 0, f"wrong: {k}"',
                },
                {
                  name: { en: 'left lowers m by 0.5', id: 'kiri menurunkan m sebesar 0.5' },
                  assert: 'k = update({"m": 1, "c": 0}, {"left"}, 0.1)\nassert abs(k.get("m") - 0.5) < 0.0001, f"wrong: {k}"',
                },
                {
                  name: { en: 'both at once cancel out', id: 'keduanya sekaligus saling meniadakan' },
                  assert: 'k = update({"m": 2, "c": 0}, {"right", "left"}, 0.1)\nassert abs(k.get("m") - 2) < 0.0001, f"wrong: {k}"',
                },
                {
                  name: { en: 'c is never touched by right/left', id: 'c tak pernah disentuh kanan/kiri' },
                  assert: 'k = update({"m": 1, "c": 3}, {"right"}, 0.1)\nassert k.get("c") == 3, f"c should not change, now: {k.get(\'c\')}"',
                },
                {
                  name: { en: 'the line still draws correctly afterward', id: 'garisnya tetap tergambar benar sesudahnya' },
                  assert:
                    'a = draw({"m": 0, "c": 0})\nassert len(a) == 2, f"draw should be unchanged from the last lesson, now: {len(a)}"',
                },
              ],
              hints: [
                { en: 'Two independent if-checks, exactly like the concept steps above.', id: 'Dua pemeriksaan if independen, persis seperti langkah konsep di atas.' },
              ],
              solution:
                'def start():\n    return {"m": 1, "c": 0}\n\ndef update(state, keys, dt):\n    state = dict(state)\n    if "right" in keys:\n        state["m"] += 0.5\n    if "left" in keys:\n        state["m"] -= 0.5\n    return state\n\ndef draw(state):\n    m, c = state["m"], state["c"]\n    points_x = [-3, 0, 3]\n    points = []\n    for x in points_x:\n        y = m * x + c\n        points.append((160 + x * 20, 120 - y * 20))\n    commands = []\n    for i in range(len(points) - 1):\n        x1, y1 = points[i]\n        x2, y2 = points[i + 1]\n        commands.append({"shape": "line", "x1": x1, "y1": y1, "x2": x2, "y2": y2, "thickness": 2})\n    return commands',
            },
          ],
        },
      ],
      project: {
        id: 'pymed-m4-s2-p',
        title: { en: 'Interactive Function Plot', id: 'Peraga Grafik Fungsi Interaktif' },
        brief: {
          en: 'Combine both lessons: right/left tilt the line, up/down shift it, and draw always reflects both.',
          id: 'Gabungkan kedua pelajaran: kanan/kiri memiringkan garisnya, atas/bawah menggesernya, dan gambar selalu mencerminkan keduanya.',
        },
        requirements: [
          { en: 'The state holds `m` and `c`. `start()` returns `{"m": 1, "c": 0}`.', id: 'Keadaannya menyimpan `m` dan `c`. `start()` mengembalikan `{"m": 1, "c": 0}`.' },
          { en: '"right" adds 0.5 to m, "left" subtracts 0.5.', id: '"kanan" menambah 0.5 ke m, "kiri" mengurangi 0.5.' },
          { en: '"up" adds 1 to c, "down" subtracts 1.', id: '"atas" menambah 1 ke c, "bawah" mengurangi 1.' },
          { en: 'draw draws the two connected line segments exactly as module 4\'s lessons (sampling x = -3, 0, 3).', id: 'draw menggambar dua ruas garis tersambung persis seperti pelajaran modul 4 (mencuplik x = -3, 0, 3).' },
        ],
        starter:
          'def start():\n    return {}\n\ndef update(state, keys, dt):\n    return state\n\ndef draw(state):\n    return []\n',
        tests: [
          {
            name: { en: 'start() starts at m=1, c=0', id: 'start() mulai di m=1, c=0' },
            assert: 'k = start()\nassert k.get("m") == 1 and k.get("c") == 0, f"start() is wrong: {k}"',
          },
          {
            name: { en: 'right raises m by 0.5', id: 'kanan menaikkan m sebesar 0.5' },
            assert: 'k = update({"m": 1, "c": 0}, {"right"}, 0.1)\nassert abs(k.get("m") - 1.5) < 0.0001 and k.get("c") == 0, f"wrong: {k}"',
          },
          {
            name: { en: 'left lowers m by 0.5', id: 'kiri menurunkan m sebesar 0.5' },
            assert: 'k = update({"m": 1, "c": 0}, {"left"}, 0.1)\nassert abs(k.get("m") - 0.5) < 0.0001, f"wrong: {k}"',
          },
          {
            name: { en: 'up raises c by 1', id: 'atas menaikkan c sebesar 1' },
            assert: 'k = update({"m": 1, "c": 0}, {"up"}, 0.1)\nassert k.get("c") == 1 and abs(k.get("m") - 1) < 0.0001, f"wrong: {k}"',
          },
          {
            name: { en: 'down lowers c by 1', id: 'bawah menurunkan c sebesar 1' },
            assert: 'k = update({"m": 1, "c": 0}, {"down"}, 0.1)\nassert k.get("c") == -1, f"wrong: {k}"',
          },
          {
            name: { en: 'm and c change independently, together', id: 'm dan c berubah independen, sekaligus' },
            assert:
              'k = update({"m": 1, "c": 0}, {"right", "up"}, 0.1)\nassert abs(k.get("m") - 1.5) < 0.0001 and k.get("c") == 1, f"wrong: {k}"',
          },
          {
            name: { en: 'draw reflects a shifted, tilted line', id: 'gambar mencerminkan garis yang bergeser dan miring' },
            assert:
              'a = draw({"m": 0, "c": 2})\nassert len(a) == 2, f"must be 2 line segments, now: {len(a)}"\npoints = {(a[0]["x1"], a[0]["y1"]), (a[0]["x2"], a[0]["y2"]), (a[1]["x2"], a[1]["y2"])}\nassert (160, 80) in points, f"with m=0, c=2, the line must pass through (160, 80), points present: {points}"',
          },
        ],
        hints: [
          { en: 'Four independent if-checks in update — two for m, two for c.', id: 'Empat pemeriksaan if independen di perbarui — dua untuk m, dua untuk c.' },
          { en: 'draw is unchanged from the lessons — it already reads both m and c from the state.', id: 'draw tak berubah dari pelajaran — ia sudah membaca m maupun c dari keadaan.' },
        ],
        solution:
          'def start():\n    return {"m": 1, "c": 0}\n\ndef update(state, keys, dt):\n    state = dict(state)\n    if "right" in keys:\n        state["m"] += 0.5\n    if "left" in keys:\n        state["m"] -= 0.5\n    if "up" in keys:\n        state["c"] += 1\n    if "down" in keys:\n        state["c"] -= 1\n    return state\n\ndef draw(state):\n    m, c = state["m"], state["c"]\n    points_x = [-3, 0, 3]\n    points = []\n    for x in points_x:\n        y = m * x + c\n        points.append((160 + x * 20, 120 - y * 20))\n    commands = []\n    for i in range(len(points) - 1):\n        x1, y1 = points[i]\n        x2, y2 = points[i + 1]\n        commands.append({"shape": "line", "x1": x1, "y1": y1, "x2": x2, "y2": y2, "thickness": 2})\n    return commands',
        xp: 50,
      },
    },
  ],
}
