# Nunada Academy: Learn to Code

Aplikasi belajar coding berbasis web dengan pendekatan *scaffolding*: bantuan dilepas
selangkah demi selangkah, dan tiap submateri ditutup satu mini proyek yang diperiksa
oleh tes sungguhan. Antarmuka bisa diganti antara **English** dan **Bahasa Indonesia**
kapan saja.

Rilis pertama berisi kursus **Python** dan jalur karier **Python Developer**.

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

## Aturan permainan

| Hal | Aturan |
| --- | --- |
| XP | 20 per pelajaran, 50 per mini proyek, 80 untuk dua proyek besar |
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

## Struktur

```
src/
  content/          kurikulum — data murni, dwibahasa
    types.ts        model Course → Module → Submodule → Lesson → Step
    catalog.ts      daftar kursus & jalur karier (termasuk yang belum tersedia)
    trophies.ts     trofi statis
    python/         kursus Python: m1-basics … m9-private-apis
  lib/
    db.ts           kontrak yang harus dipenuhi setiap backend
    backends/       supabase.ts (asli) + local.ts (localStorage) + pemilihnya
    python.ts       pemuat Pyodide, runner, dan pemeriksa tes
    pythonModules.ts modul Python yang ditanam ke filesystem Pyodide (API tiruan)
    hearts.ts       ekonomi heart
    progress.ts     turunan: apa yang terbuka, tuntas, dan diperoleh
    week.ts         batas minggu (Senin UTC), disamakan dengan Postgres
  app/store.tsx     satu sumber kebenaran untuk sesi + progres
  components/       Layout, StepView (pemutar langkah), ui.tsx
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
