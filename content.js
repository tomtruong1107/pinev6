// Content script for Pine editor extension

// Capture console.log output for later extraction
const __pineCapturedLogs = [];
(function hookConsole() {
  if (console.__pineHooked) return;
  const originalLog = console.log;
  console.log = function (...args) {
    __pineCapturedLogs.push(args.map(arg => {
      try {
        return typeof arg === 'string' ? arg : JSON.stringify(arg);
      } catch (e) {
        return String(arg);
      }
    }).join(' '));
    return originalLog.apply(console, args);
  };
  console.__pineHooked = true;
})();

// Extract messages from the Pine editor console DOM or from captured logs
function extractConsoleLog() {
  // Attempt to read from a visible console panel in the DOM
  const consolePanel = document.querySelector('[data-testid="console"], .pine-console, #console');
  if (consolePanel) {
    const lines = Array.from(consolePanel.querySelectorAll('.log, li, div, span, p, pre'))
      .map(el => el.textContent.trim())
      .filter(Boolean);
    if (lines.length) {
      return lines.join('\n');
    }
    const text = consolePanel.textContent.trim();
    if (text) return text;
  }

  // Fallback to any logs captured via the console.log hook
  return __pineCapturedLogs.join('\n');
}

// Analyze the current code and send it to the background script
function analyzeCode() {
  const editor = document.querySelector('textarea, [contenteditable="true"], pre code');
  const code = editor ? (editor.value || editor.textContent) : '';
  const consoleLog = extractConsoleLog();
  chrome.runtime.sendMessage({ code, consoleLog });
}

// Expose functions for other scripts if necessary
window.extractConsoleLog = extractConsoleLog;
window.analyzeCode = analyzeCode;
