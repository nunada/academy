# Nunada Academy: Coding & Matematika

Aplikasi belajar berbasis web dengan pendekatan *scaffolding*: bantuan dilepas
selangkah demi selangkah, dan tiap submateri ditutup satu mini proyek yang diperiksa
oleh tes sungguhan. Antarmuka bisa diganti antara **English** dan **Bahasa Indonesia**
kapan saja.

Kursus pemrograman: **Python** (9 modul), **C++** (4 modul — interpreter JSCPP,
bukan kompiler sungguhan; lihat [Menjalankan C++ peserta](#menjalankan-c-peserta)),
lalu **HTML**, **CSS**, **JavaScript**, **SQL**, **TypeScript**, **React**, dan
**Game Development** (masing-masing 4 modul), ditambah tiga kursus Python bercita
rasa matematika (**Dasar**, **Media Pembelajaran**, **Numerik**) dan jalur karier
**Python Developer**, **Front-End**, **Back-End**, serta **Full-Stack Developer**.

Kursus matematika — dikerjakan di kertas, dijawab di kotak, bukan diketik sebagai
program. **Fungsi dan Grafik** (5 modul, 29 pelajaran, 10 kumpulan soal): domain dan
range, komposisi dan transformasi, trigonometri, eksponen, invers, dan logaritma —
bab pembuka kalkulus. **Vektor di Bidang dan di Ruang** (5 modul, 22 pelajaran, 10
kumpulan soal): dari notasi dan komponen sampai perkalian titik, perkalian silang,
serta garis dan bidang di ruang. Keduanya berdiri sendiri; mesinnya dijelaskan di
[Kursus matematika](#kursus-matematika).

Katalog dan halaman depan memisahkan keduanya: matematika satu baris, pemrograman
satu baris lagi. `CourseInfo.track` yang menentukannya, dan itu pertanyaan yang
berbeda dari `language` — ketiga kursus Python-bercita-rasa-matematika tetap masuk
`code`, sebab pembelajarnya menulis program dan sebuah runtime yang memeriksanya.

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
   Aman dijalankan ulang, dan **harus** dijalankan ulang pada proyek yang sudah
   terpasang sebelum pemisahan papan peringkat: `xp_events` mendapat kolom
   `course_id`, dan kedua fungsi papan XP berganti tanda tangan. Baris lama
   diisikan sendiri oleh berkas itu dari tabel `progress`.
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

Yang **tidak** dijaga RLS adalah fungsi RPC: Supabase memberikan EXECUTE kepada `anon`
secara bawaan, jadi `schema.sql` mencabutnya lalu memberikannya kepada `authenticated` —
kecuali `username_available`, yang harus bisa dipanggil sebelum akunnya ada.
`npm run check:grants` memeriksa keduanya terhadap proyek sungguhan: papan peringkat dan
fungsi heart harus **ditolak** tanpa login, dan pemeriksa nama harus **diterima**. Uji
dua arah itu disengaja — pemeriksa yang hanya menunggu "ditolak" akan lulus dengan riang
pada proyek yang semua fungsinya sudah terhapus. Ia hanya membaca; tak ada yang ditulis
dan tak ada akun yang dibuat.

Jalankan itu setiap kali kamu menambahkan RPC atau menjalankan ulang salah satunya —
menjalankan ulang adalah saat sebuah pencabutan hak paling mungkin lenyap diam-diam.

## Menerbitkan ke GitHub Pages

Alur kerjanya sudah ada di
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): tiap dorongan ke
`main` atau `master` membangun aplikasinya dan menerbitkannya. Yang tersisa hanya
empat langkah, dan semuanya sekali saja.

1. **Buat repositori dan dorong.** Belum ada remote di sini.

   ```bash
   git remote add origin https://github.com/<kamu>/<repo>.git && git push -u origin master
   ```

2. **Settings → Pages → Source: GitHub Actions.** Bukan "Deploy from a branch".

3. **Settings → Secrets and variables → Actions**, tambahkan `VITE_SUPABASE_URL`
   dan `VITE_SUPABASE_ANON_KEY`. Namanya masuk ke kolom *Name*; kolom *Secret*
   diisi **nilainya saja** — bagian di sebelah kanan tanda `=` di `.env`, tanpa
   nama, tanpa tanda kutip, tanpa spasi di ujung. Menyalin satu baris `.env`
   bulat-bulat adalah kekeliruan yang paling gampang terjadi di sini, dan
   dulu ia menghasilkan situs yang terbit tanpa keluhan lalu tampil kosong.
   Sekarang alur kerjanya menolaknya sebelum membangun — sama seperti kalau
   secret-nya memang tidak ada, dan sama-sama disengaja: build tanpa kunci yang
   berfungsi menghasilkan aplikasi mode lokal yang tampak baik-baik saja dan
   diam-diam tidak menyimpan apa pun.

4. **Supabase → Authentication → URL Configuration.** Setel **Site URL** ke
   alamat situsmu, lalu tambahkan **dua** alamat ke **Redirect URLs**:

   ```
   https://<kamu>.github.io/<repo>/
   https://<kamu>.github.io/<repo>/reset-password
   ```

   Yang pertama untuk tautan konfirmasi pendaftaran; tanpa itu tautannya
   menunjuk ke `localhost` dan tak seorang pun bisa menyelesaikan
   pendaftarannya. Yang kedua untuk tautan lupa-sandi; tanpa itu Supabase
   menolak mengarahkan orangnya ke sana dan tautannya tampak rusak. Satu pola
   `https://<kamu>.github.io/<repo>/**` juga menutupi keduanya.

### Yang sudah disiapkan, dan mengapa

**Subjalur.** Situs proyek GitHub Pages berada di
`https://<kamu>.github.io/<repo>/`, bukan di akar domain. Alur kerjanya membaca
nama repositorimu dan mengoperkannya sebagai `VITE_BASE`; Vite memakainya untuk
tiap aset, dan router membacanya kembali lewat `import.meta.env.BASE_URL` sebagai
`basename`. Satu setelan menggerakkan keduanya. Repositori bernama
`<kamu>.github.io` dikenali dan memakai `/`.

**Muat ulang di URL dalam.** Pages tidak punya aturan penulisan ulang, jadi
menyegarkan `/course/sql/lesson/…` seharusnya 404 — berkasnya memang tidak ada;
rutenya baru bermakna setelah aplikasinya berjalan. Yang dipunyai Pages adalah
`404.html`, yang ia sajikan untuk jalur apa pun yang tak ditemukannya. Build
menyalin `index.html` ke sana, jadi aplikasinya boot, router membaca alamatnya,
dan pembelajar mendarat di tempat yang ia tuju.

Ini diuji sebelum dipakai, bukan diasumsikan: sebuah tiruan Pages menyajikan
build subjalur dengan perilaku yang sama — `404.html` pada status 404, bukan
penulisan ulang — dan URL pelajaran yang diketik langsung tetap memuat langkah
yang benar, dengan kedelapan potongan kursusnya, tanpa satu pun aset gagal.

Satu akibat yang perlu diketahui: halaman-halaman itu dijawab dengan status HTTP
404. Peramban mengabaikannya, perayap tidak. Untuk aplikasi yang harus dimasuki
dulu itu tidak masalah; kalau suatu saat kamu ingin halaman depannya terindeks,
di situlah GitHub Pages berhenti cocok.

**Membangun subjalur secara lokal.** Di Git Bash pada Windows, MSYS mengubah
`VITE_BASE=/repo/` menjadi jalur Windows. Awali dengan `MSYS_NO_PATHCONV=1`:

```bash
MSYS_NO_PATHCONV=1 VITE_BASE=/nunada-academy/ npm run build
```

### Sebelum orang lain mendaftar

- Jalankan `npm run check:grants` — papan peringkat dan ketiga fungsi guru harus
  tertutup bagi `anon`, pemeriksa nama harus terbuka.
- Periksa **Authentication → Providers → Email** di Supabase: kalau konfirmasi
  surel menyala, pastikan langkah 4 sudah dilakukan dan cobalah satu pendaftaran
  sungguhan sampai selesai.
- Angkat dirimu sendiri jadi guru (lihat di bawah) lalu buka **Kelas** sekali,
  supaya kamu tahu halamannya memuat sebelum ada yang perlu kamu lihat di sana.
- Domain khusus: **Settings → Pages → Custom domain**. Setelah dipasang, situsnya
  pindah ke akar domain — hapus `VITE_BASE` dari alur kerjanya (atau ganti jadi
  `/`), lalu perbarui Site URL di Supabase.

### Surel pendaftaran: dua per jam, sampai kamu menggantinya

SMTP bawaan Supabase mengirim **dua surel per jam untuk seluruh proyek**. Bukan
dua per orang — dua, titik. Satu kelas yang mendaftar bersamaan berarti orang
ketiga menunggu satu jam, dan orang kelima belas menunggu tujuh jam. Batas itu
tidak bisa dinaikkan; ia hanya hilang kalau kamu memakai SMTP sendiri.

Ada dua jalan keluar, dan yang kedua sah untuk kelas kecil.

**1. Pasang SMTP sendiri.** Buka **Authentication → SMTP Settings**
(`/project/_/auth/smtp`), nyalakan *Enable Custom SMTP*, lalu isi enam kolomnya
dari penyedia yang kamu pakai:

| Kolom | Contoh |
| --- | --- |
| SMTP Host | `smtp.resend.com` |
| SMTP Port | `587` |
| SMTP User | dari penyedia |
| SMTP Password | dari penyedia |
| From Address | `no-reply@domainmu.sch.id` |
| Sender Name | `Nunada Academy` |

Resend, Brevo, Postmark, SendGrid, AWS SES, dan ZeptoMail semuanya cocok; yang
gratisnya paling lega biasanya Brevo dan Resend. Alamat pengirimnya harus di
domain yang kamu kendalikan dan sudah diverifikasi di sisi penyedia — kalau
tidak, surelnya terkirim tapi mendarat di folder spam.

**Lalu naikkan batasnya.** Ini bagian yang mudah terlewat: menyalakan SMTP
sendiri justru memasang batas baru **30 surel per jam**, dan itu masih kurang
untuk satu kelas yang mendaftar serentak. Ubah di **Authentication → Rate
Limits** (`/project/_/auth/rate-limits`), pada *Rate limit for sending emails*.
Tanpa langkah ini kamu sudah membayar penyedia surel dan tetap tertahan.

**2. Matikan konfirmasi surel.** **Authentication → Providers → Email**, matikan
*Confirm email*. Pendaftaran langsung jadi tanpa perlu surel apa pun, dan
seluruh soal ini hilang. Yang kamu lepas adalah bukti bahwa alamat surelnya
benar-benar milik si pendaftar — untuk kelas yang orangnya kamu kenal, itu
harga yang wajar; untuk pendaftaran terbuka, tidak.

### Kalau ada yang lupa kata sandinya

Ada tautan **"Lupa kata sandi?"** di halaman masuk. Orangnya mengetik alamat
surelnya, menerima tautan, memilih sandi baru, dan langsung masuk. Tautannya
sekali pakai dan kedaluwarsa dalam sejam; meminta yang baru membatalkan yang
lama. Yang sudah ingat sandinya tapi ingin menggantinya bisa lewat **Profil →
Ganti kata sandi**.

Halamannya menjawab hal yang sama untuk alamat yang terdaftar maupun yang
tidak. Itu disengaja: memberi tahu orang asing alamat mana yang punya akun
adalah kebocoran tersendiri, dan Supabase menolak melakukannya, jadi mode lokal
menolak juga.

Dua hal yang menggagalkannya, dan keduanya di luar kode:

- Alamat `/reset-password` harus ada di **Redirect URLs** (langkah 4 di atas).
- Surelnya lewat jalur yang sama dengan konfirmasi pendaftaran, jadi **batas dua
  per jam itu berlaku di sini juga**. Kalau kamu mematikan konfirmasi surel agar
  pendaftaran lancar, pemulihan sandi tetap butuh surel — ini alasan tersendiri
  untuk memasang SMTP.

Di mode lokal tidak ada surel sama sekali, jadi tautannya ditampilkan di layar.
Itu bukan jalan pintas yang ikut terbit: mode lokal hanya aktif saat kunci
Supabase tidak ada, dan build yang terbit selalu punya kuncinya.

### Melihat capaian pembelajar

Dua cara. Keduanya membaca baris yang sama, dan tak satu pun menulis apa pun.

**Halaman Kelas, di dalam aplikasi.** Muncul di navigasi hanya untuk akun
bertanda guru. Isinya satu baris per pembelajar — XP, pelajaran, proyek, trofi,
sertifikat, dan kapan terakhir ia menyelesaikan sesuatu — plus tab kedua yang
menunjukkan sejauh mana tiap orang di satu kursus. Kolom yang paling berguna
biasanya yang paling kanan: "Belum mulai" dan "10 hari lalu" ditandai warna,
karena itulah yang dicari saat kamu memindai daftarnya.

Angkat seseorang jadi guru dari **SQL Editor**:

```sql
update public.profiles set role = 'teacher' where username = 'nama_penggunanya';
```

Hanya dari sana. Basis datanya menolak pernyataan itu kalau datang dari
aplikasi — dua kali, lewat hibah kolom dan lewat trigger — supaya tidak ada
pembelajar yang bisa mengangkat dirinya sendiri lalu membaca data satu kelas.

**Empat kueri di SQL Editor**, untuk yang tidak muat di halaman:
[`supabase/reports.sql`](supabase/reports.sql) — satu baris per pembelajar,
sejauh mana tiap orang di tiap kursus, siapa yang seminggu tak menyentuh apa
pun, dan butir mana yang paling sering menjadi tempat orang berhenti. Tempel
seluruh berkasnya, lalu sorot satu kueri dan tekan Ctrl+Enter; menjalankan
semuanya sekaligus hanya menampilkan hasil yang terakhir.

Angka pembagi di kueri kedua — berapa pelajaran yang dimiliki tiap kursus —
tinggal di kurikulum, bukan di basis data, jadi ia ditulis ulang di sana dan
harus dijaga tetap seiring; `npm run check:curriculum` yang membuktikan angka
itu masih cocok. Kursus yang tak ada di daftarnya menghasilkan persentase
kosong, bukan persentase yang keliru. Halaman Kelas tidak punya soal itu: ia
memakai angka yang sudah dipakai kartu kursus, jadi hanya ada satu salinan.

## Papan peringkat, dua babak

XP matematika dan XP pemrograman tidak lagi diadu dalam satu kolom. Mengadu
keduanya membandingkan dua jenis pekerjaan yang berbeda, dan mengubur orang yang
mengerjakan salah satunya dengan baik di bawah semua orang yang mengerjakan yang
lain. Papan XP mingguan dan sepanjang masa kini bisa dipersempit ke satu jalur.

Papan **trofi** tidak ikut disaring, dan itu disengaja: "kumpulkan 100 XP total"
tidak dimiliki jalur mana pun. Penyaringnya hanya muncul di tab yang memang
berarti.

Yang dikirim aplikasi ke basis data adalah **daftar id kursus**, bukan nama
jalurnya. Keanggotaan jalur diputuskan `content/catalog.ts`; menyalin tabel itu
ke dalam basis data hanya akan memberinya tempat kedua untuk salah. Dua RPC-nya
menerima `p_courses text[] default null`, dan `null` berarti semuanya — persis
perilaku versi lama, sehingga pemanggilan tanpa argumen itu tetap sah.

`xp_events` mendapat kolom `course_id` untuk ini. Baris lama diisikan dari
`progress` dengan mencocokkan `source` terhadap `kind || ':' || item_id` — nilai
yang memang ditulis `complete_item`, jadi hasilnya tepat dan bukan tebakan.


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
| Papan peringkat mingguan | menjumlahkan XP sejak Senin 00:00 UTC; tidak ada proses reset, hanya jendela waktu. Zona waktunya dieja di kedua sisi — klien dan RPC — agar tidak bergantung pada setelan sesi basis datanya |
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
ditranspilasi di aplikasi ([`src/lib/reactRuntime.ts`](src/lib/reactRuntime.ts)) —
sekali, malas, alih-alih empat puluh kali.

**Transpilernya sucrase, bukan Babel.** Babel pilihan pertama yang wajar dan ia bekerja,
tetapi `@babel/standalone` adalah seluruh perkakasnya — 684 KB lewat kabel — untuk
mengerjakan satu transformasi. sucrase mengerjakan transformasi JSX yang sama dalam
**46 KB**: 15 kali lebih kecil. Sebelum ditukar, keluarannya dibandingkan kasus per
kasus dengan Babel — spread, entitas HTML, atribut boolean, fragmen, dan sarang — dan
semuanya setara: `React.createElement` yang sama, tiap pengikatan tingkat atas tetap di
tempatnya (dan itulah yang membuat sebuah pemeriksaan bisa menyebut namanya), entitas
JSX diterjemahkan sama. sucrase malah mempertahankan nomor baris, jadi galat waktu jalan
menunjuk baris yang benar-benar ditulis peserta.

Dua hal yang tadinya gratis dari Babel dibeli kembali, keduanya murah:

- **Cuplikan baris pada galat sintaks.** sucrase melaporkan `(baris:kolom)`; bingkainya
  dibangun sendiri — baris yang bersangkutan, dengan caret di bawah titiknya.
- **Validasi seluruh berkas.** sucrase hanya mengurai sejauh yang dibutuhkan transformasi
  JSX, jadi kesalahan JavaScript biasa di bagian lain akan lolos dan muncul sebagai
  pemeriksaan yang misterius tidak menemukan apa pun. Satu panggilan `new Function` pada
  hasilnya mengompilasi tanpa menjalankan, dan mengembalikan jaminan itu.

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

## Menjalankan C++ peserta

Tidak ada WebAssembly di sini — [JSCPP](https://github.com/felixhao28/JSCPP) adalah
interpreter tulisan tangan, bukan kompiler sungguhan, dan berjalan sinkron di thread
utama ([`src/lib/cpp.ts`](src/lib/cpp.ts)). Itulah yang membuatnya masuk akal untuk
kursus ini: tak ada unduhan berukuran Pyodide, dan cukup cepat untuk sebuah latihan.

**Ia mengerti sebagian C++, bukan seluruhnya.** Tanpa `std::string`, tanpa
`std::vector`, dan referensi (`int &x`) gagal diurai sama sekali — jadi setiap
latihan memakai array gaya-C dan pointer, bukan STL. Kelas dasar ada, namespace dan
berkas jamak tidak. Batasan ini ditemukan dengan mencobanya langsung, bukan dari
dokumentasinya: `strcmp` pada dua string yang identik melempar galat aneh
("overflow of NaN"), dan `strcat` diam-diam menjatuhkan satu spasi ketika
menyambung string yang huruf keduanya spasi (`", dunia!"` menjadi `",dunia!"`) —
keduanya dihindari, yang kedua dengan memecah satu `strcat` jadi dua panggilan.

**`maxTimeout` adalah katup pengaman.** Berbeda dari Pyodide yang WebAssembly-nya
bisa disela, `JSCPP.run` adalah loop sinkron biasa — `while (true) {}` milik
peserta akan membekukan tab selamanya kalau tak ada yang menghentikannya. Batas
waktu 4 detik dicek di antara pernyataan, sehingga sebuah loop yang lolos berhenti
dengan galat yang bisa dibaca, bukan tab yang harus dimatikan paksa.

**`CppTest` sengaja lebih sempit dari `PyTest`.** Tidak ada `setup` atau `assert` —
setiap pemeriksaan yang perlu dilakukan harus keluar lewat `cout`, karena tidak ada
namespace bersama untuk mengintip nilai sebuah variabel begitu programnya selesai.
Ini membentuk bagaimana latihannya ditulis: hasil dari sebuah fungsi diuji dengan
memanggilnya dari `main` dan mencetak hasilnya, bukan dengan menyodok variabel dari
luar.

**Diperiksa di Node, bukan hanya dipercaya.** `npm run check:cpp` menjalankan JSCPP
sungguhan atas setiap contoh kerja pada langkah `concept`, dan setiap `solution`
melawan tes miliknya sendiri — dua kelas kesalahan diam ini muncul lewat cara ini:
contoh yang butuh `cin` tapi langkah `concept` tak punya ladang `stdin` untuk
mengisinya (dilewati, dianggap transkrip ilustratif seperti contoh `input()` di
kursus Python), dan bug `strcat` di atas.

## Menjalankan SQL peserta

SQL tidak memerlukan iframe. Ia tidak menyentuh DOM dan tidak menjangkau jaringan —
[sql.js](https://sql.js.org) sudah berupa sandbox WebAssembly yang memegang basis data
yang hanya ada di memori. Jadi ia berjalan di dalam aplikasi seperti Pyodide, dan
mesinnya disimpan untuk sisa sesi ([`src/lib/sql.ts`](src/lib/sql.ts)).

**Tiap pemeriksaan mendapat basis data baru,** dibangun ulang dari skema latihannya.
Itulah seluruh cerita isolasinya: sebuah `UPDATE` di satu pemeriksaan tidak mungkin
terlihat oleh pemeriksaan berikutnya. Ini berbeda dari Pyodide, yang berbagi satu
filesystem untuk seluruh sesi.

Pernyataan yang menulis diperiksa lewat `verify`: runner menjalankan pernyataan peserta,
lalu menanyakan kembali kepada basis datanya apa yang sekarang tersimpan, dan baris
itulah yang dibandingkan. Karena itu latihan `INSERT`, `UPDATE`, dan `DELETE` diuji dari
akibatnya, bukan dari teks yang ditulis peserta.

Satu perangkap yang perlu diketahui saat menulis tes: **sql.js melaporkan `SELECT` yang
tidak cocok dengan apa pun persis seperti pernyataan yang memang tidak punya hasil.**
Keduanya mengembalikan larik kosong, jadi "senyap" dan "nol baris" adalah pengamatan
yang sama. Sebuah tes boleh menyatakan bahwa ia memang menginginkan nol baris dengan
`expectRows: []`; selain itu, hasil kosong dihitung gagal.

Perbandingan barisnya tidak peduli urutan kecuali tes menyebut `ordered: true` — jadi
`ORDER BY` hanya wajib ketika latihannya memang meminta urutan.

## Menjalankan TypeScript peserta

Kursus TypeScript yang hanya *menjalankan* kodenya akan jadi kursus JavaScript
dengan tanda baca tambahan — seluruh pokok bahasannya justru adalah apa yang
**ditolak** kompilernya. Maka `typescript` sungguhan dimuat di peramban dan
dimintai diagnostiknya ([`src/lib/ts.ts`](src/lib/ts.ts)).

Ukurannya 3,4 MB terminifikasi (0,97 MB lewat kabel), dan itulah sebabnya baik
kompilernya maupun teks lib-nya berada di balik `await import(...)`: tak ada satu
pun yang masuk ke bundel utama, dan peserta yang tak pernah membuka kursus ini
tak pernah membayarnya. Vite memisahkannya jadi dua potong tersendiri,
`typescript-*.js` dan `tsLib-*.js`.

**Lib-nya diambil apa adanya, kecuali DOM.** Tanpa `lib.es*.d.ts`, tiap program
biasa jadi dinding "Cannot find name". [`src/lib/tsLib.ts`](src/lib/tsLib.ts)
mengimpor 45 berkas itu sebagai teks — penutupan transitif dari referensi di
`lib.es2020.d.ts`, dibangkitkan, bukan ditebak. `lib.dom.d.ts` ditinggalkan
karena ia sendirian 1,9 MB dan kursus ini tak pernah menyentuh DOM; deklarasi
`console` empat baris menggantikannya.

**Berkas lib yang sudah diurai disimpan.** Mengurai 425 KB lib di tiap
pemeriksaan memakan 48 ms; menyimpan hasil uraiannya memakan 3 ms. Hanya berkas
peserta yang diurai ulang. Proyek penutup punya 18 pemeriksaan, dan selisih itu
yang membuatnya terasa 1,5 detik alih-alih belasan.

**Ada dua macam pemeriksaan**, dan itu langsung mengikuti dari cara kerjanya:

- pemeriksaan **tipe** mengompilasi kode peserta dengan sebuah `probe`
  ditempelkan — sebuah nilai yang disodorkan ke tipe buatan mereka — lalu
  menanyakan apakah kompilernya menerimanya. Menyodorkan nilai ke sebuah tipe
  adalah satu-satunya cara mengetahui apa yang sebenarnya tipe itu katakan.
  `expectError` dipakai ketika probe-nya justru nilai buruk yang seharusnya
  ditangkap; `errorCode` mempersempitnya ke satu galat tertentu.
- pemeriksaan **perilaku** menjalankan JavaScript hasil kompilasinya di dalam
  frame tersandbox yang sudah dipakai kursus web, dengan seluruh pembantu yang
  sama.

**Kode peserta dikompilasi sendirian lebih dulu.** Kalau ia tidak lolos, tiap
tes gagal dengan kata-kata kompilernya sendiri — tak ada gunanya bertanya apa
yang diterima sebuah tipe selagi tipenya masih rusak. Ini juga yang membuat
`expectError` jujur: sumbernya sudah terbukti bersih, jadi galat yang muncul
hanya mungkin berasal dari probe-nya.

Satu catatan saat menulis materi: **jangan menebak `errorCode`.** TypeScript
punya varian "Did you mean" tersendiri untuk nilai yang nyaris benar — `terjal`
alih-alih `terjual` memberi TS2561, bukan TS2353, dan `"Kecil"` alih-alih
`"kecil"` memberi TS2820, bukan TS2322. Jalankan pemeriksanya (di bawah) dan
biarkan ia yang menyebutkan kodenya.

## Menjalankan game peserta

Kursus ini bisa saja diajarkan tanpa layar — *logika* sebuah game adalah fungsi
biasa atas keadaan, dan itulah bagian yang layak diajarkan sekaligus satu-satunya
bagian yang layak diuji. Tetapi game yang tak bisa dimainkan adalah hal yang aneh
untuk dihabiskan empat modul, jadi ia benar-benar dijalankan
([`src/lib/game.ts`](src/lib/game.ts), [`src/components/GamePreview.tsx`](src/components/GamePreview.tsx)).

Bentuk yang diminta disengaja:

```python
awal()                        # keadaan awalnya
perbarui(keadaan, tombol, dt) # keadaan berikutnya
gambar(keadaan)               # daftar perintah gambar
```

**`perbarui` adalah fungsi murni** — keadaan masuk, keadaan keluar, tanpa
menggambar dan tanpa membaca papan ketik sendiri. Itulah yang membuat sebuah
pemeriksaan bisa memanggilnya langsung dengan keadaan karangan dan himpunan
tombol karangan. Akibatnya seluruh kursus ini diperiksa dengan mesin `PyTest`
yang sama persis dengan kursus Python, tanpa satu pun kanvas terlibat — yang baru
hanyalah *pemutarnya*. Dan `gambar` mengembalikan **data**, bukan melukis, dengan
alasan yang sama.

**Jembatan antara Python dan kanvas adalah JSON, sekali per bingkai.** Itu sedikit
boros dan sepenuhnya bisa diramalkan: tak ada proksi yang bocor, tak ada masa
hidup yang salah dikelola, dan adegannya berupa data biasa di kedua sisi.
Ongkosnya terukur **0,032 ms per bingkai** — 0,2% dari anggaran bingkai 60 fps,
jadi yang jadi hambatan adalah kode pesertanya sendiri, bukan jembatannya.

Keadaannya disimpan di sisi Python di antara bingkai, jadi loop di sisi
JavaScript tetap berupa loop dan yang menyeberang hanya tombol yang masuk dan
adegan yang keluar.

**`dt` adalah waktu nyata, dijepit.** Peramban meredam `requestAnimationFrame`
sampai berhenti di tab yang tersembunyi; tanpa jepitan, kembali ke tab setelah
sepuluh detik akan melemparkan pemainnya menembus dinding. Batasnya `1/15` detik
— cukup untuk melewati satu tersendat, cukup pendek agar tak ada yang melompat.

Tombolnya disimpan di sebuah ref, bukan di state: satu ketukan tidak boleh
merender ulang komponennya enam puluh kali sedetik, dan loop-nya membaca ref itu
langsung. Pembungkus kanvasnya bisa difokus karena tanpa fokus, tombol panah
menggulirkan halaman alih-alih menggerakkan pemain.

## Kursus matematika

Kursus vektor tidak menjalankan apa pun. Tak ada Pyodide, tak ada iframe, tak ada
kompiler — pembelajarnya mengerjakan soal di kertas lalu mengetik hasilnya. Itu
membuat tiga hal harus dibangun sendiri.

**Rumus.** [`src/lib/tex.ts`](src/lib/tex.ts) membaca sebagian kecil LaTeX —
pecahan, akar, pangkat dan indeks, anak panah di atas huruf, matriks, dan sekitar
delapan puluh lambang — lalu mengeluarkan MathML, yang kini ditata sendiri oleh
peramban. KaTeX bisa lebih banyak, tetapi ia 280 KB skrip ditambah satu megabyte
font, sementara seluruh kurikulum aplikasi ini saja hanya 282 KB di kabel.

Dalam prosa, `$...$` menjadi rumus sebaris dan `$$...$$` menjadi rumus yang berdiri
sendiri; `Rich` di [`components/ui.tsx`](src/components/ui.tsx) yang memisahkannya.
Satu hal yang perlu diketahui: rumus butuh font ber-tabel OpenType MATH agar kurung
dan garis determinan bisa meregang. `.tex math` di
[`styles.css`](src/styles.css) menyebut Cambria Math dan kawan-kawannya untuk itu.

**Jawaban.** [`src/lib/answer.ts`](src/lib/answer.ts) menilai dua macam jawaban.

*Bilangan.* `3,74`, `sqrt(14)`, `-7/2`, `2√3`, `pi/4`, `ln(20)/ln(3)` semuanya
terbaca. Satu kotak memuat **satu** bilangan — vektor diisi satu kotak per
komponen. Itu disengaja: menilai vektor yang diketik berarti menebak notasi, dan
tebakan yang meleset menyalahkan pembelajar yang sebenarnya benar.

Toleransinya dua desimal atau setengah persen, mana yang lebih longgar. Setengah
persen saja terlalu kejam untuk jawaban kecil — setengah persen dari $2/7$ hanya
0,0014, sehingga `0,29` yang dibulatkan dengan benar akan disalahkan.

*Rumus.* Sebagian jawaban memang berupa fungsi, bukan bilangan: invers, komposisi,
grafik yang ditransformasi — dan, begitu jalur ini sampai turunan, hampir
semuanya. Kotak semacam itu diberi `formula` alih-alih `answer`, dan dinilai
**dengan menguji kedua rumus di dua puluh empat titik**. Tidak perlu CAS: dua
rumus adalah fungsi yang sama bila nilainya sama di mana-mana. Hasilnya `(x-3)/2`,
`x/2 - 1,5`, dan `0.5x - 3/2` sama-sama diterima — pembelajar tak dihukum karena
mengeja jawabannya berbeda dari penulis soal. Awalan `y =` atau `f(x) =` boleh
ikut ditulis dan diabaikan.

Titik-titik ujinya sengaja bukan bilangan bulat. Dua fungsi berbeda bisa kebetulan
berpapasan di 0, 1, dan 2; mereka tidak berpapasan di 0,7413 dan sebelas
tetangganya.

Satu jebakan yang layak diketahui: rumus yang hanya terdefinisi pada sebagian garis
— akar, logaritma, penyebut yang nol — perlu `domain`. Tanpa itu titik ujinya jatuh
di tempat rumusnya tak bernilai, dan **tak ada** jawaban yang bisa dinilai benar.
`check:math` menangkapnya dengan menilai jawaban penulis terhadap dirinya sendiri;
kalau jawaban penulis pun disalahkan, domainnya keliru.

**Papan simbol.** Deretan tombol `x √ π ^ / ( ) |` di bawah kotak, menyisipkan pada
posisi karet. Tombol `x` hanya muncul bila ada kotak rumus. Gunanya bukan menjadi
papan ketik kedua — `sqrt(` dan `pi` selalu bisa diketik sendiri — melainkan
**memberi tahu** bahwa simbol-simbol itu memang diterima.

**Gambar.** [`src/lib/figure.ts`](src/lib/figure.ts) mendefinisikan gambar sebagai
data: beberapa vektor bernama, lalu daftar hal yang digambar *dalam bentuk* vektor
itu — `{ sum: [...] }`, `{ cross: [...] }`, `{ proj: [...] }`, dan seterusnya.
[`components/Figure.tsx`](src/components/Figure.tsx) menggambarnya sebagai SVG.

Untuk kursus fungsi, gambar yang sama juga memuat kurva: `{ t: 'curve', f: 'a*sin(b*x)' }`
dan seterusnya, dengan `f` sebuah ekspresi dalam `x` dan dalam penggeser yang
dideklarasikan gambar itu. Ekspresinya dibaca [`src/lib/expr.ts`](src/lib/expr.ts) —
parser yang sama dengan yang menilai jawaban, hanya dengan himpunan fungsi yang lebih
besar. Kutub digambar sebagai celah, bukan sebagai garis hampir tegak: sebuah lari
tersambung berakhir begitu nilainya melompat, sehingga `tan x` tampak sebagaimana
mestinya.

Label pada gambar dituliskan seperti matematika ditulis: yang miring hanya
variabelnya, dengan Times New Roman. `tan x` berarti satu huruf miring, bukan empat;
`proj`, `puncak`, angka, dan tanda operasi tetap tegak. `LabelText` di
`components/Figure.tsx` yang memisahkannya — satu huruf, atau serangkaian huruf
kapital seperti `AB`, adalah variabel; rangkaian huruf kecil adalah nama fungsi atau
kata biasa.

Perantaraan itulah intinya. Ketika pembaca menyeret ujung `a`, semua yang tadi
dinyatakan tersusun dari `a` — jumlahnya, proyeksinya, jajargenjang yang diarsir,
busur sudutnya, angka-angka di bawahnya — dihitung ulang dari deskripsi yang sama
yang menggambarnya. Gambar dengan koordinat harfiah hanya akan menjadi gambar;
yang ini adalah pernyataannya sendiri.

Gambar bidang diseret ujungnya; gambar ruang diputar seluruhnya. Pembagian itu
disengaja: menyeret ujung pada proyeksi datar dari ruang adalah tebakan tentang
kedalaman, bukan jawaban.

**Memeriksanya.** `npm run check:math` menjalankan tiga hal sekaligus: kasus uji
untuk pembacaan bilangan dan penilaian, kasus uji untuk perender LaTeX, lalu sapuan
atas **seluruh** kurikulum matematika — setiap rumus dirender dan setiap gambar
ditelusuri. Perintah LaTeX yang tak dikenal keluar sebagai teks biasa, dan gambar
yang menyebut vektor tak bernama tetap tergambar; keduanya salah tanpa bersuara,
jadi keduanya diperiksa.

```bash
npm run check:math
```


## Playground

Ruang bebas yang memakai ulang ketujuh runtime-nya tanpa membangun apa pun yang
baru: Python (Pyodide), situs statis, JavaScript, dan React (bingkai tersandbox
dalam tiga bentuknya), SQL (sql.js), TypeScript (kompilernya), dan Game (loop
bingkainya). Halamannya sekadar switch atas mode; isinya ada di
[`src/content/playground.ts`](src/content/playground.ts) sebagai data, seperti
kurikulumnya.

Apa yang kamu tulis disimpan per mode di localStorage. Ruang coret-coret yang
kehilangan pekerjaanmu saat halaman dimuat ulang bukanlah ruang coret-coret.

**Soal "React app + router".** Rencana awalnya menyisipkan react-router seperti
React disisipkan. Dua pengukuran menghentikannya. Pertama, di dalam bingkai
ber-origin buram, `history.pushState` dan `replaceState` melempar SecurityError —
dan di situlah react-router memindahkan halaman; ia akan jatuh ke
`location.assign`, yang memuat ulang bingkainya dan menghapus seluruh state di
tiap klik tautan. Kedua, `location.hash` dan `hashchange` justru bekerja.

Maka router-nya ditulis di dalam templatnya sendiri: dua puluh baris yang bisa
dibaca dan diubah peserta, memakai hash. Ada satu jebakan lagi yang juga terukur:
`href="#/tentang"` saja tidak cukup, karena dokumen `srcdoc` ber-origin buram tak
punya alamat dasar yang bisa dipakai — `#/tentang` diselesaikan terhadap
`about:blank` dan peramban memperlakukan kliknya sebagai pindah halaman, sehingga
pratinjaunya jadi kosong. Jadi tautannya mencegat kliknya sendiri lalu menyetel
hash-nya. Kebetulan itu justru yang dilakukan `<Link>` react-router — hanya
dengan tujuan yang berbeda.

## Struktur

```
src/
  content/          kurikulum — data murni, dwibahasa
    types.ts        model CourseInfo / Course → Module → Submodule → Lesson → Step
    catalog.ts      metadata kursus & jalur karier, dan pemuat malas kurikulumnya
    trophies.ts     trofi statis
    python/         kursus Python: m1-basics … m9-private-apis
    html/           kursus HTML: m1-document … m4-semantics
    css/            kursus CSS: m1-rules … m4-states
    javascript/     kursus JavaScript: m1-values … m4-robust
    react/          kursus React: m1-components … m4-app
    sql/            kursus SQL: m1-select … m4-writing
    typescript/     kursus TypeScript: m1-annotations … m4-holding
    gamedev/        kursus Game Development: m1-loop … m4-whole
    playground.ts   mode dan templat Playground
  lib/
    db.ts           kontrak yang harus dipenuhi setiap backend
    backends/       supabase.ts (asli) + local.ts (localStorage) + pemilihnya
    python.ts       pemuat Pyodide, runner, dan pemeriksa tes
    web.ts          runner iframe tersandbox untuk HTML, CSS, JavaScript, React
    reactRuntime.ts React/ReactDOM sebagai teks + transpilasi JSX lewat sucrase
    sql.ts          SQLite lewat sql.js — basis data baru untuk tiap pemeriksaan
    ts.ts           kompiler TypeScript sungguhan, dimuat malas, untuk diagnostik
    tsLib.ts        rantai lib.es*.d.ts sebagai teks (dibangkitkan)
    game.ts         sesi game Python: namespace bertahan + jembatan JSON per bingkai
    pythonModules.ts modul Python yang ditanam ke filesystem Pyodide (API tiruan)
    hearts.ts       ekonomi heart
    progress.ts     turunan: apa yang terbuka, tuntas, dan diperoleh
    week.ts         batas minggu (Senin UTC), disamakan dengan Postgres
  app/store.tsx     satu sumber kebenaran untuk sesi + progres
  app/curriculum.ts hook useCourse / useAllCourses di atas pemuat malasnya
  components/       Layout, StepView (pemutar langkah), results.tsx, ui.tsx,
                    ResultTable.tsx (kisi hasil SQL),
                    CompileReport.tsx (keberatan kompiler TypeScript),
                    GamePreview.tsx (kanvas dan loop bingkainya)
  pages/            Landing, Auth, Dashboard, Catalog, CourseMap, Lesson,
                    Project, Playground, Leaderboard, Profile, Certificate,
                    Teacher (halaman Kelas, hanya untuk akun guru),
                    ResetPassword (tempat tautan lupa-sandi mendarat)
.github/workflows/deploy.yml  build dan terbitkan ke GitHub Pages
supabase/schema.sql skema, RPC, dan RLS
supabase/reports.sql  capaian tiap pembelajar, untuk SQL Editor
tools/check-curriculum.mjs  menghitung kurikulum sungguhan lalu mencocokkannya
tools/check-rpc-grants.mjs  siapa boleh memanggil RPC apa, diuji ke proyek langsung
```

## Memuat kurikulum saat dibutuhkan

Kedelapan kurikulum bersama-sama berukuran 1,00 MB terminifikasi — 282 KB lewat
kabel, dan sebagian besar dari apa yang dulu dikirim aplikasi ini sebelum apa pun
muncul. Sekarang tiap kursus punya potongannya sendiri.

| | sebelum | sesudah |
| --- | --- | --- |
| bundel utama | 1.582 KB / 444 KB gzip | 548 KB / **162 KB gzip** |
| halaman depan (belum masuk) | 9 berkas, 444 KB | **1 berkas, 163 KB** |
| tiap kursus | — | 25–52 KB gzip, diambil saat dibutuhkan |
| transpiler JSX (hanya latihan React) | 684 KB gzip | **46 KB gzip** |

**Kuncinya bukan pemisahannya, melainkan menemukan siapa yang sebenarnya butuh
kurikulum.** Ternyata hampir tak ada. Tiap baris progres membawa `course_id`-nya
sendiri, dan katalog tahu sebuah kursus berisi berapa item — jadi "12 dari 55,
22%" adalah aritmetika atas baris yang sudah dipegang aplikasi. Halaman depan,
katalog, dan dasbor tidak mengambil satu kurikulum pun.

Yang benar-benar butuh hanya empat hal, dan semuanya khas:

- **peta kursus, pelajaran, dan proyek** — satu kursus, yaitu yang sedang dibuka;
- **tautan "lanjutkan"** di dasbor — butuh urutan itemnya, jadi satu kursus juga;
- **kisi trofi** — menamai tiap modul, jadi ia satu-satunya halaman yang menunggu
  semuanya;
- **penyelesaian sebuah pelajaran** — trofi modul perlu tahu item apa saja yang
  ada di dalam sebuah modul.

Sisanya — sertifikat, kemajuan jalur karier, bilah progres — berjalan dari
hitungan.

**Prasambar.** Begitu seorang pembelajar masuk, seluruh kurikulum ditarik di
latar belakang. Tak ada yang menunggunya; ia hanya berarti bahwa saat mereka
membuka pelajaran atau menyelesaikannya, potongannya sudah ada. Pengunjung yang
belum masuk tidak mendapatkannya — halaman depan tak berkepentingan dengan 282 KB
kurikulum. Satu jebakan yang sempat terjadi dan terukur: `Layout` merender di
tiap halaman, dan `TrophyToasts` di dalamnya memanggil `useAllCourses()`. Hook
tak bisa dipanggil bersyarat, jadi komponennya yang dipecah dua — penjaganya di
luar, dan bagian yang meminta kurikulum baru terpasang saat ada toast untuk
dinamai.

**Harga yang dibayar** adalah dua angka: `lessons` dan `projects` di
[`src/content/catalog.ts`](src/content/catalog.ts). Itu satu-satunya fakta yang
disalin melintasi batas malas, dan angka yang salah akan menampilkan "12 dari 55"
pada kursus berisi 54 item — diam-diam, selamanya. Karena itu ada
`npm run check:curriculum`
([`tools/check-curriculum.mjs`](tools/check-curriculum.mjs)): ia memuat kurikulum
sungguhan, menghitungnya, dan gagal pada ketidakcocokan apa pun. Ia juga menolak
id item yang terduplikasi, karena id-lah cara progres dicatat.

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
| `sql` | sama seperti `code`, tetapi menulis pernyataan SQL dan melihat baris yang kembali | minimal |
| `ts` | sama seperti `code`, tetapi menulis TypeScript dan melihat apa kata kompilernya | minimal |
| `game` | sama seperti `code`, tetapi menulis game Python dan benar-benar memainkannya | minimal |

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
5. Untuk langkah `sql`, tesnya memakai `expectColumns`, `expectRows`, `ordered`, dan
   `verify` — lihat `SqlTest` di [`src/content/types.ts`](src/content/types.ts).
6. Untuk langkah `ts`, tesnya memakai `probe`, `expectError`, `errorCode`, dan
   `check` — lihat `TsTest` di [`src/content/types.ts`](src/content/types.ts).
7. Langkah `game` memakai `PyTest` yang sama dengan kursus Python: tesnya berupa
   cuplikan `assert` yang memanggil `awal`, `perbarui`, dan `gambar` secara
   langsung.
8. Untuk langkah `cpp`, tesnya `CppTest` — lebih sempit dari `PyTest`, sengaja
   tanpa `setup` atau `assert`: JSCPP tak punya namespace bersama untuk
   diintip setelah program peserta selesai, jadi `stdin`, `expectOutput`, dan
   `expectContains` adalah satu-satunya yang ada. **Jangan lupa `runtime: 'cpp'`
   pada `project`** — tanpanya `MiniProject` jatuh ke varian Python secara diam-diam
   (keduanya struktural cocok kalau `PyTest`-nya tak memakai `setup`/`assert`),
   dan proyeknya akan dijalankan lewat Pyodide, bukan JSCPP.

Menambah atau membuang sebuah pelajaran mengubah hitungan kursusnya, jadi
perbarui `lessons` / `projects` di [`src/content/catalog.ts`](src/content/catalog.ts)
dan jalankan `npm run check:curriculum` — ia akan menyebutkan angka yang benar
kalau kamu keliru.

### Memastikan materi baru tidak rusak

Jalankan potongan berikut di konsol browser (saat `npm run dev` aktif). Ia menjalankan
**setiap** solusi acuan terhadap tesnya sendiri, lalu memastikan tidak ada tes yang
lolos hanya dengan kode awal:

Untuk kursus Python:

```js
const py = await import('/src/lib/python.ts')
const { loadCourse } = await import('/src/content/catalog.ts')
const pythonCourse = await loadCourse('python')
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
  const { loadCourse } = await import('/src/content/catalog.ts')
  const htmlCourse = await loadCourse('html')
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

Untuk kursus SQL — jauh lebih cepat, karena tidak ada iframe dan tidak ada Pyodide:

```js
const sql = await import('/src/lib/sql.ts')
const { loadCourse } = await import('/src/content/catalog.ts')
const sqlCourse = await loadCourse('sql')
const bad = []
const cek = async (it) => {
  if ((await sql.runSqlTests(it.schema, it.solution, it.tests)).some(o => !o.passed)) bad.push(['solusi gagal', it.id])
  if ((await sql.runSqlTests(it.schema, it.starter, it.tests)).every(o => o.passed)) bad.push(['tes kosong', it.id])
}
for (const m of sqlCourse.modules)
  for (const s of m.submodules) {
    for (const l of s.lessons)
      for (const st of l.steps)
        if (st.kind === 'sql') await cek(st)
    await cek(s.project)
  }
bad
```

Untuk kursus TypeScript, polanya sama. Pemuatan pertama mengunduh kompilernya,
jadi berikan waktu sebentar:

```js
window.__cek = { done: false }
;(async () => {
  const tsr = await import('/src/lib/ts.ts')
  const { loadCourse } = await import('/src/content/catalog.ts')
  const typescriptCourse = await loadCourse('typescript')
  const bad = []
  const cek = async (it) => {
    if ((await tsr.runTsTests(it.solution, it.tests)).some(o => !o.passed)) bad.push(['solusi gagal', it.id])
    if ((await tsr.runTsTests(it.starter, it.tests)).every(o => o.passed)) bad.push(['tes kosong', it.id])
  }
  for (const m of typescriptCourse.modules)
    for (const s of m.submodules) {
      for (const l of s.lessons)
        for (const st of l.steps)
          if (st.kind === 'ts') await cek(st)
      await cek(s.project)
    }
  window.__cek = { done: true, bad }
})()
```

Untuk kursus Game Development, potongan Python di atas berlaku apa adanya —
tesnya memang `PyTest` — hanya jenis langkahnya yang berbeda:

```js
const py = await import('/src/lib/python.ts')
const { loadCourse } = await import('/src/content/catalog.ts')
const gameDevCourse = await loadCourse('game-dev')
const bad = []
const cek = async (it) => {
  if ((await py.runTests(it.solution, it.tests)).some(o => !o.passed)) bad.push(['solusi gagal', it.id])
  if ((await py.runTests(it.starter, it.tests)).every(o => o.passed)) bad.push(['tes kosong', it.id])
}
for (const m of gameDevCourse.modules)
  for (const s of m.submodules) {
    for (const l of s.lessons)
      for (const st of l.steps)
        if (st.kind === 'game') await cek(st)
    await cek(s.project)
  }
bad
```

Untuk kursus C++, jalankan `npm run check:cpp` alih-alih menempel apa pun di
konsol — JSCPP adalah paket npm sungguhan, jadi pemeriksanya berjalan di Node dan
menjalankan **setiap** contoh kerja langkah `concept`, tiap `solution` langkah
`cpp`, dan tiap `solution` proyek, melawan tesnya masing-masing.

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

## Isi kursus SQL

4 modul, 7 submateri, 14 pelajaran, 7 mini proyek, 660 XP. Tanpa prasyarat.

| Modul | Isi |
| --- | --- |
| 1 Bertanya kepada Tabel | SELECT, AS, WHERE, AND/OR, ORDER BY, LIMIT, BETWEEN, IN, LIKE |
| 2 Menghitung dan Mengelompokkan | COUNT/SUM/AVG/MIN/MAX, NULL dalam agregat, DISTINCT, ROUND, GROUP BY, HAVING |
| 3 Lebih dari Satu Tabel | kunci asing, JOIN … ON, alias, tiga tabel, LEFT JOIN, subkueri |
| 4 Mengubah Datanya | INSERT, DEFAULT, UNIQUE/CHECK, UPDATE, DELETE, WHERE yang hilang, transaksi |

Dua gagasan sengaja diberi ruang lebih. Yang pertama, beda antara `WHERE` dan `HAVING`
dijelaskan lewat urutan jalannya klausa, bukan lewat aturan hafalan. Yang kedua,
`COUNT(*)` setelah `LEFT JOIN` — kelas kosong yang terbaca "1 siswa" — diberi satu
konsep dan satu tes tersendiri, karena kutu itu terlihat benar sampai seseorang
memeriksa angkanya.

Data tiap modul dibentuk untuk latihannya: tabel `buku` cukup kecil untuk diperiksa
dengan mata, tabel `pesanan` punya kolom `kupon` yang sebagian besar NULL, dan skema
sekolah di modul 3 sengaja menyimpan satu kelas tanpa siswa dan satu siswa tanpa kelas.

## Isi kursus TypeScript

4 modul, 7 submateri, 14 pelajaran, 7 mini proyek, 660 XP. Prasyaratnya JavaScript.

| Modul | Isi |
| --- | --- |
| 1 Menyatakan Maksudmu | keterangan tipe, inferensi, `any`, parameter, opsional dan nilai bawaan, interface, array, tuple |
| 2 Salah Satu dari Beberapa | union, tipe literal, penyempitan lewat typeof/===/Array.isArray, union bertanda, `never`, null dan `?.` dan `??` |
| 3 Tipe yang Menerima Tipe | fungsi generik, batasan, tipe generik, `Record`, `keyof`, `T[K]`, `Partial`/`Pick`/`Omit` |
| 4 Tipe yang Tahan Uji | `unknown` lawan `any`, predikat tipe, `as` sebagai kebohongan, `as const`, `readonly` |

Kursusnya berjalan dengan `strict: true` sejak baris pertama, karena TypeScript
tanpa `strict` mengajarkan separuh bahasanya yang justru tidak menangkap apa pun.
Akibatnya, banyak kode awal di sini memang **sengaja tidak bisa dikompilasi** —
`function sapa(nama)` di pelajaran pertama gagal dengan TS7006, dan membaca galat
itu adalah langkah pertama latihannya, bukan kecelakaan.

Dua gagasan diberi ruang lebih. Yang pertama, `unknown` lawan `any`: keduanya
menerima nilai yang sama dan berbeda sepenuhnya pada apa yang boleh kamu lakukan
sesudahnya. Yang kedua, memodelkan agar keadaan buruk tak bisa ditulis — beberapa
kode awal di modul 2 dan 4 justru berupa satu objek dengan semua field opsional,
bentuk yang keberadaan union bertanda memang untuk menggantikannya.

## Isi kursus Game Development

4 modul, 7 submateri, 14 pelajaran, 7 mini proyek, 660 XP. Prasyaratnya Python.

| Modul | Isi |
| --- | --- |
| 1 Bingkai demi Bingkai | tiga fungsinya, keadaan sebagai dict, `dt` dan kecepatan, membaca tombol, penjepitan |
| 2 Ketika Benda Bersentuhan | tumpang tindih kotak, jarak dan lingkaran, pemantulan berarah, daftar yang datang dan pergi |
| 3 Aturan Permainan | nyawa dan kekebalan, jam dan tanjakan kesulitan, fase, deteksi tepi tombol, tingkat |
| 4 Game Utuh | memecah pembaruan jadi pembantu, kedip dan guncangan, satu game lengkap |

Lapangannya tetap 320 kali 240 dengan `(0, 0)` di kiri atas, dan tiap latihan
menggambar ke lapangan yang sama. Angkanya sengaja bulat agar hitungan di sebuah
latihan bisa dikerjakan di kepala.

Tiga hal diberi ruang lebih karena ketiganya menjebak semua orang sekali. Yang
pertama, `x = x + 2` bukan gerakan melainkan jarak per bingkai — kode awal
pelajaran 1.2 memang menulis kutu itu, dan tesnya menangkapnya. Yang kedua,
`vx = -vx` membuat bola yang masih menembus dinding membalik tiap bingkai dan
menggigil; kursus ini mengajarkan memilih arah (`abs`) alih-alih mengingkari, dan
ada satu tes khusus untuk itu. Yang ketiga, `tombol` adalah potret sesaat, jadi
"spasi sedang ditekan" bernilai benar di tiap bingkai selama jarinya di sana —
memulai permainan dengan itu berarti memulainya enam puluh kali sedetik.

## Peta jalan

Katalognya sudah penuh: ketujuh kursusnya ditulis dan keempat jalur kariernya
terbuka. Tak ada lagi yang bertanda "Segera hadir".

Kursus yang direncanakan tetapi belum dibangun ditulis sebagai objek `Course`
biasa di [`src/content/catalog.ts`](src/content/catalog.ts) dengan
`available: false` dan `modules: []` — itulah yang membuatnya tampak di katalog
tanpa bisa didaftari, dan halaman depan menurunkan kalimat "segera hadir"-nya
dari daftar itu.

Playground pun sudah lengkap: ketujuh runtime-nya aktif, termasuk situs statis,
JavaScript, React, dan React dengan router.
