# NITRO ✨ AI
### Universal AI-Powered Text Enhancement Browser Extension

---

## 🔍 Project Overview
**NITRO AI** is a high-performance, Manifest V3 browser extension that integrates real-time AI assistance directly into any text field across the web. Rather than forcing users to context-switch to external AI clients, NITRO AI detects active text inputs, textareas, and contenteditable containers to inject a floating interactive helper. By integrating Google's Gemini API client-side, the system enhances, refines, and formats in-context text selections or drafts instantly, prioritizing user privacy through strictly local credential storage.

---

## 🛠️ Core Technologies
*   **Extension Architecture:** Chrome Extension Manifest V3, Service Workers, Content Scripts, Options Pages, Cross-Context Messaging API
*   **Languages & Styling:** HTML5, Vanilla JavaScript (ES6+), CSS3 (Custom Properties, Glassmorphism, Responsive Dark/Light Themes)
*   **APIs & Third-Party Services:** Google Gemini API (`gemini-2.5-flash`), Chrome Storage Sync API
*   **DOM & Rendering:** Selection & Range API, MutationObserver API, HTML5 Canvas Rendering Context (`Canvas2D` for font metrics)

---

## 🚀 Key Contributions & Engineering Challenges

*   **Engineered Precise Caret Tracking & Positioning:** 
    Implemented a real-time, canvas-backed caret-tracking algorithm for input fields and textareas. Because HTML inputs do not natively expose caret coordinate positions, the system dynamically queries active element computed styles (padding, borders, font weights, and scroll metrics) to map substring widths using `CanvasRenderingContext2D.measureText()`. Integrated this with the Selection/Range API for contenteditable elements to resolve caret coordinates, maintaining an sub-16ms positioning refresh rate.
*   **Architected Encapsulated Shadow DOM Traversal:** 
    Designed support for modern web applications using isolated shadow roots (e.g., React, Lit, Vue). Patched the browser's native `Element.prototype.attachShadow` at runtime and coupled it with delegated `focusin` event listeners, allowing the content script to seamlessly traverse shadow boundaries and auto-position the floating helper button on components that standard extension scripts cannot query.
*   **Optimized Rendering Performance & Reflow Prevention:** 
    Mitigated potential layout thrashing and UI lag during window resizing and scrolling by throttling DOM placement updates under a `requestAnimationFrame` event-loop pipeline. Kept the layout footprint of host websites at zero by rendering the button and helper tooltips inside an absolute-positioned floating layout injected directly into the document root, bypassing the need to modify parent container sizes.
*   **Implemented Asynchronous Abortable Message Relay:** 
    Created a secure, non-blocking bridge using Chrome's runtime messaging API to offload API calls to background service workers. Developed a custom abort mechanism that listens to user-triggered cancel events (`Stop AI` button) to instantly terminate unresolved background fetch promises and restore the text fields to their editable state.
*   **Designed a Zero-Trust local Storage Model:** 
    Maintained a 100% dependency-free extension bundle under 45KB. By storing API credentials and customization styles strictly within the client's `chrome.storage.sync` area and transmitting payloads directly to the Google Gemini endpoint, the extension achieves zero telemetry overhead and maximum privacy without intermediate server-side hops.

---

## 🏗️ Key Architecture & Design Decisions

### 1. Offloading Execution to Background Service Workers
To ensure optimal performance and security, all network requests to the Gemini API are routed from the isolated content script through the background service worker (`background.js`) using asynchronous message passing.
*   *Rationale:* This prevents host pages from intercepting API keys via the DOM. It also avoids CORS errors since the background worker runs in a privileged browser context with explicit host permissions, while simultaneously keeping the execution memory footprint of active tabs as low as possible.

### 2. Canvas-Driven Dynamic Typography Parsing
Rather than using static button positions (like a fixed top-right corner), the UI dynamically tracks cursor positioning to place the button exactly where the user is typing.
*   *Rationale:* By utilizing an offscreen HTML5 canvas to measure string widths based on the target element's active font-family, font-size, and font-weight, the extension dynamically responds to variable styling across different websites (e.g., Gmail vs. Twitter). This results in a cohesive, fluid user experience across highly diverse page layouts.

---

## 💡 Key Takeaways & Learnings

*   **Mastery of Browser Sandboxing & Security Boundaries:** 
    Developing NITRO AI provided deep exposure to isolated execution contexts, cross-origin resource sharing (CORS), and the nuances of interacting with Shadow DOMs in modern component-driven frontends. Navigating these constraints without degrading client performance was key to achieving a universal implementation.
*   **UX Design under Network Latency Constraints:** 
    Learned the high value of visual micro-interactions (such as rotative keyframe loader animations, conditional tooltips, and in-place abort capabilities) in keeping the application feeling fast and responsive to the user even during longer API call round-trips.
