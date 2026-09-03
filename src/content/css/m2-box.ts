import type { Module } from '../types'

/** Module 2 — the box model, which is where most "why is it not moving?"
 *  frustration comes from, and the display values that decide how boxes flow. */
export const module2: Module = {
  id: 'css-m2',
  title: { en: 'The Box Model', id: 'Model Kotak' },
  summary: {
    en: 'Every element is a box. Learn its four layers, and how boxes sit together.',
    id: 'Setiap elemen adalah kotak. Pelajari empat lapisannya, dan bagaimana kotak-kotak itu berdampingan.',
  },
  submodules: [
    /* ------------------------------------------------------- 2.1 the four layers */
    {
      id: 'css-m2-s1',
      title: { en: 'Padding, Border, Margin', id: 'Padding, Border, Margin' },
      summary: {
        en: 'Space inside, the line around, and space outside.',
        id: 'Ruang di dalam, garis di sekelilingnya, dan ruang di luar.',
      },
      lessons: [
        {
          id: 'css-m2-s1-l1',
          title: { en: 'Inside, edge, outside', id: 'Dalam, tepi, luar' },
          goal: { en: 'Space an element out.', id: 'Memberi ruang pada sebuah elemen.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Four layers, from the middle out', id: 'Empat lapis, dari tengah ke luar' },
              body: {
                en: 'The content sits in the middle. **Padding** is space between the content and the border. **Border** is the line itself. **Margin** is space outside, pushing other elements away. Padding is inside the background; margin is not.',
                id: 'Isinya ada di tengah. **Padding** adalah ruang antara isi dan border. **Border** adalah garisnya sendiri. **Margin** adalah ruang di luar, yang mendorong elemen lain menjauh. Padding berada di dalam latar; margin tidak.',
              },
              code: {
                en: '<style>\n  .box {\n    background: lightblue;\n    padding: 20px;\n    border: 4px solid navy;\n    margin: 24px;\n  }\n</style>\n\n<div class="box">Notice: the blue background covers the padding, not the margin.</div>',
                id: '<style>\n  .kotak {\n    background: lightblue;\n    padding: 20px;\n    border: 4px solid navy;\n    margin: 24px;\n  }\n</style>\n\n<div class="kotak">Perhatikan: latar birunya mencakup padding, bukan margin.</div>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'One value, or four', id: 'Satu nilai, atau empat' },
              body: {
                en: '`padding: 10px` sets all four sides. Two values are vertical then horizontal — `padding: 10px 20px`. Four values run clockwise from the top. You can also name one side: `padding-left`.',
                id: '`padding: 10px` menyetel keempat sisi. Dua nilai berarti vertikal lalu horizontal — `padding: 10px 20px`. Empat nilai berjalan searah jarum jam mulai dari atas. Kamu juga bisa menyebut satu sisi saja: `padding-left`.',
              },
              code: {
                en: '<style>\n  .a { padding: 8px 32px; background: #fde68a; }\n  .b { padding-left: 48px; background: #bbf7d0; }\n</style>\n\n<p class="a">Narrow top-bottom, wide left-right.</p>\n<p class="b">Only the left is indented.</p>',
                id: '<style>\n  .a { padding: 8px 32px; background: #fde68a; }\n  .b { padding-left: 48px; background: #bbf7d0; }\n</style>\n\n<p class="a">Sempit di atas-bawah, lebar di kiri-kanan.</p>\n<p class="b">Hanya kiri yang menjorok.</p>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'A border needs three things', id: 'Border butuh tiga hal' },
              body: {
                en: '`border: 2px solid black` is width, style, colour. Miss out the style and nothing appears — `solid` is not the default, `none` is. `border-radius` then rounds the corners.',
                id: '`border: 2px solid black` adalah lebar, gaya, warna. Lupakan gayanya dan tidak ada yang muncul — `solid` bukan nilai bawaan, `none`-lah yang bawaan. `border-radius` kemudian membulatkan sudutnya.',
              },
              code: {
                en: '<style>\n  .card {\n    border: 2px solid #94a3b8;\n    border-radius: 12px;\n    padding: 16px;\n  }\n</style>\n\n<div class="card">Rounded corners.</div>',
                id: '<style>\n  .kartu {\n    border: 2px solid #94a3b8;\n    border-radius: 12px;\n    padding: 16px;\n  }\n</style>\n\n<div class="kartu">Sudut membulat.</div>',
              },
              preview: true,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'You want space between an element\'s text and its coloured background. Which?',
                id: 'Kamu ingin ruang antara teks elemen dan latar berwarnanya. Yang mana?',
              },
              options: [
                { en: 'padding', id: 'padding' },
                { en: 'margin', id: 'margin' },
                { en: 'border', id: 'border' },
                { en: 'line-height', id: 'line-height' },
              ],
              answer: 0,
              explain: {
                en: 'Padding is inside the background. Margin would push the whole coloured box away instead.',
                id: 'Padding berada di dalam latar. Margin justru akan mendorong seluruh kotak berwarnanya menjauh.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: { en: 'Draw a 3px dashed red border.', id: 'Gambar border merah putus-putus setebal 3px.' },
              template: {
                en: '.box {\n  border: 3px ___ red;\n}',
                id: '.kotak {\n  border: 3px ___ red;\n}',
              },
              blanks: ['dashed'],
              explain: {
                en: 'The middle value is the style — solid, dashed, dotted, and so on.',
                id: 'Nilai tengahnya adalah gayanya — solid, dashed, dotted, dan seterusnya.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              html: {
                en: '<div class="warning">Assignment due tomorrow.</div>',
                id: '<div class="peringatan">Tugas dikumpulkan besok.</div>',
              },
              prompt: {
                en: 'Give `.warning` 16px of padding, a 2px solid `#f59e0b` border, an 8px radius, and 24px of margin.',
                id: 'Beri `.peringatan` padding 16px, border solid 2px `#f59e0b`, radius 8px, dan margin 24px.',
              },
              starter: '.warning {\n\n}\n',
              tests: {
                en: [
                  {
                    name: { en: 'Padding on all four sides', id: 'Padding on all four sides' },
                    check:
                      '["top", "right", "bottom", "left"].forEach(function (s) {\n  assert(style(".warning", "padding-" + s) === "16px", "padding-" + s + " must be 16px, currently: " + style(".warning", "padding-" + s));\n});',
                  },
                  {
                    name: { en: 'A visible amber border', id: 'A visible amber border' },
                    check:
                      'assert(style(".warning", "border-top-width") === "2px", "border must be 2px");\nassert(style(".warning", "border-top-style") === "solid", "border style must be solid");\nassert(style(".warning", "border-top-color") === "rgb(245, 158, 11)", "border color must be #f59e0b, currently: " + style(".warning", "border-top-color"));',
                  },
                  {
                    name: { en: 'Rounded corners and outer space', id: 'Rounded corners and outer space' },
                    check:
                      'assert(style(".warning", "border-top-left-radius") === "8px", "border-radius must be 8px");\nassert(style(".warning", "margin-top") === "24px", "margin must be 24px, currently: " + style(".warning", "margin-top"));',
                  },
                ],
                id: [
                  {
                    name: { en: 'Padding on all four sides', id: 'Padding di keempat sisi' },
                    check:
                      '["top", "right", "bottom", "left"].forEach(function (s) {\n  assert(style(".peringatan", "padding-" + s) === "16px", "padding-" + s + " harus 16px, sekarang: " + style(".peringatan", "padding-" + s));\n});',
                  },
                  {
                    name: { en: 'A visible amber border', id: 'Border kuning yang terlihat' },
                    check:
                      'assert(style(".peringatan", "border-top-width") === "2px", "border harus 2px");\nassert(style(".peringatan", "border-top-style") === "solid", "gaya border harus solid");\nassert(style(".peringatan", "border-top-color") === "rgb(245, 158, 11)", "warna border harus #f59e0b, sekarang: " + style(".peringatan", "border-top-color"));',
                  },
                  {
                    name: { en: 'Rounded corners and outer space', id: 'Sudut membulat dan ruang luar' },
                    check:
                      'assert(style(".peringatan", "border-top-left-radius") === "8px", "border-radius harus 8px");\nassert(style(".peringatan", "margin-top") === "24px", "margin harus 24px, sekarang: " + style(".peringatan", "margin-top"));',
                  },
                ],
              },
              hints: [
                { en: 'Four declarations in one rule.', id: 'Empat deklarasi dalam satu aturan.' },
                { en: 'The border shorthand takes width, style, colour — in that order.', id: 'Singkatan border menerima lebar, gaya, warna — dalam urutan itu.' },
              ],
              solution: {
                en: '.warning {\n  padding: 16px;\n  border: 2px solid #f59e0b;\n  border-radius: 8px;\n  margin: 24px;\n}',
                id: '.peringatan {\n  padding: 16px;\n  border: 2px solid #f59e0b;\n  border-radius: 8px;\n  margin: 24px;\n}',
              },
            },
          ],
        },
        {
          id: 'css-m2-s1-l2',
          title: { en: 'Width, and where it goes wrong', id: 'Lebar, dan di mana ia meleset' },
          goal: { en: 'Size a box predictably.', id: 'Mengatur ukuran kotak agar terduga.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'width does not mean total width', id: 'width bukan berarti lebar total' },
              body: {
                en: 'By default `width: 300px` sizes the **content**, and padding and border are added on top. Give that box 20px of padding and a 2px border and it occupies 344px. This surprises everyone once.',
                id: 'Secara bawaan `width: 300px` mengatur **isinya**, dan padding serta border ditambahkan di atasnya. Beri kotak itu padding 20px dan border 2px, maka ia memakan 344px. Ini mengejutkan semua orang, sekali.',
              },
              code: {
                en: '<style>\n  .default {\n    width: 300px;\n    padding: 20px;\n    border: 2px solid navy;\n    background: #dbeafe;\n  }\n</style>\n\n<div class="default">Content width 300px, total 344px.</div>',
                id: '<style>\n  .bawaan {\n    width: 300px;\n    padding: 20px;\n    border: 2px solid navy;\n    background: #dbeafe;\n  }\n</style>\n\n<div class="bawaan">Lebar isi 300px, total 344px.</div>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'border-box makes width mean width', id: 'border-box membuat width berarti lebar' },
              body: {
                en: '`box-sizing: border-box` tells the browser to include padding and border **inside** the number you gave. Most projects set it once for everything and never think about it again.',
                id: '`box-sizing: border-box` menyuruh peramban memasukkan padding dan border **ke dalam** angka yang kamu beri. Sebagian besar proyek menyetelnya sekali untuk semuanya dan tak pernah memikirkannya lagi.',
              },
              code: {
                en: '<style>\n  * { box-sizing: border-box; }\n  .tidy {\n    width: 300px;\n    padding: 20px;\n    border: 2px solid navy;\n    background: #dcfce7;\n  }\n</style>\n\n<div class="tidy">Total exactly 300px.</div>',
                id: '<style>\n  * { box-sizing: border-box; }\n  .rapi {\n    width: 300px;\n    padding: 20px;\n    border: 2px solid navy;\n    background: #dcfce7;\n  }\n</style>\n\n<div class="rapi">Total tepat 300px.</div>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'max-width beats width on small screens', id: 'max-width mengalahkan width di layar kecil' },
              body: {
                en: 'A fixed `width: 600px` overflows a 400px phone. `max-width: 600px` means "600 at most, but shrink when you must" — one word that removes a whole class of mobile bug.',
                id: '`width: 600px` yang kaku akan meluber di ponsel selebar 400px. `max-width: 600px` berarti "paling banyak 600, tapi menyusutlah bila perlu" — satu kata yang menghapus satu golongan bug mobile.',
              },
              code: {
                en: '<style>\n  .content {\n    max-width: 600px;\n    background: #ede9fe;\n    padding: 12px;\n  }\n</style>\n\n<div class="content">Shrinks to fit a narrow screen, stops growing at 600px.</div>',
                id: '<style>\n  .isi {\n    max-width: 600px;\n    background: #ede9fe;\n    padding: 12px;\n  }\n</style>\n\n<div class="isi">Menyusut mengikuti layar sempit, berhenti tumbuh di 600px.</div>',
              },
              preview: true,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'With the default box-sizing, how wide is a box with width 200px, padding 10px, border 5px?',
                id: 'Dengan box-sizing bawaan, berapa lebar total kotak ber-width 200px, padding 10px, border 5px?',
              },
              options: [
                { en: '230px', id: '230px' },
                { en: '200px', id: '200px' },
                { en: '215px', id: '215px' },
                { en: '220px', id: '220px' },
              ],
              answer: 0,
              explain: {
                en: '200 + 10 + 10 + 5 + 5. Padding and border are counted on both sides.',
                id: '200 + 10 + 10 + 5 + 5. Padding dan border dihitung di kedua sisi.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              html: {
                en: '<div class="card">A card with predictable width.</div>',
                id: '<div class="kartu">Kartu dengan lebar yang bisa diprediksi.</div>',
              },
              prompt: {
                en: 'Set `box-sizing: border-box` on every element, then give `.card` a width of 320px, 24px of padding, and a 1px solid `#cbd5e1` border — so its total width really is 320px.',
                id: 'Setel `box-sizing: border-box` untuk semua elemen, lalu beri `.kartu` lebar 320px, padding 24px, dan border solid 1px `#cbd5e1` — sehingga lebar totalnya benar-benar 320px.',
              },
              starter: '* {\n\n}\n\n.card {\n\n}\n',
              tests: {
                en: [
                  {
                    name: { en: 'border-box is switched on', id: 'border-box is switched on' },
                    check: 'assert(style(".card", "box-sizing") === "border-box", "box-sizing must be border-box, currently: " + style(".card", "box-sizing"));',
                  },
                  {
                    name: { en: 'The card measures 320px in total', id: 'The card measures 320px in total' },
                    check:
                      'var w = sel(".card").getBoundingClientRect().width;\nassert(Math.abs(w - 320) < 1, "total width must be 320px, currently: " + Math.round(w) + "px");',
                  },
                  {
                    name: { en: 'Padding and border are as asked', id: 'Padding and border are as asked' },
                    check:
                      'assert(style(".card", "padding-left") === "24px", "padding must be 24px");\nassert(style(".card", "border-left-width") === "1px", "border must be 1px");\nassert(style(".card", "border-left-color") === "rgb(203, 213, 225)", "border color must be #cbd5e1");',
                  },
                ],
                id: [
                  {
                    name: { en: 'border-box is switched on', id: 'border-box menyala' },
                    check: 'assert(style(".kartu", "box-sizing") === "border-box", "box-sizing harus border-box, sekarang: " + style(".kartu", "box-sizing"));',
                  },
                  {
                    name: { en: 'The card measures 320px in total', id: 'Kartunya berukuran total 320px' },
                    check:
                      'var w = sel(".kartu").getBoundingClientRect().width;\nassert(Math.abs(w - 320) < 1, "lebar total harus 320px, sekarang: " + Math.round(w) + "px");',
                  },
                  {
                    name: { en: 'Padding and border are as asked', id: 'Padding dan border sesuai permintaan' },
                    check:
                      'assert(style(".kartu", "padding-left") === "24px", "padding harus 24px");\nassert(style(".kartu", "border-left-width") === "1px", "border harus 1px");\nassert(style(".kartu", "border-left-color") === "rgb(203, 213, 225)", "warna border harus #cbd5e1");',
                  },
                ],
              },
              hints: [
                { en: 'The universal selector `*` applies to everything.', id: 'Selektor universal `*` berlaku untuk semuanya.' },
                { en: 'With border-box, you write width: 320px and the browser does the arithmetic.', id: 'Dengan border-box, kamu cukup menulis width: 320px dan peramban yang berhitung.' },
              ],
              solution: {
                en: '* {\n  box-sizing: border-box;\n}\n\n.card {\n  width: 320px;\n  padding: 24px;\n  border: 1px solid #cbd5e1;\n}',
                id: '* {\n  box-sizing: border-box;\n}\n\n.kartu {\n  width: 320px;\n  padding: 24px;\n  border: 1px solid #cbd5e1;\n}',
              },
            },
          ],
        },
      ],
      project: {
        id: 'css-m2-s1-p',
        runtime: 'web',
        html: {
          en: '<div class="profile">\n  <h2 class="name">Nunada</h2>\n  <p class="role">Teacher and developer</p>\n  <p class="bio">Building Nunada Academy, a learn-to-code app.</p>\n</div>',
          id: '<div class="profil">\n  <h2 class="nama">Nunada</h2>\n  <p class="peran">Pengajar dan pengembang</p>\n  <p class="bio">Sedang membangun Nunada Academy, sebuah aplikasi belajar coding.</p>\n</div>',
        },
        title: { en: 'Profile card', id: 'Kartu profil' },
        brief: {
          en: 'A card with predictable width, breathing room, and a soft edge.',
          id: 'Kartu dengan lebar yang terduga, ruang yang lega, dan tepi yang lembut.',
        },
        requirements: [
          { en: '`box-sizing: border-box` for every element.', id: '`box-sizing: border-box` untuk semua elemen.' },
          { en: '`.profile` is 360px wide with 28px of padding.', id: '`.profil` selebar 360px dengan padding 28px.' },
          { en: 'A 1px solid `#e2e8f0` border and a 16px radius.', id: 'Border solid 1px `#e2e8f0` dan radius 16px.' },
          { en: 'A `#f8fafc` background.', id: 'Latar `#f8fafc`.' },
          { en: '`.name` has no space above it (`margin-top: 0`).', id: '`.nama` tanpa ruang di atasnya (`margin-top: 0`).' },
          { en: '`.role` is `#64748b`; `.bio` has a line-height of 1.6.', id: '`.peran` berwarna `#64748b`; `.bio` ber-line-height 1,6.' },
        ],
        starter: '* {\n  box-sizing: border-box;\n}\n\n.profile {\n\n}\n',
        tests: {
          en: [
            {
              name: { en: 'The card is exactly 360px', id: 'The card is exactly 360px' },
              check:
                'assert(style(".profile", "box-sizing") === "border-box", "box-sizing must be border-box");\nvar w = sel(".profile").getBoundingClientRect().width;\nassert(Math.abs(w - 360) < 1, "total width must be 360px, currently: " + Math.round(w) + "px");',
            },
            {
              name: { en: 'Padding, border, radius', id: 'Padding, border, radius' },
              check:
                'assert(style(".profile", "padding-top") === "28px", "padding must be 28px");\nassert(style(".profile", "border-top-width") === "1px", "border must be 1px");\nassert(style(".profile", "border-top-style") === "solid", "border style must be solid");\nassert(style(".profile", "border-top-color") === "rgb(226, 232, 240)", "border color must be #e2e8f0");\nassert(style(".profile", "border-top-left-radius") === "16px", "radius must be 16px");',
            },
            {
              name: { en: 'The card has a background', id: 'The card has a background' },
              check: 'assert(style(".profile", "background-color") === "rgb(248, 250, 252)", "background must be #f8fafc, currently: " + style(".profile", "background-color"));',
            },
            {
              name: { en: 'The name sits flush with the padding', id: 'The name sits flush with the padding' },
              check: 'assert(style(".name", "margin-top") === "0px", ".name margin-top must be 0, currently: " + style(".name", "margin-top"));',
            },
            {
              name: { en: 'Role colour and bio spacing', id: 'Role colour and bio spacing' },
              check:
                'assert(style(".role", "color") === "rgb(100, 116, 139)", ".role color must be #64748b");\nvar fs = parseFloat(style(".bio", "font-size"));\nvar lh = parseFloat(style(".bio", "line-height"));\nassert(Math.abs(lh - fs * 1.6) < 1.5, ".bio line-height must be 1.6, currently: " + style(".bio", "line-height"));',
            },
          ],
          id: [
            {
              name: { en: 'The card is exactly 360px', id: 'Kartunya tepat 360px' },
              check:
                'assert(style(".profil", "box-sizing") === "border-box", "box-sizing harus border-box");\nvar w = sel(".profil").getBoundingClientRect().width;\nassert(Math.abs(w - 360) < 1, "lebar total harus 360px, sekarang: " + Math.round(w) + "px");',
            },
            {
              name: { en: 'Padding, border, radius', id: 'Padding, border, radius' },
              check:
                'assert(style(".profil", "padding-top") === "28px", "padding harus 28px");\nassert(style(".profil", "border-top-width") === "1px", "border harus 1px");\nassert(style(".profil", "border-top-style") === "solid", "gaya border harus solid");\nassert(style(".profil", "border-top-color") === "rgb(226, 232, 240)", "warna border harus #e2e8f0");\nassert(style(".profil", "border-top-left-radius") === "16px", "radius harus 16px");',
            },
            {
              name: { en: 'The card has a background', id: 'Kartunya berlatar' },
              check: 'assert(style(".profil", "background-color") === "rgb(248, 250, 252)", "latar harus #f8fafc, sekarang: " + style(".profil", "background-color"));',
            },
            {
              name: { en: 'The name sits flush with the padding', id: 'Namanya rapat dengan paddingnya' },
              check: 'assert(style(".nama", "margin-top") === "0px", "margin-top .nama harus 0, sekarang: " + style(".nama", "margin-top"));',
            },
            {
              name: { en: 'Role colour and bio spacing', id: 'Warna peran dan jarak bio' },
              check:
                'assert(style(".peran", "color") === "rgb(100, 116, 139)", "warna .peran harus #64748b");\nvar fs = parseFloat(style(".bio", "font-size"));\nvar lh = parseFloat(style(".bio", "line-height"));\nassert(Math.abs(lh - fs * 1.6) < 1.5, "line-height .bio harus 1.6, sekarang: " + style(".bio", "line-height"));',
            },
          ],
        },
        hints: [
          { en: 'Start from the card, then style the three children.', id: 'Mulai dari kartunya, lalu beri gaya tiga anaknya.' },
          { en: 'Headings carry a default margin-top — that is why the requirement asks for 0.', id: 'Judul membawa margin-top bawaan — itulah sebabnya syaratnya meminta 0.' },
          { en: 'Five rules is plenty: *, .profile, .name, .role, .bio.', id: 'Lima aturan sudah cukup: *, .profil, .nama, .peran, .bio.' },
        ],
        solution: {
          en: '* {\n  box-sizing: border-box;\n}\n\n.profile {\n  width: 360px;\n  padding: 28px;\n  border: 1px solid #e2e8f0;\n  border-radius: 16px;\n  background-color: #f8fafc;\n}\n\n.name {\n  margin-top: 0;\n}\n\n.role {\n  color: #64748b;\n}\n\n.bio {\n  line-height: 1.6;\n}',
          id: '* {\n  box-sizing: border-box;\n}\n\n.profil {\n  width: 360px;\n  padding: 28px;\n  border: 1px solid #e2e8f0;\n  border-radius: 16px;\n  background-color: #f8fafc;\n}\n\n.nama {\n  margin-top: 0;\n}\n\n.peran {\n  color: #64748b;\n}\n\n.bio {\n  line-height: 1.6;\n}',
        },
        xp: 50,
      },
    },

    /* ------------------------------------------------------------ 2.2 display */
    {
      id: 'css-m2-s2',
      title: { en: 'How Boxes Flow', id: 'Bagaimana Kotak Mengalir' },
      summary: {
        en: 'Block, inline, and how to centre something.',
        id: 'Block, inline, dan cara memusatkan sesuatu.',
      },
      lessons: [
        {
          id: 'css-m2-s2-l1',
          title: { en: 'Block and inline', id: 'Block dan inline' },
          goal: { en: 'Know why some elements stack and others sit in a row.', id: 'Memahami kenapa sebagian elemen bertumpuk dan sebagian berjajar.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Two default behaviours', id: 'Dua perilaku bawaan' },
              body: {
                en: 'A **block** element — `div`, `p`, `h1` — takes the full width and starts a new line. An **inline** element — `a`, `span`, `strong` — flows in the text and is only as wide as its content. Width and vertical margin do nothing on an inline element.',
                id: 'Elemen **block** — `div`, `p`, `h1` — mengambil lebar penuh dan memulai baris baru. Elemen **inline** — `a`, `span`, `strong` — mengalir di dalam teks dan hanya selebar isinya. Width dan margin vertikal tidak berpengaruh pada elemen inline.',
              },
              code: '<style>\n  span { background: #fecaca; }\n  div  { background: #bfdbfe; }\n</style>\n\n<span>inline</span> <span>inline</span>\n<div>block</div>\n<div>block</div>',
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'inline-block takes both', id: 'inline-block mengambil keduanya' },
              body: {
                en: '`display: inline-block` flows in a row like inline, but accepts width, height and vertical padding like a block. It is the old way to lay out a row of boxes — flexbox does it better, and comes next module.',
                id: '`display: inline-block` mengalir berjajar seperti inline, tetapi menerima width, height, dan padding vertikal seperti block. Ini cara lama menata sederet kotak — flexbox melakukannya lebih baik, dan hadir di modul berikutnya.',
              },
              code: {
                en: '<style>\n  .button {\n    display: inline-block;\n    width: 120px;\n    padding: 10px;\n    background: #a7f3d0;\n    text-align: center;\n  }\n</style>\n\n<span class="button">One</span>\n<span class="button">Two</span>',
                id: '<style>\n  .tombol {\n    display: inline-block;\n    width: 120px;\n    padding: 10px;\n    background: #a7f3d0;\n    text-align: center;\n  }\n</style>\n\n<span class="tombol">Satu</span>\n<span class="tombol">Dua</span>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'none removes it entirely', id: 'none menghapusnya sama sekali' },
              body: {
                en: '`display: none` takes the element out of the page as if it were never there. That differs from `visibility: hidden`, which keeps its space empty. Screen readers skip `display: none` too — useful, and easy to misuse.',
                id: '`display: none` mengeluarkan elemen dari halaman seolah ia tak pernah ada. Ini berbeda dari `visibility: hidden`, yang menyisakan ruangnya kosong. Pembaca layar juga melewati `display: none` — berguna, dan mudah disalahgunakan.',
              },
              code: {
                en: '<style>\n  .hide { display: none; }\n</style>\n\n<p>Visible.</p>\n<p class="hide">Never appears.</p>\n<p>Visible too.</p>',
                id: '<style>\n  .sembunyi { display: none; }\n</style>\n\n<p>Terlihat.</p>\n<p class="sembunyi">Tidak pernah muncul.</p>\n<p>Terlihat juga.</p>',
              },
              preview: true,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'You set `width: 200px` on a `<span>` and nothing happens. Why?',
                id: 'Kamu menyetel `width: 200px` pada sebuah `<span>` dan tidak terjadi apa-apa. Kenapa?',
              },
              options: [
                { en: 'It is inline — width does not apply', id: 'Ia inline — width tidak berlaku' },
                { en: 'The value needs a unit', id: 'Nilainya butuh satuan' },
                { en: 'span cannot be styled', id: 'span tidak bisa diberi gaya' },
                { en: 'You need !important', id: 'Kamu butuh !important' },
              ],
              answer: 0,
              explain: {
                en: 'An inline box is as wide as its content. Switch it to inline-block or block first.',
                id: 'Kotak inline hanya selebar isinya. Ubah dulu ke inline-block atau block.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              html: {
                en: '<span class="badge">Python</span>\n<span class="badge">HTML</span>\n<span class="badge">CSS</span>\n<p class="draft">Not ready to publish.</p>',
                id: '<span class="lencana">Python</span>\n<span class="lencana">HTML</span>\n<span class="lencana">CSS</span>\n<p class="draf">Belum siap tayang.</p>',
              },
              prompt: {
                en: 'Make every `.badge` an inline-block 100px wide with 8px of padding and a `#e0e7ff` background, and hide `.draft` completely.',
                id: 'Buat tiap `.lencana` menjadi inline-block selebar 100px dengan padding 8px dan latar `#e0e7ff`, lalu sembunyikan `.draf` sepenuhnya.',
              },
              starter: '',
              tests: {
                en: [
                  {
                    name: { en: 'Badges are inline-block and sized', id: 'Badges are inline-block and sized' },
                    check:
                      'assert(style(".badge", "display") === "inline-block", ".badge display must be inline-block, currently: " + style(".badge", "display"));\nassert(style(".badge", "width") === "100px", ".badge width must be 100px");\nassert(style(".badge", "padding-top") === "8px", ".badge padding must be 8px");',
                  },
                  {
                    name: { en: 'They sit in one row', id: 'They sit in one row' },
                    check:
                      'var b = all(".badge");\nassert(b.length === 3, "there should be three badges");\nvar y = b.map(function (e) { return Math.round(e.getBoundingClientRect().top); });\nassert(y[0] === y[1] && y[1] === y[2], "all three must be on one row — check the display");',
                  },
                  {
                    name: { en: 'The draft is gone', id: 'The draft is gone' },
                    check:
                      'assert(style(".draft", "display") === "none", ".draft must be display: none");\nassert(sel(".draft").getBoundingClientRect().height === 0, ".draft must not take up space");',
                  },
                ],
                id: [
                  {
                    name: { en: 'Badges are inline-block and sized', id: 'Lencananya inline-block dan berukuran' },
                    check:
                      'assert(style(".lencana", "display") === "inline-block", "display .lencana harus inline-block, sekarang: " + style(".lencana", "display"));\nassert(style(".lencana", "width") === "100px", "lebar .lencana harus 100px");\nassert(style(".lencana", "padding-top") === "8px", "padding .lencana harus 8px");',
                  },
                  {
                    name: { en: 'They sit in one row', id: 'Ketiganya berjajar satu baris' },
                    check:
                      'var b = all(".lencana");\nassert(b.length === 3, "seharusnya ada tiga lencana");\nvar y = b.map(function (e) { return Math.round(e.getBoundingClientRect().top); });\nassert(y[0] === y[1] && y[1] === y[2], "ketiganya harus sebaris — periksa display-nya");',
                  },
                  {
                    name: { en: 'The draft is gone', id: 'Draf-nya lenyap' },
                    check:
                      'assert(style(".draf", "display") === "none", ".draf harus display: none");\nassert(sel(".draf").getBoundingClientRect().height === 0, ".draf tidak boleh memakan ruang");',
                  },
                ],
              },
              hints: [
                { en: 'A span will not accept a width until its display changes.', id: 'Sebuah span tidak menerima width sampai display-nya diubah.' },
                { en: 'Two rules: one for .badge, one for .draft.', id: 'Dua aturan: satu untuk .lencana, satu untuk .draf.' },
              ],
              solution: {
                en: '.badge {\n  display: inline-block;\n  width: 100px;\n  padding: 8px;\n  background-color: #e0e7ff;\n}\n\n.draft {\n  display: none;\n}',
                id: '.lencana {\n  display: inline-block;\n  width: 100px;\n  padding: 8px;\n  background-color: #e0e7ff;\n}\n\n.draf {\n  display: none;\n}',
              },
            },
          ],
        },
        {
          id: 'css-m2-s2-l2',
          title: { en: 'Centring a box', id: 'Memusatkan sebuah kotak' },
          goal: { en: 'Put a block in the middle of the page.', id: 'Menaruh sebuah block di tengah halaman.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'text-align centres text, not boxes', id: 'text-align memusatkan teks, bukan kotak' },
              body: {
                en: 'This is the single most common mix-up in CSS. `text-align: center` on a box centres the *words inside it*. The box itself stays exactly where it was, still full width.',
                id: 'Ini kekeliruan paling umum dalam CSS. `text-align: center` pada sebuah kotak memusatkan *kata-kata di dalamnya*. Kotaknya sendiri tetap di tempatnya, tetap selebar penuh.',
              },
              code: {
                en: '<style>\n  .box { width: 200px; background: #fca5a5; text-align: center; }\n</style>\n\n<div class="box">Text centred, box still on the left.</div>',
                id: '<style>\n  .kotak { width: 200px; background: #fca5a5; text-align: center; }\n</style>\n\n<div class="kotak">Teks di tengah, kotak tetap di kiri.</div>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A width plus auto margins', id: 'Sebuah width ditambah margin auto' },
              body: {
                en: 'To centre the box, give it a width and let the left and right margins share what is left: `margin: 0 auto`. Without a width there is nothing left over, so nothing moves.',
                id: 'Untuk memusatkan kotaknya, beri ia lebar dan biarkan margin kiri-kanan berbagi sisanya: `margin: 0 auto`. Tanpa lebar, tidak ada sisa, jadi tidak ada yang bergeser.',
              },
              code: {
                en: '<style>\n  .box {\n    width: 200px;\n    margin: 0 auto;\n    background: #86efac;\n  }\n</style>\n\n<div class="box">The box itself is now centred.</div>',
                id: '<style>\n  .kotak {\n    width: 200px;\n    margin: 0 auto;\n    background: #86efac;\n  }\n</style>\n\n<div class="kotak">Kotaknya sendiri kini di tengah.</div>',
              },
              preview: true,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: '`margin: 0 auto` does nothing to your div. What is most likely missing?',
                id: '`margin: 0 auto` tidak berpengaruh pada div-mu. Apa yang paling mungkin belum ada?',
              },
              options: [
                { en: 'A width — there is no leftover space to share', id: 'Sebuah width — tidak ada sisa ruang untuk dibagi' },
                { en: 'text-align: center', id: 'text-align: center' },
                { en: 'display: inline', id: 'display: inline' },
                { en: 'padding', id: 'padding' },
              ],
              answer: 0,
              explain: {
                en: 'A block already fills its parent. Auto margins can only centre a box narrower than the space available.',
                id: 'Sebuah block sudah memenuhi induknya. Margin auto hanya bisa memusatkan kotak yang lebih sempit dari ruang yang ada.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              html: {
                en: '<div class="container">\n  <h1>Centered Title</h1>\n  <p>The box sits in the middle of the page, and so does the text.</p>\n</div>',
                id: '<div class="wadah">\n  <h1>Judul di Tengah</h1>\n  <p>Kotaknya berada di tengah halaman, dan teksnya juga.</p>\n</div>',
              },
              prompt: {
                en: 'Centre `.container` on the page with a max-width of 400px, and centre the text inside it too.',
                id: 'Pusatkan `.wadah` di halaman dengan max-width 400px, dan pusatkan juga teks di dalamnya.',
              },
              starter: '.container {\n\n}\n',
              tests: {
                en: [
                  {
                    name: { en: 'It is no wider than 400px', id: 'It is no wider than 400px' },
                    check:
                      'assert(style(".container", "max-width") === "400px", "max-width must be 400px, currently: " + style(".container", "max-width"));\nvar w = sel(".container").getBoundingClientRect().width;\nassert(w <= 401, "width must not exceed 400px, currently: " + Math.round(w));',
                  },
                  {
                    name: { en: 'The box itself is centred', id: 'The box itself is centred' },
                    check:
                      'var r = sel(".container").getBoundingClientRect();\nvar left = r.left;\nvar right = doc.documentElement.clientWidth - r.right;\nassert(Math.abs(left - right) < 2, "left and right gaps must match — use margin auto (left " + Math.round(left) + ", right " + Math.round(right) + ")");\nassert(left > 2, "the box has not moved from the left edge yet");',
                  },
                  {
                    name: { en: 'The text is centred too', id: 'The text is centred too' },
                    check: 'assert(style(".container", "text-align") === "center", "the text inside it must be centred");',
                  },
                ],
                id: [
                  {
                    name: { en: 'It is no wider than 400px', id: 'Lebarnya tidak lebih dari 400px' },
                    check:
                      'assert(style(".wadah", "max-width") === "400px", "max-width harus 400px, sekarang: " + style(".wadah", "max-width"));\nvar w = sel(".wadah").getBoundingClientRect().width;\nassert(w <= 401, "lebarnya tidak boleh melebihi 400px, sekarang: " + Math.round(w));',
                  },
                  {
                    name: { en: 'The box itself is centred', id: 'Kotaknya sendiri berada di tengah' },
                    check:
                      'var r = sel(".wadah").getBoundingClientRect();\nvar kiri = r.left;\nvar kanan = doc.documentElement.clientWidth - r.right;\nassert(Math.abs(kiri - kanan) < 2, "jarak kiri dan kanan harus sama — gunakan margin auto (kiri " + Math.round(kiri) + ", kanan " + Math.round(kanan) + ")");\nassert(kiri > 2, "kotaknya belum bergeser dari tepi kiri");',
                  },
                  {
                    name: { en: 'The text is centred too', id: 'Teksnya juga di tengah' },
                    check: 'assert(style(".wadah", "text-align") === "center", "teks di dalamnya harus rata tengah");',
                  },
                ],
              },
              hints: [
                { en: 'Three declarations, all on .container.', id: 'Tiga deklarasi, semuanya pada .wadah.' },
                { en: 'Centring the box and centring the text are two different properties.', id: 'Memusatkan kotak dan memusatkan teks adalah dua properti berbeda.' },
                { en: 'max-width: 400px; margin: 0 auto; text-align: center;', id: 'max-width: 400px; margin: 0 auto; text-align: center;' },
              ],
              solution: {
                en: '.container {\n  max-width: 400px;\n  margin: 0 auto;\n  text-align: center;\n}',
                id: '.wadah {\n  max-width: 400px;\n  margin: 0 auto;\n  text-align: center;\n}',
              },
            },
          ],
        },
      ],
      project: {
        id: 'css-m2-s2-p',
        runtime: 'web',
        html: {
          en: '<div class="sheet">\n  <h1 class="title">Certificate</h1>\n  <p class="content">Awarded to Nunada for completing the CSS course.</p>\n  <span class="badge">Passed</span>\n  <span class="badge">2026</span>\n  <p class="secret">Internal note.</p>\n</div>',
          id: '<div class="halaman">\n  <h1 class="judul">Sertifikat</h1>\n  <p class="isi">Diberikan kepada Nunada atas penyelesaian kursus CSS.</p>\n  <span class="cap">Lulus</span>\n  <span class="cap">2026</span>\n  <p class="rahasia">Catatan internal.</p>\n</div>',
        },
        title: { en: 'Centred certificate', id: 'Sertifikat terpusat' },
        brief: {
          en: 'A centred sheet with a pair of badges and one hidden note.',
          id: 'Lembar terpusat dengan sepasang lencana dan satu catatan tersembunyi.',
        },
        requirements: [
          { en: '`box-sizing: border-box` for everything.', id: '`box-sizing: border-box` untuk semuanya.' },
          { en: '`.sheet` is centred, max-width 480px, 32px padding, 2px solid `#d4c58a` border.', id: '`.halaman` terpusat, max-width 480px, padding 32px, border solid 2px `#d4c58a`.' },
          { en: 'The text inside `.sheet` is centred.', id: 'Teks di dalam `.halaman` rata tengah.' },
          { en: 'Each `.badge` is an inline-block, 90px wide, 6px padding, `#fef3c7` background.', id: 'Tiap `.cap` berupa inline-block, lebar 90px, padding 6px, latar `#fef3c7`.' },
          { en: '`.secret` is hidden with `display: none`.', id: '`.rahasia` disembunyikan dengan `display: none`.' },
        ],
        starter: '* {\n  box-sizing: border-box;\n}\n\n.sheet {\n\n}\n',
        tests: {
          en: [
            {
              name: { en: 'The sheet is centred and capped at 480px', id: 'The sheet is centred and capped at 480px' },
              check:
                'assert(style(".sheet", "max-width") === "480px", "max-width must be 480px");\nvar r = sel(".sheet").getBoundingClientRect();\nvar left = r.left;\nvar right = doc.documentElement.clientWidth - r.right;\nassert(Math.abs(left - right) < 2, "the box must be centred (left " + Math.round(left) + ", right " + Math.round(right) + ")");\nassert(left > 2, "it has not moved from the left edge yet — use margin auto");',
            },
            {
              name: { en: 'Padding, border, and centred text', id: 'Padding, border, and centred text' },
              check:
                'assert(style(".sheet", "padding-top") === "32px", "padding must be 32px");\nassert(style(".sheet", "border-top-width") === "2px", "border must be 2px");\nassert(style(".sheet", "border-top-style") === "solid", "border style must be solid");\nassert(style(".sheet", "border-top-color") === "rgb(212, 197, 138)", "border color must be #d4c58a");\nassert(style(".sheet", "text-align") === "center", "the text must be centred");',
            },
            {
              name: { en: 'The badges sit side by side', id: 'The badges sit side by side' },
              check:
                'var c = all(".badge");\nassert(c.length === 2, "there should be two .badge");\nassert(style(".badge", "display") === "inline-block", ".badge display must be inline-block");\nassert(style(".badge", "width") === "90px", ".badge width must be 90px");\nassert(style(".badge", "padding-top") === "6px", ".badge padding must be 6px");\nassert(style(".badge", "background-color") === "rgb(254, 243, 199)", ".badge background must be #fef3c7");\nassert(Math.round(c[0].getBoundingClientRect().top) === Math.round(c[1].getBoundingClientRect().top), "both badges must be on one row");',
            },
            {
              name: { en: 'The internal note is hidden', id: 'The internal note is hidden' },
              check:
                'assert(style(".secret", "display") === "none", ".secret must be display: none");\nassert(sel(".secret").getBoundingClientRect().height === 0, ".secret must not take up space");',
            },
          ],
          id: [
            {
              name: { en: 'The sheet is centred and capped at 480px', id: 'Lembarnya terpusat dan dibatasi 480px' },
              check:
                'assert(style(".halaman", "max-width") === "480px", "max-width harus 480px");\nvar r = sel(".halaman").getBoundingClientRect();\nvar kiri = r.left;\nvar kanan = doc.documentElement.clientWidth - r.right;\nassert(Math.abs(kiri - kanan) < 2, "kotaknya harus terpusat (kiri " + Math.round(kiri) + ", kanan " + Math.round(kanan) + ")");\nassert(kiri > 2, "belum bergeser dari tepi kiri — gunakan margin auto");',
            },
            {
              name: { en: 'Padding, border, and centred text', id: 'Padding, border, dan teks terpusat' },
              check:
                'assert(style(".halaman", "padding-top") === "32px", "padding harus 32px");\nassert(style(".halaman", "border-top-width") === "2px", "border harus 2px");\nassert(style(".halaman", "border-top-style") === "solid", "gaya border harus solid");\nassert(style(".halaman", "border-top-color") === "rgb(212, 197, 138)", "warna border harus #d4c58a");\nassert(style(".halaman", "text-align") === "center", "teksnya harus rata tengah");',
            },
            {
              name: { en: 'The badges sit side by side', id: 'Lencananya berdampingan' },
              check:
                'var c = all(".cap");\nassert(c.length === 2, "seharusnya ada dua .cap");\nassert(style(".cap", "display") === "inline-block", "display .cap harus inline-block");\nassert(style(".cap", "width") === "90px", "lebar .cap harus 90px");\nassert(style(".cap", "padding-top") === "6px", "padding .cap harus 6px");\nassert(style(".cap", "background-color") === "rgb(254, 243, 199)", "latar .cap harus #fef3c7");\nassert(Math.round(c[0].getBoundingClientRect().top) === Math.round(c[1].getBoundingClientRect().top), "kedua lencana harus sebaris");',
            },
            {
              name: { en: 'The internal note is hidden', id: 'Catatan internalnya tersembunyi' },
              check:
                'assert(style(".rahasia", "display") === "none", ".rahasia harus display: none");\nassert(sel(".rahasia").getBoundingClientRect().height === 0, ".rahasia tidak boleh memakan ruang");',
            },
          ],
        },
        hints: [
          { en: 'Centring the sheet needs both a max-width and auto margins.', id: 'Memusatkan lembarnya butuh max-width sekaligus margin auto.' },
          { en: 'A span ignores width until you change its display.', id: 'Sebuah span mengabaikan width sampai kamu mengubah display-nya.' },
          { en: 'Four rules: *, .sheet, .badge, .secret.', id: 'Empat aturan: *, .halaman, .cap, .rahasia.' },
        ],
        solution: {
          en: '* {\n  box-sizing: border-box;\n}\n\n.sheet {\n  max-width: 480px;\n  margin: 0 auto;\n  padding: 32px;\n  border: 2px solid #d4c58a;\n  text-align: center;\n}\n\n.badge {\n  display: inline-block;\n  width: 90px;\n  padding: 6px;\n  background-color: #fef3c7;\n}\n\n.secret {\n  display: none;\n}',
          id: '* {\n  box-sizing: border-box;\n}\n\n.halaman {\n  max-width: 480px;\n  margin: 0 auto;\n  padding: 32px;\n  border: 2px solid #d4c58a;\n  text-align: center;\n}\n\n.cap {\n  display: inline-block;\n  width: 90px;\n  padding: 6px;\n  background-color: #fef3c7;\n}\n\n.rahasia {\n  display: none;\n}',
        },
        xp: 50,
      },
    },
  ],
}
