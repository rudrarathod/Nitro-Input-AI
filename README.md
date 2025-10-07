# Nitro-Input-AI ⚡

A powerful browser extension that enhances any text input with AI assistance. When you type in any text field, a smart ![Gemini Button](icons\icon-16.png) button appears. Click it to get AI-powered suggestions, improvements, or responses using Google's Gemini API.

## Features
- **AI-Powered Assistance**: Integrates with Google Gemini API for intelligent text processing
- **Universal Compatibility**: Works on all pages and input types (text, email, textarea, contenteditable, etc.)
- **Smart Positioning**: Button intelligently positions itself based on caret location, even with multi-line text
- **Shadow DOM Support**: Works with modern web components and Shadow DOM elements
- **Configurable Responses**: Choose response styles (short, detailed, step-by-step, list format)
- **Privacy-Conscious**: Excludes password fields by default (configurable)
- **Theme Support**: Automatic light/dark mode detection with manual override
- **Real-time Processing**: Stop button to cancel long-running AI requests
- **Seamless Integration**: Replaces selected text or inserts at caret position

## Supported Browsers

### Primary Support (Fully Tested)
- **Google Chrome** 88+ (Manifest V3 support)
- **Microsoft Edge** 88+ (Chromium-based)
- **Brave Browser** 1.20+ (Chromium-based)
- **Opera** 74+ (Chromium-based)

### Experimental Support
- **Firefox** 109+ (with Manifest V3 experimental support)
- **Vivaldi** 4.0+ (Chromium-based)
- **Arc Browser** (Chromium-based)

*Note: Any Chromium-based browser with Manifest V3 support should work*

## Setup & Installation

### Prerequisites
- Google Gemini API key (get one from [Google AI Studio](https://makersuite.google.com/app/apikey))
- Supported browser with Manifest V3 support

### Method 1: Load Unpacked (Developer Install)
1. Open your browser's extension page:
   - **Chrome**: `chrome://extensions/`
   - **Edge**: `edge://extensions/`
   - **Brave**: `brave://extensions/`
   - **Opera**: `opera://extensions/`
2. Toggle "Developer mode" (top-right)
3. Click "Load unpacked"
4. Select the folder containing this extension (the one with `manifest.json`)
5. Click the extension icon in the toolbar and configure your API key
6. Navigate to any page with text inputs and start typing

### Method 2: Manual Installation (.crx file)
1. Download the `.crx` file (when available)
2. Open browser extensions page
3. Drag and drop the `.crx` file onto the extensions page
4. Click "Add Extension" when prompted
5. Configure your API key in the extension popup

### Configuration
- **API Key**: Enter your Gemini API key in the popup
- **Model**: Choose between Gemini models (default: gemini-2.0-flash-exp)
- **Response Style**: Select how the AI should respond (on-point, short, detailed, step-by-step, list)
- **Theme**: Auto-detect system theme or manually choose light/dark
- **Password Fields**: Toggle whether to show button on password inputs

## How It Works
1. **Input Detection**: Content script monitors all text inputs, textareas, and contenteditable elements
2. **Smart Button Placement**: <svg width="16" height="18" viewBox="0 0 299 336" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M201.5 52.5C83.0001 2.67029e-05 -43.4999 145 56.5004 260.5L46.5001 278.5C-74.5 157 63 -37 214 38L201.5 52.5Z" fill="#FEB657"/><path d="M93.5 286.5C231 348.5 338 176.5 239.5 78.5L249 62C372.5 169.5 244.5 385.5 78.5 301L93.5 286.5Z" fill="#FEB657"/><path d="M269.5 0.5L154.5 117L166 168.5L269.5 0.5Z" fill="#FEB657"/><path d="M142.5 218L130.5 168.5L26.5 335.5L142.5 218Z" fill="#FEB657"/><path d="M249 126H214L147.5 239.5H183.5L249 126Z" fill="#FEB657"/><path d="M84 210.5L150.5 97.5H112.5L46.5001 210.5H84Z" fill="#FEB657"/></svg> button appears when you focus or type, positioned at the text caret
3. **AI Processing**: Click the button to send text to Gemini API with your configured style preferences
4. **Intelligent Replacement**: AI response replaces selected text or inserts at cursor position
5. **Real-time Feedback**: Loading states and stop functionality for better user experience

## Browser-Specific Features

### Chrome & Chromium-based Browsers
- Full feature support including Shadow DOM
- Secure API key storage with Chrome Sync
- Optimized performance with Service Workers

### Firefox (Experimental)
- Core functionality supported
- Some Manifest V3 features may have limitations
- Manual installation required (not on AMO yet)

### Installation Verification
After installation, you should see:
- Extension icon in browser toolbar
- <svg width="16" height="18" viewBox="0 0 299 336" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M201.5 52.5C83.0001 2.67029e-05 -43.4999 145 56.5004 260.5L46.5001 278.5C-74.5 157 63 -37 214 38L201.5 52.5Z" fill="#FEB657"/><path d="M93.5 286.5C231 348.5 338 176.5 239.5 78.5L249 62C372.5 169.5 244.5 385.5 78.5 301L93.5 286.5Z" fill="#FEB657"/><path d="M269.5 0.5L154.5 117L166 168.5L269.5 0.5Z" fill="#FEB657"/><path d="M142.5 218L130.5 168.5L26.5 335.5L142.5 218Z" fill="#FEB657"/><path d="M249 126H214L147.5 239.5H183.5L249 126Z" fill="#FEB657"/><path d="M84 210.5L150.5 97.5H112.5L46.5001 210.5H84Z" fill="#FEB657"/></svg> button appears when typing in text fields
- Configuration popup accessible via extension icon
- Smooth AI processing with loading states

## Project Structure
```
nitro-input-ai/
├── manifest.json          # Extension definition and permissions
├── background.js          # Service worker handling Gemini API calls
├── contentScript.js       # Main logic for button injection and AI integration
├── styles.css            # Theming and button styling
├── popup.html            # Quick configuration popup
├── popup.js              # Popup functionality
├── options.html          # Extended settings page
├── options.js            # Options page functionality
└── icons/
    ├── icon16.png        # Extension icon (16px)
    ├── icon48.png        # Extension icon (48px)
    ├── icon128.png       # Extension icon (128px)
    └── icon.svg          # Custom SVG button icon
```

## How to Use

### Basic Usage
1. **Type in any text field** - The <svg width="16" height="18" viewBox="0 0 299 336" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M201.5 52.5C83.0001 2.67029e-05 -43.4999 145 56.5004 260.5L46.5001 278.5C-74.5 157 63 -37 214 38L201.5 52.5Z" fill="#FEB657"/><path d="M93.5 286.5C231 348.5 338 176.5 239.5 78.5L249 62C372.5 169.5 244.5 385.5 78.5 301L93.5 286.5Z" fill="#FEB657"/><path d="M269.5 0.5L154.5 117L166 168.5L269.5 0.5Z" fill="#FEB657"/><path d="M142.5 218L130.5 168.5L26.5 335.5L142.5 218Z" fill="#FEB657"/><path d="M249 126H214L147.5 239.5H183.5L249 126Z" fill="#FEB657"/><path d="M84 210.5L150.5 97.5H112.5L46.5001 210.5H84Z" fill="#FEB657"/></svg> button will appear automatically
2. **Click the <svg width="16" height="18" viewBox="0 0 299 336" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M201.5 52.5C83.0001 2.67029e-05 -43.4999 145 56.5004 260.5L46.5001 278.5C-74.5 157 63 -37 214 38L201.5 52.5Z" fill="#FEB657"/><path d="M93.5 286.5C231 348.5 338 176.5 239.5 78.5L249 62C372.5 169.5 244.5 385.5 78.5 301L93.5 286.5Z" fill="#FEB657"/><path d="M269.5 0.5L154.5 117L166 168.5L269.5 0.5Z" fill="#FEB657"/><path d="M142.5 218L130.5 168.5L26.5 335.5L142.5 218Z" fill="#FEB657"/><path d="M249 126H214L147.5 239.5H183.5L249 126Z" fill="#FEB657"/><path d="M84 210.5L150.5 97.5H112.5L46.5001 210.5H84Z" fill="#FEB657"/></svg> button** - Your text will be sent to AI for processing
3. **Wait for response** - AI will process and replace/insert the improved text
4. **Use the stop button** - Cancel processing if needed

### Advanced Usage
- **Select text** before clicking to replace only the selected portion
- **Use different response styles** via the popup configuration
- **Toggle password field support** in settings for sensitive inputs
- **Switch themes** to match your preference (auto-detects by default)

### Keyboard Workflow
1. Type your content
2. Click <svg width="16" height="18" viewBox="0 0 299 336" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M201.5 52.5C83.0001 2.67029e-05 -43.4999 145 56.5004 260.5L46.5001 278.5C-74.5 157 63 -37 214 38L201.5 52.5Z" fill="#FEB657"/><path d="M93.5 286.5C231 348.5 338 176.5 239.5 78.5L249 62C372.5 169.5 244.5 385.5 78.5 301L93.5 286.5Z" fill="#FEB657"/><path d="M269.5 0.5L154.5 117L166 168.5L269.5 0.5Z" fill="#FEB657"/><path d="M142.5 218L130.5 168.5L26.5 335.5L142.5 218Z" fill="#FEB657"/><path d="M249 126H214L147.5 239.5H183.5L249 126Z" fill="#FEB657"/><path d="M84 210.5L150.5 97.5H112.5L46.5001 210.5H84Z" fill="#FEB657"/></svg> (or use planned keyboard shortcut)
3. AI enhances your text instantly
4. Continue typing with improved content

## Usage Examples
- **Email Composition**: Improve tone, fix grammar, or expand on ideas
- **Social Media**: Generate engaging posts or responses
- **Code Comments**: Explain complex code or generate documentation
- **Creative Writing**: Get suggestions for story continuation or improvements
- **Professional Communication**: Polish messages for clarity and professionalism
- **Language Learning**: Get corrections and suggestions for non-native speakers

## Advanced Features
- **Multi-line Support**: Accurate button positioning even with wrapped text
- **Shadow DOM Compatibility**: Works with modern web frameworks (React, Vue, Angular)
- **Dynamic Content**: Automatically detects new inputs added after page load
- **Cross-frame Support**: Functions within iframes and embedded content
- **Keyboard Shortcuts**: Future enhancement for power users
- **Custom Prompts**: Extensible system for specialized AI instructions

## Troubleshooting

### Common Issues
- **Button not appearing**: 
  - Check if password field exclusion is enabled in settings
  - Ensure you're typing in a supported input field
  - Try refreshing the page
- **API errors**: 
  - Verify your Gemini API key is valid and has sufficient quota
  - Check your internet connection
  - Ensure the API key has proper permissions
- **Positioning issues**: 
  - Try refreshing the page or toggling the extension
  - Clear browser cache if positioning seems off
- **Dark mode issues**: Extension automatically detects system theme preferences

### Browser-Specific Issues
- **Firefox**: Some Manifest V3 features may not work perfectly
- **Safari**: Not supported (requires Safari Web Extensions conversion)
- **Older browsers**: Requires Manifest V3 support (Chrome 88+, Edge 88+)

### Performance Tips
- Use shorter text for faster AI processing
- Configure response style to "short" for quicker responses
- Stop processing if taking too long using the stop button

## Privacy & Security
- API keys are stored locally using Chrome's secure storage
- Text content is only sent to Google's Gemini API when you explicitly click the button
- No tracking, analytics, or data collection by the extension
- Password fields are excluded by default for security
- All communication uses HTTPS encryption

## Contributing
Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## License
MIT (feel free to adapt and extend)
