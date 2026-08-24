/** Runs the learner's work in a sandboxed iframe, and checks it there.
 *
 *  The checks execute *inside* the frame and report back over `postMessage`,
 *  rather than the parent reaching into `contentDocument`. That is deliberate:
 *  it lets the frame stay on an opaque origin (`sandbox="allow-scripts"` with no
 *  `allow-same-origin`), so anything the learner writes — including a stray
 *  `<script>` — cannot touch the page hosting the app. The same runner will
 *  serve JavaScript and React, where learner scripts are the whole point. */

import type { WebTest } from '../content/types'
import { reactRuntime, transpileJsx } from './reactRuntime'

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

/** Installed before the learner's script so nothing they log is missed.
 *  console still forwards to the real one, so the browser devtools keep working
 *  for anyone who opens them on the preview. */
const consoleCapture = (reportTo?: string) => `<script>
window.__logs = [];
window.__error = null;
(function () {
  function show(v) {
    if (typeof v === "string") return v;
    if (typeof v === "undefined") return "undefined";
    if (v === null) return "null";
    try { return JSON.stringify(v); } catch (e) { return String(v); }
  }
  ${
    reportTo
      ? `function post() {
    parent.postMessage({ nunadaLogs: ${JSON.stringify(reportTo)}, logs: window.__logs.slice(), error: window.__error }, "*");
  }`
      : 'function post() {}'
  }
  ["log", "info", "warn", "error"].forEach(function (k) {
    var orig = console[k];
    console[k] = function () {
      window.__logs.push(Array.prototype.map.call(arguments, show).join(" "));
      post();
      try { orig.apply(console, arguments); } catch (e) {}
    };
  });
  window.addEventListener("error", function (e) {
    if (window.__error === null) window.__error = String(e.message);
    post();
  });
  window.addEventListener("load", post);
})();
</script>`

function insertBefore(doc: string, tag: string, chunk: string): string {
  const at = indexOfTag(doc, tag)
  if (at === -1) return doc + chunk
  return doc.slice(0, at) + chunk + '\n' + doc.slice(at)
}

/** Build the page under test.
 *
 *  Four shapes, one function:
 *    no `html`       — `source` *is* the markup (HTML course)
 *    `html`          — markup fixed, `source` is CSS applied to it (CSS course)
 *    `html` + `js`   — markup fixed, `source` is a script that runs on it
 *    `runtime`       — extra <script> blocks inlined ahead of it, for React
 *
 *  The script is always a classic one, never a module. That is what lets a
 *  check reference the learner's top-level names directly: classic scripts
 *  share the frame's global scope, modules do not. */
export function buildDocument(
  source: string,
  html?: string,
  js?: boolean,
  reportLogsTo?: string,
  runtime?: string,
): string {
  if (html === undefined && !js && !runtime) return wrap(source)

  const doc = wrap(html ?? '')

  if (js || runtime) {
    const head = (runtime ? runtime + '\n' : '') + consoleCapture(reportLogsTo)
    const withHead = insertBefore(doc, '</head>', head)
    return insertBefore(withHead, '</body>', `<script>\n${source}\n</script>`)
  }

  return insertBefore(doc, '</head>', `<style>\n${source}\n</style>`)
}

/** The document handed to the preview pane.
 *  `reportLogsTo` lets the preview send its console output back to the app, so a
 *  pure-logic JavaScript exercise shows its result instead of a blank frame. */
export function previewDocument(
  source: string,
  html?: string,
  js?: boolean,
  reportLogsTo?: string,
  runtime?: string,
): string {
  return buildDocument(source, html, js, reportLogsTo, runtime)
}

/** JSX in, a ready-to-render document out. Returns the syntax error instead
 *  when the learner's JSX does not parse, so the preview can show it. */
export async function previewReactDocument(
  source: string,
  html: string | undefined,
  reportLogsTo?: string,
): Promise<{ doc?: string; error?: string }> {
  const [runtime, { code, error }] = await Promise.all([reactRuntime(), transpileJsx(source)])
  if (error !== undefined) return { error }
  return { doc: buildDocument(code ?? '', html, true, reportLogsTo, runtime) }
}

const HARNESS = (nonce: string, checks: string[], settleTurns: number) => `
<script>
(function () {
  function report(results) {
    parent.postMessage({ nunada: ${JSON.stringify(nonce)}, results: results }, "*");
  }

  async function run() {
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
    var logs = function () { return (window.__logs || []).slice(); };
    var out = function () { return logs().join("\\n"); };
    var error = function () { return window.__error || null; };
    // React commits after the handler that triggered it returns, so a check that
    // reads the DOM straight after a click sees the value from before it. These
    // two give a check somewhere to wait.
    //
    // Deliberately not setTimeout: this frame sits outside the viewport, where
    // browsers clamp timers to about a second. A check with four short tick
    // calls would then take four seconds and blow the run's budget. A
    // MessageChannel turn is a real macrotask and is not clamped — it is what
    // React's own scheduler uses.
    var turn = function () {
      return new Promise(function (r) {
        var ch = new MessageChannel();
        ch.port1.onmessage = function () { r(); };
        ch.port2.postMessage(0);
      });
    };
    var tick = async function (ms) {
      var n = Math.min(8, Math.max(1, Math.ceil((ms || 0) / 16)));
      for (var i = 0; i < n; i++) await turn();
    };
    var click = function (q) {
      var e = typeof q === "string" ? sel(q) : q;
      if (!e) throw new Error("elemen tidak ditemukan: " + q);
      e.click();
      return tick(0);
    };
    var assert = function (cond, msg) { if (!cond) throw new Error(msg || "pemeriksaan gagal"); };

    var checks = ${JSON.stringify(checks)};
    var results = [];
    for (var i = 0; i < checks.length; i++) {
      try {
        // eslint-disable-next-line no-new-func
        // Indirect eval keeps the check in global scope, so it can see the
        // learner's top-level const and let, not just what landed on window.
        var fn = (0, eval)(
          "(async function (doc, sel, all, text, attr, style, css, logs, out, error, tick, click, assert) {" +
            checks[i] +
            "\\n})"
        );
        await fn(doc, sel, all, text, attr, style, css, logs, out, error, tick, click, assert);
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
  //
  // React needs more than zero turns: createRoot().render() commits on a later
  // tick, so checking immediately would read an empty root. Turns rather than a
  // timer, for the throttling reason above.
  function start() {
    var left = ${settleTurns};
    function step() {
      if (left <= 0) { run(); return; }
      left -= 1;
      var ch = new MessageChannel();
      ch.port1.onmessage = step;
      ch.port2.postMessage(0);
    }
    step();
  }

  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start);
  }
})();
</script>`

/** Put the harness last so the learner's markup has already parsed. */
function documentWithHarness(
  source: string,
  nonce: string,
  checks: string[],
  html?: string,
  js?: boolean,
  runtime?: string,
): string {
  const doc = buildDocument(source, html, js, undefined, runtime)
  // React commits on a later tick than the script that called render(), so a
  // zero-delay check would read an empty root.
  const harness = HARNESS(nonce, checks, runtime ? 4 : 1)

  const body = indexOfTag(doc, '</body>')
  if (body !== -1) return doc.slice(0, body) + harness + '\n' + doc.slice(body)
  return doc + harness
}

const TIMEOUT_MS = 8000

export async function runWebTests(
  source: string,
  tests: WebTest[],
  html?: string,
  js?: boolean,
  react?: boolean,
): Promise<WebOutcome[]> {
  if (!tests.length) return []

  // JSX is transpiled here, in the app, not by a transpiler inside every frame.
  let runtime: string | undefined
  let code = source
  if (react) {
    const [rt, out] = await Promise.all([reactRuntime(), transpileJsx(source)])
    if (out.error !== undefined) {
      return tests.map((test) => ({ test, passed: false, detail: out.error }))
    }
    runtime = rt
    code = out.code ?? ''
  }

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
        code,
        nonce,
        tests.map((t) => t.check),
        html,
        js,
        runtime,
      )
    })
  } catch (err) {
    return failAll(String((err as Error).message ?? err))
  } finally {
    frame.remove()
  }
}
