

<div align="center">

# Interactive IDE Portfolio of Sanjib Bayen


![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.x-3178C6.svg)

**A Custom-Themed Interactive Web IDE & Portfolio Platform**

*Replicating a local IDE workflow on the web — with cryptographic verification, AI-assisted terminal, and live telemetry.*

[Live Demo](https://sanjib-bayen.vercel.app/) • [Documentation](README.md) • [Security Policy](SECURITY.md) • [Report a Bug](SECURITY.md)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Development](#development)
  - [Production Build](#production-build)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Security](#security)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Overview

The **Interactive IDE Portfolio** is a full-stack web application that simulates a local Integrated Development Environment (IDE) — similar to Visual Studio Code — entirely within the browser. It combines a simulated Virtual File System (VFS) workspace with genuine server-side telemetry, cryptographic security verification via Cloudflare Turnstile, and an AI-assisted terminal environment powered by Google Gemini.

### Why This Exists

Traditional portfolio sites are static and passive. This platform transforms the portfolio experience into an **interactive, explorable workspace** — demonstrating advanced frontend architecture, secure backend engineering, and real-time AI integration in a single cohesive product.

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    CLIENT BROWSER (React 19)             │
│                                                          │
│   IDE Layout UI  ◄──  Theme Provider  ◄──  VFS State     │
│   (ActivityBar,       (THEMES Engine)      (JSON Tree)   │
│    SidebarPanel,                                         │
│    EditorPanel,                                          │
│    TerminalPanel)                                        │
└──────────────────────┬───────────────────────────────────┘
                       │ HTTPS + Turnstile Token
┌──────────────────────▼───────────────────────────────────┐
│               INGRESS & SECURITY LAYER                   │
│                                                          │
│   Helmet.js  •  GeoIP / UA Engine  •  Cloudflare Gate    │
└──────────────────────┬───────────────────────────────────┘
                       │ Authenticated Pipeline
┌──────────────────────▼───────────────────────────────────┐
│               EXPRESS BACKEND (TypeScript)               │
│                                                          │
│   API Controllers        Static Files        Vite Dist   │
│   /api/verify            compression.js      (SPA)       │
│   /api/gemini            hpp                             │
│   /api/contact                                           │
└──────────────────────┬───────────────────────────────────┘
                       │ Secure Proxy
┌──────────────────────▼───────────────────────────────────┐
│                  EXTERNAL SERVICES                       │
│                                                          │
│   Google Gemini API  •  Resend API  •  Cloudflare        │
└──────────────────────────────────────────────────────────┘
```

**Architecture Type:** Hybrid SPA with Lightweight Secure Micro-Backend

**Key Architectural Principles:**

| Principle | Description |
|-----------|-------------|
| **Zero-Trust Client** | Frontend holds zero credentials; all services proxied through backend |
| **Defense-in-Depth** | Multiple security layers from edge to application |
| **Micro-Bundle** | Single-file `server.cjs` via esbuild for fast container spin-up |
| **Fluid Responsiveness** | Hardware-accelerated animations via `motion` |

---

## Features

### IDE Experience

| Feature | Description |
|---------|-------------|
| **Activity Bar** | Context switcher: Explorer, Search, Git, Debug, Extensions |
| **Sidebar Panel** | Collapsible directory tree explorer with file search |
| **Editor Panel** | Multi-tab document buffers with syntax-aware rendering |
| **Terminal Panel** | Mock shell emulator with command history |
| **Tab Manager** | Open, active, and dirty state tracking |

### Core Commands

| Command | Description |
|---------|-------------|
| `ls` | List directory contents |
| `cd <dir>` | Change current directory |
| `cat <file>` | Display file contents |
| `clear` | Clear terminal buffer |
| `help` | Show available commands |
| `whoami` | Display visitor telemetry |
| `ai <query>` | Query AI assistant (Google Gemini) |

### Security & Telemetry

| Feature | Implementation |
|---------|----------------|
| **Cryptographic Gate** | Cloudflare Turnstile verification before workspace access |
| **Geo-IP Telemetry** | Server-side location parsing via high-performance CDN edge headers (Vercel / Cloudflare / Render) |
| **Browser Identification** | UA parsing via `express-useragent` |
| **Hardened Headers** | Helmet.js with strict CSP, frame protection, and fingerprinting prevention |

### Theme Engine

| Theme | Status |
|-------|--------|
| Dark+ (Default) |  Available |
| Dracula |  Available |
| One Dark Pro |  Available |
| Monokai Retro |  Available |
| GitHub Light |  Available |

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.x | UI framework |
| **Vite** | 6.x | Build tool & dev server |
| **TypeScript** | 5.x | Type safety |
| **Motion** | latest | Animations |
| **Cloudflare Turnstile** | latest | Cryptographic challenge |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | ≥18.x | Runtime |
| **Express** | 4.x | HTTP server |
| **TypeScript** | 5.x | Type safety |
| **esbuild** | latest | Server bundling |

### Middleware & Security

| Package | Purpose |
|---------|---------|
| **helmet** | Security headers (CSP, X-Frame, etc.) |
| **express-useragent** | Browser/OS parsing & scraper blocking |
| **CDN Geo Headers** | Lightweight zero-dependency edge location mapping (Vercel & Cloudflare) |
| **hpp** | HTTP Parameter Pollution prevention |
| **compression** | Gzip/deflate response compression |

### External Services

| Service | API Endpoint | Purpose |
|---------|-------------|---------|
| **Cloudflare Turnstile** | Siteverify API | Cryptographic verification |
| **Google Gemini** | Generative Language API | AI terminal responses |
| **Resend** | Email API | Contact form delivery |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- A **Cloudflare account** (for Turnstile keys)
- A **Google AI Studio account** (for Gemini API key)
- A **Resend account** (for email delivery)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/interactive-ide-portfolio.git
cd interactive-ide-portfolio

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# ─── Server Configuration ─────────────────────────
PORT=3000
NODE_ENV=development

# ─── Cloudflare Turnstile ──────────────────────────
# Obtain from: https://dash.cloudflare.com/ → Turnstile
TURNSTILE_SITE_KEY=your_turnstile_site_key
TURNSTILE_SECRET_KEY=your_turnstile_secret_key

# ─── Google Gemini AI ──────────────────────────────
# Obtain from: https://aistudio.google.com/apikey
GEMINI_API_KEY=your_gemini_api_key

# ─── Resend Email ──────────────────────────────────
# Obtain from: https://resend.com/api-keys
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=portfolio@yourdomain.com
RESEND_TO_EMAIL=your@email.com
```

>  **Never commit `.env` to version control.** This file is included in `.gitignore`.

### Development

```bash
# Start development server (Vite + Express concurrently)
npm run dev
```

| Process | URL | Description |
|---------|-----|-------------|
| **Vite Dev Server** | `http://localhost:5173` | Frontend with HMR |
| **Express API** | `http://localhost:3000` | Backend API endpoints |

### Production Build

```bash
# Build frontend and compile server
npm run build

# Start production server
npm start
```

**Build Pipeline:**

```
Source Files                  Build Artifacts
─────────────                ─────────────────
src/client/     ──Vite──►    dist/public/
src/server.ts   ──esbuild─►  dist/server.cjs
```

---

## Project Structure

```
interactive-ide-portfolio/
│
├── api/                             # Express Backend (Micro-Service Layer)
│   └── src/
│       ├── app.ts                   # Express Application setup (CSP, Helmet, CORS, routing)
│       ├── server.ts                # Port listener and process shutdown routines
│       ├── config/
│       │   └── index.ts             # Configuration schemas and environment validation
│       ├── controllers/
│       │   ├── contact.controller.ts # Contact form handler via Resend
│       │   └── security.controller.ts # Handlers for Turnstile, CSRF, and IP Info
│       ├── middleware/
│       │   ├── bot.ts               # Bot & automated crawler blocker
│       │   ├── csrf.ts              # Stateless cryptographic token verification
│       │   ├── geo.ts               # Zero-dependency CDN Geolocation mapping
│       │   ├── ids.ts               # Simple signature-based intrusion detection
│       │   ├── rateLimiter.ts       # Endpoint throttling and brute force protection
│       │   ├── securityHeaders.ts    # Secure headers, cookies & browser fingerprints
│       │   └── turnstile.middleware.ts # Access gates for non-verified sessions
│       ├── routes/
│       │   └── api.routes.ts        # API v1 routes gateway
│       ├── services/
│       │   ├── email.service.ts     # Resend client wrapper
│       │   ├── emailTemplates.ts    # Contact response HTML templates
│       │   └── turnstile.service.ts # Cloudflare siteverify challenge service
│       └── utils/
│           ├── logger.ts            # Security events and audit log stream
│           ├── security.utils.ts    # Cryptographic hashes and sign utils
│           └── spamDetector.ts      # Simple contact message heuristic score limits
│
├── public/                          # Static browser assets
│   ├── favicon.ico
│   └── robots.txt
│
├── src/                             # Single-Page Frontend (React 19 / Vite)
│   ├── assets/                      # Fluid SVGs and graphic templates
│   ├── components/                  # Global shared UI components
│   ├── data/                        # Static app and configuration definitions
│   ├── features/                    # Modular domain components
│   │   ├── about/                   # About & Resume terminal panels
│   │   ├── contact/                 # Contact form components
│   │   ├── projects/                # Work & project viewers
│   │   ├── research/                # Research terminal viewer
│   │   ├── security/                # Cryptographic challenge (Security Gate)
│   │   │   ├── components/          # SecurityGate & MobileGate layout overlays
│   │   │   ├── hooks/               # useTurnstile and state connectors
│   │   │   ├── services/            # SecurityService fetch APIs
│   │   │   └── types/               # Type schemas for security features
│   │   ├── skills/                  # Core competency visualizers
│   │   ├── terminal/                # Terminal tab, command logs & core handlers
│   │   └── workspace/               # ActivityBar, SidebarPanel & Editor tabs
│   ├── index.css                    # Tailwind CSS definitions
│   ├── main.tsx                     # React application launcher
│   └── App.tsx                      # Primary DOM and gateway gate router
│
├── server.ts                        # Unified Root Router (Bridging Vercel & Render)
├── vercel.json                      # Vercel configuration (headers & serverless APIs)
├── vite.config.ts                   # Vite client compilation parameters
├── tsconfig.json                    # Type compiler parameters
├── SECURITY.md                      # Security model and vulnerability reporting
└── README.md                        # This file
```

### Key Type Definitions

```typescript
// Virtual File System Node
interface VFSNode {
  name: string;
  type: "file" | "folder";
  path: string;
  children?: VFSNode[];
  content?: string;
  language?: string;
}

// Terminal Command Output
interface TerminalLine {
  input: string;
  output: string;
  type: "command" | "response" | "error" | "system";
  timestamp: number;
}

// Active Tab State
interface TabState {
  id: string;
  path: string;
  label: string;
  isDirty: boolean;
  isActive: boolean;
}
```

---

## API Reference

### Base URL

```
Development: http://localhost:3000
Production:  https://yourdomain.com
```

### Endpoints

#### `POST /api/verify`

Verifies the Cloudflare Turnstile token before granting workspace access.

**Request Body:**
```json
{
  "token": "cf-turnstile-response-token",
  "rayId": "cloudflare-ray-id",
  "clientIp": "auto-detected"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "telemetry": {
    "country": "India",
    "region": "Maharashtra",
    "city": "Mumbai",
    "browser": "Chrome",
    "os": "Windows"
  }
}
```

**Failure Response (403):**
```json
{
  "success": false,
  "error": "Token validation failed"
}
```

---

#### `POST /api/gemini`

Proxies terminal queries to Google Gemini AI.

**Request Body:**
```json
{
  "prompt": "Explain the purpose of a virtual file system",
  "context": "shell-terminal"
}
```

**Success Response (200):**
```json
{
  "response": "A virtual file system (VFS) is an abstraction layer...",
  "model": "gemini-2.0-flash"
}
```

---

#### `POST /api/contact`

Relays contact form submissions via Resend email API.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Great portfolio! Let's connect."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

---

## Security

This project implements a **Zero-Trust Client Architecture** with multiple defense layers:

| Layer | Controls |
|-------|----------|
| **Transport** | Mandatory HTTPS, HSTS, TLS 1.2+ |
| **Headers** | Helmet.js CSP, X-Frame-Options: DENY, no X-Powered-By |
| **Verification** | Cloudflare Turnstile server-side validation |
| **Input** | hpp protection, body size limits, UA filtering |
| **Secrets** | Zero client exposure, server-side env vars only |

For vulnerability reporting, see [SECURITY.md](SECURITY.md).

---

## Deployment

### Docker (Recommended)

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/server.cjs"]
```

```bash
docker build -t ide-portfolio .
docker run -p 3000:3000 --env-file .env ide-portfolio
```

### Cloud Run

```bash
gcloud run deploy ide-portfolio \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production"
```

---

## Contributing

Contributions are welcome. Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** with conventional commits: `feat: add amazing feature`
4. **Push** to your branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request with a detailed description

### Commit Convention

| Prefix | Use Case |
|--------|----------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `style:` | Code style/formatting |
| `refactor:` | Code restructuring |
| `perf:` | Performance improvement |
| `test:` | Testing |
| `chore:` | Build/config/maintenance |
| `security:` | Security-related changes |

---

## License
Distributed under the Apache License 2.0. See [LICENSE](LICENSE) for more information.
```
Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/

Copyright 2026 Sanjib Bayen

Licensed under the Apache License, Version 2.0 (the "LICENSE");
you may not use this file except in compliance with the License...
```
---

## Acknowledgments

| Resource | Purpose |
|----------|---------|
| [Visual Studio Code](https://code.visualstudio.com/) | IDE layout & UX inspiration |
| [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) | Cryptographic challenge infrastructure |
| [Google Gemini](https://ai.google.dev/) | AI terminal assistant |
| [Resend](https://resend.com/) | Email delivery infrastructure |
| [React](https://react.dev/) | UI library |
| [Vite](https://vitejs.dev/) | Build tooling |
| [Express](https://expressjs.com/) | Server framework |

---

## Contact

| Channel | Detail |
|---------|--------|
| **Portfolio** | [sanjib-bayen.onrender.com](https://sanjib-bayen.onrender.com/) |
| **Portfolio** | [sanjib-bayen.vercel.app](https://sanjib-bayen.vercel.app/) |
| **Email** | sanjibbayen11@gmail.com |
| **LinkedIn** | [linkedin.com/in/sanjibbayen](linkedin.com/in/sanjibbayen) |
| **GitHub** | [github.com/SanjibBayen](https://github.com/SanjibBayen) |

---

<div align="center">

**Built with precision. Guarded with zero-trust. Delivered with speed.**

</div>


