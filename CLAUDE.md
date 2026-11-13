<!-- GSD:project-start source:PROJECT.md -->

## Project

**Mutual Advisory — Landing Page**

Landing page institucional da **Mutual Advisory**, vertical de inteligência patrimonial do Grupo Mutual Capital. Página única (one-page) que apresenta soluções de estruturação patrimonial, blindagem de ativos, expansão global e ativos digitais para um público de alto patrimônio (HNWI/UHNWI), empresários e family offices. Construída em Vite vanilla, reaproveitando o padrão de UI das demais landing pages do grupo, com identidade dark navy e motion sutil via GSAP.

**Core Value:** A página precisa **carregar extremamente rápido** e apresentar a copy institucional (palavra-por-palavra do material aprovado) com a sofisticação visual do padrão Mutual — convertendo visitantes em conversas confidenciais via WhatsApp/e-mail.

### Constraints

- **Tech stack**: Vite + Tailwind + Lenis + GSAP/ScrollTrigger — espelhar `lp-otc-mutual`/`lp-mutual-capital` (HTML monolítico + index.js)
- **Conteúdo**: copy idêntica palavra-por-palavra do HTML v4 — sem reescrita
- **Identidade**: dark navy do grupo (#030b1e, #FCB71B, #111D35, #1B2A46, #EEF1F9, #8898C0, Montserrat)
- **Performance**: carregamento extremamente rápido é requisito de primeira ordem
- **Idioma**: PT apenas no lançamento

<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## Languages

- HTML5 — Markup & semantic structure
- JavaScript (ES6+) — Client-side interactivity, animations, scroll behavior
- CSS3 — Styling via Tailwind + custom CSS variables
- SCSS/PostCSS — Vendor prefixes, nesting (via PostCSS)

## Runtime

- Node.js (version managed by `.nvmrc` — recommend 18.x or 20.x LTS)
- pnpm (or npm) — Lockfile: `pnpm-lock.yaml` (or `package-lock.json`)

## Frameworks

- Vite 7.3.1 — Build tool, dev server, module bundling
- Tailwind CSS 3.4.19 — Utility-first CSS framework
- PostCSS 8.5.6 — CSS transformation pipeline
- Autoprefixer 10.4.23 — Automatic browser vendor prefixes

## Key Dependencies

- Lenis 1.3.21 — Smooth scroll library (lerp-based physics)
- GSAP 3.12.5 — Animation engine (referenced in index.html via CDN)
- Font Awesome 6.4.0 — Icon library (CDN)
- Google Fonts (Montserrat) — Typography
- Chart.js 4.5.1 — Data visualization (used in lp-mutual-capital)

## Configuration

- `vite.config.js` — Vite configuration (allow Cloudflare tunnels, dev server settings)
- `tailwind.config.js` — Tailwind theme customization (extend colors, plugins)
- `postcss.config.js` — PostCSS plugin pipeline (tailwindcss → autoprefixer)
- `package.json` — Dependencies, scripts (`dev`, `build`)
- `pnpm-lock.yaml` (or `package-lock.json`) — Lock file for reproducible installs
- `index.html` — Entry point (links CSS, scripts, includes splash screen, navigation, sections)

## Platform Requirements

- Node.js 18.x or 20.x LTS
- pnpm 9.x+ (or npm 9.x+)
- Modern browser (Chrome, Firefox, Safari, Edge)
- 2GB RAM minimum, 500MB free disk
- Static hosting (Cloudflare Pages, Vercel, Netlify, AWS S3 + CloudFront)
- No backend required — 100% client-side rendering
- CDN for assets (images, fonts)
- HTTPS required for compliance

## Stack-Target: Mutual Advisory LP

### package.json (Recommended)

### Key Decisions

- Rationale: Fast dev server, instant HMR, minimal production bundle
- Rationale: Utility-first approach, small bundle, native CSS variables support
- Rationale: Replaces IntersectionObserver + CSS for complex scroll animations
- Key features: `gsap/ScrollTrigger` for parallax, reveal-on-scroll, timeline sequences
- Config: `{ lerp: 0.1, smoothWheel: true, duration: 1.2 }`
- Font Awesome 6.4.0 (icons)
- Google Fonts: Montserrat 400,500,600,700,800,900

### Color Palette (Dark Navy + Gold)

### HTML Structure

### Build Output

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## Design System: Dark Mode Consolidated

### Color Palette (CSS Variables)

- `--dark-bg: #030b1e` — Primary background for all sections
- `--hero-bg: #0E162E` — Hero section overlay / gradient base
- `--card-bg: #111D35` — Secondary card backgrounds (nested)
- `--border: #1B2A46` — Primary border color for all cards, separators, dividers
- Hover states often use `rgba(30, 52, 144, 0.12)` or `rgba(255, 255, 255, 0.07)` for subtle glow
- `--text-heading: #EEF1F9` — Primary text for headings, labels, UI copy
- `--text-muted: #8898C0` — Secondary text for descriptions, meta info
- `--primary-color: #FCB71B` — Gold brand accent (buttons, badges, icons)
- `--primary-hover: #e5a618` — Darker gold for hover states
- `--brand-blue: #1E3490` — Feature icons, secondary accents
- Cyan: `#11CFFA` — Transient accent in gradients
- Light Blue: `#3B82F6` / `#3556CD` — Primary blue (context7 docs accent)
- `lp-otc-mutual/src/assets/css/styles.css` (lines 9–19) — Primary color definitions
- `front-nextjs-lpmutual/src/app/globals.css` (lines 144–168) — Dark mode token layer

### Typography

- Primary: `Montserrat` (wght: 400, 500, 600, 700, 800, 900)
- Fallback: `Inter` (for body copy in some sections — see notes below)
- Applied via: `font-family: 'Montserrat', sans-serif` in HTML `<style>` tag or CSS
- Most sections: `'Montserrat', sans-serif`
- Body/description text (in some sections): `font-family: 'Inter', sans-serif` (style attribute override)
- Reference: `lp-mutual-capital/index.html` line 17 uses both fonts, with context-specific overrides

| Level | Mobile (sm) | Tablet (md) | Desktop (lg) | Weight | Example File |
|-------|-----------|-----------|-----------|--------|--------------|
| **h1** | `text-[34px]` | `text-[44px]` sm:`text-[44px]` md:`text-[54px]` | `text-[64px]` lg:`text-[64px]` | 500/600 | `lp-otc-mutual/index.html` line 245 |
| **h2** | `text-[28px]` | `text-[36px]` | `text-[42px]` lg:`text-[40px]` | 600/700 | `lp-mutual-capital/index.html` line 292 |
| **h3** | `text-[17px]` | `text-[18px]` | `text-[20px]` | 500/600 | `lp-otc-mutual/index.html` line 316 |
| **Body (hero)** | `text-[17px]` | `text-[19px]` | `text-[19px]` | 500/600 | `lp-otc-mutual/index.html` line 250 |
| **Body (standard)** | `text-[15px]` | `text-[15px]` | `text-[15px]` | 400/500 | `lp-mutual-capital/index.html` line 295 |
| **Small/meta** | `text-[13px]` | `text-[13px]` | `text-[13px]` | 400/500 | `lp-otc-mutual/index.html` line 237 |

- Headings: `leading-[1.04]` to `leading-[1.1]` (tight, for visual density)
- Body text: `leading-[1.65]` (generous, for readability)
- Small text: `leading-[1.6]` (tight-to-generous)
- Headings: `tracking-[-0.04em]` to `tracking-[-0.02em]` (negative, tightened)
- Body: `tracking-tight` or default (no override)
- Uppercase meta: `tracking-widest` (usually `tracking-[0.12em]` equivalent)
- `lp-otc-mutual/index.html` lines 245–250 — h1 with shine-text variant, responsive scale
- `lp-mutual-capital/index.html` lines 289–297 — h2 with eyebrow badge + body text

### Spacing

- Hero: `pt-16 pb-0 sm:pt-20 md:pt-24` (stacked, no bottom padding)
- Standard sections: `py-20 sm:py-24 lg:py-32` (symmetric, increases on desktop)
- Dense sections: `py-16 sm:py-20 lg:py-28`
- `max-w-[1250px]` — Standard container (used across all LPs)
- Applied with `mx-auto` for centering
- Mobile: `px-4` (16px total)
- Small: `px-6` (24px total)
- Medium: `sm:px-6 lg:px-8` or `sm:px-8 lg:px-10`
- Large: `sm:px-10 lg:px-16 xl:px-24`
- Cards grid: `gap-4` (16px, mobile) → `gap-6` (24px, tablet) → `gap-10` (40px, desktop)
- Component groups: `gap-2` to `gap-5` (context-dependent)
- `lp-otc-mutual/index.html` line 233–280 — Hero padding and spacing
- `lp-mutual-capital/index.html` lines 284–298 — Bento grid section with section spacing

### Border Radius

- Large cards: `rounded-2xl` (16px)
- Small/button cards: `rounded-[10px]` (10px)
- Badge/pill: `rounded-full` (50%)
- Icon container: `rounded-lg` (8px) or `rounded-xl` (12px)
- `rounded-2xl` — Primary card containers, sections, overlays
- `rounded-xl` — Secondary buttons, medium cards, feature icons
- `rounded-[10px]` — CTA buttons (consistent Mutual button style)
- `rounded-full` — Badge pills, small badges, checkmarks in rings
- `lp-otc-mutual/src/assets/css/styles.css` line 33 — scrollbar radius
- `lp-otc-mutual/index.html` lines 304–322 — Bento cards with rounded-2xl + magic-card

### Shadows

- `shadow-[0_4px_14px_rgba(252,183,27,0.32)]` — Standard CTA button shadow
- `shadow-[0_4px_14px_rgba(252,183,27,0.3)]` — Mobile variation
- Hover: `shadow-[0_6px_20px_rgba(252,183,27,0.42)]` or remove glow
- `shadow-2xl` or explicit `shadow-[0_20px_40px_rgba(252,183,27,0.2)]` — On hover
- `box-shadow: inset 0 0 0 1px #1B2A46` — Subtle border-only
- Floating card (glass): `box-shadow: 0 8px 32px rgba(0,0,0,0.08)`
- Hero image: `filter: drop-shadow(0 20px 56px rgba(53,86,205,0.25))`
- Subadquirencia image: `filter: drop-shadow(0 24px 48px rgba(53,86,205,0.10))`
- Inner: `radial-gradient(...rgba(30, 52, 144, 0.12)...)` centered at `--mouse-x/y`
- Border: `rgba(80, 110, 220, 0.95)` with mask composite for edge-only glow
- Applied via JS hook `.magic-card` on card elements
- `lp-otc-mutual/src/assets/css/styles.css` lines 40–78 — Magic card pseudo-element effect
- `lp-otc-mutual/index.html` line 110 — Hover shadow on card-hover

### Gradients

- Primary: `linear-gradient(135deg, #a8c0ff 0%, #1E3490 50%, #11CFFA 100%)`
- Modern/multi-gradient: `linear-gradient(90deg, #3556CD 0%, #3556CD 38%, #a8c0ff 50%, #3556CD 62%, #3556CD 100%)`
- Gold gradient (button): `linear-gradient(135deg, #FCB71B 0%, #e5a618 100%)`
- Hero bottom fade: `linear-gradient(to top, #0E1628 0%, rgba(14,22,40,0.92) 32%, rgba(14,22,40,0.15) 62%, rgba(14,22,40,0) 100%)`
- Radial blue: `rgba(30, 52, 144, 0.12)` with `blur-[100px]`
- Radial cyan: `rgba(17, 207, 250, 0.08)` with `blur-[80px]`
- `lp-otc-mutual/src/assets/css/styles.css` lines 85–102 — Shine and gradient text
- `lp-otc-mutual/index.html` lines 224–230 — Decorative gradient blobs
- `front-nextjs-lpmutual/src/app/globals.css` lines 89–104 — Dual shine-text (light + dark)

### Animations

- **Hero Stagger:** Each element has a delayed `heroEnter` keyframe (0.6–0.9s duration)
- **Fade In on Scroll:** `.fade-in` class for sections below hero
- **Platform Items Stagger:** `.plat-item` and `.plat-widget`
- **Floating Animation:** Hero image and floating cards
- **Card hover:** `transform: translateY(-8px)`, `box-shadow: 0 20px 40px rgba(252,183,27,0.2)`
- **Link/CTA hover:** Text color change, border glow (on outline buttons)
- Standard UI: `transition-colors` 200ms or 300ms
- Scale/transform: `transition-all 0.3s ease`
- Navbar pill animation: 380ms `cubic-bezier(0.4,0,0.2,1)` (more snappy)
- `lp-otc-mutual/src/assets/css/styles.css` lines 121–155 — fadeIn, heroEnter, float keyframes
- `lp-otc-mutual/src/assets/css/styles.css` lines 173–208 — plat-item stagger + plat-visible class
- `lp-otc-mutual/index.html` lines 236–242 — hero-badge/title/sub/ctas with hero-* class hooks

### Component Patterns

#### Badge / Eyebrow

- Pill container with small gold dot indicator
- Applied: `.hero-badge` for animation hook
- Reference: `lp-otc-mutual/index.html` line 236

#### Card (Magic Card with Glow)

- `.magic-card` applies JS-driven glow on mouse enter
- Border hover effect: `hover:border-white/[0.07]`
- Number at top-right: `group-hover:text-white/60` (increases opacity)
- Reference: `lp-otc-mutual/index.html` lines 304–323

#### Button (CTA — Primary Gold)

- Gold background: `#FCB71B`
- Hover: `#e5a618`
- Shadow: `[0_4px_14px_rgba(252,183,27,0.32)]`
- Rounded: `rounded-[10px]`
- Reference: `lp-otc-mutual/index.html` line 257

#### Button (Secondary Outline)

- Transparent fill, border-only
- Hover: Blue tint `hover:border-[#1E3490]/60` + `hover:bg-[#1E3490]/8`
- Reference: `lp-otc-mutual/index.html` line 262

#### Navbar (Fixed, Pill on Scroll)

- Fixed positioning, z-50
- Transforms to pill (border-radius, box-shadow) on scroll via JS
- Mobile menu: `border-radius: rounded-2xl`, `backdrop-blur-md`
- Reference: `lp-mutual-capital/index.html` lines 146–219

#### Feature Check (with icon)

- Gold ring container with white check
- Applied to feature lists in cards
- Reference: `lp-otc-mutual/index.html` lines 333–350

### JavaScript Hook Classes

- `.fade-in` — Triggers on scroll, enters with fade + translateY
- `.fade-in.visible` — Class added when in viewport
- `.hero-badge`, `.hero-title`, `.hero-sub`, `.hero-ctas`, `.hero-dash` — Staggered hero entrance
- `.hero-image` — Floating animation
- `.plat-item` — Platform section stagger (0.52s transition per item)
- `.plat-item.plat-visible` — Adds transform when visible
- `.plat-widget` — Alternate stagger direction (translateX instead of Y)
- `.plat-widget.plat-visible` — Applies transform
- `.magic-card` — Mouse-tracking glow effect (requires JS to update `--mouse-x`, `--mouse-y`)
- `.card-hover` — Hover transform + shadow (group parent)
- `.group-hover:*` — Used with `.card-hover` for child scale transforms
- `.feature-icon` — Scales on parent `.card-hover:hover`
- `.animate-fade-in` — Keyframe-based entrance (direct animation, not scroll-based)
- `.mobile-menu-link`, `.nav-link` — Mobile/desktop nav item hooks for state
- `#navbar-header`, `#navbar-wrapper`, `#navbar-center`, `#navbar-inner` — Scroll JS targets
- `#navbar-logo` — Logo element, opacity animated on splash completion
- `#mobile-menu-button` — Mobile menu toggle
- `#mobile-menu` — Mobile dropdown (toggled hidden/shown)
- `lp-otc-mutual/src/assets/css/styles.css` lines 174–208 — `.fade-in`, `.plat-item` class definitions
- `lp-otc-mutual/index.html` lines 236–279 — Hero element class applications (`.hero-badge`, etc.)

### Naming Conventions

- Color tokens: `--dark-bg`, `--hero-bg`, `--card-bg`, `--border`, `--text-heading`, `--text-muted`
- Accent colors: `--primary-color`, `--primary-hover`, `--brand-blue`
- All lowercase, hyphen-separated, descriptive
- Responsive prefixes: `sm:`, `md:`, `lg:`, `xl:` (mobile-first)
- Arbitrary values: `text-[34px]`, `px-[10px]`, `bg-[#FCB71B]`, `rounded-[10px]`
- Opacity modifiers: `/[0.07]`, `/60`, `/15`, `/[0.12]`
- State modifiers: `hover:`, `group-hover:`, `active:`, `focus:`
- Card: `.magic-card`, `.feature-bento-card`, `.func-card`
- Animation triggers: `.fade-in`, `.hero-*`, `.plat-item`, `.plat-widget`
- Mobile-specific: `.mobile-menu-link`, `.mobile-card-border`
- No heavy BEM nesting; rely on groups (`.group`, `.group-hover:*`)
- Styles: `src/assets/css/styles.css` (single consolidated file)
- Structure: Import `@tailwind base/components/utilities`, then define custom classes
- Responsive: Inline media queries `@media (max-width: 768px)` where needed

<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## System Overview

```text

```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Splash Screen | GSAP stroke-draw animation + fly-to navbar logo | `index.html` (inline script + SVG) |
| Navbar | Pill-on-scroll transform via scroll state + theme detection | `index.html` + `index.js` |
| Hero Section | Staggered fade-in + floating dashboard image | `index.html` (CSS classes) + `index.js` (observer) |
| Bento Cards (Magic Card) | Mouse tracking glow via CSS vars + hover shadows | `styles.css` (::before/::after) + `index.js` (mousemove listener) |
| Shine Text | Gradient text animation (linear 90deg, 6s infinite) | `styles.css` (@keyframes) |
| Counters | Count-up animation on intersection (easeOutExpo tween) | `index.js` (RAF + IntersectionObserver) |
| Marquee | Horizontal scrolling carousel or infinite loop | `index.html` (depends on implementation) |
| Smooth Scroll | Lenis interpolation + anchor link navigation | `index.js` (Lenis initialization + click handlers) |
| Platform Section | Staggered fade-in with transition-delay on IntersectionObserver | `index.html` + `styles.css` + `index.js` |
| Mobile Menu | Toggle visibility + close on scroll/link click | `index.html` + `index.js` |

## Pattern Overview

- No framework (React/Vue/Next.js) — raw HTML + CSS + JS for performance
- Vite dev server with instant HMR (hot reload)
- Tailwind CSS for utility styling + CSS custom properties for theme colors
- Lenis for smooth scroll hijacking (overrides native scroll)
- GSAP 3.12+ for timeline-driven animations + ScrollTrigger integration (NEW for Advisory)
- IntersectionObserver for viewport-based visibility triggers (legacy pattern, may coexist with GSAP)
- CSS keyframes for simple loops (shine-text, float, marquee)
- RAF-based counters (easeOutExpo tween function)

## Layers

- Purpose: Semantic structure + microdata, Tailwind class bindings, data attributes for animation state
- Location: `index.html`
- Contains: Sections (hero, features, platform, footer), cards, forms, navigation anchors
- Depends on: Nothing (purely declarative)
- Used by: CSS + JavaScript
- Purpose: Visual design + responsive layout + animation keyframes + CSS variables
- Location: `src/assets/css/styles.css` (+ Tailwind via CDN or build)
- Contains: `@keyframes`, `:root` CSS vars, `.magic-card` glow, media queries, glass-morphism effects
- Depends on: Tailwind base/components/utilities
- Used by: HTML (class names) + JavaScript (CSS var updates via style.setProperty)
- Purpose: Orchestrate animations, detect scroll/intersection, handle user input
- Location: `index.js` (entry point)
- Contains: Lenis init, GSAP timelines + ScrollTrigger setup, IntersectionObserver, event listeners, counters
- Depends on: Lenis, GSAP, browser DOM APIs
- Used by: Browser runtime (executed on DOMContentLoaded + window load)
- Location: `src/assets/img/`, `src/assets/css/`
- Contains: Logos, dashboard screenshots, icons (SVG or PNG), background images
- Optimization: Use WebP with PNG fallback, compress aggressively

## Data Flow

### Primary Request Path (Page Load)

### Animation Flow (GSAP + ScrollTrigger Model)

```javascript

```

- `.fade-in` + `.visible` class trigger via IntersectionObserver
- Keyframes execute without JavaScript coordination
- HTML5 data attributes store animation metadata (`data-count`, `data-suffix`, `data-format`)
- CSS variables (`--mouse-x`, `--mouse-y`) updated on mousemove
- localStorage tracks splash screen view state (one-time)
- Mobile menu state stored in `let menuOpen` (function scope)

## Key Abstractions

- Purpose: Interactive card with mouse-tracking glow effect
- Examples: Feature cards in bento grid, product cards
- Pattern: CSS custom properties + ::before/::after pseudo-elements for glow layers + JS mousemove listener updates CSS vars
- Purpose: Animate numeric values from 0 to target on scroll intersection
- Examples: "50K transactions processed", "1.2B volume"
- Pattern: easeOutExpo tween function + RAF tick loop + IntersectionObserver trigger
- Purpose: Gradient text with sweeping animation (no interaction)
- Examples: Key words in headlines (e.g., "internacionais", "globalmente")
- Pattern: CSS `background: linear-gradient()` + `background-clip: text` + `@keyframes shine-gradient`
- Purpose: Transform from full-width header to centered, rounded pill on scroll
- Examples: Top navigation bar
- Pattern: Scroll listener + RAF debouncing + conditional CSS transitions (max-width, border-radius, backdrop-filter)
- Purpose: Override native scroll with interpolated, eased scrolling
- Pattern: Lenis.raf(time) called every frame, Lenis.scrollTo() for programmatic navigation

## Entry Points

- Location: `index.html`
- Triggers: Browser GET request to domain root
- Responsibilities: Render DOM structure, link CSS/JS, inline splash animation script
- Location: `index.js`
- Triggers: `<script type="module" src="./index.js"></script>` in HTML head or body
- Responsibilities: Initialize Lenis, attach scroll listeners, set up observers, bind event handlers
- Location: `index.html:40-143` (inline `<script>`)
- Triggers: window.load event
- Responsibilities: Animate logo SVG, check localStorage, fade splash screen

## Architectural Constraints

- **Threading:** Single-threaded JavaScript event loop. No Web Workers for now. RAF throttles motion at ~60fps (frame rate of display).
- **Global state:** 
- **Circular imports:** None — vanilla JS with no imports except Lenis + GSAP (both externs).
- **Scroll behavior:** Lenis hijacks native scroll, preventing use of `scroll-behavior: smooth` or `window.scrollY` reading. Always use Lenis methods.
- **Animation timeline:** GSAP ScrollTrigger animations and IntersectionObserver triggers may overlap. Ensure proper z-index isolation to avoid visual conflicts.
- **Mobile responsiveness:** Tailwind breakpoints (sm, md, lg) drive layout shifts. No JavaScript-based breakpoint detection needed unless custom behavior required.

## Anti-Patterns

### Using `scroll-behavior: smooth` alongside Lenis

### Blocking DOM reads/writes during scroll

### Mixing RAF-based and CSS-based animations

### Not debouncing window resize

## Error Handling

- Missing DOM elements: Check with `document.getElementById()`, skip if null (e.g., navbar script: `if (navWrapper) { ... }`)
- Failed external scripts: GSAP or Lenis fallback to vanilla CSS animations (fade-in still works via IntersectionObserver)
- Smooth scroll fallback: If Lenis unavailable, anchor clicks fall back to native scroll (no href preventDefault)

## Cross-Cutting Concerns

- Dev: Optional `console.log()` calls in IIFE scopes (remove before deploy)
- Prod: No logging (Sentry/Datadog integration to be added)
- Form inputs (if contact form exists): Client-side Tailwind validation classes + server-side on backend
- Data attributes: No validation; assume correct from HTML authoring
- Landing page is public (no auth required)
- "Create account" CTAs link to backend signup endpoint (out of scope for LP)
- Semantic HTML (`<header>`, `<nav>`, `<section>`, `<footer>`)
- ARIA labels on buttons + icon buttons
- Keyboard navigation for mobile menu (esc to close, tab through nav links)
- Color contrast checked against WCAG AA (Tailwind default palette)
- alt text on all images

## Motion Migration Plan: IntersectionObserver + RAF → GSAP + ScrollTrigger

### Animation Types & GSAP Equivalents

| Current Pattern | Tools Used | GSAP + ScrollTrigger Equivalent |
|---|---|---|
| **Reveal on scroll** | IntersectionObserver + CSS transition + `.visible` class | `ScrollTrigger.from()` — fade/translate into view |
| **Counter countup** | RAF loop + easeOutExpo tween + IntersectionObserver trigger | `gsap.to(element, { textContent: target, snap: { textContent: 1 } })` with `ScrollTrigger` |
| **Navbar transform** | RAF scroll listener + conditional style updates | `gsap.to('#navbar', { ... , scrollTrigger: { trigger: 'body', start: 'top' } })` |
| **Marquee** | CSS `@keyframes` loop (infinite) | `gsap.to('.marquee-track', { x: -50%, duration: 20, repeat: -1, ease: 'none' })` |
| **Float animation** | CSS `@keyframes float` (static) | Keep as CSS (non-interactive) or `gsap.to(element, { y: -8, yoyo: true, repeat: -1, ease: 'sine.inOut' })` |
| **Magic card glow** | JS mousemove + CSS var updates + radial-gradient | Keep JS listener for var updates; consider `gsap.to(--mouse-x, ...)` if dynamic |
| **Shine text** | CSS gradient + `@keyframes shine-gradient` | Keep as CSS (simple, no interaction) |
| **Splash screen** | GSAP stroke-draw + timeline + opacity fade | Already GSAP — no change needed |
| **Hero stagger** | CSS `animation: heroEnter` with `animation-delay` | `ScrollTrigger.batch('.hero-*', { ... stagger: ... })` or use timeline with delays |
| **Tab switcher** | JS pill indicator position + transform | `gsap.to('#indicator', { width: btnWidth, x: offset, duration: 0.38, ease: 'power2.inOut' })` with button click trigger |

### Implementation Approach

- Splash animation already uses GSAP 3.12.5 (referenced in `index.html:9`)
- Keep as-is; no changes needed

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

- **Magic card glow:** Keep JS mousemove listener (CSS vars are lightweight)
- **Marquee:** Convert to GSAP timeline if needs scroll interactivity; keep CSS if static loop

```html

```

```javascript

```

### Benefits

### Rollout Strategy

<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
