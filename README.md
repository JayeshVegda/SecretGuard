<div align="center">

# 🛡️ SecretGuard

**Protect Your Secrets Before AI Sees Them**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

[![GitHub stars](https://img.shields.io/github/stars/JayeshVegda/SecretGuard?style=for-the-badge&logo=github&logoColor=white)](https://github.com/JayeshVegda/SecretGuard)
[![GitHub forks](https://img.shields.io/github/forks/JayeshVegda/SecretGuard?style=for-the-badge&logo=github&logoColor=white)](https://github.com/JayeshVegda/SecretGuard)

---

</div>

## 📖 About SecretGuard

<div align="center">

**SecretGuard** is a privacy-first web application that automatically detects and masks sensitive data before sharing it with AI assistants like ChatGPT, Claude, Gemini, or any LLM.

</div>

### 🎯 Why SecretGuard?

In today's AI-driven world, sharing code and data with AI tools often means accidentally exposing sensitive information:

<div align="center">

| 🔐 | 🔑 | 💳 | 📧 | 🗄️ |
|:---:|:---:|:---:|:---:|:---:|
| **API Keys** | **Private Keys** | **Credit Cards** | **Email Addresses** | **Database Strings** |
| Credentials | Tokens | Financial Data | Personal Info | Connection URLs |

</div>

<div align="center">

**SecretGuard solves this** by detecting and masking sensitive information **entirely in your browser**.  
**No data leaves your device. No servers. No tracking.** 🔒

</div>

### ✨ Key Highlights

<div align="center">

| 🎯 | 🔒 | ⚡ | 🎨 | 🚀 | 📦 | 🔓 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **15+ Detection Types** | **100% Client-Side** | **Real-Time Processing** | **Modern UI** | **Zero Setup** | **Lightweight** | **Open Source** |
| Comprehensive patterns | Local processing | Instant feedback | Glassmorphism | Works out of box | Optimized bundle | Fully auditable |

</div>

---

## 🔄 How It Works

<div align="center">

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────┐
│  📝 Input   │ ───▶ │  🔍 Detection    │ ───▶ │  🎭 Output  │
│  Your Text  │      │  15+ Patterns    │      │  Protected  │
└─────────────┘      └──────────────────┘      └─────────────┘
```

</div>

### 📋 Step-by-Step Process

<div align="left">

1. **📋 Input** → Paste text containing sensitive information
2. **🔍 Detection** → Advanced pattern matching scans for 15+ data types
3. **✅ Validation** → Each match validated (e.g., Luhn algorithm for credit cards)
4. **🎭 Masking** → Sensitive data replaced with safe placeholders like `[EMAIL_REDACTED]`
5. **📋 Output** → Clean, protected version ready to share

</div>

### 💡 Example

<div align="center">

**Before:**
```
Contact me at john.doe@example.com or call +1-555-123-4567
My SSN is 123-45-6789
Credit card: 4532-1234-5678-9010
```

**After:**
```
Contact me at [EMAIL_REDACTED] or call [PHONE_REDACTED]
My SSN is [SSN_REDACTED]
Credit card: [CREDIT_CARD_REDACTED]
```

</div>

---

## 🎯 Detection Capabilities

<div align="center">

### 📋 Personal Information
🆔 **SSN** • 📞 **Phone Numbers** • 📧 **Email Addresses** • 🏠 **Street Addresses**

### 💳 Financial Data
💳 **Credit Cards** (Luhn validated) • 🏦 **Bank Accounts** • 🌍 **IBAN**

### 🔑 Credentials & Secrets
🔐 **API Keys** • ☁️ **AWS Keys** • 🗄️ **Database URLs** • 🔒 **Passwords** • 🎫 **JWT Tokens** • 🔑 **Private Keys**

### 🔐 Service-Specific Tokens
🐙 **GitHub** • 💬 **Slack** • 💳 **Stripe** • 🔍 **Google API** • 🤖 **OpenAI** • 📞 **Twilio**

### 🌐 Network Information
🌍 **IP Addresses** (IPv4/IPv6) • 🔌 **MAC Addresses** • 🖥️ **Hostnames**

### 📄 Documents
🆔 **National IDs** • 📘 **Passport Numbers**

</div>

---

## 🛠️ Technology Stack

<div align="center">

### ⚛️ Frontend Framework
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite&logoColor=white)

### 🎨 Styling & UI
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Latest-000000?style=flat-square)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12.23-0055FF?style=flat-square&logo=framer&logoColor=white)

### 🧪 Testing & Quality
![Vitest](https://img.shields.io/badge/Vitest-1.1-6E9F18?style=flat-square&logo=vitest&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Check-3178C6?style=flat-square&logo=typescript&logoColor=white)

### 📦 Build Tools
![tsup](https://img.shields.io/badge/tsup-8.0-FF6B6B?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=flat-square&logo=vite&logoColor=white)

### 🎯 Additional
![Lucide](https://img.shields.io/badge/Lucide%20React-Icons-FF6B6B?style=flat-square)

</div>

---

## 🚀 Quick Start

### 📋 Prerequisites

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white)
![npm](https://img.shields.io/badge/npm-Latest-CB3837?style=flat-square&logo=npm&logoColor=white)

</div>

### ⚡ Installation & Run

```bash
# Clone the repository
git clone https://github.com/JayeshVegda/SecretGuard.git
cd SecretGuard

# Install dependencies
npm install

# Build core library
npm run build:core

# Start development server
npm run dev
```

<div align="center">

🌐 **Open** [`http://localhost:3000`](http://localhost:3000) **in your browser**

</div>

### 🏗️ Production Build

```bash
# Build for production
npm run build

# Preview production build
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
│       │   ├── lib/               # Utilities
│       │   ├── App.jsx            # Main app
│       │   └── main.jsx          # Entry point
│       └── public/               # Static assets
│
├── 📦 packages/
│   └── vibegard-core/             # Core detection library
│       ├── src/
│       │   ├── detectors.ts      # Pattern detection
│       │   ├── masker.ts         # Masking logic
│       │   └── types.ts          # TypeScript types
│       └── dist/                 # Compiled output
│
└── package.json                   # Monorepo config
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

<div align="center">

We welcome contributions! Here's how you can help:

</div>

<div align="left">

1. 🍴 **Fork** the repository
2. 🌿 **Create** feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 **Commit** changes (`git commit -m 'Add AmazingFeature'`)
4. 📤 **Push** to branch (`git push origin feature/AmazingFeature`)
5. 🔄 **Open** Pull Request

</div>

### ➕ Adding New Detection Types

<div align="left">

1. Add type to `packages/vibegard-core/src/types.ts`
2. Create detector in `packages/vibegard-core/src/detectors.ts`
3. Add to `detectSensitiveText` function
4. Write tests in `packages/vibegard-core/src/detectors.test.ts`

</div>

---

## 📝 License

<div align="center">

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

</div>

---

<div align="center">

## 👤 Author

**Jayesh Vegda**

[![GitHub](https://img.shields.io/badge/GitHub-@JayeshVegda-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/JayeshVegda)

---

**Made with ❤️ for privacy-conscious developers**

*Share freely. Stay secure.* 🛡️

[⬆ Back to Top](#-secretguard)

</div>
