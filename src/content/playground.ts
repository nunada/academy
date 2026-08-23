/** What the Playground offers, as data.
 *
 *  One entry per runtime the app already owns — Pyodide, the sandboxed frame in
 *  its three shapes, sql.js, the TypeScript compiler, and the game loop — so the
 *  scratch space covers everything the courses teach and nothing had to be built
 *  for it. The page is a switch over these; the templates are the content. */

import type { Loc } from './types'

export type ModeId = 'python' | 'web' | 'javascript' | 'react' | 'sql' | 'typescript' | 'game'

export interface Templat {
  id: string
  label: Loc
  code: string
  /** Python only: the lines `input()` will read. */
  stdin?: string
}

export interface Mode {
  id: ModeId
  label: Loc
  icon: string
  /** Shown above the editor. */
  editorLabel: string
  templat: Templat[]
}

/* ------------------------------------------------------------------ python */

const PYTHON: Templat[] = [
  {
    id: 'kosong',
    label: { en: 'Blank', id: 'Kosong' },
    code: '# Tulis Python apa saja di sini\nprint("Halo!")\n',
  },
  {
    id: 'input',
    label: { en: 'Reads input', id: 'Membaca input' },
    code: 'nama = input("Nama: ")\numur = int(input("Umur: "))\nprint(f"{nama}, tahun depan {umur + 1}")\n',
    stdin: 'Ani\n17',
  },
  {
    id: 'loop',
    label: { en: 'Loop + list', id: 'Loop + list' },
    code:
      'angka = [4, 8, 15, 16, 23, 42]\n' +
      'total = 0\n' +
      'for n in angka:\n' +
      '    total += n\n' +
      'print("Total:", total)\n' +
      'print("Rata-rata:", total / len(angka))\n',
  },
  {
    id: 'fungsi',
    label: { en: 'Functions', id: 'Fungsi' },
    code:
      'def fib(n):\n' +
      '    a, b = 0, 1\n' +
      '    hasil = []\n' +
      '    for _ in range(n):\n' +
      '        hasil.append(a)\n' +
      '        a, b = b, a + b\n' +
      '    return hasil\n\n' +
      'print(fib(10))\n',
  },
  {
    id: 'ascii',
    label: { en: 'ASCII art', id: 'Seni ASCII' },
    code: 'tinggi = 5\nfor i in range(1, tinggi + 1):\n    print(" " * (tinggi - i) + "*" * (2 * i - 1))\n',
  },
]

/* --------------------------------------------------------------------- web */

const WEB: Templat[] = [
  {
    id: 'kosong',
    label: { en: 'Blank page', id: 'Halaman kosong' },
    code:
      '<!doctype html>\n' +
      '<html lang="id">\n' +
      '  <head>\n' +
      '    <meta charset="utf-8" />\n' +
      '    <title>Halaman saya</title>\n' +
      '    <style>\n' +
      '      body {\n' +
      '        font-family: system-ui, sans-serif;\n' +
      '        margin: 24px;\n' +
      '        color: #24463d;\n' +
      '      }\n' +
      '    </style>\n' +
      '  </head>\n' +
      '  <body>\n' +
      '    <h1>Halo!</h1>\n' +
      '    <p>Ubah apa saja di kiri, dan halamannya ikut berubah.</p>\n' +
      '  </body>\n' +
      '</html>\n',
  },
  {
    id: 'kartu',
    label: { en: 'A card', id: 'Sebuah kartu' },
    code:
      '<!doctype html>\n' +
      '<html lang="id">\n' +
      '  <head>\n' +
      '    <meta charset="utf-8" />\n' +
      '    <style>\n' +
      '      body {\n' +
      '        font-family: system-ui, sans-serif;\n' +
      '        background: #fbf7ec;\n' +
      '        display: grid;\n' +
      '        place-items: center;\n' +
      '        min-height: 100vh;\n' +
      '        margin: 0;\n' +
      '      }\n' +
      '      .kartu {\n' +
      '        background: #fffdf8;\n' +
      '        border: 1px solid #e7e0cd;\n' +
      '        border-radius: 14px;\n' +
      '        padding: 20px 24px;\n' +
      '        max-width: 300px;\n' +
      '        box-shadow: 0 6px 20px rgba(36, 70, 61, 0.08);\n' +
      '      }\n' +
      '      .kartu h2 {\n' +
      '        margin: 0 0 6px;\n' +
      '        color: #24463d;\n' +
      '      }\n' +
      '      .kartu p {\n' +
      '        margin: 0;\n' +
      '        color: #5f7066;\n' +
      '        line-height: 1.5;\n' +
      '      }\n' +
      '      .pil {\n' +
      '        display: inline-block;\n' +
      '        margin-top: 12px;\n' +
      '        padding: 3px 10px;\n' +
      '        border-radius: 999px;\n' +
      '        background: #e9f0e5;\n' +
      '        color: #24463d;\n' +
      '        font-size: 0.8rem;\n' +
      '      }\n' +
      '    </style>\n' +
      '  </head>\n' +
      '  <body>\n' +
      '    <div class="kartu">\n' +
      '      <h2>Kartu</h2>\n' +
      '      <p>Kotak dengan bayangan halus, sudut membulat, dan sedikit ruang napas.</p>\n' +
      '      <span class="pil">Contoh</span>\n' +
      '    </div>\n' +
      '  </body>\n' +
      '</html>\n',
  },
  {
    id: 'tata-letak',
    label: { en: 'A layout', id: 'Tata letak' },
    code:
      '<!doctype html>\n' +
      '<html lang="id">\n' +
      '  <head>\n' +
      '    <meta charset="utf-8" />\n' +
      '    <style>\n' +
      '      * { box-sizing: border-box; }\n' +
      '      body {\n' +
      '        font-family: system-ui, sans-serif;\n' +
      '        margin: 0;\n' +
      '        color: #24463d;\n' +
      '        display: grid;\n' +
      '        grid-template-rows: auto 1fr auto;\n' +
      '        min-height: 100vh;\n' +
      '      }\n' +
      '      header, footer {\n' +
      '        background: #24463d;\n' +
      '        color: #fffdf8;\n' +
      '        padding: 12px 20px;\n' +
      '      }\n' +
      '      .isi {\n' +
      '        display: grid;\n' +
      '        grid-template-columns: 1fr 200px;\n' +
      '        gap: 20px;\n' +
      '        padding: 20px;\n' +
      '      }\n' +
      '      aside {\n' +
      '        background: #f3eede;\n' +
      '        border-radius: 10px;\n' +
      '        padding: 14px;\n' +
      '        font-size: 0.9rem;\n' +
      '      }\n' +
      '      @media (max-width: 520px) {\n' +
      '        .isi { grid-template-columns: 1fr; }\n' +
      '      }\n' +
      '    </style>\n' +
      '  </head>\n' +
      '  <body>\n' +
      '    <header><strong>Situs Saya</strong></header>\n' +
      '    <div class="isi">\n' +
      '      <main>\n' +
      '        <h1>Judul halaman</h1>\n' +
      '        <p>Kolom utamanya melebar; sisi kanannya tetap 200 piksel.</p>\n' +
      '        <p>Perkecil jendela pratinjaunya dan keduanya menumpuk.</p>\n' +
      '      </main>\n' +
      '      <aside>\n' +
      '        <strong>Samping</strong>\n' +
      '        <p>Tautan, iklan, apa saja.</p>\n' +
      '      </aside>\n' +
      '    </div>\n' +
      '    <footer>© 2026</footer>\n' +
      '  </body>\n' +
      '</html>\n',
  },
  {
    id: 'formulir',
    label: { en: 'A form', id: 'Formulir' },
    code:
      '<!doctype html>\n' +
      '<html lang="id">\n' +
      '  <head>\n' +
      '    <meta charset="utf-8" />\n' +
      '    <style>\n' +
      '      body { font-family: system-ui, sans-serif; margin: 24px; color: #24463d; }\n' +
      '      label { display: block; margin-bottom: 12px; }\n' +
      '      label span { display: block; font-size: 0.85rem; margin-bottom: 4px; }\n' +
      '      input, select, textarea {\n' +
      '        width: 100%;\n' +
      '        padding: 8px 10px;\n' +
      '        border: 1px solid #e7e0cd;\n' +
      '        border-radius: 8px;\n' +
      '        font: inherit;\n' +
      '      }\n' +
      '      input:focus, select:focus, textarea:focus {\n' +
      '        outline: 2px solid #7eaa71;\n' +
      '        outline-offset: 1px;\n' +
      '      }\n' +
      '      button {\n' +
      '        background: #24463d;\n' +
      '        color: #fffdf8;\n' +
      '        border: 0;\n' +
      '        border-radius: 8px;\n' +
      '        padding: 9px 16px;\n' +
      '        font: inherit;\n' +
      '        cursor: pointer;\n' +
      '      }\n' +
      '    </style>\n' +
      '  </head>\n' +
      '  <body>\n' +
      '    <h1>Daftar</h1>\n' +
      '    <form>\n' +
      '      <label>\n' +
      '        <span>Nama</span>\n' +
      '        <input name="nama" required />\n' +
      '      </label>\n' +
      '      <label>\n' +
      '        <span>Surel</span>\n' +
      '        <input name="surel" type="email" required />\n' +
      '      </label>\n' +
      '      <label>\n' +
      '        <span>Kelas</span>\n' +
      '        <select name="kelas">\n' +
      '          <option>Pagi</option>\n' +
      '          <option>Sore</option>\n' +
      '        </select>\n' +
      '      </label>\n' +
      '      <button type="submit">Kirim</button>\n' +
      '    </form>\n' +
      '  </body>\n' +
      '</html>\n',
  },
]

/* -------------------------------------------------------------- javascript */

const JAVASCRIPT: Templat[] = [
  {
    id: 'kosong',
    label: { en: 'Blank', id: 'Kosong' },
    code: '// Apa pun yang kamu console.log muncul di sebelah kanan\nconsole.log("Halo!");\n',
  },
  {
    id: 'array',
    label: { en: 'Array methods', id: 'Method array' },
    code:
      'const angka = [4, 8, 15, 16, 23, 42];\n\n' +
      'const genap = angka.filter((n) => n % 2 === 0);\n' +
      'const dua = angka.map((n) => n * 2);\n' +
      'const total = angka.reduce((a, b) => a + b, 0);\n\n' +
      'console.log("genap:", genap);\n' +
      'console.log("dikali dua:", dua);\n' +
      'console.log("total:", total);\n' +
      'console.log("terbesar:", Math.max(...angka));\n',
  },
  {
    id: 'objek',
    label: { en: 'Objects', id: 'Objek' },
    code:
      'const orang = [\n' +
      '  { nama: "Ani", kota: "Surabaya", umur: 17 },\n' +
      '  { nama: "Budi", kota: "Jakarta", umur: 19 },\n' +
      '  { nama: "Citra", kota: "Surabaya", umur: 18 },\n' +
      '];\n\n' +
      '// kelompokkan berdasarkan kota\n' +
      'const perKota = {};\n' +
      'for (const { nama, kota } of orang) {\n' +
      '  perKota[kota] = [...(perKota[kota] ?? []), nama];\n' +
      '}\n\n' +
      'console.log(perKota);\n' +
      'console.log(Object.entries(perKota).map(([k, v]) => `${k}: ${v.length}`));\n',
  },
  {
    id: 'async',
    label: { en: 'Waiting', id: 'Menunggu' },
    code:
      'const tunggu = (ms) => new Promise((r) => setTimeout(r, ms));\n\n' +
      'async function hitungMundur(dari) {\n' +
      '  for (let n = dari; n > 0; n--) {\n' +
      '    console.log(n);\n' +
      '    await tunggu(400);\n' +
      '  }\n' +
      '  console.log("Mulai!");\n' +
      '}\n\n' +
      'hitungMundur(3);\n',
  },
]

/* ------------------------------------------------------------------- react */

const REACT: Templat[] = [
  {
    id: 'penghitung',
    label: { en: 'Counter', id: 'Penghitung' },
    code:
      'function Penghitung() {\n' +
      '  const [n, setN] = React.useState(0);\n\n' +
      '  return (\n' +
      '    <div style={{ fontFamily: "system-ui, sans-serif", padding: 20 }}>\n' +
      '      <h2>{n}</h2>\n' +
      '      <button onClick={() => setN(n - 1)}>−</button>{" "}\n' +
      '      <button onClick={() => setN(n + 1)}>+</button>{" "}\n' +
      '      <button onClick={() => setN(0)}>reset</button>\n' +
      '    </div>\n' +
      '  );\n' +
      '}\n\n' +
      'ReactDOM.createRoot(document.querySelector("#root")).render(<Penghitung />);\n',
  },
  {
    id: 'daftar',
    label: { en: 'List + form', id: 'Daftar + formulir' },
    code:
      'function Daftar() {\n' +
      '  const [item, setItem] = React.useState(["Belajar React"]);\n' +
      '  const [teks, setTeks] = React.useState("");\n\n' +
      '  function kirim(e) {\n' +
      '    e.preventDefault();\n' +
      '    const bersih = teks.trim();\n' +
      '    if (bersih === "") return;\n' +
      '    setItem([...item, bersih]);\n' +
      '    setTeks("");\n' +
      '  }\n\n' +
      '  return (\n' +
      '    <div style={{ fontFamily: "system-ui, sans-serif", padding: 20 }}>\n' +
      '      <form onSubmit={kirim}>\n' +
      '        <input value={teks} onChange={(e) => setTeks(e.target.value)} placeholder="Tambah…" />{" "}\n' +
      '        <button type="submit">Tambah</button>\n' +
      '      </form>\n' +
      '      <ul>\n' +
      '        {item.map((t, i) => (\n' +
      '          <li key={i} onClick={() => setItem(item.filter((_, n) => n !== i))} style={{ cursor: "pointer" }}>\n' +
      '            {t}\n' +
      '          </li>\n' +
      '        ))}\n' +
      '      </ul>\n' +
      '      <p style={{ color: "#5f7066", fontSize: "0.85rem" }}>Klik sebuah item untuk menghapusnya.</p>\n' +
      '    </div>\n' +
      '  );\n' +
      '}\n\n' +
      'ReactDOM.createRoot(document.querySelector("#root")).render(<Daftar />);\n',
  },
  {
    id: 'router',
    label: { en: 'App with a router', id: 'Aplikasi dengan router' },
    code:
      '// Router mungil, seluruhnya terlihat di sini.\n' +
      '//\n' +
      '// react-router memindahkan halaman lewat history.pushState, dan di dalam\n' +
      '// bingkai pratinjau ini pushState dilarang — origin-nya buram. Yang\n' +
      '// diizinkan adalah hash, jadi router ini memakai hash.\n' +
      '//\n' +
      '// Karena alasan yang sama, href="#/tentang" saja tidak cukup: tanpa\n' +
      '// alamat dasar, peramban memperlakukan kliknya sebagai pindah halaman\n' +
      '// dan pratinjaunya jadi kosong. Jadi tautannya mencegat kliknya sendiri\n' +
      '// lalu menyetel hash-nya — persis yang dilakukan <Link> react-router,\n' +
      '// hanya dengan tujuan yang berbeda.\n\n' +
      'function useRute() {\n' +
      '  const [rute, setRute] = React.useState(() => window.location.hash.slice(1) || "/");\n\n' +
      '  React.useEffect(() => {\n' +
      '    const dengar = () => setRute(window.location.hash.slice(1) || "/");\n' +
      '    window.addEventListener("hashchange", dengar);\n' +
      '    return () => window.removeEventListener("hashchange", dengar);\n' +
      '  }, []);\n\n' +
      '  return rute;\n' +
      '}\n\n' +
      'function Tautan({ ke, anak }) {\n' +
      '  const rute = useRute();\n' +
      '  const aktif = rute === ke;\n\n' +
      '  function klik(e) {\n' +
      '    e.preventDefault();\n' +
      '    window.location.hash = ke;\n' +
      '  }\n\n' +
      '  return (\n' +
      '    <a\n' +
      '      href={"#" + ke}\n' +
      '      onClick={klik}\n' +
      '      style={{ marginRight: 12, fontWeight: aktif ? 700 : 400, color: "#24463d" }}\n' +
      '    >\n' +
      '      {anak}\n' +
      '    </a>\n' +
      '  );\n' +
      '}\n\n' +
      'function Beranda() {\n' +
      '  return <p>Selamat datang. Klik tautan di atas — perhatikan alamatnya berubah.</p>;\n' +
      '}\n\n' +
      'function Tentang() {\n' +
      '  return <p>Halaman ini dirender karena rutenya /tentang.</p>;\n' +
      '}\n\n' +
      'function Kontak() {\n' +
      '  return <p>Dan yang ini karena rutenya /kontak.</p>;\n' +
      '}\n\n' +
      'const RUTE = {\n' +
      '  "/": Beranda,\n' +
      '  "/tentang": Tentang,\n' +
      '  "/kontak": Kontak,\n' +
      '};\n\n' +
      'function Aplikasi() {\n' +
      '  const rute = useRute();\n' +
      '  const Halaman = RUTE[rute];\n\n' +
      '  return (\n' +
      '    <div style={{ fontFamily: "system-ui, sans-serif", padding: 20, color: "#24463d" }}>\n' +
      '      <nav style={{ borderBottom: "1px solid #e7e0cd", paddingBottom: 10, marginBottom: 14 }}>\n' +
      '        <Tautan ke="/" anak="Beranda" />\n' +
      '        <Tautan ke="/tentang" anak="Tentang" />\n' +
      '        <Tautan ke="/kontak" anak="Kontak" />\n' +
      '      </nav>\n' +
      '      {Halaman ? <Halaman /> : <p>Rute {rute} tidak ada.</p>}\n' +
      '    </div>\n' +
      '  );\n' +
      '}\n\n' +
      'ReactDOM.createRoot(document.querySelector("#root")).render(<Aplikasi />);\n',
  },
]

/* --------------------------------------------------------------------- sql */

/** The tables every SQL template runs against. Two of them, so a join has
 *  something to join. */
export const SQL_SCHEMA = `CREATE TABLE penulis (
  id   INTEGER PRIMARY KEY,
  nama TEXT NOT NULL,
  asal TEXT NOT NULL
);

CREATE TABLE buku (
  id         INTEGER PRIMARY KEY,
  judul      TEXT    NOT NULL,
  penulis_id INTEGER REFERENCES penulis(id),
  tahun      INTEGER NOT NULL,
  harga      INTEGER NOT NULL
);

INSERT INTO penulis VALUES
  (1, 'Pramoedya',     'Blora'),
  (2, 'Andrea Hirata', 'Belitung'),
  (3, 'Dee Lestari',   'Bandung');

INSERT INTO buku VALUES
  (1, 'Bumi Manusia',      1, 1980, 110000),
  (2, 'Anak Semua Bangsa', 1, 1981, 105000),
  (3, 'Laskar Pelangi',    2, 2005,  85000),
  (4, 'Sang Pemimpi',      2, 2006,  82000),
  (5, 'Perahu Kertas',     3, 2009,  78000),
  (6, 'Supernova',         3, 2001, 130000);`

const SQL: Templat[] = [
  {
    id: 'kosong',
    label: { en: 'Everything', id: 'Semuanya' },
    code: 'SELECT * FROM buku;\n',
  },
  {
    id: 'saring',
    label: { en: 'Filter + sort', id: 'Saring + urutkan' },
    code: 'SELECT judul, tahun, harga\nFROM buku\nWHERE harga < 110000\nORDER BY harga DESC;\n',
  },
  {
    id: 'gabung',
    label: { en: 'Join', id: 'Gabung' },
    code:
      'SELECT b.judul, p.nama AS penulis, p.asal\n' +
      'FROM buku b\n' +
      'JOIN penulis p ON p.id = b.penulis_id\n' +
      'ORDER BY p.nama, b.tahun;\n',
  },
  {
    id: 'kelompok',
    label: { en: 'Group by', id: 'Kelompokkan' },
    code:
      'SELECT p.nama AS penulis,\n' +
      '       COUNT(*) AS judul,\n' +
      '       ROUND(AVG(b.harga)) AS rata_rata\n' +
      'FROM buku b\n' +
      'JOIN penulis p ON p.id = b.penulis_id\n' +
      'GROUP BY p.nama\n' +
      'HAVING COUNT(*) > 1\n' +
      'ORDER BY rata_rata DESC;\n',
  },
]

/* -------------------------------------------------------------- typescript */

const TYPESCRIPT: Templat[] = [
  {
    id: 'kosong',
    label: { en: 'Blank', id: 'Kosong' },
    code:
      'function sapa(nama: string): string {\n' +
      '  return `Halo, ${nama}!`;\n' +
      '}\n\n' +
      'console.log(sapa("Nunada"));\n\n' +
      '// Hapus keterangan tipenya, atau kirim angka, dan lihat keberatannya.\n',
  },
  {
    id: 'bentuk',
    label: { en: 'Shapes and unions', id: 'Bentuk dan union' },
    code:
      'type Bentuk =\n' +
      '  | { jenis: "lingkaran"; jari: number }\n' +
      '  | { jenis: "persegi"; sisi: number };\n\n' +
      'function luas(b: Bentuk): number {\n' +
      '  switch (b.jenis) {\n' +
      '    case "lingkaran":\n' +
      '      return Math.PI * b.jari ** 2;\n' +
      '    case "persegi":\n' +
      '      return b.sisi ** 2;\n' +
      '  }\n' +
      '}\n\n' +
      'console.log(luas({ jenis: "lingkaran", jari: 2 }).toFixed(2));\n' +
      'console.log(luas({ jenis: "persegi", sisi: 3 }));\n\n' +
      '// Tambahkan anggota ketiga ke Bentuk dan lihat switch-nya mengeluh.\n',
  },
  {
    id: 'generik',
    label: { en: 'Generics', id: 'Generik' },
    code:
      'function terakhir<T>(daftar: T[]): T | undefined {\n' +
      '  return daftar[daftar.length - 1];\n' +
      '}\n\n' +
      'function ambil<T, K extends keyof T>(obj: T, kunci: K): T[K] {\n' +
      '  return obj[kunci];\n' +
      '}\n\n' +
      'const buku = { judul: "Bumi Manusia", tahun: 1980 };\n\n' +
      'console.log(terakhir([1, 2, 3]));\n' +
      'console.log(ambil(buku, "judul").toUpperCase());\n' +
      'console.log(ambil(buku, "tahun") + 1);\n\n' +
      '// Coba ambil(buku, "penulis") — kuncinya tidak ada, dan ia tahu.\n',
  },
]

/* -------------------------------------------------------------------- game */

const GAME: Templat[] = [
  {
    id: 'pantul',
    label: { en: 'Bouncing ball', id: 'Bola pantul' },
    code:
      'JARI = 8\n' +
      'LEBAR = 320\n' +
      'TINGGI = 240\n\n' +
      'def awal():\n' +
      '    return {"x": 60.0, "y": 60.0, "vx": 120.0, "vy": 95.0}\n\n' +
      'def perbarui(keadaan, tombol, dt):\n' +
      '    x = keadaan["x"] + keadaan["vx"] * dt\n' +
      '    y = keadaan["y"] + keadaan["vy"] * dt\n' +
      '    vx = keadaan["vx"]\n' +
      '    vy = keadaan["vy"]\n\n' +
      '    if x < JARI:\n' +
      '        x, vx = JARI, abs(vx)\n' +
      '    if x > LEBAR - JARI:\n' +
      '        x, vx = LEBAR - JARI, -abs(vx)\n' +
      '    if y < JARI:\n' +
      '        y, vy = JARI, abs(vy)\n' +
      '    if y > TINGGI - JARI:\n' +
      '        y, vy = TINGGI - JARI, -abs(vy)\n\n' +
      '    return {"x": x, "y": y, "vx": vx, "vy": vy}\n\n' +
      'def gambar(keadaan):\n' +
      '    return [\n' +
      '        {"bentuk": "lingkaran", "x": keadaan["x"], "y": keadaan["y"], "r": JARI, "warna": "#ef8f70"}\n' +
      '    ]\n',
  },
  {
    id: 'pemain',
    label: { en: 'Something to steer', id: 'Sesuatu untuk dikemudikan' },
    code:
      'LAJU = 150\n' +
      'SISI = 18\n' +
      'LEBAR = 320\n' +
      'TINGGI = 240\n' +
      'JEJAK = 40\n\n' +
      'def awal():\n' +
      '    return {"x": 151.0, "y": 111.0, "jejak": []}\n\n' +
      'def perbarui(keadaan, tombol, dt):\n' +
      '    x = keadaan["x"]\n' +
      '    y = keadaan["y"]\n\n' +
      '    if "kiri" in tombol:\n' +
      '        x = x - LAJU * dt\n' +
      '    if "kanan" in tombol:\n' +
      '        x = x + LAJU * dt\n' +
      '    if "atas" in tombol:\n' +
      '        y = y - LAJU * dt\n' +
      '    if "bawah" in tombol:\n' +
      '        y = y + LAJU * dt\n\n' +
      '    x = max(0, min(LEBAR - SISI, x))\n' +
      '    y = max(0, min(TINGGI - SISI, y))\n\n' +
      '    jejak = (keadaan["jejak"] + [{"x": x, "y": y}])[-JEJAK:]\n' +
      '    return {"x": x, "y": y, "jejak": jejak}\n\n' +
      'def gambar(keadaan):\n' +
      '    hasil = []\n' +
      '    banyak = len(keadaan["jejak"])\n' +
      '    for n, titik in enumerate(keadaan["jejak"]):\n' +
      '        sisi = SISI * (n + 1) / banyak\n' +
      '        hasil.append({\n' +
      '            "bentuk": "kotak",\n' +
      '            "x": titik["x"] + (SISI - sisi) / 2,\n' +
      '            "y": titik["y"] + (SISI - sisi) / 2,\n' +
      '            "l": sisi,\n' +
      '            "t": sisi,\n' +
      '            "warna": "#e9f0e5",\n' +
      '        })\n' +
      '    hasil.append({"bentuk": "kotak", "x": keadaan["x"], "y": keadaan["y"], "l": SISI, "t": SISI, "warna": "#24463d"})\n' +
      '    hasil.append({"bentuk": "teks", "x": 8, "y": 8, "isi": "Panah atau WASD", "warna": "#5f7066"})\n' +
      '    return hasil\n',
  },
]

/* ------------------------------------------------------------------ modes */

export const MODES: Mode[] = [
  { id: 'python', label: { en: 'Python', id: 'Python' }, icon: '🐍', editorLabel: 'Python', templat: PYTHON },
  { id: 'web', label: { en: 'Static site', id: 'Situs statis' }, icon: '📄', editorLabel: 'HTML', templat: WEB },
  { id: 'javascript', label: { en: 'JavaScript', id: 'JavaScript' }, icon: '⚡', editorLabel: 'JavaScript', templat: JAVASCRIPT },
  { id: 'react', label: { en: 'React', id: 'React' }, icon: '⚛️', editorLabel: 'JSX', templat: REACT },
  { id: 'sql', label: { en: 'SQL', id: 'SQL' }, icon: '🗄️', editorLabel: 'SQL', templat: SQL },
  { id: 'typescript', label: { en: 'TypeScript', id: 'TypeScript' }, icon: '🧩', editorLabel: 'TypeScript', templat: TYPESCRIPT },
  { id: 'game', label: { en: 'Game', id: 'Game' }, icon: '🎮', editorLabel: 'Python', templat: GAME },
]

export const modeById = (id: string): Mode => MODES.find((m) => m.id === id) ?? MODES[0]

/** The React runtimes need somewhere to mount. */
export const ROOT_HTML = '<div id="root"></div>'
