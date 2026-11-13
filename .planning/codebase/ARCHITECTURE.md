<!-- refreshed: 2026-06-16 -->
# Architecture

**Analysis Date:** 2026-06-16

## System Overview

Mutual Landing Pages ecosystem is built on Vite vanilla (HTML monolithic + index.js) with Tailwind CSS, smooth scroll via Lenis, and RAF-based motion. The new lp-mutual-advisory follows this family pattern but upgrades motion from IntersectionObserver+RAF+CSS keyframes to GSAP 3.12+ with ScrollTrigger for advanced sequence control and timeline orchestration.

```text
┌─────────────────────────────────────────────────────────────┐
│                    Browser Runtime                           │
├──────────────────┬──────────────────┬───────────────────────┤
│   index.html     │   index.js       │   styles.css          │
│ (monolithic)     │ (motion init)    │ (Tailwind + vars)     │
└────────┬─────────┴────────┬─────────┴──────────┬────────────┘
         │                  │                    │
         ▼                  ▼                    ▼
┌──────────────────────────────────────────────────────────────┐
│         Motion + Interaction Layer (GSAP + Lenis)            │
│  - GSAP.timeline() orchestrates scrolling animations         │
│  - ScrollTrigger ties animations to scroll position          │
│  - Lenis.raf() provides smooth scrolling interpolation       │
│  - IntersectionObserver for visibility detection (fallback)  │
└──────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│         DOM Mutation & CSS Class Management                  │
│  - .visible, .plat-visible, .func-card-active triggers CSS   │
│  - CSS variables (--mouse-x, --mouse-y) for mouse tracking   │
│  - Data attributes (data-count, data-suffix) for counters    │
└──────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│         Vite Build Output → Browser                          │
│  - index.html served from dist/                             │
│  - CSS bundled + Tailwind JIT compilation                   │
│  - JS minified (dev: full sourcemaps)                        │
└──────────────────────────────────────────────────────────────┘
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

**Overall:** Single-Page Landing (Vite monolithic HTML + vanilla JS)

**Key Characteristics:**
- No framework (React/Vue/Next.js) — raw HTML + CSS + JS for performance
- Vite dev server with instant HMR (hot reload)
- Tailwind CSS for utility styling + CSS custom properties for theme colors
- Lenis for smooth scroll hijacking (overrides native scroll)
- GSAP 3.12+ for timeline-driven animations + ScrollTrigger integration (NEW for Advisory)
- IntersectionObserver for viewport-based visibility triggers (legacy pattern, may coexist with GSAP)
- CSS keyframes for simple loops (shine-text, float, marquee)
- RAF-based counters (easeOutExpo tween function)

## Layers

**Presentation (HTML):**
- Purpose: Semantic structure + microdata, Tailwind class bindings, data attributes for animation state
- Location: `index.html`
- Contains: Sections (hero, features, platform, footer), cards, forms, navigation anchors
- Depends on: Nothing (purely declarative)
- Used by: CSS + JavaScript

**Styling (CSS):**
- Purpose: Visual design + responsive layout + animation keyframes + CSS variables
- Location: `src/assets/css/styles.css` (+ Tailwind via CDN or build)
- Contains: `@keyframes`, `:root` CSS vars, `.magic-card` glow, media queries, glass-morphism effects
- Depends on: Tailwind base/components/utilities
- Used by: HTML (class names) + JavaScript (CSS var updates via style.setProperty)

**Motion & Interaction (JavaScript):**
- Purpose: Orchestrate animations, detect scroll/intersection, handle user input
- Location: `index.js` (entry point)
- Contains: Lenis init, GSAP timelines + ScrollTrigger setup, IntersectionObserver, event listeners, counters
- Depends on: Lenis, GSAP, browser DOM APIs
- Used by: Browser runtime (executed on DOMContentLoaded + window load)

**Assets:**
- Location: `src/assets/img/`, `src/assets/css/`
- Contains: Logos, dashboard screenshots, icons (SVG or PNG), background images
- Optimization: Use WebP with PNG fallback, compress aggressively

## Data Flow

### Primary Request Path (Page Load)

1. **Browser fetches index.html** (`index.html:1-50`)
   - CDN Tailwind + GSAP 3.12.5 loaded
   - Local styles.css linked
   - Splash screen inline script queued

2. **Splash animation triggers on window.load** (`index.html:55-143`)
   - GSAP SVG stroke-draw: icon + text paths
   - Fill opacity fade-in (staggered)
   - SVG transforms to navbar logo position + splash bg fades
   - localStorage key set (skip splash on revisit)

3. **DOMContentLoaded fires** → index.js initializes
   - Lenis created + RAF loop bound to requestAnimationFrame
   - Navbar scroll listener attached (passive event)
   - IntersectionObserver for fade-in sections created
   - CountUp observers bound to `[data-count]` elements
   - Mobile menu event listeners attached
   - Magic card mouse tracking setup (features section)
   - Anchor link smooth-scroll delegated to Lenis

4. **User scrolls page**
   - RAF from Lenis processes scroll input (lerp: 0.1)
   - Navbar scroll state evaluated (scrolled > 80px)
   - Magic cards receive `--mouse-x`, `--mouse-y` CSS vars (mousemove bubbles)
   - Sections with `.fade-in` trigger `.visible` class on intersection
   - Counters trigger on intersection → easeOutExpo tween for count-up
   - GSAP ScrollTrigger animations fire (if bound to scroll position)

5. **User clicks anchor link** (`a[href^="#"]`)
   - preventDefault() intercepts
   - Lenis.scrollTo(target, { duration: 0.9 }) animates smooth scroll
   - Mobile menu auto-closes if open

### Animation Flow (GSAP + ScrollTrigger Model)

**Initialization (index.js):**
```javascript
// GSAP timeline example for a reveal sequence
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '#features',
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: 0.5, // smooth scrub tied to scroll
    markers: false // remove in prod
  }
});

tl.from('.feature-card', {
  opacity: 0,
  y: 40,
  stagger: 0.1,
  duration: 0.8,
  ease: 'power2.out'
});
```

**CSS Fallback (for simple, non-timeline animations):**
- `.fade-in` + `.visible` class trigger via IntersectionObserver
- Keyframes execute without JavaScript coordination

**State Management:**
- HTML5 data attributes store animation metadata (`data-count`, `data-suffix`, `data-format`)
- CSS variables (`--mouse-x`, `--mouse-y`) updated on mousemove
- localStorage tracks splash screen view state (one-time)
- Mobile menu state stored in `let menuOpen` (function scope)

## Key Abstractions

**Magic Card:**
- Purpose: Interactive card with mouse-tracking glow effect
- Examples: Feature cards in bento grid, product cards
- Pattern: CSS custom properties + ::before/::after pseudo-elements for glow layers + JS mousemove listener updates CSS vars

**CountUp Counter:**
- Purpose: Animate numeric values from 0 to target on scroll intersection
- Examples: "50K transactions processed", "1.2B volume"
- Pattern: easeOutExpo tween function + RAF tick loop + IntersectionObserver trigger

**Shine Text:**
- Purpose: Gradient text with sweeping animation (no interaction)
- Examples: Key words in headlines (e.g., "internacionais", "globalmente")
- Pattern: CSS `background: linear-gradient()` + `background-clip: text` + `@keyframes shine-gradient`

**Navbar Pill:**
- Purpose: Transform from full-width header to centered, rounded pill on scroll
- Examples: Top navigation bar
- Pattern: Scroll listener + RAF debouncing + conditional CSS transitions (max-width, border-radius, backdrop-filter)

**Smooth Scroll (Lenis):**
- Purpose: Override native scroll with interpolated, eased scrolling
- Pattern: Lenis.raf(time) called every frame, Lenis.scrollTo() for programmatic navigation

## Entry Points

**index.html:**
- Location: `index.html`
- Triggers: Browser GET request to domain root
- Responsibilities: Render DOM structure, link CSS/JS, inline splash animation script

**index.js:**
- Location: `index.js`
- Triggers: `<script type="module" src="./index.js"></script>` in HTML head or body
- Responsibilities: Initialize Lenis, attach scroll listeners, set up observers, bind event handlers

**Splash Screen (IIFE):**
- Location: `index.html:40-143` (inline `<script>`)
- Triggers: window.load event
- Responsibilities: Animate logo SVG, check localStorage, fade splash screen

## Architectural Constraints

- **Threading:** Single-threaded JavaScript event loop. No Web Workers for now. RAF throttles motion at ~60fps (frame rate of display).
- **Global state:** 
  - `lenis` instance (module-scoped in index.js)
  - `menuOpen` flag (IIFE scope in navbar code)
  - localStorage for splash screen state
  - CSS custom properties in :root for theme colors
- **Circular imports:** None — vanilla JS with no imports except Lenis + GSAP (both externs).
- **Scroll behavior:** Lenis hijacks native scroll, preventing use of `scroll-behavior: smooth` or `window.scrollY` reading. Always use Lenis methods.
- **Animation timeline:** GSAP ScrollTrigger animations and IntersectionObserver triggers may overlap. Ensure proper z-index isolation to avoid visual conflicts.
- **Mobile responsiveness:** Tailwind breakpoints (sm, md, lg) drive layout shifts. No JavaScript-based breakpoint detection needed unless custom behavior required.

## Anti-Patterns

### Using `scroll-behavior: smooth` alongside Lenis

**What happens:** CSS smooth scroll conflicts with Lenis RAF loop, causing jank or no animation.
**Why it's wrong:** Lenis already provides smooth scroll via RAF interpolation; CSS smooth scroll runs in parallel.
**Do this instead:** Remove `scroll-behavior: smooth` from stylesheet. Delegate all scroll to Lenis.scrollTo() in `index.js:82-94`.

### Blocking DOM reads/writes during scroll

**What happens:** IntersectionObserver or scroll listeners perform heavy computations (e.g., recalculate layout), causing frame drops.
**Why it's wrong:** Scroll events fire ~60fps; blocking operations starve the event loop.
**Do this instead:** Use RAF batching (e.g., flag-based deferred updates). Reference `index.js:131-140` navbar scroll state pattern.

### Mixing RAF-based and CSS-based animations

**What happens:** RAF counters or GSAP tweens interpolate while CSS `@keyframes` run, causing jank if not synchronized.
**Why it's wrong:** Two animation engines stepping at different intervals.
**Do this instead:** Use GSAP for all timeline-driven motion. Reserve CSS `@keyframes` for simple loops (shine-text, marquee) that don't interact with user input.

### Not debouncing window resize

**What happens:** Resize listener fires many times, recalculating navbar height or magic card positions excessively.
**Why it's wrong:** Layout thrashing (repeated reflow).
**Do this instead:** Use RAF debouncing (flag-based, like `rafId` in navbar code) or setTimeout with 200ms+ delay.

## Error Handling

**Strategy:** Silent degradation. No JS alerts or console errors exposed to user.

**Patterns:**
- Missing DOM elements: Check with `document.getElementById()`, skip if null (e.g., navbar script: `if (navWrapper) { ... }`)
- Failed external scripts: GSAP or Lenis fallback to vanilla CSS animations (fade-in still works via IntersectionObserver)
- Smooth scroll fallback: If Lenis unavailable, anchor clicks fall back to native scroll (no href preventDefault)

## Cross-Cutting Concerns

**Logging:** 
- Dev: Optional `console.log()` calls in IIFE scopes (remove before deploy)
- Prod: No logging (Sentry/Datadog integration to be added)

**Validation:** 
- Form inputs (if contact form exists): Client-side Tailwind validation classes + server-side on backend
- Data attributes: No validation; assume correct from HTML authoring

**Authentication:** 
- Landing page is public (no auth required)
- "Create account" CTAs link to backend signup endpoint (out of scope for LP)

**Accessibility:** 
- Semantic HTML (`<header>`, `<nav>`, `<section>`, `<footer>`)
- ARIA labels on buttons + icon buttons
- Keyboard navigation for mobile menu (esc to close, tab through nav links)
- Color contrast checked against WCAG AA (Tailwind default palette)
- alt text on all images

---

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

**Phase 1: Splash Screen (Already Done)**
- Splash animation already uses GSAP 3.12.5 (referenced in `index.html:9`)
- Keep as-is; no changes needed

**Phase 2: Hero Section Reveals**
Replace IntersectionObserver fade-in for hero elements:

**Before (IntersectionObserver):**
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
```

**After (GSAP ScrollTrigger):**
```javascript
gsap.registerPlugin(ScrollTrigger);

gsap.to('.hero-badge, .hero-title, .hero-sub, .hero-ctas, .hero-dash', {
  scrollTrigger: {
    trigger: '.hero-section',
    start: 'top 80%',
    end: 'top 20%',
    toggleActions: 'play none none reverse'
  },
  opacity: 1,
  y: 0,
  duration: 0.7,
  stagger: 0.1,
  ease: 'power2.out'
});
```

**Phase 3: Counters**
Replace RAF countup with GSAP snap utility:

**Before:**
```javascript
function runCountUp(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1800;
  const start = performance.now();
  // ... RAF tick loop
}
```

**After:**
```javascript
gsap.to('[data-count]', {
  scrollTrigger: {
    trigger: '[data-count]',
    start: 'top 80%',
    once: true // only run once per element
  },
  textContent: el => parseInt(el.dataset.count, 10),
  duration: 2.0,
  snap: { textContent: 1 }, // snap to integer
  ease: 'power2.out'
});
```

**Phase 4: Navbar Scroll State**
Convert RAF scroll listener to GSAP:

**Before:**
```javascript
window.addEventListener('scroll', () => {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    applyNavState(window.scrollY > 80);
  });
}, { passive: true });
```

**After:**
```javascript
gsap.to('#navbar-wrapper', {
  scrollTrigger: {
    trigger: 'body',
    start: 'top 80px',
    toggleClass: 'scrolled'
  }
});

// In index.html, use CSS [data-scrolled="true"] or .scrolled class instead of style.setProperty
```

**Phase 5: Bento Cards & Marquee**
- **Magic card glow:** Keep JS mousemove listener (CSS vars are lightweight)
- **Marquee:** Convert to GSAP timeline if needs scroll interactivity; keep CSS if static loop

**Phase 6: Staggered Reveals (Platform Section)**
Replace transition-delay pattern with GSAP batch:

**Before:**
```html
<div class="plat-item" style="transition-delay: 0ms">...</div>
<div class="plat-item" style="transition-delay: 80ms">...</div>
```

**After:**
```javascript
gsap.to('.plat-item', {
  scrollTrigger: {
    trigger: '#platform',
    start: 'top 80%'
  },
  opacity: 1,
  y: 0,
  duration: 0.52,
  stagger: 0.08,
  ease: 'power2.out'
});
```

### Benefits

1. **Unified animation engine:** All motion driven by GSAP timeline, easier to debug + sync
2. **Advanced features:** Timeline sequencing, yoyo animations, morphing SVG, advanced easing
3. **Performance:** GSAP optimizes transforms (uses `will-change` internally), avoids layout thrashing
4. **ScrollTrigger power:** Scrubbing, progress markers, parallax, sticky sections without custom scroll listeners
5. **Developer experience:** Single API for all animations (tweens, timelines, triggers)

### Rollout Strategy

1. Add GSAP ScrollTrigger to `index.html:9` (already GSAP; add ScrollTrigger)
2. Create `src/js/animations/` directory for modular animation setups
3. Convert animations one section at a time (hero → counters → navbar → marquee)
4. A/B test against old version (optional feature flag)
5. Remove IntersectionObserver once all animations migrated (keep as fallback)
6. Measure performance: CLS (Cumulative Layout Shift), FCP (First Contentful Paint)

---

*Architecture analysis: 2026-06-16*
