// Inject overlay UI onto TradingView pages

function createPanel() {
  const panel = document.createElement('div');
  panel.id = 'pine-assistant-panel';
  panel.style.position = 'fixed';
  panel.style.top = '10px';
  panel.style.right = '10px';
  panel.style.zIndex = '10000';
  panel.style.background = '#fff';
  panel.style.border = '1px solid #ccc';
  panel.style.padding = '8px';
  panel.style.fontSize = '12px';
  panel.style.width = '250px';
  panel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';

  const btn = document.createElement('button');
  btn.textContent = 'Analyze code';
  btn.style.width = '100%';

  const output = document.createElement('pre');
  output.id = 'pine-assistant-output';
  output.style.whiteSpace = 'pre-wrap';
  output.style.maxHeight = '300px';
  output.style.overflowY = 'auto';
  output.style.marginTop = '8px';

  btn.addEventListener('click', analyzeCode);

  panel.appendChild(btn);
  panel.appendChild(output);
  document.body.appendChild(panel);
}

function extractPineScript() {
  // Attempt to locate TradingView's code editor textarea
  const textarea = document.querySelector('textarea[id^="codeEditor"]') || document.querySelector('textarea');
  return textarea ? textarea.value : '';
}

async function analyzeCode() {
  const code = extractPineScript();
  const output = document.getElementById('pine-assistant-output');
  output.textContent = 'Analyzing…';
  const response = await chrome.runtime.sendMessage({ type: 'analyze', code });
  if (response.error) {
    output.textContent = 'Error: ' + response.error;
  } else {
    output.textContent = response.text;
  }
}

createPanel();
