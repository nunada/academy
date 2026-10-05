import type { Submodule } from '../types'
import { L } from './figs'
import { test1 } from './m10c1-simulasi-1'
import { test2 } from './m10c2-simulasi-2'

export const m10s3: Submodule = {
  id: 'tka-sma-m10-s3',
  title: L('Practice Tests', 'Simulasi TKA'),
  summary: L(
    'Two practice tests in the style of the TKA SMA, with questions from numbers, algebra and functions, geometry and measurement, trigonometry, and data and probability, and a final try-out of typed answers.',
    'Dua simulasi bergaya TKA SMA, dengan soal dari bilangan, aljabar dan fungsi, geometri dan pengukuran, trigonometri, serta data dan peluang, dan satu try-out akhir dengan jawaban ketikan.',
  ),
  lessons: [test1, test2],
  project: {
    id: 'tka-sma-m10-s3-p',
    runtime: 'math',
    title: L('Final Try-Out', 'Try-out Akhir'),
    brief: L(
      'Six typed-answer problems from all the areas of the course. Work like in the real test: plan your time, solve, and check.',
      'Enam soal jawaban ketikan dari semua bidang kursus. Bekerjalah seperti pada tes sebenarnya: rencanakan waktu, selesaikan, dan periksa.',
    ),
    requirements: [
      L('Solve problems from different chapters without a hint about the topic.', 'Menyelesaikan soal dari bab yang berbeda tanpa petunjuk tentang topiknya.'),
      L('Check every answer.', 'Memeriksa setiap jawaban.'),
    ],
    hints: [
      L('Name the topic of each problem first.', 'Namai topik tiap soal lebih dulu.'),
      L('Check by substituting your answer back.', 'Periksa dengan mensubstitusikan jawabanmu kembali.'),
      L('Keep $\\pi$ and roots exact until the end.', 'Pertahankan $\\pi$ dan akar tetap eksak sampai akhir.'),
    ],
    xp: 60,
    tasks: [
      {
        prompt: L('Solve $2(x-3)+5=3x-4$.', 'Selesaikan $2(x-3)+5=3x-4$.'),
        blanks: [{ label: 'x =', answer: 3 }],
        solution: ['2x-6+5=3x-4 \\Rightarrow 2x-1=3x-4', 'x=3'],
      },
      {
        prompt: L(
          'Find the sum of the first 12 terms of the arithmetic sequence $5,8,11,\\ldots$',
          'Cari jumlah 12 suku pertama dari barisan aritmetika $5,8,11,\\ldots$',
        ),
        blanks: [{ label: 'S_{12} =', answer: 258 }],
        solution: ['a=5 \\quad b=3', 'S_{12}=\\frac{12}{2}(2\\cdot5+11\\cdot3)=6\\times43', '=258'],
      },
      {
        prompt: L(
          'A sector of a circle of radius 6 has a central angle of $60^{\\circ}$. Its area is $k\\pi$. Find $k$.',
          'Sebuah juring lingkaran berjari-jari 6 bersudut pusat $60^{\\circ}$. Luasnya $k\\pi$. Tentukan $k$.',
        ),
        blanks: [{ label: 'k =', answer: 6 }],
        solution: ['\\frac{60}{360}\\times\\pi\\times6^2=\\frac{1}{6}\\times36\\pi', '=6\\pi'],
      },
      {
        prompt: L(
          '$\\theta$ is acute and $\\cos\\theta=\\frac{3}{5}$. Find $\\tan\\theta$.',
          '$\\theta$ lancip dan $\\cos\\theta=\\frac{3}{5}$. Tentukan $\\tan\\theta$.',
        ),
        blanks: [{ label: '\\tan\\theta =', answer: 4 / 3 }],
        solution: ['\\sin^2\\theta=1-\\frac{9}{25}=\\frac{16}{25} \\Rightarrow \\sin\\theta=\\frac{4}{5}', '\\tan\\theta=\\frac{4/5}{3/5}=\\frac{4}{3}'],
      },
      {
        prompt: L(
          'A bag has 3 red and 2 blue balls. Two balls are taken without replacement. Find the probability that exactly one of them is red. Type it as a fraction in lowest terms, such as 1/2.',
          'Sebuah kantong berisi 3 bola merah dan 2 bola biru. Dua bola diambil tanpa pengembalian. Tentukan peluang bahwa tepat satu di antaranya merah. Ketik sebagai pecahan paling sederhana, seperti 1/2.',
        ),
        blanks: [{ label: 'P =', answer: 3 / 5 }],
        solution: ['\\frac{3}{5}\\cdot\\frac{2}{4}+\\frac{2}{5}\\cdot\\frac{3}{4}=\\frac{6}{20}+\\frac{6}{20}', '=\\frac{12}{20}=\\frac{3}{5}'],
      },
      {
        prompt: L(
          'Write $\\sqrt{50}+\\sqrt{18}$ as $a\\sqrt{2}$. Find $a$.',
          'Tulis $\\sqrt{50}+\\sqrt{18}$ sebagai $a\\sqrt{2}$. Tentukan $a$.',
        ),
        blanks: [{ label: 'a =', answer: 8 }],
        solution: ['\\sqrt{50}=5\\sqrt{2} \\quad \\sqrt{18}=3\\sqrt{2}', '5\\sqrt{2}+3\\sqrt{2}=8\\sqrt{2}'],
      },
    ],
  },
}
