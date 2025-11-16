<div align="center">

# 🛡️ SecretGuard

**AI-safe data protection**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

**Automatically detect and mask sensitive data before sharing with ChatGPT, Claude, Gemini, or any LLM.**

*Zero setup • Complete privacy • 100% client-side*

</div>

---

## ✨ About

SecretGuard is a **100% client-side** sensitive data detection and masking library that protects your secrets before they reach AI services. Built for modern workflows where AI assistants are essential, but data privacy is non-negotiable.

### 🌟 Key Features

- 🔒 **100% Client-Side** - Your data never leaves your browser
- ⚡ **Zero Setup** - Works instantly, no configuration needed
- 🎯 **Smart Detection** - Automatically detects emails, API keys, SSNs, credit cards, passwords, and more
- 🎨 **Real-Time Masking** - See protected text as you type
- 🌓 **Dark Mode** - Beautiful UI with light/dark theme support
- 🆓 **Free Forever** - No sign-up required

---

## 📸 Screenshots

<div align="center">

![SecretGuard Interface](apps/secretguard-web/dist/assets/img1.png)

*Main interface with real-time detection and masking*

![Detection Features](apps/secretguard-web/dist/assets/img2.png)

*Advanced detection capabilities*

![Privacy Protection](apps/secretguard-web/dist/assets/img3.png)

*Client-side privacy guarantee*

</div>

---

## 🚀 Getting Started

```bash
# Clone and install
git clone https://github.com/yourusername/secretguard.git
cd secretguard
npm install

# Start development
npm run dev
```

Available at `http://localhost:5173`

---

## 📁 Project Structure

```
secretguard/
├── 📱 apps/
│   └── secretguard-web/          # Web application
│       ├── src/
│       │   ├── components/       # React components
│       │   │   ├── Header.jsx
│       │   │   ├── Hero.jsx
│       │   │   ├── TextComparator.jsx
│       │   │   ├── TrustSection.jsx
│       │   │   └── ui/           # UI primitives
│       │   ├── lib/              # Utilities
│       │   ├── App.jsx           # Main app component
│       │   └── main.jsx         # Entry point
│       ├── public/               # Static assets
│       ├── dist/                 # Build output
│       └── package.json
│
├── 📦 packages/
│   └── secretguard-core/         # Core detection library
│       ├── src/
│       │   ├── detectors.ts      # Detection algorithms
│       │   ├── masker.ts         # Masking logic
│       │   ├── types.ts          # TypeScript types
│       │   ├── worker.ts         # Web Worker implementation
│       │   └── index.ts          # Main export
│       ├── dist/                 # Compiled output
│       └── package.json
│
├── 📄 package.json               # Root workspace config
├── 📄 vercel.json                # Deployment config
├── 📄 LICENSE                    # MIT License
└── 📄 README.md                  # This file
```

### Key Directories

- **`apps/secretguard-web/`** - React-based web application
- **`packages/secretguard-core/`** - Reusable detection library
- **`dist/`** - Build outputs (gitignored)

---

## 💻 Usage

### Web Application

1. Open the SecretGuard web interface
2. Paste or type your text containing sensitive data
3. Watch as SecretGuard automatically detects and masks sensitive information in real-time
4. Copy the masked text to share safely with AI services

### Programmatic Usage

#### Install the Core Package

```bash
npm install secretguard-core
```

#### Basic Example

```javascript
import { detectSensitiveText, maskText } from 'secretguard-core';

// Detect sensitive data
const text = "Contact me at john@example.com or call 555-1234";
const matches = await detectSensitiveText(text);

// Mask the sensitive data
const result = await maskText(text, matches, {
  mode: 'partial',
  maskChar: '*'
});

console.log(result.maskedText);
// "Contact me at j***@example.com or call ***-1234"
```

---

## 🛠️ Tech Stack

### Frontend

- **React** 18.2.0 - UI Framework
- **Vite** 5.0.8 - Build Tool
- **TypeScript** 5.3.3 - Type Safety
- **Tailwind CSS** 3.4.0 - Styling
- **Framer Motion** 12.23.24 - Animations
- **Lucide Icons** 0.553.0 - Icons

### Core Library

- **TypeScript** 5.3.3 - Type Safety
- **tsup** 8.0.1 - Bundling
- **Vitest** 1.1.0 - Testing

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

### Architecture

- **Monorepo** - Workspace-based project structure
- **Web Workers** - Background processing for detection
- **Client-Side Only** - Zero server dependencies

---

## 🤝 Contributing

Contributions are welcome! Fork the repo, create a feature branch, make your changes, and open a pull request.

- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation improvements

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with 🛡️ by the SecretGuard team**

[⭐ Star us on GitHub](https://github.com/yourusername/secretguard) • [🐛 Report Bug](https://github.com/yourusername/secretguard/issues) • [💡 Request Feature](https://github.com/yourusername/secretguard/issues)

</div>
