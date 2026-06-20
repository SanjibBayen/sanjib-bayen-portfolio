# Security Policy

## Reporting a Vulnerability

**Do not open public issues for security vulnerabilities.**

To report a security issue, please send an encrypted email to:

**sanjibbayen11@gmail.com**

| Key Detail | Value |
|------------|-------|
| PGP Fingerprint | `XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX` |
| Response SLA | Acknowledgement within 24 hours, initial assessment within 72 hours |
| Disclosure Timeline | Coordinated disclosure within 90 days of report |

### What to Include in Your Report

- Type of vulnerability
- Affected component/endpoint
- Steps to reproduce with proof-of-concept
- Potential impact assessment
- Suggested fix (if available)

---

## Security Architecture Overview

This application implements a **Zero-Trust Client Architecture** backed by defense-in-depth server-side controls.

```
┌─────────────────────────────────┐
│       CLIENT (React 19)         │
│     Zero Credential Surface     │
└───────────────┬─────────────────┘
                │ HTTPS Only
┌───────────────▼─────────────────┐
│    INGRESS SECURITY LAYER       │
│  Helmet.js • hpp • Compression  │
└───────────────┬─────────────────┘
                │
┌───────────────▼─────────────────┐
│   CRYPTOGRAPHIC VERIFICATION    │
│    Cloudflare Turnstile Gate    │
└───────────────┬─────────────────┘
                │
┌───────────────▼─────────────────┐
│       EXPRESS BACKEND           │
│   All Secrets Server-Isolated   │
└─────────────────────────────────┘
```

---

## Security Controls Matrix

### 1. Transport & Network Security

| Control | Implementation | Coverage |
|---------|----------------|----------|
| **HTTPS Enforcement** | TLS 1.2+ mandatory, HSTS header via Helmet | All connections |
| **Certificate Management** | Cloudflare-managed edge certificates | Full handshake pipeline |
| **Protocol Downgrade Prevention** | Strict-Transport-Security: max-age=31536000; includeSubDomains | Browser enforcement |

### 2. Application Security Headers

Configured via **Helmet.js** with strict policies:

| Header | Value | Rationale |
|--------|-------|-----------|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://challenges.cloudflare.com;` | Prevents XSS, data injection, unauthorized script execution |
| `X-Frame-Options` | `DENY` | Prevents clickjacking via iframe embedding |
| `X-Content-Type-Options` | `nosniff` | Blocks MIME-type sniffing attacks |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controls referrer information leakage |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disables unnecessary browser features |
| `X-Powered-By` | **Removed** | Eliminates technology fingerprinting vector |

### 3. Input Validation & Injection Prevention

| Control | Implementation | Threat Mitigated |
|---------|----------------|------------------|
| **HTTP Parameter Pollution Protection** | `hpp` middleware | Query string tampering, parameter injection |
| **Request Body Sanitization** | Express JSON body parser with size limits | Buffer overflow, prototype pollution |
| **User-Agent Validation** | `express-useragent` parsing with scraper blocklists | Automated bot/scraper enumeration |
| **Rate Limiting** | Per-endpoint throttling on `/api/verify`, `/api/gemini`, `/api/contact` | Brute force, credential stuffing |

### 4. Cryptographic Verification

**Cloudflare Turnstile Integration — Handshake Sequence:**

```
Client                    Server                   Cloudflare
  │                         │                          │
  │  1. Request Page        │                          │
  ├────────────────────────►│                          │
  │                         │                          │
  │  2. Challenge Widget    │                          │
  │◄────────────────────────┤                          │
  │                         │                          │
  │  3. Generate Token      │                          │
  │────┐                    │                          │
  │    │                    │                          │
  │◄───┘                    │                          │
  │                         │                          │
  │  4. POST /api/verify    │                          │
  │     { token, rayId }    │                          │
  ├────────────────────────►│                          │
  │                         │  5. Siteverify API Call  │
  │                         ├─────────────────────────►│
  │                         │                          │
  │                         │  6. Validation Response  │
  │                         │◄─────────────────────────┤
  │                         │                          │
  │  7. Release Workspace   │                          │
  │     or Reject           │                          │
  │◄────────────────────────┤                          │
```

- Token validation occurs **server-to-server** via Cloudflare's Siteverify endpoint
- Client IP and Ray ID logged for audit trail
- Invalid tokens result in workspace rejection with no client-side bypass

### 5. Credential & Secret Isolation

| Principle | Implementation |
|-----------|----------------|
| **Zero Client Exposure** | Frontend receives zero API keys, secrets, or service credentials |
| **Server-Side Proxy** | All third-party API calls (Gemini, Resend, Cloudflare) flow through Express backend only |
| **Environment Variable Injection** | Secrets loaded at container runtime; never committed to version control |
| **Build-Time Secret Exclusion** | `esbuild` compilation tree-shakes test/mock credentials |

**Credential Architecture:**

```
┌──────────────────────────────────────────────────┐
│                  CLIENT BROWSER                  │
│                                                  │
│    Available: NOTHING                            │
│    No API keys. No secrets. No tokens (except    │
│    ephemeral Turnstile challenge token).         │
└──────────────────────┬───────────────────────────┘
                       │ HTTPS + Turnstile Token
┌──────────────────────▼───────────────────────────┐
│               EXPRESS BACKEND                    │
│                                                  │
│  process.env.GEMINI_API_KEY   ──────┐            │
│  process.env.RESEND_API_KEY   ──────┼─ In-Memory │
│  process.env.TURNSTILE_SECRET ──────┘  Only      │
│                                                  │
│  Never serialized to client.                     │
│  Never logged.                                   │
│  Never in build artifacts.                       │
└──────────────────────────────────────────────────┘
```

### 6. Telemetry & Client Identification

| Control | Implementation | Data Collected |
|---------|----------------|----------------|
| **Browser Fingerprinting** | `express-useragent` | Browser family, OS, engine version |
| **Geo-IP Lookup** | Zero-dependency CDN Geolocation headers | Country, Region, City (parsed from Vercel / Cloudflare headers) |
| **Request Metadata** | Cloudflare Ray ID | Request tracing, abuse correlation |

> **Privacy Note:** Geo-IP and user-agent data are processed server-side for security telemetry. No PII is stored persistently. IP addresses are not logged to disk.

### 7. Supply Chain & Build Security

| Control | Implementation |
|---------|----------------|
| **Single-Bundle Compilation** | `esbuild` compiles `server.ts` → `dist/server.cjs`, eliminating runtime path resolution vulnerabilities |
| **Dependency Pinning** | All npm packages locked via `package-lock.json` with integrity hashes |
| **Minimal Dependency Surface** | No Redux, no unnecessary state libraries; VFS managed via native React contexts |
| **Container Hardening** | Multi-stage Docker build; production image excludes devDependencies |

---

## Threat Model Summary

| Threat Vector | Likelihood | Impact | Mitigation |
|---------------|------------|--------|------------|
| **XSS Injection** | Medium | High | Strict CSP headers, React auto-escaping, no `dangerouslySetInnerHTML` |
| **API Credential Leak** | Low | Critical | Zero-trust client, server-side proxy, env var isolation |
| **Automated Scraping/Bot** | High | Medium | Turnstile challenge gate, UA parsing, rate limiting |
| **CSRF via Cross-Origin** | Low | Medium | SameSite cookies, CSP `connect-src` restriction |
| **Man-in-the-Middle** | Low | Critical | Mandatory HTTPS, HSTS, Cloudflare TLS termination |
| **Parameter Pollution** | Medium | Medium | `hpp` middleware, input validation |
| **Clickjacking** | Low | Medium | `X-Frame-Options: DENY` |
| **LLM Prompt Injection** | Medium | Medium | Server-side input sanitization, response length/format constraints |

---

## Security Update & Patch Policy

| Item | Policy |
|------|--------|
| **Dependency Scanning** | Weekly automated `npm audit` with CI blocking on Critical/High |
| **Helmet CSP Review** | Quarterly review of CSP directives against OWASP recommendations |
| **Turnstile Version** | Cloudflare-managed; automatic updates |
| **Node.js Runtime** | LTS releases only; upgraded within 30 days of new LTS availability |
| **Disclosure Handling** | 90-day coordinated disclosure window |

---

## Compliance & Standards Alignment

| Standard | Reference |
|----------|-----------|
| **OWASP Top 10 (2021)** | Full coverage of A01 (Broken Access Control) through A10 (SSRF) |
| **CWE/SANS Top 25** | Input validation, injection prevention, cryptographic failures addressed |
| **GDPR Data Minimization** | No PII stored; IP not persisted; no tracking cookies |


## Responsible Disclosure Hall of Fame

We appreciate and recognize the security researchers who help improve this project through responsible disclosure.

*(Researchers will be listed here with their permission after verified disclosures.)*

---

## Security Contacts

| Role | Contact |
|------|---------|
| Security Team | sanjibbayen11@gmail.com |
| PGP Key | [Download](https://keys.openpgp.org/) |
| Response Time | Within 24 hours |

---

*Last Updated: June 2026*
*Policy Version: 1.0*
```
