import type { Module } from '../types'

/** Module 4 — the closing module: states, motion, and adapting to the screen.
 *
 *  `:hover` and a non-matching media query are invisible to getComputedStyle,
 *  so these tests read the stylesheet with `css()` instead. That checks the rule
 *  exists rather than that it is currently applying, which is the honest thing
 *  to assert for a state the learner cannot be in while the check runs. */
export const module4: Module = {
  id: 'css-m4',
  title: { en: 'States and Screens', id: 'Keadaan dan Layar' },
  summary: {
    en: 'React to the pointer and the keyboard, move smoothly, and fit any width.',
    id: 'Merespons penunjuk dan papan ketik, bergerak halus, dan muat di lebar berapa pun.',
  },
  submodules: [
    {
      id: 'css-m4-s1',
      title: { en: 'Interaction and Adaptation', id: 'Interaksi dan Adaptasi' },
      summary: {
        en: 'Hover, focus, transitions, and the media query.',
        id: 'Hover, focus, transisi, dan media query.',
      },
      lessons: [
        {
          id: 'css-m4-s1-l1',
          title: { en: 'Hover, and why focus matters more', id: 'Hover, dan kenapa focus lebih penting' },
          goal: { en: 'Style an element by its state.', id: 'Memberi gaya berdasarkan keadaan elemen.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A pseudo-class is a condition', id: 'Pseudo-class adalah sebuah kondisi' },
              body: {
                en: '`a:hover` means "a link, while the pointer is over it". The colon marks a state rather than a different element. `:first-child` and `:last-child` work the same way, on position instead of interaction.',
                id: '`a:hover` berarti "sebuah tautan, selagi penunjuk berada di atasnya". Titik dua menandai sebuah keadaan, bukan elemen lain. `:first-child` dan `:last-child` bekerja serupa, berdasarkan posisi alih-alih interaksi.',
              },
              code: '<style>\n  a { color: #2563eb; }\n  a:hover { color: #dc2626; }\n</style>\n\n<p><a href="#">Arahkan penunjuk ke tautan ini</a></p>',
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Not everyone has a mouse', id: 'Tidak semua orang punya tetikus' },
              body: {
                en: 'People who navigate by keyboard move with Tab, which triggers `:focus`, never `:hover`. Removing the focus outline because it "looks ugly" leaves them unable to see where they are. Restyle it if you must, but never delete it.',
                id: 'Orang yang menavigasi dengan papan ketik berpindah memakai Tab, yang memicu `:focus`, bukan `:hover`. Menghapus garis fokus karena "jelek" membuat mereka tak bisa melihat posisinya. Ubah gayanya kalau perlu, tetapi jangan pernah menghapusnya.',
              },
              code: '<style>\n  /* buruk: outline: none; */\n  a:focus {\n    outline: 3px solid #f59e0b;\n    outline-offset: 2px;\n  }\n</style>\n\n<p><a href="#">Tekan Tab untuk melihat fokusnya</a></p>',
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Style both together', id: 'Beri gaya keduanya sekaligus' },
              body: {
                en: 'A comma lets one rule serve both, so a keyboard user gets the same feedback a mouse user does. It costs one extra selector and is the difference between usable and not.',
                id: 'Sebuah koma membuat satu aturan melayani keduanya, sehingga pengguna papan ketik mendapat umpan balik yang sama dengan pengguna tetikus. Biayanya satu selektor tambahan dan itulah pembeda antara bisa dipakai dan tidak.',
              },
              code: '<style>\n  .tombol { background: #e2e8f0; padding: 10px; }\n  .tombol:hover,\n  .tombol:focus { background: #cbd5e1; }\n</style>\n\n<p><a class="tombol" href="#">Tombol</a></p>',
              preview: true,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'You style only `:hover`. Who is left out?',
                id: 'Kamu hanya memberi gaya pada `:hover`. Siapa yang terlewat?',
              },
              options: [
                { en: 'Anyone navigating by keyboard', id: 'Siapa pun yang menavigasi dengan papan ketik' },
                { en: 'Nobody', id: 'Tidak ada' },
                { en: 'Users on large screens', id: 'Pengguna layar besar' },
                { en: 'Users with fast connections', id: 'Pengguna dengan koneksi cepat' },
              ],
              answer: 0,
              explain: {
                en: 'Tab moves focus, not the pointer. Without a :focus rule there is no visible feedback at all.',
                id: 'Tab memindahkan fokus, bukan penunjuk. Tanpa aturan :focus, tidak ada umpan balik yang terlihat sama sekali.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              html: '<nav>\n  <a class="tautan" href="#">Beranda</a>\n  <a class="tautan" href="#">Kursus</a>\n</nav>',
              prompt: {
                en: 'Give `.tautan` the colour `#1d4ed8` with no underline, and on both hover **and** focus make it `#dc2626` and underlined.',
                id: 'Beri `.tautan` warna `#1d4ed8` tanpa garis bawah, dan saat hover **maupun** focus jadikan `#dc2626` dan bergaris bawah.',
              },
              starter: '.tautan {\n\n}\n',
              tests: [
                {
                  name: { en: 'The resting state', id: 'Keadaan diamnya' },
                  check:
                    'assert(style(".tautan", "color") === "rgb(29, 78, 216)", "warna tautan harus #1d4ed8, sekarang: " + style(".tautan", "color"));\nassert(style(".tautan", "text-decoration-line") === "none", "tautan tidak boleh bergaris bawah saat diam");',
                },
                {
                  name: { en: 'A hover rule exists', id: 'Ada aturan hover' },
                  check: 'assert(css().indexOf(":hover") !== -1, "belum ada aturan untuk :hover");',
                },
                {
                  name: { en: 'Focus is covered too', id: 'Focus ikut ditangani' },
                  check:
                    'assert(css().indexOf(":focus") !== -1, "belum ada aturan untuk :focus — pengguna papan ketik akan terlewat");',
                },
                {
                  name: { en: 'Both states change colour and underline', id: 'Kedua keadaan mengubah warna dan garis bawah' },
                  check:
                    'var teks = css().replace(/\\s+/g, " ").toLowerCase();\n["hover", "focus"].forEach(function (st) {\n  var i = teks.indexOf(":" + st);\n  assert(i !== -1, "belum ada aturan :" + st);\n});\nassert(teks.indexOf("underline") !== -1, "keadaan hover/focus harus menambahkan garis bawah");\nassert(teks.indexOf("rgb(220, 38, 38)") !== -1 || teks.indexOf("#dc2626") !== -1, "warna hover/focus harus #dc2626");',
                },
              ],
              hints: [
                { en: 'Two rules: the resting state, then the two states together.', id: 'Dua aturan: keadaan diamnya, lalu kedua keadaannya sekaligus.' },
                { en: 'Separate the two selectors with a comma.', id: 'Pisahkan kedua selektornya dengan koma.' },
                { en: '.tautan:hover, .tautan:focus { … }', id: '.tautan:hover, .tautan:focus { … }' },
              ],
              solution:
                '.tautan {\n  color: #1d4ed8;\n  text-decoration: none;\n}\n\n.tautan:hover,\n.tautan:focus {\n  color: #dc2626;\n  text-decoration: underline;\n}',
            },
          ],
        },
        {
          id: 'css-m4-s1-l2',
          title: { en: 'Motion and small screens', id: 'Gerak dan layar kecil' },
          goal: { en: 'Ease a change, and change with the width.', id: 'Menghaluskan perubahan, dan berubah mengikuti lebar.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'transition softens a jump', id: 'transition melunakkan lompatan' },
              body: {
                en: '`transition: background-color 0.2s` tells the browser to animate between the old and new value instead of snapping. It goes on the **resting** rule, not on `:hover`, so it applies in both directions.',
                id: '`transition: background-color 0.2s` menyuruh peramban menganimasikan perubahan dari nilai lama ke baru alih-alih meloncat. Ia ditulis pada aturan **diam**, bukan pada `:hover`, agar berlaku ke dua arah.',
              },
              code: '<style>\n  .kotak {\n    background: #93c5fd;\n    padding: 16px;\n    transition: background-color 0.3s;\n  }\n  .kotak:hover { background: #1d4ed8; }\n</style>\n\n<div class="kotak">Arahkan penunjuk — warnanya meluncur.</div>',
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A media query is an if for the screen', id: 'Media query adalah if untuk layar' },
              body: {
                en: '`@media (max-width: 600px) { … }` holds rules that only apply below that width. Everything inside is ordinary CSS — the query is just a condition wrapped around it.',
                id: '`@media (max-width: 600px) { … }` memuat aturan yang hanya berlaku di bawah lebar itu. Semua di dalamnya CSS biasa — query-nya sekadar kondisi yang membungkusnya.',
              },
              code: '<style>\n  .kisi { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }\n  .kisi div { background: #fca5a5; padding: 12px; }\n\n  @media (max-width: 600px) {\n    .kisi { grid-template-columns: 1fr; }\n  }\n</style>\n\n<div class="kisi"><div>1</div><div>2</div><div>3</div></div>',
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Write the small screen first', id: 'Tulis layar kecilnya lebih dulu' },
              body: {
                en: 'Most sites are read on a phone. Style the narrow case as the default, then use `min-width` to add complexity as the screen grows. The result is simpler CSS and a faster small-screen page.',
                id: 'Sebagian besar situs dibaca di ponsel. Beri gaya kasus sempit sebagai bawaannya, lalu pakai `min-width` untuk menambah kerumitan seiring layarnya membesar. Hasilnya CSS yang lebih sederhana dan halaman layar kecil yang lebih cepat.',
              },
              code: '<style>\n  .kisi { display: grid; grid-template-columns: 1fr; gap: 8px; }\n\n  @media (min-width: 700px) {\n    .kisi { grid-template-columns: repeat(3, 1fr); }\n  }\n</style>',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'Where should `transition` be declared?', id: 'Di mana `transition` sebaiknya dideklarasikan?' },
              options: [
                { en: 'On the resting rule, so it works both ways', id: 'Pada aturan diamnya, agar berlaku dua arah' },
                { en: 'On the :hover rule only', id: 'Hanya pada aturan :hover' },
                { en: 'On the body', id: 'Pada body' },
                { en: 'Inside a media query', id: 'Di dalam media query' },
              ],
              answer: 0,
              explain: {
                en: 'Put it on :hover and the element eases in but snaps back the moment the pointer leaves.',
                id: 'Taruh di :hover dan elemennya meluncur masuk tapi meloncat kembali begitu penunjuknya pergi.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              html: '<div class="kisi">\n  <div class="sel">A</div>\n  <div class="sel">B</div>\n  <div class="sel">C</div>\n</div>',
              prompt: {
                en: 'Make `.kisi` a single column by default, and three equal columns from 700px up. Give `.sel` a `#e0f2fe` background that transitions over 0.2s and turns `#7dd3fc` on hover.',
                id: 'Buat `.kisi` satu kolom secara bawaan, dan tiga kolom sama lebar mulai 700px ke atas. Beri `.sel` latar `#e0f2fe` yang bertransisi 0,2 detik dan berubah `#7dd3fc` saat hover.',
              },
              starter: '.kisi {\n  display: grid;\n  gap: 8px;\n}\n',
              tests: [
                {
                  name: { en: 'One column is the default', id: 'Satu kolom sebagai bawaan' },
                  check:
                    'assert(style(".kisi", "display") === "grid", "display .kisi harus grid");\nvar teks = css().replace(/\\s+/g, " ");\nvar sebelum = teks.split("@media")[0];\nassert(sebelum.indexOf("1fr") !== -1, "bawaannya harus satu kolom (1fr) di luar media query");',
                },
                {
                  name: { en: 'A min-width query at 700px', id: 'Media query min-width 700px' },
                  check:
                    'var teks = css().replace(/\\s+/g, " ");\nassert(teks.indexOf("@media") !== -1, "belum ada @media");\nassert(teks.indexOf("min-width: 700px") !== -1 || teks.indexOf("min-width:700px") !== -1, "query-nya harus min-width: 700px");',
                },
                {
                  name: { en: 'Three columns inside the query', id: 'Tiga kolom di dalam query-nya' },
                  check:
                    'var teks = css().replace(/\\s+/g, " ");\nvar i = teks.indexOf("@media");\nvar sesudah = teks.slice(i);\nassert(/repeat\\(\\s*3|1fr 1fr 1fr/.test(sesudah), "di dalam media query harus ada tiga kolom");',
                },
                {
                  name: { en: 'Cells are coloured and eased', id: 'Selnya berwarna dan bertransisi' },
                  check:
                    'assert(style(".sel", "background-color") === "rgb(224, 242, 254)", "latar .sel harus #e0f2fe");\nvar d = style(".sel", "transition-duration");\nassert(d === "0.2s" || d === "200ms", "transition harus 0.2s, sekarang: " + d);',
                },
                {
                  name: { en: 'A hover state exists', id: 'Ada keadaan hover' },
                  check:
                    'var teks = css().replace(/\\s+/g, " ").toLowerCase();\nassert(teks.indexOf(":hover") !== -1, "belum ada aturan :hover");\nassert(teks.indexOf("#7dd3fc") !== -1 || teks.indexOf("rgb(125, 211, 252)") !== -1, "warna hover harus #7dd3fc");',
                },
              ],
              hints: [
                { en: 'The starter already opens .kisi — add the single column there.', id: 'Kode awalnya sudah membuka .kisi — tambahkan satu kolomnya di situ.' },
                { en: 'The media query goes at the end, holding one rule.', id: 'Media query-nya diletakkan di akhir, memuat satu aturan.' },
                { en: 'transition goes on .sel, not on .sel:hover.', id: 'transition ditaruh di .sel, bukan di .sel:hover.' },
              ],
              solution:
                '.kisi {\n  display: grid;\n  gap: 8px;\n  grid-template-columns: 1fr;\n}\n\n.sel {\n  background-color: #e0f2fe;\n  transition: background-color 0.2s;\n}\n\n.sel:hover {\n  background-color: #7dd3fc;\n}\n\n@media (min-width: 700px) {\n  .kisi {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}',
            },
          ],
        },
      ],
      project: {
        id: 'css-m4-s1-p',
        runtime: 'web',
        html: '<div class="halaman">\n  <header class="bar">\n    <div class="logo">Nunada</div>\n    <nav class="menu">\n      <a href="#">Beranda</a>\n      <a href="#">Kursus</a>\n    </nav>\n  </header>\n\n  <main class="isi">\n    <h1>Profil</h1>\n    <p class="ringkas">Pengajar dan pengembang.</p>\n\n    <div class="kisi">\n      <article class="kartu"><h2>Python</h2><p>Sembilan modul.</p></article>\n      <article class="kartu"><h2>HTML</h2><p>Empat modul.</p></article>\n      <article class="kartu"><h2>CSS</h2><p>Empat modul.</p></article>\n    </div>\n  </main>\n\n  <footer class="kaki"><p>&copy; 2026 Nunada</p></footer>\n</div>',
        title: { en: 'Styled profile page', id: 'Halaman profil bergaya' },
        brief: {
          en: 'Everything at once: a centred page, a flex header, a responsive grid, and states that respond to both mouse and keyboard.',
          id: 'Semuanya sekaligus: halaman terpusat, header flex, kisi responsif, dan keadaan yang merespons tetikus maupun papan ketik.',
        },
        requirements: [
          { en: '`box-sizing: border-box` for everything.', id: '`box-sizing: border-box` untuk semuanya.' },
          { en: '`.halaman` is centred with a max-width of 900px.', id: '`.halaman` terpusat dengan max-width 900px.' },
          { en: '`.bar` is a flex row, 64px tall, `#0f172a` background, logo left and menu right, vertically centred.', id: '`.bar` baris flex, tinggi 64px, latar `#0f172a`, logo kiri dan menu kanan, terpusat vertikal.' },
          { en: '`.menu` is a flex row with a 16px gap; its links are `#e2e8f0` with no underline.', id: '`.menu` baris flex dengan gap 16px; tautannya `#e2e8f0` tanpa garis bawah.' },
          { en: 'Menu links change colour on hover **and** focus.', id: 'Tautan menu berubah warna saat hover **dan** focus.' },
          { en: '`.kisi` is one column by default and three equal columns from 700px up, gap 16px.', id: '`.kisi` satu kolom secara bawaan dan tiga kolom sama lebar mulai 700px, gap 16px.' },
          { en: '`.kartu` has 20px padding, a 1px solid `#e2e8f0` border, a 12px radius, and transitions its border colour over 0.2s.', id: '`.kartu` berpadding 20px, border solid 1px `#e2e8f0`, radius 12px, dan mentransisikan warna bordernya 0,2 detik.' },
        ],
        starter: '* {\n  box-sizing: border-box;\n}\n\n.halaman {\n\n}\n',
        tests: [
          {
            name: { en: 'The page is centred and capped', id: 'Halamannya terpusat dan dibatasi' },
            check:
              'assert(style(".halaman", "max-width") === "900px", "max-width harus 900px");\nvar r = sel(".halaman").getBoundingClientRect();\nvar kiri = r.left;\nvar kanan = doc.documentElement.clientWidth - r.right;\nassert(Math.abs(kiri - kanan) < 2, "halamannya harus terpusat (kiri " + Math.round(kiri) + ", kanan " + Math.round(kanan) + ")");',
          },
          {
            name: { en: 'The header is a proper flex bar', id: 'Headernya bilah flex yang benar' },
            check:
              'assert(style(".bar", "display") === "flex", "display .bar harus flex");\nassert(style(".bar", "height") === "64px", "tinggi .bar harus 64px");\nassert(style(".bar", "background-color") === "rgb(15, 23, 42)", "latar .bar harus #0f172a");\nassert(style(".bar", "align-items") === "center", "align-items harus center");\nvar bar = sel(".bar").getBoundingClientRect();\nvar menu = sel(".menu").getBoundingClientRect();\nassert(bar.right - menu.right < bar.width / 2, "menu harus berada di sisi kanan");',
          },
          {
            name: { en: 'The menu spaces and styles its links', id: 'Menunya memberi jarak dan gaya tautannya' },
            check:
              'assert(style(".menu", "display") === "flex", "display .menu harus flex");\nvar a = all(".menu a");\nvar jarak = Math.round(a[1].getBoundingClientRect().left - a[0].getBoundingClientRect().right);\nassert(Math.abs(jarak - 16) < 2, "gap menu harus 16px, sekarang: " + jarak + "px");\nassert(style(".menu a", "color") === "rgb(226, 232, 240)", "warna tautan harus #e2e8f0");\nassert(style(".menu a", "text-decoration-line") === "none", "tautan tidak boleh bergaris bawah");',
          },
          {
            name: { en: 'Hover and focus are both handled', id: 'Hover dan focus sama-sama ditangani' },
            check:
              'var teks = css().replace(/\\s+/g, " ").toLowerCase();\nassert(teks.indexOf(":hover") !== -1, "belum ada aturan :hover");\nassert(teks.indexOf(":focus") !== -1, "belum ada aturan :focus — pengguna papan ketik akan terlewat");',
          },
          {
            name: { en: 'The grid is one column, then three', id: 'Kisinya satu kolom, lalu tiga' },
            check:
              'assert(style(".kisi", "display") === "grid", "display .kisi harus grid");\nvar teks = css().replace(/\\s+/g, " ");\nassert(teks.indexOf("@media") !== -1, "belum ada @media");\nassert(teks.indexOf("min-width: 700px") !== -1 || teks.indexOf("min-width:700px") !== -1, "query-nya harus min-width: 700px");\nvar sesudah = teks.slice(teks.indexOf("@media"));\nassert(/repeat\\(\\s*3|1fr 1fr 1fr/.test(sesudah), "di dalam media query harus ada tiga kolom");',
          },
          {
            name: { en: 'Cards are styled and eased', id: 'Kartunya bergaya dan bertransisi' },
            check:
              'assert(style(".kartu", "padding-top") === "20px", "padding kartu harus 20px");\nassert(style(".kartu", "border-top-width") === "1px", "border harus 1px");\nassert(style(".kartu", "border-top-color") === "rgb(226, 232, 240)", "warna border harus #e2e8f0");\nassert(style(".kartu", "border-top-left-radius") === "12px", "radius harus 12px");\nvar d = style(".kartu", "transition-duration");\nassert(d === "0.2s" || d === "200ms", "transition kartu harus 0.2s, sekarang: " + d);',
          },
        ],
        hints: [
          { en: 'Work top down: page, header, menu, grid, cards. Each is something you have already built.', id: 'Kerjakan dari atas: halaman, header, menu, kisi, kartu. Tiap bagian sudah pernah kamu bangun.' },
          { en: 'The centred page needs both max-width and margin auto.', id: 'Halaman terpusat butuh max-width sekaligus margin auto.' },
          { en: 'One rule can serve both states: `.menu a:hover, .menu a:focus`.', id: 'Satu aturan bisa melayani kedua keadaan: `.menu a:hover, .menu a:focus`.' },
          { en: 'Put the media query last, holding only the grid change.', id: 'Taruh media query paling akhir, memuat hanya perubahan kisinya.' },
        ],
        solution:
          '* {\n  box-sizing: border-box;\n}\n\n.halaman {\n  max-width: 900px;\n  margin: 0 auto;\n}\n\n.bar {\n  display: flex;\n  height: 64px;\n  padding: 0 20px;\n  background-color: #0f172a;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.logo {\n  color: white;\n  font-weight: bold;\n}\n\n.menu {\n  display: flex;\n  gap: 16px;\n}\n\n.menu a {\n  color: #e2e8f0;\n  text-decoration: none;\n  transition: color 0.2s;\n}\n\n.menu a:hover,\n.menu a:focus {\n  color: #7dd3fc;\n}\n\n.isi {\n  padding: 20px;\n}\n\n.kisi {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 16px;\n}\n\n.kartu {\n  padding: 20px;\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n  transition: border-color 0.2s;\n}\n\n.kartu:hover {\n  border-color: #7dd3fc;\n}\n\n.kaki {\n  padding: 20px;\n  color: #64748b;\n}\n\n@media (min-width: 700px) {\n  .kisi {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}',
        xp: 80,
      },
    },
  ],
}
