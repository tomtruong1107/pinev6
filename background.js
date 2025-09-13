// Service worker for PineScript Assistant

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'analyze') {
    handleAnalysis(message.code, message.consoleLog).then(sendResponse);
    return true; // Keep the message channel open for async response
  }
});

async function handleAnalysis(code, consoleLog) {
  try {
    const { apiKey } = await chrome.storage.sync.get('apiKey');
    if (!apiKey) {
      return { error: 'API key not set. Open the extension popup to provide your key.' };
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        input: [
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: `Analyze this Pine script and provide recommendations.\n\nCode:\n${code}\n\nConsole output:\n${consoleLog}`
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return { error: `API error: ${err}` };
    }

    const data = await response.json();
    const text = data.output?.[0]?.content?.[0]?.text || 'No response received.';
    return { text };
  } catch (err) {
    return { error: err.message };
  }
}
