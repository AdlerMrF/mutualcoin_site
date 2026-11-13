# Coding Conventions

**Analysis Date:** 2026-06-16

## Design System: Dark Mode Consolidated

The Mutual Advisory landing page uses a unified dark design system pulled from existing LPs (`lp-otc-mutual`, `lp-mutual-capital`, `front-nextjs-lpmutual`). All colors, typography, spacing, shadows, and component patterns are predefined via CSS variables and reusable utility classes.

### Color Palette (CSS Variables)

**Dark Background:**
- `--dark-bg: #0C1220` — Primary background for all sections
- `--hero-bg: #0E162E` — Hero section overlay / gradient base
- `--card-bg: #111D35` — Secondary card backgrounds (nested)

**Borders & Dividers:**
- `--border: #1B2A46` — Primary border color for all cards, separators, dividers
- Hover states often use `rgba(30, 52, 144, 0.12)` or `rgba(255, 255, 255, 0.07)` for subtle glow

**Text:**
- `--text-heading: #EEF1F9` — Primary text for headings, labels, UI copy
- `--text-muted: #8898C0` — Secondary text for descriptions, meta info

**Accent Colors:**
- `--primary-color: #FCB71B` — Gold brand accent (buttons, badges, icons)
- `--primary-hover: #e5a618` — Darker gold for hover states
- `--brand-blue: #1E3490` — Feature icons, secondary accents

**Additional Accents:**
- Cyan: `#11CFFA` — Transient accent in gradients
- Light Blue: `#3B82F6` / `#3556CD` — Primary blue (context7 docs accent)

**Reference Files:**
- `lp-otc-mutual/src/assets/css/styles.css` (lines 9–19) — Primary color definitions
- `front-nextjs-lpmutual/src/app/globals.css` (lines 144–168) — Dark mode token layer

### Typography

**Font Family:**
- Primary: `Montserrat` (wght: 400, 500, 600, 700, 800, 900)
- Fallback: `Inter` (for body copy in some sections — see notes below)
- Applied via: `font-family: 'Montserrat', sans-serif` in HTML `<style>` tag or CSS

**Font Stacks:**
- Most sections: `'Montserrat', sans-serif`
- Body/description text (in some sections): `font-family: 'Inter', sans-serif` (style attribute override)
- Reference: `lp-mutual-capital/index.html` line 17 uses both fonts, with context-specific overrides

**Heading Scale (Responsive):**

| Level | Mobile (sm) | Tablet (md) | Desktop (lg) | Weight | Example File |
|-------|-----------|-----------|-----------|--------|--------------|
| **h1** | `text-[34px]` | `text-[44px]` sm:`text-[44px]` md:`text-[54px]` | `text-[64px]` lg:`text-[64px]` | 500/600 | `lp-otc-mutual/index.html` line 245 |
| **h2** | `text-[28px]` | `text-[36px]` | `text-[42px]` lg:`text-[40px]` | 600/700 | `lp-mutual-capital/index.html` line 292 |
| **h3** | `text-[17px]` | `text-[18px]` | `text-[20px]` | 500/600 | `lp-otc-mutual/index.html` line 316 |
| **Body (hero)** | `text-[17px]` | `text-[19px]` | `text-[19px]` | 500/600 | `lp-otc-mutual/index.html` line 250 |
| **Body (standard)** | `text-[15px]` | `text-[15px]` | `text-[15px]` | 400/500 | `lp-mutual-capital/index.html` line 295 |
| **Small/meta** | `text-[13px]` | `text-[13px]` | `text-[13px]` | 400/500 | `lp-otc-mutual/index.html` line 237 |

**Line Height Convention:**
- Headings: `leading-[1.04]` to `leading-[1.1]` (tight, for visual density)
- Body text: `leading-[1.65]` (generous, for readability)
- Small text: `leading-[1.6]` (tight-to-generous)

**Letter Spacing:**
- Headings: `tracking-[-0.04em]` to `tracking-[-0.02em]` (negative, tightened)
- Body: `tracking-tight` or default (no override)
- Uppercase meta: `tracking-widest` (usually `tracking-[0.12em]` equivalent)

**References:**
- `lp-otc-mutual/index.html` lines 245–250 — h1 with shine-text variant, responsive scale
- `lp-mutual-capital/index.html` lines 289–297 — h2 with eyebrow badge + body text

### Spacing

**Section Padding (Vertical):**
- Hero: `pt-16 pb-0 sm:pt-20 md:pt-24` (stacked, no bottom padding)
- Standard sections: `py-20 sm:py-24 lg:py-32` (symmetric, increases on desktop)
- Dense sections: `py-16 sm:py-20 lg:py-28`

**Container Max Width:**
- `max-w-[1250px]` — Standard container (used across all LPs)
- Applied with `mx-auto` for centering

**Padding around container:**
- Mobile: `px-4` (16px total)
- Small: `px-6` (24px total)
- Medium: `sm:px-6 lg:px-8` or `sm:px-8 lg:px-10`
- Large: `sm:px-10 lg:px-16 xl:px-24`

**Grid Gaps:**
- Cards grid: `gap-4` (16px, mobile) → `gap-6` (24px, tablet) → `gap-10` (40px, desktop)
- Component groups: `gap-2` to `gap-5` (context-dependent)

**References:**
- `lp-otc-mutual/index.html` line 233–280 — Hero padding and spacing
- `lp-mutual-capital/index.html` lines 284–298 — Bento grid section with section spacing

### Border Radius

**Card Radius:**
- Large cards: `rounded-2xl` (16px)
- Small/button cards: `rounded-[10px]` (10px)
- Badge/pill: `rounded-full` (50%)
- Icon container: `rounded-lg` (8px) or `rounded-xl` (12px)

**Consistent Radii:**
- `rounded-2xl` — Primary card containers, sections, overlays
- `rounded-xl` — Secondary buttons, medium cards, feature icons
- `rounded-[10px]` — CTA buttons (consistent Mutual button style)
- `rounded-full` — Badge pills, small badges, checkmarks in rings

**References:**
- `lp-otc-mutual/src/assets/css/styles.css` line 33 — scrollbar radius
- `lp-otc-mutual/index.html` lines 304–322 — Bento cards with rounded-2xl + magic-card

### Shadows

**Gold Glow (Primary CTA):**
- `shadow-[0_4px_14px_rgba(252,183,27,0.32)]` — Standard CTA button shadow
- `shadow-[0_4px_14px_rgba(252,183,27,0.3)]` — Mobile variation
- Hover: `shadow-[0_6px_20px_rgba(252,183,27,0.42)]` or remove glow

**Card Shadows:**
- `shadow-2xl` or explicit `shadow-[0_20px_40px_rgba(252,183,27,0.2)]` — On hover
- `box-shadow: inset 0 0 0 1px #1B2A46` — Subtle border-only
- Floating card (glass): `box-shadow: 0 8px 32px rgba(0,0,0,0.08)`

**Drop Shadows (Images):**
- Hero image: `filter: drop-shadow(0 20px 56px rgba(53,86,205,0.25))`
- Subadquirencia image: `filter: drop-shadow(0 24px 48px rgba(53,86,205,0.10))`

**Magic Card Glow:**
- Inner: `radial-gradient(...rgba(30, 52, 144, 0.12)...)` centered at `--mouse-x/y`
- Border: `rgba(80, 110, 220, 0.95)` with mask composite for edge-only glow
- Applied via JS hook `.magic-card` on card elements

**References:**
- `lp-otc-mutual/src/assets/css/styles.css` lines 40–78 — Magic card pseudo-element effect
- `lp-otc-mutual/index.html` line 110 — Hover shadow on card-hover

### Gradients

**Text Gradients (Shine Effect):**
- Primary: `linear-gradient(135deg, #a8c0ff 0%, #1E3490 50%, #11CFFA 100%)`
  - Applied via: `.shine-text { background-clip: text; -webkit-text-fill-color: transparent; }`
- Modern/multi-gradient: `linear-gradient(90deg, #3556CD 0%, #3556CD 38%, #a8c0ff 50%, #3556CD 62%, #3556CD 100%)`
  - Animated via: `animation: shine 6s ease-in-out infinite`

**Background Gradients:**
- Gold gradient (button): `linear-gradient(135deg, #FCB71B 0%, #e5a618 100%)`
- Hero bottom fade: `linear-gradient(to top, #0E1628 0%, rgba(14,22,40,0.92) 32%, rgba(14,22,40,0.15) 62%, rgba(14,22,40,0) 100%)`

**Gradient Backgrounds (Decorative):**
- Radial blue: `rgba(30, 52, 144, 0.12)` with `blur-[100px]`
- Radial cyan: `rgba(17, 207, 250, 0.08)` with `blur-[80px]`

**References:**
- `lp-otc-mutual/src/assets/css/styles.css` lines 85–102 — Shine and gradient text
- `lp-otc-mutual/index.html` lines 224–230 — Decorative gradient blobs
- `front-nextjs-lpmutual/src/app/globals.css` lines 89–104 — Dual shine-text (light + dark)

### Animations

**Entrance Animations:**
- **Hero Stagger:** Each element has a delayed `heroEnter` keyframe (0.6–0.9s duration)
  - Delays: badge 2.10s, title 2.26s, sub 2.42s, ctas 2.56s, image 2.72s
  - Effect: `opacity 0 → 1`, `translateY 28px → 0`, `blur(8px) → 0`
  - Easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`

- **Fade In on Scroll:** `.fade-in` class for sections below hero
  - Enters from: `opacity: 0; transform: translateY(30px)`
  - Visible state: `opacity: 1; transform: translateY(0)`
  - Transition: `opacity 0.8s ease-out, transform 0.8s ease-out`
  - Triggered via: Intersection Observer in JavaScript hook

- **Platform Items Stagger:** `.plat-item` and `.plat-widget`
  - Plat items: `opacity 0 → 1`, `translateY(22px) → 0`, duration 0.52s, staggered via style attribute delays
  - Plat widget: `opacity 0 → 1`, `translateX(32px) → 0`, duration 0.6s

- **Floating Animation:** Hero image and floating cards
  - `.hero-image { animation: float 8s ease-in-out infinite }`
  - `translateY(0px) → -8px → 0px` at 0%, 50%, 100%

**Hover Effects:**
- **Card hover:** `transform: translateY(-8px)`, `box-shadow: 0 20px 40px rgba(252,183,27,0.2)`
  - Icon inside: `transform: scale(1.1)`
  - Transition: `all 0.3s ease`

- **Link/CTA hover:** Text color change, border glow (on outline buttons)
  - `hover:bg-[#152038]` (secondary fill)
  - `hover:border-[#1E3490]/60` (blue tint)
  - `transition-colors` or `transition-all duration-200`

**Transition Timing:**
- Standard UI: `transition-colors` 200ms or 300ms
- Scale/transform: `transition-all 0.3s ease`
- Navbar pill animation: 380ms `cubic-bezier(0.4,0,0.2,1)` (more snappy)

**References:**
- `lp-otc-mutual/src/assets/css/styles.css` lines 121–155 — fadeIn, heroEnter, float keyframes
- `lp-otc-mutual/src/assets/css/styles.css` lines 173–208 — plat-item stagger + plat-visible class
- `lp-otc-mutual/index.html` lines 236–242 — hero-badge/title/sub/ctas with hero-* class hooks

### Component Patterns

#### Badge / Eyebrow
```html
<span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1B2A46] bg-[#0D1525] text-[#8898C0] text-[13px] font-medium">
  <span class="w-1.5 h-1.5 rounded-full bg-[#FCB71B] inline-block"></span>
  Badge text
</span>
```
- Pill container with small gold dot indicator
- Applied: `.hero-badge` for animation hook
- Reference: `lp-otc-mutual/index.html` line 236

#### Card (Magic Card with Glow)
```html
<div class="group relative magic-card lg:col-span-2 border border-[#1B2A46] rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/[0.07] hover:shadow-[0_4px_20px_rgba(0,0,0,0.22)]">
  <!-- Overlay gradients -->
  <img src="..." alt="..." class="absolute inset-0 w-full h-full object-cover object-top">
  <div class="absolute inset-0" style="background:linear-gradient(...)"></div>
  <!-- Number label -->
  <div class="absolute top-4 right-4 text-[11px] font-semibold tabular-nums text-white/30 group-hover:text-white/60 transition-colors duration-300 z-10">01</div>
  <!-- Content -->
  <div class="relative z-10 flex flex-col justify-end h-full p-6">
    <!-- Icon -->
    <!-- Title + description -->
    <!-- CTA link -->
  </div>
</div>
```
- `.magic-card` applies JS-driven glow on mouse enter
- Border hover effect: `hover:border-white/[0.07]`
- Number at top-right: `group-hover:text-white/60` (increases opacity)
- Reference: `lp-otc-mutual/index.html` lines 304–323

#### Button (CTA — Primary Gold)
```html
<a href="#" class="inline-flex items-center justify-center gap-2 bg-[#FCB71B] text-[#0C1220] px-7 py-3.5 rounded-[10px] text-[15px] font-semibold hover:bg-[#e5a618] transition-colors duration-200 shadow-[0_4px_14px_rgba(252,183,27,0.32)]">
  Button text
  <svg>...</svg>
</a>
```
- Gold background: `#FCB71B`
- Hover: `#e5a618`
- Shadow: `[0_4px_14px_rgba(252,183,27,0.32)]`
- Rounded: `rounded-[10px]`
- Reference: `lp-otc-mutual/index.html` line 257

#### Button (Secondary Outline)
```html
<a href="#" class="inline-flex items-center justify-center gap-2 bg-transparent text-[#EEF1F9] px-7 py-3.5 rounded-[10px] text-[15px] font-semibold border border-[#1B2A46] hover:border-[#1E3490]/60 hover:bg-[#1E3490]/8 transition-all duration-200">
  Button text
</a>
```
- Transparent fill, border-only
- Hover: Blue tint `hover:border-[#1E3490]/60` + `hover:bg-[#1E3490]/8`
- Reference: `lp-otc-mutual/index.html` line 262

#### Navbar (Fixed, Pill on Scroll)
```html
<header id="navbar-header" class="fixed top-0 left-0 right-0 z-50">
  <div id="navbar-wrapper" class="flex items-stretch w-full" style="transition: padding 380ms cubic-bezier(0.4,0,0.2,1);">
    <div id="navbar-left" class="flex-1 min-w-0"></div>
    <div id="navbar-center" class="shrink-0 w-full border border-transparent overflow-hidden" 
         style="max-width:1280px; border-radius:0; transition: ...">
      <!-- Logo, nav links, CTA -->
    </div>
    <div id="navbar-right" class="flex-1 min-w-0"></div>
  </div>
  <!-- Mobile menu dropdown -->
</header>
```
- Fixed positioning, z-50
- Transforms to pill (border-radius, box-shadow) on scroll via JS
- Mobile menu: `border-radius: rounded-2xl`, `backdrop-blur-md`
- Reference: `lp-mutual-capital/index.html` lines 146–219

#### Feature Check (with icon)
```html
<div class="flex items-start gap-2.5">
  <div class="w-4 h-4 rounded-full bg-[#FCB71B]/15 border border-[#FCB71B]/35 flex items-center justify-center flex-shrink-0 mt-0.5">
    <svg xmlns="..." width="9" height="9" fill="#FCB71B" viewBox="..."><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/></svg>
  </div>
  <div>
    <p class="text-[13px] font-semibold text-[#EEF1F9] leading-snug">Feature title</p>
    <p class="text-[12px] text-[#8898C0]">Description.</p>
  </div>
</div>
```
- Gold ring container with white check
- Applied to feature lists in cards
- Reference: `lp-otc-mutual/index.html` lines 333–350

### JavaScript Hook Classes

**Animation/Visibility Hooks:**
- `.fade-in` — Triggers on scroll, enters with fade + translateY
- `.fade-in.visible` — Class added when in viewport
- `.hero-badge`, `.hero-title`, `.hero-sub`, `.hero-ctas`, `.hero-dash` — Staggered hero entrance
- `.hero-image` — Floating animation
- `.plat-item` — Platform section stagger (0.52s transition per item)
- `.plat-item.plat-visible` — Adds transform when visible
- `.plat-widget` — Alternate stagger direction (translateX instead of Y)
- `.plat-widget.plat-visible` — Applies transform

**Component Hooks:**
- `.magic-card` — Mouse-tracking glow effect (requires JS to update `--mouse-x`, `--mouse-y`)
- `.card-hover` — Hover transform + shadow (group parent)
- `.group-hover:*` — Used with `.card-hover` for child scale transforms
- `.feature-icon` — Scales on parent `.card-hover:hover`
- `.animate-fade-in` — Keyframe-based entrance (direct animation, not scroll-based)
- `.mobile-menu-link`, `.nav-link` — Mobile/desktop nav item hooks for state

**Navbar Hooks:**
- `#navbar-header`, `#navbar-wrapper`, `#navbar-center`, `#navbar-inner` — Scroll JS targets
- `#navbar-logo` — Logo element, opacity animated on splash completion
- `#mobile-menu-button` — Mobile menu toggle
- `#mobile-menu` — Mobile dropdown (toggled hidden/shown)

**References:**
- `lp-otc-mutual/src/assets/css/styles.css` lines 174–208 — `.fade-in`, `.plat-item` class definitions
- `lp-otc-mutual/index.html` lines 236–279 — Hero element class applications (`.hero-badge`, etc.)

### Naming Conventions

**CSS Variable Naming:**
- Color tokens: `--dark-bg`, `--hero-bg`, `--card-bg`, `--border`, `--text-heading`, `--text-muted`
- Accent colors: `--primary-color`, `--primary-hover`, `--brand-blue`
- All lowercase, hyphen-separated, descriptive

**Tailwind Class Usage:**
- Responsive prefixes: `sm:`, `md:`, `lg:`, `xl:` (mobile-first)
- Arbitrary values: `text-[34px]`, `px-[10px]`, `bg-[#FCB71B]`, `rounded-[10px]`
- Opacity modifiers: `/[0.07]`, `/60`, `/15`, `/[0.12]`
- State modifiers: `hover:`, `group-hover:`, `active:`, `focus:`

**Component Class Names:**
- Card: `.magic-card`, `.feature-bento-card`, `.func-card`
- Animation triggers: `.fade-in`, `.hero-*`, `.plat-item`, `.plat-widget`
- Mobile-specific: `.mobile-menu-link`, `.mobile-card-border`
- No heavy BEM nesting; rely on groups (`.group`, `.group-hover:*`)

**File Organization:**
- Styles: `src/assets/css/styles.css` (single consolidated file)
- Structure: Import `@tailwind base/components/utilities`, then define custom classes
- Responsive: Inline media queries `@media (max-width: 768px)` where needed

---

*Conventions analyzed: 2026-06-16 | Reviewed from `lp-otc-mutual`, `lp-mutual-capital`, `front-nextjs-lpmutual`*
