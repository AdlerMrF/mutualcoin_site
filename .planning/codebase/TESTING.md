# Testing Patterns

**Analysis Date:** 2026-06-16

## Current State: No Automated Tests

**Observation:** All reference LPs (`lp-otc-mutual`, `lp-mutual-capital`, `front-nextjs-lpmutual`) are static or near-static landing pages with no test frameworks, unit tests, integration tests, or E2E test automation. This is standard for Vite-based static/marketing sites focused on visual performance and SEO.

**What exists:**
- Manual visual inspection during development
- Browser DevTools for debugging
- Lighthouse CLI or browser audit tools for performance validation
- No test runner configured (no Jest, Vitest, Playwright, etc.)

**What doesn't exist:**
- Unit tests (no test framework)
- Component snapshot tests
- Integration tests
- E2E tests with Playwright/Cypress
- Test coverage metrics
- CI/CD test gates (in repository context)

---

## Recommended QA Strategy for Mutual Advisory

Since the Advisory LP is a performance-critical, animation-heavy landing page targeting advisory/institutional partners, apply a **manual + automated performance + accessibility validation** approach:

### 1. Visual QA (Manual)

**When to validate:**
- After any Tailwind style changes
- After animation/hero entrance modifications
- After responsive breakpoint adjustments
- Before pushing to staging/production

**Checklist:**
- [ ] Hero entrance animations play smoothly (no jank, 60fps)
  - Test on: Chrome, Firefox, Safari, Edge
  - Devices: Desktop (1920×1080), laptop (1366×768), tablet (768×1024), mobile (375×667)
- [ ] Dark mode colors consistent across all sections
  - Verify: Text contrast meets WCAG AA (4.5:1 minimum)
  - Check background gradients load correctly
- [ ] Card hover effects (magic glow, scale) work smoothly
  - Mouse tracking updates in real time (`.magic-card` glow)
  - No lag on scale transforms
- [ ] Responsive layout reflow at breakpoints
  - sm (640px), md (768px), lg (1024px), xl (1280px)
  - No horizontal scroll on mobile
  - Navbar pill animation triggers correctly on scroll
- [ ] Navigation (desktop pill + mobile dropdown) is accessible
  - Links are keyboard-navigable
  - Mobile menu closes on item click
- [ ] Image lazy loading works (no layout shift)
  - Check `loading="lazy"` attributes on `<img>` tags
  - Verify no CLS (Cumulative Layout Shift)

**Tools:**
- Chrome DevTools (Lighthouse, Performance tab, responsive device emulation)
- Firefox DevTools (accessibility inspector, element inspector)
- Real device testing (iPhone, Android, iPad)

**Reference Files for Manual Testing:**
- `lp-otc-mutual/index.html` — Hero entrance, bento grid, fade-in on scroll
- `lp-mutual-capital/index.html` — Navbar pill behavior, floating cards, multi-section layout
- `front-nextjs-lpmutual/src/app/globals.css` — Dark mode tokens, animation definitions

---

### 2. Lighthouse Performance Audit

**Why:** Landing pages must be fast. Institutional visitors (advisory partners) expect <2s load time, <3s interaction.

**Key Metrics to Monitor:**
- **LCP (Largest Contentful Paint):** < 2.5s (target: <2s)
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **FCP (First Contentful Paint):** < 1.8s
- **Time to Interactive:** < 3.5s

**How to Test:**
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit (Vite dev build)
lighthouse https://localhost:5173 --view

# Run audit (production build)
lighthouse https://advisorylp.mutual.app.br --view

# Generate HTML report
lighthouse https://localhost:5173 --output-path=./lighthouse-report.html
```

**What to Check:**
- [ ] No render-blocking resources (CSS, JS) on critical path
- [ ] Images are optimized (WebP, correct size, lazy-loaded)
- [ ] No unused CSS (Tailwind should tree-shake unused classes)
- [ ] JavaScript bundle is minimal (inline GSAP for splash screen acceptable)
- [ ] Font loading is non-blocking (font-display: swap recommended)
- [ ] No Third-party scripts blocking render (analytics defer, tracking pixel async)

**Performance Bottlenecks to Watch:**
- Splash screen SVG animation (`gsap` library) — Keep lightweight
- Magic card mouse tracking (`.magic-card` JS) — Throttle event listeners, use requestAnimationFrame
- Scroll animation triggers (Intersection Observer) — Cache element queries
- Large background images or gradients — Use CSS gradients where possible, lazy-load PNG/WebP

**Remediation Priority:**
1. LCP > 2.5s — Optimize hero image (compress, resize, lazy-load if below fold)
2. FCP delayed — Check for render-blocking CSS or fonts
3. CLS issues — Add explicit `width`/`height` to images, reserve space for animations

**Reference Metric Targets (for Mutual brand):**
- Desktop: LCP ≤ 2.0s, CLS ≤ 0.08, Performance ≥ 90
- Mobile: LCP ≤ 2.5s, CLS ≤ 0.1, Performance ≥ 85

---

### 3. Accessibility Validation

**Why:** Landing page must be navigable by screen readers and keyboard-only users. WCAG 2.1 Level AA compliance required for institutional audience.

**Automated Checks (use axe DevTools or similar):**
- [ ] All images have alt text (including decorative blobs, gradients — can use `aria-hidden="true"`)
- [ ] Headings follow logical order (h1 → h2 → h3, no skipped levels)
- [ ] Color contrast ≥ 4.5:1 for normal text, ≥ 3:1 for large text
- [ ] Form inputs (if any) have associated labels
- [ ] Interactive elements are keyboard-accessible (Tab order, no keyboard traps)
- [ ] ARIA attributes used correctly (`aria-label`, `aria-hidden`, `role` when needed)
- [ ] No flickering content (animations should not flash >3x per second)

**Manual Keyboard Navigation:**
```
1. Open page
2. Press Tab repeatedly through entire page
3. Verify: Focus indicators visible, logical order, no hidden traps
4. Press Shift+Tab to reverse
5. Press Enter on buttons/links — should activate
```

**Screen Reader Testing (VoiceOver, NVDA, JAWS):**
- [ ] Hero section announced clearly (h1, badge description)
- [ ] Navigation links announced with purpose
- [ ] Cards announced as groups (semantic `<article>` or `role="region"`)
- [ ] Feature lists (badges with checks) announced as list items
- [ ] Floating animations don't disrupt reading (aria-live regions should be minimal)

**Reference Accessibility Files:**
- `lp-mutual-capital/index.html` (lines 1–100) — Navbar with ARIA labels (`aria-label`)
- `lp-otc-mutual/index.html` (line 236) — Badge with aria-hidden on decorative dot

**Tools:**
- axe DevTools (Chrome/Firefox extension)
- Lighthouse Accessibility audit
- WAVE (WebAIM)
- MacOS VoiceOver (System Preferences → Accessibility)
- NVDA (free, Windows screen reader)

---

### 4. Responsive Design Validation

**Viewport Breakpoints (Tailwind Mutual standard):**
- **Mobile (default):** 320–639px (focus: text-[28px]–text-[34px] headings, single column)
- **Small (sm):** 640–767px (intermediate sizing)
- **Medium (md):** 768–1023px (tablet layout, 2-column grids)
- **Large (lg):** 1024–1279px (3-column grids, desktop spacing)
- **XL (xl):** 1280px+ (max-width container applies)

**Test Devices:**
- iPhone SE (375×667) — extreme mobile
- iPhone 12 (390×844) — modern mobile
- iPad (768×1024) — tablet portrait
- iPad Pro (1024×1366) — tablet landscape
- Desktop (1920×1080), (1366×768) — laptop/desktop

**Manual Test Checklist:**
- [ ] Hero section fits viewport (no overflow, text readable)
- [ ] Navigation adapts: desktop nav visible lg+, mobile menu visible md and below
- [ ] Bento grid reflows: 1 col (mobile) → 2 col (md) → 3 col (lg)
- [ ] Feature cards scale appropriately (px values, not fixed widths)
- [ ] Spacing increases responsively (py-16 sm:py-20 lg:py-28)
- [ ] Images scale without distortion (use `object-contain`, `object-cover` appropriately)
- [ ] Buttons/CTAs have adequate tap target (min 48×48px on mobile)
- [ ] Text remains readable (min 14px on mobile, 16px preferred)

**Common Responsive Issues in Reference LPs:**
- Image masks (hero image with mask-image gradient) — verify on mobile browsers (Safari can have issues)
- Fixed navbar — verify doesn't overlay text on mobile
- Floating cards with absolute positioning — verify don't overflow on small screens
- Gradient backgrounds (blur effects) — may cause performance issues on low-end mobile devices

---

### 5. Cross-Browser Testing

**Target Browsers (Mutual audience skews enterprise/institutional):**
- Chrome/Chromium ≥ 90 (85% of traffic)
- Safari ≥ 14 (10% of traffic, mostly macOS/iOS)
- Firefox ≥ 88 (3% of traffic)
- Edge ≥ 90 (2% of traffic)

**Key Features to Test Per Browser:**
1. **CSS Gradients** — All browsers support, but Safari may handle `backdrop-filter: blur()` differently
2. **Backdrop Filter (glass card effect)** — Verify Safari support (use -webkit prefix)
3. **SVG animations** — GSAP stroke animation (line draw) works cross-browser
4. **CSS Masks** — Hero image mask-image may not work in Safari; test fallback visibility
5. **CSS Variables** — Supported in all modern browsers; verify dark mode tokens apply
6. **`object-fit` / `object-cover`** — Standard, but verify on iOS Safari
7. **`scrollbar-width` / `::-webkit-scrollbar`** — Custom scrollbar implementation; Firefox may ignore webkit rules

**Quick Test Flow:**
```
1. Open https://localhost:5173
2. Check hero entrance (animation smooth, text visible)
3. Scroll down, check fade-in animations trigger
4. Hover over cards (glow effect, shadow)
5. Test mobile menu (desktop → mobile width)
6. Check form inputs (if any) focus states
```

**Tools for Cross-Browser Testing:**
- BrowserStack (paid, real devices)
- LambdaTest (paid)
- Local VM + Safari, Firefox (free, limited)
- Chrome DevTools mobile emulation (good baseline, not a replacement for real devices)

---

### 6. Animation & Performance Validation

**What to Monitor:**
- Hero splash screen — Should complete in <3s, GSAP animation smooth
- Fade-in on scroll — Should not block main thread (60fps)
- Magic card glow — Mouse tracking should be throttled (check for 16ms frame drops)
- Responsive transforms (card hover, scale) — No jank, instant feedback

**DevTools Performance Profiling:**
```
1. Chrome DevTools → Performance tab
2. Record a few seconds of interaction (hover cards, scroll, navigate)
3. Check:
   - Main thread blocking? (red bars = bad)
   - Frame rate (should be 60fps, not dropping below 30fps)
   - Longest tasks (should be <50ms)
4. Check Runtime Performance (record ~30s of scrolling):
   - Recalculate style: should be <5ms per frame
   - Update layout: should be <5ms per frame
   - Paint: should be <2ms per frame
```

**Animation Files to Audit:**
- `lp-otc-mutual/src/assets/css/styles.css` (lines 121–208) — keyframes definitions
- Magic card JS handler (throttle mousemove to ~60fps)
- Scroll trigger logic (use IntersectionObserver, not scroll event polling)

---

### 7. SEO Validation (for institutional reach)

**Meta Tags to Verify:**
- [ ] `<title>` is present and descriptive (40–60 chars)
- [ ] `<meta name="description">` present (120–160 chars)
- [ ] `<meta name="viewport">` set to `width=device-width, initial-scale=1.0`
- [ ] Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`) for social sharing
- [ ] Structured data (JSON-LD for Organization, Product, or BreadcrumbList)

**Heading Structure:**
- [ ] Single `<h1>` per page (Advisory LP hero headline)
- [ ] Logical h2 → h3 progression (no h3 before h2)
- [ ] All section headings present and descriptive

**URL Structure:**
- [ ] Clean, semantic URLs (if multi-page: `/advisory`, `/pricing`, etc.)
- [ ] No trailing slashes inconsistency
- [ ] Canonical link present (if mirrored across domains)

**Tools:**
- Google Search Console (submit sitemap, check indexability)
- Screaming Frog (crawl site, check meta, headings, structure)
- Lighthouse SEO audit

---

## Implementation Approach for Mutual Advisory LP

**Phase 1: Pre-Development**
1. Establish baseline Lighthouse score on `front-nextjs-lpmutual` (reference)
2. Set performance targets for Advisory LP (e.g., LCP ≤ 2.0s)
3. Define accessibility compliance level (WCAG 2.1 AA minimum)

**Phase 2: Development**
- Use Lighthouse DevTools during development (check every few commits)
- Test animations on real devices (not just desktop Chrome)
- Validate responsive layout at every breakpoint
- Accessibility: Use axe DevTools as you build

**Phase 3: Pre-Launch**
1. Full Lighthouse audit (desktop + mobile)
2. Manual visual QA across browsers (Chrome, Safari, Firefox)
3. Keyboard navigation test (Tab through entire page)
4. Screen reader audit (VoiceOver on macOS, NVDA on Windows)
5. Real device testing (min: iPhone, iPad, Android phone)

**Phase 4: Post-Launch Monitoring**
- Monitor Core Web Vitals via Google Analytics / Search Console
- Set up alerts if LCP > 2.5s or CLS > 0.1
- Monthly Lighthouse audit run
- User feedback on performance/usability

---

## Testing Tools & Setup

**Recommended Stack for Mutual Advisory:**

| Tool | Purpose | Cost | Setup |
|------|---------|------|-------|
| Chrome DevTools (built-in) | Visual QA, performance profiling, responsive testing | Free | Built into Chrome |
| Lighthouse CLI | Batch performance audits, CI/CD integration | Free | `npm install -g lighthouse` |
| axe DevTools | Accessibility scanning | Free | Chrome/Firefox extension |
| VoiceOver (macOS) | Screen reader testing | Free | System Preferences → Accessibility |
| NVDA (Windows) | Screen reader testing | Free | https://www.nvaccess.org/ |
| BrowserStack | Cross-browser real device testing | Paid (30+ devices) | https://www.browserstack.com/ |
| Sentry (optional) | Error tracking, performance monitoring | Free tier available | Add SDK to globals.css or layout |

**CI/CD Integration (optional, if using GitHub Actions):**
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse
on: [pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: npm/npm-github-action@v1
      - run: npm ci
      - run: npm run build
      - run: npx lighthouse https://localhost:8000 --output-path=./report.html
      - uses: actions/upload-artifact@v2
        with:
          name: lighthouse-report
          path: ./report.html
```

---

## Summary

**Mutual Advisory Landing Page QA:**
- **No automated unit/E2E tests** — Not typical for marketing landing pages
- **Manual visual QA** — Essential, browser+device coverage
- **Lighthouse performance** — Critical, set hard targets (LCP ≤ 2.0s)
- **Accessibility compliance** — WCAG 2.1 AA (keyboard nav, contrast, ARIA, screen reader tested)
- **Responsive design** — Test all breakpoints (320px–1920px+)
- **Cross-browser** — Chrome, Safari, Firefox, Edge (focus on Safari for CSS quirks)
- **Animation performance** — Profile with DevTools, ensure 60fps, throttle JS event handlers

**Next Steps:**
1. Copy CONVENTIONS.md patterns into Vite project
2. Build Advisory LP with Tailwind + Vite
3. Run Lighthouse on hero section (target LCP < 1.5s)
4. Validate accessibility with axe DevTools
5. Test on 2–3 real devices before launch
6. Monitor real-user performance post-launch

---

*Testing strategy established: 2026-06-16 | Validated against reference LPs (`lp-otc-mutual`, `lp-mutual-capital`, `front-nextjs-lpmutual`)*
