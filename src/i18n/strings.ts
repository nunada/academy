/** UI strings. Content strings live with the courses; these are the chrome. */

export const ui = {
  appName: { en: 'Nunada Academy', id: 'Nunada Academy' },
  appTagline: { en: 'Code & Mathematics', id: 'Coding & Matematika' },

  // nav
  navLearn: { en: 'Learn', id: 'Belajar' },
  navCatalog: { en: 'Catalog', id: 'Katalog' },
  navPlayground: { en: 'Playground', id: 'Playground' },
  navLeaderboard: { en: 'Leaderboard', id: 'Papan Peringkat' },
  navProfile: { en: 'Profile', id: 'Profil' },
  signOut: { en: 'Sign out', id: 'Keluar' },

  // auth
  signIn: { en: 'Sign in', id: 'Masuk' },
  signUp: { en: 'Create account', id: 'Buat akun' },
  email: { en: 'Email', id: 'Email' },
  password: { en: 'Password', id: 'Kata sandi' },
  username: { en: 'Username', id: 'Nama pengguna' },
  displayName: { en: 'Display name', id: 'Nama tampilan' },
  haveAccount: { en: 'Already have an account?', id: 'Sudah punya akun?' },
  noAccount: { en: "Don't have an account?", id: 'Belum punya akun?' },
  authTitleIn: { en: 'Welcome back', id: 'Selamat datang kembali' },
  authTitleUp: { en: 'Start learning', id: 'Mulai belajar' },
  authSubIn: { en: 'Sign in to continue your streak.', id: 'Masuk untuk melanjutkan progresmu.' },
  authSubUp: {
    en: 'An account keeps your XP, hearts, and certificates safe.',
    id: 'Akun menyimpan XP, hearts, dan sertifikatmu.',
  },
  working: { en: 'Working…', id: 'Memproses…' },
  passwordHint: { en: 'At least 6 characters.', id: 'Minimal 6 karakter.' },
  usernameHint: {
    en: 'Shown on the leaderboard. Letters, numbers, underscore.',
    id: 'Tampil di papan peringkat. Huruf, angka, garis bawah.',
  },

  // password reset
  forgotPassword: { en: 'Forgot your password?', id: 'Lupa kata sandi?' },
  resetTitle: { en: 'Reset your password', id: 'Atur ulang kata sandi' },
  resetSub: {
    en: 'Type the email you signed up with and we will send you a link.',
    id: 'Ketik email yang kamu pakai mendaftar, dan kami kirimkan tautannya.',
  },
  resetSend: { en: 'Send the link', id: 'Kirim tautannya' },
  resetSentBody: {
    en: 'If that email has an account, a link is on its way. It works once and expires within the hour. Check the spam folder if it does not appear.',
    id: 'Kalau email itu punya akun, tautannya sedang dikirim. Ia hanya bisa dipakai sekali dan kedaluwarsa dalam sejam. Periksa folder spam kalau belum muncul.',
  },
  resetLocalNote: {
    en: 'Local mode sends no email, so here is the link:',
    id: 'Mode lokal tidak mengirim email, jadi ini tautannya:',
  },
  resetLocalOpen: { en: 'Open it', id: 'Buka' },
  newPasswordTitle: { en: 'Choose a new password', id: 'Pilih kata sandi baru' },
  newPasswordSub: {
    en: 'You will be signed in once it is saved.',
    id: 'Kamu akan langsung masuk setelah tersimpan.',
  },
  newPassword: { en: 'New password', id: 'Kata sandi baru' },
  newPasswordAgain: { en: 'Type it again', id: 'Ketik sekali lagi' },
  newPasswordSave: { en: 'Save it', id: 'Simpan' },
  newPasswordDone: { en: 'Saved. Taking you to your courses…', id: 'Tersimpan. Mengantarmu ke kursusmu…' },
  passwordMismatch: { en: 'The two do not match.', id: 'Keduanya tidak sama.' },
  changePassword: { en: 'Change password', id: 'Ganti kata sandi' },
  nameAndUsername: { en: 'Name & username', id: 'Nama & nama pengguna' },
  edit: { en: 'Edit', id: 'Ubah' },
  save: { en: 'Save', id: 'Simpan' },
  cancel: { en: 'Cancel', id: 'Batal' },
  profileSaved: { en: 'Saved.', id: 'Tersimpan.' },

  // sign-up confirmation
  signupConfirmTitle: { en: 'Check your email', id: 'Periksa emailmu' },
  signupConfirmBody: {
    en: 'Your account is created. Click the link we sent to confirm it, then sign in — the link works once and expires within the hour.',
    id: 'Akunmu sudah dibuat. Klik tautan yang kami kirim untuk mengonfirmasinya, lalu masuk — tautannya hanya berlaku sekali dan kedaluwarsa dalam sejam.',
  },

  // landing
  heroTitle: {
    en: 'Code and mathematics, one small win at a time.',
    id: 'Coding dan matematika, satu kemenangan kecil setiap kali.',
  },
  heroBody: {
    en: 'Programming courses and mathematics courses, built the same way: guided lessons that hand over control step by step, a mini project at the end of every submodule, and a certificate when you finish.',
    id: 'Kursus pemrograman dan kursus matematika, disusun dengan cara yang sama: pelajaran terbimbing yang melepas bantuan selangkah demi selangkah, mini proyek di akhir tiap submateri, dan sertifikat saat kamu selesai.',
  },
  getStarted: { en: 'Get started — free', id: 'Mulai — gratis' },
  iHaveAccount: { en: 'I already have an account', id: 'Saya sudah punya akun' },
  featScaffold: { en: 'Scaffolded practice', id: 'Latihan berjenjang' },
  featScaffoldBody: {
    en: 'Watch a worked example, predict the answer, fill the blanks, put the steps in order, then do it yourself.',
    id: 'Lihat contoh, tebak jawabannya, isi bagian kosong, susun langkahnya, lalu kerjakan sendiri.',
  },
  featProjects: { en: 'A mini project every submodule', id: 'Mini proyek tiap submateri' },
  featProjectsBody: {
    en: 'Real code running in your browser, or a problem set marked box by box — either way, checked properly.',
    id: 'Kode sungguhan berjalan di peramban, atau kumpulan soal yang diperiksa kotak demi kotak — keduanya dinilai sungguhan.',
  },
  featCompete: { en: 'XP, hearts & weekly leaderboard', id: 'XP, hearts & papan peringkat mingguan' },
  featCompeteBody: {
    en: 'Weekly XP resets so a fresh week is always a fair race.',
    id: 'XP mingguan direset agar tiap minggu jadi lomba yang adil.',
  },

  // dashboard
  continueLearning: { en: 'Continue learning', id: 'Lanjutkan belajar' },
  continueBtn: { en: 'Continue', id: 'Lanjutkan' },
  startCourse: { en: 'Start course', id: 'Mulai kursus' },
  yourCourses: { en: 'Your courses', id: 'Kursusmu' },
  browseCatalog: { en: 'Browse catalog', id: 'Lihat katalog' },
  noCourses: { en: 'You have not enrolled in anything yet.', id: 'Kamu belum mengambil kursus apa pun.' },
  weekXp: { en: 'XP this week', id: 'XP minggu ini' },
  totalXpLabel: { en: 'Total XP', id: 'Total XP' },
  trophies: { en: 'Trophies', id: 'Trofi' },
  rank: { en: 'Rank', id: 'Peringkat' },

  // catalog
  catalogTitle: { en: 'Courses', id: 'Kursus' },
  trackCode: { en: 'Programming', id: 'Pemrograman' },
  trackMath: { en: 'Mathematics', id: 'Matematika' },
  pathsTitle: { en: 'Career paths', id: 'Jalur karier' },
  pathsBlurb: {
    en: 'A path bundles several courses into one goal, and pays out one certificate at the end.',
    id: 'Jalur menggabungkan beberapa kursus jadi satu tujuan, dan memberi satu sertifikat di akhir.',
  },
  enroll: { en: 'Enroll', id: 'Ambil' },
  enrolled: { en: 'Enrolled', id: 'Diambil' },
  comingSoon: { en: 'Coming soon', id: 'Segera hadir' },
  requiresLabel: { en: 'Requires', id: 'Prasyarat' },
  lessonsWord: { en: 'lessons', id: 'pelajaran' },
  projectsWord: { en: 'mini projects', id: 'mini proyek' },

  // course map
  backToCourse: { en: 'Back to course', id: 'Kembali ke kursus' },
  locked: { en: 'Locked', id: 'Terkunci' },
  lockedHint: { en: 'Finish the step before it to unlock.', id: 'Selesaikan langkah sebelumnya untuk membukanya.' },
  done: { en: 'Done', id: 'Selesai' },
  miniProject: { en: 'Mini project', id: 'Mini proyek' },
  courseProgress: { en: 'Course progress', id: 'Progres kursus' },

  // lesson player
  check: { en: 'Check', id: 'Periksa' },
  continueNext: { en: 'Continue', id: 'Lanjut' },
  runCode: { en: 'Run', id: 'Jalankan' },
  runTests: { en: 'Run tests', id: 'Jalankan tes' },
  hint: { en: 'Hint', id: 'Petunjuk' },
  showSolution: { en: 'Show solution', id: 'Lihat solusi' },
  showWorking: { en: 'Show the working', id: 'Lihat penyelesaian' },
  correct: { en: 'Correct!', id: 'Benar!' },
  notQuite: { en: 'Not quite.', id: 'Belum tepat.' },
  yourAnswer: { en: 'Your answer', id: 'Jawabanmu' },
  output: { en: 'Output', id: 'Keluaran' },
  expected: { en: 'Expected', id: 'Diharapkan' },
  worked: { en: 'Worked example', id: 'Contoh' },
  dragToOrder: { en: 'Put the lines in the right order.', id: 'Susun baris-baris ini dengan urutan yang benar.' },
  moveUp: { en: 'Move up', id: 'Naikkan' },
  moveDown: { en: 'Move down', id: 'Turunkan' },
  lessonComplete: { en: 'Lesson complete', id: 'Pelajaran selesai' },
  projectComplete: { en: 'Project complete', id: 'Proyek selesai' },
  earnedXp: { en: 'XP earned', id: 'XP diperoleh' },
  backToMap: { en: 'Back to the map', id: 'Kembali ke peta' },
  nextLesson: { en: 'Next lesson', id: 'Pelajaran berikutnya' },
  requirements: { en: 'What it must do', id: 'Yang harus dilakukan' },
  allTestsPass: { en: 'All checks passed!', id: 'Semua pemeriksaan lolos!' },
  someTestsFail: { en: 'Some checks did not pass yet.', id: 'Beberapa pemeriksaan belum lolos.' },
  loadingPython: { en: 'Starting Python…', id: 'Menyalakan Python…' },
  loadingPythonNote: {
    en: 'First run downloads the Python runtime. It is cached afterwards.',
    id: 'Jalan pertama mengunduh runtime Python. Setelah itu tersimpan di cache.',
  },

  // hearts
  hearts: { en: 'Hearts', id: 'Hearts' },
  outOfHearts: { en: 'Out of hearts', id: 'Hearts habis' },
  outOfHeartsBody: {
    en: 'You lose a heart for a wrong answer. One comes back every 15 minutes.',
    id: 'Kamu kehilangan satu heart tiap jawaban salah. Satu kembali setiap 15 menit.',
  },
  nextHeartIn: { en: 'Next heart in', id: 'Heart berikutnya dalam' },
  fullHearts: { en: 'All hearts full', id: 'Hearts penuh' },
  practiceAnyway: { en: 'Keep practising (no XP)', id: 'Tetap berlatih (tanpa XP)' },
  waitForHeart: { en: 'Wait for a heart', id: 'Tunggu heart' },

  // leaderboard
  lbWeekly: { en: 'Weekly XP', id: 'XP Mingguan' },
  lbAllTime: { en: 'All-time XP', id: 'XP Sepanjang Masa' },
  lbTrophies: { en: 'Trophies', id: 'Trofi' },
  lbWeeklyNote: {
    en: 'Counts XP earned since Monday. Resets every week.',
    id: 'Menghitung XP sejak Senin. Direset tiap minggu.',
  },
  lbTrophyNote: {
    en: 'Trophies are awarded for finishing modules, courses, and paths.',
    id: 'Trofi diberikan untuk menuntaskan modul, kursus, dan jalur.',
  },
  you: { en: 'you', id: 'kamu' },
  empty: { en: 'Nothing here yet.', id: 'Belum ada apa-apa di sini.' },

  // profile / certificate
  certificates: { en: 'Certificates', id: 'Sertifikat' },
  noCertificates: {
    en: 'Finish a course or a career path to earn one.',
    id: 'Selesaikan sebuah kursus atau jalur karier untuk mendapatkannya.',
  },
  viewCertificate: { en: 'View certificate', id: 'Lihat sertifikat' },
  print: { en: 'Print / Save as PDF', id: 'Cetak / Simpan PDF' },
  certificateOf: { en: 'Certificate of Completion', id: 'Sertifikat Kelulusan' },
  awardedTo: { en: 'This certifies that', id: 'Diberikan kepada' },
  hasCompleted: { en: 'has successfully completed', id: 'telah menyelesaikan' },
  issuedOn: { en: 'Issued on', id: 'Diterbitkan pada' },
  serial: { en: 'Serial', id: 'Nomor seri' },
  courseWord: { en: 'course', id: 'kursus' },
  pathWord: { en: 'career path', id: 'jalur karier' },
  language: { en: 'Language', id: 'Bahasa' },
  memberSince: { en: 'Member since', id: 'Bergabung sejak' },

  // playground
  playgroundTitle: { en: 'Playground', id: 'Playground' },
  playgroundBlurb: {
    en: 'A scratch space. Nothing here is graded and nothing costs a heart.',
    id: 'Ruang bebas. Tidak ada yang dinilai dan tidak ada yang memakan heart.',
  },
  clearOutput: { en: 'Clear', id: 'Bersihkan' },
  stdinLabel: { en: 'Input (one line per input() call)', id: 'Input (satu baris per pemanggilan input())' },
  templates: { en: 'Templates', id: 'Templat' },

  // teacher
  navTeacher: { en: 'Class', id: 'Kelas' },
  teacherTitle: { en: 'Class', id: 'Kelas' },
  teacherIntro: {
    en: 'Everyone who has an account, and what they have finished. Only teachers can open this.',
    id: 'Semua yang punya akun, dan apa saja yang sudah mereka selesaikan. Hanya guru yang bisa membukanya.',
  },
  teacherDenied: {
    en: 'This page is for teachers. If it should be yours, ask whoever runs the project to set your role.',
    id: 'Halaman ini untuk guru. Kalau seharusnya milikmu, minta pengelola proyek menyetel peranmu.',
  },
  teacherLocalNote: {
    en: 'Local mode: these learners live in this browser only, and six of them are invented.',
    id: 'Mode lokal: pembelajar ini hanya ada di browser ini, dan enam di antaranya karangan.',
  },
  tabRoster: { en: 'Everyone', id: 'Semua' },
  tabByCourse: { en: 'By course', id: 'Per kursus' },
  thLearner: { en: 'Learner', id: 'Pembelajar' },
  thCourse: { en: 'Course', id: 'Kursus' },
  thJoined: { en: 'Joined', id: 'Bergabung' },
  thLessons: { en: 'Lessons', id: 'Pelajaran' },
  thProjects: { en: 'Projects', id: 'Proyek' },
  thLastActive: { en: 'Last active', id: 'Terakhir aktif' },
  statLearners: { en: 'Learners', id: 'Pembelajar' },
  statActiveWeek: { en: 'Active this week', id: 'Aktif minggu ini' },
  statFinished: { en: 'Finished a course', id: 'Menuntaskan kursus' },
  neverStarted: { en: 'Never started', id: 'Belum mulai' },
  today: { en: 'Today', id: 'Hari ini' },
  daysAgo: { en: 'd ago', id: 'hari lalu' },
  teacherBadge: { en: 'Teacher', id: 'Guru' },
  noLearners: { en: 'Nobody has signed up yet.', id: 'Belum ada yang mendaftar.' },
  notStartedCourse: { en: 'Not started', id: 'Belum dimulai' },

  // misc
  loading: { en: 'Loading…', id: 'Memuat…' },
  errorGeneric: { en: 'Something went wrong.', id: 'Terjadi kesalahan.' },
  localModeBadge: { en: 'Local mode', id: 'Mode lokal' },
  localModeNote: {
    en: 'No Supabase keys found, so accounts and progress are stored in this browser only.',
    id: 'Kunci Supabase tidak ditemukan, jadi akun dan progres hanya tersimpan di browser ini.',
  },
  of: { en: 'of', id: 'dari' },
  complete: { en: 'complete', id: 'selesai' },
} as const

export type UiKey = keyof typeof ui
