chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'execute_pine') {
    const { pineCode, consoleLog, includeScreenshot } = message;

    const inputs = [
      { type: 'input_pine', text: pineCode },
    ];

    if (consoleLog) {
      inputs.push({ type: 'input_text', text: consoleLog });
    }

    if (includeScreenshot) {
      try {
        const screenshot = await chrome.tabs.captureVisibleTab(
          sender.tab.windowId,
          { format: 'png' }
        );
        inputs.push({
          type: 'input_image',
          image_base64: screenshot.split(',')[1],
        });
      } catch (err) {
        console.error('Screenshot failed', err);
      }
    }

    try {
      const response = await fetch('https://example.com/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs }),
      });
      const data = await response.json();
      sendResponse({ ok: true, data });
    } catch (err) {
      console.error('Execution failed', err);
      sendResponse({ ok: false, error: String(err) });
    }
    return true;
  }
});
