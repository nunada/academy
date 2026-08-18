/** Runs the learner's markup in a sandboxed iframe, and checks it there.
 *
 *  The checks execute *inside* the frame and report back over `postMessage`,
 *  rather than the parent reaching into `contentDocument`. That is deliberate:
 *  it lets the frame stay on an opaque origin (`sandbox="allow-scripts"` with no
 *  `allow-same-origin`), so anything the learner writes — including a stray
 *  `<script>` — cannot touch the page hosting the app. The same runner will
 *  serve CSS, JavaScript and React, where learner scripts are the whole point. */

import type { WebTest } from '../content/types'

export interface WebOutcome {
  test: WebTest
  passed: boolean
  /** Why it failed, in the learner's own terms. */
  detail?: string
}

/** Wrap a fragment in a full document, but leave a complete one alone.
 *  Early lessons write only `<h1>…</h1>`; later ones write the whole page. */
export function buildDocument(source: string): string {
  const looksComplete = /<html[\s>]/i.test(source) || /<!doctype/i.test(source)
  if (looksComplete) return source
  return `<!doctype html>\n<html lang="id">\n<head>\n<meta charset="utf-8">\n</head>\n<body>\n${source}\n</body>\n</html>`
}

/** The document handed to the preview pane — no checker, nothing injected. */
export function previewDocument(source: string): string {
  return buildDocument(source)
}

const HARNESS = (nonce: string, checks: string[]) => `
<script>
(function () {
  function report(results) {
    parent.postMessage({ nunada: ${JSON.stringify(nonce)}, results: results }, "*");
  }

  function run() {
    var doc = document;
    var sel = function (q) { return doc.querySelector(q); };
    var all = function (q) { return Array.prototype.slice.call(doc.querySelectorAll(q)); };
    var text = function (q) { var e = sel(q); return e ? (e.textContent || "").trim() : ""; };
    var attr = function (q, a) { var e = sel(q); return e ? e.getAttribute(a) : null; };
    var assert = function (cond, msg) { if (!cond) throw new Error(msg || "pemeriksaan gagal"); };

    var checks = ${JSON.stringify(checks)};
    var results = [];
    for (var i = 0; i < checks.length; i++) {
      try {
        // eslint-disable-next-line no-new-func
        var fn = new Function("doc", "sel", "all", "text", "attr", "assert", checks[i]);
        fn(doc, sel, all, text, attr, assert);
        results.push({ passed: true });
      } catch (err) {
        results.push({ passed: false, detail: String((err && err.message) || err) });
      }
    }
    report(results);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
</script>`

/** Put the harness last so the learner's markup has already parsed. */
function documentWithHarness(source: string, nonce: string, checks: string[]): string {
  const doc = buildDocument(source)
  const harness = HARNESS(nonce, checks)
  if (/<\/body>/i.test(doc)) return doc.replace(/<\/body>/i, `${harness}\n</body>`)
  return doc + harness
}

const TIMEOUT_MS = 4000

export async function runWebTests(source: string, tests: WebTest[]): Promise<WebOutcome[]> {
  if (!tests.length) return []

  const nonce = `n${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
  const frame = document.createElement('iframe')
  frame.setAttribute('sandbox', 'allow-scripts')
  frame.setAttribute('aria-hidden', 'true')
  frame.style.cssText = 'position:absolute;width:800px;height:600px;left:-10000px;top:0;border:0;'

  const failAll = (detail: string): WebOutcome[] => tests.map((test) => ({ test, passed: false, detail }))

  try {
    return await new Promise<WebOutcome[]>((resolve) => {
      let settled = false

      const finish = (outcomes: WebOutcome[]) => {
        if (settled) return
        settled = true
        window.removeEventListener('message', onMessage)
        window.clearTimeout(timer)
        resolve(outcomes)
      }

      function onMessage(event: MessageEvent) {
        const data = event.data as { nunada?: string; results?: { passed: boolean; detail?: string }[] }
        if (!data || data.nunada !== nonce || !Array.isArray(data.results)) return
        finish(
          tests.map((test, i) => ({
            test,
            passed: Boolean(data.results?.[i]?.passed),
            detail: data.results?.[i]?.detail,
          })),
        )
      }

      const timer = window.setTimeout(
        () =>
          finish(
            failAll(
              'Halaman tidak selesai dimuat. Periksa apakah ada tag yang belum ditutup. / The page never finished loading — check for an unclosed tag.',
            ),
          ),
        TIMEOUT_MS,
      )

      window.addEventListener('message', onMessage)
      frame.srcdoc = documentWithHarness(
        source,
        nonce,
        tests.map((t) => t.check),
      )
      document.body.appendChild(frame)
    })
  } catch (err) {
    return failAll(String((err as Error).message ?? err))
  } finally {
    frame.remove()
  }
}
