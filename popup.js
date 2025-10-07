// popup.js - manage Gemini API key & model
const formEl = document.getElementById('spark-ai-form');
const statusEl = document.getElementById('status');
const defaults = { geminiApiKey: '', geminiModel: 'gemini-2.5-flash', geminiStyle: '' };

chrome.storage.sync.get(defaults, data => {
    formEl.geminiApiKey.value = data.geminiApiKey || '';
    formEl.geminiModel.value = data.geminiModel || 'gemini-2.5-flash';
    formEl.geminiStyle.value = data.geminiStyle || '';
});

formEl.addEventListener('submit', e => {
    e.preventDefault();
    const geminiApiKey = formEl.geminiApiKey.value.trim();
    const geminiModel = formEl.geminiModel.value.trim() || 'gemini-2.5-flash';
    const geminiStyle = formEl.geminiStyle.value;
    chrome.storage.sync.set({ geminiApiKey, geminiModel, geminiStyle }, () => {
        statusEl.textContent = 'Saved';
        statusEl.className = 'ok';
        setTimeout(() => { statusEl.textContent = ''; }, 2000);
    });
});
