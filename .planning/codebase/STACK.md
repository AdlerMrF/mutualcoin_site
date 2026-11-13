# Technology Stack

**Analysis Date:** 2026-06-16

## Languages

**Primary:**
- HTML5 — Markup & semantic structure
- JavaScript (ES6+) — Client-side interactivity, animations, scroll behavior
- CSS3 — Styling via Tailwind + custom CSS variables

**Secondary:**
- SCSS/PostCSS — Vendor prefixes, nesting (via PostCSS)

## Runtime

**Environment:**
- Node.js (version managed by `.nvmrc` — recommend 18.x or 20.x LTS)

**Package Manager:**
- pnpm (or npm) — Lockfile: `pnpm-lock.yaml` (or `package-lock.json`)

## Frameworks

**Core:**
- Vite 7.3.1 — Build tool, dev server, module bundling
  - Reference: `C:\Users\Gustavo Brandão\Documents\landing-pages\lp-otc-mutual\vite.config.js`
  - Reference: `C:\Users\Gustavo Brandão\Documents\landing-pages\lp-mutual-capital\package.json`

**CSS:**
- Tailwind CSS 3.4.19 — Utility-first CSS framework
  - Config: `tailwind.config.js` (scans `./index.html`, `./src/**/*.{js,html}`)
  - Reference: `C:\Users\Gustavo Brandão\Documents\landing-pages\lp-otc-mutual\tailwind.config.js`

**PostCSS/Vendor:**
- PostCSS 8.5.6 — CSS transformation pipeline
  - Config: `postcss.config.js` (includes autoprefixer, tailwindcss)
  - Reference: `C:\Users\Gustavo Brandão\Documents\landing-pages\lp-mutual-capital\postcss.config.js`

- Autoprefixer 10.4.23 — Automatic browser vendor prefixes

## Key Dependencies

**Critical (Performance & UX):**
- Lenis 1.3.21 — Smooth scroll library (lerp-based physics)
  - Used in: `C:\Users\Gustavo Brandão\Documents\landing-pages\lp-otc-mutual\index.js` (lines 68–79)
  - Config: `lerp: 0.1, smoothWheel: true`

- GSAP 3.12.5 — Animation engine (referenced in index.html via CDN)
  - Source: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`
  - **New for Advisory**: Will be installed as npm package + ScrollTrigger plugin for scroll-driven animations

**Icons & Fonts:**
- Font Awesome 6.4.0 — Icon library (CDN)
  - Source: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`

- Google Fonts (Montserrat) — Typography
  - Source: `https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap`

**Data/Charts (Optional for Capital):**
- Chart.js 4.5.1 — Data visualization (used in lp-mutual-capital)

## Configuration

**Build:**
- `vite.config.js` — Vite configuration (allow Cloudflare tunnels, dev server settings)
  - Reference: `C:\Users\Gustavo Brandão\Documents\landing-pages\lp-otc-mutual\vite.config.js`

**CSS/PostCSS:**
- `tailwind.config.js` — Tailwind theme customization (extend colors, plugins)
- `postcss.config.js` — PostCSS plugin pipeline (tailwindcss → autoprefixer)

**Package Management:**
- `package.json` — Dependencies, scripts (`dev`, `build`)
- `pnpm-lock.yaml` (or `package-lock.json`) — Lock file for reproducible installs

**HTML:**
- `index.html` — Entry point (links CSS, scripts, includes splash screen, navigation, sections)
  - Reference: `C:\Users\Gustavo Brandão\Documents\landing-pages\lp-otc-mutual\index.html` (930 lines)

## Platform Requirements

**Development:**
- Node.js 18.x or 20.x LTS
- pnpm 9.x+ (or npm 9.x+)
- Modern browser (Chrome, Firefox, Safari, Edge)
- 2GB RAM minimum, 500MB free disk

**Production:**
- Static hosting (Cloudflare Pages, Vercel, Netlify, AWS S3 + CloudFront)
- No backend required — 100% client-side rendering
- CDN for assets (images, fonts)
- HTTPS required for compliance

---

## Stack-Target: Mutual Advisory LP

Based on ecosystem analysis and decision requirements, **Mutual Advisory** will use:

### package.json (Recommended)

```json
{
  "name": "lp-mutual-advisory",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "serve": "npm run build && vite preview"
  },
  "dependencies": {
    "gsap": "^3.14.2",
    "lenis": "^1.3.21"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.23",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.19",
    "vite": "^7.3.1"
  }
}
```

### Key Decisions

**Build Tool:** Vite 7.3.1 (vanilla JavaScript, no framework overhead)
- Rationale: Fast dev server, instant HMR, minimal production bundle

**CSS:** Tailwind 3.4.19 + PostCSS + Autoprefixer
- Rationale: Utility-first approach, small bundle, native CSS variables support

**Motion Engine:** GSAP 3.14.2 + ScrollTrigger (installed as npm)
- Rationale: Replaces IntersectionObserver + CSS for complex scroll animations
- Key features: `gsap/ScrollTrigger` for parallax, reveal-on-scroll, timeline sequences

**Smooth Scroll:** Lenis 1.3.21
- Config: `{ lerp: 0.1, smoothWheel: true, duration: 1.2 }`

**CDN Resources:**
- Font Awesome 6.4.0 (icons)
- Google Fonts: Montserrat 400,500,600,700,800,900

### Color Palette (Dark Navy + Gold)

```css
:root {
  --dark-bg: #0C1220;        /* Page background */
  --hero-bg: #0E162E;        /* Hero section layer */
  --card-bg: #111D35;        /* Card backgrounds */
  --border: #1B2A46;         /* Border color */
  --text-heading: #EEF1F9;   /* H1-H6, strong text */
  --text-muted: #8898C0;     /* Subtitle, captions */
  --accent-gold: #FCB71B;    /* CTA, highlights */
  --accent-gold-hover: #e5a618; /* Hover state */
  --brand-blue: #1E3490;     /* Feature blue */
  --cyan: #11CFFA;           /* Accent cyan */
}
```

### HTML Structure

```
index.html
├── <head>
│   ├── Tailwind CDN (optional fallback) or compiled CSS
│   ├── GSAP + ScrollTrigger (CDN or npm)
│   ├── Font Awesome
│   ├── Google Fonts: Montserrat
│   └── Favicon
├── <body class="bg-[#0C1220]">
│   ├── #splash-screen (animated logo load)
│   ├── <header> (fixed navbar, pill on scroll)
│   ├── <section id="hero"> (headline, CTA, preview)
│   ├── <section id="features"> (bento grid, magic cards)
│   ├── <section id="platform"> (dashboard mockup)
│   ├── <section id="contact"> (lead form — TODO: backend)
│   └── <footer> (compliance, links, social)
```

### Build Output

```
dist/
├── index.html           (minified, inlined critical CSS)
├── assets/
│   ├── js/
│   │   └── index-[hash].js  (bundled + minified)
│   ├── css/
│   │   └── style-[hash].css (Tailwind output)
│   └── img/
│       ├── logo_branca.svg
│       ├── dash.png
│       ├── hero-bg.webp
│       └── ... (optimized images)
```

**Bundle Size Target:** < 200KB (HTML + JS + CSS gzipped)

---

*Stack analysis: 2026-06-16*
