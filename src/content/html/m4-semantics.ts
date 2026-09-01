import type { Module } from '../types'

/** Module 4 — the closing module: naming the regions of a page, and one
 *  capstone that uses everything the course has covered. */
export const module4: Module = {
  id: 'html-m4',
  title: { en: 'Semantic Structure', id: 'Struktur Semantik' },
  summary: {
    en: 'Name the regions of a page so both people and machines can find them.',
    id: 'Menamai bagian-bagian halaman agar manusia maupun mesin bisa menemukannya.',
  },
  submodules: [
    {
      id: 'html-m4-s1',
      title: { en: 'Naming the Regions', id: 'Menamai Bagian Halaman' },
      summary: {
        en: 'header, nav, main, footer — and when a div is still the right answer.',
        id: 'header, nav, main, footer — dan kapan div tetap jawaban yang tepat.',
      },
      lessons: [
        {
          id: 'html-m4-s1-l1',
          title: { en: 'The four landmarks', id: 'Empat penanda utama' },
          goal: { en: 'Lay out a page with named regions.', id: 'Menata halaman dengan bagian yang bernama.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A page has regions, not just boxes', id: 'Halaman punya bagian, bukan sekadar kotak' },
              body: {
                en: '`<header>` is the top matter, `<nav>` the navigation, `<main>` the unique content of this page, `<footer>` the closing matter. A screen-reader user can jump straight to `main` and skip the menu they have already heard on every other page.',
                id: '`<header>` adalah bagian atas, `<nav>` navigasinya, `<main>` isi khas halaman ini, `<footer>` bagian penutup. Pengguna pembaca layar bisa melompat langsung ke `main` dan melewati menu yang sudah mereka dengar di setiap halaman lain.',
              },
              code: {
                en: '<header>\n  <h1>Nunada Academy</h1>\n</header>\n<nav>\n  <ul><li><a href="index.html">Home</a></li></ul>\n</nav>\n<main>\n  <p>The main content of this page.</p>\n</main>\n<footer>\n  <p>&copy; 2026 Nunada</p>\n</footer>',
                id: '<header>\n  <h1>Nunada Academy</h1>\n</header>\n<nav>\n  <ul><li><a href="index.html">Beranda</a></li></ul>\n</nav>\n<main>\n  <p>Isi utama halaman ini.</p>\n</main>\n<footer>\n  <p>&copy; 2026 Nunada</p>\n</footer>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Exactly one main', id: 'Tepat satu main' },
              body: {
                en: 'A page has one `<main>`, and the header, nav and footer sit outside it — they repeat across the site, so they are not what makes this page unique.',
                id: 'Sebuah halaman punya satu `<main>`, dan header, nav, serta footer berada di luarnya — semuanya berulang di seluruh situs, jadi bukan itu yang membuat halaman ini khas.',
              },
              code: '<body>\n  <header>…</header>\n  <nav>…</nav>\n  <main>…</main>\n  <footer>…</footer>\n</body>',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Where does the site-wide menu belong?',
                id: 'Di mana menu yang berlaku seluruh situs sebaiknya diletakkan?',
              },
              options: [
                { en: 'In a nav, outside main', id: 'Di dalam nav, di luar main' },
                { en: 'Inside main', id: 'Di dalam main' },
                { en: 'In the footer only', id: 'Hanya di footer' },
                { en: 'In the head', id: 'Di dalam head' },
              ],
              answer: 0,
              explain: {
                en: 'main is for what is unique to this page. A menu shared by every page is not.',
                id: 'main untuk yang khas halaman ini. Menu yang dipakai semua halaman bukan termasuk.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: { en: 'Put the regions of a page in order.', id: 'Susun bagian-bagian halaman dengan urutan yang benar.' },
              lines: ['<body>', '  <header>…</header>', '  <nav>…</nav>', '  <main>…</main>', '  <footer>…</footer>', '</body>'],
              explain: {
                en: 'They follow reading order: masthead, navigation, the page itself, closing matter.',
                id: 'Urutannya mengikuti alur baca: kepala halaman, navigasi, isi halaman itu sendiri, lalu penutup.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              prompt: {
                en: 'Build the four regions: a `header` with an `h1` `My Blog`, a `nav` with one link to `index.html`, a `main` with one paragraph, and a `footer` with one paragraph.',
                id: 'Bangun empat bagian: `header` berisi `h1` `Blog Saya`, `nav` berisi satu tautan ke `index.html`, `main` berisi satu paragraf, dan `footer` berisi satu paragraf.',
              },
              starter: '',
              tests: {
                en: [
                  {
                    name: { en: 'All four regions exist', id: 'All four regions exist' },
                    check:
                      '["header", "nav", "main", "footer"].forEach(function (r) {\n  assert(sel(r), "there is no <" + r + "> yet");\n});\nassert(all("main").length === 1, "there must be exactly one <main>");',
                  },
                  {
                    name: { en: 'The header holds the title', id: 'The header holds the title' },
                    check: 'assert(sel("header h1"), "the h1 must be inside <header>");\nassert(text("header h1") === "My Blog", "h1 must be: My Blog");',
                  },
                  {
                    name: { en: 'The nav holds a link', id: 'The nav holds a link' },
                    check: 'assert(sel("nav a"), "the nav must contain a link");\nassert(attr("nav a", "href") === "index.html", "the link must point to index.html");',
                  },
                  {
                    name: { en: 'main and footer each hold a paragraph', id: 'main and footer each hold a paragraph' },
                    check:
                      'assert(sel("main p"), "main must contain a paragraph");\nassert(text("main p").length > 0, "the paragraph in main must not be empty");\nassert(sel("footer p"), "footer must contain a paragraph");',
                  },
                ],
                id: [
                  {
                    name: { en: 'All four regions exist', id: 'Keempat bagian ada' },
                    check:
                      '["header", "nav", "main", "footer"].forEach(function (r) {\n  assert(sel(r), "belum ada <" + r + ">");\n});\nassert(all("main").length === 1, "harus tepat satu <main>");',
                  },
                  {
                    name: { en: 'The header holds the title', id: 'Header memuat judulnya' },
                    check: 'assert(sel("header h1"), "h1 harus di dalam <header>");\nassert(text("header h1") === "Blog Saya", "h1 harus: Blog Saya");',
                  },
                  {
                    name: { en: 'The nav holds a link', id: 'Nav memuat sebuah tautan' },
                    check: 'assert(sel("nav a"), "nav harus memuat sebuah tautan");\nassert(attr("nav a", "href") === "index.html", "tautannya harus menuju index.html");',
                  },
                  {
                    name: { en: 'main and footer each hold a paragraph', id: 'main dan footer masing-masing memuat paragraf' },
                    check:
                      'assert(sel("main p"), "main harus memuat sebuah paragraf");\nassert(text("main p").length > 0, "paragraf di main tidak boleh kosong");\nassert(sel("footer p"), "footer harus memuat sebuah paragraf");',
                  },
                ],
              },
              hints: [
                { en: 'Four sibling elements, one after another.', id: 'Empat elemen bersaudara, satu demi satu.' },
                { en: 'Nothing goes inside main except the page-specific paragraph.', id: 'Tidak ada yang masuk ke main selain paragraf khas halaman itu.' },
              ],
              solution: {
                en: '<header>\n  <h1>My Blog</h1>\n</header>\n<nav>\n  <ul>\n    <li><a href="index.html">Home</a></li>\n  </ul>\n</nav>\n<main>\n  <p>Welcome to my blog.</p>\n</main>\n<footer>\n  <p>&copy; 2026 Nunada</p>\n</footer>',
                id: '<header>\n  <h1>Blog Saya</h1>\n</header>\n<nav>\n  <ul>\n    <li><a href="index.html">Beranda</a></li>\n  </ul>\n</nav>\n<main>\n  <p>Selamat datang di blog saya.</p>\n</main>\n<footer>\n  <p>&copy; 2026 Nunada</p>\n</footer>',
              },
            },
          ],
        },
        {
          id: 'html-m4-s1-l2',
          title: { en: 'section, article, and div', id: 'section, article, dan div' },
          goal: { en: 'Group content, and know when a div is enough.', id: 'Mengelompokkan isi, dan tahu kapan div sudah cukup.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'article stands alone, section is a part', id: 'article berdiri sendiri, section adalah bagian' },
              body: {
                en: 'An `<article>` still makes sense pulled out of the page — a blog post, a product card. A `<section>` is a themed part of something larger and normally opens with a heading.',
                id: 'Sebuah `<article>` tetap masuk akal bila dicabut dari halamannya — sebuah tulisan blog, sebuah kartu produk. Sebuah `<section>` adalah bagian bertema dari sesuatu yang lebih besar dan biasanya diawali sebuah judul.',
              },
              code: {
                en: '<main>\n  <article>\n    <h2>Learning HTML</h2>\n    <p>This piece can stand on its own.</p>\n  </article>\n  <section>\n    <h2>Comments</h2>\n    <p>Part of this page.</p>\n  </section>\n</main>',
                id: '<main>\n  <article>\n    <h2>Belajar HTML</h2>\n    <p>Tulisan ini bisa berdiri sendiri.</p>\n  </article>\n  <section>\n    <h2>Komentar</h2>\n    <p>Bagian dari halaman ini.</p>\n  </section>\n</main>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'div and span mean nothing, on purpose', id: 'div dan span tidak bermakna, dan itu disengaja' },
              body: {
                en: 'When you need a box purely to hang styling on, `<div>` is the honest choice — and `<span>` is its inline twin. Reaching for `<section>` because it "sounds nicer" invents a structure that is not there.',
                id: 'Saat kamu butuh kotak semata-mata untuk menempelkan gaya, `<div>` adalah pilihan yang jujur — dan `<span>` adalah kembaran sebarisnya. Memakai `<section>` karena "terdengar lebih bagus" berarti mengarang struktur yang sebenarnya tidak ada.',
              },
              code: {
                en: '<p>Price: <span class="price">Rp3.000</span></p>\n<div class="box">\n  <p>Wrapped purely for layout purposes.</p>\n</div>',
                id: '<p>Harga: <span class="harga">Rp3.000</span></p>\n<div class="kotak">\n  <p>Dibungkus hanya untuk keperluan tata letak.</p>\n</div>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'id is unique, class is shared', id: 'id itu unik, class itu bersama' },
              body: {
                en: 'An `id` may appear once per page and names one specific element. A `class` may be repeated on as many elements as you like. Both are hooks for CSS and JavaScript later.',
                id: 'Sebuah `id` hanya boleh muncul sekali per halaman dan menamai satu elemen tertentu. Sebuah `class` boleh diulang pada sebanyak apa pun elemen. Keduanya adalah pegangan untuk CSS dan JavaScript nanti.',
              },
              code: {
                en: '<div id="main-box">\n  <p class="note">One</p>\n  <p class="note">Two</p>\n</div>',
                id: '<div id="utama">\n  <p class="catatan">Satu</p>\n  <p class="catatan">Dua</p>\n</div>',
              },
              preview: true,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A blog post that could be republished on its own. Which element?',
                id: 'Sebuah tulisan blog yang bisa diterbitkan ulang secara mandiri. Elemen mana?',
              },
              options: [
                { en: '<article>', id: '<article>' },
                { en: '<section>', id: '<section>' },
                { en: '<div>', id: '<div>' },
                { en: '<main>', id: '<main>' },
              ],
              answer: 0,
              explain: {
                en: 'Standing alone is exactly what article means.',
                id: 'Berdiri sendiri persis itulah arti article.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              prompt: {
                en: 'Inside a `main`, write two `article` elements. Each has an `h2` and a paragraph. Give the first one `id="first"` and both `class="post"`.',
                id: 'Di dalam sebuah `main`, tulis dua elemen `article`. Masing-masing punya `h2` dan sebuah paragraf. Beri yang pertama `id="pertama"` dan keduanya `class="tulisan"`.',
              },
              starter: '<main>\n\n</main>\n',
              tests: {
                en: [
                  {
                    name: { en: 'Two articles inside main', id: 'Two articles inside main' },
                    check: 'var a = all("main article");\nassert(a.length === 2, "there must be exactly two <article>, found: " + a.length);',
                  },
                  {
                    name: { en: 'Each has a heading and a paragraph', id: 'Each has a heading and a paragraph' },
                    check:
                      'all("main article").forEach(function (a, i) {\n  assert(a.querySelector("h2"), "article " + (i + 1) + " needs an <h2>");\n  assert(a.querySelector("p"), "article " + (i + 1) + " needs a <p>");\n  assert(a.querySelector("h2").textContent.trim().length > 0, "the heading must not be empty");\n});',
                  },
                  {
                    name: { en: 'The hooks are in place', id: 'The hooks are in place' },
                    check:
                      'var a = all("main article");\nassert(a[0].getAttribute("id") === "first", "the first article needs id=first");\nassert(all("article.post").length === 2, "both articles need class=post");\nassert(all("#first").length === 1, "the id first must be used only once");',
                  },
                ],
                id: [
                  {
                    name: { en: 'Two articles inside main', id: 'Dua article di dalam main' },
                    check: 'var a = all("main article");\nassert(a.length === 2, "harus tepat dua <article>, ada: " + a.length);',
                  },
                  {
                    name: { en: 'Each has a heading and a paragraph', id: 'Masing-masing punya judul dan paragraf' },
                    check:
                      'all("main article").forEach(function (a, i) {\n  assert(a.querySelector("h2"), "article ke-" + (i + 1) + " butuh <h2>");\n  assert(a.querySelector("p"), "article ke-" + (i + 1) + " butuh <p>");\n  assert(a.querySelector("h2").textContent.trim().length > 0, "judul tidak boleh kosong");\n});',
                  },
                  {
                    name: { en: 'The hooks are in place', id: 'Pegangannya terpasang' },
                    check:
                      'var a = all("main article");\nassert(a[0].getAttribute("id") === "pertama", "article pertama butuh id=pertama");\nassert(all("article.tulisan").length === 2, "kedua article butuh class=tulisan");\nassert(all("#pertama").length === 1, "id pertama hanya boleh dipakai sekali");',
                  },
                ],
              },
              hints: [
                { en: 'The first article carries both attributes; the second only the class.', id: 'Article pertama membawa kedua atribut; yang kedua hanya class-nya.' },
                { en: '<article id="first" class="post">', id: '<article id="pertama" class="tulisan">' },
              ],
              solution: {
                en: '<main>\n  <article id="first" class="post">\n    <h2>First Post</h2>\n    <p>Content of the first post.</p>\n  </article>\n  <article class="post">\n    <h2>Second Post</h2>\n    <p>Content of the second post.</p>\n  </article>\n</main>',
                id: '<main>\n  <article id="pertama" class="tulisan">\n    <h2>Tulisan Pertama</h2>\n    <p>Isi tulisan pertama.</p>\n  </article>\n  <article class="tulisan">\n    <h2>Tulisan Kedua</h2>\n    <p>Isi tulisan kedua.</p>\n  </article>\n</main>',
              },
            },
          ],
        },
      ],
      project: {
        id: 'html-m4-s1-p',
        runtime: 'web',
        title: { en: 'Complete profile page', id: 'Halaman profil lengkap' },
        brief: {
          en: 'Everything at once: named regions, a navigation menu, articles, a table, and a labelled form.',
          id: 'Semuanya sekaligus: bagian bernama, menu navigasi, artikel, tabel, dan formulir berlabel.',
        },
        requirements: [
          { en: 'Full document: lang `en`, charset utf-8, title `Complete Profile`.', id: 'Dokumen lengkap: lang `id`, charset utf-8, judul `Profil Lengkap`.' },
          { en: 'A `header` with exactly one `h1`.', id: 'Sebuah `header` dengan tepat satu `h1`.' },
          { en: 'A `nav` with a `ul` of at least three links.', id: 'Sebuah `nav` dengan `ul` berisi minimal tiga tautan.' },
          { en: 'Exactly one `main`, holding at least two `article` elements, each with an `h2`.', id: 'Tepat satu `main`, memuat minimal dua elemen `article`, masing-masing dengan `h2`.' },
          { en: 'Inside main, a table with a `caption` and a `thead`.', id: 'Di dalam main, sebuah tabel dengan `caption` dan `thead`.' },
          { en: 'Inside main, a form with at least two fields, each with a matching `label`, and a submit button.', id: 'Di dalam main, sebuah formulir dengan minimal dua isian, masing-masing dengan `label` yang cocok, dan tombol kirim.' },
          { en: 'An image with a descriptive `alt`.', id: 'Sebuah gambar dengan `alt` deskriptif.' },
          { en: 'A `footer` with a paragraph.', id: 'Sebuah `footer` dengan sebuah paragraf.' },
        ],
        starter: {
          en: '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8">\n    <title>Complete Profile</title>\n  </head>\n  <body>\n\n  </body>\n</html>\n',
          id: '<!doctype html>\n<html lang="id">\n  <head>\n    <meta charset="utf-8">\n    <title>Profil Lengkap</title>\n  </head>\n  <body>\n\n  </body>\n</html>\n',
        },
        tests: {
          en: [
            {
              name: { en: 'The document and its regions', id: 'The document and its regions' },
              check:
                'assert(doc.documentElement.getAttribute("lang") === "en", "lang must be en");\nassert(sel("meta[charset]"), "there is no meta charset yet");\nassert(doc.title === "Complete Profile", "the title must be: Complete Profile");\n["header", "nav", "main", "footer"].forEach(function (r) { assert(sel(r), "there is no <" + r + "> yet"); });\nassert(all("main").length === 1, "there must be exactly one <main>");\nassert(all("header h1").length === 1, "the header must have exactly one h1");',
            },
            {
              name: { en: 'Navigation with three links', id: 'Navigation with three links' },
              check:
                'var a = all("nav ul li a");\nassert(a.length >= 3, "the nav needs at least three links in <ul><li>, found: " + a.length);\na.forEach(function (x) {\n  assert(x.getAttribute("href"), "every link needs an href");\n  assert(x.textContent.trim().length > 0, "every link needs text");\n});',
            },
            {
              name: { en: 'Two articles with headings', id: 'Two articles with headings' },
              check:
                'var art = all("main article");\nassert(art.length >= 2, "main needs at least two <article>, found: " + art.length);\nart.forEach(function (x, i) {\n  assert(x.querySelector("h2"), "article " + (i + 1) + " needs an <h2>");\n  assert(x.querySelector("h2").textContent.trim().length > 0, "the article heading must not be empty");\n});',
            },
            {
              name: { en: 'A captioned table', id: 'A captioned table' },
              check:
                'var t = sel("main table");\nassert(t, "main needs a <table>");\nassert(t.querySelector("caption"), "the table needs a <caption>");\nassert(t.querySelector("caption").textContent.trim().length > 0, "the caption must not be empty");\nassert(t.querySelector("thead th"), "the table needs a <thead> containing <th>");\nassert(t.querySelectorAll("tbody tr").length >= 1, "the table needs at least one data row in tbody");',
            },
            {
              name: { en: 'A form where every field is labelled', id: 'A form where every field is labelled' },
              check:
                'var f = sel("main form");\nassert(f, "main needs a <form>");\nvar fields = Array.prototype.slice.call(f.querySelectorAll("input, select, textarea"));\nassert(fields.length >= 2, "the form needs at least two fields, found: " + fields.length);\nfields.forEach(function (x) {\n  var id = x.getAttribute("id");\n  assert(id, "every field needs an id");\n  assert(doc.querySelector(\'label[for="\' + id + \'"]\'), "there is no label for the field with id " + id);\n});\nassert(f.querySelector("button, input[type=submit]"), "the form needs a submit button");',
            },
            {
              name: { en: 'An image that describes itself', id: 'An image that describes itself' },
              check:
                'var img = sel("img");\nassert(img, "there is no <img> yet");\nassert(img.getAttribute("src"), "img needs a src");\nvar alt = img.getAttribute("alt");\nassert(alt !== null, "img must have an alt");\nassert(alt.trim().length >= 10, "alt must be descriptive, at least 10 characters");',
            },
            {
              name: { en: 'A footer with a paragraph', id: 'A footer with a paragraph' },
              check: 'assert(sel("footer p"), "footer needs a paragraph");\nassert(text("footer p").length > 0, "the footer paragraph must not be empty");',
            },
          ],
          id: [
            {
              name: { en: 'The document and its regions', id: 'Dokumen dan bagian-bagiannya' },
              check:
                'assert(doc.documentElement.getAttribute("lang") === "id", "lang harus id");\nassert(sel("meta[charset]"), "belum ada meta charset");\nassert(doc.title === "Profil Lengkap", "judul harus: Profil Lengkap");\n["header", "nav", "main", "footer"].forEach(function (r) { assert(sel(r), "belum ada <" + r + ">"); });\nassert(all("main").length === 1, "harus tepat satu <main>");\nassert(all("header h1").length === 1, "header harus punya tepat satu h1");',
            },
            {
              name: { en: 'Navigation with three links', id: 'Navigasi dengan tiga tautan' },
              check:
                'var a = all("nav ul li a");\nassert(a.length >= 3, "nav butuh minimal tiga tautan dalam <ul><li>, ada: " + a.length);\na.forEach(function (x) {\n  assert(x.getAttribute("href"), "setiap tautan butuh href");\n  assert(x.textContent.trim().length > 0, "setiap tautan butuh teks");\n});',
            },
            {
              name: { en: 'Two articles with headings', id: 'Dua article berjudul' },
              check:
                'var art = all("main article");\nassert(art.length >= 2, "main butuh minimal dua <article>, ada: " + art.length);\nart.forEach(function (x, i) {\n  assert(x.querySelector("h2"), "article ke-" + (i + 1) + " butuh <h2>");\n  assert(x.querySelector("h2").textContent.trim().length > 0, "judul article tidak boleh kosong");\n});',
            },
            {
              name: { en: 'A captioned table', id: 'Tabel dengan caption' },
              check:
                'var t = sel("main table");\nassert(t, "main butuh sebuah <table>");\nassert(t.querySelector("caption"), "tabel butuh <caption>");\nassert(t.querySelector("caption").textContent.trim().length > 0, "caption tidak boleh kosong");\nassert(t.querySelector("thead th"), "tabel butuh <thead> berisi <th>");\nassert(t.querySelectorAll("tbody tr").length >= 1, "tabel butuh minimal satu baris data di tbody");',
            },
            {
              name: { en: 'A form where every field is labelled', id: 'Formulir yang tiap isiannya berlabel' },
              check:
                'var f = sel("main form");\nassert(f, "main butuh sebuah <form>");\nvar kolom = Array.prototype.slice.call(f.querySelectorAll("input, select, textarea"));\nassert(kolom.length >= 2, "formulir butuh minimal dua isian, ada: " + kolom.length);\nkolom.forEach(function (x) {\n  var id = x.getAttribute("id");\n  assert(id, "setiap isian butuh id");\n  assert(doc.querySelector(\'label[for="\' + id + \'"]\'), "belum ada label untuk isian ber-id " + id);\n});\nassert(f.querySelector("button, input[type=submit]"), "formulir butuh tombol kirim");',
            },
            {
              name: { en: 'An image that describes itself', id: 'Gambar yang menjelaskan dirinya' },
              check:
                'var img = sel("img");\nassert(img, "belum ada <img>");\nassert(img.getAttribute("src"), "img butuh src");\nvar alt = img.getAttribute("alt");\nassert(alt !== null, "img wajib punya alt");\nassert(alt.trim().length >= 10, "alt harus deskriptif, minimal 10 karakter");',
            },
            {
              name: { en: 'A footer with a paragraph', id: 'Footer dengan paragraf' },
              check: 'assert(sel("footer p"), "footer butuh sebuah paragraf");\nassert(text("footer p").length > 0, "paragraf footer tidak boleh kosong");',
            },
          ],
        },
        hints: [
          { en: 'Lay the four regions down first, then fill them one at a time.', id: 'Letakkan keempat bagiannya dulu, lalu isi satu per satu.' },
          { en: 'The table and the form both live inside main — they are what this page is about.', id: 'Tabel dan formulirnya sama-sama berada di dalam main — keduanya inti halaman ini.' },
          { en: 'Reuse what you built earlier: the menu from module 2, the table from 3.1, the form from 3.2.', id: 'Pakai ulang yang sudah kamu bangun: menu dari modul 2, tabel dari 3.1, formulir dari 3.2.' },
          { en: 'Check every input has an id and a label whose for matches it — that is where most points are lost.', id: 'Pastikan tiap input punya id dan label yang for-nya cocok — di situlah paling banyak nilai hilang.' },
        ],
        solution: {
          en: '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8">\n    <title>Complete Profile</title>\n  </head>\n  <body>\n    <header>\n      <h1>Nunada</h1>\n    </header>\n\n    <nav>\n      <ul>\n        <li><a href="index.html">Home</a></li>\n        <li><a href="courses.html">Courses</a></li>\n        <li><a href="contact.html">Contact</a></li>\n      </ul>\n    </nav>\n\n    <main>\n      <img src="foto.jpg" alt="Photo of Nunada teaching in front of a class">\n\n      <article>\n        <h2>About Me</h2>\n        <p>Teacher and developer, building Nunada Academy.</p>\n      </article>\n\n      <article>\n        <h2>What I Am Learning</h2>\n        <p>HTML, then CSS, then JavaScript.</p>\n      </article>\n\n      <table>\n        <caption>Courses Taken</caption>\n        <thead>\n          <tr><th>Course</th><th>Status</th></tr>\n        </thead>\n        <tbody>\n          <tr><td>Python</td><td>Done</td></tr>\n          <tr><td>HTML</td><td>In Progress</td></tr>\n        </tbody>\n      </table>\n\n      <form>\n        <label for="name">Name</label>\n        <input type="text" id="name" name="name" required>\n\n        <label for="message">Message</label>\n        <textarea id="message" name="message" rows="3"></textarea>\n\n        <button type="submit">Send</button>\n      </form>\n    </main>\n\n    <footer>\n      <p>&copy; 2026 Nunada Academy</p>\n    </footer>\n  </body>\n</html>',
          id: '<!doctype html>\n<html lang="id">\n  <head>\n    <meta charset="utf-8">\n    <title>Profil Lengkap</title>\n  </head>\n  <body>\n    <header>\n      <h1>Nunada</h1>\n    </header>\n\n    <nav>\n      <ul>\n        <li><a href="index.html">Beranda</a></li>\n        <li><a href="kursus.html">Kursus</a></li>\n        <li><a href="kontak.html">Kontak</a></li>\n      </ul>\n    </nav>\n\n    <main>\n      <img src="foto.jpg" alt="Foto Nunada sedang mengajar di depan kelas">\n\n      <article>\n        <h2>Tentang Saya</h2>\n        <p>Pengajar dan pengembang, sedang membangun Nunada Academy.</p>\n      </article>\n\n      <article>\n        <h2>Yang Sedang Dipelajari</h2>\n        <p>HTML, lalu CSS, lalu JavaScript.</p>\n      </article>\n\n      <table>\n        <caption>Kursus yang Diambil</caption>\n        <thead>\n          <tr><th>Kursus</th><th>Status</th></tr>\n        </thead>\n        <tbody>\n          <tr><td>Python</td><td>Selesai</td></tr>\n          <tr><td>HTML</td><td>Berjalan</td></tr>\n        </tbody>\n      </table>\n\n      <form>\n        <label for="nama">Nama</label>\n        <input type="text" id="nama" name="nama" required>\n\n        <label for="pesan">Pesan</label>\n        <textarea id="pesan" name="pesan" rows="3"></textarea>\n\n        <button type="submit">Kirim</button>\n      </form>\n    </main>\n\n    <footer>\n      <p>&copy; 2026 Nunada Academy</p>\n    </footer>\n  </body>\n</html>',
        },
        xp: 80,
      },
    },
  ],
}
