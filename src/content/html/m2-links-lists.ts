import type { Module } from '../types'

/** Module 2 — the things that make a page more than one screen of text.
 *
 *  The preview has no network, so image examples use a `data:` URI. That is not
 *  a workaround to apologise for: a broken image is exactly what shows why `alt`
 *  matters, and one lesson leans on that deliberately. */
export const module2: Module = {
  id: 'html-m2',
  title: { en: 'Links, Images, Lists', id: 'Tautan, Gambar, Daftar' },
  summary: {
    en: 'Connect pages together, show pictures, and organise items.',
    id: 'Menghubungkan halaman, menampilkan gambar, dan menata daftar.',
  },
  submodules: [
    /* -------------------------------------------------- 2.1 links & images */
    {
      id: 'html-m2-s1',
      title: { en: 'Links and Images', id: 'Tautan dan Gambar' },
      summary: {
        en: 'The two elements that carry an address, and the attributes they need.',
        id: 'Dua elemen yang membawa alamat, dan atribut yang mereka butuhkan.',
      },
      lessons: [
        {
          id: 'html-m2-s1-l1',
          title: { en: 'Attributes and links', id: 'Atribut dan tautan' },
          goal: { en: 'Link to another page.', id: 'Menautkan ke halaman lain.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'An attribute is extra information', id: 'Atribut adalah keterangan tambahan' },
              body: {
                en: 'Attributes live in the opening tag as `nama="nilai"`. They configure the element rather than being its content. A link without its `href` attribute is just text.',
                id: 'Atribut ditulis di tag pembuka sebagai `nama="nilai"`. Mereka mengatur elemennya, bukan menjadi isinya. Tautan tanpa atribut `href` hanyalah teks biasa.',
              },
              code: '<a href="https://example.com">Kunjungi contoh</a>',
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Where the address points', id: 'Ke mana alamatnya menunjuk' },
              body: {
                en: 'A full address like `https://example.com` goes anywhere on the web. A relative one like `tentang.html` means "a file beside this one", and `#bagian` jumps to an element with that `id` on the same page.',
                id: 'Alamat lengkap seperti `https://example.com` menuju ke mana pun di web. Alamat relatif seperti `tentang.html` berarti "berkas di sebelah berkas ini", dan `#bagian` melompat ke elemen ber-`id` itu di halaman yang sama.',
              },
              code: '<a href="tentang.html">Tentang kami</a>\n<a href="#kontak">Lompat ke kontak</a>\n<h2 id="kontak">Kontak</h2>',
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'The text of a link is a promise', id: 'Teks tautan adalah sebuah janji' },
              body: {
                en: '"Klik di sini" tells nobody anything — and a screen-reader user listing the links on a page hears "klik di sini" ten times. Put the destination in the text itself.',
                id: '"Klik di sini" tidak memberi tahu siapa pun apa-apa — dan pengguna pembaca layar yang mendaftar tautan di sebuah halaman akan mendengar "klik di sini" sepuluh kali. Taruh tujuannya di dalam teksnya.',
              },
              code: '<!-- lemah -->\n<a href="harga.html">Klik di sini</a>\n\n<!-- jelas -->\n<a href="harga.html">Daftar harga</a>',
              preview: true,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'Which attribute holds a link\'s destination?', id: 'Atribut mana yang memuat tujuan sebuah tautan?' },
              options: [
                { en: 'href', id: 'href' },
                { en: 'src', id: 'src' },
                { en: 'link', id: 'link' },
                { en: 'target', id: 'target' },
              ],
              answer: 0,
              explain: {
                en: 'href is for links; src is for things the browser loads into the page, like an image.',
                id: 'href untuk tautan; src untuk hal yang dimuat peramban ke dalam halaman, seperti gambar.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: { en: 'Link the text `Beranda` to `index.html`.', id: 'Tautkan teks `Beranda` ke `index.html`.' },
              template: '<a ___="index.html">Beranda___a>',
              blanks: ['href', '</'],
              explain: {
                en: 'href carries the address, and the element closes with </a>.',
                id: 'href membawa alamatnya, dan elemennya ditutup dengan </a>.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              prompt: {
                en: 'Write a paragraph containing a link to `https://python.org` whose text is `Situs resmi Python`.',
                id: 'Tulis sebuah paragraf yang memuat tautan ke `https://python.org` dengan teks `Situs resmi Python`.',
              },
              starter: '<p></p>\n',
              tests: [
                {
                  name: { en: 'The link is inside a paragraph', id: 'Tautannya ada di dalam paragraf' },
                  check: 'assert(sel("p a"), "tautan harus berada di dalam sebuah <p>");',
                },
                {
                  name: { en: 'It points at the right address', id: 'Ia menunjuk alamat yang benar' },
                  check: 'assert(attr("p a", "href") === "https://python.org", "href harus https://python.org, sekarang: " + attr("p a", "href"));',
                },
                {
                  name: { en: 'The text describes the destination', id: 'Teksnya menjelaskan tujuannya' },
                  check: 'assert(text("p a") === "Situs resmi Python", "teks tautan harus: Situs resmi Python");',
                },
              ],
              hints: [
                { en: 'The a element goes between <p> and </p>.', id: 'Elemen a diletakkan di antara <p> dan </p>.' },
                { en: '<a href="https://python.org">Situs resmi Python</a>', id: '<a href="https://python.org">Situs resmi Python</a>' },
              ],
              solution: '<p><a href="https://python.org">Situs resmi Python</a></p>',
            },
          ],
        },
        {
          id: 'html-m2-s1-l2',
          title: { en: 'Images and alt text', id: 'Gambar dan teks alternatif' },
          goal: { en: 'Show a picture that still works without pictures.', id: 'Menampilkan gambar yang tetap berfungsi tanpa gambar.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'src loads, alt describes', id: 'src memuat, alt menjelaskan' },
              body: {
                en: '`<img>` has no closing tag and needs two attributes: `src` is where the file is, `alt` is what the picture shows. `alt` is not optional — it is what a blind reader hears, and what everyone sees when the file fails to load.',
                id: '`<img>` tidak punya tag penutup dan butuh dua atribut: `src` adalah letak berkasnya, `alt` adalah apa yang digambarkannya. `alt` bukan pilihan — itulah yang didengar pembaca tunanetra, dan yang dilihat semua orang saat berkasnya gagal dimuat.',
              },
              code: '<img src="foto-tidak-ada.png" alt="Seekor kucing oranye sedang tidur">',
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Describe the purpose, not the file', id: 'Jelaskan maksudnya, bukan berkasnya' },
              body: {
                en: 'Good alt text says what the picture *tells* you. "Grafik penjualan naik dari 20 ke 80 sepanjang 2026" is useful; "gambar1.png" is not. A purely decorative image takes `alt=""`, which tells screen readers to skip it.',
                id: 'Teks alt yang baik menyatakan apa yang *disampaikan* gambarnya. "Grafik penjualan naik dari 20 ke 80 sepanjang 2026" itu berguna; "gambar1.png" tidak. Gambar yang murni hiasan memakai `alt=""`, yang memberi tahu pembaca layar untuk melewatinya.',
              },
              code: '<img src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'60\'%3E%3Crect width=\'120\' height=\'60\' fill=\'%233b82f6\'/%3E%3C/svg%3E" alt="Persegi panjang biru">',
              preview: true,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'An image is purely decorative. What should `alt` be?',
                id: 'Sebuah gambar murni hiasan. `alt`-nya sebaiknya apa?',
              },
              options: [
                { en: 'alt="" — empty, so it is skipped', id: 'alt="" — kosong, agar dilewati' },
                { en: 'Leave the attribute out', id: 'Hilangkan atributnya' },
                { en: 'alt="hiasan"', id: 'alt="hiasan"' },
                { en: 'alt="gambar"', id: 'alt="gambar"' },
              ],
              answer: 0,
              explain: {
                en: 'An empty alt means "nothing to announce". A missing alt makes the reader announce the filename instead.',
                id: 'alt kosong berarti "tidak ada yang perlu disebut". alt yang hilang membuat pembaca layar menyebutkan nama berkasnya.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              prompt: {
                en: 'Add an image with `src` of `logo.png` and alt text `Logo Nunada Academy`, wrapped in a link to `index.html`.',
                id: 'Tambahkan gambar dengan `src` bernilai `logo.png` dan teks alt `Logo Nunada Academy`, dibungkus tautan menuju `index.html`.',
              },
              starter: '',
              tests: [
                {
                  name: { en: 'The image has both attributes', id: 'Gambarnya punya kedua atribut' },
                  check:
                    'assert(sel("img"), "belum ada <img>");\nassert(attr("img", "src") === "logo.png", "src harus logo.png");\nassert(attr("img", "alt") === "Logo Nunada Academy", "alt harus: Logo Nunada Academy");',
                },
                {
                  name: { en: 'The image is inside a link', id: 'Gambarnya ada di dalam tautan' },
                  check:
                    'assert(sel("a img"), "gambar harus berada di dalam <a>");\nassert(attr("a", "href") === "index.html", "href harus index.html");',
                },
              ],
              hints: [
                { en: 'The a element wraps the img element.', id: 'Elemen a membungkus elemen img.' },
                { en: 'img has no closing tag.', id: 'img tidak punya tag penutup.' },
                { en: '<a href="index.html"><img src="logo.png" alt="Logo Nunada Academy"></a>', id: '<a href="index.html"><img src="logo.png" alt="Logo Nunada Academy"></a>' },
              ],
              solution: '<a href="index.html"><img src="logo.png" alt="Logo Nunada Academy"></a>',
            },
          ],
        },
      ],
      project: {
        id: 'html-m2-s1-p',
        runtime: 'web',
        title: { en: 'Profile card', id: 'Kartu profil' },
        brief: {
          en: 'A small profile with a picture and links that describe themselves.',
          id: 'Profil ringkas dengan gambar dan tautan yang menjelaskan dirinya sendiri.',
        },
        requirements: [
          { en: 'Full document with the title `Kartu Profil`.', id: 'Dokumen lengkap dengan judul `Kartu Profil`.' },
          { en: 'An `h1` with a name.', id: 'Sebuah `h1` berisi nama.' },
          { en: 'An image with `src` `foto.jpg` and a descriptive `alt` of at least 10 characters.', id: 'Gambar dengan `src` `foto.jpg` dan `alt` deskriptif minimal 10 karakter.' },
          { en: 'A paragraph describing the person.', id: 'Sebuah paragraf yang menggambarkan orangnya.' },
          { en: 'Exactly two links: one to `https://github.com` and one to `mailto:halo@nunada.test`.', id: 'Tepat dua tautan: satu ke `https://github.com` dan satu ke `mailto:halo@nunada.test`.' },
          { en: 'Neither link may say `klik di sini`.', id: 'Kedua tautan tidak boleh bertuliskan `klik di sini`.' },
        ],
        starter:
          '<!doctype html>\n<html lang="id">\n  <head>\n    <meta charset="utf-8">\n    <title>Kartu Profil</title>\n  </head>\n  <body>\n\n  </body>\n</html>\n',
        tests: [
          {
            name: { en: 'Heading and description', id: 'Judul dan keterangan' },
            check:
              'assert(all("h1").length === 1, "harus tepat satu h1");\nassert(text("h1").length > 0, "h1 tidak boleh kosong");\nassert(all("p").length >= 1, "butuh minimal satu paragraf");',
          },
          {
            name: { en: 'The image describes itself', id: 'Gambarnya menjelaskan dirinya' },
            check:
              'assert(sel("img"), "belum ada <img>");\nassert(attr("img", "src") === "foto.jpg", "src harus foto.jpg");\nvar a = attr("img", "alt");\nassert(a !== null, "img wajib punya alt");\nassert(a.trim().length >= 10, "alt harus deskriptif, minimal 10 karakter");',
          },
          {
            name: { en: 'Two links, to the right places', id: 'Dua tautan, ke tempat yang benar' },
            check:
              'var a = all("a");\nassert(a.length === 2, "harus tepat dua tautan, ada: " + a.length);\nvar h = a.map(function (x) { return x.getAttribute("href"); });\nassert(h.indexOf("https://github.com") !== -1, "butuh tautan ke https://github.com");\nassert(h.indexOf("mailto:halo@nunada.test") !== -1, "butuh tautan mailto:halo@nunada.test");',
          },
          {
            name: { en: 'The link text is meaningful', id: 'Teks tautannya bermakna' },
            check:
              'all("a").forEach(function (x) {\n  var t = x.textContent.trim();\n  assert(t.length > 0, "teks tautan tidak boleh kosong");\n  assert(t.toLowerCase().indexOf("klik di sini") === -1, "hindari teks tautan: klik di sini");\n});',
          },
        ],
        hints: [
          { en: 'Order does not matter as long as everything sits inside the body.', id: 'Urutannya bebas asalkan semuanya berada di dalam body.' },
          { en: 'A mail link is just an href starting with mailto:', id: 'Tautan surel hanyalah href yang diawali mailto:' },
          { en: 'Name the destination in the link text: `Profil GitHub`, `Kirim email`.', id: 'Sebut tujuannya di teks tautan: `Profil GitHub`, `Kirim email`.' },
        ],
        solution:
          '<!doctype html>\n<html lang="id">\n  <head>\n    <meta charset="utf-8">\n    <title>Kartu Profil</title>\n  </head>\n  <body>\n    <h1>Nunada</h1>\n    <img src="foto.jpg" alt="Foto Nunada sedang mengajar di depan kelas">\n    <p>Pengajar dan pengembang, sedang membangun Nunada Academy.</p>\n    <p>\n      <a href="https://github.com">Profil GitHub</a>\n      <a href="mailto:halo@nunada.test">Kirim email</a>\n    </p>\n  </body>\n</html>',
        xp: 50,
      },
    },

    /* -------------------------------------------------------------- 2.2 lists */
    {
      id: 'html-m2-s2',
      title: { en: 'Lists', id: 'Daftar' },
      summary: {
        en: 'Group items, and build a navigation menu out of them.',
        id: 'Mengelompokkan item, dan membangun menu navigasi darinya.',
      },
      lessons: [
        {
          id: 'html-m2-s2-l1',
          title: { en: 'Ordered and unordered', id: 'Berurut dan tak berurut' },
          goal: { en: 'Choose the right kind of list.', id: 'Memilih jenis daftar yang tepat.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'ul when order does not matter', id: 'ul bila urutannya tidak penting' },
              body: {
                en: '`<ul>` is an unordered list — a shopping list, a set of features. Every item is an `<li>`, and nothing but `<li>` may be a direct child of the list.',
                id: '`<ul>` adalah daftar tak berurut — daftar belanja, kumpulan fitur. Tiap item adalah `<li>`, dan tidak boleh ada anak langsung selain `<li>`.',
              },
              code: '<ul>\n  <li>Pensil</li>\n  <li>Buku</li>\n  <li>Tas</li>\n</ul>',
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'ol when it does', id: 'ol bila urutannya penting' },
              body: {
                en: '`<ol>` is ordered — steps in a recipe, a ranking. The browser numbers them, so renumbering after an edit is not your problem.',
                id: '`<ol>` itu berurut — langkah resep, peringkat. Peramban yang menomorinya, jadi penomoran ulang setelah penyuntingan bukan urusanmu.',
              },
              code: '<ol>\n  <li>Panaskan minyak</li>\n  <li>Masukkan bawang</li>\n  <li>Tambahkan telur</li>\n</ol>',
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Lists inside lists', id: 'Daftar di dalam daftar' },
              body: {
                en: 'A nested list goes **inside** an `<li>`, not between two of them. Getting this wrong is the most common list mistake there is.',
                id: 'Daftar bersarang diletakkan **di dalam** sebuah `<li>`, bukan di antara dua `<li>`. Keliru di sini adalah kesalahan daftar paling umum.',
              },
              code: '<ul>\n  <li>Buah\n    <ul>\n      <li>Apel</li>\n      <li>Mangga</li>\n    </ul>\n  </li>\n  <li>Sayur</li>\n</ul>',
              preview: true,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which list suits the steps of an installation guide?',
                id: 'Daftar mana yang cocok untuk langkah-langkah panduan pemasangan?',
              },
              options: [
                { en: '<ol>, because the order matters', id: '<ol>, karena urutannya penting' },
                { en: '<ul>, because it looks cleaner', id: '<ul>, karena tampak lebih rapi' },
                { en: 'Either, they are the same', id: 'Keduanya, sama saja' },
                { en: 'Neither — use paragraphs', id: 'Tidak keduanya — pakai paragraf' },
              ],
              answer: 0,
              explain: {
                en: 'Doing step 3 before step 1 breaks the guide, so the list is ordered.',
                id: 'Mengerjakan langkah 3 sebelum langkah 1 merusak panduannya, jadi daftarnya berurut.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: { en: 'Assemble a correctly nested list.', id: 'Susun daftar bersarang yang benar.' },
              lines: ['<ul>', '  <li>Buah', '    <ul>', '      <li>Apel</li>', '    </ul>', '  </li>', '</ul>'],
              explain: {
                en: 'The inner list opens after the outer item\'s text and closes before that item does.',
                id: 'Daftar dalamnya dibuka setelah teks item luarnya dan ditutup sebelum item itu ditutup.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              prompt: {
                en: 'Write an ordered list of three steps: `Buka editor`, `Tulis kode`, `Simpan berkas`.',
                id: 'Tulis daftar berurut berisi tiga langkah: `Buka editor`, `Tulis kode`, `Simpan berkas`.',
              },
              starter: '',
              tests: [
                {
                  name: { en: 'It is an ordered list', id: 'Daftarnya berjenis berurut' },
                  check: 'assert(sel("ol"), "harus memakai <ol>, bukan <ul>");',
                },
                {
                  name: { en: 'Three items in order', id: 'Tiga item sesuai urutan' },
                  check:
                    'var li = all("ol > li");\nassert(li.length === 3, "harus tepat tiga <li>, ada: " + li.length);\nvar mau = ["Buka editor", "Tulis kode", "Simpan berkas"];\nfor (var i = 0; i < 3; i++) assert(li[i].textContent.trim() === mau[i], "item ke-" + (i + 1) + " harus: " + mau[i]);',
                },
              ],
              hints: [
                { en: 'The steps must happen in order, so the list is ol.', id: 'Langkahnya harus berurutan, jadi daftarnya ol.' },
                { en: 'Each step is its own <li>…</li>.', id: 'Tiap langkah adalah <li>…</li> tersendiri.' },
              ],
              solution: '<ol>\n  <li>Buka editor</li>\n  <li>Tulis kode</li>\n  <li>Simpan berkas</li>\n</ol>',
            },
          ],
        },
        {
          id: 'html-m2-s2-l2',
          title: { en: 'A menu is a list of links', id: 'Menu adalah daftar tautan' },
          goal: { en: 'Build navigation the accessible way.', id: 'Membangun navigasi dengan cara yang mudah diakses.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'nav marks the main navigation', id: 'nav menandai navigasi utama' },
              body: {
                en: 'A menu is a list of links, and wrapping it in `<nav>` tells assistive technology "this is how you move around this site". A screen reader can then jump straight past it — or straight to it.',
                id: 'Menu adalah daftar tautan, dan membungkusnya dengan `<nav>` memberi tahu teknologi bantu "beginilah cara berpindah di situs ini". Pembaca layar lalu bisa melompatinya — atau langsung menujunya.',
              },
              code: '<nav>\n  <ul>\n    <li><a href="index.html">Beranda</a></li>\n    <li><a href="kursus.html">Kursus</a></li>\n    <li><a href="kontak.html">Kontak</a></li>\n  </ul>\n</nav>',
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Why a list and not loose links', id: 'Kenapa daftar, bukan tautan berserak' },
              body: {
                en: 'A list announces how many items there are before reading them. Three links separated by spaces announce nothing. The visual result can be made identical with CSS later, so nothing is lost.',
                id: 'Daftar mengumumkan ada berapa item sebelum membacakannya. Tiga tautan yang cuma dipisah spasi tidak mengumumkan apa pun. Hasil visualnya bisa dibuat sama persis dengan CSS nanti, jadi tidak ada yang hilang.',
              },
              code: '<!-- kurang baik -->\n<div><a href="a.html">A</a> <a href="b.html">B</a></div>\n\n<!-- lebih baik -->\n<nav>\n  <ul>\n    <li><a href="a.html">A</a></li>\n    <li><a href="b.html">B</a></li>\n  </ul>\n</nav>',
              preview: true,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What may be a direct child of `<ul>`?', id: 'Apa yang boleh menjadi anak langsung `<ul>`?' },
              options: [
                { en: 'Only <li>', id: 'Hanya <li>' },
                { en: 'Any element', id: 'Elemen apa saja' },
                { en: 'Only <a>', id: 'Hanya <a>' },
                { en: 'Only text', id: 'Hanya teks' },
              ],
              answer: 0,
              explain: {
                en: 'Links and everything else go inside an li, not beside it.',
                id: 'Tautan dan yang lain diletakkan di dalam li, bukan di sebelahnya.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              prompt: {
                en: 'Build a `nav` containing an unordered list of three links: `Beranda` to `index.html`, `Kursus` to `kursus.html`, `Kontak` to `kontak.html`.',
                id: 'Bangun sebuah `nav` berisi daftar tak berurut dengan tiga tautan: `Beranda` ke `index.html`, `Kursus` ke `kursus.html`, `Kontak` ke `kontak.html`.',
              },
              starter: '<nav>\n\n</nav>\n',
              tests: [
                {
                  name: { en: 'A list inside the nav', id: 'Sebuah daftar di dalam nav' },
                  check: 'assert(sel("nav ul"), "butuh <ul> di dalam <nav>");\nassert(all("nav ul > li").length === 3, "harus tiga <li>, ada: " + all("nav ul > li").length);',
                },
                {
                  name: { en: 'Each item holds one link', id: 'Tiap item memuat satu tautan' },
                  check: 'all("nav ul > li").forEach(function (li, i) { assert(li.querySelector("a"), "item ke-" + (i + 1) + " harus memuat <a>"); });',
                },
                {
                  name: { en: 'The links point where they say', id: 'Tautannya menunjuk sesuai namanya' },
                  check:
                    'var mau = [["Beranda", "index.html"], ["Kursus", "kursus.html"], ["Kontak", "kontak.html"]];\nvar a = all("nav ul > li a");\nfor (var i = 0; i < 3; i++) {\n  assert(a[i].textContent.trim() === mau[i][0], "tautan ke-" + (i + 1) + " harus bertuliskan " + mau[i][0]);\n  assert(a[i].getAttribute("href") === mau[i][1], mau[i][0] + " harus menuju " + mau[i][1]);\n}',
                },
              ],
              hints: [
                { en: 'Three layers: nav wraps ul, ul holds li, each li holds an a.', id: 'Tiga lapis: nav membungkus ul, ul memuat li, tiap li memuat a.' },
                { en: '<li><a href="index.html">Beranda</a></li>', id: '<li><a href="index.html">Beranda</a></li>' },
              ],
              solution:
                '<nav>\n  <ul>\n    <li><a href="index.html">Beranda</a></li>\n    <li><a href="kursus.html">Kursus</a></li>\n    <li><a href="kontak.html">Kontak</a></li>\n  </ul>\n</nav>',
            },
          ],
        },
      ],
      project: {
        id: 'html-m2-s2-p',
        runtime: 'web',
        title: { en: 'Site menu', id: 'Menu situs' },
        brief: {
          en: 'A navigation menu with a submenu, plus a numbered list of steps.',
          id: 'Menu navigasi dengan submenu, ditambah daftar langkah bernomor.',
        },
        requirements: [
          { en: 'Full document with the title `Menu`.', id: 'Dokumen lengkap dengan judul `Menu`.' },
          { en: 'A `nav` holding a `ul` with exactly three top-level items.', id: 'Sebuah `nav` berisi `ul` dengan tepat tiga item tingkat atas.' },
          { en: 'The second item contains a nested `ul` with two links.', id: 'Item kedua memuat `ul` bersarang berisi dua tautan.' },
          { en: 'Every link has a non-empty `href` and text.', id: 'Setiap tautan punya `href` dan teks yang tidak kosong.' },
          { en: 'Below the nav, an `ol` with three steps.', id: 'Di bawah nav, sebuah `ol` berisi tiga langkah.' },
        ],
        starter:
          '<!doctype html>\n<html lang="id">\n  <head>\n    <meta charset="utf-8">\n    <title>Menu</title>\n  </head>\n  <body>\n\n  </body>\n</html>\n',
        tests: [
          {
            name: { en: 'Three top-level items in the nav', id: 'Tiga item tingkat atas di nav' },
            check:
              'var ul = sel("nav > ul");\nassert(ul, "butuh <ul> tepat di dalam <nav>");\nvar atas = all("nav > ul > li");\nassert(atas.length === 3, "harus tepat tiga item tingkat atas, ada: " + atas.length);',
          },
          {
            name: { en: 'The submenu is nested correctly', id: 'Submenunya bersarang dengan benar' },
            check:
              'var kedua = all("nav > ul > li")[1];\nvar dalam = kedua.querySelector("ul");\nassert(dalam, "item kedua harus memuat <ul> bersarang");\nassert(dalam.querySelectorAll(":scope > li").length === 2, "submenu harus punya dua item");\nassert(dalam.querySelectorAll("a").length === 2, "submenu harus punya dua tautan");',
          },
          {
            name: { en: 'Every link works', id: 'Semua tautan layak' },
            check:
              'var a = all("nav a");\nassert(a.length >= 5, "minimal lima tautan di nav, ada: " + a.length);\na.forEach(function (x) {\n  var h = x.getAttribute("href");\n  assert(h && h.trim().length > 0, "setiap tautan butuh href");\n  assert(x.textContent.trim().length > 0, "setiap tautan butuh teks");\n});',
          },
          {
            name: { en: 'A numbered list of three steps', id: 'Daftar bernomor berisi tiga langkah' },
            check:
              'var ol = sel("ol");\nassert(ol, "belum ada <ol>");\nassert(ol.querySelectorAll(":scope > li").length === 3, "ol harus punya tiga langkah");\nvar nav = sel("nav");\nassert(nav.compareDocumentPosition(ol) & Node.DOCUMENT_POSITION_FOLLOWING, "ol harus berada setelah nav");',
          },
        ],
        hints: [
          { en: 'Build the three top-level items first, then nest the submenu inside the second one.', id: 'Bangun tiga item tingkat atas dulu, lalu sarangkan submenunya di dalam item kedua.' },
          { en: 'The nested ul goes before the second `</li>`, not after it.', id: 'ul bersarangnya diletakkan sebelum `</li>` kedua, bukan setelahnya.' },
          { en: 'The ol is a sibling of the nav, placed after it in the body.', id: 'ol adalah saudara dari nav, diletakkan setelahnya di dalam body.' },
        ],
        solution:
          '<!doctype html>\n<html lang="id">\n  <head>\n    <meta charset="utf-8">\n    <title>Menu</title>\n  </head>\n  <body>\n    <nav>\n      <ul>\n        <li><a href="index.html">Beranda</a></li>\n        <li><a href="kursus.html">Kursus</a>\n          <ul>\n            <li><a href="python.html">Python</a></li>\n            <li><a href="html.html">HTML</a></li>\n          </ul>\n        </li>\n        <li><a href="kontak.html">Kontak</a></li>\n      </ul>\n    </nav>\n\n    <ol>\n      <li>Pilih kursus</li>\n      <li>Kerjakan pelajaran</li>\n      <li>Selesaikan mini proyek</li>\n    </ol>\n  </body>\n</html>',
        xp: 50,
      },
    },
  ],
}
