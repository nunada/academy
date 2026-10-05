import type { Submodule } from '../types'
import { L, pm } from './figs'
import { test1 } from './m8b-simulasi-1'
import { test2 } from './m8c-simulasi-2'

export const m8s2: Submodule = {
  id: 'tka-sml-m8-s2',
  title: L('Practice Tests', 'Simulasi TKA'),
  summary: L(
    'Two practice tests in the style of the TKA advanced math, with questions from matrices, polynomials, functions, vectors, circles, transformations and limits, and a final try-out of typed answers.',
    'Dua simulasi bergaya TKA Matematika Tingkat Lanjut, dengan soal dari matriks, polinomial, fungsi, vektor, lingkaran, transformasi, dan limit, dan satu try-out akhir dengan jawaban ketikan.',
  ),
  lessons: [test1, test2],
  project: {
    id: 'tka-sml-m8-s2-p',
    runtime: 'math',
    title: L('Final Try-Out', 'Try-out Akhir'),
    brief: L(
      'Six typed-answer problems from the areas of the course. Work like in the real test: plan your time, solve, and check.',
      'Enam soal jawaban ketikan dari bidang-bidang kursus. Bekerjalah seperti pada tes sebenarnya: rencanakan waktu, selesaikan, dan periksa.',
    ),
    requirements: [
      L('Solve problems from different chapters without a hint about the topic.', 'Menyelesaikan soal dari bab yang berbeda tanpa petunjuk tentang topiknya.'),
      L('Check every answer.', 'Memeriksa setiap jawaban.'),
    ],
    hints: [
      L('Name the topic of each problem first.', 'Namai topik tiap soal lebih dulu.'),
      L('Check by substituting your answer back.', 'Periksa dengan mensubstitusikan jawabanmu kembali.'),
      L('Keep exact values until the end.', 'Pertahankan nilai eksak sampai akhir.'),
    ],
    xp: 60,
    tasks: [
      {
        prompt: L(
          `Find the entry in row 1, column 1 of the inverse of $${pm([2, 1], [5, 3])}$.`,
          `Cari entri pada baris 1, kolom 1 dari invers $${pm([2, 1], [5, 3])}$.`,
        ),
        blanks: [{ answer: 3 }],
        solution: ['\\det=6-5=1', 'A^{-1}=\\begin{pmatrix}3&-1\\\\-5&2\\end{pmatrix}', '3'],
      },
      {
        prompt: L(
          'Find the remainder when $x^3+3x^2-x+2$ is divided by $x+1$.',
          'Cari sisa bila $x^3+3x^2-x+2$ dibagi $x+1$.',
        ),
        blanks: [{ answer: 5 }],
        solution: ['p(-1)=-1+3+1+2', '=5'],
      },
      {
        prompt: L(
          'Find the smallest integer in the domain of $f(x)=\\sqrt{3x-10}$.',
          'Cari bilangan bulat terkecil dalam domain $f(x)=\\sqrt{3x-10}$.',
        ),
        blanks: [{ answer: 4 }],
        solution: ['3x-10\\ge0 \\Rightarrow x\\ge\\frac{10}{3}', 'x_{\\min}=4'],
      },
      {
        prompt: L(
          'The vectors $(2,k,1)$ and $(3,-2,-2)$ are perpendicular. Find $k$.',
          'Vektor $(2,k,1)$ dan $(3,-2,-2)$ tegak lurus. Tentukan $k$.',
        ),
        blanks: [{ label: 'k =', answer: 2 }],
        solution: ['6-2k-2=0', 'k=2'],
      },
      {
        prompt: L(
          'The line $y=k$ with $k>0$ is tangent to the circle $(x-1)^2+(y+2)^2=9$. Find $k$.',
          'Garis $y=k$ dengan $k>0$ menyinggung lingkaran $(x-1)^2+(y+2)^2=9$. Tentukan $k$.',
        ),
        blanks: [{ label: 'k =', answer: 1 }],
        solution: ['(1,-2),\\ r=3', 'y=-2\\pm3 \\Rightarrow k=1'],
      },
      {
        prompt: L(
          'Find $\\lim_{x\\to0}\\frac{1-\\cos4x}{x^2}$.',
          'Cari $\\lim_{x\\to0}\\frac{1-\\cos4x}{x^2}$.',
        ),
        blanks: [{ answer: 8 }],
        solution: ['1-\\cos4x=2\\sin^2 2x', '\\frac{2\\sin^2 2x}{x^2}=8\\left(\\frac{\\sin2x}{2x}\\right)^2\\to8'],
      },
    ],
  },
}
