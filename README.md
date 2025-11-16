# SecretGuard

A monorepo project for sensitive data detection and masking.

## Project Structure

```
.
├── apps/
│   └── secretguard-web/        # Web application
│       ├── src/                # Application source code
│       ├── public/             # Public assets
│       ├── dist/               # Build output (gitignored)
│       └── package.json        # App dependencies
├── packages/
│   └── secretguard-core/       # Core library package
│       ├── src/                # Library source code
│       ├── dist/               # Build output (gitignored)
│       └── package.json        # Package dependencies
├── package.json                # Root workspace config
├── vercel.json                 # Vercel deployment config
└── LICENSE                     # License file
```

## Getting Started

### Install Dependencies
```bash
npm install
```

### Development
```bash
npm run dev
```

This will:
1. Build the core package
2. Start the web app development server

### Build
```bash
npm run build:web
```

This will:
1. Build the core package
2. Build the web application

## Workspace Scripts

- `npm run dev` - Start development (builds core, then starts web app)
- `npm run build:web` - Build for production (core + web app)
- `npm run build:core` - Build only the core package
- `npm run build` - Build all workspaces
- `npm run test` - Run tests in all workspaces
- `npm run lint` - Lint all workspaces

## Deployment

The project is configured for Vercel deployment. The build command and output directory are set in `vercel.json`.
