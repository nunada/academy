import type { Module } from '../types'

/** Module 3 — the two layout systems worth learning today.
 *
 *  Note for anyone adding tests here: getComputedStyle resolves
 *  `grid-template-columns` to used pixel values, not the `repeat(3, 1fr)` you
 *  wrote. So the checks count tracks and compare positions rather than matching
 *  the declaration text — which also lets a learner reach the goal their own way. */
export const module3: Module = {
  id: 'css-m3',
  title: { en: 'Layout', id: 'Tata Letak' },
  summary: {
    en: 'Arrange boxes in rows and grids without fighting the browser.',
    id: 'Menata kotak dalam baris dan kisi tanpa melawan peramban.',
  },
  submodules: [
    /* ----------------------------------------------------------- 3.1 flexbox */
    {
      id: 'css-m3-s1',
      title: { en: 'Flexbox', id: 'Flexbox' },
      summary: {
        en: 'One direction at a time — the tool for toolbars, cards, and rows.',
        id: 'Satu arah dalam satu waktu — alat untuk bilah, kartu, dan barisan.',
      },
      lessons: [
        {
          id: 'css-m3-s1-l1',
          title: { en: 'A row of boxes', id: 'Sederet kotak' },
          goal: { en: 'Lay children out in a line.', id: 'Menata anak-anak elemen dalam satu garis.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Flex is set on the parent', id: 'Flex disetel pada induknya' },
              body: {
                en: 'This is the idea to hold on to: you do not tell the boxes to line up, you tell their **container** to arrange them. `display: flex` turns every direct child into a row.',
                id: 'Inilah gagasan yang perlu dipegang: kamu tidak menyuruh kotak-kotaknya berbaris, kamu menyuruh **wadahnya** menata mereka. `display: flex` mengubah setiap anak langsung menjadi satu baris.',
              },
              code: {
                en: '<style>\n  .row { display: flex; }\n  .row div { background: #bfdbfe; padding: 12px; }\n</style>\n\n<div class="row">\n  <div>One</div>\n  <div>Two</div>\n  <div>Three</div>\n</div>',
                id: '<style>\n  .baris { display: flex; }\n  .baris div { background: #bfdbfe; padding: 12px; }\n</style>\n\n<div class="baris">\n  <div>Satu</div>\n  <div>Dua</div>\n  <div>Tiga</div>\n</div>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'gap, instead of margins everywhere', id: 'gap, alih-alih margin di mana-mana' },
              body: {
                en: '`gap` puts space **between** items and nowhere else — no leftover margin on the first or last one, nothing to clean up. Before `gap` existed this took a surprising amount of work.',
                id: '`gap` menaruh jarak **di antara** item dan tidak di tempat lain — tak ada sisa margin di item pertama atau terakhir, tak ada yang perlu dibereskan. Sebelum `gap` ada, ini butuh kerja yang mengejutkan banyaknya.',
              },
              code: {
                en: '<style>\n  .row { display: flex; gap: 16px; }\n  .row div { background: #bbf7d0; padding: 12px; }\n</style>\n\n<div class="row">\n  <div>One</div>\n  <div>Two</div>\n</div>',
                id: '<style>\n  .baris { display: flex; gap: 16px; }\n  .baris div { background: #bbf7d0; padding: 12px; }\n</style>\n\n<div class="baris">\n  <div>Satu</div>\n  <div>Dua</div>\n</div>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Column when you want a stack', id: 'Column bila kamu ingin tumpukan' },
              body: {
                en: '`flex-direction: column` turns the same container into a vertical stack. Everything else you learn about flex then applies down the page instead of across it.',
                id: '`flex-direction: column` mengubah wadah yang sama menjadi tumpukan vertikal. Semua yang kamu pelajari tentang flex lalu berlaku ke bawah halaman, bukan melintanginya.',
              },
              code: {
                en: '<style>\n  .stack { display: flex; flex-direction: column; gap: 8px; }\n  .stack div { background: #fde68a; padding: 8px; }\n</style>\n\n<div class="stack">\n  <div>Top</div>\n  <div>Bottom</div>\n</div>',
                id: '<style>\n  .tumpuk { display: flex; flex-direction: column; gap: 8px; }\n  .tumpuk div { background: #fde68a; padding: 8px; }\n</style>\n\n<div class="tumpuk">\n  <div>Atas</div>\n  <div>Bawah</div>\n</div>',
              },
              preview: true,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Where do you write `display: flex` to put three cards in a row?',
                id: 'Di mana kamu menulis `display: flex` untuk menjajarkan tiga kartu?',
              },
              options: [
                { en: 'On the container that holds them', id: 'Pada wadah yang menampungnya' },
                { en: 'On each card', id: 'Pada tiap kartu' },
                { en: 'On the body', id: 'Pada body' },
                { en: 'On both the container and the cards', id: 'Pada wadah dan kartunya sekaligus' },
              ],
              answer: 0,
              explain: {
                en: 'Flex is a property of the parent. The children are arranged by it, and need no rule of their own.',
                id: 'Flex adalah properti induknya. Anak-anaknya ditata olehnya, dan tidak butuh aturan sendiri.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: { en: 'Stack the children vertically with 12px between them.', id: 'Tumpuk anak-anaknya vertikal dengan jarak 12px.' },
              template: {
                en: '.container {\n  display: flex;\n  flex-___: column;\n  ___: 12px;\n}',
                id: '.wadah {\n  display: flex;\n  flex-___: column;\n  ___: 12px;\n}',
              },
              blanks: ['direction', 'gap'],
              explain: {
                en: 'flex-direction picks the axis; gap spaces the items along it.',
                id: 'flex-direction memilih sumbunya; gap memberi jarak sepanjang sumbu itu.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              html: {
                en: '<div class="list">\n  <div class="item">Python</div>\n  <div class="item">HTML</div>\n  <div class="item">CSS</div>\n</div>',
                id: '<div class="daftar">\n  <div class="item">Python</div>\n  <div class="item">HTML</div>\n  <div class="item">CSS</div>\n</div>',
              },
              prompt: {
                en: 'Make `.list` a flex row with a 20px gap, and give each `.item` 10px of padding and a `#e0e7ff` background.',
                id: 'Jadikan `.daftar` baris flex dengan gap 20px, dan beri tiap `.item` padding 10px serta latar `#e0e7ff`.',
              },
              starter: '.list {\n\n}\n',
              tests: {
                en: [
                  {
                    name: { en: 'The container is a flex row', id: 'The container is a flex row' },
                    check:
                      'assert(style(".list", "display") === "flex", ".list display must be flex, currently: " + style(".list", "display"));\nvar d = style(".list", "flex-direction");\nassert(d === "row" || d === "", "the direction must be row (default)");',
                  },
                  {
                    name: { en: 'The three items share a line', id: 'The three items share a line' },
                    check:
                      'var it = all(".item");\nassert(it.length === 3, "there should be three items");\nvar y = it.map(function (e) { return Math.round(e.getBoundingClientRect().top); });\nassert(y[0] === y[1] && y[1] === y[2], "all three must be on one row");',
                  },
                  {
                    name: { en: 'There is a 20px gap between them', id: 'There is a 20px gap between them' },
                    check:
                      'var it = all(".item");\nvar gap = Math.round(it[1].getBoundingClientRect().left - it[0].getBoundingClientRect().right);\nassert(Math.abs(gap - 20) < 2, "the gap between items must be 20px, currently: " + gap + "px");',
                  },
                  {
                    name: { en: 'Items are padded and coloured', id: 'Items are padded and coloured' },
                    check:
                      'assert(style(".item", "padding-top") === "10px", ".item padding must be 10px");\nassert(style(".item", "background-color") === "rgb(224, 231, 255)", ".item background must be #e0e7ff");',
                  },
                ],
                id: [
                  {
                    name: { en: 'The container is a flex row', id: 'Wadahnya berupa baris flex' },
                    check:
                      'assert(style(".daftar", "display") === "flex", "display .daftar harus flex, sekarang: " + style(".daftar", "display"));\nvar d = style(".daftar", "flex-direction");\nassert(d === "row" || d === "", "arahnya harus row (bawaan)");',
                  },
                  {
                    name: { en: 'The three items share a line', id: 'Ketiga item berbagi satu baris' },
                    check:
                      'var it = all(".item");\nassert(it.length === 3, "seharusnya ada tiga item");\nvar y = it.map(function (e) { return Math.round(e.getBoundingClientRect().top); });\nassert(y[0] === y[1] && y[1] === y[2], "ketiganya harus sebaris");',
                  },
                  {
                    name: { en: 'There is a 20px gap between them', id: 'Ada jarak 20px di antaranya' },
                    check:
                      'var it = all(".item");\nvar jarak = Math.round(it[1].getBoundingClientRect().left - it[0].getBoundingClientRect().right);\nassert(Math.abs(jarak - 20) < 2, "jarak antaritem harus 20px, sekarang: " + jarak + "px");',
                  },
                  {
                    name: { en: 'Items are padded and coloured', id: 'Itemnya berpadding dan berwarna' },
                    check:
                      'assert(style(".item", "padding-top") === "10px", "padding .item harus 10px");\nassert(style(".item", "background-color") === "rgb(224, 231, 255)", "latar .item harus #e0e7ff");',
                  },
                ],
              },
              hints: [
                { en: 'Two rules: the container, then the items.', id: 'Dua aturan: wadahnya, lalu itemnya.' },
                { en: 'Only the container needs display and gap.', id: 'Hanya wadahnya yang butuh display dan gap.' },
              ],
              solution: {
                en: '.list {\n  display: flex;\n  gap: 20px;\n}\n\n.item {\n  padding: 10px;\n  background-color: #e0e7ff;\n}',
                id: '.daftar {\n  display: flex;\n  gap: 20px;\n}\n\n.item {\n  padding: 10px;\n  background-color: #e0e7ff;\n}',
              },
            },
          ],
        },
        {
          id: 'css-m3-s1-l2',
          title: { en: 'Pushing things around', id: 'Mendorong isi ke tempatnya' },
          goal: { en: 'Align along and across the row.', id: 'Menyelaraskan searah dan melintang baris.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'justify-content follows the direction', id: 'justify-content mengikuti arahnya' },
              body: {
                en: 'In a row, `justify-content` moves items horizontally: `flex-start`, `center`, `flex-end`, `space-between`, `space-around`. In a column it moves them vertically — the property follows the axis, not the screen.',
                id: 'Pada baris, `justify-content` memindahkan item secara horizontal: `flex-start`, `center`, `flex-end`, `space-between`, `space-around`. Pada kolom ia memindahkannya vertikal — propertinya mengikuti sumbu, bukan layar.',
              },
              code: {
                en: '<style>\n  .bar {\n    display: flex;\n    justify-content: space-between;\n    background: #e2e8f0;\n    padding: 8px;\n  }\n</style>\n\n<div class="bar">\n  <div>Left</div>\n  <div>Right</div>\n</div>',
                id: '<style>\n  .bar {\n    display: flex;\n    justify-content: space-between;\n    background: #e2e8f0;\n    padding: 8px;\n  }\n</style>\n\n<div class="bar">\n  <div>Kiri</div>\n  <div>Kanan</div>\n</div>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'align-items works across it', id: 'align-items bekerja melintanginya' },
              body: {
                en: '`align-items` handles the other axis. In a row that is vertical, so `align-items: center` lines up items of different heights along their middles — the fix for a logo and a menu that refuse to sit level.',
                id: '`align-items` mengurus sumbu satunya. Pada baris, itu berarti vertikal, jadi `align-items: center` menyejajarkan item yang tingginya berbeda pada bagian tengahnya — obat untuk logo dan menu yang enggan sejajar.',
              },
              code: {
                en: '<style>\n  .bar {\n    display: flex;\n    align-items: center;\n    gap: 12px;\n    background: #e2e8f0;\n  }\n  .big { font-size: 28px; }\n</style>\n\n<div class="bar">\n  <div class="big">Logo</div>\n  <div>Menu</div>\n</div>',
                id: '<style>\n  .bar {\n    display: flex;\n    align-items: center;\n    gap: 12px;\n    background: #e2e8f0;\n  }\n  .besar { font-size: 28px; }\n</style>\n\n<div class="bar">\n  <div class="besar">Logo</div>\n  <div>Menu</div>\n</div>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Centring, finally made easy', id: 'Memusatkan, akhirnya jadi mudah' },
              body: {
                en: 'Both properties set to `center` puts a child dead in the middle of its container, horizontally and vertically. This is the answer to a question CSS made hard for twenty years.',
                id: 'Kedua properti disetel `center` menaruh sebuah anak tepat di tengah wadahnya, horizontal maupun vertikal. Inilah jawaban atas pertanyaan yang dibuat sulit oleh CSS selama dua puluh tahun.',
              },
              code: {
                en: '<style>\n  .center {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    height: 120px;\n    background: #ddd6fe;\n  }\n</style>\n\n<div class="center"><span>Right in the middle</span></div>',
                id: '<style>\n  .tengah {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    height: 120px;\n    background: #ddd6fe;\n  }\n</style>\n\n<div class="tengah"><span>Tepat di tengah</span></div>',
              },
              preview: true,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A flex row should have one item at each end. Which value?',
                id: 'Sebuah baris flex harus punya satu item di tiap ujung. Nilai mana?',
              },
              options: [
                { en: 'justify-content: space-between', id: 'justify-content: space-between' },
                { en: 'justify-content: center', id: 'justify-content: center' },
                { en: 'align-items: space-between', id: 'align-items: space-between' },
                { en: 'gap: auto', id: 'gap: auto' },
              ],
              answer: 0,
              explain: {
                en: 'space-between puts all the free space between the items, pushing the outer ones to the edges.',
                id: 'space-between menaruh semua ruang sisa di antara item, mendorong yang terluar ke tepi.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              html: {
                en: '<div class="bar">\n  <div class="logo">Nunada</div>\n  <div class="menu">Sign in</div>\n</div>',
                id: '<div class="bar">\n  <div class="logo">Nunada</div>\n  <div class="menu">Masuk</div>\n</div>',
              },
              prompt: {
                en: 'Make `.bar` a flex row 80px tall that pushes `.logo` and `.menu` to opposite ends and centres them vertically.',
                id: 'Jadikan `.bar` baris flex setinggi 80px yang mendorong `.logo` dan `.menu` ke ujung berlawanan dan memusatkannya secara vertikal.',
              },
              starter: '.bar {\n\n}\n',
              tests: {
                en: [
                  {
                    name: { en: 'A flex row of the right height', id: 'A flex row of the right height' },
                    check:
                      'assert(style(".bar", "display") === "flex", ".bar display must be flex");\nassert(style(".bar", "height") === "80px", ".bar height must be 80px, currently: " + style(".bar", "height"));',
                  },
                  {
                    name: { en: 'The two items sit at opposite ends', id: 'The two items sit at opposite ends' },
                    check:
                      'assert(style(".bar", "justify-content") === "space-between", "justify-content must be space-between, currently: " + style(".bar", "justify-content"));\nvar bar = sel(".bar").getBoundingClientRect();\nvar logo = sel(".logo").getBoundingClientRect();\nvar menu = sel(".menu").getBoundingClientRect();\nassert(Math.abs(logo.left - bar.left) < 2, "logo must sit flush with the left edge");\nassert(Math.abs(bar.right - menu.right) < 2, "menu must sit flush with the right edge");',
                  },
                  {
                    name: { en: 'They are centred vertically', id: 'They are centred vertically' },
                    check:
                      'assert(style(".bar", "align-items") === "center", "align-items must be center, currently: " + style(".bar", "align-items"));\nvar bar = sel(".bar").getBoundingClientRect();\nvar logo = sel(".logo").getBoundingClientRect();\nvar top = logo.top - bar.top;\nvar bottom = bar.bottom - logo.bottom;\nassert(Math.abs(top - bottom) < 2, "top and bottom gaps must match (top " + Math.round(top) + ", bottom " + Math.round(bottom) + ")");',
                  },
                ],
                id: [
                  {
                    name: { en: 'A flex row of the right height', id: 'Baris flex dengan tinggi yang benar' },
                    check:
                      'assert(style(".bar", "display") === "flex", "display .bar harus flex");\nassert(style(".bar", "height") === "80px", "tinggi .bar harus 80px, sekarang: " + style(".bar", "height"));',
                  },
                  {
                    name: { en: 'The two items sit at opposite ends', id: 'Kedua item berada di ujung berlawanan' },
                    check:
                      'assert(style(".bar", "justify-content") === "space-between", "justify-content harus space-between, sekarang: " + style(".bar", "justify-content"));\nvar bar = sel(".bar").getBoundingClientRect();\nvar logo = sel(".logo").getBoundingClientRect();\nvar menu = sel(".menu").getBoundingClientRect();\nassert(Math.abs(logo.left - bar.left) < 2, "logo harus menempel ujung kiri");\nassert(Math.abs(bar.right - menu.right) < 2, "menu harus menempel ujung kanan");',
                  },
                  {
                    name: { en: 'They are centred vertically', id: 'Keduanya terpusat vertikal' },
                    check:
                      'assert(style(".bar", "align-items") === "center", "align-items harus center, sekarang: " + style(".bar", "align-items"));\nvar bar = sel(".bar").getBoundingClientRect();\nvar logo = sel(".logo").getBoundingClientRect();\nvar atas = logo.top - bar.top;\nvar bawah = bar.bottom - logo.bottom;\nassert(Math.abs(atas - bawah) < 2, "jarak atas dan bawah harus sama (atas " + Math.round(atas) + ", bawah " + Math.round(bawah) + ")");',
                  },
                ],
              },
              hints: [
                { en: 'Everything goes on .bar — the children need no rules.', id: 'Semuanya ditaruh di .bar — anak-anaknya tidak butuh aturan.' },
                { en: 'Four declarations: display, height, justify-content, align-items.', id: 'Empat deklarasi: display, height, justify-content, align-items.' },
              ],
              solution:
                '.bar {\n  display: flex;\n  height: 80px;\n  justify-content: space-between;\n  align-items: center;\n}',
            },
          ],
        },
      ],
      project: {
        id: 'css-m3-s1-p',
        runtime: 'web',
        html: {
          en: '<header class="bar">\n  <div class="logo">Nunada</div>\n  <nav class="menu">\n    <a href="#">Home</a>\n    <a href="#">Courses</a>\n    <a href="#">Contact</a>\n  </nav>\n</header>',
          id: '<header class="bar">\n  <div class="logo">Nunada</div>\n  <nav class="menu">\n    <a href="#">Beranda</a>\n    <a href="#">Kursus</a>\n    <a href="#">Kontak</a>\n  </nav>\n</header>',
        },
        title: { en: 'Navigation bar', id: 'Bilah navigasi' },
        brief: {
          en: 'A real header: logo on the left, menu on the right, everything level.',
          id: 'Header sungguhan: logo di kiri, menu di kanan, semuanya sejajar.',
        },
        requirements: [
          { en: '`.bar` is a flex row, 72px tall, with 0 24px padding and a `#0f172a` background.', id: '`.bar` adalah baris flex, tinggi 72px, padding 0 24px, latar `#0f172a`.' },
          { en: 'Logo left, menu right, both vertically centred.', id: 'Logo di kiri, menu di kanan, keduanya terpusat vertikal.' },
          { en: '`.logo` is white, 20px, bold.', id: '`.logo` putih, 20px, tebal.' },
          { en: '`.menu` is itself a flex row with a 20px gap.', id: '`.menu` sendiri adalah baris flex dengan gap 20px.' },
          { en: 'Links inside `.menu` are `#cbd5e1` with no underline.', id: 'Tautan di dalam `.menu` berwarna `#cbd5e1` tanpa garis bawah.' },
        ],
        starter: '.bar {\n\n}\n',
        tests: {
          en: [
            {
              name: { en: 'The bar is a flex row, styled', id: 'The bar is a flex row, styled' },
              check:
                'assert(style(".bar", "display") === "flex", ".bar display must be flex");\nassert(style(".bar", "height") === "72px", "height must be 72px");\nassert(style(".bar", "padding-left") === "24px", "left padding must be 24px");\nassert(style(".bar", "padding-top") === "0px", "top padding must be 0");\nassert(style(".bar", "background-color") === "rgb(15, 23, 42)", "background must be #0f172a");',
            },
            {
              name: { en: 'Logo and menu are at opposite ends', id: 'Logo and menu are at opposite ends' },
              check:
                'var bar = sel(".bar").getBoundingClientRect();\nvar logo = sel(".logo").getBoundingClientRect();\nvar menu = sel(".menu").getBoundingClientRect();\nassert(Math.abs(logo.left - (bar.left + 24)) < 3, "the logo must be on the left, right after the padding");\nassert(Math.abs((bar.right - 24) - menu.right) < 3, "the menu must sit flush right, right before the padding");',
            },
            {
              name: { en: 'Everything is vertically centred', id: 'Everything is vertically centred' },
              check:
                'assert(style(".bar", "align-items") === "center", ".bar align-items must be center");\nvar bar = sel(".bar").getBoundingClientRect();\nvar logo = sel(".logo").getBoundingClientRect();\nassert(Math.abs((logo.top - bar.top) - (bar.bottom - logo.bottom)) < 2, "the logo is not vertically centred yet");',
            },
            {
              name: { en: 'The logo reads as a logo', id: 'The logo reads as a logo' },
              check:
                'assert(style(".logo", "color") === "rgb(255, 255, 255)", "the logo must be white");\nassert(style(".logo", "font-size") === "20px", "the logo size must be 20px");\nvar w = style(".logo", "font-weight");\nassert(w === "700" || w === "bold", "the logo must be bold, currently: " + w);',
            },
            {
              name: { en: 'The menu spaces its links', id: 'The menu spaces its links' },
              check:
                'assert(style(".menu", "display") === "flex", ".menu display must be flex");\nvar a = all(".menu a");\nassert(a.length === 3, "there should be three links");\nvar gap = Math.round(a[1].getBoundingClientRect().left - a[0].getBoundingClientRect().right);\nassert(Math.abs(gap - 20) < 2, "the gap between links must be 20px, currently: " + gap + "px");',
            },
            {
              name: { en: 'The links are quiet and clean', id: 'The links are quiet and clean' },
              check:
                'assert(style(".menu a", "color") === "rgb(203, 213, 225)", "the link color must be #cbd5e1");\nassert(style(".menu a", "text-decoration-line") === "none", "the links must not be underlined");',
            },
          ],
          id: [
            {
              name: { en: 'The bar is a flex row, styled', id: 'Bilahnya baris flex yang bergaya' },
              check:
                'assert(style(".bar", "display") === "flex", "display .bar harus flex");\nassert(style(".bar", "height") === "72px", "tinggi harus 72px");\nassert(style(".bar", "padding-left") === "24px", "padding kiri harus 24px");\nassert(style(".bar", "padding-top") === "0px", "padding atas harus 0");\nassert(style(".bar", "background-color") === "rgb(15, 23, 42)", "latar harus #0f172a");',
            },
            {
              name: { en: 'Logo and menu are at opposite ends', id: 'Logo dan menu di ujung berlawanan' },
              check:
                'var bar = sel(".bar").getBoundingClientRect();\nvar logo = sel(".logo").getBoundingClientRect();\nvar menu = sel(".menu").getBoundingClientRect();\nassert(Math.abs(logo.left - (bar.left + 24)) < 3, "logo harus di kiri, tepat setelah padding");\nassert(Math.abs((bar.right - 24) - menu.right) < 3, "menu harus menempel kanan, tepat sebelum padding");',
            },
            {
              name: { en: 'Everything is vertically centred', id: 'Semuanya terpusat vertikal' },
              check:
                'assert(style(".bar", "align-items") === "center", "align-items .bar harus center");\nvar bar = sel(".bar").getBoundingClientRect();\nvar logo = sel(".logo").getBoundingClientRect();\nassert(Math.abs((logo.top - bar.top) - (bar.bottom - logo.bottom)) < 2, "logo belum terpusat vertikal");',
            },
            {
              name: { en: 'The logo reads as a logo', id: 'Logonya terbaca sebagai logo' },
              check:
                'assert(style(".logo", "color") === "rgb(255, 255, 255)", "logo harus putih");\nassert(style(".logo", "font-size") === "20px", "ukuran logo harus 20px");\nvar w = style(".logo", "font-weight");\nassert(w === "700" || w === "bold", "logo harus tebal, sekarang: " + w);',
            },
            {
              name: { en: 'The menu spaces its links', id: 'Menunya memberi jarak tautannya' },
              check:
                'assert(style(".menu", "display") === "flex", "display .menu harus flex");\nvar a = all(".menu a");\nassert(a.length === 3, "seharusnya ada tiga tautan");\nvar jarak = Math.round(a[1].getBoundingClientRect().left - a[0].getBoundingClientRect().right);\nassert(Math.abs(jarak - 20) < 2, "jarak antartautan harus 20px, sekarang: " + jarak + "px");',
            },
            {
              name: { en: 'The links are quiet and clean', id: 'Tautannya tenang dan bersih' },
              check:
                'assert(style(".menu a", "color") === "rgb(203, 213, 225)", "warna tautan harus #cbd5e1");\nassert(style(".menu a", "text-decoration-line") === "none", "tautan tidak boleh bergaris bawah");',
            },
          ],
        },
        hints: [
          { en: 'Two flex containers here: the bar, and the menu inside it.', id: 'Ada dua wadah flex di sini: bilahnya, dan menu di dalamnya.' },
          { en: 'Removing an underline is `text-decoration: none`.', id: 'Menghapus garis bawah dengan `text-decoration: none`.' },
          { en: '`padding: 0 24px` means none top and bottom, 24 left and right.', id: '`padding: 0 24px` berarti nol di atas-bawah, 24 di kiri-kanan.' },
        ],
        solution:
          '.bar {\n  display: flex;\n  height: 72px;\n  padding: 0 24px;\n  background-color: #0f172a;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.logo {\n  color: white;\n  font-size: 20px;\n  font-weight: bold;\n}\n\n.menu {\n  display: flex;\n  gap: 20px;\n}\n\n.menu a {\n  color: #cbd5e1;\n  text-decoration: none;\n}',
        xp: 50,
      },
    },

    /* -------------------------------------------------------------- 3.2 grid */
    {
      id: 'css-m3-s2',
      title: { en: 'Grid', id: 'Grid' },
      summary: {
        en: 'Rows and columns at once, for galleries and page layouts.',
        id: 'Baris dan kolom sekaligus, untuk galeri dan tata letak halaman.',
      },
      lessons: [
        {
          id: 'css-m3-s2-l1',
          title: { en: 'Columns you declare', id: 'Kolom yang kamu tetapkan' },
          goal: { en: 'Place items on a grid.', id: 'Menempatkan item pada kisi.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Flex is a line, grid is a table', id: 'Flex itu garis, grid itu tabel' },
              body: {
                en: 'Flex arranges along one axis and wraps when it must. Grid lets you declare the columns up front and drop items into them. For a gallery of equal cards, grid says what you mean.',
                id: 'Flex menata sepanjang satu sumbu dan membungkus bila terpaksa. Grid membuatmu menetapkan kolomnya di depan lalu menjatuhkan item ke dalamnya. Untuk galeri kartu yang seragam, grid menyatakan maksudmu.',
              },
              code: {
                en: '<style>\n  .grid {\n    display: grid;\n    grid-template-columns: 1fr 1fr 1fr;\n    gap: 12px;\n  }\n  .grid div { background: #bae6fd; padding: 16px; }\n</style>\n\n<div class="grid">\n  <div>1</div><div>2</div><div>3</div>\n  <div>4</div><div>5</div><div>6</div>\n</div>',
                id: '<style>\n  .kisi {\n    display: grid;\n    grid-template-columns: 1fr 1fr 1fr;\n    gap: 12px;\n  }\n  .kisi div { background: #bae6fd; padding: 16px; }\n</style>\n\n<div class="kisi">\n  <div>1</div><div>2</div><div>3</div>\n  <div>4</div><div>5</div><div>6</div>\n</div>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'fr is "share of what is left"', id: 'fr adalah "bagian dari sisa"' },
              body: {
                en: '`1fr 1fr 1fr` splits the free space three ways. `2fr 1fr` makes the first column twice the second. `repeat(3, 1fr)` is shorthand for the first — same thing, less typing.',
                id: '`1fr 1fr 1fr` membagi ruang sisa jadi tiga. `2fr 1fr` membuat kolom pertama dua kali kolom kedua. `repeat(3, 1fr)` adalah singkatan dari yang pertama — hal sama, tulisannya lebih pendek.',
              },
              code: {
                en: '<style>\n  .grid {\n    display: grid;\n    grid-template-columns: 2fr 1fr;\n    gap: 12px;\n  }\n  .grid div { background: #ddd6fe; padding: 16px; }\n</style>\n\n<div class="grid">\n  <div>wide</div><div>narrow</div>\n</div>',
                id: '<style>\n  .kisi {\n    display: grid;\n    grid-template-columns: 2fr 1fr;\n    gap: 12px;\n  }\n  .kisi div { background: #ddd6fe; padding: 16px; }\n</style>\n\n<div class="kisi">\n  <div>lebar</div><div>sempit</div>\n</div>',
              },
              preview: true,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What does `repeat(4, 1fr)` create?', id: 'Apa yang dibuat `repeat(4, 1fr)`?' },
              options: [
                { en: 'Four equal columns', id: 'Empat kolom sama lebar' },
                { en: 'Four rows', id: 'Empat baris' },
                { en: 'One column repeated four times vertically', id: 'Satu kolom diulang empat kali ke bawah' },
                { en: 'A column 4fr wide', id: 'Satu kolom selebar 4fr' },
              ],
              answer: 0,
              explain: {
                en: 'The first number is how many tracks, the second what each one is.',
                id: 'Angka pertama adalah berapa jalur, yang kedua adalah ukuran tiap jalurnya.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              html: {
                en: '<div class="gallery">\n  <div class="cell">A</div>\n  <div class="cell">B</div>\n  <div class="cell">C</div>\n  <div class="cell">D</div>\n</div>',
                id: '<div class="galeri">\n  <div class="sel">A</div>\n  <div class="sel">B</div>\n  <div class="sel">C</div>\n  <div class="sel">D</div>\n</div>',
              },
              prompt: {
                en: 'Make `.gallery` a grid of two equal columns with a 16px gap, and give each `.cell` 20px of padding and a `#fee2e2` background.',
                id: 'Jadikan `.galeri` kisi dua kolom sama lebar dengan gap 16px, dan beri tiap `.sel` padding 20px serta latar `#fee2e2`.',
              },
              starter: '.gallery {\n\n}\n',
              tests: {
                en: [
                  {
                    name: { en: 'It is a grid with two columns', id: 'It is a grid with two columns' },
                    check:
                      'assert(style(".gallery", "display") === "grid", "display must be grid, currently: " + style(".gallery", "display"));\nvar cols = style(".gallery", "grid-template-columns").split(" ").filter(function (x) { return x; });\nassert(cols.length === 2, "there must be two columns, read: " + cols.length);',
                  },
                  {
                    name: { en: 'The columns are equal', id: 'The columns are equal' },
                    check:
                      'var cols = style(".gallery", "grid-template-columns").split(" ").map(parseFloat);\nassert(Math.abs(cols[0] - cols[1]) < 2, "both columns must be equal width, currently: " + cols.join(" / "));',
                  },
                  {
                    name: { en: 'Four cells land in two rows', id: 'Four cells land in two rows' },
                    check:
                      'var s = all(".cell");\nassert(s.length === 4, "there should be four cells");\nvar y = s.map(function (e) { return Math.round(e.getBoundingClientRect().top); });\nassert(y[0] === y[1], "A and B must be on one row");\nassert(y[2] === y[3], "C and D must be on one row");\nassert(y[2] > y[0], "C must be on the second row");',
                  },
                  {
                    name: { en: 'Gap and cell styling', id: 'Gap and cell styling' },
                    check:
                      'var s = all(".cell");\nvar gap = Math.round(s[1].getBoundingClientRect().left - s[0].getBoundingClientRect().right);\nassert(Math.abs(gap - 16) < 2, "the gap must be 16px, currently: " + gap + "px");\nassert(style(".cell", "padding-top") === "20px", ".cell padding must be 20px");\nassert(style(".cell", "background-color") === "rgb(254, 226, 226)", ".cell background must be #fee2e2");',
                  },
                ],
                id: [
                  {
                    name: { en: 'It is a grid with two columns', id: 'Ia kisi dengan dua kolom' },
                    check:
                      'assert(style(".galeri", "display") === "grid", "display harus grid, sekarang: " + style(".galeri", "display"));\nvar kolom = style(".galeri", "grid-template-columns").split(" ").filter(function (x) { return x; });\nassert(kolom.length === 2, "harus dua kolom, terbaca: " + kolom.length);',
                  },
                  {
                    name: { en: 'The columns are equal', id: 'Kolomnya sama lebar' },
                    check:
                      'var kolom = style(".galeri", "grid-template-columns").split(" ").map(parseFloat);\nassert(Math.abs(kolom[0] - kolom[1]) < 2, "kedua kolom harus sama lebar, sekarang: " + kolom.join(" / "));',
                  },
                  {
                    name: { en: 'Four cells land in two rows', id: 'Empat sel jatuh ke dua baris' },
                    check:
                      'var s = all(".sel");\nassert(s.length === 4, "seharusnya ada empat sel");\nvar y = s.map(function (e) { return Math.round(e.getBoundingClientRect().top); });\nassert(y[0] === y[1], "A dan B harus sebaris");\nassert(y[2] === y[3], "C dan D harus sebaris");\nassert(y[2] > y[0], "C harus berada di baris kedua");',
                  },
                  {
                    name: { en: 'Gap and cell styling', id: 'Jarak dan gaya selnya' },
                    check:
                      'var s = all(".sel");\nvar jarak = Math.round(s[1].getBoundingClientRect().left - s[0].getBoundingClientRect().right);\nassert(Math.abs(jarak - 16) < 2, "gap harus 16px, sekarang: " + jarak + "px");\nassert(style(".sel", "padding-top") === "20px", "padding sel harus 20px");\nassert(style(".sel", "background-color") === "rgb(254, 226, 226)", "latar sel harus #fee2e2");',
                  },
                ],
              },
              hints: [
                { en: 'grid-template-columns takes the track list.', id: 'grid-template-columns menerima daftar jalurnya.' },
                { en: '`1fr 1fr` or `repeat(2, 1fr)` — both work.', id: '`1fr 1fr` atau `repeat(2, 1fr)` — keduanya berhasil.' },
              ],
              solution: {
                en: '.gallery {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 16px;\n}\n\n.cell {\n  padding: 20px;\n  background-color: #fee2e2;\n}',
                id: '.galeri {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 16px;\n}\n\n.sel {\n  padding: 20px;\n  background-color: #fee2e2;\n}',
              },
            },
          ],
        },
        {
          id: 'css-m3-s2-l2',
          title: { en: 'Spanning and fitting', id: 'Melintang dan menyesuaikan' },
          goal: { en: 'Let one item take more room, and let the grid adapt.', id: 'Membiarkan satu item mengambil ruang lebih, dan kisinya menyesuaikan.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'One item, two columns', id: 'Satu item, dua kolom' },
              body: {
                en: '`grid-column: span 2` on a child makes it stretch across two tracks. This is the one place a grid child gets a rule of its own — everything else stays on the container.',
                id: '`grid-column: span 2` pada sebuah anak membuatnya melintasi dua jalur. Inilah satu-satunya tempat anak grid mendapat aturannya sendiri — sisanya tetap di wadahnya.',
              },
              code: {
                en: '<style>\n  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }\n  .grid div { background: #fed7aa; padding: 12px; }\n  .wide { grid-column: span 2; }\n</style>\n\n<div class="grid">\n  <div class="wide">spans two</div>\n  <div>one</div>\n  <div>one</div>\n</div>',
                id: '<style>\n  .kisi { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }\n  .kisi div { background: #fed7aa; padding: 12px; }\n  .lebar { grid-column: span 2; }\n</style>\n\n<div class="kisi">\n  <div class="lebar">melintasi dua</div>\n  <div>satu</div>\n  <div>satu</div>\n</div>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A grid that decides for itself', id: 'Kisi yang memutuskan sendiri' },
              body: {
                en: '`repeat(auto-fit, minmax(160px, 1fr))` means "fit as many columns as you can, each at least 160px". The number of columns then changes with the width, with no media query at all.',
                id: '`repeat(auto-fit, minmax(160px, 1fr))` berarti "muat sebanyak mungkin kolom, masing-masing minimal 160px". Jumlah kolomnya lalu berubah mengikuti lebar, tanpa media query sama sekali.',
              },
              code: {
                en: '<style>\n  .grid {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));\n    gap: 12px;\n  }\n  .grid div { background: #d9f99d; padding: 16px; }\n</style>\n\n<div class="grid">\n  <div>1</div><div>2</div><div>3</div><div>4</div>\n</div>',
                id: '<style>\n  .kisi {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));\n    gap: 12px;\n  }\n  .kisi div { background: #d9f99d; padding: 16px; }\n</style>\n\n<div class="kisi">\n  <div>1</div><div>2</div><div>3</div><div>4</div>\n</div>',
              },
              preview: true,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Where does `grid-column: span 2` go?',
                id: 'Di mana `grid-column: span 2` diletakkan?',
              },
              options: [
                { en: 'On the child that should be wider', id: 'Pada anak yang harus lebih lebar' },
                { en: 'On the grid container', id: 'Pada wadah grid-nya' },
                { en: 'On both', id: 'Pada keduanya' },
                { en: 'On the body', id: 'Pada body' },
              ],
              answer: 0,
              explain: {
                en: 'The container defines the tracks; a child says how many of them it wants.',
                id: 'Wadahnya menetapkan jalurnya; seorang anak menyatakan berapa jalur yang ia inginkan.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              html: {
                en: '<div class="grid">\n  <div class="highlight">Highlight</div>\n  <div class="cell">A</div>\n  <div class="cell">B</div>\n  <div class="cell">C</div>\n</div>',
                id: '<div class="kisi">\n  <div class="sorot">Sorotan</div>\n  <div class="sel">A</div>\n  <div class="sel">B</div>\n  <div class="sel">C</div>\n</div>',
              },
              prompt: {
                en: 'Give `.grid` three equal columns with a 12px gap, and make `.highlight` span all three.',
                id: 'Beri `.kisi` tiga kolom sama lebar dengan gap 12px, dan buat `.sorot` melintasi ketiganya.',
              },
              starter: '.grid {\n\n}\n',
              tests: {
                en: [
                  {
                    name: { en: 'Three equal columns', id: 'Three equal columns' },
                    check:
                      'assert(style(".grid", "display") === "grid", "display must be grid");\nvar k = style(".grid", "grid-template-columns").split(" ").map(parseFloat);\nassert(k.length === 3, "there must be three columns, read: " + k.length);\nassert(Math.abs(k[0] - k[2]) < 2, "all three columns must be equal width");',
                  },
                  {
                    name: { en: 'The highlight fills the first row', id: 'The highlight fills the first row' },
                    check:
                      'var grid = sel(".grid").getBoundingClientRect();\nvar highlight = sel(".highlight").getBoundingClientRect();\nassert(Math.abs(highlight.width - grid.width) < 3, ".highlight must be as wide as the grid — use span 3 (currently " + Math.round(highlight.width) + " of " + Math.round(grid.width) + ")");',
                  },
                  {
                    name: { en: 'The three cells share the second row', id: 'The three cells share the second row' },
                    check:
                      'var s = all(".cell");\nvar y = s.map(function (e) { return Math.round(e.getBoundingClientRect().top); });\nassert(y[0] === y[1] && y[1] === y[2], "A, B, C must be on one row");\nassert(y[0] > Math.round(sel(".highlight").getBoundingClientRect().top), "all three must be below the highlight");',
                  },
                ],
                id: [
                  {
                    name: { en: 'Three equal columns', id: 'Tiga kolom sama lebar' },
                    check:
                      'assert(style(".kisi", "display") === "grid", "display harus grid");\nvar k = style(".kisi", "grid-template-columns").split(" ").map(parseFloat);\nassert(k.length === 3, "harus tiga kolom, terbaca: " + k.length);\nassert(Math.abs(k[0] - k[2]) < 2, "ketiga kolom harus sama lebar");',
                  },
                  {
                    name: { en: 'The highlight fills the first row', id: 'Sorotannya memenuhi baris pertama' },
                    check:
                      'var kisi = sel(".kisi").getBoundingClientRect();\nvar sorot = sel(".sorot").getBoundingClientRect();\nassert(Math.abs(sorot.width - kisi.width) < 3, ".sorot harus selebar kisinya — gunakan span 3 (sekarang " + Math.round(sorot.width) + " dari " + Math.round(kisi.width) + ")");',
                  },
                  {
                    name: { en: 'The three cells share the second row', id: 'Ketiga sel berbagi baris kedua' },
                    check:
                      'var s = all(".sel");\nvar y = s.map(function (e) { return Math.round(e.getBoundingClientRect().top); });\nassert(y[0] === y[1] && y[1] === y[2], "A, B, C harus sebaris");\nassert(y[0] > Math.round(sel(".sorot").getBoundingClientRect().top), "ketiganya harus di bawah sorotan");',
                  },
                ],
              },
              hints: [
                { en: 'The container gets the tracks; .highlight gets the span.', id: 'Wadahnya mendapat jalurnya; .sorot mendapat span-nya.' },
                { en: 'grid-column: span 3;', id: 'grid-column: span 3;' },
              ],
              solution: {
                en: '.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 12px;\n}\n\n.highlight {\n  grid-column: span 3;\n}',
                id: '.kisi {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 12px;\n}\n\n.sorot {\n  grid-column: span 3;\n}',
              },
            },
          ],
        },
      ],
      project: {
        id: 'css-m3-s2-p',
        runtime: 'web',
        html: {
          en: '<div class="gallery">\n  <article class="card lead">\n    <h2>Python</h2>\n    <p>Nine modules, 1700 XP.</p>\n  </article>\n  <article class="card">\n    <h2>HTML</h2>\n    <p>Four modules.</p>\n  </article>\n  <article class="card">\n    <h2>CSS</h2>\n    <p>Four modules.</p>\n  </article>\n  <article class="card">\n    <h2>SQL</h2>\n    <p>Coming soon.</p>\n  </article>\n</div>',
          id: '<div class="galeri">\n  <article class="kartu utama">\n    <h2>Python</h2>\n    <p>Sembilan modul, 1700 XP.</p>\n  </article>\n  <article class="kartu">\n    <h2>HTML</h2>\n    <p>Empat modul.</p>\n  </article>\n  <article class="kartu">\n    <h2>CSS</h2>\n    <p>Empat modul.</p>\n  </article>\n  <article class="kartu">\n    <h2>SQL</h2>\n    <p>Segera hadir.</p>\n  </article>\n</div>',
        },
        title: { en: 'Card gallery', id: 'Galeri kartu' },
        brief: {
          en: 'A gallery where one card leads and the rest line up beneath it.',
          id: 'Galeri dengan satu kartu utama dan sisanya berjajar di bawahnya.',
        },
        requirements: [
          { en: '`box-sizing: border-box` for everything.', id: '`box-sizing: border-box` untuk semuanya.' },
          { en: '`.gallery` is a grid of three equal columns with a 16px gap.', id: '`.galeri` adalah kisi tiga kolom sama lebar dengan gap 16px.' },
          { en: '`.lead` spans all three columns.', id: '`.utama` melintasi ketiga kolom.' },
          { en: 'Each `.card` has 20px padding, a 1px solid `#e2e8f0` border, and a 12px radius.', id: 'Tiap `.kartu` berpadding 20px, border solid 1px `#e2e8f0`, dan radius 12px.' },
          { en: 'The `h2` inside a card has `margin-top: 0`.', id: '`h2` di dalam kartu ber-`margin-top: 0`.' },
        ],
        starter: '* {\n  box-sizing: border-box;\n}\n\n.gallery {\n\n}\n',
        tests: {
          en: [
            {
              name: { en: 'A three-column grid', id: 'A three-column grid' },
              check:
                'assert(style(".gallery", "display") === "grid", ".gallery display must be grid");\nvar k = style(".gallery", "grid-template-columns").split(" ").map(parseFloat);\nassert(k.length === 3, "there must be three columns, read: " + k.length);\nassert(Math.abs(k[0] - k[1]) < 2 && Math.abs(k[1] - k[2]) < 2, "all three columns must be equal width");',
            },
            {
              name: { en: 'A 16px gap between cards', id: 'A 16px gap between cards' },
              check:
                'var k = all(".card");\nvar b = k[1].getBoundingClientRect();\nvar c = k[2].getBoundingClientRect();\nvar gap = Math.round(c.left - b.right);\nassert(Math.abs(gap - 16) < 2, "the gap must be 16px, currently: " + gap + "px");',
            },
            {
              name: { en: 'The lead card spans the row', id: 'The lead card spans the row' },
              check:
                'var g = sel(".gallery").getBoundingClientRect();\nvar u = sel(".lead").getBoundingClientRect();\nassert(Math.abs(u.width - g.width) < 3, ".lead must be as wide as the gallery (currently " + Math.round(u.width) + " of " + Math.round(g.width) + ")");',
            },
            {
              name: { en: 'The other three share a row', id: 'The other three share a row' },
              check:
                'var rest = all(".card").filter(function (e) { return !e.classList.contains("lead"); });\nassert(rest.length === 3, "there should be three ordinary cards");\nvar y = rest.map(function (e) { return Math.round(e.getBoundingClientRect().top); });\nassert(y[0] === y[1] && y[1] === y[2], "all three must be on one row");',
            },
            {
              name: { en: 'Cards are padded and bordered', id: 'Cards are padded and bordered' },
              check:
                'assert(style(".card", "padding-top") === "20px", "card padding must be 20px");\nassert(style(".card", "border-top-width") === "1px", "card border must be 1px");\nassert(style(".card", "border-top-style") === "solid", "border style must be solid");\nassert(style(".card", "border-top-color") === "rgb(226, 232, 240)", "border color must be #e2e8f0");\nassert(style(".card", "border-top-left-radius") === "12px", "radius must be 12px");',
            },
            {
              name: { en: 'Card headings sit flush', id: 'Card headings sit flush' },
              check: 'assert(style(".card h2", "margin-top") === "0px", "the h2 margin-top inside a card must be 0");',
            },
          ],
          id: [
            {
              name: { en: 'A three-column grid', id: 'Kisi tiga kolom' },
              check:
                'assert(style(".galeri", "display") === "grid", "display .galeri harus grid");\nvar k = style(".galeri", "grid-template-columns").split(" ").map(parseFloat);\nassert(k.length === 3, "harus tiga kolom, terbaca: " + k.length);\nassert(Math.abs(k[0] - k[1]) < 2 && Math.abs(k[1] - k[2]) < 2, "ketiga kolom harus sama lebar");',
            },
            {
              name: { en: 'A 16px gap between cards', id: 'Jarak 16px antarkartu' },
              check:
                'var k = all(".kartu");\nvar b = k[1].getBoundingClientRect();\nvar c = k[2].getBoundingClientRect();\nvar jarak = Math.round(c.left - b.right);\nassert(Math.abs(jarak - 16) < 2, "gap harus 16px, sekarang: " + jarak + "px");',
            },
            {
              name: { en: 'The lead card spans the row', id: 'Kartu utamanya melintasi barisnya' },
              check:
                'var g = sel(".galeri").getBoundingClientRect();\nvar u = sel(".utama").getBoundingClientRect();\nassert(Math.abs(u.width - g.width) < 3, ".utama harus selebar galerinya (sekarang " + Math.round(u.width) + " dari " + Math.round(g.width) + ")");',
            },
            {
              name: { en: 'The other three share a row', id: 'Tiga sisanya berbagi satu baris' },
              check:
                'var lain = all(".kartu").filter(function (e) { return !e.classList.contains("utama"); });\nassert(lain.length === 3, "seharusnya ada tiga kartu biasa");\nvar y = lain.map(function (e) { return Math.round(e.getBoundingClientRect().top); });\nassert(y[0] === y[1] && y[1] === y[2], "ketiganya harus sebaris");',
            },
            {
              name: { en: 'Cards are padded and bordered', id: 'Kartunya berpadding dan berborder' },
              check:
                'assert(style(".kartu", "padding-top") === "20px", "padding kartu harus 20px");\nassert(style(".kartu", "border-top-width") === "1px", "border kartu harus 1px");\nassert(style(".kartu", "border-top-style") === "solid", "gaya border harus solid");\nassert(style(".kartu", "border-top-color") === "rgb(226, 232, 240)", "warna border harus #e2e8f0");\nassert(style(".kartu", "border-top-left-radius") === "12px", "radius harus 12px");',
            },
            {
              name: { en: 'Card headings sit flush', id: 'Judul kartunya rapat' },
              check: 'assert(style(".kartu h2", "margin-top") === "0px", "margin-top h2 di dalam kartu harus 0");',
            },
          ],
        },
        hints: [
          { en: 'Only .lead needs a rule of its own — everything else is on the container or on .card.', id: 'Hanya .utama yang butuh aturan sendiri — sisanya di wadahnya atau di .kartu.' },
          { en: 'Because .lead also carries the class .card, it inherits the card styling for free.', id: 'Karena .utama juga membawa class .kartu, ia mewarisi gaya kartunya secara cuma-cuma.' },
          { en: 'Four rules: *, .gallery, .lead, .card — plus one for the heading.', id: 'Empat aturan: *, .galeri, .utama, .kartu — ditambah satu untuk judulnya.' },
        ],
        solution: {
          en: '* {\n  box-sizing: border-box;\n}\n\n.gallery {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}\n\n.lead {\n  grid-column: span 3;\n}\n\n.card {\n  padding: 20px;\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n}\n\n.card h2 {\n  margin-top: 0;\n}',
          id: '* {\n  box-sizing: border-box;\n}\n\n.galeri {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}\n\n.utama {\n  grid-column: span 3;\n}\n\n.kartu {\n  padding: 20px;\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n}\n\n.kartu h2 {\n  margin-top: 0;\n}',
        },
        xp: 50,
      },
    },
  ],
}
