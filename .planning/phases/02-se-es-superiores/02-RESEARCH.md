# Phase 2: Seções Superiores - Research

**Researched:** 2026-06-16
**Domain:** Copy-faithful HTML/CSS section porting + GSAP ScrollTrigger reveals on a Vite vanilla LP (dark re-theming of a light/serif source)
**Confidence:** HIGH

## Summary

Phase 2 ports the seven top-of-page content sections of the Mutual Advisory landing page from the approved source `../mutual advisory site v4.html` (light/cream Georgia-serif theme) into the consolidated dark-navy design system already established in Phase 1. There are **no external packages to install** — GSAP 3.15.0 and Lenis 1.3.23 are already installed, the design-system CSS variables and reusable utilities (`.magic-card`, `.card-hover`, `.fade-in`) already live in `src/assets/css/styles.css`, and the motion engine (Lenis + GSAP/ScrollTrigger with `scrollerProxy` on `document.body`) is already initialized in `index.js`. This is a pure HTML-authoring + CSS-theming + GSAP-wiring phase. `nyquist_validation` is `false`, so no test infrastructure section is required.

The work is fully deterministic: every string, value, card count and ordering is fixed in v4.html and mapped to exact line ranges below. The only genuine design freedom is (a) how the light/serif visual treatment maps to the dark Montserrat tokens, and (b) the precise GSAP reveal parameters (durations/stagger), which must follow the Phase 1 "private bank / conservative" motion philosophy (D-08). The two motion requirements — MOT-01 (reveal on scroll, `ScrollTrigger.batch`) and MOT-02 (counter count-up) — both have a canonical reference implementation in the sibling LPs and a documented GSAP-native path.

**Primary recommendation:** Author all 7 sections as static HTML inside the existing `<main>` (inserting 4 NEW sections in correct DOM order and filling 3 existing empty anchors), styled directly with the dark Tailwind utility classes used in Phase 1 (no `var(--cream)`/Georgia carryover). Wire reveals with a single `ScrollTrigger.batch('[data-reveal]', …)` pass and the stats counters with a `gsap.to(el, { textContent, snap, scrollTrigger })` pattern guarded for non-numeric values (NDA / 24h / +40). Add the missing `.magic-card` mousemove listener once, scoped to the sections that use the glow.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Section markup (stats, manifesto, positioning, solutions, profiles, jurisdictions, global presence) | HTML (`index.html`) | — | Static declarative content; no framework, no data fetching (LP estática) |
| Dark re-theming (color, type, spacing) | CSS (Tailwind utilities + `styles.css`) | HTML (class bindings) | Visual layer; tokens already defined as CSS vars |
| Reveal-on-scroll (MOT-01) | JS (`index.js` — GSAP ScrollTrigger) | CSS (initial hidden state / reduced-motion fallback) | Motion orchestration owned by the JS layer per ARCHITECTURE.md |
| Counter count-up (MOT-02) | JS (`index.js` — GSAP/RAF) | HTML (`data-*` attributes carry target/suffix) | Animation logic in JS; metadata in HTML data attributes |
| Magic-card interactive glow | JS (mousemove → CSS vars) + CSS (`::before`/`::after`) | — | CSS renders glow; JS feeds `--mouse-x/--mouse-y` (listener currently MISSING — see Pitfall 4) |

All capabilities live entirely in the client tier (no backend) — consistent with PROJECT.md "100% client-side".

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| GSAP | 3.15.0 (installed) | Reveal-on-scroll + counter animations | `[VERIFIED: node_modules/gsap/package.json]` — phase motion engine, already registered with ScrollTrigger in `index.js` |
| GSAP/ScrollTrigger | 3.15.0 (bundled with gsap) | Viewport-based triggers, `batch()` staggered reveals | `[VERIFIED: node_modules]` + `[CITED: context7.com/greensock/gsap]` — `ScrollTrigger.batch` confirmed current API |
| Lenis | 1.3.23 (installed) | Smooth scroll; drives ScrollTrigger via `scrollerProxy(document.body)` | `[VERIFIED: node_modules/lenis/package.json]` — already initialized; do NOT add a second instance |
| Tailwind CSS | 3.4.19 (installed) | Utility classes for all section styling | `[VERIFIED: package.json]` — purge content already includes `index.html` + `index.js` |

**No new packages are required for Phase 2.** This phase adds zero dependencies.

### Supporting
| Asset | Purpose | When to Use |
|-------|---------|-------------|
| `src/assets/css/styles.css` existing utilities | `.magic-card`, `.card-hover`, `.feature-icon`, `.fade-in`/`.visible`, `.shine-text`, `.gradient-text` | Reuse on cards/sections; do not redefine |
| Font Awesome 6.4.0 (CDN, already linked) | Optional iconography for solution/profile cards | If cards need icons beyond the inline SVGs used in the hero authority strip |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `ScrollTrigger.batch` | Per-element `gsap.from({scrollTrigger})` | batch is more performant for many siblings (cards/lines) and produces natural grouped stagger; per-element is simpler but creates one ST instance per node — heavier on the 12 jurisdiction cards |
| GSAP `gsap.to(textContent, {snap})` counter | RAF `easeOutExpo` loop (sibling-LP pattern) | Both valid. GSAP keeps everything in one engine and respects the GSAP ticker/Lenis co-op; RAF loop is the proven group pattern (`lp-otc-mutual/index.js` lines 11-47). Either is acceptable; prefer GSAP for engine consistency. **Both need special handling for non-numeric values (NDA, 24h, +40).** |
| IntersectionObserver reveals (sibling pattern) | GSAP ScrollTrigger | Project decision (Roadmap, MOT-01) is to standardize on GSAP ScrollTrigger and replace IntersectionObserver+CSS. Use ScrollTrigger. |

**Installation:** None. (`npm install` already satisfied; verify with `npm run dev`.)

## Package Legitimacy Audit

> Not applicable — Phase 2 installs **zero** external packages. All dependencies (gsap 3.15.0, lenis 1.3.23, tailwindcss 3.4.19) were installed and audited in Phase 1 and are already present in `node_modules`. No registry interaction occurs in this phase.

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

## Architecture Patterns

### System Architecture Diagram (Phase 2 data/render flow)

```
index.html  (static authored markup)
   │
   ├─ <main>
   │    ├─ #hero                         [Phase 1 — exists]
   │    ├─ [NEW] stats strip (6 counters) ─── data-count/data-suffix ──┐
   │    ├─ [NEW] #manifesto (6 lines)                                  │
   │    ├─ [NEW] #position (do/dont split)                            │
   │    ├─ #solutions   [empty anchor → fill] (6 cards + parceria)    │
   │    ├─ #profiles    [empty anchor → fill] (6 cards)               │
   │    ├─ #icp         [empty anchor — Phase 3, leave]               │
   │    ├─ #jurisdictions [empty anchor → fill] (12 cards + "+rede")  │
   │    ├─ [NEW] global presence band (9 tags)                        │
   │    ├─ #technology  [empty anchor — Phase 3, leave]               │
   │    ├─ #how / #contact [empty anchors — Phase 3/4, leave]         │
   │
   └─ index.js  (motion layer, runs after DOMContentLoaded)
        ├─ Lenis ──drives──> GSAP ticker ──> ScrollTrigger.update      │
        ├─ ScrollTrigger.scrollerProxy(document.body)  [exists]        │
        ├─ [NEW] ScrollTrigger.batch('[data-reveal]', {onEnter:stagger})│
        ├─ [NEW] counter triggers (gsap.to textContent + snap) <───────┘
        └─ [NEW] magic-card mousemove listener (feeds --mouse-x/y)
```

Render order: browser parses static HTML → CSS paints dark theme immediately (no FOUC; elements start visible, reveal animates from a `gsap.set`/`from` hidden state set in JS) → Lenis+ScrollTrigger fire reveals as sections enter viewport.

### Recommended DOM Order (CRITICAL — matches v4.html ordering)

v4.html source order between hero and technology:

| # | v4.html lines | Section | Target in `index.html` |
|---|---------------|---------|------------------------|
| 1 | 564–615 | hero | `#hero` — exists (Phase 1) |
| 2 | **617–645** | **Authority Numbers Strip** (SEC-02, 6 stats) | **INSERT NEW** immediately after `</section>` of `#hero` (currently line 162) |
| 3 | **647–684** | **Manifesto** (SEC-03) | **INSERT NEW** `<section id="manifesto">` after stats strip |
| 4 | **687–731** | **Positioning** (SEC-04, `id="position"`) | **INSERT NEW** `<section id="position">` after manifesto |
| 5 | 734–853 | Solutions (SEC-05) | **FILL** existing `<section id="solutions">` (line 163) |
| 6 | 856–959 | Profiles (SEC-06) | **FILL** existing `<section id="profiles">` (line 164) |
| 7 | — | (`#icp` exists, empty) | LEAVE EMPTY — Phase 3 |
| 8 | 962–1133 | Jurisdictions (SEC-07) | **FILL** existing `<section id="jurisdictions">` (line 166) |
| 9 | **1135–1158** | **Global Presence Band** (SEC-08, 9 tags) | **INSERT NEW** after `</section>` of `#jurisdictions` |
| 10 | — | (`#technology`, `#how`, `#contact` empty) | LEAVE EMPTY — Phase 3/4 |

**Note on the `#icp` ordering exception:** In the *current* `index.html` the empty anchors are ordered `#solutions, #profiles, #icp, #jurisdictions, #technology, #how, #contact` (lines 163–169). In v4.html, ICP comes *after* jurisdictions/technology (line 1316), not between profiles and jurisdictions. The Phase 1 anchor order is a navbar/scroll-spy convenience and does not need to match v4 source order for Phase 2 — fill `#solutions`, `#profiles`, `#jurisdictions` in place and leave `#icp` empty between them. The newly inserted stats/manifesto/position sections go *before* `#solutions`; the global-presence band goes *after* `#jurisdictions`. Verify the visual top-to-bottom result reads: hero → stats → manifesto → positioning → solutions → profiles → (icp placeholder) → jurisdictions → global presence.

### Pattern 1: Reveal on scroll — `ScrollTrigger.batch` (MOT-01)
**What:** Stagger-reveal groups of sibling elements (cards, manifesto lines, do/dont items, tags) as they enter the viewport.
**When to use:** Every repeating group in Phase 2 (6 sol-cards, 6 prof-cards, 12 jur-cards, 6 manifesto lines, do/dont lists, 9 presence tags).
**Example (verified current API):**
```javascript
// Source: [CITED: context7.com/greensock/gsap] ScrollTrigger.batch
gsap.set('[data-reveal]', { opacity: 0, y: 24 });   // initial hidden state (set in JS, not CSS, to avoid FOUC concerns)
ScrollTrigger.batch('[data-reveal]', {
  start: 'top 85%',
  interval: 0.08,        // group elements entering within 80ms
  batchMax: 6,           // cap per stagger group (good for the 12-card jurisdictions grid)
  onEnter: (batch) => gsap.to(batch, {
    opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', stagger: 0.07, overwrite: true
  }),
  // conservative: do not reverse on leave (advisory tone) — content stays revealed
});
```
Notes: Because `ScrollTrigger.scrollerProxy(document.body, …)` is already bound to Lenis in `index.js`, new triggers default to the body scroller automatically — do not pass an explicit `scroller`. Call `ScrollTrigger.refresh()` once after all section markup + triggers are created (Phase 1 already calls it at the end of `index.js` — keep a single final refresh).

### Pattern 2: Counter count-up — GSAP textContent + snap (MOT-02)
**What:** Animate numeric stats from 0 → target when the strip enters the viewport.
**When to use:** SEC-02 stats strip only.
**Critical:** Of the 6 stats, **only 3 are purely numeric** (`6`, `28`, `16`). The other 3 are non-numeric or prefixed: `+40` (numeric with `+` prefix), `NDA` (text), `24h` (numeric with `h` suffix). Drive count-up only on numeric content and render the prefix/suffix separately, or skip animation for `NDA`.
**Example:**
```javascript
// Numeric-only counter; prefix/suffix carried as data attributes
// HTML: <span class="stat-num" data-count="40" data-prefix="+">+40</span>
//       <span class="stat-num" data-count="24" data-suffix="h">24h</span>
//       <span class="stat-num" data-static>NDA</span>   (no animation)
gsap.utils.toArray('.stat-num[data-count]').forEach((el) => {
  const target = +el.dataset.count;
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const obj = { v: 0 };
  gsap.to(obj, {
    v: target, duration: 1.4, ease: 'power1.out',
    snap: { v: 1 },
    onUpdate: () => { el.textContent = prefix + Math.round(obj.v) + suffix; },
    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
  });
});
```
Alternative: reuse the sibling-LP RAF `easeOutExpo` pattern (`lp-otc-mutual/index.js` lines 11–47) which already handles `suffix` and `format=dot` via data attributes — but it uses IntersectionObserver, which the project is migrating away from. Prefer the GSAP version for engine consistency.

### Pattern 3: Card components — reuse existing utilities
**What:** Solution/profile/jurisdiction cards reuse the established dark card pattern.
**Example structure (Tailwind, dark tokens):**
```html
<!-- Card container -->
<div data-reveal class="group magic-card card-hover bg-[#111D35] border border-[#1B2A46] rounded-2xl p-6 hover:border-white/[0.07]">
  <div class="text-[11px] font-semibold tabular-nums text-white/30 group-hover:text-white/60 transition-colors">01</div>
  <h3 class="text-[18px] lg:text-[20px] font-semibold text-[#EEF1F9] leading-snug mt-3">…título…</h3>
  <p class="text-[14px] text-[#8898C0] leading-[1.65] mt-2">…desc…</p>
</div>
```
`.magic-card` + `.card-hover` already exist in `styles.css` (lines 42–120). The number-at-top-right + `group-hover` pattern is documented in CONVENTIONS.md §Card.

### Anti-Patterns to Avoid
- **Carrying over v4 inline styles:** v4 uses `var(--cream)`, `var(--ink)`, `var(--gold)` (`#C4A35A`), `'Georgia',serif`, `'Segoe UI'`, and `%`-based `5vw` padding. **None of these may survive the port.** Replace with dark tokens + Montserrat + the Phase-1 spacing scale. Do not copy `style="…"` attributes verbatim from v4.
- **`scroll-behavior: smooth` in CSS:** Forbidden — conflicts with Lenis (STATE.md Blocker, ARCHITECTURE.md §Anti-Patterns). All scroll via `lenis.scrollTo`.
- **A second Lenis instance / second `requestAnimationFrame(lenis.raf)` loop:** `index.js` already drives Lenis through the GSAP ticker. Do not re-init.
- **Reversing reveals on scroll-back:** The conservative advisory tone (D-08) calls for content that arrives and stays. Use `once`-style or non-reversing `onEnter` only; avoid flicker on up-scroll.
- **Animating `opacity` from CSS `.fade-in` AND GSAP simultaneously on the same node:** pick one source of truth per element (GSAP for Phase 2 reveals).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Staggered multi-card reveal | Manual per-card IntersectionObserver + setTimeout delays | `ScrollTrigger.batch` | Handles grouping, intervals, and batching of 12 cards in one call; integrates with Lenis co-op |
| Count-up tween | Custom RAF + easing math from scratch | `gsap.to({v}, {snap, onUpdate})` (or reuse sibling RAF helper) | Easing, snapping, and trigger already solved; both reference impls exist |
| Smooth anchor scroll to new sections | New scroll handler | Existing `a[href^="#"]` Lenis handler in `index.js` (lines 131–143) | Already wired with nav+authority offset; new sections "just work" once IDs match |
| Card glow | New glow CSS | Existing `.magic-card` `::before`/`::after` (styles.css 42–84) | Already in the bundle; only the JS mousemove feeder is missing (add once) |
| Hover lift | New transition rules | Existing `.card-hover` (styles.css 105–112) | Already defined |

**Key insight:** Phase 1 already shipped the entire motion + card-styling toolkit. Phase 2 should write almost no new CSS — it composes existing utilities and authors markup + a small amount of reveal/counter wiring.

## Runtime State Inventory

> Not a rename/refactor/migration phase. This is additive content authoring.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — static LP, no datastore | None — verified by PROJECT.md ("100% client-side", "sem backend") |
| Live service config | None | None — verified, no external services |
| OS-registered state | None | None |
| Secrets/env vars | None | None — verified, no `.env`, no secrets in repo |
| Build artifacts | `dist/` exists from a prior `vite build`; will be regenerated | None blocking — `vite build` re-emits; not load-bearing for this phase |

## Exact Copy Map (source of truth: `../mutual advisory site v4.html`)

> Copy must be ported **word-for-word**. Line ranges are authoritative. Do NOT paraphrase. Strip all v4 inline styles/fonts/colors and re-theme to dark.

### SEC-02 — Authority Numbers Strip (v4 lines 617–645)
NOT a `<section>` in v4 (a bare `<div>`); insert as a NEW band after `#hero`. **6 stats, in this exact order, with these exact values and labels:**

| # | Value | Label (exact, v4 capitalization) | Counter behavior |
|---|-------|----------------------------------|------------------|
| 1 | `+40` | Jurisdições Mapeadas | numeric 40, prefix `+` |
| 2 | `6` | Pilares de Inteligência | numeric 6 |
| 3 | `28` | Perfis de Cliente | numeric 28 |
| 4 | `16` | Módulos Mutual Capital | numeric 16 |
| 5 | `NDA` | Confidencialidade por Padrão | static (no count-up) |
| 6 | `24h` | Resposta Garantida | numeric 24, suffix `h` |

⚠️ **`+40` here ≠ hero's `+30`.** The hero authority strip (Phase 1, kept at 4 items) uses `+30 Jurisdições mapeadas`; the stats strip uses `+40 Jurisdições Mapeadas`. Also note the stats strip uses Title Case ("Jurisdições Mapeadas"); the hero used sentence case ("Jurisdições mapeadas"). Preserve the v4 stats-strip capitalization exactly.

### SEC-03 — Manifesto (v4 lines 647–684)
- Eyebrow: `Manifesto`
- Title (3 lines, `<br>`, last line `<em>`): `O sistema financeiro global foi construído` / `para quem já tem tudo estruturado.` / `<em>Nós existimos para estruturar.</em>`
- **6 numbered lines (01–06)**, each `<span class="m-n">NN</span>` + paragraph with a leading `<strong>` lead sentence. Full text at v4 lines 657–680 (port verbatim, including the bold lead of each line).
- Closing line (`m-close`): `— Mutual Advisory · Inteligência Patrimonial para o Mundo Real`

### SEC-04 — Positioning (v4 lines 687–731, `id="position"`)
Split layout. Left column:
- Eyebrow `O que somos`; h2 `Inteligência que <em>executa via especialistas.</em>`; divider; paragraph (v4 lines 693–699, verbatim).
Right column — two lists:
- **"O que fazemos" — 8 items** (v4 706–713): Diagnóstico de estrutura patrimonial atual · Mapeamento de jurisdições e instrumentos · Recomendação de estruturas adequadas ao perfil · Análise de exposição tributária e regulatória · Conexão com especialistas parceiros para execução · Monitoramento contínuo de obrigações regulatórias · Integração com infraestrutura Mutual Capital · Dashboard de estruturas, documentos e alertas
- **"O que não fazemos" — 7 items** (v4 719–725): Não somos escritório de advocacia · Não assinamos documentos jurídicos · Não administramos patrimônio de terceiros · Não somos consultores de investimentos (CVM) · Não atuamos como trustee ou administrador · Não garantimos resultados tributários · Não operamos contas ou ativos dos clientes

(REQUIREMENTS.md SEC-04 says "8 itens ✓ / 7 itens —" — matches v4 exactly: 8 do, 7 don't.)

### SEC-05 — Solutions (v4 lines 734–853)
- Eyebrow `Soluções`; h2 `Seis pilares de <em>inteligência patrimonial.</em>`; divider; lead (v4 738).
- **"Parceria Estratégica" seal block** (v4 740–776): label `Parceria Estratégica`, title `Escritório de Advocacia e Tributário com Alcance Global`, paragraph (verbatim 761–765), side stat `+40 Jurisdições`. 🤝 emoji present (give `aria-hidden` / decorative role for a11y).
- **6 numbered cards** (`sol-num` 01–06), each with `sol-title` + `sol-sub` + `sol-desc` + a 🤝 partner-note footer line. Exact text per card at v4 780–850. Titles in order: 01 Estruturação Patrimonial Internacional · 02 Blindagem Patrimonial · 03 Expansão Empresarial Global · 04 Planejamento Sucessório Internacional · 05 Conformidade e Regulatório Internacional · 06 Ativos Digitais e Web3 Patrimonial.

### SEC-06 — Profiles (v4 lines 856–959)
- Intro: eyebrow `Perfis de Acesso`; h2 `Seis perfis. Cada um construído para um nível de <em>complexidade patrimonial.</em>`; divider; lead (861). 
- Note block (`prof-note`, v4 864).
- **6 cards**, each: `prof-badge` (Perfil 01–06) · `prof-name` · `prof-ideal` · `prof-desc` · `prof-features` (`<ul>`, last item begins `<strong>Tecnologia:</strong>`) · `prof-tech` ("Ideal para: <strong>…</strong>"). Names in order: 01 Essencial · 02 Estruturado · 03 Internacional · 04 Institucional · 05 Patrimonial Premium · 06 Ativos Digitais. Feature-list lengths vary (Essencial has 5; verify each per v4 873–955). Port verbatim including `<strong>` emphasis.

### SEC-07 — Jurisdictions (v4 lines 962–1133, `id="jurisdictions"`)
- Eyebrow `Jurisdições`; h2 `Mais de <em>30 jurisdições mapeadas.</em>`; divider; intro note (`jur-note`, v4 966–968, verbatim incl. `<strong>`).
- **12 cards** (`jur-card`), each: `jur-region` · `jur-name` · `jur-classes` (multiple `<span class="jclass">` tags) · `jur-uses` (`<ul>`, 3–4 `<li>`) · `jur-note-card`. Card names in order: Dubai — UAE · Ilhas Virgens Britânicas (BVI) · Ilhas Cayman · Malta · Singapura · Delaware e Wyoming — EUA · Portugal · El Salvador · Suíça — Zug · Jersey e Guernsey · Liechtenstein e Panamá · Holanda, Irlanda e Chipre. (Note: some cards cover multiple jurisdictions — exactly 12 cards total, `grep -c` confirmed.)
- **"rede além das 12" block** (`jur-more`, v4 1130–1132): the long paragraph beginning `<strong>Nossa rede vai muito além das jurisdições acima.</strong>` listing 40+ praças — port verbatim.

### SEC-08 — Global Presence Band (v4 lines 1135–1158)
NOT a `<section>` in v4 (bare `<div>`); insert NEW band after `#jurisdictions`.
- Eyebrow (with leading dash line): `Cobertura Global · Rede de Especialistas`
- Paragraph (v4 1142–1143, verbatim).
- **9 tags** (exact order): América do Sul · América do Norte · Europa Ocidental · Europa Central · Oriente Médio · Ásia-Pacífico · Caribe e Offshore · Atlântico Norte · África · Emergentes · **+40 Jurisdições disponíveis** (the 9th tag is the gold-highlighted one). That is 8 region tags + 1 gold "+40" tag = **9 tags total** — matches SEC-08.

## Dark Re-Theming Map (light/serif v4 → dark Montserrat)

| v4 source treatment | v4 value | Dark replacement (Phase-1 tokens) |
|---------------------|----------|-----------------------------------|
| `var(--cream)` / `var(--cream2)` / `var(--cream3)` / `var(--white)` backgrounds | light beige/white | `#0C1220` (`--dark-bg`) sections; `#111D35` (`--card-bg`) cards; `#0D1525` for subtle bands/strips |
| `var(--moss)` (global presence band bg) | dark olive | `#0E162E`/`#0C1220` band on dark; keep tag border `rgba(238,241,249,.15)` analog → `border-[#1B2A46]` |
| `var(--ink)` / `var(--ink3)` text | near-black / grey | `#EEF1F9` (`--text-heading`) for titles; `#8898C0` (`--text-muted`) for body/meta |
| `var(--gold)` accent | `#C4A35A` (muted gold) | `#FCB71B` (`--primary-color`) — the brand gold. Replace ALL `--gold` refs incl. the 🤝 partner notes, eyebrows, stat numbers, `<em>` emphasis |
| `var(--border)` / `var(--border2)` | light hairlines | `#1B2A46` (`--border`) |
| `font-family:'Georgia',serif` (titles, stat numbers, manifesto, big text) | serif | Montserrat (the global `* { font-family:'Montserrat' }` already covers it — just remove the inline serif overrides) |
| `font-family:'Segoe UI',system-ui` (meta/body) | system sans | Montserrat (remove override) |
| `5vw` horizontal padding | viewport % | `px-4 sm:px-6 lg:px-8` inside `max-w-[1250px] mx-auto` (Phase-1 container) |
| section vertical padding (`90px`, `60px`, `48px`, `28px` ad hoc) | px | `py-20 sm:py-24 lg:py-32` (standard) / `py-16 sm:py-20 lg:py-28` (dense bands like stats/presence) |
| `border-radius:4px/6px` ad hoc | small | `rounded-2xl` (cards) / `rounded-[10px]` (small) / `rounded-full` (pills/tags) per CONVENTIONS |
| eyebrow `.ey` uppercase tracked | serif/segoe | `text-[13px] font-semibold uppercase tracking-[0.12em] text-[#FCB71B]` (gold) or `text-[#8898C0]` per Phase-1 eyebrow pattern |

**Contrast (AA) guidance (from UI-SPEC):** `#EEF1F9` on `#0C1220` = 14.6:1 (AAA); `#FCB71B` on `#0C1220` = 7.5:1 (AAA); `#8898C0` on `#0C1220` = 3.8:1 — **AA for large text only (≥14px/≥18.66px bold)**. Body copy at 14–15px in `#8898C0` passes AA large-text but is borderline for normal text; keep descriptive body at ≥14px and prefer `#8898C0` only for meta/secondary. For dense paragraph copy consider a slightly lighter muted (`#A9B6D6`, already used in the hero sub) to stay safely AA.

## Existing Reusable Assets (do not rebuild)

| Asset | Location | Status |
|-------|----------|--------|
| `.magic-card` glow (`::before`/`::after`, mask trick) | `styles.css` 42–84 | Present; CSS-only static UNTIL a mousemove listener feeds `--mouse-x/y` |
| `.card-hover` + `.feature-icon` hover lift/scale | `styles.css` 105–120 | Present, ready |
| `.fade-in` / `.fade-in.visible` | `styles.css` 139–148 | Present (CSS fallback) |
| `.shine-text` / `.gradient-text` | `styles.css` 87–103 | Present |
| `.nav-link-active` (scroll-spy) | `styles.css` 176–179 | Present — new sections with matching IDs auto-participate in scroll-spy (already wired in `index.js` 154–162) |
| Anchor smooth-scroll handler | `index.js` 131–143 | Present — covers any `a[href^="#"]` |
| ScrollTrigger + Lenis co-op + `scrollerProxy(document.body)` | `index.js` 6–33 | Present — new triggers inherit the body scroller |
| Container/spacing/type tokens | UI-SPEC.md | Authoritative design contract |

**Magic-card mousemove listener is MISSING** (see Pitfall 4) — `index.js` has no `.magic-card` mousemove handler (sibling `lp-otc-mutual/index.js` 49–65 shows the canonical implementation scoped to a section). The hero's `.magic-card` authority strip therefore currently shows no interactive glow. If Phase 2 cards should glow on hover, add ONE listener (scoped per-section or document-level).

## Common Pitfalls

### Pitfall 1: Confusing `+40` (stats) with `+30` (hero)
**What goes wrong:** Porting the hero's `+30` into the stats strip, or vice-versa.
**Why:** Both are "Jurisdições" stats with similar labels; the hero strip was reduced/edited in Phase 1.
**How to avoid:** Stats strip (SEC-02) = `+40 Jurisdições Mapeadas` (Title Case, v4 line 621). Hero = `+30 Jurisdições mapeadas` (kept from Phase 1). Treat them as independent. STATE.md and the Phase-1 SUMMARY both flag this explicitly.
**Warning sign:** Two "+40/+30 jurisdições" stats reading the same number after the port.

### Pitfall 2: Counter animation breaking on non-numeric values
**What goes wrong:** Running count-up on `NDA`, `+40`, `24h` produces `NaN`, drops the prefix/suffix, or animates "NDA" to 0.
**How to avoid:** Only tween the numeric core; carry `+` and `h` as `data-prefix`/`data-suffix` and re-concatenate in `onUpdate`; mark `NDA` `data-static` and skip it (see Pattern 2).
**Warning sign:** Stats showing `NaN`, `40` without `+`, or `NDA` flashing `0`.

### Pitfall 3: FOUC / flash of un-revealed content (success-criterion 4 explicitly forbids "flash de conteúdo não estilizado")
**What goes wrong:** If elements start visible and JS later hides-then-reveals, there is a visible flash; if hidden only via CSS and GSAP fails, content stays invisible.
**How to avoid:** Set the hidden start state with `gsap.set('[data-reveal]', {opacity:0, y:24})` at the top of the reveal wiring (runs synchronously before paint of below-fold content), and keep `.fade-in` CSS as a non-conflicting fallback only on elements GSAP does NOT control. Add a `prefers-reduced-motion` guard (see Pitfall 5). Do NOT hide content with a CSS rule that has no JS counterpart.
**Warning sign:** Cards flicker on load, or stay blank if a script errors.

### Pitfall 4: `.magic-card` glow is inert without a JS listener
**What goes wrong:** Authoring cards with `.magic-card` expecting a mouse-tracking glow; nothing happens because no JS updates `--mouse-x/--mouse-y`.
**Why:** `index.js` currently has zero `.magic-card` mousemove handlers (verified). The CSS `::before`/`::after` default `--mouse-x/y` to `-999px` (off-screen) → no visible glow.
**How to avoid:** Either (a) add the canonical listener (port from `lp-otc-mutual/index.js` 49–65, scoping the section container queried), or (b) accept static cards and rely on `.card-hover` lift + `hover:border-white/[0.07]` only. Decide explicitly per the design intent. If glow is wanted across multiple new sections, attach a single document-level `mousemove` that updates all `.magic-card` vars (mind performance with 12+ cards — throttle or scope to `:hover`).
**Warning sign:** Cards look flat on hover despite the `.magic-card` class.

### Pitfall 5: Motion ignoring `prefers-reduced-motion`
**What goes wrong:** No reduced-motion path; the consolidated `styles.css` currently has NO `@media (prefers-reduced-motion)` guard (the Phase-1 SUMMARY mentioned guards but they are not in the file — verified). a11y requirement QLT-03.
**How to avoid:** Wrap reveal/counter wiring in a `matchMedia('(prefers-reduced-motion: reduce)')` check — if reduced, `gsap.set` everything to its final state (`opacity:1,y:0`, counters to final value) and skip tweens.
**Warning sign:** Animations play for users who requested reduced motion.

### Pitfall 6: DOM weight from the heavy grids (jurisdictions = 12 cards × ~7 nodes; profiles = 6 × feature lists)
**What goes wrong:** Performance dips / layout jank (QLT-02 LCP < 2.5s, CLS < 0.1).
**Why:** STATE.md flags DOM weight as the #1 risk for the long page.
**How to avoid:** Keep markup lean (no redundant wrappers), use `batchMax` in `ScrollTrigger.batch` so reveals don't all fire at once, and set explicit no-CLS layout (grids with defined gaps). The truly heavy block (28 ICP cards) is Phase 3 (MOT-04 lazy reveal) — Phase 2's jurisdictions grid (12) is moderate; batch reveal is sufficient.
**Warning sign:** Long task warnings on scroll into jurisdictions; CLS from late-loading reveal shifts.

### Pitfall 7: `ScrollTrigger.refresh()` timing with Lenis
**What goes wrong:** Triggers measure positions before all section markup is laid out → reveals fire at wrong scroll positions.
**How to avoid:** Create all section triggers, then call a single `ScrollTrigger.refresh()` after DOM is complete (Phase 1 already calls it at end of `index.js` — keep exactly one, last). Avoid multiple scattered refreshes.
**Warning sign:** Reveals firing too early/late, or not at all on first load.

## Code Examples

### Magic-card mousemove listener (port + scope to Phase-2 sections)
```javascript
// Source: [VERIFIED: lp-otc-mutual/index.js lines 49-65] — adapted, document-scoped
function bindMagicCards(scope = document) {
  scope.querySelectorAll('.magic-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', '-999px');
      card.style.setProperty('--mouse-y', '-999px');
    });
  });
}
bindMagicCards();
```

### Reduced-motion-safe reveal wiring
```javascript
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduce) {
  gsap.set('[data-reveal]', { opacity: 1, y: 0 });
  // also set counters to final text directly
} else {
  gsap.set('[data-reveal]', { opacity: 0, y: 24 });
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 85%', interval: 0.08, batchMax: 6,
    onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', stagger: 0.07, overwrite: true }),
  });
}
```

## State of the Art

| Old Approach (sibling LPs) | Current Approach (this project) | When Changed | Impact |
|----------------------------|----------------------------------|--------------|--------|
| IntersectionObserver + `.fade-in.visible` for reveals | `ScrollTrigger.batch` | Roadmap decision (MOT-01) | Single engine, grouped stagger, Lenis co-op |
| RAF `easeOutExpo` + IntersectionObserver counters | GSAP `gsap.to({v},{snap,scrollTrigger})` | MOT-02 | Engine consistency; `.fade-in` kept as fallback only |
| Light/cream Georgia-serif identity (v4.html) | Dark navy + Montserrat tokens | PROJECT.md identity decision | Full re-theme; v4 inline styles dropped |

**Deprecated/outdated:**
- v4.html inline `style="…"` with `var(--cream/ink/gold)`, Georgia, Segoe UI, `5vw` — replaced by dark tokens + Tailwind utilities. Do not port.
- `@keyframes heroEnter` / IntersectionObserver reveal path — superseded by GSAP (kept only as silent fallback).

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Magic-card interactive glow is *desired* on Phase-2 cards (vs. accepting static `.card-hover` only) | Pitfall 4 / Don't Hand-Roll | Low — cosmetic; planner/user should confirm whether to add the listener |
| A2 | Reveals should NOT reverse on scroll-back (content stays revealed) per conservative tone | Pattern 1 / Anti-Patterns | Low — easily flipped via `toggleActions`; matches D-08 intent |
| A3 | Stats counter uses GSAP (not the sibling RAF helper) for engine consistency | Pattern 2 | Low — both produce identical UX; either acceptable |
| A4 | `#icp` stays empty and the Phase-1 anchor order (icp before jurisdictions) is kept rather than reordered to match v4 | DOM Order | Low — visual order still reads correctly; reordering anchors would touch navbar/scroll-spy unnecessarily |
| A5 | `#8898C0` body copy stays ≥14px (AA large-text); denser paragraphs may use `#A9B6D6` for safety | Dark Re-Theming / Contrast | Medium — affects a11y (QLT-03); confirm during build with a contrast check |

## Open Questions

1. **Should the new stats strip and global-presence band be `<section>` elements or `<div>` bands?**
   - What we know: v4 authored both as bare `<div>`s (not sections); they have no nav anchor.
   - What's unclear: whether scroll-spy / nav should ever target them (they aren't in the 7 navbar links).
   - Recommendation: author as plain `<div>` bands (or `<section>` without an id that scroll-spy watches) so they don't interfere with the existing `section[id]` scroll-spy loop. Manifesto and Positioning DO have ids in v4 (`#manifesto` is not a navbar link; `#position` is not either) — give them ids for anchoring but note they aren't in the 7 nav links, so scroll-spy will simply never mark them active (harmless).

2. **Do the 🤝 emojis (solutions seal + per-card partner notes) stay as emoji or convert to an icon?**
   - What we know: v4 uses the literal 🤝 emoji; a11y requires `aria-label`/`aria-hidden` on decorative emojis (QLT-03).
   - Recommendation: keep the emoji (copy fidelity) but mark `aria-hidden="true"` (decorative). Confirm with user if an SVG icon is preferred for visual consistency with the dark theme.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Vite dev/build | ✓ (Phase 1 ran) | per `.nvmrc` (18/20 LTS) | — |
| gsap | MOT-01, MOT-02 | ✓ | 3.15.0 | — |
| lenis | smooth scroll co-op | ✓ | 1.3.23 | native scroll |
| tailwindcss | all styling | ✓ | 3.4.19 | — |
| `../mutual advisory site v4.html` (copy source) | all SEC-02..08 | ✓ | 1970 lines | none — load-bearing source of truth |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** none — all installed in Phase 1.

## Project Constraints (from CLAUDE.md)

- **Tech stack locked:** Vite + Tailwind + Lenis + GSAP/ScrollTrigger; mirror `lp-otc-mutual`/`lp-mutual-capital` (HTML monolítico + index.js). No React/Next.
- **Copy:** word-for-word from v4.html; **no rewriting**.
- **Identity:** dark navy (`#0C1220`, `#FCB71B`, `#111D35`, `#1B2A46`, `#EEF1F9`, `#8898C0`), Montserrat.
- **Performance is first-order:** fast load, LCP < 2.5s (QLT-02) — keep DOM lean.
- **Language:** PT only at launch.
- **clean-code skill:** strict scope (do exactly what's asked), no invention, KISS, no premature abstraction, no dead code, reuse existing utilities before creating new ones.
- **TypeScript strict / OWASP / a11y:** a11y (contrast AA, keyboard, aria on decorative icons/emojis) is the relevant cross-cutting rule for this phase (QLT-03). No backend/security surface in Phase 2.
- **GSD workflow enforcement:** edits must go through a GSD command (this phase is `/gsd-plan-phase` → execute).

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SEC-02 | Stats strip, 6 counters (+40, 6, 28, 16, NDA, 24h) | Exact values/labels/order mapped (v4 617–645); counter pattern + non-numeric handling (Pattern 2, Pitfall 2) |
| SEC-03 | Manifesto: eyebrow + title + 6 lines 01–06 + closing | Mapped verbatim (v4 647–684); 6 `m-line` confirmed by grep |
| SEC-04 | Positioning split: 8 "do" / 7 "don't" | Mapped verbatim (v4 687–731); counts confirmed |
| SEC-05 | Solutions: parceria seal + 6 cards w/ 🤝 | Mapped verbatim (v4 734–853); 6 `sol-card` confirmed |
| SEC-06 | Profiles: 6 cards (badge/ideal/features/tech) | Mapped verbatim (v4 856–959); 6 `prof-card` confirmed |
| SEC-07 | Jurisdictions: 12 cards + "rede além das 12" | Mapped verbatim (v4 962–1133); 12 `jur-card` confirmed; `jur-more` block mapped |
| SEC-08 | Global presence: text + 9 tags | Mapped verbatim (v4 1135–1158); 9 tags (8 regions + gold +40) confirmed |
| MOT-01 | Reveal on scroll via ScrollTrigger batch | Pattern 1 (`ScrollTrigger.batch`), API verified via Context7; FOUC/refresh pitfalls covered |
| MOT-02 | Counter count-up on viewport enter | Pattern 2 (GSAP textContent+snap or sibling RAF), non-numeric handling, reduced-motion guard |

## Security Domain

> `security_enforcement: true`, `security_asvs_level: 1`. Phase 2 has **no auth, no input, no data, no network, no crypto** — it adds static marketing content and client-side animation only. The relevant ASVS surface is essentially nil for this phase.

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | — (no auth in LP) |
| V3 Session Management | no | — (no sessions) |
| V4 Access Control | no | — (public page) |
| V5 Input Validation | no | — (no inputs in Phase 2; contact form is Phase 4) |
| V6 Cryptography | no | — (no crypto) |
| V14 Configuration | minor | External links use `target="_blank" rel="noopener noreferrer"` (already the Phase-1 convention); keep for any new outbound links in these sections |

### Known Threat Patterns for static LP content
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Reverse-tabnabbing via `target="_blank"` | Tampering | `rel="noopener noreferrer"` on external anchors (none expected in SEC-02..08, but apply if added) |
| DOM-based XSS | Tampering | N/A — all content is static authored HTML; no `innerHTML` from user/dynamic data. The counter `textContent` write (Pattern 2) is safe (uses `textContent`, not `innerHTML`, and writes numbers only) |

No high/blocking security findings for this phase.

## Sources

### Primary (HIGH confidence)
- `../mutual advisory site v4.html` lines 564–1158 — exact copy/values/structure for SEC-02..08 (read directly)
- `index.html`, `index.js`, `src/assets/css/styles.css` (current build) — existing anchors, motion init, reusable utilities (read directly)
- `lp-otc-mutual/index.js` lines 1–65 — IntersectionObserver reveal + RAF `easeOutExpo` counter + magic-card mousemove reference (read directly)
- `lp-mutual-capital/index.js` — counter/observer references (grepped)
- `node_modules/gsap/package.json` (3.15.0), `node_modules/lenis/package.json` (1.3.23) — installed versions
- `.planning/phases/01-foundation-shell-hero/01-UI-SPEC.md` — design contract (color/type/spacing/contrast)
- `.planning/STATE.md`, `ROADMAP.md`, `REQUIREMENTS.md`, `PROJECT.md`, `CONVENTIONS.md` — constraints, requirements, pitfalls

### Secondary (MEDIUM confidence)
- `[CITED: context7.com/greensock/gsap]` — `ScrollTrigger.batch` current API + `gsap.utils.snap`, confirms Pattern 1/2 are current

### Tertiary (LOW confidence)
- none

## Metadata

**Confidence breakdown:**
- Copy map (exact strings/values/line ranges): HIGH — read directly from v4.html; card counts grep-verified
- Standard stack: HIGH — versions verified in node_modules; zero new installs
- Architecture/patterns: HIGH — existing init read directly; ScrollTrigger.batch verified via Context7
- Dark re-theming: HIGH — tokens locked in UI-SPEC; contrast ratios from UI-SPEC
- Pitfalls: HIGH — magic-card listener absence and missing reduced-motion guard verified by reading current files

**Research date:** 2026-06-16
**Valid until:** 2026-07-16 (stable — no fast-moving dependencies; copy source is frozen)
