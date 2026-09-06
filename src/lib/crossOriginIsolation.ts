/** Gets this page cross-origin isolated on a host — GitHub Pages — that
 *  cannot send the `Cross-Origin-Opener-Policy` / `Cross-Origin-Embedder-Policy`
 *  headers that isolation normally requires. See public/coi-serviceworker.js
 *  for the full story; this is just the registration side, called once from
 *  main.tsx before the app renders.
 *
 *  A page cannot become isolated after it has already loaded — the headers
 *  have to be present on the very response that started the navigation — so
 *  the first time the service worker installs, this reloads the page once to
 *  pick them up. `sessionStorage` guards against reloading forever if
 *  isolation still doesn't take (an old browser, service workers disabled by
 *  policy): after one attempt this gives up and the app renders anyway, with
 *  `pythonInteractiveAvailable` simply false. */

const RELOAD_GUARD = 'nunada.coiReloaded'

export async function ensureCrossOriginIsolated(base: string): Promise<void> {
  if (window.crossOriginIsolated) return
  if (!('serviceWorker' in navigator)) return

  try {
    await navigator.serviceWorker.register(`${base}coi-serviceworker.js`, { scope: base })
  } catch {
    return // no isolation this session; callers fall back gracefully
  }

  if (window.crossOriginIsolated) return // an earlier tab already installed it

  let alreadyReloaded = false
  try {
    alreadyReloaded = sessionStorage.getItem(RELOAD_GUARD) === '1'
  } catch {
    // Private browsing or a blocked store — treat as "already tried" so we
    // never risk looping, at the cost of possibly skipping isolation once.
    alreadyReloaded = true
  }
  if (alreadyReloaded) return

  try {
    sessionStorage.setItem(RELOAD_GUARD, '1')
  } catch {
    // Nothing to persist to — proceed with the reload anyway; worst case the
    // guard doesn't stick and a later load retries once more than ideal.
  }

  await navigator.serviceWorker.ready
  window.location.reload()
  // Never resolves on purpose: the reload is already underway, and letting
  // main.tsx's render call race it would just flash the app once for nothing.
  await new Promise(() => {})
}
