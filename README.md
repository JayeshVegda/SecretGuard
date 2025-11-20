<div align="center">

<img src="apps/secretguard-web/public/favicon.svg" alt="SecretGuard logo" height="96" />

# SecretGuard Cleaner

_Client-side redaction before AI ever sees your sensitive text._

[secretguard.vercel.app](https://secretguard.vercel.app)

<p>
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
<img src="https://img.shields.io/badge/Vite-563D7C?style=for-the-badge&logo=vite&logoColor=ffdd35" alt="Vite" />
<img src="https://img.shields.io/badge/TypeScript-1f425f?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Tailwind_CSS-0f172a?style=for-the-badge&logo=tailwind-css&logoColor=38bdf8" alt="Tailwind CSS" />
<img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

</div>

## Project Overview

SecretGuard Cleaner is a privacy-first toolkit that detects, masks, and previews sensitive data before you paste prompts into LLMs or share snippets with teammates. Everything runs locally in the browser, powered by a reusable secret-detection core and a modern Vite + React experience.

## Key Features

- 🔐 **Client-side redaction pipeline** – Finds PII, credentials, tokens, and banking details without sending text to a server.
- ⚡ **Instant text comparison** – Side-by-side panes show original vs. masked content along with detector highlights.
- 🧠 **Reusable detection core** – `packages/secretguard-core` exposes detectors/maskers so you can embed the logic in other apps.
- 🎛️ **Policy-aware masking** – Switch between masking policies for different security contexts.
- 🌓 **Polished UI** – Responsive Tailwind UI with theme toggle, trust microcopy, and onboarding-ready hero section.

## Screenshots & Demo
https://github.com/user-attachments/assets/7ebf1577-bb2d-4110-80f5-4b4ba3397bba
| Original Input | Masked Output | Trust & CTA |
| --- | --- | --- |
| ![Original sample](apps/secretguard-web/dist/assets/img1.png) | ![Masked sample](apps/secretguard-web/dist/assets/img2.png) | ![Trust indicators](apps/secretguard-web/dist/assets/img3.png) |

> Need a live glance? Visit the hosted build at [secretguard.vercel.app](https://secretguard.vercel.app).

## Installation Guide

1. Ensure you have Node.js ≥ 18 and npm ≥ 9 installed.
2. Clone the repository: `git clone <repo-url> && cd cleaner`
3. Install workspace dependencies: `npm install`
4. Build the detection core once (required for the web app): `npm run build:core`

## How to Run / Usage

```bash
# Start the client with freshly built detectors
npm run dev

# Build production assets
npm run build:web

# Run unit tests across workspaces
npm test
```

- The dev server launches the Vite web app at `http://localhost:5173`.
- Paste any text in the “Original” editor; detections stream in as you type.
- Download the masked copy or copy-to-clipboard when you are satisfied with the redaction.

## Folder Structure

```
.
├── apps/
│   └── secretguard-web/     # Vite + React frontend
├── packages/
│   └── secretguard-core/    # Detector + masking SDK
├── LICENSE
├── package.json             # Workspace scripts
└── vercel.json              # Deployment config
```



## Contributing Guide

1. Create a feature branch from `main`.
2. Run `npm run lint` and `npm test` before opening a PR.
3. Include screenshots or recordings when UI changes impact the masking workflow.

## Roadmap

- ⏳ Browser extension that protects prompts anywhere you type.
- ⏳ Shared masking policies synced across teams.

## License

Released under the MIT License © 2025 Jayesh Vegda. See `LICENSE` for full text.

## Contact

ping Jayesh on [LinkedIn](https://www.linkedin.com/in/jayeshvegda/).


