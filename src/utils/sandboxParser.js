const SANDBOX_START = '<<<SANDBOX_HTML>>>';
const SANDBOX_END = '<<<END_SANDBOX_HTML>>>';

/**
 * Extract generative sandbox HTML from Gemini or tagged payloads.
 * @param {string} text
 * @returns {{ cleanText: string, sandboxHtml: string | null }}
 */
export function parseSandboxFromResponse(text) {
  if (!text || typeof text !== 'string') {
    return { cleanText: '', sandboxHtml: null };
  }

  const startIdx = text.indexOf(SANDBOX_START);
  const endIdx = text.indexOf(SANDBOX_END);

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const sandboxHtml = text
      .slice(startIdx + SANDBOX_START.length, endIdx)
      .trim();
    const cleanText = (
      text.slice(0, startIdx) + text.slice(endIdx + SANDBOX_END.length)
    )
      .trim()
      .replace(/\n{3,}/g, '\n\n');
    return { cleanText: cleanText || 'Visualization sandbox loaded in the canvas.', sandboxHtml };
  }

  const fenced = text.match(/```(?:html|sandbox|threejs)\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    const sandboxHtml = fenced[1].trim();
    const cleanText = text.replace(fenced[0], '').trim();
    return { cleanText: cleanText || 'Visualization sandbox loaded in the canvas.', sandboxHtml };
  }

  return { cleanText: text, sandboxHtml: null };
}

/**
 * Wrap raw HTML in an isolated srcDoc document with error boundary script.
 * @param {string} userHtml
 * @returns {string}
 */
export function buildSandboxSrcDoc(userHtml) {
  const safeBody = userHtml || '<p style="color:#94a3b8;font-family:monospace">Empty sandbox payload.</p>';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"><\/script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #ffffff; }
    #sandbox-root { width: 100%; height: 100%; }
    #sandbox-error {
      display: none;
      position: fixed; inset: 0;
      background: rgba(15,23,42,0.95);
      color: #f87171;
      font: 12px ui-monospace, monospace;
      padding: 16px;
      white-space: pre-wrap;
      z-index: 9999;
    }
  </style>
</head>
<body>
  <div id="sandbox-error"></div>
  <div id="sandbox-root">${safeBody}</div>
  <script>
    (function () {
      var errEl = document.getElementById('sandbox-error');
      function showError(msg) {
        errEl.style.display = 'block';
        errEl.textContent = '[SANDBOX_ERROR]\\n' + msg;
      }
      window.onerror = function (msg, src, line, col) {
        showError(String(msg) + ' at ' + (src || 'inline') + ':' + line + ':' + col);
        return true;
      };
      window.addEventListener('unhandledrejection', function (e) {
        showError('Unhandled promise: ' + (e.reason && e.reason.message ? e.reason.message : e.reason));
      });
    })();
  <\/script>
</body>
</html>`;
}
