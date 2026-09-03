import type { Module } from '../types'

/** Module 1 — what a rule is, how to aim it, and the two things learners most
 *  want to change first: the words and the colours.
 *
 *  Every `web` step here supplies `html`, so the markup is context and the
 *  learner writes only CSS. Tests read computed values, which means they check
 *  the *effect* rather than the exact text typed — `red`, `#f00` and
 *  `rgb(255,0,0)` all pass, as they should. */
export const module1: Module = {
  id: 'css-m1',
  title: { en: 'Rules and Selectors', id: 'Aturan dan Selektor' },
  summary: {
    en: 'Write a rule, aim it at the right elements, and restyle text and colour.',
    id: 'Menulis aturan, mengarahkannya ke elemen yang tepat, dan mengubah teks serta warna.',
  },
  submodules: [
    /* ------------------------------------------------------- 1.1 rules & aim */
    {
      id: 'css-m1-s1',
      title: { en: 'Your First Rule', id: 'Aturan Pertamamu' },
      summary: {
        en: 'The shape of a CSS rule, and the selectors that decide who it hits.',
        id: 'Bentuk sebuah aturan CSS, dan selektor yang menentukan siapa yang terkena.',
      },
      lessons: [
        {
          id: 'css-m1-s1-l1',
          title: { en: 'Selector, property, value', id: 'Selektor, properti, nilai' },
          goal: { en: 'Change how an element looks.', id: 'Mengubah tampilan sebuah elemen.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'HTML says what, CSS says how', id: 'HTML menyatakan apa, CSS menyatakan bagaimana' },
              body: {
                en: 'The markup already says "this is a heading". CSS says what a heading should look like. Keeping them apart is why one stylesheet can restyle a thousand pages.',
                id: 'Markup-nya sudah menyatakan "ini sebuah judul". CSS menyatakan seperti apa judul itu seharusnya tampak. Memisahkan keduanya itulah sebabnya satu stylesheet bisa mengubah tampilan seribu halaman.',
              },
              code: {
                en: '<style>\n  h1 {\n    color: teal;\n  }\n</style>\n\n<h1>Coloured heading</h1>\n<p>This paragraph is untouched.</p>',
                id: '<style>\n  h1 {\n    color: teal;\n  }\n</style>\n\n<h1>Judul yang diwarnai</h1>\n<p>Paragraf ini tidak tersentuh.</p>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The anatomy of a rule', id: 'Anatomi sebuah aturan' },
              body: {
                en: 'A rule is a **selector**, then a block in braces. Inside, each line is a **property**, a colon, a **value**, and a semicolon. Forget the semicolon and the next declaration is swallowed with it.',
                id: 'Sebuah aturan terdiri dari **selektor**, lalu blok dalam kurung kurawal. Di dalamnya, tiap baris berisi **properti**, titik dua, **nilai**, dan titik koma. Lupakan titik komanya dan deklarasi berikutnya ikut tertelan.',
              },
              code: {
                en: '<style>\n  p {\n    color: white;\n    background-color: navy;\n  }\n</style>\n\n<p>Two declarations apply here.</p>',
                id: '<style>\n  p {\n    color: white;\n    background-color: navy;\n  }\n</style>\n\n<p>Dua deklarasi berlaku di sini.</p>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Where the CSS lives', id: 'Di mana CSS itu tinggal' },
              body: {
                en: 'For these exercises the CSS goes in a `<style>` block. A real site puts it in its own `.css` file, linked from the head with `<link rel="stylesheet" href="style.css">` — same rules, one file serving every page.',
                id: 'Untuk latihan ini, CSS-nya ditaruh di blok `<style>`. Situs sungguhan menaruhnya di berkas `.css` tersendiri, ditautkan dari head dengan `<link rel="stylesheet" href="gaya.css">` — aturannya sama, satu berkas melayani semua halaman.',
              },
              code: {
                en: '<head>\n  <link rel="stylesheet" href="style.css">\n</head>',
                id: '<head>\n  <link rel="stylesheet" href="gaya.css">\n</head>',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'Which part is the property?', id: 'Bagian mana yang merupakan properti?' },
              code: 'h1 { color: teal; }',
              options: [
                { en: 'color', id: 'color' },
                { en: 'h1', id: 'h1' },
                { en: 'teal', id: 'teal' },
                { en: 'The braces', id: 'Kurung kurawalnya' },
              ],
              answer: 0,
              explain: {
                en: 'h1 is the selector, color the property, teal the value.',
                id: 'h1 adalah selektornya, color propertinya, teal nilainya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: { en: 'Give every paragraph a grey background.', id: 'Beri setiap paragraf latar abu-abu.' },
              template: 'p {\n  background-color___ gray___\n}',
              blanks: [':', ';'],
              explain: {
                en: 'A colon separates property from value; a semicolon ends the declaration.',
                id: 'Titik dua memisahkan properti dari nilai; titik koma mengakhiri deklarasinya.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              html: {
                en: '<h1>Nunada Academy</h1>\n<p>Learn to code step by step.</p>',
                id: '<h1>Nunada Academy</h1>\n<p>Belajar coding langkah demi langkah.</p>',
              },
              prompt: {
                en: 'Make the `h1` white on a navy background, and the paragraph text grey (`gray`).',
                id: 'Buat `h1` berwarna putih dengan latar navy, dan teks paragrafnya abu-abu (`gray`).',
              },
              starter: 'h1 {\n\n}\n',
              tests: {
                en: [
                  {
                    name: { en: 'The heading is white on navy', id: 'The heading is white on navy' },
                    check:
                      'assert(style("h1", "color") === "rgb(255, 255, 255)", "h1 color must be white, currently: " + style("h1", "color"));\nassert(style("h1", "background-color") === "rgb(0, 0, 128)", "h1 background must be navy, currently: " + style("h1", "background-color"));',
                  },
                  {
                    name: { en: 'The paragraph is grey', id: 'The paragraph is grey' },
                    check: 'assert(style("p", "color") === "rgb(128, 128, 128)", "p color must be gray, currently: " + style("p", "color"));',
                  },
                  {
                    name: { en: 'The paragraph keeps its own background', id: 'The paragraph keeps its own background' },
                    check:
                      'var bg = style("p", "background-color");\nassert(bg === "rgba(0, 0, 0, 0)" || bg === "transparent", "only h1 needs a coloured background");',
                  },
                ],
                id: [
                  {
                    name: { en: 'The heading is white on navy', id: 'Judulnya putih di atas navy' },
                    check:
                      'assert(style("h1", "color") === "rgb(255, 255, 255)", "warna h1 harus putih, sekarang: " + style("h1", "color"));\nassert(style("h1", "background-color") === "rgb(0, 0, 128)", "latar h1 harus navy, sekarang: " + style("h1", "background-color"));',
                  },
                  {
                    name: { en: 'The paragraph is grey', id: 'Paragrafnya abu-abu' },
                    check: 'assert(style("p", "color") === "rgb(128, 128, 128)", "warna p harus gray, sekarang: " + style("p", "color"));',
                  },
                  {
                    name: { en: 'The paragraph keeps its own background', id: 'Paragrafnya tidak ikut berlatar navy' },
                    check:
                      'var bg = style("p", "background-color");\nassert(bg === "rgba(0, 0, 0, 0)" || bg === "transparent", "hanya h1 yang perlu latar berwarna");',
                  },
                ],
              },
              hints: [
                { en: 'Two rules: one aimed at h1, one at p.', id: 'Dua aturan: satu diarahkan ke h1, satu ke p.' },
                { en: 'The heading needs two declarations, the paragraph one.', id: 'Judulnya butuh dua deklarasi, paragrafnya satu.' },
                { en: 'color: white; background-color: navy;', id: 'color: white; background-color: navy;' },
              ],
              solution: 'h1 {\n  color: white;\n  background-color: navy;\n}\n\np {\n  color: gray;\n}',
            },
          ],
        },
        {
          id: 'css-m1-s1-l2',
          title: { en: 'Aiming at the right elements', id: 'Membidik elemen yang tepat' },
          goal: { en: 'Select by class, id, and position.', id: 'Memilih berdasarkan class, id, dan posisi.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Class for many, id for one', id: 'Class untuk banyak, id untuk satu' },
              body: {
                en: 'A bare `p` hits every paragraph. `.important` hits every element carrying `class="important"`, and `#title` hits the single element with `id="title"`. Class is the workhorse; reach for id rarely.',
                id: 'Selektor `p` polos mengenai semua paragraf. `.penting` mengenai tiap elemen ber-`class="penting"`, dan `#judul` mengenai satu-satunya elemen ber-`id="judul"`. Class adalah kuda beban; id jarang-jarang saja.',
              },
              code: {
                en: '<style>\n  .important { color: crimson; }\n  #title { color: teal; }\n</style>\n\n<h1 id="title">Title</h1>\n<p class="important">Important.</p>\n<p>Ordinary.</p>\n<p class="important">Important too.</p>',
                id: '<style>\n  .penting { color: crimson; }\n  #judul { color: teal; }\n</style>\n\n<h1 id="judul">Judul</h1>\n<p class="penting">Penting.</p>\n<p>Biasa.</p>\n<p class="penting">Penting juga.</p>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A space means "inside"', id: 'Spasi berarti "di dalam"' },
              body: {
                en: '`nav a` means "every link inside a nav" — the space is a descendant combinator, not decoration. Writing `nav, a` with a comma means something completely different: navs **and** links.',
                id: '`nav a` berarti "setiap tautan di dalam nav" — spasinya adalah kombinator keturunan, bukan hiasan. Menulis `nav, a` dengan koma berarti sesuatu yang sama sekali lain: nav **dan** tautan.',
              },
              code: {
                en: '<style>\n  nav a { color: orange; }\n</style>\n\n<nav><a href="#">Inside nav</a></nav>\n<a href="#">Outside nav</a>',
                id: '<style>\n  nav a { color: orange; }\n</style>\n\n<nav><a href="#">Di dalam nav</a></nav>\n<a href="#">Di luar nav</a>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'When two rules disagree', id: 'Ketika dua aturan berselisih' },
              body: {
                en: 'The more specific selector wins: id beats class, class beats element. Only when specificity ties does the later rule win. Fighting this with `!important` is a habit worth never starting.',
                id: 'Selektor yang lebih spesifik menang: id mengalahkan class, class mengalahkan elemen. Hanya ketika kespesifikannya seri, aturan yang belakangan menang. Melawan ini dengan `!important` adalah kebiasaan yang sebaiknya tak pernah dimulai.',
              },
              code: {
                en: '<style>\n  p { color: gray; }\n  .blue { color: blue; }\n  #one { color: red; }\n</style>\n\n<p id="one" class="blue">Red — id wins.</p>\n<p class="blue">Blue — class beats p.</p>',
                id: '<style>\n  p { color: gray; }\n  .biru { color: blue; }\n  #satu { color: red; }\n</style>\n\n<p id="satu" class="biru">Merah — id menang.</p>\n<p class="biru">Biru — class mengalahkan p.</p>',
              },
              preview: true,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which selector hits only links that sit inside a footer?',
                id: 'Selektor mana yang hanya mengenai tautan di dalam footer?',
              },
              options: [
                { en: 'footer a', id: 'footer a' },
                { en: 'footer, a', id: 'footer, a' },
                { en: 'footer.a', id: 'footer.a' },
                { en: 'a footer', id: 'a footer' },
              ],
              answer: 0,
              explain: {
                en: 'A space is "descendant of". The comma version means both, and reversing it looks for a footer inside a link.',
                id: 'Spasi berarti "keturunan dari". Versi komanya berarti keduanya, dan membaliknya berarti mencari footer di dalam tautan.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              html: {
                en: '<h1 id="main">Title</h1>\n<p class="note">First note.</p>\n<p>Ordinary paragraph.</p>\n<div class="box"><p class="note">Note inside the box.</p></div>',
                id: '<h1 id="utama">Judul</h1>\n<p class="catatan">Catatan pertama.</p>\n<p>Paragraf biasa.</p>\n<div class="kotak"><p class="catatan">Catatan di dalam kotak.</p></div>',
              },
              prompt: {
                en: 'Colour `#main` teal, every `.note` crimson, and give paragraphs inside `.box` a `lightyellow` background.',
                id: 'Warnai `#utama` teal, tiap `.catatan` crimson, dan beri paragraf di dalam `.kotak` latar `lightyellow`.',
              },
              starter: '',
              tests: {
                en: [
                  {
                    name: { en: 'The id is teal', id: 'The id is teal' },
                    check: 'assert(style("#main", "color") === "rgb(0, 128, 128)", "#main must be teal, currently: " + style("#main", "color"));',
                  },
                  {
                    name: { en: 'Both notes are crimson', id: 'Both notes are crimson' },
                    check:
                      'var n = all(".note");\nassert(n.length === 2, "there should be two .note");\nn.forEach(function (e, i) {\n  var c = getComputedStyle(e).color;\n  assert(c === "rgb(220, 20, 60)", "note " + (i + 1) + " must be crimson, currently: " + c);\n});',
                  },
                  {
                    name: { en: 'Only the one inside .box is highlighted', id: 'Only the one inside .box is highlighted' },
                    check:
                      'assert(style(".box p", "background-color") === "rgb(255, 255, 224)", "the paragraph inside .box must have a lightyellow background");\nvar outside = getComputedStyle(all("p")[0]).backgroundColor;\nassert(outside === "rgba(0, 0, 0, 0)" || outside === "transparent", "the paragraph outside .box must not be highlighted too");',
                  },
                ],
                id: [
                  {
                    name: { en: 'The id is teal', id: 'Elemen ber-id itu teal' },
                    check: 'assert(style("#utama", "color") === "rgb(0, 128, 128)", "#utama harus teal, sekarang: " + style("#utama", "color"));',
                  },
                  {
                    name: { en: 'Both notes are crimson', id: 'Kedua catatan berwarna crimson' },
                    check:
                      'var n = all(".catatan");\nassert(n.length === 2, "seharusnya ada dua .catatan");\nn.forEach(function (e, i) {\n  var c = getComputedStyle(e).color;\n  assert(c === "rgb(220, 20, 60)", "catatan ke-" + (i + 1) + " harus crimson, sekarang: " + c);\n});',
                  },
                  {
                    name: { en: 'Only the one inside .kotak is highlighted', id: 'Hanya yang di dalam .kotak yang disorot' },
                    check:
                      'assert(style(".kotak p", "background-color") === "rgb(255, 255, 224)", "paragraf di dalam .kotak harus berlatar lightyellow");\nvar luar = getComputedStyle(all("p")[0]).backgroundColor;\nassert(luar === "rgba(0, 0, 0, 0)" || luar === "transparent", "paragraf di luar .kotak tidak boleh ikut disorot");',
                  },
                ],
              },
              hints: [
                { en: 'Three rules, one per requirement.', id: 'Tiga aturan, satu untuk tiap syarat.' },
                { en: 'A class selector starts with a dot, an id selector with a hash.', id: 'Selektor class diawali titik, selektor id diawali pagar.' },
                { en: 'The last one is a descendant selector: `.box p`', id: 'Yang terakhir adalah selektor keturunan: `.kotak p`' },
              ],
              solution: {
                en: '#main {\n  color: teal;\n}\n\n.note {\n  color: crimson;\n}\n\n.box p {\n  background-color: lightyellow;\n}',
                id: '#utama {\n  color: teal;\n}\n\n.catatan {\n  color: crimson;\n}\n\n.kotak p {\n  background-color: lightyellow;\n}',
              },
            },
          ],
        },
      ],
      project: {
        id: 'css-m1-s1-p',
        runtime: 'web',
        html: {
          en: '<div class="card">\n  <h2 class="title">Python</h2>\n  <p class="content">Beginner course, nine modules.</p>\n  <p class="content">1700 XP</p>\n</div>\n<div class="card">\n  <h2 class="title">HTML</h2>\n  <p class="content">Beginner course, four modules.</p>\n  <p class="content">660 XP</p>\n</div>',
          id: '<div class="kartu">\n  <h2 class="judul">Python</h2>\n  <p class="isi">Kursus pemula, sembilan modul.</p>\n  <p class="isi">1700 XP</p>\n</div>\n<div class="kartu">\n  <h2 class="judul">HTML</h2>\n  <p class="isi">Kursus pemula, empat modul.</p>\n  <p class="isi">660 XP</p>\n</div>',
        },
        title: { en: 'Coloured cards', id: 'Kartu berwarna' },
        brief: {
          en: 'Style two cards using classes — the markup is already written.',
          id: 'Beri gaya pada dua kartu memakai class — markup-nya sudah ditulis.',
        },
        requirements: [
          { en: '`.card` gets a `whitesmoke` background.', id: '`.kartu` diberi latar `whitesmoke`.' },
          { en: '`.title` is `darkslateblue` and centred.', id: '`.judul` berwarna `darkslateblue` dan rata tengah.' },
          { en: '`.content` is `dimgray`.', id: '`.isi` berwarna `dimgray`.' },
          { en: 'Both cards must be styled by the same rules — no ids.', id: 'Kedua kartu harus diatur aturan yang sama — tanpa id.' },
        ],
        starter: '.card {\n\n}\n',
        tests: {
          en: [
            {
              name: { en: 'Both cards share a background', id: 'Both cards share a background' },
              check:
                'var k = all(".card");\nassert(k.length === 2, "there should be two .card");\nk.forEach(function (e, i) {\n  assert(getComputedStyle(e).backgroundColor === "rgb(245, 245, 245)", "card " + (i + 1) + " must have a whitesmoke background");\n});',
            },
            {
              name: { en: 'Titles are coloured and centred', id: 'Titles are coloured and centred' },
              check:
                'all(".title").forEach(function (e, i) {\n  var s = getComputedStyle(e);\n  assert(s.color === "rgb(72, 61, 139)", "title " + (i + 1) + " must be darkslateblue, currently: " + s.color);\n  assert(s.textAlign === "center", "title " + (i + 1) + " must be centred");\n});',
            },
            {
              name: { en: 'Body text is dimgray', id: 'Body text is dimgray' },
              check:
                'var content = all(".content");\nassert(content.length === 4, "there should be four .content");\ncontent.forEach(function (e, i) {\n  assert(getComputedStyle(e).color === "rgb(105, 105, 105)", "content " + (i + 1) + " must be dimgray");\n});',
            },
            {
              name: { en: 'No id selectors were used', id: 'No id selectors were used' },
              check: 'assert(css().indexOf("#") === -1, "use classes only, no id selectors");',
            },
          ],
          id: [
            {
              name: { en: 'Both cards share a background', id: 'Kedua kartu berbagi latar' },
              check:
                'var k = all(".kartu");\nassert(k.length === 2, "seharusnya ada dua .kartu");\nk.forEach(function (e, i) {\n  assert(getComputedStyle(e).backgroundColor === "rgb(245, 245, 245)", "kartu ke-" + (i + 1) + " harus berlatar whitesmoke");\n});',
            },
            {
              name: { en: 'Titles are coloured and centred', id: 'Judulnya berwarna dan rata tengah' },
              check:
                'all(".judul").forEach(function (e, i) {\n  var s = getComputedStyle(e);\n  assert(s.color === "rgb(72, 61, 139)", "judul ke-" + (i + 1) + " harus darkslateblue, sekarang: " + s.color);\n  assert(s.textAlign === "center", "judul ke-" + (i + 1) + " harus rata tengah");\n});',
            },
            {
              name: { en: 'Body text is dimgray', id: 'Teks isinya dimgray' },
              check:
                'var isi = all(".isi");\nassert(isi.length === 4, "seharusnya ada empat .isi");\nisi.forEach(function (e, i) {\n  assert(getComputedStyle(e).color === "rgb(105, 105, 105)", "isi ke-" + (i + 1) + " harus dimgray");\n});',
            },
            {
              name: { en: 'No id selectors were used', id: 'Tidak memakai selektor id' },
              check: 'assert(css().indexOf("#") === -1, "gunakan class saja, jangan selektor id");',
            },
          ],
        },
        hints: [
          { en: 'Three rules is all it takes — one per class.', id: 'Cukup tiga aturan — satu untuk tiap class.' },
          { en: 'Centring text is `text-align: center`.', id: 'Merata-tengahkan teks memakai `text-align: center`.' },
          { en: 'Because you select by class, both cards are covered at once.', id: 'Karena kamu memilih lewat class, kedua kartu tercakup sekaligus.' },
        ],
        solution: {
          en: '.card {\n  background-color: whitesmoke;\n}\n\n.title {\n  color: darkslateblue;\n  text-align: center;\n}\n\n.content {\n  color: dimgray;\n}',
          id: '.kartu {\n  background-color: whitesmoke;\n}\n\n.judul {\n  color: darkslateblue;\n  text-align: center;\n}\n\n.isi {\n  color: dimgray;\n}',
        },
        xp: 50,
      },
    },

    /* ------------------------------------------------------- 1.2 text & colour */
    {
      id: 'css-m1-s2',
      title: { en: 'Text and Colour', id: 'Teks dan Warna' },
      summary: {
        en: 'Typography that stays readable, and colour written three ways.',
        id: 'Tipografi yang tetap terbaca, dan warna yang ditulis tiga cara.',
      },
      lessons: [
        {
          id: 'css-m1-s2-l1',
          title: { en: 'Type that reads well', id: 'Tipografi yang enak dibaca' },
          goal: { en: 'Set family, size, weight, and spacing.', id: 'Mengatur jenis, ukuran, ketebalan, dan jarak.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A font stack, not a font', id: 'Tumpukan font, bukan satu font' },
              body: {
                en: '`font-family` takes a list, tried left to right. End with a generic — `sans-serif`, `serif`, `monospace` — so there is always something to fall back on when a font is missing.',
                id: '`font-family` menerima sebuah daftar, dicoba dari kiri ke kanan. Akhiri dengan yang generik — `sans-serif`, `serif`, `monospace` — agar selalu ada cadangan saat sebuah font tidak tersedia.',
              },
              code: {
                en: '<style>\n  body { font-family: Georgia, "Times New Roman", serif; }\n  code { font-family: Consolas, monospace; }\n</style>\n\n<p>Serif-stacked text.</p>\n<p><code>code = 1</code></p>',
                id: '<style>\n  body { font-family: Georgia, "Times New Roman", serif; }\n  code { font-family: Consolas, monospace; }\n</style>\n\n<p>Teks bertumpuk serif.</p>\n<p><code>kode = 1</code></p>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Size, weight, and the space between lines', id: 'Ukuran, ketebalan, dan jarak antarbaris' },
              body: {
                en: '`font-size` in `px` is straightforward to start with. `font-weight: bold` is the same as `700`. `line-height` without a unit — `1.6` — means "1.6 times the font size", which keeps working when the size changes.',
                id: '`font-size` dalam `px` paling mudah untuk memulai. `font-weight: bold` sama dengan `700`. `line-height` tanpa satuan — `1.6` — berarti "1,6 kali ukuran fontnya", yang tetap benar saat ukurannya berubah.',
              },
              code: {
                en: '<style>\n  p {\n    font-size: 18px;\n    line-height: 1.7;\n  }\n  .bold { font-weight: bold; }\n</style>\n\n<p>A first line long enough to wrap onto the next line so the line spacing is visible.</p>\n<p class="bold">Bolded.</p>',
                id: '<style>\n  p {\n    font-size: 18px;\n    line-height: 1.7;\n  }\n  .tebal { font-weight: bold; }\n</style>\n\n<p>Baris pertama yang cukup panjang sehingga membungkus ke baris berikutnya dan jarak antarbarisnya terlihat.</p>\n<p class="tebal">Ditebalkan.</p>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Alignment is not indentation', id: 'Perataan bukan indentasi' },
              body: {
                en: '`text-align` moves text within its box: `left`, `right`, `center`, `justify`. It does not move the box itself — that comes later, in the box model.',
                id: '`text-align` memindahkan teks di dalam kotaknya: `left`, `right`, `center`, `justify`. Ia tidak memindahkan kotaknya sendiri — itu urusan nanti, di box model.',
              },
              code: {
                en: '<style>\n  .center { text-align: center; }\n  .right { text-align: right; }\n</style>\n\n<p class="center">Centered</p>\n<p class="right">Right-aligned</p>',
                id: '<style>\n  .tengah { text-align: center; }\n  .kanan { text-align: right; }\n</style>\n\n<p class="tengah">Rata tengah</p>\n<p class="kanan">Rata kanan</p>',
              },
              preview: true,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why write `line-height: 1.5` instead of `line-height: 24px`?',
                id: 'Kenapa menulis `line-height: 1.5` alih-alih `line-height: 24px`?',
              },
              options: [
                { en: 'It scales with the font size', id: 'Ia ikut menyesuaikan ukuran font' },
                { en: 'It is faster to render', id: 'Ia lebih cepat dirender' },
                { en: 'px does not work for line-height', id: 'px tidak berlaku untuk line-height' },
                { en: 'There is no difference', id: 'Tidak ada bedanya' },
              ],
              answer: 0,
              explain: {
                en: 'A unitless value is a multiplier, so headings and body text each get spacing that suits them.',
                id: 'Nilai tanpa satuan adalah pengali, jadi judul dan teks isi masing-masing mendapat jarak yang sesuai.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              html: {
                en: '<h1>Report</h1>\n<p>An opening paragraph long enough to wrap onto the next line.</p>\n<p class="signature">Signed by Nunada</p>',
                id: '<h1>Laporan</h1>\n<p>Paragraf pembuka yang cukup panjang untuk membungkus ke baris berikutnya.</p>\n<p class="tanda">Ditandatangani oleh Nunada</p>',
              },
              prompt: {
                en: 'Set the whole page to a `sans-serif` stack, make `p` 18px with a line-height of 1.6, and align `.signature` to the right.',
                id: 'Setel seluruh halaman ke tumpukan `sans-serif`, buat `p` berukuran 18px dengan line-height 1.6, dan ratakan `.tanda` ke kanan.',
              },
              starter: 'body {\n\n}\n',
              tests: {
                en: [
                  {
                    name: { en: 'The page uses a sans-serif stack', id: 'The page uses a sans-serif stack' },
                    check:
                      'var f = style("body", "font-family").toLowerCase();\nassert(f.indexOf("sans-serif") !== -1, "body font-family must end in sans-serif, currently: " + f);',
                  },
                  {
                    name: { en: 'Paragraphs are 18px with room to breathe', id: 'Paragraphs are 18px with room to breathe' },
                    check:
                      'assert(style("p", "font-size") === "18px", "p font-size must be 18px, currently: " + style("p", "font-size"));\nvar lh = parseFloat(style("p", "line-height"));\nassert(Math.abs(lh - 18 * 1.6) < 1.5, "line-height must be 1.6 (about 28.8px), currently: " + style("p", "line-height"));',
                  },
                  {
                    name: { en: 'The signature sits right', id: 'The signature sits right' },
                    check:
                      'assert(style(".signature", "text-align") === "right", ".signature must be right-aligned");\nassert(getComputedStyle(all("p")[0]).textAlign !== "right", "only .signature should be right-aligned");',
                  },
                ],
                id: [
                  {
                    name: { en: 'The page uses a sans-serif stack', id: 'Halaman memakai tumpukan sans-serif' },
                    check:
                      'var f = style("body", "font-family").toLowerCase();\nassert(f.indexOf("sans-serif") !== -1, "font-family body harus berakhir dengan sans-serif, sekarang: " + f);',
                  },
                  {
                    name: { en: 'Paragraphs are 18px with room to breathe', id: 'Paragrafnya 18px dengan jarak yang lega' },
                    check:
                      'assert(style("p", "font-size") === "18px", "font-size p harus 18px, sekarang: " + style("p", "font-size"));\nvar lh = parseFloat(style("p", "line-height"));\nassert(Math.abs(lh - 18 * 1.6) < 1.5, "line-height harus 1.6 (sekitar 28.8px), sekarang: " + style("p", "line-height"));',
                  },
                  {
                    name: { en: 'The signature sits right', id: 'Tanda tangannya rata kanan' },
                    check:
                      'assert(style(".tanda", "text-align") === "right", ".tanda harus rata kanan");\nassert(getComputedStyle(all("p")[0]).textAlign !== "right", "hanya .tanda yang rata kanan");',
                  },
                ],
              },
              hints: [
                { en: 'Three rules: body, p, and .signature.', id: 'Tiga aturan: body, p, dan .tanda.' },
                { en: 'A stack needs a generic at the end: `Arial, sans-serif`.', id: 'Tumpukan butuh yang generik di akhir: `Arial, sans-serif`.' },
                { en: 'line-height: 1.6 — no unit.', id: 'line-height: 1.6 — tanpa satuan.' },
              ],
              solution: {
                en: 'body {\n  font-family: Arial, Helvetica, sans-serif;\n}\n\np {\n  font-size: 18px;\n  line-height: 1.6;\n}\n\n.signature {\n  text-align: right;\n}',
                id: 'body {\n  font-family: Arial, Helvetica, sans-serif;\n}\n\np {\n  font-size: 18px;\n  line-height: 1.6;\n}\n\n.tanda {\n  text-align: right;\n}',
              },
            },
          ],
        },
        {
          id: 'css-m1-s2-l2',
          title: { en: 'Three ways to write a colour', id: 'Tiga cara menulis warna' },
          goal: { en: 'Use names, hex, and rgb — and keep contrast.', id: 'Memakai nama, heksadesimal, dan rgb — sambil menjaga kontras.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Name, hex, rgb', id: 'Nama, heks, rgb' },
              body: {
                en: 'The same colour can be written three ways. Names are readable but few. Hex `#rrggbb` is the common shorthand. `rgb()` spells out the three channels, and `rgba()` adds transparency.',
                id: 'Warna yang sama bisa ditulis tiga cara. Nama itu terbaca tapi jumlahnya sedikit. Heks `#rrggbb` adalah singkatan yang lazim. `rgb()` mengeja ketiga kanalnya, dan `rgba()` menambahkan transparansi.',
              },
              code: {
                en: '<style>\n  .a { color: crimson; }\n  .b { color: #dc143c; }\n  .c { color: rgb(220, 20, 60); }\n</style>\n\n<p class="a">Name</p>\n<p class="b">Hex</p>\n<p class="c">rgb — all three identical</p>',
                id: '<style>\n  .a { color: crimson; }\n  .b { color: #dc143c; }\n  .c { color: rgb(220, 20, 60); }\n</style>\n\n<p class="a">Nama</p>\n<p class="b">Heks</p>\n<p class="c">rgb — ketiganya identik</p>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Contrast is not a matter of taste', id: 'Kontras bukan soal selera' },
              body: {
                en: 'Light grey on white looks elegant on your screen and disappears on a phone in sunlight — or for anyone with low vision. Body text needs a contrast ratio of at least 4.5:1 against its background. When in doubt, go darker.',
                id: 'Abu-abu muda di atas putih tampak elegan di layarmu dan lenyap di ponsel yang kena matahari — atau bagi siapa pun dengan penglihatan lemah. Teks isi butuh rasio kontras minimal 4,5:1 terhadap latarnya. Kalau ragu, gelapkan.',
              },
              code: {
                en: '<style>\n  .bad  { color: #bbbbbb; background: white; }\n  .good { color: #333333; background: white; }\n</style>\n\n<p class="bad">Hard to read — contrast too low.</p>\n<p class="good">Easy to read.</p>',
                id: '<style>\n  .buruk { color: #bbbbbb; background: white; }\n  .baik  { color: #333333; background: white; }\n</style>\n\n<p class="buruk">Sulit dibaca — kontras terlalu rendah.</p>\n<p class="baik">Mudah dibaca.</p>',
              },
              preview: true,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What colour is `#ff0000`?', id: 'Warna apa `#ff0000`?' },
              options: [
                { en: 'Red — full red, no green, no blue', id: 'Merah — merah penuh, tanpa hijau, tanpa biru' },
                { en: 'Green', id: 'Hijau' },
                { en: 'Blue', id: 'Biru' },
                { en: 'White', id: 'Putih' },
              ],
              answer: 0,
              explain: {
                en: 'The pairs are red, green, blue. ff is the maximum, 00 the minimum.',
                id: 'Pasangannya berturut-turut merah, hijau, biru. ff nilai maksimum, 00 minimum.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: { en: 'Write pure blue in hex.', id: 'Tulis biru murni dalam heksadesimal.' },
              template: {
                en: '.blue {\n  color: #0000___;\n}',
                id: '.biru {\n  color: #0000___;\n}',
              },
              blanks: ['ff'],
              explain: {
                en: 'The third pair is the blue channel, and ff is its maximum.',
                id: 'Pasangan ketiga adalah kanal biru, dan ff adalah nilai maksimumnya.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              html: {
                en: '<div class="panel">\n  <h2>Announcement</h2>\n  <p>Class starts at eight in the morning.</p>\n</div>',
                id: '<div class="panel">\n  <h2>Pengumuman</h2>\n  <p>Kelas dimulai pukul delapan pagi.</p>\n</div>',
              },
              prompt: {
                en: 'Give `.panel` the background `#1e293b`, its `h2` the colour `#f8fafc`, and its `p` the colour `rgb(203, 213, 225)`.',
                id: 'Beri `.panel` latar `#1e293b`, `h2`-nya warna `#f8fafc`, dan `p`-nya warna `rgb(203, 213, 225)`.',
              },
              starter: '',
              tests: {
                en: [
                  {
                    name: { en: 'The panel is dark', id: 'The panel is dark' },
                    check: 'assert(style(".panel", "background-color") === "rgb(30, 41, 59)", ".panel background must be #1e293b, currently: " + style(".panel", "background-color"));',
                  },
                  {
                    name: { en: 'The heading is near-white', id: 'The heading is near-white' },
                    check: 'assert(style(".panel h2", "color") === "rgb(248, 250, 252)", "h2 color must be #f8fafc, currently: " + style(".panel h2", "color"));',
                  },
                  {
                    name: { en: 'The paragraph is light grey', id: 'The paragraph is light grey' },
                    check: 'assert(style(".panel p", "color") === "rgb(203, 213, 225)", "p color must be rgb(203, 213, 225), currently: " + style(".panel p", "color"));',
                  },
                ],
                id: [
                  {
                    name: { en: 'The panel is dark', id: 'Panelnya gelap' },
                    check: 'assert(style(".panel", "background-color") === "rgb(30, 41, 59)", "latar .panel harus #1e293b, sekarang: " + style(".panel", "background-color"));',
                  },
                  {
                    name: { en: 'The heading is near-white', id: 'Judulnya nyaris putih' },
                    check: 'assert(style(".panel h2", "color") === "rgb(248, 250, 252)", "warna h2 harus #f8fafc, sekarang: " + style(".panel h2", "color"));',
                  },
                  {
                    name: { en: 'The paragraph is light grey', id: 'Paragrafnya abu-abu terang' },
                    check: 'assert(style(".panel p", "color") === "rgb(203, 213, 225)", "warna p harus rgb(203, 213, 225), sekarang: " + style(".panel p", "color"));',
                  },
                ],
              },
              hints: [
                { en: 'Aim at the children with descendant selectors.', id: 'Bidik anak-anaknya dengan selektor keturunan.' },
                { en: '`.panel h2` and `.panel p`', id: '`.panel h2` dan `.panel p`' },
                { en: 'You may write the values in any notation — the check reads the resulting colour.', id: 'Kamu boleh menulis nilainya dalam notasi apa pun — pemeriksaannya membaca warna hasilnya.' },
              ],
              solution:
                '.panel {\n  background-color: #1e293b;\n}\n\n.panel h2 {\n  color: #f8fafc;\n}\n\n.panel p {\n  color: rgb(203, 213, 225);\n}',
            },
          ],
        },
      ],
      project: {
        id: 'css-m1-s2-p',
        runtime: 'web',
        html: {
          en: '<article class="post">\n  <h1>Learning CSS</h1>\n  <p class="summary">A short summary of what this piece covers.</p>\n  <p>A first body paragraph long enough to wrap onto the next line.</p>\n  <p>A second body paragraph.</p>\n  <p class="closing">Done.</p>\n</article>',
          id: '<article class="tulisan">\n  <h1>Belajar CSS</h1>\n  <p class="ringkasan">Rangkuman singkat tentang isi tulisan ini.</p>\n  <p>Paragraf isi pertama yang cukup panjang untuk membungkus ke baris berikutnya.</p>\n  <p>Paragraf isi kedua.</p>\n  <p class="penutup">Selesai.</p>\n</article>',
        },
        title: { en: 'Styled article', id: 'Artikel bergaya' },
        brief: {
          en: 'Turn a plain article into something readable, using type and colour only.',
          id: 'Ubah artikel polos menjadi sesuatu yang enak dibaca, hanya dengan tipografi dan warna.',
        },
        requirements: [
          { en: 'The page uses a font stack ending in `serif`.', id: 'Halaman memakai tumpukan font yang berakhir `serif`.' },
          { en: 'Paragraphs are 17px with a line-height of 1.7.', id: 'Paragraf berukuran 17px dengan line-height 1,7.' },
          { en: 'The `h1` is centred and coloured `#0f172a`.', id: '`h1` rata tengah dan berwarna `#0f172a`.' },
          { en: '`.summary` is bold and `#334155`.', id: '`.ringkasan` tebal dan berwarna `#334155`.' },
          { en: '`.closing` is right-aligned.', id: '`.penutup` rata kanan.' },
          { en: 'Body text is `#1f2937` — dark enough to read.', id: 'Teks isi berwarna `#1f2937` — cukup gelap untuk dibaca.' },
        ],
        starter: 'body {\n\n}\n',
        tests: {
          en: [
            {
              name: { en: 'A serif stack for the page', id: 'A serif stack for the page' },
              check:
                'var f = style("body", "font-family").toLowerCase();\nassert(f.indexOf("serif") !== -1 && f.indexOf("sans-serif") === -1, "font-family must end in serif (not sans-serif), currently: " + f);',
            },
            {
              name: { en: 'Paragraph size and spacing', id: 'Paragraph size and spacing' },
              check:
                'assert(style("p", "font-size") === "17px", "p font-size must be 17px, currently: " + style("p", "font-size"));\nvar lh = parseFloat(style("p", "line-height"));\nassert(Math.abs(lh - 17 * 1.7) < 1.5, "line-height must be 1.7 (about 28.9px), currently: " + style("p", "line-height"));',
            },
            {
              name: { en: 'The title is centred and dark', id: 'The title is centred and dark' },
              check:
                'assert(style("h1", "text-align") === "center", "h1 must be centred");\nassert(style("h1", "color") === "rgb(15, 23, 42)", "h1 color must be #0f172a, currently: " + style("h1", "color"));',
            },
            {
              name: { en: 'The summary stands out', id: 'The summary stands out' },
              check:
                'var w = style(".summary", "font-weight");\nassert(w === "700" || w === "bold", ".summary must be bold, currently: " + w);\nassert(style(".summary", "color") === "rgb(51, 65, 85)", ".summary color must be #334155, currently: " + style(".summary", "color"));',
            },
            {
              name: { en: 'The closing line sits right', id: 'The closing line sits right' },
              check: 'assert(style(".closing", "text-align") === "right", ".closing must be right-aligned");',
            },
            {
              name: { en: 'Body text has enough contrast', id: 'Body text has enough contrast' },
              check:
                'var plain = all("p").filter(function (e) { return !e.className; });\nassert(plain.length >= 2, "there should be two paragraphs without a class");\nplain.forEach(function (e) {\n  assert(getComputedStyle(e).color === "rgb(31, 41, 55)", "body text must be #1f2937");\n});',
            },
          ],
          id: [
            {
              name: { en: 'A serif stack for the page', id: 'Tumpukan serif untuk halaman' },
              check:
                'var f = style("body", "font-family").toLowerCase();\nassert(f.indexOf("serif") !== -1 && f.indexOf("sans-serif") === -1, "font-family harus berakhir serif (bukan sans-serif), sekarang: " + f);',
            },
            {
              name: { en: 'Paragraph size and spacing', id: 'Ukuran dan jarak paragraf' },
              check:
                'assert(style("p", "font-size") === "17px", "font-size p harus 17px, sekarang: " + style("p", "font-size"));\nvar lh = parseFloat(style("p", "line-height"));\nassert(Math.abs(lh - 17 * 1.7) < 1.5, "line-height harus 1.7 (sekitar 28.9px), sekarang: " + style("p", "line-height"));',
            },
            {
              name: { en: 'The title is centred and dark', id: 'Judulnya rata tengah dan gelap' },
              check:
                'assert(style("h1", "text-align") === "center", "h1 harus rata tengah");\nassert(style("h1", "color") === "rgb(15, 23, 42)", "warna h1 harus #0f172a, sekarang: " + style("h1", "color"));',
            },
            {
              name: { en: 'The summary stands out', id: 'Ringkasannya menonjol' },
              check:
                'var w = style(".ringkasan", "font-weight");\nassert(w === "700" || w === "bold", ".ringkasan harus tebal, sekarang: " + w);\nassert(style(".ringkasan", "color") === "rgb(51, 65, 85)", "warna .ringkasan harus #334155, sekarang: " + style(".ringkasan", "color"));',
            },
            {
              name: { en: 'The closing line sits right', id: 'Baris penutupnya rata kanan' },
              check: 'assert(style(".penutup", "text-align") === "right", ".penutup harus rata kanan");',
            },
            {
              name: { en: 'Body text has enough contrast', id: 'Teks isinya cukup kontras' },
              check:
                'var biasa = all("p").filter(function (e) { return !e.className; });\nassert(biasa.length >= 2, "seharusnya ada dua paragraf tanpa class");\nbiasa.forEach(function (e) {\n  assert(getComputedStyle(e).color === "rgb(31, 41, 55)", "teks isi harus #1f2937");\n});',
            },
          ],
        },
        hints: [
          { en: 'Set the family once on body — everything inherits it.', id: 'Setel jenis fontnya sekali di body — semuanya mewarisinya.' },
          { en: 'The p rule covers every paragraph; the class rules then override what differs.', id: 'Aturan p mencakup semua paragraf; aturan class-nya lalu menimpa yang berbeda.' },
          { en: 'Colour every p with #1f2937, then let .summary set its own colour.', id: 'Warnai semua p dengan #1f2937, lalu biarkan .ringkasan menetapkan warnanya sendiri.' },
        ],
        solution: {
          en: 'body {\n  font-family: Georgia, "Times New Roman", serif;\n}\n\np {\n  font-size: 17px;\n  line-height: 1.7;\n  color: #1f2937;\n}\n\nh1 {\n  text-align: center;\n  color: #0f172a;\n}\n\n.summary {\n  font-weight: bold;\n  color: #334155;\n}\n\n.closing {\n  text-align: right;\n}',
          id: 'body {\n  font-family: Georgia, "Times New Roman", serif;\n}\n\np {\n  font-size: 17px;\n  line-height: 1.7;\n  color: #1f2937;\n}\n\nh1 {\n  text-align: center;\n  color: #0f172a;\n}\n\n.ringkasan {\n  font-weight: bold;\n  color: #334155;\n}\n\n.penutup {\n  text-align: right;\n}',
        },
        xp: 50,
      },
    },
  ],
}
