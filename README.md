<div align="center">

# 🛡️ SecretGuard

**Protect Your Secrets Before AI Sees Them**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

[![GitHub stars](https://img.shields.io/github/stars/JayeshVegda/SecretGuard?style=social)](https://github.com/JayeshVegda/SecretGuard)
[![GitHub forks](https://img.shields.io/github/forks/JayeshVegda/SecretGuard?style=social)](https://github.com/JayeshVegda/SecretGuard)

</div>

---

## 📖 About SecretGuard

**SecretGuard** is a powerful, privacy-first web application designed to protect your sensitive data before sharing it with AI assistants like ChatGPT, Claude, Gemini, or any Large Language Model (LLM). 

### Why SecretGuard?

In today's AI-driven world, developers, analysts, and professionals frequently share code, logs, and data with AI tools to get help and insights. However, this often means accidentally exposing:

- 🔐 **API keys and credentials**
- 💳 **Credit card numbers and financial data**
- 📧 **Email addresses and personal information**
- 🗄️ **Database connection strings**
- 🔑 **Private keys and tokens**

**SecretGuard solves this problem** by automatically detecting and masking sensitive information **entirely in your browser** before you share anything. No data leaves your device. No servers. No tracking. Complete privacy.

### Key Highlights

✨ **15+ Detection Types** - Comprehensive pattern matching for various sensitive data formats  
🔒 **100% Client-Side** - All processing happens locally in your browser  
⚡ **Real-Time Processing** - Instant detection and masking as you type  
🎨 **Modern UI** - Beautiful glassmorphism design with dark/light mode  
🚀 **Zero Setup** - No configuration needed, works out of the box  
📦 **Lightweight** - Optimized bundle size for fast loading  
🔓 **Open Source** - Transparent, auditable codebase  

---

## ✨ Key Features

### 🔍 **Comprehensive Detection**
SecretGuard uses advanced pattern matching and validation algorithms to detect **15+ types** of sensitive data including emails, SSNs, credit cards, API keys, passwords, JWT tokens, and more. Each detection includes smart validation to reduce false positives.

### 🎨 **Modern User Interface**
Experience a beautiful, modern interface featuring:
- **Glassmorphism Design** - Sleek, frosted glass effects
- **Dark/Light Mode** - Seamless theme switching with system preference detection
- **Real-Time Feedback** - See detections and highlights instantly
- **Side-by-Side Comparison** - View original and protected text simultaneously
- **Category Badges** - Visual indicators for each detected data type

### 🔐 **Privacy First**
Your privacy is our top priority:
- **100% Client-Side Processing** - Everything runs in your browser
- **Zero Data Collection** - No servers, no APIs, no tracking
- **No Sign-Up Required** - Start protecting your data immediately
- **Open Source** - Fully auditable codebase

### ⚡ **High Performance**
Built for speed and efficiency:
- **Real-Time Detection** - Instant feedback as you type
- **Optimized Algorithms** - Fast pattern matching
- **Lightweight Bundle** - Minimal footprint for quick loading
- **Web Worker Support** - Non-blocking processing for large texts

---

## 🔄 How It Works

<div align="center">

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Input Text    │ --> │  Detect Secrets  │ --> │  Mask & Output  │
│  (Your Data)    │     │  (15+ Patterns)  │     │  (Protected)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

</div>

### Step-by-Step Process

1. **📋 Input** - You paste or type text containing sensitive information into SecretGuard
2. **🔍 Detection** - Advanced pattern matching algorithms scan the text for 15+ types of sensitive data
3. **✅ Validation** - Each potential match is validated using specific rules (e.g., Luhn algorithm for credit cards)
4. **🎭 Masking** - Detected sensitive data is replaced with safe placeholders like `[EMAIL_REDACTED]`
5. **📋 Output** - You get a clean, protected version ready to share safely with AI tools

### Example

**Input:**
```
Contact me at john.doe@example.com or call +1-555-123-4567.
My SSN is 123-45-6789.
Credit card: 4532-1234-5678-9010
AWS Key: AKIAIOSFODNN7EXAMPLE
```

**Output:**
```
Contact me at [EMAIL_REDACTED] or call [PHONE_REDACTED].
My SSN is [SSN_REDACTED].
Credit card: [CREDIT_CARD_REDACTED]
AWS Key: [AWS_KEY_REDACTED]
```

---

## 🎯 Detection Capabilities

SecretGuard can detect and protect the following types of sensitive data:

### 📋 **Personal Information**
- 🆔 **SSN** - Social Security Numbers (US format)
- 📞 **Phone Numbers** - International phone number formats
- 📧 **Email Addresses** - All common email formats
- 🏠 **Street Addresses** - Physical location addresses

### 💳 **Financial Data**
- 💳 **Credit Cards** - With Luhn algorithm validation
- 🏦 **Bank Accounts** - Account numbers and formats
- 🌍 **IBAN** - International Bank Account Numbers with checksum validation

### 🔑 **Credentials & Secrets**
- 🔐 **API Keys** - Generic API key patterns
- ☁️ **AWS Keys** - AWS access keys and secret keys
- 🗄️ **Database URLs** - PostgreSQL, MySQL, MongoDB, Redis connection strings
- 🔒 **Passwords** - Passwords in various configuration formats
- 🎫 **JWT Tokens** - JSON Web Tokens
- 🔑 **Private Keys** - RSA and SSH private keys

### 🔐 **Service-Specific Tokens**
- 🐙 **GitHub Tokens** - Personal access tokens (ghp_, gho_, ghs_)
- 💬 **Slack Tokens** - Workspace tokens (xoxa-, xoxb-, xoxp-)
- 💳 **Stripe Keys** - API keys (sk_live_, sk_test_)
- 🔍 **Google API Keys** - Service account keys
- 🤖 **OpenAI Keys** - API keys (sk-)
- 📞 **Twilio SIDs** - Account identifiers

### 🌐 **Network Information**
- 🌍 **IP Addresses** - Both IPv4 and IPv6 formats
- 🔌 **MAC Addresses** - Hardware addresses
- 🖥️ **Hostnames** - Server and machine names

### 📄 **Documents**
- 🆔 **National IDs** - Various country formats (Aadhaar, Bangladesh NID, etc.)
- 📘 **Passport Numbers** - International passport formats

---

## 🛠️ Technology Stack

SecretGuard is built with modern, reliable technologies:

### ⚛️ **Frontend Framework**
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)

- **React 18.2** - Modern UI library with hooks and concurrent features
- **TypeScript 5.3** - Type-safe development with enhanced tooling
- **Vite 5.0** - Lightning-fast build tool and dev server

### 🎨 **Styling & UI**
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white) ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Latest-000000?logo=shadcnui)

- **TailwindCSS 3.4** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **Framer Motion** - Smooth animations and transitions

### 🧪 **Testing & Quality**
![Vitest](https://img.shields.io/badge/Vitest-1.1-6E9F18?logo=vitest&logoColor=white)

- **Vitest** - Fast unit testing framework
- **TypeScript** - Compile-time type checking

### 📦 **Build Tools**
- **tsup** - Fast TypeScript bundler for the core library
- **Vite** - Optimized production builds

### 🎯 **Additional Libraries**
- **Lucide React** - Beautiful icon library
- **class-variance-authority** - Component variant management

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Modern browser with ES6+ support

### Installation & Run

```bash
git clone https://github.com/JayeshVegda/SecretGuard.git
cd SecretGuard
npm install
npm run build:core
npm run dev
```

🌐 Open `http://localhost:3000` in your browser

### Production Build

```bash
npm run build
cd apps/vibegard-web && npm run preview
```

---

## 📁 Project Structure

```
SecretGuard/
├── 📱 apps/
│   └── vibegard-web/              # React web application
│       ├── src/
│       │   ├── components/        # React components
│       │   │   ├── ui/            # Reusable UI components
│       │   │   ├── Header.tsx     # App header
│       │   │   ├── Hero.tsx       # Hero section
│       │   │   └── TextComparator.tsx  # Main text comparison view
│       │   ├── lib/               # Utility functions
│       │   ├── App.jsx            # Main app component
│       │   └── main.jsx          # Entry point
│       ├── public/               # Static assets
│       └── package.json
│
├── 📦 packages/
│   └── vibegard-core/             # Core detection & masking library
│       ├── src/
│       │   ├── detectors.ts      # Pattern detection logic
│       │   ├── masker.ts         # Masking & verification
│       │   ├── types.ts          # TypeScript definitions
│       │   ├── vibegard.ts       # Main VibeGard class
│       │   └── worker.ts         # WebWorker implementation
│       ├── dist/                 # Compiled output
│       └── package.json
│
└── package.json                   # Monorepo configuration
```

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# Watch mode
cd packages/vibegard-core
npm run test -- --watch

# With coverage
npm run test -- --coverage
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. 🍴 **Fork** the repository
2. 🌿 **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 **Push** to the branch (`git push origin feature/AmazingFeature`)
5. 🔄 **Open** a Pull Request

### Adding New Detection Types

To add a new sensitive data pattern:

1. Add the type to `SensitiveDataType` in `packages/vibegard-core/src/types.ts`
2. Create a detector function in `packages/vibegard-core/src/detectors.ts`
3. Add it to the `detectSensitiveText` function
4. Write tests in `packages/vibegard-core/src/detectors.test.ts`

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

<div align="center">

**Jayesh Vegda**

[![GitHub](https://img.shields.io/badge/GitHub-JayeshVegda-181717?logo=github)](https://github.com/JayeshVegda)

</div>

---

<div align="center">

**Made with ❤️ for privacy-conscious developers**

*Share freely. Stay secure.* 🛡️

[⬆ Back to Top](#-secretguard)

</div>
