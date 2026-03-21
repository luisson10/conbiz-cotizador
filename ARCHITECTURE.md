# ARCHITECTURE.md — Conbiz Cotizador

---

## 1. PROJECT STRUCTURE

```
conbiz-cotizador/
├── app/                                # Next.js App Router
│   ├── api/
│   │   └── exchange-rate/
│   │       └── route.ts                # GET /api/exchange-rate (Banxico FIX)
│   ├── globals.css                     # Global styles, print media queries, animations
│   ├── layout.tsx                      # Root layout (font, metadata, lang="es")
│   └── page.tsx                        # Home page → renders <PricingPage />
│
├── components/                         # React components
│   ├── ui/                             # Reusable UI primitives (Radix-based)
│   │   ├── accordion.tsx               # Radix Accordion wrapper
│   │   ├── button.tsx                  # Button with CVA variants
│   │   ├── card.tsx                    # Card, CardHeader, CardTitle, CardContent, etc.
│   │   ├── input.tsx                   # Styled <input>
│   │   ├── label.tsx                   # Styled <label>
│   │   └── switch.tsx                  # Radix Switch wrapper
│   ├── business-model-explainer.tsx    # 5-card educational grid
│   ├── faq-section.tsx                 # 8 FAQs in Radix Accordion
│   ├── pricing-mode-toggle.tsx         # Client / Reseller mode selector
│   ├── pricing-page.tsx                # Main container & state orchestration
│   ├── printable-quote-view.tsx        # Print-only quote layout
│   ├── quote-calculator-form.tsx       # Agent & global config form
│   ├── quote-summary-card.tsx          # Sticky sidebar with live calculations
│   ├── terms-section.tsx               # 10 commercial terms
│   └── whatsapp-cta.tsx                # WhatsApp share CTA
│
├── lib/                                # Business logic & utilities
│   ├── pricing.ts                      # Pricing engine, types, constants, quote builder
│   └── utils.ts                        # cn(), formatCurrency(), formatNumber()
│
├── public/
│   └── conbiz-logo-color.svg           # Brand logo
│
├── next.config.ts                      # Next.js config (strict mode)
├── postcss.config.mjs                  # Tailwind CSS v4 PostCSS plugin
├── tsconfig.json                       # TypeScript config (strict, ES2017, path aliases)
├── package.json                        # Dependencies & scripts
└── package-lock.json
```

---

## 2. HIGH-LEVEL SYSTEM DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                          USERS                                  │
│              (Clients & Resellers via Browser)                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     NEXT.JS FRONTEND                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   PricingPage (State)                      │  │
│  │  ┌──────────────────┐  ┌──────────────────────────────┐   │  │
│  │  │ QuoteCalculator  │  │    QuoteSummaryCard          │   │  │
│  │  │     Form         │──│  (live pricing breakdown)    │   │  │
│  │  │ (global + agents)│  │  (currency toggle USD/MXN)   │   │  │
│  │  └──────────────────┘  └──────────────────────────────┘   │  │
│  │  ┌──────────────────┐  ┌──────────────────────────────┐   │  │
│  │  │ BusinessModel    │  │  PrintableQuoteView          │   │  │
│  │  │ Explainer        │  │  (print-only output)         │   │  │
│  │  └──────────────────┘  └──────────────────────────────┘   │  │
│  │  ┌──────────────────┐  ┌──────────────────────────────┐   │  │
│  │  │  TermsSection    │  │   FaqSection                 │   │  │
│  │  └──────────────────┘  └──────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   lib/pricing.ts                           │  │
│  │           calculateQuote() — core pricing engine           │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS API ROUTE                             │
│              GET /api/exchange-rate                              │
│          (ISR cached, revalidates every 12h)                    │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICE                               │
│             Banxico.org.mx (FIX Rate)                           │
│      Mexico's Central Bank — USD/MXN exchange rate              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. CORE COMPONENTS

### 3.1 Frontend — Next.js Application

| Aspect | Detail |
|--------|--------|
| **Purpose** | Public-facing pricing calculator for Conbiz conversational AI agents |
| **Framework** | Next.js 15.5 with App Router |
| **Language** | TypeScript 5.9 (strict mode) |
| **UI Library** | React 19.1 |
| **Styling** | Tailwind CSS v4 with PostCSS |
| **Component Primitives** | Radix UI (Accordion, Switch, Slot) |
| **Class Utilities** | clsx + tailwind-merge via `cn()` helper |
| **Icons** | Lucide React |
| **Deployment** | Static-first; compatible with Vercel, any Node.js host |

### 3.2 Pricing Engine — `lib/pricing.ts`

| Aspect | Detail |
|--------|--------|
| **Purpose** | Pure calculation logic for quote generation |
| **Key Function** | `calculateQuote(mode, globalInputs, agents[])` → `QuoteBreakdown` |
| **Pricing Modes** | Client ($0.25/min) and Reseller ($0.21/min) |
| **Scope** | Per-agent: development, concurrency, tools (WhatsApp, geolocation, custom). Global: minutes, platform rental |
| **Output** | Monthly subtotals, setup costs, guarantee deposit, total startup |

### 3.3 API Layer — `/api/exchange-rate`

| Aspect | Detail |
|--------|--------|
| **Purpose** | Server-side proxy to fetch the Banxico FIX exchange rate |
| **Method** | GET |
| **Caching** | ISR with 43,200s revalidation (12 hours) |
| **Parsing** | Regex extraction from Banxico HTML response |
| **Fallback** | Returns `null` rate on failure; frontend defaults to USD display |

### 3.4 Component Hierarchy

```
PricingPage (state container)
├── Header (navigation links)
├── Hero Section (3 info cards)
├── PricingModeToggle (client/reseller)
├── BusinessModelExplainer (5-card grid)
├── QuoteCalculatorForm
│   ├── Global config (minutes, platform toggle)
│   └── Agent cards[] (dynamic add/remove)
│       ├── Development hours
│       ├── Concurrency
│       ├── Intelligent tools toggle
│       ├── WhatsApp config (marketing/utility messages, templates)
│       ├── Geolocation (queries)
│       └── Custom tool (name, monthly cost)
├── QuoteSummaryCard (sticky sidebar)
│   ├── Currency toggle (USD ↔ MXN)
│   ├── Monthly breakdown rows
│   ├── Startup costs (setup + guarantee deposit)
│   └── Print/export button
├── WhatsAppCta (share quote via WhatsApp)
├── TermsSection (10 commercial terms)
├── FaqSection (8 FAQs in accordion)
└── PrintableQuoteView (hidden; rendered on print)
```

---

## 4. DATA STORES

**This application has no persistent data stores.**

| Category | Status |
|----------|--------|
| Database | None — all state is client-side (React hooks) |
| Cache | Next.js ISR cache for exchange rate API (12h TTL) |
| Session storage | None |
| Local storage | None |
| Message queues | None |

All pricing configuration lives as constants in `lib/pricing.ts`. User inputs are ephemeral and exist only in React component state during the session.

---

## 5. EXTERNAL INTEGRATIONS

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| **Banxico (Banco de México)** | USD/MXN FIX exchange rate | Server-side HTTP fetch from `banxico.org.mx/apps/dao-web/4/52/Fix48.html`, parsed with regex, cached via ISR |
| **WhatsApp** | Share generated quote | Client-side `wa.me` deep link with pre-formatted text built by `buildQuoteMessage()` |
| **Google Fonts** | Plus Jakarta Sans typeface | Loaded via `next/font/google` in root layout |

No payment processing, email, analytics, or authentication services are integrated.

---

## 6. DEPLOYMENT & INFRASTRUCTURE

### Current State

| Aspect | Detail |
|--------|--------|
| **Cloud Provider** | Not explicitly configured; designed for Vercel (Next.js default) |
| **Containerization** | None (no Dockerfile) |
| **CI/CD** | Not configured (no GitHub Actions, GitLab CI, etc.) |
| **Monitoring** | Not configured |
| **CDN** | Provided by hosting platform (Vercel Edge Network if deployed there) |

### Build & Run

```bash
# Development
npm run dev          # Next.js dev server with hot reload

# Production
npm run build        # Compile & optimize
npm run start        # Serve production build

# Quality
npm run lint         # Next.js ESLint
npm run typecheck    # TypeScript type checking (tsc --noEmit)
```

### Deployment Recommendations

Being a Next.js 15 App Router application, the natural deployment targets are:
- **Vercel** — zero-config deployment with ISR support
- **AWS Amplify** or **Cloudflare Pages** — with Node.js runtime for API routes
- **Docker** — would require adding a Dockerfile with Node.js base image

---

## 7. SECURITY CONSIDERATIONS

### Authentication & Authorization

| Aspect | Status |
|--------|--------|
| Authentication | None — public calculator, no login required |
| Authorization | None — no protected routes or role-based access |
| Session management | None |

### Data Security

| Aspect | Detail |
|--------|--------|
| **Data at rest** | No data persisted; no encryption needed |
| **Data in transit** | HTTPS enforced by hosting platform |
| **PII handling** | No personal data collected or stored |
| **API security** | Exchange rate endpoint is read-only, publicly accessible, and rate-limited by ISR caching |

### Application Security

| Aspect | Detail |
|--------|--------|
| **Input validation** | Numeric inputs bounded by `min`/`max` attributes; no server-side validation needed (no writes) |
| **XSS prevention** | React's default JSX escaping; no `dangerouslySetInnerHTML` usage |
| **CSRF** | Not applicable (no state-changing server operations) |
| **Dependencies** | Minimal dependency surface; Radix UI and Tailwind are well-maintained |
| **Secrets** | None — no API keys or secrets in the codebase |

---

## 8. DEVELOPMENT & TESTING

### Local Setup

```bash
# Prerequisites
node >= 18.x
npm >= 9.x

# Install
git clone <repository-url>
cd conbiz-cotizador
npm install

# Run
npm run dev
# → http://localhost:3000
```

### Code Quality Tools

| Tool | Purpose | Command |
|------|---------|---------|
| **TypeScript** (strict) | Static type checking | `npm run typecheck` |
| **ESLint** (Next.js config) | Linting | `npm run lint` |
| **Tailwind CSS v4** | Utility-first styling with JIT | Built into PostCSS pipeline |

### Testing

**No testing framework is currently configured.** There are no test files in the repository.

Recommended additions:
- **Vitest** or **Jest** for unit testing `lib/pricing.ts` calculations
- **React Testing Library** for component interaction tests
- **Playwright** for end-to-end print/export flow validation

### Key Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript compiler checks |

---

## 9. FUTURE CONSIDERATIONS

### Known Technical Debt

1. **No test coverage** — The pricing calculation engine (`calculateQuote`) handles money and should have comprehensive unit tests.
2. **No CI/CD pipeline** — No automated builds, linting, or deployment configured.
3. **Banxico scraping fragility** — Exchange rate is extracted via regex from HTML; any Banxico page redesign will break the parser. A proper API (e.g., Banxico SIE API with token) would be more resilient.
4. **No error boundary** — React error boundaries are not implemented; a calculation error could crash the entire page.
5. **No analytics** — No visibility into usage, popular configurations, or conversion funnel.
6. **Hardcoded pricing constants** — All prices live in `lib/pricing.ts`. A CMS or admin panel would allow non-developer price updates.

### Planned Migrations / Improvements

- **Banxico API migration** — Replace HTML scraping with the official Banxico SIE REST API for exchange rates.
- **PDF generation** — Replace browser `window.print()` with server-side PDF generation (e.g., Puppeteer, `@react-pdf/renderer`) for consistent output.
- **Quote persistence** — Save quotes to a database for retrieval via shareable URLs.
- **Authentication** — Add login for resellers to access their pricing tier automatically.
- **i18n** — The UI is Spanish-only; internationalization would expand reach.

---

## 10. GLOSSARY

| Term | Definition |
|------|------------|
| **Conbiz** | The company/brand offering conversational AI agent services |
| **Cotizador** | Spanish for "Quoter" or "Pricing Calculator" |
| **Agente** | A conversational AI agent configured with specific tools, concurrency, and capabilities |
| **Cliente Final** | End-client pricing mode ($0.25/min) |
| **Revendedor (Reseller)** | Reseller pricing mode ($0.21/min) |
| **Concurrencia** | The number of simultaneous calls/conversations an agent can handle |
| **Herramientas Inteligentes** | Intelligent tools — add-on AI capabilities priced per concurrency slot ($8/slot) |
| **Banxico** | Banco de México — Mexico's central bank, source for the FIX exchange rate |
| **FIX Rate** | The official daily exchange rate published by Banxico for USD/MXN |
| **Garantía (Guarantee Deposit)** | Upfront deposit equal to 2× the monthly minutes cost |
| **Plataforma** | Conbiz platform rental — optional monthly fee ($250 USD) for access to the management dashboard |
| **ISR** | Incremental Static Regeneration — Next.js caching strategy that revalidates on a time interval |
| **CVA** | Class Variance Authority — library for defining component style variants in a type-safe way |
| **Radix UI** | Headless, accessible component primitives for React |

---

## 11. PROJECT IDENTIFICATION

| Field | Value |
|-------|-------|
| **Project Name** | Conbiz Cotizador (Conbiz Pricing Calculator) |
| **Repository** | `conbiz-cotizador` |
| **Primary Language** | TypeScript |
| **Framework** | Next.js 15.5 / React 19.1 |
| **Primary Contact/Team** | Conbiz development team |
| **Date of Last Update** | 2026-03-18 |
| **License** | Not specified |
