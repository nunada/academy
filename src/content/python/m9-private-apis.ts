import type { Module } from '../types'

/** Module 9 — talking to an API that requires credentials.
 *
 *  Exercises import `nunada_api`, a stand-in shipped into Pyodide's filesystem
 *  (see `src/lib/pythonModules.ts`). The network is simulated; the call shape —
 *  base URL, bearer token, status codes, JSON body — matches a real private API,
 *  so nothing learned here has to be unlearned later.
 *
 *  Tests call `nunada_api.reset()` in `setup`, because the stand-in keeps its
 *  data at module level and one Pyodide instance serves the whole session. */
export const module9: Module = {
  id: 'py-m9',
  title: { en: 'Working with Private APIs', id: 'Bekerja dengan API Privat' },
  summary: {
    en: 'Call a service that will not answer without credentials, and handle what it says back.',
    id: 'Memanggil layanan yang tidak menjawab tanpa kredensial, dan menangani jawabannya.',
  },
  submodules: [
    /* ------------------------------------------------------ 9.1 authenticated GET */
    {
      id: 'py-m9-s1',
      title: { en: 'Asking with a Key', id: 'Bertanya dengan Kunci' },
      summary: {
        en: 'Send credentials, read the status code, and unpack the JSON.',
        id: 'Mengirim kredensial, membaca kode status, dan membongkar JSON-nya.',
      },
      lessons: [
        {
          id: 'py-m9-s1-l1',
          title: { en: 'A door that stays shut', id: 'Pintu yang tetap tertutup' },
          goal: { en: 'Send an API key with a request.', id: 'Mengirim kunci API bersama permintaan.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Public data, private data', id: 'Data publik, data privat' },
              body: {
                en: 'A public API answers anyone. A **private** API answers only callers who prove who they are — a school does not hand out student records to a stranger. The proof is usually an **API key**, a long secret string the service issued to you.',
                id: 'API publik menjawab siapa saja. API **privat** hanya menjawab pemanggil yang membuktikan identitasnya — sekolah tidak menyerahkan data siswa kepada orang asing. Buktinya biasanya berupa **kunci API**, string rahasia panjang yang diterbitkan layanan itu untukmu.',
              },
              code: '# Latihan ini memakai API tiruan. Jaringannya disimulasikan,\n# tetapi bentuk pemanggilannya sama persis dengan API sungguhan.\nimport nunada_api\n\nrespons = nunada_api.get("https://api.nunada.test/siswa")\nprint(respons.status_code)',
              output: '401',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: '401 means "you did not say who you are"', id: '401 berarti "kamu belum menyebut siapa dirimu"' },
              body: {
                en: 'The key travels in a **header**, not in the address. The usual form is `Authorization: Bearer <kunci>`. Headers are just a dictionary.',
                id: 'Kuncinya dikirim lewat **header**, bukan lewat alamatnya. Bentuk yang lazim adalah `Authorization: Bearer <kunci>`. Header hanyalah sebuah dictionary.',
              },
              code: 'import nunada_api\n\nkunci = nunada_api.API_KEY\nheaders = {"Authorization": "Bearer " + kunci}\n\nrespons = nunada_api.get("https://api.nunada.test/siswa", headers=headers)\nprint(respons.status_code)',
              output: '200',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'The numbers that come back', id: 'Angka-angka yang kembali' },
              body: {
                en: 'A status code is the service saying how it went. `200` fine, `201` created, `400` your request was malformed, `401` bad or missing key, `404` no such thing, `500` their problem not yours. Check it before trusting the body.',
                id: 'Kode status adalah cara layanan mengabarkan hasilnya. `200` beres, `201` berhasil dibuat, `400` permintaanmu cacat, `401` kunci salah atau tidak ada, `404` tidak ada barangnya, `500` masalah mereka, bukan kamu. Periksa kodenya sebelum memercayai isinya.',
              },
              code: 'import nunada_api\n\nheaders = {"Authorization": "Bearer " + nunada_api.API_KEY}\nprint(nunada_api.get("https://api.nunada.test/siswa/1", headers=headers).status_code)\nprint(nunada_api.get("https://api.nunada.test/siswa/99", headers=headers).status_code)\nprint(nunada_api.get("https://api.nunada.test/hantu", headers=headers).status_code)',
              output: '200\n404\n404',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A request comes back with 401. What is wrong?',
                id: 'Sebuah permintaan kembali dengan 401. Apa yang salah?',
              },
              options: [
                { en: 'The key is missing or wrong', id: 'Kuncinya hilang atau salah' },
                { en: 'The address does not exist', id: 'Alamatnya tidak ada' },
                { en: 'The server crashed', id: 'Server-nya bermasalah' },
                { en: 'The data was sent in the wrong shape', id: 'Datanya dikirim dalam bentuk yang salah' },
              ],
              answer: 0,
              explain: {
                en: '401 is about identity. A wrong address gives 404, and a malformed body gives 400.',
                id: '401 soal identitas. Alamat yang salah memberi 404, dan isi yang cacat memberi 400.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Build the header that carries the key.',
                id: 'Bangun header yang membawa kuncinya.',
              },
              template: 'headers = {"___": "Bearer " + kunci}',
              blanks: ['Authorization'],
              explain: {
                en: 'Authorization is the standard header name; Bearer says the value is a token.',
                id: 'Authorization adalah nama header yang baku; Bearer menyatakan bahwa nilainya berupa token.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Request `https://api.nunada.test/siswa` with the key in `nunada_api.API_KEY`, and print `OK` when the status is 200, otherwise print the status code.',
                id: 'Minta `https://api.nunada.test/siswa` dengan kunci di `nunada_api.API_KEY`, lalu cetak `OK` bila statusnya 200, selain itu cetak kode statusnya.',
              },
              starter: 'import nunada_api\n\nkunci = nunada_api.API_KEY\n',
              tests: [
                {
                  name: { en: 'With the right key', id: 'Dengan kunci yang benar' },
                  setup: 'import nunada_api\nnunada_api.reset()',
                  expectOutput: 'OK',
                },
                {
                  name: { en: 'The header is what makes it work', id: 'Header itulah yang membuatnya berhasil' },
                  setup: 'import nunada_api\nnunada_api.reset()',
                  assert:
                    'r = nunada_api.get("https://api.nunada.test/siswa")\nassert r.status_code == 401, "tanpa header, API memang menolak"',
                },
              ],
              hints: [
                { en: 'Build the headers dictionary first, then pass headers=headers.', id: 'Bangun dictionary headers dulu, lalu oper headers=headers.' },
                { en: 'respons = nunada_api.get(url, headers=headers)', id: 'respons = nunada_api.get(url, headers=headers)' },
                { en: 'if respons.status_code == 200: print("OK") else: print(respons.status_code)', id: 'if respons.status_code == 200: print("OK") else: print(respons.status_code)' },
              ],
              solution:
                'import nunada_api\n\nkunci = nunada_api.API_KEY\nheaders = {"Authorization": "Bearer " + kunci}\nrespons = nunada_api.get("https://api.nunada.test/siswa", headers=headers)\n\nif respons.status_code == 200:\n    print("OK")\nelse:\n    print(respons.status_code)',
            },
          ],
        },
        {
          id: 'py-m9-s1-l2',
          title: { en: 'Unpacking the answer', id: 'Membongkar jawabannya' },
          goal: { en: 'Turn a JSON response into Python data.', id: 'Mengubah respons JSON menjadi data Python.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'JSON arrives as dictionaries and lists', id: 'JSON tiba sebagai dictionary dan list' },
              body: {
                en: '`.json()` hands you ordinary Python data — nothing new to learn. Everything from module 4 applies: keys, loops, `.get()`.',
                id: '`.json()` memberimu data Python biasa — tidak ada yang baru untuk dipelajari. Semua dari modul 4 berlaku: kunci, loop, `.get()`.',
              },
              code: 'import nunada_api\n\nheaders = {"Authorization": "Bearer " + nunada_api.API_KEY}\nrespons = nunada_api.get("https://api.nunada.test/siswa", headers=headers)\nisi = respons.json()\nprint(isi["data"][0])',
              output: "{'id': 1, 'nama': 'Ani', 'nilai': 80}",
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Check the status before the body', id: 'Periksa status sebelum isinya' },
              body: {
                en: 'A failed response still has a body, but it holds an error rather than your data. Reading `["data"]` from it raises `KeyError`. Check first — this is the same guard-then-act shape as module 6.',
                id: 'Respons yang gagal tetap punya isi, tetapi isinya pesan error, bukan datamu. Membaca `["data"]` darinya memunculkan `KeyError`. Periksa dulu — polanya sama seperti periksa-lalu-bertindak di modul 6.',
              },
              code: 'import nunada_api\n\nrespons = nunada_api.get("https://api.nunada.test/siswa")\n\nif respons.ok:\n    print(respons.json()["data"])\nelse:\n    print("gagal:", respons.json()["error"])',
              output: 'gagal: kunci API tidak valid',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'The response is 404. What does `respons.json()["data"]` do?',
                id: 'Responsnya 404. Apa yang terjadi pada `respons.json()["data"]`?',
              },
              options: [
                { en: 'Raises KeyError — the body has `error`, not `data`', id: 'Memunculkan KeyError — isinya `error`, bukan `data`' },
                { en: 'Returns an empty list', id: 'Mengembalikan list kosong' },
                { en: 'Returns None', id: 'Mengembalikan None' },
                { en: 'Retries the request', id: 'Mengulang permintaannya' },
              ],
              answer: 0,
              explain: {
                en: 'A failure body has a different shape. That is exactly why the status is checked first.',
                id: 'Isi respons yang gagal berbentuk berbeda. Justru itulah sebabnya statusnya diperiksa lebih dulu.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a request that prints the number of students.',
                id: 'Susun permintaan yang mencetak jumlah siswa.',
              },
              lines: [
                'import nunada_api',
                '',
                'headers = {"Authorization": "Bearer " + nunada_api.API_KEY}',
                'respons = nunada_api.get("https://api.nunada.test/siswa", headers=headers)',
                'if respons.ok:',
                '    print(len(respons.json()["data"]))',
              ],
              explain: {
                en: 'Import, build the header, send, check, and only then read the body.',
                id: 'Impor, bangun header, kirim, periksa, dan baru setelah itu baca isinya.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Write `ambil_nama(sid)` returning the student name for that id, or `None` when the response is not OK.',
                id: 'Tulis `ambil_nama(sid)` yang mengembalikan nama siswa untuk id itu, atau `None` bila responsnya tidak OK.',
              },
              starter:
                'import nunada_api\n\nHEADERS = {"Authorization": "Bearer " + nunada_api.API_KEY}\n\ndef ambil_nama(sid):\n    pass\n',
              tests: [
                {
                  name: { en: 'Finds an existing student', id: 'Menemukan siswa yang ada' },
                  setup: 'import nunada_api\nnunada_api.reset()',
                  assert: 'assert ambil_nama(1) == "Ani"\nassert ambil_nama(3) == "Citra"',
                },
                {
                  name: { en: 'Returns None for a missing id', id: 'Mengembalikan None untuk id yang tidak ada' },
                  setup: 'import nunada_api\nnunada_api.reset()',
                  assert: 'assert ambil_nama(99) is None, "id yang tidak ada harus None"',
                },
              ],
              hints: [
                { en: 'The address ends with the id: f"{BASE}/siswa/{sid}"', id: 'Alamatnya diakhiri id: f"{BASE}/siswa/{sid}"' },
                { en: 'Check respons.ok before reading the body.', id: 'Periksa respons.ok sebelum membaca isinya.' },
                { en: 'return respons.json()["data"]["nama"]', id: 'return respons.json()["data"]["nama"]' },
              ],
              solution:
                'import nunada_api\n\nHEADERS = {"Authorization": "Bearer " + nunada_api.API_KEY}\n\ndef ambil_nama(sid):\n    url = f"https://api.nunada.test/siswa/{sid}"\n    respons = nunada_api.get(url, headers=HEADERS)\n    if not respons.ok:\n        return None\n    return respons.json()["data"]["nama"]',
            },
          ],
        },
      ],
      project: {
        id: 'py-m9-s1-p',
        title: { en: 'Scoreboard from an API', id: 'Papan nilai dari API' },
        brief: {
          en: 'Fetch every student from the private API and print a small report.',
          id: 'Ambil semua siswa dari API privat lalu cetak laporan ringkas.',
        },
        requirements: [
          { en: 'GET `https://api.nunada.test/siswa` with the bearer header.', id: 'GET `https://api.nunada.test/siswa` dengan header bearer.' },
          { en: 'Not OK: print `Gagal: <kode>` and stop.', id: 'Tidak OK: cetak `Gagal: <kode>` lalu berhenti.' },
          { en: 'Otherwise print one line per student as `Ani: 80`, in the order received.', id: 'Selain itu cetak satu baris per siswa berbentuk `Ani: 80`, sesuai urutan yang diterima.' },
          { en: 'Then print `Rata-rata: R`, rounded to one decimal.', id: 'Lalu cetak `Rata-rata: R`, dibulatkan satu desimal.' },
        ],
        starter:
          '# Papan nilai dari API\nimport nunada_api\n\nBASE = "https://api.nunada.test"\nHEADERS = {"Authorization": "Bearer " + nunada_api.API_KEY}\n',
        tests: [
          {
            name: { en: 'Reports the three students', id: 'Melaporkan ketiga siswa' },
            setup: 'import nunada_api\nnunada_api.reset()',
            expectOutput: 'Ani: 80\nBudi: 65\nCitra: 95\nRata-rata: 80.0',
          },
          {
            name: { en: 'Reflects data added beforehand', id: 'Mengikuti data yang ditambahkan lebih dulu' },
            setup:
              'import nunada_api\nnunada_api.reset()\nnunada_api.post("https://api.nunada.test/siswa", headers={"Authorization": "Bearer " + nunada_api.API_KEY}, json={"nama": "Dina", "nilai": 100})',
            expectOutput: 'Ani: 80\nBudi: 65\nCitra: 95\nDina: 100\nRata-rata: 85.0',
          },
          {
            name: { en: 'A bad key is reported, not crashed on', id: 'Kunci salah dilaporkan, bukan bikin error' },
            setup: 'import nunada_api\nnunada_api.reset()',
            assert:
              'import nunada_api\nr = nunada_api.get("https://api.nunada.test/siswa", headers={"Authorization": "Bearer salah"})\nassert r.status_code == 401 and "error" in r.json(), "API tiruan harus menolak kunci yang salah"',
          },
        ],
        hints: [
          { en: 'One request is enough — the list endpoint returns every student.', id: 'Satu permintaan sudah cukup — endpoint daftar mengembalikan semua siswa.' },
          { en: 'respons.json()["data"] is a list of dictionaries.', id: 'respons.json()["data"] adalah list berisi dictionary.' },
          { en: 'Collect the scores while you print, then average at the end.', id: 'Kumpulkan nilainya sambil mencetak, lalu rata-ratakan di akhir.' },
          { en: 'print(f"{s[\'nama\']}: {s[\'nilai\']}")', id: 'print(f"{s[\'nama\']}: {s[\'nilai\']}")' },
        ],
        solution:
          'import nunada_api\n\nBASE = "https://api.nunada.test"\nHEADERS = {"Authorization": "Bearer " + nunada_api.API_KEY}\n\nrespons = nunada_api.get(BASE + "/siswa", headers=HEADERS)\n\nif not respons.ok:\n    print(f"Gagal: {respons.status_code}")\nelse:\n    siswa = respons.json()["data"]\n    nilai = []\n    for s in siswa:\n        print(f"{s[\'nama\']}: {s[\'nilai\']}")\n        nilai.append(s["nilai"])\n    print(f"Rata-rata: {round(sum(nilai) / len(nilai), 1)}")',
        xp: 50,
      },
    },

    /* --------------------------------------------- 9.2 sending data & secrets */
    {
      id: 'py-m9-s2',
      title: { en: 'Sending Data, Keeping Secrets', id: 'Mengirim Data, Menjaga Rahasia' },
      summary: {
        en: 'Create records with POST, and stop hardcoding your key.',
        id: 'Membuat data dengan POST, dan berhenti menanam kunci di dalam kode.',
      },
      lessons: [
        {
          id: 'py-m9-s2-l1',
          title: { en: 'POST creates something', id: 'POST membuat sesuatu' },
          goal: { en: 'Send a body and read what came back.', id: 'Mengirim isi permintaan dan membaca balasannya.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'GET asks, POST changes', id: 'GET bertanya, POST mengubah' },
              body: {
                en: 'A `GET` should leave the service exactly as it found it. A `POST` creates something, and the data you are creating travels in the body — `json=` — rather than in the address.',
                id: 'Sebuah `GET` seharusnya meninggalkan layanan persis seperti saat ditemukan. Sebuah `POST` membuat sesuatu, dan data yang kamu buat dikirim di badan permintaan — `json=` — bukan di alamatnya.',
              },
              code: 'import nunada_api\n\nheaders = {"Authorization": "Bearer " + nunada_api.API_KEY}\nrespons = nunada_api.post(\n    "https://api.nunada.test/siswa",\n    headers=headers,\n    json={"nama": "Dina", "nilai": 100},\n)\nprint(respons.status_code)\nprint(respons.json()["data"])',
              output: "201\n{'id': 4, 'nama': 'Dina', 'nilai': 100}",
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: '201 and the id you did not choose', id: '201 dan id yang bukan kamu tentukan' },
              body: {
                en: '`201` means created, and the response usually carries the finished record — including the `id` the service assigned. That is why you read the response instead of assuming.',
                id: '`201` berarti berhasil dibuat, dan responsnya biasanya membawa data jadinya — termasuk `id` yang ditetapkan layanan. Karena itulah kamu membaca responsnya alih-alih menebak.',
              },
              code: 'baru = respons.json()["data"]\nprint(baru["id"])',
              output: '4',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: '400 is your fault, and that is useful', id: '400 adalah salahmu, dan itu berguna' },
              body: {
                en: 'Leave out a required field and the service refuses with `400` and says what it wanted. Read the message rather than guessing.',
                id: 'Hilangkan satu isian wajib dan layanan menolak dengan `400` sambil menyebut apa yang ia butuhkan. Baca pesannya, jangan menebak.',
              },
              code: 'respons = nunada_api.post(\n    "https://api.nunada.test/siswa",\n    headers=headers,\n    json={"nama": "Eko"},\n)\nprint(respons.status_code)\nprint(respons.json()["error"])',
              output: '400\nnama dan nilai wajib diisi',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which request should NOT change anything on the server?',
                id: 'Permintaan mana yang seharusnya TIDAK mengubah apa pun di server?',
              },
              options: [
                { en: 'GET', id: 'GET' },
                { en: 'POST', id: 'POST' },
                { en: 'Both change data', id: 'Keduanya mengubah data' },
                { en: 'Neither changes data', id: 'Keduanya tidak mengubah data' },
              ],
              answer: 0,
              explain: {
                en: 'GET only reads. Sending the same GET twice should give the same answer and leave no trace.',
                id: 'GET hanya membaca. Mengirim GET yang sama dua kali seharusnya memberi jawaban sama dan tidak meninggalkan jejak.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Write `tambah_siswa(nama, nilai)` that POSTs the student and returns the new id, or `None` when the response is not OK.',
                id: 'Tulis `tambah_siswa(nama, nilai)` yang mem-POST siswa itu dan mengembalikan id barunya, atau `None` bila responsnya tidak OK.',
              },
              starter:
                'import nunada_api\n\nBASE = "https://api.nunada.test"\nHEADERS = {"Authorization": "Bearer " + nunada_api.API_KEY}\n\ndef tambah_siswa(nama, nilai):\n    pass\n',
              tests: [
                {
                  name: { en: 'Creates and returns the id', id: 'Membuat dan mengembalikan id' },
                  setup: 'import nunada_api\nnunada_api.reset()',
                  assert:
                    'sid = tambah_siswa("Dina", 100)\nassert sid == 4, "id pertama yang baru harus 4, dapat: " + repr(sid)\nassert tambah_siswa("Eko", 70) == 5, "id berikutnya harus 5"',
                },
                {
                  name: { en: 'The student really is there afterwards', id: 'Siswanya benar-benar ada sesudahnya' },
                  setup: 'import nunada_api\nnunada_api.reset()',
                  assert:
                    'sid = tambah_siswa("Dina", 100)\nr = nunada_api.get(BASE + "/siswa/" + str(sid), headers=HEADERS)\nassert r.json()["data"]["nama"] == "Dina", "data baru harus bisa diambil kembali"',
                },
              ],
              hints: [
                { en: 'The body is a dictionary passed as json=.', id: 'Isinya berupa dictionary yang dioper sebagai json=.' },
                { en: 'json={"nama": nama, "nilai": nilai}', id: 'json={"nama": nama, "nilai": nilai}' },
                { en: 'Guard on respons.ok, then return respons.json()["data"]["id"]', id: 'Periksa respons.ok, lalu return respons.json()["data"]["id"]' },
              ],
              solution:
                'import nunada_api\n\nBASE = "https://api.nunada.test"\nHEADERS = {"Authorization": "Bearer " + nunada_api.API_KEY}\n\ndef tambah_siswa(nama, nilai):\n    respons = nunada_api.post(\n        BASE + "/siswa",\n        headers=HEADERS,\n        json={"nama": nama, "nilai": nilai},\n    )\n    if not respons.ok:\n        return None\n    return respons.json()["data"]["id"]',
            },
          ],
        },
        {
          id: 'py-m9-s2-l2',
          title: { en: 'Never hardcode the key', id: 'Jangan tanam kunci di dalam kode' },
          goal: { en: 'Load a secret from outside the source.', id: 'Memuat rahasia dari luar kode sumber.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A key in the code is a leaked key', id: 'Kunci di dalam kode adalah kunci yang bocor' },
              body: {
                en: 'Type the key straight into your program and it goes wherever the program goes — into Git, into a screenshot, into a shared folder. Anyone who reads the file can now act as you. Treat a leaked key as one that must be revoked, not one you can quietly delete.',
                id: 'Ketik kunci langsung di programmu dan ia ikut ke mana pun program itu pergi — masuk ke Git, ke tangkapan layar, ke folder bersama. Siapa pun yang membaca berkasnya kini bisa bertindak sebagai dirimu. Anggap kunci yang bocor sebagai kunci yang wajib dicabut, bukan yang cukup dihapus diam-diam.',
              },
              code: '# JANGAN seperti ini\nKUNCI = "nunada-rahasia-123"',
              output: '(tidak ada keluaran — tetapi rahasianya sudah ikut tersimpan di berkas)',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Keep it beside the code, not inside it', id: 'Simpan di samping kode, bukan di dalamnya' },
              body: {
                en: 'Put the secret in a separate file the program reads at startup, and keep that file out of version control. On a real server the same idea uses an environment variable, read with `os.environ`. The principle is identical: the code says *where* to find the key, never *what* it is.',
                id: 'Taruh rahasianya di berkas terpisah yang dibaca program saat mulai, dan jauhkan berkas itu dari kendali versi. Di server sungguhan, gagasan yang sama memakai variabel lingkungan, dibaca dengan `os.environ`. Prinsipnya sama: kode menyebut *di mana* kuncinya, bukan *apa* isinya.',
              },
              code: 'with open("kunci.txt", "w") as f:\n    f.write("nunada-rahasia-123\\n")\n\nwith open("kunci.txt") as f:\n    kunci = f.read().strip()\n\nprint(kunci[:6] + "...")',
              output: 'nunada...',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Fail loudly when it is missing', id: 'Gagal dengan jelas saat kuncinya tidak ada' },
              body: {
                en: 'A missing key should stop the program with a clear message, not send an unauthenticated request and puzzle you with a 401 later. This is `raise` from module 6, used where it matters.',
                id: 'Kunci yang hilang seharusnya menghentikan program dengan pesan jelas, bukan mengirim permintaan tanpa otentikasi lalu membingungkanmu dengan 401 belakangan. Ini `raise` dari modul 6, dipakai di tempat yang penting.',
              },
              code: 'def muat_kunci(nama="kunci.txt"):\n    try:\n        with open(nama) as f:\n            kunci = f.read().strip()\n    except FileNotFoundError:\n        raise ValueError(f"berkas {nama} tidak ada")\n    if not kunci:\n        raise ValueError("kunci kosong")\n    return kunci',
              output: '(mendefinisikan fungsi — belum ada keluaran)',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'You accidentally pushed a key to a public repository. What is the right move?',
                id: 'Kamu tak sengaja mendorong sebuah kunci ke repositori publik. Apa langkah yang benar?',
              },
              options: [
                { en: 'Revoke the key and issue a new one', id: 'Cabut kuncinya dan terbitkan yang baru' },
                { en: 'Delete the line in a new commit', id: 'Hapus barisnya lewat commit baru' },
                { en: 'Make the repository private', id: 'Jadikan repositorinya privat' },
                { en: 'Rename the variable', id: 'Ganti nama variabelnya' },
              ],
              answer: 0,
              explain: {
                en: 'Git keeps the history, and a public key may already be copied. Only revoking it actually ends the exposure.',
                id: 'Git menyimpan riwayatnya, dan kunci yang sudah publik mungkin telanjur disalin. Hanya pencabutan yang benar-benar mengakhiri paparannya.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Write `muat_kunci(nama)` returning the stripped contents of the file, raising `ValueError` with `berkas tidak ada` when it is missing and `kunci kosong` when the file is blank.',
                id: 'Tulis `muat_kunci(nama)` yang mengembalikan isi berkas tanpa spasi tepi, memunculkan `ValueError` berpesan `berkas tidak ada` bila berkasnya hilang dan `kunci kosong` bila berkasnya kosong.',
              },
              starter: 'def muat_kunci(nama):\n    pass\n',
              tests: [
                {
                  name: { en: 'Reads and strips the key', id: 'Membaca dan merapikan kuncinya' },
                  setup: 'with open("kunci_uji.txt", "w") as _f:\n    _f.write("  rahasia-abc  \\n")',
                  assert: 'assert muat_kunci("kunci_uji.txt") == "rahasia-abc", "spasi dan baris baru harus dibuang"',
                },
                {
                  name: { en: 'A missing file is refused', id: 'Berkas yang tidak ada ditolak' },
                  setup: 'import os\nif os.path.exists("tidak_ada.txt"):\n    os.remove("tidak_ada.txt")',
                  assert:
                    'try:\n    muat_kunci("tidak_ada.txt")\n    raise AssertionError("seharusnya menolak berkas yang tidak ada")\nexcept ValueError as e:\n    assert "berkas tidak ada" in str(e), "pesan harus memuat: berkas tidak ada"',
                },
                {
                  name: { en: 'An empty file is refused', id: 'Berkas kosong ditolak' },
                  setup: 'with open("kunci_kosong.txt", "w") as _f:\n    _f.write("   \\n")',
                  assert:
                    'try:\n    muat_kunci("kunci_kosong.txt")\n    raise AssertionError("seharusnya menolak berkas kosong")\nexcept ValueError as e:\n    assert "kunci kosong" in str(e), "pesan harus memuat: kunci kosong"',
                },
              ],
              hints: [
                { en: 'Two separate failures, so two separate checks.', id: 'Dua kegagalan berbeda, jadi dua pemeriksaan berbeda.' },
                { en: 'try/except FileNotFoundError around the open.', id: 'try/except FileNotFoundError di sekitar open.' },
                { en: 'strip() first, then test whether what is left is empty.', id: 'strip() dulu, baru uji apakah sisanya kosong.' },
              ],
              solution:
                'def muat_kunci(nama):\n    try:\n        with open(nama) as f:\n            kunci = f.read().strip()\n    except FileNotFoundError:\n        raise ValueError("berkas tidak ada")\n    if not kunci:\n        raise ValueError("kunci kosong")\n    return kunci',
            },
          ],
        },
      ],
      project: {
        id: 'py-m9-s2-p',
        title: { en: 'API client', id: 'Klien API' },
        brief: {
          en: 'Wrap the whole API in one class: the key loaded from a file, the header built once, and every failure reported rather than crashing.',
          id: 'Bungkus seluruh API dalam satu class: kunci dimuat dari berkas, header dibangun sekali, dan setiap kegagalan dilaporkan alih-alih menjatuhkan program.',
        },
        requirements: [
          { en: '`Klien(berkas_kunci)` reads the key and raises `ValueError` when the file is missing.', id: '`Klien(berkas_kunci)` membaca kuncinya dan memunculkan `ValueError` bila berkasnya tidak ada.' },
          { en: '`daftar()` returns the list of students, or `[]` when the request fails.', id: '`daftar()` mengembalikan list siswa, atau `[]` bila permintaannya gagal.' },
          { en: '`ambil(sid)` returns one student dictionary, or `None` when not found.', id: '`ambil(sid)` mengembalikan satu dictionary siswa, atau `None` bila tidak ditemukan.' },
          { en: '`tambah(nama, nilai)` returns the new id, or `None` when refused.', id: '`tambah(nama, nilai)` mengembalikan id baru, atau `None` bila ditolak.' },
          { en: '`rata_rata()` returns the average score to one decimal, or 0 when there is nobody.', id: '`rata_rata()` mengembalikan rata-rata nilai satu desimal, atau 0 bila tidak ada siapa pun.' },
        ],
        starter:
          '# Klien API\nimport nunada_api\n\nBASE = "https://api.nunada.test"\n\nclass Klien:\n    def __init__(self, berkas_kunci):\n        pass\n',
        tests: [
          {
            name: { en: 'Loads the key and lists students', id: 'Memuat kunci dan mendaftar siswa' },
            setup:
              'import nunada_api\nnunada_api.reset()\nwith open("kunci.txt", "w") as _f:\n    _f.write(nunada_api.API_KEY + "\\n")',
            assert:
              'k = Klien("kunci.txt")\nd = k.daftar()\nassert len(d) == 3, "harus ada 3 siswa, dapat: " + repr(len(d))\nassert d[0]["nama"] == "Ani"',
          },
          {
            name: { en: 'Fetches one and reports a missing one', id: 'Mengambil satu dan melaporkan yang tidak ada' },
            setup:
              'import nunada_api\nnunada_api.reset()\nwith open("kunci.txt", "w") as _f:\n    _f.write(nunada_api.API_KEY + "\\n")',
            assert:
              'k = Klien("kunci.txt")\nassert k.ambil(2)["nama"] == "Budi"\nassert k.ambil(99) is None, "id yang tidak ada harus None"',
          },
          {
            name: { en: 'Adds a student and the average follows', id: 'Menambah siswa dan rata-ratanya mengikuti' },
            setup:
              'import nunada_api\nnunada_api.reset()\nwith open("kunci.txt", "w") as _f:\n    _f.write(nunada_api.API_KEY + "\\n")',
            assert:
              'k = Klien("kunci.txt")\nassert k.rata_rata() == 80.0, "rata-rata awal harus 80.0"\nsid = k.tambah("Dina", 100)\nassert sid == 4, "id baru harus 4"\nassert k.rata_rata() == 85.0, "rata-rata setelah Dina harus 85.0"',
          },
          {
            name: { en: 'A wrong key fails gracefully', id: 'Kunci salah gagal dengan rapi' },
            setup:
              'import nunada_api\nnunada_api.reset()\nwith open("kunci_salah.txt", "w") as _f:\n    _f.write("bukan-kunci\\n")',
            assert:
              'k = Klien("kunci_salah.txt")\nassert k.daftar() == [], "kunci salah harus memberi list kosong, bukan error"\nassert k.ambil(1) is None\nassert k.tambah("X", 1) is None\nassert k.rata_rata() == 0',
          },
          {
            name: { en: 'A missing key file is refused at construction', id: 'Berkas kunci yang hilang ditolak saat pembuatan' },
            setup: 'import os\nif os.path.exists("hilang.txt"):\n    os.remove("hilang.txt")',
            assert:
              'try:\n    Klien("hilang.txt")\n    raise AssertionError("seharusnya menolak berkas kunci yang tidak ada")\nexcept ValueError:\n    pass',
          },
        ],
        hints: [
          { en: 'Read the key in __init__ and build the headers dictionary once, as an attribute.', id: 'Baca kuncinya di __init__ dan bangun dictionary headers sekali saja, sebagai atribut.' },
          { en: 'Every method follows the same shape: send, check .ok, then unpack — or return the fallback.', id: 'Tiap method mengikuti bentuk sama: kirim, periksa .ok, lalu bongkar — atau kembalikan nilai cadangannya.' },
          { en: 'rata_rata can reuse daftar() instead of sending its own request.', id: 'rata_rata bisa memakai ulang daftar() alih-alih mengirim permintaan sendiri.' },
          {
            en: 'Guard the empty list before dividing, exactly like the gradebook in module 5.',
            id: 'Amankan list kosong sebelum membagi, persis seperti buku nilai di modul 5.',
          },
        ],
        solution:
          'import nunada_api\n\nBASE = "https://api.nunada.test"\n\nclass Klien:\n    def __init__(self, berkas_kunci):\n        try:\n            with open(berkas_kunci) as f:\n                kunci = f.read().strip()\n        except FileNotFoundError:\n            raise ValueError("berkas kunci tidak ada")\n        if not kunci:\n            raise ValueError("kunci kosong")\n        self.kunci = kunci\n        self.headers = {"Authorization": "Bearer " + kunci}\n\n    def daftar(self):\n        respons = nunada_api.get(BASE + "/siswa", headers=self.headers)\n        if not respons.ok:\n            return []\n        return respons.json()["data"]\n\n    def ambil(self, sid):\n        respons = nunada_api.get(f"{BASE}/siswa/{sid}", headers=self.headers)\n        if not respons.ok:\n            return None\n        return respons.json()["data"]\n\n    def tambah(self, nama, nilai):\n        respons = nunada_api.post(\n            BASE + "/siswa",\n            headers=self.headers,\n            json={"nama": nama, "nilai": nilai},\n        )\n        if not respons.ok:\n            return None\n        return respons.json()["data"]["id"]\n\n    def rata_rata(self):\n        siswa = self.daftar()\n        if not siswa:\n            return 0\n        return round(sum(s["nilai"] for s in siswa) / len(siswa), 1)',
        xp: 80,
      },
    },
  ],
}
