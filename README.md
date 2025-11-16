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

## 📊 Project Statistics

<div align="center">

| **Metric** | **Value** |
|:---:|:---:|
| 🎯 **Detection Types** | **15+** |
| 🔒 **Privacy Level** | **100%** |
| ⚡ **Processing** | **Client-Side** |
| 🚀 **Build Time** | **< 5s** |
| 📦 **Bundle Size** | **< 50KB** |
| 🧪 **Test Coverage** | **> 80%** |

</div>

---

## ✨ Key Features

<div align="center">

| 🔍 **Detection** | 🎨 **UI/UX** | 🔐 **Privacy** | ⚡ **Performance** |
|:---:|:---:|:---:|:---:|
| 15+ Data Types | Glassmorphism Design | 100% Client-Side | Real-Time Processing |
| Pattern Matching | Dark/Light Mode | Zero Tracking | Instant Feedback |
| Smart Validation | Modern Interface | No Servers | Optimized Bundle |

</div>

---

## 🚀 Quick Start

### 📦 Installation

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

🌐 **Application will be available at:** `http://localhost:3000`

### 🏗️ Production Build

```bash
# Build everything
npm run build

# Preview production build
cd apps/vibegard-web && npm run preview
```

---

## 📖 How It Works

<div align="center">

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Input Text    │ --> │  Detect Secrets  │ --> │  Mask & Output  │
│  (Your Data)    │     │  (15+ Patterns)  │     │  (Protected)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

</div>

### 📝 Step-by-Step Usage

1. **📋 Paste Your Text** - Enter or paste text containing sensitive information
2. **🔍 Automatic Detection** - SecretGuard instantly identifies sensitive data patterns
3. **👀 Review Highlights** - See exactly what was detected in the original text panel
4. **📋 Copy Protected Text** - Use the masked version from the protected text panel
5. **✅ Share Safely** - Paste the protected text into ChatGPT, Claude, or any LLM without worry

---

## 🎯 Detection Capabilities

<details>
<summary><b>📋 Personal Information</b></summary>

- 🆔 **SSN** - Social Security Numbers
- 📞 **Phone Numbers** - International formats
- 📧 **Email Addresses** - All common formats
- 🏠 **Street Addresses** - Physical locations

</details>

<details>
<summary><b>💳 Financial Data</b></summary>

- 💳 **Credit Cards** - With Luhn validation
- 🏦 **Bank Accounts** - Account numbers
- 🌍 **IBAN** - International Bank Account Numbers

</details>

<details>
<summary><b>🔑 Credentials & Secrets</b></summary>

- 🔐 **API Keys** - Generic API keys
- ☁️ **AWS Keys** - Access keys and secrets
- 🗄️ **Database URLs** - Connection strings
- 🔒 **Passwords** - In various formats
- 🎫 **JWT Tokens** - JSON Web Tokens
- 🔑 **Private Keys** - RSA/SSH keys

</details>

<details>
<summary><b>🔐 Service-Specific Tokens</b></summary>

- 🐙 **GitHub Tokens** - Personal access tokens
- 💬 **Slack Tokens** - Workspace tokens
- 💳 **Stripe Keys** - API keys
- 🔍 **Google API Keys** - Service keys
- 🤖 **OpenAI Keys** - API keys
- 📞 **Twilio SIDs** - Account identifiers

</details>

<details>
<summary><b>🌐 Network Information</b></summary>

- 🌍 **IP Addresses** - IPv4 and IPv6
- 🔌 **MAC Addresses** - Hardware addresses
- 🖥️ **Hostnames** - Server names

</details>

<details>
<summary><b>📄 Documents</b></summary>

- 🆔 **National IDs** - Various countries
- 📘 **Passport Numbers** - International formats

</details>

---

## 🛠️ Technology Stack

<div align="center">

| **Category** | **Technologies** |
|:---:|:---|
| **⚛️ Frontend** | ![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript) ![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite) |
| **🎨 Styling** | ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css) ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Latest-000000) |
| **🧪 Testing** | ![Vitest](https://img.shields.io/badge/Vitest-1.1-6E9F18?logo=vitest) |
| **📦 Build** | ![tsup](https://img.shields.io/badge/tsup-8.0-FF6B6B) |
| **🎯 Icons** | ![Lucide](https://img.shields.io/badge/Lucide-React-FF6B6B) |

</div>

---

## 📁 Project Structure

```
SecretGuard/
├── 📱 apps/
│   └── vibegard-web/          # React web application
│       ├── src/
│       │   ├── components/    # React components
│       │   └── lib/           # Utilities
│       └── public/            # Static assets
├── 📦 packages/
│   └── vibegard-core/         # Core detection & masking library
│       ├── src/
│       │   ├── detectors.ts   # Pattern detection logic
│       │   ├── masker.ts      # Masking & verification
│       │   └── types.ts       # TypeScript definitions
│       └── dist/              # Compiled output
└── package.json               # Monorepo configuration
```

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
cd packages/vibegard-core
npm run test -- --watch

# Run with coverage
npm run test -- --coverage
```

---

## 🎨 Screenshots

> **Note:** Add screenshots of your application here
> 
> ```markdown
> ![App Screenshot](path/to/screenshot.png)
> ```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### 📝 Steps to Contribute

1. 🍴 **Fork** the repository
2. 🌿 **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 **Push** to the branch (`git push origin feature/AmazingFeature`)
5. 🔄 **Open** a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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
