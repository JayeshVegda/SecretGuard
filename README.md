# SecretGuard 🛡️

**Protect Your Secrets Before AI Sees Them**

A client-side web application that automatically detects and masks sensitive data before you share it with ChatGPT, Claude, Gemini, or any LLM. Built with privacy-first principles—everything processes in your browser.

---

## ✨ Features

- **🔒 Comprehensive Detection** - Detects 15+ types of sensitive data including emails, SSNs, credit cards, API keys, passwords, and more
- **🎨 Modern UI** - Beautiful glassmorphism design with dark/light mode support
- **🔐 100% Private** - All processing happens in your browser. No servers, no APIs, no tracking
- **⚡ Real-Time** - Instant detection and masking as you type
- **📋 Easy to Use** - Just paste your text and copy the protected version

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/JayeshVegda/SecretGuard.git
cd SecretGuard

# Install dependencies
npm install

# Build the core library
npm run build:core

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
# Build everything
npm run build

# Preview production build
cd apps/vibegard-web
npm run preview
```

---

## 📖 Usage

1. **Paste Your Text** - Enter or paste text containing sensitive information
2. **Automatic Detection** - SecretGuard instantly identifies sensitive data patterns
3. **Review Highlights** - See exactly what was detected in the original text panel
4. **Copy Protected Text** - Use the masked version from the protected text panel
5. **Share Safely** - Paste the protected text into ChatGPT, Claude, or any LLM without worry

---

## 🎯 What Gets Detected

- **Personal Information**: SSN, Phone Numbers, Email Addresses, Street Addresses
- **Financial Data**: Credit Cards, Bank Accounts, IBAN
- **Credentials**: API Keys, AWS Keys, Database URLs, Passwords, JWT Tokens
- **Secrets**: GitHub Tokens, Google API Keys, OpenAI Keys, Generic Secrets
- **Network**: IP Addresses (IPv4 & IPv6), MAC Addresses, Hostnames
- **Documents**: National IDs, Passport Numbers

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS, shadcn/ui components
- **Icons**: Lucide React
- **Build**: tsup (for core library), Vite (for web app)
- **Testing**: Vitest

---

## 📁 Project Structure

```
SecretGuard/
├── apps/
│   └── vibegard-web/          # React web application
│       ├── src/
│       │   ├── components/    # React components
│       │   └── lib/           # Utilities
│       └── public/            # Static assets
├── packages/
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
```

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👤 Author

**Jayesh Vegda**

- GitHub: [@JayeshVegda](https://github.com/JayeshVegda)

---

**Made with ❤️ for privacy-conscious developers**

*Share freely. Stay secure.* 🛡️
