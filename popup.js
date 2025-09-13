document.addEventListener('DOMContentLoaded', async () => {
  const apiKeyInput = document.getElementById('apiKey');
  const status = document.getElementById('status');

  chrome.storage.sync.get('apiKey', (data) => {
    if (data.apiKey) {
      apiKeyInput.value = data.apiKey;
    }
  });

  document.getElementById('save').addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    chrome.storage.sync.set({ apiKey }, () => {
      status.textContent = 'Saved';
      setTimeout(() => (status.textContent = ''), 2000);
    });
  });
});
