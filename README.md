<div align="center">

# ✨ Nitro-Input-AI

<img src="icons/icon-128.png" alt="Nitro Input AI Logo" width="120"/>

### 🚀 AI-Powered Text Enhancement for Every Input Field

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome](https://img.shields.io/badge/Chrome-88%2B-4285F4?logo=google-chrome&logoColor=white)](https://www.google.com/chrome/)

A browser extension that adds AI assistance to any text field. Type anywhere, click the ✨ button, and get instant AI-powered text improvements using Google's Gemini API.

[📦 Installation](#-installation) • [🎮 Usage](#-how-to-use) • [🐛 Troubleshooting](#-troubleshooting)

---

</div>

## ✨ Key Features

- 🤖 **AI-Powered**: Uses Google Gemini API for intelligent text enhancement
- 🌐 **Universal**: Works on all websites and input fields
- 🎨 **Customizable**: Multiple response styles (short, detailed, step-by-step, list)
- 🔒 **Private**: API keys stored locally, no tracking or analytics
- 🎯 **Smart**: Automatically positions near your cursor
- 🌙 **Themed**: Auto light/dark mode support

---

## 🌐 Supported Browsers

| Browser | Status |
|---------|--------|
| 🔵 Chrome 88+ | ✅ Fully Supported |
| 🔷 Edge 88+ | ✅ Fully Supported |
| 🦁 Brave 1.20+ | ✅ Fully Supported |
| 🔴 Opera 74+ | ✅ Fully Supported |
| 🦊 Firefox 109+ | ⚠️ Experimental |

> Any Chromium-based browser with Manifest V3 support should work!

---

## 📦 Installation

### Prerequisites

1. **Get a Gemini API Key** (free): [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Have a supported browser**: Chrome, Edge, Brave, or Opera (88+)

### Quick Install

1. **Download the extension**
   ```bash
   git clone https://github.com/rudrarathod/Nitro-Input-AI.git
   cd Nitro-Input-AI
   ```
   Or download as ZIP and extract.

2. **Load in browser**
   - Open `chrome://extensions/` (or `edge://extensions/`, etc.)
   - Enable **Developer mode** (toggle in top-right)
   - Click **Load unpacked**
   - Select the `Nitro-Input-AI` folder

3. **Configure**
   - Click the ✨ extension icon in toolbar
   - Paste your Gemini API key
   - Choose your preferred settings
   - Click **Save**

4. **Test it!**
   - Visit any website (Gmail, Twitter, etc.)
   - Click in a text field
   - Type something
   - Click the ✨ button that appears

---

## ⚙️ Configuration

Click the extension icon to access settings:

| Setting | Options | Description |
|---------|---------|-------------|
| **API Key** | Your Gemini key | Required for AI functionality |
| **Model** | `gemini-2.5-flash` (default) | AI model to use |
| **Response Style** | Default, Short, Detailed, Step-by-step, List | How AI formats responses |
| **Theme** | Auto, Light, Dark | Visual appearance |
| **Password Fields** | On/Off | Show button on password fields (off by default) |
| **Button Position** | Top-right, Center-right | Where ✨ button appears |

For advanced settings, right-click the extension icon and select **Options**.

---

## 🎮 How to Use

1. **Type** in any text field on any website
2. **Look** for the ✨ button that appears near your cursor
3. **Click** the button to send your text to AI
4. **Review** the AI-enhanced response that replaces your text
5. **Edit** further if needed or continue typing

### Tips
- **Select text** before clicking to enhance only that part
- Use **🛑 Stop button** if processing takes too long
- Try different **response styles** for different needs
- Works on emails, social media, forms, comments, etc.

---

## 🐛 Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| **Button not appearing** | • Ensure extension is enabled at `chrome://extensions/`<br>• Refresh the page<br>• Check if field type is supported (text, email, textarea)<br>• Enable Shadow DOM support for React/Vue apps |
| **API errors** | • Verify API key is correct (starts with "AIza")<br>• Get new key at [Google AI Studio](https://makersuite.google.com/app/apikey)<br>• Check internet connection<br>• Verify API quota not exceeded |
| **Button position wrong** | • Change anchor mode in settings (Options → Anchor mode)<br>• Clear browser cache<br>• Refresh page after changing settings |
| **Slow responses** | • Use shorter text<br>• Try "Short" response style<br>• Check internet speed<br>• Click 🛑 to cancel |
| **Dark mode issues** | • Try manual override in settings<br>• Toggle between Auto/Light/Dark modes |

### Still Need Help?

1. Check browser console (F12) for errors
2. Temporarily disable other extensions
3. Reinstall the extension
4. [Report an issue on GitHub](https://github.com/rudrarathod/Nitro-Input-AI/issues)

---

## 🔐 Privacy & Security

### What We Collect
- ❌ **Nothing!** No tracking, analytics, or data collection

### What We Store (Locally)
- ✅ API Key (encrypted in browser storage)
- ✅ User preferences (theme, response style, etc.)
- ⚠️ All stored locally on YOUR device

### Key Points
- Text sent **only when you click** the ✨ button
- Processed by Google Gemini API (subject to [Google's Privacy Policy](https://policies.google.com/privacy))
- Extension doesn't store or log your text
- Password fields excluded by default
- 100% open source - [review our code](https://github.com/rudrarathod/Nitro-Input-AI)

### Permissions
| Permission | Purpose |
|------------|---------|
| `storage` | Save your settings locally |
| `<all_urls>` | Work on all websites |
| `host_permissions` | Send text to Gemini API |

---

## 🤝 Contributing

We welcome contributions! Here's how to help:

### Ways to Contribute
- 🐛 **Report bugs**: [Open an issue](https://github.com/rudrarathod/Nitro-Input-AI/issues)
- 💡 **Suggest features**: Share your ideas
- 🔧 **Submit code**: Fork, make changes, and submit a PR
- 📚 **Improve docs**: Fix typos, add examples

### Development Setup
```bash
git clone https://github.com/rudrarathod/Nitro-Input-AI.git
cd Nitro-Input-AI

# Load in browser: chrome://extensions/ → Developer mode ON → Load unpacked
```

---

## 📄 License

MIT License - Free to use, modify, and distribute.

[Full License Text](LICENSE)

---

## 🔗 Links

- [GitHub Repository](https://github.com/rudrarathod/Nitro-Input-AI)
- [Report Issues](https://github.com/rudrarathod/Nitro-Input-AI/issues)
- [Google Gemini API Docs](https://ai.google.dev/docs)

---

<div align="center">

**Made with ❤️ by Rudra Rathod**

*Empowering your text input with AI* ✨

⭐ Star this repo if you find it useful!

</div>
