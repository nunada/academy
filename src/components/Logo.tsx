/** The Nunada mark, redrawn as vector from the add-in's `icon-128.png`.
 *
 *  Geometry was measured off that file so the two products show the same logo:
 *  the arch rides a centre line of radius 26 with a 26-wide round-capped stroke,
 *  and the dot is r=10.5 centred at (106, 23) in a 128 box.
 *
 *  The colours are fixed on purpose. Every other colour in the app is a token
 *  that flips with the theme, but a brand mark that changes hue is no longer the
 *  same mark — it stays terracotta and gold in light and dark alike. */

const ARCH = '#e16f47'
const DOT = '#dda52b'

export function Logo({ size = 32, title }: { size?: number; title?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title && <title>{title}</title>}
      <path
        d="M37.5 106 V58 A26 26 0 0 1 89.5 58 V106"
        fill="none"
        stroke={ARCH}
        strokeWidth="26"
        strokeLinecap="round"
      />
      <circle cx="106" cy="23" r="10.5" fill={DOT} />
    </svg>
  )
}
