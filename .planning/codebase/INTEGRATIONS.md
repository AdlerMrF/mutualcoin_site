# External Integrations

**Analysis Date:** 2026-06-16

## APIs & External Services

**User Onboarding:**
- Mutual App — Account creation entry point
  - Link: `https://mutual.app.br` (or dashboard URL)
  - CTA placement: Hero section "Criar conta" button, navbar, multiple sections
  - Reference: `C:\Users\Gustavo Brandão\Documents\landing-pages\lp-otc-mutual\index.html` (lines 180, 256, 352, etc.)
  - Auth: Email-based signup, no API key needed (landing page → external redirect)

- Mutual Capital (Internal Domain)
  - Primary domain: `https://mutualcapital.com.br`
  - Used for: Product pages, compliance docs, dashboard links
  - Reference integration pattern: External `<a>` links (no fetch/API)

**Communication Channels:**
- WhatsApp Business API
  - Entry point: `https://wa.me/55XXXXXXXXXX` (replace with Mutual's business number)
  - Usage: Chat/support button, floating widget (optional)
  - Reference: `C:\Users\Gustavo Brandão\Documents\landing-pages\lp-otc-mutual\index.html` (search for wa.me links)
  - Implementation: Standard `<a href="https://wa.me/...">` links

- Email:
  - General inquiries: `advisory@mutualcapital.com.br`
  - Compliance/Legal: `compliance@mutualcapital.com.br`
  - Support: `support@mutual.app.br`
  - Implementation: `<a href="mailto:email@domain">` links

**CDN Resources:**

- Google Fonts (Montserrat)
  - Source: `https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap`
  - Usage: Typography system (all text)
  - Reference: `C:\Users\Gustavo Brandão\Documents\landing-pages\lp-otc-mutual\index.html` (line 13)

- Font Awesome Icons
  - Source: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`
  - Usage: Icons (check marks, UI elements)
  - Reference: `C:\Users\Gustavo Brandão\Documents\landing-pages\lp-otc-mutual\index.html` (line 11)

- GSAP + ScrollTrigger
  - Source: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js` (CDN fallback)
  - Recommended: Install via npm `gsap` + `gsap/ScrollTrigger` for smaller builds
  - Usage: Scroll-driven animations, timeline sequences, parallax
  - Reference: `C:\Users\Gustavo Brandão\Documents\landing-pages\lp-otc-mutual\index.html` (line 9)

## Data Storage

**Databases:**
- None — Landing page is fully static, client-side only

**File Storage:**
- Local (git-tracked): Static assets in `src/assets/`
  - Images: `src/assets/img/` (PNG, WebP, SVG)
  - CSS: `src/assets/css/styles.css`
  - Reference: `C:\Users\Gustavo Brandão\Documents\landing-pages\lp-otc-mutual\index.html` (src attribute patterns)

- CDN (Production): Cloudflare Pages, Vercel, Netlify (asset optimization)
  - Recommended: Serve images via CDN, fonts via Google Fonts API

**Caching:**
- Browser cache (via HTTP headers, set by hosting platform)
- Service Worker: Not implemented (optional future enhancement)

## Authentication & Identity

**Auth Provider:**
- None on landing page — External redirect to `mutual.app.br` for signup
- Auth flow: User clicks CTA → Redirects to external Mutual signup flow
- No JWT, OAuth, or session management on LP itself

## Monitoring & Observability

**Error Tracking:**
- None detected in references
- Recommendation: Add `sentry.io` or `bugsnag.com` for production monitoring

**Logs:**
- Browser console only (development)
- No server-side logging (static hosting)

**Analytics (Recommended):**
- Google Analytics 4 — Track CTAs, page engagement, conversion
  - Implement via: `gtag.js` snippet in `<head>`
  - Track events: "click_cta", "scroll_depth", "contact_form_submit"

- Hotjar — Heatmaps, session recordings (optional)

## CI/CD & Deployment

**Hosting:**
- Cloudflare Pages — Recommended for Mutual ecosystem
  - Rationale: Fast global CDN, zero-latency caching, automatic deployments
  - Alternative: Vercel (Next.js-friendly), Netlify

- GitHub Actions workflow (optional)
  - Trigger: Push to `main` branch
  - Steps:
    1. Install deps (`pnpm install`)
    2. Build (`pnpm build`)
    3. Deploy to Cloudflare Pages

**CI Pipeline:**
- None currently configured — Add GitHub Actions workflow file:
  - `.github/workflows/deploy.yml`
  - Lints code, builds, deploys on merge

## Environment Configuration

**Required env vars:**
- `VITE_WHATSAPP_NUMBER` — WhatsApp business phone (format: `55XXXXXXXXXX`)
- `VITE_ADVISORY_EMAIL` — Advisory contact email
- `VITE_MUTUAL_DOMAIN` — Primary Mutual domain (e.g., `https://mutualcapital.com.br`)
- `VITE_GA_ID` — Google Analytics tracking ID (optional)

**Secrets location:**
- `.env.local` (git-ignored) — Development
- `.env.production` — Production (set in hosting platform UI)
- Reference: Mutual infrastructure uses GitHub Secrets for CI/CD

## Webhooks & Callbacks

**Incoming:**
- Contact form submission — TODO (backend not built)
  - Endpoint would be: `POST /api/contact` (needs API server)
  - Fields: name, email, message, phone
  - Action: Send to Slack, email, CRM

**Outgoing:**
- None currently — Landing page doesn't call external APIs
- Future: Slack notifications for form submissions

---

## Mutual Advisory Integration Plan

### Contact Form (HTML + TODO Backend)

**HTML Form** (in `<section id="contact">`):
```html
<form id="contact-form" action="https://api.mutualcapital.com.br/contact" method="POST">
  <input type="text" name="name" placeholder="Seu nome" required>
  <input type="email" name="email" placeholder="seu@email.com" required>
  <input type="tel" name="phone" placeholder="+55 (XX) XXXXX-XXXX">
  <textarea name="message" placeholder="Conte mais sobre seu negócio..." required></textarea>
  <button type="submit">Enviar Solicitação</button>
</form>
```

**Backend TODO:**
- Create API endpoint: `POST /api/contact`
- Validate input (email format, phone number)
- Send email to `advisory@mutualcapital.com.br`
- Optional: Slack webhook notification, CRM integration
- Response: Thank you email to user, redirect to `/contact-success`

### External Links (Ready to Deploy)

**Primary CTAs:**
- All "Criar conta" buttons → `https://mutual.app.br/advisory` (or custom path)
- "Saiba mais" → Scroll to features (#features) + CTA at bottom

**Support Channels:**
- WhatsApp: `https://wa.me/5521999999999` (Mutual's advisory number — TBD)
- Email: `advisory@mutualcapital.com.br`

**Footer Links:**
- Privacy: `https://mutualcapital.com.br/privacy`
- Terms: `https://mutualcapital.com.br/terms`
- Compliance: `https://mutualcapital.com.br/compliance`
- Contact: `mailto:advisory@mutualcapital.com.br`

### Tracking & Events

**Google Analytics 4 Events to Track:**
- `page_view` — Page load (automatic)
- `click_cta_create_account` — "Criar conta" button
- `click_cta_learn_more` — "Saiba mais" button
- `contact_form_submit` — Form submission
- `contact_form_error` — Validation error
- `scroll_depth` — 25%, 50%, 75%, 100% of page

### Font & Icon CDN Fallbacks

If CDN is unavailable (rare):
- Google Fonts: Falls back to system sans-serif (safe)
- Font Awesome: Icons not loaded (graceful degradation)

Mitigate by self-hosting as backup:
- Download font files, serve from `src/assets/fonts/`
- Download Font Awesome, serve from `src/assets/vendor/`

---

*Integration audit: 2026-06-16*
