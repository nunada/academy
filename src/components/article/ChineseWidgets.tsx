import { useMemo, useState } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import { toChinese, type CnNote, type CnStyle } from '../../lib/chinese'
import { Frame, L, Zh, groupNumber } from './widgetKit'

/* ------------------------------------------------------------------ convert */

const NOTES: Record<CnNote, Loc> = {
  zero: L(
    'A gap of zeros is read as one 零 (líng), however many zeros it holds, and a gap across a 万 or 亿 boundary counts too.',
    'Satu atau beberapa angka nol berurutan dibaca satu 零 (líng) saja, dan celah yang melewati batas 万 atau 亿 juga dihitung.',
  ),
  liang: L(
    'A lone 2 before 千, 万 or 亿 is 两 (liǎng), not 二 (èr).',
    'Angka 2 yang berdiri sendiri sebelum 千, 万, atau 亿 dibaca 两 (liǎng), bukan 二 (èr).',
  ),
  tenDropped: L(
    '10 to 19 at the very start of a number drops the 一: it is 十, not 一十.',
    '10 sampai 19 di awal sebuah bilangan menghilangkan 一: dibaca 十, bukan 一十.',
  ),
  trailing: L(
    'Zeros at the end of a group are not read: 2050 is 两千零五十, with nothing for the last 0.',
    'Nol di ujung sebuah kelompok tidak dibaca: 2050 adalah 两千零五十, tanpa apa-apa untuk 0 terakhir.',
  ),
  wan: L('万 (wàn) is 10,000: the next group of four digits.', '万 (wàn) adalah 10.000: kelompok empat angka berikutnya.'),
  yi: L('亿 (yì) is 100,000,000: the group of four above 万.', '亿 (yì) adalah 100.000.000: kelompok empat di atas 万.'),
}

const PRESETS = ['10', '12', '101', '2020', '10000', '100000', '20508030', '123456789', '100000000']

/** A random number with zeros in it, because zeros are where the rules bite. */
function randomNumber(): string {
  const len = 3 + Math.floor(Math.random() * 9)
  const d = Array.from({ length: len }, (_, i) => (i === 0 ? 1 + Math.floor(Math.random() * 9) : Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 10)))
  return d.join('')
}

export function ChineseConvert() {
  const { tc } = useI18n()
  const [text, setText] = useState('20508030')
  const [style, setStyle] = useState<CnStyle>('simplified')

  const digits = text.replace(/[\s.,]/g, '')
  const valid = /^\d{1,12}$/.test(digits)
  const r = valid ? toChinese(BigInt(digits), style) : null

  const styles: [CnStyle, Loc][] = [
    ['simplified', L('Simplified', 'Sederhana')],
    ['traditional', L('Traditional', 'Tradisional')],
    ['financial', L('Formal (checks)', 'Formal (cek)')],
  ]

  return (
    <Frame name="cnconvert">
      <div className="inrow">
        <input
          style={{ width: '12em' }}
          inputMode="numeric"
          value={text}
          aria-label={tc(L('A number', 'Sebuah bilangan'))}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="chip" onClick={() => setText(randomNumber())}>
          🎲 {tc(L('Random', 'Acak'))}
        </button>
      </div>
      <div className="chips">
        {PRESETS.map((p) => (
          <button key={p} className={digits === p ? 'chip on' : 'chip'} onClick={() => setText(p)}>
            {p}
          </button>
        ))}
      </div>
      <div className="chips" role="group" aria-label={tc(L('Writing style', 'Gaya penulisan'))}>
        {styles.map(([id, label]) => (
          <button key={id} className={style === id ? 'chip on' : 'chip'} onClick={() => setStyle(id)}>
            {tc(label)}
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {r === null ? (
          <p className="muted">{tc(L('Type a whole number with up to 12 digits.', 'Ketik bilangan bulat dengan paling banyak 12 angka.'))}</p>
        ) : (
          <>
            <p className="bigcn">
              <Zh>{r.text}</Zh>
            </p>
            <p className="pinyin">{r.pinyin}</p>
            {r.groups.length > 0 && (
              <ul className="steps">
                {r.groups.map((g, i) => (
                  <li key={i}>
                    <b>{g.value}</b> → <Zh>{g.text}</Zh>
                    {g.unit && (
                      <>
                        {' '}
                        + <Zh>{g.unit}</Zh>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <ul className="notes">
              {r.notes
                .filter((n) => !(style === 'financial' && (n === 'liang' || n === 'tenDropped')))
                .map((n) => (
                  <li key={n}>{tc(NOTES[n])}</li>
                ))}
            </ul>
          </>
        )}
      </div>
    </Frame>
  )
}

/* --------------------------------------------------------------------- read */

function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface Question {
  n: number
  options: number[]
}

/** The i-th question: bigger every two rounds, with zeros in it, and wrong
 *  answers that are the mistakes people really make — a place too many or too
 *  few, two digits swapped, one digit off. */
function question(seed: number, i: number): Question {
  const r = rng(seed + i * 7919)
  const bands: [number, number][] = [
    [11, 99],
    [11, 99],
    [101, 9999],
    [101, 9999],
    [10000, 9999999],
    [10000, 9999999],
    [10000000, 9999999999],
    [10000000, 9999999999],
  ]
  const [lo, hi] = bands[i]
  let n = lo + Math.floor(r() * (hi - lo))
  if (i >= 2 && r() < 0.7) {
    const s = String(n).split('')
    for (let k = 1; k < s.length; k++) if (r() < 0.35) s[k] = '0'
    n = Number(s.join(''))
  }
  const wrong = new Set<number>()
  const add = (v: number) => {
    if (Number.isFinite(v) && v > 0 && v !== n && v <= 999999999999) wrong.add(v)
  }
  add(n * 10)
  if (n % 10 === 0) add(n / 10)
  const s = String(n)
  for (let k = 0; k < s.length - 1; k++) {
    if (s[k] !== s[k + 1]) add(Number(s.slice(0, k) + s[k + 1] + s[k] + s.slice(k + 2)))
  }
  const k = Math.floor(r() * s.length)
  add(Number(s.slice(0, k) + String((Number(s[k]) + 1 + Math.floor(r() * 8)) % 10) + s.slice(k + 1)) || n + 1)
  add(n * 100)
  add(n + 1)
  const pool = [...wrong].sort(() => r() - 0.5).slice(0, 3)
  const options = [n, ...pool].sort(() => r() - 0.5)
  return { n, options }
}

export function ChineseRead() {
  const { tc, lang } = useI18n()
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9))
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<(number | null)[]>(() => Array(8).fill(null))
  const [pinyin, setPinyin] = useState(false)

  const q = useMemo(() => (i < 8 ? question(seed, i) : null), [seed, i])
  const score = picked.filter((p, k) => p !== null && p === question(seed, k).n).length

  if (q === null) {
    return (
      <Frame name="cnread">
        <div className="wgtout">
          <p>
            <b>
              {score} / 8
            </b>{' '}
            {tc(
              score === 8
                ? L('Every number read correctly.', 'Semua bilangan terbaca dengan benar.')
                : L('Look again at the ones where a 万 or a 零 changed the answer.', 'Lihat lagi bilangan yang jawabannya berubah karena 万 atau 零.'),
            )}
          </p>
          <button
            className="btn ghost sm"
            onClick={() => {
              setSeed(Math.floor(Math.random() * 1e9))
              setI(0)
              setPicked(Array(8).fill(null))
            }}
          >
            {tc(L('Play again', 'Main lagi'))}
          </button>
        </div>
      </Frame>
    )
  }

  const r = toChinese(q.n)
  const given = picked[i]
  return (
    <Frame name="cnread">
      <p className="muted small">
        {i + 1} / 8 · {tc(L('Read the number and choose its value.', 'Baca bilangannya dan pilih nilainya.'))}
      </p>
      <p className="bigcn">
        <Zh>{r.text}</Zh>
      </p>
      <p className="pinyin">{pinyin ? r.pinyin : ' '}</p>
      <div className="chips">
        <button className="chip ghost" onClick={() => setPinyin((v) => !v)}>
          {pinyin ? tc(L('Hide pinyin', 'Sembunyikan pinyin')) : tc(L('Show pinyin', 'Tampilkan pinyin'))}
        </button>
      </div>
      <div className="chips" role="group">
        {q.options.map((o) => {
          const state = given === null ? '' : o === q.n ? ' right' : o === given ? ' wrong' : ''
          return (
            <button
              key={o}
              className={`chip${state}`}
              disabled={given !== null}
              onClick={() => setPicked((p) => p.map((v, k) => (k === i ? o : v)))}
            >
              {groupNumber(o, lang)}
            </button>
          )
        })}
      </div>
      {given !== null && (
        <div className={given === q.n ? 'verdict ok' : 'verdict no'} aria-live="polite">
          <b>{given === q.n ? tc(L('Correct!', 'Benar!')) : tc(L('Not quite.', 'Belum tepat.'))}</b>{' '}
          <Zh>{r.text}</Zh> = {groupNumber(q.n, lang)}.{' '}
          {r.groups.length > 0 &&
            r.groups.map((g, k) => (
              <span key={k}>
                {k > 0 ? ' · ' : ''}
                <Zh>{g.text}</Zh>
                {g.unit && <Zh>{g.unit}</Zh>} = {groupNumber(g.value * (g.unit === '亿' ? 1e8 : g.unit === '万' ? 1e4 : 1), lang)}
              </span>
            ))}
          <div style={{ marginTop: 8 }}>
            <button className="btn sm" onClick={() => setI(i + 1)}>
              {i + 1 === 8 ? tc(L('See score', 'Lihat skor')) : tc(L('Next →', 'Lanjut →'))}
            </button>
          </div>
        </div>
      )}
    </Frame>
  )
}

/* ----------------------------------------------------------------- grouping */

const LANDMARKS = ['10000', '100000', '1000000', '10000000', '100000000', '1000000000', '1000000000000']

export function ChineseGrouping() {
  const { tc, lang } = useI18n()
  const [text, setText] = useState('123456789')
  const digits = text.replace(/[\s.,]/g, '')
  const valid = /^\d{1,12}$/.test(digits)

  // From the right, three digits at a time for English and Indonesian, four for Chinese.
  const fours = valid ? (digits.replace(/\B(?=(\d{4})+(?!\d))/g, ',').split(',')) : []
  const units = ['', '万', '亿', '万亿']
  const n = valid ? BigInt(digits) : 0n
  const inWan = valid && n >= 10000n ? Number(n) / 1e4 : null
  const fmtDec = (v: number) => {
    const t = String(+v.toFixed(4))
    return lang === 'id' ? t.replace('.', ',') : t
  }

  return (
    <Frame name="grouping">
      <div className="inrow">
        <input style={{ width: '12em' }} inputMode="numeric" value={text} aria-label={tc(L('A number', 'Sebuah bilangan'))} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="chips">
        {LANDMARKS.map((p) => (
          <button key={p} className={digits === p ? 'chip on' : 'chip'} onClick={() => setText(p)}>
            {groupNumber(BigInt(p), lang)}
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {!valid ? (
          <p className="muted">{tc(L('Type a whole number with up to 12 digits.', 'Ketik bilangan bulat dengan paling banyak 12 angka.'))}</p>
        ) : (
          <>
            <div className="grouprow">
              <span className="grouplabel">{tc(L('Groups of three (English, Indonesian)', 'Kelompok tiga (Inggris, Indonesia)'))}</span>
              <span className="groupval">{groupNumber(n, lang)}</span>
            </div>
            <div className="grouprow">
              <span className="grouplabel">{tc(L('Groups of four (Chinese)', 'Kelompok empat (China)'))}</span>
              <span className="groupval">
                {fours.map((g, i) => {
                  const unit = units[fours.length - 1 - i]
                  return (
                    <span key={i} className="fourchip">
                      {g}
                      {unit && <Zh className="unitmark">{unit}</Zh>}
                    </span>
                  )
                })}
              </span>
            </div>
            <p>
              <Zh className="bigcn">{toChinese(n).text}</Zh>
            </p>
            {inWan !== null && (
              <p className="small">
                {groupNumber(n, lang)} = {fmtDec(inWan)} <Zh>万</Zh>
                {n >= 100000000n && (
                  <>
                    {' '}
                    = {fmtDec(Number(n) / 1e8)} <Zh>亿</Zh>
                  </>
                )}
              </p>
            )}
          </>
        )}
      </div>
    </Frame>
  )
}

/* --------------------------------------------------------------------- rods */

const SUPERSCRIPT = '⁰¹²³⁴⁵⁶⁷⁸⁹'
/** `3 × 10⁴`: short enough for a column 72 units wide, and it is the place value itself. */
const placeLabel = (d: number, place: number): string =>
  place === 0 ? `${d} × 1` : `${d} × 10${[...String(place)].map((c) => SUPERSCRIPT[Number(c)]).join('')}`

const SUZHOU = ['〇', '〡', '〢', '〣', '〤', '〥', '〦', '〧', '〨', '〩']

/** One digit as rods. Vertical rods stand in the ones, hundreds, … places and
 *  horizontal rods lie in the tens, thousands, … places, so two neighboring
 *  digits can never run together. 1–5 are that many rods; 6–9 are one rod across
 *  for five, plus the rest. Zero is nothing at all. */
function Rods({ d, vertical, x }: { d: number; vertical: boolean; x: number }) {
  if (d === 0) return null
  const lines: [number, number, number, number][] = []
  const cx = x + 32
  const cy = 52
  const sp = 10
  const rest = d > 5 ? d - 5 : d
  const pos = (k: number) => (k - (rest - 1) / 2) * sp
  if (vertical) {
    if (d > 5) lines.push([cx - 26, cy - 30, cx + 26, cy - 30])
    for (let k = 0; k < rest; k++) lines.push([cx + pos(k), d > 5 ? cy - 20 : cy - 32, cx + pos(k), cy + 34])
  } else {
    if (d > 5) lines.push([cx - 30, cy - 30, cx - 30, cy + 30])
    for (let k = 0; k < rest; k++) lines.push([d > 5 ? cx - 18 : cx - 30, cy + pos(k), cx + 30, cy + pos(k)])
  }
  return (
    <g>
      {lines.map((l, i) => (
        <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} className="rod" />
      ))}
    </g>
  )
}

export function ChineseRods() {
  const { tc } = useI18n()
  const [text, setText] = useState('3014')
  const digits = text.replace(/[\s.,]/g, '')
  const valid = /^\d{1,8}$/.test(digits)
  const ds = valid ? [...digits].map(Number) : []

  return (
    <Frame name="rods">
      <div className="inrow">
        <input style={{ width: '10em' }} inputMode="numeric" value={text} aria-label={tc(L('A number', 'Sebuah bilangan'))} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="chips">
        {['1', '5', '6', '37', '208', '3014', '98765'].map((p) => (
          <button key={p} className={digits === p ? 'chip on' : 'chip'} onClick={() => setText(p)}>
            {p}
          </button>
        ))}
      </div>
      {!valid ? (
        <p className="muted">{tc(L('Type a whole number with up to 8 digits.', 'Ketik bilangan bulat dengan paling banyak 8 angka.'))}</p>
      ) : (
        <>
          <svg viewBox={`0 0 ${ds.length * 72} 128`} className="rodsvg" role="img" aria-label={tc(L('Counting rods', 'Batang hitung'))}>
            {ds.map((d, i) => {
              const place = ds.length - 1 - i
              const x = i * 72
              return (
                <g key={i}>
                  <rect x={x + 2} y={4} width={68} height={92} rx={8} className="rodcell" />
                  <Rods d={d} vertical={place % 2 === 0} x={x + 2} />
                  {d === 0 && (
                    <text x={x + 36} y={56} textAnchor="middle" className="rodgap">
                      {tc(L('empty', 'kosong'))}
                    </text>
                  )}
                  <text x={x + 36} y={112} textAnchor="middle" className="rodlabel">
                    {placeLabel(d, place)}
                  </text>
                  <text x={x + 36} y={124} textAnchor="middle" className="rodlabel dim">
                    {place % 2 === 0 ? '|||' : '≡'}
                  </text>
                </g>
              )
            })}
          </svg>
          <div className="wgtout">
            <p>
              {tc(L('Suzhou numerals', 'Angka Suzhou'))}: <Zh className="bigcn">{ds.map((d) => SUZHOU[d]).join('')}</Zh>
            </p>
            <p>
              {tc(L('Spoken', 'Dibaca'))}: <Zh>{toChinese(BigInt(digits)).text}</Zh>
            </p>
          </div>
        </>
      )}
    </Frame>
  )
}
