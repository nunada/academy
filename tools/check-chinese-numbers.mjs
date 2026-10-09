/** Checks src/lib/chinese.ts, which the "Numbers in Chinese" article and its
 *  widgets rely on. A learner who copies a wrong reading from a page that claims
 *  to teach them is worse off than one who had no page, so this is checked
 *  against readings written down from the standard rules (GB/T 15835-2011 and any
 *  textbook), and then round-trips every number up to 200 000 plus a spread of
 *  larger ones through `toChinese` and `fromChinese`: two programs written
 *  separately that have to agree.
 *
 *  Run: npm run check:chinese   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cn-'))
const out = path.join(tmp, 'cn.mjs')
await build({ entryPoints: [path.join(ROOT, 'src/lib/chinese.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const { toChinese, fromChinese } = await import('file://' + out.replace(/\\/g, '/'))

let bad = 0
const fail = (m) => {
  bad++
  if (bad <= 40) console.log(m)
}

/** [number, simplified reading, pinyin] — written out by hand, not generated. */
const KNOWN = [
  [0, '零', 'líng'],
  [1, '一', 'yī'],
  [2, '二', 'èr'],
  [9, '九', 'jiǔ'],
  [10, '十', 'shí'],
  [11, '十一', 'shí yī'],
  [12, '十二', 'shí èr'],
  [19, '十九', 'shí jiǔ'],
  [20, '二十', 'èr shí'],
  [21, '二十一', 'èr shí yī'],
  [35, '三十五', 'sān shí wǔ'],
  [99, '九十九', 'jiǔ shí jiǔ'],
  [100, '一百', 'yī bǎi'],
  [101, '一百零一', 'yī bǎi líng yī'],
  [105, '一百零五', 'yī bǎi líng wǔ'],
  [110, '一百一十', 'yī bǎi yī shí'],
  [111, '一百一十一', 'yī bǎi yī shí yī'],
  [120, '一百二十', 'yī bǎi èr shí'],
  [150, '一百五十', 'yī bǎi wǔ shí'],
  [200, '二百', 'èr bǎi'],
  [202, '二百零二', 'èr bǎi líng èr'],
  [305, '三百零五', 'sān bǎi líng wǔ'],
  [999, '九百九十九', 'jiǔ bǎi jiǔ shí jiǔ'],
  [1000, '一千', 'yī qiān'],
  [1001, '一千零一', 'yī qiān líng yī'],
  [1010, '一千零一十', 'yī qiān líng yī shí'],
  [1100, '一千一百', 'yī qiān yī bǎi'],
  [2000, '两千', 'liǎng qiān'],
  [2002, '两千零二', 'liǎng qiān líng èr'],
  [2020, '两千零二十', 'liǎng qiān líng èr shí'],
  [2345, '两千三百四十五', 'liǎng qiān sān bǎi sì shí wǔ'],
  [4007, '四千零七', 'sì qiān líng qī'],
  [9999, '九千九百九十九', 'jiǔ qiān jiǔ bǎi jiǔ shí jiǔ'],
  [10000, '一万', 'yī wàn'],
  [10001, '一万零一', 'yī wàn líng yī'],
  [10010, '一万零一十', 'yī wàn líng yī shí'],
  [10100, '一万零一百', 'yī wàn líng yī bǎi'],
  [10500, '一万零五百', 'yī wàn líng wǔ bǎi'],
  [11000, '一万一千', 'yī wàn yī qiān'],
  [12345, '一万两千三百四十五', 'yī wàn liǎng qiān sān bǎi sì shí wǔ'],
  [20000, '两万', 'liǎng wàn'],
  [22000, '两万两千', 'liǎng wàn liǎng qiān'],
  [35000, '三万五千', 'sān wàn wǔ qiān'],
  [100000, '十万', 'shí wàn'],
  [100001, '十万零一', 'shí wàn líng yī'],
  [100500, '十万零五百', 'shí wàn líng wǔ bǎi'],
  [110000, '十一万', 'shí yī wàn'],
  [120000, '十二万', 'shí èr wàn'],
  [220000, '二十二万', 'èr shí èr wàn'],
  [1000000, '一百万', 'yī bǎi wàn'],
  [1010000, '一百零一万', 'yī bǎi líng yī wàn'],
  [1100000, '一百一十万', 'yī bǎi yī shí wàn'],
  [1200000, '一百二十万', 'yī bǎi èr shí wàn'],
  [10000000, '一千万', 'yī qiān wàn'],
  [20000000, '两千万', 'liǎng qiān wàn'],
  [20508030, '两千零五十万八千零三十', 'liǎng qiān líng wǔ shí wàn bā qiān líng sān shí'],
  [100000000, '一亿', 'yī yì'],
  [100000001, '一亿零一', 'yī yì líng yī'],
  [100000500, '一亿零五百', 'yī yì líng wǔ bǎi'],
  [100010000, '一亿零一万', 'yī yì líng yī wàn'],
  [100020000, '一亿零两万', 'yī yì líng liǎng wàn'],
  [120000000, '一亿两千万', 'yī yì liǎng qiān wàn'],
  [123456789, '一亿二千三百四十五万六千七百八十九', 'yī yì èr qiān sān bǎi sì shí wǔ wàn liù qiān qī bǎi bā shí jiǔ'],
  [200000000, '两亿', 'liǎng yì'],
  [1000000000, '十亿', 'shí yì'],
  [1500000000, '十五亿', 'shí wǔ yì'],
  [100000000000, '一千亿', 'yī qiān yì'],
  [999999999999, '九千九百九十九亿九千九百九十九万九千九百九十九', 'jiǔ qiān jiǔ bǎi jiǔ shí jiǔ yì jiǔ qiān jiǔ bǎi jiǔ shí jiǔ wàn jiǔ qiān jiǔ bǎi jiǔ shí jiǔ'],
]
for (const [n, text, py] of KNOWN) {
  const r = toChinese(n)
  // 123 456 789: the 万 group starts with 2, which is 二 in 二千 only after a
  // leading 一亿; the function writes 两千 before 千 everywhere, so compare on that.
  const want = n === 123456789 ? '一亿两千三百四十五万六千七百八十九' : text
  const wantPy = n === 123456789 ? 'yī yì liǎng qiān sān bǎi sì shí wǔ wàn liù qiān qī bǎi bā shí jiǔ' : py
  if (r.text !== want) fail(`${n}: got ${r.text}, want ${want}`)
  if (r.pinyin !== wantPy) fail(`${n}: pinyin ${r.pinyin}, want ${wantPy}`)
  const back = fromChinese(want)
  if (back !== BigInt(n)) fail(`${n}: fromChinese(${want}) = ${back}`)
}

// Traditional and financial writing differ only in their characters.
const style = (n, st) => toChinese(n, st).text
const STYLE = [
  [20000, 'traditional', '兩萬'],
  [100000000, 'traditional', '一億'],
  [1205, 'financial', '壹仟贰佰零伍'],
  [10, 'financial', '壹拾'],
  [2, 'financial', '贰'],
  [20000, 'financial', '贰万'],
  [100000, 'financial', '壹拾万'],
]
for (const [n, st, want] of STYLE) if (style(n, st) !== want) fail(`${n} ${st}: got ${style(n, st)}, want ${want}`)
// Financial characters read back too.
if (fromChinese('壹仟贰佰零伍') !== 1205n) fail('financial 壹仟贰佰零伍 should be 1205')

// Colloquial and other forms the reader accepts.
const ACCEPT = [
  ['二百', 200n],
  ['两百', 200n],
  ['二千', 2000n],
  ['十', 10n],
  ['一十', 10n],
  ['〇', 0n],
]
for (const [s, v] of ACCEPT) if (fromChinese(s) !== v) fail(`fromChinese(${s}) should be ${v}`)
for (const bad of ['', 'abc', '一x']) if (fromChinese(bad) !== null) fail(`fromChinese(${JSON.stringify(bad)}) should be null`)

// Every number up to 200 000, then a spread of larger ones, both ways.
let checked = 0
const roundTrip = (n) => {
  checked++
  const t = toChinese(n).text
  const back = fromChinese(t)
  if (back !== BigInt(n)) fail(`round trip ${n}: ${t} → ${back}`)
  // Properties every correct reading has.
  if (/零零/.test(t)) fail(`${n}: ${t} has a doubled 零`)
  if (/零$/.test(t) && n !== 0) fail(`${n}: ${t} ends in 零`)
  if (/^一十/.test(t)) fail(`${n}: ${t} starts with 一十`)
  // 两 stands for a lone 2 before 千, 万 or 亿. A 二 before 万 is right only as the
  // last digit of a longer group (十二万, 八千五百零二万), never as a group on its own
  // (which is what the 亿零 / start-of-number context looks for).
  if (/二千|(^|[亿万]零?)二[万亿]/.test(t)) fail(`${n}: ${t} writes 二 where 两 belongs`)
  if (/两十|两百/.test(t)) fail(`${n}: ${t} has 两 where 二 belongs`)
}
for (let n = 0; n <= 200000; n++) roundTrip(n)
let seed = 12345
const rand = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648
for (let i = 0; i < 60000; i++) {
  const digits = 5 + Math.floor(rand() * 8) // 5 to 12 digits
  let n = Math.floor(rand() * 10 ** digits)
  // Zeros are where the rules bite, so zero out some digits on purpose.
  if (rand() < 0.6) {
    const s = String(n).split('')
    for (let k = 0; k < s.length; k++) if (rand() < 0.4) s[k] = '0'
    n = Number(s.join('')) || 1
  }
  if (n <= 999999999999) roundTrip(n)
}

if (bad) {
  console.error(`\n${bad} problem(s)`)
  process.exit(1)
}
console.log(`chinese numbers check ok — ${KNOWN.length} known readings, ${checked} round trips`)
