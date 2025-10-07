// contentScript.js (simplified)
// Features kept: shadow DOM, exclude password, positioning modes, dark mode theme.
// Simplified: no live preview. Clicking ✨ shows current text in a floating bar (tooltip) only at that moment.
(function () {
    const ICON = '✨';
    const BTN_CLASS = 'spark-inline-button';
    const TOOLTIP_CLASS = 'spark-tooltip';
    const NON_TEXT_INPUT_TYPES_BASE = new Set(['button', 'submit', 'reset', 'checkbox', 'radio', 'range', 'file', 'image', 'color', 'hidden']);
    const DEBUG = false;
    const DEFAULTS = {
        excludePassword: true,
        anchorMode: 'top-right',
        darkModeStyle: 'auto',
        enableShadowDOM: true
    };

    function log(...args) { if (DEBUG) console.log('[NITRO ✨]', ...args); }

    let cfg = { ...DEFAULTS };
    let currentTarget = null;
    let btn = null;
    let tooltip = null;
    let rafPending = false;
    let shadowPatched = false;
    let stopBtn = null;
    let currentAbort = null;

    function loadConfig(cb) {
        try {
            chrome.storage.sync.get(DEFAULTS, data => { cfg = { ...DEFAULTS, ...data }; applyTheme(); cb && cb(); });
        } catch (e) { cb && cb(); }
    }

    function applyTheme() {
        const root = document.documentElement;
        root.classList.remove('spark-theme-dark', 'spark-theme-light', 'auto-theme');
        switch (cfg.darkModeStyle) {
            case 'dark': root.classList.add('spark-theme-dark'); break;
            case 'light': root.classList.add('spark-theme-light'); break;
            default: root.classList.add('auto-theme'); break;
        }
    }

    function ensureButton() {
        if (btn) return btn;
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = BTN_CLASS;
        btn.innerHTML = `<svg width="22" height="22" viewBox="0 0 299 336" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;"><path d="M201.5 52.5C83.0001 2.67029e-05 -43.4999 145 56.5004 260.5L46.5001 278.5C-74.5 157 63 -37 214 38L201.5 52.5Z" fill="#FEB657"/><path d="M93.5 286.5C231 348.5 338 176.5 239.5 78.5L249 62C372.5 169.5 244.5 385.5 78.5 301L93.5 286.5Z" fill="#FEB657"/><path d="M269.5 0.5L154.5 117L166 168.5L269.5 0.5Z" fill="#FEB657"/><path d="M142.5 218L130.5 168.5L26.5 335.5L142.5 218Z" fill="#FEB657"/><path d="M249 126H214L147.5 239.5H183.5L249 126Z" fill="#FEB657"/><path d="M84 210.5L150.5 97.5H112.5L46.5001 210.5H84Z" fill="#FEB657"/></svg>`;
        btn.style.display = 'none';
        btn.title = 'ask AI';
        btn.addEventListener('mousedown', e => e.preventDefault());
        btn.addEventListener('click', onButtonClick);
        document.documentElement.appendChild(btn);
        ensureTooltip();
        btn.style.opacity = 0.85;
        return btn;
    }

    function ensureTooltip() {
        if (tooltip) return tooltip;
        tooltip = document.createElement('div');
        tooltip.className = TOOLTIP_CLASS;
        tooltip.setAttribute('data-visible', 'false');
        document.documentElement.appendChild(tooltip);
        return tooltip;
    }

    function showClickedText(text) {
        ensureTooltip();
        const trimmed = text.length > 240 ? text.slice(0, 237) + '…' : (text || '(empty)');
        tooltip.textContent = trimmed;
        tooltip.setAttribute('data-visible', 'true');
        schedulePosition();
        // auto hide after some seconds unless user focuses again
        clearTimeout(showClickedText._t);
        showClickedText._t = setTimeout(() => { if (tooltip) tooltip.setAttribute('data-visible', 'false'); }, 4000);
    }

    function onButtonClick(e) {
        e.preventDefault(); e.stopPropagation();
        if (!currentTarget) return;
        const originalText = getText(currentTarget);
        // Show processing state
        showClickedText('');
        if (tooltip) {
            tooltip.classList.add('spark-processing-text');
            tooltip.textContent = '';
            tooltip.setAttribute('data-visible', 'true');
        }
        btn.classList.add('spark-processing');
        disableEditing(currentTarget, true);
        showStopButton();
        let stopped = false;
        let abort;
        currentAbort = () => { stopped = true; abort && abort(); };
        // Patch chrome.runtime.sendMessage to support abort
        let responded = false;
        const send = (msg, cb) => {
            let done = false;
            abort = () => { done = true; cb({ ok: false, error: 'Stopped by user' }); };
            chrome.runtime.sendMessage(msg, resp => { if (!done) cb(resp); });
        };
        send({ type: 'spark:generate', prompt: originalText }, resp => {
            responded = true;
            btn.classList.remove('spark-processing');
            tooltip && tooltip.classList.remove('spark-processing-text');
            hideStopButton();
            disableEditing(currentTarget, false);
            currentAbort = null;
            if (!resp) { showClickedText('[No response]'); return; }
            if (!resp.ok) { showClickedText('Error: ' + (resp.error || 'Unknown')); return; }
            applyResponseToField(currentTarget, resp.text || '');
            showClickedText(resp.text || '');
            if (typeof currentTarget.focus === 'function') currentTarget.focus();
        });
    }

    function ensureStopButton() {
        if (stopBtn) return stopBtn;
        stopBtn = document.createElement('button');
        stopBtn.type = 'button';
        stopBtn.textContent = '⏹';
        stopBtn.title = 'Stop AI';
        stopBtn.style.position = 'fixed';
        stopBtn.style.zIndex = 2147483648;
        stopBtn.style.width = '26px';
        stopBtn.style.height = '26px';
        stopBtn.style.marginLeft = '4px';
        stopBtn.style.borderRadius = '7px';
        stopBtn.style.border = '1px solid #d0d0d5';
        stopBtn.style.background = '#fff';
        stopBtn.style.fontSize = '15px';
        stopBtn.style.display = 'none';
        stopBtn.style.cursor = 'pointer';
        stopBtn.addEventListener('mousedown', e => e.preventDefault());
        stopBtn.addEventListener('click', onStopClick);
        document.documentElement.appendChild(stopBtn);
        return stopBtn;
    }

    function showStopButton() {
        ensureStopButton();
        stopBtn.style.display = 'inline-flex';
        positionStopButton();
    }
    function hideStopButton() {
        if (stopBtn) stopBtn.style.display = 'none';
    }
    function positionStopButton() {
        if (!btn || !stopBtn || btn.style.display === 'none') return;
        stopBtn.style.top = btn.style.top;
        stopBtn.style.left = (parseFloat(btn.style.left) + 30) + 'px';
    }

    function onStopClick(e) {
        e.preventDefault();
        e.stopPropagation();
        if (currentAbort) currentAbort();
        hideStopButton();
        btn.classList.remove('spark-processing');
        tooltip && tooltip.classList.remove('spark-processing-text');
        disableEditing(currentTarget, false);
        showClickedText('[Stopped]');
    }

    function disableEditing(el, on) {
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
            if (on) { el.setAttribute('data-spark-prev-readonly', el.readOnly ? '1' : '0'); el.readOnly = true; }
            else { if (el.getAttribute('data-spark-prev-readonly') === '0') el.readOnly = false; el.removeAttribute('data-spark-prev-readonly'); }
        } else if (el instanceof HTMLElement) {
            if (on) { el.setAttribute('data-spark-prev-ce', el.getAttribute('contenteditable') || ''); el.setAttribute('contenteditable', 'false'); }
            else { const prev = el.getAttribute('data-spark-prev-ce'); if (prev !== null) { if (prev === '') el.setAttribute('contenteditable', ''); else el.setAttribute('contenteditable', prev); el.removeAttribute('data-spark-prev-ce'); } }
        }
    }

    function applyResponseToField(el, text) {
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
            el.value = text;
        } else if (el instanceof HTMLElement) {
            el.innerText = text;
        }
        // Move caret to end
        try {
            if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
                el.selectionStart = el.selectionEnd = el.value.length;
            } else if (el.isContentEditable) {
                const range = document.createRange();
                range.selectNodeContents(el);
                range.collapse(false);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        } catch (_) { }
        // Always show and reposition the button after response
        showFor(el);
        schedulePosition();
    }

    function isEligible(el) {
        if (!(el instanceof HTMLElement)) return false;
        if (el instanceof HTMLInputElement) {
            if (el.disabled || el.readOnly) return false;
            if (cfg.excludePassword && el.type === 'password') return false;
            if (NON_TEXT_INPUT_TYPES_BASE.has(el.type)) return false;
            return true;
        }
        if (el instanceof HTMLTextAreaElement) { if (el.disabled || el.readOnly) return false; return true; }
        if (el.isContentEditable) return true;
        const ceAttr = el.getAttribute('contenteditable');
        if (ceAttr === '' || (ceAttr && ceAttr.toLowerCase() === 'true')) return true;
        return false;
    }

    function getText(el) {
        if (!el) return '';
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return el.value;
        return (el.innerText || el.textContent || '').trim();
    }

    // Measure text/caret end position for inputs & textareas using canvas; for contenteditable use range
    const measureCanvas = document.createElement('canvas');
    const measureCtx = measureCanvas.getContext('2d');

    function getCaretEndClientX(target, baseRect) {
        try {
            if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
                const style = getComputedStyle(target);
                const value = target.value;
                const selEnd = target.selectionEnd == null ? value.length : target.selectionEnd;
                // Build font string (approx)
                measureCtx.font = `${style.fontWeight || ''} ${style.fontSize || ''} ${style.fontFamily || ''}`.trim();
                // For single-line input we can measure substring directly
                const textBefore = value.slice(0, selEnd);
                const metrics = measureCtx.measureText(textBefore.replace(/\n/g, ' '));
                const paddingLeft = parseFloat(style.paddingLeft) || 0;
                const borderLeft = parseFloat(style.borderLeftWidth) || 0;
                const scrollLeft = target.scrollLeft || 0;
                const innerX = paddingLeft + borderLeft + metrics.width - scrollLeft;
                return baseRect.left + innerX;
            }
            // Contenteditable: use Range
            const sel = document.getSelection();
            if (sel && sel.rangeCount) {
                const r = sel.getRangeAt(0).cloneRange();
                if (!target.contains(r.endContainer)) return null;
                // Collapse to caret
                r.collapse(false);
                let rects = r.getClientRects();
                if (rects.length) {
                    return rects[rects.length - 1].right;
                } else {
                    // Insert temporary marker
                    const marker = document.createElement('span');
                    marker.textContent = '\u200b';
                    r.insertNode(marker);
                    const mr = marker.getBoundingClientRect();
                    marker.remove();
                    return mr.right;
                }
            }
        } catch (_) { }
        return null;
    }

    function getCaretEndClientXY(target, baseRect) {
        try {
            if (target instanceof HTMLTextAreaElement) {
                // Multi-line textarea: measure last line
                const style = getComputedStyle(target);
                const value = target.value;
                const selEnd = target.selectionEnd == null ? value.length : target.selectionEnd;
                const before = value.slice(0, selEnd);
                const lines = before.split(/\r?\n/);
                const lastLine = lines[lines.length - 1];
                measureCtx.font = `${style.fontWeight || ''} ${style.fontSize || ''} ${style.fontFamily || ''}`.trim();
                const metrics = measureCtx.measureText(lastLine);
                const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) || 16;
                const paddingLeft = parseFloat(style.paddingLeft) || 0;
                const borderLeft = parseFloat(style.borderLeftWidth) || 0;
                const scrollLeft = target.scrollLeft || 0;
                const paddingTop = parseFloat(style.paddingTop) || 0;
                const borderTop = parseFloat(style.borderTopWidth) || 0;
                const scrollTop = target.scrollTop || 0;
                const lineIdx = lines.length - 1;
                const y = baseRect.top + paddingTop + borderTop + (lineIdx * lineHeight) - scrollTop;
                const x = baseRect.left + paddingLeft + borderLeft + metrics.width - scrollLeft;
                return { x, y };
            }
            if (target instanceof HTMLInputElement) {
                // Single-line input
                const style = getComputedStyle(target);
                const value = target.value;
                const selEnd = target.selectionEnd == null ? value.length : target.selectionEnd;
                measureCtx.font = `${style.fontWeight || ''} ${style.fontSize || ''} ${style.fontFamily || ''}`.trim();
                const textBefore = value.slice(0, selEnd);
                const metrics = measureCtx.measureText(textBefore.replace(/\n/g, ' '));
                const paddingLeft = parseFloat(style.paddingLeft) || 0;
                const borderLeft = parseFloat(style.borderLeftWidth) || 0;
                const scrollLeft = target.scrollLeft || 0;
                const x = baseRect.left + paddingLeft + borderLeft + metrics.width - scrollLeft;
                const y = baseRect.top + (baseRect.height / 2) - 13;
                return { x, y };
            }
            // Contenteditable: use Range
            const sel = document.getSelection();
            if (sel && sel.rangeCount) {
                const r = sel.getRangeAt(0).cloneRange();
                if (!target.contains(r.endContainer)) return null;
                r.collapse(false);
                let rects = r.getClientRects();
                if (rects.length) {
                    const last = rects[rects.length - 1];
                    return { x: last.right, y: last.top };
                } else {
                    // Insert temporary marker
                    const marker = document.createElement('span');
                    marker.textContent = '\u200b';
                    r.insertNode(marker);
                    const mr = marker.getBoundingClientRect();
                    marker.remove();
                    return { x: mr.right, y: mr.top };
                }
            }
        } catch (_) { }
        return null;
    }

    function positionElements() {
        if (!currentTarget || !btn) return;
        if (!document.contains(currentTarget)) { hideAll(); return; }
        const rect = currentTarget.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) { hideAll(); return; }
        const btnH = 26, btnW = 26;
        let xy = null;
        if (document.activeElement === currentTarget) {
            xy = getCaretEndClientXY(currentTarget, rect);
        }
        let top, left;
        if (xy) {
            top = xy.y;
            left = xy.x + 6;
            // Clamp inside field
            const maxLeft = rect.right - btnW - 4;
            if (left > maxLeft) left = maxLeft;
            if (left < rect.left + 4) left = rect.left + 4;
            // For textarea/contenteditable, clamp vertically
            const maxTop = rect.bottom - btnH - 4;
            if (top > maxTop) top = maxTop;
            if (top < rect.top + 2) top = rect.top + 2;
        } else {
            // Fallback: right edge
            top = (cfg.anchorMode === 'top-right') ? (rect.top + 4) : (rect.top + (rect.height / 2) - (btnH / 2));
            left = rect.right - btnW - 4;
            if (rect.width < 40) left = rect.right + 4;
        }
        btn.style.top = Math.max(0, top) + 'px';
        btn.style.left = Math.max(0, left) + 'px';
        if (stopBtn && stopBtn.style.display !== 'none') {
            stopBtn.style.top = btn.style.top;
            stopBtn.style.left = (parseFloat(btn.style.left) + 30) + 'px';
        }
        if (tooltip && tooltip.getAttribute('data-visible') === 'true') {
            const viewportH = window.innerHeight;
            const below = rect.bottom + 40 < viewportH;
            const tTop = below ? (top + btnH + 4) : (top - 8 - tooltip.offsetHeight);
            const tLeft = left - (tooltip.offsetWidth - btnW) + 4;
            tooltip.style.top = Math.max(0, tTop) + 'px';
            tooltip.style.left = Math.max(0, tLeft) + 'px';
        }
    }

    function schedulePosition() { if (rafPending) return; rafPending = true; requestAnimationFrame(() => { rafPending = false; positionElements(); }); }

    function showFor(el) { ensureButton(); currentTarget = el; btn.style.display = 'inline-flex'; schedulePosition(); }
    function hideAll() { if (btn) btn.style.display = 'none'; /* do not hide tooltip immediately; let it time out */ currentTarget = null; }

    function updateVisibility(source = 'update') {
        if (!currentTarget) return;
        const focused = document.activeElement === currentTarget || (currentTarget.shadowRoot && currentTarget.shadowRoot.activeElement);
        const hasText = getText(currentTarget).length > 0;
        if (!focused && !hasText) { hideAll(); return; }
        showFor(currentTarget); // reposition inside
    }

    function updateTooltip() { /* removed live sync; no-op */ }

    // Shadow DOM support
    function patchShadow() {
        if (shadowPatched || !cfg.enableShadowDOM) return; shadowPatched = true;
        const orig = Element.prototype.attachShadow;
        if (orig) {
            Element.prototype.attachShadow = function (init) {
                const root = orig.call(this, init);
                observeShadowRoot(root);
                return root;
            };
        }
        // existing roots
        document.querySelectorAll('*').forEach(el => { if (el.shadowRoot) observeShadowRoot(el.shadowRoot); });
    }
    function observeShadowRoot(root) { if (!root) return; root.addEventListener('focusin', shadowFocusHandler, true); }
    function shadowFocusHandler(e) { const t = e.target; if (isEligible(t)) { showFor(t); updateVisibility('shadow-focus'); } }

    // Mutation observer for password field toggles & dynamic elements (also pick up newly added shadow roots indirectly)
    const mo = new MutationObserver(muts => {
        if (!currentTarget) return;
        for (const m of muts) {
            if (m.target === currentTarget || (currentTarget.contains && currentTarget.contains(m.target))) { updateVisibility('mutation'); break; }
        }
    });
    mo.observe(document.documentElement, { subtree: true, childList: true, characterData: true });

    function bindEvents() {
        document.addEventListener('focusin', e => { const el = e.target; if (isEligible(el)) { showFor(el); updateVisibility('focusin'); } }, true);
        document.addEventListener('input', e => { if (e.target === currentTarget) { /* no live preview */ updateVisibility('input'); } }, true);
        document.addEventListener('keyup', e => { if (e.target === currentTarget) { /* no live preview */ updateVisibility('keyup'); } }, true);
        document.addEventListener('blur', e => { if (e.target === currentTarget) updateVisibility('blur'); }, true);
        document.addEventListener('mousedown', e => { if (!btn || e.target === btn) return; if (currentTarget && (e.target === currentTarget || (currentTarget.contains && currentTarget.contains(e.target)))) return; updateVisibility('mousedown'); }, true);
        ['scroll', 'resize'].forEach(ev => window.addEventListener(ev, schedulePosition, true));
    }

    // Re-load config if storage changes (e.g., options page open in another tab)
    if (chrome.storage && chrome.storage.onChanged) {
        chrome.storage.onChanged.addListener((changes, area) => {
            if (area !== 'sync') return;
            let relevant = false;
            for (const k in changes) if (k in DEFAULTS) relevant = true;
            if (relevant) loadConfig(() => { if (currentTarget) { updateTooltip(); updateVisibility('config-change'); } });
        });
    }

    function init() {
        loadConfig(() => {
            bindEvents();
            patchShadow();
            if (document.activeElement && isEligible(document.activeElement)) { showFor(document.activeElement); updateVisibility('initial'); }
            log('NITRO ✨ initialized with config', cfg);
        });
    }
    init();
})();
