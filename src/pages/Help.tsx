import { Link } from 'react-router-dom'
import { useStore } from '../app/store'
import { useI18n } from '../i18n'
import type { Loc } from '../content/types'
import { MODES } from '../content/playground'
import { MAX_HEARTS, REGEN_MS } from '../lib/hearts'

const L = (en: string, id: string): Loc => ({ en, id })

/** The first-time walkthrough, in the order a new learner meets things. */
const STEPS: { icon: string; title: Loc; body: Loc }[] = [
  {
    icon: '👤',
    title: L('Create an account', 'Buat akun'),
    body: L(
      'Sign up with an email, a username and a display name. The username and display name are what others see on the leaderboard.',
      'Daftar dengan email, username, dan nama tampilan. Username dan nama tampilan inilah yang dilihat orang lain di papan peringkat.',
    ),
  },
  {
    icon: '🧭',
    title: L('Pick a course', 'Pilih kursus'),
    body: L(
      'Open the Catalog. Courses come in two tracks: Mathematics (including TKA preparation) and Code. Open a course to see its map of modules, lessons and mini projects.',
      'Buka Katalog. Kursus terbagi dalam dua jalur: Matematika (termasuk persiapan TKA) dan Kode. Buka sebuah kursus untuk melihat peta modul, pelajaran, dan mini proyeknya.',
    ),
  },
  {
    icon: '🪜',
    title: L('Learn one small step at a time', 'Belajar selangkah demi selangkah'),
    body: L(
      'A lesson is a short chain of steps: read an idea, study a worked example, then try one yourself. Early steps are guided; later ones ask you to do more on your own.',
      'Sebuah pelajaran adalah rangkaian langkah pendek: baca idenya, pelajari contoh bertahap, lalu coba sendiri. Langkah awal dipandu, langkah berikutnya meminta kamu berbuat lebih banyak sendiri.',
    ),
  },
  {
    icon: '🛠️',
    title: L('Finish the mini project', 'Selesaikan mini proyek'),
    body: L(
      'Each submodule ends with a mini project that puts the lessons together. Finishing it opens the next part of the course.',
      'Setiap submateri ditutup dengan mini proyek yang menyatukan pelajarannya. Menyelesaikannya membuka bagian berikutnya dari kursus.',
    ),
  },
  {
    icon: '🏆',
    title: L('Collect XP, trophies and certificates', 'Kumpulkan XP, trofi, dan sertifikat'),
    body: L(
      'Every finished lesson and project gives XP. XP moves you up the leaderboard, and milestones earn trophies. Finishing a whole course earns a certificate.',
      'Setiap pelajaran dan proyek yang selesai memberi XP. XP menaikkan peringkatmu di papan peringkat, dan pencapaian tertentu memberi trofi. Menamatkan satu kursus penuh memberi sertifikat.',
    ),
  },
]

const FAQ: { q: Loc; a: Loc }[] = [
  {
    q: L('Why is a lesson locked?', 'Mengapa sebuah pelajaran terkunci?'),
    a: L(
      'Items open one after another: a lesson or project unlocks once the one before it is finished. Finish the previous item on the course map and the next one opens.',
      'Item terbuka satu demi satu: sebuah pelajaran atau proyek terbuka setelah item sebelumnya selesai. Selesaikan item sebelumnya di peta kursus, maka item berikutnya terbuka.',
    ),
  },
  {
    q: L('What are hearts, and what happens when I run out?', 'Apa itu heart, dan apa yang terjadi kalau habis?'),
    a: L(
      `You have up to ${MAX_HEARTS} hearts. Each wrong answer costs one, and one heart comes back every ${REGEN_MS / 60000} minutes. At zero hearts you can wait, or keep going in practice mode: you can still work through the lesson, but no XP or progress is recorded.`,
      `Kamu punya paling banyak ${MAX_HEARTS} heart. Setiap jawaban salah mengurangi satu, dan satu heart kembali setiap ${REGEN_MS / 60000} menit. Saat heart habis, kamu bisa menunggu, atau lanjut di mode latihan: pelajaran tetap bisa dikerjakan, tetapi XP dan progres tidak dicatat.`,
    ),
  },
  {
    q: L('What happens when I answer wrong?', 'Apa yang terjadi kalau jawabanku salah?'),
    a: L(
      'You lose a heart and get a hint that points at what to look at again, without giving the answer away. You can try the same step again.',
      'Kamu kehilangan satu heart dan mendapat petunjuk yang mengarahkan apa yang perlu dilihat lagi, tanpa membocorkan jawabannya. Kamu boleh mencoba langkah yang sama lagi.',
    ),
  },
  {
    q: L('If I redo a lesson, do I get the XP again?', 'Kalau aku mengulang pelajaran, apakah XP-nya dihitung lagi?'),
    a: L(
      'No. XP is given once per lesson or project. You can replay anything you have finished as often as you like, for practice.',
      'Tidak. XP diberikan satu kali per pelajaran atau proyek. Kamu boleh mengulang apa pun yang sudah selesai sesering yang kamu mau, untuk berlatih.',
    ),
  },
  {
    q: L('How does the leaderboard work?', 'Bagaimana cara kerja papan peringkat?'),
    a: L(
      'There are three boards. Weekly counts the XP you earned since Monday 00:00 UTC (07:00 WIB) and starts over every week. All-time counts all your XP. Trophies ranks by number of trophies. The XP boards can be narrowed to the Mathematics or Code track.',
      'Ada tiga papan. Mingguan menghitung XP yang kamu peroleh sejak Senin 00.00 UTC (07.00 WIB) dan mulai dari nol tiap minggu. Sepanjang masa menghitung seluruh XP-mu. Trofi mengurutkan berdasarkan jumlah trofi. Papan XP bisa dipersempit ke jalur Matematika atau Kode.',
    ),
  },
  {
    q: L('Can other learners see my profile?', 'Apakah pembelajar lain bisa melihat profilku?'),
    a: L(
      'Yes. Anyone signed in can click your name on the leaderboard to open your public profile. It shows your name, username, XP, medals, certificates and earned trophies. It never shows your email, your hearts, or your lesson-by-lesson progress.',
      'Ya. Siapa pun yang sudah masuk bisa mengklik namamu di papan peringkat untuk membuka profil publikmu. Isinya nama, username, XP, medali, sertifikat, dan trofi yang sudah diraih. Email, jumlah heart, dan progres per pelajaran tidak pernah ditampilkan.',
    ),
  },
  {
    q: L('What are medals?', 'Apa itu medali?'),
    a: L(
      'Medals are for placing in the top 3. A weekly gold, silver or bronze is counted once a week has ended and you finished 1st, 2nd or 3rd overall. The all-time medal shows while you hold a top-3 place on the all-time board.',
      'Medali diberikan untuk 3 besar. Emas, perak, atau perunggu mingguan dihitung setelah sebuah minggu berakhir dan kamu finis di peringkat 1, 2, atau 3 keseluruhan. Medali sepanjang masa tampil selama kamu berada di 3 besar papan sepanjang masa.',
    ),
  },
  {
    q: L('How do I get a certificate?', 'Bagaimana cara mendapat sertifikat?'),
    a: L(
      'Finish every lesson and project in a course (or every course in a career path). The certificate then appears on your Profile, where you can open it and print it or save it as a PDF.',
      'Selesaikan seluruh pelajaran dan proyek dalam sebuah kursus (atau semua kursus dalam sebuah jalur karier). Sertifikat lalu muncul di Profilmu, tempat kamu bisa membukanya dan mencetak atau menyimpannya sebagai PDF.',
    ),
  },
  {
    q: L('Are the TKA questions the real exam questions?', 'Apakah soal TKA di sini adalah soal ujian yang sebenarnya?'),
    a: L(
      'No. The TKA Mathematics courses are practice written to follow the official assessment framework (Kerangka Asesmen) for each level, including its question forms. They are not past or leaked exam papers. For the exact number of questions and the time allowed, check the official source from Pusmendik/BSKAP.',
      'Bukan. Kursus TKA Matematika berisi latihan yang disusun mengikuti kerangka asesmen resmi tiap jenjang, termasuk bentuk soalnya. Isinya bukan soal ujian terdahulu atau bocoran. Untuk jumlah soal dan waktu pengerjaan yang pasti, periksa sumber resmi dari Pusmendik/BSKAP.',
    ),
  },
  {
    q: L('What is the Playground?', 'Apa itu Playground?'),
    a: L(
      `A free workspace outside any lesson, with these modes: ${MODES.map((m) => m.label.en).join(', ')}. The code modes come with starter templates. Nothing you do there gives XP.`,
      `Ruang bebas di luar pelajaran, dengan mode berikut: ${MODES.map((m) => m.label.id).join(', ')}. Mode kode dilengkapi templat awal. Apa pun yang kamu kerjakan di sana tidak memberi XP.`,
    ),
  },
  {
    q: L('Where does my code run?', 'Di mana kodeku dijalankan?'),
    a: L(
      'In your own browser, so nothing you type is sent away to run. The first time you open a language it may take a moment to load.',
      'Di peramban kamu sendiri, jadi apa yang kamu ketik tidak dikirim ke tempat lain untuk dijalankan. Saat pertama kali membuka sebuah bahasa, memuatnya bisa butuh beberapa saat.',
    ),
  },
  {
    q: L('How do I switch between English and Bahasa Indonesia?', 'Bagaimana cara berpindah antara English dan Bahasa Indonesia?'),
    a: L(
      'Use the EN / ID switch at the top of every page. Lessons, questions and explanations change language right away. Program code, numbers and some labels inside figures stay the same in both.',
      'Pakai tombol EN / ID di bagian atas setiap halaman. Pelajaran, soal, dan penjelasan langsung berganti bahasa. Kode program, angka, dan sebagian label di dalam gambar tetap sama di kedua bahasa.',
    ),
  },
  {
    q: L('How do I change my name, username or password?', 'Bagaimana cara mengganti nama, username, atau kata sandi?'),
    a: L(
      'Open Profile. Use Edit next to your name to change your display name and username, and Change password to set a new password.',
      'Buka Profil. Pakai Ubah di samping namamu untuk mengganti nama tampilan dan username, dan Ganti kata sandi untuk membuat kata sandi baru.',
    ),
  },
  {
    q: L('I forgot my password.', 'Aku lupa kata sandi.'),
    a: L(
      'On the sign-in page choose "Forgot your password?", enter your email, and follow the link we send you. For privacy the page does not say whether an email has an account.',
      'Di halaman masuk pilih "Lupa kata sandi?", masukkan emailmu, lalu ikuti tautan yang kami kirim. Demi privasi, halaman itu tidak menyebutkan apakah sebuah email punya akun.',
    ),
  },
  {
    q: L('What does the "Local mode" badge mean?', 'Apa arti lencana "Mode lokal"?'),
    a: L(
      'The app is running without its online database, so accounts and progress are stored only in this browser. They are not shared across devices and disappear if the browser data is cleared.',
      'Aplikasi berjalan tanpa basis data daring, sehingga akun dan progres hanya tersimpan di peramban ini. Datanya tidak terbagi antarperangkat dan hilang jika data peramban dihapus.',
    ),
  },
  {
    q: L('What is the "Class" tab?', 'Apa itu tab "Kelas"?'),
    a: L(
      'It is only for teacher accounts: a roster of learners and how far each has got in each course. Teacher accounts can preview any lesson, do not earn XP, and do not appear on the leaderboard. A teacher account is assigned by the site owner, not chosen at sign-up.',
      'Tab ini hanya untuk akun guru: daftar pembelajar dan sejauh mana masing-masing di setiap kursus. Akun guru dapat melihat pratinjau pelajaran apa pun, tidak mendapat XP, dan tidak tampil di papan peringkat. Akun guru ditetapkan oleh pemilik situs, bukan dipilih saat mendaftar.',
    ),
  },
  {
    q: L('I found a mistake, or I have an idea.', 'Aku menemukan kesalahan, atau punya ide.'),
    a: L(
      'Tap the 💬 button at the bottom-left corner of the screen. You can leave a rating from 1 to 5 and a short comment.',
      'Ketuk tombol 💬 di pojok kiri bawah layar. Kamu bisa memberi nilai 1 sampai 5 dan komentar singkat.',
    ),
  },
]

export default function Help() {
  const { user } = useStore()
  const { t, tc } = useI18n()

  return (
    <main className="page narrow">
      <h1>{t('helpTitle')}</h1>
      <p className="muted">{t('helpIntro')}</p>

      <h2>{t('helpStartTitle')}</h2>
      <ol className="helpsteps">
        {STEPS.map((s, i) => (
          <li className="card" key={i}>
            <span className="num" aria-hidden="true">
              {s.icon}
            </span>
            <div>
              <b>
                {i + 1}. {tc(s.title)}
              </b>
              <p className="small muted" style={{ margin: '4px 0 0' }}>
                {tc(s.body)}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <h2 style={{ marginTop: 32 }}>{t('helpFaqTitle')}</h2>
      <div className="faq">
        {FAQ.map((f, i) => (
          <details key={i}>
            <summary>{tc(f.q)}</summary>
            <p>{tc(f.a)}</p>
          </details>
        ))}
      </div>

      <div className="card center" style={{ marginTop: 32 }}>
        <p style={{ marginTop: 0 }}>{t('helpReady')}</p>
        <Link className="btn" to={user ? '/catalog' : '/auth?mode=signup'}>
          {user ? t('navCatalog') : t('getStarted')}
        </Link>
      </div>
    </main>
  )
}
