<div align="center">

# 🛡️ SecretGuard

**Protect Your Secrets Before AI Sees Them**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

[![GitHub stars](https://img.shields.io/github/stars/JayeshVegda/SecretGuard?style=for-the-badge&logo=github)](https://github.com/JayeshVegda/SecretGuard)
[![GitHub forks](https://img.shields.io/github/forks/JayeshVegda/SecretGuard?style=for-the-badge&logo=github)](https://github.com/JayeshVegda/SecretGuard)

</div>

---

## 📖 About SecretGuard

**SecretGuard** is a privacy-first web application that automatically detects and masks sensitive data before sharing it with AI assistants like ChatGPT, Claude, Gemini, or any LLM.

### 🎯 Why SecretGuard?

In today's AI-driven world, sharing code and data with AI tools often means accidentally exposing:

<div align="center">

🔐 **API Keys** • 🔑 **Private Keys** • 💳 **Credit Cards** • 📧 **Email Addresses** • 🗄️ **Database Strings**

</div>

**SecretGuard solves this** by detecting and masking sensitive information **entirely in your browser**. No data leaves your device. No servers. No tracking.

### ✨ Key Highlights

🎯 **15+ Detection Types** • 🔒 **100% Client-Side** • ⚡ **Real-Time Processing** • 🎨 **Modern UI** • 🚀 **Zero Setup** • 📦 **Lightweight** • 🔓 **Open Source**

---

## 🔄 How It Works

```
Input Text → Detect Secrets (15+ Patterns) → Mask & Output
```

1. **📋 Input** - Paste text containing sensitive information
2. **🔍 Detection** - Advanced pattern matching scans for 15+ data types
3. **✅ Validation** - Each match validated (e.g., Luhn algorithm for credit cards)
4. **🎭 Masking** - Sensitive data replaced with safe placeholders like `[EMAIL_REDACTED]`
5. **📋 Output** - Clean, protected version ready to share

**Example:**
```
Input:  Contact me at john.doe@example.com or call +1-555-123-4567
Output: Contact me at [EMAIL_REDACTED] or call [PHONE_REDACTED]
```

---

## 🎯 Detection Capabilities

**📋 Personal:** SSN, Phone Numbers, Email Addresses, Street Addresses  
**💳 Financial:** Credit Cards (Luhn validated), Bank Accounts, IBAN  
**🔑 Credentials:** API Keys, AWS Keys, Database URLs, Passwords, JWT Tokens, Private Keys  
**🔐 Service Tokens:** GitHub, Slack, Stripe, Google API, OpenAI, Twilio  
**🌐 Network:** IP Addresses (IPv4/IPv6), MAC Addresses, Hostnames  
**📄 Documents:** National IDs, Passport Numbers

---

## 🛠️ Technology Stack

**Frontend:** React 18.2 • TypeScript 5.3 • Vite 5.0  
**Styling:** TailwindCSS 3.4 • shadcn/ui • Framer Motion  
**Testing:** Vitest • TypeScript  
**Build:** tsup • Vite  
**Icons:** Lucide React

---

## 🚀 Quick Start

**Prerequisites:** Node.js 18+ and npm/yarn/pnpm

```bash
git clone https://github.com/JayeshVegda/SecretGuard.git
cd SecretGuard
npm install
npm run build:core
npm run dev
```

🌐 Open `http://localhost:3000`

**Production:**
```bash
npm run build
cd apps/vibegard-web && npm run preview
```

---

## 📁 Project Structure

```
SecretGuard/
├── 📱 apps/vibegard-web/          # React web application
│   ├── src/components/           # React components
│   ├── src/lib/                  # Utilities
│   └── public/                   # Static assets
├── 📦 packages/vibegard-core/    # Core detection & masking library
│   ├── src/detectors.ts         # Pattern detection
│   ├── src/masker.ts            # Masking logic
│   └── src/types.ts             # TypeScript definitions
└── package.json                  # Monorepo config
```

---

## 🧪 Testing

```bash
npm run test                    # Run all tests
cd packages/vibegard-core && npm run test -- --watch  # Watch mode
npm run test -- --coverage     # With coverage
```

---

## 🤝 Contributing

1. 🍴 Fork the repository
2. 🌿 Create feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit changes (`git commit -m 'Add AmazingFeature'`)
4. 📤 Push to branch (`git push origin feature/AmazingFeature`)
5. 🔄 Open Pull Request

**Adding Detection Types:** Add type to `types.ts`, create detector in `detectors.ts`, add to `detectSensitiveText`, write tests.

---

## 📝 License

MIT License - see [LICENSE](LICENSE) for details

---

<div align="center">

**👤 Jayesh Vegda** • [![GitHub](https://img.shields.io/badge/GitHub-Profile-blue?style=flat&logo=github)](https://github.com/JayeshVegda)

**Made with ❤️ for privacy-conscious developers**

*Share freely. Stay secure.* 🛡️

[⬆ Back to Top](#-secretguard)

</div>
