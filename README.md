# Nunada Academy: Learn to Code

Aplikasi belajar coding berbasis web dengan pendekatan *scaffolding*: bantuan dilepas
selangkah demi selangkah, dan tiap submateri ditutup satu mini proyek yang diperiksa
oleh tes sungguhan. Antarmuka bisa diganti antara **English** dan **Bahasa Indonesia**
kapan saja.

Kursus yang sudah aktif: **Python** (9 modul), lalu **HTML**, **CSS**, **JavaScript**,
dan **React** (masing-masing 4 modul), ditambah jalur karier **Python Developer**.

## Menjalankan

```bash
npm install
npm run dev
```

Buka http://localhost:5180.

Tanpa kredensial Supabase, aplikasi otomatis berjalan dalam **mode lokal**: akun dan
progres disimpan di `localStorage` browser, lengkap dengan beberapa akun contoh agar
papan peringkat tidak kosong. Berguna untuk mencoba, **bukan** untuk dipakai sungguhan
(kata sandi hanya di-hash seadanya dan tersimpan di perangkat).

## Menghubungkan ke Supabase

1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor → New query**, tempel seluruh isi [`supabase/schema.sql`](supabase/schema.sql), jalankan.
   Berkas itu membuat tabel, trigger, RPC, dan seluruh kebijakan Row Level Security.
3. Di **Authentication → Providers**, pastikan Email aktif. Untuk pengembangan,
   matikan *Confirm email* agar bisa langsung masuk setelah mendaftar.
4. Salin `.env.example` menjadi `.env`, lalu isi dari **Project Settings → API**:

   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

5. Jalankan ulang `npm run dev`. Badge "Mode lokal" di kanan atas akan hilang.

Kunci `anon` memang untuk dipakai di sisi klien; yang menjaga data adalah RLS di
`schema.sql`, bukan kerahasiaan kunci itu. Jangan pernah menaruh `service_role` di sini.

## Identitas visual

Logo dan warnanya sama dengan add-in PowerPoint Nunada
(`PPT Add In/src/shared/theme.css`), supaya keduanya terbaca sebagai satu produk.

Logonya digambar ulang sebagai vektor di [`src/components/Logo.tsx`](src/components/Logo.tsx),
diukur dari `icon-128.png` milik add-in: lengkung "n" bertumpu pada garis tengah
beradius 26 dengan goresan setebal 26 berujung bulat, dan titiknya beradius 10,5 di
(106, 23) dalam kotak 128. Warnanya dipaku — terakota `#e16f47` dan emas `#dda52b` —
karena tanda merek yang berganti rona bukan lagi tanda yang sama.

Tiga penyimpangan yang disengaja dari palet add-in, semuanya dicatat di
[`src/styles.css`](src/styles.css):

1. **Tema gelap otomatis.** Add-in hanya gelap bila diminta karena diproyeksikan ke
   kelas; Academy dibaca sendirian, jadi ia mengikuti tema sistem. Warnanya yang
   disamakan, bukan perilakunya.
2. **Tombol utama memakai hijau hutan.** Add-in sudah begitu (`--accent-strong`);
   dicatat di sini karena hijau daun tampak menggoda dan hanya mencapai 2,5:1.
3. **`--muted`, `--good`, dan `--bad` digelapkan sedikit** dari `#6d8175`, `#4f8b56`,
   `#c0492b`. Rona sama, kecerahan turun: versi aslinya hanya mencapai 4,1 / 3,5 / 4,2
   banding 1 di atas krem, sementara kursus CSS aplikasi ini mengajarkan 4,5:1 di
   modul 1.2. Nilai penggantinya layak dipertimbangkan untuk add-in juga.

## Aturan permainan

| Hal | Aturan |
| --- | --- |
| XP | 20 per pelajaran, 50 per mini proyek, 80 untuk proyek besar |
| Hearts | maksimal 5; jawaban salah mengurangi 1; satu heart pulih tiap 15 menit |
| Hearts habis | pemeriksaan jawaban terkunci — tunggu, atau lanjut dalam mode latihan tanpa XP |
| Mini proyek | memeriksa proyek **tidak** memakan heart, karena proyek memang dikerjakan berulang |
| Papan peringkat mingguan | menjumlahkan XP sejak Senin 00:00 UTC; tidak ada proses reset, hanya jendela waktu |
| Trofi | otomatis diberikan dari progres (XP, jumlah proyek, modul/kursus/jalur yang tuntas) |
| Sertifikat | terbit sendiri saat sebuah kursus atau jalur karier tuntas 100% |

Hearts tidak disimpan sebagai angka yang di-*tick* tiap detik. Yang disimpan adalah
jumlah heart plus waktu mulai jam regenerasi, lalu nilai sekarang **diturunkan** saat
dibaca — di klien ([`src/lib/hearts.ts`](src/lib/hearts.ts)) maupun di database
(fungsi `resolve_hearts`). Jadi tidak ada cron job dan tidak ada penyimpangan antara
keduanya.

## Python di browser

Kode peserta dijalankan oleh [Pyodide](https://pyodide.org) — CPython asli yang
dikompilasi ke WebAssembly. Unduhan pertama sekitar 7 MB, setelah itu tersimpan di
cache browser. Tidak ada kode yang dikirim ke server mana pun.

Tiap pemeriksaan berjalan di *namespace* baru, sehingga latihan tidak saling bocor.
Saat memeriksa jawaban, `input()` dibayangi agar prompt tidak ikut tercetak ke output
yang dibandingkan; saat menekan **Run**, prompt tetap tampil seperti terminal sungguhan.

Yang **tidak** ikut baru tiap kali adalah filesystem-nya: satu instance Pyodide melayani
seluruh sesi. Karena itu tes punya kolom `setup` — Python yang jalan sebelum kode peserta,
dipakai untuk menyiapkan berkas yang dibutuhkan latihan sekaligus membersihkan sisa tes
sebelumnya.

### API tiruan untuk modul 9

Pyodide berada di dalam sandbox peramban, jadi `requests` tidak punya soket dan CORS
memblokir hampir semua host sungguhan — dan menyuruh peserta menempelkan kunci API asli
ke halaman web jelas nasihat yang buruk. Maka modul "Bekerja dengan API Privat" memakai
`nunada_api`, modul Python yang ditulis ke filesystem Pyodide saat startup
([`src/lib/pythonModules.ts`](src/lib/pythonModules.ts)).

Jaringannya disimulasikan, tetapi bentuk pemanggilannya sengaja dibuat sama persis dengan
API sungguhan: `Authorization: Bearer <kunci>`, kode status 200/201/400/401/404, badan
JSON. Jadi tidak ada yang perlu dilupakan peserta saat nanti berpindah ke `requests`.
Datanya disimpan di level modul, sehingga tes memanggil `nunada_api.reset()` di `setup`
agar satu POST tidak mencemari tes berikutnya.

## Isi kursus HTML

4 modul, 7 submateri, 14 pelajaran, 7 mini proyek, 660 XP:

| Modul | Isi |
| --- | --- |
| 1 Halaman Pertamamu | tag, elemen, kerangka dokumen, jenjang judul, penekanan bermakna |
| 2 Tautan, Gambar, Daftar | atribut, href, img dan alt, ul/ol, navigasi dari daftar |
| 3 Tabel dan Formulir | tr/th/td, caption, thead, colspan, input, label, select, textarea |
| 4 Struktur Semantik | header/nav/main/footer, article vs section, div/span, id vs class |

Aksesibilitas tidak dibuat modul terpisah — ia dijalin ke tempat kesalahannya benar-benar
terjadi: `alt` saat gambar diperkenalkan, `label for` saat input diperkenalkan, urutan
judul saat heading diperkenalkan.

## Menjalankan HTML di browser

Markup peserta dirender dalam iframe `sandbox="allow-scripts"` — tanpa
`allow-same-origin`, jadi halamannya berada di origin buram dan apa pun yang ditulis
peserta tidak bisa menyentuh halaman aplikasi.

Konsekuensinya: induk tidak bisa membaca `contentDocument` frame itu. Maka
pemeriksaannya **dijalankan di dalam frame** dan hasilnya dikirim balik lewat
`postMessage` ([`src/lib/web.ts`](src/lib/web.ts)). Rancangan ini sengaja dipilih agar
bisa dipakai ulang oleh CSS, JavaScript, dan React nanti — di sana skrip peserta justru
inti materinya.

Tiap `WebTest` berisi JavaScript dengan pembantu `sel`, `all`, `text`, `attr`, dan
`assert` yang sudah tersedia. Pesan pada `assert` itulah yang dibaca peserta saat gagal,
jadi tulislah dalam kalimat yang bisa langsung ditindaklanjuti.

## Isi kursus CSS

4 modul, 7 submateri, 14 pelajaran, 7 mini proyek, 660 XP. Prasyaratnya kursus HTML.

| Modul | Isi |
| --- | --- |
| 1 Aturan dan Selektor | anatomi aturan, class/id/keturunan, kespesifikan, tipografi, warna, kontras |
| 2 Model Kotak | padding/border/margin, box-sizing, max-width, block vs inline, memusatkan |
| 3 Tata Letak | flexbox (arah, gap, justify, align), grid (kolom, fr, span, auto-fit) |
| 4 Keadaan dan Layar | :hover dan :focus, transisi, media query, mobile-first |

Di kursus ini markup-nya **sudah disediakan** dan peserta hanya menulis CSS — sesuai
kerja nyata, dan menjaga fokus latihannya. Bidang `html` pada langkah `web` dan pada
mini proyek yang menyediakannya.

Aksesibilitas kembali dijalin, bukan dipisah: kontras dibahas saat warna diperkenalkan,
dan `:focus` diajarkan berdampingan dengan `:hover` — dengan alasannya, bukan sebagai
aturan hafalan.

## Memeriksa CSS

Dua hal yang perlu diketahui sebelum menulis tes CSS.

**Pemeriksaannya membaca gaya terhitung, bukan teks yang diketik.** Pembantu
`style(q, prop)` mengembalikan nilai hasil `getComputedStyle`, jadi `red`, `#f00`, dan
`rgb(255,0,0)` sama-sama lolos — sebagaimana mestinya. Konsekuensinya, `color` selalu
terbaca sebagai `rgb(...)` dan `grid-template-columns` terbaca sebagai piksel hasil,
bukan `repeat(3, 1fr)` yang ditulis. Karena itu tes grid menghitung jumlah jalur dan
membandingkan posisi, bukan mencocokkan teks deklarasinya.

**Sebagian aturan tidak terlihat oleh gaya terhitung sama sekali** — `:hover` saat
penunjuk tidak di sana, atau media query yang sedang tidak berlaku. Untuk itu ada
pembantu `css()` yang mengembalikan seluruh stylesheet sebagai teks. Yang diperiksa
adalah keberadaan aturannya, dan itulah klaim yang jujur untuk keadaan yang mustahil
dimasuki saat pemeriksaan berjalan.

Satu jebakan yang sudah dibereskan dan sebaiknya tidak diperkenalkan lagi: pemeriksaan
tidak boleh dijalankan pada `DOMContentLoaded`, karena frame-nya sudah terurai tetapi
belum di-*layout* — `getBoundingClientRect` mengembalikan 0. Runner-nya menunggu `load`
lalu membaca `offsetHeight` untuk memaksa layout. `requestAnimationFrame` **tidak** bisa
dipakai untuk ini: frame-nya berada di luar viewport dan peramban berhenti melayani rAF
di sana, sehingga penantiannya tak pernah selesai.

## Isi kursus JavaScript

4 modul, 7 submateri, 14 pelajaran, 7 mini proyek, 660 XP.

| Modul | Isi |
| --- | --- |
| 1 Nilai dan Logika | console.log, const/let, tipe, template literal, === vs ==, if/else, falsy, loop |
| 2 Fungsi dan Koleksi | return, arrow function, nilai bawaan, scope, array, object, map/filter/reduce |
| 3 Bekerja dengan Halaman | querySelector, textContent vs innerHTML, classList, createElement, event, form |
| 4 Kode yang Tangguh | try/catch/throw, JSON, optional chaining, `??` vs `\|\|`, proyek akhir |

Modul 1 dan 2 murni logika: tidak ada HTML, dan hasilnya dibaca lewat `console.log`.
Modul 3 dan 4 menyediakan markup, sehingga peserta menulis skrip terhadap halaman
sungguhan dan melihatnya berubah.

## Menjalankan JavaScript peserta

Skrip peserta disisipkan sebagai **classic script**, bukan module. Itu disengaja: skrip
klasik berbagi cakupan global frame-nya, sehingga pemeriksaan bisa menyebut langsung
nama tingkat atas milik peserta — termasuk `const` dan `let`, yang tidak pernah mendarat
di `window`. Pemeriksaannya sendiri dievaluasi lewat *indirect eval* agar berada di
cakupan global yang sama.

`console.log` ditangkap oleh skrip kecil yang dipasang **sebelum** kode peserta, dan
tetap meneruskan ke konsol asli agar devtools tetap berguna. Pemeriksaan membacanya
lewat `logs()`, `out()`, dan `error()`.

Pratinjaunya juga menerima aliran log itu lewat `postMessage`, jadi latihan modul 1–2
yang tidak punya halaman menampilkan panel konsol yang hidup alih-alih bingkai kosong.

Untuk kejadian, pemeriksaan memicu sendiri event-nya lalu membaca akibatnya —
`sel("#tombol").click()` atau `dispatchEvent(new Event("submit", { cancelable: true }))`
— sehingga yang dibuktikan adalah penangannya benar-benar terpasang dan benar, bukan
sekadar ada teks tertentu di kode.

## Isi kursus React

4 modul, 7 submateri, 14 pelajaran, 7 mini proyek, 660 XP. Prasyaratnya HTML, CSS,
dan JavaScript.

| Modul | Isi |
| --- | --- |
| 1 Komponen dan JSX | JSX, className, komponen, props, map + key, && dan ternary |
| 2 State dan Interaksi | useState, event handler, pembaruan fungsional, imutabilitas, input terkendali, mengangkat state |
| 3 Komposisi dan Efek | children, memecah komponen, menurunkan alih-alih menyimpan, useEffect dan dependensinya |
| 4 Aplikasi Utuh | custom hook, kepemilikan state, aplikasi kecil yang utuh |

Modul 3 sengaja menekan satu gagasan: sebagian besar hal yang membuat pemula meraih
`useEffect` sebenarnya cukup dihitung saat render. Latihannya memberi nilai pada yang
menurunkan, bukan yang menyimpan.

## Menjalankan React peserta

Ini bagian yang paling banyak menuntut penyesuaian, dan sebagian besar keputusannya
lahir dari pengukuran, bukan dugaan.

**JSX ditranspilasi di aplikasi induk, bukan di dalam frame.** Rencana awalnya memuat
Babel lewat `<script src>` di dalam frame. Ternyata frame ber-`sandbox="allow-scripts"`
tanpa `allow-same-origin` berada di origin buram, dan **peramban memblokir seluruh
pemuatan subresource-nya** — terbukti karena frame yang sama berhasil begitu
`allow-same-origin` ditambahkan, yaitu izin yang justru akan membuat skrip peserta bisa
menjangkau DOM aplikasi dan sesi Supabase-nya. Sandbox yang ketat lebih berharga
daripada kemudahannya.

Maka: React dan ReactDOM disisipkan sebagai teks ke dalam dokumennya, dan JSX
ditranspilasi di aplikasi lewat `@babel/standalone` yang diimpor dinamis
([`src/lib/reactRuntime.ts`](src/lib/reactRuntime.ts)). Babel 2,3 MB — dimuat sekali,
malas, jauh lebih baik daripada 40 kali. Efek sampingnya menyenangkan: JSX yang belum
selesai diketik dilaporkan sebagai *syntax error* beserta cuplikan barisnya, bukan
sebagai kesenyapan.

**Pemeriksaan berjalan asinkron.** React melakukan commit setelah penangan yang
memicunya selesai, jadi pemeriksaan yang membaca DOM tepat setelah klik akan melihat
nilai lama. Tersedia `await click(q)` dan `await tick(ms)`.

**`setTimeout` tidak dipakai untuk menunggu.** Frame-nya berada di luar viewport, dan di
sana peramban meredam timer sampai ~1 detik. Gejalanya: tiga proyek React kehabisan
waktu, dan setiap frame di semua kursus web diam-diam memakan sedetik. Penantiannya kini
memakai `MessageChannel` — makrotask sungguhan yang tidak diredam, mekanisme yang sama
dipakai penjadwal React sendiri. Proyek yang tadinya habis waktu di 8 detik kini selesai
dalam 24 milidetik.

Dua hal yang perlu diingat saat menulis materi React:

- Pemeriksaan **tidak** ikut ditranspilasi. Untuk merender komponen peserta dari dalam
  sebuah pemeriksaan, pakai `React.createElement(Komponen, props)`, bukan JSX.
- Semua pemeriksaan dalam satu tes berbagi **satu halaman**, berurutan. Pemeriksaan yang
  mengklik tidak boleh menganggap dirinya mulai dari nol: baca nilainya dulu, bertindak,
  lalu bandingkan dengan yang tadi dibaca.

## Struktur

```
src/
  content/          kurikulum — data murni, dwibahasa
    types.ts        model Course → Module → Submodule → Lesson → Step
    catalog.ts      daftar kursus & jalur karier (termasuk yang belum tersedia)
    trophies.ts     trofi statis
    python/         kursus Python: m1-basics … m9-private-apis
    html/           kursus HTML: m1-document … m4-semantics
    css/            kursus CSS: m1-rules … m4-states
    javascript/     kursus JavaScript: m1-values … m4-robust
    react/          kursus React: m1-components … m4-app
  lib/
    db.ts           kontrak yang harus dipenuhi setiap backend
    backends/       supabase.ts (asli) + local.ts (localStorage) + pemilihnya
    python.ts       pemuat Pyodide, runner, dan pemeriksa tes
    web.ts          runner iframe tersandbox untuk HTML, CSS, JavaScript, React
    reactRuntime.ts React/ReactDOM sebagai teks + transpilasi JSX lewat Babel
    pythonModules.ts modul Python yang ditanam ke filesystem Pyodide (API tiruan)
    hearts.ts       ekonomi heart
    progress.ts     turunan: apa yang terbuka, tuntas, dan diperoleh
    week.ts         batas minggu (Senin UTC), disamakan dengan Postgres
  app/store.tsx     satu sumber kebenaran untuk sesi + progres
  components/       Layout, StepView (pemutar langkah), results.tsx, ui.tsx
  pages/            Landing, Auth, Dashboard, Catalog, CourseMap, Lesson,
                    Project, Playground, Leaderboard, Profile, Certificate
supabase/schema.sql skema, RPC, dan RLS
```

## Bentuk scaffolding

Tiap pelajaran menurunkan bantuan secara bertahap lewat lima jenis langkah
(lihat `Step` di [`src/content/types.ts`](src/content/types.ts)):

| Jenis | Yang dilakukan peserta | Bantuan |
| --- | --- | --- |
| `concept` | membaca penjelasan + contoh yang sudah jadi | penuh |
| `quiz` | menebak keluaran sebelum menjalankannya | tinggi |
| `fill` | mengisi bagian kosong pada kode yang hampir lengkap | sedang |
| `order` | menyusun baris yang sudah benar ke urutan yang tepat | rendah |
| `code` | menulis sendiri, diperiksa tes, petunjuk muncul bila diminta | minimal |
| `web` | sama seperti `code`, tetapi menulis markup, CSS, JavaScript, atau JSX dan melihat hasilnya langsung | minimal |

Mini proyek di akhir submateri adalah tahap tanpa penopang: hanya daftar syarat,
editor kosong, dan tes.

## Menambah materi

Kurikulum adalah data biasa, jadi menambah pelajaran berarti menambah objek — tidak
ada komponen baru yang perlu ditulis.

1. Buka berkas modul di `src/content/python/`, atau buat modul baru dan daftarkan di
   `src/content/python/index.ts`.
2. Tambahkan `Lesson` ke `lessons`, atau ubah `project` pada submateri.
3. Isi `en` dan `id` untuk setiap teks — `Loc` mewajibkan keduanya, jadi teks yang
   belum diterjemahkan akan ketahuan sebagai galat TypeScript.
4. Untuk langkah `code` dan mini proyek, tulis `solution` yang benar. Tes bisa
   menyiapkan keadaan lebih dulu (`setup`), memberi masukan (`stdin`), membandingkan
   keluaran (`expectOutput`), memeriksa potongan teks (`expectContains`), atau
   menjalankan Python tambahan di namespace yang sama (`assert`).

Untuk membuka kursus yang masih "Segera hadir", ubah `available: true` di
`src/content/catalog.ts` dan isi `modules`-nya.

### Memastikan materi baru tidak rusak

Jalankan potongan berikut di konsol browser (saat `npm run dev` aktif). Ia menjalankan
**setiap** solusi acuan terhadap tesnya sendiri, lalu memastikan tidak ada tes yang
lolos hanya dengan kode awal:

Untuk kursus Python:

```js
const py = await import('/src/lib/python.ts')
const { pythonCourse } = await import('/src/content/python/index.ts')
const bad = []
for (const m of pythonCourse.modules)
  for (const s of m.submodules) {
    for (const l of s.lessons)
      for (const st of l.steps)
        if (st.kind === 'code') {
          if ((await py.runTests(st.solution, st.tests)).some(o => !o.passed)) bad.push(['solusi gagal', st.id])
          if ((await py.runTests(st.starter, st.tests)).every(o => o.passed)) bad.push(['tes kosong', st.id])
        }
    if ((await py.runTests(s.project.solution, s.project.tests)).some(o => !o.passed)) bad.push(['solusi gagal', s.project.id])
    if ((await py.runTests(s.project.starter, s.project.tests)).every(o => o.passed)) bad.push(['tes kosong', s.project.id])
  }
bad
```

Hasil `[]` berarti aman.

Untuk kursus HTML, polanya sama dengan runner web. Ia lebih lambat karena tiap
pemeriksaan merender iframe sungguhan, jadi simpan hasilnya lalu baca belakangan:

```js
window.__cek = { done: false }
;(async () => {
  const web = await import('/src/lib/web.ts')
  const { htmlCourse } = await import('/src/content/html/index.ts')
  const bad = []
  for (const m of htmlCourse.modules)
    for (const s of m.submodules) {
      for (const l of s.lessons)
        for (const st of l.steps)
          if (st.kind === 'web') {
            if ((await web.runWebTests(st.solution, st.tests)).some(o => !o.passed)) bad.push(['solusi gagal', st.id])
            if ((await web.runWebTests(st.starter, st.tests)).every(o => o.passed)) bad.push(['tes kosong', st.id])
          }
      if ((await web.runWebTests(s.project.solution, s.project.tests)).some(o => !o.passed)) bad.push(['solusi gagal', s.project.id])
      if ((await web.runWebTests(s.project.starter, s.project.tests)).every(o => o.passed)) bad.push(['tes kosong', s.project.id])
    }
  window.__cek = { done: true, bad }
})()
```

Tunggu sebentar, lalu periksa `window.__cek`.

Untuk kursus CSS, JavaScript, dan React, sama persis tetapi `html`, `js`, dan `react`
harus ikut dioper:

```js
await web.runWebTests(st.solution, st.tests, st.html, st.js, st.react)
```

## Isi kursus Python

9 modul, 18 submateri, 37 pelajaran, 18 mini proyek, 1700 XP:

| Modul | Isi |
| --- | --- |
| 1 Mulai dari Nol | print, komentar, variabel, tipe data, f-string, input |
| 2 Membuat Keputusan | perbandingan, bool, and/or/not, if/elif/else |
| 3 Mengulang Pekerjaan | for, range, akumulator, while, break/continue |
| 4 Koleksi Data | list, indeks, method, dictionary, items() |
| 5 Fungsi | def, return, parameter bawaan, komposisi, scope |
| 6 Ketika Terjadi Kesalahan | try/except, jenis error, validasi input, raise |
| 7 Berkas | tulis/baca, with, split/join, berkas terstruktur |
| 8 Objek | class, __init__, method, __str__, list objek, pewarisan |
| 9 Bekerja dengan API Privat | kunci API, header bearer, kode status, JSON, POST, menjaga rahasia |

## Peta jalan

Katalog sudah menampilkan HTML, CSS, JavaScript, SQL, TypeScript, React, dan Game
Development beserta prasyaratnya, juga jalur Front-End, Back-End, dan Full-Stack —
semuanya bertanda "Segera hadir" sampai materinya ditulis. Playground pun sudah
menyiapkan tempat untuk static website, React app, React app + router, dan JavaScript;
saat ini hanya Python yang aktif.
