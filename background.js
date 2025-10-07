// background.js (service worker)
// Currently minimal; reserved for future enhancements (e.g., context menus, storage, messaging logging).
chrome.runtime.onInstalled.addListener(() => {
    console.log('Spark Input Helper ✨ installed.');
    // Updated defaults (simplified + LLM settings)
    const defaults = {
        excludePassword: true,
        anchorMode: 'top-right',
        darkModeStyle: 'auto',
        enableShadowDOM: true,
        geminiApiKey: '',
        geminiModel: 'gemini-2.5-flash',
        geminiSafety: 'default'
    };
    chrome.storage.sync.get(Object.keys(defaults), stored => {
        const toSet = {};
        for (const k in defaults) if (stored[k] === undefined) toSet[k] = defaults[k];
        if (Object.keys(toSet).length) chrome.storage.sync.set(toSet);
    });
});

// Simple message relay (future use) for potential popup/options interactions
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg === 'spark:getConfig') {
        chrome.storage.sync.get(null, cfg => sendResponse(cfg));
        return true;
    }
    if (msg && msg.type === 'spark:generate') {
        const { prompt } = msg;
        chrome.storage.sync.get(['geminiApiKey', 'geminiModel', 'geminiSafety', 'geminiStyle'], cfg => {
            const apiKey = cfg.geminiApiKey || '';
            const model = cfg.geminiModel || 'gemini-2.5-flash';
            let styleInstruction = '';
            if (cfg.geminiStyle) {
                switch (cfg.geminiStyle) {
                    case 'short': styleInstruction = 'Respond concisely.'; break;
                    case 'detailed': styleInstruction = 'Respond in detail.'; break;
                    case 'step': styleInstruction = 'Explain step by step.'; break;
                    case 'list': styleInstruction = 'Respond as a list.'; break;
                }
            } else {
                styleInstruction = 'Respond with only the answer, no greetings or extra text.';
            }
            const fullPrompt = styleInstruction ? (styleInstruction + '\n' + (prompt || '')) : (prompt || '');
            if (!apiKey) {
                sendResponse({ ok: false, error: 'API key not set. Open the extension popup to configure.' });
                return;
            }
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
            const body = {
                contents: [{ parts: [{ text: fullPrompt }] }]
            };
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            }).then(r => r.json())
                .then(data => {
                    if (data.error) {
                        sendResponse({ ok: false, error: data.error.message || 'Gemini API error' });
                        return;
                    }
                    // Attempt to extract text
                    let out = '';
                    if (data.candidates && data.candidates.length) {
                        const cand = data.candidates[0];
                        if (cand.content && cand.content.parts && cand.content.parts.length) {
                            out = cand.content.parts.map(p => p.text || '').join('\n').trim();
                        }
                    }
                    if (!out) out = '[No response]';
                    sendResponse({ ok: true, text: out });
                })
                .catch(err => {
                    sendResponse({ ok: false, error: err.message || 'Network error' });
                });
        });
        return true; // async
    }
});
