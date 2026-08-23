/** Runs the learner's work in a sandboxed iframe, and checks it there.
 *
 *  The checks execute *inside* the frame and report back over `postMessage`,
 *  rather than the parent reaching into `contentDocument`. That is deliberate:
 *  it lets the frame stay on an opaque origin (`sandbox="allow-scripts"` with no
 *  `allow-same-origin`), so anything the learner writes — including a stray
 *  `<script>` — cannot touch the page hosting the app. The same runner will
 *  serve JavaScript and React, where learner scripts are the whole point. */

import type { WebTest } from '../content/types'

export interface WebOutcome {
  test: WebTest
  passed: boolean
  /** Why it failed, in the learner's own terms. */
  detail?: string
}

/** Wrap a fragment in a full document, but leave a complete one alone.
 *  Early lessons write only `<h1>…</h1>`; later ones write the whole page. */
function wrap(source: string): string {
  const looksComplete = /<html[\s>]/i.test(source) || /<!doctype/i.test(source)
  if (looksComplete) return source
  return `<!doctype html>\n<html lang="id">\n<head>\n<meta charset="utf-8">\n</head>\n<body>\n${source}\n</body>\n</html>`
}

/** Case-insensitive search for a closing tag, since learners type either case. */
function indexOfTag(doc: string, tag: string): number {
  return doc.toLowerCase().indexOf(tag)
}

/** Build the page under test.
 *
 *  With no `html`, `source` *is* the markup — that is the HTML course.
 *  With `html`, the markup is fixed and `source` is CSS applied to it — that is
 *  the CSS course, where the page is context rather than the exercise. */
export function buildDocument(source: string, html?: string): string {
  if (html === undefined) return wrap(source)

  const style = `<style>\n${source}\n</style>`
  const doc = wrap(html)

  const head = indexOfTag(doc, '</head>')
  if (head !== -1) return doc.slice(0, head) + style + '\n' + doc.slice(head)

  const body = indexOfTag(doc, '</body>')
  if (body !== -1) return doc.slice(0, body) + style + '\n' + doc.slice(body)

  return doc + style
}

/** The document handed to the preview pane — no checker, nothing injected. */
export function previewDocument(source: string, html?: string): string {
  return buildDocument(source, html)
}

const HARNESS = (nonce: string, checks: string[]) => `
<script>
(function () {
  function report(results) {
    parent.postMessage({ nunada: ${JSON.stringify(nonce)}, results: results }, "*");
  }

  function run() {
    var doc = document;
    // Reading a layout property forces the browser to compute layout right now.
    // Without it, getBoundingClientRect reports 0 and getComputedStyle hands back
    // declared values like "repeat(3, 1fr)" instead of resolved pixels.
    void (doc.body && doc.body.offsetHeight);
    var sel = function (q) { return doc.querySelector(q); };
    var all = function (q) { return Array.prototype.slice.call(doc.querySelectorAll(q)); };
    var text = function (q) { var e = sel(q); return e ? (e.textContent || "").trim() : ""; };
    var attr = function (q, a) { var e = sel(q); return e ? e.getAttribute(a) : null; };
    var style = function (q, prop) {
      var e = sel(q);
      if (!e) return null;
      return getComputedStyle(e).getPropertyValue(prop).trim();
    };
    // The whole stylesheet as text. getComputedStyle cannot see a :hover rule or
    // a media query that is not currently matching, so those are checked here.
    var css = function () {
      var out = "";
      for (var i = 0; i < doc.styleSheets.length; i++) {
        try {
          var r = doc.styleSheets[i].cssRules;
          for (var j = 0; j < r.length; j++) out += r[j].cssText + "\\n";
        } catch (e) {
          /* a sheet we may not read; nothing to add */
        }
      }
      return out;
    };
    var assert = function (cond, msg) { if (!cond) throw new Error(msg || "pemeriksaan gagal"); };

    var checks = ${JSON.stringify(checks)};
    var results = [];
    for (var i = 0; i < checks.length; i++) {
      try {
        // eslint-disable-next-line no-new-func
        var fn = new Function("doc", "sel", "all", "text", "attr", "style", "css", "assert", checks[i]);
        fn(doc, sel, all, text, attr, style, css, assert);
        results.push({ passed: true });
      } catch (err) {
        results.push({ passed: false, detail: String((err && err.message) || err) });
      }
    }
    report(results);
  }

  // Wait for load rather than DOMContentLoaded, so stylesheets have applied.
  // Note: no requestAnimationFrame here — the frame sits outside the viewport
  // and browsers stop servicing rAF there, so a rAF-based wait never fires.
  function start() {
    setTimeout(run, 0);
  }

  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start);
  }
})();
</script>`

/** Put the harness last so the learner's markup has already parsed. */
function documentWithHarness(source: string, nonce: string, checks: string[], html?: string): string {
  const doc = buildDocument(source, html)
  const harness = HARNESS(nonce, checks)

  const body = indexOfTag(doc, '</body>')
  if (body !== -1) return doc.slice(0, body) + harness + '\n' + doc.slice(body)
  return doc + harness
}

const TIMEOUT_MS = 4000

export async function runWebTests(source: string, tests: WebTest[], html?: string): Promise<WebOutcome[]> {
  if (!tests.length) return []

  const nonce = `n${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
  const frame = document.createElement('iframe')
  frame.setAttribute('sandbox', 'allow-scripts')
  frame.setAttribute('aria-hidden', 'true')
  // Off-screen but still laid out, so getComputedStyle returns real values.
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
              'Halaman tidak selesai dimuat. Periksa apakah ada tag atau kurung kurawal yang belum ditutup. / The page never finished loading — check for an unclosed tag or brace.',
            ),
          ),
        TIMEOUT_MS,
      )

      window.addEventListener('message', onMessage)
      // In the document first, so the frame has a size to lay out into.
      document.body.appendChild(frame)
      frame.srcdoc = documentWithHarness(
        source,
        nonce,
        tests.map((t) => t.check),
        html,
      )
    })
  } catch (err) {
    return failAll(String((err as Error).message ?? err))
  } finally {
    frame.remove()
  }
}
