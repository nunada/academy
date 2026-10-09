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
      id: 'Pilih sebuah bilangan untuk melihat posisinya dalam diagram himpunan bilangan dan himpunan-himpunan yang memuatnya.',
    },
  },
  classify: {
    title: { en: 'Interactive: classify the number', id: 'Interaktif: golongkan bilangannya' },
    description: {
      en: 'Ten numbers, one at a time: choose the smallest set each one belongs to and get an explanation straight away.',
      id: 'Klasifikasikan sepuluh bilangan dengan memilih himpunan terkecil yang memuat masing-masing bilangan. Kamu akan memperoleh penjelasan setelah menjawab.',
    },
  },
  decimal: {
    title: { en: 'Interactive: fraction to decimal', id: 'Interaktif: pecahan ke desimal' },
    description: {
      en: 'Type a fraction and see its decimal expansion, whether it ends or repeats, the repeating block, and the prime-factor rule that decides it.',
      id: 'Masukkan sebuah pecahan untuk melihat bentuk desimalnya, menentukan apakah desimal tersebut berakhir atau berulang, dan memahami kaitannya dengan faktor prima penyebut.',
    },
  },
  repeat: {
    title: { en: 'Interactive: repeating decimal to fraction', id: 'Interaktif: desimal berulang ke pecahan' },
    description: {
      en: 'Enter the digits of a repeating decimal and get the fraction it equals, with the working shown step by step.',
      id: 'Masukkan bilangan desimal berulang untuk mengubahnya menjadi pecahan senilai beserta langkah-langkah penyelesaiannya.',
    },
  },
  sqrt2: {
    title: { en: 'Interactive: close in on √2', id: 'Interaktif: dekati √2' },
    description: {
      en: 'Find the decimal digits of the square root of 2 one at a time by choosing each digit and checking its square.',
      id: 'Tentukan angka-angka desimal √2 secara bertahap dengan memilih angka yang memenuhi syarat pada setiap langkah.',
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
      id: 'Tentukan kedua ujung interval beserta jenis ujungnya (terbuka atau tertutup). Hasilnya akan ditampilkan dalam notasi interval, notasi pembentuk himpunan, dan garis bilangan.',
    },
  },
  floats: {
    title: { en: 'Interactive: how a computer stores reals', id: 'Interaktif: cara komputer menyimpan bilangan real' },
    description: {
      en: 'Compare two expressions the way a computer does, with 64-bit floating point, and see why 0.1 + 0.2 is not exactly 0.3.',
      id: 'Bandingkan dua ekspresi menggunakan representasi bilangan titik-mengambang 64-bit untuk memahami mengapa hasil 0,1 + 0,2 tidak selalu sama persis dengan 0,3.',
    },
  },
  cnconvert: {
    title: { en: 'Interactive: write any number in Chinese', id: 'Interaktif: tulis bilangan apa pun dalam bahasa China' },
    description: {
      en: 'Type a number up to 999,999,999,999 and see it written in Chinese characters with pinyin, split into groups of four digits, in simplified, traditional or formal numerals.',
      id: 'Ketik bilangan hingga 999.999.999.999 dan lihat penulisannya dalam aksara China beserta pinyin, dibagi menjadi kelompok empat angka, dalam angka sederhana, tradisional, atau formal.',
    },
  },
  cnread: {
    title: { en: 'Interactive: read the Chinese number', id: 'Interaktif: baca bilangan China-nya' },
    description: {
      en: 'Eight Chinese numbers of growing size: read each one and choose its value, with pinyin on request and an explanation after every answer.',
      id: 'Delapan bilangan China dengan ukuran yang makin besar: baca masing-masing dan pilih nilainya, dengan pinyin bila diminta dan penjelasan setelah tiap jawaban.',
    },
  },
  grouping: {
    title: { en: 'Interactive: groups of three or groups of four?', id: 'Interaktif: kelompok tiga atau kelompok empat?' },
    description: {
      en: 'Type a number and see it grouped in threes, as English and Indonesian do, beside the same number grouped in fours with 万 and 亿, as Chinese does.',
      id: 'Ketik sebuah bilangan dan lihat ia dikelompokkan tiga-tiga seperti bahasa Inggris dan Indonesia, di samping bilangan yang sama dikelompokkan empat-empat dengan 万 dan 亿 seperti bahasa China.',
    },
  },
  rods: {
    title: { en: 'Interactive: counting rods', id: 'Interaktif: batang hitung' },
    description: {
      en: 'Type a number and see it laid out in counting rods, with the direction of the rods alternating between places and zero left as a gap, next to its Suzhou numerals.',
      id: 'Ketik sebuah bilangan dan lihat ia disusun dengan batang hitung, arah batang bergantian antartempat dan nol dibiarkan kosong, di samping angka Suzhou-nya.',
    },
  },
}
