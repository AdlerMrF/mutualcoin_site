# Phase 1: Foundation + Shell + Hero — Pattern Map

**Mapeado:** 2026-06-16
**Arquivos analisados:** 8 arquivos a criar nesta fase
**Análogos encontrados:** 8 / 8

---

## File Classification

| Arquivo a criar | Role | Data Flow | Análogo mais próximo | Qualidade |
|-----------------|------|-----------|----------------------|-----------|
| `index.html` | entry/template | request-response | `../lp-otc-mutual/index.html` | exact |
| `index.js` | entry/controller | event-driven | `../lp-otc-mutual/index.js` | exact |
| `src/assets/css/styles.css` | utility/config | — | `../lp-otc-mutual/src/assets/css/styles.css` | exact |
| `tailwind.config.js` | config | — | `../lp-mutual-capital/tailwind.config.js` | exact |
| `postcss.config.js` | config | — | `../lp-mutual-capital/postcss.config.js` (referenciado em STACK.md) | role-match |
| `vite.config.js` | config | — | `../lp-otc-mutual/vite.config.js` | exact |
| `package.json` | config | — | `../lp-mutual-capital/package.json` (via STACK.md) | role-match |
| `src/assets/img/favicon.ico` | asset | — | `../lp-mutual-capital/favicon.ico` | exact (copiar) |

---

## Pattern Assignments

### `index.html` (entry/template, request-response)

**Análogo:** `../lp-otc-mutual/index.html`

**Padrão de imports/head** (linhas 1–15):
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mutual Advisory — Inteligência Patrimonial Global</title>
  <link rel="stylesheet" href="./src/assets/css/styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="icon" href="./src/assets/img/favicon.ico">
</head>
```

> **Diferença Advisory vs OTC:** NÃO incluir CDN `<script src="gsap.min.js">` no head — GSAP é npm package importado via `index.js`. NÃO incluir splash screen (não existe em Advisory fase 1). Adicionar `<link rel="preconnect" href="https://fonts.googleapis.com">` antes do link de fontes para performance.

**Padrão de body + estrutura geral** (linhas 17–20 + estrutura):
```html
<body class="bg-[#0C1220] overflow-x-hidden">
  <!-- Authority bar (SHL-01) -->
  <div id="authority-bar" ...></div>
  <!-- Navbar (SHL-02) -->
  <header id="navbar-header" class="fixed top-0 left-0 right-0 z-50">...</header>
  <!-- Hero (SEC-01) -->
  <main>
    <section id="hero" ...>...</section>
    <!-- Placeholders para Fases 2-4 (manter IDs para âncoras) -->
    <section id="solutions"></section>
    <section id="profiles"></section>
    <section id="icp"></section>
    <section id="jurisdictions"></section>
    <section id="technology"></section>
    <section id="how"></section>
    <section id="contact"></section>
  </main>
  <!-- Footer (SHL-04) -->
  <footer aria-label="Site footer">...</footer>
  <!-- Floating CTA (SHL-05) -->
  <div id="float-cta" ...></div>
  <!-- JS module -->
  <script type="module" src="./index.js"></script>
</body>
```

**Padrão de navbar pill — markup** (linhas 146–219 do OTC):
```html
<header id="navbar-header" class="fixed top-0 left-0 right-0 z-50">
  <div id="navbar-wrapper" class="flex items-stretch w-full"
    style="transition: padding 380ms cubic-bezier(0.4,0,0.2,1), background 380ms cubic-bezier(0.4,0,0.2,1);">

    <div id="navbar-left" class="flex-1 min-w-0"
      style="transition: opacity 380ms cubic-bezier(0.4,0,0.2,1);"></div>

    <div id="navbar-center" class="shrink-0 w-full border border-transparent overflow-hidden"
      style="max-width:1280px; border-radius:0;
             transition: max-width 380ms cubic-bezier(0.4,0,0.2,1),
                         border-radius 380ms cubic-bezier(0.4,0,0.2,1),
                         background 380ms cubic-bezier(0.4,0,0.2,1),
                         box-shadow 380ms cubic-bezier(0.4,0,0.2,1),
                         border-color 380ms cubic-bezier(0.4,0,0.2,1);">
      <div id="navbar-inner" class="flex items-center justify-between pl-6 sm:pl-8 lg:pl-10 pr-4"
        style="height:88px; transition: height 380ms cubic-bezier(0.4,0,0.2,1);">
        <!-- Logo | Nav links | Lang toggle | CTA | Hamburger -->
      </div>
    </div>

    <div id="navbar-right" class="flex-1 min-w-0"
      style="transition: opacity 380ms cubic-bezier(0.4,0,0.2,1);"></div>
  </div>
  <!-- Mobile dropdown -->
  <div id="mobile-menu" class="hidden absolute left-0 right-0 top-full px-4 pb-2">
    <div class="rounded-2xl border border-[#1B2A46] bg-[#0E162E]/95 backdrop-blur-md shadow-2xl overflow-hidden">
      <nav class="flex flex-col p-2">
        <!-- links mobile -->
        <a href="..." class="mobile-menu-link px-4 py-3 rounded-xl text-[15px] font-medium text-[#8898C0] hover:text-[#EEF1F9] transition-colors">...</a>
      </nav>
    </div>
  </div>
</header>
```

> **Diferença Advisory:** Logo é textual (não `<img>`). Inserir authority-bar acima do header, não dentro dele. Altura do inner começa em 88px mas o authority-bar (~36px) está acima, logo o hero precisa de `pt-32 sm:pt-36 lg:pt-44` para compensar ambos.

**Logo textual Advisory (D-09)** — não existe em OTC; padrão definido em UI-SPEC:
```html
<a href="#" id="navbar-logo" class="flex flex-col leading-tight">
  <span class="text-[18px] font-semibold text-[#EEF1F9] tracking-[-0.02em]">
    Mutual <em class="text-[#FCB71B] not-italic">Advisory</em>
  </span>
  <span class="text-[11px] text-[#8898C0] font-medium tracking-[0.06em]">
    Inteligência Patrimonial Global
  </span>
</a>
```

**Padrão de hero blobs de fundo** (linhas 224–230 do OTC):
```html
<div class="pointer-events-none absolute inset-0 z-0">
  <div class="hero-blob-1 absolute top-1/4 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-[#1E3490]/12 blur-[100px]"></div>
  <div class="hero-blob-2 absolute top-1/3 left-1/4 h-[300px] w-[400px] rounded-full bg-[#FCB71B]/6 blur-[80px]"></div>
</div>
```

> **Diferença Advisory:** Classes `hero-blob-1` e `hero-blob-2` adicionadas como hooks para GSAP parallax (D-08). OTC usa blobs no canto direito; Advisory usa blobs centrais. Sem imagem de dashboard — herói em coluna única com max-w-[760px].

**Padrão mobile menu button** (linhas 186–194 do OTC):
```html
<button id="mobile-menu-button" aria-label="Abrir menu" aria-expanded="false" aria-controls="mobile-menu"
  class="md:hidden p-2 ml-1 rounded-full text-[#EEF1F9] hover:bg-[#152038] transition-colors">
  <svg id="icon-menu" ...><!-- hamburger icon --></svg>
  <svg id="icon-close" class="hidden" ...><!-- X icon --></svg>
</button>
```

**Padrão footer estrutura** (linhas 742–860 do OTC):
```html
<footer aria-label="Site footer" class="bg-[#080E1A] border-t border-[#1B2A46]">
  <div class="flex items-stretch w-full">
    <div class="flex-1 bg-[#080E1A] min-w-0"></div>
    <div class="w-full max-w-[1250px] bg-[#080E1A] shrink-0">
      <div class="px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8">
        <div class="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <!-- Brand block -->
          <div class="flex flex-col gap-4 lg:w-[240px] shrink-0">
            <!-- Logo textual + descrição -->
          </div>
          <!-- Nav grid 4 colunas -->
          <div class="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <!-- Soluções | Perfis | [col3] | Legal e Grupo -->
          </div>
        </div>
        <!-- Bottom bar -->
        <div class="mt-6 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-[#1B2A46]/50">
          <p class="text-[12px] text-[#8898C0]/70">© 2025–2026 Mutual Advisory ...</p>
          <!-- Links rápidos -->
        </div>
      </div>
      <!-- Disclaimer block -->
      <div class="border-t border-[#1B2A46]/30 py-6 px-4 sm:px-6 lg:px-8">
        <p class="text-[12px] text-[#8898C0]/50 leading-[1.65]">...</p>
      </div>
    </div>
    <div class="flex-1 bg-[#080E1A] min-w-0"></div>
  </div>
</footer>
```

> **Diferença Advisory:** Background do footer é `bg-[#080E1A]` (2 tons mais escuro que `--dark-bg`). OTC usa `bg-[#060A18]` e estilização com `rgba(255,255,255,0.x)` inline — Advisory pode usar classes Tailwind + CSS vars. O footer bottom bar do Advisory é `bg-[#050A14]`.

**Padrão floating CTA** — nenhum análogo direto em OTC html (a lógica vive em JS). Markup definido em UI-SPEC §5:
```html
<div id="float-cta" aria-label="Iniciar conversa" class="fixed bottom-7 right-7 z-[200]"
  style="opacity:0; transform:translateY(12px); pointer-events:none;">
  <a href="#contact"
    class="flex items-center gap-2.5 bg-[#0C1220] text-[#EEF1F9] px-5 py-3 rounded-full text-[13px] font-bold tracking-[0.06em] uppercase no-underline border border-[#FCB71B]/25 shadow-[0_4px_24px_rgba(0,0,0,0.35)] hover:bg-[#111D35] transition-colors duration-200">
    <span class="w-2 h-2 rounded-full bg-[#FCB71B] flex-shrink-0"></span>
    Iniciar Conversa
  </a>
</div>
```

---

### `index.js` (entry/controller, event-driven)

**Análogo primário:** `../lp-otc-mutual/index.js`
**Análogo secundário:** `../lp-mutual-capital/index.js`

**Padrão de imports** (linhas 68, lp-otc-mutual/index.js):
```javascript
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './src/assets/css/styles.css';
```

> **Diferença Advisory:** lp-otc-mutual importa apenas `lenis` (sem import do CSS neste arquivo). lp-mutual-capital importa `'./assets/css/styles.css'` no topo. Advisory usa GSAP como npm package — adicionar import de gsap e ScrollTrigger. O import do CSS deve estar no topo do index.js (padrão do lp-mutual-capital linha 1).

**Padrão Lenis init + RAF loop** (linhas 67–79 do OTC):
```javascript
import Lenis from 'lenis';

const lenis = new Lenis({
  lerp: 0.1,
  smoothWheel: true,
});

function lenisRaf(time) {
  lenis.raf(time);
  requestAnimationFrame(lenisRaf);
}
requestAnimationFrame(lenisRaf);
```

> **Diferença Advisory:** Após init do Lenis, adicionar a integração GSAP/Lenis para que ScrollTrigger use o scroll do Lenis:
```javascript
// Bind GSAP ticker ao Lenis (co-op necessário)
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);
// NÃO usar o lenisRaf/requestAnimationFrame separado quando usando gsap.ticker
```

**Padrão navbar pill — lógica JS** (linhas 96–140 do OTC):
```javascript
const navWrapper = document.getElementById('navbar-wrapper');
const navLeft    = document.getElementById('navbar-left');
const navCenter  = document.getElementById('navbar-center');
const navRight   = document.getElementById('navbar-right');
const navInner   = document.getElementById('navbar-inner');

let rafId = null;
let prevScrolled = null;

function applyNavState(scrolled) {
  if (scrolled === prevScrolled) return;
  prevScrolled = scrolled;

  if (navWrapper) navWrapper.style.padding = scrolled ? '12px 16px 0' : '0';
  if (navLeft)    navLeft.style.opacity    = scrolled ? '0' : '1';
  if (navRight)   navRight.style.opacity   = scrolled ? '0' : '1';
  if (navCenter) {
    navCenter.style.maxWidth       = scrolled ? '860px'               : '1280px';
    navCenter.style.borderRadius   = scrolled ? '9999px'              : '0';
    navCenter.style.background     = scrolled ? 'rgba(11,16,32,0.82)' : 'transparent';
    navCenter.style.backdropFilter = scrolled ? 'blur(20px) saturate(1.4)' : 'none';
    navCenter.style.boxShadow      = scrolled ? '0 4px 30px rgba(0,0,0,0.35)' : 'none';
    navCenter.style.borderColor    = scrolled ? 'rgba(27,42,70,0.7)'  : 'transparent';
  }
  if (navInner) {
    navInner.style.height = scrolled
      ? (window.innerWidth < 768 ? '58px' : '64px')
      : (window.innerWidth < 768 ? '68px' : '88px');
  }
}

window.addEventListener('scroll', () => {
  if (rafId) return;
  rafId = requestAnimationFrame(() => { rafId = null; applyNavState(window.scrollY > 80); });
}, { passive: true });

window.addEventListener('resize', () => applyNavState(window.scrollY > 80), { passive: true });
applyNavState(false);
```

> **Diferença Advisory:** Os valores exatos de `maxWidth`, `background` e `borderRadius` diferem dos do OTC (que usa `1150px` e `1rem`). Advisory usa os valores spec do UI-SPEC: `860px`, `rgba(11,16,32,0.82)`, `9999px`. A lógica de RAF e prevScrolled é idêntica — copiar a estrutura, ajustar os valores.

**Padrão anchor smooth-scroll via Lenis** (linhas 81–94 do OTC):
```javascript
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    closeMobileMenu();
    const navHeight = document.getElementById('navbar-inner')?.offsetHeight ?? 88;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
    lenis.scrollTo(top, { duration: 0.9 });
  });
});
```

> **Diferença Advisory:** Para âncoras de navbar durante estado expandido (sem scroll), o offset deve considerar também a authority-bar (~36px). Adicionar: `const authorityH = document.getElementById('authority-bar')?.offsetHeight ?? 36;` e somar no offset total.

**Padrão mobile menu toggle** (linhas 142–168 do OTC):
```javascript
const mobileMenuBtn = document.getElementById('mobile-menu-button');
const mobileMenu    = document.getElementById('mobile-menu');
const iconMenu      = document.getElementById('icon-menu');
const iconClose     = document.getElementById('icon-close');
const mobileLinks   = document.querySelectorAll('.mobile-menu-link');
let menuOpen = false;

function openMobileMenu() {
  menuOpen = true;
  mobileMenu.classList.remove('hidden');
  iconMenu.classList.add('hidden');
  iconClose.classList.remove('hidden');
  mobileMenuBtn.setAttribute('aria-expanded', 'true');
}

function closeMobileMenu() {
  menuOpen = false;
  mobileMenu.classList.add('hidden');
  iconMenu.classList.remove('hidden');
  iconClose.classList.add('hidden');
  mobileMenuBtn.setAttribute('aria-expanded', 'false');
}

mobileMenuBtn.addEventListener('click', () => menuOpen ? closeMobileMenu() : openMobileMenu());
mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));
window.addEventListener('scroll', () => { if (menuOpen) closeMobileMenu(); }, { passive: true });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) closeMobileMenu(); });
```

> **Diferença Advisory:** OTC não tem `aria-expanded` nem `Escape` key — Advisory DEVE adicionar ambos (UI-SPEC §Accessibility). Copiar estrutura do OTC e adicionar os dois.

**Padrão GSAP hero timeline** — não existe em OTC (usa CSS keyframes). Advisory usa GSAP (UI-SPEC §Motion Contract):
```javascript
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // 1. Lenis init + GSAP ticker (ver padrão acima)

  // 2. Hero entrance timeline
  const heroTl = gsap.timeline({ delay: 0.1 });
  heroTl
    .from('.hero-badge',     { opacity: 0, y: 28, filter: 'blur(8px)', duration: 0.6, ease: 'circ.out' })
    .from('.hero-title',     { opacity: 0, y: 28, filter: 'blur(8px)', duration: 0.7, ease: 'circ.out' }, '-=0.44')
    .from('.hero-sub',       { opacity: 0, y: 20,                      duration: 0.6, ease: 'power2.out' }, '-=0.44')
    .from('.hero-legal-note',{ opacity: 0, y: 16,                      duration: 0.5, ease: 'power2.out' }, '-=0.4')
    .from('.hero-ctas',      { opacity: 0, y: 16,                      duration: 0.6, ease: 'power2.out' }, '-=0.4')
    .from('.hero-auth > *',  { opacity: 0, y: 8,  duration: 0.5, ease: 'power2.out', stagger: 0.06 }, '-=0.3');

  // Hero blobs opacity
  gsap.from('.hero-blob-1, .hero-blob-2', { opacity: 0, duration: 1.2, ease: 'power2.out' });

  // 3. Authority bar hide + navbar pill via ScrollTrigger
  ScrollTrigger.create({
    trigger: 'body',
    start: 'top -60px',
    toggleActions: 'play none none reverse',
    onEnter: () => gsap.to('#authority-bar', { opacity: 0, y: -36, duration: 0.38, ease: 'power2.inOut', pointerEvents: 'none' }),
    onLeaveBack: () => gsap.to('#authority-bar', { opacity: 1, y: 0, duration: 0.38, ease: 'power2.inOut', pointerEvents: 'auto' })
  });

  ScrollTrigger.create({
    trigger: 'body',
    start: 'top -80px',
    onEnter: () => applyNavState(true),
    onLeaveBack: () => applyNavState(false)
  });

  // 4. Floating CTA
  ScrollTrigger.create({
    trigger: 'body',
    start: '600px top',
    onEnter:     () => gsap.to('#float-cta', { opacity: 1, y: 0,  duration: 0.3, ease: 'power2.out',  pointerEvents: 'auto' }),
    onLeaveBack: () => gsap.to('#float-cta', { opacity: 0, y: 12, duration: 0.2, ease: 'power2.in',   pointerEvents: 'none' })
  });

  // 5. Hero parallax blobs
  gsap.to('.hero-blob-1', {
    y: -40, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.hero-blob-2', {
    y: -20, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  // 6. Scroll-spy nav links
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  // ... IntersectionObserver ou ScrollTrigger onEnter/onLeave
});
```

> **Referência de migração:** ARCHITECTURE.md §Motion Migration Plan — tabela de equivalências IntersectionObserver → GSAP. O padrão RAF-based do OTC é substituído inteiramente por ScrollTrigger aqui.

**Padrão error handling silencioso** (ARCHITECTURE.md §Error Handling):
```javascript
// Guard todos os getElementById antes de usar
const navWrapper = document.getElementById('navbar-wrapper');
if (navWrapper) { /* ... */ }
// NÃO usar alerts ou console.error em produção
```

---

### `src/assets/css/styles.css` (utility/config)

**Análogo:** `../lp-otc-mutual/src/assets/css/styles.css`

**Padrão completo — portar verbatim** (linhas 1–218, com alterações indicadas):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  font-family: 'Montserrat', sans-serif;
  /* NÃO adicionar Inter — Advisory usa Montserrat exclusivamente (D-07) */
}

:root {
  --primary-color: #FCB71B;
  --primary-hover: #e5a618;
  --dark-bg: #0C1220;
  --hero-bg: #0E162E;
  --card-bg: #111D35;
  --border: #1B2A46;
  --text-heading: #EEF1F9;
  --text-muted: #8898C0;
  --brand-blue: #1E3490;
  --cyan: #11CFFA;
}

body {
  background-color: var(--dark-bg);
}
```

**Scrollbar** (linhas 26–38 do OTC — portar verbatim):
```css
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #1B2A46; border-radius: 999px; }
::-webkit-scrollbar-thumb:hover { background: #3556CD; }
```

**Magic card glow** (linhas 40–83 do OTC — portar verbatim):
```css
.magic-card { position: relative; isolation: isolate; }
.magic-card::before {
  content: '';
  position: absolute; inset: 0; border-radius: inherit;
  background: radial-gradient(700px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(30,52,144,0.12), transparent 55%);
  z-index: 1; pointer-events: none;
}
.magic-card::after {
  content: '';
  position: absolute; inset: 0; border-radius: inherit;
  border: 1px solid transparent;
  background: radial-gradient(400px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(80,110,220,0.95), rgba(27,42,70,0.25) 70%) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out; mask-composite: exclude;
  z-index: 3; pointer-events: none;
}
.magic-card > * { position: relative; z-index: 2; }
```

**Utilitários de texto e gradiente** (linhas 85–119 do OTC — portar verbatim):
```css
.shine-text {
  background: linear-gradient(135deg, #a8c0ff 0%, #1E3490 50%, #11CFFA 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.gradient-bg { background: linear-gradient(135deg, #FCB71B 0%, #e5a618 100%); }
.gradient-text {
  background: linear-gradient(135deg, #a8c0ff 0%, #1E3490 50%, #11CFFA 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.card-hover { transition: all 0.3s ease; }
.card-hover:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(252,183,27,0.2); }
.feature-icon { transition: all 0.3s ease; }
.card-hover:hover .feature-icon { transform: scale(1.1); }
```

**Fade-in fallback** (linhas 173–183 do OTC — manter como fallback se GSAP falhar):
```css
.fade-in { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
.fade-in.visible { opacity: 1; transform: translateY(0); }
```

**REMOVER do CSS** (Advisory substitui por GSAP):
- `.hero-badge`, `.hero-title`, `.hero-sub`, `.hero-ctas`, `.hero-dash` com `animation: heroEnter ...` — substituídos por GSAP timeline
- `@keyframes heroEnter` — obsoleto
- `.hero-image { animation: float ... }` — Advisory não tem imagem no hero
- `@keyframes float` — não usado na Fase 1

**MANTER do CSS** (útil para Fases 2+):
- `.plat-item`, `.plat-widget`, `.plat-item.plat-visible`, `.plat-widget.plat-visible`
- `.animate-fade-in` + `@keyframes fadeIn`
- `.magic-card`, `.card-hover`, `.fade-in`

---

### `tailwind.config.js` (config)

**Análogo:** `../lp-mutual-capital/tailwind.config.js`

**Padrão base** (linhas 1–19):
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './index.js',
    './src/**/*.{js,html}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg':      '#0C1220',
        'hero-bg':      '#0E162E',
        'card-bg':      '#111D35',
        'border-color': '#1B2A46',
        'heading':      '#EEF1F9',
        'muted':        '#8898C0',
        'gold':         '#FCB71B',
        'gold-hover':   '#e5a618',
        'brand-blue':   '#1E3490',
        'cyan':         '#11CFFA',
      }
    }
  },
  plugins: [],
}
```

> **Diferença Advisory:** lp-mutual-capital usa cores de produto (primary `#1235F2`, secondary `#19CCA2`). Advisory usa a paleta dark navy — substituir todas as cores da extensão pelas 10 vars do design system consolidado. O `content` do Advisory adiciona `./src/**/*.{js,html}` além do padrão.

---

### `postcss.config.js` (config)

**Análogo:** padrão do grupo (referenciado em STACK.md §Configuration). Arquivo simples, padrão único no ecossistema:

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

### `vite.config.js` (config)

**Análogo:** `../lp-otc-mutual/vite.config.js` — portar verbatim (linhas 1–10):

```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true,
    allowedHosts: [
      '.trycloudflare.com',
    ],
  }
})
```

---

### `package.json` (config)

**Análogo:** STACK.md §package.json — definição canônica do stack-alvo:

```json
{
  "name": "lp-mutual-advisory",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
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

> **Diferença Advisory vs OTC:** OTC não tem `gsap` como dep npm (usa CDN). Advisory instala gsap como npm package para poder importar `ScrollTrigger` como módulo. lp-mutual-capital tem `Chart.js` como dep — Advisory NÃO inclui (não usa gráficos na Fase 1).

---

### `src/assets/img/favicon.ico` (asset)

**Análogo:** `../lp-mutual-capital/favicon.ico` — copiar binário diretamente.

Nenhum código a extrair — é uma cópia de arquivo. Referenciado no `<head>` como:
```html
<link rel="icon" href="./src/assets/img/favicon.ico">
```

---

## Shared Patterns

### 1. CSS Variables (:root)

**Fonte:** `../lp-otc-mutual/src/assets/css/styles.css` linhas 9–19
**Aplicar em:** `src/assets/css/styles.css`

```css
:root {
  --primary-color: #FCB71B;
  --primary-hover: #e5a618;
  --dark-bg: #0C1220;
  --hero-bg: #0E162E;
  --card-bg: #111D35;
  --border: #1B2A46;
  --text-heading: #EEF1F9;
  --text-muted: #8898C0;
  --brand-blue: #1E3490;
  --cyan: #11CFFA;
}
```

Portar verbatim. Acrescentar `--cyan` (não estava no OTC original, mas está no CONVENTIONS.md).

---

### 2. Navbar Pill — Padrão de IDs e Transições CSS

**Fonte:** `../lp-otc-mutual/index.html` linhas 146–219, `../lp-otc-mutual/index.js` linhas 96–140
**Aplicar em:** `index.html` (markup) + `index.js` (lógica)

IDs canônicos do grupo para a navbar:
- `#navbar-header` — `<header>` fixo
- `#navbar-wrapper` — div externa com padding transition
- `#navbar-left`, `#navbar-right` — colunas laterais que somem (opacity → 0)
- `#navbar-center` — pill que anima (max-width, border-radius, background, blur, box-shadow, border-color)
- `#navbar-inner` — row interna com height transition
- `#navbar-logo` — logo (opacity 0 → 1 após splash; Advisory: sem splash, iniciar em opacity:1)
- `#mobile-menu-button`, `#icon-menu`, `#icon-close`, `#mobile-menu` — mobile

Transition inline obrigatória no `#navbar-center`:
```
transition: max-width 380ms cubic-bezier(0.4,0,0.2,1),
            border-radius 380ms cubic-bezier(0.4,0,0.2,1),
            background 380ms cubic-bezier(0.4,0,0.2,1),
            box-shadow 380ms cubic-bezier(0.4,0,0.2,1),
            border-color 380ms cubic-bezier(0.4,0,0.2,1)
```

---

### 3. Lenis Init + GSAP Ticker Integration

**Fonte:** `../lp-otc-mutual/index.js` linhas 67–79 (base Lenis) + ARCHITECTURE.md §Motion Migration
**Aplicar em:** `index.js` (bloco de init, antes de qualquer ScrollTrigger)

```javascript
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, duration: 1.2 });

// Co-op GSAP/Lenis: GSAP ticker drive o Lenis (não usar RAF separado)
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// Proxy para ScrollTrigger saber do scroll suave do Lenis
ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value) {
    if (arguments.length) { lenis.scrollTo(value, { immediate: true }); }
    return lenis.scroll;
  },
  getBoundingClientRect() {
    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
  }
});
lenis.on('scroll', ScrollTrigger.update);
```

**Anti-pattern:** NÃO adicionar `scroll-behavior: smooth` no CSS — Lenis já gerencia (ARCHITECTURE.md §Anti-Patterns).

---

### 4. Anchor Smooth-Scroll via Lenis

**Fonte:** `../lp-otc-mutual/index.js` linhas 81–94
**Aplicar em:** `index.js`

```javascript
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    closeMobileMenu();
    const navHeight = document.getElementById('navbar-inner')?.offsetHeight ?? 64;
    lenis.scrollTo(target, { offset: -(navHeight + 8), duration: 0.9 });
  });
});
```

---

### 5. Error Handling Silencioso

**Fonte:** `../lp-otc-mutual/index.js` (padrão implícito) + ARCHITECTURE.md §Error Handling
**Aplicar em:** `index.js` — todos os seletores DOM

```javascript
// Padrão: null-guard antes de qualquer operação em elemento DOM
const navWrapper = document.getElementById('navbar-wrapper');
if (navWrapper) {
  navWrapper.style.padding = scrolled ? '12px 16px 0' : '0';
}
// NÃO: navWrapper.style.padding = ... (sem guard → TypeError se ausente)
```

---

### 6. Scroll-Spy de Nav Links

**Fonte:** UI-SPEC §Navbar Scroll-Spy — não existe implementação direta nos análogos.
**Padrão recomendado (GSAP, alinhado com ARCHITECTURE.md):**

```javascript
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

sections.forEach(section => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top 40%',
    end: 'bottom 40%',
    onEnter: () => setActiveLink(`#${section.id}`),
    onEnterBack: () => setActiveLink(`#${section.id}`)
  });
});

function setActiveLink(href) {
  navLinks.forEach(link => {
    link.classList.toggle('nav-link-active', link.getAttribute('href') === href);
  });
}
```

Active class CSS: `text-[#FCB71B] font-semibold` (via classe `.nav-link-active` no Tailwind ou styles.css).

---

## No Analog Found

Nenhum arquivo desta fase ficou sem análogo. Todos os 8 arquivos têm base concreta nas LPs irmãs.

| Arquivo | Observação |
|---------|------------|
| Floating CTA (HTML) | Markup do UI-SPEC é canônico; padrão JS análogo ao scroll listener do OTC |
| GSAP hero timeline | Padrão novo (Advisory é primeira LP do grupo com GSAP npm); ver ARCHITECTURE.md §Motion Migration |
| Scroll-spy nav | Padrão novo; ambas LPs irmãs não implementam scroll-spy |
| Authority bar | Componente novo no grupo; sem análogo — usar especificação direta do UI-SPEC §1 |

---

## Metadata

**Escopo de busca de análogos:** `../lp-otc-mutual/` + `../lp-mutual-capital/` + `.planning/codebase/`
**Arquivos lidos:** 9 arquivos (index.html, index.js, styles.css de OTC; index.js, tailwind.config.js de Capital; vite.config.js de OTC; CONVENTIONS.md, ARCHITECTURE.md, STACK.md, STRUCTURE.md internos)
**Data de extração de padrões:** 2026-06-16

### Resumo de diferenças Advisory vs análogos

| Aspecto | lp-otc-mutual (base) | lp-mutual-advisory (target) |
|---------|---------------------|----------------------------|
| Splash screen | Sim (GSAP stroke-draw) | Não na Fase 1 |
| Logo | `<img>` SVG externa | Textual `<em>` gold (D-09) |
| GSAP | CDN no head | npm package importado no index.js |
| Motion engine | CSS keyframes + RAF + IntersectionObserver | GSAP + ScrollTrigger (ARCHITECTURE.md §Migration) |
| `#navbar-logo` opacity | Começa em 0 (splash faz 0→1) | Começa em 1 (sem splash) |
| Hero layout | Coluna esquerda + imagem direita | Coluna única centrada (D-07) |
| Hero dashboard image | Sim (`.hero-image` float) | Não (D-06 — sem imagem) |
| Authority bar | Não existe | Sim (SHL-01, hide on scroll) |
| Scroll-spy | Não implementado | Sim (UI-SPEC §Navbar) |
| Inter font | Opcional em algumas seções | Não — Montserrat exclusivamente (D-07) |
| navbar-center pill maxWidth | `1150px` | `860px` (UI-SPEC §Navbar State B) |
| navbar-center scrolled bg | `rgba(14,22,46,0.95)` | `rgba(11,16,32,0.82)` (UI-SPEC) |
| CSS keyframes `heroEnter` | Sim | Removido — GSAP timeline substitui |
| Floating CTA | Não presente no HTML | Sim (SHL-05, ScrollTrigger) |
