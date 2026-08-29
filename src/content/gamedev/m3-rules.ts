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
                en: 'Subtract one from a counter and you have lives. The catch is that a collision is not an instant — a block overlapping the player stays overlapping for several frames, and at sixty frames a second an unguarded `nyawa - 1` empties three lives before the player\'s finger has left the key.',
                id: 'Kurangi satu dari sebuah penghitung dan kamu punya nyawa. Masalahnya, tabrakan bukan sekejap — balok yang bertumpang tindih dengan pemain tetap bertumpang tindih selama beberapa bingkai, dan pada enam puluh bingkai sedetik, `nyawa - 1` tanpa penjaga menghabiskan tiga nyawa sebelum jari pemainnya lepas dari tombol.',
              },
              code: {
                en: 'nyawa = max(0, nyawa - 1)   # never below zero',
                id: 'nyawa = max(0, nyawa - 1)   # tidak pernah di bawah nol',
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
                'kebal = max(0.0, keadaan["kebal"] - dt)\n\n' +
                'if kena and kebal <= 0:\n' +
                '    nyawa = max(0, nyawa - 1)\n' +
                '    kebal = 1.5',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Show it, or it looks like a bug', id: 'Tampakkan, atau ia terlihat seperti kutu' },
              body: {
                en: 'A player who is invulnerable and cannot tell will read it as the game failing to notice. Change the colour, or blink. The rule lives in `perbarui` and the sign of it lives in `gambar` — the state carries the fact, and both read it.',
                id: 'Pemain yang sedang kebal tanpa tahu akan membacanya sebagai game yang gagal menyadari. Ubah warnanya, atau buat berkedip. Aturannya tinggal di `perbarui` dan tandanya tinggal di `gambar` — keadaannya yang membawa faktanya, dan keduanya membacanya.',
              },
              code:
                'warna = "#f5c65b" if keadaan["kebal"] > 0 else "#24463d"',
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
              template: 'kebal = ___(0.0, keadaan["kebal"] ___ dt)',
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
                en: 'Blocks fall on a 16 by 16 player with 3 lives. A block that hits is removed; if the player is not already invulnerable it costs a life and grants 1.5 seconds of it. Lives never go below zero, and `gambar` shows the invulnerable player in `#f5c65b`.',
                id: 'Balok berjatuhan pada pemain 16 kali 16 bernyawa 3. Balok yang mengenai akan dibuang; kalau pemainnya belum kebal, itu berbiaya satu nyawa dan memberi kekebalan 1,5 detik. Nyawa tak pernah di bawah nol, dan `gambar` menampilkan pemain yang kebal dengan warna `#f5c65b`.',
              },
              starter:
                'TITIK_X = [30, 120, 210, 280, 70, 160]\n' +
                'LAJU = 190\n' +
                'JATUH = 120\n' +
                'JEDA = 0.6\n' +
                'SISI = 16\n' +
                'BALOK = 14\n' +
                'PEMAIN_Y = 210\n' +
                'KEBAL = 1.5\n' +
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
                '    return {"x": 152.0, "balok": [], "i": 0, "sisa": 0.0, "nyawa": 3, "kebal": 0.0}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    x = keadaan["x"]\n' +
                '    if "kiri" in tombol:\n' +
                '        x = x - LAJU * dt\n' +
                '    if "kanan" in tombol:\n' +
                '        x = x + LAJU * dt\n' +
                '    x = max(0, min(LEBAR - SISI, x))\n\n' +
                '    pemain = {"x": x, "y": PEMAIN_Y, "l": SISI, "t": SISI}\n' +
                '    tersisa = []\n' +
                '    for b in keadaan["balok"]:\n' +
                '        turun = {"x": b["x"], "y": b["y"] + JATUH * dt}\n' +
                '        kotak = {"x": turun["x"], "y": turun["y"], "l": BALOK, "t": BALOK}\n' +
                '        if not tabrakan(kotak, pemain) and turun["y"] <= TINGGI:\n' +
                '            tersisa.append(turun)\n\n' +
                '    i = keadaan["i"]\n' +
                '    sisa = keadaan["sisa"] - dt\n' +
                '    if sisa <= 0:\n' +
                '        tersisa = tersisa + [{"x": TITIK_X[i], "y": -float(BALOK)}]\n' +
                '        i = (i + 1) % len(TITIK_X)\n' +
                '        sisa = JEDA\n\n' +
                '    return {"x": x, "balok": tersisa, "i": i, "sisa": sisa, "nyawa": keadaan["nyawa"], "kebal": keadaan["kebal"]}\n\n' +
                'def gambar(keadaan):\n' +
                '    hasil = []\n' +
                '    for b in keadaan["balok"]:\n' +
                '        hasil.append({"bentuk": "kotak", "x": b["x"], "y": b["y"], "l": BALOK, "t": BALOK, "warna": "#ef8f70"})\n' +
                '    hasil.append({"bentuk": "kotak", "x": keadaan["x"], "y": PEMAIN_Y, "l": SISI, "t": SISI, "warna": "#24463d"})\n' +
                '    hasil.append({"bentuk": "teks", "x": 8, "y": 8, "isi": "Nyawa: " + str(keadaan["nyawa"]), "warna": "#24463d"})\n' +
                '    return hasil\n',
              tests: [
                {
                  name: { en: 'A hit costs a life and grants mercy', id: 'Benturan berbiaya satu nyawa dan memberi keringanan' },
                  assert:
                    'k = perbarui({"x": 152.0, "balok": [{"x": 152, "y": 205.0}], "i": 0, "sisa": 5.0, "nyawa": 3, "kebal": 0.0}, set(), 1 / 60)\n' +
                    'assert k["nyawa"] == 2, f"harus kehilangan satu nyawa, sekarang: {k[\'nyawa\']}"\n' +
                    'assert k["kebal"] > 1.0, f"kekebalannya harus menyala, sekarang: {k[\'kebal\']}"\n' +
                    'assert len(k["balok"]) == 0, "balok yang mengenai tetap harus dibuang"',
                },
                {
                  name: { en: 'The timer counts down', id: 'Pewaktunya menghitung mundur' },
                  assert:
                    'k = perbarui({"x": 0.0, "balok": [], "i": 0, "sisa": 5.0, "nyawa": 3, "kebal": 1.0}, set(), 0.25)\n' +
                    'assert abs(k["kebal"] - 0.75) < 1e-9, f"harus turun ke 0.75, sekarang: {k[\'kebal\']}"',
                },
                {
                  name: { en: 'It stops at zero', id: 'Ia berhenti di nol' },
                  assert:
                    'k = perbarui({"x": 0.0, "balok": [], "i": 0, "sisa": 5.0, "nyawa": 3, "kebal": 0.1}, set(), 0.5)\n' +
                    'assert k["kebal"] == 0, f"tidak boleh negatif, sekarang: {k[\'kebal\']}"',
                },
                {
                  name: { en: 'A hit while invulnerable is free', id: 'Terkena saat kebal itu gratis' },
                  assert:
                    'k = perbarui({"x": 152.0, "balok": [{"x": 152, "y": 205.0}], "i": 0, "sisa": 5.0, "nyawa": 3, "kebal": 1.0}, set(), 1 / 60)\n' +
                    'assert k["nyawa"] == 3, f"sedang kebal, nyawanya tidak boleh berkurang, sekarang: {k[\'nyawa\']}"\n' +
                    'assert len(k["balok"]) == 0, "baloknya tetap harus dibuang"\n' +
                    'assert k["kebal"] < 1.0, f"kekebalannya tetap harus meluruh, sekarang: {k[\'kebal\']}"',
                },
                {
                  name: { en: 'One block does not empty the bar', id: 'Satu balok tidak menghabiskan seluruh nyawanya' },
                  assert:
                    'k = {"x": 152.0, "balok": [{"x": 152, "y": 200.0}], "i": 0, "sisa": 5.0, "nyawa": 3, "kebal": 0.0}\n' +
                    'for _ in range(30):\n' +
                    '    k = perbarui(k, set(), 1 / 60)\n' +
                    'assert k["nyawa"] == 2, f"setengah detik menempel harus tetap satu nyawa, sekarang: {k[\'nyawa\']}"',
                },
                {
                  name: { en: 'Lives never go below zero', id: 'Nyawanya tak pernah di bawah nol' },
                  assert:
                    'k = perbarui({"x": 152.0, "balok": [{"x": 152, "y": 205.0}], "i": 0, "sisa": 5.0, "nyawa": 0, "kebal": 0.0}, set(), 1 / 60)\n' +
                    'assert k["nyawa"] == 0, f"tidak boleh negatif, sekarang: {k[\'nyawa\']}"',
                },
                {
                  name: { en: 'A block that misses is still swept up', id: 'Balok yang meleset tetap disapu' },
                  assert:
                    'k = perbarui({"x": 0.0, "balok": [{"x": 300, "y": 239.0}], "i": 0, "sisa": 5.0, "nyawa": 3, "kebal": 0.0}, set(), 0.5)\n' +
                    'assert len(k["balok"]) == 0, "yang lewat bawah harus dibuang"\n' +
                    'assert k["nyawa"] == 3, "dan tidak berbiaya apa pun"',
                },
                {
                  name: { en: 'Being invulnerable shows', id: 'Sedang kebal itu tampak' },
                  assert:
                    'biasa = gambar({"x": 152.0, "balok": [], "i": 0, "sisa": 5.0, "nyawa": 3, "kebal": 0.0})\n' +
                    'kebal = gambar({"x": 152.0, "balok": [], "i": 0, "sisa": 5.0, "nyawa": 3, "kebal": 1.0})\n' +
                    'warna_biasa = [p["warna"] for p in biasa if p["bentuk"] == "kotak"]\n' +
                    'warna_kebal = [p["warna"] for p in kebal if p["bentuk"] == "kotak"]\n' +
                    'assert "#f5c65b" in warna_kebal, f"pemain yang kebal harus digambar #f5c65b, sekarang: {warna_kebal}"\n' +
                    'assert "#f5c65b" not in warna_biasa, f"pemain biasa tidak boleh, sekarang: {warna_biasa}"',
                },
                {
                  name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
                  assert:
                    'k = {"x": 152.0, "balok": [], "i": 0, "sisa": 5.0, "nyawa": 3, "kebal": 1.0}\n' +
                    'salinan = dict(k)\n' +
                    'perbarui(k, set(), 0.1)\n' +
                    'assert k == salinan, f"perbarui tidak boleh mengubah keadaan yang diberikan, sekarang jadi: {k}"',
                },
              ],
              hints: [
                { en: 'Everything except the lives is already written. Count the timer down first, before you use it.', id: 'Semuanya kecuali nyawanya sudah tertulis. Hitung mundur pewaktunya dulu, sebelum kamu memakainya.' },
                { en: 'The loop already knows which blocks hit — that is the branch where the life goes.', id: 'Loop-nya sudah tahu balok mana yang mengenai — di cabang itulah nyawanya berkurang.' },
                { en: 'Only take a life when `kebal <= 0`, and set `kebal = KEBAL` at the same moment.', id: 'Hanya ambil nyawa ketika `kebal <= 0`, dan setel `kebal = KEBAL` di saat yang sama.' },
                { en: 'In `gambar`, pick the player colour from `keadaan["kebal"] > 0`.', id: 'Di `gambar`, pilih warna pemainnya dari `keadaan["kebal"] > 0`.' },
              ],
              solution:
                'TITIK_X = [30, 120, 210, 280, 70, 160]\n' +
                'LAJU = 190\n' +
                'JATUH = 120\n' +
                'JEDA = 0.6\n' +
                'SISI = 16\n' +
                'BALOK = 14\n' +
                'PEMAIN_Y = 210\n' +
                'KEBAL = 1.5\n' +
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
                '    return {"x": 152.0, "balok": [], "i": 0, "sisa": 0.0, "nyawa": 3, "kebal": 0.0}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    x = keadaan["x"]\n' +
                '    if "kiri" in tombol:\n' +
                '        x = x - LAJU * dt\n' +
                '    if "kanan" in tombol:\n' +
                '        x = x + LAJU * dt\n' +
                '    x = max(0, min(LEBAR - SISI, x))\n\n' +
                '    nyawa = keadaan["nyawa"]\n' +
                '    kebal = max(0.0, keadaan["kebal"] - dt)\n\n' +
                '    pemain = {"x": x, "y": PEMAIN_Y, "l": SISI, "t": SISI}\n' +
                '    tersisa = []\n' +
                '    for b in keadaan["balok"]:\n' +
                '        turun = {"x": b["x"], "y": b["y"] + JATUH * dt}\n' +
                '        kotak = {"x": turun["x"], "y": turun["y"], "l": BALOK, "t": BALOK}\n' +
                '        if tabrakan(kotak, pemain):\n' +
                '            if kebal <= 0:\n' +
                '                nyawa = max(0, nyawa - 1)\n' +
                '                kebal = KEBAL\n' +
                '        elif turun["y"] > TINGGI:\n' +
                '            pass\n' +
                '        else:\n' +
                '            tersisa.append(turun)\n\n' +
                '    i = keadaan["i"]\n' +
                '    sisa = keadaan["sisa"] - dt\n' +
                '    if sisa <= 0:\n' +
                '        tersisa = tersisa + [{"x": TITIK_X[i], "y": -float(BALOK)}]\n' +
                '        i = (i + 1) % len(TITIK_X)\n' +
                '        sisa = JEDA\n\n' +
                '    return {"x": x, "balok": tersisa, "i": i, "sisa": sisa, "nyawa": nyawa, "kebal": kebal}\n\n' +
                'def gambar(keadaan):\n' +
                '    hasil = []\n' +
                '    for b in keadaan["balok"]:\n' +
                '        hasil.append({"bentuk": "kotak", "x": b["x"], "y": b["y"], "l": BALOK, "t": BALOK, "warna": "#ef8f70"})\n' +
                '    warna = "#f5c65b" if keadaan["kebal"] > 0 else "#24463d"\n' +
                '    hasil.append({"bentuk": "kotak", "x": keadaan["x"], "y": PEMAIN_Y, "l": SISI, "t": SISI, "warna": warna})\n' +
                '    hasil.append({"bentuk": "teks", "x": 8, "y": 8, "isi": "Nyawa: " + str(keadaan["nyawa"]), "warna": "#24463d"})\n' +
                '    return hasil\n',
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
              code: 'waktu = keadaan["waktu"] + dt',
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
                  'def jeda(waktu):\n' +
                  '    return max(0.25, 0.9 - waktu * 0.02)\n\n' +
                  '# 0 seconds -> 0.9   10 seconds -> 0.7   40 seconds -> 0.25 (floor)',
                id:
                  'def jeda(waktu):\n' +
                  '    return max(0.25, 0.9 - waktu * 0.02)\n\n' +
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
              code: 'return max(0.25, 0.9 - waktu * 0.02)',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'With `max(0.25, 0.9 - waktu * 0.02)`, when does the interval stop shrinking?',
                id: 'Dengan `max(0.25, 0.9 - waktu * 0.02)`, kapan selangnya berhenti mengecil?',
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
                'waktu = keadaan["waktu"] + dt',
                'sisa = keadaan["sisa"] - dt',
                'if sisa <= 0:',
                '    balok = balok + [baru]',
                '    sisa = jeda(waktu)',
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
                en: 'Add a clock and a ramp. Write `jeda(waktu)` returning `0.9 - waktu * 0.02`, never below `0.25`, and use it when a block spawns. `gambar` shows the seconds as a whole number.',
                id: 'Tambahkan jam dan tanjakan. Tulis `jeda(waktu)` yang mengembalikan `0.9 - waktu * 0.02`, tak pernah di bawah `0.25`, dan pakai saat balok muncul. `gambar` menampilkan detiknya sebagai bilangan bulat.',
              },
              starter:
                'TITIK_X = [30, 120, 210, 280, 70, 160]\n' +
                'JATUH = 120\n' +
                'BALOK = 14\n' +
                'TINGGI = 240\n\n' +
                'def jeda(waktu):\n' +
                '    return 0.9\n\n' +
                'def awal():\n' +
                '    return {"balok": [], "i": 0, "sisa": 0.0, "waktu": 0.0}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    balok = [{"x": b["x"], "y": b["y"] + JATUH * dt} for b in keadaan["balok"]]\n' +
                '    balok = [b for b in balok if b["y"] <= TINGGI]\n\n' +
                '    waktu = keadaan["waktu"]\n' +
                '    i = keadaan["i"]\n' +
                '    sisa = keadaan["sisa"] - dt\n' +
                '    if sisa <= 0:\n' +
                '        balok = balok + [{"x": TITIK_X[i], "y": -float(BALOK)}]\n' +
                '        i = (i + 1) % len(TITIK_X)\n' +
                '        sisa = 0.9\n\n' +
                '    return {"balok": balok, "i": i, "sisa": sisa, "waktu": waktu}\n\n' +
                'def gambar(keadaan):\n' +
                '    hasil = []\n' +
                '    for b in keadaan["balok"]:\n' +
                '        hasil.append({"bentuk": "kotak", "x": b["x"], "y": b["y"], "l": BALOK, "t": BALOK, "warna": "#ef8f70"})\n' +
                '    hasil.append({"bentuk": "teks", "x": 8, "y": 8, "isi": "Detik: 0", "warna": "#24463d"})\n' +
                '    return hasil\n',
              tests: [
                {
                  name: { en: 'The ramp starts where it should', id: 'Tanjakannya mulai di tempat yang seharusnya' },
                  assert:
                    'assert abs(jeda(0) - 0.9) < 1e-9, f"jeda(0) harus 0.9, sekarang: {jeda(0)}"\n' +
                    'assert abs(jeda(10) - 0.7) < 1e-9, f"jeda(10) harus 0.7, sekarang: {jeda(10)}"\n' +
                    'assert abs(jeda(20) - 0.5) < 1e-9, f"jeda(20) harus 0.5, sekarang: {jeda(20)}"',
                },
                {
                  name: { en: 'And it has a floor', id: 'Dan ia punya lantai' },
                  assert:
                    'assert abs(jeda(60) - 0.25) < 1e-9, f"jeda(60) harus terkunci di 0.25, sekarang: {jeda(60)}"\n' +
                    'assert abs(jeda(1000) - 0.25) < 1e-9, f"jeda(1000) juga 0.25, sekarang: {jeda(1000)}"\n' +
                    'assert jeda(500) > 0, "selangnya tidak boleh nol atau negatif"',
                },
                {
                  name: { en: 'The clock runs', id: 'Jamnya berjalan' },
                  assert:
                    'k = perbarui({"balok": [], "i": 0, "sisa": 5.0, "waktu": 3.0}, set(), 0.25)\n' +
                    'assert abs(k["waktu"] - 3.25) < 1e-9, f"waktunya harus 3.25, sekarang: {k[\'waktu\']}"',
                },
                {
                  name: { en: 'Early on, blocks are rare', id: 'Di awal, baloknya jarang' },
                  assert:
                    'k = perbarui({"balok": [], "i": 0, "sisa": 0.0, "waktu": 0.0}, set(), 0.01)\n' +
                    'assert abs(k["sisa"] - 0.9) < 0.02, f"pada awal permainan pewaktunya harus disetel ke sekitar 0.9, sekarang: {k[\'sisa\']}"',
                },
                {
                  name: { en: 'Later, they are not', id: 'Nanti, tidak lagi' },
                  assert:
                    'k = perbarui({"balok": [], "i": 0, "sisa": 0.0, "waktu": 20.0}, set(), 0.01)\n' +
                    'assert abs(k["sisa"] - 0.5) < 0.02, f"setelah 20 detik harus disetel ke sekitar 0.5, sekarang: {k[\'sisa\']}"\n' +
                    'b = perbarui({"balok": [], "i": 0, "sisa": 0.0, "waktu": 100.0}, set(), 0.01)\n' +
                    'assert abs(b["sisa"] - 0.25) < 0.02, f"jauh di dalam permainan harus di lantainya, sekarang: {b[\'sisa\']}"',
                },
                {
                  name: { en: 'A long game really does speed up', id: 'Permainan panjang benar-benar makin cepat' },
                  assert:
                    '# sebuah kemunculan menyetel ulang pewaktunya ke atas; menghitung\n' +
                    '# panjang daftarnya akan meleset, karena di bingkai yang sama bisa\n' +
                    '# ada balok yang tersapu keluar.\n' +
                    'k = awal()\n' +
                    'awal_muncul = 0\n' +
                    'for _ in range(600):\n' +
                    '    sebelum = k["sisa"]\n' +
                    '    k = perbarui(k, set(), 1 / 60)\n' +
                    '    if k["sisa"] > sebelum:\n' +
                    '        awal_muncul += 1\n' +
                    'k = {**k, "waktu": 60.0}\n' +
                    'akhir_muncul = 0\n' +
                    'for _ in range(600):\n' +
                    '    sebelum = k["sisa"]\n' +
                    '    k = perbarui(k, set(), 1 / 60)\n' +
                    '    if k["sisa"] > sebelum:\n' +
                    '        akhir_muncul += 1\n' +
                    'assert akhir_muncul > awal_muncul, f"sepuluh detik terakhir harus memunculkan lebih banyak daripada sepuluh detik pertama, sekarang: {awal_muncul} lalu {akhir_muncul}"',
                },
                {
                  name: { en: 'The clock is on screen', id: 'Jamnya ada di layar' },
                  assert:
                    'a = gambar({"balok": [], "i": 0, "sisa": 5.0, "waktu": 7.4})\n' +
                    'teks = [p["isi"] for p in a if p["bentuk"] == "teks"]\n' +
                    'assert any("7" in t for t in teks), f"detiknya harus tampil sebagai 7, sekarang: {teks}"\n' +
                    'b = gambar({"balok": [], "i": 0, "sisa": 5.0, "waktu": 41.9})\n' +
                    'teks_b = [p["isi"] for p in b if p["bentuk"] == "teks"]\n' +
                    'assert any("41" in t for t in teks_b), f"41.9 detik harus tampil sebagai 41, sekarang: {teks_b}"',
                },
                {
                  name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
                  assert:
                    'k = {"balok": [], "i": 0, "sisa": 5.0, "waktu": 1.0}\n' +
                    'salinan = dict(k)\n' +
                    'perbarui(k, set(), 0.1)\n' +
                    'assert k == salinan, f"perbarui tidak boleh mengubah keadaan yang diberikan, sekarang jadi: {k}"',
                },
              ],
              hints: [
                { en: '`jeda` is one line: the ramp inside a `max` with the floor.', id: '`jeda` satu baris: tanjakannya di dalam `max` bersama lantainya.' },
                { en: 'Advance the clock before you use it to set the next interval.', id: 'Majukan jamnya sebelum kamu memakainya untuk menyetel selang berikutnya.' },
                { en: 'Whole seconds is `int(keadaan["waktu"])`, which throws the fraction away.', id: 'Detik bulat adalah `int(keadaan["waktu"])`, yang membuang pecahannya.' },
              ],
              solution:
                'TITIK_X = [30, 120, 210, 280, 70, 160]\n' +
                'JATUH = 120\n' +
                'BALOK = 14\n' +
                'TINGGI = 240\n' +
                'JEDA_AWAL = 0.9\n' +
                'JEDA_DASAR = 0.25\n' +
                'TANJAK = 0.02\n\n' +
                'def jeda(waktu):\n' +
                '    return max(JEDA_DASAR, JEDA_AWAL - waktu * TANJAK)\n\n' +
                'def awal():\n' +
                '    return {"balok": [], "i": 0, "sisa": 0.0, "waktu": 0.0}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    balok = [{"x": b["x"], "y": b["y"] + JATUH * dt} for b in keadaan["balok"]]\n' +
                '    balok = [b for b in balok if b["y"] <= TINGGI]\n\n' +
                '    waktu = keadaan["waktu"] + dt\n' +
                '    i = keadaan["i"]\n' +
                '    sisa = keadaan["sisa"] - dt\n' +
                '    if sisa <= 0:\n' +
                '        balok = balok + [{"x": TITIK_X[i], "y": -float(BALOK)}]\n' +
                '        i = (i + 1) % len(TITIK_X)\n' +
                '        sisa = jeda(waktu)\n\n' +
                '    return {"balok": balok, "i": i, "sisa": sisa, "waktu": waktu}\n\n' +
                'def gambar(keadaan):\n' +
                '    hasil = []\n' +
                '    for b in keadaan["balok"]:\n' +
                '        hasil.append({"bentuk": "kotak", "x": b["x"], "y": b["y"], "l": BALOK, "t": BALOK, "warna": "#ef8f70"})\n' +
                '    hasil.append({"bentuk": "teks", "x": 8, "y": 8, "isi": "Detik: " + str(int(keadaan["waktu"])), "warna": "#24463d"})\n' +
                '    return hasil\n',
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
          { en: '`awal()` returns `{"x": 152.0, "balok": [], "i": 0, "sisa": 0.0, "waktu": 0.0, "nyawa": 3, "kebal": 0.0}`.', id: '`awal()` mengembalikan `{"x": 152.0, "balok": [], "i": 0, "sisa": 0.0, "waktu": 0.0, "nyawa": 3, "kebal": 0.0}`.' },
          { en: '`jeda(waktu)` is `0.9 - waktu * 0.02`, never below `0.3`.', id: '`jeda(waktu)` adalah `0.9 - waktu * 0.02`, tak pernah di bawah `0.3`.' },
          { en: '`laju(waktu)` is `110 + waktu * 3`, never above `260` — the blocks fall faster as well as more often.', id: '`laju(waktu)` adalah `110 + waktu * 3`, tak pernah di atas `260` — baloknya jatuh lebih cepat sekaligus lebih sering.' },
          { en: 'The clock only runs while `nyawa` is above zero. When it reaches zero the game is over and nothing moves any more.', id: 'Jamnya hanya berjalan selagi `nyawa` di atas nol. Ketika ia mencapai nol permainannya usai dan tak ada lagi yang bergerak.' },
          { en: 'The player is 16 by 16 at y 210, moving at 190. Blocks are 14 by 14 and spawn at `TITIK_X[i]`.', id: 'Pemainnya 16 kali 16 di y 210, bergerak 190. Baloknya 14 kali 14 dan muncul di `TITIK_X[i]`.' },
          { en: 'A hit removes the block; if `kebal` is not running it costs a life and starts 1.5 seconds of it.', id: 'Benturan membuang baloknya; kalau `kebal` tidak sedang berjalan, itu berbiaya satu nyawa dan memulai 1,5 detiknya.' },
          { en: '`gambar` shows the seconds survived and the lives left, and shows the invulnerable player in `#f5c65b`.', id: '`gambar` menampilkan detik bertahan dan nyawa tersisa, serta menampilkan pemain yang kebal dengan `#f5c65b`.' },
        ],
        starter:
          'TITIK_X = [30, 120, 210, 280, 70, 160]\n' +
          'LAJU = 190\n' +
          'SISI = 16\n' +
          'BALOK = 14\n' +
          'PEMAIN_Y = 210\n' +
          'KEBAL = 1.5\n' +
          'LEBAR = 320\n' +
          'TINGGI = 240\n\n' +
          'def tabrakan(a, b):\n' +
          '    return (\n' +
          '        a["x"] < b["x"] + b["l"]\n' +
          '        and a["x"] + a["l"] > b["x"]\n' +
          '        and a["y"] < b["y"] + b["t"]\n' +
          '        and a["y"] + a["t"] > b["y"]\n' +
          '    )\n\n' +
          'def jeda(waktu):\n' +
          '    return 0.9\n\n' +
          'def laju(waktu):\n' +
          '    return 110\n\n' +
          'def awal():\n' +
          '    return {"x": 152.0, "balok": [], "i": 0, "sisa": 0.0, "waktu": 0.0, "nyawa": 3, "kebal": 0.0}\n\n' +
          'def perbarui(keadaan, tombol, dt):\n' +
          '    return keadaan\n\n' +
          'def gambar(keadaan):\n' +
          '    hasil = []\n' +
          '    for b in keadaan["balok"]:\n' +
          '        hasil.append({"bentuk": "kotak", "x": b["x"], "y": b["y"], "l": BALOK, "t": BALOK, "warna": "#ef8f70"})\n' +
          '    hasil.append({"bentuk": "kotak", "x": keadaan["x"], "y": PEMAIN_Y, "l": SISI, "t": SISI, "warna": "#24463d"})\n' +
          '    hasil.append({"bentuk": "teks", "x": 8, "y": 8, "isi": "Detik: 0  Nyawa: 3", "warna": "#24463d"})\n' +
          '    return hasil\n',
        tests: [
          {
            name: { en: 'Both ramps have the right shape', id: 'Kedua tanjakannya berbentuk benar' },
            assert:
              'assert abs(jeda(0) - 0.9) < 1e-9, f"jeda(0) harus 0.9, sekarang: {jeda(0)}"\n' +
              'assert abs(jeda(15) - 0.6) < 1e-9, f"jeda(15) harus 0.6, sekarang: {jeda(15)}"\n' +
              'assert abs(jeda(200) - 0.3) < 1e-9, f"jeda harus berlantai 0.3, sekarang: {jeda(200)}"\n' +
              'assert abs(laju(0) - 110) < 1e-9, f"laju(0) harus 110, sekarang: {laju(0)}"\n' +
              'assert abs(laju(20) - 170) < 1e-9, f"laju(20) harus 170, sekarang: {laju(20)}"\n' +
              'assert abs(laju(200) - 260) < 1e-9, f"laju harus berplafon 260, sekarang: {laju(200)}"',
          },
          {
            name: { en: 'The player moves and stays on the field', id: 'Pemainnya bergerak dan tetap di lapangan' },
            assert:
              'dasar = {"x": 100.0, "balok": [], "i": 0, "sisa": 5.0, "waktu": 0.0, "nyawa": 3, "kebal": 0.0}\n' +
              'k = perbarui(dict(dasar), {"kanan"}, 0.5)\n' +
              'assert abs(k["x"] - 195) < 1e-9, f"kanan setengah detik harus 195, sekarang: {k[\'x\']}"\n' +
              'b = perbarui({**dasar, "x": 300.0}, {"kanan"}, 1.0)\n' +
              'assert abs(b["x"] - 304) < 1e-9, f"harus terjepit di 304, sekarang: {b[\'x\']}"',
          },
          {
            name: { en: 'Blocks fall at the speed for the time', id: 'Balok jatuh pada kecepatan untuk waktunya' },
            assert:
              'k = perbarui({"x": 0.0, "balok": [{"x": 300, "y": 0.0}], "i": 0, "sisa": 5.0, "waktu": 0.0, "nyawa": 3, "kebal": 0.0}, set(), 0.5)\n' +
              '# jamnya maju lebih dulu, jadi kecepatannya laju(0.5), bukan laju(0)\n' +
              'assert abs(k["balok"][0]["y"] - 55.75) < 1e-9, f"pada detik 0 harus turun 55.75, sekarang: {k[\'balok\'][0][\'y\']}"\n' +
              'b = perbarui({"x": 0.0, "balok": [{"x": 300, "y": 0.0}], "i": 0, "sisa": 5.0, "waktu": 20.0, "nyawa": 3, "kebal": 0.0}, set(), 0.5)\n' +
              'assert abs(b["balok"][0]["y"] - 85.75) < 1e-9, f"pada detik 20 harus turun 85.75, sekarang: {b[\'balok\'][0][\'y\']}"',
          },
          {
            name: { en: 'A hit costs a life once', id: 'Benturan berbiaya satu nyawa, sekali' },
            assert:
              'k = {"x": 152.0, "balok": [{"x": 152, "y": 200.0}], "i": 0, "sisa": 5.0, "waktu": 0.0, "nyawa": 3, "kebal": 0.0}\n' +
              'for _ in range(30):\n' +
              '    k = perbarui(k, set(), 1 / 60)\n' +
              'assert k["nyawa"] == 2, f"setengah detik menempel harus satu nyawa saja, sekarang: {k[\'nyawa\']}"',
          },
          {
            name: { en: 'A hit while invulnerable is free', id: 'Terkena saat kebal itu gratis' },
            assert:
              'k = perbarui({"x": 152.0, "balok": [{"x": 152, "y": 205.0}], "i": 0, "sisa": 5.0, "waktu": 0.0, "nyawa": 3, "kebal": 1.0}, set(), 1 / 60)\n' +
              'assert k["nyawa"] == 3, f"sedang kebal, tidak boleh berkurang, sekarang: {k[\'nyawa\']}"\n' +
              'assert len(k["balok"]) == 0, "baloknya tetap dibuang"',
          },
          {
            name: { en: 'The clock runs while you are alive', id: 'Jamnya berjalan selagi kamu hidup' },
            assert:
              'k = perbarui({"x": 0.0, "balok": [], "i": 0, "sisa": 5.0, "waktu": 4.0, "nyawa": 3, "kebal": 0.0}, set(), 0.5)\n' +
              'assert abs(k["waktu"] - 4.5) < 1e-9, f"waktunya harus 4.5, sekarang: {k[\'waktu\']}"',
          },
          {
            name: { en: 'And stops when you are not', id: 'Dan berhenti ketika kamu tidak' },
            assert:
              'mati = {"x": 152.0, "balok": [{"x": 30, "y": 50.0}], "i": 0, "sisa": 0.0, "waktu": 12.0, "nyawa": 0, "kebal": 0.0}\n' +
              'k = perbarui(dict(mati), {"kanan"}, 0.5)\n' +
              'assert abs(k["waktu"] - 12.0) < 1e-9, f"jamnya harus berhenti, sekarang: {k[\'waktu\']}"\n' +
              'assert abs(k["balok"][0]["y"] - 50.0) < 1e-9, f"baloknya harus berhenti, sekarang: {k[\'balok\'][0][\'y\']}"\n' +
              'assert abs(k["x"] - 152.0) < 1e-9, f"pemainnya harus berhenti, sekarang: {k[\'x\']}"\n' +
              'assert len(k["balok"]) == 1, "dan tidak ada yang baru muncul"',
          },
          {
            name: { en: 'It really is survivable, and really does end', id: 'Ia sungguh bisa dilalui, dan sungguh berakhir' },
            assert:
              'k = awal()\n' +
              'for _ in range(600):\n' +
              '    k = perbarui(k, set(), 1 / 60)\n' +
              'assert k["waktu"] > 0, "jamnya harus sudah berjalan"\n' +
              'k = awal()\n' +
              'for _ in range(6000):\n' +
              '    k = perbarui(k, set(), 1 / 60)\n' +
              'assert k["nyawa"] == 0, f"berdiri diam selama 100 detik harus berakhir, sekarang nyawa: {k[\'nyawa\']}"',
          },
          {
            name: { en: 'The list never runs away', id: 'Daftarnya tak pernah lepas kendali' },
            assert:
              'k = awal()\n' +
              'for _ in range(3000):\n' +
              '    k = perbarui(k, {"kanan"} if (_ // 30) % 2 else {"kiri"}, 1 / 60)\n' +
              '    assert len(k["balok"]) < 20, f"daftarnya harus tetap kecil, sekarang: {len(k[\'balok\'])}"',
          },
          {
            name: { en: 'The score line reads right', id: 'Baris skornya terbaca benar' },
            assert:
              'a = gambar({"x": 152.0, "balok": [], "i": 0, "sisa": 5.0, "waktu": 12.7, "nyawa": 2, "kebal": 0.0})\n' +
              'teks = " ".join(p["isi"] for p in a if p["bentuk"] == "teks")\n' +
              'assert "12" in teks, f"detiknya harus tampil sebagai 12, sekarang: {teks}"\n' +
              'assert "2" in teks, f"nyawanya harus tampil, sekarang: {teks}"',
          },
          {
            name: { en: 'Being invulnerable shows', id: 'Sedang kebal itu tampak' },
            assert:
              'kebal = gambar({"x": 152.0, "balok": [], "i": 0, "sisa": 5.0, "waktu": 1.0, "nyawa": 2, "kebal": 1.0})\n' +
              'biasa = gambar({"x": 152.0, "balok": [], "i": 0, "sisa": 5.0, "waktu": 1.0, "nyawa": 2, "kebal": 0.0})\n' +
              'assert "#f5c65b" in [p.get("warna") for p in kebal], "pemain yang kebal harus #f5c65b"\n' +
              'assert "#f5c65b" not in [p.get("warna") for p in biasa], "pemain biasa tidak boleh"',
          },
          {
            name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
            assert:
              'asal = [{"x": 30, "y": 10.0}]\n' +
              'k = {"x": 152.0, "balok": asal, "i": 0, "sisa": 5.0, "waktu": 1.0, "nyawa": 3, "kebal": 0.0}\n' +
              'perbarui(k, {"kanan"}, 0.5)\n' +
              'assert asal[0]["y"] == 10.0, f"balok lamanya tidak boleh ikut bergerak, sekarang: {asal[0][\'y\']}"\n' +
              'assert k["x"] == 152.0 and k["waktu"] == 1.0, "keadaan yang diberikan tidak boleh berubah"',
          },
        ],
        hints: [
          { en: 'The two ramps are one line each, both with a bound — one `max`, one `min`.', id: 'Kedua tanjakannya masing-masing satu baris, keduanya berbatas — satu `max`, satu `min`.' },
          { en: 'Game over is one early return: if `nyawa` is 0, hand back the state unchanged and do nothing else.', id: 'Permainan usai adalah satu return lebih awal: kalau `nyawa` bernilai 0, kembalikan keadaannya apa adanya dan jangan lakukan apa pun lagi.' },
          { en: 'Everything else is the previous two lessons stitched together — the falling speed just comes from `laju(waktu)` now.', id: 'Sisanya adalah dua pelajaran sebelumnya yang dijahit — kecepatan jatuhnya kini sekadar datang dari `laju(waktu)`.' },
          { en: 'Advance the clock before you use it, so the speed and the interval both belong to this frame.', id: 'Majukan jamnya sebelum kamu memakainya, agar kecepatan dan selangnya sama-sama milik bingkai ini.' },
        ],
        solution:
          'TITIK_X = [30, 120, 210, 280, 70, 160]\n' +
          'LAJU = 190\n' +
          'SISI = 16\n' +
          'BALOK = 14\n' +
          'PEMAIN_Y = 210\n' +
          'KEBAL = 1.5\n' +
          'LEBAR = 320\n' +
          'TINGGI = 240\n\n' +
          'def tabrakan(a, b):\n' +
          '    return (\n' +
          '        a["x"] < b["x"] + b["l"]\n' +
          '        and a["x"] + a["l"] > b["x"]\n' +
          '        and a["y"] < b["y"] + b["t"]\n' +
          '        and a["y"] + a["t"] > b["y"]\n' +
          '    )\n\n' +
          'def jeda(waktu):\n' +
          '    return max(0.3, 0.9 - waktu * 0.02)\n\n' +
          'def laju(waktu):\n' +
          '    return min(260, 110 + waktu * 3)\n\n' +
          'def awal():\n' +
          '    return {"x": 152.0, "balok": [], "i": 0, "sisa": 0.0, "waktu": 0.0, "nyawa": 3, "kebal": 0.0}\n\n' +
          'def perbarui(keadaan, tombol, dt):\n' +
          '    if keadaan["nyawa"] <= 0:\n' +
          '        return keadaan\n\n' +
          '    waktu = keadaan["waktu"] + dt\n\n' +
          '    x = keadaan["x"]\n' +
          '    if "kiri" in tombol:\n' +
          '        x = x - LAJU * dt\n' +
          '    if "kanan" in tombol:\n' +
          '        x = x + LAJU * dt\n' +
          '    x = max(0, min(LEBAR - SISI, x))\n\n' +
          '    nyawa = keadaan["nyawa"]\n' +
          '    kebal = max(0.0, keadaan["kebal"] - dt)\n' +
          '    turun_laju = laju(waktu)\n\n' +
          '    pemain = {"x": x, "y": PEMAIN_Y, "l": SISI, "t": SISI}\n' +
          '    tersisa = []\n' +
          '    for b in keadaan["balok"]:\n' +
          '        turun = {"x": b["x"], "y": b["y"] + turun_laju * dt}\n' +
          '        kotak = {"x": turun["x"], "y": turun["y"], "l": BALOK, "t": BALOK}\n' +
          '        if tabrakan(kotak, pemain):\n' +
          '            if kebal <= 0:\n' +
          '                nyawa = max(0, nyawa - 1)\n' +
          '                kebal = KEBAL\n' +
          '        elif turun["y"] <= TINGGI:\n' +
          '            tersisa.append(turun)\n\n' +
          '    i = keadaan["i"]\n' +
          '    sisa = keadaan["sisa"] - dt\n' +
          '    if sisa <= 0:\n' +
          '        tersisa = tersisa + [{"x": TITIK_X[i], "y": -float(BALOK)}]\n' +
          '        i = (i + 1) % len(TITIK_X)\n' +
          '        sisa = jeda(waktu)\n\n' +
          '    return {\n' +
          '        "x": x,\n' +
          '        "balok": tersisa,\n' +
          '        "i": i,\n' +
          '        "sisa": sisa,\n' +
          '        "waktu": waktu,\n' +
          '        "nyawa": nyawa,\n' +
          '        "kebal": kebal,\n' +
          '    }\n\n' +
          'def gambar(keadaan):\n' +
          '    hasil = []\n' +
          '    for b in keadaan["balok"]:\n' +
          '        hasil.append({"bentuk": "kotak", "x": b["x"], "y": b["y"], "l": BALOK, "t": BALOK, "warna": "#ef8f70"})\n' +
          '    warna = "#f5c65b" if keadaan["kebal"] > 0 else "#24463d"\n' +
          '    hasil.append({"bentuk": "kotak", "x": keadaan["x"], "y": PEMAIN_Y, "l": SISI, "t": SISI, "warna": warna})\n' +
          '    hasil.append({\n' +
          '        "bentuk": "teks",\n' +
          '        "x": 8,\n' +
          '        "y": 8,\n' +
          '        "isi": "Detik: " + str(int(keadaan["waktu"])) + "  Nyawa: " + str(keadaan["nyawa"]),\n' +
          '        "warna": "#24463d",\n' +
          '    })\n' +
          '    return hasil\n',
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
                en: 'Games have a title screen, a game, and a game-over screen. That is one string in the state — `"siap"`, `"main"`, `"selesai"` — and a `perbarui` that starts by asking which one it is. No new machinery, and the rules for each phase stay separate instead of tangling.',
                id: 'Game punya layar judul, permainan, dan layar usai. Itu satu string di keadaannya — `"siap"`, `"main"`, `"selesai"` — dan sebuah `perbarui` yang mulai dengan menanyakan ia yang mana. Tanpa mesin baru, dan aturan tiap fasenya tetap terpisah alih-alih kusut.',
              },
              code:
                'def perbarui(keadaan, tombol, dt):\n' +
                '    if keadaan["fase"] == "siap":\n' +
                '        return tunggu(keadaan, tombol)\n' +
                '    if keadaan["fase"] == "selesai":\n' +
                '        return usai(keadaan, tombol)\n' +
                '    return main(keadaan, tombol, dt)',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A held key is not a press', id: 'Tombol yang ditahan bukan tekanan' },
              body: {
                en: 'Here is the problem `tombol` hands you: it is a snapshot, so "space is down" is true for every frame the finger rests there. Use it to start the game and the game restarts sixty times a second. What you want is the **moment** it went down: down now, and not down last frame.',
                id: 'Inilah masalah yang diberikan `tombol` kepadamu: ia potret sesaat, jadi "spasi sedang ditekan" bernilai benar di tiap bingkai selama jarinya di sana. Pakai itu untuk memulai permainan dan permainannya mulai ulang enam puluh kali sedetik. Yang kamu mau adalah **saat** ia turun: turun sekarang, dan tidak turun di bingkai lalu.',
              },
              code: {
                en:
                  'ditekan = "spasi" in tombol\n' +
                  'baru = ditekan and not keadaan["spasi_lalu"]\n\n' +
                  '# ...and save it for the next frame\n' +
                  'return {..., "spasi_lalu": ditekan}',
                id:
                  'ditekan = "spasi" in tombol\n' +
                  'baru = ditekan and not keadaan["spasi_lalu"]\n\n' +
                  '# ...dan simpan untuk bingkai berikutnya\n' +
                  'return {..., "spasi_lalu": ditekan}',
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Remember it every frame, not only when it matters', id: 'Ingat tiap bingkai, bukan hanya ketika ia berarti' },
              body: {
                en: 'The previous key state has to be written on every path out of `perbarui`, including the ones that do nothing else. Forget it in one branch and the game gets stuck: the flag says "still held" forever, and no press is ever seen again.',
                id: 'Keadaan tombol sebelumnya harus ditulis di tiap jalan keluar dari `perbarui`, termasuk jalan yang tak melakukan apa-apa lagi. Lupakan di satu cabang dan permainannya tersangkut: penanda itu menyatakan "masih ditahan" selamanya, dan tak ada tekanan yang terlihat lagi.',
              },
              code: {
                en: '# every branch returns a fresh spasi_lalu\nreturn {"fase": "main", ..., "spasi_lalu": ditekan}',
                id: '# tiap cabang mengembalikan spasi_lalu yang segar\nreturn {"fase": "main", ..., "spasi_lalu": ditekan}',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'You start the game on `"spasi" in tombol` with no memory. What happens when the player holds space?',
                id: 'Kamu memulai permainan pada `"spasi" in tombol` tanpa ingatan. Apa yang terjadi ketika pemain menahan spasi?',
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
                en: 'Three phases. In `"siap"` nothing moves and a space **press** starts a fresh game in `"main"`. In `"main"` the player dodges and the game ends at zero lives. In `"selesai"` nothing moves and a space press goes back to `"siap"`.',
                id: 'Tiga fase. Di `"siap"` tak ada yang bergerak dan **tekanan** spasi memulai permainan baru di `"main"`. Di `"main"` pemainnya menghindar dan permainannya berakhir saat nyawa nol. Di `"selesai"` tak ada yang bergerak dan tekanan spasi kembali ke `"siap"`.',
              },
              starter:
                'TITIK_X = [30, 120, 210, 280, 70, 160]\n' +
                'LAJU = 190\n' +
                'JATUH = 130\n' +
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
                'def segar(fase, spasi_lalu):\n' +
                '    return {\n' +
                '        "fase": fase,\n' +
                '        "x": 152.0,\n' +
                '        "balok": [],\n' +
                '        "i": 0,\n' +
                '        "sisa": 0.0,\n' +
                '        "nyawa": 3,\n' +
                '        "spasi_lalu": spasi_lalu,\n' +
                '    }\n\n' +
                'def awal():\n' +
                '    return segar("siap", False)\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    return keadaan\n\n' +
                'def gambar(keadaan):\n' +
                '    hasil = []\n' +
                '    for b in keadaan["balok"]:\n' +
                '        hasil.append({"bentuk": "kotak", "x": b["x"], "y": b["y"], "l": BALOK, "t": BALOK, "warna": "#ef8f70"})\n' +
                '    hasil.append({"bentuk": "kotak", "x": keadaan["x"], "y": PEMAIN_Y, "l": SISI, "t": SISI, "warna": "#24463d"})\n' +
                '    if keadaan["fase"] == "siap":\n' +
                '        hasil.append({"bentuk": "teks", "x": 90, "y": 110, "isi": "Spasi untuk mulai", "warna": "#24463d"})\n' +
                '    elif keadaan["fase"] == "selesai":\n' +
                '        hasil.append({"bentuk": "teks", "x": 110, "y": 110, "isi": "Habis!", "warna": "#ef8f70"})\n' +
                '    else:\n' +
                '        hasil.append({"bentuk": "teks", "x": 8, "y": 8, "isi": "Nyawa: " + str(keadaan["nyawa"]), "warna": "#24463d"})\n' +
                '    return hasil\n',
              tests: [
                {
                  name: { en: 'It waits to be started', id: 'Ia menunggu untuk dimulai' },
                  assert:
                    'k = awal()\n' +
                    'assert k["fase"] == "siap", f"harus mulai di fase siap, sekarang: {k[\'fase\']}"\n' +
                    'for _ in range(120):\n' +
                    '    k = perbarui(k, set(), 1 / 60)\n' +
                    'assert k["fase"] == "siap", "tanpa tombol harus tetap menunggu"\n' +
                    'assert len(k["balok"]) == 0, "dan tak ada yang muncul"',
                },
                {
                  name: { en: 'A press starts it', id: 'Tekanan memulainya' },
                  assert:
                    'k = perbarui(awal(), {"spasi"}, 1 / 60)\n' +
                    'assert k["fase"] == "main", f"harus masuk ke main, sekarang: {k[\'fase\']}"\n' +
                    'assert k["nyawa"] == 3, "dan permainannya segar"',
                },
                {
                  name: { en: 'Holding space does not restart it', id: 'Menahan spasi tidak mengulangnya' },
                  assert:
                    'k = perbarui(awal(), {"spasi"}, 1 / 60)\n' +
                    'for _ in range(120):\n' +
                    '    k = perbarui(k, {"spasi"}, 1 / 60)\n' +
                    'assert k["fase"] == "main", "harus tetap bermain"\n' +
                    'assert len(k["balok"]) > 0, "dan permainannya harus benar-benar berjalan, bukan mulai ulang terus"',
                },
                {
                  name: { en: 'Releasing and pressing again is a new press', id: 'Melepas lalu menekan lagi adalah tekanan baru' },
                  assert:
                    'k = {"fase": "selesai", "x": 152.0, "balok": [], "i": 0, "sisa": 0.0, "nyawa": 0, "spasi_lalu": True}\n' +
                    'k = perbarui(k, {"spasi"}, 1 / 60)\n' +
                    'assert k["fase"] == "selesai", "masih ditahan dari sebelumnya: belum boleh pindah"\n' +
                    'k = perbarui(k, set(), 1 / 60)\n' +
                    'k = perbarui(k, {"spasi"}, 1 / 60)\n' +
                    'assert k["fase"] == "siap", f"tekanan baru harus kembali ke siap, sekarang: {k[\'fase\']}"',
                },
                {
                  name: { en: 'Playing, it plays', id: 'Saat bermain, ia bermain' },
                  assert:
                    'k = {"fase": "main", "x": 100.0, "balok": [{"x": 30, "y": 0.0}], "i": 0, "sisa": 5.0, "nyawa": 3, "spasi_lalu": False}\n' +
                    'b = perbarui(k, {"kanan"}, 0.5)\n' +
                    'assert abs(b["x"] - 195) < 1e-9, f"pemainnya harus bergerak, sekarang: {b[\'x\']}"\n' +
                    'assert abs(b["balok"][0]["y"] - 65) < 1e-9, f"baloknya harus jatuh, sekarang: {b[\'balok\'][0][\'y\']}"',
                },
                {
                  name: { en: 'A hit costs a life', id: 'Benturan berbiaya satu nyawa' },
                  assert:
                    'k = {"fase": "main", "x": 152.0, "balok": [{"x": 152, "y": 205.0}], "i": 0, "sisa": 5.0, "nyawa": 3, "spasi_lalu": False}\n' +
                    'b = perbarui(k, set(), 1 / 60)\n' +
                    'assert b["nyawa"] == 2, f"harus kehilangan satu nyawa, sekarang: {b[\'nyawa\']}"\n' +
                    'assert len(b["balok"]) == 0, "balok yang mengenai harus dibuang"',
                },
                {
                  name: { en: 'The last life ends the game', id: 'Nyawa terakhir mengakhiri permainan' },
                  assert:
                    'k = {"fase": "main", "x": 152.0, "balok": [{"x": 152, "y": 205.0}], "i": 0, "sisa": 5.0, "nyawa": 1, "spasi_lalu": False}\n' +
                    'b = perbarui(k, set(), 1 / 60)\n' +
                    'assert b["nyawa"] == 0, f"nyawanya harus habis, sekarang: {b[\'nyawa\']}"\n' +
                    'assert b["fase"] == "selesai", f"fasenya harus selesai, sekarang: {b[\'fase\']}"',
                },
                {
                  name: { en: 'Finished, nothing moves', id: 'Setelah usai, tak ada yang bergerak' },
                  assert:
                    'k = {"fase": "selesai", "x": 152.0, "balok": [{"x": 30, "y": 50.0}], "i": 0, "sisa": 0.0, "nyawa": 0, "spasi_lalu": False}\n' +
                    'b = perbarui(k, {"kanan"}, 0.5)\n' +
                    'assert abs(b["x"] - 152.0) < 1e-9, "pemainnya harus diam"\n' +
                    'assert abs(b["balok"][0]["y"] - 50.0) < 1e-9, "baloknya harus diam"\n' +
                    'assert len(b["balok"]) == 1, "dan tak ada yang muncul"',
                },
                {
                  name: { en: 'The whole loop can be walked round', id: 'Seluruh lingkarannya bisa ditempuh' },
                  assert:
                    'k = awal()\n' +
                    'k = perbarui(k, {"spasi"}, 1 / 60)\n' +
                    'assert k["fase"] == "main"\n' +
                    'for _ in range(4000):\n' +
                    '    k = perbarui(k, set(), 1 / 60)\n' +
                    '    if k["fase"] == "selesai":\n' +
                    '        break\n' +
                    'assert k["fase"] == "selesai", "berdiri diam pada akhirnya harus berakhir"\n' +
                    'k = perbarui(k, {"spasi"}, 1 / 60)\n' +
                    'assert k["fase"] == "siap", "lalu spasi kembali ke layar mulai"\n' +
                    'k = perbarui(k, set(), 1 / 60)\n' +
                    'k = perbarui(k, {"spasi"}, 1 / 60)\n' +
                    'assert k["fase"] == "main" and k["nyawa"] == 3, "dan bisa dimainkan lagi dari awal"',
                },
                {
                  name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
                  assert:
                    'k = {"fase": "main", "x": 152.0, "balok": [], "i": 0, "sisa": 5.0, "nyawa": 3, "spasi_lalu": False}\n' +
                    'salinan = dict(k)\n' +
                    'perbarui(k, {"kanan"}, 0.1)\n' +
                    'assert k == salinan, f"perbarui tidak boleh mengubah keadaan yang diberikan, sekarang jadi: {k}"',
                },
              ],
              hints: [
                { en: '`segar` already builds a whole new game for you — starting is `segar("main", ditekan)`.', id: '`segar` sudah membangun permainan baru untukmu — memulai berarti `segar("main", ditekan)`.' },
                { en: 'Work out `ditekan` and `baru` once, at the top, before the phases split.', id: 'Hitung `ditekan` dan `baru` sekali, di atas, sebelum fasenya bercabang.' },
                { en: 'Every branch has to return `"spasi_lalu": ditekan`, including the ones that change nothing else.', id: 'Tiap cabang harus mengembalikan `"spasi_lalu": ditekan`, termasuk cabang yang tak mengubah apa pun lagi.' },
                { en: 'The playing branch is the module 2 dodge, plus one line: if the lives hit zero, the phase becomes `"selesai"`.', id: 'Cabang bermainnya adalah permainan hindar modul 2, ditambah satu baris: kalau nyawanya nol, fasenya jadi `"selesai"`.' },
              ],
              solution:
                'TITIK_X = [30, 120, 210, 280, 70, 160]\n' +
                'LAJU = 190\n' +
                'JATUH = 130\n' +
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
                'def segar(fase, spasi_lalu):\n' +
                '    return {\n' +
                '        "fase": fase,\n' +
                '        "x": 152.0,\n' +
                '        "balok": [],\n' +
                '        "i": 0,\n' +
                '        "sisa": 0.0,\n' +
                '        "nyawa": 3,\n' +
                '        "spasi_lalu": spasi_lalu,\n' +
                '    }\n\n' +
                'def awal():\n' +
                '    return segar("siap", False)\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    ditekan = "spasi" in tombol\n' +
                '    baru = ditekan and not keadaan["spasi_lalu"]\n\n' +
                '    if keadaan["fase"] == "siap":\n' +
                '        if baru:\n' +
                '            return segar("main", ditekan)\n' +
                '        return {**keadaan, "spasi_lalu": ditekan}\n\n' +
                '    if keadaan["fase"] == "selesai":\n' +
                '        if baru:\n' +
                '            return segar("siap", ditekan)\n' +
                '        return {**keadaan, "spasi_lalu": ditekan}\n\n' +
                '    x = keadaan["x"]\n' +
                '    if "kiri" in tombol:\n' +
                '        x = x - LAJU * dt\n' +
                '    if "kanan" in tombol:\n' +
                '        x = x + LAJU * dt\n' +
                '    x = max(0, min(LEBAR - SISI, x))\n\n' +
                '    nyawa = keadaan["nyawa"]\n' +
                '    pemain = {"x": x, "y": PEMAIN_Y, "l": SISI, "t": SISI}\n' +
                '    tersisa = []\n' +
                '    for b in keadaan["balok"]:\n' +
                '        turun = {"x": b["x"], "y": b["y"] + JATUH * dt}\n' +
                '        kotak = {"x": turun["x"], "y": turun["y"], "l": BALOK, "t": BALOK}\n' +
                '        if tabrakan(kotak, pemain):\n' +
                '            nyawa = max(0, nyawa - 1)\n' +
                '        elif turun["y"] <= TINGGI:\n' +
                '            tersisa.append(turun)\n\n' +
                '    i = keadaan["i"]\n' +
                '    sisa = keadaan["sisa"] - dt\n' +
                '    if sisa <= 0:\n' +
                '        tersisa = tersisa + [{"x": TITIK_X[i], "y": -float(BALOK)}]\n' +
                '        i = (i + 1) % len(TITIK_X)\n' +
                '        sisa = JEDA\n\n' +
                '    fase = "selesai" if nyawa <= 0 else "main"\n\n' +
                '    return {\n' +
                '        "fase": fase,\n' +
                '        "x": x,\n' +
                '        "balok": tersisa,\n' +
                '        "i": i,\n' +
                '        "sisa": sisa,\n' +
                '        "nyawa": nyawa,\n' +
                '        "spasi_lalu": ditekan,\n' +
                '    }\n\n' +
                'def gambar(keadaan):\n' +
                '    hasil = []\n' +
                '    for b in keadaan["balok"]:\n' +
                '        hasil.append({"bentuk": "kotak", "x": b["x"], "y": b["y"], "l": BALOK, "t": BALOK, "warna": "#ef8f70"})\n' +
                '    hasil.append({"bentuk": "kotak", "x": keadaan["x"], "y": PEMAIN_Y, "l": SISI, "t": SISI, "warna": "#24463d"})\n' +
                '    if keadaan["fase"] == "siap":\n' +
                '        hasil.append({"bentuk": "teks", "x": 90, "y": 110, "isi": "Spasi untuk mulai", "warna": "#24463d"})\n' +
                '    elif keadaan["fase"] == "selesai":\n' +
                '        hasil.append({"bentuk": "teks", "x": 110, "y": 110, "isi": "Habis!", "warna": "#ef8f70"})\n' +
                '    else:\n' +
                '        hasil.append({"bentuk": "teks", "x": 8, "y": 8, "isi": "Nyawa: " + str(keadaan["nyawa"]), "warna": "#24463d"})\n' +
                '    return hasil\n',
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
                'def tingkat(skor):\n' +
                '    return 1 + skor // 5\n\n' +
                '# skor 0..4 -> tingkat 1, skor 5..9 -> tingkat 2',
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
                'def laju(skor):\n' +
                '    return min(300, 100 + tingkat(skor) * 25)\n\n' +
                'def jeda(skor):\n' +
                '    return max(0.3, 1.0 - tingkat(skor) * 0.08)',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'With `1 + skor // 5`, what level is a score of 5?',
                id: 'Dengan `1 + skor // 5`, skor 5 berada di tingkat berapa?',
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
              template: 'def tingkat(skor):\n    return ___ + skor ___ 4',
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
                en: 'Catch the falling items. Write `tingkat(skor)` as `1 + skor // 5`, `laju(skor)` as `100 + tingkat * 25` capped at 300, and `jeda(skor)` as `1.0 - tingkat * 0.08` floored at 0.3. Each catch is a point.',
                id: 'Tangkap benda yang jatuh. Tulis `tingkat(skor)` sebagai `1 + skor // 5`, `laju(skor)` sebagai `100 + tingkat * 25` berplafon 300, dan `jeda(skor)` sebagai `1.0 - tingkat * 0.08` berlantai 0,3. Tiap tangkapan bernilai satu poin.',
              },
              starter:
                'TITIK_X = [40, 160, 280, 100, 220]\n' +
                'LAJU = 200\n' +
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
                'def tingkat(skor):\n' +
                '    return 1\n\n' +
                'def laju(skor):\n' +
                '    return 100\n\n' +
                'def jeda(skor):\n' +
                '    return 1.0\n\n' +
                'def awal():\n' +
                '    return {"px": 130.0, "y": -12.0, "i": 0, "skor": 0}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    px = keadaan["px"]\n' +
                '    if "kiri" in tombol:\n' +
                '        px = px - LAJU * dt\n' +
                '    if "kanan" in tombol:\n' +
                '        px = px + LAJU * dt\n' +
                '    px = max(0, min(LEBAR - PAPAN_L, px))\n\n' +
                '    skor = keadaan["skor"]\n' +
                '    y = keadaan["y"] + 100 * dt\n' +
                '    i = keadaan["i"]\n\n' +
                '    benda = {"x": TITIK_X[i], "y": y, "l": BENDA, "t": BENDA}\n' +
                '    papan = {"x": px, "y": PAPAN_Y, "l": PAPAN_L, "t": PAPAN_T}\n' +
                '    if tabrakan(benda, papan):\n' +
                '        skor = skor + 1\n' +
                '        y = -12.0\n' +
                '        i = (i + 1) % len(TITIK_X)\n' +
                '    elif y > TINGGI:\n' +
                '        y = -12.0\n' +
                '        i = (i + 1) % len(TITIK_X)\n\n' +
                '    return {"px": px, "y": y, "i": i, "skor": skor}\n\n' +
                'def gambar(keadaan):\n' +
                '    return [\n' +
                '        {"bentuk": "kotak", "x": TITIK_X[keadaan["i"]], "y": keadaan["y"], "l": BENDA, "t": BENDA, "warna": "#f5c65b"},\n' +
                '        {"bentuk": "kotak", "x": keadaan["px"], "y": PAPAN_Y, "l": PAPAN_L, "t": PAPAN_T, "warna": "#24463d"},\n' +
                '        {"bentuk": "teks", "x": 8, "y": 8, "isi": "Skor: " + str(keadaan["skor"]) + "  Tingkat: 1", "warna": "#24463d"},\n' +
                '    ]\n',
              tests: [
                {
                  name: { en: 'The level bands are right', id: 'Rentang tingkatnya benar' },
                  assert:
                    'assert tingkat(0) == 1, f"skor 0 harus tingkat 1, sekarang: {tingkat(0)}"\n' +
                    'assert tingkat(4) == 1, f"skor 4 masih tingkat 1, sekarang: {tingkat(4)}"\n' +
                    'assert tingkat(5) == 2, f"skor 5 harus tingkat 2, sekarang: {tingkat(5)}"\n' +
                    'assert tingkat(14) == 3, f"skor 14 harus tingkat 3, sekarang: {tingkat(14)}"\n' +
                    'assert tingkat(15) == 4, f"skor 15 harus tingkat 4, sekarang: {tingkat(15)}"',
                },
                {
                  name: { en: 'The fall speed climbs, then stops', id: 'Kecepatan jatuhnya naik, lalu berhenti' },
                  assert:
                    'assert abs(laju(0) - 125) < 1e-9, f"tingkat 1 harus 125, sekarang: {laju(0)}"\n' +
                    'assert abs(laju(5) - 150) < 1e-9, f"tingkat 2 harus 150, sekarang: {laju(5)}"\n' +
                    'assert abs(laju(1000) - 300) < 1e-9, f"harus berplafon 300, sekarang: {laju(1000)}"',
                },
                {
                  name: { en: 'The interval shrinks, then stops', id: 'Selangnya mengecil, lalu berhenti' },
                  assert:
                    'assert abs(jeda(0) - 0.92) < 1e-9, f"tingkat 1 harus 0.92, sekarang: {jeda(0)}"\n' +
                    'assert abs(jeda(5) - 0.84) < 1e-9, f"tingkat 2 harus 0.84, sekarang: {jeda(5)}"\n' +
                    'assert abs(jeda(1000) - 0.3) < 1e-9, f"harus berlantai 0.3, sekarang: {jeda(1000)}"',
                },
                {
                  name: { en: 'The item falls at the level speed', id: 'Bendanya jatuh pada kecepatan tingkatnya' },
                  assert:
                    'k = perbarui({"px": 0.0, "y": 0.0, "i": 2, "skor": 0}, set(), 0.5)\n' +
                    'assert abs(k["y"] - 62.5) < 1e-9, f"tingkat 1 setengah detik harus 62.5, sekarang: {k[\'y\']}"\n' +
                    'b = perbarui({"px": 0.0, "y": 0.0, "i": 2, "skor": 5}, set(), 0.5)\n' +
                    'assert abs(b["y"] - 75) < 1e-9, f"tingkat 2 setengah detik harus 75, sekarang: {b[\'y\']}"',
                },
                {
                  name: { en: 'Catching still scores', id: 'Menangkap tetap menambah skor' },
                  assert:
                    'k = perbarui({"px": 20.0, "y": 215.0, "i": 0, "skor": 3}, set(), 1 / 60)\n' +
                    'assert k["skor"] == 4, f"harus tertangkap, sekarang: {k[\'skor\']}"\n' +
                    'assert k["i"] == 1, "dan benda berikutnya menyusul"',
                },
                {
                  name: { en: 'A higher score really plays faster', id: 'Skor lebih tinggi sungguh bermain lebih cepat' },
                  assert:
                    'pelan = perbarui({"px": 0.0, "y": 100.0, "i": 2, "skor": 0}, set(), 0.1)\n' +
                    'cepat = perbarui({"px": 0.0, "y": 100.0, "i": 2, "skor": 40}, set(), 0.1)\n' +
                    'assert cepat["y"] > pelan["y"] + 1, f"skor 40 harus jatuh lebih cepat, sekarang: {pelan[\'y\']} lawan {cepat[\'y\']}"',
                },
                {
                  name: { en: 'The level is on screen', id: 'Tingkatnya ada di layar' },
                  assert:
                    'a = gambar({"px": 130.0, "y": 0.0, "i": 0, "skor": 12})\n' +
                    'teks = " ".join(p["isi"] for p in a if p["bentuk"] == "teks")\n' +
                    'assert "12" in teks, f"skornya harus tampil, sekarang: {teks}"\n' +
                    'assert "3" in teks, f"tingkat 3 harus tampil, sekarang: {teks}"',
                },
                {
                  name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
                  assert:
                    'k = {"px": 130.0, "y": 0.0, "i": 0, "skor": 0}\n' +
                    'salinan = dict(k)\n' +
                    'perbarui(k, {"kanan"}, 0.1)\n' +
                    'assert k == salinan, f"perbarui tidak boleh mengubah keadaan yang diberikan, sekarang jadi: {k}"',
                },
              ],
              hints: [
                { en: 'Three one-line functions, then one substitution inside `perbarui`.', id: 'Tiga fungsi satu baris, lalu satu penggantian di dalam `perbarui`.' },
                { en: '`laju` and `jeda` both call `tingkat` — that is the point of deriving it.', id: '`laju` dan `jeda` sama-sama memanggil `tingkat` — itulah gunanya menurunkannya.' },
                { en: 'The fall line becomes `keadaan["y"] + laju(skor) * dt`.', id: 'Baris jatuhnya jadi `keadaan["y"] + laju(skor) * dt`.' },
                { en: '`gambar` can call `tingkat(keadaan["skor"])` too — it is a function of the state like everything else.', id: '`gambar` juga boleh memanggil `tingkat(keadaan["skor"])` — ia fungsi dari keadaannya seperti yang lain.' },
              ],
              solution:
                'TITIK_X = [40, 160, 280, 100, 220]\n' +
                'LAJU = 200\n' +
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
                'def tingkat(skor):\n' +
                '    return 1 + skor // 5\n\n' +
                'def laju(skor):\n' +
                '    return min(300, 100 + tingkat(skor) * 25)\n\n' +
                'def jeda(skor):\n' +
                '    return max(0.3, 1.0 - tingkat(skor) * 0.08)\n\n' +
                'def awal():\n' +
                '    return {"px": 130.0, "y": -12.0, "i": 0, "skor": 0}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    px = keadaan["px"]\n' +
                '    if "kiri" in tombol:\n' +
                '        px = px - LAJU * dt\n' +
                '    if "kanan" in tombol:\n' +
                '        px = px + LAJU * dt\n' +
                '    px = max(0, min(LEBAR - PAPAN_L, px))\n\n' +
                '    skor = keadaan["skor"]\n' +
                '    y = keadaan["y"] + laju(skor) * dt\n' +
                '    i = keadaan["i"]\n\n' +
                '    benda = {"x": TITIK_X[i], "y": y, "l": BENDA, "t": BENDA}\n' +
                '    papan = {"x": px, "y": PAPAN_Y, "l": PAPAN_L, "t": PAPAN_T}\n' +
                '    if tabrakan(benda, papan):\n' +
                '        skor = skor + 1\n' +
                '        y = -12.0\n' +
                '        i = (i + 1) % len(TITIK_X)\n' +
                '    elif y > TINGGI:\n' +
                '        y = -12.0\n' +
                '        i = (i + 1) % len(TITIK_X)\n\n' +
                '    return {"px": px, "y": y, "i": i, "skor": skor}\n\n' +
                'def gambar(keadaan):\n' +
                '    return [\n' +
                '        {"bentuk": "kotak", "x": TITIK_X[keadaan["i"]], "y": keadaan["y"], "l": BENDA, "t": BENDA, "warna": "#f5c65b"},\n' +
                '        {"bentuk": "kotak", "x": keadaan["px"], "y": PAPAN_Y, "l": PAPAN_L, "t": PAPAN_T, "warna": "#24463d"},\n' +
                '        {\n' +
                '            "bentuk": "teks",\n' +
                '            "x": 8,\n' +
                '            "y": 8,\n' +
                '            "isi": "Skor: " + str(keadaan["skor"]) + "  Tingkat: " + str(tingkat(keadaan["skor"])),\n' +
                '            "warna": "#24463d",\n' +
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
          { en: '`segar(fase, spasi_lalu, rekor)` is given to you: use it to build every fresh game.', id: '`segar(fase, spasi_lalu, rekor)` sudah diberikan: pakai untuk membangun tiap permainan baru.' },
          { en: 'Phases are `"siap"`, `"main"` and `"selesai"`. A space **press** starts a game from `"siap"`, and from `"selesai"` it goes back to `"siap"`.', id: 'Fasenya `"siap"`, `"main"`, dan `"selesai"`. **Tekanan** spasi memulai permainan dari `"siap"`, dan dari `"selesai"` ia kembali ke `"siap"`.' },
          { en: '`tingkat(skor)` is `1 + skor // 4`; `laju(skor)` is `110 + tingkat * 20` capped at 280; `jeda(skor)` is `0.9 - tingkat * 0.06` floored at 0.35.', id: '`tingkat(skor)` adalah `1 + skor // 4`; `laju(skor)` adalah `110 + tingkat * 20` berplafon 280; `jeda(skor)` adalah `0.9 - tingkat * 0.06` berlantai 0,35.' },
          { en: 'While playing: catching an item scores a point, missing one costs a life. Three lives.', id: 'Selagi bermain: menangkap benda menambah satu poin, melewatkannya berbiaya satu nyawa. Tiga nyawa.' },
          { en: 'At zero lives the phase becomes `"selesai"`, and `rekor` becomes the larger of `rekor` and `skor`.', id: 'Saat nyawa nol, fasenya jadi `"selesai"`, dan `rekor` jadi yang lebih besar antara `rekor` dan `skor`.' },
          { en: '`rekor` survives every restart; the score and the lives do not.', id: '`rekor` selamat dari tiap mulai ulang; skor dan nyawanya tidak.' },
        ],
        starter:
          'TITIK_X = [40, 160, 280, 100, 220]\n' +
          'LAJU = 200\n' +
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
          'def segar(fase, spasi_lalu, rekor):\n' +
          '    return {\n' +
          '        "fase": fase,\n' +
          '        "px": 130.0,\n' +
          '        "y": -12.0,\n' +
          '        "i": 0,\n' +
          '        "skor": 0,\n' +
          '        "nyawa": 3,\n' +
          '        "rekor": rekor,\n' +
          '        "spasi_lalu": spasi_lalu,\n' +
          '    }\n\n' +
          'def tingkat(skor):\n' +
          '    return 1\n\n' +
          'def laju(skor):\n' +
          '    return 110\n\n' +
          'def jeda(skor):\n' +
          '    return 0.9\n\n' +
          'def awal():\n' +
          '    return segar("siap", False, 0)\n\n' +
          'def perbarui(keadaan, tombol, dt):\n' +
          '    return keadaan\n\n' +
          'def gambar(keadaan):\n' +
          '    hasil = [\n' +
          '        {"bentuk": "kotak", "x": TITIK_X[keadaan["i"]], "y": keadaan["y"], "l": BENDA, "t": BENDA, "warna": "#f5c65b"},\n' +
          '        {"bentuk": "kotak", "x": keadaan["px"], "y": PAPAN_Y, "l": PAPAN_L, "t": PAPAN_T, "warna": "#24463d"},\n' +
          '    ]\n' +
          '    if keadaan["fase"] == "siap":\n' +
          '        hasil.append({"bentuk": "teks", "x": 90, "y": 110, "isi": "Spasi untuk mulai", "warna": "#24463d"})\n' +
          '    elif keadaan["fase"] == "selesai":\n' +
          '        hasil.append({"bentuk": "teks", "x": 84, "y": 110, "isi": "Habis! Rekor " + str(keadaan["rekor"]), "warna": "#ef8f70"})\n' +
          '    else:\n' +
          '        hasil.append({"bentuk": "teks", "x": 8, "y": 8, "isi": "Skor: " + str(keadaan["skor"]) + "  Nyawa: " + str(keadaan["nyawa"]), "warna": "#24463d"})\n' +
          '    return hasil\n',
        tests: [
          {
            name: { en: 'The three tuning functions are right', id: 'Ketiga fungsi penyetelnya benar' },
            assert:
              'assert tingkat(0) == 1 and tingkat(3) == 1 and tingkat(4) == 2 and tingkat(11) == 3, "rentang tingkatnya salah"\n' +
              'assert abs(laju(0) - 130) < 1e-9, f"tingkat 1 harus 130, sekarang: {laju(0)}"\n' +
              'assert abs(laju(4) - 150) < 1e-9, f"tingkat 2 harus 150, sekarang: {laju(4)}"\n' +
              'assert abs(laju(500) - 280) < 1e-9, f"harus berplafon 280, sekarang: {laju(500)}"\n' +
              'assert abs(jeda(0) - 0.84) < 1e-9, f"tingkat 1 harus 0.84, sekarang: {jeda(0)}"\n' +
              'assert abs(jeda(500) - 0.35) < 1e-9, f"harus berlantai 0.35, sekarang: {jeda(500)}"',
          },
          {
            name: { en: 'It waits, then a press starts it', id: 'Ia menunggu, lalu tekanan memulainya' },
            assert:
              'k = awal()\n' +
              'assert k["fase"] == "siap"\n' +
              'for _ in range(60):\n' +
              '    k = perbarui(k, set(), 1 / 60)\n' +
              'assert k["fase"] == "siap", "tanpa tombol harus tetap menunggu"\n' +
              'k = perbarui(k, {"spasi"}, 1 / 60)\n' +
              'assert k["fase"] == "main", f"harus mulai, sekarang: {k[\'fase\']}"\n' +
              'assert k["skor"] == 0 and k["nyawa"] == 3, "dan segar"',
          },
          {
            name: { en: 'Holding space does not restart it', id: 'Menahan spasi tidak mengulangnya' },
            assert:
              'k = perbarui(awal(), {"spasi"}, 1 / 60)\n' +
              'for _ in range(180):\n' +
              '    k = perbarui(k, {"spasi"}, 1 / 60)\n' +
              'assert k["fase"] == "main", "harus tetap bermain"\n' +
              'assert k["skor"] + (3 - k["nyawa"]) > 0, "dan permainannya harus benar-benar berjalan"',
          },
          {
            name: { en: 'Catching scores, missing costs a life', id: 'Menangkap menambah skor, melewatkan berbiaya nyawa' },
            assert:
              'dasar = {"fase": "main", "px": 20.0, "y": 215.0, "i": 0, "skor": 2, "nyawa": 3, "rekor": 0, "spasi_lalu": False}\n' +
              'k = perbarui(dict(dasar), set(), 1 / 60)\n' +
              'assert k["skor"] == 3, f"harus tertangkap, sekarang: {k[\'skor\']}"\n' +
              'assert k["nyawa"] == 3, "menangkap tidak berbiaya nyawa"\n' +
              'b = perbarui({**dasar, "px": 250.0, "y": 239.0}, set(), 0.5)\n' +
              'assert b["nyawa"] == 2, f"terlewat harus berbiaya nyawa, sekarang: {b[\'nyawa\']}"\n' +
              'assert b["skor"] == 2, "dan tidak menambah skor"',
          },
          {
            name: { en: 'The last life ends the game', id: 'Nyawa terakhir mengakhiri permainan' },
            assert:
              'k = perbarui({"fase": "main", "px": 250.0, "y": 239.0, "i": 0, "skor": 7, "nyawa": 1, "rekor": 3, "spasi_lalu": False}, set(), 0.5)\n' +
              'assert k["nyawa"] == 0, f"nyawanya harus habis, sekarang: {k[\'nyawa\']}"\n' +
              'assert k["fase"] == "selesai", f"fasenya harus selesai, sekarang: {k[\'fase\']}"\n' +
              'assert k["rekor"] == 7, f"rekornya harus naik ke 7, sekarang: {k[\'rekor\']}"',
          },
          {
            name: { en: 'A worse game does not lower the record', id: 'Permainan lebih buruk tidak menurunkan rekornya' },
            assert:
              'k = perbarui({"fase": "main", "px": 250.0, "y": 239.0, "i": 0, "skor": 2, "nyawa": 1, "rekor": 9, "spasi_lalu": False}, set(), 0.5)\n' +
              'assert k["rekor"] == 9, f"rekornya harus tetap 9, sekarang: {k[\'rekor\']}"',
          },
          {
            name: { en: 'Finished, nothing moves', id: 'Setelah usai, tak ada yang bergerak' },
            assert:
              'k = {"fase": "selesai", "px": 130.0, "y": 100.0, "i": 0, "skor": 5, "nyawa": 0, "rekor": 5, "spasi_lalu": False}\n' +
              'b = perbarui(dict(k), {"kanan"}, 0.5)\n' +
              'assert abs(b["px"] - 130.0) < 1e-9 and abs(b["y"] - 100.0) < 1e-9, "papan dan bendanya harus diam"\n' +
              'assert b["skor"] == 5, "dan skornya beku"',
          },
          {
            name: { en: 'The record survives the restart', id: 'Rekornya selamat dari mulai ulang' },
            assert:
              'k = {"fase": "selesai", "px": 130.0, "y": 100.0, "i": 0, "skor": 5, "nyawa": 0, "rekor": 11, "spasi_lalu": False}\n' +
              'k = perbarui(k, {"spasi"}, 1 / 60)\n' +
              'assert k["fase"] == "siap", f"harus kembali ke siap, sekarang: {k[\'fase\']}"\n' +
              'assert k["rekor"] == 11, f"rekornya harus bertahan, sekarang: {k[\'rekor\']}"\n' +
              'k = perbarui(k, set(), 1 / 60)\n' +
              'k = perbarui(k, {"spasi"}, 1 / 60)\n' +
              'assert k["fase"] == "main" and k["skor"] == 0 and k["nyawa"] == 3, "permainan barunya segar"\n' +
              'assert k["rekor"] == 11, f"tetapi rekornya tetap, sekarang: {k[\'rekor\']}"',
          },
          {
            name: { en: 'A higher score really plays faster', id: 'Skor lebih tinggi sungguh bermain lebih cepat' },
            assert:
              'dasar = {"fase": "main", "px": 0.0, "y": 100.0, "i": 2, "skor": 0, "nyawa": 3, "rekor": 0, "spasi_lalu": False}\n' +
              'pelan = perbarui(dict(dasar), set(), 0.1)\n' +
              'cepat = perbarui({**dasar, "skor": 30}, set(), 0.1)\n' +
              'assert cepat["y"] > pelan["y"] + 1, f"skor 30 harus jatuh lebih cepat, sekarang: {pelan[\'y\']} lawan {cepat[\'y\']}"',
          },
          {
            name: { en: 'A whole game can be played end to end', id: 'Satu permainan penuh bisa dilalui ujung ke ujung' },
            assert:
              'k = perbarui(awal(), {"spasi"}, 1 / 60)\n' +
              'for _ in range(6000):\n' +
              '    target = TITIK_X[k["i"]] - 24\n' +
              '    ditekan = set()\n' +
              '    if k["px"] < target - 2:\n' +
              '        ditekan = {"kanan"}\n' +
              '    elif k["px"] > target + 2:\n' +
              '        ditekan = {"kiri"}\n' +
              '    k = perbarui(k, ditekan, 1 / 60)\n' +
              '    if k["fase"] == "selesai":\n' +
              '        break\n' +
              'assert k["skor"] > 3, f"papan yang mengikuti harus mencetak skor, sekarang: {k[\'skor\']}"',
          },
          {
            name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
            assert:
              'k = {"fase": "main", "px": 130.0, "y": 0.0, "i": 0, "skor": 0, "nyawa": 3, "rekor": 4, "spasi_lalu": False}\n' +
              'salinan = dict(k)\n' +
              'perbarui(k, {"kanan"}, 0.1)\n' +
              'assert k == salinan, f"perbarui tidak boleh mengubah keadaan yang diberikan, sekarang jadi: {k}"',
          },
        ],
        hints: [
          { en: 'Work out `ditekan` and the press at the very top, then split on the phase.', id: 'Hitung `ditekan` dan tekanannya di paling atas, lalu bercabang pada fasenya.' },
          { en: 'The two waiting phases are two lines each: start a fresh game, or hand the state back with the new `spasi_lalu`.', id: 'Kedua fase menunggunya masing-masing dua baris: mulai permainan baru, atau kembalikan keadaannya dengan `spasi_lalu` yang baru.' },
          { en: 'Starting from `"selesai"` goes to `"siap"`, not straight into a game — one test walks the whole loop.', id: 'Memulai dari `"selesai"` menuju `"siap"`, bukan langsung ke permainan — ada satu tes yang menempuh seluruh lingkarannya.' },
          { en: 'The record is decided at the moment the last life goes: `max(rekor, skor)`.', id: 'Rekornya ditentukan saat nyawa terakhir hilang: `max(rekor, skor)`.' },
        ],
        solution:
          'TITIK_X = [40, 160, 280, 100, 220]\n' +
          'LAJU = 200\n' +
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
          'def segar(fase, spasi_lalu, rekor):\n' +
          '    return {\n' +
          '        "fase": fase,\n' +
          '        "px": 130.0,\n' +
          '        "y": -12.0,\n' +
          '        "i": 0,\n' +
          '        "skor": 0,\n' +
          '        "nyawa": 3,\n' +
          '        "rekor": rekor,\n' +
          '        "spasi_lalu": spasi_lalu,\n' +
          '    }\n\n' +
          'def tingkat(skor):\n' +
          '    return 1 + skor // 4\n\n' +
          'def laju(skor):\n' +
          '    return min(280, 110 + tingkat(skor) * 20)\n\n' +
          'def jeda(skor):\n' +
          '    return max(0.35, 0.9 - tingkat(skor) * 0.06)\n\n' +
          'def awal():\n' +
          '    return segar("siap", False, 0)\n\n' +
          'def perbarui(keadaan, tombol, dt):\n' +
          '    ditekan = "spasi" in tombol\n' +
          '    baru = ditekan and not keadaan["spasi_lalu"]\n\n' +
          '    if keadaan["fase"] == "siap":\n' +
          '        if baru:\n' +
          '            return segar("main", ditekan, keadaan["rekor"])\n' +
          '        return {**keadaan, "spasi_lalu": ditekan}\n\n' +
          '    if keadaan["fase"] == "selesai":\n' +
          '        if baru:\n' +
          '            return segar("siap", ditekan, keadaan["rekor"])\n' +
          '        return {**keadaan, "spasi_lalu": ditekan}\n\n' +
          '    px = keadaan["px"]\n' +
          '    if "kiri" in tombol:\n' +
          '        px = px - LAJU * dt\n' +
          '    if "kanan" in tombol:\n' +
          '        px = px + LAJU * dt\n' +
          '    px = max(0, min(LEBAR - PAPAN_L, px))\n\n' +
          '    skor = keadaan["skor"]\n' +
          '    nyawa = keadaan["nyawa"]\n' +
          '    i = keadaan["i"]\n' +
          '    y = keadaan["y"] + laju(skor) * dt\n\n' +
          '    benda = {"x": TITIK_X[i], "y": y, "l": BENDA, "t": BENDA}\n' +
          '    papan = {"x": px, "y": PAPAN_Y, "l": PAPAN_L, "t": PAPAN_T}\n' +
          '    if tabrakan(benda, papan):\n' +
          '        skor = skor + 1\n' +
          '        y = -12.0\n' +
          '        i = (i + 1) % len(TITIK_X)\n' +
          '    elif y > TINGGI:\n' +
          '        nyawa = max(0, nyawa - 1)\n' +
          '        y = -12.0\n' +
          '        i = (i + 1) % len(TITIK_X)\n\n' +
          '    rekor = keadaan["rekor"]\n' +
          '    fase = "main"\n' +
          '    if nyawa <= 0:\n' +
          '        fase = "selesai"\n' +
          '        rekor = max(rekor, skor)\n\n' +
          '    return {\n' +
          '        "fase": fase,\n' +
          '        "px": px,\n' +
          '        "y": y,\n' +
          '        "i": i,\n' +
          '        "skor": skor,\n' +
          '        "nyawa": nyawa,\n' +
          '        "rekor": rekor,\n' +
          '        "spasi_lalu": ditekan,\n' +
          '    }\n\n' +
          'def gambar(keadaan):\n' +
          '    hasil = [\n' +
          '        {"bentuk": "kotak", "x": TITIK_X[keadaan["i"]], "y": keadaan["y"], "l": BENDA, "t": BENDA, "warna": "#f5c65b"},\n' +
          '        {"bentuk": "kotak", "x": keadaan["px"], "y": PAPAN_Y, "l": PAPAN_L, "t": PAPAN_T, "warna": "#24463d"},\n' +
          '    ]\n' +
          '    if keadaan["fase"] == "siap":\n' +
          '        hasil.append({"bentuk": "teks", "x": 90, "y": 110, "isi": "Spasi untuk mulai", "warna": "#24463d"})\n' +
          '    elif keadaan["fase"] == "selesai":\n' +
          '        hasil.append({"bentuk": "teks", "x": 84, "y": 110, "isi": "Habis! Rekor " + str(keadaan["rekor"]), "warna": "#ef8f70"})\n' +
          '    else:\n' +
          '        hasil.append({\n' +
          '            "bentuk": "teks",\n' +
          '            "x": 8,\n' +
          '            "y": 8,\n' +
          '            "isi": "Skor: " + str(keadaan["skor"]) + "  Nyawa: " + str(keadaan["nyawa"]) + "  Tingkat: " + str(tingkat(keadaan["skor"])),\n' +
          '            "warna": "#24463d",\n' +
          '        })\n' +
          '    return hasil\n',
        xp: 50,
      },
    },
  ],
}
