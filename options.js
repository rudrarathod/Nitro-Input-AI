// options.js
const form = document.getElementById('spark-options');
const saveStatus = document.getElementById('saveStatus');

const defaults = {
    excludePassword: true,
    anchorMode: 'top-right',
    darkModeStyle: 'auto',
    enableShadowDOM: true,
    geminiApiKey: '',
    geminiModel: 'gemini-2.5-flash',
    geminiStyle: ''
};

function load() {
    chrome.storage.sync.get(defaults, cfg => {
        for (const [k, v] of Object.entries(cfg)) {
            const el = form.elements[k];
            if (!el) continue;
            if (el.type === 'checkbox') el.checked = !!v; else el.value = v;
        }
    });
}

function save(e) {
    e.preventDefault();
    const data = {};
    for (const [k] of Object.entries(defaults)) {
        const el = form.elements[k];
        if (!el) continue;
        data[k] = el.type === 'checkbox' ? el.checked : el.value;
    }
    chrome.storage.sync.set(data, () => {
        saveStatus.classList.add('show');
        setTimeout(() => saveStatus.classList.remove('show'), 1800);
    });
}

form.addEventListener('submit', save);
load();