import type { Module } from '../types'

/** Module 4 — the closing module: surviving bad data, and one capstone that
 *  puts the whole course on a single page. */
export const module4: Module = {
  id: 'js-m4',
  title: { en: 'Code That Holds Up', id: 'Kode yang Tangguh' },
  summary: {
    en: 'Handle failure on purpose, and move data in and out safely.',
    id: 'Menangani kegagalan dengan sengaja, dan memindahkan data masuk-keluar dengan aman.',
  },
  submodules: [
    {
      id: 'js-m4-s1',
      title: { en: 'Errors and Data', id: 'Error dan Data' },
      summary: {
        en: 'try/catch, throwing your own, JSON, and the missing-value operators.',
        id: 'try/catch, memunculkan error sendiri, JSON, dan operator untuk nilai yang tidak ada.',
      },
      lessons: [
        {
          id: 'js-m4-s1-l1',
          title: { en: 'try, catch, throw', id: 'try, catch, throw' },
          goal: { en: 'Keep running after a failure.', id: 'Tetap berjalan setelah kegagalan.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'try runs it, catch handles it', id: 'try menjalankan, catch menangani' },
              body: {
                en: 'An uncaught error stops the script — and everything after it never runs. Put the risky line in `try` and the recovery in `catch`, and the program carries on.',
                id: 'Error yang tak tertangkap menghentikan skripnya — dan semua setelahnya tak pernah jalan. Taruh baris berisikonya di `try` dan pemulihannya di `catch`, maka programnya berlanjut.',
              },
              code: 'try {\n  const data = JSON.parse("bukan json");\n  console.log(data);\n} catch (err) {\n  console.log("gagal membaca data");\n}\n\nconsole.log("program lanjut");',
              output: 'gagal membaca data\nprogram lanjut',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'throw refuses, loudly', id: 'throw menolak, dengan lantang' },
              body: {
                en: 'A function that quietly returns a wrong answer is worse than one that refuses. `throw new Error("pesan")` stops it and hands the caller a reason they can read.',
                id: 'Fungsi yang diam-diam mengembalikan jawaban salah lebih buruk daripada yang menolak. `throw new Error("pesan")` menghentikannya dan memberi pemanggil alasan yang bisa dibaca.',
              },
              code: 'function akar(n) {\n  if (n < 0) {\n    throw new Error("tidak boleh negatif");\n  }\n  return Math.sqrt(n);\n}\n\ntry {\n  console.log(akar(9));\n  console.log(akar(-1));\n} catch (err) {\n  console.log("ditolak:", err.message);\n}',
              output: '3\nditolak: tidak boleh negatif',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Catch what you expected', id: 'Tangkap yang kamu perkirakan' },
              body: {
                en: 'A `catch` that swallows everything also swallows your own typos, and hides the bug you needed to see. Keep the `try` around the one risky line, not around half the program.',
                id: '`catch` yang menelan segalanya juga menelan salah ketikmu sendiri, dan menyembunyikan bug yang justru perlu kamu lihat. Jaga `try` tetap membungkus satu baris berisikonya, bukan separuh program.',
              },
              code: '// terlalu lebar: kesalahan apa pun ikut tertelan\ntry {\n  siapkan();\n  proses();\n  simpan();\n} catch (err) {\n  console.log("ada yang salah");\n}',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is logged?', id: 'Apa yang ditampilkan?' },
              code: 'function cek(n) {\n  if (n > 100) {\n    throw new Error("terlalu besar");\n  }\n  return n;\n}\n\ntry {\n  console.log(cek(5));\n  console.log(cek(500));\n} catch (err) {\n  console.log(err.message);\n}',
              options: [
                { en: '5 then terlalu besar', id: '5 lalu terlalu besar' },
                { en: 'terlalu besar only', id: 'hanya terlalu besar' },
                { en: '5 then 500', id: '5 lalu 500' },
                { en: '5 only', id: 'hanya 5' },
              ],
              answer: 0,
              explain: {
                en: 'The first call logs 5. The second throws, so the rest of the try is abandoned and catch runs.',
                id: 'Pemanggilan pertama menampilkan 5. Yang kedua melempar, jadi sisa try ditinggalkan dan catch yang jalan.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: { en: 'Refuse an empty name.', id: 'Tolak nama yang kosong.' },
              template: 'function daftar(nama) {\n  if (nama === "") {\n    ___ new Error("nama wajib diisi");\n  }\n  return nama;\n}',
              blanks: ['throw'],
              explain: {
                en: 'throw raises it; the caller decides whether to catch.',
                id: 'throw memunculkannya; pemanggil yang memutuskan apakah menangkapnya.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              js: true,
              prompt: {
                en: 'Write `bagi(a, b)` returning `a / b`, but throwing `Error("bagi nol")` when `b` is 0. Then write `amanBagi(a, b)` that calls it and returns the string `"tidak bisa"` instead of throwing.',
                id: 'Tulis `bagi(a, b)` yang mengembalikan `a / b`, tetapi melempar `Error("bagi nol")` bila `b` bernilai 0. Lalu tulis `amanBagi(a, b)` yang memanggilnya dan mengembalikan teks `"tidak bisa"` alih-alih melempar.',
              },
              starter: 'function bagi(a, b) {\n\n}\n\nfunction amanBagi(a, b) {\n\n}\n',
              tests: [
                {
                  name: { en: 'bagi divides', id: 'bagi membagi' },
                  check: 'assert(bagi(10, 4) === 2.5, "bagi(10, 4) harus 2.5, sekarang: " + JSON.stringify(bagi(10, 4)));',
                },
                {
                  name: { en: 'bagi throws with the right message', id: 'bagi melempar dengan pesan yang benar' },
                  check:
                    'var lempar = false;\ntry { bagi(5, 0); } catch (e) { lempar = true; assert(e.message === "bagi nol", "pesannya harus \\"bagi nol\\", sekarang: " + JSON.stringify(e.message)); }\nassert(lempar, "bagi(5, 0) seharusnya melempar Error");',
                },
                {
                  name: { en: 'amanBagi catches instead', id: 'amanBagi menangkapnya' },
                  check:
                    'assert(amanBagi(10, 4) === 2.5, "amanBagi(10, 4) harus 2.5");\nassert(amanBagi(5, 0) === "tidak bisa", "amanBagi(5, 0) harus \\"tidak bisa\\", sekarang: " + JSON.stringify(amanBagi(5, 0)));',
                },
                {
                  name: { en: 'amanBagi never throws', id: 'amanBagi tidak pernah melempar' },
                  check:
                    'try { amanBagi(1, 0); } catch (e) { assert(false, "amanBagi tidak boleh melempar — ia harus menangkapnya"); }',
                },
              ],
              hints: [
                { en: 'Guard before dividing, then throw.', id: 'Periksa sebelum membagi, lalu lempar.' },
                { en: 'amanBagi wraps the call in try/catch.', id: 'amanBagi membungkus pemanggilannya dalam try/catch.' },
                { en: 'return bagi(a, b) inside try; return "tidak bisa" inside catch.', id: 'return bagi(a, b) di dalam try; return "tidak bisa" di dalam catch.' },
              ],
              solution:
                'function bagi(a, b) {\n  if (b === 0) {\n    throw new Error("bagi nol");\n  }\n  return a / b;\n}\n\nfunction amanBagi(a, b) {\n  try {\n    return bagi(a, b);\n  } catch (err) {\n    return "tidak bisa";\n  }\n}',
            },
          ],
        },
        {
          id: 'js-m4-s1-l2',
          title: { en: 'JSON and missing values', id: 'JSON dan nilai yang tidak ada' },
          goal: { en: 'Move data across, and cope when a piece is absent.', id: 'Memindahkan data, dan bertahan saat satu bagiannya tidak ada.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'stringify out, parse in', id: 'stringify keluar, parse masuk' },
              body: {
                en: 'JSON is text, and text is what travels — to a server, into storage, into a file. `JSON.stringify` turns an object into that text; `JSON.parse` turns it back. Parsing is the risky half, because the text may be malformed.',
                id: 'JSON adalah teks, dan teks itulah yang bepergian — ke server, ke penyimpanan, ke berkas. `JSON.stringify` mengubah object menjadi teks itu; `JSON.parse` mengembalikannya. Parsing adalah bagian berisikonya, karena teksnya bisa saja rusak.',
              },
              code: 'const siswa = { nama: "Ani", nilai: 88 };\nconst teks = JSON.stringify(siswa);\n\nconsole.log(teks);\nconsole.log(typeof teks);\n\nconst kembali = JSON.parse(teks);\nconsole.log(kembali.nama);',
              output: '{"nama":"Ani","nilai":88}\nstring\nAni',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: '?. stops before it breaks', id: '?. berhenti sebelum ia patah' },
              body: {
                en: 'Reading `siswa.alamat.kota` when there is no `alamat` throws. Optional chaining `?.` gives `undefined` at the first missing link instead — useful exactly where data arrives from somewhere you do not control.',
                id: 'Membaca `siswa.alamat.kota` saat `alamat` tidak ada akan melempar error. Optional chaining `?.` justru memberi `undefined` pada mata rantai pertama yang hilang — berguna persis di tempat data datang dari sumber yang tak kamu kendalikan.',
              },
              code: 'const siswa = { nama: "Ani" };\n\nconsole.log(siswa.alamat?.kota);\nconsole.log(siswa.nama?.length);',
              output: 'undefined\n3',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: '?? fills a gap, || fills too much', id: '?? mengisi yang kosong, || mengisi terlalu banyak' },
              body: {
                en: '`??` supplies a fallback only for `null` and `undefined`. `||` does it for every falsy value, so a genuine `0` or `""` gets replaced too — a bug that hides for months.',
                id: '`??` menyediakan cadangan hanya untuk `null` dan `undefined`. `||` melakukannya untuk semua nilai falsy, sehingga `0` atau `""` yang sah ikut tergantikan — bug yang bersembunyi berbulan-bulan.',
              },
              code: 'const nilai = 0;\n\nconsole.log(nilai ?? 100);\nconsole.log(nilai || 100);',
              output: '0\n100',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A score of 0 is valid. Which fallback keeps it?',
                id: 'Nilai 0 itu sah. Cadangan mana yang mempertahankannya?',
              },
              options: [
                { en: 'nilai ?? 50', id: 'nilai ?? 50' },
                { en: 'nilai || 50', id: 'nilai || 50' },
                { en: 'Both keep it', id: 'Keduanya mempertahankannya' },
                { en: 'Neither keeps it', id: 'Keduanya tidak' },
              ],
              answer: 0,
              explain: {
                en: '0 is falsy, so || replaces it with 50. ?? only steps in for null and undefined.',
                id: '0 termasuk falsy, jadi || menggantinya dengan 50. ?? hanya turun tangan untuk null dan undefined.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              js: true,
              prompt: {
                en: 'Write `bacaProfil(teks)` that parses the JSON and returns `{ nama, kota }`. Use `"Tanpa nama"` when `nama` is missing, `"?"` when `alamat.kota` is missing, and return `null` when the text is not valid JSON.',
                id: 'Tulis `bacaProfil(teks)` yang mengurai JSON-nya dan mengembalikan `{ nama, kota }`. Pakai `"Tanpa nama"` bila `nama` tidak ada, `"?"` bila `alamat.kota` tidak ada, dan kembalikan `null` bila teksnya bukan JSON yang sah.',
              },
              starter: 'function bacaProfil(teks) {\n\n}\n',
              tests: [
                {
                  name: { en: 'A complete profile', id: 'Profil yang lengkap' },
                  check:
                    'var h = bacaProfil(\'{"nama":"Ani","alamat":{"kota":"Surabaya"}}\');\nassert(h.nama === "Ani" && h.kota === "Surabaya", "hasilnya: " + JSON.stringify(h));',
                },
                {
                  name: { en: 'Missing pieces get their fallbacks', id: 'Bagian yang hilang memakai cadangannya' },
                  check:
                    'var h = bacaProfil("{}");\nassert(h.nama === "Tanpa nama", "nama harus \\"Tanpa nama\\", sekarang: " + JSON.stringify(h.nama));\nassert(h.kota === "?", "kota harus \\"?\\", sekarang: " + JSON.stringify(h.kota));',
                },
                {
                  name: { en: 'An empty name is kept, not replaced', id: 'Nama kosong dipertahankan, bukan diganti' },
                  check:
                    'var h = bacaProfil(\'{"nama":""}\');\nassert(h.nama === "", "nama kosong itu sah — pakai ?? bukan ||, sekarang: " + JSON.stringify(h.nama));',
                },
                {
                  name: { en: 'Broken JSON gives null', id: 'JSON rusak memberi null' },
                  check:
                    'assert(bacaProfil("bukan json") === null, "teks rusak harus null, sekarang: " + JSON.stringify(bacaProfil("bukan json")));\nassert(error() === null, "jangan biarkan error lolos keluar: " + error());',
                },
              ],
              hints: [
                { en: 'Wrap only the JSON.parse in try/catch.', id: 'Bungkus hanya JSON.parse-nya dalam try/catch.' },
                { en: 'Optional chaining reaches the nested city safely.', id: 'Optional chaining menjangkau kota bersarangnya dengan aman.' },
                { en: 'data.alamat?.kota ?? "?"', id: 'data.alamat?.kota ?? "?"' },
              ],
              solution:
                'function bacaProfil(teks) {\n  let data;\n  try {\n    data = JSON.parse(teks);\n  } catch (err) {\n    return null;\n  }\n\n  return {\n    nama: data.nama ?? "Tanpa nama",\n    kota: data.alamat?.kota ?? "?",\n  };\n}',
            },
          ],
        },
      ],
      project: {
        id: 'js-m4-s1-p',
        runtime: 'web',
        js: true,
        html: '<h1>Catatan Nilai</h1>\n<form id="form">\n  <input id="nama" placeholder="Nama">\n  <input id="nilai" placeholder="Nilai">\n  <button type="submit">Tambah</button>\n</form>\n<p id="galat"></p>\n<p id="ringkas"></p>\n<ul id="daftar"></ul>',
        title: { en: 'Grade book', id: 'Buku nilai' },
        brief: {
          en: 'The whole course on one page: a form that refuses bad input, a rendered list, a live summary, and data that survives as JSON.',
          id: 'Seluruh kursus dalam satu halaman: formulir yang menolak masukan buruk, daftar yang dirender, ringkasan yang hidup, dan data yang bertahan sebagai JSON.',
        },
        requirements: [
          { en: 'Keep the records in an array named `kelas`.', id: 'Simpan catatannya dalam array bernama `kelas`.' },
          { en: 'Submitting adds `{ nama, nilai }` and clears both fields.', id: 'Submit menambahkan `{ nama, nilai }` dan mengosongkan kedua isian.' },
          { en: 'An empty name, or a score that is not a number from 0 to 100, is refused: `#galat` reads `Masukan tidak valid` and nothing is added.', id: 'Nama kosong, atau nilai yang bukan angka 0 sampai 100, ditolak: `#galat` bertuliskan `Masukan tidak valid` dan tidak ada yang ditambahkan.' },
          { en: 'A valid entry clears `#galat` and appends an `li` reading `Ani: 88`.', id: 'Masukan yang sah mengosongkan `#galat` dan menambahkan `li` bertuliskan `Ani: 88`.' },
          { en: '`#ringkas` reads `2 siswa, rata-rata 76.5`, or `Belum ada data` when empty.', id: '`#ringkas` bertuliskan `2 siswa, rata-rata 76.5`, atau `Belum ada data` bila kosong.' },
          { en: 'Expose `simpan()` returning the array as JSON text, and `muat(teks)` replacing it from JSON — returning false and changing nothing when the text is broken.', id: 'Sediakan `simpan()` yang mengembalikan array-nya sebagai teks JSON, dan `muat(teks)` yang menggantinya dari JSON — mengembalikan false dan tidak mengubah apa pun bila teksnya rusak.' },
        ],
        starter: 'const kelas = [];\n',
        tests: [
          {
            name: { en: 'A valid entry is added and rendered', id: 'Masukan yang sah ditambahkan dan dirender' },
            check:
              'function kirim(n, v) { sel("#nama").value = n; sel("#nilai").value = v; sel("#form").dispatchEvent(new Event("submit", { cancelable: true, bubbles: true })); }\nkirim("Ani", "88");\nassert(kelas.length === 1, "kelas harus berisi satu catatan, sekarang: " + kelas.length);\nassert(kelas[0].nama === "Ani" && kelas[0].nilai === 88, "catatannya: " + JSON.stringify(kelas[0]));\nassert(typeof kelas[0].nilai === "number", "nilai harus number, bukan string");\nassert(all("#daftar li")[0].textContent.trim() === "Ani: 88", "barisnya: " + JSON.stringify(all("#daftar li")[0].textContent.trim()));\nassert(sel("#nama").value === "" && sel("#nilai").value === "", "kedua isian harus dikosongkan");',
          },
          {
            name: { en: 'Bad input is refused', id: 'Masukan buruk ditolak' },
            check:
              'function kirim(n, v) { sel("#nama").value = n; sel("#nilai").value = v; sel("#form").dispatchEvent(new Event("submit", { cancelable: true, bubbles: true })); }\nvar sebelum = kelas.length;\nkirim("", "80");\nassert(kelas.length === sebelum, "nama kosong tidak boleh ditambahkan");\nassert(text("#galat") === "Masukan tidak valid", "#galat harus memberi tahu, sekarang: " + JSON.stringify(text("#galat")));\nkirim("Budi", "abc");\nkirim("Budi", "101");\nkirim("Budi", "-1");\nassert(kelas.length === sebelum, "nilai tidak valid tidak boleh ditambahkan, sekarang: " + kelas.length);',
          },
          {
            name: { en: 'Zero and 100 are valid', id: 'Nol dan 100 itu sah' },
            check:
              'function kirim(n, v) { sel("#nama").value = n; sel("#nilai").value = v; sel("#form").dispatchEvent(new Event("submit", { cancelable: true, bubbles: true })); }\nvar sebelum = kelas.length;\nkirim("Nol", "0");\nkirim("Seratus", "100");\nassert(kelas.length === sebelum + 2, "0 dan 100 harus diterima — periksa batas rentangmu");\nassert(text("#galat") === "", "#galat harus dikosongkan setelah masukan yang sah, sekarang: " + JSON.stringify(text("#galat")));',
          },
          {
            name: { en: 'The summary follows the data', id: 'Ringkasannya mengikuti datanya' },
            check:
              'var total = kelas.reduce(function (s, x) { return s + x.nilai; }, 0);\nvar rata = Math.round((total / kelas.length) * 10) / 10;\nvar mau = kelas.length + " siswa, rata-rata " + rata;\nassert(text("#ringkas") === mau, "#ringkas harus " + JSON.stringify(mau) + ", sekarang: " + JSON.stringify(text("#ringkas")));',
          },
          {
            name: { en: 'simpan and muat round-trip', id: 'simpan dan muat pulang-pergi' },
            check:
              'var teks = simpan();\nassert(typeof teks === "string", "simpan() harus mengembalikan teks, sekarang: " + typeof teks);\nvar salinan = JSON.parse(teks);\nassert(salinan.length === kelas.length, "JSON-nya harus memuat semua catatan");\nassert(muat(\'[{"nama":"Zaki","nilai":70}]\') === true, "muat() dengan JSON sah harus true");\nassert(kelas.length === 1 && kelas[0].nama === "Zaki", "kelas harus tergantikan, sekarang: " + JSON.stringify(kelas));\nassert(text("#ringkas") === "1 siswa, rata-rata 70", "ringkasannya harus ikut diperbarui, sekarang: " + JSON.stringify(text("#ringkas")));',
          },
          {
            name: { en: 'Broken JSON changes nothing', id: 'JSON rusak tidak mengubah apa pun' },
            check:
              'var sebelum = JSON.stringify(kelas);\nassert(muat("bukan json") === false, "muat() dengan teks rusak harus false");\nassert(JSON.stringify(kelas) === sebelum, "kelas tidak boleh berubah saat muat gagal");\nassert(error() === null, "jangan biarkan error lolos keluar: " + error());',
          },
          {
            name: { en: 'The empty state reads properly', id: 'Keadaan kosong terbaca benar' },
            check:
              'assert(muat("[]") === true, "muat(\\"[]\\") harus berhasil");\nassert(text("#ringkas") === "Belum ada data", "#ringkas harus \\"Belum ada data\\", sekarang: " + JSON.stringify(text("#ringkas")));\nassert(all("#daftar li").length === 0, "daftarnya harus kosong");',
          },
        ],
        hints: [
          { en: 'One `render()` redraws the list and the summary from `kelas`. Call it after every change and the two can never disagree.', id: 'Satu `render()` menggambar ulang daftar dan ringkasan dari `kelas`. Panggil setelah tiap perubahan, maka keduanya tak mungkin berselisih.' },
          { en: 'Empty the list with `daftar.textContent = ""` before redrawing, or the items pile up.', id: 'Kosongkan daftarnya dengan `daftar.textContent = ""` sebelum menggambar ulang, atau itemnya menumpuk.' },
          { en: '`Number("abc")` gives NaN — check with `Number.isNaN`, and check the 0–100 range separately.', id: '`Number("abc")` memberi NaN — periksa dengan `Number.isNaN`, dan periksa rentang 0–100 secara terpisah.' },
          { en: 'muat parses inside try/catch, and only replaces `kelas` once the parse succeeded.', id: 'muat mengurai di dalam try/catch, dan baru mengganti `kelas` setelah penguraiannya berhasil.' },
          { en: 'Replace the contents rather than the binding: `kelas.length = 0` then push, since `kelas` is a const.', id: 'Ganti isinya, bukan ikatannya: `kelas.length = 0` lalu push, karena `kelas` adalah const.' },
        ],
        solution:
          'const kelas = [];\n\nconst form = document.querySelector("#form");\nconst namaEl = document.querySelector("#nama");\nconst nilaiEl = document.querySelector("#nilai");\nconst galat = document.querySelector("#galat");\nconst ringkas = document.querySelector("#ringkas");\nconst daftar = document.querySelector("#daftar");\n\nfunction render() {\n  daftar.textContent = "";\n  for (const s of kelas) {\n    const li = document.createElement("li");\n    li.textContent = `${s.nama}: ${s.nilai}`;\n    daftar.append(li);\n  }\n\n  if (kelas.length === 0) {\n    ringkas.textContent = "Belum ada data";\n    return;\n  }\n\n  const total = kelas.reduce((jumlah, s) => jumlah + s.nilai, 0);\n  const rata = Math.round((total / kelas.length) * 10) / 10;\n  ringkas.textContent = `${kelas.length} siswa, rata-rata ${rata}`;\n}\n\nform.addEventListener("submit", (event) => {\n  event.preventDefault();\n\n  const nama = namaEl.value.trim();\n  const nilai = Number(nilaiEl.value);\n\n  if (nama === "" || nilaiEl.value.trim() === "" || Number.isNaN(nilai) || nilai < 0 || nilai > 100) {\n    galat.textContent = "Masukan tidak valid";\n    return;\n  }\n\n  galat.textContent = "";\n  kelas.push({ nama, nilai });\n  namaEl.value = "";\n  nilaiEl.value = "";\n  render();\n});\n\nfunction simpan() {\n  return JSON.stringify(kelas);\n}\n\nfunction muat(teks) {\n  let data;\n  try {\n    data = JSON.parse(teks);\n  } catch (err) {\n    return false;\n  }\n\n  if (!Array.isArray(data)) {\n    return false;\n  }\n\n  kelas.length = 0;\n  for (const s of data) {\n    kelas.push(s);\n  }\n  render();\n  return true;\n}\n\nrender();',
        xp: 80,
      },
    },
  ],
}
