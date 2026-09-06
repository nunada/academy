/** Makes this site cross-origin isolated on a host that cannot set
 *  `Cross-Origin-Opener-Policy` / `Cross-Origin-Embedder-Policy` response
 *  headers itself — GitHub Pages, where this app is deployed, is exactly
 *  such a host. Those two headers are what let a page use
 *  `SharedArrayBuffer` and `Atomics.wait`, which is how a learner's Python
 *  `input()` call can genuinely pause mid-program while they type an answer
 *  (see src/lib/pythonWorker.ts) without freezing the tab.
 *
 *  The trick (well known as "coi-serviceworker"): intercept every request
 *  this origin makes and re-issue the response with those headers added,
 *  from inside a service worker — a layer a static host has no say over.
 *  A page cannot become cross-origin isolated retroactively, so the very
 *  first load under a freshly-installed worker still has to reload once;
 *  every load after that is isolated from the start. See registration in
 *  src/main.tsx.
 *
 *  `credentialless` is preferred over `require-corp`: it does not demand
 *  that every cross-origin subresource (Pyodide's files, served from
 *  jsdelivr) carry its own `Cross-Origin-Resource-Policy` header, which is
 *  one less thing outside this project's control to depend on. */

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

self.addEventListener('fetch', (event) => {
  const { request } = event
  // Only same-origin requests need rewriting — a cross-origin one (Pyodide's
  // CDN) already carries whatever headers its own server sends, and this
  // worker adding COOP/COEP to someone else's response would do nothing
  // useful and could only cause a fetch to fail unexpectedly.
  if (new URL(request.url).origin !== self.location.origin) return

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.status === 0) return response // opaque response, leave alone

        const headers = new Headers(response.headers)
        headers.set('Cross-Origin-Opener-Policy', 'same-origin')
        headers.set('Cross-Origin-Embedder-Policy', 'credentialless')

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        })
      })
      .catch((err) => {
        console.error('coi-serviceworker fetch failed', err)
        throw err
      }),
  )
})
