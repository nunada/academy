import type { Loc } from '../types'
import type { WidgetName } from './types'

/** What each interactive widget is. The page shows the title above the widget;
 *  the pre-rendered HTML (which has no JavaScript to run the widget with) shows
 *  the description in its place, so a crawler reads what the activity does. */
export const WIDGETS: Record<WidgetName, { title: Loc; description: Loc }> = {
  sets: {
    title: { en: 'Interactive: where does a number live?', id: 'Interaktif: di mana sebuah bilangan berada?' },
    description: {
      en: 'Tap a number to drop it into the diagram of nested number sets and see every set it belongs to.',
      id: 'Ketuk sebuah bilangan untuk menjatuhkannya ke diagram himpunan bilangan bersarang dan lihat semua himpunan tempat ia berada.',
    },
  },
  classify: {
    title: { en: 'Interactive: classify the number', id: 'Interaktif: golongkan bilangannya' },
    description: {
      en: 'Ten numbers, one at a time: choose the smallest set each one belongs to and get an explanation straight away.',
      id: 'Sepuluh bilangan satu per satu: pilih himpunan terkecil tempat masing-masing berada dan dapatkan penjelasan langsung.',
    },
  },
  decimal: {
    title: { en: 'Interactive: fraction to decimal', id: 'Interaktif: pecahan ke desimal' },
    description: {
      en: 'Type a fraction and see its decimal expansion, whether it ends or repeats, the repeating block, and the prime-factor rule that decides it.',
      id: 'Ketik sebuah pecahan dan lihat ekspansi desimalnya, apakah berhenti atau berulang, blok yang berulang, dan aturan faktor prima yang menentukannya.',
    },
  },
  repeat: {
    title: { en: 'Interactive: repeating decimal to fraction', id: 'Interaktif: desimal berulang ke pecahan' },
    description: {
      en: 'Enter the digits of a repeating decimal and get the fraction it equals, with the working shown step by step.',
      id: 'Masukkan angka-angka sebuah desimal berulang dan dapatkan pecahan yang sama dengannya, lengkap dengan langkah pengerjaannya.',
    },
  },
  sqrt2: {
    title: { en: 'Interactive: close in on √2', id: 'Interaktif: dekati √2' },
    description: {
      en: 'Find the decimal digits of the square root of 2 one at a time by choosing each digit and checking its square.',
      id: 'Temukan angka desimal akar kuadrat 2 satu per satu dengan memilih tiap angka dan memeriksa kuadratnya.',
    },
  },
  density: {
    title: { en: 'Interactive: always another number in between', id: 'Interaktif: selalu ada bilangan lain di antaranya' },
    description: {
      en: 'Pick two numbers and keep taking the midpoint: there is always another rational number between them.',
      id: 'Pilih dua bilangan lalu terus ambil titik tengahnya: selalu ada bilangan rasional lain di antara keduanya.',
    },
  },
  interval: {
    title: { en: 'Interactive: interval builder', id: 'Interaktif: pembuat interval' },
    description: {
      en: 'Set two endpoints and open or closed ends and see the interval notation, the set-builder form and the number line together.',
      id: 'Atur dua titik ujung dan ujung terbuka atau tertutup, lalu lihat notasi interval, notasi pembentuk himpunan, dan garis bilangannya sekaligus.',
    },
  },
  floats: {
    title: { en: 'Interactive: how a computer stores reals', id: 'Interaktif: cara komputer menyimpan bilangan real' },
    description: {
      en: 'Compare two expressions the way a computer does, with 64-bit floating point, and see why 0.1 + 0.2 is not exactly 0.3.',
      id: 'Bandingkan dua ekspresi seperti yang dilakukan komputer, dengan floating point 64-bit, dan lihat mengapa 0,1 + 0,2 tidak tepat 0,3.',
    },
  },
}
