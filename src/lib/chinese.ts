/** Mandarin number words, both directions, for the "Numbers in Chinese" article.
 *
 *  `toChinese` writes a whole number (0 up to just under a trillion) the way it is
 *  read aloud in Standard Chinese; `fromChinese` reads such a string back. The
 *  pair exists so each can check the other: `tools/check-chinese-numbers.mjs`
 *  runs a list of readings from the standard rules and then round-trips tens of
 *  thousands of numbers through both.
 *
 *  The rules, which are the whole point of the article:
 *   - Digits are grouped in FOURS, not threes: 万 is 10^4 and 亿 is 10^8.
 *   - Inside a group, 千 百 十 follow their digit; zero digits at the end of a
 *     group are not read.
 *   - A gap of one or more zeros between two non-zero digits is read as a single
 *     零 — including a gap that falls across a 万 or 亿 boundary.
 *   - 二 becomes 两 before 千, 万 and 亿 (二百 and 两百 are both heard).
 *   - At the very start of a number, 10–19 is 十…, not 一十… (十, 十一, 十万);
 *     everywhere else the 一 stays (一百一十, 一万零一十). */

export type CnStyle = 'simplified' | 'traditional' | 'financial'

const DIGITS: Record<CnStyle, string[]> = {
  simplified: [...'零一二三四五六七八九'],
  traditional: [...'零一二三四五六七八九'],
  financial: [...'零壹贰叁肆伍陆柒捌玖'],
}
const SMALL: Record<CnStyle, string[]> = {
  simplified: ['', '十', '百', '千'],
  traditional: ['', '十', '百', '千'],
  financial: ['', '拾', '佰', '仟'],
}
const BIG: Record<CnStyle, string[]> = {
  simplified: ['', '万', '亿'],
  traditional: ['', '萬', '億'],
  financial: ['', '万', '亿'],
}
const TWO: Record<CnStyle, string> = { simplified: '两', traditional: '兩', financial: '贰' }

/** Pinyin with tone marks, as a textbook gives it (no tone-change rules applied). */
export const PINYIN: Record<string, string> = {
  零: 'líng', 〇: 'líng', 一: 'yī', 二: 'èr', 三: 'sān', 四: 'sì', 五: 'wǔ', 六: 'liù', 七: 'qī', 八: 'bā', 九: 'jiǔ',
  十: 'shí', 百: 'bǎi', 千: 'qiān', 万: 'wàn', 亿: 'yì', 两: 'liǎng',
  萬: 'wàn', 億: 'yì', 兩: 'liǎng',
  壹: 'yī', 贰: 'èr', 叁: 'sān', 肆: 'sì', 伍: 'wǔ', 陆: 'lù', 柒: 'qī', 捌: 'bā', 玖: 'jiǔ',
  拾: 'shí', 佰: 'bǎi', 仟: 'qiān',
}

export const pinyinOf = (chars: string): string => [...chars].map((c) => PINYIN[c] ?? c).join(' ')

/** What a reader should notice about how a number was written. */
export type CnNote = 'zero' | 'liang' | 'tenDropped' | 'trailing' | 'wan' | 'yi'

export interface CnGroup {
  /** The group's value, 0–9999. */
  value: number
  /** `''`, `万` or `亿` (`萬`, `億`). */
  unit: string
  /** How the group itself is read, without its unit. */
  text: string
}

export interface CnResult {
  text: string
  pinyin: string
  groups: CnGroup[]
  notes: CnNote[]
}

export const MAX_CN = 999_999_999_999n

/** One group of up to four digits, e.g. 2050 → 两千零五十. `leading` is true for
 *  the first group of the whole number, the only place 一 may drop before 十. */
function readGroup(v: number, st: CnStyle, leading: boolean, notes: Set<CnNote>): string {
  const d = [Math.floor(v / 1000) % 10, Math.floor(v / 100) % 10, Math.floor(v / 10) % 10, v % 10]
  const small = SMALL[st]
  let out = ''
  let started = false
  let pendingZero = false
  for (let i = 0; i < 4; i++) {
    const digit = d[i]
    const unit = small[3 - i]
    if (digit === 0) {
      if (started) pendingZero = true
      continue
    }
    if (pendingZero) {
      out += DIGITS[st][0]
      notes.add('zero')
      pendingZero = false
    }
    if (digit === 1 && unit === '十' && !started && leading && st !== 'financial') {
      out += unit // 十, not 一十, at the head of a number
      notes.add('tenDropped')
    } else if (digit === 1 && unit === '拾' && !started && leading && st === 'financial') {
      out += DIGITS[st][1] + unit
    } else {
      const two = digit === 2 && unit === '千'
      if (two) notes.add('liang')
      out += (two ? TWO[st] : DIGITS[st][digit]) + unit
    }
    started = true
  }
  if (v % 10 === 0 && v !== 0) notes.add('trailing')
  return out
}

export function toChinese(n: bigint | number, st: CnStyle = 'simplified'): CnResult {
  const big = BigInt(n)
  if (big < 0n || big > MAX_CN) throw new RangeError('0 to 999 999 999 999')
  const notes = new Set<CnNote>()
  if (big === 0n) {
    const z = DIGITS[st][0]
    return { text: z, pinyin: pinyinOf(z), groups: [], notes: [] }
  }
  const x = Number(big)
  const parts = [
    { value: Math.floor(x / 1e8), unit: BIG[st][2] },
    { value: Math.floor(x / 1e4) % 1e4, unit: BIG[st][1] },
    { value: x % 1e4, unit: BIG[st][0] },
  ]
  let text = ''
  const groups: CnGroup[] = []
  let started = false
  let zeroPending = false
  for (const p of parts) {
    if (p.value === 0) {
      if (started) zeroPending = true
      continue
    }
    // A zero is read when an empty group, or a group that starts below 1000,
    // follows something already said — once, however many zeros there are.
    if (started && (p.value < 1000 || zeroPending)) {
      text += DIGITS[st][0]
      notes.add('zero')
    }
    let g: string
    if (p.value === 2 && p.unit !== '') {
      g = TWO[st] // 两万, 两亿
      notes.add('liang')
    } else {
      g = readGroup(p.value, st, !started, notes)
    }
    text += g + p.unit
    groups.push({ value: p.value, unit: p.unit, text: g })
    if (p.unit === BIG[st][1]) notes.add('wan')
    if (p.unit === BIG[st][2]) notes.add('yi')
    started = true
    zeroPending = false
  }
  return { text, pinyin: pinyinOf(text), groups, notes: [...notes] }
}

/* --------------------------------------------------------------- reading */

const DIGIT_VALUE: Record<string, number> = {
  零: 0, 〇: 0, 一: 1, 二: 2, 两: 2, 兩: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9,
  壹: 1, 贰: 2, 叁: 3, 肆: 4, 伍: 5, 陆: 6, 柒: 7, 捌: 8, 玖: 9,
}
const SMALL_VALUE: Record<string, number> = { 十: 10, 拾: 10, 百: 100, 佰: 100, 千: 1000, 仟: 1000 }

/** A written Chinese number back to its value, or null if it is not one. Reads
 *  numbers below 10^12, which is what `toChinese` writes. */
export function fromChinese(s: string): bigint | null {
  let total = 0 // everything already closed off by 亿
  let part = 0 // closed-off 万 groups
  let section = 0 // the group being read
  let num = 0
  let any = false
  for (const ch of s) {
    if (ch in DIGIT_VALUE) {
      num = DIGIT_VALUE[ch]
      any = true
    } else if (ch in SMALL_VALUE) {
      section += (num || 1) * SMALL_VALUE[ch]
      num = 0
      any = true
    } else if (ch === '万' || ch === '萬') {
      section += num
      part = (part + section) * 1e4
      section = 0
      num = 0
      any = true
    } else if (ch === '亿' || ch === '億') {
      total = (total + part + section + num) * 1e8
      part = 0
      section = 0
      num = 0
      any = true
    } else return null
  }
  if (!any) return null
  return BigInt(total + part + section + num)
}
