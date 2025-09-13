// Inject overlay UI onto TradingView pages

const PANEL_ID = 'pine-assistant-panel';

function createPanel() {
  if (document.getElementById(PANEL_ID)) return;

  const panel = document.createElement('div');
  panel.id = PANEL_ID;
  panel.style.position = 'fixed';
  panel.style.top = '10px';
  panel.style.right = '10px';
  panel.style.zIndex = '10000';
  panel.style.background = '#fff';
  panel.style.border = '1px solid #ccc';
  panel.style.borderRadius = '4px';
  panel.style.padding = '8px';
  panel.style.fontSize = '12px';
  panel.style.width = '260px';
  panel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';

  const header = document.createElement('div');
  header.textContent = 'Pine Assistant';
  header.style.cursor = 'move';
  header.style.fontWeight = 'bold';
  header.style.marginBottom = '8px';

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.float = 'right';
  closeBtn.style.border = 'none';
  closeBtn.style.background = 'transparent';
  closeBtn.style.cursor = 'pointer';
  closeBtn.addEventListener('click', () => panel.remove());
  header.appendChild(closeBtn);

  const btn = document.createElement('button');
  btn.id = 'pine-analyze-btn';
  btn.textContent = 'Analyze code';
  btn.style.width = '100%';

  const output = document.createElement('pre');
  output.id = 'pine-assistant-output';
  output.style.whiteSpace = 'pre-wrap';
  output.style.maxHeight = '300px';
  output.style.overflowY = 'auto';
  output.style.marginTop = '8px';
  output.style.background = '#f6f6f6';
  output.style.padding = '4px';

  btn.addEventListener('click', analyzeCode);

  panel.appendChild(header);
  panel.appendChild(btn);
  panel.appendChild(output);
  document.body.appendChild(panel);

  makeDraggable(panel, header);
}

function makeDraggable(panel, handle) {
  let isDown = false;
  let offsetX = 0;
  let offsetY = 0;

  handle.addEventListener('mousedown', (e) => {
    isDown = true;
    offsetX = e.clientX - panel.offsetLeft;
    offsetY = e.clientY - panel.offsetTop;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  function onMouseMove(e) {
    if (!isDown) return;
    panel.style.left = `${e.clientX - offsetX}px`;
    panel.style.top = `${e.clientY - offsetY}px`;
    panel.style.right = '';
  }

  function onMouseUp() {
    isDown = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
}

function extractPineScript() {
  if (window.monaco?.editor) {
    const model = window.monaco.editor.getModels()[0];
    if (model) return model.getValue();
  }

  const cm = document.querySelector('.CodeMirror');
  if (cm && cm.CodeMirror) {
    return cm.CodeMirror.getValue();
  }

  const textarea =
    document.querySelector('textarea[id^="codeEditor"]') ||
    document.querySelector('textarea');
  return textarea ? textarea.value : '';
}

const capturedLogs = [];
const originalConsoleLog = console.log;
console.log = (...args) => {
  capturedLogs.push(args.map(String).join(' '));
  originalConsoleLog.apply(console, args);
};

function extractConsoleLog() {
  return capturedLogs.join('\n');
}

async function analyzeCode() {
  const btn = document.getElementById('pine-analyze-btn');
  const output = document.getElementById('pine-assistant-output');
  const code = extractPineScript();
  const consoleLog = extractConsoleLog();

  btn.disabled = true;
  btn.textContent = 'Analyzing…';
  output.textContent = '';

  try {
    const response = await chrome.runtime.sendMessage({ type: 'analyze', code, consoleLog });
    if (response.error) {
      output.textContent = 'Error: ' + response.error;
    } else {
      output.textContent = response.text;
    }
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Analyze code';
  }
}

createPanel();

