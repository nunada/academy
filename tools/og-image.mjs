/** The picture a link shows when it is shared (Open Graph / Twitter card).
 *
 *  Facebook, WhatsApp, LinkedIn and X read `og:image` and need a raster file (PNG or JPEG), not an SVG, so the
 *  article covers (SVG strings from src/content/articles/covers.ts) are drawn into a 1200x630 card with the title
 *  and rasterized here, at build time, with resvg. A card is: the brand and the title on the left, the article's
 *  own cover on the right, the address and a one-line kicker at the bottom.
 *
 *  Fonts come from the machine that builds. The font lists below name what a Windows or macOS machine has first
 *  and what the Ubuntu runner of the deploy workflow has after it (DejaVu, Liberation). */

import { Resvg } from '@resvg/resvg-js'

export const OG_WIDTH = 1200
export const OG_HEIGHT = 630

const SERIF = "Georgia, 'DejaVu Serif', 'Liberation Serif', 'Times New Roman', serif"
const SANS = "'Segoe UI', 'DejaVu Sans', 'Liberation Sans', Arial, Helvetica, sans-serif"

// The light theme's values of the tokens in styles.css, which the covers' classes refer to.
const COVER_CSS = `
.cv{stroke-linecap:round;stroke-linejoin:round}
.cv .bg{fill:#f3eede}
.cv .sa{fill:none;stroke:#24463d}.cv .sb{fill:none;stroke:#d4633c}.cv .sc{fill:none;stroke:#b8860b}
.cv .sr{fill:none;stroke:#4f8b56}.cv .sm{fill:none;stroke:#97a79c}.cv .st{fill:none;stroke:#24463d}
.cv .fa{fill:#24463d;stroke:none}.cv .fb{fill:#d4633c;stroke:none}.cv .fc{fill:#b8860b;stroke:none}
.cv .fr{fill:#4f8b56;stroke:none}.cv .fm{fill:#97a79c;stroke:none}
.cv .pa{fill:#24463d;fill-opacity:.3;stroke:#24463d;stroke-width:2}
.cv .pb{fill:#d4633c;fill-opacity:.3;stroke:#d4633c;stroke-width:2}
.cv .pc{fill:#b8860b;fill-opacity:.3;stroke:#b8860b;stroke-width:2}
.cv .pr{fill:#4f8b56;fill-opacity:.3;stroke:#4f8b56;stroke-width:2}
.cv .pm{fill:#97a79c;fill-opacity:.22;stroke:#97a79c;stroke-width:2}
.cv text{fill:#24463d;stroke:none;font-family:${SERIF};font-weight:700}
.cv text.tm{fill:#5f7066;font-weight:600}
.cv text.zh{font-family:'Noto Sans SC','Microsoft YaHei',sans-serif;font-weight:500}
`

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Rough width of a string in em, sized for the widest face the title may fall back to (DejaVu Sans Bold on the Ubuntu runner, which has no serif),
 *  so a line never runs out of its box on either machine. */
function emWidth(s) {
  let w = 0
  for (const ch of s) {
    if (ch === ' ') w += 0.34
    else if ('ilj.,:;!|\'`tf()[]'.includes(ch)) w += 0.38
    else if (/[A-Z]/.test(ch)) w += 0.84
    else if (/[mw]/.test(ch)) w += 1.0
    else if (/[0-9]/.test(ch)) w += 0.7
    else if (/[a-z]/.test(ch)) w += 0.67
    else w += 0.8
  }
  return w
}

/** Greedy wrap of `text` to `maxEm` ems. A word wider than a line stays on a line of its own. */
function wrap(text, maxEm) {
  const lines = []
  let cur = ''
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = cur ? `${cur} ${word}` : word
    if (cur && emWidth(next) > maxEm) {
      lines.push(cur)
      cur = word
    } else cur = next
  }
  if (cur) lines.push(cur)
  return lines
}

/** The largest size at which the title fits the box, and its lines (cut with an ellipsis if even the smallest size
 *  would not fit, which the 70-character title limit makes unlikely). */
function fitTitle(title, boxW, boxH) {
  for (const size of [66, 58, 50, 44, 40]) {
    const lines = wrap(title, boxW / size)
    if (lines.length * size * 1.2 <= boxH) return { size, lines }
  }
  const size = 40
  const max = Math.floor(boxH / (size * 1.2))
  const lines = wrap(title, boxW / size).slice(0, max)
  lines[lines.length - 1] = lines[lines.length - 1].replace(/[\s.,;:]*$/, '') + '…'
  return { size, lines }
}

/** A cover as a nested <svg> placed in a box, with its corners rounded by a clip path. */
function placeCover(cover, x, y, w, h, id) {
  const inner = cover.replace(/^<svg[^>]*>/, `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 400 200" class="cv" preserveAspectRatio="xMidYMid slice">`)
  return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14"/></clipPath><g clip-path="url(#${id})">${inner}</g>`
}

/** @param {{ title: string, kicker?: string, covers: string[], domain: string, brand: string }} o */
export function ogSvg({ title, kicker, covers, domain, brand }) {
  const LEFT = 72
  const boxW = 590
  const { size, lines } = fitTitle(title, boxW, 330)
  const top = 150
  const titleSvg = lines
    .map((l, i) => `<text x="${LEFT}" y="${top + size + i * size * 1.2}" font-size="${size}" font-weight="700" fill="#24463d" font-family="${SERIF}">${esc(l)}</text>`)
    .join('')

  // right-hand card: one cover large, or four in a grid
  const cardX = 700
  const cardW = 430
  let card
  if (covers.length >= 4) {
    const cw = 190
    const ch = 95
    const gap = 10
    const pad = 20
    const cardH = pad * 2 + ch * 2 + gap
    const cardY = Math.round((OG_HEIGHT - cardH) / 2) - 10
    card =
      `<rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="26" fill="#fffdf8" stroke="#e7e0cd" stroke-width="3"/>` +
      covers
        .slice(0, 4)
        .map((c, i) => placeCover(c, cardX + pad + (i % 2) * (cw + gap), cardY + pad + Math.floor(i / 2) * (ch + gap), cw, ch, `c${i}`))
        .join('')
  } else {
    const pad = 15
    const cw = cardW - pad * 2
    const ch = cw / 2
    const cardH = ch + pad * 2
    const cardY = Math.round((OG_HEIGHT - cardH) / 2) - 10
    card =
      `<rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="26" fill="#fffdf8" stroke="#e7e0cd" stroke-width="3"/>` + placeCover(covers[0], cardX + pad, cardY + pad, cw, ch, 'c0')
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}">
<style>${COVER_CSS}</style>
<rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="#fbf7ec"/>
<rect x="0" y="0" width="14" height="${OG_HEIGHT}" fill="#24463d"/>
<circle cx="${LEFT + 20}" cy="78" r="20" fill="#24463d"/>
<path d="M${LEFT + 12} 87 V69 L${LEFT + 28} 87 V69" fill="none" stroke="#fbf7ec" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<text x="${LEFT + 54}" y="88" font-size="32" font-weight="700" fill="#24463d" font-family="${SANS}">${esc(brand)}</text>
${titleSvg}
${card}
${kicker ? `<text x="${LEFT}" y="546" font-size="30" fill="#5f7066" font-family="${SANS}">${esc(kicker)}</text>` : ''}
<text x="${LEFT}" y="586" font-size="30" font-weight="700" fill="#d4633c" font-family="${SANS}">${esc(domain)}</text>
</svg>`
}

/** SVG text → PNG bytes. */
export function renderPng(svg) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: OG_WIDTH },
    font: { loadSystemFonts: true, defaultFontFamily: 'DejaVu Sans' },
    background: '#fbf7ec',
  })
  return resvg.render().asPng()
}
